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

export default function CommandCentre() {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'create-console', 'manage-load'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Create Load Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newLoadForm, setNewLoadForm] = useState({
    customer: '',
    status: 'In Transit',
    routeFrom: '',
    routeTo: '',
    driver: 'John Doe',
    vehicle: 'MAN TGX 26.580',
    reqDate: '25 May 2026',
    reqTime: '09:00 AM'
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
  const [activeDriverTab, setActiveDriverTab] = useState('All (23)');

  // Planning Board Control States
  const [boardView, setBoardView] = useState('Board View');
  const [dayView, setDayView] = useState('Day');
  const [kanbanDate, setKanbanDate] = useState('22 May 2026');

  // Leaflet Map Refs
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const fullMapContainerRef = useRef(null);
  const fullMapRef = useRef(null);
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const [isMapToolsOpen, setIsMapToolsOpen] = useState(false);

  // Active Movements / Master Loads state list
  const [loads, setLoads] = useState([
    {
      id: 'LD-10583',
      customer: 'BMW Australia',
      routeFrom: 'Sydney',
      routeTo: 'Melbourne',
      status: 'In Transit',
      date: '23 May 2026',
      vehicle: 'MAN TGX 26.580',
      depot: 'Sydney Depot',
      driver: 'John Doe',
      itemsCount: 8,
      passengers: 2,
      tabCategory: 'Active'
    },
    {
      id: 'LD-10582',
      customer: 'Pickles Auctions',
      routeFrom: 'Brisbane',
      routeTo: 'Sydney',
      status: 'In Transit',
      date: '22 May 2026',
      vehicle: 'Volvo FH16 750',
      depot: 'Sydney Depot',
      driver: 'Chris Lee',
      itemsCount: 6,
      passengers: 1,
      tabCategory: 'Active'
    },
    {
      id: 'LD-10581',
      customer: 'Toyota Finance',
      routeFrom: 'Adelaide',
      routeTo: 'Perth',
      status: 'Pending Dispatch',
      date: '24 May 2026',
      vehicle: 'Scania R650',
      depot: 'Brisbane Depot',
      driver: 'Michael Tan',
      itemsCount: 12,
      passengers: 1,
      tabCategory: 'Planned'
    },
    {
      id: 'LD-10579',
      customer: 'Hertz Australia',
      routeFrom: 'Sydney',
      routeTo: 'Gold Coast',
      status: 'Delayed',
      date: '21 May 2026',
      vehicle: 'MAN TGX 26.580',
      depot: 'Sydney Depot',
      driver: 'David Brown',
      itemsCount: 4,
      passengers: 1,
      tabCategory: 'Active'
    },
    {
      id: 'LD-10578',
      customer: 'Copart Australia',
      routeFrom: 'Melbourne',
      routeTo: 'Sydney',
      status: 'Planned',
      date: '21 May 2026',
      vehicle: 'Kenworth T909',
      depot: 'Melbourne Depot',
      driver: 'Ben Hall',
      itemsCount: 8,
      passengers: 1,
      tabCategory: 'Planned'
    },
    {
      id: 'LD-10577',
      customer: 'Woolworths DC',
      routeFrom: 'Brisbane',
      routeTo: 'Townsville',
      status: 'Pending Dispatch',
      date: '22 May 2026',
      vehicle: 'Volvo FH16 750',
      depot: 'Brisbane Depot',
      driver: 'Sarah Connor',
      itemsCount: 12,
      passengers: 1,
      tabCategory: 'Planned'
    },
    {
      id: 'LD-10576',
      customer: 'JB Hi-Fi',
      routeFrom: 'Sydney',
      routeTo: 'Adelaide',
      status: 'Planned',
      date: '23 May 2026',
      vehicle: 'Scania R650',
      depot: 'Sydney Depot',
      driver: 'John Smith',
      itemsCount: 10,
      passengers: 1,
      tabCategory: 'Planned'
    },
    {
      id: 'LD-10575',
      customer: 'BMW Australia',
      routeFrom: 'Melbourne',
      routeTo: 'Brisbane',
      status: 'In Transit',
      date: '21 May 2026',
      vehicle: 'Volvo FH16 750',
      depot: 'Melbourne Depot',
      driver: 'Daniel Craig',
      itemsCount: 7,
      passengers: 1,
      tabCategory: 'Active'
    },
    {
      id: 'LD-10574',
      customer: 'JAX Tyres',
      routeFrom: 'Adelaide',
      routeTo: 'Darwin',
      status: 'Planned',
      date: '25 May 2026',
      vehicle: 'Scania R650',
      depot: 'Adelaide Depot',
      driver: 'Sarah Connor',
      itemsCount: 4,
      passengers: 1,
      tabCategory: 'Planned'
    },
    {
      id: 'LD-10573',
      customer: 'Toyota Finance',
      routeFrom: 'Melbourne',
      routeTo: 'Perth',
      status: 'Planned',
      date: '24 May 2026',
      vehicle: 'MAN TGX 26.580',
      depot: 'Melbourne Depot',
      driver: 'David Brown',
      itemsCount: 8,
      passengers: 1,
      tabCategory: 'Planned'
    },
    {
      id: 'LD-10571',
      customer: 'GPC Asia Pacific',
      routeFrom: 'Brisbane',
      routeTo: 'Melbourne',
      status: 'Planned',
      date: '23 May 2026',
      vehicle: 'MAN TGX 26.580',
      depot: 'Brisbane Depot',
      driver: 'Ben Hall',
      itemsCount: 6,
      passengers: 1,
      tabCategory: 'Planned'
    },
    {
      id: 'LD-10580',
      customer: 'Toyota Finance',
      routeFrom: 'Adelaide',
      routeTo: 'Perth',
      status: 'Planned',
      date: '24 May 2026',
      vehicle: 'Scania R650',
      depot: 'Adelaide Depot',
      driver: 'Sarah Connor',
      itemsCount: 7,
      passengers: 1,
      tabCategory: 'Planned'
    }
  ]);

  // Handle Create Load Submit
  const handleCreateLoadSubmit = (e) => {
    e.preventDefault();
    const newId = `LD-105${Math.floor(84 + Math.random() * 20)}`;
    const newEntry = {
      id: newId,
      customer: newLoadForm.customer || 'BMW Australia',
      routeFrom: newLoadForm.routeFrom || 'Sydney',
      routeTo: newLoadForm.routeTo || 'Melbourne',
      status: newLoadForm.status,
      date: `${newLoadForm.reqDate} • ${newLoadForm.reqTime}`,
      vehicle: newLoadForm.vehicle || 'MAN TGX 26.580',
      depot: 'Sydney Depot',
      driver: newLoadForm.driver || 'John Doe',
      itemsCount: 8,
      passengers: 2,
      tabCategory: 'Active'
    };

    setLoads(prev => [newEntry, ...prev]);
    setIsCreateModalOpen(false);
    triggerToast(`Load ${newId} created and dispatched successfully!`);
  };

  // Exact Depot Datasets matching Image 1
  const kanbanDepots = {
    'SYDNEY DEPOT': {
      count: 6,
      cards: [
        {
          id: 'LD-10582',
          status: 'In Transit',
          statusStyle: 'bg-emerald-50 text-emerald-700',
          borderStyle: 'border-l-emerald-500',
          customer: 'BMW Australia',
          routeFrom: 'Sydney',
          routeTo: 'Melbourne',
          driverDate: '23 May • John Doe',
          users: 2,
          packages: 8
        },
        {
          id: 'LD-10579',
          status: 'Delayed',
          statusStyle: 'bg-rose-50 text-rose-700',
          borderStyle: 'border-l-rose-500',
          customer: 'Hertz Australia',
          routeFrom: 'Sydney',
          routeTo: 'Gold Coast',
          driverDate: '21 May • David Brown',
          users: 1,
          packages: 4
        },
        {
          id: 'LD-10576',
          status: 'Planned',
          statusStyle: 'bg-amber-50 text-amber-700',
          borderStyle: 'border-l-amber-500',
          customer: 'JB Hi-Fi',
          routeFrom: 'Sydney',
          routeTo: 'Adelaide',
          driverDate: '23 May',
          users: 1,
          packages: 10
        }
      ]
    },
    'MELBOURNE DEPOT': {
      count: 6,
      cards: [
        {
          id: 'LD-10578',
          status: 'Planned',
          statusStyle: 'bg-amber-50 text-amber-700',
          borderStyle: 'border-l-amber-500',
          customer: 'Copart Australia',
          routeFrom: 'Melbourne',
          routeTo: 'Sydney',
          driverDate: '21 May • Chris Lee',
          users: 2,
          packages: 6
        },
        {
          id: 'LD-10575',
          status: 'In Transit',
          statusStyle: 'bg-emerald-50 text-emerald-700',
          borderStyle: 'border-l-emerald-500',
          customer: 'BMW Australia',
          routeFrom: 'Melbourne',
          routeTo: 'Brisbane',
          driverDate: '22 May • Daniel Craig',
          users: 1,
          packages: 7
        },
        {
          id: 'LD-10573',
          status: 'Planned',
          statusStyle: 'bg-amber-50 text-amber-700',
          borderStyle: 'border-l-amber-500',
          customer: 'Toyota Finance',
          routeFrom: 'Melbourne',
          routeTo: 'Perth',
          driverDate: '24 May',
          users: 1,
          packages: 8
        }
      ]
    },
    'BRISBANE DEPOT': {
      count: 5,
      cards: [
        {
          id: 'LD-10581',
          status: 'Pending',
          statusStyle: 'bg-blue-50 text-blue-600',
          borderStyle: 'border-l-blue-500',
          customer: 'Pickles Auctions',
          routeFrom: 'Brisbane',
          routeTo: 'Sydney',
          driverDate: '22 May • Michael Tan',
          users: 1,
          packages: 5
        },
        {
          id: 'LD-10577',
          status: 'Pending',
          statusStyle: 'bg-blue-50 text-blue-600',
          borderStyle: 'border-l-blue-500',
          customer: 'Woolworths DC',
          routeFrom: 'Brisbane',
          routeTo: 'Townsville',
          driverDate: '24 May • Ben Hall',
          users: 1,
          packages: 12
        },
        {
          id: 'LD-10571',
          status: 'Planned',
          statusStyle: 'bg-amber-50 text-amber-700',
          borderStyle: 'border-l-amber-500',
          customer: 'GPC Asia Pacific',
          routeFrom: 'Brisbane',
          routeTo: 'Melbourne',
          driverDate: '23 May',
          users: 1,
          packages: 6
        }
      ]
    },
    'ADELAIDE DEPOT': {
      count: 4,
      cards: [
        {
          id: 'LD-10580',
          status: 'Planned',
          statusStyle: 'bg-amber-50 text-amber-700',
          borderStyle: 'border-l-amber-500',
          customer: 'Toyota Finance',
          routeFrom: 'Adelaide',
          routeTo: 'Perth',
          driverDate: '24 May • Sarah Connor',
          users: 1,
          packages: 7
        },
        {
          id: 'LD-10574',
          status: 'Planned',
          statusStyle: 'bg-amber-50 text-amber-700',
          borderStyle: 'border-l-amber-500',
          customer: 'JAX Tyres',
          routeFrom: 'Adelaide',
          routeTo: 'Darwin',
          driverDate: '25 May',
          users: 1,
          packages: 4
        }
      ]
    }
  };

  // Driver Status List
  const [drivers, setDrivers] = useState([
    {
      id: 'DRV-001',
      name: 'John Doe',
      status: 'On Duty',
      vehicle: 'MAN TGX 26.580',
      loadId: 'LD-10582',
      location: 'Near Newcastle, NSW',
      telemetry: '82 km/h',
      isSpeed: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 'DRV-002',
      name: 'Chris Lee',
      status: 'En Route',
      vehicle: 'Kenworth T909',
      loadId: 'LD-10578',
      location: 'Near Goulburn, NSW',
      telemetry: '76 km/h',
      isSpeed: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 'DRV-003',
      name: 'Michael Tan',
      status: 'At Pickup',
      vehicle: 'Scania R650',
      loadId: 'LD-10581',
      location: 'Brisbane, QLD',
      telemetry: 'At Facility',
      isSpeed: false,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 'DRV-004',
      name: 'David Brown',
      status: 'Delayed',
      vehicle: 'MAN TGX 26.580',
      loadId: 'LD-10579',
      location: 'Near Ballina, NSW',
      telemetry: 'ETA +45m',
      isSpeed: false,
      isDelay: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 'DRV-005',
      name: 'Ben Hall',
      status: 'Break',
      vehicle: 'Volvo FH16 750',
      loadId: 'No Active Load',
      location: 'Rest Area - Dubbo, NSW',
      telemetry: 'On Rest',
      isSpeed: false,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 'DRV-006',
      name: 'Sarah Connor',
      status: 'Off Duty',
      vehicle: 'Scania R650',
      loadId: 'No Active Load',
      location: 'Sydney, NSW',
      telemetry: 'Offline',
      isSpeed: false,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
    }
  ]);

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
    setActiveDriverTab('All (23)');
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

    // Crisp voyager tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO'
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

    // Live Vehicle Callout Markers matching Image 2
    const vehicleMarkers = [
      {
        id: 'LD-10582',
        driver: 'John Doe',
        vehicle: 'MAN TGX 26.580',
        speed: '82 km/h',
        lat: -27.8500,
        lng: 153.3000,
        badgeBg: '#16a34a'
      },
      {
        id: 'LD-10578',
        driver: 'Chris Lee',
        vehicle: 'Kenworth T909',
        speed: '76 km/h',
        lat: -33.2000,
        lng: 149.8000,
        badgeBg: '#16a34a'
      },
      {
        id: 'LD-10579',
        driver: 'David Brown',
        vehicle: 'MAN TGX 26.580',
        speed: '62 km/h',
        lat: -29.8000,
        lng: 151.8000,
        badgeBg: '#ea580c'
      },
      {
        id: 'LD-10575',
        driver: 'Daniel Craig',
        vehicle: 'Volvo FH16 750',
        speed: '58 km/h',
        lat: -34.8000,
        lng: 148.9000,
        badgeBg: '#dc2626'
      },
      {
        id: 'LD-10581',
        driver: 'Michael Tan',
        vehicle: 'Scania R650',
        speed: '71 km/h',
        lat: -35.2809,
        lng: 149.1300,
        badgeBg: '#2563eb'
      }
    ];

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
  }, [view]);

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

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO'
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

    const vehicleMarkers = [
      { id: 'LD-10582', driver: 'John Doe', vehicle: 'MAN TGX 26.580', speed: '82 km/h', lat: -27.8500, lng: 153.3000, badgeBg: '#16a34a' },
      { id: 'LD-10578', driver: 'Chris Lee', vehicle: 'Kenworth T909', speed: '76 km/h', lat: -33.2000, lng: 149.8000, badgeBg: '#16a34a' },
      { id: 'LD-10579', driver: 'David Brown', vehicle: 'MAN TGX 26.580', speed: '62 km/h', lat: -29.8000, lng: 151.8000, badgeBg: '#ea580c' },
      { id: 'LD-10575', driver: 'Daniel Craig', vehicle: 'Volvo FH16 750', speed: '58 km/h', lat: -34.8000, lng: 148.9000, badgeBg: '#dc2626' },
      { id: 'LD-10581', driver: 'Michael Tan', vehicle: 'Scania R650', speed: '71 km/h', lat: -35.2809, lng: 149.1300, badgeBg: '#2563eb' }
    ];

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
  }, [isMapMaximized]);

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
    const matchesSearch = 
      load.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      load.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      load.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      load.vehicle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch = selectedBranch === 'All Branches' || load.depot.toLowerCase().includes(selectedBranch.toLowerCase());
    const matchesStatus = selectedStatus === 'All Statuses' || load.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesDriver = selectedDriver === 'All Drivers' || load.driver.toLowerCase() === selectedDriver.toLowerCase();
    const matchesCustomer = selectedCustomer === 'All Customers' || load.customer.toLowerCase() === selectedCustomer.toLowerCase();

    const matchesTab = 
      activeLoadTab === 'All' ? true :
      activeLoadTab === 'Active' ? (load.status === 'In Transit' || load.status === 'Delayed') :
      activeLoadTab === 'Planned' ? (load.status === 'Planned' || load.status === 'Pending Dispatch') :
      activeLoadTab === 'Completed' ? load.status === 'Completed' :
      activeLoadTab === 'On Hold' ? load.status === 'On Hold' : true;

    return matchesSearch && matchesBranch && matchesStatus && matchesDriver && matchesCustomer && matchesTab;
  });

  // Filtered Drivers for Bottom Section
  const filteredDrivers = drivers.filter(driver => {
    if (activeDriverTab.includes('All')) return true;
    if (activeDriverTab.includes('On Duty')) return driver.status === 'On Duty';
    if (activeDriverTab.includes('En Route')) return driver.status === 'En Route';
    if (activeDriverTab.includes('At Pickup')) return driver.status === 'At Pickup';
    if (activeDriverTab.includes('Break')) return driver.status === 'Break';
    if (activeDriverTab.includes('Off Duty')) return driver.status === 'Off Duty';
    if (activeDriverTab.includes('Unavailable')) return driver.status === 'Unavailable' || driver.status === 'Delayed';
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
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">128</h3>
                  <span className="text-[9.5px] font-semibold text-emerald-600 block mt-0.5">↑ 12% vs yesterday</span>
                </div>
              </div>

              {/* Card 2: Active Loads */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-xs transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 fill-emerald-600" />
                </div>
                <div>
                  <span className="text-[10.5px] font-medium text-slate-500 block">Active Loads</span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">63</h3>
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
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">34</h3>
                  <span className="text-[9.5px] font-semibold text-amber-600 block mt-0.5">Next 7 days</span>
                </div>
              </div>

              {/* Card 4: Completed Today */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-xs transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10.5px] font-medium text-slate-500 block">Completed Today</span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">21</h3>
                  <span className="text-[9.5px] font-semibold text-purple-600 block mt-0.5">↑ 5 vs yesterday</span>
                </div>
              </div>

              {/* Card 5: Delayed Loads */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-2.5 hover:shadow-xs transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10.5px] font-medium text-slate-500 block">Delayed Loads</span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">7</h3>
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
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">18</h3>
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
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">12</h3>
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
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">9</h3>
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
                    <option value="John Doe">John Doe</option>
                    <option value="Chris Lee">Chris Lee</option>
                    <option value="Michael Tan">Michael Tan</option>
                    <option value="David Brown">David Brown</option>
                    <option value="Ben Hall">Ben Hall</option>
                    <option value="Sarah Connor">Sarah Connor</option>
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
                    <option value="BMW Australia">BMW Australia</option>
                    <option value="Pickles Auctions">Pickles Auctions</option>
                    <option value="Toyota Finance">Toyota Finance</option>
                    <option value="Hertz Australia">Hertz Australia</option>
                    <option value="Copart Australia">Copart Australia</option>
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
                    <option value="Sydney">Sydney</option>
                    <option value="Melbourne">Melbourne</option>
                    <option value="Brisbane">Brisbane</option>
                    <option value="Adelaide">Adelaide</option>
                    <option value="Perth">Perth</option>
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
                    <option value="Refrigerated">Refrigerated</option>
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
                    <option value="All">All</option>
                    <option value="MAN TGX 26.580">MAN TGX 26.580</option>
                    <option value="Volvo FH16 750">Volvo FH16 750</option>
                    <option value="Scania R650">Scania R650</option>
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
                  {filteredLoads.map((load) => (
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
                          <span className="text-xs font-bold text-slate-900 whitespace-nowrap">{load.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold whitespace-nowrap shrink-0 ${
                            load.status === 'In Transit' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            load.status === 'Pending Dispatch' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            load.status === 'Delayed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            load.status === 'Planned' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {load.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[9.5px] text-slate-400 font-medium whitespace-nowrap">{load.date}</span>
                          <button className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-[11.5px] font-semibold text-slate-800">{load.customer}</div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-600">
                        <span>{load.routeFrom}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span>{load.routeTo}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                        <Truck className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{load.vehicle}</span>
                      </div>
                    </div>
                  ))}
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
                      onClick={() => setKanbanDate('22 May 2026')}
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
                                setSelectedLoadId(card.id);
                                setView('manage-load');
                              }}
                              className={`p-2 bg-white rounded-lg border border-slate-200/80 shadow-2xs border-l-3 ${card.borderStyle} hover:shadow-xs transition-all cursor-pointer text-left space-y-1`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[11px] font-bold text-slate-900 whitespace-nowrap">{card.id}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold whitespace-nowrap shrink-0 ${card.statusStyle}`}>
                                  {card.status}
                                </span>
                              </div>

                              <div className="text-[10.5px] font-bold text-slate-800 truncate" title={card.customer}>{card.customer}</div>

                              <div className="text-[9.5px] text-slate-500 font-medium flex items-center gap-1 overflow-hidden">
                                <span className="truncate">{card.routeFrom}</span>
                                <span className="shrink-0 text-slate-400">→</span>
                                <span className="truncate">{card.routeTo}</span>
                              </div>

                              <div className="text-[9px] text-slate-400 font-medium pt-1 border-t border-slate-100 flex items-center justify-between gap-1">
                                <span className="truncate text-[8.5px] text-slate-500 font-medium">{card.driverDate}</span>
                                <div className="flex items-center gap-1.5 text-slate-500 font-medium shrink-0 text-[8.5px]">
                                  <span>👤 {card.users}</span>
                                  <span>📦 {card.packages}</span>
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
                    { name: 'All (23)' },
                    { name: 'On Duty (18)' },
                    { name: 'En Route (9)' },
                    { name: 'At Pickup (2)' },
                    { name: 'Break (1)' },
                    { name: 'Off Duty (3)' },
                    { name: 'Unavailable (2)' }
                  ].map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => setActiveDriverTab(tab.name)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                        activeDriverTab === tab.name 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {tab.name}
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
              {filteredDrivers.map((driver) => (
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
                            src={driver.avatar} 
                            alt={driver.name} 
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${
                            driver.status === 'On Duty' ? 'bg-emerald-500' :
                            driver.status === 'En Route' ? 'bg-blue-500' :
                            driver.status === 'At Pickup' ? 'bg-amber-500' :
                            driver.status === 'Delayed' ? 'bg-rose-500' :
                            'bg-slate-400'
                          }`} />
                        </div>
                        <div>
                          <h4 className="text-[11.5px] font-bold text-slate-900 leading-none">{driver.name}</h4>
                          <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block ${
                            driver.status === 'On Duty' ? 'bg-emerald-50 text-emerald-700' :
                            driver.status === 'En Route' ? 'bg-blue-50 text-blue-700' :
                            driver.status === 'At Pickup' ? 'bg-amber-50 text-amber-700' :
                            driver.status === 'Delayed' ? 'bg-rose-50 text-rose-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {driver.status}
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
                        <span className="font-semibold text-slate-800 truncate max-w-[80px]">{driver.vehicle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Load ID:</span>
                        <span className="font-semibold text-slate-800">{driver.loadId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Location:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[80px]">{driver.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Telemetry:</span>
                        <span className={`font-bold flex items-center gap-0.5 ${driver.isDelay ? 'text-rose-600' : 'text-blue-600'}`}>
                          {driver.isSpeed && <Zap className="w-3 h-3 text-blue-600 fill-blue-600" />}
                          {driver.telemetry}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 pt-1.5 border-t border-slate-100">
                    <button 
                      onClick={() => triggerToast(`Sending message to ${driver.name}...`)}
                      className="flex-1 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-[9.5px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3 text-slate-500" />
                    </button>
                    <button 
                      onClick={() => triggerToast(`Initiating call with ${driver.name}...`)}
                      className="flex-1 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-[9.5px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3 h-3 text-slate-500" />
                    </button>
                  </div>
                </div>
              ))}
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
                className="bg-[#0B0F17] hover:bg-slate-800 text-[#FFD400] font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
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
