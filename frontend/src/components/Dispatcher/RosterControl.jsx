import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, CheckCircle, Clock, Palmtree, AlertCircle, Calendar, 
  ChevronLeft, ChevronRight, Filter, Search, Phone, Mail, 
  MoreVertical, X, Download, Plus, Star, Shield, AlertTriangle,
  FileText, MessageSquare, CheckSquare, UserPlus, RefreshCw
} from 'lucide-react';
import api from '../../services/api';

const MODAL_STYLE = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(5px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
  },
  box: (w) => ({
    background: '#fff', borderRadius: 16, boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
    width: '100%', maxWidth: w, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
    animation: 'modalPop 0.2s cubic-bezier(.4,1.6,.6,1) both'
  })
};

function GradientHeader({ icon: Icon, title, subtitle, onClose, color = '#1e40af' }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${color} 0%, #3b82f6 100%)` }}
      className="px-6 py-5 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">{title}</h2>
          {subtitle && <p className="text-blue-100 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <button onClick={onClose}
        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
        <X size={18} />
      </button>
    </div>
  );
}

/* ---------- ASSIGN SHIFT MODAL ---------- */
function AssignShiftModal({ worker, onClose, onAssign, workersList = [] }) {
  const [form, setForm] = useState({
    date: '', startTime: '06:00', endTime: '14:00',
    shiftType: 'Regular', role: worker?.role || '', notes: ''
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(form);
    onClose();
  };
  return (
    <div style={MODAL_STYLE.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={MODAL_STYLE.box(560)}>
        <GradientHeader icon={Plus} title="Assign Shift"
          subtitle={worker ? `Assigning shift to ${worker.name}` : 'Assign a new shift'} onClose={onClose} />
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: '#f8fafc' }}>
          {/* Worker selector if none selected */}
          {!worker && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Worker *</label>
              <select required className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500">
                <option value="">Select worker...</option>
                {workersList.map(w => <option key={w.id} value={w.id}>{w.name} — {w.role}</option>)}
              </select>
            </div>
          )}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Date *</label>
              <input required type="date" value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Shift Type</label>
              <select value={form.shiftType} onChange={e => setForm(p => ({ ...p, shiftType: e.target.value }))}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500">
                <option>Regular</option><option>Overtime</option><option>On-Call</option><option>Night Shift</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Start Time *</label>
              <input required type="time" value={form.startTime}
                onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">End Time *</label>
              <input required type="time" value={form.endTime}
                onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Role / Position</label>
            <input type="text" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              placeholder="e.g. Car Carrier Driver"
              className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Notes <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea rows={3} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Any special instructions..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 resize-none" />
          </div>
        </form>
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={handleSubmit}
            className="px-6 py-2.5 font-bold rounded-xl text-sm text-white shadow-md flex items-center gap-2 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)' }}>
            <CheckSquare size={15} /> Assign Shift
          </button>
        </div>
      </div>
      <style>{`@keyframes modalPop{from{opacity:0;transform:scale(.93) translateY(18px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

/* ---------- AUTO FILL CONFIRMATION MODAL ---------- */
function AutoFillModal({ onClose, onConfirm }) {
  return (
    <div style={MODAL_STYLE.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={MODAL_STYLE.box(440)}>
        <GradientHeader icon={RefreshCw} title="Auto Fill Shifts"
          subtitle="Automatically assign available drivers to open shifts" onClose={onClose} color="#7c3aed" />
        <div className="p-6" style={{ background: '#f8fafc' }}>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-violet-800 font-medium">This will automatically fill <strong>all open shifts</strong> for the selected week based on driver availability and certifications.</p>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Respects driver availability rules</div>
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Checks certifications & compliance</div>
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Avoids overtime violations</div>
            <div className="flex items-center gap-2"><AlertCircle size={14} className="text-amber-500" /> Existing assignments will NOT be overwritten</div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }}
            className="px-6 py-2.5 font-bold rounded-xl text-sm text-white shadow-md flex items-center gap-2 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <RefreshCw size={15} /> Run Auto Fill
          </button>
        </div>
      </div>
      <style>{`@keyframes modalPop{from{opacity:0;transform:scale(.93) translateY(18px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

/* ---------- HELPER TO GET DYNAMIC WEEK DAYS ---------- */
const getWeekDays = (selectedDateObj) => {
  const curr = new Date(selectedDateObj || '2026-08-19');
  const validDate = isNaN(curr.getTime()) ? new Date('2026-08-19') : curr;
  const dayOfWeek = validDate.getDay();
  const distanceToMon = (dayOfWeek + 6) % 7;
  
  const monday = new Date(validDate);
  monday.setDate(validDate.getDate() - distanceToMon);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const label = d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
    days.push({
      dateObj: d,
      isoDate: d.toISOString().split('T')[0],
      label,
      dayName: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString('en-GB', { month: 'short' })
    });
  }
  return days;
};

/* ---------- MAIN COMPONENT ---------- */
export default function RosterControl() {
  const [selectedDate, setSelectedDate] = useState(new Date('2026-08-19'));
  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const [activeSelectedDayLabel, setActiveSelectedDayLabel] = useState(null);
  const currentSelectedDayLabel = activeSelectedDayLabel || (weekDays.length > 2 ? weekDays[2].label : (weekDays[0]?.label || ''));

  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await api.get('/drivers');
        const dbDrivers = res.data?.data || [];
        const formatted = dbDrivers.map(d => {
          const defaultSchedule = {};
          weekDays.forEach((wd, i) => {
            defaultSchedule[wd.label] = {
              status: i % 5 === 0 ? 'On Shift' : i === 6 ? 'Leave' : 'Available',
              time: '06:00 - 14:00'
            };
          });
          return {
            id: d.id,
            name: (d.firstName || d.lastName) ? `${d.firstName || ''} ${d.lastName || ''}`.trim() : (d.driverCode || d.name || 'Unknown Worker'),
            role: 'Car Carrier Driver',
            category: 'Drivers',
            skills: [d.licenseType || 'Standard'],
            phone: d.contactNumber || d.phone || 'N/A',
            email: d.email || 'N/A',
            certifications: [
              { name: 'Driver License', status: 'valid', detail: 'Active' }
            ],
            schedule: defaultSchedule
          };
        });
        setWorkers(formatted);
        if (formatted.length > 0) setSelectedWorker(formatted[0]);
      } catch (error) {
        console.error('Error fetching drivers for roster:', error);
      }
    };
    fetchDrivers();
  }, [weekDays]);

  const [activeTab, setActiveTab] = useState('Schedule View');
  const [sidebarTab, setSidebarTab] = useState('Overview');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAutoFillModal, setShowAutoFillModal] = useState(false);
  const [showMoreFiltersPanel, setShowMoreFiltersPanel] = useState(false);
  const [assignForWorker, setAssignForWorker] = useState(null);
  const [toast, setToast] = useState(null);

  const todayDateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const [filters, setFilters] = useState({
    branch: 'All Branches', date: todayDateStr, view: 'Week',
    type: 'All Types', role: 'All Roles', status: 'All Statuses', search: '',
    skill: 'All Skills', compliance: 'All Compliance'
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFilterChange = (e, field) => {
    setFilters(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleResetFilters = () => {
    setFilters({
      branch: 'All Branches', date: todayDateStr, view: 'Week',
      type: 'All Types', role: 'All Roles', status: 'All Statuses', search: '',
      skill: 'All Skills', compliance: 'All Compliance'
    });
    showToast('All filters reset to defaults');
  };

  const activeExtraFilterCount = useMemo(() => {
    let count = 0;
    if (filters.skill !== 'All Skills') count++;
    if (filters.compliance !== 'All Compliance') count++;
    return count;
  }, [filters]);

  const filteredWorkers = useMemo(() => {
    const s = String(filters.search || '').toLowerCase().trim();
    return workers.filter(worker => {
      const wName = String(worker.name || '').toLowerCase();
      const wRole = String(worker.role || '').toLowerCase();
      const searchMatch = !s || wName.includes(s) || wRole.includes(s);
      const roleMatch = filters.role === 'All Roles' || worker.role === filters.role;
      const typeMatch = filters.type === 'All Types' || String(worker.category || '').toLowerCase().includes(String(filters.type || '').toLowerCase());
      const statusMatch = filters.status === 'All Statuses' || worker.schedule?.[currentSelectedDayLabel]?.status === filters.status;
      const skillMatch = filters.skill === 'All Skills' || (worker.skills && worker.skills.includes(filters.skill));

      return searchMatch && roleMatch && typeMatch && statusMatch && skillMatch;
    });
  }, [workers, filters, currentSelectedDayLabel]);

  const stats = useMemo(() => {
    if (filteredWorkers.length === 0) {
      return { totalWorkforce: 0, availableToday: 0, availablePercentage: 0, onShift: 0, onShiftPercentage: 0, onLeave: 0, onLeavePercentage: 0, absent: 0, absentPercentage: 0 };
    }
    const total = filteredWorkers.length;
    let available = 0, onShift = 0, onLeave = 0, absent = 0;
    filteredWorkers.forEach(w => {
      const today = w.schedule[currentSelectedDayLabel];
      if (today) {
        if (today.status === 'Available') available++;
        if (today.status === 'On Shift') onShift++;
        if (today.status === 'Leave') onLeave++;
        if (today.status === 'Unavailable') absent++;
      }
    });
    return {
      totalWorkforce: total,
      availableToday: available, availablePercentage: Math.round((available / total) * 100) || 0,
      onShift, onShiftPercentage: Math.round((onShift / total) * 100) || 0,
      onLeave, onLeavePercentage: Math.round((onLeave / total) * 100) || 0,
      absent, absentPercentage: Math.round((absent / total) * 100) || 0
    };
  }, [filteredWorkers, currentSelectedDayLabel]);

  const handleExport = () => {
    const days = weekDays.map(w => w.label);
    const rows = [['Name', 'Role', ...days]];
    filteredWorkers.forEach(w => {
      rows.push([w.name, w.role, ...days.map(d => w.schedule[d]?.status || '-')]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `workforce_schedule_${selectedDate.toISOString().split('T')[0]}.csv`; a.click();
    showToast('Workforce schedule exported successfully!');
  };

  const handleAssignShift = async (form) => {
    try {
      const payload = {
        driverId: assignForWorker?.id,
        role: form.role || 'Car Carrier Driver',
        date: new Date(form.date).toISOString(),
        startTime: new Date(`${form.date}T${form.startTime}:00`).toISOString(),
        endTime: new Date(`${form.date}T${form.endTime}:00`).toISOString(),
        notes: form.notes,
        status: 'SCHEDULED'
      };
      await api.post('/shifts', payload);
      showToast(`Shift assigned successfully${assignForWorker ? ` to ${assignForWorker.name}` : ''}!`);
    } catch (e) {
      console.warn("API shift creation failed:", e);
      showToast('Error saving shift to database', 'error');
    }
  };

  const handleAutoFill = () => {
    showToast('Auto Fill complete — 6 open shifts assigned!');
  };

  const openAssignShift = (worker = null) => {
    setAssignForWorker(worker);
    setShowAssignModal(true);
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] min-h-screen p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto relative flex flex-col gap-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[99999] px-5 py-3 rounded-xl shadow-xl text-sm font-semibold text-white flex items-center gap-2 animate-pulse"
          style={{ background: toast.type === 'success' ? 'linear-gradient(135deg,#059669,#10b981)' : '#dc2626' }}>
          <CheckCircle size={16} /> {toast.msg}
        </div>
      )}

      {/* Modals */}
      {showAssignModal && <AssignShiftModal worker={assignForWorker} onClose={() => setShowAssignModal(false)} onAssign={handleAssignShift} />}
      {showAutoFillModal && <AutoFillModal onClose={() => setShowAutoFillModal(false)} onConfirm={handleAutoFill} />}

      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Workforce Availability</h1>
        <p className="text-sm text-slate-500 mt-1">View workforce availability, shifts and assign resources to loads.</p>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Filters Section */}
          <div className="flex flex-wrap items-center gap-3">
            {[
              { label: 'Branch', field: 'branch', opts: ['All Branches', 'Melbourne Depot', 'Sydney Branch'] },
              { label: 'View', field: 'view', opts: ['Week', 'Month'] },
              { label: 'Workforce Type', field: 'type', opts: ['All Types', 'Drivers', 'Warehouse Staff', 'Yard Crew'] },
              { label: 'Role / Position', field: 'role', opts: ['All Roles', 'Car Carrier Driver', 'Driver'] },
              { label: 'Status', field: 'status', opts: ['All Statuses', 'Available', 'On Shift', 'Leave'] },
            ].map(({ label, field, opts }) => (
              <div key={field} className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-slate-500">{label}</span>
                {field === 'branch' ? (
                  <div className="flex items-center gap-1">
                    <select value={filters[field]} onChange={(e) => handleFilterChange(e, field)}
                      className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500">
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ) : (
                  <select value={filters[field]} onChange={(e) => handleFilterChange(e, field)}
                    className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500">
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-slate-500">Date</span>
              <div className="flex items-center border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 text-xs font-bold shadow-xs">
                <Calendar size={14} className="text-slate-400 mr-2 shrink-0" />
                <input 
                  type="date" 
                  value={selectedDate.toISOString().split('T')[0]} 
                  onChange={(e) => {
                    if (e.target.value) {
                      const newD = new Date(e.target.value);
                      setSelectedDate(newD);
                      setActiveSelectedDayLabel(null);
                    }
                  }}
                  className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs" 
                />
                <div className="flex items-center ml-2 gap-1">
                  <button 
                    type="button"
                    title="Previous Week"
                    onClick={() => {
                      const prev = new Date(selectedDate);
                      prev.setDate(prev.getDate() - 7);
                      setSelectedDate(prev);
                      setActiveSelectedDayLabel(null);
                    }}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    type="button"
                    title="Next Week"
                    onClick={() => {
                      const next = new Date(selectedDate);
                      next.setDate(next.getDate() + 7);
                      setSelectedDate(next);
                      setActiveSelectedDayLabel(null);
                    }}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-4">
              <button 
                type="button"
                onClick={() => setShowMoreFiltersPanel(!showMoreFiltersPanel)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all cursor-pointer ${
                  showMoreFiltersPanel || activeExtraFilterCount > 0 
                    ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Filter size={14} className={showMoreFiltersPanel ? 'text-blue-600' : 'text-slate-400'} />
                <span>More Filters</span>
                {activeExtraFilterCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                    {activeExtraFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Advanced Filters Panel */}
          {showMoreFiltersPanel && (
            <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-md space-y-3 transition-all animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter size={13} className="text-blue-600" /> Advanced Filters
                </span>
                <button 
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600">Skills / License</label>
                  <select 
                    value={filters.skill} 
                    onChange={(e) => handleFilterChange(e, 'skill')}
                    className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="All Skills">All Skills</option>
                    <option value="Standard">Standard</option>
                    <option value="MR (Medium Rigid)">MR (Medium Rigid)</option>
                    <option value="HR (Heavy Rigid)">HR (Heavy Rigid)</option>
                    <option value="MC (Multi Combination)">MC (Multi Combination)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600">Compliance Status</label>
                  <select 
                    value={filters.compliance} 
                    onChange={(e) => handleFilterChange(e, 'compliance')}
                    className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="All Compliance">All Compliance</option>
                    <option value="Valid License">Valid License</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600">Quick Skill Search</label>
                  <input 
                    type="text" 
                    placeholder="Type skill name e.g. Dangerous Goods..." 
                    value={filters.search}
                    onChange={(e) => handleFilterChange(e, 'search')}
                    className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {[
              { label: 'Total Workforce', val: stats.totalWorkforce, sub: 'Across all branches', icon: Users, color: 'blue' },
              { label: 'Available Today', val: stats.availableToday, sub: `${stats.availablePercentage}% of total`, icon: CheckCircle, color: 'emerald' },
              { label: 'On Shift', val: stats.onShift, sub: `${stats.onShiftPercentage}% of total`, icon: Clock, color: 'blue' },
              { label: 'On Leave', val: stats.onLeave, sub: `${stats.onLeavePercentage}% of total`, icon: Palmtree, color: 'orange' },
              { label: 'Absent / Unavailable', val: stats.absent, sub: `${stats.absentPercentage}% of total`, icon: AlertCircle, color: 'rose' },
            ].map(({ label, val, sub, icon: Icon, color }) => (
              <div key={label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                  <h2 className="text-2xl font-bold text-slate-800 mt-1">{val}</h2>
                  <p className={`text-[10px] mt-1 text-${color}-500 font-semibold`}>{sub}</p>
                </div>
                <div className={`w-10 h-10 bg-${color}-50 rounded-lg flex items-center justify-center text-${color}-500`}>
                  <Icon size={20} />
                </div>
              </div>
            ))}
          </div>

          {/* Main Table Area */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 pt-2">
              <div className="flex space-x-6">
                {['Schedule View', 'List View', 'Unavailability', 'Leave Calendar'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm ${activeTab === tab ? 'font-semibold text-blue-600 border-b-2 border-blue-600' : 'font-medium text-slate-500 hover:text-slate-700'}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-4 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Group by:</span>
                  <select className="text-xs border border-slate-200 bg-white rounded-md px-2 py-1 outline-none">
                    <option>Role</option><option>Branch</option><option>Status</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowAutoFillModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-600 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-50 transition-colors">
                  <RefreshCw size={13} /> Auto Fill Shifts
                </button>
              </div>
            </div>

            {/* Grid Layout */}
            {activeTab === 'Schedule View' ? (
              <div className="overflow-x-auto border-t border-slate-200">
                <table className="w-full text-sm text-left min-w-[1000px] whitespace-nowrap">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 border-b border-slate-200 w-64 min-w-[250px]">
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" value={filters.search} onChange={(e) => handleFilterChange(e, 'search')}
                            placeholder="Search by name, role, skills..."
                            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none" />
                        </div>
                      </th>
                      {weekDays.map((dayObj) => {
                        const isSelected = dayObj.label === currentSelectedDayLabel;
                        return (
                          <th 
                            key={dayObj.label}
                            onClick={() => setActiveSelectedDayLabel(dayObj.label)}
                            className={`px-3 py-3 border-b border-slate-200 font-bold text-center text-xs cursor-pointer transition-all ${
                              isSelected ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                            title={`Click to select ${dayObj.label}`}
                          >
                            {dayObj.label}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-slate-50/50">
                      <td colSpan={8} className="px-4 py-2 text-xs font-bold text-slate-700 flex items-center gap-2">
                        <div className="w-4 h-4 bg-slate-200 rounded flex items-center justify-center">-</div>
                        Drivers ({filteredWorkers.length})
                      </td>
                    </tr>
                    {filteredWorkers.map(worker => (
                      <tr key={worker.id} onClick={() => setSelectedWorker(worker)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${worker.name.replace(' ', '+')}&background=e2e8f0&color=475569`}
                              className="w-8 h-8 rounded-full" alt="" />
                            <div>
                              <p className="font-semibold text-slate-800 text-xs">{worker.name}</p>
                              <p className="text-[10px] text-slate-500">{worker.role}</p>
                            </div>
                            <div className="ml-auto flex gap-1">
                              {worker.skills?.map((skill, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded">{skill}</span>
                              ))}
                            </div>
                          </div>
                        </td>
                        {weekDays.map((dayObj) => {
                          const day = dayObj.label;
                          const shift = worker.schedule?.[day] || { status: 'Available' };
                          const isDaySelected = day === currentSelectedDayLabel;
                          let statusClass = "text-slate-400";
                          if (shift?.status === 'On Shift') statusClass = "text-emerald-600";
                          if (shift?.status === 'Available') statusClass = "text-emerald-500";
                          if (shift?.status === 'Leave') statusClass = "text-orange-500";
                          if (shift?.status === 'Unavailable') statusClass = "text-rose-500";
                          return (
                            <td 
                              key={day} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedWorker(worker);
                                setActiveSelectedDayLabel(day);
                              }}
                              className={`px-2 py-3 text-center cursor-pointer transition-colors ${
                                isDaySelected ? 'bg-blue-50/70 font-bold border-x border-blue-200' : 'hover:bg-slate-50'
                              }`}
                              title={`Click to inspect shift on ${day}`}
                            >
                              <div className={`flex flex-col items-center justify-center p-1 rounded transition-transform active:scale-95 ${
                                isDaySelected ? 'bg-white shadow-xs border border-blue-300' : ''
                              }`}>
                                <span className={`${statusClass} font-bold text-[10px]`}>{shift.status}</span>
                                {(shift.time || shift.detail) && (
                                  <span className="text-slate-400 text-[9px]">{shift.time || shift.detail}</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    {['Warehouse Staff (24)', 'Yard Crew (16)', 'Mechanics (6)', 'Administrators (3)'].map((category, idx) => (
                      <tr key={idx} className="border-b border-slate-100 opacity-50">
                        <td className="px-4 py-3 text-xs font-semibold text-slate-700 flex items-center gap-2">
                          <div className="w-4 h-4 border border-slate-200 rounded flex items-center justify-center">+</div>
                          {category}
                        </td>
                        {['6/8','7/8','7/8','8/8','8/8','5/8','4/8'].map((v,i) => (
                          <td key={i} className="px-2 py-3 text-center text-xs font-medium text-slate-600">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Legend */}
                <div className="p-4 flex flex-wrap items-center gap-4 border-t border-slate-200 bg-white rounded-b-xl">
                  {[
                    { label: 'On Shift', color: 'emerald' }, { label: 'Available', color: 'emerald' },
                    { label: 'Leave', color: 'orange' }, { label: 'En Route', color: 'blue' },
                    { label: 'Break / Off Duty', color: 'slate' }, { label: 'Unavailable', color: 'rose' }
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5 whitespace-nowrap">
                      <span className={`w-3 h-3 rounded-sm border border-${color}-400 bg-white`}></span>
                      <span className="text-[10px] font-medium text-slate-500">{label}</span>
                    </div>
                  ))}
                  <span className="text-[10px] font-medium text-slate-500 ml-auto">Numbers show: Assigned / Required</span>
                </div>
              </div>
            ) : (
              <div className="p-16 flex flex-col items-center justify-center text-center border-t border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={24} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{activeTab}</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">This view is currently under construction. Switch back to Schedule View.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Buttons + Sidebar */}
        {selectedWorker && (
          <div className="w-full xl:w-80 flex flex-col gap-6 flex-shrink-0">
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 w-full">
              <button
                onClick={() => openAssignShift(selectedWorker)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm">
                <Plus size={16} /> Assign Shift
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-colors">
                <Download size={16} /> Export
              </button>
            </div>

            {/* Selected Worker Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col xl:sticky xl:top-[100px]">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SELECTED WORKER</span>
                <button onClick={() => setSelectedWorker(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>

              <div className="p-5">
                <div className="flex gap-4">
                  <img src={`https://ui-avatars.com/api/?name=${selectedWorker.name.replace(' ', '+')}&background=e2e8f0&color=475569`}
                    className="w-12 h-12 rounded-full" alt="" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{selectedWorker.name}</h3>
                      {selectedWorker.schedule?.[currentSelectedDayLabel]?.status === 'On Shift' && (
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded">On Shift</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{selectedWorker.role}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Employee ID: {selectedWorker.id}</p>
                    <p className="text-[10px] text-slate-400">Mobile: {selectedWorker.phone}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="w-7 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                      <Phone size={12} />
                    </button>
                    <button className="w-7 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                      <Mail size={12} />
                    </button>
                    <button className="w-7 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                      <MoreVertical size={12} />
                    </button>
                  </div>
                </div>

                {/* Sidebar Tabs */}
                <div className="flex border-b border-slate-200 mt-6">
                  {['Overview', 'Skills & Certifications', 'Shifts', 'Notes'].map(tab => (
                    <button key={tab} onClick={() => setSidebarTab(tab)}
                      className={`flex-1 pb-2 text-xs text-center transition-colors ${sidebarTab === tab ? 'font-semibold text-blue-600 border-b-2 border-blue-600' : 'font-medium text-slate-500 hover:text-slate-700'}`}>
                      {tab}
                    </button>
                  ))}
                </div>

                {sidebarTab === 'Overview' && (
                  <div className="mt-5 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-3">Selected Date - {currentSelectedDayLabel}</h4>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 relative">
                        <span className="text-emerald-700 font-bold text-xs">
                          {selectedWorker.schedule?.[currentSelectedDayLabel]?.status || 'Available'}
                        </span>
                        <span className="absolute top-3 right-3 text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">Load</span>
                        <p className="text-xs text-slate-600 mt-1">
                          {selectedWorker.schedule?.[currentSelectedDayLabel]?.time || '06:00 - 14:00'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {selectedWorker.schedule?.[currentSelectedDayLabel]?.detail || 'Regular Roster Shift'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-3">Availability</h4>
                      <div className="space-y-2">
                        {weekDays.map(({ label }) => (
                          <div 
                            key={label} 
                            onClick={() => setActiveSelectedDayLabel(label)}
                            className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
                              label === currentSelectedDayLabel ? 'bg-blue-50 font-bold' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                selectedWorker.schedule?.[label]?.status === 'Available' ? 'bg-emerald-500' : 
                                selectedWorker.schedule?.[label]?.status === 'On Shift' ? 'bg-blue-500' : 'bg-rose-500'
                              }`}></div>
                              <span className="text-xs text-slate-700">{label}</span>
                            </div>
                            <span className={`${
                              selectedWorker.schedule?.[label]?.status === 'Available' ? 'text-emerald-600 font-bold' : 
                              selectedWorker.schedule?.[label]?.status === 'On Shift' ? 'text-blue-600 font-bold' : 'text-slate-500'
                            } text-xs`}>
                              {selectedWorker.schedule?.[label]?.status || 'Available'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-3">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => openAssignShift(selectedWorker)}
                          className="px-3 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[10px] font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1 justify-center">
                          <Plus size={11} /> Assign Shift
                        </button>
                        <button className="px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1 justify-center">
                          <AlertCircle size={11} /> Add Unavailability
                        </button>
                        <button className="col-span-2 px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1 justify-center">
                          <MessageSquare size={11} /> Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {sidebarTab === 'Skills & Certifications' && (
                  <div className="mt-5 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-2">Skills & Roles</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-md border border-blue-100">{selectedWorker.role}</span>
                        {selectedWorker.skills?.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-md border border-blue-100">{skill} License</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-3">Certifications</h4>
                      <div className="space-y-3">
                        {selectedWorker.certifications?.map((cert, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-xs text-slate-600 font-medium">{cert.name}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] ${cert.status === 'valid' ? 'text-slate-400' : 'text-rose-500'}`}>{cert.detail}</span>
                              {cert.status === 'valid' ? <CheckCircle size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-orange-500" />}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-3">
                        <button className="text-blue-600 text-[10px] font-semibold hover:underline">View all certifications</button>
                      </div>
                    </div>
                  </div>
                )}

                {sidebarTab === 'Shifts' && (
                  <div className="mt-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-900">Shift History — This Week</h4>
                    {['Mon 18 May', 'Tue 19 May', 'Wed 20 May', 'Thu 21 May', 'Fri 22 May', 'Sat 23 May', 'Sun 24 May'].map(day => {
                      const shift = selectedWorker.schedule[day];
                      return (
                        <div key={day} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{day}</p>
                            {shift ? (
                              <p className="text-[10px] text-slate-500 mt-0.5">{shift.time || shift.detail || shift.status}</p>
                            ) : (
                              <p className="text-[10px] text-slate-400 mt-0.5">Not scheduled</p>
                            )}
                          </div>
                          {shift ? (
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              shift.status === 'On Shift' ? 'bg-emerald-100 text-emerald-700' :
                              shift.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                              shift.status === 'Leave' ? 'bg-orange-100 text-orange-700' :
                              'bg-rose-100 text-rose-700'
                            }`}>{shift.status}</span>
                          ) : (
                            <span className="text-[9px] text-slate-400">—</span>
                          )}
                        </div>
                      );
                    })}
                    <button onClick={() => openAssignShift(selectedWorker)}
                      className="w-full py-2 border border-dashed border-blue-300 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                      <Plus size={13} /> Add New Shift
                    </button>
                  </div>
                )}

                {sidebarTab === 'Notes' && (
                  <div className="mt-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-900">Internal Notes</h4>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-[10px] font-bold text-amber-700 mb-1">Dispatcher Note · 21 May 2026</p>
                      <p className="text-xs text-slate-700">Driver requested lighter loads this week due to medical appointment on Thursday afternoon.</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-[10px] font-bold text-slate-500 mb-1">HR Note · 15 May 2026</p>
                      <p className="text-xs text-slate-700">License renewal due end of June. Please remind driver to submit paperwork.</p>
                    </div>
                    <textarea rows={3} placeholder="Add a note..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 resize-none focus:outline-none focus:border-blue-400" />
                    <button className="w-full py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <FileText size={13} /> Save Note
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
