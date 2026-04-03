import client from './client';
import { User, Opinion, PaginatedResponse } from '@/lib/types';

interface DashboardStats {
  users: { total: number; new_today: number; new_this_week: number };
  books: { total: number };
  ratings: { total: number; completed: number };
  opinions: { total: number };
}

interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  subject_type: string;
  subject_id: number;
  properties: Record<string, unknown>;
  ip_address: string;
  created_at: string;
  user?: User;
}

export const adminApi = {
  getDashboard: () =>
    client
      .get<{ data: DashboardStats }>('/admin/dashboard')
      .then((r) => r.data.data),

  getUsers: (params?: { search?: string; role?: 'user' | 'admin'; page?: number }) =>
    client
      .get<PaginatedResponse<User>>('/admin/users', { params })
      .then((r) => r.data),

  updateUser: (id: number, data: { role?: 'user' | 'admin'; name?: string; email?: string }) =>
    client
      .put<{ data: User }>(`/admin/users/${id}`, data)
      .then((r) => r.data.data),

  deleteUser: (id: number) =>
    client.delete(`/admin/users/${id}`).then((r) => r.data),

  getActivityLogs: (params?: { action?: string; user_id?: number; days?: number; page?: number }) =>
    client
      .get<PaginatedResponse<ActivityLog>>('/admin/activity-logs', { params })
      .then((r) => r.data),

  getOpinions: (params?: { page?: number }) =>
    client
      .get<PaginatedResponse<Opinion>>('/admin/opinions', { params })
      .then((r) => r.data),

  deleteOpinion: (id: number) =>
    client.delete(`/admin/opinions/${id}`).then((r) => r.data),

  getBookStats: () =>
    client.get('/admin/book-stats').then((r) => r.data),
};
