'use client';

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import PageTransition from './PageTransition';
import Footer from './Footer';
import { useAuthHydration } from '@/lib/hooks/useAuth';

const Navbar = dynamic(() => import('./Navbar'), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useAuthHydration();
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      <AnimatePresence mode="wait">
        <PageTransition key={pathname}>
          {children}
        </PageTransition>
      </AnimatePresence>
      {!isAdminPage && <Footer />}
    </>
  );
}
