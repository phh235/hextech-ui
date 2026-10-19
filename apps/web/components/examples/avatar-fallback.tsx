'use client';
import { Avatar, AvatarImage, AvatarFallback } from '@hextech-ui/react/avatar';

export default function AvatarFallbackDemo() {
  return (
    <Avatar aria-label="Hextech UI profile">
      <AvatarImage src="/icon.svg" alt="" />
      <AvatarFallback>H</AvatarFallback>
    </Avatar>
  );
}
