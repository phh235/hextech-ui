'use client';

import { Switch } from '@hextech-ui/react/switch';

export function SwitchDemo() {
  return (
    <>
      <label className="hx-switch-label">
        <Switch name="invites" defaultChecked /> Party invitations
      </label>
    </>
  );
}
