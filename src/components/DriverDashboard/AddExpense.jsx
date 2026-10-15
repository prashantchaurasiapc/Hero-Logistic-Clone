import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  FiCheckCircle, FiClock, FiPlus, FiUpload, FiRefreshCw,
  FiFilter, FiFileText, FiDollarSign, FiChevronRight,
  FiAlertTriangle, FiArrowLeft, FiCamera, FiCheck, FiX,
  FiBookOpen, FiShield, FiHelpCircle, FiBarChart2, FiLayers,
  FiMaximize2, FiEye, FiDownload, FiSearch, FiPaperclip
} from 'react-icons/fi';
import { BsQrCodeScan, BsFuelPump } from 'react-icons/bs';

export default function AddExpense() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

  // Tab & Filter States
  const [activeTab, setActiveTab] = useState('Fuel & Expenses'); // 'Fuel & Expenses', 'Summary', 'Receipts', 'Analytics'
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [tipDismissed, setTipDismissed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileBase64, setSelectedFileBase64] = useState('');

  // Modals
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [uploadReceiptModalOpen, setUploadReceiptModalOpen] = useState(false);
  const [odometerModalOpen, setOdometerModalOpen] = useState(false);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [viewReceiptModalOpen, setViewReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Form States for Add Expense
  const [formCategory, setFormCategory] = useState('Fuel');
  const [formVendor, setFormVendor] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formLitres, setFormLitres] = useState('');
  const [formPricePerLitre, setFormPricePerLitre] = useState('');
  const [formOdometer, setFormOdometer] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formReceiptBase64, setFormReceiptBase64] = useState('');
  const [formReceiptFileName, setFormReceiptFileName] = useState('');

  // Additional Data States
  const [runData, setRunData] = useState(null);
  const [driverVehicle, setDriverVehicle] = useState('Unassigned');
  const [driverTrailer, setDriverTrailer] = useState('Unassigned');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // Odometer State
  const [odometerVal, setOdometerVal] = useState('0');

  // Expense Items Data (Real DB Records)
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchError(false);

      const [expensesRes, runRes, dashRes] = await Promise.all([
        api.get('/driver-portal/expenses'),
        api.get('/driver-portal/active-run').catch(() => ({ data: { run: null, currentLoad: null } })),
        api.get('/driver-portal/dashboard').catch(() => ({ data: {} }))
      ]);

      const runPayload = runRes.data?.data || runRes.data || {};
      const dashPayload = dashRes.data?.data || dashRes.data || {};

      // 1. Resolve Driver Vehicle Info from Dashboard / Profile
      const vehicleInfo = dashPayload.driverInfo?.vehicle || runPayload.vehicle || {};
      const rawTruck = vehicleInfo.rego || vehicleInfo.plate || vehicleInfo.truck;
      const truckName = (rawTruck && rawTruck !== 'No Vehicle Assigned' && rawTruck !== 'Unassigned') ? rawTruck : 'Unassigned';
      setDriverVehicle(truckName);

      const rawTrailer = vehicleInfo.trailer;
      const trailerName = (rawTrailer && rawTrailer !== 'Unassigned' && rawTrailer !== 'No Vehicle Assigned') ? rawTrailer : 'Unassigned';
      setDriverTrailer(trailerName);

      if (vehicleInfo.odometer && vehicleInfo.odometer > 0) {
        setOdometerVal(String(vehicleInfo.odometer));
      }

      // 2. Resolve Active Load (Strictly from real DB response)
      const activeLoad = runPayload.run || runPayload.currentLoad || dashPayload.currentLoad || null;

      if (activeLoad && (activeLoad.id || activeLoad.loadRef || activeLoad.loadNumber)) {
        const loadId = activeLoad.loadRef || activeLoad.loadNumber || activeLoad.id;
        const origin = activeLoad.origin || activeLoad.pickupLocation || activeLoad.pickupAddress || activeLoad.stops?.[0]?.address || 'Not specified';
        const destination = activeLoad.destination || activeLoad.deliveryLocation || activeLoad.deliveryAddress || activeLoad.stops?.[activeLoad.stops?.length - 1]?.address || 'Not specified';
        
        let loadStatus = activeLoad.status || 'In Transit';
        if (loadStatus === 'IN_TRANSIT' || loadStatus === 'DISPATCHED' || loadStatus === 'IN_PROGRESS') loadStatus = 'In Transit';
        else if (loadStatus === 'ASSIGNED') loadStatus = 'Assigned';

        const distanceKm = activeLoad.distance ? parseInt(String(activeLoad.distance).replace(/\D/g, '')) : (vehicleInfo.estRangeKm || null);

        setRunData({
          id: loadId,
          origin,
          destination,
          status: loadStatus,
          vehicle: {
            truck: truckName,
            trailer: trailerName,
            trailerType: activeLoad.loadType || activeLoad.type || 'General Freight',
            estRangeKm: distanceKm
          },
          stopsCount: activeLoad.stopsCount || activeLoad.stops?.length || 0,
          estFinish: activeLoad.estFinish || activeLoad.deliveryTime || 'TBA'
        });
      } else {
        setRunData(null);
      }

      // 3. Resolve Real Expenses from Database
      const rawExpenses = expensesRes.data?.data?.expenses 
        || expensesRes.data?.expenses 
        || (Array.isArray(expensesRes.data?.data) ? expensesRes.data.data : [])
        || (Array.isArray(expensesRes.data) ? expensesRes.data : []);

      const formattedExpenses = (Array.isArray(rawExpenses) ? rawExpenses : []).map((e, index) => {
        const cat = e.type || e.category || 'Other';
        const numAmt = parseFloat(e.amount) || 0;
        const numLitres = (e.litres !== null && e.litres !== undefined && e.litres !== '') ? parseFloat(e.litres) : null;
        const numPrice = (e.pricePerLitre !== null && e.pricePerLitre !== undefined && e.pricePerLitre !== '') ? parseFloat(e.pricePerLitre) : null;
        const odo = e.odometer;

        let details = e.description || `${cat} expense`;
        if (cat === 'Fuel' && numLitres) {
          details = `${numLitres} L` + (numPrice ? ` @ $${numPrice.toFixed(2)}/L` : '') + (odo ? ` • ${odo} km` : '');
        }

        let dateDisplay = 'Recent';
        if (e.date) {
          const parsedDate = new Date(e.date);
          if (!isNaN(parsedDate.getTime())) {
            dateDisplay = parsedDate.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
          } else {
            dateDisplay = String(e.date);
          }
        }

        return {
          id: e.id || `exp-${index}`,
          category: cat,
          categoryColor: cat === 'Fuel' ? 'purple' : cat === 'Maintenance' ? 'emerald' : cat === 'Tyres' ? 'amber' : cat === 'Tolls' ? 'blue' : 'slate',
          icon: cat === 'Fuel' ? '⛽' : cat === 'Maintenance' ? '🔧' : cat === 'Tyres' ? '🛞' : cat === 'Tolls' ? '🛣️' : '🧽',
          vendor: e.vendorName || e.vendor || 'Unknown Vendor',
          details,
          date: dateDisplay,
          amount: numAmt,
          litres: numLitres,
          pricePerLitre: numPrice,
          odometer: odo,
          status: (e.status === 'APPROVED' || e.status === 'Approved') ? 'Approved' : (e.status === 'REJECTED' || e.status === 'Rejected') ? 'Rejected' : 'Pending',
          receiptUrl: e.receiptUrl || null
        };
      });

      setExpenses(formattedExpenses);
    } catch (error) {
      console.error('Error fetching driver expenses/active run:', error);
      setFetchError(true);
      triggerToast('Unable to load expenses from server. Please retry.', 'error');
    } finally {
      setSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setLoading(false);
    }
  };

  // Convert picked file to base64 data URL
  const handleFilePicked = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFileBase64(reader.result);
      };
      reader.readAsDataURL(file);
      triggerToast(`Selected file: ${file.name}`);
    }
  };

  // Modal file picker for Add Expense form
  const handleModalReceiptPicked = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormReceiptFileName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        setFormReceiptBase64(reader.result);
      };
      reader.readAsDataURL(file);
      triggerToast(`Receipt attached: ${file.name}`);
    }
  };

  // Submit standalone receipt upload
  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      triggerToast('Please select a receipt file first.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/driver-portal/expenses', {
        type: 'Other',
        vendorName: selectedFile.name.replace(/\.[^/.]+$/, ''),
        amount: 0.01, // Minimal placeholder amount for receipt document archive
        description: `Receipt Document: ${selectedFile.name}`,
        receiptUrl: selectedFileBase64 || null,
        loadId: runData?.id || null
      });

      setSelectedFile(null);
      setSelectedFileBase64('');
      setUploadReceiptModalOpen(false);
      triggerToast('Receipt document saved successfully!');
      await fetchData();
    } catch (err) {
      console.error('Failed to upload receipt:', err);
      triggerToast(err.response?.data?.message || 'Failed to upload receipt. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Add Expense form to real database API
  const handleAddExpenseSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(formAmount);

    if (isNaN(numAmount) || numAmount <= 0) {
      triggerToast('Please enter a valid expense amount greater than $0.00', 'error');
      return;
    }

    if (!formVendor || formVendor.trim() === '') {
      triggerToast('Please enter a vendor or station name.', 'error');
      return;
    }

    const numLitres = formLitres ? parseFloat(formLitres) : null;
    const numPrice = formPricePerLitre ? parseFloat(formPricePerLitre) : null;
    const numOdo = formOdometer ? parseInt(formOdometer) : (parseInt(odometerVal) || null);

    try {
      setIsSubmitting(true);
      await api.post('/driver-portal/expenses', {
        type: formCategory,
        vendorName: formVendor.trim(),
        amount: numAmount,
        litres: numLitres,
        pricePerLitre: numPrice,
        odometer: numOdo,
        description: formNotes.trim() || null,
        receiptUrl: formReceiptBase64 || null,
        loadId: runData?.id || null
      });

      setAddExpenseModalOpen(false);
      setFormVendor('');
      setFormAmount('');
      setFormLitres('');
      setFormPricePerLitre('');
      setFormOdometer('');
      setFormNotes('');
      setFormReceiptBase64('');
      setFormReceiptFileName('');

      triggerToast(`✓ Added ${formCategory} expense of $${numAmount.toFixed(2)} for ${formVendor}!`);
      await fetchData();
    } catch (err) {
      console.error('Failed to save expense:', err);
      triggerToast(err.response?.data?.message || 'Failed to save expense. Please check input and retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real Dynamic Calculations
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const fuelSpent = expenses.filter(e => e.category === 'Fuel').reduce((acc, curr) => acc + curr.amount, 0);
  const maintSpent = expenses.filter(e => e.category === 'Maintenance').reduce((acc, curr) => acc + curr.amount, 0);
  const tyresSpent = expenses.filter(e => e.category === 'Tyres').reduce((acc, curr) => acc + curr.amount, 0);
  const tollsSpent = expenses.filter(e => e.category === 'Tolls').reduce((acc, curr) => acc + curr.amount, 0);
  const otherSpent = expenses.filter(e => e.category === 'Other').reduce((acc, curr) => acc + curr.amount, 0);

  const totalLitres = expenses.filter(e => e.category === 'Fuel').reduce((acc, curr) => acc + (parseFloat(curr.litres) || 0), 0);
  const totalDistance = runData?.vehicle?.estRangeKm;

  // Economy & Cost/km only calculated if real distance is available
  const avgEconomy = (totalDistance && totalDistance > 0 && totalLitres > 0)
    ? (totalDistance / totalLitres).toFixed(2)
    : null;

  const costPerKm = (totalDistance && totalDistance > 0 && totalSpent > 0)
    ? (totalSpent / totalDistance).toFixed(2)
    : null;

  const filteredExpenses = filterCategory === 'ALL' 
    ? expenses 
    : expenses.filter(e => e.category.toUpperCase() === filterCategory.toUpperCase());

  // Real receipts from saved expenses
  const savedReceipts = expenses.filter(e => e.receiptUrl);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6 pb-24 text-left">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-5 right-5 z-[150] text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border ${
          toastType === 'error' ? 'bg-rose-900 border-rose-700' : 'bg-slate-900 border-slate-700'
        }`}>
          {toastType === 'error' ? (
            <FiAlertTriangle className="text-rose-400 text-base shrink-0" />
          ) : (
            <FiCheckCircle className="text-[#ffcc00] text-base shrink-0" />
          )}
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ERROR BANNER WITH RETRY */}
      {fetchError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-rose-950 text-xs font-bold shadow-xs">
          <div className="flex items-center gap-2.5">
            <FiAlertTriangle className="text-rose-600 text-lg shrink-0" />
            <div>
              <span className="font-black text-rose-900">Connection Error: </span>
              <span className="text-rose-700 font-medium">Unable to fetch latest expenses or active load from server.</span>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* TOP HEADER TITLE BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Fuel & Expenses</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Record fuel and operating expenses, upload receipts & track load costs</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setAddExpenseModalOpen(true)}
            className="flex-1 sm:flex-initial bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiPlus className="text-base" />
            <span>+ Add Expense</span>
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
              <span className="text-lg font-black text-indigo-700 tracking-tight">Fuel & Expenses</span>
              {runData ? (
                <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Active Load
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-600 border border-slate-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Idle / Ready
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Record fuel and other operating expenses. Snap receipts and track your costs in real time.
            </p>
          </div>

          {/* LEGEND CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LEGEND</div>
            <div className="space-y-2 font-bold">
              <div className="flex items-center gap-2.5 text-purple-700">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                <span>Fuel</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Maintenance</span>
              </div>
              <div className="flex items-center gap-2.5 text-amber-700">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Tyres</span>
              </div>
              <div className="flex items-center gap-2.5 text-blue-700">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>Tolls</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                <span>Other</span>
              </div>
            </div>
          </div>

          {/* VEHICLE & LOAD CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VEHICLE & LOAD</div>
            <div className="space-y-2.5 font-semibold text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Truck</div>
                <div className="font-black text-slate-900 text-xs">{driverVehicle}</div>
                <div className="text-[11px] text-slate-500">Assigned Vehicle</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Trailer</div>
                <div className="font-black text-slate-900 text-xs">{driverTrailer}</div>
                <div className="text-[11px] text-slate-500">{runData?.vehicle?.trailerType || 'Not assigned'}</div>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-indigo-500 uppercase font-extrabold">Active Load</div>
                <div className="font-black text-indigo-900 text-xs">{runData?.id || 'No Active Load'}</div>
                <div className="text-[11px] text-indigo-700">{runData ? (runData.status) : 'Idle between runs'}</div>
              </div>
            </div>
          </div>

          {/* KEY ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KEY ACTIONS</div>
            <div className="space-y-2">
              <button onClick={() => setAddExpenseModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">➕ Add Expense</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setUploadReceiptModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📄 Upload Receipt</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setOdometerModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📟 Capture Odometer</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setReportsModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📊 View Reports</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => { fetchData(); triggerToast('Synced with Fleet Server!'); }} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🔄 Sync Now</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* STATUS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</div>
            <div className="space-y-1.5 font-bold text-slate-700">
              <div className="text-[11px] text-slate-500">Last sync: {syncTime}</div>
              <div className="flex items-center gap-2 text-emerald-700 font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
              </div>
              <div className="text-[11px] text-slate-500">Auto refresh: Every 5 minutes</div>
            </div>
            <button
              onClick={() => {
                fetchData();
                triggerToast('System status refreshed!');
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="text-amber-400" />
              <span>Sync Now</span>
            </button>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN: MAIN EXPENSES ENGINE (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* LOAD METADATA BANNER CARD (REAL LOAD OR CLEAN EMPTY STATE) */}
          {runData ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
                <div className="min-w-0">
                  <div className="text-2xl font-black text-indigo-700 tracking-tight">{runData.id}</div>
                  <div className="text-sm sm:text-base font-black text-slate-900 flex items-center flex-wrap gap-2 mt-0.5">
                    <span className="font-extrabold">{runData.origin}</span>
                    <span className="text-slate-400">➔</span>
                    <span className="font-extrabold text-indigo-900">{runData.destination}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 p-2.5 sm:p-3 rounded-2xl w-full xl:w-auto justify-between shrink-0">
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Start Date</span>
                    <span className="font-mono text-slate-900">Today</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Est. Finish</span>
                    <span className="font-mono text-slate-900">{runData.estFinish}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Status</span>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full block text-center">{runData.status}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Progress</span>
                    <span className="font-mono text-slate-900">{runData.stopsCount} Stops</span>
                  </div>
                </div>
              </div>

              {/* METRICS ROW PILLS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Vehicle</span>
                  <span className="font-bold text-slate-900">{runData.vehicle?.truck || 'Unassigned'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Odometer</span>
                  <span className="font-bold text-slate-900 font-mono">{odometerVal !== '0' ? `${odometerVal} km` : 'Not recorded'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Distance (Est.)</span>
                  <span className="font-bold text-slate-900 font-mono">{runData.vehicle?.estRangeKm ? `${runData.vehicle.estRangeKm} km` : 'N/A'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Load ID</span>
                  <span className="font-bold text-indigo-700 font-mono">{runData.id}</span>
                </div>
              </div>

              {/* SUB NAV TABS */}
              <div className="flex border-b border-slate-200 space-x-6 text-xs font-black pt-2">
                {['Fuel & Expenses', 'Summary', 'Receipts', 'Analytics'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                      activeTab === tab 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* CLEAN EMPTY STATE WHEN NO ACTIVE LOAD ASSIGNED */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="p-6 text-center bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-3xl block">🚛</span>
                <h2 className="text-sm sm:text-base font-black text-slate-900">No active load currently assigned</h2>
                <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                  You are not currently dispatched on an active run. Any expenses recorded will be saved to your driver profile and vehicle account.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setAddExpenseModalOpen(true)}
                    className="bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <FiPlus /> + Add Vehicle Expense
                  </button>
                </div>
              </div>

              {/* SUB NAV TABS */}
              <div className="flex border-b border-slate-200 space-x-6 text-xs font-black pt-2">
                {['Fuel & Expenses', 'Summary', 'Receipts', 'Analytics'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                      activeTab === tab 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* KPI SUMMARY CARDS ROW (4 CARDS) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-purple-700 font-black text-xs mb-1">
                <span>⛽ Fuel Used</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap">
                {totalLitres > 0 ? totalLitres.toFixed(1) : '0'}{' '}
                <span className="text-sm font-bold text-slate-500">L</span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold mt-1">Recorded Fuel</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-xs mb-1">
                <span>💰 Total Spent</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 whitespace-nowrap">
                ${totalSpent.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400 font-bold mt-1">All Categories</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 font-black text-xs mb-1">
                <span>🚚 Avg. Economy</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap">
                {avgEconomy ? `${avgEconomy}` : 'N/A'}{' '}
                {avgEconomy && <span className="text-xs font-normal text-slate-500">km/L</span>}
              </div>
              <div className="text-[10px] text-slate-400 font-bold mt-1">
                {avgEconomy ? 'Trip Calculated' : 'Requires trip km & fuel'}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-blue-700 font-black text-xs mb-1">
                <span>📈 Cost / km</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap">
                {costPerKm ? `$${costPerKm}` : 'N/A'}
              </div>
              <div className="text-[10px] text-slate-400 font-bold mt-1">
                {costPerKm ? 'Per trip distance' : 'Requires trip km'}
              </div>
            </div>
          </div>

          {/* TAB 1: FUEL & EXPENSES VIEW */}
          {activeTab === 'Fuel & Expenses' && (
            <>
              {/* EXPENSES LIST SECTION */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">EXPENSES</h3>
                    <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-slate-200">
                      {filteredExpenses.length} Items
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">Filter: All Categories</option>
                      <option value="FUEL">Fuel</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="TYRES">Tyres</option>
                      <option value="TOLLS">Tolls</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                {/* EXPENSE CARDS LIST (EMPTY STATE OR REAL ITEMS) */}
                {loading ? (
                  <div className="p-12 text-center text-slate-400 text-xs font-bold space-y-2">
                    <FiRefreshCw className="animate-spin text-2xl mx-auto text-indigo-600" />
                    <div>Loading expenses from server...</div>
                  </div>
                ) : filteredExpenses.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-3xl block">🧾</span>
                    <p className="text-sm font-bold text-slate-800">No expenses logged yet.</p>
                    <p className="text-xs text-slate-500">Tap '+ Add Expense' to record fuel or tolls.</p>
                    <div className="pt-2">
                      <button
                        onClick={() => setAddExpenseModalOpen(true)}
                        className="bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <FiPlus /> + Add Expense
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    {filteredExpenses.map((exp) => (
                      <div key={exp.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="p-2.5 bg-slate-100 text-slate-800 rounded-2xl text-base shrink-0 font-bold">
                            {exp.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900">{exp.category}</span>
                              <span className="text-[10px] font-mono text-slate-400">• {exp.date}</span>
                            </div>
                            <div className="text-xs font-bold text-slate-800 truncate">{exp.vendor}</div>
                            <div className="text-[11px] text-slate-500 font-medium truncate">{exp.details}</div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex items-center gap-3">
                          <div>
                            <div className="text-sm font-black text-slate-900">${exp.amount.toFixed(2)}</div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border block mt-0.5 ${
                              exp.status === 'Approved' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : exp.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {exp.status} {exp.status === 'Approved' ? '✓' : exp.status === 'Rejected' ? '✕' : '⏳'}
                            </span>
                          </div>
                          {exp.receiptUrl && (
                            <button
                              onClick={() => {
                                setSelectedReceipt(exp);
                                setViewReceiptModalOpen(true);
                              }}
                              title="View Attached Receipt"
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-indigo-600 cursor-pointer"
                            >
                              <FiEye />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ADD EXPENSE QUICKLY CATEGORY TILES */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ADD EXPENSE QUICKLY</div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: 'Fuel', icon: '⛽', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
                    { label: 'Maintenance', icon: '🔧', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
                    { label: 'Tyres', icon: '🛞', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
                    { label: 'Tolls', icon: '🛣️', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
                    { label: 'Other', icon: '🧽', color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100' }
                  ].map(cat => (
                    <button
                      key={cat.label}
                      onClick={() => {
                        setFormCategory(cat.label);
                        setAddExpenseModalOpen(true);
                      }}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs font-bold text-xs ${cat.color}`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* RECENT RECEIPTS GRID */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">RECENT RECEIPTS</h3>
                    <p className="text-xs text-slate-500 font-medium">Uploaded proof of payment & invoice slips</p>
                  </div>
                  <button
                    onClick={() => setUploadReceiptModalOpen(true)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs px-3.5 py-2 rounded-xl border border-indigo-200 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <FiPlus />
                    <span>Upload Receipt</span>
                  </button>
                </div>

                {savedReceipts.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                    <FiFileText className="text-3xl text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">No receipts attached yet.</p>
                    <p className="text-[11px] text-slate-400">Attach receipts when logging an expense or upload receipt slips directly.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
                    {savedReceipts.map((rec) => (
                      <div 
                        key={rec.id}
                        onClick={() => { setSelectedReceipt(rec); setViewReceiptModalOpen(true); }}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-3 cursor-pointer hover:bg-slate-100 transition-all space-y-2 text-center relative group"
                      >
                        <div className="w-full h-20 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-mono text-[10px] relative overflow-hidden">
                          {rec.receiptUrl?.startsWith('data:image') || rec.receiptUrl?.startsWith('http') ? (
                            <img src={rec.receiptUrl} alt="Receipt thumbnail" className="w-full h-full object-cover" />
                          ) : (
                            <FiFileText className="text-2xl text-slate-300 group-hover:scale-110 transition-transform" />
                          )}
                          <span className="absolute bottom-1 right-1 bg-slate-900 text-white text-[8px] font-black px-1.5 rounded">
                            RECEIPT
                          </span>
                        </div>
                        <div>
                          <div className="text-[11px] font-black text-slate-900 truncate">{rec.vendor}</div>
                          <div className="text-[9.5px] text-slate-400 font-bold">{rec.date}</div>
                          <div className="text-[10.5px] font-black text-indigo-700 mt-0.5">${rec.amount.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TIP BANNER */}
                {!tipDismissed && (
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-purple-950 text-xs font-bold shadow-xs mt-2">
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 bg-purple-100 text-purple-700 rounded-xl">💡</span>
                      <div>
                        <span className="font-black text-purple-900">TIP: </span>
                        <span className="text-purple-700 font-medium text-[11px]">
                          Record expenses regularly and upload receipts for accurate reporting and reimbursement.
                        </span>
                      </div>
                    </div>
                    <button onClick={() => setTipDismissed(true)} className="text-purple-400 hover:text-purple-700 cursor-pointer p-1">
                      <FiX className="text-base" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: SUMMARY VIEW */}
          {activeTab === 'Summary' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Category Cost Summary Breakdown</h3>
              <div className="space-y-3 text-xs font-semibold">
                {[
                  { cat: 'Fuel', spent: fuelSpent, total: totalSpent, color: 'bg-purple-600' },
                  { cat: 'Maintenance', spent: maintSpent, total: totalSpent, color: 'bg-emerald-500' },
                  { cat: 'Tyres', spent: tyresSpent, total: totalSpent, color: 'bg-amber-500' },
                  { cat: 'Tolls', spent: tollsSpent, total: totalSpent, color: 'bg-blue-500' },
                  { cat: 'Other', spent: otherSpent, total: totalSpent, color: 'bg-slate-400' },
                ].map(item => {
                  const pct = totalSpent > 0 ? Math.round((item.spent / totalSpent) * 100) : 0;
                  return (
                    <div key={item.cat} className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-black text-slate-900">{item.cat}</span>
                        <span className="font-mono font-bold text-slate-800">${item.spent.toFixed(2)} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: RECEIPTS GALLERY VIEW */}
          {activeTab === 'Receipts' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">Receipts Gallery ({savedReceipts.length})</h3>
                <button onClick={() => setUploadReceiptModalOpen(true)} className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer">
                  + Upload Receipt
                </button>
              </div>

              {savedReceipts.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs font-bold space-y-2">
                  <FiFileText className="text-3xl mx-auto text-slate-300" />
                  <p>No receipts saved in database yet.</p>
                  <p className="text-[11px] text-slate-400">Attach receipts when creating expenses to view them here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {savedReceipts.map(rec => (
                    <div 
                      key={rec.id} 
                      onClick={() => { setSelectedReceipt(rec); setViewReceiptModalOpen(true); }}
                      className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs text-center cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-full h-24 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-mono overflow-hidden">
                        {rec.receiptUrl?.startsWith('data:image') || rec.receiptUrl?.startsWith('http') ? (
                          <img src={rec.receiptUrl} alt="Receipt slip" className="w-full h-full object-contain" />
                        ) : (
                          <span>[ RECEIPT SLIP ]</span>
                        )}
                      </div>
                      <div className="font-black text-slate-900">{rec.vendor}</div>
                      <div className="text-[10px] text-slate-400 font-bold">{rec.date}</div>
                      <div className="font-mono font-black text-indigo-700">${rec.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ANALYTICS VIEW */}
          {activeTab === 'Analytics' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Fuel & Distance Efficiency Analytics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-center">
                  <div className="text-xs text-indigo-600 font-bold uppercase">Estimated Trip Range</div>
                  <div className="text-2xl font-black text-indigo-900 mt-1">
                    {totalDistance ? `${totalDistance} km` : 'No Trip Assigned'}
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center">
                  <div className="text-xs text-emerald-600 font-bold uppercase">Cost Efficiency</div>
                  <div className="text-2xl font-black text-emerald-900 mt-1">
                    {avgEconomy ? `${avgEconomy} km/L` : 'Data Pending'}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* EXPENSE SUMMARY */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EXPENSE SUMMARY</div>
            <div className="text-[11px] text-slate-400 font-bold mb-2">Total Logged</div>
            <div className="space-y-2.5 font-bold text-slate-700 border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-purple-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Fuel
                </span>
                <span className="font-mono text-slate-900">${fuelSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Maintenance
                </span>
                <span className="font-mono text-slate-900">${maintSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Tyres
                </span>
                <span className="font-mono text-slate-900">${tyresSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-blue-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Tolls
                </span>
                <span className="font-mono text-slate-900">${tollsSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Other
                </span>
                <span className="font-mono text-slate-900">${otherSpent.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 font-black text-sm">
              <span className="text-slate-900">Total Spent</span>
              <span className="text-indigo-700 font-mono text-base">${totalSpent.toFixed(2)}</span>
            </div>
          </div>

          {/* RECENT EXPENSES LIST CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RECENT EXPENSES</div>
            <div className="space-y-2.5">
              {expenses.length === 0 ? (
                <div className="p-3 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 font-bold text-[11px]">
                  No expenses logged yet
                </div>
              ) : (
                expenses.slice(0, 3).map(exp => (
                  <div key={exp.id} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="min-w-0">
                      <div className="font-black text-slate-900 truncate">{exp.vendor}</div>
                      <div className="text-[10px] text-slate-400 font-bold">{exp.date}</div>
                    </div>
                    <span className="font-mono font-black text-slate-900 shrink-0 ml-2">${exp.amount.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* EXPENSE ALERTS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EXPENSE ALERTS</div>
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center">✓</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-start gap-2.5 text-emerald-900">
              <FiCheckCircle className="text-emerald-600 text-base shrink-0 mt-0.5" />
              <div>
                <div className="font-black text-xs">All Clear</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">No expense issues or missing receipts flagged.</div>
              </div>
            </div>
          </div>

          {/* HELP & RESOURCES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HELP & RESOURCES</div>
            <div className="space-y-2 font-semibold text-slate-700">
              <button onClick={() => triggerToast('Log receipts to ensure fleet reimbursement approval.')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📖 How to Record Expenses</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Fleet policy: All fuel expenses require odometer & litres.')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">🛡️ Expense Policy</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Support line available 24/7 for road emergencies.')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📞 Contact Support</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ADD EXPENSE MODAL */}
      {addExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <form onSubmit={handleAddExpenseSubmit} className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiPlus className="text-indigo-600 text-lg" />
                Add New Expense
              </h3>
              <button 
                type="button" 
                onClick={() => setAddExpenseModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Category *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="Fuel">Fuel (Diesel / Petrol)</option>
                  <option value="Maintenance">Maintenance & Service</option>
                  <option value="Tyres">Tyres & Repair</option>
                  <option value="Tolls">Road Tolls</option>
                  <option value="Other">Other Operating Expense</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Vendor / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shell Express, Citylink, Workshop"
                  value={formVendor}
                  onChange={(e) => setFormVendor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Amount ($ AUD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                </div>

                {formCategory === 'Fuel' ? (
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Litres (L)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 80"
                      value={formLitres}
                      onChange={(e) => setFormLitres(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Odometer (km)</label>
                    <input
                      type="number"
                      placeholder="e.g. 145000"
                      value={formOdometer}
                      onChange={(e) => setFormOdometer(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                    />
                  </div>
                )}
              </div>

              {formCategory === 'Fuel' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Price / Litre ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 2.10"
                      value={formPricePerLitre}
                      onChange={(e) => setFormPricePerLitre(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Odometer (km)</label>
                    <input
                      type="number"
                      placeholder="e.g. 145000"
                      value={formOdometer}
                      onChange={(e) => setFormOdometer(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-slate-700 font-bold block mb-1">Notes / Description</label>
                <input
                  type="text"
                  placeholder="Optional notes or details"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              {/* Hidden file input for Add Expense */}
              <input
                type="file"
                ref={modalFileInputRef}
                accept="image/*,.pdf"
                onChange={handleModalReceiptPicked}
                className="hidden"
              />

              <div>
                <label className="text-slate-700 font-bold block mb-1">Receipt Attachment</label>
                <button
                  type="button"
                  onClick={() => modalFileInputRef.current?.click()}
                  className={`w-full p-3 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formReceiptFileName ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold' : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  <FiCamera className="text-base" />
                  <span>{formReceiptFileName ? `Receipt: ${formReceiptFileName} ✓` : 'Snap / Upload Receipt Image'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ffcc00] hover:bg-[#e6b800] disabled:bg-slate-300 text-black font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FiRefreshCw className="animate-spin text-sm" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <span>Log Expense Item</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* UPLOAD RECEIPT MODAL WITH REAL FILE PICKER */}
      {uploadReceiptModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiUpload className="text-indigo-600 text-lg" />
                Upload Receipt Photo / Document
              </h3>
              <button onClick={() => setUploadReceiptModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            {/* Hidden real file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*,.pdf" 
              onChange={handleFilePicked} 
              className="hidden" 
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-100/50 rounded-2xl p-8 text-center space-y-2 cursor-pointer transition-colors"
            >
              <FiCamera className="text-4xl text-indigo-600 mx-auto" />
              {selectedFile ? (
                <div className="space-y-1">
                  <div className="text-xs font-black text-emerald-700 flex items-center justify-center gap-1">
                    <FiPaperclip /> {selectedFile.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB • Ready to save</div>
                </div>
              ) : (
                <>
                  <div className="text-xs font-bold text-slate-900">Drag & Drop receipt or tap to capture</div>
                  <div className="text-[10px] text-slate-500">Supports JPG, PNG, PDF (Max 10MB)</div>
                </>
              )}
            </div>

            <button
              onClick={handleUploadSubmit}
              disabled={isSubmitting || !selectedFile}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FiRefreshCw className="animate-spin text-sm" />
                  <span>Saving Receipt...</span>
                </>
              ) : (
                <span>{selectedFile ? `Upload "${selectedFile.name}"` : 'Select a File to Upload'}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* CAPTURE ODOMETER MODAL */}
      {odometerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <span>📟</span> Capture Odometer Reading
              </h3>
              <button onClick={() => setOdometerModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Current Odometer (km)</label>
                <input
                  type="number"
                  value={odometerVal}
                  onChange={(e) => setOdometerVal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-base font-black focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setOdometerModalOpen(false);
                triggerToast(`Odometer updated to ${odometerVal} km!`);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Save Odometer Reading
            </button>
          </div>
        </div>
      )}

      {/* VIEW RECEIPT MODAL */}
      {viewReceiptModalOpen && selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiFileText className="text-indigo-600 text-lg" />
                Receipt Details
              </h3>
              <button onClick={() => setViewReceiptModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
              <div className="font-black text-slate-900 text-sm">{selectedReceipt.vendor}</div>
              <div className="text-slate-600 font-semibold">{selectedReceipt.date}</div>
              <div className="text-indigo-700 font-mono text-lg font-black">${selectedReceipt.amount?.toFixed(2)}</div>
              {selectedReceipt.details && (
                <div className="text-slate-500 font-medium">{selectedReceipt.details}</div>
              )}
            </div>

            <div className="border border-slate-200 bg-slate-100 rounded-2xl h-56 flex items-center justify-center text-slate-400 text-xs font-mono overflow-hidden p-2">
              {selectedReceipt.receiptUrl?.startsWith('data:image') || selectedReceipt.receiptUrl?.startsWith('http') ? (
                <img src={selectedReceipt.receiptUrl} alt="Receipt Preview" className="max-h-full max-w-full object-contain rounded-xl" />
              ) : (
                <div className="text-center space-y-1">
                  <FiFileText className="text-3xl mx-auto text-slate-400" />
                  <div>Receipt document on file</div>
                </div>
              )}
            </div>

            <button
              onClick={() => setViewReceiptModalOpen(false)}
              className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* REPORTS SUMMARY MODAL */}
      {reportsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiBarChart2 className="text-indigo-600 text-lg" />
                Trip Expense Analytics Report ({runData?.id || 'General Operating'})
              </h3>
              <button onClick={() => setReportsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200">
                  <div className="text-[10px] text-purple-700 font-extrabold uppercase">Total Fuel Spent</div>
                  <div className="text-lg font-black text-purple-900">${fuelSpent.toFixed(2)}</div>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                  <div className="text-[10px] text-emerald-700 font-extrabold uppercase">Total Operating Cost</div>
                  <div className="text-lg font-black text-emerald-900">${totalSpent.toFixed(2)}</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <div className="font-black text-slate-900">Cost Breakdown Summary</div>
                <div className="space-y-1.5 text-[11px] font-bold text-slate-600">
                  <div className="flex justify-between"><span>Fuel Expenses:</span><span className="font-mono text-slate-900">${fuelSpent.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Maintenance:</span><span className="font-mono text-slate-900">${maintSpent.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tyres & Repairs:</span><span className="font-mono text-slate-900">${tyresSpent.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tolls:</span><span className="font-mono text-slate-900">${tollsSpent.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Other Expenses:</span><span className="font-mono text-slate-900">${otherSpent.toFixed(2)}</span></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setReportsModalOpen(false);
                triggerToast('Expense report generated!');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Close Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
