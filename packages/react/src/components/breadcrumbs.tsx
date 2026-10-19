import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
export function Breadcrumbs({ className, children, ...props }: ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav aria-label="Breadcrumbs" {...props} className={className}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-1 p-0 font-hx-display text-hx-sm font-hx-medium uppercase leading-[normal] tracking-[0.1em]">
        {children}
      </ol>
    </nav>
  );
}
export interface BreadcrumbProps extends ComponentPropsWithoutRef<'li'> {
  href?: string;
  current?: boolean;
}
export function Breadcrumb({
  href,
  current = !href,
  className,
  children,
  ...props
}: BreadcrumbProps) {
  return (
    <li {...props} className={cn('inline-flex items-center', className)}>
      {href && !current ? (
        <>
          <a
            href={href}
            className="hx-breadcrumb-link px-4 text-[var(--hextech-ui-gold-300)] no-underline hover:text-hx-foreground"
          >
            {children}
          </a>
          <svg
            aria-hidden="true"
            width="6"
            height="11"
            viewBox="0 0 6 11"
            fill="none"
            className="block shrink-0 text-hx-primary"
          >
            <path d="m1 1 4 4.5L1 10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </>
      ) : (
        <span
          aria-current={current ? 'page' : undefined}
          className="px-4 text-[var(--hextech-ui-gold-300)]"
        >
          {children}
        </span>
      )}
    </li>
  );
}
