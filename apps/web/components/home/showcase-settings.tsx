'use client';

import { Slider } from '@hextech-ui/react/slider';
import { Radio, RadioGroup } from '@hextech-ui/react/radio';
import { ShowcaseCard } from './showcase-card';

export function AudioShowcase() {
  return (
    <ShowcaseCard title="Set the mood" component="slider" description="Your mix. Your focus.">
      <div className="grid gap-4">
        <Slider label="Music" defaultValue={35} min={0} max={100} step={5} />
        <Slider label="Sound effects" defaultValue={75} min={0} max={100} step={5} />
      </div>
    </ShowcaseCard>
  );
}

const playstyles = [
  { value: 'balanced', label: 'Balanced', description: 'Adapt to the moment.' },
  { value: 'aggressive', label: 'Aggressive', description: 'Make the first move.' },
  { value: 'defensive', label: 'Defensive', description: 'Hold your ground.' },
];

export function PlaystyleShowcase() {
  return (
    <ShowcaseCard
      title="Play it your way"
      component="radio"
      description="Every approach has its moment."
    >
      <RadioGroup aria-label="Playstyle" defaultValue="balanced" className="gap-4">
        {playstyles.map((playstyle) => (
          <label key={playstyle.value} className="flex cursor-pointer items-start gap-3 text-hx-sm">
            <Radio value={playstyle.value} className="mt-0.5" />
            <span className="grid gap-1">
              <span>{playstyle.label}</span>
              <span className="text-hx-xs text-hx-muted-foreground">{playstyle.description}</span>
            </span>
          </label>
        ))}
      </RadioGroup>
    </ShowcaseCard>
  );
}
