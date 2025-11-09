import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Spinner from '../components/ui/Spinner.tsx';
import { requestPasswordReset } from '../lib/auth.ts';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email'),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      await requestPasswordReset(values.email);
    } catch {
      // Intentionally swallow errors to avoid account enumeration
    } finally {
      toast.success('If that email exists, we sent a reset link.');
      navigate('/signin');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
        <p className="muted mb-4">
          Enter your email and well send you a link to reset your password.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          aria-label="Forgot password form"
        >
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
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
                <Spinner /> Sending link…
              </span>
            ) : (
              'Send reset link'
            )}
          </button>
          <p className="muted mt-4">
            Remembered it?{' '}
            <Link to="/signin" className="text-brand-600 hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
