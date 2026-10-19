'use client';

import { Toggle } from '@base-ui/react/toggle';
import { useInternalState } from '@/hooks/use-internal-state';
import { cn } from '@/lib/cn';

export interface InternalSmokeProps {
  disabled?: boolean;
}

/** Verification fixture only. Never exported by the npm package or listed in the catalog. */
export function InternalSmoke({ disabled = false }: InternalSmokeProps) {
  const [pressed, setPressed] = useInternalState();
  return (
    <Toggle
      aria-label="Internal verification toggle"
      pressed={pressed}
      onPressedChange={setPressed}
      disabled={disabled}
      className={cn(
        'min-h-11 rounded-hx-md border border-hx-primary bg-hx-surface px-5 py-2 text-hx-foreground transition-colors data-pressed:bg-hx-primary data-pressed:text-hx-primary-foreground disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hx-focus',
      )}
    >
      {pressed ? 'Fixture active' : 'Activate fixture'}
    </Toggle>
  );
}
