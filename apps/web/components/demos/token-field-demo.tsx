'use client';

import { TokenField, TokenFieldValue } from '@hextech-ui/react/token-field';

export function TokenFieldDemo() {
  const initial = new TokenFieldValue([
    { type: 'text', text: 'Ask ' },
    { type: 'token', id: 'avery', text: '@Avery' },
    { type: 'text', text: ' for the next build.' },
  ]);
  return <TokenField label="Message" defaultValue={initial} name="message" />;
}
