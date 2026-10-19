'use client';

import { useEffect } from 'react';
import { Button } from '@hextech-ui/react/button';
import { Sonner, sonner } from '@hextech-ui/react/sonner';
import { ShowcaseCard } from './showcase-card';

const ids = ['home-success', 'home-info', 'home-error'] as const;

export function NotificationsShowcase() {
  useEffect(
    () => () => {
      ids.forEach((id) => sonner.dismiss(id));
    },
    [],
  );
  return (
    <ShowcaseCard
      title="A little heads-up"
      component="sonner"
      description="Good news. A gentle nudge. Just in time."
    >
      <div>
        <Sonner closeButton />
        <div className="flex flex-wrap gap-2">
          <Button
            size="small"
            variant="primary"
            onClick={() =>
              sonner.success('Build saved', {
                id: ids[0],
                description: 'Ready for your next game.',
              })
            }
          >
            Success
          </Button>
          <Button
            size="small"
            variant="hextech"
            onClick={() =>
              sonner.info('Your party is ready', {
                id: ids[1],
                description: 'One more game together?',
              })
            }
          >
            Info
          </Button>
          <Button
            size="small"
            variant="destructive"
            onClick={() =>
              sonner.error('Connection lost', {
                id: ids[2],
                description: 'Take a breath and try again.',
              })
            }
          >
            Error
          </Button>
        </div>
      </div>
    </ShowcaseCard>
  );
}
