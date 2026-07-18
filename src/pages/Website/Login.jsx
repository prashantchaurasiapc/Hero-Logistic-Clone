import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import {
  FiMail, FiLock, FiEye, FiShield,
  FiBarChart2, FiBriefcase, FiClipboard,
  FiTruck, FiBox, FiMap, FiFileText, FiShoppingCart, FiArrowLeft
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
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loggingInRole, setLoggingInRole] = useState('');
  const [logoSrc, setLogoSrc] = useState('/image.png');

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
    const roleCard = roleCards.find(r => r.id === roleId);
    const label = roleCard ? roleCard.label : 'Admin';
    setLoggingInRole(label);
    setIsAuthenticating(true);

    setTimeout(() => {
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
        navigate('/admin/dashboard');
      }
    }, 1600);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoggingInRole('Super Admin');
    setIsAuthenticating(true);
    setTimeout(() => {
      navigate('/admin/dashboard');
    }, 1600);
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
            <img src={logoSrc} alt="Logo" style={{ height: '70px', width: 'auto', objectFit: 'contain', marginLeft: '-38px', marginRight: '-32px' }} />
            <div className="logo-text-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="logo-title" style={{ fontSize: '18px', fontWeight: 805, color: '#ffffff', fontFamily: "'Outfit', system-ui, sans-serif", lineHeight: '1.1' }}>Hero Logistics</span>
              <span className="logo-subtitle" style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px', lineHeight: '1' }}>Enterprise Suite</span>
            </div>
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
        )}
      </div>
    </div>
  );
};

export default Login;
