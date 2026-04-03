import client from './client';
import { Suggestion } from '@/lib/types';

export const suggestionsApi = {
  list: (params?: { dismissed?: boolean }) =>
    client
      .get<{ data: Suggestion[] }>('/suggestions', { params })
      .then((r) => r.data.data),

  generate: (count = 5) =>
    client
      .post<{ data: Suggestion[] }>('/suggestions/generate', { count })
      .then((r) => r.data.data),

  dismiss: (id: number) =>
    client.post(`/suggestions/${id}/dismiss`).then((r) => r.data),

  markRead: (id: number) =>
    client.post(`/suggestions/${id}/read`).then((r) => r.data),
};
