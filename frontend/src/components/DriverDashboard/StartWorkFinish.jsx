import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle, FiCamera, FiAlertTriangle, FiFileText,
<<<<<<< HEAD
  FiMessageSquare, FiCheck, FiX, FiMinus, FiHelpCircle, FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
=======
  FiMessageSquare, FiCheck, FiX, FiMinus, FiHelpCircle, FiChevronRight,
  FiShield, FiBookOpen
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { getTodayChecklist, submitChecklist } from '../../services/driverApi';
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a

export default function StartWork() {
  const navigate = useNavigate();
  const { user } = useAuth();
<<<<<<< HEAD

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef(null);
=======
  const isWarehouse = window.location.pathname.includes('/warehouse');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // History logs state
  const [historyLogs] = useState([
    { id: 1, date: '28 May 2025', type: 'Pre-Start Inspection', itemsCount: '16/16 Passed', result: 'Pass ✓', pass: true },
    { id: 2, date: '27 May 2025', type: 'Pre-Start Inspection', itemsCount: '15/16 Passed (1 Minor Defect)', result: 'Minor Defect ⚠️', pass: false },
  ]);

  // Photo uploads state
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  // Modals state
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);

  // Active tab inside Safety Procedures modal
  const [activeSafetyTab, setActiveSafetyTab] = useState('prestart');
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
  const [notes, setNotes] = useState('');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // 20 Inspection Checklist Items state
  const [items, setItems] = useState([
    { id: 1, label: 'Brakes (service & park brake)', status: 'pass' },
    { id: 2, label: 'Tyres – condition & pressure', status: 'pass' },
    { id: 3, label: 'Lights – all working (head, tail, indicators, brake, reverse)', status: 'pass' },
    { id: 4, label: 'Indicators / Hazard lights', status: 'pass' },
    { id: 5, label: 'Steering & Suspension', status: 'pass' },
    { id: 6, label: 'Windscreen / Windows / Mirrors', status: 'pass' },
    { id: 7, label: 'Wipers / Washer', status: 'pass' },
    { id: 8, label: 'Horn', status: 'pass' },
    { id: 9, label: 'Seat belts / Airbag', status: 'pass' },
    { id: 10, label: 'Fire extinguisher', status: 'pass' },
    { id: 11, label: 'First aid kit', status: 'pass' },
    { id: 12, label: 'Load securement equipment', status: 'pass' },
    { id: 13, label: 'Fluid levels (engine oil, coolant, brake fluid)', status: 'pass' },
    { id: 14, label: 'Fuel level sufficient for trip', status: 'pass' },
    { id: 15, label: 'Leaks (oil, fuel, coolant, air)', status: 'pass' },
    { id: 16, label: 'Body / Chassis / Coupling', status: 'pass' },
    { id: 17, label: 'Load area clear & safe', status: 'pass' },
    { id: 18, label: 'Fatigue / Fitness for driving', status: 'pass' },
    { id: 19, label: 'Load secured / Straps & chains checked', status: 'na' },
    { id: 20, label: 'Other (notes or additional checks)', status: 'unchecked' },
  ]);

  useEffect(() => {
<<<<<<< HEAD
    const fetchContext = async () => {
      try {
        const res = await api.get('/driver-portal/checklist-context');
        if (res.data?.success) {
          const { vehicle, loadRef, trailerRef, lastChecklists, template, lastSaved } = res.data.data;
          setContextData({ vehicle, loadRef, trailerRef, lastChecklists, lastSaved });
          setItems(template);
        }
      } catch (error) {
        console.error('Failed to load checklist context', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContext();
  }, []);
=======
    const isWarehouse = user?.role === 'WAREHOUSE_MANAGER' || user?.role === 'WAREHOUSE_STAFF' || user?.role === 'YARD_ATTENDANT';
    if (isWarehouse) {
      setItems([
        { id: 1, label: 'Forklift - Brakes & Controls', status: 'pass' },
        { id: 2, label: 'Forklift - Hydraulics & Lift Mast', status: 'pass' },
        { id: 3, label: 'Forklift - Tyres & Steering', status: 'pass' },
        { id: 4, label: 'Pallet Jack - General Condition', status: 'pass' },
        { id: 5, label: 'RF Scanner - Battery & Connection', status: 'pass' },
        { id: 6, label: 'Printer / Label Station - Loaded & Online', status: 'pass' },
        { id: 7, label: 'Dock Doors & Levellers - Operational', status: 'pass' },
        { id: 8, label: 'PPE - High-Vis Vest & Safety Boots', status: 'pass' },
        { id: 9, label: 'Emergency Exits - Clear & Accessible', status: 'pass' },
        { id: 10, label: 'First Aid & Fire Extinguisher - Checked', status: 'pass' }
      ]);
    }
  }, [user]);
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

<<<<<<< HEAD
=======
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);

  const fetchTodayChecklist = async () => {
    try {
      setLoading(true);
      const res = await getTodayChecklist();
      const existing = res.data?.data?.checklist || res.data?.checklist;
      if (existing) {
        if (!existing.isDraft) setIsAlreadyCompleted(true);
        if (existing.notes) setNotes(existing.notes);
        if (Array.isArray(existing.items) && existing.items.length > 0) {
          setItems(prev =>
            prev.map(defaultItem => {
              const matched = existing.items.find(i => i.itemNumber === defaultItem.id || i.itemLabel === defaultItem.label);
              if (matched) {
                const statusLower = String(matched.status).toLowerCase();
                return {
                  ...defaultItem,
                  status: statusLower === 'not_checked' ? 'unchecked' : statusLower
                };
              }
              return defaultItem;
            })
          );
        }
      }
    } catch (err) {
      console.error('Failed to load today checklist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayChecklist();
  }, []);

>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
  const handleStatusChange = (id, newStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  // Calculate overview counts
  const passCount = items.filter((i) => i.status === 'pass').length;
  const failCount = items.filter((i) => i.status === 'fail').length;
  const naCount = items.filter((i) => i.status === 'na').length;
  const uncheckedCount = items.filter((i) => i.status === 'unchecked').length;
  const totalCount = items.length;
  const completedCount = passCount + failCount + naCount;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

<<<<<<< HEAD
  const handleSubmit = async () => {
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
    if (uncheckedCount > 0) {
      showToast('⚠️ Please inspect all items before submitting.');
      return;
    }

    try {
<<<<<<< HEAD
      const isWarehouse = user?.role === 'WAREHOUSE_MANAGER' || user?.role === 'WAREHOUSE_STAFF' || user?.role === 'YARD_ATTENDANT';
      const endpoint = '/driver-portal/checklists';

      const payload = {
        vehicleRef: contextData?.vehicle?.ref || 'N/A',
        trailerRef: contextData?.trailerRef || 'N/A',
        totalItems: totalCount,
        passedCount: passCount,
        failedCount: failCount,
        naCount: naCount,
        isDraft: false,
        notes: notes,
        items: {
          create: items.map(item => ({
            itemNumber: item.id,
            itemLabel: item.label,
            status: item.status === 'pass' ? 'PASS' : item.status === 'fail' ? 'FAIL' : item.status === 'na' ? 'NA' : 'NOT_CHECKED'
          }))
        }
      };

      const res = await api.post(endpoint, payload);
=======
      setIsSubmitting(true);
      const res = await submitChecklist({
        notes,
        photos: selectedPhotos.map(p => p.name),
        isDraft: false,
        items: items.map(item => ({
          itemNumber: item.id,
          itemLabel: item.label,
          status: item.status === 'pass' ? 'PASS' : item.status === 'fail' ? 'FAIL' : item.status === 'na' ? 'NA' : 'NOT_CHECKED'
        }))
      });

>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
      if (res.data?.success) {
        showToast('✅ Safety Checklist submitted successfully!');
        setTimeout(() => {
          if (failCount > 0) {
            navigate(isWarehouse ? '/warehouse/dashboard' : '/driver/incident-reporting');
          } else {
<<<<<<< HEAD
            navigate(isWarehouse ? '/warehouse/dashboard' : '/driver/assigned-jobs');
=======
            navigate(isWarehouse ? '/warehouse/dashboard' : '/driver/dashboard');
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
          }
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to submit Safety Checklist.');
<<<<<<< HEAD
=======
    } finally {
      setIsSubmitting(false);
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
    }
  };

  const handleSaveDraft = async () => {
    try {
<<<<<<< HEAD
      const endpoint = '/driver-portal/checklists';

      const payload = {
        vehicleRef: contextData?.vehicle?.ref || 'N/A',
        trailerRef: contextData?.trailerRef || 'N/A',
        totalItems: totalCount,
        passedCount: passCount,
        failedCount: failCount,
        naCount: naCount,
        isDraft: true,
        notes: notes,
        items: {
          create: items.map(item => ({
            itemNumber: item.id,
            itemLabel: item.label,
            status: item.status === 'pass' ? 'PASS' : item.status === 'fail' ? 'FAIL' : item.status === 'na' ? 'NA' : 'NOT_CHECKED'
          }))
        }
      };

      const res = await api.post(endpoint, payload);
=======
      setIsSubmitting(true);
      const res = await submitChecklist({
        notes,
        photos: selectedPhotos.map(p => p.name),
        isDraft: true,
        items: items.map(item => ({
          itemNumber: item.id,
          itemLabel: item.label,
          status: item.status === 'pass' ? 'PASS' : item.status === 'fail' ? 'FAIL' : item.status === 'na' ? 'NA' : 'NOT_CHECKED'
        }))
      });

>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
      if (res.data?.success) {
        showToast('💾 Safety Checklist draft saved.');
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to save checklist draft.');
<<<<<<< HEAD
=======
    } finally {
      setIsSubmitting(false);
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
    }
  };

  return (
    <div className="flex-grow bg-[#f8fafc] p-4 lg:p-6 w-full text-left font-sans overflow-y-auto min-h-screen">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#ffcc00] text-black font-extrabold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <FiCheckCircle className="text-black text-base" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Safety Checklist</h1>
            <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase">
              Pre-Start
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Complete your daily safety checklist before hitting the road. Stay safe & keep moving.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/driver/incident-reporting')}
            className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FiAlertTriangle className="text-rose-600" />
            <span>Report Defect</span>
          </button>
        </div>
      </div>

      {/* MAIN 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* ================= COLUMN 1 (LEFT): LEGEND, PROGRESS & STATUS ================= */}
        <div className="space-y-5">
          
          {/* LEGEND Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">LEGEND</h3>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex items-center gap-2 text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Yes / Pass</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>No / Fail</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>N/A / Not Applicable</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span>Not Checked</span>
              </div>
            </div>
          </div>

          {/* CHECKLIST PROGRESS Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">CHECKLIST PROGRESS</h3>
            
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
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
            
            <span className="text-xs font-bold text-slate-600 block">Completed</span>
          </div>

          {/* KEY ACTIONS Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">KEY ACTIONS</h3>
            <div className="space-y-2">
              <button
                onClick={() => setHistoryModalOpen(true)}
<<<<<<< HEAD
                className="w-full flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer"
=======
                className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer"
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
              >
                <FiFileText className="text-slate-600" />
                <span>View History</span>
              </button>

              <button
                onClick={() => navigate('/driver/incident-reporting')}
                className="w-full flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer"
              >
                <FiAlertTriangle className="text-rose-600" />
                <span>Defect Report</span>
              </button>

              <button
                onClick={() => navigate('/driver/contact-dispatch')}
                className="w-full flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer"
              >
                <FiMessageSquare className="text-blue-600" />
                <span>Message Dispatch</span>
              </button>

              <button
<<<<<<< HEAD
                onClick={() => fileInputRef.current?.click()}
=======
                onClick={() => showToast('Photo uploader camera opened.')}
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
                className="w-full flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer"
              >
                <FiCamera className="text-purple-600" />
                <span>Upload Photo</span>
              </button>
            </div>
          </div>

          {/* STATUS Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">STATUS</h3>
            <div className="text-xs space-y-1">
              <div className="text-slate-500 font-medium">Last saved: <strong className="text-slate-800">29 May 2025, 06:10 AM</strong></div>
              <div className="text-emerald-600 font-extrabold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Synced
              </div>
              <div className="text-slate-500 font-medium mt-2 pt-2 border-t border-slate-100">
                Next reminder: <strong className="text-slate-800">Tomorrow, 06:00 AM</strong>
              </div>
            </div>
          </div>

        </div>

        {/* ================= COLUMN 2 & 3 (MIDDLE): 20-POINT CHECKLIST FORM ================= */}
        <div className="lg:col-span-2 space-y-5">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            
            {/* Header Notification Banner */}
            <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3.5 mb-5 flex items-start gap-3 text-xs text-purple-950">
              <FiHelpCircle className="text-purple-600 text-base mt-0.5 shrink-0" />
              <div>
                <strong className="font-extrabold block">Complete all required items before starting your day.</strong>
                <span className="text-purple-700">This helps keep you, your vehicle & others safe.</span>
              </div>
            </div>

            {/* Vehicle & Load Reference Summary */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-3.5 mb-5 text-xs">
              <div>
                <span className="text-slate-400 font-bold text-[10px] uppercase block">Vehicle</span>
                <span className="font-black text-slate-900">TRK-101 (MAN TGX 26.580)</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold text-[10px] uppercase block">Load / Reference</span>
                <span className="font-black text-purple-700">LD-3987</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold text-[10px] uppercase block">Trailer</span>
                <span className="font-black text-slate-900">TRL-205 (Car Carrier 4 Level)</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold text-[10px] uppercase block">Date / Time</span>
                <span className="font-mono font-bold text-slate-800">29 May 2025, 06:15 AM</span>
              </div>
            </div>

            {/* 20-Point Inspection Table */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">VEHICLE & EQUIPMENT</h3>
                <span className="text-xs font-extrabold text-indigo-600 font-mono bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  {completedCount} / {totalCount}
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs bg-white">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 px-2.5 sm:px-3 hover:bg-slate-50/80 transition-colors gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1">
                      <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                        {item.id}
                      </span>
                      <span className="font-semibold text-slate-800 text-xs leading-tight min-w-0 break-words">
                        {item.label}
                      </span>
                    </div>

                    {/* Status Action Buttons (Matching height of label & badge - 24px / h-6) */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* PASS Button */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'pass')}
                        className={`w-8 h-6 sm:w-9 sm:h-6 rounded-md flex items-center justify-center cursor-pointer transition-all focus:outline-none ${
                          item.status === 'pass'
                            ? 'bg-emerald-50 border border-emerald-500 text-emerald-600 font-black shadow-xs'
                            : 'bg-emerald-50/40 hover:bg-emerald-100/60 text-emerald-600/70 border border-emerald-200/50'
                        }`}
                        title="Pass"
                      >
                        <FiCheck className="text-xs sm:text-sm stroke-[2.5]" />
                      </button>

                      {/* FAIL Button */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'fail')}
                        className={`w-8 h-6 sm:w-9 sm:h-6 rounded-md flex items-center justify-center cursor-pointer transition-all focus:outline-none ${
                          item.status === 'fail'
                            ? 'bg-rose-50 border border-rose-500 text-rose-600 font-black shadow-xs'
                            : 'bg-rose-50/40 hover:bg-rose-100/60 text-rose-500/70 border border-rose-200/50'
                        }`}
                        title="Fail"
                      >
                        <FiX className="text-xs sm:text-sm stroke-[2.5]" />
                      </button>

                      {/* N/A Button */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'na')}
                        className={`w-8 h-6 sm:w-9 sm:h-6 rounded-md flex items-center justify-center cursor-pointer transition-all focus:outline-none ${
                          item.status === 'na'
                            ? 'bg-amber-50 border border-amber-500 text-amber-600 font-black shadow-xs'
                            : 'bg-amber-50/40 hover:bg-amber-100/60 text-amber-600/70 border border-amber-200/50'
                        }`}
                        title="Not Applicable"
                      >
                        <FiMinus className="text-xs sm:text-sm stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes & Photo Input */}
            <div className="space-y-4 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes (optional)"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
<<<<<<< HEAD
                  onClick={() => fileInputRef.current?.click()}
=======
                  onClick={() => showToast('Camera photo capture triggered.')}
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl border border-slate-200 cursor-pointer"
                  title="Upload Photo"
                >
                  <FiCamera className="text-base" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs py-3 rounded-xl shadow-xs transition-all cursor-pointer text-center"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-[#ffcc00] hover:bg-[#e6b800] text-black font-black text-xs py-3 rounded-xl shadow-xs transition-all cursor-pointer text-center uppercase"
                >
                  Submit Checklist
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ================= COLUMN 4 (RIGHT): OVERVIEW, REQUIREMENTS & HISTORY ================= */}
        <div className="space-y-5">
          
          {/* CHECKLIST OVERVIEW Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">CHECKLIST OVERVIEW</h3>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between items-center text-emerald-600 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Passed</span>
                </div>
                <span className="font-mono font-black">{passCount}</span>
              </div>

              <div className="flex justify-between items-center text-rose-600 bg-rose-50/60 p-2 rounded-xl border border-rose-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Failed</span>
                </div>
                <span className="font-mono font-black">{failCount}</span>
              </div>

              <div className="flex justify-between items-center text-amber-600 bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>N/A</span>
                </div>
                <span className="font-mono font-black">{naCount}</span>
              </div>

              <div className="flex justify-between items-center text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <span>Not Checked</span>
                </div>
                <span className="font-mono font-black">{uncheckedCount}</span>
              </div>
            </div>
          </div>

          {/* REQUIREMENTS Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">REQUIREMENTS</h3>
            <div className="space-y-2 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-2">
                <FiCheck className="text-emerald-600 mt-0.5 shrink-0" />
                <span>All 'No' items must be resolved before driving.</span>
              </div>
              <div className="flex items-start gap-2">
                <FiCheck className="text-emerald-600 mt-0.5 shrink-0" />
                <span>Report any defects immediately.</span>
              </div>
              <div className="flex items-start gap-2">
                <FiCheck className="text-emerald-600 mt-0.5 shrink-0" />
                <span>Keep your vehicle safe and roadworthy.</span>
              </div>
            </div>
          </div>

          {/* LAST 5 CHECKLISTS Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LAST 5 CHECKLISTS</h3>
              <button onClick={() => showToast('Opening full checklist log history...')} className="text-xs font-bold text-purple-600 hover:underline cursor-pointer">
                View all
              </button>
            </div>

            <div className="space-y-2 text-xs">
<<<<<<< HEAD
              {contextData?.lastChecklists && contextData.lastChecklists.length > 0 ? (
                contextData.lastChecklists.map((chk, i) => (
                  <div 
                    key={i} 
                    onClick={() => { setSelectedHistoryItem(chk); setHistoryModalOpen(true); }}
                    className="flex justify-between items-center p-2 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 font-bold cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="text-slate-800 block">{chk.dateStr}</span>
                      <span className={chk.status === 'Pass' ? "text-emerald-600 text-[10px]" : "text-rose-600 text-[10px]"}>{chk.status}</span>
                    </div>
                    <span className={`font-mono ${chk.status === 'Pass' ? 'text-emerald-600' : 'text-rose-600'}`}>{chk.passedCount} / {chk.totalItems}</span>
                  </div>
                ))
              ) : (
                <div className="text-center p-3 text-slate-500 font-medium bg-slate-50 rounded-xl border border-slate-100">
                  No recent checklists found.
                </div>
              )}
=======
              {historyLogs.map((log) => (
                <div key={log.id} onClick={() => setHistoryModalOpen(true)} className="flex justify-between items-center p-2 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 font-bold transition-all cursor-pointer">
                  <div>
                    <span className="text-slate-800 block text-[11px]">{log.date}</span>
                    <span className="text-emerald-600 text-[10px]">{log.status}</span>
                  </div>
                  <span className="font-mono text-emerald-600 text-xs">{log.score}</span>
                </div>
              ))}
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
            </div>
          </div>

          {/* HELP & RESOURCES Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">HELP & RESOURCES</h3>
            <div className="space-y-2">
              <button
<<<<<<< HEAD
                onClick={() => navigate('/driver/documents')}
=======
                onClick={() => showToast('Opening Safety Procedures guide...')}
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
                className="w-full flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer"
              >
                <span>Safety Procedures</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button
<<<<<<< HEAD
                onClick={() => navigate('/driver/documents')}
=======
                onClick={() => showToast('Opening Vehicle Inspection Guide...')}
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
                className="w-full flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer"
              >
                <span>Vehicle Inspection Guide</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/driver/incident-reporting')}
                className="w-full flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer"
              >
                <span>Report an Incident</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/driver/contact-dispatch')}
                className="w-full flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer"
              >
                <span>Contact Support</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

<<<<<<< HEAD
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => showToast('Photo attached: ' + e.target.files[0]?.name)} />

      {/* ================= INSPECTION HISTORY MODAL ================= */}
      {historyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-5 text-left shadow-2xl max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-700 rounded-2xl">
                  <FiFileText className="text-xl" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg">Pre-Start Safety Checklist History</h3>
                  <p className="text-xs font-semibold text-slate-500">View previous daily vehicle safety inspection audits & sign-offs</p>
                </div>
              </div>
              <button 
                onClick={() => { setHistoryModalOpen(false); setSelectedHistoryItem(null); }} 
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {contextData?.lastChecklists && contextData.lastChecklists.length > 0 ? (
                contextData.lastChecklists.map((chk, idx) => (
                  <div 
                    key={chk.id || idx} 
                    className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl space-y-2.5 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${chk.status === 'Pass' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span className="font-black text-slate-900 text-sm">{chk.dateStr}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          chk.status === 'Pass' 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}>
                          {chk.status === 'Pass' ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="text-slate-500">Score:</span>
                        <span className="font-mono font-black text-slate-900 bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg">
                          {chk.passedCount} / {chk.totalItems} ({Math.round(((chk.passedCount || 19) / (chk.totalItems || 20)) * 100)}%)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1 font-semibold">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Truck Assigned</span>
                        <span className="text-slate-900 font-bold">{chk.vehicle || contextData?.vehicle?.ref || 'No Vehicle'}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Trailer Assigned</span>
                        <span className="text-slate-900 font-bold">{chk.trailer || contextData?.trailerRef || 'No Trailer'}</span>
                      </div>
                    </div>

                    {chk.notes && (
                      <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                        <strong className="text-slate-800">Inspector Notes:</strong> {chk.notes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-500 font-medium">
                  No inspection history logs recorded yet.
=======
      {/* ========================================================================= */}
      {/* 1. SAFETY CHECKLIST LOG HISTORY MODAL */}
      {/* ========================================================================= */}
      {historyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiFileText className="text-indigo-600 text-lg" />
                Pre-Start Safety Checklist History Log
              </h3>
              <button onClick={() => setHistoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {historyLogs.map((log) => (
                <div key={log.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-900">{log.id} — {log.date}</span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {log.status} ({log.score})
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium">Vehicle: <strong>{log.vehicle}</strong></div>
                  <div className="text-slate-500 font-bold bg-white p-2 rounded-xl border border-slate-100">Notes: {log.notes}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="bg-slate-800 text-white font-black text-xs px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Close History Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SAFETY PROCEDURES GUIDE MODAL */}
      {/* ========================================================================= */}
      {safetyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiShield className="text-emerald-600 text-lg" />
                Heavy Vehicle Safety Procedures & Regulations
              </h3>
              <button onClick={() => setSafetyModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            {/* Sub-tabs inside safety modal */}
            <div className="flex border-b border-slate-200 text-xs font-black gap-2">
              <button
                onClick={() => setActiveSafetyTab('prestart')}
                className={`pb-2.5 px-3 border-b-2 cursor-pointer transition-colors ${
                  activeSafetyTab === 'prestart' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Pre-Start Inspection Standard
              </button>
              <button
                onClick={() => setActiveSafetyTab('fatigue')}
                className={`pb-2.5 px-3 border-b-2 cursor-pointer transition-colors ${
                  activeSafetyTab === 'fatigue' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. NHVR Fatigue Management
              </button>
              <button
                onClick={() => setActiveSafetyTab('load')}
                className={`pb-2.5 px-3 border-b-2 cursor-pointer transition-colors ${
                  activeSafetyTab === 'load' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Load Restraint Code
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 max-h-[55vh] overflow-y-auto pr-1 font-medium">
              {activeSafetyTab === 'prestart' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-slate-900 text-sm">Mandatory Pre-Drive Protocol</h4>
                  <p>Before operating any company heavy vehicle, drivers must conduct a 360° walkaround visual & mechanical inspection.</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 font-bold">
                    <li>Inspect all service and park brake operations.</li>
                    <li>Ensure tyre pressure meets load specifications and tread depth exceeds 1.5mm.</li>
                    <li>Verify all hazard indicators, brake lights, and headlights operate cleanly.</li>
                    <li>Check engine oil, coolant reservoir, and air line couplings for any leaks.</li>
                    <li>Do NOT drive if any critical defect (Brakes/Steering/Tyres) is identified.</li>
                  </ul>
                </div>
              )}

              {activeSafetyTab === 'fatigue' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-slate-900 text-sm">National Heavy Vehicle Regulator (NHVR) Work/Rest Hours</h4>
                  <p>Compliance with Standard Hours fatigue limits is compulsory across all transport operations.</p>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-bold text-slate-800">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Max Work Time</span>
                      <span>12 Hours per 24 hour period</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Rest Break</span>
                      <span>15 continuous mins rest every 5.25 hrs</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSafetyTab === 'load' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-slate-900 text-sm">Load Restraint Guide Compliance</h4>
                  <p>All cargo must be restrained to withstand forces specified in the Performance Standards:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 font-bold">
                    <li>0.8g deceleration forward (hard braking)</li>
                    <li>0.5g deceleration sideways & rearward (cornering & acceleration)</li>
                    <li>0.2g acceleration upward</li>
                    <li>Inspect straps, ratchets, and chains for fraying or damage before tensioning.</li>
                  </ul>
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
                </div>
              )}
            </div>

<<<<<<< HEAD
            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500">
                Total Logs: <strong className="text-slate-800">{contextData?.lastChecklists?.length || 0} Submissions</strong>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => setHistoryModalOpen(false)}
                  className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

=======
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSafetyModalOpen(false)}
                className="bg-emerald-600 text-white font-black text-xs px-6 py-2.5 rounded-xl cursor-pointer"
              >
                I Understand & Comply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VEHICLE INSPECTION GUIDE MODAL */}
      {/* ========================================================================= */}
      {inspectionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiBookOpen className="text-indigo-600 text-lg" />
                Step-by-Step Vehicle & Equipment Inspection Guide
              </h3>
              <button onClick={() => setInspectionModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              <div className="bg-indigo-50/70 border border-indigo-100 p-3 rounded-2xl text-indigo-950 font-bold">
                Follow this reference guide to correctly evaluate each of the 20 inspection items before marking Pass / Fail / NA.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                  <span className="font-extrabold text-slate-900 block">1. Brakes</span>
                  <p className="text-slate-600">Test service brake pedal travel. Ensure air pressure builds up to min 600 kPa without audible leaks.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                  <span className="font-extrabold text-slate-900 block">2. Tyres</span>
                  <p className="text-slate-600">Check for minimum 1.5mm tread depth across all tyres. Inspect sidewalls for bulges or exposed cords.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                  <span className="font-extrabold text-slate-900 block">3. Lights & Lamps</span>
                  <p className="text-slate-600">Turn on headlights, high beam, tail lamps, clearance lights, and brake lamps. Replace broken lenses.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                  <span className="font-extrabold text-slate-900 block">4. Fluids & Leaks</span>
                  <p className="text-slate-600">Pull dipstick for engine oil level. Check coolant expansion tank & hydraulic power steering reservoir.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                  <span className="font-extrabold text-slate-900 block">5. Couplings & Trailer</span>
                  <p className="text-slate-600">Verify turntable kingpin lock jaws are fully engaged. Inspect gladhand air hoses and 7-pin electrical plug.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                  <span className="font-extrabold text-slate-900 block">6. Emergency Gear</span>
                  <p className="text-slate-600">Ensure fire extinguisher pressure gauge is in green zone. Confirm first aid kit seal is intact.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInspectionModalOpen(false)}
                className="bg-indigo-600 text-white font-black text-xs px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Close Inspection Guide
              </button>
            </div>
>>>>>>> 0064eea5cab4fd432f8f1212e82ae0df611bc83a
          </div>
        </div>
      )}

=======
    </div>
  );
}
