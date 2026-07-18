import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  MessageSquare, Phone, MoreVertical, Paperclip, Mic, Send, Search, 
  CheckCheck, Volume2, X, ShieldAlert, Wifi, Info, User, BellOff, Trash2,
  ArrowLeft
} from 'lucide-react';

export default function CommunicationDepot() {
  // Mock chats state matching the user layout and additional premium channels
  const [chats, setChats] = useState([
    {
      id: '1',
      name: 'Noah Williams',
      role: 'DRIVER (TRK-05)',
      status: 'ACTIVE STATUS',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
      unreadCount: 2,
      license: 'LIC-99214-SYD',
      experience: '5 Years',
      currentVehicle: '2022 Toyota Camry (TRK-05)',
      messages: [
        { id: 1, text: 'Hi Dispatch. Encountering severe traffic on the Pacific Highway bypass.', time: '10:30 AM', sender: 'driver' },
        { id: 2, text: 'Noted Noah. ETA updated to 1h 15m in the system. Let know if you need a reroute.', time: '10:35 AM', sender: 'dispatcher', read: true },
        { id: 3, text: "Traffic is fully stopped now. There's an accident ahead.", time: '10:42 AM', sender: 'driver' }
      ]
    },
    {
      id: '2',
      name: 'Jack Taylor',
      role: 'DRIVER (TRK-12)',
      status: 'ACTIVE STATUS',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
      unreadCount: 0,
      license: 'LIC-44021-MEL',
      experience: '3 Years',
      currentVehicle: '2023 Honda CR-V (TRK-12)',
      messages: [
        { id: 1, text: 'Pre-start checklists completed. Releasing brakes now.', time: '08:02 AM', sender: 'driver' },
        { id: 2, text: 'Roger that Jack. Safe travels.', time: '08:05 AM', sender: 'dispatcher', read: true },
        { id: 3, text: 'ETA is looking good. Reaching in 45m.', time: '09:15 AM', sender: 'driver' }
      ]
    },
    {
      id: '3',
      name: 'Warehouse A',
      role: 'INBOUND TEAM',
      status: 'ONLINE',
      avatar: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&h=150&fit=crop&q=80',
      unreadCount: 0,
      license: 'N/A (Depot Terminal)',
      experience: 'N/A',
      currentVehicle: 'Sydney Central Depot Dock 4',
      messages: [
        { id: 1, text: 'Manifest LOD-044 is ready for assignment.', time: 'Yesterday', sender: 'driver' }
      ]
    }
  ]);

  const location = useLocation();
  // Selected chat ID
  const [selectedChatId, setSelectedChatId] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Pre-select driver chat when navigated from Fleet Monitor with selectedDriverName
  useEffect(() => {
    if (location.state?.selectedDriverName) {
      const matchedChat = chats.find(c => c.name.toLowerCase().includes(location.state.selectedDriverName.toLowerCase()));
      if (matchedChat) {
        setSelectedChatId(matchedChat.id);
        setMobileShowChat(true);
      }
    }
  }, [location.state, chats]);
  
  // Custom Interaction States
  const [showDropdown, setShowDropdown] = useState(false);
  const [mutedChats, setMutedChats] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Call simulation state
  const [activeCall, setActiveCall] = useState(null); // { name, role, status: 'calling'|'connected' }
  const [callTimer, setCallTimer] = useState(0);
  
  // Broadcast terminal alert state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [activeBroadcasts, setActiveBroadcasts] = useState([]);

  // Toast notifications
  const [toastText, setToastText] = useState('');

  // Scroll ref for chat window
  const chatEndRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, selectedChatId]);

  // Close dropdown on clicking outside
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Call timer effect
  useEffect(() => {
    let interval;
    if (activeCall && activeCall.status === 'connected') {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const activeChat = chats.find(c => c.id === selectedChatId) || chats[0];

  const handleSelectChat = (id) => {
    setSelectedChatId(id);
    setMobileShowChat(true);
    setShowDropdown(false);
    setChats(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    const updatedChats = chats.map(c => {
      if (c.id === selectedChatId) {
        const newMsg = {
          id: Date.now(),
          text: messageInput,
          time: timeString,
          sender: 'dispatcher',
          read: true
        };
        return {
          ...c,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    setChats(updatedChats);
    const sentText = messageInput;
    setMessageInput('');

    // Trigger driver replies for extreme premium experience
    setTimeout(() => {
      setChats(prevChats => prevChats.map(c => {
        if (c.id === selectedChatId) {
          let replyText = "Copy that dispatcher, proceeding with caution.";
          if (c.name === 'Noah Williams') {
            if (sentText.toLowerCase().includes('reroute')) {
              replyText = "Yes please, suggest a bypass route. The GPS is showing +40 mins.";
            } else {
              replyText = "Copy that. Staying parked until highway lanes clear up.";
            }
          } else if (c.name === 'Jack Taylor') {
            replyText = "Roger. Approaching exit 12 now.";
          } else if (c.name === 'Warehouse A') {
            replyText = "Inbound dock is clear. We are ready to unload when the driver arrives.";
          }

          const replyMsg = {
            id: Date.now() + 1,
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'driver'
          };

          return {
            ...c,
            messages: [...c.messages, replyMsg]
          };
        }
        return c;
      }));
      
      if (!mutedChats.includes(selectedChatId)) {
        setToastText(`New message from ${activeChat.name}`);
        setTimeout(() => setToastText(''), 3000);
      }
    }, 1500);
  };

  // Start Simulated Voice Call
  const handleStartCall = () => {
    setActiveCall({
      name: activeChat.name,
      role: activeChat.role,
      status: 'calling',
      avatar: activeChat.avatar
    });

    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: 'connected' } : null);
    }, 2000);
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  // Toggle Mute Action
  const handleToggleMute = (chatId) => {
    if (mutedChats.includes(chatId)) {
      setMutedChats(prev => prev.filter(id => id !== chatId));
      setToastText(`Unmuted ${activeChat.name}`);
    } else {
      setMutedChats(prev => [...prev, chatId]);
      setToastText(`Muted notifications for ${activeChat.name}`);
    }
    setTimeout(() => setToastText(''), 3000);
  };

  // Clear Conversation Action
  const handleClearConversation = (chatId) => {
    if (window.confirm(`Are you sure you want to clear all messages for ${activeChat.name}?`)) {
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          return { ...c, messages: [] };
        }
        return c;
      }));
      setToastText(`Cleared conversation history`);
      setTimeout(() => setToastText(''), 3000);
    }
  };

  // Trigger Terminal Broadcast
  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newBroadcast = {
      id: Date.now(),
      text: broadcastMessage,
      time: timeString
    };

    setActiveBroadcasts(prev => [newBroadcast, ...prev]);
    setShowBroadcastModal(false);
    setBroadcastMessage('');

    // Highlight as toast
    setToastText('Emergency Terminal Broadcast Sent Successfully');
    setTimeout(() => setToastText(''), 3500);
  };

  // Format call duration timer
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filtered list based on search bar
  const filteredChats = chats.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-grow bg-[#F8FAFC] min-h-screen p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto relative">
      
      {/* Toast Notification */}
      {toastText && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-750 transition-all duration-300">
          <Wifi className="w-4 h-4 text-[#FFA000] animate-pulse" />
          <span className="text-xs font-bold">{toastText}</span>
        </div>
      )}

      {/* TOP TITLE HEADER CARD */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-xs mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-700 shadow-2xs shrink-0">
            <MessageSquare className="w-5 h-5 text-[#FFA000]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1.5">Communication Depot</h1>
            <p className="text-slate-400 text-xs font-semibold">Real-time driver dispatch alerts and terminal broadcasts</p>
          </div>
        </div>

        <button
          onClick={() => setShowBroadcastModal(true)}
          className="bg-[#FFA000] hover:bg-[#E58F00] text-slate-955 font-extrabold text-xs py-3 px-5 rounded-xl transition-all duration-155 shadow-sm cursor-pointer whitespace-nowrap tracking-wider flex items-center gap-2 transform active:scale-95"
        >
          <Volume2 className="w-4 h-4 text-slate-955" /> BROADCAST ALERT
        </button>
      </div>

      {/* BROADCAST ALERT BAR (If active) */}
      {activeBroadcasts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-[20px] p-4 mb-6 shadow-3xs flex justify-between items-center gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block">Active Broadcast Alert</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">"{activeBroadcasts[0].text}"</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveBroadcasts([])} 
            className="text-amber-500 hover:text-amber-800 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* MAIN CONTAINER LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px] items-stretch">
        
        {/* LEFT SIDEBAR: Messages list */}
        <div className={`lg:col-span-4 bg-white border border-slate-100 rounded-[24px] shadow-sm p-4 flex-col justify-start ${mobileShowChat ? 'hidden lg:flex' : 'flex'}`}>
          <h2 className="text-sm font-black text-slate-800 mb-4 px-1">Messages</h2>
          
          {/* Search chats */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50/55 border border-slate-200 rounded-xl text-xs font-semibold text-slate-705 placeholder-slate-405 focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white transition-all shadow-3xs"
            />
          </div>

          {/* List items */}
          <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
            {filteredChats.map((c) => {
              const isSelected = c.id === selectedChatId;
              const lastMsg = c.messages[c.messages.length - 1];
              const isMuted = mutedChats.includes(c.id);

              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectChat(c.id)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 relative cursor-pointer text-left ${
                    isSelected
                      ? 'bg-white border-slate-200 shadow-md ring-1 ring-slate-100 border-l-[5px] border-l-[#FFA000]'
                      : 'bg-white border-slate-50 hover:bg-slate-55 hover:border-slate-200 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-extrabold text-slate-800">{c.name}</h4>
                        {isMuted && <BellOff size={11} className="text-slate-400" />}
                      </div>
                      <span className={`text-[9px] font-black tracking-wider uppercase tracking-widest block mt-0.5 ${
                        c.role.includes('INBOUND') ? 'text-indigo-650' : 'text-slate-400'
                      }`}>
                        {c.role}
                      </span>
                    </div>
                    <span className="text-[9px] font-extrabold text-slate-400 shrink-0">
                      {lastMsg ? lastMsg.time : ''}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium truncate max-w-[240px] mt-1.5 leading-tight">
                    {lastMsg ? lastMsg.text : 'No messages yet'}
                  </p>

                  {/* Unread Indicator & badge */}
                  {c.unreadCount > 0 && !isSelected && (
                    <div className="absolute right-3.5 bottom-3.5 w-4 h-4 rounded-full bg-[#FFA000] text-slate-955 text-[9px] font-black flex items-center justify-center shadow-3xs animate-pulse">
                      {c.unreadCount}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredChats.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                No chats match your query.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR: Selected Chat Window */}
        <div className={`lg:col-span-8 bg-white border border-slate-100 rounded-[24px] shadow-sm flex-col justify-between overflow-hidden ${mobileShowChat ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* Active Chat Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMobileShowChat(false)}
                className="lg:hidden p-2 -ml-2 hover:bg-slate-200/60 rounded-xl transition-colors text-slate-600 cursor-pointer mr-1 flex items-center justify-center shrink-0"
              >
                <ArrowLeft size={16} className="stroke-[2.5px]" />
              </button>
              <img 
                src={activeChat.avatar} 
                alt={activeChat.name} 
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-3xs shrink-0" 
              />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-slate-800">{activeChat.name}</h3>
                  {mutedChats.includes(activeChat.id) && <BellOff size={11} className="text-slate-400" />}
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">
                  {activeChat.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <button 
                onClick={handleStartCall}
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-rose-500 cursor-pointer shadow-3xs bg-white"
                title={`Call ${activeChat.name}`}
              >
                <Phone size={14} className="stroke-[2.5px]" />
              </button>
              
              {/* Dropdown Options Wrap */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`p-2 border rounded-xl transition-all cursor-pointer shadow-3xs ${
                    showDropdown 
                      ? 'bg-slate-100 text-slate-900 border-slate-300' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                  title="Options"
                >
                  <MoreVertical size={14} className="stroke-[2.5px]" />
                </button>

                {/* Dropdown popup exactly matches the user screenshot layout & style */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2.5 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 py-2 animate-fade-in text-left">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full px-4 py-3 text-[10px] font-extrabold text-slate-800 hover:bg-slate-50/80 transition-colors flex items-center gap-3 cursor-pointer uppercase tracking-wider"
                    >
                      <User size={13} className="text-slate-400 stroke-[2.5px]" />
                      VIEW DRIVER PROFILE
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleToggleMute(activeChat.id);
                      }}
                      className="w-full px-4 py-3 text-[10px] font-extrabold text-slate-800 hover:bg-slate-50/80 transition-colors flex items-center gap-3 cursor-pointer uppercase tracking-wider"
                    >
                      <BellOff size={13} className="text-slate-400 stroke-[2.5px]" />
                      {mutedChats.includes(activeChat.id) ? 'UNMUTE CONVERSATION' : 'MUTE CONVERSATION'}
                    </button>
                    
                    <div className="border-t border-slate-100/70 my-1.5"></div>
                    
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleClearConversation(activeChat.id);
                      }}
                      className="w-full px-4 py-3 text-[10px] font-black text-rose-500 hover:bg-rose-50/60 transition-colors flex items-center gap-3 cursor-pointer uppercase tracking-wider"
                    >
                      <Trash2 size={13} className="text-rose-500 stroke-[2.5px]" />
                      CLEAR CONVERSATION
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-grow p-6 overflow-y-auto space-y-4 max-h-[380px] min-h-[380px] bg-slate-50/20 custom-scrollbar">
            
            {/* Time Divider */}
            <div className="flex justify-center my-3">
              <span className="bg-slate-100 border border-slate-200/50 text-slate-400 font-extrabold text-[9px] px-3 py-1 rounded-full uppercase tracking-wider">
                Today, 10:30 AM
              </span>
            </div>

            {activeChat.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs font-semibold py-12">
                <MessageSquare className="w-8 h-8 text-slate-300 mb-2 stroke-[2px]" />
                No messages. Send a message to start the conversation.
              </div>
            ) : (
              activeChat.messages.map((m, idx) => {
                const isDispatcher = m.sender === 'dispatcher';
                return (
                  <div 
                    key={m.id || idx} 
                    className={`flex flex-col ${isDispatcher ? 'items-end' : 'items-start'} max-w-full`}
                  >
                    <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-xs font-semibold leading-relaxed shadow-3xs ${
                      isDispatcher 
                        ? 'bg-[#FFA000] text-slate-955 rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-200/60 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                    
                    <div className={`flex items-center gap-1 mt-1 text-[9px] font-extrabold text-slate-400 px-1`}>
                      <span>{m.time}</span>
                      {isDispatcher && (
                        <CheckCheck size={11} className="text-[#1D4ED8] stroke-[2.5px]" />
                      )}
                    </div>
                  </div>
                );
              })
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input form Footer */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white">
            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-2.5 flex flex-col justify-between gap-3 focus-within:border-[#FFA000] transition-colors shadow-3xs">
              <textarea
                placeholder={`Message ${activeChat.name.split(' ')[0]}...`}
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                className="w-full bg-transparent resize-none outline-none border-none text-xs font-semibold text-slate-700 placeholder-slate-400 py-1.5 px-2.5 h-12"
              />

              <div className="flex justify-between items-center border-t border-slate-100/80 pt-2 px-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setToastText('Paperclip file attach window simulated');
                      setTimeout(() => setToastText(''), 3000);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shadow-3xs bg-white border border-slate-200/50"
                    title="Attach Files"
                  >
                    <Paperclip size={13} className="stroke-[2.5px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setToastText('Microphone recording active (mock)');
                      setTimeout(() => setToastText(''), 3000);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shadow-3xs bg-white border border-slate-200/50"
                    title="Voice Recording"
                  >
                    <Mic size={13} className="stroke-[2.5px]" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className={`font-black text-[10px] py-2.5 px-4.5 rounded-xl flex items-center gap-2 transition-all tracking-wider uppercase ${
                    messageInput.trim()
                      ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transform active:scale-95 shadow-sm'
                      : 'bg-slate-105 text-slate-350 cursor-not-allowed border border-slate-200/50'
                  }`}
                >
                  <Send size={11} className="stroke-[2.5px]" /> SEND
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>

      {/* ==========================================
          DRIVER PROFILE MODAL (Interactive)
          ========================================== */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 text-left relative transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#FFA000]" />
                <h3 className="text-sm font-black text-slate-900">Driver Profile Card</h3>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-450 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="pt-4 space-y-4 text-xs font-semibold">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <img 
                  src={activeChat.avatar} 
                  alt={activeChat.name} 
                  className="w-16 h-16 rounded-full object-cover border border-slate-200" 
                />
                <div>
                  <h4 className="text-sm font-black text-slate-800">{activeChat.name}</h4>
                  <span className="text-[9px] font-black text-[#FFA000] uppercase tracking-wider block mt-1">{activeChat.role}</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-bold">LICENSE ID</span>
                  <span className="text-slate-800 font-extrabold font-mono">{activeChat.license || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-bold">DRIVING EXPERIENCE</span>
                  <span className="text-slate-800 font-extrabold">{activeChat.experience || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-bold">ASSIGNED EQUIPMENT</span>
                  <span className="text-slate-800 font-extrabold">{activeChat.currentVehicle || 'N/A'}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-400 font-bold">STATUS</span>
                  <span className="px-2 py-0.5 bg-emerald-55 text-emerald-700 rounded text-[9px] font-black uppercase">
                    {activeChat.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-colors cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===========================================
          EMERGENCY BROADCAST DIALOG / MODAL
          =========================================== */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 text-left relative transform transition-all duration-300 scale-100">
            
            <div className="flex justify-between items-center pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-500 shrink-0" />
                <h3 className="text-sm font-black text-slate-900">Broadcast Announcement</h3>
              </div>
              <button 
                onClick={() => setShowBroadcastModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-455 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 pt-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Broadcast Message</label>
                <textarea
                  required
                  placeholder="e.g. Extreme weather alert near Sydney Central. Drivers bypass the main highway route and stay updated."
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white w-full h-24 resize-none"
                />
              </div>

              <div className="bg-amber-50 rounded-xl p-3 flex gap-2 border border-amber-100">
                <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 font-bold leading-normal">
                  This broadcast will appear on all drivers dashboard terminals instantly and play a visual alert cue.
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 border border-slate-250 text-slate-500 rounded-xl text-xs font-extrabold hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Volume2 size={13} /> Send Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===========================================
          SIMULATED TELEPHONY VOICE CALL OVERLAY
          =========================================== */}
      {activeCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/70 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] w-full max-w-sm p-8 shadow-2xl text-center flex flex-col items-center justify-center text-white relative">
            
            {/* Status Pulse */}
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-[9px] font-bold text-slate-300">
              <span className={`w-2 h-2 rounded-full ${activeCall.status === 'connected' ? 'bg-emerald-500 animate-ping' : 'bg-rose-500 animate-pulse'}`}></span>
              <span className="uppercase tracking-widest font-black">{activeCall.status}</span>
            </div>

            {/* Calling Avatar */}
            <div className="w-24 h-24 rounded-full border-4 border-[#FFA000]/60 p-1 relative mt-6 mb-4 animate-pulse">
              <img 
                src={activeCall.avatar} 
                alt={activeCall.name} 
                className="w-full h-full rounded-full object-cover shadow-md"
              />
            </div>

            {/* Name / Vehicle info */}
            <h3 className="text-base font-black tracking-tight">{activeCall.name}</h3>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 tracking-widest">{activeCall.role}</p>

            {/* Call Duration / Status code */}
            <div className="mt-8 text-2xl font-mono font-black text-slate-100">
              {activeCall.status === 'connected' ? formatTimer(callTimer) : 'Dialing...'}
            </div>

            <p className="text-[10px] text-slate-500 font-bold mt-2.5 max-w-[200px] leading-relaxed">
              {activeCall.status === 'connected' 
                ? 'Telephony Bridge Connected via Secure VOIP channel' 
                : 'Connecting secure voice bridge to vehicle cab terminal...'}
            </p>

            {/* Call Action buttons */}
            <div className="flex gap-4 items-center justify-center mt-10 w-full">
              <button 
                onClick={handleEndCall}
                className="w-12 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-md"
                title="Hang up"
              >
                <X size={20} className="stroke-[3px]" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
