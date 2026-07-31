import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Settings, RotateCcw, Check, Search } from 'lucide-react';
import './WarehouseDashboard.css';

const INITIAL_OUTBOUND_QUEUE = [
  { id: 'OUT-4011', transportCarrier: 'Linfox Transport', cargoSpecs: '4x Pallets, 1,200kg', dockGateLane: 'Gate B3', time: '10:30 AM' },
  { id: 'OUT-4012', transportCarrier: 'Toll Express', cargoSpecs: '8x Pallets, 2,400kg', dockGateLane: 'Gate B1', time: '11:15 AM' },
  { id: 'OUT-4013', transportCarrier: 'Mainfreight Australia', cargoSpecs: '2x Crates, 850kg', dockGateLane: 'Gate A2', time: '11:45 AM' },
  { id: 'OUT-4014', transportCarrier: 'Krueger Logistics', cargoSpecs: '12x Pallets, 4,100kg', dockGateLane: 'Gate C4', time: '12:10 PM' }
];

const INITIAL_DISPATCHED_HISTORY = [
  { id: 'OUT-4009', transportCarrier: 'CEVA Logistics', cargoSpecs: '6x Pallets, 1,800kg', dockGateLane: 'Gate A1', dispatchedAt: '09:45 AM' },
  { id: 'OUT-4010', transportCarrier: 'DHL Freight', cargoSpecs: '10x Pallets, 3,200kg', dockGateLane: 'Gate B2', dispatchedAt: '10:15 AM' }
];

const WarehouseOutbound = () => {
  const location = useLocation();
  const isYard = location.pathname.startsWith('/yard');
  const [barcodeModal, setBarcodeModal] = useState(false);

  // Scanner Simulator state
  const [scanMode, setScanMode] = useState('Scan Outward Dispatching');
  const [scanInput, setScanInput] = useState('');

  // Table density, selection & data
  const [density, setDensity] = useState('default'); // compact, default, relaxed
  const [selectedRows, setSelectedRows] = useState([]);
  const [outboundData, setOutboundData] = useState(INITIAL_OUTBOUND_QUEUE);
  const [dispatchedHistory, setDispatchedHistory] = useState(INITIAL_DISPATCHED_HISTORY);
  
  // Toast & Last Action state for Undo
  const [toast, setToast] = useState(null); // { message, lastDispatchedItem }
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'history'
  const [searchQuery, setSearchQuery] = useState('');

  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    outboundId: true,
    transportCarrier: true,
    cargoSpecs: true,
    dockGateLane: true,
    loadingActions: true
  });

  const filteredOutbound = outboundData.filter(row => {
    const q = searchQuery.toLowerCase().trim();
    return !q || 
      row.id.toLowerCase().includes(q) || 
      (row.transportCarrier && row.transportCarrier.toLowerCase().includes(q)) ||
      (row.cargoSpecs && row.cargoSpecs.toLowerCase().includes(q)) ||
      (row.dockGateLane && row.dockGateLane.toLowerCase().includes(q));
  });

  const filteredHistory = dispatchedHistory.filter(row => {
    const q = searchQuery.toLowerCase().trim();
    return !q || 
      row.id.toLowerCase().includes(q) || 
      (row.transportCarrier && row.transportCarrier.toLowerCase().includes(q)) ||
      (row.cargoSpecs && row.cargoSpecs.toLowerCase().includes(q)) ||
      (row.dockGateLane && row.dockGateLane.toLowerCase().includes(q));
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  // Perform Scan Out (Dispatch Item)
  const handleConfirmScanOut = (itemToScan) => {
    const targetItem = itemToScan || outboundData.find(item => item.id.toLowerCase() === scanInput.trim().toLowerCase());
    
    if (!targetItem) {
      alert(`No active outbound item found matching "${scanInput}"`);
      return;
    }

    const dispatchedItem = {
      ...targetItem,
      dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Remove from active queue, add to dispatched history
    setOutboundData(prev => prev.filter(item => item.id !== targetItem.id));
    setDispatchedHistory(prev => [dispatchedItem, ...prev]);
    setSelectedRows(prev => prev.filter(id => id !== targetItem.id));

    setScanInput('');
    setBarcodeModal(false);

    // Show Toast with Undo Trigger
    setToast({
      message: `Outbound ${targetItem.id} scanned out & dispatched!`,
      lastDispatchedItem: dispatchedItem
    });
  };

  // UNDO DISPATCH FUNCTION (Restores item back to Outbound Queue)
  const handleUndoDispatch = (itemToRestore) => {
    if (!itemToRestore) return;

    // Remove from history, push back to queue
    setDispatchedHistory(prev => prev.filter(item => item.id !== itemToRestore.id));
    setOutboundData(prev => [itemToRestore, ...prev]);
    setToast(null);

    setToast({
      message: `↩️ Undo Successful! ${itemToRestore.id} restored back to Outbound Queue.`,
      isSuccess: true
    });
  };

  const handleScanOutRow = (row) => {
    setScanInput(row.id);
    setBarcodeModal(true);
  };

  const handleReprintLabel = (rowId) => {
    alert(`Label reprinted successfully for ${rowId}`);
  };

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleAllSelect = () => {
    if (selectedRows.length === outboundData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(outboundData.map(r => r.id));
    }
  };

  const getPaddingClass = () => {
    if (density === 'compact') return 'py-2 px-6';
    if (density === 'relaxed') return 'py-5 px-6';
    return 'py-3.5 px-6'; // default
  };

  return (
    <div className="warehouse-dashboard relative">
      {/* Toast Notification with UNDO Action Button */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/60 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
          {toast.lastDispatchedItem && (
            <button
              onClick={() => handleUndoDispatch(toast.lastDispatchedItem)}
              className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-black text-[11px] px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-xs ml-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> UNDO DISPATCH
            </button>
          )}
        </div>
      )}

      {/* Header Section */}
      <div className="warehouse-header flex justify-between items-center pb-2">
        <div className="warehouse-header-titles">
          <h1 className="text-2xl font-black text-slate-900">{isYard ? 'Yard Outbound Dispatch' : 'Outbound Dispatch'}</h1>
        </div>
        
        {/* Recent Undo Quick Control */}
        {dispatchedHistory.length > 0 && (
          <button
            onClick={() => handleUndoDispatch(dispatchedHistory[0])}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer bg-white flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" /> Undo Last Outbound ({dispatchedHistory[0].id})
          </button>
        )}
      </div>

      {/* Outbound Loading Queue Table Card */}
      <div className="warehouse-bottom-section" style={{ textAlign: 'left' }}>
        
        {/* Navigation Tabs (Loading Queue vs Dispatched History) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                activeTab === 'queue'
                  ? 'bg-slate-900 text-[#FFD400] shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Outbound Loading Queue ({outboundData.length})
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-slate-900 text-[#FFD400] shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Dispatched History & Undo ({dispatchedHistory.length})
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Search Bar */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Quick search outbound ID, carrier, gate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
              />
            </div>

            {/* Density Selector */}
            <div className="wh-segmented-control" style={{ padding: '2px', borderRadius: '8px' }}>
              {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
                const isActive = density === mode.toLowerCase();
                return (
                  <button
                    key={mode}
                    onClick={() => setDensity(mode.toLowerCase())}
                    className="segmented-btn"
                    style={{
                      padding: '5px 12px',
                      fontSize: '9px',
                      borderRadius: '6px',
                      backgroundColor: isActive ? '#ffd400' : 'transparent',
                      color: isActive ? '#0f172a' : '#64748b',
                      border: isActive ? '1px solid #000' : '1px solid transparent',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>

            {/* Columns button */}
            <div style={{ position: 'relative' }}>
              <button 
                className="btn btn-white-wh" 
                style={{
                  padding: '6px 12px',
                  fontSize: '10px',
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  border: columnsMenuOpen ? '1.5px solid #000000' : '1px solid #e2e8f0',
                  color: columnsMenuOpen ? '#0f172a' : '#64748b',
                  backgroundColor: '#ffffff',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => setColumnsMenuOpen(!columnsMenuOpen)}
              >
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                <span>Columns</span>
              </button>

              {columnsMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  padding: '16px',
                  zIndex: 50,
                  minWidth: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Column Visibility
                  </div>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.outboundId}
                      onChange={() => toggleColumn('outboundId')}
                      style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }}
                    />
                    <span>Outbound ID</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.transportCarrier}
                      onChange={() => toggleColumn('transportCarrier')}
                      style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }}
                    />
                    <span>Transport Carrier</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.cargoSpecs}
                      onChange={() => toggleColumn('cargoSpecs')}
                      style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }}
                    />
                    <span>Cargo Specs</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.dockGateLane}
                      onChange={() => toggleColumn('dockGateLane')}
                      style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }}
                    />
                    <span>Dock Gate Lane</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TAB 1: OUTBOUND LOADING QUEUE */}
        {activeTab === 'queue' && (
          <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === outboundData.length && outboundData.length > 0}
                      onChange={handleAllSelect}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 cursor-pointer"
                    />
                  </th>
                  {visibleColumns.outboundId && <th className="px-6 py-4 font-extrabold">Outbound ID</th>}
                  {visibleColumns.transportCarrier && <th className="px-6 py-4 font-extrabold">Transport Carrier</th>}
                  {visibleColumns.cargoSpecs && <th className="px-6 py-4 font-extrabold">Outbound Cargo Specs</th>}
                  {visibleColumns.dockGateLane && <th className="px-6 py-4 font-extrabold">Dock Gate Lane</th>}
                  {visibleColumns.loadingActions && <th className="px-6 py-4 font-extrabold">Loading Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredOutbound.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 font-bold bg-white">
                      {searchQuery ? `No outbound items match "${searchQuery}"` : 'All outbound items dispatched! Switch to "Dispatched History" to Undo any dispatch.'}
                    </td>
                  </tr>
                ) : (
                  filteredOutbound.map((row) => {
                    const isChecked = selectedRows.includes(row.id);
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 text-center whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleRowSelect(row.id)}
                            className="w-4 h-4 rounded border-slate-300 text-amber-500 cursor-pointer"
                          />
                        </td>
                        {visibleColumns.outboundId && (
                          <td className={`font-mono text-slate-900 font-extrabold whitespace-nowrap ${getPaddingClass()}`}>
                            {row.id}
                          </td>
                        )}
                        {visibleColumns.transportCarrier && (
                          <td className={`whitespace-nowrap font-semibold text-slate-600 ${getPaddingClass()}`}>
                            {row.transportCarrier}
                          </td>
                        )}
                        {visibleColumns.cargoSpecs && (
                          <td className={`whitespace-nowrap font-semibold text-slate-600 ${getPaddingClass()}`}>
                            {row.cargoSpecs}
                          </td>
                        )}
                        {visibleColumns.dockGateLane && (
                          <td className={`whitespace-nowrap font-extrabold text-amber-600 ${getPaddingClass()}`}>
                            {row.dockGateLane}
                          </td>
                        )}
                        {visibleColumns.loadingActions && (
                          <td className={`whitespace-nowrap ${getPaddingClass()}`}>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleScanOutRow(row)}
                                className="btn btn-white-wh font-bold px-3 py-1.5 text-xs rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                              >
                                Scan Out
                              </button>
                              <button
                                onClick={() => handleReprintLabel(row.id)}
                                className="btn btn-white-orange-wh font-bold px-3 py-1.5 text-xs rounded-xl border border-amber-300 text-amber-600 hover:bg-amber-50 cursor-pointer"
                              >
                                Reprint Label
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
        )}

        {/* TAB 2: DISPATCHED HISTORY & UNDO ACTIONS */}
        {activeTab === 'history' && (
          <div className="overflow-x-auto w-full border border-slate-200 rounded-2xl bg-white space-y-3">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-4 font-extrabold">Dispatched ID</th>
                  <th className="px-6 py-4 font-extrabold">Transport Carrier</th>
                  <th className="px-6 py-4 font-extrabold">Cargo Specs</th>
                  <th className="px-6 py-4 font-extrabold">Gate Lane</th>
                  <th className="px-6 py-4 font-extrabold">Dispatched At</th>
                  <th className="px-6 py-4 font-extrabold text-center">Undo Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 font-bold bg-white">
                      {searchQuery ? `No dispatched history matches "${searchQuery}"` : 'No dispatched history logs recorded yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="font-mono text-slate-900 font-extrabold px-6 py-4 whitespace-nowrap">
                        {row.id}
                      </td>
                      <td className="font-semibold text-slate-600 px-6 py-4 whitespace-nowrap">
                        {row.transportCarrier}
                      </td>
                      <td className="font-semibold text-slate-600 px-6 py-4 whitespace-nowrap">
                        {row.cargoSpecs}
                      </td>
                      <td className="font-extrabold text-slate-500 px-6 py-4 whitespace-nowrap">
                        {row.dockGateLane}
                      </td>
                      <td className="font-semibold text-emerald-600 px-6 py-4 whitespace-nowrap">
                        {row.dispatchedAt || 'Today'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleUndoDispatch(row)}
                          className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-black px-4 py-2 text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Undo Scan Out
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Barcode/QR Scanner Simulator Modal */}
      {barcodeModal && (
        <div className="wh-modal-overlay" onClick={() => setBarcodeModal(false)}>
          <div className="wh-modal" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h2>Barcode/QR Scanner Simulator</h2>
              <button className="wh-modal-close" onClick={() => setBarcodeModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="wh-modal-body space-y-4">
              <div>
                <label className="wh-label">SCANNER MODE ACTION</label>
                <select
                  value={scanMode}
                  onChange={e => setScanMode(e.target.value)}
                  className="wh-select"
                >
                  <option>Scan Outward Dispatching</option>
                  <option>Scan Inward Stowing</option>
                  <option>Scan by 1D Barcode tag</option>
                  <option>Scan by 2D QR Code tag</option>
                </select>
              </div>

              <div>
                <label className="wh-label">SCAN DECODER INPUT</label>
                <input
                  type="text"
                  placeholder="Scan Barcode (e.g. OUT-4011)"
                  value={scanInput}
                  onChange={e => setScanInput(e.target.value)}
                  className="wh-input"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  className="wh-btn-submit bg-slate-900 text-white font-bold"
                  onClick={() => handleConfirmScanOut()}
                >
                  Confirm Scan Out & Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseOutbound;
