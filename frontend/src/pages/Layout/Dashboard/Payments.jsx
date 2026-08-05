import React, { useState } from 'react';
import {
  FileText, CheckCircle2, Clock, ShieldAlert, ArrowDown, ArrowUp, DollarSign,
  Search, ChevronDown, Calendar, Filter, Download, FileSpreadsheet, Eye, MoreVertical,
  Building2, Bell, X, Printer, Mail, ArrowUpDown, CreditCard, Landmark, RefreshCw
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Payments = () => {
  // Master Payments Data matching screenshot
  const initialPayments = [
    {
      id: 'PAY-1078',
      date: '2026-05-24',
      dateFormatted: '24 May 2026',
      customer: 'ABC Auto Transport',
      invoicesPaid: 'INV-1052',
      method: 'Bank Transfer',
      amountReceived: 5280.00,
      allocatedAmount: 5280.00,
      unallocatedAmount: 0.00,
      status: 'Allocated',
      notes: 'Payment for invoice INV-1052',
      bankAccount: 'Commonwealth Bank ***** 1234',
      createdBy: 'Sarah Jones',
      createdOn: '24 May 2026, 10:15 AM',
      allocatedInvoices: [
        { id: 'INV-1052', date: '21 May 2026', dueDate: '04 Jun 2026', amount: 5280.00, paid: 5280.00 }
      ]
    },
    {
      id: 'PAY-1077',
      date: '2026-05-23',
      dateFormatted: '23 May 2026',
      customer: 'Global Motors',
      invoicesPaid: 'INV-1051 (Part)',
      method: 'EFT',
      amountReceived: 2000.00,
      allocatedAmount: 2000.00,
      unallocatedAmount: 0.00,
      status: 'Allocated',
      notes: 'Partial payment for INV-1051',
      bankAccount: 'ANZ Bank ***** 5678',
      createdBy: 'Sarah Jones',
      createdOn: '23 May 2026, 02:40 PM',
      allocatedInvoices: [
        { id: 'INV-1051', date: '20 May 2026', dueDate: '03 Jun 2026', amount: 4345.00, paid: 2000.00 }
      ]
    },
    {
      id: 'PAY-1076',
      date: '2026-05-23',
      dateFormatted: '23 May 2026',
      customer: 'FastTrack Logistics',
      invoicesPaid: 'INV-1054',
      method: 'Credit Card',
      amountReceived: 3025.00,
      allocatedAmount: 3025.00,
      unallocatedAmount: 0.00,
      status: 'Allocated',
      notes: 'Card settlement INV-1054',
      bankAccount: 'Westpac ***** 9901',
      createdBy: 'John Smith',
      createdOn: '23 May 2026, 11:20 AM',
      allocatedInvoices: [
        { id: 'INV-1054', date: '19 May 2026', dueDate: '02 Jun 2026', amount: 3025.00, paid: 3025.00 }
      ]
    },
    {
      id: 'PAY-1075',
      date: '2026-05-22',
      dateFormatted: '22 May 2026',
      customer: 'Prime Carriers',
      invoicesPaid: 'INV-1049',
      method: 'Bank Transfer',
      amountReceived: 6160.00,
      allocatedAmount: 6160.00,
      unallocatedAmount: 0.00,
      status: 'Allocated',
      notes: 'Full payment for INV-1049',
      bankAccount: 'Commonwealth Bank ***** 1234',
      createdBy: 'Sarah Jones',
      createdOn: '22 May 2026, 09:30 AM',
      allocatedInvoices: [
        { id: 'INV-1049', date: '18 May 2026', dueDate: '01 Jun 2026', amount: 6160.00, paid: 6160.00 }
      ]
    },
    {
      id: 'PAY-1074',
      date: '2026-05-21',
      dateFormatted: '21 May 2026',
      customer: 'Nationwide Transport',
      invoicesPaid: 'INV-1048',
      method: 'EFT',
      amountReceived: 3630.00,
      allocatedAmount: 3630.00,
      unallocatedAmount: 0.00,
      status: 'Allocated',
      notes: 'EFT Deposit INV-1048',
      bankAccount: 'NAB ***** 4432',
      createdBy: 'John Smith',
      createdOn: '21 May 2026, 03:15 PM',
      allocatedInvoices: [
        { id: 'INV-1048', date: '17 May 2026', dueDate: '31 May 2026', amount: 3630.00, paid: 3630.00 }
      ]
    },
    {
      id: 'PAY-1073',
      date: '2026-05-21',
      dateFormatted: '21 May 2026',
      customer: 'Express Freight Co',
      invoicesPaid: 'INV-1047 (Part)',
      method: 'Bank Transfer',
      amountReceived: 750.00,
      allocatedAmount: 0.00,
      unallocatedAmount: 750.00,
      status: 'Unallocated',
      notes: 'Unassigned deposit from Express Freight',
      bankAccount: 'Commonwealth Bank ***** 1234',
      createdBy: 'Sarah Jones',
      createdOn: '21 May 2026, 11:00 AM',
      allocatedInvoices: []
    },
    {
      id: 'PAY-1072',
      date: '2026-05-20',
      dateFormatted: '20 May 2026',
      customer: 'ABC Auto Transport',
      invoicesPaid: 'INV-1046',
      method: 'Credit Card',
      amountReceived: 7150.00,
      allocatedAmount: 7150.00,
      unallocatedAmount: 0.00,
      status: 'Allocated',
      notes: 'Card payment for INV-1046',
      bankAccount: 'Westpac ***** 9901',
      createdBy: 'Sarah Jones',
      createdOn: '20 May 2026, 04:50 PM',
      allocatedInvoices: [
        { id: 'INV-1046', date: '16 May 2026', dueDate: '30 May 2026', amount: 7150.00, paid: 7150.00 }
      ]
    },
    {
      id: 'PAY-1071',
      date: '2026-05-19',
      dateFormatted: '19 May 2026',
      customer: 'Global Motors',
      invoicesPaid: '-',
      method: 'Bank Transfer',
      amountReceived: 1000.00,
      allocatedAmount: 0.00,
      unallocatedAmount: 1000.00,
      status: 'Unallocated',
      notes: 'Advance deposit Global Motors',
      bankAccount: 'ANZ Bank ***** 5678',
      createdBy: 'John Smith',
      createdOn: '19 May 2026, 01:25 PM',
      allocatedInvoices: []
    },
    {
      id: 'PAY-1070',
      date: '2026-05-18',
      dateFormatted: '18 May 2026',
      customer: 'Prime Carriers',
      invoicesPaid: 'INV-1045',
      method: 'EFT',
      amountReceived: 6280.00,
      allocatedAmount: 6280.00,
      unallocatedAmount: 0.00,
      status: 'Allocated',
      notes: 'EFT for INV-1045',
      bankAccount: 'Commonwealth Bank ***** 1234',
      createdBy: 'Sarah Jones',
      createdOn: '18 May 2026, 10:00 AM',
      allocatedInvoices: [
        { id: 'INV-1045', date: '14 May 2026', dueDate: '28 May 2026', amount: 6280.00, paid: 6280.00 }
      ]
    },
    {
      id: 'PAY-1069',
      date: '2026-05-18',
      dateFormatted: '18 May 2026',
      customer: 'FastTrack Logistics',
      invoicesPaid: 'INV-1043',
      method: 'Bank Transfer',
      amountReceived: 2950.00,
      allocatedAmount: 2950.00,
      unallocatedAmount: 0.00,
      status: 'Allocated',
      notes: 'Bank deposit for INV-1043',
      bankAccount: 'Commonwealth Bank ***** 1234',
      createdBy: 'Sarah Jones',
      createdOn: '18 May 2026, 09:10 AM',
      allocatedInvoices: [
        { id: 'INV-1043', date: '12 May 2026', dueDate: '26 May 2026', amount: 2950.00, paid: 2950.00 }
      ]
    }
  ];

  const [payments, setPayments] = useState(initialPayments);
  const [selectedPayment, setSelectedPayment] = useState(initialPayments[0]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Bottom Details Sub-tab state
  const [bottomSubTab, setBottomSubTab] = useState('Invoices Allocated');

  // Popover States
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showReconciliationMenu, setShowReconciliationMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);

  // Date Filter State
  const [startDate, setStartDate] = useState('2026-05-18');
  const [endDate, setEndDate] = useState('2026-05-24');
  const [datePreset, setDatePreset] = useState('18 May 2026 – 24 May 2026');

  // Modal View State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Payment Summary Donut Chart Data
  const summaryDonutData = [
    { name: 'Allocated', value: 217200, color: '#22c55e' },   // Green
    { name: 'Unallocated', value: 6150, color: '#3b82f6' },   // Blue
    { name: 'Overpayments', value: 2850, color: '#eab308' },  // Yellow
    { name: 'Refunds', value: 1250, color: '#06b6d4' }        // Cyan
  ];

  // Filtering Logic
  const filteredPayments = payments.filter(pay => {
    if (activeTab === 'Allocated' && pay.status !== 'Allocated') return false;
    if (activeTab === 'Unallocated' && pay.status !== 'Unallocated') return false;
    if (statusFilter !== 'All' && pay.status !== statusFilter) return false;
    if (customerFilter !== 'All' && pay.customer !== customerFilter) return false;
    if (methodFilter !== 'All' && pay.method !== methodFilter) return false;

    if (startDate && pay.date < startDate) return false;
    if (endDate && pay.date > endDate) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = pay.id.toLowerCase().includes(q);
      const matchCustomer = pay.customer.toLowerCase().includes(q);
      const matchInv = pay.invoicesPaid.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchInv) return false;
    }
    return true;
  });

  // Toggle Checkboxes
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredPayments.map(p => p.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Allocated':
        return 'bg-emerald-100/70 text-emerald-700 font-bold px-3 py-0.5 rounded-full text-[11px] shrink-0';
      case 'Unallocated':
        return 'bg-amber-100/70 text-amber-700 font-bold px-3 py-0.5 rounded-full text-[11px] shrink-0';
      case 'Refunded':
        return 'bg-rose-100/70 text-rose-700 font-bold px-3 py-0.5 rounded-full text-[11px] shrink-0';
      default:
        return 'bg-slate-100 text-slate-700 font-bold px-3 py-0.5 rounded-full text-[11px] shrink-0';
    }
  };

  // Method Icon Helper
  const getMethodIcon = (method) => {
    switch (method) {
      case 'Bank Transfer':
        return <Landmark className="w-3.5 h-3.5 text-slate-500 inline-block mr-1" />;
      case 'Credit Card':
      case 'EFT':
        return <CreditCard className="w-3.5 h-3.5 text-slate-500 inline-block mr-1" />;
      default:
        return <DollarSign className="w-3.5 h-3.5 text-slate-500 inline-block mr-1" />;
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    setShowExportMenu(false);
    const dataToExport = selectedRowIds.length > 0 
      ? payments.filter(p => selectedRowIds.includes(p.id))
      : filteredPayments;

    const headers = ['Payment ID', 'Date', 'Customer', 'Invoices Paid', 'Method', 'Amount Received', 'Allocated', 'Unallocated', 'Status'];
    const csvRows = [headers.join(',')];

    dataToExport.forEach(p => {
      const row = [
        p.id,
        p.dateFormatted,
        `"${p.customer}"`,
        `"${p.invoicesPaid}"`,
        p.method,
        p.amountReceived,
        p.allocatedAmount,
        p.unallocatedAmount,
        p.status
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payments_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`Exported ${dataToExport.length} payments to CSV.`);
  };

  const handleRowClick = (pay) => {
    setSelectedPayment(pay);
  };

  const handleEyeIconClick = (pay) => {
    setActiveRowMenuId(null);
    setViewingPayment(pay);
    setShowViewModal(true);
    showToast(`Viewing Details for Payment ${pay.id}`);
  };

  return (
    <div className="p-3 sm:p-6 bg-[#f8fafc] min-h-screen font-sans text-left relative overflow-x-hidden">
      {/* Toast Notification Banner (Mobile Responsive) */}
      {toastMessage && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-[9999] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in duration-200 border border-slate-700 max-w-md ml-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white shrink-0">
            <X className="w-3.5 h-3.5"/>
          </button>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Payments</h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">
            Track and manage all incoming payments from customers.
          </p>
        </div>
      </div>

      {/* 1. TOP KPI SUMMARY CARDS (Mobile Responsive Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
        {/* Payments Received */}
        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Payments Received</div>
            <div className="text-base sm:text-lg font-black text-slate-900 truncate">$242,350.00</div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0.5 leading-tight">
              <span className="whitespace-nowrap">12 payments</span> • <span className="text-emerald-600 font-bold flex items-center whitespace-nowrap"><ArrowUp className="w-2.5 h-2.5"/> 18.6%</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        {/* Unallocated Payments */}
        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Unallocated Payments</div>
            <div className="text-base sm:text-lg font-black text-slate-900 truncate">$6,150.00</div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0.5 leading-tight">
              <span className="whitespace-nowrap">3 payments</span> • <span className="text-sky-600 font-bold cursor-pointer hover:underline whitespace-nowrap">View items &rarr;</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        {/* Overpayments */}
        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Overpayments</div>
            <div className="text-base sm:text-lg font-black text-slate-900 truncate">$2,850.00</div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0.5 leading-tight">
              <span className="whitespace-nowrap">2 payments</span> • <span className="text-sky-600 font-bold cursor-pointer hover:underline whitespace-nowrap">View items &rarr;</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        {/* Refunds */}
        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Refunds (This Period)</div>
            <div className="text-base sm:text-lg font-black text-slate-900 truncate">$1,250.00</div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0.5 leading-tight">
              <span className="whitespace-nowrap">2 payments</span> • <span className="text-rose-600 font-bold flex items-center whitespace-nowrap"><ArrowDown className="w-2.5 h-2.5"/> 12.5%</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        {/* Avg Days to Pay */}
        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Avg. Days to Pay</div>
            <div className="text-base sm:text-lg font-black text-slate-900 truncate">26</div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0.5 leading-tight">
              <span className="text-emerald-600 font-bold flex items-center whitespace-nowrap"><ArrowDown className="w-2.5 h-2.5"/> 4 days</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        {/* Collection Rate */}
        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Collection Rate</div>
            <div className="text-base sm:text-lg font-black text-slate-900 truncate">91.2%</div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0.5 leading-tight">
              <span className="text-emerald-600 font-bold flex items-center whitespace-nowrap"><ArrowUp className="w-2.5 h-2.5"/> 3.6%</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>

      {/* 2. FILTERS & SEARCH ROW (Grid Layout on Mobile) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs mb-5 space-y-3">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by payment reference, customer, invoice #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-sky-500 focus:bg-sky-50/20 transition-all"
          />
        </div>

        {/* Dropdowns Grid (2 columns on mobile, flex on desktop) */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
          <select
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-2 bg-sky-50/40 border border-sky-200 hover:border-sky-400 rounded-lg text-xs font-bold text-sky-900 outline-none cursor-pointer focus:ring-2 focus:ring-sky-300 transition-all truncate"
          >
            <option value="All">All Customers</option>
            <option value="ABC Auto Transport">ABC Auto Transport</option>
            <option value="Global Motors">Global Motors</option>
            <option value="FastTrack Logistics">FastTrack Logistics</option>
            <option value="Prime Carriers">Prime Carriers</option>
            <option value="Nationwide Transport">Nationwide Transport</option>
            <option value="Express Freight Co">Express Freight Co</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-2 bg-sky-50/40 border border-sky-200 hover:border-sky-400 rounded-lg text-xs font-bold text-sky-900 outline-none cursor-pointer focus:ring-2 focus:ring-sky-300 transition-all truncate"
          >
            <option value="All">All Methods</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="EFT">EFT</option>
            <option value="Credit Card">Credit Card</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-2 bg-sky-50/40 border border-sky-200 hover:border-sky-400 rounded-lg text-xs font-bold text-sky-900 outline-none cursor-pointer focus:ring-2 focus:ring-sky-300 transition-all truncate"
          >
            <option value="All">All Status</option>
            <option value="Allocated">Allocated</option>
            <option value="Unallocated">Unallocated</option>
          </select>

          {/* DATE PICKER */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full sm:w-auto bg-sky-50/50 hover:bg-sky-100 border border-sky-200 hover:border-sky-400 rounded-lg px-2.5 py-2 text-xs text-sky-900 font-bold flex items-center justify-between gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <span className="truncate">{datePreset}</span>
              <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            </button>

            {showDatePicker && (
              <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-slate-200 shadow-2xl p-4 z-50 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <span className="font-extrabold text-slate-900">Select Date Range</span>
                  <button onClick={() => setShowDatePicker(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2.5 mb-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => {
                        setStartDate(e.target.value);
                        setDatePreset('Custom Range');
                      }}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => {
                        setEndDate(e.target.value);
                        setDatePreset('Custom Range');
                      }}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="w-full py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold rounded-lg"
                >
                  Apply Filter
                </button>
              </div>
            )}
          </div>

          <button className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer col-span-2 sm:col-span-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* 3. TOP TABS & EXPORT/RECONCILIATION ACTIONS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        {/* Status Filter Tabs (Horizontal scroll on mobile) */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs font-bold overflow-x-auto pb-2 sm:pb-0 no-scrollbar w-full sm:w-auto shrink-0">
          {[
            { id: 'All', label: 'All (24)' },
            { id: 'Allocated', label: 'Allocated (18)' },
            { id: 'Unallocated', label: 'Unallocated (3)' },
            { id: 'Overpayments', label: 'Overpayments (2)' },
            { id: 'Refunds', label: 'Refunds (2)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-1 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-orange-500 font-extrabold border-b-2 border-orange-500'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2 justify-end shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 text-xs">
                <button
                  onClick={handleExportCSV}
                  className="w-full px-4 py-2 text-left font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export CSV Ledger</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowReconciliationMenu(!showReconciliationMenu)}
              className="bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
            >
              <span>Reconciliation</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showReconciliationMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    setShowReconciliationMenu(false);
                    showToast('Bank reconciliation wizard initiated.');
                  }}
                  className="w-full px-4 py-2 text-left font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-sky-600" />
                  <span>Run Bank Match Wizard</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT SPLIT LAYOUT (TABLE LEFT + SIDEBAR RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* LEFT COLUMN: PAYMENTS DATA TABLE */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[780px] whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-bold text-slate-600 tracking-tight">
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedRowIds.length === filteredPayments.length && filteredPayments.length > 0}
                      className="rounded border-slate-300 accent-sky-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-3">
                    <div className="flex items-center gap-1">
                      <span>Payment Date</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3">Payment Reference</th>
                  <th className="py-3.5 px-3">Customer</th>
                  <th className="py-3.5 px-3">Invoices Paid</th>
                  <th className="py-3.5 px-3">Payment Method</th>
                  <th className="py-3.5 px-3 text-right">Amount Received</th>
                  <th className="py-3.5 px-3 text-right">Allocated Amount</th>
                  <th className="py-3.5 px-3 text-right">Unallocated Amount</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                      No matching payments found
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((pay) => {
                    const isChecked = selectedRowIds.includes(pay.id);
                    const isSelectedRow = selectedPayment && selectedPayment.id === pay.id;
                    const isMenuOpen = activeRowMenuId === pay.id;

                    return (
                      <tr
                        key={pay.id}
                        onClick={() => handleRowClick(pay)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          isSelectedRow ? 'bg-amber-50/40 border-l-4 border-l-amber-500' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSelectRow(pay.id)}
                            className="rounded border-slate-300 accent-sky-600 cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">{pay.dateFormatted}</td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">{pay.id}</td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">{pay.customer}</td>
                        <td className="py-3.5 px-3 font-medium text-slate-700">{pay.invoicesPaid}</td>
                        <td className="py-3.5 px-3 text-slate-600">
                          {getMethodIcon(pay.method)}
                          <span>{pay.method}</span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-slate-900">${pay.amountReceived.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="py-3.5 px-3 text-right font-bold text-slate-800">
                          ${pay.allocatedAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                        </td>
                        <td className={`py-3.5 px-3 text-right font-bold ${pay.unallocatedAmount > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                          ${pay.unallocatedAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={getStatusBadge(pay.status)}>
                            {pay.status}
                          </span>
                        </td>

                        {/* ROW ACTIONS */}
                        <td className="py-3.5 px-3 text-center relative" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2.5 text-slate-500">
                            <button
                              onClick={() => handleEyeIconClick(pay)}
                              title="View Details"
                              className="hover:text-slate-900 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => setActiveRowMenuId(isMenuOpen ? null : pay.id)}
                                title="More Actions"
                                className="hover:text-slate-900 transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-2xl py-1.5 z-50 text-left font-normal">
                                  <button
                                    onClick={() => handleEyeIconClick(pay)}
                                    className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                                    <span>View Payment</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveRowMenuId(null);
                                      showToast(`Downloaded receipt for ${pay.id}`);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Print Receipt</span>
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

          {/* Table Footer Pagination */}
          <div className="p-3.5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-semibold">
            <div>Showing 1 to {filteredPayments.length} of 24 payments</div>

            <div className="flex items-center gap-2">
              <button disabled className="px-2 py-1 text-slate-400 cursor-not-allowed">&lt;</button>
              <button className="w-7 h-7 bg-white border border-amber-400 text-amber-600 font-bold rounded-lg flex items-center justify-center shadow-2xs">
                1
              </button>
              <button className="w-7 h-7 hover:bg-slate-50 text-slate-600 font-medium rounded-lg flex items-center justify-center">2</button>
              <button className="w-7 h-7 hover:bg-slate-50 text-slate-600 font-medium rounded-lg flex items-center justify-center">3</button>
              <button className="px-2 py-1 text-slate-600 hover:text-slate-900">&gt;</button>
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <span>10 / page</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR CARDS */}
        <div className="lg:col-span-4 space-y-3">
          {/* Card 1: Payment Summary Donut Chart */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-[10.5px] font-black text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
              Payment Summary (This Period)
            </h3>

            <div className="flex items-center justify-between gap-2 py-0.5">
              {/* Donut Chart with total center value */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={summaryDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={44}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {summaryDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
                  <span className="text-[9.5px] sm:text-[10px] font-black text-slate-900 leading-none tracking-tight">$242k</span>
                  <span className="text-[6.5px] sm:text-[7px] font-extrabold text-slate-400 uppercase tracking-tighter mt-0.5">Total</span>
                </div>
              </div>

              {/* Right Legend Bullets */}
              <div className="space-y-1 text-[10px] font-bold text-slate-700 flex-1 pl-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                    <span className="truncate">Allocated</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-[10px] shrink-0">$217,200</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block shrink-0" />
                    <span className="truncate">Unallocated</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-[10px] shrink-0">$6,150</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block shrink-0" />
                    <span className="truncate">Overpay</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-[10px] shrink-0">$2,850</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 inline-block shrink-0" />
                    <span className="truncate">Refunds</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-[10px] shrink-0">$1,250</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Payment Methods (This Period) */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-[10.5px] font-black text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
              Payment Methods (This Period)
            </h3>

            <div className="space-y-1.5 text-[11px] font-semibold text-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Landmark className="w-3 h-3 text-slate-500" />
                  <span>Bank Transfer</span>
                </div>
                <span className="font-bold text-slate-900">$186,400.00 <span className="text-[9px] text-slate-400 font-normal">(76.9%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3 h-3 text-slate-500" />
                  <span>EFT</span>
                </div>
                <span className="font-bold text-slate-900">$38,300.00 <span className="text-[9px] text-slate-400 font-normal">(15.8%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3 h-3 text-slate-500" />
                  <span>Credit Card</span>
                </div>
                <span className="font-bold text-slate-900">$15,900.00 <span className="text-[9px] text-slate-400 font-normal">(6.6%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 text-slate-500" />
                  <span>Other</span>
                </div>
                <span className="font-bold text-slate-900">$1,750.00 <span className="text-[9px] text-slate-400 font-normal">(0.7%)</span></span>
              </div>
            </div>
          </div>

          {/* Card 3: Recent Unallocated Payments */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-1">
              <h3 className="text-[10.5px] font-black text-slate-900 uppercase tracking-wider">
                Recent Unallocated Payments
              </h3>
              <button onClick={() => setActiveTab('Unallocated')} className="text-[10px] font-bold text-sky-600 hover:text-sky-700">
                View all
              </button>
            </div>

            <div className="space-y-2">
              {[
                { id: 'PAY-1073', date: '21 May 2026', customer: 'Express Freight Co', amount: '$750.00' },
                { id: 'PAY-1071', date: '19 May 2026', customer: 'Global Motors', amount: '$1,000.00' },
                { id: 'PAY-1068', date: '17 May 2026', customer: 'ABC Auto Transport', amount: '$4,400.00' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-l-2 border-rose-400 pl-2.5 py-0.5">
                  <div>
                    <div className="font-extrabold text-slate-900 text-[11px] leading-tight">{item.id}</div>
                    <div className="text-slate-400 text-[9.5px] font-medium leading-tight">{item.date}</div>
                    <div className="text-[10px] font-semibold text-slate-600 leading-tight">{item.customer}</div>
                  </div>
                  <div className="font-black text-amber-600 text-right text-[11px]">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Action Buttons */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="text-[10.5px] font-black text-slate-900 uppercase tracking-wider mb-1">Actions</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => showToast(`Viewed receipt for ${selectedPayment ? selectedPayment.id : 'payment'}`)}
                className="py-1.5 px-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[10.5px] rounded-lg shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>View Receipt</span>
              </button>
              <button
                onClick={() => showToast(`Editing ${selectedPayment ? selectedPayment.id : 'payment'}`)}
                className="py-1.5 px-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[10.5px] rounded-lg shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Payment</span>
              </button>
            </div>
            <button
              onClick={() => showToast(`Initiated refund for ${selectedPayment ? selectedPayment.id : 'payment'}`)}
              className="w-full py-1.5 px-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-[10.5px] rounded-lg flex items-center justify-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
              <span>Issue Refund</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM PREVIEW DETAILS PANEL (RESPONSIVE) */}
      {selectedPayment && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Info Column */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-100 pr-0 lg:pr-6 pb-4 lg:pb-0">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Payment Details</h3>
                <span className={getStatusBadge(selectedPayment.status)}>
                  {selectedPayment.status}
                </span>
              </div>

              <div className="text-lg sm:text-xl font-black text-slate-900 mb-3 sm:mb-4">{selectedPayment.id}</div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Customer</span>
                  <span className="font-extrabold text-sky-600 block truncate">{selectedPayment.customer}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Payment Date</span>
                  <span className="font-bold text-slate-900 block truncate">{selectedPayment.dateFormatted}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Payment Method</span>
                  <span className="font-bold text-slate-900 block truncate">{selectedPayment.method}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Amount Received</span>
                  <span className="font-black text-slate-900 block truncate">${selectedPayment.amountReceived.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-slate-100">
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Reference / Notes</span>
                  <span className="font-medium text-slate-700 block truncate">{selectedPayment.notes}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Bank / Account</span>
                  <span className="font-bold text-slate-900 block truncate">{selectedPayment.bankAccount}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Created By</span>
                  <span className="font-semibold text-slate-800 block truncate">{selectedPayment.createdBy}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Created On</span>
                  <span className="font-medium text-slate-700 block truncate">{selectedPayment.createdOn}</span>
                </div>
              </div>
            </div>

            {/* Right Allocated Invoices Column */}
            <div className="lg:col-span-7">
              {/* Sub-tabs */}
              <div className="flex items-center gap-4 sm:gap-6 text-xs font-bold mb-3 border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'Invoices Allocated', label: `Invoices Allocated (${selectedPayment.allocatedInvoices.length})` },
                  { id: 'Notes', label: 'Notes (0)' },
                  { id: 'History', label: 'History' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setBottomSubTab(sub.id)}
                    className={`pb-1 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                      bottomSubTab === sub.id
                        ? 'text-orange-500 font-extrabold border-b-2 border-orange-500'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {bottomSubTab === 'Invoices Allocated' && (
                <div className="space-y-3">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-tight">
                          <th className="p-2.5">Invoice #</th>
                          <th className="p-2.5">Invoice Date</th>
                          <th className="p-2.5">Due Date</th>
                          <th className="p-2.5 text-right">Invoice Amount (Inc GST)</th>
                          <th className="p-2.5 text-right">Paid Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedPayment.allocatedInvoices.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-4 text-center text-slate-400 font-medium italic">
                              No invoices currently allocated to this payment deposit
                            </td>
                          </tr>
                        ) : (
                          selectedPayment.allocatedInvoices.map((inv, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-2.5 font-bold text-slate-900">{inv.id}</td>
                              <td className="p-2.5 text-slate-600">{inv.date}</td>
                              <td className="p-2.5 text-slate-600">{inv.dueDate}</td>
                              <td className="p-2.5 text-right font-bold text-slate-900">${inv.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                              <td className="p-2.5 text-right font-bold text-slate-900">${inv.paid.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs font-bold text-slate-900">
                    <span>Total Allocated</span>
                    <span className="font-black text-sm">${selectedPayment.allocatedAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                  </div>
                </div>
              )}

              {bottomSubTab === 'Notes' && (
                <div className="py-6 text-center text-slate-400 text-xs font-medium">
                  No internal notes logged for {selectedPayment.id}.
                </div>
              )}

              {bottomSubTab === 'History' && (
                <div className="py-4 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-600 pb-1.5 border-b border-slate-50">
                    <span>Created payment record ({selectedPayment.id})</span>
                    <span className="text-[10.5px] text-slate-400">{selectedPayment.createdOn}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Allocated ${selectedPayment.allocatedAmount} to {selectedPayment.invoicesPaid}</span>
                    <span className="text-[10.5px] text-slate-400">{selectedPayment.createdOn}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1-TO-1 DEDICATED PAYMENT VIEW MODAL (RESPONSIVE) */}
      {showViewModal && viewingPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[9999] p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 mb-4 sm:mb-5">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
                  PAY
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">{viewingPayment.id}</h2>
                    <span className={getStatusBadge(viewingPayment.status)}>
                      {viewingPayment.status}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-semibold truncate">Incoming Payment Transaction Details</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => showToast(`Printing receipt for ${viewingPayment.id}...`)}
                  className="p-1.5 sm:p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5 text-xs">
              <div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Customer</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{viewingPayment.customer}</span>
              </div>
              <div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Payment Method</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{viewingPayment.method}</span>
              </div>
              <div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Payment Date</span>
                <span className="font-semibold text-slate-800 block text-xs">{viewingPayment.dateFormatted}</span>
              </div>
              <div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Bank / Account</span>
                <span className="font-semibold text-slate-800 block text-xs truncate">{viewingPayment.bankAccount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-emerald-50/60 p-3.5 sm:p-4 rounded-xl border border-emerald-200 mb-5 sm:mb-6 text-xs gap-2.5">
              <div>
                <span className="text-slate-500 font-semibold block">Total Amount Received</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">${viewingPayment.amountReceived.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-200">
                <span className="text-slate-500 font-semibold block">Allocated Amount</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600">${viewingPayment.allocatedAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3.5 border-t border-slate-100">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
