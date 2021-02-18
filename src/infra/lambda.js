import AWS from 'aws-sdk';
import createError from 'http-errors';

const lambda = new AWS.Lambda();

const lamdaFindByARN = (arn) =>
  new Promise((resolve, reject) => {
    const params = {
      FunctionName: arn,
    };
    lambda.getFunction(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

/** *
 * eventSourceArn:
 *  SQS => arn:aws:sqs:us-west-2:123456789012:my-queue
 */
const createEventSourceMapping = (functionName, eventSourceArn) =>
  new Promise((resolve, reject) => {
    const params = {
      BatchSize: 5,
      EventSourceArn: eventSourceArn,
      FunctionName: functionName,
    };
    lambda.createEventSourceMapping(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

const deleteEventSourceMapping = (uuid) =>
  new Promise((resolve, reject) => {
    const params = {
      UUID: uuid,
    };
    lambda.deleteEventSourceMapping(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

export { lamdaFindByARN, createEventSourceMapping, deleteEventSourceMapping };
