// Test people from DVV's test data (https://testiaineisto.fi/testiaineistorivit/henkilot).
// They log in with the suomi.fi test identification, and the backend's VTJ mock
// has the same family: mother and father are both guardians of the child.
export const users = {
  mother: {
    key: 'mother',
    name: 'Joanna Melina Haapakoski Testihenkilo',
    firstName: 'Joanna',
    ssn: '140904A998H',
    children: ['Veeti Konrad Kauriaistes Testihenkilo'],
  },
  father: {
    key: 'father',
    name: 'Elias Kumpulainen Testihenkilo',
    firstName: 'Elias',
    ssn: '060999-951B',
    children: ['Veeti Konrad Kauriaistes Testihenkilo'],
  },
};
