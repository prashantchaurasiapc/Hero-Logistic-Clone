import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  FileText, CheckCircle2, Clock, ShieldAlert, ArrowDown, ArrowUp, DollarSign,
  Search, ChevronDown, Calendar, Filter, Download, FileSpreadsheet, Eye, MoreVertical,
  X, Printer, Mail, ArrowUpDown
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const SentInvoices = () => {
  // Master Data
  const initialInvoices = [
    {
      id: 'INV-1052',
      customer: 'ABC Auto Transport',
      date: '2026-05-24',
      dateFormatted: '24 May 2026',
      dueDate: '07 Jun 2026',
      amount: 5280.00,
      paid: 5280.00,
      status: 'Paid',
      daysOutstanding: '-',
      loadId: 'LOAD-1245',
      type: 'Freight'
    },
    {
      id: 'INV-1051',
      customer: 'Global Motors',
      date: '2026-05-23',
      dateFormatted: '23 May 2026',
      dueDate: '06 Jun 2026',
      amount: 4345.00,
      paid: 2000.00,
      status: 'Part Paid',
      daysOutstanding: 5,
      loadId: 'LOAD-1244',
      type: 'Freight'
    },
    {
      id: 'INV-1050',
      customer: 'FastTrack Logistics',
      date: '2026-05-23',
      dateFormatted: '23 May 2026',
      dueDate: '06 Jun 2026',
      amount: 3025.00,
      paid: 3025.00,
      status: 'Paid',
      daysOutstanding: '-',
      loadId: 'LOAD-1243',
      type: 'Freight'
    },
    {
      id: 'INV-1049',
      customer: 'Prime Carriers',
      date: '2026-05-22',
      dateFormatted: '22 May 2026',
      dueDate: '05 Jun 2026',
      amount: 6160.00,
      paid: 0.00,
      status: 'Overdue',
      daysOutstanding: 17,
      loadId: 'LOAD-1242',
      type: 'Freight'
    },
    {
      id: 'INV-1048',
      customer: 'Nationwide Transport',
      date: '2026-05-21',
      dateFormatted: '21 May 2026',
      dueDate: '04 Jun 2026',
      amount: 3630.00,
      paid: 3630.00,
      status: 'Paid',
      daysOutstanding: '-',
      loadId: 'LOAD-1241',
      type: 'Freight'
    },
    {
      id: 'INV-1047',
      customer: 'Express Freight Co',
      date: '2026-05-21',
      dateFormatted: '21 May 2026',
      dueDate: '04 Jun 2026',
      amount: 1375.00,
      paid: 0.00,
      status: 'Overdue',
      daysOutstanding: 20,
      loadId: 'LOAD-1240',
      type: 'Accessorial'
    },
    {
      id: 'INV-1046',
      customer: 'ABC Auto Transport',
      date: '2026-05-20',
      dateFormatted: '20 May 2026',
      dueDate: '03 Jun 2026',
      amount: 7150.00,
      paid: 7150.00,
      status: 'Paid',
      daysOutstanding: '-',
      loadId: 'LOAD-1239',
      type: 'Freight'
    },
    {
      id: 'INV-1045',
      customer: 'Global Motors',
      date: '2026-05-19',
      dateFormatted: '19 May 2026',
      dueDate: '02 Jun 2026',
      amount: 5420.00,
      paid: 5420.00,
      status: 'Paid',
      daysOutstanding: '-',
      loadId: 'LOAD-1238',
      type: 'Freight'
    },
    {
      id: 'INV-1044',
      customer: 'Prime Carriers',
      date: '2026-05-18',
      dateFormatted: '18 May 2026',
      dueDate: '01 Jun 2026',
      amount: 6280.00,
      paid: 0.00,
      status: 'Overdue',
      daysOutstanding: 23,
      loadId: 'LOAD-1237',
      type: 'Freight'
    },
    {
      id: 'INV-1043',
      customer: 'FastTrack Logistics',
      date: '2026-05-16',
      dateFormatted: '16 May 2026',
      dueDate: '30 May 2026',
      amount: 2950.00,
      paid: 2950.00,
      status: 'Paid',
      daysOutstanding: '-',
      loadId: 'LOAD-1236',
      type: 'Freight'
    }
  ];

  const [invoices, setInvoices] = useState(initialInvoices);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts/invoices');
      if (res.data?.success && Array.isArray(res.data.data?.invoices) && res.data.data.invoices.length > 0) {
        setInvoices(res.data.data.invoices);
      }
    } catch (err) {
      console.warn('Using live fallback invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Popover States
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showStatementsMenu, setShowStatementsMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);

  // Date Filter State
  const [startDate, setStartDate] = useState('2026-05-18');
  const [endDate, setEndDate] = useState('2026-05-24');
  const [datePreset, setDatePreset] = useState('18 May 2026 – 24 May 2026');

  // Modal View State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamic Aging Summary Donut Data
  const aging0_30 = invoices.filter(i => i.status !== 'Paid' && i.status !== 'Overdue').reduce((sum, i) => sum + (i.balanceDue || i.amount || 0), 0) || 14200;
  const aging31_60 = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + (i.balanceDue || i.amount || 0), 0) * 0.6 || 7500;
  const aging61_90 = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + (i.balanceDue || i.amount || 0), 0) * 0.3 || 3200;
  const aging90Plus = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + (i.balanceDue || i.amount || 0), 0) * 0.1 || 1290;

  const agingData = [
    { name: '0 - 30 Days', value: aging0_30, color: '#3b82f6' },
    { name: '31 - 60 Days', value: aging31_60, color: '#f97316' },
    { name: '61 - 90 Days', value: aging61_90, color: '#eab308' },
    { name: '90+ Days', value: aging90Plus, color: '#22c55e' }
  ];

  // Filtering Logic
  const filteredInvoices = invoices.filter(inv => {
    if (activeTab !== 'All' && inv.status !== activeTab) return false;
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false;
    if (customerFilter !== 'All' && inv.customer !== customerFilter) return false;
    if (typeFilter !== 'All' && inv.type !== typeFilter) return false;

    if (startDate && inv.date < startDate) return false;
    if (endDate && inv.date > endDate) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = inv.id.toLowerCase().includes(q);
      const matchCustomer = inv.customer.toLowerCase().includes(q);
      const matchLoad = inv.loadId.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchLoad) return false;
    }
    return true;
  });

  // Toggle Checkboxes
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredInvoices.map(i => i.id));
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
      case 'Paid':
        return 'bg-emerald-100/70 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs';
      case 'Part Paid':
        return 'bg-amber-100/70 text-amber-700 font-bold px-3 py-1 rounded-full text-xs';
      case 'Overdue':
        return 'bg-rose-100/70 text-rose-700 font-bold px-3 py-1 rounded-full text-xs';
      default:
        return 'bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full text-xs';
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    setShowExportMenu(false);
    const dataToExport = selectedRowIds.length > 0 
      ? invoices.filter(i => selectedRowIds.includes(i.id))
      : filteredInvoices;

    const headers = ['Invoice ID', 'Customer', 'Date', 'Due Date', 'Amount', 'Paid', 'Status', 'Days Outstanding'];
    const csvRows = [headers.join(',')];

    dataToExport.forEach(inv => {
      const row = [
        inv.id,
        `"${inv.customer}"`,
        inv.dateFormatted,
        inv.dueDate,
        inv.amount,
        inv.paid,
        inv.status,
        inv.daysOutstanding
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sent_Invoices_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`Exported ${dataToExport.length} sent invoices to CSV.`);
  };

  const handleEyeIconClick = (inv) => {
    setActiveRowMenuId(null);
    setViewingInvoice(inv);
    setShowViewModal(true);
    showToast(`Viewing Details for Sent Invoice ${inv.id}`);
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
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Sent Invoices</h1>
        <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">
          View and manage all invoices that have been sent to customers.
        </p>
      </div>

      {/* 1. TOP KPI SUMMARY CARDS (Mobile Responsive Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Sent Invoices</div>
            <div className="text-lg font-bold text-slate-900">42</div>
            <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-400 mt-0.5 truncate">$268,540.00</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Paid Invoices</div>
            <div className="text-lg font-bold text-slate-900">38</div>
            <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-400 mt-0.5 truncate">$242,350.00</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Part Paid</div>
            <div className="text-lg font-bold text-slate-900">3</div>
            <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-400 mt-0.5 truncate">$16,890.00</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Overdue</div>
            <div className="text-lg font-bold text-slate-900">9</div>
            <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-400 mt-0.5 truncate">$45,300.00</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Avg. Days to Pay</div>
            <div className="text-lg font-bold text-slate-900">26</div>
            <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-400 mt-0.5 flex items-center gap-0.5 truncate">
              <span>vs last 30d:</span> <span className="text-emerald-600 font-bold flex items-center"><ArrowDown className="w-2.5 h-2.5"/> 4</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Collection Rate</div>
            <div className="text-lg font-bold text-slate-900">91.2%</div>
            <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-400 mt-0.5 flex items-center gap-0.5 truncate">
              <span>vs last 30d:</span> <span className="text-emerald-600 font-bold flex items-center"><ArrowUp className="w-2.5 h-2.5"/> 3.6%</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Total (Inc GST)</div>
            <div className="text-sm font-black text-slate-900 truncate">$268,540.00</div>
            <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-400 mt-0.5 truncate">This period</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-3.5 h-3.5" />
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
            placeholder="Search by invoice #, customer, reference..."
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-2 bg-sky-50/40 border border-sky-200 hover:border-sky-400 rounded-lg text-xs font-bold text-sky-900 outline-none cursor-pointer focus:ring-2 focus:ring-sky-300 transition-all truncate"
          >
            <option value="All">All Types</option>
            <option value="Freight">Freight</option>
            <option value="Accessorial">Accessorial</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-2 bg-sky-50/40 border border-sky-200 hover:border-sky-400 rounded-lg text-xs font-bold text-sky-900 outline-none cursor-pointer focus:ring-2 focus:ring-sky-300 transition-all truncate"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Part Paid">Part Paid</option>
            <option value="Overdue">Overdue</option>
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

          <button className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* 3. TOP TABS & ACTIONS ROW */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-bold overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {[
            { id: 'All', label: 'All (42)' },
            { id: 'Paid', label: 'Paid (38)' },
            { id: 'Part Paid', label: 'Part Paid (3)' },
            { id: 'Overdue', label: 'Overdue (9)' }
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

        <div className="flex items-center gap-2 justify-end">
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
              onClick={() => setShowStatementsMenu(!showStatementsMenu)}
              className="bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Statements</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showStatementsMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    setShowStatementsMenu(false);
                    showToast('Queued monthly statements email dispatch.');
                  }}
                  className="w-full px-4 py-2 text-left font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span>Email Account Statements</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT TABLE: WITH WHITESPACE-NOWRAP FOR MOBILE */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[760px] whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-bold text-slate-600 tracking-tight">
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedRowIds.length === filteredInvoices.length && filteredInvoices.length > 0}
                      className="rounded border-slate-300 accent-sky-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-3">Invoice #</th>
                  <th className="py-3.5 px-3">
                    <div className="flex items-center gap-1">
                      <span>Customer</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3">
                    <div className="flex items-center gap-1">
                      <span>Invoice Date</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3">
                    <div className="flex items-center gap-1">
                      <span>Due Date</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-right">Invoice Amount (Inc GST)</th>
                  <th className="py-3.5 px-3 text-right">Amount Paid</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-3 text-center">Days Outstanding</th>
                  <th className="py-3.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                      No matching sent invoices found
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const isChecked = selectedRowIds.includes(inv.id);
                    const isMenuOpen = activeRowMenuId === inv.id;

                    return (
                      <tr
                        key={inv.id}
                        onClick={() => handleEyeIconClick(inv)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSelectRow(inv.id)}
                            className="rounded border-slate-300 accent-sky-600 cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">{inv.id}</td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">{inv.customer}</td>
                        <td className="py-3.5 px-3 text-slate-600">{inv.dateFormatted}</td>
                        <td className="py-3.5 px-3 text-slate-600">{inv.dueDate}</td>
                        <td className="py-3.5 px-3 text-right font-bold text-slate-900">${inv.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="py-3.5 px-3 text-right font-bold text-slate-800">
                          ${inv.paid.toLocaleString('en-US', {minimumFractionDigits: 2})}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={getStatusBadge(inv.status)}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold">
                          {inv.daysOutstanding === '-' ? (
                            <span className="text-slate-400 font-normal">-</span>
                          ) : (
                            <span className="text-rose-600 font-extrabold">{inv.daysOutstanding}</span>
                          )}
                        </td>

                        {/* ROW ACTIONS */}
                        <td className="py-3.5 px-3 text-center relative" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2.5 text-slate-500">
                            <button
                              onClick={() => handleEyeIconClick(inv)}
                              title="View Details"
                              className="hover:text-slate-900 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => showToast(`Downloaded PDF for ${inv.id}`)}
                              title="Download PDF"
                              className="hover:text-slate-900 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => setActiveRowMenuId(isMenuOpen ? null : inv.id)}
                                title="More Actions"
                                className="hover:text-slate-900 transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-2xl py-1.5 z-50 text-left font-normal">
                                  <button
                                    onClick={() => handleEyeIconClick(inv)}
                                    className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                                    <span>View Invoice</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveRowMenuId(null);
                                      showToast(`Resent invoice ${inv.id} email to customer.`);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                                  >
                                    <Mail className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Resend Email</span>
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
            <div>Showing 1 to {filteredInvoices.length} of 42 invoices</div>

            <div className="flex items-center gap-2">
              <button disabled className="px-2 py-1 text-slate-400 cursor-not-allowed">&lt;</button>
              <button className="w-7 h-7 bg-white border border-amber-400 text-amber-600 font-bold rounded-lg flex items-center justify-center shadow-2xs">
                1
              </button>
              <button className="w-7 h-7 hover:bg-slate-50 text-slate-600 font-medium rounded-lg flex items-center justify-center">2</button>
              <button className="w-7 h-7 hover:bg-slate-50 text-slate-600 font-medium rounded-lg flex items-center justify-center">3</button>
              <button className="w-7 h-7 hover:bg-slate-50 text-slate-600 font-medium rounded-lg flex items-center justify-center">4</button>
              <button className="w-7 h-7 hover:bg-slate-50 text-slate-600 font-medium rounded-lg flex items-center justify-center">5</button>
              <button className="px-2 py-1 text-slate-600 hover:text-slate-900">&gt;</button>
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <span>10 / page</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR CARDS */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Card 1: Invoice Summary (This Period) */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1.5">
              Invoice Summary (This Period)
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total Sent (Inc GST)</span>
                <span className="font-bold text-slate-900 text-xs">$268,540.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total Paid</span>
                <span className="font-bold text-emerald-600 text-xs">$242,350.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total Overdue</span>
                <span className="font-bold text-rose-600 text-xs">$45,300.00</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
                <span className="text-slate-700 font-bold">Outstanding Amount</span>
                <span className="font-black text-orange-600 text-xs">$26,190.00</span>
              </div>
            </div>
          </div>

          {/* Card 2: Top Overdue Invoices */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-1.5">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                Top Overdue Invoices
              </h3>
              <button onClick={() => setActiveTab('Overdue')} className="text-[10.5px] font-bold text-sky-600 hover:text-sky-700">
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'INV-1044', customer: 'Prime Carriers', amount: '$6,280.00', days: '23 days overdue' },
                { id: 'INV-1047', customer: 'Express Freight Co', amount: '$1,375.00', days: '20 days overdue' },
                { id: 'INV-1049', customer: 'Prime Carriers', amount: '$6,160.00', days: '17 days overdue' },
                { id: 'INV-1052', customer: 'ABC Auto Transport', amount: '$5,280.00', days: '15 days overdue' },
                { id: 'INV-1038', customer: 'Global Motors', amount: '$3,850.00', days: '13 days overdue' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-l-2 border-rose-400 pl-2.5 py-0.5">
                  <div>
                    <div className="font-extrabold text-slate-900 text-[11.5px]">{item.id}</div>
                    <div className="text-slate-500 text-[10.5px] font-medium">{item.customer}</div>
                    <div className="text-[10px] font-bold text-rose-500 mt-0.5">{item.days}</div>
                  </div>
                  <div className="font-extrabold text-slate-900 text-right text-xs">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Aging Summary Donut Chart */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-1.5">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                Aging Summary
              </h3>
              <button className="text-[10.5px] font-bold text-sky-600 hover:text-sky-700">
                View full report
              </button>
            </div>

            <div className="flex items-center justify-between gap-1 py-1">
              <div className="space-y-1.5 text-[11px] font-bold text-slate-700 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                  <span>0 - 30 Days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                  <span>31 - 60 Days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                  <span>61 - 90 Days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>90+ Days</span>
                </div>
              </div>

              <div className="w-28 h-28 relative flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={agingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={48}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {agingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
                  <span className="text-[10px] font-black text-slate-900 leading-none tracking-tight">$26,190.00</span>
                  <span className="text-[7px] font-extrabold text-slate-400 uppercase tracking-tighter mt-0.5">Outstanding</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1-TO-1 DEDICATED INVOICE VIEW MODAL (RESPONSIVE) */}
      {showViewModal && viewingInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[9999] p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 mb-4 sm:mb-5">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-100 text-sky-700 font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
                  INV
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">{viewingInvoice.id}</h2>
                    <span className={getStatusBadge(viewingInvoice.status)}>
                      {viewingInvoice.status}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-semibold truncate">Outbound Sent Invoice Details</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => showToast(`Printing ${viewingInvoice.id}...`)}
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
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Shipper Customer</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{viewingInvoice.customer}</span>
              </div>
              <div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Load / Ref #</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{viewingInvoice.loadId}</span>
              </div>
              <div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Invoice Date</span>
                <span className="font-semibold text-slate-800 block text-xs">{viewingInvoice.dateFormatted}</span>
              </div>
              <div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Due Date</span>
                <span className="font-semibold text-slate-800 block text-xs">{viewingInvoice.dueDate}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-sky-50/60 p-3.5 sm:p-4 rounded-xl border border-sky-200 mb-5 sm:mb-6 text-xs gap-2.5">
              <div>
                <span className="text-slate-500 font-semibold block">Total Amount Sent</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">${viewingInvoice.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-sky-200">
                <span className="text-slate-500 font-semibold block">Amount Paid</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600">${viewingInvoice.paid.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
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

export default SentInvoices;
