import React, { useState, useMemo } from 'react';
import { 
  CreditCard, Calendar, Users, Wallet, AlertCircle, Activity, 
  Search, Filter, Download, Plus, Paperclip, Eye, MoreVertical, 
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Fuel, Wrench, 
  Compass, Building2, UploadCloud, CheckCircle2, FileText, ChevronDown, Clock, ShieldCheck
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export default function Expenses() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('All Expenses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
  const [dateRange, setDateRange] = useState('18 May 2026 - 24 May 2026');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // --- MOCK EXPENSES DATA (42 Items) ---
  const allExpenses = useMemo(() => [
    { id: 1, date: '24 May 2026', description: 'Fuel - Truck 12', category: 'Fuel', employee: 'John Smith', reference: 'RPT-8475', attachments: 3, exGst: 180.91, gst: 18.09, total: 199.00, status: 'Pending Approval', paymentStatus: 'Unpaid' },
    { id: 2, date: '24 May 2026', description: 'Toll - M7', category: 'Tolls', employee: 'Michael Brown', reference: 'TOL-5623', attachments: 0, exGst: 12.73, gst: 1.27, total: 14.00, status: 'Pending Approval', paymentStatus: 'Unpaid' },
    { id: 3, date: '23 May 2026', description: 'Tyre Repair', category: 'Repairs', employee: 'John Smith', reference: 'INV-7732', attachments: 0, exGst: 250.00, gst: 25.00, total: 275.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 4, date: '23 May 2026', description: 'Office Supplies', category: 'Office', employee: 'Sarah Jones', reference: 'RPT-8471', attachments: 2, exGst: 45.45, gst: 4.55, total: 50.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 5, date: '22 May 2026', description: 'Parking - Client Meeting', category: 'Parking', employee: 'Michael Brown', reference: 'RPT-8469', attachments: 1, exGst: 9.09, gst: 0.91, total: 13.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 6, date: '22 May 2026', description: 'Accommodation - Brisbane', category: 'Accommodation', employee: 'David Lee', reference: 'INV-5541', attachments: 1, exGst: 181.82, gst: 18.18, total: 200.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 7, date: '21 May 2026', description: 'Fuel - Truck 07', category: 'Fuel', employee: 'James Wilson', reference: 'RPT-8462', attachments: 2, exGst: 200.00, gst: 20.00, total: 220.00, status: 'Reimbursed', paymentStatus: 'Paid' },
    { id: 8, date: '21 May 2026', description: 'Meal - Client Lunch', category: 'Meals', employee: 'Sarah Jones', reference: 'RPT-8461', attachments: 0, exGst: 68.18, gst: 6.82, total: 75.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 9, date: '20 May 2026', description: 'Service - Truck 12', category: 'Maintenance', employee: 'James Wilson', reference: 'INV-5520', attachments: 4, exGst: 800.00, gst: 80.00, total: 880.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 10, date: '20 May 2026', description: 'Phone Allowance', category: 'Other', employee: 'John Smith', reference: 'MAY-2026', attachments: 0, exGst: 45.45, gst: 0.00, total: 45.45, status: 'Reimbursed', paymentStatus: 'Paid' },

    // Additional mock items for pagination & filtering (items 11 - 42)
    { id: 11, date: '19 May 2026', description: 'Fuel - Van 04', category: 'Fuel', employee: 'David Lee', reference: 'RPT-8450', attachments: 1, exGst: 136.36, gst: 13.64, total: 150.00, status: 'Pending Approval', paymentStatus: 'Unpaid' },
    { id: 12, date: '19 May 2026', description: 'Engine Oil Filter', category: 'Repairs', employee: 'Michael Brown', reference: 'INV-7710', attachments: 2, exGst: 318.18, gst: 31.82, total: 350.00, status: 'Overdue', paymentStatus: 'Unpaid' },
    { id: 13, date: '18 May 2026', description: 'Toll - Gateway Bridge', category: 'Tolls', employee: 'John Smith', reference: 'TOL-5619', attachments: 0, exGst: 18.18, gst: 1.82, total: 20.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 14, date: '18 May 2026', description: 'Depot Cleaning Supplies', category: 'Office', employee: 'Sarah Jones', reference: 'RPT-8442', attachments: 1, exGst: 77.27, gst: 7.73, total: 85.00, status: 'Pending Approval', paymentStatus: 'Unpaid' },
    { id: 15, date: '17 May 2026', description: 'Fuel - Truck 15', category: 'Fuel', employee: 'James Wilson', reference: 'RPT-8438', attachments: 1, exGst: 227.27, gst: 22.73, total: 250.00, status: 'Reimbursed', paymentStatus: 'Paid' },
    { id: 16, date: '17 May 2026', description: 'Hotel Stay - Sydney', category: 'Accommodation', employee: 'David Lee', reference: 'INV-5511', attachments: 2, exGst: 409.09, gst: 40.91, total: 450.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 17, date: '16 May 2026', description: 'AdBlue Fluid 20L', category: 'Maintenance', employee: 'Michael Brown', reference: 'RPT-8430', attachments: 1, exGst: 54.55, gst: 5.45, total: 60.00, status: 'Pending Approval', paymentStatus: 'Unpaid' },
    { id: 18, date: '16 May 2026', description: 'Windscreen Replacement', category: 'Repairs', employee: 'John Smith', reference: 'INV-7698', attachments: 3, exGst: 318.18, gst: 31.82, total: 350.00, status: 'Overdue', paymentStatus: 'Unpaid' },
    { id: 19, date: '15 May 2026', description: 'Fuel - Truck 03', category: 'Fuel', employee: 'Sarah Jones', reference: 'RPT-8422', attachments: 1, exGst: 190.91, gst: 19.09, total: 210.00, status: 'Reimbursed', paymentStatus: 'Paid' },
    { id: 20, date: '15 May 2026', description: 'Logistics Seminar Fee', category: 'Other', employee: 'David Lee', reference: 'INV-5490', attachments: 1, exGst: 272.73, gst: 27.27, total: 300.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 21, date: '14 May 2026', description: 'Airport Parking', category: 'Parking', employee: 'Sarah Jones', reference: 'RPT-8419', attachments: 1, exGst: 31.82, gst: 3.18, total: 35.00, status: 'Pending Approval', paymentStatus: 'Unpaid' },
    { id: 22, date: '14 May 2026', description: 'Fuel - Truck 12', category: 'Fuel', employee: 'John Smith', reference: 'RPT-8415', attachments: 2, exGst: 209.09, gst: 20.91, total: 230.00, status: 'Reimbursed', paymentStatus: 'Paid' },
    { id: 23, date: '13 May 2026', description: 'Team Coffee & Snacks', category: 'Meals', employee: 'Michael Brown', reference: 'RPT-8408', attachments: 0, exGst: 25.45, gst: 2.55, total: 28.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 24, date: '13 May 2026', description: 'Safety Boots', category: 'Other', employee: 'James Wilson', reference: 'INV-7650', attachments: 1, exGst: 136.36, gst: 13.64, total: 150.00, status: 'Pending Approval', paymentStatus: 'Unpaid' },
    { id: 25, date: '12 May 2026', description: 'Toll - M4 Express', category: 'Tolls', employee: 'David Lee', reference: 'TOL-5601', attachments: 0, exGst: 14.55, gst: 1.45, total: 16.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 26, date: '12 May 2026', description: 'Brake Pads Replacement', category: 'Repairs', employee: 'John Smith', reference: 'INV-7644', attachments: 2, exGst: 454.55, gst: 45.45, total: 500.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 27, date: '11 May 2026', description: 'Fuel - Truck 09', category: 'Fuel', employee: 'Michael Brown', reference: 'RPT-8395', attachments: 1, exGst: 218.18, gst: 21.82, total: 240.00, status: 'Reimbursed', paymentStatus: 'Paid' },
    { id: 28, date: '11 May 2026', description: 'Printer Toner Cartridge', category: 'Office', employee: 'Sarah Jones', reference: 'INV-5460', attachments: 1, exGst: 109.09, gst: 10.91, total: 120.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 29, date: '10 May 2026', description: 'Fuel - Truck 02', category: 'Fuel', employee: 'James Wilson', reference: 'RPT-8388', attachments: 2, exGst: 172.73, gst: 17.27, total: 190.00, status: 'Pending Approval', paymentStatus: 'Unpaid' },
    { id: 30, date: '10 May 2026', description: 'Forklift Hydraulic Oil', category: 'Maintenance', employee: 'David Lee', reference: 'INV-7622', attachments: 1, exGst: 118.18, gst: 11.82, total: 130.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 31, date: '09 May 2026', description: 'Motel - Newcastle Depot', category: 'Accommodation', employee: 'John Smith', reference: 'INV-5433', attachments: 1, exGst: 145.45, gst: 14.55, total: 160.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 32, date: '09 May 2026', description: 'Courier Satchel Fee', category: 'Other', employee: 'Sarah Jones', reference: 'RPT-8370', attachments: 0, exGst: 13.64, gst: 1.36, total: 15.00, status: 'Reimbursed', paymentStatus: 'Paid' },
    { id: 33, date: '08 May 2026', description: 'Fuel - Truck 14', category: 'Fuel', employee: 'Michael Brown', reference: 'RPT-8362', attachments: 1, exGst: 245.45, gst: 24.55, total: 270.00, status: 'Reimbursed', paymentStatus: 'Paid' },
    { id: 34, date: '08 May 2026', description: 'Tailgate Repair', category: 'Repairs', employee: 'James Wilson', reference: 'INV-7601', attachments: 3, exGst: 545.45, gst: 54.55, total: 600.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 35, date: '07 May 2026', description: 'Toll - EastLink', category: 'Tolls', employee: 'John Smith', reference: 'TOL-5590', attachments: 0, exGst: 11.82, gst: 1.18, total: 13.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 36, date: '07 May 2026', description: 'Client Dinner', category: 'Meals', employee: 'David Lee', reference: 'RPT-8350', attachments: 2, exGst: 113.64, gst: 11.36, total: 125.00, status: 'Pending Approval', paymentStatus: 'Unpaid' },
    { id: 37, date: '06 May 2026', description: 'Fuel - Truck 06', category: 'Fuel', employee: 'Sarah Jones', reference: 'RPT-8342', attachments: 1, exGst: 195.45, gst: 19.55, total: 215.00, status: 'Reimbursed', paymentStatus: 'Paid' },
    { id: 38, date: '06 May 2026', description: 'Wiper Blades & Fluid', category: 'Maintenance', employee: 'Michael Brown', reference: 'RPT-8338', attachments: 1, exGst: 40.91, gst: 4.09, total: 45.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 39, date: '05 May 2026', description: 'Fuel - Van 02', category: 'Fuel', employee: 'James Wilson', reference: 'RPT-8325', attachments: 1, exGst: 127.27, gst: 12.73, total: 140.00, status: 'Reimbursed', paymentStatus: 'Paid' },
    { id: 40, date: '05 May 2026', description: 'Overnight Parking - Port', category: 'Parking', employee: 'John Smith', reference: 'RPT-8320', attachments: 1, exGst: 22.73, gst: 2.27, total: 25.00, status: 'Approved', paymentStatus: 'Reimbursed' },
    { id: 41, date: '04 May 2026', description: 'Fuel - Truck 11', category: 'Fuel', employee: 'David Lee', reference: 'RPT-8311', attachments: 2, exGst: 213.64, gst: 21.36, total: 235.00, status: 'Reimbursed', paymentStatus: 'Paid' },
    { id: 42, date: '04 May 2026', description: 'First Aid Kit Refill', category: 'Office', employee: 'Sarah Jones', reference: 'INV-5401', attachments: 1, exGst: 59.09, gst: 5.91, total: 65.00, status: 'Approved', paymentStatus: 'Reimbursed' },
  ], []);

  // --- FILTERED DATA ---
  const filteredExpenses = useMemo(() => {
    return allExpenses.filter(exp => {
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
  }, [allExpenses, activeTab, selectedCategory, selectedEmployee, selectedStatus, selectedPaymentStatus, searchQuery]);

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
  const kpis = [
    { title: 'Total Expenses (This Period)', value: '$18,750.00', sub: '42 expenses', trend: '15.2%', isUp: true, trendLabel: 'vs last period', link: 'View summary →', bg: 'bg-blue-50 text-blue-600', icon: <CreditCard size={20} /> },
    { title: 'Pending Approval', value: '$4,250.00', sub: '9 expenses', link: 'View items →', bg: 'bg-emerald-50 text-emerald-600', icon: <Calendar size={20} /> },
    { title: 'Approved (This Period)', value: '$13,200.00', sub: '30 expenses', link: 'View items →', bg: 'bg-amber-50 text-amber-600', icon: <Users size={20} /> },
    { title: 'Reimbursed (This Period)', value: '$11,850.00', sub: '28 expenses', link: 'View payments →', bg: 'bg-purple-50 text-purple-600', icon: <Wallet size={20} /> },
    { title: 'Overdue Expenses', value: '$700.00', sub: '2 expenses', overdueCount: 2, link: 'View overdue →', bg: 'bg-rose-50 text-rose-600', icon: <AlertCircle size={20} /> },
    { title: 'This Period vs Last', value: '15.2%', isUp: true, subLabel: 'vs $16,280.03', link: 'View report →', bg: 'bg-teal-50 text-teal-600', icon: <Activity size={20} /> },
  ];

  // --- CHART DATA ---
  const barChartData = [
    { name: 'Fuel', amount: 5280, fill: '#3b82f6' },
    { name: 'Repairs', amount: 4125, fill: '#a855f7' },
    { name: 'Tolls', amount: 2310, fill: '#06b6d4' },
    { name: 'Accommodation', amount: 2200, fill: '#f97316' },
    { name: 'Other', amount: 4835, fill: '#60a5fa' },
  ];

  const pieChartData = [
    { name: 'Fuel', value: 5280, percent: '28.2%', color: '#3b82f6' },
    { name: 'Repairs', value: 4125, percent: '22.0%', color: '#a855f7' },
    { name: 'Tolls', value: 2310, percent: '12.3%', color: '#06b6d4' },
    { name: 'Accommodation', value: 2200, percent: '11.7%', color: '#f97316' },
    { name: 'Other', value: 4835, percent: '25.8%', color: '#60a5fa' },
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
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2">
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
                <button className="text-[10px] text-blue-600 font-bold hover:underline">
                  {kpi.link}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="px-4 sm:px-8 mb-6 flex-shrink-0">
        <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full xl:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by description, category, employee, etc..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Select Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <select 
              value={selectedCategory} 
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
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
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
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
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
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
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Payment Status</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Reimbursed">Reimbursed</option>
              <option value="Paid">Paid</option>
            </select>

            {/* Date Range Selector */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
              <Calendar size={14} className="text-slate-400" />
              <span>{dateRange}</span>
            </div>

            <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-sm">
              <Filter size={14} className="text-slate-400" /> Filters
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
            {/* Tabs & Top Actions Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 pt-4 pb-2 border-b border-slate-200 gap-4">
              {/* Tabs */}
              <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                {[
                  { name: 'All Expenses', count: 42 },
                  { name: 'Pending Approval', count: 9 },
                  { name: 'Approved', count: 30 },
                  { name: 'Reimbursed', count: 28 },
                  { name: 'Overdue', count: 2 },
                  { name: 'Cancelled', count: 0 },
                ].map(tab => (
                  <button 
                    key={tab.name}
                    onClick={() => { setActiveTab(tab.name); setCurrentPage(1); }}
                    className={`pb-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors ${activeTab === tab.name ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                  >
                    {tab.name} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 pb-2 md:pb-0">
                <button 
                  onClick={() => { setToastMessage('Export started...'); setTimeout(() => setToastMessage(null), 3000); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-sm"
                >
                  <Download size={13} className="text-slate-400" /> Export
                </button>
                
                <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-sm cursor-pointer focus:outline-none">
                  <option>Bulk Actions</option>
                  <option>Approve Selected</option>
                  <option>Mark as Paid</option>
                  <option>Delete Selected</option>
                </select>

                <button 
                  onClick={() => { setToastMessage('New expense modal opened'); setTimeout(() => setToastMessage(null), 3000); }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  <Plus size={14} /> New Expense
                </button>
              </div>
            </div>

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
                        <td className="px-3 py-3 text-[11px] font-bold text-slate-900">{exp.description}</td>
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
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="p-1 text-slate-400 hover:text-slate-600 rounded"><Eye size={14}/></button>
                            <button className="p-1 text-slate-400 hover:text-slate-600 rounded"><MoreVertical size={14}/></button>
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
                    className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded text-xs font-bold transition-colors ${currentPage === page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
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
                  <button className="text-[11px] text-blue-600 font-bold hover:underline">View all</button>
                </div>
                <div className="space-y-3">
                  {[
                    { title: 'Fuel - Truck 12', emp: 'John Smith', date: '24 May 2026', amount: '$199.00', status: 'Pending Approval', statusColor: 'bg-amber-50 text-amber-600', iconBg: 'bg-blue-50 text-blue-600' },
                    { title: 'Toll - M7', emp: 'Michael Brown', date: '24 May 2026', amount: '$14.00', status: 'Pending Approval', statusColor: 'bg-amber-50 text-amber-600', iconBg: 'bg-teal-50 text-teal-600' },
                    { title: 'Tyre Repair', emp: 'John Smith', date: '23 May 2026', amount: '$275.00', status: 'Approved', statusColor: 'bg-emerald-50 text-emerald-600', iconBg: 'bg-purple-50 text-purple-600' },
                    { title: 'Office Supplies', emp: 'Sarah Jones', date: '23 May 2026', amount: '$50.00', status: 'Approved', statusColor: 'bg-emerald-50 text-emerald-600', iconBg: 'bg-amber-50 text-amber-600' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${item.iconBg}`}>
                          <FileText size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.title}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{item.emp} • {item.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">{item.amount}</p>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.statusColor}`}>
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
                  <span className="text-xs font-black text-slate-900">$18,750.00</span>
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
              <button className="text-[11px] text-blue-600 font-bold hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Fuel', amount: '$5,280.00', icon: <Fuel size={14} className="text-blue-500"/> },
                { name: 'Repairs', amount: '$4,125.00', icon: <Wrench size={14} className="text-purple-500"/> },
                { name: 'Tolls', amount: '$2,310.00', icon: <Compass size={14} className="text-teal-500"/> },
                { name: 'Accommodation', amount: '$2,200.00', icon: <Building2 size={14} className="text-orange-500"/> },
                { name: 'Other', amount: '$4,835.00', icon: <CreditCard size={14} className="text-slate-400"/> },
              ].map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-50 last:border-none">
                  <span className="flex items-center gap-2 font-semibold text-slate-700">
                    {cat.icon} {cat.name}
                  </span>
                  <span className="font-black text-slate-900">{cat.amount}</span>
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
              className="w-full h-9 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <UploadCloud size={14} className="text-slate-400"/> Upload Receipt
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { setToastMessage('Create New Expense triggered.'); setTimeout(() => setToastMessage(null), 3000); }}
                className="w-full h-9 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                <Plus size={14} /> New Expense
              </button>
              <button className="w-full h-9 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold transition-colors">
                <Download size={14} className="text-slate-400"/> Import Expenses
              </button>
              <button className="w-full h-9 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold transition-colors">
                <ShieldCheck size={14} className="text-slate-400"/> Expense Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
