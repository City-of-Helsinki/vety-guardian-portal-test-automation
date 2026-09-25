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

    this.extendedCareHeading = page.getByRole('heading', {
      name: 'Täydentävän varhaiskasvatuksen tarve',
    });

    this.needsExtendedCareRadio = page.getByTestId('rb-extended-care');
    this.noExtendedCareRadio = page.getByTestId('rb-no-extended-care');

    this.varhaiskasvatusmaksutLink = page.getByTestId('link-vk-maksut');

    // Step 4 - Aloituspäivä ja hoidon tarve
    this.startAndCareNeedHeading = page.getByRole('heading', {
      name: 'Aloituspäivä ja varhaiskasvatuksen tarve',
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
  }

  // Generic methods //////////////////////////////////////////
  async verifyPageLoaded() {
    await expect(this.pageHeading).toBeVisible();
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async clickPrevious() {
    await this.previousButton.click();
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

  async openStep(stepNumber) {
    await this.page
      .locator(`[aria-label*="Vaihe ${stepNumber}/8"]`)
      .click();
  }
}