import { execSync } from 'child_process';

/**
 * Aplica as migrations no banco de teste antes da suíte e2e.
 * O DATABASE_URL já vem de .env.test (via `dotenv -e .env.test` no script test:e2e),
 * apontando para `code_connect_test`.
 */
export default function setup(): void {
  execSync('prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
  });
}
