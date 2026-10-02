import { expect } from '@playwright/test';

export class LandingPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByTestId('title-landing');

    // Children are numbered in testids: dependant-0, dependant-name-0, ...
    this.children = page.getByTestId(/^dependant-\d+$/);
    this.childNames = page.getByTestId(/^dependant-name-\d+$/);

    // Shown for a guardian with turvakielto
    this.securityNotification = page.getByTestId('notification-turvakielto');
    this.noChildrenText = page.getByTestId('text-no-dependants');
  }

  // Card of one child
  child(childName) {
    return this.children.filter({
      has: this.childNames.and(this.page.getByText(childName, { exact: true })),
    });
  }

  // Opens (or creates) the child's application: /application/<application id>
  async openApplication(childName) {
    await this.child(childName).getByTestId(/^btn-open-application-\d+$/).click();
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
}
