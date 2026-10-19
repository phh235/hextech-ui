'use client';

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@hextech-ui/react/tooltip';

export function TooltipDemo() {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Pin</TooltipTrigger>
          <TooltipContent>Keep this build at the top.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
