import React from 'react';
import {
  Package, Truck, DollarSign, Globe, Users, Box, Zap, Activity,
  Plus, SlidersHorizontal, Search, FileText, AlertCircle, CheckCircle2, UserCheck,
  Truck as TruckIcon, MapPin, Trash2, ChevronLeft, Camera, Upload, Clock,
  Wrench, Shield, Droplet, List, Grid, X, UserPlus, Clipboard, Star, Edit, Building, Store, ShieldAlert,
  Power, Settings, User, RotateCcw, RefreshCw, Check, Target,
  TrendingUp, TrendingDown, CreditCard, BarChart2, PieChart, ArrowUpRight, ArrowDownRight,
  Download, Eye, Lock, Unlock, MoreVertical, Mail, Phone, Calendar,
  Key, Save, ChevronRight, ChevronDown as ChevronDownIcon, Bell, MessageSquare,
  LifeBuoy, Headphones, Inbox, Printer, ArrowLeft, Gauge, Image as ImageIcon, ArrowRight, ChevronsUpDown, Flag, Info, Car, Weight, Navigation,
  Menu, CheckCircle, Award, Filter, Columns, ArrowUpDown, AlertTriangle
} from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = React.useState([
    { id: 'TRK-102', reg: 'XQG-984', branch: 'SYDNEY', driver: 'Jack Taylor', driverImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', type: 'HEAVY TRUCK', payload: 'PAYLOAD: 20T', status: 'ACTIVE', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60' },
    { id: 'VAN-08', reg: 'BZX-441', branch: 'MELBOURNE', driver: 'Oliver Brown', driverImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', type: 'DELIVERY VAN', payload: 'PAYLOAD: 2.5T', status: 'MAINTENANCE', img: 'https://images.unsplash.com/photo-1501700490410-184511d73a90?w=600&auto=format&fit=crop&q=60' },
    { id: 'TRL-44', reg: 'T-9921', branch: 'BRISBANE', driver: 'Noah Williams', driverImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60', type: 'TRAILER FLATBED', payload: 'PAYLOAD: 40T', status: 'ACTIVE', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60' },
    { id: 'TRK-09', reg: 'XYY-112', branch: 'SYDNEY', driver: 'Liam Smith', driverImg: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=60', type: 'HEAVY TRUCK', payload: 'PAYLOAD: 20T', status: 'INBOUND', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60' },
  ]);

  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [sortBy, setSortBy] = React.useState('id');
  const [viewMode, setViewMode] = React.useState('list'); // 'list' | 'grid'

  // Add/Edit Modals state
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [managingVehicle, setManagingVehicle] = React.useState(null);
  const [newVehicle, setNewVehicle] = React.useState({
    id: '', reg: '', branch: 'SYDNEY', driver: '', type: 'HEAVY TRUCK', payload: 'PAYLOAD: 20T', status: 'ACTIVE'
  });

  const [isEditingVehicle, setIsEditingVehicle] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('OVERVIEW');
  const [editVehicleForm, setEditVehicleForm] = React.useState({
    id: '',
    reg: '',
    make: 'Kenworth',
    model: 'T610',
    year: '2023',
    engine: 'PACCAR MX-13',
    transmission: 'Eaton Fuller',
    vin: '1XKDP4TXBEJ123456',
    branch: 'SYDNEY',
    driver: 'Jack Taylor',
    type: 'HEAVY TRUCK',
    payload: 'PAYLOAD: 20T',
    status: 'ACTIVE',
    odometer: '184,220',
    efficiency: '18.4',
    fuelLevel: '68',
    engineHours: '4,120',
    homeDepot: 'Sydney Central Depot',
    nextService: 'In 4,500 km (~188,720 km)',
    notes: 'Vehicle primarily used for long-haul routes. No smoking in cabin.'
  });

  const startEditingVehicle = () => {
    setEditVehicleForm({
      id: managingVehicle.id,
      reg: managingVehicle.reg,
      make: managingVehicle.make || 'Kenworth',
      model: managingVehicle.model || 'T610',
      year: managingVehicle.year || '2023',
      engine: managingVehicle.engine || 'PACCAR MX-13',
      transmission: managingVehicle.transmission || 'Eaton Fuller',
      vin: managingVehicle.vin || '1XKDP4TXBEJ123456',
      branch: managingVehicle.branch,
      driver: managingVehicle.driver,
      type: managingVehicle.type,
      payload: managingVehicle.payload || 'PAYLOAD: 20T',
      status: managingVehicle.status,
      odometer: managingVehicle.odometer || '184,220',
      efficiency: managingVehicle.efficiency || '18.4',
      fuelLevel: managingVehicle.fuelLevel || '68',
      engineHours: managingVehicle.engineHours || '4,120',
      homeDepot: managingVehicle.homeDepot || 'Sydney Central Depot',
      nextService: managingVehicle.nextService || 'In 4,500 km (~188,720 km)',
      notes: managingVehicle.notes || 'Vehicle primarily used for long-haul routes. No smoking in cabin.'
    });
    setIsEditingVehicle(true);
  };

  const saveVehicleEdits = () => {
    const updated = {
      ...managingVehicle,
      id: editVehicleForm.id.toUpperCase(),
      reg: editVehicleForm.reg.toUpperCase(),
      make: editVehicleForm.make,
      model: editVehicleForm.model,
      year: editVehicleForm.year,
      engine: editVehicleForm.engine,
      transmission: editVehicleForm.transmission,
      vin: editVehicleForm.vin,
      branch: editVehicleForm.branch,
      driver: editVehicleForm.driver,
      type: editVehicleForm.type,
      payload: editVehicleForm.payload,
      status: editVehicleForm.status,
      odometer: editVehicleForm.odometer,
      efficiency: editVehicleForm.efficiency,
      fuelLevel: editVehicleForm.fuelLevel,
      engineHours: editVehicleForm.engineHours,
      homeDepot: editVehicleForm.homeDepot,
      nextService: editVehicleForm.nextService,
      notes: editVehicleForm.notes
    };
    setManagingVehicle(updated);
    setVehicles(prev => prev.map(v => v.id === managingVehicle.id ? updated : v));
    setIsEditingVehicle(false);
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!newVehicle.id || !newVehicle.reg) return;

    const randomAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
    ];

    const randomTrucks = [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60'
    ];

    const entry = {
      ...newVehicle,
      id: newVehicle.id.toUpperCase(),
      reg: newVehicle.reg.toUpperCase(),
      driver: newVehicle.driver || 'Unassigned Driver',
      driverImg: randomAvatars[Math.floor(Math.random() * randomAvatars.length)],
      img: randomTrucks[Math.floor(Math.random() * randomTrucks.length)]
    };

    setVehicles(prev => [entry, ...prev]);
    setShowAddModal(false);
    setNewVehicle({ id: '', reg: '', branch: 'SYDNEY', driver: '', type: 'HEAVY TRUCK', payload: 'PAYLOAD: 20T', status: 'ACTIVE' });
  };

  const deleteVehicle = (id) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.reg.toLowerCase().includes(search.toLowerCase()) ||
      v.branch.toLowerCase().includes(search.toLowerCase()) ||
      v.driver.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && v.status === statusFilter;
  });

  if (managingVehicle) {
    return (
      <div className="p-2 sm:p-6 text-left animate-in fade-in duration-200 bg-[#F9FAFB] min-h-screen font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => { setManagingVehicle(null); setIsEditingVehicle(false); }} className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-xs cursor-pointer">
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">Fleet Asset / {managingVehicle.id}</p>
              {isEditingVehicle ? (
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="text" 
                    value={editVehicleForm.make} 
                    onChange={e => setEditVehicleForm({...editVehicleForm, make: e.target.value})} 
                    className="border border-gray-200 rounded-lg px-2.5 py-1 text-sm font-bold text-gray-900 focus:outline-none focus:border-yellow-400 bg-white"
                    placeholder="Make"
                  />
                  <input 
                    type="text" 
                    value={editVehicleForm.model} 
                    onChange={e => setEditVehicleForm({...editVehicleForm, model: e.target.value})} 
                    className="border border-gray-200 rounded-lg px-2.5 py-1 text-sm font-bold text-gray-900 focus:outline-none focus:border-yellow-400 bg-white"
                    placeholder="Model"
                  />
                  <input 
                    type="text" 
                    value={editVehicleForm.reg} 
                    onChange={e => setEditVehicleForm({...editVehicleForm, reg: e.target.value})} 
                    className="border border-gray-200 rounded-lg px-2.5 py-1 text-sm font-bold text-gray-900 focus:outline-none focus:border-yellow-400 bg-white w-28"
                    placeholder="Reg"
                  />
                  <input 
                    type="text" 
                    value={editVehicleForm.year} 
                    onChange={e => setEditVehicleForm({...editVehicleForm, year: e.target.value})} 
                    className="border border-gray-200 rounded-lg px-2.5 py-1 text-sm font-bold text-gray-900 focus:outline-none focus:border-yellow-400 bg-white w-20"
                    placeholder="Year"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">{managingVehicle.make || 'Kenworth'} {managingVehicle.model || 'T610'}</h1>
                  <p className="text-sm font-semibold text-gray-400 ml-1">{managingVehicle.reg} · {managingVehicle.year || '2023'}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isEditingVehicle ? (
              <div className="flex items-center gap-2.5">
                <select 
                  value={editVehicleForm.status} 
                  onChange={e => setEditVehicleForm({...editVehicleForm, status: e.target.value})} 
                  className="px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs font-bold text-gray-700 focus:outline-none shadow-xs cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="INBOUND">INBOUND</option>
                </select>
                <button 
                  type="button"
                  onClick={() => setIsEditingVehicle(false)} 
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 bg-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={saveVehicleEdits} 
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#FFD400] hover:bg-yellow-400 text-black rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            ) : (
              <>
                <span className={`px-4 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 shadow-sm ${
                  managingVehicle.status === 'ACTIVE'
                    ? 'bg-green-50 text-green-600 border-green-100'
                    : managingVehicle.status === 'MAINTENANCE'
                      ? 'bg-red-50 text-red-600 border-red-100'
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    managingVehicle.status === 'ACTIVE' ? 'bg-green-500' : managingVehicle.status === 'MAINTENANCE' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  {managingVehicle.status}
                </span>
                <button 
                  onClick={startEditingVehicle}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#121824] hover:bg-black text-white rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer"
                >
                  <Edit size={16} /> Edit
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-[#0B0F17] rounded-3xl p-6 relative aspect-video flex items-start overflow-hidden shadow-xl border border-gray-800">
              {managingVehicle.img && <img src={managingVehicle.img} alt="Vehicle" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
              <div className="absolute top-6 left-6 z-10 bg-black/60 p-2 rounded-xl backdrop-blur-md">
                <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-0.5">VIN</p>
                {isEditingVehicle ? (
                  <input 
                    type="text" 
                    value={editVehicleForm.vin} 
                    onChange={e => setEditVehicleForm({...editVehicleForm, vin: e.target.value})} 
                    className="bg-slate-800 text-white text-xs font-bold tracking-wider rounded px-2.5 py-1 border border-slate-700 w-48 mt-1 focus:outline-none focus:border-yellow-400 font-mono"
                    placeholder="VIN code"
                  />
                ) : (
                  <p className="text-white text-sm font-bold tracking-wider">{managingVehicle.vin || '1XKDP4TXBEJ123456'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {[1, 2, 3, 4].map(num => (
                <div key={num} className={`w-16 h-12 rounded-lg overflow-hidden border-2 cursor-pointer ${num === 2 ? 'border-yellow-400' : 'border-gray-200'}`}>
                  {num === 2 && managingVehicle.img ? <img src={managingVehicle.img} alt="Thumb" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={16} /></div>}
                </div>
              ))}
              <div className="w-16 h-12 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
                <Plus size={16} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#121824] rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs text-gray-400 font-bold tracking-wide">Current Driver</p>
                {!isEditingVehicle && (
                  <button className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer">Change Driver</button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 w-full">
                  <img src={managingVehicle.driverImg} alt="Driver" className="w-12 h-12 rounded-full border-2 border-gray-700 object-cover" />
                  <div className="flex-grow">
                    {isEditingVehicle ? (
                      <input 
                        type="text" 
                        value={editVehicleForm.driver} 
                        onChange={e => setEditVehicleForm({...editVehicleForm, driver: e.target.value})} 
                        className="bg-slate-800 text-white text-xs font-bold rounded px-2 py-1 border border-slate-700 w-full focus:outline-none focus:border-yellow-400"
                        placeholder="Driver Name"
                      />
                    ) : (
                      <p className="font-bold text-sm">{managingVehicle.driver}</p>
                    )}
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">DRV-102 • On Shift</p>
                  </div>
                </div>
                {!isEditingVehicle && (
                  <button className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-semibold cursor-pointer">
                    View <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-gray-400 mb-2">
                  <Gauge size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">ODOMETER</span>
                </div>
                <div className="flex items-baseline gap-1">
                  {isEditingVehicle ? (
                    <input 
                      type="text" 
                      value={editVehicleForm.odometer} 
                      onChange={e => setEditVehicleForm({...editVehicleForm, odometer: e.target.value})} 
                      className="w-full border border-gray-250 rounded-lg px-2.5 py-1 text-sm font-bold text-gray-900 focus:outline-none focus:border-yellow-400 bg-white"
                    />
                  ) : (
                    <h3 className="text-2xl font-black text-gray-900">{managingVehicle.odometer || '184,220'}</h3>
                  )}
                  <span className="text-xs font-bold text-gray-400">km</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-gray-400 mb-2">
                  <Activity size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">AVG EFFICIENCY</span>
                </div>
                <div className="flex items-baseline gap-1">
                  {isEditingVehicle ? (
                    <input 
                      type="text" 
                      value={editVehicleForm.efficiency} 
                      onChange={e => setEditVehicleForm({...editVehicleForm, efficiency: e.target.value})} 
                      className="w-full border border-gray-250 rounded-lg px-2.5 py-1 text-sm font-bold text-gray-900 focus:outline-none focus:border-yellow-400 bg-white"
                    />
                  ) : (
                    <h3 className="text-2xl font-black text-gray-900">{managingVehicle.efficiency || '18.4'}</h3>
                  )}
                  <span className="text-xs font-bold text-gray-400">L/100km</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-gray-400 mb-2">
                  <Droplet size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">FUEL LEVEL</span>
                </div>
                <div className="flex items-baseline gap-1">
                  {isEditingVehicle ? (
                    <input 
                      type="text" 
                      value={editVehicleForm.fuelLevel} 
                      onChange={e => setEditVehicleForm({...editVehicleForm, fuelLevel: e.target.value})} 
                      className="w-full border border-gray-250 rounded-lg px-2.5 py-1 text-sm font-bold text-gray-900 focus:outline-none focus:border-yellow-400 bg-white"
                    />
                  ) : (
                    <h3 className="text-2xl font-black text-gray-900">{managingVehicle.fuelLevel || '68'}</h3>
                  )}
                  <span className="text-xs font-bold text-gray-400">%</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-gray-400 mb-2">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">ENGINE HOURS</span>
                </div>
                <div className="flex items-baseline gap-1">
                  {isEditingVehicle ? (
                    <input 
                      type="text" 
                      value={editVehicleForm.engineHours} 
                      onChange={e => setEditVehicleForm({...editVehicleForm, engineHours: e.target.value})} 
                      className="w-full border border-gray-250 rounded-lg px-2.5 py-1 text-sm font-bold text-gray-900 focus:outline-none focus:border-yellow-400 bg-white"
                    />
                  ) : (
                    <h3 className="text-2xl font-black text-gray-900">{managingVehicle.engineHours || '4,120'}</h3>
                  )}
                  <span className="text-xs font-bold text-gray-400">hrs</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-4 border-b border-gray-50 flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-xl text-gray-400"><MapPin size={16} /></div>
                <div className="flex-grow text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">HOME DEPOT</p>
                  {isEditingVehicle ? (
                    <input 
                      type="text" 
                      value={editVehicleForm.homeDepot} 
                      onChange={e => setEditVehicleForm({...editVehicleForm, homeDepot: e.target.value})} 
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-900 focus:outline-none focus:border-yellow-400 mt-1 bg-white"
                    />
                  ) : (
                    <p className="text-sm font-bold text-gray-900">{managingVehicle.homeDepot || 'Sydney Central Depot'}</p>
                  )}
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-grow">
                  <div className="p-2 bg-gray-50 rounded-xl text-gray-400"><Clock size={16} /></div>
                  <div className="flex-grow text-left">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">NEXT SERVICE</p>
                    {isEditingVehicle ? (
                      <input 
                        type="text" 
                        value={editVehicleForm.nextService} 
                        onChange={e => setEditVehicleForm({...editVehicleForm, nextService: e.target.value})} 
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-900 focus:outline-none focus:border-yellow-400 mt-1 bg-white"
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        {managingVehicle.nextService || 'In 4,500 km (~188,720 km)'}
                      </p>
                    )}
                  </div>
                </div>
                {!isEditingVehicle && (
                  <span className="text-xs font-bold text-green-600">On Track</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
          <div className="flex items-center gap-6 px-4 py-3 border-b border-gray-100">
            {['OVERVIEW', 'SPECS', 'MAINTENANCE', 'LOGS'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs pb-3 uppercase tracking-wider cursor-pointer transition-colors ${
                  activeTab === tab 
                    ? 'font-black text-gray-900 border-b-2 border-black' 
                    : 'font-bold text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
            <div className="lg:col-span-2 space-y-8">

              {activeTab === 'OVERVIEW' && (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Settings size={14} className="text-gray-400" />
                      <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">SPECIFICATIONS</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500 font-medium">Make</span>
                        {isEditingVehicle ? (
                          <input 
                            type="text" 
                            value={editVehicleForm.make} 
                            onChange={e => setEditVehicleForm({...editVehicleForm, make: e.target.value})} 
                            className="border border-gray-200 rounded px-2.5 py-0.5 text-xs font-bold text-gray-950 focus:outline-none focus:border-yellow-400 w-32 bg-white"
                          />
                        ) : (
                          <span className="font-bold text-gray-900">{managingVehicle.make || 'Kenworth'}</span>
                        )}
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500 font-medium">Model</span>
                        {isEditingVehicle ? (
                          <input 
                            type="text" 
                            value={editVehicleForm.model} 
                            onChange={e => setEditVehicleForm({...editVehicleForm, model: e.target.value})} 
                            className="border border-gray-200 rounded px-2.5 py-0.5 text-xs font-bold text-gray-950 focus:outline-none focus:border-yellow-400 w-32 bg-white"
                          />
                        ) : (
                          <span className="font-bold text-gray-900">{managingVehicle.model || 'T610'}</span>
                        )}
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500 font-medium">Year</span>
                        {isEditingVehicle ? (
                          <input 
                            type="text" 
                            value={editVehicleForm.year} 
                            onChange={e => setEditVehicleForm({...editVehicleForm, year: e.target.value})} 
                            className="border border-gray-200 rounded px-2.5 py-0.5 text-xs font-bold text-gray-950 focus:outline-none focus:border-yellow-400 w-32 bg-white"
                          />
                        ) : (
                          <span className="font-bold text-gray-900">{managingVehicle.year || '2023'}</span>
                        )}
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-500 font-medium">Engine</span>
                        {isEditingVehicle ? (
                          <input 
                            type="text" 
                            value={editVehicleForm.engine} 
                            onChange={e => setEditVehicleForm({...editVehicleForm, engine: e.target.value})} 
                            className="border border-gray-200 rounded px-2.5 py-0.5 text-xs font-bold text-gray-950 focus:outline-none focus:border-yellow-400 w-32 bg-white"
                          />
                        ) : (
                          <span className="font-bold text-gray-900">{managingVehicle.engine || 'PACCAR MX-13'}</span>
                        )}
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-gray-500 font-medium">Transmission</span>
                        {isEditingVehicle ? (
                          <input 
                            type="text" 
                            value={editVehicleForm.transmission} 
                            onChange={e => setEditVehicleForm({...editVehicleForm, transmission: e.target.value})} 
                            className="border border-gray-200 rounded px-2.5 py-0.5 text-xs font-bold text-gray-950 focus:outline-none focus:border-yellow-400 w-32 bg-white"
                          />
                        ) : (
                          <span className="font-bold text-gray-900">{managingVehicle.transmission || 'Eaton Fuller'}</span>
                        )}
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-gray-500 font-medium">VIN</span>
                        {isEditingVehicle ? (
                          <input 
                            type="text" 
                            value={editVehicleForm.vin} 
                            onChange={e => setEditVehicleForm({...editVehicleForm, vin: e.target.value})} 
                            className="border border-gray-200 rounded px-2.5 py-0.5 text-xs font-bold text-gray-950 focus:outline-none focus:border-yellow-400 w-36 font-mono bg-white"
                          />
                        ) : (
                          <span className="font-bold text-gray-900">{managingVehicle.vin || '1XKDP4TXBEJ123456'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-xl p-5 shadow-xs bg-white text-left">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-gray-400" />
                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Active Load</h3>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-[10px]">In Transit</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-900">
                      <MapPin size={14} className="text-gray-400" />
                      Sydney Port <ArrowRight size={14} className="text-gray-300" /> Blacktown DC
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                        <span>Route progress</span>
                        <span className="text-green-600">65%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <List size={14} className="text-gray-400" />
                      <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">NOTES</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-left">
                      {isEditingVehicle ? (
                        <textarea 
                          rows={2} 
                          value={editVehicleForm.notes} 
                          onChange={e => setEditVehicleForm({...editVehicleForm, notes: e.target.value})} 
                          className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-yellow-400 resize-none"
                        />
                      ) : (
                        <p className="text-sm text-gray-600 font-medium">{managingVehicle.notes || 'Vehicle primarily used for long-haul routes. No smoking in cabin.'}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'SPECS' && (
                <div className="text-left space-y-6">
                  <div className="flex items-center gap-2">
                    <Settings size={14} className="text-gray-400" />
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">TECHNICAL SPECIFICATIONS</h3>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs space-y-4 text-xs font-semibold text-gray-600">
                    <div className="flex justify-between border-b border-gray-100 pb-2.5">
                      <span>Vehicle Type</span>
                      <span className="font-bold text-gray-900">{managingVehicle.type}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2.5">
                      <span>Payload Capacity</span>
                      <span className="font-bold text-gray-900">{managingVehicle.payload || '20 Tonnes'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2.5">
                      <span>Fuel / Powertrain</span>
                      <span className="font-bold text-gray-900">Diesel (Euro 6 compliant)</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2.5">
                      <span>Gross Vehicle Mass (GVM)</span>
                      <span className="font-bold text-gray-900">26,000 kg</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2.5">
                      <span>Wheelbase</span>
                      <span className="font-bold text-gray-900">4,200 mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tyre Configuration</span>
                      <span className="font-bold text-gray-900">10 Stud Alloys - 295/80R22.5</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'MAINTENANCE' && (
                <div className="text-left space-y-6">
                  <div className="flex items-center gap-2">
                    <Wrench size={14} className="text-gray-400" />
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">SERVICE &amp; MAINTENANCE HISTORY</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: 'Regular Scheduled Service A', date: '12 May 2026', odometer: '179,400 km', cost: '$680.00', status: 'Completed' },
                      { title: 'Front Brake Pads & Rotor Replacement', date: '28 Mar 2026', odometer: '168,200 km', cost: '$1,240.00', status: 'Completed' },
                      { title: 'Coolant Hose Seal & System Flush', date: '15 Jan 2026', odometer: '154,000 km', cost: '$410.00', status: 'Completed' }
                    ].map((maint, mi) => (
                      <div key={mi} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-2xs">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{maint.title}</p>
                          <p className="text-xs text-gray-400 mt-1 font-semibold">{maint.date} · Odo: {maint.odometer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{maint.cost}</p>
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold mt-1 inline-block border border-emerald-100">
                            {maint.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'LOGS' && (
                <div className="text-left space-y-6">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-gray-400" />
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">TELEMATICS &amp; SYSTEM LOGS</h3>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <th className="py-2.5 px-4">TIMESTAMP</th>
                          <th className="py-2.5 px-4">EVENT</th>
                          <th className="py-2.5 px-4">DETAILS</th>
                          <th className="py-2.5 px-4 text-right">SEVERITY</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                        <tr>
                          <td className="py-3 px-4 text-gray-400">Today 14:20:12</td>
                          <td className="py-3 px-4 font-bold text-gray-900">GPS Ping Received</td>
                          <td className="py-3 px-4 font-mono text-[10px]">-33.8688, 151.2093 (Sydney Central)</td>
                          <td className="py-3 px-4 text-right"><span className="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-bold uppercase">INFO</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-gray-400">Today 12:45:00</td>
                          <td className="py-3 px-4 font-bold text-gray-900">Speed Threshold Warning</td>
                          <td className="py-3 px-4 text-gray-500">104 km/h in 100 km/h zone</td>
                          <td className="py-3 px-4 text-right"><span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold uppercase">WARN</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-gray-400">Today 08:30:15</td>
                          <td className="py-3 px-4 font-bold text-gray-900">Ignition Triggered On</td>
                          <td className="py-3 px-4 text-gray-500">Driver: Jack Taylor authorized</td>
                          <td className="py-3 px-4 text-right"><span className="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-bold uppercase">INFO</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            <div className="text-left">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">RECENT ACTIVITY</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:via-gray-200 before:to-transparent">

                <div className="relative flex items-start gap-4">
                  <div className="absolute left-0 w-4 h-4 rounded-full border-[3px] border-white bg-gray-300 shadow-sm z-10 mt-1"></div>
                  <div className="pl-8">
                    <h4 className="text-sm font-bold text-gray-900">Telematics Pulse</h4>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Today 14:20 - Optimal</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="absolute left-0 w-4 h-4 rounded-full border-[3px] border-white bg-gray-300 shadow-sm z-10 mt-1"></div>
                  <div className="pl-8">
                    <h4 className="text-sm font-bold text-gray-900">Refueled</h4>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Yesterday - 240L Added</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="absolute left-0 w-4 h-4 rounded-full border-[3px] border-white bg-gray-300 shadow-sm z-10 mt-1"></div>
                  <div className="pl-8">
                    <h4 className="text-sm font-bold text-gray-900">Driver Swap</h4>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Oct 24 - Mitchell AM</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAddModal) {
    return (
      <form onSubmit={handleAddVehicle} className="p-2 sm:p-6 text-left animate-in fade-in duration-200 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
          <div className="flex items-center">
            <button type="button" onClick={() => setShowAddModal(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 mr-4 cursor-pointer shadow-xs transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add Vehicle</h2>
              <p className="text-sm text-gray-500 mt-0.5 font-medium">Register a new truck, trailer or van to the global fleet.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-xs">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-xs">
              <Save size={16} strokeWidth={2.5} /> Save Vehicle
            </button>
          </div>
        </div>

        {/* Plan Limit Alert */}
        <div className="bg-red-50 border border-red-100/60 rounded-xl p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100/50 text-red-500 rounded-lg"><ShieldAlert size={20} /></div>
            <div>
              <h4 className="text-sm font-bold text-red-900">Plan Limit Reached (10/10)</h4>
              <p className="text-xs text-red-700 font-bold mt-0.5">Your 'Starter Fleet' plan does not allow more vehicles. Additional assets will not be saved.</p>
            </div>
          </div>
          <button type="button" className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors shadow-sm cursor-pointer">
            UPGRADE PLAN
          </button>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column (2 spans) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Vehicle Identification */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-6">
                <TruckIcon className="w-5 h-5 text-yellow-500" />
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">VEHICLE IDENTIFICATION</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">REG / NUMBER PLATE</label>
                  <input required type="text" placeholder="e.g. XQG-984" value={newVehicle.reg} onChange={e => setNewVehicle(p => ({ ...p, reg: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">VEHICLE CATEGORY</label>
                  <select value={newVehicle.type} onChange={e => setNewVehicle(p => ({ ...p, type: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold bg-white focus:outline-none cursor-pointer">
                    <option value="HEAVY TRUCK">Heavy Truck (Semi)</option>
                    <option value="DELIVERY VAN">Delivery Van</option>
                    <option value="TRAILER FLATBED">Trailer Flatbed</option>
                  </select>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">VIN / CHASSIS NUMBER</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input required type="text" placeholder="17-digit identification" value={newVehicle.id} onChange={e => setNewVehicle(p => ({ ...p, id: e.target.value }))} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">MAKE & MODEL</label>
                  <input type="text" placeholder="e.g. Kenworth T610" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">YEAR OF MANUFACTURE</label>
                  <input type="text" placeholder="2024" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
              </div>
            </div>

            {/* Specs & Metrics */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-gray-400" />
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">SPECS & METRICS</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">PAYLOAD CAPACITY (TONNES)</label>
                  <input type="text" placeholder="e.g. 22" value={newVehicle.payload} onChange={e => setNewVehicle(p => ({ ...p, payload: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">INITIAL ODOMETER (KM)</label>
                  <div className="relative">
                    <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input type="text" placeholder="12500" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">FUEL TYPE / POWERTRAIN</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold bg-white focus:outline-none cursor-pointer">
                  <option value="Diesel Engine">Diesel Engine</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Vehicle Photo & Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
              <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest text-center mb-4">VEHICLE PHOTO</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-6">
                <div className="p-3 bg-gray-50 rounded-xl mb-3 border border-gray-100">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-bold text-gray-700">Upload Asset Photo</p>
                <p className="text-[10px] text-gray-400 font-bold tracking-wide uppercase mt-1">JPEG, PNG up to 5MB</p>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">ADDITIONAL NOTES</label>
                <textarea rows="4" placeholder="Special requirements or history..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"></textarea>
              </div>
            </div>

            {/* Initial Status Setup */}
            <div className="bg-[#121824] rounded-2xl p-6 shadow-lg border border-gray-800/50">
              <div className="flex items-center gap-2 mb-6">
                <TruckIcon className="w-4 h-4 text-gray-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">INITIAL STATUS SETUP</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">INITIAL STATUS</label>
                  <select value={newVehicle.status} onChange={e => setNewVehicle(p => ({ ...p, status: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 bg-gray-800/50 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-yellow-400 cursor-pointer">
                    <option value="ACTIVE">Active / Available</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="INBOUND">Inbound</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">DEFAULT DEPOT</label>
                  </div>
                  <select value={newVehicle.branch} onChange={e => setNewVehicle(p => ({ ...p, branch: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 bg-gray-800/50 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-yellow-400 cursor-pointer">
                    <option value="SYDNEY">Sydney Central Depot</option>
                    <option value="MELBOURNE">Melbourne Depot</option>
                    <option value="BRISBANE">Brisbane Port Branch</option>
                    <option value="PERTH">Perth Hub</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto bg-white min-h-screen text-left font-sans">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-100 rounded-xl text-gray-800 shadow-xs">
            <Truck size={22} className="text-gray-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1.5">Vehicles &amp; Fleet</h1>
            <p className="text-gray-500 text-[13px]">Manage trucks, vans, and trailers across all branches.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#FFD400] hover:bg-yellow-400 text-black text-[13px] font-semibold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        {/* Fleet Usage */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center h-24 shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">FLEET USAGE</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">84%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-blue-100/50 bg-blue-50/60 text-blue-600">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Needs Maintenance */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center h-24 shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">NEEDS MAINTENANCE</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">08 Trucks</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-red-100/50 bg-red-50/60 text-red-500">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        {/* Safety Check */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center h-24 shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SAFETY CHECK</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">100%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-green-100/50 bg-green-50/60 text-green-600">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        {/* Fuel Cost */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center h-24 shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">FUEL COST</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">$1.42/km</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-amber-100/50 bg-amber-50/60 text-amber-500">
            <Droplet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search Reg, ID or Branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs w-full focus:outline-none focus:border-yellow-400 shadow-inner font-semibold"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400'}`}
              >
                <List size={15} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400'}`}
              >
                <Grid size={15} />
              </button>
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-4 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white cursor-pointer focus:outline-none appearance-none"
              >
                <option value="ALL">Filter Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="INBOUND">INBOUND</option>
              </select>
              <ChevronDownIcon size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-8 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white cursor-pointer focus:outline-none appearance-none"
              >
                <option value="id">SORT BY: ID</option>
                <option value="branch">SORT BY: BRANCH</option>
                <option value="status">SORT BY: STATUS</option>
              </select>
              <ChevronDownIcon size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* View content layout */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm font-medium">No vehicles found.</div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto min-w-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 pl-3 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="py-3 px-4">VEHICLE DETAILS</th>
                  <th className="py-3 px-4">BRANCH</th>
                  <th className="py-3 px-4">ASSIGNED DRIVER</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredVehicles.map(v => (
                  <tr key={v.id} className="text-xs hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 pl-3"><input type="checkbox" className="rounded border-gray-300 animate-none" /></td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={v.img} alt={v.id} className="w-9 h-9 rounded-lg object-cover border border-gray-200" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">{v.id}</div>
                          <span className="text-[10px] text-gray-400 font-medium mt-0.5 block">{v.reg}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-700 uppercase tracking-wide">{v.branch}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <img src={v.driverImg} alt={v.driver} className="w-6 h-6 rounded-full object-cover border border-gray-100 shadow-2xs" />
                        <span className="font-semibold text-gray-800">{v.driver}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="block text-gray-900 uppercase font-semibold">{v.type}</div>
                      <span className="text-[9px] text-gray-400 block mt-0.5 font-medium">{v.payload}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase ${v.status === 'ACTIVE'
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : v.status === 'MAINTENANCE'
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setManagingVehicle(v)}
                        className="px-4 py-1.5 border border-gray-200 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-800 transition-colors cursor-pointer uppercase shadow-2xs"
                      >
                        MANAGE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {filteredVehicles.map(v => {
              return (
                <div key={v.id} className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs hover:border-yellow-400 hover:shadow-yellow-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between">

                  {/* Top card block with image background */}
                  <div className="relative h-44 p-5 flex flex-col justify-between" style={{ backgroundImage: `url(${v.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    {/* Dark overlay for readability on image backgrounds */}
                    <div className="absolute inset-0 bg-black/35 z-0" />

                    {/* Checkbox and Badge Row */}
                    <div className="flex justify-between items-center z-10 relative">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer bg-white"
                      />
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider ${v.status === 'ACTIVE' ? 'bg-emerald-500 text-white' :
                        v.status === 'MAINTENANCE' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                        }`}>{v.status}</span>
                    </div>

                    {/* ID & Registration Details */}
                    <div className="z-10 relative text-left">
                      <h4 className="text-lg font-black text-white tracking-tight">{v.id}</h4>
                      <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mt-0.5">{v.reg}</p>
                    </div>
                  </div>

                  {/* Bottom details block */}
                  <div className="p-5 text-left flex flex-col justify-between flex-grow">
                    {/* Branch & Payload details row */}
                    <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-4">
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Assigned Branch</span>
                        <strong className="text-sm font-black text-gray-800 uppercase block mt-1">{v.branch}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Payload</span>
                        <strong className="text-sm font-black text-gray-800 uppercase block mt-1">{v.payload.replace('PAYLOAD: ', '').toLowerCase()}</strong>
                      </div>
                    </div>

                    {/* Driver details row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={v.driverImg} alt={v.driver} className="w-8 h-8 rounded-full object-cover border border-gray-100 shadow-xs" />
                        <div className="text-left">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Driver</span>
                          <strong className="text-xs font-bold text-gray-800 block mt-0.5">{v.driver}</strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setManagingVehicle(v)}
                        className="p-2 bg-gray-50 text-gray-700 hover:text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors border border-gray-100 cursor-pointer shadow-xs"
                      >
                        <Activity size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Vehicles;
