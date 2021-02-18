/**
 * user roles:
 * Owner =>
 * TeamMember =>
 * Admin =>
 * SysAdmin =>
 */
const roles = ['Owner', 'Admin', 'TeamMember', 'SysAdmin'];

const stepTypes = [
  'Task',
  'Choice',
  'Parallel',
  'Wait',
  'Fail',
  'Succeed',
  'Pass',
];

export { roles, stepTypes };
