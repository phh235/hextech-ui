'use client';

import { AvatarGroup, AvatarGroupCount } from '@hextech-ui/react/avatar-group';
import { Avatar, AvatarImage, AvatarFallback } from '@hextech-ui/react/avatar';

export function AvatarGroupDemo() {
  return (
    <>
      <AvatarGroup label="Your party">
        <Avatar aria-label="Hextech UI">
          <AvatarImage src="/icon.svg" alt="" className="object-contain p-2" />
          <AvatarFallback>H</AvatarFallback>
        </Avatar>
        <Avatar aria-label="shadcn">
          <AvatarImage src="https://github.com/shadcn.png" alt="" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar aria-label="Hextech UI flat mark">
          <AvatarImage src="/brand/marks/flat.svg" alt="" className="object-contain p-2" />
          <AvatarFallback>H</AvatarFallback>
        </Avatar>
        <AvatarGroupCount aria-label="2 more party members">+2</AvatarGroupCount>
      </AvatarGroup>
    </>
  );
}
