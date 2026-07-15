import React, { useState } from 'react';
import { Plus, Download, X, QrCode } from 'lucide-react';
import './WarehouseDashboard.css';

const WarehouseDashboard = () => {
  const [yardMode, setYardMode] = useState('car'); // 'car' or 'freight'
  const [barcodeModal, setBarcodeModal] = useState(false);
  const [manualModal, setManualModal] = useState(false);

  // Barcode form
  const [scanMode, setScanMode] = useState('Scan by 1D Barcode tag');
  const [scanInput, setScanInput] = useState('');

  // Manual entry form
  const [manualForm, setManualForm] = useState({
    sku: '', palletCount: '1', weight: '', dimensions: '',
    barcode: '', zone: 'Zone A (Dry)', aisle: 'Aisle 1 - Bin B',
    customer: '', destination: ''
  });

  const handleExport = () => {
    const headers = ['Asset ID', 'SKU/Cargo Item', 'Zone', 'Aisle/Bin Spot', 'Occupancy/Status'];
    const rows = [
      ['AST-9011', 'PLT-AUTO-19', 'Zone A (Dry)', 'Aisle 1 - Bin B', '92% (LANE A)'],
      ['AST-9012', 'PLT-AUTO-20', 'Zone B (Staging)', 'Aisle 1 - Bin B', '84% (LANE B)'],
      ['AST-9013', 'PLT-AUTO-21', 'Holding Areas', 'Aisle 2 - Bin A', '45%'],
      ['AST-9014', 'PLT-AUTO-22', 'Bunker Storage', 'Aisle 3 - Bin C', '15%']
    ];
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "warehouse_stock_list.csv");
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

  return (
    <div className="warehouse-dashboard">
      <div className="warehouse-header">
        <div className="warehouse-header-titles">
          <h1>Warehouse & Yard Workspace</h1>
          <p>Manage stock allocations, print asset tags, and spot load lanes.</p>
        </div>
        <div className="warehouse-header-actions">
          <div className="wh-segmented-control">
            <button
              className={`segmented-btn ${yardMode === 'car' ? 'active' : ''}`}
              onClick={() => setYardMode('car')}
            >Car Carrying Yard</button>
            <button
              className={`segmented-btn ${yardMode === 'freight' ? 'active' : ''}`}
              onClick={() => setYardMode('freight')}
            >General Freight</button>
          </div>
          <button className="btn btn-white-orange-wh with-icon" onClick={() => setBarcodeModal(true)}>
            <QrCode className="w-4 h-4 text-amber-500" style={{ color: '#d97706' }} /> Barcode Simulator
          </button>
          <button className="btn btn-white-orange-wh with-icon" onClick={() => setManualModal(true)}>
            <Plus className="w-4 h-4 text-amber-500" style={{ color: '#d97706' }} /> Manual Entry
          </button>
          <button className="btn btn-yellow-wh with-icon" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export Stock List
          </button>
        </div>
      </div>

      <div className="stats-grid stats-4">
        <div className="stat-card">
          <div className="stat-card-title">TOTAL STORED ASSETS</div>
          <div className="stat-card-value">4</div>
          <div className="stat-card-footer">
            <span className="footer-left">In active yard segregation</span>
            <span className="footer-right text-green">+3 new</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">OCCUPANCY LEVEL</div>
          <div className="stat-card-value">78%</div>
          <div className="progress-container">
            <div className="progress-bar"><div className="progress-fill" style={{ width: '78%' }}></div></div>
            <div className="progress-text">78%</div>
          </div>
          <div className="stat-card-footer">
            <span className="footer-left">Segregation capacity</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">LANES SPOTTED</div>
          <div className="stat-card-value">5 active</div>
          <div className="stat-card-footer">
            <span className="footer-left">Loading bay limits</span>
            <span className="footer-right">Normal</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">PENDING DISPATCHES</div>
          <div className="stat-card-value">3 Trucks</div>
          <div className="stat-card-footer">
            <span className="footer-left">Trailer staging queue</span>
            <span className="footer-right">3 ready</span>
          </div>
        </div>
      </div>

      <div className="warehouse-bottom-section">
        <h3 className="section-title">Zone Allocations & Limits</h3>
        <div className="zone-content">
          <div className="zone-cards">
            <div className="zone-card green-zone"><div className="zone-card-title">LANE A (PICKUP)</div><div className="zone-card-value">92%</div></div>
            <div className="zone-card green-zone"><div className="zone-card-title">LANE B (STAGING)</div><div className="zone-card-value">84%</div></div>
            <div className="zone-card yellow-zone"><div className="zone-card-title">HOLDING AREAS</div><div className="zone-card-value">45%</div></div>
            <div className="zone-card orange-zone"><div className="zone-card-title">BUNKER STORAGE</div><div className="zone-card-value">15%</div></div>
          </div>
          <div className="zone-chart-container">
            <div className="zone-chart-title">CAPACITY ALLOCATION</div>
            <div className="doughnut-chart"></div>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot dot-red"></span>Bunker</span>
              <span className="legend-item"><span className="dot dot-yellow"></span>Holding</span>
              <span className="legend-item"><span className="dot dot-blue"></span>Lane A</span>
              <span className="legend-item"><span className="dot dot-green"></span>Lane B</span>
            </div>
          </div>
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

              <button type="submit" className="wh-btn-submit">
                Ingest Asset (Independent of loads)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseDashboard;
