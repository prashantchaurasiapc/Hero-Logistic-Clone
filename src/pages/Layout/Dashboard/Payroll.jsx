import React, { useState } from 'react';

const Payroll = () => {
  const [activeTab, setActiveTab] = useState('driver'); // driver, employee, contractor, history
  const [density, setDensity] = useState('DEFAULT'); // COMPACT, DEFAULT, RELAXED
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeBtn, setActiveBtn] = useState(null);

  // Column visibility states per tab
  const [driverCols, setDriverCols] = useState({
    driverNode: false,
    tripsDone: false,
    payDue: true,
    state: true,
    disburse: false
  });

  const [employeeCols, setEmployeeCols] = useState({
    employee: false,
    position: false,
    hourlySalaried: false,
    salaryNet: false,
    status: true
  });

  const [contractorCols, setContractorCols] = useState({
    contractorService: false,
    settlementAmount: false,
    state: true,
    disburse: false
  });

  const [historyCols, setHistoryCols] = useState({
    paymentId: false,
    workerPayee: true,
    workerType: false,
    paidAmount: false,
    paymentDate: false,
    processedBy: false
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Get current tab settings
  const getTabConfig = () => {
    switch (activeTab) {
      case 'driver':
        return {
          title: 'Driver Pay & Trip Commissions',
          cols: driverCols,
          setCols: setDriverCols,
          list: [
            { key: 'driverNode', label: 'Driver Node' },
            { key: 'tripsDone', label: 'Trips Done' },
            { key: 'payDue', label: 'Pay Due' },
            { key: 'state', label: 'State' },
            { key: 'disburse', label: 'Disburse' }
          ]
        };
      case 'employee':
        return {
          title: 'Office staff & Yard Salaries',
          cols: employeeCols,
          setCols: setEmployeeCols,
          list: [
            { key: 'employee', label: 'Employee' },
            { key: 'position', label: 'Position' },
            { key: 'hourlySalaried', label: 'Hourly/Salaried' },
            { key: 'salaryNet', label: 'Salary Net' },
            { key: 'status', label: 'Status' }
          ]
        };
      case 'contractor':
        return {
          title: 'Subcontractor Brokerage settlements',
          cols: contractorCols,
          setCols: setContractorCols,
          list: [
            { key: 'contractorService', label: 'External Contractor Service' },
            { key: 'settlementAmount', label: 'Settlement Amount' },
            { key: 'state', label: 'State' },
            { key: 'disburse', label: 'Disburse' }
          ]
        };
      case 'history':
        return {
          title: 'Processed Payroll & Payments History',
          cols: historyCols,
          setCols: setHistoryCols,
          list: [
            { key: 'paymentId', label: 'Payment ID' },
            { key: 'workerPayee', label: 'Worker / Payee' },
            { key: 'workerType', label: 'Worker Type' },
            { key: 'paidAmount', label: 'Paid Amount' },
            { key: 'paymentDate', label: 'Payment Date' },
            { key: 'processedBy', label: 'Processed By' }
          ]
        };
      default:
        return {};
    }
  };

  const config = getTabConfig();

  const toggleColumn = (key) => {
    config.setCols(prev => ({ ...prev, [key]: !prev[key] }));
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
            Accounts &amp; Payroll <span className="text-slate-400 text-xl mx-1">•</span> Payroll
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Review invoice factoring, disburse driver paychecks, and analyze margins.
          </p>
        </div>
      </div>

      {/* Operations Block */}
      <div style={S.operationsCard}>
        <div style={S.cardHeader}>
          <div style={S.cardTitleBlock}>
            <h2 style={{ ...S.cardTitle, fontSize: 15 }}>Global Payroll Operations Run</h2>
            <p style={{ ...S.cardSubtitle, fontSize: 12 }}>Calculate hours, contractor hotshot runs, and base employee salaries.</p>
          </div>

          <div style={S.actionGroup}>
            <button 
              onClick={() => {
                setActiveBtn('rate');
                showToast('Opened payroll pay rates configuration panel.');
              }}
              style={{
                ...S.btnOutlineGold,
                border: activeBtn === 'rate' ? '2.5px solid #000000' : '1px solid #ffd8a8',
                padding: activeBtn === 'rate' ? '4px 12px' : '5px 13px'
              }}
            >
              Configure Worker Pay Rate
            </button>
            <button 
              onClick={() => {
                setActiveBtn('approve');
                showToast('Payroll run approved successfully.');
              }}
              style={{
                ...S.btnGreen,
                border: activeBtn === 'approve' ? '2.5px solid #000000' : 'none',
                padding: activeBtn === 'approve' ? '4px 12px' : '6px 13px'
              }}
            >
              Approve Payroll
            </button>
            <button 
              onClick={() => {
                setActiveBtn('process');
                showToast('Payroll processing queue initiated.');
              }}
              style={{
                ...S.btnPrimary,
                border: activeBtn === 'process' ? '2.5px solid #000000' : 'none',
                padding: activeBtn === 'process' ? '4px 12px' : '6px 13px'
              }}
            >
              Process Payroll
            </button>
            <button 
              onClick={() => {
                setActiveBtn('export');
                showToast('Payroll statement compilation exported.');
              }}
              style={{
                ...S.btnSecondary,
                border: activeBtn === 'export' ? '2.5px solid #000000' : '1px solid #cbd5e1',
                padding: activeBtn === 'export' ? '4px 12px' : '5px 13px'
              }}
            >
              Export Payroll
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={S.tabsRow}>
        {[
          { id: 'driver', label: 'Driver Payroll' },
          { id: 'employee', label: 'Employee Base Salaries' },
          { id: 'contractor', label: 'Contractor Settlements' },
          { id: 'history', label: 'Payroll History' }
        ].map(tab => (
          <span 
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setShowColumnsDropdown(false);
            }}
            style={{
              ...S.tabItem,
              color: activeTab === tab.id ? '#d97706' : '#64748b',
              fontWeight: activeTab === tab.id ? '800' : '600',
              borderBottom: activeTab === tab.id ? '3px solid #FFCC00' : 'none'
            }}
          >
            {tab.label}
          </span>
        ))}
      </div>

      {/* Table Card */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={S.cardTitleBlock}>
            <h2 style={S.cardTitle}>{config.title}</h2>
          </div>

          {/* Controls */}
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
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 5, verticalAlign: 'middle'}}>
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
                    {config.list.map((col) => (
                      <label key={col.key} style={S.dropdownLabel}>
                        <input 
                          type="checkbox" 
                          checked={config.cols[col.key]}
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

        {/* Empty Table structure */}
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr style={S.theadRow}>
                <th style={{ ...S.th, padding: getCellPadding(), width: 48, textAlign: 'center' }}>
                  <input type="checkbox" style={S.checkboxInput} disabled />
                </th>
                {config.list.map(col => (
                  config.cols[col.key] && (
                    <th key={col.key} style={{ ...S.th, padding: getCellPadding() }}>
                      {col.label.toUpperCase()}
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td 
                  colSpan={config.list.filter(c => config.cols[c.key]).length + 1}
                  style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    fontSize: 13,
                    fontWeight: '800',
                    color: '#64748b',
                    backgroundColor: '#ffffff',
                    letterSpacing: '0.5px'
                  }}
                >
                  NO RECORDS RESOLVED.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Time Clock Section */}
      <div style={{ ...S.card, marginTop: 28, padding: '24px 32px' }}>
        <h3 style={{ fontSize: 13, fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '0.3px' }}>
          LIVE TIME CLOCK / SHIFT LOGS
        </h3>
        <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 24px 0' }}>
          Recorded shifts from Start/Finish Work widgets.
        </p>
        <div style={{ textAlign: 'center', padding: '32px 0', fontSize: 12.5, fontStyle: 'italic', color: '#94a3b8' }}>
          No shift log entries recorded yet.
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
  operationsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '20px 32px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
    marginBottom: 24
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
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  cardSubtitle: {
    fontSize: 13.5,
    color: '#64748b',
    margin: '4px 0 0 0',
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
  btnOutlineGold: {
    backgroundColor: '#ffffff',
    color: '#b45309',
    borderRadius: 30,
    fontSize: 11,
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
    outline: 'none',
    boxSizing: 'border-box'
  },
  btnGreen: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: 30,
    fontSize: 11,
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
    transition: 'all 0.15s ease-in-out',
    outline: 'none',
    boxSizing: 'border-box'
  },
  tabsRow: {
    display: 'flex',
    gap: 24,
    borderBottom: '1px solid #e2e8f0',
    marginBottom: 24,
    paddingLeft: 8,
    flexWrap: 'wrap'
  },
  tabItem: {
    padding: '12px 4px',
    fontSize: 13.5,
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.15s ease'
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 16px -6px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0',
    padding: 18,
    width: 210,
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
    WebkitOverflowScrolling: 'touch',
    marginTop: 20
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

export default Payroll;
