import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { format } from 'prettier';
import ts from 'typescript';
import manifest from '../../packages/react/component-manifest.json';
import { componentExampleCode } from '../../apps/web/lib/component-usage';

describe('copyable demo module names', () => {
  it('derives copied source from the same maintained TSX files used by live previews', async () => {
    for (const item of manifest) {
      const live = await readFile(`apps/web/components/demos/${item.name}-demo.tsx`, 'utf8');
      const copied = await format(componentExampleCode(item.name, item.kind, 'registry', live), {
        parser: 'typescript',
        singleQuote: true,
        printWidth: 80,
      });
      expect(copied, item.name).toBe(componentExampleCode(item.name, item.kind, 'registry'));
    }
  });
  it('exports one distinct component name for every catalog module', () => {
    const names = manifest.map((item) => {
      const source = ts.createSourceFile(
        `${item.name}-demo.tsx`,
        componentExampleCode(item.name, item.kind, 'registry'),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      const exports = source.statements
        .filter(ts.isFunctionDeclaration)
        .filter((node) =>
          node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
        );
      expect(exports, item.name).toHaveLength(1);
      const name = exports[0]!.name!.text;
      expect(name).toMatch(/^[A-Z]\w+Demo$/);
      expect(name).not.toBe('Example');
      return name;
    });
    expect(new Set(names).size).toBe(manifest.length);
    expect(names).toContain('RadioDemo');
    expect(names).toContain('DatePickerDemo');
  });

  it('retains export names when switching between npm and copied source imports', () => {
    for (const name of ['button', 'table-load-more', 'sonner']) {
      const npm = componentExampleCode(name);
      const registry = componentExampleCode(name, undefined, 'registry');
      expect(registry.match(/export function (\w+)/)?.[1]).toBe(
        npm.match(/export function (\w+)/)?.[1],
      );
      expect(registry).not.toMatch(/\bfunction Example\b/);
    }
  });
});
