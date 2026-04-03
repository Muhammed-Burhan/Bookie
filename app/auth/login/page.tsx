'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { authApi } from '@/lib/api/auth';
import AuthLayout from '@/components/auth/AuthLayout';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: true },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authApi.login({
        email: data.email,
        password: data.password,
        revoke_previous: data.remember,
      });
      login(result.user, result.token);
      const next = searchParams.get('next') || (result.user.role === 'admin' ? '/admin/dashboard' : '/');
      router.push(next);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 422) {
        const fieldErrors = err.response.data?.errors ?? {};
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          setFieldError(field as keyof LoginFormValues, {
            message: (messages as string[])[0],
          });
        });
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your details to access your sanctuary."
      alternateLink={{ text: "Don't have an account?", href: "/auth/register", linkText: "Join Bookie" }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium animate-in fade-in duration-300">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Email Field */}
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

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-text-muted" htmlFor="password">Password</label>
              <Link href="/auth/forgot-password" className="text-xs font-bold text-accent hover:text-accent-hover transition-colors">
                Forgot password?
              </Link>
            </div>
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
                  errors.password && "border-error focus:ring-error/50 focus:border-error"
                )}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-error font-medium mt-1 ml-1">{errors.password.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent text-bg-primary font-bold py-4 rounded-xl hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-accent/10"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Enter Sanctuary'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
