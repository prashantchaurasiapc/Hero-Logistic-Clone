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
const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
const AlertTriangleIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const StockInIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);
const StockOutIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);
const TransferSmallIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 8 16 13"></polyline><line x1="21" y1="8" x2="9" y2="8"></line><polyline points="8 21 3 16 8 11"></polyline><line x1="3" y1="16" x2="15" y2="16"></line>
  </svg>
);
const AdjustmentSmallIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const DUMMY_MOVEMENTS = [
  { 
    dateTime: '15 May 2025\n09:14 AM', id: 'MOV-2025-1286', type: 'Stock In', typeColor: '#10B981', typeBg: '#D1FAE5', ref: 'PO-55412', item: 'Toyota Corolla 2022 (White)\nCAR-001', fromLoc: '-', toLoc: 'Main Storage A1\nRow 01 - Bay 03', qty: '1', unit: 'Each', reason: 'Purchase Receipt\nPO-55412', createdBy: 'James Patel', status: 'Completed', statColor: '#10B981', statBg: '#D1FAE5' 
  },
  { 
    dateTime: '15 May 2025\n10:05 AM', id: 'MOV-2025-1285', type: 'Stock Out', typeColor: '#F59E0B', typeBg: '#FEF3C7', ref: 'SO-66891', item: 'Brake Pad Set - Front\nPART-0456', fromLoc: 'Bulk Storage B1\nShelf 02', toLoc: 'Dispatch Area\nRack 02', qty: '10', unit: 'Set', reason: 'Sales Order\nSO-66891', createdBy: 'Robert Taylor', status: 'Completed', statColor: '#10B981', statBg: '#D1FAE5' 
  },
  { 
    dateTime: '15 May 2025\n11:22 AM', id: 'MOV-2025-1284', type: 'Transfer', typeColor: '#3B82F6', typeBg: '#DBEAFE', ref: 'TRF-5588', item: 'Engine Oil 10W-40 (SL)\nOIL-10W40', fromLoc: 'Bulk Storage B2\nShelf 03', toLoc: 'Main Storage A1\nRow 02 - Bay 01', qty: '20', unit: 'Bottle', reason: 'Replenish Main Storage', createdBy: 'Sarah Mitchell', status: 'Completed', statColor: '#10B981', statBg: '#D1FAE5' 
  },
  { 
    dateTime: '15 May 2025\n01:40 PM', id: 'MOV-2025-1283', type: 'Adjustment', typeColor: '#8B5CF6', typeBg: '#F3E8FF', ref: 'ADJ-1123', item: 'Tyre 225/70R16\nTYRE-22570R16', fromLoc: 'Tyre Rack C1\nLevel 01', toLoc: 'Tyre Rack C1\nLevel 01', qty: '-2', qtyColor: '#EF4444', unit: 'Each', reason: 'Damaged Items\nWrite-off', createdBy: 'James Patel', status: 'Completed', statColor: '#10B981', statBg: '#D1FAE5' 
  },
  { 
    dateTime: '15 May 2025\n02:15 PM', id: 'MOV-2025-1282', type: 'Stock In', typeColor: '#10B981', typeBg: '#D1FAE5', ref: 'PO-55413', item: 'Battery 105D31R\nBAT-105D31R', fromLoc: '-', toLoc: 'Hazard Area D1\nCabinet 01', qty: '5', unit: 'Each', reason: 'Purchase Receipt\nPO-55413', createdBy: 'Lisa Chen', status: 'Completed', statColor: '#10B981', statBg: '#D1FAE5' 
  },
  { 
    dateTime: '14 May 2025\n04:30 PM', id: 'MOV-2025-1281', type: 'Stock Out', typeColor: '#F59E0B', typeBg: '#FEF3C7', ref: 'PICK-3312', item: 'Coolant 5L\nCOOLANT-5L', fromLoc: 'Bulk Storage B3\nTank Zone', toLoc: 'Dispatch Area\nRack 02', qty: '8', unit: 'Bottle', reason: 'Customer Pick\nPICK-3312', createdBy: 'Michael Brown', status: 'Completed', statColor: '#10B981', statBg: '#D1FAE5' 
  },
  { 
    dateTime: '14 May 2025\n03:16 PM', id: 'MOV-2025-1280', type: 'Transfer', typeColor: '#3B82F6', typeBg: '#DBEAFE', ref: 'TRF-5567', item: 'Ratchet Strap 50mm\nSTRAP-50MM', fromLoc: 'Dispatch Area\nRack 02', toLoc: 'Main Storage A1\nRow 03 - Bay 05', qty: '15', unit: 'Each', reason: 'Reallocate Stock', createdBy: 'Sarah Mitchell', status: 'Completed', statColor: '#10B981', statBg: '#D1FAE5' 
  },
  { 
    dateTime: '14 May 2025\n01:05 PM', id: 'MOV-2025-1279', type: 'Adjustment', typeColor: '#8B5CF6', typeBg: '#F3E8FF', ref: 'ADJ-1122', item: 'Fuel Filter\nFILTER-OIL', fromLoc: 'Bulk Storage B1\nShelf 04', toLoc: 'Bulk Storage B1\nShelf 04', qty: '+3', qtyColor: '#10B981', unit: 'Each', reason: 'Stock Count Adjustment', createdBy: 'Robert Taylor', status: 'Completed', statColor: '#10B981', statBg: '#D1FAE5' 
  },
  { 
    dateTime: '14 May 2025\n11:11 AM', id: 'MOV-2025-1278', type: 'Stock In', typeColor: '#10B981', typeBg: '#D1FAE5', ref: 'PO-55411', item: 'Touch Up Paint (White)\nPAINT-WHT', fromLoc: '-', toLoc: 'Dispatch Area\nCabinet 03', qty: '12', unit: 'Tin', reason: 'Purchase Receipt\nPO-55411', createdBy: 'James Patel', status: 'Completed', statColor: '#10B981', statBg: '#D1FAE5' 
  },
  { 
    dateTime: '13 May 2025\n05:45 PM', id: 'MOV-2025-1277', type: 'Stock Out', typeColor: '#F59E0B', typeBg: '#FEF3C7', ref: 'SO-66890', item: 'Engine Oil 10W-40 (SL)\nOIL-10W40', fromLoc: 'Main Storage A1\nRow 02 - Bay 01', toLoc: 'Dispatch Area\nRack 02', qty: '6', unit: 'Bottle', reason: 'Sales Order\nSO-66890', createdBy: 'Lisa Chen', status: 'Completed', statColor: '#10B981', statBg: '#D1FAE5' 
  }
];

export default function WarehouseStockMovements({ wh, onBack }) {
  const [showNewMovementModal, setShowNewMovementModal] = React.useState(false);

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
            <span>Home</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Inventory & Stock</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ color: '#0F172A' }}>Stock Movements</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>9.4 Stock Movements – {wh.name}</h1>
            <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0 0', fontWeight: 500 }}>Track and review all stock movements, transfers and adjustments in real time.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={onBack} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 14, fontWeight: 700, marginTop: -2 }}>‹</span> Back to Inventory & Stock
          </button>
          <button onClick={() => setShowNewMovementModal(true)} style={{ padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: '1px solid #E2E8F0', background: '#fff', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>+</span> New Stock Movement
          </button>
          <button style={{ padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            More Actions <span style={{ fontSize: 10 }}>▼</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS ROW */}
      <div className="wh-movements-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        
        {/* TOTAL MOVEMENTS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PackageIcon color="#8B5CF6" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>TOTAL MOVEMENTS</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2 }}>1,286</div>
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
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2 }}>542</div>
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
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2 }}>398</div>
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
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2 }}>208</div>
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
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2 }}>87</div>
            <div style={{ fontSize: 11, color: '#0F172A', fontWeight: 700, marginBottom: 6 }}>Movements</div>
            <div style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>View details <span style={{ fontSize: 12 }}>→</span></div>
          </div>
        </div>

      </div>

      {/* MAIN CONTAINER */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px', marginBottom: 24 }}>
        
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
            <button style={{ padding: '8px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <RefreshIcon />
            </button>
          </div>
        </div>

        {/* Split Content: Table & Sidebar */}
        <div className="wh-movements-split" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
          
          {/* LEFT: TABLE */}
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>STOCK MOVEMENTS (1,286)</h3>
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
                  {DUMMY_MOVEMENTS.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', background: '#fff' }}>
                      <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#0F172A', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{item.dateTime}</td>
                      <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 800, color: '#4F46E5', whiteSpace: 'nowrap' }}>{item.id}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: item.typeColor, background: item.typeBg, padding: '2px 8px', borderRadius: 4 }}>{item.type}</span>
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
                        <span style={{ fontSize: 10, fontWeight: 700, color: item.statColor, background: item.statBg, padding: '2px 8px', borderRadius: 4 }}>{item.status}</span>
                      </td>
                      <td style={{ padding: '12px 16px', display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button style={{ width: 24, height: 24, borderRadius: 4, background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <EyeIcon />
                        </button>
                        <button style={{ width: 24, height: 24, borderRadius: 4, background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <MoreHorizontalIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid #E2E8F0', background: '#fff' }}>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Showing 1 to 10 of 1,286 movements</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', cursor: 'pointer' }}>&lt;</button>
                  <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #4F46E5', background: '#EEF2FF', color: '#4F46E5', fontWeight: 600, cursor: 'pointer' }}>1</button>
                  <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', color: '#0F172A', cursor: 'pointer' }}>2</button>
                  <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', color: '#0F172A', cursor: 'pointer' }}>3</button>
                  <span style={{ padding: '4px 2px', color: '#64748B' }}>...</span>
                  <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', color: '#0F172A', cursor: 'pointer' }}>129</button>
                  <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', cursor: 'pointer' }}>&gt;</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <select style={{ padding: '4px 24px 4px 8px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none', background: '#fff', appearance: 'none', backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>\')', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}>
                    <option>10 / page</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* MOVEMENT SUMMARY */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>MOVEMENT SUMMARY (THIS MONTH)</h3>
                <span style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>View Report →</span>
              </div>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, background: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StockInIcon color="#10B981" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Stock In</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>542 <span style={{ color: '#64748B', fontWeight: 500 }}>(42.2%)</span></div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StockOutIcon color="#F97316" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Stock Out</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>398 <span style={{ color: '#64748B', fontWeight: 500 }}>(31.0%)</span></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TransferSmallIcon color="#3B82F6" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Transfers</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>208 <span style={{ color: '#64748B', fontWeight: 500 }}>(16.2%)</span></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AdjustmentSmallIcon color="#8B5CF6" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Adjustments</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>87 <span style={{ color: '#64748B', fontWeight: 500 }}>(6.8%)</span></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CancelIcon color="#EF4444" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Cancelled</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>51 <span style={{ color: '#64748B', fontWeight: 500 }}>(4.0%)</span></div>
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', margin: '4px 0' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <PackageIcon color="#8B5CF6" />
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>Total Movements</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#4F46E5' }}>1,286</div>
                </div>

              </div>
            </div>

            {/* MOVEMENTS BY DAY CHART */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>MOVEMENTS BY DAY (THIS MONTH)</h3>
                <span style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>View Chart →</span>
              </div>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, background: '#fff', padding: '16px', position: 'relative' }}>
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
                    
                    {/* Data Points */}
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
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>TOP MOVED ITEMS</h3>
                <span style={{ fontSize: 10, color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>View Report →</span>
              </div>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, background: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                
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
            <div>
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

      {/* DEVELOPER NOTES */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ background: '#4F46E5', padding: '6px', borderRadius: 6, display: 'flex' }}>
            <CodeIcon />
          </div>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: '#4F46E5', letterSpacing: '0.5px', margin: 0 }}>DEVELOPER NOTES – STOCK MOVEMENTS</h2>
        </div>
        
        <div className="wh-devnotes-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
          
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>1</div>
              PURPOSE
            </h4>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
              <li>Track all inventory movements.</li>
              <li>Provide audit trail and accountability.</li>
              <li>Ensure stock accuracy and traceability.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>2</div>
              KEY FEATURES
            </h4>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
              <li>Record stock in, out, transfers and adjustments.</li>
              <li>Filter by type, location, date and status.</li>
              <li>View item, quantity, locations and reasons.</li>
              <li>Export and print movement records.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>3</div>
              AUTOMATION & ALERTS
            </h4>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
              <li>Auto-update stock levels on movement.</li>
              <li>Alert on negative stock and anomalies.</li>
              <li>Notify on large adjustments or cancellations.</li>
              <li>AI insights for unusual movement patterns.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>4</div>
              PERMISSIONS
            </h4>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
              <li><strong>Super Admin:</strong> Full access.</li>
              <li><strong>Admin/Manager:</strong> Create, edit, view all.</li>
              <li><strong>Warehouse Staff:</strong> View and create (based on role).</li>
              <li><strong>Dispatcher:</strong> View stock movements (read-only).</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>5</div>
              DATA SOURCES
            </h4>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
              <li>Inventory & Stock module.</li>
              <li>Purchase Orders & Receipts.</li>
              <li>Sales Orders / Pick Tasks.</li>
              <li>Stock Transfers & Adjustments.</li>
            </ul>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid #E2E8F0', fontSize: 11, color: '#64748B', fontWeight: 500 }}>
          <div style={{ color: '#4F46E5' }}>All times shown in your local time (AEST)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981' }}></span>
            Data auto-refreshes every 5 minutes
            <RefreshIcon />
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
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}><input type="radio" name="movType" defaultChecked /> Intra-Warehouse Transfer</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}><input type="radio" name="movType" /> Inter-Warehouse Transfer</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}><input type="radio" name="movType" /> Stock Adjustment</label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, background: '#F8FAFC', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: 13, color: '#0F172A' }}>Source</h4>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>Scan / Select Item</label>
                  <input type="text" placeholder="Barcode / SKU" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', marginBottom: 12 }} />
                  
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>From Location</label>
                  <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: '#fff' }}>
                    <option>Select Bin / Zone...</option>
                  </select>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: 13, color: '#0F172A' }}>Destination</h4>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>Quantity to Move</label>
                  <input type="number" placeholder="0" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', marginBottom: 12 }} />
                  
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>To Location</label>
                  <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: '#fff' }}>
                    <option>Select Bin / Zone...</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Assign Worker (Optional)</label>
                <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: '#fff' }}>
                  <option>Auto-assign nearest worker</option>
                  <option>Sarah Mitchell</option>
                  <option>James Patel</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button onClick={() => setShowNewMovementModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowNewMovementModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', background: '#4F46E5', color: '#fff', cursor: 'pointer' }}>Create Task</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
