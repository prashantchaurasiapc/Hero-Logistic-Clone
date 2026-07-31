import React, { useState, useMemo } from 'react';
import { 
  Search, Calendar, Filter, Download, Eye, MoreVertical, 
  DollarSign, Droplets, Wrench, CircleDashed, Shield, FileText, 
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, 
  Zap, Clock, AlertCircle, Info, Flame
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, 
  BarChart, Bar
} from 'recharts';

export default function VehicleCosts() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All Vehicle Types');
  const [vehicleFilter, setVehicleFilter] = useState('All Vehicles');
  const [activeTab, setActiveTab] = useState('Vehicle Summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- RAW MOCK DATA ---
  const rawVehicleData = [
    { id: 1, name: 'MAN TGX 26.580', desc: 'Prime Mover', type: 'Truck', rego: 'XYZ-123', fuel: 5800, maintenance: 3900, tyres: 1200, insurance: 1600, other: 3175, costPerKm: '$0.92', costPerDay: '$45.83', vsApr: 8.6, img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 2, name: 'Volvo FH16 750', desc: 'Prime Mover', type: 'Truck', rego: 'ABC-456', fuel: 5200, maintenance: 3500, tyres: 1100, insurance: 1450, other: 2896, costPerKm: '$0.88', costPerDay: '$40.42', vsApr: 5.2, img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 3, name: 'Scania R660', desc: 'Prime Mover', type: 'Truck', rego: 'DEF-789', fuel: 4800, maintenance: 3200, tyres: 1000, insurance: 1350, other: 2762, costPerKm: '$0.95', costPerDay: '$43.17', vsApr: -12.1, img: 'https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 4, name: 'MaxiTRANS ST3', desc: 'Car Carrier Trailer', type: 'Trailer', rego: 'TR-001', fuel: 0, maintenance: 2100, tyres: 1400, insurance: 1100, other: 1648, costPerKm: '$0.41', costPerDay: '$20.15', vsApr: 2.7, img: 'https://images.unsplash.com/photo-1583344165581-9b19e917d3b5?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 5, name: 'MaxiTRANS ST3', desc: 'Car Carrier Trailer', type: 'Trailer', rego: 'TR-002', fuel: 0, maintenance: 1850, tyres: 1250, insurance: 950, other: 1362, costPerKm: '$0.38', costPerDay: '$18.97', vsApr: -7.8, img: 'https://images.unsplash.com/photo-1583344165581-9b19e917d3b5?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 6, name: 'Mercedes Actros 2653', desc: 'Prime Mover', type: 'Truck', rego: 'GHI-012', fuel: 4200, maintenance: 2800, tyres: 900, insurance: 1200, other: 2285, costPerKm: '$0.90', costPerDay: '$42.03', vsApr: 13.4, img: 'https://images.unsplash.com/photo-1616428784116-2495d4d38096?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 7, name: 'Kenworth T909', desc: 'Prime Mover', type: 'Truck', rego: 'JKL-345', fuel: 3900, maintenance: 2550, tyres: 850, insurance: 1050, other: 2166, costPerKm: '$0.85', costPerDay: '$38.91', vsApr: -15.6, img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 8, name: 'MTE Deck Widener', desc: 'Car Carrier Trailer', type: 'Trailer', rego: 'TR-003', fuel: 0, maintenance: 1950, tyres: 1300, insurance: 1000, other: 2438, costPerKm: '$0.43', costPerDay: '$19.23', vsApr: 1.9, img: 'https://images.unsplash.com/photo-1583344165581-9b19e917d3b5?auto=format&fit=crop&w=100&h=100&q=80' },
  ];

  const trendData = [
    { name: 'Jun 2025', cost: 45000 },
    { name: 'Jul 2025', cost: 48000 },
    { name: 'Aug 2025', cost: 47000 },
    { name: 'Sep 2025', cost: 52000 },
    { name: 'Oct 2025', cost: 58000 },
    { name: 'Nov 2025', cost: 65000 },
    { name: 'Dec 2025', cost: 72000 },
    { name: 'Jan 2026', cost: 68000 },
    { name: 'Feb 2026', cost: 69000 },
    { name: 'Mar 2026', cost: 74000 },
    { name: 'Apr 2026', cost: 82000 },
    { name: 'May 2026', cost: 87540 },
  ];

  const upcomingCosts = [
    { title: 'Service - MAN TGX 26.580 (XYZ-123)', date: 'Due 04 Jun 2026', amount: '$1,250.00', status: 'Due Soon', color: 'orange', icon: <Wrench size={14}/> },
    { title: 'Tyre Replacement - Scania R660 (DEF-789)', date: 'Due 08 Jun 2026', amount: '$2,860.00', status: 'Due Soon', color: 'orange', icon: <CircleDashed size={14}/> },
    { title: 'Insurance - Volvo FH16 750 (ABC-456)', date: 'Due 15 Jun 2026', amount: '$4,455.00', status: 'Due Soon', color: 'orange', icon: <Shield size={14}/> },
    { title: 'Registration - Mercedes Actros (GHI-012)', date: 'Due 20 Jun 2026', amount: '$850.00', status: 'Scheduled', color: 'emerald', icon: <FileText size={14}/> },
  ];

  // --- DERIVED STATE ---
  const filteredVehicles = useMemo(() => {
    return rawVehicleData.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            v.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            v.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = vehicleTypeFilter === 'All Vehicle Types' || v.type === vehicleTypeFilter;
      const matchesVehicle = vehicleFilter === 'All Vehicles' || v.name === vehicleFilter;
      
      return matchesSearch && matchesType && matchesVehicle;
    });
  }, [searchQuery, vehicleTypeFilter, vehicleFilter]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVehicles, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;

  // Calculate dynamic totals
  const totals = useMemo(() => {
    return filteredVehicles.reduce((acc, v) => ({
      fuel: acc.fuel + v.fuel,
      maintenance: acc.maintenance + v.maintenance,
      tyres: acc.tyres + v.tyres,
      insurance: acc.insurance + v.insurance,
      other: acc.other + v.other,
      exGst: acc.exGst + v.fuel + v.maintenance + v.tyres + v.insurance + v.other,
    }), { fuel: 0, maintenance: 0, tyres: 0, insurance: 0, other: 0, exGst: 0 });
  }, [filteredVehicles]);

  const totalIncGst = totals.exGst * 1.1; // adding 10% GST

  const kpiData = [
    { title: 'Total Vehicle Costs (This Period)', value: `$${totalIncGst.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: 12.8, trendLabel: 'vs Apr 2026', icon: <DollarSign size={20} className="text-blue-500" />, iconBg: 'bg-blue-50', trendColor: 'text-emerald-500' },
    { title: 'Fuel Costs', value: `$${(totals.fuel * 1.1).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: 9.4, trendLabel: 'vs Apr 2026', icon: <Droplets size={20} className="text-emerald-500" />, iconBg: 'bg-emerald-50', trendColor: 'text-emerald-500' },
    { title: 'Maintenance & Repairs', value: `$${(totals.maintenance * 1.1).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: 16.1, trendLabel: 'vs Apr 2026', icon: <Wrench size={20} className="text-amber-500" />, iconBg: 'bg-amber-50', trendColor: 'text-emerald-500' },
    { title: 'Tyres', value: `$${(totals.tyres * 1.1).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: -3.2, trendLabel: 'vs Apr 2026', icon: <CircleDashed size={20} className="text-blue-500" />, iconBg: 'bg-blue-50', trendColor: 'text-rose-500' },
    { title: 'Insurance', value: `$${(totals.insurance * 1.1).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: 2.6, trendLabel: 'vs Apr 2026', icon: <Shield size={20} className="text-purple-500" />, iconBg: 'bg-purple-50', trendColor: 'text-emerald-500' },
    { title: 'Other Costs', value: `$${(totals.other * 1.1).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: 22.1, trendLabel: 'vs Apr 2026', icon: <FileText size={20} className="text-slate-500" />, iconBg: 'bg-slate-100', trendColor: 'text-emerald-500' },
  ];

  const pieData = [
    { name: 'Fuel', value: totals.fuel * 1.1, color: '#3b82f6' }, // blue-500
    { name: 'Maintenance & Repairs', value: totals.maintenance * 1.1, color: '#f59e0b' }, // amber-500
    { name: 'Tyres', value: totals.tyres * 1.1, color: '#10b981' }, // emerald-500
    { name: 'Insurance', value: totals.insurance * 1.1, color: '#a855f7' }, // purple-500
    { name: 'Other Costs', value: totals.other * 1.1, color: '#94a3b8' }, // slate-400
  ].filter(item => item.value > 0);

  const formatPercent = (val, total) => total === 0 ? '0%' : `${((val / total) * 100).toFixed(1)}%`;

  const barData = [
    { name: 'Fuel', value: totals.fuel * 1.1, percent: formatPercent(totals.fuel * 1.1, totalIncGst), color: '#3b82f6' },
    { name: 'Maintenance & Repairs', value: totals.maintenance * 1.1, percent: formatPercent(totals.maintenance * 1.1, totalIncGst), color: '#f59e0b' },
    { name: 'Tyres', value: totals.tyres * 1.1, percent: formatPercent(totals.tyres * 1.1, totalIncGst), color: '#10b981' },
    { name: 'Insurance', value: totals.insurance * 1.1, percent: formatPercent(totals.insurance * 1.1, totalIncGst), color: '#a855f7' },
    { name: 'Other Costs', value: totals.other * 1.1, percent: formatPercent(totals.other * 1.1, totalIncGst), color: '#94a3b8' },
  ];

  const uniqueVehicleNames = [...new Set(rawVehicleData.map(v => v.name))];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-800 font-sans overflow-y-auto w-full">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vehicle Costs</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Track and manage all operating costs for your trucks, trailers and other vehicles.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kpi.iconBg}`}>
                {kpi.icon}
              </div>
              <button className="text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-1">
                View details <ChevronRight size={10} />
              </button>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{kpi.title}</p>
              <div className="text-2xl font-black text-slate-900 mb-2">{kpi.value}</div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                <span className={`flex items-center gap-0.5 ${kpi.trendColor}`}>
                  {kpi.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(kpi.trend)}%
                </span>
                <span className="text-slate-400">{kpi.trendLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="px-8 flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by vehicle, rego, type..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        
        <select 
          value={vehicleTypeFilter}
          onChange={(e) => { setVehicleTypeFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none"
        >
          <option value="All Vehicle Types">All Vehicle Types</option>
          <option value="Truck">Truck</option>
          <option value="Trailer">Trailer</option>
        </select>
        
        <select 
          value={vehicleFilter}
          onChange={(e) => { setVehicleFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none"
        >
          <option value="All Vehicles">All Vehicles</option>
          {uniqueVehicleNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium cursor-pointer hover:bg-slate-50">
          <span>1 May 2026 – 31 May 2026</span>
          <Calendar size={14} className="text-slate-400 ml-2" />
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors">
          <Filter size={16} className="text-slate-500" /> Filters
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors">
          <Download size={16} className="text-slate-500" /> Export
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* LEFT COLUMN (Spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex px-6 pt-2 border-b border-slate-200 gap-8">
              {['Vehicle Summary', 'Transactions', 'Upcoming Costs', 'Service History'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 border-b-2 text-sm font-bold transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 overflow-x-auto min-h-[300px]">
              {activeTab === 'Vehicle Summary' ? (
                <>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-white">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-white">Vehicle</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-white">Type</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-white">Rego / ID</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right sticky top-0 bg-white">Total Cost (Ex GST)</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right sticky top-0 bg-white">Total Cost (Inc GST)</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right sticky top-0 bg-white">Cost / km</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right sticky top-0 bg-white">Cost / day</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right sticky top-0 bg-white">vs Apr 2026</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center sticky top-0 bg-white">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedVehicles.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="px-6 py-12 text-center text-slate-500 text-sm font-medium">No vehicles found matching your criteria.</td>
                        </tr>
                      ) : (
                        paginatedVehicles.map(v => {
                          const totalEx = v.fuel + v.maintenance + v.tyres + v.insurance + v.other;
                          const totalInc = totalEx * 1.1;
                          return (
                            <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-3">
                                  <img src={v.img} alt={v.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                  <div>
                                    <div className="text-xs font-bold text-slate-900">{v.name}</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">{v.desc}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${v.type === 'Truck' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                  {v.type}
                                </span>
                              </td>
                              <td className="px-6 py-3">
                                <div className="text-xs font-semibold text-slate-700">{v.rego}</div>
                              </td>
                              <td className="px-6 py-3 text-right text-xs font-semibold text-slate-900">${totalEx.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                              <td className="px-6 py-3 text-right text-xs font-semibold text-slate-900">${totalInc.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                              <td className="px-6 py-3 text-right text-xs font-semibold text-slate-700">{v.costPerKm}</td>
                              <td className="px-6 py-3 text-right text-xs font-semibold text-slate-700">{v.costPerDay}</td>
                              <td className="px-6 py-3 text-right">
                                <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${v.vsApr > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {v.vsApr > 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                                  {Math.abs(v.vsApr)}%
                                </span>
                              </td>
                              <td className="px-6 py-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button className="text-slate-400 hover:text-slate-600 transition-colors"><Eye size={16} /></button>
                                  <button className="text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={16} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-500 space-y-4">
                  <Info size={32} className="text-slate-300" />
                  <p className="text-sm font-medium">Detailed data for <span className="text-slate-700 font-bold">{activeTab}</span> is not populated in this demo view.</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {activeTab === 'Vehicle Summary' && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50 mt-auto">
                <span className="text-xs text-slate-500 font-medium">
                  Showing {filteredVehicles.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length} vehicles
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <ChevronLeft size={16}/>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-semibold text-sm">{currentPage}</button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white ${currentPage === totalPages || totalPages === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <ChevronRight size={16}/>
                  </button>
                </div>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                </select>
              </div>
            )}
          </div>

          {/* Bottom Row (Under Table) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cost Trend Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-900">Cost Trend</h3>
                <button className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1">View full report <ChevronRight size={12}/></button>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => `$${val/1000}k`} />
                    <RechartsTooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upcoming Costs */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-900">Upcoming Costs</h3>
                <button className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1">View all <ChevronRight size={12}/></button>
              </div>
              <div className="space-y-4 flex-1">
                {upcomingCosts.map((cost, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${cost.color === 'orange' ? 'amber' : 'emerald'}-50 text-${cost.color === 'orange' ? 'amber' : 'emerald'}-600`}>
                        {cost.icon}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-900 mb-0.5">{cost.title}</div>
                        <div className="text-[10px] text-slate-500">{cost.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-slate-900 mb-1">{cost.amount}</div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border ${cost.status === 'Due Soon' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {cost.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          
          {/* Top Right Card: Cost Breakdown & Top Vehicles */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-6">Cost Breakdown (This Period)</h3>
            
            {/* Donut Chart */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-32 h-32 flex-shrink-0">
                {totalIncGst > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => `$${value.toLocaleString(undefined, {maximumFractionDigits:0})}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                   <div className="w-full h-full rounded-full border-4 border-slate-100 flex items-center justify-center">
                     <span className="text-slate-300 font-medium text-xs">No Data</span>
                   </div>
                )}
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[13px] font-black text-slate-900">${totalIncGst > 1000000 ? (totalIncGst/1000000).toFixed(1)+'M' : totalIncGst > 1000 ? (totalIncGst/1000).toFixed(1)+'k' : totalIncGst.toFixed(0)}</span>
                  <span className="text-[9px] font-semibold text-slate-500">Total</span>
                </div>
              </div>
              
              {/* Custom Legend */}
              <div className="flex flex-col gap-2.5 flex-1">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor: item.color}}></span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-700">{item.name}</span>
                      <span className="text-[9px] text-slate-500">${item.value.toLocaleString(undefined, {maximumFractionDigits:0})} ({totalIncGst > 0 ? ((item.value / totalIncGst) * 100).toFixed(1) : 0}%)</span>
                    </div>
                  </div>
                ))}
                {pieData.length === 0 && <span className="text-xs text-slate-500">No costs found.</span>}
              </div>
            </div>

            {/* Top Cost Vehicles List */}
            <div className="border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-900">Top Cost Vehicles (This Period)</h3>
                <button className="text-[10px] text-blue-600 font-semibold hover:underline">View all</button>
              </div>
              
              <div className="space-y-3">
                {filteredVehicles.length === 0 ? (
                  <div className="text-xs text-slate-500">No vehicles match filters.</div>
                ) : (
                  [...filteredVehicles]
                    .sort((a,b) => (b.fuel+b.maintenance+b.tyres+b.insurance+b.other) - (a.fuel+a.maintenance+a.tyres+a.insurance+a.other))
                    .slice(0, 5)
                    .map(v => {
                      const vTot = (v.fuel + v.maintenance + v.tyres + v.insurance + v.other) * 1.1;
                      return (
                        <div key={v.id} className="flex justify-between items-center">
                          <div className="text-[11px] font-medium text-slate-700 truncate mr-2" title={`${v.name} (${v.rego})`}>{v.name} ({v.rego})</div>
                          <div className="text-[11px] font-bold text-slate-900">${vTot.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</div>
                        </div>
                      )
                    })
                )}
              </div>
            </div>
            
            {/* Key Insights Alert Box */}
            <div className="mt-6 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <h3 className="text-xs font-bold text-slate-900 mb-3">Key Insights</h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-[11px] text-slate-700">
                  <Flame size={14} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold text-slate-900">Fuel costs</span> are 9.4% higher than last month.</span>
                </li>
                <li className="flex items-start gap-2 text-[11px] text-slate-700">
                  <Wrench size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold text-slate-900">{filteredVehicles.length > 5 ? '5' : filteredVehicles.length} vehicles</span> have upcoming services.</span>
                </li>
                <li className="flex items-start gap-2 text-[11px] text-slate-700">
                  <Shield size={14} className="text-purple-500 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold text-slate-900">Insurance</span> for 3 vehicles is due this month.</span>
                </li>
              </ul>
              <button className="mt-3 text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-1">View all insights <ChevronRight size={10}/></button>
            </div>
          </div>

          {/* Bottom Right Card: Cost by Category (Bar Chart) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900">Cost by Category (This Period)</h3>
              <button className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1">View report <ChevronRight size={12}/></button>
            </div>
            
            <div className="flex-1 space-y-4">
              {barData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-28 flex-shrink-0 text-[10px] font-bold text-slate-700 truncate">{item.name}</div>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: item.percent, backgroundColor: item.color }}></div>
                  </div>
                  <div className="w-20 flex-shrink-0 text-right text-[10px]">
                    <span className="font-bold text-slate-900">${item.value.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                    <span className="text-slate-400 ml-1">({item.percent})</span>
                  </div>
                </div>
              ))}
              
              {/* Custom X Axis labels for the horizontal bar */}
              <div className="flex justify-between pl-32 pr-20 mt-4 text-[9px] font-bold text-slate-400">
                <span>$0</span>
                <span>$10k</span>
                <span>$20k</span>
                <span>$30k</span>
                <span>$40k</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
