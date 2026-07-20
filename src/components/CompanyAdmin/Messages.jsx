import React, { useState, useRef, useEffect } from 'react';
import { 
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Send
} from 'lucide-react';

export default function Messages() {
  const [activeContactId, setActiveContactId] = useState(2);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const [chats, setChats] = useState({
    1: [
      { id: 1, text: 'New load L-12548 assigned to you.', time: '09:15 AM', sender: 'DT' },
      { id: 2, text: 'Please confirm receipt.', time: '09:16 AM', sender: 'DT' }
    ],
    2: [
      { id: 1, text: 'I have arrived at the Melbourne terminal.', time: '10:15 AM', sender: 'JD' },
      { id: 2, text: 'Great. Head to bay 4 for unloading.', time: '10:18 AM', sender: 'ME' },
      { id: 3, text: 'At delivery location, waiting for gate access.', time: '10:24 AM', sender: 'JD' }
    ],
    3: [
      { id: 1, text: 'Can you confirm pickup time window?', time: '08:47 AM', sender: 'MT' }
    ],
    4: [
      { id: 1, text: 'Invoice INV-3021 has been generated.', time: 'Yesterday', sender: 'CS' }
    ]
  });

  const allContacts = [
    { id: 1, name: 'Dispatch Team', time: '09:15 AM', message: 'New load L-12548 assigned to you.', badge: 1 },
    { id: 2, name: 'John D. (Driver)', time: '10:24 AM', message: 'At delivery location, waiting for g...', badge: 2 },
    { id: 3, name: 'Mike T.', time: '08:47 AM', message: 'Can you confirm pickup time win...', badge: 3 },
    { id: 4, name: 'Customer Support', time: 'Yesterday', message: 'Invoice INV-3021 has been gener...', badge: null }
  ];

  const getInitials = (name) => {
    return name
      .split(' ')
      .filter(n => n.length > 0 && n[0] !== '(')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const activeContact = allContacts.find(c => c.id === activeContactId) || allContacts[1];
  const activeContactInitials = getInitials(activeContact.name);
  const currentMessages = chats[activeContactId] || [];

  const filteredContacts = allContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, activeContactId]);

  const handleContactClick = (contactId) => {
    setActiveContactId(contactId);
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: containerRef.current.scrollWidth,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  const handleBackToList = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleSend = () => {
    const userText = inputValue.trim();
    if (!userText) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: Date.now(),
      text: userText,
      time: timeString,
      sender: 'ME'
    };
    
    setChats(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg]
    }));
    setInputValue('');

    setTimeout(() => {
      const responseNow = new Date();
      const responseTimeString = responseNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const lowerText = userText.toLowerCase();
      let replyText = "Roger that. Standing by for further instructions.";

      if (lowerText.includes('hi') || lowerText.includes('hello')) {
        replyText = "Hello! How can I help you today?";
      } else if (lowerText.includes('where') || lowerText.includes('location')) {
        replyText = "I am currently approaching the destination, about 5 minutes away.";
      } else if (lowerText.includes('delay') || lowerText.includes('late')) {
        replyText = "Traffic is a bit heavy, I might be delayed by a few minutes. Sorry about that!";
      } else if (lowerText.includes('gate') || lowerText.includes('code') || lowerText.includes('access')) {
        replyText = "I am at the gate right now. Can you confirm the access code?";
      } else if (lowerText.includes('ok') || lowerText.includes('thanks') || lowerText.includes('great')) {
        replyText = "You're welcome! Let me know if you need anything else.";
      } else if (lowerText.includes('yes') || lowerText.includes('sure') || lowerText.includes('yeah')) {
        replyText = "Perfect, I'll proceed with that.";
      } else if (lowerText.includes('no') || lowerText.includes('wait') || lowerText.includes('stop')) {
        replyText = "Understood. I will hold my position and wait for your go-ahead.";
      } else if (lowerText.includes('help') || lowerText.includes('issue') || lowerText.includes('problem')) {
        replyText = "What seems to be the problem? I'll do my best to assist.";
      }

      const responseMsg = {
        id: Date.now() + 1,
        text: replyText,
        time: responseTimeString,
        sender: activeContactInitials
      };

      setChats(prev => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), responseMsg]
      }));
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto bg-[#FAFAFA] min-h-screen text-left flex flex-col font-sans">
        
        {/* Header */}
        <div className="mb-6">
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none mb-1">Messages</h1>
            <p className="text-gray-500 text-[13px]">Unified communication for dispatch, drivers, and customers</p>
        </div>

        {/* Main Content Area */}
        <div ref={containerRef} className="flex flex-row flex-nowrap gap-4 lg:gap-6 h-[calc(100vh-140px)] min-h-[500px] overflow-x-auto custom-scrollbar w-full pb-2 snap-x snap-mandatory scroll-smooth">
           
           {/* Sidebar (Contacts) */}
           <div className="w-[calc(100vw-32px)] sm:w-[calc(100vw-48px)] lg:w-[320px] shrink-0 flex flex-col bg-transparent snap-start">
              
              {/* Search */}
              <div className="relative mb-6">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
                  <input 
                     type="text" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search messages..." 
                     className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFD400] placeholder-gray-400"
                  />
              </div>

              {/* Contact List */}
              <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-grow pr-1">
                  {filteredContacts.map(contact => {
                    const isActive = contact.id === activeContactId;
                    return (
                      <div 
                        key={contact.id} 
                        onClick={() => handleContactClick(contact.id)}
                        className={`flex flex-col p-4 rounded-xl cursor-pointer transition-colors border ${isActive ? 'bg-white shadow-sm border-gray-100 relative' : 'bg-transparent hover:bg-white border-transparent hover:border-gray-100'}`}
                      >
                         {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFD400] rounded-r-md"></div>}
                         <div className={`flex justify-between items-center mb-1 ${isActive ? 'pl-2' : ''}`}>
                            <span className="text-[13px] font-bold text-gray-900">{contact.name}</span>
                            <span className={`text-[10px] ${isActive ? 'font-bold text-gray-900' : 'font-semibold text-gray-400'}`}>{contact.time}</span>
                         </div>
                         <div className={`flex justify-between items-center ${isActive ? 'pl-2' : ''}`}>
                            <span className={`text-[12px] font-medium ${isActive ? 'text-gray-500' : 'text-gray-400'} truncate pr-4`}>{contact.message}</span>
                            {contact.badge && (
                              <div className="w-4 h-4 rounded-full bg-[#F44336] flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">{contact.badge}</div>
                            )}
                         </div>
                      </div>
                    );
                  })}
                  {filteredContacts.length === 0 && (
                     <div className="text-center p-4 text-[12px] text-gray-400 font-medium">No results found</div>
                  )}
              </div>

           </div>

           {/* Main Chat Area */}
           <div className="w-[calc(100vw-32px)] sm:w-[calc(100vw-48px)] lg:w-auto lg:flex-grow bg-white border border-gray-100 rounded-3xl flex flex-col shadow-sm overflow-hidden shrink-0 lg:shrink snap-start">
               
               {/* Chat Header */}
               <div className="px-5 sm:px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                  <div className="flex items-center gap-3">
                     <button 
                       onClick={handleBackToList} 
                       className="lg:hidden text-gray-500 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-50 shrink-0 cursor-pointer mr-1"
                     >
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                     </button>
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[13px] font-bold text-blue-600 flex-shrink-0">
                        {activeContactInitials}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-gray-900 leading-tight">{activeContact.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#00D47E]"></div>
                           <span className="text-[11px] font-bold text-[#00D47E]">Online</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 text-gray-400">
                     <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors cursor-pointer">
                        <Phone size={16} strokeWidth={2.5} />
                     </button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors cursor-pointer">
                        <Video size={16} strokeWidth={2.5} />
                     </button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors cursor-pointer">
                        <MoreVertical size={16} strokeWidth={2.5} />
                     </button>
                  </div>
               </div>

               {/* Chat Messages */}
               <div className="flex-grow p-5 sm:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar bg-white">
                  
                  {/* Date Divider */}
                  <div className="flex justify-center my-2">
                     <span className="px-4 py-1.5 border border-gray-100 rounded-full text-[9px] font-bold text-gray-400 uppercase tracking-wider bg-white">Today</span>
                  </div>

                  {currentMessages.map((msg) => {
                    const isMe = msg.sender === 'ME';
                    return (
                      isMe ? (
                        <div key={msg.id} className="flex gap-3 sm:gap-4 max-w-[85%] sm:max-w-[80%] self-end flex-row-reverse">
                           <div className="w-8 h-8 rounded-full bg-[#FFD400] flex items-center justify-center text-[10px] font-bold text-black flex-shrink-0 mt-1">
                              ME
                           </div>
                           <div className="flex flex-col gap-1.5 items-end">
                              <div className="px-4 py-2.5 bg-[#F8FAFC] border border-gray-100 rounded-2xl rounded-tr-sm shadow-xs">
                                 <p className="text-[13px] font-medium text-gray-700 leading-relaxed text-left">{msg.text}</p>
                              </div>
                              <span className="text-[9px] font-bold text-gray-400 mr-1">{msg.time}</span>
                           </div>
                        </div>
                      ) : (
                        <div key={msg.id} className="flex gap-3 sm:gap-4 max-w-[85%] sm:max-w-[80%]">
                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 flex-shrink-0 mt-1">
                              {msg.sender}
                           </div>
                           <div className="flex flex-col gap-1.5 items-start">
                              <div className="px-4 py-2.5 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-xs">
                                 <p className="text-[13px] font-medium text-gray-700 leading-relaxed">{msg.text}</p>
                              </div>
                              <span className="text-[9px] font-bold text-gray-400 ml-1">{msg.time}</span>
                           </div>
                        </div>
                      )
                    );
                  })}
                  
                  <div ref={messagesEndRef} />
               </div>

               {/* Chat Input */}
               <div className="px-5 sm:px-8 py-4 sm:py-5 border-t border-gray-100 bg-white">
                  <div className="flex items-center gap-3 sm:gap-4">
                     <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0 p-1">
                        <Paperclip size={18} strokeWidth={2.5} />
                     </button>
                     <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..." 
                        className="flex-grow bg-white border border-gray-200 rounded-full px-5 py-3 text-[13px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFD400] placeholder-gray-400"
                     />
                     <button 
                        onClick={handleSend}
                        className="w-10 h-10 bg-[#FFD400] hover:bg-[#F0C800] rounded-full flex items-center justify-center text-black flex-shrink-0 shadow-sm transition-colors cursor-pointer"
                     >
                        <Send size={15} strokeWidth={2.5} />
                     </button>
                  </div>
               </div>

           </div>
        </div>
    </div>
  );
}
