import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiBox, FiSearch, FiFilter, FiDownload, FiMapPin, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const styles = `
  .wh-inventory-page { padding: 24px 32px; background: #F8FAFC; min-height: 100vh; font-family: 'Inter', sans-serif; }
  .wh-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .wh-header h1 { font-size: 24px; font-weight: 700; color: #0F172A; margin: 0; display: flex; align-items: center; gap: 10px; }
  .wh-header-actions { display: flex; gap: 12px; }
  .wh-btn { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
  .wh-btn-outline { background: #fff; border: 1px solid #E2E8F0; color: #475569; }
  .wh-btn-outline:hover { background: #F1F5F9; }
  
  .wh-metrics-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .wh-metric { background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #E2E8F0; display: flex; align-items: center; gap: 16px; }
  .wh-metric-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
  .wh-metric-info h3 { margin: 0; font-size: 13px; color: #64748B; font-weight: 600; text-transform: uppercase; }
  .wh-metric-info p { margin: 4px 0 0; font-size: 24px; font-weight: 700; color: #0F172A; }

  .wh-card { background: #fff; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; }
  .wh-toolbar { padding: 16px; border-bottom: 1px solid #E2E8F0; display: flex; gap: 16px; align-items: center; }
  .wh-search { flex: 1; position: relative; }
  .wh-search input { width: 100%; padding: 10px 16px 10px 40px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 14px; outline: none; }
  .wh-search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94A3B8; }
  
  .wh-table { width: 100%; border-collapse: collapse; }
  .wh-table th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748B; text-transform: uppercase; border-bottom: 1px solid #E2E8F0; background: #F8FAFC; }
  .wh-table td { padding: 16px; border-bottom: 1px solid #F1F5F9; font-size: 14px; color: #334155; vertical-align: middle; }
  .wh-table tr:hover td { background: #F8FAFC; }
  
  .stock-badge { padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
  .stock-in { background: #DCFCE7; color: #166534; }
  .stock-out { background: #FEE2E2; color: #991B1B; }
  .stock-pending { background: #FEF3C7; color: #92400E; }
`;

const WarehouseInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filteredInventory = inventory.filter(item => 
    (item.sku || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.warehouse?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = inventory.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const uniqueSkus = new Set(inventory.map(item => item.sku).filter(Boolean)).size;

  return (
    <div className="wh-inventory-page">
      <style>{styles}</style>
      
      <div className="wh-header">
        <h1><FiBox /> Warehouse Inventory</h1>
        <div className="wh-header-actions">
          <button className="wh-btn wh-btn-outline"><FiFilter /> Filters</button>
          <button className="wh-btn wh-btn-outline"><FiDownload /> Export</button>
        </div>
      </div>

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
            <p>{inventory.filter(i => (i.quantity || 0) < (i.minQuantity || 5)).length}</p>
          </div>
        </div>
      </div>

      <div className="wh-card">
        <div className="wh-toolbar">
          <div className="wh-search">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Search by SKU, Description, or Warehouse..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

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
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading inventory...</td></tr>
              ) : filteredInventory.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No inventory found.</td></tr>
              ) : (
                filteredInventory.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.sku || 'N/A'}</td>
                    <td>{item.description || 'N/A'}</td>
                    <td style={{ fontWeight: 700 }}>
                      {item.quantity} <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 400 }}>{item.unit}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FiMapPin style={{ color: '#94A3B8' }} /> {item.warehouse?.name || 'Unassigned'}
                      </div>
                    </td>
                    <td>
                      {item.zone || '-'} / {item.row || '-'} / {item.bay || '-'}
                    </td>
                    <td>
                      <span className={`stock-badge ${item.quantity > 0 ? 'stock-in' : 'stock-out'}`}>
                        {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WarehouseInventory;
