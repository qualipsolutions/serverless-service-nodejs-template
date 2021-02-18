import dbconnect from '../../infra/database';
import commonMiddleware from '../../lib/commonMiddleware';
import * as userRepository from '../../repositories/user';

// eslint-disable-next-line no-unused-vars
async function handlerFunction(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  await dbconnect();

  const userId = event.requestContext.authorizer.principalId;
  const results = await userRepository.patch(userId, event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({ data: results }),
  };
}

export const handler = commonMiddleware(handlerFunction);
