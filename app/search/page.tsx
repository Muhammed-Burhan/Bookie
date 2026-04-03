'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Filter, X, SlidersHorizontal, BookOpen, Star, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import BookCard from '@/components/books/BookCard';
import { MOCK_BOOKS } from '@/lib/mock-data';

const GENRES = [
  'All Genres', 'Fiction', 'Fantasy', 'Sci-Fi', 'Mystery', 
  'Mystery', 'Romance', 'Historical', 'Dystopian', 'Non-Fiction'
];

const SORT_OPTIONS = [
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Newest Arrivals', value: 'newest' },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Filter logic
  const filteredBooks = MOCK_BOOKS.filter(book => {
    const matchesQuery = book.title.toLowerCase().includes(query.toLowerCase()) || 
                         book.author.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = selectedGenre === 'All Genres' || 
                         book.description?.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesQuery && matchesGenre;
  });

  // Sort logic
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'rating') return b.average_rating - a.average_rating;
    if (sortBy === 'popular') return b.ratings_count - a.ratings_count;
    return b.id - a.id; // Newest by ID
  });

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header & Search Bar */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-playfair font-black text-white leading-tight">
              Explore the <span className="text-accent underline decoration-accent/20">Omniscience Library</span>
            </h1>
            <p className="text-text-muted text-lg max-w-2xl font-medium">
              Dive into our curated collection of legendary narratives and 
              let curiosity be your only compass.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-text-muted group-focus-within:text-accent transition-colors">
                <SearchIcon size={22} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, or ISBN..."
                className="w-full bg-bg-secondary border border-border rounded-2xl py-5 pl-16 pr-6 text-white text-lg placeholder:text-text-muted/40 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all glass shadow-2xl"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-8 py-5 rounded-2xl font-bold transition-all border shadow-lg",
                showFilters 
                  ? "bg-accent text-bg-primary border-accent" 
                  : "bg-bg-secondary text-white border-border hover:bg-bg-tertiary"
              )}
            >
              <SlidersHorizontal size={20} />
              Filters {filteredBooks.length < MOCK_BOOKS.length && `(${filteredBooks.length})`}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
          
          {/* Filters Sidebar (Desktop) */}
          <aside className={cn(
            "lg:block space-y-10 animate-in fade-in duration-500",
            showFilters ? "block" : "hidden"
          )}>
            <div className="space-y-6 p-8 rounded-3xl bg-bg-secondary/50 border border-border glass relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[50px]" />
              
              <div className="space-y-4 relative z-10">
                <h4 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                  <Filter size={14} /> Literary Genre
                </h4>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {GENRES.map(genre => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={cn(
                        "text-left px-4 py-2 rounded-xl text-sm font-bold transition-all",
                        selectedGenre === genre 
                          ? "bg-accent/10 text-accent border border-accent/20" 
                          : "text-text-muted hover:text-white hover:bg-bg-tertiary"
                      )}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-border/50" />

              <div className="space-y-4 relative z-10">
                <h4 className="text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                  <ArrowUpDown size={14} /> Sort Results
                </h4>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={cn(
                        "text-left px-4 py-2 rounded-xl text-sm font-bold transition-all",
                        sortBy === opt.value 
                          ? "bg-accent/10 text-accent border border-accent/20" 
                          : "text-text-muted hover:text-white hover:bg-bg-tertiary"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-accent text-bg-primary font-bold text-center space-y-2 group cursor-pointer overflow-hidden relative">
               <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
               <p className="relative text-sm tracking-tight">Need a guided journey?</p>
               <Link href="/rating/interview" className="relative flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-black">
                 Start AI Rating <Star size={14} className="fill-bg-primary" />
               </Link>
            </div>
          </aside>

          {/* Results Grid */}
          <section className="space-y-8">
            <div className="flex items-center justify-between text-text-muted font-bold text-sm uppercase tracking-widest px-2">
              <span>{sortedBooks.length} Books Found</span>
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="text-accent hover:underline flex items-center gap-1"
                >
                  Clear search <X size={14} />
                </button>
              )}
            </div>

            <AnimatePresence mode="popLayout">
              {sortedBooks.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {sortedBooks.map((book) => (
                    <motion.div
                      key={book.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BookCard book={book} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-32 text-center space-y-6"
                >
                  <div className="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted/20 border border-border">
                    <BookOpen size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-playfair font-bold text-white">No results found</h3>
                    <p className="text-text-muted max-w-sm">
                      We couldn't find any books matching your criteria. Try adjusting your filters or search term.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-bg-primary flex items-center justify-center">
         <div className="animate-pulse flex flex-col items-center gap-4">
           <div className="w-16 h-16 bg-accent/20 rounded-2xl" />
           <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Opening Grimoires...</span>
         </div>
       </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
