'use client';
import { useState } from 'react';
import { Button } from '@hextech-ui/react/button';
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@hextech-ui/react/empty-state';

export default function EmptyStateActionDemo() {
  const [created, setCreated] = useState(false);
  return created ? (
    <div className="grid gap-3">
      <p role="status">Your first local build is ready.</p>
      <Button onClick={() => setCreated(false)}>Reset collection</Button>
    </div>
  ) : (
    <EmptyState className="w-full">
      <EmptyStateTitle>Start a collection</EmptyStateTitle>
      <EmptyStateDescription>Create your first local build to get started.</EmptyStateDescription>
      <EmptyStateActions>
        <Button variant="primary" onClick={() => setCreated(true)}>
          Create a build
        </Button>
      </EmptyStateActions>
    </EmptyState>
  );
}
