'use client';
import { useState } from 'react';
import { Button } from '@hextech-ui/react/button';

export default function ButtonLoadingExample() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  async function save() {
    if (pending) return;
    setPending(true);
    setMessage('');
    try {
      // Local demonstration; replace this delay with your save request.
      await new Promise((resolve) => setTimeout(resolve, 700));
      setMessage('Build saved locally.');
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="grid justify-items-start gap-3">
      <Button variant="primary" loading={pending} onClick={save}>
        {pending ? 'Saving build' : 'Save build'}
      </Button>
      <p role="status" className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
