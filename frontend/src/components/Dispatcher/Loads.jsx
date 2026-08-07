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
  const [toastMsg, setToastMsg] = useState('');

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
    customer: 'BMW Australia',
    routeFrom: 'Melbourne',
    routeTo: 'Geelong',
    driver: 'John Doe',
    vehicle: 'MAN TGX 26.580',
    trailer: 'TR-01 (10 Car)',
    status: 'In Transit',
    reqDate: '23 May 2026',
    reqTime: '05:00 PM'
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

  const fetchLoads = async () => {
    setIsLoadingLoads(true);
    try {
      // Using generic /loads which retrieves loads from the backend
      const res = await api.get('/loads');
      if (res.data && res.data.success) {
        // Map backend model to the frontend structure
        const formattedLoads = res.data.data.map(dbLoad => {
          // You might have to adjust mapping depending on your exact backend model names
          return {
            id: dbLoad.id || `LD-${Math.floor(Math.random() * 10000)}`,
            dbId: dbLoad.id, // real db ID
            status: dbLoad.status || 'In Transit',
            statusStyle: dbLoad.status === 'In Transit' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              dbLoad.status === 'En Route' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                dbLoad.status === 'At Pickup' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-slate-100 text-slate-700 border-slate-200',
            accentColor: dbLoad.status === 'In Transit' ? 'border-l-emerald-500' :
              dbLoad.status === 'En Route' ? 'border-l-blue-500' :
                dbLoad.status === 'At Pickup' ? 'border-l-amber-500' : 'border-l-slate-400',
            driver: dbLoad.driverName || 'Unassigned',
            driverRole: 'Car Carrier',
            driverAvatar: 'https://ui-avatars.com/api/?name=' + (dbLoad.driverName || 'Unassigned'),
            driverPhone: dbLoad.driverPhone || 'N/A',
            driverStatus: 'On Duty',
            routeFrom: dbLoad.pickupLocation || 'Unknown',
            routeTo: dbLoad.deliveryLocation || 'Unknown',
            customer: dbLoad.customerName || 'Unknown Customer',
            vehicle: dbLoad.vehicleId || 'N/A',
            trailer: dbLoad.trailerId || 'N/A',
            rego: 'NEW-999',
            truckPhoto: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=300',
            reqDate: dbLoad.scheduledDate ? new Date(dbLoad.scheduledDate).toLocaleDateString() : 'N/A',
            reqTime: '05:00 PM',
            progressStep: '3/5',
            activeDotsCount: 3,
            dotColor: 'bg-emerald-500',
            lineColor: 'bg-emerald-500',
            stopsCount: 2,
            itemsCount: dbLoad.loadItems?.length || 0
          };
        });
        setMasterLoads(formattedLoads);
        if (formattedLoads.length > 0) {
          setSelectedLoadId(formattedLoads[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching loads:', error);
      triggerToast('Error fetching loads');
    } finally {
      setIsLoadingLoads(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);
  // Load list end

  // Currently Selected Load details
  const activeLoadDetails = masterLoads.find(l => l.id === selectedLoadId) || masterLoads[0];

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
        activeStatusTab.includes('In Transit') ? load.status === 'In Transit' :
          activeStatusTab.includes('En Route') ? load.status === 'En Route' :
            activeStatusTab.includes('At Pickup') ? load.status === 'At Pickup' :
              activeStatusTab.includes('At Delivery') ? load.status === 'At Delivery' :
                activeStatusTab.includes('On Hold') ? load.status === 'On Hold' : true;

    return matchesSearch && matchesStatusTab;
  });

  // Action Handlers
  const handleCreateLoadSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/loads', {
        status: newLoadForm.status,
        pickupLocation: newLoadForm.routeFrom,
        deliveryLocation: newLoadForm.routeTo,
        customerName: newLoadForm.customer,
        driverName: newLoadForm.driver,
        vehicleId: newLoadForm.vehicle,
        trailerId: newLoadForm.trailer,
        scheduledDate: newLoadForm.reqDate
      });

      if (res.data && res.data.success) {
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
    setIsViewModalOpen(true);
    setOpenActionMenuId(null);
    triggerToast(`Viewing details for Load ${load.id}`);
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
    if (!target) return;
    try {
      const res = await api.delete(`/loads/${target.dbId}`);
      if (res.data && res.data.success) {
        setOpenActionMenuId(null);
        if (selectedLoadId === loadId && masterLoads.length > 1) {
          setSelectedLoadId(masterLoads.find(l => l.id !== loadId)?.id || '');
        }
        triggerToast(`Load ${loadId} deleted successfully!`);
        fetchLoads();
      }
    } catch (error) {
      console.error('Error deleting load:', error);
      triggerToast('Error deleting load');
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
                  <div
                    className="absolute left-6 top-5 -translate-y-1/2 h-0.5 bg-emerald-500 z-0 transition-all duration-500"
                    style={{ width: `${((viewingLoad.activeDotsCount || 3) / 5) * 80}%` }}
                  />
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

          <button
            onClick={() => triggerToast('Opening table column customize modal...')}
            className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span>Columns</span>
          </button>

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
         4. MAIN 2-COLUMN LAYOUT (TABLE + LOAD DETAILS PANEL)
         ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        {/* ------------------------------------------------------------
           LEFT COLUMN: ACTIVE LOADS TABLE (lg:col-span-7)
           ------------------------------------------------------------ */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 shadow-2xs p-3.5 space-y-3">

          {/* Header & Status Tabs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Loads ({filteredLoads.length})</h2>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-200 pb-2 overflow-x-auto">
            {[
              'All (63)',
              'In Transit (38)',
              'En Route to Pickup (10)',
              'At Pickup (6)',
              'At Delivery (5)',
              'On Hold (4)'
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)}
                className={`text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${activeStatusTab === tab
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
                      onClick={() => setSelectedLoadId(item.id)}
                      className={`border-l-4 ${item.accentColor} hover:bg-blue-50/40 transition-colors cursor-pointer relative ${isSelected ? 'bg-blue-50/70 font-medium' : ''
                        }`}
                    >
                      {/* Load ID */}
                      <td className="py-3 px-2 font-bold text-blue-600 whitespace-nowrap">
                        {item.id}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold border ${item.statusStyle}`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Driver */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.driverAvatar}
                            alt={item.driver}
                            className="w-6 h-6 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{item.driver}</span>
                            <span className="text-[9.5px] text-slate-400 font-medium block">{item.driverRole}</span>
                          </div>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <span>{item.routeFrom}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span>{item.routeTo}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-2 font-semibold text-slate-800 whitespace-nowrap">
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
            <span>Showing 1 to {filteredLoads.length} of 63 loads</span>

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

        {/* ------------------------------------------------------------
           RIGHT COLUMN: LOAD DETAILS PANEL (lg:col-span-5)
           ------------------------------------------------------------ */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 space-y-4">

          {/* Top Details Header */}
          <div className="border-b border-slate-100 pb-3 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">LOAD DETAILS</h3>
              <button
                onClick={() => triggerToast('Closing Load Details drawer')}
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Load ID & Status Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">{activeLoadDetails.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${activeLoadDetails.statusStyle}`}>
                  {activeLoadDetails.status}
                </span>
              </div>
              <button
                onClick={() => triggerToast('Opening Chain of Custody manifest...')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Chain of Custody</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Customer & Route subline */}
            <div className="text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">{activeLoadDetails.customer}</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Required Date: <strong className="text-slate-700">{activeLoadDetails.reqDate}, {activeLoadDetails.reqTime}</strong>
                </span>
              </div>
              <div className="text-slate-600 font-semibold flex items-center gap-1">
                <span>{activeLoadDetails.routeFrom}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 inline" />
                <span>{activeLoadDetails.routeTo}</span>
              </div>
            </div>
          </div>

          {/* Sub-tabs Navigation */}
          <div className="flex items-center gap-4 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
            {['Overview', `Stops (${activeLoadDetails.stopsCount})`, `Items / Cars (${activeLoadDetails.itemsCount})`, 'Documents', 'Notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveDetailsTab(tab.split(' ')[0])}
                className={`transition-colors whitespace-nowrap cursor-pointer ${activeDetailsTab === tab.split(' ')[0]
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-2 -mb-[9px]'
                  : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content: Overview */}
          {activeDetailsTab === 'Overview' && (
            <div className="space-y-4 text-left">

              {/* Driver Card & Vehicle Card (Side by Side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Driver Box */}
                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activeLoadDetails.driverAvatar}
                      alt={activeLoadDetails.driver}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{activeLoadDetails.driver}</h4>
                      <span className="text-[10px] font-medium text-slate-500 block">{activeLoadDetails.driverRole}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/60 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {activeLoadDetails.driverStatus}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => triggerToast(`Messaging ${activeLoadDetails.driver}...`)}
                        className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => triggerToast(`Calling ${activeLoadDetails.driver}...`)}
                        className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vehicle Box */}
                <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activeLoadDetails.truckPhoto}
                      alt={activeLoadDetails.vehicle}
                      className="w-11 h-9 rounded object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 truncate max-w-[110px]">{activeLoadDetails.vehicle}</h4>
                      <span className="text-[10px] font-medium text-slate-500 block truncate max-w-[110px]">{activeLoadDetails.trailer}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/60 text-[10px]">
                    <span className="font-bold text-slate-700">{activeLoadDetails.rego}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                      Compliant
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Progress</h4>

                <div className="flex items-center justify-between relative py-2 px-1">
                  {/* Background connecting line */}
                  <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                  <div className="absolute left-6 w-[70%] top-5 -translate-y-1/2 h-0.5 bg-emerald-500 z-0" />

                  {/* Stepper nodes */}
                  {[
                    { title: 'Accepted', date: '21 May, 08:30 AM', icon: Check, state: 'done' },
                    { title: 'En Route', date: '21 May, 09:10 AM', icon: Check, state: 'done' },
                    { title: 'At Pickup', date: '21 May, 10:05 AM', icon: Check, state: 'done' },
                    { title: 'Loaded', date: '21 May, 11:45 AM', icon: Check, state: 'done' },
                    { title: 'In Transit', date: '21 May', icon: Truck, state: 'active' },
                    { title: 'Delivered', date: '', icon: Package, state: 'pending' }
                  ].map((step, idx) => {
                    const IconComp = step.icon;
                    return (
                      <div key={idx} className="flex flex-col items-center z-10 space-y-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step.state === 'done' ? 'bg-emerald-500 text-white' :
                          step.state === 'active' ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md' :
                            'bg-white border-2 border-slate-200 text-slate-300'
                          }`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-[10px] font-bold ${step.state === 'active' ? 'text-blue-600' : 'text-slate-700'
                          }`}>{step.title}</span>
                        <span className="text-[8px] text-slate-400 font-medium">{step.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Route & Tracking Map Card */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Route & Tracking</h4>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {/* Map Box */}
                  <div className="sm:col-span-7 h-48 rounded-lg overflow-hidden border border-slate-200 relative">
                    <div ref={mapContainerRef} className="w-full h-full" />
                  </div>

                  {/* Right Map Actions Panel */}
                  <div className="sm:col-span-5 space-y-1.5 text-left flex flex-col justify-center">
                    <button
                      onClick={() => triggerToast('Opening live tracking map...')}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-[10.5px] font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>View Live Map</span>
                    </button>
                    <button
                      onClick={() => triggerToast('Opening navigation route...')}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-[10.5px] font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Open Route</span>
                    </button>
                    <button
                      onClick={() => triggerToast('Fetching GPS breadcrumbs...')}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-[10.5px] font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>View GPS History</span>
                    </button>
                    <button
                      onClick={() => triggerToast('Location request sent to driver...')}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-[10.5px] font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Send Location</span>
                    </button>
                    <button
                      onClick={() => triggerToast('GPS telemetry refreshed...')}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-[10.5px] font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>Refresh GPS</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Actions</h4>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => triggerToast(`Messaging ${activeLoadDetails.driver}...`)}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10.5px] font-semibold text-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>Message Driver</span>
                  </button>

                  <button
                    onClick={() => triggerToast(`Calling ${activeLoadDetails.driver}...`)}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10.5px] font-semibold text-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Call Driver</span>
                  </button>

                  <button
                    onClick={() => triggerToast('Opening driver dispatch instructions...')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10.5px] font-semibold text-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>View Instructions</span>
                  </button>

                  <button
                    onClick={() => triggerToast('Opening trailer swap interface...')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10.5px] font-semibold text-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <RefreshCcw className="w-4 h-4 text-amber-600" />
                    <span>Swap Trailer</span>
                  </button>

                  <button
                    onClick={() => triggerToast('Opening load transfer wizard...')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10.5px] font-semibold text-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>Transfer Load</span>
                  </button>

                  <button
                    onClick={() => triggerToast('Opening dispatch note entry...')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10.5px] font-semibold text-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                    <span>Add Note</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeDetailsTab !== 'Overview' && (
            <div className="p-8 text-center text-slate-400 font-medium text-xs border border-dashed border-slate-200 rounded-xl">
              <span>Displaying {activeDetailsTab} section details for load {selectedLoadId}...</span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
