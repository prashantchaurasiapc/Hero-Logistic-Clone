import React, { useState } from 'react';
import { 
  Search, Plus, MapPin, Trash2, Edit, X, List, Grid, Check, 
  ChevronRight, Calendar, AlertTriangle, ShieldCheck, HelpCircle,
  Truck, ArrowRight, Eye, RefreshCw
} from 'lucide-react';

export default function AssetInventory() {
  // State for Assets Data (matching screenshot exactly)
  const [assets, setAssets] = useState([
    { 
      id: '1', 
      name: '2022 Toyota Camry', 
      desc: 'White · Sedan · 1,450 kg', 
      vin: '1HFCKP7633APM4352', 
      plate: 'ABC 123', 
      status: 'IN DEPOT', 
      task: 'LD-2041', 
      target: 'Brisbane QLD', 
      targetSub: 'AutoDeal Pty Ltd', 
      img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=150&h=150&fit=crop&q=80' 
    },
    { 
      id: '2', 
      name: '2023 Honda CR-V', 
      desc: 'Black · SUV · 1,720 kg', 
      vin: '2T3RUDF87CR543210', 
      plate: 'XYZ 987', 
      status: 'IN TRANSIT', 
      task: 'LD-2039', 
      target: 'Melbourne VIC', 
      targetSub: 'Smith Motors', 
      img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150&h=150&fit=crop&q=80' 
    },
    { 
      id: '3', 
      name: '2024 Tesla Model S', 
      desc: 'Red · Sedan · 2,162 kg', 
      vin: '5YJSA1DP9F712345', 
      plate: 'EV 0001', 
      status: 'DELIVERED', 
      task: 'LD-2031', 
      target: 'Sydney NSW', 
      targetSub: 'EV Fleet Co', 
      img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=150&h=150&fit=crop&q=80' 
    },
    { 
      id: '4', 
      name: '2021 Ford Ranger', 
      desc: 'Silver · Ute · 2,030 kg', 
      vin: '3FADP4827FM123456', 
      plate: 'TRK 444', 
      status: 'AWAITING LOAD', 
      task: 'Available', 
      target: 'Perth WA', 
      targetSub: 'WA Motors', 
      img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=150&h=150&fit=crop&q=80' 
    },
    { 
      id: '5', 
      name: '2022 Nissan X-Trail', 
      desc: 'Blue · SUV · 1,680 kg', 
      vin: '1N4AL2AP72C234567', 
      plate: 'NIS 202', 
      status: 'IN DEPOT', 
      task: 'LD-2042', 
      target: 'Adelaide SA', 
      targetSub: 'SA Auto Group', 
      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150&h=150&fit=crop&q=80' 
    }
  ]);

  // UI Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  
  // Selection States
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Modals & Toast States
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAssetToEdit, setCurrentAssetToEdit] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success', 'error', 'info'

  // Input states for registering
  const [newAsset, setNewAsset] = useState({
    name: '',
    desc: '',
    vin: '',
    plate: '',
    status: 'AWAITING LOAD',
    task: 'Available',
    target: '',
    targetSub: '',
    img: ''
  });

  // Show customized Toast notifications
  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Checkbox: Toggle individual selection
  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Checkbox: Toggle select all visible items
  const getFilteredAssets = () => {
    return assets.filter(asset => {
      const matchQuery = 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.targetSub.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === 'ALL') return matchQuery;
      return matchQuery && asset.status === activeTab;
    });
  };

  const visibleAssets = getFilteredAssets();
  const isAllVisibleSelected = visibleAssets.length > 0 && visibleAssets.every(a => selectedIds.includes(a.id));

  const handleToggleSelectAll = () => {
    if (isAllVisibleSelected) {
      // Deselect all visible
      const visibleIds = visibleAssets.map(a => a.id);
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
      triggerToast('Deselected all assets in current view', 'info');
    } else {
      // Select all visible
      const visibleIds = visibleAssets.map(a => a.id);
      setSelectedIds(prev => {
        const union = new Set([...prev, ...visibleIds]);
        return Array.from(union);
      });
      triggerToast(`Selected ${visibleIds.length} assets`, 'info');
    }
  };

  // Register Asset Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.vin || !newAsset.plate) {
      triggerToast('Please fill out all required fields.', 'error');
      return;
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&h=150&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150&h=150&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=150&h=150&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=150&h=150&fit=crop&q=80'
    ];
    const randomImg = defaultImages[Math.floor(Math.random() * defaultImages.length)];

    const registered = {
      id: String(Date.now()),
      name: newAsset.name,
      desc: newAsset.desc || 'White · Sedan · 1,500 kg',
      vin: newAsset.vin.toUpperCase(),
      plate: newAsset.plate.toUpperCase(),
      status: newAsset.status,
      task: newAsset.task || 'Available',
      target: newAsset.target || 'Sydney NSW',
      targetSub: newAsset.targetSub || 'Central Depot',
      img: newAsset.img || randomImg
    };

    setAssets(prev => [registered, ...prev]);
    setShowRegisterModal(false);
    setNewAsset({
      name: '',
      desc: '',
      vin: '',
      plate: '',
      status: 'AWAITING LOAD',
      task: 'Available',
      target: '',
      targetSub: '',
      img: ''
    });
    triggerToast(`Successfully registered ${registered.name}`);
  };

  // Edit Asset Trigger & Submit
  const handleEditClick = (asset) => {
    setCurrentAssetToEdit({ ...asset });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!currentAssetToEdit.name || !currentAssetToEdit.vin || !currentAssetToEdit.plate) {
      triggerToast('Required fields are missing.', 'error');
      return;
    }

    setAssets(prev => prev.map(a => a.id === currentAssetToEdit.id ? currentAssetToEdit : a));
    setShowEditModal(false);
    triggerToast(`Updated details for ${currentAssetToEdit.name}`);
  };

  // Delete Asset
  const handleDeleteClick = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setAssets(prev => prev.filter(a => a.id !== id));
      setSelectedIds(prev => prev.filter(x => x !== id));
      triggerToast(`Removed ${name} from inventory`, 'error');
    }
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected assets?`)) {
      setAssets(prev => prev.filter(a => !selectedIds.includes(a.id)));
      setSelectedIds([]);
      triggerToast(`Bulk deleted ${selectedIds.length} assets`, 'error');
    }
  };

  const handleBulkStatusChange = (status) => {
    if (selectedIds.length === 0) return;
    setAssets(prev => prev.map(a => selectedIds.includes(a.id) ? { ...a, status } : a));
    triggerToast(`Updated ${selectedIds.length} assets to ${status}`);
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] min-h-screen p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl transition-all duration-300 transform scale-100 ${
          toastType === 'success' ? 'bg-slate-900 text-emerald-400 border border-emerald-500/20' :
          toastType === 'error' ? 'bg-slate-900 text-rose-400 border border-rose-500/20' :
          'bg-slate-900 text-sky-400 border border-sky-500/20'
        }`}>
          <div className="w-2.5 h-2.5 rounded-full animate-ping shrink-0 bg-current"></div>
          <span className="text-xs font-semibold text-white">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Asset Inventory</h1>
          <p className="text-slate-500 text-xs font-medium mt-1">
            {assets.length} assets registered · Global VIN Search
          </p>
        </div>
        
        <button
          onClick={() => setShowRegisterModal(true)}
          className="bg-[#FFA000] hover:bg-[#E58F00] text-slate-955 font-extrabold text-xs py-3 px-6 rounded-xl transition-all duration-150 shadow-sm cursor-pointer whitespace-nowrap tracking-wider flex items-center gap-2 transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> REGISTER ASSET
        </button>
      </div>

      {/* FILTER CONTROLS ROW */}
      <div className="bg-white border border-slate-100 rounded-[20px] p-4 mb-6 shadow-sm flex flex-col xl:flex-row justify-between items-center gap-4">
        
        {/* Search */}
        <div className="relative w-full xl:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search VIN, Plate, Make, Model, Destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white shadow-3xs transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-200/60 rounded px-1.5 py-0.5 text-[9px] font-black text-slate-500 pointer-events-none select-none tracking-tighter">
            ⌘K
          </div>
        </div>

        {/* View Switches & Tabs */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto justify-end">
          
          {/* List/Grid View Button Group */}
          <div className="flex bg-slate-100/80 p-1 border border-slate-200/45 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg cursor-pointer transition-all ${
                viewMode === 'list' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="List View"
            >
              <List size={14} className="stroke-[2.5px]" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg cursor-pointer transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <Grid size={14} className="stroke-[2.5px]" />
            </button>
          </div>

          {/* Status Tabs Capsule */}
          <div className="flex bg-slate-55 p-1 rounded-full border border-slate-200/50 overflow-x-auto max-w-full no-scrollbar scrollbar-none flex-nowrap w-full">
            {['ALL', 'AWAITING LOAD', 'IN DEPOT', 'IN TRANSIT', 'DELIVERED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-[10px] font-extrabold cursor-pointer transition-all uppercase whitespace-nowrap tracking-wider flex-shrink-0 ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 border border-slate-200/80 shadow-xs font-black'
                    : 'text-slate-400 hover:text-slate-800'
                }`}
              >
                {tab === 'ALL' ? 'ALL' : tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BULK ACTIONS BANNER */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white rounded-[16px] px-6 py-3.5 mb-6 flex flex-col md:flex-row justify-between items-center gap-3 animate-fade-in shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">
              Selected <span className="text-[#FFA000] font-black">{selectedIds.length}</span> assets
            </span>
            <div className="h-4 w-px bg-slate-750 hidden md:block"></div>
            <button 
              onClick={() => setSelectedIds([])}
              className="text-[10px] font-black text-slate-400 hover:text-white uppercase transition-colors"
            >
              Clear Selection
            </button>
          </div>

          <div className="flex gap-2.5 items-center flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Mark Status:</span>
            {['AWAITING LOAD', 'IN DEPOT', 'IN TRANSIT', 'DELIVERED'].map(st => (
              <button
                key={st}
                onClick={() => handleBulkStatusChange(st)}
                className="bg-slate-800 hover:bg-slate-700 text-[10px] text-white font-extrabold px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors uppercase cursor-pointer"
              >
                {st.replace('_', ' ')}
              </button>
            ))}
            <div className="h-5 w-px bg-slate-750"></div>
            <button
              onClick={handleBulkDelete}
              className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[10px] font-extrabold px-3 py-1.5 rounded-lg border border-rose-900 transition-colors uppercase cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 size={12} /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* CORE CONTENT LAYOUT */}
      {visibleAssets.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[20px] p-12 text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Assets Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters, switching tabs, or registering a new asset to get started.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        
        /* LIST VIEW TABLE */
        <div className="bg-white border border-slate-100 rounded-[20px] shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-4 pl-6 w-12">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isAllVisibleSelected}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded text-[#FFA000] border-slate-300 focus:ring-[#FFA000] accent-[#FFA000] cursor-pointer"
                    />
                  </div>
                </th>
                <th className="py-4 px-4 font-black">REGISTERED ASSET</th>
                <th className="py-4 px-4 font-black">VIN / PLATE</th>
                <th className="py-4 px-4 font-black">OPERATIONAL STATUS</th>
                <th className="py-4 px-4 font-black">CURRENT TASK</th>
                <th className="py-4 px-4 font-black">TARGET</th>
                <th className="py-4 pr-6 text-right font-black"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visibleAssets.map((asset) => {
                const isSelected = selectedIds.includes(asset.id);
                return (
                  <tr 
                    key={asset.id} 
                    className={`text-xs hover:bg-slate-50/40 transition-colors duration-150 group ${
                      isSelected ? 'bg-slate-50/80 font-medium' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-4 pl-6 align-middle">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(asset.id)}
                          className="w-4 h-4 rounded text-[#FFA000] border-slate-300 focus:ring-[#FFA000] accent-[#FFA000] cursor-pointer"
                        />
                      </div>
                    </td>

                    {/* Image & Description */}
                    <td className="py-4 px-4 align-middle">
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={asset.img} 
                          alt={asset.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200/80 shadow-2xs shrink-0" 
                        />
                        <div className="text-left">
                          <span className="text-xs font-extrabold text-slate-800 block leading-tight">
                            {asset.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-1 leading-none">
                            {asset.desc}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* VIN / Plate */}
                    <td className="py-4 px-4 align-middle font-mono">
                      <span className="px-2 py-0.5 border border-slate-100 rounded bg-slate-50 text-slate-500 text-[9px] font-semibold tracking-tighter block w-max">
                        {asset.vin}
                      </span>
                      <span className="text-[10px] text-slate-900 font-extrabold block mt-1 tracking-tight">
                        {asset.plate}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 align-middle">
                      <span className={`px-2.5 py-1 text-[9px] font-black rounded-lg inline-block text-center uppercase tracking-wider ${
                        asset.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        asset.status === 'IN TRANSIT' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        asset.status === 'IN DEPOT' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-slate-100 text-slate-600 border border-slate-150'
                      }`}>
                        {asset.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Current Task */}
                    <td className="py-4 px-4 align-middle">
                      <span className={`text-[11px] font-black tracking-tight ${
                        asset.task === 'Available' 
                          ? 'text-slate-400' 
                          : 'text-[#1D4ED8] hover:underline cursor-pointer'
                      }`}>
                        {asset.task}
                      </span>
                    </td>

                    {/* Target */}
                    <td className="py-4 px-4 align-middle">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <div className="text-left">
                          <span className="text-[11px] font-extrabold text-slate-800 block leading-tight">
                            {asset.target}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5 leading-none">
                            {asset.targetSub}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 pr-6 align-middle text-right">
                      <div className="flex gap-2 justify-end opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditClick(asset)}
                          className="p-1.5 bg-violet-50 text-violet-600 hover:bg-violet-100 rounded-lg border border-violet-100 transition-colors cursor-pointer"
                          title="Edit Asset"
                        >
                          <Edit size={13} className="stroke-[2.5px]" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(asset.id, asset.name)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg border border-rose-100 transition-colors cursor-pointer"
                          title="Delete Asset"
                        >
                          <Trash2 size={13} className="stroke-[2.5px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        
        /* GRID VIEW LAYOUT */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleAssets.map((asset) => {
            const isSelected = selectedIds.includes(asset.id);
            return (
              <div 
                key={asset.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm flex flex-col ${
                  isSelected 
                    ? 'border-[#FFA000] ring-1 ring-[#FFA000]' 
                    : 'border-slate-100 hover:border-slate-250 hover:shadow-md'
                }`}
              >
                {/* Header Image Cover */}
                <div className="h-36 relative bg-slate-900">
                  <img src={asset.img} alt={asset.name} className="w-full h-full object-cover opacity-90" />
                  
                  {/* Selection Overlay Checkbox */}
                  <div className="absolute top-3 left-3 bg-white/90 p-1.5 rounded-lg shadow-sm">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(asset.id)}
                      className="w-4 h-4 rounded text-[#FFA000] border-slate-300 focus:ring-[#FFA000] accent-[#FFA000] cursor-pointer block"
                    />
                  </div>

                  {/* Status Overlay */}
                  <div className="absolute bottom-3 right-3">
                    <span className={`px-2 py-0.5 text-[8px] font-black rounded border uppercase tracking-wider ${
                      asset.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      asset.status === 'IN TRANSIT' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      asset.status === 'IN DEPOT' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {asset.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-4 flex-grow flex flex-col justify-between text-left">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 truncate">{asset.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 mb-3">{asset.desc}</p>
                    
                    <div className="space-y-2 text-[10px]">
                      <div className="flex justify-between border-b border-slate-50 pb-1.5">
                        <span className="text-slate-400 font-bold">PLATE / VIN</span>
                        <span className="font-mono text-slate-800 font-extrabold">{asset.plate}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-1.5">
                        <span className="text-slate-400 font-bold">TASK</span>
                        <span className={`font-black ${asset.task === 'Available' ? 'text-slate-400' : 'text-blue-600'}`}>{asset.task}</span>
                      </div>
                      <div className="flex items-start gap-1.5 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold text-slate-800 leading-tight">{asset.target}</p>
                          <p className="text-[9px] text-slate-400 font-medium leading-tight mt-0.5">{asset.targetSub}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex justify-between items-center border-t border-slate-100 mt-4 pt-3.5">
                    <span className="font-mono text-[9px] text-slate-400 select-all truncate max-w-[120px]">{asset.vin}</span>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleEditClick(asset)}
                        className="p-1.5 bg-violet-50 text-violet-600 hover:bg-violet-100 rounded-lg border border-violet-100 transition-colors cursor-pointer"
                      >
                        <Edit size={12} className="stroke-[2.5px]" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(asset.id, asset.name)}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg border border-rose-100 transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} className="stroke-[2.5px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==========================================
          REGISTER NEW ASSET MODAL OVERLAY
          ========================================== */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 text-left relative transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Register New Asset</h3>
                <p className="text-[11px] text-slate-400 font-bold mt-1">Add vehicle or equipment details to the dispatch logs</p>
              </div>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
              >
                <X size={18} className="stroke-[2.5px]" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Make & Model */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Asset Name (Required)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024 Toyota Camry"
                    value={newAsset.name}
                    onChange={e => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>

                {/* Details / Desc */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Specification / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. White · Sedan · 1,450 kg"
                    value={newAsset.desc}
                    onChange={e => setNewAsset(prev => ({ ...prev, desc: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* VIN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">VIN (Required)</label>
                  <input
                    type="text"
                    required
                    maxLength={17}
                    placeholder="17-character alphanumeric"
                    value={newAsset.vin}
                    onChange={e => setNewAsset(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold font-mono focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>

                {/* Plate */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Plate (Required)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ABC 123"
                    value={newAsset.plate}
                    onChange={e => setNewAsset(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</label>
                  <select
                    value={newAsset.status}
                    onChange={e => setNewAsset(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white cursor-pointer"
                  >
                    <option value="AWAITING LOAD">AWAITING LOAD</option>
                    <option value="IN DEPOT">IN DEPOT</option>
                    <option value="IN TRANSIT">IN TRANSIT</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>

                {/* Current Task */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Current Task</label>
                  <input
                    type="text"
                    placeholder="e.g. LD-2041 or Available"
                    value={newAsset.task}
                    onChange={e => setNewAsset(prev => ({ ...prev, task: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Target Destination */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Target Destination</label>
                  <input
                    type="text"
                    placeholder="e.g. Sydney NSW"
                    value={newAsset.target}
                    onChange={e => setNewAsset(prev => ({ ...prev, target: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>

                {/* Target Company */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Target Company</label>
                  <input
                    type="text"
                    placeholder="e.g. EV Fleet Co"
                    value={newAsset.targetSub}
                    onChange={e => setNewAsset(prev => ({ ...prev, targetSub: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>
              </div>

              {/* Photo Image URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/vehicle-image.jpg"
                  value={newAsset.img}
                  onChange={e => setNewAsset(prev => ({ ...prev, img: e.target.value }))}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FFA000] hover:bg-[#E58F00] text-slate-955 rounded-xl text-xs font-black transition-colors cursor-pointer"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          EDIT ASSET MODAL OVERLAY
          ========================================== */}
      {showEditModal && currentAssetToEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 text-left relative transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Edit Asset Details</h3>
                <p className="text-[11px] text-slate-400 font-bold mt-1">Modify registered specifications, status or destinations</p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
              >
                <X size={18} className="stroke-[2.5px]" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Make & Model */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Asset Name (Required)</label>
                  <input
                    type="text"
                    required
                    value={currentAssetToEdit.name}
                    onChange={e => setCurrentAssetToEdit(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>

                {/* Details / Desc */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Specification / Description</label>
                  <input
                    type="text"
                    value={currentAssetToEdit.desc}
                    onChange={e => setCurrentAssetToEdit(prev => ({ ...prev, desc: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* VIN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">VIN (Required)</label>
                  <input
                    type="text"
                    required
                    maxLength={17}
                    value={currentAssetToEdit.vin}
                    onChange={e => setCurrentAssetToEdit(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold font-mono focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>

                {/* Plate */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Plate (Required)</label>
                  <input
                    type="text"
                    required
                    value={currentAssetToEdit.plate}
                    onChange={e => setCurrentAssetToEdit(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</label>
                  <select
                    value={currentAssetToEdit.status}
                    onChange={e => setCurrentAssetToEdit(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white cursor-pointer"
                  >
                    <option value="AWAITING LOAD">AWAITING LOAD</option>
                    <option value="IN DEPOT">IN DEPOT</option>
                    <option value="IN TRANSIT">IN TRANSIT</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>

                {/* Current Task */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Current Task</label>
                  <input
                    type="text"
                    value={currentAssetToEdit.task}
                    onChange={e => setCurrentAssetToEdit(prev => ({ ...prev, task: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Target Destination */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Target Destination</label>
                  <input
                    type="text"
                    value={currentAssetToEdit.target}
                    onChange={e => setCurrentAssetToEdit(prev => ({ ...prev, target: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>

                {/* Target Company */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Target Company</label>
                  <input
                    type="text"
                    value={currentAssetToEdit.targetSub}
                    onChange={e => setCurrentAssetToEdit(prev => ({ ...prev, targetSub: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>
              </div>

              {/* Photo Image URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Image URL (Optional)</label>
                <input
                  type="url"
                  value={currentAssetToEdit.img}
                  onChange={e => setCurrentAssetToEdit(prev => ({ ...prev, img: e.target.value }))}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FFA000] hover:bg-[#E58F00] text-slate-955 rounded-xl text-xs font-black transition-colors cursor-pointer"
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
}

