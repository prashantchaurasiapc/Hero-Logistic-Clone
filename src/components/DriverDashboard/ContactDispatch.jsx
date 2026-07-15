import React, { useState } from 'react';
import { Shield, Truck, AlertTriangle, Heart, X, Phone, MessageSquare, Mic, Compass, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export default function ContactDispatch() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isOnline, setIsOnline] = useState(true);
  const [activeSosAlert, setActiveSosAlert] = useState(null);

  // Form states
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'DISPATCHER', time: '10:30 AM', text: 'John, please confirm trailer change at Chicago Gate 4. LD-9411 is scheduled for immediate departure.' },
    { id: 2, sender: 'YOU', time: '10:32 AM', text: 'Copy that, logs updated and trailer verified. Rolling out now.', read: true }
  ]);

  // SOS states
  const [shareGps, setShareGps] = useState(true);
  const [autoNotify, setAutoNotify] = useState(true);

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'YOU',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText,
      read: false
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const handleVoiceNote = () => {
    triggerToast('Voice note uploaded to dispatch.', 'success');
  };

  const handleShareImage = () => {
    triggerToast('Image upload dialog opened.', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen text-left flex flex-col space-y-6 relative pb-28">
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed bottom-24 right-6 z-[120] px-4 py-3 rounded-xl text-sm font-bold shadow-lg flex items-center gap-3 max-w-sm animate-fade-in border ${
          toastType === 'error' 
            ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#334155]' 
            : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
        }`}>
          {toastType === 'error' ? (
            <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" strokeWidth={2.5} />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" strokeWidth={2.5} />
          )}
          <span>{toastMsg}</span>
          <button 
            onClick={() => setToastMsg('')} 
            className={`ml-auto cursor-pointer pl-2 ${toastType === 'error' ? 'text-gray-400 hover:text-gray-600' : 'text-[#059669] hover:text-[#047857]'}`}
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Connection status toggle */}
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="w-full flex justify-between items-center p-3 bg-white border border-gray-150 rounded-2xl shadow-sm">
          <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500 rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            Connection Status:
          </span>
          <button
            onClick={() => {
              setIsOnline(prev => !prev);
              triggerToast(isOnline ? 'Connection switched to Offline Mode.' : 'Connection restored to Online Mode.');
            }}
            className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold border cursor-pointer transition-all ${
              isOnline
                ? 'bg-[#E6F4EA] border-[#CEEAD6] text-[#137333]'
                : 'bg-[#FFFBEB] border-[#000000] border-2 text-[#D97706]'
            }`}
          >
            <span>{isOnline ? 'Online Mode' : 'Offline Mode'}</span>
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[9px] ${isOnline ? 'bg-emerald-500' : 'bg-[#D97706]'}`}>
              {isOnline ? '🌐' : '−'}
            </span>
          </button>
        </div>

        {/* Offline Banner */}
        {!isOnline && (
          <div className="w-full bg-[#FFFBEB] border border-[#FDE047] px-4 py-3 rounded-2xl flex items-center text-[#D97706] text-xs font-bold shadow-sm">
            <AlertTriangle className="w-4 h-4 mr-2 shrink-0" strokeWidth={2.5} />
            <span>Offline Active</span>
            <span className="mx-2 text-[#D97706] opacity-50">|</span>
            <span>0 items queued</span>
          </div>
        )}

        {/* SOS ACTIVE Banner */}
        {activeSosAlert && (
          <div className="w-full bg-[#FEE2E2] border border-[#FCA5A5] px-4 py-2 rounded-2xl flex items-center justify-between text-[#EF4444] text-xs font-bold shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" strokeWidth={2.5} />
              <span>🚨 SOS ACTIVE: {activeSosAlert}</span>
            </div>
            <button
              onClick={() => setActiveSosAlert(null)}
              className="bg-[#EF4444] text-black font-extrabold px-3 py-1 rounded-full text-xs hover:bg-red-650 cursor-pointer shadow-sm"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="w-full space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 flex justify-between items-center shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight leading-none">Driver Portal</h1>
              <span className="text-xl font-bold text-[#0F172A]">•</span>
              <span className="text-2xl font-black text-[#0F172A]">chat</span>
            </div>
            <p className="text-[#64748B] text-sm font-medium mt-1">ELD &amp; logistics operations controls.</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#FFFBEB] flex items-center justify-center text-[#D97706] shrink-0">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-[70vh] min-h-[500px]">
          <div className="mb-6">
            <h2 className="text-xl font-black text-[#0F172A] leading-tight">Dispatch Communication Chat</h2>
            <p className="text-sm font-medium text-[#64748B] mt-1">Live chat thread connected directly to dispatch team.</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar flex flex-col pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`w-full max-w-[85%] sm:max-w-md ${msg.sender === 'YOU' ? 'self-end' : 'self-start'}`}>
                {msg.sender === 'YOU' ? (
                  <div className="bg-[#FFD400] rounded-2xl rounded-tr-sm p-4 shadow-sm relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-black uppercase tracking-widest">YOU</span>
                      <span className="text-[10px] font-bold text-black/80">{msg.time}</span>
                    </div>
                    <p className="text-sm font-bold text-black leading-relaxed pb-3">
                      {msg.text}
                    </p>
                    <div className="absolute bottom-2 right-3 text-[10px] font-black text-black/80">
                      {msg.read ? 'Read ✓✓' : 'Sent ✓'}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{msg.sender}</span>
                      <span className="text-[10px] font-bold text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="pt-4 border-t border-gray-100 mt-2 space-y-4">
            <div className="flex gap-3 items-center">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type dispatch update..." 
                className="flex-1 bg-white border border-gray-300 text-gray-900 text-sm font-medium rounded-2xl focus:ring-2 focus:ring-[#FFD400] focus:border-transparent block w-full p-3.5 outline-none"
              />
              <button 
                onClick={handleSend}
                className="bg-[#FFD400] hover:bg-yellow-400 text-black font-black py-3.5 px-6 rounded-2xl transition-colors shrink-0"
              >
                Send
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={handleShareImage}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> Share Image
              </button>
              <button 
                onClick={handleVoiceNote}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-medium transition-colors"
              >
                <Mic className="w-4 h-4" /> Voice Note
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-[100]">
        <button
          onClick={() => setSosModalOpen(true)}
          className="w-12 h-12 bg-white border-2 border-red-200 hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold text-xs shadow-lg cursor-pointer transition-all"
        >
          SOS
        </button>
        <button
          onClick={() => setHotlineOpen(true)}
          className="w-12 h-12 bg-[#FFD400] hover:bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      {/* SOS EMERGENCY PANEL MODAL */}
      {sosModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-xl text-left">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-50">
              <h2 className="text-base font-bold text-gray-900">Emergency Dispatch SOS Panel</h2>
              <button onClick={() => setSosModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"><X size={18} /></button>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Triggering an emergency alerts the dispatch operations center immediately and logs active tracking.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Shield className="w-5 h-5 text-red-500" />, label: 'Panic Button', color: 'bg-red-50/70 border-red-100 text-red-500', msg: 'Panic Alert dispatched!' },
                { icon: <Truck className="w-5 h-5 text-amber-500" />, label: 'Breakdown', color: 'bg-[#FFFBEB] border-amber-200 text-[#D97706]', msg: 'Breakdown Alert dispatched!' },
                { icon: <AlertTriangle className="w-5 h-5 text-red-500" />, label: 'Accident', color: 'bg-red-50/70 border-red-100 text-red-500', msg: 'Accident Alert dispatched!' },
                { icon: <Heart className="w-5 h-5 text-red-500" />, label: 'Medical', color: 'bg-red-50/70 border-red-100 text-red-500', msg: 'Medical Emergency Alert dispatched!' },
              ].map(({ icon, label, color, msg }) => (
                <button
                  key={label}
                  onClick={() => {
                    setActiveSosAlert(msg);
                    triggerToast(`SOS ACTIVE: ${msg}`);
                    setSosModalOpen(false);
                  }}
                  className={`p-5 border rounded-2xl hover:opacity-90 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer ${color}`}
                >
                  {icon}
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-50 space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-800">
                <span>Share Live GPS Tracking</span>
                <input type="checkbox" checked={shareGps} onChange={e => setShareGps(e.target.checked)} className="rounded border-gray-300 text-blue-600 w-4 h-4 cursor-pointer" />
              </div>
              <div className="flex justify-between items-center text-xs text-gray-800">
                <span>Auto-Notify Dispatch Center</span>
                <input type="checkbox" checked={autoNotify} onChange={e => setAutoNotify(e.target.checked)} className="rounded border-gray-300 text-blue-600 w-4 h-4 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOTLINE SHORTCUTS PANEL */}
      {hotlineOpen && (
        <div className="fixed inset-0 z-[110]" onClick={() => setHotlineOpen(false)}>
          <div
            className="absolute bottom-6 right-6 flex flex-col items-end gap-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xl w-52 text-left space-y-3">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pb-2 border-b border-gray-100">HOTLINE SHORTCUTS</span>
              <div className="space-y-3 text-sm text-gray-700">
                {[
                  { icon: <Phone className="w-4 h-4 text-gray-400 shrink-0" />, label: 'Call Dispatch', msg: 'Dialing dispatcher hotline...' },
                  { icon: <MessageSquare className="w-4 h-4 text-gray-400 shrink-0" />, label: 'Message Dispatch', msg: 'Opening dispatch message console...' },
                  { icon: <Mic className="w-4 h-4 text-gray-400 shrink-0" />, label: 'Voice Note', msg: 'Voice note recorder active.' },
                  { icon: <span className="w-4 h-4 text-gray-400 shrink-0 flex items-center justify-center text-xs">🎙</span>, label: 'Voice-to-Text', msg: 'Speech to text active.' },
                ].map(({ icon, label, msg }) => (
                  <button
                    key={label}
                    onClick={() => { triggerToast(msg); setHotlineOpen(false); }}
                    className="w-full text-left hover:text-black transition-colors flex items-center gap-3"
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setHotlineOpen(false)}
              className="w-12 h-12 bg-[#FFD400] hover:bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all shrink-0"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
