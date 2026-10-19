'use client';

import { InternalSmoke } from '@/components/ui/internal-smoke';
import { ComponentPreview } from './component-preview';

export function InternalPreview() {
  return (
    <ComponentPreview
      internal
      title="Base UI interaction fixture"
      code={'<InternalSmoke />\n<InternalSmoke disabled />'}
      fileName="internal-smoke-demo.tsx"
      variants={[
        { name: 'Default', content: <InternalSmoke /> },
        { name: 'Disabled', content: <InternalSmoke disabled /> },
      ]}
    />
  );
}
