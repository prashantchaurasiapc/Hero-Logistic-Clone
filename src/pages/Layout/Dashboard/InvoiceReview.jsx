import React, { useState } from 'react';

const InvoiceReview = () => {
  const [density, setDensity] = useState('RELAXED'); // COMPACT, DEFAULT, RELAXED
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [toast, setToast] = useState(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    draftId: true,
    shipperCustomer: true,
    loadId: true,
    totalAmount: true,
    gst: true,
    status: true
  });

  const columnsList = [
    { key: 'draftId', label: 'Draft ID' },
    { key: 'shipperCustomer', label: 'Shipper Customer' },
    { key: 'loadId', label: 'Load ID' },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'gst', label: 'GST (10%)' },
    { key: 'status', label: 'Status' }
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleReviewInvoice = () => {
    showToast('Opening full audit manifest for invoice.');
  };

  const handleEditInvoice = () => {
    showToast('Opening inline invoice editor panel.');
  };

  const handleApproveInvoice = () => {
    // Just clickable as requested, no other action
  };

  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Get padding based on density
  const getTablePadding = () => {
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
            Accounts &amp; Payroll <span className="text-slate-400 text-xl mx-1">•</span> Invoice Review
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
            <h2 style={S.cardTitle}>Invoice Review (Drafts)</h2>
            <p style={S.cardSubtitle}>Inspect draft invoices generated automatically from completed stops and POD uploads.</p>
          </div>

          {/* Action Buttons */}
          <div style={S.actionGroup}>
            <button 
              onClick={handleReviewInvoice} 
              style={S.btnSecondary}
              onMouseEnter={(e) => e.target.style.borderColor = '#94a3b8'}
              onMouseLeave={(e) => e.target.style.borderColor = '#e2e8f0'}
            >
              Review Invoice
            </button>
            <button 
              onClick={handleEditInvoice} 
              style={S.btnSecondary}
              onMouseEnter={(e) => e.target.style.borderColor = '#94a3b8'}
              onMouseLeave={(e) => e.target.style.borderColor = '#e2e8f0'}
            >
              Edit Invoice
            </button>
            <button 
              onClick={handleApproveInvoice} 
              style={S.btnPrimary}
              onMouseEnter={(e) => e.target.style.background = '#facc15'}
              onMouseLeave={(e) => e.target.style.background = '#FFCC00'}
            >
              Approve Invoice
            </button>
          </div>
        </div>

        {/* Toolbar (Density Toggles and Column Configurator) */}
        <div style={S.toolbar}>
          <div style={S.densityPill}>
            {['COMPACT', 'DEFAULT', 'RELAXED'].map((d) => (
              <span
                key={d}
                onClick={() => setDensity(d)}
                style={{
                  ...S.densityOption,
                  backgroundColor: density === d ? '#FFCC00' : 'transparent',
                  color: density === d ? '#000000' : '#475569',
                  fontWeight: density === d ? '800' : '600',
                }}
              >
                {d}
              </span>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowColumnsDropdown(!showColumnsDropdown)} 
              style={{
                ...S.columnsBtn,
                border: showColumnsDropdown ? '2px solid #000000' : '1px solid #cbd5e1'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              COLUMNS
            </button>

            {/* Dropdown panel */}
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
                      <span style={S.checkboxLabelText}>{col.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr style={S.theadRow}>
                <th style={{ ...S.th, padding: getTablePadding(), width: '40px' }}>
                  <input type="checkbox" disabled style={S.checkboxInputHeader} />
                </th>
                {visibleColumns.draftId && <th style={{ ...S.th, padding: getTablePadding() }}>DRAFT ID</th>}
                {visibleColumns.shipperCustomer && <th style={{ ...S.th, padding: getTablePadding() }}>SHIPPER CUSTOMER</th>}
                {visibleColumns.loadId && <th style={{ ...S.th, padding: getTablePadding() }}>LOAD ID</th>}
                {visibleColumns.totalAmount && <th style={{ ...S.th, padding: getTablePadding() }}>TOTAL AMOUNT</th>}
                {visibleColumns.gst && <th style={{ ...S.th, padding: getTablePadding() }}>GST (10%)</th>}
                {visibleColumns.status && <th style={{ ...S.th, padding: getTablePadding() }}>STATUS</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td 
                  colSpan={1 + Object.values(visibleColumns).filter(Boolean).length} 
                  style={S.emptyCell}
                >
                  NO RECORDS RESOLVED.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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
    fontFamily: 'Inter, sans-serif',
  },
  header: {
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)',
    padding: '24px',
    border: '1px solid #f1f5f9',
    position: 'relative',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  cardTitleBlock: {
    flex: 1,
    minWidth: '280px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 6px 0',
  },
  cardSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.4',
  },
  actionGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  btnSecondary: {
    backgroundColor: '#ffffff',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
  },
  btnPrimary: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
    boxShadow: '0 4px 12px rgba(250, 204, 21, 0.25)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
  },
  densityPill: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    padding: '4px',
  },
  densityOption: {
    padding: '6px 16px',
    borderRadius: '6px',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    userSelect: 'none',
    textAlign: 'center',
  },
  columnsBtn: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s ease',
    outline: 'none',
  },
  dropdownOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 90,
  },
  dropdownPanel: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    padding: '16px',
    width: '210px',
    zIndex: 99,
  },
  dropdownTitle: {
    fontSize: '10px',
    fontWeight: '800',
    color: '#64748b',
    marginBottom: '14px',
    letterSpacing: '0.8px',
  },
  dropdownLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    userSelect: 'none',
  },
  checkboxInput: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: '1.5px solid #cbd5e1',
    marginRight: '10px',
    accentColor: '#3b82f6',
    cursor: 'pointer',
  },
  checkboxLabelText: {
    lineHeight: 1,
  },
  tableWrapper: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflowY: 'auto',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    whiteSpace: 'nowrap',
  },
  theadRow: {
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  th: {
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.5px',
    transition: 'all 0.15s ease',
  },
  checkboxInputHeader: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: '1.5px solid #cbd5e1',
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  emptyCell: {
    textAlign: 'center',
    padding: '100px 0',
    fontSize: '13px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.5px',
  },
  toastContainer: {
    position: 'fixed',
    bottom: '40px',
    right: '32px',
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: '12px',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    zIndex: 1000,
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    maxWidth: '420px',
    animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  toastIcon: {
    color: '#10b981',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  toastText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#065f46',
    flex: 1,
  },
  toastCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#64748b',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
  },
};

export default InvoiceReview;
