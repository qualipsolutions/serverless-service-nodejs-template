import validator from '@middy/validator';
import dbconnect from '../../infra/database';
import commonMiddleware from '../../lib/commonMiddleware';
import * as userRepository from '../../repositories/user';

async function handlerFunction(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  await dbconnect();

  const results = await userRepository.signUp(event.body);

  return {
    statusCode: 201,
    body: JSON.stringify({ data: results }),
  };
}

const schema = {
  properties: {
    body: {
      type: 'object',
      properties: {
        photoUrl: {
          type: 'string',
        },
        organisationName: {
          type: 'string',
        },
        username: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
      required: ['organisationName', 'username', 'email', 'password'],
    },
  },
  required: ['body'],
};

export const handler = commonMiddleware(handlerFunction).use(
  validator({ inputSchema: schema })
);
