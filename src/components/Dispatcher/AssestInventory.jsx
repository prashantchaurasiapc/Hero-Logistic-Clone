import React, { useState } from 'react';
import { Search, Plus, MapPin, Edit, Trash2, X, Check, Grid, List } from 'lucide-react';

export default function AssestInventory() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [selectedRows, setSelectedRows] = useState({});
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Form state for register/edit
  const [assetForm, setAssetForm] = useState({
    id: '',
    year: '2023',
    make: '',
    model: '',
    color: 'White',
    class: 'Sedan',
    weight: '1,500 kg',
    vin: '',
    plate: '',
    status: 'IN DEPOT',
    task: 'Available',
    target: '',
    client: ''
  });

  const [inventoryList, setInventoryList] = useState([
    {
      id: '1',
      year: '2022',
      make: 'Toyota',
      model: 'Camry',
      color: 'White',
      class: 'Sedan',
      weight: '1,450 kg',
      vin: '1HGCP2F82CA004352',
      plate: 'ABC 123',
      status: 'IN DEPOT',
      task: 'LD-2041',
      target: 'Brisbane QLD',
      client: 'AutoDeal Pty Ltd',
      thumbnail: '🚗'
    },
    {
      id: '2',
      year: '2023',
      make: 'Honda',
      model: 'CR-V',
      color: 'Black',
      class: 'SUV',
      weight: '1,720 kg',
      vin: '2T3BUHEX6JC034820',
      plate: 'XYZ 987',
      status: 'IN TRANSIT',
      task: 'LD-2039',
      target: 'Melbourne VIC',
      client: 'Smith Motors',
      thumbnail: '🚙'
    },
    {
      id: '3',
      year: '2024',
      make: 'Tesla',
      model: 'Model S',
      color: 'Red',
      class: 'Sedan',
      weight: '2,182 kg',
      vin: '5YJ3E1EA5GF312345',
      plate: 'EV 0001',
      status: 'DELIVERED',
      task: 'LD-2031',
      target: 'Sydney NSW',
      client: 'EV Fleet Co',
      thumbnail: '🏎️'
    },
    {
      id: '4',
      year: '2021',
      make: 'Ford',
      model: 'Ranger',
      color: 'Silver',
      class: 'Ute',
      weight: '2,030 kg',
      vin: '3FADP4BJ7FM123456',
      plate: 'TRK 444',
      status: 'AWAITING LOAD',
      task: 'Available',
      target: 'Perth WA',
      client: 'WA Motors',
      thumbnail: '🛻'
    },
    {
      id: '5',
      year: '2022',
      make: 'Nissan',
      model: 'X-Trail',
      color: 'Blue',
      class: 'SUV',
      weight: '1,680 kg',
      vin: '1N4AL3AP7JC234567',
      plate: 'NIS 202',
      status: 'IN DEPOT',
      task: 'LD-2042',
      target: 'Adelaide SA',
      client: 'SA Auto Group',
      thumbnail: '🚙'
    }
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Checkbox functions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allSelected = {};
      filteredAssets.forEach(item => {
        allSelected[item.id] = true;
      });
      setSelectedRows(allSelected);
    } else {
      setSelectedRows({});
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Add / Edit submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingAsset) {
      // Edit mode
      setInventoryList(prev => prev.map(item => 
        item.id === editingAsset.id 
          ? { 
              ...item, 
              year: assetForm.year,
              make: assetForm.make,
              model: assetForm.model,
              color: assetForm.color,
              class: assetForm.class,
              weight: assetForm.weight,
              vin: assetForm.vin,
              plate: assetForm.plate,
              status: assetForm.status,
              task: assetForm.task,
              target: assetForm.target,
              client: assetForm.client
            }
          : item
      ));
      triggerToast(`Asset ${assetForm.make} ${assetForm.model} details updated successfully.`);
      setEditingAsset(null);
    } else {
      // Register mode
      const newItem = {
        id: String(inventoryList.length + 1),
        year: assetForm.year,
        make: assetForm.make,
        model: assetForm.model,
        color: assetForm.color,
        class: assetForm.class,
        weight: assetForm.weight,
        vin: assetForm.vin || `VIN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        plate: assetForm.plate || 'TBA 000',
        status: assetForm.status,
        task: assetForm.task,
        target: assetForm.target || 'Sydney Depot',
        client: assetForm.client || 'Internal Logistics',
        thumbnail: assetForm.class === 'SUV' ? '🚙' : assetForm.class === 'Ute' ? '🛻' : '🚗'
      };
      setInventoryList([...inventoryList, newItem]);
      triggerToast(`New asset ${newItem.make} ${newItem.model} registered successfully.`);
    }

    setIsRegisterModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAssetForm({
      id: '',
      year: '2023',
      make: '',
      model: '',
      color: 'White',
      class: 'Sedan',
      weight: '1,500 kg',
      vin: '',
      plate: '',
      status: 'IN DEPOT',
      task: 'Available',
      target: '',
      client: ''
    });
  };

  const handleEditClick = (item) => {
    setEditingAsset(item);
    setAssetForm({
      year: item.year,
      make: item.make,
      model: item.model,
      color: item.color,
      class: item.class,
      weight: item.weight,
      vin: item.vin,
      plate: item.plate,
      status: item.status,
      task: item.task,
      target: item.target,
      client: item.client
    });
    setIsRegisterModalOpen(true);
  };

  const handleDeleteAsset = (id, name) => {
    setInventoryList(prev => prev.filter(item => item.id !== id));
    triggerToast(`Asset ${name} removed from inventory.`);
  };

  // Filter & Search Logic
  const filteredAssets = inventoryList.filter(item => {
    const searchString = `${item.make} ${item.model} ${item.vin} ${item.plate} ${item.target} ${item.client}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    
    if (activeTab === 'AWAITING LOAD') return matchesSearch && item.status === 'AWAITING LOAD';
    if (activeTab === 'IN DEPOT') return matchesSearch && item.status === 'IN DEPOT';
    if (activeTab === 'IN TRANSIT') return matchesSearch && item.status === 'IN TRANSIT';
    if (activeTab === 'DELIVERED') return matchesSearch && item.status === 'DELIVERED';
    return matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left flex flex-col space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">{toastMsg}</div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-gray-100">
        <div className="text-left">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">DISPATCHER</span>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1.5 flex items-center gap-2">
            Asset Inventory
          </h1>
          <p className="text-gray-550 text-xs font-semibold">
            {inventoryList.length} assets registered · Global VIN Search
          </p>
        </div>

        <button 
          onClick={() => {
            setEditingAsset(null);
            resetForm();
            setIsRegisterModalOpen(true);
          }}
          className="bg-[#FFD400] hover:bg-yellow-400 text-black font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={3} /> Register Asset
        </button>
      </div>

      {/* Controls row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search VIN, Plate, Make, Model, Destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 pl-10 pr-12 py-2.5 bg-white border border-gray-250 rounded-xl text-xs font-bold text-gray-755 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-400 border border-gray-200 px-1 py-0.5 rounded-md select-none bg-gray-50">⌘ K</span>
          </div>

          {/* List switcher */}
          <div className="flex border border-gray-200 rounded-xl overflow-hidden shrink-0 shadow-3xs">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-gray-100 text-black' : 'bg-white text-gray-400 hover:text-gray-700'}`}
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-gray-100 text-black' : 'bg-white text-gray-400 hover:text-gray-700'}`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 flex-wrap border border-gray-200 p-1 rounded-xl bg-white shadow-3xs w-full md:w-auto">
          {['ALL', 'AWAITING LOAD', 'IN DEPOT', 'IN TRANSIT', 'DELIVERED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-gray-900 text-white shadow-xs' 
                  : 'text-gray-405 hover:text-gray-700 bg-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

      </div>

      {/* VIEW MODES */}
      {viewMode === 'list' ? (
        /* Asset Table List */
        <div className="bg-white rounded-3xl border border-gray-150 shadow-3xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/40 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left w-12">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll} 
                      className="rounded border-gray-300 focus:ring-[#FFD400] cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">REGISTERED ASSET</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">VIN / PLATE</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">OPERATIONAL STATUS</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">CURRENT TASK</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">TARGET</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAssets.length > 0 ? filteredAssets.map((asset, i) => {
                  const isRowSelected = !!selectedRows[asset.id];
                  return (
                    <tr key={i} className={`hover:bg-gray-50/30 transition-colors ${isRowSelected ? 'bg-amber-50/10' : ''}`}>
                      {/* Checkbox */}
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <input 
                          type="checkbox" 
                          checked={isRowSelected}
                          onChange={() => handleSelectRow(asset.id)}
                          className="rounded border-gray-300 focus:ring-[#FFD400] cursor-pointer"
                        />
                      </td>

                      {/* Registered Asset Details */}
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border border-gray-150 bg-gray-50 flex items-center justify-center text-lg shadow-3xs shrink-0 select-none">
                            {asset.thumbnail}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-955 block">{asset.year} {asset.make} {asset.model}</span>
                            <span className="text-[10px] text-gray-400 font-semibold">{asset.color} • {asset.class} • {asset.weight}</span>
                          </div>
                        </div>
                      </td>

                      {/* VIN / Plate */}
                      <td className="px-6 py-4 text-left font-mono">
                        <span className="text-[10px] font-semibold text-gray-650 bg-gray-100 border border-gray-150 px-2 py-0.5 rounded-lg select-all inline-block">{asset.vin}</span>
                        <span className="text-[10px] text-gray-400 font-bold block mt-1 tracking-wide uppercase">{asset.plate}</span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded text-[8px] font-black tracking-wider uppercase ${
                            asset.status === 'IN DEPOT' ? 'bg-blue-50 text-blue-600' :
                            asset.status === 'IN TRANSIT' ? 'bg-amber-50 text-amber-600' :
                            asset.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {asset.status}
                          </span>
                        </div>
                      </td>

                      {/* Current Task */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {asset.task !== 'Available' ? (
                          <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer select-all">{asset.task}</span>
                        ) : (
                          <span className="text-xs font-bold text-gray-400">{asset.task}</span>
                        )}
                      </td>

                      {/* Target location */}
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-gray-900 block">{asset.target}</span>
                            <span className="text-[10px] text-gray-400 font-semibold">{asset.client}</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => handleEditClick(asset)}
                            className="w-7 h-7 bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors shadow-3xs"
                            title="Edit Asset"
                          >
                            <Edit size={12} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAsset(asset.id, `${asset.make} ${asset.model}`)}
                            className="w-7 h-7 bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors shadow-3xs"
                            title="Delete Asset"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-450 font-bold text-xs">
                      No assets found matching the selected parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Asset Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset, i) => (
            <div key={i} className="bg-white border border-gray-150 p-5 rounded-3xl flex flex-col justify-between shadow-3xs relative overflow-hidden h-60">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-lg shadow-3xs">
                    {asset.thumbnail}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-gray-955 block">{asset.year} {asset.make} {asset.model}</span>
                    <span className="text-[9px] text-gray-450 font-bold uppercase block mt-0.5">{asset.plate}</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button onClick={() => handleEditClick(asset)} className="p-1.5 hover:bg-gray-50 rounded-lg border border-gray-100 text-purple-600"><Edit size={12} /></button>
                  <button onClick={() => handleDeleteAsset(asset.id, `${asset.make} ${asset.model}`)} className="p-1.5 hover:bg-gray-50 rounded-lg border border-gray-100 text-red-500"><Trash2 size={12} /></button>
                </div>
              </div>

              <div className="py-2 border-t border-b border-gray-50 my-2 space-y-2 text-left text-xs font-bold text-gray-800">
                <div className="flex justify-between">
                  <span className="text-gray-400">VIN:</span>
                  <span className="font-mono text-[10px] bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 select-all">{asset.vin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Task:</span>
                  <span className="text-blue-600 font-black">{asset.task}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1.5">
                <div className="flex items-start gap-1 text-left">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-900 block leading-tight">{asset.target}</span>
                    <span className="text-[9px] text-gray-400 font-semibold block">{asset.client}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                  asset.status === 'IN DEPOT' ? 'bg-blue-50 text-blue-600' :
                  asset.status === 'IN TRANSIT' ? 'bg-amber-50 text-amber-600' :
                  'bg-emerald-50 text-emerald-700'
                }`}>
                  {asset.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REGISTER / EDIT ASSET MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                {editingAsset ? 'Edit Asset Record' : 'Register New Asset'}
              </h2>
              <button onClick={() => setIsRegisterModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-450 mb-1">Make / Brand</label>
                  <input
                    type="text" required
                    placeholder="e.g. Toyota"
                    value={assetForm.make}
                    onChange={e => setAssetForm({ ...assetForm, make: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">Model Name</label>
                  <input
                    type="text" required
                    placeholder="e.g. Camry"
                    value={assetForm.model}
                    onChange={e => setAssetForm({ ...assetForm, model: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">Year</label>
                  <input
                    type="text" required
                    placeholder="2023"
                    value={assetForm.year}
                    onChange={e => setAssetForm({ ...assetForm, year: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">Color</label>
                  <input
                    type="text" required
                    placeholder="White"
                    value={assetForm.color}
                    onChange={e => setAssetForm({ ...assetForm, color: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">Class</label>
                  <select
                    value={assetForm.class}
                    onChange={e => setAssetForm({ ...assetForm, class: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Ute">Ute</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">VIN Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 1HGCP2F82CA..."
                    value={assetForm.vin}
                    onChange={e => setAssetForm({ ...assetForm, vin: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">Plate Number</label>
                  <input
                    type="text"
                    placeholder="e.g. ABC 123"
                    value={assetForm.plate}
                    onChange={e => setAssetForm({ ...assetForm, plate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">Status</label>
                  <select
                    value={assetForm.status}
                    onChange={e => setAssetForm({ ...assetForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="IN DEPOT">IN DEPOT</option>
                    <option value="IN TRANSIT">IN TRANSIT</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="AWAITING LOAD">AWAITING LOAD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">Current Task</label>
                  <input
                    type="text"
                    placeholder="e.g. LD-2041 or Available"
                    value={assetForm.task}
                    onChange={e => setAssetForm({ ...assetForm, task: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">Destination Target</label>
                  <input
                    type="text"
                    placeholder="e.g. Sydney NSW"
                    value={assetForm.target}
                    onChange={e => setAssetForm({ ...assetForm, target: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">Client/Carrier</label>
                  <input
                    type="text"
                    placeholder="e.g. AutoDeal Pty Ltd"
                    value={assetForm.client}
                    onChange={e => setAssetForm({ ...assetForm, client: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFD400] hover:bg-yellow-400 text-black font-bold py-3 rounded-xl text-xs mt-3 cursor-pointer transition-colors shadow-sm"
              >
                {editingAsset ? 'UPDATE DETAILS' : 'REGISTER ASSET'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
