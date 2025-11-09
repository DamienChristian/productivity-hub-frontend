import { useThemeStore } from '../../store/themeStore.ts';

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const setTheme = useThemeStore((s) => s.setTheme);
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
        title="Toggle theme"
      >
        {theme === 'dark' ? (
          <MoonIcon />
        ) : theme === 'light' ? (
          <SunIcon />
        ) : (
          <SystemIcon />
        )}
        <span className="hidden sm:inline">
          {theme[0].toUpperCase() + theme.slice(1)}
        </span>
      </button>
      <div className="hidden md:inline-flex gap-1">
        <ModeButton
          label="Light"
          active={theme === 'light'}
          onClick={() => setTheme('light')}
        >
          <SunIcon />
        </ModeButton>
        <ModeButton
          label="Dark"
          active={theme === 'dark'}
          onClick={() => setTheme('dark')}
        >
          <MoonIcon />
        </ModeButton>
        <ModeButton
          label="System"
          active={theme === 'system'}
          onClick={() => setTheme('system')}
        >
          <SystemIcon />
        </ModeButton>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
  label,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border ${
        active
          ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/60 dark:bg-brand-500/10'
          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 0l1.79-1.8 1.41 1.41-1.8 1.79-1.4-1.4zM12 4V1h-0v3h0zm0 19v-3h0v3h0zM4 12H1v0h3v0zm19 0h-3v0h3v0zM6.76 19.16l-1.42 1.42-1.79-1.8 1.41-1.41 1.8 1.79zm12.69-.38l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM12 6a6 6 0 100 12 6 6 0 000-12z" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12.74 2a9 9 0 108.54 12.26A8 8 0 0112.74 2z" />
    </svg>
  );
}

function SystemIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 4h18v12H3zM2 19h20v2H2z" />
    </svg>
  );
}
