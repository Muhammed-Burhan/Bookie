'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Loader2, TrendingUp, LayoutGrid
} from 'lucide-react';
import OpinionCard from '@/components/feed/OpinionCard';
import { opinionsApi } from '@/lib/api/opinions';
import { Opinion } from '@/lib/types';
import Link from 'next/link';

export default function SocialFeedPage() {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadOpinions = async (page = 1) => {
    if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const result = await opinionsApi.list({ sort: 'recent', page });
      if (page === 1) {
        setOpinions(result.data);
      } else {
        setOpinions((prev) => [...prev, ...result.data]);
      }
      setCurrentPage(result.current_page);
      setLastPage(result.last_page);
    } catch {
      // silently fail — show empty state
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadOpinions(1);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Feed Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-accent font-jetbrains font-bold text-sm tracking-widest uppercase"
            >
              <Sparkles size={16} /> The Collective Resonance
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-playfair font-black text-white leading-tight"
            >
              Discover Global <span className="text-accent">Echoes</span>
            </motion.h1>
            <p className="text-text-muted text-lg max-w-lg leading-relaxed font-medium">
              Explore the semantic reflections of our most discerning readers.
              Find your next soul-shaping narrative through the collective mind.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className="px-6 py-3 rounded-full bg-bg-tertiary border border-border text-white text-sm font-bold hover:bg-bg-secondary transition-all"
            >
              Find a Book
            </Link>
            <Link
              href="/rating/interview"
              className="px-6 py-3 rounded-full bg-accent text-bg-primary text-sm font-bold shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
            >
              Start Rating
            </Link>
          </div>
        </div>

        {/* Feed Content */}
        <div className="space-y-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <Loader2 className="animate-spin text-accent" size={48} />
              <p className="text-text-muted font-jetbrains text-xs uppercase tracking-[0.3em] animate-pulse">Syncing semantic streams...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {opinions.length > 0 ? (
                <div className="flex flex-col gap-12">
                  {opinions.map((opinion) => (
                    <OpinionCard key={opinion.id} opinion={opinion} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                  <LayoutGrid size={48} className="text-text-muted/20" />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-playfair font-bold text-white">No opinions yet</h3>
                    <p className="text-text-muted">Be the first to rate a book and share your thoughts.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          )}

          {/* Load More */}
          {!isLoading && currentPage < lastPage && (
            <div className="pt-10 flex justify-center">
              <button
                onClick={() => loadOpinions(currentPage + 1)}
                disabled={isLoadingMore}
                className="px-10 py-4 bg-bg-tertiary/50 border border-border text-white text-sm font-bold rounded-2xl hover:bg-bg-tertiary transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isLoadingMore ? <Loader2 size={16} className="animate-spin" /> : null}
                Load More Echoes
              </button>
            </div>
          )}

          {!isLoading && opinions.length > 0 && currentPage >= lastPage && (
            <div className="pt-20 flex flex-col items-center text-center space-y-6">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center text-text-muted">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-bold">The Echoes continue.</h4>
                <p className="text-xs text-text-muted font-jetbrains uppercase tracking-widest">End of the current semantic stream</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
