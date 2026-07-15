import React, { useState } from 'react';
import { Shield, Truck, AlertTriangle, Heart, X, Phone, MessageSquare, Mic, Link, Wifi, MapPin, Navigation } from 'lucide-react';

export default function NearbyServices() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [activeSosAlert, setActiveSosAlert] = useState(null);

  // SOS states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const services = [
    {
      id: 1,
      category: 'FUEL STATION',
      name: 'Loves Travel Stop #342',
      description: 'Diesel lanes, scale, showers, parking',
      distance: '1.2 miles away',
      status: 'Open'
    },
    {
      id: 2,
      category: 'WORKSHOP',
      name: 'TA Truck Service Garage',
      description: 'Brake repair, trailer mechanics, tire swap',
      distance: '3.5 miles away',
      status: 'Open'
    },
    {
      id: 3,
      category: 'PARKING',
      name: 'Public Truck Parking Area',
      description: '15 overnight spaces remaining',
      distance: '4.8 miles away',
      status: 'Open'
    },
    {
      id: 4,
      category: 'REST AREA',
      name: 'Illinois State Rest Stop',
      description: 'Restrooms, picnic tables, vending',
      distance: '7.1 miles away',
      status: 'Open'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen text-left flex flex-col space-y-6 relative pb-28">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-24 right-6 z-[120] bg-white border border-gray-200 text-gray-800 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-xl flex items-center gap-2 max-w-xs animate-fade-in">
          <span className="text-emerald-500 text-base">✓</span>
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg('')} className="ml-auto text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Connection status toggle */}
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="w-full flex justify-between items-center p-3 bg-white border border-gray-150 rounded-2xl shadow-sm">
          <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
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
            className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold border cursor-pointer transition-all ${
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
      <div className="bg-white border border-gray-150 rounded-3xl p-6 flex justify-between items-center shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">Driver Portal</h1>
            <span className="text-xl font-bold text-gray-400">•</span>
            <span className="text-xl font-black text-gray-800">nearby services</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD &amp; logistics operations controls.</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] cursor-pointer" title="ELD Info">
          <Link className="w-4 h-4" />
        </div>
      </div>

      {/* Main Nearby Services Card */}
      <div className="bg-white border border-amber-100 rounded-3xl p-6 shadow-sm text-left flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#D97706] shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-900 leading-tight">Nearby Services</h2>
          <p className="text-gray-500 text-xs mt-1.5 font-semibold">Locate crucial driver amenities along your active route.</p>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex justify-between items-center hover:border-amber-200 transition-colors">
            <div className="text-left space-y-2">
              <span className="bg-[#FFFBEB] text-[#B45309] border border-amber-200 text-[9px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">
                {service.category}
              </span>
              <h3 className="text-base font-black text-gray-900">{service.name}</h3>
              <p className="text-xs font-semibold text-gray-500">{service.description}</p>
              <div className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 pt-0.5">
                <span>{service.distance}</span>
                <span>•</span>
                <span className="text-emerald-600">{service.status}</span>
              </div>
            </div>

            <button
              onClick={() => triggerToast(`Routing path to ${service.name} loaded.`)}
              className="bg-[#FFD400] border border-[#FEF3C7] text-black font-black text-xs py-2 px-4 rounded-full flex items-center gap-1 shadow-md hover:bg-yellow-400 transition-all cursor-pointer select-none"
            >
              <Navigation className="w-3.5 h-3.5 rotate-45" fill="black" />
              <span>Route</span>
            </button>
          </div>
        ))}
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-[100]">
        <button
          onClick={() => setSosModalOpen(true)}
          className="w-12 h-12 bg-white border-2 border-red-200 hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold text-xs shadow-lg cursor-pointer transition-all"
        >
          SOS
        </button>
        <button
          onClick={() => setHotlineOpen(true)}
          className="w-12 h-12 bg-[#FFD400] hover:bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      {/* SOS EMERGENCY PANEL MODAL */}
      {sosModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-xl text-left">
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
                  className={`p-5 border rounded-2xl hover:opacity-90 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer ${color}`}
                >
                  {icon}
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-50 space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-800">
                <span>Share Live GPS Tracking</span>
                <input type="checkbox" checked={shareGps} onChange={e => setShareGps(e.target.checked)} className="rounded border-gray-300 text-blue-600 w-4 h-4 cursor-pointer" />
              </div>
              <div className="flex justify-between items-center text-xs text-gray-800">
                <span>Auto-Notify Dispatch Center</span>
                <input type="checkbox" checked={autoNotify} onChange={e => setAutoNotify(e.target.checked)} className="rounded border-gray-300 text-blue-600 w-4 h-4 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOTLINE SHORTCUTS PANEL */}
      {hotlineOpen && (
        <div className="fixed inset-0 z-[110]" onClick={() => setHotlineOpen(false)}>
          <div
            className="absolute bottom-6 right-6 flex flex-col items-end gap-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xl w-52 text-left space-y-3">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pb-2 border-b border-gray-100">HOTLINE SHORTCUTS</span>
              <div className="space-y-3 text-sm text-gray-700">
                {[
                  { icon: <Phone className="w-4 h-4 text-gray-400 shrink-0" />, label: 'Call Dispatch', msg: 'Dialing dispatcher hotline...' },
                  { icon: <MessageSquare className="w-4 h-4 text-gray-400 shrink-0" />, label: 'Message Dispatch', msg: 'Opening dispatch message console...' },
                  { icon: <Mic className="w-4 h-4 text-gray-400 shrink-0" />, label: 'Voice Note', msg: 'Voice note recorder active.' },
                  { icon: <span className="w-4 h-4 text-gray-400 shrink-0 flex items-center justify-center text-xs">🎙</span>, label: 'Voice-to-Text', msg: 'Speech to text active.' },
                ].map(({ icon, label, msg }) => (
                  <button
                    key={label}
                    onClick={() => { triggerToast(msg); setHotlineOpen(false); }}
                    className="w-full text-left hover:text-black transition-colors flex items-center gap-3"
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
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
