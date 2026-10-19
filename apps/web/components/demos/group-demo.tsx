'use client';

import { Group, GroupInput, GroupSeparator } from '@hextech-ui/react/group';

export function GroupDemo() {
  return (
    <>
      <Group aria-label="Player identity">
        <GroupInput aria-label="Name" />
        <GroupSeparator>#</GroupSeparator>
        <GroupInput aria-label="Tag" />
      </Group>
    </>
  );
}
