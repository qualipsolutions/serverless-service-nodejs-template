import mongoose from 'mongoose';

export const objectId = () => new mongoose.Types.ObjectId().toString();

export const user1 = 'user1';
export const user2 = 'user2';
export const user3 = 'user3';
export const user4 = 'user4';
export const user5 = 'user5';

export const password1 = 'password';
export const password2 = '1234';

export const fakeToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmU5NmZmOTZkNzliN2ZiYjRhMGE4YzQiLCJ1c2VyIjp7ImFjdGl2ZSI6dHJ1ZSwib3JnYW5pc2F0aW9uTmFtZSI6InVzZXIxIiwidXNlcm5hbWUiOiJ1c2VyMSIsImVtYWlsIjoidXNlcjFAc25hcGRldmh1Yi5jb20iLCJyb2xlIjoiT3duZXIiLCJjcmVhdGVkQXQiOiIyMDIwLTEyLTI4VDA1OjQxOjEzLjMxNFoiLCJ1cGRhdGVkQXQiOiIyMDIwLTEyLTI4VDA1OjQxOjEzLjMxNFoiLCJpZCI6IjVmZTk2ZmY5NmQ3OWI3ZmJiNGEwYThjNCJ9LCJpYXQiOjE2MDkxMzQwNzN9.ENekKscIybHpmqpt7_jsL8mXBZVHi_AIAHHJ7UpBbzM';

export const roleOwner = 'Owner';
export const roleAdmin = 'Admin';
export const roleTeamMember = 'TeamMember';
export const roleSysAdmin = 'SysAdmin';
