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
  Menu, CheckCircle, Award, Filter, Columns, ArrowUpDown, AlertTriangle, Copy, Scale, Palette, Briefcase, Terminal, Cpu, Database, Wind
} from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = React.useState([
    { id: 'T101', reg: 'NSW - YXZ 123', branch: 'SYDNEY', driver: 'Mike Thompson', driverId: 'DR001', driverImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', type: 'Prime Mover', make: 'Volvo FH540', year: '2021', status: 'ACTIVE', odometer: '125,450 km', compliance: 'Compliant', nextServiceDate: '15/08/2025', nextServiceDays: 'in 21 days', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60' },
    { id: 'C201', reg: 'NSW - CAA 456', branch: 'SYDNEY', driver: 'James Carter', driverId: 'DR005', driverImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', type: 'Car Carrier', make: 'Hino 700', year: '2019', status: 'ACTIVE', odometer: '318,900 km', compliance: 'Expiring Soon', nextServiceDate: '28/07/2025', nextServiceDays: 'in 3 days', img: 'https://images.unsplash.com/photo-1501700490410-184511d73a90?w=600&auto=format&fit=crop&q=60' },
    { id: 'G305', reg: 'NSW - BXZ 789', branch: 'SYDNEY', driver: 'Sarah Johnson', driverId: 'DR008', driverImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60', type: 'General Freight', make: 'Isuzu FSR', year: '2020', status: 'ACTIVE', odometer: '189,230 km', compliance: 'Compliant', nextServiceDate: '05/08/2025', nextServiceDays: 'in 11 days', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60' },
    { id: 'T405', reg: 'VIC - 1AB 2CD', branch: 'MELBOURNE', driver: '–', driverId: '', driverImg: '', type: 'Prime Mover', make: 'Scania R500', year: '2022', status: 'MAINTENANCE', odometer: '98,120 km', compliance: 'Expiring Soon', nextServiceDate: '10/08/2025', nextServiceDays: 'in 16 days', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60' },
    { id: 'D501', reg: 'QLD - 777 XYZ', branch: 'BRISBANE', driver: '–', driverId: '', driverImg: '', type: 'Dangerous Goods', make: 'Volvo FMX', year: '2018', status: 'OUT OF SERVICE', odometer: '412,560 km', compliance: 'Overdue', nextServiceDate: 'Overdue', nextServiceDays: '12 days', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60' },
    { id: 'C601', reg: 'NSW - MBZ 321', branch: 'SYDNEY', driver: 'Daniel Lee', driverId: 'DR003', driverImg: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=60', type: 'Car Carrier', make: 'Mercedes Actros', year: '2021', status: 'ACTIVE', odometer: '156,870 km', compliance: 'Compliant', nextServiceDate: '22/08/2025', nextServiceDays: 'in 28 days', img: 'https://images.unsplash.com/photo-1501700490410-184511d73a90?w=600&auto=format&fit=crop&q=60' },
    { id: 'G701', reg: 'NSW - QUO 654', branch: 'SYDNEY', driver: '–', driverId: '', driverImg: '', type: 'General Freight', make: 'UD Quon', year: '2017', status: 'OUT OF SERVICE', odometer: '532,100 km', compliance: 'Overdue', nextServiceDate: 'Overdue', nextServiceDays: '35 days', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60' },
    { id: 'U801', reg: 'SA - SAH 987', branch: 'ADELAIDE', driver: 'Mark Wilson', driverId: 'DR010', driverImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', type: 'Utilities', make: 'Hino 500', year: '2020', status: 'ACTIVE', odometer: '87,650 km', compliance: 'Compliant', nextServiceDate: '18/08/2025', nextServiceDays: 'in 24 days', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60' }
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
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left font-sans flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none">
                {activeTab === 'DOCUMENTS & COMPLIANCE' ? '5.3 Vehicle Documents & Compliance' : activeTab === 'MAINTENANCE & SERVICE' ? '5.4 Vehicle Maintenance & Service' : activeTab === 'COSTS & EXPENSES' ? '5.5 Vehicle Costs & Expenses' : activeTab === 'ACTIVITY HISTORY' ? '5.6 Vehicle Activity History' : '5.2 Vehicle Details'}
              </h1>
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-500 text-[13px] font-medium mt-1">
              {activeTab === 'DOCUMENTS & COMPLIANCE' 
                 ? 'Manage all documents, licences, registrations and compliance for this vehicle and its assets.' 
                 : activeTab === 'MAINTENANCE & SERVICE'
                 ? 'Track, schedule and manage all maintenance, inspections and service history for this vehicle.'
                 : activeTab === 'COSTS & EXPENSES'
                 ? 'Track all costs and expenses associated with this vehicle.'
                 : activeTab === 'ACTIVITY HISTORY'
                 ? 'View a complete timeline of all activities and events for this vehicle.'
                 : 'View and manage vehicle information, documents, maintenance and assignments.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 sm:mt-0">
             {activeTab === 'DOCUMENTS & COMPLIANCE' || activeTab === 'ACTIVITY HISTORY' ? (
                <button onClick={() => setActiveTab('OVERVIEW')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
                  <ChevronLeft size={16} /> Back to Vehicle Details
                </button>
             ) : activeTab === 'MAINTENANCE & SERVICE' ? (
                <>
                  <button onClick={() => setActiveTab('OVERVIEW')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
                    <ChevronLeft size={16} /> Back to Vehicle Details
                  </button>
                  <button className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-purple-50 shadow-sm transition-colors cursor-pointer">
                    <Plus size={16} /> Add Maintenance
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
                    More Actions <ChevronDownIcon size={16} />
                  </button>
                </>
             ) : activeTab === 'COSTS & EXPENSES' ? (
                <>
                  <button onClick={() => setActiveTab('OVERVIEW')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
                    <ChevronLeft size={16} /> Back to Vehicle Details
                  </button>
                  <button className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-purple-50 shadow-sm transition-colors cursor-pointer">
                    <Plus size={16} /> Add Expense
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
                    More Actions <ChevronDownIcon size={16} />
                  </button>
                </>
             ) : (
                <>
                  <button className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-purple-50 shadow-sm transition-colors cursor-pointer">
                    <Edit size={16} /> Edit
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
                    <Copy size={16} /> Duplicate
                  </button>
                  <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-red-50 shadow-sm transition-colors cursor-pointer">
                    <Trash2 size={16} /> Deactivate
                  </button>
                  <button onClick={() => setManagingVehicle(null)} className="ml-2 w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm bg-white">
                    <X size={18} />
                  </button>
                </>
             )}
          </div>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Profile Card (Left) */}
          <div className="lg:col-span-9 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col relative">
            <div className="p-6 flex flex-col sm:flex-row gap-8">
              {/* Vehicle Photos */}
              <div className="flex flex-col gap-2 shrink-0">
                <div className="w-full sm:w-[300px] h-[200px] rounded-xl overflow-hidden shadow-sm relative border border-gray-100">
                   <img src={managingVehicle.img || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60'} alt="Vehicle Main" className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-4 gap-2 w-full sm:w-[300px]">
                   {[1, 2, 3].map((num) => (
                     <div key={num} className="h-16 rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity border border-gray-100">
                        <img src={managingVehicle.img || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60'} alt="Thumb" className="w-full h-full object-cover" />
                     </div>
                   ))}
                   <div className="h-16 rounded-lg bg-[#1a202c] text-white flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm hover:bg-black transition-colors">
                      +5
                   </div>
                </div>
              </div>

              {/* Vehicle Data Grid */}
              <div className="flex-grow flex flex-col min-w-0">
                 <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight truncate">{managingVehicle.id} – {managingVehicle.make?.toUpperCase() || 'VOLVO FH540'}</h2>
                    <span className="px-2.5 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded-md text-[11px] font-bold uppercase tracking-wider shrink-0">Active</span>
                 </div>
                 
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 pr-4">
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Type</p>
                       <p className="text-sm font-bold text-gray-900">{managingVehicle.type || 'Prime Mover (Truck)'}</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Make / Model</p>
                       <p className="text-sm font-bold text-gray-900">{managingVehicle.make || 'Volvo FH540'}</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Year</p>
                       <p className="text-sm font-bold text-gray-900">{managingVehicle.year || '2021'}</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">VIN / Chassis No.</p>
                       <p className="text-sm font-bold text-gray-900 break-all">{managingVehicle.vin || 'YV2RT60A1MA123456'}</p>
                    </div>
                    
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Registration</p>
                       <p className="text-sm font-bold text-gray-900 uppercase">{managingVehicle.reg || 'ABC123'}</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Odometer</p>
                       <p className="text-sm font-bold text-gray-900">{managingVehicle.odometer || '256,789 km'}</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Engine No.</p>
                       <p className="text-sm font-bold text-gray-900">D13K123456</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Depot / Base</p>
                       <p className="text-sm font-bold text-gray-900">{managingVehicle.branch || 'Sydney Depot'}</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="px-6 pt-4 mt-auto border-t border-gray-100 flex justify-between w-full overflow-x-auto min-w-0 gap-6">
               {['Overview', 'Documents & Compliance', 'Maintenance & Service', 'Costs & Expenses', 'Activity History', 'Notes'].map(tab => (
                  <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab.toUpperCase())}
                     className={`pb-4 text-[13px] font-bold tracking-wide relative whitespace-nowrap cursor-pointer ${activeTab === tab.toUpperCase() ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-700'}`}>
                     {tab}
                  </button>
               ))}
            </div>
          </div>

          {/* Right Side Status/Trailer Card */}
          <div className="lg:col-span-3 flex flex-col gap-6 h-full">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col flex-grow">
            {activeTab === 'DOCUMENTS & COMPLIANCE' || activeTab === 'MAINTENANCE & SERVICE' || activeTab === 'COSTS & EXPENSES' || activeTab === 'ACTIVITY HISTORY' ? (
              <>
                <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">Linked Trailer</h3>
                <div className="flex flex-col gap-4 text-[13px] font-medium h-full justify-between">
                   <div className="flex flex-col items-center justify-center text-center">
                     <div className="w-[120px] h-[80px] rounded-lg overflow-hidden border border-gray-200 mb-3 shadow-sm">
                        <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="Linked Trailer" />
                     </div>
                     <p className="font-bold text-gray-900 text-sm mb-1">TRL201 – 8 Car Carrier</p>
                     <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded text-[10px] font-bold uppercase tracking-widest">Assigned</span>
                   </div>
                   <button className="w-full mt-4 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 py-2 rounded-lg font-bold shadow-sm transition-colors cursor-pointer">
                     View Trailer Details
                   </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">Vehicle Status</h3>
                <div className="flex flex-col gap-4 text-[13px] font-medium">
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Compliance</span>
                      <div className="flex items-center gap-1.5 text-green-600"><span className="font-bold">Compliant</span> <CheckCircle2 size={16} className="fill-green-100" /></div>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Maintenance</span>
                      <div className="flex items-center gap-1.5 text-green-600"><span className="font-bold">Good</span> <CheckCircle2 size={16} className="fill-green-100" /></div>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Insurance</span>
                      <div className="flex items-center gap-1.5 text-green-600"><span className="font-bold">Active</span> <CheckCircle2 size={16} className="fill-green-100" /></div>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Registration</span>
                      <div className="flex items-center gap-1.5 text-green-600"><span className="font-bold">Valid</span> <CheckCircle2 size={16} className="fill-green-100" /></div>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Roadworthy</span>
                      <div className="flex items-center gap-1.5 text-green-600"><span className="font-bold">Valid</span> <CheckCircle2 size={16} className="fill-green-100" /></div>
                   </div>
                   <div className="flex justify-between items-center pb-2">
                      <span className="text-gray-600">GPS Tracking</span>
                      <div className="flex items-center gap-1.5 text-blue-600"><span className="font-bold">Online</span> <div className="w-2 h-2 rounded-full bg-blue-600"></div></div>
                   </div>
                </div>
              </>
            )}
            </div>
            
            {activeTab === 'MAINTENANCE & SERVICE' && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">SERVICE COST SUMMARY <span className="text-gray-500 font-normal normal-case">(This Year)</span></h3>
                <div className="flex flex-col gap-4 text-[13px] font-medium">
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Total Maintenance Cost</span>
                      <span className="font-bold text-gray-900">$12,450.00</span>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Total Labour Cost</span>
                      <span className="font-bold text-gray-900">$4,230.00</span>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Total Parts Cost</span>
                      <span className="font-bold text-gray-900">$8,220.00</span>
                   </div>
                   <div className="flex justify-between items-center pt-1">
                      <span className="text-purple-700 font-bold">Next 12 Months (Est.)</span>
                      <span className="font-bold text-purple-700">$6,750.00</span>
                   </div>
                </div>
              </div>
            )}
            {activeTab === 'COSTS & EXPENSES' && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">COST OVERVIEW <span className="text-gray-500 font-normal normal-case">(This Year)</span></h3>
                <div className="flex items-center gap-6">
                   <div className="relative w-28 h-28 shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                         <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                         <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="43.8, 100" />
                         <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="22.1, 100" strokeDashoffset="-43.8" />
                         <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#a855f7" strokeWidth="6" strokeDasharray="17.4, 100" strokeDashoffset="-65.9" />
                         <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eab308" strokeWidth="6" strokeDasharray="4.6, 100" strokeDashoffset="-83.3" />
                         <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeDasharray="12.1, 100" strokeDashoffset="-87.9" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-[16px] font-black text-gray-900 leading-none">$28,450</span>
                         <span className="text-[10px] font-bold text-gray-500 mt-0.5">Total</span>
                      </div>
                   </div>
                   <div className="flex flex-col gap-2.5 text-[10px] font-bold w-full flex-grow">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> <span className="text-gray-700">Fuel</span></div>
                         <span className="text-gray-500">$12,450 (43.8%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> <span className="text-gray-700">Maintenance</span></div>
                         <span className="text-gray-500">$6,280 (22.1%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> <span className="text-gray-700">Repairs</span></div>
                         <span className="text-gray-500">$4,950 (17.4%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div> <span className="text-gray-700">Registration</span></div>
                         <span className="text-gray-500">$1,320 (4.6%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div> <span className="text-gray-700">Other</span></div>
                         <span className="text-gray-500">$3,450 (12.1%)</span>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Current Trailer Assignment (Left) */}
          <div className="lg:col-span-9 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 relative flex flex-col h-full">
             <div className="flex items-center gap-3 mb-6">
                <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">CURRENT TRAILER ASSIGNMENT</h3>
                <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded text-[10px] font-bold uppercase tracking-widest shrink-0">Assigned</span>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-6 items-start mb-auto">
                <div className="w-full sm:w-[220px] h-[150px] rounded-xl overflow-hidden shadow-sm shrink-0 border border-gray-100">
                   <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60" alt="Trailer" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4 w-full">
                   <div className="col-span-2 sm:col-span-3 flex items-center gap-3 mb-1">
                      <h4 className="text-[17px] font-bold text-gray-900 tracking-tight">TRL201 – 8 Car Carrier</h4>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[10px] font-bold shrink-0">Primary Trailer</span>
                   </div>
                   
                   <div>
                      <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Type</p>
                      <p className="text-sm font-bold text-gray-900">Car Carrier Trailer</p>
                   </div>
                   <div>
                      <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Registration</p>
                      <p className="text-sm font-bold text-gray-900 uppercase">TRL201</p>
                   </div>
                   <div className="col-span-2 sm:col-span-1 sm:row-span-3 flex flex-col gap-2.5 justify-center border-l-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 mt-2 sm:mt-0">
                      <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm h-10">
                         <ArrowUpDown size={14} /> Swap Trailer
                      </button>
                      <button className="w-full px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm h-10">
                         <Trash2 size={14} /> Unassign Trailer
                      </button>
                      <button className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm h-10">
                         <ArrowUpRight size={14} /> View Trailer
                      </button>
                   </div>
                   
                   <div>
                      <p className="text-[11px] font-semibold text-gray-500 mb-0.5">VIN / Chassis No.</p>
                      <p className="text-[12px] font-bold text-gray-900 uppercase break-all">6T9T25A21NOTR1201</p>
                   </div>
                   <div>
                      <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Axles</p>
                      <p className="text-sm font-bold text-gray-900">3</p>
                   </div>
                   
                   <div>
                      <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Depot / Base</p>
                      <p className="text-sm font-bold text-gray-900">Sydney Depot</p>
                   </div>
                   <div>
                      <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Status</p>
                      <p className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-block">Available</p>
                   </div>
                </div>
             </div>
             
             <div className="mt-6 flex items-center gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100/60 text-left">
                <Info size={16} className="text-blue-500 shrink-0" />
                <p className="text-[12px] text-gray-600 font-medium leading-relaxed">This trailer is currently assigned to this vehicle. You can swap, unassign or view trailer details.</p>
             </div>
          </div>

          {/* Upcoming Compliance (Right) */}
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-5 border-b border-gray-50 pb-4">
               <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest leading-snug">Upcoming Compliance <span className="text-gray-500 font-normal normal-case tracking-normal block mt-1">(Next 30 Days)</span></h3>
               <a href="#" className="text-[11px] font-bold text-purple-700 flex items-center gap-0.5 hover:underline whitespace-nowrap mt-0.5">View All <ArrowRight size={12} /></a>
            </div>
            <div className="flex flex-col gap-4">
               {[
                  { name: 'Registration - T101', expiry: 'Expires on 15/07/2025', days: '21 days', color: 'text-green-600 border-green-200 bg-green-50' },
                  { name: 'Insurance - C201', expiry: 'Expires on 18/07/2025', days: '24 days', color: 'text-green-600 border-green-200 bg-green-50' },
                  { name: 'Roadworthy - T101', expiry: 'Expires on 22/07/2025', days: '28 days', color: 'text-orange-600 border-orange-200 bg-orange-50' },
                  { name: 'Heavy Vehicle Inspection', expiry: 'Expires on 05/08/2025', days: '31 days', color: 'text-orange-600 border-orange-200 bg-orange-50' }
               ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center gap-2">
                     <div className="flex gap-2.5 items-start">
                        <FileText size={16} className="text-green-600 mt-0.5 shrink-0" />
                        <div>
                           <div className="text-[12px] font-bold text-gray-900 leading-tight break-words">{item.name}</div>
                           <div className="text-[10px] text-gray-500 mt-1 font-medium">{item.expiry}</div>
                        </div>
                     </div>
                     <span className={`px-2 py-0.5 text-[10px] font-bold border rounded whitespace-nowrap ${item.color}`}>{item.days}</span>
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* Lower Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Vehicle Specifications */}
          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-full">
            <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">VEHICLE SPECIFICATIONS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[12px]">
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Box size={14} className="shrink-0" /> Configuration</div>
                  <span className="font-bold text-gray-900 text-right">6x4</span>
               </div>
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Settings size={14} className="shrink-0" /> Transmission</div>
                  <span className="font-bold text-gray-900 text-right">Automatic</span>
               </div>
               
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Weight size={14} className="shrink-0" /> GVM</div>
                  <span className="font-bold text-gray-900 text-right">26,500 kg</span>
               </div>
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Zap size={14} className="shrink-0" /> Engine</div>
                  <span className="font-bold text-gray-900 text-right">D13 540HP</span>
               </div>
               
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Scale size={14} className="shrink-0" /> Tare Weight</div>
                  <span className="font-bold text-gray-900 text-right">8,750 kg</span>
               </div>
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Droplet size={14} className="shrink-0" /> Fuel Tank Cap</div>
                  <span className="font-bold text-gray-900 text-right">800 L</span>
               </div>
               
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Package size={14} className="shrink-0" /> Payload Cap</div>
                  <span className="font-bold text-gray-900 text-right">17,750 kg</span>
               </div>
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Palette size={14} className="shrink-0" /> Color</div>
                  <span className="font-bold text-gray-900 text-right">White</span>
               </div>
               
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Gauge size={14} className="shrink-0" /> Fuel Type</div>
                  <span className="font-bold text-gray-900 text-right">Diesel</span>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Briefcase size={14} className="shrink-0" /> Primary Use</div>
                  <span className="font-bold text-gray-900 text-right truncate pl-2">Car Transport</span>
               </div>
            </div>
          </div>

          {/* Linked Assets & Connection */}
          <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-full relative">
            <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">LINKED ASSETS & CONNECTION</h3>
            
            <div className="flex flex-col sm:flex-row items-start justify-between relative gap-6 sm:gap-0">
               
               <div className="flex flex-col gap-3.5 text-[12px] w-full z-10 sm:pr-24">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-1.5">
                     <span className="text-gray-600 font-medium">Connected Trailer</span>
                     <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">TRL201 - 8 Car Carrier</span>
                        <span className="px-1.5 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded text-[9px] font-bold">Assigned</span>
                     </div>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                     <span className="text-gray-600 font-medium">Fifth Wheel Type</span>
                     <span className="font-bold text-gray-900">JOST JSK37C</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                     <span className="text-gray-600 font-medium">Electrical Connection</span>
                     <span className="font-bold text-gray-900">7 Pin (ISO 1185)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                     <span className="text-gray-600 font-medium">Air Connection</span>
                     <span className="font-bold text-gray-900">Gladhand (Red/Yellow)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                     <span className="text-gray-600 font-medium">Max Combined GCM</span>
                     <span className="font-bold text-gray-900">62,500 kg</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                     <span className="text-gray-600 font-medium">Last Swapped</span>
                     <span className="font-bold text-gray-900">15 May 2025 - 08:30 AM</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-gray-600 font-medium">Connection Status</span>
                     <span className="font-bold text-green-600">Secure & Active</span>
                  </div>
               </div>

               {/* Asset connection graphic */}
               <div className="static sm:absolute right-0 top-0 bottom-0 w-full sm:w-20 flex flex-row sm:flex-col items-center justify-center sm:justify-between py-2 sm:py-0 border-t border-gray-100 sm:border-0 pt-4 sm:pt-0">
                  <div className="flex flex-col items-center gap-1">
                     <span className="text-[10px] font-bold text-gray-500">T101</span>
                     <TruckIcon size={32} strokeWidth={1.5} className="text-gray-700" />
                  </div>
                  <div className="w-16 h-0.5 sm:w-0.5 sm:h-full bg-green-500 relative flex items-center justify-center mx-2 sm:mx-0 sm:my-2">
                     <div className="absolute w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                        <Check size={12} className="text-white stroke-[3px]" />
                     </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                     <div className="w-10 h-6 border-2 border-gray-700 rounded-sm flex items-center justify-center relative mt-1 bg-gray-50">
                        <div className="absolute -bottom-1 left-1 w-2 h-2 rounded-full bg-gray-800"></div>
                        <div className="absolute -bottom-1 right-1 w-2 h-2 rounded-full bg-gray-800"></div>
                     </div>
                     <span className="text-[10px] font-bold text-gray-500 mt-1">TRL201</span>
                  </div>
               </div>

            </div>
          </div>

          {/* AI Trailer Recommendations */}
          <div className="lg:col-span-3 bg-purple-50/40 border border-purple-100 rounded-2xl shadow-sm p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
               <h3 className="text-[13px] font-black text-purple-900 uppercase tracking-widest leading-snug">AI Trailer Recommendations</h3>
               <span className="bg-purple-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm shrink-0">AI</span>
            </div>
            <p className="text-[11px] text-gray-600 mb-5 font-medium">(AI Add-on) Based on upcoming loads and compatibility.</p>
            
            <div className="flex flex-col gap-4 mb-auto">
               <div className="flex justify-between items-center text-[12px] font-bold text-gray-800 bg-white p-2.5 rounded-lg border border-purple-100 shadow-sm">
                  <span>TRL305 - 6 Car Carrier</span>
                  <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded">95% Match</span>
               </div>
               <div className="flex justify-between items-center text-[12px] font-bold text-gray-800 bg-white p-2.5 rounded-lg border border-purple-100 shadow-sm">
                  <span>TRL202 - 10 Car Carrier</span>
                  <span className="text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">78% Match</span>
               </div>
               <div className="flex justify-between items-center text-[12px] font-bold text-gray-800 bg-white p-2.5 rounded-lg border border-purple-100 shadow-sm">
                  <span>TRL104 - Enclosed Carrier</span>
                  <span className="text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">65% Match</span>
               </div>
            </div>
            
            <button className="w-full mt-6 py-2.5 bg-white border border-purple-200 text-purple-700 rounded-xl text-[12px] font-bold hover:bg-purple-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
               <Star size={14} className="fill-purple-700" /> View All Recommendations
            </button>
          </div>
        </div>

        {/* Bottom Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
           
           {/* Assignment History Table */}
           <div className="lg:col-span-9 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col h-full">
              <div className="p-6 pb-4 border-b border-gray-100">
                 <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">TRUCK / TRAILER ASSIGNMENT HISTORY</h3>
              </div>
              <div className="overflow-x-auto min-w-0">
                 <table className="w-full text-left text-[12px]">
                    <thead>
                       <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-800 bg-gray-50/50">
                          <th className="py-3.5 px-6 whitespace-nowrap">From Date</th>
                          <th className="py-3.5 px-4 whitespace-nowrap">To Date</th>
                          <th className="py-3.5 px-4">Trailer</th>
                          <th className="py-3.5 px-4 whitespace-nowrap">Trailer Type</th>
                          <th className="py-3.5 px-4">Registration</th>
                          <th className="py-3.5 px-4 whitespace-nowrap">Assigned By</th>
                          <th className="py-3.5 px-4">Reason</th>
                          <th className="py-3.5 px-6">Notes</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                       <tr className="hover:bg-gray-50/50">
                          <td className="py-3 px-6 whitespace-nowrap">15 May 2025 08:30 AM</td>
                          <td className="py-3 px-4 whitespace-nowrap">- Current -</td>
                          <td className="py-3 px-4 whitespace-nowrap text-gray-900 font-bold">TRL201 - 8 Car Carrier</td>
                          <td className="py-3 px-4 whitespace-nowrap">Car Carrier</td>
                          <td className="py-3 px-4 uppercase text-gray-900 font-bold">TRL201</td>
                          <td className="py-3 px-4 whitespace-nowrap">Admin User</td>
                          <td className="py-3 px-4 whitespace-nowrap">Regular Assignment</td>
                          <td className="py-3 px-6 text-gray-400">-</td>
                       </tr>
                       <tr className="hover:bg-gray-50/50">
                          <td className="py-3 px-6 whitespace-nowrap">01 May 2025 07:15 AM</td>
                          <td className="py-3 px-4 whitespace-nowrap">15 May 2025 08:30 AM</td>
                          <td className="py-3 px-4 whitespace-nowrap text-gray-900 font-bold">TRL102 - 8 Car Carrier</td>
                          <td className="py-3 px-4 whitespace-nowrap">Car Carrier</td>
                          <td className="py-3 px-4 uppercase text-gray-900 font-bold">TRL102</td>
                          <td className="py-3 px-4 whitespace-nowrap">Admin User</td>
                          <td className="py-3 px-4 whitespace-nowrap">Regular Assignment</td>
                          <td className="py-3 px-6 text-gray-400">-</td>
                       </tr>
                       <tr className="hover:bg-gray-50/50">
                          <td className="py-3 px-6 whitespace-nowrap">20 Apr 2025 06:45 AM</td>
                          <td className="py-3 px-4 whitespace-nowrap">01 May 2025 07:15 AM</td>
                          <td className="py-3 px-4 whitespace-nowrap text-gray-900 font-bold">TRL305 - 6 Car Carrier</td>
                          <td className="py-3 px-4 whitespace-nowrap">Car Carrier</td>
                          <td className="py-3 px-4 uppercase text-gray-900 font-bold">TRL305</td>
                          <td className="py-3 px-4 whitespace-nowrap">Admin User</td>
                          <td className="py-3 px-4 whitespace-nowrap">Regular Assignment</td>
                          <td className="py-3 px-6 text-gray-400">-</td>
                       </tr>
                       <tr className="hover:bg-gray-50/50">
                          <td className="py-3 px-6 whitespace-nowrap">10 Apr 2025 09:10 AM</td>
                          <td className="py-3 px-4 whitespace-nowrap">20 Apr 2025 06:45 AM</td>
                          <td className="py-3 px-4 whitespace-nowrap text-gray-900 font-bold">Unassigned</td>
                          <td className="py-3 px-4 whitespace-nowrap">-</td>
                          <td className="py-3 px-4">-</td>
                          <td className="py-3 px-4 whitespace-nowrap">Admin User</td>
                          <td className="py-3 px-4 whitespace-nowrap">Maintenance</td>
                          <td className="py-3 px-6 whitespace-nowrap text-gray-500">Trailer in workshop</td>
                       </tr>
                    </tbody>
                 </table>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto gap-4">
                 <span className="text-[12px] font-medium text-gray-500">Showing 1 to 4 of 4 records</span>
                 <div className="flex items-center gap-3">
                    <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                       <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                       <button className="px-3 py-1 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                       <button className="px-2.5 py-1 text-gray-400 cursor-not-allowed bg-gray-50"><ChevronRight size={14} /></button>
                    </div>
                    <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                       <option>10 / page</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Quick Actions */}
           <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-full flex flex-col">
              <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">QUICK ACTIONS</h3>
              <div className="flex flex-col gap-4 text-[13px] font-bold text-gray-700 mt-2">
                 <button className="w-full text-left flex items-center gap-3 hover:text-purple-700 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-purple-50 group-hover:border-purple-100 group-hover:text-purple-600 transition-all shadow-sm"><Wrench size={14} /></div> Add Maintenance Record
                 </button>
                 <button className="w-full text-left flex items-center gap-3 hover:text-purple-700 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-purple-50 group-hover:border-purple-100 group-hover:text-purple-600 transition-all shadow-sm"><DollarSign size={14} /></div> Add Expense
                 </button>
                 <button className="w-full text-left flex items-center gap-3 hover:text-purple-700 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-purple-50 group-hover:border-purple-100 group-hover:text-purple-600 transition-all shadow-sm"><Printer size={14} /></div> Print Vehicle Profile
                 </button>
                 <button className="w-full text-left flex items-center gap-3 hover:text-purple-700 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-purple-50 group-hover:border-purple-100 group-hover:text-purple-600 transition-all shadow-sm"><Download size={14} /></div> Export Vehicle Report
                 </button>
                 
                 <div className="h-px w-full bg-gray-100 my-2"></div>
                 
                 <button className="w-full text-left flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-100 transition-all shadow-sm"><Trash2 size={14} /></div> Deactivate Vehicle
                 </button>
              </div>
           </div>

         </div>
        </div>
       )}

       {activeTab === 'DOCUMENTS & COMPLIANCE' && (
         <div className="space-y-6 mt-6">
           {/* Filters */}
           <div className="flex justify-between items-center overflow-x-auto gap-4 pb-2">
              <div className="flex gap-2 shrink-0">
                 {['All', 'Truck Documents', 'Trailer Documents', 'Compliance & Licences', 'Insurance', 'Certificates', 'Other'].map((subtab, i) => (
                    <button key={i} className={`px-4 py-2 rounded-lg text-[12px] font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${i === 0 ? 'bg-white text-purple-700 border-2 border-purple-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                       {subtab}
                    </button>
                 ))}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                 <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                    <Filter size={14} /> Filters
                 </button>
                 <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search documents..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-purple-300 shadow-sm w-48" />
                 </div>
                 <button className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
                    <Download size={14} />
                 </button>
              </div>
           </div>

           {/* Main Body */}
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Documents List */}
              <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col h-full">
                 <div className="p-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                    <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">DOCUMENTS & COMPLIANCE LIST</h3>
                    <span className="px-2 py-0.5 bg-purple-700 text-white rounded text-[10px] font-bold">18</span>
                 </div>
                 <div className="overflow-x-auto min-w-0">
                    <table className="w-full text-left text-[12px]">
                       <thead>
                          <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-800 bg-gray-50/50">
                             <th className="py-3.5 px-6 whitespace-nowrap">Document Type</th>
                             <th className="py-3.5 px-4">Asset</th>
                             <th className="py-3.5 px-4 whitespace-nowrap">Document No.</th>
                             <th className="py-3.5 px-4 whitespace-nowrap">Issue Date</th>
                             <th className="py-3.5 px-4 whitespace-nowrap">Expiry Date</th>
                             <th className="py-3.5 px-4 text-center">Status</th>
                             <th className="py-3.5 px-4 whitespace-nowrap text-right">Days Left</th>
                             <th className="py-3.5 px-4 text-center">Reminder</th>
                             <th className="py-3.5 px-6 text-center">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                          {[
                             { doc: 'Registration', icon: <FileText size={14}/>, asset: 'Truck', no: 'REG-ABC123', issue: '16/08/2024', exp: '15/08/2025', status: 'Valid', days: '21 days', color: 'text-green-600 bg-green-50' },
                             { doc: 'Insurance Certificate', icon: <Shield size={14}/>, asset: 'Truck', no: 'INS-TRK-5577', issue: '18/07/2024', exp: '18/07/2025', status: 'Valid', days: '24 days', color: 'text-green-600 bg-green-50' },
                             { doc: 'Roadworthy Certificate', icon: <CheckCircle2 size={14}/>, asset: 'Truck', no: 'RWC-TRK-8899', issue: '22/01/2025', exp: '22/07/2025', status: 'Expiring Soon', days: '28 days', color: 'text-orange-500 bg-orange-50' },
                             { doc: 'Heavy Vehicle Inspection', icon: <CheckCircle2 size={14}/>, asset: 'Truck', no: 'HVI-TRK-1122', issue: '05/02/2025', exp: '05/08/2025', status: 'Expiring Soon', days: '31 days', color: 'text-orange-500 bg-orange-50' },
                             { doc: 'Green Slip (CTP)', icon: <Shield size={14}/>, asset: 'Truck', no: 'CTP-334455', issue: '01/10/2024', exp: '30/09/2025', status: 'Valid', days: '67 days', color: 'text-green-600 bg-green-50' },
                             { doc: 'National Heavy Vehicle Reg.', icon: <FileText size={14}/>, asset: 'Truck', no: 'NHVR-8877', issue: '12/06/2024', exp: '12/06/2028', status: 'Valid', days: '324 days', color: 'text-green-600 bg-green-50' },
                             { doc: 'Engine Emissions Test', icon: <AlertCircle size={14}/>, asset: 'Truck', no: 'EMI-7788', issue: '10/12/2024', exp: '10/12/2025', status: 'Valid', days: '109 days', color: 'text-green-600 bg-green-50' },
                             { doc: 'Fire Extinguisher Cert.', icon: <CheckCircle2 size={14}/>, asset: 'Truck', no: 'FIRE-5566', issue: '11/01/2025', exp: '11/01/2026', status: 'Valid', days: '141 days', color: 'text-green-600 bg-green-50' }
                          ].map((row, idx) => (
                             <tr key={idx} className="hover:bg-gray-50/50">
                                <td className="py-3 px-6 whitespace-nowrap">
                                   <div className="flex items-center gap-2 text-gray-900 font-bold">
                                      <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 border border-purple-100">{row.icon}</div> {row.doc}
                                   </div>
                                </td>
                                <td className="py-3 px-4">{row.asset}</td>
                                <td className="py-3 px-4">{row.no}</td>
                                <td className="py-3 px-4">{row.issue}</td>
                                <td className="py-3 px-4">{row.exp}</td>
                                <td className="py-3 px-4 text-center">
                                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.color}`}>
                                      {row.status}
                                   </span>
                                </td>
                                <td className={`py-3 px-4 font-bold text-right ${row.color.split(' ')[0]}`}>{row.days}</td>
                                <td className="py-3 px-4">
                                   <div className="flex justify-center">
                                      <div className="w-8 h-4 rounded-full bg-purple-600 relative cursor-pointer opacity-80">
                                         <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                                      </div>
                                   </div>
                                </td>
                                <td className="py-3 px-6">
                                   <div className="flex justify-center items-center gap-3 text-gray-400">
                                      <Eye size={14} className="hover:text-purple-600 cursor-pointer transition-colors" />
                                      <Download size={14} className="hover:text-purple-600 cursor-pointer transition-colors" />
                                      <MoreVertical size={14} className="hover:text-gray-900 cursor-pointer transition-colors" />
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto gap-4">
                    <span className="text-[12px] font-medium text-gray-500">Showing 1 to 8 of 18 documents</span>
                    <div className="flex items-center gap-3">
                       <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                          <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                          <button className="px-3 py-1 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                          <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">2</button>
                          <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">3</button>
                          <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                       </div>
                       <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                          <option>10 / page</option>
                       </select>
                    </div>
                 </div>
              </div>

              {/* Right Column: Insights & Reminders */}
              <div className="lg:col-span-4 space-y-6">
                 
                 {/* Compliance Overview */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                    <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">COMPLIANCE OVERVIEW</h3>
                    <div className="flex items-center gap-6">
                       {/* Donut Chart Mock */}
                       <div className="w-24 h-24 rounded-full border-[10px] border-gray-100 relative flex items-center justify-center shrink-0" style={{ borderTopColor: '#22c55e', borderRightColor: '#f97316', borderBottomColor: '#ef4444' }}>
                          <div className="text-center">
                             <div className="text-xl font-black text-gray-900 leading-none">18</div>
                             <div className="text-[10px] font-bold text-gray-400">Total</div>
                          </div>
                       </div>
                       <div className="flex flex-col gap-3 text-[12px] font-bold w-full">
                          <div className="flex items-center gap-2 justify-between">
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> <span className="text-gray-700">11</span> <span className="text-gray-900">Valid</span></div>
                             <span className="text-gray-500 font-medium">(61.1%)</span>
                          </div>
                          <div className="flex items-center gap-2 justify-between">
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> <span className="text-gray-700">3</span> <span className="text-gray-900">Expiring Soon</span></div>
                             <span className="text-gray-500 font-medium">(16.7%)</span>
                          </div>
                          <div className="flex items-center gap-2 justify-between">
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> <span className="text-gray-700">2</span> <span className="text-gray-900">Overdue</span></div>
                             <span className="text-gray-500 font-medium">(11.1%)</span>
                          </div>
                          <div className="flex items-center gap-2 justify-between">
                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-300"></div> <span className="text-gray-700">2</span> <span className="text-gray-500">Not Uploaded</span></div>
                             <span className="text-gray-500 font-medium">(11.1%)</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Expiring Soon */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-start mb-5 border-b border-gray-50 pb-4">
                       <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest leading-snug">EXPIRING SOON <span className="text-gray-500 font-normal normal-case tracking-normal block mt-1">(Next 30 Days)</span></h3>
                       <a href="#" className="text-[11px] font-bold text-purple-700 flex items-center gap-0.5 hover:underline whitespace-nowrap mt-0.5">View All <ArrowRight size={12} /></a>
                    </div>
                    <div className="flex flex-col gap-4">
                       {[
                          { name: 'Registration - ABC123', expiry: 'Expires on 15/08/2025', days: '21 days', color: 'text-green-600 border-green-200 bg-green-50', icon: <FileText size={16}/> },
                          { name: 'Insurance - INS-TRK-5577', expiry: 'Expires on 18/07/2025', days: '24 days', color: 'text-green-600 border-green-200 bg-green-50', icon: <Shield size={16}/> },
                          { name: 'Roadworthy - RWC-TRK-8899', expiry: 'Expires on 22/07/2025', days: '28 days', color: 'text-orange-500 border-orange-200 bg-orange-50', icon: <CheckCircle2 size={16}/> },
                          { name: 'Heavy Vehicle Inspection', expiry: 'Expires on 05/08/2025', days: '31 days', color: 'text-orange-500 border-orange-200 bg-orange-50', icon: <CheckCircle2 size={16}/> }
                       ].map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center gap-2">
                             <div className="flex gap-2.5 items-start">
                                <div className={`mt-0.5 shrink-0 ${item.color.split(' ')[0]}`}>{item.icon}</div>
                                <div>
                                   <div className="text-[12px] font-bold text-gray-900 leading-tight break-words">{item.name}</div>
                                   <div className="text-[10px] text-gray-500 mt-1 font-medium">{item.expiry}</div>
                                </div>
                             </div>
                             <span className={`px-2 py-0.5 text-[10px] font-bold border rounded whitespace-nowrap ${item.color}`}>{item.days}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Compliance Reminders */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-50">
                       <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">COMPLIANCE REMINDERS</h3>
                       <a href="#" className="text-[11px] font-bold text-purple-700 flex items-center gap-0.5 hover:underline whitespace-nowrap">Manage Reminders <ArrowRight size={12} /></a>
                    </div>
                    <div className="flex flex-col gap-4 text-[12px] font-medium text-gray-700">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> Email reminders</div>
                          <span className="font-bold text-green-600">Enabled</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> SMS reminders</div>
                          <span className="font-bold text-green-600">Enabled</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><Clock size={14} className="text-gray-400" /> Reminder days before expiry</div>
                          <span className="font-bold text-gray-900">30 days</span>
                       </div>
                       <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-1">
                          <div className="flex items-center gap-2"><Users size={14} className="text-gray-400" /> Escalate to</div>
                          <span className="font-bold text-gray-900">Admin, Dispatcher</span>
                       </div>
                    </div>
                 </div>
                 
              </div>
           </div>

           {/* Developer Notes Footer */}
           <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-6 mt-4 shadow-sm">
              <h3 className="text-[13px] font-black text-purple-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                 <div className="bg-purple-700 text-white px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">{"</>"}</div> DEVELOPER NOTES - VEHICLE DOCUMENTS & COMPLIANCE
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-[12px]">
                 <div>
                    <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">1. PURPOSE</h4>
                    <ul className="list-disc pl-4 space-y-2 text-gray-700 font-medium leading-relaxed">
                       <li>Store and manage all vehicle and trailer documents, licences, registrations and compliance records in one place.</li>
                       <li>Track expiry dates and trigger reminders and alerts.</li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">2. KEY FEATURES</h4>
                    <ul className="list-disc pl-4 space-y-2 text-gray-700 font-medium leading-relaxed">
                       <li>Categorised document tabs and filters.</li>
                       <li>Upload, view, download and delete documents.</li>
                       <li>Expiry tracking with colour status.</li>
                       <li>Bulk upload and bulk expiry update.</li>
                       <li>Reminder toggles for each document.</li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">3. AUTOMATION & AI (ADD-ON)</h4>
                    <ul className="list-disc pl-4 space-y-2 text-gray-700 font-medium leading-relaxed">
                       <li>AI scans uploaded documents (OCR) to detect expiry dates and key fields.</li>
                       <li>Auto-create reminders and compliance tasks.</li>
                       <li>AI alerts for upcoming expiries and missing documents.</li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">4. PERMISSIONS</h4>
                    <ul className="list-disc pl-4 space-y-2 text-gray-700 font-medium leading-relaxed">
                       <li><b>Admin:</b> Full access (upload/edit/delete).</li>
                       <li><b>Dispatcher:</b> View all, upload, edit.</li>
                       <li><b>Driver:</b> View own (truck + trailer documents).</li>
                       <li><b>Accounts:</b> View relevant compliance docs.</li>
                    </ul>
                 </div>
              </div>
           </div>
           
         </div>
       )}

       {activeTab === 'MAINTENANCE & SERVICE' && (
         <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
               
               {/* Left Column */}
               <div className="lg:col-span-9 flex flex-col gap-6">
                  {/* Top row in left column */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-full">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">UPCOMING MAINTENANCE</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-auto">
                           <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2 text-purple-700 font-bold text-[12px]"><Wrench size={14} /> Next Service (Km)</div>
                              <div className="text-[18px] font-black text-gray-900 mt-1">270,000 km</div>
                              <div className="text-[11px] font-bold text-green-600">In 13,211 km</div>
                           </div>
                           <div className="flex flex-col gap-1.5 sm:pl-4 border-none sm:border-solid border-l border-gray-100">
                              <div className="flex items-center gap-2 text-purple-700 font-bold text-[12px]"><Calendar size={14} /> Next Service (Date)</div>
                              <div className="text-[18px] font-black text-gray-900 mt-1">22 Aug 2025</div>
                              <div className="text-[11px] font-bold text-green-600">In 28 days</div>
                           </div>
                           <div className="flex flex-col gap-1.5 sm:pl-4 border-none sm:border-solid border-l border-gray-100">
                              <div className="flex items-center gap-2 text-purple-700 font-bold text-[12px]"><ShieldAlert size={14} /> Next Inspection</div>
                              <div className="text-[18px] font-black text-gray-900 mt-1">5 Aug 2025</div>
                              <div className="text-[11px] font-bold text-orange-500">In 11 days</div>
                           </div>
                           <div className="flex flex-col gap-1.5 sm:pl-4 border-none sm:border-solid border-l border-gray-100">
                              <div className="flex items-center gap-2 text-purple-700 font-bold text-[12px]"><RefreshCw size={14} /> Tyre Rotation</div>
                              <div className="text-[18px] font-black text-gray-900 mt-1">15 Aug 2025</div>
                              <div className="text-[11px] font-bold text-green-600">In 21 days</div>
                           </div>
                        </div>
                     </div>
                     <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-full justify-center">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">CURRENT ODOMETER</h3>
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-600 shrink-0">
                              <Gauge size={24} />
                           </div>
                           <div className="flex flex-col min-w-0">
                              <div className="text-[22px] font-black text-gray-900 tracking-tight truncate">256,789 km</div>
                              <div className="text-[11px] font-medium text-gray-500 mt-0.5 truncate">Last Updated: Today, 07:35 AM</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Maintenance History */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
                     <div className="p-6 pb-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">MAINTENANCE HISTORY</h3>
                        <div className="flex items-center gap-3">
                           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                              <Filter size={14} /> Filters
                           </button>
                           <div className="relative hidden sm:block">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input type="text" placeholder="Search maintenance..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-purple-300 shadow-sm w-48" />
                           </div>
                           <button className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
                              <Download size={14} />
                           </button>
                        </div>
                     </div>
                     <div className="overflow-x-auto min-w-0">
                        <table className="w-full text-left text-[12px]">
                           <thead>
                              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-800 bg-gray-50/50">
                                 <th className="py-3.5 px-6 whitespace-nowrap">Date</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Type</th>
                                 <th className="py-3.5 px-4 min-w-[150px]">Description</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Workshop / Supplier</th>
                                 <th className="py-3.5 px-4">Odometer</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Cost (AUD)</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Next Due</th>
                                 <th className="py-3.5 px-4">Status</th>
                                 <th className="py-3.5 px-6 text-center">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">15 May 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-blue-600 font-bold"><div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0"><Settings size={12} /></div> Major Service</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">250,000 km Service</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Volvo Truck Centre Sydney</td>
                                 <td className="py-3 px-4 whitespace-nowrap">250,100 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$1,850.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">270,000 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">10 Apr 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-green-600 font-bold"><div className="w-5 h-5 rounded bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><Droplet size={12} /></div> Oil Change</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">Engine Oil & Filter Change</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Volvo Truck Centre Sydney</td>
                                 <td className="py-3 px-4 whitespace-nowrap">246,800 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$320.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">256,800 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">25 Mar 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-600 font-bold"><div className="w-5 h-5 rounded bg-gray-50 flex items-center justify-center border border-gray-200 shrink-0"><AlertCircle size={12} /></div> Brake Inspection</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">Brake System Inspection</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Volvo Truck Centre Sydney</td>
                                 <td className="py-3 px-4 whitespace-nowrap">242,900 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$210.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">260,000 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">20 Feb 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-600 font-bold"><div className="w-5 h-5 rounded bg-gray-50 flex items-center justify-center border border-gray-200 shrink-0"><RefreshCw size={12} /></div> Tyre Rotation</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">Rotate Tyres</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Tyre Right Campbelltown</td>
                                 <td className="py-3 px-4 whitespace-nowrap">239,450 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$180.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">260,000 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">05 Jan 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-orange-500 font-bold"><div className="w-5 h-5 rounded bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0"><Droplet size={12} /></div> Coolant Flush</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">Cooling System Flush</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Volvo Truck Centre Sydney</td>
                                 <td className="py-3 px-4 whitespace-nowrap">233,000 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$540.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">260,000 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200">Attention</span></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">12 Dec 2024</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-green-600 font-bold"><div className="w-5 h-5 rounded bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><Zap size={12} /></div> Battery Check</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">Battery Load Test</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Volvo Truck Centre Sydney</td>
                                 <td className="py-3 px-4 whitespace-nowrap">228,500 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$95.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">240,000 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">18 Nov 2024</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-blue-600 font-bold"><div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0"><Wind size={12} /></div> Air Filter</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">Air Filter Replacement</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Volvo Truck Centre Sydney</td>
                                 <td className="py-3 px-4 whitespace-nowrap">223,200 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$140.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">243,200 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                     <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto gap-4 rounded-b-2xl">
                        <span className="text-[12px] font-medium text-gray-500">Showing 1 to 7 of 27 records</span>
                        <div className="flex items-center gap-3">
                           <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                              <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                              <button className="px-3 py-1 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">2</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">3</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">4</button>
                              <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                           </div>
                           <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                              <option>10 / page</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* Developer Notes */}
                  <div className="bg-[#f8f9fc] border border-purple-100 rounded-2xl p-6">
                     <h3 className="text-[12px] font-black text-purple-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center shrink-0"><Terminal size={14} className="text-purple-700" /></div>
                        DEVELOPER NOTES – VEHICLE MAINTENANCE & SERVICE
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] text-gray-700">
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Info size={12}/> 1. PURPOSE</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>Centralised maintenance tracking for trucks and linked trailers.</li>
                              <li>Ensure preventive maintenance is scheduled and completed.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Settings size={12}/> 2. KEY FEATURES</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>Schedule by date or odometer.</li>
                              <li>Track service history and costs.</li>
                              <li>Upload invoices / receipts.</li>
                              <li>AI predicts next service intervals.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Cpu size={12}/> 3. AUTOMATION & AI (ADD-ON)</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>AI reads invoices to auto-capture data.</li>
                              <li>Predicts wear & tear based on usage.</li>
                              <li>Alerts for overdue / upcoming services.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Shield size={12}/> 4. PERMISSIONS</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li><strong>Admin:</strong> Full access.</li>
                              <li><strong>Dispatcher:</strong> View, add, edit.</li>
                              <li><strong>Driver:</strong> View (in app), add service request.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Database size={12}/> 5. DATA SOURCES</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>Workshop invoices (upload OCR).</li>
                              <li>Odometer (manual / telematics).</li>
                              <li>Manufacturer service intervals.</li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Column */}
               <div className="lg:col-span-3 flex flex-col gap-6">
                  {/* Maintenance Health */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-full">
                     <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">MAINTENANCE HEALTH</h3>
                     <div className="flex flex-col items-center justify-center flex-grow py-4">
                        <div className="relative w-32 h-32 mb-6">
                           <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="92, 100" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f97316" strokeWidth="6" strokeDasharray="6, 100" strokeDashoffset="-92" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="6" strokeDasharray="2, 100" strokeDashoffset="-98" />
                           </svg>
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-[28px] font-black text-gray-900 leading-none">92%</span>
                              <span className="text-[12px] font-bold text-gray-500 mt-1">Good</span>
                           </div>
                        </div>
                        <div className="flex flex-col gap-3 text-[12px] font-bold w-full max-w-[200px]">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> <span className="text-gray-700">Good (92%)</span></div>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div> <span className="text-gray-700">Attention (6%)</span></div>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> <span className="text-gray-700">Critical (2%)</span></div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Service Reminders */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">SERVICE REMINDERS</h3>
                        <a href="#" className="text-[11px] font-bold text-purple-700 hover:underline">Manage</a>
                     </div>
                     <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0"><Bell size={12} className="text-gray-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Next Service Due</div>
                              <div className="text-[11px] text-gray-500 font-medium">22/08/2025</div>
                           </div>
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 whitespace-nowrap">28 days</span>
                        </div>
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0"><Bell size={12} className="text-gray-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Annual Inspection</div>
                              <div className="text-[11px] text-gray-500 font-medium">05/08/2025</div>
                           </div>
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 whitespace-nowrap">11 days</span>
                        </div>
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0"><Bell size={12} className="text-gray-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Brake Test</div>
                              <div className="text-[11px] text-gray-500 font-medium">10/08/2025</div>
                           </div>
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 whitespace-nowrap">16 days</span>
                        </div>
                        <div className="flex items-start gap-3">
                           <div className="mt-0.5 w-6 h-6 rounded bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0"><Bell size={12} className="text-gray-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Registration Check</div>
                              <div className="text-[11px] text-gray-500 font-medium">15/08/2025</div>
                           </div>
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 whitespace-nowrap">21 days</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
       )}

       {activeTab === 'COSTS & EXPENSES' && (
         <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
               {/* Left Column */}
               <div className="lg:col-span-9 flex flex-col gap-6">
                  {/* COST SUMMARY (This Year) */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                     <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">COST SUMMARY <span className="text-gray-500 font-normal normal-case">(This Year)</span></h3>
                     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="flex items-start gap-3">
                           <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0"><FileText size={14} className="text-purple-600" /></div>
                           <div className="min-w-0">
                              <div className="text-[16px] font-black text-gray-900">$28,450</div>
                              <div className="text-[11px] font-bold text-gray-700 mt-0.5">Total Spend</div>
                              <div className="text-[10px] text-gray-500 font-medium truncate">All categories</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-3 md:pl-4 border-none md:border-solid border-l border-gray-100">
                           <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0"><Wrench size={14} className="text-blue-600" /></div>
                           <div className="min-w-0">
                              <div className="text-[16px] font-black text-gray-900">$2.37</div>
                              <div className="text-[11px] font-bold text-gray-700 mt-0.5">Cost per km</div>
                              <div className="text-[10px] text-gray-500 font-medium truncate">Based on 12,000 km</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-3 md:pl-4 border-none md:border-solid border-l border-gray-100">
                           <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><MapPin size={14} className="text-green-600" /></div>
                           <div className="min-w-0">
                              <div className="text-[16px] font-black text-gray-900">12,000 km</div>
                              <div className="text-[11px] font-bold text-gray-700 mt-0.5">Distance Driven</div>
                              <div className="text-[10px] text-gray-500 font-medium truncate">This year</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-3 md:pl-4 border-none md:border-solid border-l border-gray-100">
                           <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0"><Calendar size={14} className="text-orange-600" /></div>
                           <div className="min-w-0">
                              <div className="text-[16px] font-black text-gray-900">$350</div>
                              <div className="text-[11px] font-bold text-gray-700 mt-0.5">Avg. Monthly Spend</div>
                              <div className="text-[10px] text-gray-500 font-medium truncate">All categories</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-3 md:pl-4 border-none md:border-solid border-l border-gray-100">
                           <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0"><FileText size={14} className="text-purple-600" /></div>
                           <div className="min-w-0">
                              <div className="text-[16px] font-black text-gray-900">$150</div>
                              <div className="text-[11px] font-bold text-gray-700 mt-0.5">Highest Expense</div>
                              <div className="text-[10px] text-gray-500 font-medium truncate">Fuel - 15 May 2025</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Expenses Table */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 pb-0 border-b border-gray-100 overflow-x-auto min-w-0 w-full">
                        <div className="flex gap-6 shrink-0">
                           {['All Expenses', 'Fuel', 'Maintenance', 'Repairs', 'Registration', 'Insurance', 'Tolls', 'Other'].map(tab => (
                              <button key={tab} className={`shrink-0 pb-4 text-[12px] font-bold tracking-wide relative whitespace-nowrap cursor-pointer ${tab === 'All Expenses' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-700'}`}>
                                 {tab}
                              </button>
                           ))}
                        </div>
                        <div className="flex items-center gap-3 pb-4 shrink-0">
                           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                              <Filter size={14} /> Filters
                           </button>
                           <div className="relative hidden sm:block">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input type="text" placeholder="Search expenses..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-purple-300 shadow-sm w-48" />
                           </div>
                           <button className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
                              <Download size={14} />
                           </button>
                        </div>
                     </div>
                     <div className="overflow-x-auto min-w-0">
                        <table className="w-full text-left text-[12px]">
                           <thead>
                              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-800 bg-gray-50/50">
                                 <th className="py-3.5 px-6 whitespace-nowrap">Date</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                                 <th className="py-3.5 px-4 min-w-[200px]">Description</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Reference / Receipt</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap text-right">Amount (AUD)</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap text-right">Odometer</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Added By</th>
                                 <th className="py-3.5 px-6 text-center">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">15 May 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-blue-600 font-bold"><div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0"><Droplet size={12} /></div> Fuel</div></td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900 truncate">Diesel Fill - BP Eastern Creek</div><div className="text-[10px] text-gray-500">437.0 L @ $1.75/L</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-900 font-bold">BP-INV-55421 <FileText size={12} className="text-purple-600 cursor-pointer" /></div></td>
                                 <td className="py-3 px-4 font-bold text-gray-900 text-right">$764.75</td>
                                 <td className="py-3 px-4 whitespace-nowrap text-right">256,450 km</td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900">Mike Thompson</div><div className="text-[10px] text-gray-500">(DR001)</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">10 May 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-green-600 font-bold"><div className="w-5 h-5 rounded bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><Wrench size={12} /></div> Maintenance</div></td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900 truncate">Routine Service - Oil & Filter Change</div><div className="text-[10px] text-gray-500">Engine oil, oil filter, air filter replaced</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-900 font-bold">SRV-10458 <FileText size={12} className="text-purple-600 cursor-pointer" /></div></td>
                                 <td className="py-3 px-4 font-bold text-gray-900 text-right">$350.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap text-right">252,120 km</td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900">Admin User</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">05 May 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-orange-600 font-bold"><div className="w-5 h-5 rounded bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0"><MapPin size={12} /></div> Tolls</div></td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900 truncate">M5 Toll - Eastern Creek to Port Botany</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-900 font-bold">TOLL-M5-4512 <FileText size={12} className="text-purple-600 cursor-pointer" /></div></td>
                                 <td className="py-3 px-4 font-bold text-gray-900 text-right">$28.40</td>
                                 <td className="py-3 px-4 whitespace-nowrap text-right">252,000 km</td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900">Mike Thompson</div><div className="text-[10px] text-gray-500">(DR001)</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">01 May 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-purple-600 font-bold"><div className="w-5 h-5 rounded bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0"><Settings size={12} /></div> Repairs</div></td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900 truncate">Brake Pads Replacement</div><div className="text-[10px] text-gray-500">Front brake pads replaced</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-900 font-bold">RPR-7788 <FileText size={12} className="text-purple-600 cursor-pointer" /></div></td>
                                 <td className="py-3 px-4 font-bold text-gray-900 text-right">$1,250.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap text-right">248,560 km</td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900">Admin User</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">28 Apr 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-blue-600 font-bold"><div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0"><Shield size={12} /></div> Insurance</div></td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900 truncate">Insurance Premium - Q2 2025</div><div className="text-[10px] text-gray-500">Comprehensive Insurance</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-900 font-bold">INS-TRK-5577 <FileText size={12} className="text-purple-600 cursor-pointer" /></div></td>
                                 <td className="py-3 px-4 font-bold text-gray-900 text-right">$1,100.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap text-right">248,000 km</td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900">Admin User</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">20 Apr 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-yellow-600 font-bold"><div className="w-5 h-5 rounded bg-yellow-50 flex items-center justify-center border border-yellow-100 shrink-0"><FileText size={12} /></div> Registration</div></td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900 truncate">Registration Renewal</div><div className="text-[10px] text-gray-500">6 Months</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-900 font-bold">REG-ABC123 <FileText size={12} className="text-purple-600 cursor-pointer" /></div></td>
                                 <td className="py-3 px-4 font-bold text-gray-900 text-right">$660.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap text-right">246,789 km</td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900">Admin User</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">15 Apr 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-slate-600 font-bold"><div className="w-5 h-5 rounded bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0"><FileText size={12} /></div> Other</div></td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900 truncate">Truck Wash</div><div className="text-[10px] text-gray-500">Exterior & Interior</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-900 font-bold">WASH-0021 <FileText size={12} className="text-purple-600 cursor-pointer" /></div></td>
                                 <td className="py-3 px-4 font-bold text-gray-900 text-right">$55.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap text-right">246,200 km</td>
                                 <td className="py-3 px-4"><div className="font-bold text-gray-900">Mike Thompson</div><div className="text-[10px] text-gray-500">(DR001)</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center gap-3 text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /><MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" /></div></td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                     <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto gap-4 rounded-b-2xl">
                        <span className="text-[12px] font-medium text-gray-500">Showing 1 to 7 of 24 expenses</span>
                        <div className="flex items-center gap-3">
                           <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                              <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                              <button className="px-3 py-1 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">2</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">3</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">4</button>
                              <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                           </div>
                           <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                              <option>10 / page</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* Developer Notes */}
                  <div className="bg-[#f8f9fc] border border-purple-100 rounded-2xl p-6">
                     <h3 className="text-[12px] font-black text-purple-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center shrink-0"><Terminal size={14} className="text-purple-700" /></div>
                        DEVELOPER NOTES – VEHICLE COSTS & EXPENSES
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] text-gray-700">
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Info size={12}/> 1. PURPOSE</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>Track and categorise all costs and expenses related to the vehicle.</li>
                              <li>Provide visibility into spending and cost per km.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Settings size={12}/> 2. KEY FEATURES</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>Add, edit, delete expenses.</li>
                              <li>Categorise by expense type.</li>
                              <li>Attach receipts and references.</li>
                              <li>Calculate cost per km and monthly averages.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Cpu size={12}/> 3. AUTOMATION & AI (ADD-ON)</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>OCR scan receipts to auto-capture data.</li>
                              <li>AI suggests expense category.</li>
                              <li>Detect unusual spending patterns and alert.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Shield size={12}/> 4. PERMISSIONS</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li><strong>Admin:</strong> Full access (add/edit/delete).</li>
                              <li><strong>Dispatcher:</strong> View all, add expenses.</li>
                              <li><strong>Driver:</strong> Add expenses (if enabled).</li>
                              <li><strong>Accounts:</strong> View expenses and reports.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Database size={12}/> 5. DATA SOURCES</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>Manual entry (Admin/Driver/Dispatcher).</li>
                              <li>OCR scanned receipts.</li>
                              <li>Fuel card / telematics integrations.</li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Column */}
               <div className="lg:col-span-3 flex flex-col gap-6">
                  {/* YEAR TO DATE BREAKDOWN */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">YEAR TO DATE BREAKDOWN</h3>
                     <div className="flex flex-col gap-4 text-[12px] font-medium">
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Fuel</span>
                           <span className="font-bold text-gray-900">$12,450</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Maintenance</span>
                           <span className="font-bold text-gray-900">$6,280</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Repairs</span>
                           <span className="font-bold text-gray-900">$4,950</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Registration</span>
                           <span className="font-bold text-gray-900">$1,320</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Insurance</span>
                           <span className="font-bold text-gray-900">$1,100</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Tolls</span>
                           <span className="font-bold text-gray-900">$980</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Other</span>
                           <span className="font-bold text-gray-900">$3,450</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                           <span className="font-black text-purple-700 text-[13px]">Total</span>
                           <span className="font-black text-purple-700 text-[14px]">$28,450</span>
                        </div>
                     </div>
                  </div>

                  {/* RECENT EXPENSES */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">RECENT EXPENSES</h3>
                        <a href="#" className="text-[11px] font-bold text-purple-700 flex items-center gap-1 hover:underline">View All <ArrowRight size={12} /></a>
                     </div>
                     <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100"><FileText size={12} className="text-purple-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Fuel - BP Eastern Creek</div>
                              <div className="text-[11px] text-gray-500 font-medium">15 May 2025</div>
                           </div>
                           <span className="text-[11px] font-bold text-green-600 whitespace-nowrap">$764.75</span>
                        </div>
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100"><Wrench size={12} className="text-purple-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Routine Service</div>
                              <div className="text-[11px] text-gray-500 font-medium">10 May 2025</div>
                           </div>
                           <span className="text-[11px] font-bold text-green-600 whitespace-nowrap">$350.00</span>
                        </div>
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100"><Settings size={12} className="text-purple-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Brake Pads Replacement</div>
                              <div className="text-[11px] text-gray-500 font-medium">01 May 2025</div>
                           </div>
                           <span className="text-[11px] font-bold text-green-600 whitespace-nowrap">$1,250.00</span>
                        </div>
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100"><Shield size={12} className="text-purple-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Insurance Premium - Q2</div>
                              <div className="text-[11px] text-gray-500 font-medium">28 Apr 2025</div>
                           </div>
                           <span className="text-[11px] font-bold text-green-600 whitespace-nowrap">$1,100.00</span>
                        </div>
                        <div className="flex items-start gap-3">
                           <div className="mt-0.5 w-6 h-6 rounded bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100"><FileText size={12} className="text-purple-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Truck Wash</div>
                              <div className="text-[11px] text-gray-500 font-medium">15 Apr 2025</div>
                           </div>
                           <span className="text-[11px] font-bold text-green-600 whitespace-nowrap">$55.00</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
       )}

       {activeTab === 'ACTIVITY HISTORY' && (
         <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
               {/* Left Column */}
               <div className="lg:col-span-9 flex flex-col gap-6">
                  {/* Filters Row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                        15 Apr 2025 - 15 May 2025 <Calendar size={14} className="text-gray-500 ml-1" />
                     </button>
                     <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                           <Filter size={14} /> Filters
                        </button>
                        <div className="relative flex-grow sm:w-64">
                           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <input type="text" placeholder="Search activity..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-purple-300 shadow-sm w-full" />
                        </div>
                        <button className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                           <Download size={14} />
                        </button>
                     </div>
                  </div>

                  {/* Activity Table */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
                     <div className="flex gap-6 min-w-max px-6 pt-2 border-b border-gray-100 overflow-x-auto min-w-0 w-full">
                        {['All Activity', 'Assignments', 'Maintenance', 'Documents', 'Compliance', 'Costs', 'Driver', 'Location', 'System'].map(tab => (
                           <button key={tab} className={`pb-4 pt-4 text-[13px] font-bold tracking-wide relative whitespace-nowrap cursor-pointer ${tab === 'All Activity' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-700'}`}>
                              {tab}
                           </button>
                        ))}
                     </div>
                     <div className="overflow-x-auto min-w-0">
                        <table className="w-full text-left text-[12px]">
                           <thead>
                              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-800 bg-white">
                                 <th className="py-4 px-6 whitespace-nowrap">Date & Time</th>
                                 <th className="py-4 px-4 whitespace-nowrap">Activity Type</th>
                                 <th className="py-4 px-4 min-w-[200px]">Description</th>
                                 <th className="py-4 px-4 whitespace-nowrap">Performed By</th>
                                 <th className="py-4 px-4 whitespace-nowrap">Reference / Details</th>
                                 <th className="py-4 px-4 whitespace-nowrap">Location</th>
                                 <th className="py-4 px-6 text-center">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">15 May 2025</div><div className="text-[10px] text-gray-500">08:15 AM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><User size={12} className="text-green-600" /></div> Driver Assigned</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Driver Mike Thompson (DR001)</div><div className="text-[11px] text-gray-500">assigned to vehicle</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">Admin User</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Assignment ID: ASG-7781</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Sydney Depot</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">15 May 2025</div><div className="text-[10px] text-gray-500">07:50 AM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0"><Truck size={12} className="text-purple-600" /></div> Trailer Assigned</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Trailer TRL201 – 8 Car Carrier</div><div className="text-[11px] text-gray-500">assigned to vehicle</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">Admin User</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Assignment ID: ASG-7780</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Sydney Depot</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">15 May 2025</div><div className="text-[10px] text-gray-500">06:45 AM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0"><Wrench size={12} className="text-blue-600" /></div> Service Completed</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Routine Service – Oil & Filter Change</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">Mike Thompson</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">SRV-10458</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Sydney Depot</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">14 May 2025</div><div className="text-[10px] text-gray-500">04:30 PM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0"><FileText size={12} className="text-orange-600" /></div> Fuel Expense</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Fuel purchase at BP Eastern Creek</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">Mike Thompson</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">BP-INV-55421 | $764.75</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Eastern Creek, NSW</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">12 May 2025</div><div className="text-[10px] text-gray-500">09:10 AM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><FileText size={12} className="text-green-600" /></div> Document Uploaded</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Registration Certificate uploaded</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">Mike Thompson</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">REG-ABC123</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Sydney Depot</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">10 May 2025</div><div className="text-[10px] text-gray-500">10:20 PM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-red-50 flex items-center justify-center border border-red-100 shrink-0"><AlertTriangle size={12} className="text-red-600" /></div> Compliance Expiry Alert</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Roadworthy Certificate</div><div className="text-[11px] text-gray-500">expires in 28 days</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">System</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">RWC-TRK-8899</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-400">—</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">08 May 2025</div><div className="text-[10px] text-gray-500">11:05 AM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0"><MapPin size={12} className="text-blue-600" /></div> Location Update</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">GPS location update</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">System</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Lat: -33.8688, Lng: 151.2093</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Moorebank, NSW</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">05 May 2025</div><div className="text-[10px] text-gray-500">02:15 PM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0"><FileText size={12} className="text-orange-600" /></div> Expense Recorded</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Brake Pads Replacement</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">Admin User</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">RPR-7788 | $1,250.00</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Sydney Depot</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                     <div className="px-6 py-4 flex flex-wrap justify-between items-center mt-auto gap-4">
                        <span className="text-[12px] font-medium text-gray-500">Showing 1 to 8 of 68 activities</span>
                        <div className="flex items-center gap-3">
                           <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                              <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                              <button className="px-3 py-1 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">2</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">3</button>
                              <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 bg-white">...</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">9</button>
                              <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                           </div>
                           <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                              <option>10 / page</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* Developer Notes */}
                  <div className="bg-[#f8f9fc] border border-purple-100 rounded-2xl p-6">
                     <h3 className="text-[12px] font-black text-purple-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center shrink-0"><Terminal size={14} className="text-purple-700" /></div>
                        DEVELOPER NOTES – ACTIVITY HISTORY
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] text-gray-700">
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Info size={12}/> 1. PURPOSE</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>Provide a complete audit trail of all activities and events for the vehicle.</li>
                              <li>Ensure transparency, accountability and traceability.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Settings size={12}/> 2. KEY FEATURES</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>Filter by date range, activity type and category.</li>
                              <li>Search by description, reference or user.</li>
                              <li>View detailed activity information.</li>
                              <li>Export activity log to CSV/PDF.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Cpu size={12}/> 3. AUTOMATION & ALERTS</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>Auto-log all system actions and changes.</li>
                              <li>Trigger compliance expiry alerts.</li>
                              <li>Log GPS location updates at defined intervals.</li>
                              <li>Notify on key events and changes.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Shield size={12}/> 4. PERMISSIONS</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li><strong>Admin:</strong> Full access (view/export/delete).</li>
                              <li><strong>Dispatcher:</strong> View all activity.</li>
                              <li><strong>Driver:</strong> View own related activity only.</li>
                              <li><strong>Accounts:</strong> View cost & expense activity.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Database size={12}/> 5. DATA SOURCES</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>System actions and user activities.</li>
                              <li>GPS / Telematics data.</li>
                              <li>Maintenance, compliance, document and costs modules.</li>
                           </ul>
                        </div>
                     </div>
                  </div>
                  
                  <div className="text-right text-[11px] text-gray-500 font-medium pb-4">
                     <span className="mr-8">All times shown in your local time (AEST)</span>
                     <span>• Data auto-refreshes every 5 minutes</span>
                  </div>
               </div>

               {/* Right Column */}
               <div className="lg:col-span-3 flex flex-col gap-6">
                  {/* ACTIVITY SUMMARY */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">ACTIVITY SUMMARY <span className="text-gray-500 font-normal normal-case">(This Period)</span></h3>
                     <div className="flex flex-col gap-4 text-[12px] font-medium">
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><User size={14} className="text-green-600" /> <span className="text-gray-700">Assignments</span></div>
                           <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded text-[11px]">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Wrench size={14} className="text-blue-600" /> <span className="text-gray-700">Maintenance</span></div>
                           <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">9</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><FileText size={14} className="text-purple-600" /> <span className="text-gray-700">Documents</span></div>
                           <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[11px]">8</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><AlertTriangle size={14} className="text-red-500" /> <span className="text-gray-700">Compliance Alerts</span></div>
                           <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px]">3</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><FileText size={14} className="text-orange-500" /> <span className="text-gray-700">Costs & Expenses</span></div>
                           <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-[11px]">18</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-500" /> <span className="text-gray-700">Location Updates</span></div>
                           <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px]">18</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Settings size={14} className="text-gray-500" /> <span className="text-gray-700">System Events</span></div>
                           <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[11px]">2</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                           <span className="font-black text-purple-700 text-[13px]">Total Activities</span>
                           <span className="font-black text-purple-700 text-[14px]">68</span>
                        </div>
                     </div>
                  </div>

                  {/* RECENT DRIVERS */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">RECENT DRIVERS</h3>
                        <a href="#" className="text-[11px] font-bold text-purple-700 flex items-center gap-1 hover:underline">View All <ArrowRight size={12} /></a>
                     </div>
                     <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"><User size={14} className="text-gray-500" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2">
                                 <div className="text-[12px] font-bold text-gray-900 truncate">Mike Thompson (DR001)</div>
                                 <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-green-600 bg-green-50 border border-green-200">Active</span>
                              </div>
                              <div className="text-[10px] text-gray-500 font-medium mt-0.5">Since 15/05/2025 08:15 AM</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"><User size={14} className="text-gray-500" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2">
                                 <div className="text-[12px] font-bold text-gray-900 truncate">James Patel (DR008)</div>
                                 <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-600 bg-gray-100 border border-gray-200">Inactive</span>
                              </div>
                              <div className="text-[10px] text-gray-500 font-medium mt-0.5">15/05/2025 06:10 AM</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-3">
                           <div className="mt-0.5 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"><User size={14} className="text-gray-500" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2">
                                 <div className="text-[12px] font-bold text-gray-900 truncate">Liam Smith (DR004)</div>
                                 <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-600 bg-gray-100 border border-gray-200">Inactive</span>
                              </div>
                              <div className="text-[10px] text-gray-500 font-medium mt-0.5">14/05/2025 09:22 PM</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* ACTIVITY REMINDERS */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">ACTIVITY REMINDERS</h3>
                        <a href="#" className="text-[11px] font-bold text-purple-700 flex items-center gap-1 hover:underline">Manage Reminders <ArrowRight size={12} /></a>
                     </div>
                     <div className="flex flex-col gap-4 text-[12px] font-medium">
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Bell size={14} className="text-gray-600" /> <span className="text-gray-700">Email reminders</span></div>
                           <span className="font-bold text-green-600">Enabled</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Settings size={14} className="text-gray-600" /> <span className="text-gray-700">SMS reminders</span></div>
                           <span className="font-bold text-green-600">Enabled</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Calendar size={14} className="text-gray-600" /> <span className="text-gray-700">Reminder days before event</span></div>
                           <span className="font-bold text-gray-900">3 days</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                           <div className="flex items-center gap-2"><User size={14} className="text-gray-600" /> <span className="text-gray-700">Escalate to</span></div>
                           <span className="font-bold text-gray-900">Admin, Dispatcher</span>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </div>
       )}

      </div>
    );
  }

  if (showAddModal) {
    return (
      <form onSubmit={handleAddVehicle} className="p-2 sm:p-6 text-left animate-in fade-in duration-200 font-sans min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto space-y-6 pb-20">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                <span>Home</span>
                <ChevronRight size={12} />
                <span>Vehicles</span>
                <ChevronRight size={12} />
                <span>Vehicles List</span>
                <ChevronRight size={12} />
                <span className="text-gray-900 font-bold">Add Vehicle</span>
                <div className="ml-auto flex items-center gap-1.5 text-gray-500 text-xs">
                  <Shield size={12}/> <span className="hidden sm:inline">Guide & Compliance</span>
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">Add New Vehicle</h2>
              <p className="text-xs text-gray-500 font-medium">Create a new vehicle profile by entering all required information.</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm">
                Cancel
              </button>
              <button type="button" className="px-5 py-2 bg-white border border-purple-200 hover:bg-purple-50 text-purple-700 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm">
                Save as Draft
              </button>
              <button type="submit" className="flex items-center justify-center gap-2 px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm min-w-[140px]">
                <Save size={14} strokeWidth={2.5} /> Save Vehicle
              </button>
            </div>
          </div>

          {/* 1. Vehicle Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[13px] font-black text-gray-900">1. Vehicle Information</h3>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-8">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-2 w-32 shrink-0">
                <div className="text-[9px] font-black text-gray-500 tracking-widest uppercase mb-1">VEHICLE PHOTO</div>
                <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 hover:border-purple-400 cursor-pointer group bg-gray-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Camera className="w-5 h-5 text-white mb-1" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Upload</span>
                  </div>
                  <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=256&auto=format&fit=crop" className="w-full h-full object-cover" alt="Truck" />
                </div>
                <input type="text" placeholder="https://images.unsplash.com..." defaultValue="https://images.unsplash.co..." className="w-full text-center text-[9px] px-2 py-1.5 bg-gray-50 border border-gray-200 rounded mt-2 focus:outline-none focus:border-purple-400 text-gray-500" />
              </div>

              {/* Vehicle Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">MAKE *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">MODEL *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">VEHICLE ID * (MANUAL EDIT OPTION)</label>
                  <input type="text" defaultValue="VEH009" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-bold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">YEAR *</label>
                  <div className="relative">
                    <input type="text" placeholder="dd-mm-yyyy" className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">COLOR *</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                    <option>White</option>
                    <option>Red</option>
                    <option>Blue</option>
                    <option>Black</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">TYPE *</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                    <option>Australian</option>
                    <option>Heavy Rigid (HR)</option>
                    <option>Semi Trailer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">REGISTRATION NO *</label>
                  <input type="text" placeholder="e.g. 0412345678" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">VIN NUMBER *</label>
                  <input type="text" placeholder="e.g. email@domain.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">ENGINE NUMBER *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">ODOMETER *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">PRIMARY DEPOT *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div></div>

                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">CITY *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">STATE *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">POSTAL CODE *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Registration Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[13px] font-black text-gray-900">2. Registration Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">REGISTRATION TYPE *</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                    <option>HR (Heavy Rigid)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">REGISTRATION NUMBER *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">REGISTRATION STATE *</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                    <option>NSW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">ISSUE DATE *</label>
                  <div className="relative">
                    <input type="text" placeholder="dd-mm-yyyy" className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">EXPIRY DATE *</label>
                  <div className="relative">
                    <input type="text" placeholder="dd-mm-yyyy" className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">LICENCE CLASS</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                    <option>Class HR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">LICENCE DOCUMENT UPLOAD</label>
                <div className="border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50/50 hover:border-purple-300 transition-colors cursor-pointer group">
                  <div className="p-3 mb-3 group-hover:-translate-y-1 transition-transform">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <p className="text-[13px] font-bold text-gray-900 mb-1">Drag and drop file here, or click to browse</p>
                  <p className="text-[11px] font-medium text-gray-500 mb-4">Support for PDF, PNG, JPG up to 10MB</p>
                  <button type="button" className="px-5 py-2 bg-white border border-gray-200 hover:border-purple-300 text-gray-700 text-xs font-bold rounded-lg shadow-sm transition-colors">
                    Browse File
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Compliance Documents */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[13px] font-black text-gray-900">3. Compliance Documents</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  'Medical Certificate',
                  'Police Verification',
                  'Background Check',
                  'Drug & Alcohol Certificate',
                  'First Aid Certificate',
                  'Training Certificate',
                  'Other Documents'
                ].map(doc => (
                  <div key={doc} className="border border-gray-200 rounded-xl p-4 flex flex-col h-[90px] hover:border-purple-300 transition-colors group cursor-pointer bg-white relative">
                    <h4 className="text-[11px] font-bold text-gray-700 leading-tight pr-6">{doc}</h4>
                    <div className="absolute right-4 top-4 text-gray-400 group-hover:text-purple-600">
                      <Upload size={14} />
                    </div>
                    <div className="mt-auto flex items-center justify-center gap-1.5 text-gray-500 group-hover:text-purple-700 transition-colors text-[10px] font-bold">
                      <Upload size={12} /> Upload
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Maintenance Preferences */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[13px] font-black text-gray-900">5. Maintenance Preferences</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">PRIMARY MECHANIC</label>
                <input type="text" defaultValue="Volvo FH16" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">PREFERRED ROUTES</label>
                <input type="text" defaultValue="Sydney - Melbourne" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">PREFERRED REGIONS</label>
                <input type="text" defaultValue="East Coast" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
              </div>
              
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">MAXIMUM DISTANCE PER TRIP (KM)</label>
                <input type="text" defaultValue="1000" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">DANGEROUS GOODS CERTIFIED</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">HEAVY VEHICLE CERTIFIED</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          </div>

          {/* 6. Notes & Comments */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[13px] font-black text-gray-900">6. Notes & Comments</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">VEHICLE NOTES</label>
                <textarea rows="4" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none"></textarea>
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">INTERNAL COMMENTS</label>
                <textarea rows="4" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none"></textarea>
              </div>
            </div>
          </div>

        </div>
      </form>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left font-sans flex flex-col gap-6">
       
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none mb-1 flex items-center gap-2">
            5.1 Vehicle List <Shield className="w-5 h-5 text-purple-600" />
          </h1>
          <p className="text-gray-500 text-[13px] font-medium mt-1">View and manage all vehicles in your fleet.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 text-[13px] font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
          <button className="border border-gray-200 text-gray-700 hover:bg-gray-50 text-[13px] font-semibold py-2 px-4 rounded-lg transition-colors flex items-center shadow-sm cursor-pointer whitespace-nowrap">
            More Actions <ChevronDownIcon size={14} className="ml-1" />
          </button>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <button className="px-2.5 py-2 bg-white hover:bg-gray-50 text-gray-600 border-r border-gray-200 cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button className="px-2.5 py-2 bg-white hover:bg-gray-50 text-gray-600 cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-5 gap-4">
         <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
               <Truck size={20} />
            </div>
            <div>
               <p className="text-[11px] text-gray-500 font-medium">Total Vehicles</p>
               <h3 className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">32</h3>
               <p className="text-[10px] text-gray-400 mt-1">All vehicles in fleet</p>
            </div>
         </div>
         <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-green-100 flex items-center justify-center text-green-500 flex-shrink-0">
               <CheckCircle2 size={24} strokeWidth={2.5} />
            </div>
            <div>
               <p className="text-[11px] text-gray-500 font-medium">Active</p>
               <h3 className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">28</h3>
               <p className="text-[10px] text-gray-400 mt-1">87.5% of total</p>
            </div>
         </div>
         <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
               <Wrench size={20} />
            </div>
            <div>
               <p className="text-[11px] text-gray-500 font-medium">In Maintenance</p>
               <h3 className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">2</h3>
               <p className="text-[10px] text-gray-400 mt-1">6.3% of total</p>
            </div>
         </div>
         <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
               <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
            <div>
               <p className="text-[11px] text-gray-500 font-medium">Out of Service</p>
               <h3 className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">2</h3>
               <p className="text-[10px] text-gray-400 mt-1">6.3% of total</p>
            </div>
         </div>
         <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
               <FileText size={20} />
            </div>
            <div>
               <p className="text-[11px] text-gray-500 font-medium">Compliance Due</p>
               <h3 className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">6</h3>
               <p className="text-[10px] text-gray-400 mt-1">18.8% of total</p>
            </div>
         </div>
      </div>

      {/* Main Grid: Left Table (9 cols) + Right Sidebar (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         
         {/* Left Side (Table) */}
         <div className="lg:col-span-9 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Table Header/Tabs */}
            <div className="px-5 pt-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
               <div className="flex gap-6 overflow-x-auto min-w-0">
                  {['All Vehicles', 'Active', 'In Maintenance', 'Out of Service', 'Sold / Inactive'].map(tab => (
                     <button key={tab} className={`pb-3 text-[12px] font-semibold uppercase tracking-wider relative whitespace-nowrap ${tab === 'All Vehicles' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-700'}`}>
                        {tab}
                     </button>
                  ))}
               </div>
               <div className="flex items-center gap-3 pb-2 flex-wrap">
                  <button className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                     <Filter size={14} /> Filters
                  </button>
                  <div className="relative">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input type="text" placeholder="Search vehicles..." className="pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-lg w-48 focus:outline-none focus:border-purple-400" />
                  </div>
                  <button className="p-1.5 border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50">
                     <Download size={16} />
                  </button>
               </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-w-0">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-700">
                        <th className="py-3 px-4 whitespace-nowrap">Vehicle / Reg No.</th>
                        <th className="py-3 px-4 whitespace-nowrap">Type / Make / Model</th>
                        <th className="py-3 px-2 text-center">Year</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 whitespace-nowrap">Current Driver</th>
                        <th className="py-3 px-4 text-right">Odometer</th>
                        <th className="py-3 px-4 text-center">Compliance</th>
                        <th className="py-3 px-4 whitespace-nowrap">Next Service</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {vehicles.map((v, i) => (
                        <tr key={i} onClick={() => setManagingVehicle(v)} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                           <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                 <img src={v.img} alt="Vehicle" className="w-10 h-8 rounded object-cover border border-gray-200 shadow-sm" />
                                 <div>
                                    <div className="text-[12px] font-bold text-gray-900 whitespace-nowrap">{v.id} - {v.make}</div>
                                    <div className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{v.reg}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="py-3 px-4">
                              <div className="text-[12px] font-bold text-gray-900 whitespace-nowrap">{v.type}</div>
                              <div className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{v.make}</div>
                           </td>
                           <td className="py-3 px-2 text-[12px] font-medium text-gray-700 text-center">{v.year}</td>
                           <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded whitespace-nowrap ${
                                 v.status === 'ACTIVE' ? 'bg-green-50 text-green-600' :
                                 v.status === 'MAINTENANCE' ? 'bg-orange-50 text-orange-600' :
                                 'bg-red-50 text-red-600'
                              }`}>{v.status === 'MAINTENANCE' ? 'In Maintenance' : v.status === 'OUT OF SERVICE' ? 'Out of Service' : 'Active'}</span>
                           </td>
                           <td className="py-3 px-4">
                              <div className="text-[12px] font-bold text-gray-900 whitespace-nowrap">{v.driver}</div>
                              {v.driverId && <div className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{v.driverId}</div>}
                           </td>
                           <td className="py-3 px-4 text-[12px] font-medium text-gray-700 whitespace-nowrap text-right">{v.odometer}</td>
                           <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-0.5 text-[10px] font-semibold border rounded whitespace-nowrap ${
                                 v.compliance === 'Compliant' ? 'bg-green-50/50 border-green-200 text-green-600' :
                                 v.compliance === 'Expiring Soon' ? 'bg-orange-50/50 border-orange-200 text-orange-600' :
                                 'bg-red-50/50 border-red-200 text-red-600'
                              }`}>{v.compliance}</span>
                           </td>
                           <td className="py-3 px-4">
                              <div className={`text-[12px] font-bold whitespace-nowrap ${v.compliance === 'Overdue' ? 'text-red-600' : 'text-gray-900'}`}>{v.nextServiceDate}</div>
                              <div className={`text-[10px] font-medium whitespace-nowrap ${v.compliance === 'Overdue' ? 'text-red-500' : v.compliance === 'Expiring Soon' ? 'text-orange-500' : 'text-green-500'}`}>{v.nextServiceDays}</div>
                           </td>
                           <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-2 text-purple-700">
                                 <button onClick={() => setManagingVehicle(v)} className="p-1 hover:bg-purple-50 rounded cursor-pointer"><Eye size={16} /></button>
                                 <button className="p-1 hover:bg-purple-50 rounded cursor-pointer"><MoreVertical size={16} /></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 flex-wrap gap-4">
               <span className="text-[12px] font-medium text-gray-500">Showing 1 to 8 of 32 vehicles</span>
               <div className="flex items-center gap-2">
                  <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                     <button className="px-3 py-1.5 text-gray-400 border-r border-gray-200 hover:bg-gray-50 cursor-pointer"><ChevronLeft size={14} /></button>
                     <button className="px-3 py-1.5 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                     <button className="px-3 py-1.5 text-gray-600 font-medium border-r border-gray-200 hover:bg-gray-50 cursor-pointer">2</button>
                     <button className="px-3 py-1.5 text-gray-600 font-medium border-r border-gray-200 hover:bg-gray-50 cursor-pointer">3</button>
                     <button className="px-3 py-1.5 text-gray-600 font-medium border-r border-gray-200 hover:bg-gray-50 cursor-pointer">4</button>
                     <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 cursor-pointer"><ChevronRight size={14} /></button>
                  </div>
                  <select className="border border-gray-200 bg-white rounded-md px-2 py-1.5 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer">
                     <option>10 / page</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Right Side (Sidebar) */}
         <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Compliance Overview Card */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
               <h3 className="text-[13px] font-bold text-gray-900 mb-4">Compliance Overview</h3>
               <div className="flex flex-col xl:flex-row items-center gap-5">
                  <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-inner shrink-0" style={{ background: 'conic-gradient(#10B981 0% 62.5%, #F59E0B 62.5% 81.3%, #EF4444 81.3% 93.8%, #D1D5DB 93.8% 100%)' }}>
                     <div className="absolute w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                        <span className="text-xl font-black text-gray-900 leading-none">32</span>
                        <span className="text-[10px] font-medium text-gray-500 mt-0.5">Total</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <div className="flex items-center gap-2 text-[11px] font-medium text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div> 20 Compliant (62.5%)
                     </div>
                     <div className="flex items-center gap-2 text-[11px] font-medium text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></div> 6 Expiring Soon (18.8%)
                     </div>
                     <div className="flex items-center gap-2 text-[11px] font-medium text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div> 4 Overdue (12.5%)
                     </div>
                     <div className="flex items-center gap-2 text-[11px] font-medium text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0"></div> 2 Not Uploaded (6.3%)
                     </div>
                  </div>
               </div>
            </div>

            {/* Upcoming Compliance */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[13px] font-bold text-gray-900">Upcoming Compliance <span className="text-gray-500 font-normal block sm:inline">(Next 30 Days)</span></h3>
                  <a href="#" className="text-[11px] font-semibold text-purple-700 flex items-center gap-0.5 hover:underline whitespace-nowrap">View All <ArrowRight size={12} /></a>
               </div>
               <div className="flex flex-col gap-4">
                  {[
                     { name: 'Registration - T101', expiry: 'Expires on 15/07/2025', days: '21 days', color: 'text-green-600 bg-green-50' },
                     { name: 'Insurance - C201', expiry: 'Expires on 18/07/2025', days: '24 days', color: 'text-green-600 bg-green-50' },
                     { name: 'Roadworthy - G305', expiry: 'Expires on 22/07/2025', days: '28 days', color: 'text-orange-600 bg-orange-50' },
                     { name: 'Registration - U801', expiry: 'Expires on 25/07/2025', days: '31 days', color: 'text-orange-600 bg-orange-50' }
                  ].map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center gap-2">
                        <div className="flex gap-2 items-start overflow-hidden">
                           <FileText size={14} className="text-green-600 mt-0.5 shrink-0" />
                           <div className="min-w-0">
                              <div className="text-[12px] font-semibold text-gray-900 leading-tight truncate">{item.name}</div>
                              <div className="text-[10px] text-gray-500 mt-0.5 truncate">{item.expiry}</div>
                           </div>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded whitespace-nowrap ${item.color}`}>{item.days}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* AI Vehicle Insights */}
            <div className="bg-purple-50/50 border border-purple-100 rounded-2xl shadow-sm p-5">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[13px] font-bold text-purple-900">AI Vehicle Insights</h3>
                  <span className="bg-purple-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">AI</span>
               </div>
               <ul className="space-y-2 mb-5">
                  <li className="flex items-start gap-2 text-[12px] text-gray-800 font-medium">
                     <Check size={14} className="text-purple-600 mt-0.5 shrink-0" /> 2 vehicles have overdue compliance.
                  </li>
                  <li className="flex items-start gap-2 text-[12px] text-gray-800 font-medium">
                     <Check size={14} className="text-purple-600 mt-0.5 shrink-0" /> 6 compliance items expiring within 30 days.
                  </li>
                  <li className="flex items-start gap-2 text-[12px] text-gray-800 font-medium">
                     <Check size={14} className="text-purple-600 mt-0.5 shrink-0" /> T405 - SCANIA R500 is due for service soon.
                  </li>
                  <li className="flex items-start gap-2 text-[12px] text-gray-800 font-medium">
                     <Check size={14} className="text-purple-600 mt-0.5 shrink-0" /> C201 - HINO 700 tyre rotation recommended.
                  </li>
               </ul>
               <button className="w-full py-2 bg-white border border-purple-200 text-purple-700 rounded-xl text-[12px] font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                  <Star size={14} className="fill-purple-700" /> View AI Insights
               </button>
            </div>

         </div>
      </div>

      {/* Footer Notes Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mt-4 overflow-x-auto min-w-0">
         <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <span className="bg-purple-600 text-white text-[10px] px-1.5 rounded font-mono">&lt;/&gt;</span>
            <h3 className="text-[14px] font-bold text-purple-900">Developer Notes – Vehicle List</h3>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-w-[800px]">
            <div>
               <h4 className="text-[12px] font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Box size={14} /> Purpose</h4>
               <p className="text-[11px] text-gray-600 leading-relaxed">This page provides a summary view of all vehicles in the fleet with status, compliance and key information for quick management.</p>
            </div>
            <div>
               <h4 className="text-[12px] font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Key size={14} /> Key Features</h4>
               <ul className="text-[11px] text-gray-600 leading-relaxed list-disc pl-4 space-y-1">
                  <li>Search, filter and sort vehicles.</li>
                  <li>View status (Active, In Maintenance, Out of Service).</li>
                  <li>Compliance overview with expiry alerts.</li>
                  <li>Quick actions to view vehicle details.</li>
               </ul>
            </div>
            <div>
               <h4 className="text-[12px] font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Shield size={14} /> Business Rules</h4>
               <ul className="text-[11px] text-gray-600 leading-relaxed list-disc pl-4 space-y-1">
                  <li>Only vehicles for the user's company and branches.</li>
                  <li>Compliance status calculated from document expiries.</li>
                  <li>Overdue items appear in red and trigger alerts.</li>
                  <li>Odometer is updated from driver/dispatch or manual entry.</li>
               </ul>
            </div>
            <div className="flex flex-col gap-4">
               <div>
                  <h4 className="text-[12px] font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Lock size={14} /> Permissions</h4>
                  <ul className="text-[11px] text-gray-600 leading-relaxed list-disc pl-4 space-y-1">
                     <li>View: Dispatch, Admin, Accounts</li>
                     <li>Add Vehicle: Admin</li>
                     <li>Edit Vehicle: Admin, Dispatch</li>
                     <li>Delete/Deactivate: Admin</li>
                     <li>Export: Admin, Accounts</li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-[12px] font-bold text-purple-800 mb-2 flex items-center gap-1.5"><ArrowUpRight size={14} /> Interactions</h4>
                  <ul className="text-[11px] text-gray-600 leading-relaxed list-disc pl-4 space-y-1">
                     <li>Add Vehicle: Opens Add Vehicle Modal</li>
                     <li>View Vehicle: Opens Vehicle Details Page</li>
                     <li>More Actions: Edit, Duplicate, Deactivate, Delete, View History, Export</li>
                     <li>Export: Downloads vehicle list (CSV/PDF)</li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="flex flex-wrap justify-between items-center mt-6 pt-3 border-t border-gray-100 text-[10px] text-gray-400 gap-2 min-w-[800px]">
            <span>All times shown in your local time (AEST)</span>
            <span>Data auto-refreshes every 5 minutes</span>
         </div>
      </div>

    </div>
  );
};

export default Vehicles;
