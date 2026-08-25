import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle, AlertTriangle, HelpCircle, FileText, 
  RefreshCw, Camera, AlertCircle, Check, X, Clock, ChevronDown, ChevronUp, Save, Send
} from 'lucide-react';
import { getWarehouseSafetyChecklists, submitWarehouseSafetyChecklist } from '../../services/api';

const DEFAULT_INSPECTION_ITEMS = [
  { id: 1, label: 'Brakes (service & park brake)', status: 'NOT_CHECKED', notes: '' },
  { id: 2, label: 'Tyres – condition & pressure', status: 'NOT_CHECKED', notes: '' },
  { id: 3, label: 'Lights – all working (head, tail, indicators, brake, reverse)', status: 'NOT_CHECKED', notes: '' },
  { id: 4, label: 'Indicators / Hazard lights', status: 'NOT_CHECKED', notes: '' },
  { id: 5, label: 'Steering & Suspension', status: 'NOT_CHECKED', notes: '' },
  { id: 6, label: 'Windscreen / Windows / Mirrors', status: 'NOT_CHECKED', notes: '' },
  { id: 7, label: 'Wipers / Washer', status: 'NOT_CHECKED', notes: '' },
  { id: 8, label: 'Horn', status: 'NOT_CHECKED', notes: '' },
  { id: 9, label: 'Seat belts / Airbag', status: 'NOT_CHECKED', notes: '' },
  { id: 10, label: 'Fire extinguisher', status: 'NOT_CHECKED', notes: '' },
  { id: 11, label: 'First aid kit', status: 'NOT_CHECKED', notes: '' },
  { id: 12, label: 'Load securement equipment', status: 'NOT_CHECKED', notes: '' },
  { id: 13, label: 'Fluid levels (engine oil, coolant, brake fluid)', status: 'NOT_CHECKED', notes: '' },
  { id: 14, label: 'Fuel level sufficient for trip', status: 'NOT_CHECKED', notes: '' },
  { id: 15, label: 'Leaks (oil, fuel, coolant, air)', status: 'NOT_CHECKED', notes: '' },
  { id: 16, label: 'Body / Chassis / Coupling', status: 'NOT_CHECKED', notes: '' },
  { id: 17, label: 'Load area clear & safe', status: 'NOT_CHECKED', notes: '' },
  { id: 18, label: 'Fatigue / Fitness for driving', status: 'NOT_CHECKED', notes: '' },
  { id: 19, label: 'Load secured / Straps & chains checked', status: 'NOT_CHECKED', notes: '' },
  { id: 20, label: 'Other (notes or additional checks)', status: 'NOT_CHECKED', notes: '' }
];

export default function SafetyChecklist({ onToast = () => {} }) {
  const [items, setItems] = useState(DEFAULT_INSPECTION_ITEMS);
  const [vehicleRef, setVehicleRef] = useState('TRK-101 (MAN TGX)');
  const [trailerRef, setTrailerRef] = useState('TRL-205 (Car Carrier)');
  const [generalNotes, setGeneralNotes] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState(null);
  const [checklistId, setChecklistId] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  
  const [expandedNotesId, setExpandedNotesId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // ── Fetch today's checklist and history from DB ──
  const fetchChecklistData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getWarehouseSafetyChecklists();
      if (res.data && res.data.success && res.data.data) {
        const { currentChecklist, recentChecklists } = res.data.data;
        
        if (recentChecklists && Array.isArray(recentChecklists)) {
          setRecentHistory(recentChecklists);
        }

        if (currentChecklist) {
          setChecklistId(currentChecklist.id);
          setIsSubmitted(!currentChecklist.isDraft);
          setSubmittedAt(currentChecklist.submittedAt || currentChecklist.createdAt);
          if (currentChecklist.vehicleRef) setVehicleRef(currentChecklist.vehicleRef);
          if (currentChecklist.trailerRef) setTrailerRef(currentChecklist.trailerRef);
          if (currentChecklist.notes) setGeneralNotes(currentChecklist.notes);

          // Map persisted items
          if (currentChecklist.items && currentChecklist.items.length > 0) {
            const dbItemsMap = new Map();
            currentChecklist.items.forEach(it => {
              dbItemsMap.set(it.itemNumber, it);
            });

            setItems(DEFAULT_INSPECTION_ITEMS.map(def => {
              const matched = dbItemsMap.get(def.id);
              if (matched) {
                return {
                  id: def.id,
                  label: matched.itemLabel || def.label,
                  status: matched.status || 'NOT_CHECKED',
                  notes: matched.notes || ''
                };
              }
              return def;
            }));
          }
        } else {
          // Clean initial state
          setIsSubmitted(false);
          setSubmittedAt(null);
          setChecklistId(null);
          setItems(DEFAULT_INSPECTION_ITEMS);
        }
      }
    } catch (err) {
      console.error('Error fetching warehouse safety checklist:', err);
      setFetchError(err.response?.data?.error?.message || err.message || 'Failed to load safety checklist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklistData();
  }, []);

  // ── Status change handler ──
  const handleStatusChange = (id, newStatus) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    }));

    if (newStatus === 'FAIL') {
      setExpandedNotesId(id);
    }
  };

  // ── Notes change handler ──
  const handleItemNoteChange = (id, text) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, notes: text };
      }
      return item;
    }));
  };

  // ── Stats calculation ──
  const passCount = items.filter(i => i.status === 'PASS').length;
  const failCount = items.filter(i => i.status === 'FAIL').length;
  const naCount = items.filter(i => i.status === 'NA').length;
  const uncheckedCount = items.filter(i => i.status === 'NOT_CHECKED').length;
  const totalCount = items.length;
  const completedCount = passCount + failCount + naCount;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  // ── Submission Handler ──
  const handleSaveOrSubmit = async (isDraft = false) => {
    if (!isDraft && uncheckedCount > 0) {
      onToast(`Please review all items. ${uncheckedCount} items are still not checked.`, 'error');
    }

    setSubmitting(true);
    try {
      const payload = {
        vehicleRef,
        trailerRef,
        notes: generalNotes,
        isDraft,
        allowUpdate: isSubmitted ? true : false,
        items: items.map(item => ({
          id: item.id,
          label: item.label,
          status: item.status,
          notes: item.notes || ''
        }))
      };

      const res = await submitWarehouseSafetyChecklist(payload);

      if (res.data && res.data.success) {
        const msg = res.data.data?.message || (isDraft ? 'Draft saved successfully!' : 'Safety Checklist submitted successfully!');
        onToast(`✓ ${msg}`, 'success');
        
        // Refresh from DB to guarantee source-of-truth consistency
        await fetchChecklistData();
      }
    } catch (err) {
      console.error('Error submitting safety checklist:', err);
      const errMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to submit checklist.';
      
      if (err.response?.status === 400 && errMsg.includes('already been submitted')) {
        onToast(`⚠️ ${errMsg}`, 'error');
        await fetchChecklistData();
      } else {
        onToast(`❌ ${errMsg}`, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center min-h-[350px]">
        <RefreshCw className="h-8 w-8 text-brand-500 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-700">Loading daily safety checklist from database...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 space-y-3">
        <AlertCircle className="h-8 w-8 text-rose-600 mx-auto" />
        <p className="font-bold text-sm">{fetchError}</p>
        <button 
          onClick={fetchChecklistData}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <RefreshCw size={14} /> Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* ── TOP BANNER: Real Database Status ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-500" />
              Yard Attendant Daily Safety Inspection
            </h3>
            {isSubmitted ? (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase flex items-center gap-1">
                <CheckCircle size={11} /> Completed
              </span>
            ) : checklistId ? (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">
                Draft Saved
              </span>
            ) : (
              <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase">
                Pending Inspection
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {isSubmitted 
              ? `Inspection record persisted in database for today (${new Date(submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}).`
              : 'Complete your required 20-point yard equipment safety checks before shift operations.'
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileText size={14} className="text-slate-500" />
            <span>Inspection History ({recentHistory.length})</span>
          </button>
          <button
            type="button"
            onClick={fetchChecklistData}
            title="Refresh database record"
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* ── 3-COLUMN MASTER GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN (4 cols): OVERVIEW & CONTROLS ── */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Progress Circular Gauge Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-center space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CHECKLIST COMPLETION</h4>
            
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={failCount > 0 ? 'text-amber-500' : 'text-emerald-500'}
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-900">{completedCount} / {totalCount}</span>
                <span className="text-[11px] font-extrabold text-emerald-600">{completionPercentage}%</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 text-center text-xs">
              <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                <span className="block text-emerald-700 font-black text-sm">{passCount}</span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase">Pass</span>
              </div>
              <div className="bg-rose-50 p-2 rounded-xl border border-rose-100">
                <span className="block text-rose-700 font-black text-sm">{failCount}</span>
                <span className="text-[9px] font-bold text-rose-600 uppercase">Fail</span>
              </div>
              <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                <span className="block text-amber-700 font-black text-sm">{naCount}</span>
                <span className="text-[9px] font-bold text-amber-600 uppercase">N/A</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="block text-slate-700 font-black text-sm">{uncheckedCount}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Unchecked</span>
              </div>
            </div>
          </div>

          {/* Reference & Equipment Context Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EQUIPMENT CONTEXT</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Vehicle / Spotter Unit</label>
                <input 
                  type="text" 
                  value={vehicleRef} 
                  onChange={e => setVehicleRef(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-brand-500 outline-none"
                  placeholder="e.g. TRK-101 (MAN TGX)"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Trailer / Cargo Unit</label>
                <input 
                  type="text" 
                  value={trailerRef} 
                  onChange={e => setTrailerRef(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-brand-500 outline-none"
                  placeholder="e.g. TRL-205 (Car Carrier)"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">General Notes / Summary</label>
                <textarea 
                  value={generalNotes} 
                  onChange={e => setGeneralNotes(e.target.value)}
                  rows={2}
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-brand-500 outline-none resize-none"
                  placeholder="Additional safety remarks or shift handover notes..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSaveOrSubmit(false)}
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              <span>{isSubmitted ? 'Update Submitted Inspection' : 'Submit Safety Inspection'}</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSaveOrSubmit(true)}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save size={14} />
              <span>Save Inspection Draft</span>
            </button>
          </div>

        </div>

        {/* ── RIGHT COLUMN (8 cols): 20-ITEM CHECKLIST LIST ── */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h4 className="text-sm font-black text-slate-900 uppercase">20-Point Inspection Items</h4>
            <span className="text-xs text-slate-400 font-semibold">Select Pass, Fail, or N/A for each standard check</span>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const isFail = item.status === 'FAIL';
              const isPass = item.status === 'PASS';
              const isNA = item.status === 'NA';
              const isUnchecked = item.status === 'NOT_CHECKED';
              const hasNotes = Boolean(item.notes && item.notes.trim());

              return (
                <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Item label */}
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        {item.id}
                      </span>
                      <div>
                        <span className={`text-xs font-bold ${isFail ? 'text-rose-700' : 'text-slate-800'}`}>
                          {item.label}
                        </span>
                        {hasNotes && (
                          <p className="text-[11px] text-amber-700 italic mt-0.5">
                            Defect Note: {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Segmented Status Pill Group */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                      
                      {/* PASS Button */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'PASS')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                          isPass 
                            ? 'bg-emerald-500 text-white shadow-xs' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        <Check size={12} strokeWidth={3} />
                        <span>Pass</span>
                      </button>

                      {/* FAIL Button */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'FAIL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                          isFail 
                            ? 'bg-rose-500 text-white shadow-xs' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        <X size={12} strokeWidth={3} />
                        <span>Fail</span>
                      </button>

                      {/* NA Button */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'NA')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                          isNA 
                            ? 'bg-amber-500 text-white shadow-xs' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        N/A
                      </button>

                      {/* Notes toggle button */}
                      <button
                        type="button"
                        onClick={() => setExpandedNotesId(expandedNotesId === item.id ? null : item.id)}
                        className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                          hasNotes || expandedNotesId === item.id ? 'text-brand-600 bg-brand-50' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="Add/Edit defect note"
                      >
                        {expandedNotesId === item.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>

                  </div>

                  {/* Expandable Defect Notes Input */}
                  {(expandedNotesId === item.id || isFail) && (
                    <div className="pl-8 pt-1">
                      <div className="bg-rose-50/50 border border-rose-200/60 rounded-xl p-2.5 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-rose-500 shrink-0" />
                        <input
                          type="text"
                          value={item.notes}
                          onChange={(e) => handleItemNoteChange(item.id, e.target.value)}
                          placeholder={`Enter defect details for "${item.label}"...`}
                          className="w-full text-xs text-rose-950 bg-transparent outline-none placeholder:text-rose-300"
                        />
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── HISTORY MODAL ── */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase">Recent Safety Checklist History</h3>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {recentHistory.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No previous safety checklists found in database.</p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {recentHistory.map((rec) => (
                  <div key={rec.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">{rec.date || 'Today'}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Score: {rec.score}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase border ${
                      rec.status === 'Pass' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
