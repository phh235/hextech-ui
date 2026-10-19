'use client';

import { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from '@hextech-ui/react/tabs';
import { Badge } from '@hextech-ui/react/badge';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuSeparator,
} from '@hextech-ui/react/menu';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from '@hextech-ui/react/accordion';
import { ShowcaseCard } from './showcase-card';

export function BuildShowcase() {
  const [tab, setTab] = useState('overview');
  const [notes, setNotes] = useState(true);
  return (
    <ShowcaseCard title="A build of your own" component="tabs">
      <Tabs value={tab} onValueChange={setTab}>
        <TabList aria-label="Build details">
          <Tab value="overview">Overview</Tab>
          <Tab value="runes">Runes</Tab>
        </TabList>
        <TabPanel value="overview" className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Ability power</Badge>
            <Badge tone="teal">Burst</Badge>
          </div>
          <dl className="m-0 grid gap-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Focus</dt>
              <dd className="m-0">Adaptive force</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Playstyle</dt>
              <dd className="m-0">Make an opening</dd>
            </div>
          </dl>
          {notes && (
            <p className="m-0 text-sm text-muted-foreground">
              A balanced starting point for your next game.
            </p>
          )}
        </TabPanel>
        <TabPanel value="runes" className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="teal">Sorcery</Badge>
            <Badge>Inspiration</Badge>
          </div>
          <p className="m-0 text-sm text-muted-foreground">
            Choose the details that fit your playstyle.
          </p>
        </TabPanel>
      </Tabs>
      <Menu>
        <MenuTrigger className="w-full">Build actions</MenuTrigger>
        <MenuContent>
          <MenuItem onClick={() => setTab('overview')}>Show overview</MenuItem>
          <MenuItem onClick={() => setTab('runes')}>Show runes</MenuItem>
          <MenuSeparator />
          <MenuCheckboxItem checked={notes} onCheckedChange={setNotes}>
            Show notes
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>
    </ShowcaseCard>
  );
}

export function AccordionShowcase() {
  return (
    <ShowcaseCard title="Make it your own" component="accordion">
      <Accordion defaultValue={['theme']}>
        <AccordionItem value="theme">
          <AccordionTrigger>Colors & tokens</AccordionTrigger>
          <AccordionPanel>
            Gold accents. Teal highlights. A palette that follows your theme.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="keyboard">
          <AccordionTrigger>Keyboard controls</AccordionTrigger>
          <AccordionPanel>
            Tab between controls. Use the arrow keys to explore lists and choices.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </ShowcaseCard>
  );
}
