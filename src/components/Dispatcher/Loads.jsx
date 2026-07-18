import React, { useState } from 'react';
import { 
  Search, Plus, MapPin, ArrowLeft, FileText, Camera, PlusCircle, Trash2, Globe, Clock, ChevronDown
} from 'lucide-react';

export default function Loads() {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'create-load', or 'full-details'
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Local Pickups', 'Branch Transfers', 'Local Deliveries', 'Draft'
  const [selectedStatCard, setSelectedStatCard] = useState('Unassigned'); // 'Unassigned', 'In Transit', 'Issues', 'Received'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [selectedLoad, setSelectedLoad] = useState(null); // Load object for quick-view modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Loads State List matching Image 1 data exactly
  const [loadsList, setLoadsList] = useState([
    {
      id: 'SHP-9055',
      ref: 'COKE-9901',
      sn: 'STK-4401',
      from: 'Sydney',
      to: 'Canberra',
      priority: 'HIGH',
      load: '6.2t',
      resource: 'Pending Assignment',
      type: 'Local Pickups'
    },
    {
      id: 'SHP-9054',
      ref: 'PO-8822',
      sn: 'STK-4402',
      from: 'Sydney',
      to: 'Penrith',
      priority: 'MEDIUM',
      load: '2.1t',
      resource: 'Pending Assignment',
      type: 'Local Deliveries'
    },
    {
      id: 'SHP-9060',
      ref: 'VL-X77',
      sn: 'STK-4403',
      from: 'Melbourne',
      to: 'Brisbane',
      priority: 'HIGH',
      load: '14.5t',
      resource: 'Pending Assignment',
      type: 'Branch Transfers'
    },
    {
      id: 'SHP-9080',
      ref: 'DRAFT-001',
      sn: 'STK-4404',
      from: 'Sydney',
      to: 'Melbourne',
      priority: 'LOW',
      load: '1.5t',
      resource: 'Draft',
      type: 'Draft'
    }
  ]);

  // Create Load Form States
  const [customerRef, setCustomerRef] = useState('PO-12345');
  const [priorityTier, setPriorityTier] = useState('NORMAL'); // 'NORMAL', 'EXPRESS', 'URGENT'
  const [globalDeadline, setGlobalDeadline] = useState('');
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

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Drag and drop states & handlers for declaredItems
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const updated = [...declaredItems];
    const [draggedItem] = updated.splice(draggedItemIndex, 1);
    updated.splice(index, 0, draggedItem);
    setDeclaredItems(updated);
    setDraggedItemIndex(null);
    triggerToast('Reordered cargo items successfully.');
  };

  // Add stop and remove stop handlers
  const handleAddStop = () => {
    const nextId = stops.length + 1;
    setStops([...stops, { id: nextId, type: 'Drop', address: '', contact: '', phone: '', time: '' }]);
    triggerToast('Added stop to route.');
  };

  const handleRemoveStop = (id) => {
    if (stops.length <= 2) {
      triggerToast('Cannot remove. Minimum 2 stops required.');
      return;
    }
    setStops(stops.filter(s => s.id !== id));
    triggerToast('Removed stop.');
  };

  // Add item and remove item handlers
  const handleAddItem = () => {
    const nextId = declaredItems.length + 1;
    setDeclaredItems([...declaredItems, { 
      id: nextId, 
      client: 'Acme Corp', 
      pickupStop: `Stop #1: Pickup (No Address)`, 
      dropStop: `Stop #2: Drop (No Address)`, 
      desc: '', 
      weight: '' 
    }]);
    triggerToast('Added cargo item.');
  };

  const handleRemoveItem = (id) => {
    if (declaredItems.length <= 1) {
      triggerToast('Cannot remove. Minimum 1 item required.');
      return;
    }
    setDeclaredItems(declaredItems.filter(item => item.id !== id));
    triggerToast('Removed cargo item.');
  };

  // Activate load and return to dashboard
  const handleActivateLoad = (e) => {
    e.preventDefault();
    const newLoadId = `SHP-${Math.floor(9061 + Math.random() * 50)}`;
    const startPoint = stops[0]?.address || 'Sydney';
    const endPoint = stops[stops.length - 1]?.address || 'Melbourne';

    const activatedLoad = {
      id: newLoadId,
      ref: customerRef || 'REF-TBD',
      sn: `STK-${Math.floor(4410 + Math.random() * 100)}`,
      from: startPoint.split(',')[0] || 'Sydney',
      to: endPoint.split(',')[0] || 'Melbourne',
      priority: priorityTier === 'URGENT' ? 'HIGH' : priorityTier === 'EXPRESS' ? 'HIGH' : 'MEDIUM',
      load: '4.5t',
      resource: 'Pending Assignment',
      type: 'Local Pickups'
    };

    setLoadsList([activatedLoad, ...loadsList]);
    setView('dashboard');
    triggerToast(`Load ${newLoadId} activated and dispatched successfully!`);
  };

  // Save draft and return to dashboard (as requested for 3rd image)
  const handleSaveDraft = (e) => {
    e.preventDefault();
    const newLoadId = `SHP-${Math.floor(9061 + Math.random() * 50)}`;
    const startPoint = stops[0]?.address || 'Sydney';
    const endPoint = stops[stops.length - 1]?.address || 'Melbourne';

    const draftLoad = {
      id: newLoadId,
      ref: customerRef || 'DRAFT-REF',
      sn: `STK-${Math.floor(4410 + Math.random() * 100)}`,
      from: startPoint.split(',')[0] || 'Sydney',
      to: endPoint.split(',')[0] || 'Melbourne',
      priority: 'LOW',
      load: '1.2t',
      resource: 'Draft',
      type: 'Draft'
    };

    setLoadsList([draftLoad, ...loadsList]);
    setView('dashboard');
    setActiveTab('Draft'); // Switch to Draft tab to show the new draft immediately!
    triggerToast(`Load ${newLoadId} saved as draft successfully!`);
  };

  // Filter logic for Loads Table
  const filteredLoads = loadsList.filter(load => {
    // Search query matches id, ref, from, to
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      load.id.toLowerCase().includes(q) || 
      load.ref.toLowerCase().includes(q) || 
      load.from.toLowerCase().includes(q) || 
      load.to.toLowerCase().includes(q);

    // Active tab matches load type
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Draft') return load.type === 'Draft' && matchesSearch;
    return load.type === activeTab && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] px-8 py-8 space-y-6 text-left font-sans antialiased text-slate-800">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* ===================== LOAD DETAILS QUICK-VIEW MODAL (Image 1) ===================== */}
      {showDetailsModal && selectedLoad && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(30,41,59,0.55)', backdropFilter: 'blur(2px)' }}
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="relative bg-white rounded-[28px] shadow-2xl w-[420px] max-w-[95vw] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Top amber accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FFA000] to-[#FFD400]" />

            <div className="p-7 space-y-5">
              {/* Close button */}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors text-sm font-bold"
              >
                ✕
              </button>

              {/* Badges row */}
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-md border border-slate-200 text-[10px] font-black text-slate-700 uppercase tracking-wide">DRAFT</span>
                <span className="px-2.5 py-0.5 rounded-md border border-amber-200 bg-amber-50 text-[10px] font-black text-amber-600 uppercase tracking-wide">HIGH PRIORITY</span>
              </div>

              {/* Load ID */}
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{selectedLoad.id}</h2>
                <p className="text-[11px] text-slate-400 font-bold mt-1">
                  REF: {selectedLoad.ref} &nbsp;•&nbsp; SN: {selectedLoad.sn}
                </p>
              </div>

              {/* Route pill */}
              <div className="bg-slate-900 text-white rounded-[14px] px-5 py-3.5 flex items-center gap-3">
                <span className="text-amber-400 text-sm">📍</span>
                <span className="font-black text-sm tracking-wide">{selectedLoad.from} → {selectedLoad.to}</span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-[14px] p-4 space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">👤 CLIENT</span>
                  <span className="text-sm font-black text-slate-900">Coca Cola</span>
                </div>
                <div className="bg-slate-50 rounded-[14px] p-4 space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">⚖ WEIGHT</span>
                  <span className="text-sm font-black text-slate-900">{selectedLoad.load}</span>
                </div>
                <div className="bg-slate-50 rounded-[14px] p-4 space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">🕐 ETA</span>
                  <span className="text-sm font-black text-slate-900">Jun 19, 2026</span>
                </div>
                <div className="bg-slate-50 rounded-[14px] p-4 space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">🚚 DRIVER</span>
                  <span className="text-sm font-black text-slate-900">{selectedLoad.resource}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setShowDetailsModal(false); setView('full-details'); }}
                  className="flex-1 bg-[#FFA000] hover:bg-[#FF9000] text-black font-black text-xs py-3.5 rounded-[14px] flex items-center justify-center gap-2 transition-all uppercase tracking-wider shadow-sm"
                >
                  → VIEW FULL DETAILS
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-xs rounded-[14px] transition-colors uppercase tracking-wider"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'dashboard' ? (
        <>
          {/* Page Sub-Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                Load Queue
              </h1>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2.5 flex items-center gap-1.5">
                <span>📁</span> Sydney Central Depot &bull; Command View
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Bar Input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search Reference, Client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-850 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                />
              </div>
              <button 
                onClick={() => setView('create-load')}
                className="bg-[#FFA000] hover:bg-[#FF9000] text-black font-black text-xs py-2.5 px-5 rounded-xl flex items-center gap-1 transition-all shadow-xs uppercase tracking-wider cursor-pointer font-extrabold"
              >
                <span className="text-sm font-black">+</span> CREATE LOAD
              </button>
            </div>
          </div>

          {/* Stats Breakdown Row (4 horizontal cards) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Card 1: Unassigned */}
            <div 
              onClick={() => setSelectedStatCard('Unassigned')}
              className={`bg-white rounded-[24px] p-6 text-left flex flex-col justify-between h-36 transition-all duration-200 cursor-pointer hover:border-slate-350 hover:shadow-xs select-none ${
                selectedStatCard === 'Unassigned' 
                  ? 'border-2 border-slate-900 shadow-sm' 
                  : 'border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-lg border border-amber-100/50">
                  ✉
                </div>
                <h3 className="text-4xl font-black text-slate-900 leading-none">3</h3>
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Unassigned</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Booked - awaiting driver assignment</p>
              </div>
            </div>

            {/* Card 2: In Transit */}
            <div 
              onClick={() => setSelectedStatCard('In Transit')}
              className={`bg-white rounded-[24px] p-6 text-left flex flex-col justify-between h-36 transition-all duration-200 cursor-pointer hover:border-slate-355 hover:shadow-xs select-none ${
                selectedStatCard === 'In Transit' 
                  ? 'border-2 border-slate-900 shadow-sm' 
                  : 'border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-lg border border-blue-100/50">
                  ⚡
                </div>
                <h3 className="text-4xl font-black text-slate-900 leading-none">1</h3>
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-wide">In Transit</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Assigned & physically moving</p>
              </div>
            </div>

            {/* Card 3: Issues */}
            <div 
              onClick={() => setSelectedStatCard('Issues')}
              className={`bg-white rounded-[24px] p-6 text-left flex flex-col justify-between h-36 transition-all duration-200 cursor-pointer hover:border-slate-355 hover:shadow-xs select-none ${
                selectedStatCard === 'Issues' 
                  ? 'border-2 border-slate-900 shadow-sm' 
                  : 'border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center font-bold text-lg border border-red-100/50">
                  🛡️
                </div>
                <h3 className="text-4xl font-black text-slate-900 leading-none">1</h3>
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Issues</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Delayed or delivery problems</p>
              </div>
            </div>

            {/* Card 4: Received */}
            <div 
              onClick={() => setSelectedStatCard('Received')}
              className={`bg-white rounded-[24px] p-6 text-left flex flex-col justify-between h-36 transition-all duration-200 cursor-pointer hover:border-slate-355 hover:shadow-xs select-none ${
                selectedStatCard === 'Received' 
                  ? 'border-2 border-slate-900 shadow-sm' 
                  : 'border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold text-lg border border-emerald-100/50">
                  ✓
                </div>
                <h3 className="text-4xl font-black text-slate-900 leading-none">1</h3>
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Received</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Handover complete / Delivered</p>
              </div>
            </div>
          </div>

          {/* Table list card panel */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
            
            {/* Filter tab buttons row */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white flex-wrap gap-3">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-nowrap">
                {['All', 'Local Pickups', 'Branch Transfers', 'Local Deliveries', 'Draft'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      activeTab === tab 
                        ? 'border border-slate-950 bg-slate-950 text-white shadow-3xs' 
                        : 'border border-slate-200 text-slate-500 hover:text-slate-950 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                {filteredLoads.length} results
              </span>
            </div>

            {/* Loads Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/40 border-b border-slate-100 whitespace-nowrap">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">REFERENCE</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">ROUTING</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">PRIORITY</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">LOAD</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">RESOURCE</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right pr-10">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLoads.map((load, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle">
                        <span className="text-xs font-black text-slate-950 block leading-tight">{load.id}</span>
                        <span className="text-[9px] text-slate-400 font-bold mt-1.5 block leading-none">
                          REF: {load.ref} &bull; SN: {load.sn}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle font-bold text-slate-800 text-xs">
                        <span>{load.from}</span>
                        <span className="text-slate-400 mx-1.5">&rarr;</span>
                        <span>{load.to}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle">
                        <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider leading-none ${
                          load.priority === 'HIGH' ? 'bg-red-50 text-red-655 border border-red-100/50' :
                          load.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border border-amber-100/50' :
                          'bg-slate-50 text-slate-550 border border-slate-200'
                        }`}>
                          {load.priority}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle text-xs font-extrabold text-slate-800">
                        {load.load}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle text-xs font-bold text-slate-500 italic">
                        {load.resource}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right pr-10 align-middle">
                        <button 
                          onClick={() => { setSelectedLoad(load); setShowDetailsModal(true); }}
                          className="px-4 py-1.5 border border-slate-250 hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] rounded-xl cursor-pointer transition-colors shadow-3xs uppercase tracking-wider"
                        >
                          DETAILS
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer details */}
            <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider flex-wrap gap-2">
              <span>⚙ {filteredLoads.length} loads &bull; Sydney Central Depot</span>
              <span>Updated just now</span>
            </div>
          </div>
        </>
      ) : view === 'full-details' ? (
        /* FULL DETAILS VIEW (Image 3) */
        <div className="space-y-0 text-left">
          {/* Back to Loads bar */}
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-900 transition-colors mb-5 uppercase tracking-wider"
          >
            ‹ BACK TO LOADS
          </button>

          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {selectedLoad ? selectedLoad.id : 'SHP-9055'}
              </h1>
              <span className="px-2.5 py-1 rounded-md bg-green-50 border border-green-200 text-[10px] font-black text-green-700 uppercase tracking-wide">● IN PROGRESS</span>
              <span className="px-2.5 py-1 rounded-md border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-wide">⊞ DEPOT-TO-DEPOT</span>
              <span className="text-[10px] font-bold text-slate-400">CLIENT REF: ACME-221</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => triggerToast('POD collected successfully!')} className="px-3.5 py-2 bg-green-500 hover:bg-green-600 text-white font-black text-[10px] rounded-xl flex items-center gap-1.5 transition-all uppercase tracking-wide">✓ COLLECT POD</button>
              <button onClick={() => triggerToast('Opening live tracking...')} className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-black font-black text-[10px] rounded-xl flex items-center gap-1.5 transition-all uppercase tracking-wide">📍 LIVE TRACKING</button>
              <button onClick={() => triggerToast('Opening manifest...')} className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-[10px] rounded-xl transition-all uppercase tracking-wide">MANIFEST</button>
              <button onClick={() => triggerToast('Opening edit job...')} className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-[10px] rounded-xl transition-all uppercase tracking-wide">EDIT JOB</button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Transport Network Flow */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-100 rounded-[20px] p-5 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-4">TRANSPORT NETWORK FLOW</h3>
                <div className="space-y-0">
                  {/* Step 1: Pickup */}
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mt-0.5 flex-shrink-0" />
                      <div className="w-0.5 h-10 bg-slate-200 mt-1" />
                    </div>
                    <div className="pb-4">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">PICKUP</div>
                      <div className="text-xs font-black text-slate-900">First Mile Pickup</div>
                      <div className="text-[9px] text-slate-500 font-bold">Customer Site (Bond) / Local Courier</div>
                    </div>
                  </div>
                  {/* Step 2: Sorting */}
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mt-0.5 flex-shrink-0" />
                      <div className="w-0.5 h-10 bg-slate-200 mt-1" />
                    </div>
                    <div className="pb-4">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">SORTING</div>
                      <div className="text-xs font-black text-slate-900">Inbound Sorting</div>
                      <div className="text-[9px] text-slate-500 font-bold">Sydney Central Depot / Depot Manager</div>
                    </div>
                  </div>
                  {/* Step 3: In Depot (Active) */}
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-400 mt-0.5 flex-shrink-0 ring-2 ring-amber-200" />
                      <div className="w-0.5 h-16 bg-slate-200 mt-1" />
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="text-[9px] font-black text-amber-500 uppercase tracking-wider">IN DEPOT</div>
                      <div className="text-xs font-black text-slate-900">Depot Transfer (Trunk)</div>
                      <div className="text-[9px] text-slate-500 font-bold">Sydney Depot → Melbourne Depot / Line-haul Truck</div>
                      <button onClick={() => triggerToast('Assigning resource...')} className="mt-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[9px] font-black rounded-lg uppercase tracking-wide transition-all">ASSIGN RESOURCE</button>
                    </div>
                  </div>
                  {/* Step 4: Sorting */}
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-slate-300 mt-0.5 flex-shrink-0" />
                      <div className="w-0.5 h-10 bg-slate-200 mt-1" />
                    </div>
                    <div className="pb-4">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">SORTING</div>
                      <div className="text-xs font-bold text-slate-400">Outbound Sorting</div>
                      <div className="text-[9px] text-slate-400 font-bold">Melbourne Terminal / Depot Supervisor</div>
                    </div>
                  </div>
                  {/* Step 5: Delivery */}
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-slate-300 mt-0.5 flex-shrink-0" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">DELIVERY</div>
                      <div className="text-xs font-bold text-slate-400">Last Mile Delivery</div>
                      <div className="text-[9px] text-slate-400 font-bold">Melbourne CBD / Local Courier</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Consignor / Map */}
            <div className="lg:col-span-5 space-y-4">
              {/* Consignor & Consignee */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-100 rounded-[20px] p-4 shadow-sm space-y-1.5">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">CONSIGNOR (SENDER)</div>
                  <div className="text-xs font-black text-slate-900">Acme Corp Logistics</div>
                  <div className="text-[10px] text-slate-500 font-semibold">Warehouse 4, 12 Botany Rd, Alexandria NSW 2015</div>
                  <div className="text-[10px] text-slate-500 font-semibold pt-1">Contact: James Hargrove</div>
                  <div className="text-[10px] font-bold text-slate-700">+61 2 9283 1122</div>
                </div>
                <div className="bg-white border border-slate-100 rounded-[20px] p-4 shadow-sm space-y-1.5">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">CONSIGNEE (RECEIVER)</div>
                  <div className="text-xs font-black text-slate-900">Tech Solutions Ltd</div>
                  <div className="text-[10px] text-slate-500 font-semibold">1 Innovation Dr, Port Botany NSW 2036</div>
                  <div className="text-[10px] text-slate-500 font-semibold pt-1">Contact: Tom Carey</div>
                  <div className="text-[10px] font-bold text-slate-700">+61 2 9666 0011</div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-slate-900 rounded-[20px] h-48 flex items-center justify-center">
                <span className="text-slate-600 text-sm font-bold">🗺 Route Map</span>
              </div>

              {/* Terminal Operations */}
              <div className="bg-white border border-slate-100 rounded-[20px] p-5 shadow-sm">
                <div className="text-[9px] font-black text-amber-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">⚡ TERMINAL OPERATIONS</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">CURRENT ASSET ALLOCATION</div>
                <div className="text-xs text-slate-500 font-semibold mb-4">Waiting for resource assignment...</div>
                <button
                  onClick={() => triggerToast('Allocating driver & vehicle...')}
                  className="w-full bg-[#FFA000] hover:bg-[#FF9000] text-black font-black text-xs py-3 rounded-[12px] uppercase tracking-wider transition-all"
                >
                  ALLOCATE DRIVER &amp; VEHICLE
                </button>
              </div>
            </div>

            {/* Right: Load Metadata */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-slate-100 rounded-[20px] p-5 shadow-sm space-y-4">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">LOAD METADATA</div>
                {[
                  { label: 'CUSTOMER LOAD #', value: 'ACME 221' },
                  { label: 'COMMODITY', value: 'Electronics' },
                  { label: 'WEIGHT & VOL', value: '18.42t / 41 CBM' },
                  { label: 'TARGET ETA', value: 'Today, 17:30' },
                  { label: 'SERVICE', value: 'NORMAL', badge: true },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{row.label}</span>
                    {row.badge ? (
                      <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[9px] font-black text-amber-600 uppercase tracking-wide">{row.value}</span>
                    ) : (
                      <span className="text-xs font-black text-slate-900">{row.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CREATE LOAD CONSOLE VIEW (Image 2) */
        <div className="space-y-6">
          {/* Console Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80 text-left">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setView('dashboard')}
                className="w-10 h-10 rounded-full border border-slate-255 flex items-center justify-center hover:bg-slate-50 cursor-pointer shadow-3xs"
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
                onClick={handleSaveDraft}
                className="px-5 py-2.5 border border-slate-250 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-3xs bg-white uppercase tracking-wider"
              >
                SAVE DRAFT
              </button>
              <button 
                onClick={handleActivateLoad}
                className="bg-[#0B0F17] hover:bg-slate-800 text-[#FFD400] font-black text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>⚡</span> ACTIVATE LOAD
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-left">
            {/* Left Column (Forms Stack - 2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* STEP 1: Route configuration card */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-center mb-2 pb-3 border-b border-slate-50">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-50 text-blue-655 rounded-lg flex items-center justify-center shrink-0 border border-blue-100">🌐</span>
                      STEP 1: CONFIGURE ROUTE STOPS
                    </h3>
                    <p className="text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mt-1">
                      DEFINE ALL PHYSICAL LOCATIONS FOR THIS LOAD
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddStop}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-1.5 px-3.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    + ADD STOP
                  </button>
                </div>

                {/* Dashboard timeline representation of stops */}
                <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-[9px] before:top-2 before:bottom-6 before:w-0.5 before:border-l before:border-dashed before:border-slate-200">
                  {stops.map((stop, index) => (
                    <div key={stop.id} className="relative bg-slate-50/50 border border-slate-150/60 p-5 rounded-2xl space-y-4">
                      {/* Step Number Badge */}
                      <span className="absolute -left-[22px] top-4 w-5 h-5 rounded-full bg-slate-900 border-2 border-white text-white flex items-center justify-center text-[9px] font-black shadow-xs z-10 select-none">
                        {index + 1}
                      </span>

                      {/* Header with deletion options */}
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">
                          STOP ENTRY #{index + 1}
                        </span>
                        {stops.length > 2 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveStop(stop.id)}
                            className="text-[10px] text-red-500 hover:text-red-700 font-extrabold uppercase cursor-pointer"
                          >
                            REMOVE
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">STOP TYPE</label>
                          <select 
                            value={stop.type}
                            onChange={(e) => {
                              const updated = [...stops];
                              updated[index].type = e.target.value;
                              setStops(updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                          >
                            <option value="Pickup">Pickup</option>
                            <option value="Drop">Drop</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ADDRESS / SUBURB</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-red-500">📍</span>
                            <input 
                              type="text" 
                              placeholder="Full location address..."
                              value={stop.address}
                              onChange={(e) => {
                                const updated = [...stops];
                                updated[index].address = e.target.value;
                                setStops(updated);
                              }}
                              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CONTACT NAME</label>
                          <input 
                            type="text" 
                            placeholder="Receiver/Sender Name"
                            value={stop.contact}
                            onChange={(e) => {
                              const updated = [...stops];
                              updated[index].contact = e.target.value;
                              setStops(updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">PHONE</label>
                          <input 
                            type="text" 
                            placeholder="+61..."
                            value={stop.phone}
                            onChange={(e) => {
                              const updated = [...stops];
                              updated[index].phone = e.target.value;
                              setStops(updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">REQUIRED TIME</label>
                          <input 
                            type="text" 
                            placeholder="dd-mm-yyyy --:--"
                            value={stop.time}
                            onChange={(e) => {
                              const updated = [...stops];
                              updated[index].time = e.target.value;
                              setStops(updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 2: Cargo details configuration card */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-center mb-2 pb-3 border-b border-slate-50">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center shrink-0 border border-amber-100">📦</span>
                      STEP 2: DECLARE ITEMS / CARS
                    </h3>
                    <p className="text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mt-1">
                      LINK EACH ITEM TO THE CREATED STOPS ABOVE
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddItem}
                    className="bg-black hover:bg-slate-800 text-[#FFD400] font-bold text-[10px] py-1.5 px-3.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    + ADD ITEM
                  </button>
                </div>

                <div className="space-y-4">
                  {declaredItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      className={`p-5 border rounded-2xl transition-all ${
                        draggedItemIndex === index ? 'border-amber-400 bg-amber-50/10' : 'border-slate-150/60 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing select-none" title="Drag to reorder entries">
                          <span className="text-slate-400 text-sm font-black tracking-tighter">⋮⋮</span>
                          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                            ITEM ENTRY #{index + 1}
                          </span>
                        </div>
                        {declaredItems.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CUSTOMER / OWNER</label>
                          <input 
                            type="text" 
                            value={item.client}
                            onChange={(e) => {
                              const updated = [...declaredItems];
                              updated[index].client = e.target.value;
                              setDeclaredItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">LINK PICKUP STOP</label>
                          <select 
                            value={item.pickupStop}
                            onChange={(e) => {
                              const updated = [...declaredItems];
                              updated[index].pickupStop = e.target.value;
                              setDeclaredItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white focus:outline-none"
                          >
                            {stops.map((s, si) => (
                              <option key={s.id} value={`Stop #${si + 1}: ${s.type} (${s.address || 'No Address'})`}>
                                Stop #{si + 1}: {s.type} ({s.address || 'No Address'})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">LINK DROP OFF STOP</label>
                          <select 
                            value={item.dropStop}
                            onChange={(e) => {
                              const updated = [...declaredItems];
                              updated[index].dropStop = e.target.value;
                              setDeclaredItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white focus:outline-none"
                          >
                            {stops.map((s, si) => (
                              <option key={s.id} value={`Stop #${si + 1}: ${s.type} (${s.address || 'No Address'})`}>
                                Stop #{si + 1}: {s.type} ({s.address || 'No Address'})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-9">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ITEM DESCRIPTION / IDENTIFICATION</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 2024 Toyota Hilux or General..."
                            value={item.desc}
                            onChange={(e) => {
                              const updated = [...declaredItems];
                              updated[index].desc = e.target.value;
                              setDeclaredItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">WEIGHT (KG)</label>
                          <input 
                            type="text" 
                            value={item.weight}
                            onChange={(e) => {
                              const updated = [...declaredItems];
                              updated[index].weight = e.target.value;
                              setDeclaredItems(updated);
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Specifications Sidebar - 1 col) */}
            <div className="space-y-6">
              
              {/* Load Specifications Card */}
              <div className="bg-[#0B0F17] text-white rounded-[24px] border border-slate-855 p-6 shadow-md text-left space-y-4">
                <span className="text-[8px] font-black text-amber-500 tracking-wider block uppercase">LOAD SPECIFICATIONS</span>
                
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    CUSTOMER REFERENCE
                  </label>
                  <input 
                    type="text"
                    value={customerRef}
                    onChange={(e) => setCustomerRef(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-800 rounded-xl text-xs font-bold text-slate-850 focus:outline-none"
                  />
                </div>

                <div className="pt-1.5">
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    PRIORITY TIER
                  </label>
                  <div className="flex gap-2">
                    {['NORMAL', 'EXPRESS', 'URGENT'].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setPriorityTier(tier)}
                        className={`flex-1 py-2 text-[9px] font-black rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                          priorityTier === tier 
                            ? 'bg-[#FFA000] text-black font-black shadow-xs' 
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-400 font-bold border border-slate-700/50'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1.5">
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    GLOBAL DEADLINE
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-800 text-xs">⏰</span>
                    <input 
                      type="text"
                      value={globalDeadline}
                      onChange={(e) => setGlobalDeadline(e.target.value)}
                      placeholder="dd-mm-yyyy --:--"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-800 rounded-xl text-xs font-bold text-slate-850 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Documents & Photos Card */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm text-left space-y-4">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">DOCUMENTS & PHOTOS</span>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => triggerToast('Select and upload shipping manifest PDF...')}
                    className="border border-dashed border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer select-none"
                  >
                    <FileText className="w-5 h-5 text-slate-650" />
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">MANIFEST</span>
                  </div>
                  <div 
                    onClick={() => triggerToast('Select and upload cargo photos...')}
                    className="border border-dashed border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer select-none"
                  >
                    <Camera className="w-5 h-5 text-slate-655" />
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
      )}
    </div>
  );
}
