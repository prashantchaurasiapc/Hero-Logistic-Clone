import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dashboardsDir = path.join(__dirname, 'src', 'pages', 'Layout', 'Dashboard');

// Helper to create simple dashboard
const createSimpleDashboard = (name, title, subtitle) => {
  const jsx = `import React from 'react';
import './` + name + `.css';

const ` + name + ` = () => {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">` + title + `</h1>
        <p className="dashboard-subtitle">` + subtitle + `</p>
      </div>
      <div className="dashboard-card">
        <h2 className="card-title">Dashboard Overview</h2>
        <p className="card-subtitle">Select a menu item from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default ` + name + `;
`;

  const css = `.dashboard-wrapper {
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.dashboard-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.dashboard-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px dashed #e2e8f0;
}

.card-title {
  font-size: 18px;
  color: #64748b;
  margin-bottom: 16px;
}

.card-subtitle {
  color: #94a3b8;
}
`;

  fs.writeFileSync(path.join(dashboardsDir, name + '.jsx'), jsx);
  fs.writeFileSync(path.join(dashboardsDir, name + '.css'), css);
};

// Create the simple dashboards
createSimpleDashboard('YardDashboard', 'Yard Attendant Dashboard', 'Welcome to the Yard Attendant Portal. Select an action from the sidebar to begin.');
createSimpleDashboard('SalesDashboard', 'Sales Dashboard', 'Manage leads, pipeline, and sales reports.');
createSimpleDashboard('CompanyAdminDashboard', 'Command Centre', 'Company administration and fleet management.');
createSimpleDashboard('DispatcherDashboard', 'Command Center', 'Dispatch operations and fleet monitoring.');
createSimpleDashboard('DriverDashboard', 'Driver Dashboard', 'View jobs, expenses, and contact dispatch.');

console.log('Simple dashboards created.');
