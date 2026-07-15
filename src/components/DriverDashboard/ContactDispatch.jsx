import React, { useState, useEffect, useRef } from 'react';
import { Compass, FileText, AlertTriangle, X, Phone, MessageSquare, Mic, Wifi, WifiOff, Image, Send, CheckCircle2, Shield, Heart, Truck } from 'lucide-react';

export default function ContactDispatch() {
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [hotlineOpen, setHotlineOpen] = useState(true); // Open by default based on screenshot
  const [toastMsg, setToastMsg] = useState('');
  
  // Connection states matching screenshot
  const [isOffline, setIsOffline] = useState(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  // Chat message input state
  const [inputText, setInputText] = useState('');
  
  // Recording simulation states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimer = useRef(null);

  // Messages list matching screenshot
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'DISPATCHER',
      time: '10:30 AM',
      text: 'John, please confirm trailer change at Chicago Gate 4. LD-9411 is scheduled for immediate departure.',
      isSelf: false
    },
    {
      id: 2,
      sender: 'YOU',
      time: '10:32 AM',
      text: 'Copy that, logs updated and trailer verified. Rolling out now.',
      isSelf: true,
      status: 'Read ✓✓'
    },
    {
      id: 3,
      sender: 'YOU',
      time: '06:15 PM',
      text: 'Cargo Loading Status Image Attached 📸',
      isSelf: true,
      status: 'Read ✓✓',
      attachment: 'Shared attachment'
    }
  ]);

  // Scroll ref
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSendMessage = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: messages.length + 1,
      sender: 'YOU',
      time: currentTime,
      text: textToSend,
      isSelf: true,
      status: isOffline ? 'Sent (Offline)' : 'Read ✓✓'
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    if (isOffline) {
      setOfflineQueueCount(prev => prev + 1);
      triggerToast('Message queued locally. Will send when connection is restored.');
    } else {
      triggerToast('Message sent to dispatch operations.');
      
      // Simulate Dispatcher reply in 2.5 seconds
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            sender: 'DISPATCHER',
            time: replyTime,
            text: `Copy that John, updating status in dispatch console. Logged at ${replyTime}.`,
            isSelf: false
          }
        ]);
        triggerToast('New message from dispatcher received.');
      }, 2500);
    }
  };

  const handleShareImage = () => {
    // Automatically attach a mock photo
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: messages.length + 1,
      sender: 'YOU',
      time: currentTime,
      text: 'Odometer & Trip document shared 📸',
      isSelf: true,
      status: isOffline ? 'Sent (Offline)' : 'Read ✓✓',
      attachment: 'Shared attachment: odometer.jpg'
    };

    setMessages(prev => [...prev, newMsg]);
    triggerToast('Odometer and document shared with dispatcher.');
    if (isOffline) {
      setOfflineQueueCount(prev => prev + 1);
    }
  };

  const handleToggleVoiceNote = () => {
    if (isRecording) {
      // Stop and send mock voice message
      clearInterval(recordingTimer.current);
      setIsRecording(false);
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg = {
        id: messages.length + 1,
        sender: 'YOU',
        time: currentTime,
        text: `Voice Note message: 0:${recordingSeconds < 10 ? '0' + recordingSeconds : recordingSeconds} 🎙️`,
        isSelf: true,
        status: isOffline ? 'Sent (Offline)' : 'Read ✓✓',
        attachment: 'Voice Note'
      };
      setMessages(prev => [...prev, newMsg]);
      triggerToast('Voice note dispatch message transmitted.');
      if (isOffline) {
        setOfflineQueueCount(prev => prev + 1);
      }
    } else {
      // Start recording
      setRecordingSeconds(0);
      setIsRecording(true);
      recordingTimer.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const handleToggleConnection = () => {
    if (isOffline) {
      setIsOffline(false);
      if (offlineQueueCount > 0) {
        // Mark all offline messages as Read
        setMessages(prev => prev.map(m => m.isSelf ? { ...m, status: 'Read ✓✓' } : m));
        triggerToast(`Synced ${offlineQueueCount} queued messages to dispatch.`);
        setOfflineQueueCount(0);
      } else {
        triggerToast('Driver portal switched to Online Mode.');
      }
    } else {
      setIsOffline(true);
      triggerToast('Driver portal switched to Offline Mode.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[800px] mx-auto bg-gray-55 min-h-screen text-left flex flex-col space-y-6 relative pb-28">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[120] bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">{toastMsg}</div>
      )}

      {/* Connection status tag */}
      <div className="flex justify-center">
        <button 
          onClick={handleToggleConnection}
          className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-3xs cursor-pointer transition-all border ${
            isOffline 
              ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]' 
              : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]'
          }`}
          title="Toggle network online/offline mode"
        >
          <span>Connection Status:</span>
          <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1 text-white ${
            isOffline ? 'bg-amber-600' : 'bg-emerald-600'
          }`}>
            {isOffline ? 'Offline Mode' : 'Online Mode'} 
            {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
          </span>
        </button>
      </div>

      {/* Offline Alert Box */}
      {isOffline && (
        <div className="bg-[#FEF3C7] border border-[#FDE68A] p-3.5 rounded-2xl flex items-center gap-2 text-[#B45309] text-xs font-bold shadow-3xs text-left animate-pulse">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Offline Active | {offlineQueueCount} items queued</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 flex justify-between items-center shadow-3xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">Driver Portal</h1>
            <span className="text-xl font-bold text-gray-400">•</span>
            <span className="text-xl font-black text-gray-800">chat</span>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">ELD & logistics operations controls.</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] cursor-pointer" title="Driver Controls">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Chat Box Container */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-3xs text-left flex flex-col space-y-4 max-h-[500px]">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Dispatch Communication Chat</h2>
          <p className="text-gray-450 text-[10px] font-bold mt-0.5 uppercase tracking-wider">Live chat thread connected directly to dispatch team.</p>
        </div>

        {/* Messages history view */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[300px] max-h-[350px]">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-[85%] ${
                msg.isSelf ? 'ml-auto text-right items-end' : 'mr-auto text-left items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{msg.sender}</span>
                <span className="text-[8px] text-gray-350">{msg.time}</span>
              </div>

              {/* Message Bubble style */}
              <div className={`p-4.5 rounded-2xl text-xs font-bold leading-normal border shadow-3xs ${
                msg.isSelf 
                  ? 'bg-[#FFD400] text-black border-[#FFE240]' 
                  : 'bg-gray-55 text-gray-800 border-gray-100'
              }`}>
                <span>{msg.text}</span>

                {/* Optional attachment box */}
                {msg.attachment && (
                  <div className={`mt-2.5 p-2 rounded-xl flex items-center gap-2 border text-[10px] font-bold ${
                    msg.isSelf 
                      ? 'bg-yellow-350/30 border-yellow-455/40 text-black' 
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}>
                    {msg.attachment.includes('odometer') ? <Image className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                    <span>{msg.attachment}</span>
                  </div>
                )}
              </div>

              {/* Self message status footer */}
              {msg.isSelf && msg.status && (
                <span className="text-[8px] text-gray-450 font-bold mt-1 px-1">{msg.status}</span>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input box row */}
        <div className="pt-2 border-t border-gray-50 space-y-3">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex gap-3"
          >
            <input 
              type="text" 
              placeholder="Type dispatch update..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
            />
            <button 
              type="submit"
              className="bg-[#FFD400] hover:bg-yellow-405 text-black font-bold text-xs px-5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center"
            >
              <Send className="w-4 h-4 mr-1 shrink-0" /> Send
            </button>
          </form>

          {/* Quick options buttons bar */}
          <div className="flex gap-2">
            <button 
              onClick={handleShareImage}
              className="px-3.5 py-2 border border-gray-200 rounded-xl text-[10px] font-bold text-gray-655 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer shadow-3xs bg-white"
            >
              <Image className="w-3.5 h-3.5 text-gray-450" />
              <span>+ Share Image</span>
            </button>

            <button 
              onClick={handleToggleVoiceNote}
              className={`px-3.5 py-2 border rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all ${
                isRecording 
                  ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' 
                  : 'bg-white border-gray-200 text-gray-655 hover:bg-gray-50'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-gray-400" />
              <span>{isRecording ? `Recording: 0:${recordingSeconds < 10 ? '0' + recordingSeconds : recordingSeconds}` : '🎙️ Voice Note'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* FLOAT FLOATING SOS BUTTON */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-[100]">
        <button 
          onClick={() => setSosModalOpen(true)}
          className="w-12 h-12 bg-white border border-red-200 hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold text-xs shadow-lg cursor-pointer transition-all border-t-2"
        >
          SOS
        </button>

        {/* Floating Hotline toggle shortcut button */}
        <button 
          onClick={() => hotlineOpen ? setHotlineOpen(false) : setHotlineOpen(true)}
          className="w-12 h-12 bg-[#FFD400] hover:bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all z-[120]"
        >
          {hotlineOpen ? <X className="w-5 h-5 text-black" strokeWidth={2.5} /> : <MessageSquare className="w-5 h-5" />}
        </button>
      </div>

      {/* SOS EMERGENCY PANEL MODAL */}
      {sosModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-55">
              <h2 className="text-base font-bold text-gray-900">Emergency Dispatch SOS Panel</h2>
              <button onClick={() => setSosModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"><X size={18} /></button>
            </div>
            
            <p className="text-xs text-gray-455 leading-relaxed mb-5 font-semibold">
              Triggering an emergency alerts the dispatch operations center immediately and logs active tracking.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { triggerToast('EMERGENCY: Panic alert sent.'); setSosModalOpen(false); }}
                className="p-5 bg-red-50/70 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-red-655"
              >
                <Shield className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Panic Button</span>
              </button>
              <button 
                onClick={() => { triggerToast('ALERT: Breakdown reported.'); setSosModalOpen(false); }}
                className="p-5 bg-[#FFFBEB] border border-amber-250 rounded-2xl hover:bg-[#FEF3C7] transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-[#D97706]"
              >
                <Truck className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Breakdown</span>
              </button>
              <button 
                onClick={() => { triggerToast('EMERGENCY: Accident logged.'); setSosModalOpen(false); }}
                className="p-5 bg-red-50/70 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-red-655"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Accident</span>
              </button>
              <button 
                onClick={() => { triggerToast('EMERGENCY: Medical assistance requested.'); setSosModalOpen(false); }}
                className="p-5 bg-red-50/70 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer font-bold text-red-655"
              >
                <Heart className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-xs uppercase tracking-wide">Medical</span>
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-55 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                <span>Share Live GPS Tracking</span>
                <input 
                  type="checkbox"
                  checked={shareGps}
                  onChange={e => setShareGps(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                <span>Auto-Notify Dispatch Center</span>
                <input 
                  type="checkbox"
                  checked={autoNotify}
                  onChange={e => setAutoNotify(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOTLINE SHORTCUTS OVERLAY PANEL */}
      {hotlineOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[110] flex items-end sm:items-center justify-center p-4">
          <div className="bg-transparent max-w-xs w-full flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-200">
            
            {/* The Hotline Card */}
            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-2xl w-full text-left space-y-4">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block pb-1 border-b border-gray-55">HOTLINE SHORTCUTS</span>
              
              <div className="space-y-3.5 text-xs font-bold text-gray-700">
                <button 
                  onClick={() => { triggerToast('Dialing dispatcher hotline...'); setHotlineOpen(false); }}
                  className="w-full py-1 text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>Call Dispatch</span>
                </button>
                <button 
                  onClick={() => { triggerToast('Opening dispatch message console...'); setHotlineOpen(false); }}
                  className="w-full py-1 text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span>Message Dispatch</span>
                </button>
                <button 
                  onClick={() => { triggerToast('Voice note recorder active.'); setHotlineOpen(false); }}
                  className="w-full py-1 text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <Mic className="w-4 h-4 text-gray-400" />
                  <span>Voice Note</span>
                </button>
                <div className="w-full h-px bg-gray-100"></div>
                <button 
                  onClick={() => { triggerToast('Speech to text active.'); setHotlineOpen(false); }}
                  className="w-full py-1 text-left hover:text-black transition-colors flex items-center gap-3"
                >
                  <span className="text-gray-455">🎙️</span>
                  <span>Voice-to-Text</span>
                </button>
              </div>
            </div>

            {/* Circular Close X Button underneath */}
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
