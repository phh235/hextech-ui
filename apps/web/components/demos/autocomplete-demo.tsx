'use client';

import { Autocomplete } from '@hextech-ui/react/autocomplete';

export function AutocompleteDemo() {
  return (
    <>
      <Autocomplete label="Build query" options={['Vision', 'Tempo', 'Roaming']} name="query" />
    </>
  );
}
