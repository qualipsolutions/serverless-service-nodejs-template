import middy from '@middy/core';
import validator from '@middy/validator';
import invoker from './handlerInvoke';

const validate = async (inputSchema, inputData) => {
  const handler = middy(async (e, context) => e);
  handler.use(
    validator({
      inputSchema,
    })
  );
  // invokes the handler, note that property foo is missing
  const body = await invoker(handler, inputData);
  return body;
};

export default validate;
