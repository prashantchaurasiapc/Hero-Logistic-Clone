import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle, FiCamera, FiAlertTriangle, FiFileText,
  FiMessageSquare, FiCheck, FiX, FiMinus, FiHelpCircle, FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function StartWork() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
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

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');

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

  const [notes, setNotes] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uncheckedCount > 0) {
      showToast('⚠️ Please inspect all items before submitting.');
      return;
    }

    try {
      const isWarehouse = user?.role === 'WAREHOUSE_MANAGER' || user?.role === 'WAREHOUSE_STAFF' || user?.role === 'YARD_ATTENDANT';
      const endpoint = isWarehouse ? '/warehouse-portal/safety-checklists' : '/pre-start-checklists';

      const payload = {
        vehicleRef: isWarehouse ? 'WH-EQUIP-101' : (user?.driverProfile?.currentVehicle?.[0]?.rego || 'TRK-101'),
        trailerRef: isWarehouse ? 'NA' : 'TRL-205',
        date: new Date(),
        submittedAt: new Date(),
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
      if (res.data?.success) {
        showToast('✅ Safety Checklist submitted successfully!');
        setTimeout(() => {
          if (failCount > 0) {
            navigate(isWarehouse ? '/warehouse/dashboard' : '/driver/incident-reporting');
          } else {
            navigate(isWarehouse ? '/warehouse/dashboard' : '/driver/dashboard');
          }
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to submit Safety Checklist.');
    }
  };

  const handleSaveDraft = async () => {
    try {
      const isWarehouse = user?.role === 'WAREHOUSE_MANAGER' || user?.role === 'WAREHOUSE_STAFF' || user?.role === 'YARD_ATTENDANT';
      const endpoint = isWarehouse ? '/warehouse-portal/safety-checklists' : '/pre-start-checklists';

      const payload = {
        vehicleRef: isWarehouse ? 'WH-EQUIP-101' : (user?.driverProfile?.currentVehicle?.[0]?.rego || 'TRK-101'),
        trailerRef: isWarehouse ? 'NA' : 'TRL-205',
        date: new Date(),
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
      if (res.data?.success) {
        showToast('💾 Safety Checklist draft saved.');
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to save checklist draft.');
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
                onClick={() => showToast('Displaying past safety checklist history.')}
                className="w-full flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer"
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
                onClick={() => showToast('Photo uploader camera opened.')}
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
                  onClick={() => showToast('Camera photo capture triggered.')}
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
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100 font-bold">
                <div>
                  <span className="text-slate-800 block">29 May 2025, 06:15 AM</span>
                  <span className="text-emerald-600 text-[10px]">Pass</span>
                </div>
                <span className="font-mono text-emerald-600">18 / 20</span>
              </div>

              <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100 font-bold">
                <div>
                  <span className="text-slate-800 block">28 May 2025, 06:12 AM</span>
                  <span className="text-emerald-600 text-[10px]">Pass</span>
                </div>
                <span className="font-mono text-emerald-600">20 / 20</span>
              </div>

              <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100 font-bold">
                <div>
                  <span className="text-slate-800 block">27 May 2025, 06:10 AM</span>
                  <span className="text-emerald-600 text-[10px]">Pass</span>
                </div>
                <span className="font-mono text-emerald-600">19 / 20</span>
              </div>

              <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100 font-bold">
                <div>
                  <span className="text-slate-800 block">26 May 2025, 06:08 AM</span>
                  <span className="text-emerald-600 text-[10px]">Pass</span>
                </div>
                <span className="font-mono text-emerald-600">20 / 20</span>
              </div>

              <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100 font-bold">
                <div>
                  <span className="text-slate-800 block">25 May 2025, 06:11 AM</span>
                  <span className="text-emerald-600 text-[10px]">Pass</span>
                </div>
                <span className="font-mono text-emerald-600">18 / 20</span>
              </div>
            </div>
          </div>

          {/* HELP & RESOURCES Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">HELP & RESOURCES</h3>
            <div className="space-y-2">
              <button
                onClick={() => showToast('Opening Safety Procedures guide...')}
                className="w-full flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 transition-all cursor-pointer"
              >
                <span>Safety Procedures</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button
                onClick={() => showToast('Opening Vehicle Inspection Guide...')}
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

    </div>
  );
}
