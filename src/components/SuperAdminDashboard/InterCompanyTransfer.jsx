import React, { useState } from 'react';
import { Search, ChevronDown, Check, X as CrossIcon } from 'lucide-react';

export default function InterCompanyTransfers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [transfers, setTransfers] = useState([
    {
      id: '#TRF-501',
      status: 'Completed',
      title: 'Tesla Model 3 — VIN-901',
      details: 'Swift Cargo Express ➔ Global Shipping Co.',
      date: '2026-06-20'
    },
    {
      id: '#TRF-502',
      status: 'Transit',
      title: 'General Freight Pallets x 24',
      details: 'Apex Logistics ➔ Vance Transport Ltd.',
      date: '2026-06-22'
    },
    {
      id: '#TRF-503',
      status: 'Pending',
      title: 'Reefer Container — 40FT',
      details: 'Blue Ocean Freight ➔ Mountain Peak Carriers',
      date: '2026-06-25'
    },
    {
      id: '#TRF-504',
      status: 'Rejected',
      title: 'Hazmat Class B Drums x 8',
      details: 'Prime Delivery Services ➔ FastTrack Networks',
      date: '2026-06-18'
    }
  ]);

  const handleApprove = (id) => {
    setTransfers(prev => prev.map(tr => tr.id === id ? { ...tr, status: 'Completed' } : tr));
  };

  const handleReject = (id) => {
    setTransfers(prev => prev.map(tr => tr.id === id ? { ...tr, status: 'Rejected' } : tr));
  };

  const filteredTransfers = transfers.filter(tr => {
    const matchesSearch = tr.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tr.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tr.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const matrixData = [
    { name: 'Falcon Logistics LLC', canSend: false, canReceive: true, autoApprove: 'Enabled' },
    { name: 'Swift Cargo Express', canSend: true, canReceive: true, autoApprove: 'Disabled' },
    { name: 'Global Shipping Solutions', canSend: true, canReceive: true, autoApprove: 'Enabled' },
    { name: 'Texas Hotshot Carriers', canSend: false, canReceive: true, autoApprove: 'Disabled' },
    { name: 'Apex Logistics LLC', canSend: true, canReceive: true, autoApprove: 'Enabled' }
  ];

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 w-full font-sans text-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Super Admin • Transfers
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button className="border border-slate-200 bg-white hover:bg-slate-50 text-yellow-500 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors">
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">TOTAL TRANSFERS</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">4</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>All-time platform transfers</span>
            <span>Synced</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">COMPLETED</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">1</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Successfully delivered</span>
            <span>Stable</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">IN TRANSIT</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">1</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Currently in transit</span>
            <span>Active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">PENDING APPROVAL</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">1</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold mt-2">
            <span className="text-slate-400">Awaiting admin approval</span>
            <span className="text-rose-500 font-extrabold">Alert</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">REJECTED</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">1</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Denied transfers</span>
            <span>Stable</span>
          </div>
        </div>
      </div>

      {/* Registry Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-800 mb-1">Inter-Company Transfer Registry</h2>
            <p className="text-xs font-semibold text-slate-400">Full audit log of all platform asset and load transfers.</p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-64">
              <input 
                type="text" 
                placeholder="Search transfers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 font-sans text-slate-800"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 text-xs font-extrabold rounded-xl focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Transit">Transit</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Transfer Cards List */}
        <div className="space-y-4">
          {filteredTransfers.map((tr) => (
            <div key={tr.id} className="border border-slate-150 rounded-2xl p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white hover:shadow-xs transition-shadow">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{tr.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    tr.status === 'Completed' ? 'bg-[#E6F4EA] text-[#137333]' :
                    tr.status === 'Transit' ? 'bg-[#FEF7E0] text-[#B06000]' :
                    tr.status === 'Pending' ? 'bg-[#FEF7E0] text-[#B06000]' :
                    'bg-[#FCE8E6] text-[#C5221F]'
                  }`}>
                    {tr.status}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-800">{tr.title}</h3>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <span>{tr.details}</span>
                  <span>•</span>
                  <span>{tr.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                {tr.status === 'Pending' ? (
                  <>
                    <button 
                      onClick={() => handleApprove(tr.id)}
                      className="bg-[#0F9D58] hover:bg-[#0b8043] text-white px-5 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(tr.id)}
                      className="bg-[#DB4437] hover:bg-[#c53929] text-white px-5 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-5 py-2 rounded-xl shadow-xs transition-colors">
                    Audit Trail
                  </button>
                )}
                <ChevronDown className="w-5 h-5 text-slate-400 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs w-full">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">COMPANY TRANSFER PERMISSIONS MATRIX</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-55/20">
                <th className="p-4 pl-0">COMPANY</th>
                <th className="p-4 text-center">CAN SEND</th>
                <th className="p-4 text-center">CAN RECEIVE</th>
                <th className="p-4 text-right pr-0">AUTO-APPROVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
              {matrixData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/20">
                  <td className="p-4 pl-0 font-extrabold text-slate-800">{row.name}</td>
                  <td className="p-4 text-center">
                    {row.canSend ? (
                      <span className="text-emerald-500 inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                    ) : (
                      <span className="text-rose-500 inline-flex items-center gap-1"><CrossIcon className="w-3.5 h-3.5" /> No</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {row.canReceive ? (
                      <span className="text-emerald-500 inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                    ) : (
                      <span className="text-rose-500 inline-flex items-center gap-1"><CrossIcon className="w-3.5 h-3.5" /> No</span>
                    )}
                  </td>
                  <td className="p-4 text-right pr-0">
                    <span className="text-xs font-bold text-slate-500 border border-slate-200 bg-slate-50/50 px-3 py-1 rounded-lg">
                      {row.autoApprove}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
