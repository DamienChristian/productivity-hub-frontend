import { type ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring';
  const variants: Record<typeof variant, string> = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500/50',
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
  } as const;
  return (
    <button
      className={twMerge(base, variants[variant], className)}
      {...props}
    />
  );
}
