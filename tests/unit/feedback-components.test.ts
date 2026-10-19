import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Alert } from '../../packages/react/src/components/alert';
import { Skeleton } from '../../packages/react/src/components/skeleton';

describe('feedback accessibility contracts', () => {
  it('keeps decorative loading placeholders out of the accessibility tree', () => {
    const html = renderToStaticMarkup(
      createElement(Skeleton, { animated: false, 'aria-hidden': false }),
    );
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('animate-pulse');
  });
  it('does not announce a static notice unless the caller requests it', () => {
    expect(
      renderToStaticMarkup(createElement(Alert, { tone: 'destructive' }, 'Could not save')),
    ).not.toContain('role=');
    expect(
      renderToStaticMarkup(
        createElement(Alert, { tone: 'destructive', role: 'alert' }, 'Could not save'),
      ),
    ).toContain('role="alert"');
  });
});
