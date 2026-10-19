import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { artifacts, pnpm } from './process.mjs';

export async function createFixture(prefix, tsx, dependencies = {}) {
  // Unique directories retain failed-install evidence without deleting user files.
  const dir = path.join(artifacts, `${prefix}-${Date.now()}-${tsx ? 'ts' : 'js'}`);
  await mkdir(path.join(dir, 'src'), { recursive: true });
  await writeFile(
    path.join(dir, 'package.json'),
    JSON.stringify(
      {
        name: `${prefix}-consumer`,
        private: true,
        type: 'module',
        packageManager: 'pnpm@10.34.7',
        dependencies: { react: '19.3.1', 'react-dom': '19.3.1', ...dependencies },
        devDependencies: { '@types/react': '19.3.0', '@types/react-dom': '19.3.0' },
      },
      null,
      2,
    ),
  );
  await writeFile(path.join(dir, 'pnpm-workspace.yaml'), 'packages: []\nautoInstallPeers: false\n');
  const compilerOptions = {
    target: 'ES2022',
    lib: ['DOM', 'ES2022'],
    module: 'ESNext',
    moduleResolution: 'Bundler',
    jsx: 'react-jsx',
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    allowJs: !tsx,
    checkJs: false,
    baseUrl: '.',
    paths: { '@/*': ['./src/*'] },
  };
  await writeFile(
    path.join(dir, tsx ? 'tsconfig.json' : 'jsconfig.json'),
    JSON.stringify({ compilerOptions, include: ['src'] }, null, 2),
  );
  await writeFile(path.join(dir, '.npmrc'), 'lockfile=false\nstrict-peer-dependencies=true\n');
  await pnpm(['install', '--ignore-workspace', '--ignore-scripts', '--lockfile=false'], {
    cwd: dir,
  });
  return dir;
}
