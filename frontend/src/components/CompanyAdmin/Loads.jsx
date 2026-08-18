import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import {
  Plus, Search, X, Star, MoreVertical, ChevronDown,
  Upload, Download, Sparkles, MapPin, Truck, CheckCircle,
  AlertCircle, Clock, Filter, ChevronLeft, ChevronRight,
  Eye, Edit3, Trash2, Package, Calendar, Activity, 
  Settings, ArrowUpRight, ArrowLeft, Phone, UserCheck,
  FileText, Camera, MessageSquare, DollarSign, Navigation,
  Layers, Radio, User, BarChart2, Thermometer, Check, Shield
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import CreateLoad from './CreateLoad';
import AILoadBuilder from './AILoadBuilder';
import L from 'leaflet';

// Reusable Map Component using Vanilla Leaflet (bulletproof for React 19)
function MapComponent() {
  const mapRef = useRef(null);
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Melbourne (-37.8136, 144.9631)
    // Geelong (-38.1499, 144.3617)
    // Sydney (-33.8688, 151.2093)
    const melbourne = [-37.8136, 144.9631];
    const geelong = [-38.1499, 144.3617];
    const sydney = [-33.8688, 151.2093];

    // Initialize map
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([-35.8, 147.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Setup custom marker icon configurations
    const createMarkerIcon = (label) => {
      return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="display:flex; flex-direction:column; align-items:center;">
          <div style="background:#3b82f6; width:22px; height:22px; border-radius:50%; border:3px bg-white; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 5px rgba(0,0,0,0.3)">
            <div style="width:8px; height:8px; background:white; border-radius:50%"></div>
          </div>
          <span style="font-weight:bold; font-size:10px; color:#1e3a8a; background:rgba(255,255,255,0.9); padding:1px 5px; border-radius:4px; margin-top:2px; box-shadow:0 1px 3px rgba(0,0,0,0.2); white-space:nowrap;">${label}</span>
        </div>`,
        iconSize: [60, 42],
        iconAnchor: [30, 20]
      });
    };

    const melbourneMarker = L.marker(melbourne, { icon: createMarkerIcon('Melbourne') }).addTo(map);
    const geelongMarker = L.marker(geelong, { icon: createMarkerIcon('Geelong') }).addTo(map);
    const sydneyMarker = L.marker(sydney, { icon: createMarkerIcon('Sydney') }).addTo(map);

    const routePolyline = L.polyline([melbourne, geelong, sydney], {
      color: '#3b82f6',
      weight: 3,
      dashArray: '8, 8',
      opacity: 0.8
    }).addTo(map);

    map.fitBounds(routePolyline.getBounds(), { padding: [30, 30] });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1, isolation: 'isolate' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}


// ─── Load Detail View ─────────────────────────────────────────────────────────
function LoadDetail({ load, onBack }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedStop, setSelectedStop] = useState(null);
  const [showStopModal, setShowStopModal] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);
  
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceDueDate, setInvoiceDueDate] = useState('Net 7 (7 days)');
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  // ── Dynamic Load & Header Actions State ─────────────────────────
  const [currentLoad, setCurrentLoad] = useState({
    id: load?.id || load?.loadRef || `PO-${Date.now().toString().slice(-5)}`,
    rawId: load?.rawId || load?.id,
    type: load?.type || 'General Freight',
    customer: load?.customer?.name || (typeof load?.customer === 'string' ? load.customer : 'Direct Customer'),
    status: load?.status || 'DRAFT',
    statusSub: load?.statusSub || (load?.status === 'ACTIVE' ? 'In Progress' : 'Draft'),
    priority: load?.priority || 'Normal',
    notes: load?.notes || 'No special instructions provided.',
    date: load?.date || (load?.createdAt ? new Date(load.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
    createdAt: load?.createdAt ? new Date(load.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
    updatedAt: load?.updatedAt ? new Date(load.updatedAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')
  });

  const [activeDriver, setActiveDriver] = useState({
    name: load?.driver ? (typeof load.driver === 'object' ? `${load.driver.firstName || ''} ${load.driver.lastName || ''}`.trim() : load.driver) : 'Not Assigned',
    code: load?.driver?.driverCode || load?.driver?.userCode || '—',
    phone: load?.driver?.phone || '—',
    license: load?.driver?.licenseClass || load?.driver?.licenseType || 'Standard License',
    diary: '08:00 / 17:00',
    avatar: load?.driver?.avatarUrl || load?.avatar || 'https://i.pravatar.cc/150?u=10'
  });

  const [activeTruck, setActiveTruck] = useState({
    id: load?.truck?.rego || load?.truck?.code || (typeof load?.truck === 'string' ? load.truck.split(' | ')[0] : 'Unassigned'),
    name: load?.truck?.model || (typeof load?.truck === 'string' ? load.truck.split(' | ')[1] : 'No Vehicle Assigned'),
    odo: load?.truck?.odometerKm ? `${load.truck.odometerKm} KM` : '— KM',
    trailer: load?.trailer?.rego || load?.trailer?.code || 'No Trailer',
    rego: load?.truck?.rego || '—'
  });

  // Modal & Dropdown States
  const [showEditLoadModal, setShowEditLoadModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  // Dynamic Drivers & Vehicles lists from DB
  const [dbDrivers, setDbDrivers] = useState([]);
  const [dbVehicles, setDbVehicles] = useState([]);

  useEffect(() => {
    api.get('/company-admin/drivers').then(r => {
      if (r.data?.data) setDbDrivers(r.data.data);
    }).catch(() => {});
    api.get('/company-admin/vehicles').then(r => {
      if (r.data?.data) setDbVehicles(r.data.data);
    }).catch(() => {});
  }, []);

  // Form States
  const [editFormData, setEditFormData] = useState({
    type: currentLoad.type,
    customer: currentLoad.customer,
    priority: currentLoad.priority,
    status: currentLoad.status,
    notes: currentLoad.notes
  });

  const [reassignForm, setReassignForm] = useState({
    driverName: activeDriver.name,
    truckId: activeTruck.id,
    trailer: activeTruck.trailer,
    notes: ''
  });

  const triggerToast = (msg, type = 'success') => {
    setToastNotification({ msg, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  const handleDownload = (filename) => {
    triggerToast(`Downloading ${filename}...`);
  };
  
  const [stopsList, setStopsList] = useState(
    Array.isArray(load?.stops) && load.stops.length > 0
      ? load.stops.map((s, idx) => ({
          id: idx + 1,
          rawId: s.id,
          type: s.type || (idx === 0 ? 'PICKUP' : 'DROP-OFF'),
          typeColor: (s.type === 'PICKUP' || idx === 0) ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700',
          address: s.address || 'Location Stop',
          contactName: s.contactName || '—',
          contactPhone: s.contactPhone || '—',
          date: s.scheduledDate ? new Date(s.scheduledDate).toLocaleDateString('en-GB') : (load?.date ? load.date.split('-').reverse().join('/') : new Date().toLocaleDateString('en-GB')),
          time: s.scheduledTime || '09:00 AM',
          completed: false
        }))
      : []
  );

  const handleEditStop = (stop) => {
    setEditingStop(stop);
    setStopForm({
      type: stop.type || 'PICKUP',
      address: stop.address?.replace('\n', ' ') || '',
      date: stop.date?.split('/').reverse().join('-') || '',
      time: stop.time ? (() => {
        const t = stop.time.trim();
        if (!t) return '';
        const isPM = t.toUpperCase().includes('PM');
        let [hourStr, minStr] = t.replace(/AM|PM/i, '').trim().split(':');
        let hour = parseInt(hourStr, 10);
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, '0')}:${minStr}`;
      })() : '',
      contactName: stop.contactName || '',
      contactPhone: stop.contactPhone || '',
      instructions: stop.instructions || ''
    });
    setShowStopModal(true);
    setActionMenuId(null);
  };
  
  const handleRemoveStop = async (id) => {
    const stopToRemove = stopsList.find(s => s.id === id);
    if (stopToRemove?.rawId) {
      try {
        const loadIdToUse = currentLoad?.rawId || currentLoad?.id;
        await api.delete(`/company-admin/loads/${loadIdToUse}/stops/${stopToRemove.rawId}`);
      } catch (err) {
        console.error("Error deleting stop via API:", err);
      }
    }
    setStopsList(prev => prev.filter(s => s.id !== id).map((s, idx) => ({ ...s, id: idx + 1 })));
    setActionMenuId(null);
    triggerToast("Stop removed from load", "info");
  };

  const [stopForm, setStopForm] = useState({
    type: 'PICKUP', address: '', date: '', time: '', contactName: '', contactPhone: '', instructions: ''
  });

  const handleMarkCompleted = (id) => {
    setStopsList(stopsList.map(s => s.id === id ? { ...s, completed: true } : s));
    setActionMenuId(null);
  };

  const [expensesList, setExpensesList] = useState(load?.expenses || []);
  const [documentsList, setDocumentsList] = useState(load?.documents || []);
  const [itemsList, setItemsList] = useState(load?.items || []);
  const [invoicesList, setInvoicesList] = useState([]);

  // Fetch load details, invoices, documents, and expenses from backend API
  useEffect(() => {
    const loadIdToFetch = currentLoad?.rawId || currentLoad?.id;
    if (loadIdToFetch) {
      api.get(`/company-admin/loads/${loadIdToFetch}`)
        .then(res => {
          const lData = res.data?.data || res.data;
          if (lData && typeof lData === 'object') {
            setCurrentLoad(prev => ({
              ...prev,
              id: lData.loadRef || lData.id,
              rawId: lData.id,
              type: lData.type || prev.type,
              customer: lData.customer?.name || (typeof lData.customer === 'string' ? lData.customer : prev.customer),
              status: lData.status === 'IN_TRANSIT' ? 'ACTIVE' : lData.status === 'DELIVERED' ? 'COMPLETED' : (lData.status || prev.status),
              notes: lData.notes || prev.notes,
              createdAt: lData.createdAt ? new Date(lData.createdAt).toLocaleDateString('en-GB') : prev.createdAt,
              updatedAt: lData.updatedAt ? new Date(lData.updatedAt).toLocaleDateString('en-GB') : prev.updatedAt
            }));

            if (lData.driver) {
              setActiveDriver({
                name: `${lData.driver.firstName || ''} ${lData.driver.lastName || ''}`.trim() || 'Assigned Driver',
                code: lData.driver.driverCode || lData.driver.userCode || '—',
                phone: lData.driver.phone || '—',
                license: lData.driver.licenseClass || lData.driver.licenseType || 'Standard License',
                diary: '08:00 / 17:00',
                avatar: lData.driver.avatarUrl || 'https://i.pravatar.cc/150?u=10'
              });
            } else {
              setActiveDriver({
                name: 'Not Assigned',
                code: '—',
                phone: '—',
                license: '—',
                diary: '—',
                avatar: 'https://i.pravatar.cc/150?u=10'
              });
            }

            if (lData.truck) {
              setActiveTruck({
                id: lData.truck.rego || lData.truck.code || 'Truck',
                name: `${lData.truck.make || ''} ${lData.truck.model || ''}`.trim() || 'Assigned Vehicle',
                odo: lData.truck.odometerKm ? `${lData.truck.odometerKm} KM` : '— KM',
                trailer: lData.trailer?.rego || lData.trailer?.code || 'No Trailer',
                rego: lData.truck.rego || '—'
              });
            }

            if (Array.isArray(lData.stops)) {
              setStopsList(lData.stops.map((s, idx) => ({
                id: idx + 1,
                rawId: s.id,
                type: s.type || (idx === 0 ? 'PICKUP' : 'DROPOFF'),
                typeColor: (s.type === 'PICKUP' || idx === 0) ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700',
                address: s.address || 'Location Stop',
                contactName: s.contactName || '—',
                contactPhone: s.contactPhone || '—',
                date: s.scheduledDate ? new Date(s.scheduledDate).toLocaleDateString('en-GB') : (lData.loadDate ? new Date(lData.loadDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')),
                time: s.scheduledTime || '09:00 AM',
                completed: false
              })));
            }

            if (Array.isArray(lData.items)) {
              setItemsList(lData.items);
            }
          }
        })
        .catch(err => console.log("Could not fetch detailed load info:", err));

      api.get(`/company-admin/loads/${loadIdToFetch}/invoices`)
        .then(res => {
          const list = res.data?.data || res.data;
          if (Array.isArray(list)) {
            setInvoicesList(list);
          }
        })
        .catch(err => {
          console.log("No backend invoices yet for load:", err);
        });

      api.get(`/company-admin/loads/${loadIdToFetch}/documents`)
        .then(res => {
          const list = res.data?.data || res.data;
          if (Array.isArray(list) && list.length > 0) {
            setDocumentsList(list);
          }
        })
        .catch(err => {
          console.log("No backend documents yet for load:", err);
        });

      api.get(`/company-admin/loads/${loadIdToFetch}/expenses`)
        .then(res => {
          const list = res.data?.data || res.data;
          if (Array.isArray(list)) {
            setExpensesList(list);
          }
        })
        .catch(err => {
          console.log("No backend expenses yet for load:", err);
        });
    }
  }, [currentLoad?.id, currentLoad?.rawId]);

  const handleDeleteExpense = async (expenseId) => {
    try {
      const loadIdToUse = currentLoad?.rawId || currentLoad?.id;
      await api.delete(`/company-admin/loads/${loadIdToUse}/expenses/${expenseId}`);
    } catch (err) {
      console.error("Error deleting expense via API:", err);
    }
    setExpensesList(prev => prev.filter(e => e.id !== expenseId));
    triggerToast("Expense deleted successfully", "success");
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      const loadIdToUse = currentLoad?.rawId || currentLoad?.id;
      await api.delete(`/company-admin/loads/${loadIdToUse}/invoices/${invoiceId}`);
    } catch (err) {
      console.error("Error deleting invoice via API:", err);
    }
    setInvoicesList(prev => prev.filter(inv => inv.id !== invoiceId && inv.realId !== invoiceId));
    triggerToast("Invoice deleted successfully", "success");
  };

  // Invoice calculations
  const invoiceSubtotal = parseFloat(currentLoad?.rate || currentLoad?.subtotal || 2200);
  const invoiceExpenses = expensesList.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const invoiceTotal = invoiceSubtotal + invoiceExpenses;

  const handleGenerateInvoice = async () => {
    try {
      setIsGeneratingInvoice(true);
      const loadIdToUse = currentLoad?.rawId || currentLoad?.id;
      const res = await api.post(`/company-admin/loads/${loadIdToUse}/invoices`, {
        amount: invoiceTotal,
        dueDateTerms: invoiceDueDate,
        status: 'SENT'
      });
      const created = res.data?.data || res.data;
      if (created) {
        setInvoicesList(prev => [created, ...prev]);
      }
      setShowInvoiceModal(false);
    } catch (err) {
      console.error("Error generating invoice via API, using local update:", err);
      const fallbackInv = {
        id: `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('en-GB'),
        customer: currentLoad?.customer?.name || (typeof currentLoad?.customer === 'string' ? currentLoad.customer : 'General Customer'),
        amount: `$${invoiceTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        status: 'Sent',
        color: 'bg-blue-100 text-blue-700'
      };
      setInvoicesList(prev => [fallbackInv, ...prev]);
      setShowInvoiceModal(false);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const tabs = ['Overview', `Stops (${stopsList.length})`, `Items (${itemsList.length})`, 'Driver & Vehicle', 'Expenses', 'Documents', 'Proof Photos', 'POD', 'Invoices', 'Activity'];

  // Dynamic route steps from stopsList
  const routeSteps = [
    { label: 'Dispatched', date: currentLoad.createdAt, done: currentLoad.status !== 'DRAFT' },
    ...stopsList.map((s, i) => ({
      label: s.type === 'PICKUP' ? `Pickup ${i + 1}` : `Drop-off ${i + 1}`,
      date: s.date,
      done: s.completed,
      active: !s.completed && i === stopsList.findIndex(st => !st.completed)
    })),
    { label: 'Delivered', date: currentLoad.updatedAt, done: currentLoad.status === 'COMPLETED' }
  ];

  const getLoadStatusBadge = () => {
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };


  return (
    <div className="flex flex-col" style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* ── Top Bar ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 bg-white border-b border-slate-100 shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 shrink-0">
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">Load {currentLoad.id}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border uppercase tracking-wider ${getLoadStatusBadge(currentLoad.status)}`}>
                ● {currentLoad.status === 'ACTIVE' ? 'IN PROGRESS' : currentLoad.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 flex-wrap">
              <Truck className="w-3 h-3 shrink-0" /> {currentLoad.type} • Created on {currentLoad.createdAt}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto relative">
          <button 
            onClick={() => {
              setEditFormData({
                type: currentLoad.type,
                customer: currentLoad.customer,
                priority: currentLoad.priority,
                status: currentLoad.status,
                notes: currentLoad.notes
              });
              setShowEditLoadModal(true);
            }}
            className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-600" /> Edit Load
          </button>
          
          <button 
            onClick={() => {
              setReassignForm({
                driverName: activeDriver.name,
                truckId: activeTruck.id,
                trailer: activeTruck.trailer,
                notes: ''
              });
              setShowReassignModal(true);
            }}
            className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> Reassign
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black transition-colors shadow-sm cursor-pointer"
            >
              More Actions <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMoreActions ? 'rotate-180' : ''}`} />
            </button>

            {/* Floating Dropdown Menu */}
            {showMoreActions && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMoreActions(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setShowMoreActions(false);
                        triggerToast(`Downloading Manifest for Load ${currentLoad.id}...`);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-slate-400" /> Download Manifest PDF
                    </button>
                    <button 
                      onClick={() => {
                        setShowMoreActions(false);
                        triggerToast(`Emailing load details to ${activeDriver.name} & ${currentLoad.customer}...`);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400" /> Email Load Summary
                    </button>
                    <button 
                      onClick={() => {
                        setShowMoreActions(false);
                        triggerToast(`Sending barcode labels for ${currentLoad.id} to printer...`);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-slate-400" /> Print Barcode Labels
                    </button>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setShowMoreActions(false);
                        setShowInvoiceModal(true);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4 text-emerald-500" /> Create / View Invoice
                    </button>
                    <button 
                      onClick={() => {
                        setShowMoreActions(false);
                        const isPaused = currentLoad.status === 'ON HOLD';
                        const newStatus = isPaused ? 'ACTIVE' : 'ON HOLD';
                        setCurrentLoad(prev => ({ ...prev, status: newStatus }));
                        triggerToast(isPaused ? `Load ${currentLoad.id} resumed` : `Load ${currentLoad.id} put ON HOLD`, isPaused ? 'success' : 'warning');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-amber-500" /> {currentLoad.status === 'ON HOLD' ? 'Resume Load' : 'Put Load On Hold'}
                    </button>
                    <button 
                      onClick={() => {
                        setShowMoreActions(false);
                        triggerToast(`Load ${currentLoad.id} duplicated as PO-${Math.floor(10000 + Math.random() * 90000)}`);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-slate-400" /> Duplicate Load
                    </button>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setShowMoreActions(false);
                        if (window.confirm(`Are you sure you want to cancel Load ${currentLoad.id}?`)) {
                          setCurrentLoad(prev => ({ ...prev, status: 'CANCELLED', statusSub: 'Cancelled' }));
                          triggerToast(`Load ${currentLoad.id} has been cancelled`, 'error');
                        }
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" /> Cancel Load
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs Row ────────────────────────────────────────── */}
      <div className="flex items-center gap-0 px-6 bg-white border-b border-slate-100 overflow-x-auto shrink-0">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-[12px] font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-12 gap-5 max-w-[1280px] mx-auto">

            {/* ════ COLUMN 1: LEFT (Load Summary, Stops Timeline, Load Notes) ════ */}
            <div className="col-span-12 lg:col-span-3 space-y-5">
              
              {/* Load Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Load Summary</h3>
                <div className="flex flex-col gap-3.5">
                  {[
                    { icon: <FileText className="w-4 h-4 text-slate-400" />, label: 'Load Reference', value: currentLoad.id },
                    { icon: <Layers className="w-4 h-4 text-slate-400" />, label: 'Load Type', value: currentLoad.type },
                    { icon: <AlertCircle className="w-4 h-4 text-rose-500" />, label: 'Priority', value: currentLoad.priority === 'High' ? '🔴 High' : currentLoad.priority === 'Urgent' ? '⚡ Urgent' : '🟢 Normal' },
                    { icon: <User className="w-4 h-4 text-slate-400" />, label: 'Booking Customer', value: currentLoad.customer },
                    { icon: <MapPin className="w-4 h-4 text-slate-400" />, label: 'Total Stops', value: `${stopsList.length} Stops` },
                    { icon: <Package className="w-4 h-4 text-slate-400" />, label: 'Items / Vehicles', value: `${itemsList.length} Cargo Items` },
                    { icon: <Navigation className="w-4 h-4 text-slate-400" />, label: 'Total Distance (EST.)', value: load?.totalDistance ? `${load.totalDistance} km` : '—' },
                    { icon: <Thermometer className="w-4 h-4 text-slate-400" />, label: 'Total Weight (EST.)', value: load?.totalWeight ? `${load.totalWeight} kg` : '—' },
                    { icon: <BarChart2 className="w-4 h-4 text-slate-400" />, label: 'Total Volume (EST.)', value: load?.totalVolume ? `${load.totalVolume} m³` : '—' },
                    { icon: <Calendar className="w-4 h-4 text-slate-400" />, label: 'Created', value: currentLoad.createdAt },
                    { icon: <Clock className="w-4 h-4 text-slate-400" />, label: 'Last Updated', value: currentLoad.updatedAt },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="shrink-0">{row.icon}</span>
                        <span className="text-[12px] text-slate-400 font-semibold">{row.label}</span>
                      </div>
                      <span className="text-[12px] font-bold text-slate-800 text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stops Timeline */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Stops Timeline</h3>
                  <button className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">VIEW ALL</button>
                </div>
                <div className="space-y-4">
                  {stopsList.map((stop, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {stop.completed ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 text-[10px] font-black">
                            {stop.id}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex items-start justify-between min-w-0">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black text-slate-400">{stop.type}</span>
                            <span className="text-xs font-bold text-slate-800">{stop.address.split(',')[0]}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{stop.address}</p>
                          <p className="text-[9px] text-slate-400">{stop.date}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider shrink-0 ${stop.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {stop.completed ? 'COMPLETED' : 'UPCOMING'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Load Notes */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Load Notes</h3>
                  <button 
                    onClick={() => {
                      setEditFormData({
                        type: currentLoad.type,
                        customer: currentLoad.customer,
                        priority: currentLoad.priority,
                        status: currentLoad.status,
                        notes: currentLoad.notes
                      });
                      setShowEditLoadModal(true);
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    EDIT
                  </button>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  {currentLoad.notes}
                </p>
              </div>

            </div>

            {/* ════ COLUMN 2: CENTER (Route Progress + Map, Items, Messages) ════ */}
            <div className="col-span-12 lg:col-span-5 space-y-5">
              
              {/* Route Progress & Map */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Route Progress</h3>
                
                {/* Circular steps horizontal list */}
                <div className="flex items-start justify-between gap-1 mb-5 overflow-x-auto pb-2 scrollbar-none">
                  {routeSteps.map((step, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black border-2 ${
                          step.done && !step.active ? 'bg-emerald-500 border-emerald-500 text-white' :
                          step.active ? 'bg-blue-500 border-blue-500 text-white' :
                          'bg-white border-slate-200 text-slate-400'
                        }`}>
                          {step.done && !step.active ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 text-center w-14 leading-tight">{step.label}</span>
                        {step.active && <span className="text-[8px] font-bold text-blue-500 leading-none">In Progress</span>}
                        <span className="text-[8px] text-slate-400 mt-0.5">{step.date ? String(step.date).split(' ')[0] : ''}</span>
                      </div>
                      {i < routeSteps.length - 1 && (
                        <div className={`flex-1 h-0.5 mt-4 mx-0.5 ${step.done ? 'bg-emerald-400' : 'bg-slate-200'}`} style={{ minWidth: 16 }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* MapContainer using Leaflet */}
                <div className="rounded-xl overflow-hidden border border-slate-200" style={{ height: 235 }}>
                  <MapComponent />
                </div>
              </div>

              {/* Items / Vehicles */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Items / Vehicles ({itemsList.length})</h3>
                  <button className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">VIEW ALL</button>
                </div>
                {itemsList.length > 0 ? (
                  itemsList.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3 last:mb-0">
                      <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shrink-0 font-bold">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-black text-slate-900 truncate">{item.rego || item.stockRef || 'ITEM-REF'} - {item.make || ''} {item.model || item.name || 'Cargo Item'}</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold">CUSTOMER</p>
                              <p className="text-[11px] font-bold text-slate-700 truncate">{currentLoad.customer}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold">QUANTITY</p>
                              <p className="text-[11px] font-bold text-slate-700 truncate">{item.quantity || 1} Units</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-semibold text-slate-400 py-3 text-center">No manifested items or cargo assigned to this load.</p>
                )}
              </div>

              {/* Messages */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Messages</h3>
                  <button className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">VIEW ALL</button>
                </div>
                <p className="text-xs font-semibold text-slate-400 py-2 text-center">No active messages for this load.</p>
              </div>

            </div>

            {/* ════ COLUMN 3: RIGHT (Load Status, Driver & Vehicle Live, Recent Proof Photos, Financials) ════ */}
            <div className="col-span-12 lg:col-span-4 space-y-5">
              
              {/* Load Status */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Load Status</h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {currentLoad.status}
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Current Status', value: currentLoad.status === 'ACTIVE' ? 'En Route / Active' : currentLoad.status, icon: <Radio className="w-4 h-4 text-blue-500" /> },
                    { label: 'Current Location', value: stopsList[0]?.address || 'In Transit', icon: <MapPin className="w-4 h-4 text-rose-500" /> },
                    { label: 'Last Update', value: currentLoad.updatedAt, icon: <Clock className="w-4 h-4 text-slate-400" /> },
                    { label: 'Updated By', value: `${activeDriver.name}`, icon: <User className="w-4 h-4 text-slate-400" /> },
                    { label: 'Next Stop', value: stopsList[1]?.address ? `Next Stop: ${stopsList[1].address}` : 'Final Destination', icon: <Navigation className="w-4 h-4 text-emerald-500" /> },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{item.label}</p>
                        <p className="text-xs font-bold text-slate-800 whitespace-pre-line leading-tight mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver & Vehicle (Live) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Driver & Vehicle (Live)</h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full uppercase tracking-wider shrink-0">+ LIVE</span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <img
                    src={activeDriver.avatar}
                    alt="Driver"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">{activeDriver.name} ({activeDriver.code})</p>
                    <p className="text-[9px] text-slate-400 font-semibold leading-tight">PHONE: {activeDriver.phone} • LICENSE: {activeDriver.license}</p>
                    <p className="text-[9px] text-slate-400 font-semibold leading-tight mt-0.5">WORK DIARY: {activeDriver.diary}</p>
                  </div>
                  <a href={`tel:${activeDriver.phone}`} className="w-8 h-8 bg-green-50 hover:bg-green-100 rounded-full flex items-center justify-center shrink-0 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-green-600" />
                  </a>
                </div>
                <div className="flex items-center gap-3 pt-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-200">
                    <Truck className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">Truck: {activeTruck.id} | {activeTruck.name}</p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">ODOMETER: {activeTruck.odo} • STATUS: ON THE ROAD</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-200">
                    <Package className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">Trailer: {activeTruck.trailer}</p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">REG NO.: {activeTruck.rego} • STATUS: ATTACHED</p>
                  </div>
                </div>
              </div>

              {/* Recent Proof Photos */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Recent Proof Photos</h3>
                  <button className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">VIEW ALL</button>
                </div>
                <div className="py-6 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-2">
                    <Camera className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 mb-1">No proof photos uploaded</p>
                  <p className="text-[10px] text-slate-400">Photos will appear here once submitted by the driver.</p>
                </div>
              </div>

              {/* Financial Overview */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Financial Overview</h3>
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">Invoices</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black rounded-full uppercase tracking-wider">SEE GENERATED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">Driver Pay</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[9px] font-black rounded-full uppercase tracking-wider">PENDING</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">Expenses ({expensesList.length} items)</span>
                    <span className="text-xs font-bold text-slate-800">
                      ${expensesList.reduce((sum, e) => sum + parseFloat((e.amount || '$0').toString().replace(/[^0-9.]/g, '') || 0), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                  View Financials
                </button>
              </div>

              {/* Quick Actions (Message, Expense, Document, Report) Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex justify-between items-center">
                {[
                  { icon: <MessageSquare className="w-5 h-5 text-slate-500" />, label: 'Message' },
                  { icon: <DollarSign className="w-5 h-5 text-slate-500" />, label: 'Expense' },
                  { icon: <FileText className="w-5 h-5 text-slate-500" />, label: 'Document' },
                  { icon: <Shield className="w-5 h-5 text-slate-500" />, label: 'Report' },
                ].map((item, i) => (
                  <button 
                    key={i} 
                    className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors flex-1"
                    onClick={() => {
                      if (item.label === 'Expense') setShowExpenseModal(true);
                      else if (item.label === 'Document') setShowDocumentModal(true);
                    }}
                  >
                    {item.icon}
                    <span className="text-[11px] font-bold text-slate-600">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Mark Load As Completed Button */}
              <button 
                onClick={async () => {
                  try {
                    const targetId = currentLoad.rawId || currentLoad.id;
                    await api.put(`/company-admin/loads/${targetId}`, { status: 'COMPLETED' });
                  } catch (err) {
                    console.error('Error completing load:', err);
                  }
                  setCurrentLoad(prev => ({ ...prev, status: 'COMPLETED' }));
                  triggerToast(`Load ${currentLoad.id} marked as COMPLETED!`);
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-colors shadow-md shadow-indigo-100 uppercase tracking-wider cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> MARK LOAD AS COMPLETED
              </button>

            </div>

          </div>
        )}

        {activeTab.startsWith('Stops') && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 text-xs font-black">
                  2
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Route Stops</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">ADD ALL PICKUP AND DROP-OFF LOCATIONS</p>
                </div>
              </div>
              <button 
                onClick={() => { 
                  setEditingStop(null); 
                  setStopForm({ type: 'PICKUP', address: '', date: '', time: '', contactName: '', contactPhone: '', instructions: '' });
                  setShowStopModal(true); 
                }}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" /> Add Stop
              </button>
            </div>

            {stopsList.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                  <MapPin className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-700 mb-1">No stops added yet</p>
                <p className="text-xs text-slate-400">Click "+ Add Stop" to add pickup and drop-off locations to this load.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: 900 }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-12">#</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address / Suburb</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stopsList.map((stop) => (
                    <tr key={stop.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-4 text-xs font-bold text-slate-400">{stop.id}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${
                          stop.type === 'PICKUP' 
                            ? (stop.id === 1 ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100')
                            : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            stop.type === 'PICKUP'
                              ? (stop.id === 1 ? 'bg-purple-600' : 'bg-emerald-600')
                              : 'bg-blue-600'
                          }`} />
                          {stop.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-800 whitespace-pre-line leading-tight" style={{ minWidth: 160 }}>
                        <button 
                          onClick={() => setSelectedStop({
                            stepNum: stop.id,
                            name: stop.address.split('\n')[0] || stop.address,
                            type: stop.type,
                            status: stop.completed ? 'COMPLETED' : 'PENDING',
                            address: stop.address,
                            dateTime: `${stop.date} ${stop.time}`,
                            contactName: stop.contactName || 'Site Contact',
                            contactRole: 'Operations',
                            contactPhone: stop.contactPhone || '—',
                            contactEmail: '',
                            cargoName: currentLoad.type,
                            cargoDesc: `Load ${currentLoad.id} cargo`,
                            instructions: stop.instructions || 'No special instructions.'
                          })}
                          className={`text-left hover:text-indigo-600 hover:underline transition-colors focus:outline-none ${stop.completed ? 'line-through text-slate-400' : ''}`}
                        >
                          {stop.address}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-bold text-slate-800">{stop.contactName}</p>
                        <a 
                          href={`tel:${stop.contactPhone}`}
                          className="text-[10px] text-slate-400 font-semibold mt-0.5 hover:text-indigo-600 hover:underline transition-colors block"
                        >
                          {stop.contactPhone}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <div className="inline-flex items-center justify-between gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white w-32">
                          <span>{stop.date}</span>
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="inline-flex items-center justify-between gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white w-28">
                          <span>{stop.time}</span>
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => setSelectedStop({
                            stepNum: stop.id,
                            name: stop.address.split('\n')[0] || stop.address,
                            type: stop.type,
                            status: stop.completed ? 'COMPLETED' : 'PENDING',
                            address: stop.address,
                            dateTime: `${stop.date} ${stop.time}`,
                            contactName: stop.contactName || 'Site Contact',
                            contactRole: 'Operations',
                            contactPhone: stop.contactPhone || '—',
                            contactEmail: '',
                            cargoName: currentLoad.type,
                            cargoDesc: `Load ${currentLoad.id} cargo`,
                            instructions: stop.instructions || 'No special instructions.'
                          })}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-black rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActionMenuId(actionMenuId === stop.id ? null : stop.id);
                              }}
                              className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-colors shrink-0 ${
                                actionMenuId === stop.id ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            
                            {actionMenuId === stop.id && (
                              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                                <button 
                                  onClick={() => handleEditStop(stop)}
                                  className="w-full px-4 py-2 text-left text-[11px] font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Edit Stop
                                </button>
                                <button 
                                  onClick={() => handleMarkCompleted(stop.id)}
                                  className="w-full px-4 py-2 text-left text-[11px] font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" /> Mark Completed
                                </button>
                                <hr className="border-slate-100 my-1" />
                                <button 
                                  onClick={() => handleRemoveStop(stop.id)}
                                  className="w-full px-4 py-2 text-left text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Remove Stop
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {activeTab.startsWith('Items') && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-base font-bold text-slate-900">Manifested Items &amp; Cargo</h2>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-wider rounded-full">
                {itemsList.length} Total Cargo
              </span>
            </div>
            {itemsList.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                  <Package className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-700 mb-1">No cargo items assigned</p>
                <p className="text-xs text-slate-400">Items assigned to this load will appear here.</p>
              </div>
            ) : (
              itemsList.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 last:mb-0">
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center h-48">
                    <Package className="w-12 h-12 text-slate-300" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'CUSTOMER BOOKING', value: currentLoad.customer },
                      { label: 'STOCK REF / REGO', value: item.rego || item.stockRef || 'ITEM-001', color: 'text-indigo-600' },
                      { label: 'DESCRIPTION', value: item.model || item.name || 'Cargo Item' },
                      { label: 'QUANTITY', value: `${item.quantity || 1} Units` },
                      { label: 'WEIGHT', value: item.weight ? `${item.weight} kg` : '—', span: true },
                    ].map((row, ri) => (
                      <div key={ri} className={`p-4 bg-slate-50 border border-slate-100 rounded-xl ${row.span ? 'sm:col-span-2' : ''}`}>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">{row.label}</p>
                        <p className={`text-xs font-bold text-slate-800 ${row.color || ''}`}>{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'Driver & Vehicle' && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-base font-bold text-slate-900">Active Driver &amp; Fleet Assignment</h2>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full">
                ● On the Road
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Driver Card */}
              <div className="p-5 border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <img
                    src={activeDriver.avatar}
                    alt="Driver"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{activeDriver.name}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">DRIVER CODE: {activeDriver.code}</p>
                    <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active ({activeDriver.license})
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">PHONE NUMBER</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{activeDriver.phone}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">WORK DIARY DUTY</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{activeDriver.diary}</p>
                  </div>
                </div>
              </div>

              {/* Fleet Card */}
              <div className="p-5 border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{activeTruck.id} | {activeTruck.name}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">ENGINE ODOMETER: {activeTruck.odo}</p>
                    <p className="text-[11px] font-bold text-slate-500 mt-1">
                      Trailer Attached: {activeTruck.trailer}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">VEHICLE REGO</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{activeTruck.rego}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">TELEMATICS STATUS</p>
                    <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Ping OK
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Expenses' && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-base font-bold text-slate-900">Load Expenses</h2>
              <button 
                onClick={() => setShowExpenseModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" /> Add Expense
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expensesList.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-4 text-xs font-bold text-slate-600">{exp.date}</td>
                      <td className="px-4 py-4"><span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider">{exp.type}</span></td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-800">{exp.desc}</td>
                      <td className="px-4 py-4 text-xs font-black text-slate-900">{exp.amount}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${exp.color}`}>{exp.status}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setPreviewItem({ type: 'Expense Receipt', title: exp.type, desc: exp.desc, amount: exp.amount })}
                            className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 cursor-pointer"
                            title="View Receipt"
                          >
                            <Eye size={13}/>
                          </button>
                          <button 
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 cursor-pointer"
                            title="Delete Expense"
                          >
                            <Trash2 size={13}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Documents Tab ── */}
        {activeTab === 'Documents' && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-base font-bold text-slate-900">Load Documents</h2>
              <button 
                onClick={() => setShowDocumentModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors uppercase tracking-wider"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Document
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {documentsList.length > 0 ? (
                documentsList.map((doc, i) => (
                  <div key={doc.id || i} className="p-4 border border-slate-200 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow group">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1" title={doc.name}>
                          {doc.name.endsWith('.pdf') || doc.name.endsWith('.png') || doc.name.endsWith('.jpg') ? doc.name : `${doc.name}.pdf`}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Uploaded: {doc.date || 'Today'} • {doc.size || '1.2 MB'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setPreviewItem({ type: 'Document', title: doc.name })}
                        className="flex-1 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 flex justify-center items-center gap-1 cursor-pointer"
                      >
                        <Eye size={12}/> View
                      </button>
                      <button 
                        onClick={() => handleDownload(doc.name)}
                        className="flex-1 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 flex justify-center items-center gap-1 cursor-pointer"
                      >
                        <Download size={12}/> Download
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500 mb-1">No documents uploaded yet</p>
                  <p className="text-[10px] text-slate-400">Click "Upload Document" to attach BOL, Consignment notes or receipts.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Proof Photos Tab ── */}
        {activeTab === 'Proof Photos' && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-base font-bold text-slate-900">Proof Photos</h2>
              <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5" /> Filter by Stop
              </button>
            </div>
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                <Camera className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-700 mb-1">No proof photos submitted</p>
              <p className="text-xs text-slate-400 max-w-xs">Photos will automatically appear here once the driver uploads them through the mobile app at each stop.</p>
            </div>
          </div>
        )}

        {/* ── POD Tab ── */}
        {activeTab === 'POD' && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center py-12">
            <Shield className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="text-xl font-black text-slate-900 mb-2">Proof of Delivery</h2>
            <p className="text-sm text-slate-500 mb-8 text-center max-w-md">The load has not been fully delivered yet. The POD will be generated automatically once the final drop-off is completed and signed.</p>
            
            <div className="w-full max-w-md border border-slate-200 rounded-2xl p-6 bg-slate-50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Current Progress</h3>
              <div className="space-y-4">
                {stopsList.map((stop, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Stop {idx + 1} ({stop.type})</span>
                    <span className={stop.completed ? 'text-emerald-600' : idx === 0 ? 'text-amber-500' : 'text-slate-400'}>
                      {stop.completed ? 'Completed' : idx === 0 ? 'Pending' : 'Upcoming'}
                    </span>
                  </div>
                ))}
                {stopsList.length === 0 && (
                  <p className="text-xs text-slate-400 text-center">No stops assigned to this load yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Invoices Tab ── */}
        {activeTab === 'Invoices' && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-base font-bold text-slate-900">Invoices</h2>
              <button 
                onClick={() => setShowInvoiceModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" /> Generate Invoice
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invoice #</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoicesList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-14 text-center">
                        <div className="flex flex-col items-center">
                          <DollarSign className="w-8 h-8 text-slate-300 mb-2" />
                          <p className="text-sm font-bold text-slate-500 mb-1">No invoices generated yet</p>
                          <p className="text-xs text-slate-400">Click &quot;Generate Invoice&quot; to create the first invoice for this load.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    invoicesList.map((inv) => (
                      <tr key={inv.id || inv.realId} className="hover:bg-slate-50/50">
                        <td className="px-4 py-4 text-xs font-bold text-indigo-600">{inv.id}</td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-600">{inv.date}</td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-800">{inv.customer}</td>
                        <td className="px-4 py-4 text-xs font-black text-slate-900">{inv.amount}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${inv.color || 'bg-blue-100 text-blue-700'}`}>{inv.status}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setPreviewItem({ type: 'Customer Invoice', title: inv.id, desc: inv.customer, amount: inv.amount })}
                              className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 cursor-pointer"
                              title="View Invoice"
                            >
                              <Eye size={13}/>
                            </button>
                            <button 
                              onClick={() => handleDownload(`${inv.id}.pdf`)}
                              className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 cursor-pointer"
                              title="Download Invoice PDF"
                            >
                              <Download size={13}/>
                            </button>
                            <button 
                              onClick={() => handleDeleteInvoice(inv.realId || inv.id)}
                              className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 cursor-pointer"
                              title="Delete Invoice"
                            >
                              <Trash2 size={13}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'Activity' && (
          <div className="max-w-[1280px] mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-base font-bold text-slate-900">Load Activity &amp; Audit Trail</h2>
            </div>
            <div className="pl-4 border-l-2 border-slate-100 space-y-6">
              <div className="relative">
                <div className="absolute -left-[29px] w-7 h-7 rounded-full flex items-center justify-center text-white ring-4 ring-white bg-slate-400">
                  <FileText size={14}/>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 ml-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-slate-900">Load Created</h4>
                    <span className="text-[10px] font-bold text-slate-400">{currentLoad.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-600">Load {currentLoad.id} created for customer {currentLoad.customer}.</p>
                </div>
              </div>
              {currentLoad.status !== 'DRAFT' && currentLoad.status !== 'PLANNED' && (
                <div className="relative">
                  <div className="absolute -left-[29px] w-7 h-7 rounded-full flex items-center justify-center text-white ring-4 ring-white bg-emerald-500">
                    <Navigation size={14}/>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 ml-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-slate-900">Dispatched</h4>
                      <span className="text-[10px] font-bold text-slate-400">{currentLoad.updatedAt}</span>
                    </div>
                    <p className="text-xs text-slate-600">Load dispatched to driver {activeDriver.name}.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Stop Details Modal ────────────────────────────── */}
      {selectedStop && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 pt-16 pb-6 z-[999999] animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-black">
                  {selectedStop.stepNum}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 leading-tight">{selectedStop.name}</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">STOP SPECIFIC INFORMATION</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStop(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 max-h-[75vh]">
              {/* Badges Row */}
              <div className="flex gap-2">
                <span className="px-2.5 py-1 border border-indigo-200 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-wider">
                  {selectedStop.type}
                </span>
                <span className={`px-2.5 py-1 border text-[10px] font-black rounded-full uppercase tracking-wider ${
                  selectedStop.status === 'COMPLETED' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-blue-200 bg-blue-50 text-blue-700'
                }`}>
                  {selectedStop.status}
                </span>
              </div>

              {/* Address & Date Scheduled side-by-side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">ADDRESS / LOCATION</p>
                  <p className="text-xs font-bold text-slate-800 flex items-start gap-1 leading-snug">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{selectedStop.address}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5">SCHEDULED DATE & TIME</p>
                  <p className="text-xs font-bold text-slate-800 flex items-start gap-1 leading-snug">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{selectedStop.dateTime}</span>
                  </p>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Primary Contact Person */}
              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">PRIMARY CONTACT PERSON</p>
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-[11px] font-black uppercase">
                      {selectedStop.contactName.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{selectedStop.contactName}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{selectedStop.contactRole}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${selectedStop.contactPhone}`} className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors shadow-xs">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                    <a href={`mailto:${selectedStop.contactEmail}`} className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors shadow-xs">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Cargo / Manifest Items */}
              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">CARGO / MANIFEST ITEMS</p>
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{selectedStop.cargoName}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{selectedStop.cargoDesc}</p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Special Site Instructions */}
              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">SPECIAL SITE INSTRUCTIONS</p>
                <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl text-xs font-semibold text-amber-900 leading-relaxed">
                  {selectedStop.instructions}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button 
                onClick={() => setSelectedStop(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors bg-white shadow-sm cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={() => { setSelectedStop(null); }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                View on Map
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Add/Edit Stop Modal ────────────────────────────── */}
      {showStopModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 pt-16 pb-6 z-[999999] animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-950">{editingStop ? 'Edit Stop' : 'Add New Stop'}</h3>
              <button 
                onClick={() => setShowStopModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              const timeVal = stopForm.time;
              let hour = timeVal ? parseInt(timeVal.split(':')[0], 10) : 0;
              const isPM = hour >= 12;
              const formattedTime = timeVal ? `${(hour % 12) || 12}:${timeVal.split(':')[1]} ${isPM ? 'PM' : 'AM'}` : '';

              const newStopData = {
                type: stopForm.type,
                address: stopForm.address,
                date: stopForm.date,
                time: formattedTime,
                contactName: stopForm.contactName,
                contactPhone: stopForm.contactPhone,
                instructions: stopForm.instructions
              };
              
              try {
                const loadIdToUse = currentLoad?.rawId || currentLoad?.id;
                if (editingStop) {
                  if (editingStop.rawId) {
                    await api.put(`/company-admin/loads/${loadIdToUse}/stops/${editingStop.rawId}`, newStopData);
                  }
                  setStopsList(prev => prev.map(s => s.id === editingStop.id ? {
                    ...s,
                    ...newStopData,
                    date: stopForm.date?.split('-').reverse().join('/') || s.date
                  } : s));
                  triggerToast("Stop updated successfully", "success");
                } else {
                  const res = await api.post(`/company-admin/loads/${loadIdToUse}/stops`, newStopData);
                  const createdStop = res.data?.data || res.data;
                  if (createdStop) {
                    setStopsList(prev => [
                      ...prev,
                      {
                        id: createdStop.id || prev.length + 1,
                        rawId: createdStop.rawId || createdStop.id,
                        type: String(createdStop.type || stopForm.type || 'PICKUP'),
                        typeColor: createdStop.typeColor || (stopForm.type === 'PICKUP' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'),
                        address: String(createdStop.address || stopForm.address || ''),
                        contactName: String(createdStop.contactName || stopForm.contactName || '—'),
                        contactPhone: String(createdStop.contactPhone || stopForm.contactPhone || '—'),
                        date: String(createdStop.date || (createdStop.scheduledDate ? new Date(createdStop.scheduledDate).toLocaleDateString('en-GB') : (stopForm.date?.split('-').reverse().join('/') || new Date().toLocaleDateString('en-GB')))),
                        time: String(createdStop.time || stopForm.time || '09:00 AM'),
                        instructions: String(createdStop.instructions || stopForm.instructions || ''),
                        completed: !!createdStop.completed
                      }
                    ]);
                    triggerToast("New stop added successfully!", "success");
                  }
                }
              } catch (err) {
                console.error("Error saving stop via API, using local fallback:", err);
                if (editingStop) {
                  setStopsList(prev => prev.map(s => s.id === editingStop.id ? {
                    ...s,
                    ...newStopData,
                    date: stopForm.date?.split('-').reverse().join('/') || s.date
                  } : s));
                } else {
                  setStopsList(prev => [...prev, {
                    id: prev.length ? Math.max(...prev.map(s=>s.id)) + 1 : 1,
                    ...newStopData,
                    date: stopForm.date?.split('-').reverse().join('/') || '',
                    completed: false
                  }]);
                }
                triggerToast("Stop added locally", "info");
              } finally {
                setShowStopModal(false);
              }
            }}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Stop Type</label>
                  <select value={stopForm.type} onChange={e => setStopForm({...stopForm, type: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer">
                    <option>PICKUP</option>
                    <option>DROP-OFF</option>
                    <option>REST STOP</option>
                    <option>WEIGH STATION</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Address / Location</label>
                  <input value={stopForm.address} onChange={e => setStopForm({...stopForm, address: e.target.value})} type="text" required placeholder="Enter full stop address or location name..." className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Scheduled Date</label>
                    <input value={stopForm.date} onChange={e => setStopForm({...stopForm, date: e.target.value})} type="date" required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Scheduled Time</label>
                    <input value={stopForm.time} onChange={e => setStopForm({...stopForm, time: e.target.value})} type="time" required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Primary Contact</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={stopForm.contactName} onChange={e => setStopForm({...stopForm, contactName: e.target.value})} type="text" placeholder="Contact Name" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500" />
                    <input value={stopForm.contactPhone} onChange={e => setStopForm({...stopForm, contactPhone: e.target.value})} type="text" placeholder="Phone Number" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Special Instructions (Optional)</label>
                  <textarea value={stopForm.instructions} onChange={e => setStopForm({...stopForm, instructions: e.target.value})} rows="2" placeholder="e.g. Call 30 mins prior to arrival..." className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 resize-none"></textarea>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowStopModal(false)} 
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                >
                  {editingStop ? 'Save Changes' : 'Add Stop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Expense Modal ────────────────────────────── */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 pt-16 pb-6 z-[999999] animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-[400px] overflow-hidden flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-950">Add Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const type = formData.get('type') || 'Other';
              const desc = formData.get('desc') || 'New Expense';
              const amount = parseFloat(formData.get('amount') || 0);
              const date = formData.get('date') || new Date().toISOString().split('T')[0];

              try {
                const loadIdToUse = currentLoad?.rawId || currentLoad?.id;
                const res = await api.post(`/company-admin/loads/${loadIdToUse}/expenses`, {
                  type,
                  desc,
                  amount,
                  date
                });
                const createdExp = res.data?.data || res.data;
                if (createdExp) {
                  setExpensesList(prev => [createdExp, ...prev]);
                  triggerToast("Expense saved successfully to database!", "success");
                }
              } catch (err) {
                console.error("Error saving expense via API, using local fallback:", err);
                const newExpense = {
                  id: 'EXP-' + Math.floor(100 + Math.random() * 900),
                  date: date.split('-').reverse().join('/'),
                  type,
                  desc,
                  amount: `$${amount.toFixed(2)}`,
                  status: 'Pending',
                  color: 'bg-amber-50 text-amber-700'
                };
                setExpensesList(prev => [newExpense, ...prev]);
                triggerToast("Expense added locally", "info");
              } finally {
                setShowExpenseModal(false);
              }
            }}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Expense Type</label>
                  <select name="type" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer">
                    <option>Fuel</option>
                    <option>Toll</option>
                    <option>Meals</option>
                    <option>Maintenance</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
                  <input name="desc" type="text" placeholder="e.g. BP Service Station" required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Amount ($)</label>
                    <input name="amount" type="number" step="0.01" placeholder="0.00" required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Date</label>
                    <input name="date" type="date" required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Upload Receipt</label>
                  <label className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer">
                    <input type="file" name="receipt" className="hidden" accept="image/*,.pdf" onChange={(e) => {
                      if(e.target.files[0]) e.target.nextElementSibling.nextElementSibling.innerText = e.target.files[0].name;
                    }} />
                    <Upload className="w-6 h-6 mb-2 text-slate-300" />
                    <span className="text-[10px] font-bold">Click to browse or drag file here</span>
                  </label>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Upload Document Modal ────────────────────────────── */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 pt-16 pb-6 z-[999999] animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-[400px] overflow-hidden flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-950">Upload Document</h3>
              <button onClick={() => setShowDocumentModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const docType = formData.get('type') || 'Bill of Lading (BOL)';
              const fileInput = formData.get('file');
              const fileName = fileInput && fileInput.name ? fileInput.name : `${docType.replace(/\s+/g, '_')}.pdf`;
              const fileSize = fileInput && fileInput.size ? `${(fileInput.size / 1024).toFixed(0)} KB` : '1.2 MB';

              try {
                const loadIdToUse = currentLoad?.rawId || currentLoad?.id;
                const res = await api.post(`/company-admin/loads/${loadIdToUse}/documents`, {
                  documentType: docType,
                  fileName: fileName
                });
                const createdDoc = res.data?.data || res.data;
                if (createdDoc) {
                  setDocumentsList(prev => [createdDoc, ...prev]);
                }
              } catch (err) {
                console.error("Error uploading document via API, updating local state:", err);
                const fallbackDoc = {
                  id: Date.now().toString(),
                  name: fileName,
                  type: docType,
                  size: fileSize,
                  date: new Date().toLocaleDateString('en-GB')
                };
                setDocumentsList(prev => [fallbackDoc, ...prev]);
              } finally {
                setShowDocumentModal(false);
              }
            }}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Document Type</label>
                  <select name="type" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer">
                    <option>Bill of Lading (BOL)</option>
                    <option>Consignment Note</option>
                    <option>Weighbridge Ticket</option>
                    <option>Customs Declaration</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">File</label>
                  <label className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer">
                    <input type="file" name="file" className="hidden" accept=".pdf,image/*" onChange={(e) => {
                      if(e.target.files[0]) e.target.nextElementSibling.nextElementSibling.innerText = e.target.files[0].name;
                    }} />
                    <Upload className="w-8 h-8 mb-3 text-slate-300" />
                    <span className="text-xs font-bold text-slate-700 mb-1">Select a PDF or Image file</span>
                    <span className="text-[10px] font-semibold">Max file size: 10MB</span>
                  </label>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowDocumentModal(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer">Upload File</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Generate Invoice Modal ────────────────────────────── */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 pt-16 pb-6 z-[999999] animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-[450px] overflow-hidden flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-950">Generate Invoice</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 mb-2">Review details before generating the final invoice. Unbilled items and expenses will be included.</p>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Bill To Customer</label>
                <input 
                  type="text" 
                  value={currentLoad?.customer?.name || (typeof currentLoad?.customer === 'string' ? currentLoad.customer : '') || 'General Customer'} 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none" 
                  readOnly 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Load Subtotal</label>
                  <input 
                    type="text" 
                    value={`$${invoiceSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none" 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Billable Expenses</label>
                  <input 
                    type="text" 
                    value={`$${invoiceExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none" 
                    readOnly 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Invoice Due Date</label>
                <select 
                  value={invoiceDueDate}
                  onChange={(e) => setInvoiceDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Net 7 (7 days)">Net 7 (7 days)</option>
                  <option value="Net 14 (14 days)">Net 14 (14 days)</option>
                  <option value="Net 30 (30 days)">Net 30 (30 days)</option>
                </select>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl mt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700">Total Invoice Amount</span>
                <span className="text-base font-black text-indigo-700">
                  ${invoiceTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowInvoiceModal(false)} 
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleGenerateInvoice}
                disabled={isGeneratingInvoice}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isGeneratingInvoice ? 'Generating...' : 'Generate & Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview Modal ────────────────────────────── */}
      {previewItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 pt-16 pb-6 z-[999999] animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-950">{previewItem.type} Preview</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{previewItem.title}</p>
              </div>
              <button onClick={() => setPreviewItem(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center justify-center bg-slate-50 min-h-[300px]">
              {previewItem.image ? (
                <img src={previewItem.image} alt={previewItem.title} className="max-h-[400px] object-contain rounded-xl shadow-sm border border-slate-200" />
              ) : (
                <>
                  <FileText className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-sm font-bold text-slate-700 mb-1">{previewItem.title}</p>
                  {previewItem.desc && <p className="text-xs text-slate-500 mb-2">{previewItem.desc}</p>}
                  {previewItem.amount && <p className="text-lg font-black text-indigo-600 mt-2">{previewItem.amount}</p>}
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">Document Viewer Placeholder</p>
                </>
              )}
            </div>
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setPreviewItem(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">Close Preview</button>
              <button onClick={() => { handleDownload(previewItem.title); setPreviewItem(null); }} className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2 cursor-pointer">
                <Download size={14}/> Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Load Modal ────────────────────────────────────────── */}
      {showEditLoadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 pt-16 pb-6 z-[999999] animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Load Details</h3>
                  <p className="text-[11px] font-medium text-slate-400">Update configuration for Load {currentLoad.id}</p>
                </div>
              </div>
              <button onClick={() => setShowEditLoadModal(false)} className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                if (currentLoad.rawId) {
                  await api.put(`/company-admin/loads/${currentLoad.rawId}`, {
                    type: editFormData.type,
                    status: editFormData.status,
                    priority: editFormData.priority,
                    notes: editFormData.notes
                  });
                }
              } catch (err) { console.error(err); }
              setCurrentLoad(prev => ({
                ...prev,
                customer: editFormData.customer,
                type: editFormData.type,
                priority: editFormData.priority,
                status: editFormData.status,
                notes: editFormData.notes
              }));
              setShowEditLoadModal(false);
              triggerToast(`Load ${currentLoad.id} details updated successfully!`);
            }} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Booking Customer</label>
                <input 
                  type="text"
                  value={editFormData.customer}
                  onChange={(e) => setEditFormData({ ...editFormData, customer: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Load Type</label>
                  <select 
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option>Car Carrying</option>
                    <option>General Freight</option>
                    <option>Dangerous Goods</option>
                    <option>Refrigerated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Priority</label>
                  <select 
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Status</label>
                <select 
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="ACTIVE">IN PROGRESS (ACTIVE)</option>
                  <option value="PLANNED">PLANNED</option>
                  <option value="ON HOLD">ON HOLD</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Load Notes / Special Instructions</label>
                <textarea 
                  rows={3}
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowEditLoadModal(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reassign Driver & Fleet Modal ────────────────────────────── */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 pt-16 pb-6 z-[999999] animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reassign Driver &amp; Vehicle</h3>
                  <p className="text-[11px] font-medium text-slate-400">Reassign active load {currentLoad.id} to new driver or truck</p>
                </div>
              </div>
              <button onClick={() => setShowReassignModal(false)} className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const selectedD = dbDrivers.find(d => `${d.firstName} ${d.lastName}`.trim() === reassignForm.driverName) || { firstName: reassignForm.driverName, lastName: '', userCode: 'DRV-101' };
              const selectedV = dbVehicles.find(v => (v.rego || v.code) === reassignForm.truckId);
              try {
                if (currentLoad.rawId) {
                  await api.put(`/company-admin/loads/${currentLoad.rawId}`, {
                    driverId: selectedD.id || undefined,
                    truckId: selectedV?.id || undefined,
                    dispatchNotes: reassignForm.notes
                  });
                }
              } catch (err) { console.error(err); }

              setActiveDriver({
                name: `${selectedD.firstName || ''} ${selectedD.lastName || ''}`.trim() || reassignForm.driverName,
                code: selectedD.userCode || 'DRV-101',
                phone: selectedD.phone || '—',
                license: 'MC License',
                diary: '08:00 / 17:00',
                avatar: selectedD.avatarUrl || 'https://i.pravatar.cc/150?u=10'
              });

              setActiveTruck({
                id: selectedV?.rego || reassignForm.truckId,
                name: selectedV ? `${selectedV.make || ''} ${selectedV.model || ''}`.trim() : 'Volvo FH 540',
                odo: '— KM',
                trailer: reassignForm.trailer,
                rego: selectedV?.rego || 'REG-001'
              });

              setShowReassignModal(false);
              triggerToast(`Load ${currentLoad.id} reassigned to ${selectedD.firstName || reassignForm.driverName}!`);
            }} className="space-y-4">
              
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Assign Driver</label>
                <select 
                  value={reassignForm.driverName}
                  onChange={(e) => setReassignForm({ ...reassignForm, driverName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer"
                >
                  {dbDrivers.length > 0 ? (
                    dbDrivers.map(d => (
                      <option key={d.id} value={`${d.firstName} ${d.lastName}`}>
                        {d.firstName} {d.lastName} ({d.userCode || 'DRV'} - {d.licenseType || 'MC License'})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Mike Thompson">Mike Thompson (DRV001 - MC License)</option>
                      <option value="Sarah Mitchell">Sarah Mitchell (DRV002 - HC License)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Truck / Vehicle</label>
                  <select 
                    value={reassignForm.truckId}
                    onChange={(e) => setReassignForm({ ...reassignForm, truckId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    {dbVehicles.length > 0 ? (
                      dbVehicles.map(v => (
                        <option key={v.id} value={v.rego || v.code || v.id}>
                          {v.rego || v.code} | {v.make || ''} {v.model || 'Heavy Vehicle'}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="TRK-101">TRK-101 | Volvo FH 540</option>
                        <option value="TRK-220">TRK-220 | Scania T500</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Trailer</label>
                  <select 
                    value={reassignForm.trailer}
                    onChange={(e) => setReassignForm({ ...reassignForm, trailer: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="TRL-201 | 8 Car Carrier">TRL-201 | 8 Car Carrier</option>
                    <option value="TRL-202 | Flatbed B-Double">TRL-202 | Flatbed B-Double</option>
                    <option value="TRL-203 | Enclosed Carrier">TRL-203 | Enclosed Carrier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Reassignment Notes / Dispatch Reason</label>
                <textarea 
                  rows={2}
                  placeholder="Optional notes for driver notify..."
                  value={reassignForm.notes}
                  onChange={(e) => setReassignForm({ ...reassignForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowReassignModal(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" /> Confirm Reassign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Toast Notification Banner ────────────────────────────────────────── */}
      {toastNotification && (
        <div className="fixed bottom-5 right-5 z-[999999] flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 animate-fadeIn">
          {toastNotification.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : toastNotification.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-bold">{toastNotification.msg}</span>
          <button onClick={() => setToastNotification(null)} className="ml-2 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>

    </div>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const LOADS = [
  {
    id: 'PO-12546', date: '2025-07-15', starred: true, status: 'ACTIVE', statusSub: 'En Route',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'ABC Motors Pty Ltd',
    from: 'Melbourne', to: 'Brisbane', stops: 4,
    driver: 'Mike Thompson', truck: 'TRK-1401 | Scania T500', driverBadge: 'On The Road', driverStatus: 'text-emerald-500',
    avatar: 'https://i.pravatar.cc/150?u=10'
  },
  {
    id: 'PO-12545', date: '2025-07-15', starred: false, status: 'PLANNED', statusSub: 'Ready',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Global Retail Group',
    from: 'Sydney', to: 'Adelaide', stops: 3,
    driver: 'John Smith', truck: 'TRK-205 | Kenworth T88', driverBadge: 'Ready', driverStatus: 'text-blue-500',
    avatar: 'https://i.pravatar.cc/150?u=11'
  },
  {
    id: 'PO-12544', date: '2025-07-15', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Luxury Auto Imports',
    from: 'Perth', to: 'Melbourne', stops: 2,
    driver: null, truck: null, driverBadge: null, driverStatus: null,
    avatar: null
  },
  {
    id: 'PO-12543', date: '2025-07-16', starred: false, status: 'ACTIVE', statusSub: 'At Stop 2',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Cars R Us',
    from: 'Melbourne', to: 'Sydney', stops: 5,
    driver: 'David Wilson', truck: 'TRK-310 | Scania T500', driverBadge: 'On The Road', driverStatus: 'text-emerald-500',
    avatar: 'https://i.pravatar.cc/150?u=12'
  },
  {
    id: 'PO-12542', date: '2025-07-16', starred: false, status: 'COMPLETED', statusSub: 'Delivered',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'BuildCo Supplies',
    from: 'Brisbane', to: 'Gold Coast', stops: 2,
    driver: 'Mark Davis', truck: 'TRK-150 | Scania T500', driverBadge: 'Completed', driverStatus: 'text-slate-500',
    avatar: 'https://i.pravatar.cc/150?u=13'
  },
  {
    id: 'PO-12541', date: '2025-07-16', starred: false, status: 'CANCELLED', statusSub: 'Cancelled',
    type: 'Dangerous Goods', typeIcon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />,
    customer: 'ChemSafe Solutions',
    from: 'Sydney', to: 'Newcastle', stops: 4,
    driver: null, truck: null, driverBadge: null, driverStatus: null,
    avatar: null
  },
  {
    id: 'PO-12540', date: '2025-07-17', starred: false, status: 'PLANNED', statusSub: 'Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Premium Motors',
    from: 'Adelaide', to: 'Melbourne', stops: 3,
    driver: 'Sarah Mitchell', truck: 'TRK-220 | Scania T500', driverBadge: 'Ready', driverStatus: 'text-blue-500',
    avatar: 'https://i.pravatar.cc/150?u=14'
  },
  {
    id: 'PO-12539', date: '2025-07-17', starred: false, status: 'ACTIVE', statusSub: 'En Route',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'National Foods',
    from: 'Melbourne', to: 'Sydney', stops: 4,
    driver: 'Chris Lee', truck: 'TRK-330 | Scania T540', driverBadge: 'On The Road', driverStatus: 'text-emerald-500',
    avatar: 'https://i.pravatar.cc/150?u=15'
  },
  {
    id: 'PO-12538', date: '2025-07-17', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'ABC Motors Pty Ltd',
    from: 'Melbourne', to: 'Brisbane', stops: 4,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12537', date: '2025-07-18', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Global Retail Group',
    from: 'Sydney', to: 'Adelaide', stops: 3,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12536', date: '2025-07-18', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Dangerous Goods', typeIcon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />,
    customer: 'Luxury Auto Imports',
    from: 'Perth', to: 'Melbourne', stops: 2,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12535', date: '2025-07-18', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Cars R Us',
    from: 'Melbourne', to: 'Sydney', stops: 5,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12534', date: '2025-07-19', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'BuildCo Supplies',
    from: 'Brisbane', to: 'Gold Coast', stops: 2,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12533', date: '2025-07-19', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Dangerous Goods', typeIcon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />,
    customer: 'ChemSafe Solutions',
    from: 'Sydney', to: 'Newcastle', stops: 4,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12532', date: '2025-07-19', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Premium Motors',
    from: 'Adelaide', to: 'Melbourne', stops: 3,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12531', date: '2025-07-20', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'National Foods',
    from: 'Melbourne', to: 'Brisbane', stops: 4,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12530', date: '2025-07-20', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Dangerous Goods', typeIcon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />,
    customer: 'Pioneer Logistics',
    from: 'Sydney', to: 'Adelaide', stops: 3,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12529', date: '2025-07-20', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'Apex Warehousing',
    from: 'Perth', to: 'Melbourne', stops: 2,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12528', date: '2025-07-21', starred: false, status: 'DRAFT', statusSub: 'Not Ready',
    type: 'General Freight', typeIcon: <Package className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'ABC Motors Pty Ltd',
    from: 'Melbourne', to: 'Sydney', stops: 4,
    driver: null, truck: null, driverBadge: null, driverStatus: null, avatar: null
  },
  {
    id: 'PO-12527', date: '2025-07-21', starred: false, status: 'PLANNED', statusSub: 'Ready',
    type: 'Car Carrying', typeIcon: <Truck className="w-3.5 h-3.5 text-blue-500" />,
    customer: 'ABC Motors Pty Ltd',
    from: 'Melbourne', to: 'Brisbane', stops: 4,
    driver: 'Mike Thompson', truck: 'TRK-1401 | Scania T500', driverBadge: 'Ready', driverStatus: 'text-blue-500',
    avatar: 'https://i.pravatar.cc/150?u=10'
  },
];

const STATUS_STYLES = {
  'ACTIVE':    { badge: 'bg-emerald-100 text-emerald-700', sub: 'text-emerald-600' },
  'PLANNED':   { badge: 'bg-blue-100 text-blue-700',       sub: 'text-blue-600'   },
  'DRAFT':     { badge: 'bg-slate-100 text-slate-600',     sub: 'text-slate-500'  },
  'COMPLETED': { badge: 'bg-emerald-50 text-emerald-600',   sub: 'text-emerald-500' },
  'CANCELLED': { badge: 'bg-rose-50 text-rose-600',       sub: 'text-rose-500'   },
};

const computeTabs = (data) => [
  { label: 'All Loads', count: data.length, status: 'ALL' },
  { label: 'Draft',     count: data.filter(d => d.status === 'DRAFT').length, status: 'DRAFT' },
  { label: 'Planned',   count: data.filter(d => d.status === 'PLANNED').length, status: 'PLANNED' },
  { label: 'Active',    count: data.filter(d => d.status === 'ACTIVE').length, status: 'ACTIVE' },
  { label: 'Completed', count: data.filter(d => d.status === 'COMPLETED').length, status: 'COMPLETED' },
  { label: 'Cancelled', count: data.filter(d => d.status === 'CANCELLED').length, status: 'CANCELLED' },
];

const ALERTS = [
  { id:'PO-12543', color:'bg-rose-500', iconColor: 'text-white', msg:'Delay risk: Traffic congestion on M1 - ETA may be affected', time:'5m ago' },
  { id:'PO-12544', color:'bg-amber-100', iconColor: 'text-amber-500',  msg:'Missing documents: POD required before dispatch',            time:'15m ago'},
  { id:'PO-12545', color:'bg-blue-100', iconColor: 'text-blue-500', msg:'Driver break in 30 min',                                time:'1h ago' },
];

const PAGE_SIZE = 20;

export default function Loads() {
  const location = useLocation();
  const [activeTab,   setActiveTab  ] = useState(0);
  const [search,      setSearch     ] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu,    setOpenMenu   ] = useState(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(location.state?.openNewLoadModal || false);
  const [showAILoadBuilder, setShowAILoadBuilder] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [customerFilter, setCustomerFilter] = useState('All Customer');
  const [driverFilter, setDriverFilter] = useState('All Drivers');
  const [vehicleFilter, setVehicleFilter] = useState('All Vehicles');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [sortBy, setSortBy] = useState('NEWEST');
  const [groupBy, setGroupBy] = useState('NONE');
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [showGroupByModal, setShowGroupByModal] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [showMoreFiltersDrawer, setShowMoreFiltersDrawer] = useState(false);

  const handleResetAllFilters = () => {
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setStatusFilter('All Status');
    setTypeFilter('All Types');
    setCustomerFilter('All Customer');
    setDriverFilter('All Drivers');
    setVehicleFilter('All Vehicles');
    setLocationFilter('All Locations');
    setSortBy('NEWEST');
    setGroupBy('NONE');
    setCurrentPage(1);
    setShowMoreFiltersDrawer(false);
  };

  const [loadsList, setLoadsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const listToExport = filtered && filtered.length > 0 ? filtered : loadsList;
    if (!listToExport || listToExport.length === 0) {
      alert('No loads available to export.');
      return;
    }
    const headers = ['Load Ref', 'Date', 'Status', 'Load Type', 'Customer', 'Pickup Location', 'Dropoff Location', 'Driver', 'Truck'];
    const csvRows = listToExport.map(l => [
      `"${l.id || ''}"`,
      `"${l.date || ''}"`,
      `"${l.status || ''}"`,
      `"${l.type || ''}"`,
      `"${(l.customer || '').replace(/"/g, '""')}"`,
      `"${(l.from || '').replace(/"/g, '""')}"`,
      `"${(l.to || '').replace(/"/g, '""')}"`,
      `"${(l.driver || 'Unassigned').replace(/"/g, '""')}"`,
      `"${(l.truck || 'N/A').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `loads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        let importedLoads = [];

        if (file.name.endsWith('.json')) {
          importedLoads = JSON.parse(text);
        } else {
          const lines = text.split(/\r\n|\n/).filter(line => line.trim());
          if (lines.length > 1) {
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
              if (cols.length >= 2) {
                importedLoads.push({
                  type: cols[2] || 'General Freight',
                  notes: `Imported load from ${file.name}`
                });
              }
            }
          }
        }

        if (importedLoads.length > 0) {
          for (const item of importedLoads) {
            await api.post('/company-admin/loads', {
              type: item.type || 'General Freight',
              notes: item.notes || `Imported load from ${file.name}`
            }).catch(() => {});
          }
          alert(`Successfully imported ${importedLoads.length} load(s)!`);
          fetchLoads();
        } else {
          alert('No valid loads found in the selected file.');
        }
      } catch (err) {
        console.error('Import error:', err);
        alert('Failed to parse the imported file. Please upload a valid CSV or JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const fetchLoads = async () => {
    try {
      setLoading(true);
      const res = await api.get('/company-admin/loads');
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const mapped = res.data.data.map(item => {
          const firstPickup = item.stops?.find(s => s.type === 'PICKUP')?.address || (item.stops && item.stops[0]?.address) || '—';
          const firstDropoff = item.stops?.find(s => s.type === 'DROPOFF')?.address || (item.stops && item.stops[item.stops.length - 1]?.address) || '—';
          let displayStatus = item.status || 'DRAFT';
          if (displayStatus === 'IN_TRANSIT') displayStatus = 'ACTIVE';
          if (displayStatus === 'DELIVERED') displayStatus = 'COMPLETED';

          return {
            id: item.loadRef || item.id,
            rawId: item.id,
            date: item.loadDate ? new Date(item.loadDate).toISOString().split('T')[0] : (item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
            starred: item.starred || false,
            status: displayStatus,
            statusSub: item.dispatchNotes || item.notes || (displayStatus === 'ACTIVE' ? 'En Route' : displayStatus === 'PLANNED' ? 'Ready' : 'Not Ready'),
            type: item.type || 'General Freight',
            typeIcon: item.type === 'Car Carrying' ? <Truck className="w-3.5 h-3.5 text-blue-500" /> : <Package className="w-3.5 h-3.5 text-blue-500" />,
            customer: item.customer?.name || 'Direct Customer',
            from: firstPickup,
            to: firstDropoff,
            stops: Array.isArray(item.stops) ? item.stops.length : (item.stops || 0),
            stopsCount: Array.isArray(item.stops) ? item.stops.length : (item.stops || 0),
            driver: item.driver ? `${item.driver.firstName || ''} ${item.driver.lastName || ''}`.trim() : null,
            truck: item.truck ? `${item.truck.rego || item.truck.code || ''} | ${item.truck.model || ''}` : null,
            driverBadge: item.driver ? 'On The Road' : null,
            driverStatus: 'text-emerald-500',
            avatar: item.driver?.avatarUrl || 'https://i.pravatar.cc/150?u=10'
          };
        });
        setLoadsList(mapped);
      } else {
        setLoadsList([]);
      }
    } catch (e) {
      console.error('Fetch loads error:', e);
      setLoadsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, [showCreateForm, showAILoadBuilder]);

  if (selectedLoad) {
    return <LoadDetail load={selectedLoad} onBack={() => { setSelectedLoad(null); fetchLoads(); }} />;
  }

  if (showCreateForm) {
    return <CreateLoad onBack={() => { setShowCreateForm(false); fetchLoads(); }} />;
  }

  if (showAILoadBuilder) {
    return <AILoadBuilder onBack={() => { setShowAILoadBuilder(false); fetchLoads(); }} />;
  }

  const currentLoadsData = loadsList;
  const tabs = computeTabs(currentLoadsData);

  const filtered = currentLoadsData.filter(l => {
    const q = search.toLowerCase();
    const searchMatch = !q || l.id.toLowerCase().includes(q) || (l.customer || '').toLowerCase().includes(q)
      || (l.driver || '').toLowerCase().includes(q) || l.from.toLowerCase().includes(q) || l.to.toLowerCase().includes(q);

    const tabStatus = tabs[activeTab].status;
    const tabMatch = tabStatus === 'ALL' || l.status === tabStatus;

    const statusMatch = statusFilter === 'All Status' || l.status === statusFilter;
    const typeMatch = typeFilter === 'All Types' || l.type === typeFilter;
    const customerMatch = customerFilter === 'All Customer' || l.customer === customerFilter;
    const driverMatch = driverFilter === 'All Drivers' || l.driver === driverFilter;
    const vehicleMatch = vehicleFilter === 'All Vehicles' || (l.truck && l.truck.includes(vehicleFilter));
    const locationMatch = locationFilter === 'All Locations' || l.from === locationFilter || l.to === locationFilter;
    
    const dateMatch = (!dateFrom || (l.date && l.date >= dateFrom)) && (!dateTo || (l.date && l.date <= dateTo));

    return searchMatch && tabMatch && statusMatch && typeMatch && customerMatch && driverMatch && vehicleMatch && locationMatch && dateMatch;
  });

  const PIE_DATA = [
    { name: 'Active',    value: filtered.filter(d => d.status === 'ACTIVE').length, color: '#10b981' },
    { name: 'Planned',   value: filtered.filter(d => d.status === 'PLANNED').length, color: '#3b82f6' },
    { name: 'Draft',     value: filtered.filter(d => d.status === 'DRAFT').length, color: '#94a3b8' },
    { name: 'Completed', value: filtered.filter(d => d.status === 'COMPLETED').length, color: '#14b8a6' },
    { name: 'Cancelled', value: filtered.filter(d => d.status === 'CANCELLED').length, color: '#ef4444' },
  ];

  const sortedFiltered = [...filtered].sort((a, b) => {
    if (sortBy === 'OLDEST') return new Date(a.date || 0) - new Date(b.date || 0);
    if (sortBy === 'CUSTOMER') return (a.customer || '').localeCompare(b.customer || '');
    if (sortBy === 'STATUS') return (a.status || '').localeCompare(b.status || '');
    if (sortBy === 'TYPE') return (a.type || '').localeCompare(b.type || '');
    return new Date(b.date || 0) - new Date(a.date || 0);
  });

  const totalPages = Math.ceil(sortedFiltered.length / PAGE_SIZE) || 1;
  const paged = sortedFiltered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleRow = (id) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const allChecked = selectedIds.length === paged.length && paged.length > 0;

  return (
    <div className="flex-grow bg-[#F8FAFC] w-full font-sans overflow-hidden flex flex-col min-h-0">
      
      {/* ════ HEADER (Full Width) ════════════════════════════ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 sm:px-6 pt-4 sm:pt-6 pb-2 shrink-0 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight leading-none mb-2">Loads</h1>
          <p className="text-xs sm:text-[13px] font-medium text-slate-500">Manage and track all loads in your operation</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          {/* Secondary Actions (Import, Export, More) */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <input 
              type="file" 
              ref={fileInputRef} 
              accept=".csv, .json, .txt" 
              onChange={handleFileImport} 
              className="hidden" 
            />
            <button 
              onClick={handleImportClick}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <span className="text-slate-400 text-base leading-none">•</span> Import
            </button>
            <button 
              onClick={handleExport}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <span className="text-slate-400 text-base leading-none">•</span> Export
            </button>
            <div className="relative shrink-0">
              <button 
                onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
                className="flex items-center justify-center w-9 h-9 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors shrink-0"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {headerMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                  <button className="w-full text-left px-4 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">Archive Selected</button>
                  <button className="w-full text-left px-4 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">Print Manifest</button>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button className="w-full text-left px-4 py-2 text-[13px] font-semibold text-red-500 hover:bg-slate-50">Delete Loads</button>
                </div>
              )}
            </div>
          </div>

          {/* Primary Action Buttons (AI Loads & New Load) */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial w-full sm:w-auto">
            <button 
              onClick={() => setShowAILoadBuilder(true)}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors shadow-sm whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" /> AI Loads / Inbox
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-3.5 py-2 bg-[#FFCC00] hover:bg-[#FACC15] rounded-xl text-xs font-bold text-black transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3px] shrink-0" /> New Load
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* ════ LEFT: Main ════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 pt-2 pb-0">

          {/* Tabs */}
          <div className="flex items-center gap-2.5 mb-6 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => { setActiveTab(i); setCurrentPage(1); }}
                className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-[12px] font-bold whitespace-nowrap transition-all ${
                  activeTab === i
                    ? 'bg-indigo-50/50 border-indigo-200 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                  activeTab === i
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}>{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Filter Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm mb-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex-1 min-w-[180px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search loads..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:border-indigo-500 cursor-pointer" title="From Date"/>
                <span className="text-slate-400 text-xs font-bold">to</span>
                <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setCurrentPage(1); }} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:border-indigo-500 cursor-pointer" title="To Date"/>
              </div>

              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:border-indigo-500 cursor-pointer min-w-[120px]">
                <option>All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PLANNED">Planned</option>
                <option value="DRAFT">Draft</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              {/* More Filters Drawer */}
              {(() => {
                const activeCount = [
                  typeFilter !== 'All Types', 
                  customerFilter !== 'All Customer', 
                  driverFilter !== 'All Drivers', 
                  vehicleFilter !== 'All Vehicles', 
                  locationFilter !== 'All Locations'
                ].filter(Boolean).length;

                return (
                  <div className="relative">
                    <button 
                      onClick={() => setShowMoreFiltersDrawer(!showMoreFiltersDrawer)}
                      className={`px-3.5 py-2 border rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors shadow-2xs ${
                        activeCount > 0 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Filter className="w-3.5 h-3.5 text-indigo-600" /> More Filters
                      {activeCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black">{activeCount}</span>
                      )}
                    </button>

                    {showMoreFiltersDrawer && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowMoreFiltersDrawer(false)} />
                        <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-4 space-y-3.5 animate-in fade-in zoom-in-95 text-left">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                            <div className="flex items-center gap-2">
                              <Filter className="w-4 h-4 text-indigo-600" />
                              <span className="text-xs font-bold text-slate-900">Advanced Filters</span>
                            </div>
                            <button onClick={handleResetAllFilters} className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer">Reset All</button>
                          </div>

                          <div className="space-y-3 text-xs">
                            {/* Load Type */}
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Load Type</label>
                              <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer">
                                <option>All Types</option>
                                <option value="General Freight">General Freight</option>
                                <option value="Car Carrying">Car Carrying</option>
                                <option value="Dangerous Goods">Dangerous Goods</option>
                              </select>
                            </div>

                            {/* Customer */}
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Customer</label>
                              <select value={customerFilter} onChange={e => { setCustomerFilter(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer">
                                <option>All Customer</option>
                                {[...new Set(LOADS.map(l => l.customer).filter(Boolean))].map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>

                            {/* Assigned Driver */}
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Assigned Driver</label>
                              <select value={driverFilter} onChange={e => { setDriverFilter(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer">
                                <option>All Drivers</option>
                                {[...new Set(LOADS.map(l => l.driver).filter(Boolean))].map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                            </div>

                            {/* Vehicle */}
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Vehicle / Fleet</label>
                              <select value={vehicleFilter} onChange={e => { setVehicleFilter(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer">
                                <option>All Vehicles</option>
                                {[...new Set(LOADS.map(l => l.truck).filter(Boolean).map(t => t.split(' | ')[0]))].map(v => <option key={v} value={v}>{v}</option>)}
                              </select>
                            </div>

                            {/* Location */}
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">Location / Route</label>
                              <select value={locationFilter} onChange={e => { setLocationFilter(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer">
                                <option>All Locations</option>
                                {[...new Set([...LOADS.map(l => l.from), ...LOADS.map(l => l.to)].filter(Boolean))].map(loc => <option key={loc} value={loc}>{loc}</option>)}
                              </select>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100">
                            <button onClick={() => setShowMoreFiltersDrawer(false)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm">Done</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

            </div>
          </div>



          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 mt-4 gap-2">
            <p className="text-[11px] font-semibold text-slate-500">{sortedFiltered.length} loads found</p>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              
              {/* Columns Selector */}
              <div className="relative flex-1 sm:flex-none">
                <button 
                  onClick={() => setShowColumnsModal(!showColumnsModal)}
                  className="w-full sm:w-auto justify-center flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <MoreVertical className="w-3 h-3" /> Columns
                </button>
                {showColumnsModal && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowColumnsModal(false)} />
                    <div className="absolute right-0 sm:left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visible Columns</p>
                      {['STATUS', 'LOAD TYPE', 'CUSTOMER', 'ROUTE', 'DRIVER / TRUCK', 'PICKUP DATE', 'ETA / DELIVERY', 'PROGRESS'].map(col => (
                        <label key={col} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={!hiddenColumns.includes(col)}
                            onChange={() => {
                              setHiddenColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
                            }}
                            className="w-3.5 h-3.5 rounded border-slate-300 accent-indigo-600 cursor-pointer"
                          />
                          {col}
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Group By Selector */}
              <div className="relative flex-1 sm:flex-none">
                <button 
                  onClick={() => setShowGroupByModal(!showGroupByModal)}
                  className={`w-full sm:w-auto justify-center flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                    groupBy !== 'NONE' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Group By: {groupBy === 'NONE' ? 'None' : groupBy}
                </button>
                {showGroupByModal && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowGroupByModal(false)} />
                    <div className="absolute right-0 sm:left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 divide-y divide-slate-100">
                      <button onClick={() => { setGroupBy('NONE'); setShowGroupByModal(false); }} className="w-full text-left px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 cursor-pointer">None (Flat Table)</button>
                      <button onClick={() => { setGroupBy('STATUS'); setShowGroupByModal(false); }} className="w-full text-left px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 cursor-pointer">Group by Status</button>
                      <button onClick={() => { setGroupBy('CUSTOMER'); setShowGroupByModal(false); }} className="w-full text-left px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 cursor-pointer">Group by Customer</button>
                      <button onClick={() => { setGroupBy('TYPE'); setShowGroupByModal(false); }} className="w-full text-left px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 cursor-pointer">Group by Load Type</button>
                    </div>
                  </>
                )}
              </div>

              {/* Sort By Select */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="NEWEST">Sort By: Created Date (Newest)</option>
                <option value="OLDEST">Sort By: Created Date (Oldest)</option>
                <option value="CUSTOMER">Sort By: Customer Name (A-Z)</option>
                <option value="STATUS">Sort By: Status</option>
                <option value="TYPE">Sort By: Load Type</option>
              </select>

            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left min-w-[900px]" style={{ minWidth: 900 }}>
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    <th className="px-4 py-3 w-8">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={() => setSelectedIds(allChecked ? [] : paged.map(l => l.id))}
                        className="w-3.5 h-3.5 rounded border-slate-300 accent-indigo-600"
                      />
                    </th>
                    {['LOAD REF', 'STATUS', 'LOAD TYPE', 'CUSTOMER', 'ROUTE', 'DRIVER / TRUCK', 'PICKUP DATE', 'ETA / DELIVERY', 'PROGRESS', 'ACTIONS'].filter(h => !hiddenColumns.includes(h)).map(h => (
                      <th key={h} className="px-3 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-slate-500 text-[12px] font-semibold whitespace-nowrap">No loads found matching filters.</td>
                    </tr>
                  ) : null}
                  {paged.map((load, i) => {
                    const st = STATUS_STYLES[load.status] || STATUS_STYLES.DRAFT;
                    const isSelected = selectedIds.includes(load.id);
                    return (
                      <tr
                        key={i}
                        onClick={() => setSelectedLoad(load)}
                        className={`transition-colors group cursor-pointer ${isSelected ? 'bg-indigo-50/40' : 'hover:bg-blue-50/30'}`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(load.id)}
                            className="w-3.5 h-3.5 rounded border-slate-300 accent-indigo-600"
                          />
                        </td>

                        {/* LOAD REF */}
                        <td className="px-3 py-4 min-w-[140px] whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Star className={`w-4 h-4 ${load.starred ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} cursor-pointer hover:text-amber-400 transition-colors`} />
                            <span className="text-[12px] font-semibold text-blue-700 hover:underline cursor-pointer whitespace-nowrap">{load.id}</span>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-3 py-4 min-w-[120px] whitespace-nowrap">
                          <div className="flex flex-col items-start gap-1">
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${st.badge}`}>
                              {load.status}
                            </div>
                            <span className={`text-[11px] font-medium whitespace-nowrap ${st.sub}`}>{load.statusSub}</span>
                          </div>
                        </td>

                        {/* LOAD TYPE */}
                        <td className="px-3 py-4 min-w-[140px] whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center shrink-0">
                              {load.typeIcon}
                            </div>
                            <span className="text-[12px] font-medium text-slate-700 whitespace-nowrap">{load.type}</span>
                          </div>
                        </td>

                        {/* CUSTOMER */}
                        <td className="px-3 py-4 min-w-[140px] whitespace-nowrap">
                          <span className="text-[12px] font-semibold text-slate-900 whitespace-nowrap">{load.customer}</span>
                        </td>

                        {/* ROUTE */}
                        <td className="px-3 py-4 min-w-[120px] whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-[12px] font-semibold text-blue-700 whitespace-nowrap">{load.from}</span>
                            <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1 whitespace-nowrap">
                               → {load.to}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 mt-0.5 whitespace-nowrap">{Array.isArray(load.stops) ? load.stops.length : (load.stops || 0)} Stops</span>
                          </div>
                        </td>

                        {/* DRIVER / TRUCK */}
                        <td className="px-3 py-4 min-w-[180px] whitespace-nowrap">
                          {load.driver ? (
                            <div className="flex items-center gap-2.5">
                              <img src={load.avatar} alt={load.driver} className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0" />
                              <div className="flex flex-col">
                                <span className="text-[12px] font-bold text-slate-900 leading-tight whitespace-nowrap">{load.driver}</span>
                                <span className="text-[10px] font-medium text-slate-500 leading-tight whitespace-nowrap">{load.truck}</span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${load.driverBadge === 'On The Road' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                                    <span className={`text-[10px] font-medium whitespace-nowrap ${load.driverStatus}`}>{load.driverBadge}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[12px] font-bold text-slate-500 italic whitespace-nowrap">Not Assigned</span>
                          )}
                        </td>

                        {/* PICKUP DATE */}
                        <td className="px-3 py-4 min-w-[120px] whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-slate-700 whitespace-nowrap">{load.date ? load.date.split('-').reverse().join('/') : '08/07/2025'}</span>
                            <span className="text-[10px] font-medium text-slate-500 mt-0.5 whitespace-nowrap">09:00 AM</span>
                          </div>
                        </td>

                        {/* ETA / DELIVERY */}
                        <td className="px-3 py-4 min-w-[120px] whitespace-nowrap">
                          <span className="text-[12px] font-medium text-slate-700 whitespace-nowrap">-</span>
                        </td>

                        {/* PROGRESS */}
                        <td className="px-3 py-4 min-w-[120px] whitespace-nowrap">
                          <div className="flex flex-col gap-1.5 mt-1">
                            <span className="text-[10px] font-bold text-slate-700 leading-none whitespace-nowrap">0%</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 w-0"></div>
                            </div>
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-3 py-4 min-w-[140px] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 rounded-lg transition-colors">
                              <Eye className="w-3.5 h-3.5 text-indigo-600" />
                              <span className="text-[11px] font-bold text-indigo-600 whitespace-nowrap">View</span>
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-100 bg-white flex justify-between items-center">
              <span className="text-[11px] font-medium text-slate-600">
                Showing {Math.min(1, filtered.length)} to {Math.min(PAGE_SIZE, filtered.length)} of {filtered.length} loads
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[1, 2, '...', 7].map((pg, i) => (
                  <button
                    key={i}
                    onClick={() => typeof pg === 'number' && setCurrentPage(pg)}
                    className={`w-8 h-8 rounded text-[12px] font-semibold transition-colors border ${
                      currentPage === pg
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
                    } ${pg === '...' ? 'cursor-default' : ''}`}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <select className="ml-2 px-3 py-1.5 bg-white border border-slate-200 rounded text-[12px] font-semibold text-slate-600 focus:outline-none focus:border-indigo-500">
                  <option>20 per page</option>
                  <option>50 per page</option>
                  <option>100 per page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Action Bar */}
          <div className="mt-2 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <span className="text-[12px] font-semibold text-slate-900 px-2">{selectedIds.length} selected</span>
            <select className="px-4 py-2 bg-white border border-slate-200 rounded text-[12px] font-medium text-slate-700 focus:outline-none focus:border-indigo-500 w-full sm:w-48">
              <option>Bulk Actions</option>
              <option>Assign Driver</option>
              <option>Mark Completed</option>
              <option>Cancel Loads</option>
              <option>Export Selected</option>
            </select>
            <button className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[12px] rounded transition-colors shadow-sm">
              Apply
            </button>
          </div>
        </div>

        {/* ════ RIGHT: Sidebar ════════════════════════════ */}
        <div className="w-full lg:w-[280px] shrink-0 p-4 sm:p-6 lg:pt-2 lg:pl-0 flex flex-col gap-4">

          {/* Load Overview Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[13px] font-semibold text-slate-900 mb-0.5">Load Overview</h2>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-4">TODAY, {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}</p>
            <div className="space-y-4">
              {[
                { label: 'Total Loads',     value: filtered.length, icon: <Package    className="w-4 h-4 text-indigo-500"/>, color: 'bg-indigo-50'   },
                { label: 'Active Loads',    value: filtered.filter(f => f.status === 'ACTIVE' || f.status === 'IN_TRANSIT').length,  icon: <Activity   className="w-4 h-4 text-emerald-500"/>, color: 'bg-emerald-50'},
                { label: 'In Transit',      value: filtered.filter(f => f.status === 'ACTIVE' || f.status === 'IN_TRANSIT').length,  icon: <ArrowUpRight className="w-4 h-4 text-emerald-500"/>, color: 'bg-emerald-50'     },
                { label: 'At Stop',         value: filtered.filter(f => f.statusSub && f.statusSub.toLowerCase().includes('stop')).length,  icon: <MapPin      className="w-4 h-4 text-indigo-500"/>, color: 'bg-indigo-50'   },
                { label: 'Completed Today', value: filtered.filter(f => f.status === 'COMPLETED' || f.status === 'DELIVERED').length,   icon: <CheckCircle className="w-4 h-4 text-rose-500"/>,color: 'bg-rose-50' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="text-[13px] font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-[14px] font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[13px] font-semibold text-slate-900 mb-4">Status Breakdown</h2>
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PIE_DATA} innerRadius={45} outerRadius={60} paddingAngle={0} dataKey="value" stroke="none">
                      {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                  <span className="text-[22px] font-semibold text-slate-900 leading-none">{filtered.length}</span>
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-1">TOTAL</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {PIE_DATA.map((item, i) => {
                const pct = filtered.length > 0 ? ((item.value / filtered.length) * 100).toFixed(1) : 0;
                return (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}/>
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900">{item.value}</span>
                      <span className="text-[10px] font-medium text-slate-400">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Alerts Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[13px] font-semibold text-slate-900">Recent Alerts</h2>
              <button className="text-[10px] font-semibold text-indigo-600 hover:underline uppercase tracking-wider">VIEW ALL</button>
            </div>
            <div className="space-y-4">
              {filtered.filter(f => f.status === 'ACTIVE' || f.status === 'IN_TRANSIT').length === 0 ? (
                <p className="text-xs font-semibold text-slate-400 py-2">No active alerts</p>
              ) : (
                filtered.filter(f => f.status === 'ACTIVE' || f.status === 'IN_TRANSIT').slice(0, 3).map((a, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600"/>
                    </div>
                    <div>
                      <div className="flex justify-between items-baseline gap-2 mb-1">
                        <span className="text-[12px] font-semibold text-slate-900">{a.id}</span>
                        <span className="text-[10px] font-medium text-slate-500 shrink-0">Live</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 leading-snug">{a.customer} - En Route</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-6 py-2.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              View All Alerts
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
