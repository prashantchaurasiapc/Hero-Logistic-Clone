import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Filter, Plus, ArrowRight, MoreVertical,
  CheckCircle2, Clock, AlertTriangle, Box, Truck,
  MapPin, Printer, RefreshCw, X, ChevronLeft, ChevronRight,
  Download, Send, FileText, User, ChevronDown
} from 'lucide-react';

const initialLoads = [
  {
    id: '1',
    loadRef: 'LD-3985',
    poRef: 'PO: 45001234',
    customer: 'ABC Motors',
    vehicle: 'TRK-101 / TRL-309',
    vehicleType: 'Car Carrier',
    driver: 'John Smith',
    phone: '0411 111 111',
    lane: 'Lane 1',
    area: 'Main Yard',
    readySince: '21/07/2026 10:45 AM',
    status: 'Ready'
  },
  {
    id: '2',
    loadRef: 'LD-3986',
    poRef: 'PO: 45001235',
    customer: 'National Fleet',
    vehicle: 'TRK-102 / TRL-310',
    vehicleType: 'Car Carrier',
    driver: 'Mark Davis',
    phone: '0412 222 222',
    lane: 'Lane 2',
    area: 'Main Yard',
    readySince: '21/07/2026 11:05 AM',
    status: 'Awaiting Pickup'
  },
  {
    id: '3',
    loadRef: 'LD-3984',
    poRef: 'PO: 45001236',
    customer: 'XYZ Imports',
    vehicle: 'TRK-103 / TRL-311',
    vehicleType: 'Car Carrier',
    driver: 'Peter Brown',
    phone: '0403 333 333',
    lane: 'Lane 3',
    area: 'Main Yard',
    readySince: '21/07/2026 11:20 AM',
    status: 'Ready'
  },
  {
    id: '4',
    loadRef: 'LD-3987',
    poRef: 'PO: 45001237',
    customer: 'City Cars',
    vehicle: 'TRK-104 / TRL-312',
    vehicleType: 'Car Carrier',
    driver: 'Michael Lee',
    phone: '0414 444 444',
    lane: 'Lane 4',
    area: 'Overflow Yard',
    readySince: '21/07/2026 11:40 AM',
    status: 'Awaiting Pickup'
  },
  {
    id: '5',
    loadRef: 'LD-3990',
    poRef: 'PO: 45001238',
    customer: 'Tech Supplies',
    vehicle: 'TRK-105',
    vehicleType: 'General Freight',
    driver: 'Ravi Patel',
    phone: '0415 555 555',
    lane: 'Lane 5',
    area: 'DG Staging',
    readySince: '21/07/2026 12:05 PM',
    status: 'Hold'
  },
  {
    id: '6',
    loadRef: 'LD-3991',
    poRef: 'PO: 45001239',
    customer: 'Oceanic Freight',
    vehicle: 'TRK-201 / TRL-408',
    vehicleType: 'Container',
    driver: 'Tom Wilson',
    phone: '0415 666 666',
    lane: 'Lane 6',
    area: 'Container Bay',
    readySince: '21/07/2026 12:25 PM',
    status: 'Ready'
  },
  {
    id: '7',
    loadRef: 'LD-3992',
    poRef: 'PO: 45001240',
    customer: 'Hazchem Pty Ltd',
    vehicle: 'TRK-106',
    vehicleType: 'Dangerous Goods',
    driver: 'Ahmed Khan',
    phone: '0417 777 777',
    lane: 'Lane 5',
    area: 'DG Staging',
    readySince: '21/07/2026 12:40 PM',
    status: 'Hold'
  },
  {
    id: '8',
    loadRef: 'LD-3993',
    poRef: 'PO: 45001241',
    customer: 'Builders Hub',
    vehicle: 'TRK-107',
    vehicleType: '',
    driver: 'Daniel Green',
    phone: '0418 888 888',
    lane: 'Lane 2',
    area: 'Main Yard',
    readySince: '21/07/2026 01:10 PM',
    status: 'Ready'
  }
];

export default function WarehouseOutbound() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loads, setLoads] = useState(initialLoads);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [laneFilter, setLaneFilter] = useState('All');
  const [driverFilter, setDriverFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Today');
  
  const [showFilters, setShowFilters] = useState(false);
  const [createLoadModalOpen, setCreateLoadModalOpen] = useState(false);
  const [markDispatchedModalOpen, setMarkDispatchedModalOpen] = useState(false);
  const [selectedLoadToDispatch, setSelectedLoadToDispatch] = useState('LD-3985');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredLoads = loads.filter(item => {
    const matchesSearch = !searchQuery ||
      item.loadRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lane.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesLane = laneFilter === 'All' || item.lane === laneFilter;
    const matchesDriver = driverFilter === 'All' || item.driver === driverFilter;

    return matchesSearch && matchesStatus && matchesLane && matchesDriver;
  });

  const handleRefresh = () => {
    showToast('Refreshing dispatch list...');
  };

  const handleExport = () => {
    showToast('Exporting dispatch ready manifest (CSV)...');
  };

  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    setLoads(loads.filter(l => l.loadRef !== selectedLoadToDispatch));
    setMarkDispatchedModalOpen(false);
    showToast(`✓ Load ${selectedLoadToDispatch} marked as Dispatched & departed!`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Ready':
        return 'badge-ready';
      case 'Awaiting Pickup':
        return 'badge-awaiting';
      case 'Hold':
        return 'badge-hold';
      default:
        return 'badge-ready';
    }
  };

  return (
    <div className="wh-dispatch-container">
      <style>{`
        .wh-dispatch-container {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #F8FAFC;
          min-height: 100vh;
          color: #0F172A;
          padding: 20px 24px;
          box-sizing: border-box;
        }

        /* ── HEADER ROW ── */
        .wh-dp-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .wh-dp-title {
          font-size: 18px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -0.3px;
        }
        .wh-dp-sub {
          font-size: 12px;
          color: #64748B;
          margin-top: 2px;
        }

        .wh-dp-actions-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wh-btn-refresh {
          height: 36px;
          padding: 0 14px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s;
        }
        .wh-btn-refresh:hover { background: #F1F5F9; }

        .wh-btn-export {
          height: 36px;
          padding: 0 18px;
          border-radius: 8px;
          border: none;
          background: #FFD400;
          font-size: 12px;
          font-weight: 800;
          color: #0F172A;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 6px rgba(255,212,0,0.3);
          transition: background 0.15s;
        }
        .wh-btn-export:hover { background: #E6C000; }

        /* ── STAT CARDS GRID ── */
        .wh-dp-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }
        .wh-dp-stat-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .wh-dp-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wh-dp-icon-box.blue { background: #DBEAFE; color: #2563EB; }
        .wh-dp-icon-box.green { background: #DCFCE7; color: #16A34A; }
        .wh-dp-icon-box.amber { background: #FEF3C7; color: #D97706; }
        .wh-dp-icon-box.red { background: #FEE2E2; color: #DC2626; }

        .wh-dp-stat-num {
          font-size: 22px;
          font-weight: 900;
          color: #0F172A;
          line-height: 1;
        }
        .wh-dp-stat-title {
          font-size: 10px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 3px;
        }
        .wh-dp-stat-sub {
          font-size: 10.5px;
          color: #94A3B8;
        }

        /* ── MASTER LAYOUT ── */
        .wh-dp-master-grid {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .wh-dp-left-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .wh-dp-right-col {
          width: 250px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .wh-dp-main-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        /* ── SEARCH & FILTER BAR ── */
        .wh-dp-search-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .wh-dp-search-wrap {
          position: relative;
          flex: 1;
        }
        .wh-dp-search-inp {
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
        .wh-dp-search-inp:focus { border-color: #FFD400; }
        .wh-dp-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .wh-btn-filters-toggle {
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
        .wh-btn-filters-toggle:hover { background: #F8FAFC; }

        /* FILTER ROW DROPDOWNS */
        .wh-dp-filters-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
          padding: 10px 12px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
        }
        .wh-filter-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .wh-filter-lbl {
          font-size: 9px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
        }
        .wh-filter-sel {
          height: 28px;
          padding: 0 8px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 11px;
          font-weight: 600;
          color: #0F172A;
          outline: none;
        }

        /* ── TABLE ── */
        .wh-dp-table-wrap {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .wh-dp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11.5px;
          min-width: 820px;
        }
        .wh-dp-table th {
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
        .wh-dp-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
          white-space: nowrap;
        }
        .wh-dp-table tr:hover { background: #F8FAFC; }

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
        .badge-awaiting {
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
        .badge-vehicle {
          background: #F1F5F9;
          color: #475569;
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 700;
          display: inline-block;
          margin-top: 2px;
          white-space: nowrap;
        }

        .btn-view-load {
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
        .btn-view-load:hover { background: #F1F5F9; }

        .btn-more-dp {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 4px;
        }
        .btn-more-dp:hover { color: #0F172A; }

        /* PAGINATION FOOTER */
        .wh-dp-table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 10px;
          font-size: 11px;
          color: #64748B;
        }
        .wh-dp-pager {
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
          background: #FFD400;
          border-color: #FFD400;
          font-weight: 800;
        }

        /* ── RIGHT SIDEBAR ── */
        .wh-dp-side-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .wh-dp-side-title {
          font-size: 10px;
          font-weight: 900;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
          padding-bottom: 4px;
          border-bottom: 1px solid #F1F5F9;
        }

        /* DONUT CHART */
        .wh-donut-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
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
          margin-top: 4px;
        }

        /* NEXT PICKUPS */
        .wh-pickup-row {
          padding: 6px 0;
          border-bottom: 1px solid #F1F5F9;
        }
        .wh-pickup-row:last-child { border-bottom: none; }
        .wh-pickup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .wh-driver-name { font-size: 11px; font-weight: 800; color: #0F172A; }
        .wh-pickup-time { font-size: 10px; font-weight: 800; color: #2563EB; }
        .wh-pickup-sub { font-size: 9.5px; color: #64748B; margin-top: 1px; }

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
        .wh-qa-btn:hover { background: #FFFFFF; border-color: #FFD400; }

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

        .wh-dp-table-wrap::-webkit-scrollbar {
          height: 6px;
        }
        .wh-dp-table-wrap::-webkit-scrollbar-track {
          background: #F1F5F9;
        }
        .wh-dp-table-wrap::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }

        @media (max-width: 1024px) {
          .wh-dp-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .wh-dp-master-grid { flex-direction: column; width: 100%; }
          .wh-dp-right-col { width: 100%; }
        }
        @media (max-width: 640px) {
          .wh-dispatch-container { padding: 10px; width: 100%; max-width: 100vw; box-sizing: border-box; }
          .wh-dp-master-grid { width: 100%; max-width: 100%; box-sizing: border-box; }
          .wh-dp-left-col { width: 100%; min-width: 0; max-width: 100%; box-sizing: border-box; }
          .wh-dp-main-card { width: 100%; min-width: 0; max-width: 100%; box-sizing: border-box; overflow: hidden; }
          .wh-dp-stats-grid { grid-template-columns: 1fr; }
          .wh-dp-header-row { flex-direction: column; align-items: flex-start; gap: 10px; }
          .wh-dp-actions-top { width: 100%; display: flex; gap: 8px; }
          .wh-dp-actions-top button { flex: 1; justify-content: center; }
          .wh-dp-search-row { flex-direction: column; align-items: stretch; gap: 8px; }
          .wh-dp-filters-bar { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; width: 100%; box-sizing: border-box; }
          .wh-filter-item { width: 100%; }
          .wh-filter-sel { width: 100%; box-sizing: border-box; }
          .wh-dp-table-wrap { width: 100%; display: block; overflow-x: auto !important; -webkit-overflow-scrolling: touch; box-sizing: border-box; }
          .wh-dp-table { min-width: 820px; }
          .wh-dp-table th, .wh-dp-table td { white-space: nowrap; }
        }
      `}</style>

      {/* PAGE HEADER ROW */}
      <div className="wh-dp-header-row">
        <div>
          <h1 className="wh-dp-title">DISPATCH READY</h1>
          <p className="wh-dp-sub">Loads/items that are staged and ready to be dispatched.</p>
        </div>

        <div className="wh-dp-actions-top">
          <button className="wh-btn-refresh" onClick={handleRefresh}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button className="wh-btn-export" onClick={handleExport}>
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* STAT CARDS 4-GRID */}
      <div className="wh-dp-stats-grid">
        <div className="wh-dp-stat-card">
          <div className="wh-dp-icon-box blue">
            <Truck size={20} />
          </div>
          <div>
            <div className="wh-dp-stat-title">READY TO DISPATCH</div>
            <div className="wh-dp-stat-num">18</div>
            <div className="wh-dp-stat-sub">Loads ready</div>
          </div>
        </div>

        <div className="wh-dp-stat-card">
          <div className="wh-dp-icon-box green">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="wh-dp-stat-title">TODAY'S DISPATCH</div>
            <div className="wh-dp-stat-num">12</div>
            <div className="wh-dp-stat-sub">Scheduled today</div>
          </div>
        </div>

        <div className="wh-dp-stat-card">
          <div className="wh-dp-icon-box amber">
            <Clock size={20} />
          </div>
          <div>
            <div className="wh-dp-stat-title">AWAITING PICKUP</div>
            <div className="wh-dp-stat-num">6</div>
            <div className="wh-dp-stat-sub">Driver not arrived</div>
          </div>
        </div>

        <div className="wh-dp-stat-card">
          <div className="wh-dp-icon-box red">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="wh-dp-stat-title">EXCEPTIONS</div>
            <div className="wh-dp-stat-num">2</div>
            <div className="wh-dp-stat-sub">Require attention</div>
          </div>
        </div>
      </div>

      {/* MASTER GRID LAYOUT */}
      <div className="wh-dp-master-grid">

        {/* LEFT COLUMN MAIN TABLE */}
        <div className="wh-dp-left-col">
          <div className="wh-dp-main-card">

            {/* SEARCH ROW */}
            <div className="wh-dp-search-row">
              <div className="wh-dp-search-wrap">
                <Search size={14} className="wh-dp-search-icon" />
                <input
                  type="text"
                  placeholder="Search by Load No, Trailer, Driver, Customer, Reference..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="wh-dp-search-inp"
                />
              </div>

              <button className="wh-btn-filters-toggle" onClick={() => setShowFilters(!showFilters)}>
                <Filter size={13} />
                <span>Filters</span>
                <ChevronDown size={12} />
              </button>
            </div>

            {/* FILTER CONTROLS ROW - ALWAYS VISIBLE */}
            <div className="wh-dp-filters-bar">
              <div className="wh-filter-item">
                <span className="wh-filter-lbl">Date</span>
                <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="wh-filter-sel">
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="This Week">This Week</option>
                </select>
              </div>

              <div className="wh-filter-item">
                <span className="wh-filter-lbl">Status</span>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="wh-filter-sel">
                  <option value="All">All</option>
                  <option value="Ready">Ready</option>
                  <option value="Awaiting Pickup">Awaiting Pickup</option>
                  <option value="Hold">Hold</option>
                </select>
              </div>

              <div className="wh-filter-item">
                <span className="wh-filter-lbl">Load Lane</span>
                <select value={laneFilter} onChange={e => setLaneFilter(e.target.value)} className="wh-filter-sel">
                  <option value="All">All</option>
                  <option value="Lane 1">Lane 1</option>
                  <option value="Lane 2">Lane 2</option>
                  <option value="Lane 3">Lane 3</option>
                  <option value="Lane 4">Lane 4</option>
                  <option value="Lane 5">Lane 5</option>
                  <option value="Lane 6">Lane 6</option>
                </select>
              </div>

              <div className="wh-filter-item">
                <span className="wh-filter-lbl">Driver</span>
                <select value={driverFilter} onChange={e => setDriverFilter(e.target.value)} className="wh-filter-sel">
                  <option value="All">All</option>
                  <option value="John Smith">John Smith</option>
                  <option value="Mark Davis">Mark Davis</option>
                  <option value="Peter Brown">Peter Brown</option>
                  <option value="Michael Lee">Michael Lee</option>
                </select>
              </div>

              <div className="wh-filter-item">
                <span className="wh-filter-lbl">Trailer / Vehicle</span>
                <select className="wh-filter-sel">
                  <option value="All">All</option>
                  <option value="Car Carrier">Car Carrier</option>
                  <option value="General Freight">General Freight</option>
                  <option value="Container">Container</option>
                </select>
              </div>

              <button 
                type="button"
                className="btn-view-load" 
                style={{ height: '28px', alignSelf: 'flex-end', marginLeft: 'auto' }}
                onClick={() => alert('More filters options...')}
              >
                More Filters &gt;
              </button>
            </div>

            {/* MAIN DATA TABLE */}
            <div className="wh-dp-table-wrap">
              <table className="wh-dp-table">
                <thead>
                  <tr>
                    <th>LOAD / REFERENCE</th>
                    <th>CUSTOMER</th>
                    <th>TRAILER / VEHICLE</th>
                    <th>DRIVER</th>
                    <th>LOAD LANE</th>
                    <th>READY SINCE</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoads.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
                        No dispatch ready loads found matching search.
                      </td>
                    </tr>
                  ) : (
                    filteredLoads.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs">{item.loadRef}</div>
                            <div className="text-[9.5px] text-slate-500 font-mono">{item.poRef}</div>
                          </div>
                        </td>
                        <td className="font-semibold text-slate-800">{item.customer}</td>
                        <td>
                          <div>
                            <div className="font-semibold text-slate-900">{item.vehicle}</div>
                            {item.vehicleType && <span className="badge-vehicle">{item.vehicleType}</span>}
                          </div>
                        </td>
                        <td>
                          {item.driver !== '-' ? (
                            <div>
                              <div 
                                className="font-bold text-slate-900 cursor-pointer hover:underline"
                                onClick={() => alert(`Opening Driver Details for ${item.driver}`)}
                              >
                                {item.driver}
                              </div>
                              <div className="text-[9.5px] text-slate-500 font-mono">{item.phone}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td>
                          <div>
                            <div className="font-bold text-slate-900">{item.lane}</div>
                            <div className="text-[9.5px] text-slate-500">{item.area}</div>
                          </div>
                        </td>
                        <td className="font-medium text-slate-700">{item.readySince}</td>
                        <td>
                          <span className={getStatusBadgeClass(item.status)}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-1">
                            <button className="btn-view-load" onClick={() => alert(`Viewing load manifest for ${item.loadRef}`)}>
                              View
                            </button>
                            <button className="btn-more-dp" onClick={() => alert(`Options for ${item.loadRef}`)}>
                              <MoreVertical size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}
            <div className="wh-dp-table-footer">
              <div>
                Rows per page: <strong>10</strong>
              </div>
              <div>
                1–{filteredLoads.length} of 18
              </div>
              <div className="wh-dp-pager">
                <button className="wh-pager-btn"><ChevronLeft size={14} /></button>
                <button className="wh-pager-btn active">1</button>
                <button className="wh-pager-btn">2</button>
                <button className="wh-pager-btn"><ChevronRight size={14} /></button>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="wh-dp-right-col">

          {/* DISPATCH SUMMARY */}
          <div className="wh-dp-side-card">
            <div className="wh-dp-side-title">DISPATCH SUMMARY</div>

            <div className="wh-donut-wrap">
              <div className="wh-donut-chart">
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  {/* Ready 56% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#22C55E" strokeWidth="4" strokeDasharray="50 100" />
                  {/* Awaiting Pickup 33% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="30 100" strokeDashoffset="-50" />
                  {/* Hold 11% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="10 100" strokeDashoffset="-80" />
                </svg>
                <div className="wh-donut-center">
                  <span style={{ fontSize: '13px', fontWeight: 900 }}>18</span>
                  <span style={{ fontSize: '7px', color: '#64748B' }}>Total</span>
                </div>
              </div>

              <div className="wh-legend-list">
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#22C55E' }} />
                  <span>Ready <strong>10 (56%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#3B82F6' }} />
                  <span>Awaiting Pickup <strong>6 (33%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#F59E0B' }} />
                  <span>Hold <strong>2 (11%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#EF4444' }} />
                  <span>Exceptions <strong>0 (0%)</strong></span>
                </div>
              </div>
            </div>

            <div className="wh-side-link" onClick={() => alert('Generating summary report...')}>
              <FileText size={12} />
              <span>View summary report</span>
            </div>
          </div>

          {/* NEXT PICKUPS */}
          <div className="wh-dp-side-card">
            <div className="flex justify-between items-center mb-1">
              <div className="wh-dp-side-title" style={{ margin: 0, padding: 0, border: 'none' }}>
                NEXT PICKUPS
              </div>
              <span className="wh-side-link" style={{ fontSize: '9.5px', marginTop: 0 }}>View all</span>
            </div>

            <div style={{ marginTop: '8px' }}>
              <div className="wh-pickup-row">
                <div className="wh-pickup-header">
                  <span className="wh-driver-name">John Smith</span>
                  <span className="wh-pickup-time">11:00 AM</span>
                </div>
                <div className="wh-pickup-sub flex justify-between">
                  <span>LD-3985 • Lane 1</span>
                  <span className="text-green-600 font-extrabold">On Time</span>
                </div>
              </div>

              <div className="wh-pickup-row">
                <div className="wh-pickup-header">
                  <span className="wh-driver-name">Mark Davis</span>
                  <span className="wh-pickup-time">01:30 PM</span>
                </div>
                <div className="wh-pickup-sub flex justify-between">
                  <span>LD-3986 • Lane 2</span>
                  <span className="text-blue-600 font-extrabold">Due Soon</span>
                </div>
              </div>

              <div className="wh-pickup-row">
                <div className="wh-pickup-header">
                  <span className="wh-driver-name">Michael Lee</span>
                  <span className="wh-pickup-time">02:00 PM</span>
                </div>
                <div className="wh-pickup-sub flex justify-between">
                  <span>LD-3987 • Lane 4</span>
                  <span className="text-blue-600 font-extrabold">Due Soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="wh-dp-side-card">
            <div className="wh-dp-side-title">QUICK ACTIONS</div>

            <button className="wh-qa-btn" onClick={() => setCreateLoadModalOpen(true)}>
              <Plus size={14} className="text-amber-500" />
              <span>Create Load</span>
            </button>

            <button className="wh-qa-btn" onClick={() => navigate('/warehouse/load-lanes')}>
              <ArrowRight size={14} className="text-blue-500" />
              <span>Move to Load Lane</span>
            </button>

            <button className="wh-qa-btn" onClick={() => setMarkDispatchedModalOpen(true)}>
              <CheckCircle2 size={14} className="text-green-500" />
              <span>Mark as Dispatched</span>
            </button>

            <button className="wh-qa-btn" onClick={() => alert('Printing Dispatch Docket...')}>
              <Printer size={14} className="text-slate-500" />
              <span>Print Dispatch Docket</span>
            </button>

            <button className="wh-qa-btn" onClick={() => alert('Sending notification to driver...')}>
              <Send size={14} className="text-purple-500" />
              <span>Send to Driver</span>
            </button>
          </div>

          {/* HELP */}
          <div className="wh-dp-side-card" style={{ background: '#F8FAFC' }}>
            <div className="wh-dp-side-title">HELP</div>

            <div className="wh-help-text">
              <div>• Only staged loads/items will appear in this list.</div>
              <div>• Ensure POD, documents and checks are complete.</div>
              <div>• Use 'Mark as Dispatched' once the driver departs.</div>
              <div>• Items on Hold require attention before dispatch.</div>
            </div>
          </div>

        </div>

      </div>

      {/* CREATE LOAD MODAL */}
      {createLoadModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setCreateLoadModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h3 className="font-extrabold text-sm text-slate-900">Create Outbound Load</h3>
              <button onClick={() => setCreateLoadModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="wh-modal-body">
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Customer *</label>
                <select className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none">
                  <option value="ABC Motors">ABC Motors</option>
                  <option value="National Fleet">National Fleet</option>
                  <option value="XYZ Imports">XYZ Imports</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Target Lane *</label>
                <select className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none">
                  <option value="Lane 1">Lane 1 (Main Yard)</option>
                  <option value="Lane 2">Lane 2 (Main Yard)</option>
                  <option value="Lane 3">Lane 3 (Main Yard)</option>
                </select>
              </div>
            </div>
            <div className="wh-modal-footer">
              <button className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600" onClick={() => setCreateLoadModalOpen(false)}>Cancel</button>
              <button className="px-4 py-1.5 bg-amber-400 rounded text-xs font-extrabold text-slate-900" onClick={() => { setCreateLoadModalOpen(false); showToast('Outbound Load created!'); }}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* MARK AS DISPATCHED MODAL */}
      {markDispatchedModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setMarkDispatchedModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h3 className="font-extrabold text-sm text-slate-900">Confirm Dispatch Departure</h3>
              <button onClick={() => setMarkDispatchedModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleConfirmDispatch} className="wh-modal-body">
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Select Load to Dispatch *</label>
                <select
                  value={selectedLoadToDispatch}
                  onChange={e => setSelectedLoadToDispatch(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                >
                  {loads.map(l => (
                    <option key={l.id} value={l.loadRef}>{l.loadRef} - {l.customer} ({l.lane})</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-600 font-semibold">
                Confirming will remove this load from Dispatch Ready queue and log it into Movement History.
              </p>
              <div className="wh-modal-footer" style={{ padding: '12px 0 0 0', background: 'transparent', borderTop: 'none' }}>
                <button type="button" className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600" onClick={() => setMarkDispatchedModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-green-500 text-white rounded text-xs font-extrabold">Confirm & Dispatch</button>
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
          padding: '12px 18px', display: 'flex', items: 'center', gap: 10,
          zIndex: 99998, boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
        }}>
          <CheckCircle2 size={16} className="text-green-600" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>{toast.msg}</span>
        </div>
      )}

    </div>
  );
}
