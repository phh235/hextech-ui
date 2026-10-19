import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'hextech' | 'dimmed' | 'destructive';
export type ControlSize = 'small' | 'medium' | 'large';
export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ControlSize;
  shape?: 'normal' | 'square' | 'round';
  thin?: boolean;
  className?: string | undefined;
}

export function buttonVariants({
  variant = 'secondary',
  size = 'medium',
  shape = 'normal',
  thin = variant === 'dimmed',
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    'hx-button relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-none border-2 border-transparent px-4 font-hx-display text-hx-base font-hx-bold uppercase leading-none tracking-[0.05em] outline-offset-2 disabled:pointer-events-none',
    {
      'min-h-8 px-2 text-hx-sm/none': size === 'small',
      'min-h-9': size === 'medium',
      'min-h-10': size === 'large',
      'aspect-square p-0 font-hx-black': shape !== 'normal',
      'rounded-[9999px]': shape === 'round',
      border: thin,
      'hx-button-primary': variant === 'primary',
      'hx-button-secondary': variant === 'secondary',
      'hx-button-hextech': variant === 'hextech',
      'hx-button-text px-0': variant === 'text',
      'hx-button-dimmed': variant === 'dimmed',
      'hx-button-destructive': variant === 'destructive',
    },
    className,
  );
}
