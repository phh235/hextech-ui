'use client';

import { ButtonGroup, ButtonGroupSeparator } from '@hextech-ui/react/button-group';
import { Button } from '@hextech-ui/react/button';

export function ButtonGroupDemo() {
  return (
    <>
      <ButtonGroup aria-label="Build actions">
        <Button variant="primary">Save build</Button>
        <ButtonGroupSeparator />
        <Button variant="destructive">Delete build</Button>
      </ButtonGroup>
    </>
  );
}
