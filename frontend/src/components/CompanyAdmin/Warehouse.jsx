import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  ArrowLeft, Edit, Trash2, ChevronDown, Plus, Download, Upload, Search, Filter, RotateCcw, 
  CheckCircle, Clock, Truck, Box, AlertTriangle, Info, Star, Building, MapPin, 
  Users, Package, FileText, Printer, Check, X, Shield, Eye, MoreHorizontal, MoreVertical,
  Settings, CheckCircle2, ChevronRight, Share2, Layers, RefreshCw
} from 'lucide-react';
import WarehouseInventoryStock from './WarehouseInventoryStock';
import WarehouseStockMovements from './WarehouseStockMovements';
import WarehousePickPackDispatch from './WarehousePickPackDispatch';
import WarehouseLocationsBins from './WarehouseLocationsBins';
import WarehouseStaffEquipment from './WarehouseStaffEquipment';
import WarehouseReportsAnalytics from './WarehouseReportsAnalytics';

// ─── RESPONSIVE STYLES ────────────────────────────────────────────────────────
const styles = `
  .wh-page, .wh-detail-page, .wh-add-page { padding-bottom: 120px !important; }
  .wh-page { background:#F8FAFC; min-height:100vh; padding:16px; font-family:'Inter','Outfit',sans-serif; overflow-x:hidden; box-sizing:border-box; }
  @media(min-width:768px){ .wh-page { padding:24px 32px; } }

  /* Header */
  .wh-header { display:flex; flex-direction:column; gap:12px; margin-bottom:20px; }
  @media(min-width:768px){ .wh-header { flex-direction:row; justify-content:space-between; align-items:flex-start; margin-bottom:24px; } }
  .wh-header-actions { display:flex; gap:8px; flex-wrap:wrap; }

  /* Metric Cards Grid */
  .wh-metrics { display:grid; grid-template-columns:1fr; gap:12px; margin-bottom:20px; }
  @media(min-width:480px){ .wh-metrics { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:640px){ .wh-metrics { grid-template-columns:repeat(3,1fr); } }
  @media(min-width:1024px){ .wh-metrics { grid-template-columns:repeat(6,1fr); gap:12px; margin-bottom:24px; } }
  .wh-metric-card { background:#fff; border:1px solid #E2E8F0; border-radius:12px; padding:10px 12px; display:flex; flex-direction:column; }
  .wh-metric-icon { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .wh-metric-top { display:flex; gap:8px; margin-bottom:6px; }
  .wh-metric-label { font-size:9px; font-weight:800; color:#64748B; letter-spacing:0.2px; text-transform:uppercase; margin-bottom:2px; }
  .wh-metric-value { font-size:17px; font-weight:900; color:#0F172A; line-height:1; }
  .wh-metric-sub { font-size:9.5px; color:#94A3B8; margin-top:2px; }
  .wh-metric-link { margin-top:auto; font-size:10px; font-weight:700; color:#4F46E5; display:flex; align-items:center; gap:3px; cursor:pointer; padding-top:4px; }

  /* Middle Section */
  .wh-middle { display:flex; flex-direction:column; gap:20px; margin-bottom:20px; }
  @media(min-width:1024px){ .wh-middle { display:grid; grid-template-columns:1fr 320px; gap:24px; margin-bottom:24px; } }

  /* Warehouse List Card */
  .wh-list-card { background:#fff; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; }
  .wh-list-filters { padding:12px 16px; display:flex; flex-direction:column; gap:10px; border-bottom:1px solid #F1F5F9; }
  @media(min-width:600px){ .wh-list-filters { flex-direction:row; align-items:center; flex-wrap:nowrap; overflow-x:auto; } }
  .wh-search-box { position:relative; flex:1; min-width:160px; }
  .wh-search-box input { width:100%; padding:9px 12px 9px 36px; border:1px solid #E2E8F0; border-radius:8px; font-size:13px; outline:none; color:#0F172A; box-sizing:border-box; }
  .wh-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); }

  /* Table – shown on all screens with smooth horizontal scroll on mobile */
  .wh-table-wrap { display:block !important; overflow-x:auto; -webkit-overflow-scrolling:touch; width:100%; }
  .wh-table { width:100%; border-collapse:collapse; text-align:left; }
  .wh-table th { padding:14px 16px; font-size:10px; font-weight:800; color:#0F172A; white-space:nowrap; text-transform:capitalize; border-bottom:1px solid #F1F5F9; }
  .wh-table td { padding:14px 16px; font-size:13px; vertical-align:top; border-bottom:1px solid #F8FAFC; }

  /* Card list – hidden */
  .wh-cards-list { display:none !important; }
  .wh-wh-card { padding:16px; border-bottom:1px solid #F1F5F9; }
  .wh-wh-card-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
  .wh-wh-card-body { display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px; }
  .wh-wh-card-label { font-size:10px; color:#94A3B8; font-weight:600; margin-bottom:2px; }
  .wh-wh-card-val { font-weight:700; color:#0F172A; }
  .wh-util-bar { width:100%; height:5px; background:#EEF2FF; border-radius:4px; overflow:hidden; margin-top:3px; }

  /* Right side panels */
  .wh-right-panels { display:flex; flex-direction:column; gap:16px; }
  .wh-panel { background:#fff; border:1px solid #E2E8F0; border-radius:12px; padding:18px 20px; }
  .wh-panel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
  .wh-panel-title { font-size:11px; font-weight:800; color:#0F172A; letter-spacing:0.5px; text-transform:uppercase; margin:0; }
  .wh-panel-link { font-size:11px; font-weight:700; color:#4F46E5; cursor:pointer; }

  /* Bottom Grid */
  .wh-bottom { display:grid; grid-template-columns:1fr; gap:14px; margin-bottom:20px; }
  @media(min-width:480px){ .wh-bottom { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:768px){ .wh-bottom { grid-template-columns:repeat(3,1fr); } }
  @media(min-width:1024px){ .wh-bottom { grid-template-columns:repeat(5,1fr); gap:16px; margin-bottom:24px; } }
  .wh-bottom-card { background:#fff; border:1px solid #E2E8F0; border-radius:12px; padding:14px; }

  /* Developer Notes */
  .wh-devnotes { background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:18px; }
  .wh-devnotes-grid { display:grid; grid-template-columns:1fr; gap:20px; }
  @media(min-width:480px){ .wh-devnotes-grid { grid-template-columns:repeat(2,1fr); } }
  @media(min-width:768px){ .wh-devnotes-grid { grid-template-columns:repeat(3,1fr); } }
  @media(min-width:1200px){ .wh-devnotes-grid { grid-template-columns:repeat(5,1fr); } }

  /* Detail View */
  .wh-detail-page { background:#F8FAFC; min-height:100vh; padding:16px; font-family:'Inter','Outfit',sans-serif; overflow-x:hidden; }
  @media(min-width:768px){ .wh-detail-page { padding:24px 32px; } }
  .wh-detail-header { display:flex; flex-direction:column; gap:12px; margin-bottom:20px; }
  @media(min-width:768px){ .wh-detail-header { flex-direction:row; justify-content:space-between; align-items:flex-start; } }
  .wh-detail-profile { background:#fff; border:1px solid #E2E8F0; border-radius:12px; padding:20px; margin-bottom:20px; }
  .wh-profile-top { display:flex; flex-direction:column; gap:16px; padding-bottom:20px; }
  @media(min-width:768px){ .wh-profile-top { flex-direction:row; gap:24px; } }
  .wh-profile-img { width:100%; max-width:280px; height:160px; border-radius:12px; overflow:hidden; flex-shrink:0; }
  @media(min-width:768px){ .wh-profile-img { width:200px; height:160px; } }
  .wh-profile-info { flex:1; display:flex; flex-direction:column; gap:16px; }
  .wh-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  @media(min-width:600px){ .wh-info-grid { grid-template-columns:repeat(3,1fr); } }
  .wh-detail-bottom { display:grid; grid-template-columns:1fr; gap:20px; margin-bottom:20px; }
  @media(min-width:900px){ .wh-detail-bottom { grid-template-columns:1.6fr 1fr; gap:24px; } }
  .wh-detail-left { background:#fff; border:1px solid #E2E8F0; border-radius:12px; padding:20px; display:flex; flex-direction:column; gap:24px; }
  .wh-detail-right { display:flex; flex-direction:column; gap:16px; }
  .wh-2col { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .wh-overview-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:10px; }
  .wh-overview-card { position:relative; overflow:hidden; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px; display:flex; align-items:center; gap:8px; }
  .wh-services { display:flex; gap:12px; overflow-x:auto; padding-bottom:8px; }
  .wh-service-item { display:flex; flex-direction:column; align-items:center; gap:6px; min-width:52px; }
  .wh-qa-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px 14px; }
  .wh-tabs { display:flex; gap:0; border-top:1px solid #E2E8F0; padding:0 8px; overflow-x:auto; -webkit-overflow-scrolling:touch; }
  .wh-tab { padding:14px 12px; flex-shrink:0; font-size:12px; font-weight:600; color:#64748B; border-bottom:2px solid transparent; cursor:pointer; white-space:nowrap; transition:color .2s; }
  .wh-tab.active { color:#4F46E5; border-bottom-color:#4F46E5; font-weight:800; }

  /* Add Warehouse Form */
  .wh-add-page { background:#F8FAFC; min-height:100vh; font-family:'Inter','Outfit',sans-serif; overflow-x:hidden; }
  .wh-add-header { padding:20px; border-bottom:1px solid #E2E8F0; display:flex; flex-direction:column; gap:12px; }
  @media(min-width:600px){ .wh-add-header { flex-direction:row; justify-content:space-between; align-items:center; padding:24px 32px; } }
  .wh-add-body { max-width:900px; margin:0 auto; padding:20px; display:flex; flex-direction:column; gap:20px; }
  @media(min-width:600px){ .wh-add-body { padding:24px 32px; } }
  .wh-form-section { background:#fff; border:1px solid #E2E8F0; border-radius:14px; padding:20px; }
  .wh-form-grid-2 { display:grid; grid-template-columns:1fr; gap:18px; }
  @media(min-width:480px){ .wh-form-grid-2 { grid-template-columns:1fr 1fr; } }
  .wh-form-grid-3 { display:grid; grid-template-columns:1fr; gap:18px; }
  @media(min-width:600px){ .wh-form-grid-3 { grid-template-columns:1fr 1fr 1fr; } }
  .wh-form-grid-4 { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
  @media(min-width:600px){ .wh-form-grid-4 { grid-template-columns:repeat(4,1fr); } }
  label.wh-label { display:block; font-size:11px; font-weight:800; color:#94A3B8; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px; }
  .wh-input { width:100%; padding:11px 14px; border:1px solid #E2E8F0; border-radius:10px; font-size:13px; color:#334155; box-sizing:border-box; outline:none; font-family:inherit; }
  .wh-input-icon { position:relative; }
  .wh-input-icon .icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#94A3B8; font-size:15px; }
  .wh-input-icon input { padding-left:40px; }
  .wh-sticky-bar { position:sticky; bottom:0; background:#fff; border-top:1px solid #E2E8F0; padding:14px 20px; display:flex; justify-content:space-between; z-index:50; }
  @media(min-width:600px){ .wh-sticky-bar { padding:14px 40px; } }

  /* Edit Modal */
  .wh-modal-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0.4); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:16px; }
  .wh-modal { background:#fff; width:100%; max-width:480px; border-radius:16px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); overflow:hidden; }
  .wh-modal-head { padding:20px 24px; border-bottom:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center; }
  .wh-modal-body { padding:20px 24px; display:flex; flex-direction:column; gap:14px; }
  .wh-modal-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .wh-modal-foot { padding:14px 24px; background:#F8FAFC; border-top:1px solid #E2E8F0; display:flex; justify-content:flex-end; gap:10px; }

  /* Utility */
  .wh-badge { display:inline-block; font-size:10px; font-weight:800; padding:3px 10px; border-radius:6px; }
  .wh-badge-green { background:#F0FDF4; color:#16A34A; }
  .wh-badge-gray { background:#F1F5F9; color:#64748B; }
  .wh-btn { padding:9px 16px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; border:1px solid #E2E8F0; background:#fff; color:#334155; display:flex; align-items:center; gap:6px; white-space:nowrap; }
  .wh-btn-primary { background:#4F46E5; color:#fff; border-color:#4F46E5; }
  .wh-btn-accent { background:#F97316; color:#fff; border:none; }
`;

// ─── ICONS ─────────────────────────────────────────────────────────────────
const BoxIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
);
const CheckCircleIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);
const ClockIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const TruckIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
);
const ExportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
);
const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
);
const AlertTriangleIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const InfoIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
);
const StarIcon = ({ color, fill }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
const CodeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
);
const BuildingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /></svg>
);
const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const CubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
);
const ClipboardCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><polyline points="9 14 11 16 15 11" /></svg>
);
const CircleInfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
);

// ─── DATA ──────────────────────────────────────────────────────────────────
const initialWarehouses = [];

// ─── SMALL REUSABLE COMPONENTS ────────────────────────────────────────────
function DevNotes({ title, cols }) {
  return (
    <div className="wh-devnotes">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CodeIcon /></div>
        <h3 style={{ fontSize: 11, fontWeight: 900, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>DEVELOPER NOTES – {title}</h3>
      </div>
      <div className="wh-devnotes-grid">
        {cols.map((col, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ width: 15, height: 15, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 8, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
              <h4 style={{ fontSize: 9, fontWeight: 800, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>{col.title}</h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#64748B', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {col.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ icon, bg, label, value, sub, linkText, onClick }) {
  return (
    <div className="wh-metric-card">
      <div className="wh-metric-top">
        <div className="wh-metric-icon" style={{ background: bg }}>{icon}</div>
        <div style={{ overflow: 'hidden' }}>
          <div className="wh-metric-label">{label}</div>
          <div className="wh-metric-value">{value}</div>
          <div className="wh-metric-sub">{sub}</div>
        </div>
      </div>
      {linkText && <div className="wh-metric-link" onClick={onClick}>{linkText} <span style={{ fontSize: 14 }}>→</span></div>}
    </div>
  );
}

function AlertItem({ icon, color, title, time, desc }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 10, color: '#94A3B8', whiteSpace: 'nowrap', marginLeft: 8 }}>{time}</div>
        </div>
        <div style={{ fontSize: 11, color: '#64748B' }}>{desc}</div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────
export default function Warehouse() {
  const navigate = useNavigate();
  const [view, setView] = useState('list');
  const [selectedWh, setSelectedWh] = useState(null);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showDetailMoreActions, setShowDetailMoreActions] = useState(false);
  const [whList, setWhList] = useState(initialWarehouses);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [editModal, setEditModal] = useState(null);

  const [kpiStats, setKpiStats] = useState({
    totalWarehouses: 0,
    activeWarehouses: 0,
    totalInventoryValue: '$0.00',
    totalStockItems: 0,
    pendingTasks: 0,
    incomingShipments: 0,
    outgoingShipments: 0
  });

  const [addForm, setAddForm] = useState({
    name: '',
    code: '',
    branch: 'Sydney Main',
    status: 'Active',
    type: 'General',
    totalAreaSqm: '',
    palletCapacity: '',
    loadingDocks: '',
    street: '',
    suburb: '',
    state: '',
    postalCode: '',
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    emergencyContact: '',
    capabilities: [],
    notes: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchWarehousesData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/company-admin/warehouse');
      if (res.data && res.data.success && res.data.data) {
        const { warehouses, stats } = res.data.data;
        if (warehouses) setWhList(warehouses);
        if (stats) setKpiStats(stats);
      }
    } catch (err) {
      console.error('Error fetching warehouses data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehousesData();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const branchOptions = ['All Branches', ...Array.from(new Set(whList.map(w => w.branch).filter(Boolean)))];
  const typeOptions = ['All Types', ...Array.from(new Set(whList.map(w => w.type).filter(Boolean)))];
  const statusOptions = ['All Status', 'Active', 'Inactive', 'Maintenance'];

  const filteredWarehouses = whList.filter(w => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (w.name && w.name.toLowerCase().includes(q)) ||
      (w.code && w.code.toLowerCase().includes(q)) ||
      (w.addr && w.addr.toLowerCase().includes(q)) ||
      (w.branch && w.branch.toLowerCase().includes(q)) ||
      (w.type && w.type.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All Status' || w.status === statusFilter;
    const matchesBranch = branchFilter === 'All Branches' || w.branch === branchFilter;
    const matchesType = typeFilter === 'All Types' || w.type === typeFilter;

    return matchesSearch && matchesStatus && matchesBranch && matchesType;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setBranchFilter('All Branches');
    setTypeFilter('All Types');
  };

  const handleExport = (targetWh) => {
    const w = targetWh || selectedWh || whList[0];
    if (!w) {
      showToast('No warehouse available for export');
      return;
    }
    const csvContent = `data:text/csv;charset=utf-8,Warehouse Name,Code,Branch,Type,Status,Stock Items,Value,Utilisation\n"${w.name}","${w.code}","${w.branch}","${w.type}","${w.status}","${w.stock}","${w.value}","${w.util}%"`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `warehouse_${w.code || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowMoreActions(false);
    setShowDetailMoreActions(false);
    showToast('Export downloaded successfully!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv, .xlsx';
    input.onchange = (e) => {
      if (e.target.files?.length > 0) showToast("File '" + e.target.files[0].name + "' imported successfully!");
    };
    input.click();
    setShowMoreActions(false);
  };

  const handleWhClick = (w) => { setSelectedWh(w); setView('details'); };

  const handleSaveNewWarehouse = async (e) => {
    if (e) e.preventDefault();
    if (!addForm.name.trim()) {
      showToast('Please enter a Warehouse Name');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await api.post('/company-admin/warehouse', addForm);
      if (res.data && res.data.success) {
        const createdWh = res.data.data;
        if (createdWh) {
          setWhList(prev => [createdWh, ...prev.filter(w => w.id !== createdWh.id)]);
        }
        showToast(`Warehouse "${addForm.name}" created & saved to database!`);
        setAddForm({
          name: '', code: '', branch: 'Sydney Main', status: 'Active', type: 'General',
          totalAreaSqm: '', palletCapacity: '', loadingDocks: '',
          street: '', suburb: '', state: '', postalCode: '',
          managerName: '', managerPhone: '', managerEmail: '', emergencyContact: '',
          capabilities: [], notes: ''
        });
        setView('list');
        await fetchWarehousesData();
      } else {
        showToast(res.data?.message || 'Failed to create warehouse');
      }
    } catch (err) {
      console.error('Error saving warehouse:', err);
      showToast('Error saving warehouse to database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEditWarehouse = async () => {
    if (!editModal || !editModal.id) return;
    try {
      setIsSubmitting(true);
      const res = await api.put(`/company-admin/warehouse/${editModal.id}`, editModal);
      if (res.data && res.data.success) {
        showToast(`Warehouse "${editModal.name}" updated!`);
        setEditModal(null);
        await fetchWarehousesData();
      } else {
        showToast(res.data?.message || 'Failed to update warehouse');
      }
    } catch (err) {
      console.error('Error updating warehouse:', err);
      showToast('Error updating warehouse');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWarehouse = async (w) => {
    if (!w || !w.id) return;
    if (window.confirm(`Are you sure you want to delete warehouse "${w.name}"?`)) {
      try {
        const res = await api.delete(`/company-admin/warehouse/${w.id}`);
        if (res.data && res.data.success) {
          showToast(`Warehouse "${w.name}" deleted!`);
          await fetchWarehousesData();
        } else {
          showToast('Failed to delete warehouse');
        }
      } catch (err) {
        console.error('Error deleting warehouse:', err);
        showToast('Error deleting warehouse');
      }
    }
  };

  const renderEditModal = () => {
    if (!editModal) return null;
    return (
      <div className="wh-modal-backdrop" onClick={() => setEditModal(null)}>
        <div className="wh-modal" onClick={e => e.stopPropagation()}>
          <div className="wh-modal-head">
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>Edit Warehouse</h2>
            <button onClick={() => setEditModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 20 }}>&times;</button>
          </div>
          <div className="wh-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Warehouse Name *</label>
              <input type="text" value={editModal.name || ''} onChange={e => setEditModal({ ...editModal, name: e.target.value })} className="wh-input" />
            </div>
            <div className="wh-modal-grid">
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Warehouse Code *</label>
                <input type="text" value={editModal.code || ''} onChange={e => setEditModal({ ...editModal, code: e.target.value })} className="wh-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Status</label>
                <select value={editModal.status || 'Active'} onChange={e => setEditModal({ ...editModal, status: e.target.value })} className="wh-input">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="wh-modal-grid">
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Branch / Region</label>
                <input type="text" value={editModal.branch || ''} onChange={e => setEditModal({ ...editModal, branch: e.target.value })} className="wh-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Warehouse Type</label>
                <select value={editModal.type || 'General'} onChange={e => setEditModal({ ...editModal, type: e.target.value })} className="wh-input">
                  <option value="General">General</option>
                  <option value="Cold Storage">Cold Storage</option>
                  <option value="Distribution Centre">Distribution Centre</option>
                  <option value="Bonded">Bonded</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Address</label>
              <input type="text" value={editModal.addr || ''} onChange={e => setEditModal({ ...editModal, addr: e.target.value })} className="wh-input" />
            </div>
          </div>
          <div className="wh-modal-foot">
            <button onClick={() => setEditModal(null)} className="wh-btn">Cancel</button>
            <button onClick={handleSaveEditWarehouse} disabled={isSubmitting} className="wh-btn wh-btn-primary">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── SUB VIEWS ──────────────────────────────────────────────────────────
  if (view === 'inventory') return <WarehouseInventoryStock wh={selectedWh || whList[0]} onBack={() => setView('details')} />;
  if (view === 'movements') return <WarehouseStockMovements wh={selectedWh || whList[0]} onBack={() => setView('details')} />;
  if (view === 'pickpack') return <WarehousePickPackDispatch wh={selectedWh || whList[0]} onBack={() => setView('details')} />;
  if (view === 'locations') return <WarehouseLocationsBins wh={selectedWh || whList[0]} onBack={() => setView('details')} />;
  if (view === 'staffequipment') return <WarehouseStaffEquipment wh={selectedWh || whList[0]} onBack={() => setView('details')} />;
  if (view === 'reports') return <WarehouseReportsAnalytics wh={selectedWh || whList[0]} onBack={() => setView('details')} />;

  // ── DETAIL VIEW ────────────────────────────────────────────────────────
  if (view === 'details') {
    const wh = selectedWh || whList[0];
    if (!wh) {
      return (
        <div className="wh-detail-page" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#64748B' }}>No warehouse selected.</p>
          <button onClick={() => setView('list')} className="wh-btn wh-btn-primary" style={{ margin: '16px auto 0 auto' }}>Back to List</button>
        </div>
      );
    }
    return (
      <>
        <style>{styles}</style>
        <div className="wh-detail-page">

          {/* Toast Notification */}
          {toastMessage && (
            <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, background: '#0F172A', color: '#fff', padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              {toastMessage}
            </div>
          )}

          {/* Header */}
          <div className="wh-detail-header">
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                <span onClick={() => navigate('/company-admin/command-centre')} style={{ cursor: 'pointer' }} className="hover:text-purple-600">Home</span>
                <span style={{ color: '#CBD5E1' }}>›</span>
                <span onClick={() => setView('list')} style={{ cursor: 'pointer' }} className="hover:text-purple-600">Warehouse</span>
                <span style={{ color: '#CBD5E1' }}>›</span>
                <span style={{ color: '#0F172A', fontWeight: 800 }}>Warehouse Details</span>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 8 }}>
                Warehouse Details
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5' }}><CheckCircle2 size={14} /></span>
              </h1>
              <p style={{ fontSize: 12, color: '#64748B', margin: 0, fontWeight: 500 }}>{wh.name}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={() => setView('list')} className="wh-btn">
                <ArrowLeft size={14} /> Back
              </button>
              <button 
                onClick={() => setEditModal({ ...wh })} 
                className="wh-btn" 
                style={{ borderColor: '#C7D2FE', background: '#EEF2FF', color: '#4F46E5' }}
              >
                <Edit size={14} /> Edit Warehouse
              </button>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowDetailMoreActions(!showDetailMoreActions)} className="wh-btn">
                  More Actions <ChevronDown size={14} />
                </button>
                {showDetailMoreActions && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 210, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 99, padding: 6 }}>
                    <div onClick={() => { setEditModal({ ...wh }); setShowDetailMoreActions(false); }}
                      style={{ padding: '8px 12px', fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}
                      onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <Edit size={14} className="text-purple-600" /> Edit Warehouse
                    </div>
                    <div onClick={() => { handleExport(); setShowDetailMoreActions(false); }}
                      style={{ padding: '8px 12px', fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}
                      onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <Download size={14} className="text-emerald-600" /> Export Details (CSV)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="wh-detail-profile">
            <div className="wh-profile-top">
              <div className="wh-profile-img">
                <img src="/image copy.png" alt="Warehouse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="wh-profile-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>{wh.name}</h2>
                  <span className={`wh-badge ${wh.status === 'Active' ? 'wh-badge-green' : 'wh-badge-gray'}`}>{wh.status}</span>
                </div>
                <div className="wh-info-grid">
                  {[
                    { label: 'Warehouse Code', val: wh.code },
                    { label: 'Type', val: wh.type },
                    { label: 'Branch', val: wh.branch },
                    { label: 'Phone', val: wh.phone || '+61 2 9756 4321' },
                    { label: 'Email', val: wh.email || 'warehouse@hero.com.au' },
                    { label: 'Address', val: wh.addr },
                  ].map((f, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>{f.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', wordBreak: 'break-word' }}>{f.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="wh-tabs">
              {['Overview', 'Locations', 'Inventory and Stock', 'Stock Movements', 'Pick, Pack & Dispatch', 'Staff and Equipment', 'Warehouse Reports'].map((tab, idx) => (
                <div key={idx} onClick={() => {
                  if (tab === 'Locations') setView('locations');
                  if (tab === 'Inventory and Stock') setView('inventory');
                  if (tab === 'Stock Movements') setView('movements');
                  if (tab === 'Pick, Pack & Dispatch') setView('pickpack');
                  if (tab === 'Staff and Equipment') setView('staffequipment');
                  if (tab === 'Warehouse Reports') setView('reports');
                }} className={`wh-tab${idx === 0 ? ' active' : ''}`}>{tab}</div>
              ))}
            </div>
          </div>

          {/* Bottom Layout */}
          <div className="wh-detail-bottom">
            {/* Left */}
            <div className="wh-detail-left">
              <div className="wh-2col">
                <div>
                  <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 14px 0' }}>WAREHOUSE INFORMATION</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 10px' }}>
                    {[
                      { l: 'Warehouse Code', v: wh.code }, { l: 'Total Area', v: `${wh.totalAreaSqm || 5000} m²` },
                      { l: 'Type', v: wh.type }, { l: 'Pallet Capacity', v: (wh.palletCapacity || 15000).toLocaleString() },
                      { l: 'Branch', v: wh.branch }, { l: 'Status', v: wh.status },
                    ].map((f, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 9, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>{f.l}</div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>{f.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 14px 0' }}>CONTACT & SETTINGS</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 10px' }}>
                    {[
                      { l: 'Phone', v: wh.phone || '+61 2 9756 4321' }, { l: 'Email', v: wh.email || 'warehouse@hero.com' },
                      { l: 'Timezone', v: 'AEST' }, { l: 'Auto Tasks', v: 'Enabled' },
                    ].map((f, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 9, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>{f.l}</div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', wordBreak: 'break-all' }}>{f.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 14px 0' }}>SERVICES & CAPABILITIES</h3>
                <div className="wh-services">
                  {[
                    { name: 'Receiving', on: true }, { name: 'Storage', on: true }, { name: 'Picking', on: true },
                    { name: 'Packing', on: true }, { name: 'Dispatch', on: true }, { name: 'Returns', on: true },
                    { name: 'Cross Docking', on: true }
                  ].map((item, idx) => (
                    <div key={idx} className="wh-service-item">
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: item.on ? '#EEF2FF' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                        {item.on ? '📦' : '—'}
                      </div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', textAlign: 'center', lineHeight: 1.2 }}>{item.name}</div>
                      <div style={{ fontSize: 9, fontWeight: 800, color: item.on ? '#10B981' : '#EF4444' }}>{item.on ? 'Yes' : 'No'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="wh-detail-right">
              <div className="wh-panel">
                <div className="wh-panel-header">
                  <span className="wh-panel-title">WAREHOUSE OVERVIEW</span>
                  <span className="wh-panel-link" onClick={() => setView('reports')}>View Report →</span>
                </div>
                <div className="wh-overview-grid">
                  {[
                    { label: 'Stock Items', value: wh.stock || '0', color: '#4F46E5', bg: '#EEF2FF' },
                    { label: 'Inventory Value', value: wh.value || '$0.00', color: '#10B981', bg: '#ECFDF5' },
                    { label: 'Utilisation', value: `${wh.util || 0}%`, color: '#3B82F6', bg: '#EFF6FF' }
                  ].map((c, i) => (
                    <div key={i} className="wh-overview-card">
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: c.bg, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 900, color: '#0F172A' }}>{c.value}</div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: '#64748B' }}>{c.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </>
    );
  }

  // ── ADD WAREHOUSE VIEW ───────────────────────────────────────────────────
  if (view === 'add') {
    return (
      <>
        <style>{styles}</style>
        <form onSubmit={handleSaveNewWarehouse} className="wh-add-page">

          {/* Toast Notification */}
          {toastMessage && (
            <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, background: '#0F172A', color: '#fff', padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              {toastMessage}
            </div>
          )}

          <div className="wh-add-header">
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <button type="button" onClick={() => setView('list')} className="wh-btn" style={{ width: 38, height: 38, borderRadius: '50%', padding: 0, justifyContent: 'center' }}>←</button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', margin: 0 }}>Add New Warehouse</h1>
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#10B981', background: '#D1FAE5', padding: '3px 8px', borderRadius: 4 }}>NEW</span>
                </div>
                <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0 0', fontWeight: 500 }}>Register a new warehouse facility.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setView('list')} className="wh-btn">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="wh-btn wh-btn-accent">
                {isSubmitting ? 'Saving...' : 'Save Warehouse →'}
              </button>
            </div>
          </div>

          <div className="wh-add-body">
            {/* 1. Basic Info */}
            <div className="wh-form-section">
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BuildingIcon /></div>
                <div><h2 style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', margin: '0 0 2px 0' }}>1. BASIC INFORMATION</h2><div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Facility Identity and Status</div></div>
              </div>
              <div className="wh-form-grid-2">
                <div>
                  <label className="wh-label">Warehouse Name *</label>
                  <div className="wh-input-icon">
                    <span className="icon">🏢</span>
                    <input
                      name="name"
                      required
                      value={addForm.name}
                      onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                      className="wh-input"
                      placeholder="e.g. Sydney Main Depot"
                    />
                  </div>
                </div>
                <div>
                  <label className="wh-label">Warehouse Code *</label>
                  <div className="wh-input-icon">
                    <span className="icon">📦</span>
                    <input
                      name="code"
                      value={addForm.code}
                      onChange={e => setAddForm({ ...addForm, code: e.target.value })}
                      className="wh-input"
                      placeholder="e.g. SYD-01"
                    />
                  </div>
                </div>
                <div>
                  <label className="wh-label">Branch / Region</label>
                  <input
                    name="branch"
                    value={addForm.branch}
                    onChange={e => setAddForm({ ...addForm, branch: e.target.value })}
                    className="wh-input"
                    placeholder="Sydney Main"
                  />
                </div>
                <div>
                  <label className="wh-label">Status</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setAddForm({ ...addForm, status: 'Active' })}
                      style={{ flex: 1, padding: '10px', borderRadius: 8, border: addForm.status === 'Active' ? 'none' : '1px solid #E2E8F0', background: addForm.status === 'Active' ? '#F97316' : '#fff', color: addForm.status === 'Active' ? '#fff' : '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddForm({ ...addForm, status: 'Maintenance' })}
                      style={{ flex: 1, padding: '10px', borderRadius: 8, border: addForm.status === 'Maintenance' ? 'none' : '1px solid #E2E8F0', background: addForm.status === 'Maintenance' ? '#F97316' : '#fff', color: addForm.status === 'Maintenance' ? '#fff' : '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Maintenance
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Capacity */}
            <div className="wh-form-section">
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CubeIcon /></div>
                <div><h2 style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', margin: '0 0 2px 0' }}>2. CAPACITY & SIZING</h2><div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Physical Dimensions and Limits</div></div>
              </div>
              <div className="wh-form-grid-3">
                <div>
                  <label className="wh-label">Total Area (SQM)</label>
                  <input
                    type="number"
                    value={addForm.totalAreaSqm}
                    onChange={e => setAddForm({ ...addForm, totalAreaSqm: e.target.value })}
                    className="wh-input"
                    placeholder="e.g. 5000"
                  />
                </div>
                <div>
                  <label className="wh-label">Pallet Capacity</label>
                  <input
                    type="number"
                    value={addForm.palletCapacity}
                    onChange={e => setAddForm({ ...addForm, palletCapacity: e.target.value })}
                    className="wh-input"
                    placeholder="e.g. 15000"
                  />
                </div>
                <div>
                  <label className="wh-label">Loading Docks</label>
                  <input
                    type="number"
                    value={addForm.loadingDocks}
                    onChange={e => setAddForm({ ...addForm, loadingDocks: e.target.value })}
                    className="wh-input"
                    placeholder="e.g. 12"
                  />
                </div>
              </div>
            </div>

            {/* 3. Location */}
            <div className="wh-form-section">
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><MapPinIcon /></div>
                <div><h2 style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', margin: '0 0 2px 0' }}>3. LOCATION DETAILS</h2><div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Geographic Address</div></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="wh-label">Street Address</label>
                  <input
                    name="addr"
                    value={addForm.street}
                    onChange={e => setAddForm({ ...addForm, street: e.target.value })}
                    className="wh-input"
                    placeholder="e.g. 123 Logistics Way"
                  />
                </div>
                <div className="wh-form-grid-3">
                  <div>
                    <label className="wh-label">Suburb / City</label>
                    <input
                      value={addForm.suburb}
                      onChange={e => setAddForm({ ...addForm, suburb: e.target.value })}
                      className="wh-input"
                      placeholder="e.g. Wetherill Park"
                    />
                  </div>
                  <div>
                    <label className="wh-label">State</label>
                    <input
                      value={addForm.state}
                      onChange={e => setAddForm({ ...addForm, state: e.target.value })}
                      className="wh-input"
                      placeholder="e.g. NSW"
                    />
                  </div>
                  <div>
                    <label className="wh-label">Postal Code</label>
                    <input
                      value={addForm.postalCode}
                      onChange={e => setAddForm({ ...addForm, postalCode: e.target.value })}
                      className="wh-input"
                      placeholder="e.g. 2164"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Key Contacts */}
            <div className="wh-form-section">
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><UsersIcon /></div>
                <div><h2 style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', margin: '0 0 2px 0' }}>4. KEY CONTACTS</h2><div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Warehouse Management</div></div>
              </div>
              <div className="wh-form-grid-2">
                <div>
                  <label className="wh-label">Manager Name</label>
                  <input
                    value={addForm.managerName}
                    onChange={e => setAddForm({ ...addForm, managerName: e.target.value })}
                    className="wh-input"
                    placeholder="e.g. Sarah Mitchell"
                  />
                </div>
                <div>
                  <label className="wh-label">Manager Phone</label>
                  <input
                    value={addForm.managerPhone}
                    onChange={e => setAddForm({ ...addForm, managerPhone: e.target.value })}
                    className="wh-input"
                    placeholder="0400 000 000"
                  />
                </div>
                <div>
                  <label className="wh-label">Manager Email</label>
                  <input
                    type="email"
                    value={addForm.managerEmail}
                    onChange={e => setAddForm({ ...addForm, managerEmail: e.target.value })}
                    className="wh-input"
                    placeholder="manager@company.com"
                  />
                </div>
                <div>
                  <label className="wh-label">Emergency After-hours</label>
                  <input
                    value={addForm.emergencyContact}
                    onChange={e => setAddForm({ ...addForm, emergencyContact: e.target.value })}
                    className="wh-input"
                    placeholder="Security/Fire contact"
                  />
                </div>
              </div>
            </div>

            {/* 5. Capabilities */}
            <div className="wh-form-section">
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ClipboardCheckIcon /></div>
                <div><h2 style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', margin: '0 0 2px 0' }}>5. OPERATING CAPABILITIES</h2><div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Facility Features</div></div>
              </div>
              <div className="wh-form-grid-4">
                {['Cold Storage', 'Dangerous Goods', 'Cross-Docking', '24/7 Operations'].map((lbl, idx) => (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={addForm.capabilities.includes(lbl)}
                      onChange={e => {
                        if (e.target.checked) {
                          setAddForm({ ...addForm, capabilities: [...addForm.capabilities, lbl] });
                        } else {
                          setAddForm({ ...addForm, capabilities: addForm.capabilities.filter(c => c !== lbl) });
                        }
                      }}
                      style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#4F46E5' }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{lbl}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 6. Notes */}
            <div className="wh-form-section">
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CircleInfoIcon /></div>
                <div><h2 style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', margin: '0 0 2px 0' }}>6. NOTES & COMMENTS</h2><div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Additional Information</div></div>
              </div>
              <textarea
                value={addForm.notes}
                onChange={e => setAddForm({ ...addForm, notes: e.target.value })}
                className="wh-input"
                placeholder="Any specific instructions, hours, or operational notes..."
                style={{ height: 100, resize: 'vertical' }}
              />
            </div>
          </div>

          <div className="wh-sticky-bar">
            <button type="button" onClick={() => setView('list')} className="wh-btn">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="wh-btn wh-btn-accent">
              {isSubmitting ? 'Saving...' : 'Save Warehouse →'}
            </button>
          </div>
        </form>
      </>
    );
  }

  // ── LIST / DASHBOARD VIEW ─────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="wh-page">

        {/* Toast Notification */}
        {toastMessage && (
          <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, background: '#0F172A', color: '#fff', padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            {toastMessage}
          </div>
        )}

        {/* Header */}
        <div className="wh-header">
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <span>Home</span><span style={{ color: '#CBD5E1' }}>›</span><span>Warehouse</span><span style={{ color: '#CBD5E1' }}>›</span><span style={{ color: '#0F172A' }}>Warehouse Dashboard</span>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Warehouse Dashboard / List</h1>
            <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0 0', fontWeight: 500 }}>View all warehouses, stock overview and real-time operational summary.</p>
          </div>
          <div className="wh-header-actions">
            <button onClick={() => setView('add')} className="wh-btn wh-btn-primary">+ Add Warehouse</button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowMoreActions(!showMoreActions)} className="wh-btn">
                More Actions
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {showMoreActions && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 210, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 50, padding: 8 }}>
                  {[
                    { label: 'Export Warehouse List', fn: handleExport },
                    { label: 'Generate Inventory Report', fn: () => { navigate('/warehouse/reports'); setShowMoreActions(false); } },
                    { label: 'Import Bulk Warehouses', fn: handleImport },
                  ].map((item, i) => (
                    <div key={i} onClick={item.fn} style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#334155', cursor: 'pointer', borderRadius: 6 }}
                      onMouseOver={e => e.currentTarget.style.background = '#F1F5F9'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>{item.label}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="wh-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <MetricCard icon={<BoxIcon color="#8B5CF6" />} bg="#F5F3FF" label="TOTAL WAREHOUSES" value={(kpiStats?.totalWarehouses ?? 0).toString()} sub="Active Warehouses" linkText="View all warehouses" onClick={() => {}} />
          <MetricCard icon={<CheckCircleIcon color="#10B981" />} bg="#F0FDF4" label="TOTAL INVENTORY VALUE" value={kpiStats?.totalInventoryValue || '$0.00'} sub="Across all warehouses" linkText="View inventory" onClick={() => navigate(location.pathname.startsWith('/dispatcher') ? '/dispatcher/current-stock' : '/warehouse/current-stock')} />
          <MetricCard icon={<BoxIcon color="#F59E0B" />} bg="#FFFBEB" label="TOTAL STOCK ITEMS" value={(kpiStats?.totalStockItems ?? 0).toLocaleString()} sub="All warehouses" linkText="View stock" onClick={() => navigate(location.pathname.startsWith('/dispatcher') ? '/dispatcher/current-stock' : '/warehouse/current-stock')} />
          <MetricCard icon={<ClockIcon color="#3B82F6" />} bg="#EFF6FF" label="PENDING PICK TASKS" value={(kpiStats?.pendingTasks ?? 0).toString()} sub="Requires attention" linkText="View tasks" onClick={() => navigate(location.pathname.startsWith('/dispatcher') ? '/dispatcher/movements' : '/warehouse/movements')} />
          <MetricCard icon={<TruckIcon color="#8B5CF6" />} bg="#F5F3FF" label="INCOMING SHIPMENTS" value={(kpiStats?.incomingShipments ?? 0).toString()} sub="In transit / Expected" linkText="View shipments" onClick={() => navigate(location.pathname.startsWith('/dispatcher') ? '/dispatcher/inbound' : '/warehouse/inbound')} />
          <MetricCard icon={<TruckIcon color="#EF4444" />} bg="#FEF2F2" label="OUTGOING SHIPMENTS" value={(kpiStats?.outgoingShipments ?? 0).toString()} sub="Scheduled / In progress" linkText="View shipments" onClick={() => navigate(location.pathname.startsWith('/dispatcher') ? '/dispatcher/outbound' : '/warehouse/outbound')} />
        </div>

        {/* Middle Section */}
        <div className="wh-middle">
          {/* Warehouse List */}
          <div className="wh-list-card" id="warehouse-list">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
              <h2 style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>WAREHOUSE LIST ({filteredWarehouses.length})</h2>
            </div>

            {/* Filters */}
            <div className="wh-list-filters">
              <div className="wh-search-box">
                <span className="wh-search-icon"><SearchIcon /></span>
                <input 
                  placeholder="Search warehouses..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap', flexShrink: 0, alignItems: 'center' }}>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#334155', background: '#fff', outline: 'none', cursor: 'pointer' }}
                >
                  {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>

                <select 
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  style={{ padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#334155', background: '#fff', outline: 'none', cursor: 'pointer' }}
                >
                  {branchOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>

                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  style={{ padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#334155', background: '#fff', outline: 'none', cursor: 'pointer' }}
                >
                  {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>

                <button onClick={resetFilters} title="Clear/Reset Filters" className="wh-btn" style={{ padding: '8px 10px' }}><FilterIcon /></button>
                <button onClick={() => handleExport()} className="wh-btn" style={{ padding: '8px 10px' }}><ExportIcon /><span>Export</span></button>
                <button onClick={resetFilters} title="Reset Filters" className="wh-btn" style={{ padding: '8px 10px' }}><RefreshIcon /></button>
              </div>
            </div>

            {/* ── DESKTOP TABLE ── */}
            <div className="wh-table-wrap">
              <table className="wh-table">
                <thead>
                  <tr style={{ background: '#fff', borderBottom: '1px solid #F1F5F9' }}>
                    {['Warehouse Name', 'Code', 'Branch / Location', 'Type', 'Status', 'Stock Items', 'Inventory Value', 'Utilization', 'Action'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredWarehouses.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: 12, fontWeight: 600 }}>
                        No warehouses found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredWarehouses.map((w, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #F8FAFC' }}
                        onMouseOver={e => e.currentTarget.style.background = '#FAFAFA'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ flexShrink: 0 }}><StarIcon fill={w.isStar ? '#4F46E5' : 'none'} color={w.isStar ? '#4F46E5' : '#CBD5E1'} /></div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap' }}>{w.name}</div>
                              <div style={{ fontSize: 10.5, color: '#64748B', whiteSpace: 'nowrap', marginTop: 2 }}>{w.addr}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}><span onClick={() => handleWhClick(w)} style={{ fontSize: 13, fontWeight: 700, color: '#4F46E5', cursor: 'pointer', whiteSpace: 'nowrap' }}>{w.code}</span></td>
                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}><div style={{ fontSize: 12.5, color: '#334155', fontWeight: 600, whiteSpace: 'nowrap' }}>{w.branch}</div></td>
                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}><div style={{ fontSize: 12, color: '#475569', whiteSpace: 'nowrap' }}>{w.type}</div></td>
                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}><span className={`wh-badge ${w.status === 'Active' ? 'wh-badge-green' : 'wh-badge-gray'}`} style={{ whiteSpace: 'nowrap' }}>{w.status}</span></td>
                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}><div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>{w.stock}</div></td>
                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}><div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap' }}>{w.value}</div></td>
                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                            <div style={{ fontSize: 12, color: '#0F172A', fontWeight: 600 }}>{w.util}%</div>
                            <div style={{ width: 50, height: 5, background: '#EEF2FF', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{ width: `${w.util}%`, height: '100%', background: '#4F46E5', borderRadius: 4 }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                            <button 
                              onClick={() => handleWhClick(w)} 
                              title="View Warehouse Details" 
                              style={{ width: 26, height: 26, borderRadius: 6, background: '#EFF6FF', color: '#3B82F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Eye size={13} />
                            </button>
                            <button 
                              onClick={() => setEditModal({ ...w, index: i })} 
                              title="Edit Warehouse" 
                              style={{ width: 26, height: 26, borderRadius: 6, background: '#FEF3C7', color: '#D97706', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Edit size={13} />
                            </button>
                            <button 
                              onClick={() => handleDeleteWarehouse(w)} 
                              title="Delete Warehouse" 
                              style={{ width: 26, height: 26, borderRadius: 6, background: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── MOBILE CARD LIST ── */}
            <div className="wh-cards-list">
              {filteredWarehouses.map((w, i) => (
                <div key={i} className="wh-wh-card">
                  <div className="wh-wh-card-header">
                    <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 0 }}>
                      <div style={{ marginTop: 2, flexShrink: 0 }}><StarIcon fill={w.isStar ? '#4F46E5' : 'none'} color={w.isStar ? '#4F46E5' : '#CBD5E1'} /></div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</div>
                        <div style={{ fontSize: 10, color: '#64748B' }}>{w.addr}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                      <span className={`wh-badge ${w.status === 'Active' ? 'wh-badge-green' : 'wh-badge-gray'}`}>{w.status}</span>
                      <button onClick={() => handleWhClick(w)} className="wh-btn" style={{ padding: '5px 10px', fontSize: 11 }}>View</button>
                    </div>
                  </div>
                  <div className="wh-wh-card-body">
                    <div>
                      <div className="wh-wh-card-label">Code</div>
                      <div className="wh-wh-card-val" style={{ color: '#4F46E5' }}>{w.code}</div>
                    </div>
                    <div>
                      <div className="wh-wh-card-label">Branch</div>
                      <div className="wh-wh-card-val">{w.branch}</div>
                    </div>
                    <div>
                      <div className="wh-wh-card-label">Type</div>
                      <div className="wh-wh-card-val">{w.type}</div>
                    </div>
                    <div>
                      <div className="wh-wh-card-label">Stock Items</div>
                      <div className="wh-wh-card-val">{w.stock}</div>
                    </div>
                    <div>
                      <div className="wh-wh-card-label">Inventory Value</div>
                      <div className="wh-wh-card-val">{w.value}</div>
                    </div>
                    <div>
                      <div className="wh-wh-card-label">Utilization</div>
                      <div className="wh-wh-card-val">{w.util}%</div>
                      <div className="wh-util-bar"><div style={{ width: `${w.util}%`, height: '100%', background: '#4F46E5', borderRadius: 4 }} /></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => handleWhClick(w)} className="wh-btn" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }}>View Details</button>
                    <button onClick={() => setEditModal({ ...w, index: i })} className="wh-btn" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }}>Edit</button>
                    <button onClick={() => { if (window.confirm(`Delete ${w.name}?`)) { const nl = [...whList]; const origIdx = whList.findIndex(item => item.code === w.code); if (origIdx !== -1) nl.splice(origIdx, 1); setWhList(nl); } }}
                      className="wh-btn" style={{ flex: 1, justifyContent: 'center', fontSize: 11, color: '#EF4444', borderColor: '#FCA5A5' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                Showing {filteredWarehouses.length > 0 ? 1 : 0} to {filteredWarehouses.length} of {whList.length} warehouses
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['‹', '1', '›'].map((l, i) => (
                    <button key={i} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === 1 ? '#EEF2FF' : '#fff', border: '1px solid #E2E8F0', borderRadius: 6, cursor: 'pointer', color: i === 1 ? '#4F46E5' : '#64748B', fontWeight: i === 1 ? 700 : 400 }}>{l}</button>
                  ))}
                </div>
                <select style={{ padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 12, color: '#334155', background: '#fff', outline: 'none' }}>
                  <option>10 / page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Side Panels */}
          <div className="wh-right-panels">
            {/* Warehouse Alerts */}
            <div className="wh-panel">
              <div className="wh-panel-header">
                <span className="wh-panel-title">WAREHOUSE ALERTS</span>
                <span className="wh-panel-link" onClick={() => navigate('/warehouse/reports')}>View All →</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {whList.length > 0 ? (
                  <>
                    <AlertItem icon={<AlertTriangleIcon color="#EF4444" />} color="#DC2626" title="Capacity Warning" time="Real-time" desc="Monitor warehouse storage capacity limits" />
                    <AlertItem icon={<InfoIcon color="#4F46E5" />} color="#4F46E5" title="System Status" time="Active" desc="All warehouse integrations operating smoothly" />
                  </>
                ) : (
                  <div style={{ padding: '16px 0', textAlign: 'center', color: '#94A3B8', fontSize: 11, fontWeight: 600 }}>
                    No active warehouse alerts
                  </div>
                )}
              </div>
            </div>

            {/* Warehouse Locations Map */}
            <div className="wh-panel">
              <div className="wh-panel-header">
                <span className="wh-panel-title">WAREHOUSE LOCATIONS ({whList.length})</span>
                <span className="wh-panel-link" onClick={() => setView('locations')}>View All →</span>
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ width: 130, height: 100, background: '#BFDBFE', borderRadius: 8, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', bottom: 4, left: 6, fontSize: 8, fontWeight: 800, color: '#1E3A8A' }}>Google</div>
                  {whList.slice(0, 3).map((w, idx) => (
                    <div key={idx} style={{ position: 'absolute', top: `${30 + idx * 25}%`, left: `${25 + idx * 30}%`, width: 14, height: 14, background: '#4F46E5', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 7, color: '#fff', transform: 'rotate(45deg)', fontWeight: 800 }}>{idx + 1}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center', flex: 1 }}>
                  {whList.length > 0 ? (
                    whList.slice(0, 6).map((w, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>No warehouses registered</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Panels */}
        <div className="wh-bottom">
          {/* Inventory Summary */}
          <div className="wh-bottom-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.2px', textTransform: 'uppercase', margin: 0 }}>INVENTORY SUMMARY</h3>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }} onClick={() => navigate('/warehouse/current-stock')}>View →</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: '#0F172A' }}>{kpiStats.totalStockItems.toLocaleString()}</span>
                  <span style={{ fontSize: 7, color: '#64748B', textAlign: 'center' }}>Total Items</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                {[{ c: '#10B981', t: 'Available', v: kpiStats.totalStockItems.toLocaleString(), p: '100%' }, { c: '#F59E0B', t: 'Reserved', v: '0', p: '0%' }, { c: '#8B5CF6', t: 'In Transit', v: '0', p: '0%' }, { c: '#3B82F6', t: 'On Order', v: '0', p: '0%' }].map(x => (
                  <div key={x.t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: x.c, flexShrink: 0 }} />
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#0F172A', flex: 1 }}>{x.t}</div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A' }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Movements */}
          <div className="wh-bottom-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0, lineHeight: 1.4 }}>STOCK MOVEMENTS<br />(THIS WEEK)</h3>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }} onClick={() => setView('movements')}>View →</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['↓', '#F0FDF4', '#16A34A', 'Stock In', '0 Items'], ['↑', '#FEF2F2', '#DC2626', 'Stock Out', '0 Items'], ['⇄', '#EFF6FF', '#3B82F6', 'Transfers', '0 Items'], ['⚙', '#F5F3FF', '#8B5CF6', 'Adjustments', '0 Items']].map(([icon, bg, color, label, val], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#334155' }}>
                    <span style={{ width: 18, height: 18, borderRadius: 5, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>{icon}</span>{label}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="wh-bottom-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>PENDING TASKS</h3>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }} onClick={() => setView('pickpack')}>View All →</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['📋', 'Pick Tasks', kpiStats.pendingTasks.toString()], ['⬇', 'Put Away Tasks', '0'], ['⇄', 'Stock Transfers', '0'], ['↻', 'Cycle Counts', '0']].map(([icon, label, val], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: '#0F172A' }}>
                    <span style={{ color: '#8B5CF6' }}>{icon}</span>{label}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="wh-bottom-card">
            <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 14px 0' }}>QUICK ACTIONS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['+', 'Add Warehouse', () => setView('add')], ['📦', 'Manage Stock', () => setView('inventory')], ['✓', 'Create Pick Task', () => setView('pickpack')], ['⇄', 'Stock Transfer', () => setView('movements')]].map(([icon, label, fn], i) => (
                <div key={i} onClick={fn} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                  <span style={{ color: '#4F46E5', fontSize: 13 }}>{icon}</span>{label}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="wh-bottom-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>RECENT ACTIVITY</h3>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View All →</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {whList.length > 0 ? (
                whList.slice(0, 4).map((w, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Warehouse registered: {w.name} ({w.code})</div>
                      <div style={{ fontSize: 10, color: '#94A3B8' }}>Status: {w.status}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '12px 0', textAlign: 'center', color: '#94A3B8', fontSize: 11, fontWeight: 600 }}>
                  No recent activity recorded
                </div>
              )}
            </div>
          </div>
        </div>



        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 10, color: '#64748B' }}>All times shown in your local time (AEST)</div>
          <div style={{ fontSize: 10, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}><RefreshIcon /> Data auto-refreshes every 5 minutes</div>
        </div>

        {renderEditModal()}
      </div>
    </>
  );
}
