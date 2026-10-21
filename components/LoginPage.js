import { expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Helsinki-profiili session cookies saved by tests/auth.setup.js, one file per user
export function authFile(user) {
  return path.resolve(__dirname, `../playwright/.auth/${user.key}.json`);
}

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByTestId('title-home');
    this.loginButton = page.getByTestId('btn-login');

    // Header
    this.headerLoginButton = page.locator('#btn-header-login');
    this.loggedInUser = page.locator('#action-bar-user');
    this.logoutButton = page.locator('#btn-logout');

    // Shown on the landing page when the backend rejects the login
    this.identityError = page.getByTestId('notification-identity-error');
    this.landingChildren = page.getByTestId('dependant-list');

    // suomi.fi test identification (Testitunnistaja)
    this.testIdentifierLink = page.locator('#fakevetuma2');
    this.ssnInput = page.locator('#hetu_input');
    this.identifyButton = page.locator('#tunnistaudu');
    this.continueToServiceButton = page.locator('#continue-button');
  }

  async open() {
    await this.page.goto('/');
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/\/$/);
    await expect(this.loginButton).toBeVisible();
  }

  // Logs in from the login page. user from test-data/users.js.
  // Uses the user's saved Helsinki-profiili session when there is one, so
  // the suomi.fi identification is skipped. Otherwise identifies with suomi.fi.
  async loginAs(user, { useSavedSession = true } = {}) {
    const context = this.page.context();
    await context.clearCookies();
    if (useSavedSession && fs.existsSync(authFile(user))) {
      await context.addCookies(JSON.parse(fs.readFileSync(authFile(user), 'utf8')).cookies);
    }

    await this.loginButton.click();

    const landing = this.landingChildren.or(this.identityError);
    await landing.or(this.testIdentifierLink).first().waitFor({ timeout: 20000 });
    if (await this.testIdentifierLink.isVisible()) {
      await this.identifyWithSuomiFi(user);
    }

    // The backend may reject the login token if the identity service's clock
    // is ahead of the backend's. Reloading checks the identity again.
    await landing.first().waitFor({ timeout: 20000 });
    if (await this.identityError.isVisible()) {
      await this.page.reload();
    }

    await expect(this.landingChildren, `Login as ${user.firstName} should open the landing page`).toBeVisible({ timeout: 20000 });
    // Header has the first name and the user menu (Kirjaudu ulos)
    await expect(this.loggedInUser).toContainText(user.firstName);
  }

  // suomi.fi test identification: Testitunnistaja -> henkilötunnus -> Jatka palveluun
  async identifyWithSuomiFi(user) {
    await this.testIdentifierLink.click();
    // Tunnistaudu is enabled only after typing, fill() does not enable it
    await this.ssnInput.pressSequentially(user.ssn);
    await this.identifyButton.click();
    await this.continueToServiceButton.click();
  }

  async logout() {
    await this.loggedInUser.click();
    await this.logoutButton.click();
  }
}
