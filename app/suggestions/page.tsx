'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Loader2, BookOpen, X, Check } from 'lucide-react';
import { suggestionsApi } from '@/lib/api/suggestions';
import { Suggestion } from '@/lib/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dismissing, setDismissing] = useState<number | null>(null);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const data = await suggestionsApi.list();
      setSuggestions(data.filter((s) => !s.is_dismissed));
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newSuggestions = await suggestionsApi.generate(5);
      setSuggestions(newSuggestions.filter((s) => !s.is_dismissed));
    } catch {
      // silently fail
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDismiss = async (id: number) => {
    setDismissing(id);
    try {
      await suggestionsApi.dismiss(id);
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // silently fail
    } finally {
      setDismissing(null);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await suggestionsApi.markRead(id);
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_read: true } : s))
      );
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-accent font-jetbrains font-bold text-sm tracking-widest uppercase"
            >
              <Sparkles size={16} /> Curated For You
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-playfair font-black text-white leading-tight"
            >
              Your <span className="text-accent">AI Suggestions</span>
            </motion.h1>
            <p className="text-text-muted text-lg max-w-lg leading-relaxed font-medium">
              Based on your reading history and ratings, our AI has curated these titles especially for you.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-bg-primary font-bold hover:bg-accent-hover transition-all disabled:opacity-50 shadow-lg shadow-accent/20"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            {isGenerating ? 'Generating...' : 'Generate New'}
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="animate-spin text-accent" size={48} />
            <p className="text-text-muted font-jetbrains text-xs uppercase tracking-[0.3em] animate-pulse">Calibrating your literary profile...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center space-y-6"
          >
            <div className="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted/20 border border-border">
              <BookOpen size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-playfair font-bold text-white">No suggestions yet</h3>
              <p className="text-text-muted max-w-sm">
                Rate some books first so our AI can learn your preferences, then generate suggestions.
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-8 py-4 bg-accent text-bg-primary font-bold rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Generate Suggestions
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {suggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "relative p-8 rounded-[32px] bg-bg-secondary border border-border shadow-xl overflow-hidden group transition-all",
                    suggestion.is_read && "opacity-60"
                  )}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[64px] group-hover:bg-accent/10 transition-all" />

                  <div className="relative z-10 space-y-6">
                    {/* Book Info */}
                    <div className="flex items-start gap-4">
                      {suggestion.book?.cover_url ? (
                        <div className="w-16 h-24 rounded-lg overflow-hidden border border-border flex-shrink-0 shadow-lg">
                          <img src={suggestion.book.cover_url} alt={suggestion.suggested_title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-24 rounded-lg bg-bg-tertiary border border-border flex-shrink-0 flex items-center justify-center">
                          <BookOpen size={24} className="text-text-muted/30" />
                        </div>
                      )}
                      <div className="space-y-1 flex-1 min-w-0">
                        <h3 className="font-playfair font-bold text-white text-lg leading-tight line-clamp-2">
                          {suggestion.suggested_title}
                        </h3>
                        <p className="text-sm text-text-muted">{suggestion.suggested_author}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {suggestion.genres.slice(0, 3).map((genre) => (
                            <span key={genre} className="px-2 py-0.5 rounded-md bg-bg-tertiary text-text-muted text-[10px] font-bold uppercase tracking-widest border border-border">
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <p className="text-sm text-text-muted leading-relaxed italic border-l-2 border-accent/30 pl-4">
                      "{suggestion.reason}"
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-4">
                      {suggestion.book ? (
                        <Link
                          href={`/books/${suggestion.book.id}`}
                          onClick={() => handleMarkRead(suggestion.id)}
                          className="flex-1 py-3 bg-accent text-bg-primary font-bold rounded-xl text-sm text-center hover:bg-accent-hover transition-all"
                        >
                          View Book
                        </Link>
                      ) : (
                        <div className="flex-1 py-3 bg-bg-tertiary text-text-muted font-bold rounded-xl text-sm text-center border border-border">
                          Not in catalog yet
                        </div>
                      )}
                      <button
                        onClick={() => handleDismiss(suggestion.id)}
                        disabled={dismissing === suggestion.id}
                        className="p-3 rounded-xl bg-bg-tertiary border border-border text-text-muted hover:text-error hover:border-error/30 transition-all disabled:opacity-50"
                        title="Dismiss"
                      >
                        {dismissing === suggestion.id ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
