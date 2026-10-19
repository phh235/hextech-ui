'use client';
import { useState } from 'react';
import Link from 'next/link';
import manifest from '../../../packages/react/block-manifest.json';
import { BlockExample } from './block-examples';
export function BlockGallery() {
  const [category, setCategory] = useState('All');
  return (
    <div className="not-prose grid gap-8">
      <div className="catalog-categories" aria-label="Filter blocks">
        {['All', 'Account', 'Game layouts'].map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {manifest
        .filter((item) => category === 'All' || item.category === category)
        .map((block) => (
          <section
            key={block.name}
            aria-label={`${block.title} block`}
            className="grid min-w-0 gap-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="m-0 text-xl font-semibold tracking-tight">{block.title}</h2>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{block.description}</p>
              </div>
              <Link href={`/docs/blocks/${block.name}`} className="button-secondary">
                Source & install <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="min-w-0 border border-border bg-muted/20 p-3 sm:p-6">
              <BlockExample name={block.name} />
            </div>
          </section>
        ))}
    </div>
  );
}
