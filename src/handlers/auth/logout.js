import dbconnect from '../../infra/database';
import commonMiddleware from '../../lib/commonMiddleware';
import * as userRepository from '../../repositories/user';

async function handlerFunction(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  await dbconnect();

  const userId = event.requestContext.authorizer.principalId;
  await userRepository.logout(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

export const handler = commonMiddleware(handlerFunction);
