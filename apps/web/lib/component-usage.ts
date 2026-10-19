import copiedSources from './formatted-component-examples.json' with { type: 'json' };

/** Stable export name shared by live previews and copied modules. */
export function componentDemoName(name: string): string {
  return (
    name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Demo'
  );
}

/** Transform only import destinations; the authored TSX is the implementation. */
export function componentExampleCode(
  name: string,
  kind?: string,
  target: 'npm' | 'registry' = 'npm',
  authoredSource?: string,
): string {
  const source = authoredSource ?? copiedSources[name as keyof typeof copiedSources];
  if (!source) throw new Error(`Missing demo source for ${name}`);
  if (target === 'registry')
    return source.replace(
      /@hextech-ui\/react\/([a-z0-9-]+)/g,
      (_, subpath: string) =>
        `@/${subpath === 'theme-scope' ? 'lib' : subpath.startsWith('use-') || (subpath === name && kind === 'hook') ? 'hooks' : 'components/ui'}/${subpath}`,
    );
  return source
    .replace(/@\/components\/ui\/([a-z0-9-]+)/g, '@hextech-ui/react/$1')
    .replace(/@\/hooks\/(use-[a-z0-9-]+)/g, '@hextech-ui/react/$1')
    .replaceAll('@/lib/theme-scope', '@hextech-ui/react/theme-scope');
}
