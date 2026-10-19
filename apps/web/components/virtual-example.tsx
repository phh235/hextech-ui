'use client';
import { useState } from 'react';
import { VirtualListbox } from '@hextech-ui/react/virtual-listbox';
const items = Array.from({ length: 1000 }, (_, index) => ({
  id: String(index + 1),
  label: `Practice build ${String(index + 1).padStart(4, '0')}`,
  disabled: index === 9,
}));
export default function VirtualExample({ disabled = false }: { disabled?: boolean }) {
  const [value, setValue] = useState<readonly string[]>([]);
  return (
    <div className="grid w-full max-w-md gap-3">
      <VirtualListbox
        label="Practice builds"
        items={items}
        multiple
        value={value}
        onValueChange={setValue}
        disabled={disabled}
      />
      <p role="status" className="m-0 text-xs text-muted-foreground">
        Selected builds: {value.join(', ') || 'none'}
      </p>
      <p className="m-0 text-xs text-muted-foreground">
        1,000 local options; only the visible range and active option are mounted. Use arrows,
        Home/End, and Space.
      </p>
    </div>
  );
}
