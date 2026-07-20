import React, { useState } from 'react';
import { 
  Box, ArrowUpRight, Info, Lightbulb, Scan, Clock, AlertTriangle, Truck, ChevronRight, X 
} from 'lucide-react';

export default function TerminalWorkspace() {
  const [scanValue, setScanValue] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showManifestModal, setShowManifestModal] = useState(false);
  
  // Recent sorting entries state matching mockup exactly
  const [recentEntries, setRecentEntries] = useState([
    { id: 'SHP-9041', time: 'Just now', badge: 'REDIRECTED TO LOCAL DELIVERY VAN' },
    { id: 'SHP-9042', time: '5 mins ago', badge: 'REDIRECTED TO LINE-HAUL TRUCK BNE' }
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleScanSubmit = (e) => {
    e.preventDefault();
    if (!scanValue.trim()) return;

    const trimmedVal = scanValue.trim().toUpperCase();
    let redirection = 'REDIRECTED TO LOCAL DELIVERY VAN';

    if (trimmedVal === 'SHP-9042' || trimmedVal.endsWith('42')) {
      redirection = 'REDIRECTED TO LINE-HAUL TRUCK BNE';
    } else if (trimmedVal.endsWith('44')) {
      redirection = 'REDIRECTED TO LINE-HAUL TRUCK SYD';
    }

    const newEntry = {
      id: trimmedVal,
      time: 'Just now',
      badge: redirection
    };

    setRecentEntries([newEntry, ...recentEntries]);
    triggerToast(`Scanned ${trimmedVal} successfully!`);
    setScanValue('');
  };

  const handleQuickScan = (val) => {
    setScanValue(val);
    triggerToast(`Copied ${val} to scan input!`);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] px-8 py-8 space-y-6 text-left font-sans antialiased text-slate-800">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 text-left">
        <div className="flex items-center gap-3">
          {/* Cube/Crate Icon */}
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shadow-3xs shrink-0">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
              Dispatcher Portal <span className="text-slate-400 text-xl mx-1">•</span> Terminal Workspace
            </h1>
            <p className="text-[13px] text-slate-500 mt-1 font-medium">
              Sydney Depot Node 01 • Active Inbound
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center gap-2 text-xs font-black tracking-wide select-none self-start md:self-auto shadow-3xs">
          <span>EFFICIENCY</span>
          <span>98.4%</span>
          <ArrowUpRight className="w-4 h-4 stroke-[3px]" />
        </div>
      </div>

      {/* BLUE ALERT BAR */}
      <div className="p-5 bg-blue-50/50 border border-blue-100/50 rounded-[20px] flex items-start gap-4">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-2 text-left">
          <h4 className="text-[10px] font-black text-indigo-650 uppercase tracking-wider leading-none">
            WHAT IS THIS WORKSPACE?
          </h4>
          <p className="text-xs text-indigo-755 leading-relaxed font-semibold">
            This module is used by Warehouse Staff when large line-haul trucks arrive at a Terminal. Workers scan every incoming box. The "Smart Sorter" instantly checks the Full Network Manifest (the master list of all cross-country jobs) to decide if the box should go out on a <span className="font-extrabold text-indigo-900">Local Delivery Van</span> or be loaded onto another <span className="font-extrabold text-indigo-900">Line-haul Truck for the next Depot</span>.
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-indigo-600 font-bold select-none pt-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10 shrink-0" />
            <span className="whitespace-nowrap">Try scanning: </span>
            <button 
              onClick={() => handleQuickScan('SHP-9041')}
              className="underline hover:text-indigo-800 cursor-pointer whitespace-nowrap"
            >
              SHP-9041
            </button>
            <span className="whitespace-nowrap">or</span>
            <button 
              onClick={() => handleQuickScan('SHP-9042')}
              className="underline hover:text-indigo-800 cursor-pointer whitespace-nowrap"
            >
              SHP-9042
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column Stack (Inputs & Recent Entries) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scan & Redirection Input */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] text-left space-y-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              SCAN & REDIRECTION INPUT
            </span>

            <form onSubmit={handleScanSubmit} className="relative w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center shrink-0">
                <Scan className="w-5 h-5 text-indigo-650" />
              </div>
              <input
                type="text"
                placeholder="ENTER / SCAN LOAD ID..."
                value={scanValue}
                onChange={(e) => setScanValue(e.target.value)}
                className="w-full pl-12 pr-4 py-4.5 bg-slate-50/40 border border-slate-200/90 rounded-xl text-xs font-black text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white transition-all tracking-wide"
              />
            </form>

            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>AUTO-DISPATCH ON SCAN ACTIVE</span>
              </div>
              <span className="tracking-wide">BATCH SCAN MODE</span>
            </div>
          </div>

          {/* Recent Sorting Entries */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] text-left space-y-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              RECENT SORTING ENTRIES
            </span>

            <div className="space-y-3">
              {recentEntries.map((entry, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-slate-50/30 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Clock className="w-4.5 h-4.5 text-slate-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">{entry.id}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1 leading-none">{entry.time}</span>
                    </div>
                  </div>

                  <span className="bg-blue-50/50 text-blue-600 border border-blue-100/50 rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-wider leading-none">
                    {entry.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Stack (Queue & Protocols) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Line-Haul Queue */}
          <div className="bg-[#0B0F17] rounded-[24px] p-6 text-white text-left flex flex-col justify-between shadow-md space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-amber-500 tracking-wider block uppercase">
                ACTIVE QUEUE
              </span>
              <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase bg-white/5 text-amber-500 border border-white/10 leading-none">
                LINEHAUL QUEUE
              </span>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div 
                onClick={() => handleQuickScan('SHP-9042')}
                className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center hover:bg-white/10 cursor-pointer transition-all select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-sm">
                    🚚
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">SHP-9042</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block mt-1 leading-none">
                      SYDNEY DEPOT
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Item 2 */}
              <div 
                onClick={() => handleQuickScan('SHP-9044')}
                className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center hover:bg-white/10 cursor-pointer transition-all select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-sm">
                    🚚
                  </div>
                  <div>
                    <span className="text-xs font-bold block leading-tight">SHP-9044</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block mt-1 leading-none">
                      SYDNEY DEPOT
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-455" />
              </div>
            </div>

            <button 
              onClick={() => setShowManifestModal(true)}
              className="w-full text-center border border-white/20 hover:bg-white/5 text-white font-extrabold text-[10px] py-3 rounded-xl transition-all cursor-pointer tracking-wider uppercase block"
            >
              VIEW FULL MANIFEST
            </button>
          </div>

          {/* Sorting Protocol (Yellow border warning) */}
          <div className="bg-white rounded-[24px] border border-[#FFD400] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] text-left flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-[10px] font-black text-amber-600 tracking-wider block uppercase">
                SORTING PROTOCOL
              </span>
            </div>
            
            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold mt-2.5">
              Ensure every scan is cross-referenced with the digital manifest (the master list of active network Loads). Unrecognized items must be quarantined immediately to Section X.
            </p>
          </div>
        </div>

      </div>

      {/* ====================================================
          FULL NETWORK MANIFEST MODAL (2nd Screenshot Match)
          ==================================================== */}
      {showManifestModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl p-6 shadow-2xl border border-slate-100 text-left relative transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-none">Full Network Manifest</h3>
                <p className="text-xs text-slate-400 font-bold mt-2">Master list of active network loads & sortation statuses</p>
              </div>
              <button 
                onClick={() => setShowManifestModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
              >
                <X size={18} className="stroke-[2.5px]" />
              </button>
            </div>

            {/* Modal Table Content */}
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4 font-black">REFERENCE</th>
                    <th className="py-3 px-4 font-black">ROUTING</th>
                    <th className="py-3 px-4 font-black">WEIGHT</th>
                    <th className="py-3 px-4 font-black">DRIVER</th>
                    <th className="py-3 px-4 font-black">VEHICLE</th>
                    <th className="py-3 px-4 font-black">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-slate-800 block">LD-9411</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Automotive Components (Flatbed)</span>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-800">Chicago IL → Dallas TX</td>
                    <td className="py-4 px-4 text-slate-500">42,000 lbs</td>
                    <td className="py-4 px-4">John D.</td>
                    <td className="py-4 px-4 font-mono font-bold">TX-ROAD88</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[9px] font-black uppercase">
                        IN TRANSIT
                      </span>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-slate-800 block">LD-1102</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Dry Grocery Pallets</span>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-800">Houston TX → Atlanta GA</td>
                    <td className="py-4 px-4 text-slate-500">1,200 lbs</td>
                    <td className="py-4 px-4">Sarah R.</td>
                    <td className="py-4 px-4 font-mono font-bold">IL-HAUL42</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded text-[9px] font-black uppercase">
                        PLANNED
                      </span>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-slate-800 block">LD-4809</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Industrial Coils</span>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-800">Seattle WA → Portland OR</td>
                    <td className="py-4 px-4 text-slate-500">8,500 lbs</td>
                    <td className="py-4 px-4">Donald S.</td>
                    <td className="py-4 px-4 font-mono font-bold">CA-CARRI7</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[9px] font-black uppercase">
                        DELIVERED
                      </span>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-slate-800 block">LD-7712</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Cotton Reels</span>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-800">New York NY → Boston MA</td>
                    <td className="py-4 px-4 text-slate-500">18,000 lbs</td>
                    <td className="py-4 px-4">Marcus A.</td>
                    <td className="py-4 px-4 font-mono font-bold">NY-VAN023</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-black uppercase">
                        DRAFT
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-5 mt-4 border-t border-slate-100">
              <button
                onClick={() => setShowManifestModal(false)}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-black transition-all cursor-pointer uppercase tracking-wider"
              >
                Close Manifest
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
