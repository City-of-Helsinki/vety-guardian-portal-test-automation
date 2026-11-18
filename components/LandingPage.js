import { expect } from '@playwright/test';

export class LandingPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByTestId('title-landing');

    // Children are numbered in testids: dependant-0, dependant-name-0, ...
    this.children = page.getByTestId(/^dependant-\d+$/);
    this.childNames = page.getByTestId(/^dependant-name-\d+$/);

    // Shown when anyone in the family (guardian, child or other guardian) has turvakielto
    this.securityNotification = page.getByTestId('notification-turvakielto');
    this.noChildrenText = page.getByTestId('text-no-dependants');
  }

  async open() {
    await this.page.goto('/landing');
    await this.verifyPageLoaded();
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/\/landing$/);
    await expect(this.heading).toBeVisible();
  }

  // Card of one child
  child(childName) {
    return this.children.filter({
      has: this.childNames.and(this.page.getByText(childName, { exact: true })),
    });
  }

  // Button that opens (or creates) the child's application
  applicationButton(childName) {
    return this.child(childName).getByTestId(/^btn-open-application-\d+$/);
  }

  // Opens (or creates) the child's application: /application/<application id>
  async openApplication(childName) {
    await this.applicationButton(childName).click();
    await expect(this.page).toHaveURL(/\/application\/[^/]+$/);
  }

  // Returns the birth date shown on the child's card, e.g. '1.2.2016'
  async childBirthDate(childName) {
    const ageText = await this.child(childName)
      .getByTestId(/^dependant-age-\d+$/)
      .textContent();

    return ageText.split(' - ')[0].trim();
  }

  async expectChildren(childNames) {
    await expect(this.childNames).toHaveText(childNames);
  }

  async expectSecurityNotificationVisible() {
    await expect(this.securityNotification).toBeVisible();
  }

  async expectSecurityNotificationHidden() {
    await expect(this.securityNotification).toBeHidden();
  }

  // With turvakielto in the family, the child is listed without the application card
  async expectNoApplication(childName) {
    await expect(this.child(childName)).toBeVisible();
    await expect(this.child(childName).getByTestId(/^dependant-application-title-\d+$/)).toBeHidden();
    await expect(this.applicationButton(childName)).toBeHidden();
  }
}
