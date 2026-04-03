import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { authApi } from '@/lib/api/auth';

export function useAuth() {
  const store = useAuthStore();
  return store;
}

/**
 * Call once at app root (ClientLayout) to rehydrate auth state on page load.
 * Verifies the persisted token is still valid via GET /auth/me.
 */
export function useAuthHydration() {
  const { token, login, logout, setUser } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    authApi.me()
      .then((user) => setUser(user))
      .catch(() => logout());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only
}
