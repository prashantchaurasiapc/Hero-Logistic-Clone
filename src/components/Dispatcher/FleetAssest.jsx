import React, { useState } from 'react';
import { 
  Search, Plus, MapPin, Truck, Wrench, Droplet, Activity, X, 
  ShieldAlert, FileText, CheckCircle2, ChevronRight, ArrowLeft, Star, Radio
} from 'lucide-react';
import truckMaintenanceImg from '../../assets/truck_maintenance.png';

export default function FleetAssest() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Fleet Assets Mock Database matching layout requirements
  const [assets, setAssets] = useState([
    {
      id: 'TRK-102',
      reg: 'XQC-984',
      type: 'Heavy Truck',
      payload: '20T PAYLOAD',
      status: 'ACTIVE',
      location: 'Hume Highway, Goulburn NSW',
      fuel: '72%',
      statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-100/50',
      fuelVal: 72,
      makeModel: 'Freightliner Cascadia',
      vehicleType: 'Semi Truck',
      year: '2021',
      vin: 'TRK-102-2020-004-984',
      totalTrips: 412,
      mileage: '128,440 km',
      gvmCapacity: '28t',
      rating: '4.8',
      lastService: 'Jan 15, 2026',
      nextService: 'April 22, 2026',
      compliance: 'Valid',
      drivers: [
        { name: 'Jack Taylor', id: 'DRV - 022', shift: 'DAY SHIFT | 06:00 - 18:00', initials: 'JT', shiftType: 'day' },
        { name: 'Oliver Brown', id: 'DRV - 114', shift: 'NIGHT SHIFT | 18:00 - 06:00', initials: 'OB', shiftType: 'night' }
      ]
    },
    {
      id: 'VAN-08',
      reg: 'BZX-441',
      type: 'Delivery Van',
      payload: '2.5T PAYLOAD',
      status: 'MAINTENANCE',
      location: 'Depot A, Sydney NSW',
      fuel: '45%',
      statusBg: 'bg-rose-50 text-rose-700 border-rose-100/50',
      fuelVal: 45,
      makeModel: 'Toyota HiAce',
      vehicleType: 'Delivery Van',
      year: '2022',
      vin: 'VAN-08-2021-009-441',
      totalTrips: 280,
      mileage: '45,210 km',
      gvmCapacity: '2.5t',
      rating: '4.6',
      lastService: 'Feb 10, 2026',
      nextService: 'May 15, 2026',
      compliance: 'Valid',
      drivers: [
        { name: 'Lucas Smith', id: 'DRV - 089', shift: 'DAY SHIFT | 06:00 - 18:00', initials: 'LS', shiftType: 'day' }
      ]
    },
    {
      id: 'TRL-44',
      reg: 'T-9921',
      type: 'Trailer Flatbed',
      payload: '40T PAYLOAD',
      status: 'ACTIVE',
      location: 'Warehouse B, Melbourne VIC',
      fuel: '-',
      statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-100/50',
      fuelVal: null,
      makeModel: 'Krone Flatbed',
      vehicleType: 'Trailer Flatbed',
      year: '2019',
      vin: 'TRL-44-2019-012-104',
      totalTrips: 156,
      mileage: '98,400 km',
      gvmCapacity: '40t',
      rating: '4.7',
      lastService: 'Dec 20, 2025',
      nextService: 'Mar 20, 2026',
      compliance: 'Valid',
      drivers: [
        { name: 'Mia Wong', id: 'DRV - 044', shift: 'DAY SHIFT | 06:00 - 18:00', initials: 'MW', shiftType: 'day' }
      ]
    },
    {
      id: 'TRK-09',
      reg: 'XYY-112',
      type: 'Heavy Truck',
      payload: '20T PAYLOAD',
      status: 'ACTIVE',
      location: 'Pacific Highway, Coffs Harbour NSW',
      fuel: '88%',
      statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-100/50',
      fuelVal: 88,
      makeModel: 'Volvo FH16',
      vehicleType: 'Heavy Truck',
      year: '2020',
      vin: 'TRK-09-2020-002-112',
      totalTrips: 389,
      mileage: '112,900 km',
      gvmCapacity: '20t',
      rating: '4.9',
      lastService: 'Jan 22, 2026',
      nextService: 'Apr 25, 2026',
      compliance: 'Valid',
      drivers: [
        { name: 'Noah Davies', id: 'DRV - 009', shift: 'NIGHT SHIFT | 18:00 - 06:00', initials: 'ND', shiftType: 'night' }
      ]
    },
    {
      id: 'VAN-14',
      reg: 'VAN-14-SYD',
      type: 'Cargo Van',
      payload: '3.5T PAYLOAD',
      status: 'LOADING',
      location: 'George St, Sydney CBD NSW',
      fuel: '55%',
      statusBg: 'bg-amber-50 text-amber-700 border-amber-100/50',
      fuelVal: 55,
      makeModel: 'Mercedes-Benz Sprinter',
      vehicleType: 'Cargo Van',
      year: '2023',
      vin: 'VAN-14-2023-014-998',
      totalTrips: 120,
      mileage: '18,500 km',
      gvmCapacity: '3.5t',
      rating: '4.5',
      lastService: 'Mar 01, 2026',
      nextService: 'Jun 01, 2026',
      compliance: 'Valid',
      drivers: [
        { name: 'Sophia Patel', id: 'DRV - 014', shift: 'DAY SHIFT | 06:00 - 18:00', initials: 'SP', shiftType: 'day' }
      ]
    }
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleUpdateStatus = (assetId, newStatus) => {
    setAssets(prev => prev.map(asset => {
      if (asset.id === assetId) {
        let statusBg = 'bg-emerald-50 text-emerald-700 border-emerald-100/50';
        if (newStatus === 'MAINTENANCE') statusBg = 'bg-rose-50 text-rose-700 border-rose-100/50';
        if (newStatus === 'LOADING') statusBg = 'bg-amber-50 text-amber-700 border-amber-100/50';
        return { ...asset, status: newStatus, statusBg };
      }
      return asset;
    }));
    triggerToast(`Asset ${assetId} status updated to ${newStatus}.`);
    setSelectedAsset(null);
  };

  // Fixed KPI values matching the first image exactly
  const kpis = [
    {
      label: 'ACTIVE ASSETS',
      value: 124,
      icon: Activity,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50'
    },
    {
      label: 'FUEL WARNING',
      value: 3,
      icon: Droplet,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
      isWarning: true
    },
    {
      label: 'MAINTENANCE',
      value: 8,
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
    <div className="w-full min-h-screen bg-[#F8FAFC] px-8 py-8 space-y-6 text-left font-sans antialiased text-slate-800">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">
          {toastMsg}
        </div>
      )}

      {selectedAsset ? (
        /* ASSET SPECIFIC DETAILS VIEW (MATCHING FIRST IMAGE EXACTLY) */
        <div className="space-y-6 animate-fade-in">
          {/* Header with Back Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 text-left">
              <button 
                onClick={() => setSelectedAsset(null)}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-black hover:bg-slate-50 transition-all shadow-3xs cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {selectedAsset.id}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100/50 uppercase tracking-wider">
                    {selectedAsset.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-2 tracking-wider uppercase">
                  {selectedAsset.makeModel} - {selectedAsset.vehicleType} - REG: {selectedAsset.reg}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => triggerToast(`Viewing Service Log for ${selectedAsset.id}`)}
                className="px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:text-black rounded-lg text-xs font-bold transition-all cursor-pointer hover:bg-slate-50 shadow-3xs uppercase tracking-wider"
              >
                Service Log
              </button>
              <button 
                onClick={() => triggerToast(`Tracking Live location for ${selectedAsset.id}`)}
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-slate-950 rounded-lg text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Track Live
              </button>
            </div>
          </div>

          {/* Main detailed view 2-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (8/12) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Media Card */}
              <div className="relative rounded-[24px] border border-slate-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.015)] h-96">
                <img 
                  src={truckMaintenanceImg} 
                  alt="Truck Maintenance" 
                  className="w-full h-full object-cover"
                />
                {/* VIN Overlay */}
                <div className="absolute bottom-6 left-6 bg-[#000000]/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-left">
                  <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest block leading-none">VIN / CHASSIS</span>
                  <span className="text-xs font-black text-white block mt-2 leading-none tracking-wider">{selectedAsset.vin}</span>
                </div>
              </div>

              {/* Alternate Fleet Thumbnails */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                  <img 
                    src={truckMaintenanceImg} 
                    alt="Alt Fleet Thumb" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Alternate</span>
                  <span className="text-xs font-black text-slate-700 block mt-0.5">Fleet</span>
                </div>
              </div>

              {/* Stats Grid (4 cols) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] text-left">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">TOTAL TRIPS</span>
                  <span className="text-2xl font-black text-slate-900 mt-3 block leading-none">{selectedAsset.totalTrips}</span>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] text-left">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">MILEAGE</span>
                  <span className="text-2xl font-black text-slate-900 mt-3 block leading-none whitespace-nowrap">{selectedAsset.mileage}</span>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] text-left">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">CAPACITY</span>
                  <span className="text-2xl font-black text-slate-900 mt-3 block leading-none">{selectedAsset.gvmCapacity}</span>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] text-left">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">FLEET RATING</span>
                  <span className="text-2xl font-black text-slate-900 mt-3 block leading-none flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400 stroke-1.5" />
                    {selectedAsset.rating}
                  </span>
                </div>
              </div>

              {/* Operational Status */}
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-5 text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">OPERATIONAL STATUS</span>
                
                {/* Fuel Level Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 leading-none">
                    <span>Fuel Level</span>
                    <span>{selectedAsset.fuel}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: selectedAsset.fuelVal ? `${selectedAsset.fuelVal}%` : '0%' }}
                    />
                  </div>
                </div>

                {/* Service and Compliance Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">LAST SERVICE</span>
                    <span className="text-xs font-bold text-slate-800 block mt-2.5 leading-none">{selectedAsset.lastService}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">NEXT SERVICE DUE</span>
                    <span className="text-xs font-bold text-amber-600 block mt-2.5 leading-none">{selectedAsset.nextService}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">COMPLIANCE</span>
                    <span className="text-xs font-black text-emerald-600 block mt-2.5 leading-none">{selectedAsset.compliance}</span>
                  </div>
                </div>
              </div>

              {/* Last Known Location */}
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-4 text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">LAST KNOWN LOCATION</span>
                
                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block leading-tight">{selectedAsset.location}</span>
                    <span className="text-[10px] font-semibold text-slate-400 block mt-1.5 leading-none">GPS Signal Active - Updated 32 seconds ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4/12) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Technical Specs (Dark Card) */}
              <div className="bg-[#0F172A] p-6 rounded-[24px] text-white shadow-sm space-y-5 text-left border border-slate-800">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">REGISTRATION</span>
                    <span className="text-xs font-black tracking-wider text-slate-200">{selectedAsset.reg}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">YEAR</span>
                    <span className="text-xs font-black text-slate-200">{selectedAsset.year}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">MAKE / MODEL</span>
                    <span className="text-xs font-black text-slate-200">{selectedAsset.makeModel}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">VEHICLE TYPE</span>
                    <span className="text-xs font-black text-slate-200">{selectedAsset.vehicleType}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">GVM CAPACITY</span>
                    <span className="text-xs font-black text-slate-200">{selectedAsset.gvmCapacity}</span>
                  </div>
                </div>
              </div>

              {/* Shift Roster */}
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-5 text-left">
                <div className="flex justify-between items-center leading-none">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">SHIFT ROSTER</span>
                  <span className="text-[10px] font-black text-slate-400 tracking-wider block">{selectedAsset.drivers.length} Drivers</span>
                </div>

                <div className="space-y-4">
                  {selectedAsset.drivers.map((drv, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-600 shrink-0">
                        {drv.initials}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <span className="text-xs font-black text-slate-900 block truncate leading-tight">{drv.name}</span>
                        <span className="text-[10px] font-semibold text-slate-400 block mt-1 leading-none">{drv.id}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-wider whitespace-nowrap shrink-0 ${
                        drv.shiftType === 'day' 
                          ? 'bg-blue-50 text-blue-600 border-blue-100/50' 
                          : 'bg-purple-50 text-purple-600 border-purple-100/50'
                      }`}>
                        {drv.shift.split(' | ')[0]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button 
                    onClick={() => triggerToast(`Assign Driver feature coming soon for ${selectedAsset.id}`)}
                    className="flex-1 py-2 border border-slate-200 text-slate-600 hover:text-black rounded-lg text-xs font-bold transition-all cursor-pointer hover:bg-slate-50 text-center uppercase tracking-wider shadow-3xs"
                  >
                    + Assign Driver
                  </button>
                  <button 
                    onClick={() => triggerToast(`Managing shift roster for ${selectedAsset.id}`)}
                    className="flex-1 py-2 border border-slate-200 text-slate-600 hover:text-black rounded-lg text-xs font-bold transition-all cursor-pointer hover:bg-slate-50 text-center uppercase tracking-wider shadow-3xs"
                  >
                    Manage List
                  </button>
                </div>
              </div>

              {/* Asset Actions */}
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-5 text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">ASSET ACTIONS</span>
                
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={() => triggerToast(`Scheduling service for ${selectedAsset.id}`)}
                    className="w-full py-2.5 border border-slate-200 hover:border-slate-400 text-slate-600 hover:text-black bg-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center uppercase tracking-wider shadow-3xs"
                  >
                    Schedule Service
                  </button>
                  <button 
                    onClick={() => triggerToast(`Viewing full service log for ${selectedAsset.id}`)}
                    className="w-full py-2.5 border border-slate-200 hover:border-slate-400 text-slate-600 hover:text-black bg-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center uppercase tracking-wider shadow-3xs"
                  >
                    View Service Log
                  </button>
                  <button 
                    onClick={() => triggerToast(`Reporting fault/issue for ${selectedAsset.id}`)}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100/70 text-rose-700 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 border border-rose-100 uppercase tracking-wider"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    Report Fault
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ORIGINAL LIST VIEW */
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shadow-3xs shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
                  Dispatcher Portal <span className="text-slate-400 text-xl mx-1">•</span> Fleet Assets
                </h1>
                <p className="text-[13px] text-slate-500 mt-1 font-medium">
                  Real-time status, health monitoring, and assignment for all fleet assets.
                </p>
              </div>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, i) => {
              const IconComponent = kpi.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 flex justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.015)] h-32">
                  <div className="text-left">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">{kpi.label}</span>
                    <span className={`text-3xl font-black block mt-2.5 leading-none ${
                      kpi.isWarning ? 'text-amber-500' : 
                      kpi.isDanger ? 'text-rose-500' : 'text-slate-900'
                    }`}>
                      {kpi.value}
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-full shrink-0 ${kpi.iconBg} ${kpi.iconColor} flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Container Card */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
            {/* Table Controls */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" />
                <input
                  type="text"
                  placeholder="Search by ID or Reg..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 shadow-sm animate-none"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {['All', 'Active', 'Maintenance', 'Loading'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeTab === tab 
                        ? 'border border-slate-900 text-slate-950 bg-slate-50/50 font-black' 
                        : 'border border-transparent text-slate-400 hover:text-slate-800'
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
                  <tr className="bg-slate-50/40 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    <th className="px-6 py-4">ASSET ID & REG</th>
                    <th className="px-6 py-4">TYPE</th>
                    <th className="px-6 py-4">STATUS & LOCATION</th>
                    <th className="px-6 py-4">FUEL</th>
                    <th className="px-6 py-4 text-right pr-8">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredAssets.length > 0 ? filteredAssets.map((asset, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                      {/* ID & Reg */}
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-155 flex items-center justify-center text-slate-500 shrink-0">
                            🚚
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">{asset.id}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-1 leading-none">{asset.reg}</span>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle">
                        <span className="text-xs font-bold text-slate-900 block leading-tight">{asset.type}</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block mt-1 leading-none">{asset.payload}</span>
                      </td>

                      {/* Status & Location Bar */}
                      <td className="px-6 py-5 text-left min-w-[240px] whitespace-nowrap align-middle">
                        <div className={`p-2.5 rounded-xl flex items-center justify-between border ${asset.statusBg}`}>
                          <span className="text-[9px] font-black tracking-wider uppercase">{asset.status}</span>
                          <span className="text-[10px] font-bold flex items-center gap-1">
                            <MapPin className={`w-3.5 h-3.5 shrink-0 ${
                              asset.status === 'MAINTENANCE' ? 'text-rose-500' :
                              asset.status === 'LOADING' ? 'text-amber-500' : 'text-emerald-500'
                            }`} />
                            {asset.location.split(',')[0]}
                          </span>
                        </div>
                      </td>

                      {/* Fuel */}
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle">
                        <span className="text-xs font-bold text-slate-700">{asset.fuel}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 whitespace-nowrap text-right pr-8 align-middle">
                        <button 
                          onClick={() => setSelectedAsset(asset)}
                          className="px-4 py-1.5 border border-slate-200 text-slate-600 hover:text-black rounded-lg text-xs font-bold transition-all cursor-pointer hover:bg-slate-50 shadow-3xs uppercase tracking-wider"
                        >
                          VIEW DETAILS
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold text-xs">
                        No assets matching filter and search query
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
