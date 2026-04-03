'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star, ArrowLeft, Bookmark, Share2,
  MessageCircle, Sparkles, BookOpen,
  Calendar, Layers, ShieldCheck, Loader2
} from 'lucide-react';
import { cn, formatScore } from '@/lib/utils';
import { booksApi } from '@/lib/api/books';
import { opinionsApi } from '@/lib/api/opinions';
import { Book, Opinion } from '@/lib/types';
import Link from 'next/link';
import OpinionCard from '@/components/feed/OpinionCard';

export default function BookDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const [book, setBook] = useState<Book | null>(null);
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [bookData, opinionsData] = await Promise.all([
          booksApi.get(id),
          booksApi.getOpinions(id, { sort: 'popular' }),
        ]);
        setBook(bookData);
        setOpinions(opinionsData.data);
      } catch {
        // handle error — book not found
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-accent" size={48} />
          <p className="text-text-muted font-jetbrains text-xs uppercase tracking-[0.3em] animate-pulse">Loading tome...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen size={64} className="mx-auto text-text-muted/20" />
          <h2 className="text-2xl font-playfair font-bold text-white">Book not found</h2>
          <Link href="/search" className="text-accent hover:underline">Back to Library</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {/* Cinematic Header / Backdrop */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-110"
          style={{ backgroundImage: `url(${book.cover_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent" />
        <div className="absolute inset-0 backdrop-blur-3xl opacity-40" />

        {/* Navigation Overlays */}
        <div className="absolute top-32 left-6 md:left-12 z-20">
          <Link
            href="/search"
            className="group flex items-center gap-2 text-white/50 hover:text-accent font-bold transition-all"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Library
          </Link>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 -mt-64 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-20">

          {/* Left Column: Cover & Stats */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-b from-accent/20 to-transparent rounded-[32px] blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-[28px] overflow-hidden border border-border shadow-2xl aspect-[3/4]">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-bg-secondary flex items-center justify-center">
                    <BookOpen size={64} className="text-text-muted/20" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-bg-secondary border border-border glass text-center">
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Readers</p>
                <p className="text-xl font-jetbrains font-bold text-white">{book.ratings_count.toLocaleString()}</p>
              </div>
              <div className="p-6 rounded-2xl bg-bg-secondary border border-border glass text-center">
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Rating</p>
                <div className="flex items-center justify-center gap-1 text-accent font-jetbrains font-bold text-xl">
                  <Star size={16} className="fill-accent" /> {formatScore(book.average_rating)}
                </div>
              </div>
            </div>

            {/* AI Call to Action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-8 rounded-[32px] bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-accent/20 space-y-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl group-hover:bg-accent/10 transition-all" />
              <h4 className="text-xl font-playfair font-bold text-white leading-tight">
                Craft your bespoke analysis.
              </h4>
              <p className="text-sm text-text-muted font-medium leading-relaxed">
                Our semantic engine awaits your insights. Start a guided interview to define this book's place in your library.
              </p>
              <Link
                href={`/rating/interview?bookId=${book.id}`}
                className="flex items-center justify-center gap-2 w-full py-4 bg-accent text-bg-primary font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/10"
              >
                <Sparkles size={18} /> Rate with AI
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Content */}
          <div className="space-y-12 py-12">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest">
                  Sanctuary Elite
                </span>
                {book.isbn && (
                  <span className="text-text-muted font-jetbrains text-sm">ISBN: {book.isbn}</span>
                )}
              </motion.div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-playfair font-black text-white tracking-tight leading-[1.1]">
                  {book.title}
                </h1>
                <p className="text-2xl md:text-3xl text-text-muted font-medium">
                  by <span className="text-white">{book.author}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl border font-bold transition-all",
                  isBookmarked
                    ? "bg-accent/20 border-accent text-accent"
                    : "bg-bg-tertiary/50 border-border text-white hover:bg-bg-tertiary"
                )}
              >
                <Bookmark size={18} className={isBookmarked ? "fill-accent" : ""} />
                {isBookmarked ? "Saved to Library" : "Save for Later"}
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-bg-tertiary/50 border border-border text-white font-bold hover:bg-bg-tertiary transition-all">
                <Share2 size={18} /> Share
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border/50 pt-12">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-accent" size={20} /> Synopsis
                </h3>
                <p className="text-lg text-text-muted leading-relaxed font-medium">
                  {book.description || `The story of ${book.title} remains one of the most compelling narratives in modern literature.`}
                </p>
              </div>

              <div className="space-y-8">
                {book.subjects && book.subjects.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Layers className="text-accent" size={20} /> Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {book.subjects.map(subject => (
                        <span key={subject} className="px-3 py-1.5 rounded-lg bg-bg-tertiary text-text-muted text-sm border border-border">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="text-accent" size={20} /> Metadata
                  </h3>
                  <div className="space-y-3">
                    {book.first_publish_year && (
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-text-muted">First Published</span>
                        <span className="text-white font-jetbrains">{book.first_publish_year}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-text-muted">Digital Identifier</span>
                      <span className="text-white font-jetbrains">{book.openlibrary_key}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opinions Section */}
            <div className="border-t border-border/50 pt-16 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-playfair font-bold text-white flex items-center gap-3">
                  <MessageCircle className="text-accent" size={24} /> Community Echoes
                </h3>
              </div>

              {opinions.length > 0 ? (
                <div className="space-y-8">
                  {opinions.map((opinion) => (
                    <OpinionCard key={opinion.id} opinion={opinion} />
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-bg-secondary/40 border border-border/50 text-center space-y-4">
                  <p className="text-text-muted font-medium italic">
                    No opinions yet. Be the first to share your thoughts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
