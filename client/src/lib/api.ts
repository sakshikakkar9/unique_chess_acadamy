import axios from 'axios';

// The baseURL will prioritize the Vercel Environment Variable if provided.
// In production, this will typically be: https://unique-chess-acadamy.onrender.com/api
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // If we're not already on the login page, redirect to it
      if (window.location.pathname !== '/admin/login' && window.location.pathname.startsWith('/admin')) {
        window.location.href = `/admin/login?from=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

// Interceptor to attach the Admin JWT token for protected routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Tournament Specific API Methods
export const tournamentApi = {
  // Public route: fetch all tournaments
  getAll: () => api.get('/tournaments'),
  
  // Protected Admin routes: matches your new backend logic
  create: (data: any) => api.post('/tournaments/admin/create', data),
  update: (id: number | string, data: any) => api.put(`/tournaments/admin/update/${id}`, data),
  delete: (id: number | string) => api.delete(`/tournaments/admin/delete/${id}`),
};

export default api;