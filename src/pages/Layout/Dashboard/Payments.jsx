import React, { useState } from 'react';

const Payments = () => {
  const [density, setDensity] = useState('DEFAULT'); // COMPACT, DEFAULT, RELAXED
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeBtn, setActiveBtn] = useState(null);

  // Table Data
  const [payments, setPayments] = useState([
    { id: 'PAY-1002', customer: 'Global Retail Corp', amount: '$1,200.00', method: 'Direct Deposit', status: 'Cleared', checked: false },
    { id: 'PAY-1003', customer: 'Vance Refrigeration', amount: '$850.00', method: 'Check', status: 'Cleared', checked: false }
  ]);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState({
    paymentId: true,
    customer: true,
    amount: true,
    method: false, // Method is unchecked by default in screenshots
    status: true
  });

  const columnsList = [
    { key: 'paymentId', label: 'Payment ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'amount', label: 'Settled Amount' },
    { key: 'method', label: 'Method' },
    { key: 'status', label: 'Status' }
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Master Checkbox Toggle
  const isAllChecked = payments.length > 0 && payments.every(pay => pay.checked);
  const handleMasterCheckbox = () => {
    const targetState = !isAllChecked;
    setPayments(prev => prev.map(pay => ({ ...inv, checked: targetState })));
  };

  const handleRowCheckbox = (id) => {
    setPayments(prev => prev.map(pay =>
      pay.id === id ? { ...pay, checked: !pay.checked } : pay
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
      <div style={S.header}>
        <h1 style={S.pageTitle}>Accounts &amp; Payroll &bull; Payments</h1>
        <p style={S.pageSubtitle}>Review invoice factoring, disburse driver paychecks, and analyze margins.</p>
      </div>

      {/* Main Content Card */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          {/* Title & Desc */}
          <div style={S.cardTitleBlock}>
            <h2 style={S.cardTitle}>Payments Reconciliation</h2>
            <p style={S.cardSubtitle}>Record incoming client check deposits, match bank transactions, and cancel bad debts.</p>
          </div>

          {/* Action Buttons */}
          <div style={S.actionGroup}>
            <button
              onClick={() => {
                setActiveBtn('mark');
                showToast('Marked invoice payment status as paid.');
              }}
              style={{
                ...S.btnPrimary,
                border: activeBtn === 'mark' ? '2.5px solid #000000' : 'none',
                padding: activeBtn === 'mark' ? '4px 12px' : '5px 13px'
              }}
            >
              Mark Paid
            </button>
            <button
              onClick={() => {
                setActiveBtn('record');
                showToast('Manual payment record logged.');
              }}
              style={{
                ...S.btnSecondary,
                border: activeBtn === 'record' ? '2.5px solid #000000' : '1px solid #cbd5e1',
                padding: activeBtn === 'record' ? '4px 12px' : '5px 13px'
              }}
            >
              Record Payment
            </button>
            <button
              onClick={() => {
                setActiveBtn('match');
                showToast('Reconciled against bank deposit.');
              }}
              style={{
                ...S.btnPrimary,
                backgroundColor: '#f59e0b',
                border: activeBtn === 'match' ? '2.5px solid #000000' : 'none',
                padding: activeBtn === 'match' ? '4px 12px' : '5px 13px',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)'
              }}
            >
              Match Payment to Invoice
            </button>
            <button
              onClick={() => {
                setActiveBtn('cancel');
                showToast('Invoice voided and marked Cancelled.');
              }}
              style={{
                ...S.btnDanger,
                border: activeBtn === 'cancel' ? '2.5px solid #000000' : 'none',
                padding: activeBtn === 'cancel' ? '4px 12px' : '5px 13px'
              }}
            >
              Cancel Invoice
            </button>
          </div>
        </div>

        {/* Toolbar with controls */}
        <div style={S.toolbar}>
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
                  padding: showColumnsDropdown ? '4px 10px' : '5px 11px'
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
                {visibleColumns.paymentId && <th style={{ ...S.th, padding: getCellPadding() }}>PAYMENT ID</th>}
                {visibleColumns.customer && <th style={{ ...S.th, padding: getCellPadding() }}>CUSTOMER</th>}
                {visibleColumns.amount && <th style={{ ...S.th, padding: getCellPadding() }}>SETTLED AMOUNT</th>}
                {visibleColumns.method && <th style={{ ...S.th, padding: getCellPadding() }}>METHOD</th>}
                {visibleColumns.status && <th style={{ ...S.th, padding: getCellPadding() }}>STATUS</th>}
              </tr>
            </thead>
            <tbody>
              {payments.map((row) => (
                <tr key={row.id} style={S.tbodyRow}>
                  <td style={{ ...S.td, padding: getCellPadding(), textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.checked}
                      onChange={() => handleRowCheckbox(row.id)}
                      style={S.checkboxInput}
                    />
                  </td>
                  {visibleColumns.paymentId && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '600', color: '#475569' }}>{row.id}</td>}
                  {visibleColumns.customer && <td style={{ ...S.td, padding: getCellPadding(), color: '#475569' }}>{row.customer}</td>}
                  {visibleColumns.amount && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '700', color: '#10b981' }}>{row.amount}</td>}
                  {visibleColumns.method && <td style={{ ...S.td, padding: getCellPadding(), color: '#64748b' }}>{row.method}</td>}
                  {visibleColumns.status && (
                    <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '700', color: '#334155' }}>
                      {row.status}
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
    padding: '28px 40px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: "'Outfit', 'Inter', sans-serif"
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
    alignItems: 'center'
  },
  btnPrimary: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 30,
    fontSize: 11,
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
    fontSize: 11,
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
    outline: 'none',
    boxSizing: 'border-box'
  },
  btnDanger: {
    backgroundColor: '#ef4444',
    color: '#000000',
    border: 'none',
    borderRadius: 30,
    fontSize: 11,
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.25)',
    transition: 'all 0.15s ease-in-out',
    outline: 'none',
    boxSizing: 'border-box'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 24
  },
  toolbarRight: {
    display: 'flex',
    gap: 16,
    alignItems: 'center'
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
    fontSize: 10.5,
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
    right: 0,
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

export default Payments;
