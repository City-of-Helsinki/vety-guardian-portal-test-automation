import { execFileSync } from 'child_process';
import path from 'path';

// Backend repo is expected next to this repo unless BACKEND_DIR is set
const backendDir =
  process.env.BACKEND_DIR ||
  path.resolve(__dirname, '../../vety-guardian-portal-back');

/**
 * Deletes all rows from the PreschoolApplication table using the backend's
 * management command. The command only runs when the backend's DEBUG
 * setting (from its .env) is True.
 *
 * Clears the whole table, including drafts saved by other tests, so run the
 * tests that use it one at a time (see tests/enrollment.spec.js).
 */
export function clearPreschoolApplications() {
  let output;

  try {
    output = execFileSync(
      'uv',
      ['run', 'python', 'manage.py', 'db_delete_all_PreschoolApplication'],
      {
        cwd: backendDir,
        input: 'Yes\n', // Answer the command's confirmation prompt
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }
    );
  } catch (error) {
    throw new Error(
      `Clearing PreschoolApplications failed (backend: ${backendDir}):\n${error.stderr || error.message}`
    );
  }

  if (!output.includes('Delete command completed')) {
    throw new Error(`Clearing PreschoolApplications did not complete:\n${output}`);
  }
}
