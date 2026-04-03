'use client';

import { useEffect, useState } from 'react';
import { Clock, Loader2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { cn } from '@/lib/utils';

const ACTION_TYPES = [
  { label: 'All', value: '' },
  { label: 'Registered', value: 'user.registered' },
  { label: 'Logged In', value: 'user.logged_in' },
  { label: 'Book Rated', value: 'book.rated' },
  { label: 'Opinion Created', value: 'opinion.created' },
  { label: 'Opinion Deleted', value: 'opinion.deleted' },
  { label: 'Opinion Liked', value: 'opinion.liked' },
  { label: 'Suggestions Generated', value: 'suggestions.generated' },
];

const ACTION_COLORS: Record<string, string> = {
  'user.registered': 'text-success bg-success/10 border-success/20',
  'user.logged_in': 'text-info bg-info/10 border-info/20',
  'book.rated': 'text-accent bg-accent/10 border-accent/20',
  'opinion.created': 'text-warning bg-warning/10 border-warning/20',
  'opinion.deleted': 'text-error bg-error/10 border-error/20',
  'opinion.liked': 'text-success bg-success/10 border-success/20',
  'opinion.unliked': 'text-text-muted bg-bg-tertiary border-border',
  'suggestions.generated': 'text-accent bg-accent/10 border-accent/20',
};

interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  subject_type: string;
  subject_id: number;
  properties: Record<string, unknown>;
  ip_address: string;
  created_at: string;
  user?: { name: string; email: string };
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [daysFilter, setDaysFilter] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async (page = 1) => {
    setIsLoading(true);
    try {
      const result = await adminApi.getActivityLogs({
        action: actionFilter || undefined,
        days: daysFilter,
        page,
      });
      setLogs(result.data as ActivityLog[]);
      setCurrentPage(result.current_page);
      setLastPage(result.last_page);
      setTotal(result.total);
    } catch {
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, [actionFilter, daysFilter]);

  const formatAction = (action: string) =>
    action.replace('.', ' — ').replace(/_/g, ' ');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-playfair font-black text-white">Activity Logs</h1>
        <p className="text-text-muted text-sm">{total.toLocaleString()} events recorded</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-text-muted" />
          {ACTION_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setActionFilter(type.value)}
              className={cn(
                "px-3 py-1.5 rounded-xl font-bold text-xs border transition-all",
                actionFilter === type.value
                  ? "bg-accent/10 text-accent border-accent/30"
                  : "bg-bg-secondary text-text-muted border-border hover:text-white"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-text-muted font-bold">Last</span>
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDaysFilter(d)}
              className={cn(
                "px-3 py-1.5 rounded-xl font-bold text-xs border transition-all",
                daysFilter === d
                  ? "bg-accent/10 text-accent border-accent/30"
                  : "bg-bg-secondary text-text-muted border-border hover:text-white"
              )}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <div className="rounded-[32px] bg-bg-secondary border border-border overflow-hidden glass shadow-2xl">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-accent" size={40} />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Clock size={48} className="text-text-muted/20" />
            <p className="text-text-muted">No activity in the selected period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Action</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">User</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Subject</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">IP</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border",
                        ACTION_COLORS[log.action] ?? 'text-text-muted bg-bg-tertiary border-border'
                      )}>
                        {formatAction(log.action)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-white">{log.user?.name ?? `User #${log.user_id}`}</p>
                        {log.user?.email && (
                          <p className="text-xs text-text-muted font-jetbrains">{log.user.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-text-muted font-jetbrains">
                        {log.subject_type?.split('\\').pop()} #{log.subject_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-text-muted font-jetbrains">{log.ip_address}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-text-muted font-jetbrains">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <span className="text-xs text-text-muted font-jetbrains">
              Page {currentPage} of {lastPage}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => load(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="p-2 rounded-lg bg-bg-tertiary border border-border text-text-muted hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => load(currentPage + 1)}
                disabled={currentPage === lastPage || isLoading}
                className="p-2 rounded-lg bg-bg-tertiary border border-border text-text-muted hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
