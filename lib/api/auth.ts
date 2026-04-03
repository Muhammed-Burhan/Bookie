import client from './client';
import { User } from '@/lib/types';

interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  preferences?: {
    favorite_genres: string[];
    reading_goal: number;
  };
}

interface LoginData {
  email: string;
  password: string;
  revoke_previous?: boolean;
}

interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const authApi = {
  register: (data: RegisterData) =>
    client.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: LoginData) =>
    client.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  logout: () =>
    client.post<{ message: string }>('/auth/logout').then((r) => r.data),

  me: () =>
    client.get<{ user: User }>('/auth/me').then((r) => r.data.user),

  forgotPassword: (email: string) =>
    client
      .post<{ message: string }>('/auth/forgot-password', { email })
      .then((r) => r.data),

  resetPassword: (data: ResetPasswordData) =>
    client
      .post<{ message: string }>('/auth/reset-password', data)
      .then((r) => r.data),

  verifyEmail: (token: string) =>
    client
      .post<{ message: string }>('/auth/verify-email', { token })
      .then((r) => r.data),

  resendVerification: () =>
    client
      .post<{ message: string }>('/auth/resend-verification')
      .then((r) => r.data),
};
