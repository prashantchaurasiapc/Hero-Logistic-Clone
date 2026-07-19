import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import {
  FiGrid, FiUsers, FiKey, FiLayers, FiShield,
  FiTag, FiHelpCircle, FiDollarSign, FiBarChart2,
  FiActivity, FiCpu, FiSettings, FiLogOut,
  FiBox, FiNavigation, FiTruck, FiMapPin,
  FiHome, FiMessageSquare, FiAlertTriangle,
  FiChevronDown, FiChevronUp, FiClipboard,
  FiInbox, FiZap, FiSend, FiClock,
  FiBell, FiFileText, FiPlus, FiCalendar,
  FiAlertCircle, FiBriefcase, FiLogIn, FiLogOut as FiLogOutIcon,
  FiPackage, FiMaximize
} from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';

/* ============================================================
   ROLE CONFIGS - Add/remove menu items here for each role
   ============================================================ */
const roleConfigs = {
  'super-admin': {
    portalName: 'SUPER ADMIN PORTAL',
    basePath: '/admin',
    userName: 'Role: Super Admin',
    userRole: 'PLATFORM OWNER',
    menuItems: [
      { icon: <FiGrid />, label: 'Platform Dashboard', path: '/admin/dashboard' },
      { icon: <FiUsers />, label: 'Companies', path: '/admin/companies' },
      { icon: <FiKey />, label: 'Subscriptions', path: '/admin/subscriptions' },
      { icon: <FiLayers />, label: 'Membership Plans', path: '/admin/membership-plans' },
      { icon: <FiShield />, label: 'Feature Access', path: '/admin/feature-access' },
      { icon: <FiTag />, label: 'White Label', path: '/admin/white-label' },
      { icon: <FiHelpCircle />, label: 'Support Tickets', path: '/admin/support-tickets' },
      { icon: <FiDollarSign />, label: 'Billing', path: '/admin/billing' },
      { icon: <FiBarChart2 />, label: 'System Analytics', path: '/admin/system-analytics' },
      { icon: <FiActivity />, label: 'Inter-Company Transfers', path: '/admin/inter-company-transfers' },
      { icon: <FiCpu />, label: 'AI Controls', path: '/admin/ai-controls' },
      { icon: <FiSettings />, label: 'Settings', path: '/admin/settings' },
    ],
  },

  'sales': {
    portalName: 'SALES PORTAL',
    basePath: '/sales',
    userName: 'Admin',
    userRole: 'SALES',
    menuItems: [
      { icon: <FiGrid />, label: 'Sales Dashboard', path: '/sales/dashboard' },
      { icon: <FiUsers />, label: 'Leads', path: '/sales/leads' },
      { icon: <FiLayers />, label: 'Pipeline Board', path: '/sales/pipeline-board' },
      { icon: <FiCalendar />, label: 'Demo Bookings', path: '/sales/demo-bookings' },
      { icon: <FiUsers />, label: 'Trial Companies', path: '/sales/trial-companies' },
      { icon: <FiFileText />, label: 'Proposals', path: '/sales/proposals' },
      { icon: <FiClock />, label: 'Follow-Ups', path: '/sales/follow-ups' },
      { icon: <FiBriefcase />, label: 'Onboarding Handover', path: '/sales/onboarding-handover' },
      { icon: <FiBarChart2 />, label: 'Sales Reports', path: '/sales/sales-reports' },
      { icon: <FiSettings />, label: 'Settings', path: '/sales/settings' },
    ],
  },

  'company-admin': {
    portalName: 'ADMIN PORTAL',
    basePath: '/company-admin',
    userName: 'Admin',
    userRole: 'COMPANY ADMIN',
    hasSubMenus: true,
    menuItems: [
      { icon: <FiGrid />, label: 'Command Centre', path: '/company-admin/command-centre' },
      { icon: <FiBox />, label: 'Loads', path: '/company-admin/loads' },
      { icon: <FiNavigation />, label: 'Live Tracking', path: '/company-admin/live-tracking' },
      { icon: <FiUsers />, label: 'Drivers', path: '/company-admin/drivers' },
      { icon: <FiTruck />, label: 'Vehicles', path: '/company-admin/vehicles' },
      { icon: <FiUsers />, label: 'Customers', path: '/company-admin/customers' },
      { icon: <FiMapPin />, label: 'Branches', path: '/company-admin/branches' },
      { icon: <FiLayers />, label: 'Assets', path: '/company-admin/assets' },
      { icon: <FiHome />, label: 'Warehouse', path: '/company-admin/warehouse' },
      { icon: <FiDollarSign />, label: 'Finance', path: '/company-admin/finance' },
      { icon: <FiBarChart2 />, label: 'Reports', path: '/company-admin/reports' },
      { icon: <FiMessageSquare />, label: 'Messages', path: '/company-admin/messages', badge: '8' },
    ],
    subMenus: [
      {
        key: 'support',
        icon: <FiHelpCircle />,
        label: 'Support Centre',
        items: [
          { label: 'My Tickets', path: '/company-admin/my-tickets' },
          { label: 'Open Tickets', path: '/company-admin/open-tickets' },
          { label: 'Knowledge Base', path: '/company-admin/knowledge-base' },
        ],
      },
      {
        key: 'settings',
        icon: <FiSettings />,
        label: 'Settings',
        items: [
          { label: 'Company Settings', path: '/company-admin/company-settings' },
          { label: 'Subscription & Billing', path: '/company-admin/subscription-billing' },
          { label: 'My Profile', path: '/company-admin/my-profile' },
        ],
      },
    ],
    extraItems: [
      { icon: <FiShield />, label: 'Safety Checklists', path: '/company-admin/safety-checklists' },
      { icon: <FiAlertTriangle />, label: 'Delivery Issues', path: '/company-admin/delivery-issues' },
    ],
  },

  'dispatcher': {
    portalName: 'DISPATCHER PORTAL',
    basePath: '/dispatcher',
    userName: 'Sarah Mitchell',
    userRole: 'DISPATCHER',
    menuItems: [
      { icon: <FiGrid />, label: 'Command Center', path: '/dispatcher/command-center' },
      { icon: <FiLayers />, label: 'Loads', path: '/dispatcher/loads' },
      { icon: <FiInbox />, label: 'Load Inbox', path: '/dispatcher/load-inbox' },
      { icon: <FiZap />, label: 'Terminal Workspace', path: '/dispatcher/terminal-workspace' },
      { icon: <FiSend />, label: 'Fleet Monitor', path: '/dispatcher/fleet-monitor' },
      { icon: <FiTruck />, label: 'Fleet Assets', path: '/dispatcher/fleet-assets' },
      { icon: <FiClipboard />, label: 'Asset Inventory', path: '/dispatcher/asset-inventory' },
      { icon: <FiUsers />, label: 'Roster Control', path: '/dispatcher/roster-control' },
      { icon: <FiMessageSquare />, label: 'Communication Depot', path: '/dispatcher/communication-depot' },
      { icon: <FiSettings />, label: 'System Settings', path: '/dispatcher/system-settings' },
    ],
  },

  'driver': {
    portalName: 'DRIVER PORTAL',
    basePath: '/driver',
    userName: 'Noah Williams',
    userRole: 'DRIVER',
    avatarLetter: 'N',
    menuItems: [
      { icon: <FiClock />, label: 'Start Work / Finish Work', path: '/driver/work-status' },
      { icon: <FiGrid />, label: 'Jobs', path: '/driver/jobs' },
      { icon: <FiMapPin />, label: 'Nearby Services', path: '/driver/nearby-services' },
      { icon: <FiBell />, label: 'Notifications', path: '/driver/notifications' },
      { icon: <FiFileText />, label: 'Documents', path: '/driver/documents' },
      { icon: <FiPlus />, label: 'Create Draft Load', path: '/driver/create-draft-load' },
      { icon: <FiDollarSign />, label: 'Add Expense', path: '/driver/add-expense' },
      { icon: <FiBarChart2 />, label: 'My Pay', path: '/driver/my-pay' },
      { icon: <FiMessageSquare />, label: 'Contact Dispatch', path: '/driver/contact-dispatch' },
      { icon: <FiCalendar />, label: 'Leave Management', path: '/driver/leave-management' },
      { icon: <FiAlertCircle />, label: 'Incident Reporting', path: '/driver/incident-reporting' },
      { icon: <FiTruck />, label: 'Maintenance Request', path: '/driver/maintenance-request' },
    ],
  },

  'warehouse': {
    portalName: 'WAREHOUSE PORTAL',
    basePath: '/warehouse',
    userName: 'Admin',
    userRole: 'WAREHOUSE MANAGER',
    menuItems: [
      { icon: <FiGrid />, label: 'Dashboard', path: '/warehouse/dashboard' },
      { icon: <FiLogIn />, label: 'Inbound', path: '/warehouse/inbound' },
      { icon: <FiLogOut />, label: 'Outbound', path: '/warehouse/outbound' },
      { icon: <FiPackage />, label: 'Current Stock', path: '/warehouse/current-stock' },
      { icon: <FiMapPin />, label: 'Yard / Warehouse Map', path: '/warehouse/map' },
      { icon: <FiBox />, label: 'Holding Areas', path: '/warehouse/holding-areas' },
      { icon: <FiLayers />, label: 'Load Lanes', path: '/warehouse/load-lanes' },
      { icon: <FiMaximize />, label: 'Scanning', path: '/warehouse/scanning' },
      { icon: <FiTag />, label: 'Labels', path: '/warehouse/labels' },
      { icon: <FiActivity />, label: 'Movements', path: '/warehouse/movements' },
      { icon: <FiFileText />, label: 'Reports', path: '/warehouse/reports' },
    ],
  },

  'yard': {
    portalName: 'YARD ATTENDANT PORTAL',
    basePath: '/yard',
    userName: 'Admin',
    userRole: 'YARD ATTENDANT',
    menuItems: [
      { icon: <FiClock />, label: 'Start Work / Finish Work', path: '/yard/work-status' },
      { icon: <FiGrid />, label: 'Assigned tasks', path: '/yard/dashboard' },
      { icon: <BsQrCodeScan />, label: 'Scan button', path: '/yard/scan' },
      { icon: <FiTruck />, label: 'Move item', path: '/yard/move-item' },
      { icon: <BsQrCodeScan />, label: 'Scan into location', path: '/yard/scan-in' },
      { icon: <BsQrCodeScan />, label: 'Scan out of location', path: '/yard/scan-out' },
      { icon: <FiLayers />, label: 'Load lane assignment', path: '/yard/load-lane' },
      { icon: <FiAlertTriangle />, label: 'Report issue', path: '/yard/report-issue' },
    ],
  },

  'accounts': {
    portalName: 'ACCOUNT PORTAL',
    basePath: '/accounts',
    userName: 'Admin',
    userRole: 'ACCOUNTS',
    menuItems: [
      { icon: <FiGrid />, label: 'Accounts Dashboard', path: '/accounts/dashboard' },
      { icon: <FiFileText />, label: 'Invoice Review', path: '/accounts/invoice-review' },
      { icon: <FiFileText />, label: 'Sent Invoices', path: '/accounts/sent-invoices' },
      { icon: <FiDollarSign />, label: 'Payments', path: '/accounts/payments' },
      { icon: <FiUsers />, label: 'Payroll', path: '/accounts/payroll' },
      { icon: <FiDollarSign />, label: 'Contractor Pay', path: '/accounts/contractor-pay' },
      { icon: <FiUsers />, label: 'Employee Pay', path: '/accounts/employee-pay' },
      { icon: <FiDollarSign />, label: 'Expenses', path: '/accounts/expenses' },
      { icon: <FiFileText />, label: 'GST / PAYG', path: '/accounts/gst-payg' },
      { icon: <FiBarChart2 />, label: 'P&L', path: '/accounts/pnl' },
      { icon: <FiBarChart2 />, label: 'Vehicle Costs', path: '/accounts/vehicle-costs' },
      { icon: <FiFileText />, label: 'Reports', path: '/accounts/reports' },
    ],
  },

  'customer': {
    portalName: 'CUSTOMER PORTAL',
    basePath: '/customer',
    userName: 'Admin',
    userRole: 'CUSTOMER',
    menuItems: [
      { icon: <FiGrid />, label: 'Dashboard', path: '/customer/dashboard' },
      { icon: <FiLayers />, label: 'My Loads', path: '/customer/my-loads' },
      { icon: <FiNavigation />, label: 'Track Delivery', path: '/customer/track-delivery' },
      { icon: <FiFileText />, label: 'Documents', path: '/customer/documents' },
      { icon: <FiDollarSign />, label: 'Invoices', path: '/customer/invoices' },
      { icon: <FiDollarSign />, label: 'Payments', path: '/customer/payments' },
      { icon: <FiPlus />, label: 'Load Requests', path: '/customer/load-requests' },
      { icon: <FiBell />, label: 'Notifications', path: '/customer/notifications' },
      { icon: <FiMessageSquare />, label: 'Dispatcher Chat', path: '/customer/dispatcher-chat' },
      { icon: <FiHelpCircle />, label: 'Support', path: '/customer/support' },
      { icon: <FiSettings />, label: 'Settings', path: '/customer/settings' },
    ],
  },
};

/* ============================================================
   SIDEBAR COMPONENT
   ============================================================ */
const Sidebar = ({ role, isOpen, onClose }) => {
  const navigate = useNavigate();
  const config = roleConfigs[role];
  const [openSubMenus, setOpenSubMenus] = useState({});

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  if (!config) return null;

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleSubMenu = (menu) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const avatarLetter = config.avatarLetter || config.userName?.charAt(0) || 'A';

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ position: 'relative' }}>
        {onClose && (
           <button 
             onClick={onClose} 
             className="sidebar-close-btn d-lg-none" 
             style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 24, display: window.innerWidth <= 1024 ? 'block' : 'none' }}
           >
             &times;
           </button>
        )}
        <div className="logo-container">
          <img src="/image.png" alt="Logo" className="sidebar-logo" />
        </div>
        <div className="portal-badge">
          <FiShield className="portal-icon" />
          {config.portalName.includes('\n') ? (
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
              {config.portalName.split('\n').map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </span>
          ) : (
            <span>{config.portalName}</span>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {config.menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="menu-badge">{item.badge}</span>}
              </NavLink>
            </li>
          ))}

          {/* Submenus (Company Admin) */}
          {config.subMenus?.map((sub) => (
            <li key={sub.key}>
              <div
                className={`nav-item submenu-toggle ${openSubMenus[sub.key] ? 'open' : ''}`}
                onClick={() => toggleSubMenu(sub.key)}
              >
                <span className="nav-icon">{sub.icon}</span>
                <span className="nav-label">{sub.label}</span>
                {openSubMenus[sub.key] ? <FiChevronUp className="chevron" /> : <FiChevronDown className="chevron" />}
              </div>
              {openSubMenus[sub.key] && (
                <ul className="submenu">
                  {sub.items.map((subItem, i) => (
                    <li key={i}>
                      <NavLink
                        to={subItem.path}
                        className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                        onClick={handleNavClick}
                      >
                        {subItem.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* Extra items after submenus (Company Admin) */}
          {config.extraItems?.map((item, index) => (
            <li key={`extra-${index}`}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar-placeholder">{avatarLetter}</div>
          <div className="user-info">
            <span className="role-text">{config.userName}</span>
            <span className="platform-owner">{config.userRole}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
