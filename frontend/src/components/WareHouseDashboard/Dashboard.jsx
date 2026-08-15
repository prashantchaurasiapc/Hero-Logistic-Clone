import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// === SVG ICONS ===
const TruckIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const BuildingIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18"></path>
    <path d="M5 21V7l8-4v18"></path>
    <path d="M19 21V11l-6-3"></path>
    <path d="M9 9v.01"></path>
    <path d="M9 12v.01"></path>
    <path d="M9 15v.01"></path>
    <path d="M9 18v.01"></path>
  </svg>
);

const ArrowSwapIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 1l4 4-4 4"></path>
    <path d="M21 5H3"></path>
    <path d="M7 23l-4-4 4-4"></path>
    <path d="M3 19h18"></path>
  </svg>
);

const LayoutGridIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
  </svg>
);

const SearchIcon = ({ color = "currentColor", size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const InboxIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
  </svg>
);

const MailIcon = ({ color = "currentColor", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const RefreshIcon = ({ color = "currentColor", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
    <path d="M21 3v5h-5"></path>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
    <path d="M3 21v-5h5"></path>
  </svg>
);

const InfoIcon = ({ color = "currentColor", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// === INITIAL MOCK DATA (Removed) ===
const initialInboundToday = [];
const initialLoadLanes = [];
const initialRecentMovements = [];

const initialNotifications = [];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const isYard = location.pathname ? location.pathname.startsWith('/yard') : false;

  // State management
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data states with live API loading
  const [inboundList, setInboundList] = useState(initialInboundToday);
  const [loadLanesList, setLoadLanesList] = useState(initialLoadLanes);
  const [movementsList, setMovementsList] = useState(initialRecentMovements);
  const [notificationsList, setNotificationsList] = useState(initialNotifications);
  const [liveKpi, setLiveKpi] = useState({
    inboundAwaiting: 0,
    inYard: 0,
    toMove: 0,
    loadLanes: 0,
    dispatchReady: 0,
    yardCapacityPercent: 0,
    totalCap: 0,
    inYardCap: 0,
    availCap: 0,
    lastSync: 'Syncing...'
  });

  const fetchLiveDashboard = async () => {
    try {
      const apiMod = await import('../../services/api');
      const api = apiMod.default || apiMod;
      const res = await api.get('/warehouse-portal/dashboard');
      if (res.data && res.data.success && res.data.data) {
        const d = res.data.data;
        if (d.overview) {
          setLiveKpi({
            inboundAwaiting: d.overview.inboundAwaiting || 0,
            inYard: d.overview.inYard || 0,
            toMove: d.overview.toMove || 0,
            loadLanes: d.overview.loadLanes || 0,
            dispatchReady: d.overview.dispatchReady || 0,
            yardCapacityPercent: d.overview.yardCapacity?.usedPercent || 0,
            totalCap: d.overview.yardCapacity?.total || 0,
            inYardCap: d.overview.yardCapacity?.inYard || 0,
            availCap: d.overview.yardCapacity?.available || 0,
            lastSync: d.overview.lastSync || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          });
        }
        if (d.inboundToday) {
          setInboundList(d.inboundToday);
        }
        if (d.loadLanesOverview) {
          setLoadLanesList(d.loadLanesOverview);
        }
        if (d.recentMovements) {
          setMovementsList(d.recentMovements);
        }
      }
    } catch (err) {
      console.warn('Using dashboard initial state:', err.message);
    }
  };

  useEffect(() => {
    fetchLiveDashboard();
  }, []);

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLiveDashboard();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  // Filtered inbound
  const filteredInbound = inboundList.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      item.receiptNo.toLowerCase().includes(q) ||
      item.from.toLowerCase().includes(q) ||
      item.items.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered load lanes
  const filteredLoadLanes = loadLanesList.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      item.lane.toLowerCase().includes(q) ||
      item.load.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered movements
  const filteredMovements = movementsList.filter(item => {
    const q = searchQuery.toLowerCase();
    return !q || 
      item.item.toLowerCase().includes(q) ||
      item.action.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q);
  });

  return (
    <div className={`wh-panel-root ${theme === 'dark' ? 'wh-dark' : 'wh-light'}`}>
      
      {/* ── EMBEDDED DIRECT CSS INSIDE JSX ── */}
      <style>{`
        .wh-panel-root {
          min-height: 100vh;
          font-family: 'Inter', 'Outfit', system-ui, -apple-system, sans-serif;
          padding: 0 0 32px 0;
          box-sizing: border-box;
        }

        .wh-light { background-color: #F8FAFC; color: #0F172A; }
        .wh-dark { background-color: #0B0F19; color: #F8FAFC; }

        .wh-sub-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 16px 24px;
        }

        .wh-section-title {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -0.3px;
          text-transform: uppercase;
          margin: 0;
          line-height: 1.2;
          color: #0F172A;
        }

        .wh-sync-status {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          font-weight: 600;
          color: #64748B;
        }

        .wh-online-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #10B981;
          font-weight: 700;
        }

        .wh-green-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #10B981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }

        .wh-refresh-btn {
          background: transparent;
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 6px;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
        }

        .wh-refresh-btn.spinning svg {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .wh-top-metrics-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          padding: 0 24px 20px 24px;
        }

        .wh-metric-card {
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          transition: transform 0.15s, border-color 0.15s;
        }

        .wh-metric-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary-color);
        }

        .wh-metric-header {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .wh-metric-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-blue { background-color: rgba(59, 130, 246, 0.12); }
        .icon-green { background-color: rgba(16, 185, 129, 0.12); }
        .icon-orange { background-color: rgba(249, 115, 22, 0.12); }
        .icon-purple { background-color: rgba(139, 92, 246, 0.12); }
        .icon-yellow { background-color: rgba(234, 179, 8, 0.15); }

        .wh-metric-text-group {
          display: flex;
          flex-direction: column;
        }

        .wh-metric-label {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #64748B;
          text-transform: uppercase;
        }

        .wh-metric-value {
          font-size: 22px;
          font-weight: 900;
          line-height: 1.1;
          margin: 1px 0;
          color: #0F172A;
        }

        .wh-metric-sub {
          font-size: 10px;
          color: #94A3B8;
          font-weight: 500;
        }

        .wh-metric-footer {
          margin-top: 8px;
          font-size: 10.5px;
          font-weight: 700;
          color: #3B82F6;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        .wh-table-filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px 16px 24px;
          gap: 16px;
        }

        .wh-search-input-wrap {
          position: relative;
          flex: 1;
          max-width: 480px;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
          pointer-events: none;
          z-index: 2;
        }

        .wh-filter-search-input {
          width: 100%;
          height: 40px;
          padding: 0 36px 0 40px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 500;
          outline: none;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #0F172A;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          box-sizing: border-box;
        }

        .wh-filter-search-input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(255, 212, 0, 0.2);
        }

        .clear-search-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 18px;
          cursor: pointer;
        }

        .wh-filter-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .wh-status-filter-select {
          height: 40px;
          padding: 0 36px 0 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          outline: none;
          cursor: pointer;
          box-sizing: border-box;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #0F172A;
        }

        .wh-reset-filter-btn {
          height: 40px;
          padding: 0 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #64748B;
        }

        .wh-reset-filter-btn:hover {
          background: var(--primary-color);
          color: #000000;
          border-color: var(--primary-color);
        }

        .wh-middle-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 0 24px 20px 24px;
        }

        .wh-content-card {
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
        }

        .wh-card-header { padding: 12px 14px 8px 14px; }
        .wh-card-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin: 0;
          color: #0F172A;
        }

        .wh-card-title.margin-bottom { margin-bottom: 12px; }

        .wh-table-container { flex: 1; overflow-x: auto; }
        .wh-data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 11px;
        }

        .wh-data-table th {
          padding: 6px 10px;
          font-size: 9px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          white-space: nowrap;
          background-color: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
        }

        .wh-data-table td {
          padding: 7px 10px;
          vertical-align: middle;
          white-space: nowrap;
          border-bottom: 1px solid #F1F5F9;
          color: #334155;
        }

        .time-col { color: #64748B; font-weight: 500; }
        .bold-col { font-weight: 700; color: #0F172A; }
        .loc-col { color: #94A3B8; font-size: 10.5px; }

        .badge {
          display: inline-block;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 800;
        }

        .badge-amber { background-color: #FEF3C7; color: #B45309; }
        .badge-green { background-color: #DCFCE7; color: #15803D; }
        .badge-blue { background-color: #DBEAFE; color: #1D4ED8; }

        .wh-progress-wrap { display: flex; align-items: center; gap: 8px; }
        .progress-num { font-size: 10.5px; font-weight: 700; min-width: 28px; }
        .wh-progress-bar-bg {
          flex: 1;
          height: 4px;
          border-radius: 2px;
          background-color: #E2E8F0;
          overflow: hidden;
        }
        .wh-progress-bar-fill { height: 100%; border-radius: 2px; }

        .wh-card-footer {
          padding: 8px 14px;
          font-size: 10.5px;
          font-weight: 700;
          color: #3B82F6;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          border-top: 1px solid #F1F5F9;
        }

        .wh-quick-actions-card {
          margin: 0 24px 20px 24px;
          border-radius: 12px;
          padding: 20px;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
        }

        .wh-quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
        }

        .wh-quick-action-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          transition: transform 0.15s, border-color 0.15s;
        }

        .wh-quick-action-btn:hover {
          transform: translateY(-2px);
          border-color: var(--primary-color);
          background-color: #FFFFFF;
        }

        .action-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .action-text-wrap { display: flex; flex-direction: column; line-height: 1.2; }
        .action-main-label { font-size: 12.5px; font-weight: 800; color: #0F172A; }
        .action-sub-label { font-size: 10px; color: #94A3B8; font-weight: 500; margin-top: 2px; }

        .wh-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding: 0 24px 24px 24px;
        }

        .wh-capacity-body {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 20px;
          flex: 1;
        }

        .wh-donut-chart-container {
          position: relative;
          width: 150px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wh-donut-center-text {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .pct-val { font-size: 26px; font-weight: 900; color: #0F172A; }
        .pct-lbl { font-size: 11px; color: #94A3B8; font-weight: 600; margin-top: 2px; }

        .wh-capacity-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 140px;
        }

        .capacity-stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .stat-label { color: #94A3B8; font-weight: 600; }
        .stat-val.bold { font-weight: 800; color: #0F172A; }
        .stat-val.green-val { font-weight: 800; color: #10B981; }

        .wh-notif-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px 20px;
          flex: 1;
        }

        .wh-notif-item { display: flex; align-items: flex-start; gap: 14px; }
        .wh-notif-icon-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wh-notif-content { display: flex; flex-direction: column; gap: 2px; }
        .wh-notif-text { font-size: 12px; font-weight: 600; line-height: 1.3; color: #1E293B; }
        .wh-notif-time { font-size: 10px; color: #94A3B8; font-weight: 500; }

        @media (max-width: 1024px) {
          .wh-top-metrics-grid { grid-template-columns: repeat(3, 1fr); }
          .wh-quick-actions-grid { grid-template-columns: repeat(3, 1fr); }
          .wh-middle-grid { grid-template-columns: 1fr; }
          .wh-bottom-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .wh-top-metrics-grid { grid-template-columns: repeat(2, 1fr); }
          .wh-quick-actions-grid { grid-template-columns: repeat(2, 1fr); }
          .wh-table-filter-bar { flex-direction: column; align-items: stretch; }
        }
      `}</style>
      
      {/* ── SUB-HEADER BAR: OVERVIEW TITLE & REALTIME SYNC STATUS ── */}
      <div className="wh-sub-header">
        <h1 className="wh-section-title">{isYard ? 'YARD OVERVIEW' : 'WAREHOUSE OVERVIEW'}</h1>
        
        <div className="wh-sync-status">
          <span className="wh-sync-time">Last Sync: 08:15 AM</span>
          <span className="wh-online-indicator">
            <span className="wh-green-dot"></span> Online
          </span>
          <button 
            className={`wh-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
            onClick={handleRefresh}
            title="Refresh Data"
          >
            <RefreshIcon size={16} />
          </button>
        </div>
      </div>

      {/* ── TOP ROW: 5 METRIC CARDS (Exact match to Screenshot 2) ── */}
      <div className="wh-top-metrics-grid">
        
        {/* Card 1: INBOUND */}
        <div className="wh-metric-card">
          <div className="wh-metric-header">
            <div className="wh-metric-icon-box icon-blue">
              <InboxIcon size={18} color="#3B82F6" />
            </div>
            <div className="wh-metric-text-group">
              <div className="wh-metric-label">INBOUND</div>
              <div className="wh-metric-value">{liveKpi.inboundAwaiting}</div>
              <div className="wh-metric-sub">Awaiting Receive</div>
            </div>
          </div>
          <div className="wh-metric-footer" onClick={() => navigate(isYard ? '/yard/inbound' : '/warehouse/inbound')}>
            <span>View all</span>
            <span className="arrow">→</span>
          </div>
        </div>

        {/* Card 2: IN YARD */}
        <div className="wh-metric-card">
          <div className="wh-metric-header">
            <div className="wh-metric-icon-box icon-green">
              <BuildingIcon size={18} color="#10B981" />
            </div>
            <div className="wh-metric-text-group">
              <div className="wh-metric-label">IN YARD</div>
              <div className="wh-metric-value">{liveKpi.inYard}</div>
              <div className="wh-metric-sub">Vehicles / Items</div>
            </div>
          </div>
          <div className="wh-metric-footer" onClick={() => navigate(isYard ? '/yard/current-stock' : '/warehouse/find-stock')}>
            <span>View all</span>
            <span className="arrow">→</span>
          </div>
        </div>

        {/* Card 3: TO MOVE */}
        <div className="wh-metric-card">
          <div className="wh-metric-header">
            <div className="wh-metric-icon-box icon-orange">
              <ArrowSwapIcon size={18} color="#F97316" />
            </div>
            <div className="wh-metric-text-group">
              <div className="wh-metric-label">TO MOVE</div>
              <div className="wh-metric-value">{liveKpi.toMove}</div>
              <div className="wh-metric-sub">Transfer Tasks</div>
            </div>
          </div>
          <div className="wh-metric-footer" onClick={() => navigate(isYard ? '/yard/movements' : '/warehouse/movements')}>
            <span>View all</span>
            <span className="arrow">→</span>
          </div>
        </div>

        {/* Card 4: LOAD LANES */}
        <div className="wh-metric-card">
          <div className="wh-metric-header">
            <div className="wh-metric-icon-box icon-purple">
              <LayoutGridIcon size={18} color="#8B5CF6" />
            </div>
            <div className="wh-metric-text-group">
              <div className="wh-metric-label">LOAD LANES</div>
              <div className="wh-metric-value">{liveKpi.loadLanes}</div>
              <div className="wh-metric-sub">Loads in Progress</div>
            </div>
          </div>
          <div className="wh-metric-footer" onClick={() => navigate(isYard ? '/yard/load-lanes' : '/warehouse/load-lanes')}>
            <span>View all</span>
            <span className="arrow">→</span>
          </div>
        </div>

        {/* Card 5: DISPATCH READY */}
        <div className="wh-metric-card">
          <div className="wh-metric-header">
            <div className="wh-metric-icon-box icon-yellow">
              <TruckIcon size={18} color="#EAB308" />
            </div>
            <div className="wh-metric-text-group">
              <div className="wh-metric-label">DISPATCH READY</div>
              <div className="wh-metric-value">{liveKpi.dispatchReady}</div>
              <div className="wh-metric-sub">Ready to Dispatch</div>
            </div>
          </div>
          <div className="wh-metric-footer" onClick={() => navigate(isYard ? '/yard/outbound' : '/warehouse/dispatch-ready')}>
            <span>View all</span>
            <span className="arrow">→</span>
          </div>
        </div>

      </div>

      {/* ── SEARCH & FILTER BAR FOR TABLES ── */}
      <div className="wh-table-filter-bar">
        <div className="wh-search-input-wrap">
          <SearchIcon size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search receipt, load, lane, item, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="wh-filter-search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        <div className="wh-filter-actions">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="wh-status-filter-select"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Staging">Staging</option>
          </select>
          <button 
            className="wh-reset-filter-btn"
            onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* ── MIDDLE ROW: 3 TABLES / CARDS (Exact match to Screenshot 2) ── */}
      <div className="wh-middle-grid">

        {/* 1. INBOUND TODAY */}
        <div className="wh-content-card">
          <div className="wh-card-header">
            <h2 className="wh-card-title">INBOUND TODAY</h2>
          </div>
          
          <div className="wh-table-container">
            <table className="wh-data-table">
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>RECEIPT NO.</th>
                  <th>FROM</th>
                  <th>ITEMS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredInbound.length === 0 ? (
                  <tr><td colSpan="5" className="empty-td">No inbound data matches search filter.</td></tr>
                ) : (
                  filteredInbound.map((row, idx) => (
                    <tr key={idx}>
                      <td className="time-col">{row.time}</td>
                      <td className="bold-col">{row.receiptNo}</td>
                      <td>{row.from}</td>
                      <td>{row.items}</td>
                      <td>
                        <span className="badge badge-amber">{row.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="wh-card-footer" onClick={() => navigate(isYard ? '/yard/inbound' : '/warehouse/inbound')}>
            <span>View all inbound</span>
            <span className="arrow">→</span>
          </div>
        </div>

        {/* 2. LOAD LANES OVERVIEW */}
        <div className="wh-content-card">
          <div className="wh-card-header">
            <h2 className="wh-card-title">LOAD LANES OVERVIEW</h2>
          </div>

          <div className="wh-table-container">
            <table className="wh-data-table">
              <thead>
                <tr>
                  <th>LANE</th>
                  <th>LOAD</th>
                  <th>PROGRESS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoadLanes.length === 0 ? (
                  <tr><td colSpan="4" className="empty-td">No load lane data matches search filter.</td></tr>
                ) : (
                  filteredLoadLanes.map((row, idx) => (
                    <tr key={idx}>
                      <td className="bold-col">{row.lane}</td>
                      <td className="bold-col">{row.load}</td>
                      <td>
                        <div className="wh-progress-wrap">
                          <span className="progress-num">{row.current} / {row.total}</span>
                          <div className="wh-progress-bar-bg">
                            <div 
                              className="wh-progress-bar-fill"
                              style={{ 
                                width: `${(row.current / row.total) * 100}%`,
                                backgroundColor: row.barColor 
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${row.status === 'Staging' ? 'badge-blue' : 'badge-green'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="wh-card-footer" onClick={() => navigate(isYard ? '/yard/load-lanes' : '/warehouse/load-lanes')}>
            <span>View all load lanes</span>
          </div>
        </div>

        {/* 3. RECENT MOVEMENTS */}
        <div className="wh-content-card">
          <div className="wh-card-header">
            <h2 className="wh-card-title">RECENT MOVEMENTS</h2>
          </div>

          <div className="wh-table-container">
            <table className="wh-data-table">
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>ITEM</th>
                  <th>ACTION</th>
                  <th>LOCATION</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.length === 0 ? (
                  <tr><td colSpan="4" className="empty-td">No movements match search filter.</td></tr>
                ) : (
                  filteredMovements.map((row, idx) => (
                    <tr key={idx}>
                      <td className="time-col">{row.time}</td>
                      <td className="bold-col">{row.item}</td>
                      <td>{row.action}</td>
                      <td className="loc-col">{row.location}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="wh-card-footer" onClick={() => navigate(isYard ? '/yard/movements' : '/warehouse/movements')}>
            <span>View full history</span>
          </div>
        </div>

      </div>

      {/* ── QUICK ACTIONS SECTION ── */}
      <div className="wh-quick-actions-card">
        <h2 className="wh-card-title margin-bottom">QUICK ACTIONS</h2>
        
        <div className="wh-quick-actions-grid">
          {/* Action 1: Receive */}
          <button className="wh-quick-action-btn" onClick={() => navigate(isYard ? '/yard/inbound' : '/warehouse/inbound')}>
            <div className="action-icon-wrap action-blue">
              <InboxIcon color="#3B82F6" size={20} />
            </div>
            <div className="action-text-wrap">
              <span className="action-main-label">Receive</span>
              <span className="action-sub-label">(Inbound)</span>
            </div>
          </button>

          {/* Action 2: Find Stock */}
          <button className="wh-quick-action-btn" onClick={() => navigate(isYard ? '/yard/current-stock' : '/warehouse/find-stock')}>
            <div className="action-icon-wrap action-green">
              <SearchIcon color="#10B981" size={20} />
            </div>
            <div className="action-text-wrap">
              <span className="action-main-label">Find Stock</span>
              <span className="action-sub-label">(Vehicle / Item / Load)</span>
            </div>
          </button>

          {/* Action 3: Move / Transfer */}
          <button className="wh-quick-action-btn" onClick={() => navigate(isYard ? '/yard/movements' : '/warehouse/movements')}>
            <div className="action-icon-wrap action-orange">
              <ArrowSwapIcon color="#F97316" size={20} />
            </div>
            <div className="action-text-wrap">
              <span className="action-main-label" style={{ color: '#F97316' }}>Move / Transfer</span>
            </div>
          </button>

          {/* Action 4: Load Lanes */}
          <button className="wh-quick-action-btn" onClick={() => navigate(isYard ? '/yard/load-lanes' : '/warehouse/load-lanes')}>
            <div className="action-icon-wrap action-purple">
              <LayoutGridIcon color="#8B5CF6" size={20} />
            </div>
            <div className="action-text-wrap">
              <span className="action-main-label">Load Lanes</span>
              <span className="action-sub-label">(Staging)</span>
            </div>
          </button>

          {/* Action 5: Dispatch Ready */}
          <button className="wh-quick-action-btn" onClick={() => navigate(isYard ? '/yard/outbound' : '/warehouse/dispatch-ready')}>
            <div className="action-icon-wrap action-yellow">
              <TruckIcon color="#EAB308" size={20} />
            </div>
            <div className="action-text-wrap">
              <span className="action-main-label">Dispatch Ready</span>
              <span className="action-sub-label">(View List)</span>
            </div>
          </button>

          {/* Action 6: Messages */}
          <button className="wh-quick-action-btn" onClick={() => navigate(isYard ? '/yard/reports' : '/warehouse/messages')}>
            <div className="action-icon-wrap action-slate">
              <MailIcon color="#64748B" size={20} />
            </div>
            <div className="action-text-wrap">
              <span className="action-main-label">Messages</span>
            </div>
          </button>
        </div>
      </div>

      {/* ── BOTTOM ROW: CAPACITY & NOTIFICATIONS ── */}
      <div className="wh-bottom-grid">

        {/* 1. Yard Capacity */}
        <div className="wh-content-card">
          <div className="wh-card-header">
            <h2 className="wh-card-title">YARD CAPACITY (VEHICLES)</h2>
          </div>

          <div className="wh-capacity-body">
            <div className="wh-donut-chart-container">
              <svg width="150" height="150" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#E2E8F0" strokeWidth="12" />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="48" 
                  fill="none" 
                  stroke="var(--primary-color)" 
                  strokeWidth="12" 
                  strokeDasharray="301.59" 
                  strokeDashoffset={301.59 - (301.59 * (liveKpi.yardCapacityPercent || 72)) / 100} 
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="wh-donut-center-text">
                <span className="pct-val">{liveKpi.yardCapacityPercent}%</span>
                <span className="pct-lbl">Used</span>
              </div>
            </div>

            <div className="wh-capacity-stats">
              <div className="capacity-stat-row">
                <span className="stat-label">Total Capacity</span>
                <span className="stat-val bold">{liveKpi.totalCap}</span>
              </div>
              <div className="capacity-stat-row">
                <span className="stat-label">In Yard</span>
                <span className="stat-val bold">{liveKpi.inYardCap}</span>
              </div>
              <div className="capacity-stat-row">
                <span className="stat-label">Available</span>
                <span className="stat-val green-val">{liveKpi.availCap}</span>
              </div>
            </div>
          </div>

          <div className="wh-card-footer" onClick={() => navigate(isYard ? '/yard/map' : '/warehouse/map')}>
            <span>View yard layout</span>
          </div>
        </div>

        {/* 2. Notifications */}
        <div className="wh-content-card">
          <div className="wh-card-header">
            <h2 className="wh-card-title">NOTIFICATIONS</h2>
          </div>

          <div className="wh-notif-list">
            {notificationsList.map(item => (
              <div key={item.id} className="wh-notif-item">
                <div className="wh-notif-icon-circle" style={{ backgroundColor: item.iconBg }}>
                  {item.icon}
                </div>
                <div className="wh-notif-content">
                  <div className="wh-notif-text">{item.text}</div>
                  <div className="wh-notif-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="wh-card-footer" onClick={() => navigate(isYard ? '/yard/reports' : '/warehouse/reports')}>
            <span>View all notifications</span>
          </div>
        </div>

      </div>

    </div>
  );
}
