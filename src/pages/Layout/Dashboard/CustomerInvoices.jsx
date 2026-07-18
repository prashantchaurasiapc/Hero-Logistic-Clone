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

// Helper to style the invoice state pill
const getInvoiceStateStyle = (state) => {
  const cleanState = (state || '').toUpperCase();
  if (cleanState.includes('PAID')) {
    return {
      backgroundColor: '#ecfdf5',
      color: '#047857',
      border: '1px solid #a7f3d0',
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 30,
      fontSize: '10.5px',
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };
  }
  return {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #e2e8f0',
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 30,
    fontSize: '10.5px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };
};

const CustomerInvoices = () => {
  const [density, setDensity] = useState('RELAXED'); // COMPACT, DEFAULT, RELAXED (RELAXED is default in screenshot)
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Support Form States
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');

  const [toast, setToast] = useState(null);

  // Column Visibility (Default matches screenshot: only State visible)
  const [visibleColumns, setVisibleColumns] = useState({
    invoiceId: true,
    totalAmount: true,
    dueDate: true,
    state: true,
    actions: true
  });

  const columnsList = [
    { key: 'invoiceId', label: 'Invoice ID' },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'state', label: 'State' },
    { key: 'actions', label: 'Actions' }
  ];

  // Invoices Data (Matches mockup exactly: unchecked by default, PAID state)
  const [invoices, setInvoices] = useState([
    { id: 'INV-01', invoiceId: 'INV-8910', totalAmount: '$1,240.00', dueDate: '06/25/2026', state: 'PAID', checked: false },
    { id: 'INV-02', invoiceId: 'INV-8911', totalAmount: '$3,500.00', dueDate: '06/28/2026', state: 'PAID', checked: false }
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

  // Checkbox Handlers
  const isAllChecked = invoices.length > 0 && invoices.every(inv => inv.checked);

  const handleMasterCheckbox = () => {
    const targetState = !isAllChecked;
    setInvoices(prev => prev.map(inv => ({ ...inv, checked: targetState })));
  };

  const handleRowCheckbox = (id) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, checked: !inv.checked } : inv
    ));
  };

  const handleCsvExport = () => {
    const selectedInvoices = invoices.filter(inv => inv.checked);
    const dataToExport = selectedInvoices.length > 0 ? selectedInvoices : invoices;
    
    // Create CSV content
    const headers = ['Invoice ID', 'Total Amount', 'Due Date', 'State'];
    const rows = dataToExport.map(inv => [
      inv.invoiceId,
      inv.totalAmount,
      inv.dueDate,
      inv.state
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invoices_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Successfully downloaded CSV for ${dataToExport.length} invoices.`);
  };

  const getCellPadding = () => {
    if (density === 'COMPACT') return '10px 16px';
    if (density === 'DEFAULT') return '16px 20px';
    return '24px 28px'; // RELAXED
  };

  return (
    <div className="customer-dashboard documents-wrapper">
      {/* Header Container */}
      <div className="customer-header-container" style={{ flexShrink: 0 }}>
        <div>
          <h1 className="customer-title">Customer Shipper Portal &bull; Invoices</h1>
          <p className="customer-subtitle">Request load deliveries, audit invoices, download BOL papers, and track active route paths.</p>
        </div>
        <button onClick={() => setShowSupportModal(true)} className="contact-support-btn">Contact Support</button>
      </div>

      {/* Main Single Card Panel */}
      <div style={S.mainCard}>
        <div style={S.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <h2 style={S.cardTitle}>Shippers billing invoices</h2>
            
            {/* Selected Pills (CSV Export) */}
            {invoices.some(inv => inv.checked) && (
              <div style={S.selectedPill}>
                <span style={S.selectedPillText}>
                  {invoices.filter(inv => inv.checked).length} SELECTED
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

          <div style={S.headerControlsRight}>
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
                    <div className="columns-dropdown-panel" style={S.dropdownPanel}>
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

        {/* Invoices Table */}
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
                {visibleColumns.invoiceId && <th style={{ ...S.th, padding: getCellPadding() }}>INVOICE ID</th>}
                {visibleColumns.totalAmount && <th style={{ ...S.th, padding: getCellPadding() }}>TOTAL AMOUNT</th>}
                {visibleColumns.dueDate && <th style={{ ...S.th, padding: getCellPadding() }}>DUE DATE</th>}
                {visibleColumns.state && <th style={{ ...S.th, padding: getCellPadding() }}>STATE</th>}
                {visibleColumns.actions && <th style={{ ...S.th, padding: getCellPadding() }}>ACTIONS</th>}
              </tr>
            </thead>
            <tbody>
              {invoices.map((row) => (
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
                  {visibleColumns.invoiceId && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '700', color: '#0f172a' }}>{row.invoiceId}</td>}
                  {visibleColumns.totalAmount && <td style={{ ...S.td, padding: getCellPadding() }}>{row.totalAmount}</td>}
                  {visibleColumns.dueDate && <td style={{ ...S.td, padding: getCellPadding() }}>{row.dueDate}</td>}
                  {visibleColumns.state && (
                    <td style={{ ...S.td, padding: getCellPadding() }}>
                      <span style={getInvoiceStateStyle(row.state)}>{row.state}</span>
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td style={{ ...S.td, padding: getCellPadding() }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ fontSize: 13.5, color: '#64748b', marginRight: 16 }}>Paid and Cleared</span>
                        <button 
                          onClick={() => showToast(`Downloading PDF for invoice ${row.invoiceId}...`)}
                          style={S.actionBtn}
                        >
                          Download Invoice PDF
                        </button>
                        <button 
                          onClick={() => showToast(`Reminders toggled for invoice ${row.invoiceId}`)}
                          style={S.actionBtn}
                        >
                          Reminders OFF
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  headerControlsRight: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap'
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
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap'
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
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap'
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
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    whiteSpace: 'nowrap'
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
  actionBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 30,
    padding: '6px 14px',
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
    boxSizing: 'border-box'
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

export default CustomerInvoices;
