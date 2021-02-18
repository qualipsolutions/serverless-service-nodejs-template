import jwt from 'jsonwebtoken';
import middy from '@middy/core';
import User from '../../models/user';
import dbconnect from '../../infra/database';
import errorHandler from '../../lib/errorHandler';

const generatePolicy = (principalId, methodArn) => {
  const apiGatewayWildcard = `${methodArn.split('/', 2).join('/')}/*`;

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: apiGatewayWildcard,
        },
      ],
    },
  };
};
const generateDenyPolicy = (errorMessage, methodArn) => {
  const apiGatewayWildcard = `${methodArn.split('/', 2).join('/')}/*`;

  const result = {
    principalId: null,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource: apiGatewayWildcard,
        },
      ],
    },
    context: {
      error: errorMessage,
    },
  };
  if (process.env.STAGE !== 'test') {
    console.error(JSON.stringify(result));
  }
  return result;
};

// eslint-disable-next-line no-unused-vars
async function handlerFunction(event, context) {
  // console.log('Authorizing request...', JSON.stringify(event));
  context.callbackWaitsForEmptyEventLoop = false;

  if (!event.authorizationToken) {
    return generateDenyPolicy('Missing authorization token', event.methodArn);
    // throw new createError.Unauthorized('Missing authorization token');
  }

  const token = event.authorizationToken.replace('Bearer ', '');

  await dbconnect();

  let claims;
  try {
    claims = jwt.verify(token, process.env.PASSWORD_SECRET);
  } catch (error) {
    return generateDenyPolicy('Token verification failed', event.methodArn);
    // throw new createError.Unauthorized('Token verification failed');
  }

  // console.log(claims);
  const user = await User.findOne({
    _id: claims._id,
    'tokens.token': token,
  });

  if (!user) {
    return generateDenyPolicy('User not found', event.methodArn);
    // throw new createError.Unauthorized('User not found');
  }

  // user has access
  const policy = generatePolicy(claims._id, event.methodArn);

  return {
    ...policy,
    // context: claims,
  };

  /**
   * {
  "principalId": "yyyyyyyy", // The principal user identification associated with the token sent by the client.
  "policyDocument": {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "execute-api:Invoke",
        "Effect": "Allow|Deny",
        "Resource": "arn:aws:execute-api:{regionId}:{accountId}:{apiId}/{stage}/{httpVerb}/[{resource}/[{child-resources}]]"
      }
    ]
  },
  "context": {
    "stringKey": "value",
    "numberKey": "1",
    "booleanKey": "true"
  },
  "usageIdentifierKey": "{api-key}"
  }
   */
}

export const handler = middy(handlerFunction).use([errorHandler()]);
