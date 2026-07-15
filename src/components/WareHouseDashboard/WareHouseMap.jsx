import React, { useState } from 'react';
import { Search, MapPin, Printer, RefreshCw, AlertTriangle, Move, ClipboardList, Plus } from 'lucide-react';

export default function WarehouseMap({
  logisticsMode,
  setLogisticsMode,
  carStock,
  freightStock,
  selectedCarId,
  setSelectedCarId,
  selectedFreightId,
  setSelectedFreightId,
  locations,
  onAddLocationClick,
  onAddHoldingClick,
  onAddLoadLaneClick,
  onBarcodeSimulatorClick,
  onManualEntryClick,
  onExportStockClick,
  onMoveClick,
  onToHoldingClick,
  onToLaneClick,
  onAssignToLaneClick,
  onPrintLabelClick,
  onHistoryClick,
  onMissingClick,
  onMovementHistoryClick
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Active Asset Selection Logic
  const getActiveAsset = () => {
    if (logisticsMode === 'car_carrying') {
      return carStock.find(c => c.id === selectedCarId);
    } else {
      return freightStock.find(f => f.id === selectedFreightId);
    }
  };

  const activeAsset = getActiveAsset();

  const getFilteredAssets = () => {
    if (logisticsMode === 'car_carrying') {
      return carStock.filter(c =>
        c.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return freightStock.filter(f =>
        f.itemNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.barcode.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  };

  const filteredAssets = getFilteredAssets();

  // Determine which location card on the map is active
  const getAssetLocationName = (asset) => {
    if (!asset) return '';
    return logisticsMode === 'car_carrying' ? asset.location : asset.aisleBin;
  };

  const activeLocName = getAssetLocationName(activeAsset);

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
            onClick={onBarcodeSimulatorClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xs select-none focus:outline-none"
          >
            <Printer className="h-4 w-4" />
            <span>Barcode Simulator</span>
          </button>
          
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

      {/* Main Split Layout Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Independent Assets */}
        <div className="lg:col-span-3.5 bg-white rounded-2xl p-4 border border-slate-200 text-left space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Independent Assets</h3>
              <span className="text-[10px] bg-[#FFD400]/20 text-[#FF9A00] border border-[#FFD400]/30 px-2 py-0.5 rounded-full font-bold">
                {filteredAssets.length} Units
              </span>
            </div>

            {/* Search Asset input */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder={logisticsMode === 'car_carrying' ? "Search VIN, Rego, Model..." : "Search Item No, Barcode..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl focus:border-brand-600 focus:outline-none transition-all duration-200"
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* Assets List */}
            <div className="space-y-2.5 overflow-y-auto max-h-[500px] flex-1 pr-1">
              {filteredAssets.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs italic">
                  No matching assets.
                </div>
              ) : (
                filteredAssets.map((item) => {
                  const isSelected = logisticsMode === 'car_carrying' ? item.id === selectedCarId : item.id === selectedFreightId;
                  const itemLoc = logisticsMode === 'car_carrying' ? item.location : item.aisleBin;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (logisticsMode === 'car_carrying') setSelectedCarId(item.id);
                        else setSelectedFreightId(item.id);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-2 text-left relative ${
                        isSelected
                          ? 'bg-white border-[#f59e0b] shadow-md shadow-[#f59e0b]/5 ring-1 ring-[#f59e0b]'
                          : 'bg-white border-slate-200 hover:border-slate-350'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-900 font-mono font-black uppercase text-[11px]">
                          {logisticsMode === 'car_carrying' ? item.vin : item.itemNo}
                        </strong>
                        <span className="inline-flex px-2 py-0.5 text-[9px] font-extrabold rounded-md bg-slate-100 text-slate-655 border border-slate-200 uppercase">
                          {item.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-end text-slate-500 text-[10px] font-semibold">
                        <span>
                          {logisticsMode === 'car_carrying' ? `${item.rego} • ${item.model}` : `${item.palletCount} Pallets • ${item.weight}`}
                        </span>
                        <span className="text-[#f59e0b] font-bold font-mono">
                          {itemLoc}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-center flex-shrink-0">
            <span className="text-[10px] text-slate-400 font-semibold leading-relaxed block">
              * Assets exist independently of load bookings.
            </span>
          </div>
        </div>

        {/* CENTRE COLUMN: Allocation Map */}
        <div className="lg:col-span-5.5 bg-white rounded-2xl p-5 border border-slate-200 text-left flex flex-col justify-between shadow-xs">
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Yard / Warehouse Allocation Map</h3>
              <div className="flex flex-wrap gap-2.5 text-[10px] font-extrabold text-[#f59e0b]">
                <button onClick={onAddLocationClick} className="hover:underline cursor-pointer focus:outline-none">+ Add Location</button>
                <button onClick={onAddHoldingClick} className="hover:underline cursor-pointer focus:outline-none">+ Add Holding</button>
                <button onClick={onAddLoadLaneClick} className="hover:underline cursor-pointer focus:outline-none">+ Add Load Lane</button>
              </div>
            </div>

            {/* Allocation Grid Map */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:16px_16px] grid grid-cols-2 gap-4 flex-1 min-h-[460px] content-start">
              {locations.map((loc) => {
                const isActive = activeAsset && activeLocName === loc.name;
                return (
                  <div
                    key={loc.id}
                    className={`p-4 rounded-xl border relative flex flex-col justify-between transition-all select-none min-h-[92px] ${
                      isActive
                        ? 'bg-amber-500/5 border-[#f59e0b] shadow-md ring-1 ring-[#f59e0b]'
                        : 'bg-white/80 border-slate-200 border-dashed hover:border-slate-350'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{loc.type}</span>
                      <strong className="text-xs font-black text-slate-900 block mt-1">{loc.name}</strong>
                    </div>
                    
                    {isActive ? (
                      <>
                        <span className="text-[10px] font-mono text-[#f59e0b] font-black block mt-2">
                          {logisticsMode === 'car_carrying' ? activeAsset.vin : activeAsset.itemNo}
                        </span>
                        <MapPin className="h-4 w-4 text-[#f59e0b] absolute top-4 right-4 animate-bounce" />
                      </>
                    ) : (
                      <span className="text-[9px] text-slate-400 italic block mt-2 font-medium">- Empty Spot</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Relocation Controls */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 flex-shrink-0">
            <button
              onClick={onMoveClick}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-extrabold rounded-xl transition-all cursor-pointer focus:outline-none"
            >
              <Move className="h-3.5 w-3.5 text-slate-400" />
              <span>Move Item</span>
            </button>
            <button
              onClick={onToHoldingClick}
              className="inline-flex items-center justify-center py-2.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#f59e0b] text-[10px] font-extrabold rounded-xl transition-all cursor-pointer focus:outline-none"
            >
              <span>Move to Holding Area</span>
            </button>
            <button
              onClick={onToLaneClick}
              className="inline-flex items-center justify-center py-2.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#f59e0b] text-[10px] font-extrabold rounded-xl transition-all cursor-pointer focus:outline-none"
            >
              <span>Move to Load Lane</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Stock Detail */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 text-left flex flex-col justify-between shadow-xs">
          {activeAsset ? (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Stock Detail</span>
                    <strong className="text-base font-black text-slate-900 block mt-1">
                      {logisticsMode === 'car_carrying' ? activeAsset.vin : activeAsset.itemNo}
                    </strong>
                  </div>
                  <span className="inline-flex px-2.5 py-1 text-[10px] font-black rounded-lg border bg-slate-50 text-slate-655 border-slate-200 uppercase">
                    {activeAsset.status}
                  </span>
                </div>

                {/* Specific details */}
                <div className="space-y-3.5 text-xs">
                  {logisticsMode === 'car_carrying' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Rego Plate</span>
                          <strong className="text-slate-800 font-extrabold block mt-0.5">{activeAsset.rego}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Stock Number</span>
                          <strong className="text-slate-800 font-extrabold block mt-0.5">{activeAsset.stockNo}</strong>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Vehicle Model Make</span>
                        <strong className="text-slate-800 font-extrabold block mt-0.5">{activeAsset.model}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Location Bay</span>
                          <strong className="text-[#f59e0b] font-bold font-mono block mt-0.5">{activeAsset.location}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Load Lane</span>
                          <strong className="text-slate-800 font-extrabold block mt-0.5">{activeAsset.lane}</strong>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pallet Count</span>
                        <strong className="text-slate-800 font-black text-sm block mt-0.5">{activeAsset.palletCount} Pallets</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Weight</span>
                          <strong className="text-slate-800 font-extrabold block mt-0.5">{activeAsset.weight}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Dimensions</span>
                          <strong className="text-slate-800 font-extrabold block mt-0.5">{activeAsset.dimensions}</strong>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Aisle/Bin Location</span>
                          <strong className="text-[#f59e0b] font-bold font-mono block mt-0.5">{activeAsset.aisleBin}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Zone</span>
                          <strong className="text-slate-800 font-extrabold block mt-0.5">{activeAsset.zone}</strong>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Barcode / QR</span>
                    <strong className="text-slate-800 font-mono font-semibold block mt-0.5">{activeAsset.barcode || activeAsset.vin}</strong>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Customer Account</span>
                    <strong className="text-slate-800 font-extrabold block mt-0.5">{activeAsset.customer}</strong>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Destination Delivery</span>
                    <strong className="text-slate-800 font-extrabold block mt-0.5">{activeAsset.destination}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons list */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 flex-shrink-0">
                <button
                  onClick={onAssignToLaneClick}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition-all cursor-pointer focus:outline-none"
                >
                  <Move className="h-4 w-4 text-slate-450 rotate-90" />
                  <span>Assign to Load Lane</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={onPrintLabelClick}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none"
                  >
                    <Printer className="h-4 w-4 text-slate-400" />
                    <span>Print Label</span>
                  </button>
                  <button
                    onClick={onPrintLabelClick}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Reprint</span>
                  </button>
                </div>

                <div className="text-center py-1">
                  <button
                    onClick={onHistoryClick}
                    className="text-slate-655 font-bold hover:text-slate-900 text-xs underline cursor-pointer focus:outline-none"
                  >
                    View Asset History
                  </button>
                </div>

                <button
                  onClick={onMissingClick}
                  className="w-full inline-flex items-center justify-center py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500 mr-1.5" />
                  <span>Report Missing Item</span>
                </button>

                <button
                  onClick={onMovementHistoryClick}
                  className="w-full inline-flex items-center justify-center py-3.5 bg-[#FFD400] hover:bg-[#FF9A00] text-slate-955 font-black text-xs rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  <span>View Movement History</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs italic py-10">
              Select an asset from the list to view specifications.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
