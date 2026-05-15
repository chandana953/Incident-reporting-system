import api from './api';

/**
 * Auth Service
 * Handles login, register, and profile fetching.
 * JWT token is stored in localStorage after login/register.
 */

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 */
export const register = async (userData) => {
  const data = await api.post('/auth/register', userData);
  if (data.data?.token) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data;
};

/**
 * Login an existing user
 * @param {Object} credentials - { email, password }
 */
export const login = async (credentials) => {
  const data = await api.post('/auth/login', credentials);
  if (data.data?.token) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data;
};

/**
 * Logout — clears localStorage
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get currently stored user from localStorage (no API call)
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Check if a user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
