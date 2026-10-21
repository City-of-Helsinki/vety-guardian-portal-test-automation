import { test as setup } from '@playwright/test';
import { LoginPage, authFile } from '../components/LoginPage';
import { users } from '../test-data/users';

// Logs in each test user once with the suomi.fi test identification and saves
// the Helsinki-profiili session cookies. LoginPage.loginAs() uses them, so the
// tests don't have to go through suomi.fi every time.
for (const user of Object.values(users)) {
  setup(`log in as ${user.firstName}`, async ({ page }) => {
    setup.setTimeout(60000);
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.loginAs(user, { useSavedSession: false });

    await page.context().storageState({ path: authFile(user) });
  });
}
