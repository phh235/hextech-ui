'use client';
import { useState } from 'react';
import { Combobox } from '@hextech-ui/react/combobox';
import { MultipleSelect } from '@hextech-ui/react/multiple-select';
import { Autocomplete } from '@hextech-ui/react/autocomplete';
import { Button } from '@hextech-ui/react/button';
import type { ControlSize } from '@hextech-ui/react/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@hextech-ui/react/dialog';
interface Member {
  id: string;
  name: string;
  role: string;
  disabled?: boolean;
}
const initial: Member[] = [
  { id: 'avery', name: 'Avery', role: 'Guide' },
  { id: 'rowan', name: 'Rowan', role: 'Guard' },
  { id: 'sage', name: 'Sage', role: 'Ranger', disabled: true },
];
export function RecordSelectionExample({
  multiple = false,
  disabled = false,
}: {
  multiple?: boolean;
  disabled?: boolean;
}) {
  const [options, setOptions] = useState(initial);
  // Intentionally retain earlier object instances when the option payload is refreshed.
  const [member, setMember] = useState<Member | null>(initial[0]!);
  const [members, setMembers] = useState<Member[]>([initial[0]!]);
  const [saved, setSaved] = useState('');
  const [size, setSize] = useState<ControlSize>('medium');
  const [clearOnEscape, setClearOnEscape] = useState(false);
  const common = {
    label: multiple ? 'Party members' : 'Party leader',
    options,
    getOptionKey: (item: Member) => item.id,
    itemToStringLabel: (item: Member) => item.name,
    isOptionDisabled: (item: Member) => Boolean(item.disabled),
    renderOption: (item: Member) => (
      <span className="grid gap-1">
        <span>{item.name}</span>
        <span className="text-hx-xs text-hx-muted-foreground">{item.role}</span>
      </span>
    ),
    disabled,
    name: multiple ? 'members' : 'leader',
    size,
    clearOnEscape,
  };
  return (
    <form
      aria-label={multiple ? 'Object multi-selection' : 'Object selection'}
      className="grid w-full max-w-md gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget).getAll(common.name);
        setSaved(values.join(', '));
      }}
    >
      <div className="flex flex-wrap items-center gap-3 text-hx-xs">
        <label className="grid gap-2">
          Control size
          <select
            aria-label="Record control size"
            value={size}
            onChange={(event) => setSize(event.target.value as ControlSize)}
            className="border border-hx-border bg-hx-background p-2"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={clearOnEscape}
            onChange={(event) => setClearOnEscape(event.target.checked)}
          />
          Escape clears selections
        </label>
      </div>
      {multiple ? (
        <MultipleSelect
          {...common}
          value={members}
          onValueChange={setMembers}
          emptySelection={
            <span className="text-hx-xs text-hx-muted-foreground">No party members selected</span>
          }
          emptyState="No matching party members."
        />
      ) : (
        <Combobox
          {...common}
          value={member}
          onValueChange={setMember}
          emptyState="No matching party members."
        />
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="small" disabled={disabled}>
          Read form IDs
        </Button>
        <Button
          type="button"
          size="small"
          variant="dimmed"
          disabled={disabled}
          onClick={() =>
            setOptions((items) =>
              items.map((item) => ({
                ...item,
                name: item.id === 'avery' ? 'Avery refreshed' : item.name,
              })),
            )
          }
        >
          Refresh option records
        </Button>
      </div>
      <p role="status" className="m-0 text-hx-xs text-hx-accent">
        {saved
          ? `Submitted IDs: ${saved}`
          : 'Object records use stable IDs for native form values.'}
      </p>
      {!multiple && (
        <Dialog>
          <DialogTrigger>Try selection in a dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Party leader dialog</DialogTitle>
            <DialogDescription>
              Escape dismisses suggestions first, then the dialog. Committed selection remains.
            </DialogDescription>
            <Combobox
              label="Dialog party leader"
              options={options}
              value={member}
              onValueChange={setMember}
              getOptionKey={(item) => item.id}
              itemToStringLabel={(item) => item.name}
            />
          </DialogContent>
        </Dialog>
      )}
    </form>
  );
}
export function AutocompleteExample({ disabled = false }: { disabled?: boolean }) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState('');
  return (
    <form
      className="grid w-full max-w-md gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(String(new FormData(event.currentTarget).get('query') || ''));
      }}
    >
      <Autocomplete
        label="Build query"
        name="query"
        options={initial}
        itemToStringValue={(item) => item.name}
        isOptionDisabled={(item) => Boolean(item.disabled)}
        value={text}
        onValueChange={setText}
        disabled={disabled}
        placeholder="Use a suggestion or your own words…"
      />
      <Button type="submit" disabled={disabled}>
        Use query
      </Button>
      <p role="status" className="m-0 text-hx-xs text-hx-accent">
        {submitted ? `Query: ${submitted}` : 'Suggestions are optional. Free text is retained.'}
      </p>
    </form>
  );
}
