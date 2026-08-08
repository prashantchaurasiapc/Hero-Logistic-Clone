import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, DollarSign, Calendar, Plus, Download, FileText, CheckCircle2,
  Clock, Search, ChevronRight, Eye, AlertCircle, ArrowUpRight, X,
  RefreshCw, Loader2, TrendingUp, Shield
} from 'lucide-react';
import api from '../../services/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `$${(parseFloat(n) || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtPeriod = (start, end) => `${fmtDate(start)} – ${fmtDate(end)}`;

const statusStyle = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'PAID':        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'PROCESSING':  return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'PENDING':     return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'DRAFT':       return 'bg-slate-100 text-slate-600 border border-slate-200';
    case 'CANCELLED':   return 'bg-red-50 text-red-700 border border-red-200';
    // Timesheet statuses
    case 'APPROVED':    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'SUBMITTED':   return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'REJECTED':    return 'bg-red-50 text-red-700 border border-red-200';
    default:            return 'bg-slate-100 text-slate-600 border border-slate-200';
  }
};
const humanStatus = (s) => (s || 'Pending Review').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// ─── Component ────────────────────────────────────────────────────────────────
export default function CompanyAdminPayroll() {
  const [activeTab, setActiveTab]       = useState('Payroll Runs');
  const [search, setSearch]             = useState('');
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  // Data from API
  const [stats, setStats]               = useState(null);
  const [payrollRuns, setPayrollRuns]   = useState([]);
  const [driverPay, setDriverPay]       = useState([]);
  const [timesheets, setTimesheets]     = useState([]);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPayRun, setSelectedPayRun]   = useState(null);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [toastMessage, setToastMessage]       = useState(null);
  const [submitting, setSubmitting]           = useState(false);

  // New Payroll Run Form
  const [newRun, setNewRun] = useState({
    name: '',
    periodStart: '',
    periodEnd: '',
    branchId: '',
    basePay: '1000',
    frequency: 'WEEKLY'
  });

  // ── Toast ────────────────────────────────────────────────────────────────────
  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Fetch main payroll data ──────────────────────────────────────────────────
  const fetchPayroll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/company-admin/payroll');
      const data = res.data?.data || res.data || {};
      setStats(data.stats || null);
      setPayrollRuns(Array.isArray(data.payrollRuns) ? data.payrollRuns : []);
      setTimesheets(Array.isArray(data.timesheets) ? data.timesheets : []);
    } catch (err) {
      console.error('Payroll fetch error:', err);
      setError(err?.response?.data?.message || 'Failed to load payroll data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch driver pay breakdown ───────────────────────────────────────────────
  const fetchDriverPay = useCallback(async (searchVal = '') => {
    try {
      const res = await api.get('/company-admin/payroll/driver-pay', {
        params: searchVal ? { search: searchVal } : {}
      });
      const arr = res.data?.data || res.data || [];
      setDriverPay(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error('Driver pay fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchPayroll();
    fetchDriverPay();
  }, [fetchPayroll, fetchDriverPay]);

  // ── Create Payroll Run ───────────────────────────────────────────────────────
  const handleCreateRun = async (e) => {
    e.preventDefault();
    if (!newRun.periodStart || !newRun.periodEnd) {
      showToast('Please fill in Pay Period Start and End dates.', true);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: newRun.name || undefined,
        periodStart: newRun.periodStart,
        periodEnd: newRun.periodEnd,
        branchId: newRun.branchId || undefined,
        basePay: parseFloat(newRun.basePay) || 1000,
        frequency: newRun.frequency
      };
      const res = await api.post('/company-admin/payroll/runs', payload);
      const created = res.data?.data || {};
      showToast(`✅ Payroll run created for ${created.driverCount || 0} drivers — Total: ${fmt(created.totalGross)}`);
      setShowCreateModal(false);
      setNewRun({ name: '', periodStart: '', periodEnd: '', branchId: '', basePay: '1000', frequency: 'WEEKLY' });
      await fetchPayroll();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to create payroll run. Please check driver records exist.';
      showToast(msg, true);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Update Status ────────────────────────────────────────────────────────────
  const handleUpdateStatus = async (runId, newStatus) => {
    try {
      await api.put(`/company-admin/payroll/runs/${runId}/status`, { status: newStatus });
      showToast(`Status updated to ${humanStatus(newStatus)}`);
      await fetchPayroll();
      setSelectedPayRun(null);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to update status.', true);
    }
  };

  // ── Export ABA ───────────────────────────────────────────────────────────────
  const handleExportABA = async () => {
    try {
      const res = await api.get('/company-admin/payroll/export');
      const { rows = [] } = res.data?.data || res.data || {};
      if (rows.length === 0) { showToast('No payroll data to export.', true); return; }

      const headers = ['Driver Code', 'Driver Name', 'Period Start', 'Period End', 'Gross Earnings', 'PAYG Tax', 'Super', 'Net Pay', 'Status'];
      const csvRows = rows.map(r =>
        [r.driverCode, r.driverName, r.periodStart, r.periodEnd,
          r.grossEarnings, r.paygTax, r.superAmount, r.netPay, r.status]
          .map(v => `"${v}"`).join(',')
      );
      const csvContent = [headers.join(','), ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Payroll_ABA_Export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Exported ${rows.length} payroll records as ABA CSV file!`);
    } catch (err) {
      showToast('Failed to export. Please try again.', true);
    }
  };

  // ── Search effect for Driver Pay tab ────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'Driver Pay Breakdown') {
      const timer = setTimeout(() => fetchDriverPay(search), 400);
      return () => clearTimeout(timer);
    }
  }, [search, activeTab, fetchDriverPay]);

  // ── Filtered data ────────────────────────────────────────────────────────────
  const filteredRuns = payrollRuns.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = `${r.driver?.firstName || ''} ${r.driver?.lastName || ''}`.toLowerCase();
    const period = fmtPeriod(r.periodStart, r.periodEnd).toLowerCase();
    return name.includes(q) || period.includes(q) || (r.driver?.driverCode || '').toLowerCase().includes(q);
  });

  const filteredTimesheets = timesheets.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return `${t.driver?.firstName || ''} ${t.driver?.lastName || ''}`.toLowerCase().includes(q);
  });

  // ── KPI cards data ───────────────────────────────────────────────────────────
  const kpiCards = [
    {
      label: 'Total Payroll MTD',
      value: stats ? fmt(stats.totalPayrollMTD) : '—',
      sub: stats ? `${stats.timesheetApprovalRate ?? 0}% timesheets approved` : 'Loading...',
      icon: DollarSign,
      color: 'indigo',
      trend: stats ? null : null
    },
    {
      label: 'Active Drivers',
      value: stats ? `${stats.activeDriversPaid} Drivers` : '—',
      sub: `In company roster`,
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Pending Pay Run',
      value: stats ? fmt(stats.pendingPayRun) : '—',
      sub: 'Awaiting approval',
      icon: Clock,
      color: 'amber'
    },
    {
      label: 'STP Payroll Status',
      value: stats?.stpStatus || '—',
      sub: 'ATO Lodgement Ready',
      icon: Shield,
      color: 'emerald',
      isGreen: true
    }
  ];

  const colorMap = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600' },
    emerald:{ bg: 'bg-emerald-50', text: 'text-emerald-600' }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fc] p-3 sm:p-6 lg:p-8 font-sans pb-24 text-slate-900 overflow-x-hidden">

      {/* Toast */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-[99999] ${toastMessage.isError ? 'bg-red-600' : 'bg-slate-900'} text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2`}>
          {toastMessage.isError
            ? <AlertCircle size={16} className="text-red-200 shrink-0" />
            : <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          }
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1 flex-wrap">
            <span>ADMIN PORTAL</span>
            <ChevronRight size={12} className="shrink-0" />
            <span className="text-slate-900 font-bold">Payroll Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5 flex-wrap">
            <Users className="text-indigo-600 shrink-0" size={26} />
            <span>Company Payroll & Driver Earnings</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed">
            Manage weekly driver payroll runs, timesheet hours, mileage allowances, payslip generation, and Single Touch Payroll (STP) compliance.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-nowrap overflow-x-auto">
          <button
            onClick={fetchPayroll}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleExportABA}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-xs hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download size={14} className="shrink-0" />
            <span>Export ABA File</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus size={16} className="shrink-0" />
            <span>Create Payroll Run</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700 font-semibold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
          <button onClick={fetchPayroll} className="ml-auto underline cursor-pointer">Retry</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const c = colorMap[card.color];
          return (
            <div key={card.label} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{card.label}</span>
                <div className={`w-8 h-8 rounded-xl ${c.bg} ${c.text} flex items-center justify-center shrink-0`}>
                  <Icon size={16} />
                </div>
              </div>
              {loading ? (
                <div className="h-7 bg-slate-100 animate-pulse rounded-lg mb-1" />
              ) : (
                <p className={`text-2xl font-black ${card.isGreen ? 'text-emerald-600' : 'text-slate-900'}`}>{card.value}</p>
              )}
              <span className={`text-[10px] font-bold mt-1 block ${card.color === 'amber' ? 'text-amber-600' : card.isGreen ? 'text-slate-500' : 'text-emerald-600'}`}>
                {card.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden mb-6">
        <div className="flex border-b border-slate-100 px-4 sm:px-6 gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap no-scrollbar">
          {['Payroll Runs', 'Driver Pay Breakdown', 'Timesheets Summary'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearch(''); }}
              className={`py-3.5 sm:py-4 text-xs font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600 font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>
          <span className="text-xs font-bold text-slate-400">
            {activeTab === 'Payroll Runs' ? `${filteredRuns.length} runs` :
             activeTab === 'Driver Pay Breakdown' ? `${driverPay.length} records` :
             `${filteredTimesheets.length} timesheets`} found
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-semibold">Loading payroll data...</span>
          </div>
        )}

        {/* Tab 1: Payroll Runs */}
        {!loading && activeTab === 'Payroll Runs' && (
          <div className="overflow-x-auto w-full">
            {filteredRuns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                <DollarSign size={32} className="text-slate-200" />
                <p className="text-sm font-bold">No payroll runs found</p>
                <p className="text-xs">Click "Create Payroll Run" to add your first pay run</p>
              </div>
            ) : (
              <table className="w-full min-w-[720px] text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Driver</th>
                    <th className="py-3.5 px-4 sm:px-6">Pay Period</th>
                    <th className="py-3.5 px-4 sm:px-6">Branch</th>
                    <th className="py-3.5 px-4 sm:px-6">Frequency</th>
                    <th className="py-3.5 px-4 sm:px-6">Gross Earnings</th>
                    <th className="py-3.5 px-4 sm:px-6">Net Pay</th>
                    <th className="py-3.5 px-4 sm:px-6">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {filteredRuns.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-black text-slate-900">
                        {row.driver ? `${row.driver.firstName} ${row.driver.lastName}` : '—'}
                        {row.driver?.driverCode && <span className="block text-[10px] text-slate-400 font-semibold">{row.driver.driverCode}</span>}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600">{fmtPeriod(row.periodStart, row.periodEnd)}</td>
                      <td className="py-4 px-4 sm:px-6 font-bold">{row.driver?.branch?.name || '—'}</td>
                      <td className="py-4 px-4 sm:px-6 font-semibold text-slate-500">{(row.frequency || '').replace(/_/g, ' ')}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono font-black text-indigo-700">{fmt(row.grossEarnings)}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-emerald-700">{fmt(row.netPay)}</td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${statusStyle(row.status)}`}>
                          {humanStatus(row.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => setSelectedPayRun(row)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Driver Pay Breakdown */}
        {!loading && activeTab === 'Driver Pay Breakdown' && (
          <div className="overflow-x-auto w-full">
            {driverPay.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                <Users size={32} className="text-slate-200" />
                <p className="text-sm font-bold">No driver pay records found</p>
                <p className="text-xs">Driver pay records appear after creating payroll runs</p>
              </div>
            ) : (
              <table className="w-full min-w-[800px] text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Driver</th>
                    <th className="py-3.5 px-4 sm:px-6">License Class</th>
                    <th className="py-3.5 px-4 sm:px-6">Pay Period</th>
                    <th className="py-3.5 px-4 sm:px-6">Base Pay</th>
                    <th className="py-3.5 px-4 sm:px-6">Allowances</th>
                    <th className="py-3.5 px-4 sm:px-6">Gross Pay</th>
                    <th className="py-3.5 px-4 sm:px-6">PAYG Tax</th>
                    <th className="py-3.5 px-4 sm:px-6">Super</th>
                    <th className="py-3.5 px-4 sm:px-6">Net Pay</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {driverPay.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-black text-slate-900">
                        {row.driver ? `${row.driver.firstName} ${row.driver.lastName}` : '—'}
                        {row.driver?.driverCode && <span className="block text-[10px] text-indigo-500 font-semibold">{row.driver.driverCode}</span>}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-bold text-slate-600">{row.driver?.licenseClass || '—'}</td>
                      <td className="py-4 px-4 sm:px-6 text-slate-500">{fmtPeriod(row.periodStart, row.periodEnd)}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono">{fmt(row.basePay)}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-emerald-600">{fmt((row.loadAllowance || 0) + (row.distanceAllow || 0) + (row.otherAllowance || 0))}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold">{fmt(row.grossEarnings)}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-red-500">{fmt(row.paygTax)}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-slate-500">{fmt(row.superAmount)}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono font-black text-indigo-700">{fmt(row.netPay)}</td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => setSelectedPayslip(row)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                          title="View Payslip"
                        >
                          <FileText size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 3: Timesheets Summary */}
        {!loading && activeTab === 'Timesheets Summary' && (
          <div className="overflow-x-auto w-full">
            {filteredTimesheets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                <Clock size={32} className="text-slate-200" />
                <p className="text-sm font-bold">No timesheets found</p>
                <p className="text-xs">Timesheets appear when drivers clock in/out</p>
              </div>
            ) : (
              <table className="w-full min-w-[720px] text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Driver</th>
                    <th className="py-3.5 px-4 sm:px-6">Date</th>
                    <th className="py-3.5 px-4 sm:px-6">Clock In</th>
                    <th className="py-3.5 px-4 sm:px-6">Clock Out</th>
                    <th className="py-3.5 px-4 sm:px-6">Work Mins</th>
                    <th className="py-3.5 px-4 sm:px-6">Overtime</th>
                    <th className="py-3.5 px-4 sm:px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {filteredTimesheets.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-black text-slate-900">
                        {row.driver ? `${row.driver.firstName} ${row.driver.lastName}` : '—'}
                        {row.driver?.driverCode && <span className="block text-[10px] text-slate-400">{row.driver.driverCode}</span>}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600">{fmtDate(row.date)}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-slate-600">{row.clockInAt ? new Date(row.clockInAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-slate-600">{row.clockOutAt ? new Date(row.clockOutAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono">{row.workMinutes ? `${Math.floor(row.workMinutes / 60)}h ${row.workMinutes % 60}m` : '—'}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-amber-600">{row.overtimeMin ? `${Math.floor(row.overtimeMin / 60)}h ${row.overtimeMin % 60}m` : '—'}</td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${statusStyle(row.status)}`}>
                          {humanStatus(row.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ── CREATE PAYROLL RUN MODAL ─────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Create New Payroll Run</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mb-4 leading-relaxed bg-indigo-50 rounded-lg px-3 py-2 border border-indigo-100">
              This will create pay period records for all active drivers in the selected branch (or all company drivers if no branch selected).
            </p>
            <form onSubmit={handleCreateRun} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600">Run Name (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Driver Payroll W30"
                  value={newRun.name}
                  onChange={e => setNewRun({ ...newRun, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600">Period Start *</label>
                  <input
                    type="date"
                    value={newRun.periodStart}
                    onChange={e => setNewRun({ ...newRun, periodStart: e.target.value })}
                    className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600">Period End *</label>
                  <input
                    type="date"
                    value={newRun.periodEnd}
                    onChange={e => setNewRun({ ...newRun, periodEnd: e.target.value })}
                    className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600">Frequency</label>
                  <select
                    value={newRun.frequency}
                    onChange={e => setNewRun({ ...newRun, frequency: e.target.value })}
                    className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-indigo-500"
                  >
                    <option value="WEEKLY">Weekly</option>
                    <option value="FORTNIGHTLY">Fortnightly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600">Base Pay / Driver ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={newRun.basePay}
                    onChange={e => setNewRun({ ...newRun, basePay: e.target.value })}
                    className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-xs hover:bg-indigo-700 cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {submitting ? 'Creating...' : 'Create Payroll Run'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PAY RUN DETAIL MODAL ─────────────────────────────────────────────── */}
      {selectedPayRun && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {selectedPayRun.driver ? `${selectedPayRun.driver.firstName} ${selectedPayRun.driver.lastName}` : 'Pay Run Details'}
                </h3>
                <p className="text-[10px] font-bold text-indigo-600">{fmtPeriod(selectedPayRun.periodStart, selectedPayRun.periodEnd)}</p>
              </div>
              <button onClick={() => setSelectedPayRun(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              {[
                ['Driver Code', selectedPayRun.driver?.driverCode || '—'],
                ['Branch', selectedPayRun.driver?.branch?.name || '—'],
                ['Frequency', (selectedPayRun.frequency || '').replace(/_/g, ' ')],
                ['Base Pay', fmt(selectedPayRun.basePay)],
                ['Gross Earnings', fmt(selectedPayRun.grossEarnings)],
                ['PAYG Tax', fmt(selectedPayRun.paygTax)],
                ['Super (11%)', fmt(selectedPayRun.superAmount)],
                ['Net Pay', fmt(selectedPayRun.netPay)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-1 border-b">
                  <span className="text-slate-500">{label}:</span>
                  <span className="font-bold">{val}</span>
                </div>
              ))}
              <div className="flex justify-between py-1.5 bg-indigo-50 px-3 rounded-lg">
                <span className="font-bold text-indigo-900">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${statusStyle(selectedPayRun.status)}`}>
                  {humanStatus(selectedPayRun.status)}
                </span>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              {selectedPayRun.status === 'DRAFT' && (
                <button
                  onClick={() => handleUpdateStatus(selectedPayRun.id, 'PROCESSING')}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold cursor-pointer text-xs hover:bg-blue-700"
                >
                  Move to Processing
                </button>
              )}
              {selectedPayRun.status === 'PROCESSING' && (
                <button
                  onClick={() => handleUpdateStatus(selectedPayRun.id, 'PAID')}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer text-xs hover:bg-emerald-700"
                >
                  Mark as Paid
                </button>
              )}
              {selectedPayRun.status === 'DRAFT' && (
                <button
                  onClick={() => handleUpdateStatus(selectedPayRun.id, 'CANCELLED')}
                  className="flex-1 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold cursor-pointer text-xs hover:bg-red-100"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => setSelectedPayRun(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PAYSLIP VIEW MODAL ───────────────────────────────────────────────── */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Payslip: {selectedPayslip.driver ? `${selectedPayslip.driver.firstName} ${selectedPayslip.driver.lastName}` : '—'}
                </h3>
                <p className="text-[10px] font-bold text-slate-500">{selectedPayslip.driver?.licenseClass || ''}</p>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              {[
                ['Pay Period', fmtPeriod(selectedPayslip.periodStart, selectedPayslip.periodEnd)],
                ['Base Pay', fmt(selectedPayslip.basePay)],
                ['Load Allowance', fmt(selectedPayslip.loadAllowance)],
                ['Distance Allowance', fmt(selectedPayslip.distanceAllow)],
                ['Other Allowances', fmt(selectedPayslip.otherAllowance)],
                ['Bonuses', fmt(selectedPayslip.bonuses)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-1 border-b">
                  <span className="text-slate-500">{label}:</span>
                  <span className="font-mono font-bold">{val}</span>
                </div>
              ))}
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">PAYG Tax:</span>
                <span className="font-mono font-bold text-red-500">-{fmt(selectedPayslip.paygTax)}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Super (11%):</span>
                <span className="font-mono font-bold text-slate-500">-{fmt(selectedPayslip.superAmount)}</span>
              </div>
              <div className="flex justify-between py-1.5 bg-indigo-50 px-3 rounded-lg">
                <span className="font-bold text-indigo-900">Net Pay:</span>
                <span className="font-mono font-black text-indigo-700">{fmt(selectedPayslip.netPay)}</span>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => {
                  const name = selectedPayslip.driver ? `${selectedPayslip.driver.firstName}_${selectedPayslip.driver.lastName}` : 'Driver';
                  showToast(`Payslip for ${name} — PDF download not yet configured`);
                  setSelectedPayslip(null);
                }}
                className="w-full py-2 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer flex items-center justify-center gap-2 text-xs hover:bg-indigo-700"
              >
                <Download size={14} /> Download PDF Payslip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
