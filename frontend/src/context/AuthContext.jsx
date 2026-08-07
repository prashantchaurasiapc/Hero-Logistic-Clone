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
      setIsAuthenticated(true);
      // Quietly fetch user details in background without throwing auth status out
      try {
        const res = await api.get('/auth/me');
        if (res.data && res.data.success) {
          setUser(res.data.data.user);
        }
      } catch (error) {
        console.warn('Silent token validation failed:', error);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
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
