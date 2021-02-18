// import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import mongoose from 'mongoose';
import { roles } from './enums';

const userSchema = new mongoose.Schema(
  {
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    photoUrl: {
      type: String,
    },
    organisationName: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.matches(value, process.env.USERNAME_REGEX)) {
          throw new createError.BadRequest('Invalid username format');
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new createError.BadRequest('Invalid email address');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
    },
    passwordResetCode: {
      type: Number,
      required: true,
      default: 0,
    },
    role: {
      type: String,
      required: true,
      enum: roles,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  userObject.id = userObject._id;

  delete userObject._id;
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.passwordResetCode;
  delete userObject.__v;

  return userObject;
};

userSchema.methods.generateResetCode = async function () {
  const user = this;
  const min = 14689;
  const max = 99999;

  const code = Math.floor(Math.random() * (max - min) + min);

  user.passwordResetCode = code;
  await user.save();

  return code;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  // console.log(user.toJSON());
  const token = jwt.sign(
    { _id: user._id.toString(), user: user.toJSON() },
    process.env.PASSWORD_SECRET
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // eslint-disable-next-line no-use-before-define
  const user = await User.findOne({ email, active: true });

  if (!user) {
    throw new createError.BadRequest('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new createError.BadRequest('Invalid email or password');
  }

  // if this is a child user, check if the owner is active
  if (user.ownerUserId) {
    // eslint-disable-next-line no-use-before-define
    const ownerUser = await User.findOne({ _id: user.ownerUserId });
    if (!ownerUser) {
      throw new createError.BadRequest(
        'Unable to log you in. Please contact your system administrator.'
      );
    }
    if (!ownerUser.active) {
      throw new createError.BadRequest(
        'Unable to log you in. The owner user is inactive'
      );
    }
  }

  return user;
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre('remove', async function (next) {
  const user = this;
  // eslint-disable-next-line no-use-before-define
  await User.deleteMany({ ownerUserId: user._id });
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
