import React, { useState } from 'react';
import { Download, FileText, BarChart3, Users, Truck, UserPlus, Layers, Settings, X, Calendar, MapPin } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line } from 'recharts';

export default function Reports({
  logisticsMode,
  setLogisticsMode,
  onBarcodeSimulatorClick,
  onManualEntryClick,
  onExportStockClick,
  triggerToast
}) {
  const [activeTab, setActiveTab] = useState('warehouse-capacity');
  const [timePeriod, setTimePeriod] = useState('This Month');
  const [branch, setBranch] = useState('All Branches');
  
  const [density, setDensity] = useState('compact');
  const [colsMenuOpen, setColsMenuOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // Column visibility state
  const [visibleCols, setVisibleCols] = useState({
    period: true,
    grossRevenue: true,
    totalExpenses: true,
    netProfit: true
  });

  // Dynamic values depending on filters
  const getMetrics = () => {
    let multiplier = 1;
    if (timePeriod === 'Last Quarter') multiplier = 3.2;
    if (timePeriod === 'Year to Date') multiplier = 11.5;

    return {
      revenue: (12790 * multiplier).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      margin: (-3430 * multiplier).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      trips: Math.round(1 * multiplier),
      customers: Math.round(7 * (multiplier > 1 ? multiplier * 0.7 : 1))
    };
  };

  const metrics = getMetrics();

  // Chart Data Generators
  const getChartData = () => {
    switch (activeTab) {
      case 'revenue-trends':
        return [
          { name: 'Week 1', revenue: 4000, expenses: 3200, profit: 800 },
          { name: 'Week 2', revenue: 4500, expenses: 3800, profit: 700 },
          { name: 'Week 3', revenue: 5100, expenses: 4100, profit: 1000 },
          { name: 'Week 4', revenue: 6200, expenses: 4800, profit: 1400 }
        ];
      case 'driver-performance':
        return [
          { name: 'Adam K.', trips: 14, efficiency: 94 },
          { name: 'Sarah R.', trips: 18, efficiency: 98 },
          { name: 'John D.', trips: 12, efficiency: 91 },
          { name: 'Dave M.', trips: 16, efficiency: 89 }
        ];
      case 'vehicle-utilization':
        return [
          { name: 'Car Carriers', rate: 85 },
          { name: 'Flatbeds', rate: 72 },
          { name: 'Vans', rate: 90 },
          { name: 'Tankers', rate: 64 }
        ];
      case 'customer-growth':
        return [
          { name: 'Jan', active: 4 },
          { name: 'Feb', active: 5 },
          { name: 'Mar', active: 6 },
          { name: 'Apr', active: 7 }
        ];
      case 'warehouse-capacity':
      default:
        return [
          { name: 'Bay A (Dry)', occupancy: 78 },
          { name: 'Bay B (Cold)', occupancy: 92 },
          { name: 'Bay C (Hazard)', occupancy: 45 },
          { name: 'Bay D (Overflow)', occupancy: 60 }
        ];
    }
  };

  const chartData = getChartData();

  // Table Data Generators
  const getTableData = () => {
    switch (activeTab) {
      case 'revenue-trends':
        return [
          { id: 'R-1', col1: 'Week 1', col2: '$4,000.00', col3: '$3,200.00', col4: '$800.00' },
          { id: 'R-2', col1: 'Week 2', col2: '$4,500.00', col3: '$3,800.00', col4: '$700.00' },
          { id: 'R-3', col1: 'Week 3', col2: '$5,100.00', col3: '$4,100.00', col4: '$1,000.00' },
          { id: 'R-4', col1: 'Week 4', col2: '$6,200.00', col3: '$4,800.00', col4: '$1,400.00' }
        ];
      case 'warehouse-capacity':
      default:
        return [
          { id: 'W-1', col1: 'Bay A (Dry)', col2: '78% Occupied', col3: '39 / 50 Pallets', col4: 'AVAILABLE' },
          { id: 'W-2', col1: 'Bay B (Cold)', col2: '92% Occupied', col3: '46 / 50 Pallets', col4: 'AVAILABLE' },
          { id: 'W-3', col1: 'Bay C (Hazard)', col2: '45% Occupied', col3: '9 / 20 Pallets', col4: 'AVAILABLE' },
          { id: 'W-4', col1: 'Bay D (Overflow)', col2: '60% Occupied', col3: '12 / 20 Pallets', col4: 'AVAILABLE' }
        ];
    }
  };

  const tableData = getTableData();

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleAllSelect = () => {
    if (selectedRows.length === tableData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableData.map(t => t.id));
    }
  };

  const handleExport = (format) => {
    if (triggerToast) {
      triggerToast(`Exporting analytics data as ${format.toUpperCase()} sheet...`);
    }
  };

  const getPaddingClass = (mode) => {
    if (mode === 'compact') return 'py-2 px-6';
    if (mode === 'relaxed') return 'py-5 px-6';
    return 'py-3.5 px-6'; // default
  };

  return (
    <div className="space-y-6">
      {/* Header with Switcher & Operations */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 capitalize">Reports & Analytics Center</h2>
          <p className="text-xs text-slate-500 font-medium">Generate, export, and visualize system-wide logistics performance metrics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Logistics Niche Toggle */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => setLogisticsMode('car_carrying')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'car_carrying' ? 'bg-[#FFD400] text-slate-955 font-extrabold shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Car Carrying Yard
            </button>
            <button
              onClick={() => setLogisticsMode('general_freight')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'general_freight' ? 'bg-[#FFD400] text-slate-955 font-extrabold shadow-xs' : 'text-slate-550'}`}
            >
              General Freight
            </button>
          </div>

          <button
            onClick={onBarcodeSimulatorClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xs select-none focus:outline-none"
          >
            <span>Barcode Simulator</span>
          </button>
          
          <button
            onClick={onManualEntryClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xs select-none focus:outline-none"
          >
            <span>Manual Entry</span>
          </button>
          
          <button
            onClick={onExportStockClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black bg-gradient-to-r from-[#FFD400] to-[#FF9A00] text-slate-950 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md select-none hover:shadow-lg focus:outline-none"
          >
            <span>Export Stock List</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
          <strong className="text-2xl font-black text-slate-900 block mt-1">${metrics.revenue}</strong>
          <div className="flex justify-between items-center mt-2.5">
            <span className="text-[10px] text-slate-450 font-medium">Across selected period</span>
            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md">+18.4%</span>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Net Profit Margin</span>
          <strong className="text-2xl font-black text-slate-900 block mt-1">${metrics.margin}</strong>
          <div className="flex justify-between items-center mt-2.5">
            <span className="text-[10px] text-slate-455 font-medium">After expenses</span>
            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md">+10.6% YoY</span>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Trips Completed</span>
          <strong className="text-2xl font-black text-slate-900 block mt-1">{metrics.trips}</strong>
          <div className="flex justify-between items-center mt-2.5">
            <span className="text-[10px] text-slate-455 font-medium">Loads delivered</span>
            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md">Live</span>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Customers</span>
          <strong className="text-2xl font-black text-slate-900 block mt-1">{metrics.customers}</strong>
          <div className="flex justify-between items-center mt-2.5">
            <span className="text-[10px] text-slate-455 font-medium">Billed shippers</span>
            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md">Stable</span>
          </div>
        </div>
      </div>

      {/* Filters Card Panel */}
      <div className="glass rounded-2xl p-5 border border-slate-200 bg-white text-left space-y-4 shadow-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Calendar className="h-4 w-4 text-[#f59e0b]" />
          <strong className="text-xs font-black text-slate-900 uppercase tracking-wider">Filters</strong>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-wide">Time Period</label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl focus:border-[#f59e0b] focus:outline-none transition-all cursor-pointer font-semibold"
            >
              <option value="This Month">This Month</option>
              <option value="Last Quarter">Last Quarter</option>
              <option value="Year to Date">Year to Date</option>
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-wide">Branch / Territory</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl focus:border-[#f59e0b] focus:outline-none transition-all cursor-pointer font-semibold"
            >
              <option value="All Branches">All Branches</option>
              <option value="Sydney Hub">Sydney Hub</option>
              <option value="Melbourne Yard">Melbourne Yard</option>
              <option value="Brisbane Depot">Brisbane Depot</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-[#FFD400] hover:bg-[#FF9A00] text-slate-955 text-xs font-black rounded-xl transition-all cursor-pointer focus:outline-none"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu Row */}
      <div className="flex flex-wrap border-b border-slate-200">
        {[
          { id: 'revenue-trends', label: 'Revenue Trends', icon: BarChart3 },
          { id: 'driver-performance', label: 'Driver Performance', icon: Users },
          { id: 'vehicle-utilization', label: 'Vehicle Utilization', icon: Truck },
          { id: 'customer-growth', label: 'Customer Growth', icon: UserPlus },
          { id: 'warehouse-capacity', label: 'Warehouse Capacity', icon: Layers }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3.5 px-5 font-black text-xs border-b-2 transition-all cursor-pointer ${
                isActive 
                  ? 'border-[#FFD400] text-[#f59e0b]' 
                  : 'border-transparent text-slate-450 hover:text-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="glass rounded-2xl p-5 border border-slate-200 bg-white text-left space-y-6 shadow-xs">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider capitalize">
            {activeTab.replace('-', ' ')} Statistics
          </h3>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-72 w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'revenue-trends' ? (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="#FFD400" fillOpacity={0.1} />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fill="#10b981" fillOpacity={0.05} />
              </AreaChart>
            ) : activeTab === 'customer-growth' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="active" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Bar dataKey={activeTab === 'driver-performance' ? 'trips' : activeTab === 'vehicle-utilization' ? 'rate' : 'occupancy'} fill="#FFD400" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Dynamic sub-table and column setting triggers */}
        <div className="space-y-4">
          <div className="flex justify-between items-center relative">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Detailed Data Table</h4>
            
            <div className="flex items-center gap-3">
              {/* Density Toggle */}
              <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-[9px] font-bold">
                {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
                  const isActive = density === mode.toLowerCase();
                  return (
                    <button
                      key={mode}
                      onClick={() => setDensity(mode.toLowerCase())}
                      className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-[#FFD400] text-slate-950 font-extrabold shadow-xs' : 'text-slate-550'}`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>

              {/* Columns Popover Toggle */}
              <button
                onClick={() => setColsMenuOpen(!colsMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 font-bold text-[9px] uppercase rounded-xl cursor-pointer focus:outline-none"
              >
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                <span>Columns</span>
              </button>

              {/* Columns Visibility popup box - MATCHES IMAGE 16 */}
              {colsMenuOpen && (
                <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 text-slate-800 animate-fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-555">Column Visibility</span>
                    <button onClick={() => setColsMenuOpen(false)} className="text-slate-450">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                      <input
                        type="checkbox"
                        checked={visibleCols.period}
                        onChange={() => setVisibleCols({ ...visibleCols, period: !visibleCols.period })}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                      <span>Period / Zone</span>
                    </label>
                    <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                      <input
                        type="checkbox"
                        checked={visibleCols.grossRevenue}
                        onChange={() => setVisibleCols({ ...visibleCols, grossRevenue: !visibleCols.grossRevenue })}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                      <span>Metric Value</span>
                    </label>
                    <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                      <input
                        type="checkbox"
                        checked={visibleCols.totalExpenses}
                        onChange={() => setVisibleCols({ ...visibleCols, totalExpenses: !visibleCols.totalExpenses })}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                      <span>Secondary Value</span>
                    </label>
                    <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                      <input
                        type="checkbox"
                        checked={visibleCols.netProfit}
                        onChange={() => setVisibleCols({ ...visibleCols, netProfit: !visibleCols.netProfit })}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                      <span>Status</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grid Table */}
          <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === tableData.length && tableData.length > 0}
                      onChange={handleAllSelect}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                  </th>
                  {visibleCols.period && <th className="px-6 py-4 font-extrabold">Period / Zone</th>}
                  {visibleCols.grossRevenue && <th className="px-6 py-4 font-extrabold">Metric Value</th>}
                  {visibleCols.totalExpenses && <th className="px-6 py-4 font-extrabold">Secondary Value</th>}
                  {visibleCols.netProfit && <th className="px-6 py-4 font-extrabold">Status</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {tableData.map((row) => {
                  const isChecked = selectedRows.includes(row.id);
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 text-center whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleRowSelect(row.id)}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                      </td>
                      {visibleCols.period && (
                        <td className={`font-mono text-slate-900 font-extrabold whitespace-nowrap ${getPaddingClass(density)}`}>
                          {row.col1}
                        </td>
                      )}
                      {visibleCols.grossRevenue && (
                        <td className={`font-semibold text-slate-800 whitespace-nowrap ${getPaddingClass(density)}`}>
                          {row.col2}
                        </td>
                      )}
                      {visibleCols.totalExpenses && (
                        <td className={`text-slate-505 whitespace-nowrap ${getPaddingClass(density)}`}>
                          {row.col3}
                        </td>
                      )}
                      {visibleCols.netProfit && (
                        <td className={`whitespace-nowrap ${getPaddingClass(density)}`}>
                          <span className="inline-flex px-2 py-0.5 text-[9px] font-black text-slate-655 bg-slate-50 border border-slate-200 rounded-md uppercase">
                            {row.col4}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
