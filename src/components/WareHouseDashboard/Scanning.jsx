import React, { useState } from 'react';
import { Download, Plus } from 'lucide-react';

export default function Scanning({
  logisticsMode,
  setLogisticsMode,
  onManualEntryClick,
  onExportStockClick,
  onSimulateScanSubmit
}) {
  const [barcodeInput, setBarcodeInput] = useState('');

  const handleAction = (actionType) => {
    if (!barcodeInput) {
      alert('Please enter a barcode or QR code first!');
      return;
    }
    if (onSimulateScanSubmit) {
      onSimulateScanSubmit(barcodeInput, actionType);
    }
    setBarcodeInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header with Switcher & Operations */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 capitalize">Warehouse & Yard Workspace</h2>
          <p className="text-xs text-slate-500 font-medium">Manage stock allocations, print asset tags, and spot load lanes.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Logistics Niche Toggle */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => setLogisticsMode('car_carrying')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'car_carrying' ? 'bg-[#FFD400] text-slate-955 font-extrabold shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Car Carrying Yard
            </button>
            <button
              onClick={() => setLogisticsMode('general_freight')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'general_freight' ? 'bg-[#FFD400] text-slate-955 font-extrabold shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
            >
              General Freight
            </button>
          </div>

          <button
            onClick={onManualEntryClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xs select-none focus:outline-none"
          >
            <Plus className="h-4 w-4" />
            <span>Manual Entry</span>
          </button>
          
          <button
            onClick={onExportStockClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black bg-gradient-to-r from-[#FFD400] to-[#FF9A00] text-slate-950 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md select-none hover:shadow-lg focus:outline-none"
          >
            <Download className="h-4 w-4" />
            <span>Export Stock List</span>
          </button>
        </div>
      </div>

      {/* Warehouse Scanning Terminal main box component */}
      <div className="glass rounded-2xl p-6 border border-slate-200 bg-white text-left space-y-6 shadow-xs">
        
        {/* Title / Subtitle section */}
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Warehouse Scanning Terminal</h3>
          <p className="text-xs text-slate-400 mt-1">Scan physical barcodes, register stock tags, and log movements.</p>
        </div>

        {/* 2-Column Terminal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT COLUMN: Scan Action Simulator */}
          <div className="p-5 bg-slate-50/50 border border-slate-200 rounded-2xl space-y-5 text-left flex flex-col justify-between">
            <div className="space-y-4">
              <strong className="text-[10px] font-black text-slate-900 tracking-wider uppercase block">Scan Action Simulator</strong>
              
              <div className="space-y-2">
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">
                  Barcode Input Tag
                </label>
                <input
                  type="text"
                  placeholder="Enter barcode or QR code..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 text-xs rounded-xl focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Buttons list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3">
              <button
                onClick={() => handleAction('Scan In')}
                className="py-3 bg-[#FFD400] hover:bg-[#FF9A00] text-slate-955 font-black text-xs rounded-xl transition-all cursor-pointer select-none active:scale-[0.98] focus:outline-none"
              >
                Scan In
              </button>
              <button
                onClick={() => handleAction('Scan Out')}
                className="py-3 bg-rose-600 hover:bg-rose-750 text-white font-black text-xs rounded-xl transition-all cursor-pointer select-none active:scale-[0.98] focus:outline-none"
              >
                Scan Out
              </button>
              <button
                onClick={() => handleAction('Barcode')}
                className="py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer select-none active:scale-[0.98] focus:outline-none"
              >
                Scan by Barcode
              </button>
              <button
                onClick={() => handleAction('QR')}
                className="py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer select-none active:scale-[0.98] focus:outline-none"
              >
                Scan by QR
              </button>
              <button
                onClick={onManualEntryClick}
                className="py-3 bg-white border border-[#f59e0b]/45 text-[#f59e0b] hover:bg-[#f59e0b]/5 font-bold text-xs rounded-xl transition-all cursor-pointer select-none active:scale-[0.98] col-span-2 sm:col-span-1 focus:outline-none"
              >
                Manual Entry
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Device Status */}
          <div className="p-5 bg-slate-50/50 border border-slate-200 rounded-2xl flex flex-col justify-between items-center text-center">
            <div className="text-left w-full space-y-1">
              <strong className="text-[10px] font-black text-slate-900 tracking-wider uppercase block">Device Status</strong>
              <span className="text-[10px] text-slate-400 font-semibold block">Zebra Scanner handheld connected.</span>
            </div>

            <div className="my-6 px-6 py-4 bg-emerald-50 border border-emerald-250/50 text-emerald-600 font-extrabold text-xs tracking-wider rounded-xl select-none">
              SCANNER ONLINE • READY TO SCAN
            </div>

            <div className="text-[9px] text-slate-400 font-semibold leading-relaxed">
              * Scanning operations automatically update inventory locations and log movements history.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
