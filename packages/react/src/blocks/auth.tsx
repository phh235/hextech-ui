'use client';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { useClientReady } from '@/lib/client-ready';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/field';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/tabs';
type AuthMode = 'login' | 'signup' | 'recovery';
export interface AuthBlockProps {
  className?: string;
  defaultMode?: AuthMode;
  onDemoSubmit?: (result: { mode: AuthMode; email: string }) => void;
}
export function AuthBlock({ className, defaultMode = 'login', onDemoSubmit }: AuthBlockProps) {
  const readyForInput = useClientReady();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  return (
    <Card
      inert={!readyForInput}
      data-hextech-ready={readyForInput ? 'true' : 'false'}
      className={cn('mx-auto w-full max-w-md', className)}
    >
      <CardHeader>
        <p className="m-0 font-hx-mono text-hx-xs tracking-widest text-hx-accent">
          YOUR NEXT CHAPTER
        </p>
        <CardTitle>Welcome to the workshop.</CardTitle>
        <CardDescription>Keep your builds, notes and next great idea together.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={mode}
          onValueChange={(value) => {
            setMode(value as AuthMode);
            setMessage('');
            setError('');
          }}
        >
          <TabList aria-label="Account access">
            <Tab value="login">Log in</Tab>
            <Tab value="signup">Sign up</Tab>
            <Tab value="recovery">Recovery</Tab>
          </TabList>
          {(['login', 'signup', 'recovery'] as const).map((current) => (
            <TabPanel key={current} value={current}>
              <form
                className="grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  if (current === 'signup' && form.get('password') !== form.get('confirmation')) {
                    setError('Passwords must match.');
                    return;
                  }
                  const email = String(form.get('email') || '');
                  setError('');
                  setMessage(
                    current === 'recovery'
                      ? `Recovery preview for ${email}. No email was sent.`
                      : `Local ${current === 'login' ? 'login' : 'signup'} preview complete. No account or session was created.`,
                  );
                  onDemoSubmit?.({ mode: current, email });
                }}
              >
                {current === 'signup' && (
                  <TextField
                    label="Display name"
                    name="displayName"
                    autoComplete="nickname"
                    required
                    maxLength={40}
                  />
                )}
                <TextField
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
                {current !== 'recovery' && (
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete={current === 'signup' ? 'new-password' : 'current-password'}
                    required
                    minLength={8}
                  />
                )}
                {current === 'signup' && (
                  <TextField
                    label="Confirm password"
                    name="confirmation"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    {...(error && { error })}
                    onValueChange={() => setError('')}
                  />
                )}
                <Button type="submit" variant="primary" className="w-full whitespace-normal">
                  {current === 'login'
                    ? 'Preview login'
                    : current === 'signup'
                      ? 'Preview account creation'
                      : 'Preview recovery'}
                </Button>
              </form>
            </TabPanel>
          ))}
        </Tabs>
        <p role="status" className="m-0 mt-2 text-hx-sm text-hx-accent">
          {message}
        </p>
        <p className="m-0 mt-4 border-t border-hx-border pt-4 text-hx-xs leading-relaxed text-hx-muted-foreground">
          UI demo only. Credentials stay in this form; no authentication, email or storage service
          is connected.
        </p>
      </CardContent>
    </Card>
  );
}
