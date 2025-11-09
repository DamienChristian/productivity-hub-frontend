import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useAuthStore } from '../../state/authStore.ts';
import { useState } from 'react';
import { useThemeStore } from '../../store/themeStore.ts';

export default function Layout() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const isAuthed = !!user;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const setTheme = useThemeStore((s) => s.setTheme);
  return (
    <div className="app-shell">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 backdrop-blur px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-brand-600 dark:text-brand-400"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-white font-semibold text-sm shadow-soft">
              PH
            </span>
            <span>Productivity Hub</span>
          </Link>
          {isAuthed && (
            <nav className="hidden md:flex gap-4 text-sm">
              <Link className="hover:text-brand-600 transition" to="/tasks">
                Tasks
              </Link>
              <Link className="hover:text-brand-600 transition" to="/notes">
                Notes
              </Link>
              <Link className="hover:text-brand-600 transition" to="/profile">
                Profile
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Theme dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setThemeOpen((o) => !o)}
              className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm"
              aria-haspopup="true"
              aria-expanded={themeOpen}
              aria-label="Theme menu"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v2" />
                <path d="M12 19v2" />
                <path d="M5 12H3" />
                <path d="M21 12h-2" />
                <path d="M18.36 5.64l-1.42 1.42" />
                <path d="M7.06 16.94l-1.42 1.42" />
                <path d="M5.64 5.64l1.42 1.42" />
                <path d="M16.94 16.94l1.42 1.42" />
                <circle cx="12" cy="12" r="5" />
              </svg>
            </button>
            {themeOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-soft p-2 text-sm z-50">
                <button
                  onClick={() => {
                    setTheme('light');
                    setThemeOpen(false);
                  }}
                  className="block w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Light
                </button>
                <button
                  onClick={() => {
                    setTheme('dark');
                    setThemeOpen(false);
                  }}
                  className="block w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Dark
                </button>
                <button
                  onClick={() => {
                    setTheme('system');
                    setThemeOpen(false);
                  }}
                  className="block w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  System
                </button>
              </div>
            )}
          </div>
          {/* Account / navigation dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-sm bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              {/* User icon */}
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a5 5 0 110 10 5 5 0 010-10zm0 12c-5 0-9 3-9 6v2h18v-2c0-3-4-6-9-6z" />
              </svg>
              <span>{user ? user.firstName : 'Account'}</span>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 min-w-[180px] rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-soft p-2 text-sm z-50">
                {isAuthed ? (
                  <>
                    <div className="px-2 py-1 text-slate-500 dark:text-slate-400 text-xs">
                      Signed in as
                    </div>
                    <div className="px-2 pb-2 font-medium truncate">
                      {user!.email}
                    </div>
                    <button
                      onClick={() => {
                        navigate('/tasks');
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Tasks
                    </button>
                    <button
                      onClick={() => {
                        navigate('/notes');
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Notes
                    </button>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Profile
                    </button>
                    <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
                    <button
                      onClick={async () => {
                        try {
                          await logout();
                          toast.success('Signed out');
                          navigate('/signin');
                        } catch {
                          toast.error('Failed sign out');
                        } finally {
                          setMenuOpen(false);
                        }
                      }}
                      className="block w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-400"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate('/signin');
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => {
                        navigate('/signup');
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Create account
                    </button>
                    <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
                    <button
                      onClick={() => {
                        navigate('/tasks');
                        setMenuOpen(false);
                      }}
                      disabled
                      className="block w-full text-left px-2 py-1 rounded opacity-40 cursor-not-allowed"
                    >
                      Tasks (login)
                    </button>
                    <button
                      onClick={() => {
                        navigate('/notes');
                        setMenuOpen(false);
                      }}
                      disabled
                      className="block w-full text-left px-2 py-1 rounded opacity-40 cursor-not-allowed"
                    >
                      Notes (login)
                    </button>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setMenuOpen(false);
                      }}
                      disabled
                      className="block w-full text-left px-2 py-1 rounded opacity-40 cursor-not-allowed"
                    >
                      Profile (login)
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 mx-auto w-full max-w-5xl">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-700 p-6 text-center text-sm text-slate-500">
        <div className="container mx-auto flex items-center justify-between">
          <div>© {new Date().getFullYear()} Productivity Hub</div>
          <div className="hidden sm:flex gap-4">
            <Link to="/">Home</Link>
            {isAuthed ? (
              <>
                <Link to="/tasks">Tasks</Link>
                <Link to="/notes">Notes</Link>
                <Link to="/profile">Profile</Link>
              </>
            ) : (
              <>
                <Link to="/signin">Sign in</Link>
                <Link to="/signup">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
