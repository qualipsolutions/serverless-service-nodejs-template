import AWS from 'aws-sdk';
import createError from 'http-errors';
import dbconnect from '../../infra/database';
import commonMiddleware from '../../lib/commonMiddleware';
import * as userRepository from '../../repositories/user';

AWS.config.update({
  region: process.env.REGION,
});

const s3 = new AWS.S3();

// eslint-disable-next-line no-unused-vars
async function handlerFunction(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  await dbconnect();

  console.log('event:', JSON.stringify(event));
  const s3Record = event.Records[0].s3;

  const key = decodeURIComponent(s3Record.object.key);
  const bucket = s3Record.bucket.name;
  const keyEncoded = s3Record.object.key;

  // Get the metadata
  const s3Object = await s3.headObject({ Bucket: bucket, Key: key }).promise();
  if (!s3Object.Metadata) {
    throw new createError.BadRequest('File metadata not found');
  }
  const { userid, uploadtype } = s3Object.Metadata;
  console.log('Processing upload:', uploadtype, 'key:', key);

  if (uploadtype === 'PROFILE_IMAGE') {
    const url = `https://s3-${process.env.REGION}.amazonaws.com/${bucket}/${keyEncoded}`;
    await userRepository.patch(userid, {
      photoUrl: url,
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

export const handler = commonMiddleware(handlerFunction);
