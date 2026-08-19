import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, MapPin, Navigation, Bell, ArrowRight, User, ArrowLeft, ArrowUpRight, 
  FileText, ChevronRight, MoreVertical, X, Calendar, 
  ChevronDown, Globe, RotateCcw, Filter, Phone, Mail, Compass, Eye, Check, Clock, Truck, Box,
  Maximize2, Activity, Share2, Send, History, RefreshCw, ChevronLeft,
  Users, Container, Settings, Zap, Target, Info, Download, SlidersHorizontal, MessageSquare, ExternalLink,
  RefreshCcw, FileCheck, Layers, Package, Flag, AlertTriangle, CheckCircle2, Circle
} from 'lucide-react';
import L from 'leaflet';
import { dispatcherRepository } from '../../services/dispatcherRepository';
import { dispatcherStore } from '../../services/dispatcherStore';
import api from '../../services/api';

export default function FleetMonitor() {
  const [driverSearchQuery, setDriverSearchQuery] = useState('');
  const [topSearchQuery, setTopSearchQuery] = useState('');
  const [activeDriverTab, setActiveDriverTab] = useState('All');
  const [selectedDriverId, setSelectedDriverId] = useState('DRV-101');
  const [activeDetailsTab, setActiveDetailsTab] = useState('Route & Stops');
  const [showDriverPanel, setShowDriverPanel] = useState(true);
  const [mapMode, setMapMode] = useState('Map');
  const [toastMsg, setToastMsg] = useState('');

  // Top Filter States
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [driverFilter, setDriverFilter] = useState('All Drivers');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [loadStatusFilter, setLoadStatusFilter] = useState('All Loads');
  const [showMoreFiltersModal, setShowMoreFiltersModal] = useState(false);

  // Send Location Modal State
  const [isSendLocationModalOpen, setIsSendLocationModalOpen] = useState(false);
  const [locationFormData, setLocationFormData] = useState({
    driverId: '',
    presetName: '',
    address: '',
    lat: '',
    lng: '',
    notes: '',
    channel: 'App Push + SMS',
    includeNav: true,
    reqAck: true
  });

  const [driverEventsMap, setDriverEventsMap] = useState({});

  const [locationPresets, setLocationPresets] = useState([
    { name: 'Sydney Depot', address: '14 Logistics Way, Chullora NSW 2190', lat: '-33.8845', lng: '151.0452' },
    { name: 'Melbourne Hub', address: '88 Freight Hwy, Laverton North VIC 3026', lat: '-37.8136', lng: '144.9631' },
    { name: 'Brisbane Terminal', address: '42 Port Drive, Wynnum West QLD 4178', lat: '-27.4698', lng: '153.0251' },
    { name: 'Adelaide Yard', address: '19 Logistics Ave, Regency Park SA 5010', lat: '-34.8500', lng: '138.5800' },
    { name: 'Geelong Customer', address: '102 Industrial Blvd, Geelong VIC 3220', lat: '-38.1499', lng: '144.3617' }
  ]);

  // Leaflet Map Ref
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleOpenSendLocationModal = (drvId) => {
    const targetId = drvId || selectedDriverId;
    setLocationFormData(prev => ({
      ...prev,
      driverId: targetId
    }));
    setIsSendLocationModalOpen(true);
  };

  const handleSelectPreset = (preset) => {
    setLocationFormData(prev => ({
      ...prev,
      presetName: preset.name,
      address: preset.address,
      lat: preset.lat,
      lng: preset.lng
    }));
  };

  const handleSendLocationSubmit = (e) => {
    e.preventDefault();
    const targetDriver = driversList.find(d => d.id === locationFormData.driverId) || selectedDriver;
    const destName = locationFormData.presetName || locationFormData.address || 'Selected Waypoint';
    
    // Append event for driver
    const newEvent = {
      id: Date.now(),
      title: `Location Dispatched: ${destName}`,
      time: 'Just now',
      status: 'active'
    };

    setDriverEventsMap(prev => ({
      ...prev,
      [targetDriver.id]: [newEvent, ...(prev[targetDriver.id] || [])]
    }));

    triggerToast(`Location & route link successfully sent to ${targetDriver.name} via ${locationFormData.channel}!`);
    setIsSendLocationModalOpen(false);
  };

  const [liveDrivers, setLiveDrivers] = useState([]);
  const [dbLoadsList, setDbLoadsList] = useState([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);

  const fetchLiveDrivers = async () => {
    setIsLoadingLive(true);
    try {
      const [driversRes, loadsRes, branchesRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/loads'), // To check if driver is currently assigned a load
        api.get('/companies/branches').catch(() => ({ data: { data: [] } }))
      ]);
      const dbDrivers = driversRes.data?.data || [];
      const dbLoads = loadsRes.data?.data || [];
      const dbBranches = branchesRes.data?.data || [];

      setDbLoadsList(dbLoads);

      if (dbBranches.length > 0) {
        setLocationPresets(dbBranches.map(b => ({
          name: b.name,
          address: b.location || 'Unknown Location',
          lat: '-33.8845', // Default fallback if no real gps
          lng: '151.0452'
        })));
      }

      const eventsMap = {};

      // Fallback preset active loads for drivers if DB loads aren't assigned yet
      const defaultActiveLoads = [
        { loadRef: 'PO-163402', customerName: 'Direct Customer', routeFrom: 'Geelong VIC', routeTo: 'Sydney NSW', status: 'IN_TRANSIT', speed: '68 km/h', lat: -38.1499, lng: 144.3617 },
        { loadRef: 'PO-373069', customerName: 'Direct Customer', routeFrom: 'Melbourne VIC', routeTo: 'Mumbai', status: 'EN_ROUTE', speed: '74 km/h', lat: -33.8688, lng: 151.2093 },
        { loadRef: 'LD-4736', customerName: 'Customer Portal', routeFrom: 'Brisbane QLD', routeTo: 'Perth WA', status: 'IN_TRANSIT', speed: '62 km/h', lat: -27.4698, lng: 153.0251 }
      ];

      const formatted = dbDrivers.map((d, index) => {
        let activeLoad = dbLoads.find(l => l.driverId === d.id && l.status !== 'DELIVERED');
        const fallbackLoad = defaultActiveLoads[index % defaultActiveLoads.length];

        const loadId = activeLoad ? (activeLoad.loadRef || activeLoad.id?.substring(0,8)) : fallbackLoad.loadRef;
        const customerName = activeLoad?.customer?.name || fallbackLoad.customerName;
        const routeFrom = activeLoad?.notes?.includes(' to ') ? activeLoad.notes.split(' to ')[0] : fallbackLoad.routeFrom;
        const routeTo = activeLoad?.notes?.includes(' to ') ? activeLoad.notes.split(' to ')[1] : fallbackLoad.routeTo;
        const statusText = index % 2 === 0 ? 'In Transit' : 'En Route';
        const speedText = fallbackLoad.speed;
        const latVal = fallbackLoad.lat;
        const lngVal = fallbackLoad.lng;

        eventsMap[d.id] = [
          { id: 1, title: `Active Load ${loadId}: En Route to ${routeTo}`, time: 'Just now', status: 'active' },
          { id: 2, title: `Departed Origin: ${routeFrom}`, time: '2 hours ago', status: 'completed' },
          { id: 3, title: 'Pre-trip Safety & Medical Inspection Cleared', time: 'Today 07:30 AM', status: 'completed' }
        ];

        return {
          id: d.id,
          name: d.firstName || d.lastName ? `${d.firstName || ''} ${d.lastName || ''}`.trim() : (d.driverCode || 'Unknown Driver'),
          status: statusText,
          statusStyle: statusText === 'In Transit' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200',
          statusDot: statusText === 'In Transit' ? 'bg-emerald-500' : 'bg-blue-500',
          loadId: loadId,
          speed: speedText,
          heading: ['NE', 'SW', 'N', 'S', 'E', 'W'][index % 6],
          lastUpdate: 'Just now',
          toDest: `${120 + (index * 45) % 250} km`,
          customer: customerName,
          routeFrom: routeFrom,
          routeTo: routeTo,
          lat: latVal,
          lng: lngVal,
          badgeColor: statusText === 'In Transit' ? '#10b981' : '#3b82f6',
          avatar: d.avatarUrl || `https://ui-avatars.com/api/?name=` + encodeURIComponent(d.firstName || d.lastName ? `${d.firstName || ''} ${d.lastName || ''}`.trim() : (d.driverCode || 'Driver'))
        };
      });

      setDriverEventsMap(eventsMap);
      setLiveDrivers(formatted);
    } catch (err) {
      console.error('Error fetching live drivers:', err);
      triggerToast('Error loading live map data');
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveDrivers();
    // Optional: could set up a polling interval here to refresh live data
    const interval = setInterval(fetchLiveDrivers, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const driversList = liveDrivers;

  // Currently selected driver object
  const selectedDriver = driversList.find(d => d.id === selectedDriverId) || driversList[0] || {
    id: 'DRV-NONE',
    name: 'Select a Driver',
    avatar: 'https://ui-avatars.com/api/?name=Driver',
    status: 'Offline',
    statusStyle: 'bg-slate-100 text-slate-700 border-slate-200',
    statusDot: 'bg-slate-400',
    loadId: 'N/A',
    speed: '0 km/h',
    heading: 'N',
    lastUpdate: 'N/A',
    toDest: '-',
    customer: 'N/A',
    routeFrom: 'N/A',
    routeTo: 'N/A',
    vehicle: 'N/A',
    phone: 'N/A'
  };

  // Filtered driver list
  const filteredDrivers = driversList.filter(d => {
    const searchQuery = (driverSearchQuery || topSearchQuery).toLowerCase();
    const matchesQuery = !searchQuery || 
                         (d.name && d.name.toLowerCase().includes(searchQuery)) ||
                         (d.loadId && d.loadId.toLowerCase().includes(searchQuery)) ||
                         (d.routeFrom && d.routeFrom.toLowerCase().includes(searchQuery)) ||
                         (d.routeTo && d.routeTo.toLowerCase().includes(searchQuery));

    const matchesBranch = branchFilter === 'All Branches' || (d.routeFrom && d.routeFrom.includes(branchFilter.split(' ')[0])) || (d.branch && d.branch === branchFilter);
    const matchesDriver = driverFilter === 'All Drivers' || d.name === driverFilter;
    const matchesStatus = statusFilter === 'All Statuses' || d.status === statusFilter;
    const matchesLoadStatus = loadStatusFilter === 'All Loads' || (loadStatusFilter === 'Assigned' ? (d.loadId && d.loadId !== 'N/A') : (!d.loadId || d.loadId === 'N/A'));

    let matchesTab = true;
    if (activeDriverTab.includes('On Duty')) matchesTab = d.status === 'In Transit' || d.status === 'En Route' || d.status === 'At Pickup';
    else if (activeDriverTab.includes('Delayed')) matchesTab = d.status === 'Delayed';
    else if (activeDriverTab.includes('Offline')) matchesTab = d.status === 'Offline';

    return matchesQuery && matchesBranch && matchesDriver && matchesStatus && matchesLoadStatus && matchesTab;
  });

  // On-Road Summary Loads Table Data (Dynamic API + Fallbacks)
  const defaultSummaryLoads = [
    {
      loadId: 'LD-10583',
      driver: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      status: 'In Transit',
      statusStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      route: 'Melbourne → Geelong',
      vehicle: 'MAN TGX 26.580 (TR-01)',
      lastUpdate: '5m ago',
      etaNext: '09:30 AM',
      etaDelivery: '05:00 PM',
      progressStep: '2/4'
    },
    {
      loadId: 'LD-10578',
      driver: 'Chris Lee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      status: 'In Transit',
      statusStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      route: 'Sydney → Melbourne',
      vehicle: 'Volvo FH16 750 (TR-02)',
      lastUpdate: '2m ago',
      etaNext: '12:00 PM',
      etaDelivery: 'Tomorrow 08:00 AM',
      progressStep: '3/5'
    },
    {
      loadId: 'LD-10581',
      driver: 'Michael Tan',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      status: 'En Route',
      statusStyle: 'bg-blue-50 text-blue-700 border-blue-200',
      route: 'Brisbane → Sydney',
      vehicle: 'Scania R650 (TR-03)',
      lastUpdate: '1m ago',
      etaNext: '03:00 PM',
      etaDelivery: 'Tomorrow 07:00 AM',
      progressStep: '1/4'
    },
    {
      loadId: 'LD-10579',
      driver: 'David Brown',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      status: 'Delayed',
      statusStyle: 'bg-rose-50 text-rose-700 border-rose-200',
      route: 'Gold Coast → Sydney',
      vehicle: 'MAN TGX 26.580 (TR-01)',
      lastUpdate: '18m ago',
      etaNext: '03:45 PM (ETA +45m)',
      etaDelivery: 'Tomorrow 09:00 AM',
      progressStep: '2/5'
    },
    {
      loadId: 'LD-10576',
      driver: 'Daniel Craig',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      status: 'At Pickup',
      statusStyle: 'bg-amber-50 text-amber-700 border-amber-200',
      route: 'Adelaide → Townsville',
      vehicle: 'Volvo FH16 750 (TR-02)',
      lastUpdate: '8m ago',
      etaNext: '10:00 AM',
      etaDelivery: '24 May 06:00 PM',
      progressStep: '1/4'
    }
  ];

  const summaryLoads = dbLoadsList.length > 0
    ? dbLoadsList.map((l, index) => {
        const rawId = l.loadRef || l.referenceNumber || l.loadNumber || l.id;
        const cleanId = (rawId && rawId.length > 18) ? `LD-${rawId.slice(0, 8).toUpperCase()}` : (rawId || `LD-100${index + 1}`);
        const drvName = l.driver?.firstName || l.driver?.name || l.driverName || 'DRIVER Demo';
        const drvAvatar = l.driver?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(drvName)}`;
        
        const pickupLoc = l.pickupLocation || l.origin || 'Origin Depot';
        const deliveryLoc = l.deliveryLocation || l.destination || 'Destination Yard';
        const routeStr = `${pickupLoc} → ${deliveryLoc}`;
        
        const vehStr = l.vehicle?.name || l.vehicleId || 'BS738782 (Scorpio S11)';
        const statusVal = l.status === 'IN_TRANSIT' ? 'In Transit' : (l.status === 'ASSIGNED' ? 'En Route' : 'Planned');
        const statusStyleVal = statusVal === 'In Transit' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200';

        return {
          loadId: cleanId,
          driver: drvName,
          avatar: drvAvatar,
          status: statusVal,
          statusStyle: statusStyleVal,
          route: routeStr,
          vehicle: vehStr,
          lastUpdate: 'Just now',
          etaNext: '09:30 AM',
          etaDelivery: '05:00 PM',
          progressStep: `${(index % 3) + 1}/5`
        };
      })
    : defaultSummaryLoads;

  // Leaflet Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [-31.0000, 147.0000],
      zoom: 5.5,
      zoomControl: false
    });
    mapRef.current = map;

    const tileUrl = mapMode === 'Satellite' 
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // Render Driver Box Callout Markers on Australia Map
    driversList.forEach((drv) => {
      const isSelected = drv.id === selectedDriverId;
      const htmlContent = `
        <div style="
          background-color: ${drv.badgeColor}; 
          color: white; 
          border-radius: 8px; 
          padding: 4px 8px; 
          font-weight: 700; 
          font-size: 10.5px; 
          line-height: 1.2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          border: ${isSelected ? '2.5px solid white' : '1px solid rgba(255,255,255,0.4)'};
          transform: ${isSelected ? 'scale(1.08)' : 'scale(1)'};
          transition: all 0.2s ease;
          cursor: pointer;
          white-space: nowrap;
          text-align: center;
        ">
          <div>${drv.name}</div>
          <div style="font-size: 9px; opacity: 0.9; font-weight: 600;">${drv.loadId}</div>
          <div style="font-size: 8.5px; opacity: 0.85;">${drv.isDelay ? drv.etaDelay : drv.speed}</div>
        </div>
      `;

      const customDivIcon = L.divIcon({
        className: 'custom-driver-map-box',
        html: htmlContent,
        iconSize: [95, 42],
        iconAnchor: [47, 21]
      });

      const marker = L.marker([drv.lat, drv.lng], { icon: customDivIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedDriverId(drv.id);
        triggerToast(`Focused map on ${drv.name} (${drv.loadId})`);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [selectedDriverId, mapMode]);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-6 space-y-4 text-left font-sans antialiased text-slate-800">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ============================================================
         1. TOP HEADER ROW
         ============================================================ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Live GPS Map</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Track drivers in real-time, view routes and manage on-road activity.</p>
        </div>
      </div>

      {/* ============================================================
         2. TOP FILTER & ACTIONS BAR
         ============================================================ */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-end justify-between gap-2.5">
        <div className="flex flex-wrap items-end gap-2 flex-1">
          
          {/* Branch */}
          <div className="min-w-[110px]">
            <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block">Branch</label>
            <select 
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            >
              <option value="All Branches">All Branches</option>
              <option value="Sydney Depot">Sydney Depot</option>
              <option value="Melbourne Depot">Melbourne Depot</option>
            </select>
          </div>

          {/* Driver */}
          <div className="min-w-[110px]">
            <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block">Driver</label>
            <select 
              value={driverFilter}
              onChange={(e) => setDriverFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            >
              <option value="All Drivers">All Drivers</option>
              <option value="John Doe">John Doe</option>
              <option value="Chris Lee">Chris Lee</option>
              <option value="Michael Tan">Michael Tan</option>
            </select>
          </div>

          {/* Status */}
          <div className="min-w-[110px]">
            <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block">Status</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="In Transit">In Transit</option>
              <option value="En Route">En Route</option>
              <option value="At Pickup">At Pickup</option>
            </select>
          </div>

          {/* Load Status */}
          <div className="min-w-[110px]">
            <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block">Load Status</label>
            <select 
              value={loadStatusFilter}
              onChange={(e) => setLoadStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            >
              <option value="All Loads">All Loads</option>
              <option value="Assigned">Assigned</option>
              <option value="Unassigned">Unassigned</option>
            </select>
          </div>

          {/* Top Search Input */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by driver, load ID, vehicle, rego..."
              value={topSearchQuery}
              onChange={(e) => setTopSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowMoreFiltersModal(!showMoreFiltersModal)}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>More Filters</span>
            </button>
            {showMoreFiltersModal && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMoreFiltersModal(false)} />
                <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3.5 space-y-3 text-left animate-in fade-in zoom-in-95">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">Advanced GPS Filters</span>
                    <button onClick={() => { setBranchFilter('All Branches'); setDriverFilter('All Drivers'); setStatusFilter('All Statuses'); setLoadStatusFilter('All Loads'); setTopSearchQuery(''); setShowMoreFiltersModal(false); }} className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">Reset All</button>
                  </div>
                  <div className="space-y-2 text-xs font-semibold text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="rounded accent-blue-600 cursor-pointer" /> Live Geofence Alerts
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="rounded accent-blue-600 cursor-pointer" /> Telemetry Speed Tracking
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="rounded accent-blue-600 cursor-pointer" /> Show Driver Avatars
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => handleOpenSendLocationModal()}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Location to Driver</span>
          </button>

          <button 
            onClick={() => triggerToast('Refreshed GPS telemetry')}
            className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg cursor-pointer shadow-2xs"
            title="Refresh GPS"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ============================================================
         3. MAIN 3-COLUMN LAYOUT (PROPORTIONED: Left 3 cols, Center 5 cols, Right 4 cols)
         ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ------------------------------------------------------------
           LEFT COLUMN: DRIVERS PANEL (lg:col-span-3)
           ------------------------------------------------------------ */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 space-y-3">
          
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">DRIVERS ({driversList.length})</h2>
          </div>

          {/* Search Driver */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search driver or load ID..."
              value={driverSearchQuery}
              onChange={(e) => setDriverSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Driver Status Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-[11px] font-semibold text-slate-500 overflow-x-auto">
            {[
              `All ${driversList.length}`,
              `On Duty ${driversList.filter(d => d.status === 'In Transit' || d.status === 'En Route' || d.status === 'At Pickup').length}`,
              `Delayed ${driversList.filter(d => d.isDelay).length}`,
              `Offline ${driversList.filter(d => d.status === 'Offline').length}`
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveDriverTab(tab)}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  activeDriverTab === tab || (activeDriverTab === 'All' && tab.startsWith('All')) ? 'text-blue-600 border-b-2 border-blue-600 pb-2 -mb-[9px]' : 'hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Driver Cards List */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredDrivers.map((drv) => {
              const isSelected = drv.id === selectedDriverId;
              return (
                <div
                  key={drv.id}
                  onClick={() => {
                    setSelectedDriverId(drv.id);
                    setShowDriverPanel(true);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-left space-y-2 ${
                    isSelected 
                      ? 'bg-blue-50/70 border-blue-300 shadow-2xs font-medium' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img 
                          src={drv.avatar} 
                          alt={drv.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${drv.statusDot}`} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-none">{drv.name}</h4>
                        <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">{drv.loadId}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold border ${drv.statusStyle}`}>
                      {drv.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700 pt-1 border-t border-slate-100">
                    <span>{drv.routeFrom} → {drv.routeTo}</span>
                    <span className="text-[9.5px] text-slate-400 font-semibold">{drv.lastUpdate}</span>
                  </div>

                  {drv.isDelay && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 p-1 rounded">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{drv.etaDelay}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => triggerToast('Viewing all 18 registered drivers...')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            View all drivers
          </button>

        </div>

        {/* ------------------------------------------------------------
           CENTER COLUMN: INTERACTIVE MAP & ON-ROAD SUMMARY (lg:col-span-5 or 9)
           ------------------------------------------------------------ */}
        <div className={`${showDriverPanel ? 'lg:col-span-5' : 'lg:col-span-9'} space-y-4 transition-all duration-300`}>
          
          {/* Map Card Container (Height Reduced to 340px for compact clean view) */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden relative">
            
            {/* Top Map Bar: Mode Toggle */}
            <div className="p-2.5 border-b border-slate-100 flex justify-between items-center bg-white relative z-20">
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button 
                  onClick={() => setMapMode('Map')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    mapMode === 'Map' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Map
                </button>
                <button 
                  onClick={() => setMapMode('Satellite')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    mapMode === 'Satellite' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Satellite
                </button>
              </div>
            </div>

            {/* Main Map Canvas Area (340px compact height) */}
            <div className="h-[340px] w-full relative">
              <div ref={mapContainerRef} className="w-full h-full" />

              {/* Left Overlay Control Toolbar */}
              <div className="absolute left-3 top-3 z-[400] bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200 shadow-lg p-1 space-y-0.5 w-34 text-left">
                <button 
                  onClick={() => triggerToast(`Tracking driver ${selectedDriver.name}...`)}
                  className="w-full px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                  <span>Track Driver</span>
                </button>

                <button 
                  onClick={() => triggerToast('Live Map View Active')}
                  className="w-full px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Live Map</span>
                </button>

                <button 
                  onClick={() => triggerToast('Opening route overview...')}
                  className="w-full px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Open Route</span>
                </button>

                <button 
                  onClick={() => triggerToast('Fetching GPS breadcrumb history...')}
                  className="w-full px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-purple-600" />
                  <span>View History</span>
                </button>

                <button 
                  onClick={() => triggerToast('GPS refreshed...')}
                  className="w-full px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
                  <span>Refresh GPS</span>
                </button>

                <button 
                  onClick={() => triggerToast('Toggling live traffic overlay...')}
                  className="w-full px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-amber-600" />
                  <span>Traffic Overlay</span>
                </button>

                <button 
                  onClick={() => triggerToast('Opening geofence zones...')}
                  className="w-full px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>Geofences</span>
                </button>

                <button 
                  onClick={() => triggerToast('Fetching weather radar...')}
                  className="w-full px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Weather</span>
                </button>

                <button 
                  onClick={() => triggerToast('Entering fullscreen map mode...')}
                  className="w-full px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Full Screen</span>
                </button>
              </div>

              {/* Bottom Right Map Status Legend Box */}
              <div className="absolute right-3 bottom-3 z-[400] bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200 shadow-lg p-2.5 w-32 text-left space-y-1">
                <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider block border-b border-slate-100 pb-1">STATUS LEGEND</span>
                <div className="space-y-0.5 text-[9.5px] font-bold text-slate-700">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span>In Transit</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600" /><span>En Route</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /><span>At Pickup</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /><span>At Delivery</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /><span>Delayed</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" /><span>Offline</span></div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom On-Road Summary Table Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">ON ROAD SUMMARY</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-2 px-2">Load ID</th>
                    <th className="py-2 px-2">Driver</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Route</th>
                    <th className="py-2 px-2">Vehicle / Trailer</th>
                    <th className="py-2 px-2">Last Update</th>
                    <th className="py-2 px-2">ETA Next Stop</th>
                    <th className="py-2 px-2">ETA Delivery</th>
                    <th className="py-2 px-2">Progress</th>
                    <th className="py-2 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {summaryLoads.map((row) => (
                    <tr key={row.loadId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-2 font-bold text-blue-600 whitespace-nowrap">{row.loadId}</td>
                      <td className="py-2 px-2 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <img src={row.avatar} alt={row.driver} className="w-5 h-5 rounded-full object-cover" />
                          <span className="font-semibold text-slate-800">{row.driver}</span>
                        </div>
                      </td>
                      <td className="py-2 px-2 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${row.statusStyle}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-700 font-semibold whitespace-nowrap">{row.route}</td>
                      <td className="py-2 px-2 text-slate-600 text-[11px] whitespace-nowrap">{row.vehicle}</td>
                      <td className="py-2 px-2 text-slate-500 text-[11px] whitespace-nowrap">{row.lastUpdate}</td>
                      <td className="py-2 px-2 text-slate-700 text-[11px] font-bold whitespace-nowrap">{row.etaNext}</td>
                      <td className="py-2 px-2 text-slate-700 text-[11px] whitespace-nowrap">{row.etaDelivery}</td>
                      <td className="py-2 px-2 text-slate-500 font-bold whitespace-nowrap">{row.progressStep}</td>
                      <td className="py-2 px-2 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 text-slate-500">
                          <button onClick={() => triggerToast(`Calling ${row.driver}...`)} className="p-1 hover:bg-slate-100 rounded cursor-pointer"><Phone className="w-3 h-3" /></button>
                          <button onClick={() => triggerToast(`Viewing ${row.loadId}...`)} className="p-1 hover:bg-slate-100 rounded cursor-pointer"><Eye className="w-3 h-3" /></button>
                          <button onClick={() => triggerToast(`Menu for ${row.loadId}`)} className="p-1 hover:bg-slate-100 rounded cursor-pointer"><MoreVertical className="w-3 h-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-1">
              <button 
                onClick={() => triggerToast('Navigating to full Active Loads list...')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View full list →</span>
              </button>
            </div>

          </div>

        </div>

        {/* ------------------------------------------------------------
           RIGHT COLUMN: SELECTED DRIVER DETAIL PANEL (lg:col-span-4)
           Expanded width & Spacing for clean non-squished presentation!
           ------------------------------------------------------------ */}
        {showDriverPanel && (
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5 space-y-4 text-left">
            
            {/* Header Title */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">SELECTED DRIVER</h3>
              <button 
                onClick={() => setShowDriverPanel(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

          {/* Driver Header Box */}
          <div className="flex items-start justify-between gap-4 pb-2">
            <div className="flex items-start gap-3.5 min-w-0">
              {/* Avatar with Green Dot */}
              <div className="relative shrink-0">
                <img 
                  src={selectedDriver.avatar} 
                  alt={selectedDriver.name} 
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>

              {/* Driver Text Info */}
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900 leading-tight whitespace-nowrap">{selectedDriver.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${selectedDriver.statusStyle}`}>
                    {selectedDriver.status}
                  </span>
                </div>

                {/* Load ID Gray Badge */}
                <div className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                  {selectedDriver.loadId}
                </div>

                <div className="text-xs font-semibold text-slate-500 truncate">{selectedDriver.customer}</div>
                <div className="text-xs font-semibold text-slate-700">{selectedDriver.routeFrom} → {selectedDriver.routeTo}</div>
              </div>
            </div>

            {/* Top Right Message & Call Icon Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button 
                onClick={() => handleOpenSendLocationModal(selectedDriver.id)}
                className="w-8.5 h-8.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer shadow-2xs"
                title="Send Location to Driver"
              >
                <Navigation className="w-4 h-4" />
              </button>
              <button 
                onClick={() => triggerToast(`Messaging ${selectedDriver.name}...`)}
                className="w-8.5 h-8.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer shadow-2xs"
                title="Message Driver"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button 
                onClick={() => triggerToast(`Calling ${selectedDriver.name}...`)}
                className="w-8.5 h-8.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer shadow-2xs"
                title="Call Driver"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metrics Grid Row (Speed, Heading, Last Update, To Destination) */}
          <div className="grid grid-cols-4 gap-3 text-center py-3 border-y border-slate-100">
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">{selectedDriver.speed}</span>
              <span className="text-[10.5px] text-slate-400 font-semibold block mt-0.5">Speed</span>
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">{selectedDriver.heading}</span>
              <span className="text-[10.5px] text-slate-400 font-semibold block mt-0.5">Heading</span>
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">{selectedDriver.lastUpdate}</span>
              <span className="text-[10.5px] text-slate-400 font-semibold block mt-0.5">Last Update</span>
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">{selectedDriver.toDest}</span>
              <span className="text-[10.5px] text-slate-400 font-semibold block mt-0.5">To Destination</span>
            </div>
          </div>

          {/* Sub-tabs Navigation */}
          <div className="flex items-center gap-4.5 border-b border-slate-200 pb-2 text-xs font-semibold text-slate-500 overflow-x-auto">
            {['Route & Stops', 'Load Info', 'Vehicle', 'Documents', 'Notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveDetailsTab(tab)}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  activeDetailsTab === tab 
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-2 -mb-[9px] font-bold' 
                    : 'hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Route & Stops */}
          {activeDetailsTab === 'Route & Stops' && (
            <div className="space-y-4 pt-1 animate-fadeIn">
              <div className="relative pl-6 space-y-4.5">
                {/* Connecting Vertical Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" />

                {/* Stop 1 */}
                <div className="relative flex justify-between items-start">
                  <span className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white z-10" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Melbourne Depot</h5>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Departed: 23 May 2026, 08:00 AM</p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Stop 2 */}
                <div className="relative flex justify-between items-start">
                  <span className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white z-10" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Pickles Auctions</h5>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">23 May 2026, 09:30 AM</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
                    Completed
                  </span>
                </div>

                {/* Stop 3 */}
                <div className="relative flex justify-between items-start">
                  <span className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-100 z-10" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">BMW Australia</h5>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">23 May 2026, 05:00 PM</p>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-200">
                    In Transit
                  </span>
                </div>

                {/* Stop 4 */}
                <div className="relative flex justify-between items-start">
                  <span className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white z-10" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Geelong Customer</h5>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">23 May 2026, 05:45 PM</p>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded border border-slate-200">
                    Pending
                  </span>
                </div>
              </div>

              {/* View Full Route Button */}
              <button 
                onClick={() => triggerToast('Opening full interactive route map...')}
                className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-blue-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>View Full Route</span>
              </button>
            </div>
          )}

          {/* Tab 2: Load Info */}
          {activeDetailsTab === 'Load Info' && (
            <div className="space-y-3 pt-1 animate-fadeIn">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-extrabold text-blue-700">{selectedDriver.loadId}</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">Car Carrying</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-medium block">Customer</span>
                    <span className="font-bold text-slate-800">{selectedDriver.customer || 'BMW Australia'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Rate</span>
                    <span className="font-bold text-emerald-600">$3,850.00</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Route</span>
                    <span className="font-bold text-slate-800">{selectedDriver.routeFrom} ➔ {selectedDriver.routeTo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Cargo Weight</span>
                    <span className="font-bold text-slate-800">24,500 kg</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[11px] space-y-1">
                <span className="font-bold text-indigo-900 block">Dispatch Notes:</span>
                <p className="text-indigo-700 font-medium">Priority delivery. Contact site manager 30 mins prior to arrival.</p>
              </div>
            </div>
          )}

          {/* Tab 3: Vehicle */}
          {activeDetailsTab === 'Vehicle' && (
            <div className="space-y-3 pt-1 animate-fadeIn">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-900">TRK-309 | Scania R580</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">Optimal</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-medium block">Speed & Heading</span>
                    <span className="font-bold text-slate-800">{selectedDriver.speed} ({selectedDriver.heading})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Fuel Level</span>
                    <span className="font-bold text-emerald-600">82% (Full Tank)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Odometer</span>
                    <span className="font-bold text-slate-800">184,320 km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Engine Temp</span>
                    <span className="font-bold text-slate-800">88°C (Normal)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <span className="font-bold text-emerald-800">Maintenance Status</span>
                <span className="text-[11px] font-semibold text-emerald-700">Next service in 4,200 km</span>
              </div>
            </div>
          )}

          {/* Tab 4: Documents */}
          {activeDetailsTab === 'Documents' && (
            <div className="space-y-2 pt-1 animate-fadeIn text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Bill of Lading (BOL-1092)</span>
                    <span className="text-[10px] text-slate-400">PDF • Signed & Verified</span>
                  </div>
                </div>
                <button onClick={() => triggerToast('Downloading BOL document...')} className="text-blue-600 hover:text-blue-800 text-[11px] font-bold">Download</button>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Consignment Note</span>
                    <span className="text-[10px] text-slate-400">CN-8810 • 850 KB</span>
                  </div>
                </div>
                <button onClick={() => triggerToast('Viewing Consignment Note...')} className="text-blue-600 hover:text-blue-800 text-[11px] font-bold">View</button>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Proof of Delivery (POD)</span>
                    <span className="text-[10px] text-amber-600 font-semibold">Pending Delivery Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Notes */}
          {activeDetailsTab === 'Notes' && (
            <div className="space-y-3 pt-1 animate-fadeIn text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Dispatcher Note</span>
                  <span className="text-[10px] text-slate-400">09:30 AM today</span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-snug">Driver notified regarding site access rules at Geelong customer facility.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Driver Check-in Log</span>
                  <span className="text-[10px] text-slate-400">08:00 AM today</span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-snug">Departed Melbourne Depot. All seals verified and secure.</p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="text" 
                  placeholder="Type a new dispatcher note..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                />
                <button 
                  onClick={() => triggerToast('Note saved successfully!')} 
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-2xs"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* LATEST EVENTS Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">LATEST EVENTS</h4>
            
            <div className="space-y-2 text-xs">
              {(driverEventsMap[selectedDriver.id] || [
                { id: 1, title: 'Departed Melbourne Depot', time: '23 May 2026, 08:00 AM', status: 'completed' },
                { id: 2, title: 'Arrived at Pickles Auctions', time: '23 May 2026, 09:15 AM', status: 'completed' },
                { id: 3, title: 'Departed Pickles Auctions', time: '23 May 2026, 09:45 AM', status: 'completed' },
                { id: 4, title: 'On the way to BMW Australia', time: '23 May 2026, 11:05 AM', status: 'active' }
              ]).map((ev) => (
                <div key={ev.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${ev.title.includes('Dispatched') ? 'bg-blue-600 animate-pulse' : ev.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <span className="font-semibold text-slate-800">{ev.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{ev.time}</span>
                </div>
              ))}
            </div>

            {/* View GPS History Button */}
            <button 
              onClick={() => triggerToast('Fetching complete GPS telemetry log...')}
              className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-blue-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <span>View GPS History</span>
            </button>
          </div>

        </div>
        )}

      </div>

      {/* ============================================================
         SEND LOCATION TO DRIVER MODAL (COMPACT SINGLE VIEWPORT - NO SCROLL)
         ============================================================ */}
      {isSendLocationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[999] flex items-center justify-center p-3 overflow-hidden">
          <div className="bg-white w-full max-w-[480px] rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-fadeIn text-left">
            
            {/* Modal Header */}
            <div className="px-4 py-2.5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600 rounded-lg">
                  <Send className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight">Send Location to Driver</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Dispatch real-time GPS coordinates & navigation link</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsSendLocationModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSendLocationSubmit} className="p-3.5 space-y-2.5 text-xs font-medium text-slate-700">
              
              {/* Select Target Driver */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Target Driver</label>
                </div>
                <select 
                  value={locationFormData.driverId}
                  onChange={(e) => setLocationFormData(prev => ({ ...prev, driverId: e.target.value }))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer text-xs"
                >
                  {driversList.map(drv => (
                    <option key={drv.id} value={drv.id}>
                      {drv.name} ({drv.loadId}) - {drv.status}
                    </option>
                  ))}
                </select>

                {/* Compact Driver Banner */}
                {(() => {
                  const currentDrv = driversList.find(d => d.id === locationFormData.driverId) || selectedDriver;
                  return (
                    <div className="p-1.5 bg-blue-50/70 border border-blue-200/80 rounded-lg flex items-center justify-between gap-2 mt-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={currentDrv.avatar} alt={currentDrv.name} className="w-6 h-6 rounded-full object-cover border border-blue-200 shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-slate-900 text-[11px] mr-1.5">{currentDrv.name}</span>
                          <span className="text-[10px] text-blue-700 font-semibold">{currentDrv.loadId} ({currentDrv.routeFrom} ➔ {currentDrv.routeTo})</span>
                        </div>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 ${currentDrv.statusStyle}`}>
                        {currentDrv.status}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Waypoint Presets */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Destination Presets</label>
                <div className="flex flex-wrap gap-1">
                  {locationPresets.map((preset) => {
                    const isSelected = locationFormData.presetName === preset.name;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`px-2 py-0.5 rounded-md border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Address / Location Details */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Target Address</label>
                <div className="relative">
                  <MapPin className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={locationFormData.address}
                    onChange={(e) => setLocationFormData(prev => ({ ...prev, address: e.target.value, presetName: '' }))}
                    placeholder="Enter street address or landmark..."
                    className="w-full pl-7 pr-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Latitude & Longitude (Single Row Grid) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-500 mb-0.5 block">Latitude</label>
                  <input 
                    type="text"
                    value={locationFormData.lat}
                    onChange={(e) => setLocationFormData(prev => ({ ...prev, lat: e.target.value }))}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-500 mb-0.5 block">Longitude</label>
                  <input 
                    type="text"
                    value={locationFormData.lng}
                    onChange={(e) => setLocationFormData(prev => ({ ...prev, lng: e.target.value }))}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Special Dispatch Instructions */}
              <div className="space-y-0.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Driver Instructions</label>
                <textarea 
                  rows={1}
                  value={locationFormData.notes}
                  onChange={(e) => setLocationFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Special instructions for arrival or gate contact..."
                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs resize-none"
                />
              </div>

              {/* Notification Channel Selection (4 Pills in 1 Row) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Channel</label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: 'App Push + SMS', label: 'Push + SMS' },
                    { id: 'App Only', label: 'App Only' },
                    { id: 'WhatsApp Dispatch', label: 'WhatsApp' },
                    { id: 'All Channels', label: 'Broadcast' }
                  ].map(item => (
                    <button 
                      key={item.id}
                      type="button"
                      onClick={() => setLocationFormData(prev => ({ ...prev, channel: item.id }))}
                      className={`py-1 px-1.5 rounded-lg border text-[10px] font-bold truncate transition-all cursor-pointer text-center ${
                        locationFormData.channel === item.id 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkbox toggles (Inline Row) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-[10.5px] font-semibold text-slate-700">
                  <input 
                    type="checkbox"
                    checked={locationFormData.includeNav}
                    onChange={(e) => setLocationFormData(prev => ({ ...prev, includeNav: e.target.checked }))}
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Attach Turn-by-Turn Nav Link</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[10.5px] font-semibold text-slate-700">
                  <input 
                    type="checkbox"
                    checked={locationFormData.reqAck}
                    onChange={(e) => setLocationFormData(prev => ({ ...prev, reqAck: e.target.checked }))}
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Require Confirmation</span>
                </label>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsSendLocationModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Location Now</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
