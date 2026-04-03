'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, Loader2, ChevronLeft, ChevronRight,
  ShieldCheck, User, Trash2, MoreHorizontal
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { User as UserType, PaginatedResponse } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const load = async (page = 1) => {
    setIsLoading(true);
    try {
      const result = await adminApi.getUsers({
        search: searchQuery || undefined,
        role: roleFilter === 'all' ? undefined : roleFilter,
        page,
      });
      setUsers(result.data);
      setCurrentPage(result.current_page);
      setLastPage(result.last_page);
      setTotal(result.total);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => load(1), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, roleFilter]);

  const handleRoleChange = async (id: number, role: 'user' | 'admin') => {
    setUpdatingId(id);
    try {
      const updated = await adminApi.updateUser(id, { role });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: updated.role } : u)));
    } catch {
      // silently fail
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await adminApi.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
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
      <div className="flex flex-col md:flex-row items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-playfair font-black text-white">User Management</h1>
          <p className="text-text-muted text-sm">{total.toLocaleString()} registered readers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-bg-secondary border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'user', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "px-4 py-3 rounded-xl font-bold text-sm border transition-all capitalize",
                roleFilter === r
                  ? "bg-accent/10 text-accent border-accent/30"
                  : "bg-bg-secondary text-text-muted border-border hover:text-white"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[32px] bg-bg-secondary border border-border overflow-hidden glass shadow-2xl">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-accent" size={40} />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Users size={48} className="text-text-muted/20" />
            <p className="text-text-muted">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">User</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Verified</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Joined</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-bg-tertiary border border-border overflow-hidden flex-shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-accent">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-white text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-muted font-jetbrains">{user.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                        disabled={updatingId === user.id}
                        className={cn(
                          "bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-accent transition-all disabled:opacity-50 cursor-pointer",
                          user.role === 'admin' ? "text-accent" : "text-text-muted"
                        )}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest",
                        user.email_verified
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-error/10 text-error border border-error/20"
                      )}>
                        {user.email_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-text-muted font-jetbrains">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {confirmDelete === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={deletingId === user.id}
                            className="px-3 py-1.5 rounded-lg bg-error/10 text-error border border-error/20 text-xs font-bold hover:bg-error/20 transition-all disabled:opacity-50"
                          >
                            {deletingId === user.id ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-3 py-1.5 rounded-lg bg-bg-tertiary text-text-muted border border-border text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(user.id)}
                          className="p-2 text-text-muted hover:text-error transition-colors rounded-lg hover:bg-error/10"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
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
