import React, { useState } from 'react';
import { Plus, Download, X, QrCode, Settings } from 'lucide-react';
import './WarehouseDashboard.css';

const WarehouseInbound = () => {
  const [yardMode, setYardMode] = useState('car'); // 'car' or 'freight'
  const [barcodeModal, setBarcodeModal] = useState(false);
  const [manualModal, setManualModal] = useState(false);

  // Barcode / Scanner Simulator state
  const [scanMode, setScanMode] = useState('Scan by 1D Barcode tag');
  const [scanInput, setScanInput] = useState('');

  // Manual Ingestion state
  const [manualForm, setManualForm] = useState({
    sku: '', palletCount: '1', weight: '', dimensions: '',
    barcode: '', zone: 'Zone A (Dry)', aisle: 'Aisle 1 - Bin B',
    customer: '', destination: ''
  });

  // Table density and rows
  const [density, setDensity] = useState('default'); // compact, default, relaxed
  const [selectedRows, setSelectedRows] = useState([]);
  const [inboundData, setInboundData] = useState([
    { id: 'INB-9022', carrierPartner: 'DHL Express', cargoSpecs: '1x Pallet, 350kg', spottedLane: 'Lane A1' },
    { id: 'INB-9023', carrierPartner: 'FedEx Logistics', cargoSpecs: '2x Pallets, 720kg', spottedLane: 'Lane A2' }
  ]);

  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    receiptId: true,
    carrierPartner: false,
    cargoSpecs: false,
    spottedLane: false,
    stagedActions: true
  });

  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const handleExport = () => {
    const headers = ['Receipt ID', 'Spotted Lane', 'Status'];
    const rows = inboundData.map(row => [row.id, row.spottedLane, 'Pending Scan-In']);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inbound_staging_queue.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBarcodeScan = () => {
    if (!scanInput.trim()) return;
    alert('Scan decoded: ' + scanInput);
    setScanInput('');
    setBarcodeModal(false);
  };

  const handleManualIngest = (e) => {
    e.preventDefault();
    alert('Asset ingested successfully.');
    setManualForm({ sku: '', palletCount: '1', weight: '', dimensions: '', barcode: '', zone: 'Zone A (Dry)', aisle: 'Aisle 1 - Bin B', customer: '', destination: '' });
    setManualModal(false);
  };

  const handleScanInRow = (rowId) => {
    setScanInput(rowId);
    setBarcodeModal(true);
  };

  const handlePrintLabel = (rowId) => {
    alert(`Label printed successfully for ${rowId}`);
  };

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleAllSelect = () => {
    if (selectedRows.length === inboundData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(inboundData.map(r => r.id));
    }
  };

  const getPaddingClass = () => {
    if (density === 'compact') return 'py-2 px-6';
    if (density === 'relaxed') return 'py-5 px-6';
    return 'py-3.5 px-6'; // default
  };

  return (
    <div className="warehouse-dashboard">
      {/* Header section matches WarehouseDashboard perfectly */}
      <div className="warehouse-header">
        <div className="warehouse-header-titles">
          <h1>Inbound</h1>
        </div>
      </div>

      {/* Inbound Staging Queue Table Card */}
      <div className="warehouse-bottom-section" style={{ textAlign: 'left' }}>
        <div className="flex justify-between items-center pb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-title" style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>Inbound Staging Queue</h3>
          
          <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                  
                  {/* Receipt ID */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.receiptId}
                      onChange={() => toggleColumn('receiptId')}
                      style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                    <span>Receipt ID</span>
                  </label>

                  {/* Carrier Partner */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.carrierPartner}
                      onChange={() => toggleColumn('carrierPartner')}
                      style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                    <span>Carrier Partner</span>
                  </label>

                  {/* Inbound Cargo Specs */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.cargoSpecs}
                      onChange={() => toggleColumn('cargoSpecs')}
                      style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                    <span>Inbound Cargo Specs</span>
                  </label>

                  {/* Spotted Lane */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.spottedLane}
                      onChange={() => toggleColumn('spottedLane')}
                      style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                    <span>Spotted Lane</span>
                  </label>

                  {/* Staged Actions */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.stagedActions}
                      onChange={() => toggleColumn('stagedActions')}
                      style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                    />
                    <span>Staged Actions</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Table matching design */}
        <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white" style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide" style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th className="px-6 py-4 w-12 text-center" style={{ width: '48px', padding: '14px 24px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === inboundData.length && inboundData.length > 0}
                    onChange={handleAllSelect}
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                {visibleColumns.receiptId && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px' }}>Receipt ID</th>}
                {visibleColumns.carrierPartner && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px' }}>Carrier Partner</th>}
                {visibleColumns.cargoSpecs && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px' }}>Inbound Cargo Specs</th>}
                {visibleColumns.spottedLane && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px' }}>Spotted Lane</th>}
                {visibleColumns.stagedActions && <th className="px-6 py-4 font-extrabold" style={{ padding: '14px 24px', color: '#475569', fontSize: '10px' }}>Staged Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800" style={{ fontSize: '13px' }}>
              {inboundData.map((row) => {
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
                    {visibleColumns.receiptId && (
                      <td className={`font-mono text-slate-900 font-extrabold whitespace-nowrap ${getPaddingClass()}`} style={{ fontWeight: '800', fontFamily: 'monospace', color: '#0f172a' }}>
                        {row.id}
                      </td>
                    )}
                    {visibleColumns.carrierPartner && (
                      <td className={`whitespace-nowrap font-semibold ${getPaddingClass()}`} style={{ color: '#475569', fontWeight: '600' }}>
                        {row.carrierPartner}
                      </td>
                    )}
                    {visibleColumns.cargoSpecs && (
                      <td className={`whitespace-nowrap font-semibold ${getPaddingClass()}`} style={{ color: '#475569', fontWeight: '600' }}>
                        {row.cargoSpecs}
                      </td>
                    )}
                    {visibleColumns.spottedLane && (
                      <td className={`whitespace-nowrap font-extrabold ${getPaddingClass()}`} style={{ color: '#d97706', fontWeight: '800' }}>
                        {row.spottedLane}
                      </td>
                    )}
                    {visibleColumns.stagedActions && (
                      <td className={`whitespace-nowrap ${getPaddingClass()}`}>
                        <div className="flex gap-2" style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleScanInRow(row.id)}
                            className="btn btn-white-wh"
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', fontWeight: '700' }}
                          >
                            Scan In
                          </button>
                          <button
                            onClick={() => handlePrintLabel(row.id)}
                            className="btn btn-white-orange-wh"
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', fontWeight: '700' }}
                          >
                            Print Label
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
                <option>Scan by 1D Barcode tag</option>
                <option>Scan by QR Code</option>
                <option>Scan by NFC Tag</option>
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

      {/* Manual Asset Ingestion Modal */}
      {manualModal && (
        <div className="wh-modal-overlay" onClick={() => setManualModal(false)}>
          <div className="wh-modal" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h2>Manual Asset Ingestion</h2>
              <button className="wh-modal-close" onClick={() => setManualModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="wh-modal-body" onSubmit={handleManualIngest}>
              <label className="wh-label">CARGO SKU / ITEM NUMBER</label>
              <input type="text" placeholder="e.g. PLT-AUTO-19" value={manualForm.sku} onChange={e => setManualForm({...manualForm, sku: e.target.value})} className="wh-input" />

              <div className="wh-row-3">
                <div>
                  <label className="wh-label">PALLET COUNT</label>
                  <input type="text" value={manualForm.palletCount} onChange={e => setManualForm({...manualForm, palletCount: e.target.value})} className="wh-input" />
                </div>
                <div>
                  <label className="wh-label">TOTAL WEIGHT</label>
                  <input type="text" placeholder="e.g. 14,200 lbs" value={manualForm.weight} onChange={e => setManualForm({...manualForm, weight: e.target.value})} className="wh-input" />
                </div>
                <div>
                  <label className="wh-label">DIMENSIONS</label>
                  <input type="text" placeholder="e.g. 1.2m x 1.2m x 1.5m" value={manualForm.dimensions} onChange={e => setManualForm({...manualForm, dimensions: e.target.value})} className="wh-input" />
                </div>
              </div>

              <label className="wh-label">BARCODE / QR TAG</label>
              <input type="text" placeholder="e.g. BAR-9011283" value={manualForm.barcode} onChange={e => setManualForm({...manualForm, barcode: e.target.value})} className="wh-input" />

              <div className="wh-row-2">
                <div>
                  <label className="wh-label">WAREHOUSE ZONE</label>
                  <select value={manualForm.zone} onChange={e => setManualForm({...manualForm, zone: e.target.value})} className="wh-select">
                    <option>Zone A (Dry)</option>
                    <option>Zone B (Cold)</option>
                    <option>Zone C (Hazmat)</option>
                  </select>
                </div>
                <div>
                  <label className="wh-label">AISLE / BIN SPOT</label>
                  <select value={manualForm.aisle} onChange={e => setManualForm({...manualForm, aisle: e.target.value})} className="wh-select">
                    <option>Aisle 1 - Bin B</option>
                    <option>Aisle 2 - Bin A</option>
                    <option>Aisle 3 - Bin C</option>
                  </select>
                </div>
              </div>

              <div className="wh-row-2">
                <div>
                  <label className="wh-label">BILLING CUSTOMER</label>
                  <input type="text" placeholder="e.g. Toyota Australia" value={manualForm.customer} onChange={e => setManualForm({...manualForm, customer: e.target.value})} className="wh-input" />
                </div>
                <div>
                  <label className="wh-label">DESTINATION DELIVERY</label>
                  <input type="text" placeholder="e.g. Brisbane Port" value={manualForm.destination} onChange={e => setManualForm({...manualForm, destination: e.target.value})} className="wh-input" />
                </div>
              </div>

              <button className="wh-btn-submit" type="submit">
                Ingest Asset (Independent of loads)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseInbound;
