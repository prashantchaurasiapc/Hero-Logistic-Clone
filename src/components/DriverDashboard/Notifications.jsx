import React, { useState } from 'react';
import { 
  Bell, Shield, Truck, AlertTriangle, Heart, X, Phone, 
  MessageSquare, Mic, Link, Wifi, Check, Trash2, CheckCircle2,
  Filter, Volume2, VolumeX, AlertOctagon, Info, Clock, ArrowRight,
  Sparkles, RefreshCw
} from 'lucide-react';

export default function Notifications() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, DISPATCH, ALERT, SYSTEM
  const [activeSosAlert, setActiveSosAlert] = useState(null);

  // SOS states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'DISPATCH',
      title: 'New Load Assigned (LD-3987)',
      message: 'Melbourne VIC to Sydney NSW assigned. Pickup at 08:00 AM from ABC Car Yard.',
      time: '10 mins ago',
      priority: 'HIGH',
      read: false
    },
    {
      id: 2,
      type: 'ALERT',
      title: 'Pre-Start Checklist Pending',
      message: 'Daily vehicle inspection for TX-ROAD88 needs completion before starting route.',
      time: '25 mins ago',
      priority: 'URGENT',
      read: false
    },
    {
      id: 3,
      type: 'SYSTEM',
      title: 'ELD Logbook Sync Successful',
      message: 'HOS hours and driving log auto-synced with Fleet Command Center.',
      time: '1 hour ago',
      priority: 'NORMAL',
      read: false
    },
    {
      id: 4,
      type: 'ALERT',
      title: 'Severe Weather Warning (Hwy M1)',
      message: 'Heavy rain and reduced visibility reported near Euroa. Maintain safe distance.',
      time: '2 hours ago',
      priority: 'HIGH',
      read: true
    },
    {
      id: 5,
      type: 'DISPATCH',
      title: 'Route Adjustment Update',
      message: 'Detour advised on Hume Hwy due to roadwork. Updated ETA: 02:45 PM.',
      time: '3 hours ago',
      priority: 'NORMAL',
      read: true
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    triggerToast('All notifications marked as read');
  };

  const markRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    triggerToast('Notification marked as read');
  };

  const dismiss = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    triggerToast('Notification dismissed');
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'ALL') return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen text-left flex flex-col space-y-6 relative pb-28 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[120] bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2.5 max-w-sm animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#ffcc00] animate-ping"></span>
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg('')} className="ml-auto text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Notifications & Alerts</h1>
            <span className="bg-[#ffcc00] text-black text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs">
              {unreadCount} Unread
            </span>
          </div>
          <p className="text-slate-500 text-xs font-semibold mt-1">
            Real-time dispatch updates, safety alerts, and ELD system notifications for <strong className="text-slate-800">Noah Williams</strong>
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              setIsOnline(prev => !prev);
              triggerToast(isOnline ? 'Switched to Offline Mode (Logs Cached).' : 'Connection Restored to Online Fleet Server.');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-black border transition-all cursor-pointer flex-1 sm:flex-initial ${
              isOnline
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span>{isOnline ? 'Online Mode' : 'Offline Mode'}</span>
          </button>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              triggerToast(soundEnabled ? 'Audio notification alerts muted' : 'Audio notification alerts enabled');
            }}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 cursor-pointer transition-all"
            title={soundEnabled ? "Mute Alert Sound" : "Enable Alert Sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-slate-800" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* SOS ACTIVE BANNER */}
      {activeSosAlert && (
        <div className="w-full bg-rose-500 text-white border border-rose-600 px-5 py-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md animate-pulse">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 text-white shrink-0" />
            <div>
              <div className="font-black uppercase tracking-wider text-xs">CRITICAL SOS ALERT ACTIVE</div>
              <div className="text-white/90 text-[11px] font-semibold">{activeSosAlert}</div>
            </div>
          </div>
          <button
            onClick={() => setActiveSosAlert(null)}
            className="bg-white text-rose-600 font-extrabold px-3.5 py-1.5 rounded-xl text-xs hover:bg-slate-100 cursor-pointer shadow-xs"
          >
            Cancel SOS
          </button>
        </div>
      )}

      {/* FILTER TABS & CONTROL BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>

          {[
            { id: 'ALL', label: 'All Notifications', count: notifications.length },
            { id: 'DISPATCH', label: 'Dispatch', count: notifications.filter(n => n.type === 'DISPATCH').length },
            { id: 'ALERT', label: 'Safety & Weather', count: notifications.filter(n => n.type === 'ALERT').length },
            { id: 'SYSTEM', label: 'ELD System', count: notifications.filter(n => n.type === 'SYSTEM').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                activeFilter === tab.id ? 'bg-slate-700 text-amber-400' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Mark All Read Button */}
        <button 
          onClick={markAllRead}
          className="text-xs font-black text-slate-800 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto shrink-0"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3.5">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 font-bold text-sm shadow-xs">
            <Bell className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <div>No notifications found for this filter</div>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const isAlert = n.type === 'ALERT';
            const isDispatch = n.type === 'DISPATCH';
            const isUrgent = n.priority === 'URGENT' || n.priority === 'HIGH';

            return (
              <div 
                key={n.id} 
                className={`bg-white border ${
                  n.read 
                    ? 'border-slate-200 opacity-80' 
                    : isAlert 
                      ? 'border-rose-200 bg-rose-50/20' 
                      : 'border-blue-200 bg-blue-50/10'
                } rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Category Icon */}
                  <div className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                    isAlert 
                      ? 'bg-rose-100 text-rose-600' 
                      : isDispatch 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                  }`}>
                    {isAlert ? <AlertTriangle className="w-5 h-5" /> : isDispatch ? <Truck className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                  </div>

                  {/* Content */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        isAlert 
                          ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                          : isDispatch 
                            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {n.type}
                      </span>

                      {isUrgent && (
                        <span className="text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded uppercase">
                          ⚡ {n.priority}
                        </span>
                      )}

                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 ml-auto sm:ml-0">
                        <Clock className="w-3 h-3" /> {n.time}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      {n.title}
                      {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">{n.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-xs py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all flex-1 sm:flex-initial"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => dismiss(n.id)}
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold text-xs py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all flex-1 sm:flex-initial"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-[100]">
        <button
          onClick={() => setSosModalOpen(true)}
          className="w-13 h-13 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center font-black text-xs shadow-2xl cursor-pointer transition-all border-2 border-white transform hover:scale-105 active:scale-95"
          title="Emergency Dispatch SOS"
        >
          SOS
        </button>
        <button
          onClick={() => setHotlineOpen(true)}
          className="w-13 h-13 bg-[#ffcc00] hover:bg-[#e6b800] text-black rounded-full flex items-center justify-center shadow-2xl cursor-pointer transition-all border-2 border-white transform hover:scale-105 active:scale-95"
          title="Dispatch Hotline Shortcuts"
        >
          <MessageSquare className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* SOS EMERGENCY PANEL MODAL */}
      {sosModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-5 sm:p-6 shadow-2xl text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                Emergency Dispatch SOS Panel
              </h2>
              <button onClick={() => setSosModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Triggering an emergency immediately broadcasts your GPS coordinates to the Dispatch Operations Control Center.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Shield className="w-5 h-5 text-rose-600" />, label: 'Panic Button', color: 'bg-rose-50 border-rose-200 text-rose-700', msg: 'Panic Alert dispatched to Operations!' },
                { icon: <Truck className="w-5 h-5 text-amber-600" />, label: 'Breakdown', color: 'bg-amber-50 border-amber-200 text-amber-700', msg: 'Breakdown Alert dispatched to Fleet Support!' },
                { icon: <AlertTriangle className="w-5 h-5 text-rose-600" />, label: 'Accident', color: 'bg-rose-50 border-rose-200 text-rose-700', msg: 'Accident Emergency dispatched!' },
                { icon: <Heart className="w-5 h-5 text-rose-600" />, label: 'Medical Emergency', color: 'bg-rose-50 border-rose-200 text-rose-700', msg: 'Medical Emergency dispatched!' },
              ].map(({ icon, label, color, msg }) => (
                <button
                  key={label}
                  onClick={() => {
                    setActiveSosAlert(msg);
                    triggerToast(`SOS ACTIVE: ${msg}`);
                    setSosModalOpen(false);
                  }}
                  className={`p-4 border rounded-2xl hover:brightness-95 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer font-bold ${color}`}
                >
                  {icon}
                  <span className="text-xs font-black">{label}</span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <label className="flex justify-between items-center text-xs font-bold text-slate-700 cursor-pointer">
                <span>Share Live GPS Location</span>
                <input type="checkbox" checked={shareGps} onChange={e => setShareGps(e.target.checked)} className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer" />
              </label>
              <label className="flex justify-between items-center text-xs font-bold text-slate-700 cursor-pointer">
                <span>Auto-Notify Dispatch Control Center</span>
                <input type="checkbox" checked={autoNotify} onChange={e => setAutoNotify(e.target.checked)} className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* HOTLINE SHORTCUTS PANEL */}
      {hotlineOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-900/30" onClick={() => setHotlineOpen(false)}>
          <div
            className="absolute bottom-6 right-6 flex flex-col items-end gap-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl w-60 text-left space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pb-2 border-b border-slate-100">
                DISPATCH HOTLINE SHORTCUTS
              </span>
              <div className="space-y-3 text-xs font-bold text-slate-700">
                {[
                  { icon: <Phone className="w-4 h-4 text-blue-600 shrink-0" />, label: 'Call Dispatcher Hotline', msg: 'Dialing Dispatch Hotline...' },
                  { icon: <MessageSquare className="w-4 h-4 text-purple-600 shrink-0" />, label: 'Message Dispatch Console', msg: 'Opening Dispatch Chat...' },
                  { icon: <Mic className="w-4 h-4 text-amber-600 shrink-0" />, label: 'Record Voice Note', msg: 'Voice recorder active.' },
                ].map(({ icon, label, msg }) => (
                  <button
                    key={label}
                    onClick={() => { triggerToast(msg); setHotlineOpen(false); }}
                    className="w-full text-left hover:text-slate-900 hover:bg-slate-50 p-2 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setHotlineOpen(false)}
              className="w-13 h-13 bg-[#ffcc00] hover:bg-[#e6b800] text-black rounded-full flex items-center justify-center shadow-2xl cursor-pointer transition-all shrink-0 border-2 border-white"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
