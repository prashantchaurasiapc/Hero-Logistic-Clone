import React, { useState } from 'react';
import { Search, Plus, MapPin, Truck, Wrench, Droplet, Activity, X, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function FleetAssest() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [assets, setAssets] = useState([
    {
      id: 'TRK-102',
      reg: 'XQC-984',
      type: 'Heavy Truck',
      payload: '20T PAYLOAD',
      status: 'ACTIVE',
      location: 'HUME HIGHWAY',
      fuel: '72%',
      statusBg: 'bg-emerald-50 text-emerald-700',
      fuelVal: 72
    },
    {
      id: 'VAN-08',
      reg: 'BZX-441',
      type: 'Delivery Van',
      payload: '2.5T PAYLOAD',
      status: 'MAINTENANCE',
      location: 'DEPOT A',
      fuel: '45%',
      statusBg: 'bg-rose-50 text-rose-700',
      fuelVal: 45
    },
    {
      id: 'TRL-44',
      reg: 'T-9921',
      type: 'Trailer Flatbed',
      payload: '40T PAYLOAD',
      status: 'ACTIVE',
      location: 'WAREHOUSE B',
      fuel: '-',
      statusBg: 'bg-emerald-50 text-emerald-700',
      fuelVal: null
    },
    {
      id: 'TRK-09',
      reg: 'XYY-112',
      type: 'Heavy Truck',
      payload: '20T PAYLOAD',
      status: 'ACTIVE',
      location: 'PACIFIC MWY',
      fuel: '88%',
      statusBg: 'bg-emerald-50 text-emerald-700',
      fuelVal: 88
    },
    {
      id: 'VAN-14',
      reg: 'VAN-14-SYD',
      type: 'Cargo Van',
      payload: '3.5T PAYLOAD',
      status: 'LOADING',
      location: 'SYDNEY CBD',
      fuel: '55%',
      statusBg: 'bg-amber-50 text-amber-700',
      fuelVal: 55
    }
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleUpdateStatus = (assetId, newStatus) => {
    setAssets(prev => prev.map(asset => {
      if (asset.id === assetId) {
        let statusBg = 'bg-emerald-50 text-emerald-700';
        if (newStatus === 'MAINTENANCE') statusBg = 'bg-rose-50 text-rose-700';
        if (newStatus === 'LOADING') statusBg = 'bg-amber-50 text-amber-700';
        return { ...asset, status: newStatus, statusBg };
      }
      return asset;
    }));
    triggerToast(`Asset ${assetId} status updated to ${newStatus}.`);
    setSelectedAsset(null);
  };

  // Dynamic KPI counts based on state
  const activeCount = assets.filter(a => a.status === 'ACTIVE').length;
  const maintenanceCount = assets.filter(a => a.status === 'MAINTENANCE').length;
  const loadingCount = assets.filter(a => a.status === 'LOADING').length;
  const totalAssets = assets.length;

  // Let's count fuel warning if fuel value is not null and below 60%
  const fuelWarningCount = assets.filter(a => a.fuelVal !== null && a.fuelVal < 60).length;

  const kpis = [
    {
      label: 'ACTIVE ASSETS',
      value: activeCount + loadingCount,
      icon: Activity,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50'
    },
    {
      label: 'FUEL WARNING',
      value: fuelWarningCount,
      icon: Droplet,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
      isWarning: true
    },
    {
      label: 'MAINTENANCE',
      value: maintenanceCount,
      icon: Wrench,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-50',
      isDanger: true
    },
    {
      label: 'OPERATIONAL',
      value: '94%',
      icon: Truck,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50'
    }
  ];

  // Filtering Logic
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.reg.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'Active') {
      return matchesSearch && asset.status === 'ACTIVE';
    }
    if (activeTab === 'Maintenance') {
      return matchesSearch && asset.status === 'MAINTENANCE';
    }
    if (activeTab === 'Loading') {
      return matchesSearch && asset.status === 'LOADING';
    }
    return matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left flex flex-col space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">{toastMsg}</div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-150 flex items-center justify-center text-gray-700 shadow-3xs shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">DISPATCHER</span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1">Fleet Asset Control</h1>
            <p className="text-gray-555 text-xs font-semibold">Real-time status, health monitoring, and assignment for all fleet assets.</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const IconComponent = kpi.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-3xl border border-gray-150 flex justify-between items-center shadow-3xs h-28">
              <div className="text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{kpi.label}</span>
                <span className={`text-3xl font-black block mt-1.5 ${
                  kpi.isWarning ? 'text-amber-500' : 
                  kpi.isDanger ? 'text-rose-500' : 'text-gray-900'
                }`}>
                  {kpi.value}
                </span>
              </div>
              <div className={`p-3 rounded-full shrink-0 ${kpi.iconBg} ${kpi.iconColor} border border-gray-100/50 flex items-center justify-center`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Container Card */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-3xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or Reg..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-250 rounded-xl text-xs font-bold text-gray-755 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {['All', 'Active', 'Maintenance', 'Loading'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'border border-gray-905 text-gray-900 bg-gray-50/50' 
                    : 'border border-transparent text-gray-400 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/40 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">ASSET ID & REG</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">TYPE</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">STATUS & LOCATION</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">FUEL</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssets.length > 0 ? filteredAssets.map((asset, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  {/* ID & Reg */}
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-150 flex items-center justify-center text-gray-650 shrink-0">
                        🚚
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-955 block">{asset.id}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{asset.reg}</span>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <span className="text-xs font-bold text-gray-900 block">{asset.type}</span>
                    <span className="text-[9px] text-gray-400 font-semibold uppercase">{asset.payload}</span>
                  </td>

                  {/* Status & Location Bar */}
                  <td className="px-6 py-4 text-left min-w-[240px]">
                    <div className={`p-2.5 rounded-xl flex items-center justify-between border border-gray-100/50 ${asset.statusBg}`}>
                      <span className="text-[9px] font-black tracking-wider uppercase">{asset.status}</span>
                      <span className="text-[10px] font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {asset.location}
                      </span>
                    </div>
                  </td>

                  {/* Fuel */}
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <span className="text-xs font-bold text-gray-800">{asset.fuel}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => setSelectedAsset(asset)}
                      className="px-3.5 py-1.5 border border-gray-200 text-gray-700 hover:text-black rounded-lg text-xs font-bold transition-all cursor-pointer hover:bg-gray-50 shadow-3xs"
                    >
                      VIEW DETAILS
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-450 font-bold text-xs">
                    No assets matching filter and search query
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSET SPECIFIC DETAILS MODAL */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-gray-400">Asset Record</span>
                <h3 className="text-base font-bold text-gray-950 mt-0.5">{selectedAsset.id} ({selectedAsset.reg})</h3>
              </div>
              <button onClick={() => setSelectedAsset(null)} className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"><X size={18} /></button>
            </div>

            <div className="space-y-4 text-xs text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-450 uppercase block">Vehicle Type</span>
                  <span className="font-bold text-gray-900 mt-1 block">{selectedAsset.type}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-450 uppercase block">Payload Class</span>
                  <span className="font-bold text-gray-900 mt-1 block">{selectedAsset.payload}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-450 uppercase block">Current Location</span>
                  <span className="font-bold text-gray-900 mt-1 block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {selectedAsset.location}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-450 uppercase block">Fuel Level</span>
                  <span className="font-bold text-gray-900 mt-1 block">{selectedAsset.fuel}</span>
                </div>
              </div>

              {/* Maintenance & Engine Logs mock */}
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">HEALTH INDEX & MAINTENANCE LOG</span>
                <div className="flex justify-between items-center text-[11px] font-semibold text-gray-800">
                  <span>Engine Health Index:</span>
                  <span className="text-emerald-600 font-bold">98% (Excellent)</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-semibold text-gray-800">
                  <span>Last Service Check:</span>
                  <span>14 Days Ago</span>
                </div>
              </div>

              {/* Update Status Actions */}
              <div className="pt-3 border-t border-gray-100 space-y-2.5">
                <span className="text-[10px] font-bold text-gray-455 uppercase block">Modify Asset Status</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedAsset.id, 'ACTIVE')}
                    className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all cursor-pointer border border-emerald-100"
                  >
                    Set Active
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAsset.id, 'LOADING')}
                    className="flex-1 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold transition-all cursor-pointer border border-amber-100"
                  >
                    Set Loading
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAsset.id, 'MAINTENANCE')}
                    className="flex-1 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all cursor-pointer border border-rose-100"
                  >
                    Set Maintenance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
