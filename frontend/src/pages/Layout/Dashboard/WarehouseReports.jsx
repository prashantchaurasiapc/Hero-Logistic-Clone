import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  TrendingUp, TrendingDown, Users, Truck, Package, Layers, Clock, Target,
  Download, Calendar, Search, Filter, ChevronRight, ChevronDown, Info,
  FileText, AlertTriangle, CheckCircle, BarChart3, PieChart, Shield, ArrowUpRight,
  MoreVertical, Box, ArrowDownRight, RefreshCw, Eye, History, FileSpreadsheet,
  AlertCircle, DollarSign, Activity, HardHat, CheckSquare, Zap, Cpu, MapPin,
  Thermometer, CheckCircle2, XCircle
} from 'lucide-react';

export default function WarehouseReports() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [dateRange, setDateRange] = useState('This Week (17 Aug 2026 – 23 Aug 2026)');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses');
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [selectedLane, setSelectedLane] = useState('All Load Lanes');
  const [selectedItemType, setSelectedItemType] = useState('All Item Types');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [dbKpis, setDbKpis] = useState(null);
  const [dbItemsByStatus, setDbItemsByStatus] = useState(null);
  const [dbZones, setDbZones] = useState([]);
  const [dbDwell, setDbDwell] = useState(null);
  const [dbTopLanes, setDbTopLanes] = useState([]);
  const [dbTopCarriers, setDbTopCarriers] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/warehouse-portal/reports');
        const data = res.data?.data;
        if (data) {
          setDbKpis(data.headlineKpis);
          if (data.itemsByStatus) setDbItemsByStatus(data.itemsByStatus);
          if (data.inventoryByZone) setDbZones(data.inventoryByZone);
          if (data.dwellTimeAnalysis) setDbDwell(data.dwellTimeAnalysis);
          if (data.topLoadLanes) setDbTopLanes(data.topLoadLanes);
          if (data.topCarriers) setDbTopCarriers(data.topCarriers);
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      }
    };
    fetchReports();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleExport = (type = activeTab, format = 'csv') => {
    setExportMenuOpen(false);

    if (format === 'pdf') {
      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (!printWindow) return;

      const kpis = getKpiCards();

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${type} Executive Report - Hero Logistics</title>
            <style>
              @page { size: landscape; margin: 10mm; }
              body { font-family: 'Inter', system-ui, sans-serif; padding: 20px; color: #0F172A; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid var(--primary-color); padding-bottom: 12px; margin-bottom: 20px; }
              h1 { font-size: 20px; font-weight: 900; text-transform: uppercase; margin: 0; }
              p { font-size: 11px; color: #64748B; margin: 2px 0 0 0; }
              .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
              .card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 8px; }
              .card-title { font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase; }
              .card-val { font-size: 22px; font-weight: 900; color: #0F172A; margin: 4px 0; }
              .card-trend { font-size: 10px; font-weight: 700; color: #16A34A; }
              table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 16px; }
              th { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; color: #64748B; }
              td { border: 1px solid #F1F5F9; padding: 8px 10px; font-size: 10.5px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1>HERO LOGISTICS - ${type.toUpperCase()} ANALYTICS REPORT</h1>
                <p>Date Range: ${dateRange} • Facility: ${selectedWarehouse} (${selectedZone})</p>
              </div>
              <div style="text-align: right; font-size: 10px; color: #64748B;">
                <strong>CONFIDENTIAL</strong><br/>
                Generated: ${new Date().toLocaleString()}
              </div>
            </div>

            <div class="grid">
              ${kpis.map(k => `
                <div class="card">
                  <div class="card-title">${k.lbl}</div>
                  <div class="card-val">${k.val}</div>
                  <div class="card-trend">${k.trend} vs Prior Period</div>
                </div>
              `).join('')}
            </div>

            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Key Metric</th>
                  <th>Value</th>
                  <th>Benchmark / Target</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Volume & Handling</td>
                  <td>Total Items Handled</td>
                  <td>${dbKpis?.totalItemsHandled ?? 0}</td>
                  <td>500 items / day</td>
                  <td>Optimal</td>
                </tr>
                <tr>
                  <td>Receipt Inbound</td>
                  <td>Inbound Completed</td>
                  <td>${dbKpis?.receivedInbound ?? 0}</td>
                  <td>100% Target</td>
                  <td>Active</td>
                </tr>
                <tr>
                  <td>Dispatch Outbound</td>
                  <td>Outbound Loads</td>
                  <td>${dbKpis?.dispatchedOutbound ?? 0}</td>
                  <td>On Schedule</td>
                  <td>Verified</td>
                </tr>
                <tr>
                  <td>Holding / Staging</td>
                  <td>Items in Staging</td>
                  <td>${dbKpis?.stagedItems ?? 0}</td>
                  <td>&lt; 50 units</td>
                  <td>Normal</td>
                </tr>
                <tr>
                  <td>Quality & Accuracy</td>
                  <td>Inventory Accuracy Rate</td>
                  <td>${dbKpis?.accuracyRate || '100%'}</td>
                  <td>&gt;= 99.5%</td>
                  <td>Compliant</td>
                </tr>
              </tbody>
            </table>

            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      showToast(`✓ Printable PDF preview generated for ${type}`);
      return;
    }

    // CSV Download
    const kpis = getKpiCards();
    let csv = `HERO LOGISTICS - ${type.toUpperCase()} REPORT\n`;
    csv += `Date Range,${dateRange}\n`;
    csv += `Warehouse,${selectedWarehouse}\n`;
    csv += `Zone,${selectedZone}\n`;
    csv += `Load Lane,${selectedLane}\n`;
    csv += `Item Type,${selectedItemType}\n\n`;

    csv += `METRIC,VALUE,TREND\n`;
    kpis.forEach(k => {
      csv += `"${k.lbl}","${k.val}","${k.trend}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Hero_Logistics_${type.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`✓ ${type} CSV report downloaded successfully!`);
  };

  const getKpiCards = () => {
    switch (activeTab) {
      case 'Inventory':
        return [
          { lbl: 'TOTAL SKU COUNT', val: String(dbKpis?.totalSkus ?? 0), trend: '0%', isUp: true, icon: Box, bg: 'bg-blue-50 text-blue-600' },
          { lbl: 'TOTAL STOCK VALUE', val: dbKpis?.totalItemsHandled ? '$' + (dbKpis.totalItemsHandled * 35000).toLocaleString() : '$0', trend: '0%', isUp: true, icon: DollarSign, bg: 'bg-emerald-50 text-emerald-600' },
          { lbl: 'LOW STOCK SKUS', val: '0 SKUs', trend: '0%', isUp: false, icon: AlertTriangle, bg: 'bg-amber-50 text-amber-600' },
          { lbl: 'DEAD STOCK RATIO', val: '0%', trend: '0%', isUp: false, icon: Layers, bg: 'bg-purple-50 text-purple-600' },
          { lbl: 'CYCLE COUNT ACCURACY', val: dbKpis?.accuracyRate || '100%', trend: '0%', isUp: true, icon: Target, bg: 'bg-sky-50 text-sky-600' },
          { lbl: 'AVG STOCK TURNOVER', val: 'N/A', trend: '0%', isUp: false, icon: RefreshCw, bg: 'bg-amber-100 text-amber-700' }
        ];
      case 'Operations':
        return [
          { lbl: 'ACTIVE STAFF ON FLOOR', val: dbKpis?.activeStaff !== undefined ? `${dbKpis.activeStaff} Operators` : '0 Operators', trend: '0%', isUp: true, icon: Users, bg: 'bg-blue-50 text-blue-600' },
          { lbl: 'FORKLIFT UTILIZATION', val: dbKpis?.forkliftUtilization || '0 / 8 (0%)', trend: '0%', isUp: true, icon: Truck, bg: 'bg-emerald-50 text-emerald-600' },
          { lbl: 'DOCK DOOR OCCUPANCY', val: dbKpis?.dockDoorOccupancy || '0 / 4 (0%)', trend: '0%', isUp: true, icon: MapPin, bg: 'bg-purple-50 text-purple-600' },
          { lbl: 'STAGING BAY USAGE', val: dbKpis?.stagedItems ? Math.min(100, Math.round((dbKpis.stagedItems / 100) * 100)) + '% Capacity' : '0% Capacity', trend: '0%', isUp: false, icon: Layers, bg: 'bg-amber-50 text-amber-600' },
          { lbl: 'AVG DOCK TURNAROUND', val: 'N/A', trend: '0%', isUp: false, icon: Clock, bg: 'bg-sky-50 text-sky-600' },
          { lbl: 'DAILY INBOUND/OUTBOUND', val: String((dbKpis?.receivedInbound ?? 0) + (dbKpis?.dispatchedOutbound ?? 0)) + ' Items', trend: '0%', isUp: true, icon: Activity, bg: 'bg-amber-100 text-amber-700' }
        ];
      case 'Productivity':
        return [
          { lbl: 'PICKS PER HOUR', val: '0 / hr', trend: '0%', isUp: true, icon: Zap, bg: 'bg-blue-50 text-blue-600' },
          { lbl: 'PUTAWAY RATE', val: '0 items / hr', trend: '0%', isUp: true, icon: Box, bg: 'bg-emerald-50 text-emerald-600' },
          { lbl: 'PACKING SPEED', val: '0 boxes / hr', trend: '0%', isUp: true, icon: Package, bg: 'bg-purple-50 text-purple-600' },
          { lbl: 'PICKER ACCURACY RATE', val: dbKpis?.accuracyRate || '100%', trend: '0%', isUp: true, icon: Target, bg: 'bg-amber-50 text-amber-600' },
          { lbl: 'ORDER CYCLE TIME', val: '0m', trend: '0m', isUp: false, icon: Clock, bg: 'bg-sky-50 text-sky-600' },
          { lbl: 'WORKER UTILIZATION', val: 'N/A', trend: '0%', isUp: true, icon: Users, bg: 'bg-amber-100 text-amber-700' }
        ];
      case 'Dispatch':
        return [
          { lbl: 'TOTAL SHIPMENTS', val: String(dbKpis?.dispatchedOutbound ?? 0) + ' Shipments', trend: '0%', isUp: true, icon: Truck, bg: 'bg-blue-50 text-blue-600' },
          { lbl: 'ON-TIME DISPATCH RATE', val: dbKpis?.dispatchedOutbound ? '100%' : 'N/A', trend: '0%', isUp: true, icon: CheckCircle2, bg: 'bg-emerald-50 text-emerald-600' },
          { lbl: 'CARRIER COMPLIANCE', val: dbKpis?.receivedInbound ? '100%' : 'N/A', trend: '0%', isUp: true, icon: Shield, bg: 'bg-purple-50 text-purple-600' },
          { lbl: 'AVG LOADING TIME', val: '0m', trend: '0%', isUp: false, icon: Clock, bg: 'bg-amber-50 text-amber-600' },
          { lbl: 'PENDING OUTBOUND', val: String(dbKpis?.stagedItems ?? 0) + ' Items', trend: '0 Items', isUp: false, icon: Layers, bg: 'bg-sky-50 text-sky-600' },
          { lbl: 'TRANSIT DAMAGE RATE', val: dbKpis?.transitDamageRate || '0.0%', trend: '0%', isUp: false, icon: AlertTriangle, bg: 'bg-amber-100 text-amber-700' }
        ];
      case 'Compliance':
        return [
          { lbl: 'INCIDENT-FREE DAYS', val: `${dbKpis?.incidentFreeDays ?? 365} Days`, trend: '0 Days', isUp: true, icon: Shield, bg: 'bg-blue-50 text-blue-600' },
          { lbl: 'AUDIT READINESS SCORE', val: 'N/A', trend: '0 pts', isUp: true, icon: CheckSquare, bg: 'bg-emerald-50 text-emerald-600' },
          { lbl: 'HAZMAT COMPLIANCE', val: 'N/A', trend: '0%', isUp: true, icon: AlertCircle, bg: 'bg-purple-50 text-purple-600' },
          { lbl: 'WHS CHECKLIST STATUS', val: 'N/A', trend: '0%', isUp: true, icon: HardHat, bg: 'bg-amber-50 text-amber-600' },
          { lbl: 'TEMP CONTROL VARIANCE', val: 'N/A', trend: '0%', isUp: true, icon: Thermometer, bg: 'bg-sky-50 text-sky-600' },
          { lbl: 'STAFF CERTIFIED', val: 'N/A', trend: '0%', isUp: true, icon: Users, bg: 'bg-amber-100 text-amber-700' }
        ];
      default: // Overview
        return [
          { lbl: 'TOTAL ITEMS HANDLED', val: String(dbKpis?.totalItemsHandled ?? 0), trend: dbKpis?.totalItemsTrend || '0%', isUp: true, icon: Box, bg: 'bg-blue-50 text-blue-600' },
          { lbl: 'RECEIVED (INBOUND)', val: String(dbKpis?.receivedInbound ?? 0), trend: dbKpis?.receivedTrend || '0%', isUp: true, icon: ArrowDownRight, bg: 'bg-emerald-50 text-emerald-600' },
          { lbl: 'DISPATCHED (OUTBOUND)', val: String(dbKpis?.dispatchedOutbound ?? 0), trend: dbKpis?.dispatchedTrend || '0%', isUp: true, icon: Truck, bg: 'bg-purple-50 text-purple-600' },
          { lbl: 'STAGED ITEMS', val: String(dbKpis?.stagedItems ?? 0), trend: dbKpis?.stagedTrend || '0%', isUp: true, icon: Layers, bg: 'bg-amber-50 text-amber-600' },
          { lbl: 'AVG. DWELL TIME', val: dbKpis?.avgDwellTime || '0h', trend: dbKpis?.dwellTrend || '0%', isUp: false, icon: Clock, bg: 'bg-sky-50 text-sky-600' },
          { lbl: 'ACCURACY RATE', val: dbKpis?.accuracyRate || '100%', trend: dbKpis?.accuracyTrend || '0%', isUp: true, icon: Target, bg: 'bg-amber-100 text-amber-700' }
        ];
    }
  };

  return (
    <div className="wh-reports-center-container">
      <style>{`
        .wh-reports-center-container {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background-color: #F8FAFC;
          min-height: 100vh;
          color: #0F172A;
          padding: 16px 20px;
          box-sizing: border-box;
        }
        .wh-rep-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .wh-rep-title { font-size: 17px; font-weight: 900; color: #0F172A; margin: 0; text-transform: uppercase; letter-spacing: -0.3px; }
        .wh-rep-sub { font-size: 11.5px; color: #64748B; margin-top: 2px; }
        .wh-rep-header-actions { display: flex; align-items: center; gap: 10px; }
        .wh-rep-date-picker {
          height: 34px;
          padding: 0 12px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .wh-rep-date-picker:hover {
          border-color: #CBD5E1;
          background: #F8FAFC;
        }
        .wh-btn-export-yellow {
          height: 34px;
          padding: 0 14px;
          background: #FFCC00;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 800;
          color: #0F172A;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .wh-btn-export-yellow:hover { background: #E6B800; }
        .wh-rep-nav-tabs {
          display: flex;
          align-items: center;
          gap: 4px;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 14px;
          overflow-x: auto;
        }
        .wh-rep-tab-item {
          padding: 8px 14px;
          font-size: 11.5px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .wh-rep-tab-item:hover { color: #0F172A; }
        .wh-rep-tab-item.active {
          color: #0F172A;
          border-bottom-color: #FFCC00;
          font-weight: 800;
        }
        .wh-rep-kpi-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          margin-bottom: 14px;
        }
        .wh-rep-kpi-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 12px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .wh-kpi-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }
        .wh-kpi-lbl {
          font-size: 9px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.2px;
          line-height: 1.2;
        }
        .wh-kpi-icon-wrap {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wh-kpi-val {
          font-size: 18px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }
        .wh-kpi-trend {
          font-size: 9px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .wh-rep-filter-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .wh-rep-search-input {
          height: 32px;
          width: 100%;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 0 10px 0 28px;
          font-size: 11px;
          color: #0F172A;
          outline: none;
        }
        .wh-rep-search-input:focus { border-color: #CBD5E1; }
        .wh-rep-filter-select {
          height: 32px;
          padding: 0 10px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          color: #0F172A;
          outline: none;
          cursor: pointer;
        }
        .wh-rep-filter-btn {
          height: 32px;
          padding: 0 10px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
        }
        .wh-rep-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 12px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
        }
        .wh-rep-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid #F1F5F9;
        }
        .wh-rep-card-title { font-size: 10px; font-weight: 900; color: #0F172A; text-transform: uppercase; letter-spacing: 0.3px; }
        .wh-rep-card-link { font-size: 9.5px; font-weight: 700; color: #2563EB; cursor: pointer; }
        .wh-rep-card-link:hover { text-decoration: underline; }
        .wh-lane-item { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
      `}</style>

      <div className="wh-rep-header-row">
        <div>
          <h1 className="wh-rep-title">REPORTS & ANALYTICS CENTER</h1>
          <p className="wh-rep-sub">Real-time insights and reports to help you optimize warehouse operations.</p>
        </div>

        <div className="wh-rep-header-actions">
          <div className="relative">
            <div 
              className="wh-rep-date-picker cursor-pointer flex items-center gap-2" 
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            >
              <Calendar size={14} className="text-slate-500" />
              <span>{dateRange}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
            {dateDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 'calc(100% + 6px)',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                  padding: '6px',
                  zIndex: 1000,
                  minWidth: '260px'
                }}
              >
                {[
                  'This Week (17 Aug 2026 – 23 Aug 2026)',
                  'Today (18 Aug 2026)',
                  'Yesterday (17 Aug 2026)',
                  'This Month (August 2026)',
                  'Last 30 Days',
                  'This Quarter (Q3 2026)',
                  'Year to Date (2026)'
                ].map(opt => (
                  <div
                    key={opt}
                    className="wh-dropdown-item"
                    style={{
                      padding: '8px 12px',
                      fontSize: '11.5px',
                      fontWeight: dateRange === opt ? 800 : 600,
                      color: dateRange === opt ? '#2563EB' : '#0F172A',
                      background: dateRange === opt ? '#EFF6FF' : 'transparent',
                      cursor: 'pointer',
                      borderRadius: '6px'
                    }}
                    onClick={() => {
                      setDateRange(opt);
                      setDateDropdownOpen(false);
                      showToast(`Date range set to: ${opt}`);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              className="wh-btn-export-yellow" 
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
            >
              <Download size={14} />
              <span>Export</span>
              <ChevronDown size={12} />
            </button>

            {exportMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 6px)',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                  padding: '6px',
                  zIndex: 1000,
                  minWidth: '220px'
                }}
              >
                <div
                  style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '6px', color: '#0F172A' }}
                  onClick={() => handleExport(activeTab, 'csv')}
                >
                  <FileSpreadsheet size={14} className="text-emerald-600" />
                  <span>Export CSV</span>
                </div>

                <div
                  style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '6px', color: '#0F172A' }}
                  onClick={() => handleExport(activeTab, 'pdf')}
                >
                  <FileText size={14} className="text-blue-600" />
                  <span>Print PDF</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="wh-rep-nav-tabs">
        {['Overview', 'Inventory', 'Operations', 'Productivity', 'Dispatch', 'Compliance'].map((tab) => (
          <div
            key={tab}
            className={`wh-rep-tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="wh-rep-kpi-grid">
        {getKpiCards().map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div key={idx} className="wh-rep-kpi-card">
              <div className="wh-kpi-top-row">
                <span className="wh-kpi-lbl">{kpi.lbl}</span>
                <div className={`wh-kpi-icon-wrap ${kpi.bg}`}>
                  <IconComp size={14} />
                </div>
              </div>
              <div className="wh-kpi-val">{kpi.val}</div>
              <div className="wh-kpi-trend text-emerald-600">
                <span>{kpi.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="wh-rep-filter-bar">
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()} reports...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="wh-rep-search-input"
          />
        </div>

        <select 
          value={selectedWarehouse} 
          onChange={e => {
            setSelectedWarehouse(e.target.value);
            showToast(`Filtered by Warehouse: ${e.target.value}`);
          }} 
          className="wh-rep-filter-select"
        >
          <option value="All Warehouses">All Warehouses</option>
          <option value="Sydney Depot">Sydney Depot</option>
          <option value="Melbourne Yard">Melbourne Yard</option>
          <option value="Brisbane Linehaul Depot">Brisbane Linehaul Depot</option>
          <option value="Perth Logistics Hub">Perth Logistics Hub</option>
        </select>

        <select 
          value={selectedZone} 
          onChange={e => {
            setSelectedZone(e.target.value);
            showToast(`Filtered by Zone: ${e.target.value}`);
          }} 
          className="wh-rep-filter-select"
        >
          <option value="All Zones">All Zones</option>
          <option value="Zone A">Zone A (Fast Moving)</option>
          <option value="Zone B">Zone B (Bulk Staging)</option>
          <option value="Zone C">Zone C (Car Storage)</option>
          <option value="DG Zone">DG Zone (Dangerous Goods)</option>
        </select>

        <select 
          value={selectedLane} 
          onChange={e => {
            setSelectedLane(e.target.value);
            showToast(`Filtered by Lane: ${e.target.value}`);
          }} 
          className="wh-rep-filter-select"
        >
          <option value="All Load Lanes">All Load Lanes</option>
          <option value="Lane 1">Lane 1 (Sydney Express)</option>
          <option value="Lane 2">Lane 2 (Melbourne Linehaul)</option>
          <option value="Lane 3">Lane 3 (Brisbane Linehaul)</option>
          <option value="Lane 4">Lane 4 (Adelaide Route)</option>
          <option value="Lane 5">Lane 5 (Local Staging)</option>
        </select>

        <select 
          value={selectedItemType} 
          onChange={e => {
            setSelectedItemType(e.target.value);
            showToast(`Filtered by Item Type: ${e.target.value}`);
          }} 
          className="wh-rep-filter-select"
        >
          <option value="All Item Types">All Item Types</option>
          <option value="Vehicle">Vehicle (Car Carrying)</option>
          <option value="Pallets">Pallets & General Freight</option>
          <option value="Containers">Shipping Containers (20ft/40ft)</option>
          <option value="Loose Cargo">Loose & Heavy Machinery</option>
          <option value="Dangerous Goods">Dangerous Goods (Class 3/8)</option>
        </select>

        <button 
          className="wh-rep-filter-btn" 
          onClick={() => {
            setSelectedWarehouse('All Warehouses');
            setSelectedZone('All Zones');
            setSelectedLane('All Load Lanes');
            setSelectedItemType('All Item Types');
            setSearchQuery('');
            showToast('✓ All report filters reset to default');
          }}
        >
          <Filter size={12} />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3.5 items-stretch">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">

          {/* CHART / CARD 1 DEPENDING ON TAB */}
          <div className="wh-rep-card">
            <div className="wh-rep-card-header">
              <span className="wh-rep-card-title">
                {activeTab === 'Overview' && 'INVENTORY MOVEMENT TREND'}
                {activeTab === 'Inventory' && 'STOCK CATEGORY BREAKDOWN'}
                {activeTab === 'Operations' && 'DOCK DOOR UTILIZATION'}
                {activeTab === 'Productivity' && 'HOURLY PICK RATE TREND'}
                {activeTab === 'Dispatch' && 'CARRIER DISPATCH VOLUME'}
                {activeTab === 'Compliance' && 'INCIDENT-FREE TRACKER'}
                <Info size={11} className="text-slate-400 cursor-pointer" />
              </span>
              <span className="wh-rep-card-link" onClick={() => handleExport(`${activeTab} Main Chart`)}>View full report</span>
            </div>

            <div className="flex items-center gap-3 text-[9.5px] font-bold mb-1">
              <span className="flex items-center gap-1 text-blue-600"><span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Primary Metric</span>
              <span className="flex items-center gap-1 text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Secondary Metric</span>
              <span className="flex items-center gap-1 text-purple-600"><span className="w-1.5 h-1.5 rounded-full bg-purple-600" /> Target</span>
            </div>

            {/* SVG Trend Line Chart with Y-Axis */}
            <div className="flex items-stretch gap-1.5 h-32 mt-1">
              <div className="flex flex-col justify-between text-[8.5px] font-extrabold text-slate-400 py-0.5 pr-1 text-right border-r border-slate-200">
                <span>1K</span>
                <span>800</span>
                <span>600</span>
                <span>400</span>
                <span>200</span>
                <span>0</span>
              </div>

              <div className="flex-1 relative flex flex-col justify-between">
                <svg viewBox="0 0 320 100" className="w-full h-full overflow-visible">
                  <line x1="0" y1="0" x2="320" y2="0" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="0" y1="20" x2="320" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="0" y1="40" x2="320" y2="40" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="320" y2="60" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="320" y2="80" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="320" y2="100" stroke="#E2E8F0" />

                  <polyline fill="none" stroke="#2563EB" strokeWidth="2" points="15,40 65,28 115,38 165,20 215,30 265,19 305,28" />
                  <polyline fill="none" stroke="#16A34A" strokeWidth="2" points="15,65 65,54 115,58 165,49 215,40 265,32 305,40" />
                  <polyline fill="none" stroke="#9333EA" strokeWidth="2" points="15,78 65,66 115,75 165,65 215,60 265,48 305,56" />

                  {[
                    { x: 15, y: 40, color: '#2563EB' }, { x: 65, y: 28, color: '#2563EB' }, { x: 115, y: 38, color: '#2563EB' }, { x: 165, y: 20, color: '#2563EB' }, { x: 215, y: 30, color: '#2563EB' }, { x: 265, y: 19, color: '#2563EB' }, { x: 305, y: 28, color: '#2563EB' },
                    { x: 15, y: 65, color: '#16A34A' }, { x: 65, y: 54, color: '#16A34A' }, { x: 115, y: 58, color: '#16A34A' }, { x: 165, y: 49, color: '#16A34A' }, { x: 215, y: 40, color: '#16A34A' }, { x: 265, y: 32, color: '#16A34A' }, { x: 305, y: 40, color: '#16A34A' }
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill={pt.color} stroke="#FFFFFF" strokeWidth="1" />
                  ))}
                </svg>
              </div>
            </div>

            <div className="flex justify-between text-[8.5px] font-bold text-slate-400 mt-1 pl-6">
              <span>12 May</span><span>13 May</span><span>14 May</span><span>15 May</span><span>16 May</span><span>17 May</span><span>18 May</span>
            </div>
          </div>

          {/* CHART / CARD 2 DEPENDING ON TAB */}
          <div className="wh-rep-card">
            <div className="wh-rep-card-header">
              <span className="wh-rep-card-title">
                {activeTab === 'Overview' && 'ITEMS BY STATUS'}
                {activeTab === 'Inventory' && 'STOCK BY CATEGORY'}
                {activeTab === 'Operations' && 'STAFF ALLOCATION'}
                {activeTab === 'Productivity' && 'PICK METHOD BREAKDOWN'}
                {activeTab === 'Dispatch' && 'DISPATCH DELAY REASONS'}
                {activeTab === 'Compliance' && 'AUDIT SCORES BY AREA'}
              </span>
              <span className="wh-rep-card-link" onClick={() => handleExport(`${activeTab} Status`)}>View full report</span>
            </div>

            <div className="flex items-center gap-3 my-auto">
              {(() => {
                const s = dbItemsByStatus;
                const tot = s?.total || 0;
                const circ = 240; // full circumference
                const inStockDash = tot > 0 ? ((s.inStock?.count || 0) / tot) * circ : 0;
                const stagedDash = tot > 0 ? ((s.staged?.count || 0) / tot) * circ : 0;
                const transitDash = tot > 0 ? ((s.inTransit?.count || 0) / tot) * circ : 0;
                const onHoldDash = tot > 0 ? ((s.onHold?.count || 0) / tot) * circ : 0;
                const damagedDash = tot > 0 ? ((s.damaged?.count || 0) / tot) * circ : 0;
                let offset = 0;
                const seg = (dash) => { const o = -offset; offset += dash; return { dash: `${dash.toFixed(1)} ${circ}`, offset: o.toFixed(1) }; };
                const s1 = seg(inStockDash); const s2 = seg(stagedDash); const s3 = seg(transitDash); const s4 = seg(onHoldDash); const s5 = seg(damagedDash);
                return (
                  <>
                    <div className="relative w-26 h-26 flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="14" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#16A34A" strokeWidth="14" strokeDasharray={s1.dash} strokeDashoffset={s1.offset} />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#2563EB" strokeWidth="14" strokeDasharray={s2.dash} strokeDashoffset={s2.offset} />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#EA580C" strokeWidth="14" strokeDasharray={s3.dash} strokeDashoffset={s3.offset} />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#DC2626" strokeWidth="14" strokeDasharray={s4.dash} strokeDashoffset={s4.offset} />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#9333EA" strokeWidth="14" strokeDasharray={s5.dash} strokeDashoffset={s5.offset} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-black text-sm text-slate-900 leading-tight">{tot.toLocaleString()}</span>
                        <span className="text-[7.5px] text-slate-500 font-bold uppercase tracking-wider">Total Items</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5 text-[9px] font-medium flex-1">
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5 text-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />In Stock</span><span className="font-bold text-slate-900">{(s?.inStock?.count ?? 0).toLocaleString()} <span className="text-slate-400 font-normal">({s?.inStock?.percent ?? 0}%)</span></span></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5 text-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-blue-600" />Staged</span><span className="font-bold text-slate-900">{(s?.staged?.count ?? 0).toLocaleString()} <span className="text-slate-400 font-normal">({s?.staged?.percent ?? 0}%)</span></span></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5 text-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-orange-600" />Dispatched</span><span className="font-bold text-slate-900">{(s?.inTransit?.count ?? 0).toLocaleString()} <span className="text-slate-400 font-normal">({s?.inTransit?.percent ?? 0}%)</span></span></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5 text-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-red-600" />To Move</span><span className="font-bold text-slate-900">{(s?.onHold?.count ?? 0).toLocaleString()} <span className="text-slate-400 font-normal">({s?.onHold?.percent ?? 0}%)</span></span></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5 text-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-purple-600" />Damaged</span><span className="font-bold text-slate-900">{(s?.damaged?.count ?? 0).toLocaleString()} <span className="text-slate-400 font-normal">({s?.damaged?.percent ?? 0}%)</span></span></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5 text-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Other</span><span className="font-bold text-slate-900">{(s?.other?.count ?? 0).toLocaleString()} <span className="text-slate-400 font-normal">({s?.other?.percent ?? 0}%)</span></span></div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* CHART / CARD 3 DEPENDING ON TAB */}
          <div className="wh-rep-card">
            <div className="wh-rep-card-header">
              <span className="wh-rep-card-title">
                {activeTab === 'Overview' && 'TOP 5 BUSIEST LOAD LANES'}
                {activeTab === 'Inventory' && 'TOP FAST-MOVING SKUS'}
                {activeTab === 'Operations' && 'EQUIPMENT USAGE RATIO'}
                {activeTab === 'Productivity' && 'TOP OPERATOR ACCURACY'}
                {activeTab === 'Dispatch' && 'TOP CARRIER PARTNERS'}
                {activeTab === 'Compliance' && 'INSPECTION CHECKLIST'}
              </span>
              <span className="wh-rep-card-link" onClick={() => handleExport(`${activeTab} Ranks`)}>View full report</span>
            </div>

            <div className="flex flex-col justify-between flex-1 gap-1">
              {(() => {
                const list = activeTab === 'Dispatch' ? dbTopCarriers : dbTopLanes;
                if (!list || list.length === 0) {
                  return (
                    <div className="text-xs text-slate-400 py-6 text-center">No rank data available in database.</div>
                  );
                }
                return list.map(item => (
                  <div key={item.rank} className="wh-lane-item">
                    <div className="wh-lane-num">{item.rank}</div>
                    <div className="wh-lane-meta">
                      <div className="wh-lane-name-row">
                        <span className="font-extrabold text-slate-900">{item.lane}</span>
                        <span className="text-slate-500">{item.items} • <strong className="text-emerald-600">{item.pct} Utilization</strong></span>
                      </div>
                      <div className="wh-lane-bar-bg">
                        <div className="wh-lane-bar-fill" style={{ width: item.pct }} />
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

        </div>

        {/* RIGHT COL ROW 1: REPORT SHORTCUTS */}
        <div className="lg:col-span-1">
          <div className="wh-rep-card">
            <div className="wh-rep-card-header" style={{ marginBottom: 4 }}>
              <span className="wh-rep-card-title">REPORT SHORTCUTS</span>
            </div>

            <div className="flex flex-col justify-between flex-1 gap-0.5">
              {[
                { name: 'Inventory Summary', icon: Box, bg: 'bg-amber-100 text-amber-700' },
                { name: 'Stock Aging Report', icon: Clock, bg: 'bg-sky-100 text-sky-700' },
                { name: 'Movement History Report', icon: History, bg: 'bg-blue-100 text-blue-700' },
                { name: 'Load Lane Utilization', icon: Layers, bg: 'bg-emerald-100 text-emerald-700' },
                { name: 'Receiving Performance', icon: ArrowDownRight, bg: 'bg-cyan-100 text-cyan-700' },
                { name: 'Dispatch Performance', icon: Truck, bg: 'bg-orange-100 text-orange-700' },
                { name: 'Accuracy & Audit Report', icon: Target, bg: 'bg-yellow-100 text-yellow-800' },
                { name: 'Damaged Items Report', icon: AlertTriangle, bg: 'bg-red-100 text-red-700' }
              ].map((item, i) => {
                const IconComp = item.icon;
                return (
                  <div key={i} className="wh-shortcut-item" onClick={() => showToast(`Opening ${item.name}...`)}>
                    <div className="flex items-center gap-2">
                      <div className={`wh-shortcut-icon-badge ${item.bg}`}>
                        <IconComp size={11} />
                      </div>
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight size={11} className="text-slate-400" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================== ROW 2 (LEFT 3 CARDS + TIP BANNER, RIGHT RECENT REPORTS + ALERTS) ==================== */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3.5">

          {/* ROW 2: PRODUCTIVITY, ZONE, DWELL TIME */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch flex-1">

            {/* COL 1: PRODUCTIVITY OVERVIEW */}
            <div className="wh-rep-card">
              <div className="wh-rep-card-header">
                <span className="wh-rep-card-title">{activeTab.toUpperCase()} METRICS OVERVIEW</span>
                <span className="wh-rep-card-link" onClick={() => handleExport(`${activeTab} Productivity`)}>View full report</span>
              </div>

              <table className="wh-prod-table">
                <thead>
                  <tr>
                    <th>METRIC</th>
                    <th>THIS WEEK</th>
                    <th style={{ textAlign: 'right' }}>VS LAST WEEK</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="font-semibold text-slate-700">Total Items Received</td><td className="font-extrabold text-slate-900">{dbKpis?.receivedInbound ?? '—'}</td><td className="font-bold text-emerald-600 text-right">{dbKpis?.receivedTrend ?? ''}</td></tr>
                  <tr><td className="font-semibold text-slate-700">Total Items Staged</td><td className="font-extrabold text-slate-900">{dbKpis?.stagedItems ?? '—'}</td><td className="font-bold text-emerald-600 text-right">{dbKpis?.stagedTrend ?? ''}</td></tr>
                  <tr><td className="font-semibold text-slate-700">Total Dispatched</td><td className="font-extrabold text-slate-900">{dbKpis?.dispatchedOutbound ?? '—'}</td><td className="font-bold text-emerald-600 text-right">{dbKpis?.dispatchedTrend ?? ''}</td></tr>
                  <tr><td className="font-semibold text-slate-700">Avg Dwell Time</td><td className="font-extrabold text-slate-900">{dbKpis?.avgDwellTime ?? '—'}</td><td className="font-bold text-emerald-600 text-right">{dbKpis?.dwellTrend ?? ''}</td></tr>
                  <tr><td className="font-semibold text-slate-700">Total Items Handled</td><td className="font-extrabold text-slate-900">{dbKpis?.totalItemsHandled ?? '—'}</td><td className="font-bold text-emerald-600 text-right">{dbKpis?.totalItemsTrend ?? ''}</td></tr>
                  <tr><td className="font-semibold text-slate-700">Inventory Accuracy</td><td className="font-extrabold text-slate-900">{dbKpis?.accuracyRate ?? '—'}</td><td className="font-bold text-emerald-600 text-right">{dbKpis?.accuracyTrend ?? ''}</td></tr>
                </tbody>
              </table>
            </div>

            {/* COL 2: INVENTORY BY ZONE */}
            <div className="wh-rep-card">
              <div className="wh-rep-card-header">
                <span className="wh-rep-card-title">INVENTORY BY ZONE</span>
                <span className="wh-rep-card-link" onClick={() => handleExport('Inventory By Zone')}>View full report</span>
              </div>

              <div className="flex flex-col justify-between flex-1 py-0.5">
                <div className="flex justify-between text-[9px] font-extrabold text-slate-400 uppercase mb-1">
                  <span>ZONE</span>
                  <span>ITEMS</span>
                </div>
                {dbZones.length > 0 ? dbZones.map(z => (
                  <div key={z.zone} className="wh-zone-row">
                    <div className="wh-zone-meta">
                      <span className="font-bold text-slate-700 w-16">{z.zone}</span>
                      <div className="wh-lane-bar-bg flex-1">
                        <div className="wh-lane-bar-fill" style={{ width: `${z.percent}%`, background: z.color }} />
                      </div>
                      <span className="font-bold text-slate-900 text-right">{z.count} ({z.percent}%)</span>
                    </div>
                  </div>
                )) : <div className="text-slate-400 text-[10px] py-4 text-center">No zone data available</div>}
              </div>
            </div>

            {/* COL 3: DWELL TIME ANALYSIS */}
            <div className="wh-rep-card">
              <div className="wh-rep-card-header">
                <span className="wh-rep-card-title">DWELL TIME ANALYSIS</span>
                <span className="wh-rep-card-link" onClick={() => handleExport('Dwell Time')}>View full report</span>
              </div>

              <div className="flex items-center gap-3 my-auto">
                {(() => {
                  const ranges = dbDwell?.ranges || [];
                  const circ = 240;
                  let offset = 0;
                  const seg = (pct) => { const dash = (pct / 100) * circ; const o = -offset; offset += dash; return { dash: `${dash.toFixed(1)} ${circ}`, offset: o.toFixed(1) }; };
                  return (
                    <>
                      <div className="relative w-26 h-26 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="14" />
                          {ranges.map((r, i) => { const s = seg(r.percent); return <circle key={i} cx="50" cy="50" r="38" fill="none" stroke={r.color} strokeWidth="14" strokeDasharray={s.dash} strokeDashoffset={s.offset} />; })}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="font-extrabold text-xs text-slate-900">{dbDwell?.average || '—'}</span>
                          <span className="text-[8px] text-slate-500 font-bold">Average</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 text-[9px] font-medium flex-1">
                        {ranges.map((r, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="flex items-center gap-1.5 text-slate-700"><span className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }} />{r.label}</span>
                            <span className="font-bold text-slate-900">{r.count} <span className="text-slate-400 font-normal">({r.percent}%)</span></span>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

          </div>

          {/* BOTTOM TIP BANNER */}
          <div className="wh-bottom-tip-banner">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-blue-600" />
              <span>Tip: Use filters to drill down into specific {activeTab.toLowerCase()} metrics, warehouses, zones or load lanes for more detailed insights.</span>
            </div>
            <span className="font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => showToast('Opening Filter Guide...')}>Learn more</span>
          </div>

        </div>

        {/* RIGHT COL ROW 2: RECENTLY RUN REPORTS + INSIGHTS & ALERTS */}
        <div className="lg:col-span-1 flex flex-col justify-between gap-3.5">

          {/* STACKED CARD 2: RECENTLY RUN REPORTS */}
          <div className="wh-rep-card flex-1">
            <div className="wh-rep-card-header" style={{ marginBottom: 4 }}>
              <span className="wh-rep-card-title">RECENTLY RUN REPORTS</span>
              <span className="wh-rep-card-link" onClick={() => showToast('Opening Recent Reports list')}>View all</span>
            </div>

            <div className="flex flex-col gap-0.5 text-[10px] justify-between flex-1">
              {[
                { title: `${activeTab} Summary Report`, time: new Date().toLocaleString() },
                { title: 'Load Lane Utilization Report', time: new Date(Date.now() - 1800000).toLocaleString() },
                { title: 'Movement History Report', time: new Date(Date.now() - 4200000).toLocaleString() },
                { title: 'Dispatch Performance Report', time: new Date(Date.now() - 7200000).toLocaleString() },
                { title: 'Stock Aging Report', time: new Date(Date.now() - 18000000).toLocaleString() }
              ].map((rep, i) => (
                <div key={i} className="wh-recent-rep-item">
                  <div className="flex items-center gap-2">
                    <FileText size={13} className="text-slate-400 flex-shrink-0" />
                    <div>
                      <div className="font-extrabold text-slate-800 leading-tight">{rep.title}</div>
                      <div className="text-[8.5px] text-slate-400">{rep.time}</div>
                    </div>
                  </div>
                  <MoreVertical size={12} className="text-slate-400 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>

          {/* STACKED CARD 3: INSIGHTS & ALERTS */}
          <div className="wh-rep-card">
            <div className="wh-rep-card-header" style={{ marginBottom: 4 }}>
              <span className="wh-rep-card-title">INSIGHTS & ALERTS</span>
              <span className="wh-rep-card-link" onClick={() => showToast('Opening Insights panel')}>View all</span>
            </div>

            <div className="flex flex-col gap-1 text-[9.5px]">
              <div className="wh-alert-item">
                <CheckCircle size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">Great! {activeTab} efficiency improved by 1.8%</div>
                  <div className="text-[8px] text-slate-400">Keep up the good work. • 2h ago</div>
                </div>
              </div>

              <div className="wh-alert-item">
                <AlertTriangle size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">12 items staged for &gt;8 hours in Zone A.</div>
                  <div className="text-[8px] text-slate-400">Review holding areas. • 3h ago</div>
                </div>
              </div>

              <div className="wh-alert-item">
                <Info size={13} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">Load Lane 5 utilization is very high (92%).</div>
                  <div className="text-[8px] text-slate-400">Consider balancing workloads. • 4h ago</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10,
          padding: '12px 18px', display: 'flex', items: 'center', gap: 10,
          zIndex: 99998, boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
        }}>
          <CheckCircle size={16} className="text-green-600" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>{toast}</span>
        </div>
      )}

    </div>
  );
}
