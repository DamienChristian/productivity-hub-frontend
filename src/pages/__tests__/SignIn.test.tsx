import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
// Import deferred inside each test after spies are set to avoid duplicate renders

let signinSpy: any = vi.fn(async () => {});
vi.mock('../../state/authStore.ts', () => ({
  useAuthStore: (selector: any) =>
    selector({
      signin: (...args: any[]) => signinSpy(...args),
      status: 'idle',
      error: null,
    }),
}));
vi.mock('react-router-dom', async (orig) => {
  const actual: any = await orig();
  return { ...actual, useNavigate: () => vi.fn() };
});

describe('SignIn Page', () => {
  it('validates invalid email before submit', async () => {
    const user = userEvent.setup();
    const { default: SignIn } = await import('../SignIn.tsx');
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>,
    );
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/^password$/i, {
      selector: 'input',
    } as any);
    await user.type(email, 'bad-email');
    await user.type(password, 'hunter2!');
    await user.click(screen.getAllByRole('button', { name: /sign in/i })[0]);
    // Assert submit prevented and signin not invoked due to validation failure
    expect(signinSpy).not.toHaveBeenCalled();
  });

  it('calls signin with form values when valid', async () => {
    signinSpy = vi.fn(async () => {});
    const user = userEvent.setup();
    const { default: SignIn } = await import('../SignIn.tsx');
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(
      screen.getByLabelText(/^password$/i, { selector: 'input' } as any),
      'StrongPass1!',
    );
    await user.click(screen.getAllByRole('button', { name: /sign in/i })[0]);
    expect(signinSpy).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'StrongPass1!',
    });
  });
});
