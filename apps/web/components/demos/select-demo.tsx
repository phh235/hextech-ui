'use client';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@hextech-ui/react/select';

export function SelectDemo() {
  return (
    <>
      <Select defaultValue="support">
        <SelectTrigger aria-label="Preferred role">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="support">Support</SelectItem>
          <SelectItem value="jungle">Jungle</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
