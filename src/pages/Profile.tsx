import { useEffect } from 'react';
import { useAuthStore } from '../state/authStore.ts';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const init = useAuthStore((s) => s.init);
  const logout = useAuthStore((s) => s.logout);
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === 'idle') {
      void init();
    }
  }, [status, init]);

  if (status === 'idle' || status === 'authenticating') {
    return <p className="p-6">Loading…</p>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="p-6">
        <p>You are not signed in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      {user && (
        <div className="border rounded p-4 bg-white shadow-sm dark:bg-neutral-800">
          <p>
            <span className="font-medium">Name:</span> {user.firstName}{' '}
            {user.lastName}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">ID:</span> {user.id}
          </p>
        </div>
      )}
      <button
        onClick={() => logout()}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
