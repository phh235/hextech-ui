'use client';

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/** Internal fixture for registry hook placement and JS conversion checks. */
export function useInternalState(): [boolean, Dispatch<SetStateAction<boolean>>] {
  return useState(false);
}
