
// Test people from DVV's test data (https://testiaineisto.fi/testiaineistorivit/henkilot).
// They log in with the suomi.fi test identification, and the backend's VTJ mock
// has the same families (see the backend's README, "Login test users").
export const users = {
  // Family 1: mother and father are both guardians of the child
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
  // Family 3: the only guardian of the child, so the form has no other guardian
  singleParent: {
    key: 'singleParent',
    name: 'Tove Maria Snellman Testihenkilo',
    firstName: 'Tove',
    ssn: '150299-902X',
    children: ['Ulrika Maria Snellman Testihenkilo'],
  },
  // Family 4: the guardian has turvakielto, the child doesn't
  guardianWithTurvakielto: {
    key: 'guardianWithTurvakielto',
    name: 'Mette Salviantes Testihenkilo',
    firstName: 'Mette',
    ssn: '200798-9981',
    children: ['Lise Salviantes Testihenkilo'],
    turvakielto: true,
  },
  // Family 5: the child has turvakielto, the guardian (the only one) doesn't
  guardianOfChildWithTurvakielto: {
    key: 'guardianOfChildWithTurvakielto',
    name: 'Marina Irina Larisa Testmän Testihenkilo',
    firstName: 'Marina',
    ssn: '010503A9503',
    children: ['Jimi Jonathan Testmän Testihenkilo'],
    turvakielto: true,
  },
};
