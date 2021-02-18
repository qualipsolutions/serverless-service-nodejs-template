import AWS from 'aws-sdk';
import createError from 'http-errors';

const sqs = new AWS.SQS();

const createQueue = (name) =>
  new Promise((resolve, reject) => {
    const params = {
      QueueName: name,
    };
    sqs.createQueue(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

const deleteQueue = (queueUrl) =>
  new Promise((resolve, reject) => {
    const params = {
      QueueUrl: queueUrl,
    };
    sqs.deleteQueue(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

const queueMessage = (queueUrl, messageBody) =>
  new Promise((resolve, reject) => {
    const params = {
      MessageBody: messageBody,
      QueueUrl: queueUrl,
    };
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

const queueUrlToARN = (queueUrl) => {
  const parts = queueUrl
    .replace('https://', '')
    .replace('.amazonaws.com', '')
    .split('/');
  const region = parts[0].replace('.', ':');

  return `arn:aws:${region}:${parts[1]}:${parts[2]}`;
};

export { createQueue, deleteQueue, queueMessage, queueUrlToARN };
