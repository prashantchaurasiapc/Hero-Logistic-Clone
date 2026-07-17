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
  ChevronRight 
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
    const csvContent = "data:text/csv;charset=utf-8,Period,Metric\nJan,100\nFeb,200";
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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Total Revenue</div>
               <div className="text-[26px] font-bold text-gray-900 tracking-tight leading-none mb-3">$12,790.00</div>
               <div className="flex justify-between items-center text-[10px] font-bold mt-2">
                   <span className="text-gray-400">Across selected period</span>
                   <span className="text-[#00D47E]">+14.2%</span>
               </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Net Profit Margin</div>
               <div className="text-[26px] font-bold text-gray-900 tracking-tight leading-none mb-3">$-3,430.00</div>
               <div className="flex justify-between items-center text-[10px] font-bold mt-2">
                   <span className="text-gray-400">After expenses</span>
                   <span className="text-[#00D47E]">-26.8% Margin</span>
               </div>
            </div>
            {/* Card 3 */}
            <div className="bg-[#F8FAFC] rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Total Trips Completed</div>
               <div className="text-[26px] font-bold text-gray-900 tracking-tight leading-none mb-3">1</div>
               <div className="flex justify-between items-center text-[10px] font-bold mt-2">
                   <span className="text-gray-400">Loads delivered</span>
                   <span className="text-[#00D47E]">Live</span>
               </div>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Active Customers</div>
               <div className="text-[26px] font-bold text-gray-900 tracking-tight leading-none mb-3">5</div>
               <div className="flex justify-between items-center text-[10px] font-bold mt-2">
                   <span className="text-gray-400">Billed shippers</span>
                   <span className="text-[#00D47E]">Stable</span>
               </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col">
           
           {/* Filters Section */}
           <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                 <Filter size={16} className="text-gray-400" strokeWidth={2.5} />
                 <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Filters:</h2>
              </div>
              <div className="flex flex-col gap-3 mb-4">
                  <div className="relative w-full">
                      <button 
                        onClick={() => { setIsPeriodMenuOpen(!isPeriodMenuOpen); setIsBranchMenuOpen(false); }}
                        className={`w-full flex justify-between items-center bg-white border rounded-xl px-4 py-2.5 text-[13px] font-medium text-gray-900 cursor-pointer transition-colors ${isPeriodMenuOpen ? 'border-[#FFD400] ring-1 ring-[#FFD400]' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                         {selectedPeriod}
                         <ChevronDown size={16} className="text-gray-900" strokeWidth={2.5} />
                      </button>
                      
                      {isPeriodMenuOpen && (
                         <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-800 z-20">
                            {['Today', 'This Week', 'This Month', 'Last Quarter', 'Year to Date'].map(period => (
                               <div 
                                 key={period}
                                 onClick={() => { setSelectedPeriod(period); setIsPeriodMenuOpen(false); }}
                                 className={`px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#1E64D9] hover:text-white transition-colors ${selectedPeriod === period ? 'bg-[#1E64D9] text-white' : 'text-gray-900 bg-white'}`}
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
                        className={`w-full flex justify-between items-center bg-white border rounded-xl px-4 py-2.5 text-[13px] font-medium text-gray-900 cursor-pointer transition-colors ${isBranchMenuOpen ? 'border-[#FFD400] ring-1 ring-[#FFD400]' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                         {selectedBranch}
                         <ChevronDown size={16} className="text-gray-900" strokeWidth={2.5} />
                      </button>
                      
                      {isBranchMenuOpen && (
                         <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-800 z-20">
                            {['All Branches', 'Chicago HQ', 'Dallas Depot'].map(branch => (
                               <div 
                                 key={branch}
                                 onClick={() => { setSelectedBranch(branch); setIsBranchMenuOpen(false); }}
                                 className={`px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#1E64D9] hover:text-white transition-colors ${selectedBranch === branch ? 'bg-[#1E64D9] text-white' : 'text-gray-900 bg-white'}`}
                               >
                                  {branch}
                               </div>
                            ))}
                         </div>
                      )}
                  </div>
              </div>
              <div className="flex justify-end gap-3">
                 <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 px-5 py-2 rounded-full text-[11px] font-bold transition-colors cursor-pointer">
                     <Download size={14} strokeWidth={2.5} /> Export CSV
                 </button>
                 <button onClick={handleExportPDF} className="flex items-center gap-2 bg-[#FFD400] hover:bg-[#F0C800] text-black px-5 py-2 rounded-full text-[11px] font-bold transition-colors shadow-sm cursor-pointer">
                     <Download size={14} strokeWidth={2.5} /> Export PDF
                 </button>
              </div>
           </div>

           {/* Tabs Section */}
           <div className="flex items-center gap-8 px-6 border-b border-gray-100 overflow-x-auto custom-scrollbar">
              <button 
                onClick={() => setActiveTab('revenue')}
                className={`flex items-center gap-2 py-4 border-b-2 text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'revenue' ? 'border-[#FFD400] text-[#FFD400]' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                 <LineChart size={14} strokeWidth={2.5} /> Revenue Trends
              </button>
              <button 
                onClick={() => setActiveTab('driver')}
                className={`flex items-center gap-2 py-4 border-b-2 text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'driver' ? 'border-[#FFD400] text-[#FFD400]' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                 <Users size={14} strokeWidth={2.5} /> Driver Performance
              </button>
              <button 
                onClick={() => setActiveTab('vehicle')}
                className={`flex items-center gap-2 py-4 border-b-2 text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'vehicle' ? 'border-[#FFD400] text-[#FFD400]' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                 <Truck size={14} strokeWidth={2.5} /> Vehicle Utilization
              </button>
              <button 
                onClick={() => setActiveTab('customer')}
                className={`flex items-center gap-2 py-4 border-b-2 text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'customer' ? 'border-[#FFD400] text-[#FFD400]' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                 <TrendingUp size={14} strokeWidth={2.5} /> Customer Growth
              </button>
              <button 
                onClick={() => setActiveTab('warehouse')}
                className={`flex items-center gap-2 py-4 border-b-2 text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'warehouse' ? 'border-[#FFD400] text-[#FFD400]' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                 <Package size={14} strokeWidth={2.5} /> Warehouse Capacity
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
                           <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#00D47E]"></div><span className="text-[11px] font-bold text-[#00D47E]">Available</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]"></div><span className="text-[11px] font-bold text-[#0EA5E9]">In Transit</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#FF9800]"></div><span className="text-[11px] font-bold text-[#FF9800]">Maintenance</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#F44336]"></div><span className="text-[11px] font-bold text-[#F44336]">Out of Service</span></div>
                        </div>
                    </div>

                    {/* Right: Breakdown */}
                    <div className="flex flex-col justify-center px-4 md:px-8">
                       <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-6">Status Breakdown</h4>
                       
                       <div className="flex flex-col">
                          <div className="flex justify-between items-center py-4 border-b border-gray-100">
                             <span className="text-[12px] font-bold text-gray-900">In Transit</span>
                             <span className="text-[12px] font-bold text-[#FF9800]">45% of Fleet</span>
                          </div>
                          <div className="flex justify-between items-center py-4 border-b border-gray-100">
                             <span className="text-[12px] font-bold text-gray-900">Available</span>
                             <span className="text-[12px] font-bold text-[#FF9800]">30% of Fleet</span>
                          </div>
                          <div className="flex justify-between items-center py-4 border-b border-gray-100">
                             <span className="text-[12px] font-bold text-gray-900">Maintenance</span>
                             <span className="text-[12px] font-bold text-[#FF9800]">15% of Fleet</span>
                          </div>
                          <div className="flex justify-between items-center py-4 border-b border-gray-100">
                             <span className="text-[12px] font-bold text-gray-900">Out of Service</span>
                             <span className="text-[12px] font-bold text-[#FF9800]">10% of Fleet</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           ) : (
              <>
                 {/* Chart Section */}
                 <div className="p-6 border-b border-gray-100">
                     <h3 className="text-[13px] font-bold text-gray-900 mb-5">
                       {activeTab === 'revenue' && 'Revenue vs Expenses Flow'}
                       {activeTab === 'driver' && 'Driver Distance & Trips Metrics'}
                       {activeTab === 'customer' && 'Client Acquisition vs Output'}
                       {activeTab === 'warehouse' && 'Storage Bay Occupancy Rate'}
                     </h3>
                     <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl h-[320px] w-full"></div>
                     
                     <div className="flex justify-end items-center gap-4 mt-5">
                         <div className="flex bg-[#F8FAFC] border border-gray-100 rounded-full p-1.5">
                            <button onClick={() => setViewMode('COMPACT')} className={`px-6 py-2.5 text-[12px] font-bold rounded-full transition-colors ${viewMode === 'COMPACT' ? 'text-black bg-[#FFD400] shadow-sm' : 'text-slate-500 hover:bg-gray-100'}`}>COMPACT</button>
                            <button onClick={() => setViewMode('DEFAULT')} className={`px-6 py-2.5 text-[12px] font-bold rounded-full transition-colors ${viewMode === 'DEFAULT' ? 'text-black bg-[#FFD400] shadow-sm' : 'text-slate-500 hover:bg-gray-100'}`}>DEFAULT</button>
                            <button onClick={() => setViewMode('RELAXED')} className={`px-6 py-2.5 text-[12px] font-bold rounded-full transition-colors ${viewMode === 'RELAXED' ? 'text-black bg-[#FFD400] shadow-sm' : 'text-slate-500 hover:bg-gray-100'}`}>RELAXED</button>
                         </div>
                         <div className="relative">
                            <button 
                               onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                               className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 bg-[#F8FAFC] border border-gray-100 hover:bg-gray-100 px-4 py-1.5 rounded-lg transition-colors cursor-pointer">
                               <Settings size={13} strokeWidth={2.5} /> COLUMNS
                            </button>
                            
                            {showColumnsMenu && (
                               <div className="absolute right-0 top-full mt-2 w-[230px] bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-10 text-left">
                                   <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Column Visibility</div>
                                   <div className="flex flex-col gap-4">
                                      <label className="flex items-center gap-3 cursor-pointer">
                                         <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-500" />
                                         <span className="text-[13px] font-semibold text-slate-600">Timeline Period</span>
                                      </label>
                                      <label className="flex items-center gap-3 cursor-pointer">
                                         <input type="checkbox" className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-500" />
                                         <span className="text-[13px] font-semibold text-slate-600">New Contracts Signed</span>
                                      </label>
                                      <label className="flex items-center gap-3 cursor-pointer">
                                         <input type="checkbox" className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-500" />
                                         <span className="text-[13px] font-semibold text-slate-600">Active Loads Volume</span>
                                      </label>
                                   </div>
                               </div>
                            )}
                         </div>
                     </div>
                 </div>

                 {/* Table Section */}
                 <div className="overflow-x-auto px-6 py-2">
                    <table className="w-full text-left border-collapse">
                       <thead>
                           <tr>
                               <th className="py-4 w-14 pl-2"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#FFD400] focus:ring-[#FFD400] cursor-pointer" /></th>
                               <th className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                 {activeTab === 'revenue' && 'Period'}
                                 {activeTab === 'driver' && 'Driver Operator'}
                                 {activeTab === 'customer' && 'Timeline Period'}
                                 {activeTab === 'warehouse' && 'Warehouse Zone'}
                               </th>
                           </tr>
                       </thead>
                       <tbody>
                           {(activeTab === 'revenue' 
                              ? ['Feb', 'Mar', 'Apr', 'May', 'Jun'] 
                              : activeTab === 'driver'
                              ? ['John D.', 'Sarah R.', 'Donald S.', 'Mike T.', 'Emily K.']
                              : activeTab === 'customer'
                              ? ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4']
                              : activeTab === 'warehouse'
                              ? ['Bay A (Dry)', 'Bay B (Cold)', 'Bay C (Hazard)', 'Bay D (Overflow)']
                              : []
                           ).map((item, index) => (
                              <tr key={index} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                 <td className="py-5 pl-2"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#FFD400] focus:ring-[#FFD400] cursor-pointer" /></td>
                                 <td className="py-5 text-[13px] font-bold text-gray-900">{item}</td>
                              </tr>
                           ))}
                       </tbody>
                    </table>
                 </div>

                 {/* Pagination */}
                 <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-[#FAFAFA] rounded-b-[20px]">
                     <span className="text-[10px] font-semibold text-gray-500">Showing 1 to 5 of 6 items</span>
                     <div className="flex items-center gap-1.5">
                         <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-100 text-gray-400 hover:bg-gray-50 bg-white cursor-pointer">
                            <ChevronLeft size={12} strokeWidth={3} />
                         </button>
                         <button className="w-6 h-6 flex items-center justify-center rounded border border-transparent bg-[#FFD400] text-black text-[10px] font-bold shadow-sm cursor-pointer">
                            1
                         </button>
                         <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-100 text-gray-500 hover:bg-gray-50 bg-white text-[10px] font-bold cursor-pointer">
                            2
                         </button>
                         <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-100 text-gray-500 hover:bg-gray-50 bg-white cursor-pointer">
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
