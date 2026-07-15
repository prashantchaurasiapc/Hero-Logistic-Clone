import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Inbox, Search, Plus, Clock, X, Check, ChevronDown, ChevronUp, User 
} from 'lucide-react';

export default function LoadInbox() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };
  
  // Track which manifests are expanded
  const [expandedDrafts, setExpandedDrafts] = useState({});

  // Draft Loads Mock Data matching the screenshot exactly
  const [draftsData, setDraftsData] = useState([
    {
      id: 'DRAFT-1092',
      time: '10 mins ago',
      urgent: true,
      driver: 'Michael Chen',
      avatar: 'M',
      volume: '2 Units',
      from: 'MELBOURNE',
      to: 'BRISBANE',
      borderClass: 'border-t-red-500',
      manifestCount: 2,
      manifests: [
        { vin: '1FA6P8CF0H5XXXXXX', model: '2023 Ford Mustang GT' },
        { vin: 'SALWA2BV4DAXXXXXX', model: '2022 Range Rover Sport' }
      ]
    },
    {
      id: 'DRAFT-1091',
      time: '45 mins ago',
      urgent: false,
      driver: 'Sarah Connor',
      avatar: 'S',
      volume: '1 Units',
      from: 'SYDNEY',
      to: 'PERTH',
      borderClass: 'border-t-amber-500',
      manifestCount: 1,
      manifests: [
        { vin: 'JTMAB3FV7NDXXXXXX', model: '2023 Tesla Model Y' }
      ]
    },
    {
      id: 'DRAFT-1088',
      time: '2 hrs ago',
      urgent: false,
      driver: 'James Park',
      avatar: 'J',
      volume: '4 Units',
      from: 'BRISBANE',
      to: 'ADELAIDE',
      borderClass: 'border-t-amber-500',
      manifestCount: 4,
      manifests: [
        { vin: 'WBA5A3C03NFXXXXXX', model: '2023 BMW 330i' },
        { vin: 'WBA5A3C08NFXXXXXX', model: '2023 BMW 330i' },
        { vin: 'JA3AZ3FV8NDXXXXXX', model: '2021 Toyota Hilux' },
        { vin: 'SALWA2BV7DAXXXXXX', model: '2022 Land Rover Defender' }
      ]
    }
  ]);

  const handleToggleExpand = (id) => {
    setExpandedDrafts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleApprove = (id) => {
    triggerToast(`Draft load ${id} approved and dispatched!`);
    setDraftsData(prev => prev.filter(d => d.id !== id));
  };

  const handleReject = (id) => {
    if (window.confirm(`Are you sure you want to reject and delete draft ${id}?`)) {
      setDraftsData(prev => prev.filter(d => d.id !== id));
      triggerToast(`Draft load ${id} has been rejected`);
    }
  };

  const filteredDrafts = draftsData.filter(draft => {
    const matchesSearch = draft.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          draft.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          draft.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          draft.to.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'ALL') return matchesSearch;
    if (activeTab === 'PENDING') return matchesSearch;
    if (activeTab === 'HIGH') return matchesSearch && draft.urgent;
    return matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] px-8 py-8 space-y-6 text-left font-sans antialiased text-slate-800">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">
          {toastMsg}
        </div>
      )}
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <div className="flex items-center gap-3">
            {/* Tray Icon */}
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-pink-500 shadow-3xs shrink-0">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3.5">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                  Load Inbox
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-black rounded-lg bg-amber-50 text-amber-600 border border-amber-100/50 uppercase tracking-wide">
                  {draftsData.length} PENDING
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-2">
                Field-submitted draft loads — Review & convert to active
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/dispatcher/loads')}
          className="bg-[#FFA000] hover:bg-[#FF9000] text-black font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap tracking-wider uppercase flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> NEW MANUAL LOAD
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full pt-1">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-650" />
          <input
            type="text"
            placeholder="Search by ID, Driver, or Origin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
          />
        </div>

        <div className="bg-white border border-slate-200/80 rounded-full p-1 flex shadow-3xs select-none">
          {['ALL', 'PENDING', 'HIGH'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-white text-slate-800 border border-slate-100 shadow-[0_2px_8px_rgb(0,0,0,0.06)]' 
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* DRAFT CARDS LIST */}
      <div className="space-y-6">
        {filteredDrafts.length > 0 ? filteredDrafts.map((draft) => (
          <div 
            key={draft.id}
            className={`bg-white rounded-[24px] border border-slate-100 border-t-4 ${draft.borderClass} shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden text-left flex flex-col`}
          >
            {/* Top row section */}
            <div className="p-5 flex justify-between items-center gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 leading-tight">{draft.id}</span>
                    {draft.urgent && (
                      <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase bg-red-50 text-red-500 border border-red-100/50 leading-none">
                        URGENT
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1 leading-none">{draft.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Reject Cross Button */}
                <button 
                  onClick={() => handleReject(draft.id)}
                  className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:border-red-400 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Approve Checkmark Button */}
                <button 
                  onClick={() => handleApprove(draft.id)}
                  className="bg-[#FFA000] hover:bg-[#FF9000] text-black font-extrabold text-xs py-2 px-4.5 rounded-xl transition-all shadow-3xs cursor-pointer whitespace-nowrap uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3px]" /> APPROVE
                </button>
              </div>
            </div>

            {/* Inner details row */}
            <div className="px-5 pb-5">
              <div className="p-4 bg-slate-50/45 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                {/* Driver */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                    {draft.avatar}
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">DRIVER ASSIGNED</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5 leading-tight">{draft.driver}</span>
                  </div>
                </div>

                {/* Cargo Volume */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs shrink-0">
                    📦
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">CARGO VOLUME</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5 leading-tight">{draft.volume}</span>
                  </div>
                </div>

                {/* Routing Badge */}
                <div className="bg-blue-50/50 text-blue-600 border border-blue-100/50 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-wider self-stretch md:self-auto flex items-center justify-center">
                  {draft.from} <span className="text-blue-300 mx-1.5">→</span> {draft.to}
                </div>

              </div>
            </div>

            {/* Vin manifest footer trigger */}
            <div 
              onClick={() => handleToggleExpand(draft.id)}
              className="px-5 py-3.5 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-450 hover:text-slate-800 cursor-pointer select-none transition-colors"
            >
              <span>VIEW VIN MANIFEST ({draft.manifestCount})</span>
              {expandedDrafts[draft.id] ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>

            {/* Expandable Manifest List */}
            {expandedDrafts[draft.id] && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-50 bg-slate-50/10">
                <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">DECLARED CARGO ITEMS & VINS</span>
                  <div className="divide-y divide-slate-100 text-xs">
                    {draft.manifests.map((m, idx) => (
                      <div key={idx} className="py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 font-semibold">
                        <span className="text-slate-800">{m.model}</span>
                        <span className="text-slate-400 font-mono text-[10px]">VIN: {m.vin}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )) : (
          <div className="bg-white border border-slate-100 rounded-[20px] p-12 shadow-sm text-center text-slate-400 font-bold text-xs">
            No draft loads pending in inbox
          </div>
        )}
      </div>

    </div>
  );
}
