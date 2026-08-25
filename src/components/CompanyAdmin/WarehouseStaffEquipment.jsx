import React, { useState, useEffect } from 'react';
import api from '../../services/api';

// === ICONS ===
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);
const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
);
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const MoreHorizontalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>
  </svg>
);
const UsersIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
const SettingsIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);
const LockIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const BookOpenIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);
const BoxIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
const WifiIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);
const ShieldIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);
const SmallCircleIcon = ({ color }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);
const UserPlusIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);
const PrinterIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);
const PlusCircleIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);
const ClipboardCheckIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
    <rect x="9" y="3" width="6" height="4" rx="1"></rect>
    <path d="M9 14l2 2 4-4"></path>
  </svg>
);
const Lock2Icon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const PieChartIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
);

export default function WarehouseStaffEquipment({ wh, onBack }) {
  const [staffList, setStaffList] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [modalTab, setModalTab] = useState('staff');
  const [viewStaffModal, setViewStaffModal] = useState(null);
  const [viewEquipmentModal, setViewEquipmentModal] = useState(null);
  const [staffMenuIndex, setStaffMenuIndex] = useState(null);
  const [equipmentMenuIndex, setEquipmentMenuIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states for Staff
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Picker / Packer');
  const [staffShift, setStaffShift] = useState('Day (06:00 - 14:00)');
  const [submittingStaff, setSubmittingStaff] = useState(false);

  // Form states for Equipment
  const [equipName, setEquipName] = useState('');
  const [equipType, setEquipType] = useState('Forklift');
  const [equipNextService, setEquipNextService] = useState('');
  const [equipIotId, setEquipIotId] = useState('');
  const [isPairingIot, setIsPairingIot] = useState(false);
  const [submittingEquip, setSubmittingEquip] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const resetForms = () => {
    setStaffName('');
    setStaffRole('Picker / Packer');
    setStaffShift('Day (06:00 - 14:00)');
    setEquipName('');
    setEquipType('Forklift');
    setEquipNextService('');
    setEquipIotId('');
    setIsPairingIot(false);
  };

  const fetchStaffEquipment = async () => {
    try {
      setLoading(true);
      const whId = wh?.id || 'default';
      const [staffRes, equipRes] = await Promise.all([
        api.get(`/company-admin/warehouse/${whId}/staff`).catch(() => null),
        api.get(`/company-admin/warehouse/${whId}/equipment`).catch(() => null)
      ]);

      if (staffRes?.data?.success) {
        const items = staffRes.data.data.items || staffRes.data.data || [];
        setStaffList(Array.isArray(items) ? items : []);
      }
      if (equipRes?.data?.success) {
        const items = equipRes.data.data.items || equipRes.data.data || [];
        setEquipmentList(Array.isArray(items) ? items : []);
      }
    } catch (e) {
      console.error('Fetch staff/equipment error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    if (!staffName.trim()) { showToast('⚠️ Staff full name is required'); return; }
    setSubmittingStaff(true);
    try {
      const whId = wh?.id || 'default';
      const payload = {
        name: staffName.trim(),
        role: staffRole,
        shift: staffShift
      };
      const res = await api.post(`/company-admin/warehouse/${whId}/staff`, payload);
      if (res.data && res.data.success) {
        showToast('✓ Warehouse staff added successfully!');
        resetForms();
        setShowAddStaffModal(false);
        await fetchStaffEquipment();
      } else {
        showToast('❌ Failed to add warehouse staff');
      }
    } catch (e) {
      console.error('Create staff error:', e);
      showToast('❌ Error creating staff member');
    } finally {
      setSubmittingStaff(false);
    }
  };

  const handleAddEquipment = async () => {
    if (!equipName.trim()) { showToast('⚠️ Equipment Name / ID is required'); return; }
    setSubmittingEquip(true);
    try {
      const whId = wh?.id || 'default';
      const payload = {
        name: equipName.trim(),
        type: equipType,
        nextServiceDate: equipNextService || null,
        iotDeviceId: equipIotId || null
      };
      const res = await api.post(`/company-admin/warehouse/${whId}/equipment`, payload);
      if (res.data && res.data.success) {
        showToast('✓ Equipment added successfully!');
        resetForms();
        setShowAddStaffModal(false);
        await fetchStaffEquipment();
      } else {
        showToast('❌ Failed to add equipment');
      }
    } catch (e) {
      console.error('Create equipment error:', e);
      showToast('❌ Error creating equipment asset');
    } finally {
      setSubmittingEquip(false);
    }
  };

  useEffect(() => {
    fetchStaffEquipment();
  }, [wh?.id]);

  // Dynamic calculations for Staff
  const totalStaffCount = staffList.length;
  const mgrCount = staffList.filter(s => s.role?.includes('Manager')).length;
  const supCount = staffList.filter(s => s.role?.includes('Supervisor')).length;
  const storeCount = staffList.filter(s => s.role?.includes('Storeperson')).length;
  const opCount = staffList.filter(s => s.role?.includes('Operator')).length;
  const pickerCount = staffList.filter(s => s.role?.includes('Picker') || s.role?.includes('Packer')).length;
  const calcStaffPct = (cnt) => totalStaffCount > 0 ? ((cnt / totalStaffCount) * 100).toFixed(1) + '%' : '0.0%';

  // Dynamic calculations for Equipment
  const totalEquipCount = equipmentList.length;
  const onlineCount = equipmentList.filter(e => e.status === 'Online' || e.status === 'ACTIVE' || e.status === 'Active').length;
  const offlineCount = equipmentList.filter(e => e.status === 'Offline' || e.status === 'INACTIVE' || e.status === 'Inactive').length;
  const maintCount = equipmentList.filter(e => e.status === 'Maintenance' || e.status === 'MAINTENANCE').length;
  const calcEquipPct = (cnt) => totalEquipCount > 0 ? ((cnt / totalEquipCount) * 100).toFixed(1) + '%' : '0.0%';

  return (
    <div className="wh-staff-container" style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 32px', fontFamily: "'Inter','Outfit',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 900px) {
          .wh-staff-container { padding: 16px !important; }
          .wh-staff-split { grid-template-columns: 1fr !important; gap: 20px !important; }
          .wh-devnotes-cols { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
      {/* BREADCRUMBS & HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, display: 'flex', gap: 6 }}>
            <span>Home</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ cursor: 'pointer' }} onClick={onBack}>Warehouse Details</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ color: '#0F172A' }}>Warehouse Staff & Equipment</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Warehouse Staff & Equipment – {wh?.name || 'Depot Warehouse'}</h1>
            <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
              <ShieldIcon color="#8B5CF6" />
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0 0', fontWeight: 500 }}>Manage warehouse team members, equipment and access assignments.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={onBack} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            &lt; Back to Warehouse Details
          </button>
          <button onClick={() => setShowAddStaffModal(true)} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 14, fontWeight: 400, marginTop: -2 }}>+</span> Add Staff / Equipment
          </button>
          <button style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            More Actions <span style={{ fontSize: 9 }}>▼</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, background: '#0F172A', color: '#fff', padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          {toastMessage}
        </div>
      )}

      {/* METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { title: 'WAREHOUSE STAFF', value: totalStaffCount.toString(), subtitle: 'Active staff', color: '#8B5CF6', bg: '#F5F3FF', icon: <UsersIcon color="#8B5CF6" />, link: 'all staff' },
          { title: 'EQUIPMENT', value: totalEquipCount.toString(), subtitle: 'Total equipment', color: '#22C55E', bg: '#F0FDF4', icon: <BoxIcon color="#22C55E" />, link: 'all equipment' },
          { title: 'EQUIPMENT ONLINE', value: onlineCount.toString(), subtitle: `${calcEquipPct(onlineCount)} online`, color: '#3B82F6', bg: '#EFF6FF', icon: <WifiIcon color="#3B82F6" />, link: 'live status' },
          { title: 'MAINTENANCE DUE', value: maintCount.toString(), subtitle: 'Due this month', color: '#F59E0B', bg: '#FFFBEB', icon: <SettingsIcon color="#F59E0B" />, link: 'due items' },
          { title: 'ACCESS ZONES', value: '0', subtitle: 'Configured zones', color: '#8B5CF6', bg: '#F5F3FF', icon: <LockIcon color="#8B5CF6" />, link: 'zones' },
          { title: 'TRAINING DUE', value: '0', subtitle: 'Staff training due', color: '#EF4444', bg: '#FEF2F2', icon: <BookOpenIcon color="#EF4444" />, link: 'training' }
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: '0.5px', marginBottom: 12 }}>{stat.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#64748B', marginTop: 4 }}>{stat.subtitle}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginTop: 'auto' }}>
              View {stat.link} <span>→</span>
            </div>
          </div>
        ))}
      </div>

      <div className="wh-staff-split" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* LEFT MAIN */}
        <div>


          {/* STAFF TABLE */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>WAREHOUSE STAFF ({staffList.length})</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 10, flex: 1 }}>
                <div style={{ position: 'relative', width: 220 }}>
                  <div style={{ position: 'absolute', left: 10, top: 7 }}><SearchIcon /></div>
                  <input type="text" placeholder="Search by name, role or email..." style={{ width: '100%', padding: '6px 10px 6px 34px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none' }} />
                </div>
                {['All Roles', 'All Status', 'All Shifts'].map((filter, idx) => (
                  <div key={idx} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {filter} <span style={{ fontSize: 9, color: '#94A3B8' }}>▼</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 600, color: '#1E293B', background: '#fff', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <FilterIcon /> Filters
                </button>
                <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 600, color: '#1E293B', background: '#fff', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <ExportIcon /> Export
                </button>
                <button onClick={fetchStaffEquipment} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <RefreshIcon />
                </button>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Staff ID</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Name</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Role</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Shift</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Location / Area</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Contact</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Training Due</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.length > 0 ? (
                    staffList.map((row, idx) => (
                      <tr key={row.id || idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.id}</td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#475569' }}>
                              {row.initials || 'WM'}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{row.name}</div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: row.roleColor || '#3B82F6', background: row.roleBg || '#EFF6FF', padding: '2px 8px', borderRadius: 4 }}>{row.role}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.shift}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.loc}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.phone}</td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: row.status === 'Active' ? '#22C55E' : '#F59E0B' }}>{row.status}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: row.dueColor || '#1E293B', whiteSpace: 'nowrap' }}>{row.due}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button onClick={() => setViewStaffModal(row)} style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer' }}><EyeIcon /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ padding: '32px 16px', textAlign: 'center', color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>
                        No warehouse staff registered. Click "Add Staff / Equipment" to add team members.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>Showing {staffList.length} staff</div>
              </div>
            </div>
          </div>

          {/* EQUIPMENT TABLE */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>EQUIPMENT ({equipmentList.length})</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 10, flex: 1 }}>
                <div style={{ position: 'relative', width: 220 }}>
                  <div style={{ position: 'absolute', left: 10, top: 7 }}><SearchIcon /></div>
                  <input type="text" placeholder="Search by equipment name or ID..." style={{ width: '100%', padding: '6px 10px 6px 34px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none' }} />
                </div>
                {['All Types', 'All Status', 'All Locations', 'All Conditions'].map((filter, idx) => (
                  <div key={idx} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {filter} <span style={{ fontSize: 9, color: '#94A3B8' }}>▼</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 600, color: '#1E293B', background: '#fff', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <FilterIcon /> Filters
                </button>
                <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 600, color: '#1E293B', background: '#fff', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <ExportIcon /> Export
                </button>
                <button onClick={fetchStaffEquipment} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <RefreshIcon />
                </button>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Equipment ID</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Equipment Name</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Type</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Location / Area</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Condition</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Last Check</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Next Service</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentList.length > 0 ? (
                    equipmentList.map((row, idx) => (
                      <tr key={row.id || idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.id}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>
                          <div>{row.name}</div>
                          {row.iotDeviceId && (
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '1px 6px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }}></span>
                              IoT: {row.iotDeviceId}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: row.typeColor || '#8B5CF6', whiteSpace: 'nowrap' }}>{row.type}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.loc}</td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: row.status === 'Online' ? '#22C55E' : '#EF4444' }}>{row.status}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: row.condColor || '#22C55E', whiteSpace: 'nowrap' }}>{row.cond}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.check}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: row.serviceColor || '#1E293B', whiteSpace: 'nowrap' }}>{row.service}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button onClick={() => setViewEquipmentModal(row)} style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer' }}><EyeIcon /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ padding: '32px 16px', textAlign: 'center', color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>
                        No equipment registered. Click "Add Staff / Equipment" to add machinery & scanners.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>Showing {equipmentList.length} equipment</div>
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* STAFF SUMMARY */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>STAFF SUMMARY</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', background: 'conic-gradient(#3B82F6 0% 20%, #22C55E 20% 50%, #8B5CF6 50% 80%, #F59E0B 80% 100%)' }}>
                <div style={{ position: 'absolute', top: 14, left: 14, right: 14, bottom: 14, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{totalStaffCount}</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#64748B', marginTop: 2, textAlign: 'center' }}>Total Staff</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                {[
                  { label: 'Warehouse Manager', val: mgrCount.toString(), pct: calcStaffPct(mgrCount), color: '#3B82F6' },
                  { label: 'Supervisors', val: supCount.toString(), pct: calcStaffPct(supCount), color: '#3B82F6' },
                  { label: 'Storepersons', val: storeCount.toString(), pct: calcStaffPct(storeCount), color: '#22C55E' },
                  { label: 'Operators', val: opCount.toString(), pct: calcStaffPct(opCount), color: '#8B5CF6' },
                  { label: 'Pickers / Packers', val: pickerCount.toString(), pct: calcStaffPct(pickerCount), color: '#F59E0B' }
                ].map((l, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#1E293B' }}><SmallCircleIcon color={l.color} /> {l.label}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', display: 'flex', gap: 6 }}>
                      <span>{l.val}</span> <span style={{ color: '#64748B' }}>({l.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* EQUIPMENT STATUS */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>EQUIPMENT STATUS</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Chart →</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', background: 'conic-gradient(#22C55E 0% 75%, #EF4444 75% 90%, #F59E0B 90% 100%)' }}>
                <div style={{ position: 'absolute', top: 14, left: 14, right: 14, bottom: 14, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{totalEquipCount}</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#64748B', marginTop: 2, textAlign: 'center', lineHeight: 1.2 }}>Total<br/>Equipment</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {[
                  { label: 'Online', val: onlineCount.toString(), pct: calcEquipPct(onlineCount), color: '#22C55E' },
                  { label: 'Offline', val: offlineCount.toString(), pct: calcEquipPct(offlineCount), color: '#EF4444' },
                  { label: 'Maintenance', val: maintCount.toString(), pct: calcEquipPct(maintCount), color: '#F59E0B' }
                ].map((l, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#1E293B' }}><SmallCircleIcon color={l.color} /> {l.label}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', display: 'flex', gap: 6 }}>
                      <span>{l.val}</span> <span style={{ color: '#64748B' }}>({l.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* UPCOMING MAINTENANCE */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>UPCOMING MAINTENANCE</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View All →</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {equipmentList.length > 0 ? (
                equipmentList.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <SettingsIcon color="#8B5CF6" />
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#1E293B' }}>{m.name}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#EF4444' }}>{m.service || 'Scheduled'}</div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', padding: '8px 0' }}>
                  No upcoming maintenance scheduled.
                </div>
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', marginBottom: 16 }}>QUICK ACTIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Add Staff', icon: <UserPlusIcon color="#4F46E5" /> },
                { label: 'Print ID Cards', icon: <PrinterIcon color="#4F46E5" /> },
                { label: 'Add Equipment', icon: <PlusCircleIcon color="#4F46E5" /> },
                { label: 'Equipment Check', icon: <ClipboardCheckIcon color="#4F46E5" /> },
                { label: 'Assign Access', icon: <Lock2Icon color="#4F46E5" /> },
                { label: 'Access Zones', icon: <ShieldIcon color="#4F46E5" /> },
                { label: 'Create Maintenance', icon: <SettingsIcon color="#4F46E5" /> },
                { label: 'Bulk Assign Training', icon: <BookOpenIcon color="#4F46E5" /> },
                { label: 'Record Training', icon: <BookOpenIcon color="#4F46E5" /> },
                { label: 'View All Reports', icon: <PieChartIcon color="#4F46E5" /> }
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {a.icon}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{a.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ADD STAFF / EQUIPMENT MODAL */}
      {showAddStaffModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)' }} onClick={() => { resetForms(); setShowAddStaffModal(false); }}></div>
          <div style={{ background: '#fff', width: '600px', borderRadius: 16, padding: '32px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0F172A' }}>Add Resource</h2>
              <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 8, padding: 4 }}>
                <button onClick={() => setModalTab('staff')} style={{ padding: '6px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, border: 'none', background: modalTab === 'staff' ? '#fff' : 'transparent', color: modalTab === 'staff' ? '#0F172A' : '#64748B', boxShadow: modalTab === 'staff' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>Staff</button>
                <button onClick={() => setModalTab('equipment')} style={{ padding: '6px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, border: 'none', background: modalTab === 'equipment' ? '#fff' : 'transparent', color: modalTab === 'equipment' ? '#0F172A' : '#64748B', boxShadow: modalTab === 'equipment' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>Equipment</button>
              </div>
            </div>

            {modalTab === 'staff' ? (
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Full Name *</label>
                  <input
                    type="text"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="e.g. John Doe"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Role / Position</label>
                    <select
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}
                    >
                      <option value="Picker / Packer">Picker / Packer</option>
                      <option value="Forklift Operator">Forklift Operator</option>
                      <option value="Storeperson">Storeperson</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Warehouse Manager">Warehouse Manager</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Assigned Shift</label>
                    <select
                      value={staffShift}
                      onChange={(e) => setStaffShift(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}
                    >
                      <option value="Day (06:00 - 14:00)">Day (06:00 - 14:00)</option>
                      <option value="Afternoon (14:00 - 22:00)">Afternoon (14:00 - 22:00)</option>
                      <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Equipment Name / ID *</label>
                  <input
                    type="text"
                    value={equipName}
                    onChange={(e) => setEquipName(e.target.value)}
                    placeholder="e.g. Forklift FL01"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Equipment Type</label>
                    <select
                      value={equipType}
                      onChange={(e) => setEquipType(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}
                    >
                      <option value="Forklift">Forklift</option>
                      <option value="Reach Truck">Reach Truck</option>
                      <option value="Pallet Jack">Pallet Jack</option>
                      <option value="Scanner">Scanner</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Next Service Date</label>
                    <input
                      type="date"
                      value={equipNextService}
                      onChange={(e) => setEquipNextService(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', color: '#0F172A' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>IoT Tracking Assignment</label>
                  {!equipIotId ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div
                        onClick={() => {
                          const autoId = `IOT-TRK-${Math.floor(1000 + Math.random() * 9000)}`;
                          setEquipIotId(autoId);
                          setIsPairingIot(true);
                          showToast(`⚡ Paired with IoT Tracker: ${autoId}`);
                        }}
                        style={{ padding: '14px', background: '#F8FAFC', border: '2px dashed #CBD5E1', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <span style={{ fontSize: 16 }}>+</span> Pair with new IoT Tracker
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>or enter manual ID:</span>
                        <input
                          type="text"
                          value={equipIotId}
                          onChange={(e) => setEquipIotId(e.target.value)}
                          placeholder="e.g. IOT-GPS-9901"
                          style={{ flex: 1, padding: '6px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                            IoT Tracker Paired
                            <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>ACTIVE</span>
                          </div>
                          <div style={{ fontSize: 11, color: '#15803D', marginTop: 2 }}>
                            Device ID: <strong>{equipIotId}</strong> • Signal Strong (98%)
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setEquipIotId(''); setIsPairingIot(false); showToast('Unpaired IoT Tracker'); }}
                        style={{ background: '#fff', border: '1px solid #CBD5E1', borderRadius: 6, padding: '6px 10px', fontSize: 11, fontWeight: 700, color: '#EF4444', cursor: 'pointer' }}
                      >
                        Unpair
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button onClick={() => { resetForms(); setShowAddStaffModal(false); }} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={modalTab === 'staff' ? handleAddStaff : handleAddEquipment}
                disabled={submittingStaff || submittingEquip}
                style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', background: (submittingStaff || submittingEquip) ? '#A5B4FC' : '#4F46E5', color: '#fff', cursor: (submittingStaff || submittingEquip) ? 'not-allowed' : 'pointer' }}
              >
                {modalTab === 'staff' ? (submittingStaff ? 'Adding Staff...' : 'Add Staff') : (submittingEquip ? 'Adding Equipment...' : 'Add Equipment')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW STAFF DETAILS MODAL */}
      {viewStaffModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(3px)' }} onClick={() => setViewStaffModal(null)} />
          <div style={{ background: '#fff', width: '520px', borderRadius: 20, padding: '28px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EEF2FF', border: '1px solid #C7D2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#4F46E5' }}>
                  {viewStaffModal.initials}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{viewStaffModal.name}</h2>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: 500 }}>ID: {viewStaffModal.id} • {viewStaffModal.role}</div>
                </div>
              </div>
              <button onClick={() => setViewStaffModal(null)} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748B' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Role & Access</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: viewStaffModal.roleColor, marginTop: 4 }}>{viewStaffModal.role}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Status</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: viewStaffModal.status === 'Active' ? '#22C55E' : '#F59E0B', marginTop: 4 }}>{viewStaffModal.status}</div>
              </div>
            </div>

            <div style={{ background: '#FFF', padding: '14px', borderRadius: 12, border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 2 }}>Shift</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{viewStaffModal.shift}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 2 }}>Assigned Zone</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{viewStaffModal.loc}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 2 }}>Contact Phone</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{viewStaffModal.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 2 }}>Training Due Date</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: viewStaffModal.dueColor }}>{viewStaffModal.due}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <button onClick={() => setViewStaffModal(null)} style={{ padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', background: '#0F172A', color: '#fff', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW EQUIPMENT DETAILS MODAL */}
      {viewEquipmentModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(3px)' }} onClick={() => setViewEquipmentModal(null)} />
          <div style={{ background: '#fff', width: '520px', borderRadius: 20, padding: '28px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: viewEquipmentModal.typeColor, background: '#F8FAFC', padding: '3px 8px', borderRadius: 6, border: '1px solid #E2E8F0' }}>{viewEquipmentModal.type}</span>
                <h2 style={{ margin: '6px 0 0 0', fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{viewEquipmentModal.name}</h2>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: 500 }}>ID: {viewEquipmentModal.id}</div>
              </div>
              <button onClick={() => setViewEquipmentModal(null)} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748B' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Status</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: viewEquipmentModal.status === 'Online' ? '#22C55E' : '#EF4444', marginTop: 4 }}>{viewEquipmentModal.status}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Condition</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: viewEquipmentModal.condColor, marginTop: 4 }}>{viewEquipmentModal.cond}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Location</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>{viewEquipmentModal.loc}</div>
              </div>
            </div>

            <div style={{ background: '#FFF', padding: '14px', borderRadius: 12, border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 2 }}>Last Safety Check</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{viewEquipmentModal.check}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 2 }}>Next Service Date</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: viewEquipmentModal.serviceColor }}>{viewEquipmentModal.service}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <button onClick={() => setViewEquipmentModal(null)} style={{ padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', background: '#0F172A', color: '#fff', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 10000, background: '#0F172A', color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #334155' }}>
          <span style={{ color: '#22C55E' }}>✓</span> {toastMessage}
        </div>
      )}

    </div>
  );
}
