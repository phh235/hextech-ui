'use client';

import { TagGroup } from '@hextech-ui/react/tag-group';
import { useState } from 'react';

export function TagGroupDemo() {
  const [items, setItems] = useState([
    { id: 'support', label: 'Support' },
    { id: 'practice', label: 'Practice' },
  ]);
  return (
    <TagGroup
      label="Build tags"
      items={items}
      selectionMode="multiple"
      onRemove={(ids) => setItems(items.filter((item) => !ids.includes(item.id)))}
    />
  );
}
