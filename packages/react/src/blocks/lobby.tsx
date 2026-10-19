'use client';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { useClientReady } from '@/lib/client-ready';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
export function LobbyBlock({ className }: { className?: string }) {
  const readyForInput = useClientReady();
  const [members, setMembers] = useState(['Avery', 'Rowan']);
  const [invite, setInvite] = useState('');
  const [ready, setReady] = useState(false);
  const [queued, setQueued] = useState(false);
  const [message, setMessage] = useState('Invite a name to fill the next open slot.');
  return (
    <Card
      inert={!readyForInput}
      data-hextech-ready={readyForInput ? 'true' : 'false'}
      className={cn('@container w-full', className)}
    >
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Your party. Your pace.</CardTitle>
          <Badge tone={queued ? 'teal' : 'neutral'}>
            {queued ? 'Queue preview' : 'Private lobby'}
          </Badge>
        </div>
        <CardDescription>
          Workshop party · local simulation · no multiplayer service
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="grid min-h-36 content-center justify-items-center gap-3 border border-border bg-background p-4 text-center"
            >
              <div
                aria-hidden="true"
                className="grid size-11 place-items-center border border-primary/50 text-xl text-primary"
              >
                {members[index]?.slice(0, 1) || '+'}
              </div>
              <span className="max-w-full break-all text-sm">{members[index] || 'Open slot'}</span>
              <span className="text-xs text-muted-foreground">
                {members[index]
                  ? index === 0
                    ? ready
                      ? 'Ready'
                      : 'Not ready'
                    : 'Demo teammate'
                  : 'Invite a friend'}
              </span>
              {index > 0 && members[index] && (
                <Button
                  size="small"
                  variant="text"
                  disabled={queued}
                  aria-label={`Remove ${members[index]} from party`}
                  onClick={() => setMembers((items) => items.filter((_, at) => at !== index))}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const value = invite.trim();
            if (!value) return;
            if (members.some((member) => member.toLowerCase() === value.toLowerCase())) {
              setMessage('That name is already in the party.');
              return;
            }
            if (members.length < 5 && !queued) {
              setMembers((items) => [...items, value]);
              setInvite('');
              setMessage(`${value} joined this local demo. No invitation was sent.`);
            }
          }}
        >
          <TextField
            label="Invite display name"
            value={invite}
            onValueChange={setInvite}
            required
            maxLength={24}
            disabled={members.length >= 5 || queued}
            className="min-w-0 flex-1"
          />
          <Button type="submit" disabled={members.length >= 5 || queued}>
            Add demo member
          </Button>
        </form>
        {queued && <Progress label="Simulated matchmaking" value={null} />}
        <p role="status" className="m-0 text-sm text-muted-foreground">
          {message}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant="primary"
          disabled={queued}
          aria-pressed={ready}
          onClick={() => setReady((value) => !value)}
        >
          {ready ? 'Ready' : 'Mark ready'}
        </Button>
        <Button
          disabled={!ready}
          variant={queued ? 'destructive' : 'hextech'}
          onClick={() => {
            setQueued((value) => !value);
            setMessage(
              queued
                ? 'Queue preview cancelled.'
                : 'Queue preview started. No match request was sent.',
            );
          }}
        >
          {queued ? 'Cancel queue preview' : 'Preview matchmaking'}
        </Button>
      </CardFooter>
    </Card>
  );
}
