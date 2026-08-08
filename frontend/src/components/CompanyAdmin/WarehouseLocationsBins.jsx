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
const CalendarIcon2 = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const BoxCheckIcon2 = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
    <path d="M9 13l2 2 4-4"></path>
  </svg>
);
const LayersIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 12 12 17 22 12"></polyline>
    <polyline points="2 17 12 22 22 17"></polyline>
  </svg>
);
const LockIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const CheckCircleIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const AlertTriangleIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const SmallCircleIcon = ({ color }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);
const SmallCircleIconBordered = ({ color, border }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={color} stroke={border} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

export default function WarehouseLocationsBins({ wh, onBack }) {
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [viewLocationModal, setViewLocationModal] = useState(null);
  const [actionMenuIndex, setActionMenuIndex] = useState(null);
  const [editLocationModal, setEditLocationModal] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [locationsList, setLocationsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [kpiStats, setKpiStats] = useState({
    totalLocations: 0,
    totalBins: 0,
    binCapacity: '0 m³',
    usedCapacity: '0 m³',
    availableCapacity: '0 m³',
    utilPercent: '0.0',
    overfullBins: 0
  });

  const [addForm, setAddForm] = useState({
    code: '',
    name: '',
    area: 'Standard Storage',
    type: 'Floor',
    bins: '1',
    capacity: '100'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const whId = wh?.id || 'default';
      const res = await api.get(`/company-admin/warehouse/${whId}/locations`);
      if (res.data && res.data.success && res.data.data) {
        setLocationsList(res.data.data.locations || []);
        if (res.data.data.stats) setKpiStats(res.data.data.stats);
      }
    } catch (e) {
      console.error('Fetch locations error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [wh?.id]);

  const handleSaveLocation = async (e) => {
    if (e) e.preventDefault();
    if (!addForm.name.trim() && !addForm.code.trim()) {
      showToast('Please enter a location name or code');
      return;
    }
    try {
      setIsSubmitting(true);
      const whId = wh?.id || 'default';
      const res = await api.post(`/company-admin/warehouse/${whId}/locations`, addForm);
      if (res.data && res.data.success) {
        showToast('New location created & saved to MySQL DB!');
        setShowAddLocationModal(false);
        setAddForm({ code: '', name: '', area: 'Standard Storage', type: 'Floor', bins: '1', capacity: '100' });
        await fetchLocations();
      } else {
        showToast('Failed to create location');
      }
    } catch (e) {
      console.error('Error saving location:', e);
      showToast('Error saving location to MySQL DB');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLocation = async (locId, locName) => {
    if (window.confirm(`Are you sure you want to delete location "${locName}"?`)) {
      try {
        const res = await api.delete(`/company-admin/warehouse/locations/${locId}`);
        if (res.data && res.data.success) {
          showToast(`Location "${locName}" deleted from MySQL DB!`);
          await fetchLocations();
        } else {
          showToast('Failed to delete location');
        }
      } catch (e) {
        console.error('Error deleting location:', e);
        showToast('Error deleting location');
      }
    }
  };
  return (
    <div className="wh-bins-container" style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 32px', fontFamily: "'Inter','Outfit',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 900px) {
          .wh-bins-container { padding: 16px !important; }
          .wh-devnotes-cols { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
      {/* BREADCRUMBS & HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span>Home</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ cursor: 'pointer' }} onClick={onBack}>Warehouse Details</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ color: '#0F172A' }}>Warehouse Locations & Bins</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Warehouse Locations & Bins – {wh?.name || 'Sydney Head Office Warehouse'}</h1>
            <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0 0', fontWeight: 500 }}>Manage warehouse areas, locations, shelving and bins. Organise storage and track capacity.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <button onClick={onBack} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            &lt; Back to Warehouse Details
          </button>
          <button onClick={() => setShowAddLocationModal(true)} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 14, fontWeight: 400, marginTop: -2 }}>+</span> Add Location / Bin
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { title: 'TOTAL LOCATIONS', value: kpiStats.totalLocations.toString(), subtitle: 'Active locations', color: '#8B5CF6', bg: '#F5F3FF', icon: <CalendarIcon2 color="#8B5CF6" />, link: 'locations' },
          { title: 'TOTAL BINS', value: kpiStats.totalBins.toString(), subtitle: 'All bins', color: '#22C55E', bg: '#F0FDF4', icon: <BoxCheckIcon2 color="#22C55E" />, link: 'bins' },
          { title: 'BIN CAPACITY', value: kpiStats.binCapacity, subtitle: 'Total capacity', color: '#3B82F6', bg: '#EFF6FF', icon: <LayersIcon color="#3B82F6" />, link: 'capacity' },
          { title: 'USED CAPACITY', value: kpiStats.usedCapacity, subtitle: `${kpiStats.utilPercent}% utilised`, color: '#F59E0B', bg: '#FFFBEB', icon: <LockIcon color="#F59E0B" />, link: 'utilisation' },
          { title: 'AVAILABLE CAPACITY', value: kpiStats.availableCapacity, subtitle: 'Available', color: '#22C55E', bg: '#F0FDF4', icon: <CheckCircleIcon color="#22C55E" />, link: 'details' },
          { title: 'OVERFULL BINS', value: kpiStats.overfullBins.toString(), subtitle: 'Exceeds capacity', color: '#EF4444', bg: '#FEF2F2', icon: <AlertTriangleIcon color="#EF4444" />, link: 'alerts' }
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
              View {stat.link} <span>→</span>
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
              <div style={{ position: 'relative', minWidth: 220, flexShrink: 0 }}>
                <div style={{ position: 'absolute', left: 10, top: 7 }}><SearchIcon /></div>
                <input type="text" placeholder="Search by location, code or area..." style={{ boxSizing: 'border-box', width: '100%', padding: '6px 10px 6px 34px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none' }} />
              </div>
              {['All Location Types', 'All Areas', 'All Status'].map((filter, idx) => (
                <div key={idx} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {filter} <span style={{ fontSize: 9, color: '#94A3B8' }}>▼</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 600, color: '#1E293B', background: '#fff', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <ExportIcon /> Export
              </button>
              <button onClick={fetchLocations} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <RefreshIcon />
              </button>
            </div>
          </div>

          {/* LOCATIONS TABLE */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>WAREHOUSE LOCATIONS ({locationsList.length})</div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Location Code</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Location Name</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Area / Zone</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Location Type</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Total Bins</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Capacity (m³)</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Used (m³)</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap', width: 140 }}>Utilisation</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {locationsList.length > 0 ? (
                    locationsList.map((row, idx) => (
                      <tr key={row.id || idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.code}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.name}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.area}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.type}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{row.bins}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{row.cap}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{row.used}</td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', width: 28 }}>{row.util}</span>
                            <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: row.util, height: '100%', background: '#4F46E5', borderRadius: 3 }}></div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ display: 'inline-flex', padding: '4px 8px', borderRadius: 12, background: '#F0FDF4', color: '#22C55E', fontSize: 11, fontWeight: 600 }}>{row.status}</span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
                            <button
                              title="View Location Details"
                              onClick={() => setViewLocationModal(row)}
                              style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, cursor: 'pointer', padding: '6px 8px', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <EyeIcon />
                            </button>
                            
                            <div style={{ position: 'relative' }}>
                              <button
                                title="More Actions"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActionMenuIndex(actionMenuIndex === idx ? null : idx);
                                }}
                                style={{ background: actionMenuIndex === idx ? '#EEF2FF' : '#F1F5F9', border: 'none', borderRadius: 6, cursor: 'pointer', padding: '6px 8px', color: actionMenuIndex === idx ? '#4F46E5' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <MoreHorizontalIcon />
                              </button>

                              {/* Action Menu Dropdown */}
                              {actionMenuIndex === idx && (
                                <>
                                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setActionMenuIndex(null)} />
                                  <div style={{ position: 'absolute', right: 0, top: '110%', width: 170, background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)', padding: '6px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <button
                                      onClick={() => { setViewLocationModal(row); setActionMenuIndex(null); }}
                                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', fontSize: 12, fontWeight: 600, color: '#334155', background: 'none', border: 'none', borderRadius: 6, cursor: 'pointer', textAlign: 'left', width: '100%' }}
                                    >
                                      👁️ View Details
                                    </button>
                                    <button
                                      onClick={() => { handleDeleteLocation(row.id, row.name); setActionMenuIndex(null); }}
                                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', fontSize: 12, fontWeight: 600, color: '#EF4444', background: 'none', border: 'none', borderRadius: 6, cursor: 'pointer', textAlign: 'left', width: '100%' }}
                                    >
                                      🗑️ Delete Location
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" style={{ padding: '32px 16px', textAlign: 'center', color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>
                        No warehouse locations found matching your search. Click "+ Add Location / Bin" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>Showing {locationsList.length} of {locationsList.length} locations</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* WAREHOUSE LAYOUT */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>WAREHOUSE LAYOUT</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: 8 }}>
              {locationsList.length > 0 ? (
                locationsList.slice(0, 6).map((loc, i) => (
                  <div key={i} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 6, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>{loc.code}</div>
                    <div style={{ fontSize: 8, color: '#15803D', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{loc.name}</div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', padding: '16px 0', textAlign: 'center', color: '#94A3B8', fontSize: 11, fontWeight: 600 }}>
                  No layout locations registered
                </div>
              )}
            </div>
          </div>

          {/* STORAGE UTILISATION */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>STORAGE UTILISATION</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', background: '#E2E8F0' }}>
                <div style={{ position: 'absolute', top: 14, left: 14, right: 14, bottom: 14, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>{kpiStats.usedCapacity}</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#64748B', marginTop: 2 }}>Used</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#1E293B' }}><SmallCircleIcon color="#4F46E5" /> Used</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{kpiStats.usedCapacity}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#1E293B' }}><SmallCircleIcon color="#22C55E" /> Available</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{kpiStats.availableCapacity}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 10, borderTop: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#1E293B' }}><SmallCircleIconBordered color="#fff" border="#CBD5E1" /> Total Capacity</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{kpiStats.binCapacity}</div>
                </div>
              </div>
            </div>
          </div>

          {/* LOCATION TYPE BREAKDOWN */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>LOCATION TYPE BREAKDOWN</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Floor Storage', locs: '12', pct: '42.9%', color: '#3B82F6', bg: '#EFF6FF', w: '42.9%' },
                { name: 'Racking', locs: '6', pct: '21.4%', color: '#22C55E', bg: '#F0FDF4', w: '21.4%' },
                { name: 'Dispatch Area', locs: '4', pct: '14.3%', color: '#F59E0B', bg: '#FFFBEB', w: '14.3%' },
                { name: 'Quarantine Area', locs: '3', pct: '10.7%', color: '#EF4444', bg: '#FEF2F2', w: '10.7%' },
                { name: 'Returns Area', locs: '3', pct: '10.7%', color: '#8B5CF6', bg: '#F5F3FF', w: '10.7%' }
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 120 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SmallCircleIconBordered color={t.color} border={t.bg} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>{t.name}</div>
                  </div>
                  <div style={{ fontSize: 10, color: '#64748B', width: 60 }}>{t.locs} locations</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 40, height: 4, background: '#E2E8F0', borderRadius: 2 }}>
                      <div style={{ width: t.w, height: '100%', background: t.color, borderRadius: 2 }}></div>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#0F172A', width: 32, textAlign: 'right' }}>{t.pct}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>



      {/* ADD LOCATION MODAL */}
      {showAddLocationModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)' }} onClick={() => setShowAddLocationModal(false)}></div>
          <form onSubmit={handleSaveLocation} style={{ background: '#fff', width: '500px', borderRadius: 16, padding: '32px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 20, fontWeight: 800, color: '#0F172A' }}>Add New Location / Bin</h2>
            
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Bin Name / Identifier *</label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={e => setAddForm({ ...addForm, name: e.target.value, code: e.target.value })}
                  placeholder="e.g. A-12-04"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Zone / Area</label>
                  <select
                    value={addForm.area}
                    onChange={e => setAddForm({ ...addForm, area: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}
                  >
                    <option value="Standard Storage">Standard Storage</option>
                    <option value="Main Storage">Main Storage</option>
                    <option value="Bulk Storage">Bulk Storage</option>
                    <option value="Cold Storage">Cold Storage</option>
                    <option value="Dispatch Area">Dispatch Area</option>
                    <option value="Quarantine">Quarantine</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Max Capacity (m³)</label>
                  <input
                    type="number"
                    value={addForm.capacity}
                    onChange={e => setAddForm({ ...addForm, capacity: e.target.value })}
                    placeholder="100"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Barcode Generation</label>
                <div style={{ padding: '12px', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 8, fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span>+</span> Auto-generate QR/Barcode on Save
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button type="button" onClick={() => setShowAddLocationModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', background: '#4F46E5', color: '#fff', cursor: 'pointer' }}>
                {isSubmitting ? 'Saving...' : 'Save Location'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW LOCATION DETAILS MODAL */}
      {viewLocationModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(3px)' }} onClick={() => setViewLocationModal(null)} />
          <div style={{ background: '#fff', width: '560px', borderRadius: 20, padding: '28px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ background: '#EEF2FF', color: '#4F46E5', fontSize: 13, fontWeight: 900, padding: '4px 10px', borderRadius: 8, letterSpacing: '0.5px' }}>{viewLocationModal.code}</span>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{viewLocationModal.name}</h2>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 500 }}>
                  Area: <strong style={{ color: '#1E293B' }}>{viewLocationModal.area}</strong> • Type: <strong style={{ color: '#1E293B' }}>{viewLocationModal.type}</strong>
                </div>
              </div>
              <button onClick={() => setViewLocationModal(null)} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748B' }}>✕</button>
            </div>

            {/* Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Total Bins</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginTop: 2 }}>{viewLocationModal.bins}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Capacity</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginTop: 2 }}>{viewLocationModal.cap} m³</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Used Space</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#4F46E5', marginTop: 2 }}>{viewLocationModal.used} m³</div>
              </div>
            </div>

            {/* Utilisation progress bar */}
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>Storage Utilisation Rate</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#4F46E5' }}>{viewLocationModal.util}</span>
              </div>
              <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: viewLocationModal.util, height: '100%', background: '#4F46E5', borderRadius: 4 }} />
              </div>
            </div>

            {/* Sub-bins preview */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location Bins Overview</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[1, 2, 3, 4, 5, 6].map((b) => (
                  <div key={b} style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{viewLocationModal.code}-BIN-0{b}</span>
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#22C55E', background: '#F0FDF4', padding: '2px 6px', borderRadius: 4 }}>OK</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <button
                onClick={() => { showToast(`Printing Label for ${viewLocationModal.code}`); setViewLocationModal(null); }}
                style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', cursor: 'pointer' }}
              >
                🏷️ Print Location Barcode
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => { const loc = viewLocationModal; setViewLocationModal(null); setEditLocationModal(loc); }}
                  style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', cursor: 'pointer' }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setViewLocationModal(null)}
                  style={{ padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', background: '#0F172A', color: '#fff', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT LOCATION MODAL */}
      {editLocationModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(3px)' }} onClick={() => setEditLocationModal(null)} />
          <div style={{ background: '#fff', width: '500px', borderRadius: 20, padding: '28px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #E2E8F0' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 900, color: '#0F172A' }}>Edit Location – {editLocationModal.code}</h2>
            
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Location Name</label>
                <input type="text" defaultValue={editLocationModal.name} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', fontWeight: 600 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Area / Zone</label>
                  <input type="text" defaultValue={editLocationModal.area} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', fontWeight: 600 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Max Capacity (m³)</label>
                  <input type="text" defaultValue={editLocationModal.cap} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', fontWeight: 600 }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 28 }}>
              <button onClick={() => setEditLocationModal(null)} style={{ padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { showToast(`Location ${editLocationModal.code} updated successfully!`); setEditLocationModal(null); }} style={{ padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', background: '#4F46E5', color: '#fff', cursor: 'pointer' }}>Save Changes</button>
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
