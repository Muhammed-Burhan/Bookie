'use client';

import { useAuthStore } from '@/lib/store/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Users,
  MessageSquare, ShieldCheck, LogOut,
  Menu, X, Bell, Clock, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Users', icon: Users, href: '/admin/users' },
    { name: 'Opinions', icon: MessageSquare, href: '/admin/opinions' },
    { name: 'Activity Logs', icon: Clock, href: '/admin/logs' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-bg-secondary border-r border-border transition-all duration-300 w-64 lg:static",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:w-20"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-6 py-8 border-b border-border flex items-center justify-between">
            <Link href="/" className={cn("flex items-center gap-3", !isSidebarOpen && "lg:justify-center lg:w-full")}>
               <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-bg-primary flex-shrink-0">
                 <ShieldCheck size={24} strokeWidth={2.5} />
               </div>
               {isSidebarOpen && (
                 <span className="text-xl font-playfair font-black text-white tracking-tight">Supervisor</span>
               )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all text-sm group",
                  pathname === item.href 
                    ? "bg-accent/10 text-accent border border-accent/20" 
                    : "text-text-muted hover:text-white hover:bg-bg-tertiary"
                )}
              >
                <item.icon size={20} className={cn("flex-shrink-0", pathname === item.href ? "text-accent" : "text-text-muted group-hover:text-white")} />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Back to site */}
          <div className="px-4 pb-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-white hover:bg-bg-tertiary transition-all text-sm font-bold"
            >
              <ArrowLeft size={18} className="flex-shrink-0" />
              {isSidebarOpen && <span>Back to Site</span>}
            </Link>
          </div>

          {/* Footer User Profile */}
          <div className="p-4 border-t border-border mt-auto">
            <div className={cn("flex items-center gap-4 p-3 rounded-xl bg-bg-tertiary", !isSidebarOpen && "lg:justify-center")}>
              <div className="w-8 h-8 rounded-full bg-accent text-bg-primary flex items-center justify-center font-bold flex-shrink-0">
                {user?.name.charAt(0)}
              </div>
              {isSidebarOpen && (
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-text-muted font-jetbrains uppercase">Superuser</p>
                </div>
              )}
              {isSidebarOpen && (
                <button onClick={logout} className="text-text-muted hover:text-error transition-colors">
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative overflow-y-auto w-full">
        {/* Header Overlay */}
        <header className="sticky top-0 z-40 px-8 h-20 bg-bg-primary/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg bg-bg-secondary text-text-muted hover:text-white border border-border"
              >
                {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <h2 className="text-xl font-playfair font-bold text-white hidden md:block">Sanctuary Command Center</h2>
           </div>

           <div className="flex items-center gap-6">
              <div className="relative">
                <Bell size={20} className="text-text-muted hover:text-white cursor-pointer" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent ring-4 ring-bg-primary" />
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <Link href="/profile/me" className="flex items-center gap-2 group">
                 <span className="text-sm font-bold text-text-muted group-hover:text-white">Profile</span>
                 <div className="w-8 h-8 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center text-accent text-xs font-black">
                   ADM
                 </div>
              </Link>
           </div>
        </header>

        {/* Content */}
        <div className="p-10 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
