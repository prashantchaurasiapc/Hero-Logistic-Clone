import React, { useState } from 'react';
import { Search, Download, Settings, Eye, CheckSquare, X, AlertCircle } from 'lucide-react';
import './WarehouseDashboard.css';

const WarehouseCurrentStock = () => {
  // Density and select rows
  const [density, setDensity] = useState('relaxed'); // default: relaxed in screenshot
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);

  // Modal and Notification states
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [targetLocation, setTargetLocation] = useState('Bay 1 (Bay)');

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState('');

  const [missingNotification, setMissingNotification] = useState({ open: false, itemId: '' });

  // Column visibility checklist
  const [visibleColumns, setVisibleColumns] = useState({
    itemNumber: true,
    barcode: false,
    palletDim: false,
    customer: false,
    zone: false,
    holdingAreaBin: false,
    status: false,
    actions: true
  });

  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  // Mock stock inventory data
  const [stockData, setStockData] = useState([
    {
      id: 'ITM-9011',
      barcode: 'BAR-9011',
      palletDim: '1x Pallet, 120x80x160cm',
      customer: 'BMW Group',
      zone: 'Zone A',
      holdingAreaBin: 'Bin A-12',
      status: 'Stowed'
    },
    {
      id: 'ITM-4491',
      barcode: 'BAR-4491',
      palletDim: '2x Pallets, 120x80x150cm',
      customer: 'Mercedes-Benz',
      zone: 'Zone B',
      holdingAreaBin: 'Bin B-04',
      status: 'Stowed'
    },
    {
      id: 'ITM-1022',
      barcode: 'BAR-1022',
      palletDim: '1x Pallet, 120x100x180cm',
      customer: 'Audi AG',
      zone: 'Zone A',
      holdingAreaBin: 'Bin A-08',
      status: 'Stowed'
    }
  ]);

  const filteredData = stockData.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(query) ||
      item.customer.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    );
  });

  // Action Handlers
  const handleView = (id) => alert(`Viewing details for ${id}`);
  
  const handleMove = (id) => {
    setSelectedItemId(id);
    setTargetLocation('Bay 1 (Bay)');
    setMoveModalOpen(true);
  };
  
  const handleToHolding = (id) => alert(`Moving item ${id} to Holding Area`);
  const handleToLane = (id) => alert(`Moving item ${id} to Load Lane`);
  
  const handleHistory = (id) => {
    setHistoryItem(id);
    setHistoryModalOpen(true);
  };
  
  const handleLabel = (id) => alert(`Printing/Viewing label for ${id}`);
  
  const handleMissing = (id) => {
    setMissingNotification({ open: true, itemId: id });
  };

  // Row Selection logic
  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleAllSelect = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map(r => r.id));
    }
  };

  // Export all as CSV
  const handleExportStockList = () => {
    const headers = ['Item Number', 'Barcode', 'Pallet / Dim', 'Customer', 'Zone', 'Holding Area / Bin', 'Status'];
    const rows = stockData.map(item => [
      item.id,
      item.barcode,
      item.palletDim,
      item.customer,
      item.zone,
      item.holdingAreaBin,
      item.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "current_stock_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export selected as CSV
  const handleExportSelected = () => {
    const selectedItems = stockData.filter(item => selectedRows.includes(item.id));
    const headers = ['Item Number', 'Barcode', 'Pallet / Dim', 'Customer', 'Zone', 'Holding Area / Bin', 'Status'];
    const rows = selectedItems.map(item => [
      item.id,
      item.barcode,
      item.palletDim,
      item.customer,
      item.zone,
      item.holdingAreaBin,
      item.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_stock_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPaddingClass = () => {
    if (density === 'compact') return 'py-2 px-6';
    if (density === 'default') return 'py-3.5 px-6';
    return 'py-5 px-6'; // relaxed is default here
  };

  return (
    <div className="warehouse-dashboard">
      {/* Header section matches WarehouseInbound perfectly */}
      <div className="warehouse-header">
        <div className="warehouse-header-titles">
          <h1>Current Stock</h1>
        </div>
      </div>

      {/* KPI Stats Grid matching first screenshot - all in 1 line */}
      <div className="warehouse-stats-grid" style={{ display: 'flex', flexWrap: 'nowrap', gap: '16px', marginBottom: '24px', overflowX: 'auto', width: '100%' }}>
        <div className="stat-card" style={{ flex: '1 1 0px', minWidth: '150px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', textAlign: 'left', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Total Stock</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>3</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Total units tracked</div>
        </div>
        <div className="stat-card" style={{ flex: '1 1 0px', minWidth: '150px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', textAlign: 'left', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Available Stock</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>2</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Unassigned units</div>
        </div>
        <div className="stat-card" style={{ flex: '1 1 0px', minWidth: '150px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', textAlign: 'left', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>In Holding Area</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>0</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Units staged</div>
        </div>
        <div className="stat-card" style={{ flex: '1 1 0px', minWidth: '150px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', textAlign: 'left', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Load Lanes</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>0</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Units queued</div>
        </div>
        <div className="stat-card" style={{ flex: '1 1 0px', minWidth: '150px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', textAlign: 'left', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Ready to Dispatch</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>1</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Cleared to load</div>
        </div>
        <div className="stat-card" style={{ flex: '1 1 0px', minWidth: '150px', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', textAlign: 'left', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Missing Items</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>0</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Flagged incidents</div>
        </div>
      </div>

      {/* Current Stock Inventory Table Card */}
      <div className="warehouse-bottom-section" style={{ textAlign: 'left' }}>
        <div className="flex justify-between items-start pb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 className="section-title" style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>Current Stock Inventory</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Comprehensive view of all independent assets and staging cargo.</p>
          </div>
          
          <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search Item No, Customer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px 8px 36px',
                  fontSize: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  width: '240px',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            {/* Export Stock List Button */}
            <button 
              className="btn btn-yellow-wh with-icon" 
              onClick={handleExportStockList}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ffd400',
                color: '#0f172a',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(255, 212, 0, 0.2)'
              }}
            >
              <Download className="w-4 h-4" />
              <span>Export Stock List</span>
            </button>
          </div>
        </div>

        {/* Selected row status & csv export bar */}
        {selectedRows.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            padding: '8px 16px',
            marginBottom: '16px',
            width: 'fit-content'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {selectedRows.length} SELECTED
            </span>
            <button 
              onClick={handleExportSelected}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#b45309',
                cursor: 'pointer'
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Export</span>
            </button>
          </div>
        )}

        {/* Table Control Row */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '12px' }}>
          {/* Density Selector */}
          <div className="wh-segmented-control" style={{ padding: '2px', borderRadius: '8px' }}>
            {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
              const isActive = density === mode.toLowerCase();
              return (
                <button
                  key={mode}
                  onClick={() => setDensity(mode.toLowerCase())}
                  className="segmented-btn"
                  style={{
                    padding: '5px 12px',
                    fontSize: '9px',
                    borderRadius: '6px',
                    backgroundColor: isActive ? '#ffd400' : 'transparent',
                    color: isActive ? '#0f172a' : '#64748b',
                    border: isActive ? '1px solid #000' : '1px solid transparent'
                  }}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          {/* Columns Visibility Selector */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-white-wh" 
              style={{
                padding: '6px 12px',
                fontSize: '10px',
                borderRadius: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: columnsMenuOpen ? '1.5px solid #000000' : '1px solid #e2e8f0',
                color: columnsMenuOpen ? '#0f172a' : '#64748b',
                backgroundColor: '#ffffff'
              }}
              onClick={() => setColumnsMenuOpen(!columnsMenuOpen)}
            >
              <Settings className="h-3.5 w-3.5 text-slate-400" />
              <span>Columns</span>
            </button>

            {columnsMenuOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                padding: '16px',
                zIndex: 50,
                minWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  Column Visibility
                </div>
                
                {/* Item Number */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.itemNumber}
                    onChange={() => toggleColumn('itemNumber')}
                    style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                  <span>Item Number</span>
                </label>

                {/* Barcode */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.barcode}
                    onChange={() => toggleColumn('barcode')}
                    style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                  <span>Barcode</span>
                </label>

                {/* Pallet / Dim */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.palletDim}
                    onChange={() => toggleColumn('palletDim')}
                    style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                  <span>Pallet / Dim</span>
                </label>

                {/* Customer */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.customer}
                    onChange={() => toggleColumn('customer')}
                    style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                  <span>Customer</span>
                </label>

                {/* Zone */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.zone}
                    onChange={() => toggleColumn('zone')}
                    style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                  <span>Zone</span>
                </label>

                {/* Holding Area / Bin */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.holdingAreaBin}
                    onChange={() => toggleColumn('holdingAreaBin')}
                    style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                  <span>Holding Area / Bin</span>
                </label>

                {/* Status */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.status}
                    onChange={() => toggleColumn('status')}
                    style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                  <span>Status</span>
                </label>

                {/* Actions */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.actions}
                    onChange={() => toggleColumn('actions')}
                    style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                  <span>Actions</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Custom Table matching design */}
        <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white" style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflowX: 'auto' }}>
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide" style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th className="px-6 py-4 w-12 text-center" style={{ width: '48px', padding: '14px 24px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                    onChange={handleAllSelect}
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                {visibleColumns.itemNumber && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Item Number</th>}
                {visibleColumns.barcode && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Barcode</th>}
                {visibleColumns.palletDim && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Pallet / Dim</th>}
                {visibleColumns.customer && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Customer</th>}
                {visibleColumns.zone && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Zone</th>}
                {visibleColumns.holdingAreaBin && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Holding Area / Bin</th>}
                {visibleColumns.status && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Status</th>}
                {visibleColumns.actions && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800" style={{ fontSize: '13px' }}>
              {filteredData.map((row) => {
                const isChecked = selectedRows.includes(row.id);
                return (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isChecked ? '#fffbeb' : 'transparent' }}>
                    <td className="px-6 text-center whitespace-nowrap" style={{ padding: '14px 24px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleRowSelect(row.id)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    {visibleColumns.itemNumber && (
                      <td className={`font-mono text-slate-900 font-extrabold whitespace-nowrap ${getPaddingClass()}`} style={{ fontWeight: '800', fontFamily: 'monospace', color: '#0f172a' }}>
                        {row.id}
                      </td>
                    )}
                    {visibleColumns.barcode && (
                      <td className={`whitespace-nowrap font-semibold ${getPaddingClass()}`} style={{ color: '#475569' }}>
                        {row.barcode}
                      </td>
                    )}
                    {visibleColumns.palletDim && (
                      <td className={`whitespace-nowrap font-semibold ${getPaddingClass()}`} style={{ color: '#475569' }}>
                        {row.palletDim}
                      </td>
                    )}
                    {visibleColumns.customer && (
                      <td className={`whitespace-nowrap font-semibold ${getPaddingClass()}`} style={{ color: '#475569' }}>
                        {row.customer}
                      </td>
                    )}
                    {visibleColumns.zone && (
                      <td className={`whitespace-nowrap font-semibold ${getPaddingClass()}`} style={{ color: '#475569' }}>
                        {row.zone}
                      </td>
                    )}
                    {visibleColumns.holdingAreaBin && (
                      <td className={`whitespace-nowrap font-semibold ${getPaddingClass()}`} style={{ color: '#475569' }}>
                        {row.holdingAreaBin}
                      </td>
                    )}
                    {visibleColumns.status && (
                      <td className={`whitespace-nowrap font-semibold ${getPaddingClass()}`} style={{ color: '#10b981', fontWeight: '700' }}>
                        {row.status}
                      </td>
                    )}
                    {visibleColumns.actions && (
                      <td className={`whitespace-nowrap ${getPaddingClass()}`}>
                        <div className="flex gap-1.5" style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleView(row.id)}
                            className="btn btn-white-wh"
                            style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', fontWeight: '700', border: '1px solid #cbd5e1' }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleMove(row.id)}
                            className="btn btn-white-orange-wh"
                            style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', fontWeight: '700' }}
                          >
                            Move
                          </button>
                          <button
                            onClick={() => handleToHolding(row.id)}
                            className="btn btn-white-orange-wh"
                            style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', fontWeight: '700' }}
                          >
                            To Holding
                          </button>
                          <button
                            onClick={() => handleToLane(row.id)}
                            className="btn btn-white-orange-wh"
                            style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', fontWeight: '700' }}
                          >
                            To Lane
                          </button>
                          <button
                            onClick={() => handleHistory(row.id)}
                            className="btn btn-white-orange-wh"
                            style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', fontWeight: '700' }}
                          >
                            Hist
                          </button>
                          <button
                            onClick={() => handleLabel(row.id)}
                            className="btn btn-white-orange-wh"
                            style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', fontWeight: '700' }}
                          >
                            Label
                          </button>
                          <button
                            onClick={() => handleMissing(row.id)}
                            className="btn btn-white-orange-wh"
                            style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', fontWeight: '700', color: '#ef4444', borderColor: '#fee2e2', backgroundColor: '#fef2f2' }}
                          >
                            Missing
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Relocate Asset Location Modal */}
      {moveModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }} onClick={() => setMoveModalOpen(false)}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            animation: 'scaleIn 0.2s ease-out'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Relocate Asset Location</h2>
              <button 
                onClick={() => setMoveModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Target Location Spot
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={targetLocation}
                  onChange={e => setTargetLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Bay 1 (Bay)">Bay 1 (Bay)</option>
                  <option value="Bay 2 (Bay)">Bay 2 (Bay)</option>
                  <option value="Bay 3 (Bay)">Bay 3 (Bay)</option>
                  <option value="Holding Area A (Holding Area)">Holding Area A (Holding Area)</option>
                  <option value="Holding Area B (Holding Area)">Holding Area B (Holding Area)</option>
                  <option value="Lane A1 (Load Lane)">Lane A1 (Load Lane)</option>
                  <option value="Lane A2 (Load Lane)">Lane A2 (Load Lane)</option>
                  <option value="Lane C3 (Load Lane)">Lane C3 (Load Lane)</option>
                  <option value="Aisle 1 - Bin B (Aisle/Bin)">Aisle 1 - Bin B (Aisle/Bin)</option>
                  <option value="Aisle 2 - Bin A (Aisle/Bin)">Aisle 2 - Bin A (Aisle/Bin)</option>
                  <option value="Aisle 4 - Bin C (Aisle/Bin)">Aisle 4 - Bin C (Aisle/Bin)</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#64748b',
                  fontSize: '12px'
                }}>▼</div>
              </div>
            </div>

            <button
              onClick={() => {
                // Update item holding/area in local state if relevant
                setStockData(stockData.map(item => {
                  if (item.id === selectedItemId) {
                    return {
                      ...item,
                      holdingAreaBin: targetLocation.includes('Holding Area') ? targetLocation.split(' (')[0] : item.holdingAreaBin,
                      zone: targetLocation.includes('Aisle') ? 'Zone A' : item.zone
                    };
                  }
                  return item;
                }));
                setMoveModalOpen(false);
                alert(`Asset ${selectedItemId} successfully relocated to ${targetLocation}`);
              }}
              style={{
                width: '100%',
                backgroundColor: '#ffd400',
                color: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(255, 212, 0, 0.3)'
              }}
            >
              Confirm Location Move
            </button>
          </div>
        </div>
      )}

      {/* Asset Custody History Log Right-Side Drawer */}
      {historyModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.2)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 9998
        }} onClick={() => setHistoryModalOpen(false)}>
          <div style={{
            backgroundColor: '#ffffff',
            width: '100%',
            maxWidth: '420px',
            height: '100%',
            boxShadow: '-10px 0 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            overflowY: 'auto',
            animation: 'slideLeft 0.2s ease-out'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setHistoryModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Asset Custody History Log</h2>
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', margin: 0, color: '#0f172a' }}>{historyItem}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Asset chain of custody log</p>
              </div>
            </div>

            {/* Log Chain */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              {[
                { title: 'Moved to holding area: Zone A (Dry)', time: '15/7/2026, 5:52:59 pm', op: 'Operated by: Adam K. (Yard Manager)' },
                { title: 'Assigned load lane routing: Lane C3', time: '15/7/2026, 5:52:52 pm', op: 'Operated by: Adam K. (Yard Manager)' },
                { title: 'Moved to holding area: Zone A (Dry)', time: '15/7/2026, 5:52:50 pm', op: 'Operated by: Adam K. (Yard Manager)' },
                { title: 'Assigned load lane routing: Lane C3', time: '15/7/2026, 5:52:48 pm', op: 'Operated by: Adam K. (Yard Manager)' },
                { title: 'Moved to holding area: Zone A (Dry)', time: '15/7/2026, 5:52:44 pm', op: 'Operated by: Adam K. (Yard Manager)' },
                { title: 'Moved to holding area: Zone A (Dry)', time: '15/7/2026, 5:52:23 pm', op: 'Operated by: Adam K. (Yard Manager)' },
              ].map((log, index) => (
                <div key={index} style={{
                  border: '1px solid #f1f5f9',
                  backgroundColor: '#fafafa',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#b45309' }}>{log.title}</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{log.time}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>{log.op}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification for Missing click */}
      {missingNotification.open && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#fef2f2',
          border: '1.5px solid #fecaca',
          borderRadius: '16px',
          padding: '16px 24px',
          boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.1), 0 8px 10px -6px rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10000,
          animation: 'slideIn 0.2s ease-out'
        }}>
          <AlertCircle style={{ color: '#ef4444', width: '20px', height: '20px', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#991b1b' }}>
            Asset {missingNotification.itemId} reported missing! Incident ticket dispatched to supervisor.
          </span>
          <button 
            onClick={() => setMissingNotification({ open: false, itemId: '' })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#991b1b',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '50%',
              backgroundColor: 'transparent'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WarehouseCurrentStock;
