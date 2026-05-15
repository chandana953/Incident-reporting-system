import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logout as authLogout } from '../services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider manages authentication state globally.
 * - Reads user from localStorage on mount
 * - Exposes login/logout helpers
 * - Any component can call useAuth() to access user & role
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore user from localStorage
  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
