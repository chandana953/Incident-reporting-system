// Base API URL — uses Vite proxy in dev, env var in production
const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Core fetch wrapper that:
 * - Automatically attaches Bearer token from localStorage
 * - Returns parsed JSON
 * - Throws descriptive errors with status codes
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  // Don't set Content-Type for FormData — browser sets it with boundary
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  let data = {};
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    // If not JSON, get text (e.g. for HTML error pages from proxy/server)
    const text = await response.text();
    data = { message: text || `Error ${response.status}: ${response.statusText}` };
  }

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    throw error;
  }

  return data;
};

// ── Convenience methods ───────────────────────────────────────────
export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),

  post: (endpoint, body) =>
    request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default api;
