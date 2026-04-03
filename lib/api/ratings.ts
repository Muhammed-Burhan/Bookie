import client from './client';
import { Rating, PaginatedResponse } from '@/lib/types';

interface StartResponse {
  data: Rating & { current_question: string };
}

interface AnswerResponse {
  data: Rating & { current_question: string | null };
}

export const ratingsApi = {
  list: (params?: { completed?: boolean }) =>
    client
      .get<PaginatedResponse<Rating>>('/ratings', { params })
      .then((r) => r.data),

  start: (book_id: number) =>
    client
      .post<StartResponse>('/ratings/start', { book_id })
      .then((r) => r.data.data),

  answer: (id: number, answer: string) =>
    client
      .post<AnswerResponse>(`/ratings/${id}/answer`, { answer })
      .then((r) => r.data.data),

  complete: (id: number) =>
    client
      .post<{ data: Rating }>(`/ratings/${id}/complete`)
      .then((r) => r.data.data),

  get: (id: number) =>
    client.get<{ data: Rating }>(`/ratings/${id}`).then((r) => r.data.data),

  delete: (id: number) =>
    client.delete(`/ratings/${id}`).then((r) => r.data),
};
