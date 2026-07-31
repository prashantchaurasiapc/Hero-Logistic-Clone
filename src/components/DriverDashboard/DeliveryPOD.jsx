import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle, FiClock, FiMapPin, FiPhone, FiChevronRight,
  FiCamera, FiFileText, FiAlertTriangle, FiRefreshCw,
  FiTruck, FiInfo, FiEdit2, FiArrowLeft, FiCheck, FiX,
  FiUserCheck, FiMoon, FiSun, FiLock
} from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';

export default function DeliveryPOD() {
  const navigate = useNavigate();

  // Mode & Toast States
  const [driverMode, setDriverMode] = useState('Flexible / Owner-Driver');
  const [deliveryMode, setDeliveryMode] = useState('normal'); // 'normal' or 'after-hours'
  const [toastMsg, setToastMsg] = useState('');
  const [wrongVehicleAlert, setWrongVehicleAlert] = useState(true);

  // Modals
  const [scanVinModalOpen, setScanVinModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [scanVinInput, setScanVinInput] = useState('');
  const [flashlightOn, setFlashlightOn] = useState(false);

  // POD Completion States
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [photoCount, setPhotoCount] = useState(0);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Signature Canvas Ref & States
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
    setSignatureDataUrl(null);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e1b4b';

    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        setSignatureDataUrl(canvas.toDataURL());
      }
    }
  };

  // Cars assigned to this delivery step (Stop 2 - Auto World Sydney)
  const [cars, setCars] = useState([
    { id: 1, vin: '1HGCM82633A004352', makeModel: 'Toyota Camry', plate: 'ABC123', delivered: true, time: '01:57 PM', assigned: true },
    { id: 2, vin: 'JM1BM1W7X01331234', makeModel: 'Mazda 3', plate: 'CDE789', delivered: true, time: '01:59 PM', assigned: true },
    { id: 3, vin: '5YJ3E1EA5PF123456', makeModel: 'Tesla Model 3', plate: 'GHI012', delivered: false, time: null, assigned: true }
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const toggleDelivery = (id) => {
    setCars(cars.map(c => {
      if (c.id === id) {
        const nextState = !c.delivered;
        triggerToast(nextState ? `${c.makeModel} marked as Delivered!` : `${c.makeModel} un-marked.`);
        return { ...c, delivered: nextState, time: nextState ? '02:05 PM' : null };
      }
      return c;
    }));
  };

  const deliveredCount = cars.filter(c => c.delivered).length;
  const totalCarsCount = cars.length;
  const progressPercent = Math.round((deliveredCount / totalCarsCount) * 100);

  const handleConfirmDelivery = () => {
    if (deliveryMode === 'normal' && !hasSignature) {
      triggerToast('⚠️ Customer signature required for normal business hours delivery!');
      setSignatureModalOpen(true);
      return;
    }

    if (deliveredCount < totalCarsCount) {
      triggerToast(`⚠️ Please mark all ${totalCarsCount} cars as delivered first!`);
      return;
    }

    triggerToast('🎉 STOP DELIVERED SUCCESSFUL! Load LD-3987 updated & dispatch notified.');
    setTimeout(() => {
      navigate('/driver/active-run');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6 pb-24 text-left">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[150] bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border border-slate-700">
          <FiCheckCircle className="text-[#ffcc00] text-base shrink-0" />
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
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Delivery & POD</h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Scan or select cars to deliver at Stop 2: Auto World Sydney</p>
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
        </div>
      </div>

      {/* THREE-COLUMN MASTER WEB DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= LEFT COLUMN: MODULE META & INSTRUCTIONS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-indigo-700 tracking-tight">15.7 Delivery & POD</span>
              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Owner-Driver
              </span>
            </div>

            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Scan or select the cars to deliver at this step. Hero will only allow correct cars for this destination. Complete POD if required and confirm delivery.
            </p>
          </div>

          {/* LEGEND CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LEGEND</div>
            <div className="space-y-2 font-bold">
              <div className="flex items-center gap-2.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Correct Car (To Deliver)</span>
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

          {/* DELIVERY LOCATION CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DELIVERY LOCATION</div>
            <div className="flex items-start gap-3">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-base">📍</span>
              <div>
                <div className="font-black text-slate-900 text-sm">Auto World Sydney</div>
                <div className="text-slate-500 font-medium mt-0.5">45 Parramatta Rd, Sydney NSW 2150</div>
              </div>
            </div>
          </div>

          {/* LOAD SUMMARY COUNTER */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LOAD SUMMARY</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase">Total Cars</div>
                <div className="text-xl font-black text-slate-900">8</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <div className="text-[10px] text-emerald-700 font-extrabold uppercase">Delivered</div>
                <div className="text-xl font-black text-emerald-700">2</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <div className="text-[10px] text-amber-800 font-extrabold uppercase">Remaining</div>
                <div className="text-xl font-black text-amber-700">6</div>
              </div>
            </div>
          </div>

          {/* HELP INSTRUCTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs text-slate-700">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HELP & GUIDANCE</div>
            <ul className="space-y-2.5 font-semibold">
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-600 shrink-0">📱</span>
                <span>Scan VIN barcode or tap a car to mark as delivered.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-600 shrink-0">ℹ️</span>
                <span>Only cars assigned to this delivery location can be delivered here.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 shrink-0">⚠️</span>
                <span>Wrong cars are blocked from being delivered.</span>
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
            </div>
            <button
              onClick={() => {
                const nextMode = driverMode === 'Flexible / Owner-Driver' ? 'Assigned Mode' : 'Flexible / Owner-Driver';
                setDriverMode(nextMode);
                triggerToast(`Mode switched to: ${nextMode}`);
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl border border-slate-800 transition-all cursor-pointer"
            >
              Switch Mode
            </button>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN: MAIN DELIVERY & POD CONTENT (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* LOAD STEP BANNER CARD */}
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
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Stop</span>
                  <span className="font-mono text-slate-900">2 of 3</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Delivery Time</span>
                  <span className="font-mono text-slate-900">ETA 02:30 PM</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Total Cars to Deliver</span>
                  <span className="font-mono text-slate-900">3 Cars</span>
                </div>
              </div>
            </div>

            {/* PURPLE SCAN BANNER */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3 text-purple-950 text-xs font-bold shadow-xs">
              <BsQrCodeScan className="text-2xl text-purple-700 shrink-0" />
              <div>
                <div className="font-black text-purple-900 text-sm">Scan or select each car to deliver at this location.</div>
                <div className="text-purple-700 font-medium text-[11px]">Only correct cars for this destination are allowed.</div>
              </div>
            </div>
          </div>

          {/* CARS TO DELIVER AT THIS LOCATION SECTION */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">CARS TO DELIVER AT THIS LOCATION ({totalCarsCount})</h3>
                <p className="text-xs text-slate-500 font-medium">Verify each vehicle before marking as delivered.</p>
              </div>

              <button
                onClick={() => setScanVinModalOpen(true)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs px-3.5 py-2 rounded-xl border border-indigo-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <BsQrCodeScan className="text-indigo-600" />
                <span>Scan VIN</span>
              </button>
            </div>

            {/* CARS LIST */}
            <div className="divide-y divide-slate-200/80 bg-slate-50/50 border border-slate-200 rounded-2xl overflow-hidden">
              {cars.map((car, idx) => (
                <div 
                  key={car.id} 
                  className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                    car.delivered ? 'bg-emerald-50/50' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleDelivery(car.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all shrink-0 ${
                        car.delivered ? 'bg-emerald-500 text-white shadow-xs' : 'border-2 border-slate-300 bg-white text-transparent hover:border-slate-400'
                      }`}
                    >
                      ✓
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-800">VIN: {car.vin}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        {car.makeModel} <span className="text-slate-500 font-mono text-[11px]">({car.plate})</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Assigned to this step</span>
                      {car.delivered ? (
                        <span className="text-emerald-700 text-xs font-black">Delivered {car.time}</span>
                      ) : (
                        <span className="text-slate-400 text-xs font-bold">Not Delivered</span>
                      )}
                    </div>
                    <FiChevronRight className="text-slate-400" />
                  </div>
                </div>
              ))}
            </div>

            {/* WRONG VEHICLE SCANNED ALERT BANNER */}
            {wrongVehicleAlert && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start justify-between gap-3 text-rose-900 text-xs shadow-xs">
                <div className="flex items-start gap-3">
                  <FiAlertTriangle className="text-rose-600 text-lg mt-0.5 shrink-0" />
                  <div>
                    <div className="font-black text-rose-900 text-xs uppercase tracking-wide">Wrong Vehicle Scanned</div>
                    <div className="text-rose-700 font-medium text-[11px] mt-0.5">
                      <strong className="font-mono">VIN: WAUZZZ4G5HN123456</strong> is not assigned to this delivery location (Auto World Sydney). Please scan a correct vehicle.
                    </div>
                  </div>
                </div>

                <button onClick={() => setWrongVehicleAlert(false)} className="text-rose-400 hover:text-rose-700 cursor-pointer p-1">
                  <FiX className="text-base" />
                </button>
              </div>
            )}

            {/* PROGRESS & DELIVERED COUNTER */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  ✓
                </div>
                <div>
                  <div className="font-black text-slate-900 text-xs">{deliveredCount} of {totalCarsCount} Cars Delivered</div>
                  <div className="text-slate-500 font-medium text-[11px]">You must deliver all {totalCarsCount} cars for this stop.</div>
                </div>
              </div>

              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 text-emerald-700 font-black text-xs flex items-center justify-center bg-white shadow-xs">
                {progressPercent}%
              </div>
            </div>

          </div>

          {/* COMPLETE DELIVERY (POD) SECTION */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">COMPLETE DELIVERY (POD)</h3>
                <p className="text-xs text-slate-500 font-medium">Proof of delivery items required for this customer.</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                <FiCheck className="text-xs" /> POD Required
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Customer Signature */}
              <div 
                onClick={() => setSignatureModalOpen(true)}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold">✏️</span>
                  <div>
                    <div className="font-black text-slate-900">Customer Signature</div>
                    <div className="text-slate-500 font-medium text-[11px]">
                      {hasSignature ? `Signed by: ${signatureName || 'Receiver'}` : 'Capture digital signature on glass'}
                    </div>
                    {signatureDataUrl && (
                      <div className="mt-2 p-1.5 bg-white border border-slate-200 rounded-xl w-36 h-12 overflow-hidden flex items-center justify-center shadow-2xs">
                        <img src={signatureDataUrl} alt="Signature Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    hasSignature ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {hasSignature ? 'Completed ✓' : 'Required >'}
                  </span>
                  <FiChevronRight className="text-slate-400" />
                </div>
              </div>

              {/* Delivery Photos */}
              <div 
                onClick={() => setPhotoModalOpen(true)}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-bold">📷</span>
                  <div>
                    <div className="font-black text-slate-900">Delivery Photos</div>
                    <div className="text-slate-500 font-medium text-[11px]">
                      {photoCount > 0 ? `${photoCount} photos uploaded` : 'Take photos of vehicle condition on drop-off'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    photoCount >= 2 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {photoCount >= 2 ? 'Completed ✓' : 'Required (2) >'}
                  </span>
                  <FiChevronRight className="text-slate-400" />
                </div>
              </div>

              {/* Delivery Notes */}
              <div 
                onClick={() => setNotesModalOpen(true)}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-bold">📝</span>
                  <div>
                    <div className="font-black text-slate-900">Delivery Notes</div>
                    <div className="text-slate-500 font-medium text-[11px]">
                      {deliveryNotes ? `Note: "${deliveryNotes.substring(0, 30)}..."` : 'Add handover comments or key details'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
                    Optional &gt;
                  </span>
                  <FiChevronRight className="text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* DELIVERY OPTIONS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">DELIVERY OPTIONS</h3>
              <p className="text-slate-500 font-medium">Choose how you are completing this delivery.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Normal Delivery */}
              <div 
                onClick={() => setDeliveryMode('normal')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  deliveryMode === 'normal' 
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">🏠</span>
                    <span>Normal Delivery</span>
                  </div>
                  <input type="radio" checked={deliveryMode === 'normal'} onChange={() => setDeliveryMode('normal')} className="accent-indigo-600 w-4 h-4" />
                </div>

                <p className="text-slate-600 font-medium text-[11px] leading-relaxed mb-3">
                  Deliver during business hours and get customer signature.
                </p>

                <div className="space-y-1.5 font-bold text-[11px] text-slate-700">
                  <div className="flex items-center gap-2 text-indigo-900">
                    <FiCheck className="text-indigo-600" />
                    <span>Customer signature required</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-900">
                    <FiCheck className="text-indigo-600" />
                    <span>Deliver to receiver / staff</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-900">
                    <FiCheck className="text-indigo-600" />
                    <span>Standard notifications</span>
                  </div>
                </div>
              </div>

              {/* Option 2: After-Hours Delivery */}
              <div 
                onClick={() => setDeliveryMode('after-hours')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  deliveryMode === 'after-hours' 
                    ? 'border-purple-600 bg-purple-50/40 shadow-xs' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">🌙</span>
                    <span>After-Hours Delivery</span>
                  </div>
                  <input type="radio" checked={deliveryMode === 'after-hours'} onChange={() => setDeliveryMode('after-hours')} className="accent-purple-600 w-4 h-4" />
                </div>

                <p className="text-slate-600 font-medium text-[11px] leading-relaxed mb-3">
                  No one available on-site. Leave in a safe, agreed place.
                </p>

                <div className="space-y-1.5 font-bold text-[11px] text-slate-700">
                  <div className="flex items-center gap-2 text-purple-900">
                    <FiCheck className="text-purple-600" />
                    <span>No signature required</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-900">
                    <FiCheck className="text-purple-600" />
                    <span>Follow after-hours instructions</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-900">
                    <FiCheck className="text-purple-600" />
                    <span>Photos & location required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BIG ACTION CONFIRMATION BUTTON */}
            <button
              onClick={handleConfirmDelivery}
              className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white font-black text-sm py-4 px-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <FiCheckCircle className="text-xl" />
              <span>Confirm Stop as Delivered</span>
            </button>
            <p className="text-center text-[10px] text-slate-500 font-semibold">This will complete this stop and update your run.</p>

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
                  <div className="font-bold text-slate-900">Delivered</div>
                  <div className="text-[11px] text-slate-500">Once all stops are delivered, the load is completed.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full border-2 border-indigo-600 text-indigo-600 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">●</span>
                <div>
                  <div className="font-bold text-slate-900">Notifications Sent</div>
                  <div className="text-[11px] text-slate-500">Hero will automatically notify dispatch and customers as per company settings.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">○</span>
                <div>
                  <div className="font-bold text-slate-400">Return to Active Run</div>
                  <div className="text-[11px] text-slate-500">You will return to the Active Run screen to view remaining steps (if any).</div>
                </div>
              </div>
            </div>
          </div>

          {/* AFTER-HOURS DELIVERY INSTRUCTIONS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AFTER-HOURS DELIVERY</div>
            <ul className="space-y-2 font-semibold text-slate-700">
              <li className="flex items-center gap-2">
                <span>🅿️</span>
                <span>Park in safe, agreed location</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📷</span>
                <span>Take required photos</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🔒</span>
                <span>Follow gate/keys instructions</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📝</span>
                <span>Add delivery notes (where keys left, contact made etc.)</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>GPS location & time recorded automatically</span>
              </li>
            </ul>
            <p className="text-[10.5px] font-bold text-purple-700 italic border-t border-slate-100 pt-2">
              No signature required if approved for after-hours.
            </p>
          </div>

          {/* REQUIREMENTS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REQUIREMENTS</div>
            <div className="space-y-2 font-semibold text-slate-700">
              <div className="flex items-center gap-2 text-emerald-600">
                <span>✓</span>
                <span>Deliver all assigned cars for this step.</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <span>✓</span>
                <span>Complete required POD items to confirm delivery.</span>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QUICK ACTIONS</div>
            <div className="space-y-2">
              <button onClick={() => triggerToast('Calling Dispatch hotline...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📞 Call Dispatch</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setLocationModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📍 View Location</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => navigate('/driver/jobs')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📄 View Load Details</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* DEVELOPER NOTES AT THE BOTTOM */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs text-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-black tracking-tight">
          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono text-[11px]">&lt;/&gt;</span>
          <span>DEVELOPER NOTES – DELIVERY & POD</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-4 text-slate-600 border-t border-slate-100 pt-4">
          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">1. PURPOSE</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>Allow driver to deliver only correct cars.</li>
              <li>Complete POD & confirm.</li>
              <li>Support normal & after-hours.</li>
            </ul>
          </div>

          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">2. KEY FEATURES</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>Scan/select cars to deliver.</li>
              <li>Show assigned cars only.</li>
              <li>Block wrong cars.</li>
              <li>POD: signature, photos, notes.</li>
            </ul>
          </div>

          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">3. DATA SOURCES</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>Loads & Stops module</li>
              <li>Vehicles / Items module</li>
              <li>Customer settings (POD rules)</li>
              <li>Driver actions & time</li>
            </ul>
          </div>

          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">4. ACTION LOGIC</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>Validate vehicle location.</li>
              <li>Wrong vehicle = show error & block.</li>
              <li>Auto-record time, GPS, driver.</li>
            </ul>
          </div>

          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">5. INTEGRATIONS</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>Notifications (dispatch/customer)</li>
              <li>Customer portal update</li>
              <li>Audit log & GPS services</li>
            </ul>
          </div>

          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">6. OFFLINE SUPPORT</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>All actions cached offline.</li>
              <li>Photos & POD cached.</li>
              <li>Sync when online.</li>
            </ul>
          </div>

          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">7. COMPANY SETTINGS</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>POD requirements per customer.</li>
              <li>After-hours instructions.</li>
              <li>Notification rules.</li>
            </ul>
          </div>
        </div>
      </div>



      {/* CUSTOMER SIGNATURE MODAL */}
      {signatureModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <span>✏️</span> Customer Signature POD
              </h3>
              <button onClick={() => setSignatureModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Receiver Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Mark Robinson"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold block">Sign on Screen Below *</label>
                  {hasSignature && (
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Signature Captured
                    </span>
                  )}
                </div>
                
                {/* REAL WORKING HTML5 SIGNATURE CANVAS */}
                <div className="border-2 border-indigo-200 bg-indigo-50/20 rounded-2xl h-44 relative overflow-hidden shadow-inner touch-none bg-white">
                  {!hasSignature && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 font-semibold text-xs select-none">
                      <span className="text-2xl mb-1 opacity-70">✍️</span>
                      <span>Draw signature here with mouse or finger</span>
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={176}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full cursor-crosshair block"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleClearSignature}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
              >
                Clear Drawing
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!hasSignature) {
                    triggerToast('⚠️ Please draw a signature on the screen first!');
                    return;
                  }
                  if (!signatureName.trim()) {
                    triggerToast('⚠️ Please enter the Receiver Full Name!');
                    return;
                  }
                  const canvas = canvasRef.current;
                  if (canvas) {
                    setSignatureDataUrl(canvas.toDataURL());
                  }
                  setSignatureModalOpen(false);
                  triggerToast(`✓ Customer signature for ${signatureName} saved to POD file!`);
                }}
                className="flex-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
              >
                Save Signature
              </button>
            </div>
          </div>
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
                  Scan Delivery VIN
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Align VIN barcode inside camera frame or select from delivery list</p>
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
                DELIVERY CAMERA SCANNER ACTIVE
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
              <label className="text-slate-700 font-bold block text-[11px]">Select Delivery Vehicle to Scan:</label>
              <select
                value={scanVinInput}
                onChange={(e) => setScanVinInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Choose Car from Delivery List --</option>
                {cars.filter(c => !c.delivered).map(c => (
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
                const matchedCar = cars.find(c => c.id === targetId) || cars.find(c => !c.delivered) || cars[0];
                
                setScanVinModalOpen(false);
                toggleDelivery(matchedCar.id);
                triggerToast(`✅ VIN ${matchedCar.vin} Scanned & Delivered! ${matchedCar.makeModel}`);
                setScanVinInput('');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <FiCheckCircle className="text-base" />
              <span>Simulate VIN Scan & Deliver Car</span>
            </button>

            <p className="text-center text-[10px] text-slate-500 font-semibold">
              Validates delivery VIN against destination Manifest Auto World Sydney.
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
                Add Delivery Photos (POD)
              </h3>
              <button onClick={() => setPhotoModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-6 text-center space-y-2">
              <FiCamera className="text-3xl text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Tap to take photo or select file</div>
            </div>

            <button
              onClick={() => {
                setPhotoCount(prev => prev + 1);
                setPhotoModalOpen(false);
                triggerToast('Delivery condition photo added!');
              }}
              className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-black text-xs py-3 rounded-xl transition-all cursor-pointer"
            >
              Upload Photo
            </button>
          </div>
        </div>
      )}

      {/* DELIVERY NOTES MODAL */}
      {notesModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiFileText className="text-indigo-600 text-lg" />
                Delivery Notes
              </h3>
              <button onClick={() => setNotesModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <textarea
              rows="4"
              placeholder="e.g. Left keys in key drop box #4 per receiver request..."
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:outline-none focus:border-indigo-500 font-medium"
            ></textarea>

            <button
              onClick={() => {
                setNotesModalOpen(false);
                triggerToast('Delivery notes saved!');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer"
            >
              Save Delivery Notes
            </button>
          </div>
        </div>
      )}

      {/* VIEW LOCATION MODAL */}
      {locationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiMapPin className="text-indigo-600 text-lg" />
                Delivery Location Details
              </h3>
              <button onClick={() => setLocationModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
              <div className="font-black text-slate-900 text-sm">Auto World Sydney</div>
              <div className="text-slate-600 font-semibold">45 Parramatta Rd, Sydney NSW 2150</div>
              <div className="text-slate-500">Contact: Mark Wilson (0411 987 654)</div>
            </div>

            <div className="flex gap-2">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-indigo-600 text-white font-extrabold text-xs py-3 rounded-xl text-center shadow-xs"
              >
                Google Maps
              </a>
              <a
                href="https://waze.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-purple-600 text-white font-extrabold text-xs py-3 rounded-xl text-center shadow-xs"
              >
                Waze GPS
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
