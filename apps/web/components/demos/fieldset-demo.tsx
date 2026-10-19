'use client';

import { Fieldset, FieldsetLegend, FieldsetDescription } from '@hextech-ui/react/fieldset';
import { FieldGroup, TextField } from '@hextech-ui/react/field';

export function FieldsetDemo() {
  return (
    <>
      <Fieldset className="w-full max-w-sm">
        <FieldsetLegend>Party details</FieldsetLegend>
        <FieldsetDescription>Choose how your party appears.</FieldsetDescription>
        <FieldGroup>
          <TextField label="Party title" name="party" defaultValue="The night shift" />
          <TextField label="Party tag" name="tag" defaultValue="NIGHT" />
        </FieldGroup>
      </Fieldset>
    </>
  );
}
