# Vety Guardian Portal Test Automation

Playwright end-to-end tests for the Vety guardian portal — covering login, the landing page (guardians and their children) and the preschool enrollment form (esiopetukseen ilmoittautuminen) from the first step to sending the application.

## Prerequisites

- **Node.js** (LTS recommended)
- **Guardian portal frontend** running and reachable at `http://localhost:5173` (use `localhost`: it is the address registered for the Helsinki-profiili login)
- **Guardian portal backend** running and reachable (default `http://localhost:8001`), with the test-data API on: `TEST_DATA_API_ENABLED=True` and a `TEST_DATA_API_KEY` in its `.env`
- **`.env`** in this repo with the same key: `TEST_DATA_API_KEY=...` (gitignored, loaded by `playwright.config.js`)

## Login

The tests log in like a user: Helsinki-profiili with the suomi.fi test identification (Testitunnistaja). The test users are in `test-data/users.js`: people from DVV's test data, which the backend's VTJ mock also has (see the backend's README, "Login test users"):

| User | Henkilötunnus | Used for |
|------|---------------|----------|
| `mother`, `father` | `010878-998D`, `181077-999S` | Two guardians of the same child (of preschool age). Most of the enrollment tests |
| `singleParent` | `150299-902X` | The only guardian of the child: no other guardian on the form (`tests/singleParent.spec.js`) |
| `guardianWithTurvakielto` | `200798-9981` | The guardian has turvakielto, the child doesn't: no application |
| `guardianOfChildWithTurvakielto` | `010503A9503` | The child has turvakielto, the guardian doesn't: no application |
| `guardianOfChildNotOfPreschoolAge` | `140904A998H` | The child isn't of preschool age: no application |
| `guardianOutsideHelsinki` | `030393-995E` | The child's home municipality is Espoo: no application. The VTJ mock maps the login to its own family |

A new test user's first login asks Helsinki-profiili for an email address and a confirmation code (see the backend's README).

- `LoginPage.loginAs(user)` identifies the user with suomi.fi on their first login and saves the Helsinki-profiili session cookies to `playwright/.auth/` (not committed). The next logins use the saved session, so the tests only click "Kirjaudu sisään" and skip suomi.fi. When the saved session has expired, it identifies with suomi.fi again and saves the new session.
- The users are logged in through suomi.fi when they are first needed, not all at the start, so the suomi.fi test service doesn't get many logins at once.
- If the backend rejects the login ("Tunnistautuminen epäonnistui"), it reloads the page once.

> **Note:** Before every test, the enrollment tests delete the test guardian's preschool applications (drafts and sent ones) from the local backend with the test-data API (`POST /test-data/delete/`). `clearPreschoolApplications()` in `utils/api.js` deletes all applications (`POST /test-data/delete-all/`).

## Getting Started

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Run all tests (frontend and backend must be running)
npm test
```

If the application runs on a different host or port, set `BASE_URL`:

```bash
BASE_URL=http://localhost:3000 npm test
```

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run the full test suite |
| `npm run test:headed` | Run with browser visible |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:debug` | Run in debug mode |
| `npm run report` | Open the last HTML report |

### Running Subsets

```bash
# Single describe's tests
npx playwright test -g "Preschool enrollment"

# Single test
npx playwright test -g "answers are shown when returning to previous steps"

# Single spec file
npx playwright test tests/enrollment.spec.js
npx playwright test tests/landing.spec.js
npx playwright test tests/singleParent.spec.js
```

### Enrollment Tests

- Every step of the form is saved to the backend, so the tests in `tests/enrollment.spec.js` run one at a time and each test starts with no applications for the test guardian. Don't run them with `--repeat-each`: the copies run in parallel and delete each other's data.
- Known bugs are marked with `test.fail(...)`, with the Jira ticket key in the description (e.g. `VETY-176`). These tests are reported as passed while the bug exists. When the bug is fixed, the test fails with "expected to fail, but passed" — then remove its `test.fail(...)` line.

### Deleting Test Data Manually

The same test-data API can be called from the terminal (uses `API_URL` and `TEST_DATA_API_KEY` from `.env`):

```bash
# Delete all preschool applications
npm run clear-applications

# Delete the applications (and VTJ records) of one child or guardian
npm run delete-applications -- 140904A998H
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `http://localhost:5173` | URL where the guardian portal frontend is running |
| `API_URL` | `http://localhost:8001` | URL where the backend is running. Used to get the saved application form and delete test data |
| `TEST_DATA_API_KEY` | — | Key for the backend's test-data API, used to delete applications. Set it in `.env` |

## Test Reports

After a run, results are available in `playwright-report/`:

- **HTML report** — open with `npm run report` or directly at `playwright-report/index.html`
- **JSON report** — `playwright-report/test-results.json` (machine-readable, every test and step)

## Project Layout

| Path | Description |
|------|-------------|
| `tests/` | Test specs |
| `components/` | Page objects |
| `test-data/` | Test users, expected texts etc |
| `utils/` | Helpers (api, ...) |
| `scripts/` | Command-line scripts run with `npm run` |
| `playwright.config.js` | Playwright configuration |
| `playwright/.auth/` | Saved login sessions (created by `LoginPage.loginAs()`, not committed) |
