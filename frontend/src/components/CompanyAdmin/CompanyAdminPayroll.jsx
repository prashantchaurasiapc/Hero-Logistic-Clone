import React, { useState } from 'react';
import { 
  Users, DollarSign, Calendar, Plus, Download, FileText, CheckCircle2, 
  Clock, Filter, Search, ChevronRight, Eye, Edit3, AlertCircle, ArrowUpRight, X
} from 'lucide-react';

const initialPayrollRunsList = [
  { id: 1, name: 'Weekly Driver Payroll - W28 2025', period: '14 Jul - 20 Jul 2025', branch: 'Sydney Head Office', employees: 24, type: 'Driver Hourly + Mileage', total: '$42,850.00', date: '21 Jul 2025', user: 'Sarah Mitchell', status: 'Completed' },
  { id: 2, name: 'Weekly Driver Payroll - W29 2025', period: '21 Jul - 27 Jul 2025', branch: 'Sydney Head Office', employees: 26, type: 'Driver Hourly + Mileage', total: '$45,210.00', date: '28 Jul 2025', user: 'Sarah Mitchell', status: 'Approved' },
  { id: 3, name: 'Fortnightly Admin & Ops Payroll', period: '15 Jul - 28 Jul 2025', branch: 'All Branches', employees: 18, type: 'Salaried & Staff', total: '$68,400.00', date: '29 Jul 2025', user: 'Sarah Mitchell', status: 'Pending Review' },
  { id: 4, name: 'Melbourne Depot Payroll - W29', period: '21 Jul - 27 Jul 2025', branch: 'Melbourne Branch', employees: 15, type: 'Driver Hourly', total: '$28,900.00', date: '28 Jul 2025', user: 'James Patel', status: 'Completed' },
];

const initialDriverPaySummary = [
  { id: 1, name: 'Noah Williams', role: 'Linehaul Driver', hours: '45.5 hrs', km: '1,840 km', basePay: '$1,592.50', kmAllowance: '$368.00', totalPay: '$1,960.50', status: 'Verified' },
  { id: 2, name: 'Liam Smith', role: 'Local P&D Driver', hours: '38.0 hrs', km: '420 km', basePay: '$1,140.00', kmAllowance: '$84.00', totalPay: '$1,224.00', status: 'Verified' },
  { id: 3, name: 'Ethan Jones', role: 'B-Double Driver', hours: '52.0 hrs', km: '2,210 km', basePay: '$1,924.00', kmAllowance: '$442.00', totalPay: '$2,366.00', status: 'Verified' },
  { id: 4, name: 'Mason Brown', role: 'Casual Driver', hours: '24.0 hrs', km: '310 km', basePay: '$768.00', kmAllowance: '$62.00', totalPay: '$830.00', status: 'Review Due' },
];

export default function StandalonePayroll() {
  const [activeTab, setActiveTab] = useState('Payroll Runs');
  const [search, setSearch] = useState('');
  const [payrollRuns, setPayrollRuns] = useState(initialPayrollRunsList);
  const [driverPay, setDriverPay] = useState(initialDriverPaySummary);
  
  // Modals & Interactivity
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPayRun, setSelectedPayRun] = useState(null);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New Payroll Run Form State
  const [newRun, setNewRun] = useState({
    name: '',
    period: '',
    branch: 'Sydney Head Office',
    employees: '25'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateRun = (e) => {
    e.preventDefault();
    if (!newRun.name || !newRun.period) {
      alert('Please fill in Run Name and Pay Period.');
      return;
    }
    const item = {
      id: Date.now(),
      name: newRun.name,
      period: newRun.period,
      branch: newRun.branch,
      employees: parseInt(newRun.employees) || 20,
      type: 'Driver Hourly + Allowance',
      total: '$43,500.00',
      date: 'Today',
      user: 'Sarah Mitchell',
      status: 'Pending Review'
    };
    setPayrollRuns([item, ...payrollRuns]);
    setNewRun({ name: '', period: '', branch: 'Sydney Head Office', employees: '25' });
    setShowCreateModal(false);
    showToast('New Payroll Run created successfully!');
  };

  const handleExportABA = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Run Name,Period,Branch,Employees,Total Amount,Status"]
      .concat(payrollRuns.map(e => `"${e.name}","${e.period}","${e.branch}","${e.employees}","${e.total}","${e.status}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Payroll_ABA_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Payroll ABA Direct Entry file generated!');
  };

  const filteredRuns = payrollRuns.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.branch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-3 sm:p-6 lg:p-8 font-sans pb-24 text-slate-900 overflow-x-hidden">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1 flex-wrap">
            <span>ADMIN PORTAL</span>
            <ChevronRight size={12} className="shrink-0" />
            <span className="text-slate-900 font-bold">Payroll Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5 flex-wrap">
            <Users className="text-indigo-600 shrink-0" size={26} />
            <span>Company Payroll & Driver Earnings</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed">
            Manage weekly driver payroll runs, timesheet hours, mileage allowances, payslip generation, and Single Touch Payroll (STP) compliance.
          </p>
        </div>

        {/* Action Buttons - Single Line Layout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-nowrap overflow-x-auto">
          <button 
            onClick={handleExportABA} 
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-xs hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download size={14} className="shrink-0" /> 
            <span>Export ABA File</span>
          </button>
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus size={16} className="shrink-0" /> 
            <span>Create Payroll Run</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Payroll MTD</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0"><DollarSign size={16} /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">$185,360.00</p>
          <span className="text-[10px] font-bold text-emerald-600 mt-1">+3.2% vs last month</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Drivers Paid</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0"><Users size={16} /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">42 Drivers</p>
          <span className="text-[10px] font-bold text-slate-500 mt-1">100% Timesheets approved</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pending Pay Run</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0"><Clock size={16} /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">$68,400.00</p>
          <span className="text-[10px] font-bold text-amber-600 mt-1">Due in 2 days</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">STP Payroll Status</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0"><CheckCircle2 size={16} /></div>
          </div>
          <p className="text-2xl font-black text-emerald-600">Compliant</p>
          <span className="text-[10px] font-bold text-slate-500 mt-1">ATO Lodgement Ready</span>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden mb-6">
        <div className="flex border-b border-slate-100 px-4 sm:px-6 gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap no-scrollbar">
          {['Payroll Runs', 'Driver Pay Breakdown', 'Timesheets Summary', 'Pay Rates & Allowances'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 sm:py-4 text-xs font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600 font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>
          <span className="text-xs font-bold text-slate-400">{filteredRuns.length} runs found</span>
        </div>

        {/* Tab 1: Payroll Runs - Mobile Responsive Table */}
        {activeTab === 'Payroll Runs' && (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[720px] text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Payroll Run Name</th>
                  <th className="py-3.5 px-4 sm:px-6">Pay Period</th>
                  <th className="py-3.5 px-4 sm:px-6">Branch</th>
                  <th className="py-3.5 px-4 sm:px-6">Employees</th>
                  <th className="py-3.5 px-4 sm:px-6">Total Amount</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {filteredRuns.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-black text-slate-900">{row.name}</td>
                    <td className="py-4 px-4 sm:px-6 text-slate-600">{row.period}</td>
                    <td className="py-4 px-4 sm:px-6 font-bold">{row.branch}</td>
                    <td className="py-4 px-4 sm:px-6 font-semibold">{row.employees} Staff</td>
                    <td className="py-4 px-4 sm:px-6 font-mono font-black text-indigo-700">{row.total}</td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        row.status === 'Approved' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>{row.status}</span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button 
                        onClick={() => setSelectedPayRun(row)} 
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer" 
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Driver Pay Breakdown - Mobile Responsive Table */}
        {activeTab === 'Driver Pay Breakdown' && (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[720px] text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Driver Name</th>
                  <th className="py-3.5 px-4 sm:px-6">Role</th>
                  <th className="py-3.5 px-4 sm:px-6">Worked Hours</th>
                  <th className="py-3.5 px-4 sm:px-6">Linehaul KM</th>
                  <th className="py-3.5 px-4 sm:px-6">Base Pay</th>
                  <th className="py-3.5 px-4 sm:px-6">KM Allowance</th>
                  <th className="py-3.5 px-4 sm:px-6">Total Gross Pay</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {driverPay.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-black text-slate-900">{row.name}</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-600">{row.role}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono">{row.hours}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono text-slate-600">{row.km}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold">{row.basePay}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono text-emerald-600 font-bold">{row.kmAllowance}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono font-black text-indigo-700">{row.totalPay}</td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button 
                        onClick={() => setSelectedPayslip(row)} 
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer" 
                        title="View Payslip"
                      >
                        <FileText size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Create New Payroll Run</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateRun} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600">Run Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Weekly Driver Payroll W30" 
                  value={newRun.name}
                  onChange={e => setNewRun({ ...newRun, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-indigo-500" 
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-600">Pay Period *</label>
                <input 
                  type="text" 
                  placeholder="e.g. 28 Jul - 03 Aug 2025" 
                  value={newRun.period}
                  onChange={e => setNewRun({ ...newRun, period: e.target.value })}
                  className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-indigo-500" 
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-600">Depot / Branch</label>
                <select 
                  value={newRun.branch}
                  onChange={e => setNewRun({ ...newRun, branch: e.target.value })}
                  className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-indigo-500"
                >
                  <option value="Sydney Head Office">Sydney Head Office</option>
                  <option value="Melbourne Branch">Melbourne Branch</option>
                  <option value="Brisbane Depot">Brisbane Depot</option>
                  <option value="All Branches">All Branches</option>
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-xs hover:bg-indigo-700 cursor-pointer">
                  Create Payroll Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Run View Modal */}
      {selectedPayRun && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">{selectedPayRun.name}</h3>
                <p className="text-[10px] font-bold text-indigo-600">{selectedPayRun.period}</p>
              </div>
              <button onClick={() => setSelectedPayRun(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b"><span className="text-slate-500">Branch Depot:</span><span className="font-bold">{selectedPayRun.branch}</span></div>
              <div className="flex justify-between py-1 border-b"><span className="text-slate-500">Employees Paid:</span><span className="font-bold">{selectedPayRun.employees} Staff</span></div>
              <div className="flex justify-between py-1 border-b"><span className="text-slate-500">Total Payroll Gross:</span><span className="font-mono font-black text-indigo-700">{selectedPayRun.total}</span></div>
              <div className="flex justify-between py-1 border-b"><span className="text-slate-500">Run Status:</span><span className="font-bold text-emerald-600">{selectedPayRun.status}</span></div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setSelectedPayRun(null)} className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payslip View Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Payslip: {selectedPayslip.name}</h3>
                <p className="text-[10px] font-bold text-slate-500">{selectedPayslip.role}</p>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b"><span className="text-slate-500">Worked Hours:</span><span className="font-mono font-bold">{selectedPayslip.hours}</span></div>
              <div className="flex justify-between py-1 border-b"><span className="text-slate-500">Linehaul Distance:</span><span className="font-mono font-bold">{selectedPayslip.km}</span></div>
              <div className="flex justify-between py-1 border-b"><span className="text-slate-500">Base Hourly Wage:</span><span className="font-mono font-bold">{selectedPayslip.basePay}</span></div>
              <div className="flex justify-between py-1 border-b"><span className="text-slate-500">Mileage Allowance:</span><span className="font-mono font-bold text-emerald-600">{selectedPayslip.kmAllowance}</span></div>
              <div className="flex justify-between py-1.5 bg-indigo-50 px-3 rounded-lg"><span className="font-bold text-indigo-900">Total Net Payable:</span><span className="font-mono font-black text-indigo-700">{selectedPayslip.totalPay}</span></div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => { showToast(`Payslip for ${selectedPayslip.name} downloaded`); setSelectedPayslip(null); }} className="w-full py-2 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer flex items-center justify-center gap-2">
                <Download size={14} /> Download PDF Payslip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
