import axios from 'axios';

const api = axios.create({
  // ✅ Change this to your backend address and port
  baseURL: 'http://localhost:5000/api', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tournament Specific API Methods - Updated to match your new routes
export const tournamentApi = {
  getAll: () => api.get('/tournaments'),
  // ✅ Added /admin segments
  create: (data: any) => api.post('/tournaments/admin/create', data),
  update: (id: number | string, data: any) => api.put(`/tournaments/admin/update/${id}`, data),
  delete: (id: number | string) => api.delete(`/tournaments/admin/delete/${id}`),
};

export default api;