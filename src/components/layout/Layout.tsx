import { Link, Outlet } from 'react-router-dom';
import { DropdownMenu } from '../primitives/DropdownMenu.tsx';

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-indigo-600">Productivity Hub</span>
          <nav className="flex gap-3 text-sm">
            <Link className="hover:underline" to="/">
              Home
            </Link>
            <Link className="hover:underline" to="/tasks">
              Tasks
            </Link>
            <Link className="hover:underline" to="/notes">
              Notes
            </Link>
          </nav>
        </div>
        <DropdownMenu
          trigger={
            <button className="text-sm text-slate-600 dark:text-slate-300">
              Account ▾
            </button>
          }
          items={[
            { label: 'Profile' },
            { label: 'Settings' },
            { label: 'Sign out' },
          ]}
        />
      </header>
      <main className="flex-1 p-6 mx-auto w-full max-w-5xl">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-700 p-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Productivity Hub
      </footer>
    </div>
  );
}
