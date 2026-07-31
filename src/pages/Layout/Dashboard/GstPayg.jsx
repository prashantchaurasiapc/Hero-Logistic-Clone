import React, { useState, useMemo } from 'react';
import { 
  Building2, FileText, Activity, Users, Calendar, AlertCircle, PieChart as PieChartIcon, 
  TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Filter, Download,
  MoreVertical, CheckCircle, Clock
} from 'lucide-react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export default function GstPayg() {
  const [financialYear, setFinancialYear] = useState('FY 2025/26');
  const [fromDate, setFromDate] = useState('1 Jul 2025');
  const [toDate, setToDate] = useState('30 Jun 2026');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('GST Obligations');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- MOCK DATA ---
  const allObligations = [
    { id: 1, period: 'May 2026 (Q4)', periodEnd: '31 May 2026', dueDate: '28 Jun 2026', collected: 24680, credits: 18540, net: 6140, status: 'Due Soon', lodgedDate: '-', action: 'Prepare', fy: 'FY 2025/26' },
    { id: 2, period: 'Feb 2026 (Q3)', periodEnd: '28 Feb 2026', dueDate: '28 Mar 2026', collected: 22310, credits: 17120, net: 5190, status: 'Lodged', lodgedDate: '24 Mar 2026', action: 'View', fy: 'FY 2025/26' },
    { id: 3, period: 'Nov 2025 (Q2)', periodEnd: '30 Nov 2025', dueDate: '28 Dec 2025', collected: 20150, credits: 15980, net: 4170, status: 'Lodged', lodgedDate: '23 Dec 2025', action: 'View', fy: 'FY 2025/26' },
    { id: 4, period: 'Aug 2025 (Q1)', periodEnd: '31 Aug 2025', dueDate: '28 Sep 2025', collected: 18420, credits: 14240, net: 4180, status: 'Lodged', lodgedDate: '24 Sep 2025', action: 'View', fy: 'FY 2025/26' },
    { id: 5, period: 'May 2025 (Q4)', periodEnd: '31 May 2025', dueDate: '28 Jun 2025', collected: 19810, credits: 15050, net: 4760, status: 'Lodged', lodgedDate: '26 Jun 2025', action: 'View', fy: 'FY 2024/25' },
    { id: 6, period: 'Feb 2025 (Q3)', periodEnd: '28 Feb 2025', dueDate: '28 Mar 2025', collected: 17550, credits: 13520, net: 4030, status: 'Lodged', lodgedDate: '25 Mar 2025', action: 'View', fy: 'FY 2024/25' },
    { id: 7, period: 'Nov 2024 (Q2)', periodEnd: '30 Nov 2024', dueDate: '28 Dec 2024', collected: 16420, credits: 12900, net: 3520, status: 'Overdue', lodgedDate: '-', action: 'Prepare', fy: 'FY 2024/25' },
    { id: 8, period: 'Aug 2024 (Q1)', periodEnd: '31 Aug 2024', dueDate: '28 Sep 2024', collected: 15350, credits: 11960, net: 3390, status: 'Lodged', lodgedDate: '27 Sep 2024', action: 'View', fy: 'FY 2024/25' },
  ];

  const cashFlowData = [
    { name: 'Jul 25', net: 3800, cum: 3800 },
    { name: 'Aug 25', net: 4100, cum: 7900 },
    { name: 'Sep 25', net: 4180, cum: 12080 }, // Q1 lodged
    { name: 'Oct 25', net: 4000, cum: 16080 },
    { name: 'Nov 25', net: 4200, cum: 20280 },
    { name: 'Dec 25', net: 4170, cum: 24450 }, // Q2 lodged
    { name: 'Jan 26', net: 4500, cum: 28950 },
    { name: 'Feb 26', net: 4600, cum: 33550 },
    { name: 'Mar 26', net: 5190, cum: 38740 }, // Q3 lodged
    { name: 'Apr 26', net: 5800, cum: 44540 },
    { name: 'May 26', net: 6140, cum: 50680 },
    { name: 'Jun 26', net: 6000, cum: 56680 }, // Estimated
  ];

  // --- DERIVED STATE ---
  const filteredObligations = useMemo(() => {
    return allObligations.filter(ob => {
      const matchFY = ob.fy === financialYear;
      const matchStatus = statusFilter === 'All' || ob.status === statusFilter;
      return matchFY && matchStatus;
    });
  }, [allObligations, financialYear, statusFilter]);

  const paginatedObligations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredObligations.slice(start, start + itemsPerPage);
  }, [filteredObligations, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredObligations.length / itemsPerPage) || 1;

  // FY Summary Math (FY 2025/26 specifically uses hardcoded targets to match screenshot 1 perfectly)
  const fySummary = useMemo(() => {
    if (financialYear === 'FY 2025/26') {
      return { collected: 106410.00, credits: 37460.00, net: 68950.00, count: 12, avg: 5745.83 };
    }
    const fyRows = allObligations.filter(ob => ob.fy === financialYear);
    const collected = fyRows.reduce((sum, ob) => sum + ob.collected, 0);
    const credits = fyRows.reduce((sum, ob) => sum + ob.credits, 0);
    const net = fyRows.reduce((sum, ob) => sum + ob.net, 0);
    const count = fyRows.length;
    return { collected, credits, net, count, avg: count > 0 ? net / count : 0 };
  }, [allObligations, financialYear]);

  // Current Period data (Assume May 2026 is the current active period for KPIs)
  const currentPeriod = allObligations[0]; 

  const kpis = [
    { title: 'GST Collected (This Period)', value: currentPeriod.collected, trend: 12.5, trendLabel: 'vs Apr 2026', icon: <Building2 className="text-purple-600" size={18}/>, bg: 'bg-purple-50', trendColor: 'text-emerald-500', isUp: true },
    { title: 'GST Credits (This Period)', value: currentPeriod.credits, trend: 5.5, trendLabel: 'vs Apr 2026', icon: <FileText className="text-emerald-600" size={18}/>, bg: 'bg-emerald-50', trendColor: 'text-emerald-500', isUp: true },
    { title: 'Net GST Payable', value: currentPeriod.net, trend: 18.4, trendLabel: 'vs Apr 2026', icon: <Activity className="text-blue-600" size={18}/>, bg: 'bg-blue-50', trendColor: 'text-emerald-500', isUp: true },
    { title: 'PAYG Withholding (This Period)', value: 6215.00, trend: 2.1, trendLabel: 'vs Apr 2026', icon: <Users className="text-amber-600" size={18}/>, bg: 'bg-amber-50', trendColor: 'text-emerald-500', isUp: true },
    { title: 'Outstanding Liabilities', value: 6140.00, overdueCount: 1, icon: <Calendar className="text-rose-600" size={18}/>, bg: 'bg-rose-50' },
    { title: 'YTD Net GST Payable', value: 68950.00, trend: 15.7, trendLabel: 'vs FY 2024/25', icon: <PieChartIcon className="text-teal-600" size={18}/>, bg: 'bg-teal-50', trendColor: 'text-emerald-500', isUp: true },
  ];

  const formatCurrency = (val) => `$${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

  const actualPieData = [
    { name: 'Total GST Credits', value: fySummary.credits, color: '#3b82f6' }, // blue for credits
    { name: 'Net GST Payable', value: fySummary.net, color: '#10b981' }, // green for payable
  ];

  const StatusBadge = ({ status }) => {
    let color = 'bg-slate-50 text-slate-600 border-slate-200';
    if (status === 'Due Soon') color = 'bg-amber-50 text-amber-600 border-amber-200';
    if (status === 'Lodged') color = 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (status === 'Overdue') color = 'bg-rose-50 text-rose-600 border-rose-200';
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${color}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-800 font-sans overflow-y-auto w-full">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">GST / PAYG</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Track GST liabilities, PAYG withholding and lodgements.</p>
      </div>

      {/* KPI Cards Grid - Guaranteed equal width */}
      <div className="px-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 py-2 flex-shrink-0">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 flex flex-col justify-between w-full">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kpi.bg}`}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">{kpi.title}</p>
              <div className="text-xl font-black text-slate-900 mb-2">{formatCurrency(kpi.value)}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-medium">
                  {kpi.trend !== undefined ? (
                    <>
                      <span className={`flex items-center gap-0.5 ${kpi.trendColor}`}>
                        {kpi.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {kpi.trend}%
                      </span>
                      <span className="text-slate-400">{kpi.trendLabel}</span>
                    </>
                  ) : (
                    <span className="text-rose-500 font-bold">{kpi.overdueCount} overdue</span>
                  )}
                </div>
                <button className="text-[10px] text-blue-600 font-semibold hover:underline">
                  {kpi.title === 'Outstanding Liabilities' || kpi.title === 'YTD Net GST Payable' ? (kpi.title.includes('YTD') ? 'View report →' : 'View overdue →') : 'View details →'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="px-8 flex flex-col lg:flex-row gap-6 pb-12 flex-shrink-0">
        
        {/* Left Column - Table & Charts */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          
          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex px-6 pt-2 border-b border-slate-200 gap-8 overflow-x-auto scrollbar-hide">
              {['GST Obligations', 'PAYG Withholding', 'Activity History'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                  className={`pb-3 border-b-2 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 overflow-x-auto">
              {activeTab === 'GST Obligations' ? (
                <div className="p-6">
                  {/* Filters Row */}
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
                    <div className="flex flex-nowrap items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide w-full lg:w-auto">
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Financial Year</label>
                        <select 
                          value={financialYear}
                          onChange={(e) => { setFinancialYear(e.target.value); setCurrentPage(1); }}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none w-36"
                        >
                          <option>FY 2025/26</option>
                          <option>FY 2024/25</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">From Date</label>
                        <div className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg w-40">
                          <span className="text-sm text-slate-700 font-medium flex-1">{fromDate}</span>
                          <Calendar size={14} className="text-slate-400" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">To Date</label>
                        <div className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg w-40">
                          <span className="text-sm text-slate-700 font-medium flex-1">{toDate}</span>
                          <Calendar size={14} className="text-slate-400" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                        <select 
                          value={statusFilter}
                          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none w-32"
                        >
                          <option>All</option>
                          <option>Due Soon</option>
                          <option>Lodged</option>
                          <option>Overdue</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                        <Filter size={14} className="text-slate-500" /> Filters
                      </button>
                      <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                        <Download size={14} className="text-slate-500" /> Export
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto bg-white rounded-lg border border-slate-100">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">BAS Period</th>
                          <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Period End</th>
                          <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                          <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">GST Collected</th>
                          <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">GST Credits</th>
                          <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Net GST</th>
                          <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                          <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Lodgement Date</th>
                          <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedObligations.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="px-6 py-12 text-center text-slate-500 text-sm font-medium">No obligations found for this criteria.</td>
                          </tr>
                        ) : (
                          paginatedObligations.map(ob => (
                            <tr key={ob.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-3 py-3 text-[11px] font-bold text-slate-900">{ob.period}</td>
                              <td className="px-3 py-3 text-[11px] font-medium text-slate-600">{ob.periodEnd}</td>
                              <td className="px-3 py-3 text-[11px] font-medium text-slate-600">{ob.dueDate}</td>
                              <td className="px-3 py-3 text-[11px] font-semibold text-slate-700 text-right">{formatCurrency(ob.collected)}</td>
                              <td className="px-3 py-3 text-[11px] font-semibold text-slate-700 text-right">{formatCurrency(ob.credits)}</td>
                              <td className="px-3 py-3 text-[11px] font-bold text-slate-900 text-right">{formatCurrency(ob.net)}</td>
                              <td className="px-3 py-3 text-center">
                                <StatusBadge status={ob.status} />
                              </td>
                              <td className="px-3 py-3 text-[11px] font-medium text-slate-500 text-center">{ob.lodgedDate}</td>
                              <td className="px-3 py-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button className={`px-2.5 py-1 rounded text-[10px] font-bold border ${ob.action === 'Prepare' ? 'border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100' : 'border-slate-200 text-blue-600 hover:bg-slate-50'}`}>
                                    {ob.action}
                                  </button>
                                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={14}/></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Showing {filteredObligations.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredObligations.length)} of {filteredObligations.length} obligations
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
                    <div className="flex items-center gap-2">
                      <select 
                        value={itemsPerPage}
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 focus:outline-none"
                      >
                        <option value={5}>5 / page</option>
                        <option value={10}>10 / page</option>
                      </select>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-500 space-y-4">
                  <Activity size={32} className="text-slate-300" />
                  <p className="text-sm font-medium">Detailed view for <span className="text-slate-700 font-bold">{activeTab}</span> is not populated in this demo.</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary & Cash Flow Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GST Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-900">GST Summary ({financialYear})</h3>
                <button className="text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-1">View report <ChevronRight size={10}/></button>
              </div>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total GST Collected</p>
                  <p className="text-lg font-black text-slate-900">{formatCurrency(fySummary.collected)}</p>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 mt-1"><TrendingUp size={10}/> 15.4% <span className="text-slate-400 font-medium ml-0.5">vs FY 2024/25</span></span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total GST Credits</p>
                  <p className="text-lg font-black text-slate-900">{formatCurrency(fySummary.credits)}</p>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 mt-1"><TrendingUp size={10}/> 10.8% <span className="text-slate-400 font-medium ml-0.5">vs FY 2024/25</span></span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Net GST Payable</p>
                  <p className="text-lg font-black text-slate-900">{formatCurrency(fySummary.net)}</p>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 mt-1"><TrendingUp size={10}/> 15.7% <span className="text-slate-400 font-medium ml-0.5">vs FY 2024/25</span></span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Average Net GST Per Period</p>
                  <p className="text-lg font-black text-slate-900">{formatCurrency(fySummary.avg)}</p>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">{fySummary.count} periods</span>
                </div>
              </div>
            </div>

            {/* GST Cash Flow */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-900">GST Cash Flow ({financialYear})</h3>
                <button className="text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-1">View report <ChevronRight size={10}/></button>
              </div>
              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={cashFlowData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#94a3b8' }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#94a3b8' }} tickFormatter={(val) => `$${val/1000}k`} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#94a3b8' }} tickFormatter={(val) => `$${val/1000}k`} />
                    <RechartsTooltip 
                      formatter={(value, name) => [formatCurrency(value), name === 'net' ? 'Net GST Payable' : 'Cumulative Net GST']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 600, color: '#64748b' }} />
                    <Bar yAxisId="left" dataKey="net" name="Net GST Payable" fill="#22c55e" radius={[2, 2, 0, 0]} barSize={12} />
                    <Line yAxisId="right" type="monotone" dataKey="cum" name="Cumulative Net GST" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - Single Unified Card */}
        <div className="w-full lg:w-[280px] xl:w-[320px] 2xl:w-[380px] flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col gap-8">
            
            {/* GST Position Section */}
            <div className="flex flex-col">
              <h3 className="text-xs font-bold text-slate-900 mb-6">GST Position ({financialYear})</h3>
              
              <div className="flex flex-col items-center mb-6 relative">
                <div className="w-40 h-40 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={actualPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {actualPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[11px] font-black text-slate-900">{formatCurrency(fySummary.net)}</span>
                    <span className="text-[8px] font-semibold text-slate-500">Net GST Payable</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-slate-700">Total GST Collected</span>
                  </div>
                  <span className="font-black text-slate-900">{formatCurrency(fySummary.collected)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="font-bold text-slate-700">Total GST Credits</span>
                  </div>
                  <span className="font-black text-slate-900">{formatCurrency(fySummary.credits)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-slate-700">Net GST Payable</span>
                  </div>
                  <span className="font-black text-rose-500">{formatCurrency(fySummary.net)}</span>
                </div>
              </div>
            </div>
            
            {/* PAYG Withholding Section */}
            <div className="flex flex-col pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 mb-4">PAYG Withholding ({financialYear})</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-medium text-slate-600">Total Withheld</span>
                  <span className="font-bold text-slate-900">$68,480.00</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-medium text-slate-600">Total Paid / Lodged</span>
                  <span className="font-bold text-slate-900">$62,265.00</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-700">Balance Payable</span>
                  <span className="font-bold text-rose-500">$6,215.00</span>
                </div>
              </div>
            </div>

            {/* Key Dates Section */}
            <div className="flex flex-col pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 mb-4">Key Dates</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-2 text-slate-700 font-medium"><Calendar size={12} className="text-slate-400"/> Next BAS Due</span>
                  <span className="font-bold text-amber-500">28 Jun 2026</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-2 text-slate-700 font-medium"><Calendar size={12} className="text-slate-400"/> Next PAYG Instalment Due</span>
                  <span className="font-bold text-slate-700">21 Jul 2026</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-2 text-slate-700 font-medium"><Calendar size={12} className="text-slate-400"/> Super Guarantee Due</span>
                  <span className="font-bold text-slate-700">28 Jul 2026</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-2 text-slate-700 font-medium"><Calendar size={12} className="text-slate-400"/> Annual PAYG Summary Due</span>
                  <span className="font-bold text-slate-700">14 Jul 2026</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="flex flex-col pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <button className="w-full h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm">
                  Prepare BAS
                </button>
                <button className="w-full h-9 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold transition-colors">
                  <Download size={14} className="text-slate-400"/> Lodge with ATO
                </button>
                <button className="w-full h-9 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold transition-colors">
                  <CheckCircle size={14} className="text-slate-400"/> Record GST Payment
                </button>
                <button className="w-full h-9 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold transition-colors">
                  <CheckCircle size={14} className="text-slate-400"/> PAYG Payment
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
