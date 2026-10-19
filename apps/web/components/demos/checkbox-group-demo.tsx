'use client';

import { CheckboxGroup } from '@hextech-ui/react/checkbox-group';
import { Checkbox } from '@hextech-ui/react/checkbox';
import { useState } from 'react';

export function CheckboxGroupDemo() {
  const [roles, setRoles] = useState(['support']);
  return (
    <form aria-label="Role selection" className="grid gap-3">
      <CheckboxGroup
        aria-label="Available roles"
        value={roles}
        onValueChange={setRoles}
        allValues={['top', 'jungle', 'support']}
      >
        <label className="hx-checkbox-label">
          <Checkbox parent /> All roles
        </label>
        {['top', 'jungle', 'support'].map((role) => (
          <label key={role} className="hx-checkbox-label">
            <Checkbox value={role} name="roles" /> {role}
          </label>
        ))}
      </CheckboxGroup>
      <p role="status" className="text-hx-sm text-hx-muted-foreground">
        Selected: {roles.join(', ') || 'none'}
      </p>
    </form>
  );
}
