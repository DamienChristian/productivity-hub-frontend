import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-hot-toast';

vi.mock('../../lib/auth.ts', () => ({
  requestPasswordReset: vi.fn(async () => ({ message: 'ok' })),
}));

vi.mock('react-hot-toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('react-router-dom', async (orig) => {
  const actual: any = await orig();
  return { ...actual, useNavigate: () => vi.fn() };
});

describe('ForgotPassword Page', () => {
  it('submits email and calls toast success', async () => {
    const { default: ForgotPassword } = await import('../ForgotPassword.tsx');
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));
    expect((toast as any).success).toHaveBeenCalled();
  });
});
