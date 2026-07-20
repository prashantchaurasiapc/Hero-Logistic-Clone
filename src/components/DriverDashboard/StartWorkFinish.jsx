import React, { useState } from 'react';
import { Shield, Truck, AlertTriangle, Heart, X, Phone, MessageSquare, Mic, HelpCircle, ArrowRight, Clock, Link, Check, Wifi } from 'lucide-react';

export default function StartWork() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // Start shift checklist states
  const [tractor, setTractor] = useState('TX-ROAD88 (Freightliner Cascadia)');
  const [trailer, setTrailer] = useState('TR-4022 (Flatbed 48ft)');
  const [odometer, setOdometer] = useState('124500');
  const [fuel, setFuel] = useState('85');
  const [dvirChecked, setDvirChecked] = useState(false);
  const [eldChecked, setEldChecked] = useState(false);
  const [shiftActive, setShiftActive] = useState(false);

  // SOS panel states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  // Connection status toggle
  const [isOnline, setIsOnline] = useState(true);
  const [activeSosAlert, setActiveSosAlert] = useState(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleStartShift = (e) => {
    e.preventDefault();
    if (!dvirChecked || !eldChecked) {
      triggerToast('Please verify pre-trip DVIR and confirm regulatory ELD connection.');
      return;
    }
    setShiftActive(true);
    triggerToast('Shift started successfully. Odometer and ELD logged in.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen text-left flex flex-col space-y-6 relative pb-28">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">{toastMsg}</div>
      )}

      {/* Connection status toggle */}
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 sm:p-4 bg-white border border-gray-150 rounded-2xl shadow-sm">
          <span className="text-sm font-bold text-gray-600 flex items-center gap-2 justify-center sm:justify-start">
            <svg className="w-4 h-4 text-amber-500 rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            Connection Status:
          </span>
          <button
            onClick={() => {
              setIsOnline(prev => !prev);
              triggerToast(isOnline ? 'Connection switched to Offline Mode.' : 'Connection restored to Online Mode.');
            }}
            className={`px-4 py-1.5 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold border cursor-pointer transition-all w-full sm:w-auto ${
              isOnline
                ? 'bg-[#E6F4EA] border-[#CEEAD6] text-[#137333]'
                : 'bg-[#FEF7E0] border-[#FEEFC3] text-[#B06000]'
            }`}
          >
            <span>{isOnline ? 'Online Mode' : 'Offline Mode'}</span>
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[9px] ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}>
              {isOnline ? '🌐' : '−'}
            </span>
          </button>
        </div>

        {/* Offline Banner */}
        {!isOnline && (
          <div className="w-full bg-[#FFFBEB] border border-[#FCD34D] px-4 py-3 rounded-2xl flex items-center gap-2 text-[#92400E] text-xs font-bold shadow-sm">
            <span className="text-[#F59E0B] text-sm">⚠</span>
            <span>Offline Active</span>
            <span className="text-[#B45309]">|</span>
            <span>0 items queued</span>
          </div>
        )}

        {/* SOS ACTIVE Banner (Matching screenshot) */}
        {activeSosAlert && (
          <div className="w-full bg-[#FEE2E2] border border-[#FCA5A5] px-4 py-2 rounded-2xl flex items-center justify-between text-[#EF4444] text-xs font-bold shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#EF4444] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>🚨 SOS ACTIVE: {activeSosAlert}</span>
            </div>
            <button
              onClick={() => setActiveSosAlert(null)}
              className="bg-[#EF4444] text-black font-extrabold px-3 py-1 rounded-full text-xs hover:bg-red-650 cursor-pointer shadow-sm"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-150 rounded-3xl p-4 sm:p-6 flex justify-between items-center shadow-3xs gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight leading-none">Driver Portal</h1>
            <span className="text-lg sm:text-xl font-bold text-gray-400">•</span>
            <span className="text-lg sm:text-xl font-black text-gray-800">start finish</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD & logistics operations controls.</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] cursor-pointer shrink-0" title="ELD Info">
          <Link className="w-4 h-4" />
        </div>
      </div>

      {/* Shift status log Box */}
      <div className="bg-white border border-gray-150 rounded-3xl p-4 sm:p-5 shadow-3xs flex justify-between items-center gap-4">
        <div className="text-left">
          <span className="text-[9px] font-black text-gray-400 tracking-wider block uppercase mb-1">SHIFT LOGGING SYSTEM</span>
          <div className="flex items-center gap-2">
            {shiftActive ? (
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-emerald-600 shrink-0"></span>
            ) : (
              <span className="text-base leading-none" style={{filter: 'hue-rotate(200deg) saturate(0.6) brightness(0.85)'}}>🌙</span>
            )}
            <span className="text-xs font-bold text-gray-900">{shiftActive ? 'Shift Active (On Duty)' : 'Shift Inactive (Off Duty)'}</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Today's Assigned Manifest Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-4 sm:p-6 shadow-3xs text-left space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-50">
          <span className="text-[10px] font-black text-gray-900 tracking-wider block uppercase">TODAY'S ASSIGNED MANIFEST</span>
        </div>

        <div className="p-3 sm:p-4 border border-gray-150 rounded-2xl bg-white space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[9px] font-bold text-gray-400 block uppercase">LOAD ID: LD-9411</span>
              <h3 className="text-sm font-bold text-gray-900 mt-1">Automotive Components (Flatbed)</h3>
            </div>
            <span className="bg-amber-50 text-[#D97706] text-[8px] font-black px-2.5 py-0.5 rounded tracking-wide uppercase border border-amber-100 self-start sm:self-auto">
              IN TRANSIT
            </span>
          </div>

          <div className="text-xs font-bold text-gray-700">
            <div className="flex items-center gap-1 flex-wrap">
              <span>Route: Chicago IL</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Dallas TX</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[10px] text-gray-500 font-bold">
            <div>
              <span className="text-gray-400 font-semibold block uppercase">Customer:</span>
              <span className="text-gray-900 mt-0.5 block">Global Retail Corp</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold block uppercase">Trailer:</span>
              <span className="text-gray-900 mt-0.5 block">-</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[10px] text-gray-500 font-bold pt-2 border-t border-gray-50">
            <div>
              <span className="text-gray-400 font-semibold block uppercase">Appt:</span>
              <span className="text-gray-900 mt-0.5 block">16:00 PM (Priority: High)</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold block uppercase">Status:</span>
              <span className="text-[#D97706] mt-0.5 block">In Transit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Start Shift Checklist Form */}
      <div className="bg-white border border-gray-150 rounded-3xl p-4 sm:p-6 shadow-3xs text-left space-y-5">
        <span className="text-[10px] font-black text-gray-900 tracking-wider block uppercase">START SHIFT CHECKLIST</span>
        
        <form onSubmit={handleStartShift} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">SELECT TRACTOR / POWER UNIT</label>
            <select
              value={tractor}
              onChange={e => setTractor(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none bg-white cursor-pointer"
            >
              <option value="TX-ROAD88 (Freightliner Cascadia)">TX-ROAD88 (Freightliner Cascadia)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">SELECT TRAILER UNIT</label>
            <select
              value={trailer}
              onChange={e => setTrailer(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none bg-white cursor-pointer"
            >
              <option value="TR-4022 (Flatbed 48ft)">TR-4022 (Flatbed 48ft)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">INITIAL ODOMETER READING (MILES)</label>
              <input 
                type="text"
                value={odometer}
                onChange={e => setOdometer(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">INITIAL FUEL LEVEL (%)</label>
              <input 
                type="text"
                value={fuel}
                onChange={e => setFuel(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
              <span className="text-xs text-gray-800">Verify Pre-Trip DVIR completed</span>
              <input 
                type="checkbox"
                checked={dvirChecked}
                onChange={e => setDvirChecked(e.target.checked)}
                className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-400 w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
              <span className="text-xs text-gray-800">Confirm Regulatory ELD connection</span>
              <input 
                type="checkbox"
                checked={eldChecked}
                onChange={e => setEldChecked(e.target.checked)}
                className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-400 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* GPS Telemetry Block */}
          <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="text-left">
              <span className="text-[9px] font-bold text-gray-450 block uppercase">LIVE GPS TELEMETRY</span>
              <span className="text-xs font-bold text-emerald-600 block mt-0.5 break-all">Verified ✓ (41.8781° N, 87.6298° W)</span>
            </div>
            <button 
              type="button"
              onClick={() => triggerToast('GPS coordinates reset and locked.')}
              className="bg-emerald-700 text-white font-bold text-[9px] py-2 px-3 rounded-lg flex items-center justify-center cursor-pointer shadow-sm hover:bg-emerald-800 transition-colors w-full sm:w-auto"
            >
              Lock Reset
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#10B981] hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-xs mt-3 cursor-pointer transition-colors shadow-sm text-center uppercase"
          >
            Confirm & Start Work Shift
          </button>
        </form>
      </div>

      {/* FLOAT FLOATING BUTTONS IN BOTTOM CORNER */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-[100]">
        {/* SOS button */}
        <button 
          onClick={() => setSosModalOpen(true)}
          className="w-12 h-12 bg-white border border-red-200 hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold text-xs shadow-lg cursor-pointer transition-all border-t-2"
        >
          SOS
        </button>

        {/* Chat / hotline button */}
        <button 
          onClick={() => setHotlineOpen(true)}
          className="w-12 h-12 bg-[#FFD400] hover:bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      {/* SOS EMERGENCY PANEL MODAL */}
      {sosModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-4 sm:p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-50">
              <h2 className="text-base font-bold text-gray-900">Emergency Dispatch SOS Panel</h2>
              <button onClick={() => setSosModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"><X size={18} /></button>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Triggering an emergency alerts the dispatch operations center immediately and logs active tracking.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Shield className="w-5 h-5 text-red-500" />, label: 'Panic Button', color: 'bg-red-50/70 border-red-100 text-red-500', msg: 'Panic Alert dispatched!' },
                { icon: <Truck className="w-5 h-5 text-amber-500" />, label: 'Breakdown', color: 'bg-[#FFFBEB] border-amber-200 text-[#D97706]', msg: 'Breakdown Alert dispatched!' },
                { icon: <AlertTriangle className="w-5 h-5 text-red-500" />, label: 'Accident', color: 'bg-red-50/70 border-red-100 text-red-500', msg: 'Accident Alert dispatched!' },
                { icon: <Heart className="w-5 h-5 text-red-500" />, label: 'Medical', color: 'bg-red-50/70 border-red-100 text-red-500', msg: 'Medical Emergency Alert dispatched!' },
              ].map(({ icon, label, color, msg }) => (
                <button
                  key={label}
                  onClick={() => {
                    setActiveSosAlert(msg);
                    triggerToast(`SOS ACTIVE: ${msg}`);
                    setSosModalOpen(false);
                  }}
                  className={`p-3 sm:p-5 border rounded-2xl hover:opacity-90 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer ${color}`}
                >
                  {icon}
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-50 space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-800">
                <span>Share Live GPS Tracking</span>
                <input 
                  type="checkbox"
                  checked={shareGps}
                  onChange={e => setShareGps(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center text-xs text-gray-800">
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
        <div className="fixed inset-0 z-[110]" onClick={() => setHotlineOpen(false)}>
          <div
            className="absolute bottom-6 right-6 flex flex-col items-end gap-3"
            onClick={e => e.stopPropagation()}
          >
            {/* The Hotline Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xl w-52 text-left space-y-3">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pb-2 border-b border-gray-100">HOTLINE SHORTCUTS</span>
              
              <div className="space-y-3 text-sm text-gray-700">
                <button 
                  onClick={() => { triggerToast('Dialing dispatcher hotline...'); setHotlineOpen(false); }}
                  className="w-full text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Call Dispatch</span>
                </button>
                <button 
                  onClick={() => { triggerToast('Opening dispatch message console...'); setHotlineOpen(false); }}
                  className="w-full text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <MessageSquare className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Message Dispatch</span>
                </button>
                <button 
                  onClick={() => { triggerToast('Voice note recorder active.'); setHotlineOpen(false); }}
                  className="w-full text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <Mic className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Voice Note</span>
                </button>
                <button 
                  onClick={() => { triggerToast('Speech to text active.'); setHotlineOpen(false); }}
                  className="w-full text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <span className="w-4 h-4 text-gray-400 shrink-0 flex items-center justify-center text-xs">🎙</span>
                  <span>Voice-to-Text</span>
                </button>
              </div>
            </div>

            {/* Circular Close X Button */}
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
