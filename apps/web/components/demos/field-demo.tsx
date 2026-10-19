'use client';

import { TextField } from '@hextech-ui/react/field';

export function FieldDemo() {
  return (
    <>
      <TextField label="Profile name" name="name" description="Visible to your party." required />
    </>
  );
}
