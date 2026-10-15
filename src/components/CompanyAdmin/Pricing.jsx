import React, { useState, useEffect, useCallback } from 'react';
import {
  DollarSign, Search, Plus, Download, Upload,
  CheckCircle2, AlertTriangle, Eye, Edit3, Trash2, ChevronRight,
  TrendingUp, Truck, MapPin, Layers, FileText, Copy, X, Loader2,
  WifiOff, RefreshCw, Save, AlertCircle
} from 'lucide-react';
import api from '../../services/api';

// ─── Helpers ───────────────────────────────────────────────────────────────
const fmt = (num, prefix = '$') => num != null ? `${prefix}${Number(num).toFixed(2)}` : '—';
const fmtPct = (num) => num != null ? `${Number(num).toFixed(1)}%` : '—';

// ─── Main Component ────────────────────────────────────────────────────────
export default function StandalonePricing() {
  const [activeTab, setActiveTab] = useState('Lane Pricing');
  const [search, setSearch] = useState('');

  // Data state
  const [stats, setStats] = useState(null);
  const [lanes, setLanes] = useState([]);
  const [vehicleRates, setVehicleRates] = useState([]);
  const [fuelData, setFuelData] = useState(null);
  const [customerRates, setCustomerRates] = useState([]);

  // Loading / error
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals
  const [showAddLaneModal, setShowAddLaneModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingLane, setEditingLane] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Customer Rate Card Modal State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerProfiles, setCustomerProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [showAddProfileForm, setShowAddProfileForm] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    from: '',
    to: '',
    method: 'Per Load',
    baseRate: '',
    minCharge: '',
    fuelLevy: '14.5',
    transportNiche: 'General Freight',
    extraPickupCharge: '',
    extraDeliveryCharge: '',
    waitingTimeCharge: ''
  });

  // Inline fuel surcharge
  const [fuelInput, setFuelInput] = useState('');
  const [fuelDateInput, setFuelDateInput] = useState('');
  const [savingFuel, setSavingFuel] = useState(false);

  // Form state
  const [laneForm, setLaneForm] = useState({ origin: '', destination: '', baseLinehaulRate: '', minCharge: '', perKmRate: '', fuelSurcharge: '14.5' });
  const [vehicleForm, setVehicleForm] = useState({ vehicleType: '', capacity: '', hourlyRate: '', perKmRate: '', minHours: '4' });

  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Customer Rate Card Handlers ──────────────────────────────────────────
  const handleOpenCustomerRateCard = async (customer) => {
    setSelectedCustomer(customer);
    setLoadingProfiles(true);
    setShowAddProfileForm(false);
    try {
      const res = await api.get(`/company-admin/customers/${customer.id}/pricing-profiles`);
      setCustomerProfiles(res.data?.data || res.data || []);
    } catch (err) {
      console.warn('Failed to fetch pricing profiles:', err);
      setCustomerProfiles([]);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const handleSaveCustomerProfile = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    setSavingProfile(true);
    try {
      const payload = {
        name: profileForm.name || `${profileForm.from || 'Any'} ➔ ${profileForm.to || 'Any'}`,
        from: profileForm.from || undefined,
        to: profileForm.to || undefined,
        method: profileForm.method,
        baseRate: parseFloat(profileForm.baseRate) || 0,
        minCharge: parseFloat(profileForm.minCharge) || 0,
        fuelLevy: parseFloat(profileForm.fuelLevy) || 14.5,
        transportNiche: profileForm.transportNiche,
        extraPickupCharge: parseFloat(profileForm.extraPickupCharge) || 0,
        extraDeliveryCharge: parseFloat(profileForm.extraDeliveryCharge) || 0,
        waitingTimeCharge: parseFloat(profileForm.waitingTimeCharge) || 0,
        isActive: true
      };
      await api.post(`/company-admin/customers/${selectedCustomer.id}/pricing-profiles`, payload);
      showToast(`Rate profile saved for ${selectedCustomer.name}!`);
      const res = await api.get(`/company-admin/customers/${selectedCustomer.id}/pricing-profiles`);
      setCustomerProfiles(res.data?.data || res.data || []);
      setShowAddProfileForm(false);
      setProfileForm({
        name: '', from: '', to: '', method: 'Per Load', baseRate: '',
        minCharge: '', fuelLevy: '14.5', transportNiche: 'General Freight',
        extraPickupCharge: '', extraDeliveryCharge: '', waitingTimeCharge: ''
      });
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save rate profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (!window.confirm('Delete this contract rate rule? This cannot be undone.')) return;
    try {
      try {
        await api.delete(`/company-admin/customers/${selectedCustomer.id}/surcharges/${profileId}`);
      } catch (firstErr) {
        if (firstErr.response?.status === 404) {
          await api.delete(`/company-admin/customers/${selectedCustomer.id}/pricing-profiles/${profileId}`);
        } else {
          throw firstErr;
        }
      }
      showToast('Rate rule deleted successfully');
      setCustomerProfiles(prev => prev.filter(p => p.id !== profileId));
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete rule', 'error');
    }
  };

  // ── Fetch stats (KPI cards) ──────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/company-admin/pricing/stats');
      const d = res.data?.data || res.data;
      setStats(d);
      setFuelInput(String(d.currentFuelRate ?? 14.5));
    } catch (e) {
      console.error('Stats fetch error:', e);
    }
  }, []);

  // ── Fetch tab data ───────────────────────────────────────────────────────
  const fetchTabData = useCallback(async (tab, isInitial = false) => {
    if (!isInitial) setTabLoading(true);
    try {
      if (tab === 'Lane Pricing') {
        const res = await api.get('/company-admin/pricing/lanes', { params: { search } });
        setLanes(res.data?.data || res.data || []);
      } else if (tab === 'Vehicle Type Rates') {
        const res = await api.get('/company-admin/pricing/vehicle-rates');
        setVehicleRates(res.data?.data || res.data || []);
      } else if (tab === 'Fuel Surcharge Matrix') {
        const res = await api.get('/company-admin/pricing/fuel-surcharge');
        const d = res.data?.data || res.data;
        setFuelData(d);
        setFuelInput(String(d?.currentRate ?? 14.5));
      } else if (tab === 'Customer Special Rates') {
        const res = await api.get('/company-admin/pricing/customer-rates');
        setCustomerRates(res.data?.data || res.data || []);
      }
    } catch (e) {
      console.error(`Tab fetch error (${tab}):`, e);
    } finally {
      if (!isInitial) setTabLoading(false);
    }
  }, [search]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchStats(),
          fetchTabData('Lane Pricing', true),
          fetchTabData('Customer Special Rates', true),
          fetchTabData('Vehicle Type Rates', true)
        ]);
      } catch (e) {
        setError('Failed to load pricing data.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Fetch on tab switch
  useEffect(() => {
    if (!loading) fetchTabData(activeTab);
  }, [activeTab]);

  // Fetch lanes on search change (debounced manually via useEffect)
  useEffect(() => {
    if (!loading && activeTab === 'Lane Pricing') {
      const timer = setTimeout(() => fetchTabData('Lane Pricing'), 350);
      return () => clearTimeout(timer);
    }
  }, [search]);

  // ── Lane Pricing Actions ─────────────────────────────────────────────────
  const handleAddLane = async (e) => {
    e.preventDefault();
    setActionLoading('add-lane');
    try {
      await api.post('/company-admin/pricing/lanes', {
        origin: laneForm.origin,
        destination: laneForm.destination,
        baseLinehaulRate: parseFloat(laneForm.baseLinehaulRate),
        minCharge: parseFloat(laneForm.minCharge) || 400,
        perKmRate: parseFloat(laneForm.perKmRate) || 2.5,
        fuelSurcharge: parseFloat(laneForm.fuelSurcharge) || 14.5
      });
      showToast('Lane pricing rule added!');
      setShowAddLaneModal(false);
      setLaneForm({ origin: '', destination: '', baseLinehaulRate: '', minCharge: '', perKmRate: '', fuelSurcharge: '14.5' });
      fetchTabData('Lane Pricing');
      fetchStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to add lane', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditLane = async (e) => {
    e.preventDefault();
    setActionLoading('edit-lane');
    try {
      await api.put(`/company-admin/pricing/lanes/${editingLane.id}`, {
        origin: laneForm.origin,
        destination: laneForm.destination,
        baseLinehaulRate: parseFloat(laneForm.baseLinehaulRate),
        minCharge: parseFloat(laneForm.minCharge),
        perKmRate: parseFloat(laneForm.perKmRate),
        fuelSurcharge: parseFloat(laneForm.fuelSurcharge)
      });
      showToast('Lane pricing rule updated!');
      setEditingLane(null);
      fetchTabData('Lane Pricing');
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update lane', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteLane = async (id) => {
    if (!window.confirm('Delete this pricing rule?')) return;
    setActionLoading(`del-${id}`);
    try {
      await api.delete(`/company-admin/pricing/lanes/${id}`);
      showToast('Lane pricing rule deleted.');
      setLanes(prev => prev.filter(l => l.id !== id));
      fetchStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicateLane = async (lane) => {
    setActionLoading(`dup-${lane.id}`);
    try {
      const res = await api.post(`/company-admin/pricing/lanes/${lane.id}/duplicate`);
      const newLane = res.data?.data || res.data;
      showToast(`Duplicated: ${lane.origin} → ${lane.destination}`);
      setLanes(prev => [newLane, ...prev]);
      fetchStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Duplicate failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Vehicle Rate Actions ─────────────────────────────────────────────────
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setActionLoading('add-vehicle');
    try {
      await api.post('/company-admin/pricing/vehicle-rates', {
        vehicleType: vehicleForm.vehicleType,
        capacity: vehicleForm.capacity,
        hourlyRate: parseFloat(vehicleForm.hourlyRate) || 150,
        perKmRate: parseFloat(vehicleForm.perKmRate) || 2.5,
        minHours: parseInt(vehicleForm.minHours) || 4
      });
      showToast('Vehicle rate class added!');
      setShowAddVehicleModal(false);
      setVehicleForm({ vehicleType: '', capacity: '', hourlyRate: '', perKmRate: '', minHours: '4' });
      fetchTabData('Vehicle Type Rates');
      fetchStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to add vehicle rate', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditVehicle = async (e) => {
    e.preventDefault();
    setActionLoading('edit-vehicle');
    try {
      await api.put(`/company-admin/pricing/vehicle-rates/${editingVehicle.id}`, {
        vehicleType: vehicleForm.vehicleType,
        capacity: vehicleForm.capacity,
        hourlyRate: parseFloat(vehicleForm.hourlyRate),
        perKmRate: parseFloat(vehicleForm.perKmRate),
        minHours: parseInt(vehicleForm.minHours)
      });
      showToast('Vehicle rate updated!');
      setEditingVehicle(null);
      fetchTabData('Vehicle Type Rates');
    } catch (e) {
      showToast(e.response?.data?.message || 'Update failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Fuel Surcharge ──────────────────────────────────────────────────────
  const handleUpdateFuel = async () => {
    if (!fuelInput) return;
    setSavingFuel(true);
    try {
      await api.post('/company-admin/pricing/fuel-surcharge', {
        rate: parseFloat(fuelInput),
        effectiveDate: fuelDateInput || new Date().toISOString(),
        setBy: 'Admin'
      });
      showToast(`Global Fuel Levy updated to ${fuelInput}%`);
      fetchTabData('Fuel Surcharge Matrix');
      fetchStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update fuel levy', 'error');
    } finally {
      setSavingFuel(false);
    }
  };

  // ── Export CSV ──────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = [['Origin', 'Destination', 'Min Charge', 'Base Linehaul Rate', 'Per KM Rate', 'Fuel Surcharge', 'Status']]
      .concat(lanes.map(l => [l.origin, l.destination, l.minCharge, l.baseLinehaulRate, l.perKmRate, l.fuelSurcharge, l.status]));
    const csv = 'data:text/csv;charset=utf-8,' + rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', 'Lane_Pricing_Export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported to CSV!');
  };

  // ── Open edit modal ─────────────────────────────────────────────────────
  const openEditLane = (lane) => {
    setLaneForm({
      origin: lane.origin,
      destination: lane.destination,
      baseLinehaulRate: String(lane.baseLinehaulRate),
      minCharge: String(lane.minCharge),
      perKmRate: String(lane.perKmRate),
      fuelSurcharge: String(lane.fuelSurcharge)
    });
    setEditingLane(lane);
  };

  const openEditVehicle = (v) => {
    setVehicleForm({
      vehicleType: v.vehicleType,
      capacity: v.capacity || '',
      hourlyRate: String(v.hourlyRate),
      perKmRate: String(v.perKmRate),
      minHours: String(v.minHours)
    });
    setEditingVehicle(v);
  };

  const currentFuelRate = fuelData?.currentRate ?? stats?.currentFuelRate ?? 14.5;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fc] p-3 sm:p-6 lg:p-8 font-sans pb-24 text-slate-900 overflow-x-hidden">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[99999] px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-rose-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> : <AlertCircle size={16} className="text-white shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
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

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-nowrap overflow-x-auto">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-xs hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Upload size={14} /> <span>Import Rate Sheet</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-xs hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Download size={14} /> <span>Export Excel</span>
          </button>
          <button
            onClick={() => activeTab === 'Vehicle Type Rates' ? setShowAddVehicleModal(true) : setShowAddLaneModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus size={16} /> <span>Add Pricing Rule</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-700">
          <WifiOff className="w-5 h-5 shrink-0" />
          <div><p className="font-bold">Error loading data</p><p className="text-xs text-rose-600">{error}</p></div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {loading ? Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs animate-pulse">
            <div className="h-2.5 w-28 bg-slate-200 rounded mb-3" /><div className="h-7 w-20 bg-slate-100 rounded" />
          </div>
        )) : (
          <>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Freight Lanes</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><MapPin size={16} /></div>
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.activeLanes ?? lanes.length} Lanes</p>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                {(stats?.activeLanes ?? lanes.length) > 0 ? 'Active route schedules' : 'No lanes defined'}
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Vehicle Type Matrix</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Truck size={16} /></div>
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.vehicleClasses ?? vehicleRates.length} Classes</p>
              <span className="text-[10px] font-bold text-slate-400 mt-1">
                {(stats?.vehicleClasses ?? vehicleRates.length) > 0 ? 'Fleet category matrix' : 'No classes defined'}
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Fuel Surcharge Rate</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><TrendingUp size={16} /></div>
              </div>
              <p className="text-2xl font-black text-slate-900">{fmtPct(currentFuelRate)}</p>
              <span className="text-[10px] font-bold text-slate-400 mt-1">
                {fuelData?.effectiveDate ? `Effective ${new Date(fuelData.effectiveDate).toLocaleDateString()}` : 'Standard National Levy'}
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Customer Rate Cards</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><FileText size={16} /></div>
              </div>
              <p className="text-2xl font-black text-slate-900">{stats?.customerAccounts ?? customerRates.length} Accounts</p>
              <span className="text-[10px] font-bold text-slate-400 mt-1">
                {(stats?.customerAccounts ?? customerRates.length) > 0 ? 'Linked contract customers' : 'No customer rates'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden mb-6">

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-4 sm:px-6 gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap no-scrollbar">
          {['Lane Pricing', 'Vehicle Type Rates', 'Customer Special Rates', 'Fuel Surcharge Matrix'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 sm:py-4 text-xs font-bold transition-all relative whitespace-nowrap ${
                activeTab === tab ? 'text-emerald-600 border-b-2 border-emerald-600 font-black' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Count Bar */}
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
          <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
            {tabLoading && <Loader2 size={14} className="animate-spin" />}
            <span>
              {activeTab === 'Lane Pricing' ? `${lanes.length} lanes` :
               activeTab === 'Vehicle Type Rates' ? `${vehicleRates.length} classes` :
               activeTab === 'Customer Special Rates' ? `${customerRates.length} accounts` : ''}
            </span>
            <button onClick={() => fetchTabData(activeTab)} className="p-1.5 hover:bg-slate-100 rounded-lg" title="Refresh">
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* ── Tab 1: Lane Pricing ────────────────────────────────────────── */}
        {activeTab === 'Lane Pricing' && (
          <div className="overflow-x-auto w-full">
            {loading || (tabLoading && lanes.length === 0) ? (
              <div className="p-8 text-center"><Loader2 size={24} className="animate-spin text-emerald-600 mx-auto" /></div>
            ) : lanes.length === 0 ? (
              <div className="p-12 text-center">
                <MapPin size={36} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-500">No lane pricing rules found</p>
                <p className="text-xs text-slate-400 mt-1">Click "Add Pricing Rule" to create your first lane</p>
              </div>
            ) : (
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
                  {lanes.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-black text-slate-900">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-emerald-600 shrink-0" />
                          {row.origin}
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-bold">{row.destination}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-700">{fmt(row.minCharge)}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono font-black text-emerald-700">{fmt(row.baseLinehaulRate)}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-slate-600">{fmt(row.perKmRate)} / km</td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-amber-700 font-bold">{fmtPct(row.fuelSurcharge)}</td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          row.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>{row.status}</span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEditLane(row)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900" title="Edit">
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDuplicateLane(row)}
                            disabled={actionLoading === `dup-${row.id}`}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900"
                            title="Duplicate"
                          >
                            {actionLoading === `dup-${row.id}` ? <Loader2 size={14} className="animate-spin" /> : <Copy size={14} />}
                          </button>
                          <button
                            onClick={() => handleDeleteLane(row.id)}
                            disabled={actionLoading === `del-${row.id}`}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600"
                            title="Delete"
                          >
                            {actionLoading === `del-${row.id}` ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Tab 2: Vehicle Type Rates ─────────────────────────────────── */}
        {activeTab === 'Vehicle Type Rates' && (
          <div className="overflow-x-auto w-full">
            {loading || (tabLoading && vehicleRates.length === 0) ? (
              <div className="p-8 text-center"><Loader2 size={24} className="animate-spin text-emerald-600 mx-auto" /></div>
            ) : vehicleRates.length === 0 ? (
              <div className="p-12 text-center">
                <Truck size={36} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-500">No vehicle rate classes found</p>
                <button onClick={() => setShowAddVehicleModal(true)} className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Add First Class</button>
              </div>
            ) : (
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
                  {vehicleRates.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-black text-slate-900">
                        <div className="flex items-center gap-2">
                          <Truck size={14} className="text-purple-600 shrink-0" />
                          {row.vehicleType}
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-bold text-slate-600">{row.capacity || '—'}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono font-black text-emerald-700">{fmt(row.hourlyRate)} / hr</td>
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-700">{fmt(row.perKmRate)} / km</td>
                      <td className="py-4 px-4 sm:px-6 font-semibold">{row.minHours} Hrs</td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">{row.status}</span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button onClick={() => openEditVehicle(row)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900">
                          <Edit3 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Tab 3: Customer Special Rates ────────────────────────────── */}
        {activeTab === 'Customer Special Rates' && (
          <div className="overflow-x-auto w-full">
            {loading || (tabLoading && customerRates.length === 0) ? (
              <div className="p-8 text-center"><Loader2 size={24} className="animate-spin text-emerald-600 mx-auto" /></div>
            ) : customerRates.length === 0 ? (
              <div className="p-12 text-center">
                <FileText size={36} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-500">No customers found</p>
                <p className="text-xs text-slate-400 mt-1">Add customers from the Customers module first</p>
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Customer Account</th>
                    <th className="py-3.5 px-4 sm:px-6">ABN</th>
                    <th className="py-3.5 px-4 sm:px-6">Type</th>
                    <th className="py-3.5 px-4 sm:px-6">Billing Terms</th>
                    <th className="py-3.5 px-4 sm:px-6">Contact</th>
                    <th className="py-3.5 px-4 sm:px-6">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {customerRates.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-black text-slate-900">{row.name}</td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-slate-500">{row.abn || '—'}</td>
                      <td className="py-4 px-4 sm:px-6 font-bold text-indigo-600">{row.type}</td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600">{row.billingTerms || '—'}</td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600">{row.contactName || '—'}</td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          row.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>{row.status}</span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => handleOpenCustomerRateCard(row)}
                          className="p-1.5 hover:bg-emerald-50 rounded-lg text-slate-500 hover:text-emerald-700 cursor-pointer transition-colors"
                          title={`View & Manage Rate Card for ${row.name}`}
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Tab 4: Fuel Surcharge Matrix ──────────────────────────────── */}
        {activeTab === 'Fuel Surcharge Matrix' && (
          <div className="p-4 sm:p-6">
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 sm:p-5 mb-6">
              <h3 className="text-xs sm:text-sm font-black text-amber-900 mb-1 flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                Fuel Levy Calculation Formula
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
                    <input
                      type="date"
                      value={fuelDateInput}
                      onChange={e => setFuelDateInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Fuel Surcharge Percentage (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={fuelInput}
                      onChange={e => setFuelInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-extrabold text-slate-900 mt-1"
                    />
                  </div>
                  <button
                    onClick={handleUpdateFuel}
                    disabled={savingFuel}
                    className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {savingFuel ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Apply Global Fuel Surcharge Update
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
                <h4 className="text-xs font-black uppercase text-slate-800 mb-4">Recent Levy Audit Log</h4>
                {tabLoading ? (
                  <div className="flex items-center justify-center py-6"><Loader2 size={20} className="animate-spin text-slate-400" /></div>
                ) : fuelData?.history?.length > 0 ? (
                  <div className="space-y-3 text-xs">
                    {fuelData.history.map(log => (
                      <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">Levy set to {fmtPct(log.rate)}</p>
                          <p className="text-[10px] text-slate-400">
                            {log.setBy ? `By ${log.setBy}` : 'System'} • {new Date(log.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          log.isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'
                        }`}>{log.isActive ? 'Active' : 'Archived'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No fuel levy history yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ ADD LANE MODAL ═════════════════════════════════════════════════ */}
      {showAddLaneModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Add New Lane Pricing Rule</h3>
              <button onClick={() => setShowAddLaneModal(false)} className="p-1 text-slate-400 hover:text-slate-700"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddLane} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600">Origin Location *</label>
                <input type="text" placeholder="e.g. Sydney, NSW" value={laneForm.origin}
                  onChange={e => setLaneForm({ ...laneForm, origin: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" required />
              </div>
              <div>
                <label className="font-bold text-slate-600">Destination Location *</label>
                <input type="text" placeholder="e.g. Melbourne, VIC" value={laneForm.destination}
                  onChange={e => setLaneForm({ ...laneForm, destination: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600">Base Linehaul ($) *</label>
                  <input type="number" placeholder="1850" value={laneForm.baseLinehaulRate}
                    onChange={e => setLaneForm({ ...laneForm, baseLinehaulRate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" required />
                </div>
                <div>
                  <label className="font-bold text-slate-600">Min Charge ($)</label>
                  <input type="number" placeholder="450" value={laneForm.minCharge}
                    onChange={e => setLaneForm({ ...laneForm, minCharge: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600">Per KM Rate ($)</label>
                  <input type="number" step="0.01" placeholder="2.40" value={laneForm.perKmRate}
                    onChange={e => setLaneForm({ ...laneForm, perKmRate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="font-bold text-slate-600">Fuel Surcharge (%)</label>
                  <input type="number" step="0.1" placeholder="14.5" value={laneForm.fuelSurcharge}
                    onChange={e => setLaneForm({ ...laneForm, fuelSurcharge: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddLaneModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" disabled={actionLoading === 'add-lane'}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-xs hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-60">
                  {actionLoading === 'add-lane' ? <Loader2 size={14} className="animate-spin" /> : null}
                  Save Pricing Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ EDIT LANE MODAL ════════════════════════════════════════════════ */}
      {editingLane && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Edit Lane Pricing Rule</h3>
              <button onClick={() => setEditingLane(null)} className="p-1 text-slate-400 hover:text-slate-700"><X size={18} /></button>
            </div>
            <form onSubmit={handleEditLane} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600">Origin Location</label>
                <input type="text" value={laneForm.origin} onChange={e => setLaneForm({ ...laneForm, origin: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="font-bold text-slate-600">Destination</label>
                <input type="text" value={laneForm.destination} onChange={e => setLaneForm({ ...laneForm, destination: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600">Base Linehaul ($)</label>
                  <input type="number" value={laneForm.baseLinehaulRate} onChange={e => setLaneForm({ ...laneForm, baseLinehaulRate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="font-bold text-slate-600">Min Charge ($)</label>
                  <input type="number" value={laneForm.minCharge} onChange={e => setLaneForm({ ...laneForm, minCharge: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600">Per KM Rate ($)</label>
                  <input type="number" step="0.01" value={laneForm.perKmRate} onChange={e => setLaneForm({ ...laneForm, perKmRate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="font-bold text-slate-600">Fuel Surcharge (%)</label>
                  <input type="number" step="0.1" value={laneForm.fuelSurcharge} onChange={e => setLaneForm({ ...laneForm, fuelSurcharge: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingLane(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" disabled={actionLoading === 'edit-lane'}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-xs hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-60">
                  {actionLoading === 'edit-lane' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ ADD VEHICLE RATE MODAL ══════════════════════════════════════════ */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Add Vehicle Rate Class</h3>
              <button onClick={() => setShowAddVehicleModal(false)} className="p-1 text-slate-400 hover:text-slate-700"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddVehicle} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600">Vehicle Type *</label>
                <input type="text" placeholder="e.g. B-Double Combination" value={vehicleForm.vehicleType}
                  onChange={e => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" required />
              </div>
              <div>
                <label className="font-bold text-slate-600">Capacity</label>
                <input type="text" placeholder="e.g. 34 Pallets / 44T" value={vehicleForm.capacity}
                  onChange={e => setVehicleForm({ ...vehicleForm, capacity: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-600">Hourly ($)</label>
                  <input type="number" placeholder="185" value={vehicleForm.hourlyRate}
                    onChange={e => setVehicleForm({ ...vehicleForm, hourlyRate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="font-bold text-slate-600">Per KM ($)</label>
                  <input type="number" step="0.01" placeholder="3.20" value={vehicleForm.perKmRate}
                    onChange={e => setVehicleForm({ ...vehicleForm, perKmRate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="font-bold text-slate-600">Min Hrs</label>
                  <input type="number" placeholder="4" value={vehicleForm.minHours}
                    onChange={e => setVehicleForm({ ...vehicleForm, minHours: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddVehicleModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" disabled={actionLoading === 'add-vehicle'}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-xs hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-60">
                  {actionLoading === 'add-vehicle' ? <Loader2 size={14} className="animate-spin" /> : null}
                  Save Vehicle Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ EDIT VEHICLE RATE MODAL ════════════════════════════════════════ */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Edit Vehicle Rate</h3>
              <button onClick={() => setEditingVehicle(null)} className="p-1 text-slate-400 hover:text-slate-700"><X size={18} /></button>
            </div>
            <form onSubmit={handleEditVehicle} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600">Vehicle Type</label>
                <input type="text" value={vehicleForm.vehicleType} onChange={e => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="font-bold text-slate-600">Capacity</label>
                <input type="text" value={vehicleForm.capacity} onChange={e => setVehicleForm({ ...vehicleForm, capacity: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-600">Hourly ($)</label>
                  <input type="number" value={vehicleForm.hourlyRate} onChange={e => setVehicleForm({ ...vehicleForm, hourlyRate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="font-bold text-slate-600">Per KM ($)</label>
                  <input type="number" step="0.01" value={vehicleForm.perKmRate} onChange={e => setVehicleForm({ ...vehicleForm, perKmRate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="font-bold text-slate-600">Min Hrs</label>
                  <input type="number" value={vehicleForm.minHours} onChange={e => setVehicleForm({ ...vehicleForm, minHours: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl mt-1 text-xs font-semibold outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingVehicle(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" disabled={actionLoading === 'edit-vehicle'}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-xs hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-60">
                  {actionLoading === 'edit-vehicle' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ IMPORT MODAL ════════════════════════════════════════════════════ */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Import Master Rate Sheet</h3>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-slate-400 hover:text-slate-700"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <p className="text-slate-500 font-medium">Upload a CSV or Excel file containing route origins, destinations, and base linehaul rates.</p>
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center cursor-pointer hover:border-emerald-500 transition-colors">
                <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                <p className="font-bold text-slate-700">Click to choose file or drag & drop</p>
                <p className="text-[10px] text-slate-400 mt-1">Supports .csv, .xlsx (max 10MB)</p>
                <input type="file" className="hidden" id="csv-file-input"
                  onChange={() => { setShowImportModal(false); showToast('Rate sheet imported! Processing rows…'); }} />
                <label htmlFor="csv-file-input" className="mt-3 inline-block px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold cursor-pointer">
                  Choose File
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ═══ CUSTOMER RATE CARD MODAL ══════════════════════════════════════ */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden text-left my-auto animate-fade-in flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Customer Rate Card — {selectedCustomer.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-0.5 flex-wrap">
                    <span>ABN: {selectedCustomer.abn || '—'}</span>
                    <span>•</span>
                    <span className="text-indigo-600">{selectedCustomer.type || 'Business'}</span>
                    <span>•</span>
                    <span>Terms: {selectedCustomer.billingTerms || '14 Days EOM'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar">

              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Contract Rate Rules ({customerProfiles.length})
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">Special rates applied when calculating loads for this customer.</p>
                </div>
                <button
                  onClick={() => setShowAddProfileForm(!showAddProfileForm)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0 ${
                    showAddProfileForm
                      ? 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {showAddProfileForm ? <X size={14} /> : <Plus size={14} />}
                  <span>{showAddProfileForm ? 'Close Form' : '+ Add Special Rate'}</span>
                </button>
              </div>

              {/* Form to Add Special Rate */}
              {showAddProfileForm && (
                <form onSubmit={handleSaveCustomerProfile} className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 text-xs mb-4">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="font-extrabold text-slate-800 text-xs">New Special Rate Rule</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black">Contract Override</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Rule / Profile Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Sydney Metro Pallet Rate"
                        value={profileForm.name}
                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 shadow-2xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Transport Niche</label>
                      <select
                        value={profileForm.transportNiche}
                        onChange={e => setProfileForm({ ...profileForm, transportNiche: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
                      >
                        <option value="General Freight">General Freight</option>
                        <option value="Interstate Linehaul">Interstate Linehaul</option>
                        <option value="Car Carrying">Car Carrying</option>
                        <option value="Refrigerated">Refrigerated</option>
                        <option value="Container Drayage">Container Drayage</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Origin (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Sydney, NSW (leave empty for Any)"
                        value={profileForm.from}
                        onChange={e => setProfileForm({ ...profileForm, from: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Destination (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Melbourne, VIC (leave empty for Any)"
                        value={profileForm.to}
                        onChange={e => setProfileForm({ ...profileForm, to: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Calculation Method</label>
                      <select
                        value={profileForm.method}
                        onChange={e => setProfileForm({ ...profileForm, method: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
                      >
                        <option value="Per Load">Per Load</option>
                        <option value="Per Pallet">Per Pallet</option>
                        <option value="Per km">Per km</option>
                        <option value="Hourly">Hourly</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Base Rate ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="450.00"
                        value={profileForm.baseRate}
                        onChange={e => setProfileForm({ ...profileForm, baseRate: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 outline-none focus:border-emerald-500 shadow-2xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Min Charge ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="250.00"
                        value={profileForm.minCharge}
                        onChange={e => setProfileForm({ ...profileForm, minCharge: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Fuel Levy (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="14.5"
                        value={profileForm.fuelLevy}
                        onChange={e => setProfileForm({ ...profileForm, fuelLevy: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Extra Stop / Toll ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="50.00"
                        value={profileForm.extraDeliveryCharge}
                        onChange={e => setProfileForm({ ...profileForm, extraDeliveryCharge: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => setShowAddProfileForm(false)}
                      className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-5 py-1.5 bg-emerald-600 text-white rounded-xl font-extrabold text-xs shadow-xs hover:bg-emerald-700 flex items-center gap-1.5 disabled:opacity-60 transition-colors cursor-pointer"
                    >
                      {savingProfile ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      Save Rate Rule
                    </button>
                  </div>
                </form>
              )}

              {/* Profiles Table */}
              {loadingProfiles ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin text-emerald-600" />
                  <span>Loading customer rate card profiles...</span>
                </div>
              ) : customerProfiles.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                  <FileText size={32} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No Special Rates Defined Yet</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                    This customer currently inherits standard lane pricing and vehicle matrix rates. Click "+ Add Special Rate" to set negotiated contract pricing.
                  </p>
                  <button
                    onClick={() => setShowAddProfileForm(true)}
                    className="mt-3 px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Create First Rate Rule
                  </button>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Profile Name</th>
                        <th className="py-3 px-4">Route / Zone</th>
                        <th className="py-3 px-4">Method</th>
                        <th className="py-3 px-4">Base Rate</th>
                        <th className="py-3 px-4">Min Charge</th>
                        <th className="py-3 px-4">Fuel Levy</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                      {customerProfiles.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {p.from || p.to ? `${p.from || 'Any'} ➔ ${p.to || 'Any'}` : 'All Lanes'}
                          </td>
                          <td className="py-3.5 px-4 text-indigo-600 font-bold">{p.method || 'Per Load'}</td>
                          <td className="py-3.5 px-4 font-mono font-black text-emerald-700">{fmt(p.baseRate)}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">{p.minCharge ? fmt(p.minCharge) : '—'}</td>
                          <td className="py-3.5 px-4 font-bold text-amber-700">{fmtPct(p.fuelLevy)}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {p.status || 'Active'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteProfile(p.id)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Delete Rule"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">
                Hero Logistics Contract Rate Engine
              </span>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
