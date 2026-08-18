import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  FileText, FileCheck, Send, CheckCircle2, Clock, Users, CreditCard, Percent,
  TrendingUp, TrendingDown, Calendar, ChevronDown, ArrowRight, Fuel, Wrench,
  Receipt, Folder, File, Bell, RefreshCw
} from 'lucide-react';

const AccountsDashboard = () => {
  const [dateRange, setDateRange] = useState('This Month');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live KPI Data State
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      draftInvoicesCount: 0,
      draftInvoicesAmount: 0.00,
      inReviewCount: 0,
      sentInvoicesCount: 0,
      paidInvoicesCount: 0,
      overdueInvoicesCount: 0,
      payrollDueAmount: 0.00,
      expensesAmount: 0.00,
      grossMarginPct: 0.0
    },
    invoiceStatusOverview: [
      { name: 'Paid', value: 0, color: '#10B981' },
      { name: 'Sent', value: 0, color: '#3B82F6' },
      { name: 'In Review', value: 0, color: '#F59E0B' },
      { name: 'Overdue', value: 0, color: '#EF4444' }
    ],
    monthlyTrend: [],
    userName: 'Accounts Manager'
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [userName, setUserName] = useState('Accounts Manager');
  const [overdueInvoices, setOverdueInvoices] = useState([]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts/dashboard');
      if (res.data?.success && res.data.data) {
        setDashboardData(prev => ({
          ...prev,
          kpis: { ...prev.kpis, ...res.data.data.kpis },
          invoiceStatusOverview: res.data.data.invoiceStatusOverview || prev.invoiceStatusOverview,
          monthlyTrend: res.data.data.monthlyTrend || prev.monthlyTrend
        }));
        if (Array.isArray(res.data.data.recentActivity)) {
          setRecentActivities(res.data.data.recentActivity);
        }
      }
      const invRes = await api.get('/accounts/invoices');
      if (invRes.data?.success && Array.isArray(invRes.data.data)) {
        const overdue = invRes.data.data.filter(inv => inv.status === 'Overdue');
        setOverdueInvoices(overdue.slice(0, 3));
      }
      try {
        const profileRes = await api.get('/accounts/profile');
        if (profileRes.data?.success && profileRes.data.data?.profile) {
          setUserName(profileRes.data.data.profile.fullName || 'Accounts Manager');
        }
      } catch (profileErr) {
        console.warn('Failed to load user profile name:', profileErr);
      }
    } catch (err) {
      console.warn('Using live fallback dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAction = (message) => {
    showToast(message);
  };

  const totalInvoices = (dashboardData.kpis.draftInvoicesCount || 0) +
                        (dashboardData.kpis.inReviewCount || 0) +
                        (dashboardData.kpis.sentInvoicesCount || 0) +
                        (dashboardData.kpis.paidInvoicesCount || 0) +
                        (dashboardData.kpis.overdueInvoicesCount || 0);

  const draftPct = totalInvoices > 0 ? Math.round((dashboardData.kpis.draftInvoicesCount / totalInvoices) * 100) : 0;
  const inReviewPct = totalInvoices > 0 ? Math.round((dashboardData.kpis.inReviewCount / totalInvoices) * 100) : 0;
  const sentPct = totalInvoices > 0 ? Math.round((dashboardData.kpis.sentInvoicesCount / totalInvoices) * 100) : 0;
  const paidPct = totalInvoices > 0 ? Math.round((dashboardData.kpis.paidInvoicesCount / totalInvoices) * 100) : 0;
  const overduePct = totalInvoices > 0 ? Math.round((dashboardData.kpis.overdueInvoicesCount / totalInvoices) * 100) : 0;

  const invoiceStatusOverviewData = [
    { name: 'Draft', value: dashboardData.kpis.draftInvoicesCount || 0, color: '#3b82f6' },
    { name: 'In Review', value: dashboardData.kpis.inReviewCount || 0, color: '#f59e0b' },
    { name: 'Sent', value: dashboardData.kpis.sentInvoicesCount || 0, color: '#a855f7' },
    { name: 'Paid', value: dashboardData.kpis.paidInvoicesCount || 0, color: '#10b981' },
    { name: 'Overdue', value: dashboardData.kpis.overdueInvoicesCount || 0, color: '#ef4444' },
  ];

  const chartData = (dashboardData.monthlyTrend && dashboardData.monthlyTrend.length > 0)
    ? dashboardData.monthlyTrend.map(item => ({
        date: item.month || item.date || '',
        sent: Math.round((item.invoices || item.sent || 0) / 1000),
        paid: Math.round((item.payments || item.paid || 0) / 1000),
        rec: Math.round(((item.payments || item.paid || 0) * 0.9) / 1000)
      }))
    : [];

  return (
    <div className="p-3 sm:p-6 bg-[#f8fafc] min-h-screen font-sans text-left relative overflow-x-hidden">
      {/* Toast Notification Banner (Mobile Responsive Position) */}
      {toastMessage && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-[9999] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between sm:justify-start gap-3 text-xs font-semibold animate-in fade-in zoom-in-95 duration-200 border border-slate-700 max-w-md ml-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <Bell className="w-4 h-4 text-blue-400 shrink-0 animate-bounce" />
            <span className="truncate">{toastMessage}</span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>
      )}

      {/* ============================================================
         HEADER SECTION
         ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Accounts Dashboard</h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">
            Welcome back, {userName}! Here's your accounts overview.
          </p>
        </div>

        {/* Date Filter Dropdown Box */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => {
              setShowDateDropdown(!showDateDropdown);
              showToast('Opening date range filter options...');
            }}
            className="w-full sm:w-auto bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-600 font-medium flex items-center justify-between sm:justify-start gap-2.5 shadow-2xs cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="text-left min-w-0">
                <span className="font-extrabold text-slate-900 text-xs block truncate">{dateRange}</span>
                <span className="text-[9px] sm:text-[9.5px] text-slate-400 block font-semibold truncate">
                  Filtered by Selected Period
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          </button>

          {showDateDropdown && (
            <div className="absolute right-0 left-0 sm:left-auto mt-2 sm:w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs font-semibold animate-in fade-in zoom-in-95 duration-100">
              <div className="text-[10px] uppercase font-extrabold text-slate-400 px-3 py-1.5">Select Date Range</div>
              {[
                'This Week',
                'This Month',
                'Last Month',
                'Year to Date'
              ].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    setShowDateDropdown(false);
                    showToast(`Date range set to: ${range}`);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                    dateRange === range ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
         1. TOP KPI CARDS ROW (8 Cards Grid - Fully Mobile Responsive)
         ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
        {/* Card 1: Draft Invoices */}
        <div
          onClick={() => handleAction('Draft Invoices selected.')}
          className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 leading-tight truncate">Draft Invoices</span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mb-0.5 sm:mb-1">{dashboardData.kpis.draftInvoicesCount}</div>
            <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> Live DB
            </span>
          </div>
        </div>

        {/* Card 2: In Review */}
        <div
          onClick={() => handleAction('In Review Invoices selected.')}
          className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 leading-tight truncate">In Review</span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mb-0.5 sm:mb-1">{dashboardData.kpis.inReviewCount}</div>
            <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> Ready to Send
            </span>
          </div>
        </div>

        {/* Card 3: Sent Invoices */}
        <div
          onClick={() => handleAction('Sent Invoices selected.')}
          className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 leading-tight truncate">Sent Invoices</span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mb-0.5 sm:mb-1">{dashboardData.kpis.sentInvoicesCount}</div>
            <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> Outstanding
            </span>
          </div>
        </div>

        {/* Card 4: Paid Invoices */}
        <div
          onClick={() => handleAction('Paid Invoices selected.')}
          className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 leading-tight truncate">Paid Invoices</span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mb-0.5 sm:mb-1">{dashboardData.kpis.paidInvoicesCount}</div>
            <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> Reconciled
            </span>
          </div>
        </div>

        {/* Card 5: Overdue Invoices */}
        <div
          onClick={() => handleAction('Overdue Invoices selected.')}
          className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 leading-tight truncate">Overdue Invoices</span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mb-0.5 sm:mb-1">{dashboardData.kpis.overdueInvoicesCount}</div>
            <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-rose-600 flex items-center gap-0.5">
              <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> Follow up
            </span>
          </div>
        </div>

        {/* Card 6: Payroll Due */}
        <div
          onClick={() => handleAction('Payroll Due selected.')}
          className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-cyan-300 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 leading-tight truncate">Payroll Due</span>
          </div>
          <div>
            <div className="text-base sm:text-xl font-bold text-slate-900 mb-0.5 sm:mb-1 truncate">${(dashboardData.kpis.payrollDueAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-400 truncate block">Next run pending</span>
          </div>
        </div>

        {/* Card 7: Expenses Pending */}
        <div
          onClick={() => handleAction('Expenses Pending selected.')}
          className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 leading-tight truncate">Expenses Approved</span>
          </div>
          <div>
            <div className="text-base sm:text-xl font-bold text-slate-900 mb-0.5 sm:mb-1 truncate">${(dashboardData.kpis.expensesAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-400 truncate block">Fleet & Driver</span>
          </div>
        </div>

        {/* Card 8: Gross Margin (YTD) */}
        <div
          onClick={() => handleAction('Gross Margin YTD selected.')}
          className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Percent className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 leading-tight truncate">Gross Margin</span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mb-0.5 sm:mb-1">{dashboardData.kpis.grossMarginPct}%</div>
            <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> Target 25%+
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
         2. MIDDLE ROW 1 (3 Grid Cards - Responsive Stack)
         ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-5 sm:mb-6">
        {/* Card 1: Invoice Status Overview */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 mb-3 sm:mb-4">Invoice Status Overview</h3>
          <div className="flex flex-col xs:flex-row items-center justify-between gap-4 my-auto">
            {/* Recharts PieChart Donut */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center shrink-0">
              <PieChart width={144} height={144}>
                <Pie
                  data={invoiceStatusOverviewData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={58}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {invoiceStatusOverviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{totalInvoices}</span>
                <span className="text-[9.5px] sm:text-[10px] font-semibold text-slate-400 mt-0.5">Total Invoices</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 w-full xs:w-auto flex-1">
              <div className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => handleAction('Draft Invoices clicked! Notification triggered.')}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="font-semibold text-slate-600">Draft</span>
                </div>
                <span className="font-bold text-slate-900">{dashboardData.kpis.draftInvoicesCount} ({draftPct}%)</span>
              </div>
              <div className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => handleAction('In Review Invoices clicked! Notification triggered.')}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-semibold text-slate-600">In Review</span>
                </div>
                <span className="font-bold text-slate-900">{dashboardData.kpis.inReviewCount} ({inReviewPct}%)</span>
              </div>
              <div className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => handleAction('Sent Invoices clicked! Notification triggered.')}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                  <span className="font-semibold text-slate-600">Sent</span>
                </div>
                <span className="font-bold text-slate-900">{dashboardData.kpis.sentInvoicesCount} ({sentPct}%)</span>
              </div>
              <div className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => handleAction('Paid Invoices clicked! Notification triggered.')}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-600">Paid</span>
                </div>
                <span className="font-bold text-slate-900">{dashboardData.kpis.paidInvoicesCount} ({paidPct}%)</span>
              </div>
              <div className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => handleAction('Overdue Invoices clicked! Notification triggered.')}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span className="font-semibold text-slate-600">Overdue</span>
                </div>
                <span className="font-bold text-slate-900">{dashboardData.kpis.overdueInvoicesCount} ({overduePct}%)</span>
              </div>
            </div>
          </div>
          <div className="pt-3.5 border-t border-slate-100 mt-3 sm:mt-4">
            <button
              onClick={() => handleAction('View sent invoices clicked! Notification triggered.')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
            >
              <span>View sent invoices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Invoices & Payments Trend */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
            <h3 className="text-sm font-bold text-slate-900">Invoices &amp; Payments Trend</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[9.5px] sm:text-[10.5px] font-semibold text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-purple-500"></span> Sent</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500"></span> Paid</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-950"></span> Rec.</span>
            </div>
          </div>
          <div className="h-40 sm:h-44 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{fontSize: 9, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 9, fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`} />
                <Tooltip formatter={v => [`$${v}K`, '']} />
                <Bar dataKey="sent" fill="#a855f7" radius={[3,3,0,0]} barSize={8} />
                <Bar dataKey="paid" fill="#10b981" radius={[3,3,0,0]} barSize={8} />
                <Line type="monotone" dataKey="rec" stroke="#1e1b4b" strokeWidth={2} dot={{r:2.5, fill:'#1e1b4b'}} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-3.5 border-t border-slate-100 mt-3 sm:mt-4">
            <button
              onClick={() => handleAction('View full report clicked! Notification triggered.')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
            >
              <span>View full report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Overdue Invoices */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm font-bold text-slate-900">Overdue Invoices</h3>
            <button
              onClick={() => handleAction('View all overdue invoices clicked! Notification triggered.')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              View all
            </button>
          </div>
          <div className="space-y-2.5 sm:space-y-3 my-auto">
            {overdueInvoices.length === 0 ? (
              <div className="text-center text-slate-400 py-6 font-bold text-xs uppercase">No overdue invoices found</div>
            ) : (
              overdueInvoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => handleAction(`Invoice ${inv.id} clicked.`)}
                  className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg border-l-4 border-l-red-500 bg-slate-50/50 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-slate-900 truncate">{inv.id}</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 truncate">{inv.customer}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-900">${(inv.amount || inv.total || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    <div className="text-[9.5px] sm:text-[10px] text-slate-400 mt-0.5">Due {inv.dueDate}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="pt-3.5 border-t border-slate-100 mt-3 sm:mt-4">
            <button
              onClick={() => handleAction('View all overdue invoices clicked! Notification triggered.')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
            >
              <span>View all overdue invoices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
         3. MIDDLE ROW 2 (3 Grid Cards - Responsive Stack)
         ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-5 sm:mb-6">
        {/* Card 1: Upcoming Payroll */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm font-bold text-slate-900">Upcoming Payroll</h3>
            <button
              onClick={() => handleAction('View all upcoming payroll clicked! Notification triggered.')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              View all
            </button>
          </div>
          <div className="bg-blue-50/40 p-3 sm:p-3.5 rounded-xl border border-blue-100/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-3 sm:mb-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Payroll Date</div>
                <div className="text-xs sm:text-sm font-black text-slate-900">— <span className="text-[11px] text-slate-500 font-semibold"></span></div>
              </div>
            </div>
            <div className="sm:text-right w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-blue-100/80">
              <div className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</div>
              <div className="text-sm sm:text-base font-black text-slate-900">${(dashboardData.kpis.payrollDueAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-2">
            <div
              onClick={() => handleAction('Employees count clicked! Notification triggered.')}
              className="bg-slate-50/80 p-2.5 sm:p-3 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="text-[10px] sm:text-[10.5px] font-semibold text-slate-400">Employees</div>
              <div className="text-base sm:text-lg font-bold text-slate-900">{dashboardData.kpis.payrollDueCount || 0}</div>
            </div>
            <div
              onClick={() => handleAction('Contractors count clicked! Notification triggered.')}
              className="bg-slate-50/80 p-2.5 sm:p-3 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="text-[10px] sm:text-[10.5px] font-semibold text-slate-400">Contractors</div>
              <div className="text-base sm:text-lg font-bold text-slate-900">0</div>
            </div>
          </div>
          <div className="pt-3.5 border-t border-slate-100 mt-2">
            <button
              onClick={() => handleAction('Manage payroll clicked! Notification triggered.')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
            >
              <span>Manage payroll</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Expenses Summary */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm font-bold text-slate-900">Expenses Summary</h3>
            <button
              onClick={() => handleAction('View all expenses clicked! Notification triggered.')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              View all
            </button>
          </div>
          <div className="flex flex-col xs:flex-row items-center justify-between gap-4 my-auto">
            {/* Recharts Donut chart */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
              <PieChart width={128} height={128}>
                <Pie
                  data={[
                    { name: 'Pending', value: dashboardData.kpis.expensesPendingCount || 0 },
                    { name: 'Approved', value: dashboardData.kpis.expensesAmount ? 100 : 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={50}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#cbd5e1" />
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-sm sm:text-base font-black text-slate-900 leading-tight">${(dashboardData.kpis.expensesAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400">Approved</span>
              </div>
            </div>
            {/* List */}
            <div className="space-y-1.5 sm:space-y-2 w-full xs:w-auto flex-1">
              <div className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => handleAction('Fuel Claims clicked! Notification triggered.')}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Fuel className="w-3 h-3"/></div>
                  <span className="font-semibold text-slate-700 text-[11px] sm:text-xs">Fuel</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-[11px] sm:text-xs">$0.00</div>
                  <div className="text-[9px] sm:text-[9.5px] text-slate-400 font-medium">0 claims</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => handleAction('Maintenance Claims clicked! Notification triggered.')}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Wrench className="w-3 h-3"/></div>
                  <span className="font-semibold text-slate-700 text-[11px] sm:text-xs">Maintenance</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-[11px] sm:text-xs">$0.00</div>
                  <div className="text-[9px] sm:text-[9.5px] text-slate-400 font-medium">0 claims</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => handleAction('Tolls & Parking clicked! Notification triggered.')}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0"><Receipt className="w-3 h-3"/></div>
                  <span className="font-semibold text-slate-700 text-[11px] sm:text-xs">Tolls &amp; Parking</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-[11px] sm:text-xs">$0.00</div>
                  <div className="text-[9px] sm:text-[9.5px] text-slate-400 font-medium">0 claims</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 p-1 rounded" onClick={() => handleAction('Other Expenses clicked! Notification triggered.')}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Folder className="w-3 h-3"/></div>
                  <span className="font-semibold text-slate-700 text-[11px] sm:text-xs">Other</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-[11px] sm:text-xs">$0.00</div>
                  <div className="text-[9px] sm:text-[9.5px] text-slate-400 font-medium">0 claims</div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-3.5 border-t border-slate-100 mt-3 sm:mt-4">
            <button
              onClick={() => handleAction('Review expenses clicked! Notification triggered.')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
            >
              <span>Review expenses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Cash Flow Overview */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm font-bold text-slate-900">Cash Flow Overview</h3>
            <button
              onClick={() => handleAction('View full report clicked! Notification triggered.')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              View full report
            </button>
          </div>
          <div className="bg-slate-50/80 p-2.5 sm:p-3 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 sm:gap-3 mb-3">
            <div onClick={() => handleAction('Cash In (YTD) clicked! Notification triggered.')} className="cursor-pointer">
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 block uppercase">Cash In (YTD)</span>
              <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">$0.00</div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 mt-0.5">
                0% vs yr
              </span>
            </div>
            <div onClick={() => handleAction('Cash Out (YTD) clicked! Notification triggered.')} className="cursor-pointer">
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 block uppercase">Cash Out (YTD)</span>
              <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">$0.00</div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 mt-0.5">
                0% vs yr
              </span>
            </div>
          </div>
          <div onClick={() => handleAction('Net Cash Flow clicked! Notification triggered.')} className="bg-emerald-50/20 p-2.5 sm:p-3 rounded-xl border border-emerald-200/60 flex items-center justify-between cursor-pointer hover:bg-emerald-50/40 transition-colors">
            <div>
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 block uppercase">Net Cash Flow</span>
              <div className="text-sm sm:text-base font-bold text-emerald-600 mt-0.5">$0.00</div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 mt-0.5">
                0% vs yr
              </span>
            </div>
            {/* Exact Green Sparkline Curve */}
            <div className="w-24 sm:w-32 h-12 sm:h-14 relative shrink-0">
              <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,40 L100,40 L0,40 Z"
                  fill="url(#greenGrad)"
                />
                <path
                  d="M0,32 Q100,32 100,32"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
         4. BOTTOM ROW 3 (P&L Summary + Recent Activity)
         ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1 (2 Cols wide): Profit & Loss Summary (YTD) */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm font-bold text-slate-900">Profit &amp; Loss Summary (YTD)</h3>
            <button
              onClick={() => handleAction('View full P&L clicked! Notification triggered.')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              View full P&amp;L
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-auto">
            <div onClick={() => handleAction('Total Revenue clicked! Notification triggered.')} className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between hover:bg-slate-100 transition-colors cursor-pointer">
              <span className="text-[9.5px] sm:text-[10.5px] font-bold text-slate-400 uppercase block mb-1 truncate">Total Revenue</span>
              <div className="text-sm sm:text-base font-bold text-slate-900 mb-1 truncate">$0.00</div>
              <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-400 flex items-center gap-0.5 truncate">
                0% vs yr
              </span>
            </div>
            <div onClick={() => handleAction('Total Cost clicked! Notification triggered.')} className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between hover:bg-slate-100 transition-colors cursor-pointer">
              <span className="text-[9.5px] sm:text-[10.5px] font-bold text-slate-400 uppercase block mb-1 truncate">Total Cost</span>
              <div className="text-sm sm:text-base font-bold text-slate-900 mb-1 truncate">$0.00</div>
              <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-400 flex items-center gap-0.5 truncate">
                0% vs yr
              </span>
            </div>
            <div onClick={() => handleAction('Gross Profit clicked! Notification triggered.')} className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between hover:bg-slate-100 transition-colors cursor-pointer">
              <span className="text-[9.5px] sm:text-[10.5px] font-bold text-slate-400 uppercase block mb-1 truncate">Gross Profit</span>
              <div className="text-sm sm:text-base font-bold text-slate-900 mb-1 truncate">$0.00</div>
              <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-400 flex items-center gap-0.5 truncate">
                0% vs yr
              </span>
            </div>
            <div onClick={() => handleAction('Gross Margin clicked! Notification triggered.')} className="p-3 sm:p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80 flex flex-col justify-between hover:bg-emerald-100/90 transition-colors cursor-pointer">
              <div>
                <span className="text-[9.5px] sm:text-[10.5px] font-bold text-emerald-800 uppercase block mb-1 truncate">Gross Margin</span>
                <div className="text-lg sm:text-xl font-black text-emerald-600 mb-1 truncate">{dashboardData.kpis.grossMarginPct || 0}%</div>
                <div className="w-full bg-emerald-200/80 rounded-full h-1.5 mb-2">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${dashboardData.kpis.grossMarginPct || 0}%` }} />
                </div>
              </div>
              <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-emerald-600 flex items-center gap-0.5 truncate">
                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> Target 25%+
              </span>
            </div>
          </div>
        </div>

        {/* Card 2 (1 Col wide): Recent Activity */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
            <button
              onClick={() => handleAction('View all recent activity clicked! Notification triggered.')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              View all
            </button>
          </div>
          <div className="space-y-3 my-auto">
            <div className="text-center text-slate-400 py-6 font-bold text-xs uppercase">No recent activity found</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsDashboard;
