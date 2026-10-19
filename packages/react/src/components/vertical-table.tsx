import type { Key, ReactNode, ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
export interface VerticalTableField<T> {
  id: Key;
  label: ReactNode;
  render: (record: T, index: number) => ReactNode;
  align?: 'start' | 'center' | 'end';
}
export interface VerticalTableProps<T> extends Omit<ComponentPropsWithoutRef<'table'>, 'children'> {
  label: string;
  records: readonly T[];
  fields: readonly VerticalTableField<T>[];
  recordKey: (record: T) => Key;
  recordLabel?: (record: T) => ReactNode;
}
export function VerticalTable<T>({
  label,
  records,
  fields,
  recordKey,
  recordLabel,
  className,
  ...props
}: VerticalTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        {...props}
        aria-label={label}
        className={cn(
          'hx-vertical-table w-full border-collapse font-hx-sans text-hx-sm leading-[calc(var(--hextech-ui-rem)*1.1025)] tracking-[0.02em] text-hx-muted-foreground',
          className,
        )}
      >
        {recordLabel && (
          <thead>
            <tr>
              <td className="hx-vertical-table-corner" />
              {records.map((record) => (
                <th
                  scope="col"
                  key={recordKey(record)}
                  className="hx-table-head px-3 py-1.5 font-hx-display text-hx-xs font-hx-bold uppercase leading-4 tracking-[0.075em] text-hx-foreground"
                >
                  {recordLabel(record)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {fields.map((field) => (
            <tr key={field.id} className="border-0">
              <th
                scope="row"
                className="hx-field-header w-px whitespace-nowrap px-3 py-1.5 text-left font-hx-display text-hx-xs font-hx-bold uppercase leading-4 tracking-[0.075em] text-hx-foreground"
              >
                {field.label}
              </th>
              {records.map((record, index) => (
                <td
                  key={recordKey(record)}
                  className={cn('border-0 px-3 py-1.5', {
                    'text-center': field.align === 'center',
                    'text-right': field.align === 'end',
                  })}
                >
                  {field.render(record, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
