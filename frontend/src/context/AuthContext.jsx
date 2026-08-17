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
      // Quietly fetch user details in background
      try {
        const res = await api.get('/auth/me');
        if (res.data && res.data.success) {
          const fetchedUser = res.data.data.user;
          setUser(fetchedUser);
          localStorage.setItem('hero_session', JSON.stringify({
            name: fetchedUser.name,
            role: fetchedUser.role,
            company: fetchedUser.company?.name || 'Hero Logistics',
            email: fetchedUser.email,
            permissions: fetchedUser.permissions || {}
          }));
        } else {
          // If the backend returns success: false
          logout();
        }
      } catch (error) {
        console.warn('Silent token validation failed:', error);
        // If it's a 401, log them out immediately
        if (error.response && error.response.status === 401) {
          logout();
        }
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
        const loggedInUser = res.data.data.user;
        setUser(loggedInUser);
        localStorage.setItem('hero_session', JSON.stringify({
          name: loggedInUser.name,
          role: loggedInUser.role,
          company: loggedInUser.company?.name || 'Hero Logistics',
          email: loggedInUser.email,
          permissions: loggedInUser.permissions || {}
        }));
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
      localStorage.removeItem('hero_session');
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

const defaultAuthValue = {
  user: null,
  isAuthenticated: false,
  loading: false,
  login: async () => ({ success: false, message: 'Auth context not ready' }),
  logout: async () => {},
  checkAuthStatus: async () => {}
};

export const useAuth = () => useContext(AuthContext) || defaultAuthValue;
