import React, { useState } from 'react';

export default function AIControls() {
  const [features, setFeatures] = useState({
    loadParse: true,
    receiptScan: true,
    odometer: true,
    smartDispatch: false,
    etaPrediction: true,
    chatAssistant: false
  });

  const toggleFeature = (key) => {
    setFeatures(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const enableAll = () => {
    setFeatures({
      loadParse: true,
      receiptScan: true,
      odometer: true,
      smartDispatch: true,
      etaPrediction: true,
      chatAssistant: true
    });
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 w-full font-sans text-left">
      {/* Injected Style to Hide Scrollbars */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Super Admin • Ai Controls
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button className="border border-slate-200 bg-white hover:bg-slate-50 text-yellow-500 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors">
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">AI FEATURES ACTIVE</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">4</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Enabled AI modules</span>
            <span>Stable</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">AI REQUESTS TODAY</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">4,820</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Processed model infere...</span>
            <span className="text-emerald-500 font-extrabold">+12%</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">AVG LATENCY</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">142 ms</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Model inference respon...</span>
            <span className="text-emerald-500 font-extrabold">Good</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">SUCCESS RATE</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">98.7%</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold mt-2">
            <span className="text-slate-400">Successful AI job c...</span>
            <span className="text-emerald-500 font-extrabold text-right">Target Met</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">FAILED REQUESTS</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">62</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Errors in last 24 hrs</span>
            <span>Low</span>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">AI STORAGE</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">0.84 TB</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Model artifacts + emb...</span>
            <span>Stable</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left Column - Enable / Disable */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
          <h2 className="text-lg font-black text-slate-800 mb-1">AI Feature Enable / Disable</h2>
          <p className="text-xs font-semibold text-slate-400 mb-6">Control which AI modules are active globally.</p>

          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1">Load Parse AI</h4>
                <span className="text-xs font-bold text-emerald-500">• Active</span>
              </div>
              <button 
                onClick={() => toggleFeature('loadParse')}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center ${
                  features.loadParse ? 'bg-[#FFD400] justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

            {/* Feature 2 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1">Receipt Scan OCR</h4>
                <span className="text-xs font-bold text-emerald-500">• Active</span>
              </div>
              <button 
                onClick={() => toggleFeature('receiptScan')}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center ${
                  features.receiptScan ? 'bg-[#FFD400] justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

            {/* Feature 3 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1">Odometer Detection</h4>
                <span className="text-xs font-bold text-emerald-500">• Active</span>
              </div>
              <button 
                onClick={() => toggleFeature('odometer')}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center ${
                  features.odometer ? 'bg-[#FFD400] justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

            {/* Feature 4 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1">Smart Dispatch</h4>
                <span className="text-xs font-bold text-slate-400">• Inactive</span>
              </div>
              <button 
                onClick={() => toggleFeature('smartDispatch')}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center ${
                  features.smartDispatch ? 'bg-[#FFD400] justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

            {/* Feature 5 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1">ETA Prediction</h4>
                <span className="text-xs font-bold text-emerald-500">• Active</span>
              </div>
              <button 
                onClick={() => toggleFeature('etaPrediction')}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center ${
                  features.etaPrediction ? 'bg-[#FFD400] justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

            {/* Feature 6 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1">Chat Assistant</h4>
                <span className="text-xs font-bold text-slate-400">• Inactive</span>
              </div>
              <button 
                onClick={() => toggleFeature('chatAssistant')}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center ${
                  features.chatAssistant ? 'bg-[#FFD400] justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

            <button 
              onClick={enableAll}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs py-3 rounded-xl transition-colors cursor-pointer text-center"
            >
              Enable All Features
            </button>
          </div>
        </div>

        {/* Right Column - Configurations & Logs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Configuration & Limits */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-black text-slate-800 mb-1">AI Model Configuration & Limits</h2>
            <p className="text-xs font-semibold text-slate-400 mb-6">Configure confidence thresholds and daily processing limits.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Load Parse Confidence (%)</label>
                <div className="flex items-center gap-2">
                  <input type="text" defaultValue="85" className="flex-grow px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-800" />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Receipt OCR Confidence (%)</label>
                <div className="flex items-center gap-2">
                  <input type="text" defaultValue="90" className="flex-grow px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-800" />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Odometer Detection (%)</label>
                <div className="flex items-center gap-2">
                  <input type="text" defaultValue="95" className="flex-grow px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-800" />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Daily API Call Limit</label>
                <div className="flex items-center gap-2">
                  <input type="text" defaultValue="1000" className="flex-grow px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-800" />
                  <span className="text-xs font-bold text-slate-400">/day</span>
                </div>
              </div>
            </div>

            <button className="bg-[#FFD400] text-black font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-[#FFC800] transition-colors">
              Save AI Configuration
            </button>
          </div>

          {/* Card 2: AI Activity Logs */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-black text-slate-800 mb-1">AI Activity Logs</h2>
            <p className="text-xs font-semibold text-slate-400 mb-6">Recent AI model events and processing history.</p>

            {/* Scrollable Container with Hidden Scrollbar */}
            <div 
              className="space-y-4 max-h-[290px] overflow-y-auto pr-1 hide-scrollbar"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {/* Log 1 */}
              <div className="border border-slate-100 rounded-2xl p-4 flex justify-between items-start">
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mt-1.5 shrink-0"></div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 mb-0.5">Load Parse AI</h4>
                    <p className="text-[10px] font-medium text-slate-400">Confidence threshold crossed — load #LDX-9021 rejected</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 shrink-0">2026-06-26 16:42</span>
              </div>

              {/* Log 2 */}
              <div className="border border-slate-100 rounded-2xl p-4 flex justify-between items-start">
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 mb-0.5">Receipt Scan OCR</h4>
                    <p className="text-[10px] font-medium text-slate-400">Batch scan completed — 14 receipts processed</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 shrink-0">2026-06-26 15:30</span>
              </div>

              {/* Log 3 */}
              <div className="border border-slate-100 rounded-2xl p-4 flex justify-between items-start">
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 mb-0.5">Odometer Detection</h4>
                    <p className="text-[10px] font-medium text-slate-400">Anomaly detected — vehicle #VH-443 odometer mismatch</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 shrink-0">2026-06-26 14:15</span>
              </div>

              {/* Log 4 */}
              <div className="border border-slate-100 rounded-2xl p-4 flex justify-between items-start">
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mt-1.5 shrink-0"></div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 mb-0.5">Smart Dispatch</h4>
                    <p className="text-[10px] font-medium text-slate-400">Automated routing system updated for route #RTE-2928.</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 shrink-0">2026-06-26 12:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Analytics */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs w-full">
        <h2 className="text-lg font-black text-slate-800 mb-6">AI Usage Analytics — Requests by Feature</h2>
        
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <span className="w-40 text-xs font-bold text-slate-600">Load Parse AI</span>
            <div className="flex-grow bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#FFD400] h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
            <span className="w-20 text-right text-xs font-extrabold text-slate-800">1,200 req</span>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <span className="w-40 text-xs font-bold text-slate-600">Receipt Scan OCR</span>
            <div className="flex-grow bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#FFD400] h-full rounded-full" style={{ width: '78%' }}></div>
            </div>
            <span className="w-20 text-right text-xs font-extrabold text-slate-800">980 req</span>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <span className="w-40 text-xs font-bold text-slate-600">Odometer Detection</span>
            <div className="flex-grow bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#FFD400] h-full rounded-full" style={{ width: '68%' }}></div>
            </div>
            <span className="w-20 text-right text-xs font-extrabold text-slate-800">840 req</span>
          </div>

          {/* Row 4 */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <span className="w-40 text-xs font-bold text-slate-600">Smart Dispatch</span>
            <div className="flex-grow bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-slate-850 h-full rounded-full" style={{ width: '3%' }}></div>
            </div>
            <span className="w-20 text-right text-xs font-extrabold text-slate-800">0 req</span>
          </div>

          {/* Row 5 */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <span className="w-40 text-xs font-bold text-slate-600">ETA Prediction</span>
            <div className="flex-grow bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#FFD400] h-full rounded-full" style={{ width: '40%' }}></div>
            </div>
            <span className="w-20 text-right text-xs font-extrabold text-slate-800">480 req</span>
          </div>

          {/* Row 6 */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <span className="w-40 text-xs font-bold text-slate-600">Chat Assistant</span>
            <div className="flex-grow bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-slate-850 h-full rounded-full" style={{ width: '3%' }}></div>
            </div>
            <span className="w-20 text-right text-xs font-extrabold text-slate-800">0 req</span>
          </div>
        </div>
      </div>
    </div>
  );
}
