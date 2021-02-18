import validator from '@middy/validator';
import dbconnect from '../../infra/database';
import commonMiddleware from '../../lib/commonMiddleware';
import * as userRepository from '../../repositories/user';

async function handlerFunction(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  await dbconnect();

  const userId = event.requestContext.authorizer.principalId;
  const results = await userRepository.memberSignUp(userId, event.body);

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
      required: ['username', 'email', 'password'],
    },
  },
  required: ['body'],
};

export const handler = commonMiddleware(handlerFunction).use(
  validator({ inputSchema: schema })
);
