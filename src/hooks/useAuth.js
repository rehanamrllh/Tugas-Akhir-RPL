import { useState, useEffect } from 'react';
import { KEYS } from '../lib/storage';

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const v = sessionStorage.getItem(KEYS.AUTH);
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  });

  useEffect(() => {
    const handler = (e) => {
      if (e.key === KEYS.AUTH) {
        try {
          const v = sessionStorage.getItem(KEYS.AUTH);
          setUser(v ? JSON.parse(v) : null);
        } catch { setUser(null); }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const login = (userData) => {
    sessionStorage.setItem(KEYS.AUTH, JSON.stringify(userData));
    setUser(userData);
    return true;
  };

  const logout = () => {
    sessionStorage.removeItem(KEYS.AUTH);
    setUser(null);
  };

  return { user, isAuthenticated: !!user, login, logout };
}
