'use client';
import { Toast as Primitive } from '@base-ui/react/toast';
import { usePortalTheme } from '@/lib/theme-scope';
import { buttonVariants } from '@/lib/button-variants';
import { Spinner } from './spinner';
import { NotificationIcon } from '@/lib/notification-icon';

export type ToastProviderProps = Primitive.Provider.Props;
export function ToastProvider({ children, ...props }: ToastProviderProps) {
  return (
    <Primitive.Provider {...props}>
      {children}
      <ToastViewport />
    </Primitive.Provider>
  );
}
function ToastViewport() {
  const { toasts } = Primitive.useToastManager();
  const portalTheme = usePortalTheme();
  return (
    <Primitive.Portal>
      <Primitive.Viewport
        {...portalTheme}
        className="fixed right-4 bottom-4 z-[100] flex w-[min(360px,calc(100vw_-_2*var(--hextech-ui-rem)))] flex-col-reverse gap-3 outline-none"
      >
        {toasts.map((toast) => (
          <Primitive.Root
            key={toast.id}
            toast={toast}
            className="hx-toast relative flex items-center gap-1.5 border-2 border-transparent p-4 font-hx-sans text-[13px] leading-[normal] outline-none data-limited:hidden"
          >
            <Primitive.Content className="flex min-w-0 flex-1 items-center gap-1.5">
              {toast.type === 'loading' ? (
                <Spinner className="size-5" />
              ) : (
                <NotificationIcon type={toast.type} />
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Primitive.Title className="hx-toast-title font-hx-display text-hx-sm font-hx-bold uppercase leading-6 tracking-[0.075em]" />
                <Primitive.Description className="text-hx-sm leading-[calc(var(--hextech-ui-rem)*1.1025)] tracking-[0.02em] text-hx-muted-foreground" />
              </div>
              {toast.actionProps && (
                <Primitive.Action
                  className={buttonVariants({
                    variant: 'dimmed',
                    size: 'small',
                    thin: true,
                    className: 'hx-toast-action px-2',
                  })}
                />
              )}
              <Primitive.Close
                aria-label="Dismiss notification"
                className={buttonVariants({
                  variant: 'dimmed',
                  size: 'small',
                  shape: 'round',
                  thin: true,
                  className:
                    'hx-toast-close absolute start-0 top-0 size-[calc(var(--hextech-ui-rem)*1.33)] min-h-[calc(var(--hextech-ui-rem)*1.33)] -translate-x-[35%] -translate-y-[35%] p-0 rtl:translate-x-[35%]',
                })}
              >
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 3 6 6m0-6-6 6" />
                </svg>
              </Primitive.Close>
            </Primitive.Content>
          </Primitive.Root>
        ))}
      </Primitive.Viewport>
    </Primitive.Portal>
  );
}
export const useToast = Primitive.useToastManager;
export const createToastManager = Primitive.createToastManager;
export { ToastProvider as Toaster };
