// Deletes test data from the backend with its test-data API, outside of tests.
//   npm run clear-applications                   deletes all applications
//   npm run delete-applications -- 140904A998H   deletes one child's or guardian's data
// Uses the same API_URL and TEST_DATA_API_KEY (.env) as utils/api.js.

try {
  process.loadEnvFile();
} catch {}

const apiUrl = process.env.API_URL || 'http://localhost:8001';
const apiKey = process.env.TEST_DATA_API_KEY;
const [command, hetu] = process.argv.slice(2);

if (!apiKey) {
  console.error('TEST_DATA_API_KEY is not set. Add it to .env (see README).');
  process.exit(1);
}

let path;
let body;
if (command === 'delete-all') {
  path = 'delete-all/';
} else if (command === 'delete' && hetu) {
  path = 'delete/';
  body = JSON.stringify({ hetu });
} else {
  console.error('Usage: npm run clear-applications | npm run delete-applications -- <hetu>');
  process.exit(1);
}

const response = await fetch(`${apiUrl}/test-data/${path}`, {
  method: 'POST',
  headers: { 'X-Test-Data-Api-Key': apiKey, 'Content-Type': 'application/json' },
  body,
});
const text = await response.text();

if (!response.ok) {
  console.error(`POST /test-data/${path} failed: ${response.status} ${text}`);
  process.exit(1);
}
console.log(`Deleted: ${text}`);
