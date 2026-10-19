'use client';
import { Progress as Primitive } from '@base-ui/react/progress';
import { cn } from '@/lib/cn';
export interface ProgressProps extends Omit<Primitive.Root.Props, 'className' | 'children'> {
  className?: string;
  label?: string;
}
export function Progress({ className, label = 'Loading', ...props }: ProgressProps) {
  return (
    <Primitive.Root
      {...props}
      className={cn('hx-progress grid w-56 gap-1 font-hx-sans text-hx-sm', className)}
    >
      <div className="flex justify-between gap-4 font-hx-display text-hx-sm font-hx-bold uppercase leading-[normal] text-hx-foreground">
        <Primitive.Label className="text-hx-foreground">{label}</Primitive.Label>
        <Primitive.Value className="text-hx-foreground" />
      </div>
      <Primitive.Track className="hx-progress-track -ml-0.5 -mr-1 h-3 overflow-hidden rounded-full border border-transparent p-px">
        <Primitive.Indicator
          style={{ height: '100%' }}
          className="hx-progress-fill h-full rounded-full data-indeterminate:w-1/3"
        />
      </Primitive.Track>
    </Primitive.Root>
  );
}
export { Progress as ProgressBar };
