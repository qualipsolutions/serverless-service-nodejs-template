// import validator from 'validator';
import createError from 'http-errors';
import User from '../models/user';

const getOwnerId = (user) => {
  let ownerUserId = user._id;
  if (user.ownerUserId) {
    ownerUserId = user.ownerUserId;
  }
  return ownerUserId;
};

const isOwner = (user) =>
  user.ownerUserId === undefined || user.ownerUserId === null;

const emailCheck = async (email) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new createError.BadRequest('Email already exists');
  }
  return false;
};

const usernameCheck = async (username) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new createError.BadRequest('Username already exists');
  }
  return false;
};

const findById = async (userId) => {
  const user = await User.findOne({
    _id: userId,
  });
  if (!user) {
    throw new createError.NotFound('User not found');
  }
  return user;
};

const logout = async (userId, token) => {
  const user = await findById(userId);
  if (!token) {
    user.tokens = [];
  } else {
    user.tokens = user.tokens.filter((t) => t.token !== token);
  }
  await user.save();
  return user;
};

const login = async (reqBody) => {
  const { email, password } = reqBody;
  const user = await User.findByCredentials(email, password);
  const token = await user.generateAuthToken();
  return { user, token };
};

const remove = async (userId) => {
  const user = await findById(userId);
  await user.remove();
};

const patch = async (userId, reqBody) => {
  const user = await findById(userId);
  let allowedUpdates = ['photoUrl', 'organisationName', 'active'];

  if (!isOwner(user)) {
    // organisationName should only be changed by the owner user
    allowedUpdates = allowedUpdates.filter((i) => i !== 'organisationName');
  }

  allowedUpdates.forEach((update) => {
    /* istanbul ignore else */
    if (reqBody[update] !== undefined) {
      user[update] = reqBody[update];
    }
  });
  await user.save();

  return user;
};

const signUp = async (reqBody) => {
  const {
    ownerUserId,
    photoUrl,
    organisationName,
    username,
    email,
    password,
  } = reqBody;

  await emailCheck(email);
  await usernameCheck(username);

  if (ownerUserId) {
    throw new createError.BadRequest('Operation not allowed for member users');
  }

  const user = new User({
    photoUrl,
    organisationName,
    username,
    email,
    password,
    role: 'Owner',
    active: true,
  });
  await user.save();
  const token = await user.generateAuthToken();
  return { user, token };
};

/**
 * Creates a child user under the owner user.
 */
const memberSignUp = async (userId, reqBody) => {
  const { photoUrl, username, email, password } = reqBody;

  await emailCheck(email);
  await usernameCheck(username);

  const ownerUser = await findById(userId);
  const ownerUserId = getOwnerId(ownerUser);

  const { organisationName } = ownerUser;

  const body = {
    photoUrl,
    organisationName,
    username,
    email,
    password,
    role: 'TeamMember',
    active: true,
    ownerUserId,
  };

  const user = new User(body);
  await user.save();
  const token = await user.generateAuthToken();
  return { user, token };
};

export {
  emailCheck,
  usernameCheck,
  getOwnerId,
  login,
  logout,
  signUp,
  memberSignUp,
  findById,
  patch,
  remove,
};
