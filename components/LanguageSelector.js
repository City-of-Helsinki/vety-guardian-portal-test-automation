import { expect } from '@playwright/test';

export class LanguageSelector {
  constructor(page) {
    this.page = page;
  }

  button(languageCode) {
    return this.page.locator(`button[lang="${languageCode}"]`);
  }

  async select(languageCode) {
    await this.button(languageCode).click();
  }

  async getCurrentLanguage() {
    const activeButton = this.page.locator('button[aria-current="true"]');
    return activeButton.getAttribute('lang');
  }

  async expectCurrentLanguage(languageCode) {
    await expect(
      this.page.locator(
        `button[lang="${languageCode}"][aria-current="true"]`
      )
    ).toBeVisible();
  }

  async expectLanguagesVisible() {
    await expect(this.button('fi')).toBeVisible();
    await expect(this.button('sv')).toBeVisible();
    await expect(this.button('en')).toBeVisible();
  }

  async expectButtonLabels() {
    await expect(this.button('fi')).toHaveText('Suomi');
    await expect(this.button('sv')).toHaveText('Svenska');
    await expect(this.button('en')).toHaveText('English');
  }

  async expectButtonLabel(languageCode, expectedLabel) {
    await expect(this.button(languageCode)).toHaveText(expectedLabel);
  }
}