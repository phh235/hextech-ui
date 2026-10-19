'use client';
import { useSyncExternalStore } from 'react';
const subscribe = () => () => {};
const client = () => true;
const server = () => false;
export function useHydrated() {
  return useSyncExternalStore(subscribe, client, server);
}
