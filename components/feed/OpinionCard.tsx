'use client';

import { motion } from 'framer-motion';
import { 
  MessageCircle, Heart, Share2, 
  Sparkles, ExternalLink, ShieldCheck, 
  Star, Quote 
} from 'lucide-react';
import { cn, formatScore, getRatingColorTheme } from '@/lib/utils';
import { Book, User, Opinion } from '@/lib/types';
import Link from 'next/link';

interface OpinionCardProps {
  opinion: Opinion;
}

export default function OpinionCard({ opinion }: OpinionCardProps) {
  const { user, book, content, likes_count, is_liked, created_at } = opinion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative p-8 rounded-[32px] bg-bg-secondary border border-border shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden glass"
    >
      {/* Visual Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[64px] group-hover:bg-accent/10 transition-all" />
      
      <div className="flex flex-col gap-8 relative z-10">
        {/* User & Meta Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-bg-tertiary border border-border overflow-hidden ring-4 ring-bg-primary/50 group-hover:ring-accent/20 transition-all">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-accent bg-bg-tertiary font-playfair">
                  {user?.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-white text-lg group-hover:text-accent transition-colors">
                {user?.name}
              </h4>
              <p className="text-xs text-text-muted font-jetbrains uppercase tracking-widest">
                Elite Curator • {new Date(created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-bold uppercase tracking-[0.15em]">
               <ShieldCheck size={12} /> Verified Rating
             </div>
             <span className="text-[10px] text-text-muted/50 font-jetbrains pr-1">Ref ID: Cur-{opinion.id}</span>
          </div>
        </div>

        {/* Book Card Snippet */}
        <Link 
          href={`/books/${book?.id}`}
          className="flex items-center gap-6 p-5 rounded-2xl bg-bg-primary/50 border border-border/50 group/book hover:bg-bg-tertiary/50 transition-all"
        >
          <div className="w-20 h-28 rounded-lg overflow-hidden border border-border shadow-lg flex-shrink-0">
            <img src={book?.cover_url} alt={book?.title} className="w-full h-full object-cover group-hover/book:scale-110 transition-transform duration-700" />
          </div>
          <div className="space-y-2">
            <h5 className="font-playfair font-bold text-white leading-tight group-hover/book:text-accent">
              {book?.title}
            </h5>
            <p className="text-sm text-text-muted">{book?.author}</p>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1 text-accent">
                <Star size={14} className="fill-accent" />
                <span className="text-sm font-jetbrains font-bold">{formatScore(book?.average_rating)}</span>
              </div>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold opacity-50">Global Score</span>
            </div>
          </div>
          <ExternalLink size={18} className="ml-auto text-text-muted opacity-0 group-hover/book:opacity-100 transition-opacity" />
        </Link>

        {/* Opinion Content */}
        <div className="relative space-y-6">
          <Quote className="absolute -top-4 -left-4 text-accent/10 pointer-events-none" size={64} />
          <p className="text-lg text-text-muted leading-relaxed font-italic relative z-10">
            "{content}"
          </p>
          
          {/* AI Score Tag */}
          <div className="inline-flex items-center gap-3 p-4 rounded-xl bg-bg-tertiary/50 border border-border">
             <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
               <Sparkles size={18} />
             </div>
             <div>
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Bespoke AI Score</p>
               <p className={cn(
                 "text-xl font-jetbrains font-black mt-1",
                 getRatingColorTheme(book?.average_rating || 0)
               )}>
                 {formatScore(book?.average_rating || 0)}
               </p>
             </div>
          </div>
        </div>

        {/* Interactions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
           <div className="flex items-center gap-6">
             <button className={cn(
               "flex items-center gap-2 group/btn transition-colors",
               is_liked ? "text-error" : "text-text-muted hover:text-error"
             )}>
               <div className="p-2.5 rounded-full bg-transparent group-hover/btn:bg-error/10 transition-colors">
                 <Heart size={20} className={is_liked ? "fill-current" : ""} />
               </div>
               <span className="text-sm font-bold">{likes_count}</span>
             </button>
             
             <button className="flex items-center gap-2 group/btn text-text-muted hover:text-accent transition-colors">
               <div className="p-2.5 rounded-full bg-transparent group-hover/btn:bg-accent/10 transition-colors">
                 <MessageCircle size={20} />
               </div>
               <span className="text-sm font-bold">Reply</span>
             </button>
           </div>

           <button className="p-2.5 rounded-full bg-transparent text-text-muted hover:text-white hover:bg-white/5 transition-all">
             <Share2 size={20} />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
