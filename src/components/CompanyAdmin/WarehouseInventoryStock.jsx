import React, { useState } from 'react';

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
const ClipboardListIcon = ({ color, width = '24' }) => (
  <svg width={width} height={width} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path>
  </svg>
);
const AlertTriangleIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const XCircleIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);
const StarIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
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

const DUMMY_STOCK_ITEMS = [
  { code: 'CAR-001', name: 'Toyota Corolla 2022 (White)', cat: 'Vehicles', catColor: '#8B5CF6', catBg: '#F3E8FF', loc: 'Main Storage A1\nRow 01 - Bay 03', onHand: 12, reserved: 2, available: 10, unit: 'Each', unitCost: '$18,500.00', totalValue: '$222,000.00', status: 'Available', statColor: '#10B981', statBg: '#D1FAE5' },
  { code: 'PART-0456', name: 'Brake Pad Set - Front', cat: 'Auto Parts', catColor: '#3B82F6', catBg: '#DBEAFE', loc: 'Bulk Storage B1\nShelf 02', onHand: 250, reserved: 15, available: 235, unit: 'Set', unitCost: '$45.00', totalValue: '$11,250.00', status: 'Available', statColor: '#10B981', statBg: '#D1FAE5' },
  { code: 'OIL-10W40', name: 'Engine Oil 10W-40 (5L)', cat: 'Lubricants', catColor: '#F59E0B', catBg: '#FEF3C7', loc: 'Bulk Storage B2\nShelf 03', onHand: 180, reserved: 10, available: 170, unit: 'Bottle', unitCost: '$28.00', totalValue: '$5,040.00', status: 'Available', statColor: '#10B981', statBg: '#D1FAE5' },
  { code: 'TYRE-22570R16', name: 'Tyre 225/70R16', cat: 'Tyres', catColor: '#10B981', catBg: '#D1FAE5', loc: 'Tyre Rack C1\nLevel 01', onHand: 36, reserved: 6, available: 30, unit: 'Each', unitCost: '$165.00', totalValue: '$5,940.00', status: 'Available', statColor: '#10B981', statBg: '#D1FAE5' },
  { code: 'BAT-105D31R', name: 'Battery 105D31R', cat: 'Batteries', catColor: '#8B5CF6', catBg: '#F3E8FF', loc: 'Hazard Area D1\nCabinet 01', onHand: 20, reserved: 1, available: 19, unit: 'Each', unitCost: '$210.00', totalValue: '$4,200.00', status: 'Available', statColor: '#10B981', statBg: '#D1FAE5' },
  { code: 'FUEL-ADBLUE', name: 'AdBlue 20L', cat: 'Fluids', catColor: '#3B82F6', catBg: '#DBEAFE', loc: 'Bulk Storage B3\nTank Zone', onHand: 55, reserved: 5, available: 50, unit: 'Drum', unitCost: '$52.00', totalValue: '$2,860.00', status: 'Available', statColor: '#10B981', statBg: '#D1FAE5' },
  { code: 'STRAP-50MM', name: 'Ratchet Strap 50mm', cat: 'Equipment', catColor: '#06B6D4', catBg: '#CFFAFE', loc: 'Dispatch Area\nRack 02', onHand: 95, reserved: 20, available: 75, unit: 'Each', unitCost: '$18.00', totalValue: '$1,710.00', status: 'Available', statColor: '#10B981', statBg: '#D1FAE5' },
  { code: 'PAINT-WHT', name: 'Touch Up Paint (White)', cat: 'Consumables', catColor: '#EC4899', catBg: '#FCE7F3', loc: 'Dispatch Area\nCabinet 03', onHand: 12, reserved: 0, available: 12, unit: 'Tin', unitCost: '$15.00', totalValue: '$180.00', status: 'Available', statColor: '#10B981', statBg: '#D1FAE5' },
  { code: 'FILTER-OIL', name: 'Oil Filter', cat: 'Auto Parts', catColor: '#3B82F6', catBg: '#DBEAFE', loc: 'Bulk Storage B1\nShelf 04', onHand: 0, reserved: 5, available: -5, unit: 'Each', unitCost: '$20.00', totalValue: '$0.00', status: 'Out of Stock', statColor: '#EF4444', statBg: '#FEE2E2' },
  { code: 'COOLANT-5L', name: 'Coolant 5L', cat: 'Fluids', catColor: '#F59E0B', catBg: '#FEF3C7', loc: 'Bulk Storage B3\nShelf 01', onHand: 8, reserved: 2, available: 6, unit: 'Bottle', unitCost: '$22.00', totalValue: '$176.00', status: 'Low Stock', statColor: '#F59E0B', statBg: '#FEF3C7' },
];

export default function WarehouseInventoryStock({ wh, onBack }) {
  const [activeTab, setActiveTab] = useState('Stock List');
  const [showAddStockModal, setShowAddStockModal] = useState(false);

  return (
    <div className="wh-inventory-container" style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 32px', fontFamily: "'Inter','Outfit',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 900px) {
          .wh-inventory-container { padding: 16px !important; }
          .wh-inventory-split { grid-template-columns: 1fr !important; gap: 20px !important; }
          .wh-devnotes-cols { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, display: 'flex', gap: 6 }}>
            <span>Home</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse Details</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ color: '#0F172A' }}>Inventory & Stock</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>9.3 Inventory & Stock - {wh.name}</h1>
            <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0 0', fontWeight: 500 }}>View, search and manage all inventory items, stock levels, locations and availability.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={onBack} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            &lt; Back to Warehouse Details
          </button>
          <button onClick={() => setShowAddStockModal(true)} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Stock Item
          </button>
          <button style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            More Actions <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
        </div>
      </div>

      {/* 6 TOP METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        
        {/* TOTAL ITEMS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ClipboardListIcon color="#8B5CF6" />
          </div>
          <div style={{ flex: '1 1 100px', minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>TOTAL ITEMS</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>4,125</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>All items in stock</div>
          </div>
        </div>

        {/* TOTAL STOCK VALUE */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          </div>
          <div style={{ flex: '1 1 100px', minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>TOTAL STOCK VALUE</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>$1,256,850.00</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Across all locations</div>
          </div>
        </div>

        {/* AVAILABLE STOCK */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PackageIcon color="#3B82F6" />
          </div>
          <div style={{ flex: '1 1 100px', minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>AVAILABLE STOCK</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>3,145</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>76.3% of total stock</div>
          </div>
        </div>

        {/* LOW STOCK ITEMS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangleIcon color="#F59E0B" />
          </div>
          <div style={{ flex: '1 1 100px', minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>LOW STOCK ITEMS</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>128</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Reorder required</div>
          </div>
        </div>

        {/* OUT OF STOCK ITEMS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <XCircleIcon color="#EF4444" />
          </div>
          <div style={{ flex: '1 1 100px', minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>OUT OF STOCK ITEMS</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>17</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>No stock available</div>
          </div>
        </div>

        {/* SPECIAL ITEMS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <StarIcon color="#8B5CF6" />
          </div>
          <div style={{ flex: '1 1 100px', minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>SPECIAL ITEMS</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>86</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Haz / DG / Controlled</div>
          </div>
        </div>

      </div>

      {/* MAIN CONTAINER */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px 24px 0 24px', marginBottom: 24 }}>
        


        {activeTab === 'Stock List' && (
          <>
            {/* Filters Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
                  <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
                    <SearchIcon />
                  </div>
                  <input type="text" placeholder="Search by item name, code or SKU..." style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none', color: '#0F172A', fontWeight: 500 }} />
                </div>
                
                {['All Categories', 'All Locations', 'All Status', 'All Item Types'].map(placeholder => (
                  <select key={placeholder} style={{ flexShrink: 0, padding: '8px 32px 8px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none', color: '#0F172A', fontWeight: 600, background: '#fff', appearance: 'none', backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>\')', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                    <option>{placeholder}</option>
                  </select>
                ))}
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
            <div className="wh-inventory-split" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, paddingBottom: 24 }}>
              
              {/* LEFT: TABLE */}
              <div>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>STOCK ITEMS (4,125)</h3>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <tr>
                        <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Item Code</th>
                        <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Item Name</th>
                        <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Category</th>
                        <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Location</th>
                        <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>On Hand</th>
                        <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Reserved</th>
                        <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Available</th>
                        <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Unit</th>
                        <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Unit Cost (AUD)</th>
                        <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Value (AUD)</th>
                        <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DUMMY_STOCK_ITEMS.map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', background: '#fff' }}>
                          <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 800, color: '#4F46E5', whiteSpace: 'nowrap' }}>{item.code}</td>
                          <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>{item.name}</td>
                          <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: item.catColor, background: item.catBg, padding: '2px 8px', borderRadius: 4 }}>{item.cat}</span>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 11, color: '#475569', fontWeight: 500, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{item.loc}</td>
                          <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 800, color: '#0F172A' }}>{item.onHand}</td>
                          <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748B' }}>{item.reserved}</td>
                          <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 800, color: item.available < 0 ? '#EF4444' : (item.available < 10 ? '#F59E0B' : '#10B981') }}>{item.available}</td>
                          <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#475569' }}>{item.unit}</td>
                          <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{item.unitCost}</td>
                          <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{item.totalValue}</td>
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
                  <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', background: '#fff' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Showing 1 to 10 of 4,125 items</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#64748B', fontWeight: 600 }}>&lt;</button>
                      <button style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #C7D2FE', background: '#EEF2FF', cursor: 'pointer', color: '#4F46E5', fontWeight: 800 }}>1</button>
                      <button style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#0F172A', fontWeight: 600 }}>2</button>
                      <button style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#0F172A', fontWeight: 600 }}>3</button>
                      <div style={{ padding: '4px 6px', color: '#64748B' }}>...</div>
                      <button style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#0F172A', fontWeight: 600 }}>413</button>
                      <button style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#64748B', fontWeight: 600 }}>&gt;</button>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <select style={{ padding: '4px 20px 4px 8px', borderRadius: 4, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none', color: '#0F172A', fontWeight: 600, appearance: 'none', backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="%2364748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>\')', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center' }}>
                        <option>10 / page</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: SUMMARY PANELS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* STOCK SUMMARY */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>STOCK SUMMARY</h3>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px', background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ClipboardListIcon color="#8B5CF6" width="12" /></div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#64748B' }}>Total Items</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#0F172A' }}>4,125</div>
                    </div>
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px', background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PackageIcon color="#4F46E5" /></div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#64748B' }}>Total Units</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#0F172A' }}>8,765</div>
                    </div>
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px', background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#10B981', fontWeight: 800, fontSize: 10 }}>$</span></div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#64748B' }}>Total Stock Value</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#0F172A' }}>$1,256,850.00</div>
                    </div>
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px', background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#10B981', fontWeight: 800, fontSize: 10 }}>$</span></div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#64748B' }}>Avg Unit Cost</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#0F172A' }}>$143.43</div>
                    </div>
                  </div>
                </div>

                {/* STOCK BY CATEGORY */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>STOCK BY CATEGORY</h3>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View Chart →</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'conic-gradient(#8B5CF6 0% 12.6%, #3B82F6 12.6% 47.4%, #F59E0B 47.4% 62.8%, #10B981 62.8% 74.7%, #06B6D4 74.7% 84.8%, #EC4899 84.8% 100%)', position: 'relative', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', inset: 16, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>4,125</span>
                        <span style={{ fontSize: 8, fontWeight: 700, color: '#64748B' }}>Total Items</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                      {[
                        { label: 'Vehicles', color: '#8B5CF6', pct: '12.6%', count: '520' },
                        { label: 'Auto Parts', color: '#3B82F6', pct: '34.8%', count: '1,435' },
                        { label: 'Lubricants', color: '#F59E0B', pct: '15.4%', count: '634' },
                        { label: 'Tyres', color: '#10B981', pct: '11.9%', count: '490' },
                        { label: 'Equipment', color: '#06B6D4', pct: '10.1%', count: '416' },
                        { label: 'Others', color: '#EC4899', pct: '15.2%', count: '630' },
                      ].map(cat => (
                        <div key={cat.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color }}></div>
                            <span style={{ color: '#475569' }}>{cat.label}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <span style={{ color: '#0F172A' }}>{cat.pct}</span>
                            <span style={{ color: '#94A3B8' }}>({cat.count})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* STOCK STATUS */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>STOCK STATUS</h3>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View Chart →</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Available', color: '#10B981', val: 76.3, text: '3,145 (76.3%)' },
                      { label: 'Reserved', color: '#3B82F6', val: 17.5, text: '720 (17.5%)' },
                      { label: 'Low Stock', color: '#F59E0B', val: 3.1, text: '128 (3.1%)' },
                      { label: 'Out of Stock', color: '#EF4444', val: 0.4, text: '17 (0.4%)' },
                      { label: 'On Order', color: '#8B5CF6', val: 2.7, text: '115 (2.7%)' },
                    ].map(stat => (
                      <div key={stat.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 600, marginBottom: 4 }}>
                          <span style={{ color: '#475569' }}>{stat.label}</span>
                          <span style={{ color: '#0F172A' }}>{stat.text}</span>
                        </div>
                        <div style={{ height: 4, background: '#F1F5F9', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: stat.color, width: `${stat.val}%`, borderRadius: 2 }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RECENT STOCK MOVEMENTS */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>RECENT STOCK MOVEMENTS</h3>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View All →</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { title: 'Stock Received', desc: 'Car Battery 105D31R', date: '10 May 2025', icon: <PackageIcon color="#10B981" />, bg: '#D1FAE5' },
                      { title: 'Stock Issued', desc: 'Brake Pad Set - Front', date: '10 May 2025', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>, bg: '#FEE2E2' },
                      { title: 'Stock Transfer', desc: 'Engine Oil 10W-40 (5L)', date: '09 May 2025', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>, bg: '#DBEAFE' },
                      { title: 'Stock Adjustment', desc: 'Tyre 225/70R16', date: '09 May 2025', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>, bg: '#FEF3C7' },
                      { title: 'Stock Reserved', desc: 'Toyota Corolla 2022 (White)', date: '08 May 2025', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>, bg: '#FEE2E2' },
                    ].map((mov, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: mov.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 4 }}>
                          {React.cloneElement(mov.icon, { width: '16', height: '16' })}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{mov.title}</span>
                            <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>{mov.date}</span>
                          </div>
                          <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>{mov.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </div>

      {/* DEVELOPER NOTES */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: '#4F46E5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CodeIcon />
          </div>
          <h3 style={{ fontSize: 12, fontWeight: 900, color: '#1E293B', margin: 0, letterSpacing: '0.5px' }}>DEVELOPER NOTES - INVENTORY & STOCK</h3>
        </div>
        <div className="wh-devnotes-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
              <h4 style={{ fontSize: 10, fontWeight: 800, color: '#1E293B', letterSpacing: '0.5px', margin: 0 }}>PURPOSE</h4>
            </div>
            <ul style={{ paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Central inventory and stock management.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Real-time stock visibility and valuation.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Support for multiple locations and categories.</li>
            </ul>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
              <h4 style={{ fontSize: 10, fontWeight: 800, color: '#1E293B', letterSpacing: '0.5px', margin: 0 }}>KEY FEATURES</h4>
            </div>
            <ul style={{ paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Search, filter and sort stock items.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Stock levels: on hand, reserved, available.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Low stock and out of stock alerts.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Stock valuation and cost tracking.</li>
            </ul>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
              <h4 style={{ fontSize: 10, fontWeight: 800, color: '#1E293B', letterSpacing: '0.5px', margin: 0 }}>AUTOMATION & ALERTS</h4>
            </div>
            <ul style={{ paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Auto-alert on low stock and out of stock.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Expiry alerts for perishable/dated items.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Min/max level monitoring and reorder suggestions.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>AI insights for demand and stock trends.</li>
            </ul>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</div>
              <h4 style={{ fontSize: 10, fontWeight: 800, color: '#1E293B', letterSpacing: '0.5px', margin: 0 }}>PERMISSIONS</h4>
            </div>
            <ul style={{ paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Super Admin: Full access.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Admin/Manager: Full access.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Warehouse Staff: View & manage own location.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Dispatcher: View stock availability only.</li>
            </ul>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>5</div>
              <h4 style={{ fontSize: 10, fontWeight: 800, color: '#1E293B', letterSpacing: '0.5px', margin: 0 }}>DATA SOURCES</h4>
            </div>
            <ul style={{ paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Warehouse module.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Purchase Orders & Receipts.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Stock Transfers & Adjustments.</li>
              <li style={{ fontSize: 10, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>Sales/Loads & Reservations.</li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 10, color: '#4F46E5', fontWeight: 600 }}>All times shown in your local time (AEST)</div>
          <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981' }}></div>
            Data auto-refreshes every 5 minutes <RefreshIcon />
          </div>
        </div>
      </div>

      {/* ADD STOCK ITEM MODAL */}
      {showAddStockModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)' }} onClick={() => setShowAddStockModal(false)}></div>
          <div style={{ background: '#fff', width: '600px', borderRadius: 16, padding: '32px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 20, fontWeight: 800, color: '#0F172A' }}>Add New Stock Item / SKU</h2>
            
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>SKU Code</label>
                  <input type="text" placeholder="Scan or type SKU..." style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Category</label>
                  <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option>Select Category...</option>
                    <option>Auto Parts</option>
                    <option>Fluids</option>
                    <option>Equipment</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Product Name / Description</label>
                <input type="text" placeholder="e.g. Synthetic Motor Oil 5W-30" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Initial Qty</label>
                  <input type="number" placeholder="0" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Unit Cost</label>
                  <input type="number" placeholder="$0.00" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Low Stock Alert</label>
                  <input type="number" placeholder="Threshold" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Default Location</label>
                <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                  <option>Assign to Zone / Bin...</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button onClick={() => setShowAddStockModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowAddStockModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', background: '#4F46E5', color: '#fff', cursor: 'pointer' }}>Add to Inventory</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
