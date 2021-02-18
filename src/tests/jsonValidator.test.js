import * as setup from './fixtures/setup';
import jsonValidator from '../lib/jsonValidator';

beforeEach(setup.setupBeforeEach);
afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

test('Validate input schema', async () => {
  const payloadSchema = {
    properties: {
      State: {
        type: 'string',
      },
      InputBuilder: {
        type: 'object',
        properties: {
          queueUrl: {
            type: 'string',
          },
        },
        required: ['queueUrl'],
      },
      Input: {
        type: 'object',
        properties: {
          formData: {
            type: 'object',
          },
          workflow: {
            type: 'object',
          },
        },
        required: ['formData', 'workflow'],
      },
    },
    required: ['State', 'InputBuilder', 'Input'],
  };

  const payload = {
    InputBuilder: {
      queueUrl:
        'https://sqs.eu-west-1.amazonaws.com/116844974399/download-manager-url-queue',
    },
    Input: {
      formData: {
        name: 'Tshepo Mgaga',
        email: 'tshepo.mgaga@gmail.com',
        cellNo: '+27780758158',
        link: 'myLink',
      },
      workflow: {
        userId: '5feeb0a329df97000829d48c',
        workflowId: '5feebbb88c914b00084c2f5f',
        workflowEntityId: '5ff2331b9b96700008b58e2f',
      },
    },
    State: 'Download File',
  };

  await jsonValidator(payloadSchema, payload);
});
