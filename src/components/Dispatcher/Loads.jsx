import React, { useState } from 'react';
import { 
  Mail, Zap, AlertTriangle, CheckCircle2, Folder, Search, Plus, 
  ArrowLeft, MapPin, Trash2, Calendar, FileText, Image as ImageIcon, 
  Clock, X, Check, ShieldCheck, ChevronRight
} from 'lucide-react';

export default function Loads() {
  // Navigation State
  const [showCreateConsole, setShowCreateConsole] = useState(false);

  // Search, Tab & Card Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [activeCardFilter, setActiveCardFilter] = useState('ALL'); // 'ALL', 'Unassigned', 'In Transit', 'Issues', 'Received'
  const [toastMsg, setToastMsg] = useState('');

  // Loads Mock Data matching the screenshot requirements
  const [loadsData, setLoadsData] = useState([
    {
      id: 'SHP-9055',
      ref: 'COKE-9901',
      sn: 'STK-4401',
      from: 'Sydney',
      to: 'Canberra',
      priority: 'HIGH',
      weight: '6.2t',
      resource: 'Pending Assignment',
      category: 'Local Pickups',
      status: 'Unassigned'
    },
    {
      id: 'SHP-9054',
      ref: 'PO-8822',
      sn: 'STK-4402',
      from: 'Sydney',
      to: 'Penrith',
      priority: 'MEDIUM',
      weight: '2.1t',
      resource: 'Pending Assignment',
      category: 'Local Deliveries',
      status: 'Unassigned'
    },
    {
      id: 'SHP-9060',
      ref: 'VL-X77',
      sn: 'STK-4403',
      from: 'Melbourne',
      to: 'Brisbane',
      priority: 'HIGH',
      weight: '14.5t',
      resource: 'Pending Assignment',
      category: 'Branch Transfers',
      status: 'Unassigned'
    },
    {
      id: 'SHP-9039',
      ref: 'RC-7722',
      sn: 'STK-4406',
      from: 'Brisbane',
      to: 'Sydney',
      priority: 'LOW',
      weight: '4.5t',
      resource: 'Oliver Brown',
      category: 'Local Pickups',
      status: 'In Transit'
    },
    {
      id: 'SHP-9022',
      ref: 'DL-1102',
      sn: 'STK-4407',
      from: 'Adelaide',
      to: 'Sydney',
      priority: 'HIGH',
      weight: '8.0t',
      resource: 'Jack Taylor',
      category: 'Local Deliveries',
      status: 'Issues'
    },
    {
      id: 'SHP-9011',
      ref: 'RE-9902',
      sn: 'STK-4408',
      from: 'Melbourne',
      to: 'Sydney',
      priority: 'LOW',
      weight: '12.2t',
      resource: 'Lucas Jones',
      category: 'Branch Transfers',
      status: 'Received'
    }
  ]);

  // Create Load Form state
  const [formStops, setFormStops] = useState([
    { type: 'Pickup', address: '', contact: '', phone: '', time: '' },
    { type: 'Drop', address: '', contact: '', phone: '', time: '' }
  ]);

  const [formItems, setFormItems] = useState([
    { customer: '', pickupStop: 'Step #1 Pickup (No Address)', dropStop: 'Step #2 Drop (No Address)', desc: '', weight: '' }
  ]);

  const [formSpecs, setFormSpecs] = useState({
    weight: '20,000',
    priority: 'URGENT', // 'NORMAL', 'MEDIUM', 'URGENT'
    deadline: '',
    notes: ''
  });

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Card filter triggers
  const handleCardFilterClick = (filter) => {
    if (activeCardFilter === filter) {
      setActiveCardFilter('ALL'); // Toggle off
    } else {
      setActiveCardFilter(filter);
    }
  };

  // Stop add / delete functions
  const handleAddStop = () => {
    setFormStops([...formStops, { type: 'Drop', address: '', contact: '', phone: '', time: '' }]);
    triggerToast('Added new route stop');
  };

  const handleRemoveStop = (idx) => {
    if (formStops.length <= 2) {
      triggerToast('A minimum of two stops is required');
      return;
    }
    setFormStops(formStops.filter((_, i) => i !== idx));
    triggerToast('Stop removed');
  };

  // Item add / delete functions
  const handleAddItem = () => {
    setFormItems([...formItems, { customer: '', pickupStop: 'Step #1 Pickup (No Address)', dropStop: 'Step #2 Drop (No Address)', desc: '', weight: '' }]);
    triggerToast('Added new item row');
  };

  const handleRemoveItem = (idx) => {
    if (formItems.length <= 1) {
      triggerToast('A minimum of one item description is required');
      return;
    }
    setFormItems(formItems.filter((_, i) => i !== idx));
    triggerToast('Item removed');
  };

  // Save / Activate handlers
  const handleSaveDraft = () => {
    const newId = `SHP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLoad = {
      id: newId,
      ref: 'DRAFT-NEW',
      sn: `STK-${Math.floor(4000 + Math.random() * 900)}`,
      from: formStops[0].address || 'Sydney Port',
      to: formStops[formStops.length - 1].address || 'Blacktown DC',
      priority: formSpecs.priority,
      weight: formSpecs.weight ? `${parseInt(formSpecs.weight) / 1000}t` : '1.5t',
      resource: 'Pending Assignment',
      category: 'Local Pickups',
      status: 'Draft'
    };

    setLoadsData([newLoad, ...loadsData]);
    setShowCreateConsole(false);
    triggerToast(`Draft load ${newId} saved successfully`);
  };

  const handleActivateLoad = () => {
    const newId = `SHP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLoad = {
      id: newId,
      ref: 'ACT-NEW',
      sn: `STK-${Math.floor(4000 + Math.random() * 900)}`,
      from: formStops[0].address || 'Sydney Port',
      to: formStops[formStops.length - 1].address || 'Blacktown DC',
      priority: formSpecs.priority,
      weight: formSpecs.weight ? `${parseInt(formSpecs.weight) / 1000}t` : '1.5t',
      resource: 'Pending Assignment',
      category: 'Local Pickups',
      status: 'Unassigned'
    };

    setLoadsData([newLoad, ...loadsData]);
    setShowCreateConsole(false);
    triggerToast(`Load ${newId} activated & placed in queue`);
  };

  // Calculation parameters
  const unassignedCount = loadsData.filter(l => l.status === 'Unassigned').length;
  const transitCount = loadsData.filter(l => l.status === 'In Transit').length;
  const issuesCount = loadsData.filter(l => l.status === 'Issues').length;
  const receivedCount = loadsData.filter(l => l.status === 'Received').length;

  const filteredLoads = loadsData.filter(load => {
    const matchesSearch = load.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          load.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          load.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          load.to.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCard = activeCardFilter === 'ALL' || load.status.toLowerCase() === activeCardFilter.toLowerCase();

    const matchesTab = activeTab === 'All' || 
                       (activeTab === 'Local Pickups' && load.category === 'Local Pickups') ||
                       (activeTab === 'Branch Transfers' && load.category === 'Branch Transfers') ||
                       (activeTab === 'Local Deliveries' && load.category === 'Local Deliveries') ||
                       (activeTab === 'Draft' && load.status === 'Draft');

    return matchesSearch && matchesCard && matchesTab;
  });

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] px-8 py-8 space-y-6 text-left font-sans antialiased text-slate-800 relative">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl text-xs font-semibold shadow-xl animate-fade-in flex items-center gap-2 border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-[#FFA000]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ====================================================
          VIEW 1: LOADS LIST QUEUE (1st Screenshot Match)
          ==================================================== */}
      {!showCreateConsole ? (
        <>
          {/* PAGE HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                Load Queue
              </h1>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-2.5">
                <Folder className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500/10" />
                <span>Sydney Central Depot</span>
                <span className="text-slate-350">•</span>
                <span>Command View</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-650" />
                <input
                  type="text"
                  placeholder="Search Reference, Client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                />
              </div>
              <button 
                onClick={() => setShowCreateConsole(true)}
                className="bg-[#FFA000] hover:bg-[#FF9000] text-black font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap tracking-wider uppercase flex items-center gap-1.5 transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3px]" /> CREATE LOAD
              </button>
            </div>
          </div>

          {/* KPI CARD ROWS (Clickable for Filtering) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Unassigned Card */}
            <div 
              onClick={() => handleCardFilterClick('Unassigned')}
              className={`p-6 rounded-[24px] bg-white flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] h-32 text-left cursor-pointer transition-all hover:-translate-y-0.5 ${
                activeCardFilter === 'Unassigned' 
                  ? 'border-2 border-slate-900 shadow-md' 
                  : 'border border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-amber-50/80 border border-amber-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-4xl font-black text-slate-900 leading-none">{unassignedCount}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-amber-500 leading-tight">Unassigned</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">Booked - awaiting driver assignment</p>
              </div>
            </div>

            {/* In Transit Card */}
            <div 
              onClick={() => handleCardFilterClick('In Transit')}
              className={`p-6 rounded-[24px] bg-white flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] h-32 text-left cursor-pointer transition-all hover:-translate-y-0.5 ${
                activeCardFilter === 'In Transit' 
                  ? 'border-2 border-slate-900 shadow-md' 
                  : 'border border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-blue-50/80 border border-blue-100/50 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-4xl font-black text-slate-900 leading-none">{transitCount}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight">In Transit</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">Assigned & physically moving</p>
              </div>
            </div>

            {/* Issues Card */}
            <div 
              onClick={() => handleCardFilterClick('Issues')}
              className={`p-6 rounded-[24px] bg-white flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] h-32 text-left cursor-pointer transition-all hover:-translate-y-0.5 ${
                activeCardFilter === 'Issues' 
                  ? 'border-2 border-slate-900 shadow-md' 
                  : 'border border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-rose-50/80 border border-rose-100/50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                </div>
                <span className="text-4xl font-black text-slate-900 leading-none">{issuesCount}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight">Issues</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">Delayed or delivery problems</p>
              </div>
            </div>

            {/* Received Card */}
            <div 
              onClick={() => handleCardFilterClick('Received')}
              className={`p-6 rounded-[24px] bg-white flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] h-32 text-left cursor-pointer transition-all hover:-translate-y-0.5 ${
                activeCardFilter === 'Received' 
                  ? 'border-2 border-slate-900 shadow-md' 
                  : 'border border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-emerald-50/80 border border-emerald-100/50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-4xl font-black text-slate-900 leading-none">{receivedCount}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight">Received</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">Handover complete / Delivered</p>
              </div>
            </div>

          </div>

          {/* TABS & TABLE WRAPPER */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
            {/* Controls Row */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex gap-2 flex-wrap">
                {['All', 'Local Pickups', 'Branch Transfers', 'Local Deliveries', 'Draft'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeTab === tab 
                        ? 'border border-slate-900 text-slate-900 bg-slate-50/50 font-black' 
                        : 'border border-transparent text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="text-xs font-bold text-slate-500 pr-2">
                {filteredLoads.length} results {activeCardFilter !== 'ALL' && `(Filtered: ${activeCardFilter})`}
              </div>
            </div>

            {/* Loads Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/40 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">REFERENCE</th>
                    <th className="px-6 py-4">ROUTING</th>
                    <th className="px-6 py-4">PRIORITY</th>
                    <th className="px-6 py-4">LOAD</th>
                    <th className="px-6 py-4">RESOURCE</th>
                    <th className="px-6 py-4 text-right pr-8">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredLoads.length > 0 ? filteredLoads.map((load, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                      {/* Reference */}
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle">
                        <span className="text-xs font-bold text-slate-900 block leading-tight">{load.id}</span>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1 leading-none">
                          REF: {load.ref} <span className="text-slate-300 mx-0.5">•</span> SN: {load.sn}
                        </span>
                      </td>

                      {/* Routing */}
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <span>{load.from}</span>
                          <span className="text-slate-400 font-medium">→</span>
                          <span>{load.to}</span>
                        </div>
                      </td>

                      {/* Priority badge */}
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle">
                        <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider leading-none border ${
                          load.priority === 'HIGH' || load.priority === 'URGENT'
                            ? 'bg-red-50 text-red-600 border-red-100/50' 
                            : load.priority === 'MEDIUM'
                            ? 'bg-amber-50 text-amber-600 border-amber-100/55'
                            : 'bg-slate-50 text-slate-500 border-slate-150'
                        }`}>
                          {load.priority}
                        </span>
                      </td>

                      {/* Weight */}
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle">
                        <span className="text-xs font-bold text-slate-700">{load.weight}</span>
                      </td>

                      {/* Resource */}
                      <td className="px-6 py-5 whitespace-nowrap text-left align-middle">
                        <span className={`text-xs ${load.resource === 'Pending Assignment' ? 'italic text-slate-400' : 'font-bold text-slate-800'}`}>
                          {load.resource}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 whitespace-nowrap text-right pr-8 align-middle">
                        <button 
                          onClick={() => triggerToast(`Viewing details for load ${load.id}`)}
                          className="px-4 py-1.5 border border-slate-200 text-slate-650 hover:text-black rounded-lg text-xs font-bold transition-all cursor-pointer hover:bg-slate-50 shadow-3xs uppercase tracking-wider"
                        >
                          DETAILS
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-450 font-bold text-xs">
                        No loads matching active tab filter and search query
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer info bar */}
            <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-row justify-between items-center text-[10px] font-bold text-slate-400">
              <div>
                {loadsData.length} loads <span className="text-slate-350 mx-1.5">•</span> Sydney Central Depot
              </div>
              <div>
                Updated just now
              </div>
            </div>
          </div>
        </>
      ) : (
        
        /* ====================================================
            VIEW 2: CREATE LOAD CONSOLE (2nd Screenshot Match)
            ==================================================== */
        <div className="space-y-6">
          
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 rounded-[20px] p-5 shadow-3xs">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowCreateConsole(false)}
                className="w-10 h-10 rounded-xl hover:bg-slate-55 border border-slate-200 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-3xs"
              >
                <ArrowLeft size={16} className="stroke-[2.5px]" />
              </button>
              <div>
                <h1 className="text-base font-black text-slate-900 tracking-tight leading-none uppercase">
                  CREATE LOAD <span className="text-[#FFA000]">CONSOLE</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-1.5 tracking-wider">
                  START NEW DISPATCH TASK • STEPS 1 THRU 3
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleSaveDraft}
                className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer transition-all shadow-3xs uppercase tracking-wider"
              >
                SAVE DRAFT
              </button>
              
              <button 
                onClick={handleActivateLoad}
                className="bg-[#0B0F17] hover:bg-slate-800 text-[#FFA000] font-black text-xs py-3 px-6 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap tracking-wider uppercase flex items-center gap-1.5"
              >
                + ACTIVATE LOAD
              </button>
            </div>
          </div>

          {/* Form Content Grid split (Left forms, Right specs) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Main Form column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* STEP 1: Route configuration Card */}
              <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-[#1D4ED8] rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={16} className="stroke-[2.5px]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-900">STEP 1: CONFIGURE ROUTE STOPS</h3>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">DEFINE ALL PHYSICAL LOCATIONS FOR THIS LOAD</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddStop}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9px] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer uppercase"
                  >
                    + ADD STOP
                  </button>
                </div>

                {/* Stops fields list */}
                <div className="space-y-6 relative pl-3">
                  {/* Dotted vertical line connecting stops */}
                  <div className="absolute left-[20px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-slate-200"></div>

                  {formStops.map((stop, idx) => (
                    <div key={idx} className="relative flex gap-4 text-left">
                      {/* Stop Bullet */}
                      <span className="w-4 h-4 rounded-full bg-slate-900 border-4 border-white shadow-3xs shrink-0 z-10 mt-3.5"></span>

                      {/* Form inputs block */}
                      <div className="flex-grow p-4 bg-slate-50/50 border border-slate-100 rounded-2xl relative">
                        {/* Remove stop button */}
                        {formStops.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStop(idx)}
                            className="absolute top-3.5 right-3.5 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Stop Type Dropdown */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">STOP TYPE</label>
                            <select
                              value={stop.type}
                              onChange={e => {
                                const newSt = [...formStops];
                                newSt[idx].type = e.target.value;
                                setFormStops(newSt);
                              }}
                              className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                            >
                              <option value="Pickup">Pickup</option>
                              <option value="Drop">Drop</option>
                            </select>
                          </div>

                          {/* Address input */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">ADDRESS / SUBURB</label>
                            <div className="relative">
                              <MapPin size={12} className="text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                placeholder="Full location address..."
                                value={stop.address}
                                onChange={e => {
                                  const newSt = [...formStops];
                                  newSt[idx].address = e.target.value;
                                  setFormStops(newSt);
                                }}
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-750 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3.5">
                          {/* Contact Name */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">CONTACT NAME</label>
                            <input
                              type="text"
                              placeholder="Receiver/Sender Name"
                              value={stop.contact}
                              onChange={e => {
                                const newSt = [...formStops];
                                newSt[idx].contact = e.target.value;
                                setFormStops(newSt);
                              }}
                              className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-750 focus:outline-none"
                            />
                          </div>

                          {/* Contact Phone */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">PHONE</label>
                            <input
                              type="text"
                              placeholder="+61 4..."
                              value={stop.phone}
                              onChange={e => {
                                const newSt = [...formStops];
                                newSt[idx].phone = e.target.value;
                                setFormStops(newSt);
                              }}
                              className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-750 focus:outline-none"
                            />
                          </div>

                          {/* Required time */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">REQUIRED TIME</label>
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy --:-- --"
                              value={stop.time}
                              onChange={e => {
                                const newSt = [...formStops];
                                newSt[idx].time = e.target.value;
                                setFormStops(newSt);
                              }}
                              className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 2: Declare items Card */}
              <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-amber-50 border border-amber-100 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                      <Folder size={16} className="stroke-[2.5px]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-900">STEP 2: DECLARE ITEMS / CARS</h3>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">LINK EACH ITEM TO THE CREATED STOPS ABOVE</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-[#0B0F17] hover:bg-slate-800 text-white font-extrabold text-[9px] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer uppercase"
                  >
                    + ADD ITEM
                  </button>
                </div>

                {/* Items Declared */}
                <div className="space-y-6">
                  {formItems.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50/30 border border-slate-100 rounded-2xl relative space-y-4">
                      
                      {/* Sub Header row */}
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">
                          DECLARED ITEM #{idx + 1}
                        </span>

                        {formItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 hover:bg-slate-150 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Customer / Sender */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">CUSTOMER / SENDER</label>
                          <input
                            type="text"
                            placeholder="Active Rego"
                            value={item.customer}
                            onChange={e => {
                              const newIt = [...formItems];
                              newIt[idx].customer = e.target.value;
                              setFormItems(newIt);
                            }}
                            className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                          />
                        </div>

                        {/* Link Pickup */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">LINK PICKUP STOP</label>
                          <select
                            value={item.pickupStop}
                            onChange={e => {
                              const newIt = [...formItems];
                              newIt[idx].pickupStop = e.target.value;
                              setFormItems(newIt);
                            }}
                            className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                          >
                            <option value="Step #1 Pickup (No Address)">Step #1 Pickup (No Address)</option>
                            {formStops.map((st, i) => (
                              <option key={i} value={`Stop #${i + 1} ${st.type}`}>
                                Stop #{i + 1} {st.type} {st.address && `(${st.address})`}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Link Dropoff */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">LINK DROP-OFF STOP</label>
                          <select
                            value={item.dropStop}
                            onChange={e => {
                              const newIt = [...formItems];
                              newIt[idx].dropStop = e.target.value;
                              setFormItems(newIt);
                            }}
                            className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                          >
                            <option value="Step #2 Drop (No Address)">Step #2 Drop (No Address)</option>
                            {formStops.map((st, i) => (
                              <option key={i} value={`Stop #${i + 1} ${st.type}`}>
                                Stop #{i + 1} {st.type} {st.address && `(${st.address})`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {/* Item Identification */}
                        <div className="sm:col-span-3 flex flex-col gap-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">ITEM DESCRIPTION / IDENTIFICATION</label>
                          <input
                            type="text"
                            placeholder="e.g. 2024 Toyota Hilux or General..."
                            value={item.desc}
                            onChange={e => {
                              const newIt = [...formItems];
                              newIt[idx].desc = e.target.value;
                              setFormItems(newIt);
                            }}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-750 focus:outline-none"
                          />
                        </div>

                        {/* Weight */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">WEIGHT - KGS</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={item.weight}
                            onChange={e => {
                              const newIt = [...formItems];
                              newIt[idx].weight = e.target.value;
                              setFormItems(newIt);
                            }}
                            className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-750 focus:outline-none"
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Spec column */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Load Specification Card (Dark Container matching screenshot) */}
              <div className="bg-[#0B0F17] rounded-[24px] p-6 text-white text-left space-y-5 shadow-md">
                <span className="text-[10px] font-black text-[#FFA000] tracking-wider block uppercase">
                  LOAD SPECIFICATIONS
                </span>

                <div className="space-y-4">
                  {/* Weight sub-total */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">SUB-TOTAL WEIGHT (KGS)</label>
                    <input
                      type="text"
                      value={formSpecs.weight}
                      onChange={e => setFormSpecs(prev => ({ ...prev, weight: e.target.value }))}
                      className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white focus:outline-none"
                    />
                  </div>

                  {/* Priority selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">PRIORITY LEVEL</label>
                    <div className="grid grid-cols-3 bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                      {['NORMAL', 'MEDIUM', 'URGENT'].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormSpecs(prev => ({ ...prev, priority: level }))}
                          className={`py-1.5 rounded-lg text-[9px] font-black transition-all cursor-pointer tracking-wider ${
                            formSpecs.priority === level
                              ? 'bg-[#FFA000] text-black font-extrabold shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Overall Deadline */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">OVERALL DEADLINE</label>
                    <div className="relative">
                      <Calendar size={13} className="text-slate-450 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="dd-mm-yyyy --:-- --"
                        value={formSpecs.deadline}
                        onChange={e => setFormSpecs(prev => ({ ...prev, deadline: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents & Photos */}
              <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-4">
                <span className="text-[10px] font-black text-slate-400 tracking-wider block uppercase">
                  DOCUMENTS & PHOTOS
                </span>

                <div className="grid grid-cols-2 gap-4">
                  {/* Manifest PDF target */}
                  <button 
                    type="button"
                    onClick={() => triggerToast('Manifest file attachment requested')}
                    className="p-5 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-slate-400 transition-colors cursor-pointer"
                  >
                    <FileText className="w-5 h-5 text-red-500" />
                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider">MANIFEST</span>
                  </button>

                  {/* Photos target */}
                  <button 
                    type="button"
                    onClick={() => triggerToast('Equipment images upload requested')}
                    className="p-5 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-slate-400 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider">PHOTOS</span>
                  </button>
                </div>
              </div>

              {/* Internal dispatcher notes */}
              <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-3.5">
                <span className="text-[10px] font-black text-slate-400 tracking-wider block uppercase">
                  INTERNAL DISPATCHER NOTES
                </span>

                <textarea
                  placeholder="Gate codes, site rules, or special procedures..."
                  value={formSpecs.notes}
                  onChange={e => setFormSpecs(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white transition-all shadow-3xs h-24 resize-none"
                />
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
