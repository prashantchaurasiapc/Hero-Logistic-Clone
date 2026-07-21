import React, { useState } from 'react';
import { 
  Search, Plus, ChevronDown, Calendar, FileText, DollarSign, 
  Building, AlertTriangle, Filter, Download, RefreshCw, Eye,
  Check, X, CreditCard, ChevronLeft, ChevronRight, ArrowLeft,
  ArrowUpRight, ArrowDownRight, Code2, MoreHorizontal, Mail, Printer, FilePlus, Edit, User, MapPin, Phone, ExternalLink, Clock,
  HelpCircle, Shield, ShieldCheck, Bell, MoreVertical, TrendingUp, CheckCircle2, Code, Percent, BarChart2, PieChart, Cloud, History, Share2
} from 'lucide-react';

export default function Finance() {
  // Navigation View Mode: 'dashboard' (10.1) | 'invoices' (10.2) | 'invoice_details' (10.3) | 'payments_receipts' (10.4)
  const [viewMode, setViewMode] = useState('dashboard');

  // Filter & UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedCustomer, setSelectedCustomer] = useState('All Customers');
  const [selectedStatus, setSelectedStatus] = useState('All Payment Status');
  const [selectedType, setSelectedType] = useState('All Invoice Types');
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Month');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);

  // States for 10.4 Payments & Receipts page
  const [prSearchQuery, setPrSearchQuery] = useState('');
  const [prSelectedBranch, setPrSelectedBranch] = useState('All Branches');
  const [prSelectedType, setPrSelectedType] = useState('All Payment Types');
  const [prSelectedStatus, setPrSelectedStatus] = useState('All Status');

  // States for 10.5 Expenses page
  const [expSearchQuery, setExpSearchQuery] = useState('');
  const [expSelectedBranch, setExpSelectedBranch] = useState('All Branches');
  const [expSelectedCategory, setExpSelectedCategory] = useState('All Categories');
  const [expSelectedType, setExpSelectedType] = useState('All Payment Types');

  // States for 10.6 Payroll Runs page
  const [paySearchQuery, setPaySearchQuery] = useState('');
  const [paySelectedBranch, setPaySelectedBranch] = useState('All Branches');
  const [paySelectedType, setPaySelectedType] = useState('All Pay Types');
  const [paySelectedStatus, setPaySelectedStatus] = useState('All Status');

  // States for 10.7 Accounts Receivable & Overdue Invoices page
  const [recSearchQuery, setRecSearchQuery] = useState('');
  const [recSelectedBranch, setRecSelectedBranch] = useState('All Branches');
  const [recSelectedCustomer, setRecSelectedCustomer] = useState('All Customers');
  const [recSelectedStatus, setRecSelectedStatus] = useState('All Status');

  // States for 10.8 Profit & Loss / Financial Reports page
  const [repSearchQuery, setRepSearchQuery] = useState('');
  const [repSelectedBranch, setRepSelectedBranch] = useState('All Branches');
  const [repSelectedAccount, setRepSelectedAccount] = useState('All Accounts');
  const [repSelectedTimeframe, setRepSelectedTimeframe] = useState('This Month');

  // States for 10.9 Accountant Export & Integration page
  const [accSearchQuery, setAccSearchQuery] = useState('');
  const [accSelectedType, setAccSelectedType] = useState('All Export Types');
  const [accSelectedFormat, setAccSelectedFormat] = useState('All Formats');
  const [accSelectedStatus, setAccSelectedStatus] = useState('All Status');

  // Modals & Active Invoice Details
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Active Detailed Invoice for Page 10.3
  const [activeInvoiceDetail, setActiveInvoiceDetail] = useState(null);

  // Form state for New Transaction / Invoice
  const [transactionForm, setTransactionForm] = useState({
    customer: '',
    amount: '',
    type: 'Tax Invoice',
    dueDate: '2025-06-15',
    status: 'Outstanding',
    notes: ''
  });

  // Comprehensive Invoices Database for 10.2 Invoices List Page
  const [invoices, setInvoices] = useState([
    { id: 'INV-2025-0187', customer: 'All Star Motors', ref: 'LOAD-02548', issueDate: '10 May 2025', dueDate: '24 May 2025', type: 'Tax Invoice', amount: '$9,625.00', rawAmount: 9625, status: 'Paid', dueIn: '-' },
    { id: 'INV-2025-0587', customer: 'Sydney Car Sales', ref: 'LOAD-02548', issueDate: '24 May 2025', dueDate: '07 Jun 2025', type: 'Tax Invoice', amount: '$12,650.00', rawAmount: 12650, status: 'Outstanding', dueIn: '13 days' },
    { id: 'INV-2025-0586', customer: 'Toyota Fortitude Valley', ref: 'LOAD-02521', issueDate: '23 May 2025', dueDate: '06 Jun 2025', type: 'Tax Invoice', amount: '$18,200.00', rawAmount: 18200, status: 'Paid', dueIn: '-' },
    { id: 'INV-2025-0585', customer: 'Motor Group Sydney', ref: 'LOAD-02497', issueDate: '23 May 2025', dueDate: '06 Jun 2025', type: 'Tax Invoice', amount: '$8,750.00', rawAmount: 8750, status: 'Paid', dueIn: '-' },
    { id: 'INV-2025-0584', customer: 'Brake Pad Set - Front', ref: 'LOAD-02502', issueDate: '22 May 2025', dueDate: '05 Jun 2025', type: 'Tax Invoice', amount: '$1,250.00', rawAmount: 1250, status: 'Overdue', dueIn: '8 days' },
    { id: 'INV-2025-0583', customer: 'Engine Oil 10W-40', ref: 'LOAD-02503', issueDate: '22 May 2025', dueDate: '05 Jun 2025', type: 'Tax Invoice', amount: '$2,850.00', rawAmount: 2850, status: 'Outstanding', dueIn: '8 days' },
    { id: 'INV-2025-0582', customer: 'Fast Auto Dealers', ref: 'LOAD-02478', issueDate: '21 May 2025', dueDate: '04 Jun 2025', type: 'Tax Invoice', amount: '$9,600.00', rawAmount: 9600, status: 'Paid', dueIn: '-' },
    { id: 'INV-2025-0581', customer: 'Parts Direct', ref: 'LOAD-02465', issueDate: '21 May 2025', dueDate: '04 Jun 2025', type: 'Tax Invoice', amount: '$4,320.00', rawAmount: 4320, status: 'Paid', dueIn: '-' },
    { id: 'INV-2025-0580', customer: 'Sydney Car Sales', ref: 'LOAD-02450', issueDate: '20 May 2025', dueDate: '03 Jun 2025', type: 'Credit Note', amount: '-$1,200.00', rawAmount: -1200, status: 'Paid', dueIn: '-' },
    { id: 'INV-2025-0579', customer: 'Top Gear Autos', ref: 'LOAD-02433', issueDate: '19 May 2025', dueDate: '02 Jun 2025', type: 'Tax Invoice', amount: '$15,480.00', rawAmount: 15480, status: 'Outstanding', dueIn: '5 days' }
  ]);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Open Full Invoice Details Page 10.3
  const handleOpenInvoiceDetail = (inv) => {
    const detailObj = {
      id: inv ? inv.id : 'INV-2025-0187',
      customer: inv ? inv.customer : 'All Star Motors',
      abn: '12 345 678 901',
      email: 'accounts@allstarmotors.com.au',
      phone: '+61 2 9876 5432',
      address: '321 Parramatta Rd, Sydney NSW 2150',
      issueDate: inv ? inv.issueDate : '10 May 2025',
      dueDate: inv ? inv.dueDate : '24 May 2025',
      paidDate: '16 May 2025',
      terms: '14 Days',
      status: inv ? inv.status : 'Paid',
      subtotal: '$8,750.00',
      gst: '$875.00',
      total: inv ? inv.amount : '$9,625.00',
      amountPaid: inv && inv.status === 'Paid' ? inv.amount : (inv && inv.status === 'Outstanding' ? '$0.00' : '$9,625.00'),
      balanceDue: inv && inv.status === 'Paid' ? '$0.00' : (inv ? inv.amount : '$0.00'),
      paymentMethod: 'Bank Transfer',
      paymentRef: 'EFT-56789',
      paymentDate: '16 May 2025',
      loadId: inv && inv.ref ? inv.ref : 'LD-2025-0421',
      jobDate: '06 May 2025',
      createdBy: 'Admin User',
      createdOn: '10 May 2025 09:14 AM',
      lastUpdated: '16 May 2025 11:23 AM',
      lineItems: [
        { id: 1, desc: 'Car Transport - Sydney to Brisbane', sub: 'Load: LD-2025-0421 | Service: Car Carrier', qty: '1.00', unitPrice: '$6,500.00', gst: '$650.00', total: '$7,150.00' },
        { id: 2, desc: 'Toll & Road Charges', sub: 'As per receipts attached', qty: '1.00', unitPrice: '$450.00', gst: '$45.00', total: '$495.00' },
        { id: 3, desc: 'Fuel Surcharge', sub: 'Surcharge applied', qty: '1.00', unitPrice: '$500.00', gst: '$50.00', total: '$550.00' },
        { id: 4, desc: 'Waiting Time', sub: '2.5 hours @ $220/hr', qty: '2.50', unitPrice: '$220.00', gst: '$55.00', total: '$605.00' },
        { id: 5, desc: 'Admin Fee', sub: 'Documentation & processing', qty: '1.00', unitPrice: '$300.00', gst: '$30.00', total: '$330.00' }
      ],
      attachments: [
        { name: 'Fuel_Receipt_001.pdf', size: '102 KB', date: '06 May 2025' },
        { name: 'Toll_Receipt_001.pdf', size: '98 KB', date: '06 May 2025' },
        { name: 'POD_LD-2025-0421.pdf', size: '245 KB', date: '06 May 2025' }
      ]
    };

    setActiveInvoiceDetail(detailObj);
    setViewMode('invoice_details');
  };

  // Filter Invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.ref.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All Payment Status' || selectedStatus === 'All Statuses' || inv.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesCustomer = selectedCustomer === 'All Customers' || inv.customer === selectedCustomer;
    const matchesType = selectedType === 'All Invoice Types' || inv.type === selectedType;
    return matchesSearch && matchesStatus && matchesCustomer && matchesType;
  });

  const ITEMS_PER_PAGE = viewMode === 'invoices' ? 10 : 5;
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE));
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Handle Add Transaction Submit
  const handleAddTransactionSubmit = (e) => {
    e.preventDefault();
    if (!transactionForm.customer || !transactionForm.amount) return;

    const newInv = {
      id: `INV-2025-05${Math.floor(88 + Math.random() * 10)}`,
      customer: transactionForm.customer,
      ref: `LOAD-0${Math.floor(2500 + Math.random() * 100)}`,
      issueDate: '24 May 2025',
      dueDate: transactionForm.dueDate,
      type: transactionForm.type,
      amount: `$${Number(transactionForm.amount).toLocaleString()}.00`,
      rawAmount: Number(transactionForm.amount),
      status: transactionForm.status,
      dueIn: '14 days'
    };

    setInvoices([newInv, ...invoices]);
    setShowAddTransactionModal(false);
    triggerToast(`Invoice for ${transactionForm.customer} created successfully!`);
    setTransactionForm({ customer: '', amount: '', type: 'Tax Invoice', dueDate: '2025-06-15', status: 'Outstanding', notes: '' });
  };

  // Download Invoice File
  const handleDownloadInvoice = (inv) => {
    const target = inv || activeInvoiceDetail;
    const content = `=====================================================
HERO LOGISTICS - OFFICIAL INVOICE RECEIPT
Invoice ID: ${target.id}
Customer: ${target.customer}
Issue Date: ${target.issueDate}
Due Date: ${target.dueDate}
Amount: ${target.amount || target.total}
Status: ${(target.status || 'PAID').toUpperCase()}
=====================================================
Thank you for doing business with Hero Logistics Systems.
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${target.id}_Receipt.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`Receipt for ${target.id} downloaded!`);
  };

  const getStatusBadge = (status) => {
    if (status === 'Paid') {
      return <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-bold">Paid</span>;
    }
    if (status === 'Outstanding') {
      return <span className="bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-0.5 rounded text-[10px] font-bold">Outstanding</span>;
    }
    return <span className="bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-0.5 rounded text-[10px] font-bold">Overdue</span>;
  };

  const getTypeBadge = (type) => {
    if (type === 'Credit Note') {
      return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase">Credit Note</span>;
    }
    return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase">Tax Invoice</span>;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-[#F8FAFC] min-h-screen text-left flex flex-col space-y-6 font-sans">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="text-emerald-400 w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 1: 10.1 FINANCE DASHBOARD - SYDNEY HEAD OFFICE                 */}
      {/* ========================================================================= */}
      {viewMode === 'dashboard' && (
        <>
          {/* Header Container */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mb-1 overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <span className="hover:text-slate-600 cursor-pointer">Home</span>
              <span>&gt;</span>
              <span className="hover:text-slate-600 cursor-pointer">Finance</span>
              <span>&gt;</span>
              <span className="text-slate-800 font-extrabold">Finance Dashboard</span>
            </div>

            <div className="flex flex-row items-center justify-between gap-4 pb-2 border-b border-slate-100 md:border-b-0">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs sm:text-sm md:text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-none truncate whitespace-nowrap">
                    10.1 Finance Dashboard
                  </h1>
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-black shrink-0" title="Verified Branch">✓</span>
                </div>
                <p className="text-slate-500 text-[10px] md:text-xs font-medium mt-0.5 truncate hidden sm:block">
                  Monitor financial performance, cash flow and key metrics in real time.
                </p>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto whitespace-nowrap flex-nowrap pb-1.5 scrollbar-none max-w-[50%] sm:max-w-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <button 
                  onClick={() => setViewMode('invoices')}
                  className="flex items-center gap-1.5 bg-white border border-slate-200 text-purple-700 hover:text-purple-900 border-purple-200 px-3.5 py-2 rounded-xl text-xs font-extrabold hover:bg-purple-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> Invoices List Page &rarr;
                </button>
                <button 
                  onClick={() => setShowAddTransactionModal(true)}
                  className="flex items-center gap-1.5 bg-[#4B0082] hover:bg-[#3b0066] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" /> Add Transaction
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {showMoreActions && (
                    <>
                      {/* Backdrop for mobile */}
                      <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                      <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                        <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                          <span>More Actions</span>
                          <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <button onClick={() => { setViewMode('dashboard'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          📊 10.1 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 10.2 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💳 10.4 Payments & Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💵 10.5 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          👥 10.6 Payroll Runs
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button onClick={() => { setShowExportModal(true); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          <Download className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Export All Data
                        </button>
                        <button onClick={() => { triggerToast('Synchronized bank transactions!'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          <RefreshCw className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Sync Bank Feed
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top 6 KPI Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div onClick={() => setViewMode('payments_receipts')} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">TOTAL REVENUE (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$842,650</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">▲ 12.4% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('payments_receipts'); }} className="text-[10px] font-bold text-purple-600 group-hover:text-purple-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div onClick={() => setViewMode('expenses')} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">TOTAL EXPENSES (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$256,430</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">▲ 5.6% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('expenses'); }} className="text-[10px] font-bold text-purple-600 group-hover:text-purple-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div onClick={() => setViewMode('reports')} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">NET PROFIT (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$586,220</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">▲ 18.7% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('reports'); }} className="text-[10px] font-bold text-purple-600 group-hover:text-purple-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div onClick={() => setViewMode('payroll')} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">OUTSTANDING INVOICES</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$147,890</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">▼ 6.3% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('payroll'); }} className="text-[10px] font-bold text-purple-600 group-hover:text-purple-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div onClick={() => setViewMode('accountant')} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Building className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">CASH IN BANK</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$1,245,600</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">▲ 9.1% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('accountant'); }} className="text-[10px] font-bold text-purple-600 group-hover:text-purple-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div onClick={() => setViewMode('receivables')} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">OVERDUE INVOICES</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$42,750</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">▼ 14.2% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('receivables'); }} className="text-[10px] font-bold text-purple-600 group-hover:text-purple-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Filter Toolbar Bar */}
          <div className="bg-white p-3 border border-slate-200/80 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by reference, customer or type..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select 
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Branches</option>
                <option>Sydney Head Office</option>
                <option>Melbourne Depot</option>
                <option>Brisbane Hub</option>
              </select>

              <select 
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="Outstanding">Outstanding</option>
                <option value="Overdue">Overdue</option>
              </select>

              <select 
                value={selectedTimeframe}
                onChange={e => setSelectedTimeframe(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>

              <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>01 May 2025 - 31 May 2025</span>
              </button>

              <button 
                onClick={() => triggerToast('Filters Applied!')}
                className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-400" /> Filters
              </button>
              
              <button 
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" /> Export
              </button>

              <button 
                onClick={() => triggerToast('Data refreshed live!')}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Analytics Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. REVENUE OVER TIME */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">REVENUE OVER TIME</h3>
                <button onClick={() => triggerToast('Opening Revenue Analytics')} className="text-[10px] font-bold text-[#635BFF] hover:underline flex items-center gap-0.5">
                  View Report &rarr;
                </button>
              </div>
              
              <div className="relative h-48 w-full flex flex-col justify-between pt-1">
                <div className="absolute top-1 right-12 z-10 bg-white border border-slate-200 rounded-xl p-2 shadow-lg flex flex-col items-center pointer-events-none">
                  <span className="text-[9px] font-bold text-slate-500">24 May</span>
                  <span className="text-xs font-black text-slate-900">$845,200</span>
                  <div className="w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45 -mb-3 mt-0.5"></div>
                </div>

                <div className="flex-1 flex items-stretch">
                  <div className="flex flex-col justify-between text-[8px] font-bold text-slate-400 pr-2 py-1 select-none shrink-0">
                    <span>$1.0M</span>
                    <span>$800K</span>
                    <span>$600K</span>
                    <span>$400K</span>
                    <span>$200K</span>
                    <span>$0</span>
                  </div>

                  <div className="flex-1 relative overflow-visible">
                    <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#635BFF" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#635BFF" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      
                      <line x1="0" y1="0" x2="300" y2="0" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="24" x2="300" y2="24" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="48" x2="300" y2="48" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="72" x2="300" y2="72" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="96" x2="300" y2="96" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="120" x2="300" y2="120" stroke="#e2e8f0" />

                      <path 
                        d="M 0,80 L 20,68 L 40,55 L 60,57 L 80,42 L 100,45 L 120,38 L 140,48 L 160,38 L 180,42 L 200,32 L 220,36 L 240,28 L 260,22 L 280,15 L 300,10 L 300,120 L 0,120 Z" 
                        fill="url(#revenueGrad)" 
                      />

                      <path 
                        d="M 0,80 L 20,68 L 40,55 L 60,57 L 80,42 L 100,45 L 120,38 L 140,48 L 160,38 L 180,42 L 200,32 L 220,36 L 240,28 L 260,22 L 280,15 L 300,10" 
                        fill="none" 
                        stroke="#635BFF" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                      />

                      {[
                        [0, 80], [20, 68], [40, 55], [60, 57], [80, 42], [100, 45],
                        [120, 38], [140, 48], [160, 38], [180, 42], [200, 32], [220, 36],
                        [240, 28], [260, 22], [280, 15], [300, 10]
                      ].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="3" fill="#635BFF" stroke="#ffffff" strokeWidth="1.5" />
                      ))}
                    </svg>
                  </div>
                </div>

                <div className="flex justify-between text-[8px] font-bold text-slate-400 pl-8 pt-1 border-t border-slate-100 mt-1">
                  <span>1 May</span>
                  <span>8 May</span>
                  <span>15 May</span>
                  <span>22 May</span>
                  <span>29 May</span>
                </div>
              </div>
            </div>

            {/* 2. EXPENSES OVER TIME */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EXPENSES OVER TIME</h3>
                <button onClick={() => triggerToast('Opening Expense Analytics')} className="text-[10px] font-bold text-[#635BFF] hover:underline flex items-center gap-0.5">
                  View Report &rarr;
                </button>
              </div>
              
              <div className="relative h-48 w-full flex flex-col justify-between pt-1">
                <div className="absolute top-1 right-12 z-10 bg-white border border-slate-200 rounded-xl p-2 shadow-lg flex flex-col items-center pointer-events-none">
                  <span className="text-[9px] font-bold text-slate-500">24 May</span>
                  <span className="text-xs font-black text-slate-900">$265,400</span>
                  <div className="w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45 -mb-3 mt-0.5"></div>
                </div>

                <div className="flex-1 flex items-stretch">
                  <div className="flex flex-col justify-between text-[8px] font-bold text-slate-400 pr-2 py-1 select-none shrink-0">
                    <span>$400K</span>
                    <span>$300K</span>
                    <span>$200K</span>
                    <span>$100K</span>
                    <span>$0</span>
                  </div>

                  <div className="flex-1 relative overflow-visible">
                    <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      
                      <line x1="0" y1="0" x2="300" y2="0" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="30" x2="300" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="90" x2="300" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="120" x2="300" y2="120" stroke="#e2e8f0" />

                      <path 
                        d="M 0,75 L 20,62 L 40,52 L 60,56 L 80,48 L 100,58 L 120,48 L 140,40 L 160,32 L 180,42 L 200,38 L 220,45 L 240,55 L 260,48 L 280,46 L 300,40 L 300,120 L 0,120 Z" 
                        fill="url(#expenseGrad)" 
                      />

                      <path 
                        d="M 0,75 L 20,62 L 40,52 L 60,56 L 80,48 L 100,58 L 120,48 L 140,40 L 160,32 L 180,42 L 200,38 L 220,45 L 240,55 L 260,48 L 280,46 L 300,40" 
                        fill="none" 
                        stroke="#EF4444" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                      />

                      {[
                        [0, 75], [20, 62], [40, 52], [60, 56], [80, 48], [100, 58],
                        [120, 48], [140, 40], [160, 32], [180, 42], [200, 38], [220, 45],
                        [240, 55], [260, 48], [280, 46], [300, 40]
                      ].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="3" fill="#EF4444" stroke="#ffffff" strokeWidth="1.5" />
                      ))}
                    </svg>
                  </div>
                </div>

                <div className="flex justify-between text-[8px] font-bold text-slate-400 pl-8 pt-1 border-t border-slate-100 mt-1">
                  <span>1 May</span>
                  <span>8 May</span>
                  <span>15 May</span>
                  <span>22 May</span>
                  <span>29 May</span>
                </div>
              </div>
            </div>

            {/* 3. CASH FLOW (MTD) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CASH FLOW (MTD)</h3>
                <button onClick={() => triggerToast('Opening Cash Flow Report')} className="text-[10px] font-bold text-[#635BFF] hover:underline flex items-center gap-0.5">
                  View Report &rarr;
                </button>
              </div>
              
              <div className="relative h-48 w-full flex flex-col justify-between pt-1">
                <div className="absolute top-1 right-12 z-10 bg-white border border-slate-200 rounded-xl p-2 shadow-lg flex flex-col items-center pointer-events-none">
                  <span className="text-[9px] font-bold text-slate-500">24 May</span>
                  <span className="text-xs font-black text-slate-900">$586,200</span>
                  <div className="w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45 -mb-3 mt-0.5"></div>
                </div>

                <div className="flex-1 flex items-stretch">
                  <div className="flex flex-col justify-between text-[8px] font-bold text-slate-400 pr-2 py-1 select-none shrink-0">
                    <span>$1.5M</span>
                    <span>$1.0M</span>
                    <span>$500K</span>
                    <span>$0</span>
                    <span>-$500K</span>
                  </div>

                  <div className="flex-1 relative flex items-end justify-between gap-1 pl-1 pb-1">
                    <div className="absolute top-[52%] left-0 right-0 border-t border-rose-400 z-10 pointer-events-none"></div>

                    {[45, 28, 55, 32, 82, 44, 38, 68, 42, 52, 40, 48, 60, 44, 68, 65, 42, 45, 60, 55, 58].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-[#10B981] hover:bg-[#059669] rounded-t-xs transition-colors" 
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center text-[8px] font-bold text-slate-400 pl-8 pt-1 border-t border-slate-100 mt-1">
                  <span>May</span>
                </div>
              </div>
            </div>

            {/* 4. INVOICES OVERVIEW */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">INVOICES OVERVIEW</h3>
                <button onClick={() => setViewMode('invoices')} className="text-[10px] font-bold text-[#635BFF] hover:underline flex items-center gap-0.5">
                  View Report &rarr;
                </button>
              </div>
              
              <div className="flex items-center gap-3 py-3 h-48">
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 transform -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray="55.7 100" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="21.5 100" strokeDashoffset="-55.7" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="10.8 100" strokeDashoffset="-77.2" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-sm font-black text-slate-900 leading-none">196</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Total</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-[10.5px] font-bold text-slate-700 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1.5 shrink-0"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Paid</span>
                    <span className="font-extrabold text-slate-900 shrink-0 whitespace-nowrap">124 (63.3%)</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1.5 shrink-0"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> Outstanding</span>
                    <span className="font-extrabold text-slate-900 shrink-0 whitespace-nowrap">48 (24.5%)</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1.5 shrink-0"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> Overdue</span>
                    <span className="font-extrabold text-slate-900 shrink-0 whitespace-nowrap">24 (12.2%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 3 Columns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* RECENT INVOICES Table (6 Cols) */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
              <div>
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">RECENT INVOICES</h2>
                  <button 
                    onClick={() => setViewMode('invoices')}
                    className="text-[10px] font-extrabold text-purple-700 hover:text-purple-900 border border-purple-200 hover:border-purple-300 bg-purple-50/60 px-3 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3 px-4">Invoice #</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Issue Date</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {paginatedInvoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                          <td 
                            onClick={() => handleOpenInvoiceDetail(inv)}
                            className="py-3.5 px-4 font-mono text-[11px] font-black text-purple-700 hover:underline cursor-pointer"
                          >
                            {inv.id}
                          </td>
                          <td 
                            onClick={() => handleOpenInvoiceDetail(inv)}
                            className="py-3.5 px-4 font-extrabold text-slate-900 hover:text-purple-700 cursor-pointer"
                          >
                            {inv.customer}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-semibold">{inv.issueDate}</td>
                          <td className="py-3.5 px-4 text-slate-500 font-semibold">{inv.dueDate}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-900 font-black">{inv.amount}</td>
                          <td className="py-3.5 px-4">{getStatusBadge(inv.status)}</td>
                          <td className="py-3.5 px-4 text-center">
                            <button 
                              onClick={() => handleOpenInvoiceDetail(inv)}
                              className="text-[11px] font-bold text-purple-600 hover:text-purple-800 cursor-pointer underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table Pagination */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Showing 1 to 5 of 8 invoices</span>
                <div className="flex items-center gap-1">
                  <button disabled className="p-1 border border-slate-200 rounded opacity-30">&lt;</button>
                  <button className="w-6 h-6 rounded text-xs font-bold bg-[#4B0082] text-white">1</button>
                  <button onClick={() => setViewMode('invoices')} className="w-6 h-6 rounded text-xs font-bold bg-white border border-slate-200 text-slate-700">2</button>
                  <button onClick={() => setViewMode('invoices')} className="p-1 border border-slate-200 rounded hover:bg-white cursor-pointer">&gt;</button>
                </div>
              </div>
            </div>

            {/* EXPENSE BREAKDOWN */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EXPENSE BREAKDOWN</h3>
                  <button onClick={() => triggerToast('Opening Expense Report')} className="text-[10px] font-bold text-purple-600 hover:underline">View Report &rarr;</button>
                </div>

                <div className="flex items-center justify-center my-3">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#8B5CF6" strokeWidth="4.5" strokeDasharray="38.4 100" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#14B8A6" strokeWidth="4.5" strokeDasharray="22 100" strokeDashoffset="-38.4" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4.5" strokeDasharray="16.6 100" strokeDashoffset="-60.4" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="11.3 100" strokeDashoffset="-77" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="11.7 100" strokeDashoffset="-88.3" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-xs font-black text-slate-900 leading-none">$256,430</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Total</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-bold text-slate-700 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Fuel</span>
                    <span>$98,560 (38.4%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Staff</span>
                    <span>$56,420 (22.0%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Maintenance</span>
                    <span>$42,670 (16.6%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Warehouse</span>
                    <span>$28,980 (11.3%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Other</span>
                    <span>$29,800 (11.7%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CASH POSITION */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CASH POSITION</h3>
                  <button onClick={() => triggerToast('Opening Cash Position Summary')} className="text-[10px] font-bold text-purple-600 hover:underline">View Report &rarr;</button>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Building className="w-4 h-4" /></div>
                      <span className="text-xs font-bold text-slate-700">Cash in Bank</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">$1,245,600</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FileText className="w-4 h-4" /></div>
                      <span className="text-xs font-bold text-slate-700">Accounts Receivable</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">$212,450</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><FileText className="w-4 h-4" /></div>
                      <span className="text-xs font-bold text-slate-700">Accounts Payable</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">$134,200</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CreditCard className="w-4 h-4" /></div>
                      <span className="text-xs font-bold text-slate-700">Available Credit</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">$850,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Notes Footer Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Code2 className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-black uppercase tracking-widest text-purple-300">DEVELOPER NOTES &ndash; FINANCE DASHBOARD</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] font-medium leading-relaxed">
              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">1. PURPOSE</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Provide real-time financial overview.</li>
                  <li>&bull; Monitor revenue, expenses and cash flow.</li>
                  <li>&bull; Track invoices, overdue amounts and key metrics.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">2. KEY FEATURES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Summary KPI cards with trends.</li>
                  <li>&bull; Revenue, expense and cash flow charts.</li>
                  <li>&bull; Invoice and expense overview widgets.</li>
                  <li>&bull; Quick access to financial reports.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">3. AUTOMATION & ALERTS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Automatic invoice reminders.</li>
                  <li>&bull; Alerts for overdue invoices.</li>
                  <li>&bull; Daily cash flow and performance updates.</li>
                  <li>&bull; Threshold alerts for expenses and budget.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">4. PERMISSIONS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Super Admin: Full access.</li>
                  <li>&bull; Finance Manager: Full access.</li>
                  <li>&bull; Accounts Staff: View and manage data.</li>
                  <li>&bull; Read Only: View only (limited access).</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">5. DATA SOURCES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Invoices, payments and receipts.</li>
                  <li>&bull; Expenses and payroll.</li>
                  <li>&bull; Bank accounts and transactions.</li>
                  <li>&bull; Warehouse and operational data.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-semibold">
              <span>All times shown in your local time (AEST)</span>
              <span className="flex items-center gap-1.5 text-purple-400">&bull; Data auto-refreshes every 5 minutes <RefreshCw className="w-3 h-3 animate-spin" /></span>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: 10.2 INVOICES LIST - SYDNEY HEAD OFFICE                     */}
      {/* ========================================================================= */}
      {viewMode === 'invoices' && (
        <>
          {/* Header Container */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mb-1 overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <span onClick={() => setViewMode('dashboard')} className="hover:text-slate-600 cursor-pointer">Home</span>
              <span>&gt;</span>
              <span onClick={() => setViewMode('dashboard')} className="hover:text-slate-600 cursor-pointer">Finance</span>
              <span>&gt;</span>
              <span className="text-slate-800 font-extrabold">Invoices</span>
            </div>

            <div className="flex flex-row items-center justify-between gap-4 pb-2 border-b border-slate-100 md:border-b-0">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs sm:text-sm md:text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-none truncate whitespace-nowrap">
                    10.2 Invoices List
                  </h1>
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-black shrink-0" title="Verified Branch">✓</span>
                </div>
                <p className="text-slate-500 text-[10px] md:text-xs font-medium mt-0.5 truncate hidden sm:block">
                  View, filter and manage all customer invoices.
                </p>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto whitespace-nowrap flex-nowrap pb-1.5 scrollbar-none max-w-[50%] sm:max-w-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <button 
                  onClick={() => setViewMode('dashboard')}
                  className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" /> Back to Finance
                </button>
                <button 
                  onClick={() => setShowAddTransactionModal(true)}
                  className="flex items-center gap-1.5 bg-[#4B0082] hover:bg-[#3b0066] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" /> Create Invoice
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {showMoreActions && (
                    <>
                      {/* Backdrop for mobile */}
                      <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                      <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                        <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                          <span>More Actions</span>
                          <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <button onClick={() => { setShowExportModal(true); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          <Download className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Export Invoices List
                        </button>
                        <button onClick={() => { triggerToast('Batch email reminders sent!'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          <Mail className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Batch Reminders
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">TOTAL INVOICES</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">196</div>
                <div className="text-[10px] text-slate-400 font-semibold mb-2">This Month</div>
                <button onClick={() => setSelectedStatus('All Statuses')} className="text-[10px] font-bold text-purple-600 hover:text-purple-800 block cursor-pointer">
                  View all invoices &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Check className="w-4 h-4 stroke-[3px]" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">PAID INVOICES</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">124 <span className="text-xs font-bold text-slate-500">(63.3%)</span></div>
                <div className="text-[10px] text-slate-400 font-semibold mb-2">This Month</div>
                <button onClick={() => setSelectedStatus('Paid')} className="text-[10px] font-bold text-purple-600 hover:text-purple-800 block cursor-pointer">
                  View paid invoices &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">OUTSTANDING INVOICES</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">48 <span className="text-xs font-bold text-slate-500">(24.5%)</span></div>
                <div className="text-[10px] text-slate-400 font-semibold mb-2">This Month</div>
                <button onClick={() => setSelectedStatus('Outstanding')} className="text-[10px] font-bold text-purple-600 hover:text-purple-800 block cursor-pointer">
                  View outstanding &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">OVERDUE INVOICES</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">24 <span className="text-xs font-bold text-slate-500">(12.2%)</span></div>
                <div className="text-[10px] text-slate-400 font-semibold mb-2">This Month</div>
                <button onClick={() => setSelectedStatus('Overdue')} className="text-[10px] font-bold text-purple-600 hover:text-purple-800 block cursor-pointer">
                  View overdue &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">TOTAL INVOICE VALUE</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$1,256,850.00</div>
                <div className="text-[10px] text-slate-400 font-semibold mb-2">This Month</div>
                <button onClick={() => triggerToast('Opening Financial Summary')} className="text-[10px] font-bold text-purple-600 hover:text-purple-800 block cursor-pointer">
                  View summary &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Filter Toolbar Bar */}
          <div className="bg-white p-3 border border-slate-200/80 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by invoice #, customer or reference..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select 
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Branches</option>
                <option>Sydney Head Office</option>
                <option>Melbourne Depot</option>
                <option>Brisbane Hub</option>
              </select>

              <select 
                value={selectedCustomer}
                onChange={e => setSelectedCustomer(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Customers</option>
                <option>Sydney Car Sales</option>
                <option>Toyota Fortitude Valley</option>
                <option>Motor Group Sydney</option>
                <option>Brake Pad Set - Front</option>
                <option>Engine Oil 10W-40</option>
                <option>Fast Auto Dealers</option>
              </select>

              <select 
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Outstanding">Outstanding</option>
                <option value="Overdue">Overdue</option>
              </select>

              <select 
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Invoice Types</option>
                <option value="Tax Invoice">Tax Invoice</option>
                <option value="Credit Note">Credit Note</option>
              </select>

              <select 
                value={selectedTimeframe}
                onChange={e => setSelectedTimeframe(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>

              <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>01 May 2025 - 31 May 2025</span>
              </button>

              <button 
                onClick={() => triggerToast('Filters Applied!')}
                className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-400" /> Filters
              </button>
              
              <button 
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" /> Export
              </button>

              <button 
                onClick={() => triggerToast('Invoices synced live!')}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Refresh List"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main 2-Column Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT: INVOICES Table Card (8 Cols) */}
            <div className="md:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
              <div>
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                    INVOICES ({filteredInvoices.length})
                  </h2>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3 px-4">Invoice #</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Reference / Load #</th>
                        <th className="py-3 px-4">Issue Date</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4">Invoice Type</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Due In</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {paginatedInvoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                          <td 
                            onClick={() => handleOpenInvoiceDetail(inv)}
                            className="py-3.5 px-4 font-mono text-[11px] font-black text-purple-700 hover:underline cursor-pointer"
                          >
                            {inv.id}
                          </td>
                          <td 
                            onClick={() => handleOpenInvoiceDetail(inv)}
                            className="py-3.5 px-4 font-extrabold text-slate-900 hover:text-purple-700 cursor-pointer"
                          >
                            {inv.customer}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-500 font-semibold">{inv.ref}</td>
                          <td className="py-3.5 px-4 text-slate-500 font-semibold">{inv.issueDate}</td>
                          <td className="py-3.5 px-4 text-slate-500 font-semibold">{inv.dueDate}</td>
                          <td className="py-3.5 px-4">{getTypeBadge(inv.type)}</td>
                          <td className={`py-3.5 px-4 font-mono font-black ${inv.rawAmount < 0 ? 'text-emerald-600' : 'text-slate-900'}`}>{inv.amount}</td>
                          <td className="py-3.5 px-4">{getStatusBadge(inv.status)}</td>
                          <td className="py-3.5 px-4 font-semibold text-rose-500">{inv.dueIn}</td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => handleOpenInvoiceDetail(inv)}
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer" 
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDownloadInvoice(inv)}
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer" 
                                title="Download"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table Pagination */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-500 flex-wrap gap-2">
                <span>Showing 1 to {paginatedInvoices.length} of 196 invoices</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <button disabled className="p-1 border border-slate-200 rounded opacity-30">&lt;</button>
                    <button className="w-6 h-6 rounded text-xs font-bold bg-[#4B0082] text-white">1</button>
                    <button className="w-6 h-6 rounded text-xs font-bold bg-white border border-slate-200 text-slate-700">2</button>
                    <button className="w-6 h-6 rounded text-xs font-bold bg-white border border-slate-200 text-slate-700">3</button>
                    <button className="w-6 h-6 rounded text-xs font-bold bg-white border border-slate-200 text-slate-700">4</button>
                    <button className="w-6 h-6 rounded text-xs font-bold bg-white border border-slate-200 text-slate-700">5</button>
                    <span className="px-1">...</span>
                    <button className="w-6 h-6 rounded text-xs font-bold bg-white border border-slate-200 text-slate-700">20</button>
                    <button className="p-1 border border-slate-200 rounded hover:bg-white cursor-pointer">&gt;</button>
                  </div>
                  <select className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-700">
                    <option>10 / page</option>
                    <option>25 / page</option>
                    <option>50 / page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* RIGHT: 4 Cards Stack (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Card 1: INVOICE SUMMARY */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">INVOICE SUMMARY</h3>
                  <button onClick={() => triggerToast('Viewing Invoice Report')} className="text-[10px] font-bold text-purple-600 hover:underline">View Report &rarr;</button>
                </div>

                <div className="space-y-2.5 text-xs font-bold text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600"><FileText className="w-3.5 h-3.5 text-slate-400" /> Total Invoices</span>
                    <span className="font-extrabold text-slate-900">196</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Paid</span>
                    <span className="font-extrabold text-slate-900">124 (63.3%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Outstanding</span>
                    <span className="font-extrabold text-slate-900">48 (24.5%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Overdue</span>
                    <span className="font-extrabold text-slate-900">24 (12.2%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Draft</span>
                    <span className="font-extrabold text-slate-900">6 (3.1%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Cancelled</span>
                    <span className="font-extrabold text-slate-900">2 (1.0%)</span>
                  </div>
                </div>
              </div>

              {/* Card 2: INVOICE VALUE BY STATUS */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">INVOICE VALUE BY STATUS</h3>
                  <button onClick={() => triggerToast('Viewing Status Chart')} className="text-[10px] font-bold text-purple-600 hover:underline">View Chart &rarr;</button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray="63.5 100" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="24.5 100" strokeDashoffset="-63.5" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="8.6 100" strokeDashoffset="-88" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-xs font-black text-slate-900 leading-none">$1.26M</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Total</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[10.5px] font-bold text-slate-700 flex-1 min-w-0">
                    <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Paid</span> <span>$798,450 (63.5%)</span></div>
                    <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Outstanding</span> <span>$308,300 (24.5%)</span></div>
                    <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Overdue</span> <span>$108,750 (8.6%)</span></div>
                    <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400"></span> Draft</span> <span>$31,850 (2.5%)</span></div>
                    <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Cancelled</span> <span>$9,500 (0.8%)</span></div>
                  </div>
                </div>
              </div>

              {/* Card 3: TOP CUSTOMERS (THIS MONTH) */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TOP CUSTOMERS (THIS MONTH)</h3>
                  <button onClick={() => triggerToast('Viewing Customers Report')} className="text-[10px] font-bold text-purple-600 hover:underline">View Report &rarr;</button>
                </div>

                <div className="space-y-2.5 text-xs font-bold text-slate-800">
                  <div className="flex justify-between items-center"><span className="text-slate-600">1. Sydney Car Sales</span> <span className="font-black">$245,650.00</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-600">2. Toyota Fortitude Valley</span> <span className="font-black">$198,320.00</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-600">3. Motor Group Sydney</span> <span className="font-black">$165,780.00</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-600">4. Fast Auto Dealers</span> <span className="font-black">$95,610.00</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-600">5. Top Gear Autos</span> <span className="font-black">$78,430.00</span></div>
                </div>
              </div>

              {/* Card 4: QUICK ACTIONS */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3 mb-3">QUICK ACTIONS</h3>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
                  <button onClick={() => setShowAddTransactionModal(true)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 flex items-center gap-2 cursor-pointer">
                    <Plus className="w-3.5 h-3.5 text-purple-600" /> Create Invoice
                  </button>
                  <button onClick={() => triggerToast('Sending email batch...')} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 flex items-center gap-2 cursor-pointer">
                    <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Invoices
                  </button>
                  <button onClick={() => triggerToast('Opening Payment Form')} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 flex items-center gap-2 cursor-pointer">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Record Payment
                  </button>
                  <button onClick={() => triggerToast('Preparing print view...')} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 flex items-center gap-2 cursor-pointer">
                    <Printer className="w-3.5 h-3.5 text-slate-600" /> Print Invoices
                  </button>
                  <button onClick={() => triggerToast('Credit Note Form launched')} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 flex items-center gap-2 cursor-pointer">
                    <FilePlus className="w-3.5 h-3.5 text-amber-600" /> Create Credit Note
                  </button>
                  <button onClick={() => setShowExportModal(true)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 flex items-center gap-2 cursor-pointer">
                    <Download className="w-3.5 h-3.5 text-purple-600" /> Export Invoices
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Notes Footer Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Code2 className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-black uppercase tracking-widest text-purple-300">DEVELOPER NOTES &ndash; INVOICES LIST</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] font-medium leading-relaxed">
              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">1. PURPOSE</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Central list of all invoices.</li>
                  <li>&bull; Quick overview of status and amounts.</li>
                  <li>&bull; Easy access to invoice actions and reports.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">2. KEY FEATURES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Filter by branch, customer, status, type and date.</li>
                  <li>&bull; Search by invoice number, customer or reference.</li>
                  <li>&bull; Inline status, due in and actions.</li>
                  <li>&bull; Pagination and export.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">3. AUTOMATION & ALERTS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Overdue invoices highlighted in red.</li>
                  <li>&bull; Auto reminders for overdue invoices.</li>
                  <li>&bull; Payment received updates status in real time.</li>
                  <li>&bull; Daily summary email for overdue invoices.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">4. PERMISSIONS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Super Admin: Full access.</li>
                  <li>&bull; Finance Manager: Full access.</li>
                  <li>&bull; Accounts Staff: View and manage invoices.</li>
                  <li>&bull; Read Only: View only (limited access).</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">5. DATA SOURCES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Invoices module.</li>
                  <li>&bull; Payments & Receipts module.</li>
                  <li>&bull; Customers module.</li>
                  <li>&bull; General Ledger / Accounting module.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-semibold">
              <span>All times shown in your local time (AEST)</span>
              <span className="flex items-center gap-1.5 text-purple-400">&bull; Data auto-refreshes every 5 minutes <RefreshCw className="w-3 h-3 animate-spin" /></span>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 3: 10.3 INVOICE DETAILS - SCREENSHOT 2 MATCHING                */}
      {/* ========================================================================= */}
      {viewMode === 'invoice_details' && activeInvoiceDetail && (
        <>
          {/* Header Container */}
          <div className="space-y-4">
            {/* Top row: Breadcrumb and Help/Notifications */}
            <div className="flex flex-row justify-between items-center gap-2 flex-wrap pb-1.5 border-b border-slate-100/60">
              {/* Left: Breadcrumbs */}
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Home</span>
                <span className="text-slate-300 mx-1">›</span>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Finance</span>
                <span className="text-slate-300 mx-1">›</span>
                <span onClick={() => setViewMode('invoices')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Invoices</span>
                <span className="text-slate-300 mx-1">›</span>
                <span className="text-slate-900 font-extrabold">{activeInvoiceDetail.id}</span>
              </div>

              {/* Right: Help, Notification, User Avatar */}
              <div className="flex items-center gap-3.5 text-xs font-bold text-slate-700">
                <button onClick={() => triggerToast('Help center opened')} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Need help?
                </button>
                <div className="relative cursor-pointer text-slate-600 hover:text-slate-800" onClick={() => triggerToast('Notifications opened')}>
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-black leading-none">11</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0" title="User Profile">
                  SM
                </div>
              </div>
            </div>

            {/* Bottom row: Title and Buttons Layout */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              {/* Left Side: Title with Check Shield Badge and Subtitle */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    10.3 Invoice Details &ndash; {activeInvoiceDetail.id}
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  View and manage invoice information, line items, payments and history.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-end gap-2 shrink-0 max-w-full">
                {/* Desktop-only: More Actions Button on top right */}
                <div className="relative max-md:hidden">
                  <button 
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {showMoreActions && (
                    <>
                      <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                      <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                        <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                          <span>More Actions</span>
                          <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          <ArrowLeft className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Back to Invoices List
                        </button>
                        <button onClick={() => { triggerToast('Invoice duplicated as draft'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          <Printer className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Print Invoice
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Buttons row */}
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap flex-nowrap pb-1.5 md:pb-0 scrollbar-none max-w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <button 
                    onClick={() => handleDownloadInvoice(activeInvoiceDetail)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" /> Download PDF
                  </button>
                  <button 
                    onClick={() => triggerToast(`Invoice sent to ${activeInvoiceDetail.email}`)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Send to Customer
                  </button>
                  <button 
                    onClick={() => triggerToast('Credit Note created for ' + activeInvoiceDetail.id)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Credit Note
                  </button>
                  <button 
                    onClick={() => triggerToast('Payment recorded successfully!')}
                    className="flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    <span className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center text-[9px] font-black leading-none">$</span> Record Payment
                  </button>

                  {/* Mobile-only: More Actions Button inline in the scrollable bar */}
                  <div className="relative md:hidden shrink-0">
                    <button 
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    {showMoreActions && (
                      <>
                        <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                        <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                          <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                            <span>More Actions</span>
                            <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                          </div>
                          <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            <ArrowLeft className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Back to Invoices List
                          </button>
                          <button onClick={() => { triggerToast('Invoice duplicated as draft'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            <Printer className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Print Invoice
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Top Invoice Card Header (ID & Customer Details) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row justify-between gap-6">
            {/* Left: Invoice Title & Dates */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeInvoiceDetail.id}</h2>
                {getStatusBadge(activeInvoiceDetail.status)}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-bold">
                <div>
                  <span className="text-slate-400 flex items-center gap-1 mb-1 font-semibold"><Calendar className="w-3.5 h-3.5" /> Issue Date</span>
                  <span className="text-slate-900">{activeInvoiceDetail.issueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 flex items-center gap-1 mb-1 font-semibold"><Calendar className="w-3.5 h-3.5" /> Due Date</span>
                  <span className="text-slate-900">{activeInvoiceDetail.dueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 flex items-center gap-1 mb-1 font-semibold"><Check className="w-3.5 h-3.5 text-emerald-500" /> Paid Date</span>
                  <span className="text-slate-900">{activeInvoiceDetail.paidDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 flex items-center gap-1 mb-1 font-semibold"><Clock className="w-3.5 h-3.5" /> Payment Terms</span>
                  <span className="text-slate-900">{activeInvoiceDetail.terms}</span>
                </div>
              </div>
            </div>

            {/* Right: Customer Card */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-xs font-bold text-slate-700 min-w-[280px] space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 text-sm font-black mb-1">
                <User className="w-4 h-4 text-purple-600" /> {activeInvoiceDetail.customer}
              </div>
              <p className="text-slate-400 font-medium">ABN: {activeInvoiceDetail.abn}</p>
              <p className="text-purple-600 font-semibold cursor-pointer hover:underline">{activeInvoiceDetail.email}</p>
              <p className="text-slate-600 font-semibold">{activeInvoiceDetail.phone}</p>
              <p className="text-slate-500 font-normal leading-tight">{activeInvoiceDetail.address}</p>
            </div>
          </div>

          {/* Main 2-Column Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT: Line Items, Notes, Attachments (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Invoice Line Items Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Invoice Line Items</h3>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4 text-right">Qty</th>
                        <th className="py-3 px-4 text-right">Unit Price (Ex GST)</th>
                        <th className="py-3 px-4 text-right">GST</th>
                        <th className="py-3 px-4 text-right">Total (Inc GST)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {activeInvoiceDetail.lineItems.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 text-slate-400">{item.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-slate-900">{item.desc}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{item.sub}</div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono">{item.qty}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-700">{item.unitPrice}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-500">{item.gst}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900">{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50/80 font-black text-slate-900 border-t border-slate-200 text-xs">
                        <td colSpan="3" className="py-3.5 px-4 uppercase tracking-wider text-slate-500">Totals</td>
                        <td className="py-3.5 px-4 text-right font-mono">{activeInvoiceDetail.subtotal}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-500">{activeInvoiceDetail.gst}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-purple-700 text-sm">{activeInvoiceDetail.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Bottom split (Notes on Left 6 Cols, Attachments on Right 6 Cols) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Notes Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 mb-3">Notes</h3>
                    <div className="space-y-1 text-xs text-slate-600 font-medium leading-relaxed">
                      <p>Thank you for your business.</p>
                      <p>Payment terms are 14 days from invoice date.</p>
                      <p>Please use invoice number as payment reference.</p>
                    </div>
                  </div>
                  <button onClick={() => triggerToast('Notes editor opened')} className="self-start text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1.5 cursor-pointer">
                    <Edit className="w-3.5 h-3.5" /> Edit Notes
                  </button>
                </div>

                {/* Attachments (3) Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                      <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Attachments (3)</h3>
                      <button onClick={() => triggerToast('Downloading all 3 attachments')} className="text-[10px] font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Download className="w-3 h-3" /> Download All
                      </button>
                    </div>

                    <div className="space-y-2 text-xs font-bold text-slate-700">
                      {activeInvoiceDetail.attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                            <div>
                              <div className="font-extrabold text-slate-800 text-[11px]">{file.name}</div>
                              <div className="text-[9px] text-slate-400 font-normal">{file.size} &bull; {file.date}</div>
                            </div>
                          </div>
                          <button onClick={() => triggerToast(`Downloaded ${file.name}`)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Invoice Summary, Payment Status, Related Info Cards (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Card 1: Invoice Summary */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3">Invoice Summary</h3>
                <div className="space-y-2 text-xs font-bold text-slate-700">
                  <div className="flex justify-between"><span>Subtotal (Ex GST)</span> <span className="font-mono text-slate-900">{activeInvoiceDetail.subtotal}</span></div>
                  <div className="flex justify-between text-slate-500"><span>GST (10%)</span> <span className="font-mono">{activeInvoiceDetail.gst}</span></div>
                  <div className="border-t border-slate-100 my-2 pt-2 flex justify-between text-sm font-black text-slate-900">
                    <span>Total (Inc GST)</span>
                    <span className="font-mono text-slate-900">{activeInvoiceDetail.total}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600"><span>Amount Paid</span> <span className="font-mono font-black">{activeInvoiceDetail.amountPaid}</span></div>
                  <div className="flex justify-between text-slate-900 font-black"><span>Balance Due</span> <span className="font-mono">{activeInvoiceDetail.balanceDue}</span></div>
                </div>
              </div>

              {/* Card 2: Payment Status */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment Status</h3>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-bold">Paid in Full</span>
                </div>

                <div className="space-y-2 text-xs font-bold text-slate-700">
                  <div className="flex justify-between"><span className="text-slate-500 font-medium">Paid via</span> <span>{activeInvoiceDetail.paymentMethod}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-medium">Reference</span> <span className="font-mono">{activeInvoiceDetail.paymentRef}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-medium">Payment Date</span> <span>{activeInvoiceDetail.paymentDate}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-medium">Payment Amount</span> <span className="font-mono text-emerald-600 font-black">{activeInvoiceDetail.total}</span></div>
                  
                  <div className="border-t border-slate-100 pt-3 mt-2 text-center">
                    <button onClick={() => triggerToast('Viewing payment history audit log')} className="text-[11px] font-bold text-purple-600 hover:underline flex items-center justify-center gap-1 cursor-pointer">
                      <Clock className="w-3.5 h-3.5" /> View Payment History
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3: Related Information */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3">Related Information</h3>
                
                <div className="space-y-2.5 text-xs font-bold text-slate-700">
                  <div className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-1.5 font-medium"><FileText className="w-3.5 h-3.5" /> Load</span> <span className="text-purple-600 font-mono hover:underline cursor-pointer">{activeInvoiceDetail.loadId}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-1.5 font-medium"><User className="w-3.5 h-3.5" /> Customer</span> <span className="text-purple-600 hover:underline cursor-pointer">{activeInvoiceDetail.customer}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-1.5 font-medium"><Calendar className="w-3.5 h-3.5" /> Job Date</span> <span>{activeInvoiceDetail.jobDate}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-1.5 font-medium"><User className="w-3.5 h-3.5" /> Created By</span> <span>{activeInvoiceDetail.createdBy}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5" /> Created On</span> <span className="text-[11px] text-slate-600">{activeInvoiceDetail.createdOn}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5" /> Last Updated</span> <span className="text-[11px] text-slate-600">{activeInvoiceDetail.lastUpdated}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Notes Footer Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Code2 className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-black uppercase tracking-widest text-purple-300">DEVELOPER NOTES &ndash; INVOICE DETAILS</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] font-medium leading-relaxed">
              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">1. PURPOSE</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Display full invoice details, line items, payments, attachments and related links.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">2. KEY FEATURES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; View invoice summary, totals and status.</li>
                  <li>&bull; Line item breakdown with GST calculation.</li>
                  <li>&bull; Record payments and create credit notes.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">3. AUTOMATION & ALERTS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Send invoice PDF via email.</li>
                  <li>&bull; Payment reminders for overdue invoices.</li>
                  <li>&bull; Auto update status on payment received.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">4. PERMISSIONS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Admin: Full access (view, edit, send, credit).</li>
                  <li>&bull; Accounts: View, record payment.</li>
                  <li>&bull; Read Only: View invoice and attachments.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">5. DATA SOURCES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Invoices, payments and receipts.</li>
                  <li>&bull; Load, customer and job data.</li>
                  <li>&bull; Users and audit logs.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-semibold">
              <span>All times shown in your local time (AEST)</span>
              <span className="flex items-center gap-1.5 text-purple-400">&bull; Data auto-refreshes every 5 minutes <RefreshCw className="w-3 h-3 animate-spin" /></span>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 4: 10.4 PAYMENTS & RECEIPTS                                   */}
      {/* ========================================================================= */}
      {viewMode === 'payments_receipts' && (
        <div className="flex flex-col gap-4">
          {/* Header Container */}
          <div className="space-y-4">
            {/* Top row: Breadcrumb and Help/Notifications */}
            <div className="flex flex-row justify-between items-center gap-2 flex-wrap pb-1.5 border-b border-slate-100/60">
              {/* Left: Breadcrumbs */}
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Home</span>
                <span className="text-slate-300 mx-1">›</span>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Finance</span>
                <span className="text-slate-300 mx-1">›</span>
                <span className="text-slate-900 font-extrabold">Payments & Receipts</span>
              </div>

              {/* Right: Help, Notification, User Avatar */}
              <div className="flex items-center gap-3.5 text-xs font-bold text-slate-700">
                <button onClick={() => triggerToast('Help center opened')} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Need help?
                </button>
                <div className="relative cursor-pointer text-slate-600 hover:text-slate-800" onClick={() => triggerToast('Notifications opened')}>
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-black leading-none">11</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0" title="User Profile">
                  SM
                </div>
              </div>
            </div>

            {/* Bottom row: Title and Buttons Layout */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              {/* Left Side: Title with Check Shield Badge and Subtitle */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    10.4 Payments & Receipts
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  View, record and reconcile all payments and receipts across invoices.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-end gap-2 shrink-0 max-w-full">
                {/* Desktop-only: More Actions Button on top right */}
                <div className="relative max-md:hidden">
                  <button 
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {showMoreActions && (
                    <>
                      <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                      <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                        <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                          <span>More Actions</span>
                          <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <button onClick={() => { setViewMode('dashboard'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📊 10.1 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 10.2 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          💳 10.4 Payments & Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💵 10.5 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          👥 10.6 Payroll Runs
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button onClick={() => { triggerToast('Synchronized bank feed'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          <RefreshCw className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Sync Bank Feed
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Buttons row */}
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap flex-nowrap pb-1.5 md:pb-0 scrollbar-none max-w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Payment', status: 'Completed' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Record Payment
                  </button>
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Receipt', status: 'Completed' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Record Receipt
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" /> Export
                  </button>

                  {/* Mobile-only: More Actions Button inline in the scrollable bar */}
                  <div className="relative md:hidden shrink-0">
                    <button 
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    {showMoreActions && (
                      <>
                        <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                        <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                          <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                            <span>More Actions</span>
                            <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                          </div>
                          <button onClick={() => { setViewMode('dashboard'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            📊 10.1 Finance Dashboard
                          </button>
                          <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            📄 10.2 Invoices List
                          </button>
                          <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                            💳 10.4 Payments & Receipts
                          </button>
                          <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            💵 10.5 Expenses
                          </button>
                          <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            👥 10.6 Payroll Runs
                          </button>
                          <div className="border-t border-slate-100 my-1" />
                          <button onClick={() => { triggerToast('Synchronized bank feed'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            <RefreshCw className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Sync Bank Feed
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 KPI Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">PAYMENTS RECEIVED (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$586,220</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 12.7% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Payments Report')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">RECEIPTS ISSUED (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$256,430</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 8.5% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Receipts Report')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">OUTSTANDING RECEIVABLES</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$147,890</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5 font-bold">▼ 9.3% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Receivables Report')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">OVERDUE AMOUNT</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$42,750</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5 font-bold">▲ 14.1% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Overdue Amount Report')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Building className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">CASH IN BANK</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$1,245,600</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 9.1% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Cash Flow Report')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

          </div>

          {/* Filter Toolbar Bar */}
          <div className="bg-white p-3 border border-slate-200/80 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={prSearchQuery}
                onChange={e => setPrSearchQuery(e.target.value)}
                placeholder="Search by reference, invoice, customer..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select 
                value={prSelectedBranch}
                onChange={e => setPrSelectedBranch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Branches</option>
                <option>Sydney Head Office</option>
                <option>Melbourne Depot</option>
                <option>Brisbane Hub</option>
              </select>

              <select 
                value={prSelectedType}
                onChange={e => setPrSelectedType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Payment Types</option>
                <option>Bank Transfer</option>
                <option>EFTPOS</option>
                <option>Credit Card</option>
              </select>

              <select 
                value={prSelectedStatus}
                onChange={e => setPrSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Status</option>
                <option>Completed</option>
                <option>Issued</option>
              </select>

              <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>01 May 2025 - 31 May 2025</span>
              </button>

              <button 
                onClick={() => triggerToast('Filters Applied!')}
                className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-400" /> Filters
              </button>
              
              <button 
                onClick={() => {
                  setPrSearchQuery('');
                  setPrSelectedBranch('All Branches');
                  setPrSelectedType('All Payment Types');
                  setPrSelectedStatus('All Status');
                  triggerToast('Filters reset successfully!');
                }}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Reset Filters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main 2-Column Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Tables (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* PAYMENTS RECEIVED */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">PAYMENTS RECEIVED</h3>
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black">28</span>
                  </div>
                  <button onClick={() => triggerToast('Opening Full Payments Ledger')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer">
                    View Report &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Reference</th>
                        <th className="py-3 px-4">From (Customer)</th>
                        <th className="py-3 px-4">Invoice</th>
                        <th className="py-3 px-4">Method</th>
                        <th className="py-3 px-4 text-right">Amount (Inc GST)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {((prSearchQuery || prSelectedBranch !== 'All Branches' || prSelectedType !== 'All Payment Types' || prSelectedStatus !== 'All Status') ? (
                        [
                          { date: '24 May 2025', ref: 'PAY-2025-0567', customer: 'All Star Motors', invoice: 'INV-2025-0187', method: 'Bank Transfer', amount: '$9,625.00', status: 'Completed', branch: 'Sydney Head Office' },
                          { date: '23 May 2025', ref: 'PAY-2025-0566', customer: 'Sydney Car Sales', invoice: 'INV-2025-0182', method: 'EFTPOS', amount: '$2,860.00', status: 'Completed', branch: 'Sydney Head Office' },
                          { date: '22 May 2025', ref: 'PAY-2025-0565', customer: 'Fast Freight Pty Ltd', invoice: 'INV-2025-0180', method: 'Bank Transfer', amount: '$5,280.00', status: 'Completed', branch: 'Melbourne Depot' },
                          { date: '22 May 2025', ref: 'PAY-2025-0564', customer: 'Metro Group Sydney', invoice: 'INV-2025-0176', method: 'Credit Card', amount: '$1,650.00', status: 'Completed', branch: 'Sydney Head Office' },
                          { date: '21 May 2025', ref: 'PAY-2025-0563', customer: 'Blue Line Logistics', invoice: 'INV-2025-0173', method: 'Bank Transfer', amount: '$3,960.00', status: 'Completed', branch: 'Brisbane Hub' }
                        ].filter(item => {
                          const matchSearch = item.ref.toLowerCase().includes(prSearchQuery.toLowerCase()) || 
                                              item.customer.toLowerCase().includes(prSearchQuery.toLowerCase()) ||
                                              item.invoice.toLowerCase().includes(prSearchQuery.toLowerCase());
                          const matchBranch = prSelectedBranch === 'All Branches' || item.branch === prSelectedBranch;
                          const matchType = prSelectedType === 'All Payment Types' || item.method === prSelectedType;
                          const matchStatus = prSelectedStatus === 'All Status' || item.status === prSelectedStatus;
                          return matchSearch && matchBranch && matchType && matchStatus;
                        })
                      ) : [
                        { date: '24 May 2025', ref: 'PAY-2025-0567', customer: 'All Star Motors', invoice: 'INV-2025-0187', method: 'Bank Transfer', amount: '$9,625.00', status: 'Completed', branch: 'Sydney Head Office' },
                        { date: '23 May 2025', ref: 'PAY-2025-0566', customer: 'Sydney Car Sales', invoice: 'INV-2025-0182', method: 'EFTPOS', amount: '$2,860.00', status: 'Completed', branch: 'Sydney Head Office' },
                        { date: '22 May 2025', ref: 'PAY-2025-0565', customer: 'Fast Freight Pty Ltd', invoice: 'INV-2025-0180', method: 'Bank Transfer', amount: '$5,280.00', status: 'Completed', branch: 'Melbourne Depot' },
                        { date: '22 May 2025', ref: 'PAY-2025-0564', customer: 'Metro Group Sydney', invoice: 'INV-2025-0176', method: 'Credit Card', amount: '$1,650.00', status: 'Completed', branch: 'Sydney Head Office' },
                        { date: '21 May 2025', ref: 'PAY-2025-0563', customer: 'Blue Line Logistics', invoice: 'INV-2025-0173', method: 'Bank Transfer', amount: '$3,960.00', status: 'Completed', branch: 'Brisbane Hub' }
                      ]).map((pay, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 text-slate-500 font-semibold">{pay.date}</td>
                          <td className="py-3 px-4 text-slate-900 font-extrabold font-mono">{pay.ref}</td>
                          <td className="py-3 px-4 font-extrabold text-slate-800">{pay.customer}</td>
                          <td 
                            onClick={() => {
                              const found = invoices.find(i => i.id === pay.invoice) || {
                                id: pay.invoice, customer: pay.customer, ref: 'LOAD-02548', issueDate: '10 May 2025', dueDate: '24 May 2025',
                                type: 'Tax Invoice', total: pay.amount, subtotal: pay.amount, gst: '$875.00', amountPaid: pay.amount,
                                balanceDue: '$0.00', status: 'Paid', email: 'accounts@allstarmotors.com.au', phone: '+61 2 9876 5432',
                                address: '12-14 Parramatta Rd, Lidcombe NSW 2141', abn: '85 123 456 789', terms: 'Net 14 Days', paidDate: '24 May 2025',
                                paymentMethod: pay.method, paymentRef: pay.ref, paymentDate: '24 May 2025', loadId: 'LOAD-02548',
                                jobDate: '10 May 2025', createdBy: 'Sarah Mitchell', createdOn: '10 May 2025 09:14 AM', lastUpdated: '24 May 2025 02:45 PM',
                                lineItems: [
                                  { id: 1, desc: 'Heavy Haulage Transportation Services', sub: 'Sydney NSW to Melbourne VIC Freight Cargo', qty: 1, unitPrice: '$8,750.00', gst: '$875.00', total: '$9,625.00' }
                                ],
                                attachments: [
                                  { name: 'signed_pod_load_02548.pdf', size: '1.4 MB', date: '24 May 2025' },
                                  { name: 'fuel_receipt_02548.pdf', size: '850 KB', date: '24 May 2025' },
                                  { name: 'gate_pass_melbourne.pdf', size: '420 KB', date: '24 May 2025' }
                                ]
                              };
                              handleOpenInvoiceDetail(found);
                            }}
                            className="py-3 px-4 text-indigo-600 font-extrabold font-mono hover:underline cursor-pointer"
                          >
                            {pay.invoice}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{pay.method}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-900 font-extrabold">{pay.amount}</td>
                          <td className="py-3 px-4">
                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-black">
                              {pay.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button onClick={() => triggerToast(`Actions for ${pay.ref}`)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px] font-semibold bg-slate-50/50">
                  <span>Showing 1 to 5 of 28 payments</span>
                  <div className="flex gap-1.5">
                    <button className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed font-bold" disabled>&lt;</button>
                    <button className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-black">1</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">2</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">3</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">4</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">5</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">6</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">&gt;</button>
                  </div>
                </div>
              </div>

              {/* RECEIPTS ISSUED */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">RECEIPTS ISSUED</h3>
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black">12</span>
                  </div>
                  <button onClick={() => triggerToast('Opening Full Receipts Ledger')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer">
                    View Report &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Receipt No.</th>
                        <th className="py-3 px-4">To (Customer)</th>
                        <th className="py-3 px-4">For</th>
                        <th className="py-3 px-4">Method</th>
                        <th className="py-3 px-4 text-right">Amount (Inc GST)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {((prSearchQuery || prSelectedBranch !== 'All Branches' || prSelectedType !== 'All Payment Types' || prSelectedStatus !== 'All Status') ? (
                        [
                          { date: '24 May 2025', ref: 'REC-2025-0125', customer: 'ABC Wholesalers', for: 'Overpayment Refund', method: 'Bank Transfer', amount: '$1,250.00', status: 'Issued', branch: 'Sydney Head Office' },
                          { date: '20 May 2025', ref: 'REC-2025-0124', customer: 'All Star Motors', for: 'Security Deposit Refund', method: 'Bank Transfer', amount: '$500.00', status: 'Issued', branch: 'Sydney Head Office' },
                          { date: '18 May 2025', ref: 'REC-2025-0123', customer: 'Quick Move Transport', for: 'Job Cancellation Refund', method: 'EFTPOS', amount: '$275.00', status: 'Issued', branch: 'Melbourne Depot' },
                          { date: '16 May 2025', ref: 'REC-2025-0122', customer: 'Prime Car Carriers', for: 'Overpayment Refund', method: 'Bank Transfer', amount: '$820.00', status: 'Issued', branch: 'Sydney Head Office' },
                          { date: '12 May 2025', ref: 'REC-2025-0121', customer: 'City Link Logistics', for: 'Overpayment Refund', method: 'Bank Transfer', amount: '$430.00', status: 'Issued', branch: 'Brisbane Hub' }
                        ].filter(item => {
                          const matchSearch = item.ref.toLowerCase().includes(prSearchQuery.toLowerCase()) || 
                                              item.customer.toLowerCase().includes(prSearchQuery.toLowerCase()) ||
                                              item.for.toLowerCase().includes(prSearchQuery.toLowerCase());
                          const matchBranch = prSelectedBranch === 'All Branches' || item.branch === prSelectedBranch;
                          const matchType = prSelectedType === 'All Payment Types' || item.method === prSelectedType;
                          const matchStatus = prSelectedStatus === 'All Status' || item.status === prSelectedStatus;
                          return matchSearch && matchBranch && matchType && matchStatus;
                        })
                      ) : [
                        { date: '24 May 2025', ref: 'REC-2025-0125', customer: 'ABC Wholesalers', for: 'Overpayment Refund', method: 'Bank Transfer', amount: '$1,250.00', status: 'Issued', branch: 'Sydney Head Office' },
                        { date: '20 May 2025', ref: 'REC-2025-0124', customer: 'All Star Motors', for: 'Security Deposit Refund', method: 'Bank Transfer', amount: '$500.00', status: 'Issued', branch: 'Sydney Head Office' },
                        { date: '18 May 2025', ref: 'REC-2025-0123', customer: 'Quick Move Transport', for: 'Job Cancellation Refund', method: 'EFTPOS', amount: '$275.00', status: 'Issued', branch: 'Melbourne Depot' },
                        { date: '16 May 2025', ref: 'REC-2025-0122', customer: 'Prime Car Carriers', for: 'Overpayment Refund', method: 'Bank Transfer', amount: '$820.00', status: 'Issued', branch: 'Sydney Head Office' },
                        { date: '12 May 2025', ref: 'REC-2025-0121', customer: 'City Link Logistics', for: 'Overpayment Refund', method: 'Bank Transfer', amount: '$430.00', status: 'Issued', branch: 'Brisbane Hub' }
                      ]).map((rec, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 text-slate-500 font-semibold">{rec.date}</td>
                          <td className="py-3 px-4 text-slate-900 font-extrabold font-mono">{rec.ref}</td>
                          <td className="py-3 px-4 font-extrabold text-slate-800">{rec.customer}</td>
                          <td className="py-3 px-4 text-slate-600 font-semibold">{rec.for}</td>
                          <td className="py-3 px-4 text-slate-600">{rec.method}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-900 font-extrabold">{rec.amount}</td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-black">
                              {rec.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button onClick={() => triggerToast(`Actions for ${rec.ref}`)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px] font-semibold bg-slate-50/50">
                  <span>Showing 1 to 5 of 12 receipts</span>
                  <div className="flex gap-1.5">
                    <button className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed font-bold" disabled>&lt;</button>
                    <button className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-black">1</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">2</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">3</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">&gt;</button>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Breakdowns & Ageing (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* PAYMENT METHODS BREAKDOWN */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PAYMENT METHODS BREAKDOWN (MTD)</h3>
                  <button onClick={() => triggerToast('Opening Payment Methods detailed report')} className="text-[10px] font-bold text-indigo-600 hover:underline">View Report &rarr;</button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                  {/* SVG Donut Chart */}
                  <div className="relative w-32 h-32 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                      {/* Bank Transfer (55.3%) -> Dasharray 55.3 44.7 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4f46e5" strokeWidth="4.2" strokeDasharray="55.3 44.7" strokeDashoffset="25" />
                      {/* EFTPOS (21.9%) -> Dasharray 21.9 78.1 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="4.2" strokeDasharray="21.9 78.1" strokeDashoffset="-30.3" />
                      {/* Credit Card (14.1%) -> Dasharray 14.1 85.9 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray="14.1 85.9" strokeDashoffset="-52.2" />
                      {/* Cash (5.6%) -> Dasharray 5.6 94.4 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="5.6 94.4" strokeDashoffset="-66.3" />
                      {/* Other (3.0%) -> Dasharray 3 97 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="4.2" strokeDasharray="3 97" strokeDashoffset="-71.9" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[12px] font-black text-slate-800 leading-tight">$586,220</span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total</span>
                    </div>
                  </div>

                  {/* Legend list */}
                  <div className="space-y-2 text-xs font-bold text-slate-700 w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5] shrink-0" />
                        <span>Bank Transfer</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$324,560 (55.3%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] shrink-0" />
                        <span>EFTPOS</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$128,750 (21.9%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shrink-0" />
                        <span>Credit Card</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$82,430 (14.1%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
                        <span>Cash</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$32,980 (5.6%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899] shrink-0" />
                        <span>Other</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$17,500 (3.0%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OUTSTANDING BY AGEING */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OUTSTANDING BY AGEING</h3>
                  <button onClick={() => triggerToast('Opening Ageing detailed report')} className="text-[10px] font-bold text-indigo-600 hover:underline">View Report &rarr;</button>
                </div>

                <div className="space-y-4 text-xs font-bold text-slate-700">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Current (0-30 days)</span>
                      <span>$105,140 (71.0%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '71%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>31-60 days</span>
                      <span>$22,350 (15.1%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '15.1%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>61-90 days</span>
                      <span>$12,600 (8.5%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: '8.5%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>90+ days</span>
                      <span>$7,800 (5.4%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '5.4%' }} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-slate-900 text-sm font-black border-t border-slate-100 pt-3">
                    <span>Total Outstanding</span>
                    <span className="font-mono text-indigo-700">$147,890</span>
                  </div>
                </div>
              </div>

              {/* RECENT PAYMENT ACTIVITY */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RECENT PAYMENT ACTIVITY</h3>
                  <button onClick={() => triggerToast('Opening full Activity Log')} className="text-[10px] font-bold text-indigo-600 hover:underline">View All &rarr;</button>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-extrabold leading-snug">
                        Payment <span className="font-mono font-black text-slate-900">PAY-2025-0567</span> of <span className="text-slate-900 font-black font-mono">$9,625.00</span> from All Star Motors
                      </p>
                      <span className="text-[10px] text-slate-400 font-normal">24 May 2025</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-extrabold leading-snug">
                        Payment <span className="font-mono font-black text-slate-900">PAY-2025-0566</span> of <span className="text-slate-900 font-black font-mono">$2,860.00</span> from Sydney Car Sales
                      </p>
                      <span className="text-[10px] text-slate-400 font-normal">23 May 2025</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-extrabold leading-snug">
                        Receipt <span className="font-mono font-black text-slate-900">REC-2025-0125</span> of <span className="text-slate-900 font-black font-mono">$1,250.00</span> to ABC Wholesalers
                      </p>
                      <span className="text-[10px] text-slate-400 font-normal">24 May 2025</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-extrabold leading-snug">
                        Payment <span className="font-mono font-black text-slate-900">PAY-2025-0565</span> of <span className="text-slate-900 font-black font-mono">$5,280.00</span> from Fast Freight Pty Ltd
                      </p>
                      <span className="text-[10px] text-slate-400 font-normal">22 May 2025</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-extrabold leading-snug">
                        Payment <span className="font-mono font-black text-slate-900">PAY-2025-0564</span> of <span className="text-slate-900 font-black font-mono">$1,650.00</span> from Metro Group Sydney
                      </p>
                      <span className="text-[10px] text-slate-400 font-normal">22 May 2025</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Developer Notes Footer Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Code2 className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-black uppercase tracking-widest text-purple-300">DEVELOPER NOTES &ndash; PAYMENTS & RECEIPTS</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] font-medium leading-relaxed">
              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">1. PURPOSE</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Track all incoming payments and outgoing receipts.</li>
                  <li>&bull; Provide real-time cash flow visibility.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">2. KEY FEATURES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Record payments and receipts manually.</li>
                  <li>&bull; Filter by date, branch, method and status.</li>
                  <li>&bull; Track outstanding and overdue amounts.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">3. AUTOMATION & ALERTS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Auto-match payments to invoices.</li>
                  <li>&bull; Overdue reminders for unpaid invoices.</li>
                  <li>&bull; Notify admin for large refunds or voids.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">4. PERMISSIONS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Admin: Full access (view, record, edit, delete).</li>
                  <li>&bull; Accounts: View, record and reconcile.</li>
                  <li>&bull; Read Only: View payment & receipt history.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">5. DATA SOURCES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Invoices, customers and payments.</li>
                  <li>&bull; Bank feeds and manual entries.</li>
                  <li>&bull; General ledger and cash accounts.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-semibold">
              <span>All times shown in your local time (AEST)</span>
              <span className="flex items-center gap-1.5 text-purple-400">&bull; Data auto-refreshes every 5 minutes <RefreshCw className="w-3 h-3 animate-spin" /></span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 5: 10.5 EXPENSES REPORT                                        */}
      {/* ========================================================================= */}
      {viewMode === 'expenses' && (
        <div className="flex flex-col gap-4">
          {/* Header Container */}
          <div className="space-y-4">
            {/* Top row: Breadcrumb and Help/Notifications */}
            <div className="flex flex-row justify-between items-center gap-2 flex-wrap pb-1.5 border-b border-slate-100/60">
              {/* Left: Breadcrumbs */}
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Home</span>
                <span className="text-slate-300 mx-1">›</span>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Finance</span>
                <span className="text-slate-300 mx-1">›</span>
                <span className="text-slate-900 font-extrabold">Expenses</span>
              </div>

              {/* Right: Help, Notification, User Avatar */}
              <div className="flex items-center gap-3.5 text-xs font-bold text-slate-700">
                <button onClick={() => triggerToast('Help center opened')} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Need help?
                </button>
                <div className="relative cursor-pointer text-slate-600 hover:text-slate-800" onClick={() => triggerToast('Notifications opened')}>
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-black leading-none">11</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0" title="User Profile">
                  SM
                </div>
              </div>
            </div>

            {/* Bottom row: Title and Buttons Layout */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              {/* Left Side: Title with Check Shield Badge and Subtitle */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    10.5 Expenses
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  Capture, review and manage all company expenses. Upload receipts and track approvals.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-end gap-2 shrink-0 max-w-full">
                {/* Desktop-only: More Actions Button on top right */}
                <div className="relative max-md:hidden">
                  <button 
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {showMoreActions && (
                    <>
                      <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                      <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                        <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                          <span>More Actions</span>
                          <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <button onClick={() => { setViewMode('dashboard'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📊 10.1 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 10.2 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💳 10.4 Payments & Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          💵 10.5 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          👥 10.6 Payroll Runs
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button onClick={() => { triggerToast('Synchronized bank feed'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          <RefreshCw className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Sync Bank Feed
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Buttons row */}
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap flex-nowrap pb-1.5 md:pb-0 scrollbar-none max-w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Expense', status: 'Pending' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Expense
                  </button>
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Expense', status: 'Completed' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Upload Receipt
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" /> Export
                  </button>

                  {/* Mobile-only: More Actions Button inline in the scrollable bar */}
                  <div className="relative md:hidden shrink-0">
                    <button 
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    {showMoreActions && (
                      <>
                        <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                        <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                          <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                            <span>More Actions</span>
                            <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                          </div>
                          <button onClick={() => { setViewMode('dashboard'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            📊 10.1 Finance Dashboard
                          </button>
                          <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            📄 10.2 Invoices List
                          </button>
                          <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            💳 10.4 Payments & Receipts
                          </button>
                          <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                            💵 10.5 Expenses
                          </button>
                          <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            👥 10.6 Payroll Runs
                          </button>
                          <div className="border-t border-slate-100 my-1" />
                          <button onClick={() => { triggerToast('Synchronized bank feed'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            <RefreshCw className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Sync Bank Feed
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 KPI Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">TOTAL EXPENSES (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$256,430</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 8.59% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening MTD Expenses report')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">PENDING APPROVAL</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$18,750</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5 font-bold">▼ 12.41% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Pending approvals list')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View items &rarr;
                </button>
              </div>
            </div>

            <div onClick={() => setViewMode('payroll')} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">APPROVED (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$237,680</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 8.10% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('payroll'); }} className="text-[10px] font-bold text-indigo-600 group-hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">REJECTED (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$1,920</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 4.21% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Rejected items breakdown')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View items &rarr;
                </button>
              </div>
            </div>

            <div onClick={() => setViewMode('payments_receipts')} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">REIMBURSEMENTS PAID</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$96,300</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 9.31% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('payments_receipts'); }} className="text-[10px] font-bold text-indigo-600 group-hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

          </div>

          {/* Filter Toolbar Bar */}
          <div className="bg-white p-3 border border-slate-200/80 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={expSearchQuery}
                onChange={e => setExpSearchQuery(e.target.value)}
                placeholder="Search by description, category, user, supplier..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select 
                value={expSelectedBranch}
                onChange={e => setExpSelectedBranch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Branches</option>
                <option>Sydney Head Office</option>
                <option>Melbourne Depot</option>
                <option>Brisbane Hub</option>
              </select>

              <select 
                value={expSelectedCategory}
                onChange={e => setExpSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Categories</option>
                <option>Fuel</option>
                <option>Maintenance</option>
                <option>Repairs</option>
                <option>Tolls</option>
                <option>Accommodation</option>
                <option>Meals</option>
                <option>Parking</option>
              </select>

              <select 
                value={expSelectedType}
                onChange={e => setExpSelectedType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Payment Types</option>
                <option>Company Card</option>
                <option>Bank Transfer</option>
                <option>EFTPOS</option>
                <option>Personal (Reimb.)</option>
              </select>

              <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>01 May 2025 - 31 May 2025</span>
              </button>

              <button 
                onClick={() => triggerToast('Filters Applied!')}
                className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-400" /> Filters
              </button>
              
              <button 
                onClick={() => {
                  setExpSearchQuery('');
                  setExpSelectedBranch('All Branches');
                  setExpSelectedCategory('All Categories');
                  setExpSelectedType('All Payment Types');
                  triggerToast('Filters reset successfully!');
                }}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Reset Filters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main 2-Column Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Tables & Lists (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* EXPENSES TABLE */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">EXPENSES</h3>
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black">36</span>
                  </div>
                  <button onClick={() => triggerToast('Opening Full Expenses Ledger')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer">
                    View Report &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Reference</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4 text-right">Amount (Inc GST)</th>
                        <th className="py-3 px-4">Payment Type</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Uploaded By</th>
                        <th className="py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {((expSearchQuery || expSelectedBranch !== 'All Branches' || expSelectedCategory !== 'All Categories' || expSelectedType !== 'All Payment Types') ? (
                        [
                          { date: '24 May 2025', ref: 'EXP-2025-0567', desc: 'Diesel - Port Macquarie Run', category: 'Fuel', amount: '$1,245.60', type: 'Company Card', status: 'Approved', user: 'John Driver', branch: 'Sydney Head Office' },
                          { date: '24 May 2025', ref: 'EXP-2025-0566', desc: 'Truck Service & Oil Change', category: 'Maintenance', amount: '$620.00', type: 'Bank Transfer', status: 'Pending', user: 'John Driver', branch: 'Sydney Head Office' },
                          { date: '23 May 2025', ref: 'EXP-2025-0565', desc: 'Tyre Repair - Rear Left', category: 'Repairs', amount: '$180.00', type: 'Company Card', status: 'Approved', user: 'John Driver', branch: 'Melbourne Depot' },
                          { date: '22 May 2025', ref: 'EXP-2025-0564', desc: 'Toll Fees - Sydney', category: 'Tolls', amount: '$82.40', type: 'EFTPOS', status: 'Approved', user: 'John Driver', branch: 'Sydney Head Office' },
                          { date: '22 May 2025', ref: 'EXP-2025-0563', desc: 'Truck Wash', category: 'Maintenance', amount: '$45.00', type: 'Company Card', status: 'Approved', user: 'John Driver', branch: 'Sydney Head Office' },
                          { date: '21 May 2025', ref: 'EXP-2025-0562', desc: 'Accommodation - Tamworth', category: 'Accommodation', amount: '$210.00', type: 'Personal (Reimb.)', status: 'Pending', user: 'John Driver', branch: 'Brisbane Hub' },
                          { date: '21 May 2025', ref: 'EXP-2025-0561', desc: 'Meals - Tamworth', category: 'Meals', amount: '$78.50', type: 'Personal (Reimb.)', status: 'Approved', user: 'John Driver', branch: 'Sydney Head Office' },
                          { date: '20 May 2025', ref: 'EXP-2025-0560', desc: 'Parking - Sydney CBD', category: 'Parking', amount: '$32.00', type: 'EFTPOS', status: 'Approved', user: 'John Driver', branch: 'Melbourne Depot' }
                        ].filter(item => {
                          const matchSearch = item.desc.toLowerCase().includes(expSearchQuery.toLowerCase()) || 
                                              item.ref.toLowerCase().includes(expSearchQuery.toLowerCase()) ||
                                              item.user.toLowerCase().includes(expSearchQuery.toLowerCase());
                          const matchBranch = expSelectedBranch === 'All Branches' || item.branch === expSelectedBranch;
                          const matchCategory = expSelectedCategory === 'All Categories' || item.category === expSelectedCategory;
                          const matchType = expSelectedType === 'All Payment Types' || item.type === expSelectedType;
                          return matchSearch && matchBranch && matchCategory && matchType;
                        })
                      ) : [
                        { date: '24 May 2025', ref: 'EXP-2025-0567', desc: 'Diesel - Port Macquarie Run', category: 'Fuel', amount: '$1,245.60', type: 'Company Card', status: 'Approved', user: 'John Driver', branch: 'Sydney Head Office' },
                        { date: '24 May 2025', ref: 'EXP-2025-0566', desc: 'Truck Service & Oil Change', category: 'Maintenance', amount: '$620.00', type: 'Bank Transfer', status: 'Pending', user: 'John Driver', branch: 'Sydney Head Office' },
                        { date: '23 May 2025', ref: 'EXP-2025-0565', desc: 'Tyre Repair - Rear Left', category: 'Repairs', amount: '$180.00', type: 'Company Card', status: 'Approved', user: 'John Driver', branch: 'Melbourne Depot' },
                        { date: '22 May 2025', ref: 'EXP-2025-0564', desc: 'Toll Fees - Sydney', category: 'Tolls', amount: '$82.40', type: 'EFTPOS', status: 'Approved', user: 'John Driver', branch: 'Sydney Head Office' },
                        { date: '22 May 2025', ref: 'EXP-2025-0563', desc: 'Truck Wash', category: 'Maintenance', amount: '$45.00', type: 'Company Card', status: 'Approved', user: 'John Driver', branch: 'Sydney Head Office' },
                        { date: '21 May 2025', ref: 'EXP-2025-0562', desc: 'Accommodation - Tamworth', category: 'Accommodation', amount: '$210.00', type: 'Personal (Reimb.)', status: 'Pending', user: 'John Driver', branch: 'Brisbane Hub' },
                        { date: '21 May 2025', ref: 'EXP-2025-0561', desc: 'Meals - Tamworth', category: 'Meals', amount: '$78.50', type: 'Personal (Reimb.)', status: 'Approved', user: 'John Driver', branch: 'Sydney Head Office' },
                        { date: '20 May 2025', ref: 'EXP-2025-0560', desc: 'Parking - Sydney CBD', category: 'Parking', amount: '$32.00', type: 'EFTPOS', status: 'Approved', user: 'John Driver', branch: 'Melbourne Depot' }
                      ]).map((exp, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 text-slate-500 font-semibold">{exp.date}</td>
                          <td className="py-3 px-4 text-slate-900 font-extrabold font-mono">{exp.ref}</td>
                          <td className="py-3 px-4 font-extrabold text-slate-800">{exp.desc}</td>
                          <td className="py-3 px-4 text-slate-600">{exp.category}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-900 font-extrabold">{exp.amount}</td>
                          <td className="py-3 px-4 text-slate-500 font-semibold">{exp.type}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                              exp.status === 'Approved' 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {exp.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{exp.user}</td>
                          <td className="py-3 px-4 text-right">
                            <button onClick={() => triggerToast(`Actions for ${exp.ref}`)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px] font-semibold bg-slate-50/50">
                  <span>Showing 1 to 8 of 36 expenses</span>
                  <div className="flex gap-1.5">
                    <button className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed font-bold" disabled>&lt;</button>
                    <button className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-black">1</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">2</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">3</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">4</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">5</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">&gt;</button>
                  </div>
                </div>
              </div>

              {/* Grid block for RECENT UPLOADS and EXPENSE APPROVAL STATUS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* RECENT UPLOADS (5) */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RECENT UPLOADS (5)</h3>
                      <button onClick={() => triggerToast('Viewing all uploads')} className="text-[10px] font-bold text-indigo-600 hover:underline">View all uploads &rarr;</button>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { name: 'Fuel_Receipt_001.pdf', size: '102 KB', date: '24 May 2025' },
                        { name: 'Service_Invoice_001.pdf', size: '245 KB', date: '24 May 2025' },
                        { name: 'Toll_Receipt_001.pdf', size: '98 KB', date: '23 May 2025' },
                        { name: 'Tyre_Repair_001.pdf', size: '122 KB', date: '23 May 2025' },
                        { name: 'Truck_Wash_001.pdf', size: '76 KB', date: '22 May 2025' }
                      ].map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-700 pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-slate-100 text-slate-400 p-1.5 rounded-lg">📄</span>
                            <div>
                              <p className="text-slate-800 font-extrabold truncate max-w-[150px]">{doc.name}</p>
                              <span className="text-[10px] text-slate-400 font-normal">{doc.size} &bull; {doc.date}</span>
                            </div>
                          </div>
                          <button onClick={() => triggerToast(`Downloading ${doc.name}`)} className="p-2 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* EXPENSE APPROVAL STATUS */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EXPENSE APPROVAL STATUS</h3>
                      <button onClick={() => triggerToast('Opening Approvals detailed report')} className="text-[10px] font-bold text-indigo-600 hover:underline">View all &rarr;</button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Approved</span>
                          <span>18 <span className="text-slate-400 font-normal">(50.0%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '50.0%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending</span>
                          <span>6 <span className="text-slate-400 font-normal">(16.7%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '16.7%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Rejected</span>
                          <span>1 <span className="text-slate-400 font-normal">(2.8%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: '2.8%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> Draft</span>
                          <span>11 <span className="text-slate-400 font-normal">(30.5%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '30.5%' }} />
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-slate-900 text-xs font-black">
                        <span>Total</span>
                        <span className="text-slate-700 font-black">36</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Breakdowns & Charts (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* EXPENSES BY CATEGORY */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EXPENSES BY CATEGORY (MTD)</h3>
                  <button onClick={() => triggerToast('Opening category breakdown detailed report')} className="text-[10px] font-bold text-indigo-600 hover:underline">View Report &rarr;</button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                  {/* SVG Donut Chart */}
                  <div className="relative w-32 h-32 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                      {/* Fuel (38.4%) -> Dasharray 38.4 61.6 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="4.2" strokeDasharray="38.4 61.6" strokeDashoffset="25" />
                      {/* Maintenance (22.0%) -> Dasharray 22 78 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="4.2" strokeDasharray="22 78" strokeDashoffset="-13.4" />
                      {/* Repairs (16.6%) -> Dasharray 16.6 83.4 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray="16.6 83.4" strokeDashoffset="-35.4" />
                      {/* Tolls (8.5%) -> Dasharray 8.5 91.5 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="8.5 91.5" strokeDashoffset="-52" />
                      {/* Accommodation (7.1%) -> Dasharray 7.1 92.9 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="4.2" strokeDasharray="7.1 92.9" strokeDashoffset="-60.5" />
                      {/* Other (7.2%) -> Dasharray 7.2 92.8 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94a3b8" strokeWidth="4.2" strokeDasharray="7.2 92.8" strokeDashoffset="-67.6" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[12px] font-black text-slate-800 leading-tight">$256,430</span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total</span>
                    </div>
                  </div>

                  {/* Legend list */}
                  <div className="space-y-2 text-xs font-bold text-slate-700 w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6] shrink-0" />
                        <span>Fuel</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$98,560 (38.4%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] shrink-0" />
                        <span>Maintenance</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$56,420 (22.0%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shrink-0" />
                        <span>Repairs</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$42,670 (16.6%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
                        <span>Tolls</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$21,850 (8.5%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899] shrink-0" />
                        <span>Accommodation</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$18,320 (7.1%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8] shrink-0" />
                        <span>Other</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$18,610 (7.2%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPENSES BY PAYMENT TYPE */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EXPENSES BY PAYMENT TYPE (MTD)</h3>
                  <button onClick={() => triggerToast('Opening Payment Types detailed report')} className="text-[10px] font-bold text-indigo-600 hover:underline">View Report &rarr;</button>
                </div>

                <div className="space-y-4 text-xs font-bold text-slate-700">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Company Card</span>
                      <span className="font-mono text-slate-600">$138,420 (53.9%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: '53.9%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Bank Transfer</span>
                      <span className="font-mono text-slate-600">$74,850 (29.2%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#3b82f6] rounded-full" style={{ width: '29.2%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>EFTPOS</span>
                      <span className="font-mono text-slate-600">$22,910 (8.9%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#10b981] rounded-full" style={{ width: '8.9%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Personal (Reimb.)</span>
                      <span className="font-mono text-slate-600">$20,250 (7.9%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: '7.9%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* TOP EXPENSE CATEGORIES */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TOP EXPENSE CATEGORIES (MTD)</h3>
                  <button onClick={() => triggerToast('Opening Categories detailed report')} className="text-[10px] font-bold text-indigo-600 hover:underline">View Report &rarr;</button>
                </div>

                <div className="space-y-3.5 text-xs font-bold text-slate-700">
                  <div className="flex justify-between items-center">
                    <span>Fuel</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-900">$98,560</span>
                      <span className="text-[10px] font-bold text-emerald-600 font-bold">▲ 12.3%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Maintenance</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-900">$56,420</span>
                      <span className="text-[10px] font-bold text-emerald-600 font-bold">▲ 6.7%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Repairs</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-900">$42,670</span>
                      <span className="text-[10px] font-bold text-emerald-600 font-bold">▲ 3.4%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Tolls</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-900">$21,850</span>
                      <span className="text-[10px] font-bold text-rose-500 font-bold">▼ 8.1%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Accommodation</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-900">$18,320</span>
                      <span className="text-[10px] font-bold text-emerald-600 font-bold">▲ 2.9%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Developer Notes Footer Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Code2 className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-black uppercase tracking-widest text-purple-300">DEVELOPER NOTES &ndash; EXPENSES</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] font-medium leading-relaxed">
              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">1. PURPOSE</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Capture and manage all company expenses.</li>
                  <li>&bull; Ensure compliance and accurate reporting.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">2. KEY FEATURES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Add expenses with receipt upload.</li>
                  <li>&bull; Categorise and track by payment type.</li>
                  <li>&bull; Approval workflow and reimbursement.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">3. AUTOMATION & ALERTS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Notify approvers for pending items.</li>
                  <li>&bull; Flag high value or duplicate expenses.</li>
                  <li>&bull; Auto-categorise using AI (future).</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">4. PERMISSIONS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Admin: Full access (view, add, edit, approve).</li>
                  <li>&bull; Accounts: View, add, edit, approve.</li>
                  <li>&bull; Drivers: Add own expenses only.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">5. DATA SOURCES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Receipts, invoices and statements.</li>
                  <li>&bull; Company card and bank feeds.</li>
                  <li>&bull; Driver expense submissions.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-semibold">
              <span>All times shown in your local time (AEST)</span>
              <span className="flex items-center gap-1.5 text-purple-400">&bull; Data auto-refreshes every 5 minutes <RefreshCw className="w-3 h-3 animate-spin" /></span>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddTransactionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-left">
            <div className="px-6 py-5 bg-[#4B0082] text-white flex justify-between items-center">
              <h3 className="text-base font-black flex items-center gap-2">
                <Plus className="w-4 h-4 stroke-[3px]" /> Create New Invoice / Transaction
              </h3>
              <button onClick={() => setShowAddTransactionModal(false)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransactionSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">CUSTOMER / VENDOR NAME *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sydney Car Sales"
                  value={transactionForm.customer}
                  onChange={e => setTransactionForm({ ...transactionForm, customer: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-purple-600 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">AMOUNT ($) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="12650"
                    value={transactionForm.amount}
                    onChange={e => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-purple-600 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">DUE DATE</label>
                  <input 
                    type="date" 
                    value={transactionForm.dueDate}
                    onChange={e => setTransactionForm({ ...transactionForm, dueDate: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-slate-900 font-bold focus:outline-none focus:border-purple-600 bg-slate-50 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">PAYMENT STATUS</label>
                <select 
                  value={transactionForm.status}
                  onChange={e => setTransactionForm({ ...transactionForm, status: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-3 text-slate-900 font-bold focus:outline-none focus:border-purple-600 bg-white cursor-pointer"
                >
                  <option value="Outstanding">Outstanding</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#4B0082] hover:bg-[#3b0066] text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all cursor-pointer active:scale-95 uppercase tracking-wider mt-2"
              >
                CREATE TRANSACTION
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-left">
            <div className="px-6 py-5 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="text-base font-black flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" /> Invoice Quick Preview ({selectedInvoice.id})
              </h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-bold text-slate-700">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <p className="flex justify-between"><span>Customer Name:</span> <strong className="text-slate-900">{selectedInvoice.customer}</strong></p>
                <p className="flex justify-between"><span>Reference Load:</span> <strong className="text-slate-700 font-mono">{selectedInvoice.ref}</strong></p>
                <p className="flex justify-between"><span>Invoice Amount:</span> <strong className="text-purple-600 text-sm font-mono">{selectedInvoice.amount}</strong></p>
                <p className="flex justify-between"><span>Issue Date:</span> <strong className="text-slate-700">{selectedInvoice.issueDate}</strong></p>
                <p className="flex justify-between"><span>Due Date:</span> <strong className="text-slate-700">{selectedInvoice.dueDate}</strong></p>
                <p className="flex justify-between items-center"><span>Status:</span> {getStatusBadge(selectedInvoice.status)}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => { setSelectedInvoice(null); handleOpenInvoiceDetail(selectedInvoice); }}
                  className="flex-1 bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-sm transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Open Full Details Page &rarr;
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="px-5 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 6: 10.6 PAYROLL RUNS                                           */}
      {/* ========================================================================= */}
      {viewMode === 'payroll' && (
        <div className="flex flex-col gap-4">
          {/* Header Container */}
          <div className="space-y-4">
            {/* Top row: Breadcrumb and Help/Notifications */}
            <div className="flex flex-row justify-between items-center gap-2 flex-wrap pb-1.5 border-b border-slate-100/60">
              {/* Left: Breadcrumbs */}
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Home</span>
                <span className="text-slate-300 mx-1">›</span>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Finance</span>
                <span className="text-slate-300 mx-1">›</span>
                <span className="text-slate-900 font-extrabold">Payroll Runs</span>
              </div>

              {/* Right: Help, Notification, User Avatar */}
              <div className="flex items-center gap-3.5 text-xs font-bold text-slate-700">
                <button onClick={() => triggerToast('Help center opened')} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Need help?
                </button>
                <div className="relative cursor-pointer text-slate-600 hover:text-slate-800" onClick={() => triggerToast('Notifications opened')}>
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-black leading-none">11</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0" title="User Profile">
                  SM
                </div>
              </div>
            </div>

            {/* Bottom row: Title and Buttons Layout */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              {/* Left Side: Title with Check Shield Badge and Subtitle */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    10.6 Payroll Runs
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  Create, run and manage payroll for drivers and staff. Review, approve and export.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-end gap-2 shrink-0 max-w-full">
                {/* Desktop-only: More Actions Button on top right */}
                <div className="relative max-md:hidden">
                  <button 
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {showMoreActions && (
                    <>
                      <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                      <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                        <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                          <span>More Actions</span>
                          <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <button onClick={() => { setViewMode('dashboard'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📊 10.1 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 10.2 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💳 10.4 Payments &amp; Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💵 10.5 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          👥 10.6 Payroll Runs
                        </button>
                        <button onClick={() => { setViewMode('receivables'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📈 10.7 Accounts Receivable
                        </button>
                        <button onClick={() => { setViewMode('reports'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💰 10.8 Financial Reports
                        </button>
                        <button onClick={() => { setViewMode('accountant'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          🏛️ 10.9 Accountant Export
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button onClick={() => { triggerToast('Synchronized bank feed'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          <RefreshCw className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Sync Bank Feed
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Buttons row */}
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap flex-nowrap pb-1.5 md:pb-0 scrollbar-none max-w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Payroll', status: 'Pending' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create Payroll Run
                  </button>
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Payroll', status: 'Completed' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Import Timesheets
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" /> Export
                  </button>

                  {/* Mobile-only: More Actions Button inline in the scrollable bar */}
                  <div className="relative md:hidden shrink-0">
                    <button 
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    {showMoreActions && (
                      <>
                        <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                        <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                          <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                            <span>More Actions</span>
                            <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                          </div>
                          <button onClick={() => { setViewMode('dashboard'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            📊 10.1 Finance Dashboard
                          </button>
                          <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            📄 10.2 Invoices List
                          </button>
                          <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            💳 10.4 Payments & Receipts
                          </button>
                          <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            💵 10.5 Expenses
                          </button>
                          <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                            👥 10.6 Payroll Runs
                          </button>
                          <div className="border-t border-slate-100 my-1" />
                          <button onClick={() => { triggerToast('Synchronized bank feed'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            <RefreshCw className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Sync Bank Feed
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 KPI Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">TOTAL PAYROLL (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$237,680</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 8.35% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Payroll MTD Detailed Report')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">PENDING APPROVAL</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$18,750</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5 font-bold">▼ 12.41% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Pending approvals list')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View items &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">APPROVED (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$218,930</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 7.92% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Approved payroll runs ledger')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div onClick={() => setViewMode('payments_receipts')} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">PAID (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$196,420</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 9.11% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('payments_receipts'); }} className="text-[10px] font-bold text-indigo-600 group-hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Building className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">SUPER PAYABLE (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$23,540</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 6.23% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Super payable detailed ledger')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

          </div>

          {/* Filter Toolbar Bar */}
          <div className="bg-white p-3 border border-slate-200/80 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={paySearchQuery}
                onChange={e => setPaySearchQuery(e.target.value)}
                placeholder="Search by run name, date range, branch..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select 
                value={paySelectedBranch}
                onChange={e => setPaySelectedBranch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Branches</option>
                <option>Sydney Head Office</option>
                <option>Melbourne Branch</option>
                <option>Brisbane Branch</option>
              </select>

              <select 
                value={paySelectedType}
                onChange={e => setPaySelectedType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Pay Types</option>
                <option>Weekly</option>
                <option>Fortnightly</option>
                <option>Salary</option>
              </select>

              <select 
                value={paySelectedStatus}
                onChange={e => setPaySelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
              >
                <option>All Status</option>
                <option>Paid</option>
                <option>Approved</option>
                <option>Draft</option>
              </select>

              <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>01 May 2025 - 31 May 2025</span>
              </button>

              <button 
                onClick={() => triggerToast('Filters Applied!')}
                className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-400" /> Filters
              </button>
              
              <button 
                onClick={() => {
                  setPaySearchQuery('');
                  setPaySelectedBranch('All Branches');
                  setPaySelectedType('All Pay Types');
                  setPaySelectedStatus('All Status');
                  triggerToast('Filters reset successfully!');
                }}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Reset Filters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main 2-Column Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Tables & Lists (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* PAYROLL RUNS TABLE */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">PAYROLL RUNS</h3>
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black">12</span>
                  </div>
                  <button onClick={() => triggerToast('Opening Full Payroll Run Ledger')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer">
                    View Report &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3 px-4">Run Name</th>
                        <th className="py-3 px-4">Pay Period</th>
                        <th className="py-3 px-4">Branch</th>
                        <th className="py-3 px-4 text-center">Employees</th>
                        <th className="py-3 px-4">Pay Type</th>
                        <th className="py-3 px-4 text-right">Total (Inc GST)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Created By</th>
                        <th className="py-3 px-4">Created On</th>
                        <th className="py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {((paySearchQuery || paySelectedBranch !== 'All Branches' || paySelectedType !== 'All Pay Types' || paySelectedStatus !== 'All Status') ? (
                        [
                          { name: 'Weekly Run - 26 May 2025', period: '19 May - 25 May 2025', branch: 'Sydney Head Office', employees: 28, type: 'Weekly', total: '$58,420.00', status: 'Paid', user: 'Sarah Mitchell', date: '26 May 2025' },
                          { name: 'Weekly Run - 19 May 2025', period: '12 May - 18 May 2025', branch: 'Sydney Head Office', employees: 27, type: 'Weekly', total: '$55,680.00', status: 'Paid', user: 'Sarah Mitchell', date: '19 May 2025' },
                          { name: 'Fortnightly Run - 18 May 2025', period: '05 May - 18 May 2025', branch: 'Brisbane Branch', employees: 15, type: 'Fortnightly', total: '$31,240.00', status: 'Approved', user: 'James Driver', date: '18 May 2025' },
                          { name: 'Weekly Run - 12 May 2025', period: '05 May - 11 May 2025', branch: 'Sydney Head Office', employees: 26, type: 'Weekly', total: '$53,960.00', status: 'Paid', user: 'Sarah Mitchell', date: '12 May 2025' },
                          { name: 'Weekly Run - 05 May 2025', period: '28 Apr - 04 May 2025', branch: 'Sydney Head Office', employees: 26, type: 'Weekly', total: '$52,730.00', status: 'Paid', user: 'Sarah Mitchell', date: '05 May 2025' },
                          { name: 'Salary Run - May 2025', period: '01 May - 31 May 2025', branch: 'Sydney Head Office', employees: 8, type: 'Salary', total: '$64,500.00', status: 'Draft', user: 'Sarah Mitchell', date: '01 May 2025' },
                          { name: 'Fortnightly Run - 04 May 2025', period: '21 Apr - 04 May 2025', branch: 'Melbourne Branch', employees: 12, type: 'Fortnightly', total: '$24,870.00', status: 'Paid', user: 'James Driver', date: '04 May 2025' },
                          { name: 'Weekly Run - 28 Apr 2025', period: '21 Apr - 27 Apr 2025', branch: 'Sydney Head Office', employees: 25, type: 'Weekly', total: '$51,280.00', status: 'Paid', user: 'Sarah Mitchell', date: '28 Apr 2025' }
                        ].filter(item => {
                          const matchSearch = item.name.toLowerCase().includes(paySearchQuery.toLowerCase()) || 
                                              item.branch.toLowerCase().includes(paySearchQuery.toLowerCase()) ||
                                              item.user.toLowerCase().includes(paySearchQuery.toLowerCase());
                          const matchBranch = paySelectedBranch === 'All Branches' || item.branch === paySelectedBranch;
                          const matchType = paySelectedType === 'All Pay Types' || item.type === paySelectedType;
                          const matchStatus = paySelectedStatus === 'All Status' || item.status === paySelectedStatus;
                          return matchSearch && matchBranch && matchType && matchStatus;
                        })
                      ) : [
                        { name: 'Weekly Run - 26 May 2025', period: '19 May - 25 May 2025', branch: 'Sydney Head Office', employees: 28, type: 'Weekly', total: '$58,420.00', status: 'Paid', user: 'Sarah Mitchell', date: '26 May 2025' },
                        { name: 'Weekly Run - 19 May 2025', period: '12 May - 18 May 2025', branch: 'Sydney Head Office', employees: 27, type: 'Weekly', total: '$55,680.00', status: 'Paid', user: 'Sarah Mitchell', date: '19 May 2025' },
                        { name: 'Fortnightly Run - 18 May 2025', period: '05 May - 18 May 2025', branch: 'Brisbane Branch', employees: 15, type: 'Fortnightly', total: '$31,240.00', status: 'Approved', user: 'James Driver', date: '18 May 2025' },
                        { name: 'Weekly Run - 12 May 2025', period: '05 May - 11 May 2025', branch: 'Sydney Head Office', employees: 26, type: 'Weekly', total: '$53,960.00', status: 'Paid', user: 'Sarah Mitchell', date: '12 May 2025' },
                        { name: 'Weekly Run - 05 May 2025', period: '28 Apr - 04 May 2025', branch: 'Sydney Head Office', employees: 26, type: 'Weekly', total: '$52,730.00', status: 'Paid', user: 'Sarah Mitchell', date: '05 May 2025' },
                        { name: 'Salary Run - May 2025', period: '01 May - 31 May 2025', branch: 'Sydney Head Office', employees: 8, type: 'Salary', total: '$64,500.00', status: 'Draft', user: 'Sarah Mitchell', date: '01 May 2025' },
                        { name: 'Fortnightly Run - 04 May 2025', period: '21 Apr - 04 May 2025', branch: 'Melbourne Branch', employees: 12, type: 'Fortnightly', total: '$24,870.00', status: 'Paid', user: 'James Driver', date: '04 May 2025' },
                        { name: 'Weekly Run - 28 Apr 2025', period: '21 Apr - 27 Apr 2025', branch: 'Sydney Head Office', employees: 25, type: 'Weekly', total: '$51,280.00', status: 'Paid', user: 'Sarah Mitchell', date: '28 Apr 2025' }
                      ]).map((pay, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 text-slate-900 font-extrabold">{pay.name}</td>
                          <td className="py-3 px-4 text-slate-500 font-semibold">{pay.period}</td>
                          <td className="py-3 px-4 font-semibold text-slate-700">{pay.branch}</td>
                          <td className="py-3 px-4 text-center text-slate-900 font-extrabold">{pay.employees}</td>
                          <td className="py-3 px-4 text-slate-600">{pay.type}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-900 font-extrabold">{pay.total}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                              pay.status === 'Paid' 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : pay.status === 'Approved'
                                ? 'bg-green-50 text-green-600 border border-green-100'
                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                              {pay.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{pay.user}</td>
                          <td className="py-3 px-4 text-slate-400 font-semibold">{pay.date}</td>
                          <td className="py-3 px-4 text-right">
                            <button onClick={() => triggerToast(`Actions for ${pay.name}`)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px] font-semibold bg-slate-50/50">
                  <span>Showing 1 to 8 of 12 payroll runs</span>
                  <div className="flex gap-1.5">
                    <button className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed font-bold" disabled>&lt;</button>
                    <button className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-black">1</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">2</button>
                    <button onClick={() => triggerToast('Next Page')} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-bold">&gt;</button>
                  </div>
                </div>
              </div>

              {/* Grid block for RECENT PAYROLL ACTIVITY and PAY TYPES BREAKDOWN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* RECENT PAYROLL ACTIVITY */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RECENT PAYROLL ACTIVITY</h3>
                      <button onClick={() => triggerToast('Viewing all payroll activity')} className="text-[10px] font-bold text-indigo-600 hover:underline">View All &rarr;</button>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { title: 'Weekly Run - 26 May 2025 paid', value: '$58,420.00', date: '26 May 2025' },
                        { title: 'Timesheets imported', value: '42 records', date: '25 May 2025' },
                        { title: 'Fortnightly Run - 18 May 2025 approved', value: '$31,240.00', date: '18 May 2025' },
                        { title: 'Payslips generated', value: '27 employees', date: '17 May 2025' },
                        { title: 'Superannuation file generated', value: '$9,120.00', date: '16 May 2025' }
                      ].map((activity, idx) => (
                        <div key={idx} className="flex justify-between items-start text-xs font-bold text-slate-700 pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                          <div className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-800 font-extrabold leading-snug">{activity.title}</p>
                              <span className="text-[10px] text-slate-400 font-normal">{activity.date}</span>
                            </div>
                          </div>
                          <span className="font-mono text-slate-900 font-black text-[11px] shrink-0">{activity.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PAY TYPES BREAKDOWN */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PAY TYPES BREAKDOWN (MTD)</h3>
                      <button onClick={() => triggerToast('Opening pay types breakdown detailed report')} className="text-[10px] font-bold text-indigo-600 hover:underline">View Report &rarr;</button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Driver Wages</span>
                          <span>$148,200 <span className="text-slate-400 font-normal">(62.3%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '62.3%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Staff Salaries</span>
                          <span>$64,500 <span className="text-slate-400 font-normal">(27.1%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '27.1%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Allowances</span>
                          <span>$12,340 <span className="text-slate-400 font-normal">(5.2%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '5.2%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Deductions</span>
                          <span>$3,520 <span className="text-slate-400 font-normal">(1.5%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: '1.5%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Overtime</span>
                          <span>$5,120 <span className="text-slate-400 font-normal">(2.1%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: '2.1%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Other</span>
                          <span>$3,920 <span className="text-slate-400 font-normal">(1.8%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-400 rounded-full" style={{ width: '1.8%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Breakdowns & Charts (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* PAYROLL SUMMARY */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PAYROLL SUMMARY (MTD)</h3>
                  <button onClick={() => triggerToast('Opening summary detailed report')} className="text-[10px] font-bold text-indigo-600 hover:underline">View Report &rarr;</button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                  {/* SVG Donut Chart */}
                  <div className="relative w-32 h-32 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                      {/* Driver Wages (62.3%) -> Dasharray 62.3 37.7 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="4.2" strokeDasharray="62.3 37.7" strokeDashoffset="25" />
                      {/* Staff Salaries (27.1%) -> Dasharray 27.1 72.9 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray="27.1 72.9" strokeDashoffset="-37.3" />
                      {/* Allowances (5.2%) -> Dasharray 5.2 94.8 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="5.2 94.8" strokeDashoffset="-64.4" />
                      {/* Superannuation (3.8%) -> Dasharray 3.8 96.2 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="3.8 96.2" strokeDashoffset="-69.6" />
                      {/* Other Deductions (1.5%) -> Dasharray 1.5 98.5 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="4.2" strokeDasharray="1.5 98.5" strokeDashoffset="-73.4" />
                      {/* Tax Payable (0%) */}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[12px] font-black text-slate-800 leading-tight">$237,680</span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total</span>
                    </div>
                  </div>

                  {/* Legend list */}
                  <div className="space-y-2 text-xs font-bold text-slate-700 w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6] shrink-0" />
                        <span>Driver Wages</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$148,200 (62.3%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shrink-0" />
                        <span>Staff Salaries</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$64,500 (27.1%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shrink-0" />
                        <span>Allowances</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$12,340 (5.2%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
                        <span>Superannuation</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$9,120 (3.8%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0" />
                        <span>Other Deductions</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$3,520 (1.5%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                        <span>Tax Payable</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px]">$0.00 (0%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYROLL STATUS */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PAYROLL STATUS (All Time)</h3>
                  <button onClick={() => triggerToast('Opening Status detailed report')} className="text-[10px] font-bold text-indigo-600 hover:underline">View Report &rarr;</button>
                </div>

                <div className="space-y-4 text-xs font-bold text-slate-700">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Draft</span>
                      <span className="font-mono text-slate-600">3 (8.3%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: '8.3%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Pending Approval</span>
                      <span className="font-mono text-slate-600">2 (5.6%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: '5.6%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Approved</span>
                      <span className="font-mono text-slate-600">5 (13.9%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#10b981] rounded-full" style={{ width: '13.9%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Paid</span>
                      <span className="font-mono text-slate-600">30 (83.3%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '83.3%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* UPCOMING PAYROLL */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">UPCOMING PAYROLL</h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3 border border-slate-100 rounded-xl flex justify-between items-center text-xs font-bold bg-slate-50/50">
                    <div>
                      <p className="text-slate-800 font-extrabold">Weekly Run - 02 Jun 2025</p>
                      <span className="text-[10px] text-slate-400 font-normal">Period: 26 May - 01 Jun 2025</span>
                    </div>
                    <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded text-[10px] font-black shrink-0">Due in 2 days</span>
                  </div>

                  <div className="p-3 border border-slate-100 rounded-xl flex justify-between items-center text-xs font-bold bg-slate-50/50">
                    <div>
                      <p className="text-slate-800 font-extrabold">Fortnightly Run - 01 Jun 2025</p>
                      <span className="text-[10px] text-slate-400 font-normal">Period: 19 May - 01 Jun 2025</span>
                    </div>
                    <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded text-[10px] font-black shrink-0">Due in 6 days</span>
                  </div>

                  <div className="p-3 border border-slate-100 rounded-xl flex justify-between items-center text-xs font-bold bg-slate-50/50">
                    <div>
                      <p className="text-slate-800 font-extrabold">Salary Run - Jun 2025</p>
                      <span className="text-[10px] text-slate-400 font-normal">Period: 01 Jun - 30 Jun 2025</span>
                    </div>
                    <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded text-[10px] font-black shrink-0">Due in 12 days</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Developer Notes Footer Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Code2 className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-black uppercase tracking-widest text-purple-300">DEVELOPER NOTES &ndash; PAYROLL RUNS</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] font-medium leading-relaxed">
              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">1. PURPOSE</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Create and manage payroll runs.</li>
                  <li>&bull; Track approval and payment status.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">2. KEY FEATURES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Support weekly, fortnightly and salary runs.</li>
                  <li>&bull; Import timesheets and calculate payroll.</li>
                  <li>&bull; Generate payslips and super files.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">3. AUTOMATION & ALERTS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Alert for payroll due dates.</li>
                  <li>&bull; Notify on approval and payment.</li>
                  <li>&bull; Auto-calculate taxes and super.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">4. PERMISSIONS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Admin: Full access (create, edit, approve, pay).</li>
                  <li>&bull; Accounts: View, create, approve, pay.</li>
                  <li>&bull; Read Only: View payroll runs and payslips.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">5. DATA SOURCES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Timesheets, employee records.</li>
                  <li>&bull; Pay rates and allowances.</li>
                  <li>&bull; Super and tax settings.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-semibold">
              <span>All times shown in your local time (AEST)</span>
              <span className="flex items-center gap-1.5 text-purple-400">&bull; Data auto-refreshes every 5 minutes <RefreshCw className="w-3 h-3 animate-spin" /></span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 7: 10.7 ACCOUNTS RECEIVABLE & OVERDUE INVOICES                  */}
      {/* ========================================================================= */}
      {viewMode === 'receivables' && (
        <div className="flex flex-col gap-4">
          {/* Header Container */}
          <div className="space-y-4">
            {/* Top row: Breadcrumb and Help/Notifications */}
            <div className="flex flex-row justify-between items-center gap-2 flex-wrap pb-1.5 border-b border-slate-100/60">
              {/* Left: Breadcrumbs */}
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Home</span>
                <span className="text-slate-300 mx-1">›</span>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Finance</span>
                <span className="text-slate-300 mx-1">›</span>
                <span className="text-slate-900 font-extrabold">Accounts Receivable</span>
              </div>

              {/* Right: Help, Notification, User Avatar */}
              <div className="flex items-center gap-3.5 text-xs font-bold text-slate-700">
                <button onClick={() => triggerToast('Help center opened')} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Need help?
                </button>
                <div className="relative cursor-pointer text-slate-600 hover:text-slate-800" onClick={() => triggerToast('Notifications opened')}>
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-black leading-none">11</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0" title="User Profile">
                  SM
                </div>
              </div>
            </div>

            {/* Bottom row: Title and Buttons Layout */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              {/* Left Side: Title with Check Shield Badge and Subtitle */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    10.7 Accounts Receivable &amp; Overdue Invoices
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  Monitor outstanding receivables, ageing, overdue invoices and client payment performance.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-end gap-2 shrink-0 max-w-full">
                {/* Desktop-only: More Actions Button on top right */}
                <div className="relative max-md:hidden">
                  <button 
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {showMoreActions && (
                    <>
                      <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                      <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                        <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                          <span>More Actions</span>
                          <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <button onClick={() => { setViewMode('dashboard'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📊 10.1 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 10.2 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💳 10.4 Payments &amp; Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💵 10.5 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          👥 10.6 Payroll Runs
                        </button>
                        <button onClick={() => { setViewMode('receivables'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          📈 10.7 Accounts Receivable
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button onClick={() => { triggerToast('Synchronized bank feed'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          <RefreshCw className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Sync Bank Feed
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Buttons row */}
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap flex-nowrap pb-1.5 md:pb-0 scrollbar-none max-w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" /> Export
                  </button>
                  <button 
                    onClick={() => triggerToast('Payment reminders sent to overdue clients!')}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    <Mail className="w-3.5 h-3.5" /> Send Reminders
                  </button>

                  {/* Mobile-only: More Actions Button inline */}
                  <div className="relative md:hidden shrink-0">
                    <button 
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 KPI Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">TOTAL RECEIVABLES (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$147,890</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 9.31% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Total Receivables report')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">OVERDUE AMOUNT</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$42,750</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5 font-bold">▲ 14.1% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Overdue Amount ledger')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">OVERDUE INVOICES</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">24</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5 font-bold">▲ 4 <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Overdue Invoices list')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">CURRENT RECEIVABLES</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$105,140</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 7.42% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Current Receivables report')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">AVG DAYS TO PAY</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">32 Days</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▼ 3 Days <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Days to Pay Analytics')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

          </div>

          {/* Filter Toolbar Bar */}
          <div className="bg-white p-3 border border-slate-200/80 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={recSearchQuery}
                onChange={e => setRecSearchQuery(e.target.value)}
                placeholder="Search by customer, invoice, reference..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select 
                value={recSelectedBranch}
                onChange={e => setRecSelectedBranch(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option>All Branches</option>
                <option>Sydney Head Office</option>
                <option>Melbourne Branch</option>
                <option>Brisbane Branch</option>
              </select>

              <select 
                value={recSelectedCustomer}
                onChange={e => setRecSelectedCustomer(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option>All Customers</option>
                <option>Fast Freight Pty Ltd</option>
                <option>Metro Group Sydney</option>
                <option>ABC Wholesalers</option>
                <option>Prime Car Carriers</option>
                <option>All Star Motors</option>
              </select>

              <select 
                value={recSelectedStatus}
                onChange={e => setRecSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option>All Status</option>
                <option>Overdue</option>
                <option>Current</option>
              </select>

              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-700 font-semibold cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>01 May 2025 - 31 May 2025</span>
              </div>

              <button 
                onClick={() => triggerToast('Advanced Filters toggled')}
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl border border-slate-200 font-bold transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-500" /> Filters
              </button>

              <button 
                onClick={() => { setRecSearchQuery(''); setRecSelectedBranch('All Branches'); setRecSelectedCustomer('All Customers'); setRecSelectedStatus('All Status'); triggerToast('Receivables list refreshed'); }}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                title="Refresh Receivables"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid Layout: Left Column (Table & Donut Chart), Right Column (Debtors, Payment Activity, Overdue Snapshot) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left 8 Cols */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* AGED RECEIVABLES (MTD) CARD */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AGED RECEIVABLES (MTD)</h3>
                  <button onClick={() => triggerToast('Opening Aged Receivables detailed report')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                    View Report &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  {/* Left: Donut SVG Chart */}
                  <div className="sm:col-span-6 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-emerald-500"
                          strokeWidth="4"
                          strokeDasharray="71, 100"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-amber-500"
                          strokeWidth="4"
                          strokeDasharray="15.1, 100"
                          strokeDashoffset="-71"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-rose-500"
                          strokeWidth="4"
                          strokeDasharray="8.5, 100"
                          strokeDashoffset="-86.1"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-purple-600"
                          strokeWidth="4"
                          strokeDasharray="5.4, 100"
                          strokeDashoffset="-94.6"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[13px] font-black text-slate-900 tracking-tight">$147,890</span>
                        <span className="text-[9px] font-bold text-slate-400">Total</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-slate-600">Current (0-30 days)</span>
                        <span className="text-slate-900 font-mono ml-auto">$105,140 (71.0%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-slate-600">31-60 days</span>
                        <span className="text-slate-900 font-mono ml-auto">$22,350 (15.1%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                        <span className="text-slate-600">61-90 days</span>
                        <span className="text-slate-900 font-mono ml-auto">$12,600 (8.5%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                        <span className="text-slate-600">90+ days</span>
                        <span className="text-slate-900 font-mono ml-auto">$7,800 (5.4%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Horizontal Progress Bars */}
                  <div className="sm:col-span-6 space-y-3 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 text-xs font-bold">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-600">Current (0-30 days)</span>
                        <span className="font-mono text-slate-800">$105,140</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '71%' }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-600">31-60 days</span>
                        <span className="font-mono text-slate-800">$22,350</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '15.1%' }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-600">61-90 days</span>
                        <span className="font-mono text-slate-800">$12,600</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '8.5%' }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-600">90+ days</span>
                        <span className="font-mono text-slate-800">$7,800</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: '5.4%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* OVERDUE INVOICES TABLE CARD */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden space-y-3 p-5">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OVERDUE INVOICES</h3>
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full">24</span>
                  </div>
                  <button onClick={() => triggerToast('Opening Overdue Invoices detailed report')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                    View Report &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Invoice No.</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Invoice Date</th>
                        <th className="py-2.5 px-3">Due Date</th>
                        <th className="py-2.5 px-3 text-center">Days Overdue</th>
                        <th className="py-2.5 px-3">Amount (Inc GST)</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      {[
                        { id: 'INV-2025-0180', customer: 'Fast Freight Pty Ltd', issueDate: '05 May 2025', dueDate: '19 May 2025', daysOverdue: 13, amount: '$5,280.00', status: 'Overdue' },
                        { id: 'INV-2025-0176', customer: 'Metro Group Sydney', issueDate: '05 May 2025', dueDate: '19 May 2025', daysOverdue: 13, amount: '$1,650.00', status: 'Overdue' },
                        { id: 'INV-2025-0168', customer: 'ABC Wholesalers', issueDate: '30 Apr 2025', dueDate: '15 May 2025', daysOverdue: 17, amount: '$6,820.00', status: 'Overdue' },
                        { id: 'INV-2025-0162', customer: 'Prime Car Carriers', issueDate: '28 Apr 2025', dueDate: '12 May 2025', daysOverdue: 20, amount: '$3,950.00', status: 'Overdue' },
                        { id: 'INV-2025-0159', customer: 'Quick Move Transport', issueDate: '25 Apr 2025', dueDate: '09 May 2025', daysOverdue: 23, amount: '$2,480.00', status: 'Overdue' },
                        { id: 'INV-2025-0151', customer: 'Blue Line Logistics', issueDate: '21 Apr 2025', dueDate: '05 May 2025', daysOverdue: 27, amount: '$4,230.00', status: 'Overdue' },
                        { id: 'INV-2025-0148', customer: 'City Link Logistics', issueDate: '18 Apr 2025', dueDate: '02 May 2025', daysOverdue: 30, amount: '$2,350.00', status: 'Overdue' },
                        { id: 'INV-2025-0136', customer: 'Sydney Car Sales', issueDate: '10 Apr 2025', dueDate: '24 Apr 2025', daysOverdue: 38, amount: '$2,860.00', status: 'Overdue' },
                      ]
                      .filter(inv => {
                        const matchesSearch = inv.id.toLowerCase().includes(recSearchQuery.toLowerCase()) || inv.customer.toLowerCase().includes(recSearchQuery.toLowerCase());
                        const matchesCustomer = recSelectedCustomer === 'All Customers' || inv.customer === recSelectedCustomer;
                        return matchesSearch && matchesCustomer;
                      })
                      .map((inv, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900 font-mono text-[11px]">{inv.id}</td>
                          <td className="py-3 px-3 font-bold text-slate-800">{inv.customer}</td>
                          <td className="py-3 px-3 text-slate-500 text-[11px]">{inv.issueDate}</td>
                          <td className="py-3 px-3 text-slate-500 text-[11px]">{inv.dueDate}</td>
                          <td className="py-3 px-3 text-center font-bold text-rose-600">{inv.daysOverdue}</td>
                          <td className="py-3 px-3 font-mono font-black text-slate-900">{inv.amount}</td>
                          <td className="py-3 px-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => triggerToast(`Viewing details for ${inv.id}`)} className="text-indigo-600 hover:text-indigo-800 text-[11px] font-extrabold cursor-pointer">
                                View
                              </button>
                              <button onClick={() => triggerToast(`Actions menu for ${inv.id}`)} className="text-slate-400 hover:text-slate-600 p-1">
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Pagination */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
                  <span>Showing 1 to 8 of 24 overdue invoices</span>
                  <div className="flex items-center gap-1">
                    <button className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600">&lt;</button>
                    <button className="px-2.5 py-1 bg-indigo-600 text-white font-black rounded-lg">1</button>
                    <button className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700">2</button>
                    <button className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700">3</button>
                    <button className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600">&gt;</button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 4 Cols */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* TOP DEBTORS (OUTSTANDING) CARD */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TOP DEBTORS (OUTSTANDING)</h3>
                  <button onClick={() => triggerToast('Opening Top Debtors report')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                    View Report &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Outstanding (Inc GST)</th>
                        <th className="pb-2 text-right">% of Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                      {[
                        { customer: 'All Star Motors', amount: '$28,650.00', percentage: '19.3%' },
                        { customer: 'Fast Freight Pty Ltd', amount: '$18,920.00', percentage: '12.8%' },
                        { customer: 'Metro Group Sydney', amount: '$14,780.00', percentage: '10.0%' },
                        { customer: 'ABC Wholesalers', amount: '$12,540.00', percentage: '8.5%' },
                        { customer: 'Prime Car Carriers', amount: '$9,860.00', percentage: '6.7%' },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 text-slate-900 font-extrabold">{row.customer}</td>
                          <td className="py-2.5 font-mono">{row.amount}</td>
                          <td className="py-2.5 text-right font-mono text-slate-500">{row.percentage}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50/80 font-black text-slate-900 border-t-2 border-slate-200">
                        <td className="py-2.5">Total Top Debtors</td>
                        <td className="py-2.5 font-mono">$84,750.00</td>
                        <td className="py-2.5 text-right font-mono">57.3%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RECENT PAYMENT ACTIVITY CARD */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RECENT PAYMENT ACTIVITY</h3>
                  <button onClick={() => triggerToast('Opening Payment Activity log')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-3 text-xs font-bold text-slate-700">
                  {[
                    { ref: 'Payment PAY-2025-0567 of $9,625.00 from All Star Motors', date: '24 May 2025' },
                    { ref: 'Payment PAY-2025-0566 of $2,860.00 from Sydney Car Sales', date: '23 May 2025' },
                    { ref: 'Payment PAY-2025-0565 of $5,280.00 from Fast Freight Pty Ltd', date: '22 May 2025' },
                    { ref: 'Payment PAY-2025-0564 of $1,650.00 from Metro Group Sydney', date: '22 May 2025' },
                    { ref: 'Payment PAY-2025-0563 of $3,960.00 from Blue Line Logistics', date: '21 May 2025' },
                  ].map((act, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="truncate text-slate-800 text-[11px] font-semibold">{act.ref}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px] shrink-0">{act.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* OVERDUE SNAPSHOT CARD */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OVERDUE SNAPSHOT</h3>
                  <button onClick={() => triggerToast('Opening Overdue Snapshot report')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                    View Report &rarr;
                  </button>
                </div>

                <div className="space-y-3 text-xs font-bold text-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Invoices &gt; 90 days</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-mono">7</span>
                      <span className="font-mono text-slate-900">$7,800.00</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Invoices 61-90 days</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-mono">5</span>
                      <span className="font-mono text-slate-900">$12,600.00</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Invoices 31-60 days</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-mono">8</span>
                      <span className="font-mono text-slate-900">$22,350.00</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-rose-600 font-black">
                    <span>Total Overdue</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono">24</span>
                      <span className="font-mono text-sm">$42,750.00</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* DEVELOPER NOTES BOX */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider border-b border-slate-800 pb-3">
              <Code className="w-4 h-4" /> DEVELOPER NOTES &ndash; ACCOUNTS RECEIVABLE &amp; OVERDUE INVOICES
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">1. PURPOSE</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Track outstanding receivables and overdue invoices.</li>
                  <li>&bull; Monitor customer payment performance.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">2. KEY FEATURES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Ageing buckets (0-30, 31-60, 61-90, 90+ days).</li>
                  <li>&bull; Overdue invoice listing with days overdue.</li>
                  <li>&bull; Top debtors and recent payment activity.</li>
                  <li>&bull; Send reminders to customers.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">3. AUTOMATION &amp; ALERTS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Auto-calculate ageing and totals.</li>
                  <li>&bull; Send payment reminders for overdue invoices.</li>
                  <li>&bull; Notify admin for high overdue amounts.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">4. PERMISSIONS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Admin: Full access.</li>
                  <li>&bull; Accounts: View, manage, send reminders.</li>
                  <li>&bull; Read Only: View reports.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">5. DATA SOURCES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Invoices and payments.</li>
                  <li>&bull; Customers and branches.</li>
                  <li>&bull; Bank transactions (reconciliation).</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-semibold">
              <span>All times shown in your local time (AEST)</span>
              <span className="flex items-center gap-1.5 text-purple-400">&bull; Data auto-refreshes every 5 minutes <RefreshCw className="w-3 h-3 animate-spin" /></span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 8: 10.8 PROFIT & LOSS / FINANCIAL REPORTS                       */}
      {/* ========================================================================= */}
      {viewMode === 'reports' && (
        <div className="flex flex-col gap-4">
          {/* Header Container */}
          <div className="space-y-4">
            {/* Top row: Breadcrumb and Help/Notifications */}
            <div className="flex flex-row justify-between items-center gap-2 flex-wrap pb-1.5 border-b border-slate-100/60">
              {/* Left: Breadcrumbs */}
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Home</span>
                <span className="text-slate-300 mx-1">›</span>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Finance</span>
                <span className="text-slate-300 mx-1">›</span>
                <span className="text-slate-900 font-extrabold">Financial Reports</span>
              </div>

              {/* Right: Help, Notification, User Avatar */}
              <div className="flex items-center gap-3.5 text-xs font-bold text-slate-700">
                <button onClick={() => triggerToast('Help center opened')} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Need help?
                </button>
                <div className="relative cursor-pointer text-slate-600 hover:text-slate-800" onClick={() => triggerToast('Notifications opened')}>
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-black leading-none">11</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0" title="User Profile">
                  SM
                </div>
              </div>
            </div>

            {/* Bottom row: Title and Buttons Layout */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              {/* Left Side: Title with Check Shield Badge and Subtitle */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    10.8 Profit &amp; Loss / Financial Reports
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  Analyse company profitability, track financial performance and generate key reports.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-end gap-2 shrink-0 max-w-full">
                {/* Desktop-only: More Actions Button on top right */}
                <div className="relative max-md:hidden">
                  <button 
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {showMoreActions && (
                    <>
                      <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                      <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                        <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                          <span>More Actions</span>
                          <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <button onClick={() => { setViewMode('dashboard'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📊 10.1 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 10.2 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💳 10.4 Payments &amp; Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💵 10.5 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          👥 10.6 Payroll Runs
                        </button>
                        <button onClick={() => { setViewMode('receivables'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📈 10.7 Accounts Receivable
                        </button>
                        <button onClick={() => { setViewMode('reports'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          💰 10.8 Financial Reports
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button onClick={() => { triggerToast('Synchronized bank feed'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          <RefreshCw className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Sync Bank Feed
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Buttons row */}
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap flex-nowrap pb-1.5 md:pb-0 scrollbar-none max-w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" /> Export
                  </button>
                  <button 
                    onClick={() => triggerToast('Schedule report modal opened!')}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Schedule Report
                  </button>

                  {/* Mobile-only: More Actions Button inline */}
                  <div className="relative md:hidden shrink-0">
                    <button 
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 KPI Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">NET PROFIT (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$586,220</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 11.2% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Net Profit report')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <BarChart2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">TOTAL REVENUE (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$842,650</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 12.3% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Revenue breakdown')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">TOTAL EXPENSES (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$256,430</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 8.5% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Expenses breakdown')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Building className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">GROSS PROFIT (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$652,180</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 13.7% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Gross Profit ledger')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">NET PROFIT MARGIN (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">69.5%</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ 2.4% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Opening Profit Margin Analytics')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

          </div>

          {/* Filter Toolbar Bar */}
          <div className="bg-white p-3 border border-slate-200/80 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={repSearchQuery}
                onChange={e => setRepSearchQuery(e.target.value)}
                placeholder="Search by account, report name..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select 
                value={repSelectedBranch}
                onChange={e => setRepSelectedBranch(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option>All Branches</option>
                <option>Sydney Head Office</option>
                <option>Melbourne Branch</option>
                <option>Brisbane Branch</option>
              </select>

              <select 
                value={repSelectedAccount}
                onChange={e => setRepSelectedAccount(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option>All Accounts</option>
                <option>Operating Accounts</option>
                <option>Capital Accounts</option>
              </select>

              <select 
                value={repSelectedTimeframe}
                onChange={e => setRepSelectedTimeframe(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Quarter</option>
                <option>Financial Year 2025</option>
              </select>

              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-700 font-semibold cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>01 May 2025 - 31 May 2025</span>
              </div>

              <button 
                onClick={() => triggerToast('Advanced Filters toggled')}
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl border border-slate-200 font-bold transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-500" /> Filters
              </button>

              <button 
                onClick={() => { setRepSearchQuery(''); setRepSelectedBranch('All Branches'); setRepSelectedAccount('All Accounts'); setRepSelectedTimeframe('This Month'); triggerToast('Financial Reports refreshed'); }}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                title="Refresh Reports"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid Row 1: Left Column (P&L Summary Table & Bar Chart), Right Column (Net Profit Trend Line Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left 7 Cols: PROFIT & LOSS SUMMARY */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PROFIT &amp; LOSS SUMMARY (MTD)</h3>
                <button onClick={() => triggerToast('Opening P&L detailed summary')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                  View Report &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Left: Summary Table */}
                <div className="sm:col-span-5 space-y-2 text-xs font-bold text-slate-700">
                  <div className="flex justify-between pb-1">
                    <span>Total Revenue</span>
                    <span className="font-mono text-slate-900">$842,650</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500">Cost of Sales</span>
                    <span className="font-mono text-slate-500">-$190,470</span>
                  </div>
                  <div className="flex justify-between border-t border-b border-slate-100 py-1.5 font-extrabold">
                    <span>Gross Profit</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-900">$652,180</span>
                      <span className="text-emerald-600 font-mono text-[11px]">77.4%</span>
                    </div>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500">Operating Expenses</span>
                    <span className="font-mono text-slate-500">-$215,320</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500">Other Income</span>
                    <span className="font-mono text-slate-500">$12,450</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500">Other Expenses</span>
                    <span className="font-mono text-slate-500">-$1,090</span>
                  </div>
                  <div className="flex justify-between border-t-2 border-slate-900 pt-2 font-black text-sm">
                    <span>Net Profit</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-900">$586,220</span>
                      <span className="text-emerald-600 font-mono text-xs">69.5%</span>
                    </div>
                  </div>
                </div>

                {/* Right: Revenue vs Expenses Combo Bar/Line SVG Chart */}
                <div className="sm:col-span-7 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-4 space-y-2">
                  <div className="flex justify-end gap-3 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-xs" /> Revenue</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-xs" /> Expenses</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-emerald-500" /> Net Profit</span>
                  </div>

                  <div className="relative h-44 w-full pt-4">
                    <svg className="w-full h-full" viewBox="0 0 280 120" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="280" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="50" x2="280" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="80" x2="280" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                      
                      {/* Bars Pair 1 */}
                      <rect x="25" y="30" width="10" height="50" fill="#6366f1" rx="2" />
                      <rect x="37" y="65" width="10" height="15" fill="#f43f5e" rx="2" />
                      
                      {/* Bars Pair 2 */}
                      <rect x="75" y="20" width="10" height="60" fill="#6366f1" rx="2" />
                      <rect x="87" y="60" width="10" height="20" fill="#f43f5e" rx="2" />

                      {/* Bars Pair 3 */}
                      <rect x="125" y="15" width="10" height="65" fill="#6366f1" rx="2" />
                      <rect x="137" y="62" width="10" height="18" fill="#f43f5e" rx="2" />

                      {/* Bars Pair 4 */}
                      <rect x="175" y="25" width="10" height="55" fill="#6366f1" rx="2" />
                      <rect x="187" y="58" width="10" height="22" fill="#f43f5e" rx="2" />

                      {/* Bars Pair 5 */}
                      <rect x="225" y="35" width="10" height="45" fill="#6366f1" rx="2" />
                      <rect x="237" y="68" width="10" height="12" fill="#f43f5e" rx="2" />

                      {/* Net Profit Overlay Line */}
                      <path
                        d="M 31 42 Q 81 32, 131 28 T 231 46"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                      />
                      <circle cx="31" cy="42" r="3" fill="#10b981" />
                      <circle cx="81" cy="32" r="3" fill="#10b981" />
                      <circle cx="131" cy="28" r="3" fill="#10b981" />
                      <circle cx="181" cy="38" r="3" fill="#10b981" />
                      <circle cx="231" cy="46" r="3" fill="#10b981" />
                    </svg>

                    <div className="flex justify-between text-[9px] font-bold text-slate-400 pt-1">
                      <span>1 May</span>
                      <span>8 May</span>
                      <span>15 May</span>
                      <span>22 May</span>
                      <span>29 May</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: NET PROFIT TREND */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">NET PROFIT TREND</h3>
                <button onClick={() => triggerToast('Opening Net Profit Trend detailed report')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                  View Report &rarr;
                </button>
              </div>

              <div className="relative h-56 w-full pt-4">
                <svg className="w-full h-full" viewBox="0 0 240 130" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area fill */}
                  <path
                    d="M 15 65 Q 55 50, 95 30 T 175 45 T 225 15 L 225 110 L 15 110 Z"
                    fill="url(#profitGrad)"
                  />
                  
                  {/* Smooth Line */}
                  <path
                    d="M 15 65 Q 55 50, 95 30 T 175 45 T 225 15"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                  />
                  
                  {/* Nodes */}
                  <circle cx="15" cy="65" r="3.5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="55" cy="50" r="3.5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="95" cy="30" r="3.5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="135" cy="55" r="3.5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="175" cy="45" r="3.5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="225" cy="15" r="4" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* Callout box on latest node */}
                <div className="absolute top-1 right-2 bg-white border border-slate-200 rounded-xl px-2.5 py-1 shadow-md text-[10px] font-bold text-slate-800">
                  <span className="text-slate-400 block text-[8px] uppercase">May 2025</span>
                  <span className="font-mono text-indigo-600 font-extrabold">$586,220</span>
                </div>

                <div className="flex justify-between text-[9px] font-bold text-slate-400 pt-2 border-t border-slate-100">
                  <span>Dec 24</span>
                  <span>Jan 25</span>
                  <span>Feb 25</span>
                  <span>Mar 25</span>
                  <span>Apr 25</span>
                  <span>May 25</span>
                </div>
              </div>
            </div>

          </div>

          {/* Grid Row 2: Category Breakdown (5 cols), Expenses Breakdown Donut (4 cols), Financial Reports list (3 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left 5 Cols: PROFIT & LOSS BY CATEGORY */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PROFIT &amp; LOSS BY CATEGORY (MTD)</h3>
                <button onClick={() => triggerToast('Opening Category detailed report')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                  View Report &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="pb-2">Category</th>
                      <th className="pb-2">Revenue</th>
                      <th className="pb-2 text-right">%</th>
                      <th className="pb-2">Expenses</th>
                      <th className="pb-2 text-right">%</th>
                      <th className="pb-2">Net Profit</th>
                      <th className="pb-2 text-right">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { cat: 'Freight Income', rev: '$612,340', revP: '72.7%', exp: '$145,210', expP: '56.7%', net: '$467,130', margin: '76.3%' },
                      { cat: 'Fuel Surcharge', rev: '$86,750', revP: '10.3%', exp: '$12,860', expP: '5.0%', net: '$73,890', margin: '85.2%' },
                      { cat: 'Storage Income', rev: '$42,560', revP: '5.1%', exp: '$8,320', expP: '3.2%', net: '$34,240', margin: '80.5%' },
                      { cat: 'Other Income', rev: '$101,000', revP: '12.0%', exp: '$29,050', expP: '11.3%', net: '$71,950', margin: '71.2%' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 text-slate-900 font-extrabold text-[11px]">{row.cat}</td>
                        <td className="py-2.5 font-mono text-[11px]">{row.rev}</td>
                        <td className="py-2.5 text-right font-mono text-slate-400 text-[10px]">{row.revP}</td>
                        <td className="py-2.5 font-mono text-[11px]">{row.exp}</td>
                        <td className="py-2.5 text-right font-mono text-slate-400 text-[10px]">{row.expP}</td>
                        <td className="py-2.5 font-mono font-black text-slate-900 text-[11px]">{row.net}</td>
                        <td className="py-2.5 text-right font-mono text-emerald-600 text-[11px]">{row.margin}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50/80 font-black text-slate-900 border-t-2 border-slate-200 text-[11px]">
                      <td className="py-2.5">Total</td>
                      <td className="py-2.5 font-mono">$842,650</td>
                      <td className="py-2.5 text-right font-mono">100%</td>
                      <td className="py-2.5 font-mono">$195,440</td>
                      <td className="py-2.5 text-right font-mono">100%</td>
                      <td className="py-2.5 font-mono">$647,210</td>
                      <td className="py-2.5 text-right font-mono text-emerald-600">76.7%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Middle 4 Cols: EXPENSES BREAKDOWN (MTD) DONUT */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EXPENSES BREAKDOWN (MTD)</h3>
                <button onClick={() => triggerToast('Opening Expenses breakdown report')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                  View Report &amp;rarr;
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-indigo-600"
                      strokeWidth="4"
                      strokeDasharray="42.3, 100"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      strokeWidth="4"
                      strokeDasharray="22.0, 100"
                      strokeDashoffset="-42.3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeWidth="4"
                      strokeDasharray="12.7, 100"
                      strokeDashoffset="-64.3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-amber-500"
                      strokeWidth="4"
                      strokeDasharray="8.5, 100"
                      strokeDashoffset="-77.0"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-rose-500"
                      strokeWidth="4"
                      strokeDasharray="14.5, 100"
                      strokeDashoffset="-85.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[13px] font-black text-slate-900 tracking-tight">$256,430</span>
                    <span className="text-[9px] font-bold text-slate-400">Total</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-bold w-full">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Driver Wages</span>
                    <span className="font-mono text-slate-900 text-[11px]">$108,650 (42.3%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Fuel</span>
                    <span className="font-mono text-slate-900 text-[11px]">$56,420 (22.0%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Maintenance</span>
                    <span className="font-mono text-slate-900 text-[11px]">$32,670 (12.7%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Repairs</span>
                    <span className="font-mono text-slate-900 text-[11px]">$21,850 (8.5%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Other Expenses</span>
                    <span className="font-mono text-slate-900 text-[11px]">$36,840 (14.5%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 3 Cols: FINANCIAL REPORTS LIST */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3 mb-3">FINANCIAL REPORTS</h3>
                <div className="space-y-2 text-xs font-bold text-slate-700">
                  <div onClick={() => triggerToast('Downloading Profit & Loss Statement...')} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer transition-colors">
                    <span className="flex items-center gap-2 text-slate-900"><FileText className="w-4 h-4 text-indigo-600" /> Profit &amp; Loss Statement</span>
                    <span className="text-[10px] text-indigo-600 font-extrabold flex items-center gap-0.5">PDF <Download className="w-3 h-3" /></span>
                  </div>

                  <div onClick={() => triggerToast('Downloading Balance Sheet...')} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer transition-colors">
                    <span className="flex items-center gap-2 text-slate-900"><FileText className="w-4 h-4 text-indigo-600" /> Balance Sheet</span>
                    <span className="text-[10px] text-indigo-600 font-extrabold flex items-center gap-0.5">PDF <Download className="w-3 h-3" /></span>
                  </div>

                  <div onClick={() => triggerToast('Downloading Cash Flow Statement...')} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer transition-colors">
                    <span className="flex items-center gap-2 text-slate-900"><FileText className="w-4 h-4 text-indigo-600" /> Cash Flow Statement</span>
                    <span className="text-[10px] text-indigo-600 font-extrabold flex items-center gap-0.5">PDF <Download className="w-3 h-3" /></span>
                  </div>

                  <div onClick={() => triggerToast('Downloading Trial Balance...')} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer transition-colors">
                    <span className="flex items-center gap-2 text-slate-900"><FileText className="w-4 h-4 text-indigo-600" /> Trial Balance</span>
                    <span className="text-[10px] text-indigo-600 font-extrabold flex items-center gap-0.5">PDF <Download className="w-3 h-3" /></span>
                  </div>

                  <div onClick={() => triggerToast('Downloading General Ledger...')} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer transition-colors">
                    <span className="flex items-center gap-2 text-slate-900"><FileText className="w-4 h-4 text-indigo-600" /> General Ledger</span>
                    <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">CSV <Download className="w-3 h-3" /></span>
                  </div>
                </div>
              </div>

              <button onClick={() => triggerToast('Viewing all 14 financial reports')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold text-left mt-2 cursor-pointer">
                View all reports &rarr;
              </button>
            </div>

          </div>

          {/* DEVELOPER NOTES BOX */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider border-b border-slate-800 pb-3">
              <Code className="w-4 h-4" /> DEVELOPER NOTES &ndash; FINANCIAL REPORTS
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">1. PURPOSE</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Provide comprehensive financial performance reporting.</li>
                  <li>&bull; Help users make data-driven business decisions.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">2. KEY FEATURES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; P&amp;L summary with trend charts.</li>
                  <li>&bull; Category-wise income and expense breakdown.</li>
                  <li>&bull; Export reports to PDF/CSV.</li>
                  <li>&bull; Schedule and email reports.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">3. AUTOMATION &amp; ALERTS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Auto-calculate figures from transactions.</li>
                  <li>&bull; Alert on unusual variances.</li>
                  <li>&bull; Notify admin for negative profit or cost spikes.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">4. PERMISSIONS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Admin: Full access to all reports.</li>
                  <li>&bull; Accounts: View and export financial reports.</li>
                  <li>&bull; Read Only: View financial reports.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">5. DATA SOURCES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Invoices and payments.</li>
                  <li>&bull; Expenses and receipts.</li>
                  <li>&bull; Payroll and timesheets.</li>
                  <li>&bull; General ledger and bank feeds.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-semibold">
              <span>All times shown in your local time (AEST)</span>
              <span className="flex items-center gap-1.5 text-purple-400">&bull; Data auto-refreshes every 5 minutes <RefreshCw className="w-3 h-3 animate-spin" /></span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 9: 10.9 ACCOUNTANT EXPORT & INTEGRATION                         */}
      {/* ========================================================================= */}
      {viewMode === 'accountant' && (
        <div className="flex flex-col gap-4">
          {/* Header Container */}
          <div className="space-y-4">
            {/* Top row: Breadcrumb and Help/Notifications */}
            <div className="flex flex-row justify-between items-center gap-2 flex-wrap pb-1.5 border-b border-slate-100/60">
              {/* Left: Breadcrumbs */}
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Home</span>
                <span className="text-slate-300 mx-1">›</span>
                <span onClick={() => setViewMode('dashboard')} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">Finance</span>
                <span className="text-slate-300 mx-1">›</span>
                <span className="text-slate-900 font-extrabold">Accountant Export &amp; Integration</span>
              </div>

              {/* Right: Help, Notification, User Avatar */}
              <div className="flex items-center gap-3.5 text-xs font-bold text-slate-700">
                <button onClick={() => triggerToast('Help center opened')} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Need help?
                </button>
                <div className="relative cursor-pointer text-slate-600 hover:text-slate-800" onClick={() => triggerToast('Notifications opened')}>
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-black leading-none">11</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0" title="User Profile">
                  SM
                </div>
              </div>
            </div>

            {/* Bottom row: Title and Buttons Layout */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              {/* Left Side: Title with Check Shield Badge and Subtitle */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    10.9 Accountant Export &amp; Integration
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  Export financial data for your accountant and integrate with accounting systems.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-end gap-2 shrink-0 max-w-full">
                {/* Desktop-only: More Actions Button on top right */}
                <div className="relative max-md:hidden">
                  <button 
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {showMoreActions && (
                    <>
                      <div onClick={() => setShowMoreActions(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" />
                      <div className="fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto md:absolute md:right-0 md:top-full md:mt-2 md:w-48 bg-white border border-slate-200 rounded-2xl md:rounded-xl shadow-2xl z-50 py-2 md:py-1.5 text-xs font-bold text-slate-700">
                        <div className="px-4 py-2 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider md:hidden flex justify-between items-center">
                          <span>More Actions</span>
                          <button onClick={() => setShowMoreActions(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <button onClick={() => { setViewMode('dashboard'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📊 10.1 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 10.2 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💳 10.4 Payments &amp; Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💵 10.5 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          👥 10.6 Payroll Runs
                        </button>
                        <button onClick={() => { setViewMode('receivables'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📈 10.7 Accounts Receivable
                        </button>
                        <button onClick={() => { setViewMode('reports'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💰 10.8 Financial Reports
                        </button>
                        <button onClick={() => { setViewMode('accountant'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          🏛️ 10.9 Accountant Export
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button onClick={() => { triggerToast('Synchronized bank feed'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          <RefreshCw className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-400" /> Sync Bank Feed
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Buttons row */}
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap flex-nowrap pb-1.5 md:pb-0 scrollbar-none max-w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <button 
                    onClick={() => triggerToast('Opening Export History...')}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-slate-400" /> View Export History
                  </button>
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Invoice', status: 'Completed' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-400" /> Create Custom Export
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" /> Export All Data
                  </button>

                  {/* Mobile-only: More Actions Button inline */}
                  <div className="relative md:hidden shrink-0">
                    <button 
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      More Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 KPI Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">LAST EXPORT</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">24 May 2025</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500">10:32 AM AEST</span>
                </div>
                <button onClick={() => triggerToast('Viewing export history')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View history &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">SUCCESSFUL EXPORTS (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">28</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">▲ 16.7% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Viewing successful exports report')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View report &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">SCHEDULED EXPORTS</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">3</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500">Next: 25 May 2025</span>
                </div>
                <button onClick={() => triggerToast('Viewing schedules')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View schedules &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Cloud className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">INTEGRATIONS ACTIVE</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">2</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500">Xero, MYOB</span>
                </div>
                <button onClick={() => triggerToast('Managing integrations')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  Manage integrations &rarr;
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">EXPORT ISSUES (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">1</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">▼ 50% <span className="text-slate-400 font-normal">vs Last Month</span></span>
                </div>
                <button onClick={() => triggerToast('Viewing export issues log')} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
                  View issues &rarr;
                </button>
              </div>
            </div>

          </div>

          {/* Filter Toolbar Bar */}
          <div className="bg-white p-3 border border-slate-200/80 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={accSearchQuery}
                onChange={e => setAccSearchQuery(e.target.value)}
                placeholder="Search by export name, format, or type..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select 
                value={accSelectedType}
                onChange={e => setAccSelectedType(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option>All Export Types</option>
                <option>P&amp;L Statement</option>
                <option>Balance Sheet</option>
                <option>General Ledger</option>
                <option>Receivables</option>
                <option>Payables</option>
              </select>

              <select 
                value={accSelectedFormat}
                onChange={e => setAccSelectedFormat(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option>All Formats</option>
                <option>PDF Document</option>
                <option>CSV Spreadsheet</option>
                <option>XLSX Excel</option>
              </select>

              <select 
                value={accSelectedStatus}
                onChange={e => setAccSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option>All Status</option>
                <option>Completed</option>
                <option>Failed</option>
                <option>Processing</option>
              </select>

              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-700 font-semibold cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>01 May 2025 - 31 May 2025</span>
              </div>

              <button 
                onClick={() => triggerToast('Advanced Filters toggled')}
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl border border-slate-200 font-bold transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-500" /> Filters
              </button>

              <button 
                onClick={() => { setAccSearchQuery(''); setAccSelectedType('All Export Types'); setAccSelectedFormat('All Formats'); setAccSelectedStatus('All Status'); triggerToast('Export Data refreshed'); }}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                title="Refresh Exports"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid Layout: Left Column (8 cols), Right Column (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left 8 Cols Column */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* ACCOUNTANT EXPORTS 8 Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ACCOUNTANT EXPORTS</h3>
                    <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full">8</span>
                  </div>
                  <button onClick={() => triggerToast('Viewing all exports')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                    View All &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-bold text-slate-700">
                    <thead>
                      <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                        <th className="pb-2">Export Name</th>
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Format</th>
                        <th className="pb-2">Period</th>
                        <th className="pb-2">Created On</th>
                        <th className="pb-2">Created By</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: 'May 2025 - Profit & Loss', type: 'P&L Statement', fmt: 'PDF', period: 'May 2025', date: '24 May 2025 10:32 AM', by: 'Sarah Mitchell', status: 'Completed' },
                        { name: 'May 2025 - Balance Sheet', type: 'Balance Sheet', fmt: 'PDF', period: 'May 2025', date: '24 May 2025 10:32 AM', by: 'Sarah Mitchell', status: 'Completed' },
                        { name: 'May 2025 - General Ledger', type: 'General Ledger', fmt: 'CSV', period: 'May 2025', date: '24 May 2025 10:32 AM', by: 'Sarah Mitchell', status: 'Completed' },
                        { name: 'May 2025 - Accounts Receivable', type: 'Receivables', fmt: 'CSV', period: 'May 2025', date: '23 May 2025 04:15 PM', by: 'James Driver', status: 'Completed' },
                        { name: 'May 2025 - Accounts Payable', type: 'Payables', fmt: 'CSV', period: 'May 2025', date: '23 May 2025 04:14 PM', by: 'James Driver', status: 'Completed' },
                        { name: 'Apr - May 2025 - Bank Reconciliation', type: 'Bank Reconciliation', fmt: 'CSV', period: 'Apr - May 2025', date: '22 May 2025 09:20 AM', by: 'Sarah Mitchell', status: 'Completed' },
                        { name: 'May 2025 - Tax Summary', type: 'Tax Summary', fmt: 'PDF', period: 'May 2025', date: '20 May 2025 11:05 AM', by: 'Sarah Mitchell', status: 'Failed' },
                        { name: 'May 2025 - Cash Flow', type: 'Cash Flow', fmt: 'PDF', period: 'May 2025', date: '19 May 2025 03:40 PM', by: 'James Driver', status: 'Completed' },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 text-slate-900 font-extrabold text-[11px]">{row.name}</td>
                          <td className="py-2.5 text-slate-600 text-[10px]">{row.type}</td>
                          <td className="py-2.5">
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-xs ${row.fmt === 'PDF' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                              {row.fmt}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-500 text-[10px]">{row.period}</td>
                          <td className="py-2.5 text-slate-500 text-[10px] whitespace-nowrap">{row.date}</td>
                          <td className="py-2.5 text-slate-700 text-[10px]">{row.by}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5 text-slate-400">
                              <button onClick={() => triggerToast(`Downloading ${row.name}...`)} className="hover:text-indigo-600 p-1">
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => triggerToast(`More actions for ${row.name}`)} className="hover:text-slate-700 p-1">
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[10px] text-slate-400 font-bold">
                  <span>Showing 1 to 8 of 8 exports</span>
                </div>
              </div>

              {/* Bottom 2 sub-cards side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* EXPORT TYPES 8 */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EXPORT TYPES</h3>
                      <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-1.5 py-0.5 rounded-full">8</span>
                    </div>
                    <button onClick={() => triggerToast('Viewing all export types')} className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold flex items-center gap-0.5 cursor-pointer">
                      View All &rarr;
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs font-bold text-slate-700">
                    {[
                      { name: 'P&L Statement', desc: 'Detailed profit and loss statement', count: '12' },
                      { name: 'Balance Sheet', desc: 'Company balance sheet', count: '12' },
                      { name: 'General Ledger', desc: 'Complete general ledger export', count: '24' },
                      { name: 'Accounts Receivable', desc: 'Customer receivables aging', count: '12' },
                      { name: 'Accounts Payable', desc: 'Supplier payables aging', count: '12' },
                      { name: 'Bank Reconciliation', desc: 'Bank transactions and reconciliation', count: '8' },
                      { name: 'Tax Summary', desc: 'GST/BAS and tax summary', count: '6' },
                      { name: 'Cash Flow Statement', desc: 'Cash flow statement', count: '6' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-2 hover:bg-slate-50 rounded-xl flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <div>
                            <span className="text-slate-900 block text-[11px] leading-tight">{item.name}</span>
                            <span className="text-[9px] text-slate-400 font-normal">{item.desc}</span>
                          </div>
                        </div>
                        <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded-full">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RECENT EXPORT ACTIVITY */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RECENT EXPORT ACTIVITY</h3>
                    <button onClick={() => triggerToast('Viewing activity log')} className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold flex items-center gap-0.5 cursor-pointer">
                      View All &rarr;
                    </button>
                  </div>

                  <div className="space-y-2 text-xs font-bold text-slate-700">
                    {[
                      { text: 'May 2025 - Profit & Loss exported successfully', time: '24 May 2025 10:32 AM', success: true },
                      { text: 'May 2025 - Balance Sheet exported successfully', time: '24 May 2025 10:32 AM', success: true },
                      { text: 'May 2025 - General Ledger exported successfully', time: '24 May 2025 10:32 AM', success: true },
                      { text: 'May 2025 - Accounts Receivable exported successfully', time: '23 May 2025 04:15 PM', success: true },
                      { text: 'May 2025 - Accounts Payable exported successfully', time: '23 May 2025 04:14 PM', success: true },
                      { text: 'May 2025 - Tax Summary export failed', time: '20 May 2025 11:05 AM', success: false },
                      { text: 'May 2025 - Cash Flow exported successfully', time: '19 May 2025 03:40 PM', success: true },
                      { text: 'Apr - May 2025 - Bank Reconciliation exported successfully', time: '22 May 2025 09:20 AM', success: true },
                    ].map((act, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[10px]">
                        {act.success ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-slate-800 font-extrabold block leading-tight truncate">{act.text}</span>
                          <span className="text-[8px] text-slate-400 font-normal">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Right 4 Cols Column */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* INTEGRATION STATUS */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">INTEGRATION STATUS</h3>
                  <button onClick={() => triggerToast('Viewing all integrations')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                    View All &rarr;
                  </button>
                </div>

                {/* Xero Card */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-cyan-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        xero
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block">Xero</span>
                        <span className="text-[9px] text-slate-400">Organisation: Hero Logistics Pty Ltd</span>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full">Connected</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[9px]">
                    <span className="text-slate-400">Last Sync: 24 May 2025 10:15 AM</span>
                    <button onClick={() => triggerToast('Syncing with Xero...')} className="text-indigo-600 font-extrabold hover:underline">Sync Now &rarr;</button>
                  </div>
                </div>

                {/* MYOB Card */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-[9px] flex items-center justify-center shadow-xs">
                        myob
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block">MYOB AccountRight</span>
                        <span className="text-[9px] text-slate-400">File: Hero Logistics Data File</span>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full">Connected</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[9px]">
                    <span className="text-slate-400">Last Sync: 23 May 2025 04:45 PM</span>
                    <button onClick={() => triggerToast('Syncing with MYOB...')} className="text-indigo-600 font-extrabold hover:underline">Sync Now &rarr;</button>
                  </div>
                </div>
              </div>

              {/* EXPORT SCHEDULES 3 */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EXPORT SCHEDULES</h3>
                    <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-1.5 py-0.5 rounded-full">3</span>
                  </div>
                  <button onClick={() => triggerToast('Viewing all schedules')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                    View All &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-bold text-slate-700">
                    <thead>
                      <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                        <th className="pb-2">Schedule Name</th>
                        <th className="pb-2">Frequency</th>
                        <th className="pb-2">Next Run</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: 'Monthly Financial Reports', freq: 'Monthly', next: '25 May 2025', status: 'Active' },
                        { name: 'Weekly AR & AP Export', freq: 'Weekly', next: '26 May 2025', status: 'Active' },
                        { name: 'Daily Bank Transactions', freq: 'Daily', next: '25 May 2025', status: 'Active' },
                      ].map((sch, idx) => (
                        <tr key={idx}>
                          <td className="py-2 text-slate-900 font-extrabold text-[10px]">{sch.name}</td>
                          <td className="py-2 text-slate-500 text-[9px]">{sch.freq}</td>
                          <td className="py-2 text-slate-500 text-[9px]">{sch.next}</td>
                          <td className="py-2 text-right">
                            <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">
                              {sch.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SUPPORTED EXPORTS */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SUPPORTED EXPORTS</h3>
                  <button onClick={() => triggerToast('Viewing all supported exports')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                    View All &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {[
                    { title: 'Profit & Loss', fmt: 'PDF' },
                    { title: 'Balance Sheet', fmt: 'PDF' },
                    { title: 'General Ledger', fmt: 'CSV / XLSX' },
                    { title: 'Trial Balance', fmt: 'CSV / XLSX' },
                    { title: 'Accounts Receivable', fmt: 'CSV / XLSX' },
                    { title: 'Accounts Payable', fmt: 'CSV / XLSX' },
                    { title: 'Bank Reconciliation', fmt: 'CSV / OFX' },
                    { title: 'Tax Summary', fmt: 'PDF' },
                  ].map((tile, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => triggerToast(`Downloading ${tile.title} (${tile.fmt})...`)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition-colors flex flex-col justify-between"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600 mb-1" />
                      <span className="text-[10px] font-extrabold text-slate-900 leading-tight block">{tile.title}</span>
                      <span className="text-[8px] text-slate-400 block mt-0.5">{tile.fmt}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* DEVELOPER NOTES BOX */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider border-b border-slate-800 pb-3">
              <Code className="w-4 h-4" /> DEVELOPER NOTES &ndash; ACCOUNTANT EXPORT &amp; INTEGRATION
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">1. PURPOSE</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Enable exports for accountants.</li>
                  <li>&bull; Simplify financial reporting and compliance.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">2. KEY FEATURES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Multiple export types and formats.</li>
                  <li>&bull; Scheduled and on-demand exports.</li>
                  <li>&bull; Integration with Xero, MYOB and more.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">3. AUTOMATION &amp; ALERTS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Auto-schedule recurring exports.</li>
                  <li>&bull; Notify on success or failure.</li>
                  <li>&bull; Secure file generation and delivery.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">4. PERMISSIONS</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Admin: Full access to exports and integrations.</li>
                  <li>&bull; Accounts: Create and manage exports.</li>
                  <li>&bull; Read Only: View export history.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider text-purple-400">5. DATA SOURCES</h5>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Invoices, payments, expenses.</li>
                  <li>&bull; Payroll, timesheets, receivables, payables.</li>
                  <li>&bull; Bank transactions and general ledger.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-semibold">
              <span>All times shown in your local time (AEST)</span>
              <span className="flex items-center gap-1.5 text-purple-400">&bull; Data auto-refreshes every 5 minutes <RefreshCw className="w-3 h-3 animate-spin" /></span>
            </div>
          </div>
        </div>
      )}

      {/* Create / Add Record Modal */}
      {showAddTransactionModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddTransactionModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
        >
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-left my-auto border border-slate-200">
            <div className="px-6 py-5 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-base font-black flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Record New Entry / Transaction
              </h3>
              <button onClick={() => setShowAddTransactionModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setShowAddTransactionModal(false);
                triggerToast('New financial record saved successfully!');
              }} 
              className="p-6 space-y-4 text-xs font-bold text-slate-700"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Entry Type</label>
                  <select 
                    value={transactionForm.type || 'Invoice'}
                    onChange={e => setTransactionForm({...transactionForm, type: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Invoice">Invoice</option>
                    <option value="Payment">Payment Received</option>
                    <option value="Receipt">Receipt Issued</option>
                    <option value="Expense">Expense Claim</option>
                    <option value="Payroll">Payroll Run</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Amount ($ AUD)</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={transactionForm.amount || ''}
                    onChange={e => setTransactionForm({...transactionForm, amount: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Customer / Entity Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Metro Group Sydney / Driver Name"
                  value={transactionForm.customer || ''}
                  onChange={e => setTransactionForm({...transactionForm, customer: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Payment Method</label>
                  <select 
                    value={transactionForm.method || 'Bank Transfer'}
                    onChange={e => setTransactionForm({...transactionForm, method: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Bank Transfer">Bank Transfer (EFT)</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Direct Debit">Direct Debit</option>
                    <option value="Cash">Cash / Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={transactionForm.status || 'Completed'}
                    onChange={e => setTransactionForm({...transactionForm, status: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Completed">Completed / Paid</option>
                    <option value="Pending">Pending Approval</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddTransactionModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {showExportModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowExportModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
        >
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-left my-auto border border-slate-200">
            <div className="px-6 py-5 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-base font-black flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" /> Export Invoices Report
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-bold text-slate-700">
              <p className="text-slate-500 font-medium">Select file format to download the complete Invoices List for Sydney Head Office:</p>

              <div className="space-y-2">
                <button 
                  onClick={() => { setShowExportModal(false); triggerToast('Invoices downloaded as CSV Excel format!'); }}
                  className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <span>📊 Export as CSV / Excel (.csv)</span>
                  <span className="text-slate-400 text-[10px] uppercase">Spreadsheet</span>
                </button>
                <button 
                  onClick={() => { setShowExportModal(false); triggerToast('Official PDF Invoices Audit Document generated!'); }}
                  className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <span>📄 Export as PDF Document (.pdf)</span>
                  <span className="text-slate-400 text-[10px] uppercase">PDF Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
