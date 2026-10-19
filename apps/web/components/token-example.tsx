'use client';
import { useState } from 'react';
import {
  TokenField,
  TokenFieldValue,
  insertToken,
  type LexicalEditor,
} from '@hextech-ui/react/token-field';
import { Button } from '@hextech-ui/react/button';
const initial = new TokenFieldValue([
  { type: 'text', text: 'Ask ' },
  { type: 'token', id: 'avery', text: '@Avery' },
  { type: 'text', text: ' about this build.' },
]);
export default function TokenExample({ disabled = false }: { disabled?: boolean }) {
  const [editor, setEditor] = useState<LexicalEditor | null>(null);
  const [value, setValue] = useState(initial);
  const [submitted, setSubmitted] = useState('');
  return (
    <form
      className="grid w-full max-w-md gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(new FormData(event.currentTarget).get('message')?.toString() || '');
      }}
    >
      <TokenField
        label="Message"
        name="message"
        required
        maxLength={300}
        value={value}
        onValueChange={setValue}
        onReady={setEditor}
        disabled={disabled}
        description="Text and mention tokens share one caret. Backspace removes a mention atomically."
      />
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          size="small"
          disabled={disabled || !editor}
          onClick={() => {
            if (editor) insertToken(editor, { type: 'token', id: 'rowan', text: '@Rowan' });
          }}
        >
          Insert Rowan
        </Button>
        <Button type="submit" size="small" variant="primary" disabled={disabled}>
          Save message
        </Button>
        <Button
          type="button"
          size="small"
          disabled={disabled}
          onClick={() => setValue(new TokenFieldValue())}
        >
          Clear message
        </Button>
      </div>
      <p role="status" className="m-0 text-xs text-muted-foreground">
        {submitted ? `Saved locally: ${submitted}` : 'Local demo only. No message is sent.'}
      </p>
    </form>
  );
}
