import axios from 'axios';

// Central API Base URL from Environment (never hardcoded)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatic JWT Bearer Token Injection & URL Normalization
apiClient.interceptors.request.use(
  (config) => {
    // Prevent double /api/api if caller passes '/api/...'
    if (config.url && config.url.startsWith('/api/')) {
      config.url = config.url.replace(/^\/api/, '');
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Graceful Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 Unauthorized if needed
      // localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
