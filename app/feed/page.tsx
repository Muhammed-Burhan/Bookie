'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Sparkles, Filter, 
  Search, SlidersHorizontal, Loader2,
  TrendingUp, Star, LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import OpinionCard from '@/components/feed/OpinionCard';
import { MOCK_BOOKS } from '@/lib/mock-data';
import { Opinion, User } from '@/lib/types';
import Link from 'next/link';

const MOCK_USER: User = {
  id: 1,
  name: "Alexander Vance",
  email: "alex@example.com",
  role: 'user',
  avatar: "https://images.unsplash.com/photo-1543005814-14b24e1fabb0",
  email_verified: true,
  created_at: new Date().toISOString()
};

const MOCK_OPINIONS: Opinion[] = [
  {
    id: 1,
    user_id: 1,
    book_id: 1,
    content: "The Shadow of the Wind is more than a book; it's a love letter to literature. The Cemetery of Forgotten Books will stay with me forever. The AI analysis perfectly captured my sense of nostalgia.",
    contains_spoilers: false,
    likes_count: 142,
    is_liked: true,
    created_at: new Date().toISOString(),
    user: MOCK_USER,
    book: MOCK_BOOKS[0]
  },
  {
    id: 2,
    user_id: 2,
    book_id: 3,
    content: "Dune's political layering is unmatched. I finally understand why the AI rated my experience so highly after I expressed my fascination with the ecology of Arrakis.",
    contains_spoilers: false,
    likes_count: 89,
    is_liked: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user: { ...MOCK_USER, name: "Elena Rossi", id: 2 },
    book: MOCK_BOOKS[2]
  },
  {
    id: 3,
    user_id: 3,
    book_id: 5,
    content: "1984 is as terrifying today as it was when it was written. The AI Rating Interview really made me think about the modern parallels in surveillance capitalism.",
    contains_spoilers: false,
    likes_count: 256,
    is_liked: false,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    user: { ...MOCK_USER, name: "Marcus Thorne", id: 3 },
    book: MOCK_BOOKS[4]
  }
];

export default function SocialFeedPage() {
  const [opinions, setOpinions] = useState<Opinion[]>(MOCK_OPINIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('All');

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

        {/* Global Stats bar */}
        <div className="p-8 rounded-[40px] bg-bg-secondary/30 border border-white/5 glass grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="flex flex-col items-center text-center space-y-1">
             <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Daily Opinions</span>
             <span className="text-2xl font-jetbrains font-black text-white">1,240+</span>
             <div className="flex items-center gap-1 text-success text-[10px] font-bold">
               <TrendingUp size={12} /> +12% Rise
             </div>
           </div>
           <div className="flex flex-col items-center text-center space-y-1 border-x border-white/5">
             <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">AI Synthesis Rate</span>
             <span className="text-2xl font-jetbrains font-black text-white">99.2%</span>
             <div className="flex items-center gap-1 text-accent text-[10px] font-bold uppercase tracking-widest leading-none pt-1">
               <Sparkles size={12} /> Real-time
             </div>
           </div>
           <div className="flex flex-col items-center text-center space-y-1">
             <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Verified Readers</span>
             <span className="text-2xl font-jetbrains font-black text-white">15,800</span>
             <div className="flex items-center gap-1 text-text-muted/50 text-[10px] font-bold uppercase tracking-widest leading-none pt-1">
               <LayoutGrid size={12} /> Active Now
             </div>
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
              <div className="flex flex-col gap-12">
                {opinions.map((opinion, index) => (
                  <OpinionCard key={opinion.id} opinion={opinion} />
                ))}
              </div>
            </AnimatePresence>
          )}

          {/* End of Feed / Load More */}
          {!isLoading && (
            <div className="pt-20 flex flex-col items-center text-center space-y-6">
               <div className="w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center text-text-muted">
                 <Sparkles size={20} className="animate-pulse" />
               </div>
               <div className="space-y-1">
                 <h4 className="text-white font-bold">The Echoes continue.</h4>
                 <p className="text-xs text-text-muted font-jetbrains uppercase tracking-widest">End of the current semantic stream</p>
               </div>
               <button className="px-10 py-4 bg-bg-tertiary/50 border border-border text-white text-sm font-bold rounded-2xl hover:bg-bg-tertiary transition-all">
                 Re-synchronize Feed
               </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
