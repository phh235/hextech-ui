'use client';

import { useId, useState } from 'react';
import { InputExample } from './input-examples';
import { InteractionExample } from './catalog-interactions';
import { ComplexExample } from './catalog-complex';
import { CollectionExample } from './collection-examples';
import { DataHookExample } from './data-hook-examples';
import { TableLoadMoreExample } from './table-load-more-example';
import { AutocompleteExample } from './selection-examples';
import dynamic from 'next/dynamic';
const SonnerExample = dynamic(
  () => import('./sonner-example').then((module) => module.SonnerExample),
  { loading: () => <p className="text-sm text-muted-foreground">Loading notification preview…</p> },
);
const TokenExample = dynamic(() => import('./token-example'), {
  ssr: false,
  loading: () => <p className="text-sm text-muted-foreground">Loading inline editor…</p>,
});
const DataTableExample = dynamic(() => import('./data-table-example'), {
  loading: () => <p className="text-sm text-muted-foreground">Loading data table…</p>,
});
const DataTableLoadingExample = dynamic(
  () => import('./data-table-example').then((module) => module.DataTableLoadingExample),
  {
    loading: () => <p className="text-sm text-muted-foreground">Loading data table…</p>,
  },
);
const ChartExamples = dynamic(() => import('./chart-examples'), {
  loading: () => <p className="text-sm text-muted-foreground">Loading charts…</p>,
});
const VirtualExample = dynamic(() => import('./virtual-example'), {
  loading: () => <p className="text-sm text-muted-foreground">Loading collection…</p>,
});
import {
  Button,
  IconButton,
  Link,
  ButtonLink,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Heading,
  Text,
  Label,
  Separator,
  Divider,
  Input,
  Textarea,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  TextField,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Toggle,
  ToggleGroup,
} from '@hextech-ui/react';

/** Every example renders the actual distributed implementation. */
export function ComponentExample({
  name,
  disabled = false,
  example,
}: {
  name: string;
  disabled?: boolean;
  example?: 'load-more';
}) {
  const id = useId();
  const [count, setCount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState('top');
  switch (name) {
    case 'sonner':
      return <SonnerExample />;
    case 'table-load-more':
      return <TableLoadMoreExample disabled={disabled} />;
    case 'autocomplete':
      return <AutocompleteExample disabled={disabled} />;
    case 'virtual-listbox':
      return <VirtualExample disabled={disabled} />;
    case 'use-list-data':
    case 'use-async-list':
      return <DataHookExample name={name} disabled={disabled} />;
    case 'charts':
      return <ChartExamples />;
    case 'data-table':
      return example === 'load-more' ? (
        <DataTableLoadingExample />
      ) : (
        <DataTableExample disabled={disabled} />
      );
    case 'tree':
    case 'tag-group':
      return <CollectionExample name={name} disabled={disabled} />;
    case 'token-field':
      return <TokenExample disabled={disabled} />;
    case 'button':
      return (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" disabled={disabled}>
            Queue up
          </Button>
          <Button variant="secondary" disabled={disabled}>
            Save
          </Button>
          <Button variant="hextech" disabled={disabled}>
            Explore
          </Button>
          <Button variant="dimmed" disabled={disabled}>
            Later
          </Button>
          <Button variant="text" disabled={disabled}>
            More
          </Button>
          <Button variant="destructive" disabled={disabled}>
            Delete
          </Button>
          <Button loading>Preparing</Button>
        </div>
      );
    case 'icon-button':
      return (
        <div className="flex gap-4">
          <IconButton
            aria-label="Add member"
            disabled={disabled}
            onClick={() => setCount((v) => v + 1)}
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M8 2v12M2 8h12" />
            </svg>
          </IconButton>
          <IconButton
            aria-label="Favorite build"
            shape="round"
            disabled={disabled}
            variant="hextech"
          >
            ☆
          </IconButton>
          <span className="sr-only" role="status">
            {count} members added
          </span>
        </div>
      );
    case 'link':
      return (
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/docs/installation" disabled={disabled}>
            Installation guide →
          </Link>
          <ButtonLink href="/docs/theming" disabled={disabled}>
            Explore tokens
          </ButtonLink>
        </div>
      );
    case 'typography':
      return (
        <div className="grid gap-3">
          <Heading as="h3" size="md" tone="gold">
            Beyond the ordinary
          </Heading>
          <Text>The details make the experience.</Text>
          <Text size="sm" tone="muted">
            Original typography. Familiar semantics.
          </Text>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-label`}>Display name</Label>
            <Input id={`${id}-label`} placeholder="Your name" disabled={disabled} />
          </div>
        </div>
      );
    case 'badge':
      return (
        <div className="flex flex-wrap gap-3">
          {(['gold', 'teal', 'success', 'warning', 'destructive', 'neutral'] as const).map(
            (tone) => (
              <Badge key={tone} tone={tone}>
                {tone}
              </Badge>
            ),
          )}
        </div>
      );
    case 'card':
      return (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Build notes</CardTitle>
          </CardHeader>
          <CardContent>Your next chapter.</CardContent>
        </Card>
      );
    case 'separator':
      return (
        <div className="grid w-full max-w-md gap-7">
          <Divider>Next chapter</Divider>
          <Separator />
          <div className="flex h-10 items-center gap-5">
            <span>Source</span>
            <Separator orientation="vertical" />
            <span>Character</span>
          </div>
        </div>
      );
    case 'input':
      return <InputExample disabled={disabled} />;
    case 'textarea':
      return (
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor={`${id}-notes`}>Build notes</Label>
          <Textarea id={`${id}-notes`} placeholder="Write the next chapter…" disabled={disabled} />
        </div>
      );
    case 'field':
      return (
        <div className="grid w-full max-w-sm gap-5">
          <TextField
            label="Profile name"
            description="Visible to your party."
            placeholder="Starlight"
            disabled={disabled}
          />
          <Field invalid>
            <FieldLabel>Invite code</FieldLabel>
            <Input defaultValue="EXPIRED" disabled={disabled} />
            <FieldDescription>Ask your party leader for a fresh code.</FieldDescription>
            <FieldError match>This code has expired.</FieldError>
          </Field>
        </div>
      );
    case 'checkbox':
      return (
        <div className="grid gap-5">
          <label className="hx-checkbox-label">
            <Checkbox
              name="updates"
              checked={checked}
              onCheckedChange={setChecked}
              disabled={disabled}
            />
            Send me build updates
          </label>
          <label className="hx-checkbox-label">
            <Checkbox indeterminate disabled={disabled} />
            Some roles selected
          </label>
          <p className="text-xs text-muted-foreground" role="status">
            {checked ? 'Updates enabled' : 'Updates disabled'}
          </p>
        </div>
      );
    case 'radio':
      return (
        <RadioGroup
          aria-label="Preferred role"
          value={value}
          onValueChange={(v) => setValue(v as string)}
          disabled={disabled}
        >
          {['top', 'jungle', 'support'].map((role) => (
            <label className="hx-radio-label" key={role}>
              <Radio value={role} />
              {role}
            </label>
          ))}
        </RadioGroup>
      );
    case 'switch':
      return (
        <label className="hx-switch-label">
          <Switch checked={checked} onCheckedChange={setChecked} disabled={disabled} />
          <span>
            Party invitations{' '}
            <span className="block text-xs text-muted-foreground">
              {checked ? 'Open to invites' : 'Invite only'}
            </span>
          </span>
        </label>
      );
    case 'toggle':
      return (
        <div className="grid gap-5">
          <Toggle disabled={disabled} aria-label="Favorite setup">
            ☆ Favorite
          </Toggle>
          <ToggleGroup aria-label="Build view" defaultValue={['overview']} disabled={disabled}>
            <Toggle value="overview">Overview</Toggle>
            <Toggle value="details">Details</Toggle>
          </ToggleGroup>
        </div>
      );
    case 'search-field':
    case 'spinner':
    case 'breadcrumbs':
    case 'toast':
    case 'preview-card':
    case 'table':
    case 'vertical-table':
    case 'calendar':
    case 'date-field':
    case 'date-picker':
      return <ComplexExample name={name} disabled={disabled} />;
    default:
      return <InteractionExample name={name} disabled={disabled} />;
  }
}
