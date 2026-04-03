'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, MessageSquare,
  TrendingUp, Clock,
  ShieldCheck, ArrowUpRight, Search,
  MoreHorizontal, CheckCircle2, Loader2
} from 'lucide-react';
import { cn, formatScore, getRatingColorTheme } from '@/lib/utils';
import { adminApi } from '@/lib/api/admin';
import { User, Opinion } from '@/lib/types';
import Link from 'next/link';

interface DashboardStats {
  users: { total: number; new_today: number; new_this_week: number };
  books: { total: number };
  ratings: { total: number; completed: number };
  opinions: { total: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOpinions, setRecentOpinions] = useState<Opinion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashData, opinionsData] = await Promise.all([
          adminApi.getDashboard(),
          adminApi.getOpinions({ page: 1 }),
        ]);
        setStats(dashData);
        setRecentOpinions(opinionsData.data.slice(0, 5));
      } catch {
        // handle error
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-accent" size={40} />
      </div>
    );
  }

  const STATS = stats ? [
    { label: 'Total Books', value: stats.books.total.toLocaleString(), icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Active Readers', value: stats.users.total.toLocaleString(), icon: Users, color: 'text-success', bg: 'bg-success/10' },
    { label: 'AI Ratings', value: stats.ratings.total.toLocaleString(), icon: MessageSquare, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'System Health', value: '99.9%', icon: ShieldCheck, color: 'text-info', bg: 'bg-info/10' },
  ] : [];

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-accent font-jetbrains font-bold text-xs tracking-widest uppercase"
          >
            <Clock size={14} /> Mission Control Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-playfair font-black text-white"
          >
            Sanctuary Metrics
          </motion.h1>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="px-6 py-3 rounded-xl bg-bg-tertiary border border-border text-white text-sm font-bold hover:bg-bg-secondary transition-all flex items-center gap-2"
          >
            <Users size={16} /> Manage Users
          </Link>
          <Link
            href="/admin/opinions"
            className="px-6 py-3 rounded-xl bg-accent text-bg-primary text-sm font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <ShieldCheck size={16} /> Moderate Opinions
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[32px] bg-bg-secondary border border-border relative overflow-hidden group hover:border-accent/30 transition-all shadow-xl glass"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] group-hover:bg-accent/5 transition-all" />
            <div className="flex items-start justify-between relative z-10">
              <div className={cn("p-4 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              {stats && i === 1 && (
                <span className="text-xs font-bold font-jetbrains flex items-center gap-1 text-success">
                  +{stats.users.new_today} today <TrendingUp size={14} />
                </span>
              )}
            </div>
            <div className="mt-6 relative z-10">
              <p className="text-3xl font-jetbrains font-black text-white leading-none">{stat.value}</p>
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-2">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

        {/* Recent Opinions Table */}
        <div className="p-10 rounded-[40px] bg-bg-secondary border border-border glass shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px]" />

          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="text-2xl font-playfair font-bold text-white flex items-center gap-3">
              <MessageSquare className="text-accent" size={24} /> Recent Opinions
            </h3>
            <Link href="/admin/opinions" className="text-accent text-sm font-bold hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto relative z-10">
            {recentOpinions.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] w-[40%]">Book</th>
                    <th className="pb-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Reader</th>
                    <th className="pb-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Likes</th>
                    <th className="pb-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Status</th>
                    <th className="pb-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOpinions.map((opinion) => (
                    <tr key={opinion.id} className="group/row border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="py-6 pr-4">
                        <div className="flex items-center gap-4">
                          {opinion.book?.cover_url && (
                            <div className="w-10 h-14 rounded-lg bg-bg-tertiary border border-white/5 overflow-hidden shadow-lg flex-shrink-0">
                              <img src={opinion.book.cover_url} className="w-full h-full object-cover" alt="" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white text-sm group-hover/row:text-accent transition-colors">{opinion.book?.title ?? '—'}</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-widest">{opinion.book?.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <span className="text-xs text-text-muted">{opinion.user?.name ?? '—'}</span>
                      </td>
                      <td className="py-6 px-4">
                        <span className="text-sm font-jetbrains font-bold text-white">{opinion.likes_count}</span>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-success/10 border border-success/20 text-success text-[10px] font-bold uppercase tracking-widest inline-block whitespace-nowrap">
                          <CheckCircle2 size={10} /> Published
                        </div>
                      </td>
                      <td className="py-6 pl-4 text-right">
                        <button className="p-2 text-text-muted hover:text-white transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-text-muted text-sm text-center py-8">No opinions yet.</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-8">
          <div className="p-10 rounded-[40px] bg-bg-secondary border border-border glass shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-white">Quick Navigation</h3>
            {[
              { label: 'User Management', href: '/admin/users', icon: Users },
              { label: 'Opinion Moderation', href: '/admin/opinions', icon: MessageSquare },
              { label: 'Activity Logs', href: '/admin/logs', icon: Clock },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between p-4 rounded-2xl bg-bg-tertiary border border-border hover:border-accent/30 hover:bg-bg-tertiary/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-accent" />
                  <span className="font-bold text-white text-sm">{item.label}</span>
                </div>
                <ArrowUpRight size={16} className="text-text-muted group-hover:text-accent transition-colors" />
              </Link>
            ))}
          </div>

          {stats && (
            <div className="p-8 rounded-[32px] bg-gradient-to-br from-accent/10 to-bg-secondary border border-accent/20 space-y-4">
              <h4 className="font-bold text-white">This Week</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">New Users</span>
                  <span className="font-jetbrains font-bold text-white">+{stats.users.new_this_week}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Completed Ratings</span>
                  <span className="font-jetbrains font-bold text-white">{stats.ratings.completed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Total Opinions</span>
                  <span className="font-jetbrains font-bold text-white">{stats.opinions.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
