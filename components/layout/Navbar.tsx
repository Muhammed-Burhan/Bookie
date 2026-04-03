'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth';
import { usePathname } from 'next/navigation';
import { Book, User, Search, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils'; // I will create this utils file next

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Discover', href: '/' },
    { name: 'Feed', href: '/feed' },
    { name: 'Suggestions', href: '/suggestions', protected: true },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'glass py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-bg-primary transform group-hover:rotate-12 transition-transform">
            <Book size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-playfair font-bold tracking-tight text-white hidden sm:block">
            Bookie
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            (!link.protected || isAuthenticated) && (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent',
                  pathname === link.href ? 'text-accent' : 'text-text-muted'
                )}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="p-2 text-text-muted hover:text-accent transition-colors"
            title="Search Books"
          >
            <Search size={20} />
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                href="/profile/me"
                className="flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-bg-tertiary border border-border overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-accent">
                      {user?.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-text-primary hidden lg:block group-hover:text-accent transition-colors">
                  {user?.name.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-text-muted hover:text-error transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-text-muted hover:text-white px-4 py-2"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="text-sm font-semibold bg-accent text-bg-primary px-5 py-2 rounded-lg hover:bg-accent-hover transition-colors"
              >
                Join
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-secondary border-t border-border p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            (!link.protected || isAuthenticated) && (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          ))}
          {!isAuthenticated && (
            <div className="flex flex-col gap-4 pt-4 border-t border-border">
              <Link
                href="/auth/login"
                className="w-full py-3 text-center rounded-lg border border-border"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="w-full py-3 text-center rounded-lg bg-accent text-bg-primary font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
