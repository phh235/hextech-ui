'use client';

import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardContent,
} from '@hextech-ui/react/preview-card';

export function PreviewCardDemo() {
  return (
    <>
      <PreviewCard>
        <PreviewCardTrigger href="/docs/theming">Theming guide</PreviewCardTrigger>
        <PreviewCardContent>Explore semantic CSS variables.</PreviewCardContent>
      </PreviewCard>
    </>
  );
}
