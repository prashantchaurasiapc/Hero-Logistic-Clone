import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { 
  FiMail, FiLock, FiEye, FiUser, FiPhone, FiHome
} from 'react-icons/fi';
import { Building2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  return (
    <div className="login-container">
      {/* Left Panel - Reusing Login Layout */}
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
            {['Real-time GPS', 'AI Dispatch', 'Driver App', 'Warehouse WMS', 'Payroll', 'Customer Portal'].map(tag => (
              <span key={tag} className="tag-badge">{tag}</span>
            ))}
          </div>

          <div className="demo-credentials">
            <span className="text-yellow">Demo credentials:</span> admin@hero.com / 123456
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="login-right">
        <div className="right-content" style={{ maxWidth: '550px' }}>
          <h2 className="welcome-title">Start Free Trial</h2>
          <p className="welcome-desc">14-day full access • No credit card required</p>

          <form className="login-form" onSubmit={handleRegister} style={{ marginTop: '2rem' }}>
            
            <div className="form-group">
              <label>COMPANY NAME</label>
              <div className="input-wrapper">
                <Building2 className="input-icon" size={18} />
                <input type="text" placeholder="Apex Logistics LLC" required />
              </div>
            </div>

            <div className="form-group">
              <label>FULL NAME</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input type="text" placeholder="John Smith" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>BUSINESS EMAIL</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input type="email" placeholder="you@company.com" required />
                </div>
              </div>
              
              <div className="form-group">
                <label>PHONE</label>
                <div className="input-wrapper">
                  <FiPhone className="input-icon" />
                  <input type="tel" placeholder="+91 98765 43210" required autoComplete="off" />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>PASSWORD</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input type="password" placeholder="••••••••" required autoComplete="new-password" />
                  <FiEye className="input-icon-right" />
                </div>
              </div>
              
              <div className="form-group">
                <label>CONFIRM</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input type="password" placeholder="••••••••" required autoComplete="new-password" />
                  <FiEye className="input-icon-right" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
              <input type="checkbox" id="terms" required style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#FFD400' }} />
              <label htmlFor="terms" style={{ color: '#a1a1aa', fontSize: '13px', cursor: 'pointer' }}>
                I agree to the <span className="text-yellow" style={{fontWeight: 600}}>Terms of Service</span> and <span className="text-yellow" style={{fontWeight: 600}}>Privacy Policy</span>
              </label>
            </div>

            <button type="submit" className="w-full py-3.5 px-4 font-bold text-slate-950 bg-yellow rounded-lg shadow-lg hover:bg-yellow/90 transition-all cursor-pointer flex items-center justify-center gap-2" style={{ backgroundColor: '#FFD400', borderRadius: '8px', fontSize: '15px' }}>
              Create Account & Start Trial &rarr;
            </button>

            <div className="signup-link" style={{ marginTop: '1.5rem' }}>
              Already registered? <Link to="/login" className="text-yellow font-bold" style={{ textDecoration: 'none' }}>Login Portal</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
