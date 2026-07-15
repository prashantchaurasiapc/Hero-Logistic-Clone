import React, { useState } from 'react';
import { Settings, X, Download, Plus } from 'lucide-react';

export default function Movements({
  logisticsMode,
  setLogisticsMode,
  onBarcodeSimulatorClick,
  onManualEntryClick,
  onExportStockClick,
  triggerToast
}) {
  const [density, setDensity] = useState('compact');
  const [colsMenuOpen, setColsMenuOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // Column visibility state
  const [visibleCols, setVisibleCols] = useState({
    id: true,
    activity: true,
    staff: true,
    timestamp: true
  });

  // Mock Movement Records from Image 14
  const [records, setRecords] = useState([
    {
      id: 'H-1',
      activity: 'Stowed to Bay 3',
      staff: 'Adam K. (Yard Manager)',
      timestamp: '06/26/2026 11:20 AM'
    },
    {
      id: 'H-2',
      activity: 'Registered independent asset',
      staff: 'System',
      timestamp: '06/26/2026 09:15 AM'
    },
    {
      id: 'H-3',
      activity: 'Inwarded to Aisle 4 - Bin C',
      staff: 'Sarah R. (Clerk)',
      timestamp: '06/26/2026 10:45 AM'
    }
  ]);

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleAllSelect = () => {
    if (selectedRows.length === records.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(records.map(r => r.id));
    }
  };

  const getPaddingClass = (mode) => {
    if (mode === 'compact') return 'py-1.5 px-6';
    if (mode === 'relaxed') return 'py-5 px-6';
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
          {/* Logistics Switcher */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => setLogisticsMode('car_carrying')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'car_carrying' ? 'bg-[#FFD400] text-slate-955 font-extrabold shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Car Carrying Yard
            </button>
            <button
              onClick={() => setLogisticsMode('general_freight')}
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

      {/* Movements & Custody Ledger Card */}
      <div className="glass rounded-2xl p-6 border border-slate-200 bg-white text-left space-y-6 shadow-xs">
        
        {/* Title row & tools */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Inventory Movements & Custody Ledger</h3>
          
          <div className="flex items-center gap-3 relative self-end sm:self-auto">
            {/* Density switch */}
            <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-[9px] font-bold">
              {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
                const isActive = density === mode.toLowerCase();
                return (
                  <button
                    key={mode}
                    onClick={() => setDensity(mode.toLowerCase())}
                    className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-[#FFD400] text-slate-950 font-extrabold shadow-xs' : 'text-slate-550'}`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>

            {/* Columns configure */}
            <button
              onClick={() => setColsMenuOpen(!colsMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-655 font-bold text-[9px] uppercase rounded-xl cursor-pointer focus:outline-none"
            >
              <Settings className="h-3.5 w-3.5 text-slate-400" />
              <span>Columns</span>
            </button>

            {/* Column visibility list dropdown */}
            {colsMenuOpen && (
              <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 text-slate-800 animate-fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-550">Column Visibility</span>
                  <button onClick={() => setColsMenuOpen(false)} className="text-slate-450">
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                    <input
                      type="checkbox"
                      checked={visibleCols.id}
                      onChange={() => setVisibleCols({ ...visibleCols, id: !visibleCols.id })}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <span>ID</span>
                  </label>
                  <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                    <input
                      type="checkbox"
                      checked={visibleCols.activity}
                      onChange={() => setVisibleCols({ ...visibleCols, activity: !visibleCols.activity })}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <span>Activity Logged</span>
                  </label>
                  <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                    <input
                      type="checkbox"
                      checked={visibleCols.staff}
                      onChange={() => setVisibleCols({ ...visibleCols, staff: !visibleCols.staff })}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <span>Staff Member</span>
                  </label>
                  <label className="flex items-center gap-2.5 py-1 px-1.5 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-semibold select-none">
                    <input
                      type="checkbox"
                      checked={visibleCols.timestamp}
                      onChange={() => setVisibleCols({ ...visibleCols, timestamp: !visibleCols.timestamp })}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <span>Timestamp</span>
                  </label>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === records.length && records.length > 0}
                    onChange={handleAllSelect}
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                </th>
                {visibleCols.id && <th className="px-6 py-4 font-extrabold w-20">ID</th>}
                {visibleCols.activity && <th className="px-6 py-4 font-extrabold">Activity Logged</th>}
                {visibleCols.staff && <th className="px-6 py-4 font-extrabold">Staff Member</th>}
                {visibleCols.timestamp && <th className="px-6 py-4 font-extrabold">Timestamp</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {records.map((row) => {
                const isChecked = selectedRows.includes(row.id);
                return (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleRowSelect(row.id)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                    </td>
                    {visibleCols.id && (
                      <td className={`font-mono text-slate-900 font-extrabold whitespace-nowrap ${getPaddingClass(density)}`}>
                        {row.id}
                      </td>
                    )}
                    {visibleCols.activity && (
                      <td className={`text-slate-655 font-semibold whitespace-nowrap ${getPaddingClass(density)}`}>
                        {row.activity}
                      </td>
                    )}
                    {visibleCols.staff && (
                      <td className={`text-slate-505 font-medium whitespace-nowrap ${getPaddingClass(density)}`}>
                        {row.staff}
                      </td>
                    )}
                    {visibleCols.timestamp && (
                      <td className={`font-mono text-slate-500 whitespace-nowrap ${getPaddingClass(density)}`}>
                        {row.timestamp}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
