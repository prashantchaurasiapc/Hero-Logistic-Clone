import React, { useState } from 'react';
import { Search, Settings, Download, Printer, X } from 'lucide-react';

const WarehouseLabels = () => {
  const [density, setDensity] = useState('default'); // compact, default, relaxed
  const [isColumnsMenuOpen, setIsColumnsMenuOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  
  // Columns visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    labelId: true,
    barcodeQr: true,
    vinItemNo: true,
    stockNo: true,
    customer: true,
    assetType: true,
    location: true,
  });

  // Action Button Focus Outline Highlight States
  const [isPrintAllActive, setIsPrintAllActive] = useState(false);
  const [activeAction, setActiveAction] = useState({ rowId: null, type: null }); // type: 'Print', 'Reprint', 'Preview', 'PDF', 'Details', 'History'

  // History Drawer state
  const [historyDrawer, setHistoryDrawer] = useState({
    isOpen: false,
    vin: '',
    labelId: '',
    historyLogs: []
  });

  // Hardcoded labels data matching stats and search filters
  const [labelsData, setLabelsData] = useState([
    { id: 'LBL-1001', barcode: 'BAR-9011283', vin: '7YV1HP82A81920', stock: 'STK-4401', customer: 'Toyota Australia', assetType: 'Vehicle', location: 'Bay 1', status: 'Printed' },
    { id: 'LBL-1002', barcode: 'BAR-9011284', vin: 'QLD-88A-7YV1HP', stock: 'STK-4402', customer: 'Mazda Motors', assetType: 'Parts Pallet', location: 'Bay 2', status: 'Pending' },
    { id: 'LBL-1003', barcode: 'BAR-9011285', vin: 'VIN-901128547A1', stock: 'STK-4403', customer: 'DHL Logistics', assetType: 'Freight Box', location: 'Lane A1', status: 'Failed' },
    { id: 'LBL-1004', barcode: 'BAR-9011286', vin: '7YV1HP82A81925', stock: 'STK-4404', customer: 'Toyota Australia', assetType: 'Vehicle', location: 'Bay 1', status: 'Reprinted' }
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
    if (selectedRows.length === labelsData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(labelsData.map(r => r.id));
    }
  };

  const handlePrintAllPending = () => {
    setIsPrintAllActive(true);
    showToast('All pending labels sent to printer spool.');
    setTimeout(() => setIsPrintAllActive(false), 800);
  };

  const handleActionClick = (type, row) => {
    setActiveAction({ rowId: row.id, type });

    if (type === 'History') {
      // Open Right Side Drawer
      setHistoryDrawer({
        isOpen: true,
        labelId: row.id,
        vin: row.vin,
        historyLogs: [
          { title: 'Stowed to Bay 3', operator: 'Adam K. (Yard Manager)', time: '06/26/2026 11:20 AM' },
          { title: 'Registered independent asset', operator: 'System', time: '06/26/2026 09:15 AM' }
        ]
      });
      // Auto-clear active style after brief moment for normal actions, but keep active for History while drawer is open
    } else {
      // Trigger Toast Notifications
      if (type === 'Details') {
        showToast(`Viewing details for ${row.id}`);
      } else if (type === 'PDF') {
        showToast(`Downloading PDF for ${row.id}`);
      } else if (type === 'Print') {
        showToast(`Label ${row.id} sent to printer spool.`);
      } else if (type === 'Reprint') {
        showToast(`Reprint command sent for Label ${row.id}.`);
      } else if (type === 'Preview') {
        showToast(`Opening preview for Label ${row.id}...`);
      }
      
      // Clear focus border style after 1 second
      setTimeout(() => {
        setActiveAction(prev => prev.rowId === row.id && prev.type === type ? { rowId: null, type: null } : prev);
      }, 1200);
    }
  };

  const closeHistoryDrawer = () => {
    setHistoryDrawer(prev => ({ ...prev, isOpen: false }));
    setActiveAction({ rowId: null, type: null });
  };

  const handleExportCSV = () => {
    showToast(`Exported ${selectedRows.length} selected labels to CSV.`);
  };

  // Filter based on search query
  const filteredLabels = labelsData.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.barcode.toLowerCase().includes(q) ||
      item.vin.toLowerCase().includes(q) ||
      item.stock.toLowerCase().includes(q) ||
      item.customer.toLowerCase().includes(q)
    );
  });

  const getPaddingStyle = () => {
    if (density === 'compact') return { padding: '6px 12px' };
    if (density === 'relaxed') return { padding: '18px 24px' };
    return { padding: '11px 24px' }; // default
  };

  return (
    <div style={S.container}>
      {/* Page Header */}
      <div style={S.header}>
        <h1 style={S.pageTitle}>Warehouse &amp; Inventory &bull; Labels</h1>
        <p style={S.pageSubtitle}>Manage and generate asset barcode tags, print queue, and spooler logs.</p>
      </div>

      {/* KPI Stats Grid */}
      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statLabel}>TOTAL LABELS</span>
          <span style={S.statValue}>4</span>
          <span style={S.statSub}>Generated tags</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statLabel}>PRINTED LABELS</span>
          <span style={S.statValue}>1</span>
          <span style={S.statSub}>Successfully spooled</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statLabel}>PENDING LABELS</span>
          <span style={S.statValue}>1</span>
          <span style={S.statSub}>In print queue</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statLabel}>FAILED LABELS</span>
          <span style={S.statValue}>1</span>
          <span style={S.statSub}>Printer errors</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statLabel}>REPRINTED LABELS</span>
          <span style={S.statValue}>1</span>
          <span style={S.statSub}>Duplicate tags</span>
        </div>
      </div>

      {/* Main Card */}
      <div style={S.card}>
        {/* Card Header Section */}
        <div style={S.cardHeader}>
          <div>
            <h2 style={S.cardTitle}>Label Management</h2>
            <p style={S.cardSubtitle}>Manage and track generated asset barcode tags.</p>
          </div>

          <div style={S.cardHeaderActions}>
            {/* Search Input */}
            <div style={S.searchWrapper}>
              <Search size={16} style={S.searchIcon} />
              <input
                type="text"
                placeholder="Search VIN, Item No, Barcode, Cu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={S.searchInput}
              />
            </div>

            {/* Print All Pending Button */}
            <button
              onClick={handlePrintAllPending}
              style={{
                ...S.btnPrintAll,
                border: isPrintAllActive ? '3px solid #000000' : 'none',
                padding: isPrintAllActive ? '10px 18px' : '13px 20px'
              }}
            >
              <Printer size={15} />
              <span>Print All Pending</span>
            </button>
          </div>
        </div>

        {/* Controls Row: Selection Pill (left) & Density / Columns (right) */}
        <div style={S.controlsRow}>
          <div style={S.controlsLeft}>
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

          <div style={S.controlsRight}>
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
                      checked={visibleColumns.labelId}
                      onChange={() => toggleColumn('labelId')}
                      style={S.checkbox}
                    />
                    <span>Label ID</span>
                  </label>

                  <label style={S.dropdownOption}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.barcodeQr}
                      onChange={() => toggleColumn('barcodeQr')}
                      style={S.checkbox}
                    />
                    <span>Barcode / QR</span>
                  </label>

                  <label style={S.dropdownOption}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.vinItemNo}
                      onChange={() => toggleColumn('vinItemNo')}
                      style={S.checkbox}
                    />
                    <span>VIN / Item No</span>
                  </label>

                  <label style={S.dropdownOption}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.stockNo}
                      onChange={() => toggleColumn('stockNo')}
                      style={S.checkbox}
                    />
                    <span>Stock No</span>
                  </label>

                  <label style={S.dropdownOption}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.customer}
                      onChange={() => toggleColumn('customer')}
                      style={S.checkbox}
                    />
                    <span>Customer</span>
                  </label>

                  <label style={S.dropdownOption}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.assetType}
                      onChange={() => toggleColumn('assetType')}
                      style={S.checkbox}
                    />
                    <span>Asset Type</span>
                  </label>

                  <label style={S.dropdownOption}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.location}
                      onChange={() => toggleColumn('location')}
                      style={S.checkbox}
                    />
                    <span>Location</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Grid Table */}
        <div style={S.tableContainer}>
          <table style={S.table}>
            <thead style={S.thead}>
              <tr>
                <th style={{ ...S.th, width: 48, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredLabels.length && filteredLabels.length > 0}
                    onChange={handleSelectAll}
                    style={S.checkbox}
                  />
                </th>
                {visibleColumns.labelId && <th style={S.th}>Label ID</th>}
                {visibleColumns.barcodeQr && <th style={S.th}>Barcode / QR</th>}
                {visibleColumns.vinItemNo && <th style={S.th}>VIN / Item No</th>}
                {visibleColumns.stockNo && <th style={S.th}>Stock No</th>}
                {visibleColumns.customer && <th style={S.th}>Customer</th>}
                {visibleColumns.assetType && <th style={S.th}>Asset Type</th>}
                {visibleColumns.location && <th style={S.th}>Location</th>}
                <th style={S.th}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLabels.map((row) => {
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
                    {visibleColumns.labelId && (
                      <td style={{ ...getPaddingStyle(), ...S.tdMono }}>{row.id}</td>
                    )}
                    {visibleColumns.barcodeQr && (
                      <td style={{ ...getPaddingStyle(), ...S.tdSemibold }}>{row.barcode}</td>
                    )}
                    {visibleColumns.vinItemNo && (
                      <td style={{ ...getPaddingStyle(), ...S.tdMuted }}>{row.vin}</td>
                    )}
                    {visibleColumns.stockNo && (
                      <td style={{ ...getPaddingStyle(), ...S.tdMonoMuted }}>{row.stock}</td>
                    )}
                    {visibleColumns.customer && (
                      <td style={{ ...getPaddingStyle(), ...S.tdSemibold }}>{row.customer}</td>
                    )}
                    {visibleColumns.assetType && (
                      <td style={{ ...getPaddingStyle(), ...S.tdRegular }}>{row.assetType}</td>
                    )}
                    {visibleColumns.location && (
                      <td style={{ ...getPaddingStyle(), ...S.tdOrangeBold }}>{row.location}</td>
                    )}

                    {/* Actions Column */}
                    <td style={getPaddingStyle()}>
                      <div style={S.actionsWrapper}>
                        <button
                          onClick={() => handleActionClick('Print', row)}
                          style={{
                            ...S.actionBtnPrint,
                            border: activeAction.rowId === row.id && activeAction.type === 'Print' ? '2px solid #000000' : '1px solid #cbd5e1'
                          }}
                        >
                          Print
                        </button>
                        <button
                          onClick={() => handleActionClick('Reprint', row)}
                          style={{
                            ...S.actionBtnGold,
                            border: activeAction.rowId === row.id && activeAction.type === 'Reprint' ? '2px solid #000000' : '1px solid #fef08a'
                          }}
                        >
                          Reprint
                        </button>
                        <button
                          onClick={() => handleActionClick('Preview', row)}
                          style={{
                            ...S.actionBtnGold,
                            border: activeAction.rowId === row.id && activeAction.type === 'Preview' ? '2px solid #000000' : '1px solid #fef08a'
                          }}
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleActionClick('PDF', row)}
                          style={{
                            ...S.actionBtnGold,
                            border: activeAction.rowId === row.id && activeAction.type === 'PDF' ? '2px solid #000000' : '1px solid #fef08a'
                          }}
                        >
                          <Download size={11} />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => handleActionClick('Details', row)}
                          style={{
                            ...S.actionBtnGold,
                            border: activeAction.rowId === row.id && activeAction.type === 'Details' ? '2px solid #000000' : '1px solid #fef08a'
                          }}
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleActionClick('History', row)}
                          style={{
                            ...S.actionBtnGold,
                            border: activeAction.rowId === row.id && activeAction.type === 'History' ? '2px solid #b45309' : '1px solid #fef08a'
                          }}
                        >
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Custody History Log - Drawer Panel */}
      {historyDrawer.isOpen && (
        <div style={S.drawerOverlay} onClick={closeHistoryDrawer}>
          <div style={S.drawerContent} onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div style={S.drawerHeader}>
              <h3 style={S.drawerTitle}>Asset Custody History Log</h3>
              <button onClick={closeHistoryDrawer} style={S.drawerCloseBtn}>
                <X size={20} />
              </button>
            </div>

            {/* Asset Custody Info Info Header */}
            <div style={S.drawerBody}>
              <div style={S.drawerAssetMeta}>
                <h4 style={S.drawerAssetName}>{historyDrawer.vin}</h4>
                <p style={S.drawerAssetSub}>Asset chain of custody log</p>
              </div>

              {/* History Timeline Logs list */}
              <div style={S.logsList}>
                {historyDrawer.historyLogs.map((log, index) => (
                  <div key={index} style={S.logCard}>
                    <div style={S.logCardLeft}>
                      <span style={S.logCardTitle}>{log.title}</span>
                      <span style={S.logCardOperator}>Operated by: {log.operator}</span>
                    </div>
                    <div style={S.logCardRight}>
                      <span style={S.logCardTime}>{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
        @keyframes slideDrawer {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
    marginBottom: 28
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: '20px 24px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  statLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.8px',
    marginBottom: 16
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12
  },
  statSub: {
    fontSize: 11.5,
    color: '#94a3b8',
    fontWeight: '600'
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
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16
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
    margin: 0
  },
  cardHeaderActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    color: '#94a3b8'
  },
  searchInput: {
    padding: '10px 16px 10px 40px',
    borderRadius: 30,
    border: '1px solid #cbd5e1',
    fontSize: 13,
    width: 260,
    outline: 'none',
    color: '#0f172a',
    boxSizing: 'border-box',
    transition: 'all 0.15s ease',
    ':focus': {
      borderColor: '#FFCC00',
      boxShadow: '0 0 0 3px rgba(255, 204, 0, 0.15)'
    }
  },
  btnPrintAll: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 30,
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 4px 14px rgba(255, 204, 0, 0.35)',
    transition: 'all 0.1s ease',
    boxSizing: 'border-box'
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 38
  },
  controlsLeft: {
    display: 'flex',
    alignItems: 'center'
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
  controlsRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
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
    transition: 'all 0.15s ease-in-out'
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
    minWidth: 1100,
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
    textAlign: 'left'
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
    color: '#0f172a'
  },
  tdSemibold: {
    fontWeight: '600',
    color: '#334155'
  },
  tdRegular: {
    fontWeight: '500',
    color: '#475569'
  },
  tdMuted: {
    fontWeight: '500',
    color: '#64748b'
  },
  tdMonoMuted: {
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#64748b'
  },
  tdOrangeBold: {
    fontWeight: '800',
    color: '#d97706'
  },
  actionsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 6
  },
  actionBtnPrint: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    borderRadius: 30,
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.15s',
    outline: 'none',
    boxSizing: 'border-box'
  },
  actionBtnGold: {
    backgroundColor: '#ffffff',
    color: '#b45309',
    borderRadius: 30,
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    transition: 'all 0.15s',
    outline: 'none',
    boxSizing: 'border-box'
  },
  // Side Drawer Styles
  drawerOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1000
  },
  drawerContent: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: 450,
    height: '100vh',
    boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.08)',
    borderLeft: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideDrawer 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    textAlign: 'left'
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 28px',
    borderBottom: '1px solid #f1f5f9'
  },
  drawerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  drawerCloseBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 8,
    transition: 'background-color 0.15s',
    ':hover': {
      backgroundColor: '#f1f5f9'
    }
  },
  drawerBody: {
    padding: 28,
    overflowY: 'auto',
    flex: 1
  },
  drawerAssetMeta: {
    marginBottom: 24
  },
  drawerAssetName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  drawerAssetSub: {
    fontSize: 12,
    color: '#64748b',
    margin: 0
  },
  logsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  logCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
  },
  logCardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  logCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#b45309' // Gold/orange bold title
  },
  logCardOperator: {
    fontSize: 11.5,
    color: '#64748b'
  },
  logCardRight: {
    textAlign: 'right'
  },
  logCardTime: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500'
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

export default WarehouseLabels;
