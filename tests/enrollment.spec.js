import { test, expect } from '@playwright/test';
import { LanguageSelector } from '../components/LanguageSelector';
import { LoginPage } from '../components/LoginPage';
import { LandingPage } from '../components/LandingPage';
import { PreschoolEnrollmentPage } from '../components/PreschoolEnrollmentPage';
import { users } from '../test-data/users';
import { clearPreschoolApplications } from '../utils/db';
import { getApplication } from '../utils/api';

// Child used only by these tests
const guardian = users.parent;
const child = 'OtherChild Example';

// Every step saves the form to backend, so run all tests in this file one at
// a time and start each one from an empty application table
test.describe.configure({ mode: 'default' });

let loginPage;
let landingPage;
let enrollmentPage;
let childBirthDate; // As shown on the landing page, e.g. '1.2.2016'

test.beforeEach(async ({ page }) => {
  clearPreschoolApplications();

  loginPage = new LoginPage(page);
  landingPage = new LandingPage(page);
  const languageSelector = new LanguageSelector(page);
  enrollmentPage = new PreschoolEnrollmentPage(page);

  await loginPage.open();
  await languageSelector.select('fi');  // By default goes to english language regardless of locale
  await loginPage.loginAs(guardian);
  childBirthDate = await landingPage.childBirthDate(child);
  await landingPage.openApplication(child);
});

test.describe('Preschool enrollment', () => {

  test('loads enrollment page', async () => {
    await expect(
      enrollmentPage.pageHeading
    ).toBeVisible();

    await enrollmentPage.verifyCurrentStep(1);
  });

  test('test obscured checkbox', async () => {
    // Step 1
    await enrollmentPage.clickNext();

    // Step 2
    await enrollmentPage.clickNext();

    // Step 3
    await enrollmentPage.verifyExtendedCareStepVisible();
    await enrollmentPage.selectNeedsExtendedCare();
    await enrollmentPage.verifyNeedsExtendedCareSelected();
  });

  test('can complete steps 1-6 happy path', async () => {
    // Step 1
    await enrollmentPage.clickNext();

    // Step 2
    await enrollmentPage.verifyPreschoolLanguageStepVisible();
    await enrollmentPage.selectFinnishPreschoolLanguage();
    await enrollmentPage.clickNext();

    // Step 3
    await enrollmentPage.verifyExtendedCareStepVisible();
    await enrollmentPage.selectNeedsExtendedCare();
    await enrollmentPage.clickNext();

    // Step 4
    await enrollmentPage.verifyStartAndCareNeedStepVisible();
    await enrollmentPage.fillExtendedCareStartDate(
      '01.08.2027'
    );
    await enrollmentPage.selectDaytimeCare();
    await enrollmentPage.clickNext();

    // Step 5
    await enrollmentPage.verifyCareExtentStepVisible();
    await enrollmentPage.selectDaytimeCareExtent(
      'careExtent4to6Hours'
    );
    await enrollmentPage.setDaytimeCareWeekdayAbsenceDays(2);
    await enrollmentPage.clickNext();

    // Step 6
    await enrollmentPage.verifySupportNeedsStepVisible();
    await enrollmentPage.selectSpecialSupport();
    await enrollmentPage.selectMedicationNeed();

    await enrollmentPage.verifySpecialSupportSelected();
    await enrollmentPage.verifyMedicationNeedSelected();
  });

  test('can navigate forward and back', async () => {
    await enrollmentPage.completeStep3();

    await enrollmentPage.verifyStartAndCareNeedStepVisible();

    await enrollmentPage.clickPrevious();

    await enrollmentPage.verifyExtendedCareStepVisible();

    await enrollmentPage.clickNext();

    await enrollmentPage.verifyStartAndCareNeedStepVisible();
  });

  test('step 2 language selection works', async () => {
    await enrollmentPage.completeStep1();

    await enrollmentPage.verifyPreschoolLanguageStepVisible();

    await enrollmentPage.selectSwedishPreschoolLanguage();
    await enrollmentPage.verifySwedishLanguageSelected();

    await enrollmentPage.selectFinnishPreschoolLanguage();
    await enrollmentPage.verifyFinnishLanguageSelected();
  });

  test('step 3 extended care selection works', async () => {
    await enrollmentPage.completeStep2();

    await enrollmentPage.verifyExtendedCareStepVisible();

    await enrollmentPage.verifyVarhaiskasvatusmaksutLinkVisible();

    await enrollmentPage.selectNeedsExtendedCare();
    await enrollmentPage.verifyNeedsExtendedCareSelected();

    await enrollmentPage.selectNoExtendedCare();
    await enrollmentPage.verifyNoExtendedCareSelected();
  });

  test('step 4 care type selection works', async () => {
    await enrollmentPage.completeStep3();

    await enrollmentPage.verifyStartAndCareNeedStepVisible();

    await enrollmentPage.selectDaytimeCare();
    await enrollmentPage.verifyDaytimeCareSelected();

    await enrollmentPage.selectDayAndEveningCare();
    await enrollmentPage.verifyDayAndEveningCareSelected();

    await enrollmentPage.selectRoundTheClockCare();
    await enrollmentPage.verifyRoundTheClockCareSelected();
  });

  test('step 5 daytime care extent selection works', async () => {
    await enrollmentPage.completeStep4();

    await enrollmentPage.verifyCareExtentStepVisible();

    await enrollmentPage.selectDaytimeCareExtent(
      'careExtent1to3Hours'
    );

    await enrollmentPage.verifyDaytimeCareExtentSelected(
      'careExtent1to3Hours'
    );

    await enrollmentPage.setDaytimeCareWeekdayAbsenceDays(3);
  });

  test('step 6 support selections work', async () => {
    await enrollmentPage.completeStep5();

    await enrollmentPage.verifySupportNeedsStepVisible();

    await enrollmentPage.selectSpecialSupport();
    await enrollmentPage.verifySpecialSupportSelected();

    await enrollmentPage.selectMedicationNeed();
    await enrollmentPage.verifyMedicationNeedSelected();

    await enrollmentPage.unselectSpecialSupport();
    await enrollmentPage.verifySpecialSupportNotSelected();

    await enrollmentPage.unselectMedicationNeed();
    await enrollmentPage.verifyMedicationNeedNotSelected();
  });

  test('selections persist when navigating backwards', async () => {
    await enrollmentPage.completeStep2();

    await enrollmentPage.selectNeedsExtendedCare();
    await enrollmentPage.clickNext();

    await enrollmentPage.clickPrevious();

    await enrollmentPage.verifyNeedsExtendedCareSelected();
  });

  test('can return to completed step through stepper', async () => {
    await enrollmentPage.completeStep5();

    await enrollmentPage.openStep(2);

    await enrollmentPage.verifyPreschoolLanguageStepVisible();
    await enrollmentPage.verifyFinnishLanguageSelected();

    await enrollmentPage.openStep(5);

    await enrollmentPage.verifyCareExtentStepVisible();

    await enrollmentPage.verifyDaytimeCareExtentSelected(
      'careExtent4to6Hours'
    );
  });

  test('step 6 support options are optional', async () => {
    await enrollmentPage.completeStep5();

    await enrollmentPage.verifySupportNeedsStepVisible();

    await enrollmentPage.verifySpecialSupportNotSelected();
    await enrollmentPage.verifyMedicationNeedNotSelected();
  });

  test('can select only special support', async () => {
    await enrollmentPage.completeStep5();

    await enrollmentPage.selectSpecialSupport();

    await enrollmentPage.verifySpecialSupportSelected();
    await enrollmentPage.verifyMedicationNeedNotSelected();
  });

  test('can select only medication need', async () => {
    await enrollmentPage.completeStep5();

    await enrollmentPage.selectMedicationNeed();

    await enrollmentPage.verifyMedicationNeedSelected();
    await enrollmentPage.verifySpecialSupportNotSelected();
  });
});

test.describe('Saved answers', () => {
  test('answers are shown when returning to previous steps', async () => {
    // Step 1
    await enrollmentPage.checkPrivatePreschoolApplication();
    await enrollmentPage.clickNext();

    // Step 2
    await enrollmentPage.selectSwedishPreschoolLanguage();
    await enrollmentPage.clickNext();

    // Step 3
    await enrollmentPage.selectNeedsExtendedCare();
    await enrollmentPage.clickNext();

    // Step 4
    await enrollmentPage.fillExtendedCareStartDate('01.08.2027');
    await enrollmentPage.selectDayAndEveningCare();
    await enrollmentPage.clickNext();

    // Step 5 (absence days are checked in their own test)
    await enrollmentPage.selectDaytimeCareExtent('careExtent3to4Hours');
    await enrollmentPage.setDaytimeCareWeekdayAbsenceDays(3);
    await enrollmentPage.clickNext();

    // Step 6
    await enrollmentPage.selectSpecialSupport();
    await enrollmentPage.selectMedicationNeed();
    await enrollmentPage.clickNext();

    // Step 7
    await enrollmentPage.fillGuardianEmail('guardian@example.com');
    await enrollmentPage.fillOtherGuardianEmail('other@example.com');
    await enrollmentPage.clickNext();

    // Back from step 8 to step 1
    await enrollmentPage.verifyPreviewStepVisible();
    await enrollmentPage.clickPrevious();

    await enrollmentPage.verifyContactInfoStepVisible();
    await enrollmentPage.verifyGuardianEmail('guardian@example.com');
    await enrollmentPage.verifyOtherGuardianEmail('other@example.com');
    await enrollmentPage.clickPrevious();

    await enrollmentPage.verifySupportNeedsStepVisible();
    await enrollmentPage.verifySpecialSupportSelected();
    await enrollmentPage.verifyMedicationNeedSelected();
    await enrollmentPage.clickPrevious();

    await enrollmentPage.verifyCareExtentStepVisible();
    await enrollmentPage.verifyDaytimeCareExtentSelected('careExtent3to4Hours');
    await enrollmentPage.clickPrevious();

    await enrollmentPage.verifyStartAndCareNeedStepVisible();
    await enrollmentPage.verifyExtendedCareStartDate('1.8.2027');
    await enrollmentPage.verifyDayAndEveningCareSelected();
    await enrollmentPage.clickPrevious();

    await enrollmentPage.verifyExtendedCareStepVisible();
    await enrollmentPage.verifyNeedsExtendedCareSelected();
    await enrollmentPage.clickPrevious();

    await enrollmentPage.verifyPreschoolLanguageStepVisible();
    await enrollmentPage.verifySwedishLanguageSelected();
    await enrollmentPage.clickPrevious();

    await enrollmentPage.verifyCurrentStep(1);
    await enrollmentPage.verifyPrivatePreschoolApplicationChecked();
  });

  test('weekday absence days are shown when returning to step 5', async () => {
    test.fail(true, 'Known bug: absence days are saved but not shown when returning to step 5');

    await enrollmentPage.completeStep4();

    await enrollmentPage.selectDaytimeCareExtent('careExtent4to6Hours');
    await enrollmentPage.setDaytimeCareWeekdayAbsenceDays(3);
    await enrollmentPage.clickNext();

    await enrollmentPage.verifySupportNeedsStepVisible();
    await enrollmentPage.clickPrevious();

    await enrollmentPage.verifyCareExtentStepVisible();
    await enrollmentPage.verifyDaytimeCareWeekdayAbsenceDays(3);
  });

  test('weekday absence days are saved to draft', async ({ request }) => {
    await enrollmentPage.completeStep4();

    await enrollmentPage.selectDaytimeCareExtent('careExtent4to6Hours');
    await enrollmentPage.setDaytimeCareWeekdayAbsenceDays(3);
    await enrollmentPage.clickNext();

    await enrollmentPage.verifySupportNeedsStepVisible();

    const application = await getApplication(request, enrollmentPage.applicationId());
    expect(application.arkipoissaolotLkm).toBe(3);
  });

  test('weekday absence days default is 0', async () => {
    test.fail(true, 'Known issue: absence days field has no default value');

    await enrollmentPage.completeStep4();

    await enrollmentPage.verifyCareExtentStepVisible();
    await enrollmentPage.verifyDaytimeCareWeekdayAbsenceDays(0);
  });
});

test.describe('Contact info', () => {
  test.beforeEach(async () => {
    await enrollmentPage.completeStep6();
    await enrollmentPage.verifyContactInfoStepVisible();
  });

  test('invalid guardian email is not accepted', async () => {
    await enrollmentPage.fillGuardianEmail('abc');
    await enrollmentPage.clickNextExpectingError();

    await enrollmentPage.verifyGuardianEmailHasError();
    await enrollmentPage.verifyCurrentStep(7);
  });

  test('guardian email syntax is checked before saving', async ({ page }) => {
    test.fail(true, 'Known issue: email syntax is only checked by backend');

    const saveRequest = page
      .waitForRequest(
        (request) => request.method() === 'PUT' && request.url().includes('/preschool-application-form/'),
        { timeout: 3000 }
      )
      .then(() => true, () => false);

    await enrollmentPage.fillGuardianEmail('abc');
    await enrollmentPage.clickNextExpectingError();

    expect(await saveRequest, 'Invalid email was sent to backend').toBe(false);
    await enrollmentPage.verifyGuardianEmailHasError();
  });

  test('guardian email confirmation must match', async () => {
    test.fail(true, 'Known bug: confirmation email is not compared to guardian email');

    await enrollmentPage.guardianEmailInput.fill('guardian@example.com');
    await enrollmentPage.guardianEmailConfirmInput.fill('other@example.com');
    await enrollmentPage.clickNextExpectingError();

    // With the bug the preview opens and the input is gone
    await expect(
      enrollmentPage.guardianEmailConfirmInput,
      'Confirmation email should show an error on step 7'
    ).toHaveAccessibleDescription(/\S/);
    await enrollmentPage.verifyCurrentStep(7);
  });
});

test.describe('Preview and sending', () => {
  const guardianEmail = 'guardian@example.com';

  test.beforeEach(async () => {
    await enrollmentPage.completeStep7(guardianEmail);
    await enrollmentPage.verifyPreviewStepVisible();
  });

  test('preview shows the child from landing page', async () => {
    const { childInfoSection, guardianInfoSection } = enrollmentPage;
    const [day, month, year] = childBirthDate.split('.');
    const ssnDate = day.padStart(2, '0') + month.padStart(2, '0') + year.slice(2);

    await expect(enrollmentPage.previewValue(childInfoSection, 'childName')).toHaveText(child);
    await expect(enrollmentPage.previewValue(childInfoSection, 'childBirthYear')).toHaveText(year);
    // Henkilötunnus starts with the birth date as ddmmyy
    await expect(enrollmentPage.previewValue(childInfoSection, 'childSsn')).toHaveText(new RegExp(`^${ssnDate}`));

    await expect(enrollmentPage.previewValue(guardianInfoSection, 'guardianName')).toHaveText(guardian.name);
    await expect(enrollmentPage.previewValue(guardianInfoSection, 'guardianEmail')).toHaveText(guardianEmail);
  });

  test('sending application returns to login page', async ({ request }) => {
    const applicationId = enrollmentPage.applicationId();

    await enrollmentPage.sendApplication();

    await loginPage.verifyPageLoaded();

    const application = await getApplication(request, applicationId);
    expect(application.status).toBe('submitted');
  });

  test('sent application shows only notice and summary', async ({ page }) => {
    const applicationId = enrollmentPage.applicationId();

    await enrollmentPage.sendApplication();
    await loginPage.verifyPageLoaded();

    await loginPage.loginAs(guardian);
    await landingPage.openApplication(child);

    expect(enrollmentPage.applicationId()).toBe(applicationId);
    await expect(enrollmentPage.alreadySubmittedNotice).toBeVisible();
    await expect(enrollmentPage.previewValue(enrollmentPage.childInfoSection, 'childName')).toHaveText(child);

    // No form: stepper and navigation are hidden
    await expect(page.locator('[aria-label*="Vaihe 1/8"]')).toHaveCount(0);
    await expect(enrollmentPage.previousButton).toBeHidden();
    await expect(enrollmentPage.nextButton).toBeHidden();
    await expect(enrollmentPage.sendApplicationButton).toBeHidden();
  });
});
