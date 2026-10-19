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
      'm-0 font-display font-bold uppercase tracking-wide text-foreground',
      {
        'text-[1.5rem] leading-[1.8333rem] tracking-[0.05em]': size === 'sm',
        'text-[1.9167rem] leading-[2.3333rem] tracking-[0.05em]': size === 'md',
        'text-[2.3333rem] leading-[2.6667rem] tracking-[0.05em]': size === 'lg',
        'text-[3.3333rem] leading-[3.5rem] tracking-[0.05em]': size === 'xl',
        'text-primary': tone === 'gold',
        'text-muted-foreground': tone === 'muted',
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
      'm-0 font-sans text-foreground',
      {
        'text-sm leading-[1.1025rem] tracking-[0.02em]': size === 'sm',
        'text-base leading-[1.24rem] tracking-[0.01em]': size === 'md',
        'text-lg leading-[1.875rem] tracking-[0.025em]': size === 'lg',
        'text-muted-foreground': tone === 'muted',
        'text-accent': tone === 'accent',
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
        'font-sans text-sm font-normal leading-[1.1025rem] tracking-[0.02em] text-muted-foreground',
        className,
      )}
    />
  );
}
