import React from 'react';
import './YardDashboard.css';

const YardDashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">Yard Attendant Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to the Yard Attendant Portal. Select an action from the sidebar to begin.</p>
      </div>
      <div className="dashboard-card">
        <h2 className="card-title">Dashboard Overview</h2>
        <p className="card-subtitle">Select a menu item from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default YardDashboard;
