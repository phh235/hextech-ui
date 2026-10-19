'use client';

import { useId, useState } from 'react';
import { Button } from '@hextech-ui/react/button';
import { TextField } from '@hextech-ui/react/field';
import { Label } from '@hextech-ui/react/typography';
import { NumberField } from '@hextech-ui/react/number-field';
import { Checkbox } from '@hextech-ui/react/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@hextech-ui/react/select';
import { Combobox } from '@hextech-ui/react/combobox';
import { MultipleSelect } from '@hextech-ui/react/multiple-select';
import { Calendar } from '@hextech-ui/react/calendar';
import { ShowcaseCard } from './showcase-card';

const champions = ['Ahri', 'Ashe', 'Ekko', 'Ezreal', 'Jinx', 'Leona', 'Lux', 'Thresh'];
const roles = ['Top', 'Jungle', 'Mid', 'Bot', 'Support'];

export function PartyShowcase() {
  const modeId = useId();
  const [saved, setSaved] = useState(false);
  return (
    <ShowcaseCard
      title="Better together"
      component="field"
      description="Your party. Your next adventure."
    >
      <form
        className="grid gap-5"
        onChange={() => setSaved(false)}
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
      >
        <TextField
          label="Party name"
          name="partyName"
          defaultValue="The night shift"
          required
          maxLength={40}
        />
        <div className="grid gap-2">
          <Label htmlFor={modeId}>Game mode</Label>
          <Select name="gameMode" defaultValue="Draft pick">
            <SelectTrigger id={modeId} className="w-full min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft pick">Draft pick</SelectItem>
              <SelectItem value="Ranked flex">Ranked flex</SelectItem>
              <SelectItem value="ARAM">ARAM</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <NumberField label="Party size" name="partySize" defaultValue={3} min={1} max={5} />
        <label className="hx-checkbox-label">
          <Checkbox name="friendsOnly" aria-label="Friends only" defaultChecked /> Friends only
        </label>
        <Button type="submit" variant="primary" className="w-full">
          Save settings
        </Button>
        <p role="status" className="m-0 min-h-4 text-xs text-accent">
          {saved ? 'Settings updated.' : ''}
        </p>
      </form>
    </ShowcaseCard>
  );
}

export function ChampionShowcase() {
  return (
    <ShowcaseCard title="Find your playstyle" component="combobox">
      <Combobox
        label="Champion"
        options={champions}
        defaultValue="Lux"
        placeholder="Find a champion…"
      />
      <MultipleSelect
        label="Preferred roles"
        options={roles}
        defaultValue={['Support']}
        placeholder="Add a role…"
      />
    </ShowcaseCard>
  );
}

export function CalendarShowcase() {
  const [day, setDay] = useState('2026-10-24');
  return (
    <ShowcaseCard
      title="One more game?"
      component="calendar"
      description="Pick a day for your next session."
    >
      <Calendar
        label="Practice calendar"
        value={day}
        onValueChange={setDay}
        referenceDate="2026-10-19"
        className="w-full [&_.hx-calendar-grid]:w-full"
      />
      <p role="status" className="m-0 border-t border-border pt-3 text-sm text-muted-foreground">
        Next session ·{' '}
        {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(
          new Date(`${day}T00:00:00Z`),
        )}
      </p>
    </ShowcaseCard>
  );
}
