import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, QrCode, Upload, Plus, Trash2, Edit2, CheckCircle2, 
  MapPin, FileText, Camera, Paperclip, ChevronDown, X, Info, FileSpreadsheet, Download, File, Image
} from 'lucide-react';
import api from '../../../services/api';

export default function WarehouseInbound() {
  const location = useLocation();
  const navigate = useNavigate();
  const isYard = location.pathname.startsWith('/yard');

  const docInputRef = useRef(null);
  const photoInputRef = useRef(null);

  // Inbound Details state
  const [inboundType, setInboundType] = useState('');
  const [inboundNo, setInboundNo] = useState('');
  const [supplier, setSupplier] = useState('');
  const [refNote, setRefNote] = useState('');
  const [transportType, setTransportType] = useState('');
  const [driver, setDriver] = useState('');
  const [vehicleTrailer, setVehicleTrailer] = useState('');
  const [dateTime, setDateTime] = useState(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [notes, setNotes] = useState('');

  // Location state
  const [receivingDepot, setReceivingDepot] = useState('');
  const [warehouseYard, setWarehouseYard] = useState('');
  const [zone, setZone] = useState('');
  const [row, setRow] = useState('');
  const [bay, setBay] = useState('');
  const [stagingArea, setStagingArea] = useState('');

  const [dbStagingAreas, setDbStagingAreas] = useState([]);
  const [dbLoadLanes, setDbLoadLanes] = useState([]);
  
  const [dbSuppliers, setDbSuppliers] = useState([]);
  const [dbDrivers, setDbDrivers] = useState([]);
  const [dbVehicles, setDbVehicles] = useState([]);
  const [dbWarehouses, setDbWarehouses] = useState([]);

  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        const saRes = await api.get('/warehouse-portal/holding-areas');
        const saData = saRes.data?.data?.holdingAreas || saRes.data?.data || [];
        setDbStagingAreas(saData);

        const llRes = await api.get('/warehouse-portal/load-lanes');
        const llData = llRes.data?.data?.lanes || llRes.data?.data || [];
        setDbLoadLanes(llData);

        const optionsRes = await api.get('/warehouse-portal/inbound/form-options');
        if (optionsRes.data?.success) {
          const { suppliers, drivers, vehicles, warehouses } = optionsRes.data.data;
          setDbSuppliers(suppliers || []);
          setDbDrivers(drivers || []);
          setDbVehicles(vehicles || []);
          setDbWarehouses(warehouses || []);
          
          if (suppliers?.length > 0) setSupplier(suppliers[0].id);
          if (drivers?.length > 0) setDriver(drivers[0].name);
          if (vehicles?.length > 0) setVehicleTrailer(vehicles[0].name);
          if (warehouses?.length > 0) setReceivingDepot(warehouses[0].name);
        }
      } catch (err) {
        console.warn('Could not load WMS locations:', err.message);
      }
    };
    fetchLocations();
  }, []);

  const getSupplierDisplayName = () => {
    if (!supplier) return 'Primary Supplier';
    const found = dbSuppliers.find(s => s.id === supplier || s.name === supplier);
    if (found && found.name) return found.name;
    if (typeof supplier === 'string' && supplier.length > 20 && supplier.includes('-')) {
      return dbSuppliers[0]?.name || 'Primary Supplier';
    }
    return supplier;
  };

  const formatDateTimeDisplay = (dtStr) => {
    if (!dtStr) return 'Not Set';
    try {
      const d = new Date(dtStr);
      if (isNaN(d.getTime())) return dtStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dtStr;
    }
  };

  // Item Entry state
  const [entryTab, setEntryTab] = useState('manual');
  const [itemType, setItemType] = useState('Vehicle (Car Carrying)');
  const [searchVinRego, setSearchVinRego] = useState('');
  
  const [vin, setVin] = useState('');
  const [regoPlate, setRegoPlate] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [colour, setColour] = useState('');
  const [condition, setCondition] = useState('Good');
  const [fuelType, setFuelType] = useState('Petrol');
  const [requirePhotos, setRequirePhotos] = useState(false);
  const [damageNoted, setDamageNoted] = useState(false);

  // Items List
  const [itemsToReceive, setItemsToReceive] = useState([]);

  // Section 5 Documents & Photos Working State
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  // Modal States
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editItemModalOpen, setEditItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!vin.trim()) return;
    const newItem = {
      id: String(Date.now()),
      type: itemType.includes('Vehicle') ? 'Vehicle' : 'Item',
      title: `${make || 'Custom'} ${model || 'Item'}`,
      vin: vin,
      rego: regoPlate || 'PENDING',
      location: `${zone} / ${row} / ${bay} / ${stagingArea}`,
      condition: condition,
      damage: damageNoted ? 'Damage Noted' : 'No Damage',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=400&q=80'
    };
    setItemsToReceive([...itemsToReceive, newItem]);
    alert(`Item ${newItem.title} (${newItem.vin}) added to receive list!`);
  };

  const handleAddAnotherItem = () => {
    if (!vin && !regoPlate) {
      showToast('Please provide at least a VIN or Rego to add item', 'error');
      return;
    }
    
    const newItem = {
      id: String(Date.now()),
      type: 'Vehicle',
      title: `${make || 'Unknown'} ${model || ''}`.trim(),
      vin: vin || '-',
      rego: regoPlate || '-',
      location: `${zone} / ${row} / ${bay} / ${stagingArea}`,
      condition: 'Good',
      damage: 'No Damage',
      image: null
    };

    setItemsToReceive(prev => [...prev, newItem]);

    setVin('');
    setRegoPlate('');
    setMake('');
    setModel('');

    const itemEntryElem = document.getElementById('section-item-entry');
    if (itemEntryElem) {
      itemEntryElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleRemoveItem = (id) => {
    setItemsToReceive(itemsToReceive.filter(item => item.id !== id));
  };

  const handleOpenEditItem = (item) => {
    setEditingItem({ ...item });
    setEditItemModalOpen(true);
  };

  const handleSaveEditedItem = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setItemsToReceive(itemsToReceive.map(it => it.id === editingItem.id ? editingItem : it));
    setEditItemModalOpen(false);
    setEditingItem(null);
  };

  const handleDocFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newDocs = files.map((f, i) => ({
      id: String(Date.now() + i),
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      time: 'Just now'
    }));
    setUploadedDocs([...uploadedDocs, ...newDocs]);
  };

  const handlePhotoFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newPhotos = files.map((f, i) => ({
      id: String(Date.now() + i),
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      url: URL.createObjectURL(f)
    }));
    setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
  };

  const handleSimulateCameraCapture = () => {
    const captured = {
      id: String(Date.now()),
      name: `Inspection_Photo_${uploadedPhotos.length + 1}.jpg`,
      size: '1.8 MB',
      url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80'
    };
    setUploadedPhotos([...uploadedPhotos, captured]);
    setCameraModalOpen(false);
    alert('Photo captured & attached successfully!');
  };


  const handleReceiveComplete = async () => {
    try {
      const isStagingArea = dbStagingAreas.some(sa => sa.id === stagingArea);
      const isLoadLane = dbLoadLanes.some(ll => ll.id === stagingArea);

      const payload = {
        inboundNo,
        supplier,
        referenceNote: refNote,
        transportType,
        driverName: driver,
        vehicleRef: vehicleTrailer,
        receivingDepot,
        zone,
        row,
        bay,
        stagingAreaId: isStagingArea ? stagingArea : null,
        loadLaneId: isLoadLane ? stagingArea : null,
        notes: notes,
        items: itemsToReceive.map(item => ({
          vin: item.vin,
          make: item.title?.split(' ')?.[0] || 'Unknown',
          model: item.title?.split(' ')?.slice(1)?.join(' ') || 'Item',
          condition: item.condition,
          type: item.type,
          location: item.location
        }))
      };

      const res = await api.post('/warehouse-portal/inbound/receive', payload);
      
      if (res.data && res.data.success) {
        alert(`✓ Inbound Receipt ${inboundNo || ''} confirmed & received successfully! Total ${itemsToReceive.length} items logged.`);
        // Reset form to allow more items to be received on the same page
        setInboundNo(`RCV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
        setItemsToReceive([]);
        setNotes('');
        setVinInput('');
        setTitleInput('');
        setTypeInput('Vehicle');
        fetchRecentIntakes();
      } else {
        alert('Failed to process inbound receipt. Check console.');
      }
    } catch (err) {
      console.error('Error submitting inbound receipt:', err);
      alert('Error submitting inbound receipt: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="wh-receive-container">
      
      {/* EMBEDDED DIRECT STYLING */}
      <style>{`
        .wh-receive-container {
          min-height: 100vh;
          background-color: #F8FAFC;
          color: #0F172A;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          padding: 16px 20px;
          box-sizing: border-box;
        }

        /* Header Bar Inside Left Col */
        .wh-rcv-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .wh-rcv-title {
          font-size: 18px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -0.3px;
        }

        .wh-rcv-sub {
          font-size: 11px;
          color: #64748B;
          margin-top: 1px;
        }

        .wh-rcv-top-btns {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wh-btn-cancel-rcv {
          height: 34px;
          padding: 0 14px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
        }

        .wh-btn-draft-rcv {
          height: 34px;
          padding: 0 14px;
          border-radius: 6px;
          border: 1px solid #0F172A;
          background: #FFFFFF;
          font-size: 11.5px;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
        }

        .wh-btn-submit-rcv {
          height: 34px;
          padding: 0 18px;
          border-radius: 6px;
          border: none;
          background: var(--primary-color);
          font-size: 11.5px;
          font-weight: 800;
          color: #0F172A;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(255, 212, 0, 0.3);
        }

        /* Master Flex Layout */
        .wh-rcv-master-grid {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        /* Left Main Column */
        .wh-rcv-left-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* TOP 3 CARDS ROW */
        .wh-rcv-top-cards-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          width: 100%;
        }

        .wh-card-1 {
          flex: 1.35;
          min-width: 0;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 12px 14px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          height: fit-content;
        }

        .wh-card-2 {
          flex: 1;
          min-width: 0;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 12px 14px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          height: fit-content;
        }

        .wh-card-3 {
          flex: 1.3;
          min-width: 0;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 12px 14px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          height: fit-content;
        }

        .card-num-title {
          font-size: 10.5px;
          font-weight: 900;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid #F1F5F9;
        }

        /* Form Controls */
        .rcv-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .rcv-form-group {
          display: flex;
          flex-direction: column;
          gap: 1px;
          margin-bottom: 4px;
        }

        .rcv-form-group label {
          font-size: 9px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rcv-form-group input,
        .rcv-form-group select,
        .rcv-form-group textarea {
          height: 30px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          padding: 0 6px;
          font-size: 11px;
          font-weight: 600;
          color: #0F172A;
          outline: none;
          background: #FFFFFF;
          box-sizing: border-box;
          text-overflow: ellipsis;
        }

        .rcv-form-group textarea {
          height: 36px;
          padding: 4px 6px;
          resize: none;
        }

        /* Location Preview Box */
        .loc-preview-box {
          background: #FEFCE8;
          border: 1px solid #FEF08A;
          border-radius: 6px;
          padding: 6px 8px;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 700;
          color: #854D0E;
          line-height: 1.3;
        }

        /* Item Entry Modes */
        .item-entry-tabs {
          display: flex;
          background: #F1F5F9;
          padding: 2px;
          border-radius: 6px;
          gap: 2px;
          margin-bottom: 6px;
        }

        .item-entry-tabs button {
          flex: 1;
          height: 24px;
          border-radius: 4px;
          border: none;
          font-size: 8.5px;
          font-weight: 800;
          color: #64748B;
          cursor: pointer;
          background: transparent;
          white-space: nowrap;
          padding: 0 2px;
        }

        .item-entry-tabs button.active {
          background: var(--primary-color);
          color: #0F172A;
          font-weight: 800;
        }

        .yellow-sub-heading {
          font-size: 9.5px;
          font-weight: 800;
          color: #D97706;
          margin: 2px 0 4px 0;
        }

        .or-divider {
          text-align: center;
          font-size: 9px;
          font-weight: 800;
          color: #94A3B8;
          margin: 2px 0;
        }

        .btn-add-item-list {
          height: 30px;
          width: 100%;
          border-radius: 6px;
          border: none;
          background: var(--primary-color);
          font-size: 11px;
          font-weight: 800;
          color: #0F172A;
          cursor: pointer;
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        /* Table Section */
        .wh-rcv-table-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 14px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          overflow: hidden;
        }

        .table-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .table-actions-top {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 10.5px;
          font-weight: 700;
        }

        .action-link {
          color: #3B82F6;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .wh-rcv-table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .rcv-data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 11px;
          min-width: 600px;
        }

        .rcv-data-table th {
          padding: 8px 12px;
          font-size: 9px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          white-space: nowrap;
        }

        .rcv-data-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
          white-space: nowrap;
        }

        .tbl-item-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tbl-thumb {
          width: 36px;
          height: 28px;
          border-radius: 4px;
          object-fit: cover;
          border: 1px solid #E2E8F0;
        }

        .tbl-vin-badge {
          font-size: 9px;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 4px;
          background: #DBEAFE;
          color: #1D4ED8;
          margin-left: 4px;
        }

        .tbl-select {
          height: 26px;
          padding: 0 6px;
          border-radius: 4px;
          border: 1px solid #CBD5E1;
          font-size: 10.5px;
          font-weight: 600;
          outline: none;
        }

        .action-btns-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .tbl-action-icon-btn {
          background: transparent;
          border: none;
          color: #64748B;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .tbl-action-icon-btn.edit:hover { background: #FEF3C7; color: #D97706; }
        .tbl-action-icon-btn.delete:hover { background: #FEE2E2; color: #EF4444; }

        .table-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #F1F5F9;
        }

        .btn-add-another {
          height: 28px;
          padding: 0 12px;
          border-radius: 5px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          font-size: 10.5px;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
        }

        /* Documents & Photos Section */
        .wh-rcv-docs-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 14px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        .dropzones-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .dropzone-box {
          border: 2px dashed #CBD5E1;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          background: #F8FAFC;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: all 0.15s ease;
        }

        .dropzone-box:hover {
          border-color: var(--primary-color);
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .dropzone-icon { color: #64748B; }
        .drop-title { font-size: 11px; font-weight: 700; color: #0F172A; }
        .drop-sub { font-size: 9px; color: #94A3B8; }

        .uploaded-files-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 10px;
        }

        .uploaded-file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          border-radius: 6px;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          font-size: 10.5px;
        }

        .file-item-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .file-item-name { font-weight: 700; color: #0F172A; }
        .file-item-size { font-size: 9px; color: #64748B; }

        .file-item-remove-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 2px;
        }

        .file-item-remove-btn:hover { color: #EF4444; }

        /* Right Side Summary Column - Aligned to Top line */
        .wh-rcv-right-col {
          width: 265px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .summary-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          font-size: 11px;
          padding: 8px 0;
          border-bottom: 1px solid #F1F5F9;
          gap: 12px;
        }

        .summary-label { 
          color: #64748B; 
          font-weight: 700; 
          font-size: 11px;
          flex-shrink: 0;
        }
        .summary-val { 
          font-weight: 800; 
          color: #0F172A; 
          font-size: 11px;
          text-align: right;
          word-break: break-word;
          max-width: 65%;
          line-height: 1.35;
        }

        .summary-badge-receiving {
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 9.5px;
          font-weight: 800;
          background: #FEF3C7;
          color: #B45309;
          letter-spacing: 0.02em;
        }

        .side-item-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 6px;
          border-radius: 6px;
          background: #F8FAFC;
          margin-bottom: 5px;
          border: 1px solid #F1F5F9;
        }

        .side-item-thumb {
          width: 34px;
          height: 26px;
          border-radius: 4px;
          object-fit: cover;
        }

        .side-item-info { flex: 1; display: flex; flex-direction: column; }
        .side-item-title { font-size: 10.5px; font-weight: 800; color: #0F172A; }
        .side-item-vin { font-size: 8.5px; color: #64748B; font-family: monospace; }

        .side-remove-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        .chk-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          font-weight: 700;
          color: #0F172A;
          padding: 4px 0;
        }

        .chk-icon-green { color: #10B981; }
        .chk-icon-gray { color: #CBD5E1; }

        .dev-notes-list {
          font-size: 10px;
          color: #64748B;
          display: flex;
          flex-direction: column;
          gap: 4px;
          line-height: 1.3;
        }

        /* Modal Popup Styles */
        .wh-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .wh-modal-box {
          background: #FFFFFF;
          border-radius: 12px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .wh-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          border-bottom: 1px solid #E2E8F0;
        }

        .wh-modal-header h3 { font-size: 14px; font-weight: 800; color: #0F172A; margin: 0; }
        .wh-modal-header button { background: transparent; border: none; color: #94A3B8; cursor: pointer; }

        .wh-modal-body { padding: 18px; display: flex; flex-direction: column; gap: 12px; }

        .wh-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 18px;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
        }

        /* MOBILE RESPONSIVE MEDIA QUERIES */
        @media (max-width: 1024px) {
          .wh-rcv-master-grid { flex-direction: column; width: 100%; }
          .wh-rcv-top-cards-row { flex-direction: column; width: 100%; }
          .wh-card-1, .wh-card-2, .wh-card-3 { width: 100%; flex: auto; box-sizing: border-box; }
          .wh-rcv-right-col { width: 100%; box-sizing: border-box; }
        }

        @media (max-width: 640px) {
          .wh-receive-container { padding: 10px; overflow-x: hidden; width: 100%; box-sizing: border-box; }
          .wh-rcv-left-col { width: 100%; max-width: 100%; box-sizing: border-box; }
          .rcv-form-grid-2 { grid-template-columns: 1fr !important; }
          .dropzones-grid { grid-template-columns: 1fr !important; width: 100%; }
          .dropzone-box { width: 100%; box-sizing: border-box; padding: 12px 8px; }
          .wh-rcv-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            width: 100%;
          }
          .wh-rcv-top-btns {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .wh-rcv-top-btns button {
            width: 100%;
            height: 38px;
            justify-content: center;
            padding: 0 12px;
            font-size: 12px;
          }
          .wh-rcv-table-card, .wh-rcv-docs-card {
            padding: 10px;
            width: 100%;
            box-sizing: border-box;
          }
          .table-card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            width: 100%;
          }
          .btn-add-another {
            width: 100%;
          }
        }
      `}</style>

      {/* Hidden inputs for real file uploads */}
      <input 
        type="file" 
        ref={docInputRef} 
        style={{ display: 'none' }} 
        multiple 
        accept=".pdf,.jpg,.png,.doc,.docx"
        onChange={handleDocFileUpload} 
      />
      <input 
        type="file" 
        ref={photoInputRef} 
        style={{ display: 'none' }} 
        multiple 
        accept="image/*"
        onChange={handlePhotoFileUpload} 
      />

      {/* ── MASTER FLEX LAYOUT (LEFT MAIN + EXACT TOP ALIGNED RIGHT COLUMN) ── */}
      <div className="wh-rcv-master-grid">
        
        {/* LEFT MAIN COLUMN */}
        <div className="wh-rcv-left-col">
          
          {/* HEADER ROW INSIDE LEFT COL */}
          <div className="wh-rcv-header-row">
            <div>
              <h1 className="wh-rcv-title">RECEIVE (INBOUND)</h1>
              <p className="wh-rcv-sub">Record and confirm incoming stock/items into the depot.</p>
            </div>

            <div className="wh-rcv-top-btns">
              <button className="wh-btn-cancel-rcv" onClick={() => navigate(-1)}>Cancel</button>
              <button className="wh-btn-draft-rcv" onClick={() => alert('Saved as Draft!')}>Save as Draft</button>
              <button className="wh-btn-submit-rcv" onClick={handleReceiveComplete}>Receive Items</button>
            </div>
          </div>

          {/* TOP 3 CARDS ROW */}
          <div className="wh-rcv-top-cards-row">
            
            {/* CARD 1: INBOUND DETAILS */}
            <div className="wh-card-1">
              <div className="card-num-title">1. INBOUND DETAILS</div>
              
              <div className="rcv-form-grid-2">
                <div className="rcv-form-group">
                  <label title="INBOUND TYPE *">INBOUND TYPE *</label>
                  <select value={inboundType} onChange={e => setInboundType(e.target.value)}>
                    <option value="Purchase / Supplier Delivery">Purchase / Supplier Delivery</option>
                    <option value="Customer Return">Customer Return</option>
                    <option value="Inter-Depot Transfer">Inter-Depot Transfer</option>
                  </select>
                </div>

                <div className="rcv-form-group">
                  <label title="INBOUND NO.">INBOUND NO.</label>
                  <input type="text" value={inboundNo} onChange={e => setInboundNo(e.target.value)} />
                </div>
              </div>

              <div className="rcv-form-grid-2">
                <div className="rcv-form-group">
                  <label title="SUPPLIER / FROM *">SUPPLIER / FROM *</label>
                  <select value={supplier} onChange={e => setSupplier(e.target.value)}>
                    {dbSuppliers.length === 0 && <option value="">No Suppliers Found</option>}
                    {dbSuppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.abn || 'N/A'})</option>
                    ))}
                  </select>
                </div>

                <div className="rcv-form-group">
                  <label title="REFERENCE / DELIVERY NOTE">REFERENCE / DELIVERY NOTE</label>
                  <input type="text" value={refNote} onChange={e => setRefNote(e.target.value)} />
                </div>
              </div>

              <div className="rcv-form-grid-2">
                <div className="rcv-form-group">
                  <label title="TRANSPORT TYPE">TRANSPORT TYPE</label>
                  <select value={transportType} onChange={e => setTransportType(e.target.value)}>
                    <option value="Truck">Truck</option>
                    <option value="Train">Train</option>
                    <option value="Ship">Ship</option>
                  </select>
                </div>
                <div className="rcv-form-group">
                  <label title="DRIVER">DRIVER</label>
                  <select value={driver} onChange={e => setDriver(e.target.value)}>
                    {dbDrivers.length === 0 && <option value="">No Drivers Available</option>}
                    {dbDrivers.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rcv-form-grid-2">
                <div className="rcv-form-group">
                  <label title="VEHICLE / TRAILER">VEHICLE / TRAILER</label>
                  {/* VEHICLE / TRAILER */}
                  <select value={vehicleTrailer} onChange={e => setVehicleTrailer(e.target.value)} style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #CBD5E1' }}>
                    {dbVehicles.length === 0 && <option value="">No Vehicles Available</option>}
                    {dbVehicles.map(v => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div className="rcv-form-group">
                  <label title="DATE / TIME *">DATE / TIME *</label>
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={e => setDateTime(e.target.value)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#0f172a'
                    }}
                  />
                </div>
              </div>

              <div className="rcv-form-group">
                <label title="NOTES">NOTES</label>
                <textarea placeholder="Enter notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>

            {/* CARD 2: LOCATION */}
            <div className="wh-card-2">
              <div className="card-num-title">2. LOCATION</div>

              <div className="rcv-form-group">
                <label title="RECEIVING DEPOT *">RECEIVING DEPOT *</label>
                <select value={receivingDepot} onChange={e => setReceivingDepot(e.target.value)}>
                  {dbWarehouses.length === 0 && <option value="">No Depots Found</option>}
                  {dbWarehouses.map(w => (
                    <option key={w.id} value={w.name}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div className="rcv-form-group">
                <label title="WAREHOUSE / YARD *">WAREHOUSE / YARD *</label>
                <select value={warehouseYard} onChange={e => setWarehouseYard(e.target.value)}>
                  <option value="Main Yard">Main Yard</option>
                  <option value="Yard B">Yard B</option>
                  <option value="Warehouse 1">Warehouse 1</option>
                </select>
              </div>

              <div className="rcv-form-group">
                <label title="ZONE *">ZONE *</label>
                <select value={zone} onChange={e => setZone(e.target.value)}>
                  <option value="Zone A">Zone A</option>
                  <option value="Zone B">Zone B</option>
                  <option value="DG Zone">DG Zone</option>
                </select>
              </div>

              <div className="rcv-form-grid-2">
                <div className="rcv-form-group">
                  <label title="ROW">ROW</label>
                  <select value={row} onChange={e => setRow(e.target.value)}>
                    <option value="Row 4">Row 4</option>
                    <option value="Row 1">Row 1</option>
                    <option value="Row 2">Row 2</option>
                  </select>
                </div>
                <div className="rcv-form-group">
                  <label title="BAY">BAY</label>
                  <select value={bay} onChange={e => setBay(e.target.value)}>
                    <option value="Bay 12">Bay 12</option>
                    <option value="Bay 03">Bay 03</option>
                    <option value="Bay 05">Bay 05</option>
                  </select>
                </div>
              </div>

              <div className="rcv-form-group">
                <label title="STAGING AREA / LANE (OPTIONAL)">STAGING AREA / LANE (OPTIONAL)</label>
                <select value={stagingArea} onChange={e => setStagingArea(e.target.value)}>
                  <option value="">-- Select Staging Area / Lane --</option>
                  {dbStagingAreas.length > 0 && (
                    <optgroup label="Staging Areas">
                      {dbStagingAreas.map(sa => (
                        <option key={sa.id} value={sa.id}>{sa.name}</option>
                      ))}
                    </optgroup>
                  )}
                  {dbLoadLanes.length > 0 && (
                    <optgroup label="Load Lanes">
                      {dbLoadLanes.map(ll => (
                        <option key={ll.id} value={ll.id}>{ll.laneName}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div className="loc-preview-box">
                <MapPin size={14} style={{ shrink: 0 }} />
                <span>Location Preview: {receivingDepot} &gt; {warehouseYard} &gt; {zone} &gt; {row} &gt; {bay}</span>
              </div>
            </div>

            {/* CARD 3: ITEM ENTRY */}
            <div className="wh-card-3" id="section-item-entry">
              <div className="card-num-title">3. ITEM ENTRY</div>

              <div className="item-entry-tabs">
                <button className={entryTab === 'manual' ? 'active' : ''} onClick={() => setEntryTab('manual')}>Add Manually</button>
                <button className={entryTab === 'scan' ? 'active' : ''} onClick={() => setEntryTab('scan')}>Scan Barcode / QR</button>

              </div>

              <div className="rcv-form-group">
                <label title="ITEM TYPE *">ITEM TYPE *</label>
                <select value={itemType} onChange={e => setItemType(e.target.value)}>
                  <option value="Vehicle (Car Carrying)">Vehicle (Car Carrying)</option>
                  <option value="Pallet (General Freight)">Pallet (General Freight)</option>
                  <option value="Carton">Carton</option>
                  <option value="DG Item">DG Item</option>
                </select>
              </div>

              <div className="rcv-form-group">
                <label title="SEARCH ITEM">SEARCH ITEM</label>
                <input 
                  type="text" 
                  placeholder="Scan or enter VIN / Rego" 
                  value={searchVinRego}
                  onChange={e => setSearchVinRego(e.target.value)}
                />
              </div>

              <div className="or-divider">── OR ──</div>

              <div className="yellow-sub-heading">Enter Details Manually</div>

              <form onSubmit={handleAddItem}>
                <div className="rcv-form-grid-2">
                  <div className="rcv-form-group">
                    <label title="VIN *">VIN *</label>
                    <input type="text" value={vin} onChange={e => setVin(e.target.value)} />
                  </div>
                  <div className="rcv-form-group">
                    <label title="REGO / PLATE *">REGO / PLATE *</label>
                    <input type="text" value={regoPlate} onChange={e => setRegoPlate(e.target.value)} />
                  </div>
                </div>

                <div className="rcv-form-grid-2">
                  <div className="rcv-form-group">
                    <label title="MAKE *">MAKE *</label>
                    <input type="text" value={make} onChange={e => setMake(e.target.value)} />
                  </div>
                  <div className="rcv-form-group">
                    <label title="MODEL *">MODEL *</label>
                    <input type="text" value={model} onChange={e => setModel(e.target.value)} />
                  </div>
                </div>

                <div className="rcv-form-grid-2">
                  <div className="rcv-form-group">
                    <label title="YEAR">YEAR</label>
                    <select value={year} onChange={e => setYear(e.target.value)}>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2022">2022</option>
                    </select>
                  </div>
                  <div className="rcv-form-group">
                    <label title="COLOUR">COLOUR</label>
                    <input type="text" value={colour} onChange={e => setColour(e.target.value)} />
                  </div>
                </div>

                <div className="rcv-form-grid-2">
                  <div className="rcv-form-group">
                    <label title="CONDITION">CONDITION</label>
                    <select value={condition} onChange={e => setCondition(e.target.value)}>
                      <option value="Good">Good</option>
                      <option value="Minor Scratch">Minor Scratch</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                  </div>
                  <div className="rcv-form-group">
                    <label title="FUEL TYPE">FUEL TYPE</label>
                    <select value={fuelType} onChange={e => setFuelType(e.target.value)}>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-1 mb-1 text-[9.5px] font-bold text-slate-700">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={requirePhotos} onChange={e => setRequirePhotos(e.target.checked)} />
                    <span>Require Photos</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={damageNoted} onChange={e => setDamageNoted(e.target.checked)} />
                    <span>Damage Noted</span>
                  </label>
                </div>

                <button type="submit" className="btn-add-item-list">
                  <Plus size={14} />
                  <span>+ Add Item to List</span>
                </button>
              </form>

            </div>

          </div>

          {/* CARD 4: ITEMS TO RECEIVE TABLE */}
          <div className="wh-rcv-table-card">
            <div className="table-card-header">
              <div className="card-num-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                4. ITEMS TO RECEIVE
              </div>
              <div className="table-actions-top">
                <span className="action-link" style={{ color: '#EF4444' }} onClick={() => setItemsToReceive([])}>
                  Clear All
                </span>
              </div>
            </div>

            <div className="wh-rcv-table-responsive">
              <table className="rcv-data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item Type</th>
                    <th>Description / VIN / Rego</th>
                    <th>Location</th>
                    <th>Condition</th>
                    <th>Damage</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsToReceive.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#94A3B8' }}>
                        No items added to receive queue yet. Use Item Entry form above or click Import Items.
                      </td>
                    </tr>
                  ) : (
                    itemsToReceive.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="tbl-item-cell">
                            <img src={item.image} alt={item.title} className="tbl-thumb" />
                            <span className="font-bold">{item.type}</span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong className="text-slate-900">{item.title}</strong>
                            <span className="tbl-vin-badge">{item.rego}</span>
                            <div className="text-[9.5px] text-slate-500 font-mono mt-0.5">VIN: {item.vin}</div>
                          </div>
                        </td>
                        <td className="font-semibold text-slate-700">{item.location}</td>
                        <td>
                          <select className="tbl-select" value={item.condition} onChange={e => {
                            const updated = [...itemsToReceive];
                            updated[index].condition = e.target.value;
                            setItemsToReceive(updated);
                          }}>
                            <option value="Good">Good</option>
                            <option value="Scratched">Scratched</option>
                            <option value="Damaged">Damaged</option>
                          </select>
                        </td>
                        <td>
                          <select className="tbl-select" value={item.damage} onChange={e => {
                            const updated = [...itemsToReceive];
                            updated[index].damage = e.target.value;
                            setItemsToReceive(updated);
                          }}>
                            <option value="No Damage">No Damage</option>
                            <option value="Minor Damage">Minor Damage</option>
                            <option value="Major Damage">Major Damage</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="action-btns-group">
                            <button 
                              className="tbl-action-icon-btn edit" 
                              onClick={() => handleOpenEditItem(item)}
                              title="Edit Item"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              className="tbl-action-icon-btn delete" 
                              onClick={() => handleRemoveItem(item.id)}
                              title="Delete Item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-card-footer">
              <button className="btn-add-another" onClick={handleAddAnotherItem}>
                + Add Another Item
              </button>
              <div className="text-xs font-bold text-slate-700">
                Total Items: <strong>{itemsToReceive.length}</strong>
              </div>
            </div>
          </div>

          {/* CARD 5: DOCUMENTS & PHOTOS */}
          <div className="wh-rcv-docs-card">
            <div className="card-num-title">5. DOCUMENTS & PHOTOS</div>

            <div className="dropzones-grid">
              {/* Dropzone 1: Attachments */}
              <div>
                <div 
                  className="dropzone-box" 
                  onClick={() => docInputRef.current && docInputRef.current.click()}
                >
                  <Paperclip size={22} className="dropzone-icon" />
                  <span className="drop-title">Attachments (e.g. Delivery Note, Invoice)</span>
                  <span className="drop-sub">Click to select or drop files PDF, JPG, PNG (Max 10MB)</span>
                </div>

                {uploadedDocs.length > 0 && (
                  <div className="uploaded-files-list">
                    {uploadedDocs.map(doc => (
                      <div key={doc.id} className="uploaded-file-item">
                        <div className="file-item-left">
                          <File size={14} className="text-blue-600" />
                          <div className="flex flex-col">
                            <span className="file-item-name">{doc.name}</span>
                            <span className="file-item-size">{doc.size} • {doc.time}</span>
                          </div>
                        </div>
                        <button 
                          className="file-item-remove-btn" 
                          onClick={() => setUploadedDocs(uploadedDocs.filter(d => d.id !== doc.id))}
                          title="Remove File"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropzone 2: Photos */}
              <div>
                <div className="dropzone-box">
                  <Camera size={22} className="dropzone-icon" />
                  <span className="drop-title">Photos (Items / Condition)</span>
                  <span className="drop-sub">Capture or upload photos. You can add multiple photos.</span>
                  
                  <div className="flex gap-2 mt-2">
                    <button 
                      type="button" 
                      className="wh-btn-cancel-rcv" 
                      style={{ height: '26px', fontSize: '10px', padding: '0 8px' }}
                      onClick={() => photoInputRef.current && photoInputRef.current.click()}
                    >
                      📁 Browse Gallery
                    </button>
                    <button 
                      type="button" 
                      className="wh-btn-draft-rcv" 
                      style={{ height: '26px', fontSize: '10px', padding: '0 8px' }}
                      onClick={() => setCameraModalOpen(true)}
                    >
                      📷 Take Photo
                    </button>
                  </div>
                </div>

                {uploadedPhotos.length > 0 && (
                  <div className="uploaded-files-list">
                    {uploadedPhotos.map(photo => (
                      <div key={photo.id} className="uploaded-file-item">
                        <div className="file-item-left">
                          <img src={photo.url} alt={photo.name} style={{ width: '28px', height: '22px', borderRadius: '4px', objectFit: 'cover' }} />
                          <div className="flex flex-col">
                            <span className="file-item-name">{photo.name}</span>
                            <span className="file-item-size">{photo.size}</span>
                          </div>
                        </div>
                        <button 
                          className="file-item-remove-btn" 
                          onClick={() => setUploadedPhotos(uploadedPhotos.filter(p => p.id !== photo.id))}
                          title="Remove Photo"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE SUMMARY COLUMN (ALIGNED TO VERY TOP) */}
        <div className="wh-rcv-right-col">
          
          {/* INBOUND SUMMARY CARD */}
          <div className="summary-card">
            <div className="card-num-title" style={{ marginBottom: '8px' }}>INBOUND SUMMARY</div>
            
            <div className="summary-row">
              <span className="summary-label">Inbound No.</span>
              <span className="summary-val">{inboundNo || 'Auto-generated'}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Supplier</span>
              <span className="summary-val text-slate-800" title={getSupplierDisplayName()}>
                {getSupplierDisplayName()}
              </span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Date / Time</span>
              <span className="summary-val">{formatDateTimeDisplay(dateTime)}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Items</span>
              <span className="summary-val">{itemsToReceive.length}</span>
            </div>

            <div className="summary-row" style={{ borderBottom: 'none' }}>
              <span className="summary-label">Status</span>
              <span className="summary-badge-receiving">Receiving</span>
            </div>
          </div>

          {/* ITEMS TO RECEIVE LIST */}
          <div className="summary-card">
            <div className="flex justify-between items-center mb-2">
              <div className="card-num-title" style={{ margin: 0, padding: 0, border: 'none' }}>
                ITEMS TO RECEIVE ({itemsToReceive.length})
              </div>
              <span className="action-link" style={{ fontSize: '10px' }}>Edit All</span>
            </div>

            {itemsToReceive.map(item => (
              <div key={item.id} className="side-item-row">
                <img src={item.image} alt={item.title} className="side-item-thumb" />
                <div className="side-item-info">
                  <span className="side-item-title">{item.title}</span>
                  <span className="side-item-vin">VIN: {item.vin}</span>
                  <span className="text-[8.5px] font-bold text-amber-600">{item.rego}</span>
                </div>
                <button className="side-remove-btn" onClick={() => handleRemoveItem(item.id)}>
                  <X size={13} />
                </button>
              </div>
            ))}

            <button className="btn-add-another" style={{ width: '100%', marginTop: '4px' }} onClick={handleAddAnotherItem}>
              + Add Another Item
            </button>
          </div>

          {/* RECEIVE CHECKLIST */}
          <div className="summary-card">
            <div className="card-num-title" style={{ marginBottom: '6px' }}>RECEIVE CHECKLIST</div>

            <div className="chk-item">
              <CheckCircle2 size={14} className="chk-icon-green" />
              <span>Items count verified</span>
            </div>

            <div className="chk-item">
              <CheckCircle2 size={14} className="chk-icon-green" />
              <span>Condition checked</span>
            </div>

            <div className="chk-item">
              {uploadedDocs.length > 0 ? (
                <CheckCircle2 size={14} className="chk-icon-green" />
              ) : (
                <CheckCircle2 size={14} className="chk-icon-gray" />
              )}
              <span style={{ color: uploadedDocs.length > 0 ? '#0F172A' : '#64748B' }}>Documents verified</span>
            </div>

            <div className="chk-item">
              {uploadedPhotos.length > 0 ? (
                <CheckCircle2 size={14} className="chk-icon-green" />
              ) : (
                <CheckCircle2 size={14} className="chk-icon-gray" />
              )}
              <span style={{ color: uploadedPhotos.length > 0 ? '#0F172A' : '#64748B' }}>Photos captured</span>
            </div>
          </div>

          {/* DEVELOPER NOTES */}
          <div className="summary-card" style={{ background: '#F8FAFC' }}>
            <div className="card-num-title" style={{ marginBottom: '6px' }}>DEVELOPER NOTES</div>

            <div className="dev-notes-list">
              <div>• All fields with * are required.</div>
              <div>• Location hierarchy is company configurable.</div>
              <div>• Scan barcode/QR for quick item entry.</div>
              <div>• VIN validation for vehicle items.</div>
              <div>• Support bulk upload via CSV template.</div>
              <div>• Offline support: data saved to local queue.</div>
            </div>
          </div>

        </div>

      </div>



      {/* ── CAMERA / PHOTO CAPTURE MODAL ── */}
      {cameraModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setCameraModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-amber-500" />
                <h3>Live Camera Photo Capture</h3>
              </div>
              <button onClick={() => setCameraModalOpen(false)}><X size={16} /></button>
            </div>

            <div className="wh-modal-body" style={{ alignItems: 'center', textAlign: 'center' }}>
              <div style={{
                width: '200px', height: '140px', background: '#0F172A', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyCenter: 'center', flexDirection: 'column', color: '#FFF',
                padding: '20px'
              }}>
                <Camera size={36} className="text-amber-400 mb-2" />
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Camera Viewfinder Ready</span>
              </div>
              <p className="text-xs font-bold text-slate-700">Point camera at asset/vehicle condition or damage spot.</p>
            </div>

            <div className="wh-modal-footer">
              <button className="wh-btn-cancel-rcv" onClick={() => setCameraModalOpen(false)}>Cancel</button>
              <button className="wh-btn-submit-rcv" onClick={handleSimulateCameraCapture}>Snap & Attach Photo</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT ITEM MODAL ── */}
      {editItemModalOpen && editingItem && (
        <div className="wh-modal-overlay" onClick={() => setEditItemModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h3>Edit Inbound Item: {editingItem.title}</h3>
              <button onClick={() => setEditItemModalOpen(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveEditedItem} className="wh-modal-body">
              <div className="rcv-form-group">
                <label>Item Description / Model</label>
                <input 
                  type="text" 
                  value={editingItem.title} 
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} 
                />
              </div>

              <div className="rcv-form-grid-2">
                <div className="rcv-form-group">
                  <label>VIN Number</label>
                  <input 
                    type="text" 
                    value={editingItem.vin} 
                    onChange={e => setEditingItem({ ...editingItem, vin: e.target.value })} 
                  />
                </div>
                <div className="rcv-form-group">
                  <label>Rego / Plate</label>
                  <input 
                    type="text" 
                    value={editingItem.rego} 
                    onChange={e => setEditingItem({ ...editingItem, rego: e.target.value })} 
                  />
                </div>
              </div>

              <div className="rcv-form-grid-2">
                <div className="rcv-form-group">
                  <label>Condition</label>
                  <select 
                    value={editingItem.condition} 
                    onChange={e => setEditingItem({ ...editingItem, condition: e.target.value })}
                  >
                    <option value="Good">Good</option>
                    <option value="Scratched">Scratched</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>

                <div className="rcv-form-group">
                  <label>Damage Status</label>
                  <select 
                    value={editingItem.damage} 
                    onChange={e => setEditingItem({ ...editingItem, damage: e.target.value })}
                  >
                    <option value="No Damage">No Damage</option>
                    <option value="Minor Damage">Minor Damage</option>
                    <option value="Major Damage">Major Damage</option>
                  </select>
                </div>
              </div>

              <div className="rcv-form-group">
                <label>Target Location</label>
                <input 
                  type="text" 
                  value={editingItem.location} 
                  onChange={e => setEditingItem({ ...editingItem, location: e.target.value })} 
                />
              </div>

              <div className="wh-modal-footer" style={{ padding: '12px 0 0 0', background: 'transparent', borderTop: 'none' }}>
                <button type="button" className="wh-btn-cancel-rcv" onClick={() => setEditItemModalOpen(false)}>Cancel</button>
                <button type="submit" className="wh-btn-submit-rcv">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
