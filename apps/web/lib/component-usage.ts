export const componentUsage: Record<string, string> = {
  skeleton: `import { Skeleton } from '@hextech-ui/react/skeleton';\n\n<div role="status" aria-label="Loading profile" className="grid w-full max-w-sm gap-3">\n  <Skeleton className="size-12" />\n  <Skeleton className="h-4 w-3/4" />\n  <Skeleton className="h-4 w-1/2" />\n</div>`,
  alert: `import { Alert, AlertTitle, AlertDescription } from '@hextech-ui/react/alert';\n\n<Alert tone="info" className="w-full max-w-sm">\n  <AlertTitle>Your next chapter</AlertTitle>\n  <AlertDescription>Save a build before starting your next session.</AlertDescription>\n</Alert>`,
  avatar: `import { Avatar, AvatarFallback } from '@hextech-ui/react/avatar';\n\n<Avatar aria-label="Starlight"><AvatarFallback>S</AvatarFallback></Avatar>`,
  'empty-state': `import { EmptyState, EmptyStateTitle, EmptyStateDescription } from '@hextech-ui/react/empty-state';\n\n<EmptyState className="w-full max-w-sm">\n  <EmptyStateTitle>No saved builds</EmptyStateTitle>\n  <EmptyStateDescription>Your saved builds will appear here.</EmptyStateDescription>\n</EmptyState>`,
  button: `import { Button } from '@hextech-ui/react/button';

export function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="primary">Queue up</Button>
      <Button variant="secondary">Save</Button>
      <Button variant="hextech">Explore</Button>
      <Button variant="dimmed">Later</Button>
      <Button variant="text">More</Button>
      <Button variant="destructive">Delete</Button>
      <Button loading>Preparing</Button>
    </div>
  );
}`,
  'icon-button': `import { IconButton } from '@hextech-ui/react/icon-button';\n\n<IconButton aria-label="Add member"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v12M2 8h12" /></svg></IconButton>`,
  link: `import { Link, ButtonLink } from '@hextech-ui/react/link';\n\n<Link href="/docs">Documentation</Link>\n<ButtonLink href="/docs/theming">Explore tokens</ButtonLink>`,
  typography: `import { Heading, Text, Label } from '@hextech-ui/react/typography';\n\n<Heading as="h2" tone="gold">Beyond the ordinary</Heading>\n<Text tone="muted">The details make the experience.</Text>\n<Label htmlFor="name">Display name</Label>`,
  badge: `import { Badge } from '@hextech-ui/react/badge';\n\n<Badge tone="success">Ready</Badge>`,
  card: `import { Card, CardHeader, CardTitle, CardContent } from '@hextech-ui/react/card';\n\n<Card className="w-full max-w-sm">\n  <CardHeader><CardTitle>Build notes</CardTitle></CardHeader>\n  <CardContent>Your next chapter.</CardContent>\n</Card>`,
  separator: `import { Separator, Divider } from '@hextech-ui/react/separator';\n\n<Separator />\n<Divider>Next chapter</Divider>`,
  input: `import { Input } from '@hextech-ui/react/input';\n\n<Input aria-label="Text input" defaultValue="The quick brown fox jumps over the lazy dog." placeholder="The quick brown fox jumps over the lazy dog." />`,
  textarea: `import { Textarea } from '@hextech-ui/react/textarea';\n\n<div className="grid gap-2">\n  <label htmlFor="notes">Build notes</label>\n  <Textarea id="notes" name="notes" rows={4} />\n</div>`,
  field: `import { TextField } from '@hextech-ui/react/field';\n\n<TextField label="Profile name" name="name" description="Visible to your party." required />`,
  checkbox: `import { Checkbox } from '@hextech-ui/react/checkbox';\n\n<label className="hx-checkbox-label"><Checkbox name="updates" defaultChecked /> Send updates</label>`,
  radio: `import { RadioGroup, Radio } from '@hextech-ui/react/radio';\n\n<RadioGroup aria-label="Preferred role" name="role" defaultValue="support">\n  <label className="hx-radio-label"><Radio value="top" /> Top</label>\n  <label className="hx-radio-label"><Radio value="support" /> Support</label>\n</RadioGroup>`,
  switch: `import { Switch } from '@hextech-ui/react/switch';\n\n<label className="hx-switch-label"><Switch name="invites" defaultChecked /> Party invitations</label>`,
  toggle: `import { ToggleGroup, Toggle } from '@hextech-ui/react/toggle';\n\n<ToggleGroup aria-label="Build view" defaultValue={['overview']}>\n  <Toggle value="overview">Overview</Toggle>\n  <Toggle value="details">Details</Toggle>\n</ToggleGroup>`,
};

/** One compilable owner example for previews, docs and independent consumers. */
export function componentExampleCode(
  name: string,
  kind?: string,
  target: 'npm' | 'registry' = 'npm',
): string {
  const usage = componentUsage[name];
  if (!usage) throw new Error(`Missing usage example for ${name}`);
  const [imports, ...parts] = usage.split('\n\n');
  const example = usage.includes('export function Example')
    ? usage
    : `${imports}\n\nexport function Example() {\n  return (\n    <>\n${parts
        .join('\n\n')
        .split('\n')
        .map((line) => '      ' + line)
        .join('\n')}\n    </>\n  );\n}`;
  const clientExample = `'use client';\n\n${example}`;
  return target === 'registry'
    ? clientExample
        .replaceAll(
          `@hextech-ui/react/${name}`,
          `@/${kind === 'hook' ? 'hooks' : 'components/ui'}/${name}`,
        )
        .replaceAll('@hextech-ui/react/button', '@/components/ui/button')
        .replaceAll('@hextech-ui/react/search-field', '@/components/ui/search-field')
    : clientExample;
}

Object.assign(componentUsage, {
  dialog:
    "import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@hextech-ui/react/dialog';\n\n<Dialog>\n  <DialogTrigger>Edit profile</DialogTrigger>\n  <DialogContent>\n    <DialogTitle>Edit profile</DialogTitle>\n    <DialogDescription>Changes stay in this local demo.</DialogDescription>\n    <DialogClose>Close</DialogClose>\n  </DialogContent>\n</Dialog>",
  'alert-dialog':
    "import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogClose } from '@hextech-ui/react/alert-dialog';\n\n<AlertDialog>\n  <AlertDialogTrigger>Leave party</AlertDialogTrigger>\n  <AlertDialogContent>\n    <AlertDialogTitle>Leave this party?</AlertDialogTitle>\n    <AlertDialogDescription>This is a local demo action.</AlertDialogDescription>\n    <AlertDialogClose>Stay</AlertDialogClose>\n    <AlertDialogClose>Leave party</AlertDialogClose>\n  </AlertDialogContent>\n</AlertDialog>",
  popover:
    "import { Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverTitle, PopoverDescription } from '@hextech-ui/react/popover';\n\n<Popover>\n  <PopoverTrigger>Details</PopoverTrigger>\n  <PopoverContent><PopoverBody><PopoverTitle>Party details</PopoverTitle><PopoverDescription>Invite only.</PopoverDescription></PopoverBody></PopoverContent>\n</Popover>",
  tooltip:
    "import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@hextech-ui/react/tooltip';\n\n<TooltipProvider><Tooltip><TooltipTrigger>Pin</TooltipTrigger><TooltipContent>Keep this build at the top.</TooltipContent></Tooltip></TooltipProvider>",
  tabs: 'import { Tabs, TabList, Tab, TabPanel } from \'@hextech-ui/react/tabs\';\n\n<Tabs defaultValue="overview">\n  <TabList aria-label="Build details"><Tab value="overview">Overview</Tab><Tab value="runes">Runes</Tab></TabList>\n  <TabPanel value="overview">Build summary</TabPanel>\n  <TabPanel value="runes">Rune choices</TabPanel>\n</Tabs>',
  accordion:
    'import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from \'@hextech-ui/react/accordion\';\n\n<Accordion><AccordionItem value="source"><AccordionTrigger>Do I own the source?</AccordionTrigger><AccordionPanel>Yes. Edit it in your project.</AccordionPanel></AccordionItem></Accordion>',
  collapsible:
    "import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from '@hextech-ui/react/collapsible';\n\n<Collapsible><CollapsibleTrigger>Build notes</CollapsibleTrigger><CollapsiblePanel>Adapt after the lane is understood.</CollapsiblePanel></Collapsible>",
  progress:
    'import { Progress } from \'@hextech-ui/react/progress\';\n\n<Progress label="Build progress" value={64} />\n<Progress label="Finding a match" value={null} />',
  'number-field':
    'import { NumberField } from \'@hextech-ui/react/number-field\';\n\n<NumberField label="Party size" defaultValue={3} min={1} max={5} />',
  slider:
    "import { Slider } from '@hextech-ui/react/slider';\n\n<Slider label=\"Intensity\" defaultValue={40} />\n<Slider label=\"Preferred range\" defaultValue={[25, 75]} thumbLabels={['Minimum', 'Maximum']} />",
  select:
    'import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from \'@hextech-ui/react/select\';\n\n<Select defaultValue="support">\n  <SelectTrigger aria-label="Preferred role"><SelectValue /></SelectTrigger>\n  <SelectContent><SelectItem value="support">Support</SelectItem><SelectItem value="jungle">Jungle</SelectItem></SelectContent>\n</Select>',
  toolbar:
    'import { Toolbar, ToolbarButton, ToolbarSeparator } from \'@hextech-ui/react/toolbar\';\n\n<Toolbar aria-label="Build actions"><ToolbarButton>Save</ToolbarButton><ToolbarSeparator /><ToolbarButton>Share</ToolbarButton></Toolbar>',
  group:
    'import { Group, GroupInput, GroupSeparator } from \'@hextech-ui/react/group\';\n\n<Group aria-label="Player identity"><GroupInput aria-label="Name" /><GroupSeparator>#</GroupSeparator><GroupInput aria-label="Tag" /></Group>',
  menu: "import { Menu, MenuTrigger, MenuContent, MenuItem } from '@hextech-ui/react/menu';\n\n<Menu><MenuTrigger>Actions</MenuTrigger><MenuContent><MenuItem onClick={() => console.log('Save')}>Save build</MenuItem><MenuItem>Duplicate</MenuItem></MenuContent></Menu>",
  combobox:
    "import { Combobox } from '@hextech-ui/react/combobox';\n\n<Combobox label=\"Find a role\" options={['Top', 'Jungle', 'Mid', 'Carry', 'Support']} />",
  'multiple-select':
    "import { MultipleSelect } from '@hextech-ui/react/multiple-select';\n\n<MultipleSelect label=\"Preferred roles\" options={['Top', 'Jungle', 'Mid', 'Carry', 'Support']} defaultValue={['Support']} />",
});

Object.assign(componentUsage, {
  'search-field':
    'import { SearchField } from \'@hextech-ui/react/search-field\';\n\n<SearchField label="Search builds" placeholder="Type a name…" onSearch={(query) => console.log(query)} debounceMs={300} />',
  spinner:
    'import { Spinner } from \'@hextech-ui/react/spinner\';\n\n<Spinner label="Preparing session" size="medium" />',
  breadcrumbs:
    'import { Breadcrumbs, Breadcrumb } from \'@hextech-ui/react/breadcrumbs\';\n\n<Breadcrumbs><Breadcrumb href="/docs">Docs</Breadcrumb><Breadcrumb current>Current page</Breadcrumb></Breadcrumbs>',
  toast:
    "import { ToastProvider } from '@hextech-ui/react/toast';\n\n<ToastProvider><p>Call useToast().add({ title: 'Saved' }) from a child component.</p></ToastProvider>",
  'preview-card':
    'import { PreviewCard, PreviewCardTrigger, PreviewCardContent } from \'@hextech-ui/react/preview-card\';\n\n<PreviewCard><PreviewCardTrigger href="/docs/theming">Theming guide</PreviewCardTrigger><PreviewCardContent>Explore semantic CSS variables.</PreviewCardContent></PreviewCard>',
  table:
    "import { Table, TableCaption, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@hextech-ui/react/table';\n\n<Table><TableCaption>Local roster</TableCaption><TableHeader><TableRow><TableHead>Player</TableHead><TableHead>Role</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Avery</TableCell><TableCell>Support</TableCell></TableRow></TableBody></Table>",
  'vertical-table':
    "import { VerticalTable } from '@hextech-ui/react/vertical-table';\n\n<VerticalTable label=\"Build comparison\" records={[{ id: 'balanced', power: 65 }]} recordKey={(record) => record.id} fields={[{ id: 'power', label: 'Power', render: (record) => record.power }]} />",
  calendar:
    'import { Calendar, RangeCalendar } from \'@hextech-ui/react/calendar\';\n\n<Calendar label="Session date" defaultValue="2026-10-17" referenceDate="2026-10-17" />\n<RangeCalendar label="Training window" defaultMonth="2026-10-01" referenceDate="2026-10-17" />',
  'date-field':
    'import { DateField, TimeField } from \'@hextech-ui/react/date-field\';\n\n<DateField label="Session date" defaultValue="2026-10-17" />\n<TimeField label="Start time" defaultValue="19:30" />',
  'date-picker':
    'import { DatePicker, DateRangePicker } from \'@hextech-ui/react/date-picker\';\n\n<DatePicker label="Session date" defaultValue="2026-10-17" referenceDate="2026-10-17" />\n<DateRangePicker label="Training" defaultMonth="2026-10-01" referenceDate="2026-10-17" />',
});

componentUsage.toast = `import { Button } from '@hextech-ui/react/button';
import { ToastProvider, useToast } from '@hextech-ui/react/toast';

const notifications = [
  { label: 'Default', type: undefined, title: 'A little heads-up', description: 'Your next game starts here.' },
  { label: 'Success', type: 'success', title: 'Build saved', description: 'Ready for the next chapter.' },
  { label: 'Info', type: 'info', title: 'Your party is ready', description: 'One more game together?' },
  { label: 'Warning', type: 'warning', title: 'Check your loadout', description: 'Take a moment before you queue.' },
  { label: 'Error', type: 'error', title: 'Connection lost', description: 'Take a breath and try again.' },
] as const;

function ToastControls() {
  const manager = useToast();
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {notifications.map((notification) => (
        <Button
          key={notification.label}
          variant={notification.type === 'error' ? 'destructive' : notification.type === 'info' ? 'hextech' : 'secondary'}
          onClick={() => manager.add({
            title: notification.title,
            description: notification.description,
            type: notification.type,
            ...(notification.type === 'success' ? {
              actionProps: { children: 'Undo', onClick: () => manager.add({ title: 'Local save undone' }) },
            } : {}),
          })}
        >
          {notification.label}
        </Button>
      ))}
    </div>
  );
}

export function Example() {
  return <ToastProvider><ToastControls /></ToastProvider>;
}`;

componentUsage['token-field'] =
  "import { TokenField, TokenFieldValue } from '@hextech-ui/react/token-field';\n\nexport function Example() {\n  const initial = new TokenFieldValue([{ type: 'text', text: 'Ask ' }, { type: 'token', id: 'avery', text: '@Avery' }, { type: 'text', text: ' for the next build.' }]);\n  return <TokenField label=\"Message\" defaultValue={initial} name=\"message\" />;\n}";

componentUsage.tree =
  "import { Tree, moveTreeNode, type TreeNodeData } from '@hextech-ui/react/tree';\nimport { useState } from 'react';\n\nexport function Example() {\n  const [nodes, setNodes] = useState<readonly TreeNodeData[]>([{ id: 'builds', label: 'Builds', children: [{ id: 'support', label: 'Support' }] }, { id: 'practice', label: 'Practice' }]);\n  return <Tree label=\"Build library\" nodes={nodes} defaultExpandedKeys={['builds']} onMove={(move) => setNodes([...moveTreeNode(nodes, move)])} />;\n}";
componentUsage['tag-group'] =
  "import { TagGroup } from '@hextech-ui/react/tag-group';\nimport { useState } from 'react';\n\nexport function Example() {\n  const [items, setItems] = useState([{ id: 'support', label: 'Support' }, { id: 'practice', label: 'Practice' }]);\n  return <TagGroup label=\"Build tags\" items={items} selectionMode=\"multiple\" onRemove={(ids) => setItems(items.filter((item) => !ids.includes(item.id)))} />;\n}";

componentUsage['data-table'] =
  "import { DataTable } from '@hextech-ui/react/data-table';\n\n<DataTable label=\"Practice roster\" data={[{ id: 'avery', name: 'Avery', score: 62 }]} columns={[{ id: 'name', header: 'Player', accessor: (row) => row.name }, { id: 'score', header: 'Score', accessor: (row) => row.score }]} getRowId={(row) => row.id} rowLabel={(row) => row.name} selectionMode=\"multiple\" resizable />";

componentUsage.charts =
  "import { LineChart } from '@hextech-ui/react/charts';\n\n<LineChart title=\"Practice resources\" data={[{ minute: '05', resources: 8 }, { minute: '10', resources: 14 }]} x={(row) => row.minute} series={[{ id: 'resources', label: 'Resources', value: (row) => row.resources }]} />";

componentUsage['use-list-data'] =
  "import { useState } from 'react';\nimport { useListData } from '@hextech-ui/react/use-list-data';\nimport { SearchField } from '@hextech-ui/react/search-field';\nimport { Button } from '@hextech-ui/react/button';\n\nconst people = [{ id: 'avery', name: 'Avery' }, { id: 'rowan', name: 'Rowan' }, { id: 'sage', name: 'Sage' }, { id: 'quinn', name: 'Quinn' }];\nexport function Example() {\n  const [query, setQuery] = useState('');\n  const list = useListData({ initialItems: people.slice(0, 2), getKey: (item) => item.id, filter: (item, text) => item.name.toLowerCase().includes(text.toLowerCase()) });\n  return <section aria-label=\"Local list demo\" className=\"grid w-full max-w-sm gap-3\">\n    <SearchField label=\"Filter local names\" value={query} onValueChange={setQuery} onSearch={list.setFilterText} debounceMs={300} />\n    <ul className=\"m-0 grid list-none gap-2 p-0\">{list.items.map(item => <li key={item.id} className=\"flex items-center justify-between border border-border p-2\">{item.name}<Button size=\"small\" variant=\"dimmed\" aria-label={'Remove ' + item.name} onClick={() => list.remove(item.id)}>Remove</Button></li>)}</ul>\n    <div className=\"flex gap-2\"><Button size=\"small\" disabled={Boolean(list.getItem('sage'))} onClick={() => list.append(people[2]!)}>Add Sage</Button><Button size=\"small\" variant=\"dimmed\" onClick={() => list.replace(people.slice(0, 2))}>Reset names</Button></div>\n  </section>;\n}";

componentUsage['use-async-list'] =
  "import { useState } from 'react';\nimport { useAsyncList } from '@hextech-ui/react/use-async-list';\nimport { SearchField } from '@hextech-ui/react/search-field';\nimport { Button } from '@hextech-ui/react/button';\n\nconst people = [{ id: 'avery', name: 'Avery' }, { id: 'rowan', name: 'Rowan' }, { id: 'sage', name: 'Sage' }, { id: 'quinn', name: 'Quinn' }];\nexport function Example() {\n  const [query, setQuery] = useState('');\n  const list = useAsyncList({\n    getKey: (item: (typeof people)[number]) => item.id,\n    load: async ({ signal, cursor, filterText }) => {\n      await new Promise(resolve => setTimeout(resolve, 50));\n      signal.throwIfAborted();\n      const filtered = people.filter(item => item.name.toLowerCase().includes(filterText.toLowerCase()));\n      const offset = Number(cursor || 0);\n      return { items: filtered.slice(offset, offset + 2), cursor: offset + 2 < filtered.length ? String(offset + 2) : null };\n    },\n  });\n  return <section aria-label=\"Async list demo\" className=\"grid w-full max-w-sm gap-3\">\n    <SearchField label=\"Filter async names\" value={query} onValueChange={setQuery} onSearch={list.setFilterText} debounceMs={300} />\n    <ul aria-busy={list.isLoading} className=\"m-0 grid list-none gap-2 p-0\">{list.items.map(item => <li key={item.id} className=\"border border-border p-2\">{item.name}</li>)}</ul>\n    {list.error && <p role=\"alert\">{list.error.message}</p>}\n    <p role=\"status\">{list.isLoading ? 'Loading local demo data…' : list.items.length + ' names loaded'}</p>\n    <div className=\"flex gap-2\"><Button size=\"small\" disabled={query !== list.filterText || !list.hasMore} loading={list.isLoading} onClick={() => void list.loadMore()}>Load more names</Button><Button size=\"small\" variant=\"dimmed\" onClick={() => void list.reload()}>Reload names</Button></div>\n  </section>;\n}";

componentUsage['virtual-listbox'] =
  "import { VirtualListbox } from '@hextech-ui/react/virtual-listbox';\n\n<VirtualListbox label=\"Practice builds\" items={Array.from({ length: 1000 }, (_, index) => ({ id: String(index), label: 'Build ' + (index + 1) }))} multiple />";

componentUsage.autocomplete =
  "import { Autocomplete } from '@hextech-ui/react/autocomplete';\n\n<Autocomplete label=\"Build query\" options={['Vision', 'Tempo', 'Roaming']} name=\"query\" />";
componentUsage.combobox =
  "import { Combobox } from '@hextech-ui/react/combobox';\n\n<Combobox label=\"Party leader\" options={[{ id: 'avery', name: 'Avery' }, { id: 'rowan', name: 'Rowan' }]} getOptionKey={(member) => member.id} itemToStringLabel={(member) => member.name} name=\"leader\" />";
componentUsage['multiple-select'] =
  "import { MultipleSelect } from '@hextech-ui/react/multiple-select';\n\n<MultipleSelect label=\"Party members\" options={[{ id: 'avery', name: 'Avery' }, { id: 'rowan', name: 'Rowan' }]} getOptionKey={(member) => member.id} itemToStringLabel={(member) => member.name} name=\"members\" />";

componentUsage['table-load-more'] =
  "import { useState } from 'react';\nimport { TableLoadMoreItem } from '@hextech-ui/react/table-load-more';\n\nexport function Example() {\n  const [rows, setRows] = useState([1, 2, 3]);\n  return <table>\n    <caption>Local practice notes</caption>\n    <thead><tr><th scope=\"col\">Note</th></tr></thead>\n    <tbody>\n      {rows.map((id) => <tr key={id}><td>Plan {id}</td></tr>)}\n      <TableLoadMoreItem loadKey={rows.length} hasMore={rows.length < 9}\n        onLoadMore={async ({ signal }) => {\n          // Local demo data; replace this with your own data source.\n          if (signal.aborted) return;\n          setRows((current) => [...current, current.length + 1, current.length + 2, current.length + 3]);\n        }} />\n    </tbody>\n  </table>;\n}";

componentUsage.sonner = `import { useId, useState } from 'react';
import { Button } from '@hextech-ui/react/button';
import { Sonner, sonner } from '@hextech-ui/react/sonner';

export function Example() {
  const toasterId = useId();
  const [outcome, setOutcome] = useState('');
  return <>
    <Sonner id={toasterId} closeButton />
    <div className="flex flex-wrap justify-center gap-3">
      <Button onClick={() => sonner('Default Sonner', { toasterId })}>Show notification</Button>
      <Button onClick={() => sonner.success('Sonner with Success Icon', { toasterId, description: 'This notification includes an icon.' })}>Success</Button>
      <Button onClick={() => sonner('Sonner with Action', { toasterId, description: 'This notification includes an action.', action: { label: 'Undo', onClick: () => setOutcome('Changes undone') } })}>With action</Button>
      <Button onClick={() => sonner.promise(new Promise<string>(resolve => setTimeout(() => resolve('Build saved'), 1500)), { toasterId, loading: 'Saving build…', success: value => value, error: 'Unable to save' })}>Promise</Button>
    </div>
    {outcome && <p role="status">{outcome}</p>}
  </>;
}`;
