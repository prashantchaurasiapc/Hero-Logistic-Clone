import React, { useState } from 'react';
import { Search, Plus, MapPin, Navigation, Bell, AlertTriangle, Play, CheckCircle2, Siren, ArrowRight, User, ArrowLeft, ArrowUpRight, ShieldAlert, FileText, ChevronRight, MoreVertical, X, Calendar, Clipboard, Camera, PlusCircle, Trash2 } from 'lucide-react';

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
  const [customerRef, setCustomerRef] = useState('PO-12246');
  const [priorityTag, setPriorityTag] = useState('MANUAL'); // 'MANUAL', 'EXPRESS', 'NIGHT'
  const [shippingDeadline, setShippingDeadline] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  
  // Steps stops list state
  const [stops, setStops] = useState([
    { id: 1, type: 'Pickup', address: '', contact: '', phone: '', time: '' },
    { id: 2, type: 'Drop', address: '', contact: '', phone: '', time: '' }
  ]);

  // Declared items list state
  const [declaredItems, setDeclaredItems] = useState([
    { id: 1, client: 'Acme Corp', pickupStop: 'Step #1 Pickup (No Address)', dropStop: 'Step #2 Drop (No Address)', desc: '', weight: '' }
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
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
      pickupStop: 'Step #1 Pickup (No Address)', 
      dropStop: `Step #2 Drop (No Address)`, 
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

    const newLoadId = `SHP-${Math.floor(20485 + Math.random() * 100)}`;
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left flex flex-col space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">{toastMsg}</div>
      )}

      {/* DASHBOARD VIEW */}
      {view === 'dashboard' ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
            <div className="text-left">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">DISPATCHER</span>
              <span className="text-xs font-bold text-gray-505 tracking-wider block mb-1">LIVE DISPATCH OPERATIONS</span>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1">Command Center</h1>
              <p className="text-gray-500 text-xs">FLEET INTELLIGENCE HQ</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search ID, Driver, Client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-60 pl-9 pr-4 py-2 bg-white border border-gray-255 rounded-xl text-xs font-bold text-gray-755 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                />
              </div>
              <button 
                onClick={() => setView('create-console')}
                className="bg-[#FFD400] hover:bg-yellow-400 text-black font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-xs cursor-pointer text-center whitespace-nowrap"
              >
                CREATE LOAD
              </button>
            </div>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Loads */}
            <div className="bg-white p-5 rounded-3xl border border-gray-150 flex flex-col justify-between shadow-3xs h-32">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-full shrink-0 bg-amber-50 text-amber-500 border border-gray-100 flex items-center justify-center">
                  📦
                </div>
                <span className="px-2 py-0.5 text-[8px] font-bold rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  +12%
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ACTIVE LOADS</p>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight mt-0.5">{activeMovements.length}</h3>
              </div>
            </div>

            {/* Drivers Online */}
            <div className="bg-white p-5 rounded-3xl border border-gray-150 flex flex-col justify-between shadow-3xs h-32">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-full shrink-0 bg-emerald-50 text-emerald-500 border border-gray-100 flex items-center justify-center">
                  🚚
                </div>
                <span className="px-2 py-0.5 text-[8px] font-bold rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  LIVE
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">DRIVERS ONLINE</p>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight mt-0.5">18</h3>
              </div>
            </div>

            {/* Pending Assignment */}
            <div className="bg-white p-5 rounded-3xl border border-gray-150 flex flex-col justify-between shadow-3xs h-32">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-full shrink-0 bg-amber-50 text-amber-600 border border-gray-100 flex items-center justify-center">
                  ⚠️
                </div>
                <span className="px-2 py-0.5 text-[8px] font-bold rounded-lg bg-amber-55 text-amber-600 border border-amber-100">
                  URGENT
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">PENDING ASSIGNMENT</p>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight mt-0.5">04</h3>
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="bg-white p-5 rounded-3xl border border-gray-150 flex flex-col justify-between shadow-3xs h-32">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-full shrink-0 bg-red-50 text-red-500 border border-gray-100 flex items-center justify-center">
                  🚨
                </div>
                <span className="px-2 py-0.5 text-[8px] font-bold rounded-lg bg-red-50 text-red-600 border border-red-100">
                  FIX NOW
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CRITICAL ALERTS</p>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight mt-0.5">02</h3>
              </div>
            </div>
          </div>

          {/* Table & Side Cards Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Active Movements Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-150 shadow-3xs overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="font-bold text-gray-955 text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 bg-purple-50 text-purple-650 rounded-lg flex items-center justify-center shrink-0 border border-purple-100">📊</span>
                  Active Movements
                </h3>
                <button className="px-3.5 py-1.5 border border-gray-200 text-gray-500 hover:text-gray-900 rounded-xl text-[10px] font-bold cursor-pointer transition-colors hover:bg-gray-50 shadow-3xs">
                  LIVE TRACKING
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/40 border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">LOAD ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">ROUTE / STATUS</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">RESOURCE</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMovements.map((movement, i) => (
                      <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-left">
                          <span className="text-xs font-bold text-gray-955 block">{movement.id}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">{movement.client}</span>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-gray-900">{movement.from}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-bold text-gray-900">{movement.to}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              movement.status === 'IN TRANSIT' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                              movement.status === 'ARRIVING SOON' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              movement.status === 'IN SORTING' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                              'bg-gray-50 text-gray-500 border border-gray-200'
                            }`}>
                              {movement.status}
                            </span>
                            <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-red-500" /> {movement.terminal}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-blue-50 text-blue-650 border border-blue-100`}>
                              {movement.avatar}
                            </div>
                            <div>
                              <span className={`text-xs font-bold block ${movement.driver === 'Unassigned' ? 'text-red-500' : 'text-gray-900'}`}>{movement.driver}</span>
                              <span className="text-[10px] text-gray-400 font-semibold block">{movement.vehicle}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="px-3.5 py-1.5 border border-gray-200 text-gray-700 hover:text-black rounded-lg text-xs font-bold transition-all cursor-pointer hover:bg-gray-50 shadow-3xs">
                            MANAGE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Cards Stack */}
            <div className="space-y-6 lg:col-span-1">
              {/* Fleet Map Card */}
              <div className="bg-white rounded-3xl border border-[#FFD400] p-6 shadow-3xs text-left relative overflow-hidden flex flex-col justify-between h-40">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-955 text-xs uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    Fleet Map
                  </h3>
                  <ArrowRight className="w-4 h-4 text-gray-400 hover:text-black cursor-pointer transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">LIVE NETWORK MONITOR</p>
                  <h3 className="text-3xl font-bold text-gray-955 leading-none mt-1">18</h3>
                </div>
              </div>

              {/* Critical Logs Card */}
              <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-3xs text-left space-y-4">
                <h3 className="font-bold text-gray-955 text-xs uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-50">
                  <Bell className="w-4 h-4 text-red-500" />
                  Critical Logs
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3.5 bg-white border border-gray-150 rounded-2xl shadow-3xs text-left">
                    <p className="text-xs font-bold text-gray-955">SHP-20483 geofence breach.</p>
                    <span className="text-[9px] text-gray-400 font-semibold block mt-1">4m ago</span>
                  </div>
                  <div className="p-3.5 bg-white border border-gray-150 rounded-2xl shadow-3xs text-left">
                    <p className="text-xs font-bold text-gray-955">Unassigned SHP-20484 timeout.</p>
                    <span className="text-[9px] text-gray-400 font-semibold block mt-1">12m ago</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </>
      ) : (
        /* CREATE LOAD CONSOLE VIEW */
        <div className="space-y-6">
          {/* Console Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4 text-left">
              <button 
                onClick={() => setView('dashboard')}
                className="w-10 h-10 rounded-full border border-gray-250 flex items-center justify-center hover:bg-gray-55 cursor-pointer shadow-3xs"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">CREATE LOAD</h1>
                  <span className="text-xl font-black text-[#FFB800]">CONSOLE</span>
                </div>
                <p className="text-gray-450 text-[10px] font-bold uppercase tracking-wider mt-1">OPERATIONAL DE-SORTING LOAD LOGS & STEPS STACKS</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setView('dashboard');
                  triggerToast('Draft saved successfully.');
                }}
                className="px-5 py-2.5 border border-gray-205 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-3xs bg-white"
              >
                SAVE DRAFT
              </button>
              <button 
                onClick={handleActivateLoad}
                className="bg-[#0B0F17] hover:bg-slate-800 text-[#FFD400] font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> ACTIVATE LOAD
              </button>
            </div>
          </div>

          {/* Console Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Steps Panel */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Step 1: Route Stops */}
              <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-3xs text-left">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
                  <h3 className="font-bold text-gray-950 text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="text-xs">🚚</span>
                    STEP 1: CONFIGURE ROUTE STOPS
                  </h3>
                  <button 
                    type="button" 
                    onClick={handleAddStop}
                    className="bg-purple-650 hover:bg-purple-700 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> ADD STOP
                  </button>
                </div>

                {/* Timeline Stops list */}
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-8 before:w-0.5 before:border-l-2 before:border-dashed before:border-gray-200">
                  {stops.map((stop, idx) => (
                    <div key={stop.id} className="relative space-y-4">
                      {/* Timeline dot marker */}
                      <span className="absolute -left-[20px] top-1.5 w-3.5 h-3.5 rounded-full bg-black border-2 border-white shadow-xs z-10"></span>

                      {/* Card fields */}
                      <div className="p-4 border border-gray-150 rounded-2xl bg-white space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">STEP TYPE</label>
                            <select 
                              value={stop.type}
                              onChange={(e) => {
                                const val = e.target.value;
                                setStops(prev => prev.map(s => s.id === stop.id ? { ...s, type: val } : s));
                              }}
                              className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs font-bold focus:outline-none bg-white cursor-pointer text-gray-900"
                            >
                              <option value="Pickup">Pickup</option>
                              <option value="Drop">Drop</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">ADDRESS / GEOMAP</label>
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
                                className="w-full pl-9 pr-4 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">CONTACT NAME</label>
                            <div className="relative">
                              <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                type="text"
                                placeholder="Receiver/Sender Name"
                                value={stop.contact}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setStops(prev => prev.map(s => s.id === stop.id ? { ...s, contact: val } : s));
                                }}
                                className="w-full pl-9 pr-4 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">PHONE</label>
                            <input 
                              type="text"
                              placeholder="+61..."
                              value={stop.phone}
                              onChange={(e) => {
                                const val = e.target.value;
                                setStops(prev => prev.map(s => s.id === stop.id ? { ...s, phone: val } : s));
                              }}
                              className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">RECEIVE TIME</label>
                            <div className="relative">
                              <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input 
                                type="text"
                                placeholder="DD-MM-YYYY --:--"
                                value={stop.time}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setStops(prev => prev.map(s => s.id === stop.id ? { ...s, time: val } : s));
                                }}
                                className="w-full pl-9 pr-4 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none"
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
              <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-3xs text-left space-y-5">
                <div className="flex justify-between items-center mb-2 pb-3 border-b border-gray-50">
                  <h3 className="font-bold text-gray-955 text-xs uppercase tracking-wider flex items-center gap-2">
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
                  <div key={item.id} className="space-y-4">
                    <span className="text-xs font-black text-amber-500 uppercase tracking-wide">ITEM ENTRY #{item.id}</span>
                    <div className="p-4 border border-gray-150 rounded-2xl bg-white space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">CUSTOMER / OWNER</label>
                          <input 
                            type="text"
                            value={item.client}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeclaredItems(prev => prev.map(d => d.id === item.id ? { ...d, client: val } : d));
                            }}
                            className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">LINK PICKUP STOP</label>
                          <select 
                            value={item.pickupStop}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeclaredItems(prev => prev.map(d => d.id === item.id ? { ...d, pickupStop: val } : d));
                            }}
                            className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none bg-white cursor-pointer"
                          >
                            <option>Step #1 Pickup (No Address)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">LINK DROP-OFF STOP</label>
                          <select 
                            value={item.dropStop}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeclaredItems(prev => prev.map(d => d.id === item.id ? { ...d, dropStop: val } : d));
                            }}
                            className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none bg-white cursor-pointer"
                          >
                            <option>Step #2 Drop (No Address)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">ITEM DESCRIPTION / IDENTIFICATION</label>
                          <input 
                            type="text"
                            placeholder="e.g. 2023 Toyota Hilux or General..."
                            value={item.desc}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDeclaredItems(prev => prev.map(d => d.id === item.id ? { ...d, desc: val } : d));
                            }}
                            className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">WEIGHT (KG)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">⚖️</span>
                            <input 
                              type="text"
                              placeholder="e.g. 1500"
                              value={item.weight}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDeclaredItems(prev => prev.map(d => d.id === item.id ? { ...d, weight: val } : d));
                              }}
                              className="w-full pl-9 pr-4 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
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
              
              {/* Load Specifications Card */}
              <div className="bg-[#0B0F17] rounded-3xl p-6 text-white text-left space-y-4 shadow-md">
                <span className="text-[10px] font-black text-amber-500 tracking-wider block uppercase">LOAD SPECIFICATIONS</span>
                
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">CUSTOMER REF NUMBER</label>
                  <input 
                    type="text"
                    value={customerRef}
                    onChange={(e) => setCustomerRef(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none border-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">PRIORITY TAG</label>
                  <div className="flex gap-2">
                    {['MANUAL', 'EXPRESS', 'NIGHT'].map((pTag) => (
                      <button
                        key={pTag}
                        type="button"
                        onClick={() => setPriorityTag(pTag)}
                        className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center ${
                          priorityTag === pTag 
                            ? 'bg-[#FFD400] text-black border-none' 
                            : 'bg-white text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {pTag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">SHIPPING DEADLINE</label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 shrink-0" />
                    <input 
                      type="text"
                      placeholder="DD-MM-YYYY --:--"
                      value={shippingDeadline}
                      onChange={(e) => setShippingDeadline(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none border-none"
                    />
                  </div>
                </div>
              </div>

              {/* Documents & Photos upload box */}
              <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-3xs text-left space-y-4">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider block uppercase">DOCUMENTS & PHOTOS</span>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => triggerToast('Select and upload manifest pdf...')}
                    className="border border-dashed border-gray-250 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer select-none"
                  >
                    <Clipboard className="w-5 h-5 text-blue-550 shrink-0" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">MANIFEST</span>
                  </div>
                  <div 
                    onClick={() => triggerToast('Select and upload cargo photos...')}
                    className="border border-dashed border-gray-250 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer select-none"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">PHOTOS</span>
                  </div>
                </div>
              </div>

              {/* Internal Dispatch Notes */}
              <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-3xs text-left space-y-4">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider block uppercase">INTERNAL DISPATCH NOTES</span>
                <textarea
                  placeholder="Data-codes, site rules, or special procedures..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={4}
                  className="w-full p-4 border border-gray-250 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400] resize-none"
                />
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
