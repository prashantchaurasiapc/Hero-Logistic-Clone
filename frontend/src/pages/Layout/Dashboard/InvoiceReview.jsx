import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  FileText, FileCheck, Send, PauseCircle, XCircle, Search, ChevronDown, Calendar,
  Filter, Download, Plus, Eye, Edit2, MoreVertical, Building2, Bell, CheckCircle2,
  Paperclip, MessageSquare, Clock, ArrowRight, X, Check, FileSpreadsheet, Trash2,
  RotateCcw, Printer, Share2, RefreshCw
} from 'lucide-react';

const InvoiceReview = () => {
  // Master Invoices State Data
  const initialInvoices = [
    {
      id: 'INV-1056',
      realId: '1',
      customer: 'ABC Auto Transport',
      date: '2026-05-24',
      dateFormatted: '24 May 2026',
      dueDate: '07 Jun 2026',
      loadId: 'LOAD-1245',
      type: 'Freight',
      subtotal: 4800,
      gst: 480,
      total: 5280,
      status: 'In Review',
      notes: 'Customer requested electronic POD attachment before final invoice submittal.',
      attachments: [
        { name: 'Proof_Of_Delivery_POD-1245.pdf', size: '1.2 MB' },
        { name: 'Rate_Confirmation_RC-9982.pdf', size: '450 KB' }
      ],
      history: [
        { action: 'Generated automatically from stop completion', time: '24 May 2026 09:30 AM' },
        { action: "Moved to 'In Review' queue", time: '24 May 2026 10:15 AM' }
      ],
      items: [
        { desc: 'Linehaul - Sydney to Brisbane', qty: 1, rate: 3500, amount: 3500, gst: 350, total: 3850 },
        { desc: 'Fuel Surcharge (10%)', qty: 1, rate: 350, amount: 350, gst: 35, total: 385 },
        { desc: 'Toll Charge', qty: 1, rate: 950, amount: 950, gst: 95, total: 1045 }
      ]
    },
    {
      id: 'INV-1055',
      realId: '2',
      customer: 'Global Motors',
      date: '2026-05-23',
      dateFormatted: '23 May 2026',
      dueDate: '06 Jun 2026',
      loadId: 'LOAD-1244',
      type: 'Freight',
      subtotal: 3950,
      gst: 395,
      total: 4345,
      status: 'In Review',
      notes: 'Special handling fee included as per contract agreement Section 4B.',
      attachments: [
        { name: 'POD_Global_LOAD-1244.pdf', size: '980 KB' },
        { name: 'Weight_Bridge_Cert.pdf', size: '310 KB' }
      ],
      history: [
        { action: 'Draft created by Billing Dept', time: '23 May 2026 02:15 PM' },
        { action: 'Review requested by Manager', time: '23 May 2026 04:00 PM' }
      ],
      items: [
        { desc: 'Linehaul - Melbourne to Adelaide', qty: 1, rate: 3600, amount: 3600, gst: 360, total: 3960 },
        { desc: 'Loading Assistance', qty: 1, rate: 350, amount: 350, gst: 35, total: 385 }
      ]
    },
    {
      id: 'INV-1054',
      realId: '3',
      customer: 'FastTrack Logistics',
      date: '2026-05-23',
      dateFormatted: '23 May 2026',
      dueDate: '06 Jun 2026',
      loadId: 'LOAD-1243',
      type: 'Freight',
      subtotal: 2750,
      gst: 275,
      total: 3025,
      status: 'Draft',
      notes: 'Awaiting signature approval from receiver site supervisor.',
      attachments: [
        { name: 'Delivery_Receipt_LOAD-1243.pdf', size: '1.5 MB' }
      ],
      history: [
        { action: 'Created as Draft invoice', time: '23 May 2026 11:00 AM' }
      ],
      items: [
        { desc: 'Express Transport - Sydney to Newcastle', qty: 1, rate: 2750, amount: 2750, gst: 275, total: 3025 }
      ]
    },
    {
      id: 'INV-1053',
      realId: '4',
      customer: 'Prime Carriers',
      date: '2026-05-22',
      dateFormatted: '22 May 2026',
      dueDate: '05 Jun 2026',
      loadId: 'LOAD-1242',
      type: 'Freight',
      subtotal: 5600,
      gst: 560,
      total: 6160,
      status: 'Ready to Send',
      notes: 'Pre-approved rate confirmation attached.',
      attachments: [
        { name: 'Heavy_Haulage_Permit.pdf', size: '2.1 MB' },
        { name: 'Signed_POD_Prime.pdf', size: '1.1 MB' }
      ],
      history: [
        { action: 'Invoice verified & approved', time: '22 May 2026 03:45 PM' }
      ],
      items: [
        { desc: 'Heavy Haulage Freight - Perth to Kalgoorlie', qty: 1, rate: 5600, amount: 5600, gst: 560, total: 6160 }
      ]
    }
  ];

  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('INV-1056');
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [detailsSubTab, setDetailsSubTab] = useState('items');
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts/invoices');
      if (res.data?.success && Array.isArray(res.data.data?.invoices) && res.data.data.invoices.length > 0) {
        setInvoices(res.data.data.invoices);
        if (!selectedInvoiceId || !res.data.data.invoices.some(i => i.id === selectedInvoiceId)) {
          setSelectedInvoiceId(res.data.data.invoices[0]?.id);
        }
      }
    } catch (err) {
      console.warn('Using live fallback invoices data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Dropdown & Popover States
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);

  // Date Filter State
  const [startDate, setStartDate] = useState('2026-05-18');
  const [endDate, setEndDate] = useState('2026-05-24');
  const [datePreset, setDatePreset] = useState('18 May 2026 – 24 May 2026');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const [newInvoice, setNewInvoice] = useState({
    customer: 'ABC Auto Transport',
    loadId: 'LOAD-1246',
    type: 'Freight',
    subtotal: 4200,
    itemsDesc: 'Linehaul - Brisbane to Sydney'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId) || invoices[0];

  const handleApproveInvoice = async (inv) => {
    try {
      const targetId = inv.realId || inv.id;
      await api.put(`/accounts/invoices/${targetId}/approve`, { status: 'SENT' });
      showToast(`✓ Invoice ${inv.id} approved and marked as Sent.`);
      fetchInvoices();
    } catch (err) {
      showToast(`✓ Invoice ${inv.id} approved locally.`);
      setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'Sent' } : i));
    }
  };

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

  // Toggle selection
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

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Draft':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Ready to Send':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'On Hold':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleUpdateStatus = (invId, newStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === invId ? { ...inv, status: newStatus } : inv));
    if (viewingInvoice && viewingInvoice.id === invId) {
      setViewingInvoice(prev => ({ ...prev, status: newStatus }));
    }
    showToast(`Invoice ${invId} updated to '${newStatus}'`);
  };

  const handleEyeIconClick = (inv) => {
    setActiveRowMenuId(null);
    setSelectedInvoiceId(inv.id);
    setViewingInvoice(inv);
    setShowViewModal(true);
    showToast(`Viewing 1-to-1 Details for Invoice ${inv.id}`);
  };

  const applyDatePreset = (presetName, start, end) => {
    setStartDate(start);
    setEndDate(end);
    setDatePreset(presetName);
    setShowDatePicker(false);
    showToast(`Filter applied: ${presetName}`);
  };

  const handleResetDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setDatePreset('All Dates');
    setShowDatePicker(false);
    showToast('Date range reset to show all invoices.');
  };

  const handleExportCSV = () => {
    setShowExportMenu(false);
    const dataToExport = selectedRowIds.length > 0 
      ? invoices.filter(i => selectedRowIds.includes(i.id))
      : filteredInvoices;

    const headers = ['Invoice ID', 'Customer', 'Date', 'Due Date', 'Load ID', 'Type', 'Subtotal', 'GST', 'Total', 'Status'];
    const csvRows = [headers.join(',')];

    dataToExport.forEach(inv => {
      const row = [
        inv.id,
        `"${inv.customer}"`,
        inv.dateFormatted,
        inv.dueDate,
        inv.loadId,
        inv.type,
        inv.subtotal,
        inv.gst,
        inv.total,
        inv.status
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`Exported ${dataToExport.length} invoices to CSV file.`);
  };

  const handleBulkAction = (actionType) => {
    setShowBulkMenu(false);
    if (selectedRowIds.length === 0) {
      showToast('Please select at least one invoice checkbox.');
      return;
    }

    if (actionType === 'approve') {
      setInvoices(prev => prev.map(inv => selectedRowIds.includes(inv.id) ? { ...inv, status: 'Ready to Send' } : inv));
      showToast(`Approved & marked ${selectedRowIds.length} invoices as 'Ready to Send'.`);
    } else if (actionType === 'hold') {
      setInvoices(prev => prev.map(inv => selectedRowIds.includes(inv.id) ? { ...inv, status: 'On Hold' } : inv));
      showToast(`Placed ${selectedRowIds.length} invoices on 'Hold'.`);
    } else if (actionType === 'reject') {
      setInvoices(prev => prev.map(inv => selectedRowIds.includes(inv.id) ? { ...inv, status: 'Rejected' } : inv));
      showToast(`Marked ${selectedRowIds.length} invoices as 'Rejected'.`);
    } else if (actionType === 'delete') {
      setInvoices(prev => prev.filter(inv => !selectedRowIds.includes(inv.id)));
      setSelectedRowIds([]);
      showToast(`Deleted ${selectedRowIds.length} selected invoices.`);
    }
  };

  const handleOpenEditModal = (inv) => {
    setActiveRowMenuId(null);
    setEditingInvoice({
      ...inv,
      itemsDesc: inv.items[0]?.desc || 'Linehaul Delivery'
    });
    setShowEditModal(true);
  };

  const handleSaveEditInvoice = (e) => {
    e.preventDefault();
    const sub = Number(editingInvoice.subtotal);
    const gstVal = sub * 0.1;
    const tot = sub + gstVal;

    setInvoices(prev => prev.map(inv => {
      if (inv.id === editingInvoice.id) {
        return {
          ...inv,
          customer: editingInvoice.customer,
          loadId: editingInvoice.loadId,
          type: editingInvoice.type,
          status: editingInvoice.status,
          subtotal: sub,
          gst: gstVal,
          total: tot,
          items: [
            { desc: editingInvoice.itemsDesc, qty: 1, rate: sub, amount: sub, gst: gstVal, total: tot }
          ]
        };
      }
      return inv;
    }));

    setShowEditModal(false);
    showToast(`Invoice ${editingInvoice.id} updated successfully.`);
  };

  const handleDeleteSingleInvoice = (id) => {
    setActiveRowMenuId(null);
    setInvoices(prev => prev.filter(i => i.id !== id));
    if (selectedInvoiceId === id) {
      setSelectedInvoiceId(invoices.find(i => i.id !== id)?.id || '');
    }
    showToast(`Invoice ${id} deleted.`);
  };

  const handleCreateInvoiceSubmit = (e) => {
    e.preventDefault();
    const sub = Number(newInvoice.subtotal);
    const gstVal = sub * 0.1;
    const tot = sub + gstVal;
    const newId = `INV-${1056 + invoices.length}`;
    const newObj = {
      id: newId,
      customer: newInvoice.customer,
      date: '2026-05-31',
      dateFormatted: '31 May 2026',
      dueDate: '14 Jun 2026',
      loadId: newInvoice.loadId,
      type: newInvoice.type,
      subtotal: sub,
      gst: gstVal,
      total: tot,
      status: 'Draft',
      notes: 'New draft invoice created via system dashboard.',
      attachments: [{ name: 'Draft_Manifest.pdf', size: '500 KB' }],
      history: [{ action: 'Created via Dashboard', time: '31 May 2026 12:00 PM' }],
      items: [
        { desc: newInvoice.itemsDesc, qty: 1, rate: sub, amount: sub, gst: gstVal, total: tot }
      ]
    };
    setInvoices([newObj, ...invoices]);
    setSelectedInvoiceId(newId);
    setShowCreateModal(false);
    showToast(`New Draft Invoice ${newId} created successfully.`);
  };

  return (
    <div className="p-3 sm:p-6 bg-[#f8fafc] min-h-screen font-sans text-left relative overflow-x-hidden">
      {/* Toast Notification Banner */}
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

      {/* ============================================================
         HEADER SECTION
         ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Invoice Review</h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 sm:mt-1">
            Review, verify and approve invoices before sending to customers.
          </p>
        </div>
      </div>

      {/* ============================================================
         1. TOP KPI SUMMARY CARDS
         ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Draft Invoices</div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">12</div>
            <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-400 mt-0.5 truncate">$46,750.00</div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="bg-amber-50/60 p-3 sm:p-3.5 rounded-xl border-2 border-amber-300 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-amber-800 mb-0.5 sm:mb-1 truncate">In Review</div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">7</div>
            <div className="text-[9.5px] sm:text-[10px] font-semibold text-amber-700 mt-0.5 truncate">$28,940.00</div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Ready to Send</div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">5</div>
            <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-400 mt-0.5 truncate">$21,680.00</div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">On Hold</div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">2</div>
            <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-400 mt-0.5 truncate">$6,320.00</div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <PauseCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Rejected</div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">1</div>
            <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-400 mt-0.5 truncate">$1,250.00</div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-0.5 sm:mb-1 truncate">Total In Review</div>
            <div className="text-base sm:text-lg font-black text-slate-900 truncate">$28,940.00</div>
            <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-400 mt-0.5 truncate">7 invoices</div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>

      {/* ============================================================
         2. FILTERS & ACTIONS ROW (Grid Layout for Mobile)
         ============================================================ */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs mb-5 sm:mb-6 space-y-3 sm:space-y-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice #, customer, load #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-sky-500 focus:bg-sky-50/20 transition-all"
          />
        </div>

        {/* Dropdowns Controls: Grid 2 Columns on Mobile, Flex on Desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
          {/* Customer Filter */}
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

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-2 bg-sky-50/40 border border-sky-200 hover:border-sky-400 rounded-lg text-xs font-bold text-sky-900 outline-none cursor-pointer focus:ring-2 focus:ring-sky-300 transition-all truncate"
          >
            <option value="All">All Types</option>
            <option value="Freight">Freight</option>
            <option value="Accessorial">Accessorial</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-2 bg-sky-50/40 border border-sky-200 hover:border-sky-400 rounded-lg text-xs font-bold text-sky-900 outline-none cursor-pointer focus:ring-2 focus:ring-sky-300 transition-all truncate"
          >
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="In Review">In Review</option>
            <option value="Ready to Send">Ready to Send</option>
            <option value="On Hold">On Hold</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* DATE PICKER BUTTON & POPOVER */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full sm:w-auto bg-sky-50/50 hover:bg-sky-100 border border-sky-200 hover:border-sky-400 rounded-lg px-2.5 py-2 text-xs text-sky-900 font-bold flex items-center justify-between gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <span className="truncate">{datePreset}</span>
              <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            </button>

            {/* Date Picker Popover Panel */}
            {showDatePicker && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in duration-150 text-xs">
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
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none focus:border-sky-500"
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
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 mb-3 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Quick Presets</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => applyDatePreset('18-24 May 2026', '2026-05-18', '2026-05-24')}
                      className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold rounded text-[10.5px]"
                    >
                      18-24 May 2026
                    </button>
                    <button
                      onClick={() => applyDatePreset('Last 7 Days', '2026-05-17', '2026-05-24')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10.5px]"
                    >
                      Last 7 Days
                    </button>
                    <button
                      onClick={() => applyDatePreset('This Month', '2026-05-01', '2026-05-31')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10.5px]"
                    >
                      This Month
                    </button>
                    <button
                      onClick={handleResetDateFilter}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded text-[10.5px] flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowDatePicker(false)}
                  className="w-full py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold rounded-lg shadow-2xs"
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

        {/* Status Tabs (Horizontally Scrollable) */}
        <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto pb-2 pt-2 border-t border-slate-100 no-scrollbar">
          {[
            { id: 'All', label: `All (${invoices.length})` },
            { id: 'Draft', label: 'Draft (12)' },
            { id: 'In Review', label: 'In Review (7)' },
            { id: 'Ready to Send', label: 'Ready to Send (5)' },
            { id: 'On Hold', label: 'On Hold (2)' },
            { id: 'Rejected', label: 'Rejected (1)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-900 font-extrabold shadow-2xs scale-105'
                  : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700 font-semibold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 border-t border-slate-100">
          <div className="relative flex-1 sm:flex-none">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="w-full sm:w-auto bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showExportMenu && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in duration-150">
                <button
                  onClick={handleExportCSV}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export Filtered as CSV</span>
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    showToast('Generated PDF audit report.');
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>Export Summary PDF</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative flex-1 sm:flex-none">
            <button
              onClick={() => setShowBulkMenu(!showBulkMenu)}
              className="w-full sm:w-auto bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <span>Bulk {selectedRowIds.length > 0 ? `(${selectedRowIds.length})` : ''}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showBulkMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Apply to Selected ({selectedRowIds.length})
                </div>
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Approve Selected</span>
                </button>
                <button
                  onClick={() => handleBulkAction('hold')}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                >
                  <PauseCircle className="w-4 h-4 text-amber-600" />
                  <span>Hold Selected</span>
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Reject Selected</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span>Delete Selected</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 sm:flex-none bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* ============================================================
         3. INVOICES TABLE (WITH WHITESPACE-NOWRAP & SMOOTH MOBILE SCROLL)
         ============================================================ */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden mb-5 sm:mb-6">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px] whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] sm:text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedRowIds.length === filteredInvoices.length && filteredInvoices.length > 0}
                    className="rounded border-slate-300 accent-sky-600 cursor-pointer"
                  />
                </th>
                <th className="p-3">Invoice #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Invoice Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Ref / Load #</th>
                <th className="p-3">Type</th>
                <th className="p-3">Subtotal</th>
                <th className="p-3">GST</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                    No matching invoices found
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isSelected = selectedInvoiceId === inv.id;
                  const isChecked = selectedRowIds.includes(inv.id);
                  const isMenuOpen = activeRowMenuId === inv.id;

                  return (
                    <tr
                      key={inv.id}
                      onClick={() => handleEyeIconClick(inv)}
                      className={`hover:bg-sky-50/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-50/60 font-semibold border-l-4 border-l-sky-500' : ''
                      }`}
                    >
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectRow(inv.id)}
                          className="rounded border-slate-300 accent-sky-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-bold text-slate-900">{inv.id}</td>
                      <td className="p-3 font-semibold text-slate-800">{inv.customer}</td>
                      <td className="p-3 text-slate-600">{inv.dateFormatted}</td>
                      <td className="p-3 text-slate-600">{inv.dueDate}</td>
                      <td className="p-3 text-slate-600">{inv.loadId}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                          inv.type === 'Freight' 
                            ? 'bg-purple-50 text-purple-700 border-purple-100' 
                            : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}>
                          {inv.type}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">${inv.subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td className="p-3 text-slate-600">${inv.gst.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td className="p-3 font-bold text-slate-900">${inv.total.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold border ${getStatusBadge(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>

                      {/* ACTION BUTTONS */}
                      <td className="p-3 text-center relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5 text-slate-500">
                          {/* EYE ICON */}
                          <button
                            onClick={() => handleEyeIconClick(inv)}
                            title="View 1-to-1 Invoice Details"
                            className="p-1.5 bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white rounded-lg transition-all shadow-2xs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* EDIT ICON */}
                          <button
                            onClick={() => handleOpenEditModal(inv)}
                            title="Edit Invoice"
                            className="p-1.5 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* MORE MENU */}
                          <div className="relative">
                            <button
                              onClick={() => setActiveRowMenuId(isMenuOpen ? null : inv.id)}
                              title="More Options"
                              className="p-1.5 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-2xl py-1.5 z-50 animate-in fade-in duration-150 text-left font-normal">
                                <button
                                  onClick={() => handleEyeIconClick(inv)}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                                >
                                  <Eye className="w-3.5 h-3.5 text-sky-600" />
                                  <span>View Details</span>
                                </button>
                                <button
                                  onClick={() => handleOpenEditModal(inv)}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-sky-600" />
                                  <span>Edit Invoice</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleUpdateStatus(inv.id, 'Ready to Send');
                                    setActiveRowMenuId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Mark Ready to Send</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleUpdateStatus(inv.id, 'On Hold');
                                    setActiveRowMenuId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                                >
                                  <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Place on Hold</span>
                                </button>
                                <div className="border-t border-slate-100 my-1" />
                                <button
                                  onClick={() => handleDeleteSingleInvoice(inv.id)}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  <span>Delete Invoice</span>
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

        {/* Table Footer */}
        <div className="p-3 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-semibold">
          <div>Showing 1 to {filteredInvoices.length} of {filteredInvoices.length} invoices</div>
          
          <div className="flex items-center gap-2">
            <button disabled className="px-2 py-1 border border-slate-200 rounded text-slate-300 cursor-not-allowed">&lt;</button>
            <button className="px-2.5 py-1 bg-amber-400 text-slate-900 font-bold rounded shadow-2xs">1</button>
            <button disabled className="px-2 py-1 border border-slate-200 rounded text-slate-300 cursor-not-allowed">&gt;</button>
          </div>

          <div className="flex items-center gap-1">
            <span>10 / page</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ============================================================
         4. INVOICE PREVIEW & DETAILS PANEL (BOTTOM SECTION)
         ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Card: Invoice Metadata */}
        <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Invoice Preview &amp; Details</h3>
              <button
                onClick={() => handleEyeIconClick(selectedInvoice)}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                Full View <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 bg-sky-100 text-sky-900 font-black rounded-lg text-xs">
                {selectedInvoice.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold border ${getStatusBadge(selectedInvoice.status)}`}>
                {selectedInvoice.status}
              </span>
            </div>

            <div className="space-y-2.5 sm:space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-semibold">Customer</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px] text-right">{selectedInvoice.customer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-semibold">Invoice Date</span>
                <span className="font-semibold text-slate-800">{selectedInvoice.dateFormatted}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-semibold">Due Date</span>
                <span className="font-semibold text-slate-800">{selectedInvoice.dueDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-semibold">Ref / Load #</span>
                <span className="font-semibold text-slate-800">{selectedInvoice.loadId}</span>
              </div>
            </div>
          </div>

          {/* Financial Totals */}
          <div className="pt-3.5 border-t border-slate-100 mt-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 font-semibold">
              <span>Subtotal (Ex GST)</span>
              <span>${selectedInvoice.subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-semibold">
              <span>GST (10%)</span>
              <span>${selectedInvoice.gst.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
              <span>Total (Inc GST)</span>
              <span>${selectedInvoice.total.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Invoice Type</span>
              <span className="font-semibold text-slate-700">{selectedInvoice.type}</span>
            </div>
          </div>
        </div>

        {/* Center Card: Line Items & Sub-Tabs */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Sub Tabs */}
            <div className="flex items-center gap-3 sm:gap-4 border-b border-slate-100 pb-2 mb-3 sm:mb-4 text-xs font-bold overflow-x-auto no-scrollbar">
              <button
                onClick={() => setDetailsSubTab('items')}
                className={`pb-1 border-b-2 transition-colors shrink-0 whitespace-nowrap ${
                  detailsSubTab === 'items'
                    ? 'border-amber-400 text-slate-900 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Items ({selectedInvoice.items.length})
              </button>

              <button
                onClick={() => setDetailsSubTab('attachments')}
                className={`pb-1 border-b-2 transition-colors shrink-0 whitespace-nowrap ${
                  detailsSubTab === 'attachments'
                    ? 'border-amber-400 text-slate-900 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Attachments ({selectedInvoice.attachments?.length || 0})
              </button>

              <button
                onClick={() => setDetailsSubTab('notes')}
                className={`pb-1 border-b-2 transition-colors shrink-0 whitespace-nowrap ${
                  detailsSubTab === 'notes'
                    ? 'border-amber-400 text-slate-900 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Notes
              </button>

              <button
                onClick={() => setDetailsSubTab('history')}
                className={`pb-1 border-b-2 transition-colors shrink-0 whitespace-nowrap ${
                  detailsSubTab === 'history'
                    ? 'border-amber-400 text-slate-900 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                History
              </button>
            </div>

            {/* Tab Content */}
            {detailsSubTab === 'items' && (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse text-xs min-w-[450px] whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="py-2 pr-2">Item Description</th>
                      <th className="py-2 px-2 text-center">Qty</th>
                      <th className="py-2 px-2 text-right">Rate</th>
                      <th className="py-2 px-2 text-right">Amount</th>
                      <th className="py-2 px-2 text-right">GST</th>
                      <th className="py-2 pl-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 pr-2 font-semibold text-slate-900">{item.desc}</td>
                        <td className="py-2 px-2 text-center">{item.qty}</td>
                        <td className="py-2 px-2 text-right">${item.rate.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="py-2 px-2 text-right">${item.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="py-2 px-2 text-right">${item.gst.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="py-2 pl-2 text-right font-bold text-slate-900">${item.total.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {detailsSubTab === 'attachments' && (
              <div className="space-y-2 py-2 text-xs">
                {selectedInvoice.attachments?.map((att, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Paperclip className="w-4 h-4 text-sky-600 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">{att.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold shrink-0">{att.size}</span>
                  </div>
                ))}
              </div>
            )}

            {detailsSubTab === 'notes' && (
              <div className="py-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-600" /> Note from Dispatcher:
                </div>
                {selectedInvoice.notes || 'No specific notes recorded.'}
              </div>
            )}

            {detailsSubTab === 'history' && (
              <div className="space-y-2 py-2 text-xs">
                {selectedInvoice.history?.map((hist, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-500 border-b border-slate-100 pb-1.5 gap-0.5">
                    <span>{hist.action}</span>
                    <span className="text-[10px] text-slate-400">{hist.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Action Buttons */}
        <div className="lg:col-span-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 sm:mb-4">Actions</h3>

            <div className="space-y-2.5 sm:space-y-3">
              <button
                onClick={() => handleUpdateStatus(selectedInvoice.id, 'Ready to Send')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Approve &amp; Send</span>
              </button>

              <button
                onClick={() => handleUpdateStatus(selectedInvoice.id, 'Ready to Send')}
                className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Save &amp; Mark Ready</span>
              </button>

              <button
                onClick={() => handleUpdateStatus(selectedInvoice.id, 'On Hold')}
                className="w-full bg-white hover:bg-amber-50/50 text-amber-700 border border-amber-300 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Hold Invoice</span>
              </button>

              <button
                onClick={() => handleUpdateStatus(selectedInvoice.id, 'Rejected')}
                className="w-full bg-white hover:bg-rose-50/50 text-rose-600 border border-rose-200 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Reject Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
         1-TO-1 DEDICATED INVOICE VIEW MODAL
         ============================================================ */}
      {showViewModal && viewingInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[9999] p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 mb-4 sm:mb-5">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-100 text-sky-700 font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
                  INV
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">{viewingInvoice.id}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[10.5px] font-extrabold border shrink-0 ${getStatusBadge(viewingInvoice.status)}`}>
                      {viewingInvoice.status}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-semibold truncate">1-to-1 Detailed Invoice Audit Manifest</p>
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

            {/* Invoice Summary Card */}
            <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5 text-xs">
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

            {/* Particular Invoice Items Table */}
            <div className="mb-5 sm:mb-6">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Invoice Line Items</h3>
              <div className="border border-slate-200 rounded-xl overflow-x-auto w-full">
                <table className="w-full text-left border-collapse text-xs min-w-[500px] whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[10px] sm:text-[10.5px] font-extrabold text-slate-600 uppercase">
                      <th className="p-2 sm:p-2.5">Item Description</th>
                      <th className="p-2 sm:p-2.5 text-center">Qty</th>
                      <th className="p-2 sm:p-2.5 text-right">Rate</th>
                      <th className="p-2 sm:p-2.5 text-right">Amount</th>
                      <th className="p-2 sm:p-2.5 text-right">GST (10%)</th>
                      <th className="p-2 sm:p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {viewingInvoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 sm:p-2.5 font-bold text-slate-900">{item.desc}</td>
                        <td className="p-2 sm:p-2.5 text-center font-bold">{item.qty}</td>
                        <td className="p-2 sm:p-2.5 text-right">${item.rate.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="p-2 sm:p-2.5 text-right">${item.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="p-2 sm:p-2.5 text-right text-slate-600">${item.gst.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="p-2 sm:p-2.5 text-right font-black text-slate-900">${item.total.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Financial Summary Box */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-sky-50/50 p-3.5 sm:p-4 rounded-xl border border-sky-200 mb-5 sm:mb-6 gap-2.5">
              <div>
                <span className="text-xs font-bold text-sky-900 block">Subtotal: ${viewingInvoice.subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                <span className="text-[11px] sm:text-xs font-semibold text-sky-700 block">GST Component (10%): ${viewingInvoice.gst.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-sky-200">
                <span className="text-[9.5px] sm:text-[10px] font-extrabold text-slate-400 uppercase block">Grand Total</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">${viewingInvoice.total.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3.5 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(viewingInvoice.id, 'Ready to Send')}
                  className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Check className="w-4 h-4" /> Approve &amp; Mark Ready
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewingInvoice.id, 'On Hold')}
                  className="px-3.5 py-2 bg-white border border-amber-300 text-amber-700 font-bold rounded-xl text-xs hover:bg-amber-50"
                >
                  Hold
                </button>
              </div>

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

      {/* ============================================================
         CREATE INVOICE MODAL
         ============================================================ */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[9999] p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-lg w-full p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900">Create New Invoice Draft</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-3 sm:space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Shipper Customer</label>
                <select
                  value={newInvoice.customer}
                  onChange={e => setNewInvoice({...newInvoice, customer: e.target.value})}
                  className="w-full p-2 bg-sky-50/50 border border-sky-200 rounded-lg font-semibold text-slate-800 outline-none"
                >
                  <option value="ABC Auto Transport">ABC Auto Transport</option>
                  <option value="Global Motors">Global Motors</option>
                  <option value="FastTrack Logistics">FastTrack Logistics</option>
                  <option value="Prime Carriers">Prime Carriers</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Load / Reference #</label>
                <input
                  type="text"
                  value={newInvoice.loadId}
                  onChange={e => setNewInvoice({...newInvoice, loadId: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Invoice Type</label>
                  <select
                    value={newInvoice.type}
                    onChange={e => setNewInvoice({...newInvoice, type: e.target.value})}
                    className="w-full p-2 bg-sky-50/50 border border-sky-200 rounded-lg font-semibold text-slate-800 outline-none"
                  >
                    <option value="Freight">Freight</option>
                    <option value="Accessorial">Accessorial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subtotal (Ex GST $)</label>
                  <input
                    type="number"
                    value={newInvoice.subtotal}
                    onChange={e => setNewInvoice({...newInvoice, subtotal: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Item Description</label>
                <input
                  type="text"
                  value={newInvoice.itemsDesc}
                  onChange={e => setNewInvoice({...newInvoice, itemsDesc: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-xl font-black shadow-2xs"
                >
                  Save Draft Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
         EDIT INVOICE MODAL
         ============================================================ */}
      {showEditModal && editingInvoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[9999] p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-lg w-full p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900">Edit Invoice {editingInvoice.id}</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditInvoice} className="space-y-3 sm:space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Shipper Customer</label>
                <select
                  value={editingInvoice.customer}
                  onChange={e => setEditingInvoice({...editingInvoice, customer: e.target.value})}
                  className="w-full p-2 bg-sky-50/50 border border-sky-200 rounded-lg font-semibold text-slate-800 outline-none"
                >
                  <option value="ABC Auto Transport">ABC Auto Transport</option>
                  <option value="Global Motors">Global Motors</option>
                  <option value="FastTrack Logistics">FastTrack Logistics</option>
                  <option value="Prime Carriers">Prime Carriers</option>
                  <option value="Nationwide Transport">Nationwide Transport</option>
                  <option value="Express Freight Co">Express Freight Co</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Load / Reference #</label>
                  <input
                    type="text"
                    value={editingInvoice.loadId}
                    onChange={e => setEditingInvoice({...editingInvoice, loadId: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingInvoice.status}
                    onChange={e => setEditingInvoice({...editingInvoice, status: e.target.value})}
                    className="w-full p-2 bg-sky-50/50 border border-sky-200 rounded-lg font-semibold text-slate-800 outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review</option>
                    <option value="Ready to Send">Ready to Send</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Invoice Type</label>
                  <select
                    value={editingInvoice.type}
                    onChange={e => setEditingInvoice({...editingInvoice, type: e.target.value})}
                    className="w-full p-2 bg-sky-50/50 border border-sky-200 rounded-lg font-semibold text-slate-800 outline-none"
                  >
                    <option value="Freight">Freight</option>
                    <option value="Accessorial">Accessorial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subtotal (Ex GST $)</label>
                  <input
                    type="number"
                    value={editingInvoice.subtotal}
                    onChange={e => setEditingInvoice({...editingInvoice, subtotal: e.target.value})}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Line Item Description</label>
                <input
                  type="text"
                  value={editingInvoice.itemsDesc}
                  onChange={e => setEditingInvoice({...editingInvoice, itemsDesc: e.target.value})}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-black shadow-2xs"
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

export default InvoiceReview;
