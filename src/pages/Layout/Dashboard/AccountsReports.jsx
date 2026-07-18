import React, { useState } from 'react';
import {
  TrendingUp, Users, Truck, Building2, Layers,
  ChevronDown, Settings, Download
} from 'lucide-react';

const CustomCheckbox = ({ checked, onChange }) => {
  return (
    <div
      onClick={onChange}
      style={{
        width: 18,
        height: 18,
        border: checked ? '2px solid #d97706' : '2px solid #cbd5e1',
        borderRadius: 4,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.1s ease',
        margin: '0 auto'
      }}
    >
      {checked && (
        <span style={{ color: '#d97706', fontSize: 11, fontWeight: '900', lineHeight: 1 }}>✓</span>
      )}
    </div>
  );
};

const AccountsReports = () => {
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [activeTab, setActiveTab] = useState('Revenue Trends');
  const [density, setDensity] = useState('relaxed'); // compact, default, relaxed (default to relaxed as per screenshot)
  const [isColumnsMenuOpen, setIsColumnsMenuOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);

  // Column visibility states for each tab
  const [revenueColumns, setRevenueColumns] = useState({
    period: true,
    grossRevenue: true,
    expenses: true,
    netProfit: true
  });

  const [driverColumns, setDriverColumns] = useState({
    driver: true,
    trips: true,
    distance: true,
    safety: true
  });

  const [customerColumns, setCustomerColumns] = useState({
    period: true,
    contracts: true,
    volume: true
  });

  const [capacityColumns, setCapacityColumns] = useState({
    zone: true,
    utilization: true
  });

  // Mock datasets matching screenshots
  const revenueData = [
    { id: 'R-1', period: 'Feb', grossRevenue: 35000, expenses: 28000, netProfit: 7000 },
    { id: 'R-2', period: 'Mar', grossRevenue: 42000, expenses: 31000, netProfit: 11000 },
    { id: 'R-3', period: 'Apr', grossRevenue: 48000, expenses: 36000, netProfit: 12000 },
    { id: 'R-4', period: 'May', grossRevenue: 55000, expenses: 41000, netProfit: 14000 },
    { id: 'R-5', period: 'Jun', grossRevenue: 62000, expenses: 47000, netProfit: 15000 },
    { id: 'R-6', period: 'Jul', grossRevenue: 12790, expenses: 16220, netProfit: -3430 }
  ];

  const driverData = [
    { id: 'D-1', driver: 'John D.', trips: 24, distance: '4,200 km', safety: '98%' },
    { id: 'D-2', driver: 'Sarah R.', trips: 18, distance: '3,100 km', safety: '95%' },
    { id: 'D-3', driver: 'Donald S.', trips: 30, distance: '5,500 km', safety: '92%' },
    { id: 'D-4', driver: 'Mike T.', trips: 15, distance: '2,400 km', safety: '97%' },
    { id: 'D-5', driver: 'Emily K.', trips: 28, distance: '4,900 km', safety: '99%' }
  ];

  const customerData = [
    { id: 'C-1', period: 'Wk 1', contracts: 12, volume: '1,200 tons' },
    { id: 'C-2', period: 'Wk 2', contracts: 15, volume: '1,500 tons' },
    { id: 'C-3', period: 'Wk 3', contracts: 8, volume: '850 tons' },
    { id: 'C-4', period: 'Wk 4', contracts: 20, volume: '2,100 tons' }
  ];

  const capacityData = [
    { id: 'CP-1', zone: 'Bay A (Dry)', utilization: '85%' },
    { id: 'CP-2', zone: 'Bay B (Cold)', utilization: '90%' },
    { id: 'CP-3', zone: 'Bay C (Hazard)', utilization: '60%' },
    { id: 'CP-4', zone: 'Bay D (Overflow)', utilization: '75%' }
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExportCSV = () => {
    showToast('Reports module exported successfully to CSV format.');
  };

  const handleExportPDF = () => {
    showToast('Compiling and generating PDF report document.');
  };

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Switch columns toggle config based on active tab
  const getColumnsConfig = () => {
    if (activeTab === 'Revenue Trends') {
      return {
        columns: revenueColumns,
        set: setRevenueColumns,
        labels: ['Period', 'Gross Revenue', 'Total Expenses', 'Net Profit']
      };
    }
    if (activeTab === 'Driver Performance') {
      return {
        columns: driverColumns,
        set: setDriverColumns,
        labels: ['Driver Operator', 'Trips Completed', 'Distance Logged', 'Safety Rating']
      };
    }
    if (activeTab === 'Customer Growth') {
      return {
        columns: customerColumns,
        set: setCustomerColumns,
        labels: ['Timeline Period', 'New Contracts Signed', 'Active Loads Volume']
      };
    }
    return {
      columns: capacityColumns,
      set: setCapacityColumns,
      labels: ['Warehouse Zone', 'Capacity Utilization']
    };
  };

  const currentConfig = getColumnsConfig();

  const toggleColumn = (colKey) => {
    currentConfig.set(prev => ({ ...prev, [colKey]: !prev[colKey] }));
  };

  // Map label string to state key helper
  const getColKey = (label) => {
    if (label === 'Period') return 'period';
    if (label === 'Gross Revenue') return 'grossRevenue';
    if (label === 'Total Expenses') return 'expenses';
    if (label === 'Net Profit') return 'netProfit';
    if (label === 'Driver Operator') return 'driver';
    if (label === 'Trips Completed') return 'trips';
    if (label === 'Distance Logged') return 'distance';
    if (label === 'Safety Rating') return 'safety';
    if (label === 'Timeline Period') return 'period';
    if (label === 'New Contracts Signed') return 'contracts';
    if (label === 'Active Loads Volume') return 'volume';
    if (label === 'Warehouse Zone') return 'zone';
    if (label === 'Capacity Utilization') return 'utilization';
    return '';
  };

  // Get active dataset
  const getActiveDataset = () => {
    if (activeTab === 'Revenue Trends') return { data: revenueData, title: 'Revenue vs Expenses Flow' };
    if (activeTab === 'Driver Performance') return { data: driverData, title: 'Driver Distance & Trips Metrics' };
    if (activeTab === 'Customer Growth') return { data: customerData, title: 'Client Acquisition vs Output' };
    return { data: capacityData, title: 'Storage Bay Occupancy Rate' };
  };

  const { data: currentDataset, title: chartTitle } = getActiveDataset();

  // Pagination config
  const itemsPerPage = 5;
  const totalItems = currentDataset.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedData = currentDataset.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    const paginatedIds = paginatedData.map(r => r.id);
    const allSelected = paginatedIds.every(id => selectedRows.includes(id));
    if (allSelected) {
      setSelectedRows(selectedRows.filter(id => !paginatedIds.includes(id)));
    } else {
      setSelectedRows([...new Set([...selectedRows, ...paginatedIds])]);
    }
  };

  const getPaddingStyle = () => {
    if (density === 'compact') return { padding: '8px 24px' };
    if (density === 'default') return { padding: '14px 24px' };
    return { padding: '22px 24px' }; // relaxed
  };

  // Tab configuration
  const tabOptions = [
    { name: 'Revenue Trends', icon: <TrendingUp size={16} /> },
    { name: 'Driver Performance', icon: <Users size={16} /> },
    { name: 'Vehicle Utilization', icon: <Truck size={16} /> },
    { name: 'Customer Growth', icon: <Building2 size={16} /> },
    { name: 'Warehouse Capacity', icon: <Layers size={16} /> }
  ];

  return (
    <div style={S.container}>
      {/* Page Header */}
      <div style={S.header}>
        <h1 style={S.pageTitle}>Reports &amp; Analytics Center</h1>
        <p style={S.pageSubtitle}>Generate, export, and visualize system-wide logistics performance metrics.</p>
      </div>

      {/* KPI Stats Grid */}
      <div style={S.kpiGrid}>
        <div className="hover-card" style={S.kpiCard}>
          <div style={S.kpiHeader}>
            <span style={S.kpiLabel}>TOTAL REVENUE</span>
            <span style={S.kpiBadge}>+14.2%</span>
          </div>
          <span style={S.kpiValue}>$12,790.00</span>
          <span style={S.kpiSub}>Across selected period</span>
        </div>

        <div className="hover-card" style={S.kpiCard}>
          <div style={S.kpiHeader}>
            <span style={S.kpiLabel}>NET PROFIT MARGIN</span>
            <span style={{ ...S.kpiBadge, backgroundColor: '#ecfdf5', color: '#0ea5e9' }}>-26.8% Margin</span>
          </div>
          <span style={S.kpiValue}>$-3,430.00</span>
          <span style={S.kpiSub}>After expenses</span>
        </div>

        <div style={S.kpiCard}>
          <div style={S.kpiHeader}>
            <span style={S.kpiLabel}>TOTAL TRIPS COMPLETED</span>
            <span style={{ ...S.kpiBadge, backgroundColor: '#ecfdf5', color: '#10b981' }}>Live</span>
          </div>
          <span style={S.kpiValue}>1</span>
          <span style={S.kpiSub}>Loads delivered</span>
        </div>

        <div style={S.kpiCard}>
          <div style={S.kpiHeader}>
            <span style={S.kpiLabel}>ACTIVE CUSTOMERS</span>
            <span style={{ ...S.kpiBadge, backgroundColor: '#ecfdf5', color: '#10b981' }}>Stable</span>
          </div>
          <span style={S.kpiValue}>5</span>
          <span style={S.kpiSub}>Billed shippers</span>
        </div>
      </div>

      {/* Filters & Export Options card */}
      <div style={S.filtersCard}>
        <div style={S.filtersHeader}>
          <span style={S.funnelIcon}>⏳</span>
          <span style={S.filtersTitle}>FILTERS:</span>
        </div>

        <div style={S.filtersStack}>
          {/* Filter Select 1 */}
          <div style={S.selectWrapperFull}>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              style={{
                ...S.filterSelectFull,
                border: '2px solid #ffd400' // Yellow border as per screenshot
              }}
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="Last 3 Months">Last 3 Months</option>
            </select>
            <ChevronDown size={16} style={S.selectChevronFull} />
          </div>

          {/* Filter Select 2 */}
          <div style={S.selectWrapperFull}>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              style={{
                ...S.filterSelectFull,
                border: '1px solid #cbd5e1'
              }}
            >
              <option value="All Branches">All Branches</option>
              <option value="Dallas Depot">Dallas Depot</option>
              <option value="Chicago Yard">Chicago Yard</option>
            </select>
            <ChevronDown size={16} style={S.selectChevronFull} />
          </div>
        </div>

        <div style={S.filtersButtonsRow}>
          <button onClick={handleExportCSV} style={S.btnExportCsv}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button onClick={handleExportPDF} style={S.btnExportPdf}>
            <Download size={15} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Analytics Container */}
      <div style={S.card}>
        {/* Navigation Tabs */}
        <div style={S.tabsHeader}>
          {tabOptions.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setCurrentPage(1);
                }}
                style={{
                  ...S.tabButton,
                  color: isActive ? '#b45309' : '#64748b',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #ffd400' : '3px solid transparent',
                  borderRadius: 0,
                  backgroundColor: 'transparent'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {tab.icon}
                  <span>{tab.name}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── Vehicle Utilization Tab Custom Layout ─── */}
        {activeTab === 'Vehicle Utilization' ? (
          <div>
            <span style={S.chartLabel}>Fleet Status Distribution</span>
            <div style={S.utilizationContainer}>
              {/* Doughnut Chart on left */}
              <div style={S.donutChartCard}>
                <div style={S.donutWrapper}>
                  {/* SVG Pie/Donut Chart */}
                  <svg width="220" height="220" viewBox="0 0 42 42" className="donut-svg">
                    <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                    <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="4"></circle>

                    {/* Blue Segment (In Transit): 45% -> length 42.5, gap 57.5, offset 19 */}
                    <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="42.5 57.5" strokeDashoffset="19" transform="rotate(-90 21 21)">
                      <animate attributeName="stroke-dashoffset" from="61.5" to="19" dur="1.2s" begin="0.1s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" keyTimes="0 1" />
                    </circle>

                    {/* Red Segment (Out of Service): 10% -> length 9.5, gap 90.5, offset -25 */}
                    <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray="9.5 90.5" strokeDashoffset="-25" transform="rotate(-90 21 21)">
                      <animate attributeName="stroke-dashoffset" from="-15.5" to="-25" dur="1.2s" begin="0.1s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" keyTimes="0 1" />
                    </circle>

                    {/* Orange Segment (Maintenance): 15% -> length 14, gap 86, offset -36 */}
                    <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="14 86" strokeDashoffset="-36" transform="rotate(-90 21 21)">
                      <animate attributeName="stroke-dashoffset" from="-22" to="-36" dur="1.2s" begin="0.1s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" keyTimes="0 1" />
                    </circle>

                    {/* Green Segment (Available): 30% -> length 28, gap 72, offset -51.5 */}
                    <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="28 72" strokeDashoffset="-51.5" transform="rotate(-90 21 21)">
                      <animate attributeName="stroke-dashoffset" from="-23.5" to="-51.5" dur="1.2s" begin="0.1s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" keyTimes="0 1" />
                    </circle>
                  </svg>
                </div>
                {/* Horizontal status legends */}
                <div style={S.statusLegendsRow}>
                  <div style={S.statusLegendItem}><span style={{ ...S.legendDot, backgroundColor: '#10b981' }}></span> Available</div>
                  <div style={S.statusLegendItem}><span style={{ ...S.legendDot, backgroundColor: '#0ea5e9' }}></span> In Transit</div>
                  <div style={S.statusLegendItem}><span style={{ ...S.legendDot, backgroundColor: '#f59e0b' }}></span> Maintenance</div>
                  <div style={S.statusLegendItem}><span style={{ ...S.legendDot, backgroundColor: '#ef4444' }}></span> Out of Service</div>
                </div>
              </div>

              {/* Status breakdown list on right */}
              <div style={S.breakdownCard}>
                <span style={S.breakdownTitle}>STATUS BREAKDOWN</span>
                <div style={S.breakdownList}>
                  <div style={S.breakdownItem}>
                    <span style={S.breakdownLabelName}>In Transit</span>
                    <span style={S.breakdownPercentage}>45% of Fleet</span>
                  </div>
                  <div style={S.breakdownItem}>
                    <span style={S.breakdownLabelName}>Available</span>
                    <span style={S.breakdownPercentage}>30% of Fleet</span>
                  </div>
                  <div style={S.breakdownItem}>
                    <span style={S.breakdownLabelName}>Maintenance</span>
                    <span style={S.breakdownPercentage}>15% of Fleet</span>
                  </div>
                  <div style={S.breakdownItem}>
                    <span style={S.breakdownLabelName}>Out of Service</span>
                    <span style={S.breakdownPercentage}>10% of Fleet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ─── Standard Log Tables & Chart for other tabs ─── */
          <div>
            <div style={S.chartWrapper}>
              <span style={S.chartLabel}>{chartTitle}</span>
              <div style={S.chartBox}>
                <div style={S.graphOutline} />
              </div>
            </div>

            {/* Controls Row: Selection Pill (left) & Density / Columns Visibility (right) */}
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

                {/* Columns checklist dropdown */}
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
                    <div className="columns-dropdown-panel" style={S.columnsDropdown}>
                      <div style={S.dropdownHeader}>COLUMN VISIBILITY</div>
                      {currentConfig.labels.map((lbl) => {
                        const colKey = getColKey(lbl);
                        const isChecked = currentConfig.columns[colKey];
                        return (
                          <label key={lbl} style={S.dropdownOption}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleColumn(colKey)}
                              style={S.checkboxNative}
                            />
                            <span>{lbl}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div style={S.tableContainer}>
              <table style={S.table}>
                <thead style={S.thead}>
                  <tr>
                    <th style={{ ...S.th, width: 48, textAlign: 'center' }}>
                      <CustomCheckbox
                        checked={paginatedData.every(r => selectedRows.includes(r.id)) && paginatedData.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>

                    {/* Render headers dynamic on checklist */}
                    {activeTab === 'Revenue Trends' && (
                      <>
                        {revenueColumns.period && <th style={S.th}>PERIOD</th>}
                        {revenueColumns.grossRevenue && <th style={S.th}>GROSS REVENUE</th>}
                        {revenueColumns.expenses && <th style={S.th}>TOTAL EXPENSES</th>}
                        {revenueColumns.netProfit && <th style={S.th}>NET PROFIT</th>}
                      </>
                    )}

                    {activeTab === 'Driver Performance' && (
                      <>
                        {driverColumns.driver && <th style={S.th}>DRIVER OPERATOR</th>}
                        {driverColumns.trips && <th style={S.th}>TRIPS COMPLETED</th>}
                        {driverColumns.distance && <th style={S.th}>DISTANCE LOGGED</th>}
                        {driverColumns.safety && <th style={S.th}>SAFETY RATING</th>}
                      </>
                    )}

                    {activeTab === 'Customer Growth' && (
                      <>
                        {customerColumns.period && <th style={S.th}>TIMELINE PERIOD</th>}
                        {customerColumns.contracts && <th style={S.th}>NEW CONTRACTS SIGNED</th>}
                        {customerColumns.volume && <th style={S.th}>ACTIVE LOADS VOLUME</th>}
                      </>
                    )}

                    {activeTab === 'Warehouse Capacity' && (
                      <>
                        {capacityColumns.zone && <th style={S.th}>WAREHOUSE ZONE</th>}
                        {capacityColumns.utilization && <th style={S.th}>CAPACITY UTILIZATION</th>}
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row) => {
                    const isChecked = selectedRows.includes(row.id);
                    return (
                      <tr key={row.id} style={isChecked ? S.trSelected : S.tr}>
                        <td style={{ ...getPaddingStyle(), textAlign: 'center' }}>
                          <CustomCheckbox
                            checked={isChecked}
                            onChange={() => handleRowSelect(row.id)}
                          />
                        </td>

                        {/* Revenue Trends */}
                        {activeTab === 'Revenue Trends' && (
                          <>
                            {revenueColumns.period && (
                              <td style={{ ...getPaddingStyle(), ...S.tdRegular }}>{row.period}</td>
                            )}
                            {revenueColumns.grossRevenue && (
                              <td style={{ ...getPaddingStyle(), ...S.tdGoldBold }}>${row.grossRevenue.toLocaleString()}</td>
                            )}
                            {revenueColumns.expenses && (
                              <td style={{ ...getPaddingStyle(), ...S.tdRedBold }}>${row.expenses.toLocaleString()}</td>
                            )}
                            {revenueColumns.netProfit && (
                              <td style={{ ...getPaddingStyle(), ...S.tdGreenBold }}>
                                {row.netProfit < 0 ? `-$${Math.abs(row.netProfit).toLocaleString()}` : `$${row.netProfit.toLocaleString()}`}
                              </td>
                            )}
                          </>
                        )}

                        {/* Driver Performance */}
                        {activeTab === 'Driver Performance' && (
                          <>
                            {driverColumns.driver && (
                              <td style={{ ...getPaddingStyle(), ...S.tdRegular }}>{row.driver}</td>
                            )}
                            {driverColumns.trips && (
                              <td style={{ ...getPaddingStyle(), ...S.tdMonoBold }}>{row.trips}</td>
                            )}
                            {driverColumns.distance && (
                              <td style={{ ...getPaddingStyle(), ...S.tdSemibold }}>{row.distance}</td>
                            )}
                            {driverColumns.safety && (
                              <td style={{ ...getPaddingStyle(), ...S.tdGreenBold }}>{row.safety}</td>
                            )}
                          </>
                        )}

                        {/* Customer Growth */}
                        {activeTab === 'Customer Growth' && (
                          <>
                            {customerColumns.period && (
                              <td style={{ ...getPaddingStyle(), ...S.tdRegular }}>{row.period}</td>
                            )}
                            {customerColumns.contracts && (
                              <td style={{ ...getPaddingStyle(), ...S.tdMonoBold }}>{row.contracts}</td>
                            )}
                            {customerColumns.volume && (
                              <td style={{ ...getPaddingStyle(), ...S.tdSemibold }}>{row.volume}</td>
                            )}
                          </>
                        )}

                        {/* Warehouse Capacity */}
                        {activeTab === 'Warehouse Capacity' && (
                          <>
                            {capacityColumns.zone && (
                              <td style={{ ...getPaddingStyle(), ...S.tdRegular }}>{row.zone}</td>
                            )}
                            {capacityColumns.utilization && (
                              <td style={{ ...getPaddingStyle(), ...S.tdMonoBold }}>{row.utilization}</td>
                            )}
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination block */}
            <div style={S.paginationFooter}>
              <span style={S.paginationText}>
                Showing <strong style={{ color: '#0f172a' }}>{startIndex + 1}</strong> to <strong style={{ color: '#0f172a' }}>{endIndex}</strong> of <strong style={{ color: '#0f172a' }}>{totalItems}</strong> items
              </span>
              <div style={S.paginationButtons}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    ...S.pageArrow,
                    opacity: currentPage === 1 ? 0.4 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pNum = index + 1;
                  const isActive = currentPage === pNum;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      style={{
                        ...S.pageNumBtn,
                        backgroundColor: isActive ? '#ffd400' : 'transparent',
                        color: isActive ? '#0f172a' : '#475569',
                        fontWeight: isActive ? '800' : '600',
                        border: isActive ? '1.5px solid #0f172a' : '1px solid transparent'
                      }}
                    >
                      {pNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    ...S.pageArrow,
                    opacity: currentPage === totalPages ? 0.4 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Success Toast Alert */}
      {toast && (
        <div style={S.toastContainer}>
          <div style={S.toastIcon}>✓</div>
          <span style={S.toastText}>{toast}</span>
          <button onClick={() => setToast(null)} style={S.toastCloseBtn}>×</button>
        </div>
      )}

      {/* Pop up styles */}
      <style>{`
        .hover-card {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04) !important;
          border-color: #cbd5e1 !important;
        }
        .donut-svg {
          animation: spin-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: center;
        }
        .donut-segment {
          transform-origin: center;
        }
        .segment-blue {}
        .segment-red {}
        .segment-orange {}
        .segment-green {}
        @keyframes spin-in {
          from {
            transform: rotate(-270deg) scale(0.8);
            opacity: 0;
          }
          to {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const S = {
  container: {
    padding: '32px 40px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: "'Outfit', 'Inter', sans-serif"
  },
  header: {
    marginBottom: 28,
    textAlign: 'left'
  },
  pageTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 6px 0',
    letterSpacing: '-0.5px'
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    fontWeight: '500'
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20,
    marginBottom: 28
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: '20px 24px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  kpiLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.8px'
  },
  kpiBadge: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '3px 8px',
    borderRadius: '20px',
    fontSize: '10px',
    fontWeight: '700'
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12
  },
  kpiSub: {
    fontSize: 11.5,
    color: '#94a3b8',
    fontWeight: '600'
  },
  filtersCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    padding: '20px 24px',
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    textAlign: 'left'
  },
  filtersHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  funnelIcon: {
    fontSize: 16
  },
  filtersTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: '0.5px'
  },
  filtersStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20
  },
  selectWrapperFull: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  filterSelectFull: {
    padding: '12px 36px 12px 18px',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1e293b',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    width: '100%',
    transition: 'border-color 0.15s ease'
  },
  selectChevronFull: {
    position: 'absolute',
    right: 18,
    color: '#0f172a',
    pointerEvents: 'none'
  },
  filtersButtonsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap'
  },
  btnExportCsv: {
    backgroundColor: '#ffffff',
    color: '#334155',
    border: '2px solid #0f172a', // Styled to look clean and active
    borderRadius: 12,
    padding: '10px 22px',
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    outline: 'none'
  },
  btnExportPdf: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 12,
    padding: '11px 24px',
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    outline: 'none',
    boxShadow: '0 4px 12px rgba(250, 204, 21, 0.25)'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    padding: '28px 32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    textAlign: 'left'
  },
  tabsHeader: {
    display: 'flex',
    borderBottom: '1.5px solid #e2e8f0',
    gap: 28,
    marginBottom: 24,
    overflowX: 'auto'
  },
  tabButton: {
    background: 'none',
    border: 'none',
    padding: '14px 12px',
    fontSize: 14,
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    fontWeight: '800'
  },
  chartWrapper: {
    marginBottom: 24
  },
  chartLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    display: 'block',
    marginBottom: 16
  },
  chartBox: {
    backgroundColor: '#f8fafc',
    border: '1px dashed #cbd5e1',
    borderRadius: 12,
    height: 180,
    position: 'relative'
  },
  graphOutline: {
    position: 'absolute',
    inset: 20,
    borderBottom: '1px solid #e2e8f0'
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 38,
    flexWrap: 'wrap',
    gap: 16
  },
  controlsLeft: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12
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
    gap: 16,
    flexWrap: 'wrap'
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
  checkboxNative: {
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
    WebkitOverflowScrolling: 'touch'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
    whiteSpace: 'nowrap'
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
    backgroundColor: '#fefce8' // Warm yellow active state backdrop
  },
  tdMonoBold: {
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#0f172a'
  },
  tdSemibold: {
    fontWeight: '700',
    color: '#334155'
  },
  tdRegular: {
    fontWeight: '700',
    color: '#334155'
  },
  tdMuted: {
    fontWeight: '600',
    color: '#64748b'
  },
  tdGoldBold: {
    fontWeight: '800',
    color: '#b45309'
  },
  tdRedBold: {
    fontWeight: '800',
    color: '#ef4444'
  },
  tdGreenBold: {
    fontWeight: '800',
    color: '#10b981'
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700'
  },
  // Pagination
  paginationFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 24px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    flexWrap: 'wrap',
    gap: 12
  },
  paginationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b'
  },
  paginationButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  pageArrow: {
    background: 'none',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#475569'
  },
  pageNumBtn: {
    border: 'none',
    borderRadius: 8,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 12.5
  },
  // Vehicle Utilization Custom layout styles
  utilizationContainer: {
    display: 'flex',
    gap: 32,
    alignItems: 'stretch',
    flexWrap: 'wrap',
    marginTop: 16
  },
  donutChartCard: {
    flex: 1,
    minWidth: 300,
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  donutWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20
  },
  statusLegendsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
    fontSize: 12,
    fontWeight: '700',
    color: '#475569'
  },
  statusLegendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block'
  },
  breakdownCard: {
    flex: 1,
    minWidth: 300,
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  },
  breakdownTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.8px',
    marginBottom: 24
  },
  breakdownList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottom: '1px solid #f1f5f9'
  },
  breakdownLabelName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1e293b'
  },
  breakdownPercentage: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b45309',
    fontFamily: 'monospace'
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

export default AccountsReports;
