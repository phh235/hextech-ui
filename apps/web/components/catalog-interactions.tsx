'use client';
import { useId, useState } from 'react';
import {
  Button,
  Input,
  Label,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
  Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
  Progress,
  NumberField,
  Slider,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  Group,
  GroupInput,
  GroupSeparator,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSub,
  MenuSubTrigger,
  MenuLabel,
  MenuGroup,
  MenuSeparator,
  MenuCheckboxItem,
  Combobox,
  MultipleSelect,
} from '@hextech-ui/react';

export function InteractionExample({
  name,
  disabled = false,
}: {
  name: string;
  disabled?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('support');
  const [number, setNumber] = useState<number | null>(3);
  const [notification, setNotification] = useState('');
  const [checked, setChecked] = useState(true);
  switch (name) {
    case 'dialog':
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger disabled={disabled}>Edit profile</DialogTrigger>
          <DialogContent>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Choose a display name for this local example.</DialogDescription>
            <label className="grid gap-2 text-sm">
              Display name
              <Input defaultValue="Starlight" />
            </label>
            <div className="flex justify-end gap-3">
              <DialogClose>Cancel</DialogClose>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Save profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    case 'alert-dialog':
      return (
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" disabled={disabled} />}>
            Leave party
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Leave this party?</AlertDialogTitle>
            <AlertDialogDescription>
              This only changes the local demo. No invitation or account is affected.
            </AlertDialogDescription>
            <div className="flex flex-wrap justify-end gap-3">
              <AlertDialogClose>Stay in party</AlertDialogClose>
              <AlertDialogClose onClick={() => setNotification('Left the local party demo.')}>
                Leave party
              </AlertDialogClose>
            </div>
          </AlertDialogContent>
          <p className="sr-only" role="status">
            {notification}
          </p>
        </AlertDialog>
      );
    case 'popover':
      return (
        <Popover>
          <PopoverTrigger disabled={disabled}>Party details</PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              <PopoverTitle className="font-display text-lg text-primary">
                A little more context.
              </PopoverTitle>
              <PopoverDescription>
                Interactive popovers stay open while you read or use their controls.
              </PopoverDescription>
              <PopoverClose render={<Button size="small" />}>Got it</PopoverClose>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      );
    case 'tooltip':
      return (
        <TooltipProvider delay={200}>
          <Tooltip>
            <TooltipTrigger render={<Button disabled={disabled} />}>Pin setup</TooltipTrigger>
            <TooltipContent>Keep this build at the top of your local list.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'tabs':
      return (
        <Tabs defaultValue="overview" className="w-full max-w-md">
          <TabList aria-label="Build details">
            <Tab value="overview" disabled={disabled}>
              Overview
            </Tab>
            <Tab value="runes" disabled={disabled}>
              Runes
            </Tab>
            <Tab value="history" disabled>
              History
            </Tab>
          </TabList>
          <TabPanel value="overview">A balanced starting point for your next game.</TabPanel>
          <TabPanel value="runes">Choose the details that fit your playstyle.</TabPanel>
        </Tabs>
      );
    case 'accordion':
      return (
        <Accordion className="w-full max-w-md">
          <AccordionItem value="source">
            <AccordionTrigger disabled={disabled}>Do I own the source?</AccordionTrigger>
            <AccordionPanel>
              Yes. Registry installation copies editable source into your project.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="framework">
            <AccordionTrigger disabled={disabled}>Does this require Next.js?</AccordionTrigger>
            <AccordionPanel>No. Components also work in Vite React projects.</AccordionPanel>
          </AccordionItem>
        </Accordion>
      );
    case 'collapsible':
      return (
        <Collapsible className="w-full max-w-md">
          <CollapsibleTrigger disabled={disabled}>Show build notes</CollapsibleTrigger>
          <CollapsiblePanel>
            Keep the first step simple. Adapt after the lane is understood.
          </CollapsiblePanel>
        </Collapsible>
      );
    case 'progress':
      return (
        <div className="grid w-full max-w-sm gap-6">
          <Progress label="Build progress" value={64} />
          <Progress label="Finding a match" value={null} />
        </div>
      );
    case 'number-field':
      return (
        <NumberField
          label="Party size"
          value={number}
          onValueChange={setNumber}
          min={1}
          max={5}
          step={1}
          disabled={disabled}
          className="w-40"
        />
      );
    case 'slider':
      return (
        <div className="grid w-full max-w-sm gap-6">
          <Slider label="Effects intensity" defaultValue={40} disabled={disabled} />
          <Slider
            label="Preferred range"
            defaultValue={[25, 75]}
            thumbLabels={['Minimum range', 'Maximum range']}
            disabled={disabled}
          />
        </div>
      );
    case 'select':
      return (
        <div className="grid w-full max-w-xs gap-2">
          <span id={`${id}-role-label`} className="text-sm">
            Preferred role
          </span>
          <Select
            value={value}
            onValueChange={(next) => setValue(next ?? '')}
            disabled={disabled}
            items={[
              { value: 'support', label: 'Support' },
              { value: 'jungle', label: 'Jungle' },
              { value: 'mid', label: 'Mid' },
            ]}
          >
            <SelectTrigger aria-labelledby={`${id}-role-label`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="jungle">Jungle</SelectItem>
              <SelectItem value="mid">Mid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    case 'toolbar':
      return (
        <Toolbar aria-label="Build actions">
          <ToolbarButton
            disabled={disabled}
            onClick={() => setNotification('Build saved locally.')}
          >
            Save
          </ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton
            disabled={disabled}
            onClick={() => setNotification('Share link copied in this demo.')}
          >
            Share
          </ToolbarButton>
          <span className="sr-only" role="status">
            {notification}
          </span>
        </Toolbar>
      );
    case 'group':
      return (
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor={`${id}-player`}>Player identity</Label>
          <Group aria-label="Player identity">
            <GroupInput
              id={`${id}-player`}
              aria-label="Player name"
              placeholder="Starlight"
              disabled={disabled}
            />
            <GroupSeparator>#</GroupSeparator>
            <GroupInput
              aria-label="Player tag"
              placeholder="EUW"
              className="max-w-24"
              disabled={disabled}
            />
          </Group>
        </div>
      );
    case 'menu':
      return (
        <Menu>
          <MenuTrigger disabled={disabled}>Build actions</MenuTrigger>
          <MenuContent>
            <MenuGroup>
              <MenuLabel>Current build</MenuLabel>
              <MenuItem onClick={() => setNotification('Build saved locally.')}>
                Save build
              </MenuItem>
              <MenuItem onClick={() => setNotification('A local copy was created.')}>
                Duplicate
              </MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
              Show tips
            </MenuCheckboxItem>
            <MenuSub>
              <MenuSubTrigger>Export</MenuSubTrigger>
              <MenuContent side="right">
                <MenuItem onClick={() => setNotification('Exported as text in this demo.')}>
                  Text format
                </MenuItem>
                <MenuItem onClick={() => setNotification('Exported as JSON in this demo.')}>
                  JSON format
                </MenuItem>
              </MenuContent>
            </MenuSub>
          </MenuContent>
          <span className="sr-only" role="status">
            {notification}
          </span>
        </Menu>
      );
    case 'combobox':
      return (
        <Combobox
          label="Find a role"
          options={['Top', 'Jungle', 'Mid', 'Carry', 'Support']}
          placeholder="Type to filter…"
          disabled={disabled}
          className="max-w-xs"
        />
      );
    case 'multiple-select':
      return (
        <MultipleSelect
          label="Preferred roles"
          options={['Top', 'Jungle', 'Mid', 'Carry', 'Support']}
          defaultValue={['Support']}
          disabled={disabled}
          className="max-w-sm"
        />
      );
    default:
      return null;
  }
}
