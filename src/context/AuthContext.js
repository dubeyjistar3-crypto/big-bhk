import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('star_estates_token'));
  const [admin, setAdmin] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    if (token === 'demo-admin-token') {
      logout();
      return;
    }

    setCheckingAuth(true);
    api.get('/auth/me')
      .then((res) => setAdmin(res.data.admin))
      .catch(() => logout())
      .finally(() => setCheckingAuth(false));
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('star_estates_token', res.data.token);
      setToken(res.data.token);
      setAdmin(res.data.admin);
      return;
    } catch (error) {
      const apiUnavailable = !error.response;

      if (apiUnavailable) {
        try {
          await api.get('/health', { timeout: 60000 });
          const retry = await api.post('/auth/login', { email, password }, { timeout: 60000 });
          localStorage.setItem('star_estates_token', retry.data.token);
          setToken(retry.data.token);
          setAdmin(retry.data.admin);
          return;
        } catch {
          throw new Error('Server wake ho raha hai. 20-30 seconds baad dobara login try kijiye.');
        }
      }

      throw new Error(error.response?.data?.message || 'Invalid email or password');
    }
  };

  const logout = () => {
    localStorage.removeItem('star_estates_token');
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({ admin, token, login, logout, checkingAuth, isAuthenticated: Boolean(token && admin) }),
    [admin, checkingAuth, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
