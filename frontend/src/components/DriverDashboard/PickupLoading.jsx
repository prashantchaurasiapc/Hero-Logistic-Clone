<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 91967a4cc51d995fe329d743868334a7005e77e5
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  FiArrowLeft, FiHelpCircle, FiMoreVertical, FiCheck, FiTrash2, FiEdit2,
  FiPlus, FiCamera, FiAlertTriangle, FiPhone, FiNavigation, FiChevronRight,
  FiCheckCircle, FiInfo, FiRefreshCw, FiUserCheck, FiShield, FiX, FiClock,
  FiHome, FiClipboard, FiMessageSquare, FiGrid
} from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';

export default function PickupLoading() {
  const navigate = useNavigate();

  // Mode & Toast States
  const [driverMode, setDriverMode] = useState('Flexible / Owner-Driver');
  const [toastMsg, setToastMsg] = useState('');
  const [wrongVehicleAlert, setWrongVehicleAlert] = useState(true);
  const [addCarModalOpen, setAddCarModalOpen] = useState(false);
  const [scanVinModalOpen, setScanVinModalOpen] = useState(false);
  const [scanVinInput, setScanVinInput] = useState('');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [editCarModalOpen, setEditCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  // New Car Form State
  const [newVin, setNewVin] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newDrop, setNewDrop] = useState('DROP 1');

<<<<<<< HEAD
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
      if (res.data?.success && res.data.data.load) {
        setLoadInfo(res.data.data.load);
        setCars(res.data.data.load.cars || []);
      }
    } catch (error) {
      console.error('Failed to fetch pickup load', error);
      triggerToast('❌ Failed to load pickup details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickupLoad();
  }, []);
=======
  // Cars Data with DROPs
  const [cars, setCars] = useState([
    { id: 1, drop: 'DROP 1', dropLoc: 'Auto World Sydney', vin: '1HGCM82633A004352', makeModel: 'Toyota Camry', plate: 'ABC123', pickedUp: true, time: '08:12 AM' },
    { id: 2, drop: 'DROP 1', dropLoc: 'Auto World Sydney', vin: 'JM1BM1W7X01331234', makeModel: 'Mazda 3', plate: 'CDE567', pickedUp: true, time: '08:16 AM' },
    { id: 3, drop: 'DROP 1', dropLoc: 'Auto World Sydney', vin: '5YJ3E1EA5PF123456', makeModel: 'Tesla Model 3', plate: 'GHI012', pickedUp: false, time: null },
    { id: 4, drop: 'DROP 2', dropLoc: 'Newcastle Motors', vin: 'JHMKA266MC000145', makeModel: 'Honda Accord', plate: 'JKL345', pickedUp: true, time: '08:14 AM' },
    { id: 5, drop: 'DROP 2', dropLoc: 'Newcastle Motors', vin: 'WAUZZZ4G5HN123456', makeModel: 'Audi A6', plate: 'MNO678', pickedUp: false, time: null },
    { id: 6, drop: 'DROP 2', dropLoc: 'Newcastle Motors', vin: 'WDD0A7C57JA123456', makeModel: 'Mercedes C200', plate: 'PQR901', pickedUp: false, time: null },
    { id: 7, drop: 'DROP 3', dropLoc: 'Brisbane Car Centre', vin: 'YV1A22MKXJ1001234', makeModel: 'Volvo XC60', plate: 'STU234', pickedUp: false, time: null },
    { id: 8, drop: 'DROP 4', dropLoc: 'Gold Coast Autos', vin: '1FM5U90D3JU812345', makeModel: 'Ford Escape', plate: 'VWX567', pickedUp: false, time: null },
  ]);
>>>>>>> 91967a4cc51d995fe329d743868334a7005e77e5

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

<<<<<<< HEAD
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
=======
  const togglePickUp = (id) => {
>>>>>>> 91967a4cc51d995fe329d743868334a7005e77e5
    setCars(cars.map(c => {
      if (c.id === id) {
        const nextState = !c.pickedUp;
        triggerToast(nextState ? `${c.makeModel} marked as Picked Up!` : `${c.makeModel} un-marked.`);
        return { ...c, pickedUp: nextState, time: nextState ? '08:20 AM' : null };
      }
      return c;
    }));
<<<<<<< HEAD
    triggerToast(nextState ? `${car.makeModel} marked as Picked Up!` : `${car.makeModel} un-marked.`);
    
    // API Call
    try {
      await api.post('/driver-portal/pickup-load/item-status', { itemId: car.dbId, pickedUp: nextState });
    } catch (err) {
      console.error(err);
      triggerToast(`Failed to update ${car.makeModel} on server.`);
    }
=======
>>>>>>> 91967a4cc51d995fe329d743868334a7005e77e5
  };

  const deleteCar = (id) => {
    const carToDelete = cars.find(c => c.id === id);
    setCars(cars.filter(c => c.id !== id));
    triggerToast(`Car ${carToDelete?.makeModel || ''} removed from pickup load.`);
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
      plate: newPlate.toUpperCase() || 'TEMP-99',
      pickedUp: true,
      time: '08:25 AM'
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

      {/* TOP HEADER TITLE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/driver/active-run')}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs transition-all"
            title="Back to Active Run"
          >
            <FiArrowLeft className="text-base" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Pickup & Loading</h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Scan or select cars assigned to load LD-3987</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setScanVinModalOpen(true)}
            className="flex-1 sm:flex-initial bg-[#4f46e5] hover:bg-[#4338ca] text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
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

      {/* THREE-COLUMN MASTER WEB DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= LEFT COLUMN: MODULE META & INSTRUCTIONS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-indigo-700 tracking-tight">15.6 Pickup</span>
              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Owner-Driver
              </span>
            </div>

            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Scan or select the cars you have picked up at this location. All assigned cars must be picked up before you can DISPATCH.
            </p>
          </div>

          {/* LEGEND CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LEGEND</div>
            <div className="space-y-2 font-bold">
              <div className="flex items-center gap-2.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Correct Car (Picked Up)</span>
              </div>
              <div className="flex items-center gap-2.5 text-rose-700">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span>Wrong Car</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span>Not Scanned</span>
              </div>
            </div>
          </div>

          {/* PICKUP LOCATION CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PICKUP LOCATION</div>
            <div className="flex items-start gap-3">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold">📍</span>
              <div>
                <div className="font-black text-slate-900 text-sm">ABC Car Yard</div>
                <div className="text-slate-500 font-medium mt-0.5">12a Sunshine Rd, Melbourne VIC 3000</div>
              </div>
            </div>
          </div>

          {/* LOAD SUMMARY COUNTER */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LOAD SUMMARY</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase">Total</div>
                <div className="text-xl font-black text-slate-900">{totalCarsCount}</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <div className="text-[10px] text-emerald-700 font-extrabold uppercase">Picked Up</div>
                <div className="text-xl font-black text-emerald-700">{pickedUpCount}</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <div className="text-[10px] text-amber-800 font-extrabold uppercase">Remaining</div>
                <div className="text-xl font-black text-amber-700">{totalCarsCount - pickedUpCount}</div>
              </div>
            </div>
          </div>

          {/* HELP INSTRUCTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs text-slate-700">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HELP & GUIDANCE</div>
            <ul className="space-y-2.5 font-semibold">
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-600 shrink-0">📱</span>
                <span>Scan VIN barcode or tap a car to mark as picked up.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-600 shrink-0">📋</span>
                <span>Cars are grouped by delivery stop to help you load in the right order.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 shrink-0">⚠️</span>
                <span>Wrong cars are blocked from being picked up.</span>
              </li>
            </ul>
          </div>

          {/* MODE TOGGLE CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MODE</div>
            <div>
              <div className="text-[11px] text-slate-500 font-bold mb-1">Your current mode</div>
              <div className="bg-indigo-50 text-indigo-900 border border-indigo-200 px-3 py-2 rounded-xl font-black flex items-center justify-between">
                <span>{driverMode}</span>
                <span>✏️</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-2">You can add, remove and edit cars and destinations.</p>
            </div>
            <button
              onClick={() => {
                const nextMode = driverMode === 'Flexible / Owner-Driver' ? 'Assigned Mode' : 'Flexible / Owner-Driver';
                setDriverMode(nextMode);
                triggerToast(`Mode switched to: ${nextMode}`);
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl border border-slate-800 transition-all cursor-pointer"
            >
              Switch to {driverMode === 'Flexible / Owner-Driver' ? 'Assigned Mode' : 'Flexible / Owner-Driver'}
            </button>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN: MAIN CARS LOAD BREAKDOWN (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* LOAD ID HEADER CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="text-2xl font-black text-indigo-700 tracking-tight">LD-3987</div>
                <div className="text-base font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>Melbourne VIC</span>
                  <span className="text-slate-400">➔</span>
                  <span>Sydney NSW</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Pickup Time</span>
                  <span className="font-mono text-slate-900">08:00 AM</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Est. Finish</span>
                  <span className="font-mono text-slate-900">04:30 PM</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Total Cars</span>
                  <span className="font-mono text-slate-900">{totalCarsCount} Cars</span>
                </div>
              </div>
            </div>

            {/* BARCODE PURPLE BANNER */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3 text-purple-950 text-xs font-bold shadow-xs">
              <BsQrCodeScan className="text-2xl text-purple-700 shrink-0" />
              <div>
                <div className="font-black text-purple-900 text-sm">Scan or select each car you have picked up.</div>
                <div className="text-purple-700 font-medium text-[11px]">All {totalCarsCount} cars must be picked up before you can DISPATCH.</div>
              </div>
            </div>

            {/* TWO MODE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs">
                <span className="p-2 bg-indigo-100 text-indigo-700 rounded-xl shrink-0 font-bold">👤</span>
                <div>
                  <div className="font-black text-slate-900">Flexible / Owner-Driver Mode</div>
                  <div className="text-slate-500 font-medium text-[11px] mt-0.5">You can add, remove and edit cars and delivery destinations.</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs">
                <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 font-bold">🛡️</span>
                <div>
                  <div className="font-black text-slate-900">Auto Save Enabled</div>
                  <div className="text-slate-500 font-medium text-[11px] mt-0.5">Changes are saved automatically and logged with time, GPS and details.</div>
                </div>
              </div>
            </div>

          </div>

          {/* CARS TO PICK UP HEADER BAR */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">CARS TO PICK UP ({totalCarsCount})</h3>
                <p className="text-xs text-slate-500 font-medium">Manage your load: add new cars from the yard or remove any that are not being taken.</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setScanVinModalOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-3.5 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <BsQrCodeScan className="text-indigo-600" />
                  <span>Scan VIN</span>
                </button>

                <button
                  onClick={() => setAddCarModalOpen(true)}
                  className="bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs px-3.5 py-2 rounded-xl border border-amber-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <FiPlus />
                  <span>+ Add Car</span>
                </button>
              </div>
            </div>

            {/* DROPS BREAKDOWN SECTIONS */}
            <div className="space-y-4">
<<<<<<< HEAD
              {cars.length === 0 ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl font-black">
                    🚗
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">No vehicles added yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">
                      Click <strong>+ Add Car</strong> or <strong>Scan VIN</strong> to enter vehicles for this freight load.
                    </p>
                  </div>
                  <div className="flex justify-center gap-2 pt-1">
                    <button 
                      onClick={() => setAddCarModalOpen(true)} 
                      className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-extrabold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-2xs"
                    >
                      + Add Car to Load
                    </button>
                    <button 
                      onClick={() => setScanVinModalOpen(true)} 
                      className="bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs px-4 py-2 rounded-xl border border-slate-200 cursor-pointer shadow-2xs"
                    >
                      Scan VIN
                    </button>
                  </div>
                </div>
              ) : (
                drops.map((dropName) => {
                  const dropCars = cars.filter(c => c.drop === dropName);
                  if (dropCars.length === 0) return null;
                  const dropLoc = dropCars[0]?.dropLoc || 'Delivery Location';
=======
              {drops.map((dropName) => {
                const dropCars = cars.filter(c => c.drop === dropName);
                if (dropCars.length === 0) return null;
                const dropLoc = dropCars[0]?.dropLoc || 'Delivery Location';
>>>>>>> 91967a4cc51d995fe329d743868334a7005e77e5

                return (
                  <div key={dropName} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                    {/* Drop Header */}
                    <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex justify-between items-center text-xs font-bold">
                      <div className="flex items-center gap-2 text-indigo-900">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                        <span className="font-black text-sm">{dropName}</span>
                        <span className="text-slate-400 font-normal">|</span>
                        <span className="text-slate-700">Deliver: {dropLoc}</span>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        {dropCars.length} {dropCars.length === 1 ? 'Car' : 'Cars'}
                      </span>
                    </div>

                    {/* Cars List */}
                    <div className="divide-y divide-slate-200/80 bg-white">
                      {dropCars.map((car) => (
                        <div 
                          key={car.id} 
                          className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                            car.pickedUp ? 'bg-emerald-50/40' : 'hover:bg-slate-50/60'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Checkbox circle */}
                            <button
                              onClick={() => togglePickUp(car.id)}
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all shrink-0 ${
                                car.pickedUp ? 'bg-emerald-500 text-white shadow-xs' : 'border-2 border-slate-300 bg-white text-transparent hover:border-slate-400'
                              }`}
                            >
                              ✓
                            </button>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-black text-slate-800 truncate">VIN: {car.vin}</span>
                              </div>
                              <div className="text-xs font-bold text-slate-900">
                                {car.makeModel} <span className="text-slate-500 font-mono text-[11px] font-semibold">({car.plate})</span>
                              </div>
                            </div>
                          </div>

                          {/* Status & Actions */}
                          <div className="flex items-center gap-3 shrink-0">
                            {car.pickedUp ? (
                              <div className="text-right">
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200 block">
                                  Picked Up
                                </span>
                                <span className="text-[9.5px] font-bold text-slate-400 block mt-0.5">{car.time}</span>
                              </div>
                            ) : (
                              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                                Not Picked Up
                              </span>
                            )}

                            <button
                              onClick={() => { setEditingCar(car); setEditCarModalOpen(true); }}
                              className="text-slate-400 hover:text-slate-700 p-1.5 cursor-pointer rounded-lg hover:bg-slate-100"
                              title="Edit car details"
                            >
                              <FiEdit2 className="text-sm" />
                            </button>

                            <button
                              onClick={() => deleteCar(car.id)}
                              className="text-rose-400 hover:text-rose-600 p-1.5 cursor-pointer rounded-lg hover:bg-rose-50"
                              title="Remove car"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
<<<<<<< HEAD
              })
            )}
=======
              })}
>>>>>>> 91967a4cc51d995fe329d743868334a7005e77e5
            </div>

            {/* ADD CAR FROM YARD / POOL BAR */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-purple-100 text-purple-700 rounded-xl text-lg shrink-0">🚗</span>
                <div>
                  <div className="font-black text-purple-950 text-xs">Add Car from Yard / Pool</div>
                  <div className="text-purple-700 text-[11px] font-medium">Scan a VIN to add a car that is not currently on your load.</div>
                </div>
              </div>

              <button
                onClick={() => setScanVinModalOpen(true)}
                className="bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs w-full sm:w-auto"
              >
                <BsQrCodeScan className="text-purple-700" />
                <span>Scan VIN to Add</span>
              </button>
            </div>

            {/* WRONG VEHICLE SCANNED ALERT BANNER */}
            {wrongVehicleAlert && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start justify-between gap-3 text-rose-900 text-xs shadow-xs">
                <div className="flex items-start gap-3">
                  <FiAlertTriangle className="text-rose-600 text-lg mt-0.5 shrink-0" />
                  <div>
                    <div className="font-black text-rose-900 text-xs uppercase tracking-wide">Wrong Vehicle Scanned</div>
                    <div className="text-rose-700 font-medium text-[11px] mt-0.5">
                      <strong className="font-mono">VIN: SALWR2RV1JA123455</strong> is NOT assigned to this pickup. Please scan a vehicle from the list above or add it to your load first.
                    </div>
                  </div>
                </div>

                <button onClick={() => setWrongVehicleAlert(false)} className="text-rose-400 hover:text-rose-700 cursor-pointer p-1">
                  <FiX className="text-base" />
                </button>
              </div>
            )}

            {/* CONFIRMATION PROGRESS & BUTTON */}
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
                className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiCheckCircle className="text-lg" />
                <span>Confirm All {totalCarsCount} Cars Picked Up</span>
              </button>
              <p className="text-center text-[10px] text-slate-500 font-semibold">This will mark the pickup as completed.</p>
            </div>

          </div>

        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
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
                <span className="w-4 h-4 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">○</span>
                <div>
                  <div className="font-bold text-slate-400">Delivered</div>
                  <div className="text-[11px] text-slate-500">Deliver each car to the correct location.</div>
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
            </div>
          </div>

          {/* PHOTOS (OPTIONAL) CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PHOTOS (OPTIONAL)</div>
            <p className="text-slate-500 font-semibold">Add pickup photos if required by your company.</p>
            <button
              onClick={() => setPhotoModalOpen(true)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <FiCamera className="text-amber-400" />
              <span>Add Photo</span>
            </button>
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
              <button onClick={() => navigate('/driver/active-run')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
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

            {/* QUICK VIN SELECTOR OR MANUAL ENTRY */}
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

      {/* UPLOAD PHOTO MODAL */}
      {photoModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiCamera className="text-indigo-600 text-lg" />
                Add Pickup Condition Photo
              </h3>
              <button onClick={() => setPhotoModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-6 text-center space-y-2">
              <FiCamera className="text-3xl text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Tap to take photo or select file</div>
            </div>

            <button
              onClick={() => {
                setPhotoModalOpen(false);
                triggerToast('Pickup photo saved to vehicle audit trail!');
              }}
              className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-black text-xs py-3 rounded-xl transition-all cursor-pointer"
            >
              Save Photo
            </button>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Drop Location</label>
                <select
                  value={editingCar.drop}
                  onChange={(e) => setEditingCar({ 
                    ...editingCar, 
                    drop: e.target.value,
                    dropLoc: e.target.value === 'DROP 1' ? 'Auto World Sydney' : e.target.value === 'DROP 2' ? 'Newcastle Motors' : 'Brisbane Car Centre'
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="DROP 1">DROP 1 - Auto World Sydney</option>
                  <option value="DROP 2">DROP 2 - Newcastle Motors</option>
                  <option value="DROP 3">DROP 3 - Brisbane Car Centre</option>
                  <option value="DROP 4">DROP 4 - Gold Coast Autos</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setCars(cars.map(c => c.id === editingCar.id ? editingCar : c));
                setEditCarModalOpen(false);
                setEditingCar(null);
                triggerToast('Car details updated successfully!');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md mt-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
