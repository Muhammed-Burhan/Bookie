import client from './client';
import { User, Rating, Opinion, PaginatedResponse } from '@/lib/types';

interface UpdateProfileData {
  name?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  password?: string;
  password_confirmation?: string;
  preferences?: {
    favorite_genres: string[];
    reading_goal: number;
  };
}

interface UserProfile extends User {
  ratings_count: number;
  opinions_count: number;
}

export const usersApi = {
  getProfile: (id: number) =>
    client
      .get<{ data: UserProfile }>(`/users/${id}`)
      .then((r) => r.data.data),

  getUserRatings: (id: number, params?: { page?: number }) =>
    client
      .get<PaginatedResponse<Rating>>(`/users/${id}/ratings`, { params })
      .then((r) => r.data),

  getUserOpinions: (id: number, params?: { page?: number }) =>
    client
      .get<PaginatedResponse<Opinion>>(`/users/${id}/opinions`, { params })
      .then((r) => r.data),

  updateProfile: (data: UpdateProfileData) =>
    client.put<{ data: User }>('/profile', data).then((r) => r.data.data),

  getActivity: () =>
    client.get('/activity').then((r) => r.data),
};
