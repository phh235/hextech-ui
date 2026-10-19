import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  resolve: {
    alias: {
      '@/lib/cn': fileURLToPath(new URL('./packages/utils/src/cn.ts', import.meta.url)),
      '@/lib/token-value': fileURLToPath(
        new URL('./packages/utils/src/token-value.ts', import.meta.url),
      ),
      '@/lib/button-variants': fileURLToPath(
        new URL('./packages/react/src/lib/button-variants.ts', import.meta.url),
      ),
      '@/lib': fileURLToPath(new URL('./packages/react/src/lib', import.meta.url)),
    },
  },
  test: { include: ['tests/unit/**/*.test.ts'], environment: 'node' },
});
