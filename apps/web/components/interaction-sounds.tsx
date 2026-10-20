'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@/lib/cn';
import {
  clickSoundFor,
  createInteractionSounds,
  interactionSoundTarget,
} from '@/lib/interaction-sounds';

const storageKey = 'hextech-ui-sound-enabled';
const preferenceEvent = 'hextech-ui-sound-change';
let fallbackEnabled = true;
function getEnabled() {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored === null ? fallbackEnabled : stored !== 'false';
  } catch {
    return fallbackEnabled;
  }
}
function subscribe(listener: () => void) {
  window.addEventListener('storage', listener);
  window.addEventListener(preferenceEvent, listener);
  return () => {
    window.removeEventListener('storage', listener);
    window.removeEventListener(preferenceEvent, listener);
  };
}
function useSoundEnabled() {
  return useSyncExternalStore(subscribe, getEnabled, () => true);
}

export function InteractionSounds() {
  const enabled = useSoundEnabled();
  useEffect(() => {
    if (!enabled) return;
    const sounds = createInteractionSounds();
    function click(event: MouseEvent) {
      if (event.button !== 0) return;
      const control = interactionSoundTarget(event.target);
      if (control) sounds.play(clickSoundFor(control));
    }
    function hover(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      const control = interactionSoundTarget(event.target);
      if (!control || clickSoundFor(control) !== 'button-click') return;
      if (event.relatedTarget instanceof Node && control.contains(event.relatedTarget)) return;
      sounds.play('button-hover');
    }
    function visibility() {
      if (document.hidden) sounds.stop();
    }
    // Capture includes popup portals and controls whose handlers stop bubbling.
    document.addEventListener('click', click, true);
    document.addEventListener('pointerover', hover, true);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      sounds.stop();
      document.removeEventListener('click', click, true);
      document.removeEventListener('pointerover', hover, true);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [enabled]);
  return null;
}

export function SoundToggle() {
  const enabled = useSoundEnabled();
  return (
    <button
      type="button"
      aria-label="Sound effects"
      aria-pressed={enabled}
      title={enabled ? 'Mute sound effects' : 'Enable sound effects'}
      className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
      onClick={() => {
        fallbackEnabled = !enabled;
        try {
          localStorage.setItem(storageKey, String(!enabled));
        } catch {
          /* Private storage may be unavailable. */
        }
        window.dispatchEvent(new Event(preferenceEvent));
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        {enabled ? (
          <>
            <path d="M15 8a6 6 0 0 1 0 8" />
            <path d="M18 5a10 10 0 0 1 0 14" />
          </>
        ) : (
          <path d="m16 9 5 6m0-6-5 6" />
        )}
      </svg>
    </button>
  );
}
