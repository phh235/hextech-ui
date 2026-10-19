'use client';
import { Meter as Primitive } from '@base-ui/react/meter';
import { cn } from '@/lib/cn';

export interface MeterProps extends Omit<Primitive.Root.Props, 'className' | 'children'> {
  label: string;
  tone?: 'gold' | 'teal' | 'destructive';
  className?: string;
}
/** A measurement within a known range; use Progress for task completion. */
export function Meter({ label, tone = 'teal', className, ...props }: MeterProps) {
  return (
    <Primitive.Root {...props} className={cn('grid gap-2 font-hx-sans text-hx-sm', className)}>
      <div className="flex items-center justify-between gap-3">
        <Primitive.Label className="text-hx-primary">{label}</Primitive.Label>
        <Primitive.Value className="tabular-nums text-hx-foreground" />
      </div>
      <Primitive.Track className="h-3 overflow-hidden border border-hx-primary/70 bg-hx-muted">
        <Primitive.Indicator
          className={cn('h-full', {
            'bg-hx-accent': tone === 'teal',
            'bg-hx-primary': tone === 'gold',
            'bg-hx-destructive': tone === 'destructive',
          })}
        />
      </Primitive.Track>
    </Primitive.Root>
  );
}
