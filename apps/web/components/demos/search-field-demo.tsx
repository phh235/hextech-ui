'use client';

import { SearchField } from '@hextech-ui/react/search-field';

export function SearchFieldDemo() {
  return (
    <>
      <SearchField
        label="Search builds"
        placeholder="Type a name…"
        onSearch={(query) => console.log(query)}
        debounceMs={300}
      />
    </>
  );
}
