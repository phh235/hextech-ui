'use client';
import { Slider as Primitive } from '@base-ui/react/slider';
import { cn } from '@/lib/cn';
export interface SliderProps extends Omit<Primitive.Root.Props, 'className' | 'children'> {
  className?: string;
  label: string;
  thumbLabels?: string[];
}
export function Slider({ className, label, thumbLabels, ...props }: SliderProps) {
  const values = props.value ?? props.defaultValue ?? 0;
  const count = Array.isArray(values) ? values.length : 1;
  return (
    <Primitive.Root
      {...props}
      className={cn('hx-slider grid w-full min-w-32 gap-1 font-sans text-sm', className)}
    >
      <div className="flex justify-between gap-4 text-xs">
        <Primitive.Label>{label}</Primitive.Label>
        <Primitive.Value className="font-mono text-primary" />
      </div>
      <Primitive.Control className="hx-slider-control flex h-7 touch-none items-center">
        <Primitive.Track className="hx-slider-track relative h-0.5 w-full rounded-full">
          <Primitive.Indicator className="hx-slider-indicator h-0.5 rounded-full" />
          {Array.from({ length: count }, (_, index) => (
            <Primitive.Thumb
              key={index}
              index={index}
              getAriaLabel={() =>
                thumbLabels?.[index] || (count > 1 ? `${label} ${index + 1}` : label)
              }
              className="hx-slider-thumb size-7"
            />
          ))}
        </Primitive.Track>
      </Primitive.Control>
    </Primitive.Root>
  );
}
export const SliderOutput = Primitive.Value;
