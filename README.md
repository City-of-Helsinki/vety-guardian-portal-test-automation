# Vety Guardian Portal Test Automation

Playwright end-to-end tests for the Vety guardian portal — covering login, the landing page (guardians and their children) and the preschool enrollment form (esiopetukseen ilmoittautuminen) from the first step to sending the application.

## Prerequisites

- **Node.js** (LTS recommended)
- **Guardian portal frontend** running and reachable at `http://localhost:5173` (use `localhost`: it is the address registered for the Helsinki-profiili login)
- **Guardian portal backend** running and reachable (default `http://localhost:8001`), with `DEBUG=True` in its `.env`
- **Backend repo** checked out next to this repo as `../vety-guardian-portal-back`, or set `BACKEND_DIR` (see Environment Variables below)
- **uv** installed — the tests run backend management commands with `uv run python manage.py ...`

## Login

The tests log in like a user: Helsinki-profiili with the suomi.fi test identification (Testitunnistaja). The test users are in `test-data/users.js`: a family from DVV's test data (mother `140904A998H`, father `060999-951B`, and their child), which the backend's VTJ mock also has.

- `tests/auth.setup.js` runs first (`setup` project). It logs in each test user once through suomi.fi and saves the Helsinki-profiili session cookies to `playwright/.auth/` (not committed).
- `LoginPage.loginAs(user)` uses the saved session, so the tests only click "Kirjaudu sisään" and skip suomi.fi. If the backend rejects the login ("Tunnistautuminen epäonnistui"), it reloads the page once.

> **Note:** The enrollment tests delete **all** preschool applications (drafts and sent ones) from the local backend before every test. They use the backend command `db_delete_all_PreschoolApplication`, which only runs when the backend's `DEBUG` setting is `True`.

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

# Without the login setup, using the sessions saved by an earlier run
npx playwright test --no-deps tests/landing.spec.js

# Single spec file
npx playwright test tests/enrollment.spec.js
npx playwright test tests/landing.spec.js
```

### Enrollment Tests

- Every step of the form is saved to the backend, so the tests in `tests/enrollment.spec.js` run one at a time and each test starts from an empty application table. Don't run them with `--repeat-each`: the copies run in parallel and clear each other's data.
- Known bugs are marked with `test.fail(...)`, with the Jira ticket key in the description (e.g. `VETY-176`). These tests are reported as passed while the bug exists. When the bug is fixed, the test fails with "expected to fail, but passed" — then remove its `test.fail(...)` line.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `http://localhost:5173` | URL where the guardian portal frontend is running |
| `API_URL` | `http://localhost:8001` | URL where the backend is running. Used to get the saved application form |
| `BACKEND_DIR` | `../vety-guardian-portal-back` | Path to the backend repo. Used to clear applications from the database |

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
| `utils/` | Helpers (db, api, ...) |
| `playwright.config.js` | Playwright configuration |
| `playwright/.auth/` | Saved login sessions (created by `tests/auth.setup.js`, not committed) |
