'use client';

import dynamic from 'next/dynamic';
import {
  ControlsShowcase,
  ProfileShowcase,
  ProgressShowcase,
  PreferencesShowcase,
} from './home/showcase-basics';
import { PartyShowcase, ChampionShowcase, CalendarShowcase } from './home/showcase-forms';
import { BuildShowcase, AccordionShowcase } from './home/showcase-build';
import { ShowcaseCard } from './home/showcase-card';
import { AudioShowcase, PlaystyleShowcase } from './home/showcase-settings';
import { ShowcaseMasonry } from './home/showcase-masonry';
const NotificationsShowcase = dynamic(
  () => import('./home/showcase-notifications').then((module) => module.NotificationsShowcase),
  {
    loading: () => (
      <ShowcaseCard title="A little heads-up" component="sonner">
        <p role="status" className="m-0 min-h-12 text-sm text-muted-foreground">
          Loading notifications…
        </p>
      </ShowcaseCard>
    ),
  },
);

export function FeaturedComponents() {
  return (
    <div className="showcase-scope">
      <ShowcaseMasonry>
        <ControlsShowcase />
        <ProfileShowcase />
        <AudioShowcase />
        <PartyShowcase />
        <BuildShowcase />
        <CalendarShowcase />
        <ProgressShowcase />
        <PlaystyleShowcase />
        <PreferencesShowcase />
        <ChampionShowcase />
        <AccordionShowcase />
        <NotificationsShowcase />
      </ShowcaseMasonry>
    </div>
  );
}
