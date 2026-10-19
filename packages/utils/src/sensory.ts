export interface SensoryPreferences {
  muted: boolean;
  volume: number;
  reducedMotion: boolean;
  reducedSensory: boolean;
}

/** Pure and SSR safe. Hosts resolve media queries and storage after hydration. */
export function resolveSensoryPreferences(
  input: Partial<SensoryPreferences> = {},
): Readonly<SensoryPreferences> {
  const volume = input.volume ?? 0.5;
  return {
    muted: input.muted ?? true,
    volume: Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : 0,
    reducedMotion: input.reducedMotion ?? false,
    reducedSensory: input.reducedSensory ?? false,
  };
}

/** Playback still must handle HTMLMediaElement.play() rejection in a future adapter. */
export function canPlaySound(
  preferences: Readonly<SensoryPreferences>,
  userInitiated: boolean,
): boolean {
  return (
    userInitiated && !preferences.muted && !preferences.reducedSensory && preferences.volume > 0
  );
}
