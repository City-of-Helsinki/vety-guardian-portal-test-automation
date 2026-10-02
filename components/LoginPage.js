import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByTestId('title-home');
    this.loginButtons = page.getByTestId(/^btn-login-/);
  }

  // user from test-data/users.js
  loginButton(user) {
    return this.page.getByTestId(`btn-login-${user.ssn}`);
  }

  async open() {
    await this.page.goto('/');
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/\/$/);
    await expect(this.loginButtons.first()).toBeVisible();
  }

  async loginAs(user) {
    await this.loginButton(user).click();
    await expect(this.page).toHaveURL(/\/landing$/);
  }
}
