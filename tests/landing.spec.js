import { test, expect } from '@playwright/test';
import { LanguageSelector } from '../components/LanguageSelector';
import { loginPage } from '../test-data/loginPage';

const selectors = require("../test-data/selectors");

test.describe("HKI-Vety Guardian Portal Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    const languageSelector = new LanguageSelector(page);
    await page.goto(selectors.mainPagePath);
    await languageSelector.select('fi');  // By default goes to english language regardless of locale
  });

  test("Landing page: Check elements", async ({ page }) => {
    // Login is just a login button for now. Add user/password later.
    await page.getByRole('link', { name: loginPage.loginButton.fi }).click();

    const languageSelector = new LanguageSelector(page);

    await test.step("Check landing page title", async () => {
      await expect(page).toHaveTitle('vety-guardian-portal-front');
    });

    await test.step("Check landing page heading", async () => {
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('landing.title');
    });

    await test.step("Check landing page header", async () => {
      await expect(page.getByRole('link', { name: 'test' })).toBeVisible();
    });
    
    await test.step("Check landing page language selector", async () => {
      await languageSelector.expectLanguagesVisible();
    });
  });

  test("Landing page: Check child with enroll enabled", async ({ page }) => {
    await page.getByRole('link', { name: loginPage.loginButton.fi }).click();  // user 1 (2/3 children eligible)

    await test.step("Check child details", async () => {
      // Now hardcoded children, and no data-testids. Let's just pick one for now.
      await page.getByRole('link', { name: 'landing.applicationLink' }).first().click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esiopetukseen ilmoittautuminen');
    });
  });


});