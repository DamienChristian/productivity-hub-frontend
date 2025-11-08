import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { type ReactNode } from 'react';

interface DropdownMenuProps {
  trigger: ReactNode;
  items: { label: string; onSelect?: () => void; disabled?: boolean }[];
}

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger asChild>{trigger}</DropdownPrimitive.Trigger>
      <DropdownPrimitive.Portal>
        <DropdownPrimitive.Content
          sideOffset={6}
          className="min-w-[160px] rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-md focus:outline-none"
        >
          {items.map((item) => (
            <DropdownPrimitive.Item
              key={item.label}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className="select-none rounded-sm px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200 outline-none data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white data-[disabled]:opacity-40 cursor-pointer"
            >
              {item.label}
            </DropdownPrimitive.Item>
          ))}
        </DropdownPrimitive.Content>
      </DropdownPrimitive.Portal>
    </DropdownPrimitive.Root>
  );
}
