import React, { useState } from 'react';
import { Shield, Truck, AlertTriangle, Heart, X, Phone, MessageSquare, Mic, HelpCircle, ArrowRight, Clock, Link, Check, Wifi } from 'lucide-react';

export default function StartWork() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // Start shift checklist states
  const [tractor, setTractor] = useState('TX-CAB002 (Kenworth T680)');
  const [trailer, setTrailer] = useState('TR-4022 (Flatbed 48ft)');
  const [odometer, setOdometer] = useState('124500');
  const [fuel, setFuel] = useState('85');
  const [dvirChecked, setDvirChecked] = useState(false);
  const [eldChecked, setEldChecked] = useState(false);
  const [shiftActive, setShiftActive] = useState(false);

  // SOS panel states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-[800px] mx-auto bg-gray-50 min-h-screen text-left flex flex-col space-y-6 relative pb-28">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">{toastMsg}</div>
      )}

      {/* Connection status tag */}
      <div className="flex justify-center">
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] px-4 py-2 rounded-2xl flex items-center gap-2 text-[#047857] text-xs font-bold shadow-3xs">
          <span>Connection Status:</span>
          <span className="bg-[#059669] text-white px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1">
            Online Mode <Wifi className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 flex justify-between items-center shadow-3xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">Driver Portal</h1>
            <span className="text-xl font-bold text-gray-400">•</span>
            <span className="text-xl font-black text-gray-800">start finish</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD & logistics operations controls.</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] cursor-pointer" title="ELD Info">
          <Link className="w-4 h-4" />
        </div>
      </div>

      {/* Shift status log Box */}
      <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-3xs flex justify-between items-center">
        <div className="text-left">
          <span className="text-[9px] font-black text-gray-400 tracking-wider block uppercase mb-1">SHIFT LOGGING SYSTEM</span>
          <div className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-full border-2 ${shiftActive ? 'bg-emerald-500 border-emerald-600' : 'bg-gray-100 border-gray-300'}`}></span>
            <span className="text-xs font-bold text-gray-900">{shiftActive ? 'Shift Active (On Duty)' : 'Shift Inactive (Off Duty)'}</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Today's Assigned Manifest Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-3xs text-left space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-50">
          <span className="text-[10px] font-black text-gray-900 tracking-wider block uppercase">TODAY'S ASSIGNED MANIFEST</span>
        </div>

        <div className="p-4 border border-gray-150 rounded-2xl bg-white space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-bold text-gray-400 block uppercase">LOAD ID: LD-9411</span>
              <h3 className="text-sm font-bold text-gray-900 mt-1">Automotive Components (Flatbed)</h3>
            </div>
            <span className="bg-amber-50 text-[#D97706] text-[8px] font-black px-2.5 py-0.5 rounded tracking-wide uppercase border border-amber-100">
              IN TRANSIT
            </span>
          </div>

          <div className="text-xs font-bold text-gray-700">
            <div className="flex items-center gap-1">
              <span>Route: Chicago IL</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
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
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-3xs text-left space-y-5">
        <span className="text-[10px] font-black text-gray-900 tracking-wider block uppercase">START SHIFT CHECKLIST</span>
        
        <form onSubmit={handleStartShift} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">SELECT TRACTOR / POWER UNIT</label>
            <select
              value={tractor}
              onChange={e => setTractor(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none bg-white cursor-pointer"
            >
              <option value="TX-CAB002 (Kenworth T680)">TX-CAB002 (Kenworth T680)</option>
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
              <span className="text-xs font-bold text-gray-800">Verify Pre-Trip DVIR completed</span>
              <input 
                type="checkbox"
                checked={dvirChecked}
                onChange={e => setDvirChecked(e.target.checked)}
                className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-400 w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
              <span className="text-xs font-bold text-gray-800">Confirm Regulatory ELD connection</span>
              <input 
                type="checkbox"
                checked={eldChecked}
                onChange={e => setEldChecked(e.target.checked)}
                className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-400 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* GPS Telemetry Block */}
          <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex justify-between items-center">
            <div className="text-left">
              <span className="text-[9px] font-bold text-gray-450 block uppercase">LIVE GPS TELEMETRY</span>
              <span className="text-xs font-bold text-emerald-600 block mt-0.5">Verified ✓ (41.8781° N, 87.6298° W)</span>
            </div>
            <button 
              type="button"
              onClick={() => triggerToast('GPS coordinates reset and locked.')}
              className="bg-emerald-600 text-white font-bold text-[9px] py-1.5 px-3 rounded-lg flex items-center justify-center cursor-pointer shadow-3xs hover:bg-emerald-700 transition-colors"
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
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-50">
              <h2 className="text-base font-bold text-gray-900">Emergency Dispatch SOS Panel</h2>
              <button onClick={() => setSosModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"><X size={18} /></button>
            </div>
            
            <p className="text-xs text-gray-450 leading-relaxed mb-5 font-semibold">
              Triggering an emergency alerts the dispatch operations center immediately and logs active tracking.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { triggerToast('EMERGENCY: Panic alert sent.'); setSosModalOpen(false); }}
                className="p-5 bg-red-50/70 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-red-650"
              >
                <Shield className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Panic Button</span>
              </button>
              <button 
                onClick={() => { triggerToast('ALERT: Breakdown reported.'); setSosModalOpen(false); }}
                className="p-5 bg-[#FFFBEB] border border-amber-200 rounded-2xl hover:bg-[#FEF3C7] transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-[#D97706]"
              >
                <Truck className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Breakdown</span>
              </button>
              <button 
                onClick={() => { triggerToast('EMERGENCY: Accident logged.'); setSosModalOpen(false); }}
                className="p-5 bg-red-50/70 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-red-650"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Accident</span>
              </button>
              <button 
                onClick={() => { triggerToast('EMERGENCY: Medical assistance requested.'); setSosModalOpen(false); }}
                className="p-5 bg-red-50/70 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-red-650"
              >
                <Heart className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Medical</span>
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-50 space-y-3">
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
                  onChange={e => setNotifyDispatcherState(e.target.checked)}
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
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pb-1 border-b border-gray-50">HOTLINE SHORTCUTS</span>
              
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
                  <span className="text-gray-400">🎙️</span>
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
