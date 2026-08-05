const fs = require('fs');
let file = fs.readFileSync('src/components/CompanyAdmin/AssetDetails.jsx', 'utf8');

// Ensure Printer icon is imported
if (!file.includes(', Printer }')) {
  file = file.replace(/} from 'lucide-react';/, ", Printer } from 'lucide-react';");
}

const mockDataAndState = `
const mockMaintenanceTasks = [
  { id: 1, task: 'Service & Maintenance', desc: 'Routine full service', type: 'Service', priority: 'High', freq: '250 Hours', lastDate: '24 May 2025', lastHrs: '1,000 Hrs', nextDate: '24 Jun 2025', nextHrs: '1,250 Hrs', status: 'Due Soon', daysRemaining: '18 days', assigned: 'James Patel', role: 'Workshop' },
  { id: 2, task: 'Oil & Filter Change', desc: 'Engine oil and filter', type: 'Service', priority: 'Medium', freq: '250 Hours', lastDate: '24 May 2025', lastHrs: '1,000 Hrs', nextDate: '24 Jun 2025', nextHrs: '1,250 Hrs', status: 'Due Soon', daysRemaining: '18 days', assigned: 'James Patel', role: 'Workshop' },
  { id: 3, task: 'Full Inspection', desc: 'Complete safety inspection', type: 'Inspection', priority: 'High', freq: 'Monthly', lastDate: '24 May 2025', lastHrs: null, nextDate: '24 Jun 2025', nextHrs: null, status: 'Due Soon', daysRemaining: '18 days', assigned: 'Robert Taylor', role: 'Safety Officer' },
  { id: 4, task: 'Hydraulic System Check', desc: 'Check hoses, leaks & pressure', type: 'Inspection', priority: 'Medium', freq: '500 Hours', lastDate: '10 May 2025', lastHrs: '950 Hrs', nextDate: '10 Jul 2025', nextHrs: '1,450 Hrs', status: 'Scheduled', daysRemaining: '34 days', assigned: 'James Patel', role: 'Workshop' },
  { id: 5, task: 'Fork & Mast Inspection', desc: 'Inspect forks, chains & mast', type: 'Inspection', priority: 'Medium', freq: 'Monthly', lastDate: '24 May 2025', lastHrs: null, nextDate: '24 Jun 2025', nextHrs: null, status: 'Scheduled', daysRemaining: '18 days', assigned: 'Robert Taylor', role: 'Safety Officer' },
  { id: 6, task: 'Tyre Check & Pressure', desc: 'Check tyre condition & pressure', type: 'Service', priority: 'Low', freq: 'Monthly', lastDate: '24 May 2025', lastHrs: null, nextDate: '24 Jun 2025', nextHrs: null, status: 'Scheduled', daysRemaining: '18 days', assigned: 'Workshop Team', role: null },
  { id: 7, task: 'Battery Check', desc: 'Check battery, terminals & charge', type: 'Service', priority: 'Low', freq: 'Monthly', lastDate: '10 May 2025', lastHrs: null, nextDate: '10 Jun 2025', nextHrs: null, status: 'Completed', daysRemaining: 'Completed', assigned: 'James Patel', role: 'Workshop' }
];

export default function AssetDetails`;

file = file.replace('export default function AssetDetails', mockDataAndState);

// Add activeMaintTab state
file = file.replace("const [activeDocTab, setActiveDocTab] = useState('All Documents');", "const [activeDocTab, setActiveDocTab] = useState('All Documents');\n  const [activeMaintTab, setActiveMaintTab] = useState('Maintenance Schedule');");

const maintenanceCode = `
      {activeTab === 'Maintenance & Service' && (
        <div className="space-y-6">
          {/* Inner Navigation Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto custom-scrollbar">
            {['Maintenance Schedule', 'Service History', 'Inspection History', 'Parts & Labour', 'Cost Summary', 'Downtime Log'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveMaintTab(tab)}
                className={\`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap \${activeMaintTab === tab ? 'text-purple-700 border-purple-700' : 'text-slate-500 border-transparent hover:text-slate-800'}\`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            
            {/* LEFT COLUMN: TABLE */}
            <div className="flex flex-col space-y-4">
              
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">MAINTENANCE SCHEDULE ({mockMaintenanceTasks.length})</h3>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                {/* Table Header Controls */}
                <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search maintenance..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 outline-none focus:border-purple-500 w-48" />
                    </div>
                    
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
                      All Maintenance Types <ChevronDown size={14} className="text-slate-400" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
                      All Status <ChevronDown size={14} className="text-slate-400" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
                      All Priority <ChevronDown size={14} className="text-slate-400" />
                    </button>
                    
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
                      <Filter size={14} /> Filters
                    </button>
                  </div>
                  
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
                    <Download size={14} /> Export
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Task / Maintenance</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Type</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Priority</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Frequency / Interval</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Last Performed</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Next Due</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Days Remaining</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Assigned To</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockMaintenanceTasks.map((task, idx) => (
                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3.5">
                            <h4 className="text-[11px] font-bold text-slate-800">{task.task}</h4>
                            <p className="text-[10px] font-medium text-slate-500 mt-0.5">{task.desc}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={\`text-[11px] font-bold \${task.type === 'Service' ? 'text-purple-600' : 'text-amber-500'}\`}>
                              {task.type}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={\`text-[11px] font-bold \${task.priority === 'High' ? 'text-rose-500' : task.priority === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}\`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[11px] font-semibold text-slate-700">{task.freq}</td>
                          <td className="px-5 py-3.5">
                            <span className="text-[11px] font-semibold text-slate-700 block">{task.lastDate}</span>
                            {task.lastHrs && <span className="text-[10px] font-semibold text-slate-500 block">@ {task.lastHrs}</span>}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-[11px] font-semibold text-slate-700 block">{task.nextDate}</span>
                            {task.nextHrs && <span className="text-[10px] font-semibold text-slate-500 block">@ {task.nextHrs}</span>}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={\`text-[10px] font-bold \${task.status === 'Due Soon' ? 'text-amber-500' : task.status === 'Scheduled' ? 'text-blue-500' : 'text-emerald-500'}\`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={\`text-[10px] font-bold \${task.daysRemaining === 'Completed' ? 'text-emerald-500' : task.daysRemaining.includes('18') ? 'text-amber-500' : 'text-blue-500'}\`}>
                              {task.daysRemaining}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <h4 className="text-[11px] font-bold text-slate-800">{task.assigned}</h4>
                            {task.role && <p className="text-[10px] font-medium text-slate-500 mt-0.5">{task.role}</p>}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-center gap-2">
                              <button className="text-slate-400 hover:text-slate-600 transition-colors p-1"><Eye size={14} /></button>
                              <button className="text-slate-400 hover:text-slate-600 transition-colors p-1"><MoreHorizontal size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination Footer */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium bg-slate-50/30">
                  <span>Showing 1 to {mockMaintenanceTasks.length} of {mockMaintenanceTasks.length} maintenance tasks</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <button className="w-6 h-6 flex items-center justify-center rounded text-slate-400"><ChevronLeft size={14} /></button>
                      <button className="w-6 h-6 flex items-center justify-center rounded bg-purple-700 text-white font-bold">1</button>
                      <button className="w-6 h-6 flex items-center justify-center rounded text-slate-400"><ChevronRight size={14} /></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-[10px]">10 / page</span>
                      <ChevronDown size={14} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INSIGHTS & ALERTS */}
            <div className="space-y-6">
              
              {/* Maintenance Summary */}
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">Maintenance Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-purple-100 rounded-xl p-3 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100"><Calendar size={12} /></div>
                      <span className="text-lg font-black text-slate-800">7</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Tasks</span>
                  </div>
                  <div className="bg-white border border-amber-100 rounded-xl p-3 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100"><Clock size={12} /></div>
                      <span className="text-lg font-black text-slate-800">2</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Due Soon</span>
                  </div>
                  <div className="bg-white border border-rose-100 rounded-xl p-3 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100"><AlertTriangle size={12} /></div>
                      <span className="text-lg font-black text-slate-800">1</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Overdue</span>
                  </div>
                  <div className="bg-white border border-emerald-100 rounded-xl p-3 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100"><CheckCircle2 size={12} /></div>
                      <span className="text-lg font-black text-slate-800">4</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Completed</span>
                  </div>
                </div>
              </div>

              {/* Next Due Maintenance */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Next Due Maintenance</h3>
                  <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 transition-colors">View All &rarr;</button>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-slate-800">18</span>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800">Service & Maintenance</h4>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Due: 24 Jun 2025 @ 1,250 Hrs</p>
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[9px] font-bold tracking-widest uppercase">Due Soon</span>
                </div>
              </div>

              {/* Hours & Usage */}
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">Hours & Usage</h3>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <Activity size={14} className="text-blue-500 mb-2" />
                    <span className="text-[11px] font-black text-slate-800 block">1,256.5 Hrs</span>
                    <span className="text-[9px] font-bold text-slate-500">Current Hours</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-2 border-l border-slate-100">
                    <Calendar size={14} className="text-purple-500 mb-2" />
                    <span className="text-[11px] font-black text-slate-800 block">1,250 Hrs</span>
                    <span className="text-[9px] font-bold text-slate-500">Next Service (Due)</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-2 border-l border-slate-100">
                    <TrendingUp size={14} className="text-emerald-500 mb-2" />
                    <span className="text-[11px] font-black text-slate-800 block">7.5 Hrs</span>
                    <span className="text-[9px] font-bold text-slate-500">Avg Daily Usage</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-2 border-l border-slate-100">
                    <Clock size={14} className="text-slate-500 mb-2" />
                    <span className="text-[11px] font-black text-slate-800 block">1,256.5 Hrs</span>
                    <span className="text-[9px] font-bold text-slate-500">This Month</span>
                  </div>
                </div>
              </div>

              {/* Downtime Summary */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Downtime Summary (FY 2024-2025)</h3>
                  <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 transition-colors">View Report &rarr;</button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block mb-0.5">Total Downtime</span>
                      <span className="text-[11px] font-black text-slate-800">9.0 Hrs</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block mb-0.5">Breakdown Downtime</span>
                      <span className="text-[11px] font-black text-slate-800">0.0 Hrs</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block mb-0.5">Downtime</span>
                      <span className="text-[11px] font-black text-slate-800">9.0 Hrs</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block mb-0.5">Downtime Cost</span>
                      <span className="text-[11px] font-black text-slate-800">$1,125.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">Quick Actions</h3>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 transition-colors text-left group">
                    <Calendar size={14} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-700">Schedule Maintenance</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 transition-colors text-left group">
                    <Wrench size={14} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-700">Log Unscheduled Maintenance</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 transition-colors text-left group">
                    <AlertTriangle size={14} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-700">Record Downtime</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 transition-colors text-left group">
                    <Package size={14} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-700">Request Parts / Material</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 transition-colors text-left group">
                    <Calendar size={14} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-700">View Maintenance Calendar</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100 transition-colors text-left group">
                    <Clock size={14} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-700">View Service History</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left group">
                    <Printer size={14} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-700">Print Maintenance Schedule</span>
                  </button>
                </div>
              </div>
              
            </div>
          </div>

          {/* DEVELOPER NOTES */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <div className="bg-purple-600 p-1.5 rounded text-white">
                <Code size={14} />
              </div>
              <h3 className="text-[11px] font-black text-purple-700 uppercase tracking-widest">DEVELOPER NOTES - ASSET MAINTENANCE & SERVICE</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
              {/* Col 1 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">1</div> 
                  <span>PURPOSE</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Manage all maintenance, service and inspection tasks.</li>
                  <li className="pl-1">Track schedules, completion, downtime and costs.</li>
                  <li className="pl-1">Ensure asset reliability and compliance.</li>
                </ul>
              </div>
              
              {/* Col 2 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">2</div> 
                  <span>KEY FEATURES</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Schedule recurring maintenance & inspections.</li>
                  <li className="pl-1">Track next due by hours, time or usage.</li>
                  <li className="pl-1">Log service history, parts, labour and downtime.</li>
                  <li className="pl-1">Set reminders and alerts before due dates.</li>
                </ul>
              </div>
              
              {/* Col 3 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">3</div> 
                  <span>AUTOMATION & ALERTS</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Auto-calculate next due based on rules.</li>
                  <li className="pl-1">Alert for due soon, overdue & expiring items.</li>
                  <li className="pl-1">AI predicts potential issues from history.</li>
                  <li className="pl-1">Escalate critical overdue items.</li>
                </ul>
              </div>

              {/* Col 4 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">4</div> 
                  <span>PERMISSIONS</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Super Admin: Full access.</li>
                  <li className="pl-1">Admin/Manager: Create, edit, approve.</li>
                  <li className="pl-1">Workshop: Update maintenance tasks.</li>
                  <li className="pl-1">Staff: View assigned maintenance.</li>
                </ul>
              </div>

              {/* Col 5 */}
              <div>
                <h4 className="text-[11px] font-black text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200">5</div> 
                  <span>DATA SOURCES</span>
                </h4>
                <ul className="space-y-2 text-[10px] font-semibold text-slate-500 list-disc list-inside marker:text-slate-300">
                  <li className="pl-1">Assets module.</li>
                  <li className="pl-1">Maintenance module.</li>
                  <li className="pl-1">Parts & Inventory module.</li>
                  <li className="pl-1">Downtime & Costs module.</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-slate-50/80 border-t border-slate-100 p-4 flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-500">All times shown in your local time (AEST)</span>
              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
                Data auto-refreshes every 5 minutes
                <RefreshCw size={10} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      )}
`;

file = file.replace("{activeTab === 'Compliance & Documents' && (", maintenanceCode + "\n\n      {activeTab === 'Compliance & Documents' && (");

fs.writeFileSync('src/components/CompanyAdmin/AssetDetails.jsx', file, 'utf8');
