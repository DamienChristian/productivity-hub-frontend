import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Spinner from '../components/ui/Spinner.tsx';
import { resetPassword } from '../lib/auth.ts';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

const passwordSchema = z
  .string()
  .min(8, 'Min 8 characters')
  .max(128, 'Max 128 characters')
  .regex(/[a-z]/, 'Need a lowercase letter')
  .regex(/[A-Z]/, 'Need an uppercase letter')
  .regex(/[0-9]/, 'Need a number')
  .regex(/[^A-Za-z0-9]/, 'Need a special character');

const schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type FormValues = z.infer<typeof schema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }
    try {
      await resetPassword(token, values.password);
      toast.success('Password updated. Please sign in.');
      navigate('/signin');
    } catch (e: any) {
      toast.error('Failed to reset password');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          aria-label="Reset password form"
        >
          <div>
            <label htmlFor="password" className="label">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input pr-10"
                {...register('password')}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-xs text-slate-500 dark:text-slate-400 hover:text-brand-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className="input pr-10"
                {...register('confirmPassword')}
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-xs text-slate-500 dark:text-slate-400 hover:text-brand-600"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-600 text-white px-4 py-2 rounded disabled:opacity-50"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> Updating…
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
          <p className="muted mt-4">
            Need a new link?{' '}
            <Link
              to="/forgot-password"
              className="text-brand-600 hover:underline"
            >
              Request again
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
