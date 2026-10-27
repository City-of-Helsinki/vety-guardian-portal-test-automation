import { test, expect } from '@playwright/test';
import { LanguageSelector } from '../components/LanguageSelector';
import { LoginPage } from '../components/LoginPage';
import { LandingPage } from '../components/LandingPage';
import { loginPage } from '../test-data/loginPage';
import { users } from '../test-data/users';

const selectors = require("../test-data/selectors");

test.describe("HKI-Vety Guardian Portal Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(selectors.mainPagePath);
    const languageSelector = new LanguageSelector(page);
    await languageSelector.select('fi');  // Default follows browser language. Select Finnish so tests don't depend on it.
  });
  
  test("Login page: Check elements", async ({ page }) => {

    await test.step("Check login page title", async () => {
      await expect(page).toHaveTitle('vety-guardian-portal-front');
    });

    await test.step("Check login page heading", async () => {
      await expect(new LoginPage(page).heading).toHaveText(loginPage.heading.fi);
    });

    await test.step("Check login button", async () => {
      await expect(new LoginPage(page).loginButton).toBeVisible();
    });

    await test.step("Check login", async () => {
      await new LoginPage(page).loginAs(users.mother);
      await expect(new LandingPage(page).heading).toHaveText('Etusivu');
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
      await expect(new LoginPage(page).heading).toHaveText(loginPage.heading.en);
      await languageSelector.select('sv');
      await languageSelector.expectCurrentLanguage('sv');
      await expect(new LoginPage(page).heading).toHaveText(loginPage.heading.sv);
      await languageSelector.select('fi');
      await languageSelector.expectCurrentLanguage('fi');
      await expect(new LoginPage(page).heading).toHaveText(loginPage.heading.fi);
    });
  });

  test("Login page: Log in with suomi.fi test identification", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Without the saved session, Helsinki-profiili sends the user to suomi.fi
    await loginPage.loginAs(users.mother, { useSavedSession: false });
    await expect(new LandingPage(page).heading).toHaveText('Etusivu');
  });

  test("Login page: Log out", async ({ page }) => {
    const loginPage = new LoginPage(page);
    // Own login session: logging out ends the session, so the saved one can't be used
    await loginPage.loginAs(users.mother, { useSavedSession: false });

    await loginPage.logout();

    await loginPage.verifyPageLoaded();
    await expect(loginPage.loggedInUser).toBeHidden();
  });

  test("Login page: Check header", async ({ page }) => {
    await test.step("Check header text", async () => {
      await expect(page.getByRole('link', { name: 'test' })).toBeVisible();
    });
  });
});

// No language is selected here: the default comes from the browser language
test.describe("Default language", () => {
  const browserLanguages = [
    { locale: 'fi-FI', language: 'fi' },
    { locale: 'sv-SE', language: 'sv' },
    { locale: 'en-US', language: 'en' },
    // Not supported: falls back to Finnish
    { locale: 'de-DE', language: 'fi' },
  ];

  for (const { locale, language } of browserLanguages) {
    test.describe(`Browser language ${locale}`, () => {
      test.use({ locale });

      test(`opens in ${language}`, async ({ page }) => {
        const languageSelector = new LanguageSelector(page);
        await page.goto(selectors.mainPagePath);

        await languageSelector.expectCurrentLanguage(language);
        await languageSelector.expectPageLanguage(language);
      });
    });
  }

  test("page language follows selected language", async ({ page }) => {
    const languageSelector = new LanguageSelector(page);
    await page.goto(selectors.mainPagePath);

    for (const language of ['sv', 'en', 'fi']) {
      await languageSelector.select(language);
      await languageSelector.expectCurrentLanguage(language);
      await languageSelector.expectPageLanguage(language);
    }
  });
});
