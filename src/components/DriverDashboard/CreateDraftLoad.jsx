import React, { useState } from 'react';
import { Compass, FileText, AlertTriangle, X, Phone, MessageSquare, Mic, Wifi, WifiOff, CheckCircle2, Shield } from 'lucide-react';

export default function CreateDraftLoad() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(true); // Open by default based on screenshot
  
  // Custom toast notification states
  const [toast, setToast] = useState({
    show: false,
    type: 'error', // 'error' or 'success'
    message: ''
  });

  // Connection states matching screenshot
  const [isOffline, setIsOffline] = useState(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [routeDetails, setRouteDetails] = useState('');

  // Validation error states
  const [errors, setErrors] = useState({
    customer: false,
    route: false
  });

  // SOS states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  const triggerToast = (type, message) => {
    setToast({
      show: true,
      type,
      message
    });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleCreateDraft = (e) => {
    e.preventDefault();
    const hasCustomerError = !customerName.trim();
    const hasRouteError = !routeDetails.trim();

    setErrors({
      customer: hasCustomerError,
      route: hasRouteError
    });

    if (hasCustomerError || hasRouteError) {
      // First image validation style: Red error alert
      triggerToast('error', 'Shipper and Route are required.');
      return;
    }

    if (isOffline) {
      setOfflineQueueCount(prev => prev + 1);
    }
    
    triggerToast('success', `Draft load for ${customerName} saved locally.`);
    setCustomerName('');
    setRouteDetails('');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const hasCustomerError = !customerName.trim();
    const hasRouteError = !routeDetails.trim();

    setErrors({
      customer: hasCustomerError,
      route: hasRouteError
    });

    if (hasCustomerError || hasRouteError) {
      // Show same validation toast
      triggerToast('error', 'Shipper and Route are required.');
      return;
    }

    if (isOffline) {
      setOfflineQueueCount(prev => prev + 1);
    }
    
    // Second image success validation style: Green success alert
    triggerToast('success', 'Draft shipment submitted for dispatcher review.');
    setCustomerName('');
    setRouteDetails('');
  };

  const handleToggleConnection = () => {
    if (isOffline) {
      setIsOffline(false);
      if (offlineQueueCount > 0) {
        triggerToast('success', `Synced ${offlineQueueCount} queued draft loads online.`);
        setOfflineQueueCount(0);
      } else {
        triggerToast('success', 'Driver portal switched to Online Mode.');
      }
    } else {
      setIsOffline(true);
      triggerToast('success', 'Driver portal switched to Offline Mode.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[800px] mx-auto bg-gray-55 min-h-screen text-left flex flex-col space-y-6 relative pb-28">
      
      {/* Toast Notification Container with dynamic error/success layouts matching screenshot exactly */}
      {toast.show && (
        <div className={`fixed bottom-24 right-6 z-[120] px-4.5 py-3 rounded-2xl flex items-center gap-3 shadow-lg border animate-fade-in max-w-sm ${
          toast.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-slate-800'
            : 'bg-emerald-50 border-emerald-200 text-slate-800'
        }`}>
          {toast.type === 'error' ? (
            <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <span className="text-xs font-black">!</span>
            </div>
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          )}
          <span className="text-xs font-bold leading-none">{toast.message}</span>
          <button 
            onClick={() => setToast(prev => ({ ...prev, show: false }))} 
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            <X size={14} />
          </button>
        </div>
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
            <span className="text-xl font-black text-gray-800">create draft-load</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD & logistics operations controls.</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] cursor-pointer" title="Driver Controls">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Create Draft Shipment Form Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-3xs text-left space-y-5">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Create Draft Shipment</h2>
          <p className="text-gray-455 text-[10px] font-bold mt-1 uppercase tracking-wider">Submit a cargo draft to dispatcher registry for review and assignment.</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">SHIPPER CUSTOMER NAME</label>
            <input 
              type="text"
              placeholder="e.g. Vance Refrigeration"
              value={customerName}
              onChange={e => {
                setCustomerName(e.target.value);
                if (e.target.value.trim()) setErrors(prev => ({ ...prev, customer: false }));
              }}
              className={`w-full px-4 py-2.5 border rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400] ${
                errors.customer ? 'border-red-500 bg-red-50/10' : 'border-gray-250 bg-white'
              }`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">ROUTE DETAILS (ORIGIN ➔ DESTINATION)</label>
            <input 
              type="text"
              placeholder="e.g. Chicago ➔ Boston"
              value={routeDetails}
              onChange={e => {
                setRouteDetails(e.target.value);
                if (e.target.value.trim()) setErrors(prev => ({ ...prev, route: false }));
              }}
              className={`w-full px-4 py-2.5 border rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400] ${
                errors.route ? 'border-red-500 bg-red-50/10' : 'border-gray-255 bg-white'
              }`}
            />
          </div>

          {/* Form Action buttons row matching UI */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button 
              type="button" 
              onClick={handleCreateDraft}
              className="bg-[#FFD400] hover:bg-yellow-400 text-black font-bold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer text-center uppercase border-2 border-black"
            >
              Create Draft Load
            </button>
            <button 
              type="button" 
              onClick={handleSubmitReview}
              className="bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs cursor-pointer text-center uppercase"
            >
              Submit Draft for Review
            </button>
          </div>
        </form>
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
                onClick={() => { triggerToast('error', 'EMERGENCY: Panic alert sent.'); setSosModalOpen(false); }}
                className="p-5 bg-red-50/70 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-red-650"
              >
                <Shield className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Panic Button</span>
              </button>
              <button 
                onClick={() => { triggerToast('success', 'ALERT: Breakdown reported.'); setSosModalOpen(false); }}
                className="p-5 bg-[#FFFBEB] border border-amber-250 rounded-2xl hover:bg-[#FEF3C7] transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-[#D97706]"
              >
                <Truck className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Breakdown</span>
              </button>
              <button 
                onClick={() => { triggerToast('error', 'EMERGENCY: Accident logged.'); setSosModalOpen(false); }}
                className="p-5 bg-red-50/70 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-red-650"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Accident</span>
              </button>
              <button 
                onClick={() => { triggerToast('error', 'EMERGENCY: Medical assistance requested.'); setSosModalOpen(false); }}
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
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pb-1 border-b border-gray-55">HOTLINE SHORTCUTS</span>
              
              <div className="space-y-3.5 text-xs font-bold text-gray-700">
                <button 
                  onClick={() => { triggerToast('success', 'Dialing dispatcher hotline...'); setHotlineOpen(false); }}
                  className="w-full py-1 text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>Call Dispatch</span>
                </button>
                <button 
                  onClick={() => { triggerToast('success', 'Opening dispatch message console...'); setHotlineOpen(false); }}
                  className="w-full py-1 text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span>Message Dispatch</span>
                </button>
                <button 
                  onClick={() => { triggerToast('success', 'Voice note recorder active.'); setHotlineOpen(false); }}
                  className="w-full py-1 text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <Mic className="w-4 h-4 text-gray-400" />
                  <span>Voice Note</span>
                </button>
                <div className="w-full h-px bg-gray-100"></div>
                <button 
                  onClick={() => { triggerToast('success', 'Speech to text active.'); setHotlineOpen(false); }}
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
