'use client';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { buttonVariants, type ButtonStyleOptions } from '@/lib/button-variants';

export interface LinkProps extends ComponentPropsWithoutRef<'a'> {
  disabled?: boolean;
}
const AccessibleAnchor = forwardRef<HTMLAnchorElement, LinkProps>(function AccessibleAnchor(
  { disabled, href, tabIndex, onClick, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      {...props}
      {...(!disabled && href ? { href } : {})}
      role={props.role ?? (disabled ? 'link' : undefined)}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : tabIndex}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
      }}
    />
  );
});
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, ...props },
  ref,
) {
  return (
    <AccessibleAnchor
      ref={ref}
      {...props}
      className={cn(
        'text-hx-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-hx-focus aria-disabled:pointer-events-none aria-disabled:opacity-50',
        className,
      )}
    />
  );
});
export interface ButtonLinkProps extends LinkProps, ButtonStyleOptions {}
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { variant, size, shape, thin, className, ...props },
  ref,
) {
  return (
    <AccessibleAnchor
      ref={ref}
      {...props}
      data-hextech-ui="button-link"
      className={buttonVariants({
        ...(variant && { variant }),
        ...(size && { size }),
        ...(shape && { shape }),
        ...(thin !== undefined && { thin }),
        className: cn('no-underline aria-disabled:opacity-100', className),
      })}
    />
  );
});
