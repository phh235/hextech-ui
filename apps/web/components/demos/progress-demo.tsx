'use client';

import { Progress } from '@hextech-ui/react/progress';

export function ProgressDemo() {
  return (
    <>
      <Progress label="Build progress" value={64} />
      <Progress label="Finding a match" value={null} />
    </>
  );
}
