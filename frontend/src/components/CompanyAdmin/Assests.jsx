import React from 'react';
import {
  Package, Truck, DollarSign, Globe, Users, Box, Zap, Activity,
  Plus, SlidersHorizontal, Search, FileText, AlertCircle, CheckCircle2, UserCheck,
  Truck as TruckIcon, MapPin, Trash2, ChevronLeft, Camera, Upload, Clock,
  Wrench, Shield, Droplet, List, Grid, X, UserPlus, Clipboard, Star, Edit, Building, Store, ShieldAlert,
  Power, Settings, User, RotateCcw, RefreshCw, Check, Target,
  TrendingUp, TrendingDown, CreditCard, BarChart2, PieChart, ArrowUpRight, ArrowDownRight,
  Download, Eye, Lock, Unlock, MoreVertical, Mail, Phone, Calendar,
  Key, Save, ChevronRight, ChevronDown as ChevronDownIcon, Bell, MessageSquare,
  LifeBuoy, Headphones, Inbox, Printer, ArrowLeft, Gauge, Image as ImageIcon, ArrowRight, ChevronDown, ChevronsUpDown, Flag, Info, Car, Weight, Navigation,
  Menu, CheckCircle, Award, Filter, Columns, ArrowUpDown, AlertTriangle
} from 'lucide-react';

const AssetInventoryDashboardView = () => {
  const [assets, setAssets] = React.useState([
    { id: '1', name: '2022 Toyota Camry', desc: 'White · Sedan · 1,450 kg', vin: '1HGYD2F83MA004262', plate: 'ABC 123', status: 'IN DEPOT', task: 'LD-2041', target: 'Brisbane QLD', targetSub: 'AutoDeal Pty Ltd', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60' },
    { id: '2', name: '2023 Honda CR-V', desc: 'Black · SUV · 1,720 kg', vin: '2T2YG4H08NC034828', plate: 'XYZ 087', status: 'IN TRANSIT', task: 'LD-2039', target: 'Melbourne VIC', targetSub: 'Smith Motors', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60' },
    { id: '3', name: '2024 Tesla Model S', desc: 'Red · Sedan · 2,162 kg', vin: '5YJSA1DG9PFJ12345', plate: 'EV 0001', status: 'DELIVERED', task: 'LD-2031', target: 'Sydney NSW', targetSub: 'EV Fleet Co', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60' },
    { id: '4', name: '2023 Ford Ranger', desc: 'Silver · Ute · 2,030 kg', vin: '1FMCU0G94NK2323456', plate: 'TRK-444', status: 'AWAITING LOAD', task: 'Available', target: 'Perth WA', targetSub: 'WA Motors', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60' },
    { id: '5', name: '2022 Nissan X-Trail', desc: 'Blue · SUV · 1,680 kg', vin: '3N1AB8AP7DC2321587', plate: 'NIS 202', status: 'IN DEPOT', task: 'LD-2042', target: 'Adelaide SA', targetSub: 'SA Auto Group', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60' }
  ]);
  const [search, setSearch] = React.useState('');
  const [tab, setTab] = React.useState('ALL');
  const [showModal, setShowModal] = React.useState(false);
  const [newAsset, setNewAsset] = React.useState({ name: '', desc: '', vin: '', plate: '', status: 'AWAITING LOAD', target: '', targetSub: '' });

  const handleRegisterAsset = (e) => {
    e.preventDefault();
    const newObj = {
      id: `${assets.length + 1}`,
      name: newAsset.name || 'Unnamed Asset',
      desc: newAsset.desc || 'White · Sedan · 1,500 kg',
      vin: newAsset.vin.toUpperCase() || 'VIN-TBD-00000',
      plate: newAsset.plate.toUpperCase() || 'PLATE-NEW',
      status: newAsset.status,
      task: 'Available',
      target: newAsset.target || 'Sydney NSW',
      targetSub: newAsset.targetSub || 'Central Depot',
      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60'
    };
    setAssets([newObj, ...assets]);
    setShowModal(false);
    setNewAsset({ name: '', desc: '', vin: '', plate: '', status: 'AWAITING LOAD', target: '', targetSub: '' });
  };

  const handleDeleteAsset = (id) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const filtered = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.vin.toLowerCase().includes(search.toLowerCase());
    if (tab === 'ALL') return matchesSearch;
    return matchesSearch && a.status === tab;
  });

  const [viewMode, setViewMode] = React.useState('grid');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto bg-white min-h-screen text-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1.5">Asset Inventory</h1>
          <p className="text-gray-500 text-[13px]">{assets.length} assets registered · Global VIN Search</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#141414] hover:bg-black text-white text-[13px] font-semibold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Register Asset
        </button>
      </div>

      {/* Main card wrapper */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search VIN, Plate, Make, Model, Destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs w-full focus:outline-none focus:border-yellow-400 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400'}`}
              >
                <List size={15} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400'}`}
              >
                <Grid size={15} />
              </button>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['ALL', 'AWAITING LOAD', 'IN DEPOT', 'IN TRANSIT', 'DELIVERED'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold cursor-pointer uppercase tracking-wider transition-all duration-200 ${
                    tab === t ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View content layout */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm font-medium">No assets found.</div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto min-w-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 pl-3 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="py-3 px-4">REGISTERED ASSET</th>
                  <th className="py-3 px-4">VIN / PLATE</th>
                  <th className="py-3 px-4">OPERATIONAL STATUS</th>
                  <th className="py-3 px-4">CURRENT TASK</th>
                  <th className="py-3 px-4">TARGET</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(a => (
                  <tr key={a.id} className="text-xs hover:bg-gray-50/50 transition-colors duration-200 group">
                    <td className="py-4 pl-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={a.img} alt={a.name} className="w-9 h-9 rounded-lg object-cover border border-gray-200" />
                        <div>
                          <span className="text-sm font-semibold text-gray-900 block group-hover:text-yellow-600 transition-colors">{a.name}</span>
                          <span className="text-[10px] text-gray-400 font-medium block mt-0.5">{a.desc}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 border border-gray-200 rounded bg-gray-50 font-mono text-[9px] block w-max">{a.vin}</span>
                      <span className="text-[10px] text-gray-600 font-bold block mt-1">{a.plate}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase ${
                        a.status === 'DELIVERED' ? 'bg-green-50 text-green-600 border-green-100' :
                        a.status === 'IN TRANSIT' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        a.status === 'IN DEPOT' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>{a.status}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${a.task === 'Available' ? 'text-gray-400' : 'text-blue-600 font-extrabold hover:underline cursor-pointer'}`}>
                        {a.task}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-800">{a.target}</div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{a.targetSub}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button className="p-1.5 border border-gray-200 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer"><Edit size={14} /></button>
                        <button
                          onClick={() => handleDeleteAsset(a.id)}
                          className="p-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map(a => {
              const nameParts = a.name.split(' ');
              const yearModel = nameParts[0];
              const makeModel = nameParts.slice(1).join(' ');

              return (
                <div key={a.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:border-yellow-400 hover:shadow-yellow-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between">
                  {/* Top card block with image or dark solid background */}
                  <div className="relative h-44 p-5 flex flex-col justify-between" style={{ backgroundImage: `url(${a.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    {/* Dark overlay for readability on image backgrounds */}
                    <div className="absolute inset-0 bg-black/35 z-0" />

                    {/* Checkbox and Status Badge Row */}
                    <div className="flex justify-between items-center z-10 relative">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer bg-white"
                      />
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase shadow-2xs ${
                        a.status === 'DELIVERED' ? 'bg-green-600 text-white border-green-700' :
                        a.status === 'IN TRANSIT' ? 'bg-amber-500 text-white border-amber-600' :
                        a.status === 'IN DEPOT' ? 'bg-blue-600 text-white border-blue-700' :
                        'bg-cyan-600 text-white border-cyan-700'
                      }`}>{a.status}</span>
                    </div>

                    {/* Make & VIN details overlay */}
                    <div className="z-10 relative text-left">
                      <h4 className="text-base font-bold text-white tracking-tight leading-tight">{yearModel} {makeModel}</h4>
                      <p className="text-[10px] text-gray-300 font-mono tracking-wider mt-0.5">{a.vin}</p>
                    </div>
                  </div>

                  {/* Bottom details block */}
                  <div className="p-5 text-left flex flex-col justify-between flex-grow">
                    {/* Destination & Plate details row */}
                    <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-4">
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Target Office</span>
                        <strong className="text-xs font-bold text-gray-800 block mt-1">{a.target}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Plate</span>
                        <strong className="text-xs font-bold text-gray-800 uppercase block mt-1">{a.plate}</strong>
                      </div>
                    </div>

                    {/* Asset Type Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Truck size={14} className="text-gray-400" />
                        <div className="text-left">
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">Type</span>
                          <strong className="text-xs font-bold text-gray-800 block mt-0.5">{a.desc.split(' · ')[1] || 'Sedan'}</strong>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 hover:border-yellow-200 transition-all cursor-pointer">
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(a.id)}
                          className="p-1.5 border border-gray-200 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Register Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-900">Register Asset</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={18} /></button>
            </div>
            <form onSubmit={handleRegisterAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1">Asset Model Name</label>
                <input
                  type="text" required placeholder="e.g. 2024 Tesla Model S"
                  value={newAsset.name} onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1">Specification / Weight</label>
                <input
                  type="text" required placeholder="e.g. Red · Sedan · 2,162 kg"
                  value={newAsset.desc} onChange={(e) => setNewAsset({ ...newAsset, desc: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1">VIN Code</label>
                  <input
                    type="text" required placeholder="e.g. 5YJSA1DG9PFJ12345"
                    value={newAsset.vin} onChange={(e) => setNewAsset({ ...newAsset, vin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1">Plate Number</label>
                  <input
                    type="text" required placeholder="e.g. EV 0001"
                    value={newAsset.plate} onChange={(e) => setNewAsset({ ...newAsset, plate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1">Target Location</label>
                  <input
                    type="text" required placeholder="e.g. Sydney NSW"
                    value={newAsset.target} onChange={(e) => setNewAsset({ ...newAsset, target: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1">Operator/Depot Agency</label>
                  <input
                    type="text" required placeholder="e.g. EV Fleet Co"
                    value={newAsset.targetSub} onChange={(e) => setNewAsset({ ...newAsset, targetSub: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1">Operational Status</label>
                <select
                  value={newAsset.status} onChange={(e) => setNewAsset({ ...newAsset, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none bg-white"
                >
                  <option>AWAITING LOAD</option>
                  <option>IN DEPOT</option>
                  <option>IN TRANSIT</option>
                  <option>DELIVERED</option>
                </select>
              </div>
              <button
                type="submit"
                style={{ color: '#ffffff', backgroundColor: '#141414' }}
                className="w-full font-extrabold py-2.5 rounded-xl text-xs mt-2 hover:bg-black cursor-pointer transition-colors"
              >
                SUBMIT & REGISTER ASSET
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== OPERATIONS: SAFETY CHECKLISTS DASHBOARD VIEW =====

export default AssetInventoryDashboardView;

