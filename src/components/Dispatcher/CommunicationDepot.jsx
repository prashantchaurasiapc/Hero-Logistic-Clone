import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Users, Plus, Phone, Video, Info, Paperclip, Smile, Image as ImageIcon,
  MapPin, Send, MoreVertical, X, Check, CheckCheck, Clock, AlertCircle, FileText, 
  Download, User, Navigation, ChevronRight, Filter, History, UserPlus, Bell, BellOff,
  Archive, Trash2, MessageSquare, CheckCircle
} from 'lucide-react';
import { mockConversationsData } from '../../data/mockMessagesData';

const MODAL_STYLE = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
  },
  box: (w) => ({
    background: '#fff', borderRadius: 20, boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
    width: '100%', maxWidth: w, maxHeight: '90vh', display: 'flex', flexDirection: 'column',
    animation: 'modalPop 0.22s cubic-bezier(.4,1.6,.6,1) both'
  })
};

function GradientHeader({ icon: Icon, title, subtitle, onClose, color = '#1e40af' }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${color} 0%, #3b82f6 100%)` }}
      className="px-6 py-5 flex items-center justify-between flex-shrink-0 rounded-t-[20px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">{title}</h2>
          {subtitle && <p className="text-blue-100 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <button onClick={onClose}
        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
        <X size={18} />
      </button>
    </div>
  );
}

/* ───────────── NEW MESSAGE MODAL ───────────── */
function NewMessageModal({ onClose, conversations, onSend }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Normal');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!to || !message) return;
    onSend({ to, subject, message, priority });
    onClose();
  };

  const contacts = conversations.filter(c => c.type !== 'group').map(c => c.name);

  return (
    <div style={MODAL_STYLE.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={MODAL_STYLE.box(580)}>
        <GradientHeader icon={MessageSquare} title="New Message"
          subtitle="Send a message to a driver, staff member or contact" onClose={onClose} />
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: '#f8fafc' }}>
          {/* To */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                <User size={11} className="text-blue-600" />
              </div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Recipient</span>
            </div>
            <label className="text-xs font-semibold text-slate-600">To <span className="text-red-500">*</span></label>
            <select required value={to} onChange={e => setTo(e.target.value)}
              className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
              <option value="">— Select recipient —</option>
              {contacts.map(name => <option key={name}>{name}</option>)}
            </select>
          </div>
          {/* Subject & Priority */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Subject <span className="text-slate-400 font-normal">(optional)</span></label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Load LD-10580 Update"
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
                <option>Normal</option><option>Urgent</option><option>Low</option>
              </select>
            </div>
          </div>
          {/* Message */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Message <span className="text-red-500">*</span></label>
            <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
          </div>
          {/* Attachments hint */}
          <div className="flex items-center gap-2 px-1">
            <button type="button"
              className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-xs font-medium transition-colors">
              <Paperclip size={13} /> Attach file
            </button>
            <button type="button"
              className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-xs font-medium transition-colors">
              <MapPin size={13} /> Attach location
            </button>
          </div>
        </form>
        <div className="px-6 py-4 border-t border-slate-200 bg-white rounded-b-[20px] flex items-center justify-between flex-shrink-0">
          <p className="text-[11px] text-slate-400"><span className="text-red-500">*</span> Required</p>
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit}
              className="px-6 py-2.5 font-bold rounded-xl text-sm text-white shadow-md flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg,#1e40af,#3b82f6)' }}>
              <Send size={14} /> Send Message
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes modalPop{from{opacity:0;transform:scale(.93) translateY(18px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

/* ───────────── NEW GROUP MODAL ───────────── */
function NewGroupModal({ onClose, conversations, onCreate }) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState([]);
  const [groupType, setGroupType] = useState('Team');

  const contacts = conversations.map(c => ({ id: c.id, name: c.name, type: c.type }));

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!groupName || selected.length < 1) return;
    onCreate({ groupName, description, groupType, memberIds: selected });
    onClose();
  };

  return (
    <div style={MODAL_STYLE.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={MODAL_STYLE.box(560)}>
        <GradientHeader icon={Users} title="Create New Group"
          subtitle="Create a group conversation for team communication" onClose={onClose} color="#7c3aed" />
        <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: '#f8fafc' }}>
          {/* Group Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded bg-violet-100 flex items-center justify-center">
                <Users size={11} className="text-violet-600" />
              </div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Group Info</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Group Name <span className="text-red-500">*</span></label>
              <input required type="text" value={groupName} onChange={e => setGroupName(e.target.value)}
                placeholder="e.g. Sydney Route Team"
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Group Type</label>
              <select value={groupType} onChange={e => setGroupType(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all">
                <option>Team</option><option>Load Group</option><option>Broadcast</option><option>Support</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Description <span className="text-slate-400 font-normal">(optional)</span></label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of this group"
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
            </div>
          </div>

          {/* Add Members */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-violet-100 flex items-center justify-center">
                  <UserPlus size={11} className="text-violet-600" />
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Add Members</span>
              </div>
              {selected.length > 0 && (
                <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                  {selected.length} selected
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {contacts.map(contact => (
                <label key={contact.id}
                  className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors border ${
                    selected.includes(contact.id) 
                      ? 'bg-violet-50 border-violet-200' 
                      : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                  }`}>
                  <input type="checkbox" checked={selected.includes(contact.id)}
                    onChange={() => toggle(contact.id)} className="hidden" />
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                    selected.includes(contact.id) ? 'bg-violet-600 border-violet-600' : 'bg-white border-slate-300'
                  }`}>
                    {selected.includes(contact.id) && <Check size={11} className="text-white" />}
                  </div>
                  <img src={`https://ui-avatars.com/api/?name=${contact.name.replace(' ', '+')}&background=f1f5f9&size=32`}
                    className="w-7 h-7 rounded-full border border-slate-200" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{contact.name}</p>
                    <p className="text-[10px] text-slate-500">{contact.type === 'group' ? 'Group' : 'Driver / Staff'}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </form>
        <div className="px-6 py-4 border-t border-slate-200 bg-white rounded-b-[20px] flex items-center justify-between flex-shrink-0">
          <p className="text-[11px] text-slate-400"><span className="text-red-500">*</span> Required · min 1 member</p>
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleCreate}
              className="px-6 py-2.5 font-bold rounded-xl text-sm text-white shadow-md flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              <Users size={14} /> Create Group
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes modalPop{from{opacity:0;transform:scale(.93) translateY(18px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

/* ───────────── MAIN COMPONENT ───────────── */
export default function CommunicationDepot() {
  const [conversations, setConversations] = useState(mockConversationsData);
  const [selectedConvId, setSelectedConvId] = useState(mockConversationsData[0].id);
  const [filterTab, setFilterTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [toast, setToast] = useState(null);
  const chatEndRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredConversations = useMemo(() => {
    let result = conversations;
    if (filterTab === 'Unread') result = result.filter(c => c.unreadCount > 0 || c.messages.some(m => m.isUnread));
    else if (filterTab === 'Groups') result = result.filter(c => c.type === 'group');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || (c.loadId && c.loadId.toLowerCase().includes(q)));
    }
    return result;
  }, [conversations, filterTab, searchQuery]);

  const selectedConversation = useMemo(() => {
    return conversations.find(c => c.id === selectedConvId) || conversations[0];
  }, [conversations, selectedConvId]);

  const unreadCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const groupsCount = conversations.filter(c => c.type === 'group').length;

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;
    const newMessage = {
      id: `m-${Date.now()}`, senderId: 'me', text: newMessageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'outgoing', status: 'sent', dateGroup: 'Today'
    };
    setConversations(prev => prev.map(conv =>
      conv.id === selectedConvId ? { ...conv, messages: [...conv.messages, newMessage] } : conv
    ));
    setNewMessageText('');
  };

  const handleSendNewMessage = ({ to, subject, message, priority }) => {
    showToast(`Message sent to ${to} successfully!`);
  };

  const handleCreateGroup = ({ groupName, groupType, memberIds }) => {
    const newGroup = {
      id: `grp-${Date.now()}`, name: groupName, type: 'group',
      memberCount: memberIds.length, time: 'Now', unreadCount: 0,
      messages: [{
        id: `m-${Date.now()}`, type: 'incoming', senderId: 'System',
        text: `Group "${groupName}" created.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateGroup: 'Today'
      }]
    };
    setConversations(prev => [newGroup, ...prev]);
    setSelectedConvId(newGroup.id);
    showToast(`Group "${groupName}" created with ${memberIds.length} member(s)!`);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] w-full text-left font-sans">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[99999] px-5 py-3 rounded-xl shadow-xl text-sm font-semibold text-white flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg,#059669,#10b981)', animation: 'modalPop .2s ease both' }}>
          <CheckCircle size={16} /> {toast.msg}
        </div>
      )}

      {/* Modals */}
      {showNewMessageModal && (
        <NewMessageModal onClose={() => setShowNewMessageModal(false)}
          conversations={conversations} onSend={handleSendNewMessage} />
      )}
      {showNewGroupModal && (
        <NewGroupModal onClose={() => setShowNewGroupModal(false)}
          conversations={conversations} onCreate={handleCreateGroup} />
      )}

      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">Communicate with drivers, yard staff and internal team members.</p>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <div className="flex items-center gap-3 shrink-0">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Branch</label>
            <select className="w-32 md:w-40 h-9 px-3 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none shadow-sm">
              <option>All Branches</option>
              <option>Melbourne Depot</option>
              <option>Sydney Branch</option>
            </select>
          </div>

          <div className="flex-1 shrink-0 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages by name, load ID..."
                className="w-full h-9 pl-9 pr-4 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none shadow-sm" />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 md:ml-auto">
            <button
              onClick={() => setShowNewGroupModal(true)}
              className="h-9 px-4 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm bg-white">
              <Users size={14} /> New Group
            </button>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="h-9 px-4 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm transition-colors">
              <Plus size={14} /> New Message
            </button>
          </div>
        </div>
      </div>

      {/* Main Content (3 Columns) */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">

        {/* Left Column: Conversations */}
        <div className="w-full lg:w-[320px] bg-white lg:border-r border-b lg:border-b-0 border-slate-200 flex flex-col flex-shrink-0 min-h-[400px] lg:min-h-0">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900">Conversations</h2>
            <Filter size={14} className="text-slate-400" />
          </div>

          <div className="flex px-4 py-2 border-b border-slate-100 gap-2 overflow-x-auto custom-scrollbar">
            {[
              { key: 'All', label: 'All', count: conversations.length, activeClass: 'bg-blue-50 text-blue-600', countClass: 'bg-blue-600 text-white' },
              { key: 'Unread', label: 'Unread', count: unreadCount, activeClass: 'bg-rose-50 text-rose-600 border border-rose-100', countClass: 'bg-rose-500 text-white' },
              { key: 'Groups', label: 'Groups', count: groupsCount, activeClass: 'bg-slate-100 text-slate-800 border border-slate-200', countClass: 'bg-slate-800 text-white' },
            ].map(({ key, label, count, activeClass, countClass }) => (
              <button key={key} onClick={() => setFilterTab(key)}
                className={`px-3 py-1 text-[10px] font-bold rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  filterTab === key ? activeClass : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}>
                {label}
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] transition-colors ${
                  filterTab === key ? countClass : 'bg-slate-200 text-slate-700'
                }`}>{count}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredConversations.length > 0 ? filteredConversations.map(conv => (
              <div key={conv.id} onClick={() => setSelectedConvId(conv.id)}
                className={`p-4 border-b border-slate-50 cursor-pointer flex gap-3 relative transition-colors ${
                  selectedConvId === conv.id ? 'border-l-4 border-blue-600 bg-blue-50/50' : 'hover:bg-slate-50'
                }`}>
                <div className="relative shrink-0">
                  {conv.type === 'group' ? (
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      selectedConvId === conv.id ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <Users size={16} />
                    </div>
                  ) : (
                    <>
                      <img src={`https://ui-avatars.com/api/?name=${conv.name.replace(' ', '+')}&background=f1f5f9`}
                        alt="User" className="w-10 h-10 rounded-full border border-slate-200" />
                      {selectedConvId === conv.id && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`text-[11px] font-bold truncate ${selectedConvId === conv.id ? 'text-slate-900' : 'text-slate-800'}`}>{conv.name}</h3>
                    <span className={`text-[9px] font-semibold ${selectedConvId === conv.id ? 'text-blue-600' : 'text-slate-400'}`}>{conv.time}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {conv.loadId && <span className="text-[9px] font-bold text-slate-500">{conv.loadId}</span>}
                    {conv.status && (
                      <span className={`text-[8px] font-bold text-${conv.statusColor}-600 bg-${conv.statusColor}-50 px-1 py-0.5 rounded border border-${conv.statusColor}-100`}>
                        {conv.status}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] truncate ${selectedConvId === conv.id || conv.unreadCount > 0 ? 'text-slate-600 font-semibold' : 'text-slate-500'}`}>
                    {conv.messages[conv.messages.length - 1]?.text || 'No messages'}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            )) : (
              <div className="p-8 text-center text-slate-500 text-xs">No conversations found.</div>
            )}
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-center">
            <button className="text-[10px] font-bold text-slate-500 flex items-center gap-1 hover:text-slate-700">
              <History size={12} /> View archived conversations
            </button>
          </div>
        </div>

        {/* Middle Column: Chat Window */}
        <div className="flex-1 flex flex-col bg-white min-h-[500px] lg:min-h-0">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
              {selectedConversation.type === 'group' ? (
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  <Users size={16} />
                </div>
              ) : (
                <img src={`https://ui-avatars.com/api/?name=${selectedConversation.name.replace(' ', '+')}&background=f1f5f9`}
                  alt={selectedConversation.name} className="w-10 h-10 rounded-full border border-slate-200" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">{selectedConversation.name}</h2>
                  {selectedConversation.status && (
                    <span className={`text-[9px] font-bold text-${selectedConversation.statusColor}-600 bg-${selectedConversation.statusColor}-50 px-1.5 py-0.5 rounded border border-${selectedConversation.statusColor}-100`}>
                      {selectedConversation.status}
                    </span>
                  )}
                </div>
                {selectedConversation.loadId && (
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {selectedConversation.loadId} {selectedConversation.currentLoad ? `• ${selectedConversation.currentLoad.vehicle}` : ''}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button title="Call" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"><Phone size={14} /></button>
              <button title="Video" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"><Video size={14} /></button>
              <button title="Info" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"><Info size={14} /></button>
              <button title="More" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all"><MoreVertical size={14} /></button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
            {selectedConversation.messages.map((msg, index) => {
              const showDate = index === 0 || selectedConversation.messages[index - 1].dateGroup !== msg.dateGroup;
              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center mb-6">
                      <span className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">{msg.dateGroup}</span>
                    </div>
                  )}
                  {msg.type === 'incoming' ? (
                    <div className="flex items-start gap-3 mb-6">
                      {selectedConversation.type === 'group' ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 mt-1"><User size={12} /></div>
                      ) : (
                        <img src={`https://ui-avatars.com/api/?name=${selectedConversation.name.replace(' ', '+')}&background=f1f5f9`}
                          alt={selectedConversation.name} className="w-8 h-8 rounded-full border border-slate-200 mt-1" />
                      )}
                      <div>
                        {selectedConversation.type === 'group' && <span className="text-[10px] font-bold text-slate-500 mb-1 block">{msg.senderId}</span>}
                        <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-sm max-w-[400px]">
                          <p className={`text-xs ${msg.isUnread ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>{msg.text}</p>
                        </div>
                        <span className="text-[9px] font-medium text-slate-400 mt-1.5 ml-1 block">{msg.time}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end mb-6">
                      <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[400px]">
                        <p className="text-xs text-white">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1.5 mr-1">
                        <span className="text-[9px] font-medium text-slate-400">{msg.time}</span>
                        {msg.status === 'read' ? <CheckCheck size={12} className="text-blue-500" /> : <Check size={12} className="text-slate-400" />}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <textarea
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                className="w-full h-16 p-3 text-xs text-slate-700 resize-none focus:outline-none"
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)" />
              <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 flex justify-between items-center">
                <div className="flex gap-1">
                  {[
                    { icon: Paperclip, title: 'Attach file' },
                    { icon: ImageIcon, title: 'Attach image' },
                    { icon: FileText, title: 'Attach document' },
                    { icon: MapPin, title: 'Attach location' },
                  ].map(({ icon: Icon, title }) => (
                    <button key={title} title={title}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      <Icon size={15} />
                    </button>
                  ))}
                </div>
                <button onClick={handleSendMessage}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 shadow-sm transition-colors">
                  <Send size={13} /> Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Conversation Details */}
        <div className="w-full lg:w-[300px] bg-white lg:border-l border-t lg:border-t-0 border-slate-200 flex flex-col flex-shrink-0 min-h-[400px] lg:min-h-0">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900">Conversation Details</h2>
            <button className="text-slate-400 hover:text-slate-600 transition-colors"><X size={16} /></button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
            {/* Profile */}
            <div className="flex items-center gap-3">
              {selectedConversation.type === 'group' ? (
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-600 border-2 border-white shadow-sm">
                  <Users size={18} />
                </div>
              ) : (
                <img src={`https://ui-avatars.com/api/?name=${selectedConversation.name.replace(' ', '+')}&background=f1f5f9`}
                  alt={selectedConversation.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
              )}
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-bold text-slate-900">{selectedConversation.name}</h3>
                  {selectedConversation.status && (
                    <span className={`text-[9px] font-bold text-${selectedConversation.statusColor}-600 bg-${selectedConversation.statusColor}-50 px-1.5 py-0.5 rounded border border-${selectedConversation.statusColor}-100`}>
                      {selectedConversation.status}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {selectedConversation.type === 'group' ? `${selectedConversation.memberCount || '—'} Members` : 'Car Carrier Driver'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-2 border-b border-slate-100 pb-5">
              {[
                { icon: Phone, label: 'Call' },
                { icon: Video, label: 'Video' },
                { icon: MapPin, label: 'View Load' },
                { icon: BellOff, label: 'Mute' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group">
                  <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                    <Icon size={15} />
                  </div>
                  <span className="text-[9px] font-semibold leading-tight text-center">{label}</span>
                </button>
              ))}
            </div>

            {/* Current Load */}
            {selectedConversation.currentLoad && (
              <div className="border-b border-slate-100 pb-5">
                <h4 className="text-[11px] font-bold text-slate-900 mb-3">Current Load</h4>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-800">{selectedConversation.currentLoad.id}</span>
                    <span className={`text-[9px] font-bold text-${selectedConversation.currentLoad.statusColor}-600 bg-${selectedConversation.currentLoad.statusColor}-50 px-1.5 py-0.5 rounded border border-${selectedConversation.currentLoad.statusColor}-100`}>
                      {selectedConversation.currentLoad.status}
                    </span>
                  </div>
                  <button className="text-blue-600 text-[10px] font-semibold hover:underline">View <ChevronRight size={10} className="inline" /></button>
                </div>
                <p className="text-[11px] text-slate-600 mb-3 flex items-center gap-1.5"><MapPin size={11} className="text-slate-400" /> {selectedConversation.currentLoad.route}</p>
                <div className="space-y-1.5 text-[10px] mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Required Date</span>
                    <span className="text-slate-800 font-semibold">{selectedConversation.currentLoad.reqDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle</span>
                    <span className="text-slate-800 font-semibold">{selectedConversation.currentLoad.vehicle}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-1.5">
                    <span>Progress</span><span>{selectedConversation.currentLoad.progress}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Driver Info */}
            {selectedConversation.driverInfo && (
              <div className="border-b border-slate-100 pb-5">
                <h4 className="text-[11px] font-bold text-slate-900 mb-3">Driver Info</h4>
                <div className="space-y-2 text-[10px]">
                  {[
                    { label: 'Mobile', val: selectedConversation.driverInfo.mobile },
                    { label: 'Email', val: selectedConversation.driverInfo.email },
                    { label: 'Employee ID', val: selectedConversation.driverInfo.empId },
                    { label: 'License', val: selectedConversation.driverInfo.license },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-slate-500 font-medium">{label}</span>
                      <span className="text-slate-800 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="border-b border-slate-100 pb-5">
              <h4 className="text-[11px] font-bold text-slate-900 mb-3">Quick Actions</h4>
              <div className="space-y-1">
                {[
                  { icon: MapPin, label: 'Track on Map', color: 'text-blue-600', hover: 'hover:bg-blue-50' },
                  { icon: Clock, label: 'View GPS History', color: 'text-slate-400', hover: 'hover:bg-slate-50' },
                  { icon: Navigation, label: 'Send Location Request', color: 'text-blue-600', hover: 'hover:bg-blue-50' },
                  { icon: Archive, label: 'Archive Conversation', color: 'text-slate-400', hover: 'hover:bg-slate-50' },
                  { icon: AlertCircle, label: 'Escalate to Supervisor', color: 'text-rose-500', hover: 'hover:bg-rose-50', textColor: 'text-rose-700' },
                ].map(({ icon: Icon, label, color, hover, textColor }) => (
                  <button key={label}
                    className={`w-full flex items-center gap-2 p-2 ${hover} rounded-lg text-[11px] font-semibold ${textColor || 'text-slate-700'} transition-colors`}>
                    <Icon size={13} className={color} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shared Files */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 mb-3">Shared Files</h4>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600"><FileText size={15} /></div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Delivery_Instruction.pdf</p>
                    <p className="text-[9px] text-slate-500">250 KB · 21 May 2026</p>
                  </div>
                </div>
                <Download size={13} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes modalPop{from{opacity:0;transform:scale(.93) translateY(18px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}
