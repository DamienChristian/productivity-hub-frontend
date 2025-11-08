import { useState } from 'react';
import { Button } from '../components/ui/Button.tsx';
import { Dialog } from '../components/primitives/Dialog.tsx';

export default function Tasks() {
  const [count, setCount] = useState(0);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Tasks</h2>
        <Dialog
          trigger={<Button variant="primary">New Task</Button>}
          title="Create Task"
          description="Add a new task to your workspace"
        >
          <form className="space-y-4">
            <input
              className="w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              placeholder="Title"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </form>
        </Dialog>
      </div>
      <Button onClick={() => setCount((c) => c + 1)} variant="secondary">
        Increment ({count})
      </Button>
      <div className="card text-sm">Placeholder task list will go here.</div>
    </div>
  );
}
