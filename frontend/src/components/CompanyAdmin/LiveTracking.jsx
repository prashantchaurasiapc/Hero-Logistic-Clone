import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, Sliders, RefreshCw, Truck, Shield, Activity,
  ChevronRight, MapPin, TrendingUp, AlertCircle, Zap, Navigation,
  User, Clock, Thermometer, Battery, Loader2, WifiOff, X, CheckCircle2
} from 'lucide-react';
import L from 'leaflet';
import api from '../../services/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Map a VehicleStatus enum value → display label, badge CSS, dot CSS, marker hex
 */
function getStatusMeta(status, hasAlert) {
  if (hasAlert)
    return {
      label: 'ALERT',
      badge: 'bg-rose-100 text-rose-700 border border-rose-200',
      dot: 'bg-rose-500',
      color: '#ef4444',
      iconColor: '#ffffff',
      bgRgba: '#ef4444'
    };

  switch (status) {
    case 'IN_TRANSIT':
      return {
        label: 'IN TRANSIT',
        badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        dot: 'bg-emerald-500',
        color: '#10b981',
        iconColor: '#10b981',
        bgRgba: 'rgba(16, 185, 129, 0.12)'
      };
    case 'MAINTENANCE':
      return {
        label: 'MAINTENANCE',
        badge: 'bg-orange-50 text-orange-700 border border-orange-100',
        dot: 'bg-orange-500',
        color: '#f97316',
        iconColor: '#f97316',
        bgRgba: 'rgba(249, 115, 22, 0.12)'
      };
    case 'ALERT':
      return {
        label: 'ALERT',
        badge: 'bg-rose-100 text-rose-700 border border-rose-200',
        dot: 'bg-rose-500',
        color: '#ef4444',
        iconColor: '#ffffff',
        bgRgba: '#ef4444'
      };
    case 'IDLE':
    default:
      return {
        label: 'IDLE',
        badge: 'bg-slate-100 text-slate-600 border border-slate-200',
        dot: 'bg-slate-400',
        color: '#94a3b8',
        iconColor: '#94a3b8',
        bgRgba: 'rgba(148, 163, 184, 0.12)'
      };
  }
}

function buildMarkerHtml(meta, vehicleCode, isSelected) {
  const color = isSelected ? '#facc15' : meta.color;
  const iconColor = isSelected ? '#facc15' : meta.iconColor;
  const bgColor = isSelected ? 'rgba(250,204,21,0.15)' : meta.bgRgba;
  const border = isSelected ? '2.5px solid #facc15' : `2px solid ${meta.color}`;
  const glowOpacity = isSelected ? 0.7 : 0.35;
  const labelBg = isSelected ? '#facc15' : 'rgba(15,23,42,0.95)';
  const labelBorder = isSelected ? '#facc15' : 'rgba(51,65,85,0.7)';
  const labelColor = isSelected ? '#000000' : '#ffffff';

  return `
    <div style="position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;width:80px;height:80px;">
      <div style="position:absolute;top:10px;left:10px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,${color} 0%,rgba(0,0,0,0) 70%);opacity:${glowOpacity};pointer-events:none;"></div>
      <div style="position:relative;z-index:10;width:36px;height:36px;background:${bgColor};border:${border};border-radius:11px;display:flex;align-items:center;justify-content:center;color:${iconColor};box-shadow:0 0 12px ${isSelected ? '#facc15' : 'rgba(0,0,0,0.5)'};cursor:pointer;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      </div>
      <div style="position:relative;z-index:10;margin-top:5px;background:${labelBg};border:1.5px solid ${labelBorder};border-radius:6px;padding:2px 6px;box-shadow:0 2px 5px rgba(0,0,0,0.6);pointer-events:none;">
        <span style="font-family:sans-serif;font-size:8.5px;font-weight:800;color:${labelColor};letter-spacing:0.5px;display:block;line-height:1;">${vehicleCode}</span>
      </div>
    </div>
  `;
}

function getDriverName(driver) {
  if (!driver) return '—';
  const first = driver.firstName || '';
  const last = driver.lastName || '';
  return (first + ' ' + last).trim().toUpperCase() || driver.driverCode || '—';
}

// Filter statuses for the sidebar filter pills
const FILTER_OPTIONS = ['ALL', 'IN_TRANSIT', 'IDLE', 'MAINTENANCE', 'ALERT'];
const FILTER_LABELS  = { ALL: 'ALL', IN_TRANSIT: 'IN TRANSIT', IDLE: 'IDLE', MAINTENANCE: 'MAINTENANCE', ALERT: 'ALERT' };

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LiveTracking() {
  const [vehicles, setVehicles]           = useState([]);
  const [stats, setStats]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const [searchQuery, setSearchQuery]     = useState('');
  const [activeFilter, setActiveFilter]   = useState('ALL');
  const [selectedId, setSelectedId]       = useState(null);

  const [updatingId, setUpdatingId]       = useState(null);
  const [toast, setToast]                 = useState(null);

  const mapContainerRef = useRef(null);
  const mapRef          = useRef(null);
  const markersRef      = useRef({});
  const pollingRef      = useRef(null);
  const mapInitRef      = useRef(false);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch live tracking data from backend ─────────────────────────────────
  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);

      const res = await api.get('/company-admin/live-tracking');
      const data = res.data?.data || res.data;

      setStats(data.stats || null);
      setVehicles(data.vehicles || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Live tracking fetch error:', err);
      if (!silent) setError(err.response?.data?.message || 'Failed to load live tracking data.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial load + 15-second polling
  useEffect(() => {
    fetchData();
    pollingRef.current = setInterval(() => fetchData(true), 15000);
    return () => clearInterval(pollingRef.current);
  }, [fetchData]);

  // ── Map initialisation (only once) ───────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapInitRef.current) return;
    mapInitRef.current = true;

    const map = L.map(mapContainerRef.current, {
      center: [-28.0, 134.0],
      zoom: 4,
      zoomControl: false
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB &copy; OpenStreetMap'
    }).addTo(map);

    map.on('click', () => setSelectedId(null));

    return () => {
      map.remove();
      mapRef.current = null;
      mapInitRef.current = false;
    };
  }, []);

  // ── Sync markers on the map whenever vehicles change ────────────────────
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const presentIds = new Set();

    vehicles.forEach(v => {
      if (v.latitude == null || v.longitude == null) return;
      presentIds.add(v.id);

      const meta      = getStatusMeta(v.status, v.status === 'ALERT');
      const code      = v.rego || v.plate || v.driverCode || v.id.slice(0, 6).toUpperCase();
      const isSelected = v.id === selectedId;
      const html      = buildMarkerHtml(meta, code, isSelected);

      const icon = L.divIcon({
        className: 'custom-truck-marker',
        html,
        iconSize: [80, 80],
        iconAnchor: [40, 40]
      });

      if (markersRef.current[v.id]) {
        markersRef.current[v.id].setIcon(icon);
        markersRef.current[v.id].setLatLng([v.latitude, v.longitude]);
      } else {
        const marker = L.marker([v.latitude, v.longitude], { icon }).addTo(map);
        marker.on('click', e => {
          L.DomEvent.stopPropagation(e);
          selectVehicle(v);
        });
        markersRef.current[v.id] = marker;
      }
    });

    // Remove stale markers
    Object.keys(markersRef.current).forEach(id => {
      if (!presentIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
  }, [vehicles, selectedId]);

  // ── Select vehicle → pan map ──────────────────────────────────────────────
  const selectVehicle = (v) => {
    setSelectedId(v.id);
    if (mapRef.current && v.latitude != null && v.longitude != null) {
      mapRef.current.setView([v.latitude, v.longitude], 9, { animate: true });
    }
  };

  // ── Reset map view ────────────────────────────────────────────────────────
  const resetView = () => {
    if (!mapRef.current) return;
    mapRef.current.setView([-28.0, 134.0], 4, { animate: true });
    setSelectedId(null);
  };

  // ── Update vehicle status via API ─────────────────────────────────────────
  const handleUpdateStatus = async (vehicleId, newStatus) => {
    setUpdatingId(vehicleId);
    try {
      await api.put(`/company-admin/live-tracking/vehicles/${vehicleId}/status`, { status: newStatus });
      showToast(`Vehicle status updated to ${newStatus}`, 'success');
      await fetchData(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Computed ──────────────────────────────────────────────────────────────
  const selectedVehicle = vehicles.find(v => v.id === selectedId) || null;

  const filteredVehicles = vehicles.filter(v => {
    const code     = (v.rego || v.plate || '').toLowerCase();
    const driver   = getDriverName(v.currentDriver).toLowerCase();
    const location = (v.currentLocation || '').toLowerCase();
    const q        = searchQuery.toLowerCase();

    const matchSearch = !q || code.includes(q) || driver.includes(q) || location.includes(q);
    const matchFilter =
      activeFilter === 'ALL'         ? true :
      activeFilter === 'IN_TRANSIT'  ? v.status === 'IN_TRANSIT' :
      activeFilter === 'IDLE'        ? v.status === 'IDLE' :
      activeFilter === 'MAINTENANCE' ? v.status === 'MAINTENANCE' :
      activeFilter === 'ALERT'       ? v.status === 'ALERT' : true;

    return matchSearch && matchFilter;
  });

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs font-bold border animate-fadeIn ${
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            : <AlertCircle className="w-4 h-4 text-rose-600" />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Live Tracking</h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Real-time asset telemetry and advanced route monitoring</p>
          {lastRefreshed && (
            <p className="text-[10px] text-slate-300 mt-0.5">
              Last updated: {lastRefreshed.toLocaleTimeString()} · auto-refreshes every 15s
            </p>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              // Map Settings: alert user (could open modal in future)
              showToast('Map settings coming soon!', 'success');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Sliders className="w-4 h-4 text-slate-400" />
            <span>Map Settings</span>
          </button>
          <button
            onClick={() => { resetView(); fetchData(); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#FACC15] hover:bg-yellow-500 rounded-xl text-xs font-bold text-slate-950 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* ── Error banner ──────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-4 flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm text-rose-700">
          <WifiOff className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">Connection Error</p>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
          <button onClick={() => fetchData()} className="ml-auto text-xs font-black underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading && !stats ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm animate-pulse">
              <div className="h-2.5 w-24 bg-slate-200 rounded mb-3" />
              <div className="h-6 w-16 bg-slate-100 rounded" />
            </div>
          ))
        ) : (
          [
            {
              label: 'ACTIVE VEHICLES',
              val: stats ? `${stats.activeVehiclesCount}` : '—',
              icon: <Truck className="w-4 h-4 text-blue-500" />,
              iconBg: 'bg-blue-50'
            },
            {
              label: 'ON-TIME RATE',
              val: stats ? `${stats.onTimeRate}%` : '—',
              icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
              iconBg: 'bg-emerald-50'
            },
            {
              label: 'CRITICAL ALERTS',
              val: stats ? `${stats.criticalAlerts}` : '—',
              icon: <Shield className="w-4 h-4 text-rose-500" />,
              iconBg: 'bg-rose-50'
            },
            {
              label: 'AVG FLEET SPEED',
              val: stats ? `${stats.avgFleetSpeedKmh} km/h` : '—',
              icon: <Zap className="w-4 h-4 text-amber-500" />,
              iconBg: 'bg-amber-50'
            }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-black tracking-wider uppercase">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{stat.val}</p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                {stat.icon}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Main Workspace: Map + Sidebar ─────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-5 min-h-[500px] lg:h-[calc(100vh-265px)]">

        {/* Left: Dark Map Card */}
        <div className="col-span-12 lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl shadow-sm relative overflow-hidden flex flex-col min-h-[360px] sm:min-h-[420px]">

          {/* HUD Label */}
          <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 backdrop-blur-md flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">HERO TELEMETRY</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 leading-none">LIVE CONNECTION</p>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1.5">
            <button
              onClick={() => mapRef.current?.zoomIn()}
              className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-800 text-white flex items-center justify-center text-lg font-bold hover:bg-slate-800 transition-colors shadow-sm focus:outline-none"
            >+</button>
            <button
              onClick={() => mapRef.current?.zoomOut()}
              className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-800 text-white flex items-center justify-center text-lg font-bold hover:bg-slate-800 transition-colors shadow-sm focus:outline-none"
            >-</button>
          </div>

          {/* Vehicles count HUD badge */}
          {!loading && stats && (
            <div className="absolute bottom-4 right-4 z-[999] bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 backdrop-blur-md">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fleet</p>
              <p className="text-sm font-black text-white">{stats.totalVehicles} Vehicles</p>
            </div>
          )}

          {/* Map Target */}
          <div ref={mapContainerRef} className="w-full flex-grow z-10" />

          {/* Loading overlay on map */}
          {loading && (
            <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 text-white">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                <p className="text-xs font-bold text-slate-300">Loading fleet data…</p>
              </div>
            </div>
          )}

          {/* No GPS data info */}
          {!loading && vehicles.length > 0 && vehicles.every(v => v.latitude == null) && (
            <div className="absolute inset-0 z-[999] flex items-center justify-center pointer-events-none">
              <div className="bg-slate-900/90 border border-slate-700 rounded-2xl px-6 py-5 text-center">
                <Navigation className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-300">No GPS coordinates available</p>
                <p className="text-[10px] text-slate-500 mt-1">Vehicles haven't pushed telemetry data yet</p>
              </div>
            </div>
          )}

          {/* Telemetry HUD Overlay when vehicle selected */}
          {selectedVehicle && (() => {
            const meta = getStatusMeta(selectedVehicle.status, selectedVehicle.status === 'ALERT');
            const code = selectedVehicle.rego || selectedVehicle.plate || selectedVehicle.id.slice(0, 8).toUpperCase();
            const driverName = getDriverName(selectedVehicle.currentDriver);

            return (
              <div className="absolute bottom-4 left-4 z-[1000] w-80 bg-[#0f172a]/95 border border-[#334155]/60 rounded-2xl p-4 text-white backdrop-blur-md shadow-2xl flex flex-col gap-3 animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white">{code}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] text-slate-400 font-bold">{driverName}</span>
                    </div>
                    {selectedVehicle.make && (
                      <p className="text-[9px] text-slate-500 mt-0.5">{selectedVehicle.make} {selectedVehicle.model}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      selectedVehicle.status === 'ALERT'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : selectedVehicle.status === 'IN_TRANSIT'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : selectedVehicle.status === 'MAINTENANCE'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}>{meta.label}</span>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'SPEED', val: selectedVehicle.speedKmh != null ? `${selectedVehicle.speedKmh} km/h` : selectedVehicle.currentSpeed != null ? `${selectedVehicle.currentSpeed} km/h` : '—', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
                    { label: 'FUEL', val: selectedVehicle.fuelLevel != null ? `${selectedVehicle.fuelLevel}%` : '—', icon: <Battery className="w-3.5 h-3.5 text-emerald-400" /> },
                    { label: 'ENGINE TEMP', val: selectedVehicle.engineTemp != null ? `${selectedVehicle.engineTemp}°C` : '—', icon: <Thermometer className="w-3.5 h-3.5 text-rose-400" /> },
                    { label: 'LAST PING', val: selectedVehicle.lastPingAt ? new Date(selectedVehicle.lastPingAt).toLocaleTimeString() : selectedVehicle.lastPing ? new Date(selectedVehicle.lastPing).toLocaleTimeString() : '—', icon: <Clock className="w-3.5 h-3.5 text-blue-400" /> }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col">
                      <p className="text-[8px] text-slate-400 font-black tracking-wider uppercase leading-none">{item.label}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {item.icon}
                        <span className="text-xs font-bold text-white leading-none">{item.val}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Location */}
                <div className="bg-slate-950/60 border border-slate-800/80 px-3 py-2 rounded-xl flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-[10px] text-slate-300 truncate">
                    {selectedVehicle.currentLocation || (selectedVehicle.latitude != null ? `${selectedVehicle.latitude.toFixed(4)}, ${selectedVehicle.longitude.toFixed(4)}` : 'Location unknown')}
                  </span>
                </div>

                {/* Status Update Buttons */}
                <div className="flex gap-1.5 flex-wrap">
                  {['IN_TRANSIT', 'IDLE', 'MAINTENANCE'].map(s => (
                    <button
                      key={s}
                      disabled={selectedVehicle.status === s || updatingId === selectedVehicle.id}
                      onClick={() => handleUpdateStatus(selectedVehicle.id, s)}
                      className={`flex-1 min-w-0 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all border ${
                        selectedVehicle.status === s
                          ? 'bg-indigo-600 border-indigo-600 text-white cursor-default'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-400'
                      }`}
                    >
                      {updatingId === selectedVehicle.id ? '…' : FILTER_LABELS[s] || s}
                    </button>
                  ))}
                </div>

                {/* Heading if available */}
                {selectedVehicle.heading && (
                  <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold">
                    <Navigation className="w-3 h-3 text-indigo-400" />
                    Heading: <span className="text-indigo-300">{selectedVehicle.heading}</span>
                    {selectedVehicle.lastEvent && <span className="ml-auto text-slate-600">· {selectedVehicle.lastEvent}</span>}
                  </div>
                )}
              </div>
            );
          })()}

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(4px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
          `}</style>
        </div>

        {/* Right: Fleet Management Sidebar */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">

          {/* Sidebar Header */}
          <div className="p-5 border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">FLEET MANAGEMENT</h3>
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search vehicle, driver, location…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {FILTER_OPTIONS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${
                    activeFilter === f
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {FILTER_LABELS[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle List */}
          <div className="flex-grow overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
            {loading && vehicles.length === 0 ? (
              <div className="p-6 flex flex-col gap-3">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl shrink-0" />
                    <div className="flex-1">
                      <div className="h-2.5 w-20 bg-slate-200 rounded mb-2" />
                      <div className="h-2 w-28 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="p-8 text-center">
                <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-bold">No vehicles found</p>
                <p className="text-[10px] text-slate-300 mt-1">
                  {vehicles.length === 0 ? 'No vehicles registered yet' : 'Try adjusting your search or filter'}
                </p>
              </div>
            ) : (
              filteredVehicles.map(v => {
                const meta = getStatusMeta(v.status, v.status === 'ALERT');
                const code = v.rego || v.plate || v.id.slice(0, 8).toUpperCase();
                const driverName = getDriverName(v.currentDriver);
                const location = v.currentLocation || (v.latitude != null ? `${v.latitude.toFixed(2)}, ${v.longitude.toFixed(2)}` : 'No GPS');

                return (
                  <div
                    key={v.id}
                    onClick={() => selectVehicle(v)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50/50 ${
                      selectedId === v.id ? 'bg-indigo-50/40 border-l-4 border-indigo-600 pl-3.5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        v.status === 'ALERT' ? 'bg-rose-100 text-rose-600' :
                        v.status === 'IN_TRANSIT' ? 'bg-emerald-100 text-emerald-700' :
                        v.status === 'MAINTENANCE' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {v.status === 'ALERT' ? <AlertCircle className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-slate-900">{code}</p>
                          {v.status === 'ALERT' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 truncate">{driverName}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${meta.badge}`}>
                            {meta.label}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-0.5 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{location}</span>
                          </span>
                        </div>
                        {v.speedKmh > 0 && (
                          <p className="text-[9px] text-indigo-500 font-bold mt-1">{v.speedKmh} km/h</p>
                        )}
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform shrink-0 ${
                      selectedId === v.id ? 'text-indigo-500 translate-x-0.5' : ''
                    }`} />
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar Footer when vehicle selected */}
          {selectedVehicle && (() => {
            const meta = getStatusMeta(selectedVehicle.status, selectedVehicle.status === 'ALERT');
            const code = selectedVehicle.rego || selectedVehicle.plate || selectedVehicle.id.slice(0, 8).toUpperCase();

            return (
              <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">TELEMETRY</h5>
                    <h4 className="text-xs font-bold text-slate-800 mt-1 leading-none">{code} Status</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">SPEED</p>
                    <p className="text-xs font-black text-indigo-600 mt-0.5">
                      {selectedVehicle.speedKmh != null ? `${selectedVehicle.speedKmh} km/h` :
                       selectedVehicle.currentSpeed != null ? `${selectedVehicle.currentSpeed} km/h` : '—'}
                    </p>
                  </div>
                </div>
                {selectedVehicle.status === 'ALERT' && (
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[10px] font-bold text-rose-700 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Vehicle requires immediate attention</span>
                  </div>
                )}
                {selectedVehicle.status === 'MAINTENANCE' && (
                  <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg text-[10px] font-bold text-orange-700 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>Under scheduled maintenance</span>
                  </div>
                )}
                {selectedVehicle.make && (
                  <p className="text-[9px] text-slate-400 mt-2 font-medium">
                    {selectedVehicle.make} {selectedVehicle.model} · {selectedVehicle.fuelType || 'Diesel'} · {selectedVehicle.color || ''}
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
