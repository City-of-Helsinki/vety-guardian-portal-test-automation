import { expect } from '@playwright/test';

const apiUrl = process.env.API_URL || 'http://localhost:8001';

// Returns the application (draft or submitted) as saved in backend
export async function getApplication(request, applicationId) {
  const response = await request.get(
    `${apiUrl}/preschool-application-form/${applicationId}/`
  );
  await expect(response).toBeOK();

  return response.json();
}
