import React, { useState } from 'react';
import { Shield, Truck, AlertTriangle, Heart, X, Phone, MessageSquare, Mic, Link, Wifi, ArrowRight, Upload } from 'lucide-react';

export default function Jobs() {
  const [step, setStep] = useState(1); // 1=StartWork, 2=TruckTrailerConfirm, 3=Odometer, 4=Compliance
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [activeSosAlert, setActiveSosAlert] = useState(null);

  // Step 2 states
  const [truckConfirmed, setTruckConfirmed] = useState(false);
  const [trailerConfirmed, setTrailerConfirmed] = useState(false);

  // Step 3: Odometer
  const [odometerValue, setOdometerValue] = useState('124,500');

  // Step 4: Compliance
  const [brakeInspection, setBrakeInspection] = useState(true);
  const [tirePressure, setTirePressure] = useState(true);
  const [loadStraps, setLoadStraps] = useState(false);
  const [hazardKit, setHazardKit] = useState(true);

  // SOS states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const stepLabel = () => {
    if (step === 1) return 'Step 1 of 17';
    if (step === 2) return 'Step 2 of 17';
    if (step === 3) return 'Step 3 of 17';
    return 'Step 4 of 17';
  };

  const nextRequiredAction = () => {
    if (step === 1) return 'Start Work Shift';
    if (step === 2) return 'Confirm Vehicle';
    if (step === 3) return 'Upload Odometer';
    return 'Complete Compliance';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen text-left flex flex-col space-y-6 relative pb-28">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-24 right-6 z-[120] bg-white border border-gray-200 text-gray-800 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-xl flex items-center gap-2 max-w-xs">
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
            <span className="text-xl font-black text-gray-800">overview</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD &amp; logistics operations controls.</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] cursor-pointer" title="ELD Info">
          <Link className="w-4 h-4" />
        </div>
      </div>

      {/* Current Job Card */}
      <div className="bg-white border border-amber-100 rounded-3xl p-6 shadow-sm text-left space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-[9px] font-bold text-gray-400 block uppercase">CURRENT JOB: <span className="text-gray-700">LD-9411</span></span>
          <span className="bg-white text-[#D97706] text-[8px] font-black px-3 py-1 rounded-full tracking-wide uppercase border border-amber-300">
            IN TRANSIT
          </span>
        </div>

        <div>
          <h3 className="text-base font-black text-gray-900">Automotive Components (Flatbed)</h3>
          <div className="text-xs font-semibold text-gray-500 flex items-center gap-1 mt-1">
            <span>📍 Route: Chicago IL</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            <span>Dallas TX</span>
          </div>
        </div>

        {/* Inner stops & action details box */}
        <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-bold text-gray-400 block uppercase mb-1">NEXT DESTINATION</span>
            <span className="text-[10px] text-gray-900 font-bold block truncate">Dallas Depot, 400 Freight Rd, Dall...</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 block uppercase mb-1">NEXT REQUIRED ACTION</span>
            <span className="text-[10px] text-[#D97706] font-black block">{nextRequiredAction()}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-gray-500 font-semibold pt-1">
          <span>Next Job: <strong className="text-gray-800">LD-1102 (Grocery Pallets)</strong></span>
          <span className="text-[#D97706] font-bold">ETA:&nbsp;&nbsp;3 hours</span>
        </div>
      </div>

      {/* Guided Stepper Workflow Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm text-left space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-gray-900 tracking-wider uppercase">GUIDED STEPPER WORKFLOW</span>
          <span className="text-[10px] font-black text-[#D97706] tracking-wider">{stepLabel()}</span>
        </div>

        {/* STEP 1: Clock In */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed">Clock into shift to start operations logging.</p>
            <button
              onClick={() => {
                setStep(2);
                triggerToast('Clock-in shift started. Duty logs active.');
              }}
              className="w-full bg-[#10B981] hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl text-sm cursor-pointer transition-colors text-center"
            >
              Start Work
            </button>
          </div>
        )}

        {/* STEP 2: Truck & Trailer Confirmation */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Truck row */}
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-2xl bg-gray-50">
              <div>
                <span className="text-[9px] font-bold text-gray-400 block uppercase mb-1">TRUCK ASSIGNED</span>
                <span className="text-sm font-black text-gray-900">TX-ROAD88</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setTruckConfirmed(true); triggerToast('Truck TX-ROAD88 confirmed.'); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-black cursor-pointer transition-all ${
                    truckConfirmed
                      ? 'bg-emerald-500 text-white border-2 border-emerald-600'
                      : 'bg-[#FFD400] text-black border-2 border-[#FFD400]'
                  }`}
                >
                  Confirm Truck
                </button>
                <button
                  onClick={() => triggerToast('Truck change requested.')}
                  className="px-3 py-1.5 border-2 border-[#FFD400] text-[#D97706] rounded-full text-xs font-bold cursor-pointer hover:bg-amber-50 transition-colors"
                >
                  Change Truck
                </button>
              </div>
            </div>

            {/* Trailer row */}
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-2xl bg-gray-50">
              <div>
                <span className="text-[9px] font-bold text-gray-400 block uppercase mb-1">TRAILER ASSIGNED</span>
                <span className="text-sm font-black text-gray-900">TR-4022</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setTrailerConfirmed(true); triggerToast('Trailer TR-4022 confirmed.'); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-black cursor-pointer transition-all ${
                    trailerConfirmed
                      ? 'bg-emerald-500 text-white border-2 border-emerald-600'
                      : 'bg-[#FFD400] text-black border-2 border-[#FFD400]'
                  }`}
                >
                  Confirm Trailer
                </button>
                <button
                  onClick={() => triggerToast('Trailer change requested.')}
                  className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-full text-xs font-bold cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  Change Trailer
                </button>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full bg-[#FFD400] hover:bg-yellow-400 text-black font-bold py-3.5 rounded-2xl text-sm cursor-pointer transition-colors text-center"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 3: Odometer */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed">Upload odometer proof photo. AI model will auto-read values.</p>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">ODOMETER MILEAGE VALUE</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={odometerValue}
                  onChange={e => setOdometerValue(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => triggerToast('Odometer photo uploaded. AI read: 124,500 miles.')}
                  className="px-4 py-2 border border-amber-200 hover:bg-amber-50 text-[#D97706] rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer bg-white"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Photo
                </button>
              </div>
            </div>
            <button
              onClick={() => setStep(4)}
              className="w-full bg-[#FFD400] hover:bg-yellow-400 text-black font-bold py-3.5 rounded-2xl text-sm cursor-pointer transition-colors text-center"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 4: Compliance */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed">Select safety checkpoints pre-trip checklist.</p>
            <div className="space-y-2">
              {[
                { label: 'Brake Inspection', state: brakeInspection, setState: setBrakeInspection },
                { label: 'Tire Pressure', state: tirePressure, setState: setTirePressure },
                { label: 'Load Straps Secured', state: loadStraps, setState: setLoadStraps },
                { label: 'Hazard Kit Verified', state: hazardKit, setState: setHazardKit },
              ].map(({ label, state, setState }) => (
                <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-50">
                  <span className="text-xs text-gray-800">{label}</span>
                  <input
                    type="checkbox"
                    checked={state}
                    onChange={e => setState(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (!loadStraps) { triggerToast('Please secure all load straps before submitting.'); return; }
                triggerToast('All compliance checkpoints verified and submitted to dispatcher.');
              }}
              className="w-full bg-[#FFD400] hover:bg-yellow-400 text-black font-bold py-3.5 rounded-2xl text-sm cursor-pointer transition-colors text-center"
            >
              Submit Compliance
            </button>
          </div>
        )}
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => triggerToast('Showing available manifest jobs...')}
          className="p-5 bg-white border border-gray-150 rounded-2xl flex items-center justify-center font-bold text-sm text-[#1E3A8A] hover:bg-gray-50 cursor-pointer shadow-sm"
        >
          Jobs
        </button>
        <button
          onClick={() => { setStep(3); triggerToast('Odometer Stepper flow activated.'); }}
          className="p-5 bg-white border border-amber-200 rounded-2xl flex flex-col items-center justify-center font-bold text-xs text-[#B45309] cursor-pointer shadow-sm text-center leading-tight hover:bg-amber-50"
        >
          <span>Upload</span>
          <span className="mt-0.5">Odometer</span>
          <span className="mt-0.5">Photo</span>
        </button>
        <button
          onClick={() => { setStep(4); triggerToast('Compliance Stepper flow activated.'); }}
          className="p-5 bg-white border border-amber-200 rounded-2xl flex flex-col items-center justify-center font-bold text-xs text-[#B45309] cursor-pointer shadow-sm text-center leading-tight hover:bg-amber-50"
        >
          <span>Submit</span>
          <span className="mt-0.5">Compliance</span>
        </button>
        <button
          onClick={() => triggerToast('Opening Expense Logger panel...')}
          className="p-5 bg-white border border-gray-150 rounded-2xl flex items-center justify-center font-bold text-sm text-[#1E3A8A] hover:bg-gray-50 cursor-pointer shadow-sm"
        >
          Add Expense
        </button>
        <button
          onClick={() => triggerToast('NFC Tap-to-Pay reader active...')}
          className="p-5 bg-white border border-amber-200 rounded-2xl flex flex-col items-center justify-center font-bold text-xs text-[#B45309] cursor-pointer shadow-sm text-center leading-tight hover:bg-amber-50"
        >
          <span>Take Tap</span>
          <span className="mt-0.5">Payment</span>
        </button>
        <button
          onClick={() => triggerToast('Opening dispatcher chat console...')}
          className="p-5 bg-white border border-amber-200 rounded-2xl flex items-center justify-center font-bold text-xs text-[#B45309] cursor-pointer shadow-sm text-center hover:bg-amber-50"
        >
          Open Job Chat
        </button>
      </div>

      {/* Floating buttons */}
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
