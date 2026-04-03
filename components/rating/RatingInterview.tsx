'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InterviewMessage, Book, Rating } from '@/lib/types';
import { ratingsApi } from '@/lib/api/ratings';

interface RatingInterviewProps {
  book: Book;
  onComplete: (score: number, explanation: string) => void;
}

export default function RatingInterview({ book, onComplete }: RatingInterviewProps) {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [ratingId, setRatingId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Start the interview on mount
  useEffect(() => {
    const startInterview = async () => {
      setIsTyping(true);
      try {
        const rating = await ratingsApi.start(book.id);
        setRatingId(rating.id);
        if (rating.current_question) {
          setMessages([{ role: 'assistant', content: rating.current_question }]);
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Failed to start interview. Please try again.';
        setError(msg);
      } finally {
        setIsTyping(false);
      }
    };
    startInterview();
  }, [book.id]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping || !ratingId) return;

    const userMessage: InterviewMessage = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const updated = await ratingsApi.answer(ratingId, userMessage.content);

      if (updated.is_completed) {
        setIsCompleted(true);
        // Finalize and get score
        const final = await ratingsApi.complete(ratingId);
        setTimeout(() => {
          onComplete(final.score ?? 0, final.ai_explanation ?? '');
        }, 1500);
      } else if (updated.current_question) {
        setMessages((prev) => [...prev, { role: 'assistant', content: updated.current_question! }]);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4 text-center">
        <p className="text-error font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-bg-secondary rounded-3xl border border-border shadow-2xl overflow-hidden glass">
      {/* Header */}
      <div className="p-6 border-b border-border bg-bg-tertiary/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-playfair font-bold text-white">AI Rating Interview</h3>
            <p className="text-xs text-text-muted font-jetbrains uppercase tracking-wider">Analyzing: {book.title}</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-bold uppercase tracking-widest">
          Live Analysis
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                msg.role === 'user' ? "bg-accent text-bg-primary" : "bg-bg-tertiary border border-border text-text-muted"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user'
                  ? "bg-accent/10 border border-accent/20 text-white"
                  : "bg-bg-tertiary/50 border border-border/50 text-text-muted"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-bg-tertiary border border-border flex items-center justify-center">
                <Bot size={16} className="text-text-muted" />
              </div>
              <div className="flex items-center gap-1 p-4 bg-bg-tertiary/30 rounded-2xl border border-border/30">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}

          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center text-success animate-pulse">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-playfair font-bold text-white">Interview Concluded</h4>
                <p className="text-text-muted max-w-sm">Calculating your bespoke literary score based on your unique sentiments...</p>
              </div>
              <Loader2 className="animate-spin text-accent" size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      {!isCompleted && (
        <div className="p-6 bg-bg-tertiary/30 border-t border-border">
          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Share your thoughts..."
              disabled={isTyping || !ratingId}
              className="w-full bg-bg-tertiary border border-border rounded-xl py-4 pl-6 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all group-hover:border-border-hover disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping || !ratingId}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-accent text-bg-primary hover:bg-accent-hover active:scale-95 transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-text-muted/50 mt-3 text-center uppercase tracking-[0.2em]">
            Powered by Bookie Semantic Engine
          </p>
        </div>
      )}
    </div>
  );
}
