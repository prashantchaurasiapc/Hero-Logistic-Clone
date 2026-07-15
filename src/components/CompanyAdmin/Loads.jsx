import React, { useState } from 'react';
import {
  Plus, Search, X, Star, MoreVertical, ChevronDown,
  Upload, Download, Sparkles, MapPin, Truck, CheckCircle,
  AlertCircle, Clock, Filter, ChevronLeft, ChevronRight,
  Eye, Edit3, Trash2, Package, Calendar
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import CreateLoad from './CreateLoad';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const LOADS = [
  {
    id: 'L-12548', ref: 'sbsuroc', status: 'ACTIVE', statusSub: 'InRoute',
    from: 'Sydney', to: 'Melbourne', stops: 3,
    driver: 'Mike Thompson', truck: 'TRK-381 · Scania T500', driverBadge: 'On The Road',
    avatar: 'https://i.pravatar.cc/150?u=10',
    pickup: '08/07/2025 09:54 AM', eta: '18/07/2025 08:00 AM', progress: 62,
  },
  {
    id: 'L-12547', ref: 'dney', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Sydney', to: 'Adelaide', stops: 2,
    driver: 'John Smith', truck: 'TRK-214 · Kenworth T7B', driverBadge: 'On The Road',
    avatar: 'https://i.pravatar.cc/150?u=11',
    pickup: '18/07/2025 12:00 AM', eta: '18/07/2025 02:00 AM', progress: 0,
  },
  {
    id: 'L-12546', ref: 'rh', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Perth', to: 'Fremantle', stops: 1,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '15/07/2025 02:30 PM', eta: '—', progress: 0,
  },
  {
    id: 'L-12545', ref: 'sbsuroc', status: 'ACTIVE', statusSub: 'Notice 2',
    from: 'Melbourne', to: 'Sydney', stops: 2,
    driver: 'David Wilson', truck: 'TRK-291 · Scania T500', driverBadge: 'On The Road',
    avatar: 'https://i.pravatar.cc/150?u=12',
    pickup: '09/07/2025 04:50 AM', eta: '12/07/2025 04:00 AM', progress: 40,
  },
  {
    id: 'L-12544', ref: 'sbsave', status: 'COMPLETED', statusSub: 'Completed',
    from: 'Brisbane', to: 'Gold Coast', stops: 1,
    driver: 'Mark Davis', truck: 'TRK-502 · Scania T500', driverBadge: 'Completed',
    avatar: 'https://i.pravatar.cc/150?u=13',
    pickup: '07/07/2025 07:02 AM', eta: '07/07/2025 12:12 PM', progress: 100,
  },
  {
    id: 'L-12543', ref: 'dney', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Sydney', to: 'Newcastle', stops: 1,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '08/07/2025 01:00 AM', eta: '—', progress: 0,
  },
  {
    id: 'L-12542', ref: 'lalale', status: 'PLANNED', statusSub: 'Ready',
    from: 'Adelaide', to: 'Darwin', stops: 3,
    driver: 'Sarah Mitchell', truck: 'TRK-144 · Scania T500', driverBadge: 'En Route',
    avatar: 'https://i.pravatar.cc/150?u=14',
    pickup: '23/07/2025 01:35 PM', eta: '22/07/2025 04:03 PM', progress: 28,
  },
  {
    id: 'L-12541', ref: 'sbsuroc', status: 'ACTIVE', statusSub: 'InRoute',
    from: 'Melbourne', to: 'Sydney', stops: 2,
    driver: 'Chris Lee', truck: 'TRK-338 · Scania T540', driverBadge: 'On The Road',
    avatar: 'https://i.pravatar.cc/150?u=15',
    pickup: '10/07/2025 03:42 AM', eta: '12/07/2025 11:00 AM', progress: 30,
  },
  {
    id: 'L-12540', ref: 'sbsuroc', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Sydney', to: 'Adelaide', stops: 1,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '01/07/2025 01:55 AM', eta: '—', progress: 0,
  },
  {
    id: 'L-12539', ref: 'dney', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Sydney', to: 'Adelaide', stops: 1,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '02/07/2025 02:16 AM', eta: '—', progress: 0,
  },
  {
    id: 'L-12538', ref: 'rth', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Perth', to: 'Melbourne', stops: 2,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '03/07/2025 03:15 AM', eta: '—', progress: 0,
  },
  {
    id: 'L-12537', ref: 'sbsuroc', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Sydney', to: 'Melbourne', stops: 1,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '04/07/2025 04:12 AM', eta: '—', progress: 0,
  },
  {
    id: 'L-12536', ref: 'sbsave', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Brisbane', to: 'Gold Coast', stops: 1,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '05/07/2025 05:24 AM', eta: '—', progress: 0,
  },
  {
    id: 'L-12535', ref: 'dney', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Sydney', to: 'Newcastle', stops: 1,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '06/07/2025 03:31 AM', eta: '—', progress: 0,
  },
  {
    id: 'L-12534', ref: 'lalale', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Adelaide', to: 'Melbourne', stops: 1,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '07/07/2025 07:14 AM', eta: '—', progress: 0,
  },
  {
    id: 'L-12533', ref: 'sbsuroc', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Sydney', to: 'Melbourne', stops: 1,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '08/07/2025 08:21 AM', eta: '—', progress: 0,
  },
  {
    id: 'L-12532', ref: 'dney', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Sydney', to: 'Adelaide', stops: 1,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '09/07/2025 08:14 AM', eta: '—', progress: 0,
  },
  {
    id: 'L-12531', ref: 'rth', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Perth', to: 'Melbourne', stops: 1,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '01/07/2025 01:15 AM', eta: '—', progress: 0,
  },
  {
    id: 'L-12530', ref: 'sbsuroc', status: 'DRAFT', statusSub: 'Not Ready',
    from: 'Sydney', to: 'Melbourne', stops: 1,
    driver: null, truck: null, driverBadge: null, avatar: null,
    pickup: '02/07/2025 02:12 AM', eta: '—', progress: 0,
  },
  {
    id: 'L-12529', ref: 'sbsuroc', status: 'PLANNED', statusSub: 'Ready',
    from: 'Melbourne', to: 'Sydney', stops: 1,
    driver: 'Mike Thompson', truck: 'TRK-381 · Scania T500', driverBadge: 'On The Road',
    avatar: 'https://i.pravatar.cc/150?u=10',
    pickup: '01/07/2025 01:00 AM', eta: '03/07/2025 08:00 AM', progress: 0,
  },
];

const STATUS_STYLES = {
  'ACTIVE':    { badge: 'bg-emerald-100 text-emerald-700', sub: 'text-emerald-600' },
  'PLANNED':   { badge: 'bg-blue-100 text-blue-700',       sub: 'text-blue-600'   },
  'DRAFT':     { badge: 'bg-slate-100 text-slate-600',     sub: 'text-slate-500'  },
  'COMPLETED': { badge: 'bg-purple-100 text-purple-700',   sub: 'text-purple-600' },
  'CANCELLED': { badge: 'bg-rose-100 text-rose-700',       sub: 'text-rose-600'   },
};

const PROGRESS_COLOR = (v) => {
  if (v === 100) return 'bg-purple-500';
  if (v >= 50)  return 'bg-emerald-500';
  if (v > 0)    return 'bg-blue-500';
  return 'bg-slate-200';
};

const TABS = [
  { label: 'All Loads', count: 128 },
  { label: 'Draft',     count: 12  },
  { label: 'Planned',   count: 18  },
  { label: 'Active',    count: 42  },
  { label: 'Completed', count: 51  },
  { label: 'Cancelled', count: 5   },
];

const PIE_DATA = [
  { name: 'Active',    value: 42, color: '#10b981' },
  { name: 'Planned',   value: 18, color: '#3b82f6' },
  { name: 'Draft',     value: 12, color: '#94a3b8' },
  { name: 'Completed', value: 51, color: '#a855f7' },
  { name: 'Cancelled', value: 5,  color: '#ef4444' },
];

const ALERTS = [
  { id:'PO-12443', color:'bg-blue-500',   msg:'Delay - Traffic congestion on M1 - ETA may be affected', time:'5m ago' },
  { id:'PO-12444', color:'bg-amber-400',  msg:'Missing customer POD required before auction',            time:'15m ago'},
  { id:'PO-12445', color:'bg-emerald-500',msg:'Driver arrives in 20 min',                                time:'1h ago' },
];

const PAGE_SIZE = 20;

export default function Loads() {
  const [activeTab,   setActiveTab  ] = useState(0);
  const [search,      setSearch     ] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu,    setOpenMenu   ] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Show full-page Create Load console
  if (showCreateForm) {
    return <CreateLoad onBack={() => setShowCreateForm(false)} />;
  }

  const filtered = LOADS.filter(l => {
    const q = search.toLowerCase();
    return !q || l.id.toLowerCase().includes(q) || l.ref.toLowerCase().includes(q)
      || (l.driver || '').toLowerCase().includes(q) || l.from.toLowerCase().includes(q) || l.to.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleRow = (id) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const allChecked = selectedIds.length === paged.length && paged.length > 0;

  return (
    <div className="flex-grow bg-[#F8FAFC] w-full font-sans overflow-hidden flex flex-col min-h-0">
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ════ LEFT: Main ════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 pb-0">

          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Loads</h1>
              <p className="text-xs font-medium text-slate-500">Manage and track all loads in your operation</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <span className="text-slate-400 text-base leading-none">•</span> Import
              </button>
              <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <span className="text-slate-400 text-base leading-none">•</span> Export
              </button>
              <button className="flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> AI LOAD
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FFCC00] hover:bg-[#FACC15] rounded-xl text-xs font-extrabold text-black transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3px]" /> New Load
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
                  activeTab === i
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-transparent text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === i
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Filter Row 1 */}
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search loads..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400 w-36"
              />
            </div>
            {['mm/dd/yyyy', 'mm/dd/yyyy', 'All Status ▾', 'All Types ▾', 'All Customer ▾'].map((ph, i) => (
              <button key={i} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-500 hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap">
                {i < 2 && <Calendar className="w-3 h-3 text-slate-400" />}
                {ph}
              </button>
            ))}
          </div>

          {/* Filter Row 2 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {['All Drivers ▾', 'All Vehicles ▾', 'All Locations ▾', 'All Locations ▾'].map((ph, i) => (
              <button key={i} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-500 hover:bg-slate-50">
                {ph}
              </button>
            ))}
            <button className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-500 hover:bg-slate-50 flex items-center gap-1.5">
              <Filter className="w-3 h-3" /> More Filters
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-[11px] font-bold text-slate-500">{filtered.length} loads found</p>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50">
                <MoreVertical className="w-3 h-3" /> Columns
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50">
                Group By
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50">
                Sort By: Created Date (Newest) <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: 900 }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-3 py-3 w-8">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={() => setSelectedIds(allChecked ? [] : paged.map(l => l.id))}
                        className="w-3.5 h-3.5 rounded accent-amber-400"
                      />
                    </th>
                    {['LTE', 'DRIVER / TRUCK', 'PICKUP DATE', 'ETA / DELIVERY', 'PROGRESS', 'ACTIONS'].map(h => (
                      <th key={h} className="px-3 py-3 text-[8.5px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paged.map((load, i) => {
                    const st = STATUS_STYLES[load.status] || STATUS_STYLES.DRAFT;
                    const isSelected = selectedIds.includes(load.id);
                    return (
                      <tr
                        key={i}
                        className={`transition-colors group ${isSelected ? 'bg-amber-50/40' : 'hover:bg-slate-50/60'}`}
                      >
                        {/* Checkbox */}
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(load.id)}
                            className="w-3.5 h-3.5 rounded accent-amber-400"
                          />
                        </td>

                        {/* LTE: Load ref + status + route */}
                        <td className="px-3 py-3 min-w-[160px]">
                          <div className="text-[11px] font-black text-blue-600 hover:underline cursor-pointer mb-1">{load.ref}</div>
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase ${st.badge} mb-1`}>
                            {load.status}
                            <span className={`font-medium normal-case text-[7.5px] opacity-80`}>· {load.statusSub}</span>
                          </div>
                          <div className="text-[9px] font-medium text-slate-400 leading-snug">
                            {load.stops} stops · {load.from} → {load.to}
                          </div>
                        </td>

                        {/* Driver / Truck */}
                        <td className="px-3 py-3 min-w-[180px]">
                          {load.driver ? (
                            <div className="flex items-center gap-2.5">
                              <img src={load.avatar} alt={load.driver} className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0" />
                              <div>
                                <div className="text-[11px] font-bold text-slate-900 whitespace-nowrap">{load.driver}</div>
                                <div className="text-[9px] font-medium text-slate-400">{load.truck}</div>
                                <span className="inline-block px-1.5 py-0.5 mt-0.5 bg-blue-100 text-blue-700 text-[8px] font-black rounded-md">
                                  {load.driverBadge}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400 italic">Not Assigned</span>
                          )}
                        </td>

                        {/* Pickup Date */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-[11px] font-bold text-slate-800">{load.pickup.split(' ')[0]}</div>
                          <div className="text-[9px] font-medium text-slate-400">{load.pickup.split(' ').slice(1).join(' ')}</div>
                        </td>

                        {/* ETA / Delivery */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          {load.eta !== '—' ? (
                            <>
                              <div className="text-[11px] font-bold text-slate-800">{load.eta.split(' ')[0]}</div>
                              <div className="text-[9px] font-medium text-slate-400">{load.eta.split(' ').slice(1).join(' ')}</div>
                            </>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-400">—</span>
                          )}
                        </td>

                        {/* Progress */}
                        <td className="px-3 py-3 min-w-[110px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${PROGRESS_COLOR(load.progress)} transition-all`}
                                style={{ width: `${load.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-slate-700 w-8 text-right">{load.progress}%</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-3 relative whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <button className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-[10px] font-bold transition-colors">
                              <Eye className="w-3 h-3" /> View
                            </button>
                            <button
                              onClick={() => setOpenMenu(openMenu === load.id + i ? null : load.id + i)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {openMenu === load.id + i && (
                            <div className="absolute right-4 top-12 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 w-36 text-xs text-slate-700">
                              <button className="w-full px-3 py-2 text-left font-bold hover:bg-slate-50 flex items-center gap-2">
                                <Edit3 className="w-3.5 h-3.5 text-slate-400" /> Edit
                              </button>
                              <button className="w-full px-3 py-2 text-left font-bold hover:bg-rose-50 text-rose-600 flex items-center gap-2">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400">
                Showing 1 to {Math.min(PAGE_SIZE, filtered.length)} of {filtered.length} loads
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {[1, 2, '...', 7].map((pg, i) => (
                  <button
                    key={i}
                    onClick={() => typeof pg === 'number' && setCurrentPage(pg)}
                    className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-colors border ${
                      currentPage === pg
                        ? 'bg-[#FFCC00] border-[#FACC15] text-black'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    } ${pg === '...' ? 'cursor-default' : ''}`}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <select className="ml-2 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 focus:outline-none">
                  <option>20 per page</option>
                  <option>50 per page</option>
                  <option>100 per page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Action Bar */}
          <div className="mt-3 mb-5 flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
            <span className="text-[11px] font-black text-slate-900 px-2">{selectedIds.length} selected</span>
            <select className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 focus:outline-none focus:border-amber-400">
              <option>Bulk Action</option>
              <option>Assign Driver</option>
              <option>Mark Completed</option>
              <option>Cancel Loads</option>
              <option>Export Selected</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm">
              Apply
            </button>
          </div>
        </div>

        {/* ════ RIGHT: Sidebar ════════════════════════════ */}
        <div className="w-80 shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-y-auto p-6 gap-6">

          {/* Load Overview */}
          <div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Load Overview</div>
            <div className="text-[9px] font-bold text-slate-400 mb-4">TODAY: 10 JULY 2025</div>
            <div className="space-y-3">
              {[
                { label: 'Total Loads',     value: 128, icon: <Package    className="w-3.5 h-3.5"/>, color: 'bg-slate-100 text-slate-600'   },
                { label: 'Active Loads',    value: 42,  icon: <Truck      className="w-3.5 h-3.5"/>, color: 'bg-emerald-100 text-emerald-600'},
                { label: 'In Transit',      value: 31,  icon: <MapPin     className="w-3.5 h-3.5"/>, color: 'bg-blue-100 text-blue-600'     },
                { label: 'At Stop',         value: 11,  icon: <Clock      className="w-3.5 h-3.5"/>, color: 'bg-amber-100 text-amber-600'   },
                { label: 'Completed Today', value: 8,   icon: <CheckCircle className="w-3.5 h-3.5"/>,color: 'bg-purple-100 text-purple-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100"/>

          {/* Status Breakdown */}
          <div>
            <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-3">Status Breakdown</div>
            <div className="flex justify-center mb-3">
              <div className="w-28 h-28 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PIE_DATA} innerRadius={38} outerRadius={54} paddingAngle={2} dataKey="value" stroke="none">
                      {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-black text-slate-900">128</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">TOTAL</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              {PIE_DATA.map((item, i) => {
                const pct = ((item.value / 128) * 100).toFixed(1);
                return (
                  <div key={i} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}/>
                      <span className="font-semibold text-slate-600">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-900">{item.value}</span>
                      <span className="text-[8px] font-medium text-slate-400">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100"/>

          {/* Recent Alerts */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Recent Alerts</span>
              <button className="text-[9px] font-bold text-blue-600 hover:underline uppercase tracking-wider">View All</button>
            </div>
            <div className="space-y-3">
              {ALERTS.map((a, i) => (
                <div key={i} className="flex gap-2">
                  <div className={`w-4 h-4 rounded-full ${a.color} flex items-center justify-center shrink-0 mt-0.5`}>
                    <AlertCircle className="w-2.5 h-2.5 text-white"/>
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline gap-1">
                      <span className="text-[9px] font-black text-blue-600">{a.id}</span>
                      <span className="text-[8px] font-medium text-slate-400 shrink-0">{a.time}</span>
                    </div>
                    <p className="text-[9px] font-medium text-slate-500 leading-snug mt-0.5">{a.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              View All Alerts
            </button>
          </div>
        </div>
      </div>

      {openMenu && <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)}/>}
    </div>
  );

}
