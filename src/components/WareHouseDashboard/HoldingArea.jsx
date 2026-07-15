import React, { useState } from 'react';
import { Settings, X, Plus } from 'lucide-react';

export default function Holding({
  logisticsMode,
  onBarcodeSimulatorClick,
  onManualEntryClick,
  onExportStockClick,
  onMoveClick,
  triggerToast
}) {
  const [leftDensity, setLeftDensity] = useState('compact');
  const [rightDensity, setRightDensity] = useState('compact');

  const [leftColsMenuOpen, setLeftColsMenuOpen] = useState(false);
  const [rightColsMenuOpen, setRightColsMenuOpen] = useState(false);

  const [selectedLeftRows, setSelectedLeftRows] = useState([]);
  const [selectedRightRows, setSelectedRightRows] = useState([]);

  // Column visibility states
  const [visibleLeftCols, setVisibleLeftCols] = useState({
    holdingArea: true,
    capacity: true,
    status: true
  });

  const [visibleRightCols, setVisibleRightCols] = useState({
    assetCode: true,
    stagingLocation: false,
    dateAdded: false,
    actions: true
  });

  // State for holding zones
  const [holdingZones, setHoldingZones] = useState([
    { id: 'HZ-1', name: 'Holding Area A', units: 1, maxCapacity: 50, status: 'AVAILABLE' },
    { id: 'HZ-2', name: 'Holding Area B', units: 1, maxCapacity: 50, status: 'AVAILABLE' }
  ]);

  // State for assets in holding
  const [assets, setAssets] = useState([
    { id: 'VIN-3YV1HP52X81254', code: 'VIN-3YV1HP52X81254', zone: 'Holding Area A', date: new Date().toLocaleDateString() },
    { id: 'VIN-8ZV9HK21W92110', code: 'VIN-8ZV9HK21W92110', zone: 'Holding Area B', date: new Date().toLocaleDateString() }
  ]);

  const handleRemove = (assetId) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    // Remove from assets state
    setAssets(assets.filter(a => a.id !== assetId));

    // Decrement lane count in holding zones
    setHoldingZones(holdingZones.map(h => {
      if (h.name === asset.zone) {
        const newUnits = Math.max(0, h.units - 1);
        return { 
          ...h, 
          units: newUnits, 
          status: newUnits >= h.maxCapacity ? 'FULL' : 'AVAILABLE' 
        };
      }
      return h;
    }));

    if (triggerToast) {
      triggerToast(`Asset ${asset.code} successfully removed from ${asset.zone}.`, 'error');
    }
  };

  const handleAddHoldingZone = () => {
    const nextChar = String.fromCharCode(65 + holdingZones.length); // A, B, C...
    const newZone = {
      id: `HZ-${Date.now()}`,
      name: `Holding Area ${nextChar}`,
      units: 0,
      maxCapacity: 50,
      status: 'AVAILABLE'
    };
    setHoldingZones([...holdingZones, newZone]);
    if (triggerToast) {
      triggerToast(`New intermediate holding zone "${newZone.name}" created successfully.`);
    }
  };

  const handleLeftSelect = (id) => {
    if (selectedLeftRows.includes(id)) {
      setSelectedLeftRows(selectedLeftRows.filter(r => r !== id));
    } else {
      setSelectedLeftRows([...selectedLeftRows, id]);
    }
  };

  const handleAllLeftSelect = () => {
    if (selectedLeftRows.length === holdingZones.length) {
      setSelectedLeftRows([]);
    } else {
      setSelectedLeftRows(holdingZones.map(h => h.id));
    }
  };

  const handleRightSelect = (id) => {
    if (selectedRightRows.includes(id)) {
      setSelectedRightRows(selectedRightRows.filter(r => r !== id));
    } else {
      setSelectedRightRows([...selectedRightRows, id]);
    }
  };

  const handleAllRightSelect = () => {
    if (selectedRightRows.length === assets.length) {
      setSelectedRightRows([]);
    } else {
      setSelectedRightRows(assets.map(a => a.id));
    }
  };

  const getPaddingClass = (density) => {
    if (density === 'compact') return 'py-1.5 px-6';
    if (density === 'relaxed') return 'py-5 px-6';
    return 'py-3.5 px-6'; // default
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
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'car_carrying' ? 'bg-[#FFD400] text-slate-955 font-extrabold shadow-xs' : 'text-slate-550'}`}
            >
              Car Carrying Yard
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'general_freight' ? 'bg-[#FFD400] text-slate-955 font-extrabold shadow-xs' : 'text-slate-550'}`}
            >
              General Freight
            </button>
          </div>

          <button
            onClick={onBarcodeSimulatorClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xs select-none focus:outline-none"
          >
            <span>Barcode Simulator</span>
          </button>
          
          <button
            onClick={onManualEntryClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xs select-none focus:outline-none"
          >
            <span>Manual Entry</span>
          </button>
          
          <button
            onClick={onExportStockClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black bg-gradient-to-r from-[#FFD400] to-[#FF9A00] text-slate-950 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md select-none hover:shadow-lg focus:outline-none"
          >
            <span>Export Stock List</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="glass rounded-2xl p-6 border border-slate-200 bg-white text-left space-y-6 shadow-xs">
        
        {/* Card Header Section */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Holding Area Management</h3>
            <p className="text-xs text-slate-450 mt-1">Manage intermediate holding zones and assigned staging assets.</p>
          </div>
          <button
            onClick={handleAddHoldingZone}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-[#f59e0b]/45 text-[#f59e0b] hover:bg-[#f59e0b]/10 hover:border-[#f59e0b] rounded-xl transition-all cursor-pointer focus:outline-none"
          >
            <Plus className="h-4 w-4" />
            <span>Add Holding Area</span>
          </button>
        </div>

        {/* 2-Column Split Tables Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* COLUMN 1: HOLDING ZONES STATUS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Holding Zones Status</h4>
              <div className="flex items-center gap-3 relative">
                
                {/* Density selector */}
                <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-[9px] font-bold">
                  {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
                    const isActive = leftDensity === mode.toLowerCase();
                    return (
                      <button
                        key={mode}
                        onClick={() => setLeftDensity(mode.toLowerCase())}
                        className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-[#FFD400] text-slate-955 font-extrabold shadow-xs' : 'text-slate-550'}`}
                      >
                        {mode}
                      </button>
                    );
                  })}
                </div>

                {/* Columns button */}
                <button
                  onClick={() => setLeftColsMenuOpen(!leftColsMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 font-bold text-[9px] uppercase rounded-xl cursor-pointer focus:outline-none"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>Columns</span>
                </button>

                {/* Columns visibility popover list */}
                {leftColsMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 text-slate-800 animate-fade-in">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-550">Column Visibility</span>
                      <button onClick={() => setLeftColsMenuOpen(false)} className="text-slate-450">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={visibleLeftCols.holdingArea}
                          onChange={() => setVisibleLeftCols({ ...visibleLeftCols, holdingArea: !visibleLeftCols.holdingArea })}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Holding Area</span>
                      </label>
                      <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={visibleLeftCols.capacity}
                          onChange={() => setVisibleLeftCols({ ...visibleLeftCols, capacity: !visibleLeftCols.capacity })}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Capacity</span>
                      </label>
                      <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={visibleLeftCols.status}
                          onChange={() => setVisibleLeftCols({ ...visibleLeftCols, status: !visibleLeftCols.status })}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Status</span>
                      </label>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Left Table holding area status */}
            <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedLeftRows.length === holdingZones.length && holdingZones.length > 0}
                        onChange={handleAllLeftSelect}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                    </th>
                    {visibleLeftCols.holdingArea && <th className="px-6 py-4 font-extrabold">Holding Area</th>}
                    {visibleLeftCols.capacity && <th className="px-6 py-4 font-extrabold">Capacity</th>}
                    {visibleLeftCols.status && <th className="px-6 py-4 font-extrabold">Status</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {holdingZones.map((row) => {
                    const isChecked = selectedLeftRows.includes(row.id);
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 text-center whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleLeftSelect(row.id)}
                            className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                          />
                        </td>
                        {visibleLeftCols.holdingArea && (
                          <td className={`text-slate-900 font-extrabold whitespace-nowrap ${getPaddingClass(leftDensity)}`}>
                            {row.name}
                          </td>
                        )}
                        {visibleLeftCols.capacity && (
                          <td className={`text-slate-655 font-bold whitespace-nowrap ${getPaddingClass(leftDensity)}`}>
                            {row.units} / {row.maxCapacity}
                          </td>
                        )}
                        {visibleLeftCols.status && (
                          <td className={`whitespace-nowrap ${getPaddingClass(leftDensity)}`}>
                            <span className="inline-flex px-2.5 py-0.5 text-[9px] font-black rounded-lg border bg-slate-50 text-slate-655 border-slate-200 uppercase">
                              {row.status}
                            </span>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* COLUMN 2: ASSETS IN HOLDING */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Assets in Holding</h4>
              <div className="flex items-center gap-3 relative">
                
                {/* Density selector */}
                <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-[9px] font-bold">
                  {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
                    const isActive = rightDensity === mode.toLowerCase();
                    return (
                      <button
                        key={mode}
                        onClick={() => setRightDensity(mode.toLowerCase())}
                        className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-[#FFD400] text-slate-950 font-extrabold shadow-xs' : 'text-slate-550'}`}
                      >
                        {mode}
                      </button>
                    );
                  })}
                </div>

                {/* Columns button */}
                <button
                  onClick={() => setRightColsMenuOpen(!rightColsMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 font-bold text-[9px] uppercase rounded-xl cursor-pointer focus:outline-none"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>Columns</span>
                </button>

                {/* Right columns visibility popover */}
                {rightColsMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 text-slate-800 animate-fade-in">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-555">Column Visibility</span>
                      <button onClick={() => setRightColsMenuOpen(false)} className="text-slate-450">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={visibleRightCols.assetCode}
                          onChange={() => setVisibleRightCols({ ...visibleRightCols, assetCode: !visibleRightCols.assetCode })}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Asset Code</span>
                      </label>
                      <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={visibleRightCols.stagingLocation}
                          onChange={() => setVisibleRightCols({ ...visibleRightCols, stagingLocation: !visibleRightCols.stagingLocation })}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Staging Location</span>
                      </label>
                      <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={visibleRightCols.dateAdded}
                          onChange={() => setVisibleRightCols({ ...visibleRightCols, dateAdded: !visibleRightCols.dateAdded })}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Date Added</span>
                      </label>
                      <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={visibleRightCols.actions}
                          onChange={() => setVisibleRightCols({ ...visibleRightCols, actions: !visibleRightCols.actions })}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Actions</span>
                      </label>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right Table assets in holding */}
            <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRightRows.length === assets.length && assets.length > 0}
                        onChange={handleAllRightSelect}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                    </th>
                    {visibleRightCols.assetCode && <th className="px-6 py-4 font-extrabold">Asset Code</th>}
                    {visibleRightCols.stagingLocation && <th className="px-6 py-4 font-extrabold">Staging Location</th>}
                    {visibleRightCols.dateAdded && <th className="px-6 py-4 font-extrabold">Date Added</th>}
                    {visibleRightCols.actions && <th className="px-6 py-4 font-extrabold">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {assets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`text-center font-bold text-slate-500 ${getPaddingClass(rightDensity)}`}>
                        NO RECORDS RESOLVED.
                      </td>
                    </tr>
                  ) : (
                    assets.map((row) => {
                      const isChecked = selectedRightRows.includes(row.id);
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 text-center whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleRightSelect(row.id)}
                              className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                            />
                          </td>
                          {visibleRightCols.assetCode && (
                            <td className={`font-mono text-slate-900 font-extrabold whitespace-nowrap ${getPaddingClass(rightDensity)}`}>
                              {row.code}
                            </td>
                          )}
                          {visibleRightCols.stagingLocation && (
                            <td className={`text-slate-505 font-medium whitespace-nowrap ${getPaddingClass(rightDensity)}`}>
                              {row.zone}
                            </td>
                          )}
                          {visibleRightCols.dateAdded && (
                            <td className={`text-slate-505 font-semibold whitespace-nowrap ${getPaddingClass(rightDensity)}`}>
                              {row.date}
                            </td>
                          )}
                          {visibleRightCols.actions && (
                            <td className={`whitespace-nowrap ${getPaddingClass(rightDensity)}`}>
                              <div className="flex gap-2">
                                <button
                                  onClick={onMoveClick}
                                  className="inline-flex items-center justify-center font-bold px-4 py-2 text-xs rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all hover:scale-[1.02] cursor-pointer"
                                >
                                  Move Item
                                </button>
                                <button
                                  onClick={() => handleRemove(row.id)}
                                  className="inline-flex items-center justify-center font-bold px-4 py-2 text-xs rounded-xl border border-[#f59e0b]/45 text-[#f59e0b] hover:bg-[#f59e0b]/10 hover:border-[#f59e0b] transition-all hover:scale-[1.02] cursor-pointer"
                                >
                                  Remove Item
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
