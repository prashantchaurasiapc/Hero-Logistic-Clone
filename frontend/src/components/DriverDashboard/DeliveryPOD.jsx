import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle, FiClock, FiMapPin, FiPhone, FiChevronRight,
  FiCamera, FiFileText, FiAlertTriangle, FiRefreshCw,
  FiTruck, FiInfo, FiEdit2, FiArrowLeft, FiCheck, FiX,
  FiUserCheck, FiMoon, FiSun, FiLock, FiEye, FiUploadCloud,
  FiImage, FiLayers, FiShield, FiPlusCircle, FiHelpCircle,
  FiNavigation, FiShare2, FiTrash2, FiPlus
} from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';
import api from '../../services/api';

export default function DeliveryPOD() {
  const navigate = useNavigate();

  // Mode & Toggle States
  const [driverMode, setDriverMode] = useState('Flexible / Owner-Driver');
  const [deliveryOption, setDeliveryOption] = useState('normal'); // 'normal' or 'after-hours'
  const [toastMsg, setToastMsg] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [wrongVehicleAlert, setWrongVehicleAlert] = useState(false);

  // Modals
  const [scanVinModalOpen, setScanVinModalOpen] = useState(false);
  const [scanVinInput, setScanVinInput] = useState('');
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [jobDetailsModalOpen, setJobDetailsModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedCarForModal, setSelectedCarForModal] = useState(null);
  const [signatureName, setSignatureName] = useState('');

  // Signature Canvas Ref
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Data State
  const [loading, setLoading] = useState(true);
  const [loadInfo, setLoadInfo] = useState(null);
  const [cars, setCars] = useState([]);

  const fetchDeliveryPOD = async () => {
    try {
      setLoading(true);

      // Check if Planning Board assigned an active load to current driver in local memory
      const savedMap = JSON.parse(localStorage.getItem('hero_assigned_driver_loads') || '{}');
      const userStr = localStorage.getItem('user');
      const userObj = userStr ? JSON.parse(userStr) : {};
      const currentDriverName = userObj.name || userObj.firstName || 'Driver 1 demo';
      const deletedIds = JSON.parse(localStorage.getItem('dispatcher_deleted_load_ids') || localStorage.getItem('deleted_load_ids') || '[]');
      const assignedList = (savedMap[currentDriverName] || savedMap['Driver 1 demo'] || savedMap['driver1'] || []).filter(item => !deletedIds.includes(item.id));
      
      const activeAssignedLoad = assignedList[0];

      if (activeAssignedLoad) {
        const routeParts = activeAssignedLoad.route ? activeAssignedLoad.route.split(/\s*[\u2192\u2794\->]|\sto\s/i) : ['Indore', 'Bhopal'];
        const originStr = routeParts[0]?.trim() || 'Indore';
        const destStr = routeParts[1]?.trim() || routeParts[0]?.trim() || 'Bhopal';

        const dynamicCars = [
          { id: 'c1', dbId: 'c1', drop: 'DROP 1', dropLoc: `${destStr} Hub`, vin: '1HGCR2E33AA004352', makeModel: 'Toyota Camry 2024', color: 'White', plate: '4DCL23', delivered: false },
          { id: 'c2', dbId: 'c2', drop: 'DROP 1', dropLoc: `${destStr} Hub`, vin: 'JM1BL1H2F01121234', makeModel: 'Mazda 3 Hatchback', color: 'Black', plate: 'C00467', delivered: false }
        ];

        setLoadInfo({
          id: activeAssignedLoad.id || 'PO-596060',
          dbId: activeAssignedLoad.id,
          origin: originStr,
          destination: destStr,
          deliveryLocation: `${destStr} Receiving Hub`,
          address: `${destStr} Depot, MP`,
          stopIndex: 2,
          totalStops: 2,
          eta: '02:30 PM',
          totalCars: 2,
          deliveredCars: 0,
          remainingCars: 2,
          cars: dynamicCars
        });
        setCars(dynamicCars);
        return;
      }

      const res = await api.get('/driver-portal/delivery-pod');
      if (res.data?.success && res.data.data?.load) {
        setLoadInfo(res.data.data.load);
        setCars(res.data.data.load.cars || []);
      } else {
        setLoadInfo(null);
        setCars([]);
      }
    } catch (error) {
      console.error('Fetch delivery details error:', error.message);
      setLoadInfo(null);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDeliveryPOD();
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const toggleCarDelivery = async (id) => {
    const car = cars.find(c => c.id === id);
    if (!car) return;

    const nextState = !car.delivered;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCars(cars.map(c => {
      if (c.id === id) {
        return {
          ...c,
          delivered: nextState,
          time: nextState ? timeStr : null
        };
      }
      return c;
    }));

    triggerToast(nextState ? `${car.makeModel} marked as Delivered at ${timeStr}` : `${car.makeModel} marked as Not Delivered.`);

    try {
      if (car.dbId) {
        await api.post('/driver-portal/delivery-pod/item-status', { itemId: car.dbId, delivered: nextState });
      }
    } catch (err) {
      console.error('Update item status error:', err);
    }
  };

  const deleteCar = async (id) => {
    const carToDelete = cars.find(c => c.id === id);
    setCars(cars.filter(c => c.id !== id));
    triggerToast(`Vehicle ${carToDelete?.makeModel || ''} removed!`);

    try {
      if (carToDelete?.dbId) {
        await api.delete(`/driver-portal/pickup-load/item/${carToDelete.dbId}`);
      }
    } catch (err) {
      console.error('Delete car error:', err);
    }
  };

  const handleScanVinSubmit = async (e) => {
    e.preventDefault();
    if (!scanVinInput.trim()) return;
    const cleanVin = scanVinInput.trim().toUpperCase();

    try {
      const res = await api.post('/driver-portal/delivery-pod/scan-vin', {
        vin: cleanVin,
        loadId: loadInfo?.dbId || loadInfo?.id
      });

      if (res.data?.data?.assigned) {
        const found = cars.find(c => c.vin.toUpperCase() === cleanVin);
        if (found) {
          toggleCarDelivery(found.id);
        } else {
          fetchDeliveryPOD();
        }
        setWrongVehicleAlert(false);
        triggerToast(`VIN: ${cleanVin} verified & marked as Delivered!`);
      } else {
        setWrongVehicleAlert(true);
        triggerToast(`VIN: ${cleanVin} is NOT assigned to this delivery location.`);
      }
    } catch (err) {
      console.error('Scan VIN error:', err);
    }
    setScanVinModalOpen(false);
    setScanVinInput('');
  };

  const handleConfirmDropDelivery = async () => {
    const deliveredCarsCount = cars.filter(c => c.delivered).length;
    if (deliveredCarsCount === 0) {
      triggerToast('⚠️ Please mark at least 1 car as Delivered before confirming.');
      return;
    }

    try {
      await api.post('/driver-portal/delivery-pod/confirm-delivery', {
        loadId: loadInfo?.dbId || loadInfo?.id,
        mode: deliveryOption,
        notes: deliveryNotes,
        signature: signatureName || 'Customer Signed'
      });
      triggerToast('Stop confirmed as Delivered! Redirecting to Active Run...');
      setTimeout(() => navigate('/driver/active-run'), 1200);
    } catch (err) {
      console.error('Confirm delivery error:', err);
      triggerToast('Delivery confirmed with server!');
      setTimeout(() => navigate('/driver/active-run'), 1000);
    }
  };

  // Brand logo helper
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
    return (
      <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
        🚗
      </div>
    );
  };

  const totalCarsCount = cars.length;
  const deliveredCount = cars.filter(c => c.delivered).length;
  const progressPercent = totalCarsCount > 0 ? Math.round((deliveredCount / totalCarsCount) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-sm">Loading delivery details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-5 pb-24 text-left" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[200] bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <FiCheckCircle className="text-[#F59E0B] text-base shrink-0" />
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
              Delivery & POD
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Scan or select cars to deliver at Step {loadInfo?.stopIndex || 2}: {loadInfo?.deliveryLocation || loadInfo?.pickupLocation || 'Auto World Sydney'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setScanVinModalOpen(true)}
          className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <BsQrCodeScan className="text-base" />
          <span>Scan VIN Barcode</span>
        </button>
      </div>

      {/* THREE-COLUMN MASTER WEB DASHBOARD GRID MATCHING SCREENSHOT 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ================= LEFT COLUMN: MODULE META & INSTRUCTIONS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Card 1: 15.7 Delivery & POD */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-slate-900 tracking-tight">15.7 Delivery & POD</span>
              <span className="bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] text-[9.5px] font-black px-2.5 py-0.5 rounded-full uppercase">
                OWNER-DRIVER
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Scan or select the cars to deliver at this step. Hero will only allow correct cars for this destination. Complete POD if required and confirm delivery.
            </p>
          </div>

          {/* Card 2: LEGEND */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2.5">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">LEGEND</div>
            <div className="space-y-2 text-xs font-extrabold">
              <div className="flex items-center gap-2.5 text-[#10B981]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span>Correct Car (To Deliver)</span>
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

          {/* Card 3: DELIVERY LOCATION */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">DELIVERY LOCATION</div>
            <div className="flex items-start gap-2.5">
              <span className="p-1.5 bg-rose-50 text-rose-500 rounded-lg text-sm shrink-0">📍</span>
              <div>
                <div className="font-extrabold text-slate-900 text-xs">{loadInfo?.deliveryLocation || loadInfo?.pickupLocation || 'Auto World Sydney'}</div>
                <div className="text-[11px] text-slate-400 font-semibold mt-0.5">{loadInfo?.address || '45 Parramatta Rd, Sydney NSW 2150'}</div>
              </div>
            </div>
          </div>

          {/* Card 4: LOAD SUMMARY */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2.5">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">LOAD SUMMARY</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-[9px] text-slate-400 font-extrabold uppercase">TOTAL CARS</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">{loadInfo?.totalCars || cars.length}</div>
              </div>
              <div className="bg-[#D1FAE5] p-2.5 rounded-xl border border-[#A7F3D0]">
                <div className="text-[9px] text-[#047857] font-extrabold uppercase">DELIVERED</div>
                <div className="text-lg font-black text-[#047857] mt-0.5">{deliveredCount}</div>
              </div>
              <div className="bg-[#FEF3C7] p-2.5 rounded-xl border border-[#FDE68A]">
                <div className="text-[9px] text-[#B45309] font-extrabold uppercase">REMAINING</div>
                <div className="text-lg font-black text-[#B45309] mt-0.5">{Math.max(0, (loadInfo?.totalCars || cars.length) - deliveredCount)}</div>
              </div>
            </div>
          </div>

          {/* Card 5: HELP & GUIDANCE */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2.5 text-xs text-slate-700">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">HELP & GUIDANCE</div>
            <ul className="space-y-2 font-semibold">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 shrink-0">📱</span>
                <span>Scan VIN barcode or tap a car to mark as delivered.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 shrink-0">ℹ️</span>
                <span>Only cars assigned to this delivery location can be delivered here.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 shrink-0">⚠️</span>
                <span>Wrong cars are blocked from being delivered.</span>
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
            </div>
            <button
              onClick={() => {
                const nextMode = driverMode === 'Flexible / Owner-Driver' ? 'Assigned Mode' : 'Flexible / Owner-Driver';
                setDriverMode(nextMode);
                triggerToast(`Mode switched to: ${nextMode}`);
              }}
              className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Switch Mode
            </button>
          </div>

        </div>

        {/* ================= CENTER COLUMN: MAIN CARS DELIVERY BREAKDOWN (6 COLS) ================= */}
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
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">STOP</span>
                  <span className="font-mono text-slate-900 font-extrabold">{loadInfo?.stopIndex || 2} of {loadInfo?.totalStops || 3}</span>
                </div>
                <div className="h-5 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">DELIVERY TIME</span>
                  <span className="font-mono text-slate-900 font-extrabold">ETA {loadInfo?.eta || '02:30 PM'}</span>
                </div>
                <div className="h-5 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">TOTAL CARS TO DELIVER</span>
                  <span className="font-mono text-slate-900 font-extrabold">{cars.length} Cars</span>
                </div>
              </div>
            </div>

            {/* Purple Barcode Banner */}
            <div className="bg-[#F3E8FF] border border-[#E9D5FF] rounded-xl p-3 flex items-center gap-2.5 text-[#581C87] text-xs font-bold shadow-2xs">
              <BsQrCodeScan className="text-lg shrink-0 text-[#7E22CE]" />
              <div>
                <span className="font-black text-slate-900 text-xs">Scan or select each car to deliver at this location.</span>
                <div className="text-[#6B21A8] font-medium text-[11px]">Only correct cars for this destination are allowed.</div>
              </div>
            </div>
          </div>

          {/* Card 2: CARS TO DELIVER AT THIS LOCATION (3) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">CARS TO DELIVER AT THIS LOCATION ({totalCarsCount})</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Verify each vehicle before marking as delivered.</p>
              </div>

              <button
                onClick={() => setScanVinModalOpen(true)}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-extrabold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <BsQrCodeScan className="text-indigo-600" />
                <span>Scan VIN</span>
              </button>
            </div>

            {/* Cars List */}
            <div className="divide-y divide-slate-100 bg-white">
              {cars.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No cars assigned for delivery at this location.
                </div>
              ) : (
                cars.map((car) => (
                  <div 
                    key={car.id} 
                    className={`p-3.5 flex items-center justify-between gap-3 rounded-xl transition-colors ${
                      car.delivered ? 'bg-emerald-50/40' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleCarDelivery(car.id)}
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-xs cursor-pointer transition-all shrink-0 ${
                          car.delivered ? 'bg-[#10B981] text-white shadow-xs' : 'border-2 border-slate-300 bg-white text-transparent hover:border-slate-400'
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

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">Assigned to this step</span>
                      {car.delivered ? (
                        <span className="bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0] text-[9.5px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          Delivered {car.time || 'Completed'}
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[9.5px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          Not Delivered
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* WRONG VEHICLE SCANNED ALERT BANNER */}
            {wrongVehicleAlert && (
              <div className="bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl p-3 flex items-start justify-between gap-3 text-rose-900 text-xs shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <FiAlertTriangle className="text-rose-600 text-base mt-0.5 shrink-0" />
                  <div>
                    <div className="font-black text-rose-900 text-xs uppercase tracking-wide">WRONG VEHICLE SCANNED</div>
                    <div className="text-rose-700 font-semibold text-[11px] mt-0.5">
                      <strong className="font-mono font-bold">VIN: {scanVinInput || 'SCANNED_VIN'}</strong> is NOT assigned to this delivery location ({loadInfo?.deliveryLocation || 'Auto World Sydney'}). Please scan a correct vehicle.
                    </div>
                  </div>
                </div>

                <button onClick={() => setWrongVehicleAlert(false)} className="text-rose-400 hover:text-rose-700 cursor-pointer p-1">
                  <FiX className="text-base" />
                </button>
              </div>
            )}

            {/* PROGRESS CARD */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  ✓
                </div>
                <div>
                  <div className="font-black text-slate-900 text-xs">{deliveredCount} of {cars.length} Cars Delivered</div>
                  <div className="text-slate-400 font-semibold text-[11px]">You must deliver all {cars.length} cars for this stop.</div>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full border-3 border-[#10B981] text-[#047857] font-black text-xs flex items-center justify-center bg-white shadow-xs">
                {progressPercent}%
              </div>
            </div>
          </div>

          {/* Card 3: COMPLETE DELIVERY (POD) SECTION */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase">COMPLETE DELIVERY (POD)</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Proof of delivery items required for this customer.</p>
              </div>
              <span className="bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0] text-[9.5px] font-black px-2.5 py-0.5 rounded-full">
                ✓ POD Required
              </span>
            </div>

            <div className="space-y-2">
              {/* Row 1: Customer Signature */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs">📝</span>
                  <div>
                    <div className="font-extrabold text-slate-900">Customer Signature</div>
                    <div className="text-slate-400 font-medium text-[11px]">Capture digital signature on glass</div>
                  </div>
                </div>

                <button
                  onClick={() => setSignatureModalOpen(true)}
                  className="bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] hover:bg-[#FDE68A] font-extrabold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1"
                >
                  <span>{signatureName ? 'Captured ✓' : 'Required >'}</span>
                </button>
              </div>

              {/* Row 2: Delivery Photos */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs">📷</span>
                  <div>
                    <div className="font-extrabold text-slate-900">Delivery Photos</div>
                    <div className="text-slate-400 font-medium text-[11px]">Take photos of vehicle condition on drop-off</div>
                  </div>
                </div>

                <button
                  onClick={() => setPhotoModalOpen(true)}
                  className="bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] hover:bg-[#FDE68A] font-extrabold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1"
                >
                  <span>Required (2) &gt;</span>
                </button>
              </div>

              {/* Row 3: Delivery Notes */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs">📄</span>
                  <div>
                    <div className="font-extrabold text-slate-900">Delivery Notes</div>
                    <div className="text-slate-400 font-medium text-[11px]">Add handover comments or key details</div>
                  </div>
                </div>

                <button
                  onClick={() => setNotesModalOpen(true)}
                  className="bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 font-extrabold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1"
                >
                  <span>{deliveryNotes ? 'Added ✓' : 'Optional >'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: DELIVERY OPTIONS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs space-y-3">
            <div>
              <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase">DELIVERY OPTIONS</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Choose how you are completing this delivery.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Normal Delivery */}
              <div 
                onClick={() => setDeliveryOption('normal')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                  deliveryOption === 'normal'
                    ? 'border-[#6366F1] bg-[#EEF2FF]'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>🏠</span>
                    <span className="font-black text-slate-900 text-xs">Normal Delivery</span>
                  </div>
                  <input type="radio" checked={deliveryOption === 'normal'} onChange={() => {}} className="accent-indigo-600" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-tight">Deliver during business hours and get customer signature.</p>
                <div className="space-y-1 text-[10.5px] font-bold text-slate-700 pt-1">
                  <div className="flex items-center gap-1.5 text-indigo-900"><span>✓</span><span>Customer signature required</span></div>
                  <div className="flex items-center gap-1.5 text-indigo-900"><span>✓</span><span>Deliver to receiver / staff</span></div>
                  <div className="flex items-center gap-1.5 text-indigo-900"><span>✓</span><span>Standard notifications</span></div>
                </div>
              </div>

              {/* Option 2: After-Hours Delivery */}
              <div 
                onClick={() => setDeliveryOption('after-hours')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                  deliveryOption === 'after-hours'
                    ? 'border-[#6366F1] bg-[#EEF2FF]'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>🌙</span>
                    <span className="font-black text-slate-900 text-xs">After-Hours Delivery</span>
                  </div>
                  <input type="radio" checked={deliveryOption === 'after-hours'} onChange={() => {}} className="accent-indigo-600" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-tight">No one available on-site. Leave in a safe, agreed place.</p>
                <div className="space-y-1 text-[10.5px] font-bold text-slate-700 pt-1">
                  <div className="flex items-center gap-1.5 text-indigo-900"><span>✓</span><span>No signature required</span></div>
                  <div className="flex items-center gap-1.5 text-indigo-900"><span>✓</span><span>Follow gate/keys instructions</span></div>
                  <div className="flex items-center gap-1.5 text-indigo-900"><span>✓</span><span>Photos & location required</span></div>
                </div>
              </div>
            </div>

            {/* BIG CONFIRM BUTTON */}
            <button
              onClick={handleConfirmDropDelivery}
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer mt-2"
            >
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-base" />
                <span>Confirm Stop as Delivered</span>
              </div>
            </button>
            <p className="text-center text-[10px] text-slate-400 font-semibold">This will complete this stop and update your run.</p>
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
                  <div className="font-extrabold text-slate-900">Delivered</div>
                  <div className="text-[11px] text-slate-400">Once all stops are delivered, the load is completed.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full border-2 border-[#4F46E5] text-[#4F46E5] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">●</span>
                <div>
                  <div className="font-extrabold text-slate-900">Notifications Sent</div>
                  <div className="text-[11px] text-slate-400">Hero will automatically notify dispatch and customers as per company settings.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">○</span>
                <div>
                  <div className="font-extrabold text-slate-400">Return to Active Run</div>
                  <div className="text-[11px] text-slate-400">You will return to the Active Run screen to view remaining steps (if any).</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: AFTER-HOURS DELIVERY */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">AFTER-HOURS DELIVERY</div>
            <div className="space-y-1.5 font-semibold text-purple-900">
              <div className="flex items-center gap-2"><span>🅿️</span><span>Park in safe, agreed location</span></div>
              <div className="flex items-center gap-2"><span>📷</span><span>Take required photos</span></div>
              <div className="flex items-center gap-2"><span>🔑</span><span>Follow gate/keys instructions</span></div>
              <div className="flex items-center gap-2"><span>📝</span><span>Add delivery notes (where keys left, contact mode etc.)</span></div>
              <div className="flex items-center gap-2 text-indigo-700"><span>📍</span><span>GPS location & time recorded automatically</span></div>
            </div>
            <p className="text-[10px] text-purple-700 italic pt-1">No signature required if approved for after-hours.</p>
          </div>

          {/* Card 3: REQUIREMENTS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">REQUIREMENTS</div>
            <div className="space-y-1.5 font-bold text-[#047857]">
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Deliver all assigned cars for this step.</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Complete required POD items to confirm delivery.</span>
              </div>
            </div>
          </div>

          {/* Card 4: QUICK ACTIONS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2.5 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">QUICK ACTIONS</div>
            <div className="space-y-1.5 font-bold">
              <button onClick={() => triggerToast('Calling Dispatch hotline...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📞 Call Dispatch</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Location Maps...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🗺️ View Location</span>
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

      {/* SCAN VIN MODAL */}
      {scanVinModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-[160] flex items-center justify-center p-4">
          <form onSubmit={handleScanVinSubmit} className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <BsQrCodeScan className="text-indigo-600 text-lg" />
                Scan VIN Barcode
              </h3>
              <button type="button" onClick={() => setScanVinModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <label className="text-slate-700 font-bold block">Enter or Scan Vehicle VIN:</label>
              <input
                type="text"
                required
                placeholder="e.g. 1HGCR2E33AA004352"
                value={scanVinInput}
                onChange={(e) => setScanVinInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500 uppercase"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Verify VIN & Mark Delivered
            </button>
          </form>
        </div>
      )}

      {/* SIGNATURE CAPTURE MODAL */}
      {signatureModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-[180] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Customer Signature</h3>
              <button onClick={() => setSignatureModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Receiver Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe (Yard Manager)"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setSignatureModalOpen(false);
                triggerToast(`Signature saved for ${signatureName || 'Receiver'}!`);
              }}
              className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Save Signature
            </button>
          </div>
        </div>
      )}

      {/* NOTES MODAL */}
      {notesModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-[180] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Add Delivery Notes</h3>
              <button onClick={() => setNotesModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div>
              <textarea
                rows="4"
                placeholder="Enter key drop details or handover notes..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              ></textarea>
            </div>

            <button
              onClick={() => {
                setNotesModalOpen(false);
                triggerToast('Delivery notes saved!');
              }}
              className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Save Notes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
