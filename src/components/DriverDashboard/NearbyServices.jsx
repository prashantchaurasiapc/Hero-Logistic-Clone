import React, { useState } from 'react';
import { Compass, MapPin, Truck, AlertTriangle, Heart, X, Phone, MessageSquare, Mic, Navigation, Wifi } from 'lucide-react';

export default function NearbyServices() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // SOS panel states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  // List of nearby services
  const [services, setServices] = useState([
    {
      id: 1,
      tag: 'FUEL STATION',
      name: 'Loves Travel Stop #342',
      desc: 'Diesel lanes, scale, showers, parking',
      distance: '1.2 miles away',
      status: 'Open'
    },
    {
      id: 2,
      tag: 'WORKSHOP',
      name: 'TA Truck Service Garage',
      desc: 'Brake repair, trailer mechanics, tire swap',
      distance: '3.5 miles away',
      status: 'Open'
    },
    {
      id: 3,
      tag: 'PARKING',
      name: 'Public Truck Parking Area',
      desc: '15 overnight spaces remaining',
      distance: '4.8 miles away',
      status: 'Open'
    },
    {
      id: 4,
      tag: 'REST AREA',
      name: 'Illinois State Rest Stop',
      desc: 'Restrooms, picnic tables, vending',
      distance: '7.1 miles away',
      status: 'Open'
    }
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleRoute = (serviceName, dist) => {
    triggerToast(`Routing to ${serviceName} (${dist}) initiated on GPS navigation...`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[800px] mx-auto bg-gray-55 min-h-screen text-left flex flex-col space-y-6 relative pb-28">
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
            <span className="text-xl font-black text-gray-800">nearby services</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD & logistics operations controls.</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] cursor-pointer" title="Services Directory">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Nearby Services Intro Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-3xs flex items-center gap-4 relative overflow-hidden">
        {/* Yellow Accent Border Left */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFD400]"></div>
        <div className="pl-2">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            Nearby Services
          </h2>
          <p className="text-gray-450 text-[10px] font-bold mt-1 uppercase tracking-wider">Locate crucial driver amenities along your active route.</p>
        </div>
      </div>

      {/* Services List Card Items */}
      <div className="space-y-4">
        {services.map((item) => (
          <div 
            key={item.id} 
            className="bg-white border border-gray-150 rounded-3xl p-5 shadow-3xs flex justify-between items-center hover:shadow-2xs transition-shadow text-left"
          >
            <div className="space-y-1.5 flex-1 min-w-0 pr-4">
              <span className="bg-amber-50 text-[#D97706] text-[8px] font-black px-2 py-0.5 rounded tracking-wide uppercase border border-amber-100 block w-max">
                {item.tag}
              </span>
              <h3 className="text-sm font-bold text-gray-900 truncate">{item.name}</h3>
              <p className="text-[11px] text-gray-500 font-semibold truncate leading-tight">{item.desc}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                <span>{item.distance}</span>
                <span>•</span>
                <span className="text-emerald-650 font-bold">{item.status}</span>
              </div>
            </div>

            <button 
              onClick={() => handleRoute(item.name, item.distance)}
              className="bg-[#FFD400] hover:bg-yellow-400 text-black font-bold text-[10px] py-2 px-4.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 uppercase shrink-0"
            >
              <Navigation className="w-3.5 h-3.5 fill-black" /> Route
            </button>
          </div>
        ))}
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
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-55">
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
                className="p-5 bg-[#FFFBEB] border border-amber-250 rounded-2xl hover:bg-[#FEF3C7] transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-[#D97706]"
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
