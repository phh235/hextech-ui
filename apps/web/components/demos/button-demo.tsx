'use client';

import { Button } from '@hextech-ui/react/button';

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="primary">Queue up</Button>
      <Button variant="secondary">Save</Button>
      <Button variant="hextech">Explore</Button>
      <Button variant="dimmed">Later</Button>
      <Button variant="text">More</Button>
      <Button variant="destructive">Delete</Button>
      <Button loading>Preparing</Button>
    </div>
  );
}
