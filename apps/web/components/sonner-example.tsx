'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@hextech-ui/react/button';
import { Sonner, sonner, type SonnerProps } from '@hextech-ui/react/sonner';

export type SonnerExampleKind =
  | 'normal'
  | 'action'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'promise'
  | 'loading'
  | 'close'
  | 'top-right'
  | 'persistent';
export function SonnerExample({ kind }: { kind?: SonnerExampleKind }) {
  const toasterId = useId();
  const sequence = useRef(0);
  const owned = useRef(new Set<string>());
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const [outcome, setOutcome] = useState('');
  useEffect(() => {
    const notifications = owned.current,
      timeouts = timers.current;
    return () => {
      for (const id of notifications) sonner.dismiss(id);
      for (const timer of timeouts) clearTimeout(timer);
    };
  }, []);
  function show(type: SonnerExampleKind) {
    const id = `${toasterId}-${++sequence.current}`;
    owned.current.add(id);
    const options: SonnerProps = {
      id,
      toasterId,
      ...(type === 'persistent' || type === 'loading' ? { duration: Infinity } : {}),
    };
    if (type === 'promise') {
      const promise = new Promise<string>((resolve) => {
        const timer = setTimeout(() => {
          timers.current.delete(timer);
          resolve('Build saved');
        }, 1500);
        timers.current.add(timer);
      });
      sonner.promise(promise, {
        ...options,
        loading: 'Saving build…',
        success: (value) => value,
        error: 'Unable to save',
      });
    } else if (type === 'action') {
      sonner('Sonner with Action', {
        ...options,
        description: 'This notification includes an action.',
        action: { label: 'Undo', onClick: () => setOutcome('Changes undone') },
      });
    } else if (type === 'success' || type === 'warning' || type === 'error' || type === 'info') {
      sonner[type](`Sonner with ${type[0]!.toUpperCase() + type.slice(1)} Icon`, {
        ...options,
        description: 'This notification includes an icon.',
      });
    } else if (type === 'loading') {
      sonner.loading('Saving build…', options);
    } else {
      sonner('Default Sonner', {
        ...options,
        ...(type === 'top-right' ? { position: 'top-right' } : {}),
        ...(type === 'close' || type === 'persistent' ? { closeButton: true } : {}),
      });
    }
  }
  return (
    <div className="grid justify-items-center gap-3">
      <Sonner id={toasterId} closeButton={!kind} />
      <div className="flex flex-wrap justify-center gap-3">
        {kind ? (
          <Button onClick={() => show(kind)}>Show notification</Button>
        ) : (
          <>
            <Button onClick={() => show('normal')}>Show notification</Button>
            <Button onClick={() => show('success')}>Success</Button>
            <Button onClick={() => show('action')}>With action</Button>
            <Button onClick={() => show('promise')}>Promise</Button>
          </>
        )}
      </div>
      {outcome && (
        <p role="status" className="text-sm text-muted-foreground">
          {outcome}
        </p>
      )}
    </div>
  );
}
