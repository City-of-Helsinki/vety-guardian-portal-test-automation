import { execFileSync } from 'child_process';
import path from 'path';

// Backend repo is expected next to this repo unless BACKEND_DIR is set
const backendDir =
  process.env.BACKEND_DIR ||
  path.resolve(__dirname, '../../vety-guardian-portal-back');

/**
 * Deletes all rows from the PreschoolApplication table using the backend's
 * management command. Backend must be running with DEBUG=True.
 *
 * Clears the whole table, so call it only after a test that sends an
 * application has verified it, and run those tests in serial mode.
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
