import React, { useState } from 'react';
import { Compass, FileText, CheckCircle, AlertTriangle, X, Phone, MessageSquare, Mic, Wifi, WifiOff, Upload, Clock, Lock } from 'lucide-react';

export default function Documents() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(true); // Open by default based on screenshot
  const [toastMsg, setToastMsg] = useState('');
  
  // Connection states matching screenshot
  const [isOffline, setIsOffline] = useState(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  // SOS states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  // Upload modal states
  const [uploadTarget, setUploadTarget] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newExpiry, setNewExpiry] = useState('');

  // Documents list state
  const [docsList, setDocsList] = useState([
    {
      id: 'cdl',
      name: 'Commercial Driver License (CDL)',
      expiry: '12/15/2028',
      status: 'Valid',
      compliant: true,
      alertMsg: 'Document compliant'
    },
    {
      id: 'dot',
      name: 'DOT Medical Certificate',
      expiry: '09/01/2027',
      status: 'Valid',
      compliant: true,
      alertMsg: 'Document compliant'
    },
    {
      id: 'hazmat',
      name: 'Hazmat Training Endorsement',
      expiry: '07/15/2026',
      status: 'Expiring Soon',
      compliant: false,
      alertMsg: 'Action required soon'
    }
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleOpenUpload = (doc) => {
    setUploadTarget(doc);
    setNewExpiry('');
    setSelectedFile(null);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!uploadTarget) return;

    // Simulate file submission
    if (isOffline) {
      setOfflineQueueCount(prev => prev + 1);
      triggerToast(`Offline Mode active: Document upload queued in sync memory.`);
    } else {
      triggerToast(`Document ${uploadTarget.name} uploaded successfully and approved.`);
    }

    // Update document expiry and status in state list
    setDocsList(prev => prev.map(doc => {
      if (doc.id === uploadTarget.id) {
        return {
          ...doc,
          expiry: newExpiry || '12/31/2030',
          status: 'Valid',
          compliant: true,
          alertMsg: 'Document compliant'
        };
      }
      return doc;
    }));

    setUploadTarget(null);
  };

  const handleToggleConnection = () => {
    if (isOffline) {
      setIsOffline(false);
      if (offlineQueueCount > 0) {
        triggerToast(`Synced ${offlineQueueCount} queued documents to dispatch center database.`);
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
            <span className="text-xl font-black text-gray-800">documents</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD & logistics operations controls.</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] cursor-pointer" title="Driver Controls">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Driver Credentials Title Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-3xs flex items-center gap-4 relative overflow-hidden">
        {/* Yellow Accent Border Left */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFD400]"></div>
        <div className="pl-2">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D97706]" />
            Driver Credentials
          </h2>
          <p className="text-gray-455 text-[10px] font-bold mt-1 uppercase tracking-wider">Keep FMCSA & DOT compliance documents updated.</p>
        </div>
      </div>

      {/* Document Items Stack */}
      <div className="space-y-4">
        {docsList.map((item) => (
          <div 
            key={item.id} 
            className="bg-white border border-gray-150 rounded-3xl p-5 shadow-3xs space-y-4 text-left hover:shadow-2xs transition-shadow"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                <span className="text-[10px] text-gray-405 font-semibold block mt-1">Expires: {item.expiry}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                item.status === 'Valid' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {item.status}
              </span>
            </div>

            {/* Bottom Status / compliance check alert line */}
            <div className="flex justify-between items-center pt-2.5 border-t border-gray-50 flex-wrap gap-2">
              <div className={`flex items-center gap-1.5 text-[10px] font-bold ${
                item.compliant ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {item.compliant ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
                <span>{item.alertMsg}</span>
              </div>

              <button 
                onClick={() => handleOpenUpload(item)}
                className="bg-[#FFD400] hover:bg-yellow-400 text-black font-bold text-[10px] py-1.5 px-3.5 rounded-xl transition-all shadow-xs cursor-pointer uppercase shrink-0"
              >
                Renew / Upload
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FLOAT FLOATING SOS BUTTON */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-[100]">
        <button 
          onClick={() => setSosModalOpen(true)}
          className="w-12 h-12 bg-white border border-red-200 hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold text-xs shadow-lg cursor-pointer transition-all border-t-2"
        >
          SOS
        </button>

        {/* Floating Hotline toggle shortcut button */}
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
            
            <p className="text-xs text-gray-455 leading-relaxed mb-5 font-semibold">
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
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pb-1 border-b border-gray-55">HOTLINE SHORTCUTS</span>
              
              <div className="space-y-3.5 text-xs font-bold text-gray-700">
                <button 
                  onClick={() => { triggerToast('Dialing dispatcher hotline...'); setHotlineOpen(false); }}
                  className="w-full py-1 text-left hover:text-black transition-colors flex items-center gap-3 animate-pulse"
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

      {/* RENEW / UPLOAD DOCUMENT MODAL */}
      {uploadTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-sm w-full p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-900">Upload {uploadTarget.name}</h2>
              <button onClick={() => setUploadTarget(null)} className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Select Document File</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer select-none">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <span className="text-xs font-bold text-gray-500 block">Click or Drag PDF/JPG here</span>
                  <input 
                    type="file" 
                    required
                    onChange={e => setSelectedFile(e.target.files[0])}
                    className="hidden" 
                    id="doc-file-input"
                  />
                  {selectedFile && (
                    <span className="text-[10px] text-emerald-600 font-bold block mt-2">{selectedFile.name} Selected</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">New Expiration Date</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 12/31/2030"
                  value={newExpiry}
                  onChange={e => setNewExpiry(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFD400] hover:bg-yellow-400 text-black font-bold py-3 rounded-xl text-xs mt-3 cursor-pointer transition-colors shadow-sm text-center uppercase"
              >
                SUBMIT FOR VERIFICATION
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
