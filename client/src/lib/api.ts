import axios from 'axios';

// The baseURL will prioritize the Vercel Environment Variable if provided.
// In production, this will typically be: https://unique-chess-acadamy.onrender.com/api
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api',
  withCredentials: true,
});

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