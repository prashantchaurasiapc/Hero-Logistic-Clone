import React, { useState } from 'react';
import { 
  Bell, ChevronDown, Plus, Mail, Phone, Calendar, 
  Activity, ArrowRight, Check, X, User, Star, Clock,
  Play, Send, UserPlus
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell 
} from 'recharts';

export default function SalesDashboard() {
  const [salesRep, setSalesRep] = useState('Alex Wright');
  const [selectedLead, setSelectedLead] = useState('Vance Refrigeration (Robert Vance)');
  const [leadsStatus, setLeadsStatus] = useState({
    'Vance Refrigeration (Robert Vance)': 'NEW LEAD',
    'Hudson Logistics Corp (Jane Doe)': 'NEW LEAD'
  });
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showConvertButton, setShowConvertButton] = useState(false);
  const [showConversionWizard, setShowConversionWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Professional');
  const [estimatedValue, setEstimatedValue] = useState('$2,004/mo');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const [activities, setActivities] = useState([
    { title: 'Vance Refrigeration', date: '2026-07-14 02:15 PM', desc: 'Lead Created: Inbound workspace registration processed.', user: 'SYSTEM HUB', dotColor: 'bg-amber-400' },
    { title: 'Hudson Logistics Corp', date: '2026-07-12 11:40 AM', desc: 'Demo Scheduled: Zoom product walkthrough booked.', user: 'ALEX WRIGHT', dotColor: 'bg-indigo-500' },
    { title: 'Apex Freight Systems', date: '2026-07-09 04:30 PM', desc: 'Proposal Sent: SaaS License Proposal sent via email.', user: 'ALEX WRIGHT', dotColor: 'bg-emerald-500' },
    { title: 'Swift Cargo Express', date: '2026-07-07 10:15 AM', desc: 'Trial Started: 14-day Professional Trial activated.', user: 'SARAH CONNOR', dotColor: 'bg-[#00A3FF]' }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, company: 'Freight-A-Way', due: '2026-07-16 at 03:30 PM', task: 'Task + Touchpoint checklist regarding pain points: Fuel tax calculation mistakes.', status: 'OVERDUE', completed: false },
    { id: 2, company: 'QuickLoad Logistics', due: '2026-07-17 at 10:00 AM', task: 'Call + Touchpoint checklist regarding pain points: Driver dispatch automation.', status: 'OVERDUE', completed: false },
    { id: 3, company: 'Vance Refrigeration', due: '2026-07-19 at 02:00 PM', task: 'Demo Follow-up: Send customized pricing deck for 12 trucks.', status: 'UPCOMING', completed: false }
  ]);

  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    type: 'Phone Call',
    date: '2026-07-22',
    time: '11:00 AM',
    priority: 'High'
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    const createdObj = {
      id: Date.now(),
      company: newTaskForm.title || 'General Follow-up Task',
      due: `${newTaskForm.date} at ${newTaskForm.time}`,
      task: `${newTaskForm.type} (${newTaskForm.priority} Priority): Follow-up regarding software onboarding.`,
      status: 'UPCOMING',
      completed: false
    };
    setTasks([createdObj, ...tasks]);
    setShowAddTaskModal(false);
    setNewTaskForm({ title: '', type: 'Phone Call', date: '2026-07-22', time: '11:00 AM', priority: 'High' });
  };

  const toggleTaskCompleted = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Analytics Data
  const monthlyData = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 30000 },
    { name: 'Mar', value: 30000 },
    { name: 'Apr', value: 45000 },
    { name: 'May', value: 65000 },
    { name: 'Jun', value: 306960 }
  ];

  const conversionData = [
    { name: 'Leads', value: 50, color: '#6366F1' },
    { name: 'Demos', value: 20, color: '#3B82F6' },
    { name: 'Trials', value: 21, color: '#10B981' },
    { name: 'Proposals', value: 15, color: '#F59E0B' },
    { name: 'Won', value: 5, color: '#EF4444' }
  ];

  const kpis = [
    { label: 'NEW LEADS', value: '6', sub1: 'Stage: New', sub2: '6 pending' },
    { label: 'DEMOS BOOKED', value: '12', sub1: 'Upcoming', sub2: 'slots ready', subColor: 'text-emerald-500' },
    { label: 'TRIALS ACTIVE', value: '21', sub1: 'Active', sub2: 'usage monitored', subColor: 'text-emerald-500' },
    { label: 'PROPOSALS SENT', value: '10', sub1: 'Negotiating', sub2: 'awaiting signature', subColor: 'text-slate-500' },
    { label: 'DEALS WON', value: '5', sub1: 'Closed', sub2: 'syncing onboarding', subColor: 'text-emerald-500' },
    { label: 'DEALS LOST', value: '5', sub1: 'Closed', sub2: 'needs re-engagement', subColor: 'text-rose-500' }
  ];

  const stages = [
    { name: 'NEW LEAD', count: 6 },
    { name: 'CONTACTED', count: 6 },
    { name: 'DEMO BOOKED', count: 6 },
    { name: 'DEMO COMPLETED', count: 6 },
    { name: 'TRIAL STARTED', count: 6 },
    { name: 'PROPOSAL SENT', count: 5 },
    { name: 'NEGOTIATING', count: 5 },
    { name: 'WON', count: 5 },
    { name: 'LOST', count: 5 },
  ];

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 w-full text-left font-sans custom-scrollbar overflow-y-auto relative">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="text-emerald-400 w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Sales Dashboard
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Manage leads, pipeline, and sales reports.
          </p>
        </div>
      </div>

      {/* KPI Row Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3 pb-1">
        {[
          { label: 'NEW LEADS', value: '6', sub: '6 Pending', subColor: 'text-amber-600 bg-amber-50' },
          { label: 'DEMOS BOOKED', value: '12', sub: 'Slots Ready', subColor: 'text-indigo-600 bg-indigo-50' },
          { label: 'TRIALS ACTIVE', value: '21', sub: 'Active Usage', subColor: 'text-emerald-600 bg-emerald-50' },
          { label: 'PROPOSALS SENT', value: '10', sub: 'Negotiating', subColor: 'text-slate-600 bg-slate-100' },
          { label: 'DEALS WON', value: '5', sub: 'Closed & Synced', subColor: 'text-emerald-600 bg-emerald-50' },
          { label: 'DEALS LOST', value: '5', sub: 'Needs Re-engage', subColor: 'text-rose-600 bg-rose-50' },
          { label: 'PIPELINE VALUE', value: '$306,960', sub: 'Potential MRR', subColor: 'text-emerald-600 bg-emerald-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-3xs hover:shadow-2xs transition-all flex flex-col justify-between h-[96px]">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate" title={kpi.label}>
                {kpi.label}
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5 tracking-tight">{kpi.value}</h3>
            </div>
            <div className="flex items-center justify-between gap-1 mt-1">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold truncate ${kpi.subColor}`}>
                {kpi.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Workspaces */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stage Distribution Matrix */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-widest">PIPELINE STAGE DISTRIBUTION MATRIX</h3>
              <span className="text-[10px] font-extrabold text-slate-500">58 Leads Active</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {stages.map((stg, i) => (
                <div key={i} className="flex-shrink-0 w-[100px] bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center relative">
                  <span className="text-[9px] font-black text-slate-400 uppercase text-center mb-1">{stg.name}</span>
                  <span className="text-base font-black text-slate-800">{stg.count}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-2 left-2"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Workspace */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-widest">SELECTED LEAD DETAILS WORKSPACE</h3>
                <div className="relative">
                  <select 
                    value={selectedLead}
                    onChange={(e) => setSelectedLead(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-slate-800 font-bold text-xs py-1.5 pl-3 pr-8 rounded-lg outline-none cursor-pointer"
                  >
                    <option>Vance Refrigeration (Robert Vance)</option>
                    <option>Hudson Logistics Corp (Jane Doe)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
                </div>
              </div>
              {(() => {
                const status = leadsStatus[selectedLead] || 'NEW LEAD';
                let style = 'text-amber-600 bg-amber-50 border-amber-200';
                if (status === 'DEAL WON') style = 'text-emerald-700 bg-emerald-50 border-emerald-300';
                if (status === 'DEAL LOST') style = 'text-rose-700 bg-rose-50 border-rose-300';
                if (status === 'CONVERTED TO COMPANY') style = 'text-amber-800 bg-amber-100 border-amber-300';
                return (
                  <span className={`text-[10px] font-black px-3.5 py-1.5 rounded-lg border uppercase transition-all shadow-3xs ${style}`}>
                    {status}
                  </span>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">FLEET SIZE</p>
                <p className="text-xs font-extrabold text-slate-900">12 Trucks</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">TRANSPORT NICHE</p>
                <p className="text-xs font-extrabold text-slate-900">Car Carrying</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">CURRENT SOFTWARE</p>
                <p className="text-xs font-extrabold text-slate-900">Spreadsheets (Excel)</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">ESTIMATED VALUE</p>
                <p className="text-xs font-extrabold text-amber-500">$2,004/mo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">CORE PAIN POINTS</p>
                <p className="text-xs font-semibold text-slate-700 italic">"Manual route sheets take hours"</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">NEXT FOLLOW-UP TARGET</p>
                  <p className="text-sm font-extrabold text-slate-900">2026-07-13</p>
                </div>
                <button className="text-[10px] font-black text-amber-600 uppercase tracking-widest">SCHEDULE</button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">INTERNAL NOTES / LOG COMMENT</p>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-medium text-slate-600 flex justify-between items-end">
                <p>Client looking to automate Car Carrying dispatch workflows. Currently using Spreadsheets (Excel).</p>
                <span className="text-[9px] text-slate-400 font-bold">- Alex Wright on 2026-07-08</span>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-3">CRM DIRECT DISPATCH ACTIONS</p>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px] font-bold text-slate-500">Rep:</span>
                  <select 
                    value={salesRep}
                    onChange={(e) => setSalesRep(e.target.value)}
                    className="text-[11px] font-extrabold text-slate-900 outline-none bg-transparent cursor-pointer pl-1 pr-4 appearance-none relative"
                    style={{ background: 'url("data:image/svg+xml;utf8,<svg fill=%2394A3B8 height=16 viewBox=0 0 24 24 width=16 xmlns=http://www.w3.org/2000/svg><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right center' }}
                  >
                    <option>Alex Wright</option>
                    <option>Sarah Connor</option>
                  </select>
                </div>
                <button onClick={() => setShowRecommendModal(true)} className="bg-[#4B0082] text-white text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-purple-900 transition-all cursor-pointer active:scale-95">
                  <Star className="w-3.5 h-3.5" /> Recommend Plan
                </button>
                <button onClick={() => setShowDemoModal(true)} className="bg-[#ffcc00] text-black text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-[#e6b800] transition-all cursor-pointer active:scale-95">
                  <Calendar className="w-3.5 h-3.5" /> Book Demo
                </button>
                <button onClick={() => setShowTrialModal(true)} className="bg-slate-800 text-white text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-slate-900 transition-all cursor-pointer active:scale-95">
                  <Play className="w-3.5 h-3.5" fill="currentColor" /> Start Trial
                </button>
                <button onClick={() => setShowProposalModal(true)} className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer active:scale-95">
                  <Send className="w-3.5 h-3.5" /> Send Proposal
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <button 
                  onClick={() => {
                    setLeadsStatus(prev => ({ ...prev, [selectedLead]: 'DEAL WON' }));
                    setShowConvertButton(true);
                  }}
                  className="bg-[#0F9D58] text-white text-[10px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#0b8043] shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" /> Mark Won
                </button>
                <button 
                  onClick={() => {
                    setLeadsStatus(prev => ({ ...prev, [selectedLead]: 'DEAL LOST' }));
                    setShowConvertButton(false);
                  }}
                  className="bg-[#990000] text-white text-[10px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#800000] shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <X className="w-3.5 h-3.5" /> Mark Lost
                </button>
                {showConvertButton && (
                  <button 
                    onClick={() => {
                      setLeadsStatus(prev => ({ ...prev, [selectedLead]: 'CONVERTED TO COMPANY' }));
                      setWizardStep(1);
                      setShowConversionWizard(true);
                    }}
                    className="bg-[#E68A00] text-white text-[10px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#cc7a00] shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Convert to Company
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowMailModal(true)}
                  title="Send Email"
                  className="p-2.5 border border-slate-200 rounded-xl text-blue-500 hover:bg-blue-50 hover:border-blue-300 transition-all"
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowCallModal(true)}
                  title="Log Phone Call"
                  className="p-2.5 border border-slate-200 rounded-xl text-green-500 hover:bg-green-50 hover:border-green-300 transition-all"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  title="Schedule Follow-up"
                  className="p-2.5 border border-slate-200 rounded-xl text-amber-500 hover:bg-amber-50 hover:border-amber-300 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <input 
                  type="text" 
                  placeholder="Quick write note and press Enter..." 
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tasks & Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">UPCOMING FOLLOW-UP TASKS ({tasks.length})</h3>
              <button 
                onClick={() => setShowAddTaskModal(true)} 
                className="text-[9px] font-black border border-amber-500 bg-amber-50 rounded-lg px-2.5 py-1 text-amber-600 uppercase hover:bg-amber-100 transition-all cursor-pointer shadow-3xs active:scale-95"
              >
                + ADD TASK
              </button>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium py-4 text-center">No upcoming tasks.</p>
              ) : (
                tasks.map((t) => (
                  <div 
                    key={t.id} 
                    className={`border rounded-2xl p-4 relative group transition-all bg-white hover:border-amber-300 shadow-3xs ${
                      t.completed ? 'border-emerald-200 bg-emerald-50/20 opacity-70' : 'border-slate-200'
                    }`}
                  >
                    <div className="absolute right-4 top-4">
                      <button 
                        onClick={() => toggleTaskCompleted(t.id)}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          t.completed 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-slate-300 text-slate-300 hover:border-emerald-400 hover:text-emerald-500'
                        }`}
                        title={t.completed ? "Mark Incomplete" : "Mark Completed"}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-xs font-black text-slate-900 ${t.completed ? 'line-through text-slate-400' : ''}`}>{t.company}</h4>
                      {t.status === 'OVERDUE' && !t.completed && (
                        <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded uppercase">Overdue</span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mb-1.5">Due: {t.due}</p>
                    <p className={`text-[11px] font-semibold text-amber-700 leading-snug ${t.completed ? 'line-through text-slate-400' : ''}`}>{t.task}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity Timeline Card */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">RECENT ACTIVITY TIMELINE</h3>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="relative border-l-2 border-slate-200 ml-2 space-y-5 py-1">
                {[
                  {
                    title: 'Vance Refrigeration',
                    date: '2026-07-14 02:15 PM',
                    desc: 'Lead Created: Inbound workspace registration processed.',
                    user: 'SYSTEM HUB',
                    dotColor: 'bg-amber-400'
                  },
                  {
                    title: 'Hudson Logistics Corp',
                    date: '2026-07-12 11:40 AM',
                    desc: 'Demo Scheduled: Zoom product walkthrough booked with Robert Vance.',
                    user: 'ALEX WRIGHT',
                    dotColor: 'bg-indigo-500'
                  },
                  {
                    title: 'Apex Freight Systems',
                    date: '2026-07-09 04:30 PM',
                    desc: 'Proposal Sent: SaaS License Proposal sent via email.',
                    user: 'ALEX WRIGHT',
                    dotColor: 'bg-emerald-500'
                  },
                  {
                    title: 'Swift Cargo Express',
                    date: '2026-07-07 10:15 AM',
                    desc: 'Trial Started: 14-day Professional Trial activated.',
                    user: 'SARAH CONNOR',
                    dotColor: 'bg-[#00A3FF]'
                  },
                  {
                    title: 'Global Shipping Co.',
                    date: '2026-07-05 03:00 PM',
                    desc: 'Deal Won: Enterprise License tier finalized & onboarded.',
                    user: 'ALEX WRIGHT',
                    dotColor: 'bg-emerald-600'
                  },
                  {
                    title: 'FastTrack Networks',
                    date: '2026-07-02 09:20 AM',
                    desc: 'Phone Call Logged: Follow-up call completed regarding fleet pricing.',
                    user: 'SARAH CONNOR',
                    dotColor: 'bg-purple-500'
                  }
                ].map((act, idx) => (
                  <div key={idx} className="relative pl-5 group">
                    <div className={`absolute w-2.5 h-2.5 ${act.dotColor} rounded-full -left-[6px] top-1 border-2 border-white group-hover:scale-125 transition-transform`}></div>
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className="text-[11px] font-black text-slate-900">{act.title}</h4>
                      <span className="text-[9px] font-bold text-slate-400 shrink-0">{act.date}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-600 mb-1 leading-snug">{act.desc}</p>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                      USER: {act.user}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xs font-black text-slate-900">Monthly Sales Analytics</h3>
            <p className="text-[10px] font-medium text-slate-500">Pipeline growth performance forecast.</p>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ r: 0 }}
                  activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  data={monthlyData.map(d => ({...d, value: d.value * 0.4}))}
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xs font-black text-slate-900">Conversion Rate Chart</h3>
            <p className="text-[10px] font-medium text-slate-500">Funnel efficiency progression across stages.</p>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#F8FAFC'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Create New Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[550px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Create New Task</h2>
              <button 
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleCreateTask} className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Task Title / Lead Company
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Vance Refrigeration Follow-up"
                  value={newTaskForm.title}
                  onChange={e => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-400 transition-colors placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Task Type
                  </label>
                  <select 
                    value={newTaskForm.type}
                    onChange={e => setNewTaskForm({ ...newTaskForm, type: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 transition-colors bg-white cursor-pointer"
                  >
                    <option>Phone Call</option>
                    <option>Email Touchpoint</option>
                    <option>Product Demo</option>
                    <option>Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Due Date
                  </label>
                  <input 
                    type="date" 
                    required
                    value={newTaskForm.date}
                    onChange={e => setNewTaskForm({ ...newTaskForm, date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Priority
                  </label>
                  <select 
                    value={newTaskForm.priority}
                    onChange={e => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 transition-colors bg-white cursor-pointer"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,204,0,0.4)] transition-all mt-2 cursor-pointer active:scale-95"
              >
                CREATE & ADD TO TASKS LIST
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Schedule ZOOM Product Walkthrough Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-visible animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[17px] font-black text-slate-900">Schedule ZOOM Product Walkthrough</h2>
              <button onClick={() => setShowDemoModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-[13px] font-semibold text-slate-500">Locking a demo schedule for {selectedLead.split(' ')[0]} Refrigeration.</p>
              
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">SELECT DATE</label>
                <div className="relative">
                  <input type="date" defaultValue="2026-07-17" className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">SELECT TIME BLOCK</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 transition-colors appearance-none bg-white">
                  <option>11:00 AM EST</option>
                  <option>1:00 PM EST</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">MEETING AGENDA / HOST NOTES</label>
                <textarea rows="2" className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 transition-colors resize-none" defaultValue="Walkthrough showcasing fleet telematics and factoring automation."></textarea>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => {
                    setShowDemoModal(false);
                    triggerToast(`Zoom Demo scheduled for ${selectedLead.split(' ')[0]}!`);
                    setActivities([
                      { title: selectedLead.split(' ')[0], date: 'Just now', desc: 'Demo Booked: Zoom product walkthrough confirmed.', user: salesRep.toUpperCase(), dotColor: 'bg-indigo-500' },
                      ...activities
                    ]);
                  }} 
                  className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[13px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all cursor-pointer active:scale-95"
                >
                  Confirm Zoom Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start 14-Day Free Trial Modal */}
      {showTrialModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Play size={16} fill="currentColor" />
                </div>
                <h2 className="text-base font-black text-slate-900">Start Platform Trial</h2>
              </div>
              <button onClick={() => setShowTrialModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-xs font-semibold text-slate-500">
                Activating free trial access for <strong className="text-slate-900">{selectedLead.split(' ')[0]} Refrigeration</strong>.
              </p>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">TRIAL DURATION</label>
                <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400 bg-white cursor-pointer">
                  <option>14 Days Free Trial</option>
                  <option>30 Days Extended Trial</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">FEATURE MODULE ACCESS</label>
                <div className="space-y-2 text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Full Suite (Dispatch, Tracking, Accounts)</p>
                  <p className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Up to 15 Driver App Licenses</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowTrialModal(false);
                  setLeadsStatus(prev => ({ ...prev, [selectedLead]: 'TRIAL ACTIVE' }));
                  triggerToast(`14-Day Free Trial activated for ${selectedLead.split(' ')[0]}!`);
                  setActivities([
                    { title: selectedLead.split(' ')[0], date: 'Just now', desc: 'Trial Started: 14-day Free Trial activated on platform.', user: salesRep.toUpperCase(), dotColor: 'bg-[#00A3FF]' },
                    ...activities
                  ]);
                }} 
                className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs py-3.5 rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
              >
                ACTIVATE FREE TRIAL NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Licensing Agreement Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-visible animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[17px] font-black text-slate-900">Issue Licensing Agreement Proposal</h2>
              <button onClick={() => setShowProposalModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">PROPOSAL TITLE DOCUMENT</label>
                <input type="text" defaultValue="Hero Logistics SaaS License - Vance Refrigeration" className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">LINE ITEMS</label>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <input type="text" defaultValue="Enterprise License Tier base" className="w-2/3 border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 transition-colors" />
                    <input type="text" defaultValue="2004" className="w-1/3 border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 transition-colors" />
                  </div>
                  <div className="flex gap-4">
                    <input type="text" defaultValue="GPS Fleet Tracking Modules API" className="w-2/3 border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 transition-colors" />
                    <input type="text" defaultValue="301" className="w-1/3 border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 transition-colors" />
                  </div>
                </div>
                <button className="text-[10px] font-black text-[#E68A00] mt-2 hover:text-amber-600 transition-colors">+ Add Custom Add-on item</button>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">CORPORATE DISCOUNT (%)</label>
                  <input type="text" defaultValue="0" className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 transition-colors" />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">PROPOSAL VALIDITY TERM</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 transition-colors appearance-none bg-white">
                    <option>30 Days validity</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button onClick={() => setShowProposalModal(false)} className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[13px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all">
                  Dispatched Proposal Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive License Tier Recommendation Modal */}
      {showRecommendModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100 shrink-0">
              <h2 className="text-[16px] font-black text-slate-900">Interactive License Tier Recommendation</h2>
              <button onClick={() => setShowRecommendModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">LEAD DIAGNOSIS</p>
                <h3 className="text-[17px] font-black text-slate-800 mb-1">{selectedLead.split(' ')[0]} Refrigeration</h3>
                <p className="text-[13px] font-medium text-slate-500">Fleet Size: <span className="text-slate-700 font-bold">12 Trucks</span> &bull; Current Software: <span className="text-slate-700 font-bold">Spreadsheets (Excel)</span></p>
              </div>

              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-4">AVAILABLE LICENSE PLAN TIERS</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Starter Plan (Recommended) */}
                <div className="border border-[#FFD400] bg-[#FFFBF0] rounded-2xl p-5 flex flex-col relative overflow-hidden">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="text-[15px] font-black text-slate-900">Starter</h4>
                      <span className="bg-[#FFD400] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm">RECOMMENDED</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 leading-tight">For small operators &lt; 35 trucks</p>
                  </div>
                  <div className="mb-5">
                    <div className="flex items-end gap-0.5">
                      <span className="text-2xl font-black text-slate-900">$199</span>
                      <span className="text-[11px] font-bold text-slate-500 mb-1">/mo</span>
                    </div>
                  </div>
                  
                  <div className="h-[1px] w-full bg-slate-200/50 mb-5"></div>
                  
                  <ul className="space-y-3 mb-6 flex-1">
                    <li className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600">
                      <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3]" /> Core Dispatching
                    </li>
                    <li className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600">
                      <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3]" /> Basic Driver App
                    </li>
                    <li className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600">
                      <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3]" /> GPS Tracking (hourly)
                    </li>
                    <li className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600">
                      <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3]" /> Email Support
                    </li>
                  </ul>
                  
                  <button onClick={() => setShowRecommendModal(false)} className="w-full bg-[#FFD400] hover:bg-[#FACC15] text-slate-900 font-black text-[11px] py-3.5 rounded-xl shadow-[0_2px_10px_rgba(255,212,0,0.4)] transition-all uppercase tracking-wider text-center">
                    APPLY STARTER PLAN
                  </button>
                </div>

                {/* Professional Plan */}
                <div className="border border-slate-200 rounded-2xl p-5 flex flex-col">
                  <div className="mb-4">
                    <h4 className="text-[15px] font-black text-slate-700 mb-1.5">Professional</h4>
                    <p className="text-[11px] font-medium text-slate-400 leading-tight">For growing fleets 35 - 100 trucks</p>
                  </div>
                  <div className="mb-5">
                    <div className="flex items-end gap-0.5">
                      <span className="text-2xl font-black text-slate-700">$499</span>
                      <span className="text-[11px] font-bold text-slate-400 mb-1">/mo</span>
                    </div>
                  </div>
                  
                  <div className="h-[1px] w-full bg-slate-100 mb-5"></div>
                  
                  <ul className="space-y-3 mb-6 flex-1">
                    <li className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                      <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" /> Dynamic Dispatching
                    </li>
                    <li className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                      <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" /> Factor Integration A...
                    </li>
                    <li className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                      <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" /> GPS Tracking (live H...
                    </li>
                    <li className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                      <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" /> Priority Support
                    </li>
                  </ul>
                  
                  <button onClick={() => setShowRecommendModal(false)} className="w-full bg-transparent text-slate-500 font-bold text-[11px] py-3.5 rounded-xl transition-all uppercase tracking-wider hover:bg-slate-50 text-center">
                    APPLY PROFESSIONAL PLAN
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="border border-slate-200 rounded-2xl p-5 flex flex-col">
                  <div className="mb-4">
                    <h4 className="text-[15px] font-black text-slate-700 mb-1.5">Enterprise</h4>
                    <p className="text-[11px] font-medium text-slate-400 leading-tight">For logistics giants &gt; 100 trucks</p>
                  </div>
                  <div className="mb-5">
                    <div className="flex items-end gap-0.5">
                      <span className="text-2xl font-black text-slate-700">$1299</span>
                      <span className="text-[11px] font-bold text-slate-400 mb-1">/mo</span>
                    </div>
                  </div>
                  
                  <div className="h-[1px] w-full bg-slate-100 mb-5"></div>
                  
                  <ul className="space-y-3 mb-6 flex-1">
                    <li className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                      <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" /> AI CommandCenter ...
                    </li>
                    <li className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                      <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" /> Custom Billing Rules
                    </li>
                    <li className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                      <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" /> Unlimited Drivers/H...
                    </li>
                    <li className="flex items-center gap-2.5 text-[11px] font-medium text-slate-500">
                      <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" /> Dedicated SLA Custo...
                    </li>
                  </ul>
                  
                  <button onClick={() => setShowRecommendModal(false)} className="w-full bg-transparent text-slate-500 font-bold text-[11px] py-3.5 rounded-xl transition-all uppercase tracking-wider hover:bg-slate-50 text-center">
                    APPLY ENTERPRISE PLAN
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Modal - Compose Email Touchpoint */}
      {showMailModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-slate-900">Compose Email Touchpoint</h2>
              <button onClick={() => setShowMailModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 space-y-4">
              {/* Select Template Layout */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">SELECT TEMPLATE LAYOUT</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-colors bg-white appearance-auto">
                  <option>Welcome Sandbox Invite</option>
                  <option>Follow-up Outreach</option>
                  <option>Demo Confirmation</option>
                  <option>Proposal Follow-up</option>
                  <option>Custom Email</option>
                </select>
              </div>

              {/* Email Subject */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">EMAIL SUBJECT</label>
                <input
                  type="text"
                  defaultValue="Welcome Sandbox Invite"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                />
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-slate-700">Message Body</label>
                <textarea
                  rows={6}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors resize-y"
                  placeholder=""
                />
              </div>

              {/* Bottom Row: Email Status + Process Mail */}
              <div className="flex items-end gap-3 pt-1">
                <div className="flex-1 space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">EMAIL STATUS</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-colors bg-white appearance-auto">
                    <option>Send Immediately</option>
                    <option>Schedule for Later</option>
                    <option>Save as Draft</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowMailModal(false)}
                  className="bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] px-6 py-3 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all whitespace-nowrap"
                >
                  Process Mail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Log Phone Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-slate-900">Log Outgoing / Incoming Phone call</h2>
              <button onClick={() => setShowCallModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 space-y-4">
              {/* Call Duration + Outcome side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">CALL DURATION</label>
                  <input
                    type="text"
                    defaultValue="2m 15s"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">OUTCOME</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-colors bg-white appearance-auto">
                    <option>Connected</option>
                    <option>No Answer</option>
                    <option>Voicemail</option>
                    <option>Busy</option>
                    <option>Wrong Number</option>
                  </select>
                </div>
              </div>

              {/* Call Notes */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">CALL NOTES</label>
                <input
                  type="text"
                  placeholder=""
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                />
              </div>

              {/* Save Call Entry Button */}
              <button
                onClick={() => setShowCallModal(false)}
                className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all mt-2"
              >
                Save Call Entry
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Schedule Follow-up / Calendar Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-slate-900">Schedule Follow-Up Touchpoint</h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 space-y-4">
              {/* Subtitle */}
              <p className="text-[13px] font-medium text-slate-400 -mt-2">Scheduling a follow-up action for prospect .</p>

              {/* Follow-Up Action Type + Priority Tier */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">FOLLOW-UP ACTION TYPE</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-colors bg-white appearance-auto">
                    <option>📞 Phone Call</option>
                    <option>✉️ Email</option>
                    <option>📅 Meeting</option>
                    <option>💬 WhatsApp</option>
                    <option>📝 Task</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">PRIORITY TIER</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-colors bg-white appearance-auto">
                    <option>🔴 High</option>
                    <option selected>🟡 Medium</option>
                    <option>🟢 Low</option>
                  </select>
                </div>
              </div>

              {/* Target Date + Time Slot */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">TARGET DATE</label>
                  <input
                    type="date"
                    defaultValue="2026-07-15"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">TIME SLOT</label>
                  <input
                    type="text"
                    defaultValue="10:00 AM"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                </div>
              </div>

              {/* Follow-Up Memo / Action Notes */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">FOLLOW-UP MEMO / ACTION NOTES</label>
                <input
                  type="text"
                  defaultValue="Urgent follow-up touchpoint."
                  className="w-full border border-amber-400 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                />
              </div>

              {/* Schedule Follow-Up Task Button */}
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all mt-1"
              >
                Schedule Follow-Up Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Conversion Wizard */}
      {showConversionWizard && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[600px] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[18px] font-bold text-slate-900">Company Conversion Wizard</h2>
              <button onClick={() => setShowConversionWizard(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Progress */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 text-[11px] font-bold">
              {[
                { num: 1, label: 'TIER' },
                { num: 2, label: 'COMPANY' },
                { num: 3, label: 'ADMIN' },
                { num: 4, label: 'DEPOT' },
                { num: 5, label: 'REVIEW' },
                { num: 6, label: 'SYNC' }
              ].map(step => (
                <div key={step.num} className={`uppercase ${wizardStep === step.num ? 'text-[#FFB020]' : 'text-slate-600'}`}>
                  {step.num}. {step.label}
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">CHOOSE SUBSCRIPTION LICENSE</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        onClick={() => setSelectedPlan('Starter')}
                        className={`rounded-xl p-4 text-center cursor-pointer transition-colors ${selectedPlan === 'Starter' ? 'border-2 border-[#FFB020] bg-yellow-50/50' : 'border border-slate-200 hover:border-[#FFB020]'}`}
                      >
                        <div className="font-bold text-slate-900 text-[14px]">Starter</div>
                        <div className="text-[13px] text-slate-500">$199/mo</div>
                      </div>
                      <div 
                        onClick={() => setSelectedPlan('Professional')}
                        className={`rounded-xl p-4 text-center cursor-pointer transition-colors ${selectedPlan === 'Professional' ? 'border-2 border-[#FFB020] bg-yellow-50/50' : 'border border-slate-200 hover:border-[#FFB020]'}`}
                      >
                        <div className="font-bold text-slate-900 text-[14px]">Professional</div>
                        <div className="text-[13px] text-slate-500">$499/mo</div>
                      </div>
                      <div 
                        onClick={() => setSelectedPlan('Enterprise')}
                        className={`rounded-xl p-4 text-center cursor-pointer transition-colors ${selectedPlan === 'Enterprise' ? 'border-2 border-[#FFB020] bg-yellow-50/50' : 'border border-slate-200 hover:border-[#FFB020]'}`}
                      >
                        <div className="font-bold text-slate-900 text-[14px]">Enterprise</div>
                        <div className="text-[13px] text-slate-500">$1,299/mo</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">BILLING FREQUENCY</label>
                    <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFB020] transition-colors bg-white appearance-auto">
                      <option>Monthly</option>
                      <option>Yearly (20% Discount)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setWizardStep(2)}
                    className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all"
                  >
                    Continue
                  </button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">COMPANY LEGAL INFORMATION</label>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">LEGAL COMPANY NAME</label>
                        <input
                          type="text"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFB020] focus:ring-2 focus:ring-[#FFB020]/20 transition-colors"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">DOT REGISTRY NUMBER</label>
                          <input
                            type="text"
                            defaultValue="DOT-767684"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFB020] focus:ring-2 focus:ring-[#FFB020]/20 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">CORPORATE TAX ID</label>
                          <input
                            type="text"
                            defaultValue="TX-43-1604692"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFB020] focus:ring-2 focus:ring-[#FFB020]/20 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setWizardStep(3)}
                      className="flex-1 bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all"
                    >
                      Continue
                    </button>
                    <button
                      onClick={() => setWizardStep(1)}
                      className="px-6 py-3.5 text-slate-600 font-bold text-[14px] hover:bg-slate-50 rounded-xl transition-all"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">DEFINE SYSTEM ADMINISTRATOR WORKSPACE PROFILE</label>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">ADMIN FULL NAME</label>
                        <input
                          type="text"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFB020] focus:ring-2 focus:ring-[#FFB020]/20 transition-colors"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">ADMIN LOGIN EMAIL</label>
                        <input
                          type="email"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFB020] focus:ring-2 focus:ring-[#FFB020]/20 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setWizardStep(4)}
                      className="flex-1 bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all"
                    >
                      Continue
                    </button>
                    <button
                      onClick={() => setWizardStep(2)}
                      className="px-6 py-3.5 text-slate-600 font-bold text-[14px] hover:bg-slate-50 rounded-xl transition-all"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">ASSIGN REGIONAL BRANCH TERMINAL</label>
                    
                    <div className="space-y-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">DEPOT LOCATION</label>
                      <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFB020] transition-colors bg-white appearance-auto">
                        <option>Chicago HQ Terminal</option>
                        <option>New York Terminal</option>
                        <option>Dallas Hub</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setWizardStep(5)}
                      className="flex-1 bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all"
                    >
                      Continue
                    </button>
                    <button
                      onClick={() => setWizardStep(3)}
                      className="px-6 py-3.5 text-slate-600 font-bold text-[14px] hover:bg-slate-50 rounded-xl transition-all"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-6">
                  {isProvisioning ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="w-12 h-12 border-4 border-slate-100 border-t-[#FFB020] rounded-full animate-spin"></div>
                      <p className="text-slate-600 font-bold text-[14px]">Provisioning Workspace...</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">REVIEW WORKSPACE SPECIFICATIONS</label>
                        
                        <div className="border border-slate-200 rounded-xl p-5 space-y-3">
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="text-slate-500 font-medium">Subscription:</span>
                            <span className="text-slate-700 font-bold">Professional Plan (Monthly)</span>
                          </div>
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="text-slate-500 font-medium">Company:</span>
                            <span className="text-slate-700 font-bold"></span>
                          </div>
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="text-slate-500 font-medium">Admin User:</span>
                            <span className="text-slate-700 font-bold">()</span>
                          </div>
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="text-slate-500 font-medium">Depot Allocation:</span>
                            <span className="text-slate-700 font-bold">Chicago HQ Terminal</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setIsProvisioning(true);
                            setTimeout(() => {
                              setIsProvisioning(false);
                              setWizardStep(6);
                            }, 2000);
                          }}
                          className="flex-1 bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all"
                        >
                          Provision Workspace
                        </button>
                        <button
                          onClick={() => setWizardStep(4)}
                          className="px-6 py-3.5 text-slate-600 font-bold text-[14px] hover:bg-slate-50 rounded-xl transition-all"
                        >
                          Back
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {wizardStep === 6 && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-12 h-12 border-[4px] border-emerald-400 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-emerald-500" strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-[18px] font-bold text-slate-900">Company Workspace Provision Complete!</h3>
                    <p className="text-[13px] font-medium text-slate-500">Tenant profile successfully registered inside global administrative databases.</p>
                  </div>

                  <button
                    onClick={() => setShowConversionWizard(false)}
                    className="bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] px-8 py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <User className="w-4 h-4" />
                    Takeover Admin Session & Open Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
