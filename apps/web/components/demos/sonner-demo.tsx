'use client';

import { useId, useState } from 'react';
import { Button } from '@hextech-ui/react/button';
import { Sonner, sonner } from '@hextech-ui/react/sonner';

export function SonnerDemo() {
  const toasterId = useId();
  const [outcome, setOutcome] = useState('');
  return (
    <>
      <Sonner id={toasterId} closeButton />
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => sonner('Default Sonner', { toasterId })}>Show notification</Button>
        <Button
          onClick={() =>
            sonner.success('Sonner with Success Icon', {
              toasterId,
              description: 'This notification includes an icon.',
            })
          }
        >
          Success
        </Button>
        <Button
          onClick={() =>
            sonner('Sonner with Action', {
              toasterId,
              description: 'This notification includes an action.',
              action: { label: 'Undo', onClick: () => setOutcome('Changes undone') },
            })
          }
        >
          With action
        </Button>
        <Button
          onClick={() =>
            sonner.promise(
              new Promise<string>((resolve) => setTimeout(() => resolve('Build saved'), 1500)),
              {
                toasterId,
                loading: 'Saving build…',
                success: (value) => value,
                error: 'Unable to save',
              },
            )
          }
        >
          Promise
        </Button>
      </div>
      {outcome && <p role="status">{outcome}</p>}
    </>
  );
}
