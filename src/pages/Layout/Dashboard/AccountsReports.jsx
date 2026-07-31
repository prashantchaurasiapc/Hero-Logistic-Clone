import React, { useState, useMemo } from 'react';
import { 
  FileText, Calendar, Clock, Download, RefreshCw, Search, Filter, RotateCcw, 
  Star, ChevronRight, ChevronLeft, TrendingUp, DollarSign, Scale, Users, 
  UserCheck, Receipt, PieChart, Truck, Building, FileSpreadsheet, Plus, 
  Share2, MoreVertical, CheckCircle2, SlidersHorizontal
} from 'lucide-react';

export default function AccountsReports() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('All Reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [starredReports, setStarredReports] = useState([1, 6]); // Default starred reports IDs
  const [toastMessage, setToastMessage] = useState(null);

  // Modal States
  const [activeRunModal, setActiveRunModal] = useState(null); // Report object to run
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Financial');
  const [runPeriod, setRunPeriod] = useState('May 2026');
  const [runFormat, setRunFormat] = useState('PDF');

  // Dynamic Recent Reports state so newly run reports appear live in table!
  const [recentReportsList, setRecentReportsList] = useState([
    { id: 1, name: 'P&L Statement - May 2026', category: 'Financial', period: 'May 2026', user: 'John Smith', date: '31 May 2026, 8:45 AM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 2, name: 'GST Summary - Q4 FY 2025/26', category: 'Compliance', period: 'Apr - Jun 2026', user: 'John Smith', date: '30 May 2026, 4:20 PM', format: 'Excel', formatColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 3, name: 'Accounts Receivable Aging', category: 'Financial', period: 'As at 31 May 2026', user: 'Sarah Johnson', date: '30 May 2026, 10:10 AM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 4, name: 'Payroll Summary - May 2026', category: 'Payroll', period: 'May 2026', user: 'John Smith', date: '29 May 2026, 3:30 PM', format: 'Excel', formatColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 5, name: 'Vehicle Cost Report - May 2026', category: 'Vehicle & Assets', period: 'May 2026', user: 'Michael Brown', date: '29 May 2026, 9:15 AM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
  ]);

  // Scheduled Reports Toggles State
  const [scheduledReports, setScheduledReports] = useState([
    { id: 1, name: 'P&L Statement', freq: 'Monthly • 1st day of each month', active: true },
    { id: 2, name: 'GST Summary', freq: 'Quarterly • After quarter end', active: true },
    { id: 3, name: 'Payroll Summary', freq: 'Monthly • Last day of each month', active: true },
    { id: 4, name: 'A/R Aging Report', freq: 'Weekly • Every Monday', active: true },
    { id: 5, name: 'Vehicle Cost Report', freq: 'Monthly • 5th day of each month', active: false },
  ]);

  const toggleScheduled = (id) => {
    setScheduledReports(scheduledReports.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
    setToastMessage('Scheduled report status updated');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleStar = (id) => {
    if (starredReports.includes(id)) {
      setStarredReports(starredReports.filter(sId => sId !== id));
    } else {
      setStarredReports([...starredReports, id]);
    }
  };

  // --- REPORT CARDS DATA (12 Items) ---
  const reportCards = useMemo(() => [
    { id: 1, name: 'Profit & Loss Statement', category: 'Financial', desc: 'Summary of income, expenses and profitability.', tags: ['PDF', 'Excel'], icon: <TrendingUp size={18} />, iconBg: 'bg-emerald-50 text-emerald-600' },
    { id: 2, name: 'Balance Sheet', category: 'Financial', desc: 'Overview of assets, liabilities and equity.', tags: ['PDF', 'Excel'], icon: <Scale size={18} />, iconBg: 'bg-blue-50 text-blue-600' },
    { id: 3, name: 'Cash Flow Statement', category: 'Financial', desc: 'Cash inflows and outflows summary.', tags: ['PDF', 'Excel'], icon: <DollarSign size={18} />, iconBg: 'bg-teal-50 text-teal-600' },
    { id: 4, name: 'Accounts Receivable Aging', category: 'Financial', desc: 'Outstanding invoices by aging buckets.', tags: ['PDF', 'Excel'], icon: <Users size={18} />, iconBg: 'bg-amber-50 text-amber-600' },
    { id: 5, name: 'Accounts Payable Aging', category: 'Financial', desc: 'Outstanding bills by aging buckets.', tags: ['PDF', 'Excel'], icon: <UserCheck size={18} />, iconBg: 'bg-purple-50 text-purple-600' },
    { id: 6, name: 'GST Summary Report', category: 'Compliance', desc: 'GST collected, paid and net payable.', tags: ['PDF', 'Excel'], icon: <Receipt size={18} />, iconBg: 'bg-emerald-50 text-emerald-600' },
    { id: 7, name: 'PAYG Withholding Report', category: 'Compliance', desc: 'PAYG withheld and lodged summary.', tags: ['PDF', 'Excel'], icon: <FileText size={18} />, iconBg: 'bg-rose-50 text-rose-600' },
    { id: 8, name: 'Payroll Summary', category: 'Payroll', desc: 'Wages, taxes and superannuation summary.', tags: ['PDF', 'Excel'], icon: <Users size={18} />, iconBg: 'bg-blue-50 text-blue-600' },
    { id: 9, name: 'Employee Payroll Detail', category: 'Payroll', desc: 'Detailed payroll breakdowns by employee.', tags: ['PDF', 'Excel'], icon: <FileSpreadsheet size={18} />, iconBg: 'bg-emerald-50 text-emerald-600' },
    { id: 10, name: 'Contractor Payments Report', category: 'Operations', desc: 'Payments made to contractors.', tags: ['PDF', 'Excel'], icon: <Building size={18} />, iconBg: 'bg-amber-50 text-amber-600' },
    { id: 11, name: 'Expense Summary', category: 'Operations', desc: 'Expenses grouped by category.', tags: ['PDF', 'Excel'], icon: <PieChart size={18} />, iconBg: 'bg-blue-50 text-blue-600' },
    { id: 12, name: 'Vehicle Cost Report', category: 'Vehicle & Assets', desc: 'Operating costs by vehicle.', tags: ['PDF', 'Excel'], icon: <Truck size={18} />, iconBg: 'bg-purple-50 text-purple-600' },
  ], []);

  // Filter report cards
  const filteredReportCards = useMemo(() => {
    return reportCards.filter(report => {
      // Active Tab Filter
      if (activeTab !== 'All Reports' && activeTab !== 'Custom') {
        if (report.category !== activeTab) return false;
      }
      // Dropdown Category Filter
      if (selectedCategory !== 'All' && report.category !== selectedCategory) return false;
      // Dropdown Format Filter
      if (selectedFormat !== 'All' && !report.tags.includes(selectedFormat)) return false;
      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = report.name.toLowerCase().includes(q);
        const matchDesc = report.desc.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [reportCards, activeTab, selectedCategory, selectedFormat, searchQuery]);

  // --- RECENT REPORTS TABLE DATA ---
  const recentReports = useMemo(() => [
    { id: 1, name: 'P&L Statement - May 2026', category: 'Financial', period: 'May 2026', user: 'John Smith', date: '31 May 2026, 8:45 AM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 2, name: 'GST Summary - Q4 FY 2025/26', category: 'Compliance', period: 'Apr - Jun 2026', user: 'John Smith', date: '30 May 2026, 4:20 PM', format: 'Excel', formatColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 3, name: 'Accounts Receivable Aging', category: 'Financial', period: 'As at 31 May 2026', user: 'Sarah Johnson', date: '30 May 2026, 10:10 AM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 4, name: 'Payroll Summary - May 2026', category: 'Payroll', period: 'May 2026', user: 'John Smith', date: '29 May 2026, 3:30 PM', format: 'Excel', formatColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 5, name: 'Vehicle Cost Report - May 2026', category: 'Vehicle & Assets', period: 'May 2026', user: 'Michael Brown', date: '29 May 2026, 9:15 AM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },

    // Additional mock rows for pagination (items 6-20)
    { id: 6, name: 'Balance Sheet - Q3 2026', category: 'Financial', period: 'Jan - Mar 2026', user: 'David Lee', date: '28 May 2026, 2:15 PM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 7, name: 'PAYG Withholding - May 2026', category: 'Compliance', period: 'May 2026', user: 'Sarah Johnson', date: '27 May 2026, 11:30 AM', format: 'Excel', formatColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 8, name: 'Expense Summary - Q1 2026', category: 'Operations', period: 'Jan - Mar 2026', user: 'Michael Brown', date: '26 May 2026, 4:00 PM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 9, name: 'Contractor Pay - May 2026', category: 'Operations', period: 'May 2026', user: 'John Smith', date: '25 May 2026, 10:45 AM', format: 'Excel', formatColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 10, name: 'Employee Payroll Detail', category: 'Payroll', period: 'May 2026', user: 'Sarah Johnson', date: '24 May 2026, 3:20 PM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 11, name: 'Cash Flow Statement - May 2026', category: 'Financial', period: 'May 2026', user: 'David Lee', date: '23 May 2026, 1:10 PM', format: 'Excel', formatColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 12, name: 'A/P Aging Report', category: 'Financial', period: 'As at 22 May 2026', user: 'John Smith', date: '22 May 2026, 9:00 AM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 13, name: 'GST Obligations Audit', category: 'Compliance', period: 'Q3 2026', user: 'Sarah Johnson', date: '21 May 2026, 5:15 PM', format: 'Excel', formatColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 14, name: 'Vehicle Maintenance Log', category: 'Vehicle & Assets', period: 'Apr 2026', user: 'Michael Brown', date: '20 May 2026, 11:00 AM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 15, name: 'Fuel Consumption Audit', category: 'Vehicle & Assets', period: 'May 2026', user: 'David Lee', date: '19 May 2026, 2:40 PM', format: 'Excel', formatColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 16, name: 'P&L Statement - Apr 2026', category: 'Financial', period: 'Apr 2026', user: 'John Smith', date: '18 May 2026, 9:30 AM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 17, name: 'Superannuation Guarantee', category: 'Payroll', period: 'Q3 2026', user: 'Sarah Johnson', date: '17 May 2026, 4:10 PM', format: 'Excel', formatColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 18, name: 'Fleet Depreciation Schedule', category: 'Vehicle & Assets', period: 'FY 2025/26', user: 'Michael Brown', date: '16 May 2026, 10:20 AM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 19, name: 'Vendor Expenses Summary', category: 'Operations', period: 'Apr 2026', user: 'David Lee', date: '15 May 2026, 3:00 PM', format: 'Excel', formatColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 20, name: 'Annual BAS Statement', category: 'Compliance', period: 'FY 2024/25', user: 'John Smith', date: '14 May 2026, 1:15 PM', format: 'PDF', formatColor: 'bg-rose-50 text-rose-600 border-rose-100' },
  ], []);

  // Pagination for Recent Reports Table
  const totalPages = Math.ceil(recentReports.length / itemsPerPage) || 1;
  const paginatedRecentReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return recentReports.slice(start, start + itemsPerPage);
  }, [recentReports, currentPage, itemsPerPage]);

  // --- KPI CARDS DATA ---
  const kpis = [
    { title: 'Reports Generated (This Period)', value: '28', trend: '31.7%', trendLabel: 'vs Apr 2026', link: 'View details →', bg: 'bg-blue-50 text-blue-600', icon: <FileText size={20} /> },
    { title: 'Scheduled Reports', value: '7', sub: 'Next: 31 May 2026', link: 'View schedule →', bg: 'bg-emerald-50 text-emerald-600', icon: <Calendar size={20} /> },
    { title: 'Last Report Run', value: 'Today, 8:45 AM', sub: 'P&L Statement - May 2026', link: 'View report →', bg: 'bg-purple-50 text-purple-600', icon: <Clock size={20} /> },
    { title: 'Exports (This Period)', value: '15', trend: '38.4%', trendLabel: 'vs Apr 2026', link: 'View exports →', bg: 'bg-amber-50 text-amber-600', icon: <Download size={20} /> },
    { title: 'Data Updated', value: 'Today, 9:20 AM', sub: 'All systems up to date', link: 'Refresh data →', bg: 'bg-rose-50 text-rose-600', icon: <RefreshCw size={20} /> },
  ];

  const handleResetFilters = () => {
    setActiveTab('All Reports');
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedFormat('All');
    setSelectedPeriod('All');
    setToastMessage('Filters reset to default');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRunReport = (reportName) => {
    setToastMessage(`Generating ${reportName}...`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-800 font-sans overflow-y-auto w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="px-4 sm:px-8 pt-8 pb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reports</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Access financial, operational and compliance reports for your business.</p>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6 py-2 flex-shrink-0">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 flex flex-col justify-between w-full">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kpi.bg}`}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">{kpi.title}</p>
              <div className="text-xl font-black text-slate-900 mb-2">{kpi.value}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-medium">
                  {kpi.trend ? (
                    <>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                        <TrendingUp size={12} />
                        {kpi.trend}
                      </span>
                      <span className="text-slate-400 text-[10px]">{kpi.trendLabel}</span>
                    </>
                  ) : (
                    <span className="text-slate-400 text-[10px] truncate">{kpi.sub}</span>
                  )}
                </div>
                <button 
                  onClick={() => { setToastMessage(`Action triggered for ${kpi.title}`); setTimeout(() => setToastMessage(null), 3000); }}
                  className="text-[10px] text-blue-600 font-bold hover:underline shrink-0"
                >
                  {kpi.link}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar & Category Tabs */}
      <div className="px-4 sm:px-8 mb-6 flex-shrink-0">
        <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm flex flex-col gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-hide">
            {['All Reports', 'Financial', 'Compliance', 'Operations', 'Payroll', 'Vehicle & Assets', 'Custom'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold whitespace-nowrap transition-colors relative pb-1 ${activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Controls Row */}
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative w-full xl:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search reports by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Select Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Financial">Financial</option>
                <option value="Compliance">Compliance</option>
                <option value="Operations">Operations</option>
                <option value="Payroll">Payroll</option>
                <option value="Vehicle & Assets">Vehicle & Assets</option>
              </select>

              <select 
                value={selectedFormat} 
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Formats</option>
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
              </select>

              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Periods</option>
                <option value="May 2026">May 2026</option>
                <option value="Apr 2026">Apr 2026</option>
                <option value="Q4 FY 2025/26">Q4 FY 2025/26</option>
                <option value="FY 2025/26">FY 2025/26</option>
              </select>

              <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-sm">
                <SlidersHorizontal size={14} className="text-slate-400" /> Filters
              </button>

              <button 
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-sm"
              >
                <RotateCcw size={14} className="text-slate-400" /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-8 flex flex-col lg:flex-row gap-6 pb-12 flex-shrink-0">
        
        {/* LEFT COLUMN - Reports Cards Grid & Recent Table */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          
          {/* 12 Reports Cards Grid (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredReportCards.map(report => (
              <div key={report.id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  {/* Card Top: Icon & Star */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${report.iconBg}`}>
                      {report.icon}
                    </div>
                    <button 
                      onClick={() => toggleStar(report.id)}
                      className="text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      <Star size={16} className={starredReports.includes(report.id) ? "fill-amber-400 text-amber-400" : ""} />
                    </button>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xs font-bold text-slate-900 mb-1">{report.name}</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4">{report.desc}</p>
                </div>

                {/* Card Bottom: Tags & Action */}
                <div>
                  <div className="flex items-center gap-1.5 mb-4">
                    {report.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={() => handleRunReport(report.name)}
                    className="flex items-center gap-1 text-[11px] text-blue-600 font-bold hover:underline"
                  >
                    Run Report <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View More Reports Button */}
          <div className="flex justify-center py-2">
            <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
              View more reports →
            </button>
          </div>

          {/* Recent Reports Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col mt-2">
            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900">Recent Reports</h3>
              <button className="text-[11px] text-blue-600 font-bold hover:underline">View all reports →</button>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Report Name</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Period / Date</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Generated By</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Generated On</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Format</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRecentReports.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 text-xs font-bold text-slate-900 flex items-center gap-2">
                        <FileText size={14} className="text-slate-400" />
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-[11px] font-medium text-slate-600">{item.category}</td>
                      <td className="px-4 py-3 text-[11px] font-medium text-slate-600">{item.period}</td>
                      <td className="px-4 py-3 text-[11px] font-medium text-slate-700">{item.user}</td>
                      <td className="px-4 py-3 text-[11px] font-medium text-slate-500">{item.date}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.formatColor}`}>
                          {item.format}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setToastMessage(`Downloading ${item.name}`)} className="p-1 text-slate-400 hover:text-slate-600"><Download size={13} /></button>
                          <button onClick={() => setToastMessage(`Sharing ${item.name}`)} className="p-1 text-slate-400 hover:text-slate-600"><Share2 size={13} /></button>
                          <button className="p-1 text-slate-400 hover:text-slate-600"><MoreVertical size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 gap-4">
              <p className="text-xs text-slate-500 font-medium">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, recentReports.length)} of {recentReports.length} reports
              </p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded text-xs font-bold transition-colors ${currentPage === page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                <select 
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-3 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-700 bg-white cursor-pointer focus:outline-none"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[280px] xl:w-[320px] 2xl:w-[360px] flex-shrink-0 flex flex-col gap-6">
          
          {/* Popular Reports Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-4">Popular Reports</h3>
            
            <div className="space-y-4 mb-4">
              {[
                { name: 'P&L Statement', desc: 'View your business profitability.', iconBg: 'bg-emerald-50 text-emerald-600', icon: <TrendingUp size={14}/> },
                { name: 'GST Summary Report', desc: 'Track GST collected and paid.', iconBg: 'bg-emerald-50 text-emerald-600', icon: <Receipt size={14}/> },
                { name: 'Accounts Receivable Aging', desc: 'Monitor outstanding invoices.', iconBg: 'bg-amber-50 text-amber-600', icon: <Users size={14}/> },
                { name: 'Cash Flow Statement', desc: 'Understand your cash position.', iconBg: 'bg-teal-50 text-teal-600', icon: <DollarSign size={14}/> },
                { name: 'Payroll Summary', desc: 'Wages, taxes and super summary.', iconBg: 'bg-blue-50 text-blue-600', icon: <FileText size={14}/> },
              ].map((pop, i) => (
                <div key={i} className="flex items-start gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${pop.iconBg}`}>
                    {pop.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{pop.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{pop.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="text-[11px] text-blue-600 font-bold hover:underline text-left">
              View all popular reports →
            </button>
          </div>

          {/* Scheduled Reports Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-1">Scheduled Reports</h3>
            <p className="text-[11px] text-slate-500 font-medium mb-4">Manage your automated report delivery.</p>

            <div className="space-y-4 mb-4">
              {scheduledReports.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{item.freq}</p>
                    </div>
                  </div>

                  {/* Switch Toggle Button */}
                  <button 
                    onClick={() => toggleScheduled(item.id)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${item.active ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'}`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-sm inline-block"></span>
                  </button>
                </div>
              ))}
            </div>

            <button className="text-[11px] text-blue-600 font-bold hover:underline text-left">
              View all scheduled reports →
            </button>
          </div>

          {/* Custom Reports Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-1">Custom Reports</h3>
            <p className="text-[11px] text-slate-500 font-medium mb-4">Create reports tailored to your business needs.</p>

            <button 
              onClick={() => setShowCustomModal(true)}
              className="w-full h-9 flex items-center justify-center gap-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <Plus size={14} /> Create Custom Report
            </button>
          </div>

        </div>

      </div>

      {/* --- RUN REPORT MODAL --- */}
      {activeRunModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                Run {activeRunModal.name}
              </h3>
              <button onClick={() => setActiveRunModal(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Select Period</label>
                <select 
                  value={runPeriod} 
                  onChange={(e) => setRunPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-slate-50"
                >
                  <option value="May 2026">May 2026</option>
                  <option value="Apr 2026">Apr 2026</option>
                  <option value="Q4 FY 2025/26">Q4 FY 2025/26</option>
                  <option value="FY 2025/26">FY 2025/26</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Output Format</label>
                <select 
                  value={runFormat} 
                  onChange={(e) => setRunFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-slate-50"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="Excel">Excel Spreadsheet (.xlsx)</option>
                  <option value="CSV">Comma Separated Values (.csv)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] text-slate-600">
                <p className="font-semibold mb-1">Report Details:</p>
                <p>{activeRunModal.desc}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3 mt-2">
              <button 
                onClick={() => setActiveRunModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const newReport = {
                    id: Date.now(),
                    name: `${activeRunModal.name} - ${runPeriod}`,
                    category: activeRunModal.category,
                    period: runPeriod,
                    user: 'John Smith',
                    date: 'Just now',
                    format: runFormat,
                    formatColor: runFormat === 'PDF' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  };
                  setRecentReportsList([newReport, ...recentReportsList]);
                  setActiveRunModal(null);
                  setToastMessage(`Generated ${newReport.name} successfully!`);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE CUSTOM REPORT MODAL --- */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus size={16} className="text-blue-600" />
                Create Custom Report
              </h3>
              <button onClick={() => setShowCustomModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Report Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Custom Fleet & Fuel Analysis"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Category</label>
                <select 
                  value={customCategory} 
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-slate-50"
                >
                  <option value="Financial">Financial</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Operations">Operations</option>
                  <option value="Payroll">Payroll</option>
                  <option value="Vehicle & Assets">Vehicle & Assets</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3 mt-2">
              <button 
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!customTitle.trim()) return;
                  setShowCustomModal(false);
                  setCustomTitle('');
                  setToastMessage(`Custom report "${customTitle}" created!`);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Save Custom Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
