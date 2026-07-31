import React, { useState, useRef } from 'react';
import {
  User, Mail, Phone, MapPin, Building, Calendar, Edit2, Camera, ShieldCheck,
  CheckCircle2, FileText, Lock, Globe, Clock, ChevronDown, Award, Eye, Key,
  Check, AlertCircle, X, Shield, Smartphone, Trash2, Upload, Download, RefreshCw
} from 'lucide-react';

export default function MyProfile() {
  const fileInputRef = useRef(null);

  // Profile Information State
  const [userName, setUserName] = useState('W. Smith');
  const [userRole, setUserRole] = useState('Warehouse Staff');
  const [employeeId, setEmployeeId] = useState('WS-1007');
  const [emailWork, setEmailWork] = useState('wsmith@herologistics.com');
  const [phoneMobile, setPhoneMobile] = useState('+61 412 345 678');
  const [phoneWork, setPhoneWork] = useState('+61 2 8765 4321');
  const [department, setDepartment] = useState('Warehouse Operations');
  const [depot, setDepot] = useState('Sydney Depot');
  const [reportsTo, setReportsTo] = useState('Michael Lee (Supervisor)');
  const [joinedOn, setJoinedOn] = useState('15 Mar 2024');
  const [address, setAddress] = useState('12 Logistics Way, Eastern Creek NSW 2766, Australia');
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Emergency Contact State
  const [emergencyName, setEmergencyName] = useState('Komal Smith');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('+61 400 987 654');

  // Preferences State
  const [language, setLanguage] = useState('English (Australia)');
  const [timeZone, setTimeZone] = useState('(GMT+10:00) Australia/Sydney');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('12-Hour (AM/PM)');
  const [themeMode, setThemeMode] = useState('Light');

  // Permissions State (Interactive Checkboxes)
  const [permissions, setPermissions] = useState({
    receiveStock: true,
    moveTransfer: true,
    loadLaneMgmt: true,
    dispatchReady: true,
    movementHistory: true,
    messaging: true,
    reportIssues: true,
    viewReports: true
  });

  // Modal Visibility States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [permsModalOpen, setPermsModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [sessionsModalOpen, setSessionsModalOpen] = useState(false);

  // Two-Factor Auth State
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // Active Sessions State
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Chrome on Windows 11', location: 'Sydney, Australia', ip: '103.224.54.12', current: true },
    { id: '2', device: 'Hero Logistics iOS App', location: 'Sydney, Australia', ip: '211.28.140.89', current: false }
  ]);

  // Toast Notification
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Profile Edit Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setEditModalOpen(false);
    showToast('✓ Profile details saved successfully!');
  };

  // Avatar Upload Handlers
  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setProfilePhoto(uploadEvent.target.result);
        showToast('✓ Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle Permission Handler
  const togglePermission = (key) => {
    setPermissions(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(`✓ Permission "${key}" updated!`);
      return updated;
    });
  };

  // Revoke Session Handler
  const handleRevokeSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast('✓ Session revoked and logged out successfully.');
  };

  return (
    <div className="wh-profile-container">
      <style>{`
        .wh-profile-container {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #F8FAFC;
          min-height: 100vh;
          color: #0F172A;
          padding: 20px 24px;
          box-sizing: border-box;
        }

        /* HEADER ROW */
        .wh-prof-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .wh-prof-title {
          font-size: 18px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -0.3px;
        }
        .wh-prof-sub {
          font-size: 12px;
          color: #64748B;
          margin-top: 2px;
        }

        .wh-btn-edit-prof {
          height: 36px;
          padding: 0 18px;
          border-radius: 8px;
          border: none;
          background: #FFD400;
          font-size: 12px;
          font-weight: 800;
          color: #0F172A;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 6px rgba(255,212,0,0.3);
          transition: transform 0.15s;
        }
        .wh-btn-edit-prof:hover { transform: translateY(-1px); }

        /* 3 COLUMN MASTER GRID */
        .wh-prof-master-grid {
          display: grid;
          grid-template-columns: 280px 1fr 1fr;
          gap: 14px;
          align-items: flex-start;
        }

        /* CARDS */
        .wh-prof-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          margin-bottom: 14px;
        }
        .wh-prof-card:last-child { margin-bottom: 0; }

        .wh-prof-card-title {
          font-size: 10.5px;
          font-weight: 900;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid #F1F5F9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .wh-prof-card-link {
          font-size: 10px;
          font-weight: 800;
          color: #2563EB;
          cursor: pointer;
          text-transform: none;
          letter-spacing: normal;
        }
        .wh-prof-card-link:hover { text-decoration: underline; }

        /* USER OVERVIEW CARD */
        .wh-user-avatar-wrap {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #2563EB;
          color: #FFFFFF;
          font-size: 24px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 10px auto;
          overflow: hidden;
          cursor: pointer;
        }
        .wh-avatar-cam-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          cursor: pointer;
          z-index: 10;
        }
        .wh-user-name {
          font-size: 16px;
          font-weight: 900;
          color: #0F172A;
          text-align: center;
        }
        .wh-user-role-lbl {
          font-size: 11px;
          color: #64748B;
          text-align: center;
          margin-top: 2px;
        }
        .wh-on-shift-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 9999px;
          background: #DCFCE7;
          color: #15803D;
          font-size: 10px;
          font-weight: 800;
          margin: 8px auto 14px auto;
        }

        .wh-user-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 6px 0;
          border-bottom: 1px solid #F8FAFC;
          font-size: 11px;
        }
        .wh-user-detail-row:last-child { border-bottom: none; }
        .wh-ud-lbl { color: #64748B; font-weight: 600; flex-shrink: 0; width: 100px; }
        .wh-ud-val { color: #0F172A; font-weight: 700; text-align: right; word-break: break-word; flex: 1; }

        /* INPUT / SELECT CONTROLS */
        .wh-pref-group { margin-bottom: 10px; }
        .wh-pref-group:last-child { margin-bottom: 0; }
        .wh-pref-lbl {
          font-size: 10px;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 4px;
          display: block;
        }
        .wh-pref-select {
          width: 100%;
          height: 32px;
          padding: 0 8px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 11.5px;
          font-weight: 600;
          color: #0F172A;
          outline: none;
        }

        /* SKILLS PROGRESS BAR */
        .wh-skill-row { margin-bottom: 10px; }
        .wh-skill-row:last-child { margin-bottom: 0; }
        .wh-skill-meta { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px; }
        .wh-skill-bar-bg { height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden; }
        .wh-skill-bar-fill { height: 100%; background: #2563EB; border-radius: 3px; }

        /* PERMISSIONS CHECKLIST */
        .wh-perm-grid { display: flex; flex-direction: column; gap: 7px; }
        .wh-perm-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
        }
        .wh-perm-check {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .wh-perm-check.enabled { background: #DCFCE7; color: #16A34A; }
        .wh-perm-check.disabled { background: #F1F5F9; color: #94A3B8; border: 1px solid #CBD5E1; }

        /* DOCS CERTIFICATIONS LIST */
        .wh-doc-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #F1F5F9; }
        .wh-doc-item:last-child { border-bottom: none; }
        .wh-doc-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* MODAL */
        .wh-modal-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px); z-index: 99999; display: flex;
          align-items: center; justify-content: center; padding: 16px;
        }
        .wh-modal-box {
          background: #FFFFFF; border-radius: 12px; width: 100%; max-width: 480px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden;
        }

        @media (max-width: 1024px) {
          .wh-prof-master-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hidden File Input for Avatar Photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* HEADER ROW */}
      <div className="wh-prof-header-row">
        <div>
          <h1 className="wh-prof-title">PROFILE</h1>
          <p className="wh-prof-sub">View and manage your profile and account settings.</p>
        </div>

        <button className="wh-btn-edit-prof" onClick={() => setEditModalOpen(true)}>
          <Edit2 size={14} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* 3 COLUMN MASTER GRID */}
      <div className="wh-prof-master-grid">

        {/* COLUMN 1: USER OVERVIEW & PREFERENCES */}
        <div>
          {/* USER OVERVIEW CARD */}
          <div className="wh-prof-card" style={{ textAlign: 'center' }}>
            <div className="wh-user-avatar-wrap" onClick={handleAvatarClick}>
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                'WS'
              )}
            </div>
            <div className="wh-avatar-cam-badge" title="Upload Photo" onClick={handleAvatarClick} style={{ margin: '-22px auto 8px auto' }}>
              <Camera size={12} />
            </div>

            <div className="wh-user-name">{userName}</div>
            <div className="wh-user-role-lbl">{userRole}</div>

            <div className="wh-on-shift-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> On Shift
            </div>

            <div style={{ textAlign: 'left', marginTop: 10 }}>
              <div className="wh-user-detail-row">
                <span className="wh-ud-lbl">Employee ID</span>
                <span className="wh-ud-val font-mono">{employeeId}</span>
              </div>
              <div className="wh-user-detail-row">
                <span className="wh-ud-lbl">Email</span>
                <span className="wh-ud-val">{emailWork}</span>
              </div>
              <div className="wh-user-detail-row">
                <span className="wh-ud-lbl">Phone</span>
                <span className="wh-ud-val">{phoneMobile}</span>
              </div>
              <div className="wh-user-detail-row">
                <span className="wh-ud-lbl">Department</span>
                <span className="wh-ud-val">{department}</span>
              </div>
              <div className="wh-user-detail-row">
                <span className="wh-ud-lbl">Depot</span>
                <span className="wh-ud-val">{depot}</span>
              </div>
              <div className="wh-user-detail-row">
                <span className="wh-ud-lbl">Role</span>
                <span className="wh-ud-val">{userRole}</span>
              </div>
              <div className="wh-user-detail-row">
                <span className="wh-ud-lbl">Reports To</span>
                <span className="wh-ud-val">{reportsTo}</span>
              </div>
              <div className="wh-user-detail-row">
                <span className="wh-ud-lbl">Joined On</span>
                <span className="wh-ud-val">{joinedOn}</span>
              </div>
            </div>
          </div>

          {/* PREFERENCE SETTINGS CARD */}
          <div className="wh-prof-card">
            <div className="wh-prof-card-title">PREFERENCE SETTINGS</div>

            <div className="wh-pref-group">
              <span className="wh-pref-lbl">Language</span>
              <select value={language} onChange={e => { setLanguage(e.target.value); showToast(`✓ Language set to ${e.target.value}`); }} className="wh-pref-select">
                <option>English (Australia)</option>
                <option>English (US)</option>
                <option>Spanish</option>
              </select>
            </div>

            <div className="wh-pref-group">
              <span className="wh-pref-lbl">Time Zone</span>
              <select value={timeZone} onChange={e => { setTimeZone(e.target.value); showToast(`✓ Timezone set to ${e.target.value}`); }} className="wh-pref-select">
                <option>(GMT+10:00) Australia/Sydney</option>
                <option>(GMT+08:00) Australia/Perth</option>
                <option>(GMT+00:00) UTC</option>
              </select>
            </div>

            <div className="wh-pref-group">
              <span className="wh-pref-lbl">Date Format</span>
              <select value={dateFormat} onChange={e => { setDateFormat(e.target.value); showToast(`✓ Date format set to ${e.target.value}`); }} className="wh-pref-select">
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
                <option>MM/DD/YYYY</option>
              </select>
            </div>

            <div className="wh-pref-group">
              <span className="wh-pref-lbl">Time Format</span>
              <select value={timeFormat} onChange={e => { setTimeFormat(e.target.value); showToast(`✓ Time format set to ${e.target.value}`); }} className="wh-pref-select">
                <option>12-Hour (AM/PM)</option>
                <option>24-Hour</option>
              </select>
            </div>

            <div className="wh-pref-group">
              <span className="wh-pref-lbl">Theme</span>
              <select value={themeMode} onChange={e => { setThemeMode(e.target.value); showToast(`✓ Theme set to ${e.target.value}`); }} className="wh-pref-select">
                <option>Light</option>
                <option>Dark</option>
                <option>System Default</option>
              </select>
            </div>
          </div>
        </div>

        {/* COLUMN 2: CONTACT, EMERGENCY, DOCUMENTS */}
        <div>
          {/* CONTACT & ADDRESS CARD */}
          <div className="wh-prof-card">
            <div className="wh-prof-card-title">
              <span>CONTACT & ADDRESS</span>
              <span className="wh-prof-card-link" onClick={() => setEditModalOpen(true)}>Edit</span>
            </div>

            <div className="wh-user-detail-row flex items-start gap-2">
              <MapPin size={14} className="text-slate-400 mt-0.5" />
              <div>
                <div className="text-[10px] text-slate-500 font-semibold">Address</div>
                <div className="font-bold text-slate-900 text-xs mt-0.5">{address}</div>
              </div>
            </div>

            <div className="wh-user-detail-row flex items-start gap-2 mt-2">
              <Mail size={14} className="text-slate-400 mt-0.5" />
              <div>
                <div className="text-[10px] text-slate-500 font-semibold">Email (Work)</div>
                <div className="font-bold text-slate-900 text-xs mt-0.5">{emailWork}</div>
              </div>
            </div>

            <div className="wh-user-detail-row flex items-start gap-2 mt-2">
              <Phone size={14} className="text-slate-400 mt-0.5" />
              <div>
                <div className="text-[10px] text-slate-500 font-semibold">Phone (Mobile)</div>
                <div className="font-bold text-slate-900 text-xs mt-0.5">{phoneMobile}</div>
              </div>
            </div>

            <div className="wh-user-detail-row flex items-start gap-2 mt-2">
              <Phone size={14} className="text-slate-400 mt-0.5" />
              <div>
                <div className="text-[10px] text-slate-500 font-semibold">Phone (Work)</div>
                <div className="font-bold text-slate-900 text-xs mt-0.5">{phoneWork}</div>
              </div>
            </div>
          </div>

          {/* EMERGENCY CONTACT CARD */}
          <div className="wh-prof-card">
            <div className="wh-prof-card-title">
              <span>EMERGENCY CONTACT</span>
              <span className="wh-prof-card-link" onClick={() => setEditModalOpen(true)}>Edit</span>
            </div>

            <div className="wh-user-detail-row">
              <span className="wh-ud-lbl">Name</span>
              <span className="wh-ud-val font-bold">{emergencyName}</span>
            </div>

            <div className="wh-user-detail-row">
              <span className="wh-ud-lbl">Relationship</span>
              <span className="wh-ud-val font-bold">{emergencyRelation}</span>
            </div>

            <div className="wh-user-detail-row">
              <span className="wh-ud-lbl">Phone</span>
              <span className="wh-ud-val font-bold">{emergencyPhone}</span>
            </div>
          </div>

          {/* DOCUMENTS & CERTIFICATIONS CARD */}
          <div className="wh-prof-card">
            <div className="wh-prof-card-title">
              <span>DOCUMENTS & CERTIFICATIONS</span>
              <span className="wh-prof-card-link" onClick={() => setDocsModalOpen(true)}>View all</span>
            </div>

            <div className="wh-doc-item cursor-pointer" onClick={() => setDocsModalOpen(true)}>
              <div className="wh-doc-icon-box text-purple-600"><FileText size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-slate-900 text-xs truncate">General Induction</div>
                <div className="text-[9.5px] text-slate-500 font-semibold">Expiry Date: 15 Mar 2026</div>
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9.5px] font-extrabold rounded">Verified</span>
            </div>

            <div className="wh-doc-item cursor-pointer" onClick={() => setDocsModalOpen(true)}>
              <div className="wh-doc-icon-box text-amber-600"><Award size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-slate-900 text-xs truncate">Forklift Licence</div>
                <div className="text-[9.5px] text-slate-500 font-semibold">Expiry Date: 22 Oct 2026</div>
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9.5px] font-extrabold rounded">Verified</span>
            </div>

            <div className="wh-doc-item cursor-pointer" onClick={() => setDocsModalOpen(true)}>
              <div className="wh-doc-icon-box text-blue-600"><ShieldCheck size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-slate-900 text-xs truncate">First Aid Certificate</div>
                <div className="text-[9.5px] text-slate-500 font-semibold">Expiry Date: 10 Dec 2025</div>
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9.5px] font-extrabold rounded">Verified</span>
            </div>

            <div className="wh-doc-item cursor-pointer" onClick={() => setDocsModalOpen(true)}>
              <div className="wh-doc-icon-box text-teal-600"><Shield size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-slate-900 text-xs truncate">WH&S Training</div>
                <div className="text-[9.5px] text-slate-500 font-semibold">Expiry Date: 15 Mar 2026</div>
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9.5px] font-extrabold rounded">Verified</span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: SKILLS, PERMISSIONS, SECURITY */}
        <div>
          {/* SKILLS & COMPETENCIES CARD */}
          <div className="wh-prof-card">
            <div className="wh-prof-card-title">
              <span>SKILLS & COMPETENCIES</span>
              <span className="wh-prof-card-link" onClick={() => setSkillsModalOpen(true)}>View all</span>
            </div>

            <div className="wh-skill-row cursor-pointer" onClick={() => setSkillsModalOpen(true)}>
              <div className="wh-skill-meta">
                <span className="font-bold text-slate-900">Forklift Operation</span>
                <span className="font-extrabold text-blue-600">Expert</span>
              </div>
              <div className="wh-skill-bar-bg"><div className="wh-skill-bar-fill" style={{ width: '95%' }} /></div>
            </div>

            <div className="wh-skill-row cursor-pointer" onClick={() => setSkillsModalOpen(true)}>
              <div className="wh-skill-meta">
                <span className="font-bold text-slate-900">Inventory Handling</span>
                <span className="font-extrabold text-blue-600">Advanced</span>
              </div>
              <div className="wh-skill-bar-bg"><div className="wh-skill-bar-fill" style={{ width: '85%' }} /></div>
            </div>

            <div className="wh-skill-row cursor-pointer" onClick={() => setSkillsModalOpen(true)}>
              <div className="wh-skill-meta">
                <span className="font-bold text-slate-900">Pallet Handling</span>
                <span className="font-extrabold text-blue-600">Advanced</span>
              </div>
              <div className="wh-skill-bar-bg"><div className="wh-skill-bar-fill" style={{ width: '80%' }} /></div>
            </div>

            <div className="wh-skill-row cursor-pointer" onClick={() => setSkillsModalOpen(true)}>
              <div className="wh-skill-meta">
                <span className="font-bold text-slate-900">WMS System</span>
                <span className="font-extrabold text-blue-600">Advanced</span>
              </div>
              <div className="wh-skill-bar-bg"><div className="wh-skill-bar-fill" style={{ width: '80%' }} /></div>
            </div>

            <div className="wh-skill-row cursor-pointer" onClick={() => setSkillsModalOpen(true)}>
              <div className="wh-skill-meta">
                <span className="font-bold text-slate-900">Safety Compliance</span>
                <span className="font-extrabold text-blue-600">Expert</span>
              </div>
              <div className="wh-skill-bar-bg"><div className="wh-skill-bar-fill" style={{ width: '95%' }} /></div>
            </div>
          </div>

          {/* WAREHOUSE PERMISSIONS CARD */}
          <div className="wh-prof-card">
            <div className="wh-prof-card-title">
              <span>WAREHOUSE PERMISSIONS</span>
              <span className="wh-prof-card-link" onClick={() => setPermsModalOpen(true)}>View all</span>
            </div>

            <div className="wh-perm-grid">
              <div className="wh-perm-item" onClick={() => togglePermission('receiveStock')}>
                <div className={`wh-perm-check ${permissions.receiveStock ? 'enabled' : 'disabled'}`}><Check size={11} /></div>
                <span>Receive Stock (Inbound)</span>
              </div>
              <div className="wh-perm-item" onClick={() => togglePermission('moveTransfer')}>
                <div className={`wh-perm-check ${permissions.moveTransfer ? 'enabled' : 'disabled'}`}><Check size={11} /></div>
                <span>Move / Transfer Stock</span>
              </div>
              <div className="wh-perm-item" onClick={() => togglePermission('loadLaneMgmt')}>
                <div className={`wh-perm-check ${permissions.loadLaneMgmt ? 'enabled' : 'disabled'}`}><Check size={11} /></div>
                <span>Load Lane Management</span>
              </div>
              <div className="wh-perm-item" onClick={() => togglePermission('dispatchReady')}>
                <div className={`wh-perm-check ${permissions.dispatchReady ? 'enabled' : 'disabled'}`}><Check size={11} /></div>
                <span>Dispatch Ready</span>
              </div>
              <div className="wh-perm-item" onClick={() => togglePermission('movementHistory')}>
                <div className={`wh-perm-check ${permissions.movementHistory ? 'enabled' : 'disabled'}`}><Check size={11} /></div>
                <span>View Movement History</span>
              </div>
              <div className="wh-perm-item" onClick={() => togglePermission('messaging')}>
                <div className={`wh-perm-check ${permissions.messaging ? 'enabled' : 'disabled'}`}><Check size={11} /></div>
                <span>Messaging</span>
              </div>
              <div className="wh-perm-item" onClick={() => togglePermission('reportIssues')}>
                <div className={`wh-perm-check ${permissions.reportIssues ? 'enabled' : 'disabled'}`}><Check size={11} /></div>
                <span>Report Issues</span>
              </div>
              <div className="wh-perm-item" onClick={() => togglePermission('viewReports')}>
                <div className={`wh-perm-check ${permissions.viewReports ? 'enabled' : 'disabled'}`}><Check size={11} /></div>
                <span>View Reports</span>
              </div>
            </div>
          </div>

          {/* ACCOUNT SECURITY CARD */}
          <div className="wh-prof-card">
            <div className="wh-prof-card-title">ACCOUNT SECURITY</div>

            <div className="wh-user-detail-row items-center">
              <div>
                <div className="font-bold text-slate-900">Password</div>
                <div className="text-[10px] text-slate-500 font-mono">••••••••</div>
              </div>
              <span className="wh-prof-card-link" onClick={() => setPasswordModalOpen(true)}>Change</span>
            </div>

            <div className="wh-user-detail-row items-center">
              <div>
                <div className="font-bold text-slate-900">Two-Factor Authentication</div>
                <div className={`text-[10px] font-bold ${is2FAEnabled ? 'text-green-600' : 'text-red-500'}`}>
                  {is2FAEnabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <span className="wh-prof-card-link" onClick={() => setTwoFactorModalOpen(true)}>Manage</span>
            </div>

            <div className="wh-user-detail-row items-center">
              <div>
                <div className="font-bold text-slate-900">Active Sessions</div>
                <div className="text-[10px] text-slate-500 font-semibold">{sessions.length} active logins</div>
              </div>
              <span className="wh-prof-card-link" onClick={() => setSessionsModalOpen(true)}>View</span>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL 1: EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900">Edit Profile & Contact Details</h3>
              <button onClick={() => setEditModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-4 flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={phoneMobile}
                  onChange={e => setPhoneMobile(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Work Phone</label>
                <input
                  type="text"
                  value={phoneWork}
                  onChange={e => setPhoneWork(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Address Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={e => setEmergencyName(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={e => setEmergencyPhone(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600" onClick={() => setEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-400 rounded text-xs font-extrabold text-slate-900">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DOCUMENTS & CERTIFICATIONS MODAL */}
      {docsModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setDocsModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900">Documents & Certifications</h3>
              <button onClick={() => setDocsModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="p-4 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
              <div className="p-3 border border-slate-200 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-extrabold text-xs text-slate-900">General Induction</div>
                  <div className="text-[10px] text-slate-500">ID: IND-2024-998 • Expires 15 Mar 2026</div>
                </div>
                <button className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded border border-blue-200 flex items-center gap-1" onClick={() => showToast('Downloading General Induction Certificate PDF...')}>
                  <Download size={12} /> Download
                </button>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-extrabold text-xs text-slate-900">Forklift Licence (LF Class)</div>
                  <div className="text-[10px] text-slate-500">Licence #: NSW-FL-449102 • Expires 22 Oct 2026</div>
                </div>
                <button className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded border border-blue-200 flex items-center gap-1" onClick={() => showToast('Downloading Forklift Licence PDF...')}>
                  <Download size={12} /> Download
                </button>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-extrabold text-xs text-slate-900">First Aid & CPR Certificate</div>
                  <div className="text-[10px] text-slate-500">Cert #: FA-8890-AU • Expires 10 Dec 2025</div>
                </div>
                <button className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded border border-blue-200 flex items-center gap-1" onClick={() => showToast('Downloading First Aid Certificate PDF...')}>
                  <Download size={12} /> Download
                </button>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-extrabold text-xs text-slate-900">WH&S Compliance Training</div>
                  <div className="text-[10px] text-slate-500">Cert #: WHS-2024-001 • Expires 15 Mar 2026</div>
                </div>
                <button className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded border border-blue-200 flex items-center gap-1" onClick={() => showToast('Downloading WH&S Certificate PDF...')}>
                  <Download size={12} /> Download
                </button>
              </div>
            </div>
            <div className="p-3 border-t border-slate-100 flex justify-end">
              <button className="px-4 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-700" onClick={() => setDocsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SKILLS MATRIX MODAL */}
      {skillsModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setSkillsModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900">Skills & Competency Matrix</h3>
              <button onClick={() => setSkillsModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div className="font-extrabold text-slate-900">Forklift Operation — 95% (Expert)</div>
                <div className="text-[10.5px] text-slate-600 mt-1">High reach, counterbalance, and heavy container forklifts certified.</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div className="font-extrabold text-slate-900">Inventory Handling — 85% (Advanced)</div>
                <div className="text-[10.5px] text-slate-600 mt-1">Barcode scanning, stock audit, and staging location management.</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div className="font-extrabold text-slate-900">Pallet Handling — 80% (Advanced)</div>
                <div className="text-[10.5px] text-slate-600 mt-1">EUR/ISO pallet wrapping, weight distribution, and hazmat stacking.</div>
              </div>
            </div>
            <div className="p-3 border-t border-slate-100 flex justify-end">
              <button className="px-4 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-700" onClick={() => setSkillsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: WAREHOUSE PERMISSIONS MODAL */}
      {permsModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setPermsModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900">Warehouse Access Permissions</h3>
              <button onClick={() => setPermsModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="p-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
              {Object.keys(permissions).map(key => (
                <div key={key} className="flex justify-between items-center p-2.5 border border-slate-200 rounded-lg cursor-pointer" onClick={() => togglePermission(key)}>
                  <span className="text-xs font-extrabold text-slate-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <input
                    type="checkbox"
                    checked={permissions[key]}
                    onChange={() => {}}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 flex justify-end">
              <button className="px-4 py-1.5 bg-amber-400 rounded text-xs font-extrabold text-slate-900" onClick={() => setPermsModalOpen(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CHANGE PASSWORD MODAL */}
      {passwordModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setPasswordModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900">Change Account Password</h3>
              <button onClick={() => setPasswordModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setPasswordModalOpen(false); showToast('✓ Password updated successfully!'); }} className="p-4 flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Current Password *</label>
                <input type="password" required className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">New Password *</label>
                <input type="password" required className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Confirm New Password *</label>
                <input type="password" required className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600" onClick={() => setPasswordModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-400 rounded text-xs font-extrabold text-slate-900">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: TWO-FACTOR AUTHENTICATION MODAL */}
      {twoFactorModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setTwoFactorModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900">Two-Factor Authentication (2FA)</h3>
              <button onClick={() => setTwoFactorModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="p-4 flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <div className="font-extrabold text-slate-900">2FA Status</div>
                  <div className="text-[10px] text-slate-500">Authenticator App / SMS Verification</div>
                </div>
                <button
                  className={`px-3 py-1 rounded font-extrabold text-xs ${is2FAEnabled ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-slate-200 text-slate-700'}`}
                  onClick={() => {
                    setIs2FAEnabled(!is2FAEnabled);
                    showToast(`✓ Two-Factor Authentication ${!is2FAEnabled ? 'Enabled' : 'Disabled'}`);
                  }}
                >
                  {is2FAEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg flex flex-col gap-2">
                <div className="font-extrabold text-slate-900">Authenticator QR Code</div>
                <div className="w-32 h-32 bg-slate-200 rounded mx-auto flex items-center justify-center font-bold text-slate-500">
                  [ QR Code ]
                </div>
                <div className="text-[10px] text-slate-500 text-center">Scan with Google Authenticator or Authy app.</div>
              </div>
            </div>
            <div className="p-3 border-t border-slate-100 flex justify-end">
              <button className="px-4 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-700" onClick={() => setTwoFactorModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: ACTIVE SESSIONS MODAL */}
      {sessionsModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setSessionsModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900">Active Login Sessions</h3>
              <button onClick={() => setSessionsModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {sessions.map(s => (
                <div key={s.id} className="p-3 border border-slate-200 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      {s.device}
                      {s.current && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] rounded font-bold">This Device</span>}
                    </div>
                    <div className="text-[10px] text-slate-500">{s.location} • IP: {s.ip}</div>
                  </div>
                  {!s.current && (
                    <button className="px-2.5 py-1 bg-red-50 text-red-600 font-bold text-[10px] rounded border border-red-200" onClick={() => handleRevokeSession(s.id)}>
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 flex justify-end">
              <button className="px-4 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-700" onClick={() => setSessionsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10,
          padding: '12px 18px', display: 'flex', items: 'center', gap: 10,
          zIndex: 99998, boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
        }}>
          <CheckCircle2 size={16} className="text-green-600" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>{toast}</span>
        </div>
      )}

    </div>
  );
}
