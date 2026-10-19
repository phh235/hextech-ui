import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { inputVariants } from './input';
export type TextareaProps = ComponentPropsWithoutRef<'textarea'>;
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 2, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      {...props}
      rows={rows}
      className={cn(inputVariants(), 'resize-y py-2', className)}
    />
  );
});
export { Textarea as TextArea };
