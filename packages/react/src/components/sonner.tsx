'use client';

import { forwardRef, useSyncExternalStore } from 'react';
import { Toaster as SonnerToaster, type ToasterProps, type ExternalToast } from 'sonner';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/lib/button-variants';
import { NotificationIcon } from '@/lib/notification-icon';
import { ThemeScope, usePortalTheme } from '@/lib/theme-scope';
import { Spinner } from './spinner';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-color-mode', 'class'],
  });
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener('change', onChange);
  };
}
function systemMode(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function documentMode(): 'light' | 'dark' {
  const root = document.documentElement;
  const mode = root.getAttribute('data-color-mode');
  if (mode === 'dark' || mode === 'light') return mode;
  if (root.classList.contains('dark')) return 'dark';
  if (root.classList.contains('light')) return 'light';
  return systemMode();
}
const serverMode = () => 'dark' as const;

export { toast as sonner } from 'sonner';
/** Options for the imperative notification API. */
export type SonnerProps = ExternalToast;
export type SonnerToasterProps = ToasterProps;

/** Sonner's lifecycle and API with Hextech visuals, independent of Next.js. */
export const Sonner = forwardRef<HTMLElement, SonnerToasterProps>(function Sonner(
  { theme, icons, toastOptions, className, ...props },
  ref,
) {
  const scope = usePortalTheme();
  const fallback = useSyncExternalStore(
    subscribe,
    theme === 'system' ? systemMode : documentMode,
    serverMode,
  );
  const mode = theme === 'system' ? fallback : (theme ?? scope['data-color-mode'] ?? fallback);
  const overrides = toastOptions?.classNames;
  const action = buttonVariants({
    variant: 'dimmed',
    size: 'small',
    thin: true,
    className: 'hx-sonner-action shrink-0 px-2',
  });
  return (
    <ThemeScope colorMode={mode} {...(scope.style && { style: scope.style })}>
      <SonnerToaster
        {...props}
        ref={ref}
        theme={mode}
        className={cn('hx-sonner', className)}
        toastOptions={{
          ...toastOptions,
          unstyled: true,
          closeButtonAriaLabel: toastOptions?.closeButtonAriaLabel ?? 'Dismiss notification',
          classNames: {
            ...overrides,
            toast: cn(
              'hx-toast hx-sonner-toast flex w-[var(--width)] items-center gap-1.5 border-2 border-transparent p-4 font-sans text-[13px] leading-[normal]',
              overrides?.toast,
            ),
            title: cn(
              'm-0 font-display text-sm font-bold uppercase leading-6 tracking-[0.075em]',
              overrides?.title,
            ),
            description: cn(
              'font-sans text-sm leading-[1.1025rem] tracking-[0.02em] text-muted-foreground',
              overrides?.description,
            ),
            content: cn('flex min-w-0 flex-1 flex-col gap-0.5', overrides?.content),
            icon: cn('hx-sonner-icon relative flex size-5 shrink-0 items-center', overrides?.icon),
            loader: cn('size-5', overrides?.loader),
            actionButton: cn(action, overrides?.actionButton),
            cancelButton: cn(action, overrides?.cancelButton),
            closeButton: cn(
              buttonVariants({
                variant: 'dimmed',
                size: 'small',
                shape: 'round',
                thin: true,
                className:
                  'hx-sonner-close absolute top-0 z-10 size-[1.33rem] min-h-[1.33rem] cursor-pointer p-0',
              }),
              overrides?.closeButton,
            ),
          },
        }}
        icons={{
          loading: <Spinner className="size-5" aria-hidden />,
          success: <NotificationIcon type="success" />,
          warning: <NotificationIcon type="warning" />,
          error: <NotificationIcon type="error" />,
          info: <NotificationIcon type="info" />,
          close: (
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeLinecap="round"
            >
              <path d="m3 3 6 6m0-6-6 6" />
            </svg>
          ),
          ...icons,
        }}
      />
    </ThemeScope>
  );
});
