'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@hextech-ui/react/avatar';

export function AvatarDemo() {
  return (
    <>
      <Avatar aria-label="Starlight">
        <AvatarImage src="/icon.svg" alt="" className="object-contain p-2" />
        <AvatarFallback>H</AvatarFallback>
      </Avatar>
    </>
  );
}
