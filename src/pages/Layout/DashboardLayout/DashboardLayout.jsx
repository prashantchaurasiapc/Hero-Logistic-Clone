import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header';
import './DashboardLayout.css';

/* 
  Unified Layout - pass 'role' prop to render the correct sidebar.
  Usage in App.jsx:  <Route element={<DashboardLayout role="super-admin" />}>
*/
import api from '../../../services/api';

const DashboardLayout = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isImpersonating = localStorage.getItem('hero_impersonating') === 'true';
  const session = JSON.parse(localStorage.getItem('hero_session') || '{}');
  const impersonatedName = session.name;
  const impersonatedRole = session.role;

  const handleExitImpersonation = async () => {
    try {
      const res = await api.post('/auth/impersonate/exit');
      if (res.data?.success) {
        localStorage.removeItem('hero_impersonating');
        const session = JSON.parse(localStorage.getItem('hero_session') || '{}');
        if (session.originalUser) {
          localStorage.setItem('hero_session', JSON.stringify(session.originalUser));
        } else {
          localStorage.removeItem('hero_session');
        }
        window.location.href = '/admin/dashboard';
      }
    } catch (err) {
      console.error(err);
      alert('Failed to exit impersonation session.');
    }
  };

  return (
    <div className="dashboard-layout">
      {isImpersonating && (
        <div className="w-full bg-amber-500 text-black px-6 py-2.5 flex justify-between items-center text-xs font-black tracking-wide border-b border-amber-600 shadow-md z-[99999] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping"></span>
            <span>SYSTEM IMPERSONATION MODE: OPERATING AS {impersonatedName?.toUpperCase()} ({impersonatedRole?.toUpperCase()})</span>
          </div>
          <button
            onClick={handleExitImpersonation}
            className="bg-black hover:bg-slate-800 text-white font-black px-3.5 py-1.5 rounded-lg shadow-sm cursor-pointer transition-colors"
          >
            EXIT SESSION
          </button>
        </div>
      )}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="main-wrapper">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
