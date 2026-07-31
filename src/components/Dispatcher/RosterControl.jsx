import React, { useState, useMemo } from 'react';
import { 
  Users, CheckCircle, Clock, Palmtree, AlertCircle, Calendar, 
  ChevronLeft, ChevronRight, Filter, Search, Phone, Mail, 
  MoreVertical, X, Download, Plus, Star, Shield, AlertTriangle
} from 'lucide-react';
import { mockWorkers, mockStats } from '../../data/mockWorkforceData';

export default function RosterControl() {
  const [workers, setWorkers] = useState(mockWorkers);
  const [selectedWorker, setSelectedWorker] = useState(mockWorkers[0]);
  const [activeTab, setActiveTab] = useState('Schedule View');
  const [sidebarTab, setSidebarTab] = useState('Overview');
  const todayDateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  
  const [filters, setFilters] = useState({
    branch: 'All Branches',
    date: todayDateStr,
    view: 'Week',
    type: 'All Types',
    role: 'All Roles',
    status: 'All Statuses',
    search: ''
  });

  const handleFilterChange = (e, field) => {
    setFilters(prev => ({ ...prev, [field]: e.target.value }));
  };

  const filteredWorkers = useMemo(() => {
    return workers.filter(worker => {
      const searchMatch = !filters.search || 
        worker.name.toLowerCase().includes(filters.search.toLowerCase()) || 
        worker.role.toLowerCase().includes(filters.search.toLowerCase());
      
      const roleMatch = filters.role === 'All Roles' || worker.role === filters.role;
      const typeMatch = filters.type === 'All Types' || worker.category.toLowerCase().includes(filters.type.toLowerCase());
      
      return searchMatch && roleMatch && typeMatch;
    });
  }, [workers, filters]);

  const stats = useMemo(() => {
    if (filteredWorkers.length === 0) return mockStats;
    
    const total = filteredWorkers.length;
    let available = 0;
    let onShift = 0;
    let onLeave = 0;
    let absent = 0;
    
    filteredWorkers.forEach(w => {
      const today = w.schedule['Fri 22 May'];
      if (today) {
        if (today.status === 'Available') available++;
        if (today.status === 'On Shift') onShift++;
        if (today.status === 'Leave') onLeave++;
        if (today.status === 'Unavailable') absent++;
      }
    });

    return {
      totalWorkforce: total,
      availableToday: available,
      availablePercentage: Math.round((available/total)*100) || 0,
      onShift: onShift,
      onShiftPercentage: Math.round((onShift/total)*100) || 0,
      onLeave: onLeave,
      onLeavePercentage: Math.round((onLeave/total)*100) || 0,
      absent: absent,
      absentPercentage: Math.round((absent/total)*100) || 0
    };
  }, [filteredWorkers]);

  return (
    <div className="flex-grow bg-[#F8FAFC] min-h-screen p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto relative flex flex-col gap-6">
      
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Workforce Availability</h1>
        <p className="text-sm text-slate-500 mt-1">
          View workforce availability, shifts and assign resources to loads.
        </p>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500">Branch</span>
            <select 
              value={filters.branch}
              onChange={(e) => handleFilterChange(e, 'branch')}
              className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500">
              <option>All Branches</option>
              <option>Melbourne Depot</option>
              <option>Sydney Branch</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500">Date</span>
            <div className="flex items-center border border-slate-200 bg-white rounded-lg px-2 py-1.5 text-sm">
              <Calendar size={14} className="text-slate-400 mr-2" />
              <span>{filters.date}</span>
              <div className="flex items-center ml-4 gap-1">
                <ChevronLeft size={16} className="text-slate-400 cursor-pointer" />
                <ChevronRight size={16} className="text-slate-400 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500">View</span>
            <select 
              value={filters.view}
              onChange={(e) => handleFilterChange(e, 'view')}
              className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500">
              <option>Week</option>
              <option>Month</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500">Workforce Type</span>
            <select 
              value={filters.type}
              onChange={(e) => handleFilterChange(e, 'type')}
              className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500">
              <option>All Types</option>
              <option>Drivers</option>
              <option>Warehouse Staff</option>
              <option>Yard Crew</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500">Role / Position</span>
            <select 
              value={filters.role}
              onChange={(e) => handleFilterChange(e, 'role')}
              className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500">
              <option>All Roles</option>
              <option>Car Carrier Driver</option>
              <option>Driver</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-slate-500">Status</span>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange(e, 'status')}
              className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500">
              <option>All Statuses</option>
              <option>Available</option>
              <option>On Shift</option>
              <option>Leave</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 mt-4">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Filter size={14} /> More Filters
            </button>
          </div>

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Workforce</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">{stats.totalWorkforce}</h2>
              <p className="text-[10px] text-slate-400 mt-1">Across all branches</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Available Today</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">{stats.availableToday}</h2>
              <p className="text-[10px] mt-1"><span className="text-emerald-500 font-semibold">{stats.availablePercentage}%</span> <span className="text-slate-400">of total</span></p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500">
              <CheckCircle size={20} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">On Shift</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">{stats.onShift}</h2>
              <p className="text-[10px] mt-1"><span className="text-blue-500 font-semibold">{stats.onShiftPercentage}%</span> <span className="text-slate-400">of total</span></p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
              <Clock size={20} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">On Leave</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">{stats.onLeave}</h2>
              <p className="text-[10px] mt-1"><span className="text-orange-500 font-semibold">{stats.onLeavePercentage}%</span> <span className="text-slate-400">of total</span></p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
              <Palmtree size={20} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Absent / Unavailable</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">{stats.absent}</h2>
              <p className="text-[10px] mt-1"><span className="text-rose-500 font-semibold">{stats.absentPercentage}%</span> <span className="text-slate-400">of total</span></p>
            </div>
            <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
              <AlertCircle size={20} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 pt-2">
            <div className="flex space-x-6">
              {['Schedule View', 'List View', 'Unavailability', 'Leave Calendar'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm ${activeTab === tab ? 'font-semibold text-blue-600 border-b-2 border-blue-600' : 'font-medium text-slate-500 hover:text-slate-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Group by:</span>
                <select className="text-xs border border-slate-200 bg-white rounded-md px-2 py-1 outline-none">
                  <option>Role</option>
                </select>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-600 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-50">
                <Plus size={14} /> Auto Fill Shifts
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
                        <input 
                          type="text" 
                          value={filters.search}
                          onChange={(e) => handleFilterChange(e, 'search')}
                          placeholder="Search by name, role, skills..." 
                          className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                        />
                      </div>
                    </th>
                    <th className="px-3 py-3 border-b border-slate-200 font-medium text-slate-500 text-center text-xs">Mon 18 May</th>
                    <th className="px-3 py-3 border-b border-slate-200 font-medium text-slate-500 text-center text-xs">Tue 19 May</th>
                    <th className="px-3 py-3 border-b border-slate-200 font-medium text-slate-500 text-center text-xs">Wed 20 May</th>
                    <th className="px-3 py-3 border-b border-slate-200 font-medium text-slate-500 text-center text-xs">Thu 21 May</th>
                    <th className="px-3 py-3 border-b border-slate-200 font-bold text-white bg-blue-600 text-center text-xs rounded-t-lg mx-1">Fri 22 May</th>
                    <th className="px-3 py-3 border-b border-slate-200 font-medium text-slate-500 text-center text-xs">Sat 23 May</th>
                    <th className="px-3 py-3 border-b border-slate-200 font-medium text-slate-500 text-center text-xs">Sun 24 May</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Drivers Category */}
                  <tr className="bg-slate-50/50">
                    <td colSpan={8} className="px-4 py-2 text-xs font-bold text-slate-700 flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-200 rounded flex items-center justify-center">-</div>
                      Drivers ({filteredWorkers.length})
                    </td>
                  </tr>
                  
                  {filteredWorkers.map((worker) => (
                    <tr 
                      key={worker.id} 
                      onClick={() => setSelectedWorker(worker)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${worker.name.replace(' ', '+')}&background=e2e8f0&color=475569`} className="w-8 h-8 rounded-full" alt="" />
                          <div>
                            <p className="font-semibold text-slate-800 text-xs">{worker.name}</p>
                            <p className="text-[10px] text-slate-500">{worker.role}</p>
                          </div>
                          <div className="ml-auto flex gap-1">
                            {worker.skills.map((skill, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded">{skill}</span>
                            ))}
                          </div>
                        </div>
                      </td>
                      
                      {['Mon 18 May', 'Tue 19 May', 'Wed 20 May', 'Thu 21 May', 'Fri 22 May', 'Sat 23 May', 'Sun 24 May'].map((day, idx) => {
                        const shift = worker.schedule[day];
                        
                        let statusClass = "text-slate-400";
                        if (shift?.status === 'On Shift') statusClass = "text-emerald-600";
                        if (shift?.status === 'Available') statusClass = "text-emerald-500";
                        if (shift?.status === 'Leave') statusClass = "text-orange-500";
                        if (shift?.status === 'Unavailable') statusClass = "text-rose-500";

                        return (
                          <td key={idx} className={`px-2 py-3 text-center ${shift?.selected ? 'bg-slate-50' : ''}`}>
                            {shift ? (
                              <div className={`flex flex-col items-center justify-center ${shift.selected ? 'border border-emerald-500 rounded p-1 bg-white' : ''}`}>
                                <span className={`${statusClass} font-semibold text-[10px]`}>{shift.status}</span>
                                {(shift.time || shift.detail) && (
                                  <span className="text-slate-400 text-[9px]">{shift.time || shift.detail}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 text-[10px]">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Other categories */}
                  {['Warehouse Staff (24)', 'Yard Crew (16)', 'Mechanics (6)', 'Administrators (3)'].map((category, idx) => (
                    <tr key={idx} className="border-b border-slate-100 opacity-50">
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700 flex items-center gap-2">
                        <div className="w-4 h-4 border border-slate-200 rounded flex items-center justify-center">+</div>
                        {category}
                      </td>
                      <td className="px-2 py-3 text-center text-xs font-medium text-slate-600">6/8</td>
                      <td className="px-2 py-3 text-center text-xs font-medium text-slate-600">7/8</td>
                      <td className="px-2 py-3 text-center text-xs font-medium text-slate-600">7/8</td>
                      <td className="px-2 py-3 text-center text-xs font-medium text-slate-600">8/8</td>
                      <td className="px-2 py-3 text-center text-xs font-medium text-blue-600 bg-slate-50">8/8</td>
                      <td className="px-2 py-3 text-center text-xs font-medium text-orange-500">5/8</td>
                      <td className="px-2 py-3 text-center text-xs font-medium text-rose-500">4/8</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Legend */}
              <div className="p-4 flex flex-col gap-4 border-t border-slate-200 bg-white rounded-b-xl overflow-x-auto">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-3 h-3 rounded-sm border border-emerald-500 bg-white"></span>
                    <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">On Shift</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-3 h-3 rounded-sm border border-emerald-400 bg-white"></span>
                    <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">Available</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-3 h-3 rounded-sm border border-orange-400 bg-white"></span>
                    <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">At Pickup</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-3 h-3 rounded-sm border border-purple-400 bg-white"></span>
                    <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">At Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-3 h-3 rounded-sm border border-blue-400 bg-white"></span>
                    <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">En Route</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-3 h-3 rounded-sm border border-slate-400 bg-white"></span>
                    <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">Break / Off Duty</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-3 h-3 rounded-sm border border-rose-400 bg-white"></span>
                    <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">Unavailable</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-3 h-3 rounded-sm border border-orange-500 bg-white"></span>
                    <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">Leave</span>
                  </div>
                </div>
                
                <div className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
                  Numbers show: Assigned / Required
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 flex flex-col items-center justify-center text-center border-t border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={24} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{activeTab}</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">This view is currently under construction. Please check back later or switch back to the Schedule View.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column (Buttons + Sidebar) */}
      {selectedWorker && (
        <div className="w-full xl:w-80 flex flex-col gap-6 flex-shrink-0">
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 w-full">
            <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm">
              <Plus size={16} /> Assign Shift
            </button>
            <button className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors">
              <Download size={16} /> Export
            </button>
          </div>

          {/* Selected Worker Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col xl:h-[calc(100vh-140px)] xl:sticky xl:top-[100px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SELECTED WORKER</span>
            <button onClick={() => setSelectedWorker(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
          
          <div className="p-5">
            <div className="flex gap-4">
              <img src={`https://ui-avatars.com/api/?name=${selectedWorker.name.replace(' ', '+')}&background=e2e8f0&color=475569`} className="w-12 h-12 rounded-full" alt="" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedWorker.name}</h3>
                  {selectedWorker.schedule['Fri 22 May']?.status === 'On Shift' && (
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded">On Shift</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedWorker.role}</p>
                <p className="text-[10px] text-slate-400 mt-1">Employee ID: {selectedWorker.id}</p>
                <p className="text-[10px] text-slate-400">Mobile: {selectedWorker.phone}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="w-7 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500"><Phone size={12} /></button>
                <button className="w-7 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500"><Mail size={12} /></button>
                <button className="w-7 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500"><MoreVertical size={12} /></button>
              </div>
            </div>

            <div className="flex border-b border-slate-200 mt-6">
              {['Overview', 'Skills & Certifications', 'Shifts', 'Notes'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setSidebarTab(tab)}
                  className={`flex-1 pb-2 text-xs text-center transition-colors ${sidebarTab === tab ? 'font-semibold text-blue-600 border-b-2 border-blue-600' : 'font-medium text-slate-500 hover:text-slate-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {sidebarTab === 'Overview' ? (
              <div className="mt-5 space-y-6">
                {/* Today */}
                {selectedWorker.schedule['Fri 22 May'] && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-3">Today - {todayDateStr}</h4>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 relative">
                      <span className="text-emerald-700 font-bold text-xs">{selectedWorker.schedule['Fri 22 May'].status}</span>
                      <span className="absolute top-3 right-3 text-[10px] text-slate-500">Load</span>
                      <p className="text-xs text-slate-600 mt-1">{selectedWorker.schedule['Fri 22 May'].time || 'N/A'}</p>
                      <p className="text-xs text-slate-500 mt-1">{selectedWorker.schedule['Fri 22 May'].detail || 'No details'}</p>
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-3">Availability</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedWorker.schedule['Sat 23 May']?.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <span className="text-xs text-slate-600">Tomorrow (23 May)</span>
                      </div>
                      <span className={`${selectedWorker.schedule['Sat 23 May']?.status === 'Available' ? 'text-emerald-500' : 'text-rose-500'} text-xs font-semibold`}>
                        {selectedWorker.schedule['Sat 23 May']?.status || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedWorker.schedule['Sun 24 May']?.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <span className="text-xs text-slate-600">Sun (24 May)</span>
                      </div>
                      <span className={`${selectedWorker.schedule['Sun 24 May']?.status === 'Available' ? 'text-emerald-500' : 'text-rose-500'} text-xs font-semibold`}>
                        {selectedWorker.schedule['Sun 24 May']?.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[10px] font-semibold hover:bg-blue-100 transition-colors">Assign Shift</button>
                    <button className="px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50 transition-colors">Add Unavailability</button>
                    <button className="col-span-2 px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50 transition-colors">Send Message</button>
                  </div>
                </div>
              </div>
            ) : sidebarTab === 'Skills & Certifications' ? (
              <div className="mt-5 space-y-6">
                {/* Skills & Roles */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Skills & Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-md border border-blue-100">{selectedWorker.role}</span>
                    {selectedWorker.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-md border border-blue-100">{skill} License</span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-3">Certifications</h4>
                  <div className="space-y-3">
                    {selectedWorker.certifications.map((cert, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-xs text-slate-600 font-medium">{cert.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] ${cert.status === 'valid' ? 'text-slate-400' : 'text-rose-500'}`}>{cert.detail}</span>
                          {cert.status === 'valid' ? (
                            <CheckCircle size={14} className="text-emerald-500" />
                          ) : (
                            <AlertTriangle size={14} className="text-orange-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-3">
                    <button className="text-blue-600 text-[10px] font-semibold hover:underline">View all certifications</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-3">
                  <AlertCircle size={20} className="text-slate-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">{sidebarTab}</h4>
                <p className="text-[10px] text-slate-500 mt-1">This section is currently empty or under construction.</p>
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
