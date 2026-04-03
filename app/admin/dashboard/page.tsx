'use client';

import { motion } from 'framer-motion';
import { 
  Users, BookOpen, MessageSquare, 
  TrendingUp, TrendingDown, Clock, 
  ShieldCheck, ArrowUpRight, Search, 
  Filter, MoreHorizontal, Edit, Trash2, 
  Eye, CheckCircle2, AlertCircle
} from 'lucide-react';
import { cn, formatScore, getRatingColorTheme } from '@/lib/utils';
import { MOCK_BOOKS } from '@/lib/mock-data';

const STATS = [
  { label: 'Curated Books', value: '1,248', icon: BookOpen, trend: '+12.5%', color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Active Curators', value: '15,802', icon: Users, trend: '+8.2%', color: 'text-success', bg: 'bg-success/10' },
  { label: 'AI Ratings', value: '42,900', icon: MessageSquare, trend: '+24.1%', color: 'text-warning', bg: 'bg-warning/10' },
  { label: 'System Health', value: '99.9%', icon: ShieldCheck, trend: 'Optimal', color: 'text-info', bg: 'bg-info/10' },
];

export default function AdminDashboard() {
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
           <button className="px-6 py-3 rounded-xl bg-bg-tertiary border border-border text-white text-sm font-bold hover:bg-bg-secondary transition-all flex items-center gap-2">
             <Edit size={16} /> Manage Content
           </button>
           <button className="px-6 py-3 rounded-xl bg-accent text-bg-primary text-sm font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
             <ShieldCheck size={16} /> Generate Report
           </button>
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
               <span className={cn("text-xs font-bold font-jetbrains flex items-center gap-1", stat.trend.includes('-') ? "text-error" : "text-success")}>
                 {stat.trend} {stat.trend !== 'Optimal' && (stat.trend.includes('+') ? <TrendingUp size={14} /> : <TrendingDown size={14} />)}
               </span>
             </div>
             <div className="mt-6 relative z-10">
               <p className="text-3xl font-jetbrains font-black text-white leading-none">{stat.value}</p>
               <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-2">{stat.label}</p>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Main Insights Table */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Recent Ratings Table */}
        <div className="p-10 rounded-[40px] bg-bg-secondary border border-border glass shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px]" />
           
           <div className="flex items-center justify-between mb-10 relative z-10">
             <h3 className="text-2xl font-playfair font-bold text-white flex items-center gap-3">
               <MessageSquare className="text-accent" size={24} /> Semantic Echoes Pipeline
             </h3>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter pipeline..." 
                  className="bg-bg-tertiary border border-border rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-accent"
                />
             </div>
           </div>

           <div className="overflow-x-auto relative z-10">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/5">
                   <th className="pb-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] w-[40%]">Book Meta</th>
                   <th className="pb-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Curator</th>
                   <th className="pb-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">AI Score</th>
                   <th className="pb-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Status</th>
                   <th className="pb-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Action</th>
                 </tr>
               </thead>
               <tbody>
                 {MOCK_BOOKS.slice(0, 5).map((book, i) => (
                   <tr key={i} className="group/row border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                     <td className="py-6 pr-4">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-16 rounded-lg bg-bg-tertiary border border-white/5 overflow-hidden shadow-lg flex-shrink-0">
                           <img src={book.cover_url} className="w-full h-full object-cover grayscale opacity-50 group-hover/row:grayscale-0 group-hover/row:opacity-100 transition-all duration-500" />
                         </div>
                         <div>
                            <p className="font-bold text-white text-sm group-hover/row:text-accent transition-colors">{book.title}</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-widest">{book.author}</p>
                         </div>
                       </div>
                     </td>
                     <td className="py-6 px-4">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-bg-tertiary flex items-center justify-center text-[10px] text-accent font-bold">K</div>
                           <span className="text-xs text-text-muted">K. Thorne</span>
                        </div>
                     </td>
                     <td className="py-6 px-4">
                        <span className={cn("text-sm font-jetbrains font-bold", getRatingColorTheme(book.average_rating))}>
                          {formatScore(book.average_rating)}
                        </span>
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
           </div>
        </div>

        {/* System Activity Hub */}
        <div className="space-y-8">
           <div className="p-10 rounded-[40px] bg-bg-secondary border border-border glass shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 blur-3xl" />
              <h3 className="text-xl font-bold text-white flex items-center gap-3 relative z-10">
                <AlertCircle className="text-accent" size={20} /> Integrity Feed
              </h3>
              
              <div className="space-y-6 relative z-10">
                {[
                  { time: '12m ago', user: 'Admin', action: 'Library catalog updated', details: 'Added 24 new titles' },
                  { time: '45m ago', user: 'System', action: 'AI Model Re-indexed', details: 'Fine-tuning semantic vectors' },
                  { time: '2h ago', user: 'Mod-A', action: 'Inappropriate rating removed', details: 'Content policy violation' },
                  { time: '4h ago', user: 'System', action: 'Daily Backup Completed', details: 'Archive ID: #A12B34' }
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 group/log">
                    <div className="w-px bg-border group-last/log:bg-transparent relative">
                      <div className="absolute top-1 -left-1 w-2 h-2 rounded-full bg-accent ring-4 ring-bg-primary" />
                    </div>
                    <div className="pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none">{log.time}</span>
                        <span className="text-[10px] text-text-muted">• {log.user}</span>
                      </div>
                      <p className="text-sm font-bold text-white group-hover/log:text-accent transition-colors">{log.action}</p>
                      <p className="text-xs text-text-muted mt-1">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-4 bg-bg-tertiary border border-border rounded-2xl text-white text-xs font-bold uppercase tracking-widest hover:bg-bg-secondary transition-all">
                Access Audit Logs
              </button>
           </div>
           
           <div className="p-10 rounded-[40px] bg-gradient-to-br from-accent/20 to-bg-secondary border border-accent/20 relative overflow-hidden group cursor-pointer hover:bg-accent/30 transition-all">
              <div className="relative z-10 space-y-4">
                <h4 className="font-playfair font-black text-white text-2xl group-hover:translate-x-1 transition-transform">Curator Portal Integration</h4>
                <p className="text-sm text-text-muted font-medium leading-relaxed">Customize global rating parameters and manage semantic thresholds.</p>
                <div className="flex items-center gap-2 text-accent font-bold text-sm">
                  Access Portal <ArrowUpRight size={16} />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
