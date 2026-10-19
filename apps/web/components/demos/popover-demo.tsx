'use client';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverTitle,
  PopoverDescription,
} from '@hextech-ui/react/popover';

export function PopoverDemo() {
  return (
    <>
      <Popover>
        <PopoverTrigger>Details</PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <PopoverTitle>Party details</PopoverTitle>
            <PopoverDescription>Invite only.</PopoverDescription>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
