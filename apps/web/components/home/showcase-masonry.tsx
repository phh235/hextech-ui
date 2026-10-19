'use client';

import { Children, useLayoutEffect, useRef, type ReactNode } from 'react';

/** Size owned wrappers, never the markup inside a child's streaming Suspense boundary. */
export function ShowcaseMasonry({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const container = element;
    let frame: number | undefined;
    let disposed = false;

    function balance() {
      const cards = container.querySelectorAll<HTMLElement>(':scope > .showcase-item');
      container.style.removeProperty('height');
      container.style.removeProperty('column-fill');
      cards.forEach((card) => card.style.removeProperty('min-height'));
      if (Number(getComputedStyle(container).columnCount) < 2) return;

      // Freeze the natural column capacity before extending the final cards.
      // Otherwise multi-column balancing can move cards as their height changes.
      const trailingGap = cards[0] ? parseFloat(getComputedStyle(cards[0]).marginBottom) : 0;
      container.style.height = `${container.getBoundingClientRect().height + trailingGap}px`;
      container.style.columnFill = 'auto';

      const columns = new Map<number, { card: HTMLElement; top: number; bottom: number }>();
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const column = Math.round(rect.left);
        const previous = columns.get(column);
        if (!previous || previous.bottom < rect.bottom)
          columns.set(column, { card, top: rect.top, bottom: rect.bottom });
      }
      const bottom = Math.max(...Array.from(columns.values(), (column) => column.bottom));
      for (const column of columns.values()) {
        if (bottom - column.bottom > 0.5) column.card.style.minHeight = `${bottom - column.top}px`;
      }
    }

    function schedule() {
      if (disposed || frame !== undefined) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        balance();
      });
    }

    const resize = new ResizeObserver(schedule);
    function observeCards() {
      resize.disconnect();
      resize.observe(container);
      container.querySelectorAll(':scope > .showcase-item').forEach((card) => resize.observe(card));
      schedule();
    }
    const childrenChanged = new MutationObserver(observeCards);
    childrenChanged.observe(container, { childList: true });
    observeCards();
    void document.fonts.ready.then(schedule);

    return () => {
      disposed = true;
      if (frame !== undefined) cancelAnimationFrame(frame);
      resize.disconnect();
      childrenChanged.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="showcase-grid columns-1 gap-5 md:columns-2 xl:columns-3">
      {Children.map(children, (child) => (
        <div className="showcase-item mb-5 grid min-w-0 break-inside-avoid">{child}</div>
      ))}
    </div>
  );
}
