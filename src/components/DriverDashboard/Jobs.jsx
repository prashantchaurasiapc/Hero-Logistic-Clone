import React, { useState } from 'react';
import { Shield, Truck, AlertTriangle, Heart, X, Phone, MessageSquare, Mic, Link, Check, Wifi, ArrowRight, Upload, DollarSign, CreditCard, ClipboardCheck } from 'lucide-react';

export default function Jobs() {
  const [activeStep, setActiveStep] = useState('odometer'); // 'odometer' or 'compliance'
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // Odometer states (Step 3 of 17)
  const [odometerValue, setOdometerValue] = useState('124,500');

  // Compliance checklist states (Step 4 of 17)
  const [brakeInspection, setBrakeInspection] = useState(true);
  const [tirePressure, setTirePressure] = useState(true);
  const [loadStraps, setLoadStraps] = useState(false);
  const [hazardKit, setHazardKit] = useState(true);

  // SOS modal checkboxes
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleUploadPhoto = () => {
    triggerToast('Odometer photo uploaded successfully. AI processed reading: 124,500 miles.');
  };

  const handleSubmitCompliance = () => {
    if (!loadStraps) {
      triggerToast('Please secure all load straps before submitting compliance check.');
      return;
    }
    triggerToast('All compliance checkpoints verified and submitted to dispatcher.');
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
            <span className="text-xl font-black text-gray-800">overview</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD & logistics operations controls.</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] cursor-pointer" title="ELD Info">
          <Link className="w-4 h-4" />
        </div>
      </div>

      {/* Current Job Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-3xs text-left space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] font-bold text-gray-400 block uppercase">CURRENT JOB: LD-9411</span>
            <h3 className="text-sm font-bold text-gray-900 mt-1">Automotive Components (Flatbed)</h3>
          </div>
          <span className="bg-white text-[#D97706] text-[8px] font-black px-2.5 py-0.5 rounded tracking-wide uppercase border border-amber-250">
            ACCEPTED
          </span>
        </div>

        <div className="text-xs font-bold text-[#D97706] flex items-center gap-1">
          <span>📍 Route: Chicago IL</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          <span>Dallas TX</span>
        </div>

        {/* Inner stops & action details box */}
        <div className="p-4 bg-gray-55/50 border border-gray-150 rounded-2xl grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-bold text-gray-400 block uppercase">NEXT DESTINATION</span>
            <span className="text-[10px] text-gray-900 font-bold mt-1 block truncate">Dallas Depot, 400 Freight Rd, Dall...</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 block uppercase">NEXT REQUIRED ACTION</span>
            <span className="text-[10px] text-[#D97706] font-black mt-1 block uppercase">
              {activeStep === 'odometer' ? 'Upload Odometer' : 'Complete Compliance'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[9px] text-gray-505 font-bold pt-1">
          <span>Next Job: LD-1102 (Grocery Pallets)</span>
          <span className="uppercase">ETA: {activeStep === 'odometer' ? '8 hours' : '3 hours'}</span>
        </div>
      </div>

      {/* Guided Stepper Workflow Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-3xs text-left space-y-4">
        
        {/* Card Header info */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-50">
          <span className="text-[10px] font-black text-gray-900 tracking-wider block uppercase">GUIDED STEPPER WORKFLOW</span>
          <span className="text-[10px] font-black text-[#D97706] tracking-wider block">
            {activeStep === 'odometer' ? 'Step 3 of 17' : 'Step 4 of 17'}
          </span>
        </div>

        {/* STEP 3 VIEW: ODOMETER */}
        {activeStep === 'odometer' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-550 font-semibold leading-relaxed">
              Upload odometer proof photo. AI model will auto-read values.
            </p>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">ODOMETER MILEAGE VALUE</label>
              <div className="flex gap-3">
                <input 
                  type="text"
                  value={odometerValue}
                  onChange={e => setOdometerValue(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none"
                />
                <button 
                  type="button"
                  onClick={handleUploadPhoto}
                  className="px-4 py-2 border border-amber-255 hover:bg-amber-50 text-[#D97706] rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer bg-white"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Odometer Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 VIEW: COMPLIANCE CHECKLIST */}
        {activeStep === 'compliance' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-550 font-semibold leading-relaxed">
              Select safety checkpoints pre-trip checklist.
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-800">Brake Inspection</span>
                <input 
                  type="checkbox"
                  checked={brakeInspection}
                  onChange={e => setBrakeInspection(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-800">Tire Pressure</span>
                <input 
                  type="checkbox"
                  checked={tirePressure}
                  onChange={e => setTirePressure(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-800">Load Straps Secured</span>
                <input 
                  type="checkbox"
                  checked={loadStraps}
                  onChange={e => setLoadStraps(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-800">Hazard Kit Verified</span>
                <input 
                  type="checkbox"
                  checked={hazardKit}
                  onChange={e => setHazardKit(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => triggerToast('Compliance pre-trip verification completed.')}
                className="flex-1 py-3 border border-amber-255 text-[#D97706] hover:bg-amber-50 rounded-xl text-xs font-bold cursor-pointer transition-colors bg-white text-center uppercase"
              >
                Complete Compliance
              </button>
              <button 
                type="button"
                onClick={handleSubmitCompliance}
                className="flex-1 bg-[#FFD400] hover:bg-yellow-400 text-black font-bold py-3 rounded-xl text-xs cursor-pointer transition-colors text-center uppercase"
              >
                Submit Compliance
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Action Shortcuts */}
      <div className="grid grid-cols-3 gap-4">
        <button 
          onClick={() => triggerToast('Showing available manifest jobs...')}
          className="p-4 bg-white border border-gray-150 rounded-2xl flex items-center justify-center font-bold text-xs text-gray-700 hover:text-black cursor-pointer shadow-3xs"
        >
          Jobs
        </button>

        <button 
          onClick={() => {
            setActiveStep('odometer');
            triggerToast('Odometer Stepper flow activated.');
          }}
          className={`p-4 bg-white rounded-2xl flex flex-col items-center justify-center font-bold text-[10px] text-[#D97706] cursor-pointer shadow-3xs text-center border-2 ${
            activeStep === 'odometer' ? 'border-[#FFD400]' : 'border-gray-150'
          }`}
        >
          <span>Upload</span>
          <span className="mt-0.5">Odometer Photo</span>
        </button>

        <button 
          onClick={() => {
            setActiveStep('compliance');
            triggerToast('Compliance Stepper flow activated.');
          }}
          className={`p-4 bg-white rounded-2xl flex flex-col items-center justify-center font-bold text-[10px] text-[#D97706] cursor-pointer shadow-3xs text-center border-2 ${
            activeStep === 'compliance' ? 'border-[#FFD400]' : 'border-gray-150'
          }`}
        >
          <span>Submit</span>
          <span className="mt-0.5">Compliance</span>
        </button>

        <button 
          onClick={() => triggerToast('Opening Expense Logger panel...')}
          className="p-4 bg-white border border-gray-150 rounded-2xl flex items-center justify-center font-bold text-xs text-gray-700 hover:text-black cursor-pointer shadow-3xs"
        >
          Add Expense
        </button>

        <button 
          onClick={() => triggerToast('NFC Tap-to-Pay reader active...')}
          className="p-4 bg-white border border-gray-150 rounded-2xl flex flex-col items-center justify-center font-bold text-[10px] text-[#D97706] cursor-pointer shadow-3xs text-center"
        >
          <span>Take Tap</span>
          <span className="mt-0.5">Payment</span>
        </button>

        <button 
          onClick={() => triggerToast('Opening dispatcher chat console...')}
          className="p-4 bg-white border border-gray-150 rounded-2xl flex items-center justify-center font-bold text-xs text-[#D97706] hover:text-[#B45309] cursor-pointer shadow-3xs"
        >
          Open Job Chat
        </button>
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
                className="p-5 bg-[#FFFBEB] border border-[#FEF3C7] rounded-2xl hover:bg-[#FEF3C7] transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-[#D97706]"
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
                  <span className="text-gray-450">🎙️</span>
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
