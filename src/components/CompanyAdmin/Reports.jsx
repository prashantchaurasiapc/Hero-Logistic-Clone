import React, { useState } from 'react';
import { 
  Filter, 
  ChevronDown, 
  Download, 
  LineChart, 
  Users, 
  Truck, 
  TrendingUp, 
  Package, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  TrendingDown,
  CheckCircle2,
  Clock,
  Star
} from 'lucide-react';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('revenue');
  const [viewMode, setViewMode] = useState('DEFAULT');
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('All Branches');

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Period,Gross Revenue,Expenses,Net Margin,Trips\nFeb,$12,500,$8,200,34.4%,18\nMar,$18,900,$11,400,39.6%,24\nApr,$14,200,$9,800,30.9%,21\nMay,$16,800,$10,200,39.2%,26\nJun,$19,500,$12,100,37.9%,29";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const blob = new Blob(["Simulated PDF report content"], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `report_${activeTab}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto bg-[#FAFAFA] min-h-screen text-left flex flex-col space-y-6 font-sans">
        
        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1">Reports & Analytics Center</h1>
            <p className="text-gray-500 text-[13px]">Generate, export, and visualize system-wide logistics performance metrics.</p>
        </div>

        {/* KPI Cards — Compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 flex flex-col justify-between">
               <div className="flex justify-between items-center">
                   <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</div>
                   <span className="text-[#00D47E] bg-[#E6F9F1] px-1.5 py-0.5 rounded text-[9px] font-bold">+14.2%</span>
               </div>
               <div className="mt-2.5">
                   <div className="text-lg font-black text-gray-900 tracking-tight leading-none">$12,790.00</div>
                   <p className="text-[10px] text-gray-400 font-medium mt-1">Across selected period</p>
               </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 flex flex-col justify-between">
               <div className="flex justify-between items-center">
                   <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Net Profit Margin</div>
                   <span className="text-[#F44336] bg-[#FFEFEF] px-1.5 py-0.5 rounded text-[9px] font-bold">-26.8% Margin</span>
               </div>
               <div className="mt-2.5">
                   <div className="text-lg font-black text-gray-900 tracking-tight leading-none">$-3,430.00</div>
                   <p className="text-[10px] text-gray-400 font-medium mt-1">After operational expenses</p>
               </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 flex flex-col justify-between">
               <div className="flex justify-between items-center">
                   <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Trips Completed</div>
                   <span className="text-[#00D47E] bg-[#E6F9F1] px-1.5 py-0.5 rounded text-[9px] font-bold">Live</span>
               </div>
               <div className="mt-2.5">
                   <div className="text-lg font-black text-gray-900 tracking-tight leading-none">148 Trips</div>
                   <p className="text-[10px] text-gray-400 font-medium mt-1">100% delivered on time</p>
               </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 flex flex-col justify-between">
               <div className="flex justify-between items-center">
                   <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Active Customers</div>
                   <span className="text-[#3B82F6] bg-[#F0F4FF] px-1.5 py-0.5 rounded text-[9px] font-bold">Stable</span>
               </div>
               <div className="mt-2.5">
                   <div className="text-lg font-black text-gray-900 tracking-tight leading-none">24 Shippers</div>
                   <p className="text-[10px] text-gray-400 font-medium mt-1">Active billing accounts</p>
               </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col">
           
           {/* Filters Section */}
           <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2">
                    <Filter size={15} className="text-gray-400" strokeWidth={2.5} />
                    <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Filters:</h2>
                 </div>
                 <div className="flex justify-end gap-2">
                    <button onClick={handleExportCSV} className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 px-4 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-xs">
                        <Download size={13} strokeWidth={2.5} /> Export CSV
                    </button>
                    <button onClick={handleExportPDF} className="flex items-center gap-1.5 bg-[#FFD400] hover:bg-[#F0C800] text-black px-4 py-1.5 rounded-lg text-[11px] font-bold transition-colors shadow-xs cursor-pointer">
                        <Download size={13} strokeWidth={2.5} /> Export PDF
                    </button>
                 </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative w-full">
                      <button 
                        onClick={() => { setIsPeriodMenuOpen(!isPeriodMenuOpen); setIsBranchMenuOpen(false); }}
                        className={`w-full flex justify-between items-center bg-white border rounded-xl px-3.5 py-2 text-[12px] font-semibold text-gray-900 cursor-pointer transition-colors ${isPeriodMenuOpen ? 'border-[#FFD400] ring-1 ring-[#FFD400]' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                         <span>Period: <strong className="font-bold">{selectedPeriod}</strong></span>
                         <ChevronDown size={15} className="text-gray-700" strokeWidth={2.5} />
                      </button>
                      
                      {isPeriodMenuOpen && (
                         <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                            {['Today', 'This Week', 'This Month', 'Last Quarter', 'Year to Date'].map(period => (
                               <div 
                                 key={period}
                                 onClick={() => { setSelectedPeriod(period); setIsPeriodMenuOpen(false); }}
                                 className={`px-4 py-2 text-[12px] font-medium cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${selectedPeriod === period ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-800'}`}
                               >
                                  {period}
                               </div>
                            ))}
                         </div>
                      )}
                  </div>

                  <div className="relative w-full">
                      <button 
                        onClick={() => { setIsBranchMenuOpen(!isBranchMenuOpen); setIsPeriodMenuOpen(false); }}
                        className={`w-full flex justify-between items-center bg-white border rounded-xl px-3.5 py-2 text-[12px] font-semibold text-gray-900 cursor-pointer transition-colors ${isBranchMenuOpen ? 'border-[#FFD400] ring-1 ring-[#FFD400]' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                         <span>Branch: <strong className="font-bold">{selectedBranch}</strong></span>
                         <ChevronDown size={15} className="text-gray-700" strokeWidth={2.5} />
                      </button>
                      
                      {isBranchMenuOpen && (
                         <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                            {['All Branches', 'Chicago HQ', 'Dallas Depot', 'Melbourne Hub'].map(branch => (
                               <div 
                                 key={branch}
                                 onClick={() => { setSelectedBranch(branch); setIsBranchMenuOpen(false); }}
                                 className={`px-4 py-2 text-[12px] font-medium cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${selectedBranch === branch ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-800'}`}
                               >
                                  {branch}
                               </div>
                            ))}
                         </div>
                      )}
                  </div>
              </div>
           </div>

           {/* Tabs Section */}
           <div className="flex items-center gap-6 px-6 border-b border-gray-100 overflow-x-auto custom-scrollbar">
              <button 
                onClick={() => setActiveTab('revenue')}
                className={`flex items-center gap-2 py-3.5 border-b-2 text-[12px] font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'revenue' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                 <LineChart size={15} strokeWidth={2.5} /> Revenue Trends
              </button>
              <button 
                onClick={() => setActiveTab('driver')}
                className={`flex items-center gap-2 py-3.5 border-b-2 text-[12px] font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'driver' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                 <Users size={15} strokeWidth={2.5} /> Driver Performance
              </button>
              <button 
                onClick={() => setActiveTab('vehicle')}
                className={`flex items-center gap-2 py-3.5 border-b-2 text-[12px] font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'vehicle' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                 <Truck size={15} strokeWidth={2.5} /> Vehicle Utilization
              </button>
              <button 
                onClick={() => setActiveTab('customer')}
                className={`flex items-center gap-2 py-3.5 border-b-2 text-[12px] font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'customer' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                 <TrendingUp size={15} strokeWidth={2.5} /> Customer Growth
              </button>
              <button 
                onClick={() => setActiveTab('warehouse')}
                className={`flex items-center gap-2 py-3.5 border-b-2 text-[12px] font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'warehouse' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                 <Package size={15} strokeWidth={2.5} /> Warehouse Capacity
              </button>
           </div>

           {/* Main Tab Content */}
           {activeTab === 'vehicle' ? (
              <div className="p-6">
                 <h3 className="text-[13px] font-bold text-gray-900 mb-5">Fleet Status Distribution</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Chart */}
                    <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl flex flex-col items-center justify-center p-8 h-[340px]">
                        <svg viewBox="0 0 100 100" className="w-[190px] h-[190px] transform -rotate-90">
                           <circle cx="50" cy="50" r="38" fill="transparent" stroke="#00D47E" strokeWidth="12" pathLength="100" strokeDasharray="28 72" strokeDashoffset="0" />
                           <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0EA5E9" strokeWidth="12" pathLength="100" strokeDasharray="43 57" strokeDashoffset="-30" />
                           <circle cx="50" cy="50" r="38" fill="transparent" stroke="#FF9800" strokeWidth="12" pathLength="100" strokeDasharray="13 87" strokeDashoffset="-75" />
                           <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F44336" strokeWidth="12" pathLength="100" strokeDasharray="8 92" strokeDashoffset="-90" />
                        </svg>
                        
                        <div className="flex flex-wrap justify-center gap-5 mt-10">
                           <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#00D47E]"></div><span className="text-[11px] font-bold text-[#00D47E]">Available (30%)</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]"></div><span className="text-[11px] font-bold text-[#0EA5E9]">In Transit (45%)</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#FF9800]"></div><span className="text-[11px] font-bold text-[#FF9800]">Maintenance (15%)</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#F44336]"></div><span className="text-[11px] font-bold text-[#F44336]">Out of Service (10%)</span></div>
                        </div>
                    </div>

                    {/* Right: Breakdown */}
                    <div className="flex flex-col justify-center px-4 md:px-8">
                       <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-6">Status Breakdown</h4>
                       
                       <div className="flex flex-col">
                          <div className="flex justify-between items-center py-4 border-b border-gray-100">
                             <span className="text-[12px] font-bold text-gray-900">In Transit</span>
                             <span className="text-[12px] font-bold text-[#0EA5E9]">45% of Fleet (18 Trucks)</span>
                          </div>
                          <div className="flex justify-between items-center py-4 border-b border-gray-100">
                             <span className="text-[12px] font-bold text-gray-900">Available</span>
                             <span className="text-[12px] font-bold text-[#00D47E]">30% of Fleet (12 Trucks)</span>
                          </div>
                          <div className="flex justify-between items-center py-4 border-b border-gray-100">
                             <span className="text-[12px] font-bold text-gray-900">Maintenance</span>
                             <span className="text-[12px] font-bold text-[#FF9800]">15% of Fleet (6 Trucks)</span>
                          </div>
                          <div className="flex justify-between items-center py-4 border-b border-gray-100">
                             <span className="text-[12px] font-bold text-gray-900">Out of Service</span>
                             <span className="text-[12px] font-bold text-[#F44336]">10% of Fleet (4 Trucks)</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           ) : (
              <>
                 {/* Visual Interactive Chart Section */}
                 <div className="p-6 border-b border-gray-100">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[13px] font-bold text-gray-900">
                          {activeTab === 'revenue' && 'Revenue vs Operational Expenses Flow'}
                          {activeTab === 'driver' && 'Driver Performance & Distance Metrics'}
                          {activeTab === 'customer' && 'Client Acquisition vs Monthly Revenue'}
                          {activeTab === 'warehouse' && 'Storage Bay Occupancy Rate'}
                        </h3>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div><span className="text-[11px] font-bold text-slate-600">Metric A</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span className="text-[11px] font-bold text-slate-600">Metric B</span></div>
                        </div>
                     </div>

                     {/* SVG Bar/Line Visual Chart */}
                     <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6 h-[260px] w-full flex flex-col justify-between">
                         <div className="flex items-end justify-between h-[180px] pt-4 px-4 gap-4 sm:gap-8 border-b border-slate-200">
                            {[
                               { label: 'Feb', v1: 65, v2: 45, val1: '$12.5k', val2: '$8.2k' },
                               { label: 'Mar', v1: 90, v2: 60, val1: '$18.9k', val2: '$11.4k' },
                               { label: 'Apr', v1: 72, v2: 50, val1: '$14.2k', val2: '$9.8k' },
                               { label: 'May', v1: 85, v2: 55, val1: '$16.8k', val2: '$10.2k' },
                               { label: 'Jun', v1: 95, v2: 65, val1: '$19.5k', val2: '$12.1k' },
                            ].map((bar, idx) => (
                               <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                                  {/* Tooltip on hover */}
                                  <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                     {bar.val1} / {bar.val2}
                                  </div>
                                  <div className="w-full max-w-[48px] flex items-end justify-center gap-1.5 h-full">
                                     <div className="w-full bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-md transition-all duration-500 group-hover:brightness-110" style={{ height: `${bar.v1}%` }}></div>
                                     <div className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-md transition-all duration-500 group-hover:brightness-110" style={{ height: `${bar.v2}%` }}></div>
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-600">{bar.label}</span>
                               </div>
                            ))}
                         </div>

                         {/* Axis baseline info */}
                         <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 px-2 pt-2">
                            <span>$0 baseline</span>
                            <span>Max scale: $25,000</span>
                         </div>
                     </div>
                     
                     <div className="flex justify-end items-center gap-4 mt-4">
                         <div className="flex bg-[#F8FAFC] border border-gray-100 rounded-full p-1">
                            <button onClick={() => setViewMode('COMPACT')} className={`px-4 py-1.5 text-[11px] font-bold rounded-full transition-colors ${viewMode === 'COMPACT' ? 'text-black bg-[#FFD400] shadow-xs' : 'text-slate-500 hover:bg-gray-100'}`}>COMPACT</button>
                            <button onClick={() => setViewMode('DEFAULT')} className={`px-4 py-1.5 text-[11px] font-bold rounded-full transition-colors ${viewMode === 'DEFAULT' ? 'text-black bg-[#FFD400] shadow-xs' : 'text-slate-500 hover:bg-gray-100'}`}>DEFAULT</button>
                            <button onClick={() => setViewMode('RELAXED')} className={`px-4 py-1.5 text-[11px] font-bold rounded-full transition-colors ${viewMode === 'RELAXED' ? 'text-black bg-[#FFD400] shadow-xs' : 'text-slate-500 hover:bg-gray-100'}`}>RELAXED</button>
                         </div>
                         <div className="relative">
                            <button 
                               onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                               className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 bg-[#F8FAFC] border border-gray-100 hover:bg-gray-100 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer">
                               <Settings size={13} strokeWidth={2.5} /> COLUMNS
                            </button>
                            
                            {showColumnsMenu && (
                               <div className="absolute right-0 top-full mt-2 w-[230px] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-10 text-left">
                                   <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Column Visibility</div>
                                   <div className="flex flex-col gap-3">
                                      <label className="flex items-center gap-3 cursor-pointer">
                                         <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-indigo-600" />
                                         <span className="text-[12px] font-semibold text-slate-700">Timeline / Name</span>
                                      </label>
                                      <label className="flex items-center gap-3 cursor-pointer">
                                         <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-indigo-600" />
                                         <span className="text-[12px] font-semibold text-slate-700">Primary Metric</span>
                                      </label>
                                      <label className="flex items-center gap-3 cursor-pointer">
                                         <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-indigo-600" />
                                         <span className="text-[12px] font-semibold text-slate-700">Secondary Metric</span>
                                      </label>
                                   </div>
                               </div>
                            )}
                         </div>
                      </div>
                  </div>

                  {/* Multi-column Data Table Section */}
                  <div className="overflow-x-auto px-6 py-2">
                     <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-3.5 w-12 pl-2"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" /></th>
                                
                                {activeTab === 'revenue' && (
                                   <>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Period</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Gross Revenue</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Expenses</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Net Margin</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Completed Trips</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                   </>
                                )}

                                {activeTab === 'driver' && (
                                   <>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Driver Operator</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Vehicle</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Trips Done</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Total Distance</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">On-Time Rate</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Safety Rating</th>
                                   </>
                                )}

                                {activeTab === 'customer' && (
                                   <>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client / Company</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industry Category</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Loads Requested</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Total Revenue</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Growth vs Prev</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Account Tier</th>
                                   </>
                                )}

                                {activeTab === 'warehouse' && (
                                   <>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Warehouse Zone</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage Type</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Max Capacity</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Occupied Units</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Utilization</th>
                                      <th className="py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Zone Status</th>
                                   </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-[12px]">
                            {activeTab === 'revenue' && [
                               { period: 'Feb 2026', rev: '$12,500.00', exp: '$8,200.00', margin: '+34.4%', trips: 18, status: 'Target Met' },
                               { period: 'Mar 2026', rev: '$18,900.00', exp: '$11,400.00', margin: '+39.6%', trips: 24, status: 'Peak Month' },
                               { period: 'Apr 2026', rev: '$14,200.00', exp: '$9,800.00', margin: '+30.9%', trips: 21, status: 'Normal' },
                               { period: 'May 2026', rev: '$16,800.00', exp: '$10,200.00', margin: '+39.2%', trips: 26, status: 'High Growth' },
                               { period: 'Jun 2026', rev: '$19,500.00', exp: '$12,100.00', margin: '+37.9%', trips: 29, status: 'Record Revenue' },
                            ].map((row, idx) => (
                               <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                  <td className="py-3.5 pl-2"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" /></td>
                                  <td className="py-3.5 font-bold text-gray-900">{row.period}</td>
                                  <td className="py-3.5 font-bold text-emerald-600 text-right">{row.rev}</td>
                                  <td className="py-3.5 font-bold text-rose-500 text-right">{row.exp}</td>
                                  <td className="py-3.5 font-bold text-gray-800 text-right">{row.margin}</td>
                                  <td className="py-3.5 font-bold text-gray-800 text-center">{row.trips}</td>
                                  <td className="py-3.5 text-center">
                                     <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">{row.status}</span>
                                  </td>
                               </tr>
                            ))}

                            {activeTab === 'driver' && [
                               { driver: 'John D.', vehicle: 'Volvo FH16 (FL-01)', trips: 42, dist: '4,820 km', rate: '98.4%', rating: '4.9 ★' },
                               { driver: 'Sarah R.', vehicle: 'Scania R500 (FL-03)', trips: 38, dist: '4,150 km', rate: '96.2%', rating: '4.8 ★' },
                               { driver: 'Donald S.', vehicle: 'Freightliner (FL-07)', trips: 35, dist: '3,900 km', rate: '94.8%', rating: '4.7 ★' },
                               { driver: 'Mike T.', vehicle: 'Kenworth T680 (FL-09)', trips: 29, dist: '3,100 km', rate: '99.1%', rating: '5.0 ★' },
                               { driver: 'Emily K.', vehicle: 'Mercedes Actros (FL-12)', trips: 31, dist: '3,450 km', rate: '97.5%', rating: '4.8 ★' },
                            ].map((row, idx) => (
                               <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                  <td className="py-3.5 pl-2"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" /></td>
                                  <td className="py-3.5 font-bold text-gray-900">{row.driver}</td>
                                  <td className="py-3.5 font-semibold text-gray-600">{row.vehicle}</td>
                                  <td className="py-3.5 font-bold text-gray-800 text-center">{row.trips}</td>
                                  <td className="py-3.5 font-bold text-indigo-600 text-right">{row.dist}</td>
                                  <td className="py-3.5 font-bold text-emerald-600 text-center">{row.rate}</td>
                                  <td className="py-3.5 text-center">
                                     <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-100">{row.rating}</span>
                                  </td>
                               </tr>
                            ))}

                            {activeTab === 'customer' && [
                               { client: 'ABC Motors Pty Ltd', cat: 'Automotive Dealer', loads: 14, rev: '$28,800.00', growth: '+15.2%', tier: 'VIP Partner' },
                               { client: 'Smith Logistics', cat: 'Freight Freight', loads: 10, rev: '$19,200.00', growth: '+8.4%', tier: 'Standard' },
                               { client: 'EV Fleet Co', cat: 'Electric Transport', loads: 8, rev: '$16,500.00', growth: '+22.0%', tier: 'Growth' },
                               { client: 'City Distribution', cat: 'Retail Logistics', loads: 6, rev: '$11,200.00', growth: '-3.1%', tier: 'Standard' },
                               { client: 'Global Logistics', cat: 'International', loads: 12, rev: '$24,500.00', growth: '+18.7%', tier: 'VIP Partner' },
                            ].map((row, idx) => (
                               <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                  <td className="py-3.5 pl-2"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" /></td>
                                  <td className="py-3.5 font-bold text-gray-900">{row.client}</td>
                                  <td className="py-3.5 font-semibold text-gray-500">{row.cat}</td>
                                  <td className="py-3.5 font-bold text-gray-800 text-center">{row.loads}</td>
                                  <td className="py-3.5 font-bold text-emerald-600 text-right">{row.rev}</td>
                                  <td className="py-3.5 font-bold text-indigo-600 text-right">{row.growth}</td>
                                  <td className="py-3.5 text-center">
                                     <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">{row.tier}</span>
                                  </td>
                               </tr>
                            ))}

                            {activeTab === 'warehouse' && [
                               { zone: 'Bay A', type: 'Dry Storage', cap: '1,200 Pallets', occ: '1,020 Pallets', util: '85.0%', status: 'High Occupancy' },
                               { zone: 'Bay B', type: 'Cold Storage', cap: '800 Pallets', occ: '740 Pallets', util: '92.5%', status: 'Near Capacity' },
                               { zone: 'Bay C', type: 'Hazardous Goods', cap: '500 Pallets', occ: '310 Pallets', util: '62.0%', status: 'Optimal' },
                               { zone: 'Bay D', type: 'Overflow & Holding', cap: '1,500 Pallets', occ: '890 Pallets', util: '59.3%', status: 'Available Space' },
                            ].map((row, idx) => (
                               <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                  <td className="py-3.5 pl-2"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" /></td>
                                  <td className="py-3.5 font-bold text-gray-900">{row.zone}</td>
                                  <td className="py-3.5 font-semibold text-gray-500">{row.type}</td>
                                  <td className="py-3.5 font-bold text-gray-800 text-right">{row.cap}</td>
                                  <td className="py-3.5 font-bold text-indigo-600 text-right">{row.occ}</td>
                                  <td className="py-3.5 font-bold text-emerald-600 text-center">{row.util}</td>
                                  <td className="py-3.5 text-center">
                                     <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">{row.status}</span>
                                  </td>
                               </tr>
                            ))}
                        </tbody>
                     </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-6 py-3.5 flex items-center justify-between border-t border-gray-100 bg-[#FAFAFA] rounded-b-[20px]">
                      <span className="text-[10px] font-semibold text-gray-500">Showing 1 to 5 of 5 entries</span>
                      <div className="flex items-center gap-1.5">
                          <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 bg-white cursor-pointer">
                             <ChevronLeft size={12} strokeWidth={3} />
                          </button>
                          <button className="w-6 h-6 flex items-center justify-center rounded border border-transparent bg-indigo-600 text-white text-[10px] font-bold shadow-xs cursor-pointer">
                             1
                          </button>
                          <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 bg-white text-[10px] font-bold cursor-pointer">
                             2
                          </button>
                          <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 bg-white cursor-pointer">
                             <ChevronRight size={12} strokeWidth={3} />
                          </button>
                      </div>
                  </div>
               </>
            )}

         </div>

    </div>
  );
}
