import React, { useState } from 'react';
import { 
  Search, Plus, MapPin, Navigation, Bell, AlertTriangle, Play, 
  CheckCircle2, Siren, ArrowRight, User, ArrowLeft, ArrowUpRight, 
  ShieldAlert, FileText, ChevronRight, MoreVertical, X, Calendar, 
  Clipboard, Camera, PlusCircle, Trash2, Menu, MessageSquare, ChevronDown, Globe 
} from 'lucide-react';

export default function CommandCentre() {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'create-console'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Active Movements state list
  const [activeMovements, setActiveMovements] = useState([
    {
      id: 'SHP-20481',
      client: 'Acme Corp',
      from: 'Sydney Depot',
      to: 'Melbourne Depot',
      status: 'IN TRANSIT',
      terminal: 'Melbourne Terminal',
      driver: 'Jack Taylor',
      avatar: 'JT',
      vehicle: 'TRK-102'
    },
    {
      id: 'SHP-20482',
      client: 'Tech Solutions Ltd',
      from: 'Brisbane Depot',
      to: 'Sydney Depot',
      status: 'ARRIVING SOON',
      terminal: 'Sydney Central Depot',
      driver: 'Liam Smith',
      avatar: 'LS',
      vehicle: 'VAN-88'
    },
    {
      id: 'SHP-20483',
      client: 'Global Traders',
      from: 'Perth Depot',
      to: 'Adelaide Depot',
      status: 'IN SORTING',
      terminal: 'Adelaide Terminal',
      driver: 'Noah Williams',
      avatar: 'NW',
      vehicle: 'TRK-05'
    },
    {
      id: 'SHP-20484',
      client: 'Express Goods',
      from: 'Sydney Depot',
      to: 'Newcastle Depot',
      status: 'UNASSIGNED',
      terminal: 'Newcastle Depot',
      driver: 'Unassigned',
      avatar: '?',
      vehicle: '-'
    }
  ]);

  // Create Load Form States
  const [customerRef, setCustomerRef] = useState('PO-12345');
  const [priorityTag, setPriorityTag] = useState('NORMAL'); // 'NORMAL', 'EXPRESS', 'URGENT'
  const [shippingDeadline, setShippingDeadline] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  
  // Steps stops list state
  const [stops, setStops] = useState([
    { id: 1, type: 'Pickup', address: '', contact: '', phone: '', time: '' },
    { id: 2, type: 'Drop', address: '', contact: '', phone: '', time: '' }
  ]);

  // Declared items list state
  const [declaredItems, setDeclaredItems] = useState([
    { id: 1, client: 'Acme Corp', pickupStop: 'Stop #1: Pickup (No Address)', dropStop: 'Stop #2: Drop (No Address)', desc: '', weight: '' }
  ]);

  // Manage and Modal States
  const [selectedLoadId, setSelectedLoadId] = useState('SHP-20481');
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Edit Job Form States matching 3rd image values exactly
  const [customerLoadNo, setCustomerLoadNo] = useState('ACME-221');
  const [internalDeptCode, setInternalDeptCode] = useState('');
  const [originLocation, setOriginLocation] = useState('Sydney Depot');
  const [finalDestination, setFinalDestination] = useState('Melbourne Branch');
  const [priorityStatus, setPriorityStatus] = useState('HIGH');
  const [vinChassis, setVinChassis] = useState('7T1...882');
  const [registrationNo, setRegistrationNo] = useState('XQG-984');
  const [makeModel, setMakeModel] = useState('Toyota Hilux');
  const [stockItemNo, setStockItemNo] = useState('STK-4405');
  const [cargoType, setCargoType] = useState('Vehicle');
  const [itemsCount, setItemsCount] = useState(1);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Drag and drop states & handlers for declaredItems
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const items = [...declaredItems];
    const draggedItem = items[draggedItemIndex];
    
    // Remove the dragged item and insert it at the target index
    items.splice(draggedItemIndex, 1);
    items.splice(index, 0, draggedItem);

    // Re-index item IDs to match order
    const reindexedItems = items.map((item, idx) => ({
      ...item,
      id: idx + 1
    }));

    setDeclaredItems(reindexedItems);
    triggerToast('Reordered item entry.');
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  // Add stop field row dynamically
  const handleAddStop = () => {
    const nextId = stops.length + 1;
    setStops([...stops, { 
      id: nextId, 
      type: 'Drop', 
      address: '', 
      contact: '', 
      phone: '', 
      time: '' 
    }]);
    triggerToast('Added route stop.');
  };

  // Add item field row dynamically
  const handleAddItem = () => {
    const nextId = declaredItems.length + 1;
    setDeclaredItems([...declaredItems, { 
      id: nextId, 
      client: 'Acme Corp', 
      pickupStop: 'Stop #1: Pickup (No Address)', 
      dropStop: `Stop #2: Drop (No Address)`, 
      desc: '', 
      weight: '' 
    }]);
    triggerToast('Added cargo item.');
  };

  // Activate load and return to dashboard
  const handleActivateLoad = (e) => {
    e.preventDefault();
    if (stops.some(s => !s.address)) {
      triggerToast('Warning: Please provide addresses for route stops.', 'warning');
    }

    const newLoadId = `SHP-${Math.floor(20485 + Math.random() * 105)}`;
    const primaryClient = declaredItems[0]?.client || 'Acme Corp';
    const startPoint = stops[0]?.address || 'Sydney Depot';
    const endPoint = stops[stops.length - 1]?.address || 'Melbourne Depot';

    const activatedLoad = {
      id: newLoadId,
      client: primaryClient,
      from: startPoint.length > 20 ? `${startPoint.substring(0, 17)}...` : startPoint,
      to: endPoint.length > 20 ? `${endPoint.substring(0, 17)}...` : endPoint,
      status: 'UNASSIGNED',
      terminal: `${endPoint.split(',')[0] || 'Melbourne'} Depot`,
      driver: 'Unassigned',
      avatar: '?',
      vehicle: '-'
    };

    setActiveMovements([activatedLoad, ...activeMovements]);
    setView('dashboard');
    triggerToast(`Load ${newLoadId} activated and dispatched successfully!`);
  };

  const filteredMovements = activeMovements.filter(m =>
    m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] px-8 py-8 space-y-6 text-left font-sans antialiased text-slate-800">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">
          {toastMsg}
        </div>
      )}

      {view === 'dashboard' ? (
        <>
          {/* Page Sub-Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 text-left">
            <div>
              <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
                Dispatcher Portal <span className="text-slate-400 text-xl mx-1">•</span> Command Center
              </h1>
              <p className="text-[13px] text-slate-500 mt-1 font-medium">
                FLEET INTELLIGENCE HQ
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-650" />
                <input
                  type="text"
                  placeholder="Search ID, Driver, Client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                />
              </div>
              <button 
                onClick={() => setView('create-console')}
                className="bg-[#FFA000] hover:bg-[#FF9000] text-black font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap tracking-wider uppercase"
              >
                CREATE LOAD
              </button>
            </div>
          </div>

          {/* KPI CARDS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Loads */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] h-32 text-left transition-all duration-200 cursor-pointer hover:shadow-[0_12px_40px_rgb(0,0,0,0.10)] hover:border-slate-300 hover:-translate-y-0.5">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-lg">
                  📦
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-lg bg-blue-50 text-blue-600 border border-blue-100/50">
                  +12%
                </span>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">ACTIVE LOADS</p>
                <h3 className="text-3xl font-black text-slate-900 leading-tight mt-0.5">{activeMovements.length}</h3>
              </div>
            </div>

            {/* Drivers Online */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] h-32 text-left transition-all duration-200 cursor-pointer hover:shadow-[0_12px_40px_rgb(0,0,0,0.10)] hover:border-slate-300 hover:-translate-y-0.5">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-lg">
                  🚚
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                  LIVE
                </span>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">DRIVERS ONLINE</p>
                <h3 className="text-3xl font-black text-slate-900 leading-tight mt-0.5">18</h3>
              </div>
            </div>

            {/* Pending Assignment */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] h-32 text-left transition-all duration-200 cursor-pointer hover:shadow-[0_12px_40px_rgb(0,0,0,0.10)] hover:border-slate-300 hover:-translate-y-0.5">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-lg">
                  ⚠️
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-lg bg-amber-50 text-amber-600 border border-amber-100/50">
                  URGENT
                </span>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">PENDING ASSIGNMENT</p>
                <h3 className="text-3xl font-black text-slate-900 leading-tight mt-0.5">04</h3>
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] h-32 text-left transition-all duration-200 cursor-pointer hover:shadow-[0_12px_40px_rgb(0,0,0,0.10)] hover:border-slate-300 hover:-translate-y-0.5">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-lg">
                  🚨
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-lg bg-red-50 text-red-650 border border-red-100/50">
                  FIX NOW
                </span>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">CRITICAL ALERTS</p>
                <h3 className="text-3xl font-black text-slate-900 leading-tight mt-0.5">02</h3>
              </div>
            </div>
          </div>

          {/* TWO COLUMN GRID CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Active Movements (Table Column) */}
            <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-50 text-purple-650 rounded-lg flex items-center justify-center shrink-0 border border-purple-100">📊</span>
                  Active Movements
                </h3>
                <button 
                  onClick={() => window.open('/customer-portal', '_blank')}
                  className="px-4 py-1.5 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-full text-[10px] font-bold cursor-pointer transition-colors hover:bg-slate-50 shadow-3xs"
                >
                  LIVE TRACKING
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/40 border-b border-slate-100 whitespace-nowrap">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">LOAD ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">ROUTE / STATUS</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">RESOURCE</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right pr-10">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMovements.map((movement, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap text-left align-middle">
                          <span className="text-xs font-bold text-slate-900 block leading-tight">{movement.id}</span>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block leading-none">{movement.client}</span>
                        </td>
                        <td className="px-6 py-5 text-left align-middle whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                            <span>{movement.from}</span>
                            <span className="text-slate-400">→</span>
                            <span>{movement.to}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider leading-none ${
                              movement.status === 'IN TRANSIT' ? 'bg-blue-50 text-blue-600 border border-blue-100/50' :
                              movement.status === 'ARRIVING SOON' ? 'bg-amber-50 text-amber-600 border border-amber-100/50' :
                              movement.status === 'IN SORTING' ? 'bg-purple-50 text-purple-600 border border-purple-100/50' :
                              'bg-slate-50 text-slate-500 border border-slate-200'
                            }`}>
                              {movement.status}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" /> {movement.terminal}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-left align-middle">
                          <div className="flex items-center gap-3">
                            {movement.driver === 'Unassigned' ? (
                              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center font-bold text-xs shrink-0 text-[#FFD400]">
                                ?
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs shrink-0 text-slate-700">
                                {movement.avatar}
                              </div>
                            )}
                            <div>
                              <span className={`text-xs font-bold block ${movement.driver === 'Unassigned' ? 'text-red-500' : 'text-slate-800'}`}>
                                {movement.driver}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 leading-none">
                                {movement.vehicle}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right pr-10 align-middle">
                          <button 
                            onClick={() => {
                              setSelectedLoadId(movement.id);
                              setView('manage-load');
                            }}
                            className="px-4 py-1.5 border border-slate-200 text-slate-600 hover:text-black rounded-full text-xs font-bold transition-all cursor-pointer hover:bg-slate-50 shadow-3xs uppercase tracking-wider"
                          >
                            MANAGE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Stack Panel (Fleet Map / Critical Logs) */}
            <div className="space-y-6 lg:col-span-1">
              {/* Fleet Map Card */}
              <div className="bg-white rounded-[24px] border border-[#FFD400] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)] text-left flex flex-col justify-between h-40 transition-all duration-200 cursor-pointer hover:shadow-[0_12px_40px_rgb(255,212,0,0.25)] hover:border-[#FFA000] hover:-translate-y-0.5">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    Fleet Map
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 hover:text-black cursor-pointer transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LIVE NETWORK MONITOR</p>
                  <h3 className="text-4xl font-black text-slate-900 leading-none mt-2">18</h3>
                </div>
              </div>

              {/* Critical Logs Card */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)] text-left space-y-4 transition-all duration-200 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:border-slate-200">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-50">
                  <Bell className="w-4 h-4 text-red-500" />
                  Critical Logs
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.005)] text-left transition-all duration-200 hover:border-red-200 hover:bg-red-50/30 hover:shadow-[0_4px_20px_rgb(239,68,68,0.07)] cursor-pointer">
                    <p className="text-xs font-bold text-slate-800">SHP-20483 geofence breach.</p>
                    <span className="text-[9px] text-slate-400 font-semibold block mt-1">4m ago</span>
                  </div>
                  <div className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.005)] text-left transition-all duration-200 hover:border-red-200 hover:bg-red-50/30 hover:shadow-[0_4px_20px_rgb(239,68,68,0.07)] cursor-pointer">
                    <p className="text-xs font-bold text-slate-800">Unassigned SHP-20484 timeout.</p>
                    <span className="text-[9px] text-slate-455 font-semibold block mt-1">12m ago</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </>
      ) : view === 'create-console' ? (
        /* CREATE LOAD CONSOLE VIEW */
        <div className="space-y-6">
          {/* Console Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80 text-left">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setView('dashboard')}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer shadow-3xs"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">CREATE LOAD</h1>
                  <span className="text-xl font-black text-[#FFA000]">CONSOLE</span>
                </div>
                <p className="text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mt-1.5">
                  OPERATIONAL PRINCIPLE: LOAD &rarr; STOPS &rarr; ITEMS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setView('dashboard');
                  triggerToast('Draft saved successfully.');
                }}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-3xs bg-white"
              >
                SAVE DRAFT
              </button>
              <button 
                onClick={handleActivateLoad}
                className="bg-[#0B0F17] hover:bg-slate-800 text-[#FFD400] font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs uppercase tracking-wider"
              >
                <span className="text-xs shrink-0">⚡</span> ACTIVATE LOAD
              </button>
            </div>
          </div>

          {/* Console Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Steps Panel */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Step 1: Route Stops */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm text-left">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-50">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-600 shrink-0" />
                    STEP 1: CONFIGURE ROUTE STOPS
                  </h3>
                  <button 
                    type="button" 
                    onClick={handleAddStop}
                    className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> ADD STOP
                  </button>
                </div>

                {/* Timeline Stops list */}
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-8 before:w-0.5 before:border-l-2 before:border-dashed before:border-slate-200">
                  {stops.map((stop, idx) => (
                    <div key={stop.id} className="relative space-y-4">
                      {/* Timeline numbered circle marker */}
                      <span className="absolute -left-[26px] top-1.5 w-6 h-6 rounded-full bg-[#0B0F17] border border-slate-200 text-white text-[10px] font-black flex items-center justify-center shadow-xs z-10">{idx + 1}</span>

                      {/* Card fields */}
                      <div className="p-4 border border-slate-100 rounded-2xl bg-white space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">STEP TYPE</label>
                            <select 
                              value={stop.type}
                              onChange={(e) => {
                                const val = e.target.value;
                                setStops(prev => prev.map(s => s.id === stop.id ? { ...s, type: val } : s));
                              }}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none bg-white cursor-pointer text-slate-800"
                            >
                              <option value="Pickup">Pickup</option>
                              <option value="Drop">Drop</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">ADDRESS / SUBURB</label>
                            <div className="relative">
                              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pink-500 shrink-0" />
                              <input 
                                type="text"
                                placeholder="Full location address..."
                                value={stop.address}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setStops(prev => prev.map(s => s.id === stop.id ? { ...s, address: val } : s));
                                }}
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">CONTACT NAME</label>
                            <div className="relative">
                              <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                type="text"
                                placeholder="Receiver/Sender Name"
                                value={stop.contact}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setStops(prev => prev.map(s => s.id === stop.id ? { ...s, contact: val } : s));
                                }}
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">PHONE</label>
                            <input 
                              type="text"
                              placeholder="+61..."
                              value={stop.phone}
                              onChange={(e) => {
                                const val = e.target.value;
                                setStops(prev => prev.map(s => s.id === stop.id ? { ...s, phone: val } : s));
                              }}
                              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">REQUIRED TIME</label>
                            <div className="relative">
                              <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-455" />
                              <input 
                                type="text"
                                placeholder="dd-mm-yyyy --:--"
                                value={stop.time}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setStops(prev => prev.map(s => s.id === stop.id ? { ...s, time: val } : s));
                                }}
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Items / Cars declaration */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm text-left space-y-5">
                <div className="flex justify-between items-center mb-2 pb-3 border-b border-slate-50">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="text-xs">📦</span>
                    STEP 2: DECLARE ITEMS / CARS
                  </h3>
                  <button 
                    type="button" 
                    onClick={handleAddItem}
                    className="bg-black hover:bg-slate-800 text-[#FFD400] font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> ADD ITEM
                  </button>
                </div>

                {declaredItems.map((item, idx) => (
                  <div 
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`space-y-4 p-2 border-2 border-dashed rounded-3xl transition-all ${
                      draggedItemIndex === idx 
                        ? 'border-amber-400 bg-amber-50/20 opacity-70' 
                        : 'border-transparent bg-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center px-2 cursor-grab active:cursor-grabbing select-none">
                      <span className="text-xs font-black text-amber-500 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="text-slate-400 text-sm font-normal">&#8942;&#8942;</span> ITEM ENTRY #{item.id}
                      </span>
                      {declaredItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeclaredItems(prev => prev.filter(d => d.id !== item.id).map((d, i) => ({ ...d, id: i + 1 })));
                            triggerToast('Removed cargo item.');
                          }}
                          className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="p-4 border border-slate-100 rounded-2xl bg-white space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">CUSTOMER / OWNER</label>
                          <input 
                            type="text"
                            value={item.client}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeclaredItems(prev => prev.map(d => d.id === item.id ? { ...d, client: val } : d));
                            }}
                            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">LINK PICKUP STOP</label>
                          <select 
                            value={item.pickupStop}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeclaredItems(prev => prev.map(d => d.id === item.id ? { ...d, pickupStop: val } : d));
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none bg-white cursor-pointer"
                          >
                            {stops.map(s => (
                              <option key={s.id}>{`Stop #${s.id}: ${s.type} (${s.address || 'No Address'})`}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">LINK DROP-OFF STOP</label>
                          <select 
                            value={item.dropStop}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeclaredItems(prev => prev.map(d => d.id === item.id ? { ...d, dropStop: val } : d));
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none bg-white cursor-pointer"
                          >
                            {stops.map(s => (
                              <option key={s.id}>{`Stop #${s.id}: ${s.type} (${s.address || 'No Address'})`}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">ITEM DESCRIPTION / IDENTIFICATION</label>
                          <input 
                            type="text"
                            placeholder="e.g. 2024 Toyota Hilux or General..."
                            value={item.desc}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeclaredItems(prev => prev.map(d => d.id === item.id ? { ...d, desc: val } : d));
                            }}
                            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">WEIGHT (KG)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">⚖️</span>
                            <input 
                              type="text"
                              placeholder="0"
                              value={item.weight}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDeclaredItems(prev => prev.map(d => d.id === item.id ? { ...d, weight: val } : d));
                              }}
                              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Specifications and notes side column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0B0F17] rounded-[24px] p-6 text-white text-left space-y-4 shadow-md">
                <span className="text-[10px] font-black text-amber-500 tracking-wider block uppercase">LOAD SPECIFICATIONS</span>
                
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">CUSTOMER REFERENCE</label>
                  <input 
                    type="text"
                    value={customerRef}
                    onChange={(e) => setCustomerRef(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold focus:outline-none border-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">PRIORITY TIER</label>
                  <div className="flex gap-2">
                    {['NORMAL', 'EXPRESS', 'URGENT'].map((pTag) => (
                      <button
                        key={pTag}
                        type="button"
                        onClick={() => setPriorityTag(pTag)}
                        className={`flex-1 py-2.5 text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center ${
                          priorityTag === pTag 
                            ? 'bg-[#FFA000] text-black border-none font-black' 
                            : 'bg-white text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {pTag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">GLOBAL DEADLINE</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs shrink-0 select-none">⏰</span>
                    <input 
                      type="text"
                      placeholder="dd-mm-yyyy --:--"
                      value={shippingDeadline}
                      onChange={(e) => setShippingDeadline(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold focus:outline-none border-none"
                    />
                  </div>
                </div>
              </div>

              {/* Documents & Photos upload box */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm text-left space-y-4">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">DOCUMENTS & PHOTOS</span>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => triggerToast('Select and upload manifest pdf...')}
                    className="border border-dashed border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer select-none"
                  >
                    <Clipboard className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">MANIFEST</span>
                  </div>
                  <div 
                    onClick={() => triggerToast('Select and upload cargo photos...')}
                    className="border border-dashed border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer select-none"
                  >
                    <Camera className="w-5 h-5 text-slate-600" />
                    <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wide">PHOTOS</span>
                  </div>
                </div>
              </div>

              {/* Internal Dispatch Notes */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm text-left space-y-4">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">INTERNAL DISPATCH NOTES</span>
                <textarea
                  placeholder="Gate codes, site rules, or special procedures..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={4}
                  className="w-full p-4 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400] resize-none"
                />
              </div>

            </div>

          </div>
        </div>
      ) : view === 'manage-load' ? (
        /* MANAGE LOAD VIEW */
        <div className="space-y-6 text-left">
          {/* Header row */}
          <div className="flex flex-col gap-2 pb-4 border-b border-slate-200/80">
            <button 
              onClick={() => setView('dashboard')}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-slate-600 cursor-pointer self-start"
            >
              &lt; Back to Loads
            </button>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                  {selectedLoadId}
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100/50">
                  IN PROGRESS
                </span>
                <span className="px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-purple-50 text-purple-650 border border-purple-100/50">
                  DEPOT-TO-DEPOT
                </span>
                <span className="text-[10px] text-slate-400 font-extrabold ml-1 uppercase">
                  CLIENT REF: <span className="text-slate-700 font-black">{customerLoadNo}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button 
                  onClick={() => setIsPodModalOpen(true)}
                  className="bg-[#10B981] hover:bg-[#0D9488] text-white font-extrabold text-[11px] py-2.5 px-4 rounded-xl flex items-center gap-1 transition-colors shadow-3xs cursor-pointer tracking-wider"
                >
                  <span className="text-xs">&#10003;</span> COLLECT POD
                </button>
                <button 
                  onClick={() => window.open('/customer-portal', '_blank')}
                  className="bg-[#FFA000] hover:bg-[#FF9000] text-black font-extrabold text-[11px] py-2.5 px-4 rounded-xl shadow-3xs transition-all tracking-wider cursor-pointer"
                >
                  LIVE TRACKING
                </button>
                <button 
                  onClick={() => triggerToast('Downloading shipping manifest PDF...')}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-[11px] rounded-xl cursor-pointer transition-colors bg-white tracking-wider"
                >
                  MANIFEST
                </button>
                <button 
                  onClick={() => setView('edit-job')}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-[11px] rounded-xl cursor-pointer transition-colors bg-white shadow-3xs tracking-wider"
                >
                  EDIT JOB
                </button>
              </div>
            </div>
          </div>

          {/* Core Manage Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Transport Network Flow card (4 columns) */}
            <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[24px] p-6 shadow-3xs space-y-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                TRANSPORT NETWORK FLOW
              </span>

              {/* Progress steps timeline list */}
              <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-[9px] before:top-2 before:bottom-6 before:w-0.5 before:border-l before:border-dashed before:border-slate-200">
                {/* Step 1: Pickup */}
                <div className="relative text-left">
                  <span className="absolute -left-[22px] top-0.5 w-5 h-5 rounded-full bg-[#10B981] border-2 border-white text-white flex items-center justify-center text-[9px] font-black shadow-xs z-10">
                    &#10003;
                  </span>
                  <div className="space-y-0.5 pl-1.5">
                    <span className="text-[8px] font-black text-[#10B981] uppercase tracking-wider block">PICKUP</span>
                    <span className="text-xs font-extrabold text-slate-800 block">First Mile Pickup</span>
                    <span className="text-[9px] font-bold text-slate-400 block">Customer Site (Bondi) / Local Courier</span>
                  </div>
                </div>

                {/* Step 2: Sorting */}
                <div className="relative text-left">
                  <span className="absolute -left-[22px] top-0.5 w-5 h-5 rounded-full bg-[#10B981] border-2 border-white text-white flex items-center justify-center text-[9px] font-black shadow-xs z-10">
                    &#10003;
                  </span>
                  <div className="space-y-0.5 pl-1.5">
                    <span className="text-[8px] font-black text-[#10B981] uppercase tracking-wider block">SORTING</span>
                    <span className="text-xs font-extrabold text-slate-800 block">Inbound Sorting</span>
                    <span className="text-[9px] font-bold text-slate-400 block">Sydney Central Depot / Depot Manager</span>
                  </div>
                </div>

                {/* Step 3: Inter-Depot (Active orange highlight card style) */}
                <div className="relative text-left -mx-3 p-3 bg-amber-50/30 border border-amber-100/50 rounded-xl">
                  <span className="absolute -left-[10px] top-4 w-4 h-4 rounded-full bg-white border-4 border-amber-500 shadow-xs z-10"></span>
                  <div className="flex justify-between items-start gap-2 pl-2">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black text-amber-500 uppercase tracking-wider block">INTER-DEPOT</span>
                      <span className="text-xs font-black text-slate-855 block">Depot Transfer (Trunk)</span>
                      <span className="text-[9px] font-bold text-slate-500 block leading-tight">
                        {originLocation} &rarr; {finalDestination} / Line-haul Truck
                      </span>
                    </div>
                    <button 
                      onClick={() => setIsAssignModalOpen(true)}
                      className="bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-50 px-2.5 py-1 text-[8px] font-black rounded-lg text-slate-700 shrink-0 cursor-pointer shadow-3xs uppercase tracking-wider"
                    >
                      ASSIGN RESOURCE
                    </button>
                  </div>
                </div>

                {/* Step 4: Sorting */}
                <div className="relative text-left">
                  <span className="absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-200 shadow-3xs z-10"></span>
                  <div className="space-y-0.5 pl-1.5">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">SORTING</span>
                    <span className="text-xs font-extrabold text-slate-400 block">Outbound Sorting</span>
                    <span className="text-[9px] font-bold text-slate-400 block">Melbourne Terminal / Depot Supervisor</span>
                  </div>
                </div>

                {/* Step 5: Delivery */}
                <div className="relative text-left">
                  <span className="absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-200 shadow-3xs z-10"></span>
                  <div className="space-y-0.5 pl-1.5">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">DELIVERY</span>
                    <span className="text-xs font-extrabold text-slate-400 block">Last Mile Delivery</span>
                    <span className="text-[9px] font-bold text-slate-400 block">Melbourne CBD / Local Courier</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right details content stack (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Consignor Sender and Consignee cards row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Consignor Sender */}
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-3xs text-left space-y-3.5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">CONSIGNOR (SENDER)</span>
                  <div className="space-y-1">
                    <span className="text-sm font-extrabold text-slate-900 block leading-tight">Acme Corp Logistics</span>
                    <span className="text-xs font-bold text-slate-500 block leading-relaxed">
                      Warehouse 4, 12 Botany Rd, Alexandria NSW 2015
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-bold pt-1.5 border-t border-slate-50">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wide">Contact: James Hargrove</span>
                    <span className="block mt-0.5 text-slate-800 font-black">+61 2 9283 1122</span>
                  </div>
                </div>

                {/* Consignee Receiver */}
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-3xs text-left space-y-3.5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">CONSIGNEE (RECEIVER)</span>
                  <div className="space-y-1">
                    <span className="text-sm font-extrabold text-slate-900 block leading-tight">Tech Solutions Ltd</span>
                    <span className="text-xs font-bold text-slate-500 block leading-relaxed">
                      1 Innovation Dr, Port Botany NSW 2036
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-bold pt-1.5 border-t border-slate-50">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wide">Contact: Tom Carey</span>
                    <span className="block mt-0.5 text-slate-800 font-black">+61 2 9666 0011</span>
                  </div>
                </div>
              </div>

              {/* Map Placeholder Panel */}
              <div className="bg-[#0B0F17] h-48 border border-slate-800 rounded-[24px] flex items-center justify-center text-xs text-slate-500 font-black tracking-widest uppercase bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                🗺️ MAP VECTOR INTEGRATION ZONE
              </div>

              {/* Terminal Operations and Load Metadata Cards */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Terminal Operations */}
                <div className="md:col-span-7 bg-white border border-slate-100 rounded-[24px] p-6 shadow-3xs text-left flex flex-col justify-between min-h-[170px] relative overflow-hidden">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-black text-[#FFA000] uppercase tracking-wider flex items-center gap-1 leading-none">
                        <span>⚡</span> TERMINAL OPERATIONS
                      </span>
                      {/* Truck Delivery icon */}
                      <span className="text-2xl opacity-15 absolute right-4 top-4 select-none">🚚</span>
                    </div>
                    <div className="mt-4">
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">CURRENT ASSET ALLOCATION</span>
                      <span className="block text-xs font-bold text-slate-400 italic mt-1.5">Waiting for resource assignment...</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsAssignModalOpen(true)}
                    className="w-full mt-4 bg-[#FFA000] hover:bg-[#FF9000] text-black font-extrabold text-[10px] py-3 rounded-xl transition-all shadow-3xs cursor-pointer uppercase tracking-wider"
                  >
                    ALLOCATE DRIVER & VEHICLE
                  </button>
                </div>

                {/* Load Metadata */}
                <div className="md:col-span-5 bg-white border border-slate-100 rounded-[24px] p-6 shadow-3xs text-left space-y-3.5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">LOAD METADATA</span>
                  
                  <div className="space-y-2.5 text-xs font-bold">
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                      <span className="text-slate-400 text-[9px] uppercase">CUSTOMER LOAD #</span>
                      <span className="text-slate-900 font-extrabold">{customerLoadNo}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                      <span className="text-slate-400 text-[9px] uppercase">COMMODITY</span>
                      <span className="text-slate-900 font-extrabold">Electronics</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                      <span className="text-slate-400 text-[9px] uppercase">WEIGHT & VOL</span>
                      <span className="text-slate-900 font-extrabold">18.42t / 41 CBM</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                      <span className="text-slate-400 text-[9px] uppercase">TARGET ETA</span>
                      <span className="text-slate-900 font-extrabold">Today, 17:30</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-slate-400 text-[9px] uppercase">SERVICE</span>
                      <span className="px-2 py-0.5 bg-[#FFA000] text-black font-black text-[8px] rounded uppercase tracking-wider">
                        {priorityStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Control Panel */}
              <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-3xs text-left space-y-4">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">DOCUMENT CONTROL</span>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => triggerToast('Downloading waybill...')}
                    className="flex-1 py-3 bg-white border border-slate-100 hover:bg-slate-50 text-slate-700 font-black text-xs rounded-xl cursor-pointer transition-colors text-center shadow-3xs uppercase tracking-wider"
                  >
                    DOWNLOAD WAYBILL
                  </button>
                  <button 
                    onClick={() => triggerToast('Downloading consignee POD waybill...')}
                    className="flex-1 py-3 bg-white border border-slate-100 hover:bg-slate-50 text-slate-700 font-black text-xs rounded-xl cursor-pointer transition-colors text-center shadow-3xs uppercase tracking-wider"
                  >
                    CONSIGNEE POD
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EDIT JOB VIEW */
        <div className="space-y-6 text-left">
          {/* Header row */}
          <div className="flex flex-col gap-2 pb-4 border-b border-slate-200/80">
            <button 
              onClick={() => setView('manage-load')}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-slate-600 cursor-pointer self-start"
            >
              &lt; Back to Details
            </button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-1">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    Edit Job <span className="text-[#FFA000]">{selectedLoadId}</span>
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-150">
                    COMMAND OVERWRITE
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider mt-1.5">
                  Adjusting operational manifest & shipment flow
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setView('manage-load')}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] rounded-xl cursor-pointer transition-colors shadow-3xs bg-white uppercase tracking-wider"
                >
                  DISCARD
                </button>
                <button 
                  onClick={() => {
                    setView('manage-load');
                    triggerToast('Job modifications committed successfully.');
                  }}
                  className="bg-[#0B0F17] hover:bg-slate-800 text-[#FFD400] font-black text-[10px] py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <span>💾</span> COMMIT CHANGES
                </button>
              </div>
            </div>
          </div>

          {/* Edit Job Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left cargo forms card (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Administrative References Card */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-855 text-xs uppercase tracking-wider flex items-center gap-2">
                  <span>🛡️</span>
                  ADMINISTRATIVE REFERENCES
                </h3>
                <p className="text-slate-400 text-[9px] font-extrabold uppercase tracking-wider -mt-2">
                  BILLING & COMPLIANCE IDENTIFIERS
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                      CUSTOMER LOAD NUMBER (REF #) *
                    </label>
                    <input 
                      type="text"
                      value={customerLoadNo}
                      onChange={(e) => setCustomerLoadNo(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                      INTERNAL DEPT. CODE
                    </label>
                    <input 
                      type="text"
                      value={internalDeptCode}
                      onChange={(e) => setInternalDeptCode(e.target.value)}
                      placeholder="Optional cost center"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                    />
                  </div>
                </div>
              </div>

              {/* Shipment Manifest Card */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-center mb-2 pb-3 border-b border-slate-50">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="text-xs">📦</span>
                    SHIPMENT MANIFEST
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => {
                      setItemsCount(prev => prev + 1);
                      triggerToast('Added cargo item to manifest.');
                    }}
                    className="bg-black hover:bg-slate-800 text-[#FFD400] font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> ADD ITEM
                  </button>
                </div>

                {/* Cargo Detail #1 */}
                <div className="space-y-4">
                  <span className="text-xs font-black text-amber-500 uppercase tracking-wide">1 CARGO DETAIL</span>
                  <div className="p-5 border border-slate-100 rounded-2xl bg-white space-y-6">
                    {/* Category tabs */}
                    <div className="flex gap-3">
                      {['Vehicle', 'Hazmat', 'Freight'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setCargoType(type)}
                          className={`px-4 py-2 rounded-xl border text-[10px] font-extrabold flex items-center gap-1.5 cursor-pointer uppercase tracking-wider transition-all ${
                            cargoType === type 
                              ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-3xs'
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {type === 'Vehicle' ? '🚚' : type === 'Hazmat' ? '⚠' : '📦'} {type}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">VIN / CHASSIS # *</label>
                        <input 
                          type="text"
                          value={vinChassis}
                          onChange={(e) => setVinChassis(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">REGISTRATION #</label>
                        <input 
                          type="text"
                          value={registrationNo}
                          onChange={(e) => setRegistrationNo(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-855 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">MAKE / MODEL</label>
                        <input 
                          type="text"
                          value={makeModel}
                          onChange={(e) => setMakeModel(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">STOCK / ITEM # *</label>
                        <input 
                          type="text"
                          value={stockItemNo}
                          onChange={(e) => setStockItemNo(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-855 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Side Column (4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Routing Override Card */}
              <div className="bg-[#0B0F17] text-white rounded-[24px] border border-slate-800 p-6 shadow-md space-y-4 text-left">
                <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="text-[#FFD400]">⚡</span>
                  ROUTING OVERRIDE
                </h3>

                <div className="space-y-4.5 pt-2">
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                      ORIGIN LOCATION
                    </label>
                    <input 
                      type="text"
                      value={originLocation}
                      onChange={(e) => setOriginLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-800 rounded-xl text-xs font-bold text-slate-855 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                      FINAL DESTINATION
                    </label>
                    <input 
                      type="text"
                      value={finalDestination}
                      onChange={(e) => setFinalDestination(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-800 rounded-xl text-xs font-bold text-slate-855 focus:outline-none"
                    />
                  </div>

                  <div className="pt-1.5">
                    <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                      PRIORITY STATUS
                    </label>
                    <div className="flex gap-2">
                      {['LOW', 'MEDIUM', 'HIGH'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setPriorityStatus(status)}
                          className={`flex-1 py-2 text-[9px] font-black rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                            priorityStatus === status 
                              ? 'bg-[#FFA000] text-black font-black shadow-xs' 
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold border border-slate-700/50'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modification Summary Card */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm text-left space-y-5">
                <span className="text-[10px] font-black text-slate-400 tracking-wider block uppercase">MODIFICATION SUMMARY</span>
                
                <div className="space-y-4 text-xs font-bold">
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                    <span className="text-slate-400 text-[10px] uppercase">Items to Process</span>
                    <span className="text-slate-900 font-extrabold">{itemsCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-400 text-[10px] uppercase">Job Reference</span>
                    <span className="px-2.5 py-0.5 border border-amber-300 text-amber-600 rounded-full text-[8px] font-black tracking-wider uppercase bg-amber-50/10">
                      ACTIVE LINK
                    </span>
                  </div>
                </div>

                {/* Exclamation Sync alert */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
                  <div className="text-blue-500 font-extrabold text-sm shrink-0 leading-none select-none">ⓘ</div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold uppercase">
                    Updates will sync to the driver's device immediately upon saving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HANDOVER AUTHORIZED MODAL (POD MODAL) */}
      {isPodModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in text-slate-800">
          <div className="bg-white rounded-[28px] max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 p-6 text-center space-y-6 animate-scale-in">
            {/* Top header with yellow/orange badge and close button */}
            <div className="flex justify-between items-center pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold text-base shadow-xs select-none">
                  &#10003;
                </div>
                <span className="text-sm font-black text-slate-900 tracking-wide uppercase">
                  HANDOVER AUTHORIZED
                </span>
              </div>
              <button 
                onClick={() => setIsPodModalOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-100 text-slate-400 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Divider line */}
            <div className="w-full h-px bg-slate-100"></div>

            {/* Middle blue document circle icon */}
            <div className="py-6 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600 shadow-3xs">
                <FileText className="w-9 h-9" />
              </div>
              <span className="text-lg font-black text-slate-950 block mt-2">
                Verification Pending
              </span>
            </div>

            {/* Divider line */}
            <div className="w-full h-px bg-slate-200/40"></div>

            {/* Bottom action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => setIsPodModalOpen(false)}
                className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-3xs uppercase tracking-wider"
              >
                CANCEL
              </button>
              <button 
                onClick={() => {
                  setIsPodModalOpen(false);
                  triggerToast('Handover unlocked and completed successfully!');
                }}
                className="flex-1 py-3 bg-[#FFA000] hover:bg-[#FF9000] text-black font-black text-xs rounded-xl cursor-pointer transition-all shadow-xs uppercase tracking-wider"
              >
                UNLOCK HANDOVER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN RESOURCE MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in text-slate-800">
          <div className="bg-white rounded-[28px] max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-scale-in">
            {/* Top dark header bar */}
            <div className="bg-[#0B0F17] text-white p-4.5 px-6 flex justify-between items-center rounded-t-[28px]">
              <span className="text-[10px] font-black tracking-widest text-[#FFD400] uppercase">
                ASSIGN RESOURCE
              </span>
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-bold"
              >
                &#10005;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 bg-slate-50/50">
              {/* Driver 1: Oliver Brown */}
              <div 
                onClick={() => {
                  setIsAssignModalOpen(false);
                  triggerToast('Assigned Oliver Brown to VAN-14.');
                }}
                className="border border-slate-200/80 rounded-[20px] p-4 flex justify-between items-center bg-white shadow-3xs cursor-pointer hover:border-amber-400 transition-all select-none hover:shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  {/* Custom styled avatar shape */}
                  <div className="w-12 h-12 rounded-[16px] overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-lg">
                    👨‍💼
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black text-slate-800 block">Oliver Brown</span>
                    <span className="text-[10px] text-slate-400 font-extrabold block mt-0.5">VAN-14 &middot; Junior</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">AVAILABLE 13:00</span>
                  <span className="border border-amber-200 text-amber-600 bg-amber-50/10 rounded px-2 py-0.5 text-[8px] font-black uppercase tracking-wider block mt-1.5">
                    In Break
                  </span>
                </div>
              </div>

              {/* Driver 2: Lucas Jones */}
              <div 
                onClick={() => {
                  setIsAssignModalOpen(false);
                  triggerToast('Assigned Lucas Jones to TRK-05.');
                }}
                className="border border-slate-200/80 rounded-[20px] p-4 flex justify-between items-center bg-white shadow-3xs cursor-pointer hover:border-amber-400 transition-all select-none hover:shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[16px] overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-lg">
                    👨‍✈️
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black text-slate-800 block">Lucas Jones</span>
                    <span className="text-[10px] text-slate-400 font-extrabold block mt-0.5">TRK-05 &middot; Senior</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">AVAILABLE NOW</span>
                  <span className="border border-amber-250 text-amber-655 bg-amber-50/10 rounded px-2 py-0.5 text-[8px] font-black uppercase tracking-wider block mt-1.5">
                    Off Duty
                  </span>
                </div>
              </div>

              {/* Driver 3: Liam Smith */}
              <div 
                onClick={() => {
                  setIsAssignModalOpen(false);
                  triggerToast('Assigned Liam Smith to BGT-221.');
                }}
                className="border border-slate-200/80 rounded-[20px] p-4 flex justify-between items-center bg-white shadow-3xs cursor-pointer hover:border-amber-400 transition-all select-none hover:shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[16px] overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-lg">
                    👩‍💼
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black text-slate-800 block">Liam Smith</span>
                    <span className="text-[10px] text-slate-400 font-extrabold block mt-0.5">BGT-221 &middot; Regular</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">FINISHING AT 11:30</span>
                  <span className="border border-emerald-250 text-emerald-600 bg-emerald-50/10 rounded px-2 py-0.5 text-[8px] font-black uppercase tracking-wider block mt-1.5">
                    On Duty
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
