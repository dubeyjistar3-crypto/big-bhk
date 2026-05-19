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
        throw new Error('Backend API is not running. Start it with npm run server, then login again.');
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
