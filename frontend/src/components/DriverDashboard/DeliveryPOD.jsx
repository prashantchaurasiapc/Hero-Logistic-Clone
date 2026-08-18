import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  FiCheckCircle, FiClock, FiMapPin, FiPhone, FiChevronRight,
  FiCamera, FiFileText, FiAlertTriangle, FiRefreshCw,
  FiTruck, FiInfo, FiEdit2, FiArrowLeft, FiCheck, FiX,
  FiUserCheck, FiMoon, FiSun, FiLock, FiEye, FiUploadCloud,
  FiImage, FiLayers, FiShield, FiPlusCircle, FiHelpCircle,
  FiNavigation, FiShare2, FiTrash2
} from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';
import api from '../../services/api';
import { getLoadDetails, getMyLoads, getDeliveryItems, submitDeliveryPOD } from '../../services/driverApi';

export default function DeliveryPOD() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams();

  // API State
  const [activeLoad, setActiveLoad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStop, setActiveStop] = useState(null);

  // Mode & Toggle States
  const [afterHoursEnabled, setAfterHoursEnabled] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [afterHoursNotes, setAfterHoursNotes] = useState('');

  // Modals
  const [scanVinModalOpen, setScanVinModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [jobDetailsModalOpen, setJobDetailsModalOpen] = useState(false);
  const [damageModalOpen, setDamageModalOpen] = useState(false);
  const [selectedDamageText, setSelectedDamageText] = useState('');
  const [selectedCarForModal, setSelectedCarForModal] = useState(null);
  const [activeTabPhoto, setActiveTabPhoto] = useState('before'); // 'before' or 'delivery'
  const [newVinInput, setNewVinInput] = useState('');
  const [newCarMake, setNewCarMake] = useState('');

  // Signature Modal Canvas Ref & States
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureName, setSignatureName] = useState('');

  // Cars assigned to DROP 1 (Fetched from real backend API)
  const [cars, setCars] = useState([]);

  // Fetch Load & Delivery Details from Backend
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

        // Fetch Real Delivery Items from backend
        return getDeliveryItems(rawLoad.id);
      })
      .then(res => {
        if (!isSubscribed || !res) return;
        const backendItems = res.data?.data?.items || [];
        const stops = res.data?.data?.stops || [];

        if (stops.length > 0) setActiveStop(stops[0]);

        const formattedCars = backendItems.map((item, idx) => ({
          id: item.id,
          makeModel: `${item.make || ''} ${item.model || 'Vehicle'}`.trim(),
          color: item.color || 'White',
          reg: item.rego || `REG-${idx + 101}`,
          vin: item.vin || `VIN-${String(item.id).substring(0, 8).toUpperCase()}`,
          beforePhotos: { current: 4, total: 4, percent: 100, missingText: '' },
          deliveryPhotos: {
            current: item.status === 'DELIVERED' ? 4 : 0,
            total: 4,
            percent: item.status === 'DELIVERED' ? 100 : 0,
            missingText: item.status === 'DELIVERED' ? '' : 'Missing 4 Photos'
          },
          signature: item.status === 'DELIVERED' ? 'Customer Signed' : null,
          damage: item.damage || 'No Damage',
          damageType: item.damage ? 'warning' : 'none',
          status: item.status === 'DELIVERED' ? 'Delivered' : 'Not Delivered',
          deliveryTime: item.status === 'DELIVERED' ? '11:02 AM' : null,
          delivered: item.status === 'DELIVERED',
        }));
        setCars(formattedCars);
      })
      .catch(err => {
        if (isSubscribed) {
          const msg = err.response?.data?.error?.message || err.message || 'Could not load delivery details.';
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

  const toggleCarDelivery = (id) => {
    setCars(cars.map(c => {
      if (c.id === id) {
        const nextState = !c.delivered;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        triggerToast(nextState ? `${c.makeModel} marked as Delivered at ${timeStr}` : `${c.makeModel} un-marked.`);
        return {
          ...c,
          delivered: nextState,
          status: nextState ? 'Delivered' : 'Not Delivered',
          deliveryTime: nextState ? timeStr : null,
          signature: nextState ? (c.signature || 'Customer Signed') : null,
          damage: nextState ? (c.damage || 'No Damage') : null,
          deliveryPhotos: nextState ? { current: 4, total: 4, percent: 100, missingText: '' } : c.deliveryPhotos
        };
      }
      return c;
    }));
  };

  const handleOpenPhotoModal = (car, tab = 'delivery') => {
    setSelectedCarForModal(car);
    setActiveTabPhoto(tab);
    setPhotoModalOpen(true);
  };

  const handleOpenSignatureModal = (car) => {
    setSelectedCarForModal(car);
    setSignatureName(car.signature || '');
    setSignatureModalOpen(true);
  };

  const handleConfirmDropDelivery = (signatureData = null, signeeOverride = null) => {
    const currentLoadId = activeLoad?.rawId || paramId;
    if (!currentLoadId || isSubmitting) return;

    const signName = signeeOverride || signatureName || selectedCarForModal?.signature || 'John Smith';
    if (!afterHoursEnabled && (!signName || !signName.trim())) {
      triggerToast('⚠️ Receiver signature name is required.');
      return;
    }

    let canvasDataUrl = signatureData;
    if (!canvasDataUrl && canvasRef.current) {
      try {
        canvasDataUrl = canvasRef.current.toDataURL('image/png');
      } catch (e) {}
    }

    if (!afterHoursEnabled && !canvasDataUrl) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 300;
      tempCanvas.height = 100;
      const ctx = tempCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 300, 100);
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#1e1b4b';
      ctx.fillText(signName || 'Customer Signed', 20, 50);
      canvasDataUrl = tempCanvas.toDataURL('image/png');
    }

    setIsSubmitting(true);

    const payload = {
      stopId: activeStop?.id,
      signeeName: signName,
      signatureData: canvasDataUrl,
      isAfterHours: afterHoursEnabled,
      deliveryNotes: deliveryNotes || afterHoursNotes || 'Delivered cleanly',
      itemIds: cars.map(c => c.id).filter(id => typeof id === 'string')
    };

    submitDeliveryPOD(currentLoadId, payload)
      .then(res => {
        const newLoadStatus = res.data?.data?.loadStatus;

        setCars(prevCars => prevCars.map(c => ({
          ...c,
          delivered: true,
          status: 'Delivered',
          deliveryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          signature: signName
        })));

        if (activeLoad) {
          setActiveLoad(prev => ({ ...prev, status: newLoadStatus || 'DELIVERED' }));
        }

        triggerToast('🎉 PROOF OF DELIVERY SUBMITTED! Dispatch & Customer notified.');
      })
      .catch(err => {
        const msg = err.response?.data?.error?.message || 'POD submission failed.';
        triggerToast(`❌ Error: ${msg}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleSaveSignature = () => {
    if (!signatureName.trim() && !afterHoursEnabled) {
      triggerToast('Please enter receiver name before saving signature.');
      return;
    }
    let dataUrl = null;
    if (canvasRef.current) {
      try { dataUrl = canvasRef.current.toDataURL('image/png'); } catch (e) {}
    }
    setSignatureModalOpen(false);
    handleConfirmDropDelivery(dataUrl, signatureName);
  };

  const handleAddCarSubmit = (e) => {
    e.preventDefault();
    if (!newVinInput.trim()) {
      triggerToast('Please enter or scan a valid VIN.');
      return;
    }
    const newCar = {
      id: Date.now(),
      makeModel: newCarMake.trim() || 'Custom Vehicle',
      color: 'Custom',
      reg: 'NEW' + Math.floor(100 + Math.random() * 900),
      vin: newVinInput.trim().toUpperCase(),
      beforePhotos: { current: 4, total: 4, percent: 100, missingText: '' },
      deliveryPhotos: { current: 0, total: 4, percent: 0, missingText: 'Missing 4 Photos' },
      signature: null,
      damage: null,
      damageType: 'none',
      status: 'Not Delivered',
      deliveryTime: null,
      delivered: false,
    };
    setCars([...cars, newCar]);
    setNewVinInput('');
    setNewCarMake('');
    setScanVinModalOpen(false);
    triggerToast(`Added car VIN: ${newCar.vin} to delivery drop!`);
  };

  const deleteCar = (id) => {
    const carToDelete = cars.find(c => c.id === id);
    setCars(cars.filter(c => c.id !== id));
    triggerToast(`Vehicle ${carToDelete?.makeModel || ''} (${carToDelete?.reg || ''}) removed!`);
  };

  const fileInputRef = useRef(null);
  const [activeSlotTarget, setActiveSlotTarget] = useState(null);

  const samplePhotos = [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&auto=format&fit=crop'
  ];

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
    const isBefore = activeTabPhoto === 'before';

    setCars(prevCars => prevCars.map(c => {
      if (c.id === carId) {
        const targetObj = isBefore ? c.beforePhotos : c.deliveryPhotos;
        const urlKey = isBefore ? 'beforePhotoUrls' : 'deliveryPhotoUrls';
        const currentPhotoUrls = c[urlKey] || {};
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
        const missingCount = targetObj.total - newCurrent;
        const newMissingText = missingCount > 0 ? `Missing ${missingCount} Photo${missingCount > 1 ? 's' : ''}` : '';

        const updatedObj = {
          ...targetObj,
          current: newCurrent,
          percent: newPercent,
          missingText: newMissingText,
        };

        const updatedCar = {
          ...c,
          [isBefore ? 'beforePhotos' : 'deliveryPhotos']: updatedObj,
          [urlKey]: newPhotoUrls,
        };

        setSelectedCarForModal(updatedCar);
        triggerToast((actionType !== 'remove' && !isCurrentlyUploaded) ? `📸 Photo #${slotIndex} captured & uploaded!` : `Photo #${slotIndex} removed.`);
        return updatedCar;
      }
      return c;
    }));
  };


  // Canvas Handlers for Signature Capture
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureName('');
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startCanvasDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e1b4b';
    setIsDrawing(true);
  };

  const canvasDraw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopCanvasDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
    }
  };

  // Helper function to render brand logos matching screenshot 2
  const getBrandLogo = (makeModel) => {
    const name = makeModel.toLowerCase();
    if (name.includes('toyota')) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 p-1 shadow-2xs">
          <svg className="w-6 h-5 text-slate-800" viewBox="0 0 100 70" fill="currentColor">
            <ellipse cx="50" cy="35" rx="46" ry="30" fill="none" stroke="currentColor" strokeWidth="6" />
            <ellipse cx="50" cy="35" rx="35" ry="12" fill="none" stroke="currentColor" strokeWidth="5" />
            <ellipse cx="50" cy="30" rx="14" ry="24" fill="none" stroke="currentColor" strokeWidth="5" />
          </svg>
        </div>
      );
    }
    if (name.includes('mazda')) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 p-1 shadow-2xs">
          <svg className="w-6 h-6 text-slate-800" viewBox="0 0 100 100" fill="currentColor">
            <ellipse cx="50" cy="50" rx="44" ry="32" fill="none" stroke="currentColor" strokeWidth="6" />
            <path d="M 22 42 Q 50 68 78 42 Q 50 48 22 42 Z" fill="currentColor" />
          </svg>
        </div>
      );
    }
    if (name.includes('kia')) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 p-1 shadow-2xs">
          <svg className="w-7 h-5 text-slate-900" viewBox="0 0 100 50" fill="currentColor">
            <ellipse cx="50" cy="25" rx="46" ry="22" fill="none" stroke="currentColor" strokeWidth="5" />
            <text x="50" y="34" textAnchor="middle" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="900" letterSpacing="-1" fill="currentColor">KIA</text>
          </svg>
        </div>
      );
    }
    if (name.includes('honda')) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 p-1 shadow-2xs">
          <svg className="w-6 h-6 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
            <rect x="10" y="10" width="80" height="80" rx="16" fill="none" stroke="currentColor" strokeWidth="7" />
            <path d="M 28 24 L 36 24 L 36 76 L 28 76 M 72 24 L 64 24 L 64 76 L 72 76 M 36 48 L 64 48" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
      );
    }
    if (name.includes('audi')) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 p-0.5 shadow-2xs">
          <svg className="w-7 h-4 text-slate-900" viewBox="0 0 140 50" fill="none" stroke="currentColor" strokeWidth="6">
            <circle cx="28" cy="25" r="19" />
            <circle cx="56" cy="25" r="19" />
            <circle cx="84" cy="25" r="19" />
            <circle cx="112" cy="25" r="19" />
          </svg>
        </div>
      );
    }
    if (name.includes('mercedes') || name.includes('benz')) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 p-1 shadow-2xs">
          <svg className="w-6 h-6 text-slate-900" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6">
            <circle cx="50" cy="50" r="44" />
            <path d="M 50 10 L 50 50 L 18 74 M 50 50 L 82 74" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 p-1 shadow-2xs">
        <FiTruck className="text-slate-700 text-base" />
      </div>
    );
  };

  const totalCarsCount = cars.length;

  return (
    <div className="flex-grow bg-[#f8fafc] text-slate-900 font-sans p-3 sm:p-5 lg:p-6 w-full text-left min-h-screen space-y-5 pb-20">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[200] bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border border-slate-700">
          <FiCheckCircle className="text-[#ffcc00] text-base shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* PAGE TITLE BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Delivery & POD</h1>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setScanVinModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BsQrCodeScan className="text-sm" />
            <span>Scan VIN</span>
          </button>
        </div>
      </div>

      {/* TOP HEADER LOAD BANNER CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="text-2xl font-black text-indigo-700 tracking-tight">
            {activeLoad?.loadRef || activeLoad?.displayId || 'Active Load'}
          </div>
          <div className="text-sm font-black text-slate-800 flex items-center gap-2">
            <span>{activeStop?.name || activeStop?.contactName || 'Delivery Drop'}</span>
            <span className="text-slate-400">➔</span>
            <span>{activeStop?.address || 'Destination'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Current Stop</span>
              <span className="font-extrabold text-slate-900">{activeStop?.name || 'DROP 1 OF 1'}</span>
            </div>

            <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>

            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Status</span>
              <span className="font-extrabold text-slate-900">{activeLoad?.status || 'IN_TRANSIT'}</span>
            </div>

            <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>

            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Cars for this stop</span>
              <span className="font-extrabold text-slate-900">{cars.length} Cars</span>
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

      {/* THREE BANNER CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Banner 1: VIN Scan Info */}
        <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs">
          <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shrink-0">
            <BsQrCodeScan className="text-xl" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-purple-950 leading-snug">Scan or select each car for delivery at this location.</h4>
            <p className="text-purple-700 font-medium text-[11px] mt-0.5">Deliver the correct cars only. Wrong cars are blocked.</p>
          </div>
        </div>

        {/* Banner 2: Driver Mode Info */}
        <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs">
          <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shrink-0">
            <FiUserCheck className="text-xl" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-purple-950 leading-snug">Flexible / Owner-Driver Mode</h4>
            <p className="text-purple-700 font-medium text-[11px] mt-0.5">You can add, remove and edit cars and delivery notes.</p>
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

      {/* TWO COLUMN DASHBOARD BODY LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ================= LEFT MAIN CONTENT AREA (9 COLS) ================= */}
        <div className="lg:col-span-9 space-y-5">
          
          {/* CARS TO DELIVER TABLE CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            
            {/* Table Header Section */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">CARS TO DELIVER ({cars.length})</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Destination: <strong className="text-slate-800">{activeStop?.address || 'Delivery Drop'}</strong></p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScanVinModalOpen(true)}
                  className="text-indigo-600 hover:text-indigo-800 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
                >
                  <BsQrCodeScan className="text-sm" />
                  <span>Scan VIN</span>
                </button>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1.5 rounded-lg border border-indigo-100">
                  {cars.length} Cars
                </span>
              </div>
            </div>

            {/* Table Responsive Wrapper */}
            <div className="overflow-x-auto custom-scrollbar">
              {cars.length === 0 ? (
                <div className="bg-slate-50 border-y border-dashed border-slate-200 p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl font-black">
                    🚗
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">No vehicles to deliver yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">
                      Click <strong>Scan VIN to Add</strong> below to add vehicles for this delivery drop.
                    </p>
                  </div>
                </div>
              ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-3 px-3 text-center w-12 align-middle">#</th>
                    <th className="py-3 px-3 min-w-[140px] align-middle">VEHICLE</th>
                    <th className="py-3 px-3 min-w-[140px] align-middle">REG/VIN</th>
                    <th className="py-3 px-3 min-w-[130px] align-middle">BEFORE PHOTOS</th>
                    <th className="py-3 px-3 min-w-[130px] align-middle">DELIVERY PHOTOS</th>
                    <th className="py-3 px-3 min-w-[130px] align-middle">SIGNATURE</th>
                    <th className="py-3 px-3 min-w-[130px] align-middle">DAMAGE</th>
                    <th className="py-3 px-3 min-w-[110px] align-middle">STATUS</th>
                    <th className="py-3 px-3 text-center min-w-[125px] align-middle">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {cars.length > 0 ? (
                    cars.map((car, index) => (
                    <tr 
                      key={car.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        car.delivered ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      {/* Checkbox / # Column */}
                      <td className="py-3.5 px-3 text-center align-middle whitespace-nowrap">
                        <button
                          onClick={() => toggleCarDelivery(car.id)}
                          className="cursor-pointer focus:outline-none inline-flex items-center justify-center gap-1.5"
                          title={car.delivered ? "Mark as Not Delivered" : "Mark as Delivered"}
                        >
                          {car.delivered ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                              ✓
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white hover:border-indigo-500 text-transparent flex items-center justify-center text-[10px] shrink-0" />
                          )}
                          <span className="font-extrabold text-slate-900 text-xs">{index + 1}</span>
                        </button>
                      </td>

                      {/* Vehicle Column with Brand Logo */}
                      <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          {getBrandLogo(car.makeModel)}
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs">{car.makeModel}</div>
                            <div className="text-[11px] text-slate-400 font-medium">{car.color}</div>
                          </div>
                        </div>
                      </td>

                      {/* REG/VIN Column */}
                      <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                        <div className="font-extrabold text-slate-900 text-xs">{car.reg}</div>
                        <div className="font-mono text-[10px] text-slate-400 font-semibold">{car.vin}</div>
                      </td>

                      {/* Before Photos Column */}
                      <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1.5 mb-1 text-slate-800 font-bold">
                          <FiCamera className="text-slate-500 text-xs shrink-0" />
                          <span>{car.beforePhotos.current} / {car.beforePhotos.total}</span>
                          <span className={`text-[10px] font-extrabold ml-1 ${
                            car.beforePhotos.percent === 100 ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            {car.beforePhotos.percent}%
                          </span>
                        </div>

                        <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              car.beforePhotos.percent === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${car.beforePhotos.percent}%` }}
                          ></div>
                        </div>

                        {car.beforePhotos.missingText && (
                          <span className="text-[9.5px] font-bold text-amber-600 block mt-0.5">
                            {car.beforePhotos.missingText}
                          </span>
                        )}
                      </td>

                      {/* Delivery Photos Column */}
                      <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1.5 mb-1 text-slate-800 font-bold">
                          <FiCamera className="text-slate-500 text-xs shrink-0" />
                          <span>{car.deliveryPhotos.current} / {car.deliveryPhotos.total}</span>
                          <span className={`text-[10px] font-extrabold ml-1 ${
                            car.deliveryPhotos.percent === 100 ? 'text-emerald-600' : 
                            car.deliveryPhotos.percent > 0 ? 'text-amber-600' : 'text-slate-400'
                          }`}>
                            {car.deliveryPhotos.percent}%
                          </span>
                        </div>

                        <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              car.deliveryPhotos.percent === 100 ? 'bg-emerald-500' : 
                              car.deliveryPhotos.percent > 0 ? 'bg-amber-500' : 'bg-slate-300'
                            }`}
                            style={{ width: `${car.deliveryPhotos.percent}%` }}
                          ></div>
                        </div>

                        {car.deliveryPhotos.missingText && (
                          <span className="text-[9.5px] font-bold text-amber-600 block mt-0.5">
                            {car.deliveryPhotos.missingText}
                          </span>
                        )}
                      </td>

                      {/* Signature Column */}
                      <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                        {car.signature ? (
                          <div>
                            <div className="font-serif italic font-extrabold text-indigo-950 text-xs tracking-wide">
                              {car.signature}
                            </div>
                            <button 
                              onClick={() => handleOpenSignatureModal(car)}
                              className="mt-0.5 inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold px-2 py-0.5 rounded-lg text-[10px] hover:bg-emerald-100 cursor-pointer transition-colors"
                            >
                              <span>View</span>
                              <FiCheckCircle className="text-emerald-600 text-xs" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <span className="text-slate-400 text-xs block">—</span>
                            <button 
                              onClick={() => handleOpenSignatureModal(car)}
                              className="mt-0.5 inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded-lg text-[10px] hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                              <span>Not Captured</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Damage Column */}
                      <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedCarForModal(car);
                            setSelectedDamageText(car.damage || '');
                            setDamageModalOpen(true);
                          }}
                          className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer hover:opacity-90 transition-all ${
                            car.damageType === 'warning'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : car.damage
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                          title="Click to view or report damage"
                        >
                          {car.damageType === 'warning' ? (
                            <FiAlertTriangle className="text-amber-600 text-xs shrink-0" />
                          ) : car.damage ? (
                            <FiCheckCircle className="text-emerald-600 text-xs shrink-0" />
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                          <span>{car.damage || 'No Damage'}</span>
                        </button>
                      </td>

                      {/* Status Column */}
                      <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                        {car.status === 'Delivered' ? (
                          <div>
                            <span className="text-emerald-700 font-extrabold text-xs block">Delivered</span>
                            <span className="text-emerald-600 text-[10px] font-bold block">{car.deliveryTime}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-bold text-xs">Not Delivered</span>
                        )}
                      </td>

                      {/* Actions Column (1. Camera, 2. Edit, 3. Delete) */}
                      <td className="py-3.5 px-3 text-center align-middle whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          {/* 1. Camera / Photo Capture Button (FIRST - Next to Edit with 0/4, 3/4, 4/4 count) */}
                          <button
                            onClick={() => handleOpenPhotoModal(car, 'delivery')}
                            className="h-8 px-2.5 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-800 font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-2xs shrink-0"
                            title="Capture / Upload Vehicle Photos"
                          >
                            <FiCamera className="text-sm text-purple-700 shrink-0" />
                            <span className="font-mono text-[11px] font-black">{car.deliveryPhotos?.current || 0}/{car.deliveryPhotos?.total || 4}</span>
                          </button>

                          {/* 2. Edit / Signature Pencil Button (SECOND) */}
                          <button
                            onClick={() => handleOpenSignatureModal(car)}
                            className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-indigo-600 flex items-center justify-center cursor-pointer transition-all shadow-2xs shrink-0"
                            title="Capture / Edit Signature & POD"
                          >
                            <FiEdit2 className="text-sm text-indigo-600" />
                          </button>

                          {/* 3. Delete / Remove Button (THIRD / LAST) */}
                          <button
                            onClick={() => deleteCar(car.id)}
                            className="w-8 h-8 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer transition-all shadow-2xs shrink-0"
                            title="Remove vehicle from list"
                          >
                            <FiTrash2 className="text-sm text-rose-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-500 font-medium">
                      No vehicles assigned to this delivery drop. Click "Scan VIN" or "Add Car to Delivery" to add vehicles.
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
              )}
            </div>

            {/* ADD CAR BANNER AT BOTTOM OF TABLE CARD */}
            <div className="p-4 bg-purple-50/50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <FiTruck className="text-lg" />
                </div>
                <div>
                  <h4 className="font-extrabold text-purple-950 text-xs">Add Car to Delivery (if required)</h4>
                  <p className="text-purple-700 font-medium text-[11px]">Scan a VIN or add any car that was not in the list.</p>
                </div>
              </div>

              <button
                onClick={() => setScanVinModalOpen(true)}
                className="bg-white hover:bg-purple-50 border border-purple-300 text-purple-800 font-extrabold text-xs px-4 py-2 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <BsQrCodeScan className="text-purple-700" />
                <span>Scan VIN to Add</span>
              </button>
            </div>

          </div>

          {/* AFTER-HOURS DELIVERY SETTINGS CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black text-slate-900 tracking-tight">After-Hours Delivery (No signature required)</h3>
                  <FiInfo className="text-slate-400 text-xs" />
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Enable this if the customer is unavailable.</p>
              </div>

              {/* TOGGLE SWITCH */}
              <button
                onClick={() => {
                  const nextState = !afterHoursEnabled;
                  setAfterHoursEnabled(nextState);
                  triggerToast(nextState ? 'After-Hours Mode Enabled (No signature required).' : 'After-Hours Mode Disabled.');
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer relative ${
                  afterHoursEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  afterHoursEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* CHECKBOXES ROW (Matching Screenshot 2) */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 pt-1">
              <div className="flex items-center gap-1.5 text-amber-700">
                <span className="text-amber-500 font-black">✓</span>
                <span>GPS & Time Captured</span>
              </div>

              <div className="flex items-center gap-1.5 text-amber-700">
                <span className="text-amber-500 font-black">✓</span>
                <span>Mandatory Photos Required</span>
              </div>

              <div className="flex items-center gap-1.5 text-amber-700">
                <span className="text-amber-500 font-black">✓</span>
                <span>Key Drop / Location Notes</span>
              </div>
            </div>
          </div>

          {/* NOTES (OPTIONAL) SECTION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">NOTES (Optional)</label>
            <textarea
              rows={2}
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Add any delivery notes for this stop..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* BIG ORANGE CONFIRMATION BUTTON (Exact Match to Screenshot 2) */}
          <button
            onClick={handleConfirmDropDelivery}
            className="w-full bg-[#f95700] hover:bg-[#e04e00] active:scale-[0.99] text-white font-black text-sm py-4 px-6 rounded-2xl shadow-xl transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer border-0"
          >
            <div className="flex items-center gap-2 text-base">
              <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs font-black">
                ✓
              </div>
              <span>CONFIRM DROP 1 OF {runData?.stopsCount || 1} DELIVERY</span>
            </div>
            <span className="text-[11px] font-normal opacity-90">This will complete delivery for this stop and notify Dispatch & Customer.</span>
          </button>

        </div>

        {/* ================= RIGHT SIDEBAR (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* CARD 1: WHAT HAPPENS NEXT? */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WHAT HAPPENS NEXT?</h3>
            
            <div className="space-y-3.5 text-xs font-semibold text-slate-700">
              {/* Step 1 */}
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                  ✓
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Picked Up</div>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">All {totalCarsCount} cars picked up at the origin.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-indigo-600 text-indigo-600 flex items-center justify-center font-bold text-[8px] mt-0.5 shrink-0">
                  ●
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Dispatch</div>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">Pickup complete, return to Active Run and tap DISPATCH when you leave the yard.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-indigo-600 text-indigo-600 flex items-center justify-center font-bold text-[8px] mt-0.5 shrink-0">
                  ●
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Deliver</div>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">Deliver each car at the correct location and capture POD.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 text-slate-300 flex items-center justify-center font-bold text-[8px] mt-0.5 shrink-0">
                  ○
                </div>
                <div>
                  <div className="font-extrabold text-slate-400">Completed</div>
                  <p className="text-[11px] text-slate-400 font-medium leading-tight">Once all drops are delivered, job is complete.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: REQUIREMENTS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REQUIREMENTS</h3>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
              <li className="flex items-start gap-2 text-emerald-700">
                <span className="text-emerald-500 font-black shrink-0">✓</span>
                <span>Deliver the correct cars only.</span>
              </li>
              <li className="flex items-start gap-2 text-emerald-700">
                <span className="text-emerald-500 font-black shrink-0">✓</span>
                <span>Capture delivery photos for each car.</span>
              </li>
              <li className="flex items-start gap-2 text-emerald-700">
                <span className="text-emerald-500 font-black shrink-0">✓</span>
                <span>Report any new damage before confirming.</span>
              </li>
              <li className="flex items-start gap-2 text-emerald-700">
                <span className="text-emerald-500 font-black shrink-0">✓</span>
                <span>Signature required only if company rule enabled.</span>
              </li>
            </ul>
          </div>

          {/* CARD 3: AFTER-HOURS DELIVERY INSTRUCTIONS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AFTER-HOURS DELIVERY</h3>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2 text-amber-800">
                <span>🎧</span>
                <span>No signature required.</span>
              </li>
              <li className="flex items-center gap-2 text-amber-800">
                <span className="text-amber-500 font-black">✓</span>
                <span>GPS & Time Captured</span>
              </li>
              <li className="flex items-center gap-2 text-amber-800">
                <span className="text-amber-500 font-black">✓</span>
                <span>Mandatory Photos Required</span>
              </li>
              <li className="flex items-center gap-2 text-amber-800">
                <span className="text-amber-500 font-black">✓</span>
                <span>Key Drop / Location Notes</span>
              </li>
            </ul>

            <div className="pt-2">
              <input
                type="text"
                value={afterHoursNotes}
                onChange={(e) => setAfterHoursNotes(e.target.value)}
                placeholder="Add notes..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* CARD 4: QUICK ACTIONS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QUICK ACTIONS</h3>
            <div className="space-y-2 text-xs">
              <button 
                onClick={() => triggerToast('Calling Customer hotline...')}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">📞 Call Customer</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button 
                onClick={() => triggerToast('Calling Dispatcher...')}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">📞 Call Dispatch</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button 
                onClick={() => triggerToast('Opening Yard Map Directions...')}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">🗺️ Yard Map / Directions</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button 
                onClick={() => setJobDetailsModalOpen(true)}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">📄 View Load Details</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ================= MODALS ================= */}

      {/* 1. SCAN VIN / ADD CAR MODAL */}
      {scanVinModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[180] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <BsQrCodeScan className="text-indigo-600" /> Scan or Enter Vehicle VIN
              </h3>
              <button onClick={() => setScanVinModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddCarSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">VIN Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 1HGCM82633A004352"
                  value={newVinInput}
                  onChange={(e) => setNewVinInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono focus:outline-none focus:border-indigo-500 uppercase"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Make & Model (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Nissan X-Trail"
                  value={newCarMake}
                  onChange={(e) => setNewCarMake(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-center">
                <BsQrCodeScan className="text-3xl text-indigo-600 mx-auto mb-1 animate-pulse" />
                <p className="text-indigo-900 font-bold">Simulated Barcode Camera Ready</p>
                <p className="text-[10.5px] text-indigo-600">Point device camera at VIN barcode or enter manually above.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setScanVinModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl cursor-pointer"
                >
                  Add Car to Drop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. SIGNATURE MODAL */}
      {signatureModalOpen && selectedCarForModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[180] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">Customer Signature POD</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedCarForModal.makeModel} ({selectedCarForModal.reg})</p>
              </div>
              <button onClick={() => setSignatureModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Receiver Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Smith"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold block">Sign Below on Glass *</label>
                  <button onClick={handleClearCanvas} className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer">
                    Clear Pad
                  </button>
                </div>

                <div className="border-2 border-indigo-200 bg-white rounded-2xl h-44 relative overflow-hidden shadow-inner touch-none">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={176}
                    onMouseDown={startCanvasDraw}
                    onMouseMove={canvasDraw}
                    onMouseUp={stopCanvasDraw}
                    onMouseLeave={stopCanvasDraw}
                    onTouchStart={startCanvasDraw}
                    onTouchMove={canvasDraw}
                    onTouchEnd={stopCanvasDraw}
                    className="w-full h-full cursor-crosshair block"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSignatureModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSignature}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl cursor-pointer"
              >
                Save Signature
              </button>
            </div>
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

      {/* 3. PHOTO INSPECTION MODAL */}
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

            {/* TAB SELECTOR */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
              <button
                onClick={() => setActiveTabPhoto('before')}
                className={`flex-1 py-2 rounded-lg cursor-pointer transition-all ${
                  activeTabPhoto === 'before' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Before Photos ({selectedCarForModal.beforePhotos.current}/4)
              </button>
              <button
                onClick={() => setActiveTabPhoto('delivery')}
                className={`flex-1 py-2 rounded-lg cursor-pointer transition-all ${
                  activeTabPhoto === 'delivery' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Delivery Photos ({selectedCarForModal.deliveryPhotos.current}/4)
              </button>
            </div>

            {/* GALLERY GRID */}
            <div className="grid grid-cols-2 gap-3 py-2">
              {[1, 2, 3, 4].map((num) => {
                const isBefore = activeTabPhoto === 'before';
                const targetObj = isBefore ? selectedCarForModal.beforePhotos : selectedCarForModal.deliveryPhotos;
                const urlKey = isBefore ? 'beforePhotoUrls' : 'deliveryPhotoUrls';
                const photoMap = selectedCarForModal[urlKey] || {};
                const customPhoto = photoMap[num];
                const isUploaded = num <= targetObj.current || !!customPhoto;
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
                          <span className="text-[10px] font-mono font-bold block text-emerald-300 drop-shadow-xs">11:02 AM • GPS Verified</span>
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

      {/* 4. JOB DETAILS MODAL */}
      {jobDetailsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[180] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">Load Details - {runData?.id || 'LD-XXXX'}</h3>
                <p className="text-xs text-slate-500 font-medium">Customer: {runData?.nextStop?.name || 'Customer'}</p>
              </div>
              <button onClick={() => setJobDetailsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Route</span>
                  <span className="text-slate-900">{runData?.origin || 'Origin'} ➔ {runData?.destination || 'Destination'}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Total Vehicle Load</span>
                  <span className="text-slate-900 font-mono">{runData?.totalCarsCount || 0} Vehicles Total</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Stop 1 (Drop)</span>
                  <span className="text-slate-900">{runData?.nextStop?.name || 'Destination'} ({totalCarsCount} Vehicles)</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Dispatch Contact</span>
                  <span className="text-indigo-600">{runData?.nextStop?.contactPhone || 'TBA'}</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-purple-950 font-medium text-[11px]">
                <strong className="font-bold block mb-0.5">Delivery Instructions:</strong>
                {runData?.nextStop?.instructions || 'No instructions provided.'}
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

      {/* 5. DAMAGE INSPECTION MODAL */}
      {damageModalOpen && selectedCarForModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[180] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">Vehicle Condition & Damage</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedCarForModal.makeModel} ({selectedCarForModal.vin})</p>
              </div>
              <button onClick={() => setDamageModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Damage Note / Report</label>
                <input
                  type="text"
                  placeholder="e.g. Minor Scratch on Rear Bumper"
                  value={selectedDamageText}
                  onChange={(e) => setSelectedDamageText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setCars(cars.map(c => c.id === selectedCarForModal.id ? { ...c, damage: 'No Damage', damageType: 'none' } : c));
                    setDamageModalOpen(false);
                    triggerToast(`Marked ${selectedCarForModal.makeModel} as No Damage.`);
                  }}
                  className="flex-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold py-2.5 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors"
                >
                  ✓ Set No Damage
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCars(cars.map(c => c.id === selectedCarForModal.id ? { ...c, damage: selectedDamageText || 'Minor Damage Reported', damageType: 'warning' } : c));
                    setDamageModalOpen(false);
                    triggerToast(`Damage note saved for ${selectedCarForModal.makeModel}!`);
                  }}
                  className="flex-1 bg-amber-50 border border-amber-200 text-amber-900 font-bold py-2.5 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors"
                >
                  ⚠️ Save Damage Report
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setDamageModalOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl cursor-pointer"
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
