import createError from 'http-errors';
import dbconnect from '../../infra/database';
import commonMiddleware from '../../lib/commonMiddleware';
import User from '../../models/user';

// eslint-disable-next-line no-unused-vars
async function handlerFunction(event, context) {
  if (process.env.STAGE !== 'test') {
    throw new createError.BadRequest(
      'Operation only allowed on test or dev stage'
    );
  }

  context.callbackWaitsForEmptyEventLoop = false;
  await dbconnect();

  // clear collections
  await User.deleteMany();

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

export const handler = commonMiddleware(handlerFunction);
