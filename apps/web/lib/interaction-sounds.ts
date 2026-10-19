export type InteractionSound = 'button-click' | 'button-hover' | 'dropdown-click' | 'grid-click';

export const interactionSoundSources: Record<InteractionSound, string> = {
  'button-click': '/sounds/sfx-clash-button-circlegold-click.ogg',
  'button-hover': '/sounds/sfx-clash-button-circlegold-hover.ogg',
  'dropdown-click': '/sounds/sfx-clash-dropdown-click.ogg',
  'grid-click': '/sounds/sfx-clash-grid-click.ogg',
};

const selector = [
  '[data-hextech-ui="button"]',
  '[data-hextech-ui="button-link"]',
  '.hx-select-trigger',
  '.hx-button[aria-haspopup="menu"]',
  '.hx-group [aria-haspopup="listbox"]',
  '.hx-select-popup .hx-option',
  '.hx-menu .hx-menu-item',
  '.hx-tab',
  '.hx-calendar-day',
].join(',');

/** Website-only adapter: canonical components never require audio or downloaded assets. */
export function interactionSoundTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const control = target.closest<HTMLElement>(selector);
  if (
    !control ||
    control.matches(':disabled') ||
    control.closest('[aria-disabled="true"], [aria-busy="true"], [inert], [data-sound="off"]') ||
    control.matches('.hx-calendar-day[aria-readonly="true"]')
  )
    return null;
  return control;
}

export function clickSoundFor(control: HTMLElement): InteractionSound {
  if (control.matches('.hx-tab, .hx-calendar-day')) return 'grid-click';
  if (
    control.matches(
      '.hx-select-trigger, [aria-haspopup="listbox"], [aria-haspopup="menu"], .hx-option, .hx-menu-item',
    )
  )
    return 'dropdown-click';
  return 'button-click';
}

/** At most four voices, no fetch/preload until an interaction, no autoplay retries. */
export function createInteractionSounds() {
  const voices = new Map<InteractionSound, HTMLAudioElement>();
  const lastPlayed = new Map<InteractionSound, number>();
  return {
    play(sound: InteractionSound) {
      if (document.hidden) return;
      const now = performance.now();
      if (now - (lastPlayed.get(sound) ?? -Infinity) < (sound === 'button-hover' ? 90 : 35)) return;
      lastPlayed.set(sound, now);
      let voice = voices.get(sound);
      if (!voice) {
        voice = new Audio(interactionSoundSources[sound]);
        voice.preload = 'none';
        voice.volume = 0.65;
        voices.set(sound, voice);
      }
      try {
        voice.currentTime = 0;
        // Browsers may reject hover playback before the first user gesture.
        void voice.play().catch(() => {});
      } catch {
        // Media failures must never interrupt the underlying control.
      }
    },
    stop() {
      for (const voice of voices.values()) voice.pause();
    },
  };
}
