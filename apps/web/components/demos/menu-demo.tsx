'use client';

import { Menu, MenuTrigger, MenuContent, MenuItem } from '@hextech-ui/react/menu';

export function MenuDemo() {
  return (
    <>
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem onClick={() => console.log('Save')}>Save build</MenuItem>
          <MenuItem>Duplicate</MenuItem>
        </MenuContent>
      </Menu>
    </>
  );
}
