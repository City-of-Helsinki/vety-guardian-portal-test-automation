// pages/PreschoolEnrollmentPage.js

import { expect } from '@playwright/test';

export class PreschoolEnrollmentPage {
  constructor(page) {
    this.page = page;

    // Page heading
    this.pageHeading = page.getByRole('heading', {
      name: 'Esiopetukseen ilmoittautuminen',
      exact: true,
    });

    // Stepper
    this.stepper = page.locator('[class*="Stepper-module_stepper"]');
    this.currentStep = page.locator('[aria-current="step"]');

    // Step 1 controls
    this.privatePreschoolCheckbox = page.getByLabel(
      'Olemme hakeneet esiopetusta ensisijaisesti yksityisestä päiväkodista.'
    );

    // Accordion
    this.addressChangeAccordion = page.getByRole('button', {
      name: 'Onko lapsen kotiosoite muuttumassa?',
    });

    this.closeAddressChangeAccordion = page.getByTestId(
      'accordion-1-closeButton'
    );

    // Navigation buttons
    this.previousButton = page.getByRole('button', {
      name: 'Edellinen sivu',
    });

    this.nextButton = page.getByRole('button', {
      name: 'Jatka seuraavaan',
    });

    // Step 2 - Esiopetuksen kieli

    this.preschoolLanguageHeading = page.getByRole('heading', {
      name: 'Esiopetuksen kieli',
      exact: true,
    });

    this.finnishLanguageRadio = page.getByTestId('rb-eo-kieli-fi');
    this.swedishLanguageRadio = page.getByTestId('rb-eo-kieli-sv');

    // Step 3 - Täydentävä varhaiskasvatus

    // Step 3 h2 is the same as in steps 4 and 5, so use the radio group label
    this.extendedCareHeading = page.getByRole('group', {
      name: 'Täydentävän varhaiskasvatuksen tarve',
      exact: true,
    });

    this.needsExtendedCareRadio = page.getByTestId('rb-extended-care');
    this.noExtendedCareRadio = page.getByTestId('rb-no-extended-care');

    this.varhaiskasvatusmaksutLink = page.getByTestId('link-vk-maksut');

    // Step 4 - Aloituspäivä ja hoidon tarve
    this.startAndCareNeedHeading = page.getByRole('heading', {
      name: 'Täydentävän varhaiskasvatuksen tarve ja aloituspäivä',
      exact: true,
    });

    this.extendedCareStartDate = page.getByTestId(
      'date-extended-care-start'
    );

    this.openDatePickerButton = page.getByRole('button', {
      name: 'Choose date',
    });

    this.daytimeCareRadio = page.getByTestId(
      'rb-paivaaikainen_varhaiskasvatus'
    );

    this.dayAndEveningCareRadio = page.getByTestId(
      'rb-paiva_ja_ilta_aikainen_varhaiskasvatus_arkisin'
    );

    this.roundTheClockCareRadio = page.getByTestId(
      'rb-ymparivuorokautinen_varhaiskasvatus'
    );

    // Step 5 - Varhaiskasvatuksen laajuus

    // Step 5 h2 is the same as step 4, so use the care extent radio group label
    this.careExtentHeading = page.getByRole('group', {
      name: 'Varhaiskasvatuksen ja esiopetuksen laajuus yhteensä',
    });

    //
    // Step 5 variants
    //

    this.step5 = {
      daytimeCare: {
        careExtentMax1Hour: page.getByTestId(
          'rb-esiopetus_4h_1h_vaka'
        ),

        careExtent1to3Hours: page.getByTestId(
          'rb-esiopetus_4h_1_3h_vaka'
        ),

        careExtent3to4Hours: page.getByTestId(
          'rb-esiopetus_4h_3_4h_vaka'
        ),

        careExtent4to6Hours: page.getByTestId(
          'rb-esiopetus_4h_4_6h_vaka'
        ),

        weekdayAbsenceDaysInput: page.getByTestId(
          'input-arki-poissaolot'
        ),

        decreaseAbsenceDaysButton: page.getByRole(
          'button',
          { name: 'Decrease by one' }
        ),

        increaseAbsenceDaysButton: page.getByRole(
          'button',
          { name: 'Increase by one' }
        ),
      },

      dayAndEveningCare: {
        // To be added later
      },

      roundTheClockCare: {
        // To be added later
      },
    };

    // Step 6 - Tuki ja lääkehoidon tarve

    this.supportNeedsHeading = page.getByRole('heading', {
      name: 'Erityisen tuen ja lääkehoidon tarve',
    });

    this.specialSupportCheckbox = page.getByTestId('cb-erityinen-tuki');
    this.medicationNeedCheckbox = page.getByTestId('cb-laakehoidon-tarve');

    // Step 7 - Yhteystiedot

    this.contactInfoHeading = page.getByRole('heading', {
      name: 'Yhteystiedot',
      exact: true,
    });

    const guardianEmailGroup = page.getByRole('group', {
      name: 'Huoltajan sähköpostiosoite',
      exact: true,
    });
    const otherGuardianEmailGroup = page.getByRole('group', {
      name: 'Toisen huoltajan sähköpostiosoite',
      exact: true,
    });

    this.guardianEmailInput = guardianEmailGroup.getByRole('textbox', {
      name: 'Sähköpostiosoite',
      exact: true,
    });
    this.guardianEmailConfirmInput = guardianEmailGroup.getByRole('textbox', {
      name: 'Sähköpostiosoite uudestaan',
      exact: true,
    });
    this.otherGuardianEmailInput = otherGuardianEmailGroup.getByRole('textbox', {
      name: 'Sähköpostiosoite',
      exact: true,
    });
    this.otherGuardianEmailConfirmInput = otherGuardianEmailGroup.getByRole('textbox', {
      name: 'Sähköpostiosoite uudestaan',
      exact: true,
    });

    // Step 8 - Esikatselu ja lähetys

    this.previewHeading = page.getByRole('heading', {
      name: 'Esikatselu ja lähetys',
      exact: true,
    });

    this.sendApplicationButton = page.getByRole('button', {
      name: 'Lähetä hakemus',
    });

    // Shown instead of the form when the application has already been sent
    this.alreadySubmittedNotice = page.getByRole('heading', {
      name: 'esikatselu.alreadySubmitted',
    });

    this.childInfoSection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'Lapsen tiedot', exact: true }),
    });
    this.guardianInfoSection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'Huoltajan tiedot', exact: true }),
    });

    // Labels of the preview values. No data-testids yet and labels are still
    // translation keys, so update these when the texts are added.
    this.previewLabels = {
      childName: 'esikatselu.lapsenNimi',
      childSsn: 'esikatselu.henkilotunnus',
      childBirthYear: 'esikatselu.syntymavuosi',
      childAddress: 'esikatselu.karttaosoite',
      guardianName: 'esikatselu.huoltajanNimi',
      guardianAddress: 'esikatselu.osoite',
      guardianPhone: 'esikatselu.puhelinnumero',
      guardianEmail: 'esikatselu.sahkoposti',
    };
  }

  // Generic methods //////////////////////////////////////////
  // Application id from the url /application/<id>
  applicationId() {
    return new URL(this.page.url()).pathname.split('/').pop();
  }

  async verifyPageLoaded() {
    await expect(this.pageHeading).toBeVisible();
  }

  // Each step is saved to backend before the next one opens, so wait for the
  // step to change before continuing
  async clickNext() {
    const step = await this.currentStep.getAttribute('aria-label');
    await this.nextButton.click();
    await expect(this.currentStep, 'Next step should open').not.toHaveAttribute('aria-label', step);
  }

  // For validation tests: click next when the step should not change
  async clickNextExpectingError() {
    await this.nextButton.click();
  }

  async clickPrevious() {
    const step = await this.currentStep.getAttribute('aria-label');
    await this.previousButton.click();
    await expect(this.currentStep, 'Previous step should open').not.toHaveAttribute('aria-label', step);
  }

//  async selectRadioByTestId(testId) {
//    await this.page.getByTestId(testId).check();
//  }

  async goToStep(stepNumber) {
    await this.page.locator(
      `[aria-label*="Vaihe ${stepNumber}/8"]`
    ).click();
  }

  async verifyCurrentStep(stepNumber) {
    await expect(
      this.page.locator(
        `[aria-label*="Vaihe ${stepNumber}/8"]`
      )
    ).toHaveAttribute('aria-current', 'step');
  }

  // Labels overlap the radio inputs in these UI components, so click the label instead
  async selectRadio(radio) {
    const id = await radio.getAttribute('id');

    await this.page.locator(`label[for="${id}"]`).click();
  }

  async selectRadioByTestId(testId) {
    await this.selectRadio(this.page.getByTestId(testId));
  }

  async checkCheckboxByTestId(testId) {
    const checkbox = this.page.getByTestId(testId);

    if (!(await checkbox.isChecked())) {
      const id = await checkbox.getAttribute('id');
      await this.page.locator(`label[for="${id}"]`).click();
    }
  }

  async uncheckCheckboxByTestId(testId) {
    const checkbox = this.page.getByTestId(testId);

    if (await checkbox.isChecked()) {
      const id = await checkbox.getAttribute('id');
      await this.page.locator(`label[for="${id}"]`).click();
    }
  }
 
  // Step 1 /////////////////////////////////////////////////////
  async checkPrivatePreschoolApplication() {
    await this.privatePreschoolCheckbox.check();
  }

  async uncheckPrivatePreschoolApplication() {
    await this.privatePreschoolCheckbox.uncheck();
  }

  async verifyPrivatePreschoolApplicationChecked() {
    await expect(this.privatePreschoolCheckbox).toBeChecked();
  }

  async openAddressChangeAccordion() {
    await this.addressChangeAccordion.click();
  }

  async closeAddressChangeInfo() {
    await this.closeAddressChangeAccordion.click();
  }
 
  // Step 2 /////////////////////////////////////////////////////
  async verifyPreschoolLanguageStepVisible() {
    await expect(this.preschoolLanguageHeading).toBeVisible();
  }

  async selectFinnishPreschoolLanguage() {
    await this.selectRadioByTestId('rb-eo-kieli-fi');
  }

  async selectSwedishPreschoolLanguage() {
    await this.selectRadioByTestId('rb-eo-kieli-sv');
  }

  async verifyFinnishLanguageSelected() {
    await expect(this.finnishLanguageRadio).toBeChecked();
  }

  async verifySwedishLanguageSelected() {
    await expect(this.swedishLanguageRadio).toBeChecked();
  }  

  // Step 3 /////////////////////////////////////////////////////
  async verifyExtendedCareStepVisible() {
    await expect(this.extendedCareHeading).toBeVisible();
  }

  async selectNeedsExtendedCare() {
    await this.selectRadioByTestId('rb-extended-care');
  }

  async selectNoExtendedCare() {
    await this.selectRadioByTestId('rb-no-extended-care');
  }

  async verifyNeedsExtendedCareSelected() {
    await expect(this.needsExtendedCareRadio).toBeChecked();
  }

  async verifyNoExtendedCareSelected() {
    await expect(this.noExtendedCareRadio).toBeChecked();
  }

  async verifyVarhaiskasvatusmaksutLinkVisible() {
    await expect(this.varhaiskasvatusmaksutLink).toBeVisible();
  }

  // Step 4 /////////////////////////////////////////////////////
  async verifyStartAndCareNeedStepVisible() {
    await expect(this.startAndCareNeedHeading).toBeVisible();
  }

  async fillExtendedCareStartDate(date) {
    await this.extendedCareStartDate.fill(date);
  }

  // Date is shown without leading zeros, e.g. '1.8.2027'
  async verifyExtendedCareStartDate(date) {
    await expect(this.extendedCareStartDate).toHaveValue(date);
  }

  async openDatePicker() {
    await this.openDatePickerButton.click();
  }

  async selectDaytimeCare() {
    await this.selectRadioByTestId('rb-paivaaikainen_varhaiskasvatus');
  }

  async selectDayAndEveningCare() {
    await this.selectRadioByTestId('rb-paiva_ja_ilta_aikainen_varhaiskasvatus_arkisin');
  }

  async selectRoundTheClockCare() {
    await this.selectRadioByTestId('rb-ymparivuorokautinen_varhaiskasvatus');
  }

  async verifyDaytimeCareSelected() {
    await expect(this.daytimeCareRadio).toBeChecked();
  }

  async verifyDayAndEveningCareSelected() {
    await expect(this.dayAndEveningCareRadio).toBeChecked();
  }

  async verifyRoundTheClockCareSelected() {
    await expect(this.roundTheClockCareRadio).toBeChecked();
  }
  // Step 5 /////////////////////////////////////////////////////
  //
  // Step 5 - Daytime care variant
  //
  async verifyCareExtentStepVisible() {
    await expect(this.careExtentHeading).toBeVisible();
  }

  async setDaytimeCareWeekdayAbsenceDays(days) {
    await this.step5.daytimeCare.weekdayAbsenceDaysInput.fill(
      String(days)
    );
  }

  async verifyDaytimeCareWeekdayAbsenceDays(days) {
    await expect(this.step5.daytimeCare.weekdayAbsenceDaysInput).toHaveValue(
      String(days)
    );
  }

  async increaseDaytimeCareWeekdayAbsenceDays() {
    await this.step5.daytimeCare.increaseAbsenceDaysButton.click();
  }

  async decreaseDaytimeCareWeekdayAbsenceDays() {
    await this.step5.daytimeCare.decreaseAbsenceDaysButton.click();
  }

  //
  // Generic helpers
  //

  // Usage: await page.selectDaytimeCareExtent('careExtent4to6Hours');
  async selectDaytimeCareExtent(extent) {
    await this.selectRadio(this.step5.daytimeCare[extent]);
  }
  
  async verifyDaytimeCareExtentSelected(extent) {
    await expect(
      this.step5.daytimeCare[extent]
    ).toBeChecked();
  }

  // Step 6 /////////////////////////////////////////////////////
  async verifySupportNeedsStepVisible() {
    await expect(this.supportNeedsHeading).toBeVisible();
  }

  async selectSpecialSupport() {
    await this.checkCheckboxByTestId('cb-erityinen-tuki');
  }

  async unselectSpecialSupport() {
    await this.uncheckCheckboxByTestId('cb-erityinen-tuki');
  }

  async selectMedicationNeed() {
    await this.checkCheckboxByTestId('cb-laakehoidon-tarve');
  }

  async unselectMedicationNeed() {
    await this.uncheckCheckboxByTestId('cb-laakehoidon-tarve');
  }

  async verifySpecialSupportSelected() {
    await expect(this.specialSupportCheckbox).toBeChecked();
  }

  async verifyMedicationNeedSelected() {
    await expect(this.medicationNeedCheckbox).toBeChecked();
  }

  async verifySpecialSupportNotSelected() {
    await expect(this.specialSupportCheckbox).not.toBeChecked();
  }

  async verifyMedicationNeedNotSelected() {
    await expect(this.medicationNeedCheckbox).not.toBeChecked();
  }

  // Step 7 /////////////////////////////////////////////////////
  async verifyContactInfoStepVisible() {
    await expect(this.contactInfoHeading).toBeVisible();
  }

  async fillGuardianEmail(email) {
    await this.guardianEmailInput.fill(email);
    await this.guardianEmailConfirmInput.fill(email);
  }

  async fillOtherGuardianEmail(email) {
    await this.otherGuardianEmailInput.fill(email);
    await this.otherGuardianEmailConfirmInput.fill(email);
  }

  async verifyGuardianEmail(email) {
    await expect(this.guardianEmailInput).toHaveValue(email);
    await expect(this.guardianEmailConfirmInput).toHaveValue(email);
  }

  async verifyOtherGuardianEmail(email) {
    await expect(this.otherGuardianEmailInput).toHaveValue(email);
    await expect(this.otherGuardianEmailConfirmInput).toHaveValue(email);
  }

  // Error messages are linked to the input with aria-describedby. Error texts
  // are not final yet, so only check that there is one.
  async verifyGuardianEmailHasError() {
    await expect(this.guardianEmailInput).toHaveAccessibleDescription(/\S/);
  }

  async verifyGuardianEmailConfirmHasError() {
    await expect(this.guardianEmailConfirmInput).toHaveAccessibleDescription(/\S/);
  }

  // Step 8 /////////////////////////////////////////////////////
  async verifyPreviewStepVisible() {
    await expect(this.previewHeading).toBeVisible();
  }

  // section: this.childInfoSection or this.guardianInfoSection
  // field: key of this.previewLabels, e.g. 'childName'
  previewValue(section, field) {
    return section
      .locator('[class*="label-value"]')
      .filter({
        has: this.page.getByText(this.previewLabels[field], { exact: true }),
      })
      .locator('span')
      .last();
  }

  async sendApplication() {
    await this.sendApplicationButton.click();
  }

  // Step helpers ///////////////////////////////////////////////
  async completeStep1() {
    await this.clickNext();
  }

  async completeStep2() {
    await this.completeStep1();

    await this.selectFinnishPreschoolLanguage();
    await this.clickNext();
  }

  async completeStep3() {
    await this.completeStep2();

    await this.selectNeedsExtendedCare();
    await this.clickNext();
  }

  async completeStep4() {
    await this.completeStep3();

    await this.fillExtendedCareStartDate('01.08.2027');
    await this.selectDaytimeCare();

    await this.clickNext();
  }

  async completeStep5() {
    await this.completeStep4();

    await this.selectDaytimeCareExtent(
      'careExtent4to6Hours'
    );

    await this.setDaytimeCareWeekdayAbsenceDays(2);

    await this.clickNext();
  }

  async completeStep6() {
    await this.completeStep5();

    await this.clickNext();
  }

  async completeStep7(guardianEmail = 'test@example.com') {
    await this.completeStep6();

    await this.fillGuardianEmail(guardianEmail);
    await this.clickNext();
  }

  async openStep(stepNumber) {
    await this.page
      .locator(`[aria-label*="Vaihe ${stepNumber}/8"]`)
      .click();
  }
}