import React, { useState } from 'react';
import { 
  Plus, Search, List, Grid, Edit, Trash2, X, ChevronDown, MapPin, Truck, ArrowLeft, Building, AlertCircle
} from 'lucide-react';

const initialAssets = [
  {
    id: '1',
    name: '2022 Toyota Camry',
    desc: 'White · Sedan · 1,450 kg',
    vin: '1HGYD2F83MA004262',
    plate: 'ABC 123',
    status: 'IN DEPOT',
    task: 'LD-2041',
    target: 'Brisbane QLD',
    targetSub: 'AutoDeal Pty Ltd',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: '2',
    name: '2023 Honda CR-V',
    desc: 'Black · SUV · 1,720 kg',
    vin: '2T2YG4H08NC034828',
    plate: 'XYZ 987',
    status: 'IN TRANSIT',
    task: 'LD-2039',
    target: 'Melbourne VIC',
    targetSub: 'Smith Motors',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: '3',
    name: '2024 Tesla Model S',
    desc: 'Red · Sedan · 2,162 kg',
    vin: '5YJSA1DG9PFJ12345',
    plate: 'EV 0001',
    status: 'DELIVERED',
    task: 'LD-2031',
    target: 'Sydney NSW',
    targetSub: 'EV Fleet Co',
    img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: '4',
    name: '2021 Ford Ranger',
    desc: 'Silver · Ute · 2,030 kg',
    vin: '3FADP4BJ7FM123456',
    plate: 'TRK 444',
    status: 'AWAITING LOAD',
    task: 'Available',
    target: 'Perth WA',
    targetSub: 'WA Motors',
    img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: '5',
    name: '2022 Nissan X-Trail',
    desc: 'Blue · SUV · 1,680 kg',
    vin: '1N4AL3AP7JC234567',
    plate: 'NIS 202',
    status: 'IN DEPOT',
    task: 'LD-2042',
    target: 'Adelaide SA',
    targetSub: 'SA Auto Group',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60'
  }
];

export default function Assets() {
  const [assetsList, setAssetsList] = useState(initialAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  
  // Roster registration/edit form state
  const [assetForm, setAssetForm] = useState({
    name: '',
    desc: '',
    vin: '',
    plate: '',
    target: '',
    targetSub: '',
    status: 'AWAITING LOAD'
  });

  const handleInputChange = (field, value) => {
    setAssetForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenRegister = () => {
    setEditingAsset(null);
    setAssetForm({
      name: '',
      desc: '',
      vin: '',
      plate: '',
      target: '',
      targetSub: '',
      status: 'AWAITING LOAD'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (asset) => {
    setEditingAsset(asset);
    setAssetForm({
      name: asset.name,
      desc: asset.desc,
      vin: asset.vin,
      plate: asset.plate,
      target: asset.target,
      targetSub: asset.targetSub,
      status: asset.status
    });
    setShowModal(true);
  };

  const handleDeleteAsset = (id) => {
    setAssetsList(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmitAsset = (e) => {
    e.preventDefault();
    if (!assetForm.name || !assetForm.vin) return;

    if (editingAsset) {
      // Edit mode
      const updatedAsset = {
        ...editingAsset,
        name: assetForm.name,
        desc: assetForm.desc,
        vin: assetForm.vin.toUpperCase(),
        plate: assetForm.plate.toUpperCase(),
        target: assetForm.target,
        targetSub: assetForm.targetSub,
        status: assetForm.status
      };
      setAssetsList(prev => prev.map(a => a.id === editingAsset.id ? updatedAsset : a));
    } else {
      // Create mode
      const isTruck = assetForm.name.toLowerCase().includes('ranger') || assetForm.name.toLowerCase().includes('tesla') || assetForm.name.toLowerCase().includes('model s');
      const imgUrl = isTruck 
        ? 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60';
        
      const newAssetObj = {
        id: Date.now().toString(),
        name: assetForm.name,
        desc: assetForm.desc || 'White · Sedan · 1,500 kg',
        vin: assetForm.vin.toUpperCase(),
        plate: assetForm.plate.toUpperCase(),
        status: assetForm.status,
        task: 'Available',
        target: assetForm.target || 'Sydney NSW',
        targetSub: assetForm.targetSub || 'Central Depot',
        img: imgUrl
      };
      setAssetsList(prev => [newAssetObj, ...prev]);
    }

    setShowModal(false);
  };

  const filteredAssets = assetsList.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.target.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeTab === 'ALL') return matchesSearch;
    return matchesSearch && a.status === activeTab;
  });

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header Block */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5">Asset Inventory</h1>
          <p className="text-slate-500 text-xs font-semibold">{assetsList.length} assets registered · Global VIN Search</p>
        </div>
        <button
          onClick={handleOpenRegister}
          className="bg-[#141414] hover:bg-black text-white text-xs font-extrabold py-3 px-5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer border-0 uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> Register Asset
        </button>
      </div>

      {/* Main card wrapper */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-xs">
        {/* Filter controls row */}
        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full xl:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search VIN, Plate, Make, Model, Destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-705 placeholder-slate-400 shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-between sm:justify-end">
            {/* View layout toggler */}
            <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-0.5 shadow-2xs">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg cursor-pointer transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <List size={14} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg cursor-pointer transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <Grid size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* Filter categories tabs */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl shadow-2xs overflow-x-auto flex-nowrap max-w-full">
              {['ALL', 'AWAITING LOAD', 'IN DEPOT', 'IN TRANSIT', 'DELIVERED'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-2 rounded-lg text-[9px] font-black cursor-pointer uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-450 hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Layout Output */}
        {filteredAssets.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-wider">No assets match criteria.</div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4 w-10 text-center"><input type="checkbox" className="rounded border-slate-200 cursor-pointer w-3.5 h-3.5" /></th>
                  <th className="py-3 px-4 text-slate-400">REGISTERED ASSET</th>
                  <th className="py-3 px-4 text-slate-400">VIN / PLATE</th>
                  <th className="py-3 px-4 text-slate-400">OPERATIONAL STATUS</th>
                  <th className="py-3 px-4 text-slate-400">CURRENT TASK</th>
                  <th className="py-3 px-4 text-slate-400">TARGET</th>
                  <th className="py-3 px-4 text-right pr-6 text-slate-400">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                {filteredAssets.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/40 transition-colors duration-150 group">
                    <td className="py-4 px-4 text-center"><input type="checkbox" className="rounded border-slate-200 cursor-pointer w-3.5 h-3.5" /></td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={a.img} alt={a.name} className="w-9 h-9 rounded-lg object-cover border border-slate-100 shadow-2xs shrink-0" />
                        <div>
                          <span className="text-xs font-black text-slate-850 block leading-tight mb-0.5 group-hover:text-[#EAB308] transition-colors">{a.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold block leading-none">{a.desc}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-1.5 py-0.5 border border-slate-100 rounded bg-slate-50/60 font-mono text-[9px] font-bold block w-max tracking-wide text-slate-600">{a.vin}</span>
                      <span className="text-[10px] text-slate-800 font-black block mt-1 leading-none">{a.plate}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 text-[8px] font-black rounded border uppercase tracking-wider ${
                        a.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        a.status === 'IN TRANSIT' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        a.status === 'IN DEPOT' ? 'bg-blue-55 text-blue-600 border-blue-100' :
                        'bg-slate-50 text-slate-500 border-slate-150'
                      }`}>{a.status}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-[11px] font-black uppercase tracking-wider ${a.task === 'Available' ? 'text-slate-400 font-bold' : 'text-blue-600 hover:underline cursor-pointer'}`}>
                        {a.task}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-slate-800 font-bold leading-tight mb-0.5">{a.target}</div>
                      <span className="text-[10px] text-slate-400 font-semibold block leading-none">{a.targetSub}</span>
                    </td>
                    <td className="py-4 px-4 text-right pr-6">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleOpenEdit(a)}
                          className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-[#EAB308] hover:border-amber-200 hover:bg-amber-50 transition-all cursor-pointer bg-white"
                        >
                          <Edit size={13} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(a.id)}
                          className="p-1.5 border border-slate-200 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer bg-white"
                        >
                          <Trash2 size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map(a => {
              const nameParts = a.name.split(' ');
              const yearModel = nameParts[0];
              const makeModel = nameParts.slice(1).join(' ');

              return (
                <div key={a.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:border-[#EAB308] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                  {/* Banner Image */}
                  <div className="relative h-44 p-4 flex flex-col justify-between" style={{ backgroundImage: `url(${a.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 z-0" />

                    <div className="flex justify-between items-center z-10 relative">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer bg-white"
                      />
                      <span className={`px-2 py-0.5 text-[8px] font-black rounded border uppercase tracking-wider shadow-sm z-10 ${
                        a.status === 'DELIVERED' ? 'bg-emerald-600 text-white border-emerald-700' :
                        a.status === 'IN TRANSIT' ? 'bg-amber-500 text-white border-amber-600' :
                        a.status === 'IN DEPOT' ? 'bg-blue-600 text-white border-blue-700' :
                        'bg-slate-700 text-white border-slate-800'
                      }`}>{a.status}</span>
                    </div>

                    <div className="z-10 relative text-left">
                      <h4 className="text-sm font-black text-white tracking-tight leading-tight group-hover:text-[#EAB308] transition-colors">{yearModel} {makeModel}</h4>
                      <p className="text-[9px] text-slate-300 font-mono tracking-widest mt-0.5 uppercase">{a.vin}</p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 text-left flex flex-col justify-between flex-grow">
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-4 mb-4 text-xs">
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Target Office</span>
                        <strong className="text-slate-800 font-bold block">{a.target}</strong>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Plate</span>
                        <strong className="text-slate-800 font-extrabold uppercase block">{a.plate}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Truck size={14} className="text-slate-400" />
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-0.5">Type</span>
                          <strong className="text-[10px] font-bold text-slate-800 block leading-none">{a.desc.split(' · ')[1] || 'Sedan'}</strong>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenEdit(a)}
                          className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-[#EAB308] hover:bg-amber-50 hover:border-amber-200 transition-all cursor-pointer bg-white"
                        >
                          <Edit size={12} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(a.id)}
                          className="p-1.5 border border-slate-200 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer bg-white"
                        >
                          <Trash2 size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Register Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-md w-full p-6 shadow-2xl text-left animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-5 border-b border-slate-50 pb-3">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">{editingAsset ? 'Edit Asset Info' : 'Register Asset'}</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer bg-transparent border-0 text-slate-400 hover:text-slate-800"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitAsset} className="space-y-4">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Asset Model Name</label>
                <input
                  type="text" 
                  required 
                  placeholder="e.g. 2024 Tesla Model S"
                  value={assetForm.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-amber-250 focus:border-amber-400 focus:outline-none text-slate-705 placeholder-slate-400 bg-white"
                />
              </div>
              
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Specification / Weight</label>
                <input
                  type="text" 
                  required 
                  placeholder="e.g. Red · Sedan · 2,162 kg"
                  value={assetForm.desc} 
                  onChange={(e) => handleInputChange('desc', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-amber-250 focus:border-amber-400 focus:outline-none text-slate-705 placeholder-slate-400 bg-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">VIN Code</label>
                  <input
                    type="text" 
                    required 
                    placeholder="e.g. 5YJSA1DG9PFJ12345"
                    value={assetForm.vin} 
                    onChange={(e) => handleInputChange('vin', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-amber-255 focus:border-amber-400 focus:outline-none text-slate-705 placeholder-slate-400 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Plate Number</label>
                  <input
                    type="text" 
                    required 
                    placeholder="e.g. EV 0001"
                    value={assetForm.plate} 
                    onChange={(e) => handleInputChange('plate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-amber-255 focus:border-amber-400 focus:outline-none text-slate-705 placeholder-slate-400 bg-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Target Location</label>
                  <input
                    type="text" 
                    required 
                    placeholder="e.g. Sydney NSW"
                    value={assetForm.target} 
                    onChange={(e) => handleInputChange('target', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-amber-255 focus:border-amber-400 focus:outline-none text-slate-705 placeholder-slate-400 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Operator/Depot Agency</label>
                  <input
                    type="text" 
                    required 
                    placeholder="e.g. EV Fleet Co"
                    value={assetForm.targetSub} 
                    onChange={(e) => handleInputChange('targetSub', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-amber-255 focus:border-amber-400 focus:outline-none text-slate-705 placeholder-slate-400 bg-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Operational Status</label>
                <div className="relative">
                  <select
                    value={assetForm.status} 
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="appearance-none w-full border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-705 bg-white cursor-pointer"
                  >
                    <option value="AWAITING LOAD">AWAITING LOAD</option>
                    <option value="IN DEPOT">IN DEPOT</option>
                    <option value="IN TRANSIT">IN TRANSIT</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#141414] hover:bg-black text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm cursor-pointer border-0 mt-3"
              >
                {editingAsset ? 'Save Configurations' : 'Submit & Register Asset'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
