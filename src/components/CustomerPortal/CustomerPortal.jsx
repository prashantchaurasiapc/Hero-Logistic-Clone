import React, { useState } from 'react';
import { 
  Search, Bell, FileText, Camera, ShieldAlert, CheckCircle, Navigation, MapPin, Info, Phone, MessageSquare
} from 'lucide-react';

export default function CustomerPortal() {
  const [activeTab, setActiveTab] = useState('Live Tracking'); // 'Acme Distribution', 'Live Tracking', 'My Invoices', 'My Account'
  const [selectedLoadId, setSelectedLoadId] = useState('SHP-9042');
  const [toastMsg, setToastMsg] = useState('');
  const [payingInvoice, setPayingInvoice] = useState(null); // { id, amount } when PAY NOW is clicked

  // Toggles for Notification Preferences
  const [smsToggle, setSmsToggle] = useState(true);
  const [emailToggle, setEmailToggle] = useState(true);
  const [invoiceToggle, setInvoiceToggle] = useState(true);
  const [reminderToggle, setReminderToggle] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-800 text-left font-sans antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* HEADER BAR */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 px-8 py-4 flex items-center justify-between shadow-[0_1px_3px_rgb(0,0,0,0.01)]">
        {/* Left Brand */}
        <div className="flex items-center gap-2 select-none">
          <span className="bg-[#FFA000] text-black font-black text-xs px-2.5 py-1.5 rounded-lg tracking-wider">
            HERO
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            CUSTOMER PORTAL
          </span>
        </div>

        {/* Center Tabs navigation */}
        <nav className="flex items-center gap-2.5">
          {/* Acme Distribution Tab */}
          <button
            onClick={() => setActiveTab('Acme Distribution')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-xl ${
              activeTab === 'Acme Distribution'
                ? 'bg-[#FFA000] text-black shadow-3xs'
                : 'text-slate-500 hover:text-slate-855 hover:bg-slate-50'
            }`}
          >
            🏠 ACME DISTRIBUTION
          </button>

          {/* Live Tracking Tab */}
          <button
            onClick={() => setActiveTab('Live Tracking')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-xl ${
              activeTab === 'Live Tracking'
                ? 'bg-[#FFA000] text-black shadow-3xs'
                : 'text-slate-500 hover:text-slate-855 hover:bg-slate-50'
            }`}
          >
            📍 LIVE TRACKING
          </button>

          {/* My Invoices Tab */}
          <button
            onClick={() => setActiveTab('My Invoices')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-xl ${
              activeTab === 'My Invoices'
                ? 'bg-[#FFA000] text-black shadow-3xs'
                : 'text-slate-500 hover:text-slate-855 hover:bg-slate-50'
            }`}
          >
            📄 MY INVOICES
          </button>

          {/* My Account Tab */}
          <button
            onClick={() => setActiveTab('My Account')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-xl ${
              activeTab === 'My Account'
                ? 'bg-[#FFA000] text-black shadow-3xs'
                : 'text-slate-500 hover:text-slate-855 hover:bg-slate-50'
            }`}
          >
            👤 MY ACCOUNT
          </button>
        </nav>

        {/* Right side widgets */}
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
            <Bell className="w-5 h-5 text-slate-500" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none border border-white">
              12
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 select-none border border-slate-200">
              SM
            </div>
            <button 
              onClick={() => {
                triggerToast('Signing out...');
                setTimeout(() => window.close(), 1000);
              }}
              className="text-[10px] font-black text-slate-450 uppercase hover:text-slate-850 flex items-center gap-1 cursor-pointer"
            >
              [→ SIGN OUT
            </button>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        
        {/* TAB 1: ACME DISTRIBUTION */}
        {activeTab === 'Acme Distribution' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top dark hero banner card */}
            <div className="bg-[#0B0F17] text-white rounded-[24px] p-6 flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-850 shadow-md relative overflow-hidden">
              <div className="flex items-center gap-4.5">
                <div className="w-12 h-12 bg-amber-500 text-black flex items-center justify-center font-bold text-xl rounded-2xl shadow-xs">
                  🏆
                </div>
                <div className="text-left space-y-1">
                  <h3 className="text-sm font-black text-amber-500 tracking-wider uppercase">
                    CERTIFIED PARTNER DASHBOARD
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">
                      Manage 14 team members &bull; Level 4 Tier
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center min-w-[90px]">
                    <span className="block text-[8px] font-extrabold text-slate-450 uppercase">ACTIVE LOADS</span>
                    <span className="block text-xl font-black text-[#FFD400]">03</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center min-w-[90px]">
                    <span className="block text-[8px] font-extrabold text-slate-455 uppercase">MONTHLY VOLUME</span>
                    <span className="block text-xl font-black text-slate-200">412</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('Live Tracking')}
                  className="bg-[#FFA000] hover:bg-[#FF9000] text-black font-black text-[10px] py-3.5 px-5 rounded-xl shadow-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  🚀 LIVE FLEET HUD
                </button>
              </div>
            </div>

            {/* Content Row: Active flow left, balance/concierge right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Active Logistics flow list (8 columns) */}
              <div className="lg:col-span-8 space-y-5 text-left">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Logistics Flow</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                      REAL-TIME STATUS UPDATES FROM FLEET
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('Live Tracking')}
                    className="text-[#FFA000] hover:text-[#FF9000] font-black text-[10px] tracking-wider uppercase flex items-center gap-1 cursor-pointer"
                  >
                    FULL TRACKING VIEW &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: SHP-9042 */}
                  <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-3xs text-left space-y-4 transition-all duration-200 cursor-pointer hover:shadow-[0_12px_40px_rgb(0,0,0,0.10)] hover:border-slate-300 hover:-translate-y-0.5">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black text-slate-900 block leading-tight">SHP-9042</span>
                        <span className="text-[8px] text-slate-400 font-extrabold uppercase">FREIGHT</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100/50">
                        IN TRANSIT
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-700 font-bold">
                        <span>Sydney Terminal</span>
                        <span className="text-slate-400 font-normal">&rarr;</span>
                        <span>Melbourne Depot</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold pt-1.5 border-t border-slate-50">
                        <span>PROGRESS</span>
                        <span className="text-slate-700 font-black">ETA: 5:30 PM</span>
                      </div>
                      {/* Custom progress bar */}
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div className="bg-[#FFA000] h-full rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: SHP-9048 */}
                  <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-3xs text-left space-y-4 transition-all duration-200 cursor-pointer hover:shadow-[0_12px_40px_rgb(0,0,0,0.10)] hover:border-slate-300 hover:-translate-y-0.5">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black text-slate-900 block leading-tight">SHP-9048</span>
                        <span className="text-[8px] text-slate-400 font-extrabold uppercase">LTL</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100/50">
                        AT PICKUP
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-700 font-bold">
                        <span>Melbourne WH-D</span>
                        <span className="text-slate-400 font-normal">&rarr;</span>
                        <span>Adelaide Port</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold pt-1.5 border-t border-slate-50">
                        <span>PROGRESS</span>
                        <span className="text-slate-700 font-black">ETA: 9:00 AM</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div className="bg-[#FFA000] h-full rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: SHP-9031 */}
                  <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-3xs text-left space-y-4 transition-all duration-200 cursor-pointer hover:shadow-[0_12px_40px_rgb(0,0,0,0.10)] hover:border-slate-300 hover:-translate-y-0.5">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black text-slate-900 block leading-tight">SHP-9031</span>
                        <span className="text-[8px] text-slate-400 font-extrabold uppercase">EXPRESS</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-50 text-red-655 border border-red-100/50">
                        DELAYED +45M
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-700 font-bold">
                        <span>Brisbane Depot</span>
                        <span className="text-slate-400 font-normal">&rarr;</span>
                        <span>Sydney Terminal</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold pt-1.5 border-t border-slate-50">
                        <span>PROGRESS</span>
                        <span className="text-slate-700 font-black">ETA: 7:15 PM</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Need another load dashed box */}
                  <div 
                    onClick={() => setActiveTab('My Invoices')}
                    className="border-2 border-dashed border-slate-200 rounded-[24px] p-5 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors select-none min-h-[140px]"
                  >
                    <span className="text-xl font-bold text-slate-400">+</span>
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">NEED ANOTHER LOAD?</span>
                    <span className="text-[9px] text-slate-400 font-semibold block uppercase">INSTANT MANIFEST CREATION</span>
                  </div>
                </div>
              </div>

              {/* Right widgets (4 columns) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Outstanding Balance card */}
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-3xs text-left space-y-4 transition-all duration-200 hover:shadow-[0_12px_40px_rgb(239,68,68,0.10)] hover:border-red-200 hover:-translate-y-0.5">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                    <span className="text-[8px] font-black text-red-500 uppercase tracking-wider flex items-center gap-1">
                      <span>⚠️</span> OUTSTANDING BALANCE
                    </span>
                    <span className="text-xs opacity-10">💰</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 leading-none">$4,887.50</h3>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-2 tracking-wide">Across 3 Unpaid Invoices</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('My Invoices')}
                    className="w-full py-3 bg-[#0B0F17] hover:bg-slate-800 text-white font-extrabold text-[10px] rounded-xl transition-all shadow-3xs uppercase tracking-wider cursor-pointer text-center block"
                  >
                    RESOLVE NOW &rarr;
                  </button>
                </div>

                {/* Concierge Support card */}
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-3xs text-left space-y-4 transition-all duration-200 hover:shadow-[0_12px_40px_rgb(59,130,246,0.10)] hover:border-blue-200 hover:-translate-y-0.5">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">CONCIERGE SUPPORT</span>
                    <span className="text-xs opacity-10">💬</span>
                  </div>
                  <div className="p-3 bg-blue-50/50 border border-blue-100/50 rounded-xl flex items-start gap-2.5">
                    <span className="text-[#3B82F6] font-extrabold text-sm select-none">✓</span>
                    <div className="text-left leading-tight">
                      <span className="block text-[10px] font-black text-slate-800">LIVE ASSISTANCE</span>
                      <span className="block text-[8px] text-slate-450 uppercase font-black tracking-wide mt-0.5">Average Response: 2m</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => triggerToast('Connecting with logistics concierge...')}
                    className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] rounded-xl cursor-pointer transition-colors shadow-3xs uppercase tracking-wider text-center block"
                  >
                    OPEN HELPLINE
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 2: LIVE TRACKING */}
        {activeTab === 'Live Tracking' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header section */}
            <div className="text-left mb-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Live Tracking</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                2 Active Loads
              </p>
            </div>

            {/* Main tracking flow stack */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left loads selection card (4 columns) */}
              <div className="lg:col-span-4 space-y-4 text-left">
                {/* Load Card 1 (SHP-9042) */}
                <div 
                  onClick={() => setSelectedLoadId('SHP-9042')}
                  className={`bg-white rounded-[24px] p-5 text-left space-y-3.5 transition-all duration-200 cursor-pointer select-none ${
                    selectedLoadId === 'SHP-9042' 
                      ? 'border-2 border-[#FFA000] shadow-sm' 
                      : 'border border-slate-100 shadow-3xs hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-950">SHP-9042</span>
                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100/50">
                      ON THE WAY TO MELBOURNE
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
                    <span>📍 Sydney</span>
                    <span className="text-slate-400 font-normal">&rarr;</span>
                    <span>Melbourne</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold border-t border-slate-50 pt-2">
                    <span>PROGRESS BAR</span>
                    <span className="text-slate-700 font-black">ETA Tomorrow, 1:30 PM</span>
                  </div>
                </div>

                {/* Load Card 2 (SHP-9048) */}
                <div 
                  onClick={() => setSelectedLoadId('SHP-9048')}
                  className={`bg-white rounded-[24px] p-5 text-left space-y-3.5 transition-all duration-200 cursor-pointer select-none ${
                    selectedLoadId === 'SHP-9048' 
                      ? 'border-2 border-[#FFA000] shadow-sm' 
                      : 'border border-slate-100 shadow-3xs hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-950">SHP-9048</span>
                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100/50">
                      OUT FOR DELIVERY
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
                    <span>📍 Melbourne Depot</span>
                    <span className="text-slate-400 font-normal">&rarr;</span>
                    <span>32 CBD</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold border-t border-slate-50 pt-2">
                    <span>PROGRESS BAR</span>
                    <span className="text-slate-700 font-black">ETA Today, 2:30 PM</span>
                  </div>
                </div>
              </div>

              {/* Right details tracking map and statuses (8 columns) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Map Vector integration */}
                <div className="bg-[#0B0F17] rounded-[24px] h-48 border border-slate-850 p-6 flex flex-col justify-between relative overflow-hidden text-white shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-slate-450 tracking-wider uppercase">
                      🗺️ REAL-TIME GEOLOCATION
                    </span>
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-emerald-400 font-black text-[8px] rounded uppercase tracking-wider flex items-center gap-1 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      GPS ACTIVE
                    </span>
                  </div>

                  {/* Horizontal visual map timeline */}
                  <div className="flex items-center justify-between max-w-lg mx-auto w-full relative py-6">
                    {/* Dashed line */}
                    <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 border-t border-dashed border-slate-700"></div>

                    {/* Step 1 dot */}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <div className="w-7 h-7 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center font-bold text-xs select-none">
                        ✓
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase mt-0.5">SYDNEY</span>
                    </div>

                    {/* Active truck node */}
                    <div className="relative z-10 flex flex-col items-center gap-1 animate-pulse">
                      <div className="w-10 h-10 bg-[#FFA000] text-black rounded-full border-4 border-slate-900 flex items-center justify-center font-bold text-lg select-none shadow-xs">
                        🚚
                      </div>
                      <span className="text-[9px] font-black text-white uppercase mt-0.5">ALBURY</span>
                    </div>

                    {/* Step 3 dot */}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <div className="w-7 h-7 bg-slate-800 rounded-full border-4 border-slate-900 flex items-center justify-center font-bold text-xs select-none text-slate-500">
                        3
                      </div>
                      <span className="text-[9px] font-black text-slate-450 uppercase mt-0.5">MELBOURNE</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider pt-2 border-t border-slate-850/60">
                    <span>GPS LINK: ACTIVE OVERWAY</span>
                    <span>Updated 30s ago</span>
                  </div>
                </div>

                {/* Tracking Progress Details box */}
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-3xs text-left space-y-6">
                  
                  {/* Card header */}
                  <div className="flex justify-between items-start pb-4 border-b border-slate-100 flex-wrap gap-4">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                        {selectedLoadId === 'SHP-9042' ? 'SHP-20481' : 'SHP-9048'}
                      </h2>
                      <div className="flex items-center gap-2 mt-2 font-bold text-xs text-slate-800">
                        <span>SYDNEY</span>
                        <span className="text-slate-400 font-normal">&rarr;</span>
                        <span>MELBOURNE</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100/50">
                        ON THE WAY TO MELBOURNE
                      </span>
                      <span className="text-[9px] text-[#FFA050] font-black uppercase mt-1">
                        ACTIVE NOW / Albury (NSW/VIC Border)
                      </span>
                    </div>
                  </div>

                  {/* Vertically stacked progress list */}
                  <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-[9px] before:top-2 before:bottom-6 before:w-0.5 before:border-l before:border-dashed before:border-slate-200">
                    {/* Step 1 */}
                    <div className="relative text-left">
                      <span className="absolute -left-[22px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center text-[9px] font-black shadow-xs z-10 select-none">
                        ✓
                      </span>
                      <div className="flex justify-between items-start gap-2 pl-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-slate-800 block">SYDNEY CBD</span>
                          <span className="text-[9px] font-bold text-slate-450 block">Collected from Customer</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-black text-[7px] border border-emerald-100 rounded uppercase tracking-wider">
                          SCANNING
                        </span>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative text-left">
                      <span className="absolute -left-[22px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center text-[9px] font-black shadow-xs z-10 select-none">
                        ✓
                      </span>
                      <div className="flex justify-between items-start gap-2 pl-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-slate-800 block">SYDNEY DEPOT</span>
                          <span className="text-[9px] font-bold text-slate-450 block">Processing at Depot</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-black text-[7px] border border-emerald-100 rounded uppercase tracking-wider">
                          SCANNING
                        </span>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative text-left">
                      <span className="absolute -left-[22px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center text-[9px] font-black shadow-xs z-10 select-none">
                        ✓
                      </span>
                      <div className="flex justify-between items-start gap-2 pl-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-slate-800 block">GOULBURN DEPOT</span>
                          <span className="text-[9px] font-bold text-slate-450 block">Departed Central Depot</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-black text-[7px] border border-emerald-100 rounded uppercase tracking-wider">
                          SCANNING
                        </span>
                      </div>
                    </div>

                    {/* Step 4 (Active Orange card style) */}
                    <div className="relative text-left -mx-3 p-3.5 bg-amber-50/20 border border-amber-100/50 rounded-2xl">
                      <span className="absolute -left-[10px] top-4 w-4 h-4 rounded-full bg-white border-4 border-amber-500 shadow-xs z-10"></span>
                      <div className="space-y-1 pl-2">
                        <span className="text-xs font-black text-slate-800 block">ALBURY</span>
                        <span className="block text-[10px] font-extrabold text-amber-500 uppercase tracking-widest leading-none">
                          Inter-facility Transit
                        </span>
                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed pt-1">
                          Our automated sorting facility is preparing this parcel for the next stage in the line-haul trunk.
                        </p>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="relative text-left">
                      <span className="absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-200 shadow-3xs z-10"></span>
                      <div className="space-y-0.5 pl-2">
                        <span className="text-xs font-extrabold text-slate-400 block">MELBOURNE DEPOT</span>
                        <span className="text-[9px] font-bold text-slate-400 block">Awaiting Arrival</span>
                      </div>
                    </div>

                    {/* Step 6 */}
                    <div className="relative text-left">
                      <span className="absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-200 shadow-3xs z-10"></span>
                      <div className="space-y-0.5 pl-2">
                        <span className="text-xs font-extrabold text-slate-400 block">MELBOURNE CBD</span>
                        <span className="text-[9px] font-bold text-slate-400 block">Out for Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary row footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 flex-wrap gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <span>🚚</span> IN TRANSIT: VEH-DEPOT / Consolidated Loading
                    </span>
                    <span className="text-emerald-500 font-black">
                      SERVICE LEVEL: STANDARD EXPRESS
                    </span>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 3: MY INVOICES */}
        {activeTab === 'My Invoices' && (
          <div className="space-y-8 animate-fade-in text-left">
            {/* Header section */}
            <div className="text-left mb-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Invoices</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                2 Outstanding
              </p>
            </div>

            {/* Invoices stats row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-3xs text-left flex justify-between items-center h-28">
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">OUTSTANDING</span>
                  <span className="block text-3xl font-black text-red-500 leading-none mt-2">$3,017.70</span>
                </div>
                <span className="text-2xl opacity-15 select-none">💳</span>
              </div>
              <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-3xs text-left flex justify-between items-center h-28">
                <div>
                  <span className="block text-[9px] font-black text-slate-450 uppercase tracking-wider">PAID (ALL TIME)</span>
                  <span className="block text-3xl font-black text-emerald-500 leading-none mt-2">$3,740.00</span>
                </div>
                <span className="text-2xl opacity-15 select-none">✓</span>
              </div>
            </div>

            {/* Pay Invoice form (Image 2) - shown when PAY NOW is clicked */}
            {payingInvoice ? (
              <div className="max-w-2xl">
                {/* Back link */}
                <button
                  onClick={() => setPayingInvoice(null)}
                  className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-wider transition-colors mb-6 cursor-pointer"
                >
                  ← BACK TO INVOICES
                </button>

                {/* Payment card */}
                <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm space-y-6 max-w-lg">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Pay Invoice</h2>
                    <p className="text-[11px] text-[#FFA000] font-black mt-0.5">{payingInvoice.id}</p>
                  </div>

                  {/* Amount due row */}
                  <div className="flex justify-between items-center bg-slate-50 rounded-[14px] px-5 py-4 border border-slate-100">
                    <span className="text-sm font-black text-slate-500">Amount Due</span>
                    <span className="text-xl font-black text-slate-900">{payingInvoice.amount}</span>
                  </div>

                  {/* Card Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">CARD NUMBER</label>
                    <input
                      type="text"
                      defaultValue="4242 4242 4242 4242"
                      className="w-full border border-slate-200 rounded-[12px] px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFA000] focus:border-transparent"
                    />
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">EXPIRY</label>
                      <input
                        type="text"
                        defaultValue="10/28"
                        className="w-full border border-slate-200 rounded-[12px] px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFA000] focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">CVV</label>
                      <input
                        type="text"
                        defaultValue="123"
                        className="w-full border border-slate-200 rounded-[12px] px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFA000] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Pay button */}
                  <button
                    onClick={() => {
                      setPayingInvoice(null);
                      triggerToast(`Payment of ${payingInvoice.amount} processed successfully!`);
                    }}
                    className="w-full bg-[#FFA000] hover:bg-[#FF9000] text-black font-black text-sm py-3.5 rounded-[14px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    💳 PAY {payingInvoice.amount} VIA STRIPE
                  </button>

                  {/* Security note */}
                  <p className="text-center text-[10px] text-slate-400 font-semibold">
                    🔒 Secured by Stripe · 4096-256 encryption
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-3xs overflow-hidden max-w-4xl p-6 space-y-4">
                {/* Invoice 1 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">INV-2026-1238</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-50 text-red-655 border border-red-100/50">
                        UNPAID
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      J-2026-1240 &bull; ISSUED 16 MAR &bull; DUE 15 APR 2026
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-black text-slate-900">$980.50</span>
                    <button 
                      onClick={() => triggerToast('Downloading invoice PDF...')}
                      className="text-slate-450 hover:text-slate-900 font-extrabold text-[10px] flex items-center gap-1 uppercase cursor-pointer"
                    >
                      📥 PDF
                    </button>
                    <button 
                      onClick={() => setPayingInvoice({ id: 'INV-2026-1238', amount: '$980.50', amountRaw: '980.50' })}
                      className="bg-[#FFA000] hover:bg-[#FF9000] text-black font-extrabold text-[10px] py-2 px-4 rounded-lg uppercase tracking-wider transition-all shadow-3xs cursor-pointer"
                    >
                      PAY NOW
                    </button>
                  </div>
                </div>

                {/* Invoice 2 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">INV-2026-1225</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-50 text-red-655 border border-red-100/50">
                        UNPAID
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      J-2026-1240 &bull; ISSUED 11 MAR &bull; DUE 10 APR 2026
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-black text-slate-900">$2,037.20</span>
                    <button 
                      onClick={() => triggerToast('Downloading invoice PDF...')}
                      className="text-slate-450 hover:text-slate-900 font-extrabold text-[10px] flex items-center gap-1 uppercase cursor-pointer"
                    >
                      📥 PDF
                    </button>
                    <button 
                      onClick={() => setPayingInvoice({ id: 'INV-2026-1225', amount: '$2,037.20', amountRaw: '2,037.20' })}
                      className="bg-[#FFA000] hover:bg-[#FF9000] text-black font-extrabold text-[10px] py-2 px-4 rounded-lg uppercase tracking-wider transition-all shadow-3xs cursor-pointer"
                    >
                      PAY NOW
                    </button>
                  </div>
                </div>

                {/* Invoice 3 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">INV-2026-1195</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                        PAID
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      J-2026-1195 &bull; ISSUED 3 FEB &bull; DUE 5 MAR 2026
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-black text-slate-900">$3,120.00</span>
                    <button 
                      onClick={() => triggerToast('Downloading invoice PDF...')}
                      className="text-slate-450 hover:text-slate-900 font-extrabold text-[10px] flex items-center gap-1 uppercase cursor-pointer"
                    >
                      📥 PDF
                    </button>
                  </div>
                </div>

                {/* Invoice 4 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">INV-2026-1180</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                        PAID
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      J-2026-1180 &bull; ISSUED 29 JAN &bull; DUE 28 FEB 2020
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-black text-slate-900">$620.00</span>
                    <button 
                      onClick={() => triggerToast('Downloading invoice PDF...')}
                      className="text-slate-455 hover:text-slate-900 font-extrabold text-[10px] flex items-center gap-1 uppercase cursor-pointer"
                    >
                      📥 PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY ACCOUNT */}
        {activeTab === 'My Account' && (
          <div className="space-y-8 animate-fade-in text-left max-w-4xl">
            {/* Header section */}
            <div className="text-left mb-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Account</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                Woolworths Group Logistics
              </p>
            </div>

            {/* Company Details Card */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-3xs text-left space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">COMPANY DETAILS</span>
                <button 
                  onClick={() => triggerToast('Opening company settings details editor...')}
                  className="px-4 py-1.5 border border-slate-250 hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] rounded-xl cursor-pointer transition-colors shadow-3xs uppercase tracking-wider"
                >
                  EDIT DETAILS
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-650 flex items-center justify-center text-sm border border-slate-150 shrink-0">
                    🏢
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">COMPANY NAME</span>
                    <span className="block text-xs font-black text-slate-800 mt-0.5">Woolworths Group Logistics</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-655 flex items-center justify-center text-sm border border-slate-150 shrink-0">
                    ✉
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">EMAIL</span>
                    <span className="block text-xs font-bold text-slate-800 mt-0.5">logistics@woolworths.com.au</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-655 flex items-center justify-center text-sm border border-slate-150 shrink-0">
                    📞
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">PHONE</span>
                    <span className="block text-xs font-bold text-slate-800 mt-0.5">+61 2 8888 0000</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-655 flex items-center justify-center text-sm border border-slate-150 shrink-0">
                    📍
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">ADDRESS</span>
                    <span className="block text-xs font-bold text-slate-800 mt-0.5">1 Woolworths Way, Bella Vista NSW 2153</span>
                  </div>
                </div>
              </div>

              {/* Credit Limit & Terms footer */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 flex-wrap gap-4 font-bold">
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase tracking-wider">CREDIT LIMIT</span>
                  <span className="block text-sm font-black text-slate-900 mt-0.5">$50,000 AUD</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase tracking-wider">PAYMENT TERMS</span>
                  <span className="block text-sm font-black text-slate-900 mt-0.5">Net 30 days</span>
                </div>
              </div>
            </div>

            {/* Notification Preferences Card */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-3xs text-left space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">NOTIFICATION PREFERENCES</span>
              </div>

              <div className="space-y-4">
                {/* Preference 1 */}
                <div className="flex items-center justify-between py-1 border-b border-slate-50/50">
                  <span className="text-xs font-extrabold text-slate-855">Load status SMS</span>
                  {/* Custom Toggle Switch */}
                  <button 
                    onClick={() => setSmsToggle(!smsToggle)}
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative focus:outline-none ${
                      smsToggle ? 'bg-[#FFA000]' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      smsToggle ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Preference 2 */}
                <div className="flex items-center justify-between py-1 border-b border-slate-50/50">
                  <span className="text-xs font-extrabold text-slate-855">Delivery confirmation email</span>
                  <button 
                    onClick={() => setEmailToggle(!emailToggle)}
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative focus:outline-none ${
                      emailToggle ? 'bg-[#FFA000]' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      emailToggle ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Preference 3 */}
                <div className="flex items-center justify-between py-1 border-b border-slate-50/50">
                  <span className="text-xs font-extrabold text-slate-855">Invoice email</span>
                  <button 
                    onClick={() => setInvoiceToggle(!invoiceToggle)}
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative focus:outline-none ${
                      invoiceToggle ? 'bg-[#FFA000]' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      invoiceToggle ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Preference 4 */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-extrabold text-slate-855">Payment reminder email</span>
                  <button 
                    onClick={() => setReminderToggle(!reminderToggle)}
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative focus:outline-none ${
                      reminderToggle ? 'bg-[#FFA000]' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      reminderToggle ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
