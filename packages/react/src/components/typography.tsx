import {
  createElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type HTMLAttributes,
} from 'react';
import { cn } from '@/lib/cn';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'default' | 'gold' | 'muted';
}
export function Heading({
  as = 'h2',
  size = 'lg',
  tone = 'default',
  className,
  ...props
}: HeadingProps): ReactElement {
  return createElement(as, {
    ...props,
    className: cn(
      'm-0 font-hx-display font-hx-bold uppercase tracking-hx-wide text-hx-foreground',
      {
        'text-[length:calc(var(--hextech-ui-rem)*1.5)] leading-[calc(var(--hextech-ui-rem)*1.8333)] tracking-[0.05em]':
          size === 'sm',
        'text-[length:calc(var(--hextech-ui-rem)*1.9167)] leading-[calc(var(--hextech-ui-rem)*2.3333)] tracking-[0.05em]':
          size === 'md',
        'text-[length:calc(var(--hextech-ui-rem)*2.3333)] leading-[calc(var(--hextech-ui-rem)*2.6667)] tracking-[0.05em]':
          size === 'lg',
        'text-[length:calc(var(--hextech-ui-rem)*3.3333)] leading-[calc(var(--hextech-ui-rem)*3.5)] tracking-[0.05em]':
          size === 'xl',
        'text-hx-primary': tone === 'gold',
        'text-hx-muted-foreground': tone === 'muted',
      },
      className,
    ),
  });
}
export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div';
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'muted' | 'accent';
}
export function Text({
  as = 'p',
  size = 'md',
  tone = 'default',
  className,
  ...props
}: TextProps): ReactElement {
  return createElement(as, {
    ...props,
    className: cn(
      'm-0 font-hx-sans text-hx-foreground',
      {
        'text-hx-sm leading-[calc(var(--hextech-ui-rem)*1.1025)] tracking-[0.02em]': size === 'sm',
        'text-hx-base leading-[calc(var(--hextech-ui-rem)*1.24)] tracking-[0.01em]': size === 'md',
        'text-hx-lg leading-[calc(var(--hextech-ui-rem)*1.875)] tracking-[0.025em]': size === 'lg',
        'text-hx-muted-foreground': tone === 'muted',
        'text-hx-accent': tone === 'accent',
      },
      className,
    ),
  });
}
export function Label({ className, ...props }: ComponentPropsWithoutRef<'label'>): ReactElement {
  return (
    <label
      {...props}
      className={cn(
        'font-hx-sans text-hx-sm font-hx-normal leading-[calc(var(--hextech-ui-rem)*1.1025)] tracking-[0.02em] text-hx-muted-foreground',
        className,
      )}
    />
  );
}
