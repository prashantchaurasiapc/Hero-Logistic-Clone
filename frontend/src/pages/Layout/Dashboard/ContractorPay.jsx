import React, { useState } from 'react';
import {
  Building2,
  Bell,
  UserCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  TrendingUp,
  Search,
  ChevronDown,
  Calendar,
  Filter,
  Upload,
  Plus,
  ArrowUpDown,
  Eye,
  Edit,
  MoreVertical,
  X,
  Printer,
  Download,
  Landmark,
  ShieldAlert,
  Check
} from 'lucide-react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ContractorPay = () => {
  // Initial Claims Data matching Image 2
  const initialClaims = [
    {
      id: 'CC-1028',
      contractor: 'Darren Logistics',
      reference: 'LOAD-1245',
      claimDate: '24 May 2026',
      amountExGst: 2600.00,
      gst: 260.00,
      totalIncGst: 2860.00,
      status: 'Pending Approval',
      paymentMethod: 'Bank Transfer',
      bankName: 'Darren Logistics Pty Ltd',
      bsbAccount: '123-456 / 12345678',
      items: [
        { description: 'Transport Services', amountExGst: 2400.00, gst: 240.00, totalIncGst: 2640.00 },
        { description: 'Toll Charges', amountExGst: 150.00, gst: 15.00, totalIncGst: 165.00 }
      ]
    },
    {
      id: 'CC-1027',
      contractor: 'Coastline Car Carriers',
      reference: 'LOAD-1242',
      claimDate: '23 May 2026',
      amountExGst: 1950.00,
      gst: 195.00,
      totalIncGst: 2145.00,
      status: 'Approved',
      paymentMethod: 'Bank Transfer',
      bankName: 'Coastline Logistics Group',
      bsbAccount: '082-991 / 99182374',
      items: [
        { description: 'Interstate Freight Delivery', amountExGst: 1950.00, gst: 195.00, totalIncGst: 2145.00 }
      ]
    },
    {
      id: 'CC-1026',
      contractor: 'AJ Transport',
      reference: 'LOAD-1239',
      claimDate: '22 May 2026',
      amountExGst: 3200.00,
      gst: 320.00,
      totalIncGst: 3520.00,
      status: 'Paid',
      paymentMethod: 'Bank Transfer',
      bankName: 'AJ Transport Services',
      bsbAccount: '062-000 / 44829102',
      items: [
        { description: 'Heavy Vehicle Haulage', amountExGst: 3200.00, gst: 320.00, totalIncGst: 3520.00 }
      ]
    },
    {
      id: 'CC-1025',
      contractor: 'Northline Haulage',
      reference: 'LOAD-1236',
      claimDate: '21 May 2026',
      amountExGst: 1800.00,
      gst: 180.00,
      totalIncGst: 1980.00,
      status: 'Paid',
      paymentMethod: 'EFT',
      bankName: 'Northline Operations',
      bsbAccount: '012-345 / 88716253',
      items: [
        { description: 'Regional Cargo Delivery', amountExGst: 1800.00, gst: 180.00, totalIncGst: 1980.00 }
      ]
    },
    {
      id: 'CC-1024',
      contractor: 'Rapid Freight Services',
      reference: 'LOAD-1233',
      claimDate: '20 May 2026',
      amountExGst: 2400.00,
      gst: 240.00,
      totalIncGst: 2640.00,
      status: 'Approved',
      paymentMethod: 'Bank Transfer',
      bankName: 'Rapid Freight Ltd',
      bsbAccount: '033-100 / 55462819',
      items: [
        { description: 'Express Highway Transit', amountExGst: 2400.00, gst: 240.00, totalIncGst: 2640.00 }
      ]
    },
    {
      id: 'CC-1023',
      contractor: 'Darren Logistics',
      reference: 'LOAD-1230',
      claimDate: '19 May 2026',
      amountExGst: 2100.00,
      gst: 210.00,
      totalIncGst: 2310.00,
      status: 'Paid',
      paymentMethod: 'Bank Transfer',
      bankName: 'Darren Logistics Pty Ltd',
      bsbAccount: '123-456 / 12345678',
      items: [
        { description: 'Container Shuttle Transport', amountExGst: 2100.00, gst: 210.00, totalIncGst: 2310.00 }
      ]
    },
    {
      id: 'CC-1022',
      contractor: 'Coastline Car Carriers',
      reference: 'LOAD-1227',
      claimDate: '18 May 2026',
      amountExGst: 1850.00,
      gst: 185.00,
      totalIncGst: 2035.00,
      status: 'Paid',
      paymentMethod: 'EFT',
      bankName: 'Coastline Logistics Group',
      bsbAccount: '082-991 / 99182374',
      items: [
        { description: 'Auto Transport Services', amountExGst: 1850.00, gst: 185.00, totalIncGst: 2035.00 }
      ]
    },
    {
      id: 'CC-1021',
      contractor: 'Swift Car Movers',
      reference: 'LOAD-1224',
      claimDate: '17 May 2026',
      amountExGst: 2800.00,
      gst: 280.00,
      totalIncGst: 3080.00,
      status: 'Overdue',
      paymentMethod: 'Bank Transfer',
      bankName: 'Swift Freight Corp',
      bsbAccount: '063-500 / 10928374',
      items: [
        { description: 'Vehicle Relocation Haulage', amountExGst: 2800.00, gst: 280.00, totalIncGst: 3080.00 }
      ]
    }
  ];

  // State
  const [claims, setClaims] = useState(initialClaims);
  const [selectedClaim, setSelectedClaim] = useState(initialClaims[0]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [contractorFilter, setContractorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Menu and Modal States
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingClaim, setViewingClaim] = useState(null);
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [showEditClaimModal, setShowEditClaimModal] = useState(false);
  const [showBulkActionsDropdown, setShowBulkActionsDropdown] = useState(false);
  const [showDatePickerDropdown, setShowDatePickerDropdown] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('18 May – 24 May 2026');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // CSV Export Handler
  const handleExportCSV = (claimsToExport = filteredClaims) => {
    if (!claimsToExport || claimsToExport.length === 0) {
      showToast('No claims available to export.');
      return;
    }
    const headers = ['Claim ID', 'Contractor', 'Reference / Load #', 'Claim Date', 'Amount Ex GST ($)', 'GST ($)', 'Total Inc GST ($)', 'Status', 'Payment Method'];
    const rows = claimsToExport.map(c => [
      c.id,
      `"${c.contractor}"`,
      c.reference,
      `"${c.claimDate}"`,
      c.amountExGst.toFixed(2),
      c.gst.toFixed(2),
      c.totalIncGst.toFixed(2),
      c.status,
      c.paymentMethod
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contractor_claims_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${claimsToExport.length} claim(s) to CSV!`);
  };

  // Bulk Actions Handlers
  const handleBulkApprove = () => {
    setShowBulkActionsDropdown(false);
    if (selectedRowIds.length === 0) {
      showToast('Please select at least one claim using checkboxes.');
      return;
    }
    setClaims(prev => prev.map(c => selectedRowIds.includes(c.id) ? { ...c, status: 'Approved' } : c));
    showToast(`Bulk approved ${selectedRowIds.length} claim(s).`);
    setSelectedRowIds([]);
  };

  const handleBulkMarkPaid = () => {
    setShowBulkActionsDropdown(false);
    if (selectedRowIds.length === 0) {
      showToast('Please select at least one claim using checkboxes.');
      return;
    }
    setClaims(prev => prev.map(c => selectedRowIds.includes(c.id) ? { ...c, status: 'Paid' } : c));
    showToast(`Bulk marked ${selectedRowIds.length} claim(s) as Paid.`);
    setSelectedRowIds([]);
  };

  const handleBulkReject = () => {
    setShowBulkActionsDropdown(false);
    if (selectedRowIds.length === 0) {
      showToast('Please select at least one claim using checkboxes.');
      return;
    }
    setClaims(prev => prev.map(c => selectedRowIds.includes(c.id) ? { ...c, status: 'Cancelled' } : c));
    showToast(`Bulk rejected ${selectedRowIds.length} claim(s).`);
    setSelectedRowIds([]);
  };

  const handleBulkExport = () => {
    setShowBulkActionsDropdown(false);
    if (selectedRowIds.length === 0) {
      showToast('Please select at least one claim using checkboxes.');
      return;
    }
    const selectedClaimsList = claims.filter(c => selectedRowIds.includes(c.id));
    handleExportCSV(selectedClaimsList);
  };

  // New Claim Form State
  const [newClaimForm, setNewClaimForm] = useState({
    contractor: 'Darren Logistics',
    reference: '',
    claimDate: '2026-05-25',
    amountExGst: '',
    description: 'Transport Services',
    paymentMethod: 'Bank Transfer'
  });

  // Edit Claim Form State
  const [editingClaimForm, setEditingClaimForm] = useState({
    id: '',
    contractor: '',
    reference: '',
    claimDate: '',
    amountExGst: '',
    description: '',
    paymentMethod: 'Bank Transfer',
    status: 'Pending Approval'
  });

  // Open Edit Modal Handler
  const handleOpenEditModal = (c) => {
    setActiveRowMenuId(null);
    setEditingClaimForm({
      id: c.id,
      contractor: c.contractor,
      reference: c.reference,
      claimDate: c.claimDate,
      amountExGst: c.amountExGst,
      description: c.items && c.items.length > 0 ? c.items[0].description : 'Transport Services',
      paymentMethod: c.paymentMethod,
      status: c.status
    });
    setShowEditClaimModal(true);
  };

  // Update Claim Submit Handler
  const handleUpdateClaimSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(editingClaimForm.amountExGst) || 0;
    const gstVal = amount * 0.10;
    const totalVal = amount + gstVal;

    setClaims(prev => prev.map(c => {
      if (c.id === editingClaimForm.id) {
        const updated = {
          ...c,
          contractor: editingClaimForm.contractor,
          reference: editingClaimForm.reference,
          claimDate: editingClaimForm.claimDate,
          amountExGst: amount,
          gst: gstVal,
          totalIncGst: totalVal,
          paymentMethod: editingClaimForm.paymentMethod,
          status: editingClaimForm.status,
          items: [
            { description: editingClaimForm.description || 'Transport Services', amountExGst: amount, gst: gstVal, totalIncGst: totalVal }
          ]
        };
        if (selectedClaim && selectedClaim.id === c.id) {
          setSelectedClaim(updated);
        }
        return updated;
      }
      return c;
    }));

    setShowEditClaimModal(false);
    showToast(`Claim ${editingClaimForm.id} updated successfully.`);
  };

  // Donut Chart Data matching Image 2
  const donutChartData = [
    { name: 'Paid', value: 9860, color: '#22c55e' },            // Green
    { name: 'Approved', value: 3120, color: '#3b82f6' },        // Blue
    { name: 'Pending Approval', value: 2860, color: '#f59e0b' },// Amber
    { name: 'Overdue', value: 1920, color: '#ef4444' }           // Red
  ];

  // Filtering Logic
  const filteredClaims = claims.filter(c => {
    if (activeTab === 'Pending Approval' && c.status !== 'Pending Approval') return false;
    if (activeTab === 'Approved' && c.status !== 'Approved') return false;
    if (activeTab === 'Paid' && c.status !== 'Paid') return false;
    if (activeTab === 'Overdue' && c.status !== 'Overdue') return false;
    if (activeTab === 'Cancelled' && c.status !== 'Cancelled') return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchContractor = c.contractor.toLowerCase().includes(q);
      const matchRef = c.reference.toLowerCase().includes(q);
      if (!matchId && !matchContractor && !matchRef) return false;
    }

    if (contractorFilter !== 'All' && c.contractor !== contractorFilter) return false;
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (paymentMethodFilter !== 'All' && c.paymentMethod !== paymentMethodFilter) return false;

    return true;
  });

  // Select Checkbox Helpers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(filteredClaims.map(c => c.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRowIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending Approval':
        return 'bg-amber-100/90 text-amber-700 font-bold px-3 py-0.5 rounded-full text-[11px] shrink-0';
      case 'Approved':
        return 'bg-emerald-100/90 text-emerald-700 font-bold px-3 py-0.5 rounded-full text-[11px] shrink-0';
      case 'Paid':
        return 'bg-emerald-100/90 text-emerald-700 font-bold px-3 py-0.5 rounded-full text-[11px] shrink-0';
      case 'Overdue':
        return 'bg-rose-100/90 text-rose-700 font-bold px-3 py-0.5 rounded-full text-[11px] shrink-0';
      default:
        return 'bg-slate-100 text-slate-700 font-bold px-3 py-0.5 rounded-full text-[11px] shrink-0';
    }
  };

  // Row Selection Handler
  const handleRowClick = (c) => {
    setSelectedClaim(c);
  };

  // Eye Icon Handler
  const handleEyeIconClick = (c) => {
    setActiveRowMenuId(null);
    setViewingClaim(c);
    setShowViewModal(true);
    showToast(`Viewing Details for Claim ${c.id}`);
  };

  // Approve Claim Handler
  const handleApproveClaim = (claimId) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'Approved' } : c));
    if (selectedClaim && selectedClaim.id === claimId) {
      setSelectedClaim(prev => ({ ...prev, status: 'Approved' }));
    }
    showToast(`Claim ${claimId} approved successfully.`);
  };

  // Reject Claim Handler
  const handleRejectClaim = (claimId) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'Cancelled' } : c));
    if (selectedClaim && selectedClaim.id === claimId) {
      setSelectedClaim(prev => ({ ...prev, status: 'Cancelled' }));
    }
    showToast(`Claim ${claimId} rejected.`);
  };

  // Add New Claim Submit
  const handleCreateClaimSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(newClaimForm.amountExGst) || 0;
    const gstVal = amount * 0.10;
    const totalVal = amount + gstVal;
    const newId = `CC-${1029 + claims.length}`;

    const newEntry = {
      id: newId,
      contractor: newClaimForm.contractor,
      reference: newClaimForm.reference || `LOAD-${1246 + claims.length}`,
      claimDate: '25 May 2026',
      amountExGst: amount,
      gst: gstVal,
      totalIncGst: totalVal,
      status: 'Pending Approval',
      paymentMethod: newClaimForm.paymentMethod,
      bankName: `${newClaimForm.contractor} Ltd`,
      bsbAccount: '062-110 / 88920192',
      items: [
        { description: newClaimForm.description || 'Freight Delivery', amountExGst: amount, gst: gstVal, totalIncGst: totalVal }
      ]
    };

    setClaims([newEntry, ...claims]);
    setSelectedClaim(newEntry);
    setShowNewClaimModal(false);
    showToast(`New contractor claim ${newId} created successfully.`);
  };

  return (
    <div className="p-3 sm:p-6 bg-slate-50/50 min-h-screen font-sans text-slate-800 text-left relative overflow-x-hidden">
      {/* Toast Notification (Mobile Responsive) */}
      {toastMessage && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-[99999] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700 max-w-md ml-auto">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white shrink-0">✕</button>
        </div>
      )}

      {/* 1. TOP HEADER ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Contractor Pay</h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
            Review contractor claims, approve payments and track disbursements.
          </p>
        </div>
      </div>

      {/* 2. TOP 6 KPI CARDS ROW (Compact & Responsive Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
        {/* Card 1 */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow min-w-0">
          <div>
            <div className="w-6 h-6 rounded-md bg-purple-100/70 text-purple-600 flex items-center justify-center mb-1.5 shrink-0">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">Total Payable</span>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">$15,780.00</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">8 contractors</div>
          </div>
          <button onClick={() => showToast('Viewing Total Payable details')} className="mt-1 text-[9px] sm:text-[9.5px] font-bold text-sky-600 hover:text-sky-700 text-left flex items-center gap-0.5 cursor-pointer truncate">
            View details &rarr;
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow min-w-0">
          <div>
            <div className="w-6 h-6 rounded-md bg-emerald-100/70 text-emerald-600 flex items-center justify-center mb-1.5 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">Approved</span>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">$12,980.00</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">6 contractors</div>
          </div>
          <button onClick={() => showToast('Viewing Approved details')} className="mt-1 text-[9px] sm:text-[9.5px] font-bold text-sky-600 hover:text-sky-700 text-left flex items-center gap-0.5 cursor-pointer truncate">
            View details &rarr;
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow min-w-0">
          <div>
            <div className="w-6 h-6 rounded-md bg-amber-100/70 text-amber-600 flex items-center justify-center mb-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">Pending Approval</span>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">$2,800.00</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">2 contractors</div>
          </div>
          <button onClick={() => showToast('Viewing Pending items')} className="mt-1 text-[9px] sm:text-[9.5px] font-bold text-sky-600 hover:text-sky-700 text-left flex items-center gap-0.5 cursor-pointer truncate">
            View items &rarr;
          </button>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow min-w-0">
          <div>
            <div className="w-6 h-6 rounded-md bg-rose-100/70 text-rose-500 flex items-center justify-center mb-1.5 shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">Paid</span>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">$9,860.00</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">5 contractors</div>
          </div>
          <button onClick={() => showToast('Viewing Paid payments')} className="mt-1 text-[9px] sm:text-[9.5px] font-bold text-sky-600 hover:text-sky-700 text-left flex items-center gap-0.5 cursor-pointer truncate">
            View payments &rarr;
          </button>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow min-w-0">
          <div>
            <div className="w-6 h-6 rounded-md bg-sky-100/70 text-sky-600 flex items-center justify-center mb-1.5 shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">Overdue Payments</span>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">$1,920.00</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">1 contractor</div>
          </div>
          <button onClick={() => showToast('Viewing Overdue claims')} className="mt-1 text-[9px] sm:text-[9.5px] font-bold text-sky-600 hover:text-sky-700 text-left flex items-center gap-0.5 cursor-pointer truncate">
            View overdue &rarr;
          </button>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow min-w-0">
          <div>
            <div className="w-6 h-6 rounded-md bg-emerald-100/70 text-emerald-600 flex items-center justify-center mb-1.5 shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">Period Growth</span>
            <div className="text-sm sm:text-base font-black text-emerald-600 mt-0.5 truncate">&uarr; 14.6%</div>
            <div className="text-[9px] sm:text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">vs $13,780.00</div>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & MULTI-FILTER TOOLBAR ROW */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Search Bar */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by contractor, claim #, reference..."
            className="w-full pl-9 pr-3 h-10 sm:h-9 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-300 font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Filters Group */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
          {/* Dropdown 1: Contractors */}
          <div className="relative col-span-1">
            <select
              value={contractorFilter}
              onChange={(e) => setContractorFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 font-bold text-slate-700 h-10 sm:h-9 pl-3 pr-8 rounded-xl outline-none cursor-pointer text-xs truncate"
            >
              <option value="All">All Contractors</option>
              <option value="Darren Logistics">Darren Logistics</option>
              <option value="Coastline Car Carriers">Coastline Car Carriers</option>
              <option value="AJ Transport">AJ Transport</option>
              <option value="Northline Haulage">Northline Haulage</option>
              <option value="Rapid Freight Services">Rapid Freight Services</option>
              <option value="Swift Car Movers">Swift Car Movers</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Dropdown 2: Status */}
          <div className="relative col-span-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 font-bold text-slate-700 h-10 sm:h-9 pl-3 pr-8 rounded-xl outline-none cursor-pointer text-xs truncate"
            >
              <option value="All">All Status</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Dropdown 3: Payment Methods */}
          <div className="relative col-span-1">
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 font-bold text-slate-700 h-10 sm:h-9 pl-3 pr-8 rounded-xl outline-none cursor-pointer text-xs truncate"
            >
              <option value="All">Payment Methods</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="EFT">EFT</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Range Selector Dropdown */}
          <div className="relative col-span-1">
            <button
              onClick={() => setShowDatePickerDropdown(!showDatePickerDropdown)}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 h-10 sm:h-9 px-3 rounded-xl cursor-pointer text-xs transition-colors truncate"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{selectedDateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {showDatePickerDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-60 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-slate-200 shadow-2xl p-2 z-[999] text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-2.5 py-1">Filter Date Range</span>
                {[
                  '18 May – 24 May 2026',
                  '11 May – 17 May 2026',
                  '01 May – 31 May 2026',
                  'All Time'
                ].map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDateRange(range);
                      setShowDatePickerDropdown(false);
                      showToast(`Date range set to ${range}`);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center justify-between ${
                      selectedDateRange === range ? 'text-amber-600 font-bold bg-amber-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{range}</span>
                    {selectedDateRange === range && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filters Button */}
          <button onClick={() => showToast('Filter drawer toggled')} className="col-span-2 sm:col-span-1 w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 font-extrabold text-slate-700 h-10 sm:h-9 px-3 rounded-xl transition-colors cursor-pointer text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* 4. STATUS FILTER TABS + ACTION BUTTONS ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
        {/* Status Tabs (Strict 1-line Horizontal Scroll) */}
        <div className="flex items-center flex-nowrap gap-3 sm:gap-4 text-xs font-bold border-b border-slate-200/80 pb-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto whitespace-nowrap">
          {[
            { id: 'All', label: 'All (12)' },
            { id: 'Pending Approval', label: 'Pending Approval (2)' },
            { id: 'Approved', label: 'Approved (6)' },
            { id: 'Paid', label: 'Paid (5)' },
            { id: 'Overdue', label: 'Overdue (1)' },
            { id: 'Cancelled', label: 'Cancelled (0)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-amber-600 font-black border-b-2 border-amber-500'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Actions Toolbar */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          {/* CSV Export Button */}
          <button
            onClick={() => handleExportCSV(filteredClaims)}
            className="col-span-1 flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold px-3 h-10 sm:h-9 rounded-xl shadow-2xs text-xs cursor-pointer active:scale-98 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          {/* Interactive Bulk Actions Dropdown */}
          <div className="relative col-span-1">
            <button
              onClick={() => setShowBulkActionsDropdown(!showBulkActionsDropdown)}
              className={`w-full flex items-center justify-between sm:justify-start gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold px-3 h-10 sm:h-9 rounded-xl shadow-2xs text-xs cursor-pointer transition-all ${
                selectedRowIds.length > 0 ? 'border-amber-400 bg-amber-50/30' : ''
              }`}
            >
              <span>Bulk Actions</span>
              {selectedRowIds.length > 0 && (
                <span className="bg-amber-500 text-white font-black px-1.5 py-0.2 rounded-full text-[10px]">
                  {selectedRowIds.length}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showBulkActionsDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-52 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-slate-200 shadow-2xl py-1.5 z-[999] text-left">
                <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select {selectedRowIds.length} Claim(s)
                </div>

                <button
                  onClick={handleBulkApprove}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bulk Approve</span>
                </button>

                <button
                  onClick={handleBulkMarkPaid}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                  <span>Bulk Mark as Paid</span>
                </button>

                <button
                  onClick={handleBulkExport}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>Bulk Export Selected</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={handleBulkReject}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-rose-500" />
                  <span>Bulk Reject Claims</span>
                </button>
              </div>
            )}
          </div>

          {/* New Contractor Claim Button */}
          <button
            onClick={() => setShowNewClaimModal(true)}
            className="col-span-2 sm:col-span-1 w-full flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black px-4 h-10 sm:h-9 rounded-xl shadow-xs text-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Contractor Claim</span>
          </button>
        </div>
      </div>

      {/* 5. MAIN SPLIT LAYOUT (TABLE LEFT + SIDEBAR RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* LEFT COLUMN: CLAIMS TABLE */}
        <div className="lg:col-span-9 bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between max-w-full">
          <div className="overflow-x-auto w-full max-w-full">
            <table className="w-full text-left border-collapse min-w-[780px] sm:min-w-[850px] whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-200 text-[11px] font-bold text-slate-600 tracking-tight">
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedRowIds.length === filteredClaims.length && filteredClaims.length > 0}
                      className="rounded border-slate-300 accent-amber-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-3">
                    <div className="flex items-center gap-1">
                      <span>Claim #</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3">
                    <div className="flex items-center gap-1">
                      <span>Contractor</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3">Reference / Load #</th>
                  <th className="py-3.5 px-3">
                    <div className="flex items-center gap-1">
                      <span>Claim Date</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-right">Amount (Ex GST)</th>
                  <th className="py-3.5 px-3 text-right">GST</th>
                  <th className="py-3.5 px-3 text-right">Total (Inc GST)</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-3">Payment Method</th>
                  <th className="py-3.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                      No matching contractor claims found
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((c) => {
                    const isChecked = selectedRowIds.includes(c.id);
                    const isSelectedRow = selectedClaim && selectedClaim.id === c.id;
                    const isMenuOpen = activeRowMenuId === c.id;

                    return (
                      <tr
                        key={c.id}
                        onClick={() => handleRowClick(c)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          isSelectedRow ? 'bg-amber-50/40 border-l-4 border-l-amber-500' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSelectRow(c.id)}
                            className="rounded border-slate-300 accent-amber-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">{c.id}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{c.contractor}</td>
                        <td className="py-3 px-3 text-slate-600 font-semibold">{c.reference}</td>
                        <td className="py-3 px-3 text-slate-700">{c.claimDate}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">${c.amountExGst.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-600">${c.gst.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="py-3 px-3 text-right font-black text-slate-900">${c.totalIncGst.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={getStatusBadge(c.status)}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{c.paymentMethod}</span>
                          </div>
                        </td>

                        {/* ROW ACTIONS */}
                        <td className="py-3 px-3 text-center relative" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2 text-slate-500">
                            <button
                              onClick={() => handleEyeIconClick(c)}
                              title="View Claim Details"
                              className="hover:text-slate-900 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(c)}
                              title="Edit Claim"
                              className="hover:text-slate-900 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => setActiveRowMenuId(isMenuOpen ? null : c.id)}
                                title="More Actions"
                                className="hover:text-slate-900 transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-2xl py-1.5 z-50 text-left font-normal">
                                  <button
                                    onClick={() => handleEyeIconClick(c)}
                                    className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                                    <span>View Claim</span>
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditModal(c)}
                                    className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Edit Claim</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveRowMenuId(null);
                                      handleApproveClaim(c.id);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Approve</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Pagination */}
          <div className="p-3 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-semibold">
            <div>Showing 1 to {filteredClaims.length} of 12 claims</div>

            <div className="flex items-center gap-2">
              <button disabled className="px-2 py-1 text-slate-400 cursor-not-allowed">&lt;</button>
              <button className="w-7 h-7 bg-amber-500 text-white font-bold rounded-lg flex items-center justify-center shadow-2xs">
                1
              </button>
              <button className="w-7 h-7 hover:bg-slate-50 text-slate-600 font-medium rounded-lg flex items-center justify-center">2</button>
              <button className="px-2 py-1 text-slate-600 hover:text-slate-900">&gt;</button>
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <span>10 / page</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR CARDS */}
        <div className="lg:col-span-3 space-y-3">
          {/* Card 1: Contractor Pay Summary Donut Chart */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-[10.5px] font-black text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
              Contractor Pay Summary
            </h3>

            <div className="flex flex-col xl:flex-row items-center justify-between gap-2 py-0.5">
              {/* Donut Chart */}
              <div className="w-24 h-24 relative flex items-center justify-center shrink-0 mx-auto xl:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={donutChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {donutChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
                  <span className="text-[9px] font-black text-slate-900 leading-none tracking-tighter">$15.7k</span>
                  <span className="text-[6.5px] font-extrabold text-slate-400 uppercase tracking-tighter mt-0.5">Payable</span>
                </div>
              </div>

              {/* Right Legend Bullets */}
              <div className="space-y-1 text-[10px] font-bold text-slate-700 w-full pl-0 xl:pl-1 mt-1 xl:mt-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                    <span className="truncate">Paid</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-[10px] shrink-0">$9,860</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block shrink-0" />
                    <span className="truncate">Approved</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-[10px] shrink-0">$3,120</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
                    <span className="truncate">Pending</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-[10px] shrink-0">$2,860</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block shrink-0" />
                    <span className="truncate">Overdue</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-[10px] shrink-0">$1,920</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Top Contractors */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-1">
              <h3 className="text-[10.5px] font-black text-slate-900 uppercase tracking-wider">
                Top Contractors
              </h3>
              <button onClick={() => showToast('Viewing all contractors list')} className="text-[10px] font-bold text-sky-600 hover:text-sky-700 cursor-pointer">View all</button>
            </div>

            <div className="space-y-1.5 text-[10.5px] font-semibold">
              {[
                { name: 'Darren Logistics', amount: '$5,170.00' },
                { name: 'Coastline Car Carriers', amount: '$4,180.00' },
                { name: 'AJ Transport', amount: '$2,145.00' },
                { name: 'Northline Haulage', amount: '$1,980.00' },
                { name: 'Rapid Freight Services', amount: '$1,760.00' }
              ].map((c, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-700 gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shrink-0" />
                    <span className="font-semibold truncate">{c.name}</span>
                  </div>
                  <span className="font-black text-slate-900 shrink-0">{c.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Recent Payments */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-1">
              <h3 className="text-[10.5px] font-black text-slate-900 uppercase tracking-wider">
                Recent Payments
              </h3>
              <button onClick={() => showToast('Viewing recent payments history')} className="text-[10px] font-bold text-sky-600 hover:text-sky-700 cursor-pointer">View all</button>
            </div>

            <div className="space-y-2">
              {[
                { id: 'CC-1026', contractor: 'Darren Logistics', date: '22 May 2026', amount: '$3,520.00' },
                { id: 'CC-1025', contractor: 'Northline Haulage', date: '21 May 2026', amount: '$1,980.00' },
                { id: 'CC-1023', contractor: 'Darren Logistics', date: '19 May 2026', amount: '$2,310.00' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-slate-900 block text-[10px] leading-tight truncate">{item.id}</span>
                      <span className="text-[9px] text-slate-400 font-bold block truncate">{item.contractor}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-slate-900 block text-[10.5px] leading-tight">{item.amount}</span>
                    <span className="text-[8.5px] text-slate-400 font-semibold block">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM CLAIM DETAILS PREVIEW PANEL */}
      {selectedClaim && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 mb-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Claim Details</h2>
              <span className={getStatusBadge(selectedClaim.status)}>
                {selectedClaim.status}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400">Claim ID: {selectedClaim.id}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-3 space-y-3 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 pr-0 lg:pr-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-3">
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Contractor</span>
                  <span className="font-black text-slate-900 text-sm block truncate">{selectedClaim.contractor}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Reference / Load #</span>
                  <span className="font-bold text-slate-800 block truncate">{selectedClaim.reference}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Claim Date</span>
                  <span className="font-semibold text-slate-700 block truncate">{selectedClaim.claimDate}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Payment Method</span>
                  <span className="font-bold text-slate-800 block truncate">{selectedClaim.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Bank Name</span>
                  <span className="font-semibold text-slate-800 block truncate">{selectedClaim.bankName}</span>
                </div>
                <div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">BSB / Account</span>
                  <span className="font-mono text-slate-700 block truncate">{selectedClaim.bsbAccount}</span>
                </div>
              </div>
            </div>

            {/* Middle Breakdown Table */}
            <div className="lg:col-span-6">
              <div className="overflow-x-auto w-full rounded-xl border border-slate-200/80">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-right">Amount (Ex GST)</th>
                      <th className="py-2.5 px-3 text-right">GST</th>
                      <th className="py-2.5 px-3 text-right">Total (Inc GST)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {selectedClaim.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{item.description}</td>
                        <td className="py-2.5 px-3 text-right text-slate-700">${item.amountExGst.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="py-2.5 px-3 text-right text-slate-500">${item.gst.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900">${item.totalIncGst.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-black border-t border-slate-200 text-xs">
                      <td className="py-3 px-3 text-slate-900">Total</td>
                      <td className="py-3 px-3 text-right text-slate-900">${selectedClaim.amountExGst.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td className="py-3 px-3 text-right text-slate-700">${selectedClaim.gst.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td className="py-3 px-3 text-right text-emerald-600 font-black text-sm">${selectedClaim.totalIncGst.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Right Action Buttons Column */}
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-2 pl-0 lg:pl-2">
              <span className="col-span-2 sm:col-span-3 lg:col-span-1 text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Actions</span>

              <button
                onClick={() => handleApproveClaim(selectedClaim.id)}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve Claim</span>
              </button>

              <button
                onClick={() => handleOpenEditModal(selectedClaim)}
                className="py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Claim</span>
              </button>

              <button
                onClick={() => handleRejectClaim(selectedClaim.id)}
                className="col-span-2 sm:col-span-1 py-2 px-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5 text-rose-500" />
                <span>Reject Claim</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. 1-TO-1 CLAIM VIEW MODAL */}
      {showViewModal && viewingClaim && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[9999] p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 mb-4 sm:mb-5">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-700 font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
                  CC
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">{viewingClaim.id}</h2>
                    <span className={getStatusBadge(viewingClaim.status)}>
                      {viewingClaim.status}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-semibold truncate">Contractor Claim Details & Disbursement</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => showToast(`Printing statement for ${viewingClaim.id}...`)}
                  className="p-1.5 sm:p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5 text-xs">
              <div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Contractor</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{viewingClaim.contractor}</span>
              </div>
              <div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Load Reference</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{viewingClaim.reference}</span>
              </div>
              <div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Claim Date</span>
                <span className="font-semibold text-slate-800 block text-xs truncate">{viewingClaim.claimDate}</span>
              </div>
              <div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Payment Method</span>
                <span className="font-bold text-slate-900 block text-xs truncate">{viewingClaim.paymentMethod}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-amber-50/60 p-3.5 sm:p-4 rounded-xl border border-amber-200 mb-5 sm:mb-6 text-xs gap-2.5">
              <div>
                <span className="text-slate-500 font-semibold block">Total Ex GST</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">${viewingClaim.amountExGst.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200">
                <span className="text-slate-500 font-semibold block">Total Payable (Inc GST)</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600">${viewingClaim.totalIncGst.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3.5 border-t border-slate-100">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. NEW CONTRACTOR CLAIM MODAL */}
      {showNewClaimModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[9999] p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-black text-slate-900">New Contractor Claim</h2>
              <button onClick={() => setShowNewClaimModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClaimSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Contractor Name</label>
                <select
                  value={newClaimForm.contractor}
                  onChange={(e) => setNewClaimForm({ ...newClaimForm, contractor: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-semibold"
                >
                  <option value="Darren Logistics">Darren Logistics</option>
                  <option value="Coastline Car Carriers">Coastline Car Carriers</option>
                  <option value="AJ Transport">AJ Transport</option>
                  <option value="Northline Haulage">Northline Haulage</option>
                  <option value="Rapid Freight Services">Rapid Freight Services</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Load Reference #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LOAD-1246"
                    value={newClaimForm.reference}
                    onChange={(e) => setNewClaimForm({ ...newClaimForm, reference: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Claim Date</label>
                  <input
                    type="date"
                    required
                    value={newClaimForm.claimDate}
                    onChange={(e) => setNewClaimForm({ ...newClaimForm, claimDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Amount Ex GST ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="2500.00"
                    value={newClaimForm.amountExGst}
                    onChange={(e) => setNewClaimForm({ ...newClaimForm, amountExGst: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={newClaimForm.paymentMethod}
                    onChange={(e) => setNewClaimForm({ ...newClaimForm, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-semibold"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="EFT">EFT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Service Description</label>
                <input
                  type="text"
                  placeholder="Transport Services / Toll Charges"
                  value={newClaimForm.description}
                  onChange={(e) => setNewClaimForm({ ...newClaimForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewClaimModal(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-xs"
                >
                  Save Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. EDIT CONTRACTOR CLAIM MODAL */}
      {showEditClaimModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[9999] p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">Edit Contractor Claim</h2>
                <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-lg text-xs">
                  {editingClaimForm.id}
                </span>
              </div>
              <button onClick={() => setShowEditClaimModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateClaimSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Contractor Name</label>
                <select
                  value={editingClaimForm.contractor}
                  onChange={(e) => setEditingClaimForm({ ...editingClaimForm, contractor: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-semibold"
                >
                  <option value="Darren Logistics">Darren Logistics</option>
                  <option value="Coastline Car Carriers">Coastline Car Carriers</option>
                  <option value="AJ Transport">AJ Transport</option>
                  <option value="Northline Haulage">Northline Haulage</option>
                  <option value="Rapid Freight Services">Rapid Freight Services</option>
                  <option value="Swift Car Movers">Swift Car Movers</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Load Reference #</label>
                  <input
                    type="text"
                    required
                    value={editingClaimForm.reference}
                    onChange={(e) => setEditingClaimForm({ ...editingClaimForm, reference: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Claim Date</label>
                  <input
                    type="text"
                    required
                    value={editingClaimForm.claimDate}
                    onChange={(e) => setEditingClaimForm({ ...editingClaimForm, claimDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Amount Ex GST ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingClaimForm.amountExGst}
                    onChange={(e) => setEditingClaimForm({ ...editingClaimForm, amountExGst: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={editingClaimForm.paymentMethod}
                    onChange={(e) => setEditingClaimForm({ ...editingClaimForm, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-semibold"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="EFT">EFT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Claim Status</label>
                  <select
                    value={editingClaimForm.status}
                    onChange={(e) => setEditingClaimForm({ ...editingClaimForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-semibold"
                  >
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Service Description</label>
                  <input
                    type="text"
                    value={editingClaimForm.description}
                    onChange={(e) => setEditingClaimForm({ ...editingClaimForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-300 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditClaimModal(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorPay;
