import React from 'react';
import {
  Shield, Clipboard, Zap, AlertCircle, Edit, Trash2, X, Plus, Users, Calendar, List, ShieldAlert, Check
} from 'lucide-react';

const SafetyChecklistsDashboardView = () => {
  const [checklists, setChecklists] = React.useState([
    { id: 'CL-001', name: 'Standard Pre-Trip', status: 'ACTIVE', enforce: 'STRICT EXECUTION', users: 'All Drivers', schedule: 'Every Trip', items: '6 items - 5 required' },
    { id: 'CL-002', name: 'Dangerous Goods Check', status: 'ACTIVE', enforce: 'STRICT EXECUTION', users: 'DG Certified Drivers', schedule: 'DG Loads Only', items: '5 items - 5 required' },
    { id: 'CL-003', name: 'Cold Chain Monitoring', status: 'INACTIVE', enforce: 'STRICT EXECUTION', users: 'Reefer Vehicle Drivers', schedule: 'Cold Chain Loads', items: '3 items - 3 required' }
  ]);
  const [showModal, setShowModal] = React.useState(false);
  const [newChecklist, setNewChecklist] = React.useState({ name: '', users: 'All Drivers', schedule: 'Every Trip', items: '5 items - 4 required' });

  const handleAddChecklist = (e) => {
    e.preventDefault();
    const newObj = {
      id: `CL-00${checklists.length + 1}`,
      name: newChecklist.name || 'Custom Safety Inspection',
      status: 'ACTIVE',
      enforce: 'STRICT EXECUTION',
      users: newChecklist.users,
      schedule: newChecklist.schedule,
      items: newChecklist.items
    };
    setChecklists([...checklists, newObj]);
    setShowModal(false);
    setNewChecklist({ name: '', users: 'All Drivers', schedule: 'Every Trip', items: '5 items - 4 required' });
  };

  const toggleChecklist = (id) => {
    setChecklists(checklists.map(c => c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : c));
  };

  const deleteChecklist = (id) => {
    setChecklists(checklists.filter(c => c.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 flex items-center justify-center shadow-3xs">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1.5">Safety Checklists</h1>
            <p className="text-gray-500 text-[13px]">Build and manage pre-trip safety checklists. Active checklists block drivers from starting trips.</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#FFD400] hover:bg-yellow-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 text-xs cursor-pointer shadow-sm"
        >
          <Plus size={14} strokeWidth={2.5} />
          New Checklist
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center h-24 shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Checklists</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{checklists.length}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-50 text-gray-500"><Clipboard size={18} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center h-24 shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active & Enforced</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {checklists.filter(c => c.status === 'ACTIVE').length}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500"><Zap size={18} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center h-24 shadow-xs sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trips Blocked Today</p>
            <h3 className="text-2xl font-bold text-red-500 mt-1">3</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-red-50 text-red-500"><AlertCircle size={18} /></div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-[#6B7280]/90 text-white p-4 rounded-2xl flex items-center justify-between shadow-xs border border-gray-600/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-700/50 text-yellow-400 rounded-xl border border-gray-600/30 flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Trip Block Enforcement Active</h4>
            <p className="text-[11px] text-gray-200 mt-0.5 font-medium leading-relaxed">
              Drivers cannot start a trip until all required checklist items are completed. {checklists.filter(c => c.status === 'ACTIVE').length} checklists currently enforced.
            </p>
          </div>
        </div>
        <span className="text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">Live</span>
      </div>

      {/* List cards */}
      <div className="space-y-4">
        {checklists.map(c => (
          <div 
            key={c.id} 
            className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center border border-gray-100 shadow-3xs shrink-0">
                <Clipboard size={20} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-gray-950">{c.name}</span>
                  <span className="text-[10px] text-gray-400 font-bold">{c.id}</span>
                  <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${
                    c.status === 'ACTIVE' 
                      ? 'bg-emerald-50 text-[#059669] border border-emerald-100' 
                      : 'bg-gray-50 text-gray-400 border border-gray-200'
                  }`}>{c.status}</span>
                  <span className="px-1.5 py-0.5 text-[8px] font-bold bg-red-50 text-red-600 border border-red-100 rounded">{c.enforce}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600 rounded-lg text-[11px] font-semibold border border-slate-200 shadow-sm">
                    <Users size={12} className="text-slate-400" /> {c.users}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600 rounded-lg text-[11px] font-semibold border border-slate-200 shadow-sm">
                    <Zap size={12} className="text-slate-400" /> {c.schedule}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600 rounded-lg text-[11px] font-semibold border border-slate-200 shadow-sm">
                    <List size={12} className="text-slate-400" /> {c.items}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 shrink-0">
              <button className="text-xs font-bold text-gray-400 hover:text-gray-800 transition-colors cursor-pointer mr-1">Preview</button>
              <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"><Edit size={14} /></button>
              <button
                onClick={() => toggleChecklist(c.id)}
                className={`px-4 py-1.5 border rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  c.status === 'ACTIVE'
                    ? 'border-emerald-200 text-[#059669] hover:bg-emerald-50'
                    : 'border-gray-250 text-gray-400 hover:bg-gray-50'
                }`}
              >
                {c.status === 'ACTIVE' ? 'Disable' : 'Enable'}
              </button>
              <button 
                onClick={() => deleteChecklist(c.id)} 
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create safety checklist modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-md w-full p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Create Safety Checklist</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-200 hover:text-slate-400 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"><X size={20} strokeWidth={2} /></button>
            </div>
            <form onSubmit={handleAddChecklist} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Checklist Title</label>
                <input
                  type="text" required placeholder="e.g. Hazardous Materials Check"
                  value={newChecklist.name} onChange={(e) => setNewChecklist({ ...newChecklist, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#FFD400] focus:outline-none shadow-sm transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Target Operators</label>
                <input
                  type="text" required placeholder="All Drivers"
                  value={newChecklist.users} onChange={(e) => setNewChecklist({ ...newChecklist, users: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#FFD400] focus:outline-none shadow-sm transition-shadow"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Enforcement Schedule</label>
                  <input
                    type="text" required placeholder="Every Trip"
                    value={newChecklist.schedule} onChange={(e) => setNewChecklist({ ...newChecklist, schedule: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#FFD400] focus:outline-none shadow-sm transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Items Count</label>
                  <input
                    type="text" required placeholder="5 items - 4 required"
                    value={newChecklist.items} onChange={(e) => setNewChecklist({ ...newChecklist, items: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#FFD400] focus:outline-none shadow-sm transition-shadow"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#FFCC00] hover:bg-yellow-400 text-black font-extrabold py-3.5 rounded-xl text-[12px] mt-2 cursor-pointer transition-colors shadow-sm"
              >
                CREATE & ACTIVATE CHECKLIST
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyChecklistsDashboardView;
