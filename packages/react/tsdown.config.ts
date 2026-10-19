import { defineConfig } from 'tsdown';
export default defineConfig({
  entry: [
    'src/index.ts',
    'src/components/*.tsx',
    'src/hooks/*.ts',
    'src/blocks/*.tsx',
    'src/lib/theme-scope.tsx',
  ],
  format: 'esm',
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2022',
  banner: '"use client";',
  // Every output chunk receives the client boundary above, including shared chunks.
  suppressWarnings: ['MODULE_LEVEL_DIRECTIVE'],
  deps: {
    neverBundle: [
      'react',
      'react-dom',
      '@base-ui/react',
      'clsx',
      'tailwind-merge',
      'sonner',
      'lexical',
      /^@lexical\//,
      /^@tanstack\//,
    ],
  },
});
