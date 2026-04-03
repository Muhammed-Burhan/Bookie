'use client';

import { useEffect, useState } from 'react';
import {
  MessageSquare, Search, Loader2, ChevronLeft, ChevronRight,
  Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { Opinion } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function AdminOpinionsPage() {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const load = async (page = 1) => {
    setIsLoading(true);
    try {
      const result = await adminApi.getOpinions({ page });
      setOpinions(result.data);
      setCurrentPage(result.current_page);
      setLastPage(result.last_page);
      setTotal(result.total);
    } catch {
      setOpinions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await adminApi.deleteOpinion(id);
      setOpinions((prev) => prev.filter((o) => o.id !== id));
      setTotal((prev) => prev - 1);
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-playfair font-black text-white">Opinion Moderation</h1>
        <p className="text-text-muted text-sm">{total.toLocaleString()} total opinions</p>
      </div>

      {/* Table */}
      <div className="rounded-[32px] bg-bg-secondary border border-border overflow-hidden glass shadow-2xl">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-accent" size={40} />
          </div>
        ) : opinions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <MessageSquare size={48} className="text-text-muted/20" />
            <p className="text-text-muted">No opinions yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_180px_80px_80px_120px] gap-4 px-6 py-4">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Opinion</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Reader</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Likes</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Spoiler</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</span>
            </div>

            {opinions.map((opinion) => (
              <div key={opinion.id}>
                {/* Row */}
                <div className="grid grid-cols-[1fr_180px_80px_80px_120px] gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors">
                  {/* Opinion snippet */}
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm text-white font-medium line-clamp-1">"{opinion.content}"</p>
                    {opinion.book && (
                      <p className="text-xs text-text-muted">{opinion.book.title}</p>
                    )}
                  </div>

                  {/* Reader */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-bg-tertiary border border-border flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                      {opinion.user?.name.charAt(0)}
                    </div>
                    <span className="text-xs text-text-muted truncate">{opinion.user?.name}</span>
                  </div>

                  {/* Likes */}
                  <span className="text-sm font-jetbrains font-bold text-white">{opinion.likes_count}</span>

                  {/* Spoiler */}
                  <span className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest inline-block",
                    opinion.contains_spoilers
                      ? "bg-warning/10 text-warning border border-warning/20"
                      : "bg-bg-tertiary text-text-muted border border-border"
                  )}>
                    {opinion.contains_spoilers ? 'Yes' : 'No'}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setExpandedId(expandedId === opinion.id ? null : opinion.id)}
                      className="p-2 text-text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
                      title="Expand"
                    >
                      {expandedId === opinion.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {confirmDelete === opinion.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(opinion.id)}
                          disabled={deletingId === opinion.id}
                          className="px-2 py-1 rounded-lg bg-error/10 text-error border border-error/20 text-[10px] font-bold hover:bg-error/20 transition-all disabled:opacity-50"
                        >
                          {deletingId === opinion.id ? <Loader2 size={10} className="animate-spin" /> : 'Delete'}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 rounded-lg bg-bg-tertiary text-text-muted border border-border text-[10px] font-bold"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(opinion.id)}
                        className="p-2 text-text-muted hover:text-error transition-colors rounded-lg hover:bg-error/10"
                        title="Delete opinion"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded full text */}
                {expandedId === opinion.id && (
                  <div className="px-6 pb-6 bg-bg-primary/30">
                    <div className="p-4 rounded-xl border border-border bg-bg-tertiary/30">
                      <p className="text-sm text-text-muted leading-relaxed">"{opinion.content}"</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-text-muted/50 font-jetbrains">
                        <span>ID: {opinion.id}</span>
                        <span>{new Date(opinion.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
