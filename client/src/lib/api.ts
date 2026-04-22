import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Interceptor to attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tournament Specific API Methods
export const tournamentApi = {
  getAll: () => api.get('/tournaments'),
  create: (data) => api.post('/tournaments', data),
  update: (id, data) => api.put(`/tournaments/${id}`, data),
  delete: (id) => api.delete(`/tournaments/${id}`),
};

export default api;