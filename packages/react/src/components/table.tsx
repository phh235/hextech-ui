import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
export function Table({ className, ...props }: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        {...props}
        className={cn(
          'hx-table w-full border-collapse font-sans text-left text-sm leading-[1.1025rem] tracking-[0.02em]',
          className,
        )}
      />
    </div>
  );
}
export function TableCaption({ className, ...props }: ComponentPropsWithoutRef<'caption'>) {
  return (
    <caption {...props} className={cn('mb-3 text-left text-xs text-muted-foreground', className)} />
  );
}
export function TableHeader({ className, ...props }: ComponentPropsWithoutRef<'thead'>) {
  return <thead {...props} className={cn('hx-table-header', className)} />;
}
export function TableBody({ className, ...props }: ComponentPropsWithoutRef<'tbody'>) {
  return <tbody {...props} className={cn('[&_tr:last-child]:border-0', className)} />;
}
export function TableFooter({ className, ...props }: ComponentPropsWithoutRef<'tfoot'>) {
  return <tfoot {...props} className={cn('hx-table-footer', className)} />;
}
export function TableRow({ className, ...props }: ComponentPropsWithoutRef<'tr'>) {
  return <tr {...props} className={cn('hx-table-row', className)} />;
}
export function TableHead({ className, scope = 'col', ...props }: ComponentPropsWithoutRef<'th'>) {
  return (
    <th
      {...props}
      scope={scope}
      className={cn(
        'hx-table-head px-3 py-1.5 text-left font-display text-xs font-bold uppercase leading-4 tracking-[0.075em]',
        className,
      )}
    />
  );
}
export function TableCell({ className, ...props }: ComponentPropsWithoutRef<'td'>) {
  return <td {...props} className={cn('border-0 px-3 py-1.5 align-middle', className)} />;
}
