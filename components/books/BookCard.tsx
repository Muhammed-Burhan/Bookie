'use client';

import Link from 'next/link';
import { Book as BookType } from '@/lib/types';
import { Star, ArrowRight } from 'lucide-react';
import { cn, formatScore, getRatingColorTheme } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BookCardProps {
  book: BookType;
  priority?: boolean;
}

export default function BookCard({ book, priority = false }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col bg-bg-secondary border border-border rounded-2xl overflow-hidden hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500"
    >
      {/* Cover Image Wrapper */}
      <div className="relative aspect-[3/4] overflow-hidden bg-bg-tertiary">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading={priority ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-text-muted">
            <Star className="w-12 h-12 mb-4 opacity-20" />
            <span className="text-xs font-medium uppercase tracking-widest opacity-40">No Cover Available</span>
          </div>
        )}

        {/* Floating Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Quick Action Button */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Link 
            href={`/books/${book.openlibrary_key}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-bg-primary font-bold rounded-xl text-sm shadow-xl"
          >
            Review Book <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-playfair text-lg font-bold text-white line-clamp-1 group-hover:text-accent transition-colors">
            {book.title}
          </h3>
          <div className="flex flex-col items-end">
            <span className={cn("font-mono text-sm font-bold flex items-center gap-1", getRatingColorTheme(book.average_rating))}>
              {formatScore(book.average_rating)}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-text-muted font-medium line-clamp-1">
          by <span className="text-text-primary/70">{book.author}</span>
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-text-muted">
            <div className="w-1 h-1 rounded-full bg-accent" />
            {book.ratings_count} Reviews
          </div>
          {book.first_publish_year && (
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-text-muted">
              <div className="w-1 h-1 rounded-full bg-border" />
              {book.first_publish_year}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
