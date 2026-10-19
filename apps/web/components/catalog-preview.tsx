import { SonnerExample, type SonnerExampleKind } from './sonner-example';
import manifest from '../../../packages/react/component-manifest.json';
import { ComponentPreview } from './component-preview';
import { ComponentExample } from './catalog-examples';
import { componentExampleCode } from '@/lib/component-usage';
import formattedExamples from '@/lib/formatted-component-examples.json';
import { RecordSelectionExample } from './selection-examples';
import { DynamicTreeExample, ControlledTagExample } from './collection-examples';
import { TableLoadMoreExample } from './table-load-more-example';
import { Button } from '@hextech-ui/react/button';
import { ButtonLink } from '@hextech-ui/react/link';
import { buttonReferenceCases } from '@/lib/button-reference-cases';
import { Toggle } from '@hextech-ui/react/toggle';
import { toggleReferenceCases } from '@/lib/toggle-reference-cases';
import { InputExample } from './input-examples';
export function CatalogPreview({ name, internal = false }: { name: string; internal?: boolean }) {
  const item = manifest.find((component) => component.name === name);
  if (!item) return null;
  const staticOnly = [
    'sonner',
    'typography',
    'badge',
    'card',
    'separator',
    'link',
    'progress',
    'spinner',
    'breadcrumbs',
    'table',
    'vertical-table',
    'preview-card',
    'charts',
  ].includes(name);
  return (
    <ComponentPreview
      internal={internal}
      title={item.title}
      code={
        formattedExamples[name as keyof typeof formattedExamples] ??
        componentExampleCode(name, item.kind, 'registry')
      }
      fileName={`${name}-demo.tsx`}
      variants={[
        {
          name: name === 'table-load-more' ? 'Manual' : 'Default',
          content:
            name === 'sonner' && internal ? (
              <SonnerExample kind="normal" />
            ) : (
              <ComponentExample name={name} />
            ),
        },
        ...(internal && name === 'sonner'
          ? (
              [
                ['With action', 'action'],
                ['Success', 'success'],
                ['Warning', 'warning'],
                ['Error', 'error'],
                ['Info', 'info'],
                ['Promise', 'promise'],
                ['Loading', 'loading'],
                ['With close', 'close'],
                ['Top right', 'top-right'],
                ['Persistent', 'persistent'],
              ] satisfies [string, SonnerExampleKind][]
            ).map(([name, kind]) => ({ name, content: <SonnerExample key={kind} kind={kind} /> }))
          : []),
        ...(name === 'data-table'
          ? [{ name: 'Load more', content: <ComponentExample name={name} example="load-more" /> }]
          : []),
        ...(name === 'table-load-more'
          ? [
              { name: 'Automatic', content: <TableLoadMoreExample key="automatic" automatic /> },
              {
                name: 'Async states',
                content: <TableLoadMoreExample key="async" automatic advanced />,
              },
            ]
          : []),
        ...(['combobox', 'multiple-select'].includes(name)
          ? [
              {
                name: 'Object records',
                content: <RecordSelectionExample multiple={name === 'multiple-select'} />,
              },
            ]
          : []),
        ...(['tree', 'tag-group'].includes(name)
          ? [
              {
                name: 'Dynamic data',
                content: name === 'tree' ? <DynamicTreeExample /> : <ControlledTagExample />,
              },
            ]
          : []),
        ...(!staticOnly
          ? [{ name: 'Disabled', content: <ComponentExample name={name} disabled /> }]
          : []),
        ...(internal && name === 'button'
          ? [
              {
                name: 'Destructive loading',
                content: (
                  <Button variant="destructive" loading>
                    Deleting
                  </Button>
                ),
                code: "'use client';\n\nimport { Button } from '@/components/ui/button';\n\nexport function Example() { return <Button variant=\"destructive\" loading>Deleting</Button>; }",
              },
            ]
          : []),
        ...(name === 'input'
          ? [
              {
                name: 'With label',
                content: <InputExample variant="with-label" />,
                code: `'use client';\n\nimport { Input } from '@/components/ui/input';\n\nexport function Example() {\n  return <div className="grid gap-2">\n    <label htmlFor="example" className="font-sans text-sm font-normal leading-[1.1025rem] tracking-[0.02em] text-muted-foreground">Some label</label>\n    <Input id="example" defaultValue="The quick brown fox jumps over the lazy dog." placeholder="The quick brown fox jumps over the lazy dog." />\n  </div>;\n}\n`,
              },
              {
                name: 'Sizes',
                content: <InputExample variant="sizes" />,
                code: `'use client';\n\nimport { Input } from '@/components/ui/input';\n\nexport function Example() {\n  return <div className="grid gap-3">\n    <Input size="small" aria-label="Small input" defaultValue="The quick brown fox jumps over the lazy dog." placeholder="The quick brown fox jumps over the lazy dog." />\n    <Input aria-label="Medium input" defaultValue="The quick brown fox jumps over the lazy dog." placeholder="The quick brown fox jumps over the lazy dog." />\n    <Input size="large" aria-label="Large input" defaultValue="The quick brown fox jumps over the lazy dog." placeholder="The quick brown fox jumps over the lazy dog." />\n  </div>;\n}\n`,
              },
            ]
          : []),
        ...(name === 'toggle'
          ? toggleReferenceCases.map((entry) => ({
              name: `Storybook · ${entry.label}`,
              content: (
                <Toggle key={entry.story} {...entry.props} data-reference-story={entry.story}>
                  {entry.text}
                </Toggle>
              ),
              code: `'use client';\n\nimport { Toggle } from '@/components/ui/toggle';\n\nexport function Example() {\n  return <Toggle${Object.entries(
                entry.props,
              )
                .map(([key, value]) =>
                  typeof value === 'boolean'
                    ? ` ${key}={${value}}`
                    : ` ${key}=${JSON.stringify(value)}`,
                )
                .join('')}>${entry.text}</Toggle>;\n}\n`,
            }))
          : []),
        ...(name === 'button'
          ? buttonReferenceCases.map((entry) => ({
              name: `Storybook · ${entry.label}`,
              content: (
                <Button
                  {...entry.props}
                  aria-label={entry.text === '+' ? entry.label : undefined}
                  data-reference-story={entry.story}
                >
                  {entry.text === '+' ? (
                    entry.story.endsWith('--squared-image') ||
                    entry.story.endsWith('--squared-inside-flex') ? (
                      <svg
                        aria-label="Original geometric crest"
                        role="img"
                        viewBox="0 0 64 64"
                        className="size-full"
                      >
                        <path fill="#0a323c" d="M0 0h64v64H0z" />
                        <path
                          fill="none"
                          stroke="#c8aa6e"
                          strokeWidth="2"
                          d="m32 8 22 24-22 24L10 32Z"
                        />
                        <path fill="#0ac8b9" d="m32 19 11 13-11 13-11-13Z" />
                      </svg>
                    ) : (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="m8 2 4 0 .6 3 2.5 1.4 2.9-1 2 3.4-2.3 2 .1 2.8 2.3 2-2 3.4-2.9-1-2.5 1.5-.6 3H8l-.6-3-2.5-1.5-2.9 1-2-3.4 2.3-2-.1-2.8-2.3-2 2-3.4 2.9 1L7.4 5Z"
                          transform="translate(2 0) scale(.8)"
                        />
                        <circle cx="10" cy="10" r="3" />
                      </svg>
                    )
                  ) : (
                    entry.text
                  )}
                </Button>
              ),
              code: `'use client';\n\nimport { Button } from '@/components/ui/button';\n\nexport function Example() {\n  return <Button${Object.entries(
                entry.props,
              )
                .map(([key, value]) =>
                  typeof value === 'boolean'
                    ? ` ${key}={${value}}`
                    : ` ${key}=${JSON.stringify(value)}`,
                )
                .join(
                  '',
                )}>${entry.text.replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</Button>;\n}\n`,
            }))
          : []),
        ...(name === 'link'
          ? buttonReferenceCases
              .filter((entry) => !/--(?:size|rounded)-(?:small|medium|large)$/.test(entry.story))
              .map((entry) => ({
                name: `Storybook · ${entry.label}`,
                content: (
                  <ButtonLink
                    href="#example"
                    {...(entry.props.className && { className: entry.props.className })}
                    {...(entry.props.variant && { variant: entry.props.variant })}
                    {...(entry.props.size && { size: entry.props.size })}
                    {...(entry.props.shape && { shape: entry.props.shape })}
                    {...(entry.props.thin !== undefined && { thin: entry.props.thin })}
                    {...(entry.props.disabled !== undefined && { disabled: entry.props.disabled })}
                    aria-label={entry.text === '+' ? entry.label : undefined}
                    data-reference-story={entry.story.replace(
                      'buttons-button--',
                      'buttons-buttonlink--',
                    )}
                  >
                    {entry.text}
                  </ButtonLink>
                ),
                code: `'use client';\n\nimport { ButtonLink } from '@/components/ui/link';\n\nexport function Example() {\n  return <ButtonLink href="#example"${Object.entries(
                  entry.props,
                )
                  .map(([key, value]) =>
                    typeof value === 'boolean'
                      ? ` ${key}={${value}}`
                      : ` ${key}=${JSON.stringify(value)}`,
                  )
                  .join(
                    '',
                  )}>${entry.text.replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</ButtonLink>;\n}\n`,
              }))
          : []),
      ].filter((_, index) => internal || index === 0)}
    />
  );
}
