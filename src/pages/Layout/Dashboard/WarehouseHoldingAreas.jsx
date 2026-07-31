import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Filter, Plus, ArrowRight, MoreVertical,
  CheckCircle2, Clock, AlertTriangle, Box, Truck,
  MapPin, Printer, RefreshCw, X, ChevronLeft, ChevronRight,
  Download, Layers, SlidersHorizontal, ArrowUpRight, ChevronDown,
  Info, Eye, Tag, AlertCircle
} from 'lucide-react';

const initialStagingAreas = [
  {
    id: '1',
    code: 'SA-01',
    name: 'Stage Area 1',
    subLocation: 'Main Yard - Front',
    zone: 'Zone A',
    lane: 'Lane 1',
    status: 'Active',
    capacity: 20,
    occupancy: 80,
    stagedItems: 16,
    awaitingMove: 3,
    oldestItem: '2h 15m'
  },
  {
    id: '2',
    code: 'SA-02',
    name: 'Stage Area 2',
    subLocation: 'Main Yard - North',
    zone: 'Zone A',
    lane: 'Lane 2',
    status: 'Active',
    capacity: 18,
    occupancy: 67,
    stagedItems: 12,
    awaitingMove: 2,
    oldestItem: '1h 05m'
  },
  {
    id: '3',
    code: 'SA-03',
    name: 'Stage Area 3',
    subLocation: 'Warehouse 1 - Rear',
    zone: 'Zone B',
    lane: 'Lane 3',
    status: 'Active',
    capacity: 25,
    occupancy: 88,
    stagedItems: 22,
    awaitingMove: 6,
    oldestItem: '3h 42m'
  },
  {
    id: '4',
    code: 'SA-04',
    name: 'Stage Area 4',
    subLocation: 'Warehouse 1 - Side',
    zone: 'Zone B',
    lane: 'Lane 4',
    status: 'Active',
    capacity: 15,
    occupancy: 53,
    stagedItems: 8,
    awaitingMove: 0,
    oldestItem: '45m'
  },
  {
    id: '5',
    code: 'SA-05',
    name: 'Stage Area 5',
    subLocation: 'Warehouse 2 - Front',
    zone: 'Zone C',
    lane: 'Lane 5',
    status: 'Active',
    capacity: 22,
    occupancy: 91,
    stagedItems: 20,
    awaitingMove: 7,
    oldestItem: '4h 10m'
  },
  {
    id: '6',
    code: 'SA-06',
    name: 'Stage Area 6',
    subLocation: 'Container Yard',
    zone: 'Zone C',
    lane: 'Lane 6',
    status: 'Active',
    capacity: 30,
    occupancy: 63,
    stagedItems: 19,
    awaitingMove: 4,
    oldestItem: '1h 20m'
  },
  {
    id: '7',
    code: 'SA-07',
    name: 'Stage Area 7',
    subLocation: 'Hazmat Staging',
    zone: 'Zone D',
    lane: 'Lane 5',
    status: 'Active',
    capacity: 10,
    occupancy: 40,
    stagedItems: 4,
    awaitingMove: 0,
    oldestItem: '20m'
  },
  {
    id: '8',
    code: 'SA-08',
    name: 'Stage Area 8',
    subLocation: 'Value Storage Hold',
    zone: 'Zone D',
    lane: 'Lane 2',
    status: 'Inactive',
    capacity: 10,
    occupancy: 0,
    stagedItems: 0,
    awaitingMove: 0,
    oldestItem: '-'
  }
];

const recentStagedItems = [
  {
    id: 'st-1',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=80&q=80',
    title: 'Toyota Hilux SRS',
    ref: 'VIN: JTDKB3...234567',
    area: 'Stage Area 1',
    time: '10:32 AM'
  },
  {
    id: 'st-2',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=80&q=80',
    title: 'Pallet – Auto Parts',
    ref: 'SKU: PAL-889900112233',
    area: 'Stage Area 3',
    time: '10:21 AM'
  },
  {
    id: 'st-3',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=80&q=80',
    title: 'Honda Accord',
    ref: 'VIN: 1HGCM82633A123456',
    area: 'Stage Area 2',
    time: '10:15 AM'
  },
  {
    id: 'st-4',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=80&q=80',
    title: '40ft Container',
    ref: 'CONT: HJCU1234567',
    area: 'Stage Area 6',
    time: '10:05 AM'
  },
  {
    id: 'st-5',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=80&q=80',
    title: 'Forklift – Toyota 2.5T',
    ref: 'SKU: EQP-778899',
    area: 'Stage Area 5',
    time: '09:58 AM'
  }
];

export default function WarehouseHoldingAreas() {
  const navigate = useNavigate();
  const location = useLocation();

  const [areas, setAreas] = useState(initialStagingAreas);
  const [activeTab, setActiveTab] = useState('All Staging Areas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [laneFilter, setLaneFilter] = useState('All');

  const [createMoveModalOpen, setCreateMoveModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [addAreaModalOpen, setAddAreaModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaCode, setNewAreaCode] = useState('');
  const [newAreaZone, setNewAreaZone] = useState('');
  const [newAreaLane, setNewAreaLane] = useState('');
  const [newAreaCap, setNewAreaCap] = useState('');
  const [newAreaUnit, setNewAreaUnit] = useState('Items');
  const [newAreaDesc, setNewAreaDesc] = useState('');
  const [isRestricted, setIsRestricted] = useState(false);
  const [isTempControlled, setIsTempControlled] = useState(false);

  const [selectedAreaForMove, setSelectedAreaForMove] = useState('Stage Area 1');
  const [targetLane, setTargetLane] = useState('Lane 1');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreateArea = (e) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    const newArea = {
      id: String(Date.now()),
      code: newAreaCode.trim() || `SA-0${areas.length + 1}`,
      name: newAreaName.trim(),
      subLocation: newAreaDesc.trim() || (newAreaZone ? `${newAreaZone} Staging` : 'Main Yard'),
      zone: newAreaZone || 'Zone A',
      lane: newAreaLane || 'Lane 1',
      status: 'Active',
      capacity: parseInt(newAreaCap) || 50,
      occupancy: 0,
      stagedItems: 0,
      awaitingMove: 0,
      oldestItem: '-'
    };
    setAreas([...areas, newArea]);
    setAddAreaModalOpen(false);
    setNewAreaName('');
    setNewAreaCode('');
    setNewAreaZone('');
    setNewAreaLane('');
    setNewAreaCap('');
    setNewAreaDesc('');
    setIsRestricted(false);
    setIsTempControlled(false);
    showToast(`✓ Holding Area "${newArea.name}" created successfully!`);
  };

  const filteredAreas = areas.filter(area => {
    // Tab filter
    if (activeTab === 'Inactive Areas' && area.status !== 'Inactive') return false;
    if (activeTab === 'All Staging Areas' && area.status === 'Inactive') return false;

    // Dropdown & Search filters
    const matchesSearch = !searchQuery ||
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.subLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.lane.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || area.status === statusFilter;
    const matchesZone = zoneFilter === 'All' || area.zone === zoneFilter;
    const matchesLane = laneFilter === 'All' || area.lane === laneFilter;

    return matchesSearch && matchesStatus && matchesZone && matchesLane;
  });

  const handleRefresh = () => {
    showToast('Refreshed staging area inventory...');
  };

  const handleExport = () => {
    showToast('Exporting staging area inventory report (CSV)...');
  };

  const handleConfirmMove = (e) => {
    e.preventDefault();
    setCreateMoveModalOpen(false);
    showToast(`✓ Move task created from ${selectedAreaForMove} to ${targetLane}!`);
  };

  const handleConfirmAssign = (e) => {
    e.preventDefault();
    setAssignModalOpen(false);
    showToast(`✓ ${selectedAreaForMove} assigned to ${targetLane}!`);
  };

  const getOccupancyBarColor = (pct) => {
    if (pct >= 90) return '#EF4444'; // Red
    if (pct >= 80) return '#F59E0B'; // Amber
    return '#22C55E'; // Green
  };

  return (
    <div className="wh-stage-container">
      <style>{`
        .wh-stage-container {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #F8FAFC;
          min-height: 100vh;
          color: #0F172A;
          padding: 20px 24px;
          box-sizing: border-box;
        }

        /* HEADER ROW */
        .wh-st-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .wh-st-title {
          font-size: 18px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -0.3px;
        }
        .wh-st-sub {
          font-size: 12px;
          color: #64748B;
          margin-top: 2px;
        }
        .wh-st-actions-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wh-btn-export-st {
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
        .wh-btn-export-st:hover { background: #F1F5F9; }

        .wh-btn-refresh-st {
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
        }

        .wh-btn-add-st {
          height: 36px;
          padding: 0 16px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 12px;
          font-weight: 800;
          color: #0F172A;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .wh-btn-add-st:hover { background: #F8FAFC; border-color: #0F172A; }

        /* STAT CARDS 4-GRID */
        .wh-st-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }
        .wh-st-stat-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .wh-st-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wh-st-icon-box.blue { background: #DBEAFE; color: #2563EB; }
        .wh-st-icon-box.green { background: #DCFCE7; color: #16A34A; }
        .wh-st-icon-box.amber { background: #FEF3C7; color: #D97706; }
        .wh-st-icon-box.red { background: #FEE2E2; color: #DC2626; }

        .wh-st-stat-num {
          font-size: 22px;
          font-weight: 900;
          color: #0F172A;
          line-height: 1;
        }
        .wh-st-stat-title {
          font-size: 10px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 3px;
        }
        .wh-st-stat-sub {
          font-size: 10.5px;
          color: #94A3B8;
        }

        /* MASTER GRID LAYOUT */
        .wh-st-master-grid {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .wh-st-left-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .wh-st-right-col {
          width: 250px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .wh-st-main-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        /* TABS ROW */
        .wh-st-tabs-row {
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 14px;
          padding-bottom: 2px;
        }
        .wh-st-tab-btn {
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
          background: transparent;
          border: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.15s;
        }
        .wh-st-tab-btn.active {
          color: #0F172A;
          border-bottom-color: #FFD400;
          font-weight: 800;
        }

        /* SEARCH & FILTERS ROW */
        .wh-st-search-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .wh-st-search-wrap {
          position: relative;
          flex: 1;
          min-width: 240px;
        }
        .wh-st-search-inp {
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
        .wh-st-search-inp:focus { border-color: #FFD400; }
        .wh-st-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .wh-st-filter-sel {
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

        /* TABLE */
        .wh-st-table-wrap {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .wh-st-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11.5px;
          min-width: 850px;
        }
        .wh-st-table th {
          padding: 10px 12px;
          font-size: 9px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          text-align: left;
        }
        .wh-st-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
        }
        .wh-st-table tr:hover { background: #F8FAFC; }

        .area-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F1F5F9;
          color: #475569;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid #CBD5E1;
        }

        /* OCCUPANCY BAR */
        .occ-bar-bg {
          width: 60px;
          height: 6px;
          background: #E2E8F0;
          border-radius: 3px;
          overflow: hidden;
        }
        .occ-bar-fill {
          height: 100%;
          border-radius: 3px;
        }

        .badge-active {
          background: #DCFCE7;
          color: #15803D;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 9.5px;
          font-weight: 800;
        }
        .badge-inactive {
          background: #F1F5F9;
          color: #64748B;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 9.5px;
          font-weight: 800;
        }

        .btn-view-st {
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
        .btn-view-st:hover { background: #F1F5F9; }

        /* FOOTER & TIP */
        .wh-st-table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 10px;
          font-size: 11px;
          color: #64748B;
        }

        .wh-st-tip-bar {
          margin-top: 14px;
          padding: 10px 14px;
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          border-radius: 8px;
          font-size: 11px;
          color: #1E40AF;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* RIGHT SIDEBAR */
        .wh-st-side-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .wh-st-side-title {
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
        .wh-donut-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .wh-donut-chart { position: relative; width: 70px; height: 70px; flex-shrink: 0; }
        .wh-donut-center {
          position: absolute; inset: 12px; background: #FFFFFF; border-radius: 50%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .wh-legend-list { display: flex; flex-direction: column; gap: 4px; font-size: 10px; }
        .wh-legend-item { display: flex; align-items: center; gap: 6px; }
        .wh-legend-dot { width: 8px; height: 8px; border-radius: 50%; }

        /* TOP STAGING OCCUPANCY BARS */
        .wh-occ-rank-row {
          margin-bottom: 8px;
          font-size: 10.5px;
        }
        .wh-occ-rank-header {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 2px;
        }
        .wh-occ-rank-bg {
          height: 6px;
          background: #F1F5F9;
          border-radius: 3px;
          overflow: hidden;
        }
        .wh-occ-rank-fill { height: 100%; border-radius: 3px; }

        /* RECENT ITEMS */
        .wh-st-recent-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
          border-bottom: 1px solid #F1F5F9;
        }
        .wh-st-recent-item:last-child { border-bottom: none; }
        .wh-st-recent-thumb {
          width: 34px;
          height: 28px;
          border-radius: 4px;
          object-fit: cover;
          border: 1px solid #E2E8F0;
        }

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

        /* MODAL */
        .wh-modal-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px); z-index: 99999; display: flex;
          align-items: center; justify-content: center; padding: 16px;
        }
        .wh-modal-box {
          background: #FFFFFF; border-radius: 12px; width: 100%; max-width: 440px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden;
        }

        @media (max-width: 1024px) {
          .wh-st-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .wh-st-master-grid { flex-direction: column; }
          .wh-st-right-col { width: 100%; }
        }
        @media (max-width: 640px) {
          .wh-st-stats-grid { grid-template-columns: 1fr; }
          .wh-stage-container { padding: 12px; }
        }
      `}</style>

      {/* HEADER ROW */}
      <div className="wh-st-header-row">
        <div>
          <h1 className="wh-st-title">STAGE (HOLDING AREAS)</h1>
          <p className="wh-st-sub">View and manage all staging areas and items waiting to be moved to load lanes.</p>
        </div>

        <div className="wh-st-actions-top">
          <button className="wh-btn-export-st" onClick={handleExport}>
            <Download size={14} />
            <span>Export</span>
          </button>
          <button className="wh-btn-refresh-st" onClick={handleRefresh}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button className="wh-btn-add-st" onClick={() => setAddAreaModalOpen(true)}>
            <Plus size={14} />
            <span>Add Holding Area</span>
          </button>
        </div>
      </div>

      {/* STAT CARDS 4-GRID */}
      <div className="wh-st-stats-grid">
        <div className="wh-st-stat-card">
          <div className="wh-st-icon-box blue">
            <Layers size={20} />
          </div>
          <div>
            <div className="wh-st-stat-title">TOTAL STAGING AREAS</div>
            <div className="wh-st-stat-num">12</div>
            <div className="wh-st-stat-sub">8 Active | 4 Inactive</div>
          </div>
        </div>

        <div className="wh-st-stat-card">
          <div className="wh-st-icon-box green">
            <Box size={20} />
          </div>
          <div>
            <div className="wh-st-stat-title">STAGED ITEMS</div>
            <div className="wh-st-stat-num">146</div>
            <div className="wh-st-stat-sub">Across all areas</div>
          </div>
        </div>

        <div className="wh-st-stat-card">
          <div className="wh-st-icon-box amber">
            <Truck size={20} />
          </div>
          <div>
            <div className="wh-st-stat-title">AWAITING MOVE</div>
            <div className="wh-st-stat-num">32</div>
            <div className="wh-st-stat-sub">Ready for load lane</div>
          </div>
        </div>

        <div className="wh-st-stat-card">
          <div className="wh-st-icon-box red">
            <Clock size={20} />
          </div>
          <div>
            <div className="wh-st-stat-title">OVERDUE ITEMS</div>
            <div className="wh-st-stat-num">6</div>
            <div className="wh-st-stat-sub">Exceeding time limit</div>
          </div>
        </div>
      </div>

      {/* MASTER GRID LAYOUT */}
      <div className="wh-st-master-grid">

        {/* LEFT COLUMN MAIN TABLE */}
        <div className="wh-st-left-col">
          <div className="wh-st-main-card">

            {/* TABS ROW */}
            <div className="wh-st-tabs-row">
              {['All Staging Areas', 'By Zone', 'By Load Lane', 'Inactive Areas'].map(tab => (
                <button
                  key={tab}
                  className={`wh-st-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* SEARCH & FILTERS ROW */}
            <div className="wh-st-search-row">
              <div className="wh-st-search-wrap">
                <Search size={14} className="wh-st-search-icon" />
                <input
                  type="text"
                  placeholder="Search staging areas, items, VIN, SKU, or ref no..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="wh-st-search-inp"
                />
              </div>

              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="wh-st-filter-sel">
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)} className="wh-st-filter-sel">
                <option value="All">All Zones</option>
                <option value="Zone A">Zone A</option>
                <option value="Zone B">Zone B</option>
                <option value="Zone C">Zone C</option>
                <option value="Zone D">Zone D</option>
              </select>

              <select value={laneFilter} onChange={e => setLaneFilter(e.target.value)} className="wh-st-filter-sel">
                <option value="All">All Load Lanes</option>
                <option value="Lane 1">Lane 1</option>
                <option value="Lane 2">Lane 2</option>
                <option value="Lane 3">Lane 3</option>
                <option value="Lane 4">Lane 4</option>
                <option value="Lane 5">Lane 5</option>
                <option value="Lane 6">Lane 6</option>
              </select>

              <button className="wh-btn-export-st" style={{ height: '34px' }}>
                <Filter size={13} />
                <span>Filters</span>
              </button>
            </div>

            {/* TABLE */}
            <div className="wh-st-table-wrap">
              <table className="wh-st-table">
                <thead>
                  <tr>
                    <th>STAGING AREA</th>
                    <th>ZONE</th>
                    <th>LOAD LANE (NEXT)</th>
                    <th>STATUS</th>
                    <th>CAPACITY</th>
                    <th>OCCUPANCY</th>
                    <th>STAGED ITEMS</th>
                    <th>AWAITING MOVE</th>
                    <th>OLDEST ITEM</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAreas.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
                        No staging areas found matching search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAreas.map(area => (
                      <tr key={area.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="area-avatar-circle">{area.code}</div>
                            <div>
                              <div className="font-extrabold text-slate-900">{area.name}</div>
                              <div className="text-[9.5px] text-slate-500 font-medium">{area.subLocation}</div>
                            </div>
                          </div>
                        </td>
                        <td className="font-semibold text-slate-700">{area.zone}</td>
                        <td className="font-bold text-slate-900">{area.lane}</td>
                        <td>
                          <span className={area.status === 'Active' ? 'badge-active' : 'badge-inactive'}>
                            {area.status}
                          </span>
                        </td>
                        <td className="font-bold text-slate-800">{area.capacity}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="occ-bar-bg">
                              <div
                                className="occ-bar-fill"
                                style={{
                                  width: `${area.occupancy}%`,
                                  background: getOccupancyBarColor(area.occupancy)
                                }}
                              />
                            </div>
                            <span className="font-bold text-xs">{area.occupancy}%</span>
                          </div>
                        </td>
                        <td className="font-bold text-slate-900">{area.stagedItems}</td>
                        <td>
                          {area.awaitingMove > 0 ? (
                            <span className="font-bold text-amber-600">{area.awaitingMove}</span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="font-medium text-slate-700">{area.oldestItem}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-1">
                            <button className="btn-view-st" onClick={() => alert(`Viewing ${area.name} staging inventory`)}>
                              View
                            </button>
                            <button className="p-1 text-slate-400 hover:text-slate-900" onClick={() => alert(`Options for ${area.name}`)}>
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
            <div className="wh-st-table-footer">
              <div>Showing 1 to {filteredAreas.length} of 12 staging areas</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 rounded border border-slate-300 flex items-center justify-center"><ChevronLeft size={14} /></button>
                  <button className="w-6 h-6 rounded bg-amber-400 font-bold text-xs flex items-center justify-center">1</button>
                  <button className="w-6 h-6 rounded border border-slate-300 font-semibold text-xs flex items-center justify-center">2</button>
                  <button className="w-6 h-6 rounded border border-slate-300 flex items-center justify-center"><ChevronRight size={14} /></button>
                </div>
                <select className="wh-st-filter-sel" style={{ height: '26px' }}>
                  <option>10 / page</option>
                  <option>25 / page</option>
                </select>
              </div>
            </div>

            {/* BOTTOM TIP */}
            <div className="wh-st-tip-bar">
              <Info size={14} className="flex-shrink-0 text-blue-600" />
              <span className="flex-1">
                <strong>Tip:</strong> Items can be moved from staging areas to the assigned load lane when ready for dispatch.
              </span>
              <span className="font-bold underline cursor-pointer hover:text-blue-800" onClick={() => alert('Opening staging documentation...')}>
                Learn more
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="wh-st-right-col">

          {/* STAGING SUMMARY */}
          <div className="wh-st-side-card">
            <div className="flex justify-between items-center mb-1">
              <div className="wh-st-side-title" style={{ margin: 0, padding: 0, border: 'none' }}>
                STAGING SUMMARY
              </div>
              <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">View report</span>
            </div>

            <div className="wh-donut-wrap" style={{ marginTop: 8 }}>
              <div className="wh-donut-chart">
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  {/* Ready for Move 22% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#22C55E" strokeWidth="4" strokeDasharray="22 100" />
                  {/* Waiting > 2h 19% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="19 100" strokeDashoffset="-22" />
                  {/* Waiting < 2h 55% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="55 100" strokeDashoffset="-41" />
                  {/* Overdue 4% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="4 100" strokeDashoffset="-96" />
                </svg>
                <div className="wh-donut-center">
                  <span style={{ fontSize: '13px', fontWeight: 900 }}>146</span>
                  <span style={{ fontSize: '7px', color: '#64748B' }}>Total</span>
                </div>
              </div>

              <div className="wh-legend-list">
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#22C55E' }} />
                  <span>Ready for Move <strong>32 (22%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#F59E0B' }} />
                  <span>Waiting &gt; 2h <strong>28 (19%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#3B82F6' }} />
                  <span>Waiting &lt; 2h <strong>80 (55%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#EF4444' }} />
                  <span>Overdue <strong>6 (4%)</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* TOP STAGING AREAS BY OCCUPANCY */}
          <div className="wh-st-side-card">
            <div className="wh-st-side-title">TOP STAGING AREAS BY OCCUPANCY</div>

            <div style={{ marginTop: 8 }}>
              <div className="wh-occ-rank-row">
                <div className="wh-occ-rank-header">
                  <span>1. Stage Area 5</span>
                  <span className="text-red-600">91%</span>
                </div>
                <div className="wh-occ-rank-bg">
                  <div className="wh-occ-rank-fill" style={{ width: '91%', background: '#EF4444' }} />
                </div>
              </div>

              <div className="wh-occ-rank-row">
                <div className="wh-occ-rank-header">
                  <span>2. Stage Area 3</span>
                  <span className="text-amber-600">88%</span>
                </div>
                <div className="wh-occ-rank-bg">
                  <div className="wh-occ-rank-fill" style={{ width: '88%', background: '#F59E0B' }} />
                </div>
              </div>

              <div className="wh-occ-rank-row">
                <div className="wh-occ-rank-header">
                  <span>3. Stage Area 1</span>
                  <span className="text-green-600">80%</span>
                </div>
                <div className="wh-occ-rank-bg">
                  <div className="wh-occ-rank-fill" style={{ width: '80%', background: '#22C55E' }} />
                </div>
              </div>

              <div className="wh-occ-rank-row">
                <div className="wh-occ-rank-header">
                  <span>4. Stage Area 2</span>
                  <span className="text-green-600">67%</span>
                </div>
                <div className="wh-occ-rank-bg">
                  <div className="wh-occ-rank-fill" style={{ width: '67%', background: '#22C55E' }} />
                </div>
              </div>

              <div className="wh-occ-rank-row">
                <div className="wh-occ-rank-header">
                  <span>5. Stage Area 6</span>
                  <span className="text-green-600">63%</span>
                </div>
                <div className="wh-occ-rank-bg">
                  <div className="wh-occ-rank-fill" style={{ width: '63%', background: '#22C55E' }} />
                </div>
              </div>

              <div className="text-[10px] font-bold text-blue-600 cursor-pointer mt-2 hover:underline">
                View all staging areas
              </div>
            </div>
          </div>

          {/* RECENTLY STAGED ITEMS */}
          <div className="wh-st-side-card">
            <div className="flex justify-between items-center mb-1">
              <div className="wh-st-side-title" style={{ margin: 0, padding: 0, border: 'none' }}>
                RECENTLY STAGED ITEMS
              </div>
              <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">View all</span>
            </div>

            <div style={{ marginTop: 8 }}>
              {recentStagedItems.map(item => (
                <div key={item.id} className="wh-st-recent-item">
                  <img src={item.image} alt={item.title} className="wh-st-recent-thumb" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-extrabold text-slate-900 text-xs truncate">{item.title}</div>
                    <div className="text-[9px] text-slate-500 font-mono truncate">{item.ref}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="text-[9.5px] font-bold text-slate-700">{item.area}</div>
                    <div className="text-[9px] text-blue-600 font-bold">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="wh-st-side-card">
            <div className="wh-st-side-title">QUICK ACTIONS</div>

            <button className="wh-qa-btn" onClick={() => setCreateMoveModalOpen(true)}>
              <Truck size={14} className="text-amber-500" />
              <span>Create Move</span>
            </button>

            <button className="wh-qa-btn" onClick={() => setAssignModalOpen(true)}>
              <ArrowRight size={14} className="text-blue-500" />
              <span>Assign to Load Lane</span>
            </button>

            <button className="wh-qa-btn" onClick={() => alert('Printing staging labels...')}>
              <Printer size={14} className="text-slate-500" />
              <span>Print Labels</span>
            </button>

            <button className="wh-qa-btn" onClick={() => navigate('/warehouse/find-stock')}>
              <Search size={14} className="text-purple-500" />
              <span>Find Stock</span>
            </button>
          </div>

        </div>

      </div>

      {/* CREATE MOVE MODAL */}
      {createMoveModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setCreateMoveModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900">Create Staging Move Task</h3>
              <button onClick={() => setCreateMoveModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleConfirmMove} className="p-4 flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">From Staging Area *</label>
                <select
                  value={selectedAreaForMove}
                  onChange={e => setSelectedAreaForMove(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                >
                  {areas.map(a => (
                    <option key={a.id} value={a.name}>{a.name} ({a.subLocation})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Target Load Lane *</label>
                <select
                  value={targetLane}
                  onChange={e => setTargetLane(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                >
                  <option value="Lane 1">Lane 1 (Main Yard)</option>
                  <option value="Lane 2">Lane 2 (Main Yard)</option>
                  <option value="Lane 3">Lane 3 (Warehouse 1)</option>
                  <option value="Lane 5">Lane 5 (DG Staging)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600" onClick={() => setCreateMoveModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-400 rounded text-xs font-extrabold text-slate-900">Create Move Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TO LOAD LANE MODAL */}
      {assignModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setAssignModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900">Assign Staging Area to Lane</h3>
              <button onClick={() => setAssignModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleConfirmAssign} className="p-4 flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Staging Area *</label>
                <select
                  value={selectedAreaForMove}
                  onChange={e => setSelectedAreaForMove(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                >
                  {areas.map(a => (
                    <option key={a.id} value={a.name}>{a.name} ({a.zone})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Destination Load Lane *</label>
                <select
                  value={targetLane}
                  onChange={e => setTargetLane(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded text-xs font-semibold outline-none"
                >
                  <option value="Lane 1">Lane 1</option>
                  <option value="Lane 2">Lane 2</option>
                  <option value="Lane 3">Lane 3</option>
                  <option value="Lane 4">Lane 4</option>
                  <option value="Lane 5">Lane 5</option>
                  <option value="Lane 6">Lane 6</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600" onClick={() => setAssignModalOpen(false)}>Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-400 rounded text-xs font-extrabold text-slate-900">Confirm Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD HOLDING AREA MODAL (NARROW COMPACT WIDTH) */}
      {addAreaModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setAddAreaModalOpen(false)}>
          <div className="wh-modal-box" style={{ maxWidth: 500, padding: 0 }} onClick={e => e.stopPropagation()}>
            
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200">
              <h3 className="font-black text-sm text-slate-900">Add New Holding Area</h3>
              <button onClick={() => setAddAreaModalOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-800">
                <X size={16} />
              </button>
            </div>

            {/* MODAL BODY (2-COLUMN GRID) */}
            <form onSubmit={handleCreateArea} className="grid grid-cols-1 md:grid-cols-12">
              
              {/* LEFT STEPPER PANEL (5 COLS - ~175px WIDTH) */}
              <div className="md:col-span-5 p-3 bg-slate-50 border-r border-slate-200 flex flex-col justify-between select-none">
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-4">
                    HOW TO ADD A HOLDING AREA
                  </div>

                  {/* STEP 1 */}
                  <div
                    onClick={() => setActiveStep(1)}
                    className={`flex gap-3 mb-4 cursor-pointer p-2 rounded-lg transition-all ${activeStep === 1 ? 'bg-amber-50 border border-amber-200/80 shadow-sm' : 'hover:bg-slate-100/80'}`}
                  >
                    <div className={`w-6 h-6 rounded-full font-extrabold text-xs flex items-center justify-center flex-shrink-0 transition-all ${activeStep === 1 ? 'bg-amber-400 text-slate-900 shadow-sm' : 'border border-slate-300 text-slate-500 bg-white'}`}>
                      1
                    </div>
                    <div>
                      <div className={`font-extrabold text-xs transition-colors ${activeStep === 1 ? 'text-amber-700' : 'text-slate-800'}`}>Enter Area Details</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                        Add name, code and select the zone where this holding area is located.
                      </div>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div
                    onClick={() => setActiveStep(2)}
                    className={`flex gap-3 mb-4 cursor-pointer p-2 rounded-lg transition-all ${activeStep === 2 ? 'bg-amber-50 border border-amber-200/80 shadow-sm' : 'hover:bg-slate-100/80'}`}
                  >
                    <div className={`w-6 h-6 rounded-full font-extrabold text-xs flex items-center justify-center flex-shrink-0 transition-all ${activeStep === 2 ? 'bg-amber-400 text-slate-900 shadow-sm' : 'border border-slate-300 text-slate-500 bg-white'}`}>
                      2
                    </div>
                    <div>
                      <div className={`font-extrabold text-xs transition-colors ${activeStep === 2 ? 'text-amber-700' : 'text-slate-800'}`}>Set Capacity</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                        Define the maximum capacity for items that can be held in this area.
                      </div>
                    </div>
                  </div>

                  {/* STEP 3 */}
                  <div
                    onClick={() => setActiveStep(3)}
                    className={`flex gap-3 mb-4 cursor-pointer p-2 rounded-lg transition-all ${activeStep === 3 ? 'bg-amber-50 border border-amber-200/80 shadow-sm' : 'hover:bg-slate-100/80'}`}
                  >
                    <div className={`w-6 h-6 rounded-full font-extrabold text-xs flex items-center justify-center flex-shrink-0 transition-all ${activeStep === 3 ? 'bg-amber-400 text-slate-900 shadow-sm' : 'border border-slate-300 text-slate-500 bg-white'}`}>
                      3
                    </div>
                    <div>
                      <div className={`font-extrabold text-xs transition-colors ${activeStep === 3 ? 'text-amber-700' : 'text-slate-800'}`}>Optional Settings</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                        Add a description and mark if this is a restricted or temperature controlled area.
                      </div>
                    </div>
                  </div>

                  {/* STEP 4 */}
                  <div
                    onClick={() => setActiveStep(4)}
                    className={`flex gap-3 mb-4 cursor-pointer p-2 rounded-lg transition-all ${activeStep === 4 ? 'bg-amber-50 border border-amber-200/80 shadow-sm' : 'hover:bg-slate-100/80'}`}
                  >
                    <div className={`w-6 h-6 rounded-full font-extrabold text-xs flex items-center justify-center flex-shrink-0 transition-all ${activeStep === 4 ? 'bg-amber-400 text-slate-900 shadow-sm' : 'border border-slate-300 text-slate-500 bg-white'}`}>
                      4
                    </div>
                    <div>
                      <div className={`font-extrabold text-xs transition-colors ${activeStep === 4 ? 'text-amber-700' : 'text-slate-800'}`}>Save</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                        Click Save Area to create the holding area. It will be available immediately.
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM TIP BOX */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-[10px] flex gap-2 items-start mt-2">
                  <Info size={14} className="flex-shrink-0 text-blue-600 mt-0.5" />
                  <span className="leading-snug">
                    Holding areas help you organize inventory before items are moved to load lanes for dispatch.
                  </span>
                </div>
              </div>

              {/* RIGHT FORM FIELDS PANEL (7 COLS) */}
              <div className="md:col-span-7 p-3 flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* AREA DETAILS SECTION */}
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                      AREA DETAILS
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-[10.5px] font-extrabold text-slate-700 block mb-1">Area Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Stage Area 9"
                          value={newAreaName}
                          onChange={e => setNewAreaName(e.target.value)}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10.5px] font-extrabold text-slate-700 block mb-1">Area Code <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. SA-09"
                          value={newAreaCode}
                          onChange={e => setNewAreaCode(e.target.value)}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400"
                        />
                        <span className="text-[9.5px] text-slate-400 block mt-0.5">Unique code to identify this area</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10.5px] font-extrabold text-slate-700 block mb-1">Zone <span className="text-red-500">*</span></label>
                        <select
                          required
                          value={newAreaZone}
                          onChange={e => setNewAreaZone(e.target.value)}
                          className="w-full h-8 px-2 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400"
                        >
                          <option value="">Select Zone</option>
                          <option value="Zone A">Zone A</option>
                          <option value="Zone B">Zone B</option>
                          <option value="Zone C">Zone C</option>
                          <option value="Zone D">Zone D</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10.5px] font-extrabold text-slate-700 flex items-center justify-between mb-1">
                          <span>Next Load Lane (Default)</span>
                          <Info size={11} className="text-slate-400" />
                        </label>
                        <select
                          value={newAreaLane}
                          onChange={e => setNewAreaLane(e.target.value)}
                          className="w-full h-8 px-2 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400"
                        >
                          <option value="">Select Load Lane</option>
                          <option value="Lane 1">Lane 1</option>
                          <option value="Lane 2">Lane 2</option>
                          <option value="Lane 3">Lane 3</option>
                          <option value="Lane 4">Lane 4</option>
                          <option value="Lane 5">Lane 5</option>
                          <option value="Lane 6">Lane 6</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* CAPACITY SECTION */}
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                      CAPACITY
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10.5px] font-extrabold text-slate-700 block mb-1">Maximum Capacity <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 50"
                          value={newAreaCap}
                          onChange={e => setNewAreaCap(e.target.value)}
                          className="w-full h-8 px-2.5 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400"
                        />
                        <span className="text-[9.5px] text-slate-400 block mt-0.5">Total items this area can hold</span>
                      </div>
                      <div>
                        <label className="text-[10.5px] font-extrabold text-slate-700 block mb-1">Unit Type</label>
                        <select
                          value={newAreaUnit}
                          onChange={e => setNewAreaUnit(e.target.value)}
                          className="w-full h-8 px-2 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400"
                        >
                          <option value="Items">Items</option>
                          <option value="Pallets">Pallets</option>
                          <option value="Containers">Containers</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* ADDITIONAL SETTINGS (OPTIONAL) SECTION */}
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                      ADDITIONAL SETTINGS (OPTIONAL)
                    </div>

                    <div className="mb-3">
                      <label className="text-[10.5px] font-extrabold text-slate-700 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        placeholder="Enter description (optional)"
                        value={newAreaDesc}
                        onChange={e => setNewAreaDesc(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isRestricted}
                          onChange={e => setIsRestricted(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-amber-400 cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800">Restricted Area</div>
                          <div className="text-[9.5px] text-slate-400">Only authorized staff can use this area</div>
                        </div>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isTempControlled}
                          onChange={e => setIsTempControlled(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-amber-400 cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800">Temperature Controlled</div>
                          <div className="text-[9.5px] text-slate-400">This area requires temperature control</div>
                        </div>
                      </label>
                    </div>
                  </div>

                </div>

                {/* FOOTER BUTTONS */}
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 mt-4">
                  <button
                    type="button"
                    onClick={() => setAddAreaModalOpen(false)}
                    className="px-4 py-1.5 border border-slate-300 rounded-md text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 bg-amber-400 hover:bg-amber-500 rounded-md text-xs font-black text-slate-900 shadow-sm"
                  >
                    Save Area
                  </button>
                </div>

              </div>

            </form>

          </div>
        </div>
      )}
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
