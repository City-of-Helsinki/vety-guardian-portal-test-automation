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
    await languageSelector.select('fi');  // By default goes to english language regardless of locale
  });

  test("Landing page: Check elements", async ({ page }) => {
    await loginPage.loginAs(users.parent);

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

  test("Landing page: Guardian with two children", async () => {
    await loginPage.loginAs(users.parent);
    await landingPage.expectChildren(users.parent.children);
  });

  test("Landing page: Guardian with one child", async () => {
    await loginPage.loginAs(users.otherParent);
    await landingPage.expectChildren(users.otherParent.children);
  });

  test("Landing page: Guardian with turvakielto", async () => {
    await loginPage.loginAs(users.protectedPerson);
    await landingPage.expectSecurityNotificationVisible();
    await landingPage.expectChildren([]);
  });
});
