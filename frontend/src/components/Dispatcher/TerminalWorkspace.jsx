import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar, Filter, Zap, Plus, Search, 
  MoreVertical, X, Phone, User, Truck, MapPin, Navigation, 
  MessageSquare, History, FileText, Settings, AlertCircle, CheckCircle, Clock
} from 'lucide-react';

import { dispatcherRepository } from '../../services/dispatcherRepository';
import { dispatcherStore } from '../../services/dispatcherStore';
import api from '../../services/api';

export default function TerminalWorkspace() {
  const [drivers, setDrivers] = useState([]);
  const [selectedLoadId, setSelectedLoadId] = useState('LD-10583');

  useEffect(() => {
    const fetchPlanningData = async () => {
      try {
        const [driversRes, loadsRes] = await Promise.all([
          api.get('/drivers'),
          api.get('/loads')
        ]);
        const dbDrivers = driversRes.data?.data || [];
        const dbLoads = loadsRes.data?.data || [];

        const formatted = dbDrivers.map(d => {
          const driverName = d.firstName || d.lastName ? `${d.firstName || ''} ${d.lastName || ''}`.trim() : d.driverCode;
          const driverLoads = dbLoads.filter(l => l.driverId === d.id);

          const mappedLoads = driverLoads.map((l, lIndex) => {
            const startTime = 8 + (lIndex * 5); // spacing them out
            const endTime = startTime + 4;
            return {
              id: l.loadRef || l.id.substring(0, 8),
              customer: l.customer?.name || 'Unknown Customer',
              route: l.notes?.includes(' to ') ? l.notes : 'Route Pending',
              startTime,
              endTime,
              durationText: `${startTime}:00 - ${endTime}:00`,
              color: l.status === 'IN_TRANSIT' ? 'emerald' : l.status === 'ASSIGNED' ? 'blue' : 'amber',
              stops: 2,
              progress: '50%',
              loadType: l.type || 'General Freight',
              reqDate: l.scheduledDate ? new Date(l.scheduledDate).toLocaleDateString() : 'N/A',
              driverStatus: 'On Duty',
              vehicle: l.truck ? `${l.truck.make} ${l.truck.model}` : 'Unknown Vehicle',
              trailer: l.trailerId || 'N/A'
            };
          });

          return {
            id: d.id,
            name: driverName,
            status: mappedLoads.some(l => l.color === 'emerald') ? 'On Duty' : 'Standby',
            statusColor: mappedLoads.some(l => l.color === 'emerald') ? 'emerald' : 'blue',
            vehicleType: 'Volvo FH16 750',
            trailerType: 'Car Carrier TR-01 (10 Car)',
            loadsCount: `${mappedLoads.length} Loads`,
            loads: mappedLoads
          };
        });

        setDrivers(formatted);
      } catch (error) {
        console.error('Error fetching terminal workspace data:', error);
      }
    };

    fetchPlanningData();
  }, []);
  const [isCreateLoadModalOpen, setIsCreateLoadModalOpen] = useState(false);
  const [dbCustomers, setDbCustomers] = useState([]);
  const [newLoadForm, setNewLoadForm] = useState({
    customer: '',
    loadType: 'Car Carrying',
    pickupLocation: '',
    deliveryLocation: '',
    startTime: '',
    endTime: '',
    driver: '',
    notes: ''
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/customers');
        setDbCustomers(res.data?.data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const handleCreateLoadSubmit = async () => {
    if (!newLoadForm.customer || !newLoadForm.pickupLocation || !newLoadForm.deliveryLocation) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      const res = await api.post('/loads', {
        customerName: newLoadForm.customer,
        status: 'IN_TRANSIT',
        pickupLocation: newLoadForm.pickupLocation,
        deliveryLocation: newLoadForm.deliveryLocation,
        driverName: newLoadForm.driver,
        scheduledDate: new Date()
      });
      if (res.data?.success) {
        setIsCreateLoadModalOpen(false);
        setNewLoadForm({
          customer: '',
          loadType: 'Car Carrying',
          pickupLocation: '',
          deliveryLocation: '',
          startTime: '',
          endTime: '',
          driver: '',
          notes: ''
        });
        alert('Load created successfully!');
      } else {
        alert('Failed to save load. Check fields.');
      }
    } catch (e) {
      console.error(e);
      alert('Error creating load.');
    }
  };

  const [filters, setFilters] = useState({
    branch: 'All Branches',
    date: '22 May 2026',
    view: 'Day',
    vehicleType: 'All Types',
    driver: 'All Drivers',
    vehicleTrailer: 'All',
    status: 'All Status'
  });

  // Calculate width and left position based on hours (0 to 24)
  // Grid shows 12 AM to 12 AM (24 hours). Left offset is percentage of 24h.
  const calculatePosition = (startTime, endTime) => {
    const left = (startTime / 24) * 100;
    const width = ((endTime - startTime) / 24) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => {
      const matchDriver = filters.driver === 'All Drivers' || d.name === filters.driver;
      const matchStatus = filters.status === 'All Status' || d.status === filters.status;
      // We can expand other filters here as well
      return matchDriver && matchStatus;
    });
  }, [drivers, filters]);

  const selectedLoadData = useMemo(() => {
    for (const d of drivers) {
      const load = d.loads.find(l => l.id === selectedLoadId);
      if (load) {
        return { ...load, driverInfo: d };
      }
    }
    return null;
  }, [selectedLoadId, drivers]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] w-full text-left font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Planning Board</h1>
          <p className="text-sm text-slate-500 mt-1">Plan, optimise and assign loads to drivers and assets.</p>
        </div>
      </div>
      {/* Filters Bar */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 shadow-sm flex-shrink-0 overflow-hidden">
        <div className="flex flex-nowrap items-center gap-3 overflow-x-auto overflow-y-hidden flex-1 w-full pb-2 lg:pb-0 scrollbar-hide">
              
              <div className="flex flex-col gap-1.5 shrink-0">
                <label className="text-[10px] font-semibold text-slate-500 uppercase">Branch</label>
                <select className="w-36 h-9 px-3 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500">
                  <option>All Branches</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-1.5 shrink-0">
                <label className="text-[10px] font-semibold text-slate-500 uppercase">Date</label>
                <div className="flex items-center h-9 border border-slate-200 rounded-lg px-2 bg-white w-48">
                  <Calendar size={14} className="text-slate-400 mr-2" />
                  <span className="text-xs text-slate-700 font-medium flex-1">22 May 2026</span>
                  <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronLeft size={14}/></button>
                  <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronRight size={14}/></button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <label className="text-[10px] font-semibold text-slate-500 uppercase">View</label>
                <select className="w-24 h-9 px-3 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500">
                  <option>Day</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <label className="text-[10px] font-semibold text-slate-500 uppercase">Vehicle Type</label>
                <select className="w-32 h-9 px-3 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500">
                  <option>All Types</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <label className="text-[10px] font-semibold text-slate-500 uppercase">Driver</label>
                <select 
                  className="w-32 h-9 px-3 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500"
                  value={filters.driver}
                  onChange={(e) => handleFilterChange('driver', e.target.value)}
                >
                  <option>All Drivers</option>
                  <option>John Doe</option>
                  <option>Chris Lee</option>
                  <option>Michael Tan</option>
                  <option>Daniel Craig</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <label className="text-[10px] font-semibold text-slate-500 uppercase">Vehicle / Trailer</label>
                <select className="w-32 h-9 px-3 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500">
                  <option>All</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <label className="text-[10px] font-semibold text-slate-500 uppercase">Status</label>
                <select 
                  className="w-28 h-9 px-3 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option>All Status</option>
                  <option>On Duty</option>
                  <option>En Route</option>
                  <option>Off Duty</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 shrink-0 lg:ml-2 w-full lg:w-auto justify-start lg:justify-end">
              <button className="h-9 px-4 flex items-center gap-2 border border-blue-200 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors bg-white">
                <Zap size={14} /> Optimise Board
              </button>
              <button 
                onClick={() => setIsCreateLoadModalOpen(true)}
                className="h-9 px-4 flex items-center gap-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm transition-colors"
              >
                <Plus size={14} /> Create Load
              </button>
            </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Schedule Grid Area */}
          <div className="flex-1 overflow-auto custom-scrollbar bg-white relative whitespace-nowrap">
            <div className="min-w-[1200px]">
              
              {/* Timeline Header */}
              <div className="sticky top-0 z-20 flex bg-white border-b border-slate-200">
                <div className="w-64 flex-shrink-0 p-3 border-r border-slate-200 flex items-center justify-between bg-white">
                  <span className="text-xs font-bold text-slate-800">Drivers & Assets <span className="text-blue-600 font-medium ml-1 cursor-pointer">View List</span></span>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="h-8 flex justify-center items-center text-[11px] font-bold text-slate-700">
                    22 May 2026, Friday
                    <div className="ml-auto mr-4 flex gap-2">
                      <button className="h-7 px-3 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50">
                        <span className="w-3 h-3 rounded-[3px] border-2 border-slate-400"></span> Unassigned Loads (6)
                      </button>
                      <button className="h-7 px-3 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50">
                        <Filter size={12} /> Filter
                      </button>
                    </div>
                  </div>
                  <div className="flex text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'].map((time, idx) => (
                      <div key={idx} className="flex-1 border-l border-slate-100 pl-2 py-1 bg-slate-50">{time}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid Content */}
              <div className="relative">
                {/* Vertical Guidelines */}
                <div className="absolute inset-0 left-64 flex pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-1 border-l border-slate-100 border-dashed"></div>
                  ))}
                </div>
                
                {/* Current Time Line */}
                <div className="absolute top-0 bottom-0 left-[75%] border-l border-red-400 border-dashed z-0 pointer-events-none"></div>

                {/* Rows */}
                <div className="divide-y divide-slate-100">
                  
                  {filteredDrivers.map(driver => (
                    <div key={driver.id} className="flex hover:bg-slate-50/50 transition-colors">
                      <div className="w-64 flex-shrink-0 p-4 border-r border-slate-200 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-900">{driver.name}</p>
                          <span className={`text-[9px] font-bold text-${driver.statusColor}-600 bg-${driver.statusColor}-50 px-1.5 py-0.5 rounded border border-${driver.statusColor}-100`}>
                            {driver.status}
                          </span>
                        </div>
                        <div className="flex gap-2 items-center text-[10px] text-slate-600 mb-1">
                          <Truck size={12} />
                          <div>{driver.vehicleType}</div>
                        </div>
                        <div className="flex gap-2 items-center text-[10px] text-slate-600 mb-3">
                          <div className="w-3 h-3 flex items-center justify-center border border-slate-300 rounded-[2px] bg-slate-100 text-[7px] font-bold">TR</div>
                          <div>{driver.trailerType}</div>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-semibold text-slate-500">{driver.loadsCount}</span>
                          <div className="flex gap-2">
                            <button className="text-slate-400 hover:text-slate-600"><Phone size={12} /></button>
                            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={12} /></button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 relative min-h-[90px] py-2">
                        {driver.loads.map(load => {
                          const { left, width } = calculatePosition(load.startTime, load.endTime);
                          const isSelected = selectedLoadId === load.id;
                          
                          return (
                            <div 
                              key={load.id}
                              onClick={() => setSelectedLoadId(load.id)}
                              className={`absolute top-3 bottom-3 bg-${load.color}-50 border border-${load.color}-200 rounded p-2 cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${load.isFaded ? 'opacity-60' : ''} ${isSelected ? 'border-2 border-red-500 shadow-md z-20 bg-white' : ''}`}
                              style={{ left, width }}
                            >
                              <p className={`text-[10px] font-bold truncate ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>{load.id}</p>
                              <p className={`text-[9px] truncate ${isSelected ? 'font-semibold text-slate-700' : 'text-slate-600'}`}>{load.customer}</p>
                              {load.route && <p className="text-[9px] text-slate-500 mt-1 flex items-center gap-1 truncate"><MapPin size={9} className="shrink-0"/> <span className="truncate">{load.route}</span></p>}
                              <p className={`text-[9px] truncate ${isSelected ? 'font-medium text-red-600' : 'text-slate-500'} mt-1`}>{load.durationText}</p>
                              {load.stops > 0 && (
                                <div className="flex justify-between mt-1 items-center truncate">
                                  <span className="flex items-center text-[9px] text-slate-500 gap-0.5 truncate"><User size={9} className="shrink-0"/> {load.stops}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Selected Load */}
        {selectedLoadData && (
          <div className="w-full lg:w-[340px] bg-white border-l border-slate-200 shadow-xl flex-shrink-0 flex flex-col lg:h-full z-30 transform transition-transform duration-300">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="text-xs font-bold text-slate-800">Selected Load</h2>
              <button 
                onClick={() => setSelectedLoadId(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1 p-5 space-y-6">
              
              {/* Load Title Info */}
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedLoadData.id}</h3>
                  <button className="text-blue-600 text-[10px] font-semibold hover:underline">View Chain of Custody</button>
                </div>
                <div className="inline-flex items-center text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 mb-4">
                  {selectedLoadData.driverStatus}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <span className="text-slate-500 block mb-1 font-medium">Customer</span>
                    <span className="text-slate-800 font-semibold">{selectedLoadData.customer}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1 font-medium">Route</span>
                    <span className="text-slate-800 font-semibold">{selectedLoadData.route || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1 font-medium">Required Date</span>
                    <span className="text-slate-800 font-semibold">{selectedLoadData.reqDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1 font-medium">Load Type</span>
                    <span className="text-slate-800 font-semibold">{selectedLoadData.loadType}</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 text-[11px] font-semibold">
                <button className="px-3 py-2 border-b-2 border-blue-600 text-blue-600 whitespace-nowrap">Overview</button>
                <button className="px-3 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap">Stops ({selectedLoadData.stops})</button>
                <button className="px-3 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap">Items (2)</button>
                <button className="px-3 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap">Documents</button>
                <button className="px-3 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap">Notes</button>
              </div>

              {/* Driver & Assets */}
              <div className="space-y-4">
                
                {/* Driver */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-3">Driver</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${selectedLoadData.driverInfo.name.replace(' ', '+')}&background=e2e8f0&color=0f172a`} alt={selectedLoadData.driverInfo.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="text-[12px] font-bold text-slate-900">{selectedLoadData.driverInfo.name}</p>
                        <span className={`text-[9px] font-bold text-${selectedLoadData.driverInfo.statusColor}-600 bg-${selectedLoadData.driverInfo.statusColor}-50 px-1.5 py-0.5 rounded`}>{selectedLoadData.driverInfo.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><MessageSquare size={14}/></button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><Phone size={14}/></button>
                    </div>
                  </div>
                </div>

                {/* Vehicle */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-3 mt-5">Vehicle</span>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                      <Truck size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900">{selectedLoadData.vehicle.split(' (')[0]}</p>
                      <p className="text-[10px] text-slate-500">{selectedLoadData.vehicle.match(/\(([^)]+)\)/)?.[1] || ''}</p>
                      <span className="text-[9px] font-bold text-emerald-600 inline-block mt-1">Compliant</span>
                    </div>
                  </div>
                </div>

                {/* Trailer */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-3 mt-5">Trailer</span>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                      <div className="text-[10px] font-bold border-2 border-slate-400 rounded-sm px-1 py-0.5">TR</div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900">{selectedLoadData.trailer}</p>
                      <p className="text-[10px] text-slate-500">10 Car Carrier</p>
                      <span className="text-[9px] font-bold text-emerald-600 inline-block mt-1">Compliant</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Load Progress */}
              <div className="border-t border-slate-100 pt-5">
                <span className="text-[11px] font-bold text-slate-800 block mb-4">Load Progress</span>
                
                <div className="relative">
                  <div className="absolute top-[9px] left-3 right-3 h-0.5 bg-slate-100 z-0"></div>
                  <div className="absolute top-[9px] left-3 h-0.5 bg-emerald-500 z-0" style={{width: selectedLoadData.progress}}></div>
                  
                  <div className="flex justify-between relative z-10 text-[9px] font-semibold text-slate-400">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white"><CheckCircle size={10} /></div>
                      <span className="text-emerald-600">Accepted</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white"><CheckCircle size={10} /></div>
                      <span className="text-emerald-600">En Route</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white"><CheckCircle size={10} /></div>
                      <span className="text-emerald-600">At Pickup</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center border-2 border-white"><AlertCircle size={10} /></div>
                      <span className="text-rose-600">Loaded</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span></div>
                      <span>In Transit</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span></div>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full">ETA: 9:45 PM (On time)</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-slate-100 pt-5 pb-4">
                <span className="text-[11px] font-bold text-slate-800 block mb-3">Quick Actions</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-700">
                  <button className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm">
                    <MessageSquare size={12} className="text-slate-400"/> Message Driver
                  </button>
                  <button className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm">
                    <Phone size={12} className="text-slate-400"/> Call Driver
                  </button>
                  <button className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm">
                    <History size={12} className="text-slate-400"/> View GPS History
                  </button>
                  <button className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm">
                    <Navigation size={12} className="text-slate-400"/> Open Route
                  </button>
                  <button className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm">
                    <Zap size={12} className="text-slate-400"/> Swap Trailer
                  </button>
                  <button className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm">
                    <MapPin size={12} className="text-slate-400"/> Transfer Load
                  </button>
                  <button className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm">
                    <Truck size={12} className="text-slate-400"/> Transfer Item
                  </button>
                  <button className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm">
                    <FileText size={12} className="text-slate-400"/> Add Internal Note
                  </button>
                </div>
                <button className="w-full mt-2 flex items-center justify-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm text-[10px] font-semibold text-slate-700">
                  <AlertCircle size={12} className="text-slate-400"/> Flag Delay
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Create Load Modal - Premium Redesign */}
      {isCreateLoadModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsCreateLoadModalOpen(false); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
            style={{ maxWidth: 680, maxHeight: '92vh', animation: 'modalPop 0.22s cubic-bezier(.4,1.6,.6,1) both' }}
          >
            {/* Modal Header */}
            <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #60a5fa 100%)' }} className="px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                  <Plus size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg leading-tight">Create New Load</h2>
                  <p className="text-blue-100 text-xs mt-0.5">Fill in the details to schedule a new dispatch load</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateLoadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5" style={{ background: '#f8fafc' }}>

              {/* Section: Customer & Load */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                    <User size={13} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Customer & Load Type</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Customer <span className="text-red-500">*</span></label>
                    <select
                      value={newLoadForm.customer}
                      onChange={e => setNewLoadForm({ ...newLoadForm, customer: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-semibold"
                    >
                      <option value="" style={{ color: '#0f172a' }}>Select Customer...</option>
                      {dbCustomers.map(c => (
                        <option key={c.id} value={c.name} style={{ color: '#0f172a' }}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Load Type <span className="text-red-500">*</span></label>
                    <select
                      value={newLoadForm.loadType}
                      onChange={e => setNewLoadForm({ ...newLoadForm, loadType: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-semibold"
                    >
                      <option style={{ color: '#0f172a' }}>Car Carrying</option>
                      <option style={{ color: '#0f172a' }}>General Freight</option>
                      <option style={{ color: '#0f172a' }}>Refrigerated</option>
                      <option style={{ color: '#0f172a' }}>Oversized Load</option>
                      <option style={{ color: '#0f172a' }}>Hazardous Goods</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Route */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
                    <Navigation size={13} className="text-emerald-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Route Details</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">
                      <span className="inline-flex items-center gap-1"><MapPin size={11} className="text-emerald-500" /> Pickup Location <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      value={newLoadForm.pickupLocation}
                      onChange={e => setNewLoadForm({ ...newLoadForm, pickupLocation: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                      placeholder="e.g. Sydney"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">
                      <span className="inline-flex items-center gap-1"><MapPin size={11} className="text-rose-500" /> Dropoff Location <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      value={newLoadForm.deliveryLocation}
                      onChange={e => setNewLoadForm({ ...newLoadForm, deliveryLocation: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-900 font-semibold focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                      placeholder="e.g. Melbourne"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Schedule */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center">
                    <Clock size={13} className="text-amber-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Schedule</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Start Time <span className="text-red-500">*</span></label>
                    <input
                      type="time"
                      value={newLoadForm.startTime}
                      onChange={e => setNewLoadForm({ ...newLoadForm, startTime: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-900 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">End Time <span className="text-red-500">*</span></label>
                    <input
                      type="time"
                      value={newLoadForm.endTime}
                      onChange={e => setNewLoadForm({ ...newLoadForm, endTime: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-900 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Driver Assignment */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center">
                    <Truck size={13} className="text-violet-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Driver Assignment</span>
                  <span className="ml-auto text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Assign Driver</label>
                  <select
                    value={newLoadForm.driver}
                    onChange={e => setNewLoadForm({ ...newLoadForm, driver: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-900 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all cursor-pointer font-semibold"
                  >
                    <option value="" style={{ color: '#0f172a' }}>— Leave Unassigned —</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.name} style={{ color: '#0f172a' }}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                    <FileText size={13} className="text-slate-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Internal Notes</span>
                  <span className="ml-auto text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
                </div>
                <textarea
                  rows={3}
                  value={newLoadForm.notes}
                  onChange={e => setNewLoadForm({ ...newLoadForm, notes: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-900 font-semibold focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  placeholder="Any special instructions or notes for this load..."
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0 bg-white">
              <p className="text-[11px] text-slate-400"><span className="text-red-500">*</span> Required fields</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateLoadModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateLoadSubmit}
                  className="px-6 py-2.5 font-bold rounded-xl text-sm text-white shadow-md transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)' }}
                >
                  <Plus size={15} /> Create Load
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes modalPop {
              from { opacity: 0; transform: scale(0.93) translateY(18px); }
              to   { opacity: 1; transform: scale(1)    translateY(0); }
            }
          `}</style>
        </div>
      )}

    </div>
  );
}
