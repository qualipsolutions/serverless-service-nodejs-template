// import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import validator from '@middy/validator';
import createError from 'http-errors';
import mime from 'mime';
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

  const userId = event.requestContext.authorizer.principalId;
  const { email } = await userRepository.findById(userId);

  const { uploadType, fileName, subFolder } = event.body;
  const fileMetadata = {
    uploadType,
    fileName,
    subFolder,
  };

  const contentType = mime.getType(fileName);
  if (!contentType) {
    throw new createError.BadRequest(
      'Invalid content type for file name:',
      fileName
    );
  }

  // Create the PutObjectRequest that will be embedded in the signed URL
  const s3PutObjectRequest = {
    Bucket: process.env.UPLOAD_BUCKET_NAME,
    Key: `${email}/${subFolder}/${fileName}`,
    ContentType: contentType,
    CacheControl: 'max-age=31557600', // instructs CloudFront to cache for 1 year
    // Set Metadata fields to be retrieved by post-upload event
    Metadata: {
      ...fileMetadata,
      userId,
    },
  };
  // Get the signed URL from S3 and return to client
  const s3PutObjectUrl = await s3.getSignedUrlPromise(
    'putObject',
    s3PutObjectRequest
  );
  const result = {
    userId,
    s3PutObjectUrl,
  };

  return {
    statusCode: 200,
    body: JSON.stringify({ data: result }),
  };
}

const schema = {
  properties: {
    body: {
      type: 'object',
      properties: {
        uploadType: {
          type: 'string',
        },
        subFolder: {
          type: 'string',
        },
        fileName: {
          type: 'string',
        },
      },
      required: ['uploadType', 'subFolder', 'fileName'],
    },
  },
  required: ['body'],
};

export const handler = commonMiddleware(handlerFunction).use(
  validator({ inputSchema: schema })
);
