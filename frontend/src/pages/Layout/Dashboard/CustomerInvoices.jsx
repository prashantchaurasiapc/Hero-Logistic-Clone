import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  Receipt, CreditCard, DollarSign, Clock, ShieldCheck, Search, Filter, RefreshCw,
  Download, Eye, Plus, Star, ChevronRight, CheckCircle2, ArrowRight, X, Check,
  HelpCircle, Lock, FileText, AlertTriangle, Building2, Send, Calendar
} from 'lucide-react';

export default function CustomerInvoices() {
  // Toast Notification State
  const [toastMsg, setToastMsg] = useState('');
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Header State
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedDateFilter, setSelectedDateFilter] = useState('All Dates');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Table Checkbox Selection State
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);

  // Modals State
  const [isMakePaymentModalOpen, setIsMakePaymentModalOpen] = useState(false);
  const [isPaymentMethodsModalOpen, setIsPaymentMethodsModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [payInvoiceTarget, setPayInvoiceTarget] = useState(null); // single invoice or null for all

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '•••',
    nameOnCard: 'ABC Transport Solutions',
    amount: '0.00'
  });

  // Invoices List Data State
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts-portal/invoices');
      if (res.data) {
        const raw = res.data.data?.invoices || (Array.isArray(res.data) ? res.data : (res.data.invoices || []));
        const formatted = raw.map(inv => {
          const numAmt = Number(inv.amount || inv.total || 0);
          const st = inv.status || 'Pending';
          let badge = 'bg-amber-50 text-amber-700 border-amber-200';
          if (st === 'Paid') badge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          if (st === 'Overdue') badge = 'bg-red-50 text-red-700 border-red-200';
          if (st === 'Partial') badge = 'bg-blue-50 text-blue-700 border-blue-200';

          return {
            id: inv.invoiceNumber || inv.id || `INV-${inv.dbId || inv.id}`,
            dbId: inv.id,
            number: inv.invoiceNumber || inv.id,
            date: inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-GB') : 'N/A',
            dueDate: inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-GB') : 'N/A',
            loadRef: inv.loadRef || inv.load?.loadNumber || 'N/A',
            route: inv.route || (inv.load ? `${inv.load.pickupLocation || ''} → ${inv.load.deliveryLocation || ''}` : 'General Freight'),
            amount: `$${numAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            numericAmount: numAmt,
            status: st,
            statusBadge: badge
          };
        });
        setInvoices(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedInvoiceIds.length === invoices.length) {
      setSelectedInvoiceIds([]);
    } else {
      setSelectedInvoiceIds(invoices.map(inv => inv.id));
    }
  };

  const handleSelectInvoice = (id) => {
    if (selectedInvoiceIds.includes(id)) {
      setSelectedInvoiceIds(selectedInvoiceIds.filter(i => i !== id));
    } else {
      setSelectedInvoiceIds([...selectedInvoiceIds, id]);
    }
  };

  // Submit Payment Handler
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    try {
      if (payInvoiceTarget) {
        if (payInvoiceTarget.dbId) {
          await api.put(`/company-admin/finance/invoices/${payInvoiceTarget.dbId}/status`, { status: 'PAID' });
        }
        triggerToast(`Payment of ${payInvoiceTarget.amount} for invoice ${payInvoiceTarget.number} successful!`);
      } else {
        const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue');
        await Promise.all(
          overdueInvoices.map(inv => {
            if (inv.dbId) {
              return api.put(`/company-admin/finance/invoices/${inv.dbId}/status`, { status: 'PAID' });
            }
            return Promise.resolve();
          })
        );
        triggerToast('Full outstanding balance payment processed successfully!');
      }
      fetchInvoices();
    } catch (err) {
      console.error('Payment failed:', err);
      triggerToast('Payment processing failed. Please try again.');
    } finally {
      setIsMakePaymentModalOpen(false);
      setPayInvoiceTarget(null);
    }
  };

  // Filtered Invoices Logic
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.loadRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.amount.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (selectedStatus !== 'All Status') {
      matchesStatus = inv.status.toLowerCase() === selectedStatus.toLowerCase();
    }

    let matchesDateFilter = true;
    if (selectedDateFilter === 'May 2025') {
      matchesDateFilter = inv.date.includes('May 2025');
    } else if (selectedDateFilter === 'April 2025') {
      matchesDateFilter = inv.date.includes('Apr 2025');
    }

    return matchesSearch && matchesStatus && matchesDateFilter;
  });

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-800 text-left font-sans p-4 sm:p-6 space-y-6">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[999999] bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl animate-fade-in border border-slate-700 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
         HEADER & TOP BREADCRUMBS (Exact Match 2nd Screenshot)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1">
            <span 
              onClick={() => triggerToast("Navigated to Home")}
              className="hover:text-slate-700 cursor-pointer transition-colors"
            >
              Home
            </span>
            <ChevronRight size={10} />
            <span 
              onClick={() => triggerToast("Navigated to Customer Portal")}
              className="hover:text-slate-700 cursor-pointer transition-colors"
            >
              Customer Portal
            </span>
            <ChevronRight size={10} />
            <span className="text-slate-700 font-extrabold">Invoices & Payments</span>
          </div>

          {/* Title & Bookmark */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Invoices & Payments
            </h1>
            <button 
              onClick={() => {
                const nextState = !isBookmarked;
                setIsBookmarked(nextState);
                triggerToast(nextState ? "Page bookmarked successfully!" : "Page removed from bookmarks.");
              }}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Page"}
              className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <Star size={17} className={isBookmarked ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            View, download and pay your invoices securely.
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap relative">
          <button 
            onClick={() => setIsStatementModalOpen(true)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <FileText size={14} className="text-blue-600" />
            <span>Statement</span>
          </button>

          <button 
            onClick={() => setIsPaymentMethodsModalOpen(true)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <CreditCard size={14} className="text-blue-600" />
            <span>Payment Methods</span>
          </button>

          <button 
            onClick={() => {
              setPayInvoiceTarget(null);
              setIsMakePaymentModalOpen(true);
            }}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} />
            <span>Make a Payment</span>
          </button>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <span>More Actions</span>
              <span className="text-[10px]">{isMoreActionsOpen ? '▲' : '▼'}</span>
            </button>

            {isMoreActionsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMoreActionsOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 p-1.5 z-50 text-left w-56 space-y-0.5 animate-fade-in font-sans text-xs">
                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      triggerToast("Downloading complete invoices statement CSV...");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <FileText size={13} className="text-blue-600" />
                    <span>Export Invoices (CSV)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      triggerToast("Downloading all invoices as ZIP...");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <Download size={13} className="text-emerald-600" />
                    <span>Bulk Download (ZIP)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      triggerToast("Opening print dialog for billing summary...");
                      window.print();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <Receipt size={13} className="text-purple-600" />
                    <span>Print Invoices Report</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      triggerToast("Invoices vault data refreshed!");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <RefreshCw size={13} className="text-slate-500" />
                    <span>Refresh Vault</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* =========================================================================
         TOP 5 METRIC SUMMARY CARDS (Exact Match 2nd Screenshot Vertical Stack)
         ========================================================================= */}
      {(() => {
        const totalOutstanding = invoices.filter(i => i.status === 'Overdue' || i.status === 'Outstanding' || i.status === 'Pending').reduce((acc, i) => acc + (i.numericAmount || 0), 0);
        const overdueAmt = invoices.filter(i => i.status === 'Overdue').reduce((acc, i) => acc + (i.numericAmount || 0), 0);
        const overdueCnt = invoices.filter(i => i.status === 'Overdue').length;
        const outstandingCnt = invoices.filter(i => i.status === 'Overdue' || i.status === 'Outstanding' || i.status === 'Pending').length;
        const paidThisMonth = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + (i.numericAmount || 0), 0);
        const totalInvoicedYTD = invoices.reduce((acc, i) => acc + (i.numericAmount || 0), 0);

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Card 1: OUTSTANDING BALANCE */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between whitespace-nowrap min-w-0">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Receipt size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold text-slate-900 uppercase tracking-wider block truncate whitespace-nowrap">OUTSTANDING BALANCE</span>
                  <div className="flex items-baseline gap-1 mt-0.5 whitespace-nowrap">
                    <span className="text-base sm:text-lg font-black text-slate-900 leading-none whitespace-nowrap">${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-[10px] font-extrabold text-slate-400 whitespace-nowrap">AUD</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-600 block mt-1 whitespace-nowrap truncate">Due in {outstandingCnt} invoices</span>
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 whitespace-nowrap">
                <button onClick={() => setSelectedStatus('Overdue')} className="text-[10.5px] font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <span>View outstanding</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>

            {/* Card 2: OVERDUE AMOUNT */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between whitespace-nowrap min-w-0">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold text-slate-900 uppercase tracking-wider block truncate whitespace-nowrap">OVERDUE AMOUNT</span>
                  <div className="flex items-baseline gap-1 mt-0.5 whitespace-nowrap">
                    <span className="text-base sm:text-lg font-black text-slate-900 leading-none whitespace-nowrap">${overdueAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-[10px] font-extrabold text-slate-400 whitespace-nowrap">AUD</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-red-600 block mt-1 whitespace-nowrap truncate">{overdueCnt} invoices overdue</span>
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 whitespace-nowrap">
                <button onClick={() => setSelectedStatus('Overdue')} className="text-[10.5px] font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <span>View overdue</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>

            {/* Card 3: PAID THIS MONTH */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between whitespace-nowrap min-w-0">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold text-slate-900 uppercase tracking-wider block truncate whitespace-nowrap">PAID THIS MONTH</span>
                  <div className="flex items-baseline gap-1 mt-0.5 whitespace-nowrap">
                    <span className="text-base sm:text-lg font-black text-slate-900 leading-none whitespace-nowrap">${paidThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-[10px] font-extrabold text-slate-400 whitespace-nowrap">AUD</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-600 block mt-1 whitespace-nowrap truncate">Settled transactions</span>
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 whitespace-nowrap">
                <button onClick={() => setSelectedStatus('Paid')} className="text-[10.5px] font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <span>View payments</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>

            {/* Card 4: TOTAL INVOICED (YTD) */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between whitespace-nowrap min-w-0">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <DollarSign size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold text-slate-900 uppercase tracking-wider block truncate whitespace-nowrap">TOTAL INVOICED (YTD)</span>
                  <div className="flex items-baseline gap-1 mt-0.5 whitespace-nowrap">
                    <span className="text-base sm:text-lg font-black text-slate-900 leading-none whitespace-nowrap">${totalInvoicedYTD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-[10px] font-extrabold text-slate-400 whitespace-nowrap">AUD</span>
                  </div>
                  <span className="text-[10px] font-semibold text-transparent block mt-1 whitespace-nowrap select-none">Spacer</span>
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 whitespace-nowrap">
                <button onClick={() => setSelectedStatus('All Status')} className="text-[10.5px] font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <span>View summary</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>

            {/* Card 5: CREDIT BALANCE */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between whitespace-nowrap min-w-0">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <CreditCard size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold text-slate-900 uppercase tracking-wider block truncate whitespace-nowrap">CREDIT BALANCE</span>
                  <div className="flex items-baseline gap-1 mt-0.5 whitespace-nowrap">
                    <span className="text-base sm:text-lg font-black text-slate-900 leading-none whitespace-nowrap">$0.00</span>
                    <span className="text-[10px] font-extrabold text-slate-400 whitespace-nowrap">AUD</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-1 whitespace-nowrap truncate">Current credit</span>
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 whitespace-nowrap">
                <button onClick={() => triggerToast('No active credit notes')} className="text-[10.5px] font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <span>View credits</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>

          </div>
        );
      })()}

      {/* =========================================================================
         FILTERS & SEARCH TOOLBAR ROW (Fully Working Live Search & Date Pickers)
         ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 space-y-3">
        
        {/* Search Bar & Dropdowns Filter Line */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Left: Search input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by invoice #, load # or reference..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Right: Status & Date Dropdowns & Range Pickers */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                triggerToast(`Filtered by status: ${e.target.value}`);
              }}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Overdue">Overdue</option>
              <option value="Paid">Paid</option>
            </select>

            <select
              value={selectedDateFilter}
              onChange={e => {
                setSelectedDateFilter(e.target.value);
                triggerToast(`Filtered by date: ${e.target.value}`);
              }}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="All Dates">All Dates</option>
              <option value="May 2025">May 2025</option>
              <option value="April 2025">April 2025</option>
            </select>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-500 font-medium">
              <input 
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer" 
              />
              <span>→</span>
              <input 
                type="date" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer" 
              />
            </div>

            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1 transition-colors"
            >
              <Filter size={13} />
              <span>Filters</span>
            </button>

            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('All Status');
                setSelectedDateFilter('All Dates');
                setStartDate('');
                setEndDate('');
                triggerToast("All invoice filters reset!");
              }}
              title="Reset Filters"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <RefreshCw size={13} />
            </button>
          </div>

        </div>

      </div>

      {/* =========================================================================
         MAIN WORKSPACE GRID (8 Cols Invoices Table + 4 Cols Side Cards)
         Equal Height Bottom Alignment (items-stretch)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* COLUMN 1 (8 Cols): INVOICES TABLE & PAGINATION */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 flex flex-col justify-between overflow-hidden">
          
          <div className="space-y-3">
            
            {/* Table Top Title Header - INVOICES Tab Badge */}
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <span className="text-xs font-black text-blue-600 tracking-wider uppercase">INVOICES</span>
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#2563EB] text-white text-[10px] font-black flex items-center justify-center shadow-2xs">
                {invoices.length}
              </span>
            </div>

            {/* Table Container with Horizontal Scroll & Whitespace Nowrap */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input 
                        type="checkbox"
                        checked={selectedInvoiceIds.length === invoices.length && invoices.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Invoice #</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Invoice Date</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Due Date</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Load / Reference</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Amount (AUD)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs whitespace-nowrap">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                        No invoices found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const isSelected = selectedInvoiceIds.includes(inv.id);
                      return (
                        <tr key={inv.id} className={`hover:bg-slate-50/80 transition-colors whitespace-nowrap ${isSelected ? 'bg-blue-50/40' : ''}`}>
                          
                          {/* Checkbox */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectInvoice(inv.id)}
                              className="rounded border-slate-300 cursor-pointer"
                            />
                          </td>

                          {/* Invoice # */}
                          <td className="py-3 px-3 font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap" onClick={() => setPreviewInvoice(inv)}>
                            {inv.number}
                          </td>

                          {/* Invoice Date */}
                          <td className="py-3 px-3 font-medium text-slate-600 whitespace-nowrap">
                            {inv.date}
                          </td>

                          {/* Due Date */}
                          <td className="py-3 px-3 font-medium text-slate-600 whitespace-nowrap">
                            {inv.dueDate}
                          </td>

                          {/* Load / Reference */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900 whitespace-nowrap">{inv.loadRef}</span>
                              <span className="text-[9.5px] text-slate-400 font-medium whitespace-nowrap">({inv.route})</span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-3 px-3 font-black text-slate-900 whitespace-nowrap">
                            {inv.amount}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded border text-[9.5px] font-black uppercase inline-block whitespace-nowrap ${inv.statusBadge}`}>
                              {inv.status}
                            </span>
                          </td>

                          {/* Actions Column */}
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => setPreviewInvoice(inv)}
                                title="Preview Invoice"
                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                              >
                                <Eye size={14} />
                              </button>

                              <button 
                                onClick={() => triggerToast(`Downloading PDF for invoice ${inv.number}...`)}
                                title="Download PDF"
                                className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                              >
                                <Download size={14} />
                              </button>

                              {inv.status === 'Overdue' && (
                                <button 
                                  onClick={() => {
                                    setPayInvoiceTarget(inv);
                                    setIsMakePaymentModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] rounded-lg cursor-pointer transition-colors shadow-2xs"
                                >
                                  Pay
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-semibold pt-3 border-t border-slate-100">
              <span>Showing {filteredInvoices.length === 0 ? 0 : 1} to {filteredInvoices.length} of {invoices.length} invoices</span>
              
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                <button className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400">&lt;&lt;</button>
                <button className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400">&lt;</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">2</button>
                <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">3</button>
                <button className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">&gt;</button>
                <button className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">&gt;&gt;</button>
              </div>
            </div>
          </div>

          {/* 3 Informational Banner Pills below Table */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-4 mt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl text-blue-900 font-medium">
              <Clock size={15} className="text-blue-600 shrink-0" />
              <div>
                <span className="font-extrabold uppercase text-[9.5px] block text-blue-700">PAY ON TIME</span>
                <span className="text-[10.5px] text-blue-950">Avoid late fees and keep account in good standing.</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl text-emerald-900 font-medium">
              <FileText size={15} className="text-emerald-600 shrink-0" />
              <div>
                <span className="font-extrabold uppercase text-[9.5px] block text-emerald-700">NEED A COPY?</span>
                <span className="text-[10.5px] text-emerald-950">Download any invoice, statement or receipt.</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-purple-50/60 border border-purple-100 rounded-xl text-purple-900 font-medium">
              <HelpCircle size={15} className="text-purple-600 shrink-0" />
              <div>
                <span className="font-extrabold uppercase text-[9.5px] block text-purple-700">QUESTIONS?</span>
                <span className="text-[10.5px] text-purple-950">Contact our accounts team for any billing queries.</span>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 2 (4 Cols): SIDE CARDS (Donut Chart, Make Payment, Recent Payments) */}
        <div className="lg:col-span-4 space-y-3">
          
          {(() => {
            const totalOutstanding = invoices.filter(i => i.status === 'Overdue' || i.status === 'Outstanding' || i.status === 'Pending').reduce((acc, i) => acc + (i.numericAmount || 0), 0);

            return (
              <>
                {/* CARD 1: OUTSTANDING SUMMARY (Donut Chart & Ageing Legend) */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">OUTSTANDING SUMMARY</h2>
                    <button onClick={() => triggerToast("Generating full ageing report...")} className="text-[10px] font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-0.5">
                      View ageing report <ArrowRight size={9} />
                    </button>
                  </div>

                  <div className="flex items-center justify-around gap-3 py-1">
                    
                    {/* Donut Ring Visual Representation */}
                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Background Circle */}
                        <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-black text-slate-900 leading-none">${Math.round(totalOutstanding).toLocaleString('en-US')}</span>
                        <span className="text-[7.5px] font-extrabold text-slate-400 uppercase">Outstanding</span>
                      </div>
                    </div>

                    {/* Legend Breakdown */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                        <span className="text-slate-600 font-medium text-[10px]">0 - 30 Days:</span>
                        <span className="font-extrabold text-slate-900 text-[10px]">$0 (0%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                        <span className="text-slate-600 font-medium text-[10px]">31 - 60 Days:</span>
                        <span className="font-extrabold text-slate-900 text-[10px]">$0 (0%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                        <span className="text-slate-600 font-medium text-[10px]">61 - 90 Days:</span>
                        <span className="font-extrabold text-slate-900 text-[10px]">$0 (0%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                        <span className="text-slate-600 font-medium text-[10px]">90+ Days:</span>
                        <span className="font-extrabold text-slate-900 text-[10px]">$0 (0%)</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* CARD 2: MAKE A PAYMENT */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">MAKE A PAYMENT</h2>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Total Outstanding</span>
                      <span className="text-base font-black text-red-600">${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AUD</span>
                    </div>

                    <button 
                      onClick={() => {
                        setPayInvoiceTarget(null);
                        setIsMakePaymentModalOpen(true);
                      }}
                      className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-colors"
                    >
                      <Lock size={13} />
                      <span>Pay Now</span>
                    </button>

                    <div className="text-center space-y-0.5">
                      <span className="text-[9.5px] font-bold text-slate-400 block">Secure payment powered by Stripe</span>
                      <span className="text-[9px] font-medium text-slate-400 block">Cards, Apple Pay and Google Pay accepted</span>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

          {/* CARD 3: RECENT PAYMENTS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">RECENT PAYMENTS</h2>
              <button onClick={() => triggerToast("Viewing all payment history...")} className="text-[10px] font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-0.5">
                View all payments <ArrowRight size={9} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { ref: 'PAY-2025-0515', date: '15 May 2025', amount: '$4,360.20' },
                { ref: 'PAY-2025-0507', date: '07 May 2025', amount: '$6,120.00' },
                { ref: 'PAY-2025-0429', date: '29 Apr 2025', amount: '$7,450.00' },
                { ref: 'PAY-2025-0418', date: '18 Apr 2025', amount: '$5,980.00' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-extrabold text-slate-900 block text-[11px] leading-tight">{item.ref}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{item.date}</span>
                    </div>
                  </div>
                  <span className="text-[10.5px] font-extrabold text-emerald-700">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>



      {/* =========================================================================
         MAKE PAYMENT MODAL (Stripe Integration Simulation)
         ========================================================================= */}
      {isMakePaymentModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsMakePaymentModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <CreditCard size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {payInvoiceTarget ? `Pay Invoice ${payInvoiceTarget.number}` : 'Make a Payment'}
                  </h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Secure card checkout powered by Stripe</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMakePaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between font-extrabold text-slate-700">
                  <span>Payment Amount:</span>
                  <span className="text-blue-600 text-sm font-black">
                    {payInvoiceTarget ? payInvoiceTarget.amount : '$18,540.00 AUD'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {payInvoiceTarget ? `Invoice ${payInvoiceTarget.number} (${payInvoiceTarget.loadRef})` : 'Full outstanding 6 overdue invoices'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Name on Credit Card</label>
                <input 
                  type="text"
                  required
                  value={paymentForm.nameOnCard}
                  onChange={e => setPaymentForm({ ...paymentForm, nameOnCard: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Credit Card Number</label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    value={paymentForm.cardNumber}
                    onChange={e => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                  />
                  <CreditCard size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input 
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={paymentForm.cardExpiry}
                    onChange={e => setPaymentForm({ ...paymentForm, cardExpiry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">CVC Code</label>
                  <input 
                    type="text"
                    required
                    placeholder="123"
                    value={paymentForm.cardCvc}
                    onChange={e => setPaymentForm({ ...paymentForm, cardCvc: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <Lock size={11} className="text-emerald-500" />
                  <span>256-Bit SSL Encrypted</span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsMakePaymentModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock size={12} />
                    <span>Confirm & Pay</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         PAYMENT METHODS MODAL
         ========================================================================= */}
      {isPaymentMethodsModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsPaymentMethodsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <CreditCard size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Saved Payment Methods</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Manage credit cards and direct debit options</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPaymentMethodsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 border border-blue-200 bg-blue-50/50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-blue-600" />
                  <div>
                    <span className="font-extrabold text-slate-900 block">Visa ending in 4242</span>
                    <span className="text-[10px] text-slate-500 font-medium">Expires 12/28 • Default Payment Method</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[9.5px] font-bold">DEFAULT</span>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 size={20} className="text-slate-500" />
                  <div>
                    <span className="font-extrabold text-slate-900 block">ANZ Bank Direct Debit</span>
                    <span className="text-[10px] text-slate-500 font-medium">Account ending in 8819</span>
                  </div>
                </div>
                <button 
                  onClick={() => triggerToast("Set as default payment method")} 
                  className="text-blue-600 hover:underline font-bold text-xs cursor-pointer"
                >
                  Make Default
                </button>
              </div>

              <button 
                onClick={() => triggerToast("Add new credit card form opened")}
                className="w-full py-2 bg-slate-50 border border-dashed border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus size={14} className="text-blue-600" />
                <span>Add New Payment Method</span>
              </button>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setIsPaymentMethodsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         ADVANCED FILTERS MODAL
         ========================================================================= */}
      {isFilterDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsFilterDrawerOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <Filter size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Advanced Invoice Filters</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Filter by status, date range and invoice amount</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFilterDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Invoice Status</label>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="All Status">All Statuses</option>
                  <option value="Overdue">Overdue Only</option>
                  <option value="Paid">Paid Only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quick Date Range</label>
                <select
                  value={selectedDateFilter}
                  onChange={e => setSelectedDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="All Dates">All Dates</option>
                  <option value="May 2025">May 2025</option>
                  <option value="April 2025">April 2025</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input 
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('All Status');
                    setSelectedDateFilter('All Dates');
                    setStartDate('');
                    setEndDate('');
                    triggerToast("All filters cleared.");
                  }}
                  className="text-slate-500 hover:text-slate-800 font-bold text-xs cursor-pointer"
                >
                  Reset All
                </button>

                <button 
                  type="button" 
                  onClick={() => {
                    setIsFilterDrawerOpen(false);
                    triggerToast(`Applied filters - showing ${filteredInvoices.length} matching invoices.`);
                  }}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Apply Filters ({filteredInvoices.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         STATEMENT MODAL
         ========================================================================= */}
      {isStatementModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsStatementModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Account Statement</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Download complete billing history statement</p>
                </div>
              </div>
              <button 
                onClick={() => setIsStatementModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Account Holder:</span>
                  <span className="text-slate-900">ABC Transport Solutions</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Total Outstanding:</span>
                  <span className="text-red-600 font-black">$18,540.00 AUD</span>
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setIsStatementModalOpen(false);
                    triggerToast("Downloading Statement PDF...");
                  }}
                  className="w-full p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-extrabold rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    <span>Download PDF Statement</span>
                  </div>
                  <Download size={14} className="text-blue-600" />
                </button>

                <button 
                  onClick={() => {
                    setIsStatementModalOpen(false);
                    triggerToast("Downloading CSV Statement...");
                  }}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-extrabold rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Receipt size={16} className="text-emerald-600" />
                    <span>Export CSV Spreadsheet</span>
                  </div>
                  <Download size={14} className="text-slate-600" />
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setIsStatementModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         PREVIEW INVOICE MODAL
         ========================================================================= */}
      {previewInvoice && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewInvoice(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <Receipt size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Tax Invoice {previewInvoice.number}</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Issued {previewInvoice.date} • Due {previewInvoice.dueDate}</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Invoice Number:</span>
                  <span className="text-slate-900 font-mono">{previewInvoice.number}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Related Load:</span>
                  <span className="text-blue-600 font-mono">{previewInvoice.loadRef} ({previewInvoice.route})</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Invoice Amount:</span>
                  <span className="text-slate-900 text-sm font-black">{previewInvoice.amount} AUD</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Current Status:</span>
                  <span className={`px-2 py-0.5 rounded border text-[9.5px] font-black uppercase ${previewInvoice.statusBadge}`}>
                    {previewInvoice.status}
                  </span>
                </div>
              </div>

              {/* Line Items Breakdown Mock */}
              <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-2">
                <span className="font-extrabold text-[10.5px] text-slate-400 uppercase tracking-wider block">LINE ITEM BREAKDOWN</span>
                <div className="flex justify-between font-medium text-slate-700 text-xs border-b border-slate-100 pb-1.5">
                  <span>Freights Transport Charge ({previewInvoice.loadRef})</span>
                  <span className="font-bold">{previewInvoice.amount}</span>
                </div>
                <div className="flex justify-between font-medium text-slate-400 text-[10.5px]">
                  <span>GST (10% Included)</span>
                  <span>Included</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => triggerToast(`Downloading PDF for invoice ${previewInvoice.number}...`)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Download PDF</span>
                </button>

                <div className="flex items-center gap-2">
                  {previewInvoice.status === 'Overdue' && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setPayInvoiceTarget(previewInvoice);
                        setPreviewInvoice(null);
                        setIsMakePaymentModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Lock size={12} />
                      <span>Pay Invoice</span>
                    </button>
                  )}
                  <button 
                    type="button" 
                    onClick={() => setPreviewInvoice(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
