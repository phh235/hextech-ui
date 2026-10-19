'use client';

import { Heading, Text, Label } from '@hextech-ui/react/typography';

export function TypographyDemo() {
  return (
    <>
      <Heading as="h2" tone="gold">
        Beyond the ordinary
      </Heading>
      <Text tone="muted">The details make the experience.</Text>
      <Label htmlFor="name">Display name</Label>
    </>
  );
}
