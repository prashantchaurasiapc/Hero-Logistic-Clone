import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../context/AuthContext';
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiLogIn,
  FiBarChart2, FiBriefcase, FiClipboard,
  FiTruck, FiBox, FiMap, FiFileText, FiShoppingCart, FiArrowLeft
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeProvider';

const roleCards = [
  { id: 'super-admin', label: 'Super Admin', icon: <FiShield />, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
  { id: 'company-admin', label: 'Company Admin', icon: <FiBriefcase />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { id: 'sales', label: 'Sales', icon: <FiBarChart2 />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
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
  const { login } = useAuth();
  const { logoUrl } = useTheme() || {};
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loggingInRole, setLoggingInRole] = useState('');
  const [logoSrc, setLogoSrc] = useState('/image.png');
  const [errorMsg, setErrorMsg] = useState('');

  // Input states
  const [emailInput, setEmailInput] = useState('admin@hero.com');
  const [passwordInput, setPasswordInput] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/image.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // If the pixel is dark gray/black (R < 35, G < 35, B < 35), make it transparent
          if (r < 35 && g < 35 && b < 35) {
            data[i + 3] = 0; // alpha channel to 0
          }
        }
        ctx.putImageData(imgData, 0, 0);
        setLogoSrc(canvas.toDataURL());
      }
    };
  }, []);

  const handleRoleLogin = (roleId) => {
    const roleEmail = roleId === 'super-admin' ? 'admin@hero.com' : `${roleId}@hero.com`;
    setEmailInput(roleEmail);
    setPasswordInput('123456');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsAuthenticating(true);
    setLoggingInRole('Loading...');

    const res = await login(emailInput, passwordInput);
    
    if (res.success) {
      const userRole = res.user?.role || 'SUPER_ADMIN';
      setLoggingInRole(userRole);
      
      let targetPath = '/admin/dashboard';
      if (userRole === 'DRIVER') targetPath = '/driver/dashboard';
      else if (userRole === 'DISPATCHER') targetPath = '/dispatcher/command-center';
      else if (userRole === 'COMPANY_ADMIN') targetPath = '/company-admin/command-centre';
      else if (userRole === 'SALES') targetPath = '/sales/dashboard';
      else if (userRole === 'WAREHOUSE') targetPath = '/warehouse/dashboard';
      else if (userRole === 'YARD') targetPath = '/yard/dashboard';
      else if (userRole === 'ACCOUNTS') targetPath = '/accounts/dashboard';
      else if (userRole === 'CUSTOMER') targetPath = '/customer/dashboard';

      setTimeout(() => {
        navigate(targetPath);
      }, 1600);
    } else {
      setIsAuthenticating(false);
      setErrorMsg(res.message || 'Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      {/* Dynamic Keyframes Animation Injection */}
      <style>{`
        @keyframes progress-loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>

      {/* Left Panel */}
      <div className="login-left">
        <button onClick={() => navigate('/')} className="login-back-btn">
          <FiArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
        <div className="grid-overlay"></div>
        <div className="left-content">
          <div className="login-logo" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0px' }}>
            <img src={logoUrl || logoSrc} alt="Logo" style={{ height: '70px', width: 'auto', objectFit: 'contain', marginLeft: '-38px', marginRight: '-32px' }} />
            {!logoUrl && (
              <div className="logo-text-group" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="logo-title" style={{ fontSize: '18px', fontWeight: 805, color: '#ffffff', fontFamily: "'Outfit', system-ui, sans-serif", lineHeight: '1.1' }}>Hero Logistics</span>
                <span className="logo-subtitle" style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px', lineHeight: '1' }}>Enterprise Suite</span>
              </div>
            )}
          </div>

          <h1 className="hero-headline">
            The Complete<br />
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
        {isAuthenticating ? (
          <div className="auth-overlay">
            {/* Green Tick Circular Badge */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
              }}
            >
              <svg
                style={{ width: '28px', height: '28px' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '8px' }}>
              Authenticated!
            </h2>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#4785c4', marginBottom: '32px' }}>
              Redirecting to {loggingInRole} Dashboard...
            </p>

            {/* Gold Progress Loader Bar */}
            <div style={{ width: '40px', backgroundColor: '#1e293b', height: '3px', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#fbbf24',
                  borderRadius: '9999px',
                  animation: 'progress-loading 1.4s ease-out forwards'
                }}
              />
            </div>
          </div>
        ) : (
          <div className="right-content">
            <h2 className="welcome-title">Welcome back</h2>
            <p className="welcome-desc">Click any dashboard below for instant access, or sign in manually</p>

            <form className="login-form" onSubmit={handleLogin}>
              {errorMsg && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '13px', fontWeight: 'bold' }}>{errorMsg}</div>}
              <div className="form-group">
                <label>EMAIL ADDRESS</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter email address..."
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label>PASSWORD</label>
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password..."
                  />
                  {showPassword ? (
                    <FiEyeOff className="input-icon-right" onClick={() => setShowPassword(false)} />
                  ) : (
                    <FiEye className="input-icon-right" onClick={() => setShowPassword(true)} />
                  )}
                </div>
              </div>

              <button type="submit" className="login-btn">
                <FiLogIn size={18} />
                <span>Sign In</span>
              </button>

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
        )}
      </div>
    </div>
  );
};

export default Login;
