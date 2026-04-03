import client from './client';
import { Opinion, PaginatedResponse } from '@/lib/types';

interface CreateOpinionData {
  book_id: number;
  content: string;
  contains_spoilers: boolean;
}

interface UpdateOpinionData {
  content?: string;
  contains_spoilers?: boolean;
}

export const opinionsApi = {
  list: (params?: {
    book_id?: number;
    user_id?: number;
    sort?: 'popular' | 'recent';
    spoilers?: boolean;
    page?: number;
  }) =>
    client
      .get<PaginatedResponse<Opinion>>('/opinions', { params })
      .then((r) => r.data),

  get: (id: number) =>
    client.get<{ data: Opinion }>(`/opinions/${id}`).then((r) => r.data.data),

  create: (data: CreateOpinionData) =>
    client.post<{ data: Opinion }>('/opinions', data).then((r) => r.data.data),

  update: (id: number, data: UpdateOpinionData) =>
    client
      .put<{ data: Opinion }>(`/opinions/${id}`, data)
      .then((r) => r.data.data),

  delete: (id: number) =>
    client.delete(`/opinions/${id}`).then((r) => r.data),

  toggleLike: (id: number) =>
    client
      .post<{ liked: boolean; likes_count: number }>(`/opinions/${id}/like`)
      .then((r) => r.data),

  myOpinions: () =>
    client
      .get<PaginatedResponse<Opinion>>('/my-opinions')
      .then((r) => r.data),
};
