import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Users, Plus, Phone, Video, Info, Paperclip, Smile, Image as ImageIcon,
  MapPin, Send, MoreVertical, X, Check, CheckCheck, Clock, AlertCircle, FileText, Download, User, Navigation, ChevronRight, Filter, History
} from 'lucide-react';
import { mockConversationsData } from '../../data/mockMessagesData';

export default function CommunicationDepot() {
  const [conversations, setConversations] = useState(mockConversationsData);
  const [selectedConvId, setSelectedConvId] = useState(mockConversationsData[0].id);
  const [filterTab, setFilterTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const chatEndRef = useRef(null);

  const filteredConversations = useMemo(() => {
    let result = conversations;
    
    // Apply tab filter
    if (filterTab === 'Unread') {
      result = result.filter(c => c.unreadCount > 0 || c.messages.some(m => m.isUnread));
    } else if (filterTab === 'Groups') {
      result = result.filter(c => c.type === 'group');
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        (c.loadId && c.loadId.toLowerCase().includes(q))
      );
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
      id: `m-${Date.now()}`,
      senderId: 'me',
      text: newMessageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'outgoing',
      status: 'sent',
      dateGroup: 'Today'
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConvId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));
    
    setNewMessageText('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] w-full text-left font-sans">
      
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
            </select>
          </div>
          
          <div className="flex-1 shrink-0 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages by name, load ID..." 
                className="w-full h-9 pl-9 pr-4 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-[6px] shrink-0 md:ml-auto">
            <button className="h-9 px-4 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm bg-white">
              <Users size={14} /> New Group
            </button>
            <button className="h-9 px-4 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm transition-colors">
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
            <button 
              onClick={() => setFilterTab('All')}
              className={`px-3 py-1 text-[10px] font-bold rounded-full flex items-center gap-1.5 transition-colors ${filterTab === 'All' ? 'bg-blue-50 text-blue-600' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              All <span className={`${filterTab === 'All' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'} w-4 h-4 rounded-full flex items-center justify-center text-[8px] transition-colors`}>{conversations.length}</span>
            </button>
            <button 
              onClick={() => setFilterTab('Unread')}
              className={`px-3 py-1 text-[10px] font-bold rounded-full flex items-center gap-1.5 transition-colors ${filterTab === 'Unread' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              Unread <span className={`${filterTab === 'Unread' ? 'bg-rose-500' : 'bg-rose-500'} text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]`}>{unreadCount}</span>
            </button>
            <button 
              onClick={() => setFilterTab('Groups')}
              className={`px-3 py-1 text-[10px] font-bold rounded-full flex items-center gap-1.5 transition-colors ${filterTab === 'Groups' ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              Groups <span className={`${filterTab === 'Groups' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'} w-4 h-4 rounded-full flex items-center justify-center text-[8px] transition-colors`}>{groupsCount}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredConversations.length > 0 ? filteredConversations.map(conv => (
              <div 
                key={conv.id} 
                onClick={() => setSelectedConvId(conv.id)}
                className={`p-4 border-b border-slate-50 cursor-pointer flex gap-3 relative ${selectedConvId === conv.id ? 'border-l-4 border-blue-600 bg-blue-50/50' : 'hover:bg-slate-50'}`}
              >
                <div className="relative shrink-0">
                  {conv.type === 'group' ? (
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${selectedConvId === conv.id ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      <Users size={16} />
                    </div>
                  ) : (
                    <>
                      <img src={`https://ui-avatars.com/api/?name=${conv.name.replace(' ', '+')}&background=f1f5f9`} alt="User" className="w-10 h-10 rounded-full border border-slate-200" />
                      {selectedConvId === conv.id && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>}
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
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm">{conv.unreadCount}</div>
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
                <img src={`https://ui-avatars.com/api/?name=${selectedConversation.name.replace(' ', '+')}&background=f1f5f9`} alt={selectedConversation.name} className="w-10 h-10 rounded-full border border-slate-200" />
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
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{selectedConversation.loadId} {selectedConversation.currentLoad ? `• ${selectedConversation.currentLoad.vehicle}` : ''}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"><Phone size={14}/></button>
              <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"><Video size={14}/></button>
              <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"><Info size={14}/></button>
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
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 mt-1"><User size={12}/></div>
                      ) : (
                        <img src={`https://ui-avatars.com/api/?name=${selectedConversation.name.replace(' ', '+')}&background=f1f5f9`} alt={selectedConversation.name} className="w-8 h-8 rounded-full border border-slate-200 mt-1" />
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
                      <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[400px]">
                        <p className="text-xs text-blue-900">{msg.text}</p>
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
            <div className="border border-slate-300 rounded-xl bg-white shadow-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <textarea 
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="w-full h-16 p-3 text-xs text-slate-700 resize-none focus:outline-none" 
                placeholder="Type your message..."
              ></textarea>
              <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 flex justify-between items-center">
                <div className="flex gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"><Paperclip size={16} /></button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"><ImageIcon size={16} /></button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"><FileText size={16} /></button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"><MapPin size={16} /></button>
                </div>
                <button 
                  onClick={handleSendMessage}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 shadow-sm"
                >
                  <Send size={14} /> Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Conversation Details */}
        <div className="w-full lg:w-[320px] bg-white lg:border-l border-t lg:border-t-0 border-slate-200 flex flex-col flex-shrink-0 min-h-[400px] lg:min-h-0">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900">Conversation Details</h2>
            <button className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            
            {/* Profile Intro */}
            <div className="flex items-center gap-4">
              {selectedConversation.type === 'group' ? (
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 text-slate-600 border-2 border-white shadow-sm">
                  <Users size={20} />
                </div>
              ) : (
                <img src={`https://ui-avatars.com/api/?name=${selectedConversation.name.replace(' ', '+')}&background=f1f5f9`} alt={selectedConversation.name} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-900">{selectedConversation.name}</h3>
                  {selectedConversation.status && (
                    <span className={`text-[9px] font-bold text-${selectedConversation.statusColor}-600 bg-${selectedConversation.statusColor}-50 px-1.5 py-0.5 rounded border border-${selectedConversation.statusColor}-100`}>
                      {selectedConversation.status}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {selectedConversation.type === 'group' ? `${selectedConversation.memberCount} Members` : 'Car Carrier Driver'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-2 border-b border-slate-100 pb-6">
              <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group">
                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50"><Phone size={16} /></div>
                <span className="text-[10px] font-semibold">Call</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group">
                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50"><Video size={16} /></div>
                <span className="text-[10px] font-semibold">Message</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group">
                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50"><MapPin size={16} /></div>
                <span className="text-[10px] font-semibold text-center leading-tight">View Load</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group">
                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50"><MoreVertical size={16} /></div>
                <span className="text-[10px] font-semibold">More</span>
              </button>
            </div>

            {/* Current Load */}
            {selectedConversation.currentLoad && (
              <div className="border-b border-slate-100 pb-6">
                <h4 className="text-[11px] font-bold text-slate-900 mb-3">Current Load</h4>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-800">{selectedConversation.currentLoad.id}</span>
                    <span className={`text-[9px] font-bold text-${selectedConversation.currentLoad.statusColor}-600 bg-${selectedConversation.currentLoad.statusColor}-50 px-1.5 py-0.5 rounded border border-${selectedConversation.currentLoad.statusColor}-100`}>
                      {selectedConversation.currentLoad.status}
                    </span>
                  </div>
                  <button className="text-blue-600 text-[10px] font-semibold hover:underline">View Load <ChevronRight size={10} className="inline"/></button>
                </div>
                <p className="text-[11px] text-slate-600 mb-3 flex items-center gap-1.5"><MapPin size={12} className="text-slate-400"/> {selectedConversation.currentLoad.route}</p>
                
                <div className="space-y-2 text-[10px] mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Required Date</span>
                    <span className="text-slate-800 font-semibold">{selectedConversation.currentLoad.reqDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Vehicle / Trailer</span>
                    <span className="text-slate-800 font-semibold">{selectedConversation.currentLoad.vehicle}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-1.5">
                    <span>Progress</span>
                    <span>{selectedConversation.currentLoad.progress}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Driver Info */}
            {selectedConversation.driverInfo && (
              <div className="border-b border-slate-100 pb-6">
                <h4 className="text-[11px] font-bold text-slate-900 mb-3">Driver Info</h4>
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Mobile</span>
                    <span className="text-slate-800 font-semibold">{selectedConversation.driverInfo.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Email</span>
                    <span className="text-slate-800 font-semibold">{selectedConversation.driverInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Employee ID</span>
                    <span className="text-slate-800 font-semibold">{selectedConversation.driverInfo.empId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">License</span>
                    <span className="text-slate-800 font-semibold">{selectedConversation.driverInfo.license}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="border-b border-slate-100 pb-6">
              <h4 className="text-[11px] font-bold text-slate-900 mb-3">Quick Actions</h4>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors">
                  <MapPin size={14} className="text-blue-600"/> Track on Map
                </button>
                <button className="w-full flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors">
                  <Clock size={14} className="text-slate-400"/> View GPS History
                </button>
                <button className="w-full flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors">
                  <Navigation size={14} className="text-blue-600"/> Send Location Request
                </button>
                <button className="w-full flex items-center gap-2 p-2 hover:bg-rose-50 text-rose-700 rounded-lg text-[11px] font-semibold transition-colors">
                  <AlertCircle size={14}/> Escalate to Supervisor
                </button>
              </div>
            </div>

            {/* Shared Files */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-900 mb-3">Shared Files</h4>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Delivery_Instruction.pdf</p>
                    <p className="text-[9px] text-slate-500">250 KB • 21 May 2026</p>
                  </div>
                </div>
                <Download size={14} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}
