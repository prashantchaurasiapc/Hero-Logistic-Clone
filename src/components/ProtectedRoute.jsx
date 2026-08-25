import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  const isAuthenticated = auth ? auth.isAuthenticated : true;
  const loading = auth ? auth.loading : false;
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#1e293b]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white font-semibold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const user = auth?.user || JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = (user.role || '').toUpperCase();

  // Redirect CUSTOMER users away from admin routes to their customer portal
  if (userRole === 'CUSTOMER') {
    if (location.pathname.startsWith('/company-admin/messages')) {
      return <Navigate to="/customer/messages-support" replace />;
    }
    if (
      location.pathname.startsWith('/company-admin') || 
      location.pathname.startsWith('/admin') || 
      location.pathname.startsWith('/dispatcher') || 
      location.pathname.startsWith('/accounts')
    ) {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  // Redirect DISPATCHER users away from admin routes to dispatcher portal
  if (userRole === 'DISPATCHER' && (location.pathname.startsWith('/company-admin') || location.pathname.startsWith('/admin'))) {
    return <Navigate to="/dispatcher/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
