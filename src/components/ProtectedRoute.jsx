import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleHomeMap = {
  'SUPER_ADMIN': '/admin/dashboard',
  'SUPERADMIN': '/admin/dashboard',
  'ADMIN': '/admin/dashboard',
  'COMPANY_ADMIN': '/company-admin/command-centre',
  'DISPATCHER': '/dispatcher/command-center',
  'DRIVER': '/driver/dashboard',
  'SALES': '/sales/dashboard',
  'WAREHOUSE': '/warehouse/dashboard',
  'YARD': '/yard/dashboard',
  'ACCOUNTS': '/accounts/dashboard',
  'CUSTOMER': '/customer/dashboard'
};

const routePermissions = [
  { prefix: '/admin', allowed: ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN'] },
  { prefix: '/company-admin', allowed: ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'COMPANY_ADMIN'] },
  { prefix: '/sales', allowed: ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'COMPANY_ADMIN', 'SALES'] },
  { prefix: '/dispatcher', allowed: ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'COMPANY_ADMIN', 'DISPATCHER'] },
  { prefix: '/driver', allowed: ['SUPER_ADMIN', 'DRIVER'] },
  { prefix: '/warehouse', allowed: ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'COMPANY_ADMIN', 'WAREHOUSE', 'YARD'] },
  { prefix: '/yard', allowed: ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'COMPANY_ADMIN', 'YARD', 'WAREHOUSE'] },
  { prefix: '/accounts', allowed: ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'COMPANY_ADMIN', 'ACCOUNTS'] },
  { prefix: '/customer', allowed: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'CUSTOMER'] }
];

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = useAuth();
  const token = localStorage.getItem('token');
  const isAuthenticated = auth ? auth.isAuthenticated : !!token;
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

  // Must be strictly authenticated by auth context and have an active token
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const storedSession = JSON.parse(localStorage.getItem('hero_session') || '{}');
  const user = auth?.user || storedSession;
  if (!user || !user.role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const userRole = (user.role || '').toUpperCase().replace(/-/g, '_');

  // Check explicit allowedRoles prop if provided
  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = allowedRoles.some(r => r.toUpperCase().replace(/-/g, '_') === userRole);
    if (!isAllowed) {
      const defaultPath = roleHomeMap[userRole] || '/login';
      return <Navigate to={defaultPath} replace />;
    }
  }

  // Automatic path-based RBAC verification
  for (const rule of routePermissions) {
    if (location.pathname.startsWith(rule.prefix)) {
      if (!rule.allowed.includes(userRole)) {
        const defaultPath = roleHomeMap[userRole] || '/login';
        return <Navigate to={defaultPath} replace />;
      }
      break;
    }
  }

  return children;
};

export default ProtectedRoute;
