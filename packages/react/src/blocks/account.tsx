'use client';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { useClientReady } from '@/lib/client-ready';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
export function AccountBlock({ className }: { className?: string }) {
  const readyForInput = useClientReady();
  const [name, setName] = useState('Avery');
  const [updates, setUpdates] = useState(true);
  const [contrast, setContrast] = useState(60);
  const [saved, setSaved] = useState('');
  const [notices, setNotices] = useState([
    'Your practice plan is ready.',
    'Rowan added a build to the shared collection.',
  ]);
  return (
    <div
      inert={!readyForInput}
      data-hextech-ready={readyForInput ? 'true' : 'false'}
      className={cn(
        'grid w-full min-w-0 gap-4 font-sans grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]',
        className,
      )}
    >
      <Card>
        <CardHeader>
          <div
            aria-hidden="true"
            className="grid size-14 place-items-center border border-primary bg-secondary font-display text-xl text-primary"
          >
            {name.slice(0, 1).toUpperCase() || 'A'}
          </div>
          <CardTitle>{name || 'Your profile'}</CardTitle>
          <CardDescription>Independent maker · demo profile</CardDescription>
          <Badge tone="teal">Workshop member</Badge>
        </CardHeader>
        <CardContent>
          <Progress label="Practice plan" value={65} />
          <p className="m-0 mt-4 text-xs text-muted-foreground">
            Fictional profile and progress. Customize these panels for your own data.
          </p>
        </CardContent>
      </Card>
      <div className="grid min-w-0 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Make it feel like you.</CardTitle>
            <CardDescription>Profile and local interface preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-5"
              onSubmit={(event) => {
                event.preventDefault();
                setSaved(`Saved locally for this preview: ${name}.`);
              }}
            >
              <TextField
                label="Profile name"
                value={name}
                onValueChange={setName}
                required
                maxLength={40}
              />
              <label className="flex items-center gap-3 text-sm">
                <Switch
                  checked={updates}
                  onCheckedChange={setUpdates}
                  aria-label="Build update notifications"
                />
                <span>Build update notifications</span>
              </label>
              <Slider
                label="Effect intensity"
                value={contrast}
                onValueChange={(value) =>
                  setContrast(Array.isArray(value) ? (value[0] ?? 0) : value)
                }
              />
              <Button type="submit" variant="primary" className="whitespace-normal">
                Save preview preferences
              </Button>
              <p role="status" className="m-0 text-xs text-accent">
                {saved}
              </p>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Sample notifications, managed only in this preview.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="m-0 grid list-none gap-2 p-0">
              {notices.map((notice) => (
                <li
                  key={notice}
                  className="flex items-start justify-between gap-3 border-b border-border py-2 text-sm"
                >
                  <span>{notice}</span>
                  <Button
                    size="small"
                    variant="text"
                    aria-label={`Dismiss ${notice}`}
                    onClick={() => setNotices((items) => items.filter((item) => item !== notice))}
                  >
                    Dismiss
                  </Button>
                </li>
              ))}
            </ul>
            {!notices.length && (
              <p role="status" className="m-0 text-sm text-muted-foreground">
                You are all caught up.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
