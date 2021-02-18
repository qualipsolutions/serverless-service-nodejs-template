import HttpStatus from 'http-status-codes';
import * as authHandler from '../../handlers/auth/auth';

const APIGatewayRequest = ({
  body,
  method,
  path = '',
  queryStringObject,
  pathParametersObject,
  principalId,
  stageVariables = null,
}) => {
  const request = {
    body: body ? JSON.stringify(body) : null,
    headers: {
      'content-type': 'application/json',
    },
    multiValueHeaders: {},
    httpMethod: method,
    isBase64Encoded: false,
    path,
    pathParameters: pathParametersObject || null,
    queryStringParameters: queryStringObject || null,
    multiValueQueryStringParameters: null,
    stageVariables,
    requestContext: {
      accountId: '',
      apiId: '',
      httpMethod: method,
      authorizer: {
        principalId: principalId || null,
      },
      identity: {
        accessKey: '',
        accountId: '',
        apiKey: '',
        apiKeyId: '',
        caller: '',
        cognitoAuthenticationProvider: '',
        cognitoAuthenticationType: '',
        cognitoIdentityId: '',
        cognitoIdentityPoolId: '',
        principalOrgId: '',
        sourceIp: '',
        user: '',
        userAgent: '',
        userArn: '',
      },
      path,
      stage: '',
      requestId: '',
      requestTimeEpoch: 3,
      resourceId: '',
      resourcePath: '',
    },
    resource: '',
  };
  return request;
};

const isCorrectHeaders = (headers) => {
  // if (headers['Content-Type'] !== 'application/json') return false;
  // if (headers['Access-Control-Allow-Methods'] !== '*') return false;
  if (headers['Access-Control-Allow-Origin'] !== '*') return false;

  return true;
};

const isApiGatewayResponse = (response) => {
  const { body, headers, statusCode } = response;

  if (!body || !headers || !statusCode) return false;
  if (typeof statusCode !== 'number') return false;
  if (typeof body !== 'string') return false;
  if (!isCorrectHeaders(headers)) return false;
  return true;
};

const runHandler = async (handlerFunction, body, statusCode, token) => {
  let result;
  let principalId;
  const context = {
    callbackWaitsForEmptyEventLoop: false,
  };
  // console.log('TOKEN:', token);
  if (token) {
    // validate the token
    result = await authHandler.handler(
      {
        type: 'TOKEN',
        methodArn:
          'arn:aws:execute-api:eu-west-1:116844974399:citcys123j/dev/GET/my/handler/path',
        authorizationToken: `Bearer ${token}`,
      },
      context
    );
    // console.log(result);
    const authStatusCode =
      result.principalId == null ? HttpStatus.UNAUTHORIZED : HttpStatus.OK;

    if (authStatusCode !== HttpStatus.OK) {
      expect(authStatusCode).toBe(statusCode);
      return null;
    }
    expect(result.principalId).toBeDefined();
    principalId = result.principalId;
  }

  const event = APIGatewayRequest({ body, principalId });
  // console.log(event);
  result = await handlerFunction(event, context);
  // console.log(result);
  expect(result).toBeDefined();
  expect(isApiGatewayResponse(result)).toBe(true);
  expect(result.statusCode).toBe(statusCode);
  return JSON.parse(result.body);
};

export default runHandler;
