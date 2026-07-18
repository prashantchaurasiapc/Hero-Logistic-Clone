import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import './WarehouseDashboard.css';

const WarehouseOutbound = () => {
  const [barcodeModal, setBarcodeModal] = useState(false);

  // Barcode / Scanner Simulator state
  const [scanMode, setScanMode] = useState('Scan Outward Dispatching');
  const [scanInput, setScanInput] = useState('');

  // Table density and rows
  const [density, setDensity] = useState('default'); // compact, default, relaxed
  const [selectedRows, setSelectedRows] = useState([]);
  const [outboundData, setOutboundData] = useState([
    { id: 'OUT-4011', transportCarrier: 'Linfox Transport', cargoSpecs: '4x Pallets, 1,200kg', dockGateLane: 'Gate B3' }
  ]);

  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    outboundId: true,
    transportCarrier: false,
    cargoSpecs: false,
    dockGateLane: false,
    loadingActions: true
  });

  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const handleBarcodeScan = () => {
    if (!scanInput.trim()) return;
    alert('Scan decoded: ' + scanInput);
    setScanInput('');
    setBarcodeModal(false);
  };

  const handleScanOutRow = (rowId) => {
    setScanInput(rowId);
    setBarcodeModal(true);
  };

  const handleReprintLabel = (rowId) => {
    alert(`Label reprinted successfully for ${rowId}`);
  };

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleAllSelect = () => {
    if (selectedRows.length === outboundData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(outboundData.map(r => r.id));
    }
  };

  const getPaddingClass = () => {
    if (density === 'compact') return 'py-2 px-6';
    if (density === 'relaxed') return 'py-5 px-6';
    return 'py-3.5 px-6'; // default
  };

  return (
    <div className="warehouse-dashboard">
      {/* Header section matches WarehouseInbound perfectly */}
      <div className="warehouse-header">
        <div className="warehouse-header-titles">
          <h1>Outbound</h1>
        </div>
      </div>

      {/* Outbound Loading Queue Table Card */}
      <div className="warehouse-bottom-section" style={{ textAlign: 'left' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-title" style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>Outbound Loading Queue</h3>
          
          <div className="flex flex-wrap items-center gap-3" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
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
                      border: isActive ? '1px solid #000' : '1px solid transparent',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>

            {/* Columns button */}
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
                  backgroundColor: '#ffffff',
                  whiteSpace: 'nowrap'
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
                  
                  {/* Outbound ID */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.outboundId}
                      onChange={() => toggleColumn('outboundId')}
                      style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                    <span>Outbound ID</span>
                  </label>

                  {/* Transport Carrier */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.transportCarrier}
                      onChange={() => toggleColumn('transportCarrier')}
                      style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                    <span>Transport Carrier</span>
                  </label>

                  {/* Outbound Cargo Specs */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.cargoSpecs}
                      onChange={() => toggleColumn('cargoSpecs')}
                      style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                    <span>Outbound Cargo Specs</span>
                  </label>

                  {/* Dock Gate Lane */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.dockGateLane}
                      onChange={() => toggleColumn('dockGateLane')}
                      style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                    <span>Dock Gate Lane</span>
                  </label>

                  {/* Loading Actions */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.loadingActions}
                      onChange={() => toggleColumn('loadingActions')}
                      style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                    <span>Loading Actions</span>
                  </label>
                </div>
              )}
            </div>
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
                    checked={selectedRows.length === outboundData.length && outboundData.length > 0}
                    onChange={handleAllSelect}
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                {visibleColumns.outboundId && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Outbound ID</th>}
                {visibleColumns.transportCarrier && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Transport Carrier</th>}
                {visibleColumns.cargoSpecs && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Outbound Cargo Specs</th>}
                {visibleColumns.dockGateLane && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Dock Gate Lane</th>}
                {visibleColumns.loadingActions && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px', whiteSpace: 'nowrap' }}>Loading Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800" style={{ fontSize: '13px' }}>
              {outboundData.map((row) => {
                const isChecked = selectedRows.includes(row.id);
                return (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-6 text-center whitespace-nowrap" style={{ padding: '14px 24px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleRowSelect(row.id)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    {visibleColumns.outboundId && (
                      <td className={`font-mono text-slate-900 font-extrabold whitespace-nowrap ${getPaddingClass()}`} style={{ fontWeight: '800', fontFamily: 'monospace', color: '#0f172a' }}>
                        {row.id}
                      </td>
                    )}
                    {visibleColumns.transportCarrier && (
                      <td className={`whitespace-nowrap font-semibold ${getPaddingClass()}`} style={{ color: '#475569', fontWeight: '600' }}>
                        {row.transportCarrier}
                      </td>
                    )}
                    {visibleColumns.cargoSpecs && (
                      <td className={`whitespace-nowrap font-semibold ${getPaddingClass()}`} style={{ color: '#475569', fontWeight: '600' }}>
                        {row.cargoSpecs}
                      </td>
                    )}
                    {visibleColumns.dockGateLane && (
                      <td className={`whitespace-nowrap font-extrabold ${getPaddingClass()}`} style={{ color: '#d97706', fontWeight: '800' }}>
                        {row.dockGateLane}
                      </td>
                    )}
                    {visibleColumns.loadingActions && (
                      <td className={`whitespace-nowrap ${getPaddingClass()}`}>
                        <div className="flex gap-2" style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleScanOutRow(row.id)}
                            className="btn btn-white-wh"
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', fontWeight: '700' }}
                          >
                            Scan Out
                          </button>
                          <button
                            onClick={() => handleReprintLabel(row.id)}
                            className="btn btn-white-orange-wh"
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', fontWeight: '700' }}
                          >
                            Reprint Label
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

      {/* Barcode/QR Scanner Simulator Modal */}
      {barcodeModal && (
        <div className="wh-modal-overlay" onClick={() => setBarcodeModal(false)}>
          <div className="wh-modal" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h2>Barcode/QR Scanner Simulator</h2>
              <button className="wh-modal-close" onClick={() => setBarcodeModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="wh-modal-body">
              <label className="wh-label">SCANNER MODE ACTION</label>
              <select
                value={scanMode}
                onChange={e => setScanMode(e.target.value)}
                className="wh-select"
              >
                <option>Scan Inward Stowing</option>
                <option>Scan Outward Dispatching</option>
                <option>Scan by 1D Barcode tag</option>
                <option>Scan by 2D QR Code tag</option>
              </select>

              <label className="wh-label">SCAN DECODER INPUT</label>
              <input
                type="text"
                placeholder="Scan Barcode (e.g. BAR-9011283)"
                value={scanInput}
                onChange={e => setScanInput(e.target.value)}
                className="wh-input"
              />

              <button className="wh-btn-submit" onClick={handleBarcodeScan}>
                Simulate Scan Decoder Trigger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseOutbound;
