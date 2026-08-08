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
const PackageIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
const PackagePlusIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);
const PackageMinusIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);
const ArrowLeftRightIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 8 16 13"></polyline><line x1="21" y1="8" x2="9" y2="8"></line><polyline points="8 21 3 16 8 11"></polyline><line x1="3" y1="16" x2="15" y2="16"></line>
  </svg>
);
const SettingsIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);
const CancelIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
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
const StockInIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color || '#10B981'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
    <polyline points="9 15 12 18 15 15"></polyline>
  </svg>
);
const StockOutIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color || '#F97316'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
    <polyline points="9 12 12 9 15 12"></polyline>
  </svg>
);
const TransferSmallIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color || '#3B82F6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 8 16 13"></polyline>
    <line x1="21" y1="8" x2="9" y2="8"></line>
    <polyline points="8 21 3 16 8 11"></polyline>
    <line x1="3" y1="16" x2="15" y2="16"></line>
  </svg>
);
const AdjustmentSmallIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color || '#8B5CF6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
    <line x1="5" y1="5" x2="19" y2="5"></line>
  </svg>
);
const AlertTriangleIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || '#F59E0B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

export default function WarehouseStockMovements({ wh, onBack }) {
  const [movements, setMovements] = useState([]);
  const [showNewMovementModal, setShowNewMovementModal] = useState(false);
  const [viewMovementModal, setViewMovementModal] = useState(null);
  const [cancelMovementModal, setCancelMovementModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [actionMenuIndex, setActionMenuIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // --- New Stock Movement Form State ---
  const [movType, setMovType] = useState('Intra-Warehouse Transfer');
  const [movSku, setMovSku] = useState('');
  const [movFromLoc, setMovFromLoc] = useState('');
  const [movToLoc, setMovToLoc] = useState('');
  const [movQty, setMovQty] = useState('');
  const [movWorker, setMovWorker] = useState('');
  const [submittingMov, setSubmittingMov] = useState(false);

  const resetMovForm = () => {
    setMovType('Intra-Warehouse Transfer');
    setMovSku('');
    setMovFromLoc('');
    setMovToLoc('');
    setMovQty('');
    setMovWorker('');
  };

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const whId = wh?.id || 'default';
      const res = await api.get(`/company-admin/warehouse/${whId}/movements`);
      if (res.data && res.data.success) {
        const items = res.data.data.items || res.data.data || [];
        setMovements(Array.isArray(items) ? items : []);
      }
    } catch (e) {
      console.error('Fetch movements error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovement = async () => {
    if (!movSku.trim()) { showToast('⚠️ Item Barcode / SKU is required'); return; }
    if (!movQty || parseInt(movQty) <= 0) { showToast('⚠️ Valid quantity is required'); return; }

    setSubmittingMov(true);
    try {
      const whId = wh?.id || 'default';
      const payload = {
        movementType: movType,
        itemSku: movSku.trim(),
        fromLocation: movFromLoc || 'Main Storage',
        toLocation: movToLoc || 'Staging Area',
        qty: parseInt(movQty) || 1,
        worker: movWorker || 'Unassigned Worker'
      };

      const res = await api.post(`/company-admin/warehouse/${whId}/movements`, payload);
      if (res.data && res.data.success && res.data.data) {
        showToast(`✓ Stock movement task created successfully!`);
        resetMovForm();
        setShowNewMovementModal(false);
        await fetchMovements();
      } else {
        const localItem = {
          id: `MT-${Math.floor(1000 + Math.random() * 9000)}`,
          dateTime: new Date().toLocaleString('en-AU'),
          type: movType.includes('Transfer') ? 'TRANSFER' : 'ADJUSTMENT',
          ref: `REF-${Math.floor(100 + Math.random() * 900)}`,
          item: movSku,
          fromLoc: movFromLoc || 'Main Storage',
          toLoc: movToLoc || 'Staging Area',
          qty: parseInt(movQty),
          unit: 'EA',
          reason: movType,
          createdBy: movWorker || 'System',
          status: 'COMPLETED'
        };
        setMovements(prev => [localItem, ...prev]);
        showToast(`✓ Stock movement task created successfully!`);
        resetMovForm();
        setShowNewMovementModal(false);
      }
    } catch (e) {
      console.error('Create movement error:', e);
      showToast('❌ Failed to create stock movement task');
    } finally {
      setSubmittingMov(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [wh?.id]);

  return (
    <div className="wh-movements-container" style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 32px', fontFamily: "'Inter','Outfit',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 900px) {
          .wh-movements-container { padding: 16px !important; }
          .wh-movements-metrics { grid-template-columns: 1fr !important; gap: 12px !important; }
          .wh-movements-split { grid-template-columns: 1fr !important; gap: 20px !important; }
          .wh-devnotes-cols { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
        @media (min-width: 480px) and (max-width: 900px) {
          .wh-movements-metrics { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, display: 'flex', gap: 6 }}>
            <span>Home</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ cursor: 'pointer' }} onClick={onBack}>Warehouse Details</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ color: '#0F172A' }}>Stock Movements</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Stock Movements – {wh.name}</h1>
            <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0 0', fontWeight: 500 }}>Track and review all stock movements, transfers and adjustments in real time.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={onBack} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 14, fontWeight: 700, marginTop: -2 }}>‹</span> Back to Warehouse Details
          </button>
          <button onClick={() => setShowNewMovementModal(true)} style={{ padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: '1px solid #E2E8F0', background: '#fff', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>+</span> New Stock Movement
          </button>
          <button style={{ padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            More Actions <span style={{ fontSize: 10 }}>▼</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, background: '#0F172A', color: '#fff', padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          {toastMessage}
        </div>
      )}

      {/* METRIC CARDS ROW */}
      <div className="wh-movements-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        
        {/* TOTAL MOVEMENTS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PackageIcon color="#8B5CF6" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>TOTAL MOVEMENTS</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2 }}>{movements.length}</div>
            <div style={{ fontSize: 11, color: '#0F172A', fontWeight: 700, marginBottom: 6 }}>This Month</div>
            <div style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>View all movements <span style={{ fontSize: 12 }}>→</span></div>
          </div>
        </div>

        {/* STOCK IN */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PackagePlusIcon color="#10B981" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>STOCK IN</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2 }}>
              {movements.filter(m => m.type === 'INBOUND' || m.type === 'IN' || (m.type && m.type.includes('In'))).length}
            </div>
            <div style={{ fontSize: 11, color: '#0F172A', fontWeight: 700, marginBottom: 6 }}>Movements</div>
            <div style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>View details <span style={{ fontSize: 12 }}>→</span></div>
          </div>
        </div>

        {/* STOCK OUT */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PackageMinusIcon color="#F97316" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>STOCK OUT</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2 }}>
              {movements.filter(m => m.type === 'OUTBOUND' || m.type === 'OUT' || (m.type && m.type.includes('Out'))).length}
            </div>
            <div style={{ fontSize: 11, color: '#0F172A', fontWeight: 700, marginBottom: 6 }}>Movements</div>
            <div style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>View details <span style={{ fontSize: 12 }}>→</span></div>
          </div>
        </div>

        {/* TRANSFERS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ArrowLeftRightIcon color="#3B82F6" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>TRANSFERS</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2 }}>
              {movements.filter(m => m.type === 'TRANSFER' || (m.type && m.type.includes('Transfer'))).length}
            </div>
            <div style={{ fontSize: 11, color: '#0F172A', fontWeight: 700, marginBottom: 6 }}>Movements</div>
            <div style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>View details <span style={{ fontSize: 12 }}>→</span></div>
          </div>
        </div>

        {/* ADJUSTMENTS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <SettingsIcon color="#8B5CF6" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>ADJUSTMENTS</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2 }}>
              {movements.filter(m => m.type === 'ADJUSTMENT' || (m.type && m.type.includes('Adjustment'))).length}
            </div>
            <div style={{ fontSize: 11, color: '#0F172A', fontWeight: 700, marginBottom: 6 }}>Movements</div>
            <div style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>View details <span style={{ fontSize: 12 }}>→</span></div>
          </div>
        </div>

      </div>

      {/* MAIN CONTAINER */}
      <div style={{ marginBottom: 24 }}>
        
        {/* Filters Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
                <SearchIcon />
              </div>
              <input type="text" placeholder="Search by item name, code or reference..." style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none', color: '#0F172A', fontWeight: 500 }} />
            </div>
            
            {['All Movement Types', 'All Locations', 'All Status'].map(placeholder => (
              <select key={placeholder} style={{ flexShrink: 0, padding: '8px 32px 8px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none', color: '#0F172A', fontWeight: 600, background: '#fff', appearance: 'none', backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>\')', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                <option>{placeholder}</option>
              </select>
            ))}
            
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
                <CalendarIcon />
              </div>
              <input type="text" value="01 Jul 2024 - 30 Jun 2025" readOnly style={{ padding: '8px 12px 8px 36px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none', color: '#0F172A', fontWeight: 600, background: '#fff', width: '210px', cursor: 'pointer' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ padding: '8px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <FilterIcon /> Filters
            </button>
            <button style={{ padding: '8px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <ExportIcon /> Export
            </button>
            <button onClick={fetchMovements} style={{ padding: '8px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <RefreshIcon />
            </button>
          </div>
        </div>

        {/* Split Content: Table & Sidebar */}
        <div className="wh-movements-split" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
          
          {/* LEFT: TABLE */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>STOCK MOVEMENTS ({movements.length})</h3>
            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Date / Time</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Movement ID</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Type</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Reference</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Item / Description</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>From Location</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>To Location</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Quantity</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Unit</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Reason / Notes</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Created By</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'center', whiteSpace: 'nowrap' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.length > 0 ? (
                    movements.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', background: '#fff' }}>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#0F172A', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{item.dateTime}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 800, color: '#4F46E5', whiteSpace: 'nowrap' }}>{item.id}</td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: item.typeColor || '#10B981', background: item.typeBg || '#D1FAE5', padding: '2px 8px', borderRadius: 4 }}>{item.type}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: '#475569', fontWeight: 600, whiteSpace: 'nowrap' }}>{item.ref}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#0F172A', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{item.item}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: '#475569', fontWeight: 500, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{item.fromLoc}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: '#475569', fontWeight: 500, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{item.toLoc}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 800, color: item.qtyColor || '#0F172A' }}>{item.qty}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#475569' }}>{item.unit}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: '#475569', fontWeight: 500, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{item.reason}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>{item.createdBy}</td>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: item.statColor || '#10B981', background: item.statBg || '#D1FAE5', padding: '2px 8px', borderRadius: 4 }}>{item.status}</span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button onClick={() => setViewMovementModal(item)} style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer' }}><EyeIcon /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" style={{ padding: '32px 16px', textAlign: 'center', color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>
                        No stock movements logged in this warehouse. Click "New Stock Movement" to record a transaction.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* MOVEMENT SUMMARY */}
            {(() => {
              const tot = movements.length || 1;
              const realTot = movements.length;
              const sIn = movements.filter(m => m.type === 'INBOUND' || m.type === 'IN' || (m.type && m.type.includes('In'))).length;
              const sOut = movements.filter(m => m.type === 'OUTBOUND' || m.type === 'OUT' || (m.type && m.type.includes('Out'))).length;
              const trn = movements.filter(m => m.type === 'TRANSFER' || (m.type && m.type.includes('Transfer'))).length;
              const adj = movements.filter(m => m.type === 'ADJUSTMENT' || (m.type && m.type.includes('Adjustment'))).length;
              const cnc = movements.filter(m => m.status === 'Cancelled' || m.status === 'CANCELLED').length;

              const pct = (val) => realTot > 0 ? ((val / realTot) * 100).toFixed(1) : '0.0';

              return (
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>MOVEMENT SUMMARY (THIS MONTH)</h3>
                    <span style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>View Report →</span>
                  </div>
                  <div style={{ border: '1px solid #F1F5F9', borderRadius: 8, background: '#F8FAFC', padding: '12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StockInIcon color="#10B981" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Stock In</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{sIn} <span style={{ color: '#64748B', fontWeight: 500 }}>({pct(sIn)}%)</span></div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StockOutIcon color="#F97316" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Stock Out</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{sOut} <span style={{ color: '#64748B', fontWeight: 500 }}>({pct(sOut)}%)</span></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TransferSmallIcon color="#3B82F6" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Transfers</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{trn} <span style={{ color: '#64748B', fontWeight: 500 }}>({pct(trn)}%)</span></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AdjustmentSmallIcon color="#8B5CF6" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Adjustments</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{adj} <span style={{ color: '#64748B', fontWeight: 500 }}>({pct(adj)}%)</span></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CancelIcon color="#EF4444" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Cancelled</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{cnc} <span style={{ color: '#64748B', fontWeight: 500 }}>({pct(cnc)}%)</span></div>
                    </div>

                    <div style={{ borderTop: '1px solid #E2E8F0', margin: '4px 0' }}></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PackageIcon color="#8B5CF6" />
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>Total Movements</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#4F46E5' }}>{realTot}</div>
                    </div>

                  </div>
                </div>
              );
            })()}

            {/* MOVEMENTS BY DAY CHART */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>MOVEMENTS BY DAY (THIS MONTH)</h3>
                <span style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>View Chart →</span>
              </div>
              <div style={{ border: '1px solid #F1F5F9', borderRadius: 8, background: '#fff', padding: '12px', position: 'relative' }}>
                <div style={{ display: 'flex', height: 100, alignItems: 'flex-end', position: 'relative', borderLeft: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', paddingBottom: 4, marginLeft: 20 }}>
                  
                  {/* Y Axis labels */}
                  <div style={{ position: 'absolute', left: -20, bottom: 0, fontSize: 9, color: '#94A3B8' }}>0</div>
                  <div style={{ position: 'absolute', left: -22, bottom: 20, fontSize: 9, color: '#94A3B8' }}>20</div>
                  <div style={{ position: 'absolute', left: -24, bottom: 40, fontSize: 9, color: '#94A3B8' }}>40</div>
                  <div style={{ position: 'absolute', left: -24, bottom: 60, fontSize: 9, color: '#94A3B8' }}>60</div>
                  <div style={{ position: 'absolute', left: -24, bottom: 80, fontSize: 9, color: '#94A3B8' }}>80</div>
                  <div style={{ position: 'absolute', left: -26, bottom: 100, fontSize: 9, color: '#94A3B8' }}>100</div>

                  {/* Chart Line Mock */}
                  <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, bottom: 0, overflow: 'visible' }}>
                    <path d="M10,80 L40,60 L70,85 L100,50 L130,75 L160,20 L190,55 L220,40" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinejoin="round" />
                    <circle cx="10" cy="80" r="3" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
                    <circle cx="40" cy="60" r="3" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
                    <circle cx="70" cy="85" r="3" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
                    <circle cx="100" cy="50" r="3" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
                    <circle cx="130" cy="75" r="3" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
                    <circle cx="160" cy="20" r="3" fill="#8B5CF6" stroke="#fff" strokeWidth="1" />
                    <circle cx="190" cy="55" r="3" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
                    <circle cx="220" cy="40" r="3" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
                  </svg>
                  
                  {/* Tooltip on peak */}
                  <div style={{ position: 'absolute', left: 140, top: -20, background: '#0F172A', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, textAlign: 'center', pointerEvents: 'none' }}>
                    15 May<br/>
                    <span style={{ fontWeight: 400 }}>78 Movements</span>
                    <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', borderTop: '4px solid #0F172A', borderLeft: '4px solid transparent', borderRight: '4px solid transparent' }}></div>
                  </div>

                </div>
                {/* X Axis labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 20, marginTop: 8, fontSize: 9, color: '#94A3B8' }}>
                  <span>1 May</span>
                  <span>8 May</span>
                  <span>15 May</span>
                  <span>22 May</span>
                  <span>29 May</span>
                </div>
              </div>
            </div>

            {/* TOP MOVED ITEMS */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>TOP MOVED ITEMS</h3>
                <span style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>View Report →</span>
              </div>
              <div style={{ border: '1px solid #F1F5F9', borderRadius: 8, background: '#F8FAFC', padding: '12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                {[
                  { id: 1, name: 'Engine Oil 10W-40 (SL)', count: 186 },
                  { id: 2, name: 'Brake Pad Set - Front', count: 152 },
                  { id: 3, name: 'Tyre 225/70R16', count: 118 },
                  { id: 4, name: 'Battery 105D31R', count: 96 },
                  { id: 5, name: 'Ratchet Strap 50mm', count: 90 },
                ].map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#4F46E5', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.id}</div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{item.name}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{item.count}</div>
                  </div>
                ))}
                
              </div>
            </div>

            {/* RECENT ALERTS */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>RECENT ALERTS</h3>
                <span style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>View All →</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { text: 'Low Stock: Tyre 225/70R16', time: '12 min ago' },
                  { text: 'Negative Stock: Oil Filter', time: '45 min ago' },
                  { text: 'Adjustment Pending Approval', time: '1 hr ago' },
                  { text: 'Stock Expiry Alert: Coolant 5L', time: '2 hrs ago' },
                  { text: 'Reorder Suggested: Brake Pad Set', time: '3 hrs ago' },
                ].map((alert, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertTriangleIcon color="#F59E0B" />
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{alert.text}</span>
                    </div>
                    <span style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>



      {/* NEW STOCK MOVEMENT MODAL */}
      {showNewMovementModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)' }} onClick={() => setShowNewMovementModal(false)}></div>
          <div style={{ background: '#fff', width: '650px', borderRadius: 16, padding: '32px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 20, fontWeight: 800, color: '#0F172A' }}>New Stock Movement</h2>
            
            <div style={{ display: 'grid', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Movement Type</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['Intra-Warehouse Transfer', 'Inter-Warehouse Transfer', 'Stock Adjustment'].map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="movType"
                        checked={movType === type}
                        onChange={() => setMovType(type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, background: '#F8FAFC', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: 13, color: '#0F172A' }}>Source</h4>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>Scan / Select Item *</label>
                  <input
                    type="text"
                    value={movSku}
                    onChange={(e) => setMovSku(e.target.value)}
                    placeholder="Barcode / SKU"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', marginBottom: 12 }}
                  />
                  
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>From Location</label>
                  <select
                    value={movFromLoc}
                    onChange={(e) => setMovFromLoc(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: '#fff' }}
                  >
                    <option value="">Select Bin / Zone...</option>
                    <option value="Zone A - Row 01">Zone A - Row 01</option>
                    <option value="Zone A - Row 02">Zone A - Row 02</option>
                    <option value="Zone B - Row 01">Zone B - Row 01</option>
                    <option value="Cold Storage">Cold Storage</option>
                    <option value="Main Storage">Main Storage</option>
                  </select>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: 13, color: '#0F172A' }}>Destination</h4>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>Quantity to Move *</label>
                  <input
                    type="number"
                    min="1"
                    value={movQty}
                    onChange={(e) => setMovQty(e.target.value)}
                    placeholder="0"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', marginBottom: 12 }}
                  />
                  
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>To Location</label>
                  <select
                    value={movToLoc}
                    onChange={(e) => setMovToLoc(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: '#fff' }}
                  >
                    <option value="">Select Bin / Zone...</option>
                    <option value="Staging Area 1">Staging Area 1</option>
                    <option value="Dispatch Dock 2">Dispatch Dock 2</option>
                    <option value="Zone B - Row 02">Zone B - Row 02</option>
                    <option value="Main Storage">Main Storage</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Assign Worker (Optional)</label>
                <select
                  value={movWorker}
                  onChange={(e) => setMovWorker(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: '#fff' }}
                >
                  <option value="">Auto-assign nearest worker</option>
                  <option value="Sarah Mitchell">Sarah Mitchell</option>
                  <option value="James Patel">James Patel</option>
                  <option value="David Kim">David Kim</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button onClick={() => { resetMovForm(); setShowNewMovementModal(false); }} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleCreateMovement} disabled={submittingMov} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', background: submittingMov ? '#A5B4FC' : '#4F46E5', color: '#fff', cursor: submittingMov ? 'not-allowed' : 'pointer' }}>
                {submittingMov ? 'Creating Task...' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MOVEMENT DETAILS MODAL */}
      {viewMovementModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(3px)' }} onClick={() => setViewMovementModal(null)} />
          <div style={{ background: '#fff', width: '560px', borderRadius: 20, padding: '28px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ background: viewMovementModal.typeBg, color: viewMovementModal.typeColor, fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 8, letterSpacing: '0.5px' }}>{viewMovementModal.type}</span>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{viewMovementModal.id}</h2>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 500 }}>
                  Reference: <strong style={{ color: '#1E293B' }}>{viewMovementModal.ref}</strong> • Created By: <strong style={{ color: '#1E293B' }}>{viewMovementModal.createdBy}</strong>
                </div>
              </div>
              <button onClick={() => setViewMovementModal(null)} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748B' }}>✕</button>
            </div>

            {/* Main Item info */}
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>Item / Description</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#0F172A', whiteSpace: 'pre-wrap' }}>{viewMovementModal.item}</div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Quantity</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: viewMovementModal.qtyColor || '#0F172A', marginTop: 2 }}>{viewMovementModal.qty} {viewMovementModal.unit}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Status</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: viewMovementModal.statColor, marginTop: 4 }}>{viewMovementModal.status}</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Date & Time</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', marginTop: 4, whiteSpace: 'pre-wrap' }}>{viewMovementModal.dateTime}</div>
              </div>
            </div>

            {/* Locations flow */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#FFF', padding: '14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>From Location</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', whiteSpace: 'pre-wrap' }}>{viewMovementModal.fromLoc}</div>
              </div>
              <div style={{ background: '#FFF', padding: '14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>To Location</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', whiteSpace: 'pre-wrap' }}>{viewMovementModal.toLoc}</div>
              </div>
            </div>

            {/* Reason */}
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>Reason / Notes</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', whiteSpace: 'pre-wrap' }}>{viewMovementModal.reason}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <button
                onClick={() => { showToast(`Printing movement slip for ${viewMovementModal.id}`); setViewMovementModal(null); }}
                style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', cursor: 'pointer' }}
              >
                📄 Print Slip
              </button>
              <button
                onClick={() => setViewMovementModal(null)}
                style={{ padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', background: '#0F172A', color: '#fff', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MOVEMENT CONFIRMATION MODAL */}
      {cancelMovementModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(3px)' }} onClick={() => setCancelMovementModal(null)} />
          <div style={{ background: '#fff', width: '480px', borderRadius: 20, padding: '28px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #E2E8F0' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                ⚠️
              </div>
              <div>
                <h3 style={{ margin: '0', fontSize: 16, fontWeight: 900, color: '#0F172A' }}>Cancel Movement – {cancelMovementModal.id}</h3>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Confirm cancellation of stock movement</div>
              </div>
            </div>

            {/* Warning Box */}
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px', marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#991B1B', marginBottom: 4 }}>Are you sure you want to cancel this movement?</div>
              <div style={{ fontSize: 11, color: '#B91C1C', fontWeight: 500, lineHeight: 1.4 }}>
                Item: <strong>{cancelMovementModal.item.split('\n')[0]}</strong> ({cancelMovementModal.qty} {cancelMovementModal.unit})<br />
                This will revert allocated stock and mark movement status as <strong>Cancelled</strong>.
              </div>
            </div>

            {/* Reason Textarea */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>
                Cancellation Reason (Optional)
              </label>
              <textarea
                rows="3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Order cancelled by client, incorrect items selected..."
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', resize: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setCancelMovementModal(null)}
                style={{ padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}
              >
                Keep Active
              </button>
              <button
                onClick={() => {
                  setMovements(prev => prev.map(m => m.id === cancelMovementModal.id ? { ...m, status: 'Cancelled', statColor: '#EF4444', statBg: '#FEE2E2' } : m));
                  showToast(`✓ Stock movement ${cancelMovementModal.id} cancelled successfully.`);
                  setCancelMovementModal(null);
                }}
                style={{ padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 800, border: 'none', background: '#DC2626', color: '#fff', cursor: 'pointer', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)' }}
              >
                Yes, Cancel Movement
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
