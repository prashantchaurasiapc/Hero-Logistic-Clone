import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { 
  Search, Plus, ChevronDown, Calendar, FileText, DollarSign, 
  Building, AlertTriangle, Filter, Download, RefreshCw, Eye,
  Check, X, CreditCard, ChevronLeft, ChevronRight, ArrowLeft,
  ArrowUpRight, ArrowDownRight, Code2, MoreHorizontal, Mail, Printer, FilePlus, Edit, User, MapPin, Phone, ExternalLink, Clock,
  HelpCircle, Shield, ShieldCheck, Bell, MoreVertical, TrendingUp, CheckCircle2, Code, Percent, BarChart2, PieChart, Cloud, History, Share2, Send
} from 'lucide-react';

export default function Finance() {
  // Navigation View Mode: 'dashboard' () | 'invoices' () | 'invoice_details' () | 'payments_receipts' ()
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

  // States for Payments & Receipts page
  const [prSearchQuery, setPrSearchQuery] = useState('');
  const [prSelectedBranch, setPrSelectedBranch] = useState('All Branches');
  const [prSelectedType, setPrSelectedType] = useState('All Payment Types');
  const [prSelectedStatus, setPrSelectedStatus] = useState('All Status');
  const [payMenuIndex, setPayMenuIndex] = useState(null);
  const [viewPaymentModal, setViewPaymentModal] = useState(null);
  const [editPaymentModal, setEditPaymentModal] = useState(null);
  const [paymentsList, setPaymentsList] = useState([]);
  const [receiptsList, setReceiptsList] = useState([]);
  const [recMenuIndex, setRecMenuIndex] = useState(null);
  const [viewReceiptModal, setViewReceiptModal] = useState(null);
  const [editReceiptModal, setEditReceiptModal] = useState(null);

  // States for Expenses page
  const [expSearchQuery, setExpSearchQuery] = useState('');
  const [expSelectedBranch, setExpSelectedBranch] = useState('All Branches');
  const [expSelectedCategory, setExpSelectedCategory] = useState('All Categories');
  const [expSelectedType, setExpSelectedType] = useState('All Payment Types');
  const [expMenuIndex, setExpMenuIndex] = useState(null);
  const [viewExpenseModal, setViewExpenseModal] = useState(null);
  const [editExpenseModal, setEditExpenseModal] = useState(null);
  const [expensesList, setExpensesList] = useState([]);

  // States for Payroll Runs page
  const [paySearchQuery, setPaySearchQuery] = useState('');
  const [paySelectedBranch, setPaySelectedBranch] = useState('All Branches');
  const [paySelectedType, setPaySelectedType] = useState('All Pay Types');
  const [paySelectedStatus, setPaySelectedStatus] = useState('All Status');
  const [payRunMenuIndex, setPayRunMenuIndex] = useState(null);
  const [viewPayrollModal, setViewPayrollModal] = useState(null);
  const [editPayrollModal, setEditPayrollModal] = useState(null);
  const [payrollList, setPayrollList] = useState([]);

  // States for Accounts Receivable & Overdue Invoices page
  const [recSearchQuery, setRecSearchQuery] = useState('');
  const [recSelectedBranch, setRecSelectedBranch] = useState('All Branches');
  const [recSelectedCustomer, setRecSelectedCustomer] = useState('All Customers');
  const [recSelectedStatus, setRecSelectedStatus] = useState('All Status');
  const [ovdMenuIndex, setOvdMenuIndex] = useState(null);
  const [viewOverdueModal, setViewOverdueModal] = useState(null);
  const [editOverdueModal, setEditOverdueModal] = useState(null);
  const [overdueList, setOverdueList] = useState([]);

  // States for Profit & Loss / Financial Reports page
  const [repSearchQuery, setRepSearchQuery] = useState('');
  const [repSelectedBranch, setRepSelectedBranch] = useState('All Branches');
  const [repSelectedAccount, setRepSelectedAccount] = useState('All Accounts');
  const [repSelectedTimeframe, setRepSelectedTimeframe] = useState('This Month');

  // States for Accountant Export & Integration page
  const [accSearchQuery, setAccSearchQuery] = useState('');
  const [accSelectedType, setAccSelectedType] = useState('All Export Types');
  const [accSelectedFormat, setAccSelectedFormat] = useState('All Formats');
  const [accSelectedStatus, setAccSelectedStatus] = useState('All Status');
  const [accMenuIndex, setAccMenuIndex] = useState(null);
  const [viewExportModal, setViewExportModal] = useState(null);
  const [editExportModal, setEditExportModal] = useState(null);
  const [accExportList, setAccExportList] = useState([]);

  // Modals & Active Invoice Details
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showScheduleReportModal, setShowScheduleReportModal] = useState(false);
  const [showExportHistoryModal, setShowExportHistoryModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRowActionsModal, setShowRowActionsModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const [showCreditNoteModal, setShowCreditNoteModal] = useState(false);
  const [showSendRemindersModal, setShowSendRemindersModal] = useState(false);
  
  const [dateRange, setDateRange] = useState({ startDate: '2025-05-01', endDate: '2025-05-31', preset: 'This Month (May 2025)' });
  const [selectedRowItem, setSelectedRowItem] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(11);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showMoreActions, setShowMoreActions] = useState(false);

  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'Direct Bank Transfer (EFT)', date: '2025-05-24', reference: 'PAY-2025-0912' });
  const [emailForm, setEmailForm] = useState({ to: 'accounts@customer.com.au', subject: 'Tax Invoice INV-2025-0187 - Hero Logistics', message: 'Please find attached your official tax invoice for recent freight services. Thank you for your business!' });
  const [creditForm, setCreditForm] = useState({ amount: '$250.00', reason: 'Overcharge / Freight Calculation Adjustment', notes: '' });

  // Form state for Schedule Report Modal
  const [scheduleForm, setScheduleForm] = useState({
    reportName: 'Profit & Loss / Financial Reports',
    frequency: 'Monthly (1st of month)',
    recipientEmail: 'finance-admin@herologistics.com.au',
    format: 'PDF Document',
    deliveryTime: '08:00 AM AEST'
  });

  // Active Detailed Invoice for Page 
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

  // Comprehensive Invoices Database for Invoices List Page
  const [invoices, setInvoices] = useState([]);

  
  const [financeStats, setFinanceStats] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);

  const fetchFinanceData = useCallback(async () => {
    setLoadingApi(true);
    try {
      const res = await api.get('/company-admin/finance');
      const data = res.data?.data || res.data || {};
      if (data.stats) {
        setFinanceStats(data.stats);
      }
      if (Array.isArray(data.invoices)) {
        const mapped = data.invoices.map(inv => ({
          id: inv.invoiceNumber || inv.id,
          dbId: inv.id,
          customer: inv.customer?.name || 'General Customer',
          ref: inv.load?.loadRef || '—',
          issueDate: inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
          dueDate: inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
          type: inv.entryType || 'Tax Invoice',
          amount: `${(parseFloat(inv.amount) || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          rawAmount: parseFloat(inv.amount) || 0,
          status: inv.status === 'PAID' ? 'Paid' : (inv.status === 'OVERDUE' ? 'Overdue' : 'Outstanding'),
          dueIn: inv.status === 'PAID' ? '-' : '14 days'
        }));
        setInvoices(mapped);

        const mappedPayments = mapped.filter(inv => inv.type === 'Payment Received' || inv.type === 'Payment' || inv.status === 'Paid').map(inv => ({
          date: inv.issueDate,
          ref: `PAY-${inv.id}`,
          customer: inv.customer,
          invoice: inv.id,
          method: 'Bank Transfer',
          amount: inv.amount,
          status: 'Completed',
          branch: 'Sydney Head Office'
        }));
        setPaymentsList(mappedPayments);

        const mappedReceipts = mapped.filter(inv => inv.type === 'Receipt Issued' || inv.type === 'Receipt').map(inv => ({
          date: inv.issueDate,
          ref: `REC-${inv.id}`,
          customer: inv.customer,
          for: 'Invoice Payment',
          method: 'Bank Transfer',
          amount: inv.amount,
          status: 'Issued',
          branch: 'Sydney Head Office'
        }));
        setReceiptsList(mappedReceipts);

        const mappedExpensesFromInvoices = mapped.filter(inv => inv.type === 'Expense Claim' || inv.type === 'Expense').map(inv => ({
          date: inv.issueDate,
          ref: `EXP-${inv.id}`,
          desc: `Expense - ${inv.customer}`,
          category: 'General Expense',
          amount: inv.amount,
          type: 'Bank Transfer',
          status: 'Approved',
          user: inv.customer,
          branch: 'Sydney Head Office'
        }));

        const billingMapped = Array.isArray(data.billingRecords) ? data.billingRecords.map(b => ({
          date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
          ref: b.invoiceNumber || `EXP-${b.id.slice(0, 6)}`,
          desc: `Expense Claim (${b.planTierSnapshot || 'General'})`,
          category: b.planTierSnapshot || 'Fuel',
          amount: `$${(parseFloat(b.amount) || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          type: b.paymentMethod || 'Bank Transfer',
          status: b.status === 'PAID' ? 'Approved' : 'Pending',
          user: 'Company Admin',
          branch: 'Sydney Head Office'
        })) : [];

        setExpensesList([...billingMapped, ...mappedExpensesFromInvoices]);

        const mappedPayrollFromInvoices = mapped.filter(inv => inv.type === 'Payroll Run' || inv.type === 'Payroll' || (inv.type && inv.type.includes('Payroll'))).map(inv => ({
          name: `Payroll Run - ${inv.issueDate}`,
          period: `01 - ${inv.issueDate}`,
          branch: 'Sydney Head Office',
          employees: 1,
          type: 'Driver Wages',
          total: inv.amount,
          status: 'Paid',
          user: inv.customer,
          date: inv.issueDate
        }));

        const billingPayrollMapped = Array.isArray(data.billingRecords)
          ? data.billingRecords.filter(b => !b.planTierSnapshot || b.planTierSnapshot === 'Payroll' || b.planTierSnapshot === 'Payroll Run' || (b.planTierSnapshot && b.planTierSnapshot.includes('Payroll')) || b.planTierSnapshot === 'General').map(b => ({
              name: `Payroll Run - ${b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}`,
              period: `01 - ${b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}`,
              branch: 'Sydney Head Office',
              employees: 1,
              type: 'Driver Wages',
              total: `${(parseFloat(b.amount) || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              status: b.status === 'PAID' ? 'Paid' : 'Pending',
              user: 'Company Admin',
              date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
            }))
          : [];

        setPayrollList([...billingPayrollMapped, ...mappedPayrollFromInvoices]);
      }
    } catch (err) {
      console.error('Error fetching finance data:', err);
    } finally {
      setLoadingApi(false);
    }
  }, []);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Open Full Invoice Details Page 
  const handleOpenInvoiceDetail = (inv) => {
    const isPaid = inv ? inv.status === 'Paid' : true;
    const rawAmt = inv && inv.rawAmount ? Math.abs(inv.rawAmount) : 9625;

    // Calculate Subtotal and GST from rawAmt
    const calcSubtotal = rawAmt / 1.1;
    const calcGst = rawAmt - calcSubtotal;

    const fmtTotal = inv ? inv.amount : '$9,625.00';
    const fmtSubtotal = `$${calcSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const fmtGst = `$${calcGst.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const detailObj = {
      id: inv ? inv.id : 'INV-2025-0187',
      customer: inv ? inv.customer : 'All Star Motors',
      abn: '12 345 678 901',
      email: inv && inv.customer ? `accounts@${inv.customer.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.au` : 'accounts@allstarmotors.com.au',
      phone: '+61 2 9876 5432',
      address: '321 Parramatta Rd, Sydney NSW 2150',
      issueDate: inv ? inv.issueDate : '10 May 2025',
      dueDate: inv ? inv.dueDate : '24 May 2025',
      paidDate: isPaid ? (inv ? inv.issueDate : '16 May 2025') : '-',
      terms: '14 Days',
      status: inv ? inv.status : 'Paid',
      subtotal: fmtSubtotal,
      gst: fmtGst,
      total: fmtTotal,
      amountPaid: isPaid ? fmtTotal : '$0.00',
      balanceDue: isPaid ? '$0.00' : fmtTotal,
      paymentMethod: 'Bank Transfer',
      paymentRef: `EFT-${Math.floor(50000 + Math.random() * 40000)}`,
      paymentDate: isPaid ? '16 May 2025' : '-',
      loadId: inv && inv.ref ? inv.ref : 'LD-2025-0421',
      jobDate: '06 May 2025',
      createdBy: 'Admin User',
      createdOn: `${inv ? inv.issueDate : '10 May 2025'} 09:14 AM`,
      lastUpdated: '16 May 2025 11:23 AM',
      lineItems: [
        { 
          id: 1, 
          desc: `Car Transport - ${inv ? inv.customer : 'Sydney to Brisbane'}`, 
          sub: `Load: ${inv && inv.ref ? inv.ref : 'LD-2025-0421'} | Service: Car Carrier`, 
          qty: '1.00', 
          unitPrice: `$${(calcSubtotal * 0.7428).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
          gst: `$${(calcGst * 0.7428).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
          total: `$${(rawAmt * 0.7428).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        },
        { 
          id: 2, 
          desc: 'Toll & Road Charges', 
          sub: 'As per receipts attached', 
          qty: '1.00', 
          unitPrice: `$${(calcSubtotal * 0.0514).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
          gst: `$${(calcGst * 0.0514).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
          total: `$${(rawAmt * 0.0514).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        },
        { 
          id: 3, 
          desc: 'Fuel Surcharge', 
          sub: 'Surcharge applied', 
          qty: '1.00', 
          unitPrice: `$${(calcSubtotal * 0.0571).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
          gst: `$${(calcGst * 0.0571).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
          total: `$${(rawAmt * 0.0571).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        },
        { 
          id: 4, 
          desc: 'Waiting Time', 
          sub: '2.5 hours @ $220/hr', 
          qty: '2.50', 
          unitPrice: `$${(calcSubtotal * 0.0628).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
          gst: `$${(calcGst * 0.0628).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
          total: `$${(rawAmt * 0.0628).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        },
        { 
          id: 5, 
          desc: 'Admin Fee', 
          sub: 'Documentation & processing', 
          qty: '1.00', 
          unitPrice: `$${(calcSubtotal * 0.0859).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
          gst: `$${(calcGst * 0.0859).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
          total: `$${(rawAmt * 0.0859).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        }
      ],
      attachments: [
        { name: 'Fuel_Receipt_001.pdf', size: '102 KB', date: inv ? inv.issueDate : '06 May 2025' },
        { name: 'Toll_Receipt_001.pdf', size: '98 KB', date: inv ? inv.issueDate : '06 May 2025' },
        { name: `POD_${inv && inv.ref ? inv.ref : 'LD-2025-0421'}.pdf`, size: '245 KB', date: inv ? inv.issueDate : '06 May 2025' }
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
  const handleAddTransactionSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!transactionForm.amount) return;

    try {
      const payload = {
        entryType: transactionForm.type || 'Invoice',
        amount: parseFloat(transactionForm.amount),
        entityName: transactionForm.customer || 'General Customer',
        paymentMethod: transactionForm.method || 'Bank Transfer',
        status: transactionForm.status || 'Completed',
        dueDate: transactionForm.dueDate || undefined
      };

      const res = await api.post('/company-admin/finance/invoices', payload);
      triggerToast('Transaction entry recorded successfully in database!');
      setShowAddTransactionModal(false);

      const formattedDate = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
      const formattedAmt = `${(parseFloat(transactionForm.amount) || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      if (transactionForm.type === 'Payroll' || transactionForm.type === 'Payroll Run') {
        const newPayItem = {
          name: `Payroll Run - ${formattedDate}`,
          period: `01 - ${formattedDate}`,
          branch: 'Sydney Head Office',
          employees: 1,
          type: 'Driver Wages',
          total: formattedAmt,
          status: (transactionForm.status === 'Completed' || transactionForm.status === 'Paid') ? 'Paid' : 'Pending',
          user: transactionForm.customer || 'Company Admin',
          date: formattedDate
        };
        setPayrollList(prev => [newPayItem, ...prev]);
      }

      setTransactionForm({ customer: '', amount: '', type: 'Invoice', method: 'Bank Transfer', status: 'Completed' });
      await fetchFinanceData();
    } catch (err) {
      console.error('Error recording transaction:', err);
      triggerToast('Failed to save transaction. Please check inputs.');
    }
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

  // Handle Export File Download
  const handleExportDownload = (format = 'pdf') => {
    const formatUpper = format.toUpperCase();
    const content = `=====================================================
HERO LOGISTICS - FINANCIAL REPORT EXPORT (${formatUpper})
Module State: ${viewMode.toUpperCase()}
Export Date: ${new Date().toLocaleString()}
Generated By: Company Admin (Sarah Mitchell)

1. EXECUTIVE SUMMARY
-----------------------------------------------------
Total Transactions Exported: ${invoices.length}
Timeframe: May 2025
Status: Fully Verified & Audited

2. TRANSACTION RECORDS
-----------------------------------------------------
${invoices.map(i => `${i.id} | ${i.customer} | ${i.issueDate} | ${i.dueDate} | ${i.amount} | ${i.status}`).join('\n')}

Hero Logistics Pty Ltd - Management System (c) 2025
`;
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Financial_Export_${viewMode}_${Date.now()}.${format === 'csv' ? 'csv' : (format === 'excel' ? 'xlsx' : 'pdf')}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowExportModal(false);
    triggerToast(`Financial Report downloaded successfully as ${formatUpper}!`);
  };

  // Handle Schedule Report Submit
  const handleScheduleReportSubmit = (e) => {
    e.preventDefault();
    setShowScheduleReportModal(false);
    triggerToast(`Automated ${scheduleForm.frequency} report for '${scheduleForm.reportName}' scheduled to ${scheduleForm.recipientEmail}!`);
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
      {/* VIEW MODE 1: FINANCE DASHBOARD - SYDNEY HEAD OFFICE                 */}
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 md:border-b-0">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    Finance Dashboard
                  </h1>
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-black shrink-0" title="Verified Branch">✓</span>
                </div>
                <p className="text-slate-500 text-[10px] md:text-xs font-medium mt-0.5 truncate hidden sm:block">
                  Monitor financial performance, cash flow and key metrics in real time.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setViewMode('invoices')}
                  className="flex items-center gap-1.5 bg-white border border-purple-200 text-purple-700 hover:text-purple-900 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold hover:bg-purple-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> Invoices List Page &rarr;
                </button>
                <button 
                  onClick={() => setShowAddTransactionModal(true)}
                  className="flex items-center gap-1.5 bg-[#4B0082] hover:bg-[#3b0066] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" /> Add Transaction
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
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
                          📊 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💳 Payments & Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💵 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          👥 Payroll Runs
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
            {/* Card 1: TOTAL REVENUE (MTD) */}
            <div onClick={() => setViewMode('payments_receipts')} className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block truncate">TOTAL REVENUE (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1 whitespace-nowrap">{financeStats ? `${(financeStats.totalRevenue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
                <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">{financeStats && financeStats.totalRevenue > 0 ? "▲ Live Database" : "—"}</div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('payments_receipts'); }} className="text-[9.5px] font-bold text-purple-600 group-hover:text-purple-800 flex items-center gap-1 mt-2 cursor-pointer">
                  <span>View report</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            {/* Card 2: TOTAL EXPENSES (MTD) */}
            <div onClick={() => setViewMode('expenses')} className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block truncate">TOTAL EXPENSES (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1 whitespace-nowrap">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
                <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">{financeStats && financeStats.totalExpenses > 0 ? "▲ Live Database" : "—"}</div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('expenses'); }} className="text-[9.5px] font-bold text-purple-600 group-hover:text-purple-800 flex items-center gap-1 mt-2 cursor-pointer">
                  <span>View report</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            {/* Card 3: NET PROFIT (MTD) */}
            <div onClick={() => setViewMode('reports')} className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block truncate">NET PROFIT (MTD)</span>
                <div className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1 whitespace-nowrap">{financeStats ? `${(financeStats.netProfit || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
                <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">{financeStats && financeStats.netProfit > 0 ? "▲ Live Database" : "—"}</div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('reports'); }} className="text-[9.5px] font-bold text-purple-600 group-hover:text-purple-800 flex items-center gap-1 mt-2 cursor-pointer">
                  <span>View report</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            {/* Card 4: OUTSTANDING INVOICES */}
            <div onClick={() => setViewMode('payroll')} className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block truncate">OUTSTANDING INVOICES</span>
                <div className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1 whitespace-nowrap">{financeStats ? `${(financeStats.totalOutstanding || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
                <div className="text-[9.5px] font-bold text-rose-500 mt-1 whitespace-nowrap">{financeStats && financeStats.totalOutstanding > 0 ? "▼ Live Database" : "—"}</div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('payroll'); }} className="text-[9.5px] font-bold text-purple-600 group-hover:text-purple-800 flex items-center gap-1 mt-2 cursor-pointer">
                  <span>View report</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            {/* Card 5: CASH IN BANK */}
            <div onClick={() => setViewMode('accountant')} className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                <Building className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block truncate">CASH IN BANK</span>
                <div className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1 whitespace-nowrap">{financeStats ? `${((financeStats.totalRevenue || 0) - (financeStats.totalExpenses || 0)).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
                <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">{financeStats && financeStats.totalRevenue > 0 ? "▲ Live Database" : "—"}</div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('accountant'); }} className="text-[9.5px] font-bold text-purple-600 group-hover:text-purple-800 flex items-center gap-1 mt-2 cursor-pointer">
                  <span>View report</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            {/* Card 6: OVERDUE INVOICES */}
            <div onClick={() => setViewMode('receivables')} className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block truncate">OVERDUE INVOICES</span>
                <div className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1 whitespace-nowrap">{financeStats ? `${(financeStats.totalOverdue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
                <div className="text-[9.5px] font-bold text-rose-500 mt-1 whitespace-nowrap">{financeStats && financeStats.totalOverdue > 0 ? "▼ Live Database" : "—"}</div>
                <button onClick={(e) => { e.stopPropagation(); setViewMode('receivables'); }} className="text-[9.5px] font-bold text-purple-600 group-hover:text-purple-800 flex items-center gap-1 mt-2 cursor-pointer">
                  <span>View report</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Toolbar Bar */}
          <div className="bg-white p-3 border border-slate-200/80 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
            <div className="relative flex-1 min-w-[200px] sm:min-w-[240px] w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by reference, customer or type..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap flex-nowrap pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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

              <div className="relative inline-flex items-center shrink-0">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-800 font-extrabold">{dateRange.startDate}</span>
                  <span className="text-slate-400 font-normal mx-0.5">&ndash;</span>
                  <span className="text-slate-800 font-extrabold">{dateRange.endDate}</span>
                </div>

                {/* Start Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.startDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, startDate: e.target.value });
                      triggerToast(`Start Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute left-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select Start Date"
                />

                {/* End Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.endDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, endDate: e.target.value });
                      triggerToast(`End Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute right-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select End Date"
                />
              </div>

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
                  <span className="text-xs font-black text-slate-900">{financeStats ? `${(financeStats.totalRevenue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
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
                  <span className="text-xs font-black text-slate-900">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
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
                  <span className="text-xs font-black text-slate-900">{financeStats ? `${(financeStats.netProfit || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
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
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-16 h-16 transform -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray="55.7 100" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="21.5 100" strokeDashoffset="-55.7" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="100" strokeDashoffset="-77.2" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-sm font-black text-slate-900 leading-none">{financeStats ? (financeStats.totalInvoices || 0) : 0}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Total</span>
                  </div>
                </div>

                <div className="space-y-2 text-[10px] sm:text-[10.5px] font-bold text-slate-700 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1.5 shrink-0"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Paid</span>
                    <span className="font-extrabold text-slate-900 shrink-0 whitespace-nowrap">{financeStats ? `${financeStats.paidCount || 0} (${financeStats.totalInvoices ? ((financeStats.paidCount / financeStats.totalInvoices)*100).toFixed(1) : 0}%)` : "0 (0%)"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1.5 shrink-0"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> Outstanding</span>
                    <span className="font-extrabold text-slate-900 shrink-0 whitespace-nowrap">{financeStats ? `${financeStats.outstandingCount || 0} (${financeStats.totalInvoices ? ((financeStats.outstandingCount / financeStats.totalInvoices)*100).toFixed(1) : 0}%)` : "0 (0%)"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1.5 shrink-0"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> Overdue</span>
                    <span className="font-extrabold text-slate-900 shrink-0 whitespace-nowrap">{financeStats ? `${financeStats.overdueCount || 0} (${financeStats.totalInvoices ? ((financeStats.overdueCount / financeStats.totalInvoices)*100).toFixed(1) : 0}%)` : "0 (0%)"}</span>
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
                <span>Showing {invoices.length === 0 ? 0 : 1} to {invoices.length} of {invoices.length} invoices</span>
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
                      <span className="text-xs font-black text-slate-900 leading-none">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Total</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-bold text-slate-700 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Fuel</span>
                    <span>{financeStats && financeStats.totalExpenses > 0 ? `${((financeStats.totalExpenses * 0.384)).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (38.4%)` : "$0.00 (0%)"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Staff</span>
                    <span>{financeStats && financeStats.totalExpenses > 0 ? `${((financeStats.totalExpenses * 0.220)).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (22.0%)` : "$0.00 (0%)"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Maintenance</span>
                    <span>{financeStats && financeStats.totalExpenses > 0 ? `${((financeStats.totalExpenses * 0.166)).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (16.6%)` : "$0.00 (0%)"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Warehouse</span>
                    <span>{financeStats && financeStats.totalExpenses > 0 ? `${((financeStats.totalExpenses * 0.113)).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (11.3%)` : "$0.00 (0%)"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Other</span>
                    <span>{financeStats && financeStats.totalExpenses > 0 ? `${((financeStats.totalExpenses * 0.117)).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (11.7%)` : "$0.00 (0%)"}</span>
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
                    <span className="text-sm font-black text-slate-900">{financeStats ? `${((financeStats.totalRevenue || 0) - (financeStats.totalExpenses || 0)).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FileText className="w-4 h-4" /></div>
                      <span className="text-xs font-bold text-slate-700">Accounts Receivable</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{financeStats ? `${(financeStats.totalOutstanding || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><FileText className="w-4 h-4" /></div>
                      <span className="text-xs font-bold text-slate-700">Accounts Payable</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CreditCard className="w-4 h-4" /></div>
                      <span className="text-xs font-bold text-slate-700">Available Credit</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">$0.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: INVOICES LIST - SYDNEY HEAD OFFICE                     */}
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 md:border-b-0">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    Invoices List
                  </h1>
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-black shrink-0" title="Verified Branch">✓</span>
                </div>
                <p className="text-slate-500 text-[10px] md:text-xs font-medium mt-0.5 truncate hidden sm:block">
                  View, filter and manage all customer invoices.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setViewMode('dashboard')}
                  className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" /> Back to Finance
                </button>
                <button 
                  onClick={() => setShowAddTransactionModal(true)}
                  className="flex items-center gap-1.5 bg-[#4B0082] hover:bg-[#3b0066] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" /> Create Invoice
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? (financeStats.totalInvoices || 0) : 0}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${financeStats.paidCount || 0} ` : "0 "}<span className="text-xs font-bold text-slate-500">({financeStats && financeStats.totalInvoices ? ((financeStats.paidCount / financeStats.totalInvoices)*100).toFixed(1) : 0}%)</span></div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${financeStats.outstandingCount || 0} ` : "0 "}<span className="text-xs font-bold text-slate-500">({financeStats && financeStats.totalInvoices ? ((financeStats.outstandingCount / financeStats.totalInvoices)*100).toFixed(1) : 0}%)</span></div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${financeStats.overdueCount || 0} ` : "0 "}<span className="text-xs font-bold text-slate-500">({financeStats && financeStats.totalInvoices ? ((financeStats.overdueCount / financeStats.totalInvoices)*100).toFixed(1) : 0}%)</span></div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${((financeStats.totalRevenue || 0) + (financeStats.totalOutstanding || 0) + (financeStats.totalOverdue || 0)).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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

              <div className="relative inline-flex items-center shrink-0">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-800 font-extrabold">{dateRange.startDate}</span>
                  <span className="text-slate-400 font-normal mx-0.5">&ndash;</span>
                  <span className="text-slate-800 font-extrabold">{dateRange.endDate}</span>
                </div>

                {/* Start Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.startDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, startDate: e.target.value });
                      triggerToast(`Start Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute left-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select Start Date"
                />

                {/* End Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.endDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, endDate: e.target.value });
                      triggerToast(`End Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute right-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select End Date"
                />
              </div>

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
                    <span className="font-extrabold text-slate-900">{financeStats ? (financeStats.totalInvoices || 0) : 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Paid</span>
                    <span className="font-extrabold text-slate-900">{financeStats ? `${financeStats.paidCount || 0} (${financeStats.totalInvoices ? ((financeStats.paidCount / financeStats.totalInvoices)*100).toFixed(1) : 0}%)` : "0 (0%)"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Outstanding</span>
                    <span className="font-extrabold text-slate-900">{financeStats ? `${financeStats.outstandingCount || 0} (${financeStats.totalInvoices ? ((financeStats.outstandingCount / financeStats.totalInvoices)*100).toFixed(1) : 0}%)` : "0 (0%)"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Overdue</span>
                    <span className="font-extrabold text-slate-900">{financeStats ? `${financeStats.overdueCount || 0} (${financeStats.totalInvoices ? ((financeStats.overdueCount / financeStats.totalInvoices)*100).toFixed(1) : 0}%)` : "0 (0%)"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Draft</span>
                    <span className="font-extrabold text-slate-900">0 (0%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Cancelled</span>
                    <span className="font-extrabold text-slate-900">0 (0%)</span>
                  </div>
                </div>
              </div>

              {/* Card 2: INVOICE VALUE BY STATUS */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">INVOICE VALUE BY STATUS</h3>
                  <button onClick={() => triggerToast('Viewing Status Chart')} className="text-[10px] font-bold text-purple-600 hover:underline">View Chart &rarr;</button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-18 h-18 transform -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray="63.5 100" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="24.5 100" strokeDashoffset="-63.5" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="8.6 100" strokeDashoffset="-88" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-900 leading-none">
                        {financeStats ? `$${((financeStats.totalRevenue || 0) + (financeStats.totalOutstanding || 0) + (financeStats.totalOverdue || 0)).toLocaleString('en-AU', { maximumFractionDigits: 0 })}` : "$0"}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Total</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[10px] sm:text-[px] font-bold text-slate-700 flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-1">
                      <span className="flex items-center gap-1 text-slate-600 truncate"><span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span> Paid</span> 
                      <span className="font-mono text-slate-900 shrink-0 text-[10px]">{financeStats ? `$${(financeStats.totalRevenue || 0).toLocaleString('en-AU', { minimumFractionDigits: 2 })}` : "$0.00"}</span>
                    </div>
                    <div className="flex justify-between items-center gap-1">
                      <span className="flex items-center gap-1 text-slate-600 truncate"><span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span> Outstanding</span> 
                      <span className="font-mono text-slate-900 shrink-0 text-[10px]">{financeStats ? `$${(financeStats.totalOutstanding || 0).toLocaleString('en-AU', { minimumFractionDigits: 2 })}` : "$0.00"}</span>
                    </div>
                    <div className="flex justify-between items-center gap-1">
                      <span className="flex items-center gap-1 text-slate-600 truncate"><span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span> Overdue</span> 
                      <span className="font-mono text-slate-900 shrink-0 text-[10px]">{financeStats ? `$${(financeStats.totalOverdue || 0).toLocaleString('en-AU', { minimumFractionDigits: 2 })}` : "$0.00"}</span>
                    </div>
                    <div className="flex justify-between items-center gap-1">
                      <span className="flex items-center gap-1 text-slate-600 truncate"><span className="w-2 h-2 rounded-full bg-purple-400 shrink-0"></span> Draft</span> 
                      <span className="font-mono text-slate-900 shrink-0 text-[10px]">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center gap-1">
                      <span className="flex items-center gap-1 text-slate-600 truncate"><span className="w-2 h-2 rounded-full bg-slate-300 shrink-0"></span> Cancelled</span> 
                      <span className="font-mono text-slate-900 shrink-0 text-[10px]">$0.00</span>
                    </div>
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
                  {invoices.length > 0 ? (
                    invoices.slice(0, 5).map((inv, idx) => (
                      <div key={inv.id || idx} className="flex justify-between items-center">
                        <span className="text-slate-600 truncate max-w-[180px]">{idx + 1}. {inv.customer}</span> 
                        <span className="font-black shrink-0">{inv.amount}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-400 text-xs font-semibold">No customer activity yet</div>
                  )}
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

          
        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 3: INVOICE DETAILS - SCREENSHOT 2 MATCHING                */}
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
                    Invoice Details &ndash; {activeInvoiceDetail.id}
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  View and manage invoice information, line items, payments and history.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
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
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => handleDownloadInvoice(activeInvoiceDetail)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-600" /> Download PDF
                  </button>
                  <button 
                    onClick={() => {
                      setEmailForm({ ...emailForm, to: activeInvoiceDetail.email || 'accounts@customer.com.au', subject: `Tax Invoice ${activeInvoiceDetail.id} - Hero Logistics` });
                      setShowSendEmailModal(true);
                    }}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-600" /> Send to Customer
                  </button>
                  <button 
                    onClick={() => setShowCreditNoteModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-600" /> Credit Note
                  </button>
                  <button 
                    onClick={() => {
                      setPaymentForm({ ...paymentForm, amount: activeInvoiceDetail.amount });
                      setShowRecordPaymentModal(true);
                    }}
                    className="flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
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
          {/* Top Row Grid: Left 8 Cols (Header Details) & Right 4 Cols (Invoice Summary) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: Main Top Invoice Card Header (ID & Customer Details) */}
            <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row justify-between items-start gap-5">
              {/* Left: Invoice Title & Dates */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{activeInvoiceDetail.id}</h2>
                  {getStatusBadge(activeInvoiceDetail.status)}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 flex items-center gap-1 mb-0.5 font-semibold text-[11px]"><Calendar className="w-3 h-3 text-indigo-500" /> Issue Date</span>
                    <span className="text-slate-900 font-extrabold text-[11px]">{activeInvoiceDetail.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 flex items-center gap-1 mb-0.5 font-semibold text-[11px]"><Calendar className="w-3 h-3 text-amber-500" /> Due Date</span>
                    <span className="text-slate-900 font-extrabold text-[11px]">{activeInvoiceDetail.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 flex items-center gap-1 mb-0.5 font-semibold text-[11px]"><Check className="w-3 h-3 text-emerald-500 stroke-[3]" /> Paid Date</span>
                    <span className="text-slate-900 font-extrabold text-[11px]">{activeInvoiceDetail.paidDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 flex items-center gap-1 mb-0.5 font-semibold text-[11px]"><Clock className="w-3 h-3 text-blue-500" /> Payment Terms</span>
                    <span className="text-slate-900 font-extrabold text-[11px]">{activeInvoiceDetail.terms}</span>
                  </div>
                </div>
              </div>

              {/* Right: Customer Info block inside same card - separated by border */}
              <div className="md:border-l md:border-slate-100 md:pl-5 min-w-[200px] space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-900 text-sm font-black mb-1.5">
                  <User className="w-4 h-4 text-indigo-600 shrink-0" /> {activeInvoiceDetail.customer}
                </div>
                <p className="text-slate-400 font-semibold text-[11px]">ABN: {activeInvoiceDetail.abn}</p>
                <p className="text-indigo-600 font-extrabold hover:underline cursor-pointer text-[11px]">{activeInvoiceDetail.email}</p>
                <p className="text-slate-700 font-bold text-[11px]">{activeInvoiceDetail.phone}</p>
                <p className="text-slate-500 font-medium text-[11px] leading-snug">{activeInvoiceDetail.address}</p>
              </div>
            </div>

            {/* Right: Invoice Summary Card (4 Cols) - matching screenshot */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col">
              <h3 className="text-xs font-black text-slate-800 mb-3 pb-2 border-b border-slate-100">Invoice Summary</h3>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between items-center"><span className="text-slate-500">Subtotal (Ex GST)</span> <span className="font-mono font-bold text-slate-900">{activeInvoiceDetail.subtotal}</span></div>
                <div className="flex justify-between items-center text-slate-400"><span className="text-slate-500">GST (10%)</span> <span className="font-mono">{activeInvoiceDetail.gst}</span></div>
                <div className="border-t border-slate-100 pt-2 mt-1 flex justify-between items-center font-black text-slate-900">
                  <span className="text-sm font-black">Total (Inc GST)</span>
                  <span className="font-mono font-black text-lg text-slate-950">{activeInvoiceDetail.total}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-emerald-600"><span>Amount Paid</span> <span className="font-mono">{activeInvoiceDetail.amountPaid}</span></div>
                <div className="flex justify-between items-center font-bold text-slate-900"><span>Balance Due</span> <span className="font-mono">{activeInvoiceDetail.balanceDue}</span></div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Split Grid: Line Items + Right Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* LEFT: Line Items + Notes + Attachments (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Invoice Line Items Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100">
                  <h3 className="text-xs font-black text-slate-800">Invoice Line Items</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="py-2.5 px-4">#</th>
                        <th className="py-2.5 px-4">Description</th>
                        <th className="py-2.5 px-4 text-right">Qty</th>
                        <th className="py-2.5 px-4 text-right">Unit Price (Ex GST)</th>
                        <th className="py-2.5 px-4 text-right">GST</th>
                        <th className="py-2.5 px-4 text-right">Total (Inc GST)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {activeInvoiceDetail.lineItems.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-2.5 px-4 text-slate-400 text-[11px]">{item.id}</td>
                          <td className="py-2.5 px-4">
                            <div className="font-bold text-slate-900 text-[11px]">{item.desc}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{item.sub}</div>
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-[11px]">{item.qty}</td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-700 text-[11px]">{item.unitPrice}</td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-500 text-[11px]">{item.gst}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 text-[11px]">{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-bold border-t border-slate-200 text-[11px]">
                        <td colSpan="3" className="py-3 px-4 text-slate-500 font-bold text-[10px] uppercase tracking-wider">Totals</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-900">{activeInvoiceDetail.subtotal}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">{activeInvoiceDetail.gst}</td>
                        <td className="py-3 px-4 text-right font-mono font-black text-indigo-700 text-sm">{activeInvoiceDetail.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Notes + Attachments side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Notes Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 mb-2.5">Notes</h3>
                    <div className="space-y-1 text-[11px] text-slate-600 font-medium leading-relaxed">
                      <p>Thank you for your business.</p>
                      <p>Payment terms are 14 days from invoice date.</p>
                      <p>Please use invoice number as payment reference.</p>
                    </div>
                  </div>
                  <button onClick={() => triggerToast('Notes editor opened')} className="self-start mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer">
                    <Edit className="w-3.5 h-3.5" /> Edit Notes
                  </button>
                </div>

                {/* Attachments (3) Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2.5">
                    <h3 className="text-xs font-black text-slate-800">Attachments (3)</h3>
                    <button onClick={() => triggerToast('Downloading all 3 attachments')} className="text-[10px] font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer">
                      <Download className="w-3 h-3" /> Download All
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {activeInvoiceDetail.attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5 px-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-800 text-[11px]">{file.name}</div>
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

            {/* RIGHT: Payment Status + Related Information (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Payment Status Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                  <h3 className="text-xs font-black text-slate-800">Payment Status</h3>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Paid in Full</span>
                </div>

                <div className="space-y-1.5 text-[11px] font-bold text-slate-700">
                  <div className="flex justify-between"><span className="text-slate-500 font-medium">Paid via</span> <span>{activeInvoiceDetail.paymentMethod}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-medium">Reference</span> <span className="font-mono text-slate-800">{activeInvoiceDetail.paymentRef}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-medium">Payment Date</span> <span>{activeInvoiceDetail.paymentDate}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-medium">Payment Amount</span> <span className="font-mono text-emerald-600 font-black">{activeInvoiceDetail.total}</span></div>
                </div>
                
                <div className="border-t border-slate-100 pt-2.5 mt-3">
                  <button onClick={() => triggerToast('Viewing payment history audit log')} className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer w-full justify-center">
                    <Clock className="w-3.5 h-3.5" /> View Payment History
                  </button>
                </div>
              </div>

              {/* Related Information Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 mb-3">Related Information</h3>
                
                <div className="space-y-1.5 text-[11px] font-bold text-slate-700">
                  <div className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-1.5 font-medium"><FileText className="w-3.5 h-3.5" /> Load</span> <span className="text-indigo-600 font-mono hover:underline cursor-pointer">{activeInvoiceDetail.loadId}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-1.5 font-medium"><User className="w-3.5 h-3.5" /> Customer</span> <span className="text-indigo-600 hover:underline cursor-pointer">{activeInvoiceDetail.customer}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-1.5 font-medium"><Calendar className="w-3.5 h-3.5" /> Job Date</span> <span>{activeInvoiceDetail.jobDate}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-1.5 font-medium"><User className="w-3.5 h-3.5" /> Created By</span> <span>{activeInvoiceDetail.createdBy}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5" /> Created On</span> <span className="text-slate-600">{activeInvoiceDetail.createdOn}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5" /> Last Updated</span> <span className="text-slate-600">{activeInvoiceDetail.lastUpdated}</span></div>
                </div>
              </div>
            </div>
          </div>

          
        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 4: PAYMENTS & RECEIPTS                                   */}
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
                    Payments & Receipts
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  View, record and reconcile all payments and receipts across invoices.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
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
                          📊 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          💳 Payments & Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💵 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          👥 Payroll Runs
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
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Payment', status: 'Completed' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Record Payment
                  </button>
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Receipt', status: 'Completed' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Record Receipt
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
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
                            📊 Finance Dashboard
                          </button>
                          <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            📄 Invoices List
                          </button>
                          <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                            💳 Payments & Receipts
                          </button>
                          <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            💵 Expenses
                          </button>
                          <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            👥 Payroll Runs
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalRevenue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ Live API <span className="text-slate-400 font-normal">Database</span></span>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 font-bold">▲ Live API <span className="text-slate-400 font-normal">Database</span></span>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalOutstanding || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalOverdue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${((financeStats.totalRevenue || 0) - (financeStats.totalExpenses || 0)).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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

              <div className="relative inline-flex items-center shrink-0">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-800 font-extrabold">{dateRange.startDate}</span>
                  <span className="text-slate-400 font-normal mx-0.5">&ndash;</span>
                  <span className="text-slate-800 font-extrabold">{dateRange.endDate}</span>
                </div>

                {/* Start Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.startDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, startDate: e.target.value });
                      triggerToast(`Start Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute left-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select Start Date"
                />

                {/* End Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.endDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, endDate: e.target.value });
                      triggerToast(`End Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute right-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select End Date"
                />
              </div>

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
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black">{paymentsList.length}</span>
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
                      {paymentsList.filter(item => {
                        const matchSearch = item.ref.toLowerCase().includes(prSearchQuery.toLowerCase()) || 
                                            item.customer.toLowerCase().includes(prSearchQuery.toLowerCase()) ||
                                            item.invoice.toLowerCase().includes(prSearchQuery.toLowerCase());
                        const matchBranch = prSelectedBranch === 'All Branches' || item.branch === prSelectedBranch;
                        const matchType = prSelectedType === 'All Payment Types' || item.method === prSelectedType;
                        const matchStatus = prSelectedStatus === 'All Status' || item.status === prSelectedStatus;
                        return matchSearch && matchBranch && matchType && matchStatus;
                      }).map((pay, idx) => (
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
                          <td className="py-3 px-4 text-right relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPayMenuIndex(payMenuIndex === idx ? null : idx);
                              }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${payMenuIndex === idx ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {payMenuIndex === idx && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setPayMenuIndex(null)} />
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 flex flex-col gap-0.5 text-xs font-semibold text-slate-700 text-left">
                                  <button
                                    onClick={() => { setViewPaymentModal(pay); setPayMenuIndex(null); }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-left w-full cursor-pointer"
                                  >
                                    👁️ View Details
                                  </button>
                                  <button
                                    onClick={() => { setEditPaymentModal({ ...pay, index: idx }); setPayMenuIndex(null); }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-left w-full cursor-pointer"
                                  >
                                    ✏️ Edit Record
                                  </button>
                                  <div className="h-px bg-slate-100 my-1" />
                                  <button
                                    onClick={() => {
                                      setPaymentsList(prev => prev.filter((_, i) => i !== idx));
                                      triggerToast(`Payment record ${pay.ref} removed`);
                                      setPayMenuIndex(null);
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 text-left w-full cursor-pointer"
                                  >
                                    ❌ Delete Record
                                  </button>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px] font-semibold bg-slate-50/50">
                  <span>Showing {paymentsList.length === 0 ? 0 : 1} to {paymentsList.length} of {paymentsList.length} payments</span>
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
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black">{receiptsList.length}</span>
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
                      {receiptsList.filter(item => {
                        const matchSearch = item.ref.toLowerCase().includes(prSearchQuery.toLowerCase()) || 
                                            item.customer.toLowerCase().includes(prSearchQuery.toLowerCase()) ||
                                            item.for.toLowerCase().includes(prSearchQuery.toLowerCase());
                        const matchBranch = prSelectedBranch === 'All Branches' || item.branch === prSelectedBranch;
                        const matchType = prSelectedType === 'All Payment Types' || item.method === prSelectedType;
                        const matchStatus = prSelectedStatus === 'All Status' || item.status === prSelectedStatus;
                        return matchSearch && matchBranch && matchType && matchStatus;
                      }).map((rec, idx) => (
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
                          <td className="py-3 px-4 text-right relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRecMenuIndex(recMenuIndex === idx ? null : idx);
                              }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${recMenuIndex === idx ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {recMenuIndex === idx && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setRecMenuIndex(null)} />
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 flex flex-col gap-0.5 text-xs font-semibold text-slate-700 text-left">
                                  <button
                                    onClick={() => { setViewReceiptModal(rec); setRecMenuIndex(null); }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-left w-full cursor-pointer"
                                  >
                                    👁️ View Details
                                  </button>
                                  <button
                                    onClick={() => { setEditReceiptModal({ ...rec, index: idx }); setRecMenuIndex(null); }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-left w-full cursor-pointer"
                                  >
                                    ✏️ Edit Record
                                  </button>
                                  <div className="h-px bg-slate-100 my-1" />
                                  <button
                                    onClick={() => {
                                      setReceiptsList(prev => prev.filter((_, i) => i !== idx));
                                      triggerToast(`Receipt record ${rec.ref} removed`);
                                      setRecMenuIndex(null);
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 text-left w-full cursor-pointer"
                                  >
                                    ❌ Delete Record
                                  </button>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px] font-semibold bg-slate-50/50">
                  <span>Showing {receiptsList.length === 0 ? 0 : 1} to {receiptsList.length} of {receiptsList.length} receipts</span>
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

                <div className="flex flex-row items-center gap-4 py-2">
                  {/* SVG Donut Chart */}
                  <div className="relative w-28 h-28 shrink-0">
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
                      <span className="text-[11px] font-black text-slate-800 leading-tight">{financeStats ? `${(financeStats.totalRevenue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total</span>
                    </div>
                  </div>

                  {/* Legend list */}
                  <div className="flex-1 min-w-0 space-y-1.5 text-xs font-bold text-slate-700">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#4f46e5] shrink-0" />
                        <span className="truncate text-[11px]">Bank Transfer</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[10px] whitespace-nowrap shrink-0 ml-1">$324,560 (55.3%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#06b6d4] shrink-0" />
                        <span className="truncate text-[11px]">EFTPOS</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[10px] whitespace-nowrap shrink-0 ml-1">$128,750 (21.9%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#3b82f6] shrink-0" />
                        <span className="truncate text-[11px]">Credit Card</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[10px] whitespace-nowrap shrink-0 ml-1">$82,430 (14.1%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0" />
                        <span className="truncate text-[11px]">Cash</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[10px] whitespace-nowrap shrink-0 ml-1">$32,980 (5.6%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#ec4899] shrink-0" />
                        <span className="truncate text-[11px]">Other</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[10px] whitespace-nowrap shrink-0 ml-1">$17,500 (3.0%)</span>
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
                      <span>{financeStats ? `${(financeStats.totalOutstanding || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (100%)` : "$0.00 (0%)"}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '71%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>31-60 days</span>
                      <span>{financeStats ? `${(financeStats.totalOverdue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00 (0%)"}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '15.1%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>61-90 days</span>
                      <span>$0.00 (0%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: '8.5%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>90+ days</span>
                      <span>$0.00 (0%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '5.4%' }} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-slate-900 text-sm font-black border-t border-slate-100 pt-3">
                    <span>Total Outstanding</span>
                    <span className="font-mono text-indigo-700">{financeStats ? `${((financeStats.totalOutstanding || 0) + (financeStats.totalOverdue || 0)).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
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

          
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 5: EXPENSES REPORT                                        */}
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
                    Expenses
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  Capture, review and manage all company expenses. Upload receipts and track approvals.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
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
                          📊 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💳 Payments & Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          💵 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          👥 Payroll Runs
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
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Expense', status: 'Pending' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Expense
                  </button>
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Expense', status: 'Completed' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Upload Receipt
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
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
                            📊 Finance Dashboard
                          </button>
                          <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            📄 Invoices List
                          </button>
                          <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            💳 Payments & Receipts
                          </button>
                          <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                            💵 Expenses
                          </button>
                          <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            👥 Payroll Runs
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$0.00</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$0.00</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$0.00</div>
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

              <div className="relative inline-flex items-center shrink-0">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-800 font-extrabold">{dateRange.startDate}</span>
                  <span className="text-slate-400 font-normal mx-0.5">&ndash;</span>
                  <span className="text-slate-800 font-extrabold">{dateRange.endDate}</span>
                </div>

                {/* Start Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.startDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, startDate: e.target.value });
                      triggerToast(`Start Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute left-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select Start Date"
                />

                {/* End Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.endDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, endDate: e.target.value });
                      triggerToast(`End Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute right-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select End Date"
                />
              </div>

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
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black">{expensesList.length}</span>
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
                      {(expensesList.filter(item => {
                          const matchSearch = !expSearchQuery || item.desc.toLowerCase().includes(expSearchQuery.toLowerCase()) ||
                                              item.ref.toLowerCase().includes(expSearchQuery.toLowerCase()) ||
                                              item.user.toLowerCase().includes(expSearchQuery.toLowerCase());
                          const matchBranch = expSelectedBranch === 'All Branches' || item.branch === expSelectedBranch;
                          const matchCategory = expSelectedCategory === 'All Categories' || item.category === expSelectedCategory;
                          const matchType = expSelectedType === 'All Payment Types' || item.type === expSelectedType;
                          return matchSearch && matchBranch && matchCategory && matchType;
                        })).map((exp, idx) => (
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
                           <td className="py-3 px-4 text-right relative">
                             <button
                               onClick={(e) => { e.stopPropagation(); setExpMenuIndex(expMenuIndex === idx ? null : idx); }}
                               className={`p-1.5 rounded-lg transition-colors cursor-pointer ${expMenuIndex === idx ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                             >
                               <MoreVertical className="w-4 h-4" />
                             </button>

                             {expMenuIndex === idx && (
                               <>
                                 <div className="fixed inset-0 z-40" onClick={() => setExpMenuIndex(null)} />
                                 <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 flex flex-col gap-0.5 text-xs font-semibold text-slate-700 text-left">
                                   <button
                                     onClick={() => { setViewExpenseModal(exp); setExpMenuIndex(null); }}
                                     className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-left w-full cursor-pointer"
                                   >
                                     👁️ View Details
                                   </button>
                                   <button
                                     onClick={() => { setEditExpenseModal({ ...exp, index: idx }); setExpMenuIndex(null); }}
                                     className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-left w-full cursor-pointer"
                                   >
                                     ✏️ Edit Record
                                   </button>
                                   <div className="h-px bg-slate-100 my-1" />
                                   <button
                                     onClick={() => {
                                       const realIdx = expensesList.indexOf(exp);
                                       setExpensesList(prev => prev.filter((_, i) => i !== realIdx));
                                       triggerToast(`Expense record ${exp.ref} removed`);
                                       setExpMenuIndex(null);
                                     }}
                                     className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 text-left w-full cursor-pointer"
                                   >
                                     ❌ Delete Record
                                   </button>
                                 </div>
                               </>
                             )}
                           </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px] font-semibold bg-slate-50/50">
                  <span>Showing {expensesList.length === 0 ? 0 : 1} to {expensesList.length} of {expensesList.length} expenses</span>
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
                          <span>{expensesList.length} <span className="text-slate-400 font-normal">(100%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '50.0%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending</span>
                          <span>0 <span className="text-slate-400 font-normal">(0%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '16.7%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Rejected</span>
                          <span>0 <span className="text-slate-400 font-normal">(0%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: '2.8%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> Draft</span>
                          <span>0 <span className="text-slate-400 font-normal">(0%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '30.5%' }} />
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-slate-900 text-xs font-black">
                        <span>Total</span>
                        <span className="text-slate-700 font-black">{expensesList.length}</span>
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

                <div className="flex flex-row items-center gap-4 py-2">
                  {/* SVG Donut Chart */}
                  <div className="relative w-28 h-28 shrink-0">
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
                      <span className="text-[11px] font-black text-slate-800 leading-tight">$256,430</span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total</span>
                    </div>
                  </div>

                  {/* Legend list */}
                  <div className="flex-1 min-w-0 space-y-1.5 text-xs font-bold text-slate-700">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#8b5cf6] shrink-0" />
                        <span className="truncate text-[11px]">Fuel</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[10px] whitespace-nowrap shrink-0 ml-1">$98,560 (38.4%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#06b6d4] shrink-0" />
                        <span className="truncate text-[11px]">Maintenance</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[10px] whitespace-nowrap shrink-0 ml-1">$56,420 (22.0%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#3b82f6] shrink-0" />
                        <span className="truncate text-[11px]">Repairs</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[10px] whitespace-nowrap shrink-0 ml-1">$42,670 (16.6%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0" />
                        <span className="truncate text-[11px]">Tolls</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[10px] whitespace-nowrap shrink-0 ml-1">$21,850 (8.5%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#ec4899] shrink-0" />
                        <span className="truncate text-[11px]">Accommodation</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[10px] whitespace-nowrap shrink-0 ml-1">$18,320 (7.1%)</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#94a3b8] shrink-0" />
                        <span className="truncate text-[11px]">Other</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[10px] whitespace-nowrap shrink-0 ml-1">$18,610 (7.2%)</span>
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
                      <span className="font-mono text-slate-600">$0.00 (0%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: '53.9%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Bank Transfer</span>
                      <span className="font-mono text-slate-600">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (100%)` : "$0.00 (0%)"}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#3b82f6] rounded-full" style={{ width: '29.2%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>EFTPOS</span>
                      <span className="font-mono text-slate-600">$0.00 (0%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#10b981] rounded-full" style={{ width: '8.9%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Personal (Reimb.)</span>
                      <span className="font-mono text-slate-600">$0.00 (0%)</span>
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
                      <span className="font-mono text-slate-900">$0.00</span>
                      <span className="text-[10px] font-bold text-rose-500 font-bold">▼ 8.1%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Accommodation</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-900">$0.00</span>
                      <span className="text-[10px] font-bold text-emerald-600 font-bold">▲ 2.9%</span>
                    </div>
                  </div>
                </div>
              </div>

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
      {/* VIEW MODE 6: PAYROLL RUNS                                           */}
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
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 cursor-pointer text-[11px] transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Need help?
                </button>
                <div className="relative cursor-pointer text-slate-600 hover:text-indigo-600 transition-colors" onClick={() => setShowNotificationsModal(true)} title="View Notifications">
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-black leading-none">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </div>
                <div 
                  onClick={() => setShowProfileModal(true)}
                  className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all" 
                  title="User Profile - Sarah Mitchell"
                >
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
                    Payroll Runs
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  Create, run and manage payroll for drivers and staff. Review, approve and export.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
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
                          📊 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💳 Payments &amp; Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💵 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          👥 Payroll Runs
                        </button>
                        <button onClick={() => { setViewMode('receivables'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📈 Accounts Receivable
                        </button>
                        <button onClick={() => { setViewMode('reports'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💰 Financial Reports
                        </button>
                        <button onClick={() => { setViewMode('accountant'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          🏛️ Accountant Export
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
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Payroll', status: 'Pending' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create Payroll Run
                  </button>
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Payroll', status: 'Completed' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Import Timesheets
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
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
                            📊 Finance Dashboard
                          </button>
                          <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            📄 Invoices List
                          </button>
                          <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            💳 Payments & Receipts
                          </button>
                          <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                            💵 Expenses
                          </button>
                          <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                            👥 Payroll Runs
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$0.00</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">$0.00</div>
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

              <div className="relative inline-flex items-center shrink-0">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-800 font-extrabold">{dateRange.startDate}</span>
                  <span className="text-slate-400 font-normal mx-0.5">&ndash;</span>
                  <span className="text-slate-800 font-extrabold">{dateRange.endDate}</span>
                </div>

                {/* Start Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.startDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, startDate: e.target.value });
                      triggerToast(`Start Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute left-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select Start Date"
                />

                {/* End Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.endDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, endDate: e.target.value });
                      triggerToast(`End Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute right-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select End Date"
                />
              </div>

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
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black">{payrollList.length}</span>
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
                      {(payrollList.filter(item => {
                          const matchSearch = !paySearchQuery || item.name.toLowerCase().includes(paySearchQuery.toLowerCase()) ||
                                              item.branch.toLowerCase().includes(paySearchQuery.toLowerCase()) ||
                                              item.user.toLowerCase().includes(paySearchQuery.toLowerCase());
                          const matchBranch = paySelectedBranch === 'All Branches' || item.branch === paySelectedBranch;
                          const matchType = paySelectedType === 'All Pay Types' || item.type === paySelectedType;
                          const matchStatus = paySelectedStatus === 'All Status' || item.status === paySelectedStatus;
                          return matchSearch && matchBranch && matchType && matchStatus;
                        })).map((pay, idx) => (
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
                           <td className="py-3 px-4 text-right relative">
                             <button
                               onClick={(e) => { e.stopPropagation(); setPayRunMenuIndex(payRunMenuIndex === idx ? null : idx); }}
                               className={`p-1.5 rounded-lg transition-colors cursor-pointer ${payRunMenuIndex === idx ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                             >
                               <MoreVertical className="w-4 h-4" />
                             </button>

                             {payRunMenuIndex === idx && (
                               <>
                                 <div className="fixed inset-0 z-40" onClick={() => setPayRunMenuIndex(null)} />
                                 <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 flex flex-col gap-0.5 text-xs font-semibold text-slate-700 text-left">
                                   <button
                                     onClick={() => { setViewPayrollModal(pay); setPayRunMenuIndex(null); }}
                                     className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-left w-full cursor-pointer"
                                   >
                                     👁️ View Details
                                   </button>
                                   <button
                                     onClick={() => { setEditPayrollModal({ ...pay, index: idx }); setPayRunMenuIndex(null); }}
                                     className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-left w-full cursor-pointer"
                                   >
                                     ✏️ Edit Record
                                   </button>
                                   <div className="h-px bg-slate-100 my-1" />
                                   <button
                                     onClick={() => {
                                       const realIdx = payrollList.indexOf(pay);
                                       setPayrollList(prev => prev.filter((_, i) => i !== realIdx));
                                       triggerToast(`Payroll run "${pay.name}" removed`);
                                       setPayRunMenuIndex(null);
                                     }}
                                     className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 text-left w-full cursor-pointer"
                                   >
                                     ❌ Delete Record
                                   </button>
                                 </div>
                               </>
                             )}
                           </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px] font-semibold bg-slate-50/50">
                  <span>Showing {payrollList.length === 0 ? 0 : 1} to {payrollList.length} of {payrollList.length} payroll runs</span>
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
                          <span>{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"} <span className="text-slate-400 font-normal">(100%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '62.3%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Staff Salaries</span>
                          <span>$0.00 <span className="text-slate-400 font-normal">(0%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '27.1%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Allowances</span>
                          <span>$0.00 <span className="text-slate-400 font-normal">(0%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '5.2%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Deductions</span>
                          <span>$0.00 <span className="text-slate-400 font-normal">(0%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: '1.5%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Overtime</span>
                          <span>$0.00 <span className="text-slate-400 font-normal">(0%)</span></span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: '2.1%' }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700">
                          <span>Other</span>
                          <span>$0.00 <span className="text-slate-400 font-normal">(0%)</span></span>
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

                {/* Donut Chart - centered */}
                <div className="flex justify-center pt-1">
                  <div className="relative w-32 h-32 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                      {/* Driver Wages (62.3%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="4.2" strokeDasharray="62.3 37.7" strokeDashoffset="25" />
                      {/* Staff Salaries (27.1%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray="27.1 72.9" strokeDashoffset="-37.3" />
                      {/* Allowances (5.2%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="5.2 94.8" strokeDashoffset="-64.4" />
                      {/* Superannuation (3.8%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="3.8 96.2" strokeDashoffset="-69.6" />
                      {/* Other Deductions (1.5%) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="4.2" strokeDasharray="1.5 98.5" strokeDashoffset="-73.4" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[11px] font-black text-slate-800 leading-tight">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total</span>
                    </div>
                  </div>
                </div>

                {/* Legend - clean rows */}
                <div className="space-y-2">
                  {[
                    { color: 'bg-[#8b5cf6]', name: 'Driver Wages',     amount: '$148,200', pct: '62.3%' },
                    { color: 'bg-[#3b82f6]', name: 'Staff Salaries',   amount: '$64,500',  pct: '27.1%' },
                    { color: 'bg-[#10b981]', name: 'Allowances',       amount: '$12,340',  pct: '5.2%'  },
                    { color: 'bg-[#f59e0b]', name: 'Superannuation',   amount: '$9,120',   pct: '3.8%'  },
                    { color: 'bg-[#ef4444]', name: 'Other Deductions', amount: '$3,520',   pct: '1.5%'  },
                    { color: 'bg-slate-400', name: 'Tax Payable',      amount: '$0.00',    pct: '0%'    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                        <span className="text-[11px] font-bold text-slate-700 truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-black font-mono text-slate-900">{item.amount}</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-md px-1.5 py-0.5 whitespace-nowrap">{item.pct}</span>
                      </div>
                    </div>
                  ))}
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
                      <span className="font-mono text-slate-600">0 (0%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: '8.3%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Pending Approval</span>
                      <span className="font-mono text-slate-600">0 (0%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: '5.6%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Approved</span>
                      <span className="font-mono text-slate-600">0 (0%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#10b981] rounded-full" style={{ width: '13.9%' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span>Paid</span>
                      <span className="font-mono text-slate-600">{payrollList.length} (100%)</span>
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

          
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 7: ACCOUNTS RECEIVABLE & OVERDUE INVOICES                  */}
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
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 cursor-pointer text-[11px] transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Need help?
                </button>
                <div className="relative cursor-pointer text-slate-600 hover:text-indigo-600 transition-colors" onClick={() => setShowNotificationsModal(true)} title="View Notifications">
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-black leading-none">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </div>
                <div 
                  onClick={() => setShowProfileModal(true)}
                  className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all" 
                  title="User Profile - Sarah Mitchell"
                >
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
                    Accounts Receivable &amp; Overdue Invoices
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  Monitor outstanding receivables, ageing, overdue invoices and client payment performance.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
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
                          📊 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💳 Payments &amp; Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💵 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          👥 Payroll Runs
                        </button>
                        <button onClick={() => { setViewMode('receivables'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          📈 Accounts Receivable
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
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" /> Export
                  </button>
                  <button 
                    onClick={() => setShowSendRemindersModal(true)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${((financeStats.totalOutstanding || 0) + (financeStats.totalOverdue || 0)).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalOverdue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? (financeStats.overdueCount || 0) : 0}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalOutstanding || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">14 Days</div>
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

              {/* Dual Start & End Date Picker */}
              <div className="relative inline-flex items-center shrink-0">
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                  {/* Start Date */}
                  <div className="relative">
                    <span
                      className="cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => document.getElementById('rec-start-date').showPicker?.()}
                    >
                      {new Date(dateRange.startDate + 'T00:00:00').toLocaleDateString('en-AU', { day:'2-digit', month:'short', year:'numeric' })}
                    </span>
                    <input
                      id="rec-start-date"
                      type="date"
                      value={dateRange.startDate}
                      max={dateRange.endDate}
                      onChange={e => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="absolute inset-0 opacity-0 w-full cursor-pointer"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>

                  <span className="text-slate-300 mx-0.5">–</span>

                  {/* End Date */}
                  <div className="relative">
                    <span
                      className="cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => document.getElementById('rec-end-date').showPicker?.()}
                    >
                      {new Date(dateRange.endDate + 'T00:00:00').toLocaleDateString('en-AU', { day:'2-digit', month:'short', year:'numeric' })}
                    </span>
                    <input
                      id="rec-end-date"
                      type="date"
                      value={dateRange.endDate}
                      min={dateRange.startDate}
                      onChange={e => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="absolute inset-0 opacity-0 w-full cursor-pointer"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>
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
                        <span className="text-[13px] font-black text-slate-900 tracking-tight">{financeStats ? `${((financeStats.totalOutstanding || 0) + (financeStats.totalOverdue || 0)).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                        <span className="text-[9px] font-bold text-slate-400">Total</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-slate-600">Current (0-30 days)</span>
                        <span className="text-slate-900 font-mono ml-auto">{financeStats ? `${(financeStats.totalOutstanding || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (100%)` : "$0.00 (0%)"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-slate-600">31-60 days</span>
                        <span className="text-slate-900 font-mono ml-auto">{financeStats ? `${(financeStats.totalOverdue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00 (0%)"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                        <span className="text-slate-600">61-90 days</span>
                        <span className="text-slate-900 font-mono ml-auto">$0.00 (0%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                        <span className="text-slate-600">90+ days</span>
                        <span className="text-slate-900 font-mono ml-auto">$0.00 (0%)</span>
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
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full">{financeStats ? (financeStats.overdueCount || 0) : 0}</span>
                  </div>
                  <button onClick={() => triggerToast('Opening Overdue Invoices detailed report')} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                    View Report &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
                  <table className="w-full text-left border-collapse min-w-[700px] whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        <th className="py-2.5 px-3 whitespace-nowrap">Invoice No.</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Customer</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Invoice Date</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Due Date</th>
                        <th className="py-2.5 px-3 text-center whitespace-nowrap">Days Overdue</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Amount (Inc GST)</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                        <th className="py-2.5 px-3 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      {(overdueList
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
                           <td className="py-3 px-3 text-right relative">
                             <button
                               onClick={(e) => { e.stopPropagation(); setOvdMenuIndex(ovdMenuIndex === idx ? null : idx); }}
                               className={`p-1.5 rounded-lg transition-colors cursor-pointer ${ovdMenuIndex === idx ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                             >
                               <MoreVertical className="w-4 h-4" />
                             </button>

                             {ovdMenuIndex === idx && (
                               <>
                                 <div className="fixed inset-0 z-40" onClick={() => setOvdMenuIndex(null)} />
                                 <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 flex flex-col gap-0.5 text-xs font-semibold text-slate-700 text-left">
                                   <button
                                     onClick={() => { setViewOverdueModal(inv); setOvdMenuIndex(null); }}
                                     className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-left w-full cursor-pointer"
                                   >
                                     👁️ View Details
                                   </button>
                                   <button
                                     onClick={() => { setEditOverdueModal({ ...inv, index: idx }); setOvdMenuIndex(null); }}
                                     className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-left w-full cursor-pointer"
                                   >
                                     ✏️ Edit Record
                                   </button>
                                   <div className="h-px bg-slate-100 my-1" />
                                   <button
                                     onClick={() => {
                                       const realIdx = overdueList.indexOf(inv);
                                       setOverdueList(prev => prev.filter((_, i) => i !== realIdx));
                                       triggerToast(`Invoice ${inv.id} removed`);
                                       setOvdMenuIndex(null);
                                     }}
                                     className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 text-left w-full cursor-pointer"
                                   >
                                     ❌ Delete Record
                                   </button>
                                 </div>
                               </>
                             )}
                           </td>
                         </tr>
                       )))
                      }
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Pagination */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
                  <span>Showing {overdueList.length === 0 ? 0 : 1} to {overdueList.length} of {overdueList.length} overdue invoices</span>
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
                        { customer: 'General Customer', amount: '$0.00', percentage: '0%' },
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
                        <td className="py-2.5 font-mono">$0.00</td>
                        <td className="py-2.5 text-right font-mono">0%</td>
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
                      <span className="font-mono text-slate-900">{financeStats ? `${(financeStats.totalOverdue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-rose-600 font-black">
                    <span>Total Overdue</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono">24</span>
                      <span className="font-mono text-sm">{financeStats ? `${(financeStats.totalOverdue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 8: PROFIT & LOSS / FINANCIAL REPORTS                       */}
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
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 cursor-pointer text-[11px] transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Need help?
                </button>
                <div className="relative cursor-pointer text-slate-600 hover:text-indigo-600 transition-colors" onClick={() => setShowNotificationsModal(true)} title="View Notifications">
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-black leading-none">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </div>
                <div 
                  onClick={() => setShowProfileModal(true)}
                  className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all" 
                  title="User Profile - Sarah Mitchell"
                >
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
                    Profit &amp; Loss / Financial Reports
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  Analyse company profitability, track financial performance and generate key reports.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
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
                          📊 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💳 Payments &amp; Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💵 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          👥 Payroll Runs
                        </button>
                        <button onClick={() => { setViewMode('receivables'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📈 Accounts Receivable
                        </button>
                        <button onClick={() => { setViewMode('reports'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          💰 Financial Reports
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
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" /> Export
                  </button>
                  <button 
                    onClick={() => setShowScheduleReportModal(true)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.netProfit || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalRevenue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats ? `${(financeStats.netProfit || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">{financeStats && financeStats.totalRevenue > 0 ? `${((financeStats.netProfit / financeStats.totalRevenue)*100).toFixed(1)}%` : "0%"}</div>
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

              <div className="relative inline-flex items-center shrink-0">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-800 font-extrabold">{dateRange.startDate}</span>
                  <span className="text-slate-400 font-normal mx-0.5">&ndash;</span>
                  <span className="text-slate-800 font-extrabold">{dateRange.endDate}</span>
                </div>

                {/* Start Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.startDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, startDate: e.target.value });
                      triggerToast(`Start Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute left-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select Start Date"
                />

                {/* End Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.endDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, endDate: e.target.value });
                      triggerToast(`End Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute right-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select End Date"
                />
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
                    <span className="font-mono text-slate-900">{financeStats ? `${(financeStats.totalRevenue || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500">Cost of Sales</span>
                    <span className="font-mono text-slate-500">-$0.00</span>
                  </div>
                  <div className="flex justify-between border-t border-b border-slate-100 py-1.5 font-extrabold">
                    <span>Gross Profit</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-900">{financeStats ? `${(financeStats.netProfit || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                      <span className="text-emerald-600 font-mono text-[11px]">{financeStats && financeStats.totalRevenue > 0 ? `${((financeStats.netProfit / financeStats.totalRevenue)*100).toFixed(0)}%` : "0%"}</span>
                    </div>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500">Operating Expenses</span>
                    <span className="font-mono text-slate-500">{financeStats ? `-${(financeStats.totalExpenses || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-$0.00"}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500">Other Income</span>
                    <span className="font-mono text-slate-500">$0.00</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500">Other Expenses</span>
                    <span className="font-mono text-slate-500">-$0.00</span>
                  </div>
                  <div className="flex justify-between border-t-2 border-slate-900 pt-2 font-black text-sm">
                    <span>Net Profit</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-900">{financeStats ? `${(financeStats.netProfit || 0).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}</span>
                      <span className="text-emerald-600 font-mono text-xs">{financeStats && financeStats.totalRevenue > 0 ? `${((financeStats.netProfit / financeStats.totalRevenue)*100).toFixed(0)}%` : "0%"}</span>
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

              <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
                <table className="w-full text-left text-xs font-bold text-slate-700 min-w-[560px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="pb-2.5 pr-3 whitespace-nowrap">Category</th>
                      <th className="pb-2.5 px-2 text-right whitespace-nowrap">Revenue</th>
                      <th className="pb-2.5 px-2 text-right whitespace-nowrap">%</th>
                      <th className="pb-2.5 px-2 text-right whitespace-nowrap">Expenses</th>
                      <th className="pb-2.5 px-2 text-right whitespace-nowrap">%</th>
                      <th className="pb-2.5 px-2 text-right whitespace-nowrap">Net Profit</th>
                      <th className="pb-2.5 pl-2 text-right whitespace-nowrap">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { cat: 'Freight Income', rev: '$612,340', revP: '72.7%', exp: '$145,210', expP: '56.7%', net: '$467,130', margin: '76.3%' },
                      { cat: 'Fuel Surcharge', rev: '$86,750', revP: '%', exp: '$12,860', expP: '5.0%', net: '$73,890', margin: '85.2%' },
                      { cat: 'Storage Income', rev: '$42,560', revP: '5.1%', exp: '$8,320', expP: '3.2%', net: '$34,240', margin: '80.5%' },
                      { cat: 'Other Income', rev: '$101,000', revP: '12.0%', exp: '$29,050', expP: '11.3%', net: '$71,950', margin: '71.2%' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 pr-3 text-slate-900 font-extrabold text-xs whitespace-nowrap">{row.cat}</td>
                        <td className="py-3 px-2 text-right font-mono text-slate-800 text-[11px] whitespace-nowrap">{row.rev}</td>
                        <td className="py-3 px-2 text-right font-mono text-slate-400 text-[10px] whitespace-nowrap">{row.revP}</td>
                        <td className="py-3 px-2 text-right font-mono text-slate-800 text-[11px] whitespace-nowrap">{row.exp}</td>
                        <td className="py-3 px-2 text-right font-mono text-slate-400 text-[10px] whitespace-nowrap">{row.expP}</td>
                        <td className="py-3 px-2 text-right font-mono font-black text-slate-900 text-[11px] whitespace-nowrap">{row.net}</td>
                        <td className="py-3 pl-2 text-right font-mono font-extrabold text-emerald-600 text-[11px] whitespace-nowrap">{row.margin}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50/90 font-black text-slate-900 border-t-2 border-slate-200 text-xs">
                      <td className="py-3 pr-3 whitespace-nowrap">Total</td>
                      <td className="py-3 px-2 text-right font-mono whitespace-nowrap">$842,650</td>
                      <td className="py-3 px-2 text-right font-mono text-slate-500 text-[10px] whitespace-nowrap">100%</td>
                      <td className="py-3 px-2 text-right font-mono whitespace-nowrap">$195,440</td>
                      <td className="py-3 px-2 text-right font-mono text-slate-500 text-[10px] whitespace-nowrap">100%</td>
                      <td className="py-3 px-2 text-right font-mono font-black text-indigo-700 whitespace-nowrap">$647,210</td>
                      <td className="py-3 pl-2 text-right font-mono font-black text-emerald-600 whitespace-nowrap">76.7%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Middle 4 Cols: EXPENSES BREAKDOWN (MTD) DONUT */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EXPENSES BREAKDOWN (MTD)</h3>
                <button onClick={() => triggerToast('Opening Expenses breakdown report')} className="text-indigo-600 hover:text-indigo-800 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer">
                  View Report &rarr;
                </button>
              </div>

              {/* Donut Chart - centered */}
              <div className="flex justify-center pt-1">
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
              </div>

              {/* Legend - clean rows */}
              <div className="space-y-2 pt-1">
                {[
                  { color: 'bg-indigo-600', name: 'Driver Wages', amount: '$108,650', pct: '42.3%' },
                  { color: 'bg-blue-500',   name: 'Fuel',         amount: '$56,420',  pct: '22.0%' },
                  { color: 'bg-emerald-500',name: 'Maintenance',  amount: '$32,670',  pct: '12.7%' },
                  { color: 'bg-amber-500',  name: 'Repairs',      amount: '$21,850',  pct: '8.5%'  },
                  { color: 'bg-rose-500',   name: 'Other Expenses',amount: '$36,840', pct: '14.5%' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                      <span className="text-[11px] font-bold text-slate-700 truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] font-black font-mono text-slate-900">{item.amount}</span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-md px-1.5 py-0.5 whitespace-nowrap">{item.pct}</span>
                    </div>
                  </div>
                ))}
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

          
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 9: ACCOUNTANT EXPORT & INTEGRATION                         */}
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
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 cursor-pointer text-[11px] transition-colors">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Need help?
                </button>
                <div className="relative cursor-pointer text-slate-600 hover:text-indigo-600 transition-colors" onClick={() => setShowNotificationsModal(true)} title="View Notifications">
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-black leading-none">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </div>
                <div 
                  onClick={() => setShowProfileModal(true)}
                  className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all" 
                  title="User Profile - Sarah Mitchell"
                >
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
                    Accountant Export &amp; Integration
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs font-medium leading-normal">
                  Export financial data for your accountant and integrate with accounting systems.
                </p>
              </div>

              {/* Right Side: Actions Block */}
              <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
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
                          📊 Finance Dashboard
                        </button>
                        <button onClick={() => { setViewMode('invoices'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📄 Invoices List
                        </button>
                        <button onClick={() => { setViewMode('payments_receipts'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💳 Payments &amp; Receipts
                        </button>
                        <button onClick={() => { setViewMode('expenses'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💵 Expenses
                        </button>
                        <button onClick={() => { setViewMode('payroll'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          👥 Payroll Runs
                        </button>
                        <button onClick={() => { setViewMode('receivables'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          📈 Accounts Receivable
                        </button>
                        <button onClick={() => { setViewMode('reports'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5">
                          💰 Financial Reports
                        </button>
                        <button onClick={() => { setViewMode('accountant'); setShowMoreActions(false); }} className="w-full text-left px-4 py-3 md:py-2 hover:bg-slate-50 flex items-center gap-2.5 text-indigo-600">
                          🏛️ Accountant Export
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
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => setShowExportHistoryModal(true)}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer active:scale-95"
                  >
                    <History className="w-3.5 h-3.5 text-indigo-600" /> View Export History
                  </button>
                  <button 
                    onClick={() => { setTransactionForm({ type: 'Invoice', status: 'Completed' }); setShowAddTransactionModal(true); }}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-400" /> Create Custom Export
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
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
                <button onClick={() => setShowExportHistoryModal(true)} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 block cursor-pointer">
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">0</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">0</div>
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
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">0</div>
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

              <div className="relative inline-flex items-center shrink-0">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-800 font-extrabold">{dateRange.startDate}</span>
                  <span className="text-slate-400 font-normal mx-0.5">&ndash;</span>
                  <span className="text-slate-800 font-extrabold">{dateRange.endDate}</span>
                </div>

                {/* Start Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.startDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, startDate: e.target.value });
                      triggerToast(`Start Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute left-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select Start Date"
                />

                {/* End Date Click Overlay */}
                <input 
                  type="date" 
                  value={dateRange.endDate} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setDateRange({ ...dateRange, endDate: e.target.value });
                      triggerToast(`End Date updated to ${e.target.value}`);
                    }
                  }}
                  onClick={(e) => {
                    if (typeof e.target.showPicker === 'function') {
                      try { e.target.showPicker(); } catch (err) {}
                    }
                  }}
                  className="absolute right-0 top-0 bottom-0 w-[48%] opacity-0 cursor-pointer z-10"
                  title="Click to select End Date"
                />
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
                    <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full">{accExportList.length}</span>
                  </div>
                  <button onClick={() => setShowExportHistoryModal(true)} className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer">
                    View All &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
                  <table className="w-full text-left text-xs font-bold text-slate-700 min-w-[750px] whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                        <th className="pb-2 pr-3 whitespace-nowrap">Export Name</th>
                        <th className="pb-2 px-3 whitespace-nowrap">Type</th>
                        <th className="pb-2 px-3 whitespace-nowrap">Format</th>
                        <th className="pb-2 px-3 whitespace-nowrap">Period</th>
                        <th className="pb-2 px-3 whitespace-nowrap">Created On</th>
                        <th className="pb-2 px-3 whitespace-nowrap">Created By</th>
                        <th className="pb-2 px-3 whitespace-nowrap">Status</th>
                        <th className="pb-2 pl-3 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(accExportList.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 pr-3 text-slate-900 font-extrabold text-[11px] whitespace-nowrap">{row.name}</td>
                          <td className="py-2.5 px-3 text-slate-600 text-[10px] whitespace-nowrap">{row.type}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-xs ${row.fmt === 'PDF' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                              {row.fmt}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[10px] whitespace-nowrap">{row.period}</td>
                          <td className="py-2.5 px-3 text-slate-500 text-[10px] whitespace-nowrap">{row.date}</td>
                          <td className="py-2.5 px-3 text-slate-700 text-[10px] whitespace-nowrap">{row.by}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-2.5 pl-3 text-right whitespace-nowrap relative">
                            <button
                              onClick={(e) => { e.stopPropagation(); setAccMenuIndex(accMenuIndex === idx ? null : idx); }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${accMenuIndex === idx ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {accMenuIndex === idx && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setAccMenuIndex(null)} />
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 flex flex-col gap-0.5 text-xs font-semibold text-slate-700 text-left">
                                  <button
                                    onClick={() => { setViewExportModal(row); setAccMenuIndex(null); }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-left w-full cursor-pointer"
                                  >
                                    👁️ View Details
                                  </button>
                                  <button
                                    onClick={() => { setEditExportModal({ ...row, index: idx }); setAccMenuIndex(null); }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-left w-full cursor-pointer"
                                  >
                                    ✏️ Edit Record
                                  </button>
                                  <div className="h-px bg-slate-100 my-1" />
                                  <button
                                    onClick={() => {
                                      const realIdx = accExportList.indexOf(row);
                                      setAccExportList(prev => prev.filter((_, i) => i !== realIdx));
                                      triggerToast(`Export "${row.name}" removed`);
                                      setAccMenuIndex(null);
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 text-left w-full cursor-pointer"
                                  >
                                    ❌ Delete Record
                                  </button>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[10px] text-slate-400 font-bold">
                  <span>Showing {accExportList.length === 0 ? 0 : 1} to {accExportList.length} of {accExportList.length} exports</span>
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
              onSubmit={handleAddTransactionSubmit} 
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
                    <option value="Payroll Run">Payroll Run</option>
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
                <Download className="w-4 h-4 text-emerald-400" /> Export Financial Report
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-bold text-slate-700">
              <p className="text-slate-500 font-medium">Select file format to download the complete report data for Sydney Head Office:</p>

              <div className="space-y-2.5">
                <button 
                  onClick={() => handleExportDownload('csv')}
                  className="w-full p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-xl flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">📊 Export as CSV / Excel (.csv)</span>
                  <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Spreadsheet</span>
                </button>
                <button 
                  onClick={() => handleExportDownload('pdf')}
                  className="w-full p-3.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">📄 Export as PDF Document (.pdf)</span>
                  <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">PDF Document</span>
                </button>
                <button 
                  onClick={() => handleExportDownload('excel')}
                  className="w-full p-3.5 bg-slate-50 hover:bg-purple-50/60 border border-slate-200 hover:border-purple-300 rounded-xl flex items-center justify-between font-bold text-slate-800 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">📈 Export as XLSX Workbook (.xlsx)</span>
                  <span className="bg-purple-100 text-purple-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Excel File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Report Modal */}
      {showScheduleReportModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowScheduleReportModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
        >
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-left my-auto border border-slate-200">
            <div className="px-6 py-5 bg-[#4B0082] text-white flex justify-between items-center">
              <h3 className="text-base font-black flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-300" /> Schedule Automated Report
              </h3>
              <button onClick={() => setShowScheduleReportModal(false)} className="text-white/70 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleReportSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">REPORT TYPE *</label>
                <select 
                  value={scheduleForm.reportName}
                  onChange={e => setScheduleForm({ ...scheduleForm, reportName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 bg-slate-50 cursor-pointer"
                >
                  <option value="Profit & Loss / Financial Reports">Profit & Loss Statement</option>
                  <option value="Accounts Receivable Ageing Summary">Accounts Receivable Ageing Summary</option>
                  <option value="Cash Flow Statement & Summary">Cash Flow Statement & Summary</option>
                  <option value="General Ledger Audit Report">General Ledger Audit Report</option>
                  <option value="Payroll Summary & Payslips Batch">Payroll Summary & Payslips Batch</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">FREQUENCY *</label>
                  <select 
                    value={scheduleForm.frequency}
                    onChange={e => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 bg-slate-50 cursor-pointer"
                  >
                    <option value="Daily (End of Day)">Daily (End of Day)</option>
                    <option value="Weekly (Every Monday)">Weekly (Every Monday)</option>
                    <option value="Monthly (1st of month)">Monthly (1st of month)</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">FILE FORMAT</label>
                  <select 
                    value={scheduleForm.format}
                    onChange={e => setScheduleForm({ ...scheduleForm, format: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 bg-slate-50 cursor-pointer"
                  >
                    <option value="PDF Document">PDF Document</option>
                    <option value="CSV Excel">CSV Excel</option>
                    <option value="XLSX Workbook">XLSX Workbook</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">RECIPIENT EMAIL *</label>
                <input 
                  type="email" 
                  required
                  value={scheduleForm.recipientEmail}
                  onChange={e => setScheduleForm({ ...scheduleForm, recipientEmail: e.target.value })}
                  placeholder="finance@herologistics.com.au"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">DELIVERY TIME</label>
                <input 
                  type="text" 
                  value={scheduleForm.deliveryTime}
                  onChange={e => setScheduleForm({ ...scheduleForm, deliveryTime: e.target.value })}
                  placeholder="08:00 AM AEST"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 bg-slate-50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowScheduleReportModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" /> Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Audit History Modal */}
      {showExportHistoryModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowExportHistoryModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
        >
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col text-left my-auto border border-slate-200">
            <div className="px-6 py-5 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-base font-black flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" /> Financial Export Audit History
              </h3>
              <button onClick={() => setShowExportHistoryModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-bold text-slate-700 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 font-medium">Recent exported financial statements and data packages:</p>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-full border border-indigo-100">8 Files Recorded</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'May 2025 - Profit & Loss Statement', format: 'PDF', period: 'May 2025', date: '24 May 2025 10:32 AM', by: 'Sarah Mitchell', size: '1.4 MB', status: 'Completed' },
                  { name: 'May 2025 - Balance Sheet Statement', format: 'PDF', period: 'May 2025', date: '24 May 2025 10:32 AM', by: 'Sarah Mitchell', size: '980 KB', status: 'Completed' },
                  { name: 'May 2025 - General Ledger Export', format: 'CSV', period: 'May 2025', date: '24 May 2025 10:32 AM', by: 'Sarah Mitchell', size: '4.2 MB', status: 'Completed' },
                  { name: 'May 2025 - Accounts Receivable Ageing', format: 'CSV', period: 'May 2025', date: '23 May 2025 04:15 PM', by: 'James Driver', size: '850 KB', status: 'Completed' },
                  { name: 'May 2025 - Accounts Payable Ledger', format: 'CSV', period: 'May 2025', date: '23 May 2025 04:14 PM', by: 'James Driver', size: '720 KB', status: 'Completed' },
                  { name: 'Apr-May 2025 - Bank Reconciliation File', format: 'XLSX', period: 'Apr-May 2025', date: '22 May 2025 09:20 AM', by: 'Sarah Mitchell', size: '2.1 MB', status: 'Completed' },
                  { name: 'May 2025 - BAS Tax Summary Package', format: 'PDF', period: 'May 2025', date: '20 May 2025 11:05 AM', by: 'Sarah Mitchell', size: '1.1 MB', status: 'Failed' },
                  { name: 'May 2025 - Cash Flow Statement', format: 'PDF', period: 'May 2025', date: '19 May 2025 03:40 PM', by: 'James Driver', size: '640 KB', status: 'Completed' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${item.format === 'PDF' ? 'bg-rose-100 text-rose-700' : (item.format === 'CSV' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700')}`}>
                          {item.format}
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs">{item.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-3">
                        <span>📅 {item.date}</span>
                        <span>👤 {item.by}</span>
                        <span>📦 {item.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        {item.status}
                      </span>
                      <button 
                        onClick={() => handleExportDownload(item.format.toLowerCase())}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 rounded-xl text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs font-bold">
              <span className="text-slate-400 text-[10px]">Showing 8 audit records</span>
              <button 
                onClick={() => setShowExportHistoryModal(false)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Need Help Modal */}
      {showHelpModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowHelpModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
        >
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-left my-auto border border-slate-200">
            <div className="px-6 py-5 bg-[#4B0082] text-white flex justify-between items-center">
              <h3 className="text-base font-black flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-300" /> Finance Help &amp; Knowledge Support
              </h3>
              <button onClick={() => setShowHelpModal(false)} className="text-white/70 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-bold text-slate-700 max-h-[70vh] overflow-y-auto">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search FAQs, how-to guides, invoice help..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FREQUENTLY ASKED QUESTIONS</h4>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <p className="font-extrabold text-slate-900 text-xs">How do I create and send a tax invoice?</p>
                  <p className="text-[11px] text-slate-500 font-normal leading-relaxed">Navigate to Invoices List and click "+ Add Invoice". Fill in customer, load reference, and amount. Click "Create Transaction" to send automatically.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <p className="font-extrabold text-slate-900 text-xs">How to schedule automated financial reports?</p>
                  <p className="text-[11px] text-slate-500 font-normal leading-relaxed">Go to Financial Reports and click "Schedule Report". Choose daily, weekly, or monthly delivery to your accountant's email.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <p className="font-extrabold text-slate-900 text-xs">How to export data for Xero / MYOB integration?</p>
                  <p className="text-[11px] text-slate-500 font-normal leading-relaxed">Go to Accountant Export &amp; Integration. You can download CSV/Excel general ledgers or click "Sync Bank Feed" for live sync.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-slate-900 font-extrabold text-xs">Still need assistance?</span>
                  <span className="text-[10px] text-slate-400 font-normal">Our dedicated finance desk is online AEST.</span>
                </div>
                <button 
                  onClick={() => { setShowHelpModal(false); triggerToast('Connected to live support desk agent!'); }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm"
                >
                  Chat Support Live &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer Modal */}
      {showNotificationsModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowNotificationsModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
        >
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-left my-auto border border-slate-200">
            <div className="px-6 py-5 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black">Finance Alerts &amp; Notifications</h3>
              </div>
              <button onClick={() => setShowNotificationsModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs font-bold text-slate-700 max-h-[65vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UNREAD ALERTS ({unreadNotificationsCount})</span>
                {unreadNotificationsCount > 0 && (
                  <button 
                    onClick={() => { setUnreadNotificationsCount(0); triggerToast('All notifications marked as read!'); }}
                    className="text-[10px] text-indigo-600 font-extrabold hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Overdue Invoices Alert', desc: '3 Invoices totaling $28,450 are 7+ days overdue.', time: '10m ago', icon: '🚨' },
                  { title: 'Payroll Run Due', desc: 'Weekly Driver Payroll Run due in 2 days.', time: '1h ago', icon: '👥' },
                  { title: 'Bank Feed Synced', desc: 'Xero bank feeds reconciled with 14 new transactions.', time: '2h ago', icon: '🔄' },
                  { title: 'Financial Report Generated', desc: 'May 2025 P&L Statement export is ready.', time: '4h ago', icon: '📊' },
                  { title: 'Large Payment Received', desc: '$18,200 payment received from Toyota Fortitude Valley.', time: '1d ago', icon: '💳' },
                ].map((notif, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-start gap-3 transition-colors">
                    <span className="text-base shrink-0">{notif.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h5 className="font-extrabold text-slate-900 text-xs">{notif.title}</h5>
                        <span className="text-[9px] text-slate-400 font-medium">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal leading-tight">{notif.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs font-bold">
              <span className="text-slate-400 text-[10px]">Real-time system notification stream</span>
              <button 
                onClick={() => setShowNotificationsModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Close Alerts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showProfileModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowProfileModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
        >
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col text-left my-auto border border-slate-200">
            <div className="p-6 bg-slate-900 text-white text-center relative">
              <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 rounded-full bg-indigo-600 text-white text-xl font-black flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-white/10">
                SM
              </div>
              <h3 className="text-base font-black leading-tight">Sarah Mitchell</h3>
              <p className="text-indigo-300 text-xs font-bold">Chief Financial Officer (CFO)</p>
              <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase mt-2">
                Company Admin Access
              </span>
            </div>

            <div className="p-5 space-y-3 text-xs font-bold text-slate-700">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Branch Location:</span>
                  <span className="text-slate-900 font-bold">Sydney Head Office</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Email Address:</span>
                  <span className="text-slate-900 font-bold">sarah.m@herologistics.com.au</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Active Session:</span>
                  <span className="text-emerald-600 font-bold">Authenticated (AEST)</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <button 
                  onClick={() => { setShowProfileModal(false); triggerToast('Account Settings opened!'); }}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>⚙️ Account Settings &amp; Security</span>
                  <span>&rarr;</span>
                </button>
                <button 
                  onClick={() => { setShowProfileModal(false); triggerToast('Role switched to Auditor Mode'); }}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>🔐 Switch Role / View Mode</span>
                  <span>&rarr;</span>
                </button>
              </div>

              <button 
                onClick={() => { setShowProfileModal(false); triggerToast('Logged out of Company Admin profile'); }}
                className="w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl font-extrabold text-xs transition-colors cursor-pointer text-center mt-2"
              >
                Sign Out of Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row Actions Menu Modal (For 3-dots ⋮ click) */}
      {showRowActionsModal && selectedRowItem && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowRowActionsModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
        >
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col text-left my-auto border border-slate-200">
            <div className="px-6 py-5 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div>
                <h3 className="text-base font-black">{selectedRowItem.id || selectedRowItem.name}</h3>
                <p className="text-slate-400 text-xs font-semibold">{selectedRowItem.customer || selectedRowItem.type || 'Item Action Options'}</p>
              </div>
              <button onClick={() => setShowRowActionsModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-2 text-xs font-bold text-slate-700">
              <button 
                onClick={() => { 
                  setShowRowActionsModal(false); 
                  handleOpenInvoiceDetail(selectedRowItem);
                }}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left font-bold text-slate-800 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-indigo-600" />
                <div>
                  <span className="block text-slate-900 font-extrabold">Open Full Details Page</span>
                  <span className="text-[10px] text-slate-400 font-normal">View breakdown &amp; line items</span>
                </div>
              </button>

              <button 
                onClick={() => { 
                  setShowRowActionsModal(false); 
                  setSelectedInvoice(selectedRowItem); 
                }}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left font-bold text-slate-800 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-purple-600" />
                <div>
                  <span className="block text-slate-900 font-extrabold">Quick Preview Pop-up</span>
                  <span className="text-[10px] text-slate-400 font-normal">Fast modal summary</span>
                </div>
              </button>

              <button 
                onClick={() => { 
                  setShowRowActionsModal(false); 
                  handleExportDownload('pdf'); 
                }}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left font-bold text-slate-800 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="block text-slate-900 font-extrabold">Download PDF Document</span>
                  <span className="text-[10px] text-slate-400 font-normal">Save copy to computer</span>
                </div>
              </button>

              <button 
                onClick={() => { 
                  setShowRowActionsModal(false); 
                  triggerToast(`Payment reminder email sent to ${selectedRowItem.customer || 'client'}!`); 
                }}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left font-bold text-slate-800 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="block text-slate-900 font-extrabold">Send Email Reminder</span>
                  <span className="text-[10px] text-slate-400 font-normal">Remind client of overdue balance</span>
                </div>
              </button>

              <button 
                onClick={() => { 
                  setShowRowActionsModal(false); 
                  triggerToast(`Status for ${selectedRowItem.id || selectedRowItem.name} updated to PAID!`); 
                }}
                className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left font-bold text-emerald-900 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="block text-emerald-950 font-extrabold">Record Payment / Mark Paid</span>
                  <span className="text-[10px] text-emerald-700 font-medium">Clear from Accounts Receivable</span>
                </div>
              </button>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button 
                onClick={() => setShowRowActionsModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showRecordPaymentModal && activeInvoiceDetail && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowRecordPaymentModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
        >
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-left my-auto border border-slate-200">
            <div className="px-6 py-5 bg-[#2563eb] text-white flex justify-between items-center">
              <h3 className="text-base font-black flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-200" /> Record Payment &ndash; {activeInvoiceDetail.id}
              </h3>
              <button onClick={() => setShowRecordPaymentModal(false)} className="text-white/70 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                activeInvoiceDetail.status = 'Paid';
                setShowRecordPaymentModal(false);
                triggerToast(`Payment of ${paymentForm.amount} for ${activeInvoiceDetail.id} recorded successfully! Status updated to PAID.`);
              }}
              className="p-6 space-y-4 text-xs font-bold text-slate-700"
            >
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">CUSTOMER &amp; TOTAL</span>
                  <span className="font-extrabold text-slate-900 text-xs">{activeInvoiceDetail.customer}</span>
                </div>
                <span className="text-sm font-black font-mono text-emerald-600">{activeInvoiceDetail.amount}</span>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">PAYMENT AMOUNT ($) *</label>
                <input 
                  type="text"
                  required
                  value={paymentForm.amount || activeInvoiceDetail.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-extrabold text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">PAYMENT METHOD *</label>
                  <select 
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-900 font-bold focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Direct Bank Transfer (EFT)">Bank Transfer (EFT)</option>
                    <option value="EFTPOS / Credit Card">EFTPOS / Card</option>
                    <option value="Cheque Deposit">Cheque Deposit</option>
                    <option value="Cash Payment">Cash Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">PAYMENT DATE</label>
                  <input 
                    type="date"
                    value={paymentForm.date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">REFERENCE / TRANS #</label>
                <input 
                  type="text"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  placeholder="PAY-2025-0891"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowRecordPaymentModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Save &amp; Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Invoice Email Modal */}
      {showSendEmailModal && activeInvoiceDetail && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSendEmailModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
        >
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-left my-auto border border-slate-200">
            <div className="px-6 py-5 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-base font-black flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-400" /> Send Tax Invoice to Customer
              </h3>
              <button onClick={() => setShowSendEmailModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setShowSendEmailModal(false);
                triggerToast(`Tax invoice PDF sent to ${emailForm.to}!`);
              }}
              className="p-6 space-y-4 text-xs font-bold text-slate-700"
            >
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">RECIPIENT EMAIL ADDRESS *</label>
                <input 
                  type="email"
                  required
                  value={emailForm.to}
                  onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">SUBJECT LINE</label>
                <input 
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">MESSAGE BODY</label>
                <textarea 
                  rows="3"
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-indigo-600 resize-none"
                />
              </div>

              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-center gap-3 text-indigo-900">
                <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                <div className="min-w-0">
                  <span className="font-extrabold text-xs block truncate">{activeInvoiceDetail.id}.pdf</span>
                  <span className="text-[10px] text-indigo-500 font-medium">Attached PDF document (1.2 MB)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowSendEmailModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send Invoice Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credit Note Modal */}
      {showCreditNoteModal && activeInvoiceDetail && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreditNoteModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
        >
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-left my-auto border border-slate-200">
            <div className="px-6 py-5 bg-amber-600 text-white flex justify-between items-center">
              <h3 className="text-base font-black flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-200" /> Create Credit Note &ndash; {activeInvoiceDetail.id}
              </h3>
              <button onClick={() => setShowCreditNoteModal(false)} className="text-white/70 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setShowCreditNoteModal(false);
                triggerToast(`Credit Note for ${creditForm.amount} issued against ${activeInvoiceDetail.id}!`);
              }}
              className="p-6 space-y-4 text-xs font-bold text-slate-700"
            >
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">CREDIT AMOUNT ($) *</label>
                <input 
                  type="text"
                  required
                  value={creditForm.amount}
                  onChange={(e) => setCreditForm({ ...creditForm, amount: e.target.value })}
                  placeholder="$500.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-extrabold text-sm focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">REASON FOR CREDIT *</label>
                <select 
                  value={creditForm.reason}
                  onChange={(e) => setCreditForm({ ...creditForm, reason: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-900 font-bold focus:outline-none focus:border-amber-600 cursor-pointer"
                >
                  <option value="Overcharge / Freight Calculation Adjustment">Overcharge / Freight Adjustment</option>
                  <option value="Damaged Goods / Transit Claim">Damaged Goods / Transit Claim</option>
                  <option value="Goodwill Credit / Customer Loyalty">Goodwill Credit / Customer Loyalty</option>
                  <option value="Full Invoice Cancellation">Full Invoice Cancellation</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">INTERNAL NOTES</label>
                <textarea 
                  rows="2"
                  value={creditForm.notes}
                  onChange={(e) => setCreditForm({ ...creditForm, notes: e.target.value })}
                  placeholder="Approved by Finance Controller..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-amber-600 resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowCreditNoteModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" /> Issue Credit Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SEND REMINDERS MODAL ─────────────────────────────────────────────── */}
      {showSendRemindersModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: 'min(92vh, 680px)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 leading-tight">Send Payment Reminders</h2>
                  <p className="text-[10px] text-slate-400 font-medium">Email overdue clients about outstanding invoices</p>
                </div>
              </div>
              <button onClick={() => setShowSendRemindersModal(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">

              {/* Summary Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <div className="text-[11px] text-amber-700 font-medium leading-tight">
                  <span className="font-black text-amber-800">5 Overdue Clients Found</span> — Total: <span className="font-black">$42,750.00</span>. Reminders will be sent via email to selected clients.
                </div>
              </div>

              {/* Recipients label */}
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Recipients</div>

              {/* Client list */}
              <div className="space-y-1.5">
                {[
                  { name: 'Fast Freight Pty Ltd',   invoice: 'INV-2025-0178', amount: '$12,480.00', days: '18 days', email: 'accounts@fastfreight.com.au' },
                  { name: 'Metro Group Sydney',      invoice: 'INV-2025-0174', amount: '$9,240.00',  days: '24 days', email: 'finance@metrogroup.com.au' },
                  { name: 'ABC Wholesalers',         invoice: 'INV-2025-0168', amount: '$7,350.00',  days: '31 days', email: 'accounts@abcwholesalers.com.au' },
                  { name: 'Prime Car Carriers',      invoice: 'INV-2025-0155', amount: '$8,890.00',  days: '45 days', email: 'billing@primecarriers.com.au' },
                  { name: 'Coastal Transport Co.',   invoice: 'INV-2025-0149', amount: '$4,790.00',  days: '52 days', email: 'accounts@coastaltransport.com.au' },
                ].map((client, i) => (
                  <label key={i} className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                    <input type="checkbox" defaultChecked className="accent-indigo-600 w-3.5 h-3.5 shrink-0 cursor-pointer" />
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-900 text-[11px] leading-tight">{client.name}</div>
                        <div className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5">
                          {client.invoice} · <span className="text-amber-600 font-bold">{client.days} overdue</span> · {client.email}
                        </div>
                      </div>
                      <div className="font-black text-rose-600 text-[11px] shrink-0">{client.amount}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Reminder Template */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Reminder Template</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer">
                  <option>Friendly Reminder (1st Notice)</option>
                  <option>Second Notice – Action Required</option>
                  <option>Final Notice – Legal Action Pending</option>
                  <option>Custom Message</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-slate-100 flex justify-between items-center gap-3 bg-slate-50/70 shrink-0">
              <span className="text-[10px] text-slate-400 font-medium">5 recipients · Friendly Reminder</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSendRemindersModal(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setShowSendRemindersModal(false); triggerToast('✉️ Payment reminders sent to 5 overdue clients!'); }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5" /> Send Reminders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW PAYMENT DETAILS MODAL ───────────────────────────────────── */}
      {viewPaymentModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative border border-slate-200">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md uppercase tracking-wider">{viewPaymentModal.ref}</span>
                <h3 className="text-lg font-black text-slate-900 mt-2">Payment Details</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Received from {viewPaymentModal.customer}</p>
              </div>
              <button onClick={() => setViewPaymentModal(null)} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Amount</span>
                <span className="text-xs font-black text-emerald-600">{viewPaymentModal.amount}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Status</span>
                <span className="text-xs font-bold text-emerald-600">{viewPaymentModal.status}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Method</span>
                <span className="text-xs font-bold text-slate-900">{viewPaymentModal.method}</span>
              </div>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 text-xs mb-5">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Payment Reference:</span>
                <span className="font-bold text-slate-900 font-mono">{viewPaymentModal.ref}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Customer / Sender:</span>
                <span className="font-bold text-slate-900">{viewPaymentModal.customer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Invoice Reference:</span>
                <span className="font-bold text-indigo-600 font-mono">{viewPaymentModal.invoice}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Payment Date:</span>
                <span className="font-bold text-slate-900">{viewPaymentModal.date}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-semibold">Branch / Location:</span>
                <span className="font-bold text-slate-900">{viewPaymentModal.branch}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => { triggerToast(`Receipt PDF for ${viewPaymentModal.ref} downloaded`); setViewPaymentModal(null); }}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                📥 Download Receipt PDF
              </button>
              <button onClick={() => setViewPaymentModal(null)} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT PAYMENT DETAILS MODAL ───────────────────────────────────── */}
      {editPaymentModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative border border-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">Edit Payment Record</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Ref: {editPaymentModal.ref}</p>
              </div>
              <button onClick={() => setEditPaymentModal(null)} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPaymentsList(prev => prev.map((item, i) => i === editPaymentModal.index ? editPaymentModal : item));
                triggerToast('Payment Record Updated', `Saved changes for ${editPaymentModal.ref}`);
                setEditPaymentModal(null);
              }}
              className="space-y-4 text-xs font-semibold text-slate-700 text-left"
            >
              <div>
                <label className="block text-slate-500 font-bold mb-1">Customer / Sender</label>
                <input
                  type="text"
                  value={editPaymentModal.customer}
                  onChange={(e) => setEditPaymentModal({ ...editPaymentModal, customer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Payment Reference</label>
                  <input
                    type="text"
                    value={editPaymentModal.ref}
                    onChange={(e) => setEditPaymentModal({ ...editPaymentModal, ref: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={editPaymentModal.invoice}
                    onChange={(e) => setEditPaymentModal({ ...editPaymentModal, invoice: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Amount (Inc GST)</label>
                  <input
                    type="text"
                    value={editPaymentModal.amount}
                    onChange={(e) => setEditPaymentModal({ ...editPaymentModal, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Payment Method</label>
                  <select
                    value={editPaymentModal.method}
                    onChange={(e) => setEditPaymentModal({ ...editPaymentModal, method: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-900 bg-white"
                  >
                    <option>Bank Transfer</option>
                    <option>EFTPOS</option>
                    <option>Credit Card</option>
                    <option>Cheque</option>
                    <option>Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Payment Date</label>
                  <input
                    type="text"
                    value={editPaymentModal.date}
                    onChange={(e) => setEditPaymentModal({ ...editPaymentModal, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Branch / Location</label>
                  <select
                    value={editPaymentModal.branch}
                    onChange={(e) => setEditPaymentModal({ ...editPaymentModal, branch: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-900 bg-white"
                  >
                    <option>Sydney Head Office</option>
                    <option>Melbourne Depot</option>
                    <option>Brisbane Hub</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditPaymentModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VIEW RECEIPT DETAILS MODAL ───────────────────────────────────── */}
      {viewReceiptModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative border border-slate-200">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md uppercase tracking-wider">{viewReceiptModal.ref}</span>
                <h3 className="text-lg font-black text-slate-900 mt-2">Receipt Details</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Issued to {viewReceiptModal.customer}</p>
              </div>
              <button onClick={() => setViewReceiptModal(null)} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Amount</span>
                <span className="text-xs font-black text-blue-600">{viewReceiptModal.amount}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Status</span>
                <span className="text-xs font-bold text-blue-600">{viewReceiptModal.status}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Method</span>
                <span className="text-xs font-bold text-slate-900">{viewReceiptModal.method}</span>
              </div>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 text-xs mb-5">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Receipt Number:</span>
                <span className="font-bold text-slate-900 font-mono">{viewReceiptModal.ref}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Customer / Recipient:</span>
                <span className="font-bold text-slate-900">{viewReceiptModal.customer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">For / Purpose:</span>
                <span className="font-bold text-slate-800">{viewReceiptModal.for}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Date Issued:</span>
                <span className="font-bold text-slate-900">{viewReceiptModal.date}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-semibold">Branch / Location:</span>
                <span className="font-bold text-slate-900">{viewReceiptModal.branch}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => { triggerToast(`Receipt PDF for ${viewReceiptModal.ref} downloaded`); setViewReceiptModal(null); }}
                className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                📥 Download Receipt PDF
              </button>
              <button onClick={() => setViewReceiptModal(null)} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT RECEIPT DETAILS MODAL ───────────────────────────────────── */}
      {editReceiptModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative border border-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">Edit Receipt Record</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Receipt No: {editReceiptModal.ref}</p>
              </div>
              <button onClick={() => setEditReceiptModal(null)} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setReceiptsList(prev => prev.map((item, i) => i === editReceiptModal.index ? editReceiptModal : item));
                triggerToast('Receipt Record Updated', `Saved changes for ${editReceiptModal.ref}`);
                setEditReceiptModal(null);
              }}
              className="space-y-4 text-xs font-semibold text-slate-700 text-left"
            >
              <div>
                <label className="block text-slate-500 font-bold mb-1">Customer / Recipient</label>
                <input
                  type="text"
                  value={editReceiptModal.customer}
                  onChange={(e) => setEditReceiptModal({ ...editReceiptModal, customer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Receipt Number</label>
                  <input
                    type="text"
                    value={editReceiptModal.ref}
                    onChange={(e) => setEditReceiptModal({ ...editReceiptModal, ref: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Purpose / For</label>
                  <input
                    type="text"
                    value={editReceiptModal.for}
                    onChange={(e) => setEditReceiptModal({ ...editReceiptModal, for: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Amount (Inc GST)</label>
                  <input
                    type="text"
                    value={editReceiptModal.amount}
                    onChange={(e) => setEditReceiptModal({ ...editReceiptModal, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Payment Method</label>
                  <select
                    value={editReceiptModal.method}
                    onChange={(e) => setEditReceiptModal({ ...editReceiptModal, method: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-900 bg-white"
                  >
                    <option>Bank Transfer</option>
                    <option>EFTPOS</option>
                    <option>Credit Card</option>
                    <option>Cheque</option>
                    <option>Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={editReceiptModal.date}
                    onChange={(e) => setEditReceiptModal({ ...editReceiptModal, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Branch / Location</label>
                  <select
                    value={editReceiptModal.branch}
                    onChange={(e) => setEditReceiptModal({ ...editReceiptModal, branch: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-900 bg-white"
                  >
                    <option>Sydney Head Office</option>
                    <option>Melbourne Depot</option>
                    <option>Brisbane Hub</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditReceiptModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VIEW EXPENSE DETAILS MODAL ────────────────────────────────────────── */}
      {viewExpenseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
              <div>
                <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-0.5">Expense Record</p>
                <h2 className="text-base font-black text-slate-900">{viewExpenseModal.ref}</h2>
              </div>
              <button onClick={() => setViewExpenseModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-slate-400 font-bold mb-0.5">Reference</p><p className="font-extrabold text-slate-900 font-mono">{viewExpenseModal.ref}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Date</p><p className="font-extrabold text-slate-900">{viewExpenseModal.date}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Description</p><p className="font-extrabold text-slate-900">{viewExpenseModal.desc}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Category</p><p className="font-extrabold text-slate-900">{viewExpenseModal.category}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Amount (Inc GST)</p><p className="font-extrabold text-slate-900 font-mono text-sm">{viewExpenseModal.amount}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Payment Type</p><p className="font-extrabold text-slate-900">{viewExpenseModal.type}</p></div>
                <div>
                  <p className="text-slate-400 font-bold mb-0.5">Status</p>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${viewExpenseModal.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>{viewExpenseModal.status}</span>
                </div>
                <div><p className="text-slate-400 font-bold mb-0.5">Uploaded By</p><p className="font-extrabold text-slate-900">{viewExpenseModal.user}</p></div>
                <div className="col-span-2"><p className="text-slate-400 font-bold mb-0.5">Branch / Location</p><p className="font-extrabold text-slate-900">{viewExpenseModal.branch}</p></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button onClick={() => setViewExpenseModal(null)} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Close</button>
              <button onClick={() => { setEditExpenseModal({ ...viewExpenseModal }); setViewExpenseModal(null); }} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-indigo-600/20">✏️ Edit Record</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT EXPENSE RECORD MODAL ──────────────────────────────────────────── */}
      {editExpenseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">Edit Expense</p>
                <h2 className="text-base font-black text-slate-900">{editExpenseModal.ref}</h2>
              </div>
              <button onClick={() => setEditExpenseModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setExpensesList(prev => prev.map((item, i) => i === editExpenseModal.index ? { ...editExpenseModal } : item));
              triggerToast(`Expense ${editExpenseModal.ref} updated successfully`);
              setEditExpenseModal(null);
            }} className="px-6 py-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Description</label>
                  <input type="text" value={editExpenseModal.desc} onChange={(e) => setEditExpenseModal({ ...editExpenseModal, desc: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Category</label>
                  <select value={editExpenseModal.category} onChange={(e) => setEditExpenseModal({ ...editExpenseModal, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900 bg-white">
                    <option>Fuel</option><option>Maintenance</option><option>Repairs</option><option>Tolls</option>
                    <option>Accommodation</option><option>Meals</option><option>Parking</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Amount (Inc GST)</label>
                  <input type="text" value={editExpenseModal.amount} onChange={(e) => setEditExpenseModal({ ...editExpenseModal, amount: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900 font-mono" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Payment Type</label>
                  <select value={editExpenseModal.type} onChange={(e) => setEditExpenseModal({ ...editExpenseModal, type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900 bg-white">
                    <option>Company Card</option><option>Bank Transfer</option><option>EFTPOS</option><option>Personal (Reimb.)</option><option>Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Status</label>
                  <select value={editExpenseModal.status} onChange={(e) => setEditExpenseModal({ ...editExpenseModal, status: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900 bg-white">
                    <option>Approved</option><option>Pending</option><option>Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Date</label>
                  <input type="text" value={editExpenseModal.date} onChange={(e) => setEditExpenseModal({ ...editExpenseModal, date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900" />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 font-bold mb-1">Branch / Location</label>
                  <select value={editExpenseModal.branch} onChange={(e) => setEditExpenseModal({ ...editExpenseModal, branch: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900 bg-white">
                    <option>Sydney Head Office</option><option>Melbourne Depot</option><option>Brisbane Hub</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditExpenseModal(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VIEW PAYROLL RUN DETAILS MODAL ─────────────────────────────────── */}
      {viewPayrollModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
              <div>
                <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-0.5">Payroll Run Details</p>
                <h2 className="text-base font-black text-slate-900">{viewPayrollModal.name}</h2>
              </div>
              <button onClick={() => setViewPayrollModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>
            <div className="px-6 py-5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-slate-400 font-bold mb-0.5">Run Name</p><p className="font-extrabold text-slate-900">{viewPayrollModal.name}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Pay Period</p><p className="font-extrabold text-slate-900">{viewPayrollModal.period}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Branch</p><p className="font-extrabold text-slate-900">{viewPayrollModal.branch}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Employees</p><p className="font-extrabold text-slate-900">{viewPayrollModal.employees}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Pay Type</p><p className="font-extrabold text-slate-900">{viewPayrollModal.type}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Total (Inc GST)</p><p className="font-extrabold text-slate-900 font-mono text-sm">{viewPayrollModal.total}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Status</p>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${ viewPayrollModal.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : viewPayrollModal.status === 'Approved' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>{viewPayrollModal.status}</span>
                </div>
                <div><p className="text-slate-400 font-bold mb-0.5">Created By</p><p className="font-extrabold text-slate-900">{viewPayrollModal.user}</p></div>
                <div className="col-span-2"><p className="text-slate-400 font-bold mb-0.5">Created On</p><p className="font-extrabold text-slate-900">{viewPayrollModal.date}</p></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button onClick={() => setViewPayrollModal(null)} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Close</button>
              <button onClick={() => { setEditPayrollModal({ ...viewPayrollModal }); setViewPayrollModal(null); }} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-indigo-600/20">✏️ Edit Record</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT PAYROLL RUN RECORD MODAL ───────────────────────────────── */}
      {editPayrollModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">Edit Payroll Run</p>
                <h2 className="text-base font-black text-slate-900">{editPayrollModal.name}</h2>
              </div>
              <button onClick={() => setEditPayrollModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setPayrollList(prev => prev.map((item, i) => i === editPayrollModal.index ? { ...editPayrollModal } : item));
              triggerToast(`Payroll run "${editPayrollModal.name}" updated successfully`);
              setEditPayrollModal(null);
            }} className="px-6 py-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-slate-500 font-bold mb-1">Run Name</label>
                  <input type="text" value={editPayrollModal.name} onChange={(e) => setEditPayrollModal({ ...editPayrollModal, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Pay Period</label>
                  <input type="text" value={editPayrollModal.period} onChange={(e) => setEditPayrollModal({ ...editPayrollModal, period: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Pay Type</label>
                  <select value={editPayrollModal.type} onChange={(e) => setEditPayrollModal({ ...editPayrollModal, type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900 bg-white">
                    <option>Weekly</option><option>Fortnightly</option><option>Monthly</option><option>Salary</option><option>Casual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Total (Inc GST)</label>
                  <input type="text" value={editPayrollModal.total} onChange={(e) => setEditPayrollModal({ ...editPayrollModal, total: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900 font-mono" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Status</label>
                  <select value={editPayrollModal.status} onChange={(e) => setEditPayrollModal({ ...editPayrollModal, status: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900 bg-white">
                    <option>Paid</option><option>Approved</option><option>Draft</option><option>Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Employees</label>
                  <input type="number" value={editPayrollModal.employees} onChange={(e) => setEditPayrollModal({ ...editPayrollModal, employees: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Created On</label>
                  <input type="text" value={editPayrollModal.date} onChange={(e) => setEditPayrollModal({ ...editPayrollModal, date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900" />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 font-bold mb-1">Branch</label>
                  <select value={editPayrollModal.branch} onChange={(e) => setEditPayrollModal({ ...editPayrollModal, branch: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900 bg-white">
                    <option>Sydney Head Office</option><option>Melbourne Branch</option><option>Brisbane Branch</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditPayrollModal(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VIEW EXPORT DETAILS MODAL ───────────────────────────────────────────── */}
      {viewExportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
              <div>
                <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-0.5">Export Record</p>
                <h2 className="text-base font-black text-slate-900">{viewExportModal.name}</h2>
              </div>
              <button onClick={() => setViewExportModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>
            <div className="px-6 py-5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><p className="text-slate-400 font-bold mb-0.5">Export Name</p><p className="font-extrabold text-slate-900">{viewExportModal.name}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Export Type</p><p className="font-extrabold text-slate-900">{viewExportModal.type}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Format</p>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded ${viewExportModal.fmt === 'PDF' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>{viewExportModal.fmt}</span>
                </div>
                <div><p className="text-slate-400 font-bold mb-0.5">Period</p><p className="font-extrabold text-slate-900">{viewExportModal.period}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Created On</p><p className="font-extrabold text-slate-900">{viewExportModal.date}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Created By</p><p className="font-extrabold text-slate-900">{viewExportModal.by}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${viewExportModal.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'}`}>{viewExportModal.status}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button onClick={() => setViewExportModal(null)} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Close</button>
              <button onClick={() => { setEditExportModal({ ...viewExportModal }); setViewExportModal(null); }} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-indigo-600/20">✏️ Edit Record</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT EXPORT RECORD MODAL ────────────────────────────────────────────── */}
      {editExportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">Edit Export Record</p>
                <h2 className="text-base font-black text-slate-900">{editExportModal.name}</h2>
              </div>
              <button onClick={() => setEditExportModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setAccExportList(prev => prev.map((item, i) => i === editExportModal.index ? { ...editExportModal } : item));
              triggerToast(`Export "${editExportModal.name}" updated successfully`);
              setEditExportModal(null);
            }} className="px-6 py-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-slate-500 font-bold mb-1">Export Name</label>
                  <input type="text" value={editExportModal.name} onChange={(e) => setEditExportModal({ ...editExportModal, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Export Type</label>
                  <select value={editExportModal.type} onChange={(e) => setEditExportModal({ ...editExportModal, type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900 bg-white">
                    <option>P&L Statement</option><option>Balance Sheet</option><option>General Ledger</option>
                    <option>Receivables</option><option>Payables</option><option>Bank Reconciliation</option>
                    <option>Tax Summary</option><option>Cash Flow</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Format</label>
                  <select value={editExportModal.fmt} onChange={(e) => setEditExportModal({ ...editExportModal, fmt: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900 bg-white">
                    <option>PDF</option><option>CSV</option><option>XLSX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Period</label>
                  <input type="text" value={editExportModal.period} onChange={(e) => setEditExportModal({ ...editExportModal, period: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Status</label>
                  <select value={editExportModal.status} onChange={(e) => setEditExportModal({ ...editExportModal, status: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900 bg-white">
                    <option>Completed</option><option>Failed</option><option>Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Created By</label>
                  <input type="text" value={editExportModal.by} onChange={(e) => setEditExportModal({ ...editExportModal, by: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 font-bold text-slate-900" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditExportModal(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
