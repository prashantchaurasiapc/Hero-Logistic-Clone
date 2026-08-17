import React, { useState, useMemo, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  ChevronRight,
  ChevronDown,
  Shield,
  HelpCircle,
  RefreshCw,
  MailCheck,
  Plus,
  MessageSquare,
  CheckCircle,
  Clock,
  Megaphone,
  Send,
  Activity,
  X,
  Filter,
  Calendar,
  Users,
  FileText,
  SlidersHorizontal,
  Building2,
  Check,
  Pin,
  Inbox,
  MessageCircle,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  UserCheck,
  Sparkles,
  TrendingUp,
  BarChart3,
  SendHorizontal,
  Truck,
  Wrench,
  Mail,
  Eye,
  CheckCircle2,
  FolderKanban,
  Bot,
  Bell,
  Star,
  Download,
  Info,
  Smile,
  CheckCheck,
  Image as ImageIcon,
  Trash2,
  VolumeX,
  UserPlus,
  MapPin,
  FileCheck,
  Share2,
  ExternalLink,
  Edit,
  CheckSquare,
  XSquare,
  AlertTriangle,
  AlertOctagon,
  PieChart,
  Settings,
  CalendarDays,
  Cpu,
  Layers,
  BookOpen,
  PlayCircle,
  Zap,
  Library,
  ToggleLeft,
  ListChecks,
  Power,
  Globe
} from 'lucide-react';

export default function Messages() {
  const { user } = useAuth();
  // Navigation & Category Routing State
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedParticipant, setSelectedParticipant] = useState('All Participants');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('01 May 2025 - 31 May 2025');

  // Conversations Sub-tab state
  const [conversationSubTab, setConversationSubTab] = useState('All');

  // Customer Communications Sub-tab state
  const [customerSubTab, setCustomerSubTab] = useState('All');

  // Templates & Automation State
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedTemplateType, setSelectedTemplateType] = useState('All Template Types');
  const [selectedTemplateChannel, setSelectedTemplateChannel] = useState('All Channels');
  const [selectedTemplateStatus, setSelectedTemplateStatus] = useState('All Status');
  const [selectedTemplateCategoryFilter, setSelectedTemplateCategoryFilter] = useState('All Categories');
  const [activeTemplateCategory, setActiveTemplateCategory] = useState(1);
  const [selectedPreviewTemplate, setSelectedPreviewTemplate] = useState('Delivery Notification - ETA Update');
  const [openInsertVariable, setOpenInsertVariable] = useState(false);

  // Dropdown States
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
  const [openParticipantDropdown, setOpenParticipantDropdown] = useState(false);
  const [openBranchDropdown, setOpenBranchDropdown] = useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const [openMoreActions, setOpenMoreActions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modal States
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showNewCommunicationModal, setShowNewCommunicationModal] = useState(false);
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showTemplateLibraryModal, setShowTemplateLibraryModal] = useState(false);
  const [starredContacts, setStarredContacts] = useState({});

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMarkAllRead = () => {
    setContactsList(prev => prev.map(c => ({ ...c, badge: null })));
    setCustomerList(prev => prev.map(c => ({ ...c, badge: null })));
    showToast('All messages marked as read!');
  };

  const handleToggleStar = () => {
    setStarredContacts(prev => {
      const isStarred = !prev[activeContactId];
      showToast(isStarred ? `Starred conversation with ${activeContact.name}` : `Unstarred conversation`);
      return { ...prev, [activeContactId]: isStarred };
    });
  };

  // Contacts List for 12.2 Conversations Page
  const [contactsList, setContactsList] = useState([]);

  // Active Selected Contact in 12.2 Conversations
  const [activeContactId, setActiveContactId] = useState(null);
  const activeContact = useMemo(() => {
    const found = contactsList.find(c => c.id === activeContactId) || contactsList[0];
    return found || { id: null, name: '', role: '', initials: '?', avatarImg: null, avatarBg: 'bg-slate-100 text-slate-400 border border-slate-200', preview: '', time: '', badge: null, online: false, type: 'Direct' };
  }, [contactsList, activeContactId]);

  // Customer List for 12.3 Customer Communications
  const [customerList, setCustomerList] = useState([]);

  // Active Selected Customer in 12.3 Customer Communications
  const [activeCustomerId, setActiveCustomerId] = useState(1);
  const activeCustomer = useMemo(() => {
    const found = customerList.find(c => c.id === activeCustomerId) || customerList[0];
    return found || { id: null, name: '', initials: '?', avatarBg: 'bg-slate-100 text-slate-400 border border-slate-200', email: '', phone: '', address: '', type: 'Emails', status: 'Active', preview: '', time: '', badge: null };
  }, [customerList, activeCustomerId]);

  // Broadcast Categories for 12.4 Broadcasts & Notifications
  const broadcastCategories = [
    { id: 1, title: 'Company Announcements', count: 0, desc: 'General company updates and news', icon: Megaphone, bg: 'bg-[#EEF2FF] text-[#4338CA]' },
    { id: 2, title: 'Branch Announcements', count: 0, desc: 'Branch specific updates and information', icon: Building2, bg: 'bg-[#DCFCE7] text-[#16A34A]' },
    { id: 3, title: 'Driver Alerts', count: 0, desc: 'Alerts and important updates for drivers', icon: AlertTriangle, bg: 'bg-[#FFEDD5] text-[#EA580C]' },
    { id: 4, title: 'Maintenance Alerts', count: 0, desc: 'Vehicle and asset maintenance alerts', icon: Wrench, bg: 'bg-[#F3E8FF] text-[#9333EA]' },
    { id: 5, title: 'Compliance Reminders', count: 0, desc: 'Compliance and document reminders', icon: Shield, bg: 'bg-[#E0F2FE] text-[#0284C7]' },
    { id: 6, title: 'Emergency Notifications', count: 0, desc: 'Critical and emergency notifications', icon: AlertOctagon, bg: 'bg-[#FCE7F3] text-[#DB2777]' },
    { id: 7, title: 'System Notifications', count: 0, desc: 'System generated notifications', icon: Bell, bg: 'bg-sky-100 text-sky-700' }
  ];

  // Recent Broadcasts Logs for 12.4
  const [recentBroadcasts, setRecentBroadcasts] = useState([]);

  // Scheduled Broadcasts for 12.4
  const scheduledBroadcasts = [];

  // ============================================================
  // 12.5 TEMPLATES & AUTOMATION DATA
  // ============================================================
  const templateCategories = [
    { id: 1, title: 'Email Templates', desc: 'Customer emails and notifications', count: 0, icon: Mail, bg: 'bg-[#EEF2FF] text-[#4338CA]' },
    { id: 2, title: 'SMS Templates', desc: 'Text messages and alerts', count: 0, icon: MessageSquare, bg: 'bg-[#DCFCE7] text-[#16A34A]' },
    { id: 3, title: 'Push Notifications', desc: 'In-app push notifications', count: 0, icon: Bell, bg: 'bg-[#F3E8FF] text-[#9333EA]' },
    { id: 4, title: 'Delivery Notifications', desc: 'Delivery updates and alerts', count: 0, icon: Truck, bg: 'bg-[#FFEDD5] text-[#EA580C]' },
    { id: 5, title: 'Invoice & Payment', desc: 'Invoice and payment reminders', count: 0, icon: FileText, bg: 'bg-[#E0F2FE] text-[#0284C7]' },
    { id: 6, title: 'Internal Notifications', desc: 'Internal system notifications', count: 0, icon: Bell, bg: 'bg-[#FCE7F3] text-[#DB2777]' }
  ];

  const automationRules = [];

  const channelConfig = [
    { id: 1, channel: 'Email', icon: Mail, iconBg: 'bg-[#EEF2FF] text-[#4338CA]', status: 'Connected', lastSync: 'Never', successRate: '—' },
    { id: 2, channel: 'SMS Gateway', icon: MessageSquare, iconBg: 'bg-[#DCFCE7] text-[#16A34A]', status: 'Connected', lastSync: 'Never', successRate: '—' },
    { id: 3, channel: 'Push Notification', icon: Bell, iconBg: 'bg-[#F3E8FF] text-[#9333EA]', status: 'Connected', lastSync: 'Never', successRate: '—' },
    { id: 4, channel: 'In App', icon: Globe, iconBg: 'bg-[#E0F2FE] text-[#0284C7]', status: 'Connected', lastSync: 'Never', successRate: '—' }
  ];

  const recentTemplateActivity = [];

  // Communication History Logs for 12.3 Customer Communications
  const [communicationHistory, setCommunicationHistory] = useState([]);

  // Customer Communication Preferences State
  const [customerPreferences, setCustomerPreferences] = useState({
    email: true,
    sms: true,
    delivery: true,
    pod: true,
    invoice: true,
    marketing: false
  });

  const [chatMessages, setChatMessages] = useState({});


  const [activeChatInput, setActiveChatInput] = useState('');
  const [loadingComms, setLoadingComms] = useState(false);

  // Default Initial Contacts for Interactive Messaging
  const defaultContactsList = [
    { id: 1, name: 'Nilesh Chand', role: 'Driver - ANSH 1', initials: 'NC', avatarBg: 'bg-indigo-100 text-indigo-800 border border-indigo-200', avatarImg: null, preview: 'On my way to Sydney depot', time: '10:08 AM', badge: 1, online: true, type: 'Direct' },
    { id: 2, name: 'Shavneel Prasad', role: 'Driver - ANSH 2', initials: 'SP', avatarBg: 'bg-emerald-100 text-[#16A34A] border border-[#86EFAC]', avatarImg: null, preview: 'POD uploaded for load LD-1057', time: '09:45 AM', badge: null, online: true, type: 'Direct' },
    { id: 3, name: 'Dispatch Team', role: 'Sydney Operations', initials: 'DT', avatarBg: 'bg-amber-100 text-amber-800 border border-amber-200', avatarImg: null, preview: 'Route optimization updated', time: 'Yesterday', badge: 2, online: true, type: 'Teams' },
    { id: 4, name: 'Warehouse Melbourne', role: 'Depot Team', initials: 'WM', avatarBg: 'bg-purple-100 text-purple-800 border border-purple-200', avatarImg: null, preview: 'Stock arrival confirmed for Bay 4', time: '23 May', badge: null, online: false, type: 'Groups' }
  ];

  const defaultCustomerList = [
    { id: 1, name: 'ABC Logistics', initials: 'AB', avatarBg: 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]', email: 'operations@abclogistics.com.au', phone: '+61 2 9876 5432', address: '12 Logistics Way, Sydney NSW', type: 'Emails', status: 'Active', preview: 'ETA inquiry for Shipment LD-9021', time: '10:15 AM', badge: 1 },
    { id: 2, name: 'Global Retail Solutions', initials: 'GR', avatarBg: 'bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]', email: 'contact@globalretail.com.au', phone: '+61 3 9123 4567', address: '45 Retail Blvd, Melbourne VIC', type: 'SMS', status: 'Active', preview: 'Weekly schedule confirmed', time: 'Yesterday', badge: null }
  ];

  const fetchMessagesData = useCallback(async () => {
    setLoadingComms(true);
    try {
      const res = await api.get('/company-admin/messages');
      const data = res.data?.data || res.data || {};

      let users = [];
      if (Array.isArray(data.users) && data.users.length > 0) {
        const mappedUsers = data.users.map((u, idx) => ({
          id: u.id,
          name: u.name || `User ${idx + 1}`,
          role: u.role || 'Staff',
          online: u.status === 'ACTIVE' || u.status === 'Active',
          time: u.updatedAt ? new Date(u.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
          badge: null,
          initials: (u.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          avatarBg: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
          preview: `Contact: ${u.email || u.phone || 'Active User'}`,
          type: u.role === 'DRIVER' ? 'Direct' : u.role === 'DISPATCHER' ? 'Teams' : 'Groups'
        }));
        users = mappedUsers;
      }
      // Apply RBAC for Sales
      if (user?.role === 'SALES' || user?.role === 'SALES_REP') {
        users = users.filter(u => {
          const r = (u.role || '').toUpperCase();
          if (r.includes('DRIVER') || r.includes('DISPATCH') || r.includes('WAREHOUSE') || r.includes('DEPOT')) return false;
          return r.includes('SALES') || r.includes('ADMIN') || r.includes('CUSTOMER');
        });
      }

      setContactsList(users);
      if (users.length > 0) {
        setActiveContactId(prev => prev || users[0].id);
      }

      let customers = [];
      if (Array.isArray(data.customers) && data.customers.length > 0) {
        const mappedCust = data.customers.map((c, idx) => ({
          id: c.id,
          name: c.name,
          preview: `Active customer contact: ${c.email || c.phone || 'Customer'}`,
          time: 'Active',
          badge: null,
          initials: (c.name || 'C').slice(0, 2).toUpperCase(),
          avatarBg: 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]',
          email: c.email || 'customer@logistics.com',
          phone: c.phone || '+61 2 9000 0000',
          address: 'Main Logistics Terminal',
          type: 'Emails',
          status: c.status || 'Active'
        }));
        customers = mappedCust;
      }
      setCustomerList(customers);

      // Load live conversations and messages
      if (Array.isArray(data.conversations) && data.conversations.length > 0) {
        const loadedChats = {};
        data.conversations.forEach(conv => {
          if (Array.isArray(conv.messages) && conv.messages.length > 0) {
            loadedChats[conv.id] = conv.messages.map(m => ({
              id: m.id,
              text: m.content,
              time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
              sender: m.sender?.name || (m.senderId === user?.id ? 'ME' : 'Contact'),
              isMe: m.senderId === user?.id
            }));
          }
        });
        setChatMessages(prev => ({ ...loadedChats, ...prev }));
      }
    } catch (err) {
      console.error('Error loading messages data:', err);
    } finally {
      setLoadingComms(false);
    }
  }, [user?.role, user?.id]);

  useEffect(() => {
    fetchMessagesData();
  }, [fetchMessagesData]);

  // Handle Live Messaging & Auto-Reply
  const handleSendLiveMessage = async () => {
    if (!activeChatInput.trim()) return;
    const text = activeChatInput.trim();
    setActiveChatInput('');

    let currentList = contactsList;
    let targetId = activeContactId;

    if (currentList.length === 0) {
      let fallbackList = defaultContactsList;
      if (user?.role === 'SALES' || user?.role === 'SALES_REP') {
        fallbackList = fallbackList.filter(u => {
          const r = (u.role || '').toUpperCase();
          if (r.includes('DRIVER') || r.includes('DISPATCH') || r.includes('WAREHOUSE') || r.includes('DEPOT')) return false;
          return r.includes('SALES') || r.includes('ADMIN') || r.includes('CUSTOMER');
        });
      }
      currentList = fallbackList;
      setContactsList(fallbackList);
      targetId = fallbackList[0]?.id;
      setActiveContactId(targetId);
    } else if (!targetId) {
      targetId = currentList[0].id;
      setActiveContactId(targetId);
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const tempMsg = {
      id: Date.now(),
      text,
      time: nowTime,
      sender: 'ME',
      isMe: true
    };

    // 1. Append user message to active chat
    setChatMessages(prev => ({
      ...prev,
      [targetId]: [...(prev[targetId] || []), tempMsg]
    }));

    // 2. Update preview in left contacts list
    setContactsList(prev => prev.map(c => c.id === targetId ? { ...c, preview: `You: ${text}`, time: nowTime, badge: null } : c));

    // 3. Post to backend API
    try {
      await api.post('/company-admin/messages/send', {
        conversationId: targetId,
        content: text,
        recipientName: activeContact?.name || 'Contact'
      });
    } catch (err) {
      console.error('Backend send error:', err);
    }

    // 4. Generate Interactive Auto-Reply after 800ms
    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = `Received your message: "${text}". Everything is updated on our side!`;
      if (lower.includes('hy') || lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        replyText = `Hey! Thanks for reaching out. How can I assist you with your delivery today?`;
      } else if (lower.includes('status') || lower.includes('where') || lower.includes('eta') || lower.includes('location')) {
        replyText = `Vehicle is currently en route on M4 Highway. Estimated arrival is in 15 minutes.`;
      } else if (lower.includes('pod') || lower.includes('document') || lower.includes('load')) {
        replyText = `POD delivery receipt has been uploaded and verified in the portal.`;
      }

      const autoReplyMsg = {
        id: Date.now() + 1,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: activeContact?.name || 'Contact',
        isMe: false
      };

      setChatMessages(prev => ({
        ...prev,
        [targetId]: [...(prev[targetId] || []), autoReplyMsg]
      }));

      setContactsList(prev => prev.map(c => c.id === targetId ? { ...c, preview: replyText, time: 'Just now' } : c));
    }, 800);

    showToast(`Message sent to ${activeContact?.name || 'Contact'}`);
  };

  const [newMessageForm, setNewMessageForm] = useState({ recipient: 'Nilesh Chand (Driver - ANSH 1)', category: 'Conversations', content: '' });
  const [newCommForm, setNewCommForm] = useState({ customer: 'ABC Logistics', type: 'Delivery Notification', content: '' });
  const [newBroadcastForm, setNewBroadcastForm] = useState({ audience: 'All Drivers', title: '', body: '' });
  const [newTemplateModalForm, setNewTemplateModalForm] = useState({ type: 'Message Template', title: '', category: 'Delivery Notifications', channel: 'SMS Gateway', content: '' });

  const handleCreateNewMessageSubmit = async (e) => {
    e?.preventDefault();
    if (!newMessageForm.content.trim()) {
      showToast('Please enter message content');
      return;
    }

    const text = newMessageForm.content.trim();
    const recipientRaw = newMessageForm.recipient;
    const recipientName = recipientRaw.split('(')[0].trim();

    // Check if recipient exists in contacts list, or create one
    let targetContact = contactsList.find(c => c.name.toLowerCase().includes(recipientName.toLowerCase()));
    if (!targetContact) {
      targetContact = {
        id: Date.now(),
        name: recipientName,
        role: recipientRaw.includes('Driver') ? 'Driver' : 'Staff',
        initials: recipientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        avatarBg: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
        avatarImg: null,
        preview: `You: ${text}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: null,
        online: true,
        type: 'Direct'
      };
      setContactsList(prev => [targetContact, ...prev]);
    }

    const targetId = targetContact.id;
    setActiveContactId(targetId);
    setSelectedCategory('Conversations');

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), text, time: nowTime, sender: 'ME', isMe: true };

    setChatMessages(prev => ({
      ...prev,
      [targetId]: [...(prev[targetId] || []), userMsg]
    }));

    try {
      await api.post('/company-admin/messages/send', {
        recipientName: recipientRaw,
        content: text
      });
    } catch (err) {
      console.error(err);
    }

    // Auto reply
    setTimeout(() => {
      const autoReplyMsg = {
        id: Date.now() + 1,
        text: `Hey! Thanks for your message. How can I help you with this delivery?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: recipientName,
        isMe: false
      };

      setChatMessages(prev => ({
        ...prev,
        [targetId]: [...(prev[targetId] || []), autoReplyMsg]
      }));

      setContactsList(prev => prev.map(c => c.id === targetId ? { ...c, preview: autoReplyMsg.text, time: 'Just now' } : c));
    }, 800);

    setShowNewMessageModal(false);
    setNewMessageForm({ recipient: 'Nilesh Chand (Driver - ANSH 1)', category: 'Conversations', content: '' });
    showToast(`Message sent to ${recipientName}!`);
  };

  const handleCreateCommunicationSubmit = async (e) => {
    e?.preventDefault();
    if (!newCommForm.content.trim()) {
      showToast('Please enter message content');
      return;
    }
    try {
      await api.post('/company-admin/messages/communications', {
        customerName: newCommForm.customer,
        subject: newCommForm.type,
        message: newCommForm.content
      });
      const newLog = {
        id: Date.now(),
        title: newCommForm.type,
        desc: newCommForm.content,
        recipient: `To: ${newCommForm.customer}`,
        time: 'Just now',
        status: 'Delivered',
        statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: Mail,
        iconBg: 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]'
      };
      setCommunicationHistory(prev => [newLog, ...prev]);
    } catch (err) {
      console.error(err);
    }
    setShowNewCommunicationModal(false);
    setNewCommForm({ customer: 'ABC Logistics', type: 'Delivery Notification', content: '' });
    showToast('Customer communication sent!');
  };

  const handleCreateBroadcastSubmit = async (e) => {
    e?.preventDefault();
    if (!newBroadcastForm.title.trim()) {
      showToast('Please enter broadcast title');
      return;
    }
    try {
      await api.post('/company-admin/messages/broadcasts', {
        title: newBroadcastForm.title,
        content: newBroadcastForm.body,
        recipients: newBroadcastForm.audience
      });
      const newBcast = {
        id: Date.now(),
        title: newBroadcastForm.title,
        desc: newBroadcastForm.body || 'System notification broadcast',
        type: 'Driver Alert',
        typeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        recipients: newBroadcastForm.audience,
        status: 'Delivered',
        statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        sentOn: new Date().toLocaleString()
      };
      setRecentBroadcasts(prev => [newBcast, ...prev]);
    } catch (err) {
      console.error(err);
    }
    setShowBroadcastModal(false);
    setNewBroadcastForm({ audience: 'All Drivers', title: '', body: '' });
    showToast('Broadcast sent to all users!');
  };

  const handleCreateTemplateModalSubmit = async (e) => {
    e?.preventDefault();
    if (!newTemplateModalForm.title.trim()) {
      showToast('Please enter template title');
      return;
    }
    try {
      await api.post('/notification-templates', {
        title: newTemplateModalForm.title,
        channel: newTemplateModalForm.channel,
        body: newTemplateModalForm.content,
        category: newTemplateModalForm.category
      });
    } catch (err) {
      console.error(err);
    }
    setShowNewTemplateModal(false);
    setNewTemplateModalForm({ type: 'Message Template', title: '', category: 'Delivery Notifications', channel: 'SMS Gateway', content: '' });
    showToast('Template / Rule created successfully!');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedParticipant('All Participants');
    setSelectedBranch('All Branches');
    setSelectedStatus('All Status');
    setDateRange('01 May 2025 - 31 May 2025');
    showToast('Filters reset to default');
  };

  // Filtered contacts list by searchQuery & sub-tabs
  const filteredContacts = useMemo(() => {
    return contactsList.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = conversationSubTab === 'All' || c.type === conversationSubTab;
      return matchesSearch && matchesTab;
    });
  }, [contactsList, searchQuery, conversationSubTab]);

  // Filtered customer list for 12.3 Customer Communications
  const filteredCustomers = useMemo(() => {
    return customerList.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = customerSubTab === 'All' || c.type === customerSubTab;
      return matchesSearch && matchesTab;
    });
  }, [customerList, searchQuery, customerSubTab]);

  // Filtered broadcasts for 12.4
  const filteredBroadcasts = useMemo(() => {
    return recentBroadcasts.filter(b => {
      return b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.type.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [recentBroadcasts, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-3 sm:p-4 lg:p-5 font-sans space-y-4">

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0F172A] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Sparkles size={15} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER SECTION */}
      <div className="flex flex-col gap-2">
        {/* Row 1: Breadcrumbs & Right Utilities */}
        <div className="flex items-center justify-between gap-2 text-xs flex-nowrap w-full">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 sm:gap-1.5 font-bold text-[#4338CA] truncate shrink min-w-0 flex-1">
            <span onClick={() => setSelectedCategory('All Categories')} className="hover:underline cursor-pointer shrink-0">Home</span>
            <ChevronRight size={13} className="text-[#6366F1] shrink-0" />
            <span onClick={() => setSelectedCategory('All Categories')} className={`hover:underline cursor-pointer shrink-0 ${selectedCategory === 'All Categories' ? 'text-[#3730A3]' : ''}`}>Messages</span>
            {selectedCategory !== 'All Categories' && (
              <>
                <ChevronRight size={13} className="text-[#6366F1] shrink-0" />
                <span className="text-[#3730A3] truncate min-w-0">
                  {selectedCategory}
                </span>
              </>
            )}
          </div>

          {/* Top Right Utilities */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0 flex-nowrap">
            <button
              onClick={() => showToast('Help center opened')}
              className="flex items-center gap-1 text-xs font-bold text-[#4338CA] hover:text-[#312E81] transition-colors cursor-pointer"
            >
              <HelpCircle size={14} className="text-[#4338CA]" />
              <span className="hidden sm:inline">Need help?</span>
            </button>

            {/* Notification Bell with '11' Badge */}
            <div className="relative cursor-pointer shrink-0" onClick={() => showToast('11 Unread Notifications')}>
              <div className="p-0.5 text-slate-700 hover:text-slate-900">
                <svg className="w-4.5 h-4.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                11
              </span>
            </div>

            {/* User Profile Initial SM Circle */}
            <div onClick={() => showToast('Logged in as SM (System Manager)')} className="w-6.5 h-6.5 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-extrabold text-[10px] cursor-pointer shadow-xs shrink-0">
              SM
            </div>

            {/* More Actions Dropdown Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => setOpenMoreActions(!openMoreActions)}
                className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 sm:px-3 py-1 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>More Actions</span>
                <ChevronDown size={12} className={`text-slate-500 transition-transform ${openMoreActions ? 'rotate-180' : ''}`} />
              </button>

              {openMoreActions && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden py-1 text-xs text-left">
                  <button onClick={() => { showToast('Archived messages opened'); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                    <Inbox size={13} className="text-slate-400" /> View Archived Chat
                  </button>
                  <button onClick={() => { showToast('Exporting chat log...'); setOpenMoreActions(false); }} className="w-full text-left px-3 py-1.5 font-medium hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                    <FileText size={13} className="text-slate-400" /> Export Message Logs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Main Title & Header Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-0.5">
          <div>
            <div className="flex items-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-snug">
                {selectedCategory === 'All Categories' ? 'Messages' : selectedCategory === 'Conversations' ? 'Conversations' : selectedCategory === 'Customer Communications' ? 'Customer Communications' : selectedCategory === 'Broadcast & Notifications' ? 'Broadcasts & Notifications' : selectedCategory === 'Templates & Automation' ? 'Templates & Automation' : selectedCategory}
              </h1>
              <div className="w-5.5 h-5.5 rounded-lg bg-[#EEF2FF] border-2 border-[#6366F1] text-[#6366F1] flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-1">
                <Shield size={12} strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {selectedCategory === 'Conversations' ? 'Communicate in real-time with drivers, dispatch, branches and customers.' : selectedCategory === 'Customer Communications' ? 'Manage all customer communications, notifications and automated updates.' : selectedCategory === 'Broadcast & Notifications' ? 'Create, manage and monitor all broadcasts, alerts and system notifications.' : selectedCategory === 'Templates & Automation' ? 'Create and manage message templates, automation rules and notification workflows.' : 'Central hub for all communications, conversations and notifications.'}
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-start sm:justify-end gap-2 w-full sm:w-auto shrink-0">
            {/* Main Header Action Buttons */}
            <button
              onClick={() => showToast('Refreshing data...')}
              className="flex-1 sm:flex-none justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
            >
              <RefreshCw size={14} className="text-[#4338CA]" />
              <span>Refresh</span>
            </button>

            {selectedCategory === 'Templates & Automation' ? (
              <>
                <button
                  onClick={() => showToast('Exporting templates report...')}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                >
                  <Download size={14} className="text-[#4338CA]" />
                  <span>Export Report</span>
                </button>
                <button
                  onClick={() => setShowTemplateLibraryModal(true)}
                  className="w-full sm:w-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                >
                  <BookOpen size={14} className="text-[#4338CA]" />
                  <span>Template Library</span>
                </button>
                <button
                  onClick={() => setShowNewTemplateModal(true)}
                  className="w-full sm:w-auto justify-center flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg whitespace-nowrap"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>New Template / Rule</span>
                </button>
              </>
            ) : selectedCategory === 'Broadcast & Notifications' ? (
              <>
                <button
                  onClick={() => showToast('Exporting broadcast report...')}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                >
                  <Download size={14} className="text-[#4338CA]" />
                  <span>Export Report</span>
                </button>

                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="w-full sm:w-auto justify-center flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg whitespace-nowrap"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>New Broadcast</span>
                </button>
              </>
            ) : selectedCategory === 'Customer Communications' ? (
              <>
                <button
                  onClick={() => showToast('Exporting customer communications report...')}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                >
                  <Download size={14} className="text-[#4338CA]" />
                  <span>Export Report</span>
                </button>

                <button
                  onClick={() => setShowNewCommunicationModal(true)}
                  className="w-full sm:w-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                >
                  <Mail size={14} className="text-[#4338CA]" />
                  <span>Message Customer</span>
                </button>

                <button
                  onClick={() => setShowNewCommunicationModal(true)}
                  className="w-full sm:w-auto justify-center flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg whitespace-nowrap"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>New Communication</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleMarkAllRead}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                >
                  <MailCheck size={14} className="text-[#4338CA]" />
                  <span>Mark All as Read</span>
                </button>

                {selectedCategory === 'Conversations' && (
                  <button
                    onClick={handleToggleStar}
                    className="w-full sm:w-auto justify-center flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-[#4338CA] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer hover:border-slate-300 whitespace-nowrap"
                  >
                    <Star size={14} className={starredContacts[activeContactId] ? "text-amber-500 fill-amber-400" : "text-[#4338CA]"} />
                    <span>{starredContacts[activeContactId] ? "Starred" : "Star Conversation"}</span>
                  </button>
                )}

                <button
                  onClick={() => setShowNewMessageModal(true)}
                  className="w-full sm:w-auto justify-center flex items-center gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg whitespace-nowrap"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>New Message</span>
                </button>
              </>
            )}

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RENDER VIEW: 12.5 TEMPLATES & AUTOMATION                                  */}
      {/* ========================================================================= */}
      {selectedCategory === 'Templates & Automation' ? (
        <div className="space-y-4">

          {/* ── ROW 1: 6 KPI METRIC CARDS ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-2.5">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4338CA] flex items-center justify-center shrink-0 mt-0.5"><FileText size={14} /></div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] 2xl:text-[9.5px] font-black text-slate-400 uppercase tracking-wider block truncate">TOTAL TEMPLATES</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8.5px] 2xl:text-[9.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No templates yet</div>
                <button onClick={() => showToast('Viewing all templates')} className="text-[8.5px] 2xl:text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1.5 cursor-pointer whitespace-nowrap truncate">
                  <span>View all templates</span><span>→</span>
                </button>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5"><Zap size={14} /></div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] 2xl:text-[9.5px] font-black text-slate-400 uppercase tracking-wider block truncate">ACTIVE AUTOMATION RULES</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8.5px] 2xl:text-[9.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No rules active</div>
                <button onClick={() => showToast('Viewing all rules')} className="text-[8.5px] 2xl:text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1.5 cursor-pointer whitespace-nowrap truncate">
                  <span>View all rules</span><span>→</span>
                </button>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5"><Send size={14} /></div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] 2xl:text-[9.5px] font-black text-slate-400 uppercase tracking-wider block truncate">AUTOMATED MESSAGES (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8.5px] 2xl:text-[9.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No data yet</div>
                <button onClick={() => showToast('Viewing analytics')} className="text-[8.5px] 2xl:text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1.5 cursor-pointer whitespace-nowrap truncate">
                  <span>View analytics</span><span>→</span>
                </button>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5"><CheckCircle size={14} /></div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] 2xl:text-[9.5px] font-black text-slate-400 uppercase tracking-wider block truncate">SUCCESS RATE (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">—</div>
                <div className="text-[8.5px] 2xl:text-[9.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No data yet</div>
                <button onClick={() => showToast('Viewing performance')} className="text-[8.5px] 2xl:text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1.5 cursor-pointer whitespace-nowrap truncate">
                  <span>View performance</span><span>→</span>
                </button>
              </div>
            </div>
            {/* Card 5 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#FCE7F3] text-[#DB2777] flex items-center justify-center shrink-0 mt-0.5"><AlertTriangle size={14} /></div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] 2xl:text-[9.5px] font-black text-slate-400 uppercase tracking-wider block truncate">FAILED / BOUNCED (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8.5px] 2xl:text-[9.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No failures</div>
                <button onClick={() => showToast('Viewing failure report')} className="text-[8.5px] 2xl:text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1.5 cursor-pointer whitespace-nowrap truncate">
                  <span>View failures</span><span>→</span>
                </button>
              </div>
            </div>
            {/* Card 6 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 mt-0.5"><Clock size={14} /></div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] 2xl:text-[9.5px] font-black text-slate-400 uppercase tracking-wider block truncate">SAVED TIME (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0h</div>
                <div className="text-[8.5px] 2xl:text-[9.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No data yet</div>
                <button onClick={() => showToast('Viewing ROI report')} className="text-[8.5px] 2xl:text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1.5 cursor-pointer whitespace-nowrap truncate">
                  <span>View ROI report</span><span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── ROW 2: SEARCH & FILTER BAR ── */}
          <div className="bg-white border border-slate-200/80 rounded-lg p-2 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates, rules, keywords..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-slate-50/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              {templateSearch && (
                <button onClick={() => setTemplateSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-center shrink-0">
              {[
                { label: selectedTemplateType, set: setSelectedTemplateType, options: ['All Template Types', 'Email Templates', 'SMS Templates', 'Push Notifications', 'Delivery Notifications', 'Invoice & Payment'] },
                { label: selectedTemplateChannel, set: setSelectedTemplateChannel, options: ['All Channels', 'Email', 'SMS', 'Push', 'In-App'] },
                { label: selectedTemplateStatus, set: setSelectedTemplateStatus, options: ['All Status', 'Active', 'Inactive', 'Draft'] },
                { label: selectedTemplateCategoryFilter, set: setSelectedTemplateCategoryFilter, options: ['All Categories', 'Drivers', 'Customers', 'Internal', 'Maintenance'] }
              ].map((dd, i) => (
                <select key={i} value={dd.label} onChange={e => dd.set(e.target.value)} className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 outline-none focus:border-blue-400 cursor-pointer appearance-none hover:bg-white transition-all">
                  {dd.options.map(o => <option key={o}>{o}</option>)}
                </select>
              ))}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-[10px] font-bold text-slate-700 cursor-pointer hover:bg-white transition-all whitespace-nowrap">
                <Calendar size={12} className="text-slate-500" />
                <span>01 May 2025 - 31 May 2025</span>
              </div>
              <button onClick={() => showToast('Advanced filters opened')} className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-white transition-all cursor-pointer whitespace-nowrap">
                <Filter size={12} className="text-slate-500" />
                <span>Filters</span>
              </button>
              <button onClick={() => { setTemplateSearch(''); setSelectedTemplateType('All Template Types'); setSelectedTemplateChannel('All Channels'); setSelectedTemplateStatus('All Status'); setSelectedTemplateCategoryFilter('All Categories'); showToast('Filters cleared'); }} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* ── ROW 3: 3-COLUMN WORKSPACE ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

            {/* ── COL 1: TEMPLATE CATEGORIES ── */}
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden flex flex-col" style={{ height: '420px' }}>
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 shrink-0">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">TEMPLATE CATEGORIES</span>
                <button onClick={() => showToast('Viewing all categories')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 cursor-pointer">View All <ChevronRight size={12} /></button>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                {templateCategories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => setActiveTemplateCategory(cat.id)}
                    className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-all hover:bg-slate-50 ${activeTemplateCategory === cat.id ? 'bg-[#EEF2FF] border-l-[3px] border-[#4338CA]' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center shrink-0`}>
                      <cat.icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11.5px] font-black text-slate-800 truncate">{cat.title}</div>
                      <div className="text-[9.5px] text-slate-500 font-medium truncate mt-0.5">{cat.desc}</div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="text-[13px] font-black text-slate-800 leading-tight">{cat.count}</div>
                      <div className="text-[8.5px] font-semibold text-slate-400 leading-tight">Templates</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2 border-t border-slate-100 shrink-0">
                <button onClick={() => showToast('Viewing all categories')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 cursor-pointer">
                  View all categories <ChevronRight size={12} />
                </button>
              </div>
            </div>

            {/* ── COL 2: TEMPLATE PREVIEW ── */}
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden flex flex-col" style={{ height: '420px' }}>
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 shrink-0">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">TEMPLATE PREVIEW</span>
                <button onClick={() => showToast('Viewing all templates')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 cursor-pointer">View All <ChevronRight size={12} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                {/* Template Selector Dropdown */}
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={selectedPreviewTemplate}
                    onChange={(e) => setSelectedPreviewTemplate(e.target.value)}
                    className="flex-1 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option>Delivery Notification - ETA Update</option>
                    <option>Invoice Payment Reminder</option>
                    <option>POD Delivery Confirmation</option>
                    <option>Maintenance Due Alert</option>
                  </select>
                  <span className={`shrink-0 text-[9.5px] font-black px-2 py-0.5 rounded-full border ${selectedPreviewTemplate.includes('Invoice') ? 'bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]' : selectedPreviewTemplate.includes('Maintenance') ? 'bg-[#F3E8FF] text-[#9333EA] border-[#E9D5FF]' : 'bg-[#DCFCE7] text-[#16A34A] border-[#86EFAC]'}`}>
                    {selectedPreviewTemplate.includes('Invoice') ? 'Email' : selectedPreviewTemplate.includes('Maintenance') ? 'System' : 'SMS'}
                  </span>
                </div>

                {/* Dynamic Template Body */}
                <div className="bg-[#F8FFF8] rounded-lg border border-slate-200 p-3 flex-1 text-[11.5px] text-slate-700 font-medium leading-relaxed overflow-y-auto">
                  <p>Dear <span className="text-[#4338CA] font-bold">{"{{customer_name}}"}</span>, this is a reminder that invoice <span className="text-[#4338CA] font-bold">{"{{invoice_num}}"}</span> is due for payment. Please reach out to accounts if you have any questions.</p>
                </div>

                {/* Character Count & Insert Variable Dropdown */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold relative">
                  <span>Characters: <span className="font-black text-slate-700">{selectedPreviewTemplate.includes('Invoice') ? '185 / 500' : '142 / 160'}</span></span>
                  <div className="relative">
                    <button
                      onClick={() => setOpenInsertVariable(!openInsertVariable)}
                      className="text-[#4338CA] font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Insert Variable</span>
                      <ChevronDown size={11} />
                    </button>
                    {openInsertVariable && (
                      <div className="absolute right-0 bottom-full mb-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-1 text-xs space-y-0.5">
                        {['{{customer_name}}', '{{load_id}}', '{{eta_time}}', '{{tracking_link}}', '{{company_name}}', '{{driver_name}}', '{{invoice_num}}'].map(v => (
                          <button
                            key={v}
                            onClick={() => { setOpenInsertVariable(false); showToast(`Inserted variable: ${v}`); }}
                            className="w-full text-left px-2.5 py-1 rounded text-[10.5px] font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit / Use Buttons */}
              <div className="px-3 py-2.5 border-t border-slate-100 flex gap-2 shrink-0">
                <button onClick={() => setShowNewTemplateModal(true)} className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer">
                  <Edit size={12} /> Edit Template
                </button>
                <button onClick={() => setShowNewMessageModal(true)} className="flex-1 flex items-center justify-center gap-1.5 bg-[#4338CA] hover:bg-[#3730A3] text-white py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-md">
                  <PlayCircle size={12} /> Use Template
                </button>
              </div>
            </div>

            {/* ── COL 3: AUTOMATION RULES ── */}
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden flex flex-col" style={{ height: '420px' }}>
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 shrink-0">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">AUTOMATION RULES</span>
                <button onClick={() => showToast('Viewing all rules')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 cursor-pointer">View All <ChevronRight size={12} /></button>
              </div>

              {/* Scrollable Container with horizontal & vertical scrollbar */}
              <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
                {automationRules.length > 0 ? (
                  <div className="w-[550px] min-w-[550px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-[130px_120px_95px_75px_105px_25px] gap-1 px-3 py-2 bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                      {['Rule Name', 'Trigger', 'Action', 'Status', 'Last Run', ''].map((h, i) => (
                        <span key={i} className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider truncate">{h}</span>
                      ))}
                    </div>
                    {/* Table Rows */}
                    {automationRules.map(rule => (
                      <div key={rule.id} className="grid grid-cols-[130px_120px_95px_75px_105px_25px] gap-1 items-center px-3 py-2.5 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                        <div className="text-[10px] font-bold text-slate-800 truncate" title={rule.name}>{rule.name}</div>
                        <div className="text-[9.5px] font-medium text-slate-600 truncate" title={rule.trigger}>{rule.trigger}</div>
                        <div className="text-[9.5px] font-medium text-slate-600 truncate" title={rule.action}>{rule.action}</div>
                        <div>
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8.5px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                            {rule.status}
                          </span>
                        </div>
                        <div className="text-[8.5px] font-medium text-slate-600 whitespace-nowrap">
                          <div className="font-bold text-slate-700 leading-tight">{rule.lastRunDate}</div>
                          <div className="text-[8px] text-slate-400 font-semibold leading-tight">{rule.lastRunTime}</div>
                        </div>
                        <button onClick={() => showToast(`Options for ${rule.name}`)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex justify-center">
                          <MoreVertical size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <Zap size={32} className="text-slate-200 mb-2" />
                    <p className="text-[11px] font-bold text-slate-400">No automation rules configured</p>
                    <p className="text-[9.5px] text-slate-300 font-medium mt-0.5">Automate your messaging workflows</p>
                    <button onClick={() => setShowNewTemplateModal(true)} className="mt-3 text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer">+ Create Rule</button>
                  </div>
                )}
              </div>

              <div className="px-3 py-2 border-t border-slate-100 shrink-0">
                <button onClick={() => showToast('Viewing all automation rules')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 cursor-pointer">
                  View all automation rules <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* ── ROW 4: BOTTOM 3-COLUMN ROW ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

            {/* ── COL 1: CHANNEL CONFIGURATION ── */}
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">CHANNEL CONFIGURATION</span>
                <button onClick={() => showToast('Edit all channels')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 cursor-pointer">Edit All <ChevronRight size={12} /></button>
              </div>
              <div className="flex-1">
                {/* Table Header */}
                <div className="grid grid-cols-4 px-3 py-2 bg-slate-50 border-b border-slate-100">
                  {['Channel', 'Status', 'Last Sync', 'Success Rate'].map(h => (
                    <span key={h} className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider truncate">{h}</span>
                  ))}
                </div>
                {channelConfig.map(ch => {
                  const IconComp = ch.icon;
                  return (
                    <div key={ch.id} className="grid grid-cols-4 items-center px-3 py-2.5 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-md ${ch.iconBg} flex items-center justify-center shrink-0`}><IconComp size={11} /></div>
                        <span className="text-[10px] font-bold text-slate-800 truncate">{ch.channel}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[9.5px] font-bold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                        {ch.status}
                      </span>
                      <span className="text-[8.5px] font-medium text-slate-500 truncate">{ch.lastSync}</span>
                      <span className="text-[10px] font-black text-slate-400">{ch.successRate}</span>
                    </div>
                  );
                })}
              </div>
              <div className="px-3 py-2 border-t border-slate-100">
                <button onClick={() => showToast('Manage integrations opened')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 cursor-pointer">
                  Manage integrations <ChevronRight size={12} />
                </button>
              </div>
            </div>

            {/* ── COL 2: AUTOMATION PERFORMANCE ── */}
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">AUTOMATION PERFORMANCE (MTD)</span>
                <button onClick={() => showToast('Viewing analytics')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 cursor-pointer">View Analytics <ChevronRight size={12} /></button>
              </div>
              <div className="flex-1 flex items-center gap-4 px-4 py-4">
                {/* Donut SVG Chart */}
                <div className="relative shrink-0 w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    {/* Total ring BG */}
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F1F5F9" strokeWidth="3.5" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[14px] font-black text-slate-900 leading-none">0</span>
                    <span className="text-[8px] font-bold text-slate-500 leading-tight">Total Sent</span>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex-1 space-y-2">
                  {[
                    { label: 'Successful', value: '0', pct: '0%', color: 'bg-emerald-500' },
                    { label: 'Failed', value: '0', pct: '0%', color: 'bg-rose-500' },
                    { label: 'Pending', value: '0', pct: '0%', color: 'bg-amber-500' },
                    { label: 'Duplicates', value: '0', pct: '0%', color: 'bg-slate-400' }
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`}></span>
                        <span className="text-[10px] font-semibold text-slate-600">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-slate-800">{item.value}</span>
                        <span className="text-[9px] text-slate-400 font-semibold ml-1">({item.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-3 py-2 border-t border-slate-100">
                <button onClick={() => showToast('Viewing detailed analytics')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 cursor-pointer">
                  View detailed analytics <ChevronRight size={12} />
                </button>
              </div>
            </div>

            {/* ── COL 3: RECENT ACTIVITY ── */}
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">RECENT ACTIVITY</span>
                <button onClick={() => showToast('Viewing all activity')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 cursor-pointer">View All <ChevronRight size={12} /></button>
              </div>
              <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
                {recentTemplateActivity.length > 0 ? recentTemplateActivity.map(item => {
                  const IconComp = item.icon;
                  return (
                    <div key={item.id} className="flex items-start gap-3 px-3 py-3 hover:bg-slate-50 transition-colors">
                      <div className={`w-7 h-7 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <IconComp size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-slate-800 leading-snug">{item.title}</div>
                        <div className="text-[9.5px] text-slate-500 font-medium mt-0.5 truncate">{item.desc}</div>
                        <div className="text-[9px] text-slate-400 font-semibold mt-1">{item.date} · {item.time}</div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <Activity size={28} className="text-slate-200 mb-2" />
                    <p className="text-[10.5px] font-bold text-slate-400">No recent activity</p>
                    <p className="text-[9px] text-slate-300 font-medium mt-0.5">Automation & template events will log here</p>
                  </div>
                )}
              </div>
              <div className="px-3 py-2 border-t border-slate-100">
                <button onClick={() => showToast('Viewing all activity')} className="text-[10px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 cursor-pointer">
                  View all activity <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : selectedCategory === 'Broadcast & Notifications' ? (
        <div className="space-y-4">
          {/* 6 TOP KPI METRIC CARDS (ROW 1) */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-2.5">
            {/* Metric 1 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4338CA] flex items-center justify-center shrink-0 mt-0.5">
                <Megaphone size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] xl:text-[8px] 2xl:text-[9px] font-black text-slate-400 uppercase tracking-tight block truncate" title="BROADCASTS SENT (MTD)">BROADCASTS SENT (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8px] xl:text-[8.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No broadcasts yet</div>
                <button onClick={() => showToast('Viewing all broadcasts')} className="text-[8px] xl:text-[8.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer whitespace-nowrap truncate">
                  <span>View all broadcasts</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0 mt-0.5">
                <Bell size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] xl:text-[8px] 2xl:text-[9px] font-black text-slate-400 uppercase tracking-tight block truncate" title="NOTIFICATIONS SENT (MTD)">NOTIFICATIONS SENT (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8px] xl:text-[8.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No notifications yet</div>
                <button onClick={() => showToast('Viewing all notifications')} className="text-[8px] xl:text-[8.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer whitespace-nowrap truncate">
                  <span>View all notifications</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                <Users size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] xl:text-[8px] 2xl:text-[9px] font-black text-slate-400 uppercase tracking-tight block truncate" title="TOTAL RECIPIENTS (MTD)">TOTAL RECIPIENTS (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8px] xl:text-[8.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No data yet</div>
                <button onClick={() => showToast('Viewing reach analytics')} className="text-[8px] xl:text-[8.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer whitespace-nowrap truncate">
                  <span>View reach analytics</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                <Mail size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] xl:text-[8px] 2xl:text-[9px] font-black text-slate-400 uppercase tracking-tight block truncate" title="DELIVERED (MTD)">DELIVERED (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8px] xl:text-[8.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No data yet</div>
                <button onClick={() => showToast('Viewing delivery report')} className="text-[8px] xl:text-[8.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer whitespace-nowrap truncate">
                  <span>View delivery report</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 5 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#FCE7F3] text-[#DB2777] flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] xl:text-[8px] 2xl:text-[9px] font-black text-slate-400 uppercase tracking-tight block truncate" title="FAILED (MTD)">FAILED (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8px] xl:text-[8.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No failures</div>
                <button onClick={() => showToast('Viewing failure report')} className="text-[8px] xl:text-[8.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer whitespace-nowrap truncate">
                  <span>View failure report</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 6 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] xl:text-[8px] 2xl:text-[9px] font-black text-slate-400 uppercase tracking-tight block truncate" title="AVG RESPONSE TIME">AVG RESPONSE TIME</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">—</div>
                <div className="text-[8px] xl:text-[8.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No data yet</div>
                <button onClick={() => showToast('Viewing performance')} className="text-[8px] xl:text-[8.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer whitespace-nowrap truncate">
                  <span>View performance</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* SEARCH AND FILTERS BAR (ROW 2) */}
          <div className="bg-white border border-slate-200/80 rounded-lg p-2 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search broadcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-slate-50/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Dropdown 1: Categories */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenCategoryDropdown(!openCategoryDropdown); setOpenParticipantDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedCategory}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {[
                    'All Categories',
                    'Conversations',
                    'Customer Communications',
                    'Broadcast & Notifications',
                    'Templates & Automation'
                  ].map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setOpenCategoryDropdown(false); showToast(`Navigated to ${cat}`); }}
                      className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 2: All Channels */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenParticipantDropdown(!openParticipantDropdown); setOpenCategoryDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>All Channels</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openParticipantDropdown && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {['All Channels', 'Email', 'SMS', 'In App', 'Push Notification'].map(ch => (
                    <button key={ch} onClick={() => setOpenParticipantDropdown(false)} className="w-full text-left px-3 py-1.5 font-semibold hover:bg-slate-50 text-slate-700">
                      {ch}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 3: All Recipients */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenBranchDropdown(!openBranchDropdown); setOpenCategoryDropdown(false); setOpenParticipantDropdown(false); setOpenStatusDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>All Recipients</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openBranchDropdown && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {['All Recipients', 'Drivers', 'Customers', 'Branches', 'All Users'].map(rec => (
                    <button key={rec} onClick={() => setOpenBranchDropdown(false)} className="w-full text-left px-3 py-1.5 font-semibold hover:bg-slate-50 text-slate-700">
                      {rec}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 4: Status */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenStatusDropdown(!openStatusDropdown); setOpenCategoryDropdown(false); setOpenParticipantDropdown(false); setOpenBranchDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedStatus}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {['All Status', 'Delivered', 'Partial', 'Scheduled', 'Failed'].map(st => (
                    <button key={st} onClick={() => { setSelectedStatus(st); setOpenStatusDropdown(false); }} className={`w-full text-left px-3 py-1.5 font-semibold ${selectedStatus === st ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}>
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Picker Input */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <Calendar size={13} className="text-slate-400" />
                <span>{dateRange}</span>
                <Calendar size={13} className="text-slate-400" />
              </button>

              {showDatePicker && (
                <div className="absolute top-full right-0 mt-1 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2.5 text-xs">
                  <div className="font-bold text-slate-900 mb-1.5">Select Date Range</div>
                  <div className="space-y-1">
                    {['01 May 2025 - 31 May 2025', '01 Apr 2025 - 30 Apr 2025', 'Q1 2025 (Jan - Mar)', 'Year to Date 2025'].map(range => (
                      <button
                        key={range}
                        onClick={() => { setDateRange(range); setShowDatePicker(false); showToast(`Date updated: ${range}`); }}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-medium cursor-pointer ${dateRange === range ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={handleResetFilters} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors">
                <Filter size={13} className="text-slate-500" />
                <span>Filters</span>
              </button>
              <button onClick={() => showToast('Refreshing data...')} className="p-1.5 text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors">
                <RefreshCw size={13} className="text-slate-500" />
              </button>
            </div>
          </div>

          {/* MAIN 3-COLUMN WORKSPACE ROW (SIDE-BY-SIDE MATCHING SCREENSHOT 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">

            {/* COLUMN 1: BROADCAST CATEGORIES (Span 3 ~25% Width) */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col justify-between h-[420px]">
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100 shrink-0">
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">BROADCAST CATEGORIES</h2>
                  <button onClick={() => showToast('Viewing all categories')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                    <span>View All</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
                  {broadcastCategories.map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => showToast(`Filtered by ${cat.title}`)}
                        className="p-2 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50 transition-all flex items-start gap-2.5 cursor-pointer group"
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${cat.bg}`}>
                          <CatIcon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="text-[11px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{cat.title}</h3>
                            <span className="text-[9px] font-extrabold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded-full shrink-0">{cat.count} Broadcasts</span>
                          </div>
                          <p className="text-[9.5px] text-slate-500 font-medium leading-tight mt-0.5 truncate">{cat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2 text-center shrink-0">
                  <button onClick={() => showToast('All categories loaded')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 cursor-pointer w-full">
                    <span>View all categories</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* COLUMN 2: RECENT BROADCASTS (Span 6 ~50% Width) */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col justify-between h-[420px]">
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100 shrink-0">
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">RECENT BROADCASTS</h2>
                  <button onClick={() => showToast('Viewing all broadcasts')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                    <span>View All</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Data Table with Mobile Scrollbar */}
                <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar pr-0.5">
                  {filteredBroadcasts.length > 0 ? (
                    <table className="w-full min-w-[540px] text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200/80 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                          <th className="py-2 px-2 whitespace-nowrap">Broadcast / Notification</th>
                          <th className="py-2 px-1 whitespace-nowrap">Type</th>
                          <th className="py-2 px-1 text-center whitespace-nowrap">Channel</th>
                          <th className="py-2 px-1 text-center whitespace-nowrap">Recipients</th>
                          <th className="py-2 px-1 text-center whitespace-nowrap">Status</th>
                          <th className="py-2 px-2 text-right whitespace-nowrap">Sent On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBroadcasts.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/60 transition-colors group cursor-pointer">
                            <td className="py-2 px-2 min-w-0">
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                  <Megaphone size={12} />
                                </div>
                                <div className="truncate max-w-[180px]">
                                  <p className="text-[10.5px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{b.title}</p>
                                  <p className="text-[9px] text-slate-400 font-medium truncate">{b.desc}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-1">
                              <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded border whitespace-nowrap ${b.typeBg}`}>
                                {b.type}
                              </span>
                            </td>
                            <td className="py-2 px-1 text-center">
                              <div className="flex items-center justify-center gap-1 text-slate-500">
                                <Mail size={11} />
                                <Phone size={11} />
                              </div>
                            </td>
                            <td className="py-2 px-1 text-center font-bold text-slate-700 text-[10px]">
                              {b.recipients}
                            </td>
                            <td className="py-2 px-1 text-center">
                              <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full border ${b.statusBg}`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-right text-[9px] font-bold text-slate-400 whitespace-nowrap">
                              {b.sentOn}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                      <Megaphone size={32} className="text-slate-200 mb-2" />
                      <p className="text-[11px] font-bold text-slate-400">No broadcasts sent yet</p>
                      <p className="text-[9.5px] text-slate-300 font-medium mt-0.5">Create a broadcast to send updates</p>
                      <button onClick={() => setShowBroadcastModal(true)} className="mt-3 text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer">+ New Broadcast</button>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2 text-center shrink-0">
                  <button onClick={() => showToast('Viewing all broadcasts')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 cursor-pointer w-full">
                    <span>View all broadcasts</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* COLUMN 3: BROADCAST CHANNELS & CHANNEL PERFORMANCE (Span 3 ~25% Width) */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col justify-between h-[420px]">
              <div className="flex flex-col h-full justify-between">

                {/* BLOCK 1: BROADCAST CHANNELS (MTD) */}
                <div>
                  <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
                    <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">BROADCAST CHANNELS (MTD)</h2>
                    <button onClick={() => showToast('Channel report opened')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                      <span>View Report</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Donut Chart Mockup */}
                  <div className="flex items-center gap-3 my-2 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                    <div className="w-20 h-20 rounded-full border-8 border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
                      <div className="text-center">
                        <span className="text-xs font-black text-slate-900 leading-none block">0</span>
                        <span className="text-[7.5px] font-bold text-slate-400 uppercase">Total Sent</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[9.5px] font-bold text-slate-700 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span>Email</span>
                        <span>0 (0%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>SMS</span>
                        <span>0 (0%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>In App</span>
                        <span>0 (0%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Push</span>
                        <span>0 (0%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BLOCK 2: CHANNEL PERFORMANCE */}
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">CHANNEL PERFORMANCE</h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-0.5">
                        <span className="flex items-center gap-1"><Mail size={11} className="text-blue-600" /> Email (0 Sent)</span>
                        <span className="text-slate-400">— Delivery Rate</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-0.5">
                        <span className="flex items-center gap-1"><Phone size={11} className="text-emerald-600" /> SMS (0 Sent)</span>
                        <span className="text-slate-400">— Delivery Rate</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-0.5">
                        <span className="flex items-center gap-1"><Bell size={11} className="text-amber-600" /> In App (0 Sent)</span>
                        <span className="text-slate-400">— Delivery Rate</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-0.5">
                        <span className="flex items-center gap-1"><Send size={11} className="text-purple-600" /> Push Notification (0 Sent)</span>
                        <span className="text-slate-400">— Delivery Rate</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2 text-center shrink-0">
                  <button onClick={() => showToast('Opening channel report')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 cursor-pointer w-full">
                    <span>View channel report</span>
                    <span>→</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* BOTTOM ROW: SCHEDULED BROADCASTS & QUICK ACTIONS (MATCHING SCREENSHOT 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">

            {/* LEFT: SCHEDULED BROADCASTS (Span 6) */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2.5">SCHEDULED BROADCASTS</h2>

              <div className="space-y-2">
                {scheduledBroadcasts.length > 0 ? scheduledBroadcasts.map((sb) => (
                  <div key={sb.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                        <CalendarDays size={14} />
                      </div>
                      <div className="truncate">
                        <h3 className="text-[11px] font-extrabold text-slate-900 truncate">{sb.title}</h3>
                        <p className="text-[9.5px] text-slate-500 font-medium truncate">{sb.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className="text-[9.5px] font-bold text-slate-400">{sb.date}</span>
                      <span className="text-[8.5px] font-black px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                        {sb.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <CalendarDays size={26} className="text-slate-200 mb-1.5" />
                    <p className="text-[10px] font-bold text-slate-400">No scheduled broadcasts</p>
                    <p className="text-[9px] text-slate-300 font-medium mt-0.5">Upcoming scheduled broadcasts will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: QUICK ACTIONS (Span 6) */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2.5">QUICK ACTIONS</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button onClick={() => setShowBroadcastModal(true)} className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 transition-all text-left group cursor-pointer flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4338CA] flex items-center justify-center shrink-0">
                    <Megaphone size={14} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">New Broadcast</h3>
                    <p className="text-[8.5px] text-slate-400 font-medium leading-tight">Send to multiple recipients</p>
                  </div>
                </button>

                <button onClick={() => showToast('New notification composer opened')} className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/30 transition-all text-left group cursor-pointer flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0">
                    <Bell size={14} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-purple-600 transition-colors leading-tight">New Notification</h3>
                    <p className="text-[8.5px] text-slate-400 font-medium leading-tight">Send system notification</p>
                  </div>
                </button>

                <button onClick={() => showToast('Template library opened')} className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 transition-all text-left group cursor-pointer flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                    <FileText size={14} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">Template Library</h3>
                    <p className="text-[8.5px] text-slate-400 font-medium leading-tight">Use saved templates</p>
                  </div>
                </button>

                <button onClick={() => showToast('Schedule broadcast modal opened')} className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/30 transition-all text-left group cursor-pointer flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">Schedule Broadcast</h3>
                    <p className="text-[8.5px] text-slate-400 font-medium leading-tight">Schedule for later</p>
                  </div>
                </button>

                <button onClick={() => showToast('Viewing analytics report')} className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-400 bg-slate-50/50 hover:bg-sky-50/30 transition-all text-left group cursor-pointer flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                    <BarChart3 size={14} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">View Analytics</h3>
                    <p className="text-[8.5px] text-slate-400 font-medium leading-tight">Broadcast performance</p>
                  </div>
                </button>

                <button onClick={() => showToast('Alert rule creator opened')} className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 transition-all text-left group cursor-pointer flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center shrink-0">
                    <Settings size={14} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">Create Alert Rule</h3>
                    <p className="text-[8.5px] text-slate-400 font-medium leading-tight">Automated alerts</p>
                  </div>
                </button>
              </div>
            </div>

          </div>



        </div>
      ) : selectedCategory === 'Customer Communications' ? (
        /* ========================================================================= */
        /* RENDER VIEW: 12.3 CUSTOMER COMMUNICATIONS MATCHING SCREENSHOT 2           */
        /* ========================================================================= */
        <div className="space-y-4">

          {/* SEARCH AND FILTERS BAR (For 12.3 Customer Communications) */}
          <div className="bg-white border border-slate-200/80 rounded-lg p-2 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers, messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-slate-50/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Dropdown 1: Communication Types */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenCategoryDropdown(!openCategoryDropdown); setOpenParticipantDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedCategory}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {[
                    'All Categories',
                    'Conversations',
                    'Customer Communications',
                    'Broadcast & Notifications',
                    'Templates & Automation'
                  ].map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setOpenCategoryDropdown(false); showToast(`Navigated to ${cat}`); }}
                      className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 2: All Customers */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenParticipantDropdown(!openParticipantDropdown); setOpenCategoryDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>All Customers</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openParticipantDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {['All Customers', 'ABC Logistics', 'Global Retail Solutions', 'Fast Freight Pty Ltd', 'Sydney Car Movers'].map(part => (
                    <button
                      key={part}
                      onClick={() => { setSelectedParticipant(part); setOpenParticipantDropdown(false); }}
                      className="w-full text-left px-3 py-1.5 font-semibold transition-colors hover:bg-slate-50 text-slate-700"
                    >
                      {part}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 3: Branches */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenBranchDropdown(!openBranchDropdown); setOpenCategoryDropdown(false); setOpenParticipantDropdown(false); setOpenStatusDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedBranch}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openBranchDropdown && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {['All Branches', 'Sydney Branch', 'Melbourne Branch', 'Brisbane Branch', 'Perth Branch'].map(b => (
                    <button
                      key={b}
                      onClick={() => { setSelectedBranch(b); setOpenBranchDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedBranch === b ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>{b}</span>
                      {selectedBranch === b && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 4: Status */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenStatusDropdown(!openStatusDropdown); setOpenCategoryDropdown(false); setOpenParticipantDropdown(false); setOpenBranchDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedStatus}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {['All Status', 'Delivered', 'Opened', 'Pending', 'Failed'].map(st => (
                    <button
                      key={st}
                      onClick={() => { setSelectedStatus(st); setOpenStatusDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedStatus === st ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>{st}</span>
                      {selectedStatus === st && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Picker Input */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <Calendar size={13} className="text-slate-400" />
                <span>{dateRange}</span>
                <Calendar size={13} className="text-slate-400" />
              </button>

              {showDatePicker && (
                <div className="absolute top-full right-0 mt-1 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2.5 text-xs">
                  <div className="font-bold text-slate-900 mb-1.5">Select Date Range</div>
                  <div className="space-y-1">
                    {['01 May 2025 - 31 May 2025', '01 Apr 2025 - 30 Apr 2025', 'Q1 2025 (Jan - Mar)', 'Year to Date 2025'].map(range => (
                      <button
                        key={range}
                        onClick={() => { setDateRange(range); setShowDatePicker(false); showToast(`Date updated: ${range}`); }}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-medium cursor-pointer ${dateRange === range ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <Filter size={13} className="text-slate-500" />
                <span>Filters</span>
              </button>

              <button
                onClick={() => showToast('Refreshing data...')}
                className="p-1.5 text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <RefreshCw size={13} className="text-slate-500" />
              </button>
            </div>
          </div>

          {/* 6 TOP KPI METRIC CARDS (EXACT SCREENSHOT 2) */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-2.5">
            {/* Metric 1 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4338CA] flex items-center justify-center shrink-0 mt-0.5">
                <Inbox size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] xl:text-[8px] 2xl:text-[9px] font-black text-slate-400 uppercase tracking-tight block truncate" title="TOTAL COMMUNICATIONS (MTD)">TOTAL COMMUNICATIONS (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8px] xl:text-[8.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No communications yet</div>
                <button
                  onClick={() => showToast('Viewing communications analytics')}
                  className="text-[8px] xl:text-[8.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer whitespace-nowrap truncate"
                >
                  <span>View analytics</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0 mt-0.5">
                <Mail size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] xl:text-[8px] 2xl:text-[9px] font-black text-slate-400 uppercase tracking-tight block truncate" title="EMAILS SENT (MTD)">EMAILS SENT (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8px] xl:text-[8.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No emails sent yet</div>
                <button
                  onClick={() => showToast('Viewing email report')}
                  className="text-[8px] xl:text-[8.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer whitespace-nowrap truncate"
                >
                  <span>View email report</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                <Phone size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] xl:text-[8px] 2xl:text-[9px] font-black text-slate-400 uppercase tracking-tight block truncate" title="SMS SENT (MTD)">SMS SENT (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8px] xl:text-[8.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No SMS sent yet</div>
                <button
                  onClick={() => showToast('Viewing SMS report')}
                  className="text-[8px] xl:text-[8.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer whitespace-nowrap truncate"
                >
                  <span>View SMS report</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                <Truck size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] xl:text-[8px] 2xl:text-[9px] font-black text-slate-400 uppercase tracking-tight block truncate" title="DELIVERY NOTIFICATIONS (MTD)">DELIVERY NOTIFICATIONS (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8px] xl:text-[8.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No notifications</div>
                <button
                  onClick={() => showToast('Viewing delivery report')}
                  className="text-[8px] xl:text-[8.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer whitespace-nowrap truncate"
                >
                  <span>View delivery report</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 5 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 mt-0.5">
                <FileText size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] xl:text-[8px] 2xl:text-[9px] font-black text-slate-400 uppercase tracking-tight block truncate" title="POD SHARED (MTD)">POD SHARED (MTD)</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8px] xl:text-[8.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No PODs shared</div>
                <button
                  onClick={() => showToast('Viewing POD report')}
                  className="text-[8px] xl:text-[8.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer whitespace-nowrap truncate"
                >
                  <span>View POD report</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 6 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7.5px] xl:text-[8px] 2xl:text-[9px] font-black text-slate-400 uppercase tracking-tight block truncate" title="AVG RESPONSE TIME">AVG RESPONSE TIME</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">—</div>
                <div className="text-[8px] xl:text-[8.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No data yet</div>
                <button
                  onClick={() => showToast('Viewing response performance')}
                  className="text-[8px] xl:text-[8.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer whitespace-nowrap truncate"
                >
                  <span>View performance</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAIN 3-COLUMN WORKSPACE ROW (SIDE-BY-SIDE MATCHING SCREENSHOT 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">

            {/* COLUMN 1: CUSTOMER COMMUNICATIONS (Span 3 ~25% Width) */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col justify-between h-[500px]">
              <div className="flex flex-col h-full overflow-hidden">

                {/* Header Title & Sub-tabs */}
                <div className="mb-2">
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">CUSTOMER COMMUNICATIONS</h2>

                  {/* Sub-tab pills */}
                  <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg text-[9.5px] font-extrabold text-slate-600">
                    {[
                      { key: 'All', label: 'All' },
                      { key: 'Emails', label: 'Emails' },
                      { key: 'SMS', label: 'SMS' },
                      { key: 'System', label: 'System' }
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setCustomerSubTab(tab.key)}
                        className={`flex-1 py-1 px-1 rounded-md transition-all cursor-pointer text-center truncate ${customerSubTab === tab.key ? 'bg-white text-blue-600 shadow-xs font-black' : 'hover:bg-slate-200/60'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer List Scrollable Area */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 mt-1">
                  {filteredCustomers.length > 0 ? filteredCustomers.map(c => {
                    const isSelected = activeCustomerId === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setActiveCustomerId(c.id)}
                        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-start justify-between group ${isSelected ? 'bg-[#EEF2FF]/70 border-[#6366F1]/40 shadow-xs' : 'border-slate-100 hover:border-slate-200 bg-slate-50/20 hover:bg-slate-50'}`}
                      >
                        <div className="flex items-start gap-2 overflow-hidden pr-1 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-[10px] mt-0.5 shadow-2xs ${c.avatarBg}`}>
                            {c.initials}
                          </div>
                          <div className="truncate min-w-0">
                            <h3 className="text-[11px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">{c.name}</h3>
                            <p className="text-[9.5px] text-slate-500 font-semibold leading-snug truncate mt-0.5">{c.preview}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 ml-1">
                          <span className="text-[9px] font-bold text-slate-400 leading-none mb-1.5">{c.time}</span>
                          {c.badge ? (
                            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center shadow-2xs">
                              {c.badge}
                            </span>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                          )}
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <Users size={28} className="text-slate-200 mb-2" />
                      <p className="text-[10px] font-bold text-slate-400">No customer communications</p>
                      <p className="text-[9px] text-slate-300 font-medium mt-0.5">Select a customer to start communicating</p>
                      <button onClick={() => setShowNewCommunicationModal(true)} className="mt-3 text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer">+ New Communication</button>
                    </div>
                  )}
                </div>

                {/* Footer link */}
                <div className="pt-2 border-t border-slate-100 mt-2 text-center shrink-0">
                  <button onClick={() => showToast('All customers loaded')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 cursor-pointer w-full">
                    <span>View all customers</span>
                    <span>→</span>
                  </button>
                </div>

              </div>
            </div>

            {/* COLUMN 2: COMMUNICATION HISTORY (Span 5 ~45% Width) */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col justify-between h-[500px]">
              <div className="flex flex-col h-full overflow-hidden">

                {/* Section Title & View All */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 shrink-0">
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">COMMUNICATION HISTORY</h2>
                  <button onClick={() => showToast('Viewing full history...')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                    <span>View All</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Timeline Logs Scrollable List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {communicationHistory.length > 0 ? communicationHistory.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50 transition-all flex items-start gap-2.5 group cursor-pointer"
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${item.iconBg}`}>
                          <ItemIcon size={14} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="text-[11px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">{item.title}</h3>
                            <span className="text-[9px] font-bold text-slate-400 shrink-0">{item.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-600 font-semibold leading-snug mt-0.5 truncate">{item.desc}</p>

                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100/60">
                            <span className="text-[9px] font-bold text-slate-400 truncate">{item.recipient}</span>
                            <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full border ${item.statusBg}`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <Inbox size={32} className="text-slate-200 mb-2" />
                      <p className="text-[11px] font-bold text-slate-400">No communication history</p>
                      <p className="text-[9.5px] text-slate-300 font-medium mt-0.5">Logs will record here as you send messages</p>
                    </div>
                  )}
                </div>

                {/* Footer link */}
                <div className="pt-2 border-t border-slate-100 mt-2 text-center shrink-0">
                  <button onClick={() => showToast('Opening full history log')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 cursor-pointer w-full">
                    <span>View full communication history</span>
                    <span>→</span>
                  </button>
                </div>

              </div>
            </div>

            {/* COLUMN 3: CUSTOMER DETAILS & QUICK ACTIONS (Span 4 ~30% Width) */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col justify-between h-[500px] overflow-y-auto">
              <div>

                {/* Section 1: Customer Details Header */}
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">CUSTOMER DETAILS</h2>
                  <button onClick={() => showToast(`Edit ${activeCustomer.name}`)} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer">
                    <span>Edit</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Profile Summary Card */}
                <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl text-center mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto font-black text-sm shadow-xs border-2 border-white ${activeCustomer.avatarBg}`}>
                    {activeCustomer.initials}
                  </div>

                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <h3 className="text-xs font-black text-slate-900">{activeCustomer.name}</h3>
                    <span className="text-[8.5px] font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>

                  {/* Info details */}
                  <div className="mt-2 space-y-1 text-left text-[10px] font-semibold text-slate-600 border-t border-slate-200/60 pt-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{activeCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{activeCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{activeCustomer.address}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: COMMUNICATION PREFERENCES */}
                <div className="mb-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">COMMUNICATION PREFERENCES</h3>

                  <div className="space-y-1 text-[10.5px]">
                    {[
                      { key: 'email', label: 'Email Notifications', status: customerPreferences.email },
                      { key: 'sms', label: 'SMS Notifications', status: customerPreferences.sms },
                      { key: 'delivery', label: 'Delivery Notifications', status: customerPreferences.delivery },
                      { key: 'pod', label: 'POD Sharing', status: customerPreferences.pod },
                      { key: 'invoice', label: 'Invoice Notifications', status: customerPreferences.invoice },
                      { key: 'marketing', label: 'Marketing Communications', status: customerPreferences.marketing }
                    ].map(pref => (
                      <div key={pref.key} className="flex items-center justify-between p-1.5 rounded-lg border border-slate-100 bg-slate-50/40">
                        <span className="font-bold text-slate-700">{pref.label}</span>
                        <button
                          onClick={() => {
                            setCustomerPreferences(p => ({ ...p, [pref.key]: !p[pref.key] }));
                            showToast(`${pref.label} updated`);
                          }}
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full border cursor-pointer ${pref.status ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}
                        >
                          {pref.status ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => showToast('Manage preferences modal opened')} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5 mt-2 cursor-pointer">
                    <span>Manage preferences</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Section 3: QUICK ACTIONS */}
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">QUICK ACTIONS</h3>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowNewCommunicationModal(true)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/40 transition-all text-left flex items-center gap-2 group cursor-pointer shadow-2xs hover:shadow-xs"
                    >
                      <div className="w-6.5 h-6.5 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Mail size={13} />
                      </div>
                      <span className="text-[10.5px] font-extrabold text-slate-800 group-hover:text-blue-600 truncate">Send Email</span>
                    </button>

                    <button
                      onClick={() => setShowNewCommunicationModal(true)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/70 hover:bg-emerald-50/40 transition-all text-left flex items-center gap-2 group cursor-pointer shadow-2xs hover:shadow-xs"
                    >
                      <div className="w-6.5 h-6.5 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <MessageSquare size={13} />
                      </div>
                      <span className="text-[10.5px] font-extrabold text-slate-800 group-hover:text-emerald-600 truncate">Send SMS</span>
                    </button>

                    <button
                      onClick={() => { setShowNewCommunicationModal(true); showToast('Selected: Delivery Update'); }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-400 bg-slate-50/70 hover:bg-sky-50/40 transition-all text-left flex items-center gap-2 group cursor-pointer shadow-2xs hover:shadow-xs"
                    >
                      <div className="w-6.5 h-6.5 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                        <Truck size={13} />
                      </div>
                      <span className="text-[10.5px] font-extrabold text-slate-800 group-hover:text-sky-600 truncate">Send Delivery Update</span>
                    </button>

                    <button
                      onClick={() => showToast(`Sharing POD for ${activeCustomer.name}...`)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/40 transition-all text-left flex items-center gap-2 group cursor-pointer shadow-2xs hover:shadow-xs"
                    >
                      <div className="w-6.5 h-6.5 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <FileText size={13} />
                      </div>
                      <span className="text-[10.5px] font-extrabold text-slate-800 group-hover:text-amber-600 truncate">Share POD</span>
                    </button>

                    <button
                      onClick={() => showToast(`Sending Invoice to ${activeCustomer.name}...`)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50/70 hover:bg-purple-50/40 transition-all text-left flex items-center gap-2 group cursor-pointer shadow-2xs hover:shadow-xs"
                    >
                      <div className="w-6.5 h-6.5 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <FileText size={13} />
                      </div>
                      <span className="text-[10.5px] font-extrabold text-slate-800 group-hover:text-purple-600 truncate">Send Invoice</span>
                    </button>

                    <button
                      onClick={() => setShowNewTemplateModal(true)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/40 transition-all text-left flex items-center gap-2 group cursor-pointer shadow-2xs hover:shadow-xs"
                    >
                      <div className="w-6.5 h-6.5 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <Plus size={13} />
                      </div>
                      <span className="text-[10.5px] font-extrabold text-slate-800 group-hover:text-indigo-600 truncate">Create Template</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>



        </div>
      ) : selectedCategory === 'Conversations' ? (
        /* ========================================================================= */
        /* RENDER VIEW: 12.2 CONVERSATIONS PAGE MATCHING SCREENSHOT 2                */
        /* ========================================================================= */
        <div className="space-y-4">

          {/* SEARCH AND FILTERS BAR (For 12.2 Conversations) */}
          <div className="bg-white border border-slate-200/80 rounded-lg p-2 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-slate-50/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Dropdown 1: Categories */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenCategoryDropdown(!openCategoryDropdown); setOpenParticipantDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedCategory}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {[
                    'All Categories',
                    'Conversations',
                    'Customer Communications',
                    'Broadcast & Notifications',
                    'Templates & Automation'
                  ].map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setOpenCategoryDropdown(false); showToast(`Navigated to ${cat}`); }}
                      className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 2: Participants */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenParticipantDropdown(!openParticipantDropdown); setOpenCategoryDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedParticipant}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openParticipantDropdown && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {['All Participants', 'Drivers', 'Customers', 'Internal Team', 'System Alerts'].map(part => (
                    <button
                      key={part}
                      onClick={() => { setSelectedParticipant(part); setOpenParticipantDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedParticipant === part ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>{part}</span>
                      {selectedParticipant === part && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 3: Branches */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenBranchDropdown(!openBranchDropdown); setOpenCategoryDropdown(false); setOpenParticipantDropdown(false); setOpenStatusDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedBranch}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openBranchDropdown && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {['All Branches', 'Sydney Branch', 'Melbourne Branch', 'Brisbane Branch', 'Perth Branch'].map(b => (
                    <button
                      key={b}
                      onClick={() => { setSelectedBranch(b); setOpenBranchDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedBranch === b ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>{b}</span>
                      {selectedBranch === b && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 4: Status */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenStatusDropdown(!openStatusDropdown); setOpenCategoryDropdown(false); setOpenParticipantDropdown(false); setOpenBranchDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedStatus}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {['All Status', 'Unread', 'Read', 'Archived', 'Flagged'].map(st => (
                    <button
                      key={st}
                      onClick={() => { setSelectedStatus(st); setOpenStatusDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedStatus === st ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>{st}</span>
                      {selectedStatus === st && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Picker Input */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <Calendar size={13} className="text-slate-400" />
                <span>{dateRange}</span>
                <Calendar size={13} className="text-slate-400" />
              </button>

              {showDatePicker && (
                <div className="absolute top-full right-0 mt-1 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2.5 text-xs">
                  <div className="font-bold text-slate-900 mb-1.5">Select Date Range</div>
                  <div className="space-y-1">
                    {['01 May 2025 - 31 May 2025', '01 Apr 2025 - 30 Apr 2025', 'Q1 2025 (Jan - Mar)', 'Year to Date 2025'].map(range => (
                      <button
                        key={range}
                        onClick={() => { setDateRange(range); setShowDatePicker(false); showToast(`Date updated: ${range}`); }}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-medium cursor-pointer ${dateRange === range ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <Filter size={13} className="text-slate-500" />
                <span>Filters</span>
              </button>

              <button
                onClick={() => showToast('Refreshing data...')}
                className="p-1.5 text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <RefreshCw size={13} className="text-slate-500" />
              </button>
            </div>
          </div>

          {/* MAIN 3-COLUMN WORKSPACE ROW MATCHING SCREENSHOT 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">

            {/* COLUMN 1: CONVERSATIONS LIST (Span 3 ~25% Width) */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col justify-between h-[500px]">
              <div className="flex flex-col h-full overflow-hidden">

                {/* Header Title & Sub-tabs */}
                <div className="mb-2">
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">CONVERSATIONS</h2>

                  {/* Sub-tab pills: All, Direct, Groups, Teams, + */}
                  <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg text-[10px] font-extrabold text-slate-600">
                    {['All', 'Direct', 'Groups', 'Teams'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setConversationSubTab(tab)}
                        className={`flex-1 py-1 px-1.5 rounded-md transition-all cursor-pointer text-center ${conversationSubTab === tab ? 'bg-white text-blue-600 shadow-xs font-black' : 'hover:bg-slate-200/60'}`}
                      >
                        {tab}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowNewMessageModal(true)}
                      className="p-1 rounded-md bg-white hover:bg-slate-200 text-slate-700 shadow-xs cursor-pointer"
                    >
                      <Plus size={11} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Contacts List Scrollable Area */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 mt-1">
                  {filteredContacts.map(c => {
                    const isSelected = activeContactId === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setActiveContactId(c.id)}
                        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-start justify-between group ${isSelected ? 'bg-[#EEF2FF]/70 border-[#6366F1]/40 shadow-xs' : 'border-slate-100 hover:border-slate-200 bg-slate-50/20 hover:bg-slate-50'}`}
                      >
                        <div className="flex items-start gap-2 overflow-hidden pr-1 min-w-0">
                          {c.avatarImg ? (
                            <img src={c.avatarImg} alt={c.name} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 shadow-2xs" />
                          ) : (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-[10px] mt-0.5 shadow-2xs ${c.avatarBg}`}>
                              {c.initials}
                            </div>
                          )}
                          <div className="truncate min-w-0">
                            <h3 className="text-[11px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">{c.name}</h3>
                            <p className="text-[9px] text-slate-400 font-bold leading-tight truncate mt-0.5">{c.role}</p>
                            <p className="text-[9.5px] text-slate-600 font-semibold leading-snug truncate mt-0.5">{c.preview}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 ml-1">
                          <span className="text-[9px] font-bold text-slate-400 leading-none mb-1.5">{c.time}</span>
                          {c.badge ? (
                            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center shadow-2xs">
                              {c.badge}
                            </span>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer link */}
                <div className="pt-2 border-t border-slate-100 mt-2 text-center shrink-0">
                  <button onClick={() => showToast('All conversations loaded')} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 cursor-pointer w-full">
                    <span>View all conversations</span>
                    <span>→</span>
                  </button>
                </div>

              </div>
            </div>

            {/* COLUMN 2: ACTIVE LIVE CHAT AREA (Span 6 ~50% Width) */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex flex-col justify-between h-[500px] overflow-hidden">

              {/* Active Chat Header */}
              <div className="p-3 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  {activeContact.avatarImg ? (
                    <img src={activeContact.avatarImg} alt={activeContact.name} className="w-8 h-8 rounded-full object-cover shadow-2xs" />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] shadow-2xs ${activeContact.avatarBg}`}>
                      {activeContact.initials}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 leading-tight">{activeContact.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9.5px] font-bold text-slate-400">{activeContact.role}</span>
                      <span className="text-[9.5px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                {/* Header Action Icons */}
                <div className="flex items-center gap-1.5">
                  <button onClick={() => showToast(`Calling ${activeContact.name}...`)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer">
                    <Phone size={14} />
                  </button>
                  <button onClick={() => showToast(`Starting video call with ${activeContact.name}...`)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer">
                    <Video size={14} />
                  </button>
                  <button onClick={() => showToast('Conversation info')} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer">
                    <Info size={14} />
                  </button>
                  <button onClick={() => showToast('More chat options')} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>

              {/* Scrollable Live Chat Messages Area */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-[#F8FAFC]">

                {(chatMessages[activeContactId] || [
                  { id: 1, text: activeContact.preview || "Hi! How can I assist you with your delivery today?", time: activeContact.time || "Today", sender: activeContact.name || "Contact", isMe: false, dateDivider: 'Today' }
                ]).map((msg) => (
                  <React.Fragment key={msg.id}>

                    {/* Date Divider pill */}
                    {msg.dateDivider && (
                      <div className="flex items-center justify-center my-2">
                        <span className="text-[9.5px] font-bold text-slate-400 bg-white border border-slate-200 px-3 py-0.5 rounded-full shadow-2xs">
                          {msg.dateDivider}
                        </span>
                      </div>
                    )}

                    {/* Chat Bubble Container */}
                    <div className={`flex items-start gap-2 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!msg.isMe && (
                        activeContact.avatarImg ? (
                          <img src={activeContact.avatarImg} alt={activeContact.name} className="w-6 h-6 rounded-full object-cover mt-0.5 shrink-0 shadow-2xs" />
                        ) : (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[8.5px] mt-0.5 shrink-0 shadow-2xs ${activeContact.avatarBg}`}>
                            {activeContact.initials}
                          </div>
                        )
                      )}

                      <div className={`max-w-[75%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                        {/* Bubble */}
                        <div className={`p-2.5 rounded-2xl text-xs font-medium leading-relaxed ${msg.isMe ? 'bg-[#2563EB] text-white rounded-tr-xs shadow-xs' : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-xs'}`}>
                          <p>{msg.text}</p>

                          {/* PDF Attachment Box if present */}
                          {msg.attachment && (
                            <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-slate-800 shadow-2xs">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-7 h-7 rounded bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                                  <FileText size={14} />
                                </div>
                                <div className="truncate">
                                  <p className="text-[10px] font-extrabold text-slate-900 truncate">{msg.attachment.name}</p>
                                  <p className="text-[8.5px] text-slate-400 font-bold">{msg.attachment.type} • {msg.attachment.size}</p>
                                </div>
                              </div>
                              <button onClick={() => showToast(`Downloading ${msg.attachment.name}...`)} className="p-1 text-slate-500 hover:text-blue-600 rounded cursor-pointer">
                                <Download size={13} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Timestamp & Double Check */}
                        <div className="flex items-center gap-1 mt-0.5 px-1">
                          <span className="text-[8.5px] font-bold text-slate-400">{msg.time}</span>
                          {msg.isMe && <CheckCheck size={11} className="text-blue-600" />}
                        </div>
                      </div>
                    </div>

                  </React.Fragment>
                ))}

              </div>

              {/* Chat Input Bar */}
              <div className="p-2.5 border-t border-slate-200/80 bg-white flex items-center gap-2 shrink-0">
                <button onClick={() => showToast('Attach file')} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer">
                  <Paperclip size={15} />
                </button>

                <input
                  type="text"
                  placeholder="Type your message..."
                  value={activeChatInput}
                  onChange={(e) => setActiveChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendLiveMessage()}
                  className="flex-1 px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
                />

                <button onClick={() => showToast('Insert emoji')} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer">
                  <Smile size={15} />
                </button>

                <button
                  onClick={handleSendLiveMessage}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white p-2 rounded-lg transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>

            </div>

            {/* COLUMN 3: CONVERSATION DETAILS (Span 3 ~25% Width) */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col justify-between h-[500px] overflow-y-auto">
              <div>
                {/* Section Title & Options */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">CONVERSATION DETAILS</h2>
                  <button onClick={() => showToast('Details options')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <MoreVertical size={13} />
                  </button>
                </div>

                {/* Profile Summary Card */}
                <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl text-center mb-3">
                  {activeContact.avatarImg ? (
                    <img src={activeContact.avatarImg} alt={activeContact.name} className="w-12 h-12 rounded-full object-cover mx-auto shadow-xs border-2 border-white" />
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto font-black text-sm shadow-xs border-2 border-white ${activeContact.avatarBg}`}>
                      {activeContact.initials}
                    </div>
                  )}
                  <h3 className="text-xs font-black text-slate-900 mt-2">{activeContact.name}</h3>
                  <p className="text-[9.5px] text-slate-400 font-bold leading-tight mt-0.5">{activeContact.role}</p>

                  <div className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </div>

                  <div className="mt-2.5">
                    <button onClick={() => showToast(`Opening profile of ${activeContact.name}...`)} className="text-[10px] font-extrabold text-[#4338CA] hover:underline bg-white border border-slate-200 px-3 py-1 rounded-md shadow-2xs cursor-pointer">
                      View Profile
                    </button>
                  </div>
                </div>

                {/* CONVERSATION INFO */}
                <div className="mb-3 space-y-1.5 text-xs">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">CONVERSATION INFO</h3>

                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="font-semibold text-slate-500">Type</span>
                    <span className="font-extrabold text-slate-900">{activeContact.type}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="font-semibold text-slate-500">Created On</span>
                    <span className="font-extrabold text-slate-900">17 Apr 2025, 09:12 AM</span>
                  </div>

                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="font-semibold text-slate-500">Created By</span>
                    <span className="font-extrabold text-slate-900">Sarah Mitchell</span>
                  </div>

                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="font-semibold text-slate-500">Participants</span>
                    <span className="font-extrabold text-slate-900">2</span>
                  </div>

                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="font-semibold text-slate-500">Last Message</span>
                    <span className="font-extrabold text-slate-900">Today, 10:08 AM</span>
                  </div>
                </div>

                {/* SHARED FILES SECTION */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">SHARED FILES</h3>
                    <button onClick={() => showToast('Opening shared files')} className="text-[9.5px] font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5">
                      <span>View All</span>
                      <span>→</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="p-1.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 rounded bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                          <FileText size={12} />
                        </div>
                        <div className="truncate">
                          <p className="text-[10px] font-extrabold text-slate-900 truncate">POD_LD-1057.pdf</p>
                          <p className="text-[8.5px] text-slate-400 font-bold">Today, 10:08 AM • 1.2 MB</p>
                        </div>
                      </div>
                      <button onClick={() => showToast('Downloading file...')} className="p-1 text-slate-400 hover:text-slate-700">
                        <Download size={12} />
                      </button>
                    </div>

                    <div className="p-1.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <ImageIcon size={12} />
                        </div>
                        <div className="truncate">
                          <p className="text-[10px] font-extrabold text-slate-900 truncate">Photo_20250523_0910.jpg</p>
                          <p className="text-[8.5px] text-slate-400 font-bold">23 May 2025, 09:10 AM • 2.4 MB</p>
                        </div>
                      </div>
                      <button onClick={() => showToast('Downloading file...')} className="p-1 text-slate-400 hover:text-slate-700">
                        <Download size={12} />
                      </button>
                    </div>

                    <div className="p-1.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText size={12} />
                        </div>
                        <div className="truncate">
                          <p className="text-[10px] font-extrabold text-slate-900 truncate">Delivery_Instructions.docx</p>
                          <p className="text-[8.5px] text-slate-400 font-bold">17 Apr 2025, 09:15 AM • 120 KB</p>
                        </div>
                      </div>
                      <button onClick={() => showToast('Downloading file...')} className="p-1 text-slate-400 hover:text-slate-700">
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ACTIONS SECTION */}
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">ACTIONS</h3>

                  <button onClick={() => showToast('Search in conversation')} className="w-full text-left p-1.5 rounded-lg hover:bg-slate-50 text-[10.5px] font-extrabold text-slate-700 flex items-center gap-2 cursor-pointer">
                    <Search size={13} className="text-slate-400" />
                    <span>Search in Conversation</span>
                  </button>

                  <button onClick={() => showToast('Notifications muted')} className="w-full text-left p-1.5 rounded-lg hover:bg-slate-50 text-[10.5px] font-extrabold text-slate-700 flex items-center gap-2 cursor-pointer">
                    <VolumeX size={13} className="text-slate-400" />
                    <span>Mute Notifications</span>
                  </button>

                  <button onClick={() => showToast('Add participant dialog')} className="w-full text-left p-1.5 rounded-lg hover:bg-slate-50 text-[10.5px] font-extrabold text-slate-700 flex items-center gap-2 cursor-pointer">
                    <UserPlus size={13} className="text-slate-400" />
                    <span>Add Participants</span>
                  </button>

                  <button onClick={() => showToast('Delete conversation confirm')} className="w-full text-left p-1.5 rounded-lg hover:bg-rose-50 text-[10.5px] font-extrabold text-rose-600 flex items-center gap-2 cursor-pointer">
                    <Trash2 size={13} className="text-rose-500" />
                    <span>Delete Conversation</span>
                  </button>
                </div>
              </div>
            </div>

          </div>



        </div>
      ) : (
        /* ========================================================================= */
        /* RENDER VIEW: 12.1 MESSAGES DASHBOARD PAGE (EXACT SCREENSHOT 2 ROW ORDER)  */
        /* ========================================================================= */
        <div className="space-y-4">

          {/* ROW 1: 6 KPI METRIC CARDS (EXACT SCREENSHOT 2 POSITIONS) */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-2.5">
            {/* Metric 1 - Linked to Conversations */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4338CA] flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] 2xl:text-[9.5px] font-black text-slate-400 uppercase tracking-wider block truncate">UNREAD MESSAGES</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">{contactsList.filter(c => c.badge).reduce((s, c) => s + (c.badge || 0), 0) || 0}</div>
                <div className="text-[8.5px] 2xl:text-[9.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">Live count from conversations</div>
                <button
                  onClick={() => { setSelectedCategory('Conversations'); showToast('Opened Conversations'); }}
                  className="text-[8.5px] 2xl:text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1.5 cursor-pointer whitespace-nowrap truncate"
                >
                  <span>View all messages</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 2 - Linked to Conversations */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] 2xl:text-[9.5px] font-black text-slate-400 uppercase tracking-wider block truncate">TOTAL CONVERSATIONS</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">{contactsList.length}</div>
                <div className="text-[8.5px] 2xl:text-[9.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">Live count from conversations</div>
                <button
                  onClick={() => { setSelectedCategory('Conversations'); showToast('Opened Conversations'); }}
                  className="text-[8.5px] 2xl:text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1.5 cursor-pointer whitespace-nowrap truncate"
                >
                  <span>View all conversations</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 3 - Linked to Conversations */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] 2xl:text-[9.5px] font-black text-slate-400 uppercase tracking-wider block truncate">PENDING REPLIES</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8.5px] 2xl:text-[9.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No pending replies</div>
                <button
                  onClick={() => { setSelectedCategory('Conversations'); showToast('Opened Conversations'); }}
                  className="text-[8.5px] 2xl:text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1.5 cursor-pointer whitespace-nowrap truncate"
                >
                  <span>View pending</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 4 - Linked to Broadcast & Notifications */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                <Megaphone size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] 2xl:text-[9.5px] font-black text-slate-400 uppercase tracking-wider block truncate">ANNOUNCEMENTS</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">{recentBroadcasts.length}</div>
                <div className="text-[8.5px] 2xl:text-[9.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">Total broadcasts sent</div>
                <button
                  onClick={() => { setSelectedCategory('Broadcast & Notifications'); showToast('Opened Broadcast & Notifications'); }}
                  className="text-[8.5px] 2xl:text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1.5 cursor-pointer whitespace-nowrap truncate"
                >
                  <span>View all announcements</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 5 - Linked to Templates & Automation */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0 mt-0.5">
                <Send size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] 2xl:text-[9.5px] font-black text-slate-400 uppercase tracking-wider block truncate">SENT THIS MONTH</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">0</div>
                <div className="text-[8.5px] 2xl:text-[9.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No messages sent yet</div>
                <button
                  onClick={() => { setSelectedCategory('Templates & Automation'); showToast('Opened Templates & Automation'); }}
                  className="text-[8.5px] 2xl:text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1.5 cursor-pointer whitespace-nowrap truncate"
                >
                  <span>View message analytics</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Metric 6 - Linked to Customer Communications */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow flex items-start gap-2.5 w-full overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#FCE7F3] text-[#DB2777] flex items-center justify-center shrink-0 mt-0.5">
                <Activity size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] 2xl:text-[9.5px] font-black text-slate-400 uppercase tracking-wider block truncate">DELIVERY SUCCESS RATE</span>
                <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 whitespace-nowrap">—</div>
                <div className="text-[8.5px] 2xl:text-[9.5px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">No data yet</div>
                <button
                  onClick={() => { setSelectedCategory('Customer Communications'); showToast('Opened Customer Communications'); }}
                  className="text-[8.5px] 2xl:text-[9.5px] font-bold text-[#4338CA] hover:underline flex items-center gap-0.5 mt-1.5 cursor-pointer whitespace-nowrap truncate"
                >
                  <span>View delivery report</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* ROW 2: SEARCH AND FILTERS BAR (EXACT SCREENSHOT 2 POSITION BELOW KPI CARDS) */}
          <div className="bg-white border border-slate-200/80 rounded-lg p-2 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full">
            {/* Search input */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages, contacts, conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs font-semibold bg-slate-50/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Dropdown 1: Categories */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenCategoryDropdown(!openCategoryDropdown); setOpenParticipantDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedCategory}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {[
                    'All Categories',
                    'Conversations',
                    'Customer Communications',
                    'Broadcast & Notifications',
                    'Templates & Automation'
                  ].map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setOpenCategoryDropdown(false); showToast(`Navigated to ${cat}`); }}
                      className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 2: Participants */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenParticipantDropdown(!openParticipantDropdown); setOpenCategoryDropdown(false); setOpenBranchDropdown(false); setOpenStatusDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedParticipant}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openParticipantDropdown && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {['All Participants', 'Drivers', 'Customers', 'Internal Team', 'System Alerts'].map(part => (
                    <button
                      key={part}
                      onClick={() => { setSelectedParticipant(part); setOpenParticipantDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedParticipant === part ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>{part}</span>
                      {selectedParticipant === part && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 3: Branches */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenBranchDropdown(!openBranchDropdown); setOpenCategoryDropdown(false); setOpenParticipantDropdown(false); setOpenStatusDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedBranch}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openBranchDropdown && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {['All Branches', 'Sydney Branch', 'Melbourne Branch', 'Brisbane Branch', 'Perth Branch'].map(b => (
                    <button
                      key={b}
                      onClick={() => { setSelectedBranch(b); setOpenBranchDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedBranch === b ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>{b}</span>
                      {selectedBranch === b && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 4: Status */}
            <div className="relative shrink-0">
              <button
                onClick={() => { setOpenStatusDropdown(!openStatusDropdown); setOpenCategoryDropdown(false); setOpenParticipantDropdown(false); setOpenBranchDropdown(false); }}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <span>{selectedStatus}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {openStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 text-xs">
                  {['All Status', 'Unread', 'Read', 'Archived', 'Flagged'].map(st => (
                    <button
                      key={st}
                      onClick={() => { setSelectedStatus(st); setOpenStatusDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 font-semibold transition-colors flex items-center justify-between ${selectedStatus === st ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span>{st}</span>
                      {selectedStatus === st && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Picker Input */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full md:w-auto flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <Calendar size={13} className="text-slate-400" />
                <span>{dateRange}</span>
                <Calendar size={13} className="text-slate-400" />
              </button>

              {showDatePicker && (
                <div className="absolute top-full right-0 mt-1 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2.5 text-xs">
                  <div className="font-bold text-slate-900 mb-1.5">Select Date Range</div>
                  <div className="space-y-1">
                    {['01 May 2025 - 31 May 2025', '01 Apr 2025 - 30 Apr 2025', 'Q1 2025 (Jan - Mar)', 'Year to Date 2025'].map(range => (
                      <button
                        key={range}
                        onClick={() => { setDateRange(range); setShowDatePicker(false); showToast(`Date updated: ${range}`); }}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-medium cursor-pointer ${dateRange === range ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <Filter size={13} className="text-slate-500" />
                <span>Filters</span>
              </button>

              <button
                onClick={() => showToast('Refreshing data...')}
                className="p-1.5 text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
              >
                <RefreshCw size={13} className="text-slate-500" />
              </button>
            </div>
          </div>

          {/* MIDDLE DASHBOARD ROW (3 COLUMNS SIDE BY SIDE) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">

            {/* COLUMN 1: INBOX (UNREAD FIRST) (Span 3 - Linked to Conversations) */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col justify-between w-full">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">INBOX (UNREAD FIRST)</h2>
                  <button onClick={() => { setSelectedCategory('Conversations'); showToast('Opening Conversations'); }} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                    <span>View All</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {contactsList.slice(0, 6).length > 0 ? contactsList.slice(0, 6).map((item) => {
                    const isSelected = activeContactId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => { setActiveContactId(item.id); setSelectedCategory('Conversations'); }}
                        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-start justify-between group ${isSelected ? 'bg-[#EEF2FF]/70 border-[#6366F1]/40 shadow-xs' : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50'}`}
                      >
                        <div className="flex items-start gap-2 overflow-hidden pr-1">
                          {item.avatarImg ? (
                            <img
                              src={item.avatarImg}
                              alt={item.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 shadow-2xs"
                            />
                          ) : (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-[10.5px] mt-0.5 shadow-2xs ${item.avatarBg}`}>
                              {item.initials}
                            </div>
                          )}
                          <div className="truncate min-w-0">
                            <h3 className="text-[11px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">{item.name}</h3>
                            <p className="text-[9.5px] text-slate-400 font-bold leading-tight truncate mt-0.5">{item.role}</p>
                            <p className="text-[10px] text-slate-600 font-semibold leading-snug truncate mt-0.5">{item.preview}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 ml-1">
                          <span className="text-[9.5px] font-bold text-slate-400 leading-none mb-1.5">{item.time}</span>
                          {item.badge ? (
                            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-2xs">
                              {item.badge}
                            </span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                          )}
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Inbox size={28} className="text-slate-200 mb-2" />
                      <p className="text-[10px] font-bold text-slate-400">No messages yet</p>
                      <p className="text-[9px] text-slate-300 font-medium mt-0.5">Your inbox is empty</p>
                      <button onClick={() => setShowNewMessageModal(true)} className="mt-3 text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer">+ New Message</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 mt-2 text-center">
                <button onClick={() => { setSelectedCategory('Conversations'); showToast('Opened Conversations'); }} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                  View all messages →
                </button>
              </div>
            </div>

            {/* COLUMN 2: RECENT CONVERSATIONS (Span 5 - Linked to Conversations) */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col justify-between w-full">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">RECENT CONVERSATIONS</h2>
                  <button onClick={() => { setSelectedCategory('Conversations'); showToast('Opening Recent Conversations'); }} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                    <span>View All</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {contactsList.length > 0 ? contactsList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => { setActiveContactId(item.id); setSelectedCategory('Conversations'); }}
                      className="py-1.5 px-2.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/20 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 overflow-hidden pr-1">
                        {item.avatarImg ? (
                          <img
                            src={item.avatarImg}
                            alt={item.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0 shadow-2xs"
                          />
                        ) : (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-extrabold text-[10px] shadow-2xs ${item.avatarBg}`}>
                            {item.initials}
                          </div>
                        )}
                        <div className="truncate min-w-0">
                          <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight truncate">{item.name}</h3>
                          <p className="text-[10px] text-slate-500 font-medium leading-tight truncate">You: {item.preview}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-1">
                        <span className="text-[9.5px] font-bold text-slate-400 leading-none">{item.time}</span>
                        {item.badge && (
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center shadow-2xs">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <MessageSquare size={28} className="text-slate-200 mb-2" />
                      <p className="text-[10px] font-bold text-slate-400">No conversations yet</p>
                      <p className="text-[9px] text-slate-300 font-medium mt-0.5">Start a new conversation</p>
                      <button onClick={() => setShowNewMessageModal(true)} className="mt-3 text-[10px] font-bold text-[#4338CA] hover:underline cursor-pointer">+ New Message</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 mt-2 text-center">
                <button onClick={() => { setSelectedCategory('Conversations'); showToast('Opening all conversations'); }} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                  View all conversations →
                </button>
              </div>
            </div>

            {/* COLUMN 3: ANNOUNCEMENTS & MESSAGE ACTIVITY (Span 4 - Linked to Broadcast & Notifications) */}
            <div className="lg:col-span-4 flex flex-col gap-3.5 w-full">

              {/* TOP BLOCK: ANNOUNCEMENTS */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">ANNOUNCEMENTS</h2>
                    <button onClick={() => { setSelectedCategory('Broadcast & Notifications'); showToast('Viewing Announcements'); }} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                      <span>View All</span>
                      <span>→</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {recentBroadcasts.slice(0, 4).length > 0 ? recentBroadcasts.slice(0, 4).map((ann) => (
                      <div key={ann.id} className="p-2 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-all flex items-start gap-2 group">
                        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
                          <Megaphone size={12} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="text-[10.5px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{ann.title}</h3>
                            <Pin size={10} className="text-amber-500 shrink-0 fill-amber-400" />
                          </div>
                          <p className="text-[9.5px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-2">{ann.desc}</p>
                          <p className="text-[8.5px] text-slate-400 font-bold mt-1">{ann.sentOn}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Megaphone size={24} className="text-slate-200 mb-2" />
                        <p className="text-[10px] font-bold text-slate-400">No announcements yet</p>
                        <p className="text-[9px] text-slate-300 font-medium mt-0.5">Broadcasts will appear here</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2 text-center">
                  <button onClick={() => { setSelectedCategory('Broadcast & Notifications'); showToast('Opening announcements hub'); }} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                    View all announcements →
                  </button>
                </div>
              </div>

              {/* BOTTOM BLOCK: MESSAGE ACTIVITY (THIS WEEK) */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">MESSAGE ACTIVITY (THIS WEEK)</h2>
                  <button onClick={() => { setSelectedCategory('Templates & Automation'); showToast('Viewing Analytics'); }} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer">
                    <span>View Analytics</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Messages Sent', value: 0, icon: Send, bg: 'bg-[#EEF2FF] text-[#4338CA]' },
                    { label: 'Messages Received', value: 0, icon: Mail, bg: 'bg-[#DCFCE7] text-[#16A34A]' },
                    { label: 'Replies Sent', value: 0, icon: CheckCircle2, bg: 'bg-[#FFEDD5] text-[#EA580C]' },
                    { label: 'Read Rate', value: '—', icon: Eye, bg: 'bg-[#E0F2FE] text-[#0284C7]' }
                  ].map((stat) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={stat.label} className="p-2 rounded-lg bg-slate-50/70 border border-slate-100 text-left">
                        <div className={`w-6 h-6 rounded ${stat.bg} flex items-center justify-center mb-1.5`}>
                          <StatIcon size={12} />
                        </div>
                        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider block truncate">{stat.label}</span>
                        <div className="text-sm font-black text-slate-900 leading-tight mt-0.5">{stat.value}</div>
                        <div className="text-[8.5px] font-bold text-slate-300 mt-0.5">No data yet</div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* QUICK ACTIONS ROW (6 CARDS LINKED TO CLEAN NAMES) */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs">
            <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2.5">QUICK ACTIONS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5">

              <button
                onClick={() => setShowNewMessageModal(true)}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 transition-all text-left group cursor-pointer flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#4338CA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <SendHorizontal size={15} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">New Message</h3>
                  <p className="text-[9.5px] text-slate-400 font-medium leading-tight mt-0.5">Start a new conversation</p>
                </div>
              </button>

              <button
                onClick={() => { setSelectedCategory('Broadcast & Notifications'); setShowBroadcastModal(true); }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 transition-all text-left group cursor-pointer flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Megaphone size={15} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">Broadcast Message</h3>
                  <p className="text-[9.5px] text-slate-400 font-medium leading-tight mt-0.5">Broadcast & Alerts</p>
                </div>
              </button>

              <button
                onClick={() => { setSelectedCategory('Templates & Automation'); showToast('Opened Templates'); }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/30 transition-all text-left group cursor-pointer flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText size={15} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">Message Templates</h3>
                  <p className="text-[9.5px] text-slate-400 font-medium leading-tight mt-0.5">Templates & Auto</p>
                </div>
              </button>

              <button
                onClick={() => { setSelectedCategory('Templates & Automation'); showToast('Opened Scheduled Messages'); }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/30 transition-all text-left group cursor-pointer flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Calendar size={15} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors leading-tight">Scheduled Messages</h3>
                  <p className="text-[9.5px] text-slate-400 font-medium leading-tight mt-0.5">Automation Hub</p>
                </div>
              </button>

              <button
                onClick={() => { setSelectedCategory('Customer Communications'); showToast('Opened Customer Contacts'); }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 transition-all text-left group cursor-pointer flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Users size={15} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">Contact Directory</h3>
                  <p className="text-[9.5px] text-slate-400 font-medium leading-tight mt-0.5">Customer Contacts</p>
                </div>
              </button>

              <button
                onClick={() => { setSelectedCategory('Conversations'); showToast('Opened Conversations'); }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-400 bg-slate-50/50 hover:bg-sky-50/30 transition-all text-left group cursor-pointer flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#0D9488] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BarChart3 size={15} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">Message Analytics</h3>
                  <p className="text-[9.5px] text-slate-400 font-medium leading-tight mt-0.5">Conversation Stats</p>
                </div>
              </button>

            </div>
          </div>



        </div>
      )}

      {/* NEW MESSAGE MODAL */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">NEW MESSAGE</h3>
              <button onClick={() => setShowNewMessageModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateNewMessageSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Recipient</label>
                <select
                  value={newMessageForm.recipient}
                  onChange={(e) => setNewMessageForm({ ...newMessageForm, recipient: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none font-semibold cursor-pointer"
                >
                  <option>Nilesh Chand (Driver - ANSH 1)</option>
                  <option>Shavneel Prasad (Driver - ANSH 2)</option>
                  <option>Dispatch Team (Sydney Branch)</option>
                  <option>Warehouse Melbourne</option>
                  <option>ABC Logistics (Customer)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Message Category</label>
                <select
                  value={newMessageForm.category}
                  onChange={(e) => setNewMessageForm({ ...newMessageForm, category: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none font-semibold cursor-pointer"
                >
                  <option>Conversations</option>
                  <option>Customer Communications</option>
                  <option>Broadcast & Notifications</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={newMessageForm.content}
                  onChange={(e) => setNewMessageForm({ ...newMessageForm, content: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg outline-none font-medium"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewMessageModal(false)} className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW COMMUNICATION MODAL FOR 12.3 */}
      {showNewCommunicationModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">NEW CUSTOMER COMMUNICATION</h3>
              <button onClick={() => setShowNewCommunicationModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCommunicationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Customer</label>
                <select
                  value={newCommForm.customer}
                  onChange={(e) => setNewCommForm({ ...newCommForm, customer: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none font-semibold cursor-pointer"
                >
                  <option>ABC Logistics (operations@abclogistics.com.au)</option>
                  <option>Global Retail Solutions (contact@globalretail.com.au)</option>
                  <option>Fast Freight Pty Ltd (info@fastfreight.com.au)</option>
                  <option>Sydney Car Movers (accounts@sydneycarmovers.com.au)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Communication Type</label>
                <select
                  value={newCommForm.type}
                  onChange={(e) => setNewCommForm({ ...newCommForm, type: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none font-semibold cursor-pointer"
                >
                  <option>Delivery Notification</option>
                  <option>ETA Update</option>
                  <option>POD Shared</option>
                  <option>Invoice Notification</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Message Content *</label>
                <textarea
                  rows={4}
                  required
                  value={newCommForm.content}
                  onChange={(e) => setNewCommForm({ ...newCommForm, content: e.target.value })}
                  placeholder="Type customer update..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg outline-none font-medium"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewCommunicationModal(false)} className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">
                  Send Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BROADCAST MESSAGE MODAL FOR 12.4 */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">BROADCAST MESSAGE</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateBroadcastSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={newBroadcastForm.audience}
                  onChange={(e) => setNewBroadcastForm({ ...newBroadcastForm, audience: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none font-semibold cursor-pointer"
                >
                  <option>All Drivers</option>
                  <option>All Customers</option>
                  <option>All Branches</option>
                  <option>Sydney Branch Only</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Broadcast Title *</label>
                <input
                  type="text"
                  required
                  value={newBroadcastForm.title}
                  onChange={(e) => setNewBroadcastForm({ ...newBroadcastForm, title: e.target.value })}
                  placeholder="e.g. Safety Alert / Fuel Price Update"
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Announcement Body</label>
                <textarea
                  rows={4}
                  value={newBroadcastForm.body}
                  onChange={(e) => setNewBroadcastForm({ ...newBroadcastForm, body: e.target.value })}
                  placeholder="Type broadcast message..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg outline-none font-medium"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowBroadcastModal(false)} className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer">
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW TEMPLATE / RULE MODAL */}
      {showNewTemplateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">NEW TEMPLATE / AUTOMATION RULE</h3>
              <button onClick={() => setShowNewTemplateModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTemplateModalSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Creation Type</label>
                <select
                  value={newTemplateModalForm.type}
                  onChange={(e) => setNewTemplateModalForm({ ...newTemplateModalForm, type: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none font-semibold cursor-pointer"
                >
                  <option>Message Template</option>
                  <option>Automation Rule</option>
                  <option>Trigger Notification</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Title / Rule Name *</label>
                <input
                  type="text"
                  required
                  value={newTemplateModalForm.title}
                  onChange={(e) => setNewTemplateModalForm({ ...newTemplateModalForm, title: e.target.value })}
                  placeholder="e.g. Delivery ETA Alert / Payment Overdue"
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Category & Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newTemplateModalForm.category}
                    onChange={(e) => setNewTemplateModalForm({ ...newTemplateModalForm, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none font-semibold cursor-pointer"
                  >
                    <option>Delivery Notifications</option>
                    <option>Invoice & Payment</option>
                    <option>SMS Templates</option>
                    <option>Email Templates</option>
                  </select>
                  <select
                    value={newTemplateModalForm.channel}
                    onChange={(e) => setNewTemplateModalForm({ ...newTemplateModalForm, channel: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg outline-none font-semibold cursor-pointer"
                  >
                    <option>SMS Gateway</option>
                    <option>Email</option>
                    <option>Push Notification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Template Content</label>
                <textarea
                  rows={4}
                  value={newTemplateModalForm.content}
                  onChange={(e) => setNewTemplateModalForm({ ...newTemplateModalForm, content: e.target.value })}
                  placeholder="Hi {{customer_name}}, your order {{load_id}} is scheduled for {{eta_time}}."
                  className="w-full p-2.5 border border-slate-200 rounded-lg outline-none font-medium"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewTemplateModal(false)} className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEMPLATE LIBRARY MODAL */}
      {showTemplateLibraryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#4338CA]" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">TEMPLATE LIBRARY</h3>
              </div>
              <button onClick={() => setShowTemplateLibraryModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs max-h-[350px] overflow-y-auto pr-1">
              {[
                { title: 'Delivery ETA Update', type: 'SMS', desc: 'Hi {{customer_name}}, your delivery {{load_id}} is on the way.' },
                { title: 'POD Received Notification', type: 'Email', desc: 'Dear Customer, POD for load {{load_id}} has been uploaded.' },
                { title: 'Invoice Payment Reminder', type: 'Email + SMS', desc: 'Invoice {{invoice_num}} is due on {{due_date}}.' },
                { title: 'Driver Maintenance Due Alert', type: 'System', desc: 'Vehicle {{vehicle_reg}} service is due on {{service_date}}.' }
              ].map((tmpl, idx) => (
                <div key={idx} className="p-3 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-slate-50 transition-all flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800">{tmpl.title}</span>
                      <span className="bg-indigo-50 text-indigo-700 text-[8.5px] font-black px-2 py-0.5 rounded-full">{tmpl.type}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 font-medium mt-1">{tmpl.desc}</p>
                  </div>
                  <button onClick={() => { setShowTemplateLibraryModal(false); showToast(`Selected template: ${tmpl.title}`); }} className="shrink-0 text-xs font-bold text-[#4338CA] hover:underline cursor-pointer">
                    Use
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100 mt-3">
              <button onClick={() => setShowTemplateLibraryModal(false)} className="px-4 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
