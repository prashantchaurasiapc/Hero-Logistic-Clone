import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  User, Phone, Mail, MapPin, Settings, Globe, Clock, Calendar,
  Shield, Check, Monitor, Smartphone, Camera, ChevronRight, 
  Lock, Edit3, Grid, CalendarDays, Truck, Map, MessageSquare, History, Bell, Box,
  Warehouse, QrCode, FileText, CheckCircle2, AlertTriangle, Layers, Home,
  ShieldCheck, CheckCircle, ExternalLink, Activity, Eye, Award
} from 'lucide-react';

export default function Profile() {
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Profile Main States
  const [name, setName] = useState('Staff');
  const [role, setRole] = useState('Warehouse Staff');
  const [status, setStatus] = useState('Available');
  const [employeeId, setEmployeeId] = useState('-');
  const [email, setEmail] = useState('-');
  const [phone, setPhone] = useState('-');
  const [department, setDepartment] = useState('Warehouse Operations');
  const [depot, setDepot] = useState('-');
  const [reportsTo, setReportsTo] = useState('-');
  const [joinedOn, setJoinedOn] = useState('-');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/warehouse-portal/profile');
        if (res.data && res.data.success && res.data.data?.profile) {
          const p = res.data.data.profile;
          if (p.name) setName(p.name);
          if (p.role) setRole(p.role);
          if (p.status) setStatus(p.status);
          if (p.driverCode || p.userId) setEmployeeId(p.driverCode || `ID-${p.userId?.slice(0, 6)}`);
          if (p.email) {
            setEmail(p.email);
            setWorkEmail(p.email);
          }
          if (p.phone) {
            setPhone(p.phone);
            setMobilePhone(p.phone);
          }
          if (p.warehouse?.name) setDepot(p.warehouse.name);
          else if (p.branch?.name) setDepot(p.branch.name);
          if (p.joiningDate) setJoinedOn(new Date(p.joiningDate).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }));
          if (p.address) setAddress(`${p.address}${p.city ? ', ' + p.city : ''}${p.state ? ' ' + p.state : ''}`);
        }
      } catch (err) {
        console.error('Error fetching warehouse staff profile:', err);
      }
    };
    fetchProfile();
  }, []);

  // Contact & Address
  const [address, setAddress] = useState('12 Logistics Way, Eastern Creek NSW 2766, Australia');
  const [workEmail, setWorkEmail] = useState('wsmith@herologistics.com');
  const [mobilePhone, setMobilePhone] = useState('+61 412 345 678');
  const [workPhone, setWorkPhone] = useState('+61 2 8765 4321');

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState('Komal Smith');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('+61 400 987 654');

  // Preferences
  const [language, setLanguage] = useState('English (Australia)');
  const [timeZone, setTimeZone] = useState('(GMT+10:00) Australia/Sydney');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('12-Hour (AM/PM)');

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get('/warehouse-portal/profile');
        if (res.data?.success) {
          const data = res.data.data.profile;
          setName(data.name);
          setRole(data.role);
          setStatus(data.status);
          setEmployeeId(data.employeeId);
          setEmail(data.email);
          setPhone(data.phone);
          setDepartment(data.department);
          setDepot(data.depot);
          setReportsTo(data.reportsTo);
          setJoinedOn(data.joinedOn);
          setAddress(data.address);
          setWorkPhone(data.phoneWork);
          setEmergencyName(data.emergencyContact?.name || '');
          setEmergencyRelation(data.emergencyContact?.relationship || '');
          setEmergencyPhone(data.emergencyContact?.phone || '');
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProfile();
  }, []);
  const [tempPhone, setTempPhone] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempAddress, setTempAddress] = useState('');
  const [tempEmergencyName, setTempEmergencyName] = useState('');
  const [tempEmergencyPhone, setTempEmergencyPhone] = useState('');

  const openEditModal = () => {
    setTempName(name);
    setTempPhone(phone);
    setTempEmail(email);
    setTempAddress(address);
    setTempEmergencyName(emergencyName);
    setTempEmergencyPhone(emergencyPhone);
    setEditModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setName(tempName);
    setPhone(tempPhone);
    setEmail(tempEmail);
    setWorkEmail(tempEmail);
    setMobilePhone(tempPhone);
    setAddress(tempAddress);
    setEmergencyName(tempEmergencyName);
    setEmergencyPhone(tempEmergencyPhone);
    setEditModalOpen(false);
    showToast('✓ Profile updated successfully!');
  };

  return (
    <div className="wh-profile-wrapper font-sans min-h-screen p-6 w-full custom-scrollbar overflow-y-auto box-border">
      <style>{`
        .wh-profile-wrapper {
          background-color: #F8FAFC;
          color: #0F172A;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        /* HEADER */
        .wh-p-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .wh-p-title {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.2px;
          text-transform: uppercase;
        }
        .wh-p-subtitle {
          font-size: 12px;
          color: #64748B;
          margin-top: 3px;
        }
        .wh-btn-edit-p {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 36px;
          padding: 0 16px;
          border-radius: 8px;
          border: 1px solid #D97706;
          background: #FFFFFF;
          color: #D97706;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }
        .wh-btn-edit-p:hover {
          background: #FFFBEB;
          color: #B45309;
          border-color: #B45309;
        }

        /* CARDS GRID LAYOUT */
        .wh-p-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          align-items: flex-start;
        }

        @media (max-width: 1024px) {
          .wh-p-grid {
            grid-template-columns: 1fr;
          }
        }

        .wh-p-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .wh-p-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .wh-p-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #F1F5F9;
        }
        .wh-p-card-title {
          font-size: 11px;
          font-weight: 900;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin: 0;
        }
        .wh-p-card-link {
          font-size: 11px;
          font-weight: 700;
          color: #0284C7;
          cursor: pointer;
          text-decoration: none;
        }
        .wh-p-card-link:hover {
          text-decoration: underline;
        }

        /* MAIN USER PROFILE CARD */
        .wh-p-avatar-wrap {
          position: relative;
          width: 84px;
          height: 84px;
          margin: 0 auto 12px;
        }
        .wh-p-avatar-circle {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: #DBEAFE;
          color: #1D4ED8;
          font-size: 26px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #BFDBFE;
        }
        .wh-p-avatar-cam {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .wh-p-user-name {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
          text-align: center;
          margin: 0 0 2px 0;
        }
        .wh-p-user-sub {
          font-size: 12px;
          color: #64748B;
          text-align: center;
          margin: 0 0 8px 0;
        }
        .wh-p-status-pill {
          display: inline-block;
          background: #DCFCE7;
          color: #166534;
          border: 1px solid #BBF7D0;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 10px;
          border-radius: 20px;
          margin: 0 auto 16px;
          text-align: center;
        }

        .wh-p-info-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid #F1F5F9;
        }
        .wh-p-info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11.5px;
        }
        .wh-p-info-lbl {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748B;
          font-weight: 500;
        }
        .wh-p-info-val {
          color: #0F172A;
          font-weight: 700;
          text-align: right;
        }

        /* PREFERENCE DROPDOWNS */
        .wh-p-pref-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 11.5px;
        }
        .wh-p-pref-row:last-child {
          margin-bottom: 0;
        }
        .wh-p-pref-lbl {
          color: #64748B;
          font-weight: 600;
        }
        .wh-p-pref-select {
          height: 28px;
          padding: 0 24px 0 8px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          color: #0F172A;
          font-size: 11px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%64748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 6px center;
        }

        /* CONTACT & ADDRESS */
        .wh-p-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }
        .wh-p-contact-item:last-child {
          margin-bottom: 0;
        }
        .wh-p-contact-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          flex-shrink: 0;
        }
        .wh-p-contact-lbl {
          font-size: 10px;
          color: #64748B;
          font-weight: 600;
          margin-bottom: 1px;
        }
        .wh-p-contact-val {
          font-size: 12px;
          color: #0F172A;
          font-weight: 700;
        }

        /* EMERGENCY CONTACT */
        .wh-p-emerg-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 11.5px;
        }
        .wh-p-emerg-row {
          display: flex;
          justify-content: space-between;
        }
        .wh-p-emerg-lbl { color: #64748B; font-weight: 500; }
        .wh-p-emerg-val { color: #0F172A; font-weight: 700; }

        /* DOCUMENTS & CERTIFICATIONS */
        .wh-p-doc-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          border-radius: 8px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          margin-bottom: 8px;
        }
        .wh-p-doc-item:last-child { margin-bottom: 0; }
        .wh-p-doc-left { display: flex; align-items: center; gap: 10px; }
        .wh-p-doc-icon {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .wh-p-doc-title { font-size: 11.5px; font-weight: 800; color: #0F172A; }
        .wh-p-doc-badge {
          display: inline-block; font-size: 9px; font-weight: 800;
          padding: 1px 6px; border-radius: 4px; background: #DCFCE7;
          color: #166534; border: 1px solid #BBF7D0; margin-left: 6px;
        }
        .wh-p-doc-expiry { font-size: 10px; color: #64748B; text-align: right; }
        .wh-p-doc-exp-val { font-weight: 700; color: #0F172A; }

        /* SKILLS & PROGRESS BARS */
        .wh-p-skill-item { margin-bottom: 12px; }
        .wh-p-skill-item:last-child { margin-bottom: 0; }
        .wh-p-skill-top { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; }
        .wh-p-skill-name { color: #0F172A; font-weight: 600; }
        .wh-p-skill-lvl { color: #64748B; font-weight: 700; }
        .wh-p-skill-bar-bg { width: 100%; height: 6px; background: #E2E8F0; border-radius: 10px; overflow: hidden; }
        .wh-p-skill-bar-fill { height: 100%; background: #2563EB; border-radius: 10px; }

        /* WAREHOUSE PERMISSIONS */
        .wh-p-perm-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          color: #0F172A;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .wh-p-perm-item:last-child { margin-bottom: 0; }
        .wh-p-perm-icon { color: #16A34A; flex-shrink: 0; }

        /* ACCOUNT SECURITY */
        .wh-p-sec-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #F1F5F9;
          font-size: 11.5px;
        }
        .wh-p-sec-row:last-child { border-bottom: none; }
        .wh-p-sec-lbl { color: #64748B; font-weight: 500; }
        .wh-p-sec-act { font-size: 11px; font-weight: 700; color: #0284C7; cursor: pointer; }
        .wh-p-sec-act:hover { text-decoration: underline; }

        /* MODAL POPUP OVERLAY */
        .wh-p-modal-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px); z-index: 999999; display: flex;
          align-items: center; justify-content: center; padding: 16px;
        }
        .wh-p-modal-box {
          background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px;
          width: 100%; max-width: 500px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
          overflow: hidden; display: flex; flex-direction: column;
        }
        .wh-p-modal-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px; border-bottom: 1px solid #E2E8F0; background: #F8FAFC;
        }
        .wh-p-modal-title { font-size: 13px; font-weight: 900; color: #0F172A; text-transform: uppercase; }
        .wh-p-modal-body { padding: 18px; display: flex; flex-direction: column; gap: 12px; }
        .wh-p-form-lbl { font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase; margin-bottom: 4px; display: block; }
        .wh-p-form-input {
          width: 100%; height: 34px; padding: 0 10px; background: #FFFFFF;
          border: 1px solid #CBD5E1; border-radius: 6px; color: #0F172A;
          font-size: 11.5px; outline: none; box-sizing: border-box; font-weight: 600;
        }
        .wh-p-form-input:focus { border-color: #F59E0B; }
      `}</style>

      {/* HEADER ROW */}
      <div className="wh-p-header">
        <div>
          <h1 className="wh-p-title">PROFILE</h1>
          <p className="wh-p-subtitle">View and manage your profile and account settings.</p>
        </div>
        <button className="wh-btn-edit-p" onClick={openEditModal}>
          <Edit3 size={14} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* CARDS GRID LAYOUT */}
      <div className="wh-p-grid">

        {/* LEFT COLUMN */}
        <div className="wh-p-col">

          {/* USER MAIN CARD */}
          <div className="wh-p-card" style={{ textAlign: 'center' }}>
            <div className="wh-p-avatar-wrap">
              <div className="wh-p-avatar-circle">WS</div>
              <div className="wh-p-avatar-cam" title="Change Avatar"><Camera size={12} /></div>
            </div>

            <h2 className="wh-p-user-name">{name}</h2>
            <p className="wh-p-user-sub">{role}</p>

            <div style={{ textAlign: 'center' }}>
              <div className="wh-p-status-pill">{status}</div>
            </div>

            <div className="wh-p-info-list">
              <div className="wh-p-info-row">
                <span className="wh-p-info-lbl"><Calendar size={13} /> Employee ID</span>
                <span className="wh-p-info-val font-mono">{employeeId}</span>
              </div>
              <div className="wh-p-info-row">
                <span className="wh-p-info-lbl"><Mail size={13} /> Email</span>
                <span className="wh-p-info-val text-[11px] text-sky-600 font-mono">{email}</span>
              </div>
              <div className="wh-p-info-row">
                <span className="wh-p-info-lbl"><Phone size={13} /> Phone</span>
                <span className="wh-p-info-val">{phone}</span>
              </div>
              <div className="wh-p-info-row">
                <span className="wh-p-info-lbl"><Warehouse size={13} /> Department</span>
                <span className="wh-p-info-val">{department}</span>
              </div>
              <div className="wh-p-info-row">
                <span className="wh-p-info-lbl"><MapPin size={13} /> Depot</span>
                <span className="wh-p-info-val">{depot}</span>
              </div>
              <div className="wh-p-info-row">
                <span className="wh-p-info-lbl"><User size={13} /> Role</span>
                <span className="wh-p-info-val">{role}</span>
              </div>
              <div className="wh-p-info-row">
                <span className="wh-p-info-lbl"><Shield size={13} /> Reports To</span>
                <span className="wh-p-info-val text-[10.5px]">{reportsTo}</span>
              </div>
              <div className="wh-p-info-row">
                <span className="wh-p-info-lbl"><Clock size={13} /> Joined On</span>
                <span className="wh-p-info-val">{joinedOn}</span>
              </div>
            </div>
          </div>

          {/* PREFERENCE SETTINGS */}
          <div className="wh-p-card">
            <div className="wh-p-card-header">
              <h3 className="wh-p-card-title">PREFERENCE SETTINGS</h3>
            </div>

            <div className="wh-p-pref-row">
              <span className="wh-p-pref-lbl">Language</span>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="wh-p-pref-select">
                <option value="English (Australia)">English (Australia)</option>
                <option value="English (US)">English (US)</option>
              </select>
            </div>

            <div className="wh-p-pref-row">
              <span className="wh-p-pref-lbl">Time Zone</span>
              <select value={timeZone} onChange={e => setTimeZone(e.target.value)} className="wh-p-pref-select">
                <option value="(GMT+10:00) Australia/Sydney">(GMT+10:00) Australia/Sydney</option>
                <option value="(GMT+08:00) Australia/Perth">(GMT+08:00) Australia/Perth</option>
              </select>
            </div>

            <div className="wh-p-pref-row">
              <span className="wh-p-pref-lbl">Date Format</span>
              <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className="wh-p-pref-select">
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>

            <div className="wh-p-pref-row">
              <span className="wh-p-pref-lbl">Time Format</span>
              <select value={timeFormat} onChange={e => setTimeFormat(e.target.value)} className="wh-p-pref-select">
                <option value="12-Hour (AM/PM)">12-Hour (AM/PM)</option>
                <option value="24-Hour">24-Hour</option>
              </select>
            </div>
          </div>

        </div>

        {/* MIDDLE COLUMN */}
        <div className="wh-p-col">

          {/* CONTACT & ADDRESS */}
          <div className="wh-p-card">
            <div className="wh-p-card-header">
              <h3 className="wh-p-card-title">CONTACT & ADDRESS</h3>
            </div>

            <div className="wh-p-contact-item">
              <div className="wh-p-contact-icon"><Home size={15} /></div>
              <div>
                <div className="wh-p-contact-lbl">Address</div>
                <div className="wh-p-contact-val">{address}</div>
              </div>
            </div>

            <div className="wh-p-contact-item">
              <div className="wh-p-contact-icon"><Mail size={15} /></div>
              <div>
                <div className="wh-p-contact-lbl">Email (Work)</div>
                <div className="wh-p-contact-val text-sky-600 font-mono">{workEmail}</div>
              </div>
            </div>

            <div className="wh-p-contact-item">
              <div className="wh-p-contact-icon"><Phone size={15} /></div>
              <div>
                <div className="wh-p-contact-lbl">Phone (Mobile)</div>
                <div className="wh-p-contact-val">{mobilePhone}</div>
              </div>
            </div>

            <div className="wh-p-contact-item">
              <div className="wh-p-contact-icon"><Phone size={15} /></div>
              <div>
                <div className="wh-p-contact-lbl">Phone (Work)</div>
                <div className="wh-p-contact-val">{workPhone}</div>
              </div>
            </div>
          </div>

          {/* EMERGENCY CONTACT */}
          <div className="wh-p-card">
            <div className="wh-p-card-header">
              <h3 className="wh-p-card-title">EMERGENCY CONTACT</h3>
            </div>

            <div className="wh-p-emerg-grid">
              <div className="wh-p-emerg-row">
                <span className="wh-p-emerg-lbl">Name</span>
                <span className="wh-p-emerg-val">{emergencyName}</span>
              </div>
              <div className="wh-p-emerg-row">
                <span className="wh-p-emerg-lbl">Relationship</span>
                <span className="wh-p-emerg-val">{emergencyRelation}</span>
              </div>
              <div className="wh-p-emerg-row">
                <span className="wh-p-emerg-lbl">Phone</span>
                <span className="wh-p-emerg-val font-mono">{emergencyPhone}</span>
              </div>
            </div>
          </div>

          {/* DOCUMENTS & CERTIFICATIONS */}
          <div className="wh-p-card">
            <div className="wh-p-card-header">
              <h3 className="wh-p-card-title">DOCUMENTS & CERTIFICATIONS</h3>
              <span className="wh-p-card-link" onClick={() => showToast('Opening all documents...')}>View all</span>
            </div>

            {/* Item 1 */}
            <div className="wh-p-doc-item">
              <div className="wh-p-doc-left">
                <div className="wh-p-doc-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}>
                  <FileText size={16} />
                </div>
                <div>
                  <div className="wh-p-doc-title">
                    General Induction <span className="wh-p-doc-badge">Verified</span>
                  </div>
                </div>
              </div>
              <div className="wh-p-doc-expiry">
                <div>Expiry Date</div>
                <div className="wh-p-doc-exp-val">15 Mar 2026</div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="wh-p-doc-item">
              <div className="wh-p-doc-left">
                <div className="wh-p-doc-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                  <Truck size={16} />
                </div>
                <div>
                  <div className="wh-p-doc-title">
                    Forklift Licence <span className="wh-p-doc-badge">Verified</span>
                  </div>
                </div>
              </div>
              <div className="wh-p-doc-expiry">
                <div>Expiry Date</div>
                <div className="wh-p-doc-exp-val">22 Oct 2026</div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="wh-p-doc-item">
              <div className="wh-p-doc-left">
                <div className="wh-p-doc-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}>
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="wh-p-doc-title">
                    First Aid Certificate <span className="wh-p-doc-badge">Verified</span>
                  </div>
                </div>
              </div>
              <div className="wh-p-doc-expiry">
                <div>Expiry Date</div>
                <div className="wh-p-doc-exp-val">10 Dec 2025</div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="wh-p-doc-item">
              <div className="wh-p-doc-left">
                <div className="wh-p-doc-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <div className="wh-p-doc-title">
                    WH&S Training <span className="wh-p-doc-badge">Verified</span>
                  </div>
                </div>
              </div>
              <div className="wh-p-doc-expiry">
                <div>Expiry Date</div>
                <div className="wh-p-doc-exp-val">15 Mar 2026</div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="wh-p-col">

          {/* SKILLS & COMPETENCIES */}
          <div className="wh-p-card">
            <div className="wh-p-card-header">
              <h3 className="wh-p-card-title">SKILLS & COMPETENCIES</h3>
              <span className="wh-p-card-link" onClick={() => showToast('Opening skills list...')}>View all</span>
            </div>

            <div className="wh-p-skill-item">
              <div className="wh-p-skill-top">
                <span className="wh-p-skill-name">Forklift Operation</span>
                <span className="wh-p-skill-lvl">Expert</span>
              </div>
              <div className="wh-p-skill-bar-bg">
                <div className="wh-p-skill-bar-fill" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="wh-p-skill-item">
              <div className="wh-p-skill-top">
                <span className="wh-p-skill-name">Inventory Handling</span>
                <span className="wh-p-skill-lvl">Advanced</span>
              </div>
              <div className="wh-p-skill-bar-bg">
                <div className="wh-p-skill-bar-fill" style={{ width: '70%' }} />
              </div>
            </div>

            <div className="wh-p-skill-item">
              <div className="wh-p-skill-top">
                <span className="wh-p-skill-name">Pallet Handling</span>
                <span className="wh-p-skill-lvl">Advanced</span>
              </div>
              <div className="wh-p-skill-bar-bg">
                <div className="wh-p-skill-bar-fill" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="wh-p-skill-item">
              <div className="wh-p-skill-top">
                <span className="wh-p-skill-name">WMS System</span>
                <span className="wh-p-skill-lvl">Advanced</span>
              </div>
              <div className="wh-p-skill-bar-bg">
                <div className="wh-p-skill-bar-fill" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="wh-p-skill-item">
              <div className="wh-p-skill-top">
                <span className="wh-p-skill-name">Safety Compliance</span>
                <span className="wh-p-skill-lvl">Expert</span>
              </div>
              <div className="wh-p-skill-bar-bg">
                <div className="wh-p-skill-bar-fill" style={{ width: '85%' }} />
              </div>
            </div>
          </div>

          {/* WAREHOUSE PERMISSIONS */}
          <div className="wh-p-card">
            <div className="wh-p-card-header">
              <h3 className="wh-p-card-title">WAREHOUSE PERMISSIONS</h3>
              <span className="wh-p-card-link" onClick={() => showToast('Viewing all permissions...')}>View all</span>
            </div>

            <div className="wh-p-perm-item">
              <CheckCircle size={15} className="wh-p-perm-icon" />
              <span>Receive Stock (Inbound)</span>
            </div>
            <div className="wh-p-perm-item">
              <CheckCircle size={15} className="wh-p-perm-icon" />
              <span>Move / Transfer Stock</span>
            </div>
            <div className="wh-p-perm-item">
              <CheckCircle size={15} className="wh-p-perm-icon" />
              <span>Load Lane Management</span>
            </div>
            <div className="wh-p-perm-item">
              <CheckCircle size={15} className="wh-p-perm-icon" />
              <span>Dispatch Ready</span>
            </div>
            <div className="wh-p-perm-item">
              <CheckCircle size={15} className="wh-p-perm-icon" />
              <span>View Movement History</span>
            </div>
            <div className="wh-p-perm-item">
              <CheckCircle size={15} className="wh-p-perm-icon" />
              <span>Messaging</span>
            </div>
            <div className="wh-p-perm-item">
              <CheckCircle size={15} className="wh-p-perm-icon" />
              <span>Report Issues</span>
            </div>
            <div className="wh-p-perm-item">
              <CheckCircle size={15} className="wh-p-perm-icon" />
              <span>View Reports</span>
            </div>
          </div>

          {/* ACCOUNT SECURITY */}
          <div className="wh-p-card">
            <div className="wh-p-card-header">
              <h3 className="wh-p-card-title">ACCOUNT SECURITY</h3>
            </div>

            <div className="wh-p-sec-row">
              <span className="wh-p-sec-lbl">Password</span>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono">••••••••</span>
                <span className="wh-p-sec-act" onClick={() => showToast('Opening password reset panel...')}>Change</span>
              </div>
            </div>

            <div className="wh-p-sec-row">
              <span className="wh-p-sec-lbl">Two-Factor Authentication</span>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">Enabled</span>
                <span className="wh-p-sec-act" onClick={() => showToast('Opening 2FA settings...')}>Manage</span>
              </div>
            </div>

            <div className="wh-p-sec-row">
              <span className="wh-p-sec-lbl">Active Sessions</span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800">2</span>
                <span className="wh-p-sec-act" onClick={() => showToast('Viewing active sessions...')}>View</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* EDIT PROFILE MODAL POPUP */}
      {editModalOpen && (
        <div className="wh-p-modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="wh-p-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wh-p-modal-header">
              <span className="wh-p-modal-title">Edit Warehouse Staff Profile</span>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} className="wh-p-modal-body">
              <div>
                <label className="wh-p-form-lbl">Full Name</label>
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  className="wh-p-form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="wh-p-form-lbl">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={tempPhone}
                    onChange={e => setTempPhone(e.target.value)}
                    className="wh-p-form-input font-mono"
                  />
                </div>
                <div>
                  <label className="wh-p-form-lbl">Work Email</label>
                  <input
                    type="email"
                    required
                    value={tempEmail}
                    onChange={e => setTempEmail(e.target.value)}
                    className="wh-p-form-input font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="wh-p-form-lbl">Home Address</label>
                <input
                  type="text"
                  required
                  value={tempAddress}
                  onChange={e => setTempAddress(e.target.value)}
                  className="wh-p-form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="wh-p-form-lbl">Emergency Contact Name</label>
                  <input
                    type="text"
                    required
                    value={tempEmergencyName}
                    onChange={e => setTempEmergencyName(e.target.value)}
                    className="wh-p-form-input"
                  />
                </div>
                <div>
                  <label className="wh-p-form-lbl">Emergency Phone</label>
                  <input
                    type="text"
                    required
                    value={tempEmergencyPhone}
                    onChange={e => setTempEmergencyPhone(e.target.value)}
                    className="wh-p-form-input font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 mt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 rounded-md text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 rounded-md text-xs font-extrabold text-slate-950 hover:bg-amber-400 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#ECFDF5', border: '1px solid #10B981', borderRadius: 8,
          padding: '12px 18px', display: 'flex', items: 'center', gap: 10,
          zIndex: 99998, boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          fontSize: 12, fontWeight: 800, color: '#065F46'
        }}>
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
