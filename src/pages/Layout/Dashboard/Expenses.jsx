import React, { useState } from 'react';

const Expenses = () => {
  const [density, setDensity] = useState('RELAXED');
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Column visibility states (all checked initially matching screenshot)
  const [cols, setCols] = useState({
    payee: true,
    type: true,
    amount: true,
    date: true
  });

  const columnsList = [
    { key: 'payee', label: 'Expense Payee' },
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Expense Amount' },
    { key: 'date', label: 'Logged Date' }
  ];

  const expensesData = [
    { id: 1, payee: 'Donald S. (Driver)', type: 'Driver Pay', amount: '$1,420.00', date: '2026-06-19' },
    { id: 2, payee: 'Apex Invoice Finance', type: 'Factoring', amount: '$12,400.00', date: '2026-06-17' },
    { id: 3, payee: 'Sarah R. (Driver)', type: 'Driver Pay', amount: '$1,890.00', date: '2026-06-19' },
    { id: 4, payee: 'Brokerage Freight Inc', type: 'Expense', amount: '$1,850.00', date: '2026-06-19' },
    { id: 5, payee: 'Apex Fuel Network', type: 'Expense', amount: '$4,290.00', date: '2026-06-20' },
    { id: 6, payee: 'Penske Fleet Services', type: 'Expense', amount: '$3,820.00', date: '2026-06-21' },
    { id: 7, payee: 'Progressive Commercial', type: 'Expense', amount: '$2,100.00', date: '2026-06-22' },
    { id: 8, payee: 'TX DMV', type: 'Expense', amount: '$850.00', date: '2026-06-23' }
  ];

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const toggleColumn = (key) => {
    setCols(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === expensesData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(expensesData.map(r => r.id));
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = expensesData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(expensesData.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getCellPadding = () => {
    if (density === 'COMPACT') return '10px 16px';
    if (density === 'DEFAULT') return '16px 20px';
    return '24px 28px'; // RELAXED
  };

  return (
    <div style={S.container}>
      {/* Page Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.pageTitle}>Accounts &amp; Payroll &bull; Expenses</h1>
          <p style={S.pageSubtitle}>Review invoice factoring, disburse driver paychecks, and analyze margins.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={S.btnPrimary}
        >
          + Record Expense
        </button>
      </div>

      {/* Table Card */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={S.cardTitleBlock}>
            <h2 style={S.cardTitle}>Operational Expenses Ledger</h2>
          </div>

          <div style={S.toolbarRight}>
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

            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
                style={{
                  ...S.columnsBtn,
                  border: showColumnsDropdown ? '2px solid #000000' : '1px solid #e2e8f0',
                  padding: showColumnsDropdown ? '4px 10px' : '5px 11px'
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 5, verticalAlign: 'middle'}}>
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
                          checked={cols[col.key]}
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

        {selectedRows.length > 0 && (
          <div style={S.controlsRow}>
            <div style={S.selectedPill}>
              <span style={S.selectedPillText}>{selectedRows.length} SELECTED</span>
              <button onClick={() => showToastMsg('Exported selected items to CSV.')} style={S.csvExportBtn}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 4, verticalAlign: 'middle'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span style={{verticalAlign: 'middle'}}>CSV Export</span>
              </button>
            </div>
          </div>
        )}

        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr style={S.theadRow}>
                <th style={{ ...S.th, padding: getCellPadding(), width: 48, textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === expensesData.length && expensesData.length > 0}
                    onChange={handleSelectAll}
                    style={{ ...S.checkboxInput, marginRight: 0, accentColor: '#f59e0b' }} 
                  />
                </th>
                {cols.payee && <th style={{ ...S.th, padding: getCellPadding() }}>EXPENSE PAYEE</th>}
                {cols.type && <th style={{ ...S.th, padding: getCellPadding() }}>TYPE</th>}
                {cols.amount && <th style={{ ...S.th, padding: getCellPadding() }}>EXPENSE AMOUNT</th>}
                {cols.date && <th style={{ ...S.th, padding: getCellPadding() }}>LOGGED DATE</th>}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => {
                const isSelected = selectedRows.includes(item.id);
                return (
                  <tr key={item.id} style={{ 
                    borderBottom: idx === currentItems.length - 1 ? 'none' : '1px solid #f1f5f9',
                    backgroundColor: isSelected ? '#fffbeb' : '#ffffff',
                    transition: 'background-color 0.15s ease'
                  }}>
                    <td style={{ padding: getCellPadding(), textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleSelectRow(item.id)}
                        style={{ ...S.checkboxInput, marginRight: 0, accentColor: '#f59e0b' }} 
                      />
                    </td>
                    {cols.payee && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '800', color: '#1e293b' }}>{item.payee}</td>}
                    {cols.type && <td style={{ ...S.td, padding: getCellPadding() }}>{item.type}</td>}
                    {cols.amount && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '800' }}>{item.amount}</td>}
                    {cols.date && <td style={{ ...S.td, padding: getCellPadding(), fontSize: 11, color: '#64748b' }}>{item.date}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div style={S.paginationFooter}>
            <div style={S.paginationText}>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, expensesData.length)} of {expensesData.length} items</div>
            <div style={S.paginationControls}>
              <button onClick={handlePrevPage} disabled={currentPage === 1} style={{ ...S.pageBtn, opacity: currentPage === 1 ? 0.5 : 1 }}>&lt;</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page} 
                  onClick={() => setCurrentPage(page)}
                  style={{ ...S.pageBtn, ...(currentPage === page ? S.pageBtnActive : {}) }}
                >
                  {page}
                </button>
              ))}
              <button onClick={handleNextPage} disabled={currentPage === totalPages} style={{ ...S.pageBtn, opacity: currentPage === totalPages ? 0.5 : 1 }}>&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {/* Record Expense Modal */}
      {showModal && (
        <div style={S.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={S.modalContent} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>Record Financial Ledger entry</h2>
              <button onClick={() => setShowModal(false)} style={S.closeBtn}>✕</button>
            </div>
            
            <div style={S.modalBody}>
              <div style={S.formGroup}>
                <label style={S.label}>PAYEE / BILLING CUSTOMER NAME</label>
                <input 
                  type="text" 
                  placeholder="e.g. Memphis Shippers Inc"
                  style={S.inputField}
                />
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>TRANSACTION AMOUNT (USD)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1420.00"
                  style={S.inputField}
                />
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>LEDGER CATEGORY TYPE</label>
                <select style={S.selectField}>
                  <option value="shipper">Shipper Invoice Inflow</option>
                  <option value="driver">Driver Payroll Payout</option>
                  <option value="factoring">Invoice Factoring Margin</option>
                </select>
              </div>

              <button 
                onClick={() => {
                  setShowModal(false);
                  showToastMsg('Financial entry recorded successfully.');
                }} 
                style={S.submitBtn}
              >
                Save Financial Entry
              </button>
            </div>
          </div>
        </div>
      )}

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
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        /* Custom styles for select focus matching the screenshot */
        select:focus {
          border-color: #FFCC00 !important;
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 204, 0, 0.2);
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
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
  btnPrimary: {
    backgroundColor: '#f59e0b',
    color: '#000000',
    border: 'none',
    borderRadius: 30,
    fontSize: 11,
    fontWeight: '800',
    cursor: 'pointer',
    padding: '7px 16px',
    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)',
    transition: 'all 0.15s ease-in-out',
    outline: 'none',
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
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20
  },
  cardTitleBlock: {
    flex: 1,
    minWidth: 280
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
    minHeight: 38
  },
  selectedPill: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fef08a',
    borderRadius: 8,
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  selectedPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#b45309'
  },
  csvExportBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#b45309',
    fontSize: 11,
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 4
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
    width: 250,
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
    overflow: 'hidden',
    marginTop: 20
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
    color: '#64748b',
    letterSpacing: '0.5px'
  },
  td: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600'
  },
  paginationFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#ffffff'
  },
  paginationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b'
  },
  paginationControls: {
    display: 'flex',
    gap: 6
  },
  pageBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    cursor: 'pointer'
  },
  pageBtnActive: {
    backgroundColor: '#FFCC00',
    borderColor: '#FFCC00',
    color: '#000000',
    fontWeight: '800'
  },
  /* Modal Styles */
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(2px)'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    animation: 'fadeIn 0.25s ease-out'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px 16px 32px',
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
    fontSize: 20,
    color: '#64748b',
    cursor: 'pointer',
    padding: 0
  },
  modalBody: {
    padding: '16px 32px 32px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.5px'
  },
  inputField: {
    padding: '12px 16px',
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  selectField: {
    padding: '12px 16px',
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    appearance: 'none',
    backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="none" height="24" stroke="%230f172a" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"/></svg>')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px'
  },
  submitBtn: {
    backgroundColor: '#f59e0b',
    color: '#000000',
    border: 'none',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    padding: '14px',
    width: '100%',
    marginTop: 8,
    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)',
    transition: 'all 0.15s ease-in-out'
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

export default Expenses;
