import React, { useState } from 'react';
import { 
  Plus, Download, ChevronDown, Search, Filter, RotateCcw, 
  MapPin, Building, Clock, Phone, AlertCircle, CheckCircle2,
  AlertTriangle, XCircle, FileText, Database, Shield, Zap, Info, Key, CheckCircle, Package, Battery, Settings, Laptop, Wrench, Truck,
  QrCode, MoreHorizontal, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AssetDetails from './AssetDetails';

// --- MOCK DATA ---
const mockAssets = [
  {
    id: 'AST-0001',
    name: 'Toyota 8FD25',
    model: 'Forklift',
    category: 'Forklifts',
    type: 'Diesel Forklift',
    branch: 'Sydney Head Office',
    location: 'Warehouse 1',
    assignedTo: 'Warehouse 1',
    status: 'Active',
    condition: 'Good',
    nextService: '24 Jun 2025',
    dueIn: 'in 18 days',
    icon: 'forklift'
  },
  {
    id: 'AST-0002',
    name: 'Crown RR5220',
    model: 'Reach Truck',
    category: 'Forklifts',
    type: 'Electric Reach Truck',
    branch: 'Sydney Head Office',
    location: 'Warehouse 2',
    assignedTo: 'Warehouse 2',
    status: 'Active',
    condition: 'Good',
    nextService: '15 Jun 2025',
    dueIn: 'in 9 days',
    icon: 'forklift'
  },
  {
    id: 'AST-0003',
    name: 'Container 20ft',
    model: 'General Purpose',
    category: 'Containers',
    type: '20ft GP Container',
    branch: 'Yard - Sydney HO',
    location: 'Yard',
    assignedTo: 'Yard',
    status: 'Active',
    condition: 'Fair',
    nextService: '10 Aug 2025',
    dueIn: 'in 65 days',
    icon: 'container'
  },
  {
    id: 'AST-0004',
    name: 'Pallet Jack',
    model: 'Manual',
    category: 'Material Handling',
    type: 'Manual Pallet Jack',
    branch: 'Sydney Head Office',
    location: 'Warehouse 1',
    assignedTo: 'Warehouse 1',
    status: 'Active',
    condition: 'Good',
    nextService: '05 Sep 2025',
    dueIn: 'in 91 days',
    icon: 'pallet-jack'
  },
  {
    id: 'AST-0005',
    name: 'Generator 45kVA',
    model: 'Atlas Copco',
    category: 'Power Equipment',
    type: 'Diesel Generator',
    branch: 'Sydney Head Office',
    location: 'Unassigned',
    assignedTo: 'Unassigned',
    status: 'Maintenance',
    condition: 'Good',
    nextService: 'Overdue',
    dueIn: 'Maintenance Req',
    icon: 'generator'
  },
  {
    id: 'AST-0006',
    name: 'Battery Charger',
    model: '24V',
    category: 'Equipment',
    type: 'Battery Charger',
    branch: 'Sydney Head Office',
    location: 'Workshop',
    assignedTo: 'Workshop',
    status: 'Active',
    condition: 'Good',
    nextService: '12 Jul 2025',
    dueIn: 'in 36 days',
    icon: 'battery'
  },
  {
    id: 'AST-0007',
    name: 'Dolly',
    model: '2 Wheel',
    category: 'Material Handling',
    type: '2 Wheel Dolly',
    branch: 'Yard - Sydney HO',
    location: 'Yard',
    assignedTo: 'Yard',
    status: 'Active',
    condition: 'Fair',
    nextService: '20 Oct 2025',
    dueIn: 'in 136 days',
    icon: 'dolly'
  },
  {
    id: 'AST-0008',
    name: 'Mobile Scanner',
    model: 'Zebra TC52',
    category: 'IT & Devices',
    type: 'Handheld Scanner',
    branch: 'Sydney Head Office',
    location: 'Dispatch',
    assignedTo: 'Dispatch Team',
    status: 'Active',
    condition: 'Good',
    nextService: '01 Nov 2025',
    dueIn: 'in 148 days',
    icon: 'scanner'
  },
  {
    id: 'AST-0009',
    name: 'Air Compressor 100L',
    model: 'Ingersoll Rand',
    category: 'Workshop Equipment',
    type: 'Air Compressor',
    branch: 'Sydney Head Office',
    location: 'Workshop',
    assignedTo: 'Workshop',
    status: 'Out of Service',
    condition: 'Poor',
    nextService: 'Failed',
    dueIn: 'Requires Repair',
    icon: 'compressor'
  },
  {
    id: 'AST-0010',
    name: 'Safety Harness',
    model: 'Fall Protection',
    category: 'PPE',
    type: 'Full Body Harness',
    branch: 'Sydney Head Office',
    location: 'Warehouse 1',
    assignedTo: 'Warehouse Team',
    status: 'Active',
    condition: 'Good',
    nextService: '15 Dec 2025',
    dueIn: 'in 192 days',
    icon: 'ppe'
  }
];

// Reusable Donut Chart Component (SVG)
const AssetDonutChart = () => {
  const size = 160;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Data matching the screenshot: Active 88 (66.7%), Maintenance 18 (13.6%), Out of Service 6 (4.5%), Unassigned 20 (15.2%)
  const data = [
    { value: 88, color: '#10B981' }, // Active (emerald)
    { value: 18, color: '#F59E0B' }, // Maintenance (amber)
    { value: 6, color: '#EF4444' }, // Out of service (red)
    { value: 20, color: '#94A3B8' }  // Unassigned (slate)
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentOffset = 0;

  return (
    <div className="relative flex items-center justify-center h-[180px]">
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const dashArray = (item.value / total) * circumference;
          const strokeDasharray = `${dashArray} ${circumference}`;
          const strokeDashoffset = -currentOffset;
          currentOffset += dashArray;

          return (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-slate-800 tracking-tight leading-none">132</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
      </div>
    </div>
  );
};

export default function Assets() {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setTypeFilter('All');
    setBranchFilter('All');
    setStatusFilter('All');
  };

  const filteredAssets = mockAssets.filter((asset) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!asset.id.toLowerCase().includes(q) &&
          !asset.name.toLowerCase().includes(q) &&
          !asset.model.toLowerCase().includes(q) &&
          !asset.type.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (categoryFilter !== 'All' && asset.category !== categoryFilter) return false;
    if (typeFilter !== 'All' && asset.type !== typeFilter) return false;
    if (branchFilter !== 'All' && asset.branch !== branchFilter) return false;
    if (statusFilter !== 'All' && asset.status !== statusFilter) return false;
    return true;
  });

  if (selectedAsset) {
    return <AssetDetails assetData={selectedAsset} onBack={() => setSelectedAsset(null)} />;
  }

  // Icon mapper helper
  const getAssetIcon = (iconStr, colorClass) => {
    switch(iconStr) {
      case 'forklift': return <Truck size={14} className={colorClass} />;
      case 'container': return <Package size={14} className={colorClass} />;
      case 'pallet-jack': return <Settings size={14} className={colorClass} />;
      case 'generator': return <Zap size={14} className={colorClass} />;
      case 'battery': return <Battery size={14} className={colorClass} />;
      case 'dolly': return <Settings size={14} className={colorClass} />;
      case 'scanner': return <Laptop size={14} className={colorClass} />;
      case 'compressor': return <Wrench size={14} className={colorClass} />;
      case 'ppe': return <Shield size={14} className={colorClass} />;
      default: return <Package size={14} className={colorClass} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="text-[11px] font-black text-emerald-600 tracking-wider">Active</span>;
      case 'Maintenance':
        return <span className="text-[11px] font-black text-amber-500 tracking-wider">Maintenance</span>;
      case 'Out of Service':
        return <span className="text-[11px] font-black text-red-500 tracking-wider">Out of Service</span>;
      default:
        return <span className="text-[11px] font-black text-slate-500 tracking-wider">{status}</span>;
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Good': return 'text-emerald-500';
      case 'Fair': return 'text-amber-500';
      case 'Poor': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Forklifts': return { text: 'text-blue-600', bg: 'bg-blue-50' };
      case 'Containers': return { text: 'text-amber-600', bg: 'bg-amber-50' };
      case 'Material Handling': return { text: 'text-purple-600', bg: 'bg-purple-50' };
      case 'Power Equipment': return { text: 'text-orange-600', bg: 'bg-orange-50' };
      case 'Equipment': return { text: 'text-emerald-600', bg: 'bg-emerald-50' };
      case 'IT & Devices': return { text: 'text-cyan-600', bg: 'bg-cyan-50' };
      case 'Workshop Equipment': return { text: 'text-rose-600', bg: 'bg-rose-50' };
      case 'PPE': return { text: 'text-indigo-600', bg: 'bg-indigo-50' };
      default: return { text: 'text-slate-600', bg: 'bg-slate-50' };
    }
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            8.1 Assets List <CheckCircle2 size={20} className="text-purple-600 fill-purple-100" />
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">View and manage all non-vehicle assets across all branches.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => navigate('/company-admin/assets/new')}
            className="bg-white border border-purple-300 text-purple-700 hover:bg-purple-50 text-[11px] font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} strokeWidth={2.5} /> Create New Asset
          </button>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
            <Download size={14} strokeWidth={2.5} /> Export Assets
          </button>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
            More Actions <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* 2-COLUMN MAIN LAYOUT */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* LEFT COLUMN (Branch Info, 7 Stats, Table) */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Branch Info Card (Wide) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            {/* Image & Button */}
            <div className="w-full md:w-[220px] shrink-0 flex flex-col gap-3">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60" 
                alt="Warehouse" 
                className="w-full h-32 object-cover rounded-xl"
              />
              <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                Change Branch
              </button>
            </div>
            
            {/* Details Grid */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Sydney Head Office</h2>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-wider">Active</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch Code</span>
                  <span className="text-xs font-bold text-slate-800">SYD-HO</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</span>
                  <span className="text-xs font-semibold text-slate-600 leading-snug">25 Logistics Drive<br/>Eastern Creek, NSW 2766<br/>Australia</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Established</span>
                  <span className="text-xs font-semibold text-slate-600">01 Jan 2020</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch Type</span>
                  <span className="text-xs font-bold text-slate-800">Head Office</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</span>
                  <span className="text-xs font-semibold text-slate-600">+61 2 9123 4567</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Zone</span>
                  <span className="text-xs font-semibold text-slate-600">Australia/Sydney (AEST)</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch Manager</span>
                  <span className="text-xs font-bold text-slate-800">Sarah Mitchell</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Currency</span>
                  <span className="text-xs font-semibold text-slate-600">AUD - Australian Dollar</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 7 Stat Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded">
                  <Package size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">132</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Assets</div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">88</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Active</div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-amber-50 text-amber-500 rounded">
                  <Wrench size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">18</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Maintenance Due</div>
            </div>
            
            {/* Card 4 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded">
                  <AlertTriangle size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">6</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Out of Service</div>
            </div>
            
            {/* Card 5 */}
            <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-sm flex flex-col gap-2 bg-blue-50/10">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-blue-50 text-blue-600 rounded">
                  <Shield size={14} />
                </div>
                <span className="text-2xl font-black text-blue-600 leading-none tracking-tight">7</span>
              </div>
              <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1 leading-snug">Expiring Compliance</div>
            </div>
            
            {/* Card 6 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-purple-50 text-purple-600 rounded">
                  <MapPin size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">13</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Assigned</div>
            </div>
            
            {/* Card 7 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-slate-100 text-slate-500 rounded">
                  <Building size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">28</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Unassigned</div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Filter Bar */}
            <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row items-center gap-4 bg-white rounded-t-2xl">
              <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-400 text-slate-700"
                />
              </div>
              
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full">
                <div className="relative flex-1 min-w-[120px]">
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-400 text-slate-700 bg-white cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Forklifts">Forklifts</option>
                    <option value="Containers">Containers</option>
                    <option value="Material Handling">Material Handling</option>
                    <option value="Power Equipment">Power Equipment</option>
                    <option value="Equipment">Equipment</option>
                    <option value="IT & Devices">IT & Devices</option>
                    <option value="Workshop Equipment">Workshop Equipment</option>
                    <option value="PPE">PPE</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative flex-1 min-w-[120px]">
                  <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-400 text-slate-700 bg-white cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="Diesel Forklift">Diesel Forklift</option>
                    <option value="Electric Reach Truck">Electric Reach Truck</option>
                    <option value="20ft GP Container">20ft GP Container</option>
                    <option value="Manual Pallet Jack">Manual Pallet Jack</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative flex-1 min-w-[120px]">
                  <select 
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-400 text-slate-700 bg-white cursor-pointer"
                  >
                    <option value="All">All Branches</option>
                    <option value="Sydney Head Office">Sydney Head Office</option>
                    <option value="Yard - Sydney HO">Yard - Sydney HO</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative flex-1 min-w-[120px]">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-400 text-slate-700 bg-white cursor-pointer"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                    <Filter size={14} /> Filters
                  </button>
                  <button onClick={handleResetFilters} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors">
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto custom-scrollbar flex-1 bg-white">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1100px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-[#F8FAFC] text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="p-4 w-10 text-center"><input type="checkbox" className="rounded border-slate-300 w-3.5 h-3.5" /></th>
                    <th className="p-4">Asset ID</th>
                    <th className="p-4">Asset Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Branch / Location</th>
                    <th className="p-4">Assigned To</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Condition</th>
                    <th className="p-4">Next Service / Due</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 text-center"><input type="checkbox" className="rounded border-slate-300 w-3.5 h-3.5 cursor-pointer" /></td>
                      
                      <td className="p-4">
                        <div className="flex flex-col cursor-pointer" onClick={() => setSelectedAsset(asset)}>
                          <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center mb-1.5 shrink-0 overflow-hidden shadow-sm">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${asset.id}`} alt="QR" className="w-5 h-5 object-contain opacity-80" />
                          </div>
                          <span className="text-[10px] font-black text-blue-600 font-mono tracking-wider hover:underline">{asset.id}</span>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div onClick={() => setSelectedAsset(asset)} className="text-xs font-black text-slate-900 group-hover:text-purple-700 transition-colors cursor-pointer">{asset.name}</div>
                        <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{asset.model}</div>
                      </td>
                      
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${getCategoryColor(asset.category).bg} ${getCategoryColor(asset.category).text}`}>{asset.category}</span>
                      </td>
                      
                      <td className="p-4">
                        <div className="text-xs font-semibold text-slate-600">{asset.type}</div>
                      </td>
                      
                      <td className="p-4">
                        <div className="text-xs font-bold text-slate-800">{asset.branch}</div>
                        <div className="text-[10px] font-semibold text-slate-500 mt-0.5">{asset.location}</div>
                      </td>
                      
                      <td className="p-4">
                        <div className="text-xs font-semibold text-slate-600">{asset.assignedTo}</div>
                      </td>
                      
                      <td className="p-4">
                        {asset.status === 'Active' ? (
                          <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black uppercase tracking-wider">Active</span>
                        ) : asset.status === 'Maintenance' ? (
                          <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-600 rounded-md text-[9px] font-black uppercase tracking-wider">Maintenance</span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 bg-red-50 text-red-600 rounded-md text-[9px] font-black uppercase tracking-wider">Out of Service</span>
                        )}
                      </td>
                      
                      <td className="p-4">
                        <span className={`text-xs font-bold ${getConditionColor(asset.condition)}`}>
                          {asset.condition}
                        </span>
                      </td>
                      
                      <td className="p-4">
                        <div className="text-xs font-bold text-slate-800">{asset.nextService}</div>
                        <div className="text-[10px] font-semibold text-slate-500 mt-0.5">{asset.dueIn}</div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setSelectedAsset(asset)} className="text-slate-400 hover:text-purple-600 transition-colors p-1 cursor-pointer"><Eye size={16} /></button>
                          <button className="text-slate-400 hover:text-purple-600 transition-colors p-1 cursor-pointer"><MoreHorizontal size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 text-[10px] font-bold text-slate-500">
              <div>Showing 1 to 10 of 132 assets</div>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50">&lt;</button>
                <button className="px-2.5 py-1.5 border border-purple-500 rounded-md bg-purple-50 text-purple-700">1</button>
                <button className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50">2</button>
                <button className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50">3</button>
                <button className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50">4</button>
                <button className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50">5</button>
                <button className="px-2 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50">&gt;</button>
              </div>
              <div className="flex items-center gap-2">
                <select className="border border-slate-200 rounded-md px-2 py-1 bg-white outline-none">
                  <option>10 / page</option>
                  <option>20 / page</option>
                  <option>50 / page</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN (Summary sidebars) */}
        <div className="w-full xl:w-[250px] shrink-0 space-y-6">
          
          {/* Asset Summary Donut */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Asset Summary</h3>
            <AssetDonutChart />
            
            <div className="mt-8 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-700">Active</span>
                </div>
                <div className="text-xs font-black text-slate-900">88 <span className="text-slate-400 font-semibold ml-1">(66.7%)</span></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-bold text-slate-700">Maintenance</span>
                </div>
                <div className="text-xs font-black text-slate-900">18 <span className="text-slate-400 font-semibold ml-1">(13.6%)</span></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span className="text-xs font-bold text-slate-700">Out of Service</span>
                </div>
                <div className="text-xs font-black text-slate-900">6 <span className="text-slate-400 font-semibold ml-1">(4.5%)</span></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                  <span className="text-xs font-bold text-slate-700">Unassigned</span>
                </div>
                <div className="text-xs font-black text-slate-900">28 <span className="text-slate-400 font-semibold ml-1">(21.2%)</span></div>
              </div>
            </div>
          </div>

          {/* Assets by Category */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Assets by Category</h3>
              <button className="text-[9px] font-bold text-purple-600 uppercase tracking-widest hover:underline flex items-center gap-1">View Report <Plus size={10} /></button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Forklifts', count: 21, color: 'bg-blue-600', textColor: 'text-blue-600' },
                { name: 'Containers', count: 28, color: 'bg-amber-600', textColor: 'text-amber-600' },
                { name: 'Material Handling', count: 19, color: 'bg-purple-600', textColor: 'text-purple-600' },
                { name: 'Power Equipment', count: 12, color: 'bg-orange-500', textColor: 'text-orange-500' },
                { name: 'Equipment', count: 15, color: 'bg-emerald-500', textColor: 'text-emerald-500' },
                { name: 'IT & Devices', count: 14, color: 'bg-cyan-600', textColor: 'text-cyan-600' },
                { name: 'Workshop Equipment', count: 11, color: 'bg-rose-500', textColor: 'text-rose-500' },
                { name: 'PPE', count: 14, color: 'bg-indigo-500', textColor: 'text-indigo-500' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}></div>
                    <span className={`text-[11px] font-bold ${item.textColor} group-hover:underline`}>{item.name}</span>
                  </div>
                  <div className="text-[11px] font-black text-slate-900">{item.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Compliance Alerts</h3>
              <button className="text-[9px] font-bold text-purple-600 uppercase tracking-widest hover:underline">View All &rarr;</button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <div>
                    <div className="text-[11px] font-black text-amber-900">7 Expiring Soon</div>
                  </div>
                </div>
                <div className="text-[8px] font-black text-amber-700 uppercase tracking-widest bg-amber-100/50 px-2 py-1 rounded border border-amber-200">WITHIN 20 DAYS</div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <AlertCircle size={16} className="text-red-600" />
                  <div>
                    <div className="text-[11px] font-black text-red-900">4 Require Attention</div>
                  </div>
                </div>
                <div className="text-[8px] font-black text-red-700 uppercase tracking-widest bg-red-100/50 px-2 py-1 rounded border border-red-200">EXPIRED</div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-blue-600" />
                  <div>
                    <div className="text-[11px] font-black text-blue-900">23 Up to Date</div>
                  </div>
                </div>
                <div className="text-[8px] font-black text-blue-700 uppercase tracking-widest bg-blue-100/50 px-2 py-1 rounded border border-blue-200">COMPLIANT</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Quick Actions</h3>
            
            <div className="space-y-1">
              {[
                { icon: <Plus size={14} />, label: 'Create New Asset' },
                { icon: <Download size={14} />, label: 'Import Assets (CSV)' },
                { icon: <CheckCircle2 size={14} />, label: 'Assign Existing Asset' },
                { icon: <Settings size={14} />, label: 'Manage Categories' },
                { icon: <Wrench size={14} />, label: 'Asset Maintenance Schedule' },
                { icon: <FileText size={14} />, label: 'Asset Compliance Documents' }
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left group">
                  <span className="text-slate-400 group-hover:text-purple-600 transition-colors">{action.icon}</span>
                  <span className="text-xs font-bold">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* DEVELOPER NOTES */}
      <div className="mt-8 bg-purple-50/50 rounded-2xl border border-purple-100 p-6">
        <h4 className="text-xs font-black text-purple-900 flex items-center gap-2 mb-4 uppercase tracking-widest">
          <Info size={14} className="text-purple-600" /> Developer Notes - Assets List
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
              <Key size={12} /> 1. Purpose
            </div>
            <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
              <li>Central list of all non-vehicle assets.</li>
              <li>Supports tracking, maintenance, compliance, and assignments.</li>
              <li>Provides quick filtering and reporting.</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
              <Settings size={12} /> 2. Key Features
            </div>
            <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
              <li>Search, filters, and sorting.</li>
              <li>Category, type, branch, and status filters.</li>
              <li>Asset thumbnails and key details.</li>
              <li>Bulk actions via More Actions menu.</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
              <Zap size={12} /> 3. Automation & Alerts
            </div>
            <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
              <li>AI detects due dates from documents (AI add-on).</li>
              <li>Automatic maintenance and compliance reminders.</li>
              <li>Status auto-updates based on maintenance or compliance expiry.</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
              <Shield size={12} /> 4. Permissions
            </div>
            <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
              <li>Super Admin: Full access.</li>
              <li>Admin/Manager: Create, edit, assign.</li>
              <li>Staff: View assigned assets only.</li>
              <li>Dispatch: View assets relevant to operations.</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
              <Database size={12} /> 5. Data Sources
            </div>
            <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
              <li>Assets module.</li>
              <li>Maintenance module.</li>
              <li>Compliance module.</li>
              <li>Assignments & Activity logs.</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-100 flex justify-between items-center text-[9px] font-bold text-slate-400">
          <span>All times shown in your local time (AEST)</span>
          <span className="flex items-center gap-1"><RotateCcw size={10} /> Data auto-refreshes every 5 minutes</span>
        </div>
      </div>
      
    </div>
  );
}
