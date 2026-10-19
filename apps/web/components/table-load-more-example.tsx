'use client';
import { useEffect, useRef, useState } from 'react';
import { TableLoadMoreItem } from '@hextech-ui/react/table-load-more';
import { Button } from '@hextech-ui/react/button';

export function TableLoadMoreExample({
  disabled = false,
  automatic = false,
  advanced = false,
}: {
  disabled?: boolean;
  automatic?: boolean;
  advanced?: boolean;
}) {
  const [count, setCount] = useState(automatic ? 12 : 3);
  const limit = automatic ? 18 : 9;
  const [auto, setAuto] = useState(automatic);
  const [reject, setReject] = useState(false);
  const [stalled, setStalled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [external, setExternal] = useState(false);
  const [locked, setLocked] = useState(false);
  const [shown, setShown] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [requests, setRequests] = useState(0);
  const [aborts, setAborts] = useState(0);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const gate = useRef<(() => void) | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return (
    <section aria-label="Table loading demo" className="w-full min-w-0 space-y-4">
      <p className="text-hx-sm text-hx-muted-foreground">
        Local example. Rows are generated in your browser; nothing is requested from a server.
      </p>
      {advanced ? (
        <fieldset disabled={disabled} className="flex flex-wrap gap-x-4 gap-y-2 text-hx-sm">
          <legend className="mb-2 font-hx-medium">Try loading states</legend>
          <label className="flex gap-2">
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
            Automatic loading
          </label>
          <label className="flex gap-2">
            <input type="checkbox" checked={paused} onChange={(e) => setPaused(e.target.checked)} />
            Pause loading
          </label>
          <label className="flex gap-2">
            <input type="checkbox" checked={reject} onChange={(e) => setReject(e.target.checked)} />
            Reject request
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={stalled}
              onChange={(e) => setStalled(e.target.checked)}
            />
            Keep progress unchanged
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={external}
              onChange={(e) => setExternal(e.target.checked)}
            />
            External loading
          </label>
          <label className="flex gap-2">
            <input type="checkbox" checked={locked} onChange={(e) => setLocked(e.target.checked)} />
            Disable loading
          </label>
          <label className="flex gap-2">
            <input type="checkbox" checked={shown} onChange={(e) => setShown(e.target.checked)} />
            Show load row
          </label>
          <Button
            size="small"
            variant="dimmed"
            disabled={!waiting}
            onClick={() => gate.current?.()}
          >
            Complete load
          </Button>
        </fieldset>
      ) : null}
      <div
        ref={setRoot}
        role="region"
        aria-label="Practice notes scroll area"
        tabIndex={0}
        className={`${automatic ? 'max-h-64' : 'max-h-80'} overflow-auto rounded border border-hx-border bg-hx-surface outline-offset-2 focus-visible:outline-2 focus-visible:outline-hx-focus`}
      >
        <table className="w-full border-collapse text-left text-hx-sm">
          <caption className="p-3 text-left font-hx-medium text-hx-primary">Practice notes</caption>
          <thead>
            <tr>
              <th scope="col" className="border-b border-hx-border px-4 py-2">
                Number
              </th>
              <th scope="col" className="border-b border-hx-border px-4 py-2">
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: count }, (_, index) => (
              <tr key={index} className="border-b border-hx-border">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">Plan {index + 1}</td>
              </tr>
            ))}
            {shown ? (
              <TableLoadMoreItem
                colSpan={2}
                loadKey={count}
                hasMore={count < limit}
                autoLoad={auto}
                loading={external}
                disabled={disabled || locked}
                root={root}
                onLoadMore={async ({ signal }) => {
                  setRequests((value) => value + 1);
                  setWaiting(true);
                  await new Promise<void>((resolve) => {
                    let timer: ReturnType<typeof setTimeout> | undefined;
                    const complete = () => {
                      if (timer !== undefined) clearTimeout(timer);
                      signal.removeEventListener('abort', cancel);
                      gate.current = null;
                      resolve();
                    };
                    const cancel = () => {
                      if (mounted.current) setAborts((value) => value + 1);
                      complete();
                    };
                    gate.current = complete;
                    signal.addEventListener('abort', cancel, { once: true });
                    if (!paused) timer = setTimeout(complete, 220);
                  });
                  if (mounted.current) setWaiting(false);
                  if (signal.aborted) return;
                  if (reject) throw new Error('This local example declined the request.');
                  if (!stalled) setCount((value) => Math.min(limit, value + 3));
                }}
              />
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="text-hx-xs text-hx-muted-foreground">
        <output data-row-count>{count}</output> rows ·{' '}
        <output data-load-requests>{requests}</output> requests
        {advanced ? (
          <>
            {' '}
            · <output data-load-aborts>{aborts}</output> aborted
          </>
        ) : null}
      </p>
    </section>
  );
}
