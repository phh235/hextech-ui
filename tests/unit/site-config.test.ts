import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const file = new URL('../../apps/web/lib/site.ts', import.meta.url).href;
function destinations(value?: string, registry?: string) {
  const env = { ...process.env };
  delete env.NEXT_PUBLIC_SITE_URL;
  delete env.NEXT_PUBLIC_REGISTRY_URL;
  if (registry !== undefined) env.NEXT_PUBLIC_REGISTRY_URL = registry;
  if (value !== undefined) env.NEXT_PUBLIC_SITE_URL = value;
  return execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import { siteUrl, registryOrigin } from '${file}'; console.log(JSON.stringify({ siteUrl, registryOrigin }));`,
    ],
    { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
}

describe('public URL configuration', () => {
  it.each(['', '   '])(
    'keeps GitHub links when the repository override is blank: %j',
    (repository) => {
      const output = execFileSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          `import { repositoryUrl } from '${file}'; console.log(repositoryUrl);`,
        ],
        { env: { ...process.env, NEXT_PUBLIC_REPOSITORY_URL: repository }, encoding: 'utf8' },
      );
      expect(output.trim()).toBe('https://github.com/phh235/hextech-ui');
    },
  );
  it('keeps canonical URLs public while local installs target the local registry', () => {
    expect(JSON.parse(destinations())).toEqual({
      siteUrl: 'https://hextech-ui.vercel.app',
      registryOrigin: 'http://127.0.0.1:3000',
    });
  });
  it('keeps registry overrides separate from the canonical origin', () => {
    expect(JSON.parse(destinations('https://docs.example.com/', 'http://127.0.0.1:3104/'))).toEqual(
      {
        siteUrl: 'https://docs.example.com',
        registryOrigin: 'http://127.0.0.1:3104',
      },
    );
  });
  it.each([
    'javascript:alert(1)',
    'https://user:secret@example.com',
    'https://example.com/docs',
    'https://example.com/?test=1',
    'https://example.com/#section',
  ])('rejects non-origin configuration: %s', (value) => {
    expect(() => destinations(value)).toThrow();
  });
});
