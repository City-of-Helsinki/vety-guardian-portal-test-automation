// pages/PreschoolEnrollmentPage.js

import { expect } from '@playwright/test';

export class PreschoolEnrollmentPage {
  constructor(page) {
    this.page = page;

    // Page heading
    this.pageHeading = page.getByTestId('title-application');

    // Stepper. Step testids start from 0: stepper-step-0 is step 1.
    this.stepper = page.getByTestId('stepper');
    this.currentStep = this.stepper.locator('[aria-current="step"]');

    // Step 1 - Alku
    this.startHeading = page.getByTestId('step-alku-title');

    this.privatePreschoolCheckbox = page.getByTestId('cb-hakenut-yksityiseen');

    // Accordion
    this.addressChangeAccordionContainer = page.getByTestId('accordion-osoitemuutos');

    this.addressChangeAccordion = this.addressChangeAccordionContainer.getByRole('button', {
      name: 'Onko lapsen kotiosoite muuttumassa?',
    });

    // Close button testid has a generated accordion id, e.g. accordion-9-closeButton
    this.closeAddressChangeAccordion = this.addressChangeAccordionContainer.getByTestId(
      /-closeButton$/
    );

    // Navigation buttons
    this.previousButton = page.getByTestId('btn-previous');
    this.nextButton = page.getByTestId('btn-next');

    // Step 2 - Esiopetuksen kieli

    this.preschoolLanguageHeading = page.getByTestId('step-kieli-title');

    this.finnishLanguageRadio = page.getByTestId('rb-eo-kieli-fi');
    this.swedishLanguageRadio = page.getByTestId('rb-eo-kieli-sv');

    // Step 3 - Täydentävä varhaiskasvatus

    this.extendedCareHeading = page.getByTestId('step-taydentava-title');

    this.needsExtendedCareRadio = page.getByTestId('rb-extended-care');
    this.noExtendedCareRadio = page.getByTestId('rb-no-extended-care');

    this.varhaiskasvatusmaksutLink = page.getByTestId('link-vk-maksut');

    // Step 4 - Aloituspäivä ja hoidon tarve
    this.startAndCareNeedHeading = page.getByTestId('step-hoidon-tarve-title');

    this.extendedCareStartDate = page.getByTestId(
      'date-extended-care-start'
    );

    this.openDatePickerButton = page
      .getByTestId('fieldset-aloitus-pvm')
      .getByRole('button');

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

    this.careExtentHeading = page.getByTestId('step-varhaiskasvatuksen-laajuus-title');

    //
    // Step 5 variants
    //

    const absenceDays = page.getByTestId('fieldset-arkipoissaolot');

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

        decreaseAbsenceDaysButton: absenceDays.getByRole(
          'button',
          { name: 'Decrease by one' }
        ),

        increaseAbsenceDaysButton: absenceDays.getByRole(
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

    this.supportNeedsHeading = page.getByTestId('step-tuki-ja-laakehoito-title');

    this.specialSupportCheckbox = page.getByTestId('cb-erityinen-tuki');
    this.medicationNeedCheckbox = page.getByTestId('cb-laakehoidon-tarve');

    // Step 7 - Yhteystiedot

    this.contactInfoHeading = page.getByTestId('step-yhteystiedot-title');

    this.guardianEmailInput = page.getByTestId('input-h1-sahkoposti');
    this.guardianEmailConfirmInput = page.getByTestId('input-h1-sahkoposti-confirm');
    this.otherGuardianEmailInput = page.getByTestId('input-h2-sahkoposti');
    this.otherGuardianEmailConfirmInput = page.getByTestId('input-h2-sahkoposti-confirm');

    // Step 8 - Esikatselu ja lähetys

    this.previewHeading = page.getByTestId('step-esikatselu-title');

    this.sendApplicationButton = page.getByTestId('btn-submit');

    // Shown on the preview when the application has already been sent
    this.alreadySubmittedNotice = page.getByTestId('notification-already-submitted');

    this.summary = {
      childSection: page.getByTestId('section-lapsen-tiedot'),
      languageSection: page.getByTestId('section-kieli'),
      supportSection: page.getByTestId('section-tuki-ja-laakehoito'),
      extendedCareSection: page.getByTestId('section-varhaiskasvatus'),
      guardianSection: page.getByTestId('section-huoltajan-tiedot'),
      // Shown when the child has another guardian
      otherGuardiansSection: page.getByTestId('section-muut-huoltajat'),

      // Shown only when selected on step 6
      specialSupport: page.getByTestId('summary-erityinen-tuki'),
      medicationNeed: page.getByTestId('summary-laakehoito'),

      // Muokkaa links
      editLanguageLink: page.getByTestId('go-to-kieli'),
      editSupportLink: page.getByTestId('go-to-tuki-ja-laakehoito'),
      editExtendedCareLink: page.getByTestId('go-to-taydentava'),
    };

    // Summary values: summary-<name>-value
    this.summaryValueNames = {
      childName: 'lapsi-nimi',
      childSsn: 'lapsi-henkilotunnus',
      childBirthYear: 'lapsi-syntymavuosi',
      childAddress: 'lapsi-karttaosoite',
      preschoolStart: 'esiopetus-alkaa',
      extendedCareStart: 'taydentava-alkaa',
      // Two values: care type (step 4) and care extent (step 5)
      extendedCareExtent: 'taydentava-laajuus',
      guardianName: 'h1-nimi',
      guardianAddress: 'h1-osoite',
      guardianPhone: 'h1-puhelinnumero',
      guardianEmail: 'h1-sahkoposti',
      otherGuardianName: 'h2-nimi',
      otherGuardianAddress: 'h2-osoite',
      otherGuardianEmail: 'h2-sahkoposti',
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

  // stepNumber 1-8
  stepperStep(stepNumber) {
    return this.page.getByTestId(`stepper-step-${stepNumber - 1}`);
  }

  async goToStep(stepNumber) {
    await this.stepperStep(stepNumber).click();
  }

  async verifyCurrentStep(stepNumber) {
    await expect(this.stepperStep(stepNumber)).toHaveAttribute('aria-current', 'step');
  }

  async verifyStepEnabled(stepNumber) {
    await expect(this.stepperStep(stepNumber)).toBeEnabled();
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

  async verifyOtherGuardianEmailHasError() {
    await expect(this.otherGuardianEmailInput).toHaveAccessibleDescription(/\S/);
  }

  // Step 8 /////////////////////////////////////////////////////
  async verifyPreviewStepVisible() {
    await expect(this.previewHeading).toBeVisible();
  }

  // name: key of this.summaryValueNames, e.g. 'childName'
  summaryValue(name) {
    return this.page.getByTestId(`summary-${this.summaryValueNames[name]}-value`);
  }

  // link: one of this.summary.edit*Link. Opens the step where the answer is edited.
  async editFromSummary(link) {
    await link.click();
    await expect(this.previewHeading, 'Step should open for editing').toBeHidden();
  }

  // From any step after the summary has been reached once
  async returnToSummary() {
    for (let i = 0; i < 7 && !(await this.previewHeading.isVisible()); i++) {
      await this.clickNext();
    }
    await this.verifyPreviewStepVisible();
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
    await this.goToStep(stepNumber);
  }
}