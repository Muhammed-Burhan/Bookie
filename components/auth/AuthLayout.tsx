'use client';

import Link from 'next/link';
import { Book, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  alternateLink: { text: string; href: string; linkText: string };
}

export default function AuthLayout({ children, title, subtitle, alternateLink }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-primary overflow-hidden">
      
      {/* Left Decoration Panel */}
      <div className="hidden md:flex md:w-5/12 relative bg-bg-secondary p-12 flex-col justify-between overflow-hidden border-r border-border">
        {/* Glow effect */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent/20 blur-[120px] rounded-full" />
        
        <Link href="/" className="flex items-center gap-2 group relative z-10 w-fit">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-bg-primary">
            <Book size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-playfair font-bold text-white tracking-tight">
            Bookie
          </span>
        </Link>

        <div className="relative z-10 space-y-4">
          <h2 className="text-5xl font-playfair font-bold leading-tight text-white mb-6">
            Where your thoughts find a <span className="text-accent">home.</span>
          </h2>
          <p className="text-text-muted text-lg max-w-sm leading-relaxed">
            The world's most sophisticated sanctuary for book lovers. 
            Designed to bridge the gap between AI intuition and human insight.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-sm font-medium text-text-muted">
          <Link href="/" className="flex items-center gap-2 hover:text-accent transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to site
          </Link>
          <p>© {new Date().getFullYear()} Bookie Platform</p>
        </div>

        {/* Floating book covers simulation background */}
        <div className="absolute inset-x-0 -bottom-20 flex gap-4 rotate-12 opacity-5 pointer-events-none">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex-none w-48 h-64 bg-white rounded-lg shadow-2xl" />
          ))}
        </div>
      </div>

      {/* Right Form Panel */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-playfair font-bold text-white">{title}</h1>
            <p className="text-text-muted">{subtitle}</p>
          </div>

          <div className="bg-bg-secondary/40 border border-border p-8 rounded-3xl backdrop-blur-sm shadow-xl">
            {children}
          </div>

          <p className="text-center text-text-muted text-sm font-medium">
            {alternateLink.text}{' '}
            <Link href={alternateLink.href} className="text-accent hover:text-accent-hover font-bold transition-colors">
              {alternateLink.linkText}
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
