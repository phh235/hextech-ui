'use client';

import { Textarea } from '@hextech-ui/react/textarea';

export function TextareaDemo() {
  return (
    <>
      <div className="grid gap-2">
        <label htmlFor="notes">Build notes</label>
        <Textarea id="notes" name="notes" rows={4} />
      </div>
    </>
  );
}
