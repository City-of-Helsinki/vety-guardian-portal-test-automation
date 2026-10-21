import { test, expect } from '@playwright/test';
import { LanguageSelector } from '../components/LanguageSelector';
import { LoginPage } from '../components/LoginPage';
import { LandingPage } from '../components/LandingPage';
import { users } from '../test-data/users';

test.describe("HKI-Vety Guardian Portal Landing Page", () => {
  let loginPage;
  let landingPage;

  test.beforeEach(async ({ page }) => {
    const languageSelector = new LanguageSelector(page);
    loginPage = new LoginPage(page);
    landingPage = new LandingPage(page);
    await loginPage.open();
    await languageSelector.select('fi');  // Default follows browser language. Select Finnish so tests don't depend on it.
  });

  test("Landing page: Check elements", async ({ page }) => {
    await loginPage.loginAs(users.mother);

    const languageSelector = new LanguageSelector(page);

    await test.step("Check landing page title", async () => {
      await expect(page).toHaveTitle('vety-guardian-portal-front');
    });

    await test.step("Check landing page heading", async () => {
      await expect(landingPage.heading).toHaveText('landing.title');
    });

    await test.step("Check landing page header", async () => {
      await expect(page.getByRole('link', { name: 'test' })).toBeVisible();
    });
    
    await test.step("Check landing page language selector", async () => {
      await languageSelector.expectLanguagesVisible();
    });
  });

  for (const user of Object.values(users)) {
    test(`Landing page: ${user.firstName} sees the child`, async () => {
      await loginPage.loginAs(user);
      await landingPage.expectChildren(user.children);
    });
  }

  // No test people for these yet in the suomi.fi test data and the VTJ mock
  test.skip("Landing page: Guardian with two children", async () => {});
  test.skip("Landing page: Guardian with turvakielto", async () => {});
});
