'use client';

import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import BookCard from '../books/BookCard';
import { MOCK_BOOKS } from '@/lib/mock-data';

export default function Trending() {
  const trendingBooks = MOCK_BOOKS.slice(0, 4);

  return (
    <section className="py-24 bg-bg-primary relative overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-accent font-jetbrains font-bold text-sm tracking-widest uppercase"
            >
              <TrendingUp size={16} /> Curated for Excellence
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-playfair font-black text-white tracking-tight"
            >
              Trending This Week
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/search"
              className="group flex items-center gap-2 text-text-muted hover:text-accent font-bold transition-all"
            >
              Discover full collection <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>

        {/* Feature Teaser */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-12 rounded-3xl bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border/50 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] group-hover:bg-accent/10 transition-colors" />
          
          <div className="relative z-10 grid md:grid-cols-2 items-center gap-12">
            <div className="space-y-6 text-left">
              <h3 className="text-3xl md:text-4xl font-playfair font-bold text-white leading-tight">
                Not sure what to read next? <br />
                <span className="text-accent underline underline-offset-8 decoration-accent/30">Let our AI guide you.</span>
              </h3>
              <p className="text-text-muted text-lg max-w-md font-medium">
                The Rating Interview analyzes your subconscious literary preferences to provide 
                recommendations that actually resonate.
              </p>
              <Link
                href="/rating/interview"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-bg-primary font-bold rounded-xl active:scale-[0.98] transition-all shadow-xl shadow-accent/10"
              >
                Start Your Interview <TrendingUp size={20} />
              </Link>
            </div>
            
            <div className="hidden md:flex relative justify-center">
              <div className="w-64 h-48 rounded-2xl bg-white/5 border border-white/10 glass rotate-3 animate-float flex items-center justify-center">
                <span className="text-accent font-jetbrains text-4xl font-black">98.5%</span>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-32 rounded-2xl bg-accent text-bg-primary -rotate-6 flex flex-col items-center justify-center font-bold">
                <span className="text-sm uppercase tracking-tighter">AI Accuracy</span>
                <span className="text-xs opacity-80">(Beta)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
