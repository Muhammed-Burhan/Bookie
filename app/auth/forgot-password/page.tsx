'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api/auth';
import AuthLayout from '@/components/auth/AuthLayout';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword(data.email);
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        title="Check Your Inbox"
        subtitle="We've sent a password reset link to your email."
        alternateLink={{ text: "Back to login", href: "/auth/login", linkText: "Sign in" }}
      >
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success">
            <CheckCircle2 size={40} />
          </div>
          <p className="text-text-muted text-center text-sm leading-relaxed">
            If an account with that email exists, you'll receive a reset link shortly. Check your spam folder if you don't see it.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a reset link."
      alternateLink={{ text: "Remember your password?", href: "/auth/login", linkText: "Sign in" }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-muted ml-1" htmlFor="email">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-accent transition-colors">
              <Mail size={18} />
            </div>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={cn(
                "w-full bg-bg-tertiary/50 border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all",
                errors.email && "border-error focus:ring-error/50 focus:border-error"
              )}
              placeholder="jane@example.com"
            />
          </div>
          {errors.email && <p className="text-xs text-error font-medium mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent text-bg-primary font-bold py-4 rounded-xl hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-accent/10"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
        </button>
      </form>
    </AuthLayout>
  );
}
