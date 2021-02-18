import * as common from './setup.common';
import runHandler from './setup.apiGateway.runner';

// handlers
import * as signUpHandler from '../../handlers/auth/signUp';
import * as memberSignUpHandler from '../../handlers/auth/memberSignUp';
import * as patchMeHandler from '../../handlers/auth/patchMe';
import * as deleteMeHandler from '../../handlers/auth/deleteMe';
import * as loginHandler from '../../handlers/auth/login';
import * as logoutHandler from '../../handlers/auth/logout';
import * as getMeHandler from '../../handlers/auth/getMe';

const handlers = {
  signUp: signUpHandler.handler,
  memberSignUp: memberSignUpHandler.handler,
  login: loginHandler.handler,
  logout: logoutHandler.handler,
  getMe: getMeHandler.handler,
  patchMe: patchMeHandler.handler,
  deleteMe: deleteMeHandler.handler,
};

const signUp = async (params, statusCode) => {
  const result = await runHandler(
    handlers.signUp,
    {
      organisationName: params.organisationName || params.username,
      username: params.username,
      email:
        params.fullEmail || `${params.email || params.username}@snapdevhub.com`,
      password: params.password || common.password1,
    },
    statusCode
  );
  return result;
};

const memberSignUp = async (params, statusCode, token) => {
  const result = await runHandler(
    handlers.memberSignUp,
    {
      username: params.username,
      email:
        params.fullEmail || `${params.email || params.username}@snapdevhub.com`,
      password: params.password || common.password1,
    },
    statusCode,
    token
  );
  return result;
};

const patchMe = async (params, statusCode, token) => {
  const result = await runHandler(handlers.patchMe, params, statusCode, token);
  return result;
};

const deleteMe = async (statusCode, token) => {
  const result = await runHandler(handlers.deleteMe, {}, statusCode, token);
  return result;
};

const login = async (params, statusCode) => {
  const result = await runHandler(
    handlers.login,
    {
      email: `${params.email || params.username}@snapdevhub.com`,
      password: params.password || common.password1,
    },
    statusCode
  );
  return result;
};

const logout = async (token, statusCode) => {
  const result = await runHandler(handlers.logout, {}, statusCode, token);
  return result;
};

const getMe = async (statusCode, token) => {
  const result = await runHandler(handlers.getMe, {}, statusCode, token);
  return result;
};

export { signUp, memberSignUp, login, logout, getMe, patchMe, deleteMe };
