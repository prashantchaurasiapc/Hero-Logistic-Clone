import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuthStatus();

    // Listen for unauthorized events from api interceptor
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optimistically assume authenticated if token exists to prevent layout shifting/redirects
      setIsAuthenticated(true);
    }
    
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      if (res.data && res.data.success) {
        setUser(res.data.data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      // If validation fails, clean up token and redirect to login
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        if (res.data.data.accessToken) {
          localStorage.setItem('token', res.data.data.accessToken);
        }
        setUser(res.data.data.user);
        setIsAuthenticated(true);
        return { success: true, user: res.data.data.user };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error?.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed on backend:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
