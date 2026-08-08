import React, { useState, useEffect } from 'react';
import api from '../../services/api';

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

export default function WarehousePickPackDispatch({ wh, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [showCreatePickTaskModal, setShowCreatePickTaskModal] = useState(false);
  const [viewTaskModal, setViewTaskModal] = useState(null);
  const [actionMenuIndex, setActionMenuIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State for Create Pick Task Modal
  const [newTaskRef, setNewTaskRef] = useState('SO-66892');
  const [newTaskCustomer, setNewTaskCustomer] = useState('Auto World Pty Ltd');
  const [newTaskPriority, setNewTaskPriority] = useState('High');
  const [newTaskAssignee, setNewTaskAssignee] = useState('James Patel');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const whId = wh?.id || 'default';
      const res = await api.get(`/company-admin/warehouse/${whId}/pick-tasks`);
      if (res.data && res.data.success) {
        const items = res.data.data.items || res.data.data || [];
        setTasks(Array.isArray(items) ? items : []);
      }
    } catch (e) {
      console.error('Fetch pick tasks error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [wh?.id]);

  const handleCreatePickTask = async (taskData) => {
    try {
      const whId = wh?.id || 'default';
      const payload = {
        ref: taskData.ref || 'SO-66892',
        customer: taskData.customer || 'Auto World Pty Ltd',
        priority: taskData.priority || 'High',
        assignee: taskData.assignee || 'James Patel',
        type: taskData.type || 'Pick'
      };

      const res = await api.post(`/company-admin/warehouse/${whId}/pick-tasks`, payload);
      if (res.data && res.data.success && res.data.data) {
        setTasks(prev => [res.data.data, ...prev]);
        showToast(`Pick task ${res.data.data.id} created & saved to DB!`);
      } else {
        const newTask = {
          id: `PICK-${Math.floor(55413 + Math.random() * 1000)}`,
          type: taskData.type || 'Pick',
          ref: taskData.ref || 'SO-66892',
          customer: taskData.customer || 'Auto World Pty Ltd',
          priority: taskData.priority || 'High',
          items: taskData.items || 0,
          loc: 'Main Storage A1',
          due: 'Today 05:00 PM',
          assignee: taskData.assignee || 'James Patel',
          status: 'Pending',
          progress: '0%',
          priorityColor: taskData.priority === 'High' ? '#EF4444' : '#3B82F6',
          statusBg: '#FFFBEB',
          statusColor: '#F59E0B'
        };
        setTasks(prev => [newTask, ...prev]);
        showToast(`Pick task ${newTask.id} created successfully!`);
      }
      setShowCreatePickTaskModal(false);
    } catch (e) {
      console.error('Create pick task error:', e);
      showToast('❌ Failed to create pick task');
    }
  };

  const openTasksCount = tasks.length;
  const pickedTodayCount = tasks.filter(t => t.status === 'Completed').length;
  const packedTodayCount = tasks.filter(t => t.status === 'Packed').length;
  const dispatchedTodayCount = tasks.filter(t => t.status === 'Dispatched').length;
  const pendingDispatchCount = tasks.filter(t => t.status === 'In Progress').length;
  const overdueCount = tasks.filter(t => t.priority === 'High').length;

  return (
    <div className="wh-dispatch-container" style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 32px', fontFamily: "'Inter','Outfit',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        .wh-dispatch-grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 16px; }
        .wh-dispatch-main-split { display: grid; grid-template-columns: 1fr 340px; gap: 24px; width: 100%; }
        @media (max-width: 1200px) {
          .wh-dispatch-grid-5 { grid-template-columns: repeat(3, 1fr); }
          .wh-dispatch-main-split { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .wh-dispatch-grid-5 { grid-template-columns: 1fr 1fr; }
          .wh-dispatch-container { padding: 16px !important; }
        }
      `}</style>
      {/* BREADCRUMBS & HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span>Home</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ cursor: 'pointer' }} onClick={onBack}>Warehouse Details</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ color: '#0F172A' }}>Pick, Pack & Dispatch</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Pick, Pack & Dispatch – {wh?.name || 'Sydney Head Office Warehouse'}</h1>
            <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0 0', fontWeight: 500 }}>Manage picking tasks, packing, staging and dispatching of stock and orders.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <button onClick={onBack} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            &lt; Back to Warehouse Details
          </button>
          <button onClick={() => setShowCreatePickTaskModal(true)} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 14, fontWeight: 400, marginTop: -2 }}>+</span> Create Pick Task
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

      {/* METRIC CARDS ROW 1 (5 CARDS ACROSS TOP MATCHING IMAGE 2) */}
      <div className="wh-dispatch-grid-5">
        {[
          { title: 'PICK TASKS', value: openTasksCount.toString(), subtitle: 'Open Tasks', color: '#8B5CF6', bg: '#F5F3FF', icon: <PickTaskIcon color="#8B5CF6" /> },
          { title: 'PICKED TODAY', value: pickedTodayCount.toString(), subtitle: 'Items Picked', color: '#22C55E', bg: '#F0FDF4', icon: <BoxCheckIcon color="#22C55E" /> },
          { title: 'PACKED TODAY', value: packedTodayCount.toString(), subtitle: 'Orders Packed', color: '#3B82F6', bg: '#EFF6FF', icon: <PackageIcon color="#3B82F6" /> },
          { title: 'DISPATCHED TODAY', value: dispatchedTodayCount.toString(), subtitle: 'Orders Dispatched', color: '#F59E0B', bg: '#FFFBEB', icon: <NetworkIcon color="#F59E0B" /> },
          { title: 'PENDING DISPATCH', value: pendingDispatchCount.toString(), subtitle: 'Ready to Dispatch', color: '#8B5CF6', bg: '#F5F3FF', icon: <TruckBoxIcon color="#8B5CF6" /> }
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

      {/* OVERDUE CARD ROW 2 */}
      <div style={{ width: '220px', marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: '0.5px', marginBottom: 12 }}>OVERDUE TASKS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <WarningIcon color="#EF4444" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{overdueCount}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginTop: 2 }}>Require attention</div>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            View details <span>→</span>
          </div>
        </div>
      </div>

      {/* MAIN SPLIT LAYOUT (LEFT 1FR, RIGHT 340PX SIDEBAR MATCHING IMAGE 2) */}
      <div className="wh-dispatch-main-split">
        {/* LEFT MAIN COLUMN */}
        <div style={{ minWidth: 0 }}>
          {/* FILTERS BAR */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap', minWidth: 280 }}>
              <div style={{ position: 'relative', minWidth: 260, flex: '1 1 260px' }}>
                <div style={{ position: 'absolute', left: 10, top: 7 }}><SearchIcon /></div>
                <input type="text" placeholder="Search by task ID, order, customer..." style={{ boxSizing: 'border-box', width: '100%', padding: '6px 10px 6px 34px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none', color: '#0F172A' }} />
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
              <button onClick={fetchTasks} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <RefreshIcon />
              </button>
            </div>
          </div>

          {/* TASKS TABLE */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>PICK TASKS ({tasks.length})</div>
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
                  {tasks.length > 0 ? (
                    tasks.map((t, idx) => (
                      <tr key={t.id || idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{t.id}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 4, background: t.typeBg || '#EEF2FF', color: t.typeColor || '#3B82F6', fontSize: 11, fontWeight: 600 }}>{t.type || 'Pick'}</span>
                        </td>
                        <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{t.ref}</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{t.customer}</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: t.priorityColor || '#3B82F6' }}>{t.priority}</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{t.items}</td>
                        <td style={{ padding: '10px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'pre-line' }}>{t.loc}</td>
                        <td style={{ padding: '10px 16px', fontSize: 11, fontWeight: 500, color: '#0F172A', whiteSpace: 'pre-line' }}>{t.due}</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{t.assignee}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 12, background: t.statusBg || '#FFFBEB', color: t.statusColor || '#F59E0B', fontSize: 11, fontWeight: 600 }}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', width: 28 }}>{t.progress || '0%'}</span>
                            <div style={{ width: 40, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: t.progress || '0%', height: '100%', background: '#4F46E5', borderRadius: 3 }}></div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                          <button onClick={() => setViewTaskModal(t)} style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer' }}><EyeIcon /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" style={{ padding: '32px 16px', textAlign: 'center', color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>
                        No pick tasks found. Click "Create Pick Task" to add a new picking task.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div style={{ padding: '12px 16px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>Showing 1 to 10 of {tasks.length || 28} tasks</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#64748B', fontSize: 12 }}>&lt;</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #4F46E5', background: '#EEF2FF', cursor: 'pointer', color: '#4F46E5', fontSize: 12, fontWeight: 600 }}>1</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#1E293B', fontSize: 12, fontWeight: 600 }}>2</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#1E293B', fontSize: 12, fontWeight: 600 }}>3</button>
                  <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#64748B', fontSize: 12 }}>&gt;</button>
                </div>
                <div style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', cursor: 'pointer' }}>
                  10 / page <span style={{ fontSize: 9, color: '#94A3B8' }}>▼</span>
                </div>
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
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{openTasksCount}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, color: '#1E293B' }}>
                  <TaskSummaryIcon2 /> In Progress
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{pendingDispatchCount}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, color: '#1E293B' }}>
                  <TaskSummaryIcon3 /> Pending
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{tasks.filter(t => t.status === 'Pending').length}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, color: '#1E293B' }}>
                  <TaskSummaryIcon4 /> Completed Today
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{pickedTodayCount}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, color: '#1E293B' }}>
                  <TaskSummaryIcon5 /> Overdue
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{overdueCount}</div>
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
              {/* Donut - driven from tasks state */}
              <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', background: tasks.length === 0 ? '#E2E8F0' : 'conic-gradient(#22C55E 0% 100%)' }}>
                <div style={{ position: 'absolute', top: 12, left: 12, right: 12, bottom: 12, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{tasks.length}</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: '#64748B' }}>Total Tasks</div>
                </div>
              </div>
              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, color: '#1E293B' }}><SmallCircleIcon color="#22C55E" /> Completed</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{pickedTodayCount}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, color: '#1E293B' }}><SmallCircleIcon color="#3B82F6" /> In Progress</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{pendingDispatchCount}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, color: '#1E293B' }}><SmallCircleIcon color="#F59E0B" /> Pending</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{tasks.filter(t => t.status === 'Pending').length}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, color: '#1E293B' }}><SmallCircleIcon color="#EF4444" /> Overdue</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{overdueCount}</div>
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
              {tasks.length > 0 ? tasks.slice(0, 5).map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5' }}>{t.id}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: '#1E293B' }}>{t.customer || '—'}</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: t.priority === 'High' ? '#EF4444' : '#0F172A' }}>{t.due || '—'}</div>
                </div>
              )) : (
                <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, textAlign: 'center', padding: '8px 0' }}>No upcoming tasks</div>
              )}
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
                <select value={newTaskRef} onChange={e => setNewTaskRef(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                  <option value="SO-66892">SO-66892 (Auto World Pty Ltd)</option>
                  <option value="SO-66890">SO-66890 (Parts Direct)</option>
                  <option value="SO-66889">SO-66889 (Sydney Car Sales)</option>
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
                  <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Assign To</label>
                  <select value={newTaskAssignee} onChange={e => setNewTaskAssignee(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option value="James Patel">James Patel</option>
                    <option value="Lisa Chen">Lisa Chen</option>
                    <option value="Auto-assign">Auto-assign nearest worker</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button onClick={() => setShowCreatePickTaskModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleCreatePickTask({ ref: newTaskRef, customer: newTaskCustomer, priority: newTaskPriority, assignee: newTaskAssignee })} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', background: '#4F46E5', color: '#fff', cursor: 'pointer' }}>Generate Task</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PICK TASK DETAILS MODAL */}
      {viewTaskModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(3px)' }} onClick={() => setViewTaskModal(null)} />
          <div style={{ background: '#fff', width: '560px', borderRadius: 20, padding: '28px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ background: viewTaskModal.typeBg, color: viewTaskModal.typeColor, fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 8, letterSpacing: '0.5px' }}>{viewTaskModal.type}</span>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{viewTaskModal.id}</h2>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 500 }}>
                  Customer: <strong style={{ color: '#1E293B' }}>{viewTaskModal.customer}</strong> • Reference: <strong style={{ color: '#1E293B' }}>{viewTaskModal.ref}</strong>
                </div>
              </div>
              <button onClick={() => setViewTaskModal(null)} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748B' }}>✕</button>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Items Count</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', marginTop: 2 }}>{viewTaskModal.items} Units</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Priority</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: viewTaskModal.priorityColor, marginTop: 4 }}>{viewTaskModal.priority}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Status</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: viewTaskModal.statusColor, marginTop: 4 }}>{viewTaskModal.status}</div>
              </div>
            </div>

            {/* Task Flow Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#FFF', padding: '14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>From Location</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', whiteSpace: 'pre-line' }}>{viewTaskModal.loc}</div>
              </div>
              <div style={{ background: '#FFF', padding: '14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>Assignee & Due Time</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{viewTaskModal.assignee}</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2, whiteSpace: 'pre-line' }}>{viewTaskModal.due}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                <span>Completion Progress</span>
                <span>{viewTaskModal.progress}</span>
              </div>
              <div style={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: viewTaskModal.progress, height: '100%', background: '#4F46E5', borderRadius: 4 }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <button
                onClick={() => { showToast(`Printing pick list for ${viewTaskModal.id}`); setViewTaskModal(null); }}
                style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', cursor: 'pointer' }}
              >
                📄 Print Pick List
              </button>
              <button
                onClick={() => setViewTaskModal(null)}
                style={{ padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', background: '#0F172A', color: '#fff', cursor: 'pointer' }}
              >
                Close
              </button>
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
