import HttpStatus from 'http-status-codes';
import runHandler from './setup.apiGateway.runner';
import * as clearDbCollectionsHandler from '../../handlers/testing/clearDbCollections';

const setupBeforeEach = async () => {
  // clear database
  await runHandler(clearDbCollectionsHandler.handler, {}, HttpStatus.OK);
};

export * from './setup.common';
export * from './setup.auth';
export { setupBeforeEach };
