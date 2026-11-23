import { test, expect } from '@playwright/test';
import { LanguageSelector } from '../components/LanguageSelector';
import { LoginPage } from '../components/LoginPage';
import { LandingPage } from '../components/LandingPage';
import { users } from '../test-data/users';
import { getDependants, requestApplicationForDependant } from '../utils/api';

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
      await expect(landingPage.heading).toHaveText('Etusivu');
    });

    await test.step("Check landing page header", async () => {
      await expect(page.getByRole('banner').locator('a[href="/"]')).toBeVisible();
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

  test("Landing page: Guardian without turvakielto can open the application", async () => {
    const user = users.mother;
    await loginPage.loginAs(user);

    await landingPage.expectSecurityNotificationHidden();
    await expect(landingPage.applicationButton(user.children[0])).toBeVisible();
  });

  // No test people for this yet in the suomi.fi test data and the VTJ mock
  test.skip("Landing page: Guardian with two children", async () => {});
});

// Turvakielto of anyone in the family hides the application: the landing page
// shows a notification and the children without the application card
test.describe("HKI-Vety Guardian Portal Landing Page: Turvakielto", () => {
  const cases = [
    { name: 'Guardian with turvakielto', user: users.guardianWithTurvakielto },
    { name: 'Guardian of a child with turvakielto', user: users.guardianOfChildWithTurvakielto },
  ];

  for (const { name, user } of cases) {
    test.describe(name, () => {
      let landingPage;

      test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        landingPage = new LandingPage(page);
        await loginPage.open();
        await new LanguageSelector(page).select('fi');
        await loginPage.loginAs(user);
      });

      test(`Landing page: ${user.firstName} sees the turvakielto notification`, async () => {
        await landingPage.expectSecurityNotificationVisible();
      });

      test(`Landing page: ${user.firstName} sees the child without the application`, async () => {
        await landingPage.expectChildren(user.children);
        for (const child of user.children) {
          await landingPage.expectNoApplication(child);
        }
      });

      test(`Backend refuses ${user.firstName}'s application`, async ({ page }) => {
        // The landing page has synced the family from VTJ to backend
        const dependants = await getDependants(page);
        expect(dependants.length, 'Guardian should have children in backend').toBeGreaterThan(0);

        for (const dependant of dependants) {
          const response = await requestApplicationForDependant(page, dependant.id);
          expect(response.status(), `Application for ${dependant.firstNames} should be refused`).toBe(403);
          expect(await response.json()).toEqual({ error: 'Turvakielto' });
        }
      });
    });
  }
});
