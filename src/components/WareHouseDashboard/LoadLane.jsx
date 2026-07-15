import React, { useState } from 'react';
import { Settings, X, Plus } from 'lucide-react';

export default function LoadLane({
  logisticsMode,
  onBarcodeSimulatorClick,
  onManualEntryClick,
  onExportStockClick,
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
    laneName: true,
    assignedAssets: true,
    laneStatus: true
  });

  const [visibleRightCols, setVisibleRightCols] = useState({
    assetCode: true,
    assignedLane: false,
    status: false,
    actions: true
  });

  // State for active lanes
  const [lanes, setLanes] = useState([
    { id: 'L-1', name: 'Lane A1', units: 0, status: 'READY TO LOAD' },
    { id: 'L-2', name: 'Lane A2', units: 0, status: 'READY TO LOAD' },
    { id: 'L-3', name: 'Lane C3', units: 0, status: 'READY TO LOAD' }
  ]);

  // State for queueing assets
  const [queueAssets, setQueueAssets] = useState([
    { id: 'VIN-7YV1HP82A81920', code: 'VIN-7YV1HP82A81920', targetLane: 'Lane A1', status: 'Staged', assigned: false },
    { id: 'VIN-3YV1HP52X81254', code: 'VIN-3YV1HP52X81254', targetLane: 'Lane A2', status: 'Assigned', assigned: false },
    { id: 'VIN-8ZV9HK21W92110', code: 'VIN-8ZV9HK21W92110', targetLane: 'Lane C3', status: 'Ready', assigned: false }
  ]);

  const handleAssign = (assetId) => {
    const asset = queueAssets.find(a => a.id === assetId);
    if (!asset || asset.assigned) return;

    // Update queue assets state
    setQueueAssets(queueAssets.map(a => a.id === assetId ? { ...a, assigned: true } : a));

    // Update lanes state
    setLanes(lanes.map(l => {
      if (l.name === asset.targetLane) {
        return { ...l, units: l.units + 1, status: 'LOADING' };
      }
      return l;
    }));

    if (triggerToast) {
      triggerToast(`Asset ${asset.code} successfully assigned to ${asset.targetLane}.`);
    }
  };

  const handleRemove = (assetId) => {
    const asset = queueAssets.find(a => a.id === assetId);
    if (!asset || !asset.assigned) return;

    // Update queue assets state
    setQueueAssets(queueAssets.map(a => a.id === assetId ? { ...a, assigned: false } : a));

    // Update lanes state
    setLanes(lanes.map(l => {
      if (l.name === asset.targetLane) {
        const newUnits = Math.max(0, l.units - 1);
        return { 
          ...l, 
          units: newUnits, 
          status: newUnits === 0 ? 'READY TO LOAD' : 'LOADING' 
        };
      }
      return l;
    }));

    if (triggerToast) {
      triggerToast(`Asset ${asset.code} removed from load lane queue.`, 'error');
    }
  };

  const handleAddLoadLane = () => {
    const nextNum = lanes.length + 1;
    const newLane = {
      id: `L-${Date.now()}`,
      name: `Lane D${nextNum}`,
      units: 0,
      status: 'READY TO LOAD'
    };
    setLanes([...lanes, newLane]);
    if (triggerToast) {
      triggerToast(`New outbound load gate "${newLane.name}" added successfully.`);
    }
  };

  // Helper row selectors
  const handleLeftSelect = (id) => {
    if (selectedLeftRows.includes(id)) {
      setSelectedLeftRows(selectedLeftRows.filter(r => r !== id));
    } else {
      setSelectedLeftRows([...selectedLeftRows, id]);
    }
  };

  const handleAllLeftSelect = () => {
    if (selectedLeftRows.length === lanes.length) {
      setSelectedLeftRows([]);
    } else {
      setSelectedLeftRows(lanes.map(l => l.id));
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
    if (selectedRightRows.length === queueAssets.length) {
      setSelectedRightRows([]);
    } else {
      setSelectedRightRows(queueAssets.map(a => a.id));
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

      {/* Main Load Lane Card Component Container */}
      <div className="glass rounded-2xl p-6 border border-slate-200 bg-white text-left space-y-6 shadow-xs">
        
        {/* Card Header Section */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Load Lane Management</h3>
            <p className="text-xs text-slate-450 mt-1">Manage outbound dispatch loading queues and lane spotting.</p>
          </div>
          <button
            onClick={handleAddLoadLane}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-[#f59e0b]/45 text-[#f59e0b] hover:bg-[#f59e0b]/10 hover:border-[#f59e0b] rounded-xl transition-all cursor-pointer focus:outline-none"
          >
            <Plus className="h-4 w-4" />
            <span>Add Load Lane</span>
          </button>
        </div>

        {/* 2-Column Tables Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* COLUMN 1: ACTIVE LOAD LANES */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Active Load Lanes</h4>
              <div className="flex items-center gap-3 relative">
                
                {/* Density selector */}
                <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-[9px] font-bold">
                  {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
                    const isActive = leftDensity === mode.toLowerCase();
                    return (
                      <button
                        key={mode}
                        onClick={() => setLeftDensity(mode.toLowerCase())}
                        className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-[#FFD400] text-slate-950 font-extrabold shadow-xs' : 'text-slate-550'}`}
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

                {/* Left columns list popover dropdown */}
                {leftColsMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 text-slate-800">
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
                          checked={visibleLeftCols.laneName}
                          onChange={() => setVisibleLeftCols({ ...visibleLeftCols, laneName: !visibleLeftCols.laneName })}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Load Lane</span>
                      </label>
                      <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={visibleLeftCols.assignedAssets}
                          onChange={() => setVisibleLeftCols({ ...visibleLeftCols, assignedAssets: !visibleLeftCols.assignedAssets })}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Assigned Assets</span>
                      </label>
                      <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={visibleLeftCols.laneStatus}
                          onChange={() => setVisibleLeftCols({ ...visibleLeftCols, laneStatus: !visibleLeftCols.laneStatus })}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Lane Status</span>
                      </label>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Left Table active load lanes */}
            <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedLeftRows.length === lanes.length && lanes.length > 0}
                        onChange={handleAllLeftSelect}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                    </th>
                    {visibleLeftCols.laneName && <th className="px-6 py-4 font-extrabold">Load Lane</th>}
                    {visibleLeftCols.assignedAssets && <th className="px-6 py-4 font-extrabold">Assigned Assets</th>}
                    {visibleLeftCols.laneStatus && <th className="px-6 py-4 font-extrabold">Lane Status</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {lanes.map((row) => {
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
                        {visibleLeftCols.laneName && (
                          <td className={`font-mono text-slate-900 font-extrabold whitespace-nowrap ${getPaddingClass(leftDensity)}`}>
                            {row.name}
                          </td>
                        )}
                        {visibleLeftCols.assignedAssets && (
                          <td className={`text-[#f59e0b] font-bold whitespace-nowrap ${getPaddingClass(leftDensity)}`}>
                            {row.units} Units
                          </td>
                        )}
                        {visibleLeftCols.laneStatus && (
                          <td className={`whitespace-nowrap ${getPaddingClass(leftDensity)}`}>
                            <span className={`inline-flex px-2 py-0.5 text-[9px] font-black rounded-lg border uppercase ${
                              row.status === 'READY TO LOAD'
                                ? 'bg-slate-50 text-slate-600 border-slate-200'
                                : 'bg-amber-50 text-[#f59e0b] border-amber-200'
                            }`}>
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

          {/* COLUMN 2: QUEUEING ASSETS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Queueing Assets</h4>
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

                {/* Right columns list popover dropdown */}
                {rightColsMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 text-slate-800">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-550">Column Visibility</span>
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
                          checked={visibleRightCols.assignedLane}
                          onChange={() => setVisibleRightCols({ ...visibleRightCols, assignedLane: !visibleRightCols.assignedLane })}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Assigned Lane</span>
                      </label>
                      <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                        <input
                          type="checkbox"
                          checked={visibleRightCols.status}
                          onChange={() => setVisibleRightCols({ ...visibleRightCols, status: !visibleRightCols.status })}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Status</span>
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

            {/* Right Table queueing assets */}
            <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRightRows.length === queueAssets.length && queueAssets.length > 0}
                        onChange={handleAllRightSelect}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                    </th>
                    {visibleRightCols.assetCode && <th className="px-6 py-4 font-extrabold">Asset Code</th>}
                    {visibleRightCols.assignedLane && <th className="px-6 py-4 font-extrabold">Assigned Lane</th>}
                    {visibleRightCols.status && <th className="px-6 py-4 font-extrabold">Status</th>}
                    {visibleRightCols.actions && <th className="px-6 py-4 font-extrabold">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {queueAssets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`text-center font-bold text-slate-500 ${getPaddingClass(rightDensity)}`}>
                        NO RECORDS RESOLVED.
                      </td>
                    </tr>
                  ) : (
                    queueAssets.map((row) => {
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
                          {visibleRightCols.assignedLane && (
                            <td className={`text-slate-505 font-medium whitespace-nowrap ${getPaddingClass(rightDensity)}`}>
                              {row.assigned ? row.targetLane : 'Unassigned'}
                            </td>
                          )}
                          {visibleRightCols.status && (
                            <td className={`whitespace-nowrap ${getPaddingClass(rightDensity)}`}>
                              <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-lg border bg-slate-50 text-slate-600 border-slate-200">
                                {row.status}
                              </span>
                            </td>
                          )}
                          {visibleRightCols.actions && (
                            <td className={`whitespace-nowrap ${getPaddingClass(rightDensity)}`}>
                              <div className="flex gap-2">
                                <button
                                  disabled={row.assigned}
                                  onClick={() => handleAssign(row.id)}
                                  className={`inline-flex items-center justify-center font-bold px-4 py-2 text-xs rounded-xl border transition-all ${
                                    row.assigned
                                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                      : 'border-slate-200 hover:bg-slate-50 text-slate-700 hover:scale-[1.02] cursor-pointer'
                                  }`}
                                >
                                  Assign to Load Lane
                                </button>
                                <button
                                  disabled={!row.assigned}
                                  onClick={() => handleRemove(row.id)}
                                  className={`inline-flex items-center justify-center font-bold px-4 py-2 text-xs rounded-xl border transition-all ${
                                    !row.assigned
                                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                      : 'border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 hover:border-[#f59e0b] hover:scale-[1.02] cursor-pointer'
                                  }`}
                                >
                                  Remove from Load Lane
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
