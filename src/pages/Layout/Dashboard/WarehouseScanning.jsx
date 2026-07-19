import React, { useState } from 'react';

const WarehouseScanning = () => {
  const [barcodeValue, setBarcodeValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('Scan Inward Stowing');
  const [decoderInput, setDecoderInput] = useState('');
  const [activeTriggerBtn, setActiveTriggerBtn] = useState(null); // 'scan-in', 'scan-out', 'barcode', 'qr', 'manual'
  const [toast, setToast] = useState(null);

  // Manual Ingestion Form State
  const [manualForm, setManualForm] = useState({
    vin: '',
    rego: '',
    stock: '',
    makeModel: '',
    location: 'Bay 1',
    loadLane: 'Unassigned',
    customer: '',
    delivery: ''
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenModal = (btnId, defaultMode = 'Scan Inward Stowing') => {
    setActiveTriggerBtn(btnId);
    setModalMode(defaultMode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveTriggerBtn(null);
    setDecoderInput('');
  };

  const handleOpenManualModal = () => {
    setActiveTriggerBtn('manual');
    setIsManualModalOpen(true);
  };

  const handleCloseManualModal = () => {
    setIsManualModalOpen(false);
    setActiveTriggerBtn(null);
    setManualForm({
      vin: '',
      rego: '',
      stock: '',
      makeModel: '',
      location: 'Bay 1',
      loadLane: 'Unassigned',
      customer: '',
      delivery: ''
    });
  };

  const handleSimulateScan = () => {
    const inputMsg = decoderInput.trim() ? ` [${decoderInput.trim()}]` : '';
    showToast(`Decoder successfully processed: ${modalMode}${inputMsg}.`);
    handleCloseModal();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    showToast('Asset manually ingested successfully.');
    handleCloseManualModal();
  };

  const handleDirectScanSubmit = (e) => {
    e.preventDefault();
    if (!barcodeValue.trim()) {
      showToast('Please enter a valid barcode or QR tag code.');
      return;
    }
    showToast(`Direct Input Scan Processed: "${barcodeValue.trim()}".`);
    setBarcodeValue('');
  };

  return (
    <div style={S.container}>
      {/* Page Header */}
      <div style={S.header}>
        <h1 style={S.pageTitle}>Warehouse &amp; Inventory &bull; Scanning</h1>
        <p style={S.pageSubtitle}>Log and register inbound/outbound stocks, verify pallets, and update movement logs.</p>
      </div>

      {/* Main Terminal Card */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <h2 style={S.cardHeaderTitle}>Warehouse Scanning Terminal</h2>
          <p style={S.cardHeaderSubtitle}>Scan physical barcodes, register stock tags, and log movements.</p>
        </div>

        {/* Outer Grid columns */}
        <div className="responsive-two-panel-grid" style={{ gap: '32px', alignItems: 'start' }}>
          {/* Left Panel: Scan Action Simulator */}
          <div style={S.panelLeft}>
            <h3 style={S.panelTitle}>Scan Action Simulator</h3>
            
            <form onSubmit={handleDirectScanSubmit} style={S.form}>
              <label style={S.label}>BARCODE INPUT TAG</label>
              <input
                type="text"
                placeholder="Enter barcode or QR code..."
                value={barcodeValue}
                onChange={(e) => setBarcodeValue(e.target.value)}
                style={S.input}
              />
            </form>

            {/* Action Buttons Grid */}
            <div style={S.buttonGrid}>
              <button
                onClick={() => handleOpenModal('scan-in', 'Scan Inward Stowing')}
                style={{
                  ...S.btnScanIn,
                  border: activeTriggerBtn === 'scan-in' ? '3px solid #000000' : 'none',
                  padding: activeTriggerBtn === 'scan-in' ? '11px 20px' : '14px 20px'
                }}
              >
                Scan In
              </button>

              <button
                onClick={() => handleOpenModal('scan-out', 'Scan Outward Dispatching')}
                style={{
                  ...S.btnScanOut,
                  border: activeTriggerBtn === 'scan-out' ? '3px solid #000000' : 'none',
                  padding: activeTriggerBtn === 'scan-out' ? '11px 20px' : '14px 20px'
                }}
              >
                Scan Out
              </button>

              <button
                onClick={() => handleOpenModal('barcode', 'Scan by 1D Barcode tag')}
                style={{
                  ...S.btnOutline,
                  border: activeTriggerBtn === 'barcode' ? '3px solid #000000' : '1px solid #cbd5e1',
                  padding: activeTriggerBtn === 'barcode' ? '11px 20px' : '13px 20px'
                }}
              >
                Scan by Barcode
              </button>

              <button
                onClick={() => handleOpenModal('qr', 'Scan by 2D QR Code tag')}
                style={{
                  ...S.btnOutline,
                  border: activeTriggerBtn === 'qr' ? '3px solid #000000' : '1px solid #cbd5e1',
                  padding: activeTriggerBtn === 'qr' ? '11px 20px' : '13px 20px'
                }}
              >
                Scan by QR
              </button>

              <button
                onClick={handleOpenManualModal}
                style={{
                  ...S.btnManual,
                  border: activeTriggerBtn === 'manual' ? '3px solid #000000' : '1px solid #fed7aa',
                  padding: activeTriggerBtn === 'manual' ? '11px 20px' : '13px 20px'
                }}
              >
                Manual Entry
              </button>
            </div>
          </div>

          {/* Right Panel: Device Status */}
          <div style={S.panelRight}>
            <h3 style={S.panelTitle}>Device Status</h3>
            <p style={S.deviceSubtitle}>Zebra Scanner handheld connected.</p>

            <div style={S.statusBadgeContainer}>
              <div style={S.statusBadge}>
                SCANNER ONLINE &bull; READY TO SCAN
              </div>
            </div>

            <p style={S.statusFooter}>
              * Scanning operations automatically update inventory locations and log movements history.
            </p>
          </div>
        </div>
      </div>

      {/* Barcode/QR Scanner Simulator Modal */}
      {isModalOpen && (
        <div style={S.modalOverlay} onClick={handleCloseModal}>
          <div style={S.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={S.modalHeader}>
              <h3 style={S.modalTitle}>Barcode/QR Scanner Simulator</h3>
              <button onClick={handleCloseModal} style={S.modalCloseBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div style={S.modalBody}>
              <label style={S.modalLabel}>SCANNER MODE ACTION</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={modalMode}
                  onChange={(e) => setModalMode(e.target.value)}
                  style={S.modalSelect}
                >
                  <option value="Scan Inward Stowing">Scan Inward Stowing</option>
                  <option value="Scan Outward Dispatching">Scan Outward Dispatching</option>
                  <option value="Scan by 1D Barcode tag">Scan by 1D Barcode tag</option>
                  <option value="Scan by 2D QR Code tag">Scan by 2D QR Code tag</option>
                </select>
              </div>

              <label style={S.modalLabel}>SCAN DECODER INPUT</label>
              <input
                type="text"
                placeholder="Scan Rego/VIN (e.g. QLD-88A or VIN-7YV1HP82A81920)"
                value={decoderInput}
                onChange={(e) => setDecoderInput(e.target.value)}
                style={S.modalInput}
              />

              <button onClick={handleSimulateScan} style={S.modalSubmitBtn}>
                Simulate Scan Decoder Trigger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Asset Ingestion Modal */}
      {isManualModalOpen && (
        <div style={S.modalOverlay} onClick={handleCloseManualModal}>
          <div style={{ ...S.modalContent, maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={S.modalHeader}>
              <h3 style={S.modalTitle}>Manual Asset Ingestion</h3>
              <button onClick={handleCloseManualModal} style={S.modalCloseBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleManualSubmit} style={S.modalBody}>
              {/* VEHICLE VIN NUMBER */}
              <label style={S.modalLabel}>VEHICLE VIN NUMBER</label>
              <input
                type="text"
                placeholder="e.g. 7YV1HP82A81920"
                value={manualForm.vin}
                onChange={(e) => setManualForm({ ...manualForm, vin: e.target.value })}
                style={S.modalInput}
              />

              {/* REGO PLATE CODE & STOCK NUMBER */}
              <div style={S.gridRow2}>
                <div>
                  <label style={S.modalLabel}>REGO PLATE CODE</label>
                  <input
                    type="text"
                    placeholder="e.g. QLD-88A"
                    value={manualForm.rego}
                    onChange={(e) => setManualForm({ ...manualForm, rego: e.target.value })}
                    style={S.modalInput}
                  />
                </div>
                <div>
                  <label style={S.modalLabel}>STOCK NUMBER</label>
                  <input
                    type="text"
                    placeholder="e.g. STK-4401"
                    value={manualForm.stock}
                    onChange={(e) => setManualForm({ ...manualForm, stock: e.target.value })}
                    style={S.modalInput}
                  />
                </div>
              </div>

              {/* VEHICLE MAKE / MODEL */}
              <label style={S.modalLabel}>VEHICLE MAKE / MODEL</label>
              <input
                type="text"
                placeholder="e.g. Toyota Hilux Double-Cab"
                value={manualForm.makeModel}
                onChange={(e) => setManualForm({ ...manualForm, makeModel: e.target.value })}
                style={S.modalInput}
              />

              {/* INITIAL YARD LOCATION & OUTBOUND LOAD LANE */}
              <div style={S.gridRow2}>
                <div>
                  <label style={S.modalLabel}>INITIAL YARD LOCATION</label>
                  <select
                    value={manualForm.location}
                    onChange={(e) => setManualForm({ ...manualForm, location: e.target.value })}
                    style={S.modalSelect}
                  >
                    <option value="Bay 1">Bay 1</option>
                    <option value="Bay 2">Bay 2</option>
                    <option value="Bay 3">Bay 3</option>
                  </select>
                </div>
                <div>
                  <label style={S.modalLabel}>OUTBOUND LOAD LANE</label>
                  <select
                    value={manualForm.loadLane}
                    onChange={(e) => setManualForm({ ...manualForm, loadLane: e.target.value })}
                    style={S.modalSelect}
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="Lane A1">Lane A1</option>
                    <option value="Lane A2">Lane A2</option>
                  </select>
                </div>
              </div>

              {/* BILLING CUSTOMER & DESTINATION DELIVERY */}
              <div style={S.gridRow2}>
                <div>
                  <label style={S.modalLabel}>BILLING CUSTOMER</label>
                  <input
                    type="text"
                    placeholder="e.g. Toyota Australia"
                    value={manualForm.customer}
                    onChange={(e) => setManualForm({ ...manualForm, customer: e.target.value })}
                    style={S.modalInput}
                  />
                </div>
                <div>
                  <label style={S.modalLabel}>DESTINATION DELIVERY</label>
                  <input
                    type="text"
                    placeholder="e.g. Brisbane Port"
                    value={manualForm.delivery}
                    onChange={(e) => setManualForm({ ...manualForm, delivery: e.target.value })}
                    style={S.modalInput}
                  />
                </div>
              </div>

              {/* Submit button */}
              <button type="submit" style={S.modalSubmitBtn}>
                Ingest Asset (Independent of loads)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={S.toastContainer}>
          <div style={S.toastIcon}>✓</div>
          <span style={S.toastText}>{toast}</span>
          <button onClick={() => setToast(null)} style={S.toastCloseBtn}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes whModalIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* ─── Styles Object ─── */
const S = {
  container: {
    padding: '24px 32px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    marginBottom: 24,
    textAlign: 'left'
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 8px 0'
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748b',
    margin: 0
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    padding: 32,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    textAlign: 'left'
  },
  cardHeader: {
    marginBottom: 28
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 6px 0'
  },
  cardHeaderSubtitle: {
    fontSize: 13.5,
    color: '#64748b',
    margin: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: 32,
    alignItems: 'start'
  },
  panelLeft: {
    border: '1px solid #f1f5f9',
    borderRadius: 12,
    padding: 24,
    backgroundColor: '#ffffff'
  },
  panelRight: {
    border: '1px solid #f1f5f9',
    borderRadius: 12,
    padding: 24,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 280,
    boxSizing: 'border-box'
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 16px 0'
  },
  form: {
    marginBottom: 20
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.5px',
    marginBottom: 8
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.15s ease',
    ':focus': {
      borderColor: '#FFCC00',
      boxShadow: '0 0 0 3px rgba(255, 204, 0, 0.15)'
    }
  },
  buttonGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12
  },
  btnScanIn: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 30,
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    flex: '1 1 calc(50% - 12px)',
    minWidth: 120,
    boxSizing: 'border-box',
    textAlign: 'center'
  },
  btnScanOut: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: 30,
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    flex: '1 1 calc(50% - 12px)',
    minWidth: 120,
    boxSizing: 'border-box',
    textAlign: 'center'
  },
  btnOutline: {
    backgroundColor: '#ffffff',
    color: '#334155',
    borderRadius: 30,
    fontSize: 13,
    fontWeight: '700',
    cursor: 'pointer',
    flex: '1 1 calc(33.33% - 12px)',
    minWidth: 140,
    boxSizing: 'border-box',
    textAlign: 'center'
  },
  btnManual: {
    backgroundColor: '#ffffff',
    color: '#ea580c',
    borderRadius: 30,
    fontSize: 13,
    fontWeight: '700',
    cursor: 'pointer',
    flex: '1 1 calc(33.33% - 12px)',
    minWidth: 140,
    boxSizing: 'border-box',
    textAlign: 'center'
  },
  deviceSubtitle: {
    fontSize: 13,
    color: '#64748b',
    margin: '0 0 24px 0'
  },
  statusBadgeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: '24px 0'
  },
  statusBadge: {
    backgroundColor: '#ecfdf5',
    color: '#10b981',
    border: '1px solid #a7f3d0',
    borderRadius: 8,
    padding: '14px 16px',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: '0.5px',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  statusFooter: {
    fontSize: 11,
    color: '#94a3b8',
    margin: 0,
    fontStyle: 'italic',
    lineHeight: 1.4
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 20
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 520,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    textAlign: 'left'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 28px 16px 28px',
    borderBottom: '1px solid #f1f5f9'
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 8,
    ':hover': {
      backgroundColor: '#f1f5f9'
    }
  },
  modalBody: {
    padding: '8px 28px 28px 28px',
    display: 'flex',
    flexDirection: 'column'
  },
  modalLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: '0.8px',
    marginBottom: 8,
    marginTop: 16
  },
  modalSelect: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0f172a',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    appearance: 'none',
    boxSizing: 'border-box',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    paddingRight: 40,
    transition: 'all 0.15s ease',
    ':focus': {
      borderColor: '#FFCC00',
      boxShadow: '0 0 0 3px rgba(255, 204, 0, 0.15)'
    }
  },
  modalInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    fontSize: 13.5,
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.15s ease',
    ':focus': {
      borderColor: '#FFCC00',
      boxShadow: '0 0 0 3px rgba(255, 204, 0, 0.15)'
    }
  },
  modalSubmitBtn: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 12,
    padding: '14px 20px',
    fontSize: 13.5,
    fontWeight: '800',
    cursor: 'pointer',
    marginTop: 24,
    boxShadow: '0 4px 14px rgba(255, 204, 0, 0.35)',
    transition: 'all 0.15s ease',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box'
  },
  gridRow2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16
  },
  // Toast Styles
  toastContainer: {
    position: 'fixed',
    bottom: 40,
    right: 32,
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: 12,
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    zIndex: 2000,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
    maxWidth: 420,
    animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  toastIcon: {
    color: '#10b981',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 1
  },
  toastText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#065f46',
    flex: 1
  },
  toastCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    color: '#64748b',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1
  }
};

export default WarehouseScanning;
