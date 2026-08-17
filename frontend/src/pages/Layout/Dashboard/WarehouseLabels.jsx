import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useLocation } from 'react-router-dom';
import { Search, Settings, Download, Printer, X, MoreVertical, Eye, FileText, RotateCcw, Info, History } from 'lucide-react';

const WarehouseLabels = () => {
  const location = useLocation();
  const isYard = location.pathname.startsWith('/yard');
  const [density, setDensity] = useState('default'); // compact, default, relaxed
  const [isColumnsMenuOpen, setIsColumnsMenuOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);
  
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

  // Dynamic labels data matching database stock items
  const [labelsData, setLabelsData] = useState([]);

  useEffect(() => {
    const fetchStockForLabels = async () => {
      try {
        const res = await api.get('/warehouse-portal/stock');
        const items = res.data?.data || [];
        const mapped = items.map((item, idx) => ({
          id: `LBL-${1000 + idx + 1}`,
          itemId: item.id,
          barcode: item.vin || item.sku || `BAR-${9011280 + idx}`,
          vin: item.vin || item.sku || '-',
          stock: item.stockRef || `STK-${4400 + idx + 1}`,
          customer: item.customerName || 'Hero Logistics Client',
          assetType: item.vehicleType || 'Vehicle',
          location: item.location || 'Bay 1',
          status: idx % 3 === 0 ? 'Printed' : (idx % 3 === 1 ? 'Pending' : 'Reprinted')
        }));
        setLabelsData(mapped);
      } catch (err) {
        console.error('Failed to load stock for labels:', err);
      }
    };
    fetchStockForLabels();
  }, []);

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

  const handlePrintAllPending = async () => {
    setIsPrintAllActive(true);
    try {
      const pendingRows = labelsData.filter(r => r.status === 'Pending');
      if (pendingRows.length === 0) {
        showToast('No pending labels to print.');
        setIsPrintAllActive(false);
        return;
      }
      
      await Promise.all(
        pendingRows.map(row =>
          api.post('/warehouse-portal/labels/print', {
            labelType: row.assetType === 'Vehicle' ? 'VIN Label' : 'Pallet Label',
            itemId: row.itemId,
            printerTarget: 'Zebra GK420d',
            copies: 1
          })
        )
      );
      
      showToast('All pending labels sent to printer spool successfully.');
      // Refresh status locally
      setLabelsData(prev => prev.map(r => r.status === 'Pending' ? { ...r, status: 'Printed' } : r));
    } catch (err) {
      console.error('Failed to print all:', err);
      showToast('Failed to print all pending labels.');
    }
    setTimeout(() => setIsPrintAllActive(false), 800);
  };

  const handleActionClick = async (type, row) => {
    setActiveAction({ rowId: row.id, type });

    if (type === 'History') {
      setHistoryDrawer({
        isOpen: true,
        labelId: row.id,
        vin: row.vin,
        historyLogs: [
          { title: 'Stowed to ' + row.location, operator: 'Adam K. (Yard Manager)', time: 'Just now' },
          { title: 'Registered independent asset', operator: 'System', time: '06/26/2026 09:15 AM' }
        ]
      });
    } else {
      if (type === 'Details') {
        showToast(`Viewing details for ${row.id}`);
      } else if (type === 'PDF') {
        showToast(`Downloading PDF for ${row.id}`);
      } else if (type === 'Print' || type === 'Reprint') {
        try {
          const res = await api.post('/warehouse-portal/labels/print', {
            labelType: row.assetType === 'Vehicle' ? 'VIN Label' : 'Pallet Label',
            itemId: row.itemId,
            printerTarget: 'Zebra GK420d',
            copies: 1
          });
          showToast(`✓ Label ${row.id} spooled successfully (Job: ${res.data?.data?.jobId || '#PJ-100'})`);
          // Update status
          setLabelsData(prev => prev.map(r => r.id === row.id ? { ...r, status: type === 'Print' ? 'Printed' : 'Reprinted' } : r));
        } catch (err) {
          console.error('Failed to print:', err);
          showToast(`Error printing label: ${err.message}`);
        }
      } else if (type === 'Preview') {
        showToast(`Opening preview for Label ${row.id}...`);
      }
      
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
        <h1 style={S.pageTitle}>{isYard ? 'Yard Labels & Barcodes' : 'Warehouse & Inventory • Labels'}</h1>
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
                      backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
                        {/* Primary Print Button */}
                        <button
                          onClick={() => handleActionClick('Print', row)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 14px',
                            borderRadius: '8px',
                            backgroundColor: '#ffcc00',
                            color: '#000000',
                            fontWeight: '800',
                            fontSize: '11.5px',
                            border: activeAction.rowId === row.id && activeAction.type === 'Print' ? '2px solid #000000' : '1px solid transparent',
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                          }}
                        >
                          <Printer size={13} />
                          <span>Print</span>
                        </button>

                        {/* 3-Dot Action Dropdown Menu Trigger */}
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <button
                            onClick={() => setActiveActionMenuId(activeActionMenuId === row.id ? null : row.id)}
                            title="More Actions"
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '8px',
                              border: activeActionMenuId === row.id ? '2px solid #000000' : '1px solid #cbd5e1',
                              backgroundColor: activeActionMenuId === row.id ? '#f1f5f9' : '#ffffff',
                              color: '#334155',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <MoreVertical size={14} />
                          </button>

                          {/* Interactive Dropdown Popup Menu */}
                          {activeActionMenuId === row.id && (
                            <>
                              <div
                                style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                                onClick={() => setActiveActionMenuId(null)}
                              />
                              <div style={{
                                position: 'absolute',
                                right: 0,
                                top: 'calc(100% + 6px)',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                padding: '6px',
                                zIndex: 1000,
                                minWidth: '170px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                textAlign: 'left'
                              }}>
                                <div style={{ padding: '6px 10px 4px 10px', fontSize: '9.5px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                                  ACTIONS
                                </div>

                                <button
                                  className="wh-action-menu-item"
                                  onClick={() => { setActiveActionMenuId(null); handleActionClick('Print', row); }}
                                  style={S.menuItemBtn}
                                >
                                  <Printer size={13} style={{ color: '#b45309' }} />
                                  <span>Print Label</span>
                                </button>

                                <button
                                  className="wh-action-menu-item"
                                  onClick={() => { setActiveActionMenuId(null); handleActionClick('Reprint', row); }}
                                  style={S.menuItemBtn}
                                >
                                  <RotateCcw size={13} style={{ color: '#d97706' }} />
                                  <span>Reprint Tag</span>
                                </button>

                                <button
                                  className="wh-action-menu-item"
                                  onClick={() => { setActiveActionMenuId(null); handleActionClick('Preview', row); }}
                                  style={S.menuItemBtn}
                                >
                                  <Eye size={13} style={{ color: '#2563eb' }} />
                                  <span>Preview Label</span>
                                </button>

                                <button
                                  className="wh-action-menu-item"
                                  onClick={() => { setActiveActionMenuId(null); handleActionClick('PDF', row); }}
                                  style={S.menuItemBtn}
                                >
                                  <Download size={13} style={{ color: '#059669' }} />
                                  <span>Download PDF</span>
                                </button>

                                <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '3px 0' }} />

                                <button
                                  className="wh-action-menu-item"
                                  onClick={() => { setActiveActionMenuId(null); handleActionClick('Details', row); }}
                                  style={S.menuItemBtn}
                                >
                                  <Info size={13} style={{ color: '#475569' }} />
                                  <span>View Details</span>
                                </button>

                                <button
                                  className="wh-action-menu-item"
                                  onClick={() => { setActiveActionMenuId(null); handleActionClick('History', row); }}
                                  style={S.menuItemBtn}
                                >
                                  <History size={13} style={{ color: '#7c3aed' }} />
                                  <span>Custody History Log</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
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
        @keyframes slideDrawer {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .wh-action-menu-item:hover {
          background-color: #f1f5f9 !important;
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
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
    fontWeight: '600',
    color: '#334155',
    whiteSpace: 'nowrap'
  },
  tdRegular: {
    fontWeight: '500',
    color: '#475569',
    whiteSpace: 'nowrap'
  },
  tdMuted: {
    fontWeight: '500',
    color: '#64748b',
    whiteSpace: 'nowrap'
  },
  tdMonoMuted: {
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#64748b',
    whiteSpace: 'nowrap'
  },
  tdOrangeBold: {
    fontWeight: '800',
    color: '#d97706',
    whiteSpace: 'nowrap'
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
  menuItemBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '8px 10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#334155',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'left',
    outline: 'none',
    transition: 'background-color 0.15s ease'
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
