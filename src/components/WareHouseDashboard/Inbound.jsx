import React, { useState } from 'react';
import { Settings } from 'lucide-react';

export default function Inbound({ inboundData, setInboundData, onScanInClick, onPrintLabelClick }) {
  const [density, setDensity] = useState('default'); // compact, default, relaxed
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleAllSelect = () => {
    if (selectedRows.length === inboundData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(inboundData.map(r => r.id));
    }
  };

  const getPaddingClass = () => {
    if (density === 'compact') return 'py-2 px-6';
    if (density === 'relaxed') return 'py-5.5 px-6';
    return 'py-3.5 px-6'; // default
  };

  return (
    <div className="glass rounded-2xl p-5 border border-slate-200 text-left space-y-4 bg-white shadow-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2">
        <h3 className="text-sm font-extrabold text-slate-900">Inbound Staging Queue</h3>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Density Selector */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-[9px] font-bold">
            {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
              const isActive = density === mode.toLowerCase();
              return (
                <button
                  key={mode}
                  onClick={() => setDensity(mode.toLowerCase())}
                  className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-[#FFD400] text-slate-950 font-extrabold shadow-xs' : 'text-slate-550 hover:text-slate-700'} whitespace-nowrap`}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          {/* Columns button */}
          <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-[9px] uppercase rounded-xl transition-all cursor-pointer focus:outline-none whitespace-nowrap">
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span>Columns</span>
          </button>
        </div>
      </div>

      {/* Custom Table matching design */}
      <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.length === inboundData.length && inboundData.length > 0}
                  onChange={handleAllSelect}
                  className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 font-extrabold whitespace-nowrap">Receipt ID</th>
              <th className="px-6 py-4 font-extrabold whitespace-nowrap">Staged Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {inboundData.map((row) => {
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
                  <td className={`font-mono text-slate-900 font-extrabold whitespace-nowrap ${getPaddingClass()}`}>
                    {row.id}
                  </td>
                  <td className={`whitespace-nowrap ${getPaddingClass()}`}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onScanInClick(row)}
                        className="inline-flex items-center justify-center font-bold px-4 py-2 text-xs rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        Scan In
                      </button>
                      <button
                        onClick={() => onPrintLabelClick(row)}
                        className="inline-flex items-center justify-center font-bold px-4 py-2 text-xs rounded-xl border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 hover:border-[#f59e0b] transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        Print Label
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
