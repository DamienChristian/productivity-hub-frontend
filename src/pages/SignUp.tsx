import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../state/authStore.ts';
import Spinner from '../components/ui/Spinner.tsx';
import type { ApiError } from '../lib/axios.ts';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    firstName: z.string().min(1, 'First name required'),
    lastName: z.string().min(1, 'Last name required'),
    email: z.string().email('Invalid email'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type FormValues = z.infer<typeof schema>;

export default function SignUp() {
  const signup = useAuthStore((s) => s.signup);
  const status = useAuthStore((s) => s.status);
  const storeError = useAuthStore((s) => s.error);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      await signup(values);
      navigate('/', { replace: true });
    } catch (e: any) {
      const apiErr: ApiError | undefined = e;
      const data = apiErr?.response?.data;
      if (data?.code === 'EMAIL_IN_USE') {
        setError('email', { message: 'Email already in use' });
      } else if (data?.code === 'VALIDATION_ERROR' && data?.details) {
        // Flattened Zod errors may appear; attempt simple mapping
        const fieldErrors = data.details?.fieldErrors || {};
        Object.entries(fieldErrors).forEach(([k, v]: [string, any]) => {
          if (Array.isArray(v) && v[0]) setError(k as any, { message: v[0] });
        });
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
        <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="label">
              First Name
            </label>
            <input
              id="firstName"
              className="input"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="label">
              Last Name
            </label>
            <input id="lastName" className="input" {...register('lastName')} />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="label">
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
          </div>
          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className="input pr-10"
                {...register('confirmPassword')}
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
            disabled={status === 'authenticating'}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {status === 'authenticating' ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> Signing up…
              </span>
            ) : (
              'Create Account'
            )}
          </button>
          {storeError && (
            <p className="text-red-700 text-sm mt-2">{storeError}</p>
          )}
          <p className="muted mt-4">
            Already have an account?{' '}
            <Link to="/signin" className="text-brand-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
