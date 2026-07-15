import React, { useState } from 'react';
import { Compass, AlertTriangle, X, Phone, MessageSquare, Mic, Wifi, WifiOff, Upload, Settings, CheckCircle2, Shield, Heart, Truck, FileText } from 'lucide-react';

export default function IncidentReporting() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(true); // Open by default based on screenshot
  const [toastMsg, setToastMsg] = useState('');
  
  // Connection states matching screenshot
  const [isOffline, setIsOffline] = useState(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  // Form states
  const [category, setCategory] = useState('Highway Road Accident');
  const [description, setDescription] = useState('');
  const [attachedPhoto, setAttachedPhoto] = useState(null);

  // Spacing layout state
  const [spacing, setSpacing] = useState('default'); // 'compact', 'default', 'relaxed'

  // Columns visibility state
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    category: true,
    loggedDate: true,
    status: true
  });

  // SOS states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  // Incidents history
  const [incidents, setIncidents] = useState([
    { id: 1, category: 'Cargo Damage', date: '06/12/2026', status: 'UNDER REVIEW' }
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleToggleColumn = (colKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [colKey]: !prev[colKey]
    }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedPhoto(file.name);
      triggerToast(`Photo ${file.name} attached to incident file.`);
    }
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      triggerToast('Error: Please provide details in incident description.');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-GB'); // dd/mm/yyyy format
    const newIncident = {
      id: incidents.length + 1,
      category,
      date: currentDate,
      status: 'UNDER REVIEW'
    };

    setIncidents([newIncident, ...incidents]);
    triggerToast(`Incident report for ${category} submitted successfully.`);
    
    // Reset Form
    setDescription('');
    setAttachedPhoto(null);

    if (isOffline) {
      setOfflineQueueCount(prev => prev + 1);
    }
  };

  const handleToggleConnection = () => {
    if (isOffline) {
      setIsOffline(false);
      if (offlineQueueCount > 0) {
        triggerToast(`Synced ${offlineQueueCount} queued incident reports online.`);
        setOfflineQueueCount(0);
      } else {
        triggerToast('Driver portal switched to Online Mode.');
      }
    } else {
      setIsOffline(true);
      triggerToast('Driver portal switched to Offline Mode.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[800px] mx-auto bg-gray-55 min-h-screen text-left flex flex-col space-y-6 relative pb-28">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">{toastMsg}</div>
      )}

      {/* Connection status tag */}
      <div className="flex justify-center">
        <button 
          onClick={handleToggleConnection}
          className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-3xs cursor-pointer transition-all border ${
            isOffline 
              ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]' 
              : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]'
          }`}
          title="Toggle network online/offline mode"
        >
          <span>Connection Status:</span>
          <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1 text-white ${
            isOffline ? 'bg-amber-600' : 'bg-emerald-600'
          }`}>
            {isOffline ? 'Offline Mode' : 'Online Mode'} 
            {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
          </span>
        </button>
      </div>

      {/* Offline Alert Box */}
      {isOffline && (
        <div className="bg-[#FEF3C7] border border-[#FDE68A] p-3.5 rounded-2xl flex items-center gap-2 text-[#B45309] text-xs font-bold shadow-3xs text-left animate-pulse">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Offline Active | {offlineQueueCount} items queued</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 flex justify-between items-center shadow-3xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">Driver Portal</h1>
            <span className="text-xl font-bold text-gray-400">•</span>
            <span className="text-xl font-black text-gray-800">incidents</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD & logistics operations controls.</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] cursor-pointer" title="Driver Controls">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Incident Logger Title Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-3xs flex items-center gap-4 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFD400]"></div>
        <div className="pl-2">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            Incident Logger
          </h2>
          <p className="text-gray-455 text-[10px] font-bold mt-1 uppercase tracking-wider">File digital accident reports and cargo/trailer defect logs.</p>
        </div>
      </div>

      {/* Log New Incident Report Form Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-3xs text-left space-y-5">
        <span className="text-[10px] font-black text-gray-405 block tracking-wider uppercase">LOG NEW INCIDENT REPORT</span>

        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">INCIDENT CATEGORY TYPE</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none bg-white cursor-pointer"
            >
              <option value="Highway Road Accident">Highway Road Accident</option>
              <option value="Cargo Damage">Cargo Damage</option>
              <option value="Trailer Defect">Trailer Defect</option>
              <option value="Breakdown / Engine Failure">Breakdown / Engine Failure</option>
              <option value="Fuel Theft / Siphoning">Fuel Theft / Siphoning</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">INCIDENT DESCRIPTION</label>
            <textarea
              rows={3}
              placeholder="Type incident crash/exception details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none resize-none"
            />
          </div>

          {/* Attach incident photos box */}
          <div className="relative border border-dashed border-gray-250 rounded-2xl p-6 text-center hover:bg-gray-55/50 cursor-pointer select-none transition-colors">
            <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {attachedPhoto ? `Attached: ${attachedPhoto} ✓` : 'Attach Incident Photos'}
            </span>
            <input 
              type="file"
              onChange={handlePhotoSelect}
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#EF4444] hover:bg-red-650 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer text-center uppercase"
          >
            Submit Incident Report
          </button>
        </form>
      </div>

      {/* Incident Log Registry History Table */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-3xs text-left space-y-5 relative">
        <div className="flex justify-between items-center pb-2 border-b border-gray-55 flex-wrap gap-3">
          <span className="text-[10px] font-black text-gray-900 tracking-wider block uppercase">INCIDENT LOG REGISTRY</span>
          
          <div className="flex items-center gap-3">
            {/* Spacing controllers list */}
            <div className="flex border border-gray-200 p-0.5 rounded-lg bg-gray-55 shrink-0">
              {['COMPACT', 'DEFAULT', 'RELAXED'].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpacing(sp.toLowerCase())}
                  className={`px-2.5 py-1 rounded text-[8px] font-black tracking-wider transition-all cursor-pointer ${
                    spacing === sp.toLowerCase() 
                      ? 'bg-[#FFD400] text-black shadow-3xs' 
                      : 'text-gray-400 hover:text-gray-655 bg-transparent'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>

            {/* Columns Visibility configurations */}
            <button 
              onClick={() => setColumnsDropdownOpen(!columnsDropdownOpen)}
              className="px-3.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-55 text-gray-500 hover:text-black cursor-pointer shadow-3xs bg-white shrink-0 flex items-center gap-1.5 text-[9px] font-black"
            >
              <Settings className="w-3.5 h-3.5" /> COLUMNS
            </button>
          </div>
        </div>

        {/* Columns visibility card panel */}
        {columnsDropdownOpen && (
          <div className="absolute right-6 top-16 bg-white border border-gray-150 rounded-2xl p-4 shadow-xl z-50 w-48 text-left space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pb-1 border-b border-gray-50">COLUMN VISIBILITY</span>
            <div className="space-y-3">
              <label className="flex items-center gap-2.5 text-xs font-bold text-gray-800 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={visibleColumns.category}
                  onChange={() => handleToggleColumn('category')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>Category</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-gray-800 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={visibleColumns.loggedDate}
                  onChange={() => handleToggleColumn('loggedDate')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>Logged Date</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-gray-800 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={visibleColumns.status}
                  onChange={() => handleToggleColumn('status')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>Status</span>
              </label>
            </div>
          </div>
        )}

        {/* Spacing rows list */}
        <div className="space-y-3">
          <div className="grid grid-cols-12 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4">
            <span className="col-span-1"></span>
            {visibleColumns.category && <span className="col-span-4 text-left">CATEGORY</span>}
            {visibleColumns.loggedDate && <span className="col-span-4 text-left">LOGGED DATE</span>}
            {visibleColumns.status && <span className="col-span-3 text-right">STATUS</span>}
          </div>

          <div className="divide-y divide-gray-55 border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-3xs">
            {incidents.map((item) => (
              <div 
                key={item.id} 
                className={`grid grid-cols-12 items-center px-4 hover:bg-gray-55/50 transition-colors ${
                  spacing === 'compact' ? 'py-2' :
                  spacing === 'relaxed' ? 'py-4.5' :
                  'py-3'
                }`}
              >
                <div className="col-span-1 flex items-center justify-start">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer" />
                </div>
                {visibleColumns.category && <span className="col-span-4 text-xs font-bold text-gray-900 text-left">{item.category}</span>}
                {visibleColumns.loggedDate && <span className="col-span-4 text-xs font-bold text-gray-700 text-left">{item.date}</span>}
                {visibleColumns.status && (
                  <div className="col-span-3 text-right">
                    <span className="px-2.5 py-0.5 rounded text-[8px] font-bold tracking-wider bg-gray-100 text-gray-655 border border-gray-200">
                      {item.status}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FLOAT FLOATING SOS BUTTON */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-[100]">
        <button 
          onClick={() => setSosModalOpen(true)}
          className="w-12 h-12 bg-white border border-red-200 hover:bg-red-55 text-red-500 rounded-full flex items-center justify-center font-bold text-xs shadow-lg cursor-pointer transition-all border-t-2"
        >
          SOS
        </button>

        {/* Floating Hotline toggle shortcut button */}
        <button 
          onClick={() => hotlineOpen ? setHotlineOpen(false) : setHotlineOpen(true)}
          className="w-12 h-12 bg-[#FFD400] hover:bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all z-[120]"
        >
          {hotlineOpen ? <X className="w-5 h-5 text-black" strokeWidth={2.5} /> : <MessageSquare className="w-5 h-5" />}
        </button>
      </div>

      {/* SOS EMERGENCY PANEL MODAL */}
      {sosModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-55">
              <h2 className="text-base font-bold text-gray-900">Emergency Dispatch SOS Panel</h2>
              <button onClick={() => setSosModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"><X size={18} /></button>
            </div>
            
            <p className="text-xs text-gray-455 leading-relaxed mb-5 font-semibold">
              Triggering an emergency alerts the dispatch operations center immediately and logs active tracking.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { triggerToast('EMERGENCY: Panic alert sent.'); setSosModalOpen(false); }}
                className="p-5 bg-red-50/70 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-red-655"
              >
                <Shield className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Panic Button</span>
              </button>
              <button 
                onClick={() => { triggerToast('ALERT: Breakdown reported.'); setSosModalOpen(false); }}
                className="p-5 bg-[#FFFBEB] border border-amber-250 rounded-2xl hover:bg-[#FEF3C7] transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-[#D97706]"
              >
                <Truck className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Breakdown</span>
              </button>
              <button 
                onClick={() => { triggerToast('EMERGENCY: Accident logged.'); setSosModalOpen(false); }}
                className="p-5 bg-red-50/70 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-red-655"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Accident</span>
              </button>
              <button 
                onClick={() => { triggerToast('EMERGENCY: Medical assistance requested.'); setSosModalOpen(false); }}
                className="p-5 bg-red-50/70 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-red-655"
              >
                <Heart className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Medical</span>
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-55 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                <span>Share Live GPS Tracking</span>
                <input 
                  type="checkbox"
                  checked={shareGps}
                  onChange={e => setShareGps(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                <span>Auto-Notify Dispatch Center</span>
                <input 
                  type="checkbox"
                  checked={autoNotify}
                  onChange={e => setAutoNotify(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOTLINE SHORTCUTS OVERLAY PANEL */}
      {hotlineOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[110] flex items-end sm:items-center justify-center p-4">
          <div className="bg-transparent max-w-xs w-full flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-200">
            
            {/* The Hotline Card */}
            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-2xl w-full text-left space-y-4">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pb-1 border-b border-gray-55">HOTLINE SHORTCUTS</span>
              
              <div className="space-y-3.5 text-xs font-bold text-gray-700">
                <button 
                  onClick={() => { triggerToast('Dialing dispatcher hotline...'); setHotlineOpen(false); }}
                  className="w-full py-1 text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>Call Dispatch</span>
                </button>
                <button 
                  onClick={() => { triggerToast('Opening dispatch message console...'); setHotlineOpen(false); }}
                  className="w-full py-1 text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span>Message Dispatch</span>
                </button>
                <button 
                  onClick={() => { triggerToast('Voice note recorder active.'); setHotlineOpen(false); }}
                  className="w-full py-1 text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <Mic className="w-4 h-4 text-gray-400" />
                  <span>Voice Note</span>
                </button>
                <div className="w-full h-px bg-gray-100"></div>
                <button 
                  onClick={() => { triggerToast('Speech to text active.'); setHotlineOpen(false); }}
                  className="w-full py-1 text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <span className="text-gray-455">🎙️</span>
                  <span>Voice-to-Text</span>
                </button>
              </div>
            </div>

            {/* Circular Close X Button underneath */}
            <button 
              onClick={() => setHotlineOpen(false)}
              className="w-12 h-12 bg-[#FFD400] hover:bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all shrink-0"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
