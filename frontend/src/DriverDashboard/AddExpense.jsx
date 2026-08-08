import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Tab & Filter States
  const [activeTab, setActiveTab] = useState('Fuel & Expenses'); // 'Fuel & Expenses', 'Summary', 'Receipts', 'Analytics'
  const [toastMsg, setToastMsg] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [tipDismissed, setTipDismissed] = useState(false);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);

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
  const [formOdometer, setFormOdometer] = useState('450,789');
  const [formNotes, setFormNotes] = useState('');
  const [formReceiptAdded, setFormReceiptAdded] = useState(false);

  // Odometer State
  const [odometerVal, setOdometerVal] = useState('450,789');

  // Expense Items Data
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Fuel', categoryColor: 'purple', icon: '⛽', vendor: 'BP Service Centre - Yass NSW', details: '450,789 km • 68 L @ $2.05/L', date: '29 May 2025 07:15 AM', amount: 139.40, status: 'Approved' },
    { id: 2, category: 'Maintenance', categoryColor: 'emerald', icon: '🔧', vendor: 'Quick Lube - Goulburn NSW', details: 'Oil Change & Filter', date: '28 May 2025 09:30 AM', amount: 85.00, status: 'Approved' },
    { id: 3, category: 'Tyres', categoryColor: 'amber', icon: '🛞', vendor: 'Tyre Power - Campbelltown NSW', details: 'Tyre Repair & Balance', date: '27 May 2025 11:45 AM', amount: 45.00, status: 'Pending' },
    { id: 4, category: 'Tolls', categoryColor: 'blue', icon: '🛣️', vendor: 'M5 Motorway Toll - Sydney NSW', details: 'Heavy Vehicle Toll', date: '26 May 2025 12:20 PM', amount: 12.60, status: 'Approved' },
    { id: 5, category: 'Other', categoryColor: 'slate', icon: '🧽', vendor: 'Truck Wash - Campbelltown NSW', details: 'Cabin & Trailer Wash', date: '25 May 2025 01:10 PM', amount: 30.50, status: 'Approved' },
  ]);

  // Receipts Thumbnails Data
  const [receipts, setReceipts] = useState([
    { id: 1, date: '29 May 2025', time: '07:15 AM', vendor: 'BP Service Centre', amount: '$139.40' },
    { id: 2, date: '28 May 2025', time: '09:30 AM', vendor: 'Quick Lube', amount: '$85.00' },
    { id: 3, date: '27 May 2025', time: '11:45 AM', vendor: 'Tyre Power', amount: '$45.00' },
    { id: 4, date: '26 May 2025', time: '12:20 PM', vendor: 'M5 Motorway', amount: '$12.60' },
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleFilePicked = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      triggerToast(`Selected file: ${e.target.files[0].name}`);
    }
  };

  const handleUploadSubmit = () => {
    const fileName = selectedFile ? selectedFile.name : 'Receipt_Scan.jpg';
    setReceipts([
      { id: Date.now(), date: '29 May 2025', time: '02:50 PM', vendor: selectedFile ? fileName : 'Uploaded Receipt', amount: '$45.00' },
      ...receipts
    ]);
    setSelectedFile(null);
    setUploadReceiptModalOpen(false);
    triggerToast('Receipt file uploaded & attached successfully!');
  };

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!formVendor || !formAmount) return;

    const numAmount = parseFloat(formAmount) || 0;
    const categoryColors = { Fuel: 'purple', Maintenance: 'emerald', Tyres: 'amber', Tolls: 'blue', Other: 'slate' };
    const categoryIcons = { Fuel: '⛽', Maintenance: '🔧', Tyres: '🛞', Tolls: '🛣️', Other: '🧽' };

    const newExpense = {
      id: Date.now(),
      category: formCategory,
      categoryColor: categoryColors[formCategory] || 'slate',
      icon: categoryIcons[formCategory] || '📄',
      vendor: formVendor,
      details: formCategory === 'Fuel' && formLitres ? `${formOdometer} km • ${formLitres} L @ $2.05/L` : formNotes || 'Receipt Logged',
      date: '29 May 2025 02:45 PM',
      amount: numAmount,
      status: 'Approved'
    };

    setExpenses([newExpense, ...expenses]);

    // Also add to receipts if receipt uploaded
    if (formReceiptAdded) {
      setReceipts([{
        id: Date.now(),
        date: '29 May 2025',
        time: '02:45 PM',
        vendor: formVendor,
        amount: `$${numAmount.toFixed(2)}`
      }, ...receipts]);
    }

    setAddExpenseModalOpen(false);
    setFormVendor('');
    setFormAmount('');
    setFormLitres('');
    setFormNotes('');
    setFormReceiptAdded(false);
    triggerToast(`Added ${formCategory} expense of $${numAmount.toFixed(2)} for ${formVendor}!`);
  };

  // Calculations
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const fuelSpent = expenses.filter(e => e.category === 'Fuel').reduce((acc, curr) => acc + curr.amount, 0);
  const maintSpent = expenses.filter(e => e.category === 'Maintenance').reduce((acc, curr) => acc + curr.amount, 0);
  const tyresSpent = expenses.filter(e => e.category === 'Tyres').reduce((acc, curr) => acc + curr.amount, 0);
  const tollsSpent = expenses.filter(e => e.category === 'Tolls').reduce((acc, curr) => acc + curr.amount, 0);
  const otherSpent = expenses.filter(e => e.category === 'Other').reduce((acc, curr) => acc + curr.amount, 0);

  const filteredExpenses = filterCategory === 'ALL' 
    ? expenses 
    : expenses.filter(e => e.category.toUpperCase() === filterCategory.toUpperCase());

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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Fuel & Expenses</h1>
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
              <span className="text-lg font-black text-indigo-700 tracking-tight">15.8 Fuel & Expenses</span>
              <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Active Load
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Record fuel and other expenses. Snap receipts and track your costs in real time.
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
                <div className="font-black text-slate-900 text-xs">TRK-101</div>
                <div className="text-[11px] text-slate-500">MAN TGX 26.580</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Trailer</div>
                <div className="font-black text-slate-900 text-xs">TRL-305</div>
                <div className="text-[11px] text-slate-500">Car Carrier (4 Level)</div>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-indigo-500 uppercase font-extrabold">Active Load</div>
                <div className="font-black text-indigo-900 text-xs">LD-3987</div>
                <div className="text-[11px] text-indigo-700">Car Carrier (4 Level)</div>
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
              <button onClick={() => triggerToast('Synced with Fleet Server!')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🔄 Sync Now</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* STATUS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</div>
            <div className="space-y-1.5 font-bold text-slate-700">
              <div className="text-[11px] text-slate-500">Last sync: 29 May 2025, 10:15 AM</div>
              <div className="flex items-center gap-2 text-emerald-700 font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
              </div>
              <div className="text-[11px] text-slate-500">Auto refresh: Every 5 minutes</div>
            </div>
            <button
              onClick={() => triggerToast('System status refreshed!')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="text-amber-400" />
              <span>Sync Now</span>
            </button>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN: MAIN EXPENSES ENGINE (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* LOAD METADATA BANNER CARD */}
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

              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Start Date</span>
                  <span className="font-mono text-slate-900">24 May 2025</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Est. Finish</span>
                  <span className="font-mono text-slate-900">28 May 2025</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Status</span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full block text-center">En Route</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Progress</span>
                  <span className="font-mono text-slate-900">1 of 3 Stops</span>
                </div>
              </div>
            </div>

            {/* METRICS ROW PILLS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1 border-t border-slate-100">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Vehicle</span>
                <span className="font-bold text-slate-900">TRK-101</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Odometer</span>
                <span className="font-bold text-slate-900 font-mono">{odometerVal} km</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Distance (Est.)</span>
                <span className="font-bold text-slate-900 font-mono">214 km</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Load ID</span>
                <span className="font-bold text-indigo-700 font-mono">PO-65432</span>
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

          {/* KPI SUMMARY CARDS ROW (4 CARDS) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-purple-700 font-black text-xs mb-1">
                <span>⛽ Fuel Used Today</span>
              </div>
              <div className="text-2xl font-black text-slate-900">68 L</div>
              <div className="text-[10px] text-slate-400 font-bold mt-1">Today</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-xs mb-1">
                <span>💰 Total Spent</span>
              </div>
              <div className="text-2xl font-black text-emerald-700">${totalSpent.toFixed(2)}</div>
              <div className="text-[10px] text-slate-400 font-bold mt-1">Today</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 font-black text-xs mb-1">
                <span>🚚 Avg. Economy</span>
              </div>
              <div className="text-2xl font-black text-slate-900">2.08 <span className="text-xs font-normal text-slate-500">km/L</span></div>
              <div className="text-[10px] text-slate-400 font-bold mt-1">Since Start</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-blue-700 font-black text-xs mb-1">
                <span>📈 Cost / km</span>
              </div>
              <div className="text-2xl font-black text-slate-900">$1.46</div>
              <div className="text-[10px] text-slate-400 font-bold mt-1">Since Start</div>
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

                {/* EXPENSE CARDS LIST */}
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
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {exp.status} {exp.status === 'Approved' ? '✓' : '⏳'}
                          </span>
                        </div>
                        <FiChevronRight className="text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
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
                    <span>Add More</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {receipts.map((rec) => (
                    <div 
                      key={rec.id}
                      onClick={() => { setSelectedReceipt(rec); setViewReceiptModalOpen(true); }}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-3 cursor-pointer hover:bg-slate-100 transition-all space-y-2 text-center relative group"
                    >
                      <div className="w-full h-20 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-mono text-[10px] relative overflow-hidden">
                        <FiFileText className="text-2xl text-slate-300 group-hover:scale-110 transition-transform" />
                        <span className="absolute bottom-1 right-1 bg-slate-900 text-white text-[8px] font-black px-1.5 rounded">
                          PDF/IMG
                        </span>
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-slate-900 truncate">{rec.vendor}</div>
                        <div className="text-[9.5px] text-slate-400 font-bold">{rec.date}</div>
                        <div className="text-[10.5px] font-black text-indigo-700 mt-0.5">{rec.amount}</div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setUploadReceiptModalOpen(true)}
                    className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 rounded-2xl p-3 flex flex-col items-center justify-center text-slate-500 font-bold text-xs transition-all cursor-pointer space-y-1 h-36"
                  >
                    <FiPlus className="text-xl text-indigo-600" />
                    <span>Add More</span>
                  </button>
                </div>

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
                <h3 className="text-base font-black text-slate-900">Receipts Gallery ({receipts.length})</h3>
                <button onClick={() => setUploadReceiptModalOpen(true)} className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer">
                  + Upload Receipt
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {receipts.map(rec => (
                  <div key={rec.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs text-center">
                    <div className="w-full h-24 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-mono">
                      [ RECEIPT SLIP ]
                    </div>
                    <div className="font-black text-slate-900">{rec.vendor}</div>
                    <div className="text-[10px] text-slate-400 font-bold">{rec.date} • {rec.time}</div>
                    <div className="font-mono font-black text-indigo-700">{rec.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS VIEW */}
          {activeTab === 'Analytics' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Fuel & Distance Efficiency Analytics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-center">
                  <div className="text-xs text-indigo-600 font-bold uppercase">Estimated Trip Range</div>
                  <div className="text-2xl font-black text-indigo-900 mt-1">1,020 km</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center">
                  <div className="text-xs text-emerald-600 font-bold uppercase">Cost Efficiency Score</div>
                  <div className="text-2xl font-black text-emerald-900 mt-1">94% (Good)</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* EXPENSE SUMMARY (SINCE START) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EXPENSE SUMMARY</div>
            <div className="text-[11px] text-slate-400 font-bold mb-2">Since Start</div>
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
              {expenses.slice(0, 3).map(exp => (
                <div key={exp.id} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="min-w-0">
                    <div className="font-black text-slate-900 truncate">{exp.vendor}</div>
                    <div className="text-[10px] text-slate-400 font-bold">{exp.date}</div>
                  </div>
                  <span className="font-mono font-black text-slate-900 shrink-0 ml-2">${exp.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => triggerToast('Showing all expenses list')}
              className="w-full text-center text-xs font-extrabold text-indigo-600 hover:text-indigo-800 pt-1 cursor-pointer block"
            >
              View All
            </button>
          </div>

          {/* EXPENSE ALERTS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EXPENSE ALERTS</div>
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center">1</span>
            </div>
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex items-start gap-2.5 text-rose-900">
              <FiAlertTriangle className="text-rose-600 text-base shrink-0 mt-0.5" />
              <div>
                <div className="font-black text-xs">Receipt Missing</div>
                <div className="text-[11px] text-rose-700 font-medium mt-0.5">1 expense requires receipt upload for approval.</div>
              </div>
            </div>
            <button 
              onClick={() => setAlertsModalOpen(true)}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
            >
              View Alerts
            </button>
          </div>

          {/* HELP & RESOURCES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HELP & RESOURCES</div>
            <div className="space-y-2 font-semibold text-slate-700">
              <button onClick={() => triggerToast('Opening Expense Recording Guide...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📖 How to Record Expenses</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Expense Policy...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">🛡️ Expense Policy</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Fuel Card Guide...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">⛽ Fuel Card Guide</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Connecting to Support...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
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
              <button type="button" onClick={() => setAddExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Category</label>
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
                <label className="text-slate-700 font-bold block mb-1">Vendor / Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BP Service Centre - Yass NSW"
                  value={formVendor}
                  onChange={(e) => setFormVendor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Amount ($ AUD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 139.40"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                </div>

                {formCategory === 'Fuel' && (
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Litres (L)</label>
                    <input
                      type="number"
                      placeholder="e.g. 68"
                      value={formLitres}
                      onChange={(e) => setFormLitres(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Receipt Attachment</label>
                <button
                  type="button"
                  onClick={() => setFormReceiptAdded(true)}
                  className={`w-full p-3 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    formReceiptAdded ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold' : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  <FiCamera className="text-base" />
                  <span>{formReceiptAdded ? 'Receipt Attached ✓' : 'Snap / Upload Receipt Image'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md mt-2"
            >
              Log Expense Item
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
                  <div className="text-[10px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB • Ready to upload</div>
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              {selectedFile ? `Upload "${selectedFile.name}"` : 'Upload Receipt File'}
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
                  type="text"
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
              <div className="text-slate-600 font-semibold">{selectedReceipt.date} • {selectedReceipt.time}</div>
              <div className="text-indigo-700 font-mono text-lg font-black">{selectedReceipt.amount}</div>
            </div>

            <div className="border border-slate-200 bg-slate-100 rounded-2xl h-48 flex items-center justify-center text-slate-400 text-xs font-mono">
              [ RECEIPT IMAGE PREVIEW ]
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

      {/* EXPENSE ALERTS MODAL */}
      {alertsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiAlertTriangle className="text-rose-600 text-lg" />
                Expense Alerts
              </h3>
              <button onClick={() => setAlertsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-2 text-xs text-rose-900">
              <div className="font-black text-sm">Receipt Missing: Tyre Power ($45.00)</div>
              <div className="text-rose-700 font-medium">Please snap or upload the receipt photo so accounts can approve reimbursement.</div>
            </div>

            <button
              onClick={() => {
                setAlertsModalOpen(false);
                setUploadReceiptModalOpen(true);
              }}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Upload Missing Receipt Now
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
                Trip Expense Analytics Report (LD-3987)
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
                triggerToast('Expense PDF Report downloaded!');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Export PDF Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
