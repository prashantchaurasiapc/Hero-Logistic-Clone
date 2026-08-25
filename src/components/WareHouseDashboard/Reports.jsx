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

  // Dynamic values depending on filters - defaulted to 0 until API connected
  const getMetrics = () => {
    return {
      revenue: '0.00',
      margin: '0.00',
      trips: 0,
      customers: 0
    };
  };

  const metrics = getMetrics();

  // Chart data — empty until real data fetched from API
  const getChartData = () => {
    return [];
  };

  const chartData = getChartData();

  // Table data — empty until real data fetched from API
  const getTableData = () => {
    return [];
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
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'car_carrying' ? 'bg-brand-500 text-slate-955 font-extrabold shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Car Carrying Yard
            </button>
            <button
              onClick={() => setLogisticsMode('general_freight')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'general_freight' ? 'bg-brand-500 text-slate-955 font-extrabold shadow-xs' : 'text-slate-500'}`}
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
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black bg-gradient-to-r from-brand-500 to-[#FF9A00] text-slate-950 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md select-none hover:shadow-lg focus:outline-none"
          >
            <span>Export Stock List</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
          <strong className="text-2xl font-black text-slate-900 block mt-1">${metrics.revenue}</strong>
          <div className="flex justify-between items-center mt-2.5">
            <span className="text-[10px] text-slate-400 font-medium">Across selected period</span>
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
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Time Period</label>
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
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Branch / Territory</label>
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
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-brand-500 hover:bg-[#FF9A00] text-slate-955 text-xs font-black rounded-xl transition-all cursor-pointer focus:outline-none"
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
                  ? 'border-brand-500 text-[#f59e0b]' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
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
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="var(--primary-color)" fillOpacity={0.1} />
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
                <Bar dataKey={activeTab === 'driver-performance' ? 'trips' : activeTab === 'vehicle-utilization' ? 'rate' : 'occupancy'} fill="var(--primary-color)" radius={[6, 6, 0, 0]} />
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
              <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-[9px] font-bold shrink-0">
                {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
                  const isActive = density === mode.toLowerCase();
                  return (
                    <button
                      key={mode}
                      onClick={() => setDensity(mode.toLowerCase())}
                      className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-brand-500 text-slate-950 font-extrabold shadow-xs' : 'text-slate-500'}`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>

              {/* Columns Popover Toggle */}
              <button
                onClick={() => setColsMenuOpen(!colsMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 font-bold text-[9px] uppercase rounded-xl cursor-pointer focus:outline-none shrink-0 whitespace-nowrap"
              >
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                <span>Columns</span>
              </button>

              {/* Columns Visibility popup box - MATCHES IMAGE 16 */}
              {colsMenuOpen && (
                <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 text-slate-800 animate-fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-555">Column Visibility</span>
                    <button onClick={() => setColsMenuOpen(false)} className="text-slate-400">
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
