'use client';

import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@hextech-ui/react/item';
import { Avatar, AvatarImage, AvatarFallback } from '@hextech-ui/react/avatar';
import { Button } from '@hextech-ui/react/button';

export function ItemDemo() {
  return (
    <>
      <Item variant="outline" className="w-full flex-wrap">
        <ItemMedia>
          <Avatar aria-label="Starlight">
            <AvatarImage src="/icon.svg" alt="" className="object-contain p-2" />
            <AvatarFallback>H</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Starlight</ItemTitle>
          <ItemDescription>Support main. Ready for the next game.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="small">Invite Starlight</Button>
        </ItemActions>
      </Item>
    </>
  );
}
