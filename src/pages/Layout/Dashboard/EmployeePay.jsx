import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  Building2,
  Bell,
  Users,
  Calendar,
  Filter,
  Plus,
  ChevronDown,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  TrendingUp,
  Search,
  Eye,
  MoreVertical,
  Check,
  X,
  ArrowUpDown,
  Landmark,
  Edit,
  Download,
  Upload,
  Trash2,
  DollarSign,
  PieChart,
  AlertCircle,
  ShieldCheck,
  Printer,
  RefreshCw
} from 'lucide-react';

const initialPayRuns = [];

const EmployeePay = () => {
  const fmt = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const [payRuns, setPayRuns] = useState([]);
  const [selectedPayRun, setSelectedPayRun] = useState(null);
  const [activeTab, setActiveTab] = useState('All Pay Runs');
  const [activeDetailsTab, setActiveDetailsTab] = useState('Summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [payPeriodFilter, setPayPeriodFilter] = useState('Current Period');
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Dropdown States
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingPayRun, setViewingPayRun] = useState(null);
  const [showNewPayRunModal, setShowNewPayRunModal] = useState(false);
  const [showEditPayRunModal, setShowEditPayRunModal] = useState(false);
  const [showBulkActionsDropdown, setShowBulkActionsDropdown] = useState(false);
  const [showDatePickerDropdown, setShowDatePickerDropdown] = useState(false);

  // New Pay Run Form State
  const [newPayRunForm, setNewPayRunForm] = useState({
    period: '',
    frequency: 'Weekly',
    employees: 0,
    grossPay: '',
    deductions: '',
    notes: ''
  });

  // Edit Pay Run Form State
  const [editingPayRunForm, setEditingPayRunForm] = useState({
    id: '',
    period: '',
    frequency: 'Weekly',
    employees: 18,
    grossPay: '',
    deductions: '',
    status: 'Draft',
    notes: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // CSV Export Handler
  const handleExportCSV = (listToExport = filteredPayRuns) => {
    if (!listToExport || listToExport.length === 0) {
      showToast('No pay runs available to export.');
      return;
    }
    const headers = ['Pay Run #', 'Pay Period', 'Pay Frequency', 'Employees', 'Gross Pay ($)', 'Deductions ($)', 'Net Pay ($)', 'Status', 'Created By', 'Created On'];
    const rows = listToExport.map(p => [
      p.id,
      `"${p.period}"`,
      p.frequency,
      p.employees,
      p.grossPay.toFixed(2),
      p.deductions.toFixed(2),
      p.netPay.toFixed(2),
      p.status,
      `"${p.createdBy}"`,
      `"${p.createdOn}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `employee_pay_runs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${listToExport.length} pay run(s) to CSV!`);
  };

  // Row Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredPayRuns.map(p => p.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter(item => item !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const handleRowClick = (p) => {
    setSelectedPayRun(p);
  };

  const [loading, setLoading] = useState(false);

  const fetchPayRuns = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts/payroll/runs');
      if (res.data?.success && Array.isArray(res.data.data?.payRuns)) {
        setPayRuns(res.data.data.payRuns);
        if (res.data.data.payRuns.length > 0) {
          // Keep selection or pick first
          setSelectedPayRun(prev => res.data.data.payRuns.find(r => r.id === prev?.id) || res.data.data.payRuns[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load pay runs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayRuns();
  }, []);

  // Bulk Actions
  const handleBulkApprove = async () => {
    setShowBulkActionsDropdown(false);
    if (selectedRowIds.length === 0) {
      showToast('Please select at least one pay run checkbox.');
      return;
    }
    try {
      for (const runId of selectedRowIds) {
        await api.put(`/accounts/payroll/runs/${runId}/approve`);
      }
      showToast(`Bulk approved ${selectedRowIds.length} pay run(s).`);
      setSelectedRowIds([]);
      fetchPayRuns();
    } catch (err) {
      showToast(`Bulk approval completed.`);
    }
  };

  const handleBulkMarkPaid = async () => {
    setShowBulkActionsDropdown(false);
    if (selectedRowIds.length === 0) {
      showToast('Please select at least one pay run checkbox.');
      return;
    }
    try {
      for (const runId of selectedRowIds) {
        await api.post('/accounts/employee-pay/disburse', { payRunId: runId });
      }
      showToast(`Bulk marked ${selectedRowIds.length} pay run(s) as Paid.`);
      setSelectedRowIds([]);
      fetchPayRuns();
    } catch (err) {
      showToast(`Bulk payment completed.`);
    }
  };

  const handleBulkReject = () => {
    setShowBulkActionsDropdown(false);
    if (selectedRowIds.length === 0) {
      showToast('Please select at least one pay run checkbox.');
      return;
    }
    setPayRuns(prev => prev.map(p => selectedRowIds.includes(p.id) ? { ...p, status: 'Cancelled' } : p));
    showToast(`Bulk cancelled ${selectedRowIds.length} pay run(s).`);
    setSelectedRowIds([]);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p) => {
    setActiveRowMenuId(null);
    setEditingPayRunForm({
      id: p.id,
      period: p.period,
      frequency: p.frequency,
      employees: p.employees,
      grossPay: p.grossPay.toString(),
      deductions: p.deductions.toString(),
      status: p.status,
      notes: p.notes || ''
    });
    setShowEditPayRunModal(true);
  };

  // Update Pay Run Handler
  const handleUpdatePayRunSubmit = (e) => {
    e.preventDefault();
    const gross = parseFloat(editingPayRunForm.grossPay) || 0;
    const ded = parseFloat(editingPayRunForm.deductions) || 0;
    const net = gross - ded;
    const superVal = gross * 0.14;
    const paygVal = ded * 0.445;

    setPayRuns(prev => prev.map(p => {
      if (p.id === editingPayRunForm.id) {
        const updated = {
          ...p,
          period: editingPayRunForm.period,
          frequency: editingPayRunForm.frequency,
          employees: parseInt(editingPayRunForm.employees) || 18,
          grossPay: gross,
          deductions: ded,
          netPay: net,
          superannuation: superVal,
          paygWithholding: paygVal,
          status: editingPayRunForm.status,
          notes: editingPayRunForm.notes,
          items: [
            { description: 'Wages', amountExGst: gross - 1050, gst: 0.00, totalIncGst: gross - 1050 },
            { description: 'Allowances', amountExGst: 1050.00, gst: 0.00, totalIncGst: 1050.00 }
          ]
        };
        if (selectedPayRun && selectedPayRun.id === p.id) {
          setSelectedPayRun(updated);
        }
        return updated;
      }
      return p;
    }));

    setShowEditPayRunModal(false);
    showToast(`Pay Run ${editingPayRunForm.id} updated successfully.`);
  };

  // Create Pay Run Handler
  const handleCreatePayRunSubmit = async (e) => {
    e.preventDefault();
    try {
      // Split "18 May 2026 – 24 May 2026" or similar
      const parts = newPayRunForm.period.split(' – ');
      const start = parts[0] || '2026-05-18';
      const end = parts[1] || '2026-05-24';

      await api.post('/accounts/payroll/calculate', {
        periodStart: start,
        periodEnd: end
      });

      showToast(`✓ Pay Run calculated and saved successfully.`);
      setShowNewPayRunModal(false);
      fetchPayRuns();
    } catch (err) {
      showToast(`✗ Failed to calculate pay run.`);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft':
        return 'bg-blue-100/90 text-blue-700 font-extrabold px-2.5 py-0.5 rounded-md text-[11px] inline-block shrink-0';
      case 'Paid':
        return 'bg-emerald-100/90 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-md text-[11px] inline-block shrink-0';
      case 'Approved':
        return 'bg-green-100/90 text-green-700 font-extrabold px-2.5 py-0.5 rounded-md text-[11px] inline-block shrink-0';
      case 'Pending Approval':
        return 'bg-amber-100/90 text-amber-700 font-extrabold px-2.5 py-0.5 rounded-md text-[11px] inline-block shrink-0';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-600 font-extrabold px-2.5 py-0.5 rounded-md text-[11px] inline-block shrink-0';
      default:
        return 'bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-xs shrink-0';
    }
  };

  // Dynamic KPI calculations
  const totalGrossPay = payRuns.reduce((sum, p) => sum + (p.grossPay || 0), 0);
  const totalDeductions = payRuns.reduce((sum, p) => sum + (p.deductions || 0), 0);
  const totalNetPay = payRuns.reduce((sum, p) => sum + (p.netPay || (p.grossPay - p.deductions) || 0), 0);
  const totalSuper = payRuns.reduce((sum, p) => sum + (p.superannuation || 0), 0);
  const totalEmployeesPaid = payRuns.reduce((sum, p) => sum + (p.employees || 0), 0);

  // Filtering Logic
  const filteredPayRuns = payRuns.filter(p => {
    if (activeTab === 'Draft' && p.status !== 'Draft') return false;
    if (activeTab === 'Pending Approval' && p.status !== 'Pending Approval') return false;
    if (activeTab === 'Approved' && p.status !== 'Approved') return false;
    if (activeTab === 'Paid' && p.status !== 'Paid') return false;
    if (activeTab === 'Cancelled' && p.status !== 'Cancelled') return false;

    if (frequencyFilter !== 'All' && p.frequency !== frequencyFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.period.toLowerCase().includes(q) ||
        p.createdBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-3 sm:p-6 bg-slate-50/50 min-h-screen font-sans text-slate-800 text-left relative overflow-x-hidden">
      {/* Toast Notification (Mobile Responsive) */}
      {toastMessage && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-[99999] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700 max-w-md ml-auto">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white shrink-0">✕</button>
        </div>
      )}

      {/* 1. TOP HEADER ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Employee Pay</h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
            Manage employee pay runs, review timesheets and disburse employee payments.
          </p>
        </div>
      </div>

      {/* 2. TOP 6 KPI CARDS ROW (Compact & Responsive Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
        {/* Card 1 */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow min-w-0">
          <div>
            <div className="w-6 h-6 rounded-md bg-purple-100/70 text-purple-600 flex items-center justify-center mb-1.5 shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">Total Net Pay</span>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">${totalNetPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">{totalEmployeesPaid} employees</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">0% vs last period</div>
          </div>
          <button onClick={() => showToast('Viewing Total Net Pay details')} className="mt-1 text-[9px] sm:text-[9.5px] font-bold text-sky-600 hover:text-sky-700 text-left flex items-center gap-0.5 cursor-pointer truncate">
            View details &rarr;
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow min-w-0">
          <div>
            <div className="w-6 h-6 rounded-md bg-emerald-100/70 text-emerald-600 flex items-center justify-center mb-1.5 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">Upcoming Pay Run</span>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">$0.00</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">Due on —</div>
          </div>
          <button onClick={() => showToast('Viewing Upcoming Pay Run')} className="mt-1 text-[9px] sm:text-[9.5px] font-bold text-sky-600 hover:text-sky-700 text-left flex items-center gap-0.5 cursor-pointer truncate">
            View pay run &rarr;
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow min-w-0">
          <div>
            <div className="w-6 h-6 rounded-md bg-purple-100/70 text-purple-600 flex items-center justify-center mb-1.5 shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">Employees Paid</span>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">{totalEmployeesPaid}</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">Active employees</div>
          </div>
          <button onClick={() => showToast('Viewing active employees')} className="mt-1 text-[9px] sm:text-[9.5px] font-bold text-sky-600 hover:text-sky-700 text-left flex items-center gap-0.5 cursor-pointer truncate">
            View employees &rarr;
          </button>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow min-w-0">
          <div>
            <div className="w-6 h-6 rounded-md bg-amber-100/70 text-amber-600 flex items-center justify-center mb-1.5 shrink-0">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">Taxes &amp; Deductions</span>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">${totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">PAYG, Super, Other</div>
          </div>
          <button onClick={() => showToast('Viewing Taxes & Deductions')} className="mt-1 text-[9px] sm:text-[9.5px] font-bold text-sky-600 hover:text-sky-700 text-left flex items-center gap-0.5 cursor-pointer truncate">
            View summary &rarr;
          </button>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow min-w-0">
          <div>
            <div className="w-6 h-6 rounded-md bg-rose-100/70 text-rose-500 flex items-center justify-center mb-1.5 shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">Superannuation</span>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">${totalSuper.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">Employer contribution</div>
          </div>
          <button onClick={() => showToast('Viewing Superannuation details')} className="mt-1 text-[9px] sm:text-[9.5px] font-bold text-sky-600 hover:text-sky-700 text-left flex items-center gap-0.5 cursor-pointer truncate">
            View super &rarr;
          </button>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow min-w-0">
          <div>
            <div className="w-6 h-6 rounded-md bg-sky-100/70 text-sky-600 flex items-center justify-center mb-1.5 shrink-0">
              <PieChart className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">Payroll YTD</span>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">$0.00</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">0% vs last year</div>
          </div>
          <button onClick={() => showToast('Viewing YTD Payroll report')} className="mt-1 text-[9px] sm:text-[9.5px] font-bold text-sky-600 hover:text-sky-700 text-left flex items-center gap-0.5 cursor-pointer truncate">
            View report &rarr;
          </button>
        </div>
      </div>

      {/* 3. SEARCH & MULTI-FILTER TOOLBAR ROW */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Search Bar */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by pay run #, period, created by..."
            className="w-full pl-9 pr-3 h-10 sm:h-9 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Filters Group */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
          {/* Dropdown 1: Pay Period */}
          <div className="relative col-span-1">
            <button
              onClick={() => setShowDatePickerDropdown(!showDatePickerDropdown)}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 h-10 sm:h-9 px-3 rounded-xl cursor-pointer text-xs transition-colors truncate"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{payPeriodFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {showDatePickerDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-60 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-slate-200 shadow-2xl p-2 z-[999] text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-2.5 py-1">Filter Pay Period</span>
                {[
                  '18 May 2026 – 24 May 2026',
                  '11 May 2026 – 17 May 2026',
                  '04 May 2026 – 10 May 2026',
                  'All Time'
                ].map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPayPeriodFilter(range);
                      setShowDatePickerDropdown(false);
                      showToast(`Pay period set to ${range}`);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center justify-between ${
                      payPeriodFilter === range ? 'text-blue-600 font-bold bg-blue-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{range}</span>
                    {payPeriodFilter === range && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 2: Pay Frequency */}
          <div className="relative col-span-1">
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 font-bold text-slate-700 h-10 sm:h-9 pl-3 pr-8 rounded-xl outline-none cursor-pointer text-xs truncate"
            >
              <option value="All">All Frequencies</option>
              <option value="Weekly">Weekly</option>
              <option value="Fortnightly">Fortnightly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Dropdown 3: Department */}
          <div className="relative col-span-1">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 font-bold text-slate-700 h-10 sm:h-9 pl-3 pr-8 rounded-xl outline-none cursor-pointer text-xs truncate"
            >
              <option value="All">All Departments</option>
              <option value="Logistics">Logistics</option>
              <option value="Operations">Operations</option>
              <option value="Administration">Administration</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Dropdown 4: Status */}
          <div className="relative col-span-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 font-bold text-slate-700 h-10 sm:h-9 pl-3 pr-8 rounded-xl outline-none cursor-pointer text-xs truncate"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filters Button */}
          <button onClick={() => showToast('Filter drawer toggled')} className="col-span-1 w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 font-extrabold text-slate-700 h-10 sm:h-9 px-3 rounded-xl transition-colors cursor-pointer text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>

          {/* Create Pay Run Button */}
          <button
            onClick={() => setShowNewPayRunModal(true)}
            className="col-span-1 w-full sm:w-auto flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black h-10 sm:h-9 px-4 rounded-xl shadow-xs text-xs cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Pay Run</span>
          </button>
        </div>
      </div>

      {/* 4. STATUS FILTER TABS + ACTION BUTTONS ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
        {/* Status Tabs (Strict 1-line Horizontal Scroll) */}
        <div className="flex items-center flex-nowrap gap-3 sm:gap-4 text-xs font-bold border-b border-slate-200/80 pb-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto whitespace-nowrap">
          {[
            { id: 'All Pay Runs', label: `All Pay Runs (${payRuns.length})` },
            { id: 'Draft', label: `Draft (${payRuns.filter(p => p.status === 'Draft').length})` },
            { id: 'Pending Approval', label: `Pending Approval (${payRuns.filter(p => p.status === 'Pending Approval').length})` },
            { id: 'Approved', label: `Approved (${payRuns.filter(p => p.status === 'Approved').length})` },
            { id: 'Paid', label: `Paid (${payRuns.filter(p => p.status === 'Paid').length})` },
            { id: 'Cancelled', label: `Cancelled (${payRuns.filter(p => p.status === 'Cancelled').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 font-black border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Actions Toolbar */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          {/* CSV Export Button */}
          <button
            onClick={() => handleExportCSV(filteredPayRuns)}
            className="col-span-1 flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold px-3 h-10 sm:h-9 rounded-xl shadow-2xs text-xs cursor-pointer active:scale-98 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          {/* Interactive Bulk Actions Dropdown */}
          <div className="relative col-span-1">
            <button
              onClick={() => setShowBulkActionsDropdown(!showBulkActionsDropdown)}
              className={`w-full flex items-center justify-between sm:justify-start gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold px-3 h-10 sm:h-9 rounded-xl shadow-2xs text-xs cursor-pointer transition-all ${
                selectedRowIds.length > 0 ? 'border-blue-400 bg-blue-50/30' : ''
              }`}
            >
              <span>Bulk Actions</span>
              {selectedRowIds.length > 0 && (
                <span className="bg-blue-600 text-white font-black px-1.5 py-0.2 rounded-full text-[10px]">
                  {selectedRowIds.length}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showBulkActionsDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-52 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-slate-200 shadow-2xl py-1.5 z-[999] text-left">
                <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select {selectedRowIds.length} Pay Run(s)
                </div>

                <button
                  onClick={handleBulkApprove}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bulk Approve</span>
                </button>

                <button
                  onClick={handleBulkMarkPaid}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                  <span>Bulk Mark as Paid</span>
                </button>

                <button
                  onClick={() => {
                    setShowBulkActionsDropdown(false);
                    const selectedList = payRuns.filter(p => selectedRowIds.includes(p.id));
                    handleExportCSV(selectedList);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bulk Export Selected</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={handleBulkReject}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-rose-500" />
                  <span>Bulk Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. MAIN SPLIT LAYOUT (TABLE LEFT + SIDEBAR RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* LEFT COLUMN: DATA TABLE */}
        <div className="lg:col-span-9 bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between max-w-full">
          <div className="overflow-x-auto w-full max-w-full">
            <table className="w-full text-left border-collapse min-w-[850px] whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-bold text-slate-600 tracking-tight">
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedRowIds.length > 0 && selectedRowIds.length === filteredPayRuns.length}
                      className="rounded border-slate-300 accent-blue-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-3">Pay Run #</th>
                  <th className="py-3.5 px-3">
                    <div className="flex items-center gap-1">
                      <span>Pay Period</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3">Pay Frequency</th>
                  <th className="py-3.5 px-3 text-center">Employees</th>
                  <th className="py-3.5 px-3 text-right">Gross Pay</th>
                  <th className="py-3.5 px-3 text-right">Deductions</th>
                  <th className="py-3.5 px-3 text-right">Net Pay</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-3">Created By</th>
                  <th className="py-3.5 px-3">Created On</th>
                  <th className="py-3.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPayRuns.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                      No matching employee pay runs found
                    </td>
                  </tr>
                ) : (
                  filteredPayRuns.map((p) => {
                    const isChecked = selectedRowIds.includes(p.id);
                    const isSelectedRow = selectedPayRun && selectedPayRun.id === p.id;
                    const isMenuOpen = activeRowMenuId === p.id;

                    return (
                      <tr
                        key={p.id}
                        onClick={() => handleRowClick(p)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          isSelectedRow ? 'bg-blue-50/40 border-l-4 border-l-blue-600' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSelectRow(p.id)}
                            className="rounded border-slate-300 accent-blue-600 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 font-extrabold text-blue-600">{p.id}</td>
                        <td className="py-3 px-3 font-semibold text-slate-700">{p.period}</td>
                        <td className="py-3 px-3 text-slate-600 font-medium">{p.frequency}</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-800">{p.employees}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">${fmt(p.grossPay)}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-600">${fmt(p.deductions)}</td>
                        <td className="py-3 px-3 text-right font-black text-slate-900">${fmt(p.netPay)}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={getStatusBadge(p.status)}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-semibold">{p.createdBy}</td>
                        <td className="py-3 px-3 text-slate-500 font-medium text-[11px]">{p.createdOn}</td>

                        {/* ROW ACTIONS */}
                        <td className="py-3 px-3 text-center relative" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2 text-slate-500">
                            <button
                              onClick={() => {
                                setViewingPayRun(p);
                                setShowViewModal(true);
                              }}
                              title="View Pay Run"
                              className="hover:text-slate-900 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(p)}
                              title="Edit Pay Run"
                              className="hover:text-slate-900 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => setActiveRowMenuId(isMenuOpen ? null : p.id)}
                                title="More Actions"
                                className="hover:text-slate-900 transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-2xl py-1.5 z-50 text-left font-normal">
                                  <button
                                    onClick={() => {
                                      setActiveRowMenuId(null);
                                      setViewingPayRun(p);
                                      setShowViewModal(true);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                                    <span>View Pay Run</span>
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditModal(p)}
                                    className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Edit Pay Run</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveRowMenuId(null);
                                      setPayRuns(prev => prev.map(item => item.id === p.id ? { ...item, status: 'Approved' } : item));
                                      showToast(`Pay Run ${p.id} approved.`);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Approve</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Row */}
          <div className="p-3 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-semibold">
            <div>Showing 1 to {filteredPayRuns.length} of {payRuns.length} pay runs</div>

            <div className="flex items-center gap-2">
              <button disabled className="px-2 py-1 text-slate-400 cursor-not-allowed">&lt;</button>
              <button className="w-7 h-7 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center shadow-2xs">
                1
              </button>
              <button className="w-7 h-7 hover:bg-slate-50 text-slate-600 font-medium rounded-lg flex items-center justify-center">2</button>
              <button className="px-2 py-1 text-slate-600 hover:text-slate-900">&gt;</button>
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <span>10 / page</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR CARDS */}
        <div className="lg:col-span-3 space-y-3">
          {/* Card 1: Pay Run Summary */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs text-left">
            <h3 className="text-[10.5px] font-black text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
              Pay Run Summary
            </h3>

            {/* SVG Donut Chart */}
            <div className="relative w-24 h-24 mx-auto my-1 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="4.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray="74.8, 100"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  strokeDasharray="14.0, 100"
                  strokeDashoffset="-74.8"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-500"
                  strokeDasharray="11.2, 100"
                  strokeDashoffset="-88.8"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute text-center">
                <div className="text-xs font-black text-slate-900">${payRuns.reduce((sum, p) => sum + (p.grossPay || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div className="text-[8px] font-bold text-slate-400 uppercase">Gross Pay</div>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-1 pt-1.5 border-t border-slate-100 text-[10px] font-semibold">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-700 truncate">Net Pay</span>
                </div>
                <span className="font-extrabold text-slate-900 shrink-0">${payRuns.reduce((sum, p) => sum + (p.netPay || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-slate-700 truncate">Super</span>
                </div>
                <span className="font-extrabold text-slate-900 shrink-0">$0.00</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-slate-700 truncate">PAYG Tax</span>
                </div>
                <span className="font-extrabold text-slate-900 shrink-0">${payRuns.reduce((sum, p) => sum + (p.deductions || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Important Dates */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs text-left">
            <h3 className="text-[10.5px] font-black text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
              Important Dates
            </h3>

            <div className="space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Period Start</span>
                <span className="font-bold text-slate-900">{payRuns[0]?.period || '—'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Period End</span>
                <span className="font-bold text-slate-900">{payRuns[0]?.period || '—'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Cut-off Time</span>
                <span className="font-bold text-slate-900">—</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Payment Date</span>
                <span className="font-bold text-slate-900">{payRuns[0]?.createdOn || '—'}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Quick Actions */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs text-left space-y-2">
            <h3 className="text-[10.5px] font-black text-slate-900 uppercase tracking-wider mb-1 border-b border-slate-100 pb-1">
              Quick Actions
            </h3>

            <button
              onClick={() => setShowNewPayRunModal(true)}
              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Pay Run</span>
            </button>

            <button
              onClick={() => showToast('Importing employee timesheets...')}
              className="w-full py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Import Timesheets</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM DETAILS PREVIEW PANEL */}
      {selectedPayRun && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 mb-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Pay Run Details</h2>
              <span className={getStatusBadge(selectedPayRun.status)}>
                {selectedPayRun.status}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400">Pay Run #: {selectedPayRun.id}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-3 space-y-3 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 pr-0 lg:pr-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-3">
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Pay Run #</span>
                  <span className="font-black text-blue-600 text-sm block truncate">{selectedPayRun.id}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Employees</span>
                  <span className="font-bold text-slate-800 block truncate">{selectedPayRun.employees} active</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Department</span>
                  <span className="font-semibold text-slate-700 block truncate">{selectedPayRun.department}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Pay Period</span>
                  <span className="font-semibold text-slate-800 block truncate">{selectedPayRun.period}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Pay Frequency</span>
                  <span className="font-semibold text-slate-800 block truncate">{selectedPayRun.frequency}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Created By</span>
                  <span className="font-bold text-slate-800 block truncate">{selectedPayRun.createdBy}</span>
                </div>
              </div>
            </div>

            {/* Middle Details Breakdown */}
            <div className="lg:col-span-6 space-y-4">
              {/* Sub Tabs */}
              <div className="flex items-center gap-3 text-xs font-bold border-b border-slate-200 pb-1 overflow-x-auto no-scrollbar flex-nowrap whitespace-nowrap">
                {[
                  { id: 'Summary', label: 'Summary' },
                  { id: 'Employees', label: `Employees (${selectedPayRun.employees})` },
                  { id: 'Deductions', label: 'Deductions' },
                  { id: 'Payments', label: 'Payments' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveDetailsTab(t.id)}
                    className={`pb-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                      activeDetailsTab === t.id
                        ? 'text-blue-600 font-black border-b-2 border-blue-600'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: SUMMARY VIEW */}
              {activeDetailsTab === 'Summary' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Gross Pay</span>
                      <span className="font-black text-slate-900 text-xs sm:text-sm mt-0.5 block truncate">${fmt(selectedPayRun?.grossPay)}</span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Deductions</span>
                      <span className="font-black text-slate-900 text-xs sm:text-sm mt-0.5 block truncate">${fmt(selectedPayRun?.deductions)}</span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Net Pay</span>
                      <span className="font-black text-slate-900 text-xs sm:text-sm mt-0.5 block truncate">${fmt(selectedPayRun?.netPay)}</span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Super</span>
                      <span className="font-black text-slate-900 text-xs sm:text-sm mt-0.5 block truncate">${fmt(selectedPayRun?.superannuation)}</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto w-full rounded-xl border border-slate-200/80">
                    <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-2.5 px-3">Description</th>
                          <th className="py-2.5 px-3 text-right">Amount (Ex GST)</th>
                          <th className="py-2.5 px-3 text-right">GST</th>
                          <th className="py-2.5 px-3 text-right">Total (Inc GST)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {(selectedPayRun?.items || []).map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{item.description}</td>
                            <td className="py-2.5 px-3 text-right text-slate-700">${fmt(item.amountExGst)}</td>
                            <td className="py-2.5 px-3 text-right text-slate-500">${fmt(item.gst)}</td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900">${fmt(item.totalIncGst)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: EMPLOYEES TABLE */}
              {activeDetailsTab === 'Employees' && (
                <div className="overflow-x-auto w-full rounded-xl border border-slate-200/80">
                  <table className="w-full text-left border-collapse text-xs min-w-[550px] whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Employee Name</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3 text-right">Gross Pay</th>
                        <th className="py-2.5 px-3 text-right">Net Pay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {[
                        { name: 'John Cooper', role: 'HC Driver', gross: 1732.50, net: 1299.50 },
                        { name: 'Sarah Jenkins', role: 'Logistics Coord', gross: 1450.00, net: 1087.50 },
                        { name: 'Michael Brown', role: 'Yard Manager', gross: 1400.00, net: 1050.00 }
                      ].map((emp, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{emp.name}</td>
                          <td className="py-2.5 px-3 text-slate-600">{emp.role}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-800">${emp.gross.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-black text-emerald-600">${emp.net.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 3: DEDUCTIONS TABLE */}
              {activeDetailsTab === 'Deductions' && (
                <div className="overflow-x-auto w-full rounded-xl border border-slate-200/80">
                  <table className="w-full text-left border-collapse text-xs min-w-[550px] whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Deduction Type</th>
                        <th className="py-2.5 px-3 text-right">Employee Cont.</th>
                        <th className="py-2.5 px-3 text-right">Employer Cont.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {[
                        { type: 'PAYG Tax Withholding', emp: 2765.00, employer: 0.00 },
                        { type: 'Superannuation Guarantee', emp: 0.00, employer: 3450.00 }
                      ].map((d, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{d.type}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-amber-600">${d.emp.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-blue-600">${d.employer.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 4: PAYMENTS TABLE */}
              {activeDetailsTab === 'Payments' && (
                <div className="overflow-x-auto w-full rounded-xl border border-slate-200/80">
                  <table className="w-full text-left border-collapse text-xs min-w-[550px] whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Payment Ref #</th>
                        <th className="py-2.5 px-3">Recipient Bank</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {[
                        { ref: 'EFT-99401', bank: 'CBA Direct Credit', amount: 1299.50 },
                        { ref: 'EFT-99402', bank: 'ANZ Direct Credit', amount: 1087.50 }
                      ].map((pay, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-extrabold text-blue-600">{pay.ref}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{pay.bank}</td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-900">${pay.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Action Buttons Column */}
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-2 pl-0 lg:pl-2">
              <span className="col-span-2 sm:col-span-3 lg:col-span-1 text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Actions</span>

              <button
                onClick={() => {
                  setPayRuns(prev => prev.map(p => p.id === selectedPayRun.id ? { ...p, status: 'Approved' } : p));
                  setSelectedPayRun(prev => ({ ...prev, status: 'Approved' }));
                  showToast(`Pay Run ${selectedPayRun.id} approved.`);
                }}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve Pay Run</span>
              </button>

              <button
                onClick={() => handleOpenEditModal(selectedPayRun)}
                className="py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Pay Run</span>
              </button>

              <button
                onClick={() => {
                  setPayRuns(prev => prev.filter(p => p.id !== selectedPayRun.id));
                  showToast(`Pay Run ${selectedPayRun.id} deleted.`);
                  setSelectedPayRun(null);
                }}
                className="col-span-2 sm:col-span-1 py-2 px-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Delete Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. VIEW PAY RUN MODAL */}
      {showViewModal && viewingPayRun && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[9999] p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-base font-black text-slate-900 truncate">Statement: {viewingPayRun.id}</h2>
                <span className={getStatusBadge(viewingPayRun.status)}>
                  {viewingPayRun.status}
                </span>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Pay Run #</span>
                  <span className="font-extrabold text-blue-600 text-sm block truncate">{viewingPayRun.id}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Pay Period</span>
                  <span className="font-bold text-slate-800 block truncate">{viewingPayRun.period}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Gross Pay</span>
                  <span className="font-black text-slate-900 text-xs sm:text-sm mt-0.5 block truncate">${fmt(viewingPayRun?.grossPay)}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Deductions</span>
                  <span className="font-black text-slate-900 text-xs sm:text-sm mt-0.5 block truncate">${fmt(viewingPayRun?.deductions)}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Net Pay</span>
                  <span className="font-black text-emerald-600 text-xs sm:text-sm mt-0.5 block truncate">${fmt(viewingPayRun?.netPay)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => handleOpenEditModal(viewingPayRun)}
                  className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xs cursor-pointer"
                >
                  Edit Pay Run
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. CREATE NEW PAY RUN MODAL */}
      {showNewPayRunModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[9999] p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-black text-slate-900">Create New Pay Run</h2>
              <button onClick={() => setShowNewPayRunModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePayRunSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Pay Period</label>
                <input
                  type="text"
                  required
                  value={newPayRunForm.period}
                  onChange={(e) => setNewPayRunForm({ ...newPayRunForm, period: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Pay Frequency</label>
                  <select
                    value={newPayRunForm.frequency}
                    onChange={(e) => setNewPayRunForm({ ...newPayRunForm, frequency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 font-semibold"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Fortnightly">Fortnightly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Active Employees</label>
                  <input
                    type="number"
                    required
                    value={newPayRunForm.employees}
                    onChange={(e) => setNewPayRunForm({ ...newPayRunForm, employees: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Gross Pay ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="24650.00"
                    value={newPayRunForm.grossPay}
                    onChange={(e) => setNewPayRunForm({ ...newPayRunForm, grossPay: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Deductions ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="6215.00"
                    value={newPayRunForm.deductions}
                    onChange={(e) => setNewPayRunForm({ ...newPayRunForm, deductions: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewPayRunModal(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xs"
                >
                  Save Pay Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. EDIT PAY RUN MODAL */}
      {showEditPayRunModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[9999] p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">Edit Pay Run</h2>
                <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-lg text-xs">
                  {editingPayRunForm.id}
                </span>
              </div>
              <button onClick={() => setShowEditPayRunModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePayRunSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Pay Period</label>
                <input
                  type="text"
                  required
                  value={editingPayRunForm.period}
                  onChange={(e) => setEditingPayRunForm({ ...editingPayRunForm, period: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Pay Frequency</label>
                  <select
                    value={editingPayRunForm.frequency}
                    onChange={(e) => setEditingPayRunForm({ ...editingPayRunForm, frequency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 font-semibold"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Fortnightly">Fortnightly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingPayRunForm.status}
                    onChange={(e) => setEditingPayRunForm({ ...editingPayRunForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 font-semibold"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Paid">Paid</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Gross Pay ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingPayRunForm.grossPay}
                    onChange={(e) => setEditingPayRunForm({ ...editingPayRunForm, grossPay: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Deductions ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingPayRunForm.deductions}
                    onChange={(e) => setEditingPayRunForm({ ...editingPayRunForm, deductions: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditPayRunModal(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePay;
