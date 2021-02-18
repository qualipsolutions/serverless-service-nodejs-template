import dbconnect from '../../infra/database';
import commonMiddleware from '../../lib/commonMiddleware';
import * as userRepository from '../../repositories/user';

async function handlerFunction(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  await dbconnect();

  const results = await userRepository.login(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({ data: results }),
  };
}

export const handler = commonMiddleware(handlerFunction);
