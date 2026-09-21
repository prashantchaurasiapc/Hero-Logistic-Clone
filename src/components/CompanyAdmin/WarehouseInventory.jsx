import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiBox, FiSearch, FiFilter, FiDownload, FiMapPin, FiCheckCircle, FiClock, FiAlertCircle, FiX, FiCheck, FiRefreshCw } from 'react-icons/fi';

const styles = `
  .wh-inventory-page { padding: 24px 32px; background: #F8FAFC; min-height: 100vh; font-family: 'Inter', sans-serif; position: relative; }
  .wh-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .wh-header h1 { font-size: 24px; font-weight: 700; color: #0F172A; margin: 0; display: flex; align-items: center; gap: 10px; }
  .wh-header-actions { display: flex; gap: 12px; }
  .wh-btn { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
  .wh-btn-outline { background: #fff; border: 1px solid #CBD5E1; color: #334155; }
  .wh-btn-outline:hover { background: #F1F5F9; border-color: #94A3B8; }
  .wh-btn-primary { background: #7C3AED; color: #fff; }
  .wh-btn-primary:hover { background: #6D28D9; }
  .filter-active-badge { background: #7C3AED; color: #fff; border-radius: 12px; padding: 2px 7px; font-size: 11px; font-weight: 700; margin-left: 4px; }
  
  .wh-metrics-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .wh-metric { background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #E2E8F0; display: flex; align-items: center; gap: 16px; }
  .wh-metric-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
  .wh-metric-info h3 { margin: 0; font-size: 13px; color: #64748B; font-weight: 600; text-transform: uppercase; }
  .wh-metric-info p { margin: 4px 0 0; font-size: 24px; font-weight: 700; color: #0F172A; }

  .wh-card { background: #fff; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; }
  .wh-toolbar { padding: 16px; border-bottom: 1px solid #E2E8F0; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
  .wh-search { flex: 1; min-width: 280px; position: relative; }
  .wh-search input { width: 100%; padding: 10px 16px 10px 40px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s; }
  .wh-search input:focus { border-color: #7C3AED; }
  .wh-search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94A3B8; }

  .active-filter-chips { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; padding: 10px 16px; background: #FAF5FF; border-bottom: 1px solid #F3E8FF; }
  .filter-chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: #EFF6FF; border: 1px solid #BFDBFE; color: #1E40AF; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .filter-chip-remove { cursor: pointer; font-size: 14px; display: flex; align-items: center; opacity: 0.7; }
  .filter-chip-remove:hover { opacity: 1; color: #EF4444; }
  .clear-all-link { font-size: 12px; color: #7C3AED; font-weight: 700; text-decoration: underline; cursor: pointer; margin-left: 6px; }

  .wh-table { width: 100%; border-collapse: collapse; }
  .wh-table th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748B; text-transform: uppercase; border-bottom: 1px solid #E2E8F0; background: #F8FAFC; }
  .wh-table td { padding: 16px; border-bottom: 1px solid #F1F5F9; font-size: 14px; color: #334155; vertical-align: middle; }
  .wh-table tr:hover td { background: #F8FAFC; }
  
  .stock-badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
  .stock-in { background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; }
  .stock-low { background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }
  .stock-out { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; }

  /* Modal Overlay */
  .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(3px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .modal-box { background: #fff; width: 100%; max-width: 520px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); overflow: hidden; border: 1px solid #E2E8F0; }
  .modal-header { padding: 18px 24px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; }
  .modal-header h2 { margin: 0; font-size: 16px; font-weight: 700; color: #0F172A; display: flex; align-items: center; gap: 8px; }
  .modal-close { background: none; border: none; font-size: 20px; color: #94A3B8; cursor: pointer; padding: 4px; border-radius: 6px; }
  .modal-close:hover { color: #0F172A; background: #E2E8F0; }
  .modal-body { padding: 24px; space-y: 16px; }
  .filter-group { margin-bottom: 16px; }
  .filter-group label { display: block; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px; }
  .filter-group select { width: 100%; padding: 10px 14px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 14px; color: #0F172A; outline: none; background: #fff; font-weight: 600; }
  .filter-group select:focus { border-color: #7C3AED; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid #E2E8F0; display: flex; justify-content: flex-end; gap: 12px; background: #F8FAFC; }

  /* Toast notification */
  .wh-toast { position: fixed; bottom: 24px; right: 24px; background: #0F172A; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); z-index: 10000; animation: slideUp 0.2s ease-out; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

const WarehouseInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Filter States
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [warehouseFilter, setWarehouseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [zoneFilter, setZoneFilter] = useState('ALL');

  // Temp filter states for modal
  const [tempWarehouse, setTempWarehouse] = useState('ALL');
  const [tempStatus, setTempStatus] = useState('ALL');
  const [tempZone, setTempZone] = useState('ALL');

  // Toast state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/warehouse-inventory');
      if (res.data && res.data.success) {
        setInventory(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Unique list of Warehouses & Zones for Filter dropdowns
  const availableWarehouses = Array.from(
    new Set(inventory.map(item => item.warehouse?.name || 'Unassigned').filter(Boolean))
  );

  const availableZones = Array.from(
    new Set(inventory.map(item => item.zone || 'General').filter(Boolean))
  );

  // Filter Logic
  const filteredInventory = inventory.filter(item => {
    // 1. Search Query Filter
    const matchesSearch = 
      (item.sku || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.warehouse?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Warehouse Filter
    if (warehouseFilter !== 'ALL') {
      const whName = item.warehouse?.name || 'Unassigned';
      if (whName !== warehouseFilter) return false;
    }

    // 3. Status Filter
    if (statusFilter !== 'ALL') {
      const qty = item.quantity || 0;
      const minQty = item.minQuantity || 5;
      if (statusFilter === 'IN_STOCK' && qty <= 0) return false;
      if (statusFilter === 'LOW_STOCK' && (qty <= 0 || qty >= minQty)) return false;
      if (statusFilter === 'OUT_OF_STOCK' && qty > 0) return false;
    }

    // 4. Zone Filter
    if (zoneFilter !== 'ALL') {
      const itemZone = item.zone || 'General';
      if (itemZone !== zoneFilter) return false;
    }

    return true;
  });

  // Calculate Metrics dynamically from filtered dataset
  const totalItems = filteredInventory.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const uniqueSkus = new Set(filteredInventory.map(item => item.sku).filter(Boolean)).size;
  const lowStockAlertsCount = filteredInventory.filter(i => (i.quantity || 0) > 0 && (i.quantity || 0) < (i.minQuantity || 5)).length;

  // Active filters count
  const activeFiltersCount = (warehouseFilter !== 'ALL' ? 1 : 0) + (statusFilter !== 'ALL' ? 1 : 0) + (zoneFilter !== 'ALL' ? 1 : 0);

  // Handle Apply Filters
  const handleApplyFilters = () => {
    setWarehouseFilter(tempWarehouse);
    setStatusFilter(tempStatus);
    setZoneFilter(tempZone);
    setShowFilterModal(false);
    showToast('Filters applied successfully!');
  };

  // Handle Clear All Filters
  const handleClearAllFilters = () => {
    setWarehouseFilter('ALL');
    setStatusFilter('ALL');
    setZoneFilter('ALL');
    setTempWarehouse('ALL');
    setTempStatus('ALL');
    setTempZone('ALL');
    showToast('All filters cleared');
  };

  // Handle Open Modal
  const handleOpenFilterModal = () => {
    setTempWarehouse(warehouseFilter);
    setTempStatus(statusFilter);
    setTempZone(zoneFilter);
    setShowFilterModal(true);
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    if (!filteredInventory || filteredInventory.length === 0) {
      showToast('No inventory data to export!');
      return;
    }

    const headers = ['SKU', 'Description', 'Quantity', 'Unit', 'Warehouse', 'Zone/Row/Bay', 'Status', 'Date Received'];
    const rows = filteredInventory.map(item => {
      const qty = item.quantity || 0;
      const minQty = item.minQuantity || 5;
      let statusStr = 'In Stock';
      if (qty <= 0) statusStr = 'Out of Stock';
      else if (qty < minQty) statusStr = 'Low Stock';

      const locStr = `${item.zone || '-'}/${item.row || '-'}/${item.bay || '-'}`;

      return [
        `"${(item.sku || 'N/A').replace(/"/g, '""')}"`,
        `"${(item.description || 'N/A').replace(/"/g, '""')}"`,
        qty,
        `"${item.unit || 'EA'}"`,
        `"${(item.warehouse?.name || 'Unassigned').replace(/"/g, '""')}"`,
        `"${locStr}"`,
        `"${statusStr}"`,
        `"${item.receivedDate ? new Date(item.receivedDate).toLocaleDateString('en-AU') : '-'}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const todayStr = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Warehouse_Inventory_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Warehouse inventory exported successfully.');
  };

  return (
    <div className="wh-inventory-page">
      <style>{styles}</style>
      
      {/* Header Bar */}
      <div className="wh-header">
        <h1><FiBox style={{ color: '#7C3AED' }} /> Warehouse Inventory</h1>
        <div className="wh-header-actions">
          <button 
            onClick={handleOpenFilterModal} 
            className="wh-btn wh-btn-outline"
          >
            <FiFilter /> Filters
            {activeFiltersCount > 0 && <span className="filter-active-badge">{activeFiltersCount}</span>}
          </button>
          <button 
            onClick={handleExportCSV} 
            className="wh-btn wh-btn-outline"
          >
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="wh-metrics-row">
        <div className="wh-metric">
          <div className="wh-metric-icon" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
            <FiBox />
          </div>
          <div className="wh-metric-info">
            <h3>Total Stock Items</h3>
            <p>{totalItems}</p>
          </div>
        </div>
        <div className="wh-metric">
          <div className="wh-metric-icon" style={{ background: '#F0FDF4', color: '#22C55E' }}>
            <FiCheckCircle />
          </div>
          <div className="wh-metric-info">
            <h3>Unique SKUs</h3>
            <p>{uniqueSkus}</p>
          </div>
        </div>
        <div className="wh-metric">
          <div className="wh-metric-icon" style={{ background: '#FEF2F2', color: '#EF4444' }}>
            <FiAlertCircle />
          </div>
          <div className="wh-metric-info">
            <h3>Low Stock Alerts</h3>
            <p>{lowStockAlertsCount}</p>
          </div>
        </div>
      </div>

      {/* Inventory Table Card */}
      <div className="wh-card">
        <div className="wh-toolbar">
          <div className="wh-search">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Search by SKU, Description, Category, or Warehouse..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {search && (
            <button 
              onClick={() => setSearch('')} 
              className="wh-btn wh-btn-outline"
              style={{ padding: '8px 12px', fontSize: '12px' }}
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Active Filters Chips Bar */}
        {activeFiltersCount > 0 && (
          <div className="active-filter-chips">
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B21A8', uppercase: true }}>Applied Filters:</span>
            
            {warehouseFilter !== 'ALL' && (
              <span className="filter-chip">
                Warehouse: {warehouseFilter}
                <span className="filter-chip-remove" onClick={() => setWarehouseFilter('ALL')}><FiX /></span>
              </span>
            )}

            {statusFilter !== 'ALL' && (
              <span className="filter-chip">
                Status: {statusFilter === 'IN_STOCK' ? 'In Stock' : statusFilter === 'LOW_STOCK' ? 'Low Stock' : 'Out of Stock'}
                <span className="filter-chip-remove" onClick={() => setStatusFilter('ALL')}><FiX /></span>
              </span>
            )}

            {zoneFilter !== 'ALL' && (
              <span className="filter-chip">
                Zone: {zoneFilter}
                <span className="filter-chip-remove" onClick={() => setZoneFilter('ALL')}><FiX /></span>
              </span>
            )}

            <span className="clear-all-link" onClick={handleClearAllFilters}>Clear All</span>
          </div>
        )}

        {/* Inventory Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="wh-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Warehouse</th>
                <th>Location (Zone/Row/Bay)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: '#64748B' }}>
                    <FiRefreshCw style={{ animation: 'spin 1s linear infinite', fontSize: '20px', marginBottom: '8px' }} />
                    <div>Loading warehouse inventory...</div>
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>
                    <FiBox style={{ fontSize: '32px', color: '#CBD5E1', marginBottom: '8px' }} />
                    <div style={{ fontWeight: 600, fontSize: '15px', color: '#475569' }}>No inventory items match your current filters.</div>
                    {activeFiltersCount > 0 && (
                      <button 
                        onClick={handleClearAllFilters}
                        className="wh-btn wh-btn-outline"
                        style={{ margin: '12px auto 0', fontSize: '12px' }}
                      >
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredInventory.map(item => {
                  const qty = item.quantity || 0;
                  const minQty = item.minQuantity || 5;
                  
                  let badgeClass = 'stock-in';
                  let statusText = 'In Stock';

                  if (qty <= 0) {
                    badgeClass = 'stock-out';
                    statusText = 'Out of Stock';
                  } else if (qty < minQty) {
                    badgeClass = 'stock-low';
                    statusText = 'Low Stock';
                  }

                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700, color: '#7C3AED' }}>{item.sku || 'N/A'}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.description || 'N/A'}</div>
                        {item.category && <div style={{ fontSize: '11px', color: '#64748B' }}>{item.category}</div>}
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {qty} <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 400 }}>{item.unit || 'EA'}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                          <FiMapPin style={{ color: '#7C3AED' }} /> {item.warehouse?.name || 'Unassigned'}
                        </div>
                      </td>
                      <td style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>
                        {item.zone || '-'} / {item.row || '-'} / {item.bay || '-'}
                      </td>
                      <td>
                        <span className={`stock-badge ${badgeClass}`}>
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FiFilter style={{ color: '#7C3AED' }} /> Filter Warehouse Inventory</h2>
              <button className="modal-close" onClick={() => setShowFilterModal(false)}><FiX /></button>
            </div>
            
            <div className="modal-body">
              {/* Warehouse Filter */}
              <div className="filter-group">
                <label>Warehouse Location</label>
                <select 
                  value={tempWarehouse} 
                  onChange={e => setTempWarehouse(e.target.value)}
                >
                  <option value="ALL">All Warehouses</option>
                  {availableWarehouses.map((wh, idx) => (
                    <option key={idx} value={wh}>{wh}</option>
                  ))}
                </select>
              </div>

              {/* Stock Status Filter */}
              <div className="filter-group">
                <label>Stock Status</label>
                <select 
                  value={tempStatus} 
                  onChange={e => setTempStatus(e.target.value)}
                >
                  <option value="ALL">All Stock Statuses</option>
                  <option value="IN_STOCK">In Stock (Available)</option>
                  <option value="LOW_STOCK">Low Stock (Reorder Alert)</option>
                  <option value="OUT_OF_STOCK">Out of Stock (Zero)</option>
                </select>
              </div>

              {/* Zone Filter */}
              <div className="filter-group">
                <label>Inventory Storage Zone</label>
                <select 
                  value={tempZone} 
                  onChange={e => setTempZone(e.target.value)}
                >
                  <option value="ALL">All Storage Zones</option>
                  {availableZones.map((z, idx) => (
                    <option key={idx} value={z}>{z}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => {
                  setTempWarehouse('ALL');
                  setTempStatus('ALL');
                  setTempZone('ALL');
                }} 
                className="wh-btn wh-btn-outline"
              >
                Reset Filters
              </button>
              <button 
                onClick={handleApplyFilters} 
                className="wh-btn wh-btn-primary"
              >
                <FiCheck /> Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="wh-toast">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default WarehouseInventory;
