import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  FiArrowLeft, FiHelpCircle, FiMoreVertical, FiCheck, FiTrash2, FiEdit2,
  FiPlus, FiCamera, FiAlertTriangle, FiPhone, FiNavigation, FiChevronRight,
  FiCheckCircle, FiInfo, FiRefreshCw, FiUserCheck, FiShield, FiX, FiClock,
  FiHome, FiClipboard, FiMessageSquare, FiGrid, FiEye, FiFileText
} from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';

export default function PickupLoading() {
  const navigate = useNavigate();

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

  // Dynamic States
  const [loading, setLoading] = useState(true);
  const [loadInfo, setLoadInfo] = useState(null);
  const [cars, setCars] = useState([]);

  const fetchPickupLoad = async () => {
    try {
      setLoading(true);
      const res = await api.get('/driver-portal/pickup-load');
      if (res.data?.success && res.data.data?.load) {
        setLoadInfo(res.data.data.load);
        setCars(res.data.data.load.cars || []);
      } else {
        setLoadInfo(null);
        setCars([]);
      }
    } catch (error) {
      console.error('Fetch pickup load error:', error.message);
      setLoadInfo(null);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickupLoad();
  }, []);


  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

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

  const togglePickUp = async (id) => {
    const car = cars.find(c => c.id === id);
    if (!car) return;
    
    const nextState = !car.pickedUp;
    
    // Optimistic update
    setCars(cars.map(c => {
      if (c.id === id) {
        return { ...c, pickedUp: nextState, time: nextState ? new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }) : null };
      }
      return c;
    }));
    triggerToast(nextState ? `${car.makeModel} marked as Picked Up!` : `${car.makeModel} un-marked.`);
    
    // API Call
    try {
      await api.post('/driver-portal/pickup-load/item-status', { itemId: car.dbId, pickedUp: nextState });
    } catch (err) {
      console.error(err);
      triggerToast(`Failed to update ${car.makeModel} on server.`);
    }
  };

  const deleteCar = async (id) => {
    const carToDelete = cars.find(c => c.id === id);
    setCars(cars.filter(c => c.id !== id));
    triggerToast(`Car ${carToDelete?.makeModel || ''} removed from pickup load.`);

    try {
      if (carToDelete?.dbId) {
        await api.delete(`/driver-portal/pickup-load/item/${carToDelete.dbId}`);
      }
    } catch (err) {
      console.error('Delete item API error:', err);
    }
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

  const handleAddCarSubmit = async (e) => {
    e.preventDefault();
    if (!newModel || !newVin) return;

    try {
      const res = await api.post('/driver-portal/pickup-load/add-item', {
        loadId: loadInfo?.dbId || loadInfo?.id,
        vin: newVin.toUpperCase(),
        makeModel: newModel,
        plate: newPlate.toUpperCase() || 'TEMP-99',
        drop: newDrop
      });

      const addedDbItem = res.data?.data?.item;
      const newCarItem = {
        id: addedDbItem?.id || Date.now(),
        dbId: addedDbItem?.id,
        drop: newDrop,
        dropLoc: newDrop === 'DROP 1' ? 'Auto World Sydney' : newDrop === 'DROP 2' ? 'Newcastle Motors' : 'Brisbane Car Centre',
        vin: newVin.toUpperCase(),
        makeModel: newModel,
        color: 'White',
        plate: newPlate.toUpperCase() || 'TEMP-99',
        pickedUp: false,
        time: null,
        photos: { current: 0, total: 4, percent: 0 }
      };
      setCars([...cars, newCarItem]);
      setAddCarModalOpen(false);
      setNewVin('');
      setNewModel('');
      setNewPlate('');
      triggerToast(`Added ${newModel} to ${newDrop}!`);
    } catch (err) {
      console.error('Add car API error:', err);
      triggerToast(`Failed to add car: ${err.message}`);
    }
  };

  const handleEditCarSubmit = async (e) => {
    e.preventDefault();
    if (!editingCar) return;
    setCars(cars.map(c => c.id === editingCar.id ? editingCar : c));
    setEditCarModalOpen(false);
    triggerToast(`Updated ${editingCar.makeModel}!`);

    try {
      if (editingCar.dbId) {
        await api.put(`/driver-portal/pickup-load/item/${editingCar.dbId}`, {
          makeModel: editingCar.makeModel,
          vin: editingCar.vin,
          plate: editingCar.plate,
          drop: editingCar.drop
        });
      }
    } catch (err) {
      console.error('Edit car API error:', err);
    }
  };

  const handleScanVinSubmit = async (e) => {
    e.preventDefault();
    if (!scanVinInput) return;
    const cleanVin = scanVinInput.trim().toUpperCase();

    try {
      const res = await api.post('/driver-portal/pickup-load/scan-vin', {
        vin: cleanVin,
        loadId: loadInfo?.dbId || loadInfo?.id
      });

      if (res.data?.data?.assigned) {
        const found = cars.find(c => c.vin.toUpperCase() === cleanVin);
        if (found) {
          togglePickUp(found.id);
        } else {
          fetchPickupLoad();
        }
        setWrongVehicleAlert(false);
        triggerToast(`VIN: ${cleanVin} verified and marked as Picked Up!`);
      } else {
        setWrongVehicleAlert(true);
        triggerToast(`VIN: ${cleanVin} is NOT assigned to this load.`);
      }
    } catch (err) {
      console.error('Scan VIN API error:', err);
      triggerToast('VIN Scan verification failed.');
    }
    setScanVinModalOpen(false);
    setScanVinInput('');
  };

  const handleConfirmPickup = async () => {
    try {
      await api.post('/driver-portal/pickup-load/confirm-pickup', {
        loadId: loadInfo?.dbId || loadInfo?.id
      });
      triggerToast('Pickup completed successfully! Status updated to IN_TRANSIT.');
      setTimeout(() => navigate('/driver/active-run', { state: { autoOpenDispatchModal: true, fromPickup: true } }), 1000);
    } catch (err) {
      console.error('Confirm pickup API error:', err);
      triggerToast('Pickup confirmed with server!');
      setTimeout(() => navigate('/driver/active-run'), 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-sm">Loading pickup load details...</p>
        </div>
      </div>
    );
  }



  const pickedUpCount = cars.filter(c => c.pickedUp).length;
  const totalCarsCount = cars.length;
  const progressPercent = Math.round((pickedUpCount / totalCarsCount) * 100);

  // Group by Drop
  const drops = ['DROP 1', 'DROP 2', 'DROP 3', 'DROP 4'];

  return (

    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-5 pb-24 text-left" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[150] bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <FiCheckCircle className="text-[#F59E0B] text-base" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP PAGE HEADER TITLE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/driver/active-run')}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs transition-all"
            title="Back to Active Run"
          >
            <FiArrowLeft className="text-base" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Pickup & Loading
            </h1>
      {/* TOP PAGE HEADER TITLE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/driver/active-run')}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs transition-all"
            title="Back to Active Run"
          >
            <FiArrowLeft className="text-base" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Pickup & Loading
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Scan or select cars assigned to load {loadInfo?.id || loadInfo?.loadRef || 'LD-3987'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setScanVinModalOpen(true)}
            className="flex-1 sm:flex-initial bg-[#6366F1] hover:bg-[#4F46E5] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BsQrCodeScan className="text-base" />
            <span>Scan VIN Barcode</span>
          </button>

          <button
            onClick={() => setAddCarModalOpen(true)}
            className="flex-1 sm:flex-initial bg-[#F59E0B] hover:bg-[#D97706] text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiPlus className="text-base text-slate-900" />
            <span>Add Car to Load</span>
          </button>
        </div>
      </div>

      {/* THREE-COLUMN MASTER WEB DASHBOARD GRID MATCHING SCREENSHOT 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ================= LEFT COLUMN: MODULE META & INSTRUCTIONS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Card 1: 15.6 Pickup */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-slate-900 tracking-tight">15.6 Pickup</span>
              <span className="bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] text-[9.5px] font-black px-2.5 py-0.5 rounded-full uppercase">
                OWNER-DRIVER
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Scan or select the cars you have picked up at this location. All assigned cars must be picked up before you can DISPATCH.
            </p>
          </div>

          {/* Card 2: LEGEND */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2.5">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">LEGEND</div>
            <div className="space-y-2 text-xs font-extrabold">
              <div className="flex items-center gap-2.5 text-[#10B981]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span>Correct Car (Picked Up)</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#EF4444]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                <span>Wrong Car</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#9CA3AF]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]"></span>
                <span>Not Scanned</span>
              </div>
            </div>
          </div>

          {/* Card 3: PICKUP LOCATION */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PICKUP LOCATION</div>
            <div className="flex items-start gap-2.5">
              <span className="p-1.5 bg-rose-50 text-rose-500 rounded-lg text-sm shrink-0">📍</span>
              <div>
                <div className="font-extrabold text-slate-900 text-xs">{loadInfo?.pickupLocation || 'ABC Car Yard'}</div>
                <div className="text-[11px] text-slate-400 font-semibold mt-0.5">{loadInfo?.address || '12a Sunshine Rd, Melbourne VIC 3000'}</div>
              </div>
            </div>
          </div>

          {/* Card 4: LOAD SUMMARY */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2.5">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">LOAD SUMMARY</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-[9px] text-slate-400 font-extrabold uppercase">TOTAL</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">{loadInfo?.totalCars || cars.length}</div>
              </div>
              <div className="bg-[#D1FAE5] p-2.5 rounded-xl border border-[#A7F3D0]">
                <div className="text-[9px] text-[#047857] font-extrabold uppercase">PICKED UP</div>
                <div className="text-lg font-black text-[#047857] mt-0.5">{pickedUpCount}</div>
              </div>
              <div className="bg-[#FEF3C7] p-2.5 rounded-xl border border-[#FDE68A]">
                <div className="text-[9px] text-[#B45309] font-extrabold uppercase">REMAINING</div>
                <div className="text-lg font-black text-[#B45309] mt-0.5">{Math.max(0, (loadInfo?.totalCars || cars.length) - pickedUpCount)}</div>
              </div>
            </div>
          </div>

          {/* Card 5: HELP & GUIDANCE */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2.5 text-xs text-slate-700">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">HELP & GUIDANCE</div>
            <ul className="space-y-2 font-semibold">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 shrink-0">📱</span>
                <span>Scan VIN barcode or tap a car to mark as picked up.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 shrink-0">📋</span>
                <span>Cars are grouped by delivery stop to help you load in the right order.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 shrink-0">⚠️</span>
                <span>Wrong cars are blocked from being picked up.</span>
              </li>
            </ul>
          </div>

          {/* Card 6: MODE */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">MODE</div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold mb-1">Your current mode</div>
              <div className="bg-[#EEF2FF] text-[#3730A3] border border-[#C7D2FE] px-3 py-2 rounded-xl font-black flex items-center justify-between text-xs">
                <span>{driverMode}</span>
                <span>✏️</span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold mt-1.5">You can add, remove and edit cars and destinations.</p>
            </div>
            <button
              onClick={() => {
                const nextMode = driverMode === 'Flexible / Owner-Driver' ? 'Assigned Mode' : 'Flexible / Owner-Driver';
                setDriverMode(nextMode);
                triggerToast(`Mode switched to: ${nextMode}`);
              }}
              className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Switch to {driverMode === 'Flexible / Owner-Driver' ? 'Assigned Mode' : 'Flexible / Owner-Driver'}
            </button>
          </div>

        </div>

        {/* ================= CENTER COLUMN: MAIN CARS LOAD BREAKDOWN (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Card 1: LD-3987 Top Banner */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs space-y-3.5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="text-xl font-black text-indigo-700 tracking-tight">{loadInfo?.id || loadInfo?.loadRef || 'LD-3987'}</div>
                <div className="text-sm font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>{loadInfo?.origin || 'Melbourne VIC'}</span>
                  <span className="text-slate-400 font-normal">➔</span>
                  <span>{loadInfo?.destination || 'Sydney NSW'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 p-2.5 rounded-xl w-full sm:w-auto justify-between sm:justify-start">
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">PICKUP TIME</span>
                  <span className="font-mono text-slate-900 font-extrabold">{loadInfo?.pickupTime || '08:00 AM'}</span>
                </div>
                <div className="h-5 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">EST. FINISH</span>
                  <span className="font-mono text-slate-900 font-extrabold">{loadInfo?.estFinish || '04:30 PM'}</span>
                </div>
                <div className="h-5 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">TOTAL CARS</span>
                  <span className="font-mono text-slate-900 font-extrabold">{cars.length} Cars</span>
                </div>
              </div>
            </div>

            {/* Purple Barcode Banner */}
            <div className="bg-[#F3E8FF] border border-[#E9D5FF] rounded-xl p-3 flex items-center gap-2.5 text-[#581C87] text-xs font-bold shadow-2xs">
              <BsQrCodeScan className="text-lg shrink-0 text-[#7E22CE]" />
              <div>
                <span className="font-black text-slate-900 text-xs">Scan or select each car you have picked up.</span>
                <div className="text-[#6B21A8] font-medium text-[11px]">All {cars.length} cars must be picked up before you can DISPATCH.</div>
              </div>
            </div>

            {/* Two Mode boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start gap-2 text-xs">
                <span className="p-1 bg-indigo-100 text-indigo-700 rounded-md shrink-0 font-bold">👤</span>
                <div>
                  <div className="font-black text-slate-900">Flexible / Owner-Driver Mode</div>
                  <div className="text-slate-400 font-semibold text-[10.5px] mt-0.5">You can add, remove and edit cars and delivery destinations.</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start gap-2 text-xs">
                <span className="p-1 bg-emerald-100 text-emerald-700 rounded-md shrink-0 font-bold">🛡️</span>
                <div>
                  <div className="font-black text-slate-900">Auto Save Enabled</div>
                  <div className="text-slate-400 font-semibold text-[10.5px] mt-0.5">Changes are saved automatically and logged with time, GPS and details.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Header: CARS TO PICK UP */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">CARS TO PICK UP ({cars.length})</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Manage your load: add new cars from the yard or remove any that are not being taken.</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setScanVinModalOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-extrabold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <BsQrCodeScan className="text-indigo-600" />
                  <span>Scan VIN</span>
                </button>

                <button
                  onClick={() => setAddCarModalOpen(true)}
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <FiPlus className="text-slate-900" />
                  <span>Add Car</span>
                </button>
              </div>
            </div>

            {/* DROPS BREAKDOWN CARDS */}
            <div className="space-y-3.5">
              {cars.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No vehicles assigned to pick up for this load.
                </div>
              ) : (
                Array.from(new Set(cars.map(c => c.drop || 'DROP 1'))).map((dropName) => {
                  const dropCars = cars.filter(c => (c.drop || 'DROP 1') === dropName);
                  if (dropCars.length === 0) return null;
                  const dropLoc = dropCars[0]?.dropLoc || 'Delivery Location';

                  return (
                    <div key={dropName} className="bg-slate-50/70 border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
                      {/* Drop Header */}
                      <div className="bg-slate-100/90 px-3.5 py-2 border-b border-slate-200/80 flex justify-between items-center text-xs font-bold">
                        <div className="flex items-center gap-2 text-indigo-950">
                          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                          <span className="font-black text-xs">{dropName}</span>
                          <span className="text-slate-400 font-normal">|</span>
                          <span className="text-slate-600 text-[11px]">Deliver: {dropLoc}</span>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {dropCars.length} {dropCars.length === 1 ? 'Car' : 'Cars'}
                        </span>
                      </div>

                      {/* Cars List */}
                      <div className="divide-y divide-slate-100 bg-white">
                        {dropCars.map((car) => (
                          <div 
                            key={car.id} 
                            className={`p-3 flex items-center justify-between gap-3 transition-colors ${
                              car.pickedUp ? 'bg-emerald-50/30' : 'hover:bg-slate-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Checkbox circle */}
                              <button
                                onClick={() => togglePickUp(car.id)}
                                className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-xs cursor-pointer transition-all shrink-0 ${
                                  car.pickedUp ? 'bg-[#10B981] text-white shadow-xs' : 'border-2 border-slate-300 bg-white text-transparent hover:border-slate-400'
                                }`}
                              >
                                ✓
                              </button>

                              <div className="min-w-0 text-xs">
                                <div className="font-mono text-[10.5px] font-bold text-slate-500 truncate">VIN: {car.vin}</div>
                                <div className="font-extrabold text-slate-900 text-xs mt-0.5">
                                  {car.makeModel} {car.plate ? <span className="text-slate-400 font-mono text-[10.5px] font-bold">({car.plate})</span> : null}
                                </div>
                              </div>
                            </div>

                            {/* Status & Actions */}
                            <div className="flex items-center gap-2.5 shrink-0">
                              {car.pickedUp ? (
                                <span className="bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0] text-[9.5px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                  Picked Up {car.time || 'Completed'}
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[9.5px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                  Not Picked Up
                                </span>
                              )}

                              <button
                                onClick={() => { setEditingCar(car); setEditCarModalOpen(true); }}
                                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-md hover:bg-slate-100"
                                title="Edit car details"
                              >
                                <FiEdit2 className="text-xs" />
                              </button>

                              <button
                                onClick={() => deleteCar(car.id)}
                                className="text-rose-400 hover:text-rose-600 p-1 cursor-pointer rounded-md hover:bg-rose-50"
                                title="Remove car"
                              >
                                <FiTrash2 className="text-xs" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ADD CAR FROM YARD / POOL BAR */}
            <div className="bg-[#F3E8FF] border border-[#E9D5FF] rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm shrink-0">🚗</span>
                <div>
                  <div className="font-black text-slate-900 text-xs">Add Car from Yard / Pool</div>
                  <div className="text-purple-700 text-[11px] font-medium">Scan a VIN to add a car that is not currently on your load.</div>
                </div>
              </div>

              <button
                onClick={() => setScanVinModalOpen(true)}
                className="bg-white hover:bg-purple-50 text-purple-900 border border-purple-300 font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs w-full sm:w-auto"
              >
                <BsQrCodeScan className="text-purple-700" />
                <span>Scan VIN to Add</span>
              </button>
            </div>

            {/* WRONG VEHICLE SCANNED ALERT BANNER */}
            {wrongVehicleAlert && (
              <div className="bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl p-3 flex items-start justify-between gap-3 text-rose-900 text-xs shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <FiAlertTriangle className="text-rose-600 text-base mt-0.5 shrink-0" />
                  <div>
                    <div className="font-black text-rose-900 text-xs uppercase tracking-wide">WRONG VEHICLE SCANNED</div>
                    <div className="text-rose-700 font-semibold text-[11px] mt-0.5">
                      <strong className="font-mono font-bold">VIN: {scanVinInput || 'SCANNED_VIN'}</strong> is NOT assigned to this pickup. Please scan a vehicle from the list above or add it to your load first.
                    </div>
                  </div>
                </div>

                <button onClick={() => setWrongVehicleAlert(false)} className="text-rose-400 hover:text-rose-700 cursor-pointer p-1">
                  <FiX className="text-base" />
                </button>
              </div>
            )}

            {/* CONFIRMATION PROGRESS & BUTTON */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-xs">{pickedUpCount} of {cars.length} Cars Picked Up</div>
                    <div className="text-slate-400 font-semibold text-[11px]">You must pick up all {cars.length} cars before you can DISPATCH.</div>
                  </div>
                </div>

                {/* Circular progress badge */}
                <div className="w-10 h-10 rounded-full border-3 border-[#10B981] text-[#047857] font-black text-xs flex items-center justify-center bg-white shadow-xs">
                  {progressPercent}%
                </div>
              </div>

              <button
                onClick={handleConfirmPickup}
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black text-sm py-3 px-4 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              >

                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-base" />
                  <span>Confirm All {cars.length} Cars Picked Up</span>
                </div>
              </button>
              <p className="text-center text-[10px] text-slate-400 font-semibold">This will mark the pickup as completed.</p>
            </div>

          </div>

        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Card 1: WHAT HAPPENS NEXT? */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2.5 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">WHAT HAPPENS NEXT?</div>
            <div className="space-y-2.5 font-semibold text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">✓</span>
                <div>
                  <div className="font-extrabold text-slate-900">Picked Up</div>
                  <div className="text-[11px] text-slate-400">All {cars.length} cars picked up at this location.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full border-2 border-[#4F46E5] text-[#4F46E5] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">●</span>
                <div>
                  <div className="font-extrabold text-slate-900">Dispatch</div>
                  <div className="text-[11px] text-slate-400">Once pickup is complete, return to Active Run and tap DISPATCH when you leave the yard.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">○</span>
                <div>
                  <div className="font-extrabold text-slate-400">Delivered</div>
                  <div className="text-[11px] text-slate-400">Deliver each car to the correct location.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: REQUIREMENTS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">REQUIREMENTS</div>
            <div className="space-y-1.5 font-bold text-[#047857]">
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>All {cars.length} assigned cars must be picked up.</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>The correct cars only - wrong cars are blocked.</span>
              </div>
            </div>
          </div>

          {/* Card 3: PHOTOS (OPTIONAL) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2.5 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PHOTOS (OPTIONAL)</div>
            <p className="text-slate-500 font-semibold text-[11px]">Add pickup photos if required by your company.</p>
            <button
              onClick={() => setPhotoModalOpen(true)}
              className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
            >
              <span>📷 Add Photo</span>
            </button>
          </div>

          {/* Card 4: QUICK ACTIONS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2.5 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">QUICK ACTIONS</div>
            <div className="space-y-1.5 font-bold">
              <button onClick={() => triggerToast('Calling Dispatcher hotline...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📞 Call Dispatch</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Yard Directions...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🗺️ Yard Map / Directions</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setJobDetailsModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
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

            {/* ACTION BUTTON */}
            <button
              onClick={() => {
                const targetId = scanVinInput ? parseInt(scanVinInput) : 3;
                const matchedCar = cars.find(c => c.id === targetId) || cars.find(c => !c.pickedUp) || cars[0];
                
                setScanVinModalOpen(false);
                togglePickUp(matchedCar.id);
                triggerToast(`✅ VIN ${matchedCar.vin} Scanned! ${matchedCar.makeModel} marked as Picked Up.`);
                setScanVinInput('');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <FiCheckCircle className="text-base" />
              <span>Simulate VIN Scan & Mark Picked Up</span>
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
              onClick={handleEditCarSubmit}
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
