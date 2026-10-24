import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import {
  Search, Plus, MapPin, Navigation, Bell, ArrowRight, User, ArrowLeft, ArrowUpRight,
  FileText, ChevronRight, MoreVertical, X, Calendar,
  ChevronDown, Globe, RotateCcw, Filter, Phone, Mail, Compass, Eye, Check, Clock, Truck, Box,
  Maximize2, Activity, Share2, Send, History, RefreshCw, ChevronLeft,
  Users, Container, Settings, Zap, Target, Info, Download, SlidersHorizontal, MessageSquare, ExternalLink,
  RefreshCcw, FileCheck, Layers, Package, Flag, Edit3, Trash2
} from 'lucide-react';
import L from 'leaflet';

export default function DispatcherLoads() {
  const location = useLocation();
  const isCreateLoadPage = location.pathname.includes('create-load');
  const pageTitle = isCreateLoadPage ? 'Create Load' : 'Active Loads';
  const pageSubtitle = isCreateLoadPage
    ? 'Create and dispatch new loads for your fleet.'
    : 'View and manage all loads that are currently in progress.';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState('All (63)');
  const [selectedLoadId, setSelectedLoadId] = useState('LD-10583');
  const [activeDetailsTab, setActiveDetailsTab] = useState('Overview');
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(true);
  const [isFullPageDetailsView, setIsFullPageDetailsView] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableTrailers, setAvailableTrailers] = useState([]);
  const [selectedAssignDriverId, setSelectedAssignDriverId] = useState('');
  const [selectedAssignVehicleId, setSelectedAssignVehicleId] = useState('');
  const [selectedAssignTrailerId, setSelectedAssignTrailerId] = useState('');

  // Dropdown 3-dot action menu state
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(isCreateLoadPage);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLoad, setEditingLoad] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingLoad, setViewingLoad] = useState(null);

  useEffect(() => {
    if (location.pathname.includes('create-load')) {
      setIsCreateModalOpen(true);
    }
  }, [location.pathname]);

  // Create Load Form Inputs State
  const [newLoadForm, setNewLoadForm] = useState({
    customer: '',
    customerId: '',   // DB ID for customer relation
    routeFrom: '',
    routeTo: '',
    driver: '',
    driverId: '',     // DB ID for driver assignment
    vehicle: '',
    vehicleId: '',    // DB ID for vehicle assignment
    trailerId: '',    // DB ID for trailer assignment
    trailer: '',
    status: 'Planned',
    reqDate: '',
    reqTime: ''
  });

  // Filter States
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [driverFilter, setDriverFilter] = useState('All Drivers');
  const [customerFilter, setCustomerFilter] = useState('All Customers');
  const [destinationFilter, setDestinationFilter] = useState('All Destinations');
  const [nicheFilter, setNicheFilter] = useState('All Types');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Any Date');
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [hiddenCols, setHiddenCols] = useState([]);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isSwapTrailerModalOpen, setIsSwapTrailerModalOpen] = useState(false);
  const [swapTrailerInput, setSwapTrailerInput] = useState('');
  const [swapSelectedTrailerId, setSwapSelectedTrailerId] = useState('');
  const [swapReason, setSwapReason] = useState('Breakdown / Roadside Failure');
  const [swapLocation, setSwapLocation] = useState('');
  const [isTransferLoadModalOpen, setIsTransferLoadModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  // Leaflet Map Ref for Details Drawer
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Master Active Loads State
  const [masterLoads, setMasterLoads] = useState([]);
  const [isLoadingLoads, setIsLoadingLoads] = useState(true);

  // Helper to read persistent deleted load IDs from localStorage
  const getDeletedLoadIds = () => {
    try {
      const saved = localStorage.getItem('dispatcher_deleted_load_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  };

  const fetchLoads = async () => {
    setIsLoadingLoads(true);
    try {
      const res = await api.get('/loads/active');
      const payload = res.data?.data || res.data || {};
      const apiLoads = payload.loads || (Array.isArray(payload) ? payload : []);

      if (Array.isArray(apiLoads)) {
        const deletedSet = getDeletedLoadIds();
        const filteredLoads = apiLoads.filter(item => !deletedSet.has(item.id) && !deletedSet.has(item.dbId));
        
        // Strictly sanitize loads so DRAFT / unassigned loads never show fake random drivers or trucks
        const sanitizedLoads = filteredLoads.map(item => {
          const raw = item.rawLoad || {};
          const isDraft = (item.status || raw.status || '').toUpperCase() === 'DRAFT';
          const hasRealDriver = Boolean(raw.driverId || raw.driver);
          const hasRealVehicle = Boolean(raw.truckId || raw.truck);

          const realDriver = hasRealDriver 
            ? (raw.driver ? `${raw.driver.firstName || ''} ${raw.driver.lastName || ''}`.trim() : item.driver)
            : 'Unassigned';

          const realVehicle = hasRealVehicle
            ? (raw.truck ? `${raw.truck.make || ''} ${raw.truck.model || ''}`.trim() : item.vehicle)
            : 'Unassigned';

          return {
            ...item,
            status: isDraft ? 'Draft' : item.status,
            statusStyle: isDraft ? 'bg-amber-50 text-amber-700 border-amber-300' : item.statusStyle,
            accentColor: isDraft ? 'border-l-amber-400' : item.accentColor,
            driver: realDriver,
            driverRole: realDriver === 'Unassigned' ? 'Not Assigned' : item.driverRole,
            driverStatus: realDriver === 'Unassigned' ? 'Unassigned' : item.driverStatus,
            driverAvatar: realDriver === 'Unassigned' ? 'https://ui-avatars.com/api/?name=Unassigned&background=e2e8f0&color=0f172a' : item.driverAvatar,
            vehicle: realVehicle,
            trailer: hasRealVehicle ? item.trailer : 'None',
            rego: hasRealVehicle ? item.rego : '—',
            activeDotsCount: isDraft ? 0 : (item.activeDotsCount ?? 1),
            progressStep: isDraft ? 'Draft' : item.progressStep
          };
        });

        setMasterLoads(sanitizedLoads);
        if (sanitizedLoads.length > 0) {
          setSelectedLoadId(sanitizedLoads[0].id);
        }
      }

      // Populate available drivers and vehicles for assignment
      if (Array.isArray(payload.drivers) && payload.drivers.length > 0) {
        setAvailableDrivers(payload.drivers);
      } else {
        api.get('/company-admin/drivers').then(r => {
          const list = r.data?.data || r.data;
          if (Array.isArray(list)) setAvailableDrivers(list);
        }).catch(() => {});
      }

      if (Array.isArray(payload.vehicles) && payload.vehicles.length > 0) {
        setAvailableVehicles(payload.vehicles);
      } else {
        api.get('/company-admin/vehicles').then(r => {
          const list = r.data?.data || r.data;
          if (Array.isArray(list)) setAvailableVehicles(list);
        }).catch(() => {});
      }

      // Populate available trailers for hitching / swapping
      if (Array.isArray(payload.trailers) && payload.trailers.length > 0) {
        setAvailableTrailers(payload.trailers);
      } else if (Array.isArray(payload.vehicles)) {
        const trls = payload.vehicles.filter(v => 
          v.category === 'TRAILER' || 
          String(v.make || '').toLowerCase().includes('trailer') || 
          String(v.model || '').toLowerCase().includes('trailer') ||
          String(v.rego || '').toUpperCase().startsWith('TRL')
        );
        setAvailableTrailers(trls);
      }
    } catch (error) {
      console.error('Error fetching active loads:', error);
      triggerToast('Error fetching active loads');
    } finally {
      setIsLoadingLoads(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);
  // Load list end

  // Currently Selected Load details
  const activeLoadDetails = masterLoads.find(l => l.id === selectedLoadId) || masterLoads[0] || {
    id: 'N/A',
    status: 'N/A',
    statusStyle: 'bg-slate-100 text-slate-700 border-slate-200',
    accentColor: 'border-l-slate-400',
    driver: 'Unassigned',
    driverRole: 'N/A',
    driverAvatar: 'https://ui-avatars.com/api/?name=Unassigned',
    driverPhone: 'N/A',
    driverStatus: 'N/A',
    routeFrom: 'N/A',
    routeTo: 'N/A',
    customer: 'N/A',
    vehicle: 'N/A',
    trailer: 'N/A',
    rego: 'N/A',
    truckPhoto: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=300',
    reqDate: 'N/A',
    reqTime: 'N/A',
    progressStep: 'N/A',
    activeDotsCount: 0,
    dotColor: 'bg-slate-500',
    lineColor: 'bg-slate-500',
    stopsCount: 0,
    itemsCount: 0
  };

  // Filter loads
  const filteredLoads = masterLoads.filter(load => {
    const matchesSearch =
      load.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      load.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      load.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      load.routeFrom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      load.routeTo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatusTab =
      activeStatusTab.includes('All') ? true :
        activeStatusTab.includes('Draft') ? (load.status === 'Draft' || load.status === 'DRAFT') :
          activeStatusTab.includes('In Transit') ? load.status === 'In Transit' :
            activeStatusTab.includes('En Route') ? load.status === 'En Route' :
              activeStatusTab.includes('At Pickup') ? load.status === 'At Pickup' :
                activeStatusTab.includes('At Delivery') ? load.status === 'At Delivery' :
                  activeStatusTab.includes('On Hold') ? load.status === 'On Hold' : true;

    const matchesDropdownStatus =
      !statusFilter || statusFilter === 'All Statuses' || statusFilter === 'Active' ? true :
        statusFilter === 'Draft' ? (load.status === 'Draft' || load.status === 'DRAFT') :
          load.status.toLowerCase().includes(statusFilter.toLowerCase());

    const matchesDriverFilter =
      !driverFilter || driverFilter === 'All Drivers' ? true :
        driverFilter === 'Unassigned' ? load.driver === 'Unassigned' :
          load.driver.toLowerCase().includes(driverFilter.toLowerCase());

    return matchesSearch && matchesStatusTab && matchesDropdownStatus && matchesDriverFilter;
  });

  // Action Handlers
  const handleCreateLoadSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gap Fix 5 (part 1): Store route as 'from to to' in notes so it's retrievable
      const notesValue = (newLoadForm.routeFrom && newLoadForm.routeTo)
        ? `${newLoadForm.routeFrom} to ${newLoadForm.routeTo}`
        : undefined;

      const createRes = await api.post('/loads', {
        status: newLoadForm.status,
        notes: notesValue,
        scheduledDate: newLoadForm.reqDate || undefined,
      });

      if (createRes.data && createRes.data.success) {
        const createdLoad = createRes.data.data;

        // Gap Fix 5 (part 2): If driver/vehicle IDs provided, call /assignments to link them in DB
        const hasAssignment = newLoadForm.driverId || newLoadForm.vehicleId || newLoadForm.trailerId;
        if (createdLoad?.id && hasAssignment) {
          try {
            await api.post(`/loads/${createdLoad.id}/assignments`, {
              driverId: newLoadForm.driverId || undefined,
              vehicleId: newLoadForm.vehicleId || undefined,
              trailerId: newLoadForm.trailerId || undefined,
            });
          } catch (assignErr) {
            console.warn('Assignment call failed (non-critical):', assignErr);
          }
        }

        setIsCreateModalOpen(false);
        triggerToast(`New Load created successfully!`);
        fetchLoads(); // Refresh list from backend
      }
    } catch (error) {
      console.error('Error creating load:', error);
      triggerToast('Error creating load. Please try again.');
    }
  };

  const handleEditLoadClick = (load) => {
    setEditingLoad({ ...load });
    setIsEditModalOpen(true);
    setOpenActionMenuId(null);
  };

  const handleViewLoadClick = (load) => {
    setSelectedLoadId(load.id);
    setViewingLoad(load);
    setIsViewModalOpen(false);
    setIsFullPageDetailsView(true);
    setOpenActionMenuId(null);
    triggerToast(`Opening Load Details page for ${load.id}`);
  };

  const handleActivateLoad = async (load) => {
    const targetId = load.dbId || load.id;
    try {
      try {
        await api.post(`/loads/${targetId}/activate`);
      } catch (e1) {
        try {
          await api.post(`/loads/${targetId}/status-transitions`, { status: 'ACTIVE' });
        } catch (e2) {
          await api.put(`/company-admin/loads/${targetId}`, { status: 'ACTIVE' });
        }
      }
      setMasterLoads(prev => prev.map(l => {
        if (l.id === load.id || l.dbId === targetId) {
          return {
            ...l,
            status: 'En Route',
            statusStyle: 'bg-blue-50 text-blue-700 border-blue-200',
            accentColor: 'border-l-blue-500',
            activeDotsCount: 2,
            progressStep: '2/6'
          };
        }
        return l;
      }));
      triggerToast(`Load ${load.id} is now ACTIVE!`);
    } catch (err) {
      console.error('Error activating load:', err);
      triggerToast('Error activating load. Please try again.');
    }
  };

  const openAssignModal = () => {
    const raw = activeLoadDetails.rawLoad || {};
    const dId = raw.driverId || '';
    const vId = raw.truckId || '';
    const trId = raw.trailerId || '';
    setSelectedAssignDriverId(dId);
    setSelectedAssignVehicleId(vId);
    setSelectedAssignTrailerId(trId);

    // If driver already has a current paired vehicle, auto-select it
    if (dId && !vId) {
      const drv = availableDrivers.find(d => String(d.id) === String(dId));
      if (drv?.currentVehicle?.[0]) {
        setSelectedAssignVehicleId(drv.currentVehicle[0].id);
        if (drv.currentVehicle[0].assignedTrailerId) {
          setSelectedAssignTrailerId(drv.currentVehicle[0].assignedTrailerId);
        }
      }
    }
    setIsTransferLoadModalOpen(true);
  };

  const handleDriverSelectionChange = (driverId) => {
    setSelectedAssignDriverId(driverId);
    if (driverId) {
      const drv = availableDrivers.find(d => String(d.id) === String(driverId));
      const linkedTruck = drv?.currentVehicle?.[0] || availableVehicles.find(v => String(v.currentDriverId) === String(driverId));
      if (linkedTruck) {
        setSelectedAssignVehicleId(linkedTruck.id);
        if (linkedTruck.assignedTrailerId) {
          setSelectedAssignTrailerId(linkedTruck.assignedTrailerId);
        }
      }
    }
  };

  const handleTruckSelectionChange = (truckId) => {
    setSelectedAssignVehicleId(truckId);
    if (truckId) {
      const trk = availableVehicles.find(v => String(v.id) === String(truckId));
      if (trk?.assignedTrailerId) {
        setSelectedAssignTrailerId(trk.assignedTrailerId);
      }
    }
  };

  const handleConfirmTrailerSwap = async () => {
    const chosenTrl = availableTrailers.find(t => String(t.id) === String(swapSelectedTrailerId)) ||
                      availableVehicles.find(v => String(v.id) === String(swapSelectedTrailerId));
    const manualVal = swapTrailerInput.trim();

    if (!chosenTrl && !manualVal) {
      triggerToast('Please select or enter a replacement trailer');
      return;
    }

    const replacementId = chosenTrl?.id || manualVal;
    const replacementLabel = chosenTrl ? (chosenTrl.rego || chosenTrl.plate || `${chosenTrl.make || ''} ${chosenTrl.model || ''}`.trim()) : manualVal;

    const raw = activeLoadDetails.rawLoad || {};
    const loadId = activeLoadDetails.dbId || activeLoadDetails.id;

    // Resolve truck ID
    let truckId = raw.truckId;
    if (!truckId && activeLoadDetails.vehicle && activeLoadDetails.vehicle !== 'Unassigned') {
      const matchedVeh = availableVehicles.find(v => 
        (v.rego && v.rego === activeLoadDetails.rego) ||
        `${v.make || ''} ${v.model || ''}`.trim().toLowerCase() === activeLoadDetails.vehicle.toLowerCase()
      );
      if (matchedVeh) truckId = matchedVeh.id;
    }

    // Resolve driver ID
    let driverId = raw.driverId;
    if (!driverId && activeLoadDetails.driver && activeLoadDetails.driver !== 'Unassigned') {
      const matchedDrv = availableDrivers.find(d => 
        (d.name && d.name === activeLoadDetails.driver) ||
        `${d.firstName || ''} ${d.lastName || ''}`.trim().toLowerCase() === activeLoadDetails.driver.toLowerCase()
      );
      if (matchedDrv) driverId = matchedDrv.id;
    }

    try {
      // 1. If truck exists, call attach-trailer endpoint on backend (auto-syncs all active loads on that truck/driver!)
      if (truckId) {
        try {
          await api.post(`/vehicles/${truckId}/attach-trailer`, {
            trailerId: replacementId,
            reason: swapReason,
            notes: `Roadside / Breakdown Swap at: ${swapLocation || 'In Transit'}`
          });
        } catch (e) {
          console.warn('Vehicle attach-trailer warning:', e);
        }
      }

      // 2. Direct load assignment update
      try {
        await api.post(`/loads/${loadId}/assignments`, {
          trailerId: replacementId,
          truckId: truckId || undefined,
          driverId: driverId || undefined
        });
      } catch {
        await api.patch(`/company-admin/loads/${loadId}`, { trailerId: replacementId }).catch(() => {});
      }

      // 3. Auto-sync all loads in masterLoads that belong to this driver or truck
      setMasterLoads(prev => prev.map(l => {
        const matchesTruck = (truckId && l.rawLoad?.truckId === truckId) || (l.vehicle && l.vehicle === activeLoadDetails.vehicle && l.vehicle !== 'Unassigned');
        const matchesDriver = (driverId && l.rawLoad?.driverId === driverId) || (l.driver && l.driver === activeLoadDetails.driver && l.driver !== 'Unassigned');
        const isCurrentLoad = l.id === activeLoadDetails.id || l.dbId === loadId;

        if (isCurrentLoad || matchesTruck || matchesDriver) {
          return {
            ...l,
            trailer: replacementLabel,
            rawLoad: {
              ...(l.rawLoad || {}),
              trailerId: replacementId
            }
          };
        }
        return l;
      }));

      setIsSwapTrailerModalOpen(false);
      setSwapTrailerInput('');
      setSwapSelectedTrailerId('');
      setSwapLocation('');
      triggerToast(`Trailer swapped to "${replacementLabel}" for Driver ${activeLoadDetails.driver} & Truck ${activeLoadDetails.vehicle}!`);
    } catch (err) {
      console.error('Error swapping trailer:', err);
      triggerToast('Error swapping trailer. Please try again.');
    }
  };

  const handleConfirmAssignment = async () => {
    if (!selectedAssignDriverId) {
      alert('Please select a driver to assign.');
      return;
    }
    const loadId = activeLoadDetails.dbId || activeLoadDetails.id;
    try {
      const chosenDrv = availableDrivers.find(d => String(d.id) === String(selectedAssignDriverId));
      const chosenVeh = availableVehicles.find(v => String(v.id) === String(selectedAssignVehicleId));
      const chosenTrl = availableTrailers.find(t => String(t.id) === String(selectedAssignTrailerId)) || 
                        availableVehicles.find(v => String(v.id) === String(selectedAssignTrailerId));

      const drvName = chosenDrv ? (chosenDrv.name || `${chosenDrv.firstName || ''} ${chosenDrv.lastName || ''}`.trim() || chosenDrv.driverCode) : 'Assigned Driver';
      const vehName = chosenVeh ? `${chosenVeh.make || ''} ${chosenVeh.model || ''}`.trim() : 'Assigned Truck';
      const trlName = chosenTrl ? (chosenTrl.rego || chosenTrl.plate || `${chosenTrl.make || ''} ${chosenTrl.model || ''}`.trim()) : (chosenVeh?.assignedTrailerId ? 'Trailer Attached' : 'None');
      const regoName = chosenVeh?.rego || '—';

      // 1. Assign to Load
      try {
        await api.post(`/loads/${loadId}/assignments`, {
          driverId: selectedAssignDriverId,
          vehicleId: selectedAssignVehicleId || undefined,
          truckId: selectedAssignVehicleId || undefined,
          trailerId: selectedAssignTrailerId || undefined
        });
      } catch (err1) {
        await api.put(`/company-admin/loads/${loadId}`, {
          driverId: selectedAssignDriverId,
          truckId: selectedAssignVehicleId || undefined,
          trailerId: selectedAssignTrailerId || undefined
        });
      }

      // 2. If trailer was chosen and truck didn't have it hitched, hitch it now
      if (selectedAssignVehicleId && selectedAssignTrailerId) {
        try {
          await api.post(`/vehicles/${selectedAssignVehicleId}/attach-trailer`, {
            trailerId: selectedAssignTrailerId,
            reason: 'Load Dispatch Consist Assignment'
          }).catch(() => {});
        } catch {
          // non-fatal
        }
      }

      setMasterLoads(prev => prev.map(l => {
        if (l.id === activeLoadDetails.id || l.dbId === loadId) {
          return {
            ...l,
            driver: drvName,
            driverRole: 'Car Carrier',
            driverStatus: 'On Duty',
            driverAvatar: chosenDrv?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(drvName)}&background=e2e8f0&color=0f172a`,
            driverPhone: chosenDrv?.phone || l.driverPhone,
            vehicle: vehName,
            trailer: trlName,
            rego: regoName,
            status: (l.status === 'Draft' || l.status === 'DRAFT') ? 'Planned' : l.status,
            activeDotsCount: l.activeDotsCount === 0 ? 1 : l.activeDotsCount,
            rawLoad: {
              ...(l.rawLoad || {}),
              driverId: selectedAssignDriverId,
              truckId: selectedAssignVehicleId,
              trailerId: selectedAssignTrailerId
            }
          };
        }
        return l;
      }));

      setIsTransferLoadModalOpen(false);
      triggerToast(`Driver ${drvName} with Truck ${vehName} & Trailer ${trlName} assigned to load ${activeLoadDetails.id}!`);
    } catch (err) {
      console.error('Error assigning consist to load:', err);
      triggerToast('Error assigning driver & unit. Please try again.');
    }
  };

  const handleEditLoadSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        status: editingLoad.status === 'In Transit' ? 'IN_TRANSIT' : editingLoad.status === 'En Route' ? 'ASSIGNED' : 'PLANNED',
        pickupLocation: editingLoad.routeFrom,
        deliveryLocation: editingLoad.routeTo,
        customerName: editingLoad.customer,
        driverName: editingLoad.driver,
        vehicleId: editingLoad.vehicle,
        trailerId: editingLoad.trailer
      };
      const res = await api.put(`/loads/${editingLoad.dbId}`, payload);
      if (res.data && res.data.success) {
        setIsEditModalOpen(false);
        triggerToast(`Load ${editingLoad.id} updated successfully!`);
        fetchLoads();
      }
    } catch (error) {
      console.error('Error updating load:', error);
      triggerToast('Error updating load');
    }
  };

  const handleDeleteLoad = async (loadId) => {
    const target = masterLoads.find(item => item.id === loadId);
    const targetDbId = target?.dbId || loadId;
    
    // Save into localStorage persistent deleted set
    try {
      const currentSaved = getDeletedLoadIds();
      currentSaved.add(loadId);
      if (targetDbId) currentSaved.add(targetDbId);
      localStorage.setItem('dispatcher_deleted_load_ids', JSON.stringify(Array.from(currentSaved)));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    setOpenActionMenuId(null);
    setMasterLoads(prev => prev.filter(l => l.id !== loadId && l.dbId !== targetDbId));
    if (selectedLoadId === loadId && masterLoads.length > 1) {
      setSelectedLoadId(masterLoads.find(l => l.id !== loadId)?.id || '');
    }
    triggerToast(`Load ${loadId} deleted successfully!`);

    try {
      const deleteId = targetDbId || loadId;
      await api.delete(`/loads/${deleteId}`);
    } catch (error) {
      console.warn('Backend deletion sync notice:', error?.message);
    }
  };

  // Setup Leaflet map inside details drawer matching user image
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [-37.9716, 144.6000],
      zoom: 9,
      zoomControl: false
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const routeCoords = [
      [-38.1499, 144.3617], // Geelong
      [-37.9716, 144.7188], // Point Cook / Werribee
      [-37.8136, 144.9631]  // Melbourne
    ];

    L.polyline(routeCoords, {
      color: '#2563eb',
      weight: 3.5
    }).addTo(map);

    // 1. Geelong Pin Marker (Green Dot + Text)
    const geelongIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="display: flex; align-items: center; gap: 4px; background: white; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); border: 1px solid #e2e8f0; font-weight: 700; font-size: 11px; color: #1e293b; white-space: nowrap;">
          <span style="width: 8px; height: 8px; border-radius: 9999px; background-color: #10b981; display: inline-block;"></span>
          <span>Geelong</span>
        </div>
      `,
      iconSize: [80, 24],
      iconAnchor: [15, 12]
    });
    L.marker([-38.1499, 144.3617], { icon: geelongIcon }).addTo(map);

    // 2. Melbourne Pin Marker (Blue Dot + Text)
    const melbourneIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="display: flex; align-items: center; gap: 4px; background: white; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); border: 1px solid #e2e8f0; font-weight: 700; font-size: 11px; color: #1e293b; white-space: nowrap;">
          <span>Melbourne</span>
          <span style="width: 8px; height: 8px; border-radius: 9999px; background-color: #2563eb; display: inline-block;"></span>
        </div>
      `,
      iconSize: [90, 24],
      iconAnchor: [75, 12]
    });
    L.marker([-37.8136, 144.9631], { icon: melbourneIcon }).addTo(map);

    // 3. Middle Vehicle Circular Blue Badge Icon (Truck logo matching user reference image!)
    const truckBadgeIcon = L.divIcon({
      className: 'custom-truck-badge',
      html: `
        <div style="width: 34px; height: 34px; border-radius: 9999px; background-color: #2563eb; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(37,99,235,0.45); border: 2.5px solid white;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="16.5" cy="18.5" r="2.5"/></svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    L.marker([-37.9716, 144.7188], { icon: truckBadgeIcon }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [selectedLoadId]);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-5 space-y-3.5 text-left font-sans antialiased text-slate-800">

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ============================================================
         CREATE LOAD MODAL FORM
         ============================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Create New Load</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Fill in details to dispatch a new active load</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLoadSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer</label>
                  <input
                    type="text"
                    required
                    value={newLoadForm.customer}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, customer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={newLoadForm.status}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                  >
                    <option value="In Transit">In Transit</option>
                    <option value="En Route">En Route</option>
                    <option value="At Pickup">At Pickup</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Route Pickup (From)</label>
                  <input
                    type="text"
                    required
                    value={newLoadForm.routeFrom}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, routeFrom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Route Delivery (To)</label>
                  <input
                    type="text"
                    required
                    value={newLoadForm.routeTo}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, routeTo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Driver</label>
                  <select
                    value={newLoadForm.driver}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, driver: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                  >
                    <option value="John Doe">John Doe</option>
                    <option value="Chris Lee">Chris Lee</option>
                    <option value="Michael Tan">Michael Tan</option>
                    <option value="David Brown">David Brown</option>
                    <option value="Ben Hall">Ben Hall</option>
                    <option value="Sarah Connor">Sarah Connor</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vehicle / Trailer</label>
                  <input
                    type="text"
                    required
                    value={newLoadForm.vehicle}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, vehicle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Required Date</label>
                  <input
                    type="text"
                    value={newLoadForm.reqDate}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, reqDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Required Time</label>
                  <input
                    type="text"
                    value={newLoadForm.reqTime}
                    onChange={(e) => setNewLoadForm({ ...newLoadForm, reqTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Create Load
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
         EDIT LOAD MODAL FORM
         ============================================================ */}
      {isEditModalOpen && editingLoad && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Edit Load ({editingLoad.id})</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Update operational dispatch information</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditLoadSave} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer</label>
                  <input
                    type="text"
                    value={editingLoad.customer}
                    onChange={(e) => setEditingLoad({ ...editingLoad, customer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={editingLoad.status}
                    onChange={(e) => setEditingLoad({
                      ...editingLoad,
                      status: e.target.value,
                      statusStyle: e.target.value === 'In Transit' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        e.target.value === 'En Route' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          e.target.value === 'At Pickup' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-slate-100 text-slate-700 border-slate-200',
                      accentColor: e.target.value === 'In Transit' ? 'border-l-emerald-500' :
                        e.target.value === 'En Route' ? 'border-l-blue-500' :
                          e.target.value === 'At Pickup' ? 'border-l-amber-500' : 'border-l-slate-400'
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                  >
                    <option value="In Transit">In Transit</option>
                    <option value="En Route">En Route</option>
                    <option value="At Pickup">At Pickup</option>
                    <option value="At Delivery">At Delivery</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Route From</label>
                  <input
                    type="text"
                    value={editingLoad.routeFrom}
                    onChange={(e) => setEditingLoad({ ...editingLoad, routeFrom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Route To</label>
                  <input
                    type="text"
                    value={editingLoad.routeTo}
                    onChange={(e) => setEditingLoad({ ...editingLoad, routeTo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Driver</label>
                  <input
                    type="text"
                    value={editingLoad.driver}
                    onChange={(e) => setEditingLoad({ ...editingLoad, driver: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vehicle / Trailer</label>
                  <input
                    type="text"
                    value={editingLoad.vehicle}
                    onChange={(e) => setEditingLoad({ ...editingLoad, vehicle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
         VIEW LOAD DETAILS MODAL
         ============================================================ */}
      {isViewModalOpen && viewingLoad && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 text-left">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{viewingLoad.id}</h2>
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${viewingLoad.statusStyle}`}>
                      {viewingLoad.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Customer: <strong className="text-slate-800">{viewingLoad.customer}</strong></p>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Details */}
            <div className="p-4 sm:p-5 space-y-4 text-xs">
              {/* Route Banner */}
              <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-100 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Origin</span>
                  <p className="text-sm font-extrabold text-slate-900">{viewingLoad.routeFrom}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-blue-600">
                    <span className="w-8 sm:w-12 h-0.5 bg-blue-300" />
                    <Truck className="w-4 h-4" />
                    <span className="w-8 sm:w-12 h-0.5 bg-blue-300" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1">Required: {viewingLoad.reqDate}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Destination</span>
                  <p className="text-sm font-extrabold text-slate-900">{viewingLoad.routeTo}</p>
                </div>
              </div>

              {/* 2-Column Info: Driver & Vehicle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Driver Box */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                  <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Driver Information</h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={viewingLoad.driverAvatar}
                      alt={viewingLoad.driver}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{viewingLoad.driver}</h4>
                      <span className="text-[10px] text-slate-500 font-medium block">{viewingLoad.driverRole}</span>
                      <span className="text-[10px] text-blue-600 font-semibold block">{viewingLoad.driverPhone}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-200/60">
                    <button
                      onClick={() => triggerToast(`Messaging driver ${viewingLoad.driver}...`)}
                      className="flex-1 py-1 px-2 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3 text-blue-600" />
                      <span>Message</span>
                    </button>
                    <button
                      onClick={() => triggerToast(`Calling driver ${viewingLoad.driver}...`)}
                      className="flex-1 py-1 px-2 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>Call</span>
                    </button>
                  </div>
                </div>

                {/* Vehicle Box */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                  <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Vehicle & Trailer</h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={viewingLoad.truckPhoto}
                      alt={viewingLoad.vehicle}
                      className="w-12 h-10 rounded object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{viewingLoad.vehicle}</h4>
                      <span className="text-[10px] text-slate-500 font-medium block">{viewingLoad.trailer}</span>
                      <span className="text-[10px] font-bold text-slate-700 block">Rego: {viewingLoad.rego}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px]">
                    <span className="text-slate-500 font-medium">Compliance:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">Compliant & Active</span>
                  </div>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Progress Timeline</h3>
                <div className="flex items-center justify-between relative py-2 overflow-x-auto">
                  <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                  <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-0.5 z-0 pointer-events-none">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, (((viewingLoad.activeDotsCount || 1) - 1) / 5) * 100))}%` }}
                    />
                  </div>
                  {[
                    { title: 'Accepted', date: '21 May, 08:30 AM', state: 'done' },
                    { title: 'En Route', date: '21 May, 09:10 AM', state: 'done' },
                    { title: 'At Pickup', date: '21 May, 10:05 AM', state: 'done' },
                    { title: 'Loaded', date: '21 May, 11:45 AM', state: 'done' },
                    { title: 'In Transit', date: '21 May', state: viewingLoad.status === 'In Transit' ? 'active' : 'pending' },
                    { title: 'Delivered', date: '', state: 'pending' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center z-10 space-y-1 min-w-[55px]">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step.state === 'done' ? 'bg-emerald-500 text-white' :
                        step.state === 'active' ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-xs' :
                        'bg-white border-2 border-slate-200 text-slate-300'
                      }`}>
                        {step.state === 'done' ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span className={`text-[10px] font-bold ${step.state === 'active' ? 'text-blue-600' : 'text-slate-700'}`}>{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manifest Summary */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Stops</span>
                  <span className="text-base font-extrabold text-slate-900">{viewingLoad.stopsCount || 2} Stops</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Items / Cargo</span>
                  <span className="text-base font-extrabold text-slate-900">{viewingLoad.itemsCount || 5} Units</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">ETA</span>
                  <span className="text-base font-extrabold text-emerald-600">{viewingLoad.reqTime}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEditLoadClick(viewingLoad);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <span>Edit Load</span>
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => triggerToast(`Printing Manifest for Load ${viewingLoad.id}...`)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Print Manifest</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
         1. TOP HEADER ROW
         ============================================================ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{pageTitle}</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{pageSubtitle}</p>
        </div>
      </div>

      {/* ============================================================
         2. TOP FILTER ROW (Labels ABOVE Select Inputs)
         ============================================================ */}
      <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-end gap-2">

          {/* Branch */}
          <div className="flex-1 min-w-[110px]">
            <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Branch</label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
            >
              <option value="All Branches">All Branches</option>
              <option value="Sydney Depot">Sydney Depot</option>
              <option value="Melbourne Depot">Melbourne Depot</option>
              <option value="Brisbane Depot">Brisbane Depot</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex-1 min-w-[110px]">
            <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
            >
              <option value="Active">Active</option>
              <option value="All Statuses">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="In Transit">In Transit</option>
              <option value="En Route">En Route</option>
              <option value="At Pickup">At Pickup</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Driver */}
          <div className="flex-1 min-w-[110px]">
            <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Driver</label>
            <select
              value={driverFilter}
              onChange={(e) => setDriverFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
            >
              <option value="All Drivers">All Drivers</option>
              <option value="John Doe">John Doe</option>
              <option value="Chris Lee">Chris Lee</option>
              <option value="Michael Tan">Michael Tan</option>
              <option value="David Brown">David Brown</option>
            </select>
          </div>

          {/* Customer */}
          <div className="flex-1 min-w-[110px]">
            <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Customer</label>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
            >
              <option value="All Customers">All Customers</option>
              <option value="BMW Australia">BMW Australia</option>
              <option value="Pickles Auctions">Pickles Auctions</option>
              <option value="Toyota Finance">Toyota Finance</option>
            </select>
          </div>

          {/* Destination */}
          <div className="flex-1 min-w-[110px]">
            <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Destination</label>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
            >
              <option value="All Destinations">All Destinations</option>
              <option value="Sydney">Sydney</option>
              <option value="Melbourne">Melbourne</option>
              <option value="Geelong">Geelong</option>
            </select>
          </div>

          {/* Niche Type */}
          <div className="flex-1 min-w-[110px]">
            <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Niche Type</label>
            <select
              value={nicheFilter}
              onChange={(e) => setNicheFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
            >
              <option value="All Types">All Types</option>
              <option value="Car Carrying">Car Carrying</option>
              <option value="General Freight">General Freight</option>
            </select>
          </div>

          {/* Vehicle / Trailer */}
          <div className="flex-1 min-w-[110px]">
            <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Vehicle / Trailer</label>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
            >
              <option value="All">All</option>
              <option value="MAN TGX 26.580">MAN TGX 26.580</option>
              <option value="Volvo FH16 750">Volvo FH16 750</option>
            </select>
          </div>

          {/* Required Date */}
          <div className="flex-1 min-w-[110px]">
            <label className="text-[10.5px] font-semibold text-slate-500 mb-1 block whitespace-nowrap">Required Date</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs truncate"
            >
              <option value="Any Date">Any Date</option>
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
            </select>
          </div>

          {/* More Filters button in SAME line */}
          <div className="flex items-end shrink-0 ml-auto">
            <button
              onClick={() => triggerToast('Opening advanced filter drawer...')}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-medium text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap h-[30px]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>More Filters</span>
            </button>
          </div>

        </div>
      </div>

      {/* ============================================================
         3. SEARCH & ACTION BAR
         ============================================================ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-xl w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by load ID, customer, driver, VIN, rego, destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto justify-end">
          <button
            onClick={() => triggerToast('Exporting active loads manifest (CSV/PDF)...')}
            className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowColumnModal(!showColumnModal)}
              className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
              <span>Columns</span>
            </button>
            {showColumnModal && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowColumnModal(false)} />
                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 space-y-2 text-left animate-in fade-in zoom-in-95">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visible Columns</p>
                  {['Status', 'Driver / Team', 'Route', 'Customer', 'Vehicle / Trailer', 'Required Date', 'Progress'].map(col => (
                    <label key={col} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={!hiddenCols.includes(col)}
                        onChange={() => {
                          setHiddenCols(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-300 accent-blue-600 cursor-pointer"
                      />
                      {col}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center cursor-pointer active:scale-95 transition-transform"
          >
            <span>Create Load</span>
            <span className="h-3.5 border-r border-blue-400/80 mx-2.5" />
            <ChevronDown className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* ============================================================
         4. MAIN CONTENT VIEW (FULL PAGE LOAD DETAILS OR TABLE LIST)
         ============================================================ */}
      {isFullPageDetailsView ? (
        <div className="space-y-4 text-left font-sans animate-in fade-in duration-200">
          {/* Top Breadcrumb & Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFullPageDetailsView(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <ArrowLeft size={16} />
                <span>Back to Active Loads</span>
              </button>
              <span className="text-slate-300 font-bold">|</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">{activeLoadDetails.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${activeLoadDetails.statusStyle}`}>
                  {activeLoadDetails.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(activeLoadDetails.status === 'Draft' || activeLoadDetails.status === 'DRAFT' || activeLoadDetails.status === 'Planned') && (
                <button
                  onClick={() => handleActivateLoad(activeLoadDetails)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Activate this load into live dispatch operations"
                >
                  <Zap size={14} className="fill-white" />
                  <span>Activate Load</span>
                </button>
              )}
              <button
                onClick={() => triggerToast('Opening Chain of Custody manifest...')}
                className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink size={14} />
                <span>Chain of Custody</span>
              </button>
              <button
                onClick={() => handleEditLoadClick(activeLoadDetails)}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 size={14} />
                <span>Edit Load</span>
              </button>
              <button
                onClick={() => handleDeleteLoad(activeLoadDetails.id)}
                className="px-3.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Delete Load</span>
              </button>
            </div>
          </div>

          {/* Main 2-Column Full Page Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Primary Details (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Route & Customer Banner */}
              <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Route & Customer</span>
                  <div className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <span>{activeLoadDetails.routeFrom}</span>
                    <span className="text-purple-400">➔</span>
                    <span>{activeLoadDetails.routeTo}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-1">Customer: <strong className="text-white font-bold">{activeLoadDetails.customer}</strong></p>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Required Schedule Date</span>
                  <div className="text-base font-extrabold text-amber-300">{activeLoadDetails.reqDate}</div>
                  <span className="text-xs text-slate-300 font-medium">{activeLoadDetails.reqTime}</span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Progress Timeline</h4>
                  {activeLoadDetails.activeDotsCount === 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Draft — Awaiting Driver Assignment & Activation
                    </span>
                  )}
                </div>
                <div className="relative flex justify-between items-center py-4 px-2">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 z-0 pointer-events-none">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(0, Math.min(100, (((activeLoadDetails.activeDotsCount || 0) - 1) / 5) * 100))}%` }}
                    />
                  </div>
                  {['Accepted', 'En Route', 'At Pickup', 'Loaded', 'In Transit', 'Delivered'].map((step, idx) => {
                    const isPassed = activeLoadDetails.activeDotsCount > 0 && idx + 1 <= activeLoadDetails.activeDotsCount;
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center gap-1.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                          isPassed ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {isPassed ? <Check size={16} /> : idx + 1}
                        </div>
                        <span className={`text-[11px] font-bold ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detail Navigation Tabs */}
              {(() => {
                const rawLoad = activeLoadDetails.rawLoad || {};
                const stopsList = Array.isArray(rawLoad.stops) ? [...rawLoad.stops].sort((a, b) => (a.sequenceIndex || 0) - (b.sequenceIndex || 0)) : [];
                const itemsList = Array.isArray(rawLoad.items) ? rawLoad.items : [];
                const docsList = Array.isArray(rawLoad.documents) ? rawLoad.documents : [];
                const cleanNotes = (rawLoad.notes || '').replace(/\[(AGREED_RATE|DRIVER_PAY|SCHEDULE):[^\]]+\]/g, '').trim();

                const pickupStop = stopsList.find(s => (s.type || '').toUpperCase().includes('PICKUP')) || stopsList[0];
                const deliveryStop = stopsList.find(s => (s.type || '').toUpperCase().includes('DROP') || (s.type || '').toUpperCase().includes('DELIV')) || (stopsList.length > 1 ? stopsList[stopsList.length - 1] : null);

                const detailTabs = [
                  { id: 'Overview', label: 'Overview' },
                  { id: 'Stops', label: `Stops (${stopsList.length})` },
                  { id: 'Cargo', label: `Items / Cargo (${itemsList.length})` },
                  { id: 'Documents', label: `Documents (${docsList.length})` },
                  { id: 'Notes', label: 'Notes' }
                ];

                return (
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                    <div className="flex border-b border-slate-200 bg-slate-50/50 px-4 pt-3 gap-6 overflow-x-auto">
                      {detailTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveDetailsTab(tab.id)}
                          className={`pb-3 text-xs font-extrabold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                            activeDetailsTab === tab.id
                              ? 'border-purple-600 text-purple-700'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-5">
                      {/* OVERVIEW TAB */}
                      {activeDetailsTab === 'Overview' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Driver Card */}
                            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Driver</span>
                                <button
                                  onClick={openAssignModal}
                                  className="text-xs font-bold text-purple-600 hover:text-purple-800 cursor-pointer flex items-center gap-1"
                                >
                                  <Edit3 size={12} />
                                  <span>{activeLoadDetails.driver === 'Unassigned' ? 'Assign' : 'Reassign'}</span>
                                </button>
                              </div>
                              {activeLoadDetails.driver === 'Unassigned' ? (
                                <div className="flex items-center justify-between p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                                      <User size={16} />
                                    </div>
                                    <div>
                                      <div className="font-extrabold text-xs text-amber-900">No Driver Assigned</div>
                                      <div className="text-[10.5px] text-amber-700">Load is unassigned in draft</div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={openAssignModal}
                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    + Assign
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <img src={activeLoadDetails.driverAvatar} alt="" className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                                  <div>
                                    <div className="font-extrabold text-sm text-slate-900">{activeLoadDetails.driver}</div>
                                    <div className="text-xs text-slate-500 font-medium">
                                      {activeLoadDetails.driverRole} {activeLoadDetails.driverPhone && activeLoadDetails.driverPhone !== 'N/A' ? `• ${activeLoadDetails.driverPhone}` : ''}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Vehicle Card */}
                            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Vehicle</span>
                                <button
                                  onClick={openAssignModal}
                                  className="text-xs font-bold text-purple-600 hover:text-purple-800 cursor-pointer flex items-center gap-1"
                                >
                                  <Edit3 size={12} />
                                  <span>{activeLoadDetails.vehicle === 'Unassigned' ? 'Assign' : 'Change'}</span>
                                </button>
                              </div>
                              {activeLoadDetails.vehicle === 'Unassigned' ? (
                                <div className="flex items-center justify-between p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                                      <Truck size={16} />
                                    </div>
                                    <div>
                                      <div className="font-extrabold text-xs text-amber-900">No Truck Assigned</div>
                                      <div className="text-[10.5px] text-amber-700">Assign vehicle when ready</div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={openAssignModal}
                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    + Assign
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  <div className="font-extrabold text-sm text-slate-900">{activeLoadDetails.vehicle}</div>
                                  <div className="text-xs text-slate-500 font-medium">Trailer: {activeLoadDetails.trailer} • Rego: {activeLoadDetails.rego}</div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Specs & Delivery Instructions Summary */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cargo Specifications</span>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-slate-400 block text-[11px]">Load Type</span>
                                  <span className="font-bold text-slate-800">{rawLoad.type || 'General Freight'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[11px]">Priority</span>
                                  <span className="font-bold text-slate-800">{rawLoad.priority || 'Standard'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[11px]">Total Items</span>
                                  <span className="font-bold text-slate-800">{itemsList.length} items</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[11px]">Total Weight</span>
                                  <span className="font-bold text-slate-800">
                                    {itemsList.reduce((acc, i) => acc + (Number(i.weight) || 0), 0) > 0 
                                      ? `${itemsList.reduce((acc, i) => acc + (Number(i.weight) || 0), 0)} kg` 
                                      : '—'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivery Instructions & Contact</span>
                              <div className="text-xs space-y-1">
                                <div>
                                  <span className="text-slate-400 text-[11px] block">Delivery Stop:</span>
                                  <span className="font-semibold text-slate-800">
                                    {deliveryStop?.address || activeLoadDetails.routeTo}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[11px] block">Instructions:</span>
                                  {deliveryStop?.instructions ? (
                                    <span className="font-medium text-slate-700">{deliveryStop.instructions}</span>
                                  ) : (
                                    <span className="text-slate-400 italic text-[11px]">No special instructions specified</span>
                                  )}
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[11px] block">On-Site Contact:</span>
                                  {deliveryStop?.contactName ? (
                                    <span className="font-semibold text-slate-800">
                                      {deliveryStop.contactName} {deliveryStop.contactPhone ? `(${deliveryStop.contactPhone})` : ''}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 italic text-[11px]">No contact person specified</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STOPS TAB */}
                      {activeDetailsTab === 'Stops' && (
                        <div>
                          {stopsList.length === 0 ? (
                            <div className="py-10 px-4 flex flex-col items-center justify-center text-center space-y-2">
                              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <MapPin size={22} />
                              </div>
                              <div className="font-extrabold text-sm text-slate-800">No Custom Stops Added</div>
                              <p className="text-xs text-slate-500 max-w-sm">
                                Direct route: <span className="font-bold text-slate-700">{activeLoadDetails.routeFrom}</span> ➔ <span className="font-bold text-slate-700">{activeLoadDetails.routeTo}</span>.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {stopsList.map((stop, sIdx) => {
                                const isPickup = (stop.type || '').toUpperCase().includes('PICKUP');
                                return (
                                  <div key={stop.id || sIdx} className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-2.5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                          isPickup ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                                        }`}>
                                          Stop {sIdx + 1} • {isPickup ? 'Pickup' : 'Drop-off / Delivery'}
                                        </span>
                                        <span className="text-xs font-black text-slate-900">{stop.address || 'Address not specified'}</span>
                                      </div>
                                      {(stop.date || stop.time) && (
                                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                                          <Clock size={12} className="text-slate-400" />
                                          <span>{stop.date ? new Date(stop.date).toLocaleDateString('en-GB') : ''} {stop.time || ''}</span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                      <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Site Contact</span>
                                        {stop.contactName ? (
                                          <span className="font-bold text-slate-800">
                                            {stop.contactName} {stop.contactPhone ? <span className="font-normal text-slate-500">• {stop.contactPhone}</span> : ''}
                                          </span>
                                        ) : (
                                          <span className="text-slate-400 italic text-[11px]">No contact person specified</span>
                                        )}
                                      </div>

                                      <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Special Instructions</span>
                                        {stop.instructions ? (
                                          <span className="font-medium text-slate-800">{stop.instructions}</span>
                                        ) : (
                                          <span className="text-slate-400 italic text-[11px]">No specific instructions</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* CARGO / ITEMS TAB */}
                      {activeDetailsTab === 'Cargo' && (
                        <div>
                          {itemsList.length === 0 ? (
                            <div className="py-10 px-4 flex flex-col items-center justify-center text-center space-y-2">
                              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <Package size={22} />
                              </div>
                              <div className="font-extrabold text-sm text-slate-800">No Cargo Items Attached</div>
                              <p className="text-xs text-slate-500 max-w-sm">
                                No vehicles or freight items have been attached to load {activeLoadDetails.id}. You can add items by editing this load.
                              </p>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                                    <th className="py-2.5 px-3">#</th>
                                    <th className="py-2.5 px-3">Description / Vehicle</th>
                                    <th className="py-2.5 px-3">VIN / Serial</th>
                                    <th className="py-2.5 px-3">Rego</th>
                                    <th className="py-2.5 px-3">Qty</th>
                                    <th className="py-2.5 px-3">Weight</th>
                                    <th className="py-2.5 px-3">Handling / Notes</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {itemsList.map((item, idx) => {
                                    const title = item.description || item.name || `${item.make || ''} ${item.model || ''}`.trim() || `Cargo Item #${idx + 1}`;
                                    return (
                                      <tr key={item.id || idx} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-2.5 px-3 font-bold text-slate-400">{idx + 1}</td>
                                        <td className="py-2.5 px-3 font-extrabold text-slate-900">{title}</td>
                                        <td className="py-2.5 px-3 font-mono text-slate-600">{item.vin || item.serialNumber || '—'}</td>
                                        <td className="py-2.5 px-3 font-bold text-slate-700">{item.rego || '—'}</td>
                                        <td className="py-2.5 px-3 font-semibold text-slate-700">{item.quantity || 1}</td>
                                        <td className="py-2.5 px-3 font-semibold text-slate-700">{item.weight ? `${item.weight} kg` : '—'}</td>
                                        <td className="py-2.5 px-3 text-slate-500">{item.specialHandling || item.notes || '—'}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                      {/* DOCUMENTS TAB */}
                      {activeDetailsTab === 'Documents' && (
                        <div>
                          {docsList.length === 0 ? (
                            <div className="py-10 px-4 flex flex-col items-center justify-center text-center space-y-2">
                              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <FileText size={22} />
                              </div>
                              <div className="font-extrabold text-sm text-slate-800">No Documents Uploaded</div>
                              <p className="text-xs text-slate-500 max-w-sm">
                                Proof of Delivery (POD), Bill of Lading (BOL), and inspection slips will automatically appear here once captured or uploaded.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {docsList.map((doc, dIdx) => (
                                <div key={doc.id || dIdx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                      <FileText size={18} />
                                    </div>
                                    <div>
                                      <div className="font-bold text-xs text-slate-900">{doc.name || `Document #${dIdx + 1}`}</div>
                                      <div className="text-[11px] text-slate-500">{doc.type || 'Attachment'} {doc.size ? `• ${doc.size}` : ''}</div>
                                    </div>
                                  </div>
                                  {doc.url && (
                                    <a
                                      href={doc.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
                                    >
                                      <Download size={12} />
                                      <span>View</span>
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* NOTES TAB */}
                      {activeDetailsTab === 'Notes' && (
                        <div className="space-y-4">
                          {cleanNotes ? (
                            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Internal Dispatch Notes</span>
                                <span className="text-[10px] text-slate-400 font-semibold">Active Record</span>
                              </div>
                              <p className="text-xs text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                                {cleanNotes}
                              </p>
                            </div>
                          ) : (
                            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-500 italic">
                              No notes or dispatch instructions entered for this load yet.
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-100">
                            <button
                              onClick={() => setIsAddNoteModalOpen(true)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                              <FileCheck size={14} />
                              <span>{cleanNotes ? 'Add / Update Note' : '+ Add Note'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right Quick Actions Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Quick Actions & Tools</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const phone = activeLoadDetails.driverPhone && activeLoadDetails.driverPhone !== 'N/A' 
                        ? activeLoadDetails.driverPhone 
                        : (activeLoadDetails.rawLoad?.driver?.phone || null);
                      if (phone) {
                        window.location.href = `tel:${phone}`;
                        triggerToast(`Initiating call to ${activeLoadDetails.driver} (${phone})...`);
                      } else {
                        triggerToast(`No contact phone number on file for ${activeLoadDetails.driver}`);
                      }
                    }}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Call Driver</span>
                  </button>

                  <button
                    onClick={() => setIsInstructionsModalOpen(true)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>Instructions</span>
                  </button>

                  <button
                    onClick={() => {
                      if (activeLoadDetails.driver === 'Unassigned' || activeLoadDetails.vehicle === 'Unassigned') {
                        triggerToast('Please assign a Driver & Equipment consist first before swapping trailers');
                        openAssignModal();
                        return;
                      }
                      setSwapSelectedTrailerId(activeLoadDetails.rawLoad?.trailerId || '');
                      setSwapTrailerInput('');
                      setIsSwapTrailerModalOpen(true);
                    }}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                    title="Swap trailer on assigned driver/truck unit for breakdown or defect"
                  >
                    <RefreshCcw className="w-4 h-4 text-amber-600" />
                    <span>Swap Trailer</span>
                  </button>

                  <button
                    onClick={openAssignModal}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>Assign Driver & Unit</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsAddNoteModalOpen(true)}
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-xl border border-indigo-200/80 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <FileCheck size={16} /> Add Dispatcher Note
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200/80 shadow-2xs p-3.5 space-y-3 transition-all duration-300">

          {/* Header & Status Tabs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Loads ({filteredLoads.length})</h2>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-200 pb-2 overflow-x-auto">
            {[
              `All (${masterLoads.length})`,
              `Draft (${masterLoads.filter(l => l.status === 'Draft' || l.status === 'DRAFT').length})`,
              `In Transit (${masterLoads.filter(l => l.status === 'In Transit').length})`,
              `En Route to Pickup (${masterLoads.filter(l => l.status === 'En Route').length})`,
              `At Pickup (${masterLoads.filter(l => l.status === 'At Pickup').length})`,
              `At Delivery (${masterLoads.filter(l => l.status === 'At Delivery').length})`,
              `On Hold (${masterLoads.filter(l => l.status === 'On Hold').length})`
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)}
                className={`text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${activeStatusTab.split(' ')[0] === tab.split(' ')[0]
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-2 -mb-[9px]'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-2.5 px-2">Load ID ↕</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2">Driver / Team</th>
                  <th className="py-2.5 px-2">Route</th>
                  <th className="py-2.5 px-2">Customer</th>
                  <th className="py-2.5 px-2">Vehicle / Trailer</th>
                  <th className="py-2.5 px-2">Required Date ↕</th>
                  <th className="py-2.5 px-2">Progress</th>
                  <th className="py-2.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLoads.map((item) => {
                  const isSelected = item.id === selectedLoadId;
                  const isMenuOpen = openActionMenuId === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        handleViewLoadClick(item);
                      }}
                      className={`border-l-4 ${item.accentColor} hover:bg-blue-50/40 transition-colors cursor-pointer relative ${isSelected ? 'bg-blue-50/70 font-medium' : ''
                        }`}
                    >
                      {/* Load ID */}
                      <td className="py-3 px-2 font-bold text-blue-600 hover:underline whitespace-nowrap">
                        {item.id}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold border ${item.statusStyle}`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Driver */}
                      <td className="py-3 px-3 whitespace-nowrap min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.driverAvatar}
                            alt={item.driver}
                            className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{item.driver}</span>
                            <span className="text-[9.5px] text-slate-400 font-medium block">{item.driverRole}</span>
                          </div>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="py-3 px-3 whitespace-nowrap min-w-[180px]">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <span className="truncate">{item.routeFrom}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.routeTo}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap min-w-[140px]">
                        {item.customer}
                      </td>

                      {/* Vehicle */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-800 block leading-tight">{item.vehicle}</span>
                            <span className="text-[9.5px] text-slate-400 font-medium block">{item.trailer}</span>
                          </div>
                        </div>
                      </td>

                      {/* Required Date */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <div className="text-[10.5px]">
                          <span className="font-bold text-slate-700 block">{item.reqDate}</span>
                          <span className="text-[9.5px] text-slate-400 font-medium block">{item.reqTime}</span>
                        </div>
                      </td>

                      {/* Progress Line */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className="relative flex items-center w-16">
                            <div className="absolute left-0 right-0 h-0.5 bg-slate-200" />
                            <div
                              className={`absolute left-0 h-0.5 ${item.lineColor}`}
                              style={{ width: `${(item.activeDotsCount / 5) * 100}%` }}
                            />
                            <div className="relative flex justify-between w-full z-10">
                              {[1, 2, 3, 4, 5].map((dotIdx) => {
                                const isActive = dotIdx <= item.activeDotsCount;
                                return (
                                  <span
                                    key={dotIdx}
                                    className={`w-2 h-2 rounded-full border border-white ${isActive ? item.dotColor : 'bg-slate-200'
                                      }`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                          <span className="text-[9.5px] font-bold text-slate-500">{item.progressStep}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-2 text-right whitespace-nowrap relative">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick Activate Button for Draft Loads */}
                          {(item.status === 'Draft' || item.status === 'DRAFT') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleActivateLoad(item);
                              }}
                              title="Activate Load"
                              className="p-1.5 hover:bg-emerald-100 text-emerald-600 rounded-md transition-colors cursor-pointer"
                            >
                              <Zap className="w-4 h-4 fill-emerald-600" />
                            </button>
                          )}

                          {/* Eye Button: View Load Details */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewLoadClick(item);
                            }}
                            title="View Load Details"
                            className="p-1.5 hover:bg-blue-100 text-slate-500 hover:text-blue-600 rounded-md transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* 3-Dots Button: Dropdown Menu */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenuId(isMenuOpen ? null : item.id);
                            }}
                            title="More Actions"
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-md transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        {/* 3-Dots Action Dropdown Menu */}
                        {isMenuOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-2 top-10 z-30 w-36 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 text-xs text-left animate-in fade-in zoom-in-95"
                          >
                            {(item.status === 'Draft' || item.status === 'DRAFT') && (
                              <button
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  handleActivateLoad(item);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-emerald-50 text-emerald-700 font-bold flex items-center gap-2 cursor-pointer"
                              >
                                <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                                <span>Activate Load</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleEditLoadClick(item)}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                              <span>Edit Load</span>
                            </button>
                            <button
                              onClick={() => handleViewLoadClick(item)}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>View Details</span>
                            </button>
                            <div className="my-1 border-t border-slate-100" />
                            <button
                              onClick={() => handleDeleteLoad(item.id)}
                              className="w-full px-3 py-1.5 hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delete Load</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer Pagination */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
            <span>Showing {filteredLoads.length > 0 ? 1 : 0} to {filteredLoads.length} of {masterLoads.length} loads</span>

            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                &lt;
              </button>
              <button className="w-7 h-7 rounded bg-blue-600 text-white font-bold flex items-center justify-center cursor-pointer">
                1
              </button>
              <button className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 font-semibold flex items-center justify-center cursor-pointer">
                2
              </button>
              <button className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 font-semibold flex items-center justify-center cursor-pointer">
                3
              </button>
              <button className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 font-semibold flex items-center justify-center cursor-pointer">
                4
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 font-semibold flex items-center justify-center cursor-pointer">
                7
              </button>
              <button className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                &gt;
              </button>
            </div>

            <select className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none cursor-pointer">
              <option>10 / page</option>
              <option>25 / page</option>
              <option>50 / page</option>
            </select>
          </div>

        </div>

        </div>
      )}

      {/* =========================================================================
         VIEW INSTRUCTIONS MODAL
         ========================================================================= */}
      {isInstructionsModalOpen && (() => {
        const raw = activeLoadDetails.rawLoad || {};
        const stops = Array.isArray(raw.stops) ? [...raw.stops].sort((a, b) => (a.sequenceIndex || 0) - (b.sequenceIndex || 0)) : [];
        const pickup = stops.find(s => (s.type || '').toUpperCase().includes('PICKUP')) || stops[0];
        const delivery = stops.find(s => (s.type || '').toUpperCase().includes('DROP') || (s.type || '').toUpperCase().includes('DELIV')) || (stops.length > 1 ? stops[stops.length - 1] : null);
        const notes = (raw.notes || '').replace(/\[(AGREED_RATE|DRIVER_PAY|SCHEDULE):[^\]]+\]/g, '').trim();

        return (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setIsInstructionsModalOpen(false)}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-left font-sans animate-scale-up" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="text-purple-600" size={18} />
                  <h3 className="text-sm font-black text-slate-900">Dispatch Special Instructions</h3>
                </div>
                <button onClick={() => setIsInstructionsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Pickup Instructions */}
                <div className="p-3 bg-purple-50/80 border border-purple-200/80 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-purple-950 uppercase tracking-wider text-[10.5px]">
                      Pickup Instructions ({activeLoadDetails.id})
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      {pickup?.address ? pickup.address.split(',')[0] : activeLoadDetails.routeFrom}
                    </span>
                  </div>
                  {pickup?.instructions ? (
                    <p className="text-xs text-purple-900 font-medium leading-relaxed mt-1">
                      {pickup.instructions}
                    </p>
                  ) : (
                    <p className="text-xs text-purple-600/80 italic font-medium mt-1">
                      No special instructions provided for pickup.
                    </p>
                  )}
                  {pickup?.contactName && (
                    <div className="pt-2 mt-2 border-t border-purple-200/60 text-[11px] text-purple-800 font-medium">
                      <span className="font-bold">Site Contact:</span> {pickup.contactName} {pickup.contactPhone ? `• ${pickup.contactPhone}` : ''}
                    </div>
                  )}
                </div>

                {/* Delivery Instructions */}
                <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-blue-950 uppercase tracking-wider text-[10.5px]">
                      Delivery Instructions ({activeLoadDetails.id})
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {delivery?.address ? delivery.address.split(',')[0] : activeLoadDetails.routeTo}
                    </span>
                  </div>
                  {delivery?.instructions ? (
                    <p className="text-xs text-blue-900 font-medium leading-relaxed mt-1">
                      {delivery.instructions}
                    </p>
                  ) : (
                    <p className="text-xs text-blue-600/80 italic font-medium mt-1">
                      No special instructions provided for delivery.
                    </p>
                  )}
                  {delivery?.contactName ? (
                    <div className="pt-2 mt-2 border-t border-blue-200/60 text-[11px] text-blue-800 font-medium">
                      <span className="font-bold">Delivery Contact:</span> {delivery.contactName} {delivery.contactPhone ? `• ${delivery.contactPhone}` : ''}
                    </div>
                  ) : (
                    <div className="pt-2 mt-2 border-t border-blue-200/60 text-[11px] text-blue-600/80 italic font-medium">
                      No on-site delivery contact specified.
                    </div>
                  )}
                </div>

                {/* Dispatch Notes if any */}
                {notes && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[10.5px] block">General Load Notes</span>
                    <p className="text-xs text-slate-700 font-medium whitespace-pre-line leading-relaxed">
                      {notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button onClick={() => setIsInstructionsModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">
                  Close Instructions
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================================
         SWAP TRAILER MODAL (DRIVER & TRUCK CONSIST BREAKDOWN WORKFLOW)
         ========================================================================= */}
      {isSwapTrailerModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsSwapTrailerModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-left font-sans animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <RefreshCcw size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Equipment Breakdown & Trailer Swap</h3>
                  <p className="text-[11px] font-semibold text-slate-500">Load Ref: <span className="font-bold text-slate-800">{activeLoadDetails.id}</span></p>
                </div>
              </div>
              <button onClick={() => setIsSwapTrailerModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Current Consist Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Truck size={13} className="text-amber-700" /> Current Assigned Equipment Consist
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white/80 rounded-lg p-2 border border-amber-100">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Driver</div>
                  <div className="font-extrabold text-slate-900 truncate">{activeLoadDetails.driver}</div>
                </div>
                <div className="bg-white/80 rounded-lg p-2 border border-amber-100">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Truck (Rego)</div>
                  <div className="font-extrabold text-slate-900 truncate">{activeLoadDetails.vehicle} ({activeLoadDetails.rego})</div>
                </div>
                <div className="bg-white/80 rounded-lg p-2 border border-amber-100">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Current Trailer</div>
                  <div className="font-extrabold text-rose-600 truncate">{activeLoadDetails.trailer || 'None'}</div>
                </div>
              </div>
              <p className="text-[11px] text-amber-800/90 font-medium leading-relaxed">
                ℹ️ Trailer swap updates the paired trailer for this Driver & Truck unit. All active loads on this unit will automatically sync to the new trailer.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Trailer Swap <span className="text-rose-500">*</span></label>
                <select
                  value={swapReason}
                  onChange={e => setSwapReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Breakdown / Roadside Failure">Breakdown / Roadside Failure</option>
                  <option value="Tire Damage / Puncture">Tire Damage / Puncture</option>
                  <option value="Mechanical Defect (Brakes / Lights)">Mechanical Defect (Brakes / Lights)</option>
                  <option value="Depot Yard Staging Swap">Depot Yard Staging Swap</option>
                  <option value="Trailer Capacity / Type Change">Trailer Capacity / Type Change</option>
                  <option value="Scheduled Maintenance Due">Scheduled Maintenance Due</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Breakdown / Swap Location (Optional)</label>
                <input
                  type="text"
                  value={swapLocation}
                  onChange={e => setSwapLocation(e.target.value)}
                  placeholder="e.g. M1 Northbound Exit 24 or Brisbane Yard Bay 4"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Replacement Trailer From Fleet <span className="text-rose-500">*</span></label>
                <select 
                  value={swapSelectedTrailerId} 
                  onChange={e => {
                    setSwapSelectedTrailerId(e.target.value);
                    if (e.target.value) setSwapTrailerInput('');
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Replacement Trailer Unit --</option>
                  {(availableTrailers.length > 0 ? availableTrailers : availableVehicles).map(v => {
                    const label = v.rego ? `${v.rego} (${v.make || ''} ${v.model || ''}`.trim() + ')' : `${v.make || ''} ${v.model || 'Trailer'}`.trim();
                    const statusTag = v.status ? ` • ${v.status}` : '';
                    return (
                      <option key={v.id} value={v.id}>
                        {label} {statusTag}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Or Enter 3rd Party / Manual Trailer Unit ID</label>
                <input
                  type="text"
                  value={swapTrailerInput}
                  onChange={e => {
                    setSwapTrailerInput(e.target.value);
                    if (e.target.value) setSwapSelectedTrailerId('');
                  }}
                  placeholder="e.g. TRL-902 or Custom Rego"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
              <button 
                onClick={() => setIsSwapTrailerModalOpen(false)} 
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmTrailerSwap}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <RefreshCcw size={13} /> Confirm Equipment Swap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         TRANSFER LOAD MODAL (ASSIGN DRIVER & EQUIPMENT UNIT)
         ========================================================================= */}
      {isTransferLoadModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsTransferLoadModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-left font-sans animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                  <Truck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Assign Driver & Equipment Consist</h3>
                  <p className="text-[11px] font-semibold text-slate-500">Load Ref: <span className="font-bold text-slate-800">{activeLoadDetails.id}</span></p>
                </div>
              </div>
              <button onClick={() => setIsTransferLoadModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Live Consist Flow Indicator */}
            {(() => {
              const curDrv = availableDrivers.find(d => String(d.id) === String(selectedAssignDriverId));
              const curVeh = availableVehicles.find(v => String(v.id) === String(selectedAssignVehicleId));
              const curTrl = availableTrailers.find(t => String(t.id) === String(selectedAssignTrailerId)) || 
                             availableVehicles.find(v => String(v.id) === String(selectedAssignTrailerId));
              
              const drvTitle = curDrv ? (curDrv.name || `${curDrv.firstName || ''} ${curDrv.lastName || ''}`.trim() || curDrv.driverCode) : 'Select Driver';
              const vehTitle = curVeh ? `${curVeh.make || ''} ${curVeh.model || ''}`.trim() : 'Select Truck';
              const trlTitle = curTrl ? (curTrl.rego || curTrl.plate || `${curTrl.make || ''} ${curTrl.model || ''}`.trim()) : 'Select Trailer';

              return (
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Live Consist Pairings</div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 gap-1.5">
                    <div className={`flex-1 p-2 rounded-lg border text-center truncate ${selectedAssignDriverId ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-white border-slate-200 text-slate-400'}`}>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">1. Driver</div>
                      <div className="truncate">{drvTitle}</div>
                    </div>
                    <span className="text-slate-400 font-bold">➔</span>
                    <div className={`flex-1 p-2 rounded-lg border text-center truncate ${selectedAssignVehicleId ? 'bg-sky-50 border-sky-200 text-sky-900' : 'bg-white border-slate-200 text-slate-400'}`}>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">2. Truck</div>
                      <div className="truncate">{vehTitle}</div>
                    </div>
                    <span className="text-slate-400 font-bold">➔</span>
                    <div className={`flex-1 p-2 rounded-lg border text-center truncate ${selectedAssignTrailerId ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-white border-slate-200 text-slate-400'}`}>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">3. Trailer</div>
                      <div className="truncate">{trlTitle}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Step 1: Select Driver <span className="text-rose-500">*</span></label>
                <select 
                  value={selectedAssignDriverId} 
                  onChange={e => handleDriverSelectionChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">-- Choose an Available Driver --</option>
                  {availableDrivers.map(d => {
                    const dName = d.name || `${d.firstName || ''} ${d.lastName || ''}`.trim() || d.driverCode || 'Driver';
                    const hasPairedTruck = d.currentVehicle?.[0] ? ` • Truck: ${d.currentVehicle[0].rego || d.currentVehicle[0].make || 'Attached'}` : '';
                    return (
                      <option key={d.id} value={d.id}>
                        {dName} {d.driverCode ? `(${d.driverCode})` : ''} {hasPairedTruck} {d.status ? `• ${d.status}` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Step 2: Select Prime Mover / Truck <span className="text-rose-500">*</span></label>
                <select 
                  value={selectedAssignVehicleId} 
                  onChange={e => handleTruckSelectionChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">-- Choose Truck / Prime Mover --</option>
                  {availableVehicles.filter(v => v.category !== 'TRAILER' && !String(v.make || '').toLowerCase().includes('trailer')).map(v => {
                    const vName = `${v.make || ''} ${v.model || ''}`.trim() || 'Vehicle';
                    const trlAttached = v.assignedTrailerId ? ' • [Trailer Paired]' : '';
                    return (
                      <option key={v.id} value={v.id}>
                        {vName} {v.rego ? `(Rego: ${v.rego})` : ''} {trlAttached}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Step 3: Select or Confirm Trailer Unit</label>
                <select 
                  value={selectedAssignTrailerId} 
                  onChange={e => setSelectedAssignTrailerId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">-- No Trailer / Select Trailer --</option>
                  {(availableTrailers.length > 0 ? availableTrailers : availableVehicles).map(v => {
                    const label = v.rego ? `${v.rego} (${v.make || ''} ${v.model || ''}`.trim() + ')' : `${v.make || ''} ${v.model || 'Trailer'}`.trim();
                    const statusTag = v.status ? ` • ${v.status}` : '';
                    return (
                      <option key={v.id} value={v.id}>
                        {label} {statusTag}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
              <button 
                onClick={() => setIsTransferLoadModalOpen(false)} 
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAssignment} 
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Truck size={14} /> Confirm Consist Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         ADD NOTE MODAL
         ========================================================================= */}
      {isAddNoteModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsAddNoteModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-left font-sans animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="text-indigo-600" size={18} />
                <h3 className="text-sm font-black text-slate-900">Add Dispatcher Note ({selectedLoadId})</h3>
              </div>
              <button onClick={() => setIsAddNoteModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dispatch Note</label>
                <textarea 
                  rows={3} 
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder="Type internal dispatch note or update details..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setIsAddNoteModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">
                Cancel
              </button>
              <button 
                onClick={async () => {
                  const noteContent = newNoteText.trim();
                  if (!noteContent) {
                    triggerToast('Please type a note before saving');
                    return;
                  }
                  const targetId = activeLoadDetails.dbId || activeLoadDetails.id;
                  const currentNotes = activeLoadDetails.rawLoad?.notes || '';
                  const updatedNotes = currentNotes 
                    ? `${currentNotes}\n[Note ${new Date().toLocaleDateString('en-GB')}]: ${noteContent}`
                    : `[Note ${new Date().toLocaleDateString('en-GB')}]: ${noteContent}`;
                  
                  try {
                    await api.patch(`/company-admin/loads/${targetId}`, { notes: updatedNotes }).catch(() => {});
                  } catch (err) {
                    console.warn(err);
                  }

                  setMasterLoads(prev => prev.map(l => {
                    if (l.id === activeLoadDetails.id || l.dbId === targetId) {
                      return {
                        ...l,
                        rawLoad: { ...(l.rawLoad || {}), notes: updatedNotes }
                      };
                    }
                    return l;
                  }));

                  setIsAddNoteModalOpen(false);
                  setNewNoteText('');
                  triggerToast(`Dispatch note saved for load ${activeLoadDetails.id}!`);
                }} 
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
