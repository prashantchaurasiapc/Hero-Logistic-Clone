import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle, FiClock, FiPlus, FiUpload, FiRefreshCw,
  FiFilter, FiFileText, FiDollarSign, FiChevronRight,
  FiAlertTriangle, FiArrowLeft, FiCamera, FiCheck, FiX,
  FiBookOpen, FiShield, FiHelpCircle, FiBarChart2, FiLayers,
  FiTruck, FiMapPin, FiCheckSquare, FiSearch, FiCloudOff,
  FiCloud, FiHardDrive, FiSettings, FiTrash2, FiAlertOctagon,
  FiZap, FiSliders, FiPlay, FiPause, FiMoreVertical
} from 'react-icons/fi';

export default function OfflineSyncQueue() {
  const navigate = useNavigate();

  // Tab & Search States
  const [activeTab, setActiveTab] = useState('All Items'); // 'All Items', 'Pending', 'Uploading', 'Queued', 'Failed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All Types');
  const [toastMsg, setToastMsg] = useState('');
  const [tipDismissed, setTipDismissed] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncPaused, setSyncPaused] = useState(false);

  // Modals
  const [syncSettingsModalOpen, setSyncSettingsModalOpen] = useState(false);
  const [storageModalOpen, setStorageModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpTitle, setHelpTitle] = useState('');
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  // Sync Queue Items Data (Matching Screenshot 15.14)
  const [syncItems, setSyncItems] = useState([
    { id: 1, name: 'Pre-Start Check', ref: 'PSC-290525-001', type: 'Safety', status: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200', date: '29 May 2025, 08:45 AM', size: '120 KB', icon: '📋', progress: 0 },
    { id: 2, name: 'Load Photos (3)', ref: 'LP-290525-001', type: 'Photos', status: 'Uploading', color: 'bg-blue-50 text-blue-700 border-blue-200', date: '29 May 2025, 09:02 AM', size: '3.4 MB', icon: '📷', progress: 85 },
    { id: 3, name: 'POD Signature', ref: 'POD-290525-001', type: 'Delivery', status: 'Synced', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', date: '29 May 2025, 09:10 AM', size: '68 KB', icon: '✍️', progress: 100 },
    { id: 4, name: 'Fuel Purchase', ref: 'FUEL-290525-001', type: 'Expense', status: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200', date: '29 May 2025, 09:28 AM', size: '215 KB', icon: '⛽', progress: 0 },
    { id: 5, name: 'Trailer Swap', ref: 'TS-290525-001', type: 'Equipment', status: 'Queued', color: 'bg-purple-50 text-purple-700 border-purple-200', date: '29 May 2025, 09:43 AM', size: '95 KB', icon: '🚛', progress: 0 },
    { id: 6, name: 'Damage Report', ref: 'DMG-290525-001', type: 'Damage', status: 'Failed', color: 'bg-rose-50 text-rose-700 border-rose-200', date: '29 May 2025, 09:55 AM', size: '370 KB', icon: '⚠️', progress: 0, errorMsg: 'Failed to sync. Please check your connection and try again.' },
    { id: 7, name: 'Yard Check-In Photo', ref: 'VCI-290525-001', type: 'Photos', status: 'Uploading', color: 'bg-blue-50 text-blue-700 border-blue-200', date: '29 May 2025, 10:05 AM', size: '1.1 MB', icon: '📷', progress: 50 },
    { id: 8, name: 'Daily Checklist', ref: 'DC-290525-001', type: 'General', status: 'Synced', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', date: '29 May 2025, 10:08 AM', size: '60 KB', icon: '📋', progress: 100 },
  ]);

  // Recent Activity Feed Data
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, name: 'Pre-Start Check', status: 'Synced', color: 'text-emerald-700', date: '29 May, 09:10 AM' },
    { id: 2, name: 'POD Signature', status: 'Synced', color: 'text-emerald-700', date: '29 May, 09:10 AM' },
    { id: 3, name: 'Load Photos (3)', status: 'Uploading', color: 'text-blue-700', date: '29 May, 09:02 AM' },
    { id: 4, name: 'Damage Report', status: 'Failed', color: 'text-rose-700', date: '29 May, 09:55 AM' },
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Sync Controls Handlers
  const handleSyncNow = () => {
    setIsSyncing(true);
    triggerToast('Starting full cloud synchronization...');

    setTimeout(() => {
      setSyncItems(prev => prev.map(item => {
        if (item.status === 'Pending' || item.status === 'Uploading' || item.status === 'Queued') {
          return { ...item, status: 'Synced', progress: 100, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
        }
        return item;
      }));

      setIsSyncing(false);
      triggerToast('🎉 All pending items synchronized successfully with central server!');
    }, 1800);
  };

  const handleRetryFailed = () => {
    setSyncItems(prev => prev.map(item => {
      if (item.status === 'Failed') {
        return { ...item, status: 'Uploading', progress: 65, color: 'bg-blue-50 text-blue-700 border-blue-200', errorMsg: null };
      }
      return item;
    }));

    triggerToast('Retrying failed sync items...');

    setTimeout(() => {
      setSyncItems(prev => prev.map(item => {
        if (item.ref === 'DMG-290525-001') {
          return { ...item, status: 'Synced', progress: 100, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
        }
        return item;
      }));
      triggerToast('Damage Report synced successfully!');
    }, 1500);
  };

  const handleRetrySingle = (id) => {
    setSyncItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Synced', progress: 100, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', errorMsg: null };
      }
      return item;
    }));
    triggerToast('Item retried and synced successfully!');
  };

  const handleClearCompleted = () => {
    const remaining = syncItems.filter(item => item.status !== 'Synced');
    setSyncItems(remaining);
    triggerToast('Cleared all completed/synced items from queue!');
  };

  const handlePauseSync = () => {
    setSyncPaused(!syncPaused);
    triggerToast(syncPaused ? 'Auto-sync resumed' : 'Auto-sync paused');
  };

  const openHelpModal = (title) => {
    setHelpTitle(title);
    setHelpModalOpen(true);
  };

  // Metrics Calculations
  const totalCount = syncItems.length;
  const syncedCount = syncItems.filter(i => i.status === 'Synced').length;
  const pendingCount = syncItems.filter(i => i.status === 'Pending').length;
  const uploadingCount = syncItems.filter(i => i.status === 'Uploading').length;
  const queuedCount = syncItems.filter(i => i.status === 'Queued').length;
  const failedCount = syncItems.filter(i => i.status === 'Failed').length;

  // Filter Items according to active tab, search & type
  const filteredItems = syncItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedTypeFilter === 'All Types' ? true : item.type === selectedTypeFilter;

    let matchesTab = true;
    if (activeTab === 'Pending') matchesTab = item.status === 'Pending';
    if (activeTab === 'Uploading') matchesTab = item.status === 'Uploading';
    if (activeTab === 'Queued') matchesTab = item.status === 'Queued';
    if (activeTab === 'Failed') matchesTab = item.status === 'Failed';

    return matchesSearch && matchesType && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6 pb-24 text-left">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[150] bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border border-slate-700">
          <FiCheckCircle className="text-[#ffcc00] text-base shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER TITLE BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Offline Sync Queue</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">View and manage data captured offline. Items will sync automatically when you're back online.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSyncSettingsModalOpen(true)}
            className="flex-1 sm:flex-initial bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiSettings className="text-indigo-600 text-base" />
            <span>Sync Settings</span>
          </button>
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FiRefreshCw className={`text-base ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* THREE-COLUMN MASTER WEB DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= LEFT COLUMN: MODULE META & INSTRUCTIONS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Module Header Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-indigo-700 tracking-tight">15.14 Offline Sync</span>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Auto Sync
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              View and manage data captured offline. Items will sync automatically when you're back online.
            </p>
          </div>

          {/* LEGEND CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LEGEND</div>
            <div className="space-y-2 font-bold">
              <div className="flex items-center gap-2.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Synced</span>
              </div>
              <div className="flex items-center gap-2.5 text-amber-700">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2.5 text-blue-700">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>Uploading</span>
              </div>
              <div className="flex items-center gap-2.5 text-purple-700">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                <span>Queued</span>
              </div>
              <div className="flex items-center gap-2.5 text-rose-700">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span>Failed</span>
              </div>
            </div>
          </div>

          {/* SYNC STATUS DONUT CHART */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs text-center">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">SYNC STATUS</div>

            <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-2">
              <div className="w-full h-full rounded-full border-8 border-slate-100 border-t-emerald-500 border-r-blue-500 border-b-amber-500 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-900 font-mono">{totalCount}</div>
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase">Total Items</div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-bold border-t border-slate-100 pt-3 text-left">
              <div className="flex justify-between text-emerald-700"><span>Synced</span><span className="font-mono">{syncedCount}</span></div>
              <div className="flex justify-between text-amber-700"><span>Pending</span><span className="font-mono">{pendingCount}</span></div>
              <div className="flex justify-between text-blue-700"><span>Uploading</span><span className="font-mono">{uploadingCount}</span></div>
              <div className="flex justify-between text-purple-700"><span>Queued</span><span className="font-mono">{queuedCount}</span></div>
              <div className="flex justify-between text-rose-700"><span>Failed</span><span className="font-mono">{failedCount}</span></div>
            </div>
          </div>

          {/* KEY ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KEY ACTIONS</div>
            <div className="space-y-2">
              <button onClick={handleSyncNow} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🔄 Sync Now</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={handleRetryFailed} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🔁 Retry Failed</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={handleClearCompleted} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🧹 Clear Completed</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={handlePauseSync} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">⏸️ {syncPaused ? 'Resume Sync' : 'Pause Sync'}</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* STATUS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</div>
            <div className="space-y-1.5 font-bold text-slate-700">
              <div className="flex items-center gap-2 text-emerald-700 font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
              </div>
              <div className="text-[11px] text-slate-500">Last sync: 29 May 2025, 10:15 AM</div>
              <div className="text-[11px] text-slate-500">Auto refresh: Every 5 minutes</div>
            </div>
            <button
              onClick={handleSyncNow}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="text-amber-400" />
              <span>Sync Now</span>
            </button>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN: MAIN OFFLINE QUEUE ENGINE (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* YOU'RE OFFLINE CLOUD BANNER */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shrink-0 font-bold shadow-xs">
                ☁️
              </div>
              <div>
                <h3 className="font-black text-indigo-950 text-sm">You're offline</h3>
                <p className="text-xs text-indigo-800 font-semibold mt-0.5">
                  Data is saved on this device and will sync automatically when you're back online.
                </p>
              </div>
            </div>

            <button
              onClick={() => openHelpModal('How Sync Works')}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-700 font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              How Sync Works
            </button>
          </div>

          {/* QUEUE SUMMARY 6 METRIC PILLS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QUEUE SUMMARY</div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                <span>Last updated: 29 May 2025, 10:15 AM</span>
                <FiRefreshCw className="text-indigo-600 cursor-pointer hover:rotate-180 transition-transform" onClick={handleSyncNow} />
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-bold text-xs">
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <div className="text-[14px] font-black text-slate-900 font-mono">{totalCount}</div>
                <div className="text-[9.5px] text-slate-400 font-extrabold uppercase">Total Items</div>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200">
                <div className="text-[14px] font-black text-emerald-700 font-mono">{syncedCount}</div>
                <div className="text-[9.5px] text-emerald-700 font-extrabold uppercase">Synced</div>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200">
                <div className="text-[14px] font-black text-amber-700 font-mono">{pendingCount}</div>
                <div className="text-[9.5px] text-amber-700 font-extrabold uppercase">Pending</div>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-2xl border border-blue-200">
                <div className="text-[14px] font-black text-blue-700 font-mono">{uploadingCount}</div>
                <div className="text-[9.5px] text-blue-700 font-extrabold uppercase">Uploading</div>
              </div>
              <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-200">
                <div className="text-[14px] font-black text-purple-700 font-mono">{queuedCount}</div>
                <div className="text-[9.5px] text-purple-700 font-extrabold uppercase">Queued</div>
              </div>
              <div className="bg-rose-50 p-2.5 rounded-2xl border border-rose-200">
                <div className="text-[14px] font-black text-rose-700 font-mono">{failedCount}</div>
                <div className="text-[9.5px] text-rose-700 font-extrabold uppercase">Failed</div>
              </div>
            </div>

            {/* SUB NAV TABS */}
            <div className="flex border-b border-slate-200 space-x-6 text-xs font-black pt-3 overflow-x-auto">
              {[
                { name: 'All Items', count: totalCount },
                { name: 'Pending', count: pendingCount },
                { name: 'Uploading', count: uploadingCount },
                { name: 'Queued', count: queuedCount },
                { name: 'Failed', count: failedCount },
              ].map(tab => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`pb-3 transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                    activeTab === tab.name 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH & TYPE FILTER BAR */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search by type, reference, or note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="w-full sm:w-auto">
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
              >
                <option value="All Types">All Types</option>
                <option value="Safety">Safety</option>
                <option value="Photos">Photos</option>
                <option value="Delivery">Delivery</option>
                <option value="Expense">Expense</option>
                <option value="Equipment">Equipment</option>
                <option value="Damage">Damage</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          {/* SYNC ITEMS LIST TABLE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-bold">
                  No sync items found for selected filter.
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors space-y-2">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-base shrink-0">
                          {item.icon}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900">{item.name}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">Ref: {item.ref}</span>
                          </div>
                          <div className="text-[10.5px] text-slate-400 font-bold mt-0.5">
                            Type: <span className="text-slate-700 font-extrabold">{item.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[9.5px] font-black px-2.5 py-0.5 rounded-full border ${item.color}`}>
                          {item.status} {item.status === 'Uploading' ? `${item.progress}%` : ''}
                        </span>

                        <div className="text-right font-mono text-[10.5px]">
                          <div className="font-bold text-slate-700">{item.date}</div>
                          <div className="text-slate-400 text-[10px]">{item.size}</div>
                        </div>

                        <button
                          onClick={() => setSelectedItemDetails(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <FiMoreVertical />
                        </button>
                      </div>

                    </div>

                    {/* INLINE ERROR BANNER FOR FAILED ITEMS */}
                    {item.status === 'Failed' && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between gap-2 text-rose-900 text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <FiAlertTriangle className="text-rose-600 text-sm shrink-0" />
                          <span>{item.errorMsg}</span>
                        </div>
                        <button
                          onClick={() => handleRetrySingle(item.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-black text-[10.5px] px-3 py-1 rounded-lg cursor-pointer"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TIP BANNER */}
          {!tipDismissed && (
            <div className="bg-purple-50 border border-purple-200 rounded-3xl p-4 flex items-center justify-between gap-3 text-purple-950 text-xs font-bold shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-purple-100 text-purple-700 rounded-xl">🛡️</span>
                <div>
                  <span className="font-black text-purple-900">TIP: </span>
                  <span className="text-purple-700 font-medium text-[11px]">
                    Continue using the app while offline. All your data is safe and will sync automatically.
                  </span>
                </div>
              </div>
              <button onClick={() => setTipDismissed(true)} className="text-purple-400 hover:text-purple-700 cursor-pointer p-1">
                <FiX className="text-base" />
              </button>
            </div>
          )}

        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* SYNC CONTROLS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SYNC CONTROLS</div>

            <div className="space-y-2 font-bold text-slate-700 border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center">
                <span>Auto Sync</span>
                <span className="text-emerald-700 font-black">Every 5 minutes 🟢</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sync on Wi-Fi Only</span>
                <span className="font-mono text-slate-400">Off</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Background Sync</span>
                <span className="text-emerald-700 font-black">On</span>
              </div>
            </div>

            <button 
              onClick={() => setSyncSettingsModalOpen(true)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl border border-slate-200 transition-all cursor-pointer text-center mt-2"
            >
              View Sync Settings
            </button>
          </div>

          {/* WORKS OFFLINE INFO BOX */}
          <div className="bg-purple-50 border border-purple-200 rounded-3xl p-5 shadow-xs space-y-2 text-xs text-purple-950">
            <div className="font-black flex items-center gap-2 text-purple-900">
              <FiCloudOff className="text-purple-700 text-base" />
              <span>WORKS OFFLINE</span>
            </div>
            <p className="text-[11px] text-purple-800 font-medium leading-relaxed">
              You can keep working offline. We'll sync your changes automatically when you're back online.
            </p>
          </div>

          {/* STORAGE USAGE CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STORAGE USAGE</div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-black text-slate-900">
                <span>1.2 GB / 5 GB used</span>
                <span className="text-indigo-700 font-mono">24%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-[24%]"></div>
              </div>
            </div>

            <button 
              onClick={() => setStorageModalOpen(true)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl border border-slate-200 transition-all cursor-pointer text-center mt-2"
            >
              Manage Storage
            </button>
          </div>

          {/* RECENT SYNC ACTIVITY CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RECENT SYNC ACTIVITY</div>
              <button onClick={() => triggerToast('Opening sync logs...')} className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer">
                View All
              </button>
            </div>

            <div className="space-y-2">
              {recentActivity.map(act => (
                <div key={act.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="font-black text-slate-900">{act.name}</div>
                    <div className={`text-[10px] font-bold ${act.color}`}>{act.status}</div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{act.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QUICK ACTIONS</div>
            <div className="space-y-2">
              <button onClick={handleSyncNow} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🔄 Sync Now</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={handleRetryFailed} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🔁 Retry Failed Items</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={handleClearCompleted} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🧹 Clear Completed</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={handlePauseSync} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">⏸️ {syncPaused ? 'Resume Auto-Sync' : 'Pause Auto-Sync'}</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* HELP & RESOURCES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HELP & RESOURCES</div>
            <div className="space-y-2 font-semibold text-slate-700">
              <button onClick={() => openHelpModal('How Offline Sync Works')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📖 How Offline Sync Works</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => openHelpModal('Offline Mode Guide')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📱 Offline Mode Guide</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => openHelpModal('Troubleshooting')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">🔧 Troubleshooting</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => openHelpModal('Contact Support')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📞 Contact Support</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* DEVELOPER NOTES AT THE BOTTOM */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs text-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-black tracking-tight">
          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono text-[11px]">&lt;/&gt;</span>
          <span>DEVELOPER NOTES – OFFLINE SYNC QUEUE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-slate-600 border-t border-slate-100 pt-4">
          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">1. PURPOSE</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>Show all offline items waiting to sync.</li>
              <li>Allow drivers to monitor, control and retry sync.</li>
            </ul>
          </div>

          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">2. KEY FEATURES</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>Auto sync summary and status.</li>
              <li>Filter by status and type.</li>
              <li>Manual sync, retry, clear and pause options.</li>
            </ul>
          </div>

          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">3. DATA SOURCES</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>Local database (offline storage).</li>
              <li>Sync service (upload/download).</li>
              <li>Item metadata (type, size, timestamp, status).</li>
            </ul>
          </div>

          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">4. SECURITY & ACCESS</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>Only the assigned driver can view their offline data.</li>
              <li>Data encrypted on device.</li>
              <li>Secure transfer via HTTPS.</li>
            </ul>
          </div>

          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">5. INTEGRATIONS</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>Background sync service.</li>
              <li>Push / In-App notifications.</li>
              <li>Central API for data sync.</li>
              <li>Conflict resolution service.</li>
            </ul>
          </div>

          <div>
            <div className="font-black text-slate-900 uppercase text-[10px] mb-1">6. PERFORMANCE</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] font-semibold">
              <li>Sync queue loads in &lt; 2 seconds.</li>
              <li>Background sync optimized.</li>
              <li>Auto retry interval configurable.</li>
              <li>Handles large files & batching.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SYNC SETTINGS MODAL */}
      {syncSettingsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiSettings className="text-indigo-600 text-lg" />
                Offline Sync Settings & Preferences
              </h3>
              <button onClick={() => setSyncSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span>Auto Sync Frequency</span>
                <select className="bg-white border border-slate-300 rounded-lg p-1 text-slate-900 font-bold">
                  <option>Every 5 minutes</option>
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                </select>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span>Sync on Wi-Fi Only</span>
                <input type="checkbox" className="rounded text-indigo-600 cursor-pointer" />
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span>Background Sync</span>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 cursor-pointer" />
              </div>
            </div>

            <button
              onClick={() => {
                setSyncSettingsModalOpen(false);
                triggerToast('Sync preferences saved!');
              }}
              className="w-full bg-indigo-600 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* STORAGE MANAGEMENT MODAL */}
      {storageModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiHardDrive className="text-indigo-600 text-lg" />
                Local Storage Management
              </h3>
              <button onClick={() => setStorageModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs font-semibold">
              <div className="flex justify-between"><span>Offline Data Storage:</span><span className="font-black text-slate-900">1.2 GB</span></div>
              <div className="flex justify-between"><span>Cached Media & Photos:</span><span className="font-black text-slate-900">850 MB</span></div>
              <div className="flex justify-between"><span>Maximum Limit:</span><span className="font-mono font-black text-slate-900">5.0 GB</span></div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setStorageModalOpen(false);
                  triggerToast('Cached offline data cleared!');
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
              >
                Clear Cache
              </button>
              <button
                onClick={() => setStorageModalOpen(false)}
                className="flex-1 bg-slate-200 text-slate-800 font-black text-xs py-3 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ITEM DETAILS MODAL */}
      {selectedItemDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <span>{selectedItemDetails.icon}</span>
                <span>{selectedItemDetails.name}</span>
              </h3>
              <button onClick={() => setSelectedItemDetails(null)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs font-semibold">
              <div className="flex justify-between"><span>Reference ID:</span><span className="font-mono font-black text-slate-900">{selectedItemDetails.ref}</span></div>
              <div className="flex justify-between"><span>Category Type:</span><span className="font-black text-slate-900">{selectedItemDetails.type}</span></div>
              <div className="flex justify-between"><span>Status:</span><span className={`font-black px-2 py-0.2 rounded-full border ${selectedItemDetails.color}`}>{selectedItemDetails.status}</span></div>
              <div className="flex justify-between"><span>Recorded Date:</span><span className="font-mono text-slate-900">{selectedItemDetails.date}</span></div>
              <div className="flex justify-between"><span>File Payload Size:</span><span className="font-mono text-slate-900">{selectedItemDetails.size}</span></div>
            </div>

            <div className="flex gap-2">
              {selectedItemDetails.status === 'Failed' && (
                <button
                  onClick={() => {
                    handleRetrySingle(selectedItemDetails.id);
                    setSelectedItemDetails(null);
                  }}
                  className="flex-1 bg-indigo-600 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
                >
                  Retry Sync
                </button>
              )}
              <button
                onClick={() => setSelectedItemDetails(null)}
                className="flex-1 bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HELP GUIDE MODAL */}
      {helpModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiBookOpen className="text-indigo-600 text-lg" />
                {helpTitle}
              </h3>
              <button onClick={() => setHelpModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs text-slate-700 leading-relaxed font-semibold">
              <p>Items captured without cellular connectivity are stored locally on your encrypted device database.</p>
              <p>When cellular or Wi-Fi connectivity is restored, the queue automatically syncs payload data in the background.</p>
              <p>If any upload encounters network errors, use "Retry Failed" to attempt background upload again.</p>
            </div>

            <button
              onClick={() => setHelpModalOpen(false)}
              className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
