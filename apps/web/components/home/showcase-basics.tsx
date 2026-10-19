'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@hextech-ui/react/button';
import { Badge } from '@hextech-ui/react/badge';
import { Checkbox } from '@hextech-ui/react/checkbox';
import { TextField } from '@hextech-ui/react/field';
import { Progress } from '@hextech-ui/react/progress';
import { Switch } from '@hextech-ui/react/switch';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@hextech-ui/react/dialog';
import { ShowcaseCard } from './showcase-card';

export function ControlsShowcase() {
  return (
    <ShowcaseCard title="Make your move" component="button">
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Queue up</Button>
        <Button variant="hextech">Explore</Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="destructive" size="small">
          Delete
        </Button>
        <Button loading size="small">
          Preparing
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge>Ranked</Badge>
        <Badge tone="teal">5v5</Badge>
        <Badge tone="success">Online</Badge>
      </div>
      <label className="hx-checkbox-label">
        <Checkbox aria-label="Ready to play" defaultChecked /> Ready to play
      </label>
    </ShowcaseCard>
  );
}

export function ProfileShowcase() {
  const [profile, setProfile] = useState('Starlight');
  const [draft, setDraft] = useState(profile);
  const [open, setOpen] = useState(false);
  return (
    <ShowcaseCard title="Player profile" component="dialog">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center border border-hx-primary/50 bg-hx-primary/10"
        >
          <Image src="/icon.svg" alt="" width={32} height={32} />
        </span>
        <div className="min-w-0">
          <p className="m-0 truncate text-hx-lg font-hx-medium">{profile}</p>
          <p className="m-0 text-hx-sm text-hx-muted-foreground">Support main. Team player.</p>
        </div>
      </div>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (next) setDraft(profile);
          setOpen(next);
        }}
      >
        <DialogTrigger className="w-full">Edit profile</DialogTrigger>
        <DialogContent>
          <DialogTitle>Make it yours</DialogTitle>
          <DialogDescription>Choose the name shown on your player card.</DialogDescription>
          <form
            className="grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              setProfile(draft.trim());
              setOpen(false);
            }}
          >
            <TextField
              label="Display name"
              value={draft}
              onValueChange={setDraft}
              required
              minLength={2}
              maxLength={32}
            />
            <div className="flex flex-wrap justify-end gap-3">
              <DialogClose type="button">Cancel</DialogClose>
              <Button type="submit" variant="primary" disabled={draft.trim().length < 2}>
                Save profile
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </ShowcaseCard>
  );
}

export function ProgressShowcase() {
  return (
    <ShowcaseCard
      title="The next milestone"
      component="progress"
      description="A little closer with every game."
    >
      <div>
        <p className="m-0 font-hx-display text-hx-4xl font-hx-bold text-hx-primary">1,280</p>
        <p className="m-0 mt-1 text-hx-sm text-hx-muted-foreground">of 2,000 season points</p>
      </div>
      <Progress
        label="Season progress"
        aria-label="Season progress"
        value={64}
        className="w-full"
      />
      <dl className="m-0 grid grid-cols-2 gap-4 border-t border-hx-border pt-4 text-hx-sm">
        <div>
          <dt className="text-hx-muted-foreground">Games played</dt>
          <dd className="m-0 mt-1 text-hx-lg">24</dd>
        </div>
        <div>
          <dt className="text-hx-muted-foreground">Best streak</dt>
          <dd className="m-0 mt-1 text-hx-lg text-hx-accent">5 wins</dd>
        </div>
      </dl>
    </ShowcaseCard>
  );
}

const preferences = [
  { label: 'Party invites', description: 'Make room for your friends.', checked: true },
  { label: 'Match reminders', description: 'Be there for the next game.', checked: true },
  { label: 'Build updates', description: 'A fresh take on your favorites.', checked: false },
];

export function PreferencesShowcase() {
  return (
    <ShowcaseCard title="Stay in the loop" component="switch">
      <div className="grid gap-5">
        {preferences.map((item) => (
          <label key={item.label} className="flex items-center justify-between gap-3">
            <span className="grid gap-1">
              <span className="text-hx-sm font-hx-medium">{item.label}</span>
              <span className="text-hx-xs text-hx-muted-foreground">{item.description}</span>
            </span>
            <Switch aria-label={item.label} defaultChecked={item.checked} />
          </label>
        ))}
      </div>
    </ShowcaseCard>
  );
}
