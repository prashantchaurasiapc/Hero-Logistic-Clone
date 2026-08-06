import axios from 'axios';

const api = axios.create({
  // In development, this points to the backend running on localhost:5000
  // In production, it would be the real API URL
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Crucial for sending HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSuperAdminDashboard = () => {
  return api.get('/super-admin/dashboard');
};

// Request Interceptor to add access token header dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for handling 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      // Skip interceptor loop for auth check and logout endpoints
      if (originalRequest.url && (originalRequest.url.includes('/auth/me') || originalRequest.url.includes('/auth/logout') || originalRequest.url.includes('/auth/login'))) {
        return Promise.reject(error);
      }
      
      // If we get a 401 on a normal request, it means the token is invalid or expired
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
