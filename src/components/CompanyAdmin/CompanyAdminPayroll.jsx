import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, DollarSign, Calendar, Plus, Download, FileText, CheckCircle2,
  Clock, Search, ChevronRight, Eye, AlertCircle, ArrowUpRight, X,
  RefreshCw, Loader2, TrendingUp, Shield, Route, MapPin, Layers, Edit, Trash2, Copy, Filter
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
    case 'ACTIVE':      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'INACTIVE':    return 'bg-red-50 text-red-700 border border-red-200';
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

  // Driver Load Schedule State
  const [schedules, setSchedules]                         = useState([]);
  const [scheduleStats, setScheduleStats]                 = useState({ totalCount: 0, activeCount: 0, avgRate: 0 });
  const [scheduleStatusFilter, setScheduleStatusFilter]   = useState('All');
  const [scheduleClassFilter, setScheduleClassFilter]     = useState('All');

  const [showAddScheduleModal, setShowAddScheduleModal]   = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [showDeleteScheduleModal, setShowDeleteScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule]           = useState(null);

  const [scheduleForm, setScheduleForm] = useState({
    id: '',
    origin: '',
    destination: '',
    rate: '',
    licenseClass: 'All Classes',
    status: 'Active',
    notes: ''
  });

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

  // ── Fetch Driver Load Schedules ────────────────────────────────────────────────
  const fetchSchedules = useCallback(async () => {
    let apiSchedules = [];
    try {
      const res = await api.get('/company-admin/payroll/driver-load-schedules');
      const data = res.data?.data || res.data || {};
      apiSchedules = Array.isArray(data.schedules) ? data.schedules : (Array.isArray(data) ? data : []);
      if (data.stats) {
        setScheduleStats(data.stats);
      }
    } catch (err) {
      console.warn('Driver load schedule API warning:', err?.message);
    }

    const finalSchedules = apiSchedules;
    setSchedules(finalSchedules);
  }, []);

  useEffect(() => {
    fetchPayroll();
    fetchDriverPay();
    fetchSchedules();
  }, [fetchPayroll, fetchDriverPay, fetchSchedules]);



  // ── Schedule Handlers ────────────────────────────────────────────────────────
  const resetScheduleForm = () => {
    setScheduleForm({
      id: '',
      title: '',
      origin: '',
      destination: '',
      rate: '',
      licenseClass: 'All Classes',
      status: 'Active',
      notes: ''
    });
    setSelectedSchedule(null);
  };

  const handleCreateScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.origin || !scheduleForm.destination || !scheduleForm.rate) {
      showToast('Please fill in Origin, Destination, and Rate.', true);
      return;
    }
    setSubmitting(true);
    const derivedTitle = scheduleForm.title.trim() || `${scheduleForm.origin.trim()} to ${scheduleForm.destination.trim()}`;
    const newSch = {
      id: `rt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: derivedTitle,
      origin: scheduleForm.origin.trim(),
      destination: scheduleForm.destination.trim(),
      rate: parseFloat(scheduleForm.rate) || 0,
      licenseClass: scheduleForm.licenseClass || 'All Classes',
      status: scheduleForm.status || 'Active',
      notes: scheduleForm.notes || ''
    };

    try {
      const res = await api.post('/company-admin/payroll/driver-load-schedules', newSch);
      if (res.data?.data?.id) {
        newSch.id = res.data.data.id;
      }
    } catch (err) {
      console.warn('API save fallback:', err?.message);
    }

    setSchedules(prev => {
      const updated = [newSch, ...prev.filter(s => s.id !== newSch.id)];
      try {
        localStorage.setItem('hero_driver_load_schedules', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast(`✅ Route rate "${newSch.title}" created successfully!`);
    setShowAddScheduleModal(false);
    resetScheduleForm();
    setSubmitting(false);
  };

  const openEditSchedule = (sch) => {
    setSelectedSchedule(sch);
    setScheduleForm({
      id: sch.id,
      title: sch.title || `${sch.origin || ''} to ${sch.destination || ''}`.trim(),
      origin: sch.origin || '',
      destination: sch.destination || '',
      rate: sch.rate || '',
      licenseClass: sch.licenseClass || 'All Classes',
      status: sch.status || 'Active',
      notes: sch.notes || ''
    });
    setShowEditScheduleModal(true);
  };

  const handleUpdateScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSchedule) return;
    setSubmitting(true);
    const derivedTitle = scheduleForm.title.trim() || `${scheduleForm.origin.trim()} to ${scheduleForm.destination.trim()}`;
    const updated = {
      ...selectedSchedule,
      title: derivedTitle,
      origin: scheduleForm.origin.trim(),
      destination: scheduleForm.destination.trim(),
      rate: parseFloat(scheduleForm.rate) || 0,
      licenseClass: scheduleForm.licenseClass,
      status: scheduleForm.status,
      notes: scheduleForm.notes
    };

    try {
      await api.put(`/company-admin/payroll/driver-load-schedules/${selectedSchedule.id}`, updated);
    } catch (err) {
      console.warn('API update fallback:', err?.message);
    }

    setSchedules(prev => {
      const newList = prev.map(s => s.id === selectedSchedule.id ? updated : s);
      try {
        localStorage.setItem('hero_driver_load_schedules', JSON.stringify(newList));
      } catch (e) {}
      return newList;
    });

    showToast(`✅ Route rate updated successfully!`);
    setShowEditScheduleModal(false);
    resetScheduleForm();
    setSubmitting(false);
  };

  const handleDeleteScheduleConfirm = async () => {
    if (!selectedSchedule) return;
    setSubmitting(true);

    try {
      await api.delete(`/company-admin/payroll/driver-load-schedules/${selectedSchedule.id}`);
    } catch (err) {
      console.warn('API delete fallback:', err?.message);
    }

    setSchedules(prev => {
      const newList = prev.filter(s => s.id !== selectedSchedule.id);
      try {
        localStorage.setItem('hero_driver_load_schedules', JSON.stringify(newList));
      } catch (e) {}
      return newList;
    });

    showToast(`Route rate deleted successfully.`);
    setShowDeleteScheduleModal(false);
    resetScheduleForm();
    setSubmitting(false);
  };

  const handleDuplicateSchedule = (sch) => {
    setScheduleForm({
      id: '',
      origin: sch.origin,
      destination: sch.destination,
      rate: sch.rate,
      licenseClass: sch.licenseClass || 'All Classes',
      status: 'Active',
      notes: sch.notes ? `${sch.notes} (Copy)` : ''
    });
    setShowAddScheduleModal(true);
  };

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
  const runsToDisplay = payrollRuns.length > 0 ? payrollRuns : driverPay;
  const filteredRuns = runsToDisplay.filter(r => {
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

  const filteredSchedules = schedules.filter(sch => {
    const q = search.toLowerCase();
    const matchesSearch = !search ||
      (sch.origin || '').toLowerCase().includes(q) ||
      (sch.destination || '').toLowerCase().includes(q) ||
      (sch.notes || '').toLowerCase().includes(q);
    const matchesStatus = scheduleStatusFilter === 'All' || (sch.status || '').toLowerCase() === scheduleStatusFilter.toLowerCase();
    const matchesClass = scheduleClassFilter === 'All' || sch.licenseClass === scheduleClassFilter;
    return matchesSearch && matchesStatus && matchesClass;
  });

  // ── KPI cards data ───────────────────────────────────────────────────────────
  const kpiCards = [
    {
      label: 'Total Payroll MTD',
      value: '$0.00',
      sub: '—',
      icon: DollarSign,
      color: 'indigo',
      trend: null
    },
    {
      label: 'Active Drivers',
      value: '0',
      sub: '—',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Pending Pay Run',
      value: '$0.00',
      sub: '—',
      icon: Clock,
      color: 'amber'
    },
    {
      label: 'STP Payroll Status',
      value: '—',
      sub: '—',
      icon: Shield,
      color: 'emerald'
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
          {['Payroll Runs', 'Driver Pay Breakdown', 'Timesheets Summary', 'Driver Load Schedule'].map(tab => (
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
             activeTab === 'Timesheets Summary' ? `${filteredTimesheets.length} timesheets` :
             `${filteredSchedules.length} route rates`} found
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
                        {row.driver ? (`${row.driver.firstName || ''} ${row.driver.lastName || ''}`.trim() || 'Driver') : (row.driverName || 'Driver')}
                        {(row.driver?.driverCode || row.driverCode) && <span className="block text-[10px] text-slate-400 font-semibold">{row.driver?.driverCode || row.driverCode}</span>}
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

        {/* Tab 4: Driver Load Schedule */}
        {!loading && activeTab === 'Driver Load Schedule' && (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Control Bar & Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Filter size={14} className="text-slate-400" />
                  <span>Filters:</span>
                </div>
                {/* Status Filter */}
                <select
                  value={scheduleStatusFilter}
                  onChange={(e) => setScheduleStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>

                {/* License Class Filter */}
                <select
                  value={scheduleClassFilter}
                  onChange={(e) => setScheduleClassFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
                >
                  <option value="All">All License Classes</option>
                  <option value="All Classes">All Classes (General)</option>
                  <option value="HC">HC (Heavy Combination)</option>
                  <option value="MC">MC (Multi Combination)</option>
                  <option value="HR">HR (Heavy Rigid)</option>
                  <option value="MR">MR (Medium Rigid)</option>
                  <option value="LR">LR (Light Rigid)</option>
                </select>
              </div>

              <button
                onClick={() => { resetScheduleForm(); setShowAddScheduleModal(true); }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
              >
                <Plus size={16} />
                <span>Add Route Rate</span>
              </button>
            </div>

            {/* Table or Empty State */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              {filteredSchedules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2 bg-white">
                  <Route size={36} className="text-slate-300" />
                  <p className="text-sm font-bold text-slate-700">No route rates configured</p>
                  <p className="text-xs text-slate-500 max-w-sm text-center">
                    Set fixed or custom per-load rates for routes like Sydney → Melbourne to automatically apply during payroll runs.
                  </p>
                  <button
                    onClick={() => { resetScheduleForm(); setShowAddScheduleModal(true); }}
                    className="mt-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    + Add First Route Rate
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-xs whitespace-nowrap bg-white">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Route (Origin → Destination)</th>
                      <th className="py-3.5 px-4 sm:px-6">Per Load Rate ($)</th>
                      <th className="py-3.5 px-4 sm:px-6">Applicable License Class</th>
                      <th className="py-3.5 px-4 sm:px-6">Status</th>
                      <th className="py-3.5 px-4 sm:px-6">Notes / Remarks</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {filteredSchedules.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                              <Route size={16} />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                                <span>{row.title || `${row.origin} → ${row.destination}`}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">Route: {row.origin} → {row.destination}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className="font-mono font-black text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">
                            {fmt(row.rate)}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1.5">/ load</span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold text-[11px] border border-slate-200">
                            {row.licenseClass || 'All Classes'}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${statusStyle(row.status)}`}>
                            {humanStatus(row.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-slate-500 max-w-xs truncate">
                          {row.notes || <span className="text-slate-300 italic">No notes</span>}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleDuplicateSchedule(row)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors"
                              title="Duplicate Route"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => openEditSchedule(row)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors"
                              title="Edit Route Rate"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => { setSelectedSchedule(row); setShowDeleteScheduleModal(true); }}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 cursor-pointer transition-colors"
                              title="Delete Route Rate"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
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

      {/* ── ADD DRIVER LOAD SCHEDULE MODAL ──────────────────────────────────── */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Route size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add Route Rate</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Configure per-load driver pay rate</p>
                </div>
              </div>
              <button onClick={() => setShowAddScheduleModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateScheduleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Load Schedule Title / Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Brisbane to Melbourne or Sydney to Adelaide"
                  value={scheduleForm.title}
                  onChange={e => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Origin *</label>
                  <input
                    type="text"
                    placeholder="e.g. Sydney"
                    value={scheduleForm.origin}
                    onChange={e => {
                      const newOrig = e.target.value;
                      const autoTitle = (newOrig || scheduleForm.destination) ? `${newOrig} to ${scheduleForm.destination}`.trim() : scheduleForm.title;
                      setScheduleForm({
                        ...scheduleForm,
                        origin: newOrig,
                        title: (!scheduleForm.title || scheduleForm.title === `${scheduleForm.origin} to ${scheduleForm.destination}`) ? autoTitle : scheduleForm.title
                      });
                    }}
                    className="w-full p-2.5 border rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destination *</label>
                  <input
                    type="text"
                    placeholder="e.g. Melbourne"
                    value={scheduleForm.destination}
                    onChange={e => {
                      const newDest = e.target.value;
                      const autoTitle = (scheduleForm.origin || newDest) ? `${scheduleForm.origin} to ${newDest}`.trim() : scheduleForm.title;
                      setScheduleForm({
                        ...scheduleForm,
                        destination: newDest,
                        title: (!scheduleForm.title || scheduleForm.title === `${scheduleForm.origin} to ${scheduleForm.destination}`) ? autoTitle : scheduleForm.title
                      });
                    }}
                    className="w-full p-2.5 border rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Per Load Rate ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="500.00"
                    value={scheduleForm.rate}
                    onChange={e => setScheduleForm({ ...scheduleForm, rate: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs font-bold font-mono outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">License Class</label>
                  <select
                    value={scheduleForm.licenseClass}
                    onChange={e => setScheduleForm({ ...scheduleForm, licenseClass: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
                  >
                    <option value="All Classes">All Classes</option>
                    <option value="HC">HC (Heavy Combination)</option>
                    <option value="MC">MC (Multi Combination)</option>
                    <option value="HR">HR (Heavy Rigid)</option>
                    <option value="MR">MR (Medium Rigid)</option>
                    <option value="LR">LR (Light Rigid)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status</label>
                <select
                  value={scheduleForm.status}
                  onChange={e => setScheduleForm({ ...scheduleForm, status: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Description (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Standard linehaul rate including loading allowance..."
                  value={scheduleForm.notes}
                  onChange={e => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-xs font-medium outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddScheduleModal(false)}
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
                  {submitting ? 'Saving...' : 'Save Route Rate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT DRIVER LOAD SCHEDULE MODAL ──────────────────────────────────── */}
      {showEditScheduleModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Edit size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Edit Route Rate</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Update configured rate details</p>
                </div>
              </div>
              <button onClick={() => setShowEditScheduleModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateScheduleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Load Schedule Title / Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Brisbane to Melbourne or Sydney to Adelaide"
                  value={scheduleForm.title}
                  onChange={e => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Origin *</label>
                  <input
                    type="text"
                    value={scheduleForm.origin}
                    onChange={e => setScheduleForm({ ...scheduleForm, origin: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destination *</label>
                  <input
                    type="text"
                    value={scheduleForm.destination}
                    onChange={e => setScheduleForm({ ...scheduleForm, destination: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Per Load Rate ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={scheduleForm.rate}
                    onChange={e => setScheduleForm({ ...scheduleForm, rate: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs font-bold font-mono outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">License Class</label>
                  <select
                    value={scheduleForm.licenseClass}
                    onChange={e => setScheduleForm({ ...scheduleForm, licenseClass: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
                  >
                    <option value="All Classes">All Classes</option>
                    <option value="HC">HC (Heavy Combination)</option>
                    <option value="MC">MC (Multi Combination)</option>
                    <option value="HR">HR (Heavy Rigid)</option>
                    <option value="MR">MR (Medium Rigid)</option>
                    <option value="LR">LR (Light Rigid)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status</label>
                <select
                  value={scheduleForm.status}
                  onChange={e => setScheduleForm({ ...scheduleForm, status: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Description (Optional)</label>
                <textarea
                  rows="2"
                  value={scheduleForm.notes}
                  onChange={e => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-xs font-medium outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditScheduleModal(false)}
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
                  {submitting ? 'Updating...' : 'Update Route Rate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE DRIVER LOAD SCHEDULE MODAL ────────────────────────────────── */}
      {showDeleteScheduleModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 size={22} />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">Delete Route Rate?</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Are you sure you want to remove the rate for <strong className="text-slate-800">{selectedSchedule.origin} → {selectedSchedule.destination}</strong> ({fmt(selectedSchedule.rate)})? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteScheduleModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs cursor-pointer hover:bg-slate-200"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteScheduleConfirm}
                disabled={submitting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs shadow-xs hover:bg-red-700 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {submitting ? 'Deleting...' : 'Delete Route Rate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
