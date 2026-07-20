import React from 'react';

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
const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
const SmallCircleIcon = ({ color }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);
const ActivityIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);
const UserPlusIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);
const PlusCircleIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);
const Lock2Icon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const ShieldIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);
const PrinterIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);
const ClipboardCheckIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><polyline points="9 14 11 16 15 12"></polyline>
  </svg>
);
const PieChartIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
);

const mockStaff = [
  { id: 'S-1001', name: 'James Patel', initials: 'JP', role: 'Warehouse Manager', roleColor: '#3B82F6', roleBg: '#EFF6FF', shift: 'Day (06:00 - 14:00)', loc: 'Main Storage A1', phone: '+61 2 9756 4321', status: 'Active', due: '15 Jun 2025', dueColor: '#EF4444' },
  { id: 'S-1002', name: 'Sarah Mitchell', initials: 'SM', role: 'Supervisor', roleColor: '#3B82F6', roleBg: '#EFF6FF', shift: 'Day (06:00 - 14:00)', loc: 'Dispatch Area D1', phone: '+61 412 345 678', status: 'Active', due: '20 Jun 2025', dueColor: '#1E293B' },
  { id: 'S-1003', name: 'Lisa Chen', initials: 'LC', role: 'Storeperson', roleColor: '#22C55E', roleBg: '#F0FDF4', shift: 'Day (06:00 - 14:00)', loc: 'Bulk Storage B1', phone: '+61 400 987 654', status: 'Active', due: '10 Jun 2025', dueColor: '#EF4444' },
  { id: 'S-1004', name: 'Michael Brown', initials: 'MB', role: 'Picker / Packer', roleColor: '#F59E0B', roleBg: '#FFFBEB', shift: 'Day (06:00 - 14:00)', loc: 'Pick Zone P1', phone: '+61 421 555 321', status: 'Active', due: '25 Jun 2025', dueColor: '#1E293B' },
  { id: 'S-1005', name: 'Robert Taylor', initials: 'RT', role: 'Forklift Operator', roleColor: '#EF4444', roleBg: '#FEF2F2', shift: 'Day (06:00 - 14:00)', loc: 'Main Storage A2', phone: '+61 422 111 222', status: 'Active', due: '18 Jun 2025', dueColor: '#1E293B' },
  { id: 'S-1006', name: 'William Carter', initials: 'WC', role: 'Yard Operator', roleColor: '#3B82F6', roleBg: '#EFF6FF', shift: 'Afternoon (14:00 - 22:00)', loc: 'Staging Area S1', phone: '+61 423 333 444', status: 'On Leave', due: '-', dueColor: '#1E293B' },
  { id: 'S-1007', name: 'Aman Hussain', initials: 'AH', role: 'Picker / Packer', roleColor: '#F59E0B', roleBg: '#FFFBEB', shift: 'Afternoon (14:00 - 22:00)', loc: 'Pick Zone P2', phone: '+61 424 666 555', status: 'Active', due: '02 Jul 2025', dueColor: '#1E293B' },
  { id: 'S-1008', name: 'Nathan Zubair', initials: 'NZ', role: 'Storeperson', roleColor: '#22C55E', roleBg: '#F0FDF4', shift: 'Night (22:00 - 06:00)', loc: 'Bulk Storage B2', phone: '+61 425 777 888', status: 'Active', due: '22 Jun 2025', dueColor: '#1E293B' },
];

const mockEquipment = [
  { id: 'EQ-0001', name: 'Toyota Forklift 2.5T - FL01', type: 'Forklift', typeColor: '#8B5CF6', loc: 'Main Storage A1', status: 'Online', cond: 'Good', condColor: '#22C55E', check: '15 May 2025', service: '10 Jun 2025', serviceColor: '#F59E0B' },
  { id: 'EQ-0002', name: 'Crown Reach Truck - RT02', type: 'Reach Truck', typeColor: '#3B82F6', loc: 'Bulk Storage B1', status: 'Online', cond: 'Good', condColor: '#22C55E', check: '14 May 2025', service: '18 Jun 2025', serviceColor: '#1E293B' },
  { id: 'EQ-0003', name: 'Electric Pallet Jack - EPJ03', type: 'Pallet Jack', typeColor: '#22C55E', loc: 'Dispatch Area D1', status: 'Offline', cond: 'Fair', condColor: '#F59E0B', check: '13 May 2025', service: '25 May 2025', serviceColor: '#EF4444' },
  { id: 'EQ-0004', name: 'Zebra Handheld Scanner - SC04', type: 'Scanner', typeColor: '#F59E0B', loc: 'Pick Zone P1', status: 'Online', cond: 'Good', condColor: '#22C55E', check: '15 May 2025', service: '15 Jul 2025', serviceColor: '#1E293B' },
  { id: 'EQ-0005', name: 'Stretch Wrapper - SW05', type: 'Packaging', typeColor: '#EF4444', loc: 'Staging Area S1', status: 'Online', cond: 'Good', condColor: '#22C55E', check: '12 May 2025', service: '12 Jun 2025', serviceColor: '#1E293B' },
  { id: 'EQ-0006', name: 'Battery Charger - CH06', type: 'Charger', typeColor: '#8B5CF6', loc: 'Maintenance Area', status: 'Online', cond: 'Good', condColor: '#22C55E', check: '11 May 2025', service: '11 Jun 2025', serviceColor: '#1E293B' },
  { id: 'EQ-0007', name: 'Hand Pallet Truck - HPT07', type: 'Pallet Jack', typeColor: '#22C55E', loc: 'Main Storage A2', status: 'Offline', cond: 'Poor', condColor: '#EF4444', check: '10 May 2025', service: 'Overdue', serviceColor: '#EF4444' },
  { id: 'EQ-0008', name: 'Dock Leveler - DL08', type: 'Dock Equipment', typeColor: '#F59E0B', loc: 'Dispatch Dock D1', status: 'Online', cond: 'Good', condColor: '#22C55E', check: '15 May 2025', service: '15 Aug 2025', serviceColor: '#1E293B' },
];

export default function WarehouseStaffEquipment({ wh, onBack }) {
  const [showAddStaffModal, setShowAddStaffModal] = React.useState(false);
  const [modalTab, setModalTab] = React.useState('staff');
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
            <span>Home</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ color: '#0F172A' }}>Warehouse Staff & Equipment</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>9.7 Warehouse Staff & Equipment – {wh?.name || 'Sydney Head Office Warehouse'}</h1>
            <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
              <ShieldIcon color="#8B5CF6" />
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0 0', fontWeight: 500 }}>Manage warehouse team members, equipment and access assignments.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={onBack} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            &lt; Back to Warehouse
          </button>
          <button onClick={() => setShowAddStaffModal(true)} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 14, fontWeight: 400, marginTop: -2 }}>+</span> Add Staff / Equipment
          </button>
          <button style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            More Actions <span style={{ fontSize: 9 }}>▼</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { title: 'WAREHOUSE STAFF', value: '24', subtitle: 'Active staff', color: '#8B5CF6', bg: '#F5F3FF', icon: <UsersIcon color="#8B5CF6" />, link: 'all staff' },
          { title: 'EQUIPMENT', value: '56', subtitle: 'Total equipment', color: '#22C55E', bg: '#F0FDF4', icon: <BoxIcon color="#22C55E" />, link: 'all equipment' },
          { title: 'EQUIPMENT ONLINE', value: '42 (75%)', subtitle: 'Currently online', color: '#3B82F6', bg: '#EFF6FF', icon: <WifiIcon color="#3B82F6" />, link: 'live status' },
          { title: 'MAINTENANCE DUE', value: '6', subtitle: 'Due this month', color: '#F59E0B', bg: '#FFFBEB', icon: <SettingsIcon color="#F59E0B" />, link: 'due items' },
          { title: 'ACCESS ZONES', value: '12', subtitle: 'Configured zones', color: '#8B5CF6', bg: '#F5F3FF', icon: <LockIcon color="#8B5CF6" />, link: 'zones' },
          { title: 'TRAINING DUE', value: '8', subtitle: 'Staff training due', color: '#EF4444', bg: '#FEF2F2', icon: <BookOpenIcon color="#EF4444" />, link: 'training' }
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
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>WAREHOUSE STAFF (24)</div>
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
                <button style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
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
                  {mockStaff.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.id}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#475569' }}>
                            {row.initials}
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{row.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: row.roleColor, background: row.roleBg, padding: '2px 8px', borderRadius: 4, border: `1px solid ${row.roleBg === '#EFF6FF' ? '#BFDBFE' : row.roleBg === '#F0FDF4' ? '#BBF7D0' : row.roleBg === '#FFFBEB' ? '#FDE68A' : '#FECACA'}` }}>{row.role}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.shift}</td>
                      <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.loc}</td>
                      <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.phone}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: row.status === 'Active' ? '#22C55E' : '#F59E0B' }}>{row.status}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: row.dueColor, whiteSpace: 'nowrap' }}>{row.due}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748B' }}><EyeIcon /></button>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748B' }}><MoreHorizontalIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>Showing 1 to 8 of 24 staff</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#64748B', fontSize: 12 }}>&lt;</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #4F46E5', background: '#EEF2FF', cursor: 'pointer', color: '#4F46E5', fontSize: 12, fontWeight: 600 }}>1</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#1E293B', fontSize: 12, fontWeight: 600 }}>2</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#1E293B', fontSize: 12, fontWeight: 600 }}>3</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#1E293B', fontSize: 12, fontWeight: 600 }}>...</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#64748B', fontSize: 12 }}>&gt;</button>
                </div>
                <div style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', cursor: 'pointer' }}>
                  10 / page <span style={{ fontSize: 9, color: '#94A3B8' }}>▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* EQUIPMENT TABLE */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>EQUIPMENT (56)</div>
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
                <button style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
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
                  {mockEquipment.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: row.typeColor, whiteSpace: 'nowrap' }}>{row.type}</td>
                      <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.loc}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: row.status === 'Online' ? '#22C55E' : '#EF4444' }}>{row.status}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: row.condColor, whiteSpace: 'nowrap' }}>{row.cond}</td>
                      <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.check}</td>
                      <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 500, color: row.serviceColor, whiteSpace: 'nowrap' }}>{row.service}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748B' }}><EyeIcon /></button>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748B' }}><MoreHorizontalIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>Showing 1 to 8 of 56 equipment</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#64748B', fontSize: 12 }}>&lt;</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #4F46E5', background: '#EEF2FF', cursor: 'pointer', color: '#4F46E5', fontSize: 12, fontWeight: 600 }}>1</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#1E293B', fontSize: 12, fontWeight: 600 }}>2</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#1E293B', fontSize: 12, fontWeight: 600 }}>3</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#1E293B', fontSize: 12, fontWeight: 600 }}>7</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#64748B', fontSize: 12 }}>&gt;</button>
                </div>
                <div style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', cursor: 'pointer' }}>
                  10 / page <span style={{ fontSize: 9, color: '#94A3B8' }}>▼</span>
                </div>
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
              <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', background: 'conic-gradient(#3B82F6 0% 4.2%, #3B82F6 4.2% 16.7%, #22C55E 16.7% 41.7%, #8B5CF6 41.7% 79.2%, #F59E0B 79.2% 100%)' }}>
                <div style={{ position: 'absolute', top: 14, left: 14, right: 14, bottom: 14, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>24</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#64748B', marginTop: 2, textAlign: 'center' }}>Total Staff</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                {[
                  { label: 'Warehouse Manager', val: '1', pct: '4.2%', color: '#3B82F6' },
                  { label: 'Supervisors', val: '3', pct: '12.5%', color: '#3B82F6' },
                  { label: 'Storepersons', val: '6', pct: '25.0%', color: '#22C55E' },
                  { label: 'Operators', val: '9', pct: '37.5%', color: '#8B5CF6' },
                  { label: 'Pickers / Packers', val: '5', pct: '20.8%', color: '#F59E0B' }
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
              <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', background: 'conic-gradient(#22C55E 0% 75%, #EF4444 75% 89.3%, #F59E0B 89.3% 100%)' }}>
                <div style={{ position: 'absolute', top: 14, left: 14, right: 14, bottom: 14, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>56</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#64748B', marginTop: 2, textAlign: 'center', lineHeight: 1.2 }}>Total<br/>Equipment</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {[
                  { label: 'Online', val: '42', pct: '75.0%', color: '#22C55E' },
                  { label: 'Offline', val: '8', pct: '14.3%', color: '#EF4444' },
                  { label: 'Maintenance', val: '6', pct: '10.7%', color: '#F59E0B' }
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
              {[
                { name: 'Toyota Forklift 2.5T - FL01', date: '10 Jun 2025', color: '#8B5CF6', dateCol: '#EF4444' },
                { name: 'Crown Reach Truck - RT02', date: '18 Jun 2025', color: '#3B82F6', dateCol: '#EF4444' },
                { name: 'Electric Pallet Jack - EPJ03', date: '25 May 2025', color: '#22C55E', dateCol: '#EF4444' },
                { name: 'Hand Pallet Truck - HPT07', date: 'Overdue', color: '#22C55E', dateCol: '#EF4444' },
                { name: 'Stretch Wrapper - SW05', date: '12 Jun 2025', color: '#EF4444', dateCol: '#EF4444' },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SettingsIcon color={m.color} />
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#1E293B' }}>{m.name}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: m.dateCol }}>{m.date}</div>
                </div>
              ))}
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

      {/* DEVELOPER NOTES */}
      <div style={{ marginTop: 24, background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#4F46E5' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CodeIcon />
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#4F46E5', margin: 0, letterSpacing: '0.5px' }}>DEVELOPER NOTES - WAREHOUSE STAFF & EQUIPMENT</h2>
        </div>

        <div className="wh-devnotes-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>1</div>
              PURPOSE
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Manage warehouse team and equipment.</li>
              <li>Track roles, shifts, skills and training.</li>
              <li>Monitor equipment, status and maintenance.</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>2</div>
              KEY FEATURES
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Staff directory with roles and shifts.</li>
              <li>Equipment registry with live status.</li>
              <li>Maintenance and training tracking.</li>
              <li>Access zone and permission management.</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>3</div>
              AUTOMATION & ALERTS
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Alert for maintenance due/overdue.</li>
              <li>Alert for training expiry.</li>
              <li>Auto-notify equipment offline.</li>
              <li>AI suggestions for staffing needs.</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>4</div>
              PERMISSIONS
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Super Admin: Full access.</li>
              <li>Admin/Manager: Full access.</li>
              <li>Warehouse Staff: View assigned only.</li>
              <li>Dispatcher: View equipment status.</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>5</div>
              DATA SOURCES
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Warehouse module.</li>
              <li>Inventory & Stock module.</li>
              <li>Maintenance module.</li>
              <li>HR / Training module.</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 24, fontSize: 11, color: '#64748B', fontWeight: 500 }}>
        <div>All times shown in your local time (AEST)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>• Data auto-refreshes every 5 minutes <RefreshIcon /></div>
      </div>

      {/* ADD STAFF / EQUIPMENT MODAL */}
      {showAddStaffModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)' }} onClick={() => setShowAddStaffModal(false)}></div>
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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Full Name</label>
                  <input type="text" placeholder="John Doe" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Role / Position</label>
                    <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                      <option>Picker / Packer</option>
                      <option>Forklift Operator</option>
                      <option>Storeperson</option>
                      <option>Supervisor</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Assigned Shift</label>
                    <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                      <option>Day (06:00 - 14:00)</option>
                      <option>Afternoon (14:00 - 22:00)</option>
                      <option>Night (22:00 - 06:00)</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Equipment Name / ID</label>
                  <input type="text" placeholder="e.g. Forklift FL01" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Equipment Type</label>
                    <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                      <option>Forklift</option>
                      <option>Pallet Jack</option>
                      <option>Scanner</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Next Service Date</label>
                    <input type="date" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', color: '#0F172A' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>IoT Tracking Assignment</label>
                  <div style={{ padding: '12px', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 8, fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span>+</span> Pair with new IoT Tracker
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button onClick={() => setShowAddStaffModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowAddStaffModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', background: '#4F46E5', color: '#fff', cursor: 'pointer' }}>Add {modalTab === 'staff' ? 'Staff' : 'Equipment'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
