import React, { useState, useMemo, useEffect } from 'react';
import api from '../../../services/api';
import { 
  Building2, FileText, Activity, Users, Calendar, AlertCircle, PieChart as PieChartIcon, 
  TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Filter, Download,
  MoreVertical, CheckCircle, Clock, X, Search, CheckCircle2, Send, DollarSign, RefreshCw
} from 'lucide-react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export default function GstPayg() {
  const [financialYear, setFinancialYear] = useState('FY 2025/26');
  const [fromDate, setFromDate] = useState('2025-07-01');
  const [toDate, setToDate] = useState('2026-06-30');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paygStatusFilter, setPaygStatusFilter] = useState('All');
  const [activitySearch, setActivitySearch] = useState('');
  const [activeTab, setActiveTab] = useState('GST Obligations');
  const [loading, setLoading] = useState(false);

  // Dynamic live tax summary
  const [taxSummary, setTaxSummary] = useState({
    gstCollected: 24680,
    gstCredits: 18540,
    netGstPayable: 6140,
    paygWithholding: 12450,
    nextBasDueDate: '28 Jun 2026',
    nextPaygDueDate: '21 Jun 2026'
  });

  const fetchTaxData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts/tax/gst-payg');
      if (res.data?.success && res.data.data?.summary) {
        setTaxSummary(res.data.data.summary);
        if (Array.isArray(res.data.data.obligations)) {
          setAllObligations(res.data.data.obligations);
        }
      }
    } catch (err) {
      console.warn('Using live fallback GST/PAYG calculations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxData();
  }, []);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Interactivity Modals & Toast State
  const [toastMessage, setToastMessage] = useState(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);
  const [preparingBas, setPreparingBas] = useState(null);
  const [viewingLodgement, setViewingLodgement] = useState(null);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [isPaygPaymentModalOpen, setIsPaygPaymentModalOpen] = useState(false);

  // Form State for GST Payment Modal
  const [paymentForm, setPaymentForm] = useState({
    amount: '6140.00',
    reference: 'BAS-MAY2026-PAY',
    paymentMethod: 'Electronic Funds Transfer (EFT)',
    paymentDate: '2026-05-28'
  });

  // Form State for PAYG Payment Modal
  const [paygPaymentForm, setPaygPaymentForm] = useState({
    amount: '12450.00',
    reference: 'PAYG-MAY2026-REMIT',
    paymentMethod: 'Direct Debit',
    paymentDate: '2026-05-28'
  });

  // Close action dropdown menu when clicking outside
  useEffect(() => {
    const handleDocumentClick = () => setActiveActionMenuId(null);
    window.addEventListener('click', handleDocumentClick);
    return () => window.removeEventListener('click', handleDocumentClick);
  }, []);

  // --- MOCK DATA ---
  const [allObligations, setAllObligations] = useState([
    { id: 1, period: 'May 2026 (Q4)', periodEnd: '31 May 2026', dueDate: '28 Jun 2026', collected: 24680, credits: 18540, net: 6140, status: 'Due Soon', lodgedDate: '-', action: 'Prepare', fy: 'FY 2025/26' },
    { id: 2, period: 'Feb 2026 (Q3)', periodEnd: '28 Feb 2026', dueDate: '28 Mar 2026', collected: 22310, credits: 17120, net: 5190, status: 'Lodged', lodgedDate: '24 Mar 2026', action: 'View', fy: 'FY 2025/26' },
    { id: 3, period: 'Nov 2025 (Q2)', periodEnd: '30 Nov 2025', dueDate: '28 Dec 2025', collected: 20150, credits: 15980, net: 4170, status: 'Lodged', lodgedDate: '23 Dec 2025', action: 'View', fy: 'FY 2025/26' },
    { id: 4, period: 'Aug 2025 (Q1)', periodEnd: '31 Aug 2025', dueDate: '28 Sep 2025', collected: 18420, credits: 14240, net: 4180, status: 'Lodged', lodgedDate: '24 Sep 2025', action: 'View', fy: 'FY 2025/26' },
    { id: 5, period: 'May 2025 (Q4)', periodEnd: '31 May 2025', dueDate: '28 Jun 2025', collected: 19810, credits: 15050, net: 4760, status: 'Lodged', lodgedDate: '26 Jun 2025', action: 'View', fy: 'FY 2024/25' },
    { id: 6, period: 'Feb 2025 (Q3)', periodEnd: '28 Feb 2025', dueDate: '28 Mar 2025', collected: 17550, credits: 13520, net: 4030, status: 'Lodged', lodgedDate: '25 Mar 2025', action: 'View', fy: 'FY 2024/25' },
    { id: 7, period: 'Nov 2024 (Q2)', periodEnd: '30 Nov 2024', dueDate: '28 Dec 2024', collected: 16420, credits: 12900, net: 3520, status: 'Overdue', lodgedDate: '-', action: 'Prepare', fy: 'FY 2024/25' },
    { id: 8, period: 'Aug 2024 (Q1)', periodEnd: '31 Aug 2024', dueDate: '28 Sep 2024', collected: 15350, credits: 11960, net: 3390, status: 'Lodged', lodgedDate: '27 Sep 2024', action: 'View', fy: 'FY 2024/25' },
  ]);

  const [paygObligations, setPaygObligations] = useState([
    { id: 'p1', period: 'May 2026', grossWages: 58400, paygWithheld: 12450, employeesCount: 18, dueDate: '21 Jun 2026', status: 'Due Soon', paymentDate: '-', action: 'Prepare', fy: 'FY 2025/26' },
    { id: 'p2', period: 'Apr 2026', grossWages: 56200, paygWithheld: 11800, employeesCount: 18, dueDate: '21 May 2026', status: 'Lodged', paymentDate: '18 May 2026', action: 'View', fy: 'FY 2025/26' },
    { id: 'p3', period: 'Mar 2026', grossWages: 54100, paygWithheld: 11350, employeesCount: 17, dueDate: '21 Apr 2026', status: 'Lodged', paymentDate: '19 Apr 2026', action: 'View', fy: 'FY 2025/26' },
    { id: 'p4', period: 'Feb 2026', grossWages: 52800, paygWithheld: 10900, employeesCount: 17, dueDate: '21 Mar 2026', status: 'Lodged', paymentDate: '20 Mar 2026', action: 'View', fy: 'FY 2025/26' },
    { id: 'p5', period: 'Jan 2026', grossWages: 51500, paygWithheld: 10600, employeesCount: 16, dueDate: '21 Feb 2026', status: 'Lodged', paymentDate: '18 Feb 2026', action: 'View', fy: 'FY 2025/26' },
    { id: 'p6', period: 'Dec 2025', grossWages: 55900, paygWithheld: 11380, employeesCount: 16, dueDate: '21 Jan 2026', status: 'Lodged', paymentDate: '19 Jan 2026', action: 'View', fy: 'FY 2025/26' },
    { id: 'p7', period: 'Nov 2025', grossWages: 50400, paygWithheld: 10100, employeesCount: 15, dueDate: '21 Dec 2025', status: 'Lodged', paymentDate: '18 Dec 2025', action: 'View', fy: 'FY 2025/26' },
    { id: 'p8', period: 'Oct 2025', grossWages: 49800, paygWithheld: 9900, employeesCount: 15, dueDate: '21 Nov 2025', status: 'Lodged', paymentDate: '19 Nov 2025', action: 'View', fy: 'FY 2025/26' },
  ]);

  const [activityLogs, setActivityLogs] = useState([
    { id: 'act-1', timestamp: '24 May 2026, 14:32', event: 'GST Q3 Payment Recorded', type: 'GST Payment', amount: 5190.00, user: 'Accounts Admin', ref: 'REC-9941', status: 'Completed' },
    { id: 'act-2', timestamp: '24 Mar 2026, 11:15', event: 'BAS Lodgement Submitted (Q3)', type: 'BAS Lodgement', amount: 5190.00, user: 'John Accountant', ref: 'ATO-8842', status: 'Lodged' },
    { id: 'act-3', timestamp: '18 May 2026, 16:40', event: 'PAYG Withholding April Remittance', type: 'PAYG Remittance', amount: 11800.00, user: 'Accounts Admin', ref: 'PAYG-5512', status: 'Completed' },
    { id: 'act-4', timestamp: '19 Apr 2026, 10:05', event: 'PAYG Withholding March Remittance', type: 'PAYG Remittance', amount: 11350.00, user: 'Accounts Admin', ref: 'PAYG-5401', status: 'Completed' },
    { id: 'act-5', timestamp: '23 Dec 2025, 09:20', event: 'BAS Lodgement Submitted (Q2)', type: 'BAS Lodgement', amount: 4170.00, user: 'Sarah Accountant', ref: 'ATO-7731', status: 'Lodged' },
    { id: 'act-6', timestamp: '24 Sep 2025, 15:10', event: 'BAS Lodgement Submitted (Q1)', type: 'BAS Lodgement', amount: 4180.00, user: 'Accounts Admin', ref: 'ATO-6620', status: 'Lodged' },
    { id: 'act-7', timestamp: '18 Sep 2025, 13:45', event: 'PAYG Withholding August Remittance', type: 'PAYG Remittance', amount: 9900.00, user: 'Accounts Admin', ref: 'PAYG-4902', status: 'Completed' },
  ]);

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

  // Export to CSV Function
  const handleExportCSV = () => {
    let csvHeader = "";
    let csvRows = [];
    let filename = "";

    if (activeTab === 'GST Obligations') {
      csvHeader = "BAS Period,Period End,Due Date,GST Collected,GST Credits,Net GST,Status,Lodgement Date\n";
      csvRows = filteredObligations.map(ob => 
        `"${ob.period}","${ob.periodEnd}","${ob.dueDate}","${ob.collected}","${ob.credits}","${ob.net}","${ob.status}","${ob.lodgedDate}"`
      );
      filename = `GST_Obligations_${financialYear.replace('/', '_')}.csv`;
    } else if (activeTab === 'PAYG Withholding') {
      csvHeader = "Period,Gross Wages,PAYG Withheld,Employees,Due Date,Status,Payment Date\n";
      csvRows = filteredPayg.map(ob => 
        `"${ob.period}","${ob.grossWages}","${ob.paygWithheld}","${ob.employeesCount}","${ob.dueDate}","${ob.status}","${ob.paymentDate}"`
      );
      filename = `PAYG_Withholding_${financialYear.replace('/', '_')}.csv`;
    } else {
      csvHeader = "Timestamp,Event,Type,Amount,User,Reference,Status\n";
      csvRows = filteredActivity.map(act => 
        `"${act.timestamp}","${act.event}","${act.type}","${act.amount}","${act.user}","${act.ref}","${act.status}"`
      );
      filename = `GST_PAYG_Activity_History.csv`;
    }

    const blob = new Blob([csvHeader + csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Exported ${activeTab} data to CSV successfully!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- DERIVED STATE ---
  const filteredObligations = useMemo(() => {
    return allObligations.filter(ob => {
      const matchFY = ob.fy === financialYear;
      const matchStatus = statusFilter === 'All' || ob.status === statusFilter;
      return matchFY && matchStatus;
    });
  }, [allObligations, financialYear, statusFilter]);

  const filteredPayg = useMemo(() => {
    return paygObligations.filter(ob => {
      const matchFY = ob.fy === financialYear;
      const matchStatus = paygStatusFilter === 'All' || ob.status === paygStatusFilter;
      return matchFY && matchStatus;
    });
  }, [paygObligations, financialYear, paygStatusFilter]);

  const filteredActivity = useMemo(() => {
    if (!activitySearch.trim()) return activityLogs;
    const query = activitySearch.toLowerCase();
    return activityLogs.filter(act => 
      act.event.toLowerCase().includes(query) ||
      act.type.toLowerCase().includes(query) ||
      act.ref.toLowerCase().includes(query) ||
      act.user.toLowerCase().includes(query)
    );
  }, [activityLogs, activitySearch]);

  const currentTabRecordsCount = useMemo(() => {
    if (activeTab === 'GST Obligations') return filteredObligations.length;
    if (activeTab === 'PAYG Withholding') return filteredPayg.length;
    return filteredActivity.length;
  }, [activeTab, filteredObligations, filteredPayg, filteredActivity]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    if (activeTab === 'GST Obligations') return filteredObligations.slice(start, start + itemsPerPage);
    if (activeTab === 'PAYG Withholding') return filteredPayg.slice(start, start + itemsPerPage);
    return filteredActivity.slice(start, start + itemsPerPage);
  }, [activeTab, filteredObligations, filteredPayg, filteredActivity, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(currentTabRecordsCount / itemsPerPage) || 1;

  // FY Summary Math
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

  // Current Period data
  const currentPeriod = allObligations[0]; 

  const kpis = [
    { title: 'GST Collected (This Period)', value: currentPeriod.collected, trend: 12.5, trendLabel: 'vs Apr 2026', icon: <Building2 className="text-purple-600" size={18}/>, bg: 'bg-purple-50', trendColor: 'text-emerald-500', isUp: true },
    { title: 'GST Credits (This Period)', value: currentPeriod.credits, trend: 5.5, trendLabel: 'vs Apr 2026', icon: <FileText className="text-emerald-600" size={18}/>, bg: 'bg-emerald-50', trendColor: 'text-emerald-500', isUp: true },
    { title: 'Net GST Payable', value: currentPeriod.net, trend: 18.4, trendLabel: 'vs Apr 2026', icon: <Activity className="text-blue-600" size={18}/>, bg: 'bg-blue-50', trendColor: 'text-emerald-500', isUp: true },
    { title: 'PAYG Withholding (This Period)', value: 12450.00, trend: 2.1, trendLabel: 'vs Apr 2026', icon: <Users className="text-amber-600" size={18}/>, bg: 'bg-amber-50', trendColor: 'text-emerald-500', isUp: true },
    { title: 'Outstanding Liabilities', value: 6140.00, overdueCount: 1, icon: <Calendar className="text-rose-600" size={18}/>, bg: 'bg-rose-50' },
    { title: 'YTD Net GST Payable', value: 68950.00, trend: 15.7, trendLabel: 'vs FY 2024/25', icon: <PieChartIcon className="text-teal-600" size={18}/>, bg: 'bg-teal-50', trendColor: 'text-emerald-500', isUp: true },
  ];

  const formatCurrency = (val) => `$${(val || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

  const actualPieData = [
    { name: 'Total GST Credits', value: fySummary.credits, color: '#3b82f6' },
    { name: 'Net GST Payable', value: fySummary.net, color: '#10b981' },
  ];

  const StatusBadge = ({ status }) => {
    let color = 'bg-slate-50 text-slate-600 border-slate-200';
    if (status === 'Due Soon') color = 'bg-amber-50 text-amber-600 border-amber-200';
    if (status === 'Lodged' || status === 'Completed') color = 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (status === 'Overdue') color = 'bg-rose-50 text-rose-600 border-rose-200';
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${color}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-800 font-sans overflow-y-auto w-full relative">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[99999] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fadeIn text-xs font-semibold">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="px-4 sm:px-8 pt-4 sm:pt-8 pb-4 sm:pb-6 flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">GST / PAYG</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Track GST liabilities, PAYG withholding and lodgements.</p>
      </div>

      {/* KPI Cards Grid - Responsive columns */}
      <div className="px-4 sm:px-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 py-1 flex-shrink-0">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-200/60 flex flex-col justify-between w-full">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${kpi.bg}`}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">{kpi.title}</p>
              <div className="text-base sm:text-xl font-black text-slate-900 mb-1.5 sm:mb-2">{formatCurrency(kpi.value)}</div>
              <div className="flex items-center justify-between flex-wrap gap-1">
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium">
                  {kpi.trend !== undefined ? (
                    <>
                      <span className={`flex items-center gap-0.5 ${kpi.trendColor}`}>
                        {kpi.isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {kpi.trend}%
                      </span>
                      <span className="text-slate-400 hidden xs:inline">{kpi.trendLabel}</span>
                    </>
                  ) : (
                    <span className="text-rose-500 font-bold">{kpi.overdueCount} overdue</span>
                  )}
                </div>
                <button 
                  onClick={() => {
                    setToastMessage(`Viewing detailed analytics for ${kpi.title}`);
                    setTimeout(() => setToastMessage(null), 3000);
                  }} 
                  className="text-[9px] sm:text-[10px] text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  {kpi.title === 'Outstanding Liabilities' || kpi.title === 'YTD Net GST Payable' ? (kpi.title.includes('YTD') ? 'View →' : 'Overdue →') : 'Details →'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-8 flex flex-col lg:flex-row gap-6 pb-12 flex-shrink-0">
        
        {/* Left Column - Table & Charts */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          
          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex px-4 sm:px-6 pt-2 border-b border-slate-200 gap-4 sm:gap-8 overflow-x-auto scrollbar-hide">
              {['GST Obligations', 'PAYG Withholding', 'Activity History'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                  className={`pb-3 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 overflow-x-auto">
              
              {/* TAB 1: GST OBLIGATIONS */}
              {activeTab === 'GST Obligations' && (
                <div className="p-3.5 sm:p-6">
                  {/* Filters Row - 100% Mobile Responsive */}
                  <div className="flex flex-col gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:flex lg:flex-wrap items-end gap-3 sm:gap-4 w-full">
                      <div className="flex flex-col gap-1 w-full lg:w-auto">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Financial Year</label>
                        <select 
                          value={financialYear}
                          onChange={(e) => { 
                            setFinancialYear(e.target.value); 
                            setCurrentPage(1);
                            if (e.target.value === 'FY 2025/26') {
                              setFromDate('2025-07-01');
                              setToDate('2026-06-30');
                            } else {
                              setFromDate('2024-07-01');
                              setToDate('2025-06-30');
                            }
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 w-full lg:w-36 cursor-pointer shadow-2xs"
                        >
                          <option value="FY 2025/26">FY 2025/26</option>
                          <option value="FY 2024/25">FY 2024/25</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col gap-1 w-full lg:w-auto">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">From Date</label>
                        <div className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl w-full lg:w-40 shadow-2xs">
                          <input 
                            type="date" 
                            value={fromDate} 
                            onChange={(e) => setFromDate(e.target.value)} 
                            className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1 w-full lg:w-auto">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">To Date</label>
                        <div className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl w-full lg:w-40 shadow-2xs">
                          <input 
                            type="date" 
                            value={toDate} 
                            onChange={(e) => setToDate(e.target.value)} 
                            className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1 w-full lg:w-auto">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                        <select 
                          value={statusFilter}
                          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 w-full lg:w-32 cursor-pointer shadow-2xs"
                        >
                          <option value="All">All</option>
                          <option value="Due Soon">Due Soon</option>
                          <option value="Lodged">Lodged</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 w-full lg:w-auto lg:ml-auto pt-1 lg:pt-0">
                        <button 
                          onClick={() => {
                            setStatusFilter('All');
                            setFinancialYear('FY 2025/26');
                            setToastMessage('Filters reset to default');
                            setTimeout(() => setToastMessage(null), 3000);
                          }}
                          className="flex-1 lg:flex-none h-9 flex items-center justify-center gap-1.5 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Filter size={13} className="text-slate-500" /> Filters
                        </button>
                        <button 
                          onClick={handleExportCSV}
                          className="flex-1 lg:flex-none h-9 flex items-center justify-center gap-1.5 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Download size={13} className="text-slate-500" /> Export
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto bg-white rounded-lg border border-slate-100 w-full">
                    <table className="min-w-[850px] w-full text-left border-collapse whitespace-nowrap">
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
                        {paginatedData.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="px-6 py-12 text-center text-slate-500 text-sm font-medium">No obligations found for this criteria.</td>
                          </tr>
                        ) : (
                          paginatedData.map(ob => (
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
                              <td className="px-3 py-3 text-center relative">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button 
                                    onClick={() => {
                                      if (ob.action === 'Prepare') {
                                        setPreparingBas(ob);
                                      } else {
                                        setViewingLodgement(ob);
                                      }
                                    }}
                                    className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${ob.action === 'Prepare' ? 'border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100' : 'border-slate-200 text-blue-600 hover:bg-slate-50'}`}
                                  >
                                    {ob.action}
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveActionMenuId(activeActionMenuId === ob.id ? null : ob.id);
                                    }}
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 cursor-pointer"
                                  >
                                    <MoreVertical size={14}/>
                                  </button>

                                  {/* Dropdown Menu */}
                                  {activeActionMenuId === ob.id && (
                                    <div 
                                      className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 z-[999] py-1 text-left animate-fadeIn"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button 
                                        onClick={() => {
                                          setViewingLodgement(ob);
                                          setActiveActionMenuId(null);
                                        }}
                                        className="w-full px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                                      >
                                        <FileText size={13} className="text-blue-500" /> View BAS Summary
                                      </button>
                                      
                                      <button 
                                        onClick={() => {
                                          setIsRecordPaymentModalOpen(true);
                                          setActiveActionMenuId(null);
                                        }}
                                        className="w-full px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                                      >
                                        <DollarSign size={13} className="text-emerald-500" /> Record GST Payment
                                      </button>

                                      <div className="border-t border-slate-100 my-1"></div>

                                      <button 
                                        onClick={() => {
                                          setAllObligations(prev => prev.map(item => item.id === ob.id ? { ...item, status: 'Lodged', lodgedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), action: 'View' } : item));
                                          setActiveActionMenuId(null);
                                          setToastMessage(`BAS Period ${ob.period} marked as Lodged!`);
                                          setTimeout(() => setToastMessage(null), 3500);
                                        }}
                                        className="w-full px-3 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                                      >
                                        <CheckCircle size={13} className="text-blue-600" /> Mark as Lodged
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: PAYG WITHHOLDING */}
              {activeTab === 'PAYG Withholding' && (
                <div className="p-3.5 sm:p-6">
                  {/* Filters Row */}
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:flex lg:flex-wrap items-end gap-3 sm:gap-4 w-full lg:w-auto">
                      <div className="flex flex-col gap-1 w-full lg:w-auto">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Financial Year</label>
                        <select 
                          value={financialYear}
                          onChange={(e) => { setFinancialYear(e.target.value); setCurrentPage(1); }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 w-full lg:w-36 cursor-pointer shadow-2xs"
                        >
                          <option value="FY 2025/26">FY 2025/26</option>
                          <option value="FY 2024/25">FY 2024/25</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col gap-1 w-full lg:w-auto">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Remittance Status</label>
                        <select 
                          value={paygStatusFilter}
                          onChange={(e) => { setPaygStatusFilter(e.target.value); setCurrentPage(1); }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 w-full lg:w-32 cursor-pointer shadow-2xs"
                        >
                          <option value="All">All</option>
                          <option value="Due Soon">Due Soon</option>
                          <option value="Lodged">Lodged</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto pt-1 lg:pt-0">
                      <button 
                        onClick={() => setIsPaygPaymentModalOpen(true)}
                        className="flex-1 lg:flex-none h-9 flex items-center justify-center gap-1.5 px-3.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
                      >
                        <DollarSign size={13} /> Record PAYG Remittance
                      </button>
                      <button 
                        onClick={handleExportCSV}
                        className="flex-1 lg:flex-none h-9 flex items-center justify-center gap-1.5 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Download size={13} className="text-slate-500" /> Export
                      </button>
                    </div>
                  </div>

                  {/* PAYG Table */}
                  <div className="overflow-x-auto bg-white rounded-lg border border-slate-100 w-full">
                    <table className="min-w-[850px] w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payroll Period</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Gross Wages</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">PAYG Withheld</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Active Employees</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Remittance Due</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Payment Date</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedData.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="px-6 py-12 text-center text-slate-500 text-sm font-medium">No PAYG records found.</td>
                          </tr>
                        ) : (
                          paginatedData.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 text-xs font-bold text-slate-900">{p.period}</td>
                              <td className="px-4 py-3 text-xs font-semibold text-slate-700 text-right">{formatCurrency(p.grossWages)}</td>
                              <td className="px-4 py-3 text-xs font-bold text-slate-900 text-right">{formatCurrency(p.paygWithheld)}</td>
                              <td className="px-4 py-3 text-xs font-medium text-slate-600 text-center">{p.employeesCount} staff</td>
                              <td className="px-4 py-3 text-xs font-medium text-slate-600">{p.dueDate}</td>
                              <td className="px-4 py-3 text-center"><StatusBadge status={p.status} /></td>
                              <td className="px-4 py-3 text-xs font-medium text-slate-500 text-center">{p.paymentDate}</td>
                              <td className="px-4 py-3 text-center">
                                <button 
                                  onClick={() => {
                                    if (p.status === 'Due Soon') {
                                      setIsPaygPaymentModalOpen(true);
                                    } else {
                                      setToastMessage(`PAYG Remittance for ${p.period} verified with ATO`);
                                      setTimeout(() => setToastMessage(null), 3000);
                                    }
                                  }}
                                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded text-xs font-bold text-blue-600 transition-colors cursor-pointer"
                                >
                                  {p.status === 'Due Soon' ? 'Pay ATO' : 'View Receipt'}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: ACTIVITY HISTORY */}
              {activeTab === 'Activity History' && (
                <div className="p-4 sm:p-6">
                  {/* Search Bar & Export */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-6">
                    <div className="relative w-full sm:w-80">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Search activity event, user, reference..."
                        value={activitySearch}
                        onChange={(e) => { setActivitySearch(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:bg-white focus:border-blue-500"
                      />
                    </div>
                    <button 
                      onClick={handleExportCSV}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                    >
                      <Download size={14} className="text-slate-500" /> Export Activity Log
                    </button>
                  </div>

                  {/* Activity History Table */}
                  <div className="overflow-x-auto bg-white rounded-lg border border-slate-100 w-full">
                    <table className="min-w-[850px] w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event / Action</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Performed By</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reference ID</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedData.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-6 py-12 text-center text-slate-500 text-sm font-medium">No activity log found.</td>
                          </tr>
                        ) : (
                          paginatedData.map(act => (
                            <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 text-xs font-semibold text-slate-500">{act.timestamp}</td>
                              <td className="px-4 py-3 text-xs font-bold text-slate-900">{act.event}</td>
                              <td className="px-4 py-3 text-xs font-medium text-slate-600">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">{act.type}</span>
                              </td>
                              <td className="px-4 py-3 text-xs font-bold text-slate-900 text-right">{formatCurrency(act.amount)}</td>
                              <td className="px-4 py-3 text-xs font-medium text-slate-700">{act.user}</td>
                              <td className="px-4 py-3 text-xs font-mono text-slate-600">{act.ref}</td>
                              <td className="px-4 py-3 text-center"><StatusBadge status={act.status} /></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* Pagination Controls */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/60 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <span className="text-xs text-slate-500 font-medium">
                Showing {currentTabRecordsCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, currentTabRecordsCount)} of {currentTabRecordsCount} records
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50 cursor-pointer'}`}
                >
                  <ChevronLeft size={16}/>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-semibold text-sm">{currentPage}</button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white ${currentPage === totalPages || totalPages === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50 cursor-pointer'}`}
                >
                  <ChevronRight size={16}/>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                </select>
              </div>
            </div>

          </div>

          {/* Summary & Cash Flow Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GST Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-900">GST Summary ({financialYear})</h3>
                <button 
                  onClick={() => {
                    setToastMessage('Exporting detailed GST summary report...');
                    setTimeout(() => setToastMessage(null), 3000);
                  }} 
                  className="text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View report <ChevronRight size={10}/>
                </button>
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
                <button 
                  onClick={() => {
                    setToastMessage('Exporting cash flow projection breakdown...');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="text-[10px] text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View report <ChevronRight size={10}/>
                </button>
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
                <button 
                  onClick={() => setPreparingBas(allObligations[0])}
                  className="w-full h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  Prepare BAS
                </button>
                <button 
                  onClick={() => {
                    setToastMessage('Connecting to ATO Standard Business Reporting (SBR) portal...');
                    setTimeout(() => {
                      setToastMessage('BAS & PAYG statement submitted to ATO successfully!');
                      setTimeout(() => setToastMessage(null), 3500);
                    }, 1500);
                  }}
                  className="w-full h-9 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <Send size={14} className="text-slate-400"/> Lodge with ATO
                </button>
                <button 
                  onClick={() => setIsRecordPaymentModalOpen(true)}
                  className="w-full h-9 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <CheckCircle size={14} className="text-slate-400"/> Record GST Payment
                </button>
                <button 
                  onClick={() => setIsPaygPaymentModalOpen(true)}
                  className="w-full h-9 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <CheckCircle size={14} className="text-slate-400"/> PAYG Payment
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ============================================================
         MODAL 1: PREPARE BAS RETURN
         ============================================================ */}
      {preparingBas && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-fadeIn text-left">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Prepare BAS Return</h3>
                  <p className="text-[11px] text-slate-400">Business Activity Statement for {preparingBas.period}</p>
                </div>
              </div>
              <button onClick={() => setPreparingBas(null)} className="p-1 text-slate-400 hover:text-white rounded">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">BAS Period:</span>
                  <span className="font-bold text-slate-900">{preparingBas.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Period End:</span>
                  <span className="font-bold text-slate-900">{preparingBas.periodEnd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Due Date:</span>
                  <span className="font-bold text-amber-600">{preparingBas.dueDate}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">G1: Total Sales (Inc GST)</span>
                  <span className="font-bold text-slate-900">$271,480.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">1A: GST Collected</span>
                  <span className="font-bold text-slate-900">{formatCurrency(preparingBas.collected)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">1B: GST Credits on Purchases</span>
                  <span className="font-bold text-slate-900">{formatCurrency(preparingBas.credits)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-black text-sm text-blue-900">
                  <span>Net GST Payable (1A - 1B)</span>
                  <span className="text-blue-600 text-base">{formatCurrency(preparingBas.net)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setPreparingBas(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setAllObligations(prev => prev.map(item => item.id === preparingBas.id ? { ...item, status: 'Lodged', lodgedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), action: 'View' } : item));
                    setPreparingBas(null);
                    setToastMessage(`BAS for ${preparingBas.period} successfully prepared and lodged with ATO!`);
                    setTimeout(() => setToastMessage(null), 3500);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  <CheckCircle size={14} /> Submit & Lodge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
         MODAL 2: VIEW LODGEMENT SUMMARY
         ============================================================ */}
      {viewingLodgement && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-fadeIn text-left">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">BAS Lodgement Receipt</h3>
                  <p className="text-[11px] text-slate-400">Verified ATO Lodgement for {viewingLodgement.period}</p>
                </div>
              </div>
              <button onClick={() => setViewingLodgement(null)} className="p-1 text-slate-400 hover:text-white rounded">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase block">ATO Reference</span>
                  <p className="font-mono font-bold text-slate-900 text-xs">ATO-BAS-{viewingLodgement.id}847291</p>
                </div>
                <StatusBadge status={viewingLodgement.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Lodgement Date</span>
                  <p className="font-bold text-slate-900">{viewingLodgement.lodgedDate}</p>
                </div>
                <div className="p-3 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Period Ended</span>
                  <p className="font-bold text-slate-900">{viewingLodgement.periodEnd}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">GST Collected:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(viewingLodgement.collected)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">GST Input Credits:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(viewingLodgement.credits)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-black text-slate-900">
                  <span className="text-slate-900">Net Remitted:</span>
                  <span className="text-emerald-600 text-base">{formatCurrency(viewingLodgement.net)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button 
                  onClick={() => setViewingLodgement(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
         MODAL 3: RECORD GST PAYMENT
         ============================================================ */}
      {isRecordPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-fadeIn text-left">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 rounded-xl">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Record GST Payment</h3>
                  <p className="text-[11px] text-slate-400">Record GST liability payment remitted to ATO</p>
                </div>
              </div>
              <button onClick={() => setIsRecordPaymentModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setIsRecordPaymentModalOpen(false);
              setToastMessage(`GST Payment of $${paymentForm.amount} recorded successfully!`);
              setActivityLogs(prev => [
                { id: `act-${Date.now()}`, timestamp: 'Just now', event: 'GST Payment Remitted', type: 'GST Payment', amount: parseFloat(paymentForm.amount), user: 'Accounts Admin', ref: paymentForm.reference, status: 'Completed' },
                ...prev
              ]);
              setTimeout(() => setToastMessage(null), 3500);
            }} className="p-6 space-y-4 text-xs font-medium text-slate-700">
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-800 block">Payment Amount ($) *</label>
                <input 
                  type="number"
                  step="0.01"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Payment Reference</label>
                  <input 
                    type="text"
                    value={paymentForm.reference}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, reference: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Payment Date</label>
                  <input 
                    type="date"
                    value={paymentForm.paymentDate}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-800 block">Payment Method</label>
                <select 
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                >
                  <option value="Electronic Funds Transfer (EFT)">Electronic Funds Transfer (EFT)</option>
                  <option value="BPAY">BPAY</option>
                  <option value="Direct Debit">Direct Debit</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsRecordPaymentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Save Payment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================================================
         MODAL 4: RECORD PAYG PAYMENT
         ============================================================ */}
      {isPaygPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-fadeIn text-left">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Record PAYG Remittance</h3>
                  <p className="text-[11px] text-slate-400">Record payroll tax withheld remitted to ATO</p>
                </div>
              </div>
              <button onClick={() => setIsPaygPaymentModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setIsPaygPaymentModalOpen(false);
              setToastMessage(`PAYG Remittance of $${paygPaymentForm.amount} recorded successfully!`);
              setActivityLogs(prev => [
                { id: `act-${Date.now()}`, timestamp: 'Just now', event: 'PAYG Remittance Recorded', type: 'PAYG Remittance', amount: parseFloat(paygPaymentForm.amount), user: 'Accounts Admin', ref: paygPaymentForm.reference, status: 'Completed' },
                ...prev
              ]);
              setTimeout(() => setToastMessage(null), 3500);
            }} className="p-6 space-y-4 text-xs font-medium text-slate-700">
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-800 block">PAYG Remittance Amount ($) *</label>
                <input 
                  type="number"
                  step="0.01"
                  required
                  value={paygPaymentForm.amount}
                  onChange={(e) => setPaygPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Payment Reference</label>
                  <input 
                    type="text"
                    value={paygPaymentForm.reference}
                    onChange={(e) => setPaygPaymentForm(prev => ({ ...prev, reference: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Payment Date</label>
                  <input 
                    type="date"
                    value={paygPaymentForm.paymentDate}
                    onChange={(e) => setPaygPaymentForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-800 block">Payment Method</label>
                <select 
                  value={paygPaymentForm.paymentMethod}
                  onChange={(e) => setPaygPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                >
                  <option value="Direct Debit">Direct Debit</option>
                  <option value="Electronic Funds Transfer (EFT)">Electronic Funds Transfer (EFT)</option>
                  <option value="BPAY">BPAY</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsPaygPaymentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Save Remittance
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
