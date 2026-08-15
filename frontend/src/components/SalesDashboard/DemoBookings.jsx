import React, { useState, useEffect } from 'react';
import { 
  Plus, Mail, Phone, ChevronRight, X, Sparkles, 
  Edit3, Trash2, Bell, ShieldCheck, ChevronDown, Check, 
  DollarSign, Building, Truck, RefreshCw, Calendar, Clock, Video, User, Star, Play
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';
import { crmWorkflowEngine } from '../../services/crmEngines';
import { useAuth } from '../../context/AuthContext';
import { getSalesReps } from '../../services/api';

export default function DemoBookings() {
  const { user } = useAuth();
  // Database States loaded from crmStore
  const [demos, setDemos] = useState([]);
  const [leads, setLeads] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [selectedRepFilter, setSelectedRepFilter] = useState('ALL');
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMonth, setCurrentMonth] = useState({ month: 6, year: 2026, label: 'July 2026' }); // 0-indexed: 6 is July
  
  // Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(null); // demo object or null
  
  // Form states
  const [bookForm, setBookForm] = useState({
    leadId: '',
    date: '',
    time: '10:00 AM',
    presenterId: '',
    presenter: '',
    notes: ''
  });
  
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    notes: ''
  });

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ type, text: msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Subscribe to crmStore changes to ensure reactive binding
  useEffect(() => {
    // Sync with database
    crmRepository.syncWithBackend();

    getSalesReps().then(res => {
      if (res.data?.success && Array.isArray(res.data.data)) {
        setSalesReps(res.data.data);
      }
    }).catch(err => console.error('Error fetching reps in demos:', err));

    const syncDb = () => {
      setDemos(crmRepository.getDemos());
      const freshLeads = crmRepository.getLeads();
      setLeads(freshLeads);
      const freshReps = crmRepository.getSalesReps();
      if (freshReps?.length) setSalesReps(freshReps);
      
      // Auto-set first lead in booking form if empty
      if (freshLeads.length > 0) {
        setBookForm(prev => ({ 
          ...prev, 
          leadId: prev.leadId || freshLeads[0].id,
          presenterId: prev.presenterId || freshReps[0]?.id || '',
          presenter: prev.presenter || freshReps[0]?.name || ''
        }));
      }
    };

    syncDb();
    const unsubscribe = crmStore.subscribe(syncDb);
    return () => unsubscribe();
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // List of available reps
  const repsList = ['Alex Wright', 'Sarah K.', 'Michael Scott', 'Jan Levinson', 'Ryan Howard'];

  // Handle demo status select change
  const handleStatusChange = async (demoId, newStatus) => {
    await crmRepository.updateDemo(demoId, { status: newStatus });
    setToast({ type: 'success', text: `Demo status updated to ${newStatus}.` });
  };

  // Handle Send Reminder email
  const handleSendReminder = async (demo) => {
    await crmRepository.createFollowUpTask({
      leadId: demo.leadId,
      type: 'EMAIL',
      notes: `Sent demo reminder email to ${demo.contact} for walkthrough on ${demo.date}`,
      dueDate: new Date(),
      repId: demo.presenterId
    });
    setToast({ type: 'success', text: `Reminder email successfully sent to ${demo.contact} (${demo.company}).` });
  };

  // Open Feedback Modal
  const openFeedbackModal = (demo) => {
    setFeedbackForm({
      rating: 5,
      notes: ''
    });
    setShowFeedbackModal(demo);
  };

  // Handle Feedback Submit
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!showFeedbackModal) return;

    // Log feedback
    await crmRepository.logDemoFeedback(showFeedbackModal.id, feedbackForm.notes, feedbackForm.rating);
    // Mark as completed
    await crmRepository.updateDemo(showFeedbackModal.id, { status: 'Completed' });

    setToast({ type: 'success', text: `Feedback logged for ${showFeedbackModal.company} walkthrough.` });
    setShowFeedbackModal(null);
  };

  // Open Book Demo Modal prefilled with date if clicked on calendar cell
  const openBookModal = (dateStr = '') => {
    setBookForm({
      leadId: leads[0]?.id || '',
      date: dateStr || new Date().toISOString().split('T')[0],
      time: '10:30 AM',
      presenter: 'Alex Wright',
      notes: ''
    });
    setShowBookModal(true);
  };

  // Book Demo Form Submit
  const handleBookDemoSubmit = (e) => {
    e.preventDefault();
    if (!bookForm.leadId || !bookForm.date || !bookForm.time) {
      alert('Please fill out all required fields.');
      return;
    }

    crmRepository.scheduleDemo(bookForm.leadId, {
      date: bookForm.date,
      time: bookForm.time,
      presenter: bookForm.presenter,
      notes: bookForm.notes
    });

    const leadName = leads.find(l => l.id === bookForm.leadId)?.company || 'Lead';
    setToast({ type: 'success', text: `Product Demo Walkthrough booked for ${leadName}.` });
    setShowBookModal(false);
  };

  // Filter Demos based on role and text search
  const filteredDemos = demos.filter(demo => {
    // Role filter
    if (user?.accessProfile === 'SALES_REP') {
      if (demo.presenterId !== user?.id && demo.presenter !== user?.name) return false;
    }
    if (selectedRepFilter !== 'ALL') {
      if (demo.presenterId !== selectedRepFilter && demo.presenter !== selectedRepFilter) return false;
    }

    // Text search
    const matchesSearch = 
      demo.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demo.presenter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demo.contact.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Calendar cells mapping for July 2026 (Wednesday is July 1st, 31 days)
  const getCalendarDays = () => {
    const days = [];
    for (let i = 0; i < 3; i++) {
      days.push({ day: null, dateStr: '' });
    }
    for (let d = 1; d <= 31; d++) {
      const dateStr = `2026-07-${d.toString().padStart(2, '0')}`;
      days.push({ day: d, dateStr });
    }
    return days;
  };

  const calendarDays = getCalendarDays();

  // Demos grouped by date string for Calendar badges
  const getDemosByDate = (dateStr) => {
    if (!dateStr) return [];
    return demos.filter(d => d.date === dateStr);
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 overflow-y-auto w-full text-left font-sans flex flex-col h-full min-h-0">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 px-5 py-3.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-semibold animate-slide-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
          {toast.text}
        </div>
      )}

      {/* Header Container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Demo Booking
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Interactive software demonstration scheduler and prospect feedback console.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Authenticated Identity Indicator */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider leading-none">Logged In</span>
              <strong className="text-slate-900 font-extrabold text-[11px] leading-tight block">{user?.name || 'Sales Officer'}</strong>
            </div>
            <span className="ml-1.5 px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[9px] rounded-md uppercase">
              {user?.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : user?.accessProfile || 'SALES_FULL_ACCESS'}
            </span>
          </div>

          {/* Filter by Sales Rep (Full Access only) */}
          {(user?.role === 'SUPER_ADMIN' || user?.accessProfile !== 'SALES_REP') && (
            <div className="relative">
              <select
                value={selectedRepFilter}
                onChange={(e) => setSelectedRepFilter(e.target.value)}
                className="bg-white border border-slate-300 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-none cursor-pointer shadow-xs hover:border-amber-400 transition-colors"
              >
                <option value="ALL">All Sales Reps</option>
                {salesReps.map(rep => (
                  <option key={rep.id} value={rep.id}>{rep.name || rep.email}</option>
                ))}
              </select>
            </div>
          )}

          <button 
            onClick={() => openBookModal()}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Schedule Demo
          </button>
        </div>
      </div>

      {/* Main Double Panel Workspace */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: July 2026 Calendar Grid (Col Span 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-xs p-5 flex flex-col">
          <div className="shrink-0 flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Product Demo Walkthroughs Schedule
              </h2>
              <p className="text-[10px] text-slate-400 font-bold mt-1">
                Date-wise booking distribution (July 2026).
              </p>
            </div>
            
            {/* Month Badge */}
            <span className="border border-slate-200 bg-slate-50 text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider text-slate-600 select-none">
              {currentMonth.label}
            </span>
          </div>

          {/* Calendar Grid Container */}
          <div className="flex-grow flex flex-col justify-between select-none">
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-widest pb-3">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Date Cells */}
            <div className="grid grid-cols-7 gap-2 flex-grow">
              {calendarDays.map((cell, idx) => {
                const dayDemos = getDemosByDate(cell.dateStr);
                
                return (
                  <div
                    key={idx}
                    onClick={() => cell.day && openBookModal(cell.dateStr)}
                    className={`rounded-2xl p-3 min-h-[90px] flex flex-col justify-between text-left transition-all duration-200 border ${
                      cell.day 
                        ? 'bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-amber-300 border-slate-200/60 cursor-pointer shadow-xs' 
                        : 'bg-transparent border-transparent pointer-events-none'
                    }`}
                  >
                    {/* Day Digit */}
                    {cell.day && (
                      <span className="text-sm font-black text-slate-700 leading-none">
                        {cell.day}
                      </span>
                    )}

                    {/* Demos Pills */}
                    <div className="flex-grow flex flex-col justify-end space-y-1 mt-1 overflow-hidden">
                      {dayDemos.slice(0, 2).map((d) => (
                        <span 
                          key={d.id}
                          className={`text-[8px] font-black py-0.5 px-1 rounded block truncate leading-none ${
                            d.status === 'Completed' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                              : d.status === 'Cancelled' 
                              ? 'bg-rose-50 text-rose-700 border border-rose-150' 
                              : 'bg-amber-50 text-amber-850 border border-amber-150'
                          }`}
                          title={`${d.company} (${d.time})`}
                        >
                          {d.company}
                        </span>
                      ))}
                      {dayDemos.length > 2 && (
                        <span className="text-[7px] text-slate-400 font-extrabold text-center block">
                          +{dayDemos.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Slots List View (Col Span 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs p-5 flex flex-col">
          {/* Panel Header */}
          <div className="shrink-0 flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Upcoming Slots Walkthrough
              </h2>
              {/* Search text query */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search walkthroughs..."
                className="mt-2 px-2.5 py-1 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] text-[10px] font-bold rounded-lg focus:outline-none placeholder:text-slate-400 text-slate-800 transition-colors w-48"
              />
            </div>
            
            {/* Book Demo Button */}
            <button 
              onClick={() => openBookModal()}
              className="bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border border-[#FDE68A] font-extrabold text-[10px] px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 shrink-0 stroke-[3px]" /> Book Demo
            </button>
          </div>

          {/* Cards List Body */}
          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2 scrollbar-none">
            {filteredDemos.map((d) => (
              <div 
                key={d.id} 
                className="bg-white border border-slate-200/80 rounded-xl px-3.5 py-3 shadow-sm hover:border-amber-300 hover:shadow-md transition-all duration-300"
              >
                {/* Row 1: Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-slate-800 font-bold text-[13px]">{d.company}</h3>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Presenter: {d.presenter} &bull; {d.date} at {d.time}
                    </div>
                  </div>
                  
                  {/* Status Dropdown */}
                  <select
                    value={d.status}
                    onChange={(e) => handleStatusChange(d.id, e.target.value)}
                    className="px-2 py-1 rounded-md border border-slate-200 bg-white text-[10px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-slate-100 my-2.5"></div>

                {/* Row 2: Action Bar */}
                <div className="flex items-center gap-3">
                  <button onClick={() => window.open(d.meetingLink || 'https://zoom.us/j/hero-demo', '_blank')} className="flex items-center gap-1.5 bg-[#FFD500] hover:bg-brand-600 text-slate-900 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all shadow-xs cursor-pointer">
                    <Play className="w-3.5 h-3.5" /> Join Zoom
                  </button>
                  {d.status !== 'Completed' ? (
                    <>
                      <button 
                        onClick={() => handleStatusChange(d.id, 'Completed')}
                        className="text-[10px] font-bold text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        Mark Complete
                      </button>
                      
                      <div className="flex-grow"></div>
                      
                      <button 
                        onClick={() => handleSendReminder(d)}
                        className="text-[9px] font-black text-[#D97706] hover:text-[#92400E] uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        SEND REMINDER
                      </button>
                      <div className="w-px h-3 bg-slate-200"></div>
                    </>
                  ) : (
                    <div className="flex-grow flex justify-end">
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mr-3">
                        <Check className="w-3.5 h-3.5" /> Completed
                      </span>
                      <div className="w-px h-3 bg-slate-200 my-auto mx-2"></div>
                    </div>
                  )}
                  <button 
                    onClick={() => openFeedbackModal(d)}
                    className="text-[9px] font-black text-slate-500 hover:text-slate-700 uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    FEEDBACK
                  </button>
                </div>
              </div>
            ))}

            {filteredDemos.length === 0 && (
              <div className="py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-wider select-none">
                No matching product demo bookings.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Demo Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden animate-slide-in">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[18px] font-bold text-slate-900">Schedule ZOOM Product Walkthrough</h2>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleBookDemoSubmit} className="px-6 py-6 space-y-5">
              <p className="text-[13px] font-medium text-slate-500 -mt-2">
                Locking a demo schedule for <span className="font-bold">{leads.find(l => l.id === bookForm.leadId)?.company || ''}</span>.
              </p>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">SELECT LEAD PROSPECT</label>
                <select
                  required
                  value={bookForm.leadId}
                  onChange={(e) => setBookForm({ ...bookForm, leadId: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-colors bg-white appearance-auto"
                >
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.company}
                    </option>
                  ))}
                  {leads.length === 0 && <option value="">No leads available</option>}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">SELECT DATE</label>
                <input
                  type="date"
                  required
                  value={bookForm.date}
                  onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">SELECT TIME BLOCK</label>
                <select
                  required
                  value={bookForm.time}
                  onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-colors bg-white appearance-auto"
                >
                  <option value="10:00 AM EST">10:00 AM EST</option>
                  <option value="11:00 AM EST">11:00 AM EST</option>
                  <option value="01:00 PM EST">01:00 PM EST</option>
                  <option value="03:00 PM EST">03:00 PM EST</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">MEETING AGENDA / HOST NOTES</label>
                <input
                  type="text"
                  required
                  value={bookForm.notes}
                  onChange={(e) => setBookForm({ ...bookForm, notes: e.target.value })}
                  placeholder="Walkthrough showcasing fleet telematics and factoring automation."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all mt-2"
              >
                Confirm Zoom Schedule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Demo Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md overflow-hidden shadow-2xl text-left flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" /> Log Demo Walkthrough Feedback
              </h3>
              <button 
                onClick={() => setShowFeedbackModal(null)} 
                className="text-slate-400 hover:text-slate-655 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFeedbackSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-700">
              {/* Target info */}
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-[11px]">
                <div className="text-slate-800 font-extrabold">Company: {showFeedbackModal.company}</div>
                <div className="text-slate-500 font-semibold mt-0.5">Presenter: {showFeedbackModal.presenter}</div>
              </div>

              {/* Rating Star Selection */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Session Performance Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                      className="cursor-pointer transition-transform active:scale-95 text-amber-400 hover:text-amber-500"
                    >
                      <Star 
                        className={`w-7 h-7 ${
                          star <= feedbackForm.rating 
                            ? 'fill-amber-400 stroke-amber-500' 
                            : 'text-slate-300 stroke-slate-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Walkthrough Feedback Notes
                </label>
                <textarea
                  required
                  value={feedbackForm.notes}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, notes: e.target.value })}
                  placeholder="Notes from presentation feedback, queries, custom integrations requested..."
                  rows="4"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 resize-none font-semibold"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(null)}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-3 rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs py-3 rounded-xl transition-colors cursor-pointer text-center shadow-xs"
                >
                  Log Feedback Comments
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
