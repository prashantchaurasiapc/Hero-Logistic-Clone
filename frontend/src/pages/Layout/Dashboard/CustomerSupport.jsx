import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  MessageSquare, Ticket, Clock, CheckCircle2, Search, Send, Paperclip,
  Image as ImageIcon, Smile, ChevronRight, Star, Plus, MoreHorizontal,
  ExternalLink, FileText, HelpCircle, Shield, RefreshCw, X, ArrowRight,
  AlertCircle, CheckCircle, Info, Phone, MessageCircle, User, Bot, Headphones,
  Download
} from 'lucide-react';

export default function CustomerSupport() {
  // Toast Notification State
  const [toastMsg, setToastMsg] = useState('');
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Active Selected Conversation State
  const [selectedConvId, setSelectedConvId] = useState(1);
  const [convSearchTerm, setConvSearchTerm] = useState('');
  const [convCategory, setConvCategory] = useState('All Categories');

  const [conversations, setConversations] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [dashboardKpis, setDashboardKpis] = useState({
    unreadMessages: 0,
    openTickets: 0,
    awaitingResponse: 0,
    resolvedTickets: 0
  });

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/warehouse-portal/support/dashboard');
      if (res.data?.data) {
        setConversations(res.data.data.conversations || []);
        setSupportTickets(res.data.data.supportTickets || []);
        setDashboardKpis(res.data.data.kpi || { unreadMessages: 0, openTickets: 0, awaitingResponse: 0, resolvedTickets: 0 });
        if (res.data.data.conversations?.length > 0 && selectedConvId === 1) {
          setSelectedConvId(res.data.data.conversations[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load support dashboard:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Active Chat Message Input State
  const [chatInputText, setChatInputText] = useState('');

  // Handle Send Message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInputText.trim()) return;

    try {
      await api.post('/warehouse-portal/support/message', {
        conversationId: selectedConvId,
        text: chatInputText
      });
      setChatInputText('');
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to send message:', error);
      triggerToast('Error sending message!');
    }
  };



  // Create Ticket Modal State
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Portal Support',
    priority: 'Normal',
    description: ''
  });

  const handleSaveCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject) return;

    try {
      await api.post('/warehouse-portal/support/ticket', {
        subject: ticketForm.subject,
        category: ticketForm.category,
        priority: ticketForm.priority,
        description: ticketForm.description
      });
      setIsCreateTicketModalOpen(false);
      setTicketForm({ subject: '', category: 'Portal Support', priority: 'Normal', description: '' });
      fetchDashboardData();
      triggerToast('Support Ticket created successfully!');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      triggerToast('Error creating ticket!');
    }
  };

  // Quick View Load Modal
  const [isViewLoadModalOpen, setIsViewLoadModalOpen] = useState(false);

  // Default fallback conversation when conversations array is empty or loading
  const defaultConversation = {
    id: 1,
    title: 'Support Team',
    sub: 'Dispatch Support',
    listSub: 'General Support',
    avatar: 'ST',
    bg: 'bg-blue-600',
    time: 'Now',
    dateStarted: new Date().toLocaleDateString('en-GB'),
    lastMessage: 'Welcome to Support. How can we assist you today?',
    unread: 0,
    category: 'Support',
    isBot: false,
    messages: []
  };

  // Safe active conversation with fallback
  const activeConversation = (conversations || []).find(c => c.id === selectedConvId) || conversations[0] || defaultConversation;
  const filteredConversations = (conversations || []).filter(conv => {
    const matchesSearch = (conv.title || '').toLowerCase().includes(convSearchTerm.toLowerCase()) ||
                          (conv.sub || '').toLowerCase().includes(convSearchTerm.toLowerCase()) ||
                          (conv.lastMessage || '').toLowerCase().includes(convSearchTerm.toLowerCase());
    const matchesCategory = convCategory === 'All Categories' || convCategory === 'All' || conv.category === convCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-800 text-left font-sans p-4 sm:p-6 space-y-6">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[999999] bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl animate-fade-in border border-slate-700 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
         HEADER & TOP BREADCRUMBS
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1">
            <span>Home</span>
            <ChevronRight size={10} />
            <span>Customer Portal</span>
            <ChevronRight size={10} />
            <span className="text-slate-700 font-extrabold">Messages & Support</span>
          </div>

          {/* Title & Bookmark */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Messages & Support
            </h1>
            <button 
              onClick={() => triggerToast("Page bookmarked!")}
              className="p-1 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <Star size={16} />
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Communicate with our team and get help when you need it.
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => { setSelectedConvId(1); triggerToast("Chat focused on Dispatch Team"); }}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare size={14} className="text-blue-600" />
            <span>Message Dispatch</span>
          </button>

          <button 
            onClick={() => setIsCreateTicketModalOpen(true)}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} />
            <span>Create Support Ticket</span>
          </button>

          <button 
            onClick={() => triggerToast("More actions menu opened.")}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 rounded-xl shadow-2xs cursor-pointer flex items-center gap-1 transition-colors"
          >
            <span>More Actions</span>
            <span className="text-[10px]">▼</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
         TOP METRICS CARDS (4 Cards Grid)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Unread Messages */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold shrink-0">
              <MessageSquare size={18} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">UNREAD MESSAGES</span>
              <span className="text-xl font-black text-slate-900 leading-none mt-0.5 block">{dashboardKpis.unreadMessages}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
            <button onClick={() => setSelectedConvId(1)} className="font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer">
              View all messages <ArrowRight size={11} />
            </button>
          </div>
        </div>

        {/* Card 2: Open Tickets */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold shrink-0">
              <Ticket size={18} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">OPEN TICKETS</span>
              <span className="text-xl font-black text-slate-900 leading-none mt-0.5 block">{dashboardKpis.openTickets}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
            <button onClick={() => triggerToast("Viewing your support tickets...")} className="font-extrabold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer">
              View my tickets <ArrowRight size={11} />
            </button>
          </div>
        </div>

        {/* Card 3: Awaiting Response */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">AWAITING RESPONSE</span>
              <span className="text-xl font-black text-slate-900 leading-none mt-0.5 block">{dashboardKpis.awaitingResponse}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
            <button onClick={() => triggerToast("Filtering tickets requiring reply...")} className="font-extrabold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer">
              Requires your reply <ArrowRight size={11} />
            </button>
          </div>
        </div>

        {/* Card 4: Resolved Tickets */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">RESOLVED TICKETS (30 DAYS)</span>
              <span className="text-xl font-black text-slate-900 leading-none mt-0.5 block">{dashboardKpis.resolvedTickets}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
            <button onClick={() => triggerToast("Viewing resolved ticket history...")} className="font-extrabold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer">
              View history <ArrowRight size={11} />
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
         MAIN WORKSPACE GRID (Equal Height Columns: 3 cols, 6 cols [WIDER], 3 cols)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* COLUMN 1 (3 Cols): CONVERSATIONS LIST (Equal Height & Flush Bottom) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 flex flex-col justify-between h-full min-h-[640px]">
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">CONVERSATIONS</h2>
            </div>

            {/* Search bar & Filter dropdown */}
            <div className="space-y-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search conversations..."
                  value={convSearchTerm}
                  onChange={e => setConvSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 font-sans"
                />
              </div>
              <select
                value={convCategory}
                onChange={e => setConvCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-400 cursor-pointer font-sans"
              >
                <option value="All Categories">All Categories</option>
                <option value="Dispatch">Dispatch</option>
                <option value="Support">Support</option>
                <option value="Accounts">Accounts</option>
              </select>
            </div>

            {/* Conversations Items List */}
            <div className="space-y-1 overflow-y-auto max-h-[460px] pr-0.5">
              {filteredConversations.length === 0 ? (
                <p className="py-6 text-center text-slate-400 text-xs font-semibold">No conversations found.</p>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === selectedConvId;
                  return (
                    <div 
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all relative overflow-hidden ${
                        isSelected 
                          ? 'bg-blue-50/70 border-blue-200 shadow-2xs border-l-4 border-l-blue-600' 
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full ${conv.bg} text-white font-extrabold text-[9.5px] flex items-center justify-center shrink-0`}>
                            {conv.avatar}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 text-xs block leading-tight">{conv.title}</span>
                            <span className="text-[9.5px] text-slate-500 font-medium block truncate max-w-[120px]">{conv.listSub || conv.sub}</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 shrink-0">{conv.time}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-1 pl-9">
                        <span className="text-[10.5px] text-slate-600 font-medium truncate block">{conv.lastMessage}</span>
                        {conv.unread > 0 && (
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-extrabold text-[9px] flex items-center justify-center shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Pagination (Flush at Bottom) */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-3 border-t border-slate-100 mt-2">
            <span>Showing 1 to {filteredConversations.length} of {conversations.length}</span>
            <div className="flex items-center gap-1">
              <button className="px-1.5 py-0.5 border border-slate-200 rounded text-slate-500 hover:bg-slate-50">&lt;</button>
              <button className="px-2 py-0.5 bg-blue-600 text-white font-bold rounded">1</button>
              <button className="px-1.5 py-0.5 border border-slate-200 rounded text-slate-500 hover:bg-slate-50">&gt;</button>
            </div>
          </div>

        </div>

        {/* COLUMN 2 (6 Cols): ACTIVE CHAT THREAD WORKSPACE (WIDER WIDTH 6 COLS & FLUSH BOTTOM) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col justify-between h-full min-h-[640px] text-left overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {activeConversation?.isBot ? <Headphones size={16} /> : (activeConversation?.avatar || 'ST')}
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 leading-tight">{activeConversation?.title || 'Support Team'}</h3>
                <p className="text-[10px] text-slate-500 font-medium">{activeConversation?.sub || ''}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9.5px] text-slate-400 font-medium hidden sm:inline">
                Conversation started {activeConversation?.dateStarted || ''}
              </span>
              <button 
                onClick={() => setIsViewLoadModalOpen(true)}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-[10.5px] rounded-lg cursor-pointer transition-colors shadow-2xs"
              >
                View Load
              </button>
              <button 
                onClick={() => triggerToast("Conversation menu opened")}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#FAFAFA] min-h-[380px]">
            
            {/* Date Divider */}
            <div className="flex items-center justify-center">
              <span className="px-3 py-0.5 bg-slate-200/60 text-slate-500 text-[9.5px] font-extrabold rounded-full">
                29 May 2025
              </span>
            </div>

            {/* Render Chat Messages */}
            {(activeConversation?.messages || []).map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                {!msg.isMe && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                    DT
                  </div>
                )}

                <div className={`max-w-[78%] p-3 rounded-2xl text-xs font-medium space-y-1 ${
                  msg.isMe 
                    ? 'bg-[#EFF6FF] text-blue-950 rounded-tr-xs border border-blue-100 shadow-2xs' 
                    : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-2xs'
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1 text-[9px] font-bold ${msg.isMe ? 'justify-end text-blue-400' : 'text-slate-400'}`}>
                    <span>{msg.time}</span>
                    {msg.isMe && <span className="text-blue-600">✓✓</span>}
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* Chat Input Toolbar Footer (Flush at Bottom) */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white space-y-2">
            <textarea 
              rows={2}
              placeholder="Type your message..."
              value={chatInputText}
              onChange={e => setChatInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="w-full p-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none font-sans"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-slate-400">
                <button type="button" onClick={() => triggerToast("File attachment clicked")} className="p-1 hover:text-slate-600 rounded cursor-pointer">
                  <Paperclip size={15} />
                </button>
                <button type="button" onClick={() => triggerToast("Image upload clicked")} className="p-1 hover:text-slate-600 rounded cursor-pointer">
                  <ImageIcon size={15} />
                </button>
                <button type="button" onClick={() => triggerToast("Emoji picker clicked")} className="p-1 hover:text-slate-600 rounded cursor-pointer">
                  <Smile size={15} />
                </button>
              </div>

              <button 
                type="submit"
                className="px-5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <span>Send</span>
                <Send size={12} />
              </button>
            </div>
          </form>

        </div>

        {/* COLUMN 3 (3 Cols): SIDE CARDS (Contact Dispatch, Support Tickets, Help Resources) */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full min-h-[640px] space-y-3.5">
          
          {/* CARD 1: CONTACT DISPATCH */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">CONTACT DISPATCH</h2>
            </div>
            
            <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed">
              For load updates, changes or urgent matters, message our dispatch team directly.
            </p>

            <button 
              onClick={() => { setSelectedConvId(1); triggerToast("Chat window focused on Dispatch Team"); }}
              className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare size={14} />
              <span>Message Dispatch</span>
            </button>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium pt-0.5">
              <Clock size={12} className="text-slate-400 shrink-0" />
              <span>Expected response time: Usually within 15 mins during work hours.</span>
            </div>
          </div>

          {/* CARD 2: MY SUPPORT TICKETS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">MY SUPPORT TICKETS</h2>
              <button onClick={() => triggerToast("Viewing all support tickets")} className="text-[10.5px] font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-0.5">
                View all tickets <ArrowRight size={10} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {supportTickets.map((tkt) => (
                <div key={tkt.id} className="p-2 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all flex items-start justify-between gap-1.5">
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-mono font-extrabold text-slate-400 block">{tkt.id}</span>
                    <span className="font-extrabold text-slate-900 block leading-tight text-[11px]">{tkt.title}</span>
                    <span className="text-[9px] text-slate-400 font-medium block">Created: {tkt.created}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-extrabold shrink-0 ${tkt.statusBg}`}>
                    {tkt.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <button onClick={() => setIsCreateTicketModalOpen(true)} className="font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer">
                + Create new support ticket
              </button>
            </div>
          </div>

          {/* CARD 3: HELP RESOURCES (Flush at Bottom) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">HELP RESOURCES</h2>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { title: 'Customer Portal Guide', desc: 'Step-by-step guide to using the portal', icon: FileText },
                { title: 'FAQs', desc: 'Find answers to common questions', icon: HelpCircle },
                { title: 'How to Track a Load', desc: 'Learn how to track your loads', icon: MessageCircle }
              ].map((res, i) => {
                const IconComponent = res.icon;
                return (
                  <div 
                    key={i} 
                    onClick={() => triggerToast(`Opening article: ${res.title}`)}
                    className="flex items-center justify-between p-2 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent size={14} className="text-blue-600 shrink-0" />
                      <div>
                        <span className="font-extrabold text-slate-900 block leading-tight text-[11px]">{res.title}</span>
                        <span className="text-[9.5px] text-slate-500 font-medium block truncate max-w-[130px]">{res.desc}</span>
                      </div>
                    </div>
                    <Download size={13} className="text-blue-600 shrink-0" />
                  </div>
                );
              })}
            </div>

            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <button onClick={() => triggerToast("Opening help knowledge base...")} className="font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer">
                View all help articles <ArrowRight size={10} />
              </button>
            </div>
          </div>

        </div>

      </div>



      {/* =========================================================================
         CREATE SUPPORT TICKET MODAL
         ========================================================================= */}
      {isCreateTicketModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsCreateTicketModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <Ticket size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Create Support Ticket</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Submit a request to our platform helpdesk</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateTicketModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Heading *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Invoice discrepancy query INV-2025"
                  value={ticketForm.subject}
                  onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option value="Portal Support">Portal Support</option>
                    <option value="Billing & Invoices">Billing & Invoices</option>
                    <option value="Load Tracking">Load Tracking</option>
                    <option value="Technical Issue">Technical Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Problem Description *</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Please provide specific details..."
                  value={ticketForm.description}
                  onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsCreateTicketModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         VIEW LOAD DETAILS QUICK MODAL
         ========================================================================= */}
      {isViewLoadModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsViewLoadModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold">
                  🚚
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Load Details: LD-3987</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">In Transit • Estimated delivery 30 May 2025</p>
                </div>
              </div>
              <button 
                onClick={() => setIsViewLoadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Origin:</span>
                  <span className="text-slate-900">Sydney Terminal WH-1</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Destination:</span>
                  <span className="text-slate-900">Melbourne Depot</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Freight Type:</span>
                  <span className="text-blue-600">Car Carrying (4 Vehicles)</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Driver Assigned:</span>
                  <span className="text-slate-900">Noah Williams (TRK-104)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsViewLoadModalOpen(false)}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
