import React from 'react';

// === ICONS ===
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
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
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
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
const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
const PickTaskIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);
const BoxCheckIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
    <path d="M9 13l2 2 4-4"></path>
  </svg>
);
const PackageIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
const NetworkIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><path d="M5 16v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"></path><line x1="12" y1="8" x2="12" y2="11"></line>
  </svg>
);
const TruckBoxIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);
const WarningIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const PickTaskCreatedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);
const PickingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>
  </svg>
);
const PackingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
const StagingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>
  </svg>
);
const DispatchReadyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);
const DispatchedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const SmallCircleIcon = ({ color }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const TaskSummaryIcon1 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const TaskSummaryIcon2 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
  </svg>
);
const TaskSummaryIcon3 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const TaskSummaryIcon4 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const TaskSummaryIcon5 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const PrinterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);
const ClipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);
const FilePlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line>
  </svg>
);
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);
const FileListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);


// === DATA ===
const mockTasks = [
  { id: 'PICK-55412', type: 'Pick', typeColor: '#3B82F6', typeBg: '#EEF2FF', ref: 'SO-66891', customer: 'Auto World Pty Ltd', priority: 'High', priorityColor: '#EF4444', items: '8', loc: 'Bulk Storage B1\\nShelf 02', due: '15 May 2025\\n02:00 PM', assignee: 'Michael Brown', status: 'In Progress', statusColor: '#3B82F6', statusBg: '#EFF6FF', progress: '75%' },
  { id: 'PICK-55411', type: 'Pick', typeColor: '#3B82F6', typeBg: '#EEF2FF', ref: 'PO-55413', customer: 'Fast Auto Dealers', priority: 'High', priorityColor: '#EF4444', items: '12', loc: 'Main Storage A1\\nRow 01 - Bay 03', due: '15 May 2025\\n03:00 PM', assignee: 'Sarah Mitchell', status: 'Pending', statusColor: '#F59E0B', statusBg: '#FFFBEB', progress: '20%' },
  { id: 'PICK-55410', type: 'Pick', typeColor: '#3B82F6', typeBg: '#EEF2FF', ref: 'SO-66890', customer: 'Parts Direct', priority: 'Medium', priorityColor: '#3B82F6', items: '5', loc: 'Bulk Storage B2\\nShelf 01', due: '15 May 2025\\n04:00 PM', assignee: 'James Patel', status: 'Pending', statusColor: '#F59E0B', statusBg: '#FFFBEB', progress: '0%' },
  { id: 'PICK-55409', type: 'Pick', typeColor: '#3B82F6', typeBg: '#EEF2FF', ref: 'SO-66889', customer: 'Sydney Car Sales', priority: 'Medium', priorityColor: '#3B82F6', items: '6', loc: 'Dispatch Area\\nRack 02', due: '15 May 2025\\n04:30 PM', assignee: 'Lisa Chen', status: 'Pending', statusColor: '#F59E0B', statusBg: '#FFFBEB', progress: '0%' },
  { id: 'PICK-55408', type: 'Pick', typeColor: '#3B82F6', typeBg: '#EEF2FF', ref: 'PO-55414', customer: 'Motor Group', priority: 'Low', priorityColor: '#22C55E', items: '3', loc: 'Main Storage A2\\nRow 02 - Bay 01', due: '16 May 2025\\n09:00 AM', assignee: 'Robert Taylor', status: 'Pending', statusColor: '#F59E0B', statusBg: '#FFFBEB', progress: '0%' },
  { id: 'PICK-55407', type: 'Replenish', typeColor: '#8B5CF6', typeBg: '#F5F3FF', ref: '-', customer: 'Internal', priority: 'Low', priorityColor: '#22C55E', items: '15', loc: 'Bulk Storage B3\\nTank Zone', due: '16 May 2025\\n10:00 AM', assignee: 'Warehouse Team', status: 'Pending', statusColor: '#F59E0B', statusBg: '#FFFBEB', progress: '0%' },
  { id: 'PICK-55406', type: 'Pick', typeColor: '#3B82F6', typeBg: '#EEF2FF', ref: 'SO-66887', customer: 'Car City Imports', priority: 'High', priorityColor: '#EF4444', items: '10', loc: 'Bulk Storage B1\\nShelf 04', due: '16 May 2025\\n11:00 AM', assignee: 'Michael Brown', status: 'Pending', statusColor: '#F59E0B', statusBg: '#FFFBEB', progress: '0%' },
  { id: 'PICK-55405', type: 'Pick', typeColor: '#3B82F6', typeBg: '#EEF2FF', ref: 'SO-66886', customer: 'Top Gear Autos', priority: 'Medium', priorityColor: '#3B82F6', items: '7', loc: 'Bulk Storage B2\\nShelf 03', due: '16 May 2025\\n01:00 PM', assignee: 'Sarah Mitchell', status: 'Pending', statusColor: '#F59E0B', statusBg: '#FFFBEB', progress: '0%' }
];

export default function WarehousePickPackDispatch({ wh, onBack }) {
  const [showCreatePickTaskModal, setShowCreatePickTaskModal] = React.useState(false);
  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 32px', fontFamily: "'Inter','Outfit',sans-serif", overflowX: 'hidden' }}>
      {/* BREADCRUMBS & HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, display: 'flex', gap: 6 }}>
            <span>Home</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ color: '#0F172A' }}>Pick, Pack & Dispatch</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>9.5 Pick, Pack & Dispatch – {wh?.name || 'Sydney Head Office Warehouse'}</h1>
            <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0 0', fontWeight: 500 }}>Manage picking tasks, packing, staging and dispatching of stock and orders.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={onBack} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            &lt; Back to Warehouse
          </button>
          <button onClick={() => setShowCreatePickTaskModal(true)} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 14, fontWeight: 400, marginTop: -2 }}>+</span> Create Pick Task
          </button>
          <button style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            More Actions <span style={{ fontSize: 9 }}>▼</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { title: 'PICK TASKS', value: '28', subtitle: 'Open Tasks', color: '#8B5CF6', bg: '#F5F3FF', icon: <PickTaskIcon color="#8B5CF6" /> },
          { title: 'PICKED TODAY', value: '52', subtitle: 'Items Picked', color: '#22C55E', bg: '#F0FDF4', icon: <BoxCheckIcon color="#22C55E" /> },
          { title: 'PACKED TODAY', value: '41', subtitle: 'Orders Packed', color: '#3B82F6', bg: '#EFF6FF', icon: <PackageIcon color="#3B82F6" /> },
          { title: 'DISPATCHED TODAY', value: '26', subtitle: 'Orders Dispatched', color: '#F59E0B', bg: '#FFFBEB', icon: <NetworkIcon color="#F59E0B" /> },
          { title: 'PENDING DISPATCH', value: '14', subtitle: 'Ready to Dispatch', color: '#8B5CF6', bg: '#F5F3FF', icon: <TruckBoxIcon color="#8B5CF6" /> },
          { title: 'OVERDUE TASKS', value: '5', subtitle: 'Require attention', color: '#EF4444', bg: '#FEF2F2', icon: <WarningIcon color="#EF4444" /> }
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: '0.5px', marginBottom: 12 }}>{stat.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div style={{ flex: '1 1 100px', minWidth: 0 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1.1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{stat.value}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginTop: 2 }}>{stat.subtitle}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              View {stat.title === 'PICK TASKS' ? 'all tasks' : 'details'} <span>→</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {/* LEFT MAIN */}
        <div style={{ flex: '1 1 500px', minWidth: 0 }}>


          {/* FILTERS */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap', minWidth: 280 }}>
              <div style={{ position: 'relative', minWidth: 320, flexShrink: 0, flex: '1 1 320px' }}>
                <style>{`.clear-placeholder::placeholder { color: #64748B; opacity: 1; font-weight: 500; }`}</style>
                <div style={{ position: 'absolute', left: 10, top: 7 }}><SearchIcon /></div>
                <input className="clear-placeholder" type="text" placeholder="Search by task ID, order, customer..." style={{ boxSizing: 'border-box', width: '100%', padding: '6px 10px 6px 34px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none', color: '#0F172A' }} />
              </div>
              {['All Statuses', 'All Priorities', 'All Task Types', 'All Assignees'].map((filter, idx) => (
                <div key={idx} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {filter} <span style={{ fontSize: 9, color: '#94A3B8' }}>▼</span>
                </div>
              ))}
              <div style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                01 Jul 2024 - 30 Jun 2025 <span style={{ fontSize: 9, color: '#94A3B8' }}>▼</span>
              </div>
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

          {/* TASKS TABLE */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>PICK TASKS (28)</div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Task ID</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Type</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Order / Reference</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Customer</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Priority</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Items</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>From Location</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Due Time</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Assignee</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Progress</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTasks.map((t, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{t.id}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 4, background: t.typeBg, color: t.typeColor, fontSize: 11, fontWeight: 600 }}>{t.type}</span>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{t.ref}</td>
                      <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{t.customer}</td>
                      <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: t.priorityColor }}>{t.priority}</td>
                      <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{t.items}</td>
                      <td style={{ padding: '10px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'pre-line' }}>{t.loc}</td>
                      <td style={{ padding: '10px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'pre-line' }}>{t.due}</td>
                      <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{t.assignee}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 12, background: t.statusBg, color: t.statusColor, fontSize: 11, fontWeight: 600 }}>
                          {t.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', width: 28 }}>{t.progress}</span>
                          <div style={{ width: 40, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: t.progress, height: '100%', background: '#4F46E5', borderRadius: 3 }}></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748B' }}><EyeIcon /></button>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748B' }}><MoreHorizontalIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ padding: '12px 16px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>Showing 1 to 10 of 28 tasks</div>
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

          {/* WORKFLOW */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '20px' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', marginBottom: 20 }}>PICK, PACK & DISPATCH WORKFLOW</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
              {/* Arrows */}
              <div style={{ position: 'absolute', top: 20, left: 140, right: 140, height: 1, borderTop: '1px dashed #CBD5E1', zIndex: 0 }}></div>
              <div style={{ position: 'absolute', top: 16, left: 160, color: '#94A3B8', fontSize: 16, zIndex: 0 }}>→</div>
              <div style={{ position: 'absolute', top: 16, left: 320, color: '#94A3B8', fontSize: 16, zIndex: 0 }}>→</div>
              <div style={{ position: 'absolute', top: 16, left: 470, color: '#94A3B8', fontSize: 16, zIndex: 0 }}>→</div>
              <div style={{ position: 'absolute', top: 16, left: 630, color: '#94A3B8', fontSize: 16, zIndex: 0 }}>→</div>
              <div style={{ position: 'absolute', top: 16, left: 790, color: '#94A3B8', fontSize: 16, zIndex: 0 }}>→</div>

              {/* Steps */}
              {[
                { no: 1, title: 'Pick Task Created', desc: 'Task created from sales order or warehouse request.', icon: <PickTaskCreatedIcon /> },
                { no: 2, title: 'Picking', desc: 'Items picked from locations and verified by picker.', icon: <PickingIcon /> },
                { no: 3, title: 'Packing', desc: 'Items packed, labelled and quality checked.', icon: <PackingIcon /> },
                { no: 4, title: 'Staging', desc: 'Packed items moved to staging area for dispatch.', icon: <StagingIcon /> },
                { no: 5, title: 'Dispatch Ready', desc: 'Ready to load and dispatch.', icon: <DispatchReadyIcon /> },
                { no: 6, title: 'Dispatched', desc: 'Goods loaded and shipment completed.', icon: <DispatchedIcon /> }
              ].map((step, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 130, zIndex: 1, background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    {step.icon}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B' }}>{step.no}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>{step.title}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: '#64748B', textAlign: 'center', lineHeight: 1.4, padding: '0 8px' }}>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* TASK SUMMARY */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>TASK SUMMARY</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, color: '#1E293B' }}>
                  <TaskSummaryIcon1 /> Open Tasks
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>28</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, color: '#1E293B' }}>
                  <TaskSummaryIcon2 /> In Progress
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>6</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, color: '#1E293B' }}>
                  <TaskSummaryIcon3 /> Pending
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>14</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, color: '#1E293B' }}>
                  <TaskSummaryIcon4 /> Completed Today
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>18</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, color: '#1E293B' }}>
                  <TaskSummaryIcon5 /> Overdue
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>5</div>
              </div>
            </div>
          </div>

          {/* PICK STATUS DONUT */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>PICK STATUS</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Chart →</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Mock Donut */}
              <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', background: 'conic-gradient(#22C55E 0% 64.3%, #3B82F6 64.3% 85.7%, #F59E0B 85.7% 100%, #EF4444 100% 100%)' }}>
                <div style={{ position: 'absolute', top: 12, left: 12, right: 12, bottom: 12, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>28</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: '#64748B' }}>Total Tasks</div>
                </div>
              </div>
              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, color: '#1E293B' }}><SmallCircleIcon color="#22C55E" /> Completed</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>18 (64.3%)</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, color: '#1E293B' }}><SmallCircleIcon color="#3B82F6" /> In Progress</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>6 (21.4%)</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, color: '#1E293B' }}><SmallCircleIcon color="#F59E0B" /> Pending</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>14 (50.0%)</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, color: '#1E293B' }}><SmallCircleIcon color="#EF4444" /> Overdue</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>5 (17.9%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* NEXT UP */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>NEXT UP</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View All →</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { id: 'PICK-55412', name: 'Auto World Pty Ltd', time: '02:00 PM', red: true },
                { id: 'PICK-55411', name: 'Fast Auto Dealers', time: '03:00 PM', red: true },
                { id: 'PICK-55410', name: 'Parts Direct', time: '04:00 PM', red: true },
                { id: 'PICK-55409', name: 'Sydney Car Sales', time: '04:30 PM', red: true },
                { id: 'PICK-55408', name: 'Motor Group', time: 'Tomorrow 09:00 AM', red: false }
              ].map((n, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5' }}>{n.id}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: '#1E293B' }}>{n.name}</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: n.red ? '#EF4444' : '#0F172A' }}>{n.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', marginBottom: 16 }}>QUICK ACTIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Create Pick Task', icon: <FilePlusIcon /> },
                { label: 'Print Labels', icon: <PrinterIcon /> },
                { label: 'Create Wave', icon: <ShareIcon /> },
                { label: 'Move to Staging', icon: <ExportIcon /> },
                { label: 'Assign Tasks', icon: <ClipIcon /> },
                { label: 'Mark as Dispatched', icon: <RefreshIcon /> },
                { label: 'Print Pick List', icon: <PrinterIcon /> },
                { label: 'View All Tasks', icon: <FileListIcon /> }
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, color: '#1E293B', cursor: 'pointer' }}>
                  {a.icon} {a.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DEVELOPER NOTES */}
      <div style={{ marginTop: 24, background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#8B5CF6' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CodeIcon />
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#4F46E5', margin: 0, letterSpacing: '0.5px' }}>DEVELOPER NOTES - PICK, PACK & DISPATCH</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
          {/* 1 */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>1</div>
              PURPOSE
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Manage picking, packing and dispatch operations.</li>
              <li>Ensure accurate and efficient order fulfilment.</li>
              <li>Provide visibility of tasks and dispatch status.</li>
            </ul>
          </div>
          {/* 2 */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>2</div>
              KEY FEATURES
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Pick task creation and assignment.</li>
              <li>Picking, packing, staging and dispatch flow.</li>
              <li>Wave planning and task prioritisation.</li>
              <li>Real-time progress and updates.</li>
            </ul>
          </div>
          {/* 3 */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>3</div>
              AUTOMATION & ALERTS
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Alert for overdue or delayed tasks.</li>
              <li>Auto-assign tasks based on availability.</li>
              <li>Notify when orders are ready for dispatch.</li>
              <li>AI suggestions for wave optimisation.</li>
            </ul>
          </div>
          {/* 4 */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>4</div>
              PERMISSIONS
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Super Admin: Full access.</li>
              <li>Admin/Manager: Full access.</li>
              <li>Warehouse Staff: Assigned tasks only.</li>
              <li>Dispatcher: Dispatch and view only.</li>
            </ul>
          </div>
          {/* 5 */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>5</div>
              DATA SOURCES
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Sales Orders & Purchase Orders.</li>
              <li>Inventory & Stock module.</li>
              <li>Warehouse Locations.</li>
              <li>Shipments & Loads modules.</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 24, fontSize: 11, color: '#64748B', fontWeight: 500 }}>
        <div>All times shown in your local time (AEST)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>• Data auto-refreshes every 5 minutes <RefreshIcon /></div>
      </div>

      {/* CREATE PICK TASK MODAL */}
      {showCreatePickTaskModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)' }} onClick={() => setShowCreatePickTaskModal(false)}></div>
          <div style={{ background: '#fff', width: '600px', borderRadius: 16, padding: '32px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 20, fontWeight: 800, color: '#0F172A' }}>Create Pick Task</h2>
            
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Link to Order / Reference</label>
                <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                  <option>Select Sales Order or PO...</option>
                  <option>SO-66890 (Parts Direct)</option>
                  <option>SO-66889 (Sydney Car Sales)</option>
                </select>
              </div>

              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: 13, color: '#0F172A' }}>Wave / Batch Picking Options</h4>
                  <p style={{ margin: 0, fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>Select how the system should group items to optimize walking distance.</p>
                </div>
                <select style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', background: '#fff' }}>
                  <option>Single Order Pick</option>
                  <option>Batch Pick (Multiple Orders)</option>
                  <option>Zone Pick</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Priority</label>
                  <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Assign To</label>
                  <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option>Auto-assign nearest worker</option>
                    <option>James Patel</option>
                    <option>Lisa Chen</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button onClick={() => setShowCreatePickTaskModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowCreatePickTaskModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', background: '#4F46E5', color: '#fff', cursor: 'pointer' }}>Generate Task</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
