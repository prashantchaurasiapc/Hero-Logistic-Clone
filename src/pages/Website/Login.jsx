import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { 
  FiMail, FiLock, FiEye, FiShield, 
  FiBarChart2, FiBriefcase, FiClipboard, 
  FiTruck, FiBox, FiMap, FiFileText, FiShoppingCart 
} from 'react-icons/fi';

const roleCards = [
  { id: 'super-admin', label: 'Super Admin', icon: <FiShield />, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
  { id: 'sales', label: 'Sales', icon: <FiBarChart2 />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { id: 'company-admin', label: 'Company Admin', icon: <FiBriefcase />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { id: 'dispatcher', label: 'Dispatcher', icon: <FiClipboard />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { id: 'driver', label: 'Driver', icon: <FiTruck />, color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)' },
  { id: 'warehouse', label: 'Warehouse Manager', icon: <FiBox />, color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)' },
  { id: 'yard', label: 'Yard Attendant', icon: <FiMap />, color: '#84cc16', bg: 'rgba(132, 204, 22, 0.1)' },
  { id: 'accounts', label: 'Accounts', icon: <FiFileText />, color: '#e11d48', bg: 'rgba(225, 29, 72, 0.1)' },
  { id: 'customer', label: 'Customer', icon: <FiShoppingCart />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }
];

const tags = [
  'Real-time GPS', 'AI Dispatch', 'Driver App', 
  'Warehouse WMS', 'Payroll', 'Customer Portal'
];

const Login = () => {
  const navigate = useNavigate();

  const handleRoleLogin = (roleId) => {
    if (roleId === 'super-admin') {
      navigate('/admin/dashboard');
    } else if (roleId === 'sales') {
      navigate('/sales/dashboard');
    } else if (roleId === 'company-admin') {
      navigate('/company-admin/command-centre');
    } else if (roleId === 'dispatcher') {
      navigate('/dispatcher/command-center');
    } else if (roleId === 'driver') {
      navigate('/driver/jobs');
    } else if (roleId === 'warehouse') {
      navigate('/warehouse/dashboard');
    } else if (roleId === 'yard') {
      navigate('/yard/dashboard');
    } else if (roleId === 'accounts') {
      navigate('/accounts/dashboard');
    } else if (roleId === 'customer') {
      navigate('/customer/dashboard');
    } else {
      // Placeholder for other dashboards
      alert(`Logging in to ${roleId} dashboard...`);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <div className="login-container">
      {/* Left Panel */}
      <div className="login-left">
        <div className="grid-overlay"></div>
        <div className="left-content">
          <div className="login-logo" style={{ marginBottom: '2rem' }}>
            <img src="/image.png" alt="Logo" style={{ height: '56px', width: 'auto', objectFit: 'contain' }} />
          </div>

          <h1 className="hero-headline">
            The Complete<br/>
            <span className="text-yellow">Logistics OS</span>
          </h1>

          <p className="hero-desc">
            Manage fleets, dispatch loads, track drivers, run
            warehouses — all from one powerful platform built
            for modern logistics companies.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">9</span>
              <span className="stat-label">DASHBOARDS</span>
            </div>
            <div className="stat">
              <span className="stat-num">24/7</span>
              <span className="stat-label">LIVE GPS</span>
            </div>
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">UPTIME SLA</span>
            </div>
          </div>

          <div className="hero-tags">
            {tags.map(tag => (
              <span key={tag} className="tag-badge">{tag}</span>
            ))}
          </div>

          <div className="demo-credentials">
            <span className="text-yellow">Demo credentials:</span> admin@hero.com / 123456
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="right-content">
          <h2 className="welcome-title">Welcome back</h2>
          <p className="welcome-desc">Click any dashboard below for instant access, or sign in manually</p>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input type="email" defaultValue="admin@hero.com" />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label>PASSWORD</label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input type="password" defaultValue="123456" />
                <FiEye className="input-icon-right" />
              </div>
            </div>

            <div className="divider">
              <span>OR SIGN IN AS</span>
            </div>

            <div className="roles-grid">
              {roleCards.map(role => (
                <button 
                  key={role.id} 
                  type="button"
                  className="role-card" 
                  style={{ '--card-color': role.color, '--card-bg': role.bg }}
                  onClick={() => handleRoleLogin(role.id)}
                >
                  <div className="role-icon" style={{ color: role.color }}>
                    {role.icon}
                  </div>
                  <span className="role-label">{role.label}</span>
                </button>
              ))}
            </div>

            <div className="signup-link">
              New to platform? <Link to="/register" className="text-yellow font-bold" style={{ textDecoration: 'none' }}>Start Free Trial</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
