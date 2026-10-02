import { test, expect } from '@playwright/test';
import { LanguageSelector } from '../components/LanguageSelector';
import { LoginPage } from '../components/LoginPage';
import { LandingPage } from '../components/LandingPage';
import { PreschoolEnrollmentPage } from '../components/PreschoolEnrollmentPage';
import { users } from '../test-data/users';
import { summaryTexts } from '../test-data/summaryTexts';
import { clearPreschoolApplications } from '../utils/db';
import { getApplication } from '../utils/api';

// Child used only by these tests. Has two guardians, so step 7 and the
// summary also show the other guardian.
const guardian = users.parent;
const otherGuardian = users.otherParent;
const child = 'Child Example';

// Every step saves the form to backend, so run all tests in this file one at
// a time and start each one from an empty application table
test.describe.configure({ mode: 'default' });

let loginPage;
let landingPage;
let enrollmentPage;
let childBirthDate; // As shown on the landing page, e.g. '1.1.2015'

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
    test.fail(true, 'VETY-176: absence days are saved but not shown when returning to step 5');

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
    test.fail(true, 'VETY-176: absence days field has no default value 0');

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
    test.fail(true, 'VETY-203: email syntax is only checked by backend');

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
    test.fail(true, 'VETY-183: confirmation email is not compared to guardian email');

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

  test('other guardian email is optional', async () => {
    await enrollmentPage.fillGuardianEmail('guardian@example.com');
    await enrollmentPage.clickNext();

    await enrollmentPage.verifyPreviewStepVisible();
  });

  test('invalid other guardian email is not accepted', async () => {
    await enrollmentPage.fillGuardianEmail('guardian@example.com');
    await enrollmentPage.fillOtherGuardianEmail('abc');
    await enrollmentPage.clickNextExpectingError();

    await enrollmentPage.verifyOtherGuardianEmailHasError();
    await enrollmentPage.verifyCurrentStep(7);
  });

  for (const { name, confirmEmail } of [
    { name: 'must match', confirmEmail: 'wrong@example.com' },
    { name: 'is required when email is given', confirmEmail: '' },
  ]) {
    test(`other guardian email confirmation ${name}`, async () => {
      test.fail(true, 'VETY-183: confirmation email is not compared to guardian email');

      await enrollmentPage.fillGuardianEmail('guardian@example.com');
      await enrollmentPage.otherGuardianEmailInput.fill('other@example.com');
      await enrollmentPage.otherGuardianEmailConfirmInput.fill(confirmEmail);
      await enrollmentPage.clickNextExpectingError();

      // With the bug the preview opens and the input is gone
      await expect(
        enrollmentPage.otherGuardianEmailConfirmInput,
        'Confirmation email should show an error on step 7'
      ).toHaveAccessibleDescription(/\S/);
      await enrollmentPage.verifyCurrentStep(7);
    });
  }
});

test.describe('Summary', () => {
  test('summary shows the answers', async () => {
    const { summary } = enrollmentPage;

    // Step 1
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

    // Step 5
    await enrollmentPage.selectDaytimeCareExtent('careExtent3to4Hours');
    await enrollmentPage.setDaytimeCareWeekdayAbsenceDays(3);
    await enrollmentPage.clickNext();

    // Step 6: no support
    await enrollmentPage.clickNext();

    // Step 7
    await enrollmentPage.fillGuardianEmail('guardian@example.com');
    await enrollmentPage.clickNext();

    await enrollmentPage.verifyPreviewStepVisible();

    await expect(summary.languageSection).toContainText(summaryTexts.language.sv);
    await expect(enrollmentPage.summaryValue('extendedCareStart')).toHaveText('1.8.2027');
    await expect(enrollmentPage.summaryValue('extendedCareExtent')).toHaveText([
      summaryTexts.careType.dayAndEveningCare,
      summaryTexts.careExtent.careExtent3to4Hours,
    ]);
    await expect(summary.supportSection).toContainText(summaryTexts.noSupport);
    await expect(summary.specialSupport).toBeHidden();
    await expect(summary.medicationNeed).toBeHidden();
    await expect(enrollmentPage.summaryValue('guardianName')).toHaveText(guardian.name);
    await expect(enrollmentPage.summaryValue('guardianEmail')).toHaveText('guardian@example.com');
  });

  test('summary shows the other guardian', async () => {
    await enrollmentPage.completeStep6();
    await enrollmentPage.fillGuardianEmail('guardian@example.com');
    await enrollmentPage.fillOtherGuardianEmail('other@example.com');
    await enrollmentPage.clickNext();

    await enrollmentPage.verifyPreviewStepVisible();
    await expect(enrollmentPage.summary.otherGuardiansSection).toBeVisible();
    await expect(enrollmentPage.summaryValue('otherGuardianName')).toHaveText(otherGuardian.name);
    await expect(enrollmentPage.summaryValue('otherGuardianEmail')).toHaveText('other@example.com');
    await expect(enrollmentPage.summaryValue('guardianEmail')).toHaveText('guardian@example.com');
  });

  test('summary shows weekday absence days', async () => {
    test.fail(true, 'VETY-195: weekday absence days are not shown in the summary');

    await enrollmentPage.completeStep4();
    await enrollmentPage.selectDaytimeCareExtent('careExtent4to6Hours');
    await enrollmentPage.setDaytimeCareWeekdayAbsenceDays(5);
    await enrollmentPage.clickNext();
    await enrollmentPage.clickNext();
    await enrollmentPage.fillGuardianEmail('guardian@example.com');
    await enrollmentPage.clickNext();

    await enrollmentPage.verifyPreviewStepVisible();
    // No testid for absence days in the summary yet: check label and value
    await expect(enrollmentPage.summary.extendedCareSection).toContainText(/Arkipoissaolo[\s\S]*\b5\b/);
  });

  const supportCases = [
    { name: 'special support', specialSupport: true, medicationNeed: false },
    { name: 'medication need', specialSupport: false, medicationNeed: true },
    { name: 'special support and medication need', specialSupport: true, medicationNeed: true },
  ];

  for (const { name, specialSupport, medicationNeed } of supportCases) {
    test(`summary shows ${name}`, async () => {
      test.fail(true, 'VETY-199: special support and medication need texts are swapped in the summary');

      const { summary } = enrollmentPage;

      await enrollmentPage.completeStep5();
      if (specialSupport) await enrollmentPage.selectSpecialSupport();
      if (medicationNeed) await enrollmentPage.selectMedicationNeed();
      await enrollmentPage.clickNext();
      await enrollmentPage.fillGuardianEmail('guardian@example.com');
      await enrollmentPage.clickNext();

      await enrollmentPage.verifyPreviewStepVisible();

      if (specialSupport) {
        await expect(summary.specialSupport).toHaveText(summaryTexts.specialSupport);
      } else {
        await expect(summary.specialSupport).toBeHidden();
      }

      if (medicationNeed) {
        await expect(summary.medicationNeed).toHaveText(summaryTexts.medicationNeed);
      } else {
        await expect(summary.medicationNeed).toBeHidden();
      }

      await expect(summary.supportSection).not.toContainText(summaryTexts.noSupport);
    });
  }

  test.describe('Editing', () => {
    test.beforeEach(async () => {
      await enrollmentPage.completeStep7();
      await enrollmentPage.verifyPreviewStepVisible();
    });

    test('edit links open the right step', async () => {
      const { summary } = enrollmentPage;

      await test.step('Language', async () => {
        await enrollmentPage.editFromSummary(summary.editLanguageLink);
        await enrollmentPage.verifyPreschoolLanguageStepVisible();
        await enrollmentPage.verifyCurrentStep(2);
        await enrollmentPage.returnToSummary();
      });

      await test.step('Support and medication', async () => {
        await enrollmentPage.editFromSummary(summary.editSupportLink);
        await enrollmentPage.verifySupportNeedsStepVisible();
        await enrollmentPage.verifyCurrentStep(6);
        await enrollmentPage.returnToSummary();
      });

      await test.step('Supplementary early childhood education', async () => {
        await enrollmentPage.editFromSummary(summary.editExtendedCareLink);
        await enrollmentPage.verifyExtendedCareStepVisible();
        await enrollmentPage.verifyCurrentStep(3);
        await enrollmentPage.returnToSummary();
      });
    });

    test('answer changed through edit link is shown in summary', async () => {
      const { summary } = enrollmentPage;
      await expect(summary.languageSection).toContainText(summaryTexts.language.fi);

      await enrollmentPage.editFromSummary(summary.editLanguageLink);
      await enrollmentPage.selectSwedishPreschoolLanguage();
      await enrollmentPage.returnToSummary();

      await expect(summary.languageSection).toContainText(summaryTexts.language.sv);
    });

    test('can return to summary through stepper after editing', async () => {
      test.fail(true, 'VETY-196: step 8 is disabled in the stepper after leaving it with an edit link');

      await enrollmentPage.editFromSummary(enrollmentPage.summary.editLanguageLink);

      await enrollmentPage.verifyStepEnabled(8);
      await enrollmentPage.goToStep(8);
      await enrollmentPage.verifyPreviewStepVisible();
    });

    test('changing to no extended care clears steps 4 and 5 from summary', async () => {
      test.fail(true, 'VETY-197: summary still shows step 4 and 5 answers after selecting no extended care');

      const { summary } = enrollmentPage;

      await enrollmentPage.editFromSummary(summary.editExtendedCareLink);
      await enrollmentPage.selectNoExtendedCare();
      await enrollmentPage.goToStep(7);
      await enrollmentPage.clickNext();

      await enrollmentPage.verifyPreviewStepVisible();
      // Answers given by completeStep4 and completeStep5
      await expect(summary.extendedCareSection).not.toContainText('1.8.2027');
      await expect(summary.extendedCareSection).not.toContainText(summaryTexts.careType.daytimeCare);
      await expect(summary.extendedCareSection).not.toContainText(summaryTexts.careExtent.careExtent4to6Hours);
    });

    test('stepper shows filled steps after logging in again', async () => {
      test.fail(true, 'VETY-200: stepper does not show filled steps when the application is opened again');

      await loginPage.open();
      await loginPage.loginAs(guardian);
      await landingPage.openApplication(child);

      await enrollmentPage.verifyCurrentStep(1);
      for (let step = 2; step <= 8; step++) {
        await enrollmentPage.verifyStepEnabled(step);
      }
      await enrollmentPage.goToStep(8);
      await enrollmentPage.verifyPreviewStepVisible();
    });
  });
});

test.describe('Preview and sending', () => {
  const guardianEmail = 'guardian@example.com';

  test.beforeEach(async () => {
    await enrollmentPage.completeStep7(guardianEmail);
    await enrollmentPage.verifyPreviewStepVisible();
  });

  test('preview shows the child from landing page', async () => {
    const [day, month, year] = childBirthDate.split('.');
    const ssnDate = day.padStart(2, '0') + month.padStart(2, '0') + year.slice(2);

    await expect(enrollmentPage.summaryValue('childName')).toHaveText(child);
    await expect(enrollmentPage.summaryValue('childBirthYear')).toHaveText(year);
    // Henkilötunnus starts with the birth date as ddmmyy
    await expect(enrollmentPage.summaryValue('childSsn')).toHaveText(new RegExp(`^${ssnDate}`));

    await expect(enrollmentPage.summaryValue('guardianName')).toHaveText(guardian.name);
    await expect(enrollmentPage.summaryValue('guardianEmail')).toHaveText(guardianEmail);
  });

  test('sending application returns to login page', async ({ request }) => {
    const applicationId = enrollmentPage.applicationId();

    await enrollmentPage.sendApplication();

    await loginPage.verifyPageLoaded();

    const application = await getApplication(request, applicationId);
    expect(application.status).toBe('submitted');
  });

  test('sent application shows only notice and summary', async () => {
    const applicationId = enrollmentPage.applicationId();

    await enrollmentPage.sendApplication();
    await loginPage.verifyPageLoaded();

    await loginPage.loginAs(guardian);
    await landingPage.openApplication(child);

    expect(enrollmentPage.applicationId()).toBe(applicationId);
    await expect(enrollmentPage.alreadySubmittedNotice).toBeVisible();
    await expect(enrollmentPage.summaryValue('childName')).toHaveText(child);

    // No form: stepper, edit links and navigation are hidden
    await expect(enrollmentPage.stepper).toBeHidden();
    await expect(enrollmentPage.summary.editLanguageLink).toBeHidden();
    await expect(enrollmentPage.summary.editSupportLink).toBeHidden();
    await expect(enrollmentPage.summary.editExtendedCareLink).toBeHidden();
    await expect(enrollmentPage.previousButton).toBeHidden();
    await expect(enrollmentPage.nextButton).toBeHidden();
    await expect(enrollmentPage.sendApplicationButton).toBeHidden();
  });
});
