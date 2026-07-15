import React from 'react';
import './DispatcherDashboard.css';

const DispatcherDashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Command Center</h1>
        <p className="dashboard-subtitle">Dispatch operations and fleet monitoring.</p>
      </div>
      <div className="dashboard-card">
        <h2 className="card-title">Dashboard Overview</h2>
        <p className="card-subtitle">Select a menu item from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default DispatcherDashboard;
