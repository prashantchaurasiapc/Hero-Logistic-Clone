import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  User, Mail, Phone, Building2, ShieldCheck, Key, Bell, CheckCircle2, 
  DollarSign, CreditCard, Lock, Edit, Camera, Save, Clock, MapPin, 
  Award, FileText, AlertCircle, Globe, Calendar, ExternalLink, Eye, EyeOff,
  Smartphone, Shield, Check, ChevronRight, Building, RefreshCw
} from 'lucide-react';

export default function AccountsProfile() {
  // Active Tab State
  const [activeTab, setActiveTab] = useState('personal');

  // Personal Information Form State
  const [fullName, setFullName] = useState('Accounts Manager');
  const [jobTitle, setJobTitle] = useState('Accounts Manager');
  const [emailAddress, setEmailAddress] = useState('accounts@hero.com');
  const [phoneNumber, setPhoneNumber] = useState('+61 412 345 678');
  const [companyName, setCompanyName] = useState('HERO Logistics Pty Ltd');
  const [mobileNumber, setMobileNumber] = useState('+61 412 345 678');
  const [dob, setDob] = useState('15/06/1985');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('(UTC+10:00) Sydney, Australia');
  const [addressLine1, setAddressLine1] = useState('Level 2, 123 Business Road');
  const [addressLine2, setAddressLine2] = useState('Suite 5');
  const [city, setCity] = useState('Sydney');
  const [stateTerritory, setStateTerritory] = useState('NSW');
  const [postcode, setPostcode] = useState('2000');
  const [country, setCountry] = useState('Australia');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get('/accounts/profile');
        if (res.data?.success && res.data.data?.profile) {
          const p = res.data.data.profile;
          if (p.fullName) setFullName(p.fullName);
          if (p.jobTitle) setJobTitle(p.jobTitle);
          if (p.emailAddress) setEmailAddress(p.emailAddress);
          if (p.phoneNumber) setPhoneNumber(p.phoneNumber);
          if (p.company) setCompanyName(p.company);
        }
      } catch (err) {
        console.warn('Using default authenticated profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Notification Toggles State
  const [notifications, setNotifications] = useState({
    payrollDisbursements: true,
    highValueInvoices: true,
    gstPaygDeadlines: true,
    contractorClaims: true
  });

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSavePersonalDetails = (e) => {
    e.preventDefault();
    showToast('✓ Profile information updated successfully!');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('✓ Password updated successfully!');
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    showToast('✓ Notification preferences saved.');
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-3 sm:p-6 font-sans text-left text-slate-900 custom-scrollbar box-border w-full">
      <style>{`
        /* RESPONSIVE STYLES */
        .acc-profile-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }
        
        .acc-tabs-bar {
          display: flex;
          align-items: center;
          gap: 4px;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 20px;
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
        }
        .acc-tabs-bar::-webkit-scrollbar {
          display: none;
        }

        .acc-tab-btn {
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 700;
          color: #64748B;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          background: transparent;
          border-top: none;
          border-left: none;
          border-right: none;
          flex-shrink: 0;
        }
        .acc-tab-btn:hover {
          color: #1E293B;
        }
        .acc-tab-btn.active {
          color: #2563EB;
          border-bottom-color: #2563EB;
        }

        .acc-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          margin-bottom: 20px;
        }
        @media (min-width: 640px) {
          .acc-card {
            padding: 24px;
          }
        }

        .acc-form-label {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 6px;
          display: block;
        }

        .acc-input {
          width: 100%;
          height: 38px;
          padding: 0 12px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          color: #0F172A;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .acc-input:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .acc-select {
          width: 100%;
          height: 38px;
          padding: 0 28px 0 12px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          color: #0F172A;
          outline: none;
          appearance: none;
          cursor: pointer;
          box-sizing: border-box;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%64748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
        }
        .acc-select:focus {
          border-color: #2563EB;
        }

        .acc-btn-primary {
          background: #2563EB;
          color: #FFFFFF;
          font-size: 12.5px;
          font-weight: 800;
          padding: 9px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background 0.15s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .acc-btn-primary:hover {
          background: #1D4ED8;
        }

        .acc-btn-secondary {
          background: #FFFFFF;
          color: #475569;
          font-size: 12.5px;
          font-weight: 700;
          padding: 9px 18px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          cursor: pointer;
          transition: all 0.15s;
        }
        .acc-btn-secondary:hover {
          background: #F8FAFC;
          color: #0F172A;
        }

        .acc-summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #F1F5F9;
          font-size: 12px;
        }
        .acc-summary-row:last-child {
          border-bottom: none;
        }
        .acc-summary-lbl {
          color: #64748B;
          font-weight: 500;
        }
        .acc-summary-val {
          color: #0F172A;
          font-weight: 700;
          text-align: right;
        }
      `}</style>

      <div className="acc-profile-wrapper">
        {/* PAGE HEADER */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Profile</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage your personal information, security settings and preferences.
          </p>
        </div>

        {/* RESPONSIVE NAVIGATION TABS BAR */}
        <div className="acc-tabs-bar">
          <button
            className={`acc-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Information
          </button>
          <button
            className={`acc-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button
            className={`acc-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
          <button
            className={`acc-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">

          {/* LEFT CONTENT AREA (8 COLS ON DESKTOP, FULL WIDTH ON MOBILE) */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">

            {/* TAB 1: PERSONAL INFORMATION */}
            {activeTab === 'personal' && (
              <>
                <div className="acc-card">
                  <h2 className="text-sm font-extrabold text-slate-900 mb-5 sm:mb-6">Personal Information</h2>

                  <form onSubmit={handleSavePersonalDetails}>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 mb-6 pb-6 border-b border-slate-100">
                      {/* Avatar */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="relative">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0F172A] text-amber-400 font-black text-xl sm:text-2xl flex items-center justify-center border-2 border-slate-200 shadow-sm">
                            JS
                          </div>
                          <button
                            type="button"
                            onClick={() => showToast('Avatar upload dialog opened.')}
                            className="absolute bottom-0 right-0 bg-white border border-slate-300 p-1.5 rounded-full shadow-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                            title="Upload Avatar"
                          >
                            <Camera size={13} />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium mt-2 text-center">JPG, PNG or GIF. Max size 2MB.</span>
                      </div>

                      {/* Right Grid Inputs */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full">
                        <div>
                          <label className="acc-form-label">Full Name</label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            className="acc-input"
                            required
                          />
                        </div>

                        <div>
                          <label className="acc-form-label">Job Title</label>
                          <input
                            type="text"
                            value={jobTitle}
                            onChange={e => setJobTitle(e.target.value)}
                            className="acc-input"
                            required
                          />
                        </div>

                        <div>
                          <label className="acc-form-label">Email Address</label>
                          <input
                            type="email"
                            value={emailAddress}
                            onChange={e => setEmailAddress(e.target.value)}
                            className="acc-input"
                            required
                          />
                        </div>

                        <div>
                          <label className="acc-form-label">Phone Number</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-xs">🇦🇺</span>
                            <input
                              type="text"
                              value={phoneNumber}
                              onChange={e => setPhoneNumber(e.target.value)}
                              className="acc-input pl-9"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="acc-form-label">Mobile Number (Optional)</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-xs">🇦🇺</span>
                            <input
                              type="text"
                              value={mobileNumber}
                              onChange={e => setMobileNumber(e.target.value)}
                              className="acc-input pl-9"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="acc-form-label">Date of Birth</label>
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              value={dob}
                              onChange={e => setDob(e.target.value)}
                              className="acc-input"
                            />
                            <Calendar size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="acc-form-label">Preferred Language</label>
                          <select value={language} onChange={e => setLanguage(e.target.value)} className="acc-select">
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                          </select>
                        </div>

                        <div>
                          <label className="acc-form-label">Timezone</label>
                          <select value={timezone} onChange={e => setTimezone(e.target.value)} className="acc-select">
                            <option value="(UTC+10:00) Sydney, Australia">(UTC+10:00) Sydney, Australia</option>
                            <option value="(UTC+08:00) Perth, Australia">(UTC+08:00) Perth, Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-3.5 sm:space-y-4 pt-2 border-t border-slate-100">
                      <span className="text-xs font-extrabold text-slate-900 block">Address</span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <div>
                          <label className="acc-form-label">Address Line 1</label>
                          <input
                            type="text"
                            value={addressLine1}
                            onChange={e => setAddressLine1(e.target.value)}
                            className="acc-input"
                            required
                          />
                        </div>

                        <div>
                          <label className="acc-form-label">Address Line 2 (Optional)</label>
                          <input
                            type="text"
                            value={addressLine2}
                            onChange={e => setAddressLine2(e.target.value)}
                            className="acc-input"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                        <div>
                          <label className="acc-form-label">City / Suburb</label>
                          <input
                            type="text"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            className="acc-input"
                            required
                          />
                        </div>

                        <div>
                          <label className="acc-form-label">State / Territory</label>
                          <select value={stateTerritory} onChange={e => setStateTerritory(e.target.value)} className="acc-select">
                            <option value="NSW">NSW</option>
                            <option value="VIC">VIC</option>
                            <option value="QLD">QLD</option>
                            <option value="WA">WA</option>
                          </select>
                        </div>

                        <div>
                          <label className="acc-form-label">Postcode</label>
                          <input
                            type="text"
                            value={postcode}
                            onChange={e => setPostcode(e.target.value)}
                            className="acc-input"
                            required
                          />
                        </div>

                        <div>
                          <label className="acc-form-label">Country</label>
                          <select value={country} onChange={e => setCountry(e.target.value)} className="acc-select">
                            <option value="Australia">Australia</option>
                            <option value="New Zealand">New Zealand</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-5 sm:pt-6 border-t border-slate-100 mt-6">
                      <button type="button" onClick={() => showToast('Changes cancelled.')} className="acc-btn-secondary w-full sm:w-auto">
                        Cancel
                      </button>
                      <button type="submit" className="acc-btn-primary w-full sm:w-auto">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* COMPANY INFORMATION CARD (BOTTOM LEFT) */}
                <div className="acc-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h2 className="text-sm font-extrabold text-slate-900">Company Information</h2>
                    <button 
                      onClick={() => showToast('Opening company profile details...')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    >
                      <span>View Company Details</span>
                      <ExternalLink size={13} />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Building2 size={24} />
                    </div>

                    <div className="flex-1 text-xs space-y-2 w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-900">Global Motors Pty Ltd</span>
                        <span className="bg-emerald-100 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                          Verified
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 text-slate-600 font-medium">
                        <div><strong className="text-slate-800">ABN:</strong> 12 345 678 901</div>
                        <div><strong className="text-slate-800">ACN:</strong> 123 456 789</div>
                        <div><strong className="text-slate-800">Industry:</strong> Transport &amp; Logistics</div>
                        <div><strong className="text-slate-800">Phone:</strong> 02 9123 4567</div>
                        <div><strong className="text-slate-800">Email:</strong> accounts@gml.com.au</div>
                        <div><strong className="text-slate-800">Website:</strong> www.globalmotors.com.au</div>
                      </div>

                      <div className="text-slate-600 pt-1 border-t border-slate-200/60">
                        <strong className="text-slate-800">Address:</strong> Level 2, 123 Business Road, Sydney NSW 2000, Australia
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: SECURITY */}
            {activeTab === 'security' && (
              <div className="acc-card">
                <h2 className="text-sm font-extrabold text-slate-900 mb-4">Account Security Settings</h2>
                <p className="text-xs text-slate-500 mb-6">Manage authentication methods, active sessions, and password rules.</p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">Two-Factor Authentication (2FA)</span>
                      <span className="text-[11px] text-slate-600 font-medium">Secure your account using hardware key or authenticator app.</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 font-black text-[10px] px-2.5 py-1 rounded-full flex-shrink-0">ENABLED</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">Password Expiry Policy</span>
                      <span className="text-slate-500">Next mandatory password update in 60 days.</span>
                    </div>
                    <span className="font-bold text-slate-700">60 Days</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PREFERENCES */}
            {activeTab === 'preferences' && (
              <div className="acc-card">
                <h2 className="text-sm font-extrabold text-slate-900 mb-4">System Preferences</h2>
                <p className="text-xs text-slate-500 mb-6">Configure regional formats, currencies, and display options.</p>
                
                <div className="space-y-4 text-xs max-w-md">
                  <div>
                    <label className="acc-form-label">Currency Format</label>
                    <select className="acc-select">
                      <option>AUD ($) - Australian Dollar</option>
                      <option>USD ($) - US Dollar</option>
                    </select>
                  </div>
                  <div>
                    <label className="acc-form-label">Date Format</label>
                    <select className="acc-select">
                      <option>DD/MM/YYYY (e.g. 31/07/2026)</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="acc-card">
                <h2 className="text-sm font-extrabold text-slate-900 mb-4">Email Notifications &amp; Alerts</h2>
                <p className="text-xs text-slate-500 mb-6">Choose which accounting notifications and financial alerts you receive.</p>

                <div className="space-y-3">
                  {[
                    { key: 'payrollDisbursements', title: 'Payroll Disbursements', desc: 'Alert when employee pay run is ready for disbursement' },
                    { key: 'highValueInvoices', title: 'High-Value Invoices', desc: 'Notification for invoices exceeding $50,000 threshold' },
                    { key: 'gstPaygDeadlines', title: 'GST & PAYG Deadlines', desc: 'Tax lodging reminders and compliance deadlines' },
                    { key: 'contractorClaims', title: 'Contractor Pay Claims', desc: 'New claim submissions awaiting review' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors gap-3">
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 block">{item.title}</span>
                        <span className="text-[11px] text-slate-500 font-medium">{item.desc}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleNotification(item.key)}
                        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                          notifications[item.key] ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            notifications[item.key] ? 'left-5.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR (4 COLS ON DESKTOP, FULL WIDTH ON MOBILE) */}
          <div className="lg:col-span-4 space-y-5 sm:space-y-6">

            {/* CARD 1: ACCOUNT SUMMARY */}
            <div className="acc-card">
              <h2 className="text-sm font-extrabold text-slate-900 mb-4">Account Summary</h2>

              <div className="acc-summary-row">
                <span className="acc-summary-lbl">Role</span>
                <span className="acc-summary-val">Accounts Manager</span>
              </div>

              <div className="acc-summary-row">
                <span className="acc-summary-lbl">User ID</span>
                <span className="acc-summary-val font-mono">USR-10024</span>
              </div>

              <div className="acc-summary-row">
                <span className="acc-summary-lbl">Department</span>
                <span className="acc-summary-val">Accounts</span>
              </div>

              <div className="acc-summary-row">
                <span className="acc-summary-lbl">Joined On</span>
                <span className="acc-summary-val">14 Feb 2024, 09:15 AM</span>
              </div>

              <div className="acc-summary-row">
                <span className="acc-summary-lbl">Last Login</span>
                <span className="acc-summary-val">31 May 2026, 08:42 AM</span>
              </div>
            </div>

            {/* CARD 2: CHANGE PASSWORD */}
            <div className="acc-card">
              <h2 className="text-sm font-extrabold text-slate-900 mb-4">Change Password</h2>

              <form onSubmit={handlePasswordUpdate} className="space-y-3">
                <div>
                  <label className="acc-form-label">Current Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className="acc-input pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="acc-form-label">New Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="acc-input pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="acc-form-label">Confirm New Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="acc-input pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="acc-btn-primary w-full mt-2">
                  Update Password
                </button>
              </form>
            </div>

            {/* CARD 3: RECENT LOGIN ACTIVITY */}
            <div className="acc-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-extrabold text-slate-900">Recent Login Activity</h2>
                <button 
                  onClick={() => showToast('Opening activity log history...')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  View all
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Activity Item 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-100 gap-1">
                  <div className="flex items-center gap-2.5">
                    <Smartphone size={15} className="text-slate-500 flex-shrink-0" />
                    <div className="font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                      <span>Sydney, Australia</span>
                      <span className="bg-emerald-100 text-emerald-700 font-extrabold text-[9px] px-1.5 py-0.5 rounded">
                        Current Session
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium pl-6 sm:pl-0">31 May 2026, 08:42 AM</span>
                </div>

                {/* Activity Item 2 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-100 gap-1">
                  <div className="flex items-center gap-2.5">
                    <Smartphone size={15} className="text-slate-400 flex-shrink-0" />
                    <span className="font-bold text-slate-800">Sydney, Australia</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium pl-6 sm:pl-0">30 May 2026, 04:35 PM</span>
                </div>

                {/* Activity Item 3 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-100 gap-1">
                  <div className="flex items-center gap-2.5">
                    <Smartphone size={15} className="text-slate-400 flex-shrink-0" />
                    <span className="font-bold text-slate-800">Melbourne, Australia</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium pl-6 sm:pl-0">29 May 2026, 09:12 AM</span>
                </div>

                {/* Activity Item 4 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2.5">
                    <Smartphone size={15} className="text-slate-400 flex-shrink-0" />
                    <span className="font-bold text-slate-800">Sydney, Australia</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium pl-6 sm:pl-0">28 May 2026, 05:50 PM</span>
                </div>
              </div>
            </div>

            {/* CARD 4: TWO-FACTOR AUTHENTICATION */}
            <div className="acc-card">
              <h2 className="text-sm font-extrabold text-slate-900 mb-3">Two-Factor Authentication</h2>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Keep your account secure with two-factor authentication.
                  </p>
                  <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Enabled
                  </span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => showToast('Opening 2FA management modal...')}
                className="acc-btn-secondary w-full"
              >
                Manage 2FA
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#ECFDF5', border: '1px solid #10B981', borderRadius: 8,
          padding: '12px 18px', display: 'flex', items: 'center', gap: 10,
          zIndex: 99999, boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          fontSize: 12, fontWeight: 800, color: '#065F46'
        }}>
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
