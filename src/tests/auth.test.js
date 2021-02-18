import HttpStatus from 'http-status-codes';
import * as setup from './fixtures/setup';

beforeEach(setup.setupBeforeEach);
afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

test('Should signUp owner user', async () => {
  // create owner user
  const result = await setup.signUp(
    { username: setup.user1 },
    HttpStatus.CREATED
  );
  const { user, token } = result.data;
  expect(user).toBeDefined();
  expect(token).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeDefined();
  expect(user.updatedAt).toBeDefined();
  expect(user.organisationName).toBe(setup.user1);
  expect(user.username).toBe(setup.user1);
  expect(user.email).toBe(`${setup.user1}@snapdevhub.com`);
  expect(user.role).toBe('Owner');
  expect(user.active).toBe(true);
});

test('Should login user', async () => {
  let result = await setup.signUp(
    { username: setup.user1 },
    HttpStatus.CREATED
  );

  result = await setup.login({ username: setup.user1 }, HttpStatus.OK);

  const { user, token } = result.data;
  expect(user).toBeDefined();
  expect(token).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeDefined();
  expect(user.updatedAt).toBeDefined();
  expect(user.organisationName).toBe(setup.user1);
  expect(user.username).toBe(setup.user1);
  expect(user.email).toBe(`${setup.user1}@snapdevhub.com`);
  expect(user.role).toBe('Owner');
  expect(user.active).toBe(true);
});

test('Should get my profile', async () => {
  let result = await setup.signUp(
    { username: setup.user1 },
    HttpStatus.CREATED
  );
  const { token } = result.data;

  result = await setup.getMe(HttpStatus.OK, token);
  const user = result.data;

  expect(user).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeDefined();
  expect(user.updatedAt).toBeDefined();
  expect(user.organisationName).toBe(setup.user1);
  expect(user.username).toBe(setup.user1);
  expect(user.email).toBe(`${setup.user1}@snapdevhub.com`);
  expect(user.role).toBe('Owner');
  expect(user.active).toBe(true);
});

test('Should logout user', async () => {
  let result = await setup.signUp(
    { username: setup.user1 },
    HttpStatus.CREATED
  );
  const { token } = result.data;
  result = await setup.logout(token, HttpStatus.OK);
});

test('Should fail login', async () => {
  await setup.signUp({ username: setup.user1 }, HttpStatus.CREATED);
  await setup.login(
    { username: setup.user1, password: 'fail' },
    HttpStatus.BAD_REQUEST
  );
});

test('Should fail to get the profile', async () => {
  await setup.signUp({ username: setup.user1 }, HttpStatus.CREATED);
  await setup.getMe(HttpStatus.UNAUTHORIZED, setup.fakeToken);
});

test('Should signUp a team member', async () => {
  let result = await setup.signUp(
    { username: setup.user1 },
    HttpStatus.CREATED
  );
  const { user: user1, token: token1 } = result.data;

  result = await setup.memberSignUp(
    { username: setup.user2 },
    HttpStatus.CREATED,
    token1
  );
  const { user, token: token2 } = result.data;
  expect(user).toBeDefined();
  expect(token2).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeDefined();
  expect(user.updatedAt).toBeDefined();
  expect(user.ownerUserId).toBe(user1.id);
  expect(user.organisationName).toBe(setup.user1);
  expect(user.username).toBe(setup.user2);
  expect(user.email).toBe(`${setup.user2}@snapdevhub.com`);
  expect(user.role).toBe('TeamMember');
  expect(user.active).toBe(true);
});

test('Should patch owner profile', async () => {
  let result = await setup.signUp(
    { username: setup.user1 },
    HttpStatus.CREATED
  );
  const { user: oldUser, token } = result.data;

  result = await setup.patchMe(
    {
      photoUrl: 'myPhoto',
      organisationName: 'Qualip2',
      active: false,
      email: 'tshepo2@gmail.com',
      username: 'user1of2',
      role: 'Admin',
    },
    HttpStatus.OK,
    token
  );
  const user = result.data;

  expect(user).toBeDefined();
  expect(user.id).toBe(oldUser.id);
  expect(user.organisationName).toBe('Qualip2');
  expect(user.photoUrl).toBe('myPhoto');
  expect(user.username).toBe(oldUser.username);
  expect(user.email).toBe(`${oldUser.username}@snapdevhub.com`);
  expect(user.role).toBe('Owner');
  expect(user.active).toBe(false);
});

test('Should deactivate owner user', async () => {
  let result = await setup.signUp(
    { username: setup.user1 },
    HttpStatus.CREATED
  );
  const { token } = result.data;

  result = await setup.patchMe(
    {
      active: false,
    },
    HttpStatus.OK,
    token
  );

  result = await setup.login({ username: setup.user1 }, HttpStatus.BAD_REQUEST);
});

test('Should patch team member profile', async () => {
  // create owner
  let result = await setup.signUp(
    { username: setup.user1 },
    HttpStatus.CREATED
  );
  const { user: ownerUser, token: ownerToken } = result.data;
  // create the team member
  result = await setup.memberSignUp(
    { username: setup.user2 },
    HttpStatus.CREATED,
    ownerToken
  );
  const { token: memberToken } = result.data;

  // patch member user
  result = await setup.patchMe(
    {
      photoUrl: 'myPhoto',
      organisationName: 'Qualip2',
      active: false,
      email: 'tshepo2@gmail.com',
      username: 'user1of2',
      role: 'Admin',
    },
    HttpStatus.OK,
    memberToken
  );
  const user = result.data;

  expect(user).toBeDefined();
  expect(user.ownerUserId).toBe(ownerUser.id);
  expect(user.organisationName).toBe('user1');
  expect(user.photoUrl).toBe('myPhoto');
  expect(user.username).toBe('user2');
  expect(user.email).toBe(`user2@snapdevhub.com`);
  expect(user.role).toBe('TeamMember');
  expect(user.active).toBe(false);
});

test('Should remove owner profile and related data', async () => {
  let result = await setup.signUp(
    { username: setup.user1 },
    HttpStatus.CREATED
  );
  const { token } = result.data;

  result = await setup.memberSignUp(
    { username: setup.user2 },
    HttpStatus.CREATED,
    token
  );
  const { token: memberToken } = result.data;

  // owner getMe - pass
  result = await setup.getMe(HttpStatus.OK, token);

  // member getMe - pass
  result = await setup.getMe(HttpStatus.OK, memberToken);

  // owner delete
  result = await setup.deleteMe(HttpStatus.OK, token);

  // owner getMe - fail
  result = await setup.getMe(HttpStatus.UNAUTHORIZED, token);

  // member getMe - fail
  result = await setup.getMe(HttpStatus.UNAUTHORIZED, memberToken);

  // TODO: Remove stepFunctions
  // TODO: Remove Workflows
});

test('Should remove team member profile but keep related data', async () => {
  let result = await setup.signUp(
    { username: setup.user1 },
    HttpStatus.CREATED
  );
  const { token } = result.data;

  result = await setup.memberSignUp(
    { username: setup.user2 },
    HttpStatus.CREATED,
    token
  );
  const { token: memberToken } = result.data;

  // owner getMe - pass
  result = await setup.getMe(HttpStatus.OK, token);

  // member getMe - pass
  result = await setup.getMe(HttpStatus.OK, memberToken);

  // member delete
  result = await setup.deleteMe(HttpStatus.OK, memberToken);

  // owner getMe - pass
  result = await setup.getMe(HttpStatus.OK, token);

  // member getMe - fail
  result = await setup.getMe(HttpStatus.UNAUTHORIZED, memberToken);
});
