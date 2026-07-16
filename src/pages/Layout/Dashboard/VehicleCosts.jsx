import React, { useState } from 'react';

const VehicleCosts = () => {
  const [density, setDensity] = useState('RELAXED');
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toast, setToast] = useState(null);

  const [cols, setCols] = useState({
    vehiclePlate: false,
    revenue: true,
    expenses: true,
    netProfit: true,
    marginRatio: false
  });

  const matrixData = [
    { id: 1, revenue: '$14,200', expenses: '$9,200', netProfit: '$5,000' },
    { id: 2, revenue: '$12,850', expenses: '$8,400', netProfit: '$4,450' },
    { id: 3, revenue: '$18,900', expenses: '$14,200', netProfit: '$4,700' }
  ];

  const toggleColumn = (key) => {
    setCols(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === matrixData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(matrixData.map(r => r.id));
    }
  };

  const getCellPadding = () => {
    if (density === 'COMPACT') return '10px 16px';
    if (density === 'DEFAULT') return '16px 20px';
    return '22px 24px';
  };

  return (
    <div style={S.container}>
      {/* Page Header */}
      <div style={S.header}>
        <h1 style={S.pageTitle}>Accounts &amp; Payroll &bull; Profitability</h1>
        <p style={S.pageSubtitle}>Review invoice factoring, disburse driver paychecks, and analyze margins.</p>
      </div>

      {/* Top Hover Cards */}
      <div style={S.cardsGrid}>
        {/* Total Fuel Cost */}
        <div className="hover-card" style={S.metricCard}>
          <div style={S.metricLabel}>TOTAL FUEL COST</div>
          <div style={S.metricValue}>$14,890.00</div>
          <div style={S.progressWrapper}>
            <div style={S.progressBarTrack}>
              <div style={{ ...S.progressBarFill, width: '65%' }}></div>
            </div>
          </div>
          <div style={S.metricFooter}>
            <span style={S.footerLabel}>Progress</span>
            <span style={S.footerPercent}>65%</span>
          </div>
          <div style={S.footerSub}>Odometer fuel card bills</div>
        </div>

        {/* Maintenance Costs */}
        <div className="hover-card" style={S.metricCard}>
          <div style={S.metricLabel}>MAINTENANCE COSTS</div>
          <div style={S.metricValue}>$8,420.00</div>
          <div style={S.progressWrapper}>
            <div style={S.progressBarTrack}>
              <div style={{ ...S.progressBarFill, width: '45%' }}></div>
            </div>
          </div>
          <div style={S.metricFooter}>
            <span style={S.footerLabel}>Progress</span>
            <span style={S.footerPercent}>45%</span>
          </div>
          <div style={S.footerSub}>Penske and depot service costs</div>
        </div>

        {/* Registration Cost */}
        <div className="hover-card" style={S.metricCard}>
          <div style={S.metricLabel}>REGISTRATION COST</div>
          <div style={S.metricValue}>$2,400.00</div>
          <div style={S.progressWrapper}>
            <div style={S.progressBarTrack}>
              <div style={{ ...S.progressBarFill, width: '12%' }}></div>
            </div>
          </div>
          <div style={S.metricFooter}>
            <span style={S.footerLabel}>Progress</span>
            <span style={S.footerPercent}>12%</span>
          </div>
          <div style={S.footerSub}>Semi-truck permit costs</div>
        </div>

        {/* Insurance Premium */}
        <div className="hover-card" style={S.metricCard}>
          <div style={S.metricLabel}>INSURANCE PREMIUM</div>
          <div style={S.metricValue}>$5,100.00</div>
          <div style={S.progressWrapper}>
            <div style={S.progressBarTrack}>
              <div style={{ ...S.progressBarFill, width: '30%' }}></div>
            </div>
          </div>
          <div style={S.metricFooter}>
            <span style={S.footerLabel}>Progress</span>
            <span style={S.footerPercent}>30%</span>
          </div>
          <div style={S.footerSub}>Commercial fleet cover policy</div>
        </div>
      </div>

      {/* Main Content Split */}
      <div style={S.mainSplit}>
        {/* Left: Profitability Matrix */}
        <div style={S.leftSection}>
          <div style={S.sectionHeader}>
            <h2 style={S.sectionTitle}>Vehicle Profitability Matrix</h2>
            
            <div style={S.toolbarRight}>
              {/* Density Toggle */}
              <div style={S.segmentedControl}>
                {['COMPACT', 'DEFAULT', 'RELAXED'].map(mode => (
                  <button 
                    key={mode}
                    onClick={() => setDensity(mode)}
                    style={{
                      ...S.segmentBtn,
                      ...(density === mode ? S.segmentBtnActive : {})
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Columns Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
                  style={{ ...S.btnOutline, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  COLUMNS
                </button>
                {showColumnsDropdown && (
                  <div style={S.dropdownMenu}>
                    <div style={S.dropdownHeader}>COLUMN VISIBILITY</div>
                    <label style={S.dropdownItem}>
                      <input type="checkbox" checked={cols.vehiclePlate} onChange={() => toggleColumn('vehiclePlate')} style={S.dropdownCheckbox} />
                      Vehicle Plate
                    </label>
                    <label style={S.dropdownItem}>
                      <input type="checkbox" checked={cols.revenue} onChange={() => toggleColumn('revenue')} style={S.dropdownCheckbox} />
                      Revenue Generated
                    </label>
                    <label style={S.dropdownItem}>
                      <input type="checkbox" checked={cols.expenses} onChange={() => toggleColumn('expenses')} style={S.dropdownCheckbox} />
                      Expenses (Breakdown)
                    </label>
                    <label style={S.dropdownItem}>
                      <input type="checkbox" checked={cols.netProfit} onChange={() => toggleColumn('netProfit')} style={S.dropdownCheckbox} />
                      Net Profit Margin
                    </label>
                    <label style={S.dropdownItem}>
                      <input type="checkbox" checked={cols.marginRatio} onChange={() => toggleColumn('marginRatio')} style={S.dropdownCheckbox} />
                      Margin Ratio %
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedRows.length > 0 && (
            <div style={S.controlsRow}>
              <div style={S.selectedPill}>
                <span style={S.selectedPillText}>{selectedRows.length} SELECTED</span>
                <button onClick={() => setToast('Exporting selected to CSV...')} style={S.csvExportBtn}>
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
                      checked={selectedRows.length === matrixData.length && matrixData.length > 0}
                      onChange={handleSelectAll}
                      style={{ ...S.checkboxInput, marginRight: 0, accentColor: '#f59e0b' }} 
                    />
                  </th>
                  {cols.vehiclePlate && <th style={{ ...S.th, padding: getCellPadding() }}>VEHICLE PLATE</th>}
                  {cols.revenue && <th style={{ ...S.th, padding: getCellPadding() }}>REVENUE GENERATED</th>}
                  {cols.expenses && <th style={{ ...S.th, padding: getCellPadding() }}>EXPENSES (BREAKDOWN)</th>}
                  {cols.netProfit && <th style={{ ...S.th, padding: getCellPadding() }}>NET PROFIT MARGIN</th>}
                  {cols.marginRatio && <th style={{ ...S.th, padding: getCellPadding() }}>MARGIN RATIO %</th>}
                </tr>
              </thead>
              <tbody>
                {matrixData.map((item, idx) => {
                  const isSelected = selectedRows.includes(item.id);
                  return (
                    <tr key={item.id} style={{ 
                      borderBottom: idx === matrixData.length - 1 ? 'none' : '1px solid #f1f5f9',
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
                      {cols.vehiclePlate && <td style={{ ...S.td, padding: getCellPadding() }}>-</td>}
                      {cols.revenue && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '800', color: '#1e293b' }}>{item.revenue}</td>}
                      {cols.expenses && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '800', color: '#f87171' }}>{item.expenses}</td>}
                      {cols.netProfit && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '800', color: '#d97706' }}>{item.netProfit}</td>}
                      {cols.marginRatio && <td style={{ ...S.td, padding: getCellPadding() }}>-</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Cost Distribution Analysis */}
        <div style={S.rightSection}>
          <div style={S.rightContent}>
            <div>
              <h2 style={S.sectionTitle}>Cost Distribution Analysis</h2>
              <p style={S.rightSubtitle}>Breakdown of operational spend across vehicles.</p>

              <div style={S.distributionList}>
                {/* Fuel */}
                <div style={S.distItem}>
                  <div style={S.distHeader}>
                    <span style={S.distLabel}>Fuel Ingestion (Diesel)</span>
                    <span style={S.distValue}>47%</span>
                  </div>
                  <div style={S.distBarTrack}>
                    <div style={{ ...S.distBarFill, width: '47%', backgroundColor: '#FFCC00' }}></div>
                  </div>
                </div>

                {/* Maintenance */}
                <div style={S.distItem}>
                  <div style={S.distHeader}>
                    <span style={S.distLabel}>Scheduled Maintenance</span>
                    <span style={S.distValue}>28%</span>
                  </div>
                  <div style={S.distBarTrack}>
                    <div style={{ ...S.distBarFill, width: '28%', backgroundColor: '#10b981' }}></div>
                  </div>
                </div>

                {/* Insurance */}
                <div style={S.distItem}>
                  <div style={S.distHeader}>
                    <span style={S.distLabel}>Fleet Insurance Policies</span>
                    <span style={S.distValue}>16%</span>
                  </div>
                  <div style={S.distBarTrack}>
                    <div style={{ ...S.distBarFill, width: '16%', backgroundColor: '#fde047' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <button style={S.generateReportBtn}>
              Generate Cost Reports
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .hover-card {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04) !important;
          border-color: #cbd5e1 !important;
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
  // Cards Grid
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20,
    marginBottom: 24
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '20px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 8
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-1px',
    marginBottom: 16
  },
  progressWrapper: {
    marginBottom: 8
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFCC00',
    borderRadius: 2
  },
  metricFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8'
  },
  footerPercent: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b'
  },
  footerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b'
  },
  // Main Split Layout
  mainSplit: {
    display: 'flex',
    gap: 24,
    alignItems: 'stretch'
  },
  leftSection: {
    flex: '2',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
  },
  rightSection: {
    flex: '1',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
    display: 'flex',
    flexDirection: 'column'
  },
  rightContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  rightSubtitle: {
    fontSize: 12.5,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 24,
    fontWeight: '500'
  },
  // Controls
  toolbarRight: {
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  },
  segmentedControl: {
    display: 'flex',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 4,
    border: '1px solid #e2e8f0'
  },
  segmentBtn: {
    border: 'none',
    background: 'none',
    padding: '6px 12px',
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    cursor: 'pointer',
    borderRadius: 6,
    transition: 'all 0.2s ease'
  },
  segmentBtnActive: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  btnOutline: {
    backgroundColor: '#ffffff',
    color: '#334155',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 11,
    fontWeight: '800',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    width: 220,
    zIndex: 10,
    padding: '12px 0'
  },
  dropdownHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    padding: '0 16px 8px',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: 8,
    letterSpacing: '0.5px'
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    fontSize: 13,
    color: '#1e293b',
    cursor: 'pointer',
    fontWeight: '500'
  },
  dropdownCheckbox: {
    marginRight: 10,
    accentColor: '#3b82f6',
    width: 14,
    height: 14
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
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
  // Table
  tableWrapper: {
    border: '1px solid #f1f5f9',
    borderRadius: 12,
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  theadRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #f1f5f9'
  },
  th: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textAlign: 'left'
  },
  td: {
    fontSize: 13,
    color: '#334155'
  },
  checkboxInput: {
    accentColor: '#3b82f6',
    width: 16,
    height: 16,
    cursor: 'pointer'
  },
  // Distribution List
  distributionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    marginTop: 32
  },
  distItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  distHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  distLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569'
  },
  distValue: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f172a'
  },
  distBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden'
  },
  distBarFill: {
    height: '100%',
    borderRadius: 3
  },
  generateReportBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    color: '#0f172a',
    fontSize: 12.5,
    fontWeight: '800',
    padding: '12px 16px',
    width: '100%',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    marginTop: 32,
    textAlign: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  }
};

export default VehicleCosts;
