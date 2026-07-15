import React, { useState } from 'react';
import { Shield, Truck, AlertTriangle, Heart, X, Phone, MessageSquare, Mic, Compass, Upload, CheckCircle2, AlertCircle, Settings, Check, Download, CheckSquare, Square } from 'lucide-react';

export default function AddExpense() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isOnline, setIsOnline] = useState(true);
  const [activeSosAlert, setActiveSosAlert] = useState(null);

  // Form states
  const [amount, setAmount] = useState('150');
  const [category, setCategory] = useState('Diesel Fuel purchase');
  const [receiptUploaded, setReceiptUploaded] = useState(false);

  // SOS states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  // History states
  const [viewMode, setViewMode] = useState('DEFAULT'); // COMPACT, DEFAULT, RELAXED
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    category: true,
    amount: true,
    state: true
  });

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleUploadReceipt = () => {
    setReceiptUploaded(true);
    triggerToast('Receipt file uploaded.', 'success');
  };

  const handleAddExpense = () => {
    triggerToast('Expense logged successfully.', 'success');
  };

  const handleAiAction = (action) => {
    triggerToast(`AI Result ${action}.`, 'success');
  };

  const mockData = [
    { id: 1, category: 'Fuel', amount: '$320.00', state: 'APPROVED', stateColor: 'bg-gray-100 text-gray-500 font-bold border border-gray-200' },
    { id: 2, category: 'Tolls', amount: '$42.50', state: 'PENDING', stateColor: 'bg-[#FFFBEB] text-[#F59E0B] font-bold border border-[#FEF08A]' }
  ];

  const getMockData = () => mockData;

  const toggleRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen text-left flex flex-col space-y-6 relative pb-28">
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed bottom-24 right-6 z-[120] px-4 py-3 rounded-xl text-sm font-bold shadow-lg flex items-center gap-3 max-w-sm animate-fade-in border ${
          toastType === 'error' 
            ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#334155]' 
            : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
        }`}>
          {toastType === 'error' ? (
            <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" strokeWidth={2.5} />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" strokeWidth={2.5} />
          )}
          <span>{toastMsg}</span>
          <button 
            onClick={() => setToastMsg('')} 
            className={`ml-auto cursor-pointer pl-2 ${toastType === 'error' ? 'text-gray-400 hover:text-gray-600' : 'text-[#059669] hover:text-[#047857]'}`}
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Connection status toggle */}
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="w-full flex justify-between items-center p-3 bg-white border border-gray-150 rounded-2xl shadow-sm">
          <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500 rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            Connection Status:
          </span>
          <button
            onClick={() => {
              setIsOnline(prev => !prev);
              triggerToast(isOnline ? 'Connection switched to Offline Mode.' : 'Connection restored to Online Mode.');
            }}
            className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold border cursor-pointer transition-all ${
              isOnline
                ? 'bg-[#E6F4EA] border-[#CEEAD6] text-[#137333]'
                : 'bg-[#FFFBEB] border-[#000000] border-2 text-[#D97706]'
            }`}
          >
            <span>{isOnline ? 'Online Mode' : 'Offline Mode'}</span>
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[9px] ${isOnline ? 'bg-emerald-500' : 'bg-[#D97706]'}`}>
              {isOnline ? '🌐' : '−'}
            </span>
          </button>
        </div>

        {/* Offline Banner */}
        {!isOnline && (
          <div className="w-full bg-[#FFFBEB] border border-[#FDE047] px-4 py-3 rounded-2xl flex items-center text-[#D97706] text-xs font-bold shadow-sm">
            <AlertTriangle className="w-4 h-4 mr-2 shrink-0" strokeWidth={2.5} />
            <span>Offline Active</span>
            <span className="mx-2 text-[#D97706] opacity-50">|</span>
            <span>0 items queued</span>
          </div>
        )}

        {/* SOS ACTIVE Banner */}
        {activeSosAlert && (
          <div className="w-full bg-[#FEE2E2] border border-[#FCA5A5] px-4 py-2 rounded-2xl flex items-center justify-between text-[#EF4444] text-xs font-bold shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" strokeWidth={2.5} />
              <span>🚨 SOS ACTIVE: {activeSosAlert}</span>
            </div>
            <button
              onClick={() => setActiveSosAlert(null)}
              className="bg-[#EF4444] text-black font-extrabold px-3 py-1 rounded-full text-xs hover:bg-red-650 cursor-pointer shadow-sm"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 flex justify-between items-center shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">Driver Portal</h1>
            <span className="text-xl font-bold text-gray-400">•</span>
            <span className="text-xl font-black text-gray-800">add expense</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD &amp; logistics operations controls.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#FFFBEB] flex items-center justify-center text-[#D97706] shrink-0">
          <Compass className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
        {/* Main Form Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm text-left w-full h-fit">
          <h2 className="text-lg font-black text-[#0F172A] leading-tight mb-6">Log Trip Expense</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">
                EXPENSE AMOUNT SPENT (USD)
              </label>
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">
                EXPENSE CATEGORY
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
              >
                <option>Diesel Fuel purchase</option>
                <option>Tolls</option>
                <option>Maintenance</option>
                <option>Meals</option>
              </select>
            </div>

            <div 
              onClick={handleUploadReceipt}
              className={`border border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${receiptUploaded ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <Upload className="w-5 h-5 text-gray-500 mb-2" strokeWidth={2} />
              <span className="text-xs font-bold text-gray-500">
                {receiptUploaded ? 'Receipt Uploaded ✓' : 'Upload Receipt Image'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleAddExpense}
                className="w-full bg-[#FFB000] text-black font-black text-sm py-3.5 px-4 rounded-xl hover:bg-[#F59E0B] transition-all shadow-sm border border-[#FFB000] cursor-pointer"
              >
                Add Expense
              </button>
              <button 
                onClick={handleUploadReceipt}
                className="w-full bg-white text-[#D97706] font-bold text-sm py-3.5 px-4 rounded-xl hover:bg-yellow-50 transition-all border border-amber-200 cursor-pointer"
              >
                Upload Receipt
              </button>
            </div>

            {/* AI Receipt Reader Extract */}
            <div className="mt-6 border border-gray-200 rounded-2xl p-5">
              <h3 className="text-[10px] font-black text-[#D97706] uppercase tracking-widest mb-1">AI RECEIPT READER EXTRACT</h3>
              <p className="text-sm font-black text-gray-900">Expense detected: $420.50</p>
              <p className="text-xs text-gray-500 font-mono mb-4">Source: Pilot Travel Center</p>
              
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="text-gray-600">Review AI Result</span>
                <button onClick={() => handleAiAction('Confirmed')} className="bg-[#FFD400] text-black px-4 py-1.5 rounded hover:bg-yellow-400 transition-colors cursor-pointer">
                  Confirm
                </button>
                <button onClick={() => handleAiAction('Editing')} className="text-gray-600 hover:text-black transition-colors cursor-pointer">
                  Edit
                </button>
                <button onClick={() => handleAiAction('Rejected')} className="bg-red-50 text-red-500 px-4 py-1.5 rounded hover:bg-red-100 transition-colors cursor-pointer">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="w-full h-fit flex flex-col space-y-4">
          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest pl-2">LOGGED EXPENSES HISTORY</h3>
          
          {selectedRows.length > 0 && (
            <div className="bg-[#FFFBEB] border border-[#FEF08A] rounded-2xl p-2 px-4 flex items-center justify-between w-max gap-4 shadow-sm">
              <span className="text-xs font-black text-[#D97706] tracking-widest uppercase">{selectedRows.length} SELECTED</span>
              <button 
                onClick={() => triggerToast('Exporting to CSV...')}
                className="flex items-center gap-1.5 text-[#D97706] text-xs font-black bg-white px-3 py-1.5 rounded-xl border border-[#FDE047] hover:bg-yellow-50 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" /> CSV Export
              </button>
            </div>
          )}
          
          <div className="flex justify-between items-center bg-white border border-gray-150 p-2 rounded-2xl shadow-sm">
            <div className="flex bg-gray-50 rounded-xl p-1">
              {['COMPACT', 'DEFAULT', 'RELAXED'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    viewMode === mode 
                      ? 'bg-[#FFD400] text-black shadow-sm' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setColumnsOpen(!columnsOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${columnsOpen ? 'border-gray-800 text-gray-800 bg-gray-50' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                <Settings className="w-4 h-4" />
                COLUMNS
              </button>
              
              {columnsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10 p-4 flex flex-col gap-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">COLUMN VISIBILITY</span>
                  {[
                    { key: 'category', label: 'Category' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'state', label: 'State' }
                  ].map(col => (
                    <label key={col.key} className="flex items-center gap-3 text-sm font-bold text-gray-600 cursor-pointer">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${visibleColumns[col.key] ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {visibleColumns[col.key] && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </div>
                      <input 
                        type="checkbox" 
                        checked={visibleColumns[col.key]} 
                        onChange={() => toggleColumn(col.key)} 
                        className="hidden"
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-4 w-12 text-center">
                    <button 
                      onClick={() => setSelectedRows(selectedRows.length === getMockData().length ? [] : getMockData().map(d => d.id))}
                      className="cursor-pointer"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedRows.length === getMockData().length ? 'border-[#D97706] text-[#D97706]' : 'border-gray-400'}`}>
                        {selectedRows.length === getMockData().length && <Check className="w-3 h-3" strokeWidth={4} />}
                      </div>
                    </button>
                  </th>
                  {visibleColumns.category && <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">CATEGORY</th>}
                  {visibleColumns.amount && <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">AMOUNT</th>}
                  {visibleColumns.state && <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">STATE</th>}
                </tr>
              </thead>
              <tbody>
                {getMockData().map((row, index) => {
                  const isSelected = selectedRows.includes(row.id);
                  return (
                  <tr key={index} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                    viewMode === 'COMPACT' ? 'text-xs' : viewMode === 'RELAXED' ? 'text-base' : 'text-sm'
                  } ${isSelected ? 'bg-[#FFFDF4]' : ''}`}>
                    <td className={`p-4 text-center ${viewMode === 'COMPACT' ? 'py-2' : viewMode === 'RELAXED' ? 'py-6' : 'py-5'}`}>
                      <button 
                        onClick={() => toggleRow(row.id)}
                        className="cursor-pointer"
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'border-[#D97706] text-[#D97706]' : 'border-gray-400'}`}>
                           {isSelected && <Check className="w-3 h-3" strokeWidth={4} />}
                        </div>
                      </button>
                    </td>
                    {visibleColumns.category && (
                      <td className={`p-4 font-bold text-gray-900 ${viewMode === 'COMPACT' ? 'py-2' : viewMode === 'RELAXED' ? 'py-6' : 'py-5'}`}>
                        {row.category}
                        {row.date && <div className="text-xs text-gray-400 font-medium mt-1">{row.date}</div>}
                      </td>
                    )}
                    {visibleColumns.amount && (
                      <td className={`p-4 font-black text-gray-500 ${viewMode === 'COMPACT' ? 'py-2' : viewMode === 'RELAXED' ? 'py-6' : 'py-5'}`}>
                        {row.amount}
                      </td>
                    )}
                    {visibleColumns.state && (
                      <td className={`p-4 ${viewMode === 'COMPACT' ? 'py-2' : viewMode === 'RELAXED' ? 'py-6' : 'py-5'}`}>
                        <span className={`px-3 py-1 rounded-full text-[10px] tracking-wider uppercase ${row.stateColor}`}>
                          {row.state}
                        </span>
                      </td>
                    )}
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-[100]">
        <button
          onClick={() => setSosModalOpen(true)}
          className="w-12 h-12 bg-white border-2 border-red-200 hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold text-xs shadow-lg cursor-pointer transition-all"
        >
          SOS
        </button>
        <button
          onClick={() => setHotlineOpen(true)}
          className="w-12 h-12 bg-[#FFD400] hover:bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      {/* SOS EMERGENCY PANEL MODAL */}
      {sosModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-xl text-left">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-50">
              <h2 className="text-base font-bold text-gray-900">Emergency Dispatch SOS Panel</h2>
              <button onClick={() => setSosModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"><X size={18} /></button>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Triggering an emergency alerts the dispatch operations center immediately and logs active tracking.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Shield className="w-5 h-5 text-red-500" />, label: 'Panic Button', color: 'bg-red-50/70 border-red-100 text-red-500', msg: 'Panic Alert dispatched!' },
                { icon: <Truck className="w-5 h-5 text-amber-500" />, label: 'Breakdown', color: 'bg-[#FFFBEB] border-amber-200 text-[#D97706]', msg: 'Breakdown Alert dispatched!' },
                { icon: <AlertTriangle className="w-5 h-5 text-red-500" />, label: 'Accident', color: 'bg-red-50/70 border-red-100 text-red-500', msg: 'Accident Alert dispatched!' },
                { icon: <Heart className="w-5 h-5 text-red-500" />, label: 'Medical', color: 'bg-red-50/70 border-red-100 text-red-500', msg: 'Medical Emergency Alert dispatched!' },
              ].map(({ icon, label, color, msg }) => (
                <button
                  key={label}
                  onClick={() => {
                    setActiveSosAlert(msg);
                    triggerToast(`SOS ACTIVE: ${msg}`);
                    setSosModalOpen(false);
                  }}
                  className={`p-5 border rounded-2xl hover:opacity-90 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer ${color}`}
                >
                  {icon}
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-50 space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-800">
                <span>Share Live GPS Tracking</span>
                <input type="checkbox" checked={shareGps} onChange={e => setShareGps(e.target.checked)} className="rounded border-gray-300 text-blue-600 w-4 h-4 cursor-pointer" />
              </div>
              <div className="flex justify-between items-center text-xs text-gray-800">
                <span>Auto-Notify Dispatch Center</span>
                <input type="checkbox" checked={autoNotify} onChange={e => setAutoNotify(e.target.checked)} className="rounded border-gray-300 text-blue-600 w-4 h-4 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOTLINE SHORTCUTS PANEL */}
      {hotlineOpen && (
        <div className="fixed inset-0 z-[110]" onClick={() => setHotlineOpen(false)}>
          <div
            className="absolute bottom-6 right-6 flex flex-col items-end gap-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xl w-52 text-left space-y-3">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pb-2 border-b border-gray-100">HOTLINE SHORTCUTS</span>
              <div className="space-y-3 text-sm text-gray-700">
                {[
                  { icon: <Phone className="w-4 h-4 text-gray-400 shrink-0" />, label: 'Call Dispatch', msg: 'Dialing dispatcher hotline...' },
                  { icon: <MessageSquare className="w-4 h-4 text-gray-400 shrink-0" />, label: 'Message Dispatch', msg: 'Opening dispatch message console...' },
                  { icon: <Mic className="w-4 h-4 text-gray-400 shrink-0" />, label: 'Voice Note', msg: 'Voice note recorder active.' },
                  { icon: <span className="w-4 h-4 text-gray-400 shrink-0 flex items-center justify-center text-xs">🎙</span>, label: 'Voice-to-Text', msg: 'Speech to text active.' },
                ].map(({ icon, label, msg }) => (
                  <button
                    key={label}
                    onClick={() => { triggerToast(msg); setHotlineOpen(false); }}
                    className="w-full text-left hover:text-black transition-colors flex items-center gap-3"
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setHotlineOpen(false)}
              className="w-12 h-12 bg-[#FFD400] hover:bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all shrink-0"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
