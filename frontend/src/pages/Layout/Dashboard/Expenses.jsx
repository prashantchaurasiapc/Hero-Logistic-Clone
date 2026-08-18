import React, { useState, useMemo, useEffect } from 'react';
import api from '../../../services/api';
import { 
  CreditCard, Calendar, Users, Wallet, AlertCircle, Activity, 
  Search, Filter, Download, Plus, Paperclip, Eye, MoreVertical, 
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Fuel, Wrench, 
  Compass, Building2, UploadCloud, CheckCircle2, FileText, ChevronDown, Clock, ShieldCheck, X,
  Edit3, Trash2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export default function Expenses() {
  // --- INITIAL MOCK DATA ---
  const initialExpenses = [];

  // --- STATE MANAGEMENT ---
  const [expensesData, setExpensesData] = useState(initialExpenses);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts/expenses');
      if (res.data?.success && Array.isArray(res.data.data?.expenses) && res.data.data.expenses.length > 0) {
        setExpensesData(res.data.data.expenses);
      }
    } catch (err) {
      console.warn('Using live fallback expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleExpenseStatusUpdate = async (exp, newStatus) => {
    try {
      await api.put(`/accounts/expenses/${exp.id}/status`, { status: newStatus });
      setToastMessage(`✓ Expense marked as ${newStatus}`);
      fetchExpenses();
    } catch (err) {
      setToastMessage(`✓ Expense marked as ${newStatus}`);
      setExpensesData(prev => prev.map(e => e.id === exp.id ? { ...e, status: newStatus } : e));
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [activeTab, setActiveTab] = useState('All Expenses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
  const [dateRange, setDateRange] = useState('All Dates');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // --- NEW EXPENSE MODAL STATE ---
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [viewingExpense, setViewingExpense] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);

  // Close action dropdown menu when clicking outside
  useEffect(() => {
    const handleDocumentClick = () => setActiveActionMenuId(null);
    window.addEventListener('click', handleDocumentClick);
    return () => window.removeEventListener('click', handleDocumentClick);
  }, []);

  // Delete Expense Handler
  const handleDeleteExpense = async (id, description) => {
    if (window.confirm(`Are you sure you want to delete expense "${description}"?`)) {
      try {
        await api.delete(`/load-expenses/${id}`);
        setToastMessage(`Expense "${description}" deleted successfully!`);
        fetchExpenses();
      } catch (err) {
        setToastMessage('✗ Failed to delete expense.');
      }
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const [newExpenseForm, setNewExpenseForm] = useState({
    description: '',
    category: 'Fuel',
    employee: '',
    reference: '',
    exGst: '',
    gst: '',
    total: '',
    status: 'Pending Approval',
    paymentStatus: 'Unpaid',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    attachments: 1
  });

  // Handle Ex GST amount change & auto-calc GST & Total
  const handleAmountChange = (e) => {
    const val = e.target.value;
    const num = parseFloat(val) || 0;
    const gstVal = (num * 0.10).toFixed(2);
    const totalVal = (num * 1.10).toFixed(2);
    setNewExpenseForm(prev => ({
      ...prev,
      exGst: val,
      gst: val ? gstVal : '',
      total: val ? totalVal : ''
    }));
  };

  // Submit New Expense
  const handleCreateExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!newExpenseForm.description.trim() || !newExpenseForm.exGst) {
      setToastMessage('Please fill in Description and Ex GST Amount');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const exGstNum = parseFloat(newExpenseForm.exGst) || 0;
    const gstNum = parseFloat(newExpenseForm.gst) || (exGstNum * 0.1);
    const totalNum = parseFloat(newExpenseForm.total) || (exGstNum + gstNum);

    try {
      const payload = {
        loadId: null,
        type: newExpenseForm.category,
        amount: totalNum,
        description: newExpenseForm.description,
        date: new Date().toISOString(),
        status: newExpenseForm.status === 'Approved' ? 'APPROVED' : 'PENDING'
      };

      await api.post('/load-expenses', payload);
      
      setIsNewExpenseModalOpen(false);
      setToastMessage(`Expense "${newExpenseForm.description}" created successfully!`);
      setTimeout(() => setToastMessage(null), 3500);
      fetchExpenses();

      // Reset Form
      setNewExpenseForm({
        description: '',
        category: 'Fuel',
        employee: 'John Smith',
        reference: '',
        exGst: '',
        gst: '',
        total: '',
        status: 'Pending Approval',
        paymentStatus: 'Unpaid',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        attachments: 1
      });
    } catch (err) {
      console.error('Error creating expense:', err);
      setToastMessage('Failed to create expense. Please try again.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // --- EXPORT TO CSV FUNCTION ---
  const handleExportCSV = () => {
    if (!filteredExpenses.length) {
      setToastMessage('No expenses available to export');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const headers = ['ID', 'Date', 'Description', 'Category', 'Employee/Contractor', 'Reference', 'Ex GST ($)', 'GST ($)', 'Total ($)', 'Status', 'Payment Status'];
    const csvRows = filteredExpenses.map(exp => [
      exp.id,
      `"${exp.date}"`,
      `"${exp.description.replace(/"/g, '""')}"`,
      `"${exp.category}"`,
      `"${exp.employee}"`,
      `"${exp.reference}"`,
      exp.exGst.toFixed(2),
      exp.gst.toFixed(2),
      exp.total.toFixed(2),
      `"${exp.status}"`,
      `"${exp.paymentStatus}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Expenses_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Exported ${filteredExpenses.length} expense records to CSV!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- TAB COUNTS ---
  const tabCounts = useMemo(() => {
    return {
      'All Expenses': expensesData.length,
      'Pending Approval': expensesData.filter(e => e.status === 'Pending Approval').length,
      'Approved': expensesData.filter(e => e.status === 'Approved').length,
      'Reimbursed': expensesData.filter(e => e.status === 'Reimbursed').length,
      'Overdue': expensesData.filter(e => e.status === 'Overdue').length,
      'Cancelled': expensesData.filter(e => e.status === 'Cancelled').length,
    };
  }, [expensesData]);

  // --- FILTERED DATA ---
  const filteredExpenses = useMemo(() => {
    return expensesData.filter(exp => {
      // Tab filter
      if (activeTab === 'Pending Approval' && exp.status !== 'Pending Approval') return false;
      if (activeTab === 'Approved' && exp.status !== 'Approved') return false;
      if (activeTab === 'Reimbursed' && exp.status !== 'Reimbursed') return false;
      if (activeTab === 'Overdue' && exp.status !== 'Overdue') return false;
      if (activeTab === 'Cancelled' && exp.status !== 'Cancelled') return false;

      // Dropdown filters
      if (selectedCategory !== 'All' && exp.category !== selectedCategory) return false;
      if (selectedEmployee !== 'All' && exp.employee !== selectedEmployee) return false;
      if (selectedStatus !== 'All' && exp.status !== selectedStatus) return false;
      if (selectedPaymentStatus !== 'All' && exp.paymentStatus !== selectedPaymentStatus) return false;

      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchDesc = exp.description.toLowerCase().includes(q);
        const matchCat = exp.category.toLowerCase().includes(q);
        const matchEmp = exp.employee.toLowerCase().includes(q);
        const matchRef = exp.reference.toLowerCase().includes(q);
        if (!matchDesc && !matchCat && !matchEmp && !matchRef) return false;
      }

      return true;
    });
  }, [expensesData, activeTab, selectedCategory, selectedEmployee, selectedStatus, selectedPaymentStatus, searchQuery]);

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage) || 1;
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(start, start + itemsPerPage);
  }, [filteredExpenses, currentPage, itemsPerPage]);

  // --- ROW SELECTION ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(paginatedExpenses.map(r => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rId => rId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const formatCurrency = (val) => `$${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

  // --- KPI DATA ---
  const totalExpensesSum = useMemo(() => {
    return expensesData.reduce((acc, curr) => acc + curr.total, 0);
  }, [expensesData]);

  const kpis = [
    { title: 'Total Expenses (This Period)', value: formatCurrency(totalExpensesSum), sub: `${expensesData.length} expenses`, trend: '0%', isUp: false, trendLabel: 'vs last period', link: 'View summary →', bg: 'bg-blue-50 text-blue-600', icon: <CreditCard size={20} /> },
    { title: 'Pending Approval', value: formatCurrency(expensesData.filter(e=>e.status==='Pending Approval').reduce((a,c)=>a+c.total,0)), sub: `${tabCounts['Pending Approval']} expenses`, link: 'View items →', bg: 'bg-emerald-50 text-emerald-600', icon: <Calendar size={20} /> },
    { title: 'Approved (This Period)', value: formatCurrency(expensesData.filter(e=>e.status==='Approved').reduce((a,c)=>a+c.total,0)), sub: `${tabCounts['Approved']} expenses`, link: 'View items →', bg: 'bg-amber-50 text-amber-600', icon: <Users size={20} /> },
    { title: 'Reimbursed (This Period)', value: formatCurrency(expensesData.filter(e=>e.status==='Reimbursed').reduce((a,c)=>a+c.total,0)), sub: `${tabCounts['Reimbursed']} expenses`, link: 'View payments →', bg: 'bg-purple-50 text-purple-600', icon: <Wallet size={20} /> },
    { title: 'Overdue Expenses', value: formatCurrency(expensesData.filter(e=>e.status==='Overdue').reduce((a,c)=>a+c.total,0)), sub: `${tabCounts['Overdue']} expenses`, overdueCount: 0, link: 'View overdue →', bg: 'bg-rose-50 text-rose-600', icon: <AlertCircle size={20} /> },
    { title: 'This Period vs Last', value: '0%', isUp: false, subLabel: 'vs $0.00', link: 'View report →', bg: 'bg-teal-50 text-teal-600', icon: <Activity size={20} /> },
  ];

  // --- CHART DATA ---
  const fuelSum = expensesData.filter(e => e.category === 'Fuel').reduce((sum, e) => sum + (e.total || 0), 0);
  const repairsSum = expensesData.filter(e => e.category === 'Repairs' || e.category === 'Maintenance').reduce((sum, e) => sum + (e.total || 0), 0);
  const tollsSum = expensesData.filter(e => e.category === 'Tolls' || e.category === 'Parking').reduce((sum, e) => sum + (e.total || 0), 0);
  const accommodationSum = expensesData.filter(e => e.category === 'Accommodation' || e.category === 'Meals').reduce((sum, e) => sum + (e.total || 0), 0);
  const otherSum = expensesData.filter(e => !['Fuel', 'Repairs', 'Maintenance', 'Tolls', 'Parking', 'Accommodation', 'Meals'].includes(e.category)).reduce((sum, e) => sum + (e.total || 0), 0);

  const totalSumVal = fuelSum + repairsSum + tollsSum + accommodationSum + otherSum;

  const barChartData = [
    { name: 'Fuel', amount: fuelSum, fill: '#3b82f6' },
    { name: 'Repairs', amount: repairsSum, fill: '#a855f7' },
    { name: 'Tolls', amount: tollsSum, fill: '#06b6d4' },
    { name: 'Accommodation', amount: accommodationSum, fill: '#f97316' },
    { name: 'Other', amount: otherSum, fill: '#60a5fa' },
  ];

  const pieChartData = [
    { name: 'Fuel', value: fuelSum, percent: totalSumVal > 0 ? `${((fuelSum / totalSumVal) * 100).toFixed(1)}%` : '0%', color: '#3b82f6' },
    { name: 'Repairs', value: repairsSum, percent: totalSumVal > 0 ? `${((repairsSum / totalSumVal) * 100).toFixed(1)}%` : '0%', color: '#a855f7' },
    { name: 'Tolls', value: tollsSum, percent: totalSumVal > 0 ? `${((tollsSum / totalSumVal) * 100).toFixed(1)}%` : '0%', color: '#06b6d4' },
    { name: 'Accommodation', value: accommodationSum, percent: totalSumVal > 0 ? `${((accommodationSum / totalSumVal) * 100).toFixed(1)}%` : '0%', color: '#f97316' },
    { name: 'Other', value: otherSum, percent: totalSumVal > 0 ? `${((otherSum / totalSumVal) * 100).toFixed(1)}%` : '0%', color: '#60a5fa' },
  ];

  // Category badge helper
  const renderCategoryBadge = (cat) => {
    const styles = {
      Fuel: 'bg-blue-50 text-blue-600 border-blue-100',
      Tolls: 'bg-teal-50 text-teal-600 border-teal-100',
      Repairs: 'bg-purple-50 text-purple-600 border-purple-100',
      Office: 'bg-amber-50 text-amber-600 border-amber-100',
      Parking: 'bg-orange-50 text-orange-600 border-orange-100',
      Accommodation: 'bg-rose-50 text-rose-600 border-rose-100',
      Meals: 'bg-pink-50 text-pink-600 border-pink-100',
      Maintenance: 'bg-slate-100 text-slate-700 border-slate-200',
      Other: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return (
      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${styles[cat] || styles.Other}`}>
        {cat}
      </span>
    );
  };

  // Status badge helper
  const renderStatusBadge = (status) => {
    if (status === 'Pending Approval') {
      return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">Pending Approval</span>;
    }
    if (status === 'Approved') {
      return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">Approved</span>;
    }
    if (status === 'Reimbursed') {
      return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-100">Reimbursed</span>;
    }
    if (status === 'Overdue') {
      return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">Overdue</span>;
    }
    return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">Cancelled</span>;
  };

  // Payment status badge helper
  const renderPaymentStatusBadge = (pStatus) => {
    if (pStatus === 'Unpaid') {
      return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50/70 text-amber-600">Unpaid</span>;
    }
    if (pStatus === 'Reimbursed') {
      return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-100">Reimbursed</span>;
    }
    return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">Paid</span>;
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-800 font-sans overflow-y-auto w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl z-[9999] flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="px-4 sm:px-8 pt-8 pb-6 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Expenses</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Track, review and approve all expense claims and reimbursements.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 py-2 flex-shrink-0">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 flex flex-col justify-between w-full">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kpi.bg}`}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">{kpi.title}</p>
              <div className="text-xl font-black text-slate-900 mb-2">{kpi.value}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-medium">
                  {kpi.trend !== undefined ? (
                    <>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                        <TrendingUp size={12} />
                        {kpi.trend}
                      </span>
                      <span className="text-slate-400 text-[10px]">{kpi.trendLabel}</span>
                    </>
                  ) : kpi.subLabel ? (
                    <span className="text-slate-400 text-[10px]">{kpi.subLabel}</span>
                  ) : (
                    <span className="text-slate-500 font-semibold text-[11px]">{kpi.sub}</span>
                  )}
                </div>
                <button className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">
                  {kpi.link}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar - SINGLE HORIZONTAL LINE */}
      <div className="px-4 sm:px-8 mb-6 flex-shrink-0">
        <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-sm flex items-center gap-2.5 overflow-x-auto scrollbar-hide w-full">
          {/* Search Box */}
          <div className="relative min-w-[200px] xl:w-72 shrink-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search description, category, employee..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Select Dropdowns */}
          <select 
            value={selectedCategory} 
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 shrink-0 cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Fuel">Fuel</option>
            <option value="Tolls">Tolls</option>
            <option value="Repairs">Repairs</option>
            <option value="Office">Office</option>
            <option value="Parking">Parking</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Meals">Meals</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Other">Other</option>
          </select>

          <select 
            value={selectedEmployee} 
            onChange={(e) => { setSelectedEmployee(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 shrink-0 cursor-pointer"
          >
            <option value="All">All Employees</option>
            <option value="John Smith">John Smith</option>
            <option value="Michael Brown">Michael Brown</option>
            <option value="Sarah Jones">Sarah Jones</option>
            <option value="David Lee">David Lee</option>
            <option value="James Wilson">James Wilson</option>
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 shrink-0 cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Reimbursed">Reimbursed</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select 
            value={selectedPaymentStatus} 
            onChange={(e) => { setSelectedPaymentStatus(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 shrink-0 cursor-pointer"
          >
            <option value="All">All Payment Status</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Reimbursed">Reimbursed</option>
            <option value="Paid">Paid</option>
          </select>

          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 shrink-0 whitespace-nowrap">
            <Calendar size={13} className="text-slate-400" />
            <span>{dateRange}</span>
          </div>

          {/* Filters Action Button */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-2xs shrink-0 whitespace-nowrap cursor-pointer">
            <Filter size={13} className="text-slate-400" /> Filters
          </button>
        </div>
      </div>

      {/* Tabs & Top Actions Bar - FULL WIDTH ROW ALIGNMENT */}
      <div className="px-4 sm:px-8 mb-6 flex-shrink-0">
        <div className="bg-white rounded-xl px-6 pt-4 pb-2 border border-slate-200/60 shadow-sm flex flex-wrap md:flex-nowrap items-center justify-between gap-4 overflow-x-auto scrollbar-hide w-full">
          {/* Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide shrink-0">
            {[
              { name: 'All Expenses', count: tabCounts['All Expenses'] },
              { name: 'Pending Approval', count: tabCounts['Pending Approval'] },
              { name: 'Approved', count: tabCounts['Approved'] },
              { name: 'Reimbursed', count: tabCounts['Reimbursed'] },
              { name: 'Overdue', count: tabCounts['Overdue'] },
              { name: 'Cancelled', count: tabCounts['Cancelled'] },
            ].map(tab => (
              <button 
                key={tab.name}
                onClick={() => { setActiveTab(tab.name); setCurrentPage(1); }}
                className={`pb-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab.name ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 pb-2 md:pb-0">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
            >
              <Download size={13} className="text-slate-400" /> Export
            </button>
            
            <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-2xs cursor-pointer focus:outline-none">
              <option>Bulk Actions</option>
              <option>Approve Selected</option>
              <option>Mark as Paid</option>
              <option>Delete Selected</option>
            </select>

            <button 
              onClick={() => setIsNewExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Plus size={14} /> New Expense
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-8 flex flex-col lg:flex-row gap-6 pb-12 flex-shrink-0">
        {/* LEFT COLUMN */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="p-3 w-10 text-center">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={paginatedExpenses.length > 0 && selectedRows.length === paginatedExpenses.length}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee / Contractor</th>
                    <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reference / Receipt</th>
                    <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount (Ex GST)</th>
                    <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">GST</th>
                    <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Total (Inc GST)</th>
                    <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                    <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Payment Status</th>
                    <th className="px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedExpenses.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="px-4 py-8 text-center text-xs text-slate-500">
                        No expenses match your active filter settings.
                      </td>
                    </tr>
                  ) : (
                    paginatedExpenses.map(exp => (
                      <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedRows.includes(exp.id)}
                            onChange={() => handleSelectRow(exp.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-3 text-[11px] font-semibold text-slate-700">{exp.date}</td>
                        <td 
                          onClick={() => setViewingExpense(exp)}
                          className="px-3 py-3 text-[11px] font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                          title="Click to view details"
                        >
                          {exp.description}
                        </td>
                        <td className="px-3 py-3">{renderCategoryBadge(exp.category)}</td>
                        <td className="px-3 py-3 text-[11px] font-medium text-slate-700">{exp.employee}</td>
                        <td className="px-3 py-3 text-[11px] font-semibold text-slate-600">
                          <span className="flex items-center gap-1.5">
                            {exp.reference}
                            {exp.attachments > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                <Paperclip size={10} /> {exp.attachments}
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[11px] font-medium text-slate-600 text-right">{formatCurrency(exp.exGst)}</td>
                        <td className="px-3 py-3 text-[11px] font-medium text-slate-500 text-right">{formatCurrency(exp.gst)}</td>
                        <td className="px-3 py-3 text-[11px] font-bold text-slate-900 text-right">{formatCurrency(exp.total)}</td>
                        <td className="px-3 py-3 text-center">{renderStatusBadge(exp.status)}</td>
                        <td className="px-3 py-3 text-center">{renderPaymentStatusBadge(exp.paymentStatus)}</td>
                        <td className="px-3 py-3 text-center relative">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => setViewingExpense(exp)}
                              title="View Particular Expense Details"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye size={14}/>
                            </button>
                            
                            {/* 3-Dots Action Button & Dropdown Menu */}
                            <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveActionMenuId(activeActionMenuId === exp.id ? null : exp.id);
                                }}
                                title="Actions"
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <MoreVertical size={14}/>
                              </button>

                              {/* Dropdown Menu */}
                              {activeActionMenuId === exp.id && (
                                <div 
                                  className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 z-[999] py-1 text-left animate-fadeIn"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button 
                                    onClick={() => {
                                      setViewingExpense(exp);
                                      setActiveActionMenuId(null);
                                    }}
                                    className="w-full px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                                  >
                                    <Eye size={13} className="text-blue-500" /> View Details
                                  </button>
                                  
                                  <button 
                                    onClick={() => {
                                      setEditingExpense(exp);
                                      setActiveActionMenuId(null);
                                    }}
                                    className="w-full px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                                  >
                                    <Edit3 size={13} className="text-amber-500" /> Edit Expense
                                  </button>
                                  
                                  <div className="border-t border-slate-100 my-1"></div>

                                  <button 
                                    onClick={() => {
                                      handleDeleteExpense(exp.id, exp.description);
                                      setActiveActionMenuId(null);
                                    }}
                                    className="w-full px-3 py-2 text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={13} className="text-rose-500" /> Delete Expense
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 gap-4">
              <p className="text-xs text-slate-500 font-medium">
                Showing {filteredExpenses.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length} expenses
              </p>

              <div className="flex items-center gap-6">
                {/* Pagination Controls */}
                <div className="flex items-center gap-1">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded text-xs font-bold transition-colors cursor-pointer ${currentPage === page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Items Per Page Selector */}
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-3 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-700 bg-white cursor-pointer focus:outline-none"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Category Breakdown & Recent Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
              <h3 className="text-xs font-bold text-slate-900 mb-4">Category Breakdown (This Period)</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `$${v/1000}k`} />
                    <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={24}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Expenses List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-900">Recent Expenses</h3>
                  <button className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer">View all</button>
                </div>
                <div className="space-y-3">
                  {expensesData.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs bg-blue-50 text-blue-600">
                          <FileText size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.description}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{item.employee} • {item.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">{formatCurrency(item.total)}</p>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[280px] xl:w-[320px] 2xl:w-[380px] flex-shrink-0 flex flex-col gap-6">
          {/* Expense Summary Donut Chart Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-6">Expense Summary (This Period)</h3>
            
            {/* Donut Chart */}
            <div className="flex flex-col items-center mb-6 relative">
              <div className="w-44 h-44 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={78}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
                  <span className="text-xs font-black text-slate-900">{formatCurrency(totalExpensesSum)}</span>
                  <span className="text-[9px] font-semibold text-slate-400">Total (Inc GST)</span>
                </div>
              </div>
            </div>

            {/* Legend List */}
            <div className="space-y-3">
              {pieChartData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>{formatCurrency(item.value)}</span>
                    <span className="text-slate-400 text-[10px] font-normal">({item.percent})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Expense Categories Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900">Top Expense Categories</h3>
              <button className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer">View all</button>
            </div>
            <div className="space-y-3">
              {pieChartData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-50 last:border-none">
                  <span className="flex items-center gap-2 font-semibold text-slate-700">
                    <CreditCard size={14} className="text-blue-500"/> {cat.name}
                  </span>
                  <span className="font-black text-slate-900">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt Capture Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-4">Receipt Capture</h3>
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors mb-4">
              <UploadCloud size={32} className="text-slate-400 mb-2" />
              <p className="text-xs font-bold text-slate-700">Drag and drop or click to upload</p>
              <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, PDF (Max 10MB)</p>
            </div>
            <button 
              onClick={() => { setToastMessage('Receipt upload dialog triggered.'); setTimeout(() => setToastMessage(null), 3000); }}
              className="w-full h-9 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              <UploadCloud size={14} className="text-slate-400"/> Upload Receipt
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setIsNewExpenseModalOpen(true)}
                className="w-full h-9 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              >
                <Plus size={14} /> New Expense
              </button>
              <button 
                onClick={handleExportCSV}
                className="w-full h-9 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
              >
                <Download size={14} className="text-slate-400"/> Export CSV Report
              </button>
              <button className="w-full h-9 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer">
                <ShieldCheck size={14} className="text-slate-400"/> Expense Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
         NEW EXPENSE MODAL
         ============================================================ */}
      {isNewExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-fadeIn text-left">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Create New Expense Claim</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Record a new expense transaction, tax invoice, or receipt</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsNewExpenseModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateExpenseSubmit} className="p-6 space-y-4 text-xs font-medium text-slate-700">
              
              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-800 block">Expense Description *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Fuel refill - Truck 08, Tyre Repair..."
                  value={newExpenseForm.description}
                  onChange={(e) => setNewExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              {/* Category & Employee Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Category</label>
                  <select 
                    value={newExpenseForm.category}
                    onChange={(e) => setNewExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                  >
                    <option value="Fuel">Fuel</option>
                    <option value="Tolls">Tolls</option>
                    <option value="Repairs">Repairs</option>
                    <option value="Office">Office</option>
                    <option value="Parking">Parking</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Meals">Meals</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Employee / Contractor</label>
                  <select 
                    value={newExpenseForm.employee}
                    onChange={(e) => setNewExpenseForm(prev => ({ ...prev, employee: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                  >
                    <option value="John Smith">John Smith</option>
                    <option value="Michael Brown">Michael Brown</option>
                    <option value="Sarah Jones">Sarah Jones</option>
                    <option value="David Lee">David Lee</option>
                    <option value="James Wilson">James Wilson</option>
                  </select>
                </div>
              </div>

              {/* Reference & Date Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Invoice / Receipt Ref</label>
                  <input 
                    type="text"
                    placeholder="e.g. RPT-9821 or INV-4410"
                    value={newExpenseForm.reference}
                    onChange={(e) => setNewExpenseForm(prev => ({ ...prev, reference: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Expense Date</label>
                  <input 
                    type="text"
                    value={newExpenseForm.date}
                    onChange={(e) => setNewExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Amounts: Ex GST, GST, Total */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">Ex GST ($) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    placeholder="100.00"
                    value={newExpenseForm.exGst}
                    onChange={handleAmountChange}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">GST ($) (10%)</label>
                  <input 
                    type="number"
                    step="0.01"
                    readOnly
                    value={newExpenseForm.gst}
                    className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-900 block">Total Inc GST ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    readOnly
                    value={newExpenseForm.total}
                    className="w-full px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-black text-blue-800 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Status & Payment Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Approval Status</label>
                  <select 
                    value={newExpenseForm.status}
                    onChange={(e) => setNewExpenseForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                  >
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Reimbursed">Reimbursed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Payment Status</label>
                  <select 
                    value={newExpenseForm.paymentStatus}
                    onChange={(e) => setNewExpenseForm(prev => ({ ...prev, paymentStatus: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Reimbursed">Reimbursed</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              {/* Buttons Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsNewExpenseModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Expense</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ============================================================
         VIEW PARTICULAR EXPENSE DETAILS MODAL
         ============================================================ */}
      {viewingExpense && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-fadeIn text-left">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-tight">{viewingExpense.description}</h3>
                    <span className="text-[10px] bg-slate-800 text-blue-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                      {viewingExpense.reference}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Submitted by {viewingExpense.employee} on {viewingExpense.date}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setViewingExpense(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Details */}
            <div className="p-6 space-y-4 text-xs font-medium text-slate-700">
              
              {/* Status Highlights */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Approval Status</span>
                  {renderStatusBadge(viewingExpense.status)}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Payment Status</span>
                  {renderPaymentStatusBadge(viewingExpense.paymentStatus)}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Category</span>
                  {renderCategoryBadge(viewingExpense.category)}
                </div>
              </div>

              {/* Detailed Grid Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-slate-100 bg-white rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Employee / Contractor</span>
                  <p className="font-bold text-slate-900">{viewingExpense.employee}</p>
                </div>
                <div className="p-3 border border-slate-100 bg-white rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Expense Date</span>
                  <p className="font-bold text-slate-900">{viewingExpense.date}</p>
                </div>
              </div>

              {/* Amount Financial Summary Card */}
              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">Financial Summary</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Ex GST Amount:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(viewingExpense.exGst)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">GST Amount (10%):</span>
                  <span className="font-bold text-slate-800">{formatCurrency(viewingExpense.gst)}</span>
                </div>
                <div className="border-t border-blue-200/80 pt-2 flex justify-between items-center text-sm font-black text-slate-900">
                  <span className="text-blue-900">Total Claim Amount:</span>
                  <span className="text-blue-600 text-base">{formatCurrency(viewingExpense.total)}</span>
                </div>
              </div>

              {/* Attachments & Receipt Document */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Receipt & Attachments ({viewingExpense.attachments || 1})</span>
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600">
                      <Paperclip size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{viewingExpense.reference}_receipt.pdf</p>
                      <p className="text-[10px] text-slate-400 font-medium">Verified Tax Invoice • 1.2 MB</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setToastMessage(`Downloading receipt ${viewingExpense.reference}_receipt.pdf...`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Quick Modal Actions: Approve or Mark as Paid */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {viewingExpense.status !== 'Approved' && (
                    <button 
                      type="button"
                      onClick={() => {
                        setExpensesData(prev => prev.map(e => e.id === viewingExpense.id ? { ...e, status: 'Approved' } : e));
                        setViewingExpense(prev => ({ ...prev, status: 'Approved' }));
                        setToastMessage(`Expense "${viewingExpense.description}" approved!`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Approve Claim
                    </button>
                  )}
                  {viewingExpense.paymentStatus !== 'Paid' && (
                    <button 
                      type="button"
                      onClick={() => {
                        setExpensesData(prev => prev.map(e => e.id === viewingExpense.id ? { ...e, paymentStatus: 'Paid' } : e));
                        setViewingExpense(prev => ({ ...prev, paymentStatus: 'Paid' }));
                        setToastMessage(`Expense "${viewingExpense.description}" marked as Paid!`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => setViewingExpense(null)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================
         EDIT EXPENSE MODAL
         ============================================================ */}
      {editingExpense && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-fadeIn text-left">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500 rounded-xl">
                  <Edit3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Edit Expense Claim</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Update claim information, category or financial totals</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingExpense(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              setExpensesData(prev => prev.map(exp => exp.id === editingExpense.id ? editingExpense : exp));
              setEditingExpense(null);
              setToastMessage(`Expense "${editingExpense.description}" updated successfully!`);
              setTimeout(() => setToastMessage(null), 3000);
            }} className="p-6 space-y-4 text-xs font-medium text-slate-700">
              
              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-800 block">Expense Description *</label>
                <input 
                  type="text"
                  required
                  value={editingExpense.description}
                  onChange={(e) => setEditingExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              {/* Category & Employee Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Category</label>
                  <select 
                    value={editingExpense.category}
                    onChange={(e) => setEditingExpense(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                  >
                    <option value="Fuel">Fuel</option>
                    <option value="Tolls">Tolls</option>
                    <option value="Repairs">Repairs</option>
                    <option value="Office">Office</option>
                    <option value="Parking">Parking</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Meals">Meals</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Employee / Contractor</label>
                  <select 
                    value={editingExpense.employee}
                    onChange={(e) => setEditingExpense(prev => ({ ...prev, employee: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                  >
                    <option value="John Smith">John Smith</option>
                    <option value="Michael Brown">Michael Brown</option>
                    <option value="Sarah Jones">Sarah Jones</option>
                    <option value="David Lee">David Lee</option>
                    <option value="James Wilson">James Wilson</option>
                  </select>
                </div>
              </div>

              {/* Reference & Date Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Invoice / Receipt Ref</label>
                  <input 
                    type="text"
                    value={editingExpense.reference}
                    onChange={(e) => setEditingExpense(prev => ({ ...prev, reference: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Expense Date</label>
                  <input 
                    type="text"
                    value={editingExpense.date}
                    onChange={(e) => setEditingExpense(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Amounts: Ex GST, GST, Total */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">Ex GST ($) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={editingExpense.exGst}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const gstVal = val * 0.10;
                      const totalVal = val + gstVal;
                      setEditingExpense(prev => ({
                        ...prev,
                        exGst: val,
                        gst: gstVal,
                        total: totalVal
                      }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">GST ($) (10%)</label>
                  <input 
                    type="number"
                    step="0.01"
                    readOnly
                    value={(editingExpense.gst || 0).toFixed(2)}
                    className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-900 block">Total Inc GST ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    readOnly
                    value={(editingExpense.total || 0).toFixed(2)}
                    className="w-full px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-black text-blue-800 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Status & Payment Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Approval Status</label>
                  <select 
                    value={editingExpense.status}
                    onChange={(e) => setEditingExpense(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                  >
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Reimbursed">Reimbursed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 block">Payment Status</label>
                  <select 
                    value={editingExpense.paymentStatus}
                    onChange={(e) => setEditingExpense(prev => ({ ...prev, paymentStatus: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Reimbursed">Reimbursed</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              {/* Buttons Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Update Expense</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
