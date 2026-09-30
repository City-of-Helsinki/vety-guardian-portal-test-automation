import { expect } from '@playwright/test';

export class LandingPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole('heading', { level: 1 });

    // No data-testids yet. Each child has a name card and an application card
    // side by side inside a common parent element.
    this.childNameCards = page.locator('[class*="dependant-card"]');
    this.childNames = this.childNameCards.getByRole('heading', { level: 2 });

    // Shown for a guardian with turvakielto
    this.securityNotification = page.getByRole('region', {
      name: 'Notification',
    });
  }

  // Name card + application card of one child
  child(childName) {
    return this.childNameCards
      .filter({
        has: this.page.getByRole('heading', { name: childName, exact: true }),
      })
      .locator('xpath=..');
  }

  // Opens (or creates) the child's application: /application/<application id>
  async openApplication(childName) {
    await this.child(childName).getByRole('button').click();
    await expect(this.page).toHaveURL(/\/application\/[^/]+$/);
  }

  async expectChildren(childNames) {
    await expect(this.childNames).toHaveText(childNames);
  }

  async expectSecurityNotificationVisible() {
    await expect(this.securityNotification).toBeVisible();
  }
}
