import React, { useState, useMemo } from 'react';
import { 
  Search, Calendar, Filter, Download, Eye, MoreVertical, 
  DollarSign, Droplets, Wrench, CircleDashed, Shield, FileText, 
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, 
  Zap, Clock, AlertCircle, Info, Flame, CheckCircle2, X, Trash2, Edit3, ExternalLink
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, 
  BarChart, Bar
} from 'recharts';

export default function VehicleCosts() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All Vehicle Types');
  const [vehicleFilter, setVehicleFilter] = useState('All Vehicles');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [dateRange, setDateRange] = useState('1 May 2026 – 31 May 2026');
  const [activeTab, setActiveTab] = useState('Vehicle Summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals & Popovers State
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDetailModal, setSelectedDetailModal] = useState(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Toast Helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // --- RAW MOCK DATA ---
  const [rawVehicleData, setRawVehicleData] = useState([
    { id: 1, name: 'MAN TGX 26.580', desc: 'Prime Mover', type: 'Truck', rego: 'XYZ-123', fuel: 5800, maintenance: 3900, tyres: 1200, insurance: 1600, other: 3175, costPerKm: '$0.92', costPerDay: '$45.83', vsApr: 8.6, img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 2, name: 'Volvo FH16 750', desc: 'Prime Mover', type: 'Truck', rego: 'ABC-456', fuel: 5200, maintenance: 3500, tyres: 1100, insurance: 1450, other: 2896, costPerKm: '$0.88', costPerDay: '$40.42', vsApr: 5.2, img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 3, name: 'Scania R660', desc: 'Prime Mover', type: 'Truck', rego: 'DEF-789', fuel: 4800, maintenance: 3200, tyres: 1000, insurance: 1350, other: 2762, costPerKm: '$0.95', costPerDay: '$43.17', vsApr: -12.1, img: 'https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 4, name: 'MaxiTRANS ST3', desc: 'Car Carrier Trailer', type: 'Trailer', rego: 'TR-001', fuel: 0, maintenance: 2100, tyres: 1400, insurance: 1100, other: 1648, costPerKm: '$0.41', costPerDay: '$20.15', vsApr: 2.7, img: 'https://images.unsplash.com/photo-1583344165581-9b19e917d3b5?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 5, name: 'MaxiTRANS ST3', desc: 'Car Carrier Trailer', type: 'Trailer', rego: 'TR-002', fuel: 0, maintenance: 1850, tyres: 1250, insurance: 950, other: 1362, costPerKm: '$0.38', costPerDay: '$18.97', vsApr: -7.8, img: 'https://images.unsplash.com/photo-1583344165581-9b19e917d3b5?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 6, name: 'Mercedes Actros 2653', desc: 'Prime Mover', type: 'Truck', rego: 'GHI-012', fuel: 4200, maintenance: 2800, tyres: 900, insurance: 1200, other: 2285, costPerKm: '$0.90', costPerDay: '$42.03', vsApr: 13.4, img: 'https://images.unsplash.com/photo-1616428784116-2495d4d38096?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 7, name: 'Kenworth T909', desc: 'Prime Mover', type: 'Truck', rego: 'JKL-345', fuel: 3900, maintenance: 2550, tyres: 850, insurance: 1050, other: 2166, costPerKm: '$0.85', costPerDay: '$38.91', vsApr: -15.6, img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=100&h=100&q=80' },
    { id: 8, name: 'MTE Deck Widener', desc: 'Car Carrier Trailer', type: 'Trailer', rego: 'TR-003', fuel: 0, maintenance: 1950, tyres: 1300, insurance: 1000, other: 2438, costPerKm: '$0.43', costPerDay: '$19.23', vsApr: 1.9, img: 'https://images.unsplash.com/photo-1583344165581-9b19e917d3b5?auto=format&fit=crop&w=100&h=100&q=80' },
  ]);

  // Data for Tab 2: Transactions
  const [rawTransactions, setRawTransactions] = useState([
    { id: 'TX-901', date: '28 May 2026', vehicle: 'MAN TGX 26.580', rego: 'XYZ-123', type: 'Truck', category: 'Fuel', desc: 'Shell Diesel Depot #402', ref: 'INV-88301', amountEx: 1450.00, amountInc: 1595.00, payment: 'Fuel Card', status: 'Paid' },
    { id: 'TX-902', date: '26 May 2026', vehicle: 'Volvo FH16 750', rego: 'ABC-456', type: 'Truck', category: 'Maintenance & Repairs', desc: 'Hydraulic Hose Replacement', ref: 'INV-88240', amountEx: 850.00, amountInc: 935.00, payment: 'Direct Credit', status: 'Paid' },
    { id: 'TX-903', date: '24 May 2026', vehicle: 'Scania R660', rego: 'DEF-789', type: 'Truck', category: 'Fuel', desc: 'BP Truckstop Marulan', ref: 'INV-88190', amountEx: 1200.00, amountInc: 1320.00, payment: 'Fuel Card', status: 'Paid' },
    { id: 'TX-904', date: '22 May 2026', vehicle: 'MaxiTRANS ST3', rego: 'TR-001', type: 'Trailer', category: 'Tyres', desc: '2x Bridgestone R249 Steer Tyres', ref: 'INV-88050', amountEx: 1400.00, amountInc: 1540.00, payment: 'Account 30-Day', status: 'Pending' },
    { id: 'TX-905', date: '20 May 2026', vehicle: 'Mercedes Actros 2653', rego: 'GHI-012', type: 'Truck', category: 'Insurance', desc: 'Fleet Premium Q2 Installment', ref: 'INS-9921', amountEx: 1200.00, amountInc: 1320.00, payment: 'Direct Debit', status: 'Paid' },
    { id: 'TX-906', date: '18 May 2026', vehicle: 'Kenworth T909', rego: 'JKL-345', type: 'Truck', category: 'Fuel', desc: 'Caltex StarCard Refuel', ref: 'INV-87990', amountEx: 1650.00, amountInc: 1815.00, payment: 'Fuel Card', status: 'Paid' },
    { id: 'TX-907', date: '15 May 2026', vehicle: 'MTE Deck Widener', rego: 'TR-003', type: 'Trailer', category: 'Maintenance & Repairs', desc: 'Brake Pad & Drum Overhaul', ref: 'INV-87840', amountEx: 1950.00, amountInc: 2145.00, payment: 'Direct Credit', status: 'Paid' },
    { id: 'TX-908', date: '12 May 2026', vehicle: 'MAN TGX 26.580', rego: 'XYZ-123', type: 'Truck', category: 'Other Costs', desc: 'NSW Tolls & Permit Clearance', ref: 'TOL-44210', amountEx: 375.00, amountInc: 412.50, payment: 'E-Toll Account', status: 'Paid' },
  ]);

  // Data for Tab 3: Upcoming Costs
  const [rawUpcomingCosts, setRawUpcomingCosts] = useState([
    { id: 'UC-101', title: 'Schedule B Service - MAN TGX 26.580', vehicle: 'MAN TGX 26.580', rego: 'XYZ-123', type: 'Truck', date: '04 Jun 2026', category: 'Maintenance & Repairs', amount: 1250.00, priority: 'High', status: 'Due Soon', workshop: 'MAN Truck Centre Sydney' },
    { id: 'UC-102', title: 'Steer Tyre Replacement (Scania R660)', vehicle: 'Scania R660', rego: 'DEF-789', type: 'Truck', date: '08 Jun 2026', category: 'Tyres', amount: 2860.00, priority: 'High', status: 'Due Soon', workshop: 'Bridgestone Fleet Care' },
    { id: 'UC-103', title: 'Quarterly Fleet Insurance Installment', vehicle: 'Volvo FH16 750', rego: 'ABC-456', type: 'Truck', date: '15 Jun 2026', category: 'Insurance', amount: 4455.00, priority: 'Medium', status: 'Due Soon', workshop: 'NTI Insurance' },
    { id: 'UC-104', title: 'Annual Heavy Vehicle Registration', vehicle: 'Mercedes Actros 2653', rego: 'GHI-012', type: 'Truck', date: '20 Jun 2026', category: 'Other Costs', amount: 850.00, priority: 'Normal', status: 'Scheduled', workshop: 'Transport for NSW' },
    { id: 'UC-105', title: 'Trailer Ramp Hydraulics Inspection', vehicle: 'MaxiTRANS ST3', rego: 'TR-001', type: 'Trailer', date: '25 Jun 2026', category: 'Maintenance & Repairs', amount: 620.00, priority: 'Normal', status: 'Scheduled', workshop: 'MaxiTRANS Service Hub' },
    { id: 'UC-106', title: 'Transmission Fluid & Filter Service', vehicle: 'Kenworth T909', rego: 'JKL-345', type: 'Truck', date: '02 Jul 2026', category: 'Maintenance & Repairs', amount: 1890.00, priority: 'Normal', status: 'Scheduled', workshop: 'Cummins South Pacific' }
  ]);

  // Data for Tab 4: Service History
  const [rawServiceHistory, setRawServiceHistory] = useState([
    { id: 'SH-501', date: '15 Apr 2026', vehicle: 'MAN TGX 26.580', rego: 'XYZ-123', type: 'Truck', odo: '245,800 km', serviceType: 'Full Major Service (100k km)', workshop: 'MAN Truck Centre Sydney', invoice: 'INV-77210', cost: 3900.00, status: 'Completed' },
    { id: 'SH-502', date: '02 Apr 2026', vehicle: 'Volvo FH16 750', rego: 'ABC-456', type: 'Truck', odo: '189,400 km', serviceType: 'Engine Oil & Filter Change', workshop: 'Volvo Commercial Vehicles', invoice: 'INV-76904', cost: 1850.00, status: 'Completed' },
    { id: 'SH-503', date: '18 Mar 2026', vehicle: 'Scania R660', rego: 'DEF-789', type: 'Truck', odo: '312,150 km', serviceType: 'Brake Linings & Air System Check', workshop: 'Scania Australia Workshop', invoice: 'INV-75400', cost: 2400.00, status: 'Completed' },
    { id: 'SH-504', date: '10 Mar 2026', vehicle: 'MaxiTRANS ST3', rego: 'TR-001', type: 'Trailer', odo: 'N/A (Trailer)', serviceType: 'Kingpin & Turntable Service', workshop: 'MaxiTRANS Fleet Hub', invoice: 'INV-74890', cost: 1100.00, status: 'Completed' },
    { id: 'SH-505', date: '24 Feb 2026', vehicle: 'Mercedes Actros 2653', rego: 'GHI-012', type: 'Truck', odo: '142,300 km', serviceType: 'AdBlue System Flush & Sensor Swap', workshop: 'Daimler Truck Centre', invoice: 'INV-73210', cost: 2150.00, status: 'Completed' },
    { id: 'SH-506', date: '12 Feb 2026', vehicle: 'Kenworth T909', rego: 'JKL-345', type: 'Truck', odo: '410,900 km', serviceType: 'Differential Oil Replacement', workshop: 'Brown & Hurley Kenworth', invoice: 'INV-72100', cost: 1650.00, status: 'Completed' },
  ]);

  const trendData = [
    { name: 'Jun 2025', cost: 45000 },
    { name: 'Jul 2025', cost: 48000 },
    { name: 'Aug 2025', cost: 47000 },
    { name: 'Sep 2025', cost: 52000 },
    { name: 'Oct 2025', cost: 58000 },
    { name: 'Nov 2025', cost: 65000 },
    { name: 'Dec 2025', cost: 72000 },
    { name: 'Jan 2026', cost: 68000 },
    { name: 'Feb 2026', cost: 69000 },
    { name: 'Mar 2026', cost: 74000 },
    { name: 'Apr 2026', cost: 82000 },
    { name: 'May 2026', cost: 87540 },
  ];

  // --- FILTERING LOGIC FOR ALL TABS ---
  const filteredVehicles = useMemo(() => {
    return rawVehicleData.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            v.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            v.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = vehicleTypeFilter === 'All Vehicle Types' || v.type === vehicleTypeFilter;
      const matchesVehicle = vehicleFilter === 'All Vehicles' || v.name === vehicleFilter;
      
      return matchesSearch && matchesType && matchesVehicle;
    });
  }, [rawVehicleData, searchQuery, vehicleTypeFilter, vehicleFilter]);

  const filteredTransactions = useMemo(() => {
    return rawTransactions.filter(t => {
      const matchesSearch = t.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = vehicleTypeFilter === 'All Vehicle Types' || t.type === vehicleTypeFilter;
      const matchesVehicle = vehicleFilter === 'All Vehicles' || t.vehicle === vehicleFilter;
      const matchesCat = categoryFilter === 'All Categories' || t.category === categoryFilter;

      return matchesSearch && matchesType && matchesVehicle && matchesCat;
    });
  }, [rawTransactions, searchQuery, vehicleTypeFilter, vehicleFilter, categoryFilter]);

  const filteredUpcomingCosts = useMemo(() => {
    return rawUpcomingCosts.filter(uc => {
      const matchesSearch = uc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            uc.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            uc.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            uc.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = vehicleTypeFilter === 'All Vehicle Types' || uc.type === vehicleTypeFilter;
      const matchesVehicle = vehicleFilter === 'All Vehicles' || uc.vehicle === vehicleFilter;
      const matchesCat = categoryFilter === 'All Categories' || uc.category === categoryFilter;

      return matchesSearch && matchesType && matchesVehicle && matchesCat;
    });
  }, [rawUpcomingCosts, searchQuery, vehicleTypeFilter, vehicleFilter, categoryFilter]);

  const filteredServiceHistory = useMemo(() => {
    return rawServiceHistory.filter(sh => {
      const matchesSearch = sh.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sh.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sh.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sh.workshop.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = vehicleTypeFilter === 'All Vehicle Types' || sh.type === vehicleTypeFilter;
      const matchesVehicle = vehicleFilter === 'All Vehicles' || sh.vehicle === vehicleFilter;

      return matchesSearch && matchesType && matchesVehicle;
    });
  }, [rawServiceHistory, searchQuery, vehicleTypeFilter, vehicleFilter]);

  // Current Paginated Dataset depending on Active Tab
  const activeDataset = useMemo(() => {
    if (activeTab === 'Vehicle Summary') return filteredVehicles;
    if (activeTab === 'Transactions') return filteredTransactions;
    if (activeTab === 'Upcoming Costs') return filteredUpcomingCosts;
    if (activeTab === 'Service History') return filteredServiceHistory;
    return [];
  }, [activeTab, filteredVehicles, filteredTransactions, filteredUpcomingCosts, filteredServiceHistory]);

  const paginatedDataset = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return activeDataset.slice(startIndex, startIndex + itemsPerPage);
  }, [activeDataset, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(activeDataset.length / itemsPerPage) || 1;

  // Calculate dynamic totals from filtered vehicles
  const totals = useMemo(() => {
    return filteredVehicles.reduce((acc, v) => ({
      fuel: acc.fuel + v.fuel,
      maintenance: acc.maintenance + v.maintenance,
      tyres: acc.tyres + v.tyres,
      insurance: acc.insurance + v.insurance,
      other: acc.other + v.other,
      exGst: acc.exGst + v.fuel + v.maintenance + v.tyres + v.insurance + v.other,
    }), { fuel: 0, maintenance: 0, tyres: 0, insurance: 0, other: 0, exGst: 0 });
  }, [filteredVehicles]);

  const totalIncGst = totals.exGst * 1.1; // adding 10% GST

  const kpiData = [
    { title: 'Total Vehicle Costs (This Period)', value: `$${totalIncGst.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: 12.8, trendLabel: 'vs Apr 2026', icon: <DollarSign size={20} className="text-blue-500" />, iconBg: 'bg-blue-50', trendColor: 'text-emerald-500' },
    { title: 'Fuel Costs', value: `$${(totals.fuel * 1.1).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: 9.4, trendLabel: 'vs Apr 2026', icon: <Droplets size={20} className="text-emerald-500" />, iconBg: 'bg-emerald-50', trendColor: 'text-emerald-500' },
    { title: 'Maintenance & Repairs', value: `$${(totals.maintenance * 1.1).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: 16.1, trendLabel: 'vs Apr 2026', icon: <Wrench size={20} className="text-amber-500" />, iconBg: 'bg-amber-50', trendColor: 'text-emerald-500' },
    { title: 'Tyres', value: `$${(totals.tyres * 1.1).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: -3.2, trendLabel: 'vs Apr 2026', icon: <CircleDashed size={20} className="text-blue-500" />, iconBg: 'bg-blue-50', trendColor: 'text-rose-500' },
    { title: 'Insurance', value: `$${(totals.insurance * 1.1).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: 2.6, trendLabel: 'vs Apr 2026', icon: <Shield size={20} className="text-purple-500" />, iconBg: 'bg-purple-50', trendColor: 'text-emerald-500' },
    { title: 'Other Costs', value: `$${(totals.other * 1.1).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: 22.1, trendLabel: 'vs Apr 2026', icon: <FileText size={20} className="text-slate-500" />, iconBg: 'bg-slate-100', trendColor: 'text-emerald-500' },
  ];

  const pieData = [
    { name: 'Fuel', value: totals.fuel * 1.1, color: '#3b82f6' },
    { name: 'Maintenance & Repairs', value: totals.maintenance * 1.1, color: '#f59e0b' },
    { name: 'Tyres', value: totals.tyres * 1.1, color: '#10b981' },
    { name: 'Insurance', value: totals.insurance * 1.1, color: '#a855f7' },
    { name: 'Other Costs', value: totals.other * 1.1, color: '#94a3b8' },
  ].filter(item => item.value > 0);

  const formatPercent = (val, total) => total === 0 ? '0%' : `${((val / total) * 100).toFixed(1)}%`;

  const barData = [
    { name: 'Fuel', value: totals.fuel * 1.1, percent: formatPercent(totals.fuel * 1.1, totalIncGst), color: '#3b82f6' },
    { name: 'Maintenance & Repairs', value: totals.maintenance * 1.1, percent: formatPercent(totals.maintenance * 1.1, totalIncGst), color: '#f59e0b' },
    { name: 'Tyres', value: totals.tyres * 1.1, percent: formatPercent(totals.tyres * 1.1, totalIncGst), color: '#10b981' },
    { name: 'Insurance', value: totals.insurance * 1.1, percent: formatPercent(totals.insurance * 1.1, totalIncGst), color: '#a855f7' },
    { name: 'Other Costs', value: totals.other * 1.1, percent: formatPercent(totals.other * 1.1, totalIncGst), color: '#94a3b8' },
  ];

  const uniqueVehicleNames = [...new Set(rawVehicleData.map(v => v.name))];

  // --- EXPORT CSV HANDLER ---
  const handleExportCSV = () => {
    let headers = [];
    let rows = [];

    if (activeTab === 'Vehicle Summary') {
      headers = ['Vehicle', 'Type', 'Rego', 'Fuel', 'Maintenance', 'Tyres', 'Insurance', 'Other', 'Total Ex GST', 'Total Inc GST', 'Cost/km', 'Cost/day'];
      rows = filteredVehicles.map(v => {
        const ex = v.fuel + v.maintenance + v.tyres + v.insurance + v.other;
        return [v.name, v.type, v.rego, v.fuel, v.maintenance, v.tyres, v.insurance, v.other, ex, (ex * 1.1).toFixed(2), v.costPerKm, v.costPerDay];
      });
    } else if (activeTab === 'Transactions') {
      headers = ['TX ID', 'Date', 'Vehicle', 'Rego', 'Type', 'Category', 'Description', 'Ref', 'Amount Ex GST', 'Amount Inc GST', 'Payment', 'Status'];
      rows = filteredTransactions.map(t => [t.id, t.date, t.vehicle, t.rego, t.type, t.category, t.desc, t.ref, t.amountEx, t.amountInc, t.payment, t.status]);
    } else if (activeTab === 'Upcoming Costs') {
      headers = ['Cost ID', 'Title', 'Vehicle', 'Rego', 'Type', 'Due Date', 'Category', 'Amount', 'Priority', 'Status', 'Workshop'];
      rows = filteredUpcomingCosts.map(uc => [uc.id, uc.title, uc.vehicle, uc.rego, uc.type, uc.date, uc.category, uc.amount, uc.priority, uc.status, uc.workshop]);
    } else if (activeTab === 'Service History') {
      headers = ['Service ID', 'Date', 'Vehicle', 'Rego', 'Type', 'Odometer', 'Service Type', 'Workshop', 'Invoice', 'Cost', 'Status'];
      rows = filteredServiceHistory.map(sh => [sh.id, sh.date, sh.vehicle, sh.rego, sh.type, sh.odo, sh.serviceType, sh.workshop, sh.invoice, sh.cost, sh.status]);
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Vehicle_Costs_${activeTab.replace(/\s+/g, '_')}_${dateRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`Exported ${activeTab} data to CSV successfully!`);
  };

  // --- DELETE ROW HANDLER ---
  const handleDeleteRow = (id, tabName) => {
    if (tabName === 'Vehicle Summary') {
      setRawVehicleData(prev => prev.filter(v => v.id !== id));
    } else if (tabName === 'Transactions') {
      setRawTransactions(prev => prev.filter(t => t.id !== id));
    } else if (tabName === 'Upcoming Costs') {
      setRawUpcomingCosts(prev => prev.filter(uc => uc.id !== id));
    } else if (tabName === 'Service History') {
      setRawServiceHistory(prev => prev.filter(sh => sh.id !== id));
    }
    setActiveActionMenuId(null);
    triggerToast(`Record removed from ${tabName}`);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc] text-slate-800 font-sans overflow-y-auto w-full relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="px-4 sm:px-8 pt-6 pb-4 flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Vehicle Costs</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Track and manage all operating costs for your trucks, trailers and other vehicles.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5 flex-shrink-0">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${kpi.iconBg}`}>
                {kpi.icon}
              </div>
              <button 
                onClick={() => {
                  if (kpi.title.includes('Fuel')) setCategoryFilter('Fuel');
                  else if (kpi.title.includes('Maintenance')) setCategoryFilter('Maintenance & Repairs');
                  else if (kpi.title.includes('Tyres')) setCategoryFilter('Tyres');
                  else if (kpi.title.includes('Insurance')) setCategoryFilter('Insurance');
                  else setCategoryFilter('All Categories');
                  triggerToast(`Filtered for ${kpi.title}`);
                }}
                className="text-[9px] text-blue-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Details →
              </button>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 truncate">{kpi.title}</p>
              <div className="text-lg font-black text-slate-900 mb-1 truncate">{kpi.value}</div>
              <div className="flex items-center gap-1 text-[10px] font-medium">
                <span className={`flex items-center gap-0.5 font-bold ${kpi.trendColor}`}>
                  {kpi.trend > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {Math.abs(kpi.trend)}%
                </span>
                <span className="text-slate-400">{kpi.trendLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="px-4 sm:px-8 mb-6 flex-shrink-0">
        {/* Row 1: Search full width on mobile */}
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1 sm:min-w-[180px] sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input 
              type="text" 
              placeholder="Search by vehicle, rego, type..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-8 py-2 sm:py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>
          
          {/* Row 2 on mobile: selects + actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Vehicle Type Filter */}
            <select 
              value={vehicleTypeFilter}
              onChange={(e) => { setVehicleTypeFilter(e.target.value); setCurrentPage(1); }}
              className="flex-1 min-w-[120px] px-3 py-2 sm:py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="All Vehicle Types">All Vehicle Types</option>
              <option value="Truck">Truck</option>
              <option value="Trailer">Trailer</option>
            </select>
            
            {/* Vehicle Filter */}
            <select 
              value={vehicleFilter}
              onChange={(e) => { setVehicleFilter(e.target.value); setCurrentPage(1); }}
              className="flex-1 min-w-[120px] px-3 py-2 sm:py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="All Vehicles">All Vehicles</option>
              {uniqueVehicleNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            {/* Date Range Picker Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <Calendar size={13} className="text-slate-400 flex-shrink-0" />
                <span className="hidden xs:inline">{dateRange}</span>
                <span className="xs:hidden">Date</span>
              </button>
              
              {showDatePicker && (
                <div className="absolute left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 text-xs">
                  {['1 May 2026 – 31 May 2026', '1 Apr 2026 – 30 Apr 2026', '1 Mar 2026 – 31 Mar 2026', 'Q1 2026 (Jan - Mar)', 'YTD 2026 (Jan - May)'].map(range => (
                    <button
                      key={range}
                      onClick={() => {
                        setDateRange(range);
                        setShowDatePicker(false);
                        triggerToast(`Date range set to ${range}`);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 font-medium ${dateRange === range ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Filters Modal Trigger */}
            <button 
              onClick={() => setShowFilterModal(true)}
              className={`flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${categoryFilter !== 'All Categories' ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              <Filter size={13} className="text-slate-500" />
              <span>Filters {categoryFilter !== 'All Categories' && `(1)`}</span>
            </button>
            
            {/* Export Button */}
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download size={13} className="text-slate-500" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-4 sm:px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-1">
        
        {/* LEFT COLUMN (Spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex px-3 sm:px-6 pt-2 border-b border-slate-200 gap-3 sm:gap-6 overflow-x-auto scrollbar-hide">
              {['Vehicle Summary', 'Transactions', 'Upcoming Costs', 'Service History'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                  className={`pb-3 border-b-2 text-[11px] sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Tab Content Tables */}
            <div className="flex-1 overflow-x-auto min-h-[320px]">
              
              {/* TAB 1: Vehicle Summary */}
              {activeTab === 'Vehicle Summary' && (
                <table className="min-w-[700px] w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rego / ID</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Total Cost (Ex GST)</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Total Cost (Inc GST)</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Cost / km</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Cost / day</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">vs Apr 2026</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedDataset.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-6 py-12 text-center text-slate-500 text-xs font-medium">No vehicles found matching criteria.</td>
                      </tr>
                    ) : (
                      paginatedDataset.map(v => {
                        const totalEx = v.fuel + v.maintenance + v.tyres + v.insurance + v.other;
                        const totalInc = totalEx * 1.1;
                        return (
                          <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={v.img} alt={v.name} className="w-8 h-8 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                                <div>
                                  <div className="text-xs font-bold text-slate-900">{v.name}</div>
                                  <div className="text-[10px] text-slate-500">{v.desc}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${v.type === 'Truck' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                {v.type}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-xs font-semibold text-slate-700">{v.rego}</div>
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-semibold text-slate-900">${totalEx.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            <td className="px-4 py-3 text-right text-xs font-bold text-slate-900">${totalInc.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            <td className="px-4 py-3 text-right text-xs font-semibold text-slate-700">{v.costPerKm}</td>
                            <td className="px-4 py-3 text-right text-xs font-semibold text-slate-700">{v.costPerDay}</td>
                            <td className="px-4 py-3 text-right">
                              <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${v.vsApr > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {v.vsApr > 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                                {Math.abs(v.vsApr)}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center relative">
                              <div className="flex items-center justify-center gap-1">
                                <button onClick={() => setSelectedDetailModal(v)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"><Eye size={15} /></button>
                                <button onClick={() => setActiveActionMenuId(activeActionMenuId === v.id ? null : v.id)} className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"><MoreVertical size={15} /></button>
                              </div>

                              {activeActionMenuId === v.id && (
                                <div className="absolute right-4 top-8 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 text-left">
                                  <button onClick={() => { setSelectedDetailModal(v); setActiveActionMenuId(null); }} className="w-full px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Eye size={12}/> View Details</button>
                                  <button onClick={() => handleDeleteRow(v.id, 'Vehicle Summary')} className="w-full px-3 py-1.5 text-[11px] font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"><Trash2 size={12}/> Remove</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}

              {/* TAB 2: Transactions */}
              {activeTab === 'Transactions' && (
                <table className="min-w-[700px] w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vehicle & Rego</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description / Supplier</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ref No.</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount (Inc GST)</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedDataset.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-slate-500 text-xs font-medium">No transactions found.</td>
                      </tr>
                    ) : (
                      paginatedDataset.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3 text-xs font-semibold text-slate-700">{t.date}</td>
                          <td className="px-4 py-3">
                            <div className="text-xs font-bold text-slate-900">{t.vehicle}</div>
                            <div className="text-[10px] text-slate-500">{t.rego}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {t.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-700">{t.desc}</td>
                          <td className="px-4 py-3 text-xs font-mono text-slate-500">{t.ref}</td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-slate-900">${t.amountInc.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center relative">
                            <button onClick={() => handleDeleteRow(t.id, 'Transactions')} className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"><Trash2 size={15} /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* TAB 3: Upcoming Costs */}
              {activeTab === 'Upcoming Costs' && (
                <table className="min-w-[700px] w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scheduled Date</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expense Item & Vehicle</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Workshop</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Estimated Amount</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedDataset.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-slate-500 text-xs font-medium">No upcoming costs found.</td>
                      </tr>
                    ) : (
                      paginatedDataset.map(uc => (
                        <tr key={uc.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3 text-xs font-bold text-amber-600">{uc.date}</td>
                          <td className="px-4 py-3">
                            <div className="text-xs font-bold text-slate-900">{uc.title}</div>
                            <div className="text-[10px] text-slate-500">{uc.vehicle} ({uc.rego})</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                              {uc.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-700">{uc.workshop}</td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-slate-900">${uc.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${uc.status === 'Due Soon' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                              {uc.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => triggerToast(`Marked ${uc.id} as Paid!`)} className="px-2.5 py-1 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700 transition-colors cursor-pointer">
                              Pay / Clear
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* TAB 4: Service History */}
              {activeTab === 'Service History' && (
                <table className="min-w-[700px] w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Date</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vehicle & Rego</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Odometer Reading</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Details</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Service Workshop</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Total Cost</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedDataset.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-slate-500 text-xs font-medium">No service history records found.</td>
                      </tr>
                    ) : (
                      paginatedDataset.map(sh => (
                        <tr key={sh.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3 text-xs font-semibold text-slate-700">{sh.date}</td>
                          <td className="px-4 py-3">
                            <div className="text-xs font-bold text-slate-900">{sh.vehicle}</div>
                            <div className="text-[10px] text-slate-500">{sh.rego}</div>
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-600">{sh.odo}</td>
                          <td className="px-4 py-3 text-xs font-bold text-slate-800">{sh.serviceType}</td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-600">{sh.workshop}</td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-slate-900">${sh.cost.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              {sh.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

            </div>
            
            {/* Pagination Controls */}
            <div className="px-3 sm:px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between bg-slate-50/50 mt-auto gap-2">
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium order-1">
                Showing {activeDataset.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, activeDataset.length)} of {activeDataset.length}
              </span>
              <div className="flex items-center gap-1.5 order-3 sm:order-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50 cursor-pointer'}`}
                >
                  <ChevronLeft size={13}/>
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white font-bold text-xs">{currentPage}</button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white ${currentPage === totalPages || totalPages === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50 cursor-pointer'}`}
                >
                  <ChevronRight size={13}/>
                </button>
              </div>
              <select 
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 focus:outline-none cursor-pointer order-2 sm:order-3"
              >
                <option value={5}>5 / pg</option>
                <option value={10}>10 / pg</option>
                <option value={20}>20 / pg</option>
              </select>
            </div>
          </div>

          {/* Bottom Row (Under Table) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Cost Trend Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 sm:p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Cost Trend</h3>
                <button onClick={() => triggerToast("Loading Full Trend Analysis Report...")} className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                  View full report <ChevronRight size={12}/>
                </button>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={(val) => `$${val/1000}k`} />
                    <RechartsTooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upcoming Costs Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 sm:p-6 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Upcoming Costs</h3>
                <button onClick={() => setActiveTab('Upcoming Costs')} className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                  View all <ChevronRight size={12}/>
                </button>
              </div>
              <div className="space-y-4 flex-1">
                {rawUpcomingCosts.slice(0, 4).map((cost, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-50 text-amber-600 flex-shrink-0">
                        <Wrench size={14} />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-900 mb-0.5 truncate max-w-[150px] sm:max-w-[180px]">{cost.title}</div>
                        <div className="text-[10px] text-slate-500">{cost.date}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[11px] font-bold text-slate-900 mb-0.5">${cost.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border ${cost.status === 'Due Soon' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {cost.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4 sm:gap-6">
          
          {/* Top Right Card: Cost Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 sm:p-6 flex flex-col">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-6">Cost Breakdown (This Period)</h3>
            
            {/* Donut Chart */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
              <div className="relative w-32 h-32 flex-shrink-0">
                {totalIncGst > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => `$${value.toLocaleString(undefined, {maximumFractionDigits:0})}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                   <div className="w-full h-full rounded-full border-4 border-slate-100 flex items-center justify-center">
                     <span className="text-slate-300 font-medium text-xs">No Data</span>
                   </div>
                )}
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[13px] font-black text-slate-900">${totalIncGst > 1000000 ? (totalIncGst/1000000).toFixed(1)+'M' : totalIncGst > 1000 ? (totalIncGst/1000).toFixed(1)+'k' : totalIncGst.toFixed(0)}</span>
                  <span className="text-[9px] font-bold text-slate-500">Total</span>
                </div>
              </div>
              
              {/* Custom Legend */}
              <div className="flex flex-col gap-2 flex-1 w-full sm:w-auto">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor: item.color}}></span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-700">{item.name}</span>
                      <span className="text-[9px] text-slate-500">${item.value.toLocaleString(undefined, {maximumFractionDigits:0})} ({totalIncGst > 0 ? ((item.value / totalIncGst) * 100).toFixed(1) : 0}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Cost Vehicles List */}
            <div className="border-t border-slate-100 pt-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-slate-900">Top Cost Vehicles (This Period)</h3>
                <button onClick={() => setActiveTab('Vehicle Summary')} className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">View all</button>
              </div>
              
              <div className="space-y-2.5">
                {[...filteredVehicles]
                  .sort((a,b) => (b.fuel+b.maintenance+b.tyres+b.insurance+b.other) - (a.fuel+a.maintenance+a.tyres+a.insurance+a.other))
                  .slice(0, 4)
                  .map(v => {
                    const vTot = (v.fuel + v.maintenance + v.tyres + v.insurance + v.other) * 1.1;
                    return (
                      <div key={v.id} className="flex justify-between items-center">
                        <div className="text-[11px] font-medium text-slate-700 truncate mr-2" title={`${v.name} (${v.rego})`}>{v.name} ({v.rego})</div>
                        <div className="text-[11px] font-bold text-slate-900">${vTot.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</div>
                      </div>
                    )
                  })}
              </div>
            </div>
            
            {/* Key Insights Alert Box */}
            <div className="mt-5 bg-blue-50/50 rounded-xl p-3.5 border border-blue-100">
              <h3 className="text-xs font-bold text-slate-900 mb-2">Key Insights</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-[11px] text-slate-700">
                  <Flame size={14} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold text-slate-900">Fuel costs</span> are 9.4% higher than last month.</span>
                </li>
                <li className="flex items-start gap-2 text-[11px] text-slate-700">
                  <Wrench size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold text-slate-900">{filteredVehicles.length} vehicles</span> matched in current filter view.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Cost by Category (Bar Progress) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 sm:p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Cost by Category</h3>
            </div>
            
            <div className="flex-1 space-y-3.5">
              {barData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-24 sm:w-28 flex-shrink-0 text-[10px] font-bold text-slate-700 truncate">{item.name}</div>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: item.percent, backgroundColor: item.color }}></div>
                  </div>
                  <div className="w-16 flex-shrink-0 text-right text-[10px]">
                    <span className="font-bold text-slate-900">${item.value.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* FILTER MODAL */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Filter Vehicle Costs</h3>
              <button onClick={() => setShowFilterModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase mb-1.5 block">Category Filter</label>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
                >
                  <option value="All Categories">All Categories</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Maintenance & Repairs">Maintenance & Repairs</option>
                  <option value="Tyres">Tyres</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Other Costs">Other Costs</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase mb-1.5 block">Vehicle Type</label>
                <select 
                  value={vehicleTypeFilter}
                  onChange={(e) => setVehicleTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
                >
                  <option value="All Vehicle Types">All Vehicle Types</option>
                  <option value="Truck">Truck</option>
                  <option value="Trailer">Trailer</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button 
                onClick={() => {
                  setCategoryFilter('All Categories');
                  setVehicleTypeFilter('All Vehicle Types');
                  setVehicleFilter('All Vehicles');
                  setSearchQuery('');
                  setShowFilterModal(false);
                  triggerToast("Reset all filters");
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button 
                onClick={() => {
                  setShowFilterModal(false);
                  triggerToast("Applied filters");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedDetailModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img src={selectedDetailModal.img} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedDetailModal.name}</h3>
                  <p className="text-xs text-slate-500">{selectedDetailModal.rego} • {selectedDetailModal.type}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDetailModal(null)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fuel Cost</span>
                <p className="text-sm font-black text-slate-900">${(selectedDetailModal.fuel * 1.1).toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Maintenance</span>
                <p className="text-sm font-black text-slate-900">${(selectedDetailModal.maintenance * 1.1).toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Tyres</span>
                <p className="text-sm font-black text-slate-900">${(selectedDetailModal.tyres * 1.1).toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Insurance</span>
                <p className="text-sm font-black text-slate-900">${(selectedDetailModal.insurance * 1.1).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button onClick={() => setSelectedDetailModal(null)} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
