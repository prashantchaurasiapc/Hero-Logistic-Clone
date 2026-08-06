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

// Response Interceptor for handling 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get a 401, it means the token is invalid or expired
      // In a more complex app, we might try to call /auth/refresh here
      // For now, we dispatch a custom event that AuthContext can listen to for logout
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
