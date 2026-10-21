import { expect } from '@playwright/test';

const apiUrl = process.env.API_URL || 'http://localhost:8001';

// Returns the application (draft or submitted) as saved in backend.
// The API needs the logged-in user's token, which the app keeps in
// sessionStorage, so read it from the page.
export async function getApplication(page, applicationId) {
  const token = await page.evaluate(
    () => JSON.parse(sessionStorage.getItem('hds_login_api_token_storage_key') || '{}')['vety-api-dev']
  );
  expect(token, 'Logged-in user should have an API token').toBeTruthy();

  const response = await page.request.get(
    `${apiUrl}/preschool-application-form/${applicationId}/`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  await expect(response).toBeOK();

  return response.json();
}
