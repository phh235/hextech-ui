'use client';

import { Button } from '@hextech-ui/react/button';
import { ToastProvider, useToast } from '@hextech-ui/react/toast';

const notifications = [
  {
    label: 'Default',
    type: undefined,
    title: 'A little heads-up',
    description: 'Your next game starts here.',
  },
  {
    label: 'Success',
    type: 'success',
    title: 'Build saved',
    description: 'Ready for the next chapter.',
  },
  {
    label: 'Info',
    type: 'info',
    title: 'Your party is ready',
    description: 'One more game together?',
  },
  {
    label: 'Warning',
    type: 'warning',
    title: 'Check your loadout',
    description: 'Take a moment before you queue.',
  },
  {
    label: 'Error',
    type: 'error',
    title: 'Connection lost',
    description: 'Take a breath and try again.',
  },
] as const;

function ToastControls() {
  const manager = useToast();
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {notifications.map((notification) => (
        <Button
          key={notification.label}
          variant={
            notification.type === 'error'
              ? 'destructive'
              : notification.type === 'info'
                ? 'hextech'
                : 'secondary'
          }
          onClick={() =>
            manager.add({
              title: notification.title,
              description: notification.description,
              type: notification.type,
              ...(notification.type === 'success'
                ? {
                    actionProps: {
                      children: 'Undo',
                      onClick: () => manager.add({ title: 'Local save undone' }),
                    },
                  }
                : {}),
            })
          }
        >
          {notification.label}
        </Button>
      ))}
    </div>
  );
}

export function ToastDemo() {
  return (
    <ToastProvider>
      <ToastControls />
    </ToastProvider>
  );
}
