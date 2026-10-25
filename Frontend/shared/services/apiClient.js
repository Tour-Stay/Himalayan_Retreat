import axios from 'axios';

// Central API Base URL Resolution
// 1. Uses explicit VITE_API_URL if configured
// 2. In production (Netlify), defaults to deployed Render backend
// 3. In local dev, defaults to localhost:5000/api
// 4. Guarantees the /api route prefix is present
const getApiBase = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    envUrl = import.meta.env.PROD
      ? 'https://himalayan-retreat.onrender.com/api'
      : 'http://localhost:5000/api';
  }
  let cleaned = envUrl.trim().replace(/\/+$/, '');
  if (!cleaned.endsWith('/api')) {
    cleaned = `${cleaned}/api`;
  }
  return cleaned;
};

const API_BASE = getApiBase();

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
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth-expired'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
