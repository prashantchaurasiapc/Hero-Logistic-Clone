import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const directLogin = async (email, password) => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('hero_session');
    localStorage.removeItem('hero_company_id');
    localStorage.removeItem('selectedCompanyId');
    localStorage.removeItem('activeCompany');
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_') || key.startsWith('hero_cache_') || key.startsWith('hero_portal_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {}

    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.success) {
      const loggedInUser = res.data.data.user;

      // 🛡️ SECURITY GUARD: Block auto-created fallback users
      const now = Date.now();
      const createdTime = new Date(loggedInUser.createdAt).getTime();
      const isAutoCreatedOnTheFly = !isNaN(createdTime) && (now - createdTime < 60000);

      if (isAutoCreatedOnTheFly) {
        // Auto-delete the fake user from backend so database stays clean
        try {
          if (res.data.data.accessToken && loggedInUser.id) {
            await api.delete(`/users/${loggedInUser.id}`, {
              headers: { Authorization: `Bearer ${res.data.data.accessToken}` }
            });
          }
        } catch (delErr) {}

        localStorage.removeItem('token');
        localStorage.removeItem('hero_session');
        return {
          success: false,
          message: 'Invalid email or password. This email is not registered in HERO Logistics.'
        };
      }

      if (res.data.data.accessToken) {
        localStorage.setItem('token', res.data.data.accessToken);
      }
      localStorage.setItem('hero_session', JSON.stringify({
        name: loggedInUser.name,
        role: loggedInUser.role,
        company: loggedInUser.company?.name || 'Hero Logistics',
        companyId: loggedInUser.companyId || loggedInUser.company?.id || null,
        email: loggedInUser.email,
        permissions: loggedInUser.permissions || {}
      }));

      return { success: true, user: loggedInUser };
    }
    return { success: false, message: 'Invalid response from server' };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.error?.message || error.message || 'Login failed'
    };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();

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
          logout();
        }
      } catch (error) {
        console.warn('Silent token validation notice:', error);
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
    const res = await directLogin(email, password);
    if (res.success) {
      setUser(res.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed on backend:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('hero_session');
      localStorage.removeItem('hero_company_id');
      localStorage.removeItem('selectedCompanyId');
      localStorage.removeItem('activeCompany');
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
  login: directLogin,
  logout: async () => { localStorage.clear(); },
  checkAuthStatus: async () => {}
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx) return ctx;
  return defaultAuthValue;
};
