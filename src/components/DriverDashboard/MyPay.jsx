import React, { useState } from 'react';
import { Compass, Shield, Truck, AlertTriangle, Heart, X, Phone, MessageSquare, Mic, Wifi, WifiOff, Settings, CheckSquare } from 'lucide-react';

export default function MyPay() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(true); // Open by default based on screenshot
  const [toastMsg, setToastMsg] = useState('');
  
  // Connection states matching screenshot
  const [isOffline, setIsOffline] = useState(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  // Column Visibility toggle states
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    payPeriod: true,
    loggedHours: true,
    payout: true,
    status: true
  });

  // Spacing layout state
  const [spacing, setSpacing] = useState('compact'); // 'compact', 'default', 'relaxed'

  // SOS states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  // Settlement history rows
  const [settlementRows, setSettlementRows] = useState([
    { id: 1, period: 'Jun 01 - Jun 15, 2026', hours: '82 hrs', payout: '$1,690.00', status: 'PAID' },
    { id: 2, period: 'May 16 - May 31, 2026', hours: '78 hrs', payout: '$1,510.00', status: 'PAID' }
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

  const handleToggleConnection = () => {
    if (isOffline) {
      setIsOffline(false);
      if (offlineQueueCount > 0) {
        triggerToast(`Synced ${offlineQueueCount} queued items online.`);
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
            <span className="text-xl font-black text-gray-800">earnings</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD & logistics operations controls.</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] cursor-pointer" title="Driver Controls">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Earnings Grid (4 KPI Cards in 2x2 format) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily Payout */}
        <div className="bg-white p-5 rounded-3xl border border-gray-150 shadow-3xs text-left space-y-3">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">DAILY PAYOUT</span>
          <h3 className="text-2xl font-black text-gray-900">$245.00</h3>
          <div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#FFD400] w-[100%]"></div>
            </div>
            <div className="flex justify-between items-center text-[8px] font-bold text-gray-400 mt-1">
              <span>Progress</span>
              <span>100%</span>
            </div>
          </div>
          <span className="text-[10px] text-gray-505 font-semibold block pt-1">Completed runs today</span>
        </div>

        {/* Weekly Payout */}
        <div className="bg-white p-5 rounded-3xl border border-gray-150 shadow-3xs text-left space-y-3">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">WEEKLY PAYOUT</span>
          <h3 className="text-2xl font-black text-gray-900">$1,250.00</h3>
          <div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#FFD400] w-[68%]"></div>
            </div>
            <div className="flex justify-between items-center text-[8px] font-bold text-gray-400 mt-1">
              <span>Progress</span>
              <span>68%</span>
            </div>
          </div>
          <span className="text-[10px] text-gray-505 font-semibold block pt-1">Weekly accumulated pay</span>
        </div>

        {/* Monthly Payout */}
        <div className="bg-white p-5 rounded-3xl border border-gray-150 shadow-3xs text-left space-y-3">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">MONTHLY PAYOUT</span>
          <h3 className="text-2xl font-black text-gray-900">$4,820.00</h3>
          <div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#FFD400] w-[92%]"></div>
            </div>
            <div className="flex justify-between items-center text-[8px] font-bold text-gray-400 mt-1">
              <span>Progress</span>
              <span>92%</span>
            </div>
          </div>
          <span className="text-[10px] text-gray-505 font-semibold block pt-1">Monthly baseline earnings</span>
        </div>

        {/* Awaiting Payroll */}
        <div className="bg-white p-5 rounded-3xl border border-gray-150 shadow-3xs text-left space-y-3">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">AWAITING PAYROLL</span>
          <h3 className="text-2xl font-black text-gray-900">$1,420.00</h3>
          <div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#FFD400] w-[100%]"></div>
            </div>
            <div className="flex justify-between items-center text-[8px] font-bold text-gray-400 mt-1">
              <span>Progress</span>
              <span>100%</span>
            </div>
          </div>
          <span className="text-[10px] text-gray-505 font-semibold block pt-1">Awaiting billing run</span>
        </div>
      </div>

      {/* Bonus Summary Overview */}
      <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-3xs text-left space-y-4">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">BONUS SUMMARY OVERVIEW</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border border-emerald-100 bg-emerald-50/10 rounded-2xl flex justify-between items-center">
            <span className="text-xs font-bold text-gray-800">Safety Performance Bonus</span>
            <span className="text-sm font-black text-emerald-655">+$150.00</span>
          </div>
          <div className="p-4 border border-emerald-100 bg-emerald-50/10 rounded-2xl flex justify-between items-center">
            <span className="text-xs font-bold text-gray-800">On-Time Dispatch Bonus</span>
            <span className="text-sm font-black text-emerald-655">+$200.00</span>
          </div>
        </div>
      </div>

      {/* Settlement History & Payments Log Table Panel */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-3xs text-left space-y-5 relative">
        
        <div className="flex justify-between items-center pb-2 border-b border-gray-55 flex-wrap gap-3">
          <span className="text-[10px] font-black text-gray-900 tracking-wider block uppercase">Settlement History & Payments Log</span>
          
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

            {/* Columns configure button */}
            <button 
              onClick={() => setColumnsDropdownOpen(!columnsDropdownOpen)}
              className="px-3.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-black cursor-pointer shadow-3xs bg-white shrink-0 flex items-center gap-1.5 text-[9px] font-black"
            >
              <Settings className="w-3.5 h-3.5" /> COLUMNS
            </button>
          </div>
        </div>

        {/* COLUMN VISIBILITY DROPDOWN CARD (IMAGE 2) */}
        {columnsDropdownOpen && (
          <div className="absolute right-6 top-16 bg-white border border-gray-150 rounded-2xl p-4 shadow-xl z-50 w-52 text-left space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pb-1 border-b border-gray-50">COLUMN VISIBILITY</span>
            <div className="space-y-3">
              <label className="flex items-center gap-2.5 text-xs font-bold text-gray-800 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={visibleColumns.payPeriod}
                  onChange={() => handleToggleColumn('payPeriod')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>Pay Period</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-gray-800 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={visibleColumns.loggedHours}
                  onChange={() => handleToggleColumn('loggedHours')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>Logged Hours</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-bold text-gray-800 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={visibleColumns.payout}
                  onChange={() => handleToggleColumn('payout')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>Payout</span>
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
            
            <button 
              onClick={() => setColumnsDropdownOpen(false)}
              className="w-full bg-[#FFD400] text-black font-bold text-[9px] py-1.5 rounded-lg text-center uppercase tracking-wider cursor-pointer"
            >
              Apply Columns
            </button>
          </div>
        )}

        {/* Dynamic Spacing Table layout */}
        <div className="space-y-3">
          <div className="grid grid-cols-12 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4">
            <span className="col-span-1"></span>
            {visibleColumns.payPeriod && <span className="col-span-4 text-left">PAY PERIOD</span>}
            {visibleColumns.loggedHours && <span className="col-span-3 text-left">LOGGED HOURS</span>}
            {visibleColumns.payout && <span className="col-span-2 text-left">PAYOUT</span>}
            {visibleColumns.status && <span className="col-span-2 text-right">STATUS</span>}
          </div>

          <div className="divide-y divide-gray-55 border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-3xs">
            {settlementRows.map((row) => (
              <div 
                key={row.id} 
                className={`grid grid-cols-12 items-center px-4 hover:bg-gray-50/50 transition-colors ${
                  spacing === 'compact' ? 'py-2' :
                  spacing === 'relaxed' ? 'py-4.5' :
                  'py-3'
                }`}
              >
                <div className="col-span-1 flex items-center justify-start">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer" />
                </div>
                {visibleColumns.payPeriod && <span className="col-span-4 text-xs font-bold text-gray-900 text-left">{row.period}</span>}
                {visibleColumns.loggedHours && <span className="col-span-3 text-xs font-bold text-gray-755 text-left">{row.hours}</span>}
                {visibleColumns.payout && <span className="col-span-2 text-xs font-bold text-[#D97706] text-left">{row.payout}</span>}
                {visibleColumns.status && (
                  <div className="col-span-2 text-right">
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {row.status}
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
          className="w-12 h-12 bg-white border border-red-200 hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold text-xs shadow-lg cursor-pointer transition-all border-t-2"
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
