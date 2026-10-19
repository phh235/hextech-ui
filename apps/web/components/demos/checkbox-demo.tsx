'use client';

import { Checkbox } from '@hextech-ui/react/checkbox';

export function CheckboxDemo() {
  return (
    <>
      <label className="hx-checkbox-label">
        <Checkbox name="updates" defaultChecked /> Send updates
      </label>
    </>
  );
}
