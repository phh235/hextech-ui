'use client';

import { RadioGroup, Radio } from '@hextech-ui/react/radio';

export function RadioDemo() {
  return (
    <>
      <RadioGroup aria-label="Preferred role" name="role" defaultValue="support">
        <label className="hx-radio-label">
          <Radio value="top" /> Top
        </label>
        <label className="hx-radio-label">
          <Radio value="support" /> Support
        </label>
      </RadioGroup>
    </>
  );
}
