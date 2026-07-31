import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Plus, MapPin, Printer, RefreshCw, FileText, AlertTriangle, ArrowRight, X,
  Layers, Box, Truck, ShieldCheck, Snowflake, Lock, Wrench, Users, ZoomIn, ZoomOut,
  Maximize2, CheckCircle2, ChevronRight, Download, Filter, Info, ChevronDown
} from 'lucide-react';

export default function WarehouseMap() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('WAREHOUSE'); // 'WAREHOUSE' | 'YARD'
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [legendsModalOpen, setLegendsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRefresh = () => {
    showToast('Refreshed real-time warehouse map status...');
  };

  const handleLocationClick = (locName, type, details) => {
    setSelectedLocation({ name: locName, type, details });
  };

  // Helper to render rack slot grids
  const renderRackSlots = (total, occupied, staging, full) => {
    const slots = [];
    for (let i = 0; i < total; i++) {
      let color = '#22C55E'; // Green available
      if (i < full) color = '#EF4444'; // Red full
      else if (i < full + staging) color = '#F59E0B'; // Amber staging
      else if (i < full + staging + occupied) color = '#3B82F6'; // Blue in use
      slots.push(
        <div
          key={i}
          style={{
            width: '100%',
            height: 8,
            borderRadius: 2,
            background: color,
            opacity: 0.85
          }}
        />
      );
    }
    return slots;
  };

  return (
    <div className="wh-map-container">
      <style>{`
        .wh-map-container {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #F8FAFC;
          min-height: 100vh;
          color: #0F172A;
          padding: 20px 24px;
          box-sizing: border-box;
        }

        /* HEADER ROW */
        .wh-map-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .wh-map-title {
          font-size: 18px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -0.3px;
        }
        .wh-map-sub {
          font-size: 12px;
          color: #64748B;
          margin-top: 2px;
        }
        .wh-map-actions-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wh-btn-legends {
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
        .wh-btn-legends:hover { background: #F1F5F9; }

        .wh-btn-refresh-map {
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

        /* MASTER LAYOUT */
        .wh-map-master-grid {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .wh-map-left-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .wh-map-right-col {
          width: 250px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* MODE TABS */
        .wh-map-mode-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          border-bottom: 1px solid #E2E8F0;
        }
        .wh-mode-tab {
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 800;
          color: #64748B;
          background: transparent;
          border: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }
        .wh-mode-tab.active {
          color: #0F172A;
          border-bottom-color: #FFD400;
        }

        /* MAP CANVAS BOARD */
        .wh-map-canvas-card {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          position: relative;
        }

        /* ZOOM CONTROLS */
        .wh-map-zoom-tools {
          position: absolute;
          top: 14px;
          left: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 10;
        }
        .wh-zoom-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #0F172A;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        /* MAP SECTIONS */
        .wh-map-top-ops {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 14px;
          padding-left: 36px;
        }
        .wh-op-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .wh-op-box:hover { border-color: #FFD400; }
        .wh-op-title { font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase; }
        .wh-op-num { font-size: 16px; font-weight: 900; color: #0F172A; }

        /* MIDDLE RACKS & ZONES GRID */
        .wh-map-mid-grid {
          display: flex;
          gap: 10px;
          margin-bottom: 14px;
        }
        .wh-cold-box {
          width: 100px;
          background: #EFF6FF;
          border: 1.5px dashed #3B82F6;
          border-radius: 10px;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
        }

        .wh-zones-flex {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .wh-zone-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 10px;
          cursor: pointer;
        }
        .wh-zone-title { font-size: 11px; font-weight: 900; color: #0F172A; text-align: center; }
        .wh-zone-cap { font-size: 9.5px; font-weight: 700; color: #D97706; text-align: center; margin-bottom: 6px; }

        .wh-rack-slots-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3px;
        }

        /* LOAD LANES SIDE ROW */
        .wh-lanes-panel {
          width: 130px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 10px;
        }
        .wh-lanes-title { font-size: 9.5px; font-weight: 900; color: #0F172A; text-transform: uppercase; margin-bottom: 8px; }
        .wh-lane-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          border-bottom: 1px solid #F1F5F9;
          font-size: 9.5px;
        }
        .wh-lane-item:last-child { border-bottom: none; }

        /* BOTTOM FACILITY CARDS */
        .wh-map-bot-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        .wh-fac-card {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        /* YARD BOTTOM CANVAS */
        .wh-yard-canvas-sec {
          background: #F1F5F9;
          border: 1px dashed #CBD5E1;
          border-radius: 12px;
          padding: 14px;
        }
        .wh-yard-title { font-size: 11px; font-weight: 900; color: #0F172A; text-transform: uppercase; margin-bottom: 10px; }

        .wh-yard-storage-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 10px;
        }
        .wh-yard-park-box {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 10px;
          cursor: pointer;
        }

        .wh-gate-lanes-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background: #FFFFFF;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 800;
        }

        /* BOTTOM TIP */
        .wh-map-tip-bar {
          margin-top: 10px;
          padding: 8px 12px;
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          border-radius: 8px;
          font-size: 11px;
          color: #1E40AF;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* RIGHT SIDEBAR */
        .wh-map-side-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .wh-map-side-title {
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
        .wh-legend-list { display: flex; flex-direction: column; gap: 3px; font-size: 9.5px; }
        .wh-legend-item { display: flex; align-items: center; gap: 6px; }
        .wh-legend-dot { width: 8px; height: 8px; border-radius: 50%; }

        /* YARD SUMMARY ROWS */
        .wh-ys-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
          border-bottom: 1px solid #F1F5F9;
          font-size: 10.5px;
        }
        .wh-ys-row:last-child { border-bottom: none; }

        /* MAP LEGEND LIST */
        .wh-leg-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          font-size: 9.5px;
          font-weight: 700;
          color: #475569;
        }

        /* QUICK ACTIONS GRID */
        .wh-qa-circle-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .wh-qa-circle-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 10px 4px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          font-size: 10px;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
          transition: background 0.15s;
        }
        .wh-qa-circle-btn:hover { background: #FFFFFF; border-color: #FFD400; }

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
          .wh-map-top-ops { grid-template-columns: repeat(2, 1fr); padding-left: 0; }
          .wh-map-master-grid { flex-direction: column; }
          .wh-map-right-col { width: 100%; }
        }
        @media (max-width: 640px) {
          .wh-map-mid-grid { flex-direction: column; }
          .wh-zones-flex { grid-template-columns: repeat(2, 1fr); }
          .wh-yard-storage-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* HEADER ROW */}
      <div className="wh-map-header-row">
        <div>
          <h1 className="wh-map-title">WAREHOUSE & YARD MAP</h1>
          <p className="wh-map-sub">Real-time overview of locations, inventory, and yard status.</p>
        </div>

        <div className="wh-map-actions-top">
          <button className="wh-btn-legends" onClick={() => setLegendsModalOpen(true)}>
            <Layers size={14} />
            <span>Legends</span>
          </button>
          <button className="wh-btn-refresh-map" onClick={handleRefresh}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* MASTER GRID LAYOUT */}
      <div className="wh-map-master-grid">

        {/* LEFT COLUMN MAP BOARD */}
        <div className="wh-map-left-col">

          {/* MODE TABS */}
          <div className="wh-map-mode-tabs">
            <button
              className={`wh-mode-tab ${activeTab === 'WAREHOUSE' ? 'active' : ''}`}
              onClick={() => setActiveTab('WAREHOUSE')}
            >
              WAREHOUSE
            </button>
            <button
              className={`wh-mode-tab ${activeTab === 'YARD' ? 'active' : ''}`}
              onClick={() => setActiveTab('YARD')}
            >
              YARD
            </button>
          </div>

          {/* MAP CANVAS BOARD */}
          <div className="wh-map-canvas-card">

            {/* ZOOM TOOLS */}
            <div className="wh-map-zoom-tools">
              <button className="wh-zoom-btn" onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))} title="Zoom In">
                <ZoomIn size={14} />
              </button>
              <button className="wh-zoom-btn" onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))} title="Zoom Out">
                <ZoomOut size={14} />
              </button>
              <button className="wh-zoom-btn" onClick={() => setZoomLevel(100)} title="Reset View">
                <Maximize2 size={14} />
              </button>
            </div>

            <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left', transition: 'transform 0.2s' }}>

              {/* TOP OPERATIONAL AREAS */}
              <div className="wh-map-top-ops">
                <div className="wh-op-box" onClick={() => handleLocationClick('Receiving Area', 'Inbound', '2 In Progress')}>
                  <Box size={18} className="text-blue-600" />
                  <div>
                    <div className="wh-op-title">RECEIVING AREA</div>
                    <div className="wh-op-num">2 <span className="text-[10px] text-slate-500 font-normal">In Progress</span></div>
                  </div>
                </div>

                <div className="wh-op-box" onClick={() => handleLocationClick('QC Inspection', 'Quality Check', '1 In Progress')}>
                  <ShieldCheck size={18} className="text-teal-600" />
                  <div>
                    <div className="wh-op-title">QC INSPECTION</div>
                    <div className="wh-op-num">1 <span className="text-[10px] text-slate-500 font-normal">In Progress</span></div>
                  </div>
                </div>

                <div className="wh-op-box" onClick={() => handleLocationClick('Staging Area', 'Staging', '18 Items')}>
                  <Layers size={18} className="text-purple-600" />
                  <div>
                    <div className="wh-op-title">STAGING AREA</div>
                    <div className="wh-op-num">18 <span className="text-[10px] text-slate-500 font-normal">Items</span></div>
                  </div>
                </div>

                <div className="wh-op-box" onClick={() => handleLocationClick('Dispatch Area', 'Outbound', '24 Items')}>
                  <Truck size={18} className="text-green-600" />
                  <div>
                    <div className="wh-op-title">DISPATCH AREA</div>
                    <div className="wh-op-num">24 <span className="text-[10px] text-slate-500 font-normal">Items</span></div>
                  </div>
                </div>
              </div>

              {/* MIDDLE RACKS & COLD STORAGE */}
              <div className="wh-map-mid-grid">

                {/* COLD STORAGE */}
                <div className="wh-cold-box" onClick={() => handleLocationClick('Cold Storage', 'Cold Chain', '12 Items')}>
                  <Snowflake size={20} className="text-blue-500 mb-1" />
                  <div className="text-[10px] font-extrabold text-blue-700 uppercase">COLD STORAGE</div>
                  <div className="text-sm font-black text-slate-900 mt-1">12 <span className="text-[9px] text-slate-500 font-normal">Items</span></div>
                </div>

                {/* ZONES A-D */}
                <div className="wh-zones-flex">
                  <div className="wh-zone-card" onClick={() => handleLocationClick('Zone A', 'Dry Storage', '85% Capacity')}>
                    <div className="wh-zone-title">ZONE A</div>
                    <div className="wh-zone-cap">85% Capacity</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <div className="flex flex-col gap-1">
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-amber-500" />
                        <div className="h-2.5 rounded-xs bg-amber-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-amber-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                      </div>
                    </div>
                  </div>

                  <div className="wh-zone-card" onClick={() => handleLocationClick('Zone B', 'Dry Storage', '62% Capacity')}>
                    <div className="wh-zone-title">ZONE B</div>
                    <div className="wh-zone-cap">62% Capacity</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <div className="flex flex-col gap-1">
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-amber-500" />
                        <div className="h-2.5 rounded-xs bg-amber-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-amber-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                      </div>
                    </div>
                  </div>

                  <div className="wh-zone-card" onClick={() => handleLocationClick('Zone C', 'Dry Storage', '74% Capacity')}>
                    <div className="wh-zone-title">ZONE C</div>
                    <div className="wh-zone-cap">74% Capacity</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <div className="flex flex-col gap-1">
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-amber-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-amber-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                      </div>
                    </div>
                  </div>

                  <div className="wh-zone-card" onClick={() => handleLocationClick('Zone D', 'High Bay', '91% Capacity')}>
                    <div className="wh-zone-title">ZONE D</div>
                    <div className="wh-zone-cap text-red-600">91% Capacity</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <div className="flex flex-col gap-1">
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-amber-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-red-500" />
                        <div className="h-2.5 rounded-xs bg-amber-500" />
                        <div className="h-2.5 rounded-xs bg-blue-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                        <div className="h-2.5 rounded-xs bg-green-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* LOAD LANES SIDE ROW */}
                <div className="wh-lanes-panel" style={{ width: 140 }}>
                  <div className="wh-lanes-title">LOAD LANES</div>
                  
                  <div className="wh-lane-item flex justify-between items-center py-1">
                    <div>
                      <div className="font-bold text-slate-900 text-[10px]">LANE 1</div>
                      <div className="text-[8.5px] font-extrabold text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Ready
                      </div>
                    </div>
                    <span className="text-green-600 font-extrabold text-xs">6 / 8</span>
                  </div>

                  <div className="wh-lane-item flex justify-between items-center py-1">
                    <div>
                      <div className="font-bold text-slate-900 text-[10px]">LANE 2</div>
                      <div className="text-[8.5px] font-extrabold text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Ready
                      </div>
                    </div>
                    <span className="text-green-600 font-extrabold text-xs">5 / 8</span>
                  </div>

                  <div className="wh-lane-item flex justify-between items-center py-1">
                    <div>
                      <div className="font-bold text-slate-900 text-[10px]">LANE 3</div>
                      <div className="text-[8.5px] font-extrabold text-amber-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" /> Staging
                      </div>
                    </div>
                    <span className="text-amber-600 font-extrabold text-xs">7 / 8</span>
                  </div>

                  <div className="wh-lane-item flex justify-between items-center py-1">
                    <div>
                      <div className="font-bold text-slate-900 text-[10px]">LANE 4</div>
                      <div className="text-[8.5px] font-extrabold text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Ready
                      </div>
                    </div>
                    <span className="text-green-600 font-extrabold text-xs">4 / 8</span>
                  </div>

                  <div className="wh-lane-item flex justify-between items-center py-1">
                    <div>
                      <div className="font-bold text-slate-900 text-[10px]">LANE 5</div>
                      <div className="text-[8.5px] font-extrabold text-red-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> Full
                      </div>
                    </div>
                    <span className="text-red-600 font-extrabold text-xs">8 / 8</span>
                  </div>

                  <div className="wh-lane-item flex justify-between items-center py-1">
                    <div>
                      <div className="font-bold text-slate-900 text-[10px]">LANE 6</div>
                      <div className="text-[8.5px] font-bold text-slate-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" /> Empty
                      </div>
                    </div>
                    <span className="text-slate-400 font-bold text-xs">0 / 8</span>
                  </div>
                </div>

              </div>

              {/* BOTTOM FACILITY CARDS */}
              <div className="wh-map-bot-grid">
                <div className="wh-fac-card" onClick={() => handleLocationClick('Hazmat Storage', 'Dangerous Goods', '8 Items')}>
                  <AlertTriangle size={16} className="text-red-500" />
                  <div>
                    <div className="text-[9.5px] font-extrabold text-slate-500 uppercase">HAZMAT STORAGE</div>
                    <div className="text-xs font-black text-slate-900">8 Items</div>
                  </div>
                </div>

                <div className="wh-fac-card" onClick={() => handleLocationClick('Value Storage', 'Secure Hold', '6 Items')}>
                  <Lock size={16} className="text-amber-500" />
                  <div>
                    <div className="text-[9.5px] font-extrabold text-slate-500 uppercase">VALUE STORAGE</div>
                    <div className="text-xs font-black text-slate-900">6 Items</div>
                  </div>
                </div>

                <div className="wh-fac-card" onClick={() => handleLocationClick('Workshop', 'Maintenance', '1 In Progress')}>
                  <Wrench size={16} className="text-teal-500" />
                  <div>
                    <div className="text-[9.5px] font-extrabold text-slate-500 uppercase">WORKSHOP</div>
                    <div className="text-xs font-black text-slate-900">1 In Progress</div>
                  </div>
                </div>

                <div className="wh-fac-card" onClick={() => handleLocationClick('Office', 'Administration', '3 Staff')}>
                  <Users size={16} className="text-slate-500" />
                  <div>
                    <div className="text-[9.5px] font-extrabold text-slate-500 uppercase">OFFICE</div>
                    <div className="text-xs font-black text-slate-900">3 Staff</div>
                  </div>
                </div>
              </div>

              {/* YARD BOTTOM CANVAS */}
              <div className="wh-yard-canvas-sec" style={{ position: 'relative', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '14px', padding: '16px' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#FFFFFF', padding: '0 12px', fontSize: '10px', fontWeight: '900', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  YARD
                </div>

                <div className="wh-yard-storage-grid">
                  {/* CARD 1: VEHICLE STORAGE */}
                  <div className="wh-yard-park-box" onClick={() => handleLocationClick('Vehicle Storage', 'Yard Parking', '34 Vehicles')} style={{ border: '1px solid #BFDBFE', background: '#FFFFFF' }}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        <Truck size={14} className="text-blue-600" />
                        <span className="text-[10px] font-extrabold text-blue-700 uppercase">VEHICLE STORAGE</span>
                      </div>
                    </div>
                    <div className="text-xs font-black text-slate-900 mb-2">34 <span className="text-[9px] text-slate-500 font-normal">Vehicles</span></div>
                    {/* 3x8 Car Slots Grid */}
                    <div className="grid grid-cols-8 gap-1">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="h-4 rounded border border-blue-200 bg-blue-50 flex items-center justify-center text-[9px] text-blue-600">
                          🚘
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CARD 2: CONTAINER YARD */}
                  <div className="wh-yard-park-box" onClick={() => handleLocationClick('Container Yard', 'Yard Stacking', '18 Containers')} style={{ border: '1px solid #FDE68A', background: '#FFFFFF' }}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        <Box size={14} className="text-amber-600" />
                        <span className="text-[10px] font-extrabold text-amber-700 uppercase">CONTAINER YARD</span>
                      </div>
                    </div>
                    <div className="text-xs font-black text-slate-900 mb-2">18 <span className="text-[9px] text-slate-500 font-normal">Containers</span></div>
                    {/* 2x5 Container Grid */}
                    <div className="grid grid-cols-5 gap-1.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`h-6 rounded border flex flex-col justify-center px-1 ${i < 6 ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                          <div className="h-0.5 bg-current w-full my-0.5 opacity-40" />
                          <div className="h-0.5 bg-current w-full my-0.5 opacity-40" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CARD 3: EQUIPMENT PARKING */}
                  <div className="wh-yard-park-box" onClick={() => handleLocationClick('Equipment Parking', 'Yard Staging', '7 Equipment')} style={{ border: '1px solid #E9D5FF', background: '#FFFFFF' }}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        <Wrench size={14} className="text-purple-600" />
                        <span className="text-[10px] font-extrabold text-purple-700 uppercase">EQUIPMENT PARKING</span>
                      </div>
                    </div>
                    <div className="text-xs font-black text-slate-900 mb-2">7 <span className="text-[9px] text-slate-500 font-normal">Equipment</span></div>
                    {/* 2x5 Equipment Grid */}
                    <div className="grid grid-cols-5 gap-1.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`h-6 rounded border flex items-center justify-center text-[11px] ${i < 7 ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                          🚜
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CARD 4: EMPTY PARK */}
                  <div className="wh-yard-park-box" onClick={() => handleLocationClick('Empty Park', 'Trailer Bay', '12 Trailers')} style={{ border: '1px solid #CBD5E1', background: '#FFFFFF' }}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        <Truck size={14} className="text-slate-600" />
                        <span className="text-[10px] font-extrabold text-slate-700 uppercase">EMPTY PARK</span>
                      </div>
                    </div>
                    <div className="text-xs font-black text-slate-900 mb-2">12 <span className="text-[9px] text-slate-500 font-normal">Trailers</span></div>
                    {/* 2x4 Trailer Bay Grid */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-6 rounded border border-slate-300 bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                          🚚
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ACCESS ROAD & GATE SYSTEM */}
                <div className="wh-gate-lanes-bar" style={{ marginTop: '12px', background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '10px' }}>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 border border-green-300 text-green-700 font-black rounded-md text-[10px] flex items-center gap-1">
                      IN GATE ⬆
                    </span>
                  </div>

                  <div className="flex-1 flex justify-center items-center gap-4 text-slate-400 font-bold text-xs tracking-widest">
                    <span>←</span><span>←</span><span>←</span><span>MAIN ACCESS ROAD</span><span>←</span><span>←</span><span>←</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-100 border border-red-300 text-red-700 font-black rounded-md text-[10px] flex items-center gap-1">
                      OUT GATE ⬇
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* TIP */}
            <div className="wh-map-tip-bar">
              <Info size={14} className="flex-shrink-0 text-blue-600" />
              <span>Click on any location on the map to view more details and items.</span>
            </div>

          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="wh-map-right-col">

          {/* LOCATION SUMMARY */}
          <div className="wh-map-side-card">
            <div className="flex justify-between items-center mb-1">
              <div className="wh-map-side-title" style={{ margin: 0, padding: 0, border: 'none' }}>
                LOCATION SUMMARY
              </div>
              <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">View report</span>
            </div>

            <div className="wh-donut-wrap" style={{ marginTop: 8 }}>
              <div className="wh-donut-chart">
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  {/* Available 60% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#22C55E" strokeWidth="4" strokeDasharray="60 100" />
                  {/* In Use 19% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="19 100" strokeDashoffset="-60" />
                  {/* On Hold 11% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="11 100" strokeDashoffset="-79" />
                  {/* Damaged 5% */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="5 100" strokeDashoffset="-90" />
                </svg>
                <div className="wh-donut-center">
                  <span style={{ fontSize: '13px', fontWeight: 900 }}>186</span>
                  <span style={{ fontSize: '7px', color: '#64748B' }}>Total</span>
                </div>
              </div>

              <div className="wh-legend-list">
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#22C55E' }} />
                  <span>Available <strong>112 (60%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#3B82F6' }} />
                  <span>In Use <strong>36 (19%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#F59E0B' }} />
                  <span>On Hold <strong>20 (11%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#EF4444' }} />
                  <span>Damaged <strong>10 (5%)</strong></span>
                </div>
                <div className="wh-legend-item">
                  <div className="wh-legend-dot" style={{ background: '#94A3B8' }} />
                  <span>Other <strong>8 (5%)</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* YARD SUMMARY */}
          <div className="wh-map-side-card">
            <div className="flex justify-between items-center mb-1">
              <div className="wh-map-side-title" style={{ margin: 0, padding: 0, border: 'none' }}>
                YARD SUMMARY
              </div>
              <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">View report</span>
            </div>

            <div style={{ marginTop: 8 }}>
              <div className="wh-ys-row">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span>🚙 Vehicles</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">34</span>
                  <span className="text-[9.5px] text-blue-600 font-bold ml-1.5">12 In Transit</span>
                </div>
              </div>

              <div className="wh-ys-row">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span>📦 Containers</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">18</span>
                  <span className="text-[9.5px] text-blue-600 font-bold ml-1.5">6 In Transit</span>
                </div>
              </div>

              <div className="wh-ys-row">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span>🚚 Trailers</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">12</span>
                  <span className="text-[9.5px] text-blue-600 font-bold ml-1.5">4 In Use</span>
                </div>
              </div>

              <div className="wh-ys-row">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span>🚜 Equipment</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-900">7</span>
                  <span className="text-[9.5px] text-blue-600 font-bold ml-1.5">2 In Use</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAP LEGEND */}
          <div className="wh-map-side-card">
            <div className="wh-map-side-title">MAP LEGEND</div>

            <div className="wh-leg-grid">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>In Use</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Staging</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span>On Hold</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Full</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>Empty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Maintenance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span>Restricted</span>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="wh-map-side-card">
            <div className="wh-map-side-title">QUICK ACTIONS</div>

            <div className="wh-qa-circle-grid">
              <button className="wh-qa-circle-btn" onClick={() => navigate('/warehouse/receive-inbound')}>
                <Box size={16} className="text-amber-500" />
                <span>Receive Stock</span>
              </button>

              <button className="wh-qa-circle-btn" onClick={() => navigate('/warehouse/move-transfer')}>
                <ArrowRight size={16} className="text-blue-500" />
                <span>Move / Transfer</span>
              </button>

              <button className="wh-qa-circle-btn" onClick={() => navigate('/warehouse/load-lanes')}>
                <Plus size={16} className="text-green-500" />
                <span>Create Lane</span>
              </button>

              <button className="wh-qa-circle-btn" onClick={() => navigate('/warehouse/find-stock')}>
                <Search size={16} className="text-purple-500" />
                <span>Find Stock</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* LOCATION DETAILS MODAL */}
      {selectedLocation && (
        <div className="wh-modal-overlay" onClick={() => setSelectedLocation(null)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900">{selectedLocation.name} Details</h3>
              <button onClick={() => setSelectedLocation(null)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="p-4 flex flex-col gap-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Classification:</span>
                <span className="font-bold text-slate-900">{selectedLocation.type}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-amber-600">{selectedLocation.details}</span>
              </div>
              <p className="text-slate-600 font-semibold">
                Real-time sensor & barcode scan tracking enabled for this zone.
              </p>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-600" onClick={() => setSelectedLocation(null)}>Close</button>
                <button className="px-4 py-1.5 bg-amber-400 rounded text-xs font-extrabold text-slate-900" onClick={() => { setSelectedLocation(null); navigate('/warehouse/find-stock'); }}>Inspect Items</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEGENDS MODAL */}
      {legendsModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setLegendsModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900">Map Legend Guide</h3>
              <button onClick={() => setLegendsModalOpen(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="p-4 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span>Green - Available / Ready Spot</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span>Blue - In Use / Occupied Slot</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span>Amber - Staging / In Progress</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span>Red - Full / Unavailable Zone</span></div>
            </div>
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
