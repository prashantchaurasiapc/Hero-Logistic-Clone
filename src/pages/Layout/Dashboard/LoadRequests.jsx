import React, { useState } from 'react';
import './CustomerDashboard.css';

// Custom Checkbox Component
const CustomCheckbox = ({ checked, onChange }) => {
  return (
    <div 
      onClick={onChange}
      style={{
        width: 18,
        height: 18,
        borderRadius: 4,
        border: checked ? '2.5px solid #b45309' : '2.5px solid #94a3b8',
        backgroundColor: checked ? '#fffbeb' : '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.1s ease',
        boxSizing: 'border-box',
        margin: '0 auto'
      }}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </div>
  );
};

const LoadRequests = () => {
  const [density, setDensity] = useState('RELAXED'); // COMPACT, DEFAULT, RELAXED
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  
  // Modals States
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Submit Load Form States
  const [cargoSpecs, setCargoSpecs] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [routePath, setRoutePath] = useState('');

  // Add Address Form States
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [accessCode, setAccessCode] = useState('');

  // Support Form States
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');

  const [toast, setToast] = useState(null);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState({
    requestId: true,
    cargoSpecs: true,
    routePath: true,
    requestState: true
  });

  const columnsList = [
    { key: 'requestId', label: 'Request ID' },
    { key: 'cargoSpecs', label: 'Cargo specs' },
    { key: 'routePath', label: 'Route Path' },
    { key: 'requestState', label: 'Request State' }
  ];

  // Mock Load Requests Data
  const [requests, setRequests] = useState([
    { id: '1', requestId: 'REQ-9912', cargoSpecs: 'Automotive components (42,000 lbs)', routePath: 'Chicago IL ➔ Dallas TX', requestState: 'APPROVED', checked: false },
    { id: '2', requestId: 'REQ-9913', cargoSpecs: 'Dry Grocery Pallets (15,000 lbs)', routePath: 'New York NY ➔ Boston MA', requestState: 'PENDING', checked: false }
  ]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    showToast('Support ticket submitted successfully.');
    setShowSupportModal(false);
    setSupportSubject('');
    setSupportDescription('');
  };

  const handleLoadSubmit = (e) => {
    e.preventDefault();
    const newId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq = {
      id: String(requests.length + 1),
      requestId: newId,
      cargoSpecs: `${cargoSpecs} (${cargoWeight} lbs)`,
      routePath: routePath || 'Chicago IL ➔ Dallas TX',
      requestState: 'PENDING',
      checked: false
    };
    setRequests(prev => [newReq, ...prev]);
    showToast(`Successfully requested load dispatch ${newId}`);
    setShowSubmitModal(false);
    setCargoSpecs('');
    setCargoWeight('');
    setRoutePath('');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    showToast('Delivery site instructions saved.');
    setShowAddressModal(false);
    setDeliveryAddress('');
    setContactPerson('');
    setSpecialInstructions('');
    setAccessCode('');
  };

  // Checkbox Handlers
  const isAllChecked = requests.length > 0 && requests.every(r => r.checked);

  const handleMasterCheckbox = () => {
    const targetState = !isAllChecked;
    setRequests(prev => prev.map(r => ({ ...r, checked: targetState })));
  };

  const handleRowCheckbox = (id) => {
    setRequests(prev => prev.map(r => 
      r.id === id ? { ...r, checked: !r.checked } : r
    ));
  };

  // CSV Export Trigger
  const handleCsvExport = () => {
    const selectedReqs = requests.filter(r => r.checked);
    const dataToExport = selectedReqs.length > 0 ? selectedReqs : requests;
    
    // Create CSV content
    const headers = ['Request ID', 'Cargo Specs', 'Route Path', 'Request State'];
    const rows = dataToExport.map(r => [
      r.requestId,
      r.cargoSpecs,
      r.routePath,
      r.requestState
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "load_requests.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Successfully exported CSV for ${dataToExport.length} requests.`);
  };

  const getCellPadding = () => {
    if (density === 'COMPACT') return '10px 16px';
    if (density === 'DEFAULT') return '16px 20px';
    return '24px 28px'; // RELAXED
  };

  return (
    <div className="customer-dashboard" style={{ height: 'calc(100vh - 125px)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
      {/* Header Container */}
      <div className="customer-header-container" style={{ flexShrink: 0 }}>
        <div>
          <h1 className="customer-title">Customer Shipper Portal &bull; Load Requests</h1>
          <p className="customer-subtitle">Request load deliveries, audit invoices, download BOL papers, and track active route paths.</p>
        </div>
        <button onClick={() => setShowSupportModal(true)} className="contact-support-btn">Contact Support</button>
      </div>

      {/* Main Single Card Panel */}
      <div style={S.mainCard}>
        <div style={S.cardHeader}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <h2 style={S.cardTitle}>Load Requests &amp; Bookings</h2>
              
              {/* Selected Pills (CSV Export) - Only shows when at least 1 checked */}
              {requests.some(r => r.checked) && (
                <div style={S.selectedPill}>
                  <span style={S.selectedPillText}>
                    {requests.filter(r => r.checked).length} SELECTED
                  </span>
                  <button onClick={handleCsvExport} style={S.csvExportBtn}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 5, verticalAlign: 'middle'}}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>CSV Export</span>
                  </button>
                </div>
              )}
            </div>
            <p style={S.cardSubtitle}>Request trailer dispatches, add location instructions, and review booking history.</p>
          </div>

          <div style={S.headerControlsStack}>
            {/* Top Row: Action Buttons */}
            <div style={S.topActionRow}>
              <button 
                onClick={() => setShowSubmitModal(true)}
                style={S.submitRequestBtn}
              >
                Submit Load Request
              </button>
              <button 
                onClick={() => setShowAddressModal(true)}
                style={S.addAddressBtn}
              >
                Add Delivery Address
              </button>
            </div>

            {/* Bottom Row: Density & Column Controls */}
            <div style={S.bottomControlsRow}>
              {/* Density Controls Pill */}
              <div style={S.densityPill}>
                {['COMPACT', 'DEFAULT', 'RELAXED'].map((d) => (
                  <span
                    key={d}
                    onClick={() => setDensity(d)}
                    style={{
                      ...S.densityOption,
                      backgroundColor: density === d ? '#FFCC00' : 'transparent',
                      color: density === d ? '#000000' : '#64748b',
                      fontWeight: density === d ? '800' : '600',
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Column Visibility Trigger */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
                  style={{
                    ...S.columnsBtn,
                    border: showColumnsDropdown ? '2px solid #000000' : '1px solid #cbd5e1',
                    padding: showColumnsDropdown ? '4px 14px' : '5px 15px'
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6, verticalAlign: 'middle'}}>
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span style={{verticalAlign: 'middle'}}>COLUMNS</span>
                </button>

                {showColumnsDropdown && (
                  <>
                    <div style={S.dropdownOverlay} onClick={() => setShowColumnsDropdown(false)} />
                    <div style={S.dropdownPanel}>
                      <div style={S.dropdownTitle}>COLUMN VISIBILITY</div>
                      {columnsList.map((col) => (
                        <label key={col.key} style={S.dropdownLabel}>
                          <input 
                            type="checkbox" 
                            checked={visibleColumns[col.key]}
                            onChange={() => toggleColumn(col.key)}
                            style={S.checkboxInput}
                          />
                          <span>{col.label}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Load Requests Table */}
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr style={S.theadRow}>
                <th style={{ ...S.th, padding: getCellPadding(), width: 64, textAlign: 'center' }}>
                  <CustomCheckbox 
                    checked={isAllChecked}
                    onChange={handleMasterCheckbox}
                  />
                </th>
                {visibleColumns.requestId && <th style={{ ...S.th, padding: getCellPadding() }}>REQUEST ID</th>}
                {visibleColumns.cargoSpecs && <th style={{ ...S.th, padding: getCellPadding() }}>CARGO SPECS</th>}
                {visibleColumns.routePath && <th style={{ ...S.th, padding: getCellPadding() }}>ROUTE PATH</th>}
                {visibleColumns.requestState && <th style={{ ...S.th, padding: getCellPadding() }}>REQUEST STATE</th>}
              </tr>
            </thead>
            <tbody>
              {requests.map((row) => (
                <tr 
                  key={row.id} 
                  style={{
                    ...S.tbodyRow,
                    backgroundColor: row.checked ? '#fefce8' : 'transparent'
                  }}
                >
                  <td style={{ ...S.td, padding: getCellPadding(), textAlign: 'center' }}>
                    <CustomCheckbox 
                      checked={row.checked}
                      onChange={() => handleRowCheckbox(row.id)}
                    />
                  </td>
                  {visibleColumns.requestId && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '700', color: '#0f172a' }}>{row.requestId}</td>}
                  {visibleColumns.cargoSpecs && <td style={{ ...S.td, padding: getCellPadding(), color: '#334155', fontWeight: '600' }}>{row.cargoSpecs}</td>}
                  {visibleColumns.routePath && <td style={{ ...S.td, padding: getCellPadding(), color: '#475569', fontWeight: '600' }}>{row.routePath}</td>}
                  {visibleColumns.requestState && (
                    <td style={{ ...S.td, padding: getCellPadding() }}>
                      <span 
                        style={{
                          ...S.statePill,
                          backgroundColor: row.requestState === 'APPROVED' ? '#f1f5f9' : '#fffbeb',
                          color: row.requestState === 'APPROVED' ? '#475569' : '#d97706',
                          border: row.requestState === 'APPROVED' ? '1px solid #e2e8f0' : '1px solid #fef08a'
                        }}
                      >
                        {row.requestState}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Load Request Dialog Modal */}
      {showSubmitModal && (
        <div style={S.modalCenterOverlay} onClick={() => setShowSubmitModal(false)}>
          <div style={S.dialogContent} onClick={(e) => e.stopPropagation()}>
            <div style={S.dialogHeader}>
              <h2 style={S.dialogTitle}>Book New Cargo Shipment Load</h2>
              <button onClick={() => setShowSubmitModal(false)} style={S.closeBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleLoadSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={S.dialogBody}>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>CARGO SPECS / ITEMS</label>
                  <input 
                    type="text" 
                    value={cargoSpecs}
                    onChange={(e) => setCargoSpecs(e.target.value)}
                    placeholder="e.g. Dry Grocery Pallets" 
                    style={S.textInput}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                  <div style={{ flex: 1 }}>
                    <label style={S.fieldLabel}>CARGO WEIGHT (LBS)</label>
                    <input 
                      type="text" 
                      value={cargoWeight}
                      onChange={(e) => setCargoWeight(e.target.value)}
                      placeholder="e.g. 12000" 
                      style={S.textInput}
                      required
                    />
                  </div>
                  <div style={{ flex: 1.5 }}>
                    <label style={S.fieldLabel}>ROUTE PATH ORIGIN/DEST</label>
                    <input 
                      type="text" 
                      value={routePath}
                      onChange={(e) => setRoutePath(e.target.value)}
                      placeholder="e.g. Chicago IL ➔ Atlanta GA" 
                      style={S.textInput}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={S.dialogFooter}>
                <button type="submit" style={S.btnSubmitLoad}>Book Delivery Load</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Site Instruction Dialog Modal */}
      {showAddressModal && (
        <div style={S.modalCenterOverlay} onClick={() => setShowAddressModal(false)}>
          <div style={S.dialogContent} onClick={(e) => e.stopPropagation()}>
            <div style={S.dialogHeader}>
              <h2 style={S.dialogTitle}>Add Site Instruction</h2>
              <button onClick={() => setShowAddressModal(false)} style={S.closeBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddressSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={S.dialogBody}>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>DELIVERY ADDRESS *</label>
                  <input 
                    type="text" 
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. 100 Logistics Blvd, Chicago IL" 
                    style={S.textInput}
                    required
                  />
                </div>

                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>SITE CONTACT PERSON *</label>
                  <input 
                    type="text" 
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Mike Thompson" 
                    style={S.textInput}
                    required
                  />
                </div>

                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>SPECIAL DELIVERY INSTRUCTIONS</label>
                  <input 
                    type="text" 
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Ring buzzer at Gate 4..." 
                    style={S.textInput}
                  />
                </div>

                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>SITE ACCESS CODE</label>
                  <input 
                    type="text" 
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="e.g. GATE-102" 
                    style={S.textInput}
                  />
                </div>
              </div>

              <div style={S.modalFooterRow}>
                <button type="button" onClick={() => setShowAddressModal(false)} style={S.btnCancelAddress}>Cancel</button>
                <button type="submit" style={S.btnSaveAddress}>Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Support Ticket Modal (Drawer) */}
      {showSupportModal && (
        <div style={S.modalOverlay} onClick={() => setShowSupportModal(false)}>
          <div style={S.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>Shipper Help Desk &amp; Ticket Center</h2>
              <button onClick={() => setShowSupportModal(false)} style={S.closeBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={S.modalBody}>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>SUBJECT HEADING</label>
                  <input 
                    type="text" 
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    placeholder="e.g. Shipment update delay" 
                    style={S.textInput}
                    required
                  />
                </div>

                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>PROBLEM DESCRIPTION</label>
                  <textarea 
                    value={supportDescription}
                    onChange={(e) => setSupportDescription(e.target.value)}
                    placeholder="Please provide specific details..." 
                    style={S.textareaInput}
                    required
                  />
                </div>
              </div>

              <div style={S.modalFooter}>
                <button type="button" onClick={() => setShowSupportModal(false)} style={S.btnCancel}>Cancel</button>
                <button type="submit" style={S.btnSubmit}>Submit Ticket</button>
              </div>
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
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

/* ─── Styles Object ─── */
const S = {
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '24px 32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
    marginTop: 24,
    flex: 1
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  cardSubtitle: {
    fontSize: 13.5,
    color: '#64748b',
    margin: '4px 0 0 0',
    fontWeight: '500'
  },
  headerControlsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    alignItems: 'flex-end'
  },
  topActionRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  },
  bottomControlsRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  },
  submitRequestBtn: {
    backgroundColor: '#FFCC00',
    border: 'none',
    borderRadius: 30,
    padding: '8px 24px',
    color: '#000000',
    fontSize: 12.5,
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(255, 204, 0, 0.25)',
    transition: 'all 0.15s ease',
    outline: 'none',
    boxSizing: 'border-box'
  },
  addAddressBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 30,
    padding: '8px 24px',
    color: '#334155',
    fontSize: 12.5,
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
    boxSizing: 'border-box'
  },
  selectedPill: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fde047',
    borderRadius: 12,
    padding: '6px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },
  selectedPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#b45309',
    letterSpacing: '0.5px'
  },
  csvExportBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #b45309',
    borderRadius: 20,
    padding: '4px 12px',
    color: '#b45309',
    fontSize: 11,
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s ease'
  },
  densityPill: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    borderRadius: 30,
    padding: 4,
    border: '1px solid #e2e8f0'
  },
  densityOption: {
    padding: '6px 16px',
    borderRadius: 30,
    fontSize: 10.5,
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.15s ease'
  },
  columnsBtn: {
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1px solid #cbd5e1',
    borderRadius: 30,
    fontSize: 10.5,
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    boxSizing: 'border-box',
    transition: 'all 0.15s ease',
    outline: 'none'
  },
  dropdownOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10
  },
  dropdownPanel: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: 16,
    zIndex: 20,
    width: 220
  },
  dropdownTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 12,
    letterSpacing: '0.5px'
  },
  dropdownLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    fontSize: 13.5,
    color: '#475569',
    cursor: 'pointer',
    userSelect: 'none'
  },
  checkboxInput: {
    width: 16,
    height: 16,
    cursor: 'pointer'
  },
  tableWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  theadRow: {
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  },
  th: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tbodyRow: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.15s ease'
  },
  td: {
    fontSize: 13.5,
    color: '#334155'
  },
  statePill: {
    padding: '4px 12px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: '800',
    display: 'inline-block'
  },
  modalCenterOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    fontFamily: "'Outfit', 'Inter', sans-serif"
  },
  dialogContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: 500,
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column'
  },
  dialogHeader: {
    padding: '24px 28px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.15s ease'
  },
  dialogBody: {
    padding: '28px'
  },
  dialogFooter: {
    padding: '0 28px 28px 28px',
    display: 'flex',
    flexDirection: 'column'
  },
  btnSubmitLoad: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    padding: '12px 28px',
    fontSize: 13.5,
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(255, 204, 0, 0.35)',
    transition: 'all 0.15s ease',
    width: '100%'
  },
  modalFooterRow: {
    padding: '0 28px 28px 28px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12
  },
  btnCancelAddress: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    padding: '10px 24px',
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnSaveAddress: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    padding: '10px 28px',
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(255, 204, 0, 0.35)',
    transition: 'all 0.15s ease'
  },
  fieldGroup: {
    marginBottom: 20
  },
  fieldLabel: {
    display: 'block',
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 8,
    letterSpacing: '0.5px'
  },
  textInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1000,
    fontFamily: "'Outfit', 'Inter', sans-serif"
  },
  modalContent: {
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
    maxWidth: 450,
    boxShadow: '-10px 0 25px -5px rgba(0, 0, 0, 0.1), -5px 0 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    borderLeft: '1px solid #e2e8f0',
    borderRadius: '16px 0 0 16px',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  modalHeader: {
    padding: '24px 28px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  modalBody: {
    padding: '28px',
    flex: 1
  },
  textareaInput: {
    width: '100%',
    height: 120,
    padding: '12px 16px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
    transition: 'border-color 0.15s ease'
  },
  modalFooter: {
    padding: '20px 28px 28px 28px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    borderTop: '1px solid #f1f5f9'
  },
  btnCancel: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
    borderRadius: 30,
    padding: '10px 24px',
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnSubmit: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 30,
    padding: '10px 28px',
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(255, 204, 0, 0.35)',
    transition: 'all 0.15s ease'
  },
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
    zIndex: 1100,
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

export default LoadRequests;
