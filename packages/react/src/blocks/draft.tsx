'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { useClientReady } from '@/lib/client-ready';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchField } from '@/components/ui/search-field';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
const characters = [
  {
    id: 'bulwark',
    name: 'Bulwark',
    role: 'Guard',
    glyph: '◇',
    description: 'Hold a steady line and make room for your team.',
  },
  {
    id: 'beacon',
    name: 'Beacon',
    role: 'Guide',
    glyph: '✧',
    description: 'Light the path and help allies find their footing.',
  },
  {
    id: 'scout',
    name: 'Scout',
    role: 'Ranger',
    glyph: '⌁',
    description: 'Find a new angle. Bring the map into focus.',
  },
  {
    id: 'ember',
    name: 'Ember',
    role: 'Ranger',
    glyph: '△',
    description: 'Turn patient preparation into a decisive moment.',
  },
  {
    id: 'mender',
    name: 'Mender',
    role: 'Guide',
    glyph: '⊕',
    description: 'Keep the group moving through the difficult parts.',
  },
  {
    id: 'tide',
    name: 'Tide',
    role: 'Guard',
    glyph: '≋',
    description: 'Control the pace with a calm, durable presence.',
  },
];
export function DraftBlock({ className }: { className?: string }) {
  const readyForInput = useClientReady();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All');
  const [selection, setSelection] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(30);
  useEffect(() => {
    if (deadline === null) return;
    const timer = setInterval(() => {
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(next);
      if (!next) {
        setLocked(true);
        clearInterval(timer);
      }
    }, 250);
    return () => clearInterval(timer);
  }, [deadline]);
  const selected = characters.find((item) => item.id === selection);
  const filtered = characters.filter(
    (item) =>
      (role === 'All' || item.role === role) &&
      item.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Card
      inert={!readyForInput}
      data-hextech-ready={readyForInput ? 'true' : 'false'}
      className={cn('@container w-full', className)}
    >
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Find your place in the party.</CardTitle>
          <Badge tone={locked ? 'success' : 'teal'}>
            {locked ? 'Draft complete' : 'Local draft'}
          </Badge>
        </div>
        <CardDescription>
          Original fictional roles and abstract glyphs. This is a selection demo, not a game
          connection.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 @2xl:grid-cols-[1fr_calc(var(--hextech-ui-rem)*15)]">
        <div className="grid content-start gap-4">
          <SearchField
            label="Find a character"
            value={query}
            onValueChange={setQuery}
            placeholder="Search the original roster…"
          />
          <div role="group" aria-label="Filter roster role" className="flex flex-wrap gap-2">
            {['All', 'Guard', 'Guide', 'Ranger'].map((item) => (
              <Button
                key={item}
                size="small"
                variant={role === item ? 'hextech' : 'dimmed'}
                aria-pressed={role === item}
                onClick={() => setRole(item)}
              >
                {item}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={selection === item.id}
                disabled={locked}
                onClick={() => setSelection(item.id)}
                className="group grid min-h-40 content-center justify-items-center gap-3 border border-hx-border bg-hx-background p-3 text-center outline-offset-2 transition-colors hover:border-hx-primary focus-visible:outline-2 focus-visible:outline-hx-focus aria-pressed:border-hx-primary aria-pressed:bg-hx-secondary disabled:opacity-60"
              >
                <span
                  aria-hidden="true"
                  className="grid size-16 place-items-center border border-hx-accent/40 bg-hx-accent/5 text-hx-4xl text-hx-accent group-aria-pressed:text-hx-primary"
                >
                  {item.glyph}
                </span>
                <span className="text-hx-sm font-hx-semibold text-hx-foreground">{item.name}</span>
                <span className="text-hx-xs text-hx-muted-foreground">{item.role}</span>
              </button>
            ))}
          </div>
          {!filtered.length && (
            <p className="m-0 text-hx-sm text-hx-muted-foreground">
              No characters match this filter.
            </p>
          )}
        </div>
        <aside
          aria-label="Draft selection"
          className="grid content-start gap-4 border-l border-hx-border pl-0 @2xl:pl-5"
        >
          <p className="m-0 font-hx-mono text-hx-xs uppercase tracking-widest text-hx-primary">
            Your selection
          </p>
          <div
            aria-hidden="true"
            className="grid min-h-32 place-items-center border border-hx-primary/30 bg-hx-secondary text-6xl text-hx-primary"
          >
            {selected?.glyph || '◇'}
          </div>
          <p className="m-0 text-hx-lg font-hx-semibold">{selected?.name || 'Choose your role'}</p>
          <p className="m-0 text-hx-sm leading-relaxed text-hx-muted-foreground">
            {selected?.description || 'Select a card, then lock in your choice.'}
          </p>
          <Progress label={`Draft time remaining (${remaining}s)`} max={30} value={remaining} />
          <Button
            disabled={locked || deadline !== null}
            onClick={() => {
              setRemaining(30);
              setDeadline(Date.now() + 30000);
            }}
          >
            Start 30s draft
          </Button>
          <Button
            variant="primary"
            disabled={!selection || locked}
            onClick={() => {
              setLocked(true);
              setDeadline(null);
            }}
          >
            Lock selection
          </Button>
          <Button
            variant="text"
            onClick={() => {
              setLocked(false);
              setDeadline(null);
              setRemaining(30);
              setSelection(null);
            }}
          >
            Reset draft
          </Button>
          <p role="status" className="m-0 text-hx-xs text-hx-accent">
            {locked
              ? selected
                ? `${selected.name} locked for this preview.`
                : 'Draft time complete. No character selected.'
              : selected
                ? `${selected.name} selected.`
                : 'Waiting for a selection.'}
          </p>
        </aside>
      </CardContent>
    </Card>
  );
}
