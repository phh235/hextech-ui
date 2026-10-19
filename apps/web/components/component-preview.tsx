'use client';

import { useId, useState, type ReactNode } from 'react';
import { useHydrated } from '@/lib/use-hydrated';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import dynamic from 'next/dynamic';
const DynamicCodeBlock = dynamic(() =>
  import('fumadocs-ui/components/dynamic-codeblock').then((module) => module.DynamicCodeBlock),
);
import { codeHighlightOptions } from '@/lib/code-highlight';

export interface PreviewVariant {
  name: string;
  content: ReactNode;
  code?: string;
}
export interface ComponentPreviewProps {
  internal?: boolean;
  title: string;
  code: string;
  fileName: string;
  variants: PreviewVariant[];
}

/** Animation and sound controls are added only when a future example provides adapters. */
export function ComponentPreview({
  title,
  code,
  fileName,
  variants,
  internal = false,
}: ComponentPreviewProps) {
  const id = useId();
  const [variant, setVariant] = useState(0);
  const ready = useHydrated();
  const currentCode = variants[variant]?.code ?? code;
  return (
    <section
      className="component-preview not-prose"
      aria-label={title}
      inert={!ready}
      data-preview-ready={ready || undefined}
    >
      <div className="preview-title">
        <span className="eyebrow">{internal ? 'Internal verification' : 'Live example'}</span>
        <h2>{title}</h2>
      </div>
      <Tabs items={['Preview', 'Code']}>
        <Tab value="Preview" className="p-0">
          {internal && variants.length > 1 && (
            <div className="preview-toolbar">
              <label htmlFor={`${id}-variant`}>
                Example{' '}
                <select
                  id={`${id}-variant`}
                  value={variant}
                  onChange={(event) => setVariant(Number(event.target.value))}
                >
                  {variants.map((item, index) => (
                    <option key={item.name} value={index}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          <fieldset disabled={!ready} className="m-0 min-w-0 border-0 p-0">
            <div className="preview-stage">
              <div className="preview-viewport">{variants[variant]?.content}</div>
            </div>
          </fieldset>
        </Tab>
        <Tab value="Code" className="preview-code">
          <DynamicCodeBlock
            lang="tsx"
            options={codeHighlightOptions}
            code={currentCode}
            codeblock={{
              title: fileName,
              viewportProps: { 'aria-label': `${title} example code` },
            }}
          />
        </Tab>
      </Tabs>
    </section>
  );
}
