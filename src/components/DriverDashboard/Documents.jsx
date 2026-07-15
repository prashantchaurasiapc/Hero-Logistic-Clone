import React, { useState } from 'react';
import { Shield, Truck, AlertTriangle, Heart, X, Phone, MessageSquare, Mic, Link, Wifi, FileText, CheckCircle2, AlertCircle, Upload, Calendar, Compass } from 'lucide-react';

export default function Documents() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [activeSosAlert, setActiveSosAlert] = useState(null);

  // Renewal Modal State
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // SOS states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const openRenewModal = (docName) => {
    setSelectedDoc(docName);
    setRenewModalOpen(true);
  };

  const closeRenewModal = () => {
    setSelectedDoc(null);
    setRenewModalOpen(false);
  };

  const handleUpdateDocument = () => {
    triggerToast(`${selectedDoc} updated successfully.`);
    closeRenewModal();
  };

  const documents = [
    {
      id: 1,
      name: 'Commercial Driver License (CDL)',
      expires: '12/15/2028',
      status: 'Valid',
      statusColor: 'bg-emerald-50 text-emerald-600',
      message: 'Document compliant',
      messageIcon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
    },
    {
      id: 2,
      name: 'DOT Medical Certificate',
      expires: '09/01/2027',
      status: 'Valid',
      statusColor: 'bg-emerald-50 text-emerald-600',
      message: 'Document compliant',
      messageIcon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
    },
    {
      id: 3,
      name: 'Hazmat Training Endorsement',
      expires: '07/15/2026',
      status: 'Expiring Soon',
      statusColor: 'bg-amber-50 text-amber-600',
      message: 'Action required soon',
      messageIcon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
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

        {/* SOS ACTIVE Banner */}
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
            <span className="text-xl font-black text-gray-800">documents</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD &amp; logistics operations controls.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#FFFBEB] flex items-center justify-center text-[#D97706] shrink-0">
          <Compass className="w-5 h-5" />
        </div>
      </div>

      {/* Main Section Card */}
      <div className="bg-white border border-amber-100 rounded-3xl p-6 shadow-sm text-left flex items-start gap-3">
        <FileText className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
        <div>
          <h2 className="text-base font-black text-gray-900 leading-tight">Driver Credentials</h2>
          <p className="text-gray-500 text-[11px] mt-1 font-semibold">Keep FMCSA &amp; DOT compliance documents updated.</p>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm hover:shadow transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-black text-gray-900">{doc.name}</h3>
                <p className="text-gray-500 text-[11px] font-semibold mt-1">Expires: {doc.expires}</p>
              </div>
              <span className={`${doc.statusColor} text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-wider`}>
                {doc.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 italic">
                {doc.messageIcon}
                <span>{doc.message}</span>
              </div>
              <button 
                onClick={() => openRenewModal(doc.name)}
                className="bg-[#FFD400] text-black font-black text-[10px] py-1.5 px-3 rounded-full hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
              >
                Renew / Upload
              </button>
            </div>
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

      {/* RENEW DOCUMENT MODAL */}
      {renewModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-lg font-black text-[#0F172A]">Renew Driver CDL Document</h2>
              <button onClick={closeRenewModal} className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Date Input */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">NEW EXPIRATION DATE</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
                    defaultValue=""
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* File Upload Box */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 text-gray-500" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-black text-gray-900 block">Upload Credentials Scan</span>
                <span className="text-[11px] font-semibold text-gray-400 mt-1">PDF or JPEG file format</span>
              </div>
            </div>

            <div className="p-6 pt-2">
              <button 
                onClick={handleUpdateDocument}
                className="w-full bg-[#FFB000] text-black font-black text-sm py-3.5 rounded-xl hover:bg-[#F59E0B] transition-colors shadow-sm cursor-pointer"
              >
                Update Document
              </button>
            </div>
          </div>
        </div>
      )}

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
