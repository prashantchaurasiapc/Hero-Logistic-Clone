import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, Layers, Maximize2, Search, Phone, Check, Clock, MapPin, Bell, Plus, Minus, X 
} from 'lucide-react';

export default function FleetMonitor() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('TRK-102');
  const [toastMsg, setToastMsg] = useState('');

  // Fleet Mock Data matching the screenshot exactly
  const [fleetVehicles, setFleetVehicles] = useState([
    {
      id: 'TRK-102',
      driver: 'Jack Taylor',
      status: 'MOVING',
      statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
      speed: '45 km/h',
      location: 'Hume Highway, Goulburn',
      eta: '45 mins away',
      etaColor: 'text-slate-400',
      phone: '0412 888 221',
      truckX: 245,
      truckY: 250,
      pathD: 'M 120 160 Q 240 250 350 350'
    },
    {
      id: 'VAN-08',
      driver: 'Liam Smith',
      status: 'STOPPED',
      statusColor: 'bg-slate-50 text-slate-500 border-slate-200',
      speed: '0 km/h',
      location: 'Albury Stopover',
      eta: 'Delayed away',
      etaColor: 'text-red-500 font-extrabold',
      phone: '0412 555 998',
      truckX: 120,
      truckY: 160,
      pathD: 'M 120 160 Q 240 250 350 350'
    },
    {
      id: 'VAN-14',
      driver: 'Oliver Brown',
      status: 'LOADING',
      statusColor: 'bg-amber-50 text-amber-600 border-amber-100/50',
      speed: '0 km/h',
      location: 'Warehouse A, Sydney',
      eta: 'Pending away',
      etaColor: 'text-slate-400',
      phone: '0412 777 441',
      truckX: 350,
      truckY: 350,
      pathD: 'M 120 160 Q 240 250 350 350'
    }
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSelectCard = (id) => {
    setSelectedVehicleId(id);
    triggerToast(`Focused on vehicle ${id}`);
  };

  const activeVehicle = fleetVehicles.find(v => v.id === selectedVehicleId) || fleetVehicles[0];

  const filteredVehicles = fleetVehicles.filter(v =>
    v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] px-8 py-8 space-y-6 text-left font-sans antialiased text-slate-800">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div className="flex items-center gap-3">
          {/* Target Radar Icon */}
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-pink-500 shadow-3xs shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              Fleet Monitor
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-2.5">
              Live Network • Sydney Central Depot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto select-none">
          {/* Layers Button */}
          <button 
            onClick={() => triggerToast('Toggling map overlay layers...')}
            className="px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-705 font-extrabold text-xs rounded-xl cursor-pointer transition-all shadow-3xs flex items-center gap-2 tracking-wider"
          >
            <Layers className="w-4 h-4 text-slate-550" /> LAYERS
          </button>
          
          {/* Full Screen Button */}
          <button 
            onClick={() => triggerToast('Entering full screen map mode...')}
            className="bg-[#0B0F17] hover:bg-slate-800 text-[#FFD400] font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap tracking-wider flex items-center gap-2"
          >
            <Maximize2 className="w-4 h-4" /> FULL SCREEN
          </button>
        </div>
      </div>

      {/* TWO-COLUMN GRID CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left List Card panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-5 text-left">
          
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-650" />
            <input
              type="text"
              placeholder="Search driver or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 shadow-3xs transition-all"
            />
          </div>

          {/* KPI Stats Row */}
          <div className="grid grid-cols-2 gap-4 select-none">
            {/* Active Units */}
            <div className="p-4 bg-emerald-50/40 border border-emerald-100/30 rounded-2xl text-left">
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block leading-none">
                ACTIVE UNITS
              </span>
              <span className="text-2xl font-black text-emerald-600 block mt-1.5 leading-none">
                24
              </span>
            </div>

            {/* Incidents */}
            <div className="p-4 bg-rose-50/40 border border-rose-100/30 rounded-2xl text-left">
              <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest block leading-none">
                INCIDENTS
              </span>
              <span className="text-2xl font-black text-rose-500 block mt-1.5 leading-none">
                03
              </span>
            </div>
          </div>

          {/* Interactive Vehicles List */}
          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => {
              const isSelected = vehicle.id === selectedVehicleId;
              return (
                <div 
                  key={vehicle.id}
                  onClick={() => handleSelectCard(vehicle.id)}
                  className={`p-4 border rounded-[18px] flex flex-col justify-between gap-3.5 cursor-pointer transition-all select-none ${
                    isSelected 
                      ? 'border-l-4 border-l-amber-500 border-y-slate-200 border-r-slate-200 bg-white shadow-[0_4px_25px_rgb(0,0,0,0.035)]' 
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-3xs'
                  }`}
                >
                  {/* Top card row */}
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-sm">
                        🚚
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-bold text-slate-800 block leading-tight">{vehicle.id}</span>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 leading-none">
                          {vehicle.driver}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${vehicle.statusColor}`}>
                      {vehicle.status}
                    </span>
                  </div>

                  {/* Bottom details row */}
                  <div className="flex justify-between items-center gap-2 text-[10px] text-slate-500 font-semibold">
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-rose-500 font-bold shrink-0">♥</span>
                      <span>{vehicle.speed}</span>
                      <span className="text-slate-300 mx-0.5">•</span>
                      <span className="max-w-[110px] truncate">{vehicle.location}</span>
                    </div>

                    <div className={`flex items-center gap-1 shrink-0 ${vehicle.etaColor}`}>
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-[9px] font-black uppercase tracking-wider">{vehicle.eta}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Map Panel (8 cols) */}
        <div className="lg:col-span-8 bg-slate-100 border border-slate-200/60 rounded-[24px] shadow-sm min-h-[520px] relative flex flex-col justify-between overflow-hidden bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:18px_18px]">
          
          {/* Top floating bars */}
          <div className="p-6 flex justify-between items-start w-full relative z-10 pointer-events-none">
            {/* Focus Area pill */}
            <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 pointer-events-auto select-none">
              <div className="text-left">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block leading-none">
                  FOCUS AREA
                </span>
                <span className="text-xs font-extrabold text-slate-900 block mt-1 leading-none">
                  SYDNEY CENTRAL DEPOT
                </span>
              </div>
              <div className="flex items-end gap-0.5 h-6">
                <span className="w-1.5 h-3 bg-emerald-500 rounded-sm"></span>
                <span className="w-1.5 h-5 bg-emerald-500 rounded-sm"></span>
                <span className="w-1.5 h-4 bg-emerald-500 rounded-sm"></span>
              </div>
            </div>

            {/* Map Zoom Controls */}
            <div className="flex items-center gap-2 pointer-events-auto select-none">
              <button 
                onClick={() => triggerToast('Notification layers opened...')}
                className="w-8 h-8 rounded-full bg-white text-amber-500 flex items-center justify-center border border-slate-150 shadow-3xs cursor-pointer"
              >
                <Bell className="w-4 h-4" />
              </button>
              <button 
                onClick={() => triggerToast('Zooming in...')}
                className="w-8 h-8 rounded-full bg-white text-slate-650 font-bold flex items-center justify-center border border-slate-150 shadow-3xs cursor-pointer text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => triggerToast('Zooming out...')}
                className="w-8 h-8 rounded-full bg-white text-slate-650 font-bold flex items-center justify-center border border-slate-150 shadow-3xs cursor-pointer text-sm"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG Map Path Graphics */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            {/* Yellow Curved Path */}
            <path 
              d={activeVehicle.pathD} 
              fill="none" 
              stroke="#FFA000" 
              strokeWidth="2.5" 
              strokeDasharray="6 4"
              className="transition-all duration-300"
            />
            {/* Origin Dot (Green) */}
            <circle cx="120" cy="160" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
            {/* Destination Dot (Orange) */}
            <circle cx="350" cy="350" r="5" fill="#F59E0B" stroke="#fff" strokeWidth="2" />
          </svg>

          {/* Floating Truck Indicator */}
          <div 
            className="absolute w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-xs shadow-md transition-all duration-500 ease-out select-none"
            style={{ 
              left: `${activeVehicle.truckX - 16}px`, 
              top: `${activeVehicle.truckY - 16}px`, 
              pointerEvents: 'none' 
            }}
          >
            🚚
          </div>

          {/* Bottom selected vehicle card info (Floating panel) */}
          <div className="p-6 w-full relative z-10">
            <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-[0_12px_40px_rgb(0,0,0,0.06)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
              
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-sm">
                  🚚
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 leading-tight">{activeVehicle.driver}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{activeVehicle.id}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold block mt-1 flex items-center gap-1 select-none">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {activeVehicle.location}
                  </span>

                  {/* Sub Badges row */}
                  <div className="flex gap-2 mt-2 select-none">
                    <span className="px-2.5 py-0.5 border border-blue-200 text-blue-600 rounded-full text-[9px] font-black tracking-wider uppercase flex items-center gap-1 bg-blue-50/10">
                      <Phone className="w-2.5 h-2.5" /> MOBILE 0412
                    </span>
                    <span className="px-2.5 py-0.5 border border-emerald-250 text-emerald-600 rounded-full text-[9px] font-black tracking-wider uppercase flex items-center gap-1 bg-emerald-50/10">
                      <Check className="w-2.5 h-2.5" /> ACTIVE
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-stretch sm:self-auto select-none">
                <button 
                  onClick={() => {
                    navigate('/dispatcher/communication-depot', { 
                      state: { selectedDriverName: activeVehicle.driver } 
                    });
                  }}
                  className="flex-1 sm:flex-initial bg-[#FFA000] hover:bg-[#FF9000] text-black font-extrabold text-xs py-2.5 px-6 rounded-xl transition-all shadow-3xs cursor-pointer uppercase tracking-wider"
                >
                  COMM
                </button>
                <button 
                  onClick={() => triggerToast('Closing floating panel details...')}
                  className="w-9 h-9 rounded-full border border-slate-200 text-slate-400 hover:border-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-50 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
