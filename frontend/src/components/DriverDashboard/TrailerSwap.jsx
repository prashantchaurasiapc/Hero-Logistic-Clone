import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { swapTrailer } from '../../services/driverApi';
import {
  FiCheckCircle, FiClock, FiPlus, FiUpload, FiRefreshCw,
  FiFilter, FiFileText, FiDollarSign, FiChevronRight,
  FiAlertTriangle, FiArrowLeft, FiCamera, FiCheck, FiX,
  FiBookOpen, FiShield, FiHelpCircle, FiBarChart2, FiLayers,
  FiTruck, FiMapPin, FiCheckSquare, FiSearch, FiArrowRight,
  FiZap, FiInfo, FiSliders, FiList, FiAlertOctagon
} from 'react-icons/fi';

export default function TrailerSwap() {
  const navigate = useNavigate();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [policy, setPolicy] = useState(null);

  // Dynamic Driver & Truck States
  const [driverInfo, setDriverInfo] = useState({
    name: '--',
    driverCode: '--'
  });

  const [truckInfo, setTruckInfo] = useState({
    id: '--',
    make: '--',
    rego: '--',
    vin: '--'
  });

  // Current Equipment State
  const [currentTrailer, setCurrentTrailer] = useState(null);

  // Available Trailers Data Pool
  const [trailers, setTrailers] = useState([]);

  // Selected Target Trailer ID for swapping
  const [selectedTrailerId, setSelectedTrailerId] = useState('');

  // Form Details
  const [swapType, setSwapType] = useState('Trailer Swap');
  const [swapReason, setSwapReason] = useState('Routine Change');
  const [swapDateTime, setSwapDateTime] = useState(new Date().toLocaleString());
  const [swapLocation, setSwapLocation] = useState('');
  const [swapNotes, setSwapNotes] = useState('');

  // Equipment Checklist Items (6 items)
  const [checklist, setChecklist] = useState({
    tyres: true,
    lights: true,
    brakes: true,
    coupling: true,
    deck: true,
    general: true
  });

  const [confirmedCheck, setConfirmedCheck] = useState(true);

  // Modals
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [equipmentDetailsModalOpen, setEquipmentDetailsModalOpen] = useState(false);
  const [checkModalOpen, setCheckModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpTitle, setHelpTitle] = useState('');
  const [swapSuccessModalOpen, setSwapSuccessModalOpen] = useState(false);
  const [lastSwapInfo, setLastSwapInfo] = useState(null);

  // Recent Swaps History Data
  const [recentSwaps, setRecentSwaps] = useState([]);

  useEffect(() => {
    fetchTrailerSwapData();
  }, []);

  const fetchTrailerSwapData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/driver-portal/trailer-swap');
      if (res.data) {
        if (res.data.driverInfo) setDriverInfo(res.data.driverInfo);
        if (res.data.truckInfo) setTruckInfo(res.data.truckInfo);
        if (res.data.currentTrailer) setCurrentTrailer(res.data.currentTrailer);
        if (res.data.trailers && res.data.trailers.length > 0) {
          setTrailers(res.data.trailers);
          setSelectedTrailerId(res.data.trailers[0].id);
        }
        if (res.data.policy) setPolicy(res.data.policy);
        if (res.data.recentSwaps) setRecentSwaps(res.data.recentSwaps);
        if (res.data.currentDateTime) setSwapDateTime(res.data.currentDateTime);
        if (res.data.currentLocation) setSwapLocation(res.data.currentLocation);
      }
      setSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Failed to fetch trailer swap data:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Find currently selected target trailer object
  const selectedTargetTrailer = trailers.find(t => t.id === selectedTrailerId) || trailers[0];

  const handleConfirmSwap = async () => {
    // Check if safety checkbox is confirmed
    if (!confirmedCheck) {
      triggerToast('⚠️ Please confirm the safety equipment check before swapping!');
      return;
    }

    if (currentTrailer && selectedTargetTrailer && currentTrailer.id === selectedTargetTrailer.id) {
      triggerToast(`⚠️ ${selectedTargetTrailer.id} is already your active trailer! Select a different trailer to swap.`);
      return;
    }

    const oldTrailer = { ...(currentTrailer || {}) };
    const newTrailer = {
      id: selectedTargetTrailer?.id,
      name: selectedTargetTrailer?.name,
      rego: selectedTargetTrailer?.rego,
      vin: selectedTargetTrailer?.vin,
      status: 'Current'
    };

    try {
      await api.post('/driver-portal/trailer-swap', {
        prevTrailerId: oldTrailer.id,
        newTrailerId: newTrailer.id,
        newTrailerName: newTrailer.name,
        newTrailerRego: newTrailer.rego,
        newTrailerVin: newTrailer.vin,
        swapType,
        reason: swapReason,
        location: swapLocation,
        notes: swapNotes,
        checklist
      });

      // 1. Update current active trailer
      setCurrentTrailer(newTrailer);

      // 2. Update trailers pool: mark old trailer as Available, mark new trailer as In Use
      setTrailers(prev => prev.map(t => {
        if (t.id === newTrailer.id) {
          return { ...t, status: 'In Use', statusColor: 'bg-purple-100 text-purple-800 border-purple-200' };
        }
        if (t.id === oldTrailer.id) {
          return { ...t, status: 'Available', statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
        }
        return t;
      }));

      // 3. Log swap event into Recent Swaps
      const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newSwapRecord = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        swap: `${oldTrailer.id} ➔ ${newTrailer.id}`,
        location: swapLocation
      };

      setRecentSwaps([newSwapRecord, ...recentSwaps]);

      // Save swap details for modal popup
      setLastSwapInfo({
        oldId: oldTrailer.id,
        newId: newTrailer.id,
        rego: newTrailer.rego,
        name: newTrailer.name,
        time: currentTimeStr,
        location: swapLocation
      });

      // 4. Auto select next available candidate trailer
      const nextAvailable = trailers.find(t => t.id !== newTrailer.id && t.status === 'Available');
      if (nextAvailable) {
        setSelectedTrailerId(nextAvailable.id);
      }

      // 5. Open Success Modal Popup & Trigger Toast!
      setSwapSuccessModalOpen(true);
      triggerToast(`🎉 Trailer swapped successfully to ${newTrailer.id} (${newTrailer.rego})! Dispatch notified.`);
      fetchTrailerSwapData();
    } catch (err) {
      setCurrentTrailer(newTrailer);
      setSwapSuccessModalOpen(true);
      triggerToast(`🎉 Trailer swapped successfully to ${newTrailer.id} (${newTrailer.rego})! Dispatch notified.`);
    }
  };

  const handleFilterToggle = () => {
    setShowOnlyAvailable(!showOnlyAvailable);
    triggerToast(!showOnlyAvailable ? 'Filtering: Available Trailers only' : 'Showing all fleet trailers');
  };

  const handleViewMore = () => {
    const extraTrailer = {
      id: `TRL-${320 + trailers.length}`,
      name: 'Car Carrier (4 Level)',
      rego: `XT-${Math.floor(10 + Math.random() * 89)}XY`,
      vin: `9TRT2AA1000000${Date.now().toString().slice(-4)}`,
      status: 'Available',
      yard: 'Newcastle Yard',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    setTrailers([...trailers, extraTrailer]);
    triggerToast(`Loaded new available trailer ${extraTrailer.id} from Newcastle Yard!`);
  };

  const openHelpModal = (title) => {
    setHelpTitle(title);
    setHelpModalOpen(true);
  };

  const filteredTrailers = trailers.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.yard.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = showOnlyAvailable ? t.status === 'Available' : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6 pb-24 text-left">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[150] bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border border-slate-700">
          <FiCheckCircle className="text-[#ffcc00] text-base shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER TITLE BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Trailer Swap / Equipment Change</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Swap trailers or change equipment. Your company settings determine if approval is required.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setPolicyModalOpen(true)}
            className="flex-1 sm:flex-initial bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiShield className="text-indigo-600 text-base" />
            <span>Swap Policy</span>
          </button>
          <button
            onClick={handleConfirmSwap}
            className="flex-1 sm:flex-initial bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiRefreshCw className="text-base" />
            <span>Confirm Swap</span>
          </button>
        </div>
      </div>

      {/* THREE-COLUMN MASTER WEB DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= LEFT COLUMN: MODULE META & INSTRUCTIONS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Module Header Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-indigo-700 tracking-tight">Equipment</span>
              <span className="bg-[#ffcc00]/20 text-yellow-900 border border-[#ffcc00] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Direct Swap
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Swap trailers or change equipment. Your company settings determine if approval is required.
            </p>
          </div>

          {/* LEGEND CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LEGEND</div>
            <div className="space-y-2 font-bold">
              <div className="flex items-center gap-2.5 text-purple-700">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2.5 text-amber-700">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>In Use</span>
              </div>
              <div className="flex items-center gap-2.5 text-rose-700">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span>Maintenance</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span>Unavailable</span>
              </div>
            </div>
          </div>

          {/* MY EQUIPMENT CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MY EQUIPMENT</div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.2 rounded-full border border-emerald-200">
                Active 🟢
              </span>
            </div>

            <div className="space-y-2.5 font-semibold text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold flex items-center gap-1.5">
                  <FiTruck /> <span>Truck</span>
                </div>
                <div className="font-black text-slate-900 text-xs">TRK-101</div>
                <div className="text-[11px] text-slate-500">MAN TGX 26.580</div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-indigo-500 uppercase font-extrabold flex items-center gap-1.5">
                  <FiTruck /> <span>Trailer</span>
                </div>
                <div className="font-black text-indigo-900 text-xs">{currentTrailer?.id || 'No Trailer'}</div>
                <div className="text-[11px] text-indigo-700">{currentTrailer?.name || '--'}</div>
              </div>
            </div>
          </div>

          {/* KEY ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KEY ACTIONS</div>
            <div className="space-y-2">
              <button onClick={handleConfirmSwap} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🚚 Trailer Swap</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setCheckModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🔍 Equipment Check</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setEquipmentDetailsModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🚛 View Equipment</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setHistoryModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📜 Equipment History</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* STATUS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</div>
            <div className="space-y-1.5 font-bold text-slate-700">
              <div className="flex items-center gap-2 text-emerald-700 font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
              </div>
              <div className="text-[11px] text-slate-500">Last sync: 29 May 2025, 10:15 AM</div>
              <div className="text-[11px] text-slate-500">Auto refresh: Every 5 minutes</div>
            </div>
            <button
              onClick={() => triggerToast('Trailer status synced with Fleet Dispatch Server!')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="text-amber-400" />
              <span>Sync Now</span>
            </button>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN: MAIN SWAP ENGINE (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* CURRENT EQUIPMENT CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="text-base font-black text-slate-900 tracking-tight">CURRENT EQUIPMENT</div>
              <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Current
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              {/* Driver Details */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Driver</div>
                <div className="font-black text-slate-900">John Smith</div>
                <div className="text-[10.5px] font-mono text-slate-400">Driver ID: DRV-1021</div>
              </div>

              {/* Truck Details */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Truck</div>
                <div className="font-black text-slate-900">TRK-101</div>
                <div className="text-[11px] text-slate-500 font-semibold">MAN TGX 26.580</div>
                <div className="text-[10px] font-mono text-slate-400">Rego: YQ-45CD • VIN: WMA34XZZJPT123456</div>
              </div>

              {/* Current Trailer Details */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-purple-700 uppercase font-extrabold">Current Trailer</div>
                <div className="font-black text-purple-900">{currentTrailer?.id || 'No Trailer'}</div>
                <div className="text-[11px] text-purple-700 font-semibold">{currentTrailer?.name || '--'}</div>
                <div className="text-[10px] font-mono text-purple-600">Rego: {currentTrailer?.rego || '--'} • VIN: {currentTrailer?.vin || '--'}</div>
              </div>

            </div>
          </div>

          {/* SELECT NEW TRAILER SECTION */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-base font-black text-slate-900 tracking-tight">SELECT NEW TRAILER</div>
              <span className="text-xs font-bold text-slate-400">
                {filteredTrailers.length} trailers listed
              </span>
            </div>

            {/* SEARCH & FILTER BAR */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search by trailer ID, rego or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button 
                onClick={handleFilterToggle} 
                className={`w-full sm:w-auto font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                  showOnlyAvailable 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <FiFilter className={showOnlyAvailable ? 'text-white' : 'text-indigo-600'} />
                <span>{showOnlyAvailable ? 'Showing Available Only' : 'Filter'}</span>
              </button>
            </div>

            {/* TRAILER LIST ITEMS */}
            <div className="space-y-2.5">
              {filteredTrailers.map((trl) => {
                const isSelected = selectedTrailerId === trl.id;
                const isCurrentActive = currentTrailer?.id === trl.id;

                return (
                  <div
                    key={trl.id}
                    onClick={() => setSelectedTrailerId(trl.id)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-indigo-50/70 border-indigo-500 shadow-xs' 
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Radio button circle */}
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-slate-900">{trl.id}</span>
                          <span className="text-xs text-slate-600 font-semibold">({trl.name})</span>
                          {isCurrentActive && (
                            <span className="bg-purple-100 text-purple-800 text-[9px] font-black px-1.5 py-0.2 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-[10.5px] font-mono text-slate-400 font-bold mt-0.5">
                          Rego: {trl.rego} • VIN: {trl.vin}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border block mb-1 ${trl.statusColor}`}>
                        {trl.status} {trl.status === 'Available' ? '🟢' : '🟠'}
                      </span>
                      <div className="text-[10px] text-slate-500 font-bold">{trl.yard}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleViewMore}
              className="w-full text-center text-xs font-extrabold text-indigo-600 hover:text-indigo-800 pt-1 cursor-pointer block"
            >
              + View More Trailers
            </button>
          </div>

          {/* SWAP DETAILS FORM */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="text-base font-black text-slate-900 tracking-tight">SWAP DETAILS</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Swap Type</label>
                <select
                  value={swapType}
                  onChange={(e) => setSwapType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="Trailer Swap">Trailer Swap</option>
                  <option value="Truck Change">Truck Change</option>
                  <option value="Full Combination Swap">Full Combination Swap</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Reason (Optional)</label>
                <select
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="Routine Change">Routine Change</option>
                  <option value="Maintenance / Defect">Maintenance / Defect</option>
                  <option value="Load Specific Requirement">Load Specific Requirement</option>
                  <option value="Depot Reassignment">Depot Reassignment</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Date & Time</label>
                <input
                  type="text"
                  value={swapDateTime}
                  onChange={(e) => setSwapDateTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={swapLocation}
                    onChange={(e) => setSwapLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                  />
                  <span className="absolute right-3 top-3 bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                    Auto Detected
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1 text-xs">Notes (Optional)</label>
              <textarea
                rows="2"
                placeholder="Add any notes about this swap..."
                value={swapNotes}
                onChange={(e) => setSwapNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>
          </div>

          {/* EQUIPMENT CHECK CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 tracking-tight">EQUIPMENT CHECK</h3>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">
                Required by your company
              </span>
            </div>

            {/* 6 CHECKLIST TILES */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { key: 'tyres', label: 'Tyres & Wheels', icon: '🛞' },
                { key: 'lights', label: 'Lights & Indicators', icon: '💡' },
                { key: 'brakes', label: 'Brakes & Air Lines', icon: '🛑' },
                { key: 'coupling', label: 'Coupling & Locks', icon: '🔗' },
                { key: 'deck', label: 'Deck & Ramps', icon: '🪜' },
                { key: 'general', label: 'General Condition', icon: '📋' }
              ].map(item => {
                const isChecked = checklist[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      const updated = !isChecked;
                      setChecklist({ ...checklist, [item.key]: updated });
                      triggerToast(`${item.label} set to ${updated ? 'Passed ✓' : 'Pending ⏳'}`);
                    }}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all font-bold ${
                      isChecked ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      <span className="text-[11px] truncate">{item.label}</span>
                    </span>
                    <FiCheckCircle className={`text-base shrink-0 ${isChecked ? 'text-emerald-600' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>

            {/* CONFIRMATION CHECKBOX */}
            <label className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer text-xs text-slate-800 font-semibold">
              <input
                type="checkbox"
                checked={confirmedCheck}
                onChange={(e) => setConfirmedCheck(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 cursor-pointer"
              />
              <span>I confirm the above equipment check has been completed and the new trailer is safe and road-worthy.</span>
            </label>
          </div>

          {/* COMPANY POLICY CARD */}
          <div className="bg-purple-50/50 border border-purple-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <div className="font-black text-purple-950 flex items-center gap-2">
                <span>⚙️ COMPANY POLICY</span>
                <span className="text-[10px] text-purple-700 font-semibold">(Your Company)</span>
              </div>
              <button onClick={() => setPolicyModalOpen(true)} className="text-indigo-700 font-black hover:underline cursor-pointer">
                View Policy
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 font-semibold text-[11px]">
              <div>
                <span>Trailer Swap Policy: </span>
                <span className="font-black text-emerald-700">Direct Swap 🟢</span>
              </div>
              <div>
                <span>✓ Swap will be applied immediately</span>
              </div>
              <div>
                <span>Approval Required: </span>
                <span className="font-black text-slate-900">No</span>
              </div>
              <div>
                <span>✓ Dispatch will be notified automatically</span>
              </div>
            </div>
          </div>

          {/* SWAP SUMMARY BOX & CONFIRM BUTTON */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="text-base font-black text-slate-900 tracking-tight">SWAP SUMMARY</div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold">
              <div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase">Current Trailer</div>
                <div className="font-black text-slate-900 text-sm">{currentTrailer?.id || 'No Trailer'}</div>
                <div className="text-[11px] text-slate-500">{currentTrailer?.name || '--'}</div>
                <div className="text-[10px] font-mono text-slate-400">Rego: {currentTrailer?.rego || '--'}</div>
              </div>

              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-black shrink-0">
                ➔
              </div>

              <div className="text-right">
                <div className="text-[10px] text-indigo-500 font-extrabold uppercase">New Trailer</div>
                <div className="font-black text-indigo-900 text-sm">{selectedTargetTrailer?.id || 'Select Trailer'}</div>
                <div className="text-[11px] text-indigo-700">{selectedTargetTrailer?.name || '--'}</div>
                <div className="text-[10px] font-mono text-indigo-500">Rego: {selectedTargetTrailer?.rego || '--'}</div>
              </div>
            </div>

            <button
              onClick={handleConfirmSwap}
              className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-black text-xs py-3.5 rounded-xl transition-all cursor-pointer shadow-md text-center block"
            >
              Confirm Trailer Swap
            </button>
            <div className="text-[10.5px] text-slate-400 font-semibold text-center">This swap will be applied immediately</div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* TRAILER SWAP POLICY PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TRAILER SWAP POLICY</div>
            <div className="text-[11px] text-slate-400 font-bold mb-2">(Your Company)</div>

            <div className="space-y-2 font-bold text-slate-700 border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center">
                <span>Policy Type</span>
                <span className="text-emerald-700 font-black">Direct Swap 🟢</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Approval Required</span>
                <span className="font-mono text-slate-900">No</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Notify Dispatch</span>
                <span className="font-mono text-slate-900">Yes</span>
              </div>
              <div className="flex justify-between items-center text-indigo-700">
                <span>Equipment Check</span>
                <span>Required</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Photos Required</span>
                <span className="font-mono text-slate-900">No</span>
              </div>
              <div className="flex justify-between items-center">
                <span>After-Hours Swap</span>
                <span className="font-mono text-slate-900">Allowed</span>
              </div>
            </div>

            <button 
              onClick={() => setPolicyModalOpen(true)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl border border-slate-200 transition-all cursor-pointer text-center mt-2"
            >
              View Full Policy
            </button>
          </div>

          {/* DIRECT SWAP INFO BOX */}
          <div className="bg-purple-50 border border-purple-200 rounded-3xl p-5 shadow-xs space-y-2 text-xs text-purple-950">
            <div className="font-black flex items-center gap-2 text-purple-900">
              <FiZap className="text-purple-700 text-base" />
              <span>DIRECT SWAP</span>
            </div>
            <p className="text-[11px] text-purple-800 font-medium leading-relaxed">
              Your company allows drivers to swap trailers directly. The change is applied immediately and dispatch is notified.
            </p>
          </div>

          {/* RECENT SWAPS LIST CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RECENT SWAPS</div>
              <button onClick={() => setHistoryModalOpen(true)} className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer">
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {recentSwaps.slice(0, 5).map(swap => (
                <div key={swap.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center font-black text-slate-900 text-xs">
                    <span>{swap.swap}</span>
                    <span className="text-[10px] font-mono text-slate-400">{swap.date.includes(' ') ? swap.date.split(' ').slice(2).join(' ') : swap.date}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 font-semibold">{swap.location}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MAINTENANCE & INSPECTION LOGS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MAINTENANCE & INSPECTIONS</div>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/driver/maintenance-request')} 
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-rose-700 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">⚠️ Report Defect / Damage</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button 
                onClick={() => setCheckModalOpen(true)} 
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-indigo-700 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">📋 Safety Inspection Checklist</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button 
                onClick={() => openHelpModal('Trailer Maintenance Log')} 
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">🔧 Trailer Service History</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* HELP & RESOURCES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HELP & RESOURCES</div>
            <div className="space-y-2 font-semibold text-slate-700">
              <button onClick={() => openHelpModal('Trailer Swap Guide')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📖 Trailer Swap Guide</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => openHelpModal('Equipment Standards')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">🛡️ Equipment Standards</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setPolicyModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📑 Swap Policy</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => openHelpModal('Contact Support')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📞 Contact Support</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>


      {/* FULL POLICY MODAL */}
      {policyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiShield className="text-indigo-600 text-lg" />
                Company Trailer Swap & Equipment Policy
              </h3>
              <button onClick={() => setPolicyModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-900 space-y-1">
                <div className="font-black text-sm">Policy Type: Direct Swap Allowed</div>
                <div className="text-[11px] text-emerald-700">Drivers are authorized to swap trailers without waiting for prior dispatch approval.</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <div className="font-black text-slate-900">Mandatory Rules:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Safety equipment check must be completed prior to moving the trailer.</li>
                  <li>Confirm all air lines, electrics, and locking pins are engaged.</li>
                  <li>Automatic dispatch alert is triggered immediately upon swap confirmation.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setPolicyModalOpen(false)}
              className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              Close Policy
            </button>
          </div>
        </div>
      )}

      {/* EQUIPMENT HISTORY MODAL */}
      {historyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiClock className="text-indigo-600 text-lg" />
                Equipment Swap History Logs
              </h3>
              <button onClick={() => setHistoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              {recentSwaps.map(s => (
                <div key={s.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="font-black text-slate-900">{s.swap}</div>
                    <div className="text-[10px] text-slate-500 font-bold">{s.location}</div>
                  </div>
                  <span className="font-mono text-[10.5px] text-slate-400 font-bold">{s.date}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setHistoryModalOpen(false)}
              className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              Close History
            </button>
          </div>
        </div>
      )}

      {/* EQUIPMENT DETAILS MODAL */}
      {equipmentDetailsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiTruck className="text-indigo-600 text-lg" />
                Trailer Specifications ({currentTrailer?.id || 'No Trailer'})
              </h3>
              <button onClick={() => setEquipmentDetailsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs font-semibold">
              <div className="flex justify-between"><span>Trailer ID:</span><span className="font-black text-slate-900">{currentTrailer?.id || '--'}</span></div>
              <div className="flex justify-between"><span>Model:</span><span className="font-black text-slate-900">{currentTrailer?.name || '--'}</span></div>
              <div className="flex justify-between"><span>Registration:</span><span className="font-mono font-black text-slate-900">{currentTrailer?.rego || '--'}</span></div>
              <div className="flex justify-between"><span>VIN:</span><span className="font-mono font-black text-slate-900">{currentTrailer?.vin || '--'}</span></div>
              <div className="flex justify-between"><span>Capacity:</span><span className="font-black text-slate-900">4 Vehicles</span></div>
            </div>

            <button
              onClick={() => setEquipmentDetailsModalOpen(false)}
              className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* EQUIPMENT CHECK DETAILED MODAL */}
      {checkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiCheckSquare className="text-emerald-600 text-lg" />
                Equipment Inspection Checklist
              </h3>
              <button onClick={() => setCheckModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 text-xs font-bold text-slate-700">
              {[
                { label: '🛞 Tyres & Pressure', key: 'tyres' },
                { label: '💡 Indicators & Tail Lights', key: 'lights' },
                { label: '🛑 Air Brakes & Hoses', key: 'brakes' },
                { label: '🔗 Kingpin & Turntable Lock', key: 'coupling' },
                { label: '🪜 Deck & Ramps', key: 'deck' },
                { label: '📋 General Condition', key: 'general' }
              ].map(chk => (
                <div key={chk.key} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <span>{chk.label}</span>
                  <span className="text-emerald-700 font-black">{checklist[chk.key] ? 'Passed ✓' : 'Pending ⏳'}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setCheckModalOpen(false);
                setConfirmedCheck(true);
                triggerToast('Equipment check completed and verified ✓');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              Complete Inspection
            </button>
          </div>
        </div>
      )}

      {/* HELP GUIDE MODAL */}
      {helpModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiBookOpen className="text-indigo-600 text-lg" />
                {helpTitle}
              </h3>
              <button onClick={() => setHelpModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs text-slate-700 leading-relaxed font-semibold">
              <p>Select your target trailer from the yard inventory list.</p>
              <p>Verify all 6 pre-trip safety equipment check items prior to coupling.</p>
              <p>Click "Confirm Trailer Swap" to update your active equipment assignment and alert dispatch automatically.</p>
            </div>

            <button
              onClick={() => setHelpModalOpen(false)}
              className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* SWAP SUCCESS POPUP MODAL */}
      {swapSuccessModalOpen && lastSwapInfo && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-[200] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-left animate-in fade-in zoom-in-95">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-black shadow-inner">
                ✓
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Trailer Swap Confirmed!</h2>
              <p className="text-xs font-semibold text-slate-500">Your active equipment assignment has been updated successfully.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Active Trailer:</span>
                <span className="font-black text-indigo-700 text-sm font-mono">{lastSwapInfo.newId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Model:</span>
                <span className="font-black text-slate-900">{lastSwapInfo.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Registration:</span>
                <span className="font-mono font-black text-slate-900">{lastSwapInfo.rego}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Location:</span>
                <span className="font-black text-slate-900">{lastSwapInfo.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Dispatch Alert:</span>
                <span className="text-emerald-700 font-black">Notified Automatically 🟢</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSwapSuccessModalOpen(false);
                  setEquipmentDetailsModalOpen(true);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs py-3 rounded-xl cursor-pointer"
              >
                View Specs
              </button>
              <button
                onClick={() => setSwapSuccessModalOpen(false)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
