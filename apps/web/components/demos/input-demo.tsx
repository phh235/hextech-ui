'use client';

import { Input } from '@hextech-ui/react/input';

export function InputDemo() {
  return (
    <>
      <Input
        aria-label="Text input"
        defaultValue="The quick brown fox jumps over the lazy dog."
        placeholder="The quick brown fox jumps over the lazy dog."
      />
    </>
  );
}
