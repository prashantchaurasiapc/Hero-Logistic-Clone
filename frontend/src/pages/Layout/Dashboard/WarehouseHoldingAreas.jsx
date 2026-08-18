import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import {
  Search, Filter, Plus, ArrowRight, MoreVertical,
  CheckCircle2, Clock, AlertTriangle, Box, Truck,
  MapPin, Printer, RefreshCw, X, ChevronLeft, ChevronRight,
  Download, Layers, SlidersHorizontal, ArrowUpRight, ChevronDown,
  Info, Eye, Tag, AlertCircle
} from 'lucide-react';


const initialStagingAreas = [];
const recentStagedItems = [];

export default function WarehouseHoldingAreas() {
  const navigate = useNavigate();
  const location = useLocation();
  const isYard = location.pathname ? location.pathname.startsWith('/yard') : false;

  const [areas, setAreas] = useState([]);
  const [recentStagedList, setRecentStagedList] = useState([]);
  const [loadLanes, setLoadLanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState({
    totalHoldingAreas: 0,
    activeAreas: 0,
    inactiveAreas: 0,
    stagedItemsTotal: 0,
    awaitingMoveTotal: 0,
    overdueItemsTotal: 0,
    readyForMovePercent: 0,
    waitingOver2hPercent: 0,
    waitingUnder2hPercent: 0,
    overduePercent: 0
  });
  const summary = summaryData;

  const [activeTab, setActiveTab] = useState('All Staging Areas');
  const [cardFilter, setCardFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [laneFilter, setLaneFilter] = useState('All');

  const fetchHoldingAreas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/warehouse-portal/holding-areas');
      const data = res.data?.data || res.data;
      if (data) {
        if (data.holdingAreas) setAreas(data.holdingAreas);
        if (data.recentlyStaged) setRecentStagedList(data.recentlyStaged);
        if (data.summary) setSummaryData(data.summary);
      }
    } catch (err) {
      console.error('Failed to fetch holding areas:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLanes = async () => {
    try {
      const res = await api.get('/warehouse-portal/load-lanes');
      setLoadLanes(res.data?.data?.lanes || res.data?.data || []);
    } catch(err) {}
  };

  useEffect(() => {
    fetchHoldingAreas();
    fetchLanes();
  }, []);

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

  const [viewModalArea, setViewModalArea] = useState(null);
  const [actionMenuAreaId, setActionMenuAreaId] = useState(null);

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
    // Card Filter
    if (cardFilter === 'staged' && (!area.stagedItems || area.stagedItems <= 0)) return false;
    if (cardFilter === 'awaiting' && (!area.awaitingMove || area.awaitingMove <= 0)) return false;
    if (cardFilter === 'overdue' && area.status !== 'Inactive') return false;

    // Tab filter
    if (activeTab === 'Inactive Areas' && area.status !== 'Inactive') return false;
    if (activeTab === 'All Staging Areas' && area.status === 'Inactive' && cardFilter !== 'overdue') return false;

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
    fetchHoldingAreas();
    showToast('Refreshed staging area inventory...');
  };

  const handleExport = () => {
    const exportData = filteredAreas.length > 0 ? filteredAreas : holdingAreas;

    const headers = [
      'Area Name',
      'Sub Location',
      'Area Code',
      'Zone',
      'Next Load Lane',
      'Capacity',
      'Occupancy',
      'Occupancy Pct',
      'Status'
    ];

    const rows = exportData.map(item => [
      `"${item.name}"`,
      `"${item.subLocation}"`,
      `"${item.code}"`,
      `"${item.zone}"`,
      `"${item.lane}"`,
      `"${item.capacity}"`,
      `"${item.occupancy}"`,
      `"${item.occupancyPct}%"`,
      `"${item.status}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Holding_Areas_Inventory_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`✓ Exported ${exportData.length} holding area records to CSV!`);
  };

  const handleConfirmMove = async (e) => {
    e.preventDefault();
    if (!selectedAreaForMove || !targetLane) return;
    try {
      showToast(`Creating task to move from ${selectedAreaForMove} to lane ${targetLane}...`, 'info');
      await api.post(`/warehouse-portal/holding-areas/${selectedAreaForMove}/move-stock`, { loadLaneId: targetLane });
      setCreateMoveModalOpen(false);
      showToast(`✓ Move task created successfully!`);
    } catch(err) {
      console.error(err);
      showToast('Failed to create move task: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleConfirmAssign = async (e) => {
    e.preventDefault();
    if (!selectedAreaForMove || !targetLane) return;
    try {
      showToast(`Assigning staging area to lane...`, 'info');
      await api.patch(`/warehouse-portal/holding-areas/${selectedAreaForMove}/assign`, { loadLaneId: targetLane });
      setAssignModalOpen(false);
      showToast(`✓ Area successfully assigned to lane!`);
    } catch(err) {
      console.error(err);
      showToast('Failed to assign area: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handlePrintBarcode = (area) => {
    if (!area) return;
    const printWindow = window.open('', '_blank', 'width=800,height=650');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Location Barcode Label - ${area.code}</title>
          <style>
            @page { size: auto; margin: 15mm; }
            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              color: #0F172A;
              margin: 0;
              padding: 20px;
              background: #fff;
            }
            .label-card {
              border: 3px solid #0F172A;
              border-radius: 16px;
              padding: 24px;
              max-width: 480px;
              margin: 0 auto;
              text-align: center;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            }
            .header-badge {
              background: var(--primary-color);
              color: #0F172A;
              font-size: 28px;
              font-weight: 900;
              padding: 6px 18px;
              border-radius: 8px;
              display: inline-block;
              letter-spacing: 1px;
            }
            .area-title {
              font-size: 22px;
              font-weight: 800;
              margin: 12px 0 2px 0;
              color: #0F172A;
            }
            .sub-loc {
              font-size: 13px;
              color: #64748B;
              font-weight: 600;
              margin-bottom: 20px;
            }
            .barcode-svg {
              margin: 16px 0;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              background: #F8FAFC;
              padding: 12px;
              border-radius: 8px;
              border: 1px solid #E2E8F0;
              text-align: left;
              font-size: 12px;
              margin-top: 16px;
            }
            .detail-label {
              font-size: 10px;
              font-weight: 800;
              color: #64748B;
              text-transform: uppercase;
            }
            .detail-val {
              font-size: 12px;
              font-weight: 800;
              color: #0F172A;
            }
            .footer-notes {
              margin-top: 16px;
              font-size: 10px;
              color: #94A3B8;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="header-badge">${area.code}</div>
            <div class="area-title">${area.name}</div>
            <div class="sub-loc">${area.subLocation}</div>

            <!-- Visual Barcode Graphic -->
            <div class="barcode-svg">
              <svg width="280" height="70" viewBox="0 0 280 70">
                <rect x="10" y="0" width="4" height="50" fill="#0F172A"/>
                <rect x="18" y="0" width="2" height="50" fill="#0F172A"/>
                <rect x="24" y="0" width="6" height="50" fill="#0F172A"/>
                <rect x="34" y="0" width="3" height="50" fill="#0F172A"/>
                <rect x="40" y="0" width="8" height="50" fill="#0F172A"/>
                <rect x="52" y="0" width="2" height="50" fill="#0F172A"/>
                <rect x="58" y="0" width="5" height="50" fill="#0F172A"/>
                <rect x="66" y="0" width="3" height="50" fill="#0F172A"/>
                <rect x="73" y="0" width="7" height="50" fill="#0F172A"/>
                <rect x="84" y="0" width="2" height="50" fill="#0F172A"/>
                <rect x="90" y="0" width="6" height="50" fill="#0F172A"/>
                <rect x="100" y="0" width="4" height="50" fill="#0F172A"/>
                <rect x="108" y="0" width="2" height="50" fill="#0F172A"/>
                <rect x="114" y="0" width="8" height="50" fill="#0F172A"/>
                <rect x="126" y="0" width="3" height="50" fill="#0F172A"/>
                <rect x="133" y="0" width="5" height="50" fill="#0F172A"/>
                <rect x="142" y="0" width="2" height="50" fill="#0F172A"/>
                <rect x="148" y="0" width="7" height="50" fill="#0F172A"/>
                <rect x="159" y="0" width="4" height="50" fill="#0F172A"/>
                <rect x="167" y="0" width="2" height="50" fill="#0F172A"/>
                <rect x="173" y="0" width="6" height="50" fill="#0F172A"/>
                <rect x="183" y="0" width="3" height="50" fill="#0F172A"/>
                <rect x="190" y="0" width="8" height="50" fill="#0F172A"/>
                <rect x="202" y="0" width="2" height="50" fill="#0F172A"/>
                <rect x="208" y="0" width="5" height="50" fill="#0F172A"/>
                <rect x="216" y="0" width="3" height="50" fill="#0F172A"/>
                <rect x="223" y="0" width="7" height="50" fill="#0F172A"/>
                <rect x="234" y="0" width="2" height="50" fill="#0F172A"/>
                <rect x="240" y="0" width="6" height="50" fill="#0F172A"/>
                <rect x="250" y="0" width="4" height="50" fill="#0F172A"/>
                <rect x="258" y="0" width="2" height="50" fill="#0F172A"/>
                <rect x="264" y="0" width="6" height="50" fill="#0F172A"/>
                <text x="140" y="66" text-anchor="middle" font-family="monospace" font-size="12" font-weight="bold" fill="#0F172A">
                  *${area.code}*
                </text>
              </svg>
            </div>

            <div class="details-grid">
              <div>
                <div class="detail-label">Zone & Lane</div>
                <div class="detail-val">${area.zone} • ${area.lane}</div>
              </div>
              <div>
                <div class="detail-label">Total Capacity</div>
                <div class="detail-val">${area.capacity} Units</div>
              </div>
              <div>
                <div class="detail-label">Current Staged</div>
                <div class="detail-val">${area.stagedItems || 0} Items</div>
              </div>
              <div>
                <div class="detail-label">Depot Facility</div>
                <div class="detail-val">Sydney Central Depot</div>
              </div>
            </div>

            <div class="footer-notes">
              HERO LOGISTICS • LOCATION BARCODE LABEL SHEET
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getOccupancyBarColor = (pct) => {
    if (pct >= 90) return '#EF4444'; // Red
    if (pct >= 80) return '#F59E0B'; // Amber
    return '#22C55E'; // Green
  };

  return (
    <div className="wh-stage-container" onClick={() => setActionMenuAreaId(null)}>
      <style>{`
        .wh-stage-container {
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

        /* HEADER ROW */
        .wh-st-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          width: 100%;
          gap: 16px;
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
          margin-top: 3px;
        }
        .wh-st-actions-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
          flex-shrink: 0;
        }
        .wh-btn-export-st {
          height: 38px;
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
        }

        .wh-btn-add-st {
          height: 38px;
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
          gap: 16px;
          margin-bottom: 24px;
        }
        .wh-st-stat-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .wh-st-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wh-st-icon-box.blue { background: #DBEAFE; color: #2563EB; }
        .wh-st-icon-box.amber { background: #FEF3C7; color: #D97706; }
        .wh-st-icon-box.green { background: #DCFCE7; color: #16A34A; }
        .wh-st-icon-box.purple { background: #F3E8FF; color: #9333EA; }

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
          gap: 18px;
          align-items: flex-start;
        }
        .wh-st-left-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .wh-st-right-col {
          width: 260px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .wh-st-main-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 20px;
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
          border-bottom-color: var(--primary-color);
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
        .wh-st-search-inp:focus { border-color: var(--primary-color); }
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
          white-space: nowrap;
        }
        .wh-st-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
          white-space: nowrap;
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
        .wh-qa-btn:hover { background: #FFFFFF; border-color: var(--primary-color); }

        /* MODAL */
        .wh-modal-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px); z-index: 99999; display: flex;
          align-items: center; justify-content: center; padding: 16px;
        }
        .wh-modal-box {
          background: #FFFFFF; border-radius: 12px; width: 100%; max-width: 440px;
          max-height: 84vh; display: flex; flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden;
        }
        .wh-modal-box form {
          max-height: calc(84vh - 48px);
          overflow-y: auto;
        }

        .wh-st-table-wrap::-webkit-scrollbar {
          height: 6px;
        }
        .wh-st-table-wrap::-webkit-scrollbar-track {
          background: #F1F5F9;
        }
        .wh-st-table-wrap::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }

        @media (max-width: 1024px) {
          .wh-st-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .wh-st-master-grid { flex-direction: column; width: 100%; }
          .wh-st-right-col { width: 100%; }
        }
        @media (max-width: 640px) {
          .wh-stage-container { padding: 10px; width: 100%; max-width: 100vw; box-sizing: border-box; }
          .wh-st-master-grid { width: 100%; max-width: 100%; box-sizing: border-box; }
          .wh-st-left-col { width: 100%; min-width: 0; max-width: 100%; box-sizing: border-box; }
          .wh-st-main-card { width: 100%; min-width: 0; max-width: 100%; box-sizing: border-box; overflow: hidden; }
          .wh-st-stats-grid { grid-template-columns: 1fr; }
          .wh-st-header-row { flex-direction: column; align-items: flex-start; gap: 10px; }
          .wh-st-actions-top { width: 100%; display: flex; flex-direction: column; gap: 6px; }
          .wh-st-actions-top button { width: 100%; height: 38px; justify-content: center; }
          .wh-modal-overlay {
            padding: 8px !important;
            align-items: center !important;
          }
          .wh-modal-box {
            width: 100% !important;
            max-width: 100% !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
            border-radius: 12px !important;
          }
          .wh-st-search-row { flex-direction: column; align-items: stretch; gap: 8px; }
          .wh-st-search-wrap { width: 100%; min-width: 0; }
          .wh-st-filter-sel { width: 100%; box-sizing: border-box; }
          .wh-st-table-wrap { width: 100%; display: block; overflow-x: auto !important; -webkit-overflow-scrolling: touch; box-sizing: border-box; }
          .wh-st-table { min-width: 850px; }
          .wh-st-table th, .wh-st-table td { white-space: nowrap; }
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
        {/* Card 1: TOTAL STAGING AREAS */}
        <div
          className="wh-st-stat-card"
          onClick={() => {
            setCardFilter('all');
            setActiveTab('All Staging Areas');
            setStatusFilter('All');
            setLaneFilter('All');
            setZoneFilter('All');
            setSearchQuery('');
            showToast(`Showing All ${areas.length} Staging Areas`);
          }}
          style={{
            cursor: 'pointer',
            border: cardFilter === 'all' ? '2px solid #3B82F6' : '1px solid #E2E8F0',
            backgroundColor: cardFilter === 'all' ? '#EFF6FF' : '#FFFFFF',
            boxShadow: cardFilter === 'all' ? '0 4px 12px rgba(59, 130, 246, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
            transform: cardFilter === 'all' ? 'translateY(-2px)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="wh-st-icon-box blue">
            <Layers size={20} />
          </div>
          <div>
            <div className="wh-st-stat-title">TOTAL STAGING AREAS</div>
            <div className="wh-st-stat-num">{areas.length}</div>
            <div className="wh-st-stat-sub">
              {areas.filter(a => a.status === 'Active' || a.status !== 'Inactive').length} Active | {areas.filter(a => a.status === 'Inactive').length} Inactive
            </div>
          </div>
        </div>

        {/* Card 2: STAGED ITEMS */}
        <div
          className="wh-st-stat-card"
          onClick={() => {
            const next = cardFilter === 'staged' ? 'all' : 'staged';
            setCardFilter(next);
            showToast(next === 'staged' ? 'Filtering areas with Staged Items' : 'Showing All Staging Areas');
          }}
          style={{
            cursor: 'pointer',
            border: cardFilter === 'staged' ? '2px solid #10B981' : '1px solid #E2E8F0',
            backgroundColor: cardFilter === 'staged' ? '#ECFDF5' : '#FFFFFF',
            boxShadow: cardFilter === 'staged' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
            transform: cardFilter === 'staged' ? 'translateY(-2px)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="wh-st-icon-box green">
            <Box size={20} />
          </div>
          <div>
            <div className="wh-st-stat-title">STAGED ITEMS</div>
            <div className="wh-st-stat-num">
              {areas.reduce((acc, a) => acc + (a.stagedItems || 0), 0)}
            </div>
            <div className="wh-st-stat-sub">Across all areas</div>
          </div>
        </div>

        {/* Card 3: AWAITING MOVE */}
        <div
          className="wh-st-stat-card"
          onClick={() => {
            const next = cardFilter === 'awaiting' ? 'all' : 'awaiting';
            setCardFilter(next);
            showToast(next === 'awaiting' ? 'Filtering areas Awaiting Move to Load Lane' : 'Showing All Staging Areas');
          }}
          style={{
            cursor: 'pointer',
            border: cardFilter === 'awaiting' ? '2px solid #F59E0B' : '1px solid #E2E8F0',
            backgroundColor: cardFilter === 'awaiting' ? '#FFFBEB' : '#FFFFFF',
            boxShadow: cardFilter === 'awaiting' ? '0 4px 12px rgba(245, 158, 11, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
            transform: cardFilter === 'awaiting' ? 'translateY(-2px)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="wh-st-icon-box amber">
            <Truck size={20} />
          </div>
          <div>
            <div className="wh-st-stat-title">AWAITING MOVE</div>
            <div className="wh-st-stat-num">
              {areas.reduce((acc, a) => acc + (a.awaitingMove || 0), 0)}
            </div>
            <div className="wh-st-stat-sub">Ready for load lane</div>
          </div>
        </div>

        {/* Card 4: OVERDUE / INACTIVE ITEMS */}
        <div
          className="wh-st-stat-card"
          onClick={() => {
            if (cardFilter === 'overdue') {
              setCardFilter('all');
              setActiveTab('All Staging Areas');
              showToast('Showing All Staging Areas');
            } else {
              setCardFilter('overdue');
              setActiveTab('Inactive Areas');
              showToast('Showing Inactive / Overdue Staging Areas');
            }
          }}
          style={{
            cursor: 'pointer',
            border: cardFilter === 'overdue' ? '2px solid #EF4444' : '1px solid #E2E8F0',
            backgroundColor: cardFilter === 'overdue' ? '#FEF2F2' : '#FFFFFF',
            boxShadow: cardFilter === 'overdue' ? '0 4px 12px rgba(239, 68, 68, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
            transform: cardFilter === 'overdue' ? 'translateY(-2px)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="wh-st-icon-box red">
            <Clock size={20} />
          </div>
          <div>
            <div className="wh-st-stat-title">OVERDUE ITEMS</div>
            <div className="wh-st-stat-num">{summaryData.overdueItemsTotal || 0}</div>
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
                        <td style={{ textAlign: 'right', position: 'relative' }}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="btn-view-st"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewModalArea(area);
                              }}
                            >
                              View
                            </button>
                            <button
                              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActionMenuAreaId(actionMenuAreaId === area.id ? null : area.id);
                              }}
                            >
                              <MoreVertical size={14} />
                            </button>

                            {/* 3-DOT ACTION MENU POPUP */}
                            {actionMenuAreaId === area.id && (
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
                                  minWidth: '190px',
                                  textAlign: 'left'
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div
                                  className="wh-dropdown-item"
                                  onClick={() => {
                                    setViewModalArea(area);
                                    setActionMenuAreaId(null);
                                  }}
                                >
                                  <Eye size={13} className="text-blue-600" />
                                  <span>View Inventory Details</span>
                                </div>

                                <div
                                  className="wh-dropdown-item"
                                  onClick={() => {
                                    setSelectedAreaForMove(area.name);
                                    setCreateMoveModalOpen(true);
                                    setActionMenuAreaId(null);
                                  }}
                                >
                                  <ArrowRight size={13} className="text-amber-600" />
                                  <span>Create Move Task</span>
                                </div>

                                <div
                                  className="wh-dropdown-item"
                                  onClick={() => {
                                    setSelectedAreaForMove(area.name);
                                    setAssignModalOpen(true);
                                    setActionMenuAreaId(null);
                                  }}
                                >
                                  <Tag size={13} className="text-purple-600" />
                                  <span>Assign Load Lane</span>
                                </div>

                                <div
                                  className="wh-dropdown-item"
                                  onClick={() => {
                                    handlePrintBarcode(area);
                                    setActionMenuAreaId(null);
                                  }}
                                >
                                  <Printer size={13} className="text-slate-600" />
                                  <span>Print Area Barcode</span>
                                </div>

                                <div style={{ height: '1px', background: '#F1F5F9', margin: '4px 0' }} />

                                <div
                                  className="wh-dropdown-item"
                                  onClick={() => {
                                    const nextStatus = area.status === 'Active' ? 'Inactive' : 'Active';
                                    setAreas(areas.map(a => a.id === area.id ? { ...a, status: nextStatus } : a));
                                    showToast(`Updated ${area.name} status to ${nextStatus}`);
                                    setActionMenuAreaId(null);
                                  }}
                                >
                                  <RefreshCw size={13} className="text-emerald-600" />
                                  <span>Mark {area.status === 'Active' ? 'Inactive' : 'Active'}</span>
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
            <div className="wh-st-table-footer">
              <div>Showing 1 to {filteredAreas.length} of {areas.length} staging areas</div>
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
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#22C55E" strokeWidth="4" strokeDasharray={`${summary.readyForMovePercent} 100`} />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray={`${summary.waitingOver2hPercent} 100`} strokeDashoffset={`-${summary.readyForMovePercent}`} />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray={`${summary.waitingUnder2hPercent} 100`} strokeDashoffset={`-${summary.readyForMovePercent + summary.waitingOver2hPercent}`} />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray={`${summary.overduePercent} 100`} strokeDashoffset={`-${summary.readyForMovePercent + summary.waitingOver2hPercent + summary.waitingUnder2hPercent}`} />
                </svg>
                <div className="wh-donut-center">
                  <span style={{ fontSize: '13px', fontWeight: 900 }}>{summary.stagedItemsTotal}</span>
                  <span style={{ fontSize: '7px', color: '#64748B' }}>Total</span>
                </div>
              </div>

              <div className="wh-legend-list">
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#22C55E' }} />
                  <span>Ready for Move <strong>{summary.awaitingMoveTotal} ({summary.readyForMovePercent}%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#F59E0B' }} />
                  <span>Waiting &gt; 2h <strong>0 ({summary.waitingOver2hPercent}%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#3B82F6' }} />
                  <span>Waiting &lt; 2h <strong>{summary.stagedItemsTotal} ({summary.waitingUnder2hPercent}%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#EF4444' }} />
                  <span>Overdue <strong>{summary.overdueItemsTotal} ({summary.overduePercent}%)</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* TOP STAGING AREAS BY OCCUPANCY */}
          <div className="wh-st-side-card">
            <div className="wh-st-side-title">TOP STAGING AREAS BY OCCUPANCY</div>

            <div style={{ marginTop: 8 }}>

              {areas.length === 0 ? (
                <p style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center', padding: '12px 0' }}>No staging areas yet</p>
              ) : (
                [...areas]
                  .sort((a, b) => (b.occupancy || 0) - (a.occupancy || 0))
                  .slice(0, 5)
                  .map((area, i) => {
                    const occ = area.occupancy || 0;
                    const color = occ >= 90 ? '#EF4444' : occ >= 75 ? '#F59E0B' : '#22C55E';
                    const textClass = occ >= 90 ? 'text-red-600' : occ >= 75 ? 'text-amber-600' : 'text-green-600';
                    return (
                      <div className="wh-occ-rank-row" key={i}>
                        <div className="wh-occ-rank-header">
                          <span>{i + 1}. {area.name}</span>
                          <span className={textClass}>{occ}%</span>
                        </div>
                        <div className="wh-occ-rank-bg">
                          <div className="wh-occ-rank-fill" style={{ width: `${occ}%`, background: color }} />
                        </div>
                      </div>
                    );
                  })

              )}

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
              {recentStagedList.length === 0 ? (
                <div className="text-[11px] text-slate-400 py-3 text-center">No staged items yet</div>
              ) : (
                recentStagedList.map(item => (
                  <div key={item.id} className="wh-st-recent-item">
                    <div className="wh-st-recent-thumb flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs">
                      <Box size={14} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="font-extrabold text-slate-900 text-xs truncate">{item.title}</div>
                      <div className="text-[9px] text-slate-500 font-mono truncate">{item.vin}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="text-[9.5px] font-bold text-slate-700">{item.area}</div>
                      <div className="text-[9px] text-blue-600 font-bold">{item.time}</div>
                    </div>
                  </div>
                ))
              )}
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

            <button className="wh-qa-btn" onClick={() => navigate(isYard ? '/yard/current-stock' : '/warehouse/find-stock')}>
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
                    <option key={a.id} value={a.id}>{a.name} ({a.subLocation})</option>
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
                  {loadLanes.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.location || 'Yard'})</option>
                  ))}
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
                    <option key={a.id} value={a.id}>{a.name} ({a.zone})</option>
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
                  {loadLanes.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.location || 'Yard'})</option>
                  ))}
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

      {/* ADD HOLDING AREA MODAL (NARROW COMPACT WIDTH & RESPONSIVE HEIGHT) */}
      {addAreaModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setAddAreaModalOpen(false)}>
          <div
            className="wh-modal-box"
            style={{ maxWidth: 540, padding: 0, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}
          >
            
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-200 flex-shrink-0">
              <h3 className="font-black text-sm text-slate-900">Add New Holding Area</h3>
              <button onClick={() => setAddAreaModalOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-800">
                <X size={16} />
              </button>
            </div>

            {/* MODAL BODY (2-COLUMN GRID WITH SCROLL) */}
            <form onSubmit={handleCreateArea} className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto min-h-0">
              
              {/* LEFT STEPPER PANEL (5 COLS - HIDDEN ON MOBILE) */}
              <div className="hidden md:flex md:col-span-5 p-3 bg-slate-50 border-r border-slate-200 flex-col justify-between select-none">
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-3">
                    HOW TO ADD A HOLDING AREA
                  </div>

                  {/* STEP 1 */}
                  <div
                    onClick={() => setActiveStep(1)}
                    className={`flex gap-2.5 mb-2.5 cursor-pointer p-1.5 rounded-lg transition-all ${activeStep === 1 ? 'bg-amber-50 border border-amber-200/80 shadow-sm' : 'hover:bg-slate-100/80'}`}
                  >
                    <div className={`w-5 h-5 rounded-full font-extrabold text-[11px] flex items-center justify-center flex-shrink-0 transition-all ${activeStep === 1 ? 'bg-amber-400 text-slate-900 shadow-sm' : 'border border-slate-300 text-slate-500 bg-white'}`}>
                      1
                    </div>
                    <div>
                      <div className={`font-extrabold text-[11.5px] transition-colors ${activeStep === 1 ? 'text-amber-700' : 'text-slate-800'}`}>Basic Information</div>
                      <div className="text-[9.5px] text-slate-500 mt-0.5 leading-snug">
                        Provide an area name and area code to uniquely identify this staging spot.
                      </div>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div
                    onClick={() => setActiveStep(2)}
                    className={`flex gap-2.5 mb-2.5 cursor-pointer p-1.5 rounded-lg transition-all ${activeStep === 2 ? 'bg-amber-50 border border-amber-200/80 shadow-sm' : 'hover:bg-slate-100/80'}`}
                  >
                    <div className={`w-5 h-5 rounded-full font-extrabold text-[11px] flex items-center justify-center flex-shrink-0 transition-all ${activeStep === 2 ? 'bg-amber-400 text-slate-900 shadow-sm' : 'border border-slate-300 text-slate-500 bg-white'}`}>
                      2
                    </div>
                    <div>
                      <div className={`font-extrabold text-[11.5px] transition-colors ${activeStep === 2 ? 'text-amber-700' : 'text-slate-800'}`}>Set Capacity</div>
                      <div className="text-[9.5px] text-slate-500 mt-0.5 leading-snug">
                        Define the maximum capacity for items that can be held in this area.
                      </div>
                    </div>
                  </div>

                  {/* STEP 3 */}
                  <div
                    onClick={() => setActiveStep(3)}
                    className={`flex gap-2.5 mb-2.5 cursor-pointer p-1.5 rounded-lg transition-all ${activeStep === 3 ? 'bg-amber-50 border border-amber-200/80 shadow-sm' : 'hover:bg-slate-100/80'}`}
                  >
                    <div className={`w-5 h-5 rounded-full font-extrabold text-[11px] flex items-center justify-center flex-shrink-0 transition-all ${activeStep === 3 ? 'bg-amber-400 text-slate-900 shadow-sm' : 'border border-slate-300 text-slate-500 bg-white'}`}>
                      3
                    </div>
                    <div>
                      <div className={`font-extrabold text-[11.5px] transition-colors ${activeStep === 3 ? 'text-amber-700' : 'text-slate-800'}`}>Optional Settings</div>
                      <div className="text-[9.5px] text-slate-500 mt-0.5 leading-snug">
                        Add a description and mark if this is a restricted or temperature controlled area.
                      </div>
                    </div>
                  </div>

                  {/* STEP 4 */}
                  <div
                    onClick={() => setActiveStep(4)}
                    className={`flex gap-2.5 mb-2.5 cursor-pointer p-1.5 rounded-lg transition-all ${activeStep === 4 ? 'bg-amber-50 border border-amber-200/80 shadow-sm' : 'hover:bg-slate-100/80'}`}
                  >
                    <div className={`w-5 h-5 rounded-full font-extrabold text-[11px] flex items-center justify-center flex-shrink-0 transition-all ${activeStep === 4 ? 'bg-amber-400 text-slate-900 shadow-sm' : 'border border-slate-300 text-slate-500 bg-white'}`}>
                      4
                    </div>
                    <div>
                      <div className={`font-extrabold text-[11.5px] transition-colors ${activeStep === 4 ? 'text-amber-700' : 'text-slate-800'}`}>Save</div>
                      <div className="text-[9.5px] text-slate-500 mt-0.5 leading-snug">
                        Click Save Area to create the holding area. It will be available immediately.
                      </div>
                    </div>
                  </div>
                </div>

                {/* HELP NOTE BOX AT BOTTOM */}
                <div className="p-2 bg-blue-50/80 border border-blue-200/80 rounded-lg flex items-start gap-1.5 text-[10px] text-blue-900 mt-2">
                  <Info size={13} className="flex-shrink-0 text-blue-600 mt-0.5" />
                  <span className="leading-snug">
                    Holding areas help you organize inventory before items are moved to load lanes.
                  </span>
                </div>
              </div>

              {/* RIGHT FORM FIELDS PANEL */}
              <div className="col-span-12 md:col-span-7 p-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  
                  {/* AREA DETAILS SECTION */}
                  <div>
                    <div className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      AREA DETAILS
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 block mb-0.5">Area Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Stage Area 9"
                          value={newAreaName}
                          onChange={e => setNewAreaName(e.target.value)}
                          className="w-full h-7.5 px-2 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 block mb-0.5">Area Code <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. SA-09"
                          value={newAreaCode}
                          onChange={e => setNewAreaCode(e.target.value)}
                          className="w-full h-7.5 px-2 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400"
                        />
                        <span className="text-[9px] text-slate-400 block mt-0.5">Unique code to identify area</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 block mb-0.5">Zone <span className="text-red-500">*</span></label>
                        <select
                          required
                          value={newAreaZone}
                          onChange={e => setNewAreaZone(e.target.value)}
                          className="w-full h-7.5 px-2 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400"
                        >
                          <option value="">Select Zone</option>
                          <option value="Zone A">Zone A</option>
                          <option value="Zone B">Zone B</option>
                          <option value="Zone C">Zone C</option>
                          <option value="Zone D">Zone D</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 flex items-center justify-between mb-0.5">
                          <span>Next Load Lane</span>
                          <Info size={10} className="text-slate-400" />
                        </label>
                        <select
                          value={newAreaLane}
                          onChange={e => setNewAreaLane(e.target.value)}
                          className="w-full h-7.5 px-2 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400"
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
                    <div className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      CAPACITY
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 block mb-0.5">Maximum Capacity <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 50"
                          value={newAreaCap}
                          onChange={e => setNewAreaCap(e.target.value)}
                          className="w-full h-7.5 px-2 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400"
                        />
                        <span className="text-[9px] text-slate-400 block mt-0.5">Total capacity</span>
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-700 block mb-0.5">Unit Type</label>
                        <select
                          value={newAreaUnit}
                          onChange={e => setNewAreaUnit(e.target.value)}
                          className="w-full h-7.5 px-2 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400"
                        >
                          <option value="Items">Items</option>
                          <option value="Pallets">Pallets</option>
                          <option value="Containers">Containers</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* ADDITIONAL SETTINGS SECTION */}
                  <div>
                    <div className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      ADDITIONAL SETTINGS (OPTIONAL)
                    </div>

                    <div className="mb-2">
                      <label className="text-[10px] font-extrabold text-slate-700 block mb-0.5">Description</label>
                      <textarea
                        rows={1.5}
                        placeholder="Enter description (optional)"
                        value={newAreaDesc}
                        onChange={e => setNewAreaDesc(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded-md text-xs font-medium outline-none focus:border-amber-400 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="flex items-start gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isRestricted}
                          onChange={e => setIsRestricted(e.target.checked)}
                          className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 accent-amber-400 cursor-pointer"
                        />
                        <div>
                          <div className="text-[11px] font-bold text-slate-800">Restricted Area</div>
                          <div className="text-[9px] text-slate-400">Authorized staff only</div>
                        </div>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isTempControlled}
                          onChange={e => setIsTempControlled(e.target.checked)}
                          className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 accent-amber-400 cursor-pointer"
                        />
                        <div>
                          <div className="text-[11px] font-bold text-slate-800">Temp Controlled</div>
                          <div className="text-[9px] text-slate-400">Requires temp control</div>
                        </div>
                      </label>
                    </div>
                  </div>

                </div>

                {/* FOOTER BUTTONS */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 mt-3">
                  <button
                    type="button"
                    onClick={() => setAddAreaModalOpen(false)}
                    className="px-3 py-1 border border-slate-300 rounded-md text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-amber-400 hover:bg-amber-500 rounded-md text-xs font-black text-slate-900 shadow-sm"
                  >
                    Save Area
                  </button>
                </div>

              </div>

            </form>

          </div>
        </div>
      )}
      {/* VIEW STAGING AREA MODAL */}
      {viewModalArea && (
        <div className="wh-modal-overlay" onClick={() => setViewModalArea(null)}>
          <div className="wh-modal-box" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header" style={{ background: '#FFFFFF', color: '#0F172A', padding: '14px 18px', borderBottom: '1px solid #E2E8F0' }}>
              <div className="flex items-center gap-3">
                <div style={{ background: 'var(--primary-color)', color: '#0F172A', fontWeight: 900, fontSize: '12px', padding: '4px 8px', borderRadius: '6px' }}>
                  {viewModalArea.code}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900" style={{ margin: 0 }}>{viewModalArea.name}</h3>
                  <div className="text-[10px] text-slate-500 font-medium">{viewModalArea.subLocation}</div>
                </div>
              </div>
              <button onClick={() => setViewModalArea(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition">
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '80vh', overflowY: 'auto' }}>

              {/* OVERVIEW CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px' }}>
                  <div className="text-[9.5px] font-extrabold text-slate-500 uppercase">Zone / Lane</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">{viewModalArea.zone} • {viewModalArea.lane}</div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px' }}>
                  <div className="text-[9.5px] font-extrabold text-slate-500 uppercase">Status</div>
                  <span className={viewModalArea.status === 'Active' ? 'badge-active' : 'badge-inactive'} style={{ display: 'inline-block', marginTop: '3px' }}>
                    {viewModalArea.status}
                  </span>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px' }}>
                  <div className="text-[9.5px] font-extrabold text-slate-500 uppercase">Oldest Item</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">{viewModalArea.oldestItem}</div>
                </div>
              </div>

              {/* OCCUPANCY BAR CARD */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-extrabold text-slate-900">Capacity & Occupancy</span>
                  <span className="text-xs font-black text-slate-900">{viewModalArea.occupancy}% ({viewModalArea.stagedItems} / {viewModalArea.capacity} Capacity)</span>
                </div>
                <div className="occ-bar-bg" style={{ width: '100%', height: '8px' }}>
                  <div
                    className="occ-bar-fill"
                    style={{
                      width: `${viewModalArea.occupancy}%`,
                      background: getOccupancyBarColor(viewModalArea.occupancy)
                    }}
                  />
                </div>
              </div>

              {/* STAGED ITEMS IN THIS AREA */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-extrabold text-slate-900 uppercase">Currently Staged Cargo</span>
                  <span className="text-[10px] font-bold text-slate-500">{viewModalArea.stagedItems} Items</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recentStagedItems.slice(0, 3).map((stItem) => (
                    <div key={stItem.id} style={{ padding: '8px 10px', background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="flex items-center gap-3">
                        <img src={stItem.image} alt={stItem.title} style={{ width: '36px', height: '30px', borderRadius: '4px', objectFit: 'cover' }} />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{stItem.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{stItem.ref}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="badge-active" style={{ fontSize: '9px' }}>Staged</span>
                        <div className="text-[9.5px] text-slate-400 mt-0.5">{stItem.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIONS INSIDE MODAL */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <button
                  className="flex-1 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-lg font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                  onClick={() => {
                    setSelectedAreaForMove(viewModalArea.name);
                    setCreateMoveModalOpen(true);
                    setViewModalArea(null);
                  }}
                >
                  <ArrowRight size={14} />
                  <span>Create Move Task</span>
                </button>

                <button
                  className="px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-xs flex items-center gap-1.5 transition"
                  onClick={() => handlePrintBarcode(viewModalArea)}
                >
                  <Printer size={14} />
                  <span>Print Barcode</span>
                </button>

                <button
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-600 rounded-lg font-bold text-xs transition"
                  onClick={() => setViewModalArea(null)}
                >
                  Close
                </button>
              </div>

            </div>
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
