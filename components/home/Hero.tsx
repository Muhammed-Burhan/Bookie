'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background with cinematic lighting */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[128px]" />
        
        {/* Abstract book-like lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-sm font-bold tracking-tight uppercase"
          >
            <Sparkles size={14} />
            The Future of Literary Discovery
          </motion.div>

          {/* Epic Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-playfair font-black text-white leading-[1.1] tracking-tight max-w-5xl"
          >
            Your Reading Journey, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-hover to-warm-gold animate-gradient">
              Intelligently Reimagined.
            </span>
          </motion.h1>

          {/* Subtext with perfect spacing */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed font-medium"
          >
            Bookie isn't just a rating platform. It's a sanctuary where AI understands your 
            literary soul, helping you discover books you didn't know you needed.
          </motion.p>

          {/* CTA Group with high-end effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-6"
          >
            <Link
              href="/rating/interview"
              className="group relative px-8 py-4 bg-accent text-bg-primary font-bold rounded-xl overflow-hidden shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-2 text-lg">
                Start AI Interview <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/search"
              className="px-8 py-4 bg-bg-tertiary/50 backdrop-blur-xl border border-white/10 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-bg-tertiary transition-colors"
            >
              <BookOpen size={20} /> Browse Library
            </Link>
          </motion.div>

          {/* Stats / Proof section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/5 mt-12"
          >
            {[
              { label: 'Books Rated', value: '250K+' },
              { label: 'AI Accuracy', value: '98.5%' },
              { label: 'Active Readers', value: '15K+' },
              { label: 'Daily Reviews', value: '1.2K' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl font-jetbrains font-bold text-white">{stat.value}</span>
                <span className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
      
      {/* Scroll indicator with subtle animation */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-accent/50 to-transparent" />
        <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Explore</span>
      </motion.div>
    </section>
  );
}
