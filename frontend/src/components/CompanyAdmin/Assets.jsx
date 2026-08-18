import React, { useState, useEffect } from 'react';
import { 
  Plus, Download, ChevronDown, Search, Filter, RotateCcw, 
  MapPin, Building, Clock, Phone, AlertCircle, CheckCircle2,
  AlertTriangle, XCircle, FileText, Database, Shield, Zap, Info, Key, CheckCircle, Package, Battery, Settings, Laptop, Wrench, Truck,
  QrCode, MoreHorizontal, Eye, Edit, Trash2, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AssetDetails from './AssetDetails';

// Dynamic Reusable Donut Chart Component (SVG)
const AssetDonutChart = ({ active = 0, maintenance = 0, outOfService = 0, unassigned = 0 }) => {
  const size = 160;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const total = active + maintenance + outOfService + unassigned;
  const data = [
    { value: active, color: '#10B981' }, // Active (emerald)
    { value: maintenance, color: '#F59E0B' }, // Maintenance (amber)
    { value: outOfService, color: '#EF4444' }, // Out of service (red)
    { value: unassigned, color: '#94A3B8' }  // Unassigned (slate)
  ].filter(item => item.value > 0);

  let currentOffset = 0;

  return (
    <div className="relative flex items-center justify-center h-[180px]">
      <svg width={size} height={size} className="transform -rotate-90">
        {total === 0 ? (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
        ) : (
          data.map((item, index) => {
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
          })
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-slate-800 tracking-tight leading-none">{total}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
      </div>
    </div>
  );
};

export default function Assets() {
  const [assetList, setAssetList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editAssetModal, setEditAssetModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cardFilter, setCardFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const [assetsRes, branchesRes] = await Promise.all([
        api.get('/company-admin/assets').catch(() => ({ data: { success: false, data: [] } })),
        api.get('/company-admin/branches').catch(() => ({ data: { success: false, data: [] } }))
      ]);

      const rawAssets = assetsRes.data?.data?.items || (Array.isArray(assetsRes.data?.data) ? assetsRes.data.data : (Array.isArray(assetsRes.data) ? assetsRes.data : []));
      const formattedAssets = rawAssets.map((item, idx) => ({
        id: item.assetId || item.id || `AST-${idx + 1}`,
        rawId: item.id,
        name: item.name || 'Unnamed Asset',
        category: item.category || 'General Equipment',
        type: item.type || 'Equipment',
        model: item.model || item.make || '-',
        year: item.year || '-',
        branch: item.branch?.name || item.branch || 'Sydney Head Office',
        location: item.location || 'Yard Storage',
        assignedTo: item.assignments?.[0]?.assignedTo || item.assignedTo || 'Unassigned',
        status: item.status ? (item.status === 'ACTIVE' ? 'Active' : (item.status === 'MAINTENANCE' ? 'Maintenance' : 'Out of Service')) : 'Active',
        condition: item.condition ? (item.condition === 'GOOD' ? 'Good' : (item.condition === 'EXCELLENT' ? 'Excellent' : 'Fair')) : 'Good',
        nextService: item.nextServiceDue ? new Date(item.nextServiceDue).toLocaleDateString() : '30 Oct 2026',
        dueIn: 'In 3 months',
        serialNumber: item.serialNumber || '-',
        purchasePrice: item.purchasePrice ? `$${item.purchasePrice}` : '-'
      }));
      setAssetList(formattedAssets);

      const rawBranches = branchesRes.data?.data?.items || (Array.isArray(branchesRes.data?.data) ? branchesRes.data.data : []);
      setBranches(rawBranches);
      if (rawBranches.length > 0) {
        setSelectedBranch(rawBranches[0]);
      }
    } catch (err) {
      console.warn('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDeleteAsset = async (asset) => {
    if (!window.confirm(`Are you sure you want to delete asset "${asset.name}" (${asset.id})?`)) return;
    try {
      await api.delete(`/company-admin/assets/${asset.rawId || asset.id}`);
      showToast(`✓ Asset "${asset.name}" deleted successfully.`);
      fetchAssets();
    } catch (err) {
      showToast('❌ Failed to delete asset: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setTypeFilter('All');
    setBranchFilter('All');
    setStatusFilter('All');
    setCardFilter('all');
  };

  // 7 Stat Counts Computed Live from assetList
  const totalCount = assetList.length;
  const activeCount = assetList.filter(a => a.status === 'Active').length;
  const maintenanceCount = assetList.filter(a => a.status === 'Maintenance').length;
  const outOfServiceCount = assetList.filter(a => a.status === 'Out of Service').length;
  const complianceCount = assetList.filter(a => a.condition === 'Fair' || a.condition === 'Poor').length;
  const assignedCount = assetList.filter(a => a.assignedTo && a.assignedTo !== 'Unassigned').length;
  const unassignedCount = assetList.filter(a => !a.assignedTo || a.assignedTo === 'Unassigned').length;

  const filteredAssets = assetList.filter((asset) => {
    // Card Filter
    if (cardFilter === 'active' && asset.status !== 'Active') return false;
    if (cardFilter === 'maintenance' && asset.status !== 'Maintenance') return false;
    if (cardFilter === 'out_of_service' && asset.status !== 'Out of Service') return false;
    if (cardFilter === 'compliance' && asset.condition !== 'Fair' && asset.condition !== 'Poor') return false;
    if (cardFilter === 'assigned' && (!asset.assignedTo || asset.assignedTo === 'Unassigned')) return false;
    if (cardFilter === 'unassigned' && asset.assignedTo && asset.assignedTo !== 'Unassigned') return false;

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
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 pb-28 sm:pb-10 w-full text-left font-sans custom-scrollbar overflow-y-auto min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Assets List <CheckCircle2 size={20} className="text-purple-600 fill-purple-100" />
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
            {/* Card 1: Total */}
            <div 
              onClick={() => { setCardFilter('all'); showToast(`Showing all ${totalCount} assets`); }}
              className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col gap-2 cursor-pointer transition-all ${cardFilter === 'all' ? 'border-purple-500 bg-purple-50/20 ring-2 ring-purple-100' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-purple-50 text-purple-600 rounded">
                  <Package size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">{totalCount}</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Assets</div>
            </div>
            
            {/* Card 2: Active */}
            <div 
              onClick={() => { const n = cardFilter === 'active' ? 'all' : 'active'; setCardFilter(n); showToast(n === 'active' ? 'Filtering Active Assets' : 'Showing all assets'); }}
              className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col gap-2 cursor-pointer transition-all ${cardFilter === 'active' ? 'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">{activeCount}</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Active</div>
            </div>
            
            {/* Card 3: Maintenance */}
            <div 
              onClick={() => { const n = cardFilter === 'maintenance' ? 'all' : 'maintenance'; setCardFilter(n); showToast(n === 'maintenance' ? 'Filtering Assets in Maintenance' : 'Showing all assets'); }}
              className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col gap-2 cursor-pointer transition-all ${cardFilter === 'maintenance' ? 'border-amber-500 bg-amber-50/20 ring-2 ring-amber-100' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-amber-50 text-amber-500 rounded">
                  <Wrench size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">{maintenanceCount}</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Maintenance Due</div>
            </div>
            
            {/* Card 4: Out of Service */}
            <div 
              onClick={() => { const n = cardFilter === 'out_of_service' ? 'all' : 'out_of_service'; setCardFilter(n); showToast(n === 'out_of_service' ? 'Filtering Out of Service Assets' : 'Showing all assets'); }}
              className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col gap-2 cursor-pointer transition-all ${cardFilter === 'out_of_service' ? 'border-red-500 bg-red-50/20 ring-2 ring-red-100' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded">
                  <AlertTriangle size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">{outOfServiceCount}</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Out of Service</div>
            </div>
            
            {/* Card 5: Compliance */}
            <div 
              onClick={() => { const n = cardFilter === 'compliance' ? 'all' : 'compliance'; setCardFilter(n); showToast(n === 'compliance' ? 'Filtering Assets with Compliance / Condition Attention' : 'Showing all assets'); }}
              className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col gap-2 cursor-pointer transition-all ${cardFilter === 'compliance' ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-100' : 'border-blue-200 hover:border-blue-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-blue-50 text-blue-600 rounded">
                  <Shield size={14} />
                </div>
                <span className="text-2xl font-black text-blue-600 leading-none tracking-tight">{complianceCount}</span>
              </div>
              <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1 leading-snug">Expiring Compliance</div>
            </div>
            
            {/* Card 6: Assigned */}
            <div 
              onClick={() => { const n = cardFilter === 'assigned' ? 'all' : 'assigned'; setCardFilter(n); showToast(n === 'assigned' ? 'Filtering Assigned Assets' : 'Showing all assets'); }}
              className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col gap-2 cursor-pointer transition-all ${cardFilter === 'assigned' ? 'border-purple-500 bg-purple-50/20 ring-2 ring-purple-100' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-purple-50 text-purple-600 rounded">
                  <MapPin size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">{assignedCount}</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Assigned</div>
            </div>
            
            {/* Card 7: Unassigned */}
            <div 
              onClick={() => { const n = cardFilter === 'unassigned' ? 'all' : 'unassigned'; setCardFilter(n); showToast(n === 'unassigned' ? 'Filtering Unassigned Assets' : 'Showing all assets'); }}
              className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col gap-2 cursor-pointer transition-all ${cardFilter === 'unassigned' ? 'border-slate-400 bg-slate-50 ring-2 ring-slate-200' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-slate-100 text-slate-500 rounded">
                  <Building size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">{unassignedCount}</span>
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
                        <div className="text-xs font-bold text-slate-800">
                          {typeof asset.branch === 'object' ? (asset.branch?.name || asset.branch?.location || 'Sydney Head Office') : (asset.branch || 'Sydney Head Office')}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                          {typeof asset.location === 'object' ? (asset.location?.name || asset.location?.location || 'Yard') : (asset.location || 'Yard')}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="text-xs font-semibold text-slate-600">
                          {typeof asset.assignedTo === 'object' ? (asset.assignedTo?.name || 'Unassigned') : (asset.assignedTo || 'Unassigned')}
                        </div>
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
                      
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => setSelectedAsset(asset)} 
                            title="View Asset Details"
                            className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                          >
                            <Eye size={13} />
                          </button>
                          <button 
                            onClick={() => setEditAssetModal(asset)} 
                            title="Edit Asset"
                            className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete asset ${asset.name} (${asset.id})?`)) {
                                setAssetList(prev => prev.filter(a => a.id !== asset.id));
                              }
                            }} 
                            title="Delete Asset"
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                          >
                            <Trash2 size={13} />
                          </button>
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
            <AssetDonutChart 
              active={activeCount} 
              maintenance={maintenanceCount} 
              outOfService={outOfServiceCount} 
              unassigned={unassignedCount} 
            />
            
            <div className="mt-8 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-700">Active</span>
                </div>
                <div className="text-xs font-black text-slate-900">
                  {activeCount} 
                  <span className="text-slate-400 font-semibold ml-1">
                    ({totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-bold text-slate-700">Maintenance</span>
                </div>
                <div className="text-xs font-black text-slate-900">
                  {maintenanceCount} 
                  <span className="text-slate-400 font-semibold ml-1">
                    ({totalCount > 0 ? ((maintenanceCount / totalCount) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span className="text-xs font-bold text-slate-700">Out of Service</span>
                </div>
                <div className="text-xs font-black text-slate-900">
                  {outOfServiceCount} 
                  <span className="text-slate-400 font-semibold ml-1">
                    ({totalCount > 0 ? ((outOfServiceCount / totalCount) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                  <span className="text-xs font-bold text-slate-700">Unassigned</span>
                </div>
                <div className="text-xs font-black text-slate-900">
                  {unassignedCount} 
                  <span className="text-slate-400 font-semibold ml-1">
                    ({totalCount > 0 ? ((unassignedCount / totalCount) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
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


      
      {/* Edit Asset Modal */}
      {editAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Edit size={16} className="text-purple-600" /> Edit Asset ({editAssetModal.id})
              </h3>
              <button onClick={() => setEditAssetModal(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Asset Name *</label>
                <input type="text" value={editAssetModal.name || ''} onChange={e => setEditAssetModal({...editAssetModal, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
                  <input type="text" value={editAssetModal.category || ''} onChange={e => setEditAssetModal({...editAssetModal, category: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
                  <select value={editAssetModal.status || 'Active'} onChange={e => setEditAssetModal({...editAssetModal, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold bg-white cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch</label>
                  <input type="text" value={editAssetModal.branch || ''} onChange={e => setEditAssetModal({...editAssetModal, branch: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Location</label>
                  <input type="text" value={editAssetModal.location || ''} onChange={e => setEditAssetModal({...editAssetModal, location: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Assigned To</label>
                <input type="text" value={editAssetModal.assignedTo || ''} onChange={e => setEditAssetModal({...editAssetModal, assignedTo: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button onClick={() => setEditAssetModal(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
              <button onClick={() => {
                setAssetList(prev => prev.map(a => a.id === editAssetModal.id ? editAssetModal : a));
                setEditAssetModal(null);
              }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-xs shadow-sm cursor-pointer">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
