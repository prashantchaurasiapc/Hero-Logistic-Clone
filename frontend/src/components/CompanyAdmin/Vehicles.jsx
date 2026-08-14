import React, { useEffect } from 'react';
import api from '../../services/api';
import {
  Package, Truck, DollarSign, Globe, Users, Box, Zap, Activity,
  Plus, SlidersHorizontal, Search, FileText, AlertCircle, CheckCircle2, UserCheck,
  Truck as TruckIcon, MapPin, Trash2, ChevronLeft, Camera, Upload, Clock,
  Wrench, Shield, Droplet, List, Grid, X, UserPlus, Clipboard, Star, Edit, Building, Store, ShieldAlert,
  Power, Settings, User, RotateCcw, RefreshCw, Check, Target,
  TrendingUp, TrendingDown, CreditCard, BarChart2, PieChart, ArrowUpRight, ArrowDownRight,
  Download, Eye, Lock, Unlock, MoreVertical, Mail, Phone, Calendar,
  Key, Save, ChevronRight, ChevronDown as ChevronDownIcon, Bell, MessageSquare,
  LifeBuoy, Headphones, Inbox, Printer, ArrowLeft, Gauge, Image as ImageIcon, ArrowRight, ChevronsUpDown, Flag, Info, Car, Weight, Navigation,
  Menu, CheckCircle, Award, Filter, Columns, ArrowUpDown, AlertTriangle, Copy, Scale, Palette, Briefcase, Terminal, Cpu, Database, Wind, UploadCloud
} from 'lucide-react';

// Helper upload components moved outside to prevent unmounting on re-renders
const VehicleLicenceFileUploadBox = () => {
  const [file, setFile] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile({
        name: selectedFile.name,
        size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        url: URL.createObjectURL(selectedFile)
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full text-left">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg" 
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group w-full ${
            isDragging 
              ? 'border-purple-600 bg-purple-100/50 scale-[0.99]' 
              : 'border-gray-300 bg-gray-50/50 hover:border-purple-400 hover:bg-purple-50/50'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-2xs">
            <UploadCloud size={24} />
          </div>
          <p className="text-[13px] font-bold text-gray-900 mb-1">Drag and drop file here, or click to browse</p>
          <p className="text-[11px] font-medium text-gray-400 mb-4">Support for PDF, PNG, JPG up to 10MB</p>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="px-5 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-bold text-gray-700 hover:border-purple-300 transition-all cursor-pointer"
          >
            Browse File
          </button>
        </div>
      ) : (
        <div className="border border-purple-200 bg-purple-50/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText size={20} />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-gray-800 truncate max-w-[240px]">{file.name}</p>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-bold">Uploaded</span>
              </div>
              <p className="text-[10px] text-gray-500 font-semibold">{file.size} • Ready for processing</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a 
              href={file.url} 
              target="_blank" 
              rel="noreferrer"
              className="px-3 py-1.5 bg-white border border-purple-200 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Eye size={13} /> View File
            </a>
            <button 
              type="button"
              onClick={() => setFile(null)}
              className="p-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition-all cursor-pointer"
              title="Remove File"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const VehicleDocUploadBox = ({ title }) => {
  const [docFile, setDocFile] = React.useState(null);
  const docInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
    }
  };

  return (
    <div className="w-full text-left">
      <input 
        type="file" 
        ref={docInputRef} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg" 
        onChange={handleFileChange} 
      />
      {!docFile ? (
        <div 
          onClick={() => docInputRef.current?.click()}
          className="border border-gray-200 rounded-xl p-4 flex flex-col h-[90px] hover:border-purple-300 transition-colors group cursor-pointer bg-white relative"
        >
          <h4 className="text-[11px] font-bold text-gray-700 leading-tight pr-6">{title}</h4>
          <div className="absolute right-4 top-4 text-gray-400 group-hover:text-purple-600">
            <UploadCloud size={14} />
          </div>
          <div className="mt-auto flex items-center justify-center gap-1.5 text-gray-500 group-hover:text-purple-700 transition-colors text-[10px] font-bold">
            <UploadCloud size={12} /> Upload
          </div>
        </div>
      ) : (
        <div className="border border-purple-200 bg-purple-50/60 rounded-xl p-3 flex flex-col justify-between h-[90px] shadow-2xs">
          <div className="flex items-center justify-between gap-1 overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <CheckCircle size={14} className="text-emerald-600 shrink-0" />
              <h4 className="text-[11px] font-bold text-gray-800 truncate">{title}</h4>
            </div>
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); setDocFile(null); }}
              className="text-gray-400 hover:text-rose-600 transition-colors shrink-0"
              title="Remove File"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <div className="mt-auto">
            <p className="text-[10px] font-bold text-purple-800 truncate">{docFile.name}</p>
            <p className="text-[8px] font-medium text-gray-500">{docFile.size} • Uploaded</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Vehicles = () => {
  const [vehicles, setVehicles] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/vehicles');
      if (res.data && res.data.success) {
        const mapped = res.data.data.map(v => ({
          id: v.id,
          displayId: v.rego || v.id.slice(0, 6).toUpperCase(),
          reg: v.rego || v.plate || '—',
          branch: v.branch || 'N/A',
          driver: v.driver ? `${v.driver.firstName || ''} ${v.driver.lastName || ''}`.trim() || v.driver.driverCode : '—',
          driverId: v.driver?.driverCode || '',
          driverImg: v.driver?.avatarUrl || '',
          type: v.category || v.type || 'Vehicle',
          make: v.make ? `${v.make} ${v.model || ''}`.trim() : v.model || 'Unknown',
          year: v.year ? String(v.year) : '—',
          status: v.status || 'ACTIVE',
          odometer: v.odometerKm ? `${v.odometerKm.toLocaleString()} km` : '—',
          compliance: v.compliance || 'Compliant',
          nextServiceDate: v.maintenanceDueKm ? `${v.maintenanceDueKm.toLocaleString()} km` : '—',
          nextServiceDays: '',
          img: v.photoUrl || v.photo || (v.notes && v.notes.includes('Photo:') ? v.notes.split('Photo:')[1].split('|')[0].trim() : '') || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60',
          color: v.color || '',
          vin: v.vin || '',
          engineNumber: v.engineNumber || '',
          fuelType: v.fuelType || '',
          regType: v.regType || '',
          regState: v.regState || '',
          regIssueDate: v.regIssueDate || '',
          regExpiryDate: v.regExpiryDate || '',
          primaryMechanic: v.primaryMechanic || '',
          preferredRoutes: v.preferredRoutes || '',
          preferredRegions: v.preferredRegions || '',
          maxDistPerTripKm: v.maxDistPerTripKm || '',
          dgCertified: v.dgCertified || false,
          notes: v.notes || '',
          _raw: v
        }));
        setVehicles(mapped);
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [sortBy, setSortBy] = React.useState('id');
  const [viewMode, setViewMode] = React.useState('list'); // 'list' | 'grid'
  const [editVehicleModal, setEditVehicleModal] = React.useState(null);

  // Current Trailer Assignment & Modal States
  const [currentTrailer, setCurrentTrailer] = React.useState(null);
  const [showSwapTrailerModal, setShowSwapTrailerModal] = React.useState(false);
  const [showUnassignTrailerModal, setShowUnassignTrailerModal] = React.useState(false);
  const [showViewTrailerModal, setShowViewTrailerModal] = React.useState(false);
  const [selectedSwapTrailer, setSelectedSwapTrailer] = React.useState('');
  const [swapReason, setSwapReason] = React.useState('');
  const [unassignReason, setUnassignReason] = React.useState('');
  const [assignmentHistory, setAssignmentHistory] = React.useState([]);

  // Add/Edit Modals state
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [managingVehicle, setManagingVehicle] = React.useState(null);
  const [newVehicle, setNewVehicle] = React.useState({
    id: '', reg: '', branch: 'SYDNEY', driver: '', type: 'HEAVY TRUCK', payload: 'PAYLOAD: 20T', status: 'ACTIVE'
  });

  const [isEditingVehicle, setIsEditingVehicle] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('OVERVIEW');

  // Quick Actions Modal States
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = React.useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = React.useState(false);
  const [showPrintProfileModal, setShowPrintProfileModal] = React.useState(false);
  const [showExportReportModal, setShowExportReportModal] = React.useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = React.useState(false);
  const [showMoreActionsDropdown, setShowMoreActionsDropdown] = React.useState(false);

  const [maintenanceForm, setMaintenanceForm] = React.useState({
    type: 'Scheduled Service', date: '', odometer: '', provider: '', cost: '', description: '', nextDue: '', parts: '', labour: '', notes: ''
  });
  const [expenseForm, setExpenseForm] = React.useState({
    category: 'Fuel', date: '', amount: '', gst: '', description: '', receipt: '', paymentMethod: 'Company Card', notes: ''
  });

  // Costs & Expenses Tab State
  const [expenseSubTab, setExpenseSubTab] = React.useState('All Expenses');
  const [expenseSearchQuery, setExpenseSearchQuery] = React.useState('');
  const [expenseFilterCategory, setExpenseFilterCategory] = React.useState('All');
  const [showExpenseFilterDropdown, setShowExpenseFilterDropdown] = React.useState(false);
  const [viewingExpenseModal, setViewingExpenseModal] = React.useState(null);
  const [activeExpenseMenuId, setActiveExpenseMenuId] = React.useState(null);

  const [expensesList, setExpensesList] = React.useState([]);

  const filteredExpenses = React.useMemo(() => {
    return expensesList.filter(item => {
      if (expenseSubTab !== 'All Expenses' && item.category.toLowerCase() !== expenseSubTab.toLowerCase()) {
        return false;
      }
      if (expenseFilterCategory !== 'All' && item.category !== expenseFilterCategory) {
        return false;
      }
      if (expenseSearchQuery.trim()) {
        const q = expenseSearchQuery.toLowerCase();
        const mDesc = item.description?.toLowerCase().includes(q);
        const mRef = item.ref?.toLowerCase().includes(q);
        const mCat = item.category?.toLowerCase().includes(q);
        const mAdded = item.addedBy?.toLowerCase().includes(q);
        if (!mDesc && !mRef && !mCat && !mAdded) return false;
      }
      return true;
    });
  }, [expensesList, expenseSubTab, expenseFilterCategory, expenseSearchQuery]);
  const [exportFormat, setExportFormat] = React.useState('PDF');
  const [exportSections, setExportSections] = React.useState({
    overview: true, documents: true, maintenance: true, costs: true, assignments: false
  });
  const [deactivateReason, setDeactivateReason] = React.useState('');
  const [deactivateConfirmText, setDeactivateConfirmText] = React.useState('');
  const [editVehicleForm, setEditVehicleForm] = React.useState({
    id: '',
    reg: '',
    make: '',
    model: '',
    year: '',
    engine: '',
    transmission: '',
    vin: '',
    branch: '',
    driver: '',
    type: '',
    payload: '',
    status: 'ACTIVE',
    odometer: '',
    efficiency: '',
    fuelLevel: '',
    engineHours: '',
    homeDepot: '',
    nextService: '',
    notes: ''
  });

  // Documents & Compliance State
  const [docSubTab, setDocSubTab] = React.useState('All');
  const [docSearchQuery, setDocSearchQuery] = React.useState('');
  const [docFilterStatus, setDocFilterStatus] = React.useState('All');
  const [showDocFilterDropdown, setShowDocFilterDropdown] = React.useState(false);
  const [activeDocMenuId, setActiveDocMenuId] = React.useState(null);
  const [viewingDocModal, setViewingDocModal] = React.useState(null);
  const [editingDocModal, setEditingDocModal] = React.useState(null);
  const [viewingMaintenanceModal, setViewingMaintenanceModal] = React.useState(null);
  const [showUploadDocModal, setShowUploadDocModal] = React.useState(false);
  const [docToastMessage, setDocToastMessage] = React.useState(null);
  const [docPage, setDocPage] = React.useState(1);
  const [docRowsPerPage, setDocRowsPerPage] = React.useState(10);
  const [uploadedDocFile, setUploadedDocFile] = React.useState(null);
  const docFileInputRef = React.useRef(null);

  const [newDocForm, setNewDocForm] = React.useState({
    docName: '', category: 'Truck Documents', asset: 'Truck', docNo: '', issueDate: '', expiryDate: '', status: 'Valid', notes: ''
  });

  const [documentsList, setDocumentsList] = React.useState([]);

  const showDocToast = (msg) => {
    setDocToastMessage(msg);
    setTimeout(() => setDocToastMessage(null), 3000);
  };

  const filteredDocuments = React.useMemo(() => {
    return documentsList.filter(item => {
      if (docSubTab === 'Truck Documents' && item.category !== 'Truck Documents') return false;
      if (docSubTab === 'Trailer Documents' && item.category !== 'Trailer Documents') return false;
      if (docSubTab === 'Compliance & Licences' && item.category !== 'Compliance & Licences') return false;
      if (docSubTab === 'Insurance' && item.category !== 'Insurance') return false;
      if (docSubTab === 'Certificates' && item.category !== 'Certificates') return false;
      if (docSubTab === 'Other' && item.category !== 'Other') return false;

      if (docFilterStatus !== 'All' && item.status !== docFilterStatus) return false;

      if (docSearchQuery.trim()) {
        const q = docSearchQuery.toLowerCase();
        const mDoc = item.doc.toLowerCase().includes(q);
        const mNo = item.no.toLowerCase().includes(q);
        const mAsset = item.asset.toLowerCase().includes(q);
        const mCat = item.category.toLowerCase().includes(q);
        if (!mDoc && !mNo && !mAsset && !mCat) return false;
      }
      return true;
    });
  }, [documentsList, docSubTab, docFilterStatus, docSearchQuery]);

  const toggleDocReminder = (id) => {
    setDocumentsList(prev => prev.map(d => {
      if (d.id === id) {
        const updated = !d.reminderEnabled;
        showDocToast(`Reminder ${updated ? 'Enabled' : 'Disabled'} for ${d.doc}`);
        return { ...d, reminderEnabled: updated };
      }
      return d;
    }));
  };

  const deleteDoc = (id, docName) => {
    setDocumentsList(prev => prev.filter(d => d.id !== id));
    setActiveDocMenuId(null);
    showDocToast(`Document "${docName}" deleted successfully`);
  };

  const downloadDoc = (docItem) => {
    setActiveDocMenuId(null);
    showDocToast(`Downloading ${docItem.doc} (${docItem.no}.pdf)...`);
  };

  const handleCreateDocument = (e) => {
    e.preventDefault();
    if (!newDocForm.docName || !newDocForm.docNo) return;
    const newEntry = {
      id: Date.now(),
      doc: newDocForm.docName,
      category: newDocForm.category || 'Truck Documents',
      asset: newDocForm.asset || 'Truck',
      no: newDocForm.docNo,
      issue: newDocForm.issueDate || new Date().toLocaleDateString('en-GB'),
      exp: newDocForm.expiryDate || '15/12/2026',
      status: newDocForm.status || 'Valid',
      days: '365 days',
      color: newDocForm.status === 'Expiring Soon' ? 'text-orange-500 bg-orange-50' : newDocForm.status === 'Overdue' ? 'text-rose-600 bg-rose-50' : 'text-green-600 bg-green-50',
      reminderEnabled: true
    };
    setDocumentsList(prev => [newEntry, ...prev]);
    setShowUploadDocModal(false);
    setNewDocForm({ docName: '', category: 'Truck Documents', asset: 'Truck', docNo: '', issueDate: '', expiryDate: '', status: 'Valid', notes: '' });
    showDocToast(`Document "${newEntry.doc}" added successfully!`);
  };

  const startEditingVehicle = () => {
    setEditVehicleForm({
      id: managingVehicle.id,
      reg: managingVehicle.reg,
      make: managingVehicle.make || 'Kenworth',
      model: managingVehicle.model || 'T610',
      year: managingVehicle.year || '2023',
      engine: managingVehicle.engine || 'PACCAR MX-13',
      transmission: managingVehicle.transmission || 'Eaton Fuller',
      vin: managingVehicle.vin || '1XKDP4TXBEJ123456',
      branch: managingVehicle.branch,
      driver: managingVehicle.driver,
      type: managingVehicle.type,
      payload: managingVehicle.payload || 'PAYLOAD: 20T',
      status: managingVehicle.status,
      odometer: managingVehicle.odometer || '184,220',
      efficiency: managingVehicle.efficiency || '18.4',
      fuelLevel: managingVehicle.fuelLevel || '68',
      engineHours: managingVehicle.engineHours || '4,120',
      homeDepot: managingVehicle.homeDepot || 'Sydney Central Depot',
      nextService: managingVehicle.nextService || 'In 4,500 km (~188,720 km)',
      notes: managingVehicle.notes || 'Vehicle primarily used for long-haul routes. No smoking in cabin.'
    });
    setIsEditingVehicle(true);
  };

  const saveVehicleEdits = async () => {
    try {
      await api.put(`/vehicles/${managingVehicle.id}`, {
        rego: editVehicleForm.reg,
        make: editVehicleForm.make,
        model: editVehicleForm.model,
        year: editVehicleForm.year ? parseInt(editVehicleForm.year) : undefined,
        engineNumber: editVehicleForm.engine,
        vin: editVehicleForm.vin,
        branch: editVehicleForm.branch,
        status: editVehicleForm.status,
        odometerKm: editVehicleForm.odometer ? parseInt(editVehicleForm.odometer.replace(/,/g, '')) : undefined,
        notes: editVehicleForm.notes
      });
      fetchVehicles();
      setIsEditingVehicle(false);
      showToast('Vehicle updated successfully!');
    } catch (err) {
      console.error('Error updating vehicle:', err);
      showToast('Failed to update vehicle.', 'error');
    }
  };

  const handleSwapTrailer = (trailerId, reason) => {
    const trailerList = {
      'TRL105': { id: 'TRL105', name: 'TRL105 – Flatbed Heavy Trailer', type: 'Flatbed Trailer', reg: 'TRL105', vin: '6T9T25A21NOTR1105', axles: '3', depot: 'Sydney Depot', status: 'Available', isPrimary: true, img: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a44?w=600&auto=format&fit=crop&q=60' },
      'TRL302': { id: 'TRL302', name: 'TRL302 – Refrigerated Box Trailer', type: 'Refrigerated Box', reg: 'TRL302', vin: '6T9T25A21NOTR1302', axles: '2', depot: 'Melbourne Base', status: 'Available', isPrimary: true, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=60' },
      'TRL409': { id: 'TRL409', name: 'TRL409 – Low Loader Heavy Duty', type: 'Low Loader', reg: 'TRL409', vin: '6T9T25A21NOTR1409', axles: '4', depot: 'Brisbane Hub', status: 'Available', isPrimary: true, img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60' },
      'TRL512': { id: 'TRL512', name: 'TRL512 – Curtainsider 45ft Trailer', type: 'Curtainsider', reg: 'TRL512', vin: '6T9T25A21NOTR1512', axles: '3', depot: 'Sydney Depot', status: 'Available', isPrimary: true, img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60' },
      'TRL608': { id: 'TRL608', name: 'TRL608 – Liquid Tanker Trailer', type: 'Tanker', reg: 'TRL608', vin: '6T9T25A21NOTR1608', axles: '3', depot: 'Adelaide Depot', status: 'Available', isPrimary: true, img: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a44?w=600&auto=format&fit=crop&q=60' }
    };

    const selected = trailerList[trailerId];
    if (selected) {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      setAssignmentHistory(prev => {
        const updated = prev.map((item, idx) => {
          if (idx === 0 && item.toDate === '- Current -') {
            return { ...item, toDate: formattedDate };
          }
          return item;
        });
        return [
          {
            fromDate: formattedDate,
            toDate: '- Current -',
            trailer: `${selected.id} - ${selected.name.split(' – ')[1] || selected.name}`,
            type: selected.type,
            reg: selected.reg,
            assignedBy: 'Admin User',
            reason: reason || 'Swap Assignment',
            notes: '-'
          },
          ...updated
        ];
      });

      setCurrentTrailer(selected);
    }
  };

  const handleUnassignTrailer = (reason) => {
    if (!currentTrailer) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setAssignmentHistory(prev => {
      const updated = prev.map((item, idx) => {
        if (idx === 0 && item.toDate === '- Current -') {
          return { ...item, toDate: formattedDate };
        }
        return item;
      });
      return [
        {
          fromDate: formattedDate,
          toDate: '- Current -',
          trailer: 'Unassigned',
          type: '-',
          reg: '-',
          assignedBy: 'Admin User',
          reason: reason || 'Unassigned',
          notes: '-'
        },
        ...updated
      ];
    });

    setCurrentTrailer(null);
  };

  const handleDuplicateVehicle = (vehicle) => {
    if (!vehicle) return;
    const prefix = vehicle.id.charAt(0);
    const numericPart = parseInt(vehicle.id.slice(1));
    let newNum = isNaN(numericPart) ? 100 : numericPart + 1;
    let newId = `${prefix}${newNum}`;
    while (vehicles.some(v => v.id === newId)) {
      newNum += 1;
      newId = `${prefix}${newNum}`;
    }

    const duplicated = {
      ...vehicle,
      id: newId,
      make: `${vehicle.make} (Copy)`,
      reg: `${vehicle.reg} (COPY)`,
      status: 'ACTIVE'
    };

    setVehicles(prev => [duplicated, ...prev]);
    setManagingVehicle(duplicated);
  };

  const handleReactivateVehicle = async (vehicle) => {
    if (!vehicle) return;
    try {
      await api.put(`/vehicles/${vehicle.id}`, { status: 'ACTIVE' });
      fetchVehicles();
      showToast('Vehicle reactivated successfully!');
    } catch (err) {
      console.error('Error reactivating vehicle:', err);
    }
  };

  const closeEditModal = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    setTimeout(() => {
      setEditVehicleModal(null);
    }, 50);
  };

  const closeDetailsView = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    setTimeout(() => {
      setManagingVehicle(null);
    }, 50);
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const payload = {
        rego: (fd.get('reg') || '').toUpperCase(),
        make: fd.get('make') || '',
        model: fd.get('model') || '',
        year: fd.get('year') ? parseInt(fd.get('year')) : undefined,
        category: fd.get('type') || 'TRUCK',
        color: fd.get('color') || '',
        vin: fd.get('vin') || '',
        engineNumber: fd.get('engine') || '',
        odometerKm: fd.get('odometer') ? parseInt(String(fd.get('odometer')).replace(/[^0-9]/g, '')) : 0,
        fuelType: fd.get('fuelType') || 'Diesel',
        regType: fd.get('regType') || '',
        regState: fd.get('regState') || '',
        primaryMechanic: fd.get('primaryMechanic') || '',
        preferredRoutes: fd.get('preferredRoutes') || '',
        preferredRegions: fd.get('preferredRegions') || '',
        maxDistPerTripKm: fd.get('maxDist') ? parseInt(fd.get('maxDist')) : undefined,
        dgCertified: fd.get('dgCertified') === 'Yes',
        notes: fd.get('photoUrl') ? `${fd.get('notes') || ''} | Photo:${fd.get('photoUrl')}` : (fd.get('notes') || '')
      };
      await api.post('/vehicles', payload);
      fetchVehicles();
      setShowAddModal(false);
      showToast('Vehicle added successfully!');
    } catch (err) {
      console.error('Error creating vehicle:', err);
      showToast('Failed to save vehicle to database.', 'error');
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
      showToast('Vehicle deleted successfully!');
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      showToast('Failed to delete vehicle.', 'error');
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = !search.trim() || 
      (v.id && String(v.id).toLowerCase().includes(search.toLowerCase())) ||
      (v.reg && String(v.reg).toLowerCase().includes(search.toLowerCase())) ||
      (v.make && String(v.make).toLowerCase().includes(search.toLowerCase())) ||
      (v.branch && String(v.branch).toLowerCase().includes(search.toLowerCase())) ||
      (v.driver && String(v.driver).toLowerCase().includes(search.toLowerCase()));

    if (statusFilter === 'ALL') return matchesSearch;

    const vStatus = String(v.status || '').toUpperCase().replace(/\s+/g, '_');
    if (statusFilter === 'ACTIVE') {
      return matchesSearch && (vStatus === 'ACTIVE' || vStatus === 'IDLE' || vStatus === 'IN_TRANSIT' || vStatus === 'AVAILABLE');
    }
    if (statusFilter === 'MAINTENANCE') {
      return matchesSearch && (vStatus === 'MAINTENANCE' || vStatus === 'IN_MAINTENANCE' || vStatus === 'SERVICE');
    }
    if (statusFilter === 'OUT OF SERVICE' || statusFilter === 'OUT_OF_SERVICE') {
      return matchesSearch && (vStatus === 'OUT_OF_SERVICE' || vStatus === 'ALERT' || vStatus === 'BREAKDOWN');
    }
    if (statusFilter === 'INACTIVE') {
      return matchesSearch && (vStatus === 'INACTIVE' || vStatus === 'SOLD' || vStatus === 'DEACTIVATED');
    }

    return matchesSearch && (vStatus === statusFilter || String(v.status || '').toUpperCase() === statusFilter);
  });

  if (managingVehicle) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left font-sans flex flex-col gap-6">
        
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-semibold transition-all animate-in slide-in-from-bottom-4 duration-300 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
            <CheckCircle2 size={18} />
            {toast.msg}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[9990] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-purple-700">Loading vehicles...</p>
            </div>
          </div>
        )}
        <div className="flex flex-row justify-between items-center gap-4 border-b border-gray-100 pb-4 flex-wrap sm:flex-nowrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none">
                {activeTab === 'DOCUMENTS & COMPLIANCE' ? 'Vehicle Documents & Compliance' : activeTab === 'MAINTENANCE & SERVICE' ? 'Vehicle Maintenance & Service' : activeTab === 'COSTS & EXPENSES' ? 'Vehicle Costs & Expenses' : activeTab === 'ACTIVITY HISTORY' ? 'Vehicle Activity History' : 'Vehicle Details'}
              </h1>
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-500 text-[13px] font-medium mt-1">
              {activeTab === 'DOCUMENTS & COMPLIANCE' 
                 ? 'Manage all documents, licences, registrations and compliance for this vehicle and its assets.' 
                 : activeTab === 'MAINTENANCE & SERVICE'
                 ? 'Track, schedule and manage all maintenance, inspections and service history for this vehicle.'
                 : activeTab === 'COSTS & EXPENSES'
                 ? 'Track all costs and expenses associated with this vehicle.'
                 : activeTab === 'ACTIVITY HISTORY'
                 ? 'View a complete timeline of all activities and events for this vehicle.'
                 : 'View and manage vehicle information, documents, maintenance and assignments.'}
            </p>
          </div>
          <div className="flex flex-nowrap items-center gap-2 mt-2 sm:mt-0 shrink-0">
             {activeTab === 'DOCUMENTS & COMPLIANCE' || activeTab === 'ACTIVITY HISTORY' ? (
                <button onClick={() => setActiveTab('OVERVIEW')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
                  <ChevronLeft size={16} /> Back to Vehicle Details
                </button>
             ) : activeTab === 'MAINTENANCE & SERVICE' ? (
                 <>
                   <button onClick={() => setActiveTab('OVERVIEW')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer whitespace-nowrap">
                     <ChevronLeft size={16} /> Back to Vehicle Details
                   </button>
                   <button onClick={() => setShowAddMaintenanceModal(true)} className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-purple-50 shadow-sm transition-colors cursor-pointer whitespace-nowrap">
                     <Plus size={16} /> Add Maintenance
                   </button>
                   <div className="relative">
                     <button onClick={() => setShowMoreActionsDropdown(prev => !prev)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer whitespace-nowrap">
                       More Actions <ChevronDownIcon size={16} />
                     </button>
                     {showMoreActionsDropdown && (
                       <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                         <button onClick={() => { setShowMoreActionsDropdown(false); setShowExportReportModal(true); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                           <Download size={14} className="text-gray-500" /> Export Report
                         </button>
                         <button onClick={() => { setShowMoreActionsDropdown(false); setShowPrintProfileModal(true); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                           <Printer size={14} className="text-gray-500" /> Print Profile
                         </button>
                         <button onClick={() => { setShowMoreActionsDropdown(false); setActiveTab('OVERVIEW'); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                           <Eye size={14} className="text-gray-500" /> View Overview
                         </button>
                         <div className="border-t border-gray-100 my-1" />
                         <button onClick={() => { setShowMoreActionsDropdown(false); setShowDeactivateModal(true); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
                           <Power size={14} /> Deactivate Vehicle
                         </button>
                       </div>
                     )}
                   </div>
                 </>
             ) : activeTab === 'COSTS & EXPENSES' ? (
                 <>
                   <button onClick={() => setActiveTab('OVERVIEW')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer whitespace-nowrap">
                     <ChevronLeft size={16} /> Back to Vehicle Details
                   </button>
                   <button onClick={() => setShowAddExpenseModal(true)} className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-purple-50 shadow-sm transition-colors cursor-pointer whitespace-nowrap">
                     <Plus size={16} /> Add Expense
                   </button>
                   <div className="relative">
                     <button onClick={() => setShowMoreActionsDropdown(prev => !prev)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer whitespace-nowrap">
                       More Actions <ChevronDownIcon size={16} />
                     </button>
                     {showMoreActionsDropdown && (
                       <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                         <button onClick={() => { setShowMoreActionsDropdown(false); setShowExportReportModal(true); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                           <Download size={14} className="text-gray-500" /> Export Report
                         </button>
                         <button onClick={() => { setShowMoreActionsDropdown(false); setShowPrintProfileModal(true); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                           <Printer size={14} className="text-gray-500" /> Print Profile
                         </button>
                         <button onClick={() => { setShowMoreActionsDropdown(false); setActiveTab('OVERVIEW'); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                           <Eye size={14} className="text-gray-500" /> View Overview
                         </button>
                         <div className="border-t border-gray-100 my-1" />
                         <button onClick={() => { setShowMoreActionsDropdown(false); setShowDeactivateModal(true); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
                           <Power size={14} /> Deactivate Vehicle
                         </button>
                       </div>
                     )}
                   </div>
                 </>
             ) : (
                <>
                  <button 
                    onClick={() => setEditVehicleModal(managingVehicle)}
                    className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-purple-50 shadow-sm transition-colors cursor-pointer"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDuplicateVehicle(managingVehicle)}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer"
                  >
                    <Copy size={16} /> Duplicate
                  </button>
                  {managingVehicle.status === 'ACTIVE' ? (
                    <button 
                      onClick={() => setShowDeactivateModal(true)}
                      className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-red-50 shadow-sm transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} /> Deactivate
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleReactivateVehicle(managingVehicle)}
                      className="px-4 py-2 bg-white border border-emerald-200 text-emerald-600 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-emerald-50 shadow-sm transition-colors cursor-pointer"
                    >
                      <CheckCircle size={16} /> Reactivate
                    </button>
                  )}
                  <button onClick={closeDetailsView} className="ml-2 w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm bg-white">
                    <X size={18} />
                  </button>
                </>
             )}
          </div>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Profile Card (Left) */}
          <div className="lg:col-span-9 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col relative">
            <div className="p-6 flex flex-col sm:flex-row gap-8">
              {/* Vehicle Photos */}
              <div className="flex flex-col gap-2 shrink-0">
                <div className="w-full sm:w-[300px] h-[200px] rounded-xl overflow-hidden shadow-sm relative border border-gray-100">
                   <img 
                     src={managingVehicle.img || managingVehicle.photoUrl || (managingVehicle.notes && managingVehicle.notes.includes('Photo:') ? managingVehicle.notes.split('Photo:')[1].split('|')[0].trim() : null) || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60'} 
                     alt="Vehicle Main" 
                     className="w-full h-full object-cover" 
                   />
                </div>
                <div className="grid grid-cols-4 gap-2 w-full sm:w-[300px]">
                   {[1, 2, 3].map((num) => (
                     <div key={num} className="h-16 rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity border border-gray-100">
                        <img 
                          src={managingVehicle.img || managingVehicle.photoUrl || (managingVehicle.notes && managingVehicle.notes.includes('Photo:') ? managingVehicle.notes.split('Photo:')[1].split('|')[0].trim() : null) || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60'} 
                          alt="Thumb" 
                          className="w-full h-full object-cover" 
                        />
                     </div>
                   ))}
                   <div className="h-16 rounded-lg bg-[#1a202c] text-white flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm hover:bg-black transition-colors">
                      +5
                   </div>
                </div>
              </div>

              {/* Vehicle Data Grid */}
              <div className="flex-grow flex flex-col min-w-0">
                 <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight truncate">{managingVehicle.id} – {managingVehicle.make?.toUpperCase() || 'VOLVO FH540'}</h2>
                    <span className="px-2.5 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded-md text-[11px] font-bold uppercase tracking-wider shrink-0">Active</span>
                 </div>
                 
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 pr-4">
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Type</p>
                       <p className="text-sm font-bold text-gray-900">{managingVehicle.type || 'Prime Mover (Truck)'}</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Make / Model</p>
                       <p className="text-sm font-bold text-gray-900">{managingVehicle.make || 'Volvo FH540'}</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Year</p>
                       <p className="text-sm font-bold text-gray-900">{managingVehicle.year || '2021'}</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">VIN / Chassis No.</p>
                       <p className="text-sm font-bold text-gray-900 break-all">{managingVehicle.vin || 'YV2RT60A1MA123456'}</p>
                    </div>
                    
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Registration</p>
                       <p className="text-sm font-bold text-gray-900 uppercase">{managingVehicle.reg || 'ABC123'}</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Odometer</p>
                       <p className="text-sm font-bold text-gray-900">{managingVehicle.odometer || '256,789 km'}</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Engine No.</p>
                       <p className="text-sm font-bold text-gray-900">D13K123456</p>
                    </div>
                    <div>
                       <p className="text-[11px] font-semibold text-gray-500 mb-1">Depot / Base</p>
                       <p className="text-sm font-bold text-gray-900">{managingVehicle.branch || 'Sydney Depot'}</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="px-6 pt-4 mt-auto border-t border-gray-100 flex justify-between w-full overflow-x-auto min-w-0 gap-6">
               {['Overview', 'Documents & Compliance', 'Maintenance & Service', 'Costs & Expenses', 'Activity History', 'Notes'].map(tab => (
                  <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab.toUpperCase())}
                     className={`pb-4 text-[13px] font-bold tracking-wide relative whitespace-nowrap cursor-pointer ${activeTab === tab.toUpperCase() ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-700'}`}>
                     {tab}
                  </button>
               ))}
            </div>
          </div>

          {/* Right Side Status/Trailer Card */}
          <div className="lg:col-span-3 flex flex-col gap-6 h-full">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col flex-grow">
            {activeTab === 'DOCUMENTS & COMPLIANCE' || activeTab === 'MAINTENANCE & SERVICE' || activeTab === 'COSTS & EXPENSES' || activeTab === 'ACTIVITY HISTORY' ? (
              <>
                <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">Linked Trailer</h3>
                {currentTrailer ? (
                  <div className="flex flex-col gap-4 text-[13px] font-medium h-full justify-between">
                     <div className="flex flex-col items-center justify-center text-center">
                       <div className="w-[120px] h-[80px] rounded-lg overflow-hidden border border-gray-200 mb-3 shadow-sm">
                          <img 
                            src={currentTrailer.img} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60";
                            }}
                            className="w-full h-full object-cover" 
                            alt="Linked Trailer" 
                          />
                       </div>
                       <p className="font-bold text-gray-900 text-sm mb-1">{currentTrailer.name}</p>
                       <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded text-[10px] font-bold uppercase tracking-widest">Assigned</span>
                     </div>
                     <button 
                       onClick={() => setShowViewTrailerModal(true)}
                       className="w-full mt-4 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 py-2 rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
                     >
                       View Trailer Details
                     </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                     <Truck size={28} className="text-slate-400" />
                     <p className="font-bold text-slate-800 text-xs">No Trailer Connected</p>
                     <p className="text-[10px] text-slate-500 font-medium">Vehicle operating standalone.</p>
                     <button 
                       onClick={() => setShowSwapTrailerModal(true)}
                       className="mt-2 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all"
                     >
                       + Assign Trailer
                     </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">Vehicle Status</h3>
                <div className="flex flex-col gap-4 text-[13px] font-medium">
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Compliance</span>
                      <div className="flex items-center gap-1.5 text-green-600"><span className="font-bold">Compliant</span> <CheckCircle2 size={16} className="fill-green-100" /></div>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Maintenance</span>
                      <div className="flex items-center gap-1.5 text-green-600"><span className="font-bold">Good</span> <CheckCircle2 size={16} className="fill-green-100" /></div>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Insurance</span>
                      <div className="flex items-center gap-1.5 text-green-600"><span className="font-bold">Active</span> <CheckCircle2 size={16} className="fill-green-100" /></div>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Registration</span>
                      <div className="flex items-center gap-1.5 text-green-600"><span className="font-bold">Valid</span> <CheckCircle2 size={16} className="fill-green-100" /></div>
                   </div>
                   <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-600">Roadworthy</span>
                      <div className="flex items-center gap-1.5 text-green-600"><span className="font-bold">Valid</span> <CheckCircle2 size={16} className="fill-green-100" /></div>
                   </div>
                   <div className="flex justify-between items-center pb-2">
                      <span className="text-gray-600">GPS Tracking</span>
                      <div className="flex items-center gap-1.5 text-blue-600"><span className="font-bold">Online</span> <div className="w-2 h-2 rounded-full bg-blue-600"></div></div>
                   </div>
                </div>
              </>
            )}
            </div>
          </div>
        </div>

        {/* Middle Section */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Current Trailer Assignment (Left) */}
          <div className="lg:col-span-9 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 relative flex flex-col h-full">
             <div className="flex items-center gap-3 mb-6">
                <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">CURRENT TRAILER ASSIGNMENT</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest shrink-0 ${
                  currentTrailer ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {currentTrailer ? 'Assigned' : 'Unassigned'}
                </span>
             </div>
             
             {currentTrailer ? (
               <div className="flex flex-col sm:flex-row gap-6 items-start mb-auto">
                  <div className="w-full sm:w-[220px] h-[150px] rounded-xl overflow-hidden shadow-sm shrink-0 border border-gray-100">
                     <img 
                       src={currentTrailer.img} 
                       onError={(e) => {
                         e.target.onerror = null;
                         e.target.src = "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60";
                       }}
                       alt="Trailer" 
                       className="w-full h-full object-cover" 
                     />
                  </div>
                  
                  <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4 w-full">
                     <div className="col-span-2 sm:col-span-3 flex items-center gap-3 mb-1">
                        <h4 className="text-[17px] font-bold text-gray-900 tracking-tight">{currentTrailer.name}</h4>
                        {currentTrailer.isPrimary && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[10px] font-bold shrink-0">Primary Trailer</span>
                        )}
                     </div>
                     
                     <div>
                        <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Type</p>
                        <p className="text-sm font-bold text-gray-900">{currentTrailer.type}</p>
                     </div>
                     <div>
                        <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Registration</p>
                        <p className="text-sm font-bold text-gray-900 uppercase">{currentTrailer.reg}</p>
                     </div>
                     <div className="col-span-2 sm:col-span-1 sm:row-span-3 flex flex-col gap-2.5 justify-center border-l-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 mt-2 sm:mt-0">
                        <button 
                          onClick={() => setShowSwapTrailerModal(true)}
                          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm h-10"
                        >
                           <ArrowUpDown size={14} /> Swap Trailer
                        </button>
                        <button 
                          onClick={() => setShowUnassignTrailerModal(true)}
                          className="w-full px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm h-10"
                        >
                           <Trash2 size={14} /> Unassign Trailer
                        </button>
                        <button 
                          onClick={() => setShowViewTrailerModal(true)}
                          className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm h-10"
                        >
                           <ArrowUpRight size={14} /> View Trailer
                        </button>
                     </div>
                     
                     <div>
                        <p className="text-[11px] font-semibold text-gray-500 mb-0.5">VIN / Chassis No.</p>
                        <p className="text-[12px] font-bold text-gray-900 uppercase break-all">{currentTrailer.vin}</p>
                     </div>
                     <div>
                        <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Axles</p>
                        <p className="text-sm font-bold text-gray-900">{currentTrailer.axles}</p>
                     </div>
                     
                     <div>
                        <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Depot / Base</p>
                        <p className="text-sm font-bold text-gray-900">{currentTrailer.depot}</p>
                     </div>
                     <div>
                        <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Status</p>
                        <p className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-block">{currentTrailer.status}</p>
                     </div>
                  </div>
               </div>
             ) : (
               <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 mb-auto">
                 <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                   <Truck size={24} />
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-800">No Trailer Currently Assigned</h4>
                   <p className="text-xs text-slate-500 font-medium">This vehicle is operating standalone without an attached trailer.</p>
                 </div>
                 <button 
                   onClick={() => setShowSwapTrailerModal(true)} 
                   className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
                 >
                   <Plus size={14} /> Assign New Trailer
                 </button>
               </div>
             )}
             
             <div className="mt-6 flex items-center gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100/60 text-left">
                <Info size={16} className="text-blue-500 shrink-0" />
                <p className="text-[12px] text-gray-600 font-medium leading-relaxed">This trailer is currently assigned to this vehicle. You can swap, unassign or view trailer details.</p>
             </div>
          </div>

          {/* Upcoming Compliance (Right) */}
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-5 border-b border-gray-50 pb-4">
               <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest leading-snug">Upcoming Compliance <span className="text-gray-500 font-normal normal-case tracking-normal block mt-1">(Next 30 Days)</span></h3>
               <a href="#" className="text-[11px] font-bold text-purple-700 flex items-center gap-0.5 hover:underline whitespace-nowrap mt-0.5">View All <ArrowRight size={12} /></a>
            </div>
            <div className="flex flex-col gap-4">
               {[
                  { name: 'Registration - T101', expiry: 'Expires on 15/07/2025', days: '21 days', color: 'text-green-600 border-green-200 bg-green-50' },
                  { name: 'Insurance - C201', expiry: 'Expires on 18/07/2025', days: '24 days', color: 'text-green-600 border-green-200 bg-green-50' },
                  { name: 'Roadworthy - T101', expiry: 'Expires on 22/07/2025', days: '28 days', color: 'text-orange-600 border-orange-200 bg-orange-50' },
                  { name: 'Heavy Vehicle Inspection', expiry: 'Expires on 05/08/2025', days: '31 days', color: 'text-orange-600 border-orange-200 bg-orange-50' }
               ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center gap-2">
                     <div className="flex gap-2.5 items-start">
                        <FileText size={16} className="text-green-600 mt-0.5 shrink-0" />
                        <div>
                           <div className="text-[12px] font-bold text-gray-900 leading-tight break-words">{item.name}</div>
                           <div className="text-[10px] text-gray-500 mt-1 font-medium">{item.expiry}</div>
                        </div>
                     </div>
                     <span className={`px-2 py-0.5 text-[10px] font-bold border rounded whitespace-nowrap ${item.color}`}>{item.days}</span>
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* Lower Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Vehicle Specifications */}
          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-full">
            <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">VEHICLE SPECIFICATIONS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[12px]">
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Box size={14} className="shrink-0" /> Configuration</div>
                  <span className="font-bold text-gray-900 text-right">6x4</span>
               </div>
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Settings size={14} className="shrink-0" /> Transmission</div>
                  <span className="font-bold text-gray-900 text-right">Automatic</span>
               </div>
               
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Weight size={14} className="shrink-0" /> GVM</div>
                  <span className="font-bold text-gray-900 text-right">26,500 kg</span>
               </div>
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Zap size={14} className="shrink-0" /> Engine</div>
                  <span className="font-bold text-gray-900 text-right">D13 540HP</span>
               </div>
               
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Scale size={14} className="shrink-0" /> Tare Weight</div>
                  <span className="font-bold text-gray-900 text-right">8,750 kg</span>
               </div>
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Droplet size={14} className="shrink-0" /> Fuel Tank Cap</div>
                  <span className="font-bold text-gray-900 text-right">800 L</span>
               </div>
               
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Package size={14} className="shrink-0" /> Payload Cap</div>
                  <span className="font-bold text-gray-900 text-right">17,750 kg</span>
               </div>
               <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Palette size={14} className="shrink-0" /> Color</div>
                  <span className="font-bold text-gray-900 text-right">White</span>
               </div>
               
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Gauge size={14} className="shrink-0" /> Fuel Type</div>
                  <span className="font-bold text-gray-900 text-right">Diesel</span>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600 font-medium"><Briefcase size={14} className="shrink-0" /> Primary Use</div>
                  <span className="font-bold text-gray-900 text-right truncate pl-2">Car Transport</span>
               </div>
            </div>
          </div>

          {/* Linked Assets & Connection */}
          <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-full relative">
            <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">LINKED ASSETS & CONNECTION</h3>
            
            <div className="flex flex-col sm:flex-row items-start justify-between relative gap-6 sm:gap-0">
               
               <div className="flex flex-col gap-3.5 text-[12px] w-full z-10 sm:pr-24">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-1.5">
                     <span className="text-gray-600 font-medium">Connected Trailer</span>
                     <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{currentTrailer ? currentTrailer.name : 'No Trailer Connected'}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${currentTrailer ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                          {currentTrailer ? 'Assigned' : 'Unassigned'}
                        </span>
                     </div>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                     <span className="text-gray-600 font-medium">Fifth Wheel Type</span>
                     <span className="font-bold text-gray-900">JOST JSK37C</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                     <span className="text-gray-600 font-medium">Electrical Connection</span>
                     <span className="font-bold text-gray-900">7 Pin (ISO 1185)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                     <span className="text-gray-600 font-medium">Air Connection</span>
                     <span className="font-bold text-gray-900">Gladhand (Red/Yellow)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                     <span className="text-gray-600 font-medium">Max Combined GCM</span>
                     <span className="font-bold text-gray-900">62,500 kg</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-1.5">
                     <span className="text-gray-600 font-medium">Last Swapped</span>
                     <span className="font-bold text-gray-900">15 May 2025 - 08:30 AM</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-gray-600 font-medium">Connection Status</span>
                     <span className={`font-bold ${currentTrailer ? 'text-green-600' : 'text-slate-500'}`}>{currentTrailer ? 'Secure & Active' : 'Disconnected'}</span>
                  </div>
               </div>

               {/* Asset connection graphic */}
               <div className="static sm:absolute right-0 top-0 bottom-0 w-full sm:w-20 flex flex-row sm:flex-col items-center justify-center sm:justify-between py-2 sm:py-0 border-t border-gray-100 sm:border-0 pt-4 sm:pt-0">
                  <div className="flex flex-col items-center gap-1">
                     <span className="text-[10px] font-bold text-gray-500">T101</span>
                     <TruckIcon size={32} strokeWidth={1.5} className="text-gray-700" />
                  </div>
                  <div className={`w-16 h-0.5 sm:w-0.5 sm:h-full relative flex items-center justify-center mx-2 sm:mx-0 sm:my-2 ${currentTrailer ? 'bg-green-500' : 'bg-slate-300'}`}>
                     <div className={`absolute w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10 ${currentTrailer ? 'bg-green-500' : 'bg-slate-400'}`}>
                        {currentTrailer ? (
                          <Check size={12} className="text-white stroke-[3px]" />
                        ) : (
                          <X size={12} className="text-white" />
                        )}
                     </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                     <div className="w-10 h-6 border-2 border-gray-700 rounded-sm flex items-center justify-center relative mt-1 bg-gray-50">
                        <div className="absolute -bottom-1 left-1 w-2 h-2 rounded-full bg-gray-800"></div>
                        <div className="absolute -bottom-1 right-1 w-2 h-2 rounded-full bg-gray-800"></div>
                     </div>
                     <span className="text-[10px] font-bold text-gray-500 mt-1">{currentTrailer ? currentTrailer.id : 'None'}</span>
                  </div>
               </div>

            </div>
          </div>

          {/* AI Trailer Recommendations */}
          <div className="lg:col-span-3 bg-purple-50/40 border border-purple-100 rounded-2xl shadow-sm p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
               <h3 className="text-[13px] font-black text-purple-900 uppercase tracking-widest leading-snug">AI Trailer Recommendations</h3>
               <span className="bg-purple-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm shrink-0">AI</span>
            </div>
            <p className="text-[11px] text-gray-600 mb-5 font-medium">(AI Add-on) Based on upcoming loads and compatibility.</p>
            
            <div className="flex flex-col gap-4 mb-auto">
               <div className="flex justify-between items-center text-[12px] font-bold text-gray-800 bg-white p-2.5 rounded-lg border border-purple-100 shadow-sm">
                  <span>TRL305 - 6 Car Carrier</span>
                  <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded">95% Match</span>
               </div>
               <div className="flex justify-between items-center text-[12px] font-bold text-gray-800 bg-white p-2.5 rounded-lg border border-purple-100 shadow-sm">
                  <span>TRL202 - 10 Car Carrier</span>
                  <span className="text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">78% Match</span>
               </div>
               <div className="flex justify-between items-center text-[12px] font-bold text-gray-800 bg-white p-2.5 rounded-lg border border-purple-100 shadow-sm">
                  <span>TRL104 - Enclosed Carrier</span>
                  <span className="text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">65% Match</span>
               </div>
            </div>
            
            <button className="w-full mt-6 py-2.5 bg-white border border-purple-200 text-purple-700 rounded-xl text-[12px] font-bold hover:bg-purple-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
               <Star size={14} className="fill-purple-700" /> View All Recommendations
            </button>
          </div>
        </div>

        {/* Bottom Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
           
           {/* Assignment History Table */}
           <div className="lg:col-span-9 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col h-full">
              <div className="p-6 pb-4 border-b border-gray-100">
                 <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">TRUCK / TRAILER ASSIGNMENT HISTORY</h3>
              </div>
              <div className="overflow-x-auto min-w-0">
                 <table className="w-full text-left text-[12px]">
                    <thead>
                       <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-800 bg-gray-50/50">
                          <th className="py-3.5 px-6 whitespace-nowrap">From Date</th>
                          <th className="py-3.5 px-4 whitespace-nowrap">To Date</th>
                          <th className="py-3.5 px-4">Trailer</th>
                          <th className="py-3.5 px-4 whitespace-nowrap">Trailer Type</th>
                          <th className="py-3.5 px-4">Registration</th>
                          <th className="py-3.5 px-4 whitespace-nowrap">Assigned By</th>
                          <th className="py-3.5 px-4">Reason</th>
                          <th className="py-3.5 px-6">Notes</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                        {assignmentHistory.map((item, idx) => (
                           <tr key={idx} className="hover:bg-gray-50/50">
                              <td className="py-3 px-6 whitespace-nowrap">{item.fromDate}</td>
                              <td className="py-3 px-4 whitespace-nowrap">{item.toDate}</td>
                              <td className="py-3 px-4 whitespace-nowrap text-gray-900 font-bold">{item.trailer}</td>
                              <td className="py-3 px-4 whitespace-nowrap">{item.type}</td>
                              <td className="py-3 px-4 uppercase text-gray-900 font-bold">{item.reg}</td>
                              <td className="py-3 px-4 whitespace-nowrap">{item.assignedBy}</td>
                              <td className="py-3 px-4 whitespace-nowrap">{item.reason}</td>
                              <td className="py-3 px-6 text-gray-400">{item.notes}</td>
                           </tr>
                        ))}
                    </tbody>
                 </table>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto gap-4">
                 <span className="text-[12px] font-medium text-gray-500">Showing 1 to {assignmentHistory.length} of {assignmentHistory.length} records</span>
                 <div className="flex items-center gap-3">
                    <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                       <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                       <button className="px-3 py-1 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                       <button className="px-2.5 py-1 text-gray-400 cursor-not-allowed bg-gray-50"><ChevronRight size={14} /></button>
                    </div>
                    <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                       <option>10 / page</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Quick Actions */}
           <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-full flex flex-col">
              <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">QUICK ACTIONS</h3>
              <div className="flex flex-col gap-4 text-[13px] font-bold text-gray-700 mt-2">
                 <button onClick={() => setShowAddMaintenanceModal(true)} className="w-full text-left flex items-center gap-3 hover:text-purple-700 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-purple-50 group-hover:border-purple-100 group-hover:text-purple-600 transition-all shadow-sm"><Wrench size={14} /></div> Add Maintenance Record
                 </button>
                 <button onClick={() => setShowAddExpenseModal(true)} className="w-full text-left flex items-center gap-3 hover:text-purple-700 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-purple-50 group-hover:border-purple-100 group-hover:text-purple-600 transition-all shadow-sm"><DollarSign size={14} /></div> Add Expense
                 </button>
                 <button onClick={() => setShowPrintProfileModal(true)} className="w-full text-left flex items-center gap-3 hover:text-purple-700 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-purple-50 group-hover:border-purple-100 group-hover:text-purple-600 transition-all shadow-sm"><Printer size={14} /></div> Print Vehicle Profile
                 </button>
                 <button onClick={() => setShowExportReportModal(true)} className="w-full text-left flex items-center gap-3 hover:text-purple-700 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-purple-50 group-hover:border-purple-100 group-hover:text-purple-600 transition-all shadow-sm"><Download size={14} /></div> Export Vehicle Report
                 </button>
                 
                 <div className="h-px w-full bg-gray-100 my-2"></div>
                 
                 {managingVehicle.status === 'ACTIVE' ? (
                     <button onClick={() => setShowDeactivateModal(true)} className="w-full text-left flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center group-hover:bg-red-100 transition-all shadow-sm"><Trash2 size={14} /></div> Deactivate Vehicle
                     </button>
                  ) : (
                     <button onClick={() => handleReactivateVehicle(managingVehicle)} className="w-full text-left flex items-center gap-3 text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-100 transition-all shadow-sm"><CheckCircle size={14} /></div> Reactivate Vehicle
                     </button>
                  )}
              </div>
           </div>

         </div>
        </div>
       )}

       {activeTab === 'DOCUMENTS & COMPLIANCE' && (
          <div className="space-y-6 mt-6">
            {/* Toast Notification */}
            {docToastMessage && (
              <div className="fixed bottom-6 right-6 z-[999999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{docToastMessage}</span>
              </div>
            )}

            {/* Subtabs Filter & Controls */}
            <div className="flex justify-between items-center overflow-x-auto gap-4 pb-2">
               <div className="flex gap-2 shrink-0">
                  {['All', 'Truck Documents', 'Trailer Documents', 'Compliance & Licences', 'Insurance', 'Certificates', 'Other'].map((subtab) => {
                    const count = subtab === 'All' 
                      ? documentsList.length 
                      : documentsList.filter(d => d.category === subtab).length;
                    const isActive = docSubTab === subtab;
                    return (
                      <button
                        key={subtab}
                        onClick={() => { setDocSubTab(subtab); setDocPage(1); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-all flex items-center gap-2 ${
                          isActive 
                            ? 'bg-purple-700 text-white shadow-sm border border-purple-700' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{subtab}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
               </div>
               <div className="flex items-center gap-3 shrink-0">
                  {/* Status Filter Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowDocFilterDropdown(prev => !prev)}
                      className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-xs font-bold shadow-xs hover:bg-slate-50 cursor-pointer ${docFilterStatus !== 'All' ? 'border-purple-500 text-purple-700 bg-purple-50/50' : 'border-slate-200 text-slate-700'}`}
                    >
                       <Filter size={14} /> 
                       <span>{docFilterStatus === 'All' ? 'Filter Status' : docFilterStatus}</span>
                    </button>
                    {showDocFilterDropdown && (
                      <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs font-semibold">
                        {['All', 'Valid', 'Expiring Soon', 'Overdue'].map((st) => (
                          <button
                            key={st}
                            onClick={() => { setDocFilterStatus(st); setShowDocFilterDropdown(false); }}
                            className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${docFilterStatus === st ? 'text-purple-700 font-bold bg-purple-50/50' : 'text-slate-700'}`}
                          >
                            <span>{st}</span>
                            {docFilterStatus === st && <CheckCircle2 size={13} className="text-purple-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input
                      type="text"
                      value={docSearchQuery}
                      onChange={e => { setDocSearchQuery(e.target.value); setDocPage(1); }}
                      placeholder="Search documents..."
                      className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-400 shadow-xs w-52 text-slate-800"
                    />
                  </div>

                  {/* Upload New Document Button */}
                  <button
                    onClick={() => setShowUploadDocModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                    title="Upload New Document"
                  >
                     <Plus size={15} /> Upload Doc
                  </button>
               </div>
            </div>

            {/* Main Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
               
               {/* Left Column: Documents List */}
               <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
                  <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">DOCUMENTS & COMPLIANCE LIST</h3>
                        <span className="px-2.5 py-0.5 bg-purple-700 text-white rounded-md text-[11px] font-bold">{filteredDocuments.length}</span>
                     </div>
                     {(docSubTab !== 'All' || docSearchQuery || docFilterStatus !== 'All') && (
                        <button
                          onClick={() => { setDocSubTab('All'); setDocSearchQuery(''); setDocFilterStatus('All'); }}
                          className="text-xs text-purple-600 hover:underline font-bold cursor-pointer"
                        >
                          Clear Filters
                        </button>
                     )}
                  </div>

                  <div className="overflow-x-auto min-w-0">
                     <table className="w-full min-w-[750px] text-left text-xs">
                        <thead>
                           <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-700 bg-slate-50/70">
                              <th className="py-3.5 px-6 whitespace-nowrap">Document Type</th>
                              <th className="py-3.5 px-4 whitespace-nowrap">Asset</th>
                              <th className="py-3.5 px-4 whitespace-nowrap">Document No.</th>
                              <th className="py-3.5 px-4 whitespace-nowrap">Issue Date</th>
                              <th className="py-3.5 px-4 whitespace-nowrap">Expiry Date</th>
                              <th className="py-3.5 px-4 whitespace-nowrap text-center">Status</th>
                              <th className="py-3.5 px-4 whitespace-nowrap text-right">Days Left</th>
                              <th className="py-3.5 px-4 whitespace-nowrap text-center">Reminder</th>
                              <th className="py-3.5 px-6 whitespace-nowrap text-center">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                           {filteredDocuments.length === 0 ? (
                              <tr>
                                 <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">
                                    <div className="flex flex-col items-center gap-2">
                                       <FileText size={32} className="text-slate-300" />
                                       <p className="text-xs font-bold text-slate-600">No matching documents found</p>
                                       <p className="text-[11px] text-slate-400">Try adjusting your filters or search query.</p>
                                    </div>
                                 </td>
                              </tr>
                           ) : (
                              filteredDocuments.slice((docPage - 1) * docRowsPerPage, docPage * docRowsPerPage).map((row) => (
                                 <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3 px-6 whitespace-nowrap">
                                       <div className="flex items-center gap-2.5 text-slate-900 font-bold">
                                          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                                            {row.category === 'Insurance' ? <Shield size={14}/> : row.category === 'Certificates' ? <CheckCircle2 size={14}/> : <FileText size={14}/>}
                                          </div>
                                          <span>{row.doc}</span>
                                       </div>
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-semibold">{row.asset}</td>
                                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-800">{row.no}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">{row.issue}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">{row.exp}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-center">
                                       <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${row.color}`}>
                                          {row.status}
                                       </span>
                                    </td>
                                    <td className={`py-3 px-4 whitespace-nowrap font-bold text-right ${row.color.split(' ')[0]}`}>{row.days}</td>
                                    <td className="py-3 px-4">
                                       <div className="flex justify-center">
                                          <button
                                            type="button"
                                            onClick={() => toggleDocReminder(row.id)}
                                            className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${row.reminderEnabled ? 'bg-purple-600' : 'bg-slate-300'}`}
                                            title={row.reminderEnabled ? 'Reminder Enabled' : 'Reminder Disabled'}
                                          >
                                             <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all shadow-xs ${row.reminderEnabled ? 'right-0.75' : 'left-0.75'}`}></div>
                                          </button>
                                       </div>
                                    </td>
                                    <td className="py-3 px-6 relative">
                                       <div className="flex justify-center items-center gap-2 text-slate-400">
                                          <button
                                            onClick={() => setViewingDocModal(row)}
                                            className="p-1 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                            title="View Document Details"
                                          >
                                            <Eye size={15} />
                                          </button>
                                          <button
                                            onClick={() => downloadDoc(row)}
                                            className="p-1 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                            title="Download File"
                                          >
                                            <Download size={15} />
                                          </button>
                                          <button
                                            onClick={() => setActiveDocMenuId(prev => prev === row.id ? null : row.id)}
                                            className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                            title="More Actions"
                                          >
                                            <MoreVertical size={15} />
                                          </button>

                                          {/* Options Dropdown Menu */}
                                          {activeDocMenuId === row.id && (
                                             <div className="absolute right-4 top-10 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-left text-xs font-semibold text-slate-700 animate-in fade-in duration-100">
                                                <button
                                                  onClick={() => { setViewingDocModal(row); setActiveDocMenuId(null); }}
                                                  className="w-full px-3.5 py-2 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                                                >
                                                  <Eye size={14} /> View Document
                                                </button>
                                                <button
                                                  onClick={() => downloadDoc(row)}
                                                  className="w-full px-3.5 py-2 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                                                >
                                                  <Download size={14} /> Download File
                                                </button>
                                                <button
                                                  onClick={() => { toggleDocReminder(row.id); setActiveDocMenuId(null); }}
                                                  className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                                >
                                                  <Bell size={14} /> {row.reminderEnabled ? 'Disable Reminder' : 'Enable Reminder'}
                                                </button>
                                                <div className="my-1 border-t border-slate-100"></div>
                                                <button
                                                  onClick={() => deleteDoc(row.id, row.doc)}
                                                  className="w-full px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                                                >
                                                  <Trash2 size={14} /> Delete Document
                                                </button>
                                             </div>
                                          )}
                                       </div>
                                    </td>
                                 </tr>
                              ))
                           )}
                        </tbody>
                     </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap justify-between items-center bg-slate-50/50 mt-auto gap-4">
                     <span className="text-xs font-medium text-slate-500">
                        Showing {filteredDocuments.length === 0 ? 0 : (docPage - 1) * docRowsPerPage + 1} to {Math.min(docPage * docRowsPerPage, filteredDocuments.length)} of {filteredDocuments.length} documents
                     </span>
                     <div className="flex items-center gap-3">
                        <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                           <button
                             disabled={docPage === 1}
                             onClick={() => setDocPage(p => Math.max(1, p - 1))}
                             className={`px-2.5 py-1.5 border-r border-slate-200 transition-colors ${docPage === 1 ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-50 cursor-pointer'}`}
                           >
                             <ChevronLeft size={14} />
                           </button>
                           {[1, 2, 3].map(pNum => (
                              <button
                                key={pNum}
                                onClick={() => setDocPage(pNum)}
                                className={`px-3 py-1.5 font-bold border-r border-slate-200 cursor-pointer transition-colors ${docPage === pNum ? 'text-purple-700 bg-purple-50' : 'text-slate-600 hover:bg-slate-50'}`}
                              >
                                {pNum}
                              </button>
                           ))}
                           <button
                             disabled={docPage * docRowsPerPage >= filteredDocuments.length}
                             onClick={() => setDocPage(p => p + 1)}
                             className={`px-2.5 py-1.5 transition-colors ${docPage * docRowsPerPage >= filteredDocuments.length ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-600 hover:bg-slate-50 cursor-pointer'}`}
                           >
                             <ChevronRight size={14} />
                           </button>
                        </div>
                        <select
                          value={docRowsPerPage}
                          onChange={e => { setDocRowsPerPage(Number(e.target.value)); setDocPage(1); }}
                          className="border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer shadow-xs"
                        >
                           <option value={5}>5 / page</option>
                           <option value={10}>10 / page</option>
                           <option value={20}>20 / page</option>
                        </select>
                     </div>
                  </div>
               </div>

               {/* Right Column: Insights & Reminders */}
               <div className="lg:col-span-4 space-y-6">
                  
                  {/* Compliance Overview */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
                     <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">COMPLIANCE OVERVIEW</h3>
                     <div className="flex items-center gap-6">
                        {/* Donut Chart */}
                        <div className="w-24 h-24 rounded-full border-[10px] border-slate-100 relative flex items-center justify-center shrink-0" style={{ borderTopColor: '#22c55e', borderRightColor: '#f97316', borderBottomColor: '#ef4444' }}>
                           <div className="text-center">
                              <div className="text-xl font-black text-slate-900 leading-none">{documentsList.length}</div>
                              <div className="text-[10px] font-bold text-slate-400 mt-1">Total</div>
                           </div>
                        </div>
                        <div className="flex flex-col gap-3 text-xs font-bold w-full">
                           <div className="flex items-center gap-2 justify-between">
                              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> <span className="text-slate-700">{documentsList.filter(d => d.status === 'Valid').length}</span> <span className="text-slate-900">Valid</span></div>
                              <span className="text-slate-500 font-medium">({Math.round((documentsList.filter(d => d.status === 'Valid').length / documentsList.length) * 100)}%)</span>
                           </div>
                           <div className="flex items-center gap-2 justify-between">
                              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> <span className="text-slate-700">{documentsList.filter(d => d.status === 'Expiring Soon').length}</span> <span className="text-slate-900">Expiring Soon</span></div>
                              <span className="text-slate-500 font-medium">({Math.round((documentsList.filter(d => d.status === 'Expiring Soon').length / documentsList.length) * 100)}%)</span>
                           </div>
                           <div className="flex items-center gap-2 justify-between">
                              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> <span className="text-slate-700">{documentsList.filter(d => d.status === 'Overdue').length}</span> <span className="text-slate-900">Overdue</span></div>
                              <span className="text-slate-500 font-medium">({Math.round((documentsList.filter(d => d.status === 'Overdue').length / documentsList.length) * 100)}%)</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Expiring Soon List */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
                     <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-snug">EXPIRING SOON <span className="text-slate-400 font-normal normal-case tracking-normal block mt-0.5">(Next 30 Days)</span></h3>
                        <button onClick={() => setDocFilterStatus('Expiring Soon')} className="text-xs font-bold text-purple-700 flex items-center gap-0.5 hover:underline whitespace-nowrap cursor-pointer">View All <ArrowRight size={12} /></button>
                     </div>
                     <div className="flex flex-col gap-4">
                        {documentsList.filter(d => d.status === 'Expiring Soon' || d.status === 'Overdue').slice(0, 4).map((item) => (
                           <div key={item.id} className="flex justify-between items-center gap-2">
                              <div className="flex gap-2.5 items-start">
                                 <div className={`mt-0.5 shrink-0 ${item.color.split(' ')[0]}`}><FileText size={16}/></div>
                                 <div>
                                    <div className="text-xs font-bold text-slate-900 leading-tight">{item.doc}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Expires {item.exp}</div>
                                 </div>
                              </div>
                              <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-md whitespace-nowrap ${item.color}`}>{item.days}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Compliance Reminders Panel */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
                     <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">COMPLIANCE REMINDERS</h3>
                     </div>
                     <div className="flex flex-col gap-4 text-xs font-medium text-slate-700">
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> Email reminders</div>
                           <span className="font-bold text-emerald-600">Enabled</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /> SMS reminders</div>
                           <span className="font-bold text-emerald-600">Enabled</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Clock size={14} className="text-slate-400" /> Reminder days before expiry</div>
                           <span className="font-bold text-slate-900">30 days</span>
                        </div>
                     </div>
                  </div>
                  
               </div>
            </div>

            {/* VIEW DOCUMENT MODAL (Screenshot Card UI) */}
            {viewingDocModal && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[99999] p-4 overflow-y-auto" onClick={() => setViewingDocModal(null)}>
                <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-left border border-slate-100 max-h-[85vh] my-auto flex flex-col" onClick={e => e.stopPropagation()}>
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100/60 flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug">{viewingDocModal.doc}</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Doc No: {viewingDocModal.no} • {viewingDocModal.asset}</p>
                      </div>
                    </div>
                    <button onClick={() => setViewingDocModal(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shrink-0"><X size={18} /></button>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4 text-xs font-sans overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                      <div>
                        <span className="block text-[11px] font-semibold text-slate-400">Issue Date</span>
                        <span className="font-bold text-slate-800 text-xs">{viewingDocModal.issue}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-semibold text-slate-400">Expiry Date</span>
                        <span className="font-bold text-slate-800 text-xs">{viewingDocModal.exp}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-semibold text-slate-400">Category</span>
                        <span className="font-bold text-slate-800 text-xs">{viewingDocModal.category}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-semibold text-slate-400">Compliance Status</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${viewingDocModal.color}`}>{viewingDocModal.status} ({viewingDocModal.days})</span>
                      </div>
                    </div>

                    {/* Mock Document PDF Viewer Container */}
                    <div className="border border-slate-200 rounded-xl bg-slate-100 p-6 flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-purple-600 shadow-sm">
                        <FileText size={28} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">{viewingDocModal.doc} ({viewingDocModal.no}.pdf)</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">PDF Document • 2.4 MB • Verified & Compliance Ready</p>
                      </div>
                      <button
                        onClick={() => downloadDoc(viewingDocModal)}
                        className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                      >
                        <Download size={14} /> Download PDF File
                      </button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                    <button type="button" onClick={() => setViewingDocModal(null)} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs bg-white hover:bg-slate-50 transition-all cursor-pointer">Close</button>
                  </div>
                </div>
              </div>
            )}

            {/* UPLOAD DOCUMENT MODAL (Screenshot Card UI) */}
            {showUploadDocModal && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[99999] p-4 overflow-y-auto" onClick={() => setShowUploadDocModal(false)}>
                <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-left border border-slate-100 max-h-[85vh] my-auto flex flex-col" onClick={e => e.stopPropagation()}>
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100/60 flex items-center justify-center shrink-0">
                        <Upload size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug">Upload Document</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{managingVehicle?.id} – Add compliance document</p>
                      </div>
                    </div>
                    <button onClick={() => setShowUploadDocModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shrink-0"><X size={18} /></button>
                  </div>

                  {/* Body Form */}
                  <form onSubmit={handleCreateDocument} className="p-6 space-y-4 text-xs font-sans overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5">Document Name *</label>
                        <input
                          type="text"
                          required
                          value={newDocForm.docName}
                          onChange={e => setNewDocForm(p => ({...p, docName: e.target.value}))}
                          placeholder="e.g. Registration Certificate"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5">Document No. *</label>
                        <input
                          type="text"
                          required
                          value={newDocForm.docNo}
                          onChange={e => setNewDocForm(p => ({...p, docNo: e.target.value}))}
                          placeholder="e.g. REG-998822"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5">Category *</label>
                        <select
                          value={newDocForm.category}
                          onChange={e => setNewDocForm(p => ({...p, category: e.target.value}))}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
                        >
                          {['Truck Documents', 'Trailer Documents', 'Compliance & Licences', 'Insurance', 'Certificates', 'Other'].map(c => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5">Asset *</label>
                        <select
                          value={newDocForm.asset}
                          onChange={e => setNewDocForm(p => ({...p, asset: e.target.value}))}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
                        >
                          <option value="Truck">Truck ({managingVehicle?.id})</option>
                          <option value="Trailer TRL201">Trailer (TRL201)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5">Issue Date</label>
                        <input
                          type="date"
                          value={newDocForm.issueDate}
                          onChange={e => setNewDocForm(p => ({...p, issueDate: e.target.value}))}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5">Expiry Date *</label>
                        <input
                          type="date"
                          value={newDocForm.expiryDate}
                          onChange={e => setNewDocForm(p => ({...p, expiryDate: e.target.value}))}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Dropzone Simulation */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">Upload File (PDF / PNG / JPG)</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:border-purple-300 transition-colors cursor-pointer">
                        <Upload size={24} className="mx-auto text-purple-600 mb-1.5" />
                        <p className="font-bold text-slate-700 text-xs">Click to browse or drag & drop document file</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Supports PDF, PNG, JPG up to 10MB</p>
                      </div>
                    </div>

                    {/* Footer inside Form */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                      <button type="button" onClick={() => setShowUploadDocModal(false)} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs bg-white hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"><Upload size={15} /> Save & Upload</button>
                    </div>
                  </form>
                </div>
              </div>
            )}



          </div>
        )}

        {activeTab === 'MAINTENANCE & SERVICE' && (
         <div className="space-y-6 mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
               
               {/* Left Column */}
               <div className="lg:col-span-9 flex flex-col gap-6">
                  {/* Top row in left column */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl shadow-sm px-5 py-4 flex flex-col">
                         <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-3">UPCOMING MAINTENANCE</h3>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="flex flex-col gap-1">
                               <div className="flex items-center gap-1.5 text-purple-700 font-bold text-[11px]"><Wrench size={12} /> Next Service (Km)</div>
                               <div className="text-[15px] font-black text-gray-900">270,000 km</div>
                               <div className="text-[10px] font-bold text-green-600">In 13,211 km</div>
                            </div>
                            <div className="flex flex-col gap-1 sm:pl-3 border-none sm:border-solid border-l border-gray-100">
                               <div className="flex items-center gap-1.5 text-purple-700 font-bold text-[11px]"><Calendar size={12} /> Next Service (Date)</div>
                               <div className="text-[15px] font-black text-gray-900">22 Aug 2025</div>
                               <div className="text-[10px] font-bold text-green-600">In 28 days</div>
                            </div>
                            <div className="flex flex-col gap-1 sm:pl-3 border-none sm:border-solid border-l border-gray-100">
                               <div className="flex items-center gap-1.5 text-purple-700 font-bold text-[11px]"><ShieldAlert size={12} /> Next Inspection</div>
                               <div className="text-[15px] font-black text-gray-900">5 Aug 2025</div>
                               <div className="text-[10px] font-bold text-orange-500">In 11 days</div>
                            </div>
                            <div className="flex flex-col gap-1 sm:pl-3 border-none sm:border-solid border-l border-gray-100">
                               <div className="flex items-center gap-1.5 text-purple-700 font-bold text-[11px]"><RefreshCw size={12} /> Tyre Rotation</div>
                               <div className="text-[15px] font-black text-gray-900">15 Aug 2025</div>
                               <div className="text-[10px] font-bold text-green-600">In 21 days</div>
                            </div>
                         </div>
                      </div>
                      <div className="lg:col-span-1 bg-white border border-gray-100 rounded-xl shadow-sm px-5 py-4 flex flex-col justify-center">
                         <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-3">CURRENT ODOMETER</h3>
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-600 shrink-0">
                               <Gauge size={18} />
                            </div>
                            <div className="flex flex-col min-w-0">
                               <div className="text-[17px] font-black text-gray-900 tracking-tight truncate">256,789 km</div>
                               <div className="text-[10px] font-medium text-gray-500 truncate">Last Updated: Today, 07:35 AM</div>
                            </div>
                         </div>
                      </div>
                   </div>

                  {/* Maintenance History */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
                     <div className="p-6 pb-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">MAINTENANCE HISTORY</h3>
                        <div className="flex items-center gap-3">
                           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                              <Filter size={14} /> Filters
                           </button>
                           <div className="relative hidden sm:block">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input type="text" placeholder="Search maintenance..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-purple-300 shadow-sm w-48" />
                           </div>
                           <button className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
                              <Download size={14} />
                           </button>
                        </div>
                     </div>
                     <div className="overflow-x-auto min-w-0">
                        <table className="w-full min-w-[750px] text-left text-[12px]">
                           <thead>
                              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-800 bg-gray-50/50">
                                 <th className="py-3.5 px-6 whitespace-nowrap">Date</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Type</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Description</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Workshop / Supplier</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Odometer</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Cost (AUD)</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Next Due</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                                 <th className="py-3.5 px-6 whitespace-nowrap text-center">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">15 May 2025</td>
                                 <td className="py-3 px-4 whitespace-nowrap"><div className="flex items-center gap-1.5 text-blue-600 font-bold"><div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0"><Settings size={12} /></div> Major Service</div></td>
                                 <td className="py-3 px-4 whitespace-nowrap text-gray-900 font-bold">250,000 km Service</td>
                                 <td className="py-3 px-4 whitespace-nowrap">Volvo Truck Centre Sydney</td>
                                 <td className="py-3 px-4 whitespace-nowrap">250,100 km</td>
                                 <td className="py-3 px-4 whitespace-nowrap font-bold text-gray-900">$1,850.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">270,000 km</td>
                                 <td className="py-3 px-4 whitespace-nowrap"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span></td>
                                 <td className="py-3 px-6">
                                     <div className="flex justify-center items-center gap-2">
                                        <button 
                                           onClick={() => setViewingMaintenanceModal({ date: '15 May 2025', type: 'Major Service', description: '250,000 km Service', workshop: 'Volvo Truck Centre Sydney', odometer: '250,100 km', cost: '$1,850.00', nextDue: '270,000 km', status: 'Completed' })} 
                                           className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                           title="View Details"
                                        >
                                           <Eye size={13} />
                                           <span>View</span>
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                                           <MoreVertical size={14} />
                                        </button>
                                     </div>
                                  </td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">10 Apr 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-green-600 font-bold"><div className="w-5 h-5 rounded bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><Droplet size={12} /></div> Oil Change</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">Engine Oil & Filter Change</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Volvo Truck Centre Sydney</td>
                                 <td className="py-3 px-4 whitespace-nowrap">246,800 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$320.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">256,800 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span></td>
                                 <td className="py-3 px-6">
                                     <div className="flex justify-center items-center gap-2">
                                        <button 
                                           onClick={() => setViewingMaintenanceModal({ date: '10 Apr 2025', type: 'Oil Change', description: 'Engine Oil & Filter Change', workshop: 'Volvo Truck Centre Sydney', odometer: '246,800 km', cost: '$320.00', nextDue: '256,800 km', status: 'Completed' })} 
                                           className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                           title="View Details"
                                        >
                                           <Eye size={13} />
                                           <span>View</span>
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                                           <MoreVertical size={14} />
                                        </button>
                                     </div>
                                  </td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">25 Mar 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-600 font-bold"><div className="w-5 h-5 rounded bg-gray-50 flex items-center justify-center border border-gray-200 shrink-0"><AlertCircle size={12} /></div> Brake Inspection</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">Brake System Inspection</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Volvo Truck Centre Sydney</td>
                                 <td className="py-3 px-4 whitespace-nowrap">242,900 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$210.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">260,000 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span></td>
                                 <td className="py-3 px-6">
                                     <div className="flex justify-center items-center gap-2">
                                        <button 
                                           onClick={() => setViewingMaintenanceModal({ date: '25 Mar 2025', type: 'Brake Inspection', description: 'Brake System Inspection', workshop: 'Volvo Truck Centre Sydney', odometer: '242,900 km', cost: '$210.00', nextDue: '260,000 km', status: 'Completed' })} 
                                           className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                           title="View Details"
                                        >
                                           <Eye size={13} />
                                           <span>View</span>
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                                           <MoreVertical size={14} />
                                        </button>
                                     </div>
                                  </td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">20 Feb 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-600 font-bold"><div className="w-5 h-5 rounded bg-gray-50 flex items-center justify-center border border-gray-200 shrink-0"><RefreshCw size={12} /></div> Tyre Rotation</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">Rotate Tyres</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Tyre Right Campbelltown</td>
                                 <td className="py-3 px-4 whitespace-nowrap">239,450 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$180.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">260,000 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span></td>
                                 <td className="py-3 px-6">
                                     <div className="flex justify-center items-center gap-2">
                                        <button 
                                           onClick={() => setViewingMaintenanceModal({ date: '20 Feb 2025', type: 'Tyre Rotation', description: 'Rotate Tyres', workshop: 'Tyre Right Campbelltown', odometer: '239,450 km', cost: '$180.00', nextDue: '260,000 km', status: 'Completed' })} 
                                           className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                           title="View Details"
                                        >
                                           <Eye size={13} />
                                           <span>View</span>
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                                           <MoreVertical size={14} />
                                        </button>
                                     </div>
                                  </td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">05 Jan 2025</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-orange-500 font-bold"><div className="w-5 h-5 rounded bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0"><Droplet size={12} /></div> Coolant Flush</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">Cooling System Flush</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Volvo Truck Centre Sydney</td>
                                 <td className="py-3 px-4 whitespace-nowrap">233,000 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$540.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">260,000 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200">Attention</span></td>
                                 <td className="py-3 px-6">
                                     <div className="flex justify-center items-center gap-2">
                                        <button 
                                           onClick={() => setViewingMaintenanceModal({ date: '05 Jan 2025', type: 'Coolant Flush', description: 'Cooling System Flush', workshop: 'Volvo Truck Centre Sydney', odometer: '233,000 km', cost: '$540.00', nextDue: '260,000 km', status: 'Attention' })} 
                                           className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                           title="View Details"
                                        >
                                           <Eye size={13} />
                                           <span>View</span>
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                                           <MoreVertical size={14} />
                                        </button>
                                     </div>
                                  </td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">12 Dec 2024</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-green-600 font-bold"><div className="w-5 h-5 rounded bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><Zap size={12} /></div> Battery Check</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">Battery Load Test</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Volvo Truck Centre Sydney</td>
                                 <td className="py-3 px-4 whitespace-nowrap">228,500 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$95.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">240,000 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span></td>
                                 <td className="py-3 px-6">
                                     <div className="flex justify-center items-center gap-2">
                                        <button 
                                           onClick={() => setViewingMaintenanceModal({ date: '12 Dec 2024', type: 'Battery Check', description: 'Battery Load Test', workshop: 'Volvo Truck Centre Sydney', odometer: '228,500 km', cost: '$95.00', nextDue: '240,000 km', status: 'Completed' })} 
                                           className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                           title="View Details"
                                        >
                                           <Eye size={13} />
                                           <span>View</span>
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                                           <MoreVertical size={14} />
                                        </button>
                                     </div>
                                  </td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap">18 Nov 2024</td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-blue-600 font-bold"><div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0"><Wind size={12} /></div> Air Filter</div></td>
                                 <td className="py-3 px-4 text-gray-900 font-bold truncate max-w-[200px]">Air Filter Replacement</td>
                                 <td className="py-3 px-4 truncate max-w-[180px]">Volvo Truck Centre Sydney</td>
                                 <td className="py-3 px-4 whitespace-nowrap">223,200 km</td>
                                 <td className="py-3 px-4 font-bold text-gray-900">$140.00</td>
                                 <td className="py-3 px-4 whitespace-nowrap">243,200 km</td>
                                 <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span></td>
                                 <td className="py-3 px-6">
                                     <div className="flex justify-center items-center gap-2">
                                        <button 
                                           onClick={() => setViewingMaintenanceModal({ date: '18 Nov 2024', type: 'Air Filter', description: 'Air Filter Replacement', workshop: 'Volvo Truck Centre Sydney', odometer: '223,200 km', cost: '$140.00', nextDue: '243,200 km', status: 'Completed' })} 
                                           className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                           title="View Details"
                                        >
                                           <Eye size={13} />
                                           <span>View</span>
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                                           <MoreVertical size={14} />
                                        </button>
                                     </div>
                                  </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                     <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto gap-4 rounded-b-2xl">
                        <span className="text-[12px] font-medium text-gray-500">Showing 1 to 7 of 27 records</span>
                        <div className="flex items-center gap-3">
                           <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                              <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                              <button className="px-3 py-1 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">2</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">3</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">4</button>
                              <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                           </div>
                           <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                              <option>10 / page</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* Developer Notes */}
                  <div className="bg-[#f8f9fc] border border-purple-100 rounded-2xl p-6">
                     <h3 className="text-[12px] font-black text-purple-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center shrink-0"><Terminal size={14} className="text-purple-700" /></div>
                        DEVELOPER NOTES – VEHICLE MAINTENANCE & SERVICE
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] text-gray-700">
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Info size={12}/> 1. PURPOSE</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>Centralised maintenance tracking for trucks and linked trailers.</li>
                              <li>Ensure preventive maintenance is scheduled and completed.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Settings size={12}/> 2. KEY FEATURES</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>Schedule by date or odometer.</li>
                              <li>Track service history and costs.</li>
                              <li>Upload invoices / receipts.</li>
                              <li>AI predicts next service intervals.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Cpu size={12}/> 3. AUTOMATION & AI (ADD-ON)</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>AI reads invoices to auto-capture data.</li>
                              <li>Predicts wear & tear based on usage.</li>
                              <li>Alerts for overdue / upcoming services.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Shield size={12}/> 4. PERMISSIONS</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li><strong>Admin:</strong> Full access.</li>
                              <li><strong>Dispatcher:</strong> View, add, edit.</li>
                              <li><strong>Driver:</strong> View (in app), add service request.</li>
                           </ul>
                        </div>
                        <div>
                           <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Database size={12}/> 5. DATA SOURCES</div>
                           <ul className="list-disc pl-4 space-y-1">
                              <li>Workshop invoices (upload OCR).</li>
                              <li>Odometer (manual / telematics).</li>
                              <li>Manufacturer service intervals.</li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Column */}
               <div className="lg:col-span-3 flex flex-col gap-6">
                  {/* Service Cost Summary */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">SERVICE COST SUMMARY <span className="text-gray-500 font-normal normal-case">(This Year)</span></h3>
                     <div className="flex flex-col gap-4 text-[13px] font-medium">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                           <span className="text-gray-600">Total Maintenance Cost</span>
                           <span className="font-bold text-gray-900">$12,450.00</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                           <span className="text-gray-600">Total Labour Cost</span>
                           <span className="font-bold text-gray-900">$4,230.00</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                           <span className="text-gray-600">Total Parts Cost</span>
                           <span className="font-bold text-gray-900">$8,220.00</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                           <span className="text-purple-700 font-bold">Next 12 Months (Est.)</span>
                           <span className="font-bold text-purple-700">$6,750.00</span>
                        </div>
                     </div>
                  </div>

                  {/* Maintenance Health */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col h-full">
                     <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">MAINTENANCE HEALTH</h3>
                     <div className="flex flex-col items-center justify-center flex-grow py-4">
                        <div className="relative w-32 h-32 mb-6">
                           <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="92, 100" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f97316" strokeWidth="6" strokeDasharray="6, 100" strokeDashoffset="-92" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="6" strokeDasharray="2, 100" strokeDashoffset="-98" />
                           </svg>
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-[28px] font-black text-gray-900 leading-none">92%</span>
                              <span className="text-[12px] font-bold text-gray-500 mt-1">Good</span>
                           </div>
                        </div>
                        <div className="flex flex-col gap-3 text-[12px] font-bold w-full max-w-[200px]">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> <span className="text-gray-700">Good (92%)</span></div>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div> <span className="text-gray-700">Attention (6%)</span></div>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> <span className="text-gray-700">Critical (2%)</span></div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Service Reminders */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">SERVICE REMINDERS</h3>
                        <a href="#" className="text-[11px] font-bold text-purple-700 hover:underline">Manage</a>
                     </div>
                     <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0"><Bell size={12} className="text-gray-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Next Service Due</div>
                              <div className="text-[11px] text-gray-500 font-medium">22/08/2025</div>
                           </div>
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 whitespace-nowrap">28 days</span>
                        </div>
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0"><Bell size={12} className="text-gray-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Annual Inspection</div>
                              <div className="text-[11px] text-gray-500 font-medium">05/08/2025</div>
                           </div>
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 whitespace-nowrap">11 days</span>
                        </div>
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0"><Bell size={12} className="text-gray-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Brake Test</div>
                              <div className="text-[11px] text-gray-500 font-medium">10/08/2025</div>
                           </div>
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 whitespace-nowrap">16 days</span>
                        </div>
                        <div className="flex items-start gap-3">
                           <div className="mt-0.5 w-6 h-6 rounded bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0"><Bell size={12} className="text-gray-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Registration Check</div>
                              <div className="text-[11px] text-gray-500 font-medium">15/08/2025</div>
                           </div>
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 whitespace-nowrap">21 days</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
       )}

       {activeTab === 'COSTS & EXPENSES' && (
         <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
               {/* Left Column */}
               <div className="lg:col-span-9 flex flex-col gap-6">
                  {/* COST SUMMARY (This Year) */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                     <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">COST SUMMARY <span className="text-gray-500 font-normal normal-case">(This Year)</span></h3>
                     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="flex items-start gap-3">
                           <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0"><FileText size={14} className="text-purple-600" /></div>
                           <div className="min-w-0">
                              <div className="text-[16px] font-black text-gray-900">$28,450</div>
                              <div className="text-[11px] font-bold text-gray-700 mt-0.5">Total Spend</div>
                              <div className="text-[10px] text-gray-500 font-medium truncate">All categories</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-3 md:pl-4 border-none md:border-solid border-l border-gray-100">
                           <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0"><Wrench size={14} className="text-blue-600" /></div>
                           <div className="min-w-0">
                              <div className="text-[16px] font-black text-gray-900">$2.37</div>
                              <div className="text-[11px] font-bold text-gray-700 mt-0.5">Cost per km</div>
                              <div className="text-[10px] text-gray-500 font-medium truncate">Based on 12,000 km</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-3 md:pl-4 border-none md:border-solid border-l border-gray-100">
                           <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><MapPin size={14} className="text-green-600" /></div>
                           <div className="min-w-0">
                              <div className="text-[16px] font-black text-gray-900">12,000 km</div>
                              <div className="text-[11px] font-bold text-gray-700 mt-0.5">Distance Driven</div>
                              <div className="text-[10px] text-gray-500 font-medium truncate">This year</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-3 md:pl-4 border-none md:border-solid border-l border-gray-100">
                           <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0"><Calendar size={14} className="text-orange-600" /></div>
                           <div className="min-w-0">
                              <div className="text-[16px] font-black text-gray-900">$350</div>
                              <div className="text-[11px] font-bold text-gray-700 mt-0.5">Avg. Monthly Spend</div>
                              <div className="text-[10px] text-gray-500 font-medium truncate">All categories</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-3 md:pl-4 border-none md:border-solid border-l border-gray-100">
                           <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0"><FileText size={14} className="text-purple-600" /></div>
                           <div className="min-w-0">
                              <div className="text-[16px] font-black text-gray-900">$150</div>
                              <div className="text-[11px] font-bold text-gray-700 mt-0.5">Highest Expense</div>
                              <div className="text-[10px] text-gray-500 font-medium truncate">Fuel - 15 May 2025</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Expenses Table */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col min-w-0 overflow-hidden">
                     <div className="flex flex-col gap-3.5 p-5 border-b border-gray-100 min-w-0 w-full bg-white">
                        {/* Top Control Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 min-w-0 w-full">
                           <div className="flex items-center gap-2">
                              <h4 className="text-[13px] font-black text-gray-900 uppercase tracking-wider">Expense Records</h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                                 {filteredExpenses.length} Items
                              </span>
                           </div>
                           <div className="flex flex-wrap items-center gap-2 min-w-0 relative">
                              <button 
                                 onClick={() => setShowExpenseFilterDropdown(prev => !prev)}
                                 className={`flex items-center gap-1.5 px-3 py-1.5 bg-white border text-gray-700 rounded-lg text-[11px] font-bold shadow-xs hover:bg-gray-50 cursor-pointer transition-colors ${expenseFilterCategory !== 'All' ? 'border-purple-500 text-purple-700 bg-purple-50' : 'border-gray-200'}`}
                              >
                                 <Filter size={13} className={expenseFilterCategory !== 'All' ? 'text-purple-600' : 'text-gray-500'} /> 
                                 {expenseFilterCategory === 'All' ? 'Filters' : `Filter: ${expenseFilterCategory}`}
                              </button>

                              {showExpenseFilterDropdown && (
                                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1.5 text-xs">
                                  <div className="font-bold text-gray-700 px-2 py-1 border-b border-gray-100 text-[11px]">Filter Category</div>
                                  {['All', 'Fuel', 'Maintenance', 'Repairs', 'Registration', 'Insurance', 'Tolls', 'Other'].map(cat => (
                                    <button
                                      key={cat}
                                      onClick={() => { setExpenseFilterCategory(cat); setShowExpenseFilterDropdown(false); }}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${expenseFilterCategory === cat ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                      {cat}
                                    </button>
                                  ))}
                                </div>
                              )}

                              <div className="relative">
                                 <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                 <input 
                                    type="text" 
                                    placeholder="Search expenses..." 
                                    value={expenseSearchQuery}
                                    onChange={e => setExpenseSearchQuery(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] focus:outline-none focus:border-purple-400 shadow-xs w-36 sm:w-44" 
                                 />
                              </div>
                              <button 
                                 onClick={() => setShowExportReportModal(true)}
                                 title="Export / Download"
                                 className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-xs hover:bg-gray-50 cursor-pointer transition-colors"
                              >
                                 <Download size={13} />
                              </button>
                           </div>
                        </div>

                        {/* Category Sub-Tabs with scrollbar */}
                        <div className="flex gap-2 overflow-x-auto min-w-0 w-full pt-1 pb-1 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-gray-50">
                           {['All Expenses', 'Fuel', 'Maintenance', 'Repairs', 'Registration', 'Insurance', 'Tolls', 'Other'].map(tab => (
                              <button 
                                 key={tab} 
                                 onClick={() => setExpenseSubTab(tab)}
                                 className={`shrink-0 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                                    expenseSubTab === tab 
                                       ? 'bg-purple-700 text-white shadow-xs' 
                                       : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                                 }`}
                              >
                                 {tab}
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="overflow-x-auto min-w-0">
                        <table className="w-full min-w-[750px] text-left text-[12px]">
                           <thead>
                              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-800 bg-gray-50/50">
                                 <th className="py-3.5 px-6 whitespace-nowrap">Date</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                                 <th className="py-3.5 px-4 min-w-[200px] whitespace-nowrap">Description</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Reference / Receipt</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap text-right">Amount (AUD)</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap text-right">Odometer</th>
                                 <th className="py-3.5 px-4 whitespace-nowrap">Added By</th>
                                 <th className="py-3.5 px-6 whitespace-nowrap text-center">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                              {filteredExpenses.length === 0 ? (
                                 <tr>
                                    <td colSpan={8} className="py-8 text-center text-gray-400 font-semibold">
                                       No expenses found matching your criteria.
                                    </td>
                                 </tr>
                              ) : (
                                 filteredExpenses.map((exp) => {
                                    const getCategoryBadge = (cat) => {
                                       switch (cat) {
                                          case 'Fuel':
                                             return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <Droplet size={12} /> };
                                          case 'Maintenance':
                                             return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: <Wrench size={12} /> };
                                          case 'Repairs':
                                             return { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', icon: <Settings size={12} /> };
                                          case 'Registration':
                                             return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100', icon: <FileText size={12} /> };
                                          case 'Insurance':
                                             return { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: <Shield size={12} /> };
                                          case 'Tolls':
                                             return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: <MapPin size={12} /> };
                                          default:
                                             return { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', icon: <FileText size={12} /> };
                                       }
                                    };
                                    const badge = getCategoryBadge(exp.category);
                                    return (
                                       <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                                          <td className="py-3 px-6 whitespace-nowrap font-medium text-gray-700">{exp.date}</td>
                                          <td className="py-3 px-4">
                                             <div className={`flex items-center gap-1.5 ${badge.color} font-bold`}>
                                                <div className={`w-5 h-5 rounded ${badge.bg} flex items-center justify-center border ${badge.border} shrink-0`}>
                                                   {badge.icon}
                                                </div> 
                                                {exp.category}
                                             </div>
                                          </td>
                                          <td className="py-3 px-4">
                                             <div className="font-bold text-gray-900 truncate">{exp.description}</div>
                                             {exp.details && <div className="text-[10px] text-gray-500">{exp.details}</div>}
                                          </td>
                                          <td className="py-3 px-4">
                                             <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                                                {exp.ref} 
                                                <FileText 
                                                   size={12} 
                                                   className="text-purple-600 cursor-pointer hover:text-purple-800" 
                                                   onClick={() => setViewingExpenseModal(exp)}
                                                   title="View Receipt"
                                                />
                                             </div>
                                          </td>
                                          <td className="py-3 px-4 font-black text-gray-900 text-right">{exp.amount}</td>
                                          <td className="py-3 px-4 whitespace-nowrap text-right text-gray-600">{exp.odometer}</td>
                                          <td className="py-3 px-4">
                                             <div className="font-bold text-gray-900">{exp.addedBy}</div>
                                             {exp.addedRole && <div className="text-[10px] text-gray-500">{exp.addedRole}</div>}
                                          </td>
                                          <td className="py-3 px-6">
                                             <div className="flex justify-center gap-3 text-gray-400">
                                                <Eye 
                                                   size={14} 
                                                   className="hover:text-purple-600 cursor-pointer transition-colors" 
                                                   onClick={() => setViewingExpenseModal(exp)}
                                                   title="View Expense Details"
                                                />
                                                <Trash2 
                                                   size={14} 
                                                   className="hover:text-rose-600 cursor-pointer transition-colors" 
                                                   onClick={() => setExpensesList(prev => prev.filter(e => e.id !== exp.id))}
                                                   title="Delete Expense"
                                                />
                                             </div>
                                          </td>
                                       </tr>
                                    );
                                 })
                              )}
                           </tbody>
                        </table>
                     </div>
                     <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto gap-4 rounded-b-2xl">
                        <span className="text-[12px] font-medium text-gray-500">
                           Showing 1 to {filteredExpenses.length} of {expensesList.length} expenses
                        </span>
                        <div className="flex items-center gap-3">
                           <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-xs">
                              <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                              <button className="px-3 py-1 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                              <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                           </div>
                           <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-xs">
                              <option>10 / page</option>
                           </select>
                        </div>
                     </div>
                  </div>


               </div>

               {/* Right Column */}
               <div className="lg:col-span-3 flex flex-col gap-6">
                  {/* YEAR TO DATE BREAKDOWN */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">YEAR TO DATE BREAKDOWN</h3>
                     <div className="flex flex-col gap-4 text-[12px] font-medium">
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Fuel</span>
                           <span className="font-bold text-gray-900">$12,450</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Maintenance</span>
                           <span className="font-bold text-gray-900">$6,280</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Repairs</span>
                           <span className="font-bold text-gray-900">$4,950</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Registration</span>
                           <span className="font-bold text-gray-900">$1,320</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Insurance</span>
                           <span className="font-bold text-gray-900">$1,100</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Tolls</span>
                           <span className="font-bold text-gray-900">$980</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700">Other</span>
                           <span className="font-bold text-gray-900">$3,450</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                           <span className="font-black text-purple-700 text-[13px]">Total</span>
                           <span className="font-black text-purple-700 text-[14px]">$28,450</span>
                        </div>
                     </div>
                  </div>

                  {/* RECENT EXPENSES */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">RECENT EXPENSES</h3>
                        <a href="#" className="text-[11px] font-bold text-purple-700 flex items-center gap-1 hover:underline">View All <ArrowRight size={12} /></a>
                     </div>
                     <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100"><FileText size={12} className="text-purple-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Fuel - BP Eastern Creek</div>
                              <div className="text-[11px] text-gray-500 font-medium">15 May 2025</div>
                           </div>
                           <span className="text-[11px] font-bold text-green-600 whitespace-nowrap">$764.75</span>
                        </div>
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100"><Wrench size={12} className="text-purple-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Routine Service</div>
                              <div className="text-[11px] text-gray-500 font-medium">10 May 2025</div>
                           </div>
                           <span className="text-[11px] font-bold text-green-600 whitespace-nowrap">$350.00</span>
                        </div>
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100"><Settings size={12} className="text-purple-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Brake Pads Replacement</div>
                              <div className="text-[11px] text-gray-500 font-medium">01 May 2025</div>
                           </div>
                           <span className="text-[11px] font-bold text-green-600 whitespace-nowrap">$1,250.00</span>
                        </div>
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-6 h-6 rounded bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100"><Shield size={12} className="text-purple-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Insurance Premium - Q2</div>
                              <div className="text-[11px] text-gray-500 font-medium">28 Apr 2025</div>
                           </div>
                           <span className="text-[11px] font-bold text-green-600 whitespace-nowrap">$1,100.00</span>
                        </div>
                        <div className="flex items-start gap-3">
                           <div className="mt-0.5 w-6 h-6 rounded bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100"><FileText size={12} className="text-purple-600" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="text-[12px] font-bold text-gray-900 truncate">Truck Wash</div>
                              <div className="text-[11px] text-gray-500 font-medium">15 Apr 2025</div>
                           </div>
                           <span className="text-[11px] font-bold text-green-600 whitespace-nowrap">$55.00</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
       )}

       {activeTab === 'ACTIVITY HISTORY' && (
         <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
               {/* Left Column */}
               <div className="lg:col-span-9 flex flex-col gap-6">
                  {/* Filters Row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                        15 Apr 2025 - 15 May 2025 <Calendar size={14} className="text-gray-500 ml-1" />
                     </button>
                     <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                           <Filter size={14} /> Filters
                        </button>
                        <div className="relative flex-grow sm:w-64">
                           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <input type="text" placeholder="Search activity..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-purple-300 shadow-sm w-full" />
                        </div>
                        <button className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                           <Download size={14} />
                        </button>
                     </div>
                  </div>

                  {/* Activity Table */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
                     <div className="flex gap-6 min-w-max px-6 pt-2 border-b border-gray-100 overflow-x-auto min-w-0 w-full">
                        {['All Activity', 'Assignments', 'Maintenance', 'Documents', 'Compliance', 'Costs', 'Driver', 'Location', 'System'].map(tab => (
                           <button key={tab} className={`pb-4 pt-4 text-[13px] font-bold tracking-wide relative whitespace-nowrap cursor-pointer ${tab === 'All Activity' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-700'}`}>
                              {tab}
                           </button>
                        ))}
                     </div>
                     <div className="overflow-x-auto min-w-0">
                        <table className="w-full min-w-[750px] text-left text-[12px]">
                           <thead>
                              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-800 bg-white">
                                 <th className="py-4 px-6 whitespace-nowrap">Date & Time</th>
                                 <th className="py-4 px-4 whitespace-nowrap">Activity Type</th>
                                 <th className="py-4 px-4 min-w-[200px] whitespace-nowrap">Description</th>
                                 <th className="py-4 px-4 whitespace-nowrap">Performed By</th>
                                 <th className="py-4 px-4 whitespace-nowrap">Reference / Details</th>
                                 <th className="py-4 px-4 whitespace-nowrap">Location</th>
                                 <th className="py-4 px-6 whitespace-nowrap text-center">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">15 May 2025</div><div className="text-[10px] text-gray-500">08:15 AM</div></td>
                                 <td className="py-3 px-4 whitespace-nowrap"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><User size={12} className="text-green-600" /></div> Driver Assigned</div></td>
                                 <td className="py-3 px-4 whitespace-nowrap"><div className="text-gray-900 truncate font-medium">Driver Mike Thompson (DR001)</div><div className="text-[11px] text-gray-500">assigned to vehicle</div></td>
                                 <td className="py-3 px-4 whitespace-nowrap"><div className="text-gray-900 font-medium">Admin User</div></td>
                                 <td className="py-3 px-4 whitespace-nowrap"><div className="text-gray-500">Assignment ID: ASG-7781</div></td>
                                 <td className="py-3 px-4 whitespace-nowrap"><div className="text-gray-500">Sydney Depot</div></td>
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">15 May 2025</div><div className="text-[10px] text-gray-500">07:50 AM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0"><Truck size={12} className="text-purple-600" /></div> Trailer Assigned</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Trailer TRL201 – 8 Car Carrier</div><div className="text-[11px] text-gray-500">assigned to vehicle</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">Admin User</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Assignment ID: ASG-7780</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Sydney Depot</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">15 May 2025</div><div className="text-[10px] text-gray-500">06:45 AM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0"><Wrench size={12} className="text-blue-600" /></div> Service Completed</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Routine Service – Oil & Filter Change</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">Mike Thompson</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">SRV-10458</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Sydney Depot</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">14 May 2025</div><div className="text-[10px] text-gray-500">04:30 PM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0"><FileText size={12} className="text-orange-600" /></div> Fuel Expense</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Fuel purchase at BP Eastern Creek</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">Mike Thompson</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">BP-INV-55421 | $764.75</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Eastern Creek, NSW</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">12 May 2025</div><div className="text-[10px] text-gray-500">09:10 AM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><FileText size={12} className="text-green-600" /></div> Document Uploaded</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Registration Certificate uploaded</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">Mike Thompson</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">REG-ABC123</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Sydney Depot</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">10 May 2025</div><div className="text-[10px] text-gray-500">10:20 PM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-red-50 flex items-center justify-center border border-red-100 shrink-0"><AlertTriangle size={12} className="text-red-600" /></div> Compliance Expiry Alert</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Roadworthy Certificate</div><div className="text-[11px] text-gray-500">expires in 28 days</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">System</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">RWC-TRK-8899</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-400">—</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">08 May 2025</div><div className="text-[10px] text-gray-500">11:05 AM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0"><MapPin size={12} className="text-blue-600" /></div> Location Update</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">GPS location update</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">System</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Lat: -33.8688, Lng: 151.2093</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Moorebank, NSW</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                              <tr className="hover:bg-gray-50/50">
                                 <td className="py-3 px-6 whitespace-nowrap"><div className="text-[12px] font-bold text-gray-900">05 May 2025</div><div className="text-[10px] text-gray-500">02:15 PM</div></td>
                                 <td className="py-3 px-4"><div className="flex items-center gap-1.5 text-gray-700 font-bold"><div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0"><FileText size={12} className="text-orange-600" /></div> Expense Recorded</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 truncate font-medium">Brake Pads Replacement</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-900 font-medium">Admin User</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">RPR-7788 | $1,250.00</div></td>
                                 <td className="py-3 px-4"><div className="text-gray-500">Sydney Depot</div></td>
                                 <td className="py-3 px-6"><div className="flex justify-center text-gray-400"><Eye size={14} className="hover:text-purple-600 cursor-pointer" /></div></td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                     <div className="px-6 py-4 flex flex-wrap justify-between items-center mt-auto gap-4">
                        <span className="text-[12px] font-medium text-gray-500">Showing 1 to 8 of 68 activities</span>
                        <div className="flex items-center gap-3">
                           <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                              <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                              <button className="px-3 py-1 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">2</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">3</button>
                              <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 bg-white">...</button>
                              <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">9</button>
                              <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                           </div>
                           <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                              <option>10 / page</option>
                           </select>
                        </div>
                     </div>
                  </div>


                  
                  <div className="text-right text-[11px] text-gray-500 font-medium pb-4">
                     <span className="mr-8">All times shown in your local time (AEST)</span>
                     <span>• Data auto-refreshes every 5 minutes</span>
                  </div>
               </div>

               {/* Right Column */}
               <div className="lg:col-span-3 flex flex-col gap-6">
                  {/* ACTIVITY SUMMARY */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6">ACTIVITY SUMMARY <span className="text-gray-500 font-normal normal-case">(This Period)</span></h3>
                     <div className="flex flex-col gap-4 text-[12px] font-medium">
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><User size={14} className="text-green-600" /> <span className="text-gray-700">Assignments</span></div>
                           <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded text-[11px]">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Wrench size={14} className="text-blue-600" /> <span className="text-gray-700">Maintenance</span></div>
                           <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">9</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><FileText size={14} className="text-purple-600" /> <span className="text-gray-700">Documents</span></div>
                           <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[11px]">8</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><AlertTriangle size={14} className="text-red-500" /> <span className="text-gray-700">Compliance Alerts</span></div>
                           <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px]">3</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><FileText size={14} className="text-orange-500" /> <span className="text-gray-700">Costs & Expenses</span></div>
                           <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-[11px]">18</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-500" /> <span className="text-gray-700">Location Updates</span></div>
                           <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px]">18</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Settings size={14} className="text-gray-500" /> <span className="text-gray-700">System Events</span></div>
                           <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[11px]">2</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                           <span className="font-black text-purple-700 text-[13px]">Total Activities</span>
                           <span className="font-black text-purple-700 text-[14px]">68</span>
                        </div>
                     </div>
                  </div>

                  {/* RECENT DRIVERS */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">RECENT DRIVERS</h3>
                        <a href="#" className="text-[11px] font-bold text-purple-700 flex items-center gap-1 hover:underline">View All <ArrowRight size={12} /></a>
                     </div>
                     <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"><User size={14} className="text-gray-500" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2">
                                 <div className="text-[12px] font-bold text-gray-900 truncate">Mike Thompson (DR001)</div>
                                 <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-green-600 bg-green-50 border border-green-200">Active</span>
                              </div>
                              <div className="text-[10px] text-gray-500 font-medium mt-0.5">Since 15/05/2025 08:15 AM</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-3 border-b border-gray-50 pb-4">
                           <div className="mt-0.5 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"><User size={14} className="text-gray-500" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2">
                                 <div className="text-[12px] font-bold text-gray-900 truncate">James Patel (DR008)</div>
                                 <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-600 bg-gray-100 border border-gray-200">Inactive</span>
                              </div>
                              <div className="text-[10px] text-gray-500 font-medium mt-0.5">15/05/2025 06:10 AM</div>
                           </div>
                        </div>
                        <div className="flex items-start gap-3">
                           <div className="mt-0.5 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"><User size={14} className="text-gray-500" /></div>
                           <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2">
                                 <div className="text-[12px] font-bold text-gray-900 truncate">Liam Smith (DR004)</div>
                                 <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-600 bg-gray-100 border border-gray-200">Inactive</span>
                              </div>
                              <div className="text-[10px] text-gray-500 font-medium mt-0.5">14/05/2025 09:22 PM</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* ACTIVITY REMINDERS */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">ACTIVITY REMINDERS</h3>
                        <a href="#" className="text-[11px] font-bold text-purple-700 flex items-center gap-1 hover:underline">Manage Reminders <ArrowRight size={12} /></a>
                     </div>
                     <div className="flex flex-col gap-4 text-[12px] font-medium">
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Bell size={14} className="text-gray-600" /> <span className="text-gray-700">Email reminders</span></div>
                           <span className="font-bold text-green-600">Enabled</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Settings size={14} className="text-gray-600" /> <span className="text-gray-700">SMS reminders</span></div>
                           <span className="font-bold text-green-600">Enabled</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2"><Calendar size={14} className="text-gray-600" /> <span className="text-gray-700">Reminder days before event</span></div>
                           <span className="font-bold text-gray-900">3 days</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                           <div className="flex items-center gap-2"><User size={14} className="text-gray-600" /> <span className="text-gray-700">Escalate to</span></div>
                           <span className="font-bold text-gray-900">Admin, Dispatcher</span>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </div>
       )}

      {/* ADD MAINTENANCE RECORD MODAL */}
      {showAddMaintenanceModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[99999] p-4 overflow-y-auto" onClick={() => setShowAddMaintenanceModal(false)}>
          <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-left border border-slate-100 max-h-[85vh] my-auto flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100/60 flex items-center justify-center shrink-0"><Wrench size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">Add Maintenance Record</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{managingVehicle?.id} – {managingVehicle?.make}</p>
                </div>
              </div>
              <button onClick={() => setShowAddMaintenanceModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shrink-0"><X size={18} /></button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs font-sans overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Service Type *</label>
                  <select value={maintenanceForm.type} onChange={e => setMaintenanceForm(p => ({...p, type: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer">
                    {['Scheduled Service','Oil Change','Tyre Replacement','Brake Service','Engine Repair','Electrical','Body Repair','Inspection','Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Service Date *</label>
                  <input type="date" value={maintenanceForm.date} onChange={e => setMaintenanceForm(p => ({...p, date: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Odometer at Service (km)</label>
                  <input type="text" value={maintenanceForm.odometer} onChange={e => setMaintenanceForm(p => ({...p, odometer: e.target.value}))} placeholder="e.g. 125,450" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Service Provider</label>
                  <input type="text" value={maintenanceForm.provider} onChange={e => setMaintenanceForm(p => ({...p, provider: e.target.value}))} placeholder="e.g. Volvo Service Centre" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Labour Cost ($)</label>
                  <input type="number" value={maintenanceForm.labour} onChange={e => setMaintenanceForm(p => ({...p, labour: e.target.value}))} placeholder="0.00" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Parts Cost ($)</label>
                  <input type="number" value={maintenanceForm.parts} onChange={e => setMaintenanceForm(p => ({...p, parts: e.target.value}))} placeholder="0.00" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Next Due Date / Odometer</label>
                <input type="text" value={maintenanceForm.nextDue} onChange={e => setMaintenanceForm(p => ({...p, nextDue: e.target.value}))} placeholder="e.g. 15/11/2025 or 135,000 km" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Description / Work Performed</label>
                <textarea rows="3" value={maintenanceForm.description} onChange={e => setMaintenanceForm(p => ({...p, description: e.target.value}))} placeholder="Describe what was done..." className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 resize-none" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Notes (Optional)</label>
                <textarea rows="2" value={maintenanceForm.notes} onChange={e => setMaintenanceForm(p => ({...p, notes: e.target.value}))} placeholder="Additional notes..." className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 resize-none" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setShowAddMaintenanceModal(false)} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs bg-white hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
              <button type="button" onClick={() => { setShowAddMaintenanceModal(false); setMaintenanceForm({ type: 'Scheduled Service', date: '', odometer: '', provider: '', cost: '', description: '', nextDue: '', parts: '', labour: '', notes: '' }); }} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"><Wrench size={15} /> Save Record</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[99999] p-4 overflow-y-auto" onClick={() => setShowAddExpenseModal(false)}>
          <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-left border border-slate-100 max-h-[85vh] my-auto flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/60 flex items-center justify-center shrink-0"><DollarSign size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">Add Expense</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{managingVehicle?.id} – {managingVehicle?.make}</p>
                </div>
              </div>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shrink-0"><X size={18} /></button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs font-sans overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Expense Category *</label>
                  <select value={expenseForm.category} onChange={e => setExpenseForm(p => ({...p, category: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer">
                    {['Fuel','Maintenance','Repairs','Registration','Insurance','Tolls','Tyres','Parts','Cleaning','Fines','Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Date *</label>
                  <input type="date" value={expenseForm.date} onChange={e => setExpenseForm(p => ({...p, date: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Amount (excl. GST) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                    <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm(p => ({...p, amount: e.target.value}))} placeholder="0.00" className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">GST ($)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                    <input type="number" value={expenseForm.gst} onChange={e => setExpenseForm(p => ({...p, gst: e.target.value}))} placeholder="0.00" className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Company Card','Cash','Bank Transfer','Driver Card','Invoice','Other'].map(m => (
                    <button key={m} type="button" onClick={() => setExpenseForm(p => ({...p, paymentMethod: m}))} className={`py-2 px-3 rounded-xl text-[11px] font-bold border cursor-pointer transition-all ${expenseForm.paymentMethod === m ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Description</label>
                <input type="text" value={expenseForm.description} onChange={e => setExpenseForm(p => ({...p, description: e.target.value}))} placeholder="e.g. Fuel fill-up at Shell Sydney" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Receipt Number (Optional)</label>
                <input type="text" value={expenseForm.receipt} onChange={e => setExpenseForm(p => ({...p, receipt: e.target.value}))} placeholder="e.g. RCP-00124" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Notes (Optional)</label>
                <textarea rows="2" value={expenseForm.notes} onChange={e => setExpenseForm(p => ({...p, notes: e.target.value}))} placeholder="Additional notes..." className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500 resize-none" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-slate-500">{expenseForm.amount && expenseForm.gst ? `Total incl. GST: $${(parseFloat(expenseForm.amount||0)+parseFloat(expenseForm.gst||0)).toFixed(2)}` : ''}</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setShowAddExpenseModal(false)} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs bg-white hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
                <button type="button" onClick={() => { setShowAddExpenseModal(false); setExpenseForm({ category: 'Fuel', date: '', amount: '', gst: '', description: '', receipt: '', paymentMethod: 'Company Card', notes: '' }); }} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"><DollarSign size={15} /> Save Expense</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT VEHICLE PROFILE MODAL */}
      {showPrintProfileModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[99999] p-4 overflow-y-auto" onClick={() => setShowPrintProfileModal(false)}>
          <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden text-left border border-slate-100 max-h-[85vh] my-auto flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 flex items-center justify-center shrink-0"><Printer size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">Print Vehicle Profile</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{managingVehicle?.id} – {managingVehicle?.make}</p>
                </div>
              </div>
              <button onClick={() => setShowPrintProfileModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shrink-0"><X size={18} /></button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs font-sans overflow-y-auto">
              <p className="text-slate-600 font-medium">Select sections to include in profile printout:</p>
              <div className="space-y-2.5">
                {[
                  { key: 'overview', label: 'Vehicle Overview & Details' },
                  { key: 'documents', label: 'Documents & Compliance' },
                  { key: 'maintenance', label: 'Maintenance & Service History' },
                  { key: 'costs', label: 'Costs & Expenses Summary' },
                  { key: 'assignments', label: 'Trailer Assignment History' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all">
                    <input type="checkbox" checked={exportSections[key]} onChange={e => setExportSections(p => ({...p, [key]: e.target.checked}))} className="w-4 h-4 text-purple-600 rounded border-slate-300 cursor-pointer" />
                    <span className="font-bold text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setShowPrintProfileModal(false)} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs bg-white hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
              <button type="button" onClick={() => { window.print(); setShowPrintProfileModal(false); }} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"><Printer size={15} /> Print Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT VEHICLE REPORT MODAL */}
      {showExportReportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[99999] p-4 overflow-y-auto" onClick={() => setShowExportReportModal(false)}>
          <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden text-left border border-slate-100 max-h-[85vh] my-auto flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/60 flex items-center justify-center shrink-0"><Download size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">Export Vehicle Report</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{managingVehicle?.id} – {managingVehicle?.make}</p>
                </div>
              </div>
              <button onClick={() => setShowExportReportModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shrink-0"><X size={18} /></button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs font-sans overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 mb-2">Export Format</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['PDF','Excel','CSV'].map(fmt => (
                    <button key={fmt} type="button" onClick={() => setExportFormat(fmt)} className={`py-2.5 px-3 rounded-xl font-bold border transition-all cursor-pointer ${exportFormat === fmt ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-2">Include Sections</label>
                <div className="space-y-2">
                  {[
                    { key: 'overview', label: 'Vehicle Overview' },
                    { key: 'documents', label: 'Documents & Compliance' },
                    { key: 'maintenance', label: 'Maintenance History' },
                    { key: 'costs', label: 'Costs & Expenses' },
                    { key: 'assignments', label: 'Trailer Assignments' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={exportSections[key]} onChange={e => setExportSections(p => ({...p, [key]: e.target.checked}))} className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer" />
                      <span className="font-medium text-slate-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setShowExportReportModal(false)} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs bg-white hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
              <button type="button" onClick={() => setShowExportReportModal(false)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"><Download size={15} /> Download {exportFormat}</button>
            </div>
          </div>
        </div>
      )}

      {/* DEACTIVATE VEHICLE MODAL */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[99999] p-4 overflow-y-auto" onClick={() => setShowDeactivateModal(false)}>
          <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden text-left border border-slate-100 max-h-[85vh] my-auto flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 border border-rose-100/60 flex items-center justify-center shrink-0"><AlertTriangle size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">Deactivate Vehicle</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{managingVehicle?.id} – {managingVehicle?.make}</p>
                </div>
              </div>
              <button onClick={() => { setShowDeactivateModal(false); setDeactivateReason(''); setDeactivateConfirmText(''); }} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shrink-0"><X size={18} /></button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs font-sans overflow-y-auto">
              <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3.5 text-xs text-rose-900 font-medium leading-relaxed">
                Deactivating will mark this vehicle as <span className="font-bold">Out of Service</span>.
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Reason *</label>
                <select value={deactivateReason} onChange={e => setDeactivateReason(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-300 cursor-pointer">
                  <option value="">-- Select a reason --</option>
                  {['Scheduled Maintenance','Major Repair Required','Failed Inspection','End of Life / Disposal','Sold / Transferred','Insurance Claim','Registration Expired','Other'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Type <span className="font-mono text-rose-600 font-bold">DEACTIVATE</span> to confirm *</label>
                <input type="text" value={deactivateConfirmText} onChange={e => setDeactivateConfirmText(e.target.value)} placeholder="DEACTIVATE" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-300 font-mono" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
              <button type="button" onClick={() => { setShowDeactivateModal(false); setDeactivateReason(''); setDeactivateConfirmText(''); }} className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs bg-white hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
              <button
                type="button"
                disabled={deactivateConfirmText !== 'DEACTIVATE' || !deactivateReason}
                onClick={async () => {
                  if (deactivateConfirmText === 'DEACTIVATE' && deactivateReason) {
                    try {
                      await api.put(`/vehicles/${managingVehicle.id}`, { status: 'OUT_OF_SERVICE' });
                      fetchVehicles();
                      setManagingVehicle(prev => ({ ...prev, status: 'OUT_OF_SERVICE' }));
                      setShowDeactivateModal(false);
                      setDeactivateReason('');
                      setDeactivateConfirmText('');
                      showToast('Vehicle deactivated successfully.');
                    } catch (err) {
                      console.error('Error deactivating:', err);
                      showToast('Failed to deactivate vehicle.', 'error');
                    }
                  }
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${deactivateConfirmText === 'DEACTIVATE' && deactivateReason ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                <Trash2 size={15} /> Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SWAP TRAILER MODAL */}
      {showSwapTrailerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4" onClick={() => setShowSwapTrailerModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden text-left border border-slate-100 animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-purple-900 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <ArrowUpDown size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base">Swap Trailer Assignment</h3>
                  <p className="text-[10px] text-purple-200">Reassign or replace the active trailer for this vehicle</p>
                </div>
              </div>
              <button onClick={() => setShowSwapTrailerModal(false)} className="text-purple-200 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer border-0 bg-transparent">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {currentTrailer && (
                <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-3 flex items-center gap-3">
                  <img src={currentTrailer.img} className="w-14 h-12 rounded-lg object-cover border border-slate-200" alt="Trailer" />
                  <div>
                    <span className="text-[9px] font-black uppercase text-purple-700 tracking-wider">Current Assignment</span>
                    <h4 className="text-xs font-bold text-slate-800">{currentTrailer.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Reg: {currentTrailer.reg} • Depot: {currentTrailer.depot}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Replacement Trailer *</label>
                <select 
                  value={selectedSwapTrailer} 
                  onChange={(e) => setSelectedSwapTrailer(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="TRL105">TRL105 – Flatbed Heavy Trailer (Available)</option>
                  <option value="TRL302">TRL302 – Refrigerated Box Trailer (Available)</option>
                  <option value="TRL409">TRL409 – Low Loader Heavy Duty (Available)</option>
                  <option value="TRL512">TRL512 – Curtainsider 45ft Trailer (Available)</option>
                  <option value="TRL608">TRL608 – Liquid Tanker Trailer (Available)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Reason for Swap (Optional)</label>
                <textarea 
                  rows="3" 
                  value={swapReason} 
                  onChange={(e) => setSwapReason(e.target.value)} 
                  placeholder="e.g. Scheduled maintenance, cargo requirements, route optimization..." 
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button 
                type="button" 
                onClick={() => setShowSwapTrailerModal(false)} 
                className="px-4 py-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  handleSwapTrailer(selectedSwapTrailer, swapReason);
                  setShowSwapTrailerModal(false);
                  setSwapReason('');
                }} 
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ArrowUpDown size={14} /> Confirm Swap Trailer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNASSIGN TRAILER MODAL */}
      {showUnassignTrailerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4" onClick={() => setShowUnassignTrailerModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden text-left border border-slate-100 animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-900 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base">Unassign Trailer</h3>
                  <p className="text-[10px] text-rose-200">Remove active trailer from vehicle</p>
                </div>
              </div>
              <button onClick={() => setShowUnassignTrailerModal(false)} className="text-rose-200 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer border-0 bg-transparent">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
                <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-800 font-medium leading-relaxed">
                  Are you sure you want to unassign <span className="font-bold">{currentTrailer?.name || 'this trailer'}</span> from vehicle? The vehicle will remain without an active trailer.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Unassign Reason (Optional)</label>
                <textarea 
                  rows="3" 
                  value={unassignReason} 
                  onChange={(e) => setUnassignReason(e.target.value)} 
                  placeholder="e.g. Workshop maintenance, seasonal storage, transfer to another vehicle..." 
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button 
                type="button" 
                onClick={() => setShowUnassignTrailerModal(false)} 
                className="px-4 py-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  handleUnassignTrailer(unassignReason);
                  setShowUnassignTrailerModal(false);
                  setUnassignReason('');
                }} 
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Confirm Unassign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TRAILER MODAL */}
      {showViewTrailerModal && currentTrailer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4" onClick={() => setShowViewTrailerModal(false)}>
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-left border border-slate-100 animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base">{currentTrailer.name}</h3>
                  <p className="text-[10px] text-slate-300">Detailed Specification & Live Trailer Profile</p>
                </div>
              </div>
              <button onClick={() => setShowViewTrailerModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer border-0 bg-transparent">
                <X size={18} />
              </button>
            </div>
           
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-5 items-center bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <img 
                   src={currentTrailer.img} 
                   onError={(e) => {
                     e.target.onerror = null;
                     e.target.src = "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60";
                   }}
                   className="w-full sm:w-36 h-24 rounded-xl object-cover border border-slate-200 shadow-xs" 
                   alt="Trailer" 
                 />
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">● Active Assignment</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold">Primary Trailer</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 pt-1">{currentTrailer.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{currentTrailer.type} • Depot: {currentTrailer.depot}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Registration</p>
                  <p className="font-bold text-slate-800">{currentTrailer.reg}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Axles</p>
                  <p className="font-bold text-slate-800">{currentTrailer.axles} Heavy Duty</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <p className="font-bold text-emerald-600">{currentTrailer.status}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">VIN / Chassis Number</p>
                  <p className="font-bold text-slate-800 font-mono tracking-tight">{currentTrailer.vin}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Max Payload</p>
                  <p className="font-bold text-slate-800">28,500 kg</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">Last Inspection: 12 June 2025</span>
              <button 
                type="button" 
                onClick={() => setShowViewTrailerModal(false)} 
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT VEHICLE MODAL */}
      {editVehicleModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4" onClick={closeEditModal}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Edit size={16} className="text-purple-600" /> Edit Vehicle ({editVehicleModal.id})
              </h3>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Make / Model *</label>
                  <input type="text" value={editVehicleModal.make || ''} onChange={e => setEditVehicleModal({...editVehicleModal, make: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Registration *</label>
                  <input type="text" value={editVehicleModal.reg || ''} onChange={e => setEditVehicleModal({...editVehicleModal, reg: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Vehicle Type</label>
                  <input type="text" value={editVehicleModal.type || ''} onChange={e => setEditVehicleModal({...editVehicleModal, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Year</label>
                  <input type="text" value={editVehicleModal.year || ''} onChange={e => setEditVehicleModal({...editVehicleModal, year: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
                  <select value={editVehicleModal.status || 'ACTIVE'} onChange={e => setEditVehicleModal({...editVehicleModal, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold bg-white cursor-pointer">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="OUT OF SERVICE">OUT OF SERVICE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch / Depot</label>
                  <input type="text" value={editVehicleModal.branch || ''} onChange={e => setEditVehicleModal({...editVehicleModal, branch: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Current Driver</label>
                  <input type="text" value={editVehicleModal.driver || ''} onChange={e => setEditVehicleModal({...editVehicleModal, driver: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Odometer</label>
                  <input type="text" value={editVehicleModal.odometer || ''} onChange={e => setEditVehicleModal({...editVehicleModal, odometer: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button onClick={closeEditModal} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
              <button onClick={async (e) => {
                try {
                  const payload = {
                    rego: editVehicleModal.reg || editVehicleModal.rego,
                    make: editVehicleModal.make,
                    model: editVehicleModal.model,
                    year: editVehicleModal.year ? parseInt(editVehicleModal.year) : undefined,
                    status: editVehicleModal.status,
                    category: editVehicleModal.type,
                    odometerKm: editVehicleModal.odometer ? parseInt(String(editVehicleModal.odometer).replace(/[^0-9]/g,'')) : undefined,
                    notes: editVehicleModal.notes
                  };
                  await api.put(`/vehicles/${editVehicleModal.id}`, payload);
                  fetchVehicles();
                  const updatedVehicleObj = {
                    ...editVehicleModal,
                    reg: payload.rego,
                    rego: payload.rego,
                    make: editVehicleModal.make,
                    model: editVehicleModal.model || '',
                    name: editVehicleModal.make ? editVehicleModal.make : editVehicleModal.name,
                    status: editVehicleModal.status || 'ACTIVE'
                  };
                  if (managingVehicle && managingVehicle.id === editVehicleModal.id) {
                    setManagingVehicle(updatedVehicleObj);
                  }
                  closeEditModal(e);
                  showToast('Vehicle updated successfully!');
                } catch (err) {
                  console.error('Failed to update vehicle:', err);
                  showToast('Failed to update vehicle.', 'error');
                }
              }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-xs shadow-sm cursor-pointer">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      </div>
    );
  }
  if (showAddModal) {
    return (
      <form onSubmit={handleAddVehicle} className="p-2 sm:p-6 text-left animate-in fade-in duration-200 font-sans min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto space-y-6 pb-20">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                <span>Home</span>
                <ChevronRight size={12} />
                <span>Vehicles</span>
                <ChevronRight size={12} />
                <span>Vehicles List</span>
                <ChevronRight size={12} />
                <span className="text-gray-900 font-bold">Add Vehicle</span>
                <div className="ml-auto flex items-center gap-1.5 text-gray-500 text-xs">
                  <Shield size={12}/> <span className="hidden sm:inline">Guide & Compliance</span>
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">Add New Vehicle</h2>
              <p className="text-xs text-gray-500 font-medium">Create a new vehicle profile by entering all required information.</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm">
                Cancel
              </button>
              <button type="button" className="px-5 py-2 bg-white border border-purple-200 hover:bg-purple-50 text-purple-700 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm">
                Save as Draft
              </button>
              <button type="submit" className="flex items-center justify-center gap-2 px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm min-w-[140px]">
                <Save size={14} strokeWidth={2.5} /> Save Vehicle
              </button>
            </div>
          </div>

          {/* 1. Vehicle Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[13px] font-black text-gray-900">1. Vehicle Information</h3>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-8">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-2 w-32 shrink-0">
                <div className="text-[9px] font-black text-gray-500 tracking-widest uppercase mb-1">VEHICLE PHOTO</div>
                <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 hover:border-purple-400 cursor-pointer group bg-gray-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Camera className="w-5 h-5 text-white mb-1" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Upload</span>
                  </div>
                  <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=256&auto=format&fit=crop" className="w-full h-full object-cover" alt="Truck" />
                </div>
                <input type="text" placeholder="https://images.unsplash.com..." defaultValue="https://images.unsplash.co..." className="w-full text-center text-[9px] px-2 py-1.5 bg-gray-50 border border-gray-200 rounded mt-2 focus:outline-none focus:border-purple-400 text-gray-500" />
              </div>

              {/* Vehicle Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">MAKE *</label>
                  <input name="make" type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">MODEL *</label>
                  <input name="model" type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">VEHICLE ID * (MANUAL EDIT OPTION)</label>
                  <input name="id" type="text" defaultValue="VEH009" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-bold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">YEAR *</label>
                  <div className="relative">
                    <input name="year" type="number" placeholder="YYYY" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">COLOR *</label>
                  <select name="color" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                    <option>White</option>
                    <option>Red</option>
                    <option>Blue</option>
                    <option>Black</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">TYPE *</label>
                  <select name="type" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                    <option>Prime Mover</option>
                    <option>Car Carrier</option>
                    <option>Heavy Rigid (HR)</option>
                    <option>General Freight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">REGISTRATION NO *</label>
                  <input name="reg" type="text" placeholder="e.g. NSW - YXZ 123" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">VIN NUMBER *</label>
                  <input name="vin" type="text" placeholder="e.g. VIN12345" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">ENGINE NUMBER *</label>
                  <input name="engine" type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">ODOMETER *</label>
                  <input name="odometer" type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">PRIMARY DEPOT *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div></div>

                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">CITY *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">STATE *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">POSTAL CODE *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Registration Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[13px] font-black text-gray-900">2. Registration Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">REGISTRATION TYPE *</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                    <option>Heavy Vehicle Registration</option>
                    <option>Light Vehicle Registration</option>
                    <option>Commercial Registration</option>
                    <option>Standard Registration</option>
                    <option>Conditional Registration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">REGISTRATION NUMBER *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">REGISTRATION STATE *</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                    <option>NSW</option>
                    <option>VIC</option>
                    <option>QLD</option>
                    <option>SA</option>
                    <option>WA</option>
                    <option>TAS</option>
                    <option>ACT</option>
                    <option>NT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">ISSUE DATE *</label>
                  <div className="relative">
                    <input name="issueDate" type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">EXPIRY DATE *</label>
                  <div className="relative">
                    <input name="expiryDate" type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">FUEL TYPE</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                    <option>Diesel</option>
                    <option>Petrol</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                    <option>LPG</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">REGISTRATION DOCUMENT UPLOAD</label>
                <VehicleLicenceFileUploadBox />
              </div>
            </div>
          </div>

          {/* 3. Compliance Documents */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[13px] font-black text-gray-900">3. Compliance Documents</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  'Safety Inspection',
                  'Insurance Policy',
                  'Roadworthy Certificate',
                  'Emissions Compliance',
                  'Heavy Vehicle Permit',
                  'Weight Bridge Certificate',
                  'Other Documents'
                ].map(doc => (
                  <VehicleDocUploadBox key={doc} title={doc} />
                ))}
              </div>
            </div>
          </div>

          {/* 4. Maintenance Preferences */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[13px] font-black text-gray-900">4. Maintenance Preferences</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">PRIMARY MECHANIC</label>
                <input type="text" defaultValue="Volvo FH16" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">PREFERRED ROUTES</label>
                <input type="text" defaultValue="Sydney - Melbourne" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">PREFERRED REGIONS</label>
                <input type="text" defaultValue="East Coast" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
              </div>
              
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">MAXIMUM DISTANCE PER TRIP (KM)</label>
                <input type="text" defaultValue="1000" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">DANGEROUS GOODS CERTIFIED</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">HEAVY VEHICLE CERTIFIED</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. Notes & Comments */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[13px] font-black text-gray-900">5. Notes & Comments</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">VEHICLE NOTES</label>
                <textarea rows="4" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none"></textarea>
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">INTERNAL COMMENTS</label>
                <textarea rows="4" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none"></textarea>
              </div>
            </div>
          </div>

        </div>
      </form>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left font-sans flex flex-col gap-6">
       
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none mb-1 flex items-center gap-2">
            Vehicle List <Shield className="w-5 h-5 text-purple-600" />
          </h1>
          <p className="text-gray-500 text-[13px] font-medium mt-1">View and manage all vehicles in your fleet.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onMouseDown={(e) => { e.currentTarget.dataset.mouseDown = 'true'; }}
            onClick={(e) => {
              if (e.currentTarget.dataset.mouseDown === 'true') {
                e.currentTarget.dataset.mouseDown = 'false';
                setShowAddModal(true);
              }
            }}
            className="border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 text-[13px] font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap flex-grow sm:flex-grow-0 justify-center"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
          <button className="border border-gray-200 text-gray-700 hover:bg-gray-50 text-[13px] font-semibold py-2 px-4 rounded-lg transition-colors flex items-center shadow-sm cursor-pointer whitespace-nowrap flex-grow sm:flex-grow-0 justify-center">
            More Actions <ChevronDownIcon size={14} className="ml-1" />
          </button>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white shrink-0">
            <button className="px-2.5 py-2 bg-white hover:bg-gray-50 text-gray-600 border-r border-gray-200 cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button className="px-2.5 py-2 bg-white hover:bg-gray-50 text-gray-600 cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
         <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
               <Truck size={20} />
            </div>
            <div>
               <p className="text-[11px] text-gray-500 font-medium">Total Vehicles</p>
               <h3 className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">{vehicles.length}</h3>
               <p className="text-[10px] text-gray-400 mt-1">All vehicles in fleet</p>
            </div>
         </div>
         <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-green-100 flex items-center justify-center text-green-500 flex-shrink-0">
               <CheckCircle2 size={24} strokeWidth={2.5} />
            </div>
            <div>
               <p className="text-[11px] text-gray-500 font-medium">Active</p>
               <h3 className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">{vehicles.filter(v => v.status === 'ACTIVE').length}</h3>
               <p className="text-[10px] text-gray-400 mt-1">{vehicles.length ? Math.round(vehicles.filter(v => v.status === 'ACTIVE').length / vehicles.length * 100) : 0}% of total</p>
            </div>
         </div>
         <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
               <Wrench size={20} />
            </div>
            <div>
               <p className="text-[11px] text-gray-500 font-medium">In Maintenance</p>
               <h3 className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">{vehicles.filter(v => v.status === 'MAINTENANCE' || v.status === 'IN_MAINTENANCE').length}</h3>
               <p className="text-[10px] text-gray-400 mt-1">{vehicles.length ? Math.round(vehicles.filter(v => v.status === 'MAINTENANCE' || v.status === 'IN_MAINTENANCE').length / vehicles.length * 100) : 0}% of total</p>
            </div>
         </div>
         <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
               <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
            <div>
               <p className="text-[11px] text-gray-500 font-medium">Out of Service</p>
               <h3 className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">{vehicles.filter(v => v.status === 'OUT OF SERVICE' || v.status === 'OUT_OF_SERVICE').length}</h3>
               <p className="text-[10px] text-gray-400 mt-1">{vehicles.length ? Math.round(vehicles.filter(v => v.status === 'OUT OF SERVICE' || v.status === 'OUT_OF_SERVICE').length / vehicles.length * 100) : 0}% of total</p>
            </div>
         </div>
         <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4 col-span-2 sm:col-span-1 lg:col-span-1">
             <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                <FileText size={20} />
             </div>
             <div>
                <p className="text-[11px] text-gray-500 font-medium">Compliance Due</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">{vehicles.filter(v => v.compliance === 'Expiring Soon' || v.compliance === 'Overdue').length}</h3>
                <p className="text-[10px] text-gray-400 mt-1">{vehicles.length ? Math.round(vehicles.filter(v => v.compliance === 'Expiring Soon' || v.compliance === 'Overdue').length / vehicles.length * 100) : 0}% of total</p>
             </div>
          </div>
       </div>

       {/* Main Grid: Left Table (9 cols) + Right Sidebar (3 cols) */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Side (Table) */}
          <div className="lg:col-span-9 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
             {/* Table Header/Tabs */}
             <div className="px-5 pt-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-6 overflow-x-auto min-w-0">
                   {[
                      { label: 'All Vehicles', value: 'ALL' },
                      { label: 'Active', value: 'ACTIVE' },
                      { label: 'In Maintenance', value: 'MAINTENANCE' },
                      { label: 'Out of Service', value: 'OUT OF SERVICE' },
                      { label: 'Sold / Inactive', value: 'INACTIVE' }
                   ].map(tab => {
                      const isActive = statusFilter === tab.value;
                      return (
                         <button 
                            key={tab.value} 
                            onClick={() => setStatusFilter(tab.value)}
                            className={`pb-3 text-[12px] font-bold uppercase tracking-wider relative whitespace-nowrap transition-all duration-200 cursor-pointer ${
                               isActive 
                                 ? 'text-purple-700 font-black border-b-2 border-purple-700' 
                                 : 'text-gray-400 hover:text-gray-700 font-semibold'
                            }`}
                         >
                            {tab.label}
                         </button>
                      );
                   })}
                </div>
                <div className="flex items-center gap-3 pb-2 flex-wrap">
                   <button className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                      <Filter size={14} /> Filters
                   </button>
                   <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vehicles..." className="pl-8 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-lg w-48 focus:outline-none focus:border-purple-400" />
                   </div>
                   <button className="p-1.5 border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50">
                      <Download size={16} />
                   </button>
                </div>
             </div>

            {/* Table */}
            <div className="overflow-x-auto custom-scrollbar">
               <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
                  <thead>
                     <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-700">
                        <th className="py-3 px-4 whitespace-nowrap">Vehicle / Reg No.</th>
                        <th className="py-3 px-4 whitespace-nowrap">Type / Make / Model</th>
                        <th className="py-3 px-2 text-center whitespace-nowrap">Year</th>
                        <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
                        <th className="py-3 px-4 whitespace-nowrap">Current Driver</th>
                        <th className="py-3 px-4 text-right whitespace-nowrap">Odometer</th>
                        <th className="py-3 px-4 text-center whitespace-nowrap">Compliance</th>
                        <th className="py-3 px-4 whitespace-nowrap">Next Service</th>
                        <th className="py-3 px-4 text-center whitespace-nowrap">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {filteredVehicles.map((v, i) => (
                        <tr 
                           key={i} 
                           onMouseDown={(e) => {
                              e.currentTarget.dataset.mouseDown = 'true';
                           }}
                           onClick={(e) => {
                              if (e.currentTarget.dataset.mouseDown === 'true') {
                                 e.currentTarget.dataset.mouseDown = 'false';
                                 setManagingVehicle(v);
                              }
                           }}
                           className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        >
                           <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                 <img 
                                     src={v.img} 
                                     alt="Vehicle" 
                                     onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=60";
                                     }}
                                     className="w-10 h-8 rounded object-cover border border-gray-200 shadow-sm" 
                                  />
                                 <div>
                                    <div className="text-[12px] font-bold text-gray-900 whitespace-nowrap">{v.id} - {v.make}</div>
                                    <div className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{v.reg}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="py-3 px-4">
                              <div className="text-[12px] font-bold text-gray-900 whitespace-nowrap">{v.type}</div>
                              <div className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{v.make}</div>
                           </td>
                           <td className="py-3 px-2 text-[12px] font-medium text-gray-700 text-center">{v.year}</td>
                           <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded whitespace-nowrap ${
                                 v.status === 'ACTIVE' ? 'bg-green-50 text-green-600' :
                                 v.status === 'MAINTENANCE' ? 'bg-orange-50 text-orange-600' :
                                 'bg-red-50 text-red-600'
                              }`}>{v.status === 'MAINTENANCE' ? 'In Maintenance' : v.status === 'OUT OF SERVICE' ? 'Out of Service' : 'Active'}</span>
                           </td>
                           <td className="py-3 px-4">
                              <div className="text-[12px] font-bold text-gray-900 whitespace-nowrap">{v.driver}</div>
                              {v.driverId && <div className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{v.driverId}</div>}
                           </td>
                           <td className="py-3 px-4 text-[12px] font-medium text-gray-700 whitespace-nowrap text-right">{v.odometer}</td>
                           <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-0.5 text-[10px] font-semibold border rounded whitespace-nowrap ${
                                 v.compliance === 'Compliant' ? 'bg-green-50/50 border-green-200 text-green-600' :
                                 v.compliance === 'Expiring Soon' ? 'bg-orange-50/50 border-orange-200 text-orange-600' :
                                 'bg-red-50/50 border-red-200 text-red-600'
                              }`}>{v.compliance}</span>
                           </td>
                           <td className="py-3 px-4">
                              <div className={`text-[12px] font-bold whitespace-nowrap ${v.compliance === 'Overdue' ? 'text-red-600' : 'text-gray-900'}`}>{v.nextServiceDate}</div>
                              <div className={`text-[10px] font-medium whitespace-nowrap ${v.compliance === 'Overdue' ? 'text-red-500' : v.compliance === 'Expiring Soon' ? 'text-orange-500' : 'text-green-500'}`}>{v.nextServiceDays}</div>
                           </td>
                            <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                               <div className="flex items-center justify-center gap-1.5">
                                  <button 
                                     onMouseDown={(e) => { e.stopPropagation(); e.currentTarget.dataset.mouseDown = 'true'; }} 
                                     onClick={(e) => { 
                                        e.stopPropagation(); 
                                        if (e.currentTarget.dataset.mouseDown === 'true') {
                                           e.currentTarget.dataset.mouseDown = 'false';
                                           setManagingVehicle(v); 
                                        }
                                     }} 
                                     title="View Vehicle Details" 
                                     className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                                  >
                                     <Eye size={13} />
                                  </button>
                                  <button 
                                     onMouseDown={(e) => { e.stopPropagation(); e.currentTarget.dataset.mouseDown = 'true'; }} 
                                     onClick={(e) => { 
                                        e.stopPropagation(); 
                                        if (e.currentTarget.dataset.mouseDown === 'true') {
                                           e.currentTarget.dataset.mouseDown = 'false';
                                           setEditVehicleModal(v); 
                                        }
                                     }} 
                                     title="Edit Vehicle" 
                                     className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                                  >
                                     <Edit size={13} />
                                  </button>
                                  <button 
                                     onMouseDown={(e) => { e.stopPropagation(); e.currentTarget.dataset.mouseDown = 'true'; }} 
                                     onClick={(e) => { 
                                        e.stopPropagation(); 
                                        if (e.currentTarget.dataset.mouseDown === 'true') {
                                           e.currentTarget.dataset.mouseDown = 'false';
                                           if (window.confirm(`Delete vehicle ${v.id}?`)) deleteVehicle(v.id); 
                                        }
                                     }} 
                                     title="Delete Vehicle" 
                                     className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                                  >
                                     <Trash2 size={13} />
                                  </button>
                               </div>
                            </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 flex-wrap gap-4">
               <span className="text-[12px] font-medium text-gray-500">Showing 1 to 8 of 32 vehicles</span>
               <div className="flex items-center gap-2">
                  <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                     <button className="px-3 py-1.5 text-gray-400 border-r border-gray-200 hover:bg-gray-50 cursor-pointer"><ChevronLeft size={14} /></button>
                     <button className="px-3 py-1.5 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                     <button className="px-3 py-1.5 text-gray-600 font-medium border-r border-gray-200 hover:bg-gray-50 cursor-pointer">2</button>
                     <button className="px-3 py-1.5 text-gray-600 font-medium border-r border-gray-200 hover:bg-gray-50 cursor-pointer">3</button>
                     <button className="px-3 py-1.5 text-gray-600 font-medium border-r border-gray-200 hover:bg-gray-50 cursor-pointer">4</button>
                     <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 cursor-pointer"><ChevronRight size={14} /></button>
                  </div>
                  <select className="border border-gray-200 bg-white rounded-md px-2 py-1.5 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer">
                     <option>10 / page</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Right Side (Sidebar) */}
         <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Compliance Overview Card */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
               <h3 className="text-[13px] font-bold text-gray-900 mb-4">Compliance Overview</h3>
               <div className="flex flex-col xl:flex-row items-center gap-5">
                  <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-inner shrink-0" style={{ background: 'conic-gradient(#10B981 0% 62.5%, #F59E0B 62.5% 81.3%, #EF4444 81.3% 93.8%, #D1D5DB 93.8% 100%)' }}>
                     <div className="absolute w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                        <span className="text-xl font-black text-gray-900 leading-none">32</span>
                        <span className="text-[10px] font-medium text-gray-500 mt-0.5">Total</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <div className="flex items-center gap-2 text-[11px] font-medium text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div> 20 Compliant (62.5%)
                     </div>
                     <div className="flex items-center gap-2 text-[11px] font-medium text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></div> 6 Expiring Soon (18.8%)
                     </div>
                     <div className="flex items-center gap-2 text-[11px] font-medium text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div> 4 Overdue (12.5%)
                     </div>
                     <div className="flex items-center gap-2 text-[11px] font-medium text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0"></div> 2 Not Uploaded (6.3%)
                     </div>
                  </div>
               </div>
            </div>

            {/* Upcoming Compliance */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[13px] font-bold text-gray-900">Upcoming Compliance <span className="text-gray-500 font-normal block sm:inline">(Next 30 Days)</span></h3>
                  <a href="#" className="text-[11px] font-semibold text-purple-700 flex items-center gap-0.5 hover:underline whitespace-nowrap">View All <ArrowRight size={12} /></a>
               </div>
               <div className="flex flex-col gap-4">
                  {[
                     { name: 'Registration - T101', expiry: 'Expires on 15/07/2025', days: '21 days', color: 'text-green-600 bg-green-50' },
                     { name: 'Insurance - C201', expiry: 'Expires on 18/07/2025', days: '24 days', color: 'text-green-600 bg-green-50' },
                     { name: 'Roadworthy - G305', expiry: 'Expires on 22/07/2025', days: '28 days', color: 'text-orange-600 bg-orange-50' },
                     { name: 'Registration - U801', expiry: 'Expires on 25/07/2025', days: '31 days', color: 'text-orange-600 bg-orange-50' }
                  ].map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center gap-2">
                        <div className="flex gap-2 items-start overflow-hidden">
                           <FileText size={14} className="text-green-600 mt-0.5 shrink-0" />
                           <div className="min-w-0">
                              <div className="text-[12px] font-semibold text-gray-900 leading-tight truncate">{item.name}</div>
                              <div className="text-[10px] text-gray-500 mt-0.5 truncate">{item.expiry}</div>
                           </div>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded whitespace-nowrap ${item.color}`}>{item.days}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* AI Vehicle Insights */}
            <div className="bg-purple-50/50 border border-purple-100 rounded-2xl shadow-sm p-5">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[13px] font-bold text-purple-900">AI Vehicle Insights</h3>
                  <span className="bg-purple-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">AI</span>
               </div>
               <ul className="space-y-2 mb-5">
                  <li className="flex items-start gap-2 text-[12px] text-gray-800 font-medium">
                     <Check size={14} className="text-purple-600 mt-0.5 shrink-0" /> 2 vehicles have overdue compliance.
                  </li>
                  <li className="flex items-start gap-2 text-[12px] text-gray-800 font-medium">
                     <Check size={14} className="text-purple-600 mt-0.5 shrink-0" /> 6 compliance items expiring within 30 days.
                  </li>
                  <li className="flex items-start gap-2 text-[12px] text-gray-800 font-medium">
                     <Check size={14} className="text-purple-600 mt-0.5 shrink-0" /> T405 - SCANIA R500 is due for service soon.
                  </li>
                  <li className="flex items-start gap-2 text-[12px] text-gray-800 font-medium">
                     <Check size={14} className="text-purple-600 mt-0.5 shrink-0" /> C201 - HINO 700 tyre rotation recommended.
                  </li>
               </ul>
               <button className="w-full py-2 bg-white border border-purple-200 text-purple-700 rounded-xl text-[12px] font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                  <Star size={14} className="fill-purple-700" /> View AI Insights
               </button>
            </div>

         </div>
      </div>



      {/* EDIT VEHICLE MODAL */}
      {editVehicleModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4" onClick={closeEditModal}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Edit size={16} className="text-purple-600" /> Edit Vehicle ({editVehicleModal.id})
              </h3>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Make / Model *</label>
                  <input type="text" value={editVehicleModal.make || ''} onChange={e => setEditVehicleModal({...editVehicleModal, make: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Registration *</label>
                  <input type="text" value={editVehicleModal.reg || ''} onChange={e => setEditVehicleModal({...editVehicleModal, reg: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Vehicle Type</label>
                  <input type="text" value={editVehicleModal.type || ''} onChange={e => setEditVehicleModal({...editVehicleModal, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Year</label>
                  <input type="text" value={editVehicleModal.year || ''} onChange={e => setEditVehicleModal({...editVehicleModal, year: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
                  <select value={editVehicleModal.status || 'ACTIVE'} onChange={e => setEditVehicleModal({...editVehicleModal, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold bg-white cursor-pointer">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="OUT OF SERVICE">OUT OF SERVICE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch / Depot</label>
                  <input type="text" value={editVehicleModal.branch || ''} onChange={e => setEditVehicleModal({...editVehicleModal, branch: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Current Driver</label>
                  <input type="text" value={editVehicleModal.driver || ''} onChange={e => setEditVehicleModal({...editVehicleModal, driver: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Odometer</label>
                  <input type="text" value={editVehicleModal.odometer || ''} onChange={e => setEditVehicleModal({...editVehicleModal, odometer: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button onClick={closeEditModal} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
              <button onClick={async (e) => {
                try {
                  await api.put(`/vehicles/${editVehicleModal.id}`, {
                    rego: editVehicleModal.reg,
                    make: editVehicleModal.make,
                    model: editVehicleModal.model,
                    year: editVehicleModal.year ? parseInt(editVehicleModal.year) : undefined,
                    status: editVehicleModal.status,
                    odometerKm: editVehicleModal.odometer ? parseInt(String(editVehicleModal.odometer).replace(/[^0-9]/g,'')) : undefined,
                    notes: editVehicleModal.notes
                  });
                  fetchVehicles();
                  if (managingVehicle && managingVehicle.id === editVehicleModal.id) setManagingVehicle(editVehicleModal);
                  closeEditModal(e);
                  showToast('Vehicle updated successfully!');
                } catch (err) { showToast('Failed to update vehicle.', 'error'); }
              }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-xs shadow-sm cursor-pointer">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MAINTENANCE MODAL */}
      {showAddMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4" onClick={() => setShowAddMaintenanceModal(false)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Wrench size={16} className="text-purple-600" /> Add Maintenance Record
              </h3>
              <button onClick={() => setShowAddMaintenanceModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Service Type *</label>
                  <select value={maintenanceForm.type} onChange={e => setMaintenanceForm({...maintenanceForm, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold bg-white cursor-pointer">
                    <option>Scheduled Service</option>
                    <option>Oil Change</option>
                    <option>Tyre Rotation</option>
                    <option>Brake Inspection</option>
                    <option>Engine Overhaul</option>
                    <option>Major Service</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Service Date *</label>
                  <input type="date" value={maintenanceForm.date} onChange={e => setMaintenanceForm({...maintenanceForm, date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Odometer at Service (km)</label>
                  <input type="text" placeholder="e.g. 256,789" value={maintenanceForm.odometer} onChange={e => setMaintenanceForm({...maintenanceForm, odometer: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Next Due (km)</label>
                  <input type="text" placeholder="e.g. 270,000" value={maintenanceForm.nextDue} onChange={e => setMaintenanceForm({...maintenanceForm, nextDue: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Workshop / Provider *</label>
                  <input type="text" placeholder="e.g. Volvo Truck Centre" value={maintenanceForm.provider} onChange={e => setMaintenanceForm({...maintenanceForm, provider: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Total Cost (AUD)</label>
                  <input type="text" placeholder="e.g. $1,250.00" value={maintenanceForm.cost} onChange={e => setMaintenanceForm({...maintenanceForm, cost: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Description / Work Done</label>
                <textarea rows={2} placeholder="Describe the maintenance work performed..." value={maintenanceForm.description} onChange={e => setMaintenanceForm({...maintenanceForm, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Parts Cost (AUD)</label>
                  <input type="text" placeholder="e.g. $450.00" value={maintenanceForm.parts} onChange={e => setMaintenanceForm({...maintenanceForm, parts: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Labour Cost (AUD)</label>
                  <input type="text" placeholder="e.g. $800.00" value={maintenanceForm.labour} onChange={e => setMaintenanceForm({...maintenanceForm, labour: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Notes</label>
                <textarea rows={2} placeholder="Any additional notes..." value={maintenanceForm.notes} onChange={e => setMaintenanceForm({...maintenanceForm, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold resize-none" />
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
              <p className="text-[10px] text-slate-400">* Required fields</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowAddMaintenanceModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
                <button onClick={() => {
                  setShowAddMaintenanceModal(false);
                  setMaintenanceForm({ type: 'Scheduled Service', date: '', odometer: '', provider: '', cost: '', description: '', nextDue: '', parts: '', labour: '', notes: '' });
                }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-xs shadow-sm cursor-pointer">Save Record</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4" onClick={() => setShowAddExpenseModal(false)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <DollarSign size={16} className="text-purple-600" /> Add Expense
              </h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Category *</label>
                  <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold bg-white cursor-pointer">
                    <option>Fuel</option>
                    <option>Maintenance</option>
                    <option>Tolls</option>
                    <option>Insurance</option>
                    <option>Registration</option>
                    <option>Tyres</option>
                    <option>Repairs</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Date *</label>
                  <input type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Amount (AUD) *</label>
                  <input type="text" placeholder="e.g. $250.00" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">GST (AUD)</label>
                  <input type="text" placeholder="e.g. $25.00" value={expenseForm.gst} onChange={e => setExpenseForm({...expenseForm, gst: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Payment Method</label>
                  <select value={expenseForm.paymentMethod} onChange={e => setExpenseForm({...expenseForm, paymentMethod: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold bg-white cursor-pointer">
                    <option>Company Card</option>
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>Driver Cash Advance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Receipt / Reference No.</label>
                  <input type="text" placeholder="e.g. REC-00123" value={expenseForm.receipt} onChange={e => setExpenseForm({...expenseForm, receipt: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                <textarea rows={2} placeholder="Brief description of the expense..." value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold resize-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Notes</label>
                <textarea rows={2} placeholder="Any additional notes..." value={expenseForm.notes} onChange={e => setExpenseForm({...expenseForm, notes: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-semibold resize-none" />
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
              <p className="text-[10px] text-slate-400">* Required fields</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowAddExpenseModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
                <button onClick={() => {
                  const formattedAmount = expenseForm.amount ? (expenseForm.amount.startsWith('$') ? expenseForm.amount : `$${expenseForm.amount}`) : '$150.00';
                  const newEntry = {
                    id: Date.now(),
                    date: expenseForm.date ? new Date(expenseForm.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    category: expenseForm.category || 'Other',
                    description: expenseForm.description || `${expenseForm.category} Expense`,
                    details: expenseForm.notes || 'Added manually',
                    ref: expenseForm.receipt || `REC-${Math.floor(10000 + Math.random() * 90000)}`,
                    amount: formattedAmount,
                    rawAmount: parseFloat(formattedAmount.replace(/[^0-9.]/g, '')) || 0,
                    odometer: managingVehicle?.odometer ? `${managingVehicle.odometer} km` : '184,220 km',
                    addedBy: 'Admin User',
                    addedRole: '',
                    paymentMethod: expenseForm.paymentMethod || 'Company Card',
                    notes: expenseForm.notes || ''
                  };
                  setExpensesList(prev => [newEntry, ...prev]);
                  setShowAddExpenseModal(false);
                  setExpenseForm({ category: 'Fuel', date: '', amount: '', gst: '', description: '', receipt: '', paymentMethod: 'Company Card', notes: '' });
                }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-xs shadow-sm cursor-pointer">Save Expense</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEWING EXPENSE MODAL */}
      {viewingExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4" onClick={() => setViewingExpenseModal(null)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <FileText size={16} className="text-purple-600" /> Expense Details & Receipt
              </h3>
              <button onClick={() => setViewingExpenseModal(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-purple-50 text-purple-700 border border-purple-100 mb-1">
                    {viewingExpenseModal.category}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">{viewingExpenseModal.description}</h4>
                  <p className="text-[11px] text-gray-500">{viewingExpenseModal.date} • Added by {viewingExpenseModal.addedBy}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-gray-900">{viewingExpenseModal.amount}</div>
                  <div className="text-[10px] font-semibold text-gray-500">{viewingExpenseModal.paymentMethod}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 text-[11px]">
                <div>
                  <span className="text-gray-500 font-medium block">Reference / Receipt No.</span>
                  <span className="font-bold text-gray-900">{viewingExpenseModal.ref}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Vehicle Odometer</span>
                  <span className="font-bold text-gray-900">{viewingExpenseModal.odometer}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Payment Method</span>
                  <span className="font-bold text-gray-900">{viewingExpenseModal.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Status</span>
                  <span className="font-bold text-emerald-600">Paid & Verified</span>
                </div>
              </div>

              {viewingExpenseModal.details && (
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Details & Breakdown</span>
                  <p className="text-gray-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{viewingExpenseModal.details}</p>
                </div>
              )}

              {viewingExpenseModal.notes && (
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Notes</span>
                  <p className="text-gray-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{viewingExpenseModal.notes}</p>
                </div>
              )}

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">Attached receipt document verified</span>
                <button 
                  onClick={() => showDocToast(`Downloaded receipt ${viewingExpenseModal.ref}.pdf`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 cursor-pointer transition-colors"
                >
                  <Download size={12} /> Download Receipt
                </button>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button onClick={() => setViewingExpenseModal(null)} className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 text-xs cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT REPORT MODAL */}
      {showExportReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4" onClick={() => setShowExportReportModal(false)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Download size={16} className="text-purple-600" /> Export Maintenance Report
              </h3>
              <button onClick={() => setShowExportReportModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-2">Export Format</label>
                <div className="flex gap-2">
                  {['PDF', 'CSV', 'Excel'].map(fmt => (
                    <button key={fmt} onClick={() => setExportFormat(fmt)} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${exportFormat === fmt ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>{fmt}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-2">Include Sections</label>
                <div className="space-y-2">
                  {Object.entries(exportSections).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                      <input type="checkbox" checked={val} onChange={() => setExportSections(prev => ({...prev, [key]: !prev[key]}))} className="w-3.5 h-3.5 accent-purple-600" />
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button onClick={() => setShowExportReportModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
              <button onClick={() => setShowExportReportModal(false)} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-xs shadow-sm cursor-pointer flex items-center gap-1.5">
                <Download size={12} /> Export Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT PROFILE MODAL */}
      {showPrintProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4" onClick={() => setShowPrintProfileModal(false)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Printer size={16} className="text-purple-600" /> Print Vehicle Profile
              </h3>
              <button onClick={() => setShowPrintProfileModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-xs text-gray-600">This will generate a printable PDF profile for <span className="font-bold text-gray-900">{managingVehicle?.make} ({managingVehicle?.id})</span> including vehicle details, compliance status, and maintenance history.</p>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-3">
                <Info size={16} className="text-purple-600 mt-0.5 shrink-0" />
                <p className="text-[11px] text-purple-700 font-medium">The profile will open in a new tab ready to print or save as PDF.</p>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button onClick={() => setShowPrintProfileModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
              <button onClick={() => { window.print(); setShowPrintProfileModal(false); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-xs shadow-sm cursor-pointer flex items-center gap-1.5">
                <Printer size={12} /> Print Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEACTIVATE VEHICLE MODAL */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4" onClick={() => setShowDeactivateModal(false)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50">
              <h3 className="text-sm font-extrabold text-rose-700 flex items-center gap-2">
                <Power size={16} /> Deactivate Vehicle
              </h3>
              <button onClick={() => setShowDeactivateModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-600">Are you sure you want to deactivate <span className="font-bold text-gray-900">{managingVehicle?.make} ({managingVehicle?.id})</span>? This will mark the vehicle as Out of Service.</p>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Reason for Deactivation *</label>
                <select value={deactivateReason} onChange={e => setDeactivateReason(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-rose-400 font-semibold bg-white cursor-pointer">
                  <option value="">Select reason...</option>
                  <option>Major Repair Required</option>
                  <option>End of Life / Retired</option>
                  <option>Accident / Damage</option>
                  <option>Compliance Failure</option>
                  <option>Sold / Disposed</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Type "DEACTIVATE" to confirm</label>
                <input type="text" placeholder="DEACTIVATE" value={deactivateConfirmText} onChange={e => setDeactivateConfirmText(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-rose-400 font-semibold" />
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button onClick={() => setShowDeactivateModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
              <button disabled={deactivateConfirmText !== 'DEACTIVATE' || !deactivateReason} onClick={async () => {
                try {
                  await api.put(`/vehicles/${managingVehicle?.id}`, { status: 'OUT_OF_SERVICE' });
                  fetchVehicles();
                  setShowDeactivateModal(false);
                  setDeactivateConfirmText('');
                  setDeactivateReason('');
                  showToast('Vehicle deactivated.');
                } catch (err) { showToast('Failed to deactivate.', 'error'); }
              }} className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 text-xs shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5">
                <Power size={12} /> Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Vehicles;
