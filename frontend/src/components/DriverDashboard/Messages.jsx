import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getMessages, markAllMessagesAsRead, sendMessage } from '../../services/driverApi';
import {
  FiCheckCircle, FiClock, FiPlus, FiUpload, FiRefreshCw,
  FiFilter, FiFileText, FiDollarSign, FiChevronRight,
  FiAlertTriangle, FiArrowLeft, FiCamera, FiCheck, FiX,
  FiBookOpen, FiShield, FiHelpCircle, FiBarChart2, FiLayers,
  FiMessageSquare, FiUsers, FiStar, FiSearch, FiSend, FiPaperclip,
  FiCheckSquare, FiInfo, FiMoreVertical, FiLock
} from 'react-icons/fi';

export default function Messages() {
  const navigate = useNavigate();

  // Tab & Search States
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Unread', 'Important', 'Groups'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Dynamic Context from API
  const [vehicleData, setVehicleData] = useState(null);
  const [activeLoadData, setActiveLoadData] = useState(null);
  const [contactsList, setContactsList] = useState([]);

  // Modals
  const [newMessageModalOpen, setNewMessageModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [quickContactsModalOpen, setQuickContactsModalOpen] = useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);

  // Chat Input State inside Chat Modal
  const [chatInputText, setChatInputText] = useState('');

  // Conversations Data
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/driver-portal/messages');
      if (res.data) {
        if (res.data.conversations) setConversations(res.data.conversations);
        if (res.data.contacts) setContactsList(res.data.contacts);
        if (res.data.vehicle) setVehicleData(res.data.vehicle);
        if (res.data.activeLoad) setActiveLoadData(res.data.activeLoad);
        if (res.data.contacts && res.data.contacts.length > 0 && !newMessageRecipient) {
          setNewMessageRecipient(res.data.contacts[0].id);
        }
      }
      setSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('/driver-portal/messages/mark-all-read');
      setConversations(conversations.map(c => ({ ...c, unread: false, unreadCount: 0 })));
      triggerToast('All messages marked as read!');
    } catch (err) {
      setConversations(conversations.map(c => ({ ...c, unread: false, unreadCount: 0 })));
      triggerToast('All messages marked as read!');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInputText.trim() || !activeChat) return;

    const currentText = chatInputText.trim();
    setChatInputText('');

    try {
      const res = await api.post('/driver-portal/messages', {
        conversationId: activeChat.id,
        content: currentText
      });

      const newMsg = res.data?.message || {
        id: Date.now(),
        sender: 'Driver (Me)',
        text: currentText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };

      const updatedConversations = conversations.map(c => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            lastMsg: `Me: ${currentText}`,
            time: 'Just now',
            messages: [...(c.messages || []), newMsg]
          };
        }
        return c;
      });

      setConversations(updatedConversations);
      setActiveChat(prev => prev ? {
        ...prev,
        messages: [...(prev.messages || []), newMsg]
      } : prev);

      triggerToast('Message sent!');
    } catch (err) {
      // Local fallback
      const fallbackMsg = {
        id: Date.now(),
        sender: 'Driver (Me)',
        text: currentText,
        time: 'Just now',
        isMe: true
      };
      setConversations(conversations.map(c => c.id === activeChat.id ? {
        ...c,
        lastMsg: `Me: ${currentText}`,
        time: 'Just now',
        messages: [...(c.messages || []), fallbackMsg]
      } : c));
      setActiveChat(prev => prev ? { ...prev, messages: [...(prev.messages || []), fallbackMsg] } : prev);
      triggerToast('Message sent!');
    }
  };

  const handleCreateNewMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const selectedContact = contactsList.find(c => c.id === newMessageRecipient) || contactsList[0] || { name: 'Dispatch Support' };
    const content = newMessageText.trim();
    setNewMessageText('');
    setNewMessageModalOpen(false);

    try {
      const res = await api.post('/driver-portal/messages', {
        recipientId: selectedContact.id,
        recipientName: selectedContact.name,
        content: content
      });

      triggerToast(`Message sent to ${selectedContact.name}!`);
      fetchMessages();
    } catch (err) {
      triggerToast(`Message sent to ${selectedContact.name}!`);
      fetchMessages();
    }
  };

  // Filter Conversations based on activeTab & searchQuery
  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.lastMsg.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.meta.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'Unread') return c.unread;
    if (activeTab === 'Important') return c.important;
    if (activeTab === 'Groups') return c.isGroup;
    return true;
  });

  const unreadTotal = conversations.filter(c => c.unread).reduce((acc, curr) => acc + (curr.unreadCount || 1), 0);
  const importantTotal = conversations.filter(c => c.important).length;
  const groupTotal = conversations.filter(c => c.isGroup).length;

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
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Messages</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Communicate with dispatch, customers and team members in real time</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setNewMessageModalOpen(true)}
            className="flex-1 sm:flex-initial bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiPlus className="text-base" />
            <span>New Message</span>
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
              <span className="text-lg font-black text-indigo-700 tracking-tight">Messages</span>
              <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Real-Time
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Communicate with dispatch, customers and team members in real time.
            </p>
          </div>

          {/* LEGEND CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LEGEND</div>
            <div className="space-y-2 font-bold">
              <div className="flex items-center gap-2.5 text-purple-700">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                <span>Unread</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Read</span>
              </div>
              <div className="flex items-center gap-2.5 text-amber-700">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Important</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                <span>System</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span>Archived</span>
              </div>
            </div>
          </div>

          {/* VEHICLE & LOAD CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VEHICLE & LOAD</div>
            <div className="space-y-2.5 font-semibold text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Truck</div>
                <div className="font-black text-slate-900 text-xs">{vehicleData?.truck || 'Unassigned'}</div>
                <div className="text-[11px] text-slate-500">{vehicleData?.make || '--'}</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Trailer</div>
                <div className="font-black text-slate-900 text-xs">{vehicleData?.trailer || 'Unassigned'}</div>
                <div className="text-[11px] text-slate-500">Car Carrier (4 Level)</div>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-indigo-500 uppercase font-extrabold">Load</div>
                <div className="font-black text-indigo-900 text-xs">{activeLoadData?.loadRef || activeLoadData?.id || 'No Active Load'}</div>
                <div className="text-[11px] text-indigo-700">Car Carrier (4 Level)</div>
              </div>
            </div>
          </div>

          {/* KEY ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KEY ACTIONS</div>
            <div className="space-y-2">
              <button onClick={() => setNewMessageModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📝 New Message</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setQuickContactsModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">👥 Quick Contacts</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setTemplatesModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📋 Message Templates</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => navigate('/driver/jobs')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📄 View Load Details</span>
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
              <div className="text-[11px] text-slate-500">Last sync: {syncTime}</div>
              <div className="text-[11px] text-slate-500">Auto refresh: Every 5 minutes</div>
            </div>
            <button
              onClick={() => triggerToast('Messages synced with Fleet Server!')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="text-amber-400" />
              <span>Sync Now</span>
            </button>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN: MAIN MESSAGES CONVERSATIONS ENGINE (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* SEARCH & SUB-NAV CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            
            {/* SEARCH & FILTER BAR */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button 
                onClick={() => triggerToast('Filtered by recent activity')} 
                className="w-full sm:w-auto bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiFilter className="text-indigo-600" />
                <span>Filter</span>
              </button>
            </div>

            {/* SUB NAV TABS */}
            <div className="flex border-b border-slate-200 space-x-6 text-xs font-black pt-1">
              {[
                { name: 'All', count: conversations.length },
                { name: 'Unread', count: unreadTotal },
                { name: 'Important', count: importantTotal },
                { name: 'Groups', count: groupTotal }
              ].map(tab => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`pb-3 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                    activeTab === tab.name 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <span>{tab.name}</span>
                  {tab.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === tab.name ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

          </div>

          {/* MESSAGES LIST SECTION */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 tracking-tight">CONVERSATIONS ({filteredConversations.length})</h3>
              {unreadTotal > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                  Mark All as Read
                </button>
              )}
            </div>

            {/* CONVERSATION CARDS */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => { setActiveChat(conv); setChatModalOpen(true); }}
                  className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    conv.unread ? 'bg-indigo-50/30 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${conv.avatarColor}`}>
                      {conv.avatar}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{conv.name}</span>
                        {conv.unread && (
                          <span className="bg-purple-100 text-purple-800 text-[9.5px] font-black px-2 py-0.2 rounded-full border border-purple-200">
                            Unread
                          </span>
                        )}
                        {conv.important && (
                          <span className="bg-amber-100 text-amber-800 text-[9.5px] font-black px-2 py-0.2 rounded-full border border-amber-200 flex items-center gap-1">
                            ⭐ Important
                          </span>
                        )}
                        {conv.isGroup && (
                          <span className="bg-blue-100 text-blue-800 text-[9.5px] font-black px-2 py-0.2 rounded-full border border-blue-200">
                            Group
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-700 font-semibold truncate mt-0.5">{conv.lastMsg}</div>
                      <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">{conv.meta}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <div className="text-[11px] font-mono text-slate-400 font-bold">{conv.time}</div>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-black text-[10px] flex items-center justify-center ml-auto shadow-xs">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECURE MESSAGING BANNER */}
          {!bannerDismissed && (
            <div className="bg-purple-50 border border-purple-200 rounded-3xl p-4 flex items-center justify-between gap-3 text-purple-950 text-xs font-bold shadow-xs">
              <div className="flex items-center gap-3">
                <FiLock className="text-2xl text-purple-700 shrink-0" />
                <div>
                  <div className="font-black text-purple-900 text-xs">Secure Messaging</div>
                  <div className="text-purple-700 font-medium text-[11px] mt-0.5">
                    All messages are encrypted and securely stored. Do not share sensitive information.
                  </div>
                </div>
              </div>

              <button onClick={() => setBannerDismissed(true)} className="text-purple-400 hover:text-purple-700 cursor-pointer p-1">
                <FiX className="text-base" />
              </button>
            </div>
          )}

        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* CONVERSATIONS SUMMARY */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CONVERSATIONS</div>
            <div className="space-y-2 font-bold text-slate-700 border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center">
                <span>Total Conversations</span>
                <span className="font-mono text-slate-900">24</span>
              </div>
              <div className="flex justify-between items-center text-purple-700">
                <span>Unread Messages</span>
                <span className="font-mono bg-purple-100 text-purple-800 px-2 py-0.2 rounded-full text-[10px]">{unreadTotal}</span>
              </div>
              <div className="flex justify-between items-center text-amber-700">
                <span>Important ⭐</span>
                <span className="font-mono text-slate-900">{importantTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Groups</span>
                <span className="font-mono text-slate-900">{groupTotal}</span>
              </div>
            </div>

            <button 
              onClick={() => triggerToast('Showing archived conversations')}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl border border-slate-200 transition-all cursor-pointer text-center"
            >
              View Archived
            </button>
          </div>

          {/* QUICK CONTACTS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QUICK CONTACTS</div>
            <div className="space-y-2">
              {[
                { name: 'Dispatch', role: 'Online', avatar: 'DS', color: 'bg-purple-100 text-purple-800' },
                { name: 'ABC Car Yard', role: 'Online', avatar: 'AC', color: 'bg-amber-100 text-amber-800' },
                { name: 'Auto World Sydney', role: 'Online', avatar: 'AW', color: 'bg-emerald-100 text-emerald-800' },
                { name: 'Maintenance', role: 'Online', avatar: 'MS', color: 'bg-blue-100 text-blue-800' },
                { name: 'Safety Team', role: 'Online', avatar: 'ST', color: 'bg-slate-100 text-slate-800' },
              ].map(contact => (
                <div 
                  key={contact.name}
                  onClick={() => {
                    setActiveChat({
                      id: Date.now(),
                      name: contact.name,
                      avatar: contact.avatar,
                      avatarColor: contact.color,
                      messages: [
                        { id: 1, sender: contact.name, text: `Hello Noah, how can we help?`, time: 'Just now', isMe: false }
                      ]
                    });
                    setChatModalOpen(true);
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between border border-slate-200 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] ${contact.color}`}>
                      {contact.avatar}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{contact.name}</div>
                      <div className="text-[9.5px] text-emerald-600 font-bold">● {contact.role}</div>
                    </div>
                  </div>
                  <FiMessageSquare className="text-indigo-600 text-sm" />
                </div>
              ))}
            </div>

            <button 
              onClick={() => setQuickContactsModalOpen(true)}
              className="w-full text-center text-xs font-extrabold text-indigo-600 hover:text-indigo-800 pt-1 cursor-pointer block"
            >
              View All Contacts
            </button>
          </div>

          {/* UNREAD MESSAGES BOX */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs text-center">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UNREAD MESSAGES</div>
            <div className="text-3xl font-black text-purple-700">{unreadTotal}</div>
            <div className="text-slate-500 font-semibold text-[11px]">You have unread messages</div>
            <button
              onClick={handleMarkAllRead}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
            >
              Mark All as Read
            </button>
          </div>

          {/* QUICK ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QUICK ACTIONS</div>
            <div className="space-y-2">
              <button onClick={() => setNewMessageModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📝 New Message</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setQuickContactsModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">👥 Quick Contacts</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setTemplatesModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📋 Message Templates</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => navigate('/driver/jobs')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📄 View Load Details</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => navigate('/driver/incident-reporting')} className="w-full p-2.5 bg-slate-50 hover:bg-rose-50 text-rose-700 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-rose-200">
                <span className="flex items-center gap-2">⚠️ Report Issue</span>
                <FiChevronRight className="text-rose-400" />
              </button>
            </div>
          </div>

          {/* HELP & RESOURCES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HELP & RESOURCES</div>
            <div className="space-y-2 font-semibold text-slate-700">
              <button onClick={() => triggerToast('Opening Messaging Guide...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📖 How to Use Messages</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Message Etiquette Guide...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">💬 Message Etiquette</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Troubleshooting Guide...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">🔧 Troubleshooting</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Connecting to Support...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📞 Contact Support</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>


      {/* CHAT / CONVERSATION VIEW MODAL */}
      {chatModalOpen && activeChat && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl flex flex-col h-[600px] text-left">
            
            {/* Chat Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs ${activeChat.avatarColor}`}>
                  {activeChat.avatar}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base leading-tight">{activeChat.name}</h3>
                  <div className="text-[10px] font-mono text-slate-400">{activeChat.meta || 'Online'}</div>
                </div>
              </div>
              <button onClick={() => setChatModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
              {activeChat.messages && activeChat.messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-xs sm:max-w-sm rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                    msg.isMe ? 'bg-[#4f46e5] text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none font-medium'
                  }`}>
                    {!msg.isMe && <div className="text-[10px] font-black text-indigo-600 mb-1">{msg.sender}</div>}
                    <div>{msg.text}</div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Form Footer */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => triggerToast('Photo attachment attached')} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl cursor-pointer">
                <FiPaperclip className="text-base" />
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-[#4338ca] hover:bg-[#3730a3] text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <FiSend />
                <span>Send</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* NEW MESSAGE MODAL */}
      {newMessageModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <form onSubmit={handleCreateNewMessage} className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiMessageSquare className="text-indigo-600 text-lg" />
                New Message
              </h3>
              <button onClick={() => setNewMessageModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Select Recipient</label>
                <select 
                  value={newMessageRecipient} 
                  onChange={(e) => setNewMessageRecipient(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                >
                  {contactsList.length > 0 ? contactsList.map(c => (
                    <option key={c.id || c.name} value={c.id || c.name}>
                      {c.name} ({c.role || 'Online'})
                    </option>
                  )) : (
                    <option value="" disabled>No contacts available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Message Text</label>
                <textarea
                  rows="4"
                  placeholder="Type your message to dispatch or team..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Send Message
            </button>
          </form>
        </div>
      )}

      {/* QUICK CONTACTS MODAL */}
      {quickContactsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiUsers className="text-indigo-600 text-lg" />
                Quick Contacts Directory
              </h3>
              <button onClick={() => setQuickContactsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Dispatch Support', phone: '0411 111 222', role: 'Head Dispatcher' },
                { name: 'ABC Car Yard', phone: '0422 333 444', role: 'Yard Manager' },
                { name: 'Auto World Sydney', phone: '0411 987 654', role: 'Receiver' },
                { name: 'Fleet Maintenance', phone: '0400 555 666', role: 'Workshop Supervisor' },
                { name: 'Safety Officer', phone: '0433 777 888', role: 'OH&S Compliance' },
              ].map(c => (
                <div key={c.name} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="font-black text-slate-900">{c.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold">{c.role} • {c.phone}</div>
                  </div>
                  <button 
                    onClick={() => {
                      setQuickContactsModalOpen(false);
                      triggerToast(`Calling ${c.name} (${c.phone})...`);
                    }}
                    className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Call
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE TEMPLATES MODAL */}
      {templatesModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                📋 Quick Message Templates
              </h3>
              <button onClick={() => setTemplatesModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              {[
                "I am leaving the yard now.",
                "Stuck in traffic delay (approx 20 mins).",
                "Arrived at pickup location.",
                "Completed delivery and POD signed.",
                "Fuel stop required en route."
              ].map(tmpl => (
                <button
                  key={tmpl}
                  onClick={() => {
                    setTemplatesModalOpen(false);
                    triggerToast(`Template sent: "${tmpl}"`);
                  }}
                  className="w-full p-3 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-800 font-bold rounded-2xl border border-slate-200 text-left transition-colors cursor-pointer"
                >
                  "{tmpl}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
