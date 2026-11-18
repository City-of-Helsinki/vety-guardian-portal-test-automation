import { expect } from '@playwright/test';

const apiUrl = process.env.API_URL || 'http://localhost:8001';

// The API needs the logged-in user's token, which the app keeps in
// sessionStorage, so read it from the page.
async function authHeaders(page) {
  const token = await page.evaluate(
    () => JSON.parse(sessionStorage.getItem('hds_login_api_token_storage_key') || '{}')['vety-api-dev']
  );
  expect(token, 'Logged-in user should have an API token').toBeTruthy();

  return { Authorization: `Bearer ${token}` };
}

// Returns the application (draft or submitted) as saved in backend.
export async function getApplication(page, applicationId) {
  const response = await page.request.get(
    `${apiUrl}/preschool-application-form/${applicationId}/`,
    { headers: await authHeaders(page) }
  );
  await expect(response).toBeOK();

  return response.json();
}

// Returns the logged-in guardian's children as saved in backend by the VTJ
// sync, which runs when the landing page opens.
export async function getDependants(page) {
  const response = await page.request.get(`${apiUrl}/vtj/dependants/`, {
    headers: await authHeaders(page),
  });
  await expect(response).toBeOK();

  return (await response.json()).dependants;
}

// Asks backend for the child's application like the landing page does
// (returns the existing one or creates a draft). Returns the response, so the
// test can check a refusal.
export async function requestApplicationForDependant(page, dependantId) {
  return page.request.post(
    `${apiUrl}/preschool-application-form/for-dependant/${dependantId}/`,
    { headers: await authHeaders(page) }
  );
}

// The backend's test-data API (/test-data/) needs TEST_DATA_API_ENABLED=True and
// the same TEST_DATA_API_KEY as these tests (from .env, see playwright.config.js)
async function postTestData(request, path, data) {
  const apiKey = process.env.TEST_DATA_API_KEY;
  if (!apiKey) {
    throw new Error('TEST_DATA_API_KEY is not set. Add it to .env (see README).');
  }

  const response = await request.post(`${apiUrl}/test-data/${path}`, {
    headers: { 'X-Test-Data-Api-Key': apiKey },
    data,
  });
  await expect(response, `POST /test-data/${path} should succeed`).toBeOK();

  return response.json();
}

// Deletes the applications (drafts and sent ones) linked to a child's or a
// guardian's hetu. With a guardian's hetu, the backend also deletes the VTJ
// records of the guardian and their children; the next VTJ sync recreates them.
export async function deleteApplications(request, hetu) {
  return postTestData(request, 'delete/', { hetu });
}

// Deletes all preschool applications from the backend, including other users'
export async function clearPreschoolApplications(request) {
  return postTestData(request, 'delete-all/');
}
