import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'ui.theme';

function getSystemPrefersDark() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const dark =
    theme === 'dark' || (theme === 'system' && getSystemPrefersDark());
  root.classList.toggle('dark', dark);
}

type State = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

export const useThemeStore = create<State>((set, get) => ({
  theme: (localStorage.getItem(STORAGE_KEY) as Theme) || 'system',
  setTheme: (t) => {
    localStorage.setItem(STORAGE_KEY, t);
    applyTheme(t);
    set({ theme: t });
  },
  toggle: () => {
    const curr = get().theme;
    const next = curr === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },
}));

// Initialize on load
if (typeof window !== 'undefined') {
  applyTheme((localStorage.getItem(STORAGE_KEY) as Theme) || 'system');
  // Update on system changes when in 'system' mode
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => {
    const theme = (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
    if (theme === 'system') applyTheme('system');
  };
  if (mql?.addEventListener) mql.addEventListener('change', handler);
}
