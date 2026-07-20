import React, { useState } from 'react';
import { Settings, Download } from 'lucide-react';

const WarehouseMovements = () => {
  const [density, setDensity] = useState('relaxed'); // compact, default, relaxed (relaxed active by default as per screenshot)
  const [isColumnsMenuOpen, setIsColumnsMenuOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toast, setToast] = useState(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    activity: true,
    staff: true,
    timestamp: true
  });

  // Hardcoded movements logs data matching screenshots
  const [movementsData, setMovementsData] = useState([
    { id: 'H-1', activity: 'Stowed to Bay 3', staff: 'Adam K. (Yard Manager)', timestamp: '06/26/2026 11:20 AM' },
    { id: 'H-2', activity: 'Registered independent asset', staff: 'System', timestamp: '06/26/2026 09:15 AM' },
    { id: 'H-3', activity: 'Inwarded to Aisle 4 - Bin C', staff: 'Sarah R. (Clerk)', timestamp: '06/26/2026 10:45 AM' }
  ]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === movementsData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(movementsData.map(r => r.id));
    }
  };

  const handleExportCSV = () => {
    showToast(`Exported ${selectedRows.length} selected movements to CSV.`);
  };

  const getPaddingStyle = () => {
    if (density === 'compact') return { padding: '8px 24px' };
    if (density === 'default') return { padding: '14px 24px' };
    return { padding: '22px 24px' }; // relaxed
  };

  return (
    <div style={S.container}>
      {/* Page Header */}
      <div style={S.header}>
        <h1 style={S.pageTitle}>Warehouse &amp; Inventory &bull; Movements</h1>
        <p style={S.pageSubtitle}>Log and monitor real-time stock transfers, aisle adjustments, and stowing movements.</p>
      </div>

      {/* Main Card */}
      <div style={S.card}>
        {/* Card Header Section */}
        <div style={S.cardHeader}>
          <h2 style={S.cardTitle}>Inventory Movements &amp; Custody Ledger</h2>

          <div style={S.cardHeaderActions}>
            {/* Density Control */}
            <div style={S.densityPill}>
              {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
                const isActive = density === mode.toLowerCase();
                return (
                  <button
                    key={mode}
                    onClick={() => setDensity(mode.toLowerCase())}
                    style={{
                      ...S.densityBtn,
                      backgroundColor: isActive ? '#ffd400' : 'transparent',
                      color: isActive ? '#0f172a' : '#64748b',
                      border: isActive ? '1px solid #000' : '1px solid transparent'
                    }}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>

            {/* Columns Visibility Dropdown trigger */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsColumnsMenuOpen(!isColumnsMenuOpen)}
                style={{
                  ...S.columnsBtn,
                  border: isColumnsMenuOpen ? '2px solid #000000' : '1px solid #cbd5e1',
                  color: isColumnsMenuOpen ? '#0f172a' : '#64748b'
                }}
              >
                <Settings size={15} />
                <span>COLUMNS</span>
              </button>

              {isColumnsMenuOpen && (
                <div style={S.columnsDropdown}>
                  <div style={S.dropdownHeader}>COLUMN VISIBILITY</div>
                  
                  <label style={S.dropdownOption}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.id}
                      onChange={() => toggleColumn('id')}
                      style={S.checkbox}
                    />
                    <span>ID</span>
                  </label>

                  <label style={S.dropdownOption}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.activity}
                      onChange={() => toggleColumn('activity')}
                      style={S.checkbox}
                    />
                    <span>Activity Logged</span>
                  </label>

                  <label style={S.dropdownOption}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.staff}
                      onChange={() => toggleColumn('staff')}
                      style={S.checkbox}
                    />
                    <span>Staff member</span>
                  </label>

                  <label style={S.dropdownOption}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.timestamp}
                      onChange={() => toggleColumn('timestamp')}
                      style={S.checkbox}
                    />
                    <span>Timestamp</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls Row: Selection Pill (left) */}
        <div style={S.controlsRow}>
          {selectedRows.length > 0 && (
            <div style={S.selectedPill}>
              <span style={S.selectedPillText}>{selectedRows.length} SELECTED</span>
              <button onClick={handleExportCSV} style={S.csvExportBtn}>
                <Download size={13} />
                <span>CSV Export</span>
              </button>
            </div>
          )}
        </div>

        {/* Data Grid Table */}
        <div style={S.tableContainer}>
          <table style={S.table}>
            <thead style={S.thead}>
              <tr>
                <th style={{ ...S.th, width: 48, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === movementsData.length && movementsData.length > 0}
                    onChange={handleSelectAll}
                    style={S.checkbox}
                  />
                </th>
                {visibleColumns.id && <th style={S.th}>ID</th>}
                {visibleColumns.activity && <th style={S.th}>ACTIVITY LOGGED</th>}
                {visibleColumns.staff && <th style={S.th}>STAFF MEMBER</th>}
                {visibleColumns.timestamp && <th style={S.th}>TIMESTAMP</th>}
              </tr>
            </thead>
            <tbody>
              {movementsData.map((row) => {
                const isChecked = selectedRows.includes(row.id);
                return (
                  <tr key={row.id} style={isChecked ? S.trSelected : S.tr}>
                    {/* Checkbox column */}
                    <td style={{ ...getPaddingStyle(), textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleRowSelect(row.id)}
                        style={S.checkbox}
                      />
                    </td>

                    {/* Dynamic Columns */}
                    {visibleColumns.id && (
                      <td style={{ ...getPaddingStyle(), ...S.tdMono }}>{row.id}</td>
                    )}
                    {visibleColumns.activity && (
                      <td style={{ ...getPaddingStyle(), ...S.tdSemibold }}>{row.activity}</td>
                    )}
                    {visibleColumns.staff && (
                      <td style={{ ...getPaddingStyle(), ...S.tdRegular }}>{row.staff}</td>
                    )}
                    {visibleColumns.timestamp && (
                      <td style={{ ...getPaddingStyle(), ...S.tdMuted }}>{row.timestamp}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
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
    padding: '28px 32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    textAlign: 'left'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 16
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  cardHeaderActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap'
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 38
  },
  selectedPill: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fef08a',
    borderRadius: 30,
    padding: '4px 12px',
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
  densityPill: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 2,
    gap: 2
  },
  densityBtn: {
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
    border: 'none'
  },
  columnsBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: '7px 14px',
    fontSize: 11.5,
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.15s ease-in-out',
    whiteSpace: 'nowrap'
  },
  columnsDropdown: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    padding: '20px 24px',
    zIndex: 100,
    minWidth: 220,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    textAlign: 'left'
  },
  dropdownHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.8px',
    marginBottom: 4
  },
  dropdownOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155'
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    border: '1px solid #cbd5e1',
    accentColor: '#3b82f6',
    cursor: 'pointer'
  },
  tableContainer: {
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    overflowX: 'auto',
    width: '100%'
  },
  table: {
    width: '100%',
    minWidth: 800,
    borderCollapse: 'collapse',
    fontSize: 13
  },
  thead: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  th: {
    padding: '14px 24px',
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    textAlign: 'left',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#ffffff',
    transition: 'background-color 0.15s ease'
  },
  trSelected: {
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc'
  },
  tdMono: {
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#0f172a',
    whiteSpace: 'nowrap'
  },
  tdSemibold: {
    fontWeight: '700',
    color: '#334155',
    whiteSpace: 'nowrap'
  },
  tdRegular: {
    fontWeight: '600',
    color: '#475569',
    whiteSpace: 'nowrap'
  },
  tdMuted: {
    fontWeight: '500',
    color: '#64748b',
    whiteSpace: 'nowrap'
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

export default WarehouseMovements;
