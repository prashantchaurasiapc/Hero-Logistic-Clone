import React, { useState } from 'react';

const SentInvoices = () => {
  const [density, setDensity] = useState('RELAXED'); // COMPACT, DEFAULT, RELAXED
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [toast, setToast] = useState(null);

  // Table Data
  const [invoices, setInvoices] = useState([
    { id: 'INV-3981', customer: 'Global Retail Corp', amount: '$1,200.00', dueDate: '18 Jul 2026', status: 'SENT', checked: false },
    { id: 'INV-3982', customer: 'Vance Refrigeration', amount: '$850.00', dueDate: '22 Jul 2026', status: 'SENT', checked: false }
  ]);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState({
    invoiceId: true,
    customer: true,
    amount: true,
    dueDate: false, // unchecked by default in screenshots
    status: true
  });

  const columnsList = [
    { key: 'invoiceId', label: 'Invoice ID' },
    { key: 'customer', label: 'Shipper Customer' },
    { key: 'amount', label: 'Total Amount' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'status', label: 'Status' }
  ];

  // Hover states for buttons
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSendInvoice = () => {
    showToast('Initiating new outbound invoice transmission.');
  };

  const handleExportPDF = () => {
    showToast('Compiling sent invoices ledger to PDF.');
  };

  const handleSendStatement = () => {
    showToast('Outbound account statements queued for dispatch.');
  };

  const selectedCount = invoices.filter(inv => inv.checked).length;

  const handleCSVExport = () => {
    showToast(`Exported ${selectedCount} selected invoices to CSV.`);
  };

  // Master Checkbox Toggle
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

  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Get cell padding based on density
  const getCellPadding = () => {
    if (density === 'COMPACT') return '10px 16px';
    if (density === 'DEFAULT') return '16px 20px';
    return '24px 28px'; // RELAXED
  };

  return (
    <div style={S.container}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Accounts &amp; Payroll <span className="text-slate-400 text-xl mx-1">•</span> Sent Invoices
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Review invoice factoring, disburse driver paychecks, and analyze margins.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          {/* Title & Desc */}
          <div style={S.cardTitleBlock}>
            <h2 style={S.cardTitle}>Sent Invoices Ledger</h2>
            <p style={S.cardSubtitle}>Audit dispatched invoices, track aging, export tax documents, and issue statements.</p>
          </div>

          {/* Action Buttons */}
          <div style={S.actionGroup}>
            <button
              onClick={handleSendInvoice}
              onMouseEnter={() => setHoveredBtn('send')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                ...S.btnPrimary,
                border: hoveredBtn === 'send' ? '2px solid #000000' : 'none',
                padding: hoveredBtn === 'send' ? '5px 14px' : '7px 14px'
              }}
            >
              Send Invoice
            </button>
            <button
              onClick={handleExportPDF}
              onMouseEnter={() => setHoveredBtn('pdf')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                ...S.btnSecondary,
                border: hoveredBtn === 'pdf' ? '2px solid #000000' : '1px solid #cbd5e1',
                padding: hoveredBtn === 'pdf' ? '5px 14px' : '6px 14px'
              }}
            >
              Export PDF
            </button>
            <button
              onClick={handleSendStatement}
              onMouseEnter={() => setHoveredBtn('statement')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                ...S.btnSecondary,
                border: hoveredBtn === 'statement' ? '2px solid #000000' : '1px solid #cbd5e1',
                padding: hoveredBtn === 'statement' ? '5px 14px' : '6px 14px'
              }}
            >
              Send Statement
            </button>
          </div>
        </div>

        {/* Toolbar with controls */}
        <div style={{ ...S.toolbar, justifyContent: selectedCount > 0 ? 'space-between' : 'flex-end' }}>
          {/* Bulk Actions (Left) */}
          {selectedCount > 0 && (
            <div style={S.bulkActions}>
              <span style={S.selectedCountText}>{selectedCount} SELECTED</span>
              <button 
                onClick={handleCSVExport}
                style={S.csvExportBtn}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(217, 119, 6, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6}}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                CSV Export
              </button>
            </div>
          )}

          <div style={S.toolbarRight}>
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
                  border: showColumnsDropdown ? '2px solid #000000' : '1px solid #e2e8f0',
                  padding: showColumnsDropdown ? '5px 12px' : '6px 13px'
                }}
              >
                {/* Inline Gear SVG */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5, verticalAlign: 'middle' }}>
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span style={{ verticalAlign: 'middle' }}>COLUMNS</span>
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

        {/* Data Table */}
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr style={S.theadRow}>
                <th style={{ ...S.th, padding: getCellPadding(), width: 48, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={handleMasterCheckbox}
                    style={S.checkboxInput}
                  />
                </th>
                {visibleColumns.invoiceId && <th style={{ ...S.th, padding: getCellPadding() }}>INVOICE ID</th>}
                {visibleColumns.customer && <th style={{ ...S.th, padding: getCellPadding() }}>SHIPPER CUSTOMER</th>}
                {visibleColumns.dueDate && <th style={{ ...S.th, padding: getCellPadding() }}>DUE DATE</th>}
                {visibleColumns.amount && <th style={{ ...S.th, padding: getCellPadding() }}>TOTAL AMOUNT</th>}
                {visibleColumns.status && <th style={{ ...S.th, padding: getCellPadding() }}>STATUS</th>}
              </tr>
            </thead>
            <tbody>
              {invoices.map((row) => (
                <tr key={row.id} style={S.tbodyRow}>
                  <td style={{ ...S.td, padding: getCellPadding(), textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.checked}
                      onChange={() => handleRowCheckbox(row.id)}
                      style={S.checkboxInput}
                    />
                  </td>
                  {visibleColumns.invoiceId && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '600', color: '#475569' }}>{row.id}</td>}
                  {visibleColumns.customer && <td style={{ ...S.td, padding: getCellPadding(), color: '#475569' }}>{row.customer}</td>}
                  {visibleColumns.dueDate && <td style={{ ...S.td, padding: getCellPadding(), color: '#64748b' }}>{row.dueDate}</td>}
                  {visibleColumns.amount && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '700', color: '#0f172a' }}>{row.amount}</td>}
                  {visibleColumns.status && (
                    <td style={{ ...S.td, padding: getCellPadding() }}>
                      <span style={S.statusBadge}>
                        {row.status}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <div className="settings-toast" style={S.toastContainer}>
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
      `}</style>
    </div>
  );
};

/* ─── Styles Object ─── */
const S = {
  container: {
    padding: '24px 32px',
    backgroundColor: '#f8fafc',
    minHeight: '100%',
    fontFamily: 'Inter, Outfit, sans-serif'
  },
  header: {
    marginBottom: 32
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 6px 0',
    letterSpacing: '-0.5px'
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748b',
    margin: 0
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '32px 32px 40px 32px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 20
  },
  cardTitleBlock: {
    flex: 1,
    minWidth: 280
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 6px 0'
  },
  cardSubtitle: {
    fontSize: 13.5,
    color: '#64748b',
    margin: 0,
    lineHeight: 1.5
  },
  actionGroup: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  btnPrimary: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 30,
    fontSize: 12,
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(255, 204, 0, 0.35)',
    transition: 'all 0.15s ease-in-out',
    outline: 'none',
    boxSizing: 'border-box'
  },
  btnSecondary: {
    backgroundColor: '#ffffff',
    color: '#334155',
    borderRadius: 30,
    fontSize: 12,
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
    outline: 'none',
    boxSizing: 'border-box'
  },
  toolbar: {
    display: 'flex',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'center'
  },
  bulkActions: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 30,
    padding: '4px 6px 4px 16px',
    gap: 12
  },
  selectedCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#d97706',
    letterSpacing: '0.5px'
  },
  csvExportBtn: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#d97706',
    fontSize: 12,
    fontWeight: '800',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: 20,
    transition: 'all 0.15s ease',
    outline: 'none'
  },
  toolbarRight: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap'
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
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: 8,
    fontSize: 11,
    fontWeight: '800',
    cursor: 'pointer',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s ease-in-out',
    boxSizing: 'border-box'
  },
  dropdownOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 90
  },
  dropdownPanel: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 16px -6px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0',
    padding: 18,
    width: 200,
    zIndex: 99
  },
  dropdownTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 14,
    letterSpacing: '0.8px'
  },
  dropdownLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    cursor: 'pointer',
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    userSelect: 'none'
  },
  checkboxInput: {
    marginRight: 10,
    cursor: 'pointer',
    width: 15,
    height: 15,
    accentColor: '#3b82f6'
  },
  tableWrapper: {
    border: '1px solid #e2e8f0',
    borderRadius: 12,
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
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: '0.5px'
  },
  tbodyRow: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.1s ease',
    ':hover': {
      backgroundColor: '#f8fafc'
    }
  },
  td: {
    fontSize: 14,
    color: '#334155',
    verticalAlign: 'middle'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '5px 12px',
    borderRadius: 20,
    fontSize: 10.5,
    fontWeight: '800',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    letterSpacing: '0.5px'
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
    zIndex: 1000,
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

export default SentInvoices;
