import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { type ReactNode } from 'react';

interface TooltipProps {
  label: ReactNode;
  children: ReactNode;
  delayDuration?: number;
}

export function Tooltip({
  label,
  children,
  delayDuration = 300,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={6}
            className="max-w-xs rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-100 shadow-md animate-fade"
          >
            {label}
            <TooltipPrimitive.Arrow className="fill-slate-800" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
