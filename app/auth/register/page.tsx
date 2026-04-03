'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import AuthLayout from '@/components/auth/AuthLayout';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms',
  }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mocking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser = {
        id: 2,
        name: data.name,
        email: data.email,
        role: 'user' as const,
        email_verified: false,
        created_at: new Date().toISOString(),
      };
      
      login(mockUser, 'mock-jwt-token-new');
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our community of elite readers."
      alternateLink={{ text: "Already a member?", href: "/auth/login", linkText: "Login here" }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium animate-in fade-in duration-300">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted ml-1 uppercase tracking-wider" htmlFor="name">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-accent transition-colors">
                <User size={18} />
              </div>
              <input
                {...register('name')}
                type="text"
                id="name"
                className={cn(
                  "w-full bg-bg-tertiary/50 border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all",
                  errors.name && "border-error focus:ring-error/50 focus:border-error"
                )}
                placeholder="Jane Doe"
              />
            </div>
            {errors.name && <p className="text-xs text-error font-medium mt-1 ml-1">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted ml-1 uppercase tracking-wider" htmlFor="email">Email Address</label>
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted ml-1 uppercase tracking-wider" htmlFor="password">Password</label>
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
                placeholder="Min 8 characters"
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

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted ml-1 uppercase tracking-wider" htmlFor="password_confirmation">Confirm Password</label>
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
                  errors.password_confirmation && "border-error focus:ring-error/50 focus:border-error"
                )}
                placeholder="••••••••"
              />
            </div>
            {errors.password_confirmation && <p className="text-xs text-error font-medium mt-1 ml-1">{errors.password_confirmation.message}</p>}
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3 mt-4">
          <input
            {...register('terms')}
            type="checkbox"
            id="terms"
            className="mt-1.5 w-4 h-4 rounded border-border bg-bg-tertiary text-accent focus:ring-accent accent-accent"
          />
          <label htmlFor="terms" className="text-sm text-text-muted leading-relaxed">
            I agree to the <span className="text-white hover:underline cursor-pointer">Terms of Service</span> and <span className="text-white hover:underline cursor-pointer">Privacy Policy</span>.
          </label>
        </div>
        {errors.terms && <p className="text-xs text-error font-medium ml-1">{errors.terms.message}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent text-bg-primary font-bold py-4 rounded-xl hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-accent/10 mt-6"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Sparkles size={20} /> Join the Sanctuary
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
