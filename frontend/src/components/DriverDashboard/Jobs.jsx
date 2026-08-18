import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  FiPackage, FiTruck, FiClock, FiCheckCircle,
  FiUpload, FiMessageSquare,
  FiSearch, FiChevronRight,
  FiShield, FiRefreshCw, FiCalendar,
  FiPlus, FiX, FiBookOpen, FiPhone,
  FiSend, FiChevronLeft, FiFilter,
  FiMoreVertical, FiEye, FiEdit2, FiTrash2,
  FiTrendingUp, FiAlertTriangle,
} from 'react-icons/fi';
import { getMyLoads } from '../../services/driverApi';

function extractCityState(addr) {
  if (!addr) return '';
  const parts = addr.split(',');
  if (parts.length >= 2) {
    return parts.slice(-2).join(',').trim();
  }
  return addr;
}

function formatLoadDate(dateVal) {
  if (!dateVal) return 'Today';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return 'Today';
  const today = new Date();
  const diffDays = Math.round((new Date(d).setHours(0,0,0,0) - new Date(today).setHours(0,0,0,0)) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatLoadTime(dateVal) {
  if (!dateVal) return '08:00 AM';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '08:00 AM';
  return d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
}

function formatLoadForJobs(rawLoad) {
  const displayId = rawLoad.loadRef || rawLoad.draftId || (rawLoad.id ? `LD-${rawLoad.id.substring(0, 4).toUpperCase()}` : 'LD-0000');
  const loadType = rawLoad.type || 'General Freight';
  
  let status = 'UPCOMING';
  let statusText = 'Upcoming';
  let timeColor = '#0f172a';

  if (['IN_TRANSIT', 'ACTIVE'].includes(rawLoad.status)) {
    status = 'IN_PROGRESS';
    statusText = 'In Progress';
    timeColor = '#d97706';
  } else if (['DELIVERED', 'COMPLETED'].includes(rawLoad.status)) {
    status = 'COMPLETED';
    statusText = 'Completed';
    timeColor = '#059669';
  } else if (rawLoad.status === 'CANCELLED') {
    status = 'CANCELLED';
    statusText = 'Cancelled';
    timeColor = '#e11d48';
  }

  const pickupStop = rawLoad.stops?.find(s => s.type === 'PICKUP') || rawLoad.stops?.[0];
  const dropoffStop = rawLoad.stops?.filter(s => s.type === 'DROPOFF').slice(-1)[0] || rawLoad.stops?.[rawLoad.stops?.length - 1];

  const pickupAddress = pickupStop?.address || 'N/A';
  const pickupName = pickupStop?.contactName || extractCityState(pickupAddress) || 'Pickup Yard';
  const deliveryAddress = dropoffStop?.address || 'N/A';
  const deliveryName = dropoffStop?.contactName || extractCityState(deliveryAddress) || 'Delivery Terminal';

  const origin = extractCityState(pickupAddress) || pickupName;
  const destination = extractCityState(deliveryAddress) || deliveryName;

  const numStops = rawLoad.stops?.length || 2;
  const stopsLabel = `${Math.max(1, numStops - 1)} Stop${Math.max(1, numStops - 1) === 1 ? '' : 's'}`;

  const dateLabel = formatLoadDate(rawLoad.loadDate || pickupStop?.scheduledDate);
  let timeLabel = formatLoadTime(pickupStop?.scheduledDate || rawLoad.loadDate);
  if (status === 'IN_PROGRESS') timeLabel = 'In Transit';
  if (status === 'COMPLETED') timeLabel = 'Completed';
  if (status === 'CANCELLED') timeLabel = 'Cancelled';

  return {
    rawId: rawLoad.id,
    id: displayId,
    subTitle: loadType,
    status,
    statusText,
    date: dateLabel,
    time: timeLabel,
    timeColor,
    origin,
    destination,
    pickupName,
    pickupAddress,
    deliveryName,
    deliveryAddress,
    loadType,
    reference: rawLoad.loadRef || rawLoad.draftId || displayId,
    stops: stopsLabel,
    distance: '—',
  };
}




<<<<<<< HEAD
=======

>>>>>>> 942db2529edabcead1dbf19472d97bf3d750d322
const STATUS_META = {
  UPCOMING:    { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
  IN_PROGRESS: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  COMPLETED:   { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  CANCELLED:   { bg: '#ffe4e6', text: '#9f1239', border: '#fecdd3' },
};

const PAGE_SIZE = 5;

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs]                 = useState([]);
  const [loading, setLoading]           = useState(true);
<<<<<<< HEAD
=======
  const [error, setError]               = useState(null);
>>>>>>> 942db2529edabcead1dbf19472d97bf3d750d322
  const [activeTab, setActiveTab]       = useState('ALL');
  const [searchQuery, setSearchQuery]   = useState('');
  const [page, setPage]                 = useState(1);
  const [perPage]                       = useState(PAGE_SIZE);
  const [toastMsg, setToastMsg]         = useState('');
  const [newLoadOpen, setNewLoadOpen]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [editJob, setEditJob]           = useState(null);
  const [deleteJob, setDeleteJob]       = useState(null);
  const dropdownRef                     = useRef(null);
  const [newLoad, setNewLoad]           = useState({
    origin: '', destination: '', pickupAddress: '', deliveryAddress: '',
    pickupTime: '', deliveryTime: '', customer: '', reference: '',
    loadType: 'Car Carrier (4 Level)', stops: '1 Stop', notes: '',
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/driver-portal/jobs');
      if (res.data?.success) {
        setJobs(res.data.data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to load jobs', error);
      showToast('❌ Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);
    getMyLoads()
      .then(res => {
        if (isSubscribed) {
          const raw = res.data?.data?.loads || [];
          const formatted = raw.map(formatLoadForJobs);
          setJobs(formatted);
          setError(null);
        }
      })
      .catch(err => {
        if (isSubscribed) {
          const msg = err.response?.data?.error?.message || 'Could not load assigned jobs. Please try again.';
          setError(msg);
        }
      })
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => { isSubscribed = false; };
  }, []);

  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const showToast = msg => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  const counts = {
    all:        jobs.length,
    upcoming:   jobs.filter(j => j.status === 'UPCOMING').length,
    inProgress: jobs.filter(j => j.status === 'IN_PROGRESS').length,
    completed:  jobs.filter(j => j.status === 'COMPLETED').length,
    cancelled:  jobs.filter(j => j.status === 'CANCELLED').length,
  };

  const TAB_MAP = { ALL: null, UPCOMING: 'UPCOMING', IN_PROGRESS: 'IN_PROGRESS', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED' };

  const filtered = jobs.filter(j => {
    const tabOk = !TAB_MAP[activeTab] || j.status === TAB_MAP[activeTab];
    const q = searchQuery.toLowerCase();
    const searchOk = !q || j.id.toLowerCase().includes(q) || j.reference.toLowerCase().includes(q)
      || j.origin.toLowerCase().includes(q) || j.destination.toLowerCase().includes(q)
      || j.deliveryName.toLowerCase().includes(q) || j.pickupName.toLowerCase().includes(q);
    return tabOk && searchOk;
  });

<<<<<<< HEAD
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
=======

  const totalPages = Math.ceil(filtered.length / perPage);
>>>>>>> 942db2529edabcead1dbf19472d97bf3d750d322
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const handleTabChange = t => { setActiveTab(t); setPage(1); };
  const handleSearch    = e => { setSearchQuery(e.target.value); setPage(1); };

  const handleDeleteConfirm = () => {
    // Optimistic delete
    setJobs(prev => prev.filter(j => j.id !== deleteJob.id));
    showToast(`🗑️ Job ${deleteJob.id} deleted successfully!`);
    setDeleteJob(null);
  };

  const handleEditSave = e => {
    e.preventDefault();
    setJobs(prev => prev.map(j => j.id === editJob.id ? { ...editJob } : j));
    showToast(`✅ Job ${editJob.id} updated successfully!`);
    setEditJob(null);
  };

  const handleNewLoadSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/driver-portal/jobs', newLoad);
      if (res.data?.success) {
         showToast('✅ New load submitted to Dispatch for scheduling!');
         setNewLoadOpen(false);
         setNewLoad({ origin: '', destination: '', pickupAddress: '', deliveryAddress: '', pickupTime: '', deliveryTime: '', customer: '', reference: '', loadType: 'Car Carrier (4 Level)', stops: '1 Stop', notes: '' });
         fetchJobs();
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to submit load request.');
    }
  };

  const inputStyle = {
    width: '100%', border: '1px solid #e2e8f0', borderRadius: 10,
    padding: '9px 12px', fontSize: 12, fontWeight: 700, color: '#0f172a',
    background: '#f8fafc', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const labelStyle = {
    fontSize: 9, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase',
    letterSpacing: 1, display: 'block', marginBottom: 5,
  };

  /* ── KPI Card Data ── */
  const kpiCards = [
    {
      label: 'UPCOMING', value: counts.upcoming, trend: '+1', trendUp: true,
      sub: 'Next: 08:00 AM Today', icon: FiClock, iconColor: '#7c3aed', iconBg: '#f5f3ff',
      borderColor: '#7c3aed',
    },
    {
      label: 'IN PROGRESS', value: counts.inProgress, trend: '0', trendUp: true,
      sub: 'Active loads', icon: FiTruck, iconColor: '#d97706', iconBg: '#fef9ee',
      borderColor: '#d97706',
    },
    {
      label: 'COMPLETED', value: counts.completed, trend: '+2', trendUp: true,
      sub: '100% SLA this week', icon: FiCheckCircle, iconColor: '#10b981', iconBg: '#f0fdf4',
      borderColor: '#10b981',
    },
    {
      label: 'CANCELLED', value: counts.cancelled, trend: '0', trendUp: false,
      sub: 'This period', icon: FiX, iconColor: '#ef4444', iconBg: '#fff1f2',
      borderColor: '#ef4444',
    },
    {
      label: 'TOTAL JOBS', value: counts.all, trend: null,
      sub: 'All assigned', icon: FiPackage, iconColor: '#fff', iconBg: 'rgba(255,255,255,0.15)',
      borderColor: '#0f172a', dark: true,
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: '#f8fafc', minHeight: '100vh' }}>

      {/* TOAST */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: 12, padding: '10px 18px', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiCheckCircle color="#10b981" size={14} /> {toastMsg}
        </div>
      )}

      <div style={{ padding: '28px 32px 48px' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>Assigned Jobs</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b', fontWeight: 600 }}>Overview of your assigned freight loads</p>
          </div>
          <button
            onClick={() => setNewLoadOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#ffcc00', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 900, color: '#000', cursor: 'pointer', boxShadow: '0 2px 10px rgba(255,204,0,0.35)' }}
          >
            <FiPlus size={15} /> + New Load
          </button>
        </div>

        {/* ── KPI CARDS ROW (horizontal, like Command Centre) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 28 }}>
          {kpiCards.map(({ label, value, trend, trendUp, sub, icon: Icon, iconColor, iconBg, borderColor, dark }) => (
            <div
              key={label}
              style={{
                background: dark ? '#0f172a' : '#fff',
                border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
                borderTop: `3px solid ${borderColor}`,
                borderRadius: 14,
                padding: '18px 18px 16px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', gap: 0,
              }}
            >
              {/* Top row: label + trend badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: dark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.2 }}>
                  {label}
                </span>
                {trend !== null && (
                  <span style={{ fontSize: 10, fontWeight: 900, color: trendUp ? '#10b981' : '#ef4444', background: trendUp ? '#f0fdf4' : '#fff1f2', padding: '2px 7px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FiTrendingUp size={9} /> {trend}
                  </span>
                )}
              </div>
              {/* Value */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: dark ? '#fff' : '#0f172a', lineHeight: 1, marginBottom: 6 }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: dark ? '#64748b' : '#64748b' }}>{sub}</div>
                </div>
                <div style={{ width: 42, height: 42, background: iconBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 10 }}>
                  <Icon size={20} color={iconColor} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SEARCH ── */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <FiSearch style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }} />
          <input
            type="text" value={searchQuery} onChange={handleSearch}
            placeholder="Search by Load ID, Reference, Customer, or Location..."
            style={{ ...inputStyle, paddingLeft: 38, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', fontSize: 13 }}
          />
        </div>

        {/* ── TABS ── */}
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
          {[
            { id: 'ALL',         label: 'All',         count: counts.all },
            { id: 'UPCOMING',    label: 'Upcoming',    count: counts.upcoming },
            { id: 'IN_PROGRESS', label: 'In Progress', count: counts.inProgress },
            { id: 'COMPLETED',   label: 'Completed',   count: counts.completed },
            { id: 'CANCELLED',   label: 'Cancelled',   count: counts.cancelled },
          ].map(tab => (
            <button
              key={tab.id} onClick={() => handleTabChange(tab.id)}
              style={{
                padding: '10px 18px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                background: 'transparent', border: 'none',
                color: activeTab === tab.id ? '#0f172a' : '#64748b',
                borderBottom: activeTab === tab.id ? '2px solid #ffcc00' : '2px solid transparent',
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={() => showToast('Filters panel coming soon...')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
              <FiFilter size={13} /> Filters
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecdd3', borderRadius: 12, color: '#9f1239', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiAlertTriangle size={16} /> {error}
          </div>
        )}

        {/* ── TABLE ── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 24 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Load ID', 'Status', 'Route', 'Pickup', 'Delivery', 'Load Type', 'Stops', 'Date & Time', 'Reference', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td colSpan={10} style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ height: 16, background: '#f1f5f9', borderRadius: 8, width: '100%' }}>Loading...</div>
                      </td>
                    </tr>
                  ))
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8', fontWeight: 700, fontSize: 14 }}>
                      {jobs.length === 0 ? 'No assigned jobs found in your schedule.' : 'No jobs match your current filter.'}
                    </td>
                  </tr>
                ) : paged.map((job, idx) => {

                  const meta = STATUS_META[job.status];
                  return (
                    <tr
                      key={job.id}
                      style={{ borderBottom: idx < paged.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                    >
                      {/* Load ID */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span
                          onClick={() => navigate(`/driver/job/${job.rawId}`)}
                          style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 13, color: '#1d4ed8', textDecoration: 'underline', cursor: 'pointer' }}
                        >{job.id}</span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 900, padding: '4px 12px', borderRadius: 20, background: meta.bg, color: meta.text, border: `1px solid ${meta.border}`, whiteSpace: 'nowrap', display: 'inline-block' }}>
                          {job.statusText}
                        </span>
                      </td>
                      {/* Route — single line */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 13 }}>{job.origin}</span>
                        <span style={{ color: '#94a3b8', fontSize: 12, margin: '0 6px' }}>→</span>
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 13 }}>{job.destination}</span>
                      </td>
                      {/* Pickup */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span title={job.pickupAddress} style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, cursor: 'default' }}>{job.pickupName}</span>
                      </td>
                      {/* Delivery */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span title={job.deliveryAddress} style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, cursor: 'default' }}>{job.deliveryName}</span>
                      </td>
                      {/* Load Type */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: 8 }}>
                          {job.loadType}
                        </span>
                      </td>
                      {/* Stops */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 800, background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: 8 }}>
                          {job.stops}
                        </span>
                      </td>
                      {/* Date & Time — single line */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 13 }}>{job.date}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: job.timeColor, marginLeft: 6 }}>{job.time}</span>
                      </td>
                      {/* Reference */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#475569' }}>{job.reference}</span>
                      </td>
                      {/* Actions — 3-dot */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle', position: 'relative' }} ref={openDropdown === job.id ? dropdownRef : null}>
                        <button
                          onClick={e => { e.stopPropagation(); setOpenDropdown(openDropdown === job.id ? null : job.id); }}
                          style={{ background: openDropdown === job.id ? '#f1f5f9' : 'transparent', border: '1px solid', borderColor: openDropdown === job.id ? '#e2e8f0' : 'transparent', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
                        >
                          <FiMoreVertical size={16} color="#64748b" />
                        </button>
                        {openDropdown === job.id && (
                          <div style={{ position: 'absolute', right: 8, top: '110%', zIndex: 999, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 160, overflow: 'hidden' }}>
                            <button onClick={e => { e.stopPropagation(); setOpenDropdown(null); navigate(`/driver/job/${job.rawId}`); }}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, fontWeight: 700, color: '#0f172a', cursor: 'pointer', textAlign: 'left' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                              <FiEye size={14} color="#3b82f6" /> View Load Details
                            </button>

                            <button onClick={e => { e.stopPropagation(); setOpenDropdown(null); setEditJob({ ...job }); }}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', borderTop: '1px solid #f1f5f9', fontSize: 13, fontWeight: 700, color: '#0f172a', cursor: 'pointer', textAlign: 'left' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                              <FiEdit2 size={14} color="#f59e0b" /> Edit
                            </button>
                            <button onClick={e => { e.stopPropagation(); setOpenDropdown(null); setDeleteJob(job); }}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', borderTop: '1px solid #f1f5f9', fontSize: 13, fontWeight: 700, color: '#ef4444', cursor: 'pointer', textAlign: 'left' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                              <FiTrash2 size={14} color="#ef4444" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>
              Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length} jobs
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', background: page === 1 ? '#f8fafc' : '#fff', borderRadius: 8, cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#cbd5e1' : '#475569' }}>
                <FiChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 800, borderColor: page === p ? '#0f172a' : '#e2e8f0', background: page === p ? '#0f172a' : '#fff', color: page === p ? '#fff' : '#475569' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', background: page === totalPages ? '#f8fafc' : '#fff', borderRadius: 8, cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#cbd5e1' : '#475569' }}>
                <FiChevronRight size={14} />
              </button>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginLeft: 4 }}>10 / page</span>
            </div>
          </div>
        </div>

        {/* ── KEY ACTIONS + STATUS ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 900, color: '#0f172a' }}>Key Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Refresh List',     icon: FiRefreshCw,     action: () => { showToast('Refreshing job list...'); fetchJobs(); } },
                { label: 'Message Dispatch', icon: FiMessageSquare, action: () => navigate('/driver/contact-dispatch') },
                { label: 'View Calendar',    icon: FiCalendar,      action: () => showToast('Opening calendar...') },
              ].map(({ label, icon: Icon, action }) => (
                <button key={label} onClick={action}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#334155', cursor: 'pointer', textAlign: 'left' }}>
                  <Icon size={14} color="#64748b" /> {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 900, color: '#0f172a' }}>Status</h3>
            <div style={{ display: 'flex', gap: 32 }}>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Last sync</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{new Date().toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Auto refresh</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>Every 5 minutes</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 800, color: '#10b981' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span> Online
              </span>
              <button onClick={() => { showToast('Syncing with server...'); fetchJobs(); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: '#0f172a', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800, color: '#fff', cursor: 'pointer' }}>
                <FiRefreshCw size={12} /> Sync Now
              </button>
            </div>
          </div>
        </div>


        {/* ── FOOTER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, fontSize: 12, color: '#94a3b8', fontWeight: 600, flexWrap: 'wrap', gap: 8 }}>
          <span>All times shown in your local time (AEST)</span>
          <span style={{ color: '#f59e0b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
            Data auto-refreshes every 5 minutes
          </span>
          <span>Last updated: {new Date().toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} &nbsp; ↻</span>
        </div>
      </div>

      {/* ══ EDIT MODAL ══ */}
      {editJob && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 560, width: '100%', padding: 30, boxShadow: '0 24px 80px rgba(0,0,0,0.2)', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 22 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ background: '#fef3c7', borderRadius: 8, padding: '5px 7px', display: 'flex' }}><FiEdit2 size={15} color="#d97706" /></span>
                  Edit Job — {editJob.id}
                </h3>
                <p style={{ margin: '5px 0 0', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{editJob.origin} → {editJob.destination}</p>
              </div>
              <button onClick={() => setEditJob(null)} style={{ background: 'none', border: 'none', fontSize: 24, color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleEditSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Origin City</label><input type="text" required value={editJob.origin} onChange={e => setEditJob({ ...editJob, origin: e.target.value })} style={inputStyle} /></div>
                <div><label style={labelStyle}>Destination City</label><input type="text" required value={editJob.destination} onChange={e => setEditJob({ ...editJob, destination: e.target.value })} style={inputStyle} /></div>
              </div>
              <div><label style={labelStyle}>Pickup Name</label><input type="text" value={editJob.pickupName} onChange={e => setEditJob({ ...editJob, pickupName: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Pickup Address</label><input type="text" value={editJob.pickupAddress} onChange={e => setEditJob({ ...editJob, pickupAddress: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Delivery Name</label><input type="text" value={editJob.deliveryName} onChange={e => setEditJob({ ...editJob, deliveryName: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Delivery Address</label><input type="text" value={editJob.deliveryAddress} onChange={e => setEditJob({ ...editJob, deliveryAddress: e.target.value })} style={inputStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Date</label><input type="text" value={editJob.date} onChange={e => setEditJob({ ...editJob, date: e.target.value })} style={inputStyle} /></div>
                <div><label style={labelStyle}>Time</label><input type="text" value={editJob.time} onChange={e => setEditJob({ ...editJob, time: e.target.value })} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Load Type</label>
                  <select value={editJob.loadType} onChange={e => setEditJob({ ...editJob, loadType: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option>Car Carrier</option><option>Flatbed 48ft</option><option>Refrigerated</option><option>Dry Van</option><option>Tanker</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Stops</label>
                  <select value={editJob.stops} onChange={e => setEditJob({ ...editJob, stops: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option>1 Stop</option><option>2 Stops</option><option>3 Stops</option><option>4+ Stops</option>
                  </select>
                </div>
              </div>
              <div><label style={labelStyle}>Reference #</label><input type="text" value={editJob.reference} onChange={e => setEditJob({ ...editJob, reference: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Status</label>
                <select value={editJob.status} onChange={e => setEditJob({ ...editJob, status: e.target.value, statusText: e.target.value.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase()) })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="UPCOMING">Upcoming</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 4 }}>
                <button type="button" onClick={() => setEditJob(null)} style={{ padding: 12, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13, fontWeight: 800, color: '#475569', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: 12, background: '#ffcc00', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 900, color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 2px 8px rgba(255,204,0,0.35)' }}>
                  <FiCheckCircle size={14} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM MODAL ══ */}
      {deleteJob && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 400, width: '100%', padding: 30, boxShadow: '0 24px 80px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, background: '#fff1f2', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <FiTrash2 size={26} color="#ef4444" />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Delete Job?</h3>
            <p style={{ margin: '0 0 6px', fontSize: 13, color: '#64748b', fontWeight: 600 }}>You are about to delete:</p>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', marginBottom: 22 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 15, color: '#1d4ed8' }}>{deleteJob.id}</div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 4 }}>{deleteJob.origin} → {deleteJob.destination}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{deleteJob.reference}</div>
            </div>
            <p style={{ margin: '0 0 22px', fontSize: 12, color: '#ef4444', fontWeight: 700, background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 8, padding: '8px 12px' }}>⚠️ This action cannot be undone.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button onClick={() => setDeleteJob(null)} style={{ padding: '12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13, fontWeight: 800, color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDeleteConfirm} style={{ padding: '12px', background: '#ef4444', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 900, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 2px 8px rgba(239,68,68,0.35)' }}>
                <FiTrash2 size={14} /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ NEW LOAD MODAL ══ */}
      {newLoadOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: 540, width: '100%', padding: 30, boxShadow: '0 24px 80px rgba(0,0,0,0.2)', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 22 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ background: '#ffcc00', borderRadius: 8, padding: '5px 7px', display: 'flex' }}><FiPlus size={15} color="#000" /></span>
                  Create New Load Request
                </h3>
                <p style={{ margin: '5px 0 0', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Submit a new freight load to Dispatch for scheduling</p>
              </div>
              <button onClick={() => setNewLoadOpen(false)} style={{ background: 'none', border: 'none', fontSize: 24, color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleNewLoadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Origin City *</label><input type="text" required value={newLoad.origin} onChange={e => setNewLoad({ ...newLoad, origin: e.target.value })} placeholder="e.g. Melbourne VIC" style={inputStyle} /></div>
                <div><label style={labelStyle}>Destination City *</label><input type="text" required value={newLoad.destination} onChange={e => setNewLoad({ ...newLoad, destination: e.target.value })} placeholder="e.g. Sydney NSW" style={inputStyle} /></div>
              </div>
              <div><label style={labelStyle}>Full Pickup Address *</label><input type="text" required value={newLoad.pickupAddress} onChange={e => setNewLoad({ ...newLoad, pickupAddress: e.target.value })} placeholder="Street, Suburb, State, Postcode" style={inputStyle} /></div>
              <div><label style={labelStyle}>Full Delivery Address *</label><input type="text" required value={newLoad.deliveryAddress} onChange={e => setNewLoad({ ...newLoad, deliveryAddress: e.target.value })} placeholder="Street, Suburb, State, Postcode" style={inputStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Pickup Date & Time *</label><input type="datetime-local" required value={newLoad.pickupTime} onChange={e => setNewLoad({ ...newLoad, pickupTime: e.target.value })} style={inputStyle} /></div>
                <div><label style={labelStyle}>Delivery Date & Time *</label><input type="datetime-local" required value={newLoad.deliveryTime} onChange={e => setNewLoad({ ...newLoad, deliveryTime: e.target.value })} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Customer Name</label><input type="text" value={newLoad.customer} onChange={e => setNewLoad({ ...newLoad, customer: e.target.value })} placeholder="e.g. Auto World Sydney" style={inputStyle} /></div>
                <div><label style={labelStyle}>PO / Reference #</label><input type="text" value={newLoad.reference} onChange={e => setNewLoad({ ...newLoad, reference: e.target.value })} placeholder="e.g. PO-65432" style={inputStyle} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Load Type</label>
                  <select value={newLoad.loadType} onChange={e => setNewLoad({ ...newLoad, loadType: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option>Car Carrier (4 Level)</option><option>Flatbed 48ft</option><option>Refrigerated</option><option>Dry Van</option><option>Tanker</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Number of Stops</label>
                  <select value={newLoad.stops} onChange={e => setNewLoad({ ...newLoad, stops: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option>1 Stop</option><option>2 Stops</option><option>3 Stops</option><option>4+ Stops</option>
                  </select>
                </div>
              </div>
              <div><label style={labelStyle}>Notes / Special Instructions</label>
                <textarea value={newLoad.notes} rows={3} onChange={e => setNewLoad({ ...newLoad, notes: e.target.value })}
                  placeholder="Hazmat, permit requirements, special handling..." style={{ ...inputStyle, resize: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 4 }}>
                <button type="button" onClick={() => setNewLoadOpen(false)} style={{ padding: 12, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13, fontWeight: 800, color: '#475569', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: 12, background: '#ffcc00', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 900, color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 2px 8px rgba(255,204,0,0.4)' }}>
                  <FiSend size={14} /> Submit New Load
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
