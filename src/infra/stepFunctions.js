import AWS from 'aws-sdk';
import createError from 'http-errors';

const stepFunctions = new AWS.StepFunctions();

const createStateMachine = (name, definition) =>
  new Promise((resolve, reject) => {
    const params = {
      definition /* required */,
      name /* required */,
      roleArn: process.env.STEPFUNCTIONS_ROLE_ARN /* required */,
      loggingConfiguration: {
        destinations: [
          {
            cloudWatchLogsLogGroup: {
              logGroupArn: process.env.STEPFUNCTIONS_LOG_GROUP_ARN,
            },
          },
          /* more items */
        ],
        includeExecutionData: true,
        level: 'ALL',
      },
      tracingConfiguration: {
        enabled: true,
      },
      type: 'STANDARD',
    };

    stepFunctions.createStateMachine(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

const updateStateMachine = (definition, stateMachineArn) =>
  new Promise((resolve, reject) => {
    const params = {
      stateMachineArn,
      definition,
    };

    stepFunctions.updateStateMachine(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

const startStateMachineExecution = (stateMachineArn, input, name) =>
  new Promise((resolve, reject) => {
    const params = {
      stateMachineArn,
      input,
      name,
      // traceHeader: 'STRING_VALUE'
    };
    stepFunctions.startExecution(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

const deleteStateMachine = (stateMachineArn) =>
  new Promise((resolve, reject) => {
    const params = {
      stateMachineArn,
    };

    stepFunctions.deleteStateMachine(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

const getActivityTask = (activityArn) =>
  new Promise((resolve, reject) => {
    const params = {
      activityArn,
    };

    stepFunctions.getActivityTask(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

const sendTaskFailure = (taskToken, cause = 'Unknown', error = 'Failed') =>
  new Promise((resolve, reject) => {
    const params = {
      taskToken,
      cause,
      error,
    };

    stepFunctions.sendTaskFailure(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

const sendTaskSuccess = (taskToken, output = '{}') =>
  new Promise((resolve, reject) => {
    const params = {
      output,
      taskToken,
    };

    stepFunctions.sendTaskSuccess(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(createError.BadRequest(err.message));
      }
      resolve(data);
    });
  });

export {
  createStateMachine,
  updateStateMachine,
  deleteStateMachine,
  startStateMachineExecution,
  getActivityTask,
  sendTaskFailure,
  sendTaskSuccess,
};
