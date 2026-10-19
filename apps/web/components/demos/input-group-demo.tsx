'use client';

import { useRef, useState } from 'react';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
  InputGroupButton,
} from '@hextech-ui/react/input-group';

export function InputGroupDemo() {
  const [handle, setHandle] = useState('starlight');
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor="profile-handle">Profile handle</label>
      <InputGroup>
        <InputGroupInput ref={input} id="profile-handle" value={handle} onValueChange={setHandle} />
        <InputGroupAddon>
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Clear profile handle"
            onClick={() => {
              setHandle('');
              input.current?.focus();
            }}
          >
            Clear
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
