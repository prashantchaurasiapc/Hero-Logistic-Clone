import React, { useState } from 'react';
import './WarehouseDashboard.css';
import './YardDashboard.css';

// SVG Icons
const QrCodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

export default function YardScanIn() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [scanContainerId, setScanContainerId] = useState('');
  const [assignLocation, setAssignLocation] = useState('');
  const [validationError, setValidationError] = useState('');

  // Table State
  const [density, setDensity] = useState('RELAXED'); // COMPACT, DEFAULT, RELAXED
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [columns, setColumns] = useState({
    itemId: false,
    desc: false,
    status: true
  });

  // Mock table items
  const [manifestItems, setManifestItems] = useState([
    { id: 1, itemId: 'CTR-4402', desc: 'Standard dry van container', status: 'Completed', checked: false },
    { id: 2, itemId: 'CTR-9104', desc: 'Refrigerated container (reefer)', status: 'Pending Spot', checked: false },
    { id: 3, itemId: 'CTR-0029', desc: 'Flat rack heavy asset container', status: 'Pending Spot', checked: false }
  ]);

  const [toast, setToast] = useState(null);

  // Button Hover States
  const [hoverBtn, setHoverBtn] = useState(null);

  const toggleItemCheckbox = (id) => {
    setManifestItems(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const selectedCount = manifestItems.filter(item => item.checked).length;

  const handleScanInSubmit = (e) => {
    e.preventDefault();
    if (!scanContainerId.trim() || !assignLocation.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    // Add new item to manifest list
    const newItem = {
      id: Date.now(),
      itemId: scanContainerId,
      desc: `Inbound scanned container`,
      status: 'Pending Spot',
      checked: false
    };

    setManifestItems([newItem, ...manifestItems]);
    setToast(`Container ${scanContainerId} scanned in to ${assignLocation} successfully.`);
    setScanContainerId('');
    setAssignLocation('');
    setTimeout(() => setToast(null), 5000);
  };

  const handleScanQrSubmit = (scannedValue) => {
    setScanContainerId(scannedValue);
    setToast(`Scanned asset ID: ${scannedValue}`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleCsvExport = () => {
    const selectedItems = manifestItems.filter(i => i.checked);
    if (selectedItems.length === 0) return;

    const headers = ['Item ID', 'Description', 'Status'];
    const rows = selectedItems.map(item => [item.itemId, item.desc, item.status]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `yard_inward_manifest_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast(`Exported CSV successfully.`);
    setTimeout(() => setToast(null), 4000);
  };

  // Row padding based on density
  const getRowPadding = () => {
    if (density === 'COMPACT') return '8px 12px';
    if (density === 'DEFAULT') return '12px 16px';
    return '20px 24px'; // RELAXED
  };

  return (
    <div className="yard-scan-in-wrapper">

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8" style={{ flexShrink: 0, padding: '16px 20px', gap: 16 }}>
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Yard Attendant <span className="text-slate-400 text-xl mx-1">•</span> Scan In
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Perform gate checks, inspect trailers, and log spotted containers.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="yard-main-content">

        {/* Full width container box */}
        <div className="yard-container-box">

          <div className="yard-grid">

            {/* Left Card: Form */}
            <div className="yard-card">
              <h2 style={{ fontSize: 14.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Scan Inward Custody</h2>
              <p style={{ fontSize: 11.5, color: '#64748b', margin: '4px 0 20px 0' }}>
                Confirm inward receipt of containers, cars, or pallets into yard locations.
              </p>

              <form onSubmit={handleScanInSubmit}>
                <div className="yard-form-group">
                  <label className="yard-form-label">
                    SCAN CONTAINER / ASSET ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CTR-4402"
                    value={scanContainerId}
                    onChange={(e) => setScanContainerId(e.target.value)}
                    className="yard-form-input"
                  />
                </div>

                <div className="yard-form-group" style={{ marginBottom: 20 }}>
                  <label className="yard-form-label">
                    ASSIGN LOCATION SPOT
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A3"
                    value={assignLocation}
                    onChange={(e) => setAssignLocation(e.target.value)}
                    className="yard-form-input"
                  />
                </div>

                {/* Scan buttons layout */}
                <div className="yard-buttons-row">
                  <button
                    type="button"
                    onClick={() => {
                      setValidationError('');
                      setShowQrModal(true);
                    }}
                    onMouseEnter={() => setHoverBtn('scan-qr-btn')}
                    onMouseLeave={() => setHoverBtn(null)}
                    className="yard-btn-secondary"
                  >
                    <QrCodeIcon /> Scan QR
                  </button>

                  <button
                    type="submit"
                    onMouseEnter={() => setHoverBtn('scan-in-btn')}
                    onMouseLeave={() => setHoverBtn(null)}
                    className="yard-btn-primary"
                  >
                    Scan In
                  </button>
                </div>
              </form>
            </div>

            {/* Right Card: Active Inward Manifest */}
            <div className="yard-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>

              <div className="yard-manifest-header">
                <div>
                  <h2 style={{ fontSize: 14.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Active Yard Inward Manifest</h2>
                  <p style={{ fontSize: 11.5, color: '#64748b', margin: '4px 0 0 0' }}>
                    Review items waiting for spot check-in validation.
                  </p>
                </div>

                {/* Grid Density & Columns Control */}
                <div className="yard-controls-row">

                  {/* Density tabs styled container */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: '#f1f5f9',
                    borderRadius: 8,
                    padding: 3,
                    border: '1px solid #e2e8f0'
                  }}>
                    {['COMPACT', 'DEFAULT', 'RELAXED'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDensity(d)}
                        style={{
                          padding: '6px 12px',
                          fontSize: 10,
                          fontWeight: '800',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          backgroundColor: density === d ? '#ffcc00' : 'transparent',
                          color: density === d ? '#000000' : '#64748b',
                          outline: 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Columns Button */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #0f172a',
                        borderRadius: 10,
                        padding: '8px 14px',
                        fontSize: 11,
                        fontWeight: '800',
                        color: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <SettingsIcon /> COLUMNS
                    </button>

                    {/* Column Visibility dropdown */}
                    {showColumnDropdown && (
                      <div className="yard-dropdown-menu">
                        <span style={{ fontSize: 10.5, fontWeight: '800', color: '#64748b', display: 'block', marginBottom: 8, letterSpacing: '0.5px' }}>
                          COLUMN VISIBILITY
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={columns.itemId}
                              onChange={() => setColumns(prev => ({ ...prev, itemId: !prev.itemId }))}
                              style={{ width: 14, height: 14, cursor: 'pointer' }}
                            />
                            Item ID
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={columns.desc}
                              onChange={() => setColumns(prev => ({ ...prev, desc: !prev.desc }))}
                              style={{ width: 14, height: 14, cursor: 'pointer' }}
                            />
                            Description
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={columns.status}
                              onChange={() => setColumns(prev => ({ ...prev, status: !prev.status }))}
                              style={{ width: 14, height: 14, cursor: 'pointer' }}
                            />
                            Status
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Selected CSV Action row */}
              {selectedCount > 0 && (
                <div className="yard-csv-action-row">
                  <span style={{ fontSize: 10, fontWeight: '800', color: '#b45309', letterSpacing: '0.5px' }}>
                    {selectedCount} SELECTED
                  </span>
                  <button
                    onClick={handleCsvExport}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #ffcc00',
                      borderRadius: 8,
                      padding: '4px 10px',
                      fontSize: 10.5,
                      fontWeight: '800',
                      color: '#b45309',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <DownloadIcon /> CSV Export
                  </button>
                </div>
              )}

              {/* Table Container */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                overflowX: 'auto',
                backgroundColor: '#ffffff'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 16px', width: 40 }}>
                        <input
                          type="checkbox"
                          checked={selectedCount === manifestItems.length}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setManifestItems(prev => prev.map(item => ({ ...item, checked: val })));
                          }}
                          style={{ width: 15, height: 15, cursor: 'pointer' }}
                        />
                      </th>
                      {columns.itemId && <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: '800', color: '#64748b' }}>ITEM ID</th>}
                      {columns.desc && <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: '800', color: '#64748b' }}>DESCRIPTION</th>}
                      {columns.status && <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: '800', color: '#64748b' }}>STATUS</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {manifestItems.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: item.checked ? '#fffdf5' : '#ffffff',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <td style={{ padding: getRowPadding(), width: 40 }}>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleItemCheckbox(item.id)}
                            style={{ width: 15, height: 15, cursor: 'pointer' }}
                          />
                        </td>
                        {columns.itemId && (
                          <td style={{ padding: getRowPadding(), fontSize: 13, fontWeight: '600', color: '#334155' }}>
                            {item.itemId}
                          </td>
                        )}
                        {columns.desc && (
                          <td style={{ padding: getRowPadding(), fontSize: 12.5, color: '#64748b' }}>
                            {item.desc}
                          </td>
                        )}
                        {columns.status && (
                          <td style={{ padding: getRowPadding() }}>
                            <span style={{
                              fontSize: 13,
                              fontWeight: '800',
                              color: item.status === 'Completed' ? '#b45309' : '#ffcc00'
                            }}>
                              {item.status}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* QR / Barcode Scanner Modal */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            width: 'calc(100% - 32px)',
            maxWidth: 420,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: '800', color: '#0f172a', margin: 0 }}>QR / Barcode Scanner</h2>
              <button
                onClick={() => setShowQrModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const tempId = e.target.elements.scanInput.value;
                if (!tempId.trim()) {
                  setValidationError('Please fill out this field.');
                  return;
                }
                handleScanQrSubmit(tempId);
                setShowQrModal(false);
              }}
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>SCAN TYPE</label>
                <select
                  defaultValue="Container"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1.5px solid #ffcc00',
                    fontSize: 13,
                    color: '#334155',
                    fontWeight: '600',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="Trailer">Trailer</option>
                  <option value="Container">Container</option>
                  <option value="Vehicle">Vehicle</option>
                </select>
              </div>

              <div style={{
                height: 120,
                borderRadius: 12,
                border: '1.5px dashed #fde047',
                backgroundColor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"></path>
                  <rect x="7" y="7" width="3" height="3"></rect>
                  <rect x="14" y="7" width="3" height="3"></rect>
                  <rect x="14" y="14" width="3" height="3"></rect>
                  <rect x="7" y="14" width="3" height="3"></rect>
                </svg>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: '500' }}>Camera viewfinder (simulated)</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    name="scanInput"
                    type="text"
                    placeholder="e.g. CTR-4402"
                    onChange={(e) => {
                      if (e.target.value.trim()) setValidationError('');
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: validationError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none',
                      fontWeight: '500',
                      color: '#0f172a',
                      backgroundColor: '#ffffff'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#ffcc00',
                      border: 'none',
                      borderRadius: 12,
                      padding: '12px 20px',
                      fontSize: 13,
                      fontWeight: '800',
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(255,204,0,0.2)'
                    }}
                  >
                    <QrCodeIcon /> Scan
                  </button>
                </div>
                {validationError && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 6,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: '6px 12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    zIndex: 10,
                    fontSize: 11.5,
                    color: '#0f172a'
                  }}>
                    <span style={{ backgroundColor: '#ef4444', color: '#ffffff', width: 14, height: 14, borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: '800' }}>!</span>
                    <span>{validationError}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 24px', fontSize: 12, fontWeight: '700', color: '#334155', cursor: 'pointer', outline: 'none' }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast popup */}
      {toast && (
        <div className="yard-toast-popup">
          <div style={{ backgroundColor: '#3b82f6', color: '#ffffff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✓</div>
          <span style={{ fontSize: 13, fontWeight: '600', color: '#1e40af', flex: 1 }}>{toast}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', fontSize: 16, color: '#64748b', cursor: 'pointer', marginLeft: 8 }}>✕</button>
        </div>
      )}

    </div>
  );
}
