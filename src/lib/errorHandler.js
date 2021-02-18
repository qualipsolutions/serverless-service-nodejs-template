const middleware = (opts) => {
  const defaults = {
    logger: console.error,
  };

  const options = { ...defaults, ...opts };

  return {
    onError: (handler, next) => {
      const statusCode =
        handler.error.statusCode === undefined ? 500 : handler.error.statusCode;
      const { message, details } = handler.error;

      if (statusCode && message) {
        console.log({ message });
        if (typeof options.logger === 'function') {
          // The if statement is here to avoid too much clutter when running my unit tests
          if (process.env.STAGE !== 'test') {
            options.logger(JSON.stringify(handler.error));
          }
        }

        // eslint-disable-next-line no-param-reassign
        handler.response = {
          statusCode,
          body: JSON.stringify({ message, details }),
        };

        return next();
      }

      return next(handler.error);
    },
  };
};

export default middleware;
