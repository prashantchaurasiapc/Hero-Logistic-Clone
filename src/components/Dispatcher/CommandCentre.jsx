import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, MapPin, Navigation, Bell, AlertTriangle, Play, 
  CheckCircle2, Siren, ArrowRight, User, ArrowLeft, ArrowUpRight, 
  ShieldAlert, FileText, ChevronRight, MoreVertical, X, Calendar, 
  Clipboard, Camera, PlusCircle, Trash2, Menu, MessageSquare, ChevronDown, Globe,
  RotateCcw, Filter, Wand2, Phone, Mail, Layers, Compass, Eye, Check, Clock, Truck, Box,
  Maximize2, Activity, Sparkles, Share2, Send, History, Flag, RefreshCw, ChevronLeft,
  Users, Container, Shield, Settings, Zap, Target, Info
} from 'lucide-react';
import L from 'leaflet';
import { dispatcherRepository } from '../../services/dispatcherRepository';
import { dispatcherStore } from '../../services/dispatcherStore';
import api from '../../services/api';

export default function CommandCentre() {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'create-console', 'manage-load'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Create Load Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newLoadForm, setNewLoadForm] = useState({
    customer: '',
    status: 'Planned',
    routeFrom: '',
    routeTo: '',
    driver: '',
    vehicle: '',
    reqDate: '',
    reqTime: ''
  });

  // Top Filter Row States
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedDriver, setSelectedDriver] = useState('All Drivers');
  const [selectedCustomer, setSelectedCustomer] = useState('All Customers');
  const [selectedDestination, setSelectedDestination] = useState('All Destinations');
  const [selectedDate, setSelectedDate] = useState('Any Date');
  const [selectedNiche, setSelectedNiche] = useState('All Types');
  const [selectedVehicle, setSelectedVehicle] = useState('All');
  const [selectedWorker, setSelectedWorker] = useState('All');

  // Tab States
  const [activeLoadTab, setActiveLoadTab] = useState('All');
  const [activeDriverTab, setActiveDriverTab] = useState('All');

  // Planning Board Control States
  const [boardView, setBoardView] = useState('Board View');
  const [dayView, setDayView] = useState('Day');
  const getFormattedDate = (d = new Date()) => {
    return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const [kanbanDate, setKanbanDate] = useState(getFormattedDate());

  // Leaflet Map Refs
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const fullMapContainerRef = useRef(null);
  const fullMapRef = useRef(null);
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const [isMapToolsOpen, setIsMapToolsOpen] = useState(false);

  // Active Movements / Master Loads & Fleet state lists
  const [loads, setLoads] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Subscribe to live database updates for Loads, Drivers, and Vehicles
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [loadsRes, driversRes, vehiclesRes] = await Promise.all([
          api.get('/loads').catch(() => ({ data: [] })),
          api.get('/drivers').catch(() => ({ data: [] })),
          api.get('/vehicles').catch(() => ({ data: [] }))
        ]);
        setLoads(loadsRes.data?.data || loadsRes.data || []);
        setDrivers(driversRes.data?.data || driversRes.data || []);
        setVehicles(vehiclesRes.data?.data || vehiclesRes.data || []);
      } catch (error) {
        console.error('Error fetching command centre data:', error);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  // Live computed load & fleet metrics from database (normalized for uppercase DB statuses)
  const activeLoadsCount = loads.filter(l => {
    const s = String(l.status || '').toUpperCase().replace(/[\s-]/g, '_');
    return s === 'IN_TRANSIT' || s === 'ACTIVE' || s === 'ON_THE_ROAD';
  }).length;

  const plannedLoadsCount = loads.filter(l => {
    const s = String(l.status || '').toUpperCase().replace(/[\s-]/g, '_');
    return s === 'PLANNED' || s === 'PENDING' || s === 'PENDING_DISPATCH' || s === 'SCHEDULED' || s === 'READY_FOR_PICKUP';
  }).length;

  const completedLoadsCount = loads.filter(l => {
    const s = String(l.status || '').toUpperCase().replace(/[\s-]/g, '_');
    return s === 'COMPLETED' || s === 'DELIVERED';
  }).length;

  const delayedLoadsCount = loads.filter(l => {
    const s = String(l.status || '').toUpperCase().replace(/[\s-]/g, '_');
    return s === 'DELAYED' || s === 'ISSUE' || s === 'FLAGGED';
  }).length;

  const availableDriversCount = drivers.filter(d => 
    ['On Duty', 'AVAILABLE', 'ACTIVE', 'En Route', 'On Shift'].includes(d.status) || !d.status
  ).length;

  const availableTrucksCount = vehicles.filter(v => {
    const isTrailer = v.category === 'TRAILER' || 
      ['Trailer', 'Car Trailer'].includes(v.type) || 
      String(v.type || '').toLowerCase().includes('trailer') ||
      String(v.regType || '').toLowerCase().includes('trailer');
    return !isTrailer && (v.status === 'IDLE' || v.status === 'ACTIVE' || !v.status);
  }).length;

  const availableTrailersCount = vehicles.filter(v => {
    const isTrailer = v.category === 'TRAILER' || 
      ['Trailer', 'Car Trailer'].includes(v.type) || 
      String(v.type || '').toLowerCase().includes('trailer') ||
      String(v.regType || '').toLowerCase().includes('trailer');
    return isTrailer && (!v.assignedTruckId || v.status === 'IDLE');
  }).length;

  // Handle Create Load Submit
  const handleCreateLoadSubmit = async (e) => {
    e.preventDefault();
    const created = await dispatcherRepository.createLoad(newLoadForm);
    setIsCreateModalOpen(false);
    if (created) {
      triggerToast(`Load ${created.loadRef} created and dispatched successfully!`);
    }
  };

  // Dynamic computed Kanban Depots from active loads state
  const getKanbanDepots = () => {
    const columns = {
      'SYDNEY DEPOT': { count: 0, cards: [] },
      'MELBOURNE DEPOT': { count: 0, cards: [] },
      'BRISBANE DEPOT': { count: 0, cards: [] },
      'ADELAIDE DEPOT': { count: 0, cards: [] }
    };

    loads.forEach(l => {
      const pickup = l.stops?.find(s => s.type === 'PICKUP') || l.stops?.[0];
      const drop = l.stops?.slice().reverse().find(s => s.type === 'DELIVERY' || s.type === 'DROP') || l.stops?.[l.stops?.length - 1];
      const startLoc = l.routeFrom || pickup?.city || pickup?.address?.split(',')?.[0] || l.originCity || 'Sydney Depot';
      const endLoc = l.routeTo || drop?.city || drop?.address?.split(',')?.[0] || l.destCity || 'Melbourne Depot';

      const fromStr = String(startLoc).toLowerCase();
      const toStr = String(endLoc).toLowerCase();

      let depot = 'SYDNEY DEPOT';
      if (fromStr.includes('melbourne') || toStr.includes('melbourne')) depot = 'MELBOURNE DEPOT';
      else if (fromStr.includes('brisbane') || toStr.includes('brisbane')) depot = 'BRISBANE DEPOT';
      else if (fromStr.includes('adelaide') || toStr.includes('adelaide')) depot = 'ADELAIDE DEPOT';
      else if (l.branch?.name && columns[`${l.branch.name.toUpperCase()} DEPOT`]) {
        depot = `${l.branch.name.toUpperCase()} DEPOT`;
      }

      const norm = String(l.status || '').toUpperCase().replace(/[\s-]/g, '_');
      let borderStyle = 'border-l-blue-500';
      let statusStyle = 'bg-blue-50 text-blue-700';
      let statusLabel = 'Pending Dispatch';

      if (norm === 'IN_TRANSIT' || norm === 'ACTIVE') {
        borderStyle = 'border-l-emerald-500';
        statusStyle = 'bg-emerald-50 text-emerald-700';
        statusLabel = 'In Transit';
      } else if (norm === 'DELAYED') {
        borderStyle = 'border-l-rose-500';
        statusStyle = 'bg-rose-50 text-rose-700';
        statusLabel = 'Delayed';
      } else if (norm === 'DELIVERED' || norm === 'COMPLETED') {
        borderStyle = 'border-l-purple-500';
        statusStyle = 'bg-purple-50 text-purple-700';
        statusLabel = 'Delivered';
      } else if (norm === 'CANCELLED') {
        borderStyle = 'border-l-slate-400';
        statusStyle = 'bg-slate-100 text-slate-600';
        statusLabel = 'Cancelled';
      } else if (norm === 'PLANNED') {
        borderStyle = 'border-l-amber-500';
        statusStyle = 'bg-amber-50 text-amber-700';
        statusLabel = 'Planned';
      }

      const custName = typeof l.customer === 'object' ? (l.customer?.name || l.customer?.companyName || 'Customer') : (l.customer || 'Customer');
      const drvName = typeof l.driver === 'object' ? (l.driver?.name || `${l.driver?.firstName || ''} ${l.driver?.lastName || ''}`.trim() || 'Driver') : (l.driver || 'Driver');
      const loadRefId = l.loadRef || `LD-${(l.id || '').substring(0, 8).toUpperCase()}`;
      const unitsCount = l.items?.length || l.vehicles?.length || 1;
      const displayDate = l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' }) : 'Today';

      columns[depot].cards.push({
        id: loadRefId,
        rawId: l.id,
        status: statusLabel,
        statusStyle,
        borderStyle,
        customer: custName,
        routeFrom: startLoc,
        routeTo: endLoc,
        driverDate: `${displayDate} • ${drvName}`,
        cargoUnits: unitsCount
      });
      columns[depot].count++;
    });

    return columns;
  };

  const kanbanDepots = getKanbanDepots();

  // Create Load Form States
  const [customerRef, setCustomerRef] = useState('PO-12345');
  
  // Stops list state
  const [stops, setStops] = useState([
    { id: 1, type: 'Pickup', address: '', contact: '', phone: '', time: '' },
    { id: 2, type: 'Drop', address: '', contact: '', phone: '', time: '' }
  ]);

  // Declared items list state
  const [declaredItems, setDeclaredItems] = useState([
    { id: 1, client: 'Acme Corp', pickupStop: 'Stop #1: Pickup (No Address)', dropStop: 'Stop #2: Drop (No Address)', desc: '', weight: '' }
  ]);

  // Manage and Modal States
  const [selectedLoadId, setSelectedLoadId] = useState('LD-10583');
  const [customerLoadNo, setCustomerLoadNo] = useState('ACME-221');
  const [originLocation, setOriginLocation] = useState('Sydney Depot');
  const [finalDestination, setFinalDestination] = useState('Melbourne Branch');
  const [priorityStatus, setPriorityStatus] = useState('HIGH');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSelectedBranch('All Branches');
    setSelectedStatus('All Statuses');
    setSelectedDriver('All Drivers');
    setSelectedCustomer('All Customers');
    setSelectedDestination('All Destinations');
    setSelectedDate('Any Date');
    setSelectedNiche('All Types');
    setSelectedVehicle('All');
    setSelectedWorker('All');
    setSearchQuery('');
    setActiveLoadTab('All');
    setActiveDriverTab('All');
    triggerToast('Filters reset to default.');
  };

  // Leaflet Map Setup (Card View)
  useEffect(() => {
    if (view !== 'dashboard' || !mapContainerRef.current) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [-31.2, 149.2],
      zoom: 6,
      zoomControl: false
    });
    mapRef.current = map;

    // Clean OpenStreetMap tile layer (no watermark, free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Route polyline (East Coast Logistics Hubs)
    const routeCoords = [
      [-27.4698, 153.0251], // Brisbane
      [-28.0167, 153.4000], // Gold Coast
      [-32.9283, 151.7817], // Newcastle
      [-33.8688, 151.2093], // Sydney
      [-35.2809, 149.1300], // Canberra
      [-37.8136, 144.9631]  // Melbourne
    ];

    L.polyline(routeCoords, {
      color: '#2563eb',
      weight: 3,
      dashArray: '6, 8',
      opacity: 0.7
    }).addTo(map);

    // Live Vehicle Callout Markers based on active movements
    const activeLoads = loads.filter(l => ['IN_TRANSIT', 'ACTIVE'].includes(String(l.status || '').toUpperCase()));
    const vehicleMarkers = (activeLoads.length > 0 ? activeLoads : loads.filter(l => l.status !== 'CANCELLED').slice(0, 3)).map((activeLoad, index) => {
      const d = activeLoad.driver || drivers.find(drv => drv.id === activeLoad.driverId) || {};
      const driverName = (typeof d === 'object' ? `${d.firstName || ''} ${d.lastName || ''}`.trim() || d.driverCode || d.name : d) || 'Assigned Driver';
      const vehicleName = activeLoad.truck ? `${activeLoad.truck.make || ''} ${activeLoad.truck.model || ''}`.trim() || activeLoad.truck.rego : (activeLoad.vehicle || 'Active Fleet');
      const loadRefId = activeLoad.loadRef || `LD-${(activeLoad.id || '').substring(0, 8).toUpperCase()}`;

      const baseLat = index % 2 === 0 ? -33.8688 : -37.8136;
      const baseLng = index % 2 === 0 ? 151.2093 : 144.9631;
      const latOffset = (index * 0.12) % 0.5;
      const lngOffset = (index * 0.08) % 0.5;

      let badgeBg = '#16a34a'; // Emerald
      const s = String(activeLoad.status || '').toUpperCase();
      if (s === 'DELAYED') badgeBg = '#ea580c';
      else if (s === 'PLANNED') badgeBg = '#2563eb';
      else if (s === 'CANCELLED') badgeBg = '#dc2626';

      return {
        id: loadRefId,
        driver: driverName,
        vehicle: vehicleName,
        speed: `${68 + (index * 4) % 20} km/h`,
        lat: baseLat + latOffset,
        lng: baseLng + lngOffset,
        badgeBg
      };
    });

    vehicleMarkers.forEach(v => {
      const customHtml = `
        <div style="transform: translate(-50%, -100%); cursor: pointer; position: relative;">
          <div style="background: ${v.badgeBg}; color: white; border-radius: 8px; padding: 5px 9px; box-shadow: 0 4px 14px rgba(0,0,0,0.25); font-family: system-ui, sans-serif; min-width: 110px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 4px; margin-bottom: 1px;">
              <span style="font-size: 10.5px; font-weight: 900;">${v.id}</span>
              <span style="font-size: 9px; font-weight: 700; opacity: 0.95;">${v.speed}</span>
            </div>
            <div style="font-size: 10px; font-weight: 800; line-height: 1.1;">${v.driver}</div>
            <div style="font-size: 8px; font-weight: 600; opacity: 0.9;">${v.vehicle}</div>
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid ${v.badgeBg}; margin: 0 auto;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-vehicle-callout-marker',
        html: customHtml,
        iconSize: [110, 55],
        iconAnchor: [55, 55]
      });

      L.marker([v.lat, v.lng], { icon: customIcon }).addTo(map);
    });

    // Invalidate map size after DOM mount
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 300);

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [view, loads, drivers]);

  // Leaflet Map Setup (Full Screen Maximized View)
  useEffect(() => {
    if (!isMapMaximized || !fullMapContainerRef.current) return;
    if (fullMapRef.current) {
      fullMapRef.current.remove();
      fullMapRef.current = null;
    }

    const fullMap = L.map(fullMapContainerRef.current, {
      center: [-31.2, 149.2],
      zoom: 6,
      zoomControl: false
    });
    fullMapRef.current = fullMap;

    // Clean OpenStreetMap tile layer (no watermark, free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(fullMap);

    const routeCoords = [
      [-27.4698, 153.0251],
      [-28.0167, 153.4000],
      [-32.9283, 151.7817],
      [-33.8688, 151.2093],
      [-35.2809, 149.1300],
      [-37.8136, 144.9631]
    ];

    L.polyline(routeCoords, {
      color: '#2563eb',
      weight: 4,
      dashArray: '6, 8',
      opacity: 0.8
    }).addTo(fullMap);

    // Live Vehicle Callout Markers based on active movements
    const activeLoads = loads.filter(l => ['IN_TRANSIT', 'ACTIVE'].includes(String(l.status || '').toUpperCase()));
    const vehicleMarkers = (activeLoads.length > 0 ? activeLoads : loads.filter(l => l.status !== 'CANCELLED').slice(0, 3)).map((activeLoad, index) => {
      const d = activeLoad.driver || drivers.find(drv => drv.id === activeLoad.driverId) || {};
      const driverName = (typeof d === 'object' ? `${d.firstName || ''} ${d.lastName || ''}`.trim() || d.driverCode || d.name : d) || 'Assigned Driver';
      const vehicleName = activeLoad.truck ? `${activeLoad.truck.make || ''} ${activeLoad.truck.model || ''}`.trim() || activeLoad.truck.rego : (activeLoad.vehicle || 'Active Fleet');
      const loadRefId = activeLoad.loadRef || `LD-${(activeLoad.id || '').substring(0, 8).toUpperCase()}`;

      const baseLat = index % 2 === 0 ? -33.8688 : -37.8136;
      const baseLng = index % 2 === 0 ? 151.2093 : 144.9631;
      const latOffset = (index * 0.12) % 0.5;
      const lngOffset = (index * 0.08) % 0.5;

      let badgeBg = '#16a34a'; // Emerald
      const s = String(activeLoad.status || '').toUpperCase();
      if (s === 'DELAYED') badgeBg = '#ea580c';
      else if (s === 'PLANNED') badgeBg = '#2563eb';
      else if (s === 'CANCELLED') badgeBg = '#dc2626';

      return {
        id: loadRefId,
        driver: driverName,
        vehicle: vehicleName,
        speed: `${68 + (index * 4) % 20} km/h`,
        lat: baseLat + latOffset,
        lng: baseLng + lngOffset,
        badgeBg
      };
    });

    vehicleMarkers.forEach(v => {
      const customHtml = `
        <div style="transform: translate(-50%, -100%); cursor: pointer; position: relative;">
          <div style="background: ${v.badgeBg}; color: white; border-radius: 10px; padding: 7px 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.3); font-family: system-ui, sans-serif; min-width: 130px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 2px;">
              <span style="font-size: 11px; font-weight: 900;">${v.id}</span>
              <span style="font-size: 10px; font-weight: 800; opacity: 0.95;">${v.speed}</span>
            </div>
            <div style="font-size: 11px; font-weight: 800; line-height: 1.1;">${v.driver}</div>
            <div style="font-size: 9px; font-weight: 600; opacity: 0.9;">${v.vehicle}</div>
          </div>
          <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 9px solid ${v.badgeBg}; margin: 0 auto;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-vehicle-callout-marker-full',
        html: customHtml,
        iconSize: [130, 65],
        iconAnchor: [65, 65]
      });

      L.marker([v.lat, v.lng], { icon: customIcon }).addTo(fullMap);
    });

    const timer = setTimeout(() => {
      if (fullMapRef.current) {
        fullMapRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (fullMapRef.current) {
        fullMapRef.current.remove();
        fullMapRef.current = null;
      }
    };
  }, [isMapMaximized, loads, drivers]);

  // Create Load Handlers
  const handleAddStop = () => {
    const nextId = stops.length + 1;
    setStops([...stops, { id: nextId, type: 'Drop', address: '', contact: '', phone: '', time: '' }]);
    triggerToast('Added route stop.');
  };

  const handleActivateLoad = (e) => {
    e.preventDefault();
    const newLoadId = `LD-${Math.floor(10584 + Math.random() * 50)}`;
    const primaryClient = declaredItems[0]?.client || 'Acme Corp';
    const startPoint = stops[0]?.address || 'Sydney';
    const endPoint = stops[stops.length - 1]?.address || 'Melbourne';

    const newLoad = {
      id: newLoadId,
      customer: primaryClient,
      routeFrom: startPoint,
      routeTo: endPoint,
      status: 'Pending Dispatch',
      date: '25 May 2026',
      vehicle: 'MAN TGX 26.580',
      depot: 'Sydney Depot',
      driver: 'Unassigned',
      itemsCount: declaredItems.length,
      passengers: 1,
      tabCategory: 'Planned'
    };

    setLoads([newLoad, ...loads]);
    setView('dashboard');
    triggerToast(`Load ${newLoadId} created and added to dispatch queue!`);
  };

  // Filtered Loads for Left Panel
  const filteredLoads = loads.filter(load => {
    const getDriverStr = (drv) => {
      if (!drv) return '';
      if (typeof drv === 'string') return drv;
      if (typeof drv === 'object') {
        return drv.name || `${drv.firstName || ''} ${drv.lastName || ''}`.trim() || drv.driverCode || '';
      }
      return String(drv);
    };

    const getCustomerStr = (cust) => {
      if (!cust) return '';
      if (typeof cust === 'string') return cust;
      if (typeof cust === 'object') return cust.name || '';
      return String(cust);
    };

    const getVehicleStr = (vhc) => {
      if (!vhc) return '';
      if (typeof vhc === 'string') return vhc;
      if (typeof vhc === 'object') return `${vhc.make || ''} ${vhc.model || ''}`.trim() || vhc.rego || '';
      return String(vhc);
    };

    const driverStr = getDriverStr(load.driver).toLowerCase();
    const customerStr = getCustomerStr(load.customer).toLowerCase();
    const vehicleStr = getVehicleStr(load.vehicle || load.truck).toLowerCase();
    const loadIdStr = String(load.id || '').toLowerCase();
    const searchQueryStr = searchQuery.toLowerCase();

    const matchesSearch = 
      loadIdStr.includes(searchQueryStr) ||
      customerStr.includes(searchQueryStr) ||
      driverStr.includes(searchQueryStr) ||
      vehicleStr.includes(searchQueryStr);

    const depotStr = (load.depot || load.routeFrom || '').toLowerCase();
    const branchQuery = selectedBranch.replace(' Depot', '').toLowerCase();
    const matchesBranch = selectedBranch === 'All Branches' || depotStr.includes(branchQuery);
    const matchesStatus = selectedStatus === 'All Statuses' || String(load.status || '').toLowerCase() === selectedStatus.toLowerCase();
    const matchesDriver = selectedDriver === 'All Drivers' || (selectedDriver && driverStr.includes(selectedDriver.toLowerCase()));
    const matchesCustomer = selectedCustomer === 'All Customers' || (selectedCustomer && customerStr.includes(selectedCustomer.toLowerCase()));
    const matchesDestination = selectedDestination === 'All Destinations' || String(load.routeTo || '').toLowerCase().includes(selectedDestination.toLowerCase());
    const matchesNiche = selectedNiche === 'All Types' || String(load.type || '').toLowerCase().includes(selectedNiche.toLowerCase());
    const matchesVehicle = selectedVehicle === 'All' || (selectedVehicle && vehicleStr.includes(selectedVehicle.toLowerCase()));

    const normLoadStatus = String(load.status || '').toUpperCase().replace(/[\s-]/g, '_');
    const matchesTab = 
      activeLoadTab === 'All' ? true :
      activeLoadTab === 'Active' ? ['IN_TRANSIT', 'ACTIVE', 'DELAYED'].includes(normLoadStatus) :
      activeLoadTab === 'Planned' ? ['PLANNED', 'PENDING', 'PENDING_DISPATCH', 'READY_FOR_PICKUP'].includes(normLoadStatus) :
      activeLoadTab === 'Completed' ? ['COMPLETED', 'DELIVERED'].includes(normLoadStatus) :
      activeLoadTab === 'On Hold' ? ['ON_HOLD', 'CANCELLED', 'HOLD'].includes(normLoadStatus) : true;

    return matchesSearch && matchesBranch && matchesStatus && matchesDriver && matchesCustomer && matchesDestination && matchesNiche && matchesVehicle && matchesTab;
  });

  // Filtered Drivers for Bottom Section
  const filteredDrivers = drivers.filter(driver => {
    if (selectedWorker !== 'All') {
      if (selectedWorker === 'Shift A' && driver.shift && !driver.shift.toLowerCase().includes('a') && !driver.shift.toLowerCase().includes('morning')) return false;
      if (selectedWorker === 'Shift B' && driver.shift && !driver.shift.toLowerCase().includes('b') && !driver.shift.toLowerCase().includes('evening')) return false;
    }
    const status = driver.status || 'ACTIVE';
    if (activeDriverTab === 'All') return true;
    if (activeDriverTab === 'On Duty') return ['On Duty', 'ACTIVE', 'AVAILABLE', 'On Shift'].includes(status);
    if (activeDriverTab === 'En Route') return status === 'En Route' || status === 'IN_TRANSIT';
    if (activeDriverTab === 'At Pickup') return status === 'At Pickup' || status === 'AT_PICKUP';
    if (activeDriverTab === 'Break') return status === 'Break' || status === 'ON_BREAK';
    if (activeDriverTab === 'Off Duty') return status === 'Off Duty' || status === 'INACTIVE' || status === 'OFF_DUTY';
    if (activeDriverTab === 'Unavailable') return status === 'Unavailable' || status === 'Delayed' || status === 'UNAVAILABLE';
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-5 space-y-4 text-left font-sans antialiased text-slate-800">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {view === 'dashboard' ? (
        <>
          {/* ============================================================
             1. HEADER TITLE ROW & SUMMARY CARDS (8 EQUAL CARDS)
             ============================================================ */}
          <div className="space-y-3">
            {/* Header Title Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dispatch Dashboard</h1>
            </div>

            {/* Summary Cards (8 EQUAL CARDS) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              
              {/* Card 1: Total Loads */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-xs transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10.5px] font-medium text-slate-500 block">Total Loads</span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{loads.length || 0}</h3>
                  <span className="text-[9.5px] font-semibold text-emerald-600 block mt-0.5">Live from database</span>
                </div>
              </div>

              {/* Card 2: Active Loads */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-xs transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 fill-emerald-600" />
                </div>
                <div>
                  <span className="text-[10.5px] font-medium text-slate-500 block">Active Loads</span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {activeLoadsCount}
                  </h3>
                  <span className="text-[9.5px] font-semibold text-emerald-600 block mt-0.5">On the road</span>
                </div>
              </div>

              {/* Card 3: Planned Loads */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-xs transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10.5px] font-medium text-slate-500 block">Planned Loads</span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {plannedLoadsCount}
                  </h3>
                  <span className="text-[9.5px] font-semibold text-amber-600 block mt-0.5">Scheduled</span>
                </div>
              </div>

              {/* Card 4: Completed Today */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-xs transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10.5px] font-medium text-slate-500 block">Completed Today</span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {completedLoadsCount}
                  </h3>
                  <span className="text-[9.5px] font-semibold text-purple-600 block mt-0.5">Delivered</span>
                </div>
              </div>

              {/* Card 5: Delayed Loads */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-xs transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10.5px] font-medium text-slate-500 block">Delayed Loads</span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {delayedLoadsCount}
                  </h3>
                  <span className="text-[9.5px] font-semibold text-rose-600 block mt-0.5">Requires attention</span>
                </div>
              </div>

              {/* Card 6: Available Drivers */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-xs transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10.5px] font-medium text-slate-500 block">Available Drivers</span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {availableDriversCount}
                  </h3>
                  <span className="text-[9.5px] font-semibold text-emerald-600 block mt-0.5">On duty</span>
                </div>
              </div>

              {/* Card 7: Available Trucks */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-xs transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10.5px] font-medium text-slate-500 block">Available Trucks</span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {availableTrucksCount}
                  </h3>
                  <span className="text-[9.5px] font-semibold text-teal-600 block mt-0.5">Ready to go</span>
                </div>
              </div>

              {/* Card 8: Available Trailers */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-xs transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Container className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10.5px] font-medium text-slate-500 block">Available Trailers</span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {availableTrailersCount}
                  </h3>
                  <span className="text-[9.5px] font-semibold text-indigo-600 block mt-0.5">Ready to go</span>
                </div>
              </div>

            </div>

            {/* Filter Row with labels ABOVE select controls */}
            <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs mt-3">
              <div className="flex flex-wrap items-end gap-2">
                
                {/* Branch */}
                <div className="flex-1 min-w-[110px]">
                  <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Branch</label>
                  <select 
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
                  >
                    <option value="All Branches">All Branches</option>
                    <option value="Sydney Depot">Sydney Depot</option>
                    <option value="Melbourne Depot">Melbourne Depot</option>
                    <option value="Brisbane Depot">Brisbane Depot</option>
                    <option value="Adelaide Depot">Adelaide Depot</option>
                  </select>
                </div>

                {/* Status */}
                <div className="flex-1 min-w-[110px]">
                  <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Status</label>
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
                  >
                    <option value="All Statuses">All Statuses</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Pending Dispatch">Pending Dispatch</option>
                    <option value="Planned">Planned</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Driver */}
                <div className="flex-1 min-w-[110px]">
                  <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Driver</label>
                  <select 
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
                  >
                    <option value="All Drivers">All Drivers</option>
                    {drivers.map(d => {
                      const name = `${d.firstName || ''} ${d.lastName || ''}`.trim() || d.driverCode || d.name || 'Driver';
                      return (
                        <option key={d.id} value={name}>{name}</option>
                      );
                    })}
                  </select>
                </div>

                {/* Customer */}
                <div className="flex-1 min-w-[110px]">
                  <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Customer</label>
                  <select 
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
                  >
                    <option value="All Customers">All Customers</option>
                    {Array.from(
                      new Set(
                        loads.map(l => {
                          if (!l.customer) return null;
                          if (typeof l.customer === 'string') return l.customer;
                          if (typeof l.customer === 'object') return l.customer.name || l.customer.companyName || null;
                          return String(l.customer);
                        }).filter(Boolean)
                      )
                    ).map(customerName => (
                      <option key={customerName} value={customerName}>{customerName}</option>
                    ))}
                  </select>
                </div>

                {/* Destination */}
                <div className="flex-1 min-w-[110px]">
                  <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Destination</label>
                  <select 
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
                  >
                    <option value="All Destinations">All Destinations</option>
                    {Array.from(
                      new Set([
                        'Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Perth',
                        ...loads.map(l => {
                          if (!l.routeTo) return null;
                          if (typeof l.routeTo === 'string') return l.routeTo;
                          if (typeof l.routeTo === 'object') return l.routeTo.name || l.routeTo.city || l.routeTo.address || null;
                          return String(l.routeTo);
                        }).filter(Boolean)
                      ])
                    ).map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>

                {/* Required Date */}
                <div className="flex-1 min-w-[110px]">
                  <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Required Date</label>
                  <select 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
                  >
                    <option value="Any Date">Any Date</option>
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="This Week">This Week</option>
                  </select>
                </div>

                {/* Niche Type */}
                <div className="flex-1 min-w-[110px]">
                  <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Niche Type</label>
                  <select 
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
                  >
                    <option value="All Types">All Types</option>
                    <option value="Car Carrying">Car Carrying</option>
                    <option value="General Freight">General Freight</option>
                  </select>
                </div>

                {/* Vehicle / Trailer */}
                <div className="flex-1 min-w-[110px]">
                  <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Vehicle / Trailer</label>
                  <select 
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
                  >
                    <option value="All">All Vehicles</option>
                    {vehicles.map(v => {
                      const label = `${v.rego || v.plate || v.id} – ${v.make || ''} ${v.model || ''}`.trim();
                      return (
                        <option key={v.id} value={v.rego || v.plate || v.make || v.id}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Available Workers */}
                <div className="flex-1 min-w-[110px]">
                  <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Available Workers</label>
                  <select 
                    value={selectedWorker}
                    onChange={(e) => setSelectedWorker(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
                  >
                    <option value="All">All</option>
                    <option value="Shift A">Shift A</option>
                    <option value="Shift B">Shift B</option>
                  </select>
                </div>

                {/* Action Buttons in the SAME row */}
                <div className="flex items-end gap-1.5 shrink-0 ml-auto">
                  <button 
                    onClick={handleResetFilters}
                    className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-medium text-slate-600 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs whitespace-nowrap h-[30px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </button>
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold shadow-xs flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap h-[30px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Load</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* ============================================================
             3. MAIN CONTENT: 3-COLUMN RESPONSIVE LAYOUT
             ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* ------------------------------------------------------------
               LEFT COLUMN: LOADS PANEL (lg:col-span-3)
               ------------------------------------------------------------ */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs p-3.5 flex flex-col justify-between space-y-3">
              <div>
                {/* Header & Tabs */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">LOADS ({filteredLoads.length})</h2>
                </div>

                <div className="flex items-center gap-3 border-b border-slate-200 pb-2 mb-2.5 overflow-x-auto">
                  {['All', 'Active', 'Planned', 'Completed', 'On Hold'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveLoadTab(tab)}
                      className={`text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                        activeLoadTab === tab 
                          ? 'text-blue-600 border-b-2 border-blue-600 pb-1 -mb-[9px]' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Search Box */}
                <div className="relative mb-2.5">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search loads by ID, customer, driver, rego, VIN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-slate-600" />
                </div>

                {/* Scrollable Load Cards List */}
                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {filteredLoads.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <Truck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-xs font-medium text-slate-600">No loads found</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Loads created in the system will appear here.</p>
                    </div>
                  ) : (
                    filteredLoads.map((load) => {
                      const pickup = load.stops?.find(s => s.type === 'PICKUP') || load.stops?.[0];
                      const drop = load.stops?.slice().reverse().find(s => s.type === 'DELIVERY' || s.type === 'DROP') || load.stops?.[load.stops?.length - 1];
                      const originCity = load.routeFrom || pickup?.city || pickup?.address?.split(',')?.[0] || load.originCity || 'Sydney Depot';
                      const destCity = load.routeTo || drop?.city || drop?.address?.split(',')?.[0] || load.destCity || 'Melbourne Depot';
                      const loadRef = load.loadRef || `LD-${(load.id || '').substring(0, 8).toUpperCase()}`;
                      const customerName = (typeof load.customer === 'object' ? load.customer?.name : load.customer) || 'Commercial Freight';
                      const vehicleName = load.truck 
                        ? `${load.truck.make || ''} ${load.truck.model || ''} (${load.truck.rego || load.truck.plate})`.trim()
                        : (load.vehicle || (load.trailer ? `Trailer (${load.trailer.rego})` : 'Fleet Pending'));
                      const loadDate = load.createdAt ? new Date(load.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' }) : (load.date || 'Today');

                      const norm = String(load.status || '').toUpperCase().replace(/[\s-]/g, '_');
                      let statusBadgeClass = 'bg-slate-100 text-slate-700 border border-slate-200';
                      let statusText = load.status || 'Active';

                      if (norm === 'IN_TRANSIT' || norm === 'ACTIVE') {
                        statusBadgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                        statusText = 'In Transit';
                      } else if (norm === 'PENDING_DISPATCH' || norm === 'READY_FOR_PICKUP') {
                        statusBadgeClass = 'bg-blue-50 text-blue-700 border border-blue-200';
                        statusText = 'Pending Dispatch';
                      } else if (norm === 'PLANNED') {
                        statusBadgeClass = 'bg-amber-50 text-amber-700 border border-amber-200';
                        statusText = 'Planned';
                      } else if (norm === 'DELIVERED' || norm === 'COMPLETED') {
                        statusBadgeClass = 'bg-purple-50 text-purple-700 border border-purple-200';
                        statusText = 'Delivered';
                      } else if (norm === 'DELAYED') {
                        statusBadgeClass = 'bg-rose-50 text-rose-700 border border-rose-200';
                        statusText = 'Delayed';
                      } else if (norm === 'CANCELLED') {
                        statusBadgeClass = 'bg-slate-100 text-slate-600 border border-slate-200';
                        statusText = 'Cancelled';
                      }

                      return (
                        <div 
                          key={load.id}
                          onClick={() => {
                            setSelectedLoadId(load.id);
                            setView('manage-load');
                          }}
                          className="p-2.5 border border-slate-200/80 rounded-lg bg-white hover:border-blue-300 hover:shadow-2xs transition-all cursor-pointer text-left space-y-1"
                        >
                          <div className="flex justify-between items-center gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xs font-bold text-slate-900 whitespace-nowrap">{loadRef}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold whitespace-nowrap shrink-0 ${statusBadgeClass}`}>
                                {statusText}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[9.5px] text-slate-400 font-medium whitespace-nowrap">{loadDate}</span>
                              <button className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer">
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-[11.5px] font-semibold text-slate-800 truncate" title={customerName}>{customerName}</div>

                          <div className="flex items-center gap-1 text-[11px] text-slate-600">
                            <span className="truncate max-w-[105px]">{originCity}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[105px]">{destCity}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                            <Truck className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{vehicleName}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* View All Footer Link */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto cursor-pointer">
                  <span>View all loads</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------
               CENTER COLUMN: PLANNING BOARD (lg:col-span-5)
               ------------------------------------------------------------ */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs p-3.5 flex flex-col justify-between space-y-3">
              <div>
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2.5">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">PLANNING BOARD</h2>

                  <div className="flex flex-wrap items-center gap-1">
                    <select 
                      value={boardView}
                      onChange={(e) => setBoardView(e.target.value)}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="Board View">Board View</option>
                      <option value="List View">List View</option>
                    </select>

                    <select 
                      value={dayView}
                      onChange={(e) => setDayView(e.target.value)}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="Day">Day</option>
                      <option value="Week">Week</option>
                    </select>

                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-1 text-[11px] font-medium text-slate-700">
                      <ChevronLeft className="w-3 h-3 cursor-pointer text-slate-500 hover:text-slate-800" />
                      <span>{kanbanDate}</span>
                      <ChevronRight className="w-3 h-3 cursor-pointer text-slate-500 hover:text-slate-800" />
                    </div>

                    <button 
                      onClick={() => setKanbanDate(getFormattedDate())}
                      className="px-2 py-1 border border-slate-200 hover:bg-slate-50 rounded-md text-[11px] font-medium text-slate-600 cursor-pointer"
                    >
                      Today
                    </button>

                    <button 
                      onClick={() => triggerToast('Optimizing load routes with AI...')}
                      className="px-2 py-1 border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-600 rounded-md text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Optimise Load</span>
                    </button>
                  </div>
                </div>

                {/* 4 Kanban Columns matching Image 1 */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 min-h-[500px] overflow-x-auto pb-1">
                  {Object.entries(kanbanDepots).map(([depotName, depotData]) => (
                    <div key={depotName} className="min-w-[135px] bg-slate-50/70 p-2 rounded-lg border border-slate-200/60 flex flex-col justify-between">
                      <div className="space-y-2">
                        {/* Depot Header */}
                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/80">
                          <span className="text-[10.5px] font-bold text-slate-700 tracking-wider truncate" title={depotName}>{depotName}</span>
                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[9px] font-bold flex items-center justify-center shrink-0 ml-1">
                            {depotData.count}
                          </span>
                        </div>

                        {/* Load Cards inside Kanban Column */}
                        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-0.5">
                          {depotData.cards.map((card) => (
                            <div 
                              key={card.id}
                              onClick={() => {
                                setSelectedLoadId(card.rawId || card.id);
                                setView('manage-load');
                              }}
                              className={`p-2 bg-white rounded-lg border border-slate-200/80 shadow-2xs border-l-3 ${card.borderStyle} hover:shadow-xs transition-all cursor-pointer text-left space-y-1`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[11px] font-bold text-slate-900 whitespace-nowrap shrink-0">{card.id}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold whitespace-nowrap shrink-0 ${card.statusStyle}`}>
                                  {card.status}
                                </span>
                              </div>

                              <div className="text-[10.5px] font-bold text-slate-800 truncate" title={typeof card.customer === 'object' ? card.customer?.name : card.customer}>{typeof card.customer === 'object' ? card.customer?.name : card.customer}</div>

                              <div className="text-[9.5px] text-slate-500 font-medium flex items-center gap-1 overflow-hidden">
                                <span className="truncate">{card.routeFrom}</span>
                                <span className="shrink-0 text-slate-400">→</span>
                                <span className="truncate">{card.routeTo}</span>
                              </div>

                              <div className="text-[9px] text-slate-400 font-medium pt-1 border-t border-slate-100 flex items-center justify-between gap-1">
                                <span className="truncate text-[8.5px] text-slate-500 font-medium">{card.driverDate}</span>
                                <div className="flex items-center gap-1 text-slate-600 font-medium shrink-0 text-[8.5px]">
                                  <Truck className="w-2.5 h-2.5 text-slate-400" />
                                  <span>{card.cargoUnits || 1} unit{(card.cargoUnits || 1) > 1 ? 's' : ''}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Add Load Button */}
                      <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full mt-2 py-1.5 border border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded-md text-[10.5px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer bg-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Load</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------
               RIGHT COLUMN: LIVE GPS MAP CARD (lg:col-span-4)
               ------------------------------------------------------------ */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs p-3.5 flex flex-col justify-between space-y-3">
              <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-2.5">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>LIVE GPS MAP</span>
                  </h2>
                  <button 
                    onClick={() => setIsMapMaximized(true)}
                    title="Maximize HD Map"
                    className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Map Container matching Image 2 */}
                <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[540px] rounded-lg overflow-hidden border border-slate-200">
                  {/* Leaflet Map Element */}
                  <div ref={mapContainerRef} className="w-full h-full z-0" />

                  {/* Top Left Overlay Button: View Full Map */}
                  <div className="absolute top-3 left-3 z-10">
                    <button 
                      onClick={() => setIsMapMaximized(true)}
                      className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-blue-600 hover:bg-white text-xs font-semibold rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5 cursor-pointer transition-all hover:shadow"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>View Full Map</span>
                    </button>
                  </div>

                  {/* Top Right Overlay Zoom Controls */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col shadow-xs">
                    <button 
                      onClick={() => {
                        if (mapRef.current) mapRef.current.zoomIn();
                      }}
                      className="w-7 h-7 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-t-md border border-slate-200 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => {
                        if (mapRef.current) mapRef.current.zoomOut();
                      }}
                      className="w-7 h-7 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-b-md border-x border-b border-slate-200 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                  </div>

                  {/* Floating Toggle Actions Button (Does NOT block map markers) */}
                  <div className="absolute bottom-3 right-3 z-10 text-right">
                    {isMapToolsOpen && (
                      <div className="mb-2 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-xl space-y-1 text-left min-w-[150px] animate-in fade-in slide-in-from-bottom-2">
                        <button 
                          onClick={() => { setIsMapToolsOpen(false); triggerToast('Tracking driver real-time position...'); }}
                          className="w-full px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-[10.5px] font-semibold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Target className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Track Driver</span>
                        </button>
                        <button 
                          onClick={() => { setIsMapToolsOpen(false); triggerToast('Opening optimized route polyline...'); }}
                          className="w-full px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-[10.5px] font-semibold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Open Route</span>
                        </button>
                        <button 
                          onClick={() => { setIsMapToolsOpen(false); triggerToast('Location request sent to driver...'); }}
                          className="w-full px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-[10.5px] font-semibold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Send Location</span>
                        </button>
                        <button 
                          onClick={() => { setIsMapToolsOpen(false); triggerToast('Refreshing GPS satellite telemetry...'); }}
                          className="w-full px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-[10.5px] font-semibold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Refresh GPS</span>
                        </button>
                        <button 
                          onClick={() => { setIsMapToolsOpen(false); triggerToast('Fetching location breadcrumb history...'); }}
                          className="w-full px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-[10.5px] font-semibold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Location History</span>
                        </button>
                        <button 
                          onClick={() => { setIsMapToolsOpen(false); triggerToast('Delay flagged for operational review.'); }}
                          className="w-full px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-[10.5px] font-semibold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>Flag Delay</span>
                        </button>
                      </div>
                    )}
                    <button 
                      onClick={() => setIsMapToolsOpen(!isMapToolsOpen)}
                      className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 cursor-pointer ml-auto transition-all"
                    >
                      <Target className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isMapToolsOpen ? 'Close Tools' : 'GPS Tools'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ============================================================
             4. BOTTOM SECTION: DRIVER STATUS
             ============================================================ */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-3.5 space-y-3">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">DRIVER STATUS</h2>

                {/* Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  {[
                    { id: 'All', label: 'All', count: drivers.length },
                    { id: 'On Duty', label: 'On Duty', count: drivers.filter(d => ['On Duty', 'ACTIVE', 'AVAILABLE', 'On Shift'].includes(d.status) || !d.status).length },
                    { id: 'En Route', label: 'En Route', count: drivers.filter(d => d.status === 'En Route' || d.status === 'IN_TRANSIT').length },
                    { id: 'At Pickup', label: 'At Pickup', count: drivers.filter(d => d.status === 'At Pickup' || d.status === 'AT_PICKUP').length },
                    { id: 'Break', label: 'Break', count: drivers.filter(d => d.status === 'Break' || d.status === 'ON_BREAK').length },
                    { id: 'Off Duty', label: 'Off Duty', count: drivers.filter(d => d.status === 'Off Duty' || d.status === 'INACTIVE' || d.status === 'OFF_DUTY').length },
                    { id: 'Unavailable', label: 'Unavailable', count: drivers.filter(d => d.status === 'Unavailable' || d.status === 'Delayed' || d.status === 'UNAVAILABLE').length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDriverTab(tab.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                        activeDriverTab === tab.id 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => triggerToast('Navigating to drivers management portal...')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>View all drivers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Scrollable Cards List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
              {filteredDrivers.length === 0 ? (
                <div className="col-span-full py-8 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-medium text-slate-600">No drivers currently match the selected status.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Drivers registered in the system will automatically appear here.</p>
                </div>
              ) : (
                filteredDrivers.map((driver) => {
                  const driverName = driver.name || `${driver.firstName || ''} ${driver.lastName || ''}`.trim() || driver.driverCode || 'Driver';
                  const linkedLoad = loads.find(l => 
                    (l.driverId === driver.id || l.driver?.id === driver.id) && 
                    !['DELIVERED', 'CANCELLED'].includes(String(l.status || '').toUpperCase())
                  );
                  const linkedTruck = linkedLoad?.truck || vehicles.find(v => 
                    v.assignedDriverId === driver.id || v.driverId === driver.id || v.assignedDriver?.id === driver.id
                  );
                  const driverVehicle = linkedTruck 
                    ? `${linkedTruck.make || ''} ${linkedTruck.model || ''} (${linkedTruck.rego || linkedTruck.plate})`.trim()
                    : (driver.assignedTruck?.rego || driver.vehicle || 'Available Fleet');
                  const loadRef = linkedLoad ? (linkedLoad.loadRef || `LD-${(linkedLoad.id || '').substring(0, 8).toUpperCase()}`) : 'None';
                  const pickup = linkedLoad?.stops?.find(s => s.type === 'PICKUP') || linkedLoad?.stops?.[0];
                  const location = linkedLoad ? (linkedLoad.routeFrom || pickup?.city || 'In Transit') : (driver.city || driver.currentLocation || 'Sydney Depot');
                  const isMoving = linkedLoad && ['IN_TRANSIT', 'ACTIVE'].includes(String(linkedLoad.status || '').toUpperCase());
                  const telemetry = isMoving ? '74 km/h • GPS Sync' : 'Standby in Depot';
                  const avatar = driver.avatar || driver.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(driverName)}&background=0284c7&color=fff&bold=true`;

                  return (
                    <div 
                      key={driver.id}
                      className="p-2.5 border border-slate-200/80 rounded-xl bg-white shadow-2xs hover:border-blue-300 transition-all text-left space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        {/* Header: Photo + Name + Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <img 
                                src={avatar} 
                                alt={driverName} 
                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                              />
                              <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${
                                ['On Duty', 'ACTIVE', 'AVAILABLE', 'On Shift'].includes(driver.status) || !driver.status ? 'bg-emerald-500' :
                                driver.status === 'En Route' ? 'bg-blue-500' :
                                driver.status === 'At Pickup' ? 'bg-amber-500' :
                                driver.status === 'Delayed' ? 'bg-rose-500' :
                                'bg-slate-400'
                              }`} />
                            </div>
                            <div>
                              <h4 className="text-[11.5px] font-bold text-slate-900 leading-none">{driverName}</h4>
                              <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block ${
                                ['On Duty', 'ACTIVE', 'AVAILABLE', 'On Shift'].includes(driver.status) || !driver.status ? 'bg-emerald-50 text-emerald-700' :
                                driver.status === 'En Route' ? 'bg-blue-50 text-blue-700' :
                                driver.status === 'At Pickup' ? 'bg-amber-50 text-amber-700' :
                                driver.status === 'Delayed' ? 'bg-rose-50 text-rose-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {driver.status || 'On Duty'}
                              </span>
                            </div>
                          </div>

                          <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Details */}
                        <div className="space-y-1 text-[10px] text-slate-600 pt-1 border-t border-slate-100">
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Vehicle:</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[80px]">{driverVehicle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Load ID:</span>
                            <span className="font-semibold text-slate-800">{loadRef}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Location:</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[80px]">{location}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">Telemetry:</span>
                            <span className={`font-bold flex items-center gap-0.5 ${driver.isDelay ? 'text-rose-600' : 'text-blue-600'}`}>
                              {driver.isSpeed && <Zap className="w-3 h-3 text-blue-600 fill-blue-600" />}
                              {telemetry}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 pt-1.5 border-t border-slate-100">
                        <button 
                          onClick={() => triggerToast(`Sending message to ${driverName}...`)}
                          className="flex-1 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-[9.5px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3 text-slate-500" />
                        </button>
                        <button 
                          onClick={() => triggerToast(`Initiating call with ${driverName}...`)}
                          className="flex-1 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-[9.5px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Phone className="w-3 h-3 text-slate-500" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      ) : view === 'create-console' ? (
        /* ============================================================
           CREATE LOAD CONSOLE VIEW (Intact logic)
           ============================================================ */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 text-left">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setView('dashboard')}
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer shadow-3xs"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">CREATE LOAD</h1>
                  <span className="text-xl font-black text-[#FFA000]">CONSOLE</span>
                </div>
                <p className="text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mt-1">
                  LOAD &rarr; STOPS &rarr; ITEMS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setView('dashboard');
                  triggerToast('Draft saved successfully.');
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-3xs bg-white"
              >
                SAVE DRAFT
              </button>
              <button 
                onClick={handleActivateLoad}
                className="bg-[#0B0F17] hover:bg-slate-800 text-brand-500 font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
              >
                ⚡ ACTIVATE LOAD
              </button>
            </div>
          </div>

          {/* Form console layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* Step 1: Route Stops */}
              <div className="bg-white rounded-[20px] border border-slate-200/80 p-5 shadow-2xs text-left">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-600 shrink-0" />
                    STEP 1: CONFIGURE ROUTE STOPS
                  </h3>
                  <button 
                    type="button" 
                    onClick={handleAddStop}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> ADD STOP
                  </button>
                </div>

                <div className="space-y-4">
                  {stops.map((stop, idx) => (
                    <div key={stop.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">STEP TYPE</label>
                          <select 
                            value={stop.type}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStops(prev => prev.map(s => s.id === stop.id ? { ...s, type: val } : s));
                            }}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none bg-white cursor-pointer"
                          >
                            <option value="Pickup">Pickup</option>
                            <option value="Drop">Drop</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ADDRESS / SUBURB</label>
                          <input 
                            type="text"
                            placeholder="Full location address..."
                            value={stop.address}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStops(prev => prev.map(s => s.id === stop.id ? { ...s, address: val } : s));
                            }}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#0B0F17] rounded-[20px] p-5 text-white text-left space-y-3 shadow-md">
                <span className="text-[10px] font-black text-amber-400 tracking-wider block uppercase">LOAD SPECIFICATIONS</span>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">CUSTOMER REFERENCE</label>
                  <input 
                    type="text"
                    value={customerRef}
                    onChange={(e) => setCustomerRef(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================
           MANAGE LOAD DRAWER / MODAL VIEW (Intact logic)
           ============================================================ */
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView('dashboard')}
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Manage Load {selectedLoadId}</h1>
                <p className="text-xs text-slate-400 font-medium">Update assignment, status and manifest documents</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setView('dashboard');
                  triggerToast(`Load ${selectedLoadId} updated successfully.`);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Load details summary card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Customer Load No.</label>
                <input 
                  type="text" 
                  value={customerLoadNo} 
                  onChange={(e) => setCustomerLoadNo(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Origin Location</label>
                <input 
                  type="text" 
                  value={originLocation} 
                  onChange={(e) => setOriginLocation(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Final Destination</label>
                <input 
                  type="text" 
                  value={finalDestination} 
                  onChange={(e) => setFinalDestination(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Priority</label>
                <select 
                  value={priorityStatus}
                  onChange={(e) => setPriorityStatus(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white"
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
         CREATE LOAD MODAL FORM OVERLAY
         ============================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Create New Load</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Fill in details to dispatch a new active load</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLoadSubmit} className="p-5 space-y-4 text-xs text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. BMW Australia"
                    value={newLoadForm.customer}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, customer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select 
                    value={newLoadForm.status}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                  >
                    <option value="In Transit">In Transit</option>
                    <option value="En Route">En Route</option>
                    <option value="At Pickup">At Pickup</option>
                    <option value="Planned">Planned</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Route Pickup (From)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Sydney"
                    value={newLoadForm.routeFrom}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, routeFrom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Route Delivery (To)</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Melbourne"
                    value={newLoadForm.routeTo}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, routeTo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Driver</label>
                  <select 
                    value={newLoadForm.driver}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, driver: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                  >
                    <option value="John Doe">John Doe</option>
                    <option value="Chris Lee">Chris Lee</option>
                    <option value="Michael Tan">Michael Tan</option>
                    <option value="David Brown">David Brown</option>
                    <option value="Ben Hall">Ben Hall</option>
                    <option value="Sarah Connor">Sarah Connor</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vehicle / Trailer</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. MAN TGX 26.580"
                    value={newLoadForm.vehicle}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, vehicle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Required Date</label>
                  <input 
                    type="text"
                    value={newLoadForm.reqDate}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, reqDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Required Time</label>
                  <input 
                    type="text"
                    value={newLoadForm.reqTime}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, reqTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setView('create-console');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                >
                  Open Full Console
                </button>
                
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                  >
                    Create Load
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL SCREEN MAXIMIZED GPS MAP MODAL */}
      {isMapMaximized && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex flex-col p-4 animate-in fade-in">
          {/* Header Bar */}
          <div className="bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-t-2xl flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-black">
                <Globe className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">LIVE GPS SATELLITE FLEET MAP</h2>
                <p className="text-[11px] text-slate-400 font-medium">Real-time driver tracking &amp; telemetry monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                5 Vehicles Active
              </span>
              <button 
                onClick={() => setIsMapMaximized(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl cursor-pointer transition-colors border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Screen Map Body */}
          <div className="relative flex-1 bg-slate-900 border-x border-b border-slate-800 rounded-b-2xl overflow-hidden shadow-2xl">
            <div ref={fullMapContainerRef} className="w-full h-full z-0" />

            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col shadow-xl">
              <button 
                onClick={() => fullMapRef.current && fullMapRef.current.zoomIn()}
                className="w-9 h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-t-xl border border-slate-700 flex items-center justify-center cursor-pointer"
              >
                +
              </button>
              <button 
                onClick={() => fullMapRef.current && fullMapRef.current.zoomOut()}
                className="w-9 h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-b-xl border-x border-b border-slate-700 flex items-center justify-center cursor-pointer"
              >
                -
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
