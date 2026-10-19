'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from '@hextech-ui/react/accordion';

export function AccordionDemo() {
  return (
    <>
      <Accordion>
        <AccordionItem value="source">
          <AccordionTrigger>Do I own the source?</AccordionTrigger>
          <AccordionPanel>Yes. Edit it in your project.</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
