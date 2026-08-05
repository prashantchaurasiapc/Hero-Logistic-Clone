import React, { useState } from 'react';
import { Shield, Truck, AlertTriangle, Heart, X, Phone, MessageSquare, Mic, Compass, CheckCircle2, AlertCircle, Settings, Check, Upload, Download, Wrench } from 'lucide-react';

export default function MaintenanceRequest() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isOnline, setIsOnline] = useState(true);
  const [activeSosAlert, setActiveSosAlert] = useState(null);

  // Form states
  const [issueDetails, setIssueDetails] = useState('');
  const [severity, setSeverity] = useState('Minor - Driveable issue');
  const [photoAttached, setPhotoAttached] = useState(false);

  // SOS states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  // History states
  const [viewMode, setViewMode] = useState('DEFAULT');
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    reportedIssue: true,
    severity: true,
    status: true
  });

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handlePhotoUpload = () => {
    setPhotoAttached(true);
    triggerToast('Malfunction photo attached.', 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!issueDetails.trim()) {
      triggerToast('Please describe the issue.', 'error');
      return;
    }
    triggerToast('Maintenance log successfully submitted.', 'success');
    setIssueDetails('');
    setPhotoAttached(false);
  };

  const mockData = [
    { id: 1, reportedIssue: 'Slight brake squeal on front axles.', severity: 'Minor', severityColor: 'bg-gray-100 text-[#64748B] border border-gray-200', status: 'SCHEDULED', statusColor: 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE047]' }
  ];

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
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 bg-white border border-gray-150 rounded-2xl shadow-sm">
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
            className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold border cursor-pointer transition-all w-full sm:w-auto justify-center ${
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

      <div className="w-full space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-150 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex justify-between items-center shadow-sm gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight leading-none">Driver Portal</h1>
              <span className="text-lg sm:text-xl font-bold text-[#0F172A]">•</span>
              <span className="text-lg sm:text-2xl font-black text-[#0F172A]">maintenance</span>
            </div>
            <p className="text-[#64748B] text-xs sm:text-sm font-medium mt-1">ELD &amp; logistics operations controls.</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFFBEB] flex items-center justify-center text-[#D97706] shrink-0">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Top Banner */}
        <div className="bg-[#FFFBEB] border border-[#FEF08A] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-5 h-5 text-[#D97706]" strokeWidth={2.5} />
            <h2 className="text-base font-black text-[#0F172A]">Maintenance Request</h2>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#64748B]">Report vehicle malfunctions directly to fleet garage desks.</p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col space-y-6">
          <h3 className="text-[11px] font-black text-[#64748B] uppercase tracking-widest">REPORT VEHICLE DEFECT</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-[#64748B] uppercase tracking-widest mb-2">ISSUE / MALFUNCTION DETAILS</label>
              <input
                type="text"
                placeholder="e.g. Engine oil leak or brake noise..."
                value={issueDetails}
                onChange={(e) => setIssueDetails(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent p-3.5 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-[#64748B] uppercase tracking-widest mb-2">SAFETY SEVERITY PRIORITY</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent p-3.5 outline-none appearance-none cursor-pointer"
              >
                <option value="Minor - Driveable issue">Minor - Driveable issue</option>
                <option value="Moderate - Needs repair soon">Moderate - Needs repair soon</option>
                <option value="Critical - Out of Service (Red tag)">Critical - Out of Service (Red tag)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handlePhotoUpload}
              className="w-full bg-white border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Upload className="w-6 h-6 text-[#64748B]" strokeWidth={2} />
              <span className="text-sm font-bold text-[#64748B]">
                {photoAttached ? 'Photo Attached ✓' : 'Attach Malfunction Photos'}
              </span>
            </button>

            <button
              type="submit"
              className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-black font-black py-4 px-6 rounded-2xl transition-all shadow-md active:scale-[0.98]"
            >
              Submit Maintenance Log
            </button>
          </form>
        </div>

        {/* History Section */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[11px] font-black text-[#64748B] uppercase tracking-widest pl-2">DEFECT LOGS HISTORY</h3>

          {selectedRows.length > 0 && (
            <div className="bg-[#FFFBEB] border border-[#FEF08A] rounded-2xl p-2 px-4 flex items-center justify-between w-full sm:w-max gap-4 shadow-sm mb-2">
              <span className="text-xs font-black text-[#D97706] tracking-widest uppercase">{selectedRows.length} SELECTED</span>
              <button
                onClick={() => triggerToast('Exporting to CSV...')}
                className="flex items-center gap-1.5 text-[#D97706] text-xs font-black bg-transparent hover:bg-yellow-50 px-3 py-1.5 rounded-xl border border-transparent hover:border-[#FDE047] transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" /> CSV Export
              </button>
            </div>
          )}

          <div className="flex justify-between items-center gap-3 bg-white border border-gray-150 p-2 rounded-2xl shadow-sm">
            <div className="flex bg-gray-50 rounded-xl p-0.5 overflow-x-auto">
              {['COMPACT', 'DEFAULT', 'RELAXED'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-2.5 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors cursor-pointer text-center ${
                    viewMode === mode
                      ? 'bg-[#FFD400] border border-black text-black shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setColumnsOpen(!columnsOpen)}
                className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${columnsOpen ? 'border-[#0F172A] text-[#0F172A] bg-gray-50' : 'border-gray-200 text-[#64748B] hover:bg-gray-50'}`}
              >
                <Settings className="w-3 h-3" />
                COLUMNS
              </button>

              {columnsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10 p-4 flex flex-col gap-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">COLUMN VISIBILITY</span>
                  {[
                    { key: 'reportedIssue', label: 'Reported Issue' },
                    { key: 'severity', label: 'Severity' },
                    { key: 'status', label: 'Status' }
                  ].map(col => (
                    <label key={col.key} className="flex items-center gap-3 text-sm font-bold text-[#64748B] cursor-pointer">
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

          {/* Mobile Card Layout (Visible only on mobile/small screens) */}
          <div className="block sm:hidden space-y-4">
            {mockData.map((row, index) => {
              const isSelected = selectedRows.includes(row.id);
              
              let cardPadding = 'p-4';
              let spaceBetween = 'space-y-3';
              let textSize = 'text-sm';
              let labelSize = 'text-[9px]';
              let headerText = 'text-sm';
              
              if (viewMode === 'COMPACT') {
                cardPadding = 'p-3';
                spaceBetween = 'space-y-2';
                textSize = 'text-xs';
                labelSize = 'text-[8px]';
                headerText = 'text-xs';
              } else if (viewMode === 'RELAXED') {
                cardPadding = 'p-6';
                spaceBetween = 'space-y-4';
                textSize = 'text-base';
                labelSize = 'text-[10px]';
                headerText = 'text-base';
              }

              return (
                <div 
                  key={index} 
                  className={`bg-white border rounded-2xl shadow-sm transition-all duration-200 ${cardPadding} ${spaceBetween} ${
                    isSelected ? 'bg-[#FFFDF4] border-[#FFD400] ring-1 ring-[#FFD400]' : 'border-gray-150'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleRow(row.id)}
                        className="cursor-pointer shrink-0"
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-[#0F172A] bg-[#0F172A] text-white' : 'border-[#94A3B8]'
                        }`}>
                           {isSelected && <Check className="w-3 h-3" strokeWidth={4} />}
                        </div>
                      </button>
                      
                      {visibleColumns.reportedIssue && (
                        <div>
                          <span className={`${labelSize} font-black text-gray-400 uppercase tracking-widest block`}>Reported Issue</span>
                          <span className={`font-black text-[#0F172A] leading-tight ${headerText}`}>
                            {row.reportedIssue}
                          </span>
                        </div>
                      )}
                    </div>

                    {visibleColumns.status && (
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase shrink-0 ${row.statusColor}`}>
                        {row.status}
                      </span>
                    )}
                  </div>
                  
                  {visibleColumns.severity && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className={`${labelSize} font-black text-gray-400 uppercase tracking-widest block mb-0.5`}>Severity</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${row.severityColor}`}>
                        {row.severity}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Table Layout (Visible on tablet/desktop) */}
          <div className="hidden sm:block border border-gray-150 rounded-2xl overflow-hidden shadow-sm mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="p-4 w-12 text-center">
                    <button
                      onClick={() => setSelectedRows(selectedRows.length === mockData.length ? [] : mockData.map(d => d.id))}
                      className="cursor-pointer"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedRows.length === mockData.length ? 'border-[#D97706] bg-white text-[#D97706]' : 'border-[#94A3B8]'}`}>
                        {selectedRows.length === mockData.length && <Check className="w-3 h-3" strokeWidth={4} />}
                      </div>
                    </button>
                  </th>
                  {visibleColumns.reportedIssue && <th className="p-4 text-[10px] font-black text-[#64748B] uppercase tracking-widest">REPORTED ISSUE</th>}
                  {visibleColumns.severity && <th className="p-4 text-[10px] font-black text-[#64748B] uppercase tracking-widest">SEVERITY</th>}
                  {visibleColumns.status && <th className="p-4 text-[10px] font-black text-[#64748B] uppercase tracking-widest">STATUS</th>}
                </tr>
              </thead>
              <tbody>
                {mockData.map((row) => {
                  const isSelected = selectedRows.includes(row.id);
                  return (
                    <tr key={row.id} className={`border-b border-gray-50 hover:bg-[#FFFBEB]/50 transition-colors ${
                      viewMode === 'COMPACT' ? 'text-xs' : viewMode === 'RELAXED' ? 'text-lg' : 'text-sm'
                    } ${isSelected ? 'bg-[#FFFBEB]' : ''}`}>
                      <td className={`p-4 text-center align-middle ${viewMode === 'COMPACT' ? 'py-2' : viewMode === 'RELAXED' ? 'py-8' : 'py-6'}`}>
                        <button
                          onClick={() => toggleRow(row.id)}
                          className="cursor-pointer"
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'border-[#D97706] text-[#D97706]' : 'border-[#94A3B8]'}`}>
                            {isSelected && <Check className="w-3 h-3" strokeWidth={4} />}
                          </div>
                        </button>
                      </td>
                      {visibleColumns.reportedIssue && (
                        <td className={`p-4 font-black text-[#0F172A] align-middle ${viewMode === 'COMPACT' ? 'py-2' : viewMode === 'RELAXED' ? 'py-8' : 'py-6'}`}>
                          {row.reportedIssue}
                        </td>
                      )}
                      {visibleColumns.severity && (
                        <td className={`p-4 align-middle ${viewMode === 'COMPACT' ? 'py-2' : viewMode === 'RELAXED' ? 'py-8' : 'py-6'}`}>
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider ${row.severityColor}`}>
                            {row.severity}
                          </span>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className={`p-4 align-middle ${viewMode === 'COMPACT' ? 'py-2' : viewMode === 'RELAXED' ? 'py-8' : 'py-6'}`}>
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase ${row.statusColor}`}>
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
          className="w-12 h-12 bg-[#FFD400] hover:bg-yellow-400 text-[#0F172A] rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      {/* SOS EMERGENCY PANEL MODAL */}
      {sosModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-4 sm:p-6 shadow-xl text-left">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-50">
              <h2 className="text-base font-bold text-gray-900">Emergency Dispatch SOS Panel</h2>
              <button onClick={() => setSosModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"><X size={18} /></button>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Triggering an emergency alerts the dispatch operations center immediately and logs active tracking.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                  className={`p-3.5 sm:p-5 border rounded-2xl hover:opacity-90 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer ${color}`}
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
                    className="w-full text-left hover:text-[#0F172A] transition-colors flex items-center gap-3"
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setHotlineOpen(false)}
              className="w-12 h-12 bg-[#FFD400] hover:bg-yellow-400 text-[#0F172A] rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all shrink-0"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
