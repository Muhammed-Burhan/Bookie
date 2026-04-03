'use client';

import Link from 'next/link';
import { Book, Globe, Mail, X } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 group">
          
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-bg-primary">
                <Book size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-playfair font-bold text-white tracking-tight">
                Bookie
              </span>
            </Link>
            <p className="text-text-muted text-lg max-w-sm leading-relaxed">
              An intelligent, AI-driven sanctuary for book lovers. 
              Rate, discover, and share your literary journey.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="p-2 rounded-lg bg-bg-tertiary text-text-muted hover:text-accent hover:-translate-y-1 transition-all">
                <X size={20} />
              </Link>
              <Link href="#" className="p-2 rounded-lg bg-bg-tertiary text-text-muted hover:text-accent hover:-translate-y-1 transition-all">
                <Globe size={20} />
              </Link>
              <Link href="#" className="p-2 rounded-lg bg-bg-tertiary text-text-muted hover:text-accent hover:-translate-y-1 transition-all">
                <Mail size={20} />
              </Link>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="font-playfair text-xl font-bold text-white mb-6">Navigation</h4>
            <div className="flex flex-col gap-4 text-text-muted">
              <Link href="/" className="hover:text-accent transition-colors">Discover</Link>
              <Link href="/feed" className="hover:text-accent transition-colors">Social Feed</Link>
              <Link href="/suggestions" className="hover:text-accent transition-colors">AI Suggestions</Link>
              <Link href="/books/search" className="hover:text-accent transition-colors">Search Books</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-playfair text-xl font-bold text-white mb-6">The Platform</h4>
            <div className="flex flex-col gap-4 text-text-muted">
              <Link href="/about" className="hover:text-accent transition-colors">About Us</Link>
              <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-accent transition-colors">Contact Support</Link>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-text-muted font-medium">
          <p>© {currentYear} Bookie Platform. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              API Online
            </span>
            <span className="text-text-muted/60">Version 1.0.4-Beta</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
