import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

let signupSpy: any = vi.fn(async () => {});
vi.mock('../../state/authStore.ts', () => ({
  useAuthStore: (selector: any) =>
    selector({
      signup: (...a: any[]) => signupSpy(...a),
      status: 'idle',
      error: null,
    }),
}));

beforeEach(() => {
  signupSpy = vi.fn(async () => {});
});

describe('SignUp Page', () => {
  it('shows mismatch error when passwords differ', async () => {
    const { default: SignUp } = await import('../SignUp.tsx');
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText(/first name/i), 'Ada');
    await user.type(screen.getByLabelText(/last name/i), 'Lovelace');
    await user.type(screen.getByLabelText(/^email$/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'StrongPass1!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Mismatch1!');
    await user.click(
      screen.getAllByRole('button', { name: /create account/i })[0],
    );
    expect(screen.getByText(/passwords do not match/i)).toBeDefined();
  });

  it('submits when form is valid', async () => {
    const { default: SignUp } = await import('../SignUp.tsx');
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText(/first name/i), 'Ada');
    await user.type(screen.getByLabelText(/last name/i), 'Lovelace');
    await user.type(screen.getByLabelText(/^email$/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'StrongPass1!');
    await user.type(screen.getByLabelText(/confirm password/i), 'StrongPass1!');
    await user.click(
      screen.getAllByRole('button', { name: /create account/i })[0],
    );
    expect(signupSpy).toHaveBeenCalled();
  });
});
