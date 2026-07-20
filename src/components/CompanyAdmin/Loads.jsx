import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Plus, Search, X, Star, MoreVertical, ChevronDown,
  Upload, Download, Sparkles, MapPin, Truck, CheckCircle,
  AlertCircle, Clock, Filter, ChevronLeft, ChevronRight,
  Eye, Edit3, Trash2, Package, Calendar, Activity, 
  Settings, ArrowUpRight, ArrowLeft, Phone, UserCheck,
  FileText, Camera, MessageSquare, DollarSign, Navigation,
  Layers, Radio, User, BarChart2, Thermometer, Check, Shield
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import CreateLoad from './CreateLoad';
import AILoadBuilder from './AILoadBuilder';
import L from 'leaflet';

// Reusable Map Component using Vanilla Leaflet (bulletproof for React 19)
function MapComponent() {
  const mapRef = useRef(null);
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Melbourne (-37.8136, 144.9631)
    // Geelong (-38.1499, 144.3617)
    // Sydney (-33.8688, 151.2093)
    const melbourne = [-37.8136, 144.9631];
    const geelong = [-38.1499, 144.3617];
    const sydney = [-33.8688, 151.2093];

    // Initialize map
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([-35.8, 147.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Setup custom marker icon configurations
    const createMarkerIcon = (label) => {
      return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="display:flex; flex-direction:column; align-items:center;">
          <div style="background:#3b82f6; width:22px; height:22px; border-radius:50%; border:3px bg-white; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 5px rgba(0,0,0,0.3)">
            <div style="width:8px; height:8px; background:white; border-radius:50%"></div>
          </div>
          <span style="font-weight:bold; font-size:10px; color:#1e3a8a; background:rgba(255,255,255,0.9); padding:1px 5px; border-radius:4px; margin-top:2px; box-shadow:0 1px 3px rgba(0,0,0,0.2); white-space:nowrap;">${label}</span>
        </div>`,
        iconSize: [60, 42],
        iconAnchor: [30, 20]
      });
    };

    const melbourneMarker = L.marker(melbourne, { icon: createMarkerIcon('Melbourne') }).addTo(map);
    const geelongMarker = L.marker(geelong, { icon: createMarkerIcon('Geelong') }).addTo(map);
    const sydneyMarker = L.marker(sydney, { icon: createMarkerIcon('Sydney') }).addTo(map);

    const routePolyline = L.polyline([melbourne, geelong, sydney], {
      color: '#3b82f6',
      weight: 3,
      dashArray: '8, 8',
      opacity: 0.8
    }).addTo(map);

    map.fitBounds(routePolyline.getBounds(), { padding: [30, 30] });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}


// ─── Load Detail View ─────────────────────────────────────────────────────────
function LoadDetail({ load, onBack }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedStop, setSelectedStop] = useState(null);
  const tabs = ['Overview', 'Stops (4)', 'Items (1)', 'Driver & Vehicle', 'Expenses', 'Documents', 'Proof Photos', 'POD', 'Invoices', 'Activity'];

  const routeSteps = [
    { label: 'Dispatched', date: '15/07 07:30 AM', done: true },
    { label: 'En Route',   date: '15/07 10:30 AM', active: true, subLabel: 'In Progress' },
    { label: '3',          date: '15/07 07:33 PM', done: false },
    { label: '4',          date: '17/07 04:00 PM', done: false },
    { label: 'Delivered',  date: '18/07 09:00 AM', done: false },
  ];

  const stops = [
    { stepNum: 1, type: 'PICKUP', label: 'Melbourne Yard', location: 'Melbourne', date: '15/07/2025 08:00 AM', status: 'COMPLETED' },
    { stepNum: 2, type: 'PICKUP', label: 'Geelong Depot', location: 'Geelong', date: '15/07/2025 10:30 AM', status: 'UPCOMING' },
    { stepNum: 3, type: 'DROP-OFF', label: 'Sydney Depot', location: 'Sydney', date: '17/07/2025 04:00 PM', status: 'UPCOMING' },
    { stepNum: 4, type: 'DROP-OFF', label: 'Brisbane Yard', location: 'Brisbane', date: '18/07/2025 09:00 AM', status: 'UPCOMING' },
  ];

  const stopsDetailData = {
    1: {
      name: 'Melbourne Yard',
      stepNum: 1,
      type: 'PICKUP STOP',
      status: 'COMPLETED',
      address: '123 Smith St, Melbourne VIC 3000',
      dateTime: '15/07/2025 at 08:00 AM',
      contactName: 'John Smith',
      contactRole: 'Site Manager / Dispatcher',
      contactPhone: '+61 412 345 678',
      contactEmail: 'john.smith@melbourneyard.com',
      cargoName: 'Toyota Hilux (VIN: JHMZE2H77AS000123)',
      cargoDesc: '1x Toyota Hilux (White, Ute / Utility)',
      instructions: 'Customer prefers delivery between 8am - 12pm. Please call customer 30 mins before arrival.'
    },
    2: {
      name: 'Geelong Depot',
      stepNum: 2,
      type: 'PICKUP STOP',
      status: 'UPCOMING',
      address: '45 Industrial Rd, Geelong VIC 3220',
      dateTime: '15/07/2025 at 10:30 AM',
      contactName: 'Mark Davis',
      contactRole: 'Depot Manager',
      contactPhone: '+61 400 123 456',
      contactEmail: 'mark.davis@geelongdepot.com',
      cargoName: 'Toyota Hilux (VIN: JHMZE2H77AS000123)',
      cargoDesc: '1x Toyota Hilux (White, Ute / Utility)',
      instructions: 'Call 1 hour prior to arrival. Gate code is #4829.'
    },
    3: {
      name: 'Sydney Depot',
      stepNum: 3,
      type: 'DROP-OFF STOP',
      status: 'UPCOMING',
      address: 'depot 12, Sydney NSW 2000',
      dateTime: '17/07/2025 at 04:00 PM',
      contactName: 'David Wilson',
      contactRole: 'Receiving Supervisor',
      contactPhone: '+61 422 987 654',
      contactEmail: 'david.wilson@sydneydepot.com',
      cargoName: 'Toyota Hilux (VIN: JHMZE2H77AS000123)',
      cargoDesc: '1x Toyota Hilux (White, Ute / Utility)',
      instructions: 'Verify VIN number before offloading. Deliver to Bay 4.'
    },
    4: {
      name: 'Brisbane Yard',
      stepNum: 4,
      type: 'DROP-OFF STOP',
      status: 'UPCOMING',
      address: 'Brisbane Yard, Brisbane QLD 4000',
      dateTime: '18/07/2025 at 09:00 AM',
      contactName: 'Sarah Mitchell',
      contactRole: 'Operations Coordinator',
      contactPhone: '+61 433 555 111',
      contactEmail: 'sarah.mitchell@brisbaneyard.com',
      cargoName: 'Toyota Hilux (VIN: JHMZE2H77AS000123)',
      cargoDesc: '1x Toyota Hilux (White, Ute / Utility)',
      instructions: 'Check vehicle for any transport damages on arrival and sign the POD.'
    }
  };

  // Helper for stops badge colors
  const getStopStatusBadge = (status) => {
    if (status === 'COMPLETED') {
      return 'bg-purple-100 text-purple-700';
    }
    return 'bg-blue-100 text-blue-700';
  };

  const getLoadStatusBadge = (status) => {
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="flex flex-col" style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* ── Top Bar ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 bg-white border-b border-slate-100 shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 shrink-0">
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">Load {load.id}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border uppercase tracking-wider ${getLoadStatusBadge(load.status)}`}>
                ● {load.status === 'ACTIVE' ? 'IN PROGRESS' : load.statusSub?.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 flex-wrap">
              <Truck className="w-3 h-3 shrink-0" /> {load.type} • Created by Sarah Mitchell • {load.date?.split('-').reverse().join('/')} 07:15 AM
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <Edit3 className="w-3.5 h-3.5" /> Edit Load
          </button>
          <button className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <UserCheck className="w-3.5 h-3.5" /> Reassign
          </button>
          <button className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black transition-colors">
            More Actions <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Tabs Row ────────────────────────────────────────── */}
      <div className="flex items-center gap-0 px-6 bg-white border-b border-slate-100 overflow-x-auto shrink-0">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-[12px] font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-12 gap-5 max-w-[1280px] mx-auto">

            {/* ════ COLUMN 1: LEFT (Load Summary, Stops Timeline, Load Notes) ════ */}
            <div className="col-span-12 lg:col-span-3 space-y-5">
              
              {/* Load Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Load Summary</h3>
                <div className="flex flex-col gap-3.5">
                  {[
                    { icon: <FileText className="w-4 h-4 text-slate-400" />, label: 'Load Reference', value: load.id },
                    { icon: <Layers className="w-4 h-4 text-slate-400" />, label: 'Load Type', value: load.type },
                    { icon: <AlertCircle className="w-4 h-4 text-rose-500" />, label: 'Priority', value: '🔴 Normal' },
                    { icon: <User className="w-4 h-4 text-slate-400" />, label: 'Booking Customer', value: load.customer || 'Premium Motors' },
                    { icon: <MapPin className="w-4 h-4 text-slate-400" />, label: 'Total Stops', value: '4 (2 Pickup, 2 Drop-off)' },
                    { icon: <Package className="w-4 h-4 text-slate-400" />, label: 'Items / Vehicles', value: '1 Vehicle' },
                    { icon: <Navigation className="w-4 h-4 text-slate-400" />, label: 'Total Distance (EST.)', value: '1,260 km' },
                    { icon: <Thermometer className="w-4 h-4 text-slate-400" />, label: 'Total Weight (EST.)', value: '2,050 kg' },
                    { icon: <BarChart2 className="w-4 h-4 text-slate-400" />, label: 'Total Volume (EST.)', value: '10.2 m³' },
                    { icon: <Calendar className="w-4 h-4 text-slate-400" />, label: 'Created', value: '08/07/2025 09:15 AM' },
                    { icon: <Clock className="w-4 h-4 text-slate-400" />, label: 'Last Updated', value: '15/07/2025 07:42 AM' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="shrink-0">{row.icon}</span>
                        <span className="text-[12px] text-slate-400 font-semibold">{row.label}</span>
                      </div>
                      <span className="text-[12px] font-bold text-slate-800 text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stops Timeline */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Stops Timeline</h3>
                  <button className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">VIEW ALL</button>
                </div>
                <div className="space-y-4">
                  {stops.map((stop, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {stop.status === 'COMPLETED' ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 text-[10px] font-black">
                            {stop.stepNum}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex items-start justify-between min-w-0">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black text-slate-400">{stop.type}</span>
                            <span className="text-xs font-bold text-slate-800">{stop.location}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{stop.label}</p>
                          <p className="text-[9px] text-slate-400">{stop.date}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider shrink-0 ${getStopStatusBadge(stop.status)}`}>
                          {stop.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Load Notes */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Load Notes</h3>
                  <button className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">EDIT</button>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  Customer prefers delivery between 9am - 12pm. Please call customer 30 mins before arrival. Vehicle must be kept clean and free of debris.
                </p>
              </div>

            </div>

            {/* ════ COLUMN 2: CENTER (Route Progress + Map, Items, Messages) ════ */}
            <div className="col-span-12 lg:col-span-5 space-y-5">
              
              {/* Route Progress & Map */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Route Progress</h3>
                
                {/* Circular steps horizontal list */}
                <div className="flex items-start justify-between gap-1 mb-5 overflow-x-auto pb-2 scrollbar-none">
                  {routeSteps.map((step, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black border-2 ${
                          step.done && !step.active ? 'bg-emerald-500 border-emerald-500 text-white' :
                          step.active ? 'bg-blue-500 border-blue-500 text-white' :
                          'bg-white border-slate-200 text-slate-400'
                        }`}>
                          {step.done && !step.active ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 text-center w-14 leading-tight">{step.label}</span>
                        {step.active && <span className="text-[8px] font-bold text-blue-500 leading-none">In Progress</span>}
                        <span className="text-[8px] text-slate-400 mt-0.5">{step.date.split(' ')[0]}</span>
                      </div>
                      {i < routeSteps.length - 1 && (
                        <div className={`flex-1 h-0.5 mt-4 mx-0.5 ${step.done ? 'bg-emerald-400' : 'bg-slate-200'}`} style={{ minWidth: 16 }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* MapContainer using Leaflet */}
                <div className="rounded-xl overflow-hidden border border-slate-200" style={{ height: 235 }}>
                  <MapComponent />
                </div>
              </div>

              {/* Items / Vehicles */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Items / Vehicles (1)</h3>
                  <button className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">VIEW ALL</button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400"
                    alt="Toyota Hilux"
                    className="w-full sm:w-28 h-20 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-900 truncate">1ABC234 - Toyota Hilux (2024)</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                        <div>
                          <p className="text-[9px] text-slate-400 font-semibold">CUSTOMER</p>
                          <p className="text-[11px] font-bold text-slate-700 truncate">Premium Motors</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-semibold">PICKUP</p>
                          <p className="text-[11px] font-bold text-slate-700 truncate">Step 1 - Melbourne</p>
                        </div>
                        <div className="col-span-2 mt-1">
                          <p className="text-[9px] text-slate-400 font-semibold">DROP-OFF</p>
                          <p className="text-[11px] font-bold text-slate-700 truncate">Step 2 - Sydney</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 mt-2.5">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-full">DRIVABLE</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-full">IN TRANSIT</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col justify-between items-end">
                    <span className="text-[9px] font-bold text-slate-400">PTE</span>
                    <p className="text-xs font-black text-slate-800">CAR</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Messages</h3>
                  <button className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">VIEW ALL</button>
                </div>
                <div className="space-y-4">
                  
                  {/* Message 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[11px] font-black shrink-0">
                      MT
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-slate-700">Mike Thompson (Driver)</span>
                        <span className="text-[9px] text-slate-400">15/07/2025 08:12 AM</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">En route to Stop 2. Traffic is light, ETA on time.</p>
                    </div>
                  </div>

                  {/* Message 2 */}
                  <div className="flex items-start gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
                      alt="Sarah Mitchell"
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-slate-700">Sarah Mitchell (Dispatch)</span>
                        <span className="text-[9px] text-slate-400">15/07/2025 08:15 AM</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">Thanks Mike. Please send photos after loading.</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* ════ COLUMN 3: RIGHT (Load Status, Driver & Vehicle Live, Recent Proof Photos, Financials) ════ */}
            <div className="col-span-12 lg:col-span-4 space-y-5">
              
              {/* Load Status */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Load Status</h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    In Progress
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Current Status', value: 'En Route to Stop 2', icon: <Radio className="w-4 h-4 text-blue-500" /> },
                    { label: 'Current Location', value: 'Hume Hwy, Seymour VIC 3660', icon: <MapPin className="w-4 h-4 text-rose-500" /> },
                    { label: 'Last Update', value: '15/07/2025 08:12 AM', icon: <Clock className="w-4 h-4 text-slate-400" /> },
                    { label: 'Updated By', value: 'Mike Thompson (Driver)', icon: <User className="w-4 h-4 text-slate-400" /> },
                    { label: 'Next Stop', value: 'Stop 2 - Geelong\nETA: 10:30 AM (15/07/2025)', icon: <Navigation className="w-4 h-4 text-emerald-500" /> },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{item.label}</p>
                        <p className="text-xs font-bold text-slate-800 whitespace-pre-line leading-tight mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver & Vehicle (Live) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Driver & Vehicle (Live)</h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full uppercase tracking-wider shrink-0">+ LIVE</span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                    alt="Driver"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">Mike Thompson (DRV001)</p>
                    <p className="text-[9px] text-slate-400 font-semibold leading-tight">PHONE: +61 412 345 • LICENSE: MC (VIC) 076</p>
                    <p className="text-[9px] text-slate-400 font-semibold leading-tight mt-0.5">WORK DIARY: 07:15 / 14:00</p>
                  </div>
                  <a href="tel:+61412345" className="w-8 h-8 bg-green-50 hover:bg-green-100 rounded-full flex items-center justify-center shrink-0 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-green-600" />
                  </a>
                </div>
                <div className="flex items-center gap-3 pt-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-200">
                    <Truck className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">Truck: TRK-101 | Volvo FH 540</p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">ODOMETER: 523,410 KM • STATUS: ON THE ROAD</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-200">
                    <Package className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">Trailer: TRL-201 | 8 Car Carrier</p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">REG NO.: YQ-12-A8 • STATUS: ATTACHED</p>
                  </div>
                </div>
              </div>

              {/* Recent Proof Photos */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Recent Proof Photos</h3>
                  <button className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">VIEW ALL</button>
                </div>
                {[
                  {
                    label: 'PICKUP (BEFORE LOADING)',
                    count: '4 FILES',
                    images: [
                      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=100&h=70&q=80',
                      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=100&h=70&q=80',
                      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=100&h=70&q=80',
                      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=100&h=70&q=80'
                    ],
                    extra: '+1'
                  },
                  {
                    label: 'LOADING (COC)',
                    count: '5 FILES',
                    images: [
                      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=100&h=70&q=80',
                      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=100&h=70&q=80',
                      'https://images.unsplash.com/photo-1516576880881-140175b053f9?auto=format&fit=crop&w=100&h=70&q=80'
                    ],
                    extra: '+2'
                  },
                  {
                    label: 'DELIVERY (AFTER DELIVERY)',
                    count: '6 FILES',
                    images: [
                      'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=100&h=70&q=80',
                      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=100&h=70&q=80',
                      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&h=70&q=80',
                      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=100&h=70&q=80'
                    ],
                    extra: '+2'
                  },
                ].map((section, si) => (
                  <div key={si} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{section.label}</span>
                      <span className="text-[9px] font-bold text-slate-400">{section.count}</span>
                    </div>
                    <div className="flex gap-1.5 items-center overflow-x-auto pb-1 scrollbar-none">
                      {section.images.map((imgUrl, ci) => (
                        <img
                          key={ci}
                          src={imgUrl}
                          alt="Proof"
                          className="w-14 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      ))}
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                        <span className="text-[10px] font-bold text-slate-500">{section.extra}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Overview */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Financial Overview</h3>
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">Invoices</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black rounded-full uppercase tracking-wider">SEE GENERATED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">Driver Pay</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[9px] font-black rounded-full uppercase tracking-wider">PENDING</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">Expenses</span>
                    <span className="text-xs font-bold text-slate-800">$150.00</span>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                  View Financials
                </button>
              </div>

              {/* Quick Actions (Message, Expense, Document, Report) Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex justify-between items-center">
                {[
                  { icon: <MessageSquare className="w-5 h-5 text-slate-500" />, label: 'Message' },
                  { icon: <DollarSign className="w-5 h-5 text-slate-500" />, label: 'Expense' },
                  { icon: <FileText className="w-5 h-5 text-slate-500" />, label: 'Document' },
                  { icon: <Shield className="w-5 h-5 text-slate-500" />, label: 'Report' },
                ].map((item, i) => (
                  <button key={i} className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors flex-1">
                    {item.icon}
                    <span className="text-[11px] font-bold text-slate-600">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Mark Load As Completed Button */}
              <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-colors shadow-md shadow-indigo-100 uppercase tracking-wider">
                <CheckCircle className="w-4 h-4" /> MARK LOAD AS COMPLETED
              </button>

            </div>

          </div>
        )}

        {activeTab === 'Stops (4)' && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 text-xs font-black">
                  2
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Route Stops</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">ADD ALL PICKUP AND DROP-OFF LOCATIONS</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-wider">
                <Plus className="w-3.5 h-3.5" /> Add Stop
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: 900 }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-12">#</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address / Suburb</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { id: 1, type: 'PICKUP', typeColor: 'bg-purple-100 text-purple-700', address: '123 Smith St,\nMelbourne VIC 3000', contactName: 'John Smith', contactPhone: '+61 412 345 678', date: '15/07/2025', time: '08:00 AM' },
                    { id: 2, type: 'PICKUP', typeColor: 'bg-green-100 text-green-700', address: '45 Industrial Rd,\nGeelong VIC 3220', contactName: 'Mark Davis', contactPhone: '+61 400 123 456', date: '15/07/2025', time: '10:30 AM' },
                    { id: 3, type: 'DROP-OFF', typeColor: 'bg-blue-100 text-blue-700', address: 'depot 12,\nSydney NSW 2000', contactName: 'David Wilson', contactPhone: '+61 422 987 654', date: '17/07/2025', time: '04:00 PM' },
                    { id: 4, type: 'DROP-OFF', typeColor: 'bg-blue-100 text-blue-700', address: 'Brisbane Yard,\nBrisbane QLD 4000', contactName: 'Sarah Mitchell', contactPhone: '+61 433 555 111', date: '18/07/2025', time: '09:00 AM' }
                  ].map((stop) => (
                    <tr key={stop.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-4 text-xs font-bold text-slate-400">{stop.id}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${
                          stop.type === 'PICKUP' 
                            ? (stop.id === 1 ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100')
                            : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            stop.type === 'PICKUP'
                              ? (stop.id === 1 ? 'bg-purple-600' : 'bg-emerald-600')
                              : 'bg-blue-600'
                          }`} />
                          {stop.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-800 whitespace-pre-line leading-tight" style={{ minWidth: 160 }}>
                        <button 
                          onClick={() => setSelectedStop(stopsDetailData[stop.id])}
                          className="text-left hover:text-indigo-600 hover:underline transition-colors focus:outline-none"
                        >
                          {stop.address}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-bold text-slate-800">{stop.contactName}</p>
                        <a 
                          href={`tel:${stop.contactPhone}`}
                          className="text-[10px] text-slate-400 font-semibold mt-0.5 hover:text-indigo-600 hover:underline transition-colors block"
                        >
                          {stop.contactPhone}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <div className="inline-flex items-center justify-between gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white w-32">
                          <span>{stop.date}</span>
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="inline-flex items-center justify-between gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white w-28">
                          <span>{stop.time}</span>
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => setSelectedStop(stopsDetailData[stop.id])}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-black rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Items (1)' && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-base font-bold text-slate-900">Manifested Items &amp; Cargo</h2>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-wider rounded-full">
                1 Total Cargo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Big Truck Photo */}
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
                  alt="Manifested Cargo"
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Right Column: Grid Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'CUSTOMER BOOKING', value: 'ABC Motors Pty Ltd' },
                  { label: 'REGISTRATION (REGO)', value: '1ABC234', color: 'text-indigo-600' },
                  { label: 'VIN / CHASSIS NUMBER', value: 'JHMZE2H77AS000123' },
                  { label: 'WEIGHT', value: '2,050 kg' },
                  { label: 'DIMENSIONS (L x W x H)', value: '5,325 mm x 1,855 mm x 1,815 mm\n(Total Volume: 10.2 m³)', span: true },
                ].map((item, i) => (
                  <div key={i} className={`p-4 bg-slate-50 border border-slate-100 rounded-xl ${item.span ? 'sm:col-span-2' : ''}`}>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">{item.label}</p>
                    <p className={`text-xs font-bold text-slate-800 whitespace-pre-line leading-relaxed ${item.color || ''}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom details card inside content */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Toyota Hilux (2024)</h3>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">Ute / Utility • White</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">PICKUP LOCATION</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">Stop 1 - Melbourne Yard</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">DELIVERY LOCATION</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">Stop 3 - Sydney Depot</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Driver & Vehicle' && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-base font-bold text-slate-900">Active Driver &amp; Fleet Assignment</h2>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full">
                ● On the Road
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Driver Card */}
              <div className="p-5 border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                    alt="Driver"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Mike Thompson</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">DRIVER CODE: DRV001</p>
                    <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active (MC License Valid)
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">PHONE NUMBER</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">+61 412 345 678</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">WORK DIARY DUTY</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">07:15 / 14:00 hrs</p>
                  </div>
                </div>
              </div>

              {/* Fleet Card */}
              <div className="p-5 border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">TRK-101 | Volvo FH 540</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">ENGINE ODOMETER: 523,410 KM</p>
                    <p className="text-[11px] font-bold text-slate-500 mt-1">
                      Trailer Attached: TRL-201 (8 Car Carrier)
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">TRAILER REGO</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">YQ-12AB</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">TELEMATICS STATUS</p>
                    <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Ping OK
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!['Overview', 'Stops (4)', 'Items (1)', 'Driver & Vehicle'].includes(activeTab) && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider mb-2">{activeTab} Details</h3>
            <p className="text-sm text-slate-400">Additional information and documents related to {activeTab.toLowerCase()} will display here.</p>
          </div>
        )}
      </div>

      {/* ── Stop Details Modal ────────────────────────────── */}
      {selectedStop && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-black">
                  {selectedStop.stepNum}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 leading-tight">{selectedStop.name}</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">STOP SPECIFIC INFORMATION</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStop(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 max-h-[75vh]">
              {/* Badges Row */}
              <div className="flex gap-2">
                <span className="px-2.5 py-1 border border-indigo-200 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-wider">
                  {selectedStop.type}
                </span>
                <span className={`px-2.5 py-1 border text-[10px] font-black rounded-full uppercase tracking-wider ${
                  selectedStop.status === 'COMPLETED' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-blue-200 bg-blue-50 text-blue-700'
                }`}>
                  {selectedStop.status}
                </span>
              </div>

              {/* Address & Date Scheduled side-by-side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">ADDRESS / LOCATION</p>
                  <p className="text-xs font-bold text-slate-800 flex items-start gap-1 leading-snug">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{selectedStop.address}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">SCHEDULED DATE & TIME</p>
                  <p className="text-xs font-bold text-slate-800 flex items-start gap-1 leading-snug">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{selectedStop.dateTime}</span>
                  </p>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Primary Contact Person */}
              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">PRIMARY CONTACT PERSON</p>
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-[11px] font-black uppercase">
                      {selectedStop.contactName.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{selectedStop.contactName}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{selectedStop.contactRole}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${selectedStop.contactPhone}`} className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors shadow-xs">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                    <a href={`mailto:${selectedStop.contactEmail}`} className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors shadow-xs">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Cargo / Manifest Items */}
              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">CARGO / MANIFEST ITEMS</p>
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{selectedStop.cargoName}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{selectedStop.cargoDesc}</p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Special Site Instructions */}
              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">SPECIAL SITE INSTRUCTIONS</p>
                <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl text-xs font-semibold text-amber-900 leading-relaxed">
                  {selectedStop.instructions}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button 
                onClick={() => setSelectedStop(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors bg-white shadow-sm"
              >
                Close
              </button>
              <button 
                onClick={() => { setSelectedStop(null); }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                View on Map
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>

    </div>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const LOADS = [
  {
    id: 'PO-12546', date: '2025-07-15', starred: true, status: 'ACTIVE', statusSub: 'En Route',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'ABC Motors Pty Ltd',
    from: 'Melbourne', to: 'Brisbane', stops: 4,
    driver: 'Mike Thompson', truck: 'TRK-1401 | Scania T500', driverBadge: 'On The Road', driverStatus: 'text-emerald-500',
    avatar: 'https://i.pravatar.cc/150?u=10'
  },
  {
    id: 'PO-12545', date: '2025-07-15', starred: false, status: 'PLANNED', statusSub: 'Ready',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Global Retail Group',
    from: 'Sydney', to: 'Adelaide', stops: 3,
    driver: 'John Smith', truck: 'TRK-205 | Kenworth T88', driverBadge: 'Ready', driverStatus: 'text-blue-500',
    avatar: 'https://i.pravatar.cc/150?u=11'
  },
  {
    id: 'PO-12544', date: '2025-07-15', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Luxury Auto Imports',
    from: 'Perth', to: 'Melbourne', stops: 2,
    driver: null, truck: null, driverBadge: null, driverStatus: null,
    avatar: null
  },
  {
    id: 'PO-12543', date: '2025-07-16', starred: false, status: 'ACTIVE', statusSub: 'At Stop 2',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Cars R Us',
    from: 'Melbourne', to: 'Sydney', stops: 5,
    driver: 'David Wilson', truck: 'TRK-310 | Scania T500', driverBadge: 'On The Road', driverStatus: 'text-emerald-500',
    avatar: 'https://i.pravatar.cc/150?u=12'
  },
  {
    id: 'PO-12542', date: '2025-07-16', starred: false, status: 'COMPLETED', statusSub: 'Delivered',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'BuildCo Supplies',
    from: 'Brisbane', to: 'Gold Coast', stops: 2,
    driver: 'Mark Davis', truck: 'TRK-150 | Scania T500', driverBadge: 'Completed', driverStatus: 'text-slate-500',
    avatar: 'https://i.pravatar.cc/150?u=13'
  },
  {
    id: 'PO-12541', date: '2025-07-16', starred: false, status: 'CANCELLED', statusSub: 'Cancelled',
    type: 'Dangerous Goods', typeIcon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />,
    customer: 'ChemSafe Solutions',
    from: 'Sydney', to: 'Newcastle', stops: 4,
    driver: null, truck: null, driverBadge: null, driverStatus: null,
    avatar: null
  },
  {
    id: 'PO-12540', date: '2025-07-17', starred: false, status: 'PLANNED', statusSub: 'Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Premium Motors',
    from: 'Adelaide', to: 'Melbourne', stops: 3,
    driver: 'Sarah Mitchell', truck: 'TRK-220 | Scania T500', driverBadge: 'Ready', driverStatus: 'text-blue-500',
    avatar: 'https://i.pravatar.cc/150?u=14'
  },
  {
    id: 'PO-12539', date: '2025-07-17', starred: false, status: 'ACTIVE', statusSub: 'En Route',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'National Foods',
    from: 'Melbourne', to: 'Sydney', stops: 4,
    driver: 'Chris Lee', truck: 'TRK-330 | Scania T540', driverBadge: 'On The Road', driverStatus: 'text-emerald-500',
    avatar: 'https://i.pravatar.cc/150?u=15'
  },
  {
    id: 'PO-12538', date: '2025-07-17', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'ABC Motors Pty Ltd',
    from: 'Melbourne', to: 'Brisbane', stops: 4,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12537', date: '2025-07-18', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Global Retail Group',
    from: 'Sydney', to: 'Adelaide', stops: 3,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12536', date: '2025-07-18', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Dangerous Goods', typeIcon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />,
    customer: 'Luxury Auto Imports',
    from: 'Perth', to: 'Melbourne', stops: 2,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12535', date: '2025-07-18', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Cars R Us',
    from: 'Melbourne', to: 'Sydney', stops: 5,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12534', date: '2025-07-19', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'BuildCo Supplies',
    from: 'Brisbane', to: 'Gold Coast', stops: 2,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12533', date: '2025-07-19', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Dangerous Goods', typeIcon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />,
    customer: 'ChemSafe Solutions',
    from: 'Sydney', to: 'Newcastle', stops: 4,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12532', date: '2025-07-19', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Premium Motors',
    from: 'Adelaide', to: 'Melbourne', stops: 3,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12531', date: '2025-07-20', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'National Foods',
    from: 'Melbourne', to: 'Brisbane', stops: 4,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12530', date: '2025-07-20', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Dangerous Goods', typeIcon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />,
    customer: 'Pioneer Logistics',
    from: 'Sydney', to: 'Adelaide', stops: 3,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12529', date: '2025-07-20', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Apex Warehousing',
    from: 'Perth', to: 'Melbourne', stops: 2,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12528', date: '2025-07-21', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'ABC Motors Pty Ltd',
    from: 'Melbourne', to: 'Sydney', stops: 4,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12527', date: '2025-07-21', starred: false, status: 'PLANNED', statusSub: 'Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'ABC Motors Pty Ltd',
    from: 'Melbourne', to: 'Brisbane', stops: 4,
    driver: 'Mike Thompson', truck: 'TRK-1401 | Scania T500', driverBadge: 'Ready', driverStatus: 'text-blue-500',
    avatar: 'https://i.pravatar.cc/150?u=10'
  },
];

const STATUS_STYLES = {
  'ACTIVE':    { badge: 'bg-emerald-100 text-emerald-700', sub: 'text-emerald-600' },
  'PLANNED':   { badge: 'bg-blue-100 text-blue-700',       sub: 'text-blue-600'   },
  'DRAFT':     { badge: 'bg-slate-100 text-slate-600',     sub: 'text-slate-500'  },
  'COMPLETED': { badge: 'bg-emerald-50 text-emerald-600',   sub: 'text-emerald-500' },
  'CANCELLED': { badge: 'bg-rose-50 text-rose-600',       sub: 'text-rose-500'   },
};

const computeTabs = (data) => [
  { label: 'All Loads', count: data.length, status: 'ALL' },
  { label: 'Draft',     count: data.filter(d => d.status === 'DRAFT').length, status: 'DRAFT' },
  { label: 'Planned',   count: data.filter(d => d.status === 'PLANNED').length, status: 'PLANNED' },
  { label: 'Active',    count: data.filter(d => d.status === 'ACTIVE').length, status: 'ACTIVE' },
  { label: 'Completed', count: data.filter(d => d.status === 'COMPLETED').length, status: 'COMPLETED' },
  { label: 'Cancelled', count: data.filter(d => d.status === 'CANCELLED').length, status: 'CANCELLED' },
];

const ALERTS = [
  { id:'PO-12543', color:'bg-rose-500', iconColor: 'text-white', msg:'Delay risk: Traffic congestion on M1 - ETA may be affected', time:'5m ago' },
  { id:'PO-12544', color:'bg-amber-100', iconColor: 'text-amber-500',  msg:'Missing documents: POD required before dispatch',            time:'15m ago'},
  { id:'PO-12545', color:'bg-blue-100', iconColor: 'text-blue-500', msg:'Driver break in 30 min',                                time:'1h ago' },
];

const PAGE_SIZE = 20;

export default function Loads() {
  const location = useLocation();
  const [activeTab,   setActiveTab  ] = useState(0);
  const [search,      setSearch     ] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu,    setOpenMenu   ] = useState(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(location.state?.openNewLoadModal || false);
  const [showAILoadBuilder, setShowAILoadBuilder] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [customerFilter, setCustomerFilter] = useState('All Customer');
  const [driverFilter, setDriverFilter] = useState('All Drivers');
  const [vehicleFilter, setVehicleFilter] = useState('All Vehicles');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  if (selectedLoad) {
    return <LoadDetail load={selectedLoad} onBack={() => setSelectedLoad(null)} />;
  }

  if (showCreateForm) {
    return <CreateLoad onBack={() => setShowCreateForm(false)} />;
  }

  if (showAILoadBuilder) {
    return <AILoadBuilder onBack={() => setShowAILoadBuilder(false)} />;
  }

  const tabs = computeTabs(LOADS);

  const filtered = LOADS.filter(l => {
    const q = search.toLowerCase();
    const searchMatch = !q || l.id.toLowerCase().includes(q) || (l.customer || '').toLowerCase().includes(q)
      || (l.driver || '').toLowerCase().includes(q) || l.from.toLowerCase().includes(q) || l.to.toLowerCase().includes(q);

    const tabStatus = tabs[activeTab].status;
    const tabMatch = tabStatus === 'ALL' || l.status === tabStatus;

    const statusMatch = statusFilter === 'All Status' || l.status === statusFilter;
    const typeMatch = typeFilter === 'All Types' || l.type === typeFilter;
    const customerMatch = customerFilter === 'All Customer' || l.customer === customerFilter;
    const driverMatch = driverFilter === 'All Drivers' || l.driver === driverFilter;
    const vehicleMatch = vehicleFilter === 'All Vehicles' || (l.truck && l.truck.includes(vehicleFilter));
    const locationMatch = locationFilter === 'All Locations' || l.from === locationFilter || l.to === locationFilter;
    
    const dateMatch = (!dateFrom || (l.date && l.date >= dateFrom)) && (!dateTo || (l.date && l.date <= dateTo));

    return searchMatch && tabMatch && statusMatch && typeMatch && customerMatch && driverMatch && vehicleMatch && locationMatch && dateMatch;
  });

  const PIE_DATA = [
    { name: 'Active',    value: filtered.filter(d => d.status === 'ACTIVE').length, color: '#10b981' },
    { name: 'Planned',   value: filtered.filter(d => d.status === 'PLANNED').length, color: '#3b82f6' },
    { name: 'Draft',     value: filtered.filter(d => d.status === 'DRAFT').length, color: '#94a3b8' },
    { name: 'Completed', value: filtered.filter(d => d.status === 'COMPLETED').length, color: '#14b8a6' },
    { name: 'Cancelled', value: filtered.filter(d => d.status === 'CANCELLED').length, color: '#ef4444' },
  ];

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleRow = (id) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const allChecked = selectedIds.length === paged.length && paged.length > 0;

  return (
    <div className="flex-grow bg-[#F8FAFC] w-full font-sans overflow-hidden flex flex-col min-h-0">
      
      {/* ════ HEADER (Full Width) ════════════════════════════ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 sm:px-6 pt-4 sm:pt-6 pb-2 shrink-0 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight leading-none mb-2">Loads</h1>
          <p className="text-xs sm:text-[13px] font-medium text-slate-500">Manage and track all loads in your operation</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            <span className="text-slate-400 text-base leading-none">•</span> Import
          </button>
          <button className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            <span className="text-slate-400 text-base leading-none">•</span> Export
          </button>
          <div className="relative">
            <button 
              onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
              className="flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {headerMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                <button className="w-full text-left px-4 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">Archive Selected</button>
                <button className="w-full text-left px-4 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">Print Manifest</button>
                <div className="h-px bg-slate-100 my-1"></div>
                <button className="w-full text-left px-4 py-2 text-[13px] font-semibold text-red-500 hover:bg-slate-50">Delete Loads</button>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowAILoadBuilder(true)}
            className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-[11px] font-bold text-white transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI LOAD
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-4 py-2 bg-[#FFCC00] hover:bg-[#FACC15] rounded-xl text-[11px] font-bold text-black transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3px]" /> New Load
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* ════ LEFT: Main ════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 pt-2 pb-0">

          {/* Tabs */}
          <div className="flex items-center gap-2.5 mb-6 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => { setActiveTab(i); setCurrentPage(1); }}
                className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-[12px] font-bold whitespace-nowrap transition-all ${
                  activeTab === i
                    ? 'bg-indigo-50/50 border-indigo-200 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                  activeTab === i
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}>{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Filter Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-4">
            {/* Filter Row 1 */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="relative flex-1 min-w-[140px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search loads..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }} className="flex-1 min-w-[110px] px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-600 focus:outline-none focus:border-indigo-500" title="From Date"/>
              <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setCurrentPage(1); }} className="flex-1 min-w-[110px] px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-600 focus:outline-none focus:border-indigo-500" title="To Date"/>
              
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="flex-1 min-w-[110px] px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-600 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none bg-no-repeat bg-[right_8px_center] bg-[length:12px]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")'}}>
                <option>All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PLANNED">Planned</option>
                <option value="DRAFT">Draft</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }} className="flex-1 min-w-[110px] px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-600 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none bg-no-repeat bg-[right_8px_center] bg-[length:12px]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")'}}>
                <option>All Types</option>
                <option value="General Freight">General Freight</option>
                <option value="Car Carrying">Car Carrying</option>
                <option value="Dangerous Goods">Dangerous Goods</option>
              </select>

              <select value={customerFilter} onChange={e => { setCustomerFilter(e.target.value); setCurrentPage(1); }} className="flex-1 min-w-[110px] px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-600 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none bg-no-repeat bg-[right_8px_center] bg-[length:12px]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")'}}>
                <option>All Customer</option>
                {[...new Set(LOADS.map(l => l.customer).filter(Boolean))].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Filter Row 2 */}
            <div className="flex flex-wrap items-center gap-2">
              <select value={driverFilter} onChange={e => { setDriverFilter(e.target.value); setCurrentPage(1); }} className="flex-1 min-w-[110px] px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-600 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none bg-no-repeat bg-[right_8px_center] bg-[length:12px]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")'}}>
                <option>All Drivers</option>
                {[...new Set(LOADS.map(l => l.driver).filter(Boolean))].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              
              <select value={vehicleFilter} onChange={e => { setVehicleFilter(e.target.value); setCurrentPage(1); }} className="flex-1 min-w-[110px] px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-600 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none bg-no-repeat bg-[right_8px_center] bg-[length:12px]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")'}}>
                <option>All Vehicles</option>
                {[...new Set(LOADS.map(l => l.truck).filter(Boolean).map(t => t.split(' | ')[0]))].map(v => <option key={v} value={v}>{v}</option>)}
              </select>

              <select value={locationFilter} onChange={e => { setLocationFilter(e.target.value); setCurrentPage(1); }} className="flex-1 min-w-[110px] px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-600 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none bg-no-repeat bg-[right_8px_center] bg-[length:12px]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")'}}>
                <option>All Locations</option>
                {[...new Set([...LOADS.map(l => l.from), ...LOADS.map(l => l.to)].filter(Boolean))].map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>

              <button className="flex-1 sm:flex-none justify-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap">
                <Filter className="w-3.5 h-3.5" /> More Filters
              </button>
            </div>
          </div>



          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 mt-4 gap-2">
            <p className="text-[11px] font-semibold text-slate-500">{filtered.length} loads found</p>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 hover:bg-slate-50">
                <MoreVertical className="w-3 h-3" /> Columns
              </button>
              <button className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 hover:bg-slate-50">
                Group By
              </button>
              <button className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 hover:bg-slate-50">
                Sort By: Created Date (Newest) <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: 900 }}>
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    <th className="px-4 py-3 w-8">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={() => setSelectedIds(allChecked ? [] : paged.map(l => l.id))}
                        className="w-3.5 h-3.5 rounded border-slate-300 accent-indigo-600"
                      />
                    </th>
                    {['LOAD REF', 'STATUS', 'LOAD TYPE', 'CUSTOMER', 'ROUTE', 'DRIVER / TRUCK', 'PICKUP DATE', 'ETA / DELIVERY', 'PROGRESS', 'ACTIONS'].map(h => (
                      <th key={h} className="px-3 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-[12px] font-semibold">No loads found matching filters.</td>
                    </tr>
                  ) : null}
                  {paged.map((load, i) => {
                    const st = STATUS_STYLES[load.status] || STATUS_STYLES.DRAFT;
                    const isSelected = selectedIds.includes(load.id);
                    return (
                      <tr
                        key={i}
                        onClick={() => setSelectedLoad(load)}
                        className={`transition-colors group cursor-pointer ${isSelected ? 'bg-indigo-50/40' : 'hover:bg-blue-50/30'}`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(load.id)}
                            className="w-3.5 h-3.5 rounded border-slate-300 accent-indigo-600"
                          />
                        </td>

                        {/* LOAD REF */}
                        <td className="px-3 py-4 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <Star className={`w-4 h-4 ${load.starred ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} cursor-pointer hover:text-amber-400 transition-colors`} />
                            <span className="text-[12px] font-semibold text-blue-700 hover:underline cursor-pointer">{load.id}</span>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-3 py-4 min-w-[120px]">
                          <div className="flex flex-col items-start gap-1">
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${st.badge}`}>
                              {load.status}
                            </div>
                            <span className={`text-[11px] font-medium ${st.sub}`}>{load.statusSub}</span>
                          </div>
                        </td>

                        {/* LOAD TYPE */}
                        <td className="px-3 py-4 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center shrink-0">
                              {load.typeIcon}
                            </div>
                            <span className="text-[12px] font-medium text-slate-700">{load.type}</span>
                          </div>
                        </td>

                        {/* CUSTOMER */}
                        <td className="px-3 py-4 min-w-[140px]">
                          <span className="text-[12px] font-semibold text-slate-900">{load.customer}</span>
                        </td>

                        {/* ROUTE */}
                        <td className="px-3 py-4 min-w-[120px]">
                          <div className="flex flex-col">
                            <span className="text-[12px] font-semibold text-blue-700">{load.from}</span>
                            <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                               → {load.to}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 mt-0.5">{load.stops} Stops</span>
                          </div>
                        </td>

                        {/* DRIVER / TRUCK */}
                        <td className="px-3 py-4 min-w-[180px]">
                          {load.driver ? (
                            <div className="flex items-center gap-2.5">
                              <img src={load.avatar} alt={load.driver} className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0" />
                              <div className="flex flex-col">
                                <span className="text-[12px] font-bold text-slate-900 leading-tight">{load.driver}</span>
                                <span className="text-[10px] font-medium text-slate-500 leading-tight">{load.truck}</span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${load.driverBadge === 'On The Road' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                                    <span className={`text-[10px] font-medium ${load.driverStatus}`}>{load.driverBadge}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[12px] font-bold text-slate-500 italic">Not Assigned</span>
                          )}
                        </td>

                        {/* PICKUP DATE */}
                        <td className="px-3 py-4 min-w-[120px]">
                          <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-slate-700">{load.date ? load.date.split('-').reverse().join('/') : '08/07/2025'}</span>
                            <span className="text-[10px] font-medium text-slate-500 mt-0.5">09:00 AM</span>
                          </div>
                        </td>

                        {/* ETA / DELIVERY */}
                        <td className="px-3 py-4 min-w-[120px]">
                          <span className="text-[12px] font-medium text-slate-700">-</span>
                        </td>

                        {/* PROGRESS */}
                        <td className="px-3 py-4 min-w-[120px]">
                          <div className="flex flex-col gap-1.5 mt-1">
                            <span className="text-[10px] font-bold text-slate-700 leading-none">0%</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 w-0"></div>
                            </div>
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-3 py-4 min-w-[140px]">
                          <div className="flex items-center gap-1">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 rounded-lg transition-colors">
                              <Eye className="w-3.5 h-3.5 text-indigo-600" />
                              <span className="text-[11px] font-bold text-indigo-600">View</span>
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-100 bg-white flex justify-between items-center">
              <span className="text-[11px] font-medium text-slate-600">
                Showing {Math.min(1, filtered.length)} to {Math.min(PAGE_SIZE, filtered.length)} of {filtered.length} loads
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[1, 2, '...', 7].map((pg, i) => (
                  <button
                    key={i}
                    onClick={() => typeof pg === 'number' && setCurrentPage(pg)}
                    className={`w-8 h-8 rounded text-[12px] font-semibold transition-colors border ${
                      currentPage === pg
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
                    } ${pg === '...' ? 'cursor-default' : ''}`}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <select className="ml-2 px-3 py-1.5 bg-white border border-slate-200 rounded text-[12px] font-semibold text-slate-600 focus:outline-none focus:border-indigo-500">
                  <option>20 per page</option>
                  <option>50 per page</option>
                  <option>100 per page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Action Bar */}
          <div className="mt-2 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <span className="text-[12px] font-semibold text-slate-900 px-2">{selectedIds.length} selected</span>
            <select className="px-4 py-2 bg-white border border-slate-200 rounded text-[12px] font-medium text-slate-700 focus:outline-none focus:border-indigo-500 w-full sm:w-48">
              <option>Bulk Actions</option>
              <option>Assign Driver</option>
              <option>Mark Completed</option>
              <option>Cancel Loads</option>
              <option>Export Selected</option>
            </select>
            <button className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[12px] rounded transition-colors shadow-sm">
              Apply
            </button>
          </div>
        </div>

        {/* ════ RIGHT: Sidebar ════════════════════════════ */}
        <div className="w-full lg:w-[280px] shrink-0 p-4 sm:p-6 lg:pt-2 lg:pl-0 flex flex-col gap-4">

          {/* Load Overview Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[13px] font-semibold text-slate-900 mb-0.5">Load Overview</h2>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-4">TODAY, 15 JULY 2025</p>
            <div className="space-y-4">
              {[
                { label: 'Total Loads',     value: filtered.length, icon: <Package    className="w-4 h-4 text-indigo-500"/>, color: 'bg-indigo-50'   },
                { label: 'Active Loads',    value: filtered.filter(f => f.status === 'ACTIVE').length,  icon: <Activity   className="w-4 h-4 text-emerald-500"/>, color: 'bg-emerald-50'},
                { label: 'In Transit',      value: filtered.filter(f => f.statusSub === 'En Route').length,  icon: <ArrowUpRight className="w-4 h-4 text-emerald-500"/>, color: 'bg-emerald-50'     },
                { label: 'At Stop',         value: filtered.filter(f => f.statusSub && f.statusSub.includes('Stop')).length,  icon: <MapPin      className="w-4 h-4 text-indigo-500"/>, color: 'bg-indigo-50'   },
                { label: 'Completed Today', value: filtered.filter(f => f.status === 'COMPLETED').length,   icon: <CheckCircle className="w-4 h-4 text-rose-500"/>,color: 'bg-rose-50' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="text-[13px] font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-[14px] font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[13px] font-semibold text-slate-900 mb-4">Status Breakdown</h2>
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PIE_DATA} innerRadius={45} outerRadius={60} paddingAngle={0} dataKey="value" stroke="none">
                      {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                  <span className="text-[22px] font-semibold text-slate-900 leading-none">{filtered.length}</span>
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-1">TOTAL</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {PIE_DATA.map((item, i) => {
                const pct = filtered.length > 0 ? ((item.value / filtered.length) * 100).toFixed(1) : 0;
                return (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}/>
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900">{item.value}</span>
                      <span className="text-[10px] font-medium text-slate-400">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Alerts Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[13px] font-semibold text-slate-900">Recent Alerts</h2>
              <button className="text-[10px] font-semibold text-indigo-600 hover:underline uppercase tracking-wider">VIEW ALL</button>
            </div>
            <div className="space-y-4">
              {ALERTS.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-6 h-6 rounded-full ${a.color} flex items-center justify-center shrink-0 mt-0.5`}>
                    <AlertCircle className={`w-3.5 h-3.5 ${a.iconColor}`}/>
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline gap-2 mb-1">
                      <span className="text-[12px] font-semibold text-slate-900">{a.id}</span>
                      <span className="text-[10px] font-medium text-slate-500 shrink-0">{a.time}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-600 leading-snug">{a.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              View All Alerts
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
