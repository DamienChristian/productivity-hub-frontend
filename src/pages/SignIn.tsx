import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../state/authStore.ts';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/ui/Spinner.tsx';
import type { ApiError } from '../lib/axios.ts';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password required'),
});
type FormValues = z.infer<typeof schema>;

export default function SignIn() {
  const signin = useAuthStore((s) => s.signin);
  const status = useAuthStore((s) => s.status);
  const storeError = useAuthStore((s) => s.error);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(values: FormValues) {
    try {
      await signin(values);
      navigate('/', { replace: true });
    } catch (e: any) {
      const apiErr: ApiError | undefined = e;
      const data = apiErr?.response?.data;
      if (data?.code === 'INVALID_CREDENTIALS') {
        setError('password', { message: 'Invalid credentials' });
      }
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input pr-10"
                {...register('password')}
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
            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-brand-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={status === 'authenticating'}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {status === 'authenticating' ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> Signing in…
              </span>
            ) : (
              'Sign In'
            )}
          </button>
          {storeError && (
            <p className="text-red-700 text-sm mt-2">{storeError}</p>
          )}
          <p className="muted mt-4">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-brand-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
