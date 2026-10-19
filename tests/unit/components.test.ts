import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, buttonVariants } from '../../packages/react/src/components/button';
import { Link, ButtonLink } from '../../packages/react/src/components/link';
import { Heading } from '../../packages/react/src/components/typography';
import { NumberField } from '../../packages/react/src/components/number-field';

describe('action contracts', () => {
  it('keeps numeric stepper aria-controls aligned with the actual input id', () => {
    const html = renderToStaticMarkup(
      createElement(NumberField, { label: 'Party size', defaultValue: 3 }),
    );
    const inputId = html.match(/<input[^>]*id="([^"]+)"/)?.[1];
    expect(inputId).toBeTruthy();
    const controls = [...html.matchAll(/aria-controls="([^"]+)"/g)].map((match) => match[1]);
    expect(controls).toHaveLength(2);
    expect(controls.every((value) => value === inputId)).toBe(true);
  });
  it('blocks repeated loading actions while preserving an accessible name', () => {
    const html = renderToStaticMarkup(createElement(Button, { loading: true }, 'Queue up'));
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('Queue up');
    expect(html).toContain('aria-hidden="true"');
  });
  it('applies consumer utility overrides after defaults', () => {
    const classes = buttonVariants({ size: 'small', className: 'px-9 min-h-16' });
    expect(classes).toContain('px-9');
    expect(classes).not.toMatch(/(?:^| )px-(3|5)(?: |$)/);
    expect(classes).not.toMatch(/(?:^| )min-h-8(?: |$)/);
  });
  it('removes navigation and keyboard activation from disabled anchors', () => {
    for (const component of [Link, ButtonLink]) {
      const html = renderToStaticMarkup(
        createElement(component, { href: '/private', disabled: true }, 'Unavailable'),
      );
      expect(html).not.toContain('href=');
      expect(html).toContain('aria-disabled="true"');
      expect(html).toContain('tabindex="-1"');
    }
  });
  it('retains requested semantic heading levels', () => {
    const html = renderToStaticMarkup(
      createElement(Heading, { as: 'h3', size: 'xl' }, 'Build notes'),
    );
    expect(html).toMatch(/^<h3/);
    expect(html).toContain('Build notes');
  });
});
