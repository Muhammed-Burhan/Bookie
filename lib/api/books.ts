import client from './client';
import { Book, Opinion, PaginatedResponse } from '@/lib/types';

export const booksApi = {
  list: (params?: { sort?: 'rating' | 'popular' | 'recent'; page?: number }) =>
    client
      .get<PaginatedResponse<Book>>('/books', { params })
      .then((r) => r.data),

  search: (q: string, params?: { limit?: number; page?: number }) =>
    client
      .get<PaginatedResponse<Book>>('/books/search', { params: { q, ...params } })
      .then((r) => r.data),

  get: (id: number) =>
    client.get<{ data: Book }>(`/books/${id}`).then((r) => r.data.data),

  getOpinions: (
    id: number,
    params?: { spoilers?: boolean; sort?: 'popular' | 'recent'; page?: number }
  ) =>
    client
      .get<PaginatedResponse<Opinion>>(`/books/${id}/opinions`, { params })
      .then((r) => r.data),
};
