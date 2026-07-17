import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, ChevronDown, Package, Truck, DollarSign, Building2, MapPin,
  UserPlus, FileText, MoreVertical, Search, ArrowUpRight, ArrowDownRight,
  AlertCircle, MessageSquare, Clock, Map, CheckCircle2, XCircle, Download, Mail
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function CommandCentre() {
  const navigate = useNavigate();
  
  const [showAssignDriver, setShowAssignDriver] = React.useState(false);
  const [showTrackLoad, setShowTrackLoad] = React.useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = React.useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = React.useState(false);
  const [showMoreActions, setShowMoreActions] = React.useState(false);
  
  const [showAddNewTruck, setShowAddNewTruck] = React.useState(false);
  const [showExportReport, setShowExportReport] = React.useState(false);
  const [showSendBroadcast, setShowSendBroadcast] = React.useState(false);
  const [showSupportTicket, setShowSupportTicket] = React.useState(false);

  // --- MOCK DATA ---
  const loadStatusData = [
    { name: 'Draft', value: 1245, color: '#94A3B8' }, // slate-400
    { name: 'Assigned', value: 2156, color: '#3B82F6' }, // blue-500
    { name: 'In Transit', value: 6342, color: '#0EA5E9' }, // sky-500
    { name: 'Delivered', value: 2739, color: '#10B981' }, // emerald-500
    { name: 'Cancelled', value: 120, color: '#EF4444' } // rose-500
  ];

  const recentLoads = [
    { id: 'L-12548', route: 'Sydney → Melbourne', status: 'In Transit', driver: 'John D.', statusColor: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'L-12547', route: 'Brisbane → Adelaide', status: 'Assigned', driver: 'Mike T.', statusColor: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'L-12546', route: 'Perth → Fremantle', status: 'Picked Up', driver: 'Sarah K.', statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'L-12545', route: 'Melbourne → Sydney', status: 'Delivered', driver: 'John D.', statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'L-12544', route: 'Auckland → Hamilton', status: 'Draft', driver: '-', statusColor: 'text-slate-600 bg-slate-50 border-slate-200' },
  ];

  const driverAlerts = [
    { name: 'John D.', issue: 'License expires in 5 days', date: '20 May', avatar: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Mike T.', issue: 'Fatigue breach - Yesterday', date: '19 May', avatar: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Sarah K.', issue: 'Pre-start not completed', date: '19 May', avatar: 'https://i.pravatar.cc/150?u=3' },
    { name: 'David L.', issue: 'Maintenance overdue', date: '18 May', avatar: 'https://i.pravatar.cc/150?u=4' },
  ];

  const unreadMessages = [
    { name: 'John D.', msg: 'At delivery location, waiting for gate access.', time: '10:24 AM', count: 2, avatar: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Dispatch Team', msg: 'New load L-12548 assigned to you.', time: '09:15 AM', count: 1, avatar: null, icon: <Truck className="w-5 h-5 text-white" />, iconBg: 'bg-indigo-500' },
    { name: 'Mike T.', msg: 'Can you confirm pickup time window?', time: '08:47 AM', count: 3, avatar: 'https://i.pravatar.cc/150?u=2' },
  ];

  const pendingInvoices = [
    { id: 'INV-3021', client: 'ABC Motors', amount: '$78,450.00', due: 'Due in 5 days' },
    { id: 'INV-3020', client: 'Fast Logistics', amount: '$61,230.00', due: 'Due in 7 days' },
    { id: 'INV-3019', client: 'Prime Carriers', amount: '$48,920.00', due: 'Due in 10 days' },
    { id: 'INV-3018', client: 'Northline Trans...', amount: '$42,050.00', due: 'Due in 12 days' },
  ];

  const truckMaintenance = [
    { name: 'Truck 101 (Volvo)', reg: 'Reg: ABC123', metric: '10,000 km', due: 'Due in 4 days', isOverdue: false },
    { name: 'Truck 117 (Scania)', reg: 'Reg: XYZ987', metric: '5,500 km', due: 'Overdue', isOverdue: true },
    { name: 'Truck 104 (Kenworth)', reg: 'Reg: KEN104', metric: '8,000 km', due: 'Due in 8 days', isOverdue: false },
  ];

  const recentTickets = [
    { id: '#4587', title: 'Login issue', status: 'Open', date: '20 May', statusColor: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: '#4586', title: 'Error on invoice', status: 'In Progress', date: '20 May', statusColor: 'text-orange-600 bg-orange-50 border-orange-200' },
    { id: '#4585', title: 'Feature request', status: 'Waiting', date: '19 May', statusColor: 'text-purple-600 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 lg:p-8 w-full text-left font-sans overflow-y-auto min-h-0">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Command Centre</h1>
          <p className="text-sm font-medium text-slate-500">Overview of your fleet operations</p>
        </div>
        <button 
          onClick={() => navigate('/company-admin/loads', { state: { openNewLoadModal: true } })}
          className="bg-[#FFCC00] hover:bg-[#FACC15] text-black font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4 stroke-[3px]" /> New Load <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
        </button>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {/* Loads */}
        <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider">
              <Package className="w-3.5 h-3.5 text-blue-500" /> Loads (MTD)
            </div>
            <div className="text-[10px] font-black text-emerald-500 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 14%
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-1">12,482</div>
          <div className="text-[9px] font-medium text-slate-400">vs last month 10,927</div>
        </div>

        {/* Active Fleet */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-emerald-500" /> Active Fleet
            </div>
            <div className="text-[10px] font-black text-emerald-500 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 2%
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-1">415</div>
          <div className="text-[9px] font-medium text-slate-400">of 462 total</div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5 text-purple-500" /> Monthly Revenue
            </div>
            <div className="text-[10px] font-black text-emerald-500 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 4.5%
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-1">$1.2M</div>
          <div className="text-[9px] font-medium text-slate-400">vs last month $1.15M</div>
        </div>

        {/* Branches */}
        <div className="bg-white rounded-2xl p-4 border border-orange-200 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-orange-500" /> Branches
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-1">12</div>
          <div className="text-[9px] font-medium text-slate-400">Active branches</div>
        </div>

        {/* Total Depots */}
        <div className="bg-white rounded-2xl p-4 border border-teal-200 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-teal-500" /> Total Depots
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-1">24</div>
          <div className="text-[9px] font-medium text-slate-400">Across 3 countries</div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white border border-emerald-300 rounded-2xl p-5 shadow-sm mb-6">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 divide-x divide-slate-100">
          
          <button 
            onClick={() => navigate('/company-admin/loads', { state: { openNewLoadModal: true } })}
            className="flex items-start gap-3 pl-0 pr-2 group text-left">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <Plus className="w-4 h-4 stroke-[3px]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">New Load</div>
              <div className="text-[10px] font-medium text-slate-400">Create a new load</div>
            </div>
          </button>

          <button 
            onClick={() => setShowAssignDriver(true)}
            className="flex items-start gap-3 pl-4 pr-2 group text-left">
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
              <UserPlus className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">Assign Driver</div>
              <div className="text-[10px] font-medium text-slate-400">Assign to load</div>
            </div>
          </button>

          <button 
            onClick={() => setShowTrackLoad(true)}
            className="flex items-start gap-3 pl-4 pr-2 group text-left">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
              <MapPin className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">Track Load</div>
              <div className="text-[10px] font-medium text-slate-400">Live tracking</div>
            </div>
          </button>

          <button 
            onClick={() => setShowCreateCustomer(true)}
            className="flex items-start gap-3 pl-4 pr-2 group text-left">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
              <Building2 className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">Create Customer</div>
              <div className="text-[10px] font-medium text-slate-400">Add new customer</div>
            </div>
          </button>

          <button 
            onClick={() => setShowCreateInvoice(true)}
            className="flex items-start gap-3 pl-4 pr-2 group text-left">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
              <FileText className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">Create Invoice</div>
              <div className="text-[10px] font-medium text-slate-400">Generate invoice</div>
            </div>
          </button>

          <div className="relative pl-4 pr-0">
            <button 
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="flex items-start gap-3 group text-left w-full">
              <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-100 transition-colors">
                <MoreVertical className="w-4 h-4 stroke-[2.5px]" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">More Actions</div>
                <div className="text-[10px] font-medium text-slate-400">View all actions</div>
              </div>
            </button>

            {showMoreActions && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMoreActions(false)} />
                <div className="absolute left-4 top-full mt-2 w-[180px] bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 py-1.5">
                  <button 
                    onClick={() => { setShowMoreActions(false); setShowAddNewTruck(true); }} 
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">Add New Truck</span>
                  </button>
                  <button 
                    onClick={() => { setShowMoreActions(false); setShowExportReport(true); }} 
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors">
                    <Download className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">Export Report</span>
                  </button>
                  <button 
                    onClick={() => { setShowMoreActions(false); setShowSendBroadcast(true); }} 
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">Send Broadcast</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1 */}
        <div className="space-y-6">
          
          {/* Load Status (MTD) */}
          <div className="bg-white border border-blue-300 rounded-2xl p-5 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">Load Status (MTD)</h3>
            <div className="flex items-center">
              <div className="w-32 h-32 shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={loadStatusData}
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {loadStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip cursor={false} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-black text-slate-900">12,482</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Total Loads</span>
                </div>
              </div>
              <div className="flex-grow pl-4 space-y-2">
                {loadStatusData.map((status, i) => {
                  const percentage = Math.round((status.value / 12482) * 100);
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }}></span>
                        <span className="font-semibold text-slate-600">{status.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{status.value.toLocaleString()}</span>
                        <span className="font-medium text-slate-400 text-[10px]">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Unread Messages */}
          <div className="bg-white border border-purple-300 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Unread Messages</h3>
              <button className="text-[10px] font-bold text-blue-600 hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {unreadMessages.map((msg, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative shrink-0">
                    {msg.avatar ? (
                      <img src={msg.avatar} alt={msg.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full ${msg.iconBg} flex items-center justify-center`}>
                        {msg.icon}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white text-[8px] font-bold text-white flex items-center justify-center">
                      {msg.count}
                    </span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-xs font-bold text-slate-900 truncate pr-2">{msg.name}</span>
                      <span className="text-[9px] font-medium text-slate-400 shrink-0">{msg.time}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 truncate leading-snug">{msg.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Tickets Overview */}
          <div className="bg-white border border-amber-300 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Support Tickets Overview</h3>
              <button className="text-[10px] font-bold text-blue-600 hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="border border-blue-200 bg-blue-50/50 rounded-xl py-3 px-1">
                <div className="text-xl font-black text-blue-600 mb-0.5">5</div>
                <div className="text-[9px] font-bold text-slate-600 uppercase">Open</div>
              </div>
              <div className="border border-amber-200 bg-amber-50/50 rounded-xl py-3 px-1">
                <div className="text-xl font-black text-amber-500 mb-0.5">3</div>
                <div className="text-[9px] font-bold text-slate-600 uppercase">In Progress</div>
              </div>
              <div className="border border-purple-200 bg-purple-50/50 rounded-xl py-3 px-1">
                <div className="text-xl font-black text-purple-600 mb-0.5">1</div>
                <div className="text-[9px] font-bold text-slate-600 uppercase">Waiting</div>
              </div>
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl py-3 px-1">
                <div className="text-xl font-black text-emerald-500 mb-0.5">12</div>
                <div className="text-[9px] font-bold text-slate-600 uppercase">Resolved</div>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 2 */}
        <div className="space-y-6">
          
          {/* Recent Loads */}
          <div className="bg-white border border-blue-300 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Recent Loads</h3>
              <button className="text-[10px] font-bold text-blue-600 hover:underline">View all</button>
            </div>
            
            <table className="w-full text-left">
              <thead>
                <tr className="text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-3 font-medium">Load ID</th>
                  <th className="pb-3 font-medium">Route</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentLoads.map((load, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 text-[10px] font-bold text-slate-500">{load.id}</td>
                    <td className="py-3 text-[11px] font-extrabold text-slate-800">{load.route}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${load.statusColor}`}>
                        {load.status}
                      </span>
                    </td>
                    <td className="py-3 text-[10px] font-bold text-slate-700 text-right">{load.driver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pending Invoices */}
          <div className="bg-white border border-emerald-300 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">Pending Invoices</h3>
                <div className="text-2xl font-black text-slate-900 leading-none">$287,650.00</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total Pending</div>
              </div>
              <button className="text-[10px] font-bold text-blue-600 hover:underline">View all</button>
            </div>
            
            <div className="space-y-0 divide-y divide-slate-100">
              {pendingInvoices.map((inv, i) => (
                <div key={i} className="py-3 flex justify-between items-center group cursor-pointer hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors">
                  <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-bold text-slate-400">{inv.id}</span>
                    <span className="text-xs font-extrabold text-slate-800">{inv.client}</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="text-xs font-black text-slate-900">{inv.amount}</span>
                    <span className={`text-[9px] font-bold uppercase ${inv.due.includes('Overdue') ? 'text-rose-500' : 'text-slate-400'}`}>
                      {inv.due}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="bg-white border border-indigo-300 rounded-2xl p-5 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">Recent Tickets</h3>
            
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-50">
                {recentTickets.map((ticket, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 text-[10px] font-bold text-slate-400">{ticket.id}</td>
                    <td className="py-3 text-[11px] font-extrabold text-slate-800">{ticket.title}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${ticket.statusColor}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-3 text-[10px] font-medium text-slate-400 text-right">{ticket.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* COLUMN 3 */}
        <div className="space-y-6">
          
          {/* Driver Alerts */}
          <div className="bg-white border border-orange-300 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Driver Alerts</h3>
              <button className="text-[10px] font-bold text-blue-600 hover:underline">View all</button>
            </div>
            
            <div className="space-y-4">
              {driverAlerts.map((alert, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={alert.avatar} alt={alert.name} className="w-8 h-8 rounded-full border border-slate-200" />
                    <div>
                      <div className="text-[11px] font-extrabold text-slate-900 leading-tight mb-0.5">{alert.name}</div>
                      <div className="text-[10px] font-medium text-slate-500">{alert.issue}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-medium text-slate-400">{alert.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Truck Maintenance Due */}
          <div className="bg-white border border-rose-300 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Truck Maintenance Due</h3>
              <button className="text-[10px] font-bold text-blue-600 hover:underline">View all</button>
            </div>
            
            <div className="space-y-4">
              {truckMaintenance.map((truck, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-slate-900 leading-tight mb-0.5">{truck.name}</div>
                      <div className="text-[9px] font-bold text-slate-400">{truck.reg}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-black text-slate-700 leading-tight mb-0.5">{truck.metric}</div>
                    <div className={`text-[9px] font-bold uppercase tracking-wider ${truck.isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>
                      {truck.due}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help? */}
          <div className="bg-white border border-emerald-300 rounded-2xl p-5 shadow-sm">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-2">Need Help?</h3>
            <p className="text-xs font-medium text-slate-500 mb-4">Search our knowledge base or raise a new ticket.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/company-admin/knowledge-base')}
                className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold py-2.5 rounded-xl transition-colors">
                Knowledge Base
              </button>
              <button 
                onClick={() => setShowSupportTicket(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-2.5 rounded-xl shadow-sm transition-colors">
                New Support Ticket
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Assign Driver Modal */}
      {showAssignDriver && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[540px] overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Assign Driver</h2>
              <button onClick={() => setShowAssignDriver(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-4">
              <div className="mb-3">
                <label className="block text-sm font-semibold text-slate-600 mb-1">Select Load</label>
                <select className="w-full px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                  <option>L-12544 (Auckland → Hamilton)</option>
                  <option>L-12546 (Perth → Fremantle)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Available Drivers</label>
                <div className="border border-slate-200 rounded-lg p-1.5 space-y-1.5">
                  <div className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-md cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">SM</div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">Sam Mitchell</div>
                      <div className="text-[11px] font-medium text-emerald-600">Available - 8 hours remaining</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-md cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">JD</div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">John Doe</div>
                      <div className="text-[11px] font-medium text-emerald-600">Available - 10 hours remaining</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <button onClick={() => setShowAssignDriver(false)} className="px-4 py-1.5 text-sm font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={() => setShowAssignDriver(false)} className="px-5 py-1.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-bold rounded-lg shadow-sm">Assign to Load</button>
            </div>
          </div>
        </div>
      )}

      {/* Track Load Modal */}
      {showTrackLoad && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[540px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Track Load</h2>
              <button onClick={() => setShowTrackLoad(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="py-6 px-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 text-[#10B981] flex items-center justify-center mb-3">
                <MapPin className="w-10 h-10" />
              </div>
              <p className="text-sm text-slate-600 mb-5">Enter a Load ID or VIN to view its current location on the live map.</p>
              <input type="text" placeholder="e.g. L-12345" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-center text-slate-700 focus:outline-none focus:border-emerald-500 mb-5" />
              <button onClick={() => setShowTrackLoad(false)} className="w-full py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm">Find on Map</button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      {showCreateCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[540px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Add New Customer</h2>
              <button onClick={() => setShowCreateCustomer(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Company Name</label>
                <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Contact Name</label>
                  <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Email</label>
                  <input type="email" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 bg-white mt-2">
              <button onClick={() => setShowCreateCustomer(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={() => setShowCreateCustomer(false)} className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm">Save Customer</button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {showCreateInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[540px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Generate Invoice</h2>
              <button onClick={() => setShowCreateInvoice(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-slate-600 mb-4">Select completed loads to generate a combined invoice.</p>
              <div className="border border-slate-200 rounded-lg p-3.5 space-y-3.5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500" />
                  <div>
                    <div className="text-sm font-bold text-slate-800">L-12545 (Melbourne → Sydney)</div>
                    <div className="text-xs font-medium text-slate-500">Delivered - $1,450.00</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500" />
                  <div>
                    <div className="text-sm font-bold text-slate-800">L-12501 (Sydney → Brisbane)</div>
                    <div className="text-xs font-medium text-slate-500">Delivered - $2,100.00</div>
                  </div>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 bg-white mt-1">
              <button onClick={() => setShowCreateInvoice(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={() => setShowCreateInvoice(false)} className="px-5 py-2 bg-[#5b21b6] hover:bg-purple-800 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2">
                <FileText className="w-4 h-4" /> Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Truck Modal */}
      {showAddNewTruck && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[540px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Add New Truck</h2>
              <button onClick={() => setShowAddNewTruck(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Truck Name/Model</label>
                  <input type="text" placeholder="e.g. Volvo FH16" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Registration Number</label>
                  <input type="text" placeholder="e.g. ABC-1234" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Assigned Driver (Optional)</label>
                <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                  <option>Select a driver</option>
                  <option>John Doe</option>
                  <option>Sam Mitchell</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 bg-white mt-2">
              <button onClick={() => setShowAddNewTruck(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={() => setShowAddNewTruck(false)} className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm">Save Truck</button>
            </div>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {showExportReport && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[540px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Export Report</h2>
              <button onClick={() => setShowExportReport(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Report Type</label>
                <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                  <option>Overall Performance Report</option>
                  <option>Fleet Activity Report</option>
                  <option>Financial Summary</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Start Date</label>
                  <input type="date" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">End Date</label>
                  <input type="date" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 bg-white mt-2">
              <button onClick={() => setShowExportReport(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={() => setShowExportReport(false)} className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Broadcast Modal */}
      {showSendBroadcast && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[540px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Send Broadcast</h2>
              <button onClick={() => setShowSendBroadcast(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Recipients</label>
                <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                  <option>All Active Drivers</option>
                  <option>Depot Managers</option>
                  <option>Entire Fleet Team</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Message Content</label>
                <textarea rows="4" placeholder="Enter your broadcast message here..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 resize-none"></textarea>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 bg-white mt-2">
              <button onClick={() => setShowSendBroadcast(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={() => setShowSendBroadcast(false)} className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2">
                <Mail className="w-4 h-4" /> Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showSupportTicket && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[540px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">New Support Ticket</h2>
              <button onClick={() => setShowSupportTicket(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Issue Type</label>
                <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                  <option>Software Bug / Error</option>
                  <option>Billing Issue</option>
                  <option>Feature Request</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea rows="4" placeholder="Please describe the issue in detail..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 resize-none"></textarea>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 bg-white mt-2">
              <button onClick={() => setShowSupportTicket(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={() => setShowSupportTicket(false)} className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm">
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
