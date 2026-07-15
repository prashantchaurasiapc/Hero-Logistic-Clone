import React, { useState } from 'react';
import { Search, Plus, MapPin, Inbox, Zap, ShieldAlert, Clock, ArrowRight, Folder, X, Check, AlertTriangle } from 'lucide-react';

export default function Loads() {
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [selectedKpi, setSelectedKpi] = useState('Unassigned');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);

  // Form states for new load
  const [newLoad, setNewLoad] = useState({
    id: '',
    ref: 'REF: COKE-9901 • SN: STK-4401',
    from: '',
    to: '',
    priority: 'HIGH',
    weight: '',
    category: 'Local Pickups'
  });

  const [loadsList, setLoadsList] = useState([
    {
      id: 'SHP-9055',
      ref: 'REF: COKE-9901 • SN: STK-4401',
      from: 'Sydney',
      to: 'Canberra',
      priority: 'HIGH',
      weight: '6.2t',
      status: 'Unassigned',
      resource: 'Pending Assignment',
      category: 'Local Pickups'
    },
    {
      id: 'SHP-9054',
      ref: 'REF: PO-8822 • SN: STK-4402',
      from: 'Sydney',
      to: 'Penrith',
      priority: 'MEDIUM',
      weight: '2.1t',
      status: 'Unassigned',
      resource: 'Pending Assignment',
      category: 'Local Deliveries'
    },
    {
      id: 'SHP-9060',
      ref: 'REF: VL-X77 • SN: STK-4403',
      from: 'Melbourne',
      to: 'Brisbane',
      priority: 'HIGH',
      weight: '14.5t',
      status: 'Unassigned',
      resource: 'Pending Assignment',
      category: 'Branch Transfers'
    },
    {
      id: 'SHP-9048',
      ref: 'REF: PO-4001 • SN: STK-4404',
      from: 'Sydney Depot',
      to: 'Melbourne Depot',
      priority: 'MEDIUM',
      weight: '8.4t',
      status: 'In Transit',
      resource: 'Jack Taylor (TRK-102)',
      category: 'Local Pickups'
    },
    {
      id: 'SHP-9039',
      ref: 'REF: VL-Y88 • SN: STK-4405',
      from: 'Brisbane Depot',
      to: 'Sydney Depot',
      priority: 'HIGH',
      weight: '4.0t',
      status: 'Issues',
      resource: 'Liam Smith (VAN-88)',
      category: 'Local Deliveries'
    },
    {
      id: 'SHP-9021',
      ref: 'REF: VL-Z99 • SN: STK-4406',
      from: 'Perth Depot',
      to: 'Adelaide Depot',
      priority: 'LOW',
      weight: '12.0t',
      status: 'Received',
      resource: 'Noah Williams (TRK-05)',
      category: 'Branch Transfers'
    }
  ]);

  // Calculate dynamic KPIs from state
  const unassignedCount = loadsList.filter(l => l.status === 'Unassigned').length;
  const inTransitCount = loadsList.filter(l => l.status === 'In Transit').length;
  const issuesCount = loadsList.filter(l => l.status === 'Issues').length;
  const receivedCount = loadsList.filter(l => l.status === 'Received').length;

  const kpis = [
    {
      key: 'Unassigned',
      label: 'Unassigned',
      desc: 'Booked - awaiting driver assignment',
      value: unassignedCount,
      icon: Inbox,
      iconColor: 'text-[#D97706]',
      iconBg: 'bg-amber-50'
    },
    {
      key: 'In Transit',
      label: 'In Transit',
      desc: 'Assigned & physically moving',
      value: inTransitCount,
      icon: Zap,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50'
    },
    {
      key: 'Issues',
      label: 'Issues',
      desc: 'Delayed or delivery problems',
      value: issuesCount,
      icon: ShieldAlert,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-50'
    },
    {
      key: 'Received',
      label: 'Received',
      desc: 'Handover complete / Delivered',
      value: receivedCount,
      icon: Clock,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50'
    }
  ];

  // Handle creating a new load
  const handleCreateLoad = (e) => {
    e.preventDefault();
    const loadId = newLoad.id || `SHP-${Math.floor(9000 + Math.random() * 1000)}`;
    const createdLoad = {
      ...newLoad,
      id: loadId,
      status: 'Unassigned',
      resource: 'Pending Assignment'
    };
    setLoadsList([createdLoad, ...loadsList]);
    setIsCreateModalOpen(false);
    setNewLoad({
      id: '',
      ref: 'REF: COKE-9901 • SN: STK-4401',
      from: '',
      to: '',
      priority: 'HIGH',
      weight: '',
      category: 'Local Pickups'
    });
  };

  // Assign driver to a load
  const handleAssignDriver = (loadId, driverName, vehicle) => {
    setLoadsList(prev => prev.map(load => 
      load.id === loadId 
        ? { ...load, status: 'In Transit', resource: `${driverName} (${vehicle})` } 
        : load
    ));
    setSelectedLoad(null);
  };

  // Update status directly
  const handleUpdateStatus = (loadId, newStatus) => {
    setLoadsList(prev => prev.map(load => 
      load.id === loadId 
        ? { 
            ...load, 
            status: newStatus,
            resource: newStatus === 'Unassigned' ? 'Pending Assignment' : load.resource
          } 
        : load
    ));
    setSelectedLoad(null);
  };

  // Filter & Search Logic
  const filteredLoads = loadsList.filter(load => {
    const matchesSearch = load.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          load.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          load.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          load.to.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilterTab === 'All' || load.category === activeFilterTab;
    const matchesKpi = selectedKpi === 'All' || load.status === selectedKpi;
    return matchesSearch && matchesFilter && matchesKpi;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
        <div className="text-left">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">DISPATCHER</span>
          <span className="text-xs font-bold text-gray-505 tracking-wider block mb-1">LIVE DISPATCH OPERATIONS</span>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1.5 flex items-center gap-2">
            Load Queue
          </h1>
          <p className="text-gray-550 text-xs font-semibold flex items-center gap-1">
            <Folder className="w-3.5 h-3.5 text-[#FFD400]" fill="currentColor" />
            Sydney Central Depot • Command View
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Reference, Client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 pl-9 pr-4 py-2.5 bg-white border border-gray-250 rounded-xl text-xs font-bold text-gray-750 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
            />
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#FFD400] hover:bg-yellow-400 text-black font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-xs cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={3} /> CREATE LOAD
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const IconComponent = kpi.icon;
          const isSelected = selectedKpi === kpi.key;
          return (
            <div 
              key={i} 
              onClick={() => setSelectedKpi(isSelected ? 'All' : kpi.key)}
              className={`bg-white p-5 rounded-3xl flex justify-between items-center h-28 relative cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-2 border-gray-905 ring-2 ring-gray-900/10 shadow-sm' 
                  : 'border border-gray-150 shadow-3xs hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-2xl shrink-0 ${kpi.iconBg} ${kpi.iconColor} border border-gray-100/50 flex items-center justify-center`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="text-left max-w-[160px] sm:max-w-none">
                  <p className="text-xs font-bold text-gray-900">{kpi.label}</p>
                  <p className="text-[9px] text-gray-405 font-medium leading-normal mt-0.5">{kpi.desc}</p>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 leading-none self-center shrink-0 ml-2">{kpi.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Table Container Card */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-3xs overflow-hidden">
        {/* Filter Tab bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {['All', 'Local Pickups', 'Branch Transfers', 'Local Deliveries', 'Draft'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilterTab(tab)}
                className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilterTab === tab 
                    ? 'border border-gray-900 text-gray-900 bg-gray-50/50' 
                    : 'border border-gray-100 text-gray-400 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-semibold text-gray-400 shrink-0">
            {filteredLoads.length} results {selectedKpi !== 'All' ? `filtered by ${selectedKpi}` : ''}
          </span>
        </div>

        {/* Loads Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/40 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">REFERENCE</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">ROUTING</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">PRIORITY</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">LOAD</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">RESOURCE</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLoads.length > 0 ? filteredLoads.map((load, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  {/* Reference */}
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <span className="text-xs font-bold text-gray-955 block">{load.id}</span>
                    <span className="text-[9px] text-gray-400 font-semibold">{load.ref}</span>
                  </td>

                  {/* Routing */}
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900">{load.from}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-bold text-gray-900">{load.to}</span>
                    </div>
                    {load.status !== 'Unassigned' && (
                      <span className="text-[9px] font-bold text-gray-450 tracking-wide mt-1 block flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FFD400]" fill="currentColor" /> Currently in {load.to} Depot
                      </span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase border ${
                        load.priority === 'HIGH' 
                          ? 'bg-red-50 text-red-650 border-red-100' 
                          : load.priority === 'MEDIUM' 
                            ? 'bg-amber-50 text-[#D97706] border-amber-100'
                            : 'bg-gray-50 text-gray-500 border-gray-100'
                      }`}>
                        {load.priority}
                      </span>
                    </div>
                  </td>

                  {/* Load / Weight */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-xs text-gray-700 font-semibold">{load.weight}</span>
                  </td>

                  {/* Resource */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`text-xs font-semibold ${load.status === 'Unassigned' ? 'text-gray-400 italic' : 'text-gray-800'}`}>
                      {load.resource}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => setSelectedLoad(load)}
                      className="px-3.5 py-1.5 border border-gray-200 text-gray-700 hover:text-black rounded-lg text-xs font-bold transition-all cursor-pointer hover:bg-gray-50 shadow-3xs"
                    >
                      DETAILS
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-450 font-bold text-xs">
                    No loads found in status "{selectedKpi}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-semibold">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {loadsList.length} loads • Sydney Central Depot
          </div>
          <div>Updated just now</div>
        </div>
      </div>

      {/* CREATE LOAD MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Create New Dispatch Load</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateLoad} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-450 mb-1">Load ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. SHP-9077"
                  value={newLoad.id}
                  onChange={e => setNewLoad({ ...newLoad, id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">From Location</label>
                  <input
                    type="text" required
                    placeholder="e.g. Sydney"
                    value={newLoad.from}
                    onChange={e => setNewLoad({ ...newLoad, from: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">To Location</label>
                  <input
                    type="text" required
                    placeholder="e.g. Newcastle"
                    value={newLoad.to}
                    onChange={e => setNewLoad({ ...newLoad, to: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">Weight / Load</label>
                  <input
                    type="text" required
                    placeholder="e.g. 5.5t"
                    value={newLoad.weight}
                    onChange={e => setNewLoad({ ...newLoad, weight: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">Category</label>
                  <select
                    value={newLoad.category}
                    onChange={e => setNewLoad({ ...newLoad, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#FFD400] focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Local Pickups">Local Pickups</option>
                    <option value="Branch Transfers">Branch Transfers</option>
                    <option value="Local Deliveries">Local Deliveries</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-455 mb-1">Priority</label>
                <div className="flex gap-2">
                  {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                    <button
                      key={p} type="button"
                      onClick={() => setNewLoad({ ...newLoad, priority: p })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        newLoad.priority === p 
                          ? 'bg-gray-950 text-white border-gray-950' 
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#FFD400] hover:bg-yellow-400 text-black font-bold py-3 rounded-xl text-xs mt-2 cursor-pointer transition-colors shadow-sm"
              >
                ADD TO DISPATCH QUEUE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LOAD DETAILS & DRIVER ASSIGNMENT MODAL */}
      {selectedLoad && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-gray-400">{selectedLoad.id} Details</span>
                <h3 className="text-base font-bold text-gray-950 mt-0.5">{selectedLoad.from} → {selectedLoad.to}</h3>
              </div>
              <button onClick={() => setSelectedLoad(null)} className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"><X size={18} /></button>
            </div>
            
            <div className="space-y-5 text-xs text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-450 uppercase block">Category</span>
                  <span className="font-bold text-gray-900 mt-1 block">{selectedLoad.category}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-450 uppercase block">Weight / Load</span>
                  <span className="font-bold text-gray-900 mt-1 block">{selectedLoad.weight}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-455 uppercase block">Priority</span>
                <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase border mt-1 ${
                  selectedLoad.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-[#D97706] border-amber-100'
                }`}>
                  {selectedLoad.priority}
                </span>
              </div>

              {/* Dynamic Status / Actions */}
              <div className="pt-3 border-t border-gray-100">
                {selectedLoad.status === 'Unassigned' ? (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-gray-450 uppercase block">Assign Available Driver</span>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { name: 'Jack Taylor', vehicle: 'TRK-102' },
                        { name: 'Liam Smith', vehicle: 'VAN-88' },
                        { name: 'Noah Williams', vehicle: 'TRK-05' }
                      ].map((driver, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAssignDriver(selectedLoad.id, driver.name, driver.vehicle)}
                          className="w-full p-3 bg-gray-50 border border-gray-150 rounded-xl hover:bg-[#FFFBEB] hover:border-[#FFD400] transition-all cursor-pointer flex items-center justify-between font-bold text-gray-900"
                        >
                          <span>{driver.name}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">{driver.vehicle}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-gray-450 uppercase block">Current Driver & Status</span>
                    <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl flex justify-between items-center font-bold text-gray-900">
                      <span>{selectedLoad.resource}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px]">{selectedLoad.status}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {selectedLoad.status === 'In Transit' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(selectedLoad.id, 'Received')}
                            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                          >
                            Mark Delivered
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(selectedLoad.id, 'Issues')}
                            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                          >
                            Report Issue
                          </button>
                        </>
                      )}
                      {(selectedLoad.status === 'Received' || selectedLoad.status === 'Issues') && (
                        <button
                          onClick={() => handleUpdateStatus(selectedLoad.id, 'Unassigned')}
                          className="w-full py-2 border border-gray-250 text-gray-500 hover:bg-gray-50 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-3xs"
                        >
                          Reset / De-authorize Load
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
