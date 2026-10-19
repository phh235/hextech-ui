'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { useClientReady } from '@/lib/client-ready';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Menu, MenuTrigger, MenuContent, MenuItem } from '@/components/ui/menu';
const abilities = [
  { name: 'Anchor', key: 'I', cost: 12, duration: 4 },
  { name: 'Illuminate', key: 'II', cost: 16, duration: 6 },
  { name: 'Stride', key: 'III', cost: 10, duration: 3 },
  { name: 'Resolve', key: 'IV', cost: 30, duration: 10 },
];
export function HudBlock({ className }: { className?: string }) {
  const readyForInput = useClientReady();
  const [health, setHealth] = useState(82);
  const [energy, setEnergy] = useState(100);
  const [cooldowns, setCooldowns] = useState([0, 0, 0, 0]);
  const [message, setMessage] = useState('Training mode. No sound or network connection.');
  const cooling = cooldowns.some(Boolean);
  useEffect(() => {
    if (!cooling) return;
    const timer = setInterval(
      () => setCooldowns((values) => values.map((value) => Math.max(0, value - 1))),
      1000,
    );
    return () => clearInterval(timer);
  }, [cooling]);
  return (
    <Card
      inert={!readyForInput}
      data-hextech-ready={readyForInput ? 'true' : 'false'}
      className={cn('w-full', className)}
    >
      <CardHeader>
        <CardTitle>A little world at your fingertips.</CardTitle>
        <CardDescription>
          Original HUD composition with local resources, ability cooldowns and a keyboard-friendly
          ping menu.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div
          className="relative grid min-h-40 place-items-center overflow-hidden border border-hx-border bg-hx-background"
          aria-label="Abstract training field"
        >
          <div
            aria-hidden="true"
            className="absolute inset-5 border border-hx-accent/20 [transform:skewY(-8deg)]"
          />
          <div
            aria-hidden="true"
            className="relative grid size-16 rotate-45 place-items-center border-2 border-hx-primary bg-hx-surface shadow-hx-panel"
          >
            <span className="-rotate-45 text-hx-2xl text-hx-primary">◇</span>
          </div>
          <span className="absolute bottom-3 left-3 font-hx-mono text-hx-xs text-hx-muted-foreground">
            WORKSHOP / TRAINING
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Progress label="Health" value={health} />
          <Progress label="Energy" value={energy} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {abilities.map((ability, index) => (
            <Button
              key={ability.name}
              className="grid min-h-24 whitespace-normal px-2 py-3 text-center"
              disabled={Boolean(cooldowns[index]) || energy < ability.cost}
              aria-label={`${ability.name}${cooldowns[index] ? ` cooling down, ${cooldowns[index]} seconds` : ''}`}
              onClick={() => {
                setEnergy((value) => Math.max(0, value - ability.cost));
                setCooldowns((values) =>
                  values.map((value, at) => (at === index ? ability.duration : value)),
                );
                setMessage(`${ability.name} activated in this local preview.`);
              }}
            >
              <span aria-hidden="true" className="text-hx-xl text-hx-accent">
                {cooldowns[index] || ability.key}
              </span>
              <span className="text-hx-xs">{ability.name}</span>
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Menu>
            <MenuTrigger>Send demo ping</MenuTrigger>
            <MenuContent>
              <MenuItem onClick={() => setMessage('Demo ping: gather here. Nothing was sent.')}>
                ◇ Gather here
              </MenuItem>
              <MenuItem onClick={() => setMessage('Demo ping: take care. Nothing was sent.')}>
                △ Take care
              </MenuItem>
              <MenuItem onClick={() => setMessage('Demo ping: on my way. Nothing was sent.')}>
                → On my way
              </MenuItem>
              <MenuItem onClick={() => setMessage('Demo ping: need help. Nothing was sent.')}>
                ⊕ Need help
              </MenuItem>
            </MenuContent>
          </Menu>
          <Button variant="dimmed" onClick={() => setHealth((value) => Math.max(0, value - 10))}>
            Simulate damage
          </Button>
          <Button
            variant="text"
            onClick={() => {
              setHealth(82);
              setEnergy(100);
              setCooldowns([0, 0, 0, 0]);
              setMessage('Training resources restored.');
            }}
          >
            Restore resources
          </Button>
        </div>
        <p role="status" className="m-0 text-hx-sm text-hx-accent">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
