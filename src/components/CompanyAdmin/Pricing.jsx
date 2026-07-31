import React, { useState } from 'react';
import { 
  DollarSign, Search, Filter, Plus, Download, Upload, 
  CheckCircle2, AlertTriangle, Eye, Edit3, Trash2, ChevronRight,
  TrendingUp, Truck, MapPin, Layers, FileText, ArrowUpRight, Copy, X, Check
} from 'lucide-react';

const initialLanePricing = [
  { id: 1, origin: 'Sydney, NSW', destination: 'Melbourne, VIC', minCharge: '$450.00', baseRate: '$1,850.00', perKmRate: '$2.40 / km', fuelSurcharge: '14.5%', status: 'Active', effectiveDate: '01 Jan 2025' },
  { id: 2, origin: 'Sydney, NSW', destination: 'Brisbane, QLD', minCharge: '$520.00', baseRate: '$2,100.00', perKmRate: '$2.55 / km', fuelSurcharge: '14.5%', status: 'Active', effectiveDate: '01 Jan 2025' },
  { id: 3, origin: 'Melbourne, VIC', destination: 'Adelaide, SA', minCharge: '$380.00', baseRate: '$1,450.00', perKmRate: '$2.30 / km', fuelSurcharge: '14.5%', status: 'Active', effectiveDate: '15 Feb 2025' },
  { id: 4, origin: 'Perth, WA', destination: 'Darwin, NT', minCharge: '$850.00', baseRate: '$4,200.00', perKmRate: '$3.10 / km', fuelSurcharge: '18.0%', status: 'Active', effectiveDate: '01 Mar 2025' },
  { id: 5, origin: 'Brisbane, QLD', destination: 'Townsville, QLD', minCharge: '$480.00', baseRate: '$1,950.00', perKmRate: '$2.60 / km', fuelSurcharge: '14.5%', status: 'Active', effectiveDate: '01 Jan 2025' },
];

const initialVehiclePricing = [
  { id: 1, vehicleType: 'B-Double Combination', capacity: '34 Pallets / 44T', hourlyRate: '$185.00 / hr', perKmRate: '$3.20 / km', minHours: '4 Hrs', status: 'Active' },
  { id: 2, vehicleType: 'Single Semi-Trailer (45ft)', capacity: '22 Pallets / 24T', hourlyRate: '$145.00 / hr', perKmRate: '$2.65 / km', minHours: '4 Hrs', status: 'Active' },
  { id: 3, vehicleType: 'Rigid Truck (14 Pallet)', capacity: '14 Pallets / 12T', hourlyRate: '$115.00 / hr', perKmRate: '$2.10 / km', minHours: '3 Hrs', status: 'Active' },
  { id: 4, vehicleType: 'Hi-Cube Van / Courier', capacity: '4 Pallets / 2T', hourlyRate: '$75.00 / hr', perKmRate: '$1.45 / km', minHours: '2 Hrs', status: 'Active' },
];

const initialCustomerRateCards = [
  { id: 1, customerName: 'Acme Logistics Solutions', accountCode: 'CUST-001', tier: 'Tier 1 - Platinum', discount: '12% Off Base', contractsCount: 4, expiry: '31 Dec 2025', status: 'Active' },
  { id: 2, customerName: 'Global Freight Carriers', accountCode: 'CUST-002', tier: 'Tier 2 - Gold', discount: '8% Off Base', contractsCount: 2, expiry: '30 Nov 2025', status: 'Active' },
  { id: 3, customerName: 'Pacific Retail Supply', accountCode: 'CUST-003', tier: 'Standard', discount: 'Custom Matrix', contractsCount: 1, expiry: '15 Oct 2025', status: 'Review Due' },
];

export default function StandalonePricing() {
  const [activeTab, setActiveTab] = useState('Lane Pricing');
  const [search, setSearch] = useState('');
  const [lanePricing, setLanePricing] = useState(initialLanePricing);
  const [vehiclePricing, setVehiclePricing] = useState(initialVehiclePricing);
  const [customerRateCards, setCustomerRateCards] = useState(initialCustomerRateCards);
  const [fuelLevy, setFuelLevy] = useState('14.50%');

  // Modals & Notifications
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State for New Lane Pricing Rule
  const [newRule, setNewRule] = useState({
    origin: '',
    destination: '',
    minCharge: '',
    baseRate: '',
    perKmRate: '',
    fuelSurcharge: '14.5%'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddPricingRule = (e) => {
    e.preventDefault();
    if (!newRule.origin || !newRule.destination || !newRule.baseRate) {
      alert('Please fill in Origin, Destination, and Base Rate.');
      return;
    }
    const item = {
      id: Date.now(),
      origin: newRule.origin,
      destination: newRule.destination,
      minCharge: newRule.minCharge ? `$${newRule.minCharge}` : '$400.00',
      baseRate: `$${newRule.baseRate}`,
      perKmRate: newRule.perKmRate ? `$${newRule.perKmRate} / km` : '$2.50 / km',
      fuelSurcharge: newRule.fuelSurcharge || '14.5%',
      status: 'Active',
      effectiveDate: 'Today'
    };
    setLanePricing([item, ...lanePricing]);
    setNewRule({ origin: '', destination: '', minCharge: '', baseRate: '', perKmRate: '', fuelSurcharge: '14.5%' });
    setShowAddModal(false);
    showToast('New Lane Pricing Rule added successfully!');
  };

  const handleDuplicateLane = (lane) => {
    const dup = {
      ...lane,
      id: Date.now(),
      origin: `${lane.origin} (Copy)`,
    };
    setLanePricing([dup, ...lanePricing]);
    showToast(`Duplicated route ${lane.origin} -> ${lane.destination}`);
  };

  const handleDeleteLane = (id) => {
    if (window.confirm('Are you sure you want to delete this pricing rule?')) {
      setLanePricing(lanePricing.filter(l => l.id !== id));
      showToast('Pricing rule removed');
    }
  };

  const handleExportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Origin,Destination,Min Charge,Base Rate,Per KM Rate,Fuel Surcharge,Status"]
      .concat(lanePricing.map(e => `"${e.origin}","${e.destination}","${e.minCharge}","${e.baseRate}","${e.perKmRate}","${e.fuelSurcharge}","${e.status}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Master_Pricing_Matrix_${activeTab.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Master Rate Sheet exported to CSV successfully!');
  };

  const filteredLanes = lanePricing.filter(l => 
    l.origin.toLowerCase().includes(search.toLowerCase()) || 
    l.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-3 sm:p-6 lg:p-8 font-sans pb-24 text-slate-900 overflow-x-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Breadcrumbs & Responsive Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1 flex-wrap">
            <span>ADMIN PORTAL</span>
            <ChevronRight size={12} className="shrink-0" />
            <span className="text-slate-900 font-bold">Pricing & Rate Cards</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5 flex-wrap">
            <DollarSign className="text-emerald-600 shrink-0" size={26} />
            <span>Master Pricing & Rate Matrix</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed">
            Manage company-wide rate cards, lane pricing schedules, vehicle-type rates, fuel surcharges, and customer contract pricing.
          </p>
        </div>

        {/* Action Buttons - Single Line Layout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-nowrap overflow-x-auto">
          <button 
            onClick={() => setShowImportModal(true)} 
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-xs hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Upload size={14} className="shrink-0" /> 
            <span>Import Rate Sheet</span>
          </button>
          <button 
            onClick={handleExportExcel} 
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-xs hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download size={14} className="shrink-0" /> 
            <span>Export Excel</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus size={16} className="shrink-0" /> 
            <span>Add Pricing Rule</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Freight Lanes</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0"><MapPin size={16} /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">{lanePricing.length} Lanes</p>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1"><TrendingUp size={12}/> Updated today</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Vehicle Type Matrix</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0"><Truck size={16} /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">{vehiclePricing.length} Classes</p>
          <span className="text-[10px] font-bold text-slate-500 mt-1">Standard & Heavy Haul</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Fuel Surcharge Rate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0"><TrendingUp size={16} /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">{fuelLevy}</p>
          <span className="text-[10px] font-bold text-amber-600 mt-1">National Fuel Index</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Customer Rate Cards</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0"><FileText size={16} /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">{customerRateCards.length} Accounts</p>
          <span className="text-[10px] font-bold text-emerald-600 mt-1">100% Contracted Rates</span>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden mb-6">
        
        {/* Horizontal Scrollable Tabs */}
        <div className="flex border-b border-slate-100 px-4 sm:px-6 gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap no-scrollbar">
          {['Lane Pricing', 'Vehicle Type Rates', 'Customer Special Rates', 'Fuel Surcharge Matrix'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 sm:py-4 text-xs font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === tab ? 'text-emerald-600 border-b-2 border-emerald-600 font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 sm:p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end text-xs text-slate-500 font-bold">
            <span>Showing {filteredLanes.length} items</span>
          </div>
        </div>

        {/* Tab 1: Lane Pricing - Fully Responsive Table */}
        {activeTab === 'Lane Pricing' && (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[720px] text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Origin Route</th>
                  <th className="py-3.5 px-4 sm:px-6">Destination</th>
                  <th className="py-3.5 px-4 sm:px-6">Min Charge</th>
                  <th className="py-3.5 px-4 sm:px-6">Base Linehaul Rate</th>
                  <th className="py-3.5 px-4 sm:px-6">Per KM Rate</th>
                  <th className="py-3.5 px-4 sm:px-6">Fuel Levy</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {filteredLanes.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-black text-slate-900 flex items-center gap-2">
                      <MapPin size={14} className="text-emerald-600 shrink-0" /> 
                      <span>{row.origin}</span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-bold">{row.destination}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-700">{row.minCharge}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono font-black text-emerald-700">{row.baseRate}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono text-slate-600">{row.perKmRate}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono text-amber-700 font-bold">{row.fuelSurcharge}</td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">{row.status}</span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleDuplicateLane(row)} 
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer" 
                          title="Duplicate Route"
                        >
                          <Copy size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteLane(row.id)} 
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer" 
                          title="Delete Rule"
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
        )}

        {/* Tab 2: Vehicle Type Rates */}
        {activeTab === 'Vehicle Type Rates' && (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[650px] text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Vehicle Type Class</th>
                  <th className="py-3.5 px-4 sm:px-6">Payload / Capacity</th>
                  <th className="py-3.5 px-4 sm:px-6">Hourly Rate</th>
                  <th className="py-3.5 px-4 sm:px-6">Per KM Rate</th>
                  <th className="py-3.5 px-4 sm:px-6">Min Hours</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {vehiclePricing.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-black text-slate-900 flex items-center gap-2">
                      <Truck size={14} className="text-purple-600 shrink-0" /> 
                      <span>{row.vehicleType}</span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-600">{row.capacity}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono font-black text-emerald-700">{row.hourlyRate}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-700">{row.perKmRate}</td>
                    <td className="py-4 px-4 sm:px-6 font-semibold">{row.minHours}</td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">{row.status}</span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button onClick={() => showToast(`Edit rates for ${row.vehicleType}`)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer">
                        <Edit3 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Customer Special Rates */}
        {activeTab === 'Customer Special Rates' && (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[650px] text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Customer Account</th>
                  <th className="py-3.5 px-4 sm:px-6">Account Code</th>
                  <th className="py-3.5 px-4 sm:px-6">Contract Tier</th>
                  <th className="py-3.5 px-4 sm:px-6">Special Discount</th>
                  <th className="py-3.5 px-4 sm:px-6">Contract Expiry</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {customerRateCards.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-black text-slate-900">{row.customerName}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono text-slate-500">{row.accountCode}</td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-indigo-600">{row.tier}</td>
                    <td className="py-4 px-4 sm:px-6 font-mono font-black text-emerald-700">{row.discount}</td>
                    <td className="py-4 px-4 sm:px-6">{row.expiry}</td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        row.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>{row.status}</span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button onClick={() => showToast(`View rate card for ${row.customerName}`)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Fuel Surcharge */}
        {activeTab === 'Fuel Surcharge Matrix' && (
          <div className="p-4 sm:p-6">
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 sm:p-5 mb-6">
              <h3 className="text-xs sm:text-sm font-black text-amber-900 mb-1 flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" /> 
                <span>Fuel Levy Calculation Formula</span>
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Current National Diesel Baseline: <strong>$1.45 / Litre</strong>. Every 5c increase above baseline adjusts fuel levy by <strong>+0.5%</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
                <h4 className="text-xs font-black uppercase text-slate-800 mb-4">Update Fuel Levy Rate</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Effective Date</label>
                    <input type="date" defaultValue="2025-07-30" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Fuel Surcharge Percentage (%)</label>
                    <input 
                      type="text" 
                      value={fuelLevy} 
                      onChange={e => setFuelLevy(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-extrabold text-slate-900 mt-1" 
                    />
                  </div>
                  <button 
                    onClick={() => showToast(`Global Fuel Levy updated to ${fuelLevy}`)} 
                    className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 cursor-pointer transition-colors"
                  >
                    Apply Global Fuel Surcharge Update
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
                <h4 className="text-xs font-black uppercase text-slate-800 mb-4">Recent Levy Audit Log</h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">Levy set to {fuelLevy}</p>
                      <p className="text-[10px] text-slate-400">By Sarah Mitchell • Today</p>
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">Levy set to 13.80%</p>
                      <p className="text-[10px] text-slate-400">By Sarah Mitchell • 01 Jun 2025</p>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">Archived</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal - Fully Mobile Responsive */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Add New Lane Pricing Rule</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddPricingRule} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600">Origin Location *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sydney, NSW" 
                  value={newRule.origin}
                  onChange={e => setNewRule({ ...newRule, origin: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" 
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-600">Destination Location *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Melbourne, VIC" 
                  value={newRule.destination}
                  onChange={e => setNewRule({ ...newRule, destination: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600">Base Linehaul ($) *</label>
                  <input 
                    type="number" 
                    placeholder="1850" 
                    value={newRule.baseRate}
                    onChange={e => setNewRule({ ...newRule, baseRate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" 
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600">Min Charge ($)</label>
                  <input 
                    type="number" 
                    placeholder="450" 
                    value={newRule.minCharge}
                    onChange={e => setNewRule({ ...newRule, minCharge: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" 
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-600">Per KM Rate ($)</label>
                <input 
                  type="text" 
                  placeholder="2.40" 
                  value={newRule.perKmRate}
                  onChange={e => setNewRule({ ...newRule, perKmRate: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-xs hover:bg-emerald-700 cursor-pointer">
                  Save Pricing Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Import Master Rate Sheet</h3>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <p className="text-slate-500 font-medium">Upload a CSV or Excel file containing route origins, destinations, and base linehaul rates.</p>
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center cursor-pointer hover:border-emerald-500 transition-colors">
                <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                <p className="font-bold text-slate-700">Click to choose file or drag & drop</p>
                <p className="text-[10px] text-slate-400 mt-1">Supports .csv, .xlsx (max 10MB)</p>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={() => {
                    setShowImportModal(false);
                    showToast('Rate sheet imported successfully! 5 lanes updated.');
                  }}
                  id="csv-file-input"
                />
                <label htmlFor="csv-file-input" className="mt-3 inline-block px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold cursor-pointer">Choose File</label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
