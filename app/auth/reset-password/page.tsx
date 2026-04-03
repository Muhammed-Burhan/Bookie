'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import AuthLayout from '@/components/auth/AuthLayout';
import { Lock, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
});

type FormValues = z.infer<typeof schema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setError: setFieldError, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.resetPassword({ token, email, password: data.password, password_confirmation: data.password_confirmation });
      setDone(true);
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      if (err.response?.status === 422) {
        const fieldErrors = err.response.data?.errors ?? {};
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          setFieldError(field as keyof FormValues, { message: (messages as string[])[0] });
        });
      } else {
        setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout
        title="Password Reset"
        subtitle="Your password has been updated."
        alternateLink={{ text: "Continue to", href: "/auth/login", linkText: "Sign in" }}
      >
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success">
            <CheckCircle2 size={40} />
          </div>
          <p className="text-text-muted text-sm text-center">Redirecting you to login...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Choose a new password for your account."
      alternateLink={{ text: "Back to", href: "/auth/login", linkText: "Sign in" }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-muted ml-1" htmlFor="password">New Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-accent transition-colors">
                <Lock size={18} />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={cn(
                  "w-full bg-bg-tertiary/50 border border-border rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all",
                  errors.password && "border-error"
                )}
                placeholder="Min 8 characters"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-error font-medium ml-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-muted ml-1" htmlFor="password_confirmation">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-accent transition-colors">
                <Lock size={18} />
              </div>
              <input
                {...register('password_confirmation')}
                type={showPassword ? 'text' : 'password'}
                id="password_confirmation"
                className={cn(
                  "w-full bg-bg-tertiary/50 border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all",
                  errors.password_confirmation && "border-error"
                )}
                placeholder="••••••••"
              />
            </div>
            {errors.password_confirmation && <p className="text-xs text-error font-medium ml-1">{errors.password_confirmation.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent text-bg-primary font-bold py-4 rounded-xl hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-accent/10"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Set New Password'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
