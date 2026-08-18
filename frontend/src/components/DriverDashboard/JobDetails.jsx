import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  FiArrowLeft, FiMoreVertical, FiNavigation,
  FiCheckCircle, FiClock, FiUpload, FiMessageSquare,
  FiCamera, FiShield, FiBookOpen, FiPhone,
  FiChevronRight, FiRefreshCw, FiTruck, FiMapPin,
  FiPackage, FiAlertTriangle, FiEdit2, FiX, FiDownload,
  FiFileText, FiPrinter, FiEye, FiPlus, FiCheck
} from 'react-icons/fi';

const STATUS_META = {
  UPCOMING:    { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd', btnBg: '#7c3aed', btnText: 'Start Job' },
  IN_PROGRESS: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d', btnBg: '#d97706', btnText: 'Complete Job' },
  COMPLETED:   { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7', btnBg: '#059669', btnText: 'Completed' },
  CANCELLED:   { bg: '#ffe4e6', text: '#9f1239', border: '#fecdd3', btnBg: '#e11d48', btnText: 'Cancelled' },
};

const STOP_STATUS = {
  UPCOMING:  { dot: '#7c3aed', label: 'Upcoming', bg: '#ede9fe', text: '#5b21b6' },
  COMPLETED: { dot: '#10b981', label: 'Completed', bg: '#d1fae5', text: '#065f46' },
  CANCELLED: { dot: '#e11d48', label: 'Cancelled', bg: '#ffe4e6', text: '#9f1239' },
};

const TABS = ['Overview', 'Stops & Items', 'Documents', 'Photos', 'Activity'];

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);

  // Modals state
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Consignment Note');
  const [viewDocModal, setViewDocModal] = useState(null);

  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoTag, setPhotoTag] = useState('Inspection');
  const [viewPhotoModal, setViewPhotoModal] = useState(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('UPCOMING');
  const [statusNote, setStatusNote] = useState('');

  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(null); // 'pickup' or 'delivery'
  const [showItemsModal, setShowItemsModal] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      // Try fetching by load ID or look up in driver jobs
      let loadData = null;
      if (id) {
        const res = await api.get(`/loads/${id}`).catch(() => null);
        if (res && res.data) {
          loadData = res.data.data || res.data;
        }
      }

      if (!loadData) {
        const jobsRes = await api.get('/driver-portal/jobs').catch(() => null);
        const list = jobsRes?.data?.data?.jobs || jobsRes?.data?.jobs || [];
        loadData = list.find(j => j.id === id || j.loadNumber === id) || list[0];
      }

      if (loadData) {
        const pickupStop = (loadData.stops || []).find(s => s.type === 'PICKUP') || {};
        const deliveryStop = (loadData.stops || []).find(s => s.type === 'DROPOFF' || s.type === 'DELIVERY') || {};
        
        const formatted = {
          id: loadData.loadNumber || loadData.id || id,
          subTitle: loadData.loadType || 'General Freight',
          status: loadData.status === 'ACTIVE' ? 'IN_PROGRESS' : loadData.status || 'UPCOMING',
          statusText: loadData.status || 'Upcoming',
          statusCountdown: '',
          origin: loadData.origin || pickupStop.address || 'Origin',
          destination: loadData.destination || deliveryStop.address || 'Destination',
          date: loadData.createdAt ? new Date(loadData.createdAt).toLocaleDateString() : 'Today',
          startTime: '08:00 AM',
          endTime: '05:00 PM',
          loadType: loadData.loadType || 'General Freight',
          stops: `${(loadData.stops || []).length || 2} Stops`,
          reference: loadData.poNumber || loadData.loadNumber || loadData.id,
          priority: 'Normal',
          trailer: loadData.trailer?.rego || loadData.trailerId || 'Unassigned',
          specialInstructions: loadData.specialInstructions || 'Handle with care.',
          pickup: {
            name: pickupStop.name || 'Pickup Terminal',
            address: pickupStop.address || loadData.origin || 'Pickup Address',
            suburb: pickupStop.city || '',
            contact: pickupStop.contactName || 'Site Contact',
            phone: pickupStop.contactPhone || '',
            time: '08:00 AM',
            date: 'Today',
            status: pickupStop.status || 'UPCOMING'
          },
          delivery: {
            name: deliveryStop.name || 'Delivery Terminal',
            address: deliveryStop.address || loadData.destination || 'Delivery Address',
            suburb: deliveryStop.city || '',
            contact: deliveryStop.contactName || 'Site Contact',
            phone: deliveryStop.contactPhone || '',
            time: '05:00 PM',
            date: 'Today',
            status: deliveryStop.status || 'UPCOMING'
          },
          items: {
            total: (loadData.items || []).length,
            damaged: (loadData.items || []).filter(i => i.condition === 'DAMAGED').length,
            photosRequired: 0,
            photosTaken: (loadData.items || []).filter(i => i.photoUrl).length
          },
          totalVehicles: (loadData.items || []).length,
          documents: (loadData.documents || []).map(d => ({
            id: d.id,
            name: d.title || d.fileName || 'Document.pdf',
            type: 'PDF',
            date: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recent',
            size: '1 MB'
          })),
          photos: [],
          activities: (loadData.activities || []).map(a => ({
            time: a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
            action: a.description || a.type || 'Activity logged',
            user: a.performedBy || 'System'
          }))
        };
        setJob(formatted);
        setSelectedStatus(formatted.status);
      } else {
        setJob(null);
      }
    } catch (err) {
      console.error('Failed to load job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const meta = STATUS_META[job.status] || STATUS_META.UPCOMING;
  const pickupStop = STOP_STATUS[job.pickup?.status] || STOP_STATUS.UPCOMING;
  const deliveryStop = STOP_STATUS[job.delivery?.status] || STOP_STATUS.UPCOMING;

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Handler to cycle or start job
  const handlePrimaryJobAction = () => {
    if (job.status === 'CANCELLED') {
      showToast('This job has been cancelled and cannot be started.');
      return;
    }
    if (job.status === 'COMPLETED') {
      showToast('This job is already completed.');
      return;
    }
    if (job.status === 'UPCOMING') {
      const updated = {
        ...job,
        status: 'IN_PROGRESS',
        statusText: 'In Progress',
        statusCountdown: 'In Transit',
        activities: [
          { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: 'Job started by driver', user: 'Noah Williams' },
          ...job.activities
        ]
      };
      setJob(updated);
      showToast(`Job ${job.id} started successfully!`);
    } else if (job.status === 'IN_PROGRESS') {
      const updated = {
        ...job,
        status: 'COMPLETED',
        statusText: 'Completed',
        statusCountdown: 'Completed',
        pickup: { ...job.pickup, status: 'COMPLETED' },
        delivery: { ...job.delivery, status: 'COMPLETED' },
        activities: [
          { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: 'Job marked completed by driver', user: 'Noah Williams' },
          ...job.activities
        ]
      };
      setJob(updated);
      showToast(`Job ${job.id} marked as COMPLETED!`);
    }
  };

  // Upload Document submit
  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!docName.trim()) {
      showToast('Please enter a document name');
      return;
    }
    const newDoc = {
      id: Date.now(),
      name: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
      type: 'PDF',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      size: '1.1 MB'
    };
    setJob(prev => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
      activities: [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: `Uploaded document: ${newDoc.name}`, user: 'Noah Williams' },
        ...prev.activities
      ]
    }));
    setDocName('');
    setShowDocUploadModal(false);
    showToast(`Document "${newDoc.name}" uploaded successfully!`);
  };

  // Add Photo submit
  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!photoTitle.trim()) {
      showToast('Please enter a photo caption');
      return;
    }
    const newPhoto = {
      id: Date.now(),
      title: photoTitle,
      date: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      tag: photoTag
    };
    setJob(prev => ({
      ...prev,
      photos: [newPhoto, ...prev.photos],
      items: { ...prev.items, photosTaken: prev.items.photosTaken + 1 },
      activities: [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: `Added photo: ${newPhoto.title}`, user: 'Noah Williams' },
        ...prev.activities
      ]
    }));
    setPhotoTitle('');
    setShowPhotoUploadModal(false);
    showToast(`Photo "${newPhoto.title}" added to job records!`);
  };

  // Update Status submit
  const handleSaveStatus = (e) => {
    e.preventDefault();
    const statusMap = {
      UPCOMING: { text: 'Upcoming', cd: 'Pending Start' },
      IN_PROGRESS: { text: 'In Progress', cd: 'In Transit' },
      COMPLETED: { text: 'Completed', cd: 'Completed' },
      CANCELLED: { text: 'Cancelled', cd: 'Cancelled' }
    };
    const meta = statusMap[selectedStatus];
    setJob(prev => ({
      ...prev,
      status: selectedStatus,
      statusText: meta.text,
      statusCountdown: meta.cd,
      activities: [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: `Status updated to ${meta.text}${statusNote ? `: ${statusNote}` : ''}`, user: 'Noah Williams' },
        ...prev.activities
      ]
    }));
    setStatusNote('');
    setShowStatusModal(false);
    showToast(`Job status updated to ${meta.text}`);
  };

  const InfoCell = ({ label, value, badge }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</span>
      {badge
        ? <span style={{ fontSize: 12, fontWeight: 800, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: 8, display: 'inline-block', width: 'fit-content' }}>{value}</span>
        : <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{value}</span>
      }
    </div>
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, border: '4px solid #e0e7ff', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#64748b', fontWeight: 700, fontSize: 14 }}>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div style={{ background: '#fff', padding: 32, borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 40 }}>📦</span>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>No Job Record Found</h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>No assigned load details could be found for this reference.</p>
          <button onClick={() => navigate('/driver/assigned-jobs')} style={{ background: '#4f46e5', color: '#fff', fontWeight: 800, padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, marginTop: 8 }}>
            Back to Assigned Loads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: 13, padding: '12px 20px', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.2s' }}>
          <FiCheckCircle color="#10b981" size={18} /> {toast}
        </div>
      )}

      <div style={{ display: 'flex', flex: 1 }}>

        {/* ══════════════ MAIN CONTENT ══════════════ */}
        <div style={{ flex: 1, padding: '24px 28px 40px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* ── Back & Title ── */}
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => navigate('/driver/assigned-jobs')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', fontSize: 13, fontWeight: 700, color: '#3b82f6', cursor: 'pointer', padding: '0 0 14px', textDecoration: 'none' }}
            >
              <FiArrowLeft size={14} /> Back to Loads
            </button>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#0f172a', textAlign: 'center', letterSpacing: '-0.5px' }}>Job Details</h1>
          </div>

          {/* ── Job Header Card ── */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#1d4ed8', fontFamily: 'monospace' }}>{job.id}</span>
                <span style={{ fontSize: 11, fontWeight: 900, padding: '4px 12px', borderRadius: 20, background: meta.bg, color: meta.text, border: `1px solid ${meta.border}` }}>
                  {job.statusText}
                </span>
              </div>
              
              {/* 3-DOTS ACTION BUTTON & DROPDOWN */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                  style={{ background: showMenuDropdown ? '#f1f5f9' : 'none', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <FiMoreVertical size={16} />
                </button>

                {showMenuDropdown && (
                  <div style={{ position: 'absolute', right: 0, top: 42, width: 200, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, padding: '6px 0' }}>
                    <div onClick={() => { setShowMenuDropdown(false); window.print(); }} style={{ padding: '10px 16px', fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <FiPrinter size={14} color="#4F46E5" /> Print Job Sheet
                    </div>
                    <div onClick={() => { setShowMenuDropdown(false); setShowStatusModal(true); }} style={{ padding: '10px 16px', fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <FiEdit2 size={14} color="#F59E0B" /> Change Status
                    </div>
                    <div onClick={() => { setShowMenuDropdown(false); showToast('Dispatch requested to call driver back.'); }} style={{ padding: '10px 16px', fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <FiPhone size={14} color="#10B981" /> Call Dispatch
                    </div>
                    <div onClick={() => { setShowMenuDropdown(false); setShowDocUploadModal(true); }} style={{ padding: '10px 16px', fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <FiUpload size={14} color="#3B82F6" /> Upload Document
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Route */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>{job.origin}</span>
              <FiArrowLeft style={{ transform: 'rotate(180deg)', color: '#94a3b8' }} size={16} />
              <span style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>{job.destination}</span>
            </div>

            {/* Info Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 16, borderTop: '1px solid #f1f5f9', paddingTop: 18 }}>
              <InfoCell label="Date" value={job.date} />
              <InfoCell label="Start Time" value={job.startTime} />
              <InfoCell label="Load Type" value={job.loadType} />
              <InfoCell label="Stops" value={job.stops} badge />
              <InfoCell label="Reference" value={job.reference} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Priority</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ color: '#ef4444' }}>⚑</span> {job.priority}
                </span>
              </div>
            </div>
          </div>

          {/* ── TABS ── */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                  background: 'transparent', border: 'none',
                  color: activeTab === tab ? '#0f172a' : '#64748b',
                  borderBottom: activeTab === tab ? '2px solid #ffcc00' : '2px solid transparent',
                  whiteSpace: 'nowrap', transition: 'all 0.15s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ═══════════ TAB: OVERVIEW ═══════════ */}
          {activeTab === 'Overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* PICKUP */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.2, color: '#10b981', textTransform: 'uppercase' }}>Pickup</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>{job.pickup.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{job.pickup.address}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{job.pickup.suburb}</div>
                    <button
                      onClick={() => setShowDirectionsModal('pickup')}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '7px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#1d4ed8', cursor: 'pointer' }}
                    >
                      <FiNavigation size={12} /> Directions
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div><span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Contact</span><div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 3 }}>{job.pickup.contact}</div><div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{job.pickup.phone}</div></div>
                    <div><span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Time</span><div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 3 }}>{job.pickup.time}</div><div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{job.pickup.date}</div></div>
                  </div>
                </div>
              </div>

              {/* DELIVERY */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.2, color: '#10b981', textTransform: 'uppercase' }}>Delivery</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>{job.delivery.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{job.delivery.address}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{job.delivery.suburb}</div>
                    <button
                      onClick={() => setShowDirectionsModal('delivery')}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '7px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#1d4ed8', cursor: 'pointer' }}
                    >
                      <FiNavigation size={12} /> Directions
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div><span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Contact</span><div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 3 }}>{job.delivery.contact}</div><div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{job.delivery.phone}</div></div>
                    <div><span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>Time</span><div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginTop: 3 }}>{job.delivery.time}</div><div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{job.delivery.date}</div></div>
                  </div>
                </div>
              </div>

              {/* LOAD INFORMATION */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <h3 style={{ margin: '0 0 18px', fontSize: 13, fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.8 }}>Load Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <InfoCell label="Trailer" value={job.trailer} />
                    <InfoCell label="Load Type" value={job.loadType} />
                    <InfoCell label="Reference" value={job.reference} />
                  </div>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Special Instructions</span>
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 14px', fontSize: 12, fontWeight: 600, color: '#92400e', lineHeight: 1.7 }}>
                      {job.specialInstructions}
                    </div>
                  </div>
                </div>
              </div>

              {/* ITEMS SUMMARY */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.8 }}>Items Summary</h3>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#64748b' }}>{job.totalVehicles} Vehicles</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 18 }}>
                  {[
                    { icon: FiTruck,        color: '#3b82f6', label: 'Total Vehicles',  value: job.items.total },
                    { icon: FiAlertTriangle,color: '#ef4444', label: 'Damaged',          value: job.items.damaged },
                    { icon: FiCamera,       color: '#f59e0b', label: 'Photos Required',  value: job.items.photosRequired },
                    { icon: FiCamera,       color: '#10b981', label: 'Photos Taken',     value: job.items.photosTaken },
                  ].map(({ icon: Icon, color, label, value }) => (
                    <div key={label} style={{ textAlign: 'center', background: '#f8fafc', borderRadius: 12, padding: '16px 10px' }}>
                      <Icon size={20} color={color} style={{ marginBottom: 8 }} />
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{value}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowItemsModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  View Items & Positions <FiArrowLeft style={{ transform: 'rotate(180deg)' }} size={14} />
                </button>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px', gap: 12 }}>
                <button
                  onClick={handlePrimaryJobAction}
                  disabled={job.status === 'CANCELLED'}
                  style={{
                    padding: '14px',
                    background: job.status === 'CANCELLED' ? '#cbd5e1' : meta.btnBg,
                    border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 900, color: '#fff',
                    cursor: job.status === 'CANCELLED' ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: job.status === 'CANCELLED' ? 'none' : `0 2px 8px ${meta.btnBg}55`
                  }}
                >
                  <FiCheckCircle size={16} /> {job.status === 'UPCOMING' ? 'Start Job' : job.status === 'IN_PROGRESS' ? 'Complete Job' : meta.btnText}
                </button>
                <button
                  onClick={() => setShowStatusModal(true)}
                  style={{ padding: '14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, fontWeight: 800, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <FiRefreshCw size={15} /> Update Status
                </button>
                <button
                  onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                  style={{ padding: '14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 18, fontWeight: 900, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ···
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ TAB: STOPS & ITEMS ═══════════ */}
          {activeTab === 'Stops & Items' && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 900, color: '#0f172a' }}>Route Stops</h3>
              <div style={{ position: 'relative', paddingLeft: 24 }}>
                <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 2, background: '#e2e8f0' }}></div>
                {[
                  { type: 'Pickup', loc: job.pickup, meta: pickupStop },
                  { type: 'Delivery', loc: job.delivery, meta: deliveryStop },
                ].map(({ type, loc, meta: sm }, idx) => (
                  <div key={type} style={{ position: 'relative', marginBottom: idx === 0 ? 32 : 0, paddingLeft: 24 }}>
                    <div style={{ position: 'absolute', left: -5, top: 4, width: 12, height: 12, borderRadius: '50%', background: sm.dot, border: '2px solid #fff', boxShadow: `0 0 0 2px ${sm.dot}` }}></div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{type}</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>{loc.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 2 }}>{loc.address}, {loc.suburb}</div>
                        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Contact: {loc.contact} · {loc.phone}</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>{loc.time} · {loc.date}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 20, background: sm.bg, color: sm.text }}>{sm.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ TAB: DOCUMENTS ═══════════ */}
          {activeTab === 'Documents' && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#0f172a' }}>Documents ({job.documents.length})</h3>
                <button
                  onClick={() => setShowDocUploadModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#ffcc00', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 900, color: '#000', cursor: 'pointer' }}
                >
                  <FiUpload size={13} /> Upload
                </button>
              </div>
              
              {job.documents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  <FiFileText size={32} style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 13, fontWeight: 700 }}>No documents uploaded yet</div>
                </div>
              ) : (
                job.documents.map(doc => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, background: '#eff6ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiPackage size={16} color="#1d4ed8" />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{doc.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{doc.type} · {doc.date} · {doc.size}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setViewDocModal(doc)} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiEye size={12} /> View
                      </button>
                      <button onClick={() => showToast(`Downloading ${doc.name}...`)} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, color: '#1d4ed8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiDownload size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ═══════════ TAB: PHOTOS ═══════════ */}
          {activeTab === 'Photos' && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#0f172a' }}>Photos ({job.photos.length} taken)</h3>
                <button
                  onClick={() => setShowPhotoUploadModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#ffcc00', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 900, color: '#000', cursor: 'pointer' }}
                >
                  <FiCamera size={13} /> Add Photo
                </button>
              </div>

              {job.photos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  <FiCamera size={32} style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 13, fontWeight: 700 }}>No photos captured yet</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {job.photos.map((photo, i) => (
                    <div
                      key={photo.id}
                      onClick={() => setViewPhotoModal(photo)}
                      style={{ aspect: '4/3', background: `hsl(${210 + (i * 25) % 100}, 40%, 88%)`, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', cursor: 'pointer', border: '1px solid #cbd5e1' }}
                    >
                      <FiCamera size={26} color={`hsl(${210 + (i * 25) % 100}, 60%, 40%)`} />
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#334155', marginTop: 6, padding: '0 8px', textAlign: 'center' }}>{photo.title}</div>
                      <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 9, fontWeight: 900, background: '#4F46E5', color: '#fff', padding: '2px 7px', borderRadius: 6 }}>{photo.tag}</div>
                      <div style={{ position: 'absolute', bottom: 6, left: 6, fontSize: 8.5, fontWeight: 700, background: 'rgba(15,23,42,0.75)', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>{photo.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════ TAB: ACTIVITY ═══════════ */}
          {activeTab === 'Activity' && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 900, color: '#0f172a' }}>Activity Log</h3>
              {job.activities.map(({ time, action, user }, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 18, paddingBottom: 18, borderBottom: i < job.activities.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ width: 36, height: 36, background: '#f1f5f9', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FiClock size={16} color="#64748b" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{action}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>by {user} · {time}, {job.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── DEVELOPER NOTES ── */}
          <div style={{ background: '#0f172a', borderRadius: 16, padding: '28px 32px', color: '#fff', marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <span style={{ fontSize: 18 }}>💻</span>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#fff' }}>Developer Notes – Job Details List</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 24, fontSize: 11 }}>
              {[
                { num: '1.', title: 'Purpose', items: ['Provide drivers with complete job information.', 'Allow status updates, POD capture, photos and communications.'] },
                { num: '2.', title: 'Key Features', items: ['Job summary with key details.', 'Pickup and delivery information with directions.', 'Items summary and quick access to items list.', 'Timeline showing upcoming and pending actions.', 'Quick actions for common tasks.'] },
                { num: '3.', title: 'Data Sources', items: ['Loads module.', 'Stops module.', 'Items / Vehicles module.', 'Documents module.', 'Photos / POD module.'] },
                { num: '4.', title: 'Security & Access', items: ['Drivers can only see jobs assigned to them.', 'All actions and documents are logged.', 'Role-based data visibility.'] },
                { num: '5.', title: 'Integrations', items: ['GPS / Navigation (maps).', 'Messaging (dispatch ↔ driver).', 'Documents (upload & view).', 'Cloud storage (photos, PODs).'] },
                { num: '6.', title: 'Performance', items: ['Load details in < 2 seconds.', 'Images lazy loaded.', 'Works offline and syncs automatically.', 'Data auto-refreshes every 5 minutes.'] },
              ].map(({ num, title, items }) => (
                <div key={title}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: '#fff', marginBottom: 10 }}>{num} {title}</div>
                  <ul style={{ margin: 0, paddingLeft: 14, color: '#94a3b8', lineHeight: 1.8 }}>
                    {items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, fontSize: 11, color: '#94a3b8', fontWeight: 600, flexWrap: 'wrap', gap: 8 }}>
            <span>All times shown in your local time (AEST)</span>
            <span style={{ color: '#f59e0b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
              Data auto-refreshes every 5 minutes
            </span>
            <span>Last updated: {job.date}, 10:15 AM &nbsp; ↻</span>
          </div>
        </div>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        <div style={{ width: 240, flexShrink: 0, background: '#fff', borderLeft: '1px solid #e2e8f0', padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* JOB STATUS */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>Job Status</div>
            <div style={{ background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 14, padding: '16px 16px 14px', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 36, height: 36, background: meta.btnBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiClock size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: meta.text }}>{job.statusText}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: meta.text, opacity: 0.8 }}>{job.statusCountdown}</div>
                </div>
              </div>
            </div>
            <button
              onClick={handlePrimaryJobAction}
              disabled={job.status === 'CANCELLED'}
              style={{
                width: '100%', padding: '12px',
                background: job.status === 'CANCELLED' ? '#cbd5e1' : meta.btnBg,
                border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 900, color: '#fff',
                cursor: job.status === 'CANCELLED' ? 'not-allowed' : 'pointer',
                boxShadow: job.status === 'CANCELLED' ? 'none' : `0 2px 8px ${meta.btnBg}55`
              }}
            >
              {job.status === 'UPCOMING' ? 'Start Job' : job.status === 'IN_PROGRESS' ? 'Complete Job' : meta.btnText}
            </button>
          </div>

          {/* JOB TIMELINE */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16 }}>Job Timeline</div>
            <div style={{ position: 'relative', paddingLeft: 16 }}>
              <div style={{ position: 'absolute', left: 5, top: 0, bottom: 0, width: 2, background: '#e2e8f0' }}></div>
              {[
                { time: job.pickup.time, label: 'Pickup', name: job.pickup.name, location: `${job.pickup.name}, ${job.origin}`, status: job.pickup.status },
                { time: job.delivery.time, label: 'Delivery', name: job.delivery.name, location: `${job.delivery.name}, ${job.destination}`, status: job.delivery.status },
                { time: '', label: 'POD & Close', name: job.delivery.name, location: `${job.delivery.name}, ${job.destination}`, status: job.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING' },
              ].map(({ time, label, location, status }, i) => {
                const dot = status === 'COMPLETED' ? '#10b981' : status === 'UPCOMING' ? '#7c3aed' : status === 'CANCELLED' ? '#e11d48' : '#94a3b8';
                const badge = status === 'COMPLETED' ? { bg: '#d1fae5', text: '#065f46', label: 'Completed' } : status === 'UPCOMING' ? { bg: '#ede9fe', text: '#5b21b6', label: 'Upcoming' } : status === 'CANCELLED' ? { bg: '#ffe4e6', text: '#9f1239', label: 'Cancelled' } : { bg: '#f1f5f9', text: '#64748b', label: 'Pending' };
                return (
                  <div key={i} style={{ position: 'relative', paddingLeft: 18, marginBottom: i < 2 ? 20 : 0 }}>
                    <div style={{ position: 'absolute', left: -5, top: 4, width: 10, height: 10, borderRadius: '50%', background: dot, border: '2px solid #fff', boxShadow: `0 0 0 2px ${dot}` }}></div>
                    {time && <div style={{ fontSize: 11, fontWeight: 900, color: '#0f172a', marginBottom: 2 }}>{time}</div>}
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#334155' }}>{label}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{location}</div>
                    <span style={{ fontSize: 9, fontWeight: 900, padding: '2px 8px', borderRadius: 12, background: badge.bg, color: badge.text, marginTop: 5, display: 'inline-block' }}>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>Quick Actions</div>
            {[
              { label: 'Update Status',    icon: FiEdit2, action: () => setShowStatusModal(true) },
              { label: 'View / Add POD',   icon: FiCheckCircle, action: () => { setActiveTab('Documents'); setShowDocUploadModal(true); } },
              { label: 'Add Photo',        icon: FiCamera, action: () => { setActiveTab('Photos'); setShowPhotoUploadModal(true); } },
              { label: 'Message Dispatch', icon: FiMessageSquare, action: () => showToast('Dispatch chat opened!') },
              { label: 'Upload Document',  icon: FiUpload, action: () => { setActiveTab('Documents'); setShowDocUploadModal(true); } },
              { label: 'Start Navigation', icon: FiNavigation, action: () => setShowDirectionsModal('pickup') },
            ].map(({ label, icon: Icon, action }) => (
              <button key={label} onClick={action}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon size={13} color="#64748b" /> {label}</div>
                <FiChevronRight size={12} color="#94a3b8" />
              </button>
            ))}
          </div>

          {/* HELP & RESOURCES */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>Help & Resources</div>
            {[
              { label: 'How to Use Driver App', icon: FiBookOpen },
              { label: 'Safety Procedures',     icon: FiShield },
              { label: 'Contact Support',        icon: FiPhone },
            ].map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => showToast(`Opening ${label}...`)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon size={13} color="#64748b" /> {label}</div>
                <FiChevronRight size={12} color="#94a3b8" />
              </button>
            ))}
          </div>

          {/* STATUS */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 8 }}>Last sync</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>29 May 2025, 10:15 AM</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }}></span>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#10b981' }}>Online</span>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 10 }}>Auto refresh: Every 5 minutes</div>
            <button onClick={() => showToast('Data synchronized cleanly!')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center', padding: '9px', background: '#0f172a', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 800, color: '#fff', cursor: 'pointer' }}>
              <FiRefreshCw size={12} /> Sync Now
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── MODALS ── */}
      {/* ════════════════════════════════════════════════════════════════ */}

      {/* 1. DOCUMENT UPLOAD MODAL */}
      {showDocUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 450, borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', animation: 'fadeIn 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a' }}>Upload Job Document</h3>
              <button onClick={() => setShowDocUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><FiX size={18} /></button>
            </div>
            <form onSubmit={handleAddDocument} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>Document Name</label>
                <input
                  type="text"
                  placeholder="e.g. Proof of Delivery - Signed.pdf"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 600, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>Document Type</label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 600, outline: 'none', background: '#fff' }}
                >
                  <option>Consignment Note</option>
                  <option>Proof of Delivery (POD)</option>
                  <option>Pickup Receipt</option>
                  <option>Toll / Expense Receipt</option>
                  <option>Other Attachment</option>
                </select>
              </div>
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: 12, padding: '24px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}>
                <FiUpload size={24} color="#3B82F6" style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>Click or Drag PDF file here</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Supports PDF, JPG, PNG up to 10MB</div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setShowDocUploadModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#475569', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#ffcc00', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 900, color: '#000', cursor: 'pointer' }}>Upload Document</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VIEW DOCUMENT PREVIEW MODAL */}
      {viewDocModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 550, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ background: '#0f172a', padding: '16px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiFileText size={18} color="#ffcc00" />
                <span style={{ fontSize: 14, fontWeight: 800 }}>{viewDocModal.name}</span>
              </div>
              <button onClick={() => setViewDocModal(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><FiX size={18} /></button>
            </div>
            <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc' }}>
              <div style={{ width: 64, height: 64, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FiFileText size={32} color="#1d4ed8" />
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 900, color: '#0f172a' }}>{viewDocModal.name}</h4>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Document Type: {viewDocModal.type} &bull; Uploaded {viewDocModal.date}</p>
              <div style={{ margin: '24px auto 0', padding: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, width: '80%', fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>
                [PDF Document Content Preview Rendered Here]
              </div>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>Size: {viewDocModal.size}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => window.print()} style={{ padding: '8px 14px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiPrinter size={13} /> Print
                </button>
                <button onClick={() => { setViewDocModal(null); showToast(`Downloaded ${viewDocModal.name}`); }} style={{ padding: '8px 16px', background: '#1d4ed8', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiDownload size={13} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PHOTO UPLOAD MODAL */}
      {showPhotoUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 450, borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a' }}>Add Inspection / POD Photo</h3>
              <button onClick={() => setShowPhotoUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><FiX size={18} /></button>
            </div>
            <form onSubmit={handleAddPhoto} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>Photo Title / Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Front Bumper Inspection"
                  value={photoTitle}
                  onChange={e => setPhotoTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 600, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>Category Tag</label>
                <select
                  value={photoTag}
                  onChange={e => setPhotoTag(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 600, outline: 'none', background: '#fff' }}
                >
                  <option>Inspection</option>
                  <option>Pickup</option>
                  <option>Loading</option>
                  <option>Damage Report</option>
                  <option>Delivery POD</option>
                </select>
              </div>
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: 12, padding: '24px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}>
                <FiCamera size={26} color="#4F46E5" style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>Take Photo or Choose File</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>GPS & Timestamp will be auto-attached</div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setShowPhotoUploadModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#475569', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#ffcc00', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 900, color: '#000', cursor: 'pointer' }}>Save Photo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. VIEW PHOTO LIGHTBOX PREVIEW MODAL */}
      {viewPhotoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 500, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ background: '#0f172a', padding: '14px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 800 }}>{viewPhotoModal.title}</span>
              <button onClick={() => setViewPhotoModal(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><FiX size={18} /></button>
            </div>
            <div style={{ aspect: '4/3', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <FiCamera size={48} color="#94a3b8" />
              <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 700 }}>
                Tag: {viewPhotoModal.tag}
              </div>
            </div>
            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Captured: {viewPhotoModal.date}</span>
              <button onClick={() => setViewPhotoModal(null)} style={{ padding: '8px 16px', background: '#0f172a', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#fff', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. UPDATE STATUS MODAL */}
      {showStatusModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 450, borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a' }}>Update Job Status</h3>
              <button onClick={() => setShowStatusModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSaveStatus} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>Select New Status</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { key: 'UPCOMING', label: 'Upcoming', desc: 'Job scheduled for future' },
                    { key: 'IN_PROGRESS', label: 'In Progress / In Transit', desc: 'Driver en route or loading' },
                    { key: 'COMPLETED', label: 'Completed', desc: 'Delivered and POD signed' },
                    { key: 'CANCELLED', label: 'Cancelled', desc: 'Job cancelled by dispatch or client' },
                  ].map(st => (
                    <label key={st.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: selectedStatus === st.key ? '2px solid #4F46E5' : '1px solid #cbd5e1', background: selectedStatus === st.key ? '#eef2ff' : '#fff', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="jobStatus"
                        checked={selectedStatus === st.key}
                        onChange={() => setSelectedStatus(st.key)}
                      />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{st.label}</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>{st.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>Status Note / Reason</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes for dispatcher..."
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setShowStatusModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#475569', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#4F46E5', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 900, color: '#fff', cursor: 'pointer' }}>Update Status</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. GPS NAVIGATION MODAL */}
      {showDirectionsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 460, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ background: '#1d4ed8', padding: '16px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiNavigation size={18} />
                <span style={{ fontSize: 14, fontWeight: 800 }}>GPS Directions & Navigation</span>
              </div>
              <button onClick={() => setShowDirectionsModal(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><FiX size={18} /></button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ background: '#eff6ff', borderRadius: 12, padding: 14, marginBottom: 16, border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: 4 }}>Target Destination</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>{showDirectionsModal === 'pickup' ? job.pickup.name : job.delivery.name}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{showDirectionsModal === 'pickup' ? job.pickup.address : job.delivery.address}, {showDirectionsModal === 'pickup' ? job.pickup.suburb : job.delivery.suburb}</div>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, textAlign: 'center', border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <FiMapPin size={32} color="#1d4ed8" style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Calculated Distance: 745 km</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Estimated Drive Time: 7 hrs 40 mins (Heavy Vehicle Route)</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={() => {
                    const addr = encodeURIComponent(showDirectionsModal === 'pickup' ? `${job.pickup.address}, ${job.pickup.suburb}` : `${job.delivery.address}, ${job.delivery.suburb}`);
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, '_blank');
                    setShowDirectionsModal(null);
                  }}
                  style={{ width: '100%', padding: '12px', background: '#10b981', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 900, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <FiNavigation size={15} /> Open Google Maps Navigation
                </button>
                <button onClick={() => setShowDirectionsModal(null)} style={{ width: '100%', padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 800, color: '#475569', cursor: 'pointer' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. ITEMS & POSITIONS BREAKDOWN MODAL */}
      {showItemsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 550, borderRadius: 16, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a' }}>Vehicles & Positions breakdown</h3>
              <button onClick={() => setShowItemsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><FiX size={18} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 350, overflowY: 'auto', paddingRight: 4 }}>
              {[
                { pos: 'Top Deck 1', vin: 'VIN-8849120491', make: 'Toyota Hilux 2024', status: 'Loaded & Strapped' },
                { pos: 'Top Deck 2', vin: 'VIN-9920194012', make: 'Ford Ranger XLT', status: 'Loaded & Strapped' },
                { pos: 'Top Deck 3', vin: 'VIN-4481029411', make: 'Isuzu D-Max 2025', status: 'Loaded & Strapped' },
                { pos: 'Lower Deck 1', vin: 'VIN-1120934812', make: 'Hyundai Tucson 2024', status: 'Loaded & Strapped' },
                { pos: 'Lower Deck 2', vin: 'VIN-3391029384', make: 'Kia Sportage GT', status: 'Loaded & Strapped' },
                { pos: 'Lower Deck 3', vin: 'VIN-7729104921', make: 'Mazda CX-5 GT', status: 'Loaded & Strapped' },
              ].slice(0, job.items.total || 4).map(item => (
                <div key={item.pos} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FiTruck color="#4F46E5" size={16} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: '#0f172a' }}>{item.make} ({item.pos})</div>
                      <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>{item.vin}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, background: '#d1fae5', color: '#065f46', padding: '3px 8px', borderRadius: 6 }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18, textAlign: 'right' }}>
              <button onClick={() => setShowItemsModal(false)} style={{ padding: '9px 18px', background: '#0f172a', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, color: '#fff', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
