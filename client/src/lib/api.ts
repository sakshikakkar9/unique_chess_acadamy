import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // 👈 Relies on the Vite proxy we set up!
});

// Automatically attach the Admin Token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token'); // 👈 Fixed key to match your AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;