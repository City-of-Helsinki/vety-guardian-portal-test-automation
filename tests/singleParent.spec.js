import { test, expect } from '@playwright/test';
import { LanguageSelector } from '../components/LanguageSelector';
import { LoginPage } from '../components/LoginPage';
import { LandingPage } from '../components/LandingPage';
import { PreschoolEnrollmentPage } from '../components/PreschoolEnrollmentPage';
import { users } from '../test-data/users';
import { deleteApplications, getApplication } from '../utils/api';

// The guardian is the only guardian of the child, so the form doesn't ask
// for the other guardian's contact info and the summary has no other guardian
const guardian = users.singleParent;
const child = guardian.children[0];

// Every step saves the form to backend, so run the tests one at a time and
// start each one with no applications for the guardian
test.describe.configure({ mode: 'default' });

let landingPage;
let enrollmentPage;

test.beforeEach(async ({ page, request }) => {
  await deleteApplications(request, guardian.ssn);

  const loginPage = new LoginPage(page);
  landingPage = new LandingPage(page);
  enrollmentPage = new PreschoolEnrollmentPage(page);

  await loginPage.open();
  await new LanguageSelector(page).select('fi');  // Default follows browser language. Select Finnish so tests don't depend on it.
  await loginPage.loginAs(guardian);
  await landingPage.openApplication(child);
});

test.describe('Preschool enrollment: single parent', () => {
  test('contact info step has only the guardian', async () => {
    await enrollmentPage.completeStep6();

    await enrollmentPage.verifyContactInfoStepVisible();
    await expect(enrollmentPage.guardianContactInfo).toBeVisible();
    await expect(enrollmentPage.otherGuardianContactInfo).toBeHidden();
    await expect(enrollmentPage.otherGuardianEmailInput).toBeHidden();
    await expect(enrollmentPage.otherGuardianEmailConfirmInput).toBeHidden();
    await expect(enrollmentPage.otherGuardianPhoneInput).toBeHidden();
  });

  test('summary has no other guardian', async () => {
    const contactInfo = await enrollmentPage.completeStep7('guardian@example.com');

    await enrollmentPage.verifyPreviewStepVisible();
    await expect(enrollmentPage.summary.guardianSection).toBeVisible();
    await expect(enrollmentPage.summaryValue('guardianName')).toHaveText(guardian.name);
    await expect(enrollmentPage.summaryValue('guardianEmail')).toHaveText(contactInfo.email);

    await expect(enrollmentPage.summary.otherGuardiansSection).toBeHidden();
    await expect(enrollmentPage.summaryValue('otherGuardianName')).toBeHidden();
  });

  test('sent application has no other guardian', async ({ page }) => {
    await enrollmentPage.completeStep7('guardian@example.com');
    await enrollmentPage.verifyPreviewStepVisible();
    const applicationId = enrollmentPage.applicationId();

    await enrollmentPage.sendApplication();
    await enrollmentPage.closeSentDialog();
    await landingPage.verifyPageLoaded();

    const application = await getApplication(page, applicationId);
    expect(application.status).toBe('submitted');
    expect(application.h1Henkilotunnus).toBe(guardian.ssn);
    expect(application.h2Nimi).toBeFalsy();
    expect(application.h2Henkilotunnus).toBeFalsy();
    expect(application.h2Sahkoposti).toBeFalsy();
    expect(application.h2Puhelinnumero).toBeFalsy();
  });
});
