import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import {
  FiGrid, FiUsers, FiKey, FiLayers, FiShield,
  FiTag, FiHelpCircle, FiDollarSign, FiBarChart2,
  FiActivity, FiCpu, FiSettings, FiLogOut, FiUser,
  FiBox, FiNavigation, FiTruck, FiMapPin, FiSearch,
  FiHome, FiMessageSquare, FiAlertTriangle,
  FiChevronDown, FiChevronUp, FiClipboard,
  FiInbox, FiZap, FiSend, FiClock,
  FiBell, FiFileText, FiPlus, FiCalendar,
  FiAlertCircle, FiBriefcase, FiLogIn, FiLogOut as FiLogOutIcon,
  FiPackage, FiMaximize, FiCheckCircle, FiRefreshCw, FiCloudOff,
  FiSliders
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
    hasSubMenus: true,
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
    ],
    subMenus: [
      {
        key: 'user-management',
        icon: <FiUsers />,
        label: 'User Management',
        items: [
          { label: 'Users', path: '/admin/users' },
          { label: 'Roles & Permissions', path: '/admin/roles-permissions' },
        ],
      },
    ],
    extraItems: [
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
      { icon: <FiUsers />, label: 'Customers', path: '/company-admin/customers' },
      { icon: <FiBox />, label: 'Loads', path: '/company-admin/loads' },

      { icon: <FiUsers />, label: 'Drivers', path: '/company-admin/drivers' },
      { icon: <FiTruck />, label: 'Vehicles', path: '/company-admin/vehicles' },
      { icon: <FiLayers />, label: 'Assets', path: '/company-admin/assets' },
      { icon: <FiHome />, label: 'Warehouse', path: '/company-admin/warehouse' },
      { icon: <FiMapPin />, label: 'Locations', path: '/company-admin/locations' },
      { icon: <FiTag />, label: 'Pricing', path: '/company-admin/pricing' },
      { icon: <FiDollarSign />, label: 'Payroll', path: '/company-admin/payroll' },
      { icon: <FiDollarSign />, label: 'Finance', path: '/company-admin/finance' },
      { icon: <FiFileText />, label: 'Documents', path: '/company-admin/documents' },
      { icon: <FiNavigation />, label: 'Live Tracking', path: '/company-admin/live-tracking' },
      { icon: <FiBarChart2 />, label: 'Reports & Analytics', path: '/company-admin/reports' },
      { icon: <FiMessageSquare />, label: 'Messages', path: '/company-admin/messages', badge: '8' },
    ],
    subMenus: [
      {
        key: 'support',
        icon: <FiHelpCircle />,
        label: 'Support & Knowledge Base',
        items: [
          { label: 'My Tickets', path: '/company-admin/my-tickets' },
          { label: 'Open Tickets', path: '/company-admin/open-tickets' },
          { label: 'Knowledge Base', path: '/company-admin/knowledge-base' },
        ],
      },
    ],
    extraItems: [
      { icon: <FiShield />, label: 'Roles & Permissions', path: '/company-admin/roles-permissions' },
      { icon: <FiSettings />, label: 'Settings', path: '/company-admin/company-settings' },
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
      { icon: <FiGrid />, label: 'Dispatch Dashboard', path: '/dispatcher/dashboard' },
      { icon: <FiPlus />, label: 'Create Load', path: '/dispatcher/create-load' },
      { icon: <FiBox />, label: 'Active Loads', path: '/dispatcher/active-loads' },
      { icon: <FiLayers />, label: 'Planning Board', path: '/dispatcher/planning-board' },
      { icon: <FiNavigation />, label: 'Live GPS Map', path: '/dispatcher/live-gps-map' },
      { icon: <FiUsers />, label: 'Drivers', path: '/dispatcher/drivers' },
      { icon: <FiTruck />, label: 'Vehicles / Trailers', path: '/dispatcher/vehicles' },
      { icon: <FiUsers />, label: 'Customers', path: '/dispatcher/customers' },
      { icon: <FiHome />, label: 'Yard / Warehouse', path: '/dispatcher/warehouse' },
      { icon: <FiClipboard />, label: 'Workforce Availability', path: '/dispatcher/workforce-availability' },
      { icon: <FiMessageSquare />, label: 'Messages', path: '/dispatcher/messages' },
      { icon: <FiBarChart2 />, label: 'Reports & Analytics', path: '/dispatcher/reports' },
    ],
    extraItems: [
      { icon: <FiUser />, label: 'Profile', path: '/dispatcher/profile' },
    ],
  },

  'driver': {
    portalName: 'DRIVER PORTAL',
    basePath: '/driver',
    userName: 'Noah Williams',
    userRole: 'DRIVER',
    avatarLetter: 'N',
    menuItems: [
      { icon: <FiHome />, label: 'Driver Dashboard', path: '/driver/dashboard' },
      { icon: <FiClock />, label: 'Start Work / Finish Work', path: '/driver/safety-checklist' },
      { icon: <FiGrid />, label: 'Assigned Jobs', path: '/driver/assigned-jobs' },
      { icon: <BsQrCodeScan />, label: 'Pickup & Loading', path: '/driver/pickup-loading' },
      { icon: <FiNavigation />, label: 'Dispatch & Active Run', path: '/driver/active-run' },
      { icon: <FiCheckCircle />, label: 'Delivery & POD', path: '/driver/delivery-pod' },
      { icon: <FiDollarSign />, label: 'Fuel & Expenses', path: '/driver/fuel-expenses' },
      { icon: <FiMessageSquare />, label: 'Messages', path: '/driver/messages' },
      { icon: <FiFileText />, label: 'Documents & Compliance', path: '/driver/documents' },
      { icon: <FiClock />, label: 'Timesheets / Clock In-Out', path: '/driver/timesheets' },
      { icon: <FiBarChart2 />, label: 'Payroll & Pay History', path: '/driver/my-pay' },
      { icon: <FiRefreshCw />, label: 'Trailer Swap', path: '/driver/trailer-swap' },
      { icon: <FiCloudOff />, label: 'Offline Sync', path: '/driver/offline-sync' },
    ],
  },

  'warehouse': {
    portalName: 'WAREHOUSE PORTAL',
    basePath: '/warehouse',
    userName: 'James Patel',
    userRole: 'WAREHOUSE MANAGER',
    hasSubMenus: true,
    menuItems: [
      { icon: <FiHome />, label: 'Dashboard', path: '/warehouse/dashboard' },
      { icon: <FiSearch />, label: 'Find Stock', path: '/warehouse/find-stock' },
      { icon: <FiLogIn />, label: 'Receive (Inbound)', path: '/warehouse/receive-inbound' },
      { icon: <FiRefreshCw />, label: 'Move / Transfer', path: '/warehouse/move-transfer' },
      { icon: <FiTruck />, label: 'Load Lanes', path: '/warehouse/load-lanes' },
      { icon: <FiTruck />, label: 'Dispatch Ready', path: '/warehouse/dispatch-ready' },
      { icon: <FiClock />, label: 'Stage (Holding Areas)', path: '/warehouse/holding-areas' },
      { icon: <FiClock />, label: 'Movement History', path: '/warehouse/movement-history' },
      { icon: <FiMessageSquare />, label: 'Messages', path: '/warehouse/messages' },
      { icon: <FiClock />, label: 'My Shift', path: '/warehouse/my-shift' },
      { icon: <FiMapPin />, label: 'Warehouse & Yard Map', path: '/warehouse/warehouse-yard-map' },
      { icon: <FiBarChart2 />, label: 'Reports & Analytics', path: '/warehouse/reports' },
    ],
    subMenus: [
      {
        key: 'tools',
        icon: <FiSliders />,
        label: 'Tools',
        items: [
          { label: 'Labels & Barcodes', path: '/warehouse/tools/labels' },
          { label: 'Print Documents', path: '/warehouse/tools/print-documents' },
          { label: 'QR Scanner', path: '/warehouse/tools/qr-scanner' },
          { label: 'Import / Export', path: '/warehouse/tools/import-export' },
          { label: 'Batch Printing', path: '/warehouse/tools/batch-printing' },
        ],
      },
    ],
    extraItems: [
      { icon: <FiUser />, label: 'Profile', path: '/warehouse/profile' },
    ],
  },

  'yard': {
    portalName: 'YARD ATTENDANT PORTAL',
    basePath: '/yard',
    userName: 'Alex Rivera',
    userRole: 'YARD ATTENDANT',
    menuItems: [
      { icon: <FiClock />, label: 'Start Work / Finish Work', path: '/yard/work-status' },
      { icon: <FiGrid />, label: 'Dashboard', path: '/yard/dashboard' },
      { icon: <FiLogIn />, label: 'Receive (Inbound Intake)', path: '/yard/inbound' },
      { icon: <FiSearch />, label: 'Find & Search', path: '/yard/current-stock' },
      { icon: <FiActivity />, label: 'Move', path: '/yard/movements' },
      { icon: <FiBox />, label: 'Stage Inventory', path: '/yard/holding-areas' },
      { icon: <FiLayers />, label: 'Load Lane Management', path: '/yard/load-lanes' },
      { icon: <FiTruck />, label: 'Vehicles', path: '/yard/vehicles' },
      { icon: <FiMapPin />, label: 'Locations', path: '/yard/locations' },
      { icon: <FiPackage />, label: 'Loads', path: '/yard/loads' },
      { icon: <FiActivity />, label: 'Activities', path: '/yard/activities' },
      { icon: <BsQrCodeScan />, label: 'QR/Barcode Scan', path: '/yard/scanning' },
      { icon: <FiMapPin />, label: 'Yard & Warehouse Map', path: '/yard/map' },
      { icon: <FiLogOutIcon />, label: 'Outbound Dispatch', path: '/yard/outbound' },
      { icon: <FiTag />, label: 'Labels & Barcodes', path: '/yard/labels' },
      { icon: <FiBarChart2 />, label: 'Reports & Analytics', path: '/yard/reports' },
      { icon: <FiAlertTriangle />, label: 'Report Issue', path: '/yard/report-issue' },
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
      {icon: <FiFileText />, label: 'Reports', path: '/accounts/reports' },
      { icon: <FiUser />, label: 'Profile', path: '/accounts/profile' },
    ],
  },

  'customer': {
    portalName: 'CUSTOMER PORTAL',
    basePath: '/customer',
    userName: 'ABC Transport Solutions',
    userRole: 'CUSTOMER PORTAL',
    menuItems: [
      { icon: <FiHome />, label: 'Dashboard', path: '/customer/dashboard' },
      { icon: <FiBox />, label: 'My Loads', path: '/customer/my-loads' },
      { icon: <FiPlus />, label: 'Create Booking', path: '/customer/create-booking' },
      { icon: <FiDollarSign />, label: 'Invoices & Payments', path: '/customer/invoices-payments' },
      { icon: <FiFileText />, label: 'Documents & PODs', path: '/customer/documents-pods' },
      { icon: <FiMessageSquare />, label: 'Messages & Support', path: '/customer/messages-support' },
      { icon: <FiUser />, label: 'Account & Users', path: '/customer/account-users' },
      { icon: <FiSettings />, label: 'Settings', path: '/customer/settings' },
    ],
  },
};

/* ============================================================
   SIDEBAR COMPONENT
   ============================================================ */
const Sidebar = ({ role, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const config = roleConfigs[role];

  // Helper to check if path matches current location robustly
  const isPathActive = (itemPath) => {
    if (!itemPath || !config) return false;
    const current = location.pathname.toLowerCase().replace(/\/$/, '');
    const target = itemPath.toLowerCase().replace(/\/$/, '');

    if (current === target) return true;

    // Check all dashboard alias routes for dispatcher, company-admin, warehouse, etc.
    const isDashboardTarget = 
      target.endsWith('/dashboard') || 
      target.endsWith('/command-centre') || 
      target.endsWith('/command-center');

    const isCurrentDashboardAlias = 
      current === config.basePath.toLowerCase() ||
      current.endsWith('/dashboard') ||
      current.endsWith('/dispatch-dashboard') ||
      current.endsWith('/command-centre') ||
      current.endsWith('/command-center');

    if (isDashboardTarget && isCurrentDashboardAlias) {
      return true;
    }

    // Match sub-routes (e.g. /warehouse/tools/labels matching /warehouse/tools)
    if (target !== config.basePath.toLowerCase() && current.startsWith(target + '/')) {
      return true;
    }

    return false;
  };

  const [openSubMenus, setOpenSubMenus] = useState({});

  // Auto-expand submenus when a child link is active
  useEffect(() => {
    if (config?.subMenus) {
      const updated = { ...openSubMenus };
      config.subMenus.forEach(sub => {
        const hasActiveChild = sub.items.some(item => isPathActive(item.path));
        if (hasActiveChild) {
          updated[sub.key] = true;
        }
      });
      setOpenSubMenus(updated);
    }
  }, [location.pathname, role]);

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  if (!config) return null;

  const handleLogout = () => {
    // Clear session on logout
    localStorage.removeItem('hero_session');
    navigate('/login');
  };

  const toggleSubMenu = (menu) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Get dynamic session values if they exist
  let userName = config.userName;
  let portalName = config.portalName;
  let avatarLetter = config.avatarLetter || config.userName?.charAt(0) || 'A';

  if (role === 'company-admin') {
    const sessionStr = localStorage.getItem('hero_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.name) {
          userName = session.name;
          avatarLetter = session.name.charAt(0).toUpperCase();
        }
        if (session.company) {
          portalName = session.company.toUpperCase() + ' PORTAL';
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

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
          {portalName.includes('\n') ? (
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
              {portalName.split('\n').map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </span>
          ) : (
            <span>{portalName}</span>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {config.menuItems.map((item, index) => {
            const active = isPathActive(item.path);
            return (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className={item.badge === 'AI' ? 'menu-badge-ai' : 'menu-badge'}>{item.badge}</span>}
                </NavLink>
              </li>
            );
          })}

          {/* Submenus (Company Admin / Warehouse Tools) */}
          {config.subMenus?.map((sub) => {
            const hasActiveChild = sub.items.some(item => isPathActive(item.path));
            return (
              <React.Fragment key={sub.key}>
                {sub.header && (
                  <div className="sidebar-section-header">{sub.header}</div>
                )}
                <li>
                  <div
                    className={`nav-item submenu-toggle ${openSubMenus[sub.key] ? 'open' : ''} ${hasActiveChild ? 'parent-active' : ''}`}
                    onClick={() => toggleSubMenu(sub.key)}
                  >
                    <span className="nav-icon">{sub.icon}</span>
                    <span className="nav-label">{sub.label}</span>
                    {openSubMenus[sub.key] ? <FiChevronUp className="chevron" /> : <FiChevronDown className="chevron" />}
                  </div>
                  {openSubMenus[sub.key] && (
                    <ul className="submenu">
                      {sub.items.map((subItem, i) => {
                        const subActive = isPathActive(subItem.path);
                        return (
                          <li key={i}>
                            <NavLink
                              to={subItem.path}
                              className={`submenu-item ${subActive ? 'active' : ''}`}
                              onClick={handleNavClick}
                            >
                              {subItem.label}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              </React.Fragment>
            );
          })}

          {/* Extra items after submenus (Company Admin) */}
          {config.extraItems?.map((item, index) => {
            const extraActive = isPathActive(item.path);
            return (
              <li key={`extra-${index}`}>
                <NavLink
                  to={item.path}
                  className={`nav-item ${extraActive ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar-placeholder">{avatarLetter}</div>
          <div className="user-info">
            <span className="role-text">{userName}</span>
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
