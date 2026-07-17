import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sliders, RefreshCw, Truck, Shield, Activity, 
  ChevronRight, MapPin, TrendingUp, AlertCircle, Zap, Navigation,
  User, Clock, Thermometer, Battery
} from 'lucide-react';
import L from 'leaflet';

// MOCK TRUCKS DATA
const TRUCKS = [
  { 
    id: 'TRK-001', 
    driver: 'MIKE JOHNSON', 
    status: 'IN TRANSIT', 
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', 
    dotColor: 'bg-emerald-500',
    location: 'Hume Hwy, NSW',
    lat: -34.4500,
    lng: 150.4500,
    speed: '68 km/h',
    fuel: '72%',
    temp: '18°C',
    eta: '2h 15m',
    alerts: 0
  },
  { 
    id: 'TRK-002', 
    driver: 'SARAH CONNOR', 
    status: 'IDLE', 
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200', 
    dotColor: 'bg-slate-400',
    location: 'Sydney Depot',
    lat: -33.8688,
    lng: 151.2093,
    speed: '0 km/h',
    fuel: '95%',
    temp: '15°C',
    eta: 'Reached',
    alerts: 0
  },
  { 
    id: 'TRK-003', 
    driver: 'DAVID SMITH', 
    status: 'IN TRANSIT', 
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', 
    dotColor: 'bg-emerald-500',
    location: 'Pacific Hwy, QLD',
    lat: -28.0000,
    lng: 153.4300,
    speed: '72 km/h',
    fuel: '48%',
    temp: '102°C',
    eta: '3h 40m',
    alerts: 1, // Critical Alert
    alertText: 'Engine Temp Warning (102°C)'
  },
  { 
    id: 'TRK-004', 
    driver: 'JAMES LOGAN', 
    status: 'MAINTENANCE', 
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-100', 
    dotColor: 'bg-orange-500',
    location: 'Melbourne Workshop',
    lat: -37.8136,
    lng: 144.9631,
    speed: '0 km/h',
    fuel: '12%',
    temp: '16°C',
    eta: '--',
    alerts: 0
  },
  { 
    id: 'TRK-005', 
    driver: 'ALEX MERCER', 
    status: 'IN TRANSIT', 
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', 
    dotColor: 'bg-emerald-500',
    location: 'Sturt Hwy, SA',
    lat: -34.2000,
    lng: 140.5000,
    speed: '88 km/h',
    fuel: '55%',
    temp: '20°C',
    eta: '4h 30m',
    alerts: 0
  }
];

export default function LiveTracking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedTruckId, setSelectedTruckId] = useState(null);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  // Center coordinates for Australia/South-East
  const defaultCenter = [-33.8688, 151.2093];
  const defaultZoom = 6;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false // Custom zoom controls placed at top right
    });
    mapRef.current = map;

    // Add CartoDB Dark Matter Tile Layer (Futuristic Dark Look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB &copy; OpenStreetMap'
    }).addTo(map);

    // Initialize Markers for all trucks
    TRUCKS.forEach((truck) => {
      let markerColor = '#10b981'; // Green
      let iconColor = '#10b981';
      let bgColor = 'rgba(16, 185, 129, 0.12)';
      let borderStyle = '2px solid #10b981';

      if (truck.status === 'IDLE') {
        markerColor = '#94a3b8';
        iconColor = '#94a3b8';
        bgColor = 'rgba(148, 163, 184, 0.12)';
        borderStyle = '2px solid #94a3b8';
      } else if (truck.status === 'MAINTENANCE') {
        markerColor = '#f97316';
        iconColor = '#f97316';
        bgColor = 'rgba(249, 115, 22, 0.12)';
        borderStyle = '2px solid #f97316';
      } else if (truck.alerts > 0) {
        markerColor = '#ef4444';
        iconColor = '#ffffff';
        bgColor = '#ef4444';
        borderStyle = '2px solid #ef4444';
      }

      // Create Custom DivIcon with squircle container and ID label matching the target layout
      const customIcon = L.divIcon({
        className: 'custom-truck-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 80px; height: 80px;">
            <!-- Soft Glow Circle Behind -->
            <div style="position: absolute; top: 10px; left: 10px; width: 60px; height: 60px; border-radius: 50%; background: radial-gradient(circle, ${markerColor} 0%, rgba(0,0,0,0) 70%); opacity: 0.35; pointer-events: none;"></div>
            
            <!-- Rounded Square Box containing Truck Icon -->
            <div style="position: relative; z-index: 10; width: 36px; height: 36px; background: ${bgColor}; border: ${borderStyle}; border-radius: 11px; display: flex; align-items: center; justify-content: center; color: ${iconColor}; box-shadow: 0 0 12px rgba(0,0,0,0.5); cursor: pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            
            <!-- Label Tag below -->
            <div style="position: relative; z-index: 10; margin-top: 5px; background: rgba(15, 23, 42, 0.95); border: 1.5px solid rgba(51, 65, 85, 0.7); border-radius: 6px; padding: 2px 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.6); pointer-events: none;">
              <span style="font-family: sans-serif; font-size: 8.5px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; display: block; line-height: 1;">${truck.id}</span>
            </div>
          </div>
        `,
        iconSize: [80, 80],
        iconAnchor: [40, 40]
      });

      // Create Marker
      const marker = L.marker([truck.lat, truck.lng], { icon: customIcon })
        .addTo(map);

      // On marker click, select and center map on truck
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        selectTruck(truck);
      });

      markersRef.current[truck.id] = marker;
    });

    // Deselect selected truck when clicking map background
    map.on('click', () => {
      setSelectedTruckId(null);
    });

    // Add sample route polylines
    const routeCoordinates1 = [
      [-37.8136, 144.9631],
      [-36.5000, 146.5000],
      [-35.2809, 149.1300],
      [-34.4500, 150.4500]
    ];
    L.polyline(routeCoordinates1, { color: '#eab308', weight: 2.5, dashArray: '6, 6', opacity: 0.8 }).addTo(map);

    const routeCoordinates2 = [
      [-33.8688, 151.2093],
      [-31.0000, 152.5000],
      [-29.5000, 153.2000],
      [-28.0000, 153.4300]
    ];
    L.polyline(routeCoordinates2, { color: '#3b82f6', weight: 2.5, opacity: 0.6 }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  // Update marker icons dynamically when selectedTruckId changes
  useEffect(() => {
    if (!mapRef.current) return;

    TRUCKS.forEach((truck) => {
      const marker = markersRef.current[truck.id];
      if (!marker) return;

      const isSelected = truck.id === selectedTruckId;

      let markerColor = '#10b981'; // Green
      let iconColor = '#10b981';
      let bgColor = 'rgba(16, 185, 129, 0.12)';
      let borderStyle = '2px solid #10b981';

      if (isSelected) {
        // Yellow active/selected styling matching screenshot
        markerColor = '#facc15'; // Amber/Yellow
        iconColor = '#facc15';
        bgColor = 'rgba(250, 204, 21, 0.15)';
        borderStyle = '2.5px solid #facc15';
      } else {
        if (truck.status === 'IDLE') {
          markerColor = '#94a3b8';
          iconColor = '#94a3b8';
          bgColor = 'rgba(148, 163, 184, 0.12)';
          borderStyle = '2px solid #94a3b8';
        } else if (truck.status === 'MAINTENANCE') {
          markerColor = '#f97316';
          iconColor = '#f97316';
          bgColor = 'rgba(249, 115, 22, 0.12)';
          borderStyle = '2px solid #f97316';
        } else if (truck.alerts > 0) {
          markerColor = '#ef4444';
          iconColor = '#ffffff';
          bgColor = '#ef4444';
          borderStyle = '2px solid #ef4444';
        }
      }

      // Re-create Custom Icon dynamically
      const customIcon = L.divIcon({
        className: 'custom-truck-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 80px; height: 80px;">
            <!-- Soft Glow Circle Behind -->
            <div style="position: absolute; top: 10px; left: 10px; width: 60px; height: 60px; border-radius: 50%; background: radial-gradient(circle, ${markerColor} 0%, rgba(0,0,0,0) 70%); opacity: ${isSelected ? 0.7 : 0.35}; pointer-events: none;"></div>
            
            <!-- Rounded Square Box containing Truck Icon -->
            <div style="position: relative; z-index: 10; width: 36px; height: 36px; background: ${bgColor}; border: ${borderStyle}; border-radius: 11px; display: flex; align-items: center; justify-content: center; color: ${iconColor}; box-shadow: 0 0 12px ${isSelected ? markerColor : 'rgba(0,0,0,0.5)'}; cursor: pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            
            <!-- Label Tag below -->
            <div style="position: relative; z-index: 10; margin-top: 5px; background: ${isSelected ? '#facc15' : 'rgba(15, 23, 42, 0.95)'}; border: 1.5px solid ${isSelected ? '#facc15' : 'rgba(51, 65, 85, 0.7)'}; border-radius: 6px; padding: 2px 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.6); pointer-events: none;">
              <span style="font-family: sans-serif; font-size: 8.5px; font-weight: 800; color: ${isSelected ? '#000000' : '#ffffff'}; letter-spacing: 0.5px; display: block; line-height: 1;">${truck.id}</span>
            </div>
          </div>
        `,
        iconSize: [80, 80],
        iconAnchor: [40, 40]
      });

      marker.setIcon(customIcon);
    });
  }, [selectedTruckId]);

  // Handle Zoom In / Out
  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();

  // Reset View to fit all bounds
  const resetView = () => {
    if (!mapRef.current) return;
    mapRef.current.setView(defaultCenter, defaultZoom);
  };

  // Center map on selected truck
  const selectTruck = (truck) => {
    setSelectedTruckId(truck.id);
    if (!mapRef.current) return;
    mapRef.current.setView([truck.lat, truck.lng], 9);
  };

  // Filter & Search Logic
  const filteredTrucks = TRUCKS.filter((truck) => {
    const matchesSearch = 
      truck.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'ALL') return matchesSearch;
    return truck.status === activeFilter && matchesSearch;
  });

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto">
      
      {/* ── Header Row ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Live Tracking</h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Real-time asset telemetry and advanced route monitoring</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
            <Sliders className="w-4 h-4 text-slate-400" />
            <span>Map Settings</span>
          </button>
          <button 
            onClick={resetView}
            className="flex items-center gap-2 px-4 py-2 bg-[#FACC15] hover:bg-yellow-500 rounded-xl text-xs font-bold text-slate-950 transition-colors shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'ACTIVE VEHICLES', val: '142', icon: <Truck className="w-4 h-4 text-blue-500" />, iconBg: 'bg-blue-50' },
          { label: 'ON-TIME RATE', val: '96.4%', icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, iconBg: 'bg-emerald-50' },
          { label: 'CRITICAL ALERTS', val: '3', icon: <Shield className="w-4 h-4 text-rose-500" />, iconBg: 'bg-rose-50' },
          { label: 'AVG FLEET SPEED', val: '64 km/h', icon: <Zap className="w-4 h-4 text-amber-500" />, iconBg: 'bg-amber-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-black tracking-wider uppercase">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{stat.val}</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stat.iconBg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Workspace: Map & Sidebar ─────────────────────── */}
      <div className="grid grid-cols-12 gap-5 h-[calc(100vh-250px)] min-h-[500px]">
        
        {/* Left Side: Dark Telemetry Map Card */}
        <div className="col-span-12 lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl shadow-sm relative overflow-hidden flex flex-col">
          
          {/* Hero Telemetry HUD Label */}
          <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 backdrop-blur-md flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">HERO TELEMETRY</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 leading-none">LIVE CONNECTION</p>
            </div>
          </div>

          {/* HUD Map Zoom Controls */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1.5">
            <button 
              onClick={zoomIn}
              className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-800 text-white flex items-center justify-center text-lg font-bold hover:bg-slate-800 transition-colors shadow-sm focus:outline-none"
            >
              +
            </button>
            <button 
              onClick={zoomOut}
              className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-800 text-white flex items-center justify-center text-lg font-bold hover:bg-slate-800 transition-colors shadow-sm focus:outline-none"
            >
              -
            </button>
          </div>

          {/* Leaflet Map Target */}
          <div ref={mapContainerRef} className="w-full flex-grow z-10 animate-pulse-none" />

          {/* HUD Overlay Details Card */}
          {selectedTruckId && (() => {
            const currentTruck = TRUCKS.find(t => t.id === selectedTruckId);
            if (!currentTruck) return null;
            return (
              <div className="absolute bottom-4 left-4 z-[1000] w-80 bg-[#0f172a]/95 border border-[#334155]/60 rounded-2xl p-4.5 text-white backdrop-blur-md shadow-2xl flex flex-col gap-3 animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white">{currentTruck.id}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] text-slate-400 font-bold">{currentTruck.driver}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    currentTruck.alerts > 0 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {currentTruck.alerts > 0 ? 'ALERT' : currentTruck.status}
                  </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'SPEED', val: currentTruck.speed, icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
                    { label: 'FUEL LEVEL', val: currentTruck.fuel, icon: <Battery className="w-3.5 h-3.5 text-emerald-400" /> },
                    { label: 'TEMP', val: currentTruck.temp, icon: <Thermometer className="w-3.5 h-3.5 text-rose-400" /> },
                    { label: 'ETA', val: currentTruck.eta, icon: <Clock className="w-3.5 h-3.5 text-blue-400" /> }
                  ].map((gridItem, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
                      <p className="text-[8px] text-slate-400 font-black tracking-wider uppercase leading-none">{gridItem.label}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {gridItem.icon}
                        <span className="text-xs font-bold text-white leading-none">{gridItem.val}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Location row */}
                <div className="bg-slate-950/60 border border-slate-800/80 px-3 py-2 rounded-xl text-xs flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-[10px] text-slate-300 truncate">{currentTruck.location}</span>
                </div>

                {/* Action Button */}
                <button className="w-full bg-[#FACC15] hover:bg-yellow-500 text-slate-950 text-[11px] font-black py-2.5 rounded-xl transition-colors text-center uppercase tracking-wider">
                  View Full Telemetry
                </button>
              </div>
            );
          })()}

          {/* Animation Styles */}
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(4px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.2s ease-out forwards;
            }
          `}</style>

        </div>

        {/* Right Side: Fleet Management Sidebar Card */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 shrink-0">
            <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase mb-3">FLEET MANAGEMENT</h3>
            
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Search truck, driver, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Quick Filter Horizontal Scrollbar */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['ALL', 'IN TRANSIT', 'IDLE', 'MAINTENANCE'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${
                    activeFilter === filter 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable List */}
          <div className="flex-grow overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
            {filteredTrucks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No matching vehicles found.
              </div>
            ) : (
              filteredTrucks.map((truck) => (
                <div 
                  key={truck.id}
                  onClick={() => selectTruck(truck)}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50/50 ${
                    selectedTruckId === truck.id ? 'bg-indigo-50/40 border-l-4 border-indigo-600 pl-3.5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Status Dot with Glow wrapper */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      truck.alerts > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {truck.alerts > 0 ? <AlertCircle className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-slate-900">{truck.id}</p>
                        {truck.alerts > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 truncate">{truck.driver}</p>
                      
                      {/* Sub row: badge + location */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          truck.alerts > 0 ? 'bg-rose-100 text-rose-700 border border-rose-200' : truck.badgeColor
                        }`}>
                          {truck.alerts > 0 ? 'ALERT' : truck.status}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-0.5 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{truck.location}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Chevron */}
                  <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${
                    selectedTruckId === truck.id ? 'text-indigo-500 translate-x-0.5' : ''
                  }`} />
                </div>
              ))
            )}
          </div>

          {/* Active Detail Overlay Footer when Selected */}
          {selectedTruckId && (() => {
            const currentTruck = TRUCKS.find(t => t.id === selectedTruckId);
            if (!currentTruck) return null;
            return (
              <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">TELEMETRY</h5>
                    <h4 className="text-xs font-bold text-slate-800 mt-1 leading-none">{currentTruck.id} Status</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">SPEED</p>
                    <p className="text-xs font-black text-indigo-600 mt-0.5">{currentTruck.speed}</p>
                  </div>
                </div>
                {currentTruck.alerts > 0 && (
                  <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-lg text-[10px] font-bold text-rose-700 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{currentTruck.alertText}</span>
                  </div>
                )}
              </div>
            );
          })()}

        </div>

      </div>

    </div>
  );
}
