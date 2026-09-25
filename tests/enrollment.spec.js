import { test, expect } from '@playwright/test';
import { LanguageSelector } from '../components/LanguageSelector';
import { PreschoolEnrollmentPage } from '../components/PreschoolEnrollmentPage';

test.describe('Preschool enrollment', () => {
  let enrollmentPage;

  test.beforeEach(async ({ page }) => {
    enrollmentPage = new PreschoolEnrollmentPage(page);
    const languageSelector = new LanguageSelector(page);
    await page.goto('/application');
    await languageSelector.select('fi');  // By default goes to english language regardless of locale
  });

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