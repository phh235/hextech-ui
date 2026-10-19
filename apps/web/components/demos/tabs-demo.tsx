'use client';

import { Tabs, TabList, Tab, TabPanel } from '@hextech-ui/react/tabs';

export function TabsDemo() {
  return (
    <>
      <Tabs defaultValue="overview">
        <TabList aria-label="Build details">
          <Tab value="overview">Overview</Tab>
          <Tab value="runes">Runes</Tab>
        </TabList>
        <TabPanel value="overview">Build summary</TabPanel>
        <TabPanel value="runes">Rune choices</TabPanel>
      </Tabs>
    </>
  );
}
