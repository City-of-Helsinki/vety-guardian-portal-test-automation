
// Test people from DVV's test data (https://testiaineisto.fi/testiaineistorivit/henkilot).
// They log in with the suomi.fi test identification, and the backend's VTJ mock
// has the same families (see the backend's README, "Login test users").
export const users = {
  // Family 2: mother and father are both guardians of the child, who is of preschool age
  mother: {
    key: 'mother',
    name: 'Maiju Sanna-Kaisa Haapakoski Testihenkilo',
    firstName: 'Maiju',
    ssn: '010878-998D',
    children: ['Onni Manni Haapakoski Testihenkilo'],
  },
  father: {
    key: 'father',
    name: 'Holger Kullervo Ovaskainen Testihenkilo',
    firstName: 'Holger',
    ssn: '181077-999S',
    children: ['Onni Manni Haapakoski Testihenkilo'],
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
  // Family 1: the child (born 2020) isn't of preschool age, so no application can be made
  guardianOfChildNotOfPreschoolAge: {
    key: 'guardianOfChildNotOfPreschoolAge',
    name: 'Joanna Melina Haapakoski Testihenkilo',
    firstName: 'Joanna',
    ssn: '140904A998H',
    children: ['Veeti Konrad Kauriaistes Testihenkilo'],
  },
  // Mock-only family living in Espoo: the child is of preschool age, but the home municipality
  // isn't Helsinki, so no application can be made. The login ssn is a DVV test person (Totti),
  // which the backend's VTJ mock maps to Elina Espoolainen (120388-TP00, LOGIN_SSN_ALIASES).
  // The header shows the suomi.fi name, the landing page the VTJ mock family.
  guardianOutsideHelsinki: {
    key: 'guardianOutsideHelsinki',
    name: 'Elina Espoolainen',
    firstName: 'Totti',
    ssn: '030393-995E',
    children: ['Eetu Espoolainen'],
  },
};
