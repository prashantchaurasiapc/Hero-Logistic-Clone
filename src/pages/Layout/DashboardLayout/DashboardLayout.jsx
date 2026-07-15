import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header';
import './DashboardLayout.css';

/* 
  Unified Layout - pass 'role' prop to render the correct sidebar.
  Usage in App.jsx:  <Route element={<DashboardLayout role="super-admin" />}>
*/
const DashboardLayout = ({ role }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <div className="main-wrapper">
        <Header />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
