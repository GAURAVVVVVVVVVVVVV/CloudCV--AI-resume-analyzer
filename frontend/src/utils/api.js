import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Resume
export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  list: () => api.get('/resume/list'),
  get: (id) => api.get(`/resume/${id}`),
  delete: (id) => api.delete(`/resume/${id}`),
};

// Analysis
export const analysisAPI = {
  analyze: (data) => api.post('/analysis/analyze', data),
  history: () => api.get('/analysis/history'),
  get: (id) => api.get(`/analysis/${id}`),
};

// User
export const userAPI = {
  profile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
};

export default api;
