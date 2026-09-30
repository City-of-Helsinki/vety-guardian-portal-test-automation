import { test, expect } from '@playwright/test';
import { LanguageSelector } from '../components/LanguageSelector';
import { LoginPage } from '../components/LoginPage';
import { loginPage } from '../test-data/loginPage';
import { users } from '../test-data/users';

const selectors = require("../test-data/selectors");

test.describe("HKI-Vety Guardian Portal Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(selectors.mainPagePath);
    const languageSelector = new LanguageSelector(page);
    await languageSelector.select('fi');  // By default goes to english language regardless of locale
  });
  
  test("Login page: Check elements", async ({ page }) => {

    await test.step("Check login page title", async () => {
      await expect(page).toHaveTitle('vety-guardian-portal-front');
    });

    await test.step("Check login page heading", async () => {
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(loginPage.heading.fi);
    });

    await test.step("Check login buttons", async () => {
      const login = new LoginPage(page);
      for (const user of Object.values(users)) {
        await expect(login.loginButton(user)).toBeVisible();
      }
    });

    await test.step("Check login", async () => {
      await new LoginPage(page).loginAs(users.parent);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('landing.title');
    });
  });

  test("Login page: Test language selector", async ({ page }) => {
    const languageSelector = new LanguageSelector(page);
    
    await test.step("Check language names", async () => {
      await languageSelector.expectButtonLabels();
    });

    await test.step("Test language changes", async () => {
      await languageSelector.select('en');
      await languageSelector.expectCurrentLanguage('en');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(loginPage.heading.en);
      await languageSelector.select('sv');
      await languageSelector.expectCurrentLanguage('sv');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(loginPage.heading.sv);
      await languageSelector.select('fi');
      await languageSelector.expectCurrentLanguage('fi');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(loginPage.heading.fi);
    });
  });

  test("Login page: Check header", async ({ page }) => {
    await test.step("Check header text", async () => {
      await expect(page.getByRole('link', { name: 'test' })).toBeVisible();
    });
  });
});
