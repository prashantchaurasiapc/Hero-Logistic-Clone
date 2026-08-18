import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Download, ChevronDown, Search, Filter, RotateCcw, 
  MapPin, Building, Clock, Phone, AlertCircle, CheckCircle2,
  AlertTriangle, XCircle, FileText, Database, Shield, Zap, Info, Key, CheckCircle, Package, Battery, Settings, Laptop, Wrench, Truck,
  QrCode, MoreHorizontal, Eye, Edit, Trash2, Loader2, Upload, Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AssetDetails from './AssetDetails';
import api from '../../services/api';

// Dynamic Donut Chart Component (SVG)
const AssetDonutChart = ({ stats }) => {
  const size = 160;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const active = stats?.active || 0;
  const maintenance = stats?.maintenance || 0;
  const outOfService = stats?.outOfService || 0;
  const unassigned = stats?.unassigned || 0;

  const data = [
    { value: active, color: '#10B981' },       // Active (emerald)
    { value: maintenance, color: '#F59E0B' },  // Maintenance (amber)
    { value: outOfService, color: '#EF4444' }, // Out of service (red)
    { value: unassigned, color: '#94A3B8' }   // Unassigned (slate)
  ];

  const totalSum = data.reduce((sum, item) => sum + item.value, 0);
  const total = totalSum || 1;
  let currentOffset = 0;

  return (
    <div className="relative flex items-center justify-center h-[180px]">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        {totalSum > 0 && data.map((item, index) => {
          if (item.value === 0) return null;
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
        <span className="text-3xl font-black text-slate-800 tracking-tight leading-none">{stats?.totalAssets || 0}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
      </div>
    </div>
  );
};

export default function Assets() {
  const [assetList, setAssetList] = useState([]);
  const [stats, setStats] = useState({
    totalAssets: 0,
    active: 0,
    maintenance: 0,
    outOfService: 0,
    expiringCompliance: 0,
    assigned: 0,
    unassigned: 0,
    categoryCounts: {}
  });

  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editAssetModal, setEditAssetModal] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({ assetId: '', assignedTo: '', purpose: '' });
  const [isSavingAssign, setIsSavingAssign] = useState(false);
  const [isEditBranchModalOpen, setIsEditBranchModalOpen] = useState(false);
  const [editBranchForm, setEditBranchForm] = useState({ id: '', name: '', code: '', location: '', type: '', phone: '', manager: '', timeZone: '', currency: '', photo: '' });
  const [isSavingBranch, setIsSavingBranch] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size is too large. Please select an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditBranchForm(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const PHOTO_PRESETS = [
    { name: 'Sydney HO Hub', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60' },
    { name: 'Melbourne Hub', url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=60' },
    { name: 'Brisbane Transport', url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&auto=format&fit=crop&q=60' },
    { name: 'Perth Regional Yard', url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60' },
    { name: 'Cold Storage Terminal', url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&auto=format&fit=crop&q=60' }
  ];

  const activeBranch = branchFilter === 'All'
    ? (branches[0] || null)
    : (branches.find(b => b.name === branchFilter || b.id === branchFilter) || branches[0] || null);

  const handleSaveAssign = async () => {
    if (!assignForm.assetId || !assignForm.assignedTo) return;
    setIsSavingAssign(true);
    try {
      await api.post(`/company-admin/assets/${assignForm.assetId}/assignments`, {
        assignedTo: assignForm.assignedTo,
        purpose: assignForm.purpose || 'Operational Assignment'
      });
      fetchAssets();
      setIsAssignModalOpen(false);
      setAssignForm({ assetId: '', assignedTo: '', purpose: '' });
    } catch (err) {
      console.error('Failed to assign asset:', err);
      setIsAssignModalOpen(false);
    } finally {
      setIsSavingAssign(false);
    }
  };

  const handleSaveBranch = async () => {
    if (!editBranchForm) return;
    setIsSavingBranch(true);
    try {
      const branchId = editBranchForm.id || activeBranch?.id || 'Sydney Head Office';
      await api.put(`/company-admin/branches/${branchId}`, editBranchForm);
      setIsEditBranchModalOpen(false);
      fetchAssets();
    } catch (err) {
      console.error('Failed to update branch:', err);
      setIsEditBranchModalOpen(false);
    } finally {
      setIsSavingBranch(false);
    }
  };

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (typeFilter !== 'All') params.type = typeFilter;
      if (branchFilter !== 'All') params.branch = branchFilter;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await api.get('/company-admin/assets', { params });
      if (res.data && res.data.data) {
        const payloadData = res.data.data;
        if (Array.isArray(payloadData)) {
          setAssetList(payloadData);
        } else if (payloadData.assets) {
          setAssetList(payloadData.assets);
          if (payloadData.stats) setStats(payloadData.stats);
          if (payloadData.branches) setBranches(payloadData.branches);
        }
      }
    } catch (err) {
      console.error('Failed to fetch assets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [categoryFilter, typeFilter, branchFilter, statusFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setTypeFilter('All');
    setBranchFilter('All');
    setStatusFilter('All');
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/company-admin/assets/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'assets_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
      // Fallback CSV download
      const headers = ['Asset ID', 'Name', 'Category', 'Type', 'Status', 'Condition', 'Branch'];
      const rows = filteredAssets.map(a => [a.id, a.name, a.category, a.type, a.status, a.condition, a.branch]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'assets_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const handleDeleteAsset = async (asset) => {
    if (window.confirm(`Are you sure you want to delete asset ${asset.name} (${asset.id})?`)) {
      try {
        await api.delete(`/company-admin/assets/${asset.realId || asset.id}`);
        setAssetList(prev => prev.filter(a => a.id !== asset.id && a.realId !== asset.realId));
        fetchAssets();
      } catch (err) {
        console.error('Failed to delete asset:', err);
        setAssetList(prev => prev.filter(a => a.id !== asset.id));
      }
    }
  };

  const handleSaveEditAsset = async () => {
    if (!editAssetModal) return;
    setIsSavingEdit(true);
    try {
      await api.put(`/company-admin/assets/${editAssetModal.realId || editAssetModal.id}`, editAssetModal);
      setAssetList(prev => prev.map(a => (a.id === editAssetModal.id || a.realId === editAssetModal.realId) ? editAssetModal : a));
      setEditAssetModal(null);
      fetchAssets();
    } catch (err) {
      console.error('Failed to update asset:', err);
      setAssetList(prev => prev.map(a => a.id === editAssetModal.id ? editAssetModal : a));
      setEditAssetModal(null);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const filteredAssets = assetList.filter((asset) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!asset.id.toLowerCase().includes(q) &&
          !asset.name.toLowerCase().includes(q) &&
          !(asset.model || '').toLowerCase().includes(q) &&
          !(asset.type || '').toLowerCase().includes(q)) {
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
            className="bg-white border border-purple-300 text-purple-700 hover:bg-purple-50 text-[11px] font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} /> Create New Asset
          </button>
          <button 
            onClick={handleExportCSV}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download size={14} strokeWidth={2.5} /> Export Assets
          </button>
          <button 
            onClick={() => setIsBranchModalOpen(true)}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            Switch Branch <ChevronDown size={14} />
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
                src={activeBranch?.photo || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60"} 
                alt="Warehouse" 
                className="w-full h-32 object-cover rounded-xl shadow-xs"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsBranchModalOpen(true)}
                  className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-bold text-purple-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Building size={14} /> Change Branch
                </button>
                <button 
                  onClick={() => {
                    setEditBranchForm({
                      id: activeBranch?.id,
                      name: activeBranch?.name || '',
                      code: activeBranch?.code || '',
                      location: activeBranch?.location || activeBranch?.address || '',
                      type: activeBranch?.type || '',
                      phone: activeBranch?.phone || '',
                      manager: activeBranch?.manager || '',
                      timeZone: activeBranch?.timeZone || '',
                      currency: activeBranch?.currency || 'AUD',
                      photo: activeBranch?.photo || ''
                    });
                    setIsEditBranchModalOpen(true);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1"
                  title="Edit Branch Photo & Details"
                >
                  <Edit size={14} /> Edit
                </button>
              </div>
            </div>
            
            {/* Details Grid */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {branchFilter === 'All' ? `${activeBranch?.name || 'Sydney Head Office'} (All Branches View)` : (activeBranch?.name || 'Sydney Head Office')}
                  </h2>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-wider">
                    {activeBranch?.status || 'Active'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch Code</span>
                  <span className="text-xs font-bold text-slate-800">
                    {activeBranch?.code || 'SYD-HO'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</span>
                  <span className="text-xs font-semibold text-slate-600 leading-snug">
                    {activeBranch?.location || activeBranch?.address || 'Eastern Creek, Sydney, NSW'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Established</span>
                  <span className="text-xs font-semibold text-slate-600">{activeBranch?.established || '2018'}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch Type</span>
                  <span className="text-xs font-bold text-slate-800">{activeBranch?.type || 'Head Office'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</span>
                  <span className="text-xs font-semibold text-slate-600">{activeBranch?.phone || '+61 2 9832 0011'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Zone</span>
                  <span className="text-xs font-semibold text-slate-600">{activeBranch?.timeZone || 'Australia/Sydney (AEST)'}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch Manager</span>
                  <span className="text-xs font-bold text-slate-800">{activeBranch?.manager || 'Sarah Mitchell'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Currency</span>
                  <span className="text-xs font-semibold text-slate-600">{activeBranch?.currency || 'AUD'}</span>
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
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">{stats.totalAssets || filteredAssets.length}</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Assets</div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">{stats.active}</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Active</div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-amber-50 text-amber-500 rounded">
                  <Wrench size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">{stats.maintenance}</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Maintenance Due</div>
            </div>
            
            {/* Card 4 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded">
                  <AlertTriangle size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">{stats.outOfService}</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Out of Service</div>
            </div>
            
            {/* Card 5 */}
            <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-sm flex flex-col gap-2 bg-blue-50/10">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-blue-50 text-blue-600 rounded">
                  <Shield size={14} />
                </div>
                <span className="text-2xl font-black text-blue-600 leading-none tracking-tight">{stats.expiringCompliance ?? 0}</span>
              </div>
              <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1 leading-snug">Expiring Compliance</div>
            </div>

            
            {/* Card 6 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-purple-50 text-purple-600 rounded">
                  <MapPin size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">{stats.assigned}</span>
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Assigned</div>
            </div>
            
            {/* Card 7 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-slate-100 text-slate-500 rounded">
                  <Building size={14} />
                </div>
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">{stats.unassigned}</span>
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
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                    {branches.length === 0 && <option value="Sydney Head Office">Sydney Head Office</option>}
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
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                    <Filter size={14} /> Filters
                  </button>
                  <button onClick={handleResetFilters} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto custom-scrollbar flex-1 bg-white">
              {isLoading ? (
                <div className="flex items-center justify-center p-12 text-slate-400 gap-2">
                  <Loader2 size={18} className="animate-spin text-purple-600" />
                  <span className="text-xs font-bold">Loading assets from database...</span>
                </div>
              ) : (
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
                              onClick={() => handleDeleteAsset(asset)} 
                              title="Delete Asset"
                              className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredAssets.length === 0 && (
                      <tr>
                        <td colSpan="11" className="p-8 text-center text-xs font-semibold text-slate-400">
                          No assets found matching filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 text-[10px] font-bold text-slate-500">
              <div>Showing 1 to {filteredAssets.length} of {stats.totalAssets || filteredAssets.length} assets</div>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 cursor-pointer">&lt;</button>
                <button className="px-2.5 py-1.5 border border-purple-500 rounded-md bg-purple-50 text-purple-700 font-bold">1</button>
                <button className="px-2 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 cursor-pointer">&gt;</button>
              </div>
              <div className="flex items-center gap-2">
                <select className="border border-slate-200 rounded-md px-2 py-1 bg-white outline-none cursor-pointer">
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
            <AssetDonutChart stats={stats} />
            
            <div className="mt-8 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-700">Active</span>
                </div>
                <div className="text-xs font-black text-slate-900">
                  {stats.active} <span className="text-slate-400 font-semibold ml-1">({stats.totalAssets ? ((stats.active / stats.totalAssets) * 100).toFixed(1) : 0}%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-bold text-slate-700">Maintenance</span>
                </div>
                <div className="text-xs font-black text-slate-900">
                  {stats.maintenance} <span className="text-slate-400 font-semibold ml-1">({stats.totalAssets ? ((stats.maintenance / stats.totalAssets) * 100).toFixed(1) : 0}%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <span className="text-xs font-bold text-slate-700">Out of Service</span>
                </div>
                <div className="text-xs font-black text-slate-900">
                  {stats.outOfService} <span className="text-slate-400 font-semibold ml-1">({stats.totalAssets ? ((stats.outOfService / stats.totalAssets) * 100).toFixed(1) : 0}%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                  <span className="text-xs font-bold text-slate-700">Unassigned</span>
                </div>
                <div className="text-xs font-black text-slate-900">
                  {stats.unassigned} <span className="text-slate-400 font-semibold ml-1">({stats.totalAssets ? ((stats.unassigned / stats.totalAssets) * 100).toFixed(1) : 0}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assets by Category */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Assets by Category</h3>
              <button className="text-[9px] font-bold text-purple-600 uppercase tracking-widest hover:underline flex items-center gap-1 cursor-pointer">View Report <Plus size={10} /></button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Forklifts', count: stats.categoryCounts?.['Forklifts'] || 0, color: 'bg-blue-600', textColor: 'text-blue-600' },
                { name: 'Containers', count: stats.categoryCounts?.['Containers'] || 0, color: 'bg-amber-600', textColor: 'text-amber-600' },
                { name: 'Material Handling', count: stats.categoryCounts?.['Material Handling'] || 0, color: 'bg-purple-600', textColor: 'text-purple-600' },
                { name: 'Power Equipment', count: stats.categoryCounts?.['Power Equipment'] || 0, color: 'bg-orange-500', textColor: 'text-orange-500' },
                { name: 'Equipment', count: stats.categoryCounts?.['Equipment'] || 0, color: 'bg-emerald-500', textColor: 'text-emerald-500' },
                { name: 'IT & Devices', count: stats.categoryCounts?.['IT & Devices'] || 0, color: 'bg-cyan-600', textColor: 'text-cyan-600' },
                { name: 'Workshop Equipment', count: stats.categoryCounts?.['Workshop Equipment'] || 0, color: 'bg-rose-500', textColor: 'text-rose-500' },
                { name: 'PPE', count: stats.categoryCounts?.['PPE'] || 0, color: 'bg-indigo-500', textColor: 'text-indigo-500' }
              ].map((item, i) => (
                <div key={i} onClick={() => setCategoryFilter(categoryFilter === item.name ? 'All' : item.name)} className="flex justify-between items-center group cursor-pointer">
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
              <button className="text-[9px] font-bold text-purple-600 uppercase tracking-widest hover:underline cursor-pointer">View All &rarr;</button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <div>
                    <div className="text-[11px] font-black text-amber-900">{stats.expiringCompliance || 0} Expiring Soon</div>
                  </div>
                </div>
                <div className="text-[8px] font-black text-amber-700 uppercase tracking-widest bg-amber-100/50 px-2 py-1 rounded border border-amber-200">WITHIN 20 DAYS</div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <AlertCircle size={16} className="text-red-600" />
                  <div>
                    <div className="text-[11px] font-black text-red-900">{stats.expiredCount || 0} Require Attention</div>
                  </div>
                </div>
                <div className="text-[8px] font-black text-red-700 uppercase tracking-widest bg-red-100/50 px-2 py-1 rounded border border-red-200">EXPIRED</div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-blue-600" />
                  <div>
                    <div className="text-[11px] font-black text-blue-900">{stats.compliantCount || 0} Up to Date</div>
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
              <button onClick={() => navigate('/company-admin/assets/new')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left group cursor-pointer">
                <span className="text-slate-400 group-hover:text-purple-600 transition-colors"><Plus size={14} /></span>
                <span className="text-xs font-bold">Create New Asset</span>
              </button>
              <button onClick={handleExportCSV} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left group cursor-pointer">
                <span className="text-slate-400 group-hover:text-purple-600 transition-colors"><Download size={14} /></span>
                <span className="text-xs font-bold">Export Assets (CSV)</span>
              </button>
              <button 
                onClick={() => {
                  setAssignForm({ assetId: assetList[0]?.id || '', assignedTo: '', purpose: '' });
                  setIsAssignModalOpen(true);
                }} 
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left group cursor-pointer"
              >
                <span className="text-slate-400 group-hover:text-purple-600 transition-colors"><CheckCircle2 size={14} /></span>
                <span className="text-xs font-bold">Assign Existing Asset</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left group cursor-pointer">
                <span className="text-slate-400 group-hover:text-purple-600 transition-colors"><Settings size={14} /></span>
                <span className="text-xs font-bold">Manage Categories</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left group cursor-pointer">
                <span className="text-slate-400 group-hover:text-purple-600 transition-colors"><Wrench size={14} /></span>
                <span className="text-xs font-bold">Asset Maintenance Schedule</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left group cursor-pointer">
                <span className="text-slate-400 group-hover:text-purple-600 transition-colors"><FileText size={14} /></span>
                <span className="text-xs font-bold">Asset Compliance Documents</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Asset Modal */}
      {editAssetModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg my-auto overflow-hidden animate-in fade-in zoom-in duration-150 max-h-[88vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Edit size={16} className="text-purple-600" /> Edit Asset ({editAssetModal.id})
              </h3>
              <button onClick={() => setEditAssetModal(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
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
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
              <button onClick={() => setEditAssetModal(null)} disabled={isSavingEdit} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
              <button onClick={handleSaveEditAsset} disabled={isSavingEdit} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-xs shadow-sm cursor-pointer disabled:opacity-50">
                {isSavingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select Branch Modal */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg my-auto overflow-hidden animate-in fade-in zoom-in duration-150 max-h-[88vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Building size={16} className="text-purple-600" /> Select Operational Branch
              </h3>
              <button onClick={() => setIsBranchModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            
            <div className="p-6 space-y-3 overflow-y-auto custom-scrollbar flex-1 text-xs">
              <p className="text-xs text-slate-500 font-semibold mb-2">Choose a branch to view its active assets, location details, and compliance stats.</p>
              
              {/* All Branches option */}
              <div 
                onClick={() => { setBranchFilter('All'); setIsBranchModalOpen(false); }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${branchFilter === 'All' ? 'border-purple-500 bg-purple-50/50 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
                    ALL
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">All Branches</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">View overview across all depots & hubs</p>
                  </div>
                </div>
                {branchFilter === 'All' && <CheckCircle2 size={18} className="text-purple-600" />}
              </div>

              {/* Branch list */}
              {branches.map(b => {
                const isSelected = branchFilter === b.name || branchFilter === b.id;
                return (
                  <div 
                    key={b.id}
                    onClick={() => { setBranchFilter(b.name); setIsBranchModalOpen(false); }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected ? 'border-purple-500 bg-purple-50/50 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs border border-slate-200 shrink-0">
                        {b.code || b.name.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-900">{b.name}</h4>
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase">Active</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{b.location || b.address || 'Logistics Depot'}</p>
                        <div className="text-[9px] text-slate-400 font-bold mt-1 flex items-center gap-3">
                          <span>Manager: {b.manager || 'Sarah Mitchell'}</span>
                          <span>Phone: {b.phone || '+61 2 9832 0011'}</span>
                        </div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={18} className="text-purple-600 shrink-0" />}
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end shrink-0">
              <button onClick={() => setIsBranchModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Asset Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md my-auto overflow-hidden animate-in fade-in zoom-in duration-150 max-h-[88vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-purple-600" /> Assign Asset
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Asset *</label>
                <select 
                  value={assignForm.assetId} 
                  onChange={e => setAssignForm({ ...assignForm, assetId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold bg-white cursor-pointer"
                >
                  <option value="">-- Choose Asset --</option>
                  {assetList.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.id}) - [{a.category}]</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Assign To (Driver / Department / Warehouse) *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Warehouse 1 - Yard Team or Driver #DRV-009"
                  value={assignForm.assignedTo} 
                  onChange={e => setAssignForm({ ...assignForm, assignedTo: e.target.value })} 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Purpose / Notes</label>
                <textarea 
                  rows="3"
                  placeholder="e.g. Assigned for daily container loading operations."
                  value={assignForm.purpose} 
                  onChange={e => setAssignForm({ ...assignForm, purpose: e.target.value })} 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-slate-800" 
                />
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
              <button onClick={() => setIsAssignModalOpen(false)} disabled={isSavingAssign} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
              <button onClick={handleSaveAssign} disabled={isSavingAssign || !assignForm.assetId || !assignForm.assignedTo} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-xs shadow-sm cursor-pointer disabled:opacity-50">
                {isSavingAssign ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Branch & Photo Modal */}
      {isEditBranchModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl my-auto overflow-hidden animate-in fade-in zoom-in duration-150 max-h-[88vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Edit size={16} className="text-purple-600" /> Edit Branch Details & Photo
              </h3>
              <button onClick={() => setIsEditBranchModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
              {/* Photo Preview & Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-slate-700">Branch Photo / Header Image</label>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Upload size={12} /> Upload Computer Image
                  </button>
                </div>
                
                <div className="relative rounded-xl overflow-hidden border border-slate-200 mb-3 h-36 bg-slate-100 flex items-center justify-center">
                  {editBranchForm.photo ? (
                    <img src={editBranchForm.photo} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-400 font-bold flex flex-col items-center gap-1">
                      <Building size={24} /> No Image Selected
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 bg-slate-900/70 text-white text-[9px] font-black px-2 py-0.5 rounded backdrop-blur-xs">PREVIEW</span>
                </div>

                {/* Preset Selector */}
                <div className="mb-3">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Choose Photo Preset</span>
                  <div className="grid grid-cols-5 gap-2">
                    {PHOTO_PRESETS.map((p, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setEditBranchForm({ ...editBranchForm, photo: p.url })}
                        className={`relative rounded-lg overflow-hidden h-14 border cursor-pointer group transition-all ${editBranchForm.photo === p.url ? 'border-purple-600 ring-2 ring-purple-500/30 scale-95' : 'border-slate-200 hover:border-slate-400'}`}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom URL Input */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Or Paste Custom Image URL</span>
                  <input 
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={editBranchForm.photo || ''}
                    onChange={e => setEditBranchForm({ ...editBranchForm, photo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Form Metadata Fields */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch Name *</label>
                  <input 
                    type="text" 
                    value={editBranchForm.name} 
                    onChange={e => setEditBranchForm({ ...editBranchForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-slate-800" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch Code</label>
                  <input 
                    type="text" 
                    placeholder="SYD-HO"
                    value={editBranchForm.code} 
                    onChange={e => setEditBranchForm({ ...editBranchForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-slate-800" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Address / Location</label>
                  <input 
                    type="text" 
                    placeholder="Eastern Creek, Sydney, NSW"
                    value={editBranchForm.location} 
                    onChange={e => setEditBranchForm({ ...editBranchForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-slate-800" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch Type</label>
                  <input 
                    type="text" 
                    placeholder="Head Office / Logistics Hub"
                    value={editBranchForm.type} 
                    onChange={e => setEditBranchForm({ ...editBranchForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-slate-800" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch Manager</label>
                  <input 
                    type="text" 
                    placeholder="Sarah Mitchell"
                    value={editBranchForm.manager} 
                    onChange={e => setEditBranchForm({ ...editBranchForm, manager: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-slate-800" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="+61 2 9832 0011"
                    value={editBranchForm.phone} 
                    onChange={e => setEditBranchForm({ ...editBranchForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-slate-800" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Time Zone</label>
                  <input 
                    type="text" 
                    placeholder="Australia/Sydney (AEST)"
                    value={editBranchForm.timeZone} 
                    onChange={e => setEditBranchForm({ ...editBranchForm, timeZone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-slate-800" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Currency</label>
                  <input 
                    type="text" 
                    placeholder="AUD"
                    value={editBranchForm.currency} 
                    onChange={e => setEditBranchForm({ ...editBranchForm, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-slate-800" 
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
              <button onClick={() => setIsEditBranchModalOpen(false)} disabled={isSavingBranch} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
              <button onClick={handleSaveBranch} disabled={isSavingBranch || !editBranchForm.name} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-xs shadow-sm cursor-pointer disabled:opacity-50">
                {isSavingBranch ? 'Saving Changes...' : 'Save Branch Details'}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
