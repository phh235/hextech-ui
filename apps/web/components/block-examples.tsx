'use client';
import { AuthBlock } from '@hextech-ui/react/blocks/auth';
import { AccountBlock } from '@hextech-ui/react/blocks/account';
import { LobbyBlock } from '@hextech-ui/react/blocks/lobby';
import { DraftBlock } from '@hextech-ui/react/blocks/draft';
import { HudBlock } from '@hextech-ui/react/blocks/hud';
export function BlockExample({ name }: { name: string }) {
  switch (name) {
    case 'auth':
      return <AuthBlock />;
    case 'account':
      return <AccountBlock />;
    case 'lobby':
      return <LobbyBlock />;
    case 'draft':
      return <DraftBlock />;
    case 'hud':
      return <HudBlock />;
    default:
      return null;
  }
}
