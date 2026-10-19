'use client';
import { useState } from 'react';
import { Combobox } from '@hextech-ui/react/combobox';

const members = [
  { id: 'avery', name: 'Avery' },
  { id: 'rowan', name: 'Rowan' },
];
export default function ComboboxControlledExample() {
  const [member, setMember] = useState<(typeof members)[number] | null>(members[0]!);
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Combobox
        label="Build owner"
        options={members}
        value={member}
        onValueChange={setMember}
        getOptionKey={(option) => option.id}
        itemToStringLabel={(option) => option.name}
      />
      <p role="status" className="text-sm text-muted-foreground">
        Owner ID: {member?.id ?? 'none'}
      </p>
    </div>
  );
}
