'use client';

import { Alert, AlertTitle, AlertDescription } from '@hextech-ui/react/alert';

export function AlertDemo() {
  return (
    <>
      <Alert tone="info" className="w-full max-w-sm">
        <AlertTitle>Your next chapter</AlertTitle>
        <AlertDescription>Save a build before starting your next session.</AlertDescription>
      </Alert>
    </>
  );
}
