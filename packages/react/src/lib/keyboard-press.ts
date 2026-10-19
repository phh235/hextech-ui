'use client';
import { useEffect, useState, type KeyboardEvent } from 'react';

/** Paint held input without changing Base UI activation or selection behavior. */
export function useKeyboardPress(disabled = false) {
  const [held, setHeld] = useState(false);
  const [pointerHeld, setPointerHeld] = useState(false);
  useEffect(() => {
    if (disabled) {
      setHeld(false);
      setPointerHeld(false);
    }
  }, [disabled]);
  useEffect(() => {
    const releaseKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === ' ') setHeld(false);
    };
    const releasePointer = () => setPointerHeld(false);
    const releaseAll = () => {
      setHeld(false);
      setPointerHeld(false);
    };
    window.addEventListener('keyup', releaseKey);
    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer);
    window.addEventListener('blur', releaseAll);
    return () => {
      window.removeEventListener('keyup', releaseKey);
      window.removeEventListener('pointerup', releasePointer);
      window.removeEventListener('pointercancel', releasePointer);
      window.removeEventListener('blur', releaseAll);
    };
  }, []);
  return {
    pressed: held && !disabled,
    pointerPressed: pointerHeld && !disabled,
    pointerDown() {
      if (!disabled) setPointerHeld(true);
    },
    keyDown(event: KeyboardEvent<HTMLElement>) {
      if (!disabled && event.key === ' ' && !event.defaultPrevented) setHeld(true);
    },
    release() {
      setHeld(false);
    },
  };
}
