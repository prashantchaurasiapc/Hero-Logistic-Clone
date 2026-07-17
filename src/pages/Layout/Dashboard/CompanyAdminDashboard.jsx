import React from 'react';
import './CompanyAdminDashboard.css';

const CompanyAdminDashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">Command Centre</h1>
        <p className="dashboard-subtitle">Company administration and fleet management.</p>
      </div>
      <div className="dashboard-card">
        <h2 className="card-title">Dashboard Overview</h2>
        <p className="card-subtitle">Select a menu item from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default CompanyAdminDashboard;
