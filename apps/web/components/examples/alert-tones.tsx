'use client';
import { Alert, AlertTitle, AlertDescription } from '@hextech-ui/react/alert';

export default function AlertTonesExample() {
  return (
    <div className="grid w-full gap-3">
      <Alert tone="success">
        <AlertTitle>Changes saved</AlertTitle>
        <AlertDescription>Your local configuration is ready.</AlertDescription>
      </Alert>
      <Alert tone="warning">
        <AlertTitle>Review your changes</AlertTitle>
        <AlertDescription>Check the configuration before continuing.</AlertDescription>
      </Alert>
      <Alert tone="destructive">
        <AlertTitle>Could not save</AlertTitle>
        <AlertDescription>Your changes are still available. Try again.</AlertDescription>
      </Alert>
    </div>
  );
}
