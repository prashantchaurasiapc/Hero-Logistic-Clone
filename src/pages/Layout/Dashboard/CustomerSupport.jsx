import React, { useState } from 'react';
import './CustomerDashboard.css';

// SVG Gear Icon for Columns Button
const GearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

// SVG CSV Download Icon
const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

// Custom Checkbox Component
const CustomCheckbox = ({ checked, onChange }) => (
  <div 
    onClick={onChange}
    style={{
      width: 16,
      height: 16,
      borderRadius: 4,
      border: checked ? '2px solid #0066cc' : '2px solid #cbd5e1',
      backgroundColor: checked ? '#0066cc' : '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      boxSizing: 'border-box',
      userSelect: 'none'
    }}
  >
    {checked && (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    )}
  </div>
);

const CustomerSupport = () => {
  // Support Tickets State
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-1001',
      subject: 'Delayed shipment delivery Springfield',
      dateFiled: '2026-07-15',
      status: 'OPEN'
    },
    {
      id: 'TKT-1002',
      subject: 'Invoice amount discrepancy INV-3981',
      dateFiled: '2026-07-16',
      status: 'OPEN'
    }
  ]);

  // Form Fields State
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // UI Settings State
  const [density, setDensity] = useState('RELAXED'); // COMPACT, DEFAULT, RELAXED
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [visibleCols, setVisibleCols] = useState({
    ticketId: true,
    subject: true,
    dateFiled: true,
    stateStatus: true
  });

  // Selection State
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Drawer / Toast States
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');
  const [toast, setToast] = useState(null);

  // Trigger Toast Notification
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Row selection handlers
  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === tickets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tickets.map(t => t.id));
    }
  };

  // Submit Support Ticket Form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const tktNum = Math.floor(1000 + Math.random() * 9000);
    const newTkt = {
      id: `TKT-${tktNum}`,
      subject: subject,
      dateFiled: new Date().toISOString().split('T')[0],
      status: 'OPEN'
    };

    setTickets(prev => [newTkt, ...prev]);
    setSubject('');
    setDescription('');
    triggerToast('Support request registered. Developer logs created.');
  };

  // Submit Support modal/drawer ticket
  const handleModalSubmit = (e) => {
    e.preventDefault();
    triggerToast('Support request registered. Developer logs created.');
    setShowSupportModal(false);
    setSupportSubject('');
    setSupportDescription('');
  };

  // CSV Export logic
  const handleExportCSV = () => {
    const selectedTickets = tickets.filter(t => selectedIds.includes(t.id));
    if (selectedTickets.length === 0) return;

    // Headers based on visible columns
    const headers = [];
    if (visibleCols.ticketId) headers.push('Ticket ID');
    if (visibleCols.subject) headers.push('Subject Heading');
    if (visibleCols.dateFiled) headers.push('Date Filed');
    if (visibleCols.stateStatus) headers.push('State Status');

    // If no columns are visible, export all fields as fallback
    const useFallback = headers.length === 0;
    const finalHeaders = useFallback 
      ? ['Ticket ID', 'Subject Heading', 'Date Filed', 'State Status']
      : headers;

    const csvRows = [finalHeaders.join(',')];

    for (const tkt of selectedTickets) {
      const row = [];
      if (useFallback || visibleCols.ticketId) row.push(`"${tkt.id}"`);
      if (useFallback || visibleCols.subject) row.push(`"${tkt.subject.replace(/"/g, '""')}"`);
      if (useFallback || visibleCols.dateFiled) row.push(`"${tkt.dateFiled}"`);
      if (useFallback || visibleCols.stateStatus) row.push(`"${tkt.status}"`);
      csvRows.push(row.join(','));
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `support_tickets_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('CSV file downloaded successfully.');
  };

  // Sizing styles depending on Table Density
  const getDensityStyle = () => {
    switch (density) {
      case 'COMPACT':
        return { padding: '8px 12px', fontSize: '11.5px' };
      case 'DEFAULT':
        return { padding: '12px 16px', fontSize: '12px' };
      case 'RELAXED':
      default:
        return { padding: '16px 20px', fontSize: '13px' };
    }
  };

  const densityPadding = getDensityStyle();

  return (
    <div className="customer-dashboard documents-wrapper">
      {/* Header Panel */}
      <div className="customer-header-container" style={{ flexShrink: 0 }}>
        <div>
          <h1 className="customer-title" style={{ fontSize: '20px', fontWeight: '800' }}>Customer Shipper Portal &bull; Support</h1>
          <p className="customer-subtitle" style={{ fontSize: '12.5px', marginTop: '2px' }}>Request load deliveries, audit invoices, download BOL papers, and track active route paths.</p>
        </div>
        <button onClick={() => setShowSupportModal(true)} className="contact-support-btn" style={{ fontSize: '12px', padding: '6px 14px' }}>Contact Support</button>
      </div>

      {/* Two Columns Layout */}
      <div className="documents-grid">
        
        {/* Left Column: Support Tickets History */}
        <div style={S.leftPanel}>
          {/* Header controls row */}
          <div style={S.leftHeader}>
            <div style={S.leftHeaderLeft}>
              <h2 style={S.leftTitle}>Support Tickets history</h2>
              {/* Conditional CSV Exporter Button */}
              {selectedIds.length > 0 && (
                <div style={S.selectedActions}>
                  <span style={S.selectedText}>{selectedIds.length} SELECTED</span>
                  <button onClick={handleExportCSV} style={S.csvBtn}>
                    <DownloadIcon />
                    CSV Export
                  </button>
                </div>
              )}
            </div>

            <div style={S.leftHeaderRight}>
              {/* Density toggle buttons */}
              <div style={S.densityWrapper}>
                {['COMPACT', 'DEFAULT', 'RELAXED'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    style={{
                      ...S.densityBtn,
                      backgroundColor: density === d ? '#FFCC00' : 'transparent',
                      color: density === d ? '#000000' : '#64748b',
                      fontWeight: density === d ? '800' : '600'
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Columns Selector Button */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowColumnsDropdown(prev => !prev)} 
                  style={{
                    ...S.columnsBtn,
                    borderColor: showColumnsDropdown ? '#ffcc00' : '#cbd5e1',
                    boxShadow: showColumnsDropdown ? '0 0 0 2px rgba(255, 204, 0, 0.2)' : 'none'
                  }}
                >
                  <GearIcon />
                  COLUMNS
                </button>

                {/* Dropdown for Columns Visibility */}
                {showColumnsDropdown && (
                  <div className="columns-dropdown-panel" style={S.dropdownMenu}>
                    <div style={S.dropdownHeader}>COLUMN VISIBILITY</div>
                    
                    <label style={S.dropdownItem}>
                      <input
                        type="checkbox"
                        checked={visibleCols.ticketId}
                        onChange={() => setVisibleCols(prev => ({ ...prev, ticketId: !prev.ticketId }))}
                        style={S.dropdownCheckbox}
                      />
                      Ticket ID
                    </label>

                    <label style={S.dropdownItem}>
                      <input
                        type="checkbox"
                        checked={visibleCols.subject}
                        onChange={() => setVisibleCols(prev => ({ ...prev, subject: !prev.subject }))}
                        style={S.dropdownCheckbox}
                      />
                      Subject Heading
                    </label>

                    <label style={S.dropdownItem}>
                      <input
                        type="checkbox"
                        checked={visibleCols.dateFiled}
                        onChange={() => setVisibleCols(prev => ({ ...prev, dateFiled: !prev.dateFiled }))}
                        style={S.dropdownCheckbox}
                      />
                      Date Filed
                    </label>

                    <label style={S.dropdownItem}>
                      <input
                        type="checkbox"
                        checked={visibleCols.stateStatus}
                        onChange={() => setVisibleCols(prev => ({ ...prev, stateStatus: !prev.stateStatus }))}
                        style={S.dropdownCheckbox}
                      />
                      State Status
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead style={S.thead}>
                <tr>
                  <th style={{ ...S.th, ...densityPadding, width: 40 }}>
                    <CustomCheckbox 
                      checked={tickets.length > 0 && selectedIds.length === tickets.length} 
                      onChange={handleSelectAll} 
                    />
                  </th>
                  {visibleCols.ticketId && <th style={{ ...S.th, ...densityPadding }}>TICKET ID</th>}
                  {visibleCols.subject && <th style={{ ...S.th, ...densityPadding }}>SUBJECT HEADING</th>}
                  {visibleCols.dateFiled && <th style={{ ...S.th, ...densityPadding }}>DATE FILED</th>}
                  {visibleCols.stateStatus && <th style={{ ...S.th, ...densityPadding }}>STATE STATUS</th>}
                </tr>
              </thead>
              <tbody>
                {tickets.map((tkt) => {
                  const isChecked = selectedIds.includes(tkt.id);
                  return (
                    <tr 
                      key={tkt.id} 
                      style={{ 
                        ...S.tr,
                        backgroundColor: isChecked ? '#fffbeb' : '#ffffff',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      <td style={{ ...S.td, ...densityPadding, width: 40 }}>
                        <CustomCheckbox 
                          checked={isChecked} 
                          onChange={() => handleSelectRow(tkt.id)} 
                        />
                      </td>
                      {visibleCols.ticketId && (
                        <td style={{ ...S.td, ...densityPadding, fontWeight: '700', color: '#0f172a' }}>
                          {tkt.id}
                        </td>
                      )}
                      {visibleCols.subject && (
                        <td style={{ ...S.td, ...densityPadding, color: '#334155', fontWeight: '500' }}>
                          {tkt.subject}
                        </td>
                      )}
                      {visibleCols.dateFiled && (
                        <td style={{ ...S.td, ...densityPadding, color: '#64748b' }}>
                          {tkt.dateFiled}
                        </td>
                      )}
                      {visibleCols.stateStatus && (
                        <td style={{ ...S.td, ...densityPadding }}>
                          <span style={S.statusPill}>
                            {tkt.status}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Create Support Ticket */}
        <div style={S.rightPanel}>
          <div style={S.formHeader}>
            <h2 style={S.formTitle}>Create Support Ticket</h2>
            <p style={S.formSubtitle}>Request assistance from our platform support desk.</p>
          </div>

          <form onSubmit={handleFormSubmit} style={S.form}>
            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>SUBJECT HEADING</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Shipment update delay"
                style={S.input}
                required
              />
            </div>

            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>PROBLEM DESCRIPTION</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide specific details..."
                style={S.textarea}
                required
              />
            </div>

            <button type="submit" style={S.submitBtn}>
              Submit Support Ticket
            </button>
          </form>
        </div>
      </div>

      {/* Support Drawer Modal (Contact Support Button Trigger) */}
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
            
            <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={S.modalBody}>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>SUBJECT HEADING</label>
                  <input 
                    type="text" 
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    placeholder="e.g. Ticket system inquiry" 
                    style={S.input}
                    required
                  />
                </div>

                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>PROBLEM DESCRIPTION</label>
                  <textarea 
                    value={supportDescription}
                    onChange={(e) => setSupportDescription(e.target.value)}
                    placeholder="Please provide specific details..." 
                    style={S.textarea}
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

      {/* Toast Notification (Success Message Popup) */}
      {toast && (
        <div style={S.toastContainer}>
          <div style={S.toastIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span style={S.toastText}>{toast}</span>
          <button onClick={() => setToast(null)} style={S.toastCloseBtn}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

/* Styles Object */
const S = {
  leftPanel: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    height: '100%',
    boxSizing: 'border-box'
  },
  leftHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    flexShrink: 0
  },
  leftHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap'
  },
  leftTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  selectedActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fffbeb',
    border: '1px solid #fde047',
    borderRadius: 8,
    padding: '4px 10px',
    animation: 'slideIn 0.2s ease'
  },
  selectedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309'
  },
  csvBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #fde047',
    borderRadius: 6,
    padding: '3px 10px',
    color: '#b45309',
    fontSize: 10.5,
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    outline: 'none',
    boxSizing: 'border-box'
  },
  leftHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  },
  densityWrapper: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 2
  },
  densityBtn: {
    border: 'none',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 9.5,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none'
  },
  columnsBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    padding: '5px 12px',
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.15s ease'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 6,
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
    padding: 12,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minWidth: 160,
    boxSizing: 'border-box'
  },
  dropdownHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748b',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: 6,
    marginBottom: 4,
    letterSpacing: '0.5px'
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 11.5,
    color: '#334155',
    fontWeight: '600',
    cursor: 'pointer',
    userSelect: 'none'
  },
  dropdownCheckbox: {
    cursor: 'pointer',
    accentColor: '#0066cc',
    width: 14,
    height: 14
  },
  tableWrapper: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    backgroundColor: '#ffffff'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    whiteSpace: 'nowrap'
  },
  thead: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 1
  },
  th: {
    fontWeight: '700',
    color: '#475569',
    fontSize: 11,
    letterSpacing: '0.2px'
  },
  tr: {
    transition: 'background-color 0.15s ease'
  },
  td: {
    color: '#334155',
    verticalAlign: 'middle',
    boxSizing: 'border-box'
  },
  statusPill: {
    display: 'inline-block',
    fontSize: 10,
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    color: '#475569'
  },
  rightPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    height: 'fit-content',
    boxSizing: 'border-box',
    flexShrink: 0
  },
  formHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  formTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  formSubtitle: {
    fontSize: 11,
    color: '#64748b',
    margin: 0,
    fontWeight: '500',
    lineHeight: '1.4'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 12.5,
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease'
  },
  textarea: {
    width: '100%',
    height: 100,
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 12.5,
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
    transition: 'border-color 0.15s ease'
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    padding: '10px',
    fontSize: 12.5,
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none'
  },
  // Modal Drawer styles
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
  modalBody: {
    padding: '28px',
    flex: 1
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
  // Toast styles
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
    backgroundColor: '#10b981',
    color: '#ffffff',
    width: 22,
    height: 22,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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

export default CustomerSupport;
