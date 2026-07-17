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

const MyLoads = () => {
  const [density, setDensity] = useState('RELAXED'); // COMPACT, DEFAULT, RELAXED
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  // Form States
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');
  const [bookCargoSpecs, setBookCargoSpecs] = useState('');
  const [bookWeight, setBookWeight] = useState('');
  const [bookRoute, setBookRoute] = useState('');

  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Shipments');

  // Table Data (matches screenshot exactly)
  const [loads, setLoads] = useState([
    { id: 'LD-7712', specs: 'Cotton Reels', path: 'New York NY ➔ Boston MA', cost: '$1,800.00', status: 'Draft', checked: false },
    { id: 'LD-9411', specs: 'Automotive Components (Flatbed)', path: 'Chicago IL ➔ Dallas TX', cost: '$1,200.00', status: 'In Transit', checked: false },
    { id: 'LD-1102', specs: 'Dry Grocery Pallets', path: 'Houston TX ➔ Atlanta GA', cost: '$850.00', status: 'Planned', checked: false },
    { id: 'LD-4809', specs: 'Industrial Coils', path: 'Seattle WA ➔ Portland OR', cost: '$2,400.00', status: 'Delivered', checked: false },
    { id: 'LD-7713', specs: 'General Cargo', path: 'Miami FL ➔ Tampa FL', cost: '$600.00', status: 'Draft', checked: false }
  ]);

  // Column Visibility (Default matches screenshot: only Transit State visible)
  const [visibleColumns, setVisibleColumns] = useState({
    loadId: false,
    cargoSpecs: false,
    path: false,
    cost: false,
    status: true,
    actions: false
  });

  const columnsList = [
    { key: 'loadId', label: 'Load ID' },
    { key: 'cargoSpecs', label: 'Cargo specs' },
    { key: 'path', label: 'Origin/Destination Path' },
    { key: 'cost', label: 'Cost' },
    { key: 'status', label: 'Transit State' },
    { key: 'actions', label: 'Actions' }
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter & Search Logic
  const filteredLoads = loads.filter(l => {
    const matchesSearch = 
      l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.path.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'All Shipments') return matchesSearch;
    
    // Map dropdown filter options to data status
    const statusMap = {
      'Accepted': 'Planned',
      'In Transit': 'In Transit',
      'Scheduled Match': 'Planned',
      'Delivered': 'Delivered',
      'Awaiting Matching': 'Planned',
      'Cancelled': 'Cancelled'
    };
    return matchesSearch && l.status === statusMap[statusFilter];
  });

  const isAllChecked = filteredLoads.length > 0 && filteredLoads.every(l => l.checked);

  const handleMasterCheckbox = () => {
    const targetState = !isAllChecked;
    setLoads(prev => prev.map(l => {
      if (filteredLoads.some(fl => fl.id === l.id)) {
        return { ...l, checked: targetState };
      }
      return l;
    }));
  };

  const handleRowCheckbox = (id) => {
    setLoads(prev => prev.map(l => 
      l.id === id ? { ...l, checked: !l.checked } : l
    ));
  };

  const getCellPadding = () => {
    if (density === 'COMPACT') return '10px 16px';
    if (density === 'DEFAULT') return '16px 20px';
    return '24px 28px'; // RELAXED
  };

  const getStatusStyle = (status) => {
    switch (status.toUpperCase()) {
      case 'IN TRANSIT':
        return { backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde047' };
      case 'DELIVERED':
        return { backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' };
      case 'PLANNED':
        return { backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }; // Light blue for Planned
      case 'DRAFT':
        return { backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }; // Slate grey for Draft
      default:
        return { backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' };
    }
  };

  const getActionBtnStyle = (type) => {
    switch (type) {
      case 'POD':
        return { ...S.actionBtn, color: '#10b981', borderColor: '#a7f3d0', backgroundColor: '#f0fdf4' };
      case 'Rebook':
        return { ...S.actionBtn, color: '#3b82f6', borderColor: '#bfdbfe', backgroundColor: '#eff6ff' };
      case 'Rate':
        return { ...S.actionBtn, color: '#94a3b8', borderColor: '#e2e8f0', backgroundColor: 'transparent', cursor: 'not-allowed' };
      default: // Inspect, BOL
        return { ...S.actionBtn, color: '#475569', borderColor: '#cbd5e1', backgroundColor: '#ffffff' };
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    showToast('Support ticket submitted successfully.');
    setShowSupportModal(false);
    setSupportSubject('');
    setSupportDescription('');
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    const newLoad = {
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      specs: bookCargoSpecs,
      path: bookRoute || 'Pending Route',
      cost: `$1,500.00`,
      status: 'Planned',
      checked: false
    };
    setLoads(prev => [newLoad, ...prev]);
    showToast('Cargo shipment booked successfully!');
    setShowBookModal(false);
    setBookCargoSpecs('');
    setBookWeight('');
    setBookRoute('');
  };

  return (
    <div className="customer-dashboard">
      {/* Header Container */}
      <div className="customer-header-container">
        <div>
          <h1 className="customer-title">Customer Shipper Portal &bull; My Loads</h1>
          <p className="customer-subtitle">Request load deliveries, audit invoices, download BOL papers, and track active route paths.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => setShowSupportModal(true)} className="contact-support-btn">Contact Support</button>
          <button onClick={() => setShowBookModal(true)} className="book-shipment-btn">+ Book Shipment</button>
        </div>
      </div>

      {/* Main Card */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <div>
            <h2 style={S.cardTitle}>Shipped Cargo Manifests</h2>
            <span 
              onClick={() => showToast('Exporting shipment history as CSV.')} 
              style={S.exportLink}
            >
              Export Shipment History (CSV)
            </span>
          </div>

          <div style={S.headerControlsRight}>
            <div style={S.searchWrapper}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" style={{ marginRight: 8 }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..." 
                style={S.searchInput}
              />
            </div>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={S.selectDropdown}
            >
              <option value="All Shipments">All Shipments</option>
              <option value="Accepted">Accepted</option>
              <option value="In Transit">In Transit</option>
              <option value="Scheduled Match">Scheduled Match</option>
              <option value="Delivered">Delivered</option>
              <option value="Awaiting Matching">Awaiting Matching</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div style={S.toolbar}>
          <div style={S.toolbarLeft}>
            {loads.some(l => l.checked) && (
              <div style={S.selectedPill}>
                <span style={S.selectedPillText}>
                  {loads.filter(l => l.checked).length} SELECTED
                </span>
                <button onClick={() => showToast('Exporting selected shipments as CSV.')} style={S.csvExportBtn}>
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
                <th style={{ ...S.th, padding: getCellPadding(), width: 64, textAlign: 'center' }}>
                  <CustomCheckbox 
                    checked={isAllChecked}
                    onChange={handleMasterCheckbox}
                  />
                </th>
                {visibleColumns.loadId && <th style={{ ...S.th, padding: getCellPadding() }}>LOAD ID</th>}
                {visibleColumns.cargoSpecs && <th style={{ ...S.th, padding: getCellPadding() }}>CARGO SPECS</th>}
                {visibleColumns.path && <th style={{ ...S.th, padding: getCellPadding() }}>ORIGIN/DESTINATION PATH</th>}
                {visibleColumns.cost && <th style={{ ...S.th, padding: getCellPadding() }}>COST</th>}
                {visibleColumns.status && <th style={{ ...S.th, padding: getCellPadding() }}>TRANSIT STATE</th>}
                {visibleColumns.actions && <th style={{ ...S.th, padding: getCellPadding() }}>ACTIONS</th>}
              </tr>
            </thead>
            <tbody>
              {filteredLoads.map((row) => (
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
                  {visibleColumns.loadId && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '700', color: '#0f172a' }}>{row.id}</td>}
                  {visibleColumns.cargoSpecs && <td style={{ ...S.td, padding: getCellPadding(), color: '#334155' }}>{row.specs}</td>}
                  {visibleColumns.path && <td style={{ ...S.td, padding: getCellPadding(), color: '#475569' }}>{row.path}</td>}
                  {visibleColumns.cost && <td style={{ ...S.td, padding: getCellPadding(), fontWeight: '700', color: '#b45309' }}>{row.cost}</td>}
                  {visibleColumns.status && (
                    <td style={{ ...S.td, padding: getCellPadding() }}>
                      <span style={{ ...S.statusPill, ...getStatusStyle(row.status) }}>{row.status}</span>
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td style={{ ...S.td, padding: getCellPadding() }}>
                      <button style={getActionBtnStyle('Inspect')}>Inspect</button>
                      <button style={getActionBtnStyle('BOL')}>BOL</button>
                      {row.id === 'LD-4809' && (
                        <>
                          <button style={getActionBtnStyle('POD')}>POD</button>
                          <button style={getActionBtnStyle('Rate')}>Rate</button>
                          <button style={getActionBtnStyle('Rebook')}>Rebook</button>
                        </>
                      )}
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

      {/* Book Shipment Modal (Centered Modal) */}
      {showBookModal && (
        <div style={S.bookModalOverlay} onClick={() => setShowBookModal(false)}>
          <div style={S.bookModalContent} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>Book New Cargo Shipment Load</h2>
              <button onClick={() => setShowBookModal(false)} style={S.closeBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleBookSubmit}>
              <div style={S.modalBody}>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>CARGO SPECS / ITEMS</label>
                  <input 
                    type="text" 
                    value={bookCargoSpecs}
                    onChange={(e) => setBookCargoSpecs(e.target.value)}
                    placeholder="e.g. Dry Grocery Pallets" 
                    style={S.textInput}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={S.fieldLabel}>CARGO WEIGHT (LBS)</label>
                    <input 
                      type="text" 
                      value={bookWeight}
                      onChange={(e) => setBookWeight(e.target.value)}
                      placeholder="e.g. 12000" 
                      style={S.textInput}
                      required
                    />
                  </div>
                  <div>
                    <label style={S.fieldLabel}>ROUTE PATH ORIGIN/DEST</label>
                    <input 
                      type="text" 
                      value={bookRoute}
                      onChange={(e) => setBookRoute(e.target.value)}
                      placeholder="e.g. Chicago IL ➔ Atlanta GA" 
                      style={S.textInput}
                      required
                    />
                  </div>
                </div>

                <button type="submit" style={S.btnBookSubmit}>Book Delivery Load</button>
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
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

/* ─── Styles Object ─── */
const S = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '24px 32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid #e2e8f0',
    marginTop: 24
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 6px 0'
  },
  exportLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#d97706',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.15s ease'
  },
  headerControlsRight: {
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    padding: '8px 12px',
    width: 240,
    transition: 'border-color 0.15s ease'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: 13,
    color: '#334155',
    width: '100%',
    backgroundColor: 'transparent'
  },
  selectDropdown: {
    backgroundColor: '#ffffff',
    border: '1.5px solid #facc15', // Gold border to match screens
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center'
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
    letterSpacing: '0.5px'
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
    transition: 'all 0.15s ease'
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
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1px solid #e2e8f0',
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
    fontSize: 13,
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
    background: 'none',
    border: '1px solid #cbd5e1',
    borderRadius: 20,
    padding: '6px 14px',
    fontSize: 11,
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    marginRight: 6
  },
  statusPill: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 30,
    fontSize: 10.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
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
  bookModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    fontFamily: "'Outfit', 'Inter', sans-serif"
  },
  bookModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '90%',
    maxWidth: 500,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    animation: 'zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'flex',
    flexDirection: 'column'
  },
  btnBookSubmit: {
    width: '100%',
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 30,
    padding: '12px 0',
    fontSize: 13.5,
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(255, 204, 0, 0.35)',
    transition: 'all 0.15s ease',
    marginTop: 8
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

export default MyLoads;
