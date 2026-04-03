'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth';
import AuthLayout from '@/components/auth/AuthLayout';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { isAuthenticated } = useAuthStore();

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!token) return;
    setStatus('loading');
    authApi.verifyEmail(token)
      .then((res) => {
        setMessage(res.message);
        setStatus('success');
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
        setStatus('error');
      });
  }, [token]);

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.resendVerification();
      setResent(true);
    } catch {
      // silently fail
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Email Verification"
      subtitle="Verify your email address to unlock all features."
      alternateLink={{ text: "Return to", href: "/", linkText: "Sanctuary" }}
    >
      <div className="flex flex-col items-center gap-8 py-8">
        {status === 'loading' && (
          <>
            <Loader2 className="animate-spin text-accent" size={48} />
            <p className="text-text-muted text-sm">Verifying your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success">
              <CheckCircle2 size={40} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-playfair font-bold text-white">Email Verified!</h3>
              <p className="text-text-muted text-sm">{message || 'Your account is now fully active.'}</p>
            </div>
            <Link
              href="/"
              className="px-8 py-4 bg-accent text-bg-primary font-bold rounded-xl hover:bg-accent-hover transition-all"
            >
              Enter Sanctuary
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-error/10 border border-error/20 flex items-center justify-center text-error">
              <XCircle size={40} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-playfair font-bold text-white">Verification Failed</h3>
              <p className="text-text-muted text-sm">{message}</p>
            </div>
            {isAuthenticated && (
              <button
                onClick={handleResend}
                disabled={resending || resent}
                className="px-8 py-4 bg-bg-tertiary border border-border text-white font-bold rounded-xl hover:bg-bg-secondary transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {resending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                {resent ? 'Email Sent!' : 'Resend Verification Email'}
              </button>
            )}
          </>
        )}

        {status === 'idle' && !token && (
          <>
            <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Mail size={40} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-playfair font-bold text-white">Check Your Email</h3>
              <p className="text-text-muted text-sm">We sent a verification link to your inbox. Click it to verify your account.</p>
            </div>
            {isAuthenticated && (
              <button
                onClick={handleResend}
                disabled={resending || resent}
                className="px-8 py-4 bg-bg-tertiary border border-border text-white font-bold rounded-xl hover:bg-bg-secondary transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {resending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                {resent ? 'Email Sent!' : 'Resend Verification Email'}
              </button>
            )}
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
