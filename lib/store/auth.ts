import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

function setCookie(name: string, value: string, days = 15) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user, token) => {
        setCookie('bookie-token', token);
        setCookie('bookie-role', user.role);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        deleteCookie('bookie-token');
        deleteCookie('bookie-role');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user) => {
        setCookie('bookie-role', user.role);
        set({ user });
      },
    }),
    {
      name: 'bookie-auth-storage',
    }
  )
);
