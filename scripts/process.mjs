import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const root = fileURLToPath(new URL('..', import.meta.url));
export const artifacts = path.join(root, '.artifacts');
export const pnpmCli = process.env.npm_execpath;

export function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit', ...options });
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)),
    );
  });
}

export function pnpm(args, options = {}) {
  if (!pnpmCli) throw new Error('Run this script through pnpm');
  return run(process.execPath, [pnpmCli, ...args], options);
}

export async function waitFor(url, child, timeout = 120000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error('Server stopped before becoming ready');
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      /* Server is still starting. */
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

/** Spawn Next directly so shutdown never leaves a pnpm child process behind. */
export function startWeb(port) {
  const cwd = path.join(root, 'apps/web');
  return spawn(
    process.execPath,
    [
      path.join(cwd, 'node_modules/next/dist/bin/next'),
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      String(port),
    ],
    { cwd, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } },
  );
}
