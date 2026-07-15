import React, { useState } from 'react';
import { 
  Bell, ChevronDown, Plus, Mail, Phone, Calendar, 
  Activity, ArrowRight, Check, X, User, Star, Clock 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell 
} from 'recharts';

export default function SalesDashboard() {
  const [salesRep, setSalesRep] = useState('Alex Wright');
  const [selectedLead, setSelectedLead] = useState('Vance Refrigeration (Robert Vance)');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

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
                <button className="bg-purple-600 text-white text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-purple-700 transition-colors">
                  <Star className="w-3.5 h-3.5" /> Recommend Plan
                </button>
                <button className="bg-[#ffcc00] text-black text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-[#e6b800] transition-colors">
                  <Calendar className="w-3.5 h-3.5" /> Book Demo
                </button>
                <button className="bg-slate-800 text-white text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-slate-900 transition-colors">
                  <Activity className="w-3.5 h-3.5" /> Start Trial
                </button>
                <button className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-slate-50 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Send Proposal
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <button className="bg-emerald-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-emerald-800 transition-colors">
                  <Check className="w-3.5 h-3.5" /> Mark Won
                </button>
                <button className="bg-rose-800 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-rose-900 transition-colors">
                  <X className="w-3.5 h-3.5" /> Mark Lost
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
                <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-sm py-4 rounded-xl shadow-sm transition-colors mt-2"
              >
                Create Task checklist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
