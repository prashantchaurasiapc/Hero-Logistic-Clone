import React from 'react';
import './DriverDashboard.css';

const DriverDashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Driver Dashboard</h1>
        <p className="dashboard-subtitle">View jobs, expenses, and contact dispatch.</p>
      </div>
      <div className="dashboard-card">
        <h2 className="card-title">Dashboard Overview</h2>
        <p className="card-subtitle">Select a menu item from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default DriverDashboard;
