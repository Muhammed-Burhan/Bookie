'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import RatingInterview from '@/components/rating/RatingInterview';
import { booksApi } from '@/lib/api/books';
import { Book } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowLeft, Share2, CheckCircle2, Loader2 } from 'lucide-react';
import { cn, formatScore, getRatingColorTheme } from '@/lib/utils';
import Link from 'next/link';

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = parseInt(searchParams.get('bookId') || '0');

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<{ score: number; explanation: string } | null>(null);

  useEffect(() => {
    if (!bookId) {
      router.push('/search');
      return;
    }
    booksApi.get(bookId)
      .then(setBook)
      .catch(() => router.push('/search'))
      .finally(() => setIsLoading(false));
  }, [bookId, router]);

  const handleComplete = (score: number, explanation: string) => {
    setResult({ score, explanation });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-accent" size={48} />
          <p className="text-text-muted font-jetbrains text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Literary Gateway...</p>
        </div>
      </div>
    );
  }

  if (!book) return null;

  if (result) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full relative p-12 rounded-[40px] bg-bg-secondary border border-border overflow-hidden glass shadow-2xl"
        >
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />

          <div className="relative z-10 space-y-12">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 border border-success/20 text-success font-jetbrains text-xs font-bold uppercase tracking-widest"
              >
                <CheckCircle2 size={14} /> Analysis Complete
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-playfair font-black text-white leading-tight">
                Your Bespoke Literary Score
              </h2>
            </div>

            {/* Score reveal */}
            <div className="relative flex items-center justify-center py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
                className="w-56 h-56 rounded-full border-8 border-bg-tertiary flex items-center justify-center relative overflow-hidden shadow-2xl shadow-accent/20"
              >
                <div className="absolute inset-2 border-2 border-dashed border-border rounded-full animate-slow-spin" />
                <div className="flex flex-col items-center">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className={cn("text-8xl font-jetbrains font-black leading-none", getRatingColorTheme(result.score))}
                  >
                    {formatScore(result.score)}
                  </motion.span>
                  <span className="text-sm font-bold text-text-muted mt-2 uppercase tracking-widest">Score / 10</span>
                </div>
              </motion.div>
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                  <Star className="text-accent fill-accent" size={20} /> AI Synthesis
                </h3>
                <p className="text-lg text-text-muted leading-relaxed font-medium">
                  "{result.explanation}"
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="flex flex-wrap items-center justify-center gap-4 pt-8"
              >
                <Link
                  href="/feed"
                  className="px-8 py-4 bg-accent text-bg-primary font-bold rounded-xl flex items-center gap-2 hover:bg-accent-hover transition-all"
                >
                  View in Feed
                </Link>
                <Link
                  href={`/books/${book.id}`}
                  className="px-8 py-4 bg-bg-tertiary border border-border text-white font-bold rounded-xl flex items-center gap-2 hover:bg-bg-secondary transition-all"
                >
                  Back to Book
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={() => router.push('/')}
          className="mt-12 flex items-center gap-2 text-text-muted hover:text-white font-bold transition-all"
        >
          <ArrowLeft size={20} /> Return to Sanctuary
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <Link
              href={`/books/${book.id}`}
              className="inline-flex items-center gap-2 text-text-muted hover:text-accent font-bold transition-all"
            >
              <ArrowLeft size={20} /> Exit Interview
            </Link>
            <h1 className="text-4xl md:text-5xl font-playfair font-black text-white leading-tight">
              Begin Your <span className="text-accent">Semantic Analysis</span>
            </h1>
            <p className="text-text-muted max-w-xl text-lg font-medium">
              We'll guide you through a series of introspective questions designed to translate your reading experience into data.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-6 p-6 rounded-3xl bg-bg-secondary border border-border glass max-w-sm">
            <div className="w-24 h-32 rounded-lg overflow-hidden border border-border flex-shrink-0">
              {book.cover_url && (
                <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-white leading-tight">{book.title}</h4>
              <p className="text-xs text-text-muted font-jetbrains">{book.author}</p>
              <div className="flex items-center gap-1 text-accent pt-2">
                <Star size={14} className="fill-accent" />
                <span className="text-xs font-bold uppercase tracking-widest">Community: {formatScore(book.average_rating)}</span>
              </div>
            </div>
          </div>
        </div>

        <RatingInterview book={book} onComplete={handleComplete} />
      </div>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-accent" size={48} />
          <p className="text-text-muted font-jetbrains text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Literary Gateway...</p>
        </div>
      </div>
    }>
      <InterviewContent />
    </Suspense>
  );
}
