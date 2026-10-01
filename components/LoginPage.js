import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole('heading', { level: 1 });
  }

  // user from test-data/users.js
  loginButton(user) {
    return this.page.getByRole('button', {
      name: `Login: ${user.name} (${user.ssn})`,
      exact: true,
    });
  }

  async open() {
    await this.page.goto('/');
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/\/$/);
    await expect(
      this.page.getByRole('button', { name: /^Login: / }).first()
    ).toBeVisible();
  }

  async loginAs(user) {
    await this.loginButton(user).click();
    await expect(this.page).toHaveURL(/\/landing$/);
  }
}
