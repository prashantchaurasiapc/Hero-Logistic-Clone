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
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showConvertButton, setShowConvertButton] = useState(false);
  const [showConversionWizard, setShowConversionWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Professional');

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
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 w-full text-left font-sans custom-scrollbar overflow-y-auto">
      
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

      {/* KPI Row */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="min-w-[150px] flex-1 bg-white border border-slate-100 rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{kpi.value}</h3>
            </div>
            <div className="mt-3 flex items-start justify-between gap-2 text-[9px] font-bold">
              <span className="text-slate-400 whitespace-nowrap">{kpi.sub1}</span>
              <span className={`text-right leading-tight ${kpi.subColor || 'text-slate-700'}`}>{kpi.sub2}</span>
            </div>
          </div>
        ))}
        {/* Total Pipeline Value */}
        <div className="min-w-[180px] flex-1 bg-white border border-slate-100 rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">TOTAL PIPELINE VALUE</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">$306,960</h3>
          </div>
          <div className="mt-3 flex items-start justify-between gap-2 text-[9px] font-bold">
            <span className="text-slate-400 whitespace-nowrap">Value of...</span>
            <span className="text-emerald-500 text-right leading-tight">Potential<br/>monthly<br/>MRR</span>
          </div>
        </div>
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
              <button className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200 uppercase">
                NEW LEAD
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
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

            <div className="grid grid-cols-2 gap-4 mb-6">
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
              <div className="flex flex-nowrap items-center gap-1 mb-4">
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
                <button onClick={() => setShowRecommendModal(true)} className="bg-[#4B0082] text-white text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-purple-900 transition-colors">
                  <Star className="w-3.5 h-3.5" /> Recommend Plan
                </button>
                <button onClick={() => setShowDemoModal(true)} className="bg-[#ffcc00] text-black text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-[#e6b800] transition-colors">
                  <Calendar className="w-3.5 h-3.5" /> Book Demo
                </button>
                <button className="bg-slate-800 text-white text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-slate-900 transition-colors">
                  <Play className="w-3.5 h-3.5" fill="currentColor" /> Start Trial
                </button>
                <button onClick={() => setShowProposalModal(true)} className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-slate-50 transition-colors">
                  <Send className="w-3.5 h-3.5" /> Send Proposal
                </button>
              </div>
              
              <div className="flex flex-nowrap items-center gap-1 mb-4">
                <button 
                  onClick={() => setShowConvertButton(true)}
                  className="bg-[#0F9D58] text-white text-[10px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#0b8043] shadow-sm transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Mark Won
                </button>
                <button 
                  onClick={() => setShowConvertButton(false)}
                  className="bg-[#990000] text-white text-[10px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#800000] shadow-sm transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Mark Lost
                </button>
                {showConvertButton && (
                  <button 
                    onClick={() => {
                      setWizardStep(1);
                      setShowConversionWizard(true);
                    }}
                    className="bg-[#E68A00] text-white text-[10px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#cc7a00] shadow-sm transition-colors"
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
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">UPCOMING FOLLOW-UP TASKS</h3>
              <button onClick={() => setShowAddTaskModal(true)} className="text-[9px] font-black border border-amber-500 bg-amber-50 rounded px-2 py-0.5 text-amber-600 uppercase hover:bg-amber-100 transition-colors">+ ADD TASK</button>
            </div>
            
            <div className="space-y-3">
              <div className="border border-slate-100 rounded-2xl p-4 relative group hover:border-amber-200 transition-colors bg-slate-50/30">
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <button className="w-6 h-6 rounded-full border border-emerald-400 flex items-center justify-center text-emerald-500 bg-emerald-50">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-xs font-black text-slate-900 mb-1">Freight-A-Way</h4>
                <p className="text-[10px] font-bold text-slate-500 mb-1">Due: 2026-07-16 at 03:30 PM</p>
                <p className="text-[10px] font-bold text-amber-600">Task: Task + Touchpoint checklist regarding pain points:<br/>Fuel tax calculation mistakes.</p>
              </div>
              <div className="border border-slate-100 rounded-2xl p-4 relative group hover:border-amber-200 transition-colors bg-slate-50/30">
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <button className="w-6 h-6 rounded-full border border-emerald-400 flex items-center justify-center text-emerald-500 bg-emerald-50">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-xs font-black text-slate-900 mb-1">QuickLoad Logistics</h4>
                <p className="text-[10px] font-bold text-slate-500 mb-1">Due: 2026-07-17 at 10:00 AM</p>
                <p className="text-[10px] font-bold text-amber-600">Task: Call + Touchpoint checklist regarding pain points:</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">RECENT ACTIVITY TIMELINE</h3>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <div className="relative border-l-2 border-slate-100 ml-2 space-y-6 pb-2">
              
              <div className="relative pl-6">
                <div className="absolute w-2 h-2 bg-amber-400 rounded-full -left-[5px] top-1.5 border-2 border-white"></div>
                <div className="flex gap-2 items-center mb-1">
                  <h4 className="text-[11px] font-black text-slate-900">Vance Refrigeration</h4>
                  <span className="text-[9px] font-bold text-slate-400">2026-07-14</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 mb-1 leading-snug">Lead Created: Inbound workspace registration processed.</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">User: System Hub</p>
              </div>
              
              <div className="relative pl-6">
                <div className="absolute w-2 h-2 bg-amber-400 rounded-full -left-[5px] top-1.5 border-2 border-white"></div>
                <div className="flex gap-2 items-center mb-1">
                  <h4 className="text-[11px] font-black text-slate-900">Hudson Logistics Corp</h4>
                  <span className="text-[9px] font-bold text-slate-400">2026-07-12</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 mb-1 leading-snug">Lead Created: Inbound workspace registration processed.</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">User: System Hub</p>
              </div>
              
              <div className="relative pl-6">
                <div className="absolute w-2 h-2 bg-amber-400 rounded-full -left-[5px] top-1.5 border-2 border-white"></div>
                <div className="flex gap-2 items-center mb-1">
                  <h4 className="text-[11px] font-black text-slate-900">Apex Freight Systems</h4>
                  <span className="text-[9px] font-bold text-slate-400">2026-07-09</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 leading-snug">Lead Created: Inbound workspace registration</p>
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
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2.5">
                  Task Title
                </label>
                <input 
                  type="text" 
                  placeholder="General followup Call"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-amber-400 transition-colors placeholder:text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2.5">
                    Task Type
                  </label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-amber-400 transition-colors appearance-none bg-white relative">
                    <option>Phone Call</option>
                    <option>Email</option>
                    <option>Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2.5">
                    Due Date
                  </label>
                  <input 
                    type="date" 
                    defaultValue="2026-07-14"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2.5">
                    Priority
                  </label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-amber-400 transition-colors appearance-none bg-white">
                    <option>Medium</option>
                    <option>High</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => setShowAddTaskModal(false)}
                className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-sm py-4 rounded-xl shadow-[0_4px_15px_rgba(255,204,0,0.4)] transition-colors mt-2"
              >
                Create Task checklist
              </button>
            </div>
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
                <button onClick={() => setShowDemoModal(false)} className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[13px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all">
                  Confirm Zoom Schedule
                </button>
              </div>
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
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[17px] font-black text-slate-900">Interactive License Tier Recommendation</h2>
              <button onClick={() => setShowRecommendModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">LEAD DIAGNOSIS</p>
                <h3 className="text-[17px] font-black text-slate-800 mb-1">{selectedLead.split(' ')[0]} Refrigeration</h3>
                <p className="text-[13px] font-medium text-slate-500">Fleet Size: <span className="text-slate-700 font-bold">12 Trucks</span> &bull; Current Software: <span className="text-slate-700 font-bold">Spreadsheets (Excel)</span></p>
              </div>

              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-4">AVAILABLE LICENSE PLAN TIERS</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Starter Plan (Recommended) */}
                <div className="border border-[#FFD400] bg-[#FFFBF0] rounded-2xl p-5 flex flex-col relative overflow-hidden">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="text-[15px] font-black text-slate-900">Starter</h4>
                      <span className="bg-[#FFD400] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm">RECOMMENDED</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 h-8 leading-tight">For small operators &lt;<br/>35 trucks</p>
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
                    <p className="text-[11px] font-medium text-slate-400 h-8 leading-tight">For growing fleets 35 -<br/>100 trucks</p>
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
                    <p className="text-[11px] font-medium text-slate-400 h-8 leading-tight">For logistics giants &gt;<br/>100 trucks</p>
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
