import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import './CustomerDashboard.css';

const getTodayDateString = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getFutureDateString = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatDateToEnGB = (dateStr) => {
  if (!dateStr) return 'N/A';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

const formatDateSafely = (dateVal) => {
  if (!dateVal) return 'N/A';
  const parsed = new Date(dateVal);
  if (isNaN(parsed.getTime())) return dateVal;
  return parsed.toLocaleDateString('en-GB');
};

const MyLoads = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('MAIN_LIST'); // 'MAIN_LIST' (14.2) or 'LOAD_DETAILS' (14.3)
  const [selectedLoadId, setSelectedLoadId] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState('All Loads');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [loadTypeFilter, setLoadTypeFilter] = useState('All Load Types');
  const [dateFilter, setDateFilter] = useState('All Dates');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Modals & Popups state
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showMoreActionsMain, setShowMoreActionsMain] = useState(false);
  const [showMoreActionsDetails, setShowMoreActionsDetails] = useState(false);

  // 3-Dots Action Menu, Delete & Edit Modal State
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);
  const [deletingLoadId, setDeletingLoadId] = useState(null);
  const [editingLoad, setEditingLoad] = useState(null);   // holds copy of load being edited

  React.useEffect(() => {
    const handleClickOutside = () => setActiveActionMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleOpenActionMenu = (e, loadId) => {
    e.stopPropagation();
    setActiveActionMenuId(prev => (prev === loadId ? null : loadId));
  };

  const handleConfirmDelete = (loadId) => {
    setActiveActionMenuId(null);
    setDeletingLoadId(loadId);
  };

  const handleOpenEdit = (row) => {
    setActiveActionMenuId(null);
    setEditingLoad({ ...row });
  };

  const handleSaveEdit = async () => {
    if (!editingLoad) return;
    try {
      const targetDbId = editingLoad.dbId;
      if (targetDbId) {
        const payload = {
          type: editingLoad.type || undefined,
          status: editingLoad.status ? editingLoad.status.toUpperCase() : undefined,
          notes: editingLoad.driver || undefined,
          deliveryEta: editingLoad.eta ? new Date(editingLoad.eta).toISOString() : undefined,
        };
        // Strip undefined keys
        Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
        await api.put(`/company-admin/loads/${targetDbId}`, payload);
        fetchLoads();
        showToast(`Load ${editingLoad.id} updated successfully!`);
      } else {
        setLoadsList(prev => prev.map(l => l.id === editingLoad.id ? { ...editingLoad } : l));
        showToast(`Load ${editingLoad.id} updated successfully!`);
      }
    } catch (err) {
      console.error('Failed to update load:', err);
      showToast('Failed to update load. Please try again.');
    } finally {
      setEditingLoad(null);
    }
  };

  const handleExecuteDelete = async () => {
    if (!deletingLoadId) return;
    try {
      const targetLoad = loadsList.find(item => item.id === deletingLoadId);
      const targetDbId = targetLoad?.dbId;
      if (targetDbId) {
        await api.delete(`/company-admin/loads/${targetDbId}`);
        fetchLoads();
        showToast(`Load ${deletingLoadId} deleted successfully.`);
      } else {
        // Fallback for local state only
        setLoadsList(prev => prev.filter(item => item.id !== deletingLoadId));
        showToast(`Load ${deletingLoadId} deleted successfully.`);
      }
    } catch (err) {
      console.error('Failed to delete load:', err);
      showToast('Failed to delete load. Please try again.');
    } finally {
      setDeletingLoadId(null);
    }
  };

  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');
  const [bookCargoType, setBookCargoType] = useState('');
  const [bookCargoSpecs, setBookCargoSpecs] = useState('');
  const [bookWeight, setBookWeight] = useState('');
  const [bookOrigin, setBookOrigin] = useState('Melbourne VIC');
  const [bookDestination, setBookDestination] = useState('Sydney NSW');
  const [bookPickupDate, setBookPickupDate] = useState(getTodayDateString());
  const [bookDeliveryDate, setBookDeliveryDate] = useState(getFutureDateString(2));
  const [bookPriority, setBookPriority] = useState('Standard Delivery');
  const [bookNotes, setBookNotes] = useState('');
  const [toast, setToast] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Loads List Data State
  const [loadsList, setLoadsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLoads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/company-admin/loads');
      if (res.data) {
        const raw = Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : (res.data.loads || []));
        const formatted = raw.map(l => {
          const pickupStop = l.stops?.find(s => s.type === 'PICKUP');
          const deliveryStop = l.stops?.find(s => s.type === 'DROPOFF');
          
          const pickupLoc = l.pickupLocation || l.origin || pickupStop?.address || 'Origin';
          const deliveryLoc = l.deliveryLocation || l.destination || deliveryStop?.address || 'Destination';
          
          const pickupD = l.pickupDate || l.loadDate || pickupStop?.scheduledDate;
          const deliveryD = l.deliveryDate || l.deliveryEta || deliveryStop?.scheduledDate;

          const rawId = l.loadRef || l.referenceNumber || l.loadNumber || l.id;
          const cleanDisplayId = (rawId && rawId.length > 18) 
            ? `LD-${rawId.slice(0, 8).toUpperCase()}` 
            : (rawId || `LD-1001`);

          return {
            id: cleanDisplayId,
            dbId: l.id,
            rawDate: pickupD ? new Date(pickupD) : null,
            ref: l.referenceNumber || l.ref || 'N/A',
            route: `${pickupLoc} → ${deliveryLoc}`,
            type: l.loadType || l.type || 'General Freight',
            status: l.status || 'Scheduled',
            driver: l.driver?.name || l.driverName || 'Unassigned',
            pickup: formatDateSafely(pickupD),
            delivery: formatDateSafely(deliveryD),
            eta: l.eta || 'TBD'
          };
        });
        setLoadsList(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch loads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  const handleDownloadLoadsCSV = () => {
    const csvHeader = "Load #,Reference,Route,Type,Status,Driver,Pickup Date,Delivery Date,ETA\n";
    const csvRows = loadsList.map(l => `"${l.id}","${l.ref}","${l.route}","${l.type}","${l.status}","${l.driver}","${l.pickup}","${l.delivery}","${l.eta}"`);
    const blob = new Blob([csvHeader + csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "My_Loads_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("My Loads report downloaded successfully (My_Loads_Report.csv).");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenDetails = (id) => {
    setSelectedLoadId(id);
    setCurrentView('LOAD_DETAILS');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Transit':
        return <span className="cp-status-pill status-blue">In Transit</span>;
      case 'Arrived':
      case 'Delivered':
        return <span className="cp-status-pill status-green">Arrived</span>;
      case 'At Pickup':
        return <span className="cp-status-pill status-amber">At Pickup</span>;
      case 'Dispatched':
        return <span className="cp-status-pill status-purple">Dispatched</span>;
      case 'Scheduled':
      case 'Confirmed':
        return <span className="cp-status-pill status-slate">{status}</span>;
      default:
        return <span className="cp-status-pill status-slate">{status}</span>;
    }
  };

  // Filter Logic
  const filteredLoads = loadsList.filter(l => {
    if (activeTabFilter === 'In Transit' && l.status !== 'In Transit') return false;
    if (activeTabFilter === 'Upcoming' && (l.status === 'In Transit' || l.status === 'Arrived')) return false;
    if (activeTabFilter === 'Completed' && l.status !== 'Arrived' && l.status !== 'Delivered') return false;
    if (activeTabFilter === 'Cancelled' && l.status !== 'Cancelled') return false;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      l.id.toLowerCase().includes(query) ||
      l.ref.toLowerCase().includes(query) ||
      l.route.toLowerCase().includes(query) ||
      l.driver.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    if (statusFilter !== 'All Status' && l.status !== statusFilter) return false;
    if (loadTypeFilter !== 'All Load Types' && l.type !== loadTypeFilter) return false;

    // Date Range Filtering
    if (startDateFilter) {
      const start = new Date(startDateFilter);
      start.setHours(0, 0, 0, 0);
      if (l.rawDate && new Date(l.rawDate) < start) return false;
    }
    if (endDateFilter) {
      const end = new Date(endDateFilter);
      end.setHours(23, 59, 59, 999);
      if (l.rawDate && new Date(l.rawDate) > end) return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setLoadTypeFilter('All Load Types');
    setDateFilter('All Dates');
    setStartDateFilter('');
    setEndDateFilter('');
    setActiveTabFilter('All Loads');
    showToast('Filters reset to default.');
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    showToast('Support ticket submitted successfully.');
    setShowSupportModal(false);
    setSupportSubject('');
    setSupportDescription('');
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        type: bookCargoType || 'General Freight',
        status: 'PLANNED',
        priority: bookPriority === 'Express Freight (Urgent)' || bookPriority === 'Overnight Direct' ? 'URGENT' : 'NORMAL',
        notes: bookNotes || '',
        loadDate: bookPickupDate ? new Date(bookPickupDate).toISOString() : new Date().toISOString(),
        deliveryEta: bookDeliveryDate ? new Date(bookDeliveryDate).toISOString() : new Date().toISOString(),
        stops: [
          {
            type: 'PICKUP',
            sequenceIndex: 0,
            address: bookOrigin || 'Origin Stop',
            scheduledDate: bookPickupDate ? new Date(bookPickupDate).toISOString() : new Date().toISOString()
          },
          {
            type: 'DROPOFF',
            sequenceIndex: 1,
            address: bookDestination || 'Delivery Stop',
            scheduledDate: bookDeliveryDate ? new Date(bookDeliveryDate).toISOString() : new Date().toISOString()
          }
        ],
        items: [
          {
            stockRef: bookCargoSpecs || 'CARGO-ITEM',
            notes: `${bookCargoType}${bookCargoSpecs ? ` (${bookCargoSpecs})` : ''}${bookWeight ? `, Weight: ${bookWeight}` : ''}`,
            quantity: 1
          }
        ]
      };

      const res = await api.post('/company-admin/loads', payload);
      if (res.data) {
        fetchLoads();
        showToast('Cargo shipment booking submitted successfully!');
      }
    } catch (err) {
      console.error('Failed to submit cargo booking:', err);
      showToast('Failed to submit booking. Please try again.');
    } finally {
      setShowBookModal(false);
      setBookCargoType('Car Carrier');
      setBookCargoSpecs('');
      setBookWeight('');
      setBookOrigin('Melbourne VIC');
      setBookDestination('Sydney NSW');
      setBookPickupDate(getTodayDateString());
      setBookDeliveryDate(getFutureDateString(2));
      setBookPriority('Standard Delivery');
      setBookNotes('');
    }
  };

  return (
    <div className="cp-dashboard">

      {/* ============================================================
          VIEW 1: 14.2 MY LOADS / BOOKINGS (MATCHING SCREENSHOT EXACTLY)
          ============================================================ */}
      {currentView === 'MAIN_LIST' ? (
        <div>
          {/* Breadcrumb & Header Row */}
          <div className="cp-header-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div className="cp-breadcrumb" style={{ margin: 0 }}>
                <span>Home</span> &rsaquo; <span>Customer Portal</span> &rsaquo; <span className="active">My Loads / Bookings</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className="cp-help-link" onClick={() => setShowSupportModal(true)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Need help?
                </button>

                <div className="cp-avatar-badge" title="Customer Avatar">AC</div>
              </div>
            </div>

            <div className="cp-header-row">
              <div className="cp-header-left">
                <div className="cp-title-group">

                  <h1 className="cp-page-title">My Loads / Bookings</h1>
                  <button className="cp-star-btn" title="Bookmark page">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </button>
                </div>
                <p className="cp-page-subtitle">View and manage all your current, upcoming and completed loads.</p>
              </div>

              <div className="cp-header-right">
                <button className="cp-btn cp-btn-white" onClick={() => window.location.reload()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Refresh
                </button>

                <button className="cp-btn cp-btn-white" onClick={handleDownloadLoadsCSV}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download
                </button>

                <button className="cp-btn cp-btn-blue" onClick={() => setShowBookModal(true)}>
                  <span style={{ fontSize: 15, fontWeight: 'bold', marginRight: 4 }}>+</span> Create Booking
                </button>
              </div>
            </div>
          </div>

          {/* Top 5 Metric Cards Row */}
          {(() => {
            const totalLoadsCount = loadsList.length;
            const inTransitCount = loadsList.filter(l => l.status === 'In Transit' || l.status === 'IN_TRANSIT').length;
            const upcomingCount = loadsList.filter(l => l.status === 'Scheduled' || l.status === 'Confirmed' || l.status === 'Planned' || l.status === 'ASSIGNED').length;
            const completedCount = loadsList.filter(l => l.status === 'Completed' || l.status === 'Delivered' || l.status === 'DELIVERED').length;
            const cancelledCount = loadsList.filter(l => l.status === 'Cancelled' || l.status === 'CANCELLED').length;

            return (
              <div className="myloads-5metrics-grid">
                {/* Card 1: TOTAL LOADS */}
                <div className="cp-metric-card" onClick={() => setActiveTabFilter('All Loads')}>
                  <div className="cp-metric-main">
                    <div className="cp-metric-icon icon-blue">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      </svg>
                    </div>
                    <div className="cp-metric-details">
                      <span className="cp-metric-title">TOTAL LOADS</span>
                      <span className="cp-metric-value">{totalLoadsCount}</span>
                    </div>
                  </div>
                  <div className="cp-metric-footer">View all loads &rarr;</div>
                </div>

                {/* Card 2: IN TRANSIT */}
                <div className="cp-metric-card" onClick={() => setActiveTabFilter('In Transit')}>
                  <div className="cp-metric-main">
                    <div className="cp-metric-icon icon-green">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                      </svg>
                    </div>
                    <div className="cp-metric-details">
                      <span className="cp-metric-title">IN TRANSIT</span>
                      <span className="cp-metric-value">{inTransitCount}</span>
                    </div>
                  </div>
                  <div className="cp-metric-footer">View in transit &rarr;</div>
                </div>

                {/* Card 3: UPCOMING */}
                <div className="cp-metric-card" onClick={() => setActiveTabFilter('Upcoming')}>
                  <div className="cp-metric-main">
                    <div className="cp-metric-icon icon-amber">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div className="cp-metric-details">
                      <span className="cp-metric-title">UPCOMING</span>
                      <span className="cp-metric-value">{upcomingCount}</span>
                    </div>
                  </div>
                  <div className="cp-metric-footer">View upcoming &rarr;</div>
                </div>

                {/* Card 4: COMPLETED */}
                <div className="cp-metric-card" onClick={() => setActiveTabFilter('Completed')}>
                  <div className="cp-metric-main">
                    <div className="cp-metric-icon icon-blue-check">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div className="cp-metric-details">
                      <span className="cp-metric-title">COMPLETED</span>
                      <span className="cp-metric-value">{completedCount}</span>
                    </div>
                  </div>
                  <div className="cp-metric-footer">View completed &rarr;</div>
                </div>

                {/* Card 5: CANCELLED */}
                <div className="cp-metric-card" onClick={() => setActiveTabFilter('Cancelled')}>
                  <div className="cp-metric-main">
                    <div className="cp-metric-icon icon-purple">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                    </div>
                    <div className="cp-metric-details">
                      <span className="cp-metric-title">CANCELLED</span>
                      <span className="cp-metric-value">{cancelledCount}</span>
                    </div>
                  </div>
                  <div className="cp-metric-footer">View cancelled &rarr;</div>
                </div>
              </div>
            );
          })()}

          {/* Status Tabs Row */}
          <div className="myloads-status-tabs">
            {['All Loads', 'In Transit', 'Upcoming', 'Completed', 'Cancelled'].map(tab => (
              <span
                key={tab}
                onClick={() => setActiveTabFilter(tab)}
                style={{
                  fontSize: 13,
                  fontWeight: activeTabFilter === tab ? '800' : '600',
                  color: activeTabFilter === tab ? '#2563eb' : '#64748b',
                  borderBottom: activeTabFilter === tab ? '2.5px solid #2563eb' : 'none',
                  paddingBottom: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Search & Filter Controls Bar */}
          <div className="myloads-filter-bar">
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '7px 12px', flex: 1, minWidth: 260 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" style={{ marginRight: 8 }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by load #, reference, route, or driver..."
                style={{ border: 'none', outline: 'none', fontSize: 13, color: '#334155', width: '100%', backgroundColor: 'transparent' }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '7px 12px', fontSize: 12.5, color: '#334155', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All Status">All Status</option>
              <option value="In Transit">In Transit</option>
              <option value="Arrived">Arrived</option>
              <option value="At Pickup">At Pickup</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
            </select>

            <select
              value={loadTypeFilter}
              onChange={(e) => setLoadTypeFilter(e.target.value)}
              style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '7px 12px', fontSize: 12.5, color: '#334155', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All Load Types">All Load Types</option>
              <option value="Car Carrier">Car Carrier</option>
              <option value="General Freight">General Freight</option>
              <option value="Dangerous Goods">Dangerous Goods</option>
              <option value="Warehousing / 3PL">Warehousing / 3PL</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '7px 12px', fontSize: 12.5, color: '#334155', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All Dates">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>

            {/* Start Date Calendar Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '5px 10px' }}>
              <span style={{ fontSize: 11, fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Start:</span>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: 12,
                  color: '#0f172a',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
                title="Select Start Date"
              />
            </div>

            <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 'bold' }}>→</span>

            {/* End Date Calendar Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '5px 10px' }}>
              <span style={{ fontSize: 11, fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>End:</span>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: 12,
                  color: '#0f172a',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
                title="Select End Date"
              />
            </div>

            <button className="cp-btn cp-btn-white" onClick={() => showToast('Advanced filter drawer opened.')}>
              ⚙ Filters
            </button>

            <button className="cp-btn cp-btn-white" title="Reset Filters" onClick={handleResetFilters}>
              ↻
            </button>
          </div>

          {/* Main 2-Column Grid (Left: Loads List Table, Right: 3 Summary Cards) */}
          <div className="myloads-main-layout">

            {/* LEFT COLUMN: LOADS LIST TABLE */}
            <div className="cp-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="cp-card-title">LOADS LIST</h2>
                <span style={{ fontSize: 11, color: '#64748b' }}>Showing {filteredLoads.length} loads</span>
              </div>

              <div className="cp-table-responsive">
                <table className="cp-table">
                  <thead>
                    <tr>
                      <th>Load #</th>
                      <th>Reference</th>
                      <th>Route</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Driver</th>
                      <th>Pickup Date</th>
                      <th>Delivery Date</th>
                      <th>ETA / Delivered</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLoads.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ padding: '24px 0', textAlign: 'center', color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>
                          No loads found.
                        </td>
                      </tr>
                    ) : (
                      filteredLoads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((row) => (
                      <tr key={row.id}>
                        <td
                          className="cp-bold-link"
                          style={{ whiteSpace: 'nowrap' }}
                          onClick={() => handleOpenDetails(row.id)}
                        >
                          {row.id && row.id.length > 18 ? `LD-${row.id.slice(0, 8).toUpperCase()}` : row.id}
                        </td>
                        <td style={{ fontSize: 11.5, color: '#64748b', whiteSpace: 'nowrap' }}>{row.ref}</td>
                        <td style={{ fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{row.route}</td>
                        <td style={{ fontSize: 11.5, color: '#334155', whiteSpace: 'nowrap' }}>{row.type}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{getStatusBadge(row.status)}</td>
                        <td style={{ fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>{row.driver}</td>
                        <td style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>{row.pickup}</td>
                        <td style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>{row.delivery}</td>
                        <td style={{ fontSize: 11, fontWeight: 700, color: row.eta.includes('Arrived') ? '#047857' : '#0f172a', whiteSpace: 'nowrap' }}>{row.eta}</td>
                        <td style={{ textAlign: 'center', position: 'relative' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
                            {/* Quick View Button */}
                            <button
                              onClick={() => handleOpenDetails(row.id)}
                              style={{
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                color: '#2563eb',
                                borderRadius: 5,
                                width: 28,
                                height: 28,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s'
                              }}
                              title="View Load Details"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>

                            {/* 3-Dots Menu Button */}
                            <button
                              onClick={(e) => handleOpenActionMenu(e, row.id)}
                              style={{
                                background: activeActionMenuId === row.id ? '#1e293b' : '#f8fafc',
                                border: activeActionMenuId === row.id ? '1px solid #1e293b' : '1px solid #e2e8f0',
                                color: activeActionMenuId === row.id ? '#ffffff' : '#64748b',
                                borderRadius: 5,
                                width: 28,
                                height: 28,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s'
                              }}
                              title="More options"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="5" cy="12" r="2"></circle>
                                <circle cx="12" cy="12" r="2"></circle>
                                <circle cx="19" cy="12" r="2"></circle>
                              </svg>
                            </button>

                            {/* Dropdown Menu Popup - Edit + Delete */}
                            {activeActionMenuId === row.id && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '85%',
                                  right: 10,
                                  zIndex: 100,
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: 8,
                                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                  minWidth: 145,
                                  padding: '4px 0',
                                  textAlign: 'left'
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Edit Option */}
                                <button
                                  onClick={() => handleOpenEdit(row)}
                                  style={{
                                    width: '100%',
                                    padding: '8px 14px',
                                    background: 'none',
                                    border: 'none',
                                    textAlign: 'left',
                                    fontSize: 12,
                                    fontWeight: '600',
                                    color: '#2563eb',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                  </svg>
                                  Edit Load
                                </button>

                                {/* Divider */}
                                <div style={{ height: 1, background: '#f1f5f9', margin: '2px 0' }} />

                                {/* Delete Option */}
                                <button
                                  onClick={() => handleConfirmDelete(row.id)}
                                  style={{
                                    width: '100%',
                                    padding: '8px 14px',
                                    background: 'none',
                                    border: 'none',
                                    textAlign: 'left',
                                    fontSize: 12,
                                    fontWeight: '600',
                                    color: '#dc2626',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <span>🗑️</span> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Pagination */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, color: '#64748b' }}>
                  Showing {filteredLoads.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLoads.length)} of {filteredLoads.length} loads
                </span>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    style={{ border: '1px solid #cbd5e1', background: currentPage === 1 ? '#f8fafc' : '#fff', opacity: currentPage === 1 ? 0.6 : 1, borderRadius: 4, padding: '3px 8px', fontSize: 11, cursor: currentPage === 1 ? 'default' : 'pointer' }}
                  >|&lt;</button>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    style={{ border: '1px solid #cbd5e1', background: currentPage === 1 ? '#f8fafc' : '#fff', opacity: currentPage === 1 ? 0.6 : 1, borderRadius: 4, padding: '3px 8px', fontSize: 11, cursor: currentPage === 1 ? 'default' : 'pointer' }}
                  >&lt;</button>

                  {[1, 2, 3, 4, 5].map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      style={{
                        border: currentPage === p ? 'none' : '1px solid #cbd5e1',
                        background: currentPage === p ? '#2563eb' : '#fff',
                        color: currentPage === p ? '#fff' : '#334155',
                        borderRadius: 4,
                        padding: '3px 9px',
                        fontSize: 11,
                        fontWeight: currentPage === p ? 'bold' : 'normal',
                        cursor: 'pointer'
                      }}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === 5}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, 5))}
                    style={{ border: '1px solid #cbd5e1', background: currentPage === 5 ? '#f8fafc' : '#fff', opacity: currentPage === 5 ? 0.6 : 1, borderRadius: 4, padding: '3px 8px', fontSize: 11, cursor: currentPage === 5 ? 'default' : 'pointer' }}
                  >&gt;</button>
                  <button
                    disabled={currentPage === 5}
                    onClick={() => setCurrentPage(5)}
                    style={{ border: '1px solid #cbd5e1', background: currentPage === 5 ? '#f8fafc' : '#fff', opacity: currentPage === 5 ? 0.6 : 1, borderRadius: 4, padding: '3px 8px', fontSize: 11, cursor: currentPage === 5 ? 'default' : 'pointer' }}
                  >&gt;|</button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 3 SUMMARY CARDS */}
            {(() => {
              const totalLoadsCount = loadsList.length;
              const inTransitCount = loadsList.filter(l => l.status === 'In Transit' || l.status === 'IN_TRANSIT').length;
              const deliveredCount = loadsList.filter(l => l.status === 'Completed' || l.status === 'Delivered' || l.status === 'DELIVERED').length;
              const scheduledCount = loadsList.filter(l => l.status === 'Scheduled' || l.status === 'Confirmed' || l.status === 'Planned' || l.status === 'ASSIGNED').length;
              const dispatchedCount = loadsList.filter(l => l.status === 'Dispatched').length;
              const cancelledCount = loadsList.filter(l => l.status === 'Cancelled' || l.status === 'CANCELLED').length;
              const othersCount = Math.max(0, totalLoadsCount - (inTransitCount + deliveredCount + scheduledCount + dispatchedCount + cancelledCount));

              const calcPct = (cnt) => totalLoadsCount > 0 ? ((cnt / totalLoadsCount) * 100).toFixed(1) : '0.0';

              const carCount = loadsList.filter(l => (l.loadType || l.type || '').toLowerCase().includes('car')).length;
              const generalCount = loadsList.filter(l => (l.loadType || l.type || '').toLowerCase().includes('general')).length;
              const dgCount = loadsList.filter(l => (l.loadType || l.type || '').toLowerCase().includes('dangerous') || (l.loadType || l.type || '').toLowerCase().includes('dg')).length;
              const whCount = Math.max(0, totalLoadsCount - (carCount + generalCount + dgCount));

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* CARD 1: LOADS BY STATUS (Donut Chart Graphic) */}
                  <div className="cp-card">
                    <div className="cp-card-header">
                      <h2 className="cp-card-title">LOADS BY STATUS</h2>
                      <button className="cp-link-btn" onClick={() => showToast('Opening loads status report...')}>View full report &rarr;</button>
                    </div>

                    {/* Donut Chart Visual SVG */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '10px 0' }}>
                      <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                        <svg width="90" height="90" viewBox="0 0 36 36">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3.8" />
                        </svg>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 16, fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{totalLoadsCount}</span>
                          <span style={{ fontSize: 8.5, color: '#64748b' }}>Total Loads</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                          <span style={{ color: '#334155' }}>🔵 In Transit</span>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>{inTransitCount} ({calcPct(inTransitCount)}%)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                          <span style={{ color: '#334155' }}>🟢 Arrived / Delivered</span>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>{deliveredCount} ({calcPct(deliveredCount)}%)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                          <span style={{ color: '#334155' }}>🟡 Scheduled</span>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>{scheduledCount} ({calcPct(scheduledCount)}%)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                          <span style={{ color: '#334155' }}>🟣 Dispatched</span>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>{dispatchedCount} ({calcPct(dispatchedCount)}%)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                          <span style={{ color: '#334155' }}>⚪ Others</span>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>{othersCount} ({calcPct(othersCount)}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: LOAD TYPES */}
                  <div className="cp-card">
                    <div className="cp-card-header">
                      <h2 className="cp-card-title">LOAD TYPES</h2>
                      <button className="cp-link-btn" onClick={() => showToast('Opening load types breakdown...')}>View full report &rarr;</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
                        <span style={{ color: '#334155' }}>🚙 Car Carrier</span>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{carCount} ({calcPct(carCount)}%)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
                        <span style={{ color: '#334155' }}>📦 General Freight</span>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{generalCount} ({calcPct(generalCount)}%)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
                        <span style={{ color: '#334155' }}>⚠️ Dangerous Goods</span>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{dgCount} ({calcPct(dgCount)}%)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5 }}>
                        <span style={{ color: '#334155' }}>🏬 Warehousing / 3PL</span>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{whCount} ({calcPct(whCount)}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: QUICK FILTERS */}
                  <div className="cp-card">
                    <div className="cp-card-header">
                      <h2 className="cp-card-title">QUICK FILTERS</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div
                        onClick={() => { setActiveTabFilter('In Transit'); showToast('Filtered: Requires Attention'); }}
                        style={{ backgroundColor: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 6, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: 10.5, fontWeight: '700', color: '#c53030' }}>Requires Attention</span>
                        <span style={{ backgroundColor: '#e53e3e', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{inTransitCount}</span>
                      </div>

                      <div
                        onClick={() => { setActiveTabFilter('In Transit'); showToast('Filtered: Delayed Loads'); }}
                        style={{ backgroundColor: '#fffaf0', border: '1px solid #feebc8', borderRadius: 6, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: 10.5, fontWeight: '700', color: '#c05621' }}>Delayed Loads</span>
                        <span style={{ backgroundColor: '#dd6b20', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span>
                      </div>

                      <div
                        onClick={() => { setActiveTabFilter('Completed'); showToast('Filtered: Proof of Delivery Pending'); }}
                        style={{ backgroundColor: '#ebf8ff', border: '1px solid #bee3f8', borderRadius: 6, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: 10.5, fontWeight: '700', color: '#2b6cb0' }}>Proof of Delivery Pending</span>
                        <span style={{ backgroundColor: '#3182ce', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span>
                      </div>

                      <div
                        onClick={() => { navigate('/customer/invoices-payments'); showToast('Filtered: Invoice Pending'); }}
                        style={{ backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 6, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: 10.5, fontWeight: '700', color: '#276749' }}>Invoice Pending</span>
                        <span style={{ backgroundColor: '#38a169', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      ) : (

        /* ============================================================
            VIEW 2: 14.3 LOAD DETAILS & TRACKING VIEW (MATCHING SCREENSHOT EXACTLY)
            ============================================================ */
        <div>
          {/* Header Row */}
          <div className="cp-header-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div className="cp-breadcrumb" style={{ margin: 0 }}>
                <span>Home</span> &rsaquo; <span>Customer Portal</span> &rsaquo; <span style={{ cursor: 'pointer', color: '#2563eb' }} onClick={() => setCurrentView('MAIN_LIST')}>My Loads / Bookings</span> &rsaquo; <span className="active">Load Details</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className="cp-help-link" onClick={() => setShowSupportModal(true)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Need help?
                </button>

                <div className="cp-avatar-badge" title="Customer Avatar">AC</div>
              </div>
            </div>

            <div className="cp-header-row">
              <div className="cp-header-left">
                <div className="cp-title-group">

                  <h1 className="cp-page-title">Load Details &amp; Tracking</h1>
                  <button className="cp-star-btn" title="Bookmark load">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </button>
                </div>
                <p className="cp-page-subtitle">Track your load in real-time and view all details, updates and documents.</p>
              </div>

              <div className="cp-header-right">
                <button className="cp-btn cp-btn-white" onClick={() => showToast('Tracking data auto-refreshed.')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Refresh
                </button>

                <button className="cp-btn cp-btn-white" onClick={() => showToast('Share link copied to clipboard!')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Share
                </button>

                <button className="cp-btn cp-btn-white" onClick={() => showToast('Downloading BOL & Load Manifest PDF...')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download
                </button>

                <button className="cp-btn cp-btn-blue" onClick={() => navigate('/customer/dispatcher-chat')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Message Dispatch
                </button>

                <div className="cp-dropdown-container">
                  <button className="cp-btn cp-btn-white" onClick={() => setShowMoreActions(!showMoreActions)}>
                    More Actions
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 2 }}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {showMoreActions && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowMoreActions(false)} />
                      <div className="cp-more-dropdown">
                        <div className="cp-dropdown-item" onClick={() => { setShowMoreActions(false); setCurrentView('MAIN_LIST'); }}>Back to My Loads</div>
                        <div className="cp-dropdown-item" onClick={() => { setShowMoreActions(false); showToast('Downloading BOL PDF...'); }}>Download Bill of Lading</div>
                        <div className="cp-dropdown-item" onClick={() => { setShowMoreActions(false); showToast('Downloading POD PDF...'); }}>Download POD</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Load Summary Spec Header Bar */}
          <div className="cp-summary-bar">
            <div className="cp-summary-col">
              <span className="cp-summary-label">LOAD ID</span>
              <div className="cp-summary-val-group">
                <span className="cp-summary-val-bold">{selectedLoadId}</span>
                <span className="cp-status-pill status-blue">In Transit</span>
              </div>
              <span className="cp-summary-sub">Reference: <strong>PO-9876</strong></span>
            </div>

            <div className="cp-summary-col">
              <span className="cp-summary-label">ROUTE</span>
              <span className="cp-summary-val">Melbourne VIC &rarr; Sydney NSW</span>
            </div>

            <div className="cp-summary-col">
              <span className="cp-summary-label">TYPE</span>
              <span className="cp-summary-val">Car Carrier</span>
            </div>

            <div className="cp-summary-col">
              <span className="cp-summary-label">VEHICLE</span>
              <span className="cp-summary-val">Truck: MO58KY</span>
              <span className="cp-summary-sub">Trailer: TR-1045</span>
            </div>

            <div className="cp-summary-col">
              <span className="cp-summary-label">PICKUP DATE</span>
              <span className="cp-summary-val">30 May 2025</span>
              <span className="cp-summary-sub">02:30 PM</span>
            </div>

            <div className="cp-summary-col">
              <span className="cp-summary-label">DELIVERY DATE</span>
              <span className="cp-summary-val">30 May 2025</span>
              <span className="cp-summary-sub">ETA: 02:30 PM</span>
            </div>

            <div className="cp-summary-col">
              <span className="cp-summary-label">STATUS</span>
              <span className="cp-summary-val">In Transit</span>
              <span className="cp-summary-sub">Updated: 10 min ago</span>
            </div>
          </div>

          {/* Main 3 Section Layout Grid */}
          <div className="cp-load-details-grid">

            {/* LEFT CARD: LIVE TRACKING */}
            <div className="cp-card">
              <div className="cp-card-header">
                <h2 className="cp-card-title">LIVE TRACKING</h2>
              </div>

              {/* Realistic SVG Map Graphic */}
              <div className="cp-map-box-container">
                <svg className="cp-map-svg" viewBox="0 0 500 280" preserveAspectRatio="none">
                  <rect x="0" y="0" width="500" height="280" fill="#edf3e6" />
                  <path d="M 370 0 C 350 70 380 150 410 220 C 430 250 420 280 430 280 L 500 280 L 500 0 Z" fill="#d4e6f7" />
                  <path d="M 370 0 C 350 70 380 150 410 220 C 430 250 420 280 430 280" fill="none" stroke="#b0d4f1" strokeWidth="3" />
                  <path
                    d="M 65 220 C 90 180 120 160 175 150 C 220 140 260 120 315 90 C 360 65 400 55 415 35"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="175" cy="150" r="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                  <circle cx="315" cy="90" r="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                  <circle cx="385" cy="55" r="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />

                  <text x="35" y="165" fontSize="10" fontWeight="700" fill="#334155">Bendigo</text>
                  <text x="185" y="145" fontSize="10" fontWeight="700" fill="#334155">Albury</text>
                  <text x="260" y="85" fontSize="10" fontWeight="700" fill="#334155">Goulburn</text>
                  <text x="385" y="70" fontSize="10" fontWeight="700" fill="#334155">Wollongong</text>

                  <g transform="translate(65, 220)">
                    <path d="M 0 -18 C -6 -18 -10 -14 -10 -8 C -10 0 0 8 0 8 C 0 8 10 0 10 -8 C 10 -14 6 -18 0 -18 Z" fill="#10b981" />
                    <circle cx="0" cy="-8" r="3" fill="#ffffff" />
                    <text x="14" y="-4" fontSize="12" fontWeight="800" fill="#0f172a">Melbourne</text>
                  </g>

                  <g transform="translate(415, 35)">
                    <path d="M 0 -18 C -6 -18 -10 -14 -10 -8 C -10 0 0 8 0 8 C 0 8 10 0 10 -8 C 10 -14 6 -18 0 -18 Z" fill="#ef4444" />
                    <circle cx="0" cy="-8" r="3" fill="#ffffff" />
                    <text x="14" y="-4" fontSize="13" fontWeight="800" fill="#0f172a">Sydney</text>
                  </g>

                  <g transform="translate(330, 80)">
                    <circle cx="0" cy="0" r="14" fill="#2563eb" opacity="0.2" />
                    <circle cx="0" cy="0" r="10" fill="#2563eb" />
                    <path d="M -5 -3 L 2 -3 L 5 0 L 5 4 L -5 4 Z" fill="#ffffff" />
                    <circle cx="-3" cy="4" r="1.5" fill="#2563eb" />
                    <circle cx="3" cy="4" r="1.5" fill="#2563eb" />
                  </g>
                </svg>

                <div className="cp-map-controls-box">
                  <button className="cp-map-control-btn" title="Zoom in">+</button>
                  <button className="cp-map-control-btn" title="Zoom out">&minus;</button>
                  <button className="cp-map-control-btn" title="Center location">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Telemetry Bar */}
              <div className="cp-telemetry-bar">
                <div className="cp-telemetry-col">
                  <span className="cp-telemetry-title">CURRENT LOCATION</span>
                  <span className="cp-telemetry-val">Near Goulburn NSW</span>
                  <span className="cp-telemetry-sub">Updated 10 min ago</span>
                  <span className="cp-telemetry-link" onClick={() => showToast('Focusing live GPS location...')}>View on map ↗</span>
                </div>
                <div className="cp-telemetry-col">
                  <span className="cp-telemetry-title">DISTANCE TRAVELLED</span>
                  <span className="cp-telemetry-val">713 km</span>
                </div>
                <div className="cp-telemetry-col">
                  <span className="cp-telemetry-title">DISTANCE REMAINING</span>
                  <span className="cp-telemetry-val">95 km</span>
                </div>
                <div className="cp-telemetry-col">
                  <span className="cp-telemetry-title">EST. TIME REMAINING</span>
                  <span className="cp-telemetry-val">1h 35m</span>
                </div>
                <div className="cp-telemetry-col">
                  <span className="cp-telemetry-title">CURRENT SPEED</span>
                  <span className="cp-telemetry-val">88 km/h</span>
                </div>
              </div>
            </div>

            {/* MIDDLE CARD: STATUS & PROGRESS */}
            <div className="cp-card">
              <div className="cp-card-header">
                <h2 className="cp-card-title">STATUS &amp; PROGRESS</h2>
              </div>

              <div className="cp-timeline-stepper">
                <div className="cp-step-item">
                  <div className="cp-step-icon step-completed">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="cp-step-content">
                    <div className="cp-step-header">
                      <span className="cp-step-title">Booking Confirmed</span>
                      <span className="cp-step-time">28 May 2025 09:15 AM</span>
                    </div>
                    <span className="cp-step-desc">Your booking has been confirmed.</span>
                  </div>
                </div>

                <div className="cp-step-item">
                  <div className="cp-step-icon step-completed">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="cp-step-content">
                    <div className="cp-step-header">
                      <span className="cp-step-title">Pickup Arrived</span>
                      <span className="cp-step-time">30 May 2025 01:45 PM</span>
                    </div>
                    <span className="cp-step-desc">Vehicle arrived at pickup location.</span>
                  </div>
                </div>

                <div className="cp-step-item">
                  <div className="cp-step-icon step-completed">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="cp-step-content">
                    <div className="cp-step-header">
                      <span className="cp-step-title">Loaded</span>
                      <span className="cp-step-time">30 May 2025 02:15 PM</span>
                    </div>
                    <span className="cp-step-desc">Vehicle(s) have been loaded.</span>
                  </div>
                </div>

                <div className="cp-step-item">
                  <div className="cp-step-icon step-active">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <div className="cp-step-content cp-active-step-box">
                    <div className="cp-step-header">
                      <span className="cp-step-title" style={{ color: '#2563eb' }}>In Transit</span>
                      <span className="cp-step-time">30 May 2025 02:30 PM</span>
                    </div>
                    <span className="cp-step-desc">Your load is on the way.</span>
                  </div>
                </div>

                <div className="cp-step-item">
                  <div className="cp-step-icon step-pending">
                    <span style={{ fontSize: 10 }}>5</span>
                  </div>
                  <div className="cp-step-content">
                    <div className="cp-step-header">
                      <span className="cp-step-title" style={{ color: '#64748b' }}>Delivery Arrived</span>
                      <span className="cp-step-time">Pending</span>
                    </div>
                    <span className="cp-step-desc">Vehicle will arrive at delivery location.</span>
                  </div>
                </div>

                <div className="cp-step-item">
                  <div className="cp-step-icon step-pending">
                    <span style={{ fontSize: 10 }}>6</span>
                  </div>
                  <div className="cp-step-content">
                    <div className="cp-step-header">
                      <span className="cp-step-title" style={{ color: '#64748b' }}>Delivered</span>
                      <span className="cp-step-time">Pending</span>
                    </div>
                    <span className="cp-step-desc">Load will be delivered and POD captured.</span>
                  </div>
                </div>
              </div>

              <div className="cp-card-footer">
                <button className="cp-link-btn" onClick={() => showToast('Viewing complete tracking logs...')}>View full timeline &rarr;</button>
              </div>
            </div>

            {/* RIGHT COLUMN STACK */}
            <div className="cp-column">
              {/* Load Items Card */}
              <div className="cp-card">
                <div className="cp-card-header">
                  <h2 className="cp-card-title">LOAD ITEMS (2)</h2>
                  <button className="cp-link-btn" onClick={() => showToast('Showing all cargo items')}>View all items &rarr;</button>
                </div>

                <div className="cp-car-list">
                  <div className="cp-car-card">
                    <div className="cp-car-num-badge">1</div>
                    <div className="cp-car-img-wrapper">
                      <img
                        src="/assets/cars/toyota_rav4.png"
                        alt="Toyota RAV4 2024"
                        className="cp-car-img-photo"
                      />
                    </div>
                    <div className="cp-car-details">
                      <span className="cp-car-title-text">Toyota RAV4 2024</span>
                      <span className="cp-car-meta">VIN: JTMPFREV1RJ123456</span>
                      <span className="cp-car-meta">Rego: 1ABC123</span>
                    </div>
                    <div className="cp-car-right-info">
                      <span className="cp-status-pill status-green">Loaded</span>
                      <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Position: Upper Deck - Front</span>
                      <div className="cp-photo-count-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <span>3</span>
                      </div>
                    </div>
                  </div>

                  <div className="cp-car-card">
                    <div className="cp-car-num-badge">2</div>
                    <div className="cp-car-img-wrapper">
                      <img
                        src="/assets/cars/mazda_cx5.png"
                        alt="Mazda CX-5 2024"
                        className="cp-car-img-photo"
                      />
                    </div>
                    <div className="cp-car-details">
                      <span className="cp-car-title-text">Mazda CX-5 2024</span>
                      <span className="cp-car-meta">VIN: JM0KFWLA0M456789</span>
                      <span className="cp-car-meta">Rego: 2XYZ456</span>
                    </div>
                    <div className="cp-car-right-info">
                      <span className="cp-status-pill status-green">Loaded</span>
                      <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Position: Lower Deck - Rear</span>
                      <div className="cp-photo-count-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <span>3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents & PODs Card */}
              <div className="cp-card mt-16">
                <div className="cp-card-header">
                  <h2 className="cp-card-title">DOCUMENTS &amp; PODS</h2>
                  <button className="cp-link-btn" onClick={() => navigate('/customer/documents-pods')}>View all documents &rarr;</button>
                </div>

                <div className="cp-doc-list">
                  <div className="cp-doc-item">
                    <div className="cp-doc-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <div className="cp-doc-info">
                      <div className="cp-doc-name">Proof of Delivery (POD)</div>
                      <div className="cp-doc-sub">Not available yet</div>
                    </div>
                    <div className="cp-doc-date">&mdash;</div>
                  </div>

                  <div className="cp-doc-item">
                    <div className="cp-doc-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <div className="cp-doc-info">
                      <div className="cp-doc-name">Pre-Load Condition Report</div>
                    </div>
                    <div className="cp-doc-date">30 May 2025</div>
                    <button className="cp-doc-dl" onClick={() => showToast('Downloading Pre-Load Condition Report...')}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                      </svg>
                    </button>
                  </div>

                  <div className="cp-doc-item">
                    <div className="cp-doc-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <div className="cp-doc-info">
                      <div className="cp-doc-name">Load Photos</div>
                    </div>
                    <div className="cp-doc-date">30 May 2025</div>
                    <button className="cp-doc-dl" onClick={() => showToast('Downloading Load Photos zip...')}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                      </svg>
                    </button>
                  </div>

                  <div className="cp-doc-item">
                    <div className="cp-doc-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <div className="cp-doc-info">
                      <div className="cp-doc-name">Delivery Instructions</div>
                    </div>
                    <div className="cp-doc-date">28 May 2025</div>
                    <button className="cp-doc-dl" onClick={() => showToast('Downloading Delivery Instructions PDF...')}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                      </svg>
                    </button>
                  </div>

                  <div className="cp-doc-item">
                    <div className="cp-doc-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <div className="cp-doc-info">
                      <div className="cp-doc-name">Customer Notes</div>
                    </div>
                    <div className="cp-doc-date">28 May 2025</div>
                    <button className="cp-doc-dl" onClick={() => showToast('Downloading Customer Notes...')}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row Cards (4 Columns) */}
          <div className="cp-bottom-4grid" style={{ marginTop: 16 }}>
            {/* Card 1: Load Info */}
            <div className="cp-card">
              <div className="cp-card-header">
                <h2 className="cp-card-title">LOAD INFORMATION</h2>
              </div>
              <div className="cp-info-group">
                <div className="cp-info-row">
                  <span className="cp-info-label">Load ID</span>
                  <span className="cp-info-val">{selectedLoadId}</span>
                </div>
                <div className="cp-info-row">
                  <span className="cp-info-label">Reference</span>
                  <span className="cp-info-val">PO-9876</span>
                </div>
                <div className="cp-info-row">
                  <span className="cp-info-label">Type</span>
                  <span className="cp-info-val">Car Carrier</span>
                </div>
                <div className="cp-info-row">
                  <span className="cp-info-label">Items</span>
                  <span className="cp-info-val">2 Vehicles</span>
                </div>
                <div className="cp-info-row">
                  <span className="cp-info-label">Total Weight</span>
                  <span className="cp-info-val">3,400 kg</span>
                </div>
                <div className="cp-info-row">
                  <span className="cp-info-label">Declared Value</span>
                  <span className="cp-info-val">$85,000.00</span>
                </div>
                <div className="cp-info-row">
                  <span className="cp-info-label">Special Instructions</span>
                  <span className="cp-info-val">Handle with care.</span>
                </div>
                <div className="cp-info-row">
                  <span className="cp-info-label">Created</span>
                  <span className="cp-info-val">28 May 2025 09:10 AM</span>
                </div>
              </div>
            </div>

            {/* Card 2: Schedule & Location */}
            <div className="cp-card">
              <div className="cp-card-header">
                <h2 className="cp-card-title">SCHEDULE &amp; LOCATION</h2>
              </div>
              <div className="cp-info-group">
                <div className="cp-loc-block">
                  <div className="cp-loc-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="cp-loc-title">Pickup Location</div>
                    <div className="cp-loc-address" style={{ fontWeight: '600', color: '#0f172a' }}>Melbourne VIC 3000</div>
                    <div className="cp-loc-address">123 Collins St, Melbourne VIC</div>
                  </div>
                </div>

                <div className="cp-info-row">
                  <span className="cp-info-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Pickup Date &amp; Time
                  </span>
                  <span className="cp-info-val">30 May 2025 02:30 PM</span>
                </div>

                <div className="cp-loc-block mt-16">
                  <div className="cp-loc-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="cp-loc-title">Delivery Location</div>
                    <div className="cp-loc-address" style={{ fontWeight: '600', color: '#0f172a' }}>Sydney NSW 2000</div>
                    <div className="cp-loc-address">456 George St, Sydney NSW</div>
                  </div>
                </div>

                <div className="cp-info-row">
                  <span className="cp-info-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Delivery Date &amp; Time
                  </span>
                  <span className="cp-info-val">30 May 2025 ETA: 02:30 PM</span>
                </div>
              </div>
            </div>

            {/* Card 3: Recent Updates */}
            <div className="cp-card">
              <div className="cp-card-header">
                <h2 className="cp-card-title">RECENT UPDATES</h2>
                <button className="cp-link-btn" onClick={() => showToast('Showing all status updates')}>View all updates &rarr;</button>
              </div>

              <div className="cp-activity-list">
                <div className="cp-activity-item">
                  <div className="cp-act-icon act-green">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="cp-act-content">
                    <div className="cp-act-text">Load status updated to <strong>In Transit</strong></div>
                    <div className="cp-act-sub">30 May 2025 02:30 PM</div>
                  </div>
                </div>

                <div className="cp-activity-item">
                  <div className="cp-act-icon act-green">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="cp-act-content">
                    <div className="cp-act-text">Departed Melbourne VIC</div>
                    <div className="cp-act-sub">30 May 2025 02:15 PM</div>
                  </div>
                </div>

                <div className="cp-activity-item">
                  <div className="cp-act-icon act-green">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="cp-act-content">
                    <div className="cp-act-text">Loaded successfully</div>
                    <div className="cp-act-sub">30 May 2025 02:00 PM</div>
                  </div>
                </div>

                <div className="cp-activity-item">
                  <div className="cp-act-icon act-green">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="cp-act-content">
                    <div className="cp-act-text">Arrived at pickup location</div>
                    <div className="cp-act-sub">30 May 2025 01:45 PM</div>
                  </div>
                </div>

                <div className="cp-activity-item">
                  <div className="cp-act-icon act-green">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="cp-act-content">
                    <div className="cp-act-text">Driver assigned</div>
                    <div className="cp-act-sub">29 May 2025 11:30 AM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Contact & Support */}
            <div className="cp-card">
              <div className="cp-card-header">
                <h2 className="cp-card-title">CONTACT &amp; SUPPORT</h2>
              </div>
              <p style={{ fontSize: 10.5, color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                If you have any questions or need assistance with your load, please contact our dispatch team.
              </p>
              <button
                onClick={() => navigate('/customer/dispatcher-chat')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  backgroundColor: '#f0f5ff',
                  border: '1px solid #bfdbfe',
                  color: '#2563eb',
                  borderRadius: 6,
                  padding: '7px 12px',
                  fontSize: 11.5,
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginBottom: 12,
                  fontFamily: 'inherit'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Message Dispatch
              </button>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 11px', display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 10.5, fontWeight: '700', color: '#0f172a' }}>Response time</span>
                  <span style={{ fontSize: 9.5, color: '#64748b' }}>Usually within 15 minutes during business hours.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showSupportModal && (
        <div className="cp-modal-overlay" onClick={() => setShowSupportModal(false)}>
          <div className="cp-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: '800' }}>Shipper Help Desk</h3>
              <button onClick={() => setShowSupportModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleSupportSubmit} style={{ padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: '800', color: '#64748b', marginBottom: 4 }}>SUBJECT</label>
                <input type="text" value={supportSubject} onChange={(e) => setSupportSubject(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: '800', color: '#64748b', marginBottom: 4 }}>DESCRIPTION</label>
                <textarea value={supportDescription} onChange={(e) => setSupportDescription(e.target.value)} style={{ width: '100%', height: 100, padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', resize: 'none' }} required />
              </div>
              <button type="submit" className="cp-btn cp-btn-blue" style={{ width: '100%', justifyContent: 'center' }}>Submit Ticket</button>
            </form>
          </div>
        </div>
      )}

      {/* Book Shipment Modal */}
      {showBookModal && (
        <div className="cp-modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowBookModal(false)}>
          <div className="cp-modal-content" style={{ maxWidth: 620, width: '92%', maxHeight: '88vh', display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)', background: '#ffffff' }} onClick={(e) => e.stopPropagation()}>

            {/* Modal Header (Fixed top) */}
            <div style={{ padding: '14px 20px', flexShrink: 0, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: 10, fontWeight: '800', padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase' }}>New Load</span>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: '700', color: '#ffffff' }}>Create Cargo Booking</h3>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Fill in shipment specifications, route origin &amp; destination details below.</p>
              </div>
              <button onClick={() => setShowBookModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#94a3b8', width: 28, height: 28, borderRadius: '50%', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
            </div>

            {/* Modal Form (Flex Column) */}
            <form onSubmit={handleBookSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', margin: 0 }}>

              {/* Scrollable Form Body */}
              <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>

                {/* SECTION 1: CARGO INFORMATION */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: '800', color: '#2563eb', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>📦 1. Cargo Specifications</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 10.5, fontWeight: '700', color: '#475569', marginBottom: 3 }}>CARGO CATEGORY *</label>
                      <select
                        value={bookCargoType}
                        onChange={(e) => setBookCargoType(e.target.value)}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, color: '#0f172a', outline: 'none', backgroundColor: '#fff' }}
                        required
                      >
                        <option value="Car Carrier">Car Carrier (Vehicle Transport)</option>
                        <option value="General Freight">General Freight</option>
                        <option value="Dangerous Goods">Dangerous Goods (Hazmat)</option>
                        <option value="Warehousing / 3PL">Warehousing / 3PL</option>
                        <option value="Refrigerated Freight">Refrigerated / Cold Chain</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 10.5, fontWeight: '700', color: '#475569', marginBottom: 3 }}>ESTIMATED WEIGHT / UNITS</label>
                      <input
                        type="text"
                        value={bookWeight}
                        onChange={(e) => setBookWeight(e.target.value)}
                        placeholder="e.g. 3,450 kg / 2 Vehicles"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 10.5, fontWeight: '700', color: '#475569', marginBottom: 3 }}>VEHICLE / CARGO DESCRIPTION &amp; SPECS *</label>
                    <input
                      type="text"
                      value={bookCargoSpecs}
                      onChange={(e) => setBookCargoSpecs(e.target.value)}
                      placeholder="e.g. 2024 Toyota RAV4 &amp; 2023 Mazda CX-5 (Enclosed Carrier)"
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>

                {/* SECTION 2: ROUTE ORIGIN & DESTINATION */}
                <div style={{ marginBottom: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, fontWeight: '800', color: '#2563eb', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>📍 2. Route &amp; Locations</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 10.5, fontWeight: '700', color: '#475569', marginBottom: 3 }}>PICKUP ORIGIN (CITY, STATE) *</label>
                      <input
                        type="text"
                        value={bookOrigin}
                        onChange={(e) => setBookOrigin(e.target.value)}
                        placeholder="e.g. Melbourne VIC 3000"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 10.5, fontWeight: '700', color: '#475569', marginBottom: 3 }}>DELIVERY DESTINATION (CITY, STATE) *</label>
                      <input
                        type="text"
                        value={bookDestination}
                        onChange={(e) => setBookDestination(e.target.value)}
                        placeholder="e.g. Sydney NSW 2000"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: DATES & SCHEDULE */}
                <div style={{ marginBottom: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 11, fontWeight: '800', color: '#2563eb', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>📅 3. Schedule &amp; Priority</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 10.5, fontWeight: '700', color: '#475569', marginBottom: 3 }}>PICKUP DATE *</label>
                      <input
                        type="date"
                        value={bookPickupDate}
                        onChange={(e) => setBookPickupDate(e.target.value)}
                        style={{ width: '100%', padding: '6.5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11.5, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 10.5, fontWeight: '700', color: '#475569', marginBottom: 3 }}>EST. DELIVERY DATE</label>
                      <input
                        type="date"
                        value={bookDeliveryDate}
                        onChange={(e) => setBookDeliveryDate(e.target.value)}
                        style={{ width: '100%', padding: '6.5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11.5, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 10.5, fontWeight: '700', color: '#475569', marginBottom: 3 }}>SERVICE PRIORITY</label>
                      <select
                        value={bookPriority}
                        onChange={(e) => setBookPriority(e.target.value)}
                        style={{ width: '100%', padding: '7px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11.5, color: '#0f172a', outline: 'none', backgroundColor: '#fff' }}
                      >
                        <option value="Standard Delivery">Standard Delivery</option>
                        <option value="Express Freight">Express Freight (Urgent)</option>
                        <option value="Overnight Direct">Overnight Direct</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: SPECIAL INSTRUCTIONS */}
                <div style={{ paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                  <label style={{ display: 'block', fontSize: 10.5, fontWeight: '700', color: '#475569', marginBottom: 3 }}>SPECIAL DISPATCH INSTRUCTIONS (OPTIONAL)</label>
                  <textarea
                    value={bookNotes}
                    onChange={(e) => setBookNotes(e.target.value)}
                    placeholder="e.g. Driver must contact site manager 30 mins prior to arrival. Gate access code: #4920"
                    style={{ width: '100%', height: 48, padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11.5, color: '#0f172a', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                  />
                </div>

              </div>

              {/* FOOTER ACTIONS (Fixed bottom inside modal card) */}
              <div style={{ padding: '12px 20px', flexShrink: 0, background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: '600', fontSize: 12, cursor: 'pointer' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cp-btn cp-btn-blue"
                  style={{ padding: '8.5px 22px', borderRadius: 6, fontSize: 12.5, fontWeight: '700', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 3px 10px rgba(37, 99, 235, 0.25)', cursor: 'pointer' }}
                >
                  <span>🚀</span> Submit Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingLoadId && (
        <div className="cp-modal-overlay" onClick={() => setDeletingLoadId(null)}>
          <div className="cp-modal-content" style={{ maxWidth: 420, borderRadius: 12 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '18px 20px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#fef2f2', color: '#dc2626', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                🗑️
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: 17, fontWeight: '800', color: '#0f172a' }}>Delete Load Record?</h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Are you sure you want to delete load record <strong>{deletingLoadId}</strong>? This action cannot be undone.
              </p>
            </div>

            <div style={{ padding: '12px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderRadius: '0 0 12px 12px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setDeletingLoadId(null)}
                style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: '600', fontSize: 12, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: '#dc2626', color: '#fff', fontWeight: '700', fontSize: 12, cursor: 'pointer' }}
              >
                Delete Load
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ EDIT LOAD MODAL */}
      {editingLoad && (
        <div className="cp-modal-overlay" onClick={() => setEditingLoad(null)}>
          <div
            className="cp-modal-content"
            style={{ maxWidth: 520, borderRadius: 14, padding: 0, overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '16px 20px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(37,99,235,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>Edit Load — {editingLoad.id}</h3>
                  <p style={{ margin: 0, fontSize: 10.5, color: '#94a3b8' }}>Ref: {editingLoad.ref}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingLoad(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4, borderRadius: 6 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Form Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Route */}
              <div>
                <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Route</label>
                <input
                  type="text"
                  value={editingLoad.route}
                  onChange={(e) => setEditingLoad({ ...editingLoad, route: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 7, fontSize: 13, color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  placeholder="e.g. Melbourne VIC → Sydney NSW"
                />
              </div>

              {/* 2-col row: Type + Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Load Type</label>
                  <select
                    value={editingLoad.type}
                    onChange={(e) => setEditingLoad({ ...editingLoad, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 7, fontSize: 12.5, color: '#0f172a', outline: 'none', cursor: 'pointer', background: '#fff', fontFamily: 'inherit' }}
                  >
                    <option>Car Carrier</option>
                    <option>General Freight</option>
                    <option>Dangerous Goods</option>
                    <option>Warehousing / 3PL</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Status</label>
                  <select
                    value={editingLoad.status}
                    onChange={(e) => setEditingLoad({ ...editingLoad, status: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 7, fontSize: 12.5, color: '#0f172a', outline: 'none', cursor: 'pointer', background: '#fff', fontFamily: 'inherit' }}
                  >
                    <option>Scheduled</option>
                    <option>Confirmed</option>
                    <option>Dispatched</option>
                    <option>At Pickup</option>
                    <option>In Transit</option>
                    <option>Arrived</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Driver */}
              <div>
                <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Driver</label>
                <input
                  type="text"
                  value={editingLoad.driver}
                  onChange={(e) => setEditingLoad({ ...editingLoad, driver: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 7, fontSize: 13, color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  placeholder="Driver name or 'Unassigned'"
                />
              </div>

              {/* 2-col row: Pickup + Delivery */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Pickup Date</label>
                  <input
                    type="text"
                    value={editingLoad.pickup}
                    onChange={(e) => setEditingLoad({ ...editingLoad, pickup: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 7, fontSize: 13, color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    placeholder="e.g. 30 May 2025"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Delivery Date</label>
                  <input
                    type="text"
                    value={editingLoad.delivery}
                    onChange={(e) => setEditingLoad({ ...editingLoad, delivery: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 7, fontSize: 13, color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    placeholder="e.g. 31 May 2025"
                  />
                </div>
              </div>

              {/* ETA */}
              <div>
                <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>ETA / Delivered</label>
                <input
                  type="text"
                  value={editingLoad.eta}
                  onChange={(e) => setEditingLoad({ ...editingLoad, eta: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 7, fontSize: 13, color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  placeholder="e.g. ETA: 02:30 PM or Arrived"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                onClick={() => setEditingLoad(null)}
                style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: '600', fontSize: 12, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                style={{ padding: '8.5px 22px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff', fontWeight: '700', fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 3px 10px rgba(37,99,235,0.25)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="cp-toast">
          <div className="cp-toast-icon">&check;</div>
          <span className="cp-toast-text">{toast}</span>
          <button onClick={() => setToast(null)} className="cp-toast-close">&times;</button>
        </div>
      )}
    </div>
  );
};

export default MyLoads;
