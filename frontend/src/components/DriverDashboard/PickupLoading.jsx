import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  FiArrowLeft, FiHelpCircle, FiMoreVertical, FiCheck, FiTrash2, FiEdit2,
  FiPlus, FiCamera, FiAlertTriangle, FiPhone, FiNavigation, FiChevronRight,
  FiCheckCircle, FiInfo, FiRefreshCw, FiUserCheck, FiShield, FiX, FiClock,
  FiHome, FiClipboard, FiMessageSquare, FiGrid, FiEye, FiFileText, FiTruck
} from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';
import { getLoadDetails, getMyLoads, getPickupItems, pickupItem } from '../../services/driverApi';

export default function PickupLoading() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams();

  // API State
  const [activeLoad, setActiveLoad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mode & Toast States
  const [driverMode, setDriverMode] = useState('Flexible / Owner-Driver');
  const [toastMsg, setToastMsg] = useState('');
  const [wrongVehicleAlert, setWrongVehicleAlert] = useState(false);
  const [addCarModalOpen, setAddCarModalOpen] = useState(false);
  const [scanVinModalOpen, setScanVinModalOpen] = useState(false);
  const [scanVinInput, setScanVinInput] = useState('');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [jobDetailsModalOpen, setJobDetailsModalOpen] = useState(false);
  const [editCarModalOpen, setEditCarModalOpen] = useState(false);
  const [selectedCarForModal, setSelectedCarForModal] = useState(null);
  const [editingCar, setEditingCar] = useState(null);
  const [pickupNotes, setPickupNotes] = useState('');

  // New Car Form State
  const [newVin, setNewVin] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newDrop, setNewDrop] = useState('DROP 1');

  const fileInputRef = useRef(null);
  const [activeSlotTarget, setActiveSlotTarget] = useState(null);

  const samplePhotos = [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&auto=format&fit=crop'
  ];

  // Cars Data with DROPs (Fetched dynamically from real backend API)
  const [cars, setCars] = useState([]);

  // Fetch Load & Pickup Items from Backend
  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);
    setError(null);

    const targetId = paramId || location.state?.loadId;

    const loadTask = targetId 
      ? getLoadDetails(targetId) 
      : getMyLoads().then(res => {
          const loads = res.data?.data?.loads || [];
          const active = loads.find(l => ['IN_TRANSIT', 'ACTIVE', 'ASSIGNED'].includes(l.status)) || loads[0];
          if (!active) throw new Error('No active load found.');
          return getLoadDetails(active.id);
        });

    loadTask
      .then(res => {
        if (!isSubscribed) return;
        const rawLoad = res.data?.data?.load;
        if (!rawLoad) throw new Error('Load not found.');

        const displayId = rawLoad.loadRef || (rawLoad.id ? `LD-${rawLoad.id.substring(0, 4).toUpperCase()}` : 'LD-0000');
        setActiveLoad({
          rawId: rawLoad.id,
          displayId,
          loadRef: rawLoad.loadRef,
          status: rawLoad.status,
        });

        // Fetch Real Load Items from backend
        return getPickupItems(rawLoad.id);
      })
      .then(res => {
        if (!isSubscribed || !res) return;
        const backendItems = res.data?.data?.items || [];
        const formattedCars = backendItems.map((item, idx) => ({
          id: item.id,
          drop: item.dropoffStop?.contactName ? `DROP ${idx + 1}` : `DROP ${(idx % 4) + 1}`,
          dropLoc: item.dropoffStop?.address || item.dropoffStop?.contactName || 'Auto World Sydney',
          vin: item.vin || `VIN-${String(item.id).substring(0, 8).toUpperCase()}`,
          makeModel: `${item.make || ''} ${item.model || 'Vehicle'}`.trim(),
          color: item.color || 'White',
          plate: item.rego || `REG-${idx + 101}`,
          pickedUp: item.status === 'PICKED_UP',
          time: item.status === 'PICKED_UP' ? '08:15 AM' : null,
          photos: { current: item.status === 'PICKED_UP' ? 4 : 0, total: 4, percent: item.status === 'PICKED_UP' ? 100 : 0 }
        }));
        setCars(formattedCars);
      })
      .catch(err => {
        if (isSubscribed) {
          const msg = err.response?.data?.error?.message || err.message || 'Could not load pickup details.';
          setError(msg);
        }
      })
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => { isSubscribed = false; };
  }, [paramId, location.state]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };


  // Helper Brand Logos SVG Generator
  const getBrandLogo = (makeModel = '') => {
    const name = makeModel.toLowerCase();

    if (name.includes('toyota')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center p-0.5 shrink-0 shadow-2xs">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-red-600">
            <ellipse cx="12" cy="12" rx="10" ry="7" fill="none" stroke="currentColor" strokeWidth="1.8"/>
            <ellipse cx="12" cy="12" rx="7" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <ellipse cx="12" cy="9.5" rx="3.5" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
      );
    }
    if (name.includes('mazda')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center p-0.5 shrink-0 shadow-2xs">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-slate-800">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M6 14C8 10 10 8 12 11C14 8 16 10 18 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      );
    }
    if (name.includes('tesla')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center p-0.5 shrink-0 shadow-2xs">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-red-600">
            <path d="M12 4L6 6v2c0 4 3 7 6 9 3-2 6-5 6-9V6l-6-2z"/>
          </svg>
        </div>
      );
    }
    if (name.includes('honda')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center p-0.5 shrink-0 shadow-2xs">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-slate-800">
            <rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M7 7v10M17 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      );
    }
    if (name.includes('audi')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-0.5 shrink-0 shadow-2xs">
          <svg viewBox="0 0 32 16" className="w-5 h-2.5 fill-none stroke-white" strokeWidth="1.8">
            <circle cx="7" cy="8" r="5"/>
            <circle cx="13" cy="8" r="5"/>
            <circle cx="19" cy="8" r="5"/>
            <circle cx="25" cy="8" r="5"/>
          </svg>
        </div>
      );
    }
    if (name.includes('mercedes') || name.includes('benz')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center p-0.5 shrink-0 shadow-2xs">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-slate-900" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 3v9M12 12l-7.5 4.5M12 12l7.5 4.5" strokeLinecap="round"/>
          </svg>
        </div>
      );
    }
    if (name.includes('volvo')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center p-0.5 shrink-0 shadow-2xs">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-blue-700" strokeWidth="1.8">
            <circle cx="10" cy="14" r="7"/>
            <path d="M15 9l5-5M20 4h-4M20 4v4"/>
          </svg>
        </div>
      );
    }
    if (name.includes('ford')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center p-0.5 shrink-0 shadow-2xs">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-blue-900" strokeWidth="1.8">
            <ellipse cx="12" cy="12" rx="9" ry="5"/>
            <path d="M8 12c2-2 6-2 8 0" strokeLinecap="round"/>
          </svg>
        </div>
      );
    }

    return (
      <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
        🚗
      </div>
    );
  };

  const handlePickupVinApi = (targetVinOrId, carObj = null) => {
    const currentLoadId = activeLoad?.rawId || paramId;
    if (!currentLoadId || isSubmitting) return;
    setIsSubmitting(true);
    setWrongVehicleAlert(false);

    pickupItem(currentLoadId, { vin: targetVinOrId, itemId: carObj?.id, note: pickupNotes })
      .then(res => {
        const updatedItem = res.data?.data?.item;
        const targetVin = updatedItem?.vin || targetVinOrId;
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setCars(prevCars => prevCars.map(c => {
          if (c.id === carObj?.id || c.id === updatedItem?.id || (c.vin && c.vin.toUpperCase() === targetVin.toUpperCase())) {
            return {
              ...c,
              pickedUp: true,
              time: nowTime,
              photos: { current: 4, total: 4, percent: 100 }
            };
          }
          return c;
        }));

        triggerToast(`✅ VIN ${targetVin} Verified! Vehicle marked as Picked Up.`);
      })
      .catch(err => {
        const msg = err.response?.data?.error?.message || 'VIN scan validation failed.';
        triggerToast(`❌ Error: ${msg}`);
        setWrongVehicleAlert(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const togglePickUp = (id) => {
    const carObj = cars.find(c => c.id === id);
    if (!carObj) return;

    if (carObj.pickedUp) {
      triggerToast(`Vehicle ${carObj.makeModel} (VIN: ${carObj.vin}) is already picked up.`);
      return;
    }

    handlePickupVinApi(carObj.vin, carObj);
  };

  const deleteCar = (id) => {
    const carToDelete = cars.find(c => c.id === id);
    setCars(cars.filter(c => c.id !== id));
    triggerToast(`Car ${carToDelete?.makeModel || ''} removed from pickup load.`);
  };

  const handleSlotClick = (slotIndex, isUploaded) => {
    if (isUploaded) {
      handleTogglePhotoSlot(slotIndex, null, 'remove');
    } else {
      setActiveSlotTarget(slotIndex);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlotTarget) return;
    const imageUrl = URL.createObjectURL(file);
    handleTogglePhotoSlot(activeSlotTarget, imageUrl, 'add');
    e.target.value = '';
  };

  const handleTogglePhotoSlot = (slotIndex, customUrl = null, actionType = 'auto') => {
    if (!selectedCarForModal) return;
    const carId = selectedCarForModal.id;

    setCars(prevCars => prevCars.map(c => {
      if (c.id === carId) {
        const targetObj = c.photos;
        const currentPhotoUrls = c.photoUrls || {};
        const isCurrentlyUploaded = slotIndex <= targetObj.current || !!currentPhotoUrls[slotIndex];

        let newCurrent = targetObj.current;
        let newPhotoUrls = { ...currentPhotoUrls };

        if (actionType === 'remove' || (actionType === 'auto' && isCurrentlyUploaded)) {
          delete newPhotoUrls[slotIndex];
          newCurrent = Math.max(0, targetObj.current - 1);
        } else {
          newPhotoUrls[slotIndex] = customUrl || samplePhotos[(slotIndex - 1) % 4];
          newCurrent = Math.min(targetObj.total, Math.max(targetObj.current + 1, slotIndex));
        }

        const newPercent = Math.round((newCurrent / targetObj.total) * 100);

        const updatedObj = {
          ...targetObj,
          current: newCurrent,
          percent: newPercent,
        };

        const updatedCar = { ...c, photos: updatedObj, photoUrls: newPhotoUrls };
        setSelectedCarForModal(updatedCar);
        triggerToast((actionType !== 'remove' && !isCurrentlyUploaded) ? `📸 Photo #${slotIndex} captured & uploaded!` : `Photo #${slotIndex} removed.`);
        return updatedCar;
      }
      return c;
    }));
  };

  const handleAddCarSubmit = (e) => {
    e.preventDefault();
    if (!newModel || !newVin) return;
    const newCarItem = {
      id: Date.now(),
      drop: newDrop,
      dropLoc: newDrop === 'DROP 1' ? 'Auto World Sydney' : newDrop === 'DROP 2' ? 'Newcastle Motors' : 'Brisbane Car Centre',
      vin: newVin.toUpperCase(),
      makeModel: newModel,
      color: 'White',
      plate: newPlate.toUpperCase() || 'TEMP-99',
      pickedUp: true,
      time: '08:25 AM',
      photos: { current: 4, total: 4, percent: 100 }
    };
    setCars([...cars, newCarItem]);
    setAddCarModalOpen(false);
    setNewVin('');
    setNewModel('');
    setNewPlate('');
    triggerToast(`Added ${newModel} to ${newDrop}!`);
  };

  const pickedUpCount = cars.filter(c => c.pickedUp).length;
  const totalCarsCount = cars.length;
  const progressPercent = Math.round((pickedUpCount / totalCarsCount) * 100);

  // Group by Drop
  const drops = ['DROP 1', 'DROP 2', 'DROP 3', 'DROP 4'];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6 pb-24 text-left">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[150] bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <FiCheckCircle className="text-[#ffcc00] text-base" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP PAGE HEADER TITLE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Pickup & Loading</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Scan or select cars assigned to load LD-3987</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setScanVinModalOpen(true)}
            className="flex-1 sm:flex-initial bg-[#4f46e5] hover:bg-[#4338ca] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BsQrCodeScan className="text-base" />
            <span>Scan VIN Barcode</span>
          </button>

          <button
            onClick={() => setAddCarModalOpen(true)}
            className="flex-1 sm:flex-initial bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiPlus className="text-base" />
            <span>Add Car to Load</span>
          </button>
        </div>
      </div>

      {/* TOP HEADER LOAD BANNER CARD ("LD-3987") - MATCHES SCREENSHOT 2 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="text-2xl font-black text-indigo-700 tracking-tight">LD-3987</div>
          <div className="text-sm font-black text-slate-800 flex items-center gap-2">
            <span>Melbourne VIC</span>
            <span className="text-slate-400">➔</span>
            <span>Sydney NSW</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Pickup Time</span>
              <span className="font-mono text-slate-900 font-extrabold">08:00 AM</span>
            </div>

            <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>

            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Est. Finish</span>
              <span className="font-mono text-slate-900 font-extrabold">04:30 PM</span>
            </div>

            <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>

            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Total Cars</span>
              <span className="font-mono text-slate-900 font-extrabold">{totalCarsCount} Cars</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setJobDetailsModalOpen(true)}
          className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap self-start md:self-center"
        >
          <FiFileText className="text-slate-500 text-sm" />
          <span>Job Details</span>
        </button>
      </div>

      {/* THREE BANNER CARDS GRID - MATCHES SCREENSHOT 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Banner 1: VIN Scan Info */}
        <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs">
          <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shrink-0">
            <BsQrCodeScan className="text-xl" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-purple-950 leading-snug">Scan or select each car for pickup at this location.</h4>
            <p className="text-purple-700 font-medium text-[11px] mt-0.5">All 8 cars must be picked up before DISPATCH.</p>
          </div>
        </div>

        {/* Banner 2: Driver Mode Info */}
        <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs">
          <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shrink-0">
            <FiUserCheck className="text-xl" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-purple-950 leading-snug">Flexible / Owner-Driver Mode</h4>
            <p className="text-purple-700 font-medium text-[11px] mt-0.5">You can add, remove and edit cars and destinations.</p>
          </div>
        </div>

        {/* Banner 3: Auto Sync Info */}
        <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs">
          <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shrink-0">
            <FiShield className="text-xl" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-purple-950 leading-snug">All changes are saved automatically and logged</h4>
            <p className="text-purple-700 font-medium text-[11px] mt-0.5">Logged with time, GPS and driver details.</p>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT MATCHING USER SCREENSHOT 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= LEFT MAIN CONTENT COLUMN (9 COLS) ================= */}
        <div className="lg:col-span-9 space-y-5">

          {/* CARS TO PICK UP TABLE CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">CARS TO PICK UP ({totalCarsCount})</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Location: ABC Car Yard • Melbourne VIC</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setScanVinModalOpen(true)}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs px-3.5 py-2 rounded-xl border border-indigo-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <BsQrCodeScan className="text-indigo-600 text-sm" />
                  <span>Scan VIN</span>
                </button>

                <button
                  onClick={() => setAddCarModalOpen(true)}
                  className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <FiPlus className="text-sm" />
                  <span>+ Add Car</span>
                </button>
              </div>
            </div>

            {/* DROPS BREAKDOWN TABLE SECTIONS */}
            <div className="space-y-4">
              {cars.length > 0 ? (
                drops.map((dropName) => {
                const dropCars = cars.filter(c => c.drop === dropName);
                if (dropCars.length === 0) return null;
                const dropLoc = dropCars[0]?.dropLoc || 'Delivery Location';

                return (
                  <div key={dropName} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                    {/* Drop Header */}
                    <div className="bg-slate-100/90 px-3.5 py-2.5 border-b border-slate-200 flex justify-between items-center text-xs font-bold">
                      <div className="flex items-center gap-2 text-indigo-900">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                        <span className="font-black text-xs">{dropName}</span>
                        <span className="text-slate-400 font-normal">|</span>
                        <span className="text-slate-700 text-[11px]">Deliver: {dropLoc}</span>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        {dropCars.length} {dropCars.length === 1 ? 'Car' : 'Cars'}
                      </span>
                    </div>

                    {/* Cars Table */}
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                            <th className="py-2.5 px-2 text-center w-8 align-middle">#</th>
                            <th className="py-2.5 px-2 min-w-[120px] align-middle">VEHICLE</th>
                            <th className="py-2.5 px-2 min-w-[120px] align-middle">REG / VIN</th>
                            <th className="py-2.5 px-2 min-w-[110px] align-middle">STATUS</th>
                            <th className="py-2.5 px-2 min-w-[120px] align-middle">PHOTOS</th>
                            <th className="py-2.5 px-2 text-center min-w-[100px] align-middle">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/80 bg-white font-semibold text-slate-700">
                          {dropCars.map((car, idx) => (
                            <tr 
                              key={car.id} 
                              className={`hover:bg-slate-50/80 transition-colors ${
                                car.pickedUp ? 'bg-emerald-50/20' : ''
                              }`}
                            >
                              {/* Checkbox / # Column */}
                              <td className="py-3 px-2 text-center align-middle whitespace-nowrap">
                                <button
                                  onClick={() => togglePickUp(car.id)}
                                  className="cursor-pointer focus:outline-none inline-flex items-center justify-center gap-1.5"
                                  title={car.pickedUp ? "Mark as Not Picked Up" : "Mark as Picked Up"}
                                >
                                  {car.pickedUp ? (
                                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                                      ✓
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white hover:border-indigo-500 text-transparent flex items-center justify-center text-[10px] shrink-0" />
                                  )}
                                  <span className="font-extrabold text-slate-900 text-xs">{idx + 1}</span>
                                </button>
                              </td>

                              {/* Vehicle Column with Brand Emblem */}
                              <td className="py-3 px-2 align-middle whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {getBrandLogo(car.makeModel)}
                                  <div>
                                    <div className="font-extrabold text-slate-900 text-xs">{car.makeModel}</div>
                                    <div className="text-[10px] text-slate-400 font-medium">{car.color}</div>
                                  </div>
                                </div>
                              </td>

                              {/* REG / VIN Column */}
                              <td className="py-3 px-2 align-middle whitespace-nowrap">
                                <div className="font-extrabold text-slate-900 text-xs">{car.plate}</div>
                                <div className="font-mono text-[10px] text-slate-400 font-semibold">{car.vin}</div>
                              </td>

                              {/* Status Column */}
                              <td className="py-3 px-2 align-middle whitespace-nowrap">
                                {car.pickedUp ? (
                                  <div>
                                    <span className="text-emerald-700 font-extrabold text-xs block">Picked Up</span>
                                    <span className="text-emerald-600 text-[10px] font-bold block">{car.time}</span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 font-bold text-xs">Not Picked Up</span>
                                )}
                              </td>

                              {/* Photos Column (Matches Screenshot 2) */}
                              <td className="py-3 px-2 align-middle whitespace-nowrap">
                                <div className="flex items-center gap-1.5 mb-1 text-slate-800 font-bold">
                                  <FiCamera className="text-slate-500 text-xs shrink-0" />
                                  <span>{car.photos.current} / {car.photos.total}</span>
                                  <span className={`text-[10px] font-extrabold ml-1 ${
                                    car.photos.percent === 100 ? 'text-emerald-600' : 
                                    car.photos.percent > 0 ? 'text-amber-600' : 'text-slate-400'
                                  }`}>
                                    {car.photos.percent}%
                                  </span>
                                </div>

                                <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      car.photos.percent === 100 ? 'bg-emerald-500' : 
                                      car.photos.percent > 0 ? 'bg-amber-500' : 'bg-slate-300'
                                    }`}
                                    style={{ width: `${car.photos.percent}%` }}
                                  ></div>
                                </div>

                                {car.photos.percent < 100 && (
                                  <span className="text-[9.5px] font-bold text-amber-600 block mt-0.5">
                                    Missing {car.photos.total - car.photos.current} Photo{car.photos.total - car.photos.current > 1 ? 's' : ''}
                                  </span>
                                )}
                              </td>

                              {/* Actions Column (1. Camera, 2. Edit, 3. Delete) */}
                              <td className="py-3 px-2 text-center align-middle whitespace-nowrap">
                                <div className="inline-flex items-center justify-center gap-1.5">
                                  {/* Camera / Photo Capture Button (FIRST - Next to Edit with 0/4, 3/4, 4/4 count) */}
                                  <button
                                    onClick={() => { setSelectedCarForModal(car); setPhotoModalOpen(true); }}
                                    className="h-7 px-2 rounded-lg border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-800 font-extrabold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all shadow-2xs shrink-0"
                                    title="Capture / Upload Vehicle Photos"
                                  >
                                    <FiCamera className="text-xs text-purple-700 shrink-0" />
                                    <span className="font-mono text-[10.5px] font-black">{car.photos.current}/{car.photos.total}</span>
                                  </button>

                                  {/* Edit Pencil Button (SECOND) */}
                                  <button
                                    onClick={() => { setEditingCar(car); setEditCarModalOpen(true); }}
                                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-indigo-600 flex items-center justify-center cursor-pointer transition-all shadow-2xs shrink-0"
                                    title="Edit car details"
                                  >
                                    <FiEdit2 className="text-xs text-indigo-600" />
                                  </button>

                                  {/* Delete Trash Button (THIRD) */}
                                  <button
                                    onClick={() => deleteCar(car.id)}
                                    className="w-7 h-7 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer transition-all shadow-2xs shrink-0"
                                    title="Remove car"
                                  >
                                    <FiTrash2 className="text-xs text-rose-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            ) : (
                <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
                  <FiTruck className="mx-auto text-3xl text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700 text-sm">No vehicles assigned to pick up on this load.</p>
                  <p className="text-xs text-slate-400 mt-1">Use "+ Add Car" or "Scan VIN" to scan or add vehicles manually.</p>
                </div>
              )}
            </div>

            {/* ADD CAR FROM YARD / POOL BANNER */}
            <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-purple-100 text-purple-700 rounded-xl text-sm shrink-0">🚗</span>
                <div>
                  <div className="font-black text-purple-950 text-xs">Add Car from Yard / Pool</div>
                  <div className="text-purple-700 text-[11px] font-medium">Scan a VIN to add any car that is not currently on your load.</div>
                </div>
              </div>

              <button
                onClick={() => setScanVinModalOpen(true)}
                className="bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs w-full sm:w-auto"
              >
                <BsQrCodeScan className="text-purple-700" />
                <span>Scan VIN to Add</span>
              </button>
            </div>

            {/* WRONG VEHICLE SCANNED ALERT BANNER */}
            {wrongVehicleAlert && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-start justify-between gap-3 text-rose-900 text-xs shadow-xs">
                <div className="flex items-start gap-3">
                  <FiAlertTriangle className="text-rose-600 text-base mt-0.5 shrink-0" />
                  <div>
                    <div className="font-black text-rose-900 text-xs uppercase tracking-wide">Wrong Vehicle Scanned</div>
                    <div className="text-rose-700 font-medium text-[11px] mt-0.5">
                      <strong className="font-mono">VIN: SALWR2RV1JA123456</strong> is NOT assigned to this pickup. Please scan a vehicle from the list above or add it to your load first.
                    </div>
                  </div>
                </div>

                <button onClick={() => setWrongVehicleAlert(false)} className="text-rose-400 hover:text-rose-700 cursor-pointer p-1">
                  <FiX className="text-base" />
                </button>
              </div>
            )}

            {/* CONFIRMATION PROGRESS & BIG ORANGE BUTTON */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-xs">{pickedUpCount} of {totalCarsCount} Cars Picked Up</div>
                    <div className="text-slate-500 font-medium text-[11px]">You must pick up all {totalCarsCount} cars before you can DISPATCH.</div>
                  </div>
                </div>

                {/* Circular progress badge */}
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500 text-emerald-700 font-black text-xs flex items-center justify-center bg-white shadow-xs">
                  {progressPercent}%
                </div>
              </div>

              <button
                onClick={() => {
                  triggerToast('All cars verified! Redirecting to Active Run & Dispatch...');
                  setTimeout(() => navigate('/driver/active-run', { state: { autoOpenDispatchModal: true, fromPickup: true } }), 1000);
                }}
                className="w-full bg-[#f95700] hover:bg-[#e04f00] text-white font-black text-sm py-4 px-4 rounded-xl shadow-lg transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-lg" />
                  <span>CONFIRM ALL {totalCarsCount} CARS PICKED UP</span>
                </div>
                <span className="text-[10.5px] font-semibold opacity-90">This will complete pickup for this load and notify Dispatch & Customer.</span>
              </button>
            </div>

          </div>

        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* WHAT HAPPENS NEXT? */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WHAT HAPPENS NEXT?</div>
            <div className="space-y-3 font-semibold text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">✓</span>
                <div>
                  <div className="font-bold text-slate-900">Picked Up</div>
                  <div className="text-[11px] text-slate-500">All 8 cars picked up at this location.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full border-2 border-indigo-600 text-indigo-600 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">●</span>
                <div>
                  <div className="font-bold text-slate-900">Dispatch</div>
                  <div className="text-[11px] text-slate-500">Once pickup is complete, return to Active Run and tap DISPATCH when you leave the yard.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full border border-indigo-600 text-indigo-600 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">●</span>
                <div>
                  <div className="font-bold text-indigo-900">Delivered</div>
                  <div className="text-[11px] text-slate-500">Deliver each car at the correct location.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">○</span>
                <div>
                  <div className="font-bold text-slate-400">Completed</div>
                  <div className="text-[11px] text-slate-500">Once all drops are delivered, job is complete.</div>
                </div>
              </div>
            </div>
          </div>

          {/* REQUIREMENTS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REQUIREMENTS</div>
            <div className="space-y-2 font-semibold text-slate-700">
              <div className="flex items-center gap-2 text-emerald-600">
                <span>✓</span>
                <span>All 8 assigned cars must be picked up.</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <span>✓</span>
                <span>The correct cars only - wrong cars are blocked.</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <span>✓</span>
                <span>Capture delivery photos for each car.</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <span>✓</span>
                <span>Report any new damage before confirming.</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <span>✓</span>
                <span>Signature required only if company rule enabled.</span>
              </div>
            </div>
          </div>

          {/* AFTER-HOURS DELIVERY / NOTES CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AFTER-HOURS / PICKUP NOTES</div>
            <div className="space-y-2 font-semibold text-amber-900">
              <div className="flex items-center gap-2">
                <span>🎧</span>
                <span>No signature required.</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <span>✓</span>
                <span>GPS & Time Captured</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <span>✓</span>
                <span>Mandatory Photos</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <span>✓</span>
                <span>Key Drop / Location Notes</span>
              </div>
            </div>

            <div className="pt-2">
              <input
                type="text"
                placeholder="Add pickup notes..."
                value={pickupNotes}
                onChange={(e) => setPickupNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* QUICK ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QUICK ACTIONS</div>
            <div className="space-y-2">
              <button onClick={() => triggerToast('Calling Dispatcher hotline...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📞 Call Dispatch</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Yard Directions...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🗺️ Yard Map / Directions</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setJobDetailsModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📄 View Load Details</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>



      {/* ADD CAR FORM MODAL */}
      {addCarModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <form onSubmit={handleAddCarSubmit} className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Add New Car to Load</h3>
              <button type="button" onClick={() => setAddCarModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Target Drop Location</label>
                <select
                  value={newDrop}
                  onChange={(e) => setNewDrop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="DROP 1">DROP 1 - Auto World Sydney</option>
                  <option value="DROP 2">DROP 2 - Newcastle Motors</option>
                  <option value="DROP 3">DROP 3 - Brisbane Car Centre</option>
                  <option value="DROP 4">DROP 4 - Gold Coast Autos</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Make & Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BMW X5 2024"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">VIN Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WBA1234567890XYZ"
                  value={newVin}
                  onChange={(e) => setNewVin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium uppercase font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Registration Plate (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. NSW-889"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium uppercase"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md mt-2"
            >
              Add Car to Load
            </button>
          </form>
        </div>
      )}

      {/* SCAN VIN MODAL */}
      {scanVinModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-[160] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <BsQrCodeScan className="text-indigo-600 text-lg" />
                  Scan VIN Barcode
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Align VIN barcode inside camera frame or enter manually</p>
              </div>
              <button onClick={() => setScanVinModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer p-1 rounded-lg hover:bg-slate-100">✕</button>
            </div>

            {/* REALISTIC CAMERA VIEWFINDER BOX */}
            <div className={`relative border-2 rounded-2xl p-6 text-center space-y-3 transition-colors overflow-hidden ${
              flashlightOn ? 'bg-amber-500/10 border-amber-400' : 'bg-slate-950 border-indigo-500'
            }`}>
              
              {/* Camera Corner Overlay Lines */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-indigo-400"></div>
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-indigo-400"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-indigo-400"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-indigo-400"></div>

              {/* Laser Scanning Line */}
              <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse"></div>

              <BsQrCodeScan className={`text-5xl mx-auto animate-pulse ${flashlightOn ? 'text-amber-500' : 'text-emerald-400'}`} />
              
              <div className="text-xs font-black text-white tracking-wide">
                CAMERA SCANNER ACTIVE
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setFlashlightOn(!flashlightOn)}
                  className={`text-[10px] font-black px-3 py-1 rounded-full cursor-pointer transition-all ${
                    flashlightOn ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  ⚡ Flash: {flashlightOn ? 'ON' : 'OFF'}
                </button>
                <span className="text-[10px] text-slate-400 font-mono">1080p HD • Auto Focus</span>
              </div>
            </div>

            {/* QUICK VIN SELECTOR */}
            <div className="space-y-2 text-xs font-semibold">
              <label className="text-slate-700 font-bold block text-[11px]">Select Pending Vehicle to Scan:</label>
              <select
                value={scanVinInput}
                onChange={(e) => setScanVinInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Choose Car from Pickup List --</option>
                {cars.filter(c => !c.pickedUp).map(c => (
                  <option key={c.id} value={c.id}>
                    {c.makeModel} (VIN: {c.vin})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                let targetVin = null;
                let matchedCar = null;

                if (scanVinInput) {
                  matchedCar = cars.find(c => c.id === scanVinInput || c.id === parseInt(scanVinInput) || (c.vin && c.vin.toUpperCase() === scanVinInput.trim().toUpperCase()));
                  targetVin = matchedCar ? matchedCar.vin : scanVinInput.trim();
                } else {
                  matchedCar = cars.find(c => !c.pickedUp) || cars[0];
                  targetVin = matchedCar ? matchedCar.vin : '1HGCM82633A004352';
                }

                setScanVinModalOpen(false);
                setScanVinInput('');
                if (targetVin) {
                  handlePickupVinApi(targetVin, matchedCar);
                }
              }}
              disabled={isSubmitting}
              className={`w-full font-black text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                isSubmitting ? 'bg-slate-400 cursor-not-allowed text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
              }`}
            >
              <FiCheckCircle className="text-base" />
              <span>{isSubmitting ? 'Validating VIN...' : 'Simulate VIN Scan & Mark Picked Up'}</span>
            </button>

            <p className="text-center text-[10px] text-slate-500 font-semibold">
              Scanning automatically validates VIN against assigned load manifest LD-3987.
            </p>
          </div>
        </div>
      )}

      {/* HIDDEN FILE INPUT FOR REAL PHOTO UPLOAD */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* PHOTO INSPECTION MODAL */}
      {photoModalOpen && selectedCarForModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[180] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">{selectedCarForModal.makeModel}</h3>
                <p className="text-xs text-slate-500 font-medium">VIN: {selectedCarForModal.vin}</p>
              </div>
              <button onClick={() => setPhotoModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="text-xs font-bold text-slate-700 flex justify-between items-center">
              <span>Pickup Photos ({selectedCarForModal.photos.current}/4)</span>
              <span className="text-[10.5px] text-indigo-600 font-extrabold">Tap any slot to Upload/Capture</span>
            </div>

            {/* GALLERY GRID */}
            <div className="grid grid-cols-2 gap-3 py-2">
              {[1, 2, 3, 4].map((num) => {
                const photoMap = selectedCarForModal.photoUrls || {};
                const customPhoto = photoMap[num];
                const isUploaded = num <= selectedCarForModal.photos.current || !!customPhoto;
                const photoSrc = customPhoto || samplePhotos[(num - 1) % 4];

                return (
                  <div 
                    key={num} 
                    onClick={() => handleSlotClick(num, isUploaded)}
                    className={`h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden cursor-pointer transition-all ${
                      isUploaded 
                        ? 'border-emerald-500 shadow-md group' 
                        : 'border-indigo-300 bg-slate-50 hover:bg-indigo-50/60 hover:border-indigo-500 shadow-2xs'
                    }`}
                  >
                    {isUploaded ? (
                      <>
                        <img 
                          src={photoSrc} 
                          alt={`Photo #${num}`}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-black/20" />
                        
                        <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <span>✓ Photo #{num}</span>
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 text-white text-center">
                          <span className="text-[10px] font-mono font-bold block text-emerald-300 drop-shadow-xs">08:15 AM • GPS Verified</span>
                          <span className="text-[9.5px] font-extrabold text-rose-200 bg-rose-900/80 backdrop-blur-xs px-2 py-0.5 rounded-full inline-block mt-1 hover:bg-rose-600 hover:text-white transition-colors">
                            Tap to remove / retake
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-slate-500 space-y-1 p-2">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
                          <FiCamera className="text-lg text-indigo-600 animate-pulse" />
                        </div>
                        <span className="text-[11px] font-black text-slate-800 block mt-1">Tap to Capture #{num}</span>
                        <span className="text-[9.5px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full inline-block">
                          Camera / File Upload
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setPhotoModalOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl cursor-pointer"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JOB DETAILS MANIFEST MODAL */}
      {jobDetailsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[180] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">Load Manifest LD-3987</h3>
                <p className="text-xs text-slate-500 font-medium">Melbourne VIC ➔ Sydney NSW</p>
              </div>
              <button onClick={() => setJobDetailsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Pickup Location</span>
                  <span className="text-slate-900 font-black">ABC Car Yard, Melbourne</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Total Assigned Load</span>
                  <span className="text-slate-900 font-mono">8 Vehicles Total</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Primary Drop</span>
                  <span className="text-slate-900">Auto World Sydney</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Dispatch Hotline</span>
                  <span className="text-indigo-600">+61 400 123 456</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setJobDetailsModalOpen(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CAR MODAL */}
      {editCarModalOpen && editingCar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiEdit2 className="text-indigo-600 text-lg" />
                Edit Car Details
              </h3>
              <button onClick={() => { setEditCarModalOpen(false); setEditingCar(null); }} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Make & Model</label>
                <input
                  type="text"
                  value={editingCar.makeModel}
                  onChange={(e) => setEditingCar({ ...editingCar, makeModel: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">VIN Number</label>
                <input
                  type="text"
                  value={editingCar.vin}
                  onChange={(e) => setEditingCar({ ...editingCar, vin: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium uppercase font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Registration Plate</label>
                <input
                  type="text"
                  value={editingCar.plate}
                  onChange={(e) => setEditingCar({ ...editingCar, plate: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium uppercase"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setCars(cars.map(c => c.id === editingCar.id ? editingCar : c));
                setEditCarModalOpen(false);
                setEditingCar(null);
                triggerToast(`Saved details for ${editingCar.makeModel}!`);
              }}
              className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md mt-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
