'use client';
import { Button } from '@hextech-ui/react/button';

export default function ButtonSizesExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="small">Small action</Button>
      <Button size="medium">Medium action</Button>
      <Button size="large">Large action</Button>
    </div>
  );
}
