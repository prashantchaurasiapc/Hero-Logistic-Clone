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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const PencilEditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
const TrashDeleteIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
const MoreHorizontalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>
  </svg>
);
const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

export default function WarehouseInventoryStock({ wh, onBack }) {
  const [stockItems, setStockItems] = useState([]);
  const [activeTab, setActiveTab] = useState('Stock List');
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [viewStockItemModal, setViewStockItemModal] = useState(null);
  const [editStockItemModal, setEditStockItemModal] = useState(null);
  const [actionMenuIndex, setActionMenuIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchStock = async () => {
    try {
      setLoading(true);
      const whId = wh?.id || 'default';
      const res = await api.get(`/company-admin/warehouse/${whId}/sub/stock`);
      if (res.data && res.data.success) {
        setStockItems(res.data.data.items || []);
      }
    } catch (e) {
      console.error('Fetch stock error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [wh?.id]);

  // --- Add Stock Form State ---
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formName, setFormName] = useState('');
  const [formQty, setFormQty] = useState(0);
  const [formUnitCost, setFormUnitCost] = useState(0);
  const [formLowStock, setFormLowStock] = useState(0);
  const [formLocation, setFormLocation] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const resetForm = () => {
    setFormSku(''); setFormCategory(''); setFormName('');
    setFormQty(0); setFormUnitCost(0); setFormLowStock(0); setFormLocation('');
  };

  const handleAddStock = async () => {
    if (!formName.trim()) { showToast('âš ï¸ Product name is required'); return; }
    if (!formSku.trim()) { showToast('âš ï¸ SKU Code is required'); return; }
    setFormSubmitting(true);
    try {
      const whId = wh?.id || 'default';
      const payload = {
        code: formSku.trim(),
        name: formName.trim(),
        cat: formCategory || 'General',
        catColor: '#3B82F6',
        catBg: '#EFF6FF',
        loc: formLocation || 'Main Warehouse',
        onHand: parseInt(formQty) || 0,
        reserved: 0,
        available: parseInt(formQty) || 0,
        unit: 'EA',
        unitCost: `$${parseFloat(formUnitCost || 0).toFixed(2)}`,
        totalValue: `$${(parseFloat(formUnitCost || 0) * (parseInt(formQty) || 0)).toFixed(2)}`,
        lowStock: parseInt(formLowStock) || 0,
        status: parseInt(formQty) > 0 ? 'In Stock' : 'Out of Stock',
        statusColor: parseInt(formQty) > 0 ? '#10B981' : '#EF4444',
        statusBg: parseInt(formQty) > 0 ? '#D1FAE5' : '#FEE2E2',
        warehouseId: whId
      };

      try {
        const res = await api.post(`/company-admin/warehouse/${whId}/sub/stock`, payload);
        if (res.data && res.data.success && res.data.data) {
          setStockItems(prev => [res.data.data, ...prev]);
        } else {
          setStockItems(prev => [payload, ...prev]);
        }
      } catch (err) {
        console.warn('API save note, adding locally:', err.message);
        setStockItems(prev => [{ ...payload, id: Date.now().toString() }, ...prev]);
      }

      showToast(`âœ“ "${formName}" added to inventory!`);
      resetForm();
      setShowAddStockModal(false);
    } catch (e) {
      console.error('Add stock error:', e);
      showToast('âŒ Failed to add stock item');
    } finally {
      setFormSubmitting(false);
    }
  };


  return (
    <div className="wh-inventory-container" style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 32px', fontFamily: "'Inter','Outfit',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        .wh-panel { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; }
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
            <span>Home</span> <span style={{ color: '#CBD5E1' }}>â€º</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>â€º</span> <span style={{ cursor: 'pointer' }} onClick={onBack}>Warehouse Details</span> <span style={{ color: '#CBD5E1' }}>â€º</span> <span style={{ color: '#0F172A' }}>Inventory & Stock</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Inventory & Stock - {wh.name}</h1>
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
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, background: '#0F172A', color: '#fff', padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          {toastMessage}
        </div>
      )}

      {/* 6 TOP METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        
        {/* TOTAL ITEMS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ClipboardListIcon color="#8B5CF6" />
          </div>
          <div style={{ flex: '1 1 100px', minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>TOTAL ITEMS</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{stockItems.length}</div>
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
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>$0.00</div>
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
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>0</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>0.0% of total stock</div>
          </div>
        </div>

        {/* LOW STOCK ITEMS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangleIcon color="#F59E0B" />
          </div>
          <div style={{ flex: '1 1 100px', minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>LOW STOCK ITEMS</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>0</div>
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
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>0</div>
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
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>0</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Haz / DG / Controlled</div>
          </div>
        </div>

      </div>

      {/* MAIN CONTAINER */}
      <div style={{ marginBottom: 24 }}>
        
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
                <button onClick={fetchStock} style={{ padding: '8px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <RefreshIcon />
                </button>
              </div>
            </div>

            {/* Split Content: Table & Sidebar */}
            <div className="wh-inventory-split" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, paddingBottom: 24 }}>
              
              {/* LEFT: TABLE */}
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>STOCK ITEMS ({stockItems.length})</h3>
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
                      {stockItems.length > 0 ? (
                        stockItems.map((item, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', background: '#fff' }}>
                            <td style={{ padding: '12px 16px', fontSize: 11, fontWeight: 800, color: '#4F46E5', whiteSpace: 'nowrap' }}>{item.code}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>{item.name}</td>
                            <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: item.catColor || '#4F46E5', background: item.catBg || '#EEF2FF', padding: '2px 8px', borderRadius: 4 }}>{item.cat || 'General'}</span>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: 11, color: '#475569', fontWeight: 500, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{item.loc || 'Unassigned'}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 800, color: '#0F172A' }}>{item.onHand || 0}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748B' }}>{item.reserved || 0}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 800, color: '#10B981' }}>{item.available || 0}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#475569' }}>{item.unit || 'Each'}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{item.unitCost || '$0.00'}</td>
                            <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{item.totalValue || '$0.00'}</td>
                            <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#10B981', background: '#D1FAE5', padding: '2px 8px', borderRadius: 4 }}>{item.status || 'Available'}</span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <button onClick={() => setViewStockItemModal(item)} style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer' }}><EyeIcon /></button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="12" style={{ padding: '32px 16px', textAlign: 'center', color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>
                            No stock items registered in this warehouse. Click "Add Stock Item" to register new stock.
                          </td>
                        </tr>
                      )}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* STOCK SUMMARY */}
                <div className="wh-panel">
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
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#0F172A' }}>{stockItems.length.toLocaleString()}</div>
                    </div>
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px', background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PackageIcon color="#4F46E5" /></div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#64748B' }}>Total Units</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#0F172A' }}>{stockItems.reduce((s, i) => s + (parseInt(i.onHand) || 0), 0).toLocaleString()}</div>
                    </div>
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px', background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#10B981', fontWeight: 800, fontSize: 10 }}>$</span></div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#64748B' }}>Total Stock Value</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#0F172A' }}>${stockItems.reduce((s, i) => { const c = parseFloat((i.unitCost||'0').toString().replace('$','').replace(',',''))||0; return s + c*(parseInt(i.onHand)||0); }, 0).toLocaleString('en-AU',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
                    </div>
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px', background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#10B981', fontWeight: 800, fontSize: 10 }}>$</span></div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#64748B' }}>Avg Unit Cost</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#0F172A' }}>{stockItems.length === 0 ? '$0.00' : '$' + (stockItems.reduce((s,i)=>{const c=parseFloat((i.unitCost||'0').toString().replace('$','').replace(',',''))||0;return s+c*(parseInt(i.onHand)||0);},0)/stockItems.length).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* STOCK BY CATEGORY */}
                <div className="wh-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>STOCK BY CATEGORY</h3>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View Chart →</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: stockItems.length === 0 ? '#E2E8F0' : '#4F46E5', position: 'relative', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', inset: 16, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{stockItems.length}</span>
                        <span style={{ fontSize: 8, fontWeight: 700, color: '#64748B' }}>Total</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                      {stockItems.length === 0 ? (
                        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>No items yet</div>
                      ) : (
                        Object.entries(stockItems.reduce((acc, item) => { const cat = item.cat || 'General'; acc[cat] = (acc[cat] || 0) + 1; return acc; }, {})).slice(0, 6).map(([label, count], i) => {
                          const clrs = ['#8B5CF6','#3B82F6','#F59E0B','#10B981','#06B6D4','#EC4899'];
                          const pct = ((count / stockItems.length) * 100).toFixed(1);
                          return (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, fontWeight: 600 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: clrs[i % 6] }}></div>
                                <span style={{ color: '#475569' }}>{label}</span>
                              </div>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <span style={{ color: '#0F172A' }}>{pct}%</span>
                                <span style={{ color: '#94A3B8' }}>({count})</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* STOCK STATUS */}
                <div className="wh-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>STOCK STATUS</h3>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View Chart →</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'In Stock', color: '#10B981', count: stockItems.filter(i => i.status === 'In Stock').length },
                      { label: 'Reserved', color: '#3B82F6', count: stockItems.filter(i => i.status === 'Reserved').length },
                      { label: 'Low Stock', color: '#F59E0B', count: stockItems.filter(i => i.status === 'Low Stock').length },
                      { label: 'Out of Stock', color: '#EF4444', count: stockItems.filter(i => i.status === 'Out of Stock').length },
                    ].map(stat => {
                      const pct = stockItems.length > 0 ? ((stat.count / stockItems.length) * 100).toFixed(1) : '0.0';
                      return (
                        <div key={stat.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 600, marginBottom: 4 }}>
                            <span style={{ color: '#475569' }}>{stat.label}</span>
                            <span style={{ color: '#0F172A' }}>{stat.count} ({pct}%)</span>
                          </div>
                          <div style={{ height: 4, background: '#F1F5F9', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: stat.color, width: `${pct}%`, borderRadius: 2 }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RECENT ADDITIONS */}
                <div className="wh-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>RECENT ADDITIONS</h3>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View All →</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {stockItems.length > 0 ? stockItems.slice(0, 5).map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <PackageIcon color="#10B981" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginTop: 2 }}>
                            {item.code} • Qty: {item.onHand || 0} • <span style={{ color: item.statusColor || '#10B981' }}>{item.status || 'In Stock'}</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, textAlign: 'center', padding: '12px 0' }}>No stock items added yet</div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>SKU Code *</label>
                  <input type="text" value={formSku} onChange={e => setFormSku(e.target.value)} placeholder="Scan or type SKU..." style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Category</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option value="">Select Category...</option>
                    <option value="Auto Parts">Auto Parts</option>
                    <option value="Fluids">Fluids</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Tyres">Tyres</option>
                    <option value="Accessories">Accessories</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Product Name / Description *</label>
                <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Synthetic Motor Oil 5W-30" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Initial Qty</label>
                  <input type="number" min="0" value={formQty} onChange={e => setFormQty(e.target.value)} placeholder="0" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Unit Cost ($)</label>
                  <input type="number" min="0" step="0.01" value={formUnitCost} onChange={e => setFormUnitCost(e.target.value)} placeholder="0.00" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Low Stock Alert</label>
                  <input type="number" min="0" value={formLowStock} onChange={e => setFormLowStock(e.target.value)} placeholder="Threshold" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Default Location</label>
                <select value={formLocation} onChange={e => setFormLocation(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                  <option value="">Assign to Zone / Bin...</option>
                  <option value="Zone A - Row 01">Zone A - Row 01</option>
                  <option value="Zone A - Row 02">Zone A - Row 02</option>
                  <option value="Zone B - Row 01">Zone B - Row 01</option>
                  <option value="Zone B - Row 02">Zone B - Row 02</option>
                  <option value="Cold Storage">Cold Storage</option>
                  <option value="Main Warehouse">Main Warehouse</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button onClick={() => { resetForm(); setShowAddStockModal(false); }} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAddStock} disabled={formSubmitting} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', background: formSubmitting ? '#A5B4FC' : '#4F46E5', color: '#fff', cursor: formSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                {formSubmitting ? 'Saving...' : '+ Add to Inventory'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW ITEM MODAL */}
      {viewStockItemModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)' }} onClick={() => setViewStockItemModal(null)}></div>
          <div style={{ background: '#fff', width: '480px', borderRadius: 16, padding: '24px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                <EyeIcon /> Item Details â€“ {viewStockItemModal.code}
              </h2>
              <button onClick={() => setViewStockItemModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#64748B' }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gap: 12, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: 6 }}>
                <span style={{ fontWeight: 600, color: '#64748B' }}>Item Name:</span>
                <span style={{ fontWeight: 800, color: '#0F172A' }}>{viewStockItemModal.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: 6 }}>
                <span style={{ fontWeight: 600, color: '#64748B' }}>Category:</span>
                <span style={{ fontWeight: 700, color: viewStockItemModal.catColor }}>{viewStockItemModal.cat}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: 6 }}>
                <span style={{ fontWeight: 600, color: '#64748B' }}>Location:</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{viewStockItemModal.loc}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div style={{ textAlign: 'center', padding: 8, background: '#EFF6FF', borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: '#3B82F6', fontWeight: 700 }}>On Hand</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#1E40AF' }}>{viewStockItemModal.onHand}</div>
                </div>
                <div style={{ textAlign: 'center', padding: 8, background: '#FEF3C7', borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: '#D97706', fontWeight: 700 }}>Reserved</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#92400E' }}>{viewStockItemModal.reserved}</div>
                </div>
                <div style={{ textAlign: 'center', padding: 8, background: '#D1FAE5', borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: '#059669', fontWeight: 700 }}>Available</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#065F46' }}>{viewStockItemModal.available}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: 6 }}>
                <span style={{ fontWeight: 600, color: '#64748B' }}>Unit Cost / Total Value:</span>
                <span style={{ fontWeight: 800, color: '#0F172A' }}>{viewStockItemModal.unitCost} / {viewStockItemModal.totalValue}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setViewStockItemModal(null)} style={{ padding: '8px 16px', borderRadius: 6, background: '#4F46E5', color: '#fff', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {editStockItemModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)' }} onClick={() => setEditStockItemModal(null)}></div>
          <div style={{ background: '#fff', width: '480px', borderRadius: 16, padding: '24px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                <PencilEditIcon /> Edit Stock Item ({editStockItemModal.code})
              </h2>
              <button onClick={() => setEditStockItemModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#64748B' }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gap: 12, fontSize: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Item Name *</label>
                <input type="text" value={editStockItemModal.name || ''} onChange={e => setEditStockItemModal({ ...editStockItemModal, name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Category</label>
                  <input type="text" value={editStockItemModal.cat || ''} onChange={e => setEditStockItemModal({ ...editStockItemModal, cat: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Status</label>
                  <select value={editStockItemModal.status || 'In Stock'} onChange={e => setEditStockItemModal({ ...editStockItemModal, status: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>On Hand</label>
                  <input type="number" value={editStockItemModal.onHand || 0} onChange={e => {
                    const oh = parseInt(e.target.value) || 0;
                    const res = editStockItemModal.reserved || 0;
                    setEditStockItemModal({ ...editStockItemModal, onHand: oh, available: oh - res });
                  }} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Reserved</label>
                  <input type="number" value={editStockItemModal.reserved || 0} onChange={e => {
                    const res = parseInt(e.target.value) || 0;
                    const oh = editStockItemModal.onHand || 0;
                    setEditStockItemModal({ ...editStockItemModal, reserved: res, available: oh - res });
                  }} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Unit</label>
                  <input type="text" value={editStockItemModal.unit || ''} onChange={e => setEditStockItemModal({ ...editStockItemModal, unit: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button onClick={() => setEditStockItemModal(null)} style={{ padding: '8px 16px', borderRadius: 6, background: '#fff', color: '#64748B', border: '1px solid #CBD5E1', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => {
                setStockItems(prev => prev.map(s => s.code === editStockItemModal.code ? editStockItemModal : s));
                setEditStockItemModal(null);
              }} style={{ padding: '8px 16px', borderRadius: 6, background: '#4F46E5', color: '#fff', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 10000, background: '#0F172A', color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #334155' }}>
          <span style={{ color: '#22C55E' }}>âœ“</span> {toastMessage}
        </div>
      )}

    </div>
  );
}
