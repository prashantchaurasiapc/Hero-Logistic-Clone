import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import {
  Search, Filter, Plus, ArrowRight, MoreVertical,
  CheckCircle2, Clock, AlertTriangle, Box, Truck,
  MapPin, Printer, RefreshCw, X, ChevronLeft, ChevronRight,
  Layers, SlidersHorizontal, ArrowUpDown, Eye, Tag, UserCheck,
  ShieldAlert, FileText, Trash2, ArrowUpRight, Check, User
} from 'lucide-react';


const initialLanes = [];

export default function WarehouseLoadLanes() {
  const navigate = useNavigate();
  const location = useLocation();
  const isYard = location.pathname.startsWith('/yard');


  const [lanes, setLanes] = useState([]);
  const [summaryData, setSummaryData] = useState({

    totalLanes: 0,
    activeLanes: 0,
    loadsInProgress: 0,
    readyToDispatch: 0,

    overdueHold: 0
  });

  const [dbDrivers, setDbDrivers] = useState([]);
  const [dbVehicles, setDbVehicles] = useState([]);

  const fetchLanes = async () => {
    try {
      const res = await api.get('/warehouse-portal/load-lanes');
      const data = res.data?.data || res.data;
      if (data) {
        if (data.lanes) setLanes(data.lanes);
        if (data.summary) setSummaryData(data.summary);
      }
    } catch (err) {
      console.error('Failed to fetch load lanes:', err);
    }
  };

  useEffect(() => {
    fetchLanes();

    const fetchOptions = async () => {
      try {
        const optionsRes = await api.get('/warehouse-portal/inbound/form-options');
        if (optionsRes.data?.success) {
          const { drivers, vehicles } = optionsRes.data.data;
          setDbDrivers(drivers || []);
          setDbVehicles(vehicles || []);
        }
      } catch (err) {
        console.warn('Failed to load form options:', err.message);
      }
    };
    fetchOptions();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newLaneName, setNewLaneName] = useState('');
  const [newLaneArea, setNewLaneArea] = useState('Main Yard');
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [selectedLaneToMove, setSelectedLaneToMove] = useState('');
  const [sourceLaneIdToMove, setSourceLaneIdToMove] = useState(null);
  const [toast, setToast] = useState(null);

  const [viewLaneModal, setViewLaneModal] = useState(null);
  const [actionMenuLaneId, setActionMenuLaneId] = useState(null);
  const [assignDriverModal, setAssignDriverModal] = useState(null);
  const [editStatusModal, setEditStatusModal] = useState(null);
  const [driverInput, setDriverInput] = useState('');
  const [vehicleInput, setVehicleInput] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePrintManifest = async (lane) => {
    try {
      showToast(`🖨️ Generating manifest for ${lane.name}...`);
      const res = await api.get(`/warehouse-portal/load-lanes/${lane.id}/manifest`);
      if (res.data.success) {
        const manifest = res.data.data || res.data.manifest;
        const printWindow = window.open('', '', 'width=800,height=600');
        if (!printWindow) {
          showToast('⚠️ Pop-up blocked! Please allow pop-ups to print manifest.', 'error');
          return;
        }

        printWindow.document.write(`
          <html>
            <head>
              <title>Manifest - ${manifest.laneName}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
                th { background-color: #f9f9f9; }
                .summary { margin-bottom: 20px; padding: 15px; background: #f0f4f8; border-radius: 8px; }
              </style>
            </head>
            <body>
              <h1>Load Lane Manifest: ${manifest.laneName}</h1>
              <div class="summary">
                <p><strong>Status:</strong> ${manifest.status}</p>
                <p><strong>Driver:</strong> ${manifest.driverName}</p>
                <p><strong>Vehicle:</strong> ${manifest.vehicleLicense}</p>
                <p><strong>Total Items:</strong> ${manifest.totalItems}</p>
                <p><strong>Date:</strong> ${new Date(manifest.date).toLocaleString()}</p>
              </div>
              <h2>Items</h2>
              <table>
                <thead>
                  <tr>
                    <th>VIN</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Condition</th>
                  </tr>
                </thead>
                <tbody>
                  ${manifest.items.map(i => `
                    <tr>
                      <td>${i.vin}</td>
                      <td>${i.make || 'N/A'}</td>
                      <td>${i.model || 'N/A'}</td>
                      <td>${i.condition || 'N/A'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <script>
                window.onload = () => {
                  window.print();
                  setTimeout(() => window.close(), 500);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to generate manifest', 'error');
    }
  };

  const filteredLanes = lanes.filter(lane => {
    const matchesSearch = !searchQuery ||
      lane.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lane.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lane.loadRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lane.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lane.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || lane.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateLane = async (e) => {
    e.preventDefault();
    if (!newLaneName.trim()) return;
    try {
      await api.post('/warehouse-portal/load-lanes', {
        name: newLaneName,
        area: newLaneArea
      });
      setNewLaneName('');
      setCreateModalOpen(false);
      showToast(`✓ New Load Lane "${newLaneName}" created successfully!`);
      fetchLanes();
    } catch (err) {
      showToast('❌ Failed to create load lane', 'error');
    }
  };

  const handleMoveItems = async (e) => {
    e.preventDefault();
    if (!sourceLaneIdToMove || !selectedLaneToMove) return;

    const targetLane = lanes.find(l => l.name === selectedLaneToMove);
    if (!targetLane) {
      showToast('❌ Target lane not found', 'error');
      return;
    }

    try {
      const res = await api.post('/warehouse-portal/load-lanes/move-items', {
        sourceLaneId: sourceLaneIdToMove,
        targetLaneId: targetLane.id
      });
      if (res.data.success) {
        setMoveModalOpen(false);
        showToast(`✓ Items reassigned to ${selectedLaneToMove} successfully!`);
        fetchLanes();
      }
    } catch (error) {
      console.error(error);
      showToast('❌ Failed to move items', 'error');
    }
  };

  const handleAssignDriver = async (e) => {
    e.preventDefault();
    if (!assignDriverModal) return;
    try {
      await api.patch(`/warehouse-portal/load-lanes/${assignDriverModal.id}/assign`, {
        driverId: driverInput,
        vehicleId: vehicleInput
      });
      showToast(`✓ Driver & Vehicle updated for ${assignDriverModal.name}!`);
      setAssignDriverModal(null);
      setDriverInput('');
      setVehicleInput('');
      fetchLanes();
    } catch (err) {
      showToast('❌ Failed to assign driver', 'error');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!editStatusModal) return;
    try {
      await api.patch(`/warehouse-portal/load-lanes/${editStatusModal.id}/status`, { status: newStatus });
      showToast(`✓ Status updated to "${newStatus}" for ${editStatusModal.name}`);
      setEditStatusModal(null);
      fetchLanes();
    } catch (err) {
      showToast('❌ Failed to update status', 'error');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Ready to Dispatch':
        return 'badge-ready';
      case 'In Progress':
        return 'badge-progress';
      case 'Hold':
        return 'badge-hold';
      case 'Empty':
        return 'badge-empty';
      default:
        return 'badge-empty';
    }
  };

  return (
    <div className="wh-load-lanes-container" onClick={() => setActionMenuLaneId(null)}>
      <style>{`
        .wh-load-lanes-container {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #F8FAFC;
          min-height: 100vh;
          color: #0F172A;
          padding: 24px 32px;
          box-sizing: border-box;
        }

        .wh-dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          font-size: 11.5px;
          font-weight: 700;
          color: #1E293B;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.12s ease;
        }
        .wh-dropdown-item:hover {
          background: #F1F5F9;
        }
        .wh-dropdown-item.danger:hover {
          background: #FEE2E2;
          color: #DC2626;
        }

        /* ── HEADER ── */
        .wh-ll-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          width: 100%;
          gap: 16px;
        }
        .wh-ll-title {
          font-size: 18px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -0.3px;
        }
        .wh-ll-sub {
          font-size: 12px;
          color: #64748B;
          margin-top: 3px;
        }
        .wh-btn-create-lane {
          height: 38px;
          padding: 0 18px;
          border-radius: 8px;
          border: none;
          background: var(--primary-color);
          font-size: 12px;
          font-weight: 800;
          color: #0F172A;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 6px rgba(255,212,0,0.3);
          transition: background 0.15s;
          margin-left: auto;
          flex-shrink: 0;
        }
        .wh-btn-create-lane:hover { background: #E6C000; }

        /* ── STAT CARDS 4-GRID ── */
        .wh-ll-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .wh-ll-stat-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .wh-stat-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wh-stat-icon-box.purple { background: #F3E8FF; color: #7E22CE; }
        .wh-stat-icon-box.amber { background: #FEF3C7; color: #D97706; }
        .wh-stat-icon-box.blue { background: #DBEAFE; color: #2563EB; }
        .wh-stat-icon-box.red { background: #FEE2E2; color: #DC2626; }

        .wh-stat-num {
          font-size: 22px;
          font-weight: 900;
          color: #0F172A;
          line-height: 1;
        }
        .wh-stat-title {
          font-size: 10px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 3px;
        }
        .wh-stat-sub {
          font-size: 10.5px;
          color: #94A3B8;
        }

        /* ── MASTER LAYOUT (LEFT + RIGHT) ── */
        .wh-ll-master-grid {
          display: flex;
          gap: 18px;
          align-items: flex-start;
        }
        .wh-ll-left-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .wh-ll-right-col {
          width: 260px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* ── MAIN CARD ── */
        .wh-ll-main-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        /* ── CONTROLS BAR ── */
        .wh-ll-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          gap: 10px;
          flex-wrap: wrap;
        }
        .wh-ll-search-wrap {
          position: relative;
          flex: 1;
          min-width: 240px;
        }
        .wh-ll-search-inp {
          width: 100%;
          height: 34px;
          padding: 0 12px 0 34px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 11.5px;
          font-weight: 600;
          color: #0F172A;
          outline: none;
          box-sizing: border-box;
        }
        .wh-ll-search-inp:focus { border-color: var(--primary-color); }
        .wh-ll-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .wh-ll-filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wh-btn-filter {
          height: 34px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .wh-btn-filter:hover { background: #F8FAFC; }

        .wh-group-by-select {
          height: 34px;
          padding: 0 8px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 11.5px;
          font-weight: 600;
          color: #0F172A;
          outline: none;
        }

        /* ── TABLE ── */
        .wh-ll-table-wrap {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .wh-ll-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11.5px;
          min-width: 800px;
        }
        .wh-ll-table th {
          padding: 10px 12px;
          font-size: 9px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          text-align: left;
          white-space: nowrap;
        }
        .wh-ll-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
          white-space: nowrap;
        }
        .wh-ll-table tr:hover { background: #F8FAFC; }

        .lane-name-text {
          font-size: 12px;
          font-weight: 800;
          color: #0F172A;
        }
        .lane-area-text {
          font-size: 9.5px;
          color: #64748B;
        }

        /* BADGES */
        .badge-ready {
          background: #DCFCE7;
          color: #15803D;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 9.5px;
          font-weight: 800;
          white-space: nowrap;
          display: inline-block;
        }
        .badge-progress {
          background: #DBEAFE;
          color: #1D4ED8;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 9.5px;
          font-weight: 800;
          white-space: nowrap;
          display: inline-block;
        }
        .badge-hold {
          background: #FEF3C7;
          color: #B45309;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 9.5px;
          font-weight: 800;
          white-space: nowrap;
          display: inline-block;
        }
        .badge-empty {
          background: #F1F5F9;
          color: #64748B;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 9.5px;
          font-weight: 800;
          white-space: nowrap;
          display: inline-block;
        }

        .btn-view-lane {
          height: 26px;
          padding: 0 10px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 10.5px;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
        }
        .btn-view-lane:hover { background: #F1F5F9; }

        .btn-more-lane {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 4px;
        }
        .btn-more-lane:hover { color: #0F172A; }

        /* PAGINATION FOOTER */
        .wh-ll-table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 10px;
          font-size: 11px;
          color: #64748B;
        }
        .wh-ll-pager {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .wh-pager-btn {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #0F172A;
        }
        .wh-pager-btn.active {
          background: var(--primary-color);
          border-color: var(--primary-color);
          font-weight: 800;
        }

        /* ── RIGHT SIDEBAR CARDS ── */
        .wh-side-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .wh-side-title {
          font-size: 10px;
          font-weight: 900;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
          padding-bottom: 4px;
          border-bottom: 1px solid #F1F5F9;
        }

        /* DONUT CHART SIMULATION */
        .wh-donut-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .wh-donut-chart {
          position: relative;
          width: 70px;
          height: 70px;
          flex-shrink: 0;
        }
        .wh-donut-center {
          position: absolute;
          inset: 12px;
          background: #FFFFFF;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
        }

        .wh-legend-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 10px;
        }
        .wh-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .wh-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .wh-side-link {
          font-size: 10.5px;
          font-weight: 700;
          color: #2563EB;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 6px;
        }

        /* UPCOMING DISPATCHES */
        .wh-disp-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid #F1F5F9;
          font-size: 10.5px;
        }
        .wh-disp-row:last-child { border-bottom: none; }
        .wh-disp-load { font-weight: 800; color: #0F172A; }
        .wh-disp-lane { color: #64748B; font-size: 9.5px; }
        .wh-disp-time { color: #2563EB; font-weight: 700; font-size: 9.5px; }

        /* QUICK ACTIONS */
        .wh-qa-btn {
          width: 100%;
          padding: 7px 10px;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          font-size: 11px;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          transition: background 0.15s;
        }
        .wh-qa-btn:hover { background: #FFFFFF; border-color: var(--primary-color); }

        /* HELP */
        .wh-help-text {
          font-size: 10px;
          color: #64748B;
          line-height: 1.4;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        /* MODAL */
        .wh-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .wh-modal-box {
          background: #FFFFFF;
          border-radius: 12px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .wh-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          border-bottom: 1px solid #E2E8F0;
        }
        .wh-modal-body { padding: 18px; display: flex; flex-direction: column; gap: 12px; }
        .wh-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 12px 18px;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
        }

        .wh-ll-table-wrap::-webkit-scrollbar {
          height: 6px;
        }
        .wh-ll-table-wrap::-webkit-scrollbar-track {
          background: #F1F5F9;
        }
        .wh-ll-table-wrap::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }

        @media (max-width: 1024px) {
          .wh-ll-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .wh-ll-master-grid { flex-direction: column; width: 100%; }
          .wh-ll-right-col { width: 100%; }
        }
        @media (max-width: 640px) {
          .wh-load-lanes-container { padding: 10px; width: 100%; max-width: 100vw; box-sizing: border-box; }
          .wh-ll-master-grid { width: 100%; max-width: 100%; box-sizing: border-box; }
          .wh-ll-left-col { width: 100%; min-width: 0; max-width: 100%; box-sizing: border-box; }
          .wh-ll-main-card { width: 100%; min-width: 0; max-width: 100%; box-sizing: border-box; overflow: hidden; }
          .wh-ll-stats-grid { grid-template-columns: 1fr; }
          .wh-ll-header-row { flex-direction: column; align-items: flex-start; gap: 10px; }
          .wh-btn-create-lane { width: 100%; height: 38px; justify-content: center; }
          .wh-ll-controls-bar { flex-direction: column; align-items: stretch; gap: 10px; }
          .wh-ll-search-wrap { width: 100%; min-width: 0; }
          .wh-ll-filter-group { width: 100%; justify-content: space-between; }
          .wh-ll-table-wrap { width: 100%; display: block; overflow-x: auto !important; -webkit-overflow-scrolling: touch; box-sizing: border-box; }
          .wh-ll-table { min-width: 800px; }
          .wh-ll-table th, .wh-ll-table td { white-space: nowrap; }
        }
      `}</style>

      {/* PAGE HEADER */}
      <div className="wh-ll-header-row flex flex-row justify-between items-center w-full">
        <div>
          <h1 className="wh-ll-title">LOAD LANES (STAGING)</h1>
          <p className="wh-ll-sub">Manage staging areas and monitor loads/items waiting for dispatch.</p>
        </div>
        <button className="wh-btn-create-lane ml-auto flex-shrink-0" onClick={() => setCreateModalOpen(true)}>
          <Plus size={14} />
          <span>Create Load Lane</span>
        </button>
      </div>

      {/* STAT CARDS ROW */}
      <div className="wh-ll-stats-grid">
        <div className="wh-ll-stat-card">
          <div className="wh-stat-icon-box purple">
            <Layers size={20} />
          </div>
          <div>
            <div className="wh-stat-title">TOTAL LOAD LANES</div>

            <div className="wh-stat-num">{summaryData.totalLanes}</div>
            <div className="wh-stat-sub">Active lanes</div>

          </div>
        </div>

        <div className="wh-ll-stat-card">
          <div className="wh-stat-icon-box amber">
            <Truck size={20} />
          </div>
          <div>
            <div className="wh-stat-title">LOADS IN PROGRESS</div>

            <div className="wh-stat-num">{summaryData.loadsInProgress}</div>

            <div className="wh-stat-sub">Across all lanes</div>
          </div>
        </div>

        <div className="wh-ll-stat-card">
          <div className="wh-stat-icon-box blue">
            <Box size={20} />
          </div>
          <div>
            <div className="wh-stat-title">READY TO DISPATCH</div>

            <div className="wh-stat-num">{summaryData.readyToDispatch}</div>

            <div className="wh-stat-sub">Waiting for pickup</div>
          </div>
        </div>

        <div className="wh-ll-stat-card">
          <div className="wh-stat-icon-box red">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="wh-stat-title">OVERDUE / HOLD</div>

            <div className="wh-stat-num">{summaryData.overdueHold}</div>

            <div className="wh-stat-sub">Requires attention</div>
          </div>
        </div>
      </div>

      {/* MASTER GRID LAYOUT */}
      <div className="wh-ll-master-grid">

        {/* LEFT COLUMN MAIN TABLE */}
        <div className="wh-ll-left-col">
          <div className="wh-ll-main-card">

            {/* CONTROLS BAR */}
            <div className="wh-ll-controls-bar">
              <div className="wh-ll-search-wrap">
                <Search size={14} className="wh-ll-search-icon" />
                <input
                  type="text"
                  placeholder="Search lane, load no., trailer, driver, customer, reference..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="wh-ll-search-inp"
                />
              </div>

              <div className="wh-ll-filter-group">
                <div style={{ position: 'relative' }}>
                  <button className="wh-btn-filter" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                    <Filter size={13} />
                    <span>Filter: {statusFilter}</span>
                  </button>

                  {showFilterDropdown && (
                    <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 4px)',
                      background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '6px', zIndex: 100, minWidth: '150px'
                    }}>
                      {['All', 'Ready to Dispatch', 'In Progress', 'Hold', 'Empty'].map(st => (
                        <div
                          key={st}
                          style={{
                            padding: '6px 10px', fontSize: '11px', fontWeight: 600,
                            cursor: 'pointer', borderRadius: '4px',
                            background: statusFilter === st ? '#FEF3C7' : 'transparent',
                            color: statusFilter === st ? '#D97706' : '#0F172A'
                          }}
                          onClick={() => { setStatusFilter(st); setShowFilterDropdown(false); }}
                        >
                          {st}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Group by:</span>
                <select className="wh-group-by-select">
                  <option value="Status">Status</option>
                  <option value="Area">Area</option>
                </select>
              </div>
            </div>

            {/* TABLE */}
            <div className="wh-ll-table-wrap">
              <table className="wh-ll-table">
                <thead>
                  <tr>
                    <th>LANE / AREA</th>
                    <th>STATUS</th>
                    <th>LOADS</th>
                    <th>CURRENT LOAD / REFERENCE</th>
                    <th>TRAILER / VEHICLE</th>
                    <th>DRIVER</th>
                    <th>EST. DISPATCH</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLanes.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
                        No load lanes found matching search or filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLanes.map(lane => (
                      <tr key={lane.id}>
                        <td>
                          <div>
                            <div className="lane-name-text">{lane.name}</div>
                            <div className="lane-area-text">{lane.area}</div>
                          </div>
                        </td>
                        <td>
                          <span className={getStatusBadgeClass(lane.status)}>
                            {lane.status}
                          </span>
                        </td>
                        <td className="font-bold text-slate-900">{lane.loadsCount}</td>
                        <td>
                          {lane.loadRef !== '-' ? (
                            <div>
                              <div className="font-bold text-slate-900">{lane.loadRef}</div>
                              <div className="text-[9.5px] text-slate-500 font-mono">{lane.subRef}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td>
                          {lane.vehicle !== '-' ? (
                            <div>
                              <div className="font-semibold text-slate-800">{lane.vehicle}</div>
                              <div className="text-[9.5px] text-slate-500">{lane.vehicleType}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td>
                          {lane.driver !== '-' ? (
                            <span 
                              className="font-semibold text-slate-900 cursor-pointer hover:underline"
                            >
                              {lane.driver}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="font-medium text-slate-700">{lane.estDispatch}</td>
                        <td style={{ textAlign: 'right', position: 'relative' }}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="btn-view-lane"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewLaneModal(lane);
                              }}
                            >
                              View
                            </button>
                            <button
                              className="btn-more-lane"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActionMenuLaneId(actionMenuLaneId === lane.id ? null : lane.id);
                              }}
                            >
                              <MoreVertical size={14} />
                            </button>

                            {/* 3-DOT ACTION MENU POPUP */}
                            {actionMenuLaneId === lane.id && (
                              <div
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  top: 'calc(100% + 4px)',
                                  background: '#FFFFFF',
                                  border: '1px solid #CBD5E1',
                                  borderRadius: '10px',
                                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                                  padding: '6px',
                                  zIndex: 1000,
                                  minWidth: '185px',
                                  textAlign: 'left'
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div
                                  className="wh-dropdown-item"
                                  onClick={() => {
                                    setViewLaneModal(lane);
                                    setActionMenuLaneId(null);
                                  }}
                                >
                                  <Eye size={13} className="text-blue-600" />
                                  <span>View Lane Details</span>
                                </div>

                                {!isYard && (
                                  <div
                                    className="wh-dropdown-item"
                                    onClick={() => {
                                      setAssignDriverModal(lane);
                                      setDriverInput(lane.driverId || '');
                                      setVehicleInput(lane.vehicleId || '');
                                      setActionMenuLaneId(null);
                                    }}
                                  >
                                    <UserCheck size={13} className="text-emerald-600" />
                                    <span>Assign Driver & Vehicle</span>
                                  </div>
                                )}
                                {!isYard && (
                                  <div
                                    className="wh-dropdown-item"
                                    onClick={() => {
                                      setEditStatusModal(lane);
                                      setActionMenuLaneId(null);
                                    }}
                                  >
                                    <Tag size={13} className="text-amber-600" />
                                    <span>Update Lane Status</span>
                                  </div>
                                )}

                                <div
                                  className="wh-dropdown-item"
                                  onClick={() => {
                                    setSourceLaneIdToMove(lane.id);
                                    if (lanes.length > 1) {
                                      const otherLane = lanes.find(l => l.id !== lane.id);
                                      setSelectedLaneToMove(otherLane ? otherLane.name : '');
                                    }
                                    setMoveModalOpen(true);
                                    setActionMenuLaneId(null);
                                  }}
                                >
                                  <ArrowRight size={13} className="text-purple-600" />
                                  <span>Move Items Here</span>
                                </div>

                                <div
                                  className="wh-dropdown-item"
                                  onClick={() => {
                                    handlePrintManifest(lane);
                                    setActionMenuLaneId(null);
                                  }}
                                >
                                  <Printer size={13} className="text-slate-600" />
                                  <span>Print Lane Manifest</span>
                                </div>

                                <div style={{ height: '1px', background: '#F1F5F9', margin: '4px 0' }} />

                                <div
                                  className="wh-dropdown-item text-red-600"
                                  onClick={async () => {
                                    setActionMenuLaneId(null);
                                    if (window.confirm(`Are you sure you want to clear ${lane.name}?`)) {
                                      try {
                                        await api.post(`/warehouse-portal/load-lanes/${lane.id}/clear`);
                                        showToast(`Cleared & released ${lane.name}`);
                                        fetchLanes();
                                      } catch (err) {
                                        showToast('Failed to clear lane', 'error');
                                      }
                                    }
                                  }}
                                >
                                  <LogOut size={13} />
                                  <span>Clear & Release</span>
                                </div>
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

            {/* TABLE FOOTER */}
            <div className="wh-ll-table-footer">
              <div>
                Rows per page: <strong>10</strong>
              </div>
              <div>
                1–{filteredLanes.length} of {lanes.length}
              </div>
              <div className="wh-ll-pager">
                <button className="wh-pager-btn"><ChevronLeft size={14} /></button>
                <button className="wh-pager-btn active">1</button>
                <button className="wh-pager-btn"><ChevronRight size={14} /></button>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="wh-ll-right-col">

          {/* LANE SUMMARY */}
          <div className="wh-side-card">
            <div className="wh-side-title">LANE SUMMARY</div>

            <div className="wh-donut-wrap">
              <div className="wh-donut-chart">
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>

                  <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="100 100" />
                </svg>
                <div className="wh-donut-center">
                  <span style={{ fontSize: '13px', fontWeight: 900 }}>{summaryData.totalLanes}</span>

                  <span style={{ fontSize: '7px', color: '#64748B' }}>Lanes</span>
                </div>
              </div>

              <div className="wh-legend-list">
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#22C55E' }} />

                  <span>Ready <strong>{summaryData.readyToDispatch}</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#3B82F6' }} />
                  <span>In Progress <strong>{summaryData.loadsInProgress}</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#F59E0B' }} />
                  <span>Hold <strong>{summaryData.overdueHold}</strong></span>

                </div>
              </div>
            </div>

            <div 
              className="wh-side-link"
              onClick={() => navigate(isYard ? '/yard/map' : '/warehouse/warehouse-yard-map')}
            >
              <MapPin size={12} />
              <span>View lane map</span>
            </div>
          </div>

          {/* UPCOMING DISPATCHES */}
          <div className="wh-side-card">
            <div className="flex justify-between items-center mb-1">
              <div className="wh-side-title" style={{ margin: 0, padding: 0, border: 'none' }}>
                UPCOMING DISPATCHES
              </div>
              <span className="wh-side-link" style={{ fontSize: '9.5px', marginTop: 0 }}>View all</span>
            </div>

            <div style={{ marginTop: '8px' }}>

              {lanes.filter(l => l.status === 'In Progress' || l.status === 'Ready').slice(0, 5).length === 0 ? (
                <p style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center', padding: '12px 0' }}>No upcoming dispatches</p>
              ) : (
                lanes.filter(l => l.status === 'In Progress' || l.status === 'Ready').slice(0, 5).map((l, i) => (
                  <div className="wh-disp-row" key={i}>
                    <div>
                      <div className="wh-disp-load">{l.loadRef || l.name}</div>
                      <div className="wh-disp-lane">{l.name}</div>
                    </div>
                    <div className="wh-disp-time">{l.estDispatch || '—'}</div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="wh-side-card">
            <div className="wh-side-title">QUICK ACTIONS</div>

            <button className="wh-qa-btn" onClick={() => setCreateModalOpen(true)}>
              <Plus size={14} className="text-amber-500" />
              <span>Create Load Lane</span>
            </button>

            <button className="wh-qa-btn" onClick={() => setMoveModalOpen(true)}>
              <ArrowRight size={14} className="text-blue-500" />
              <span>Move Items to Lane</span>
            </button>

            <button className="wh-qa-btn" onClick={() => navigate('/warehouse/dispatch-ready')}>
              <Truck size={14} className="text-green-500" />
              <span>View Dispatch Ready</span>
            </button>

            <button className="wh-qa-btn" onClick={() => alert('Printing Lane Report...')}>
              <Printer size={14} className="text-slate-500" />
              <span>Print Lane Report</span>
            </button>
          </div>

          {/* HELP */}
          <div className="wh-side-card" style={{ background: '#F8FAFC' }}>
            <div className="wh-side-title">HELP</div>

            <div className="wh-help-text">
              <div>• Use lanes to stage loads/items before dispatch.</div>
              <div>• Keep lanes organised for quick loading.</div>
              <div>• Drag and drop loads to reorder if needed.</div>
              <div>• Overdue items will appear in Hold status.</div>
            </div>
          </div>

        </div>

      </div>

      {/* CREATE LANE MODAL */}
      {createModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h3 className="font-extrabold text-sm text-slate-900">Create New Load Lane</h3>
              <button onClick={() => setCreateModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateLane} className="wh-modal-body">
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Lane Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Lane 9"
                  value={newLaneName}
                  onChange={e => setNewLaneName(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Assigned Area *</label>
                <select
                  value={newLaneArea}
                  onChange={e => setNewLaneArea(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                >
                  <option value="Main Yard">Main Yard</option>
                  <option value="Overflow Yard">Overflow Yard</option>
                  <option value="DG Staging Area">DG Staging Area</option>
                  <option value="Container Bay">Container Bay</option>
                  <option value="Returns Lane">Returns Lane</option>
                </select>
              </div>
              <div className="wh-modal-footer">
                <button type="button" className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600" onClick={() => setCreateModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-400 rounded text-xs font-extrabold text-slate-900">Create Lane</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW LANE DETAILS MODAL */}
      {viewLaneModal && (
        <div className="wh-modal-overlay" onClick={() => setViewLaneModal(null)}>
          <div className="wh-modal-box" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header" style={{ background: '#0F172A', color: '#FFFFFF', padding: '14px 18px' }}>
              <div className="flex items-center gap-3">
                <div style={{ background: 'var(--primary-color)', color: '#0F172A', fontWeight: 900, fontSize: '13px', padding: '4px 10px', borderRadius: '6px' }}>
                  {viewLaneModal.name}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white" style={{ margin: 0 }}>{viewLaneModal.area}</h3>
                  <div className="text-[10px] text-slate-400 font-medium">Lane Details & Staged Dispatch Info</div>
                </div>
              </div>
              <button onClick={() => setViewLaneModal(null)} className="p-1 hover:bg-slate-800 rounded">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '80vh', overflowY: 'auto' }}>

              {/* STATUS & CARRIER HEADER CARD */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase">Status</div>
                  <span className={getStatusBadgeClass(viewLaneModal.status)} style={{ display: 'inline-block', marginTop: '4px' }}>
                    {viewLaneModal.status}
                  </span>
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase text-right">Est. Dispatch</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">{viewLaneModal.estDispatch}</div>
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase text-right">Loads Staged</div>
                  <div className="text-sm font-black text-slate-900 text-right mt-1">{viewLaneModal.loadsCount}</div>
                </div>
              </div>

              {/* GRID INFO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                
                {/* LOAD REF CARD */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                  <div className="flex items-center gap-1.5 mb-2 text-blue-600 font-extrabold text-xs">
                    <Box size={14} />
                    <span>LOAD & REFERENCE</span>
                  </div>
                  <div className="text-sm font-black text-slate-900">{viewLaneModal.loadRef}</div>
                  <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">Sub-Ref: {viewLaneModal.subRef}</div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-[11px]">
                    <span className="text-slate-500">Staging Status:</span>
                    <span className="font-bold text-slate-800">Verified & Sealed</span>
                  </div>
                </div>

                {/* TRANSPORT & DRIVER CARD */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                  <div className="flex items-center gap-1.5 mb-2 text-emerald-600 font-extrabold text-xs">
                    <Truck size={14} />
                    <span>DRIVER & VEHICLE</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{viewLaneModal.driver !== '-' ? viewLaneModal.driver : 'Unassigned'}</div>
                  <div className="text-[10.5px] text-slate-600 mt-0.5">{viewLaneModal.vehicle !== '-' ? viewLaneModal.vehicle : 'Vehicle pending'}</div>
                  <div className="text-[9.5px] text-slate-400">{viewLaneModal.vehicleType}</div>
                </div>

              </div>

              {/* CARGO STAGED ITEMS SUMMARY */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-extrabold text-slate-900 uppercase">Staged Cargo & Items</span>
                  <span className="text-[10px] font-bold text-slate-500">{viewLaneModal.currentItemsCount || 0} Items Staged</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {viewLaneModal.assignedItems && viewLaneModal.assignedItems.length > 0 ? viewLaneModal.assignedItems.map((item, idx) => (
                    <div key={idx} style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                      <div className="flex items-center gap-2">
                        <Box size={14} className="text-amber-500" />
                        <div>
                          <div className="font-bold text-slate-900">{item.title || item.name}</div>
                          <div className="text-[9.5px] text-slate-500 font-mono">{item.vin || item.sku || ''}</div>
                        </div>
                      </div>
                      <span className="badge-ready">{item.status || 'Ready'}</span>
                    </div>
                  )) : (
                    <div className="text-xs text-slate-500 italic py-2 text-center">No items currently staged in this lane.</div>
                  )}
                </div>
              </div>

              {/* QUICK ACTIONS INSIDE VIEW MODAL */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                {!isYard && (
                  <button 
                    className="flex-1 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-lg font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                    onClick={() => {
                      setAssignDriverModal(viewLaneModal);
                      setDriverInput(viewLaneModal.driverId || '');
                      setVehicleInput(viewLaneModal.vehicleId || '');
                      setViewLaneModal(null);
                    }}
                  >
                    <UserCheck size={14} />
                    <span>Assign / Update Driver</span>
                  </button>
                )}

                <button
                  className="px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-xs flex items-center gap-1.5 transition"
                  onClick={() => handlePrintManifest(viewLaneModal)}
                >
                  <Printer size={14} />
                  <span>Print</span>
                </button>

                <button
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-600 rounded-lg font-bold text-xs transition"
                  onClick={() => setViewLaneModal(null)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ASSIGN DRIVER MODAL */}
      {assignDriverModal && (
        <div className="wh-modal-overlay" onClick={() => setAssignDriverModal(null)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h3 className="font-extrabold text-sm text-slate-900">Assign Driver & Vehicle ({assignDriverModal.name})</h3>
              <button onClick={() => setAssignDriverModal(null)}><X size={16} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleAssignDriver} className="wh-modal-body">
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Driver Name *</label>
                <select
                  value={driverInput}
                  onChange={e => setDriverInput(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                  required
                >
                  <option value="">-- Select Driver --</option>
                  {dbDrivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Vehicle / Trailer *</label>
                <select
                  value={vehicleInput}
                  onChange={e => setVehicleInput(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                  required
                >
                  <option value="">-- Select Vehicle --</option>
                  {dbVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div className="wh-modal-footer">
                <button type="button" className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600" onClick={() => setAssignDriverModal(null)}>Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-400 rounded text-xs font-extrabold text-slate-900">Save Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {editStatusModal && (
        <div className="wh-modal-overlay" onClick={() => setEditStatusModal(null)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h3 className="font-extrabold text-sm text-slate-900">Update Status for {editStatusModal.name}</h3>
              <button onClick={() => setEditStatusModal(null)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="wh-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Ready to Dispatch', 'In Progress', 'Hold', 'Empty'].map(st => (
                <button
                  key={st}
                  type="button"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: editStatusModal.status === st ? '2px solid var(--primary-color)' : '1px solid #CBD5E1',
                    background: editStatusModal.status === st ? '#FEF3C7' : '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#0F172A',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleUpdateStatus(st)}
                >
                  <span>{st}</span>
                  {editStatusModal.status === st && <Check size={16} className="text-amber-600" />}
                </button>
              ))}
              <div className="wh-modal-footer" style={{ marginTop: '10px' }}>
                <button type="button" className="px-4 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600" onClick={() => setEditStatusModal(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOVE ITEMS MODAL */}
      {moveModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setMoveModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h3 className="font-extrabold text-sm text-slate-900">Move Items to Lane</h3>
              <button onClick={() => setMoveModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleMoveItems} className="wh-modal-body">
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Target Load Lane *</label>
                <select
                  value={selectedLaneToMove}
                  onChange={e => setSelectedLaneToMove(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                >
                  {lanes.map(l => (
                    <option key={l.id} value={l.name}>{l.name} ({l.area})</option>
                  ))}
                </select>
              </div>
              <div className="wh-modal-footer">
                <button type="button" className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600" onClick={() => setMoveModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-400 rounded text-xs font-extrabold text-slate-900">Move Items</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10,
          padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10,
          zIndex: 99998, boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
        }}>
          <CheckCircle2 size={16} className="text-green-600" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>{toast.msg}</span>
        </div>
      )}

    </div>
  );
}
