'use client';

import { IconButton } from '@hextech-ui/react/icon-button';

export function IconButtonDemo() {
  return (
    <>
      <IconButton aria-label="Add member">
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M8 2v12M2 8h12" />
        </svg>
      </IconButton>
    </>
  );
}
