const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'CompanyAdmin', 'Customers.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Sparkles to imports
if (!content.includes('Sparkles,')) {
    content = content.replace(/import \{([\s\S]*?)\} from 'lucide-react';/, (match, p1) => {
        return `import {${p1}, Sparkles} from 'lucide-react';`;
    });
}

// 2. Replace the old Activity tab content with the massive new UI
const oldActivityRegex = /\{\s*activeDetailsTab === 'Activity' && \([\s\S]*?\{ \/\* Right Sidebar - Analytics \*\//;

const newActivityBlock = `{activeDetailsTab === 'Activity' && (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full mb-6 max-w-full">
    
    {/* Filters row */}
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer">
        01/06/2025 &rarr; 08/07/2025 <Calendar size={14} className="ml-2 text-slate-400"/>
      </div>
      <div className="relative">
        <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer focus:outline-none">
          <option>All Activity Types</option>
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
      </div>
      <div className="relative">
        <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer focus:outline-none">
          <option>All Users</option>
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
      </div>
      <div className="relative">
        <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer focus:outline-none">
          <option>All Modules</option>
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
      </div>
      <div className="relative flex-grow max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
        <input type="text" placeholder="Search activity..." className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none"/>
      </div>
      <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-indigo-600 shadow-sm hover:bg-slate-50 cursor-pointer">
        <Filter size={14}/> Filters
      </button>
      <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer">
        <Download size={14}/> Export <ChevronDown size={14}/>
      </button>
    </div>

    {/* Sub-tabs row */}
    <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto pb-0">
      <button className="text-[11px] font-black text-indigo-600 pb-3 border-b-2 border-indigo-600 whitespace-nowrap cursor-pointer">
        All Activity <span className="ml-1.5 bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded text-[10px]">234</span>
      </button>
      <button className="text-[11px] font-bold text-slate-500 hover:text-slate-700 pb-3 whitespace-nowrap cursor-pointer">
        Loads <span className="ml-1.5 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">18</span>
      </button>
      <button className="text-[11px] font-bold text-slate-500 hover:text-slate-700 pb-3 whitespace-nowrap cursor-pointer">
        Invoices & Payments <span className="ml-1.5 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">26</span>
      </button>
      <button className="text-[11px] font-bold text-slate-500 hover:text-slate-700 pb-3 whitespace-nowrap cursor-pointer">
        Messages <span className="ml-1.5 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">12</span>
      </button>
      <button className="text-[11px] font-bold text-slate-500 hover:text-slate-700 pb-3 whitespace-nowrap cursor-pointer">
        Documents <span className="ml-1.5 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">38</span>
      </button>
      <button className="text-[11px] font-bold text-slate-500 hover:text-slate-700 pb-3 whitespace-nowrap cursor-pointer">
        Pricing <span className="ml-1.5 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">8</span>
      </button>
      <button className="text-[11px] font-bold text-slate-500 hover:text-slate-700 pb-3 whitespace-nowrap cursor-pointer">
        Billing Rules <span className="ml-1.5 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">6</span>
      </button>
      <button className="text-[11px] font-bold text-slate-500 hover:text-slate-700 pb-3 whitespace-nowrap cursor-pointer">
        AI Reminders <span className="ml-1.5 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">14</span>
      </button>
      <button className="text-[11px] font-bold text-slate-500 hover:text-slate-700 pb-3 whitespace-nowrap cursor-pointer">
        Audit Log <span className="ml-1.5 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">107</span>
      </button>
    </div>

    {/* Main Grid: Left Timeline, Right Cards */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Timeline (Spans 2 columns) */}
      <div className="xl:col-span-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-[13px] font-black tracking-tight text-slate-800">Activity Timeline</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Show:</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-slate-700 shadow-sm cursor-pointer focus:outline-none">
                  <option>25 per page</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
              </div>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="flex items-center gap-1.5 bg-white text-indigo-600 px-3 py-1.5 rounded-md text-[11px] font-bold shadow-sm cursor-pointer">
                <Activity size={12} /> Timeline View
              </button>
              <button className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer">
                <List size={12} /> Table View
              </button>
            </div>
          </div>
        </div>

        <div className="relative space-y-6 before:absolute before:inset-0 before:left-[110px] before:w-px before:h-full before:bg-slate-200 z-0 pb-4">
          
          {/* Item 1 */}
          <div className="relative flex items-start gap-4 z-10">
            <div className="w-[90px] shrink-0 text-right pt-2.5">
              <p className="text-[11px] font-black text-slate-900">08 Jul 2025</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">10:24 AM</p>
            </div>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-white bg-red-50 text-red-500 shrink-0 mt-1 shadow-sm">
              <AlertCircle size={14} />
            </div>
            <div className="flex-grow bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[13px] font-black text-slate-900">Document Expired</h4>
                    <span className="bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-black">AI Alert</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Insurance Certificate 2025.pdf has expired.</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">System (AI)</div>
                </div>
                <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">View Alert</button>
              </div>
            </div>
          </div>
          
          {/* Item 2 */}
          <div className="relative flex items-start gap-4 z-10">
            <div className="w-[90px] shrink-0 text-right pt-2.5">
              <p className="text-[11px] font-black text-slate-900">08 Jul 2025</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">09:15 AM</p>
            </div>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-white bg-emerald-50 text-emerald-500 shrink-0 mt-1 shadow-sm">
              <DollarSign size={14} />
            </div>
            <div className="flex-grow bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-[13px] font-black text-slate-900 mb-1">Payment Received</h4>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Payment of $15,750.00 received for INV-12456 via Direct Transfer.</p>
                </div>
                <span className="text-[13px] font-black text-emerald-600">$15,750.00</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[9px] font-black">JD</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900">John Davis</p>
                    <p className="text-[9px] font-bold text-slate-400">Accounts</p>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">View Payment</button>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="relative flex items-start gap-4 z-10">
            <div className="w-[90px] shrink-0 text-right pt-2.5">
              <p className="text-[11px] font-black text-slate-900">07 Jul 2025</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">04:32 PM</p>
            </div>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-white bg-blue-50 text-blue-500 shrink-0 mt-1 shadow-sm">
              <Truck size={14} />
            </div>
            <div className="flex-grow bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-[13px] font-black text-slate-900 mb-1">Load Completed</h4>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Load LD-1097 completed by Driver #D-021 (Michael King).</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[9px] font-black border border-blue-100">MK</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900">Michael King</p>
                    <p className="text-[9px] font-bold text-blue-600">Driver</p>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">View Load</button>
              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div className="relative flex items-start gap-4 z-10">
            <div className="w-[90px] shrink-0 text-right pt-2.5">
              <p className="text-[11px] font-black text-slate-900">07 Jul 2025</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">02:15 PM</p>
            </div>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-white bg-orange-50 text-orange-500 shrink-0 mt-1 shadow-sm">
              <MessageSquare size={14} />
            </div>
            <div className="flex-grow bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-[13px] font-black text-slate-900 mb-1">Message Sent</h4>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Re: Delivery delay for LD-1096 - Updated ETA shared.</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-[9px] font-black border border-orange-100">SM</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900">Sarah Mitchell</p>
                    <p className="text-[9px] font-bold text-orange-600">Dispatch</p>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">View Message</button>
              </div>
            </div>
          </div>

          {/* Item 5 */}
          <div className="relative flex items-start gap-4 z-10">
            <div className="w-[90px] shrink-0 text-right pt-2.5">
              <p className="text-[11px] font-black text-slate-900">07 Jul 2025</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">11:30 AM</p>
            </div>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-white bg-amber-50 text-amber-500 shrink-0 mt-1 shadow-sm">
              <Settings size={14} />
            </div>
            <div className="flex-grow bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-[13px] font-black text-slate-900 mb-1">Pricing Rule Updated</h4>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Lane Price: Sydney (NSW) &rarr; Melbourne (VIC) updated.</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] font-black">SM</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900">Sarah Mitchell</p>
                    <p className="text-[9px] font-bold text-slate-500">Admin</p>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">View Change</button>
              </div>
            </div>
          </div>
          
          {/* Item 6 */}
          <div className="relative flex items-start gap-4 z-10">
            <div className="w-[90px] shrink-0 text-right pt-2.5">
              <p className="text-[11px] font-black text-slate-900">06 Jul 2025</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">03:45 PM</p>
            </div>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-white bg-slate-50 text-slate-500 shrink-0 mt-1 shadow-sm">
              <FileText size={14} />
            </div>
            <div className="flex-grow bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-[13px] font-black text-slate-900 mb-1">Invoice Created</h4>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Invoice INV-12450 created for Load LD-1093.</p>
                </div>
                <span className="text-[13px] font-black text-slate-900">$32,450.00</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[9px] font-black">JD</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900">John Davis</p>
                    <p className="text-[9px] font-bold text-slate-500">Accounts</p>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">View Invoice</button>
              </div>
            </div>
          </div>

          {/* Item 7 */}
          <div className="relative flex items-start gap-4 z-10">
            <div className="w-[90px] shrink-0 text-right pt-2.5">
              <p className="text-[11px] font-black text-slate-900">05 Jul 2025</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">01:22 PM</p>
            </div>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-white bg-indigo-50 text-indigo-500 shrink-0 mt-1 shadow-sm">
              <Upload size={14} />
            </div>
            <div className="flex-grow bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-[13px] font-black text-slate-900 mb-1">Document Uploaded</h4>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Public Liability Insurance.pdf uploaded.</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-[9px] font-black border border-orange-100">SM</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900">Sarah Mitchell</p>
                    <p className="text-[9px] font-bold text-indigo-600">Admin</p>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">View Document</button>
              </div>
            </div>
          </div>

          {/* Item 8 */}
          <div className="relative flex items-start gap-4 z-10">
            <div className="w-[90px] shrink-0 text-right pt-2.5">
              <p className="text-[11px] font-black text-slate-900">03 Jul 2025</p>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">09:00 AM</p>
            </div>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-white bg-slate-50 text-slate-500 shrink-0 mt-1 shadow-sm">
              <Wrench size={14} />
            </div>
            <div className="flex-grow bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-[13px] font-black text-slate-900 mb-1">Support Ticket Updated</h4>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Ticket #TKT-152 updated: Proof of Delivery not attached.</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-[9px] font-black border border-purple-100">PS</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900">Priya Sharma</p>
                    <p className="text-[9px] font-bold text-purple-600">Support</p>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">View Ticket</button>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-2 pt-6 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Showing 1 to 8 of 234 activities</span>
          <div className="flex items-center gap-1">
            <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-400 hover:bg-slate-50 cursor-pointer shadow-sm"><ChevronLeft size={12}/></button>
            <button className="w-6 h-6 flex items-center justify-center bg-indigo-600 border border-indigo-600 rounded text-white font-bold text-[11px] cursor-pointer shadow-sm">1</button>
            <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 font-bold text-[11px] hover:bg-slate-50 cursor-pointer shadow-sm">2</button>
            <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 font-bold text-[11px] hover:bg-slate-50 cursor-pointer shadow-sm">3</button>
            <span className="text-slate-400 font-bold text-[11px] px-0.5">...</span>
            <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 font-bold text-[11px] hover:bg-slate-50 cursor-pointer shadow-sm">10</button>
            <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-400 hover:bg-slate-50 cursor-pointer shadow-sm"><ChevronRight size={12}/></button>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="xl:col-span-1 space-y-6">
        {/* Activity Summary */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-[13px] font-black text-slate-900 tracking-tight mb-5">Activity Summary (This Period)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50/70 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-slate-100/50">
              <Package size={16} className="text-slate-400 mb-2"/>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Loads</p>
              <p className="text-xl font-black text-slate-900">18</p>
              <button className="text-[9px] font-bold text-indigo-600 mt-2 uppercase tracking-widest hover:underline cursor-pointer">View All</button>
            </div>
            <div className="bg-slate-50/70 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-slate-100/50">
              <FileText size={16} className="text-slate-400 mb-2"/>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Invoices</p>
              <p className="text-xl font-black text-slate-900">26</p>
              <button className="text-[9px] font-bold text-indigo-600 mt-2 uppercase tracking-widest hover:underline cursor-pointer">View All</button>
            </div>
            <div className="bg-emerald-50/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-emerald-100/50">
              <DollarSign size={16} className="text-emerald-500 mb-2"/>
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Payments</p>
              <p className="text-xl font-black text-slate-900">12</p>
              <button className="text-[9px] font-bold text-indigo-600 mt-2 uppercase tracking-widest hover:underline cursor-pointer">View All</button>
            </div>
            <div className="bg-slate-50/70 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-slate-100/50">
              <Upload size={16} className="text-slate-400 mb-2"/>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Documents</p>
              <p className="text-xl font-black text-slate-900">38</p>
              <button className="text-[9px] font-bold text-indigo-600 mt-2 uppercase tracking-widest hover:underline cursor-pointer">View All</button>
            </div>
            <div className="bg-blue-50/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-blue-100/50">
              <MessageSquare size={16} className="text-blue-500 mb-2"/>
              <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1">Messages</p>
              <p className="text-xl font-black text-slate-900">12</p>
              <button className="text-[9px] font-bold text-indigo-600 mt-2 uppercase tracking-widest hover:underline cursor-pointer">View All</button>
            </div>
            <div className="bg-red-50/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-red-100/50">
              <AlertCircle size={16} className="text-red-500 mb-2"/>
              <p className="text-[9px] font-bold text-red-600 uppercase tracking-widest mb-1">AI Alerts</p>
              <p className="text-xl font-black text-red-600">14</p>
              <button className="text-[9px] font-bold text-red-600 mt-2 uppercase tracking-widest hover:underline cursor-pointer">View All</button>
            </div>
          </div>
        </div>

        {/* Top Active Users */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-[13px] font-black text-slate-900 tracking-tight mb-5">Top Active Users</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-[10px] font-black border border-orange-100 shrink-0">SM</div>
                <div>
                  <p className="text-[11px] font-black text-slate-900">Sarah Mitchell</p>
                  <p className="text-[9px] font-bold text-slate-400">Admin / Dispatch</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-900">96 <span className="text-[9px] font-bold text-slate-400">actions</span></span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-[10px] font-black border border-amber-100 shrink-0">JD</div>
                <div>
                  <p className="text-[11px] font-black text-slate-900">John Davis</p>
                  <p className="text-[9px] font-bold text-slate-400">Accounts</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-900">54 <span className="text-[9px] font-bold text-slate-400">actions</span></span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black border border-blue-100 shrink-0">MK</div>
                <div>
                  <p className="text-[11px] font-black text-slate-900">Michael King</p>
                  <p className="text-[9px] font-bold text-slate-400">Driver</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-900">32 <span className="text-[9px] font-bold text-slate-400">actions</span></span>
            </div>
          </div>
          <button className="w-full text-center mt-6 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline cursor-pointer">View All Users</button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-[13px] font-black text-slate-900 tracking-tight mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group cursor-pointer shadow-sm">
              <div className="flex items-center gap-3">
                <FileText size={14} className="text-indigo-600"/>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-700">Request Document from Customer</span>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform"/>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group cursor-pointer shadow-sm">
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-indigo-600"/>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-700">Set Expiry Reminder</span>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform"/>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group cursor-pointer shadow-sm">
              <div className="flex items-center gap-3">
                <FileText size={14} className="text-indigo-600"/>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-700">Create Document Template</span>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform"/>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Grid: AI Accounts Receivable & Payment Reminders */}
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-[15px] font-black tracking-tight text-slate-800">AI Accounts Receivable & Payment Reminders</h2>
        <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest font-black">BETA</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">OVERDUE INVOICES</p>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={14} className="text-red-500" />
            <span className="text-lg font-black text-red-600">$32,450.00</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500">5 Invoices</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">DUE THIS WEEK</p>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-amber-500" />
            <span className="text-lg font-black text-amber-600">$7,850.00</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500">2 Invoices</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">DUE NEXT 7 DAYS</p>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-blue-500" />
            <span className="text-lg font-black text-blue-600">$14,600.00</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500">3 Invoices</p>
        </div>
        <div className="md:border-l border-slate-100 md:pl-6">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">AVERAGE DAYS TO PAY</p>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={14} className="text-indigo-500" />
            <span className="text-lg font-black text-slate-900">28 <span className="text-[11px] font-bold text-slate-500">Days</span></span>
          </div>
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">PREDICTED LATE PAYERS</p>
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} className="text-emerald-500" />
            <span className="text-lg font-black text-slate-900">3 <span className="text-[11px] font-bold text-slate-500">Customers</span></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Reminder Schedule */}
        <div>
          <h4 className="text-[11px] font-black text-slate-900 tracking-tight mb-5">Next Reminder Schedule</h4>
          <div className="relative pl-3 space-y-6 before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
            <div className="relative flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white shrink-0 mt-1 z-10"></div>
              <div className="flex-grow -mt-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] font-black text-slate-900">3 Days Before Due</span>
                  <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-1.5 py-0.5 rounded">2</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500">Email reminder will be sent</p>
              </div>
            </div>
            <div className="relative flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-white shrink-0 mt-1 z-10"></div>
              <div className="flex-grow -mt-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] font-black text-slate-900">Due Date</span>
                  <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-1.5 py-0.5 rounded">4</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500">Email + SMS reminder</p>
              </div>
            </div>
            <div className="relative flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-white shrink-0 mt-1 z-10"></div>
              <div className="flex-grow -mt-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] font-black text-red-600">7 Days Overdue</span>
                  <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] font-black px-1.5 py-0.5 rounded">1</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500">Follow up email + dashboard alert</p>
              </div>
            </div>
            <div className="relative flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-red-600 ring-4 ring-white shrink-0 mt-1 z-10"></div>
              <div className="flex-grow -mt-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] font-black text-red-600">14 Days Overdue</span>
                  <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] font-black px-1.5 py-0.5 rounded">1</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500">Escalate + create follow up task</p>
              </div>
            </div>
            <div className="relative flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white shrink-0 mt-1 z-10"></div>
              <div className="flex-grow -mt-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] font-black text-slate-400">30 Days Overdue</span>
                  <span className="bg-slate-50 text-slate-400 border border-slate-100 text-[9px] font-black px-1.5 py-0.5 rounded">0</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-400">Escalate to management</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Draft Reminder Preview */}
        <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-indigo-600" />
            <h4 className="text-[11px] font-black text-slate-900 tracking-tight">AI Draft Reminder Preview</h4>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm text-[10px] font-semibold text-slate-600">
            <div className="grid grid-cols-[40px_1fr] gap-y-1 gap-x-2 mb-4 text-[9px]">
              <span className="text-slate-400 font-bold">To:</span>
              <span className="font-bold text-slate-700">accounts@abcmotors.com.au</span>
              <span className="text-slate-400 font-bold">Cc:</span>
              <span className="font-bold text-slate-700">sarah.m@herologistics.com</span>
              <span className="text-slate-400 font-bold">Subject:</span>
              <span className="font-black text-indigo-700">Payment Reminder - Invoice INV-12456</span>
            </div>
            <div className="space-y-3 leading-relaxed text-slate-600">
              <p>Hi ABC Motors Pty Ltd,</p>
              <p>This is a friendly reminder that invoice INV-12456 for <span className="font-black text-slate-900">$32,450.00</span> is now due. Please find the invoice attached for your reference.</p>
              <p>Payment due date: <span className="font-black text-red-600 bg-red-50 px-1 rounded">05 Jul 2025</span></p>
              <p>Thank you for your continued business.</p>
              <p className="mt-4 pt-4 border-t border-slate-50">Kind regards,<br/><span className="font-black text-slate-900">Hero Logistics Accounts Team</span></p>
            </div>
          </div>
          <button className="w-full text-center mt-5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline cursor-pointer">Preview All Reminders</button>
        </div>

        {/* Debtor Ageing & AI Insights */}
        <div className="grid grid-cols-2 gap-5">
          <div className="border-r border-slate-100 pr-5">
            <h4 className="text-[11px] font-black text-slate-900 tracking-tight mb-5 text-center">Debtor Ageing</h4>
            <div className="relative w-[90px] h-[90px] mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="15" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="110" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="180" style={{ transformOrigin: 'center', transform: 'rotate(140deg)' }}/>
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="220" style={{ transformOrigin: 'center', transform: 'rotate(210deg)' }}/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">TOTAL</span>
                <span className="text-[11px] font-black text-slate-900 mt-0.5 leading-none">$32,450</span>
              </div>
            </div>
            <div className="space-y-3 text-[9px] font-bold">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div><span className="text-slate-600">Current (0-30 days)</span></div>
                <div className="flex justify-between items-center pl-3">
                  <span className="text-slate-900 font-black">$18,450.00</span>
                  <span className="text-slate-400 font-semibold">(56.9%)</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div><span className="text-slate-600">31 - 60 days</span></div>
                <div className="flex justify-between items-center pl-3">
                  <span className="text-slate-900 font-black">$8,200.00</span>
                  <span className="text-slate-400 font-semibold">(25.3%)</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div><span className="text-slate-600">61 - 90 days</span></div>
                <div className="flex justify-between items-center pl-3">
                  <span className="text-slate-900 font-black">$5,800.00</span>
                  <span className="text-slate-400 font-semibold">(17.8%)</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5"><div className="w-1.5 h-1.5 rounded-full bg-red-700"></div><span className="text-slate-600">90 + days</span></div>
                <div className="flex justify-between items-center pl-3">
                  <span className="text-slate-900 font-black">$0.00</span>
                  <span className="text-slate-400 font-semibold">(0.0%)</span>
                </div>
              </div>
            </div>
            <button className="w-full text-center mt-6 text-[9px] font-bold text-indigo-600 uppercase tracking-widest hover:underline cursor-pointer">View Full Ageing Report</button>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-5">
              <Sparkles size={12} className="text-indigo-600" />
              <h4 className="text-[11px] font-black text-slate-900 tracking-tight">AI Insights</h4>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={10} /></div>
                <p className="text-[9px] font-semibold text-slate-600 leading-relaxed">ABC Motors usually pays 7 days after due date.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5"><AlertCircle size={10} /></div>
                <p className="text-[9px] font-semibold text-slate-600 leading-relaxed">2 invoices are at risk of going 30+ days overdue.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Phone size={10} /></div>
                <p className="text-[9px] font-semibold text-slate-600 leading-relaxed">Best time to call is between 9-11 AM (based on history).</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5"><Mail size={10} /></div>
                <p className="text-[9px] font-semibold text-slate-600 leading-relaxed">Customer responded to email 80% of the time.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5"><AlertCircle size={10} /></div>
                <p className="text-[9px] font-semibold text-slate-600 leading-relaxed">Consider a phone call for overdue invoices over 14 days.</p>
              </div>
            </div>
            <button className="w-full text-center mt-6 text-[9px] font-bold text-indigo-600 uppercase tracking-widest hover:underline cursor-pointer">View All AI Insights</button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Right Sidebar - Analytics */}`;

content = content.replace(oldActivityRegex, newActivityBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully injected massive UI block.');
