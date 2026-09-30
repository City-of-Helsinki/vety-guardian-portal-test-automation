// Mock users on the login page
export const users = {
  parent: {
    name: 'Parent Example',
    ssn: '010170-999X',
    children: ['Child Example', 'OtherChild Example'],
  },
  otherParent: {
    name: 'OtherParent Example',
    ssn: '010101-0101',
    children: ['Child Example'],
  },
  // Has turvakielto (security restriction): shows a notification, no children
  protectedPerson: {
    name: 'Person Protected',
    ssn: '010101-0102',
    children: [],
  },
};
