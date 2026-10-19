'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@hextech-ui/react/card';

export function CardDemo() {
  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Build notes</CardTitle>
        </CardHeader>
        <CardContent>Your next chapter.</CardContent>
      </Card>
    </>
  );
}
