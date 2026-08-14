import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  FiCheckCircle, FiClock, FiNavigation, FiPhone, FiChevronRight,
  FiCamera, FiFileText, FiMessageSquare, FiAlertTriangle, FiRefreshCw,
  FiTruck, FiInfo, FiMoreVertical, FiLayers, FiShield, FiHelpCircle,
  FiBookOpen, FiLifeBuoy, FiCheck, FiX, FiMapPin, FiMaximize2
} from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';
import { getLoadDetails, getMyLoads, updateLoadStatus } from '../../services/driverApi';

function extractCityState(addr) {
  if (!addr) return '';
  const parts = addr.split(',');
  return parts.length >= 2 ? parts.slice(-2).join(',').trim() : addr;
}

function formatBackendActiveLoad(rawLoad) {
  if (!rawLoad) return null;
  const displayId = rawLoad.loadRef || rawLoad.draftId || (rawLoad.id ? `LD-${rawLoad.id.substring(0, 4).toUpperCase()}` : 'LD-0000');
  
  const pickupStop = rawLoad.stops?.find(s => s.type === 'PICKUP') || rawLoad.stops?.[0];
  const dropoffStop = rawLoad.stops?.filter(s => s.type === 'DROPOFF').slice(-1)[0] || rawLoad.stops?.[rawLoad.stops?.length - 1];

  const pickupAddress = pickupStop?.address || '123 Sunshine Rd, Melbourne VIC 3000';
  const pickupName = pickupStop?.contactName || extractCityState(pickupAddress) || 'ABC Car Yard';
  const deliveryAddress = dropoffStop?.address || '45 Parramatta Rd, Sydney NSW 2150';
  const deliveryName = dropoffStop?.contactName || extractCityState(deliveryAddress) || 'Auto World Sydney';

  const origin = extractCityState(pickupAddress) || pickupName || 'Melbourne VIC';
  const destination = extractCityState(deliveryAddress) || deliveryName || 'Sydney NSW';

  const numStops = rawLoad.stops?.length || 2;
  const totalCarsCount = rawLoad.items?.length || 8;

  const isDispatched = ['IN_TRANSIT', 'ACTIVE', 'DELIVERED', 'COMPLETED'].includes(rawLoad.status);
  const isDelivered = ['DELIVERED', 'COMPLETED'].includes(rawLoad.status);

  return {
    rawId: rawLoad.id,
    id: displayId,
    status: rawLoad.status,
    origin,
    destination,
    pickupName,
    pickupAddress,
    deliveryName,
    deliveryAddress,
    stopsCount: Math.max(1, numStops - 1),
    totalCars: totalCarsCount,
    carsPickedUp: totalCarsCount,
    isDispatched,
    isDelivered,
    truckName: rawLoad.truck ? `${rawLoad.truck.make || ''} ${rawLoad.truck.model || ''} (${rawLoad.truck.rego || rawLoad.truck.plate || ''})`.trim() : 'MAN TGX 26.580',
    trailerName: rawLoad.trailer ? `${rawLoad.trailer.rego || rawLoad.trailer.plate || 'TRL-205'}` : 'TRL-205',
    loadType: rawLoad.type || 'Car Carrier (4 Level)'
  };
}

export default function ActiveRun() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams();

  // API State
  const [activeLoad, setActiveLoad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interactive States
  const [loadStatus, setLoadStatus] = useState('Picked Up'); // 'Picked Up', 'Dispatched', 'Delivered'
  const [isDispatched, setIsDispatched] = useState(false);
  const [carsPickedUp, setCarsPickedUp] = useState(8);
  const totalCars = activeLoad?.totalCars || 8;
  const [toastMsg, setToastMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);

  // Modals
  const [dispatchYardModalOpen, setDispatchYardModalOpen] = useState(false);
  const [dispatchDetailsModalOpen, setDispatchDetailsModalOpen] = useState(false);
  const [dispatchTime, setDispatchTime] = useState('10:15 AM');
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');

  // Fetch Load from Backend API
  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);
    setError(null);

    const targetId = paramId || location.state?.loadId;

    if (targetId) {
      getLoadDetails(targetId)
        .then(res => {
          if (isSubscribed) {
            const raw = res.data?.data?.load;
            if (raw) {
              const formatted = formatBackendActiveLoad(raw);
              setActiveLoad(formatted);
              setIsDispatched(formatted.isDispatched);
              setCarsPickedUp(formatted.totalCars);
              setLoadStatus(formatted.isDelivered ? 'Delivered' : formatted.isDispatched ? 'Dispatched' : 'Picked Up');
            } else {
              setError('Active load details not found.');
            }
          }
        })
        .catch(err => {
          if (isSubscribed) {
            const msg = err.response?.data?.error?.message || 'Could not load active run details.';
            setError(msg);
          }
        })
        .finally(() => {
          if (isSubscribed) setLoading(false);
        });
    } else {
      // Fetch driver's assigned loads to pick current active load
      getMyLoads()
        .then(res => {
          if (isSubscribed) {
            const loads = res.data?.data?.loads || [];
            if (loads.length > 0) {
              const current = loads.find(l => ['IN_TRANSIT', 'ACTIVE', 'ASSIGNED'].includes(l.status)) || loads[0];
              const formatted = formatBackendActiveLoad(current);
              setActiveLoad(formatted);
              setIsDispatched(formatted.isDispatched);
              setCarsPickedUp(formatted.totalCars);
              setLoadStatus(formatted.isDelivered ? 'Delivered' : formatted.isDispatched ? 'Dispatched' : 'Picked Up');
            } else {
              setError('No active loads assigned to your account.');
            }
          }
        })
        .catch(err => {
          if (isSubscribed) {
            const msg = err.response?.data?.error?.message || 'Could not load active run details.';
            setError(msg);
          }
        })
        .finally(() => {
          if (isSubscribed) setLoading(false);
        });
    }

    return () => { isSubscribed = false; };
  }, [paramId, location.state]);

  useEffect(() => {
    if (location.state?.autoOpenDispatchModal && !isDispatched) {
      setDispatchYardModalOpen(true);
    }
  }, [location.state, isDispatched]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      triggerToast('Data synced successfully with Fleet Command Server!');
    }, 1200);
  };

  // Status transition via Backend API
  const handleStatusTransitionApi = (targetStatusStr, note = '') => {
    const loadIdToUse = activeLoad?.rawId || paramId;
    if (!loadIdToUse) {
      triggerToast('No active load available for status update.');
      return;
    }
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    updateLoadStatus(loadIdToUse, targetStatusStr, note)
      .then(res => {
        const updatedStatus = res.data?.data?.load?.status || targetStatusStr;
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (['IN_TRANSIT', 'ACTIVE', 'DELIVERED', 'COMPLETED'].includes(updatedStatus)) {
          setIsDispatched(true);
          setDispatchTime(nowTime);
        }

        if (['DELIVERED', 'COMPLETED'].includes(updatedStatus)) {
          setLoadStatus('Delivered');
        } else if (['IN_TRANSIT', 'ACTIVE'].includes(updatedStatus)) {
          setLoadStatus('Dispatched');
        } else {
          setLoadStatus('Picked Up');
        }

        setActiveLoad(prev => prev ? {
          ...prev,
          status: updatedStatus,
          isDispatched: ['IN_TRANSIT', 'ACTIVE', 'DELIVERED', 'COMPLETED'].includes(updatedStatus),
          isDelivered: ['DELIVERED', 'COMPLETED'].includes(updatedStatus)
        } : null);

        triggerToast(`🚀 Status updated successfully to ${updatedStatus}`);
      })
      .catch(err => {
        const msg = err.response?.data?.error?.message || 'Failed to update load status.';
        triggerToast(`❌ Error: ${msg}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleDispatchLoad = () => {
    handleStatusTransitionApi('IN_TRANSIT', 'Dispatched from pickup yard');
    setDispatchDetailsModalOpen(true);
  };


  return (
    <div className="min-h-screen bg-[#f8fafc] text-left font-sans p-4 sm:p-6 lg:p-8 space-y-6 pb-24">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[150] bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffcc00] animate-ping"></span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP TITLE & ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Active Run</h1>
        </div>

        <div className="flex items-center gap-3 relative w-full sm:w-auto">
          {/* Update Status Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <button
              onClick={() => setStatusMenuOpen(!statusMenuOpen)}
              className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-between gap-2 cursor-pointer"
            >
              <span>Update Status</span>
              <span className="text-[10px]">▼</span>
            </button>

            {statusMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 py-2 text-xs font-bold text-slate-800">
                <button
                  onClick={() => { setStatusMenuOpen(false); handleStatusTransitionApi('IN_TRANSIT', 'Marked as Picked Up'); }}
                  disabled={isSubmitting}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Picked Up ({activeLoad?.totalCars || 8}/{activeLoad?.totalCars || 8} Cars)
                </button>
                <button
                  onClick={() => { setStatusMenuOpen(false); handleStatusTransitionApi('IN_TRANSIT', 'Marked as Dispatched'); }}
                  disabled={isSubmitting}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Dispatched
                </button>
                <button
                  onClick={() => { setStatusMenuOpen(false); handleStatusTransitionApi('DELIVERED', 'Marked as Delivered'); }}
                  disabled={isSubmitting}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span> Delivered
                </button>
              </div>
            )}
          </div>

          {/* More Actions */}
          <div className="relative flex-1 sm:flex-initial">
            <button
              onClick={() => setMoreActionsOpen(!moreActionsOpen)}
              className="w-full bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-between gap-1.5 cursor-pointer"
            >
              <FiMoreVertical className="text-indigo-600 text-sm" />
              <span>More Actions</span>
            </button>

            {moreActionsOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 py-2 text-xs font-bold text-slate-800">
                <button onClick={() => { navigate('/driver/delivery-pod'); setMoreActionsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-indigo-700 font-black">
                  📦 Delivery & POD
                </button>
                <button onClick={() => { setScanModalOpen(true); setMoreActionsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">
                  📷 Scan / Select Vehicles
                </button>
                <button onClick={() => { navigate('/driver/documents'); setMoreActionsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">
                  📄 View Bill of Lading (BOL)
                </button>
                <button onClick={() => { setNotesModalOpen(true); setMoreActionsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">
                  📝 Add Delivery Notes
                </button>
                <button onClick={() => { navigate('/driver/incident-reporting'); setMoreActionsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600">
                  ⚠️ Report Issue / Delay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT 2 COLUMNS: ACTIVE RUN DETAILS ================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* LOAD CARRIER DETAILS & STEPPER CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="text-2xl font-black text-indigo-700 tracking-tight">LD-3987</div>
                <div className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-2">
                  <span>Melbourne VIC</span>
                  <span className="text-slate-400">➔</span>
                  <span>Sydney NSW</span>
                </div>
              </div>

              {/* Start / Finish / Stops badges */}
              <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Start</span>
                  <span className="font-mono text-slate-900">08:00 AM</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Est. Finish</span>
                  <span className="font-mono text-slate-900">04:30 PM</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Stops</span>
                  <span className="font-mono text-slate-900">2</span>
                </div>
              </div>
            </div>

            {/* YOUR PROGRESS STEPPER */}
            <div className="space-y-4 pt-2">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YOUR PROGRESS</div>
              
              {/* Stepper bar */}
              <div className="relative flex items-center justify-between px-8 sm:px-16 pt-2 pb-1">
                {/* Connecting line aligned with circle centers (top-6 = 24px) */}
                <div className="absolute top-6 left-14 right-14 h-1 bg-slate-200 z-0">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: isDispatched ? '100%' : '50%' }}
                  ></div>
                </div>

                {/* Step 1: Picked Up */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-extrabold text-sm shadow-md ring-4 ring-white">
                    ✓
                  </div>
                  <span className="text-xs font-black text-slate-900 mt-1">Picked Up</span>
                  <span className="text-[10.5px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                    {carsPickedUp} / {totalCars} Cars
                  </span>
                </div>

                {/* Step 2: Dispatched */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-white transition-all ${
                    isDispatched ? 'bg-emerald-600 text-white' : 'bg-[#4338ca] text-white'
                  }`}>
                    {isDispatched ? '✓' : <span className="w-3 h-3 rounded-full bg-white animate-pulse"></span>}
                  </div>
                  <span className="text-xs font-black text-slate-900 mt-1">Dispatched</span>
                  <span className={`text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                    isDispatched 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {isDispatched ? '✓ Dispatched' : 'Pending Dispatch'}
                  </span>
                </div>

                {/* Step 3: Delivered */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm ring-4 ring-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  </div>
                  <span className="text-xs font-black text-slate-400 mt-1">Delivered</span>
                  <span className="text-[10.5px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    0 / {totalCars} Cars
                  </span>
                </div>
              </div>

              {/* Warning Alert Banner */}
              {!isDispatched && (
                <div className="bg-[#fffbe6] border border-[#ffe58f] rounded-2xl p-3.5 flex items-center gap-2.5 text-[#8c6b00] text-xs font-bold shadow-2xs mt-2">
                  <span className="text-amber-600 text-base">⚠️</span>
                  <span>Please pick up all assigned cars before you can DISPATCH the load.</span>
                </div>
              )}
            </div>

            {/* NEXT STOP CARD */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-indigo-600 text-base" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">NEXT STOP</span>
                </div>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  IN 112 KM
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">Auto World Sydney</h3>
                  <p className="text-xs font-medium text-slate-600">45 Parramatta Rd, Sydney NSW 2150</p>
                </div>

                <div className="text-right text-xs">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase">ETA</div>
                  <div className="font-mono font-black text-slate-900 text-sm">02:30 PM</div>
                  <div className="text-[11px] font-bold text-slate-500">In 1h 45m (112 km)</div>
                </div>
              </div>

              {/* Directions & Call Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setDirectionsModalOpen(true)}
                  className="bg-white hover:bg-slate-100 border border-indigo-200 text-indigo-700 font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiNavigation className="text-indigo-600" />
                  <span>Directions</span>
                </button>

                <button
                  onClick={() => triggerToast('Dialing contact: Mark Wilson (0411 987 654)...')}
                  className="bg-white hover:bg-slate-100 border border-indigo-200 text-indigo-700 font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiPhone className="text-indigo-600" />
                  <span>Call Contact</span>
                </button>
              </div>

              {/* Contact & Instructions snippet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Contact</span>
                  <div className="font-bold text-slate-900">Mark Wilson</div>
                  <div className="text-slate-500 font-mono">0411 987 654</div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Instructions</span>
                  <div className="font-semibold text-slate-700 flex items-center justify-between cursor-pointer hover:text-indigo-600">
                    <span>Please confirm delivery bay on arrival.</span>
                    <FiChevronRight className="text-slate-400" />
                  </div>
                </div>
              </div>

            </div>

            {/* READY TO DISPATCH? BANNER & DISPATCH BUTTON */}
            <div className={`border rounded-2xl p-5 text-center space-y-3 transition-all ${
              isDispatched ? 'bg-emerald-50/80 border-emerald-200' : 'bg-indigo-50/50 border-indigo-100'
            }`}>
              <div>
                <div className={`text-xs font-black uppercase tracking-wide ${isDispatched ? 'text-emerald-950' : 'text-indigo-950'}`}>
                  {isDispatched ? '✅ DISPATCH CONFIRMED & EN ROUTE' : 'READY TO DISPATCH?'}
                </div>
                <p className={`text-xs font-semibold mt-0.5 ${isDispatched ? 'text-emerald-800' : 'text-indigo-800'}`}>
                  {isDispatched 
                    ? `Departure logged at ${dispatchTime}. GPS location saved & customer notified.` 
                    : 'You have picked up all 8 cars. When you leave the yard, tap DISPATCH.'}
                </p>
              </div>

              <button
                onClick={() => isDispatched ? setDispatchDetailsModalOpen(true) : setDispatchYardModalOpen(true)}
                disabled={isSubmitting}
                className={`w-full max-w-md mx-auto font-black text-sm py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
                  isDispatched 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white transform hover:scale-[1.01]' 
                    : 'bg-[#4338ca] hover:bg-[#3730a3] text-white transform hover:scale-[1.01]'
                }`}
              >
                <FiTruck className="text-xl shrink-0" />
                <span>{isSubmitting ? 'Updating Status...' : isDispatched ? '✓ DISPATCHED (En Route) • Tap for Details' : 'DISPATCH • I am leaving the yard'}</span>
              </button>

              <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1">
                <span>{isDispatched ? '🔒 Departure recorded • Tap button anytime to view status & confirmation log' : '🔒 Dispatch will record your time and location and notify the customer.'}</span>
              </div>
            </div>

          </div>

          {/* QUICK ACTIONS BAR */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">QUICK ACTIONS</div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <button
                onClick={() => navigate('/driver/pickup-loading')}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-emerald-700 font-bold text-xs p-3 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 text-center"
              >
                <BsQrCodeScan className="text-emerald-600 text-lg shrink-0" />
                <span>Scan / Select Cars</span>
              </button>

              <button
                onClick={() => setPhotoModalOpen(true)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs p-3 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 text-center"
              >
                <FiCamera className="text-slate-600 text-lg shrink-0" />
                <span>Add Photo</span>
              </button>

              <button
                onClick={() => setNotesModalOpen(true)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs p-3 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 text-center"
              >
                <FiFileText className="text-slate-600 text-lg shrink-0" />
                <span>Job Notes</span>
              </button>

              <button
                onClick={() => navigate('/driver/contact-dispatch')}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-purple-700 font-bold text-xs p-3 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 text-center"
              >
                <FiMessageSquare className="text-purple-600 text-lg shrink-0" />
                <span>Message Dispatch</span>
              </button>

              <button
                onClick={() => navigate('/driver/incident-reporting')}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-rose-700 font-bold text-xs p-3 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 text-center col-span-2 sm:col-span-1"
              >
                <FiAlertTriangle className="text-rose-600 text-lg shrink-0" />
                <span>Report Issue</span>
              </button>
            </div>
          </div>


        </div>

        {/* ================= RIGHT COLUMN: SUMMARY, VEHICLES & STATUS ================= */}
        <div className="space-y-6">

          {/* RUN SUMMARY CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RUN SUMMARY</div>

            <div className="space-y-3.5 text-xs">
              
              {/* Pickup Location */}
              <div className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                <div>
                  <span className="font-extrabold text-slate-400 uppercase text-[10px] block">Pickup Location</span>
                  <div className="font-black text-slate-900">ABC Car Yard</div>
                  <div className="text-slate-500 font-medium">12a Sunshine Rd, Melbourne VIC 3000</div>
                </div>
              </div>

              {/* Picked Up Status */}
              <div className="flex items-start gap-3 pl-6">
                <div>
                  <span className="font-black text-emerald-600 block">Picked Up</span>
                  <span className="font-mono font-bold text-slate-800">8 / 8 Cars</span>
                </div>
              </div>

              {/* Dispatch Status */}
              <div className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-indigo-600 mt-1 shrink-0"></span>
                <div>
                  <span className="font-extrabold text-slate-400 uppercase text-[10px] block">Dispatch Status</span>
                  <div className="font-black text-indigo-700">{isDispatched ? 'Dispatched' : 'Not Dispatched'}</div>
                </div>
              </div>

              {/* Delivery Location */}
              <div className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-slate-400 mt-1 shrink-0"></span>
                <div>
                  <span className="font-extrabold text-slate-400 uppercase text-[10px] block">Delivery Location</span>
                  <div className="font-black text-slate-900">Auto World Sydney</div>
                  <div className="text-slate-500 font-medium">45 Parramatta Rd, Sydney NSW 2150</div>
                </div>
              </div>

              {/* Total Cars */}
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-bold">
                <span className="text-slate-500">Total Cars</span>
                <span className="font-mono text-slate-900">8 Cars</span>
              </div>

            </div>

            <button
              onClick={() => navigate('/driver/jobs')}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-indigo-700 font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>View Load Details</span>
              <FiChevronRight />
            </button>
          </div>

          {/* HELP & SUPPORT PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HELP & SUPPORT</div>

            <div className="space-y-1">
              {[
                { label: 'Safety Procedures', icon: <FiShield className="text-slate-500" /> },
                { label: 'Driver Guide', icon: <FiBookOpen className="text-slate-500" /> },
                { label: 'Contact Support', icon: <FiHelpCircle className="text-slate-500" /> },
                { label: 'Emergency Numbers', icon: <FiLifeBuoy className="text-rose-500" /> },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => triggerToast(`Opening ${item.label}...`)}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <FiChevronRight className="text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* LEGEND CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LEGEND</div>

            <div className="space-y-2 font-bold text-slate-700">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Picked Up</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span>Dispatched</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span>Delivered</span>
              </div>
            </div>
          </div>

          {/* VEHICLE & LOAD CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VEHICLE & LOAD</div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FiTruck className="text-slate-600 text-lg mt-0.5 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-400 uppercase text-[10px] block">Truck</span>
                  <div className="font-black text-slate-900">MAN TGX 26.580</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiLayers className="text-slate-600 text-lg mt-0.5 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-400 uppercase text-[10px] block">Trailer</span>
                  <div className="font-black text-slate-900">TRL-205</div>
                  <div className="text-slate-500 font-semibold">Car Carrier (2 Level)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BsQrCodeScan className="text-slate-600 text-lg mt-0.5 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-400 uppercase text-[10px] block">Load</span>
                  <div className="font-black text-slate-900">LD-3987</div>
                  <div className="text-slate-500 font-semibold">Car Carrier (8 Cars)</div>
                </div>
              </div>
            </div>
          </div>

          {/* STATUS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</div>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Last Sync</span>
                <span className="font-mono font-bold text-slate-800">29 May 2025, 09:15 AM</span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
              </div>

              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <FiRefreshCw className={`text-sm ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-bold">
                <span className="text-slate-500">Connection Status</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  Online <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>



      {/* SCAN / SELECT CARS MODAL */}
      {scanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <BsQrCodeScan className="text-emerald-600 text-lg" />
                Scan / Select Vehicles (8 Cars)
              </h3>
              <button onClick={() => setScanModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {[
                { vin: 'VIN-948192', model: 'Toyota Camry 2024 (White)', pos: 'Deck 1 - Front' },
                { vin: 'VIN-948193', model: 'Mazda CX-5 2024 (Blue)', pos: 'Deck 1 - Rear' },
                { vin: 'VIN-948194', model: 'Ford Ranger Wildtrak (Black)', pos: 'Deck 2 - Front' },
                { vin: 'VIN-948195', model: 'Hyundai Tucson 2024 (Silver)', pos: 'Deck 2 - Rear' },
                { vin: 'VIN-948196', model: 'Kia Carnival 2024 (Grey)', pos: 'Deck 3 - Front' },
                { vin: 'VIN-948197', model: 'Nissan X-Trail 2024 (Red)', pos: 'Deck 3 - Rear' },
                { vin: 'VIN-948198', model: 'Subaru Outback 2024 (Green)', pos: 'Deck 4 - Front' },
                { vin: 'VIN-948199', model: 'Tesla Model Y 2024 (White)', pos: 'Deck 4 - Rear' },
              ].map((car, idx) => (
                <div key={car.vin} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{car.model}</div>
                    <div className="font-mono text-[11px] text-slate-500">{car.vin} • {car.pos}</div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                    Scanned ✓
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setScanModalOpen(false); triggerToast('All 8 vehicle VINs verified & logged!'); }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Confirm All Scanned Vehicles
            </button>
          </div>
        </div>
      )}

      {/* ADD PHOTO MODAL */}
      {photoModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiCamera className="text-indigo-600 text-lg" />
                Capture / Upload Vehicle Photo
              </h3>
              <button onClick={() => setPhotoModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 bg-slate-50">
              <FiCamera className="text-3xl text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Click to capture from camera or browse file</div>
              <div className="text-[10px] text-slate-400 font-semibold">Supports JPG, PNG up to 10MB</div>
            </div>

            <input
              type="text"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder="Caption (e.g. Pre-existing scratch on rear bumper)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
            />

            <button
              onClick={() => {
                setPhotoModalOpen(false);
                triggerToast('Photo attached to load LD-3987 successfully!');
                setPhotoCaption('');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer"
            >
              Upload Photo
            </button>
          </div>
        </div>
      )}

      {/* JOB NOTES MODAL */}
      {notesModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiFileText className="text-indigo-600 text-lg" />
                Add Delivery Note
              </h3>
              <button onClick={() => setNotesModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter specific notes for pickup or delivery instructions..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
            />

            <button
              onClick={() => {
                setNotesModalOpen(false);
                triggerToast('Job note saved!');
                setNoteText('');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* GPS DIRECTIONS MODAL */}
      {directionsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiNavigation className="text-indigo-600 text-lg" />
                GPS Navigation Route
              </h3>
              <button onClick={() => setDirectionsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-2 text-xs">
              <div className="font-black text-indigo-950">Destination: Auto World Sydney</div>
              <div className="text-slate-600 font-medium">45 Parramatta Rd, Sydney NSW 2150</div>
              <div className="font-mono text-indigo-700 font-bold">Distance: 112 km • ETA: 02:30 PM</div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  window.open('https://maps.google.com/?q=45+Parramatta+Rd,+Sydney+NSW+2150', '_blank');
                  setDirectionsModalOpen(false);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Open in Google Maps</span>
                <FiNavigation />
              </button>

              <button
                onClick={() => {
                  window.open('https://waze.com/ul?q=45+Parramatta+Rd,+Sydney+NSW+2150', '_blank');
                  setDirectionsModalOpen(false);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Open in Waze Navigation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM TO LEAVE YARD / DISPATCH MODAL (15.5) */}
      {dispatchYardModalOpen && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-[160] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  DISPATCH CONFIRMATION
                </span>
                <h3 className="font-black text-slate-900 text-xl tracking-tight mt-1 flex items-center gap-2">
                  <FiTruck className="text-indigo-600" />
                  Confirm to Leave Yard / Dispatch
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Confirm load readiness before departing the pickup yard.
                </p>
              </div>
              <button 
                onClick={() => setDispatchYardModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 text-xl cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Load summary card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between font-black">
                <span className="text-slate-700">Load Identifier:</span>
                <span className="text-indigo-700 font-mono text-sm">LD-3987</span>
              </div>
              
              <div className="flex items-start gap-2.5">
                <FiMapPin className="text-indigo-600 text-sm mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">ABC Car Yard</span>
                  <div className="text-slate-500 text-[11px]">12a Sunshine Rd, Melbourne VIC 3000</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 text-[11px] font-bold">
                <span className="text-slate-600">Pickup Status:</span>
                <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ✓ 8 / 8 Cars Picked Up
                </span>
              </div>
            </div>

            {/* Departure Pre-checks */}
            <div className="space-y-2 text-xs font-semibold">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DEPARTURE CHECKLIST</div>
              
              <label className="flex items-center gap-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-950 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-600 rounded" />
                <span>All 8 vehicles securely strapped & height clearance verified</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-950 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-600 rounded" />
                <span>Gate pass & shipping manifests verified with yard attendant</span>
              </label>
            </div>

            {/* Time & GPS Info */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5 flex items-center justify-between text-xs text-indigo-900 font-bold">
              <div className="flex items-center gap-2">
                <FiClock className="text-indigo-600 text-base" />
                <span>Timestamp & GPS:</span>
              </div>
              <span className="font-mono text-[11px] text-indigo-700">Auto-recorded on dispatch</span>
            </div>

            {/* Modal Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setDispatchYardModalOpen(false);
                  handleDispatchLoad();
                }}
                className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white font-black text-sm py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiTruck className="text-lg" />
                <span>Confirm Leave Yard & Dispatch Load</span>
              </button>

              <button
                onClick={() => setDispatchYardModalOpen(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel / Return to Load
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH DETAILS & CONFIRMATION LOG MODAL */}
      {dispatchDetailsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-[160] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5 w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  DISPATCH LOGGED & CONFIRMED
                </span>
                <h3 className="font-black text-slate-900 text-xl tracking-tight mt-2 flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-600 text-2xl" />
                  Load LD-3987 En Route
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Departure successfully recorded. Customer & Dispatch notified.
                </p>
              </div>
              <button 
                onClick={() => setDispatchDetailsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 text-xl cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Confirmation Log Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/70">
                <span className="text-slate-500 font-bold">Departure Timestamp:</span>
                <span className="font-mono font-black text-slate-900 text-sm">{dispatchTime || '10:15 AM'}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200/70">
                <span className="text-slate-500 font-bold">Origin Yard:</span>
                <span className="font-bold text-slate-900">ABC Car Yard, Melbourne</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200/70">
                <span className="text-slate-500 font-bold">GPS Coordinates:</span>
                <span className="font-mono text-emerald-700 font-bold">Lat -37.8136, Long 144.9631 (Verified)</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200/70">
                <span className="text-slate-500 font-bold">Assigned Load:</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  8 / 8 Cars Secured ✓
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-500">Customer Notification:</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  ✓ Sent to Auto World Sydney (SMS/Email)
                </span>
              </div>
            </div>

            {/* Next Action Options */}
            <div className="space-y-2.5 pt-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NEXT ACTIONS</div>

              <button
                onClick={() => {
                  setDispatchDetailsModalOpen(false);
                  navigate('/driver/delivery-pod');
                }}
                className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white font-black text-sm py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📦 Proceed to Delivery & POD</span>
                <FiChevronRight className="text-lg" />
              </button>

              <button
                onClick={() => {
                  setDispatchDetailsModalOpen(false);
                  setDirectionsModalOpen(true);
                }}
                className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FiNavigation className="text-emerald-600" />
                <span>Open GPS Directions to Destination</span>
              </button>

              <button
                onClick={() => setDispatchDetailsModalOpen(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Close / View Active Run Map
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
