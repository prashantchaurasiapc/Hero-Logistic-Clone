import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, ChevronDown, ChevronLeft, ChevronRight, Plus, ArrowRight,
  Edit2, Trash2, Upload, QrCode, Maximize2,
  Navigation, Building, Layers, Box, Archive,
  CheckCircle2, X, FileSpreadsheet, Download, AlertTriangle, Search,
  Printer, Eye, Filter, ArrowUpRight, Clock, RefreshCw, FileText, CheckCircle, Truck
} from 'lucide-react';

/* ============================================================
   MOCK DATA FOR MOVE / TRANSFER FORM
   ============================================================ */
const IMPORT_MANIFEST = [
  {
    id: 'imp-1',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    title: 'Nissan X-Trail',
    vin: 'JN1TCNT31U0098765',
    rego: 'MNO345',
    type: 'Vehicle',
    subtype: 'Car Carrying',
    fromZone: 'Zone A',
    fromRow: 'Row 3 / Bay 08',
    fromPos: 'Position 02',
    toZone: 'Zone B',
    toRow: 'Row 2 / Bay 05',
    toPos: 'Position 06',
    condition: 'Good',
  },
  {
    id: 'imp-2',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=120&q=80',
    title: 'Hyundai Tucson',
    vin: 'KM8J33A45JU112233',
    rego: 'PQR678',
    type: 'Vehicle',
    subtype: 'Car Carrying',
    fromZone: 'Zone A',
    fromRow: 'Row 1 / Bay 03',
    fromPos: 'Position 01',
    toZone: 'Zone B',
    toRow: 'Row 2 / Bay 05',
    toPos: 'Position 07',
    condition: 'Good',
  },
  {
    id: 'imp-3',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0729?auto=format&fit=crop&w=120&q=80',
    title: 'Ford Ranger',
    vin: '1FTER4FH4MLD12345',
    rego: 'STU901',
    type: 'Vehicle',
    subtype: 'Car Carrying',
    fromZone: 'Zone A',
    fromRow: 'Row 2 / Bay 06',
    fromPos: 'Position 03',
    toZone: 'Zone B',
    toRow: 'Row 3 / Bay 07',
    toPos: 'Position 02',
    condition: 'Good',
  },
  {
    id: 'imp-4',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=120&q=80',
    title: 'Toyota RAV4',
    vin: 'JTMBFREV40J123456',
    rego: 'VWX234',
    type: 'Vehicle',
    subtype: 'Car Carrying',
    fromZone: 'Zone C',
    fromRow: 'Row 1 / Bay 01',
    fromPos: 'Position 05',
    toZone: 'Zone B',
    toRow: 'Row 2 / Bay 05',
    toPos: 'Position 08',
    condition: 'Good',
  },
];

const initialFormItems = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=120&q=80',
    title: 'Toyota Camry',
    vin: 'JTDBE32K203456789',
    rego: 'ABC123',
    type: 'Vehicle',
    subtype: 'Car Carrying',
    fromZone: 'Zone A',
    fromRow: 'Row 4 / Bay 12',
    fromPos: 'Position 01',
    toZone: 'Zone B',
    toRow: 'Row 2 / Bay 05',
    toPos: 'Position 03',
    condition: 'Good',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80',
    title: 'Mazda 3',
    vin: 'JM0BL10F200123456',
    rego: 'DEF456',
    type: 'Vehicle',
    subtype: 'Car Carrying',
    fromZone: 'Zone A',
    fromRow: 'Row 4 / Bay 12',
    fromPos: 'Position 02',
    toZone: 'Zone B',
    toRow: 'Row 2 / Bay 05',
    toPos: 'Position 04',
    condition: 'Good',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=120&q=80',
    title: 'Honda Accord',
    vin: '1HGCM82633A123456',
    rego: 'GHI789',
    type: 'Vehicle',
    subtype: 'Car Carrying',
    fromZone: 'Zone A',
    fromRow: 'Row 4 / Bay 12',
    fromPos: 'Position 03',
    toZone: 'Zone B',
    toRow: 'Row 2 / Bay 05',
    toPos: 'Position 05',
    condition: 'Good',
  },
];

const recentMovements = [
  { date: '21/07/2026 08:15 AM', label: 'Received', detail: 'ABC Motors' },
  { date: '21/07/2026 09:42 AM', label: 'Moved', detail: 'Zone A / Row 4 / Bay 12' },
  { date: '21/07/2026 10:05 AM', label: 'Staged', detail: 'Load Lane 4' },
];

/* ============================================================
   MOCK DATA FOR MOVEMENT HISTORY AUDIT LOG
   ============================================================ */
const initialHistoryLogs = [
  {
    id: 'MH-1001',
    dateTime: '21/07/2026 10:45 AM',
    movementType: 'Move',
    itemTitle: 'Toyota Camry',
    vin: 'JTDBE32K203456789',
    badge: 'ABC123',
    fromLoc: 'Zone A / Row 4 / Bay 12 / Position 01',
    toLoc: 'Lane 1 / Main Yard',
    loadRef: 'LD-3985',
    byName: 'John Smith',
    byRole: 'Driver',
    result: 'Completed'
  },
  {
    id: 'MH-1002',
    dateTime: '21/07/2026 10:20 AM',
    movementType: 'Stage',
    itemTitle: 'Pallet – Electrical Parts',
    vin: 'SKU: EL-1001 | Barcode: 9345678901234',
    badge: '',
    fromLoc: 'Warehouse 1 / Aisle 12 / Bay 5',
    toLoc: 'Lane 5 / DG Staging',
    loadRef: 'LD-3990',
    byName: 'Michael Lee',
    byRole: 'Staff',
    result: 'Completed'
  },
  {
    id: 'MH-1003',
    dateTime: '21/07/2026 09:42 AM',
    movementType: 'Transfer',
    itemTitle: '20ft Container',
    vin: 'CONT-MSCU1234567',
    badge: '',
    fromLoc: 'Container Yard / Stack 2 / Slot 4',
    toLoc: 'Lane 6 / Container Bay',
    loadRef: 'LD-3991',
    byName: 'Tom Wilson',
    byRole: 'Forklift',
    result: 'Completed'
  },
  {
    id: 'MH-1004',
    dateTime: '21/07/2026 09:15 AM',
    movementType: 'Receive',
    itemTitle: 'UN1203 – Petrol Drum',
    vin: 'Barcode: 9345678909999',
    badge: '',
    fromLoc: '-',
    toLoc: 'Zone A / Row 4 / Bay 12 / Position 02',
    loadRef: 'GR-1038',
    byName: 'Ravi Patel',
    byRole: 'Staff',
    result: 'Completed'
  },
  {
    id: 'MH-1005',
    dateTime: '21/07/2026 08:55 AM',
    movementType: 'Move',
    itemTitle: 'Mazda 3',
    vin: 'JM0BL10F200123456',
    badge: 'DEF456',
    fromLoc: 'Lane 2 / Main Yard',
    toLoc: 'Lane 2 / Main Yard',
    loadRef: 'LD-3986',
    byName: 'Mark Davis',
    byRole: 'Driver',
    result: 'Completed'
  },
  {
    id: 'MH-1006',
    dateTime: '21/07/2026 04:30 PM',
    movementType: 'Transfer',
    itemTitle: 'Steel Coils',
    vin: 'SKU: STC-500 | Barcode: 8899001122334',
    badge: '',
    fromLoc: 'Warehouse 2 / Bay 03',
    toLoc: 'Warehouse 1 / Bay 08',
    loadRef: 'LD-3975',
    byName: 'Peter Brown',
    byRole: 'Forklift',
    result: 'Completed'
  },
  {
    id: 'MH-1007',
    dateTime: '20/07/2026 03:05 PM',
    movementType: 'Return',
    itemTitle: 'Damaged Pallet',
    vin: 'REF: RTN-10077',
    badge: '',
    fromLoc: 'Lane 3 / Main Yard',
    toLoc: '-',
    loadRef: 'RTN-10077',
    byName: 'Sarah Johnson',
    byRole: 'Staff',
    result: 'Completed'
  },
  {
    id: 'MH-1008',
    dateTime: '20/07/2026 11:10 AM',
    movementType: 'Stage',
    itemTitle: 'Honda Accord',
    vin: '1HGCM82633A123456',
    badge: 'GHI789',
    fromLoc: 'Zone B / Row 2 / Bay 06',
    toLoc: 'Lane 1 / Main Yard',
    loadRef: 'LD-3972',
    byName: 'James Wright',
    byRole: 'Staff',
    result: 'Failed'
  }
];

export default function WarehouseMovements() {
  const location = useLocation();
  const navigate = useNavigate();
  const isYard = location.pathname.startsWith('/yard');
  const isHistoryView = location.pathname.includes('movement-history') || location.pathname.includes('movements');

  // ── FORM VIEW STATES ──
  const [movementType, setMovementType] = useState('within');
  const [refNo, setRefNo] = useState('MT-1045');
  const [dateTime, setDateTime] = useState('21/07/2026 11:35 AM');
  const [reason, setReason] = useState('Repositioning');
  const [priority, setPriority] = useState('Normal');
  const [notes, setNotes] = useState('');
  const [scanInput, setScanInput] = useState('');
  const [scanError, setScanError] = useState('');
  const [formItems, setFormItems] = useState(initialFormItems);
  const [confirmed, setConfirmed] = useState(false);
  const [requiresEquipment, setRequiresEquipment] = useState(false);
  const [notifyAfter, setNotifyAfter] = useState(false);
  const [equipmentType, setEquipmentType] = useState('');
  const [notifyTo, setNotifyTo] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [selectedFormItem, setSelectedFormItem] = useState(initialFormItems[0]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importSelected, setImportSelected] = useState([]);
  const [importSearch, setImportSearch] = useState('');
  
  // ── HISTORY VIEW STATES ──
  const [historySearch, setHistorySearch] = useState('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState('All');
  const [historyResultFilter, setHistoryResultFilter] = useState('All');
  const [quickTimeFilter, setQuickTimeFilter] = useState('Last 7 Days');
  const [historyLogs, setHistoryLogs] = useState(initialHistoryLogs);
  const [detailsModalLog, setDetailsModalLog] = useState(null);

  // ── TOAST NOTIFICATION ──
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── FORM HANDLERS ──
  const handleRemoveFormItem = (id) => {
    const updated = formItems.filter(i => i.id !== id);
    setFormItems(updated);
    if (selectedFormItem?.id === id) setSelectedFormItem(updated[0] || null);
    showToast('Item removed from move list.');
  };

  const handleUpdateFormField = (idx, field, val) => {
    const updated = [...formItems];
    updated[idx][field] = val;
    setFormItems(updated);
  };

  const handleAddFormItem = () => {
    const val = scanInput.trim();
    if (!val) {
      setScanError('Please enter a VIN, barcode, or item description.');
      setTimeout(() => setScanError(''), 3000);
      return;
    }
    if (formItems.some(i => i.vin.toLowerCase() === val.toLowerCase())) {
      setScanError(`Item with VIN "${val}" is already in the move list.`);
      setTimeout(() => setScanError(''), 3000);
      return;
    }
    const posNum = String(formItems.length + 4).padStart(2, '0');
    const newItem = {
      id: String(Date.now()),
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=120&q=80',
      title: val.length > 8 ? `Vehicle (${val.slice(0, 8)}...)` : `Vehicle (${val})`,
      vin: val.toUpperCase(),
      rego: 'PENDING',
      type: 'Vehicle',
      subtype: 'Car Carrying',
      fromZone: 'Zone A',
      fromRow: 'Row 4 / Bay 12',
      fromPos: `Position ${posNum}`,
      toZone: 'Zone B',
      toRow: 'Row 2 / Bay 05',
      toPos: `Position ${posNum}`,
      condition: 'Good',
    };
    setFormItems(prev => [...prev, newItem]);
    setScanInput('');
    setScanError('');
    setSelectedFormItem(newItem);
    showToast(`✓ Item "${newItem.vin}" added to move list!`);
  };

  const handleConfirmImport = () => {
    const toAdd = IMPORT_MANIFEST
      .filter(m => importSelected.includes(m.id))
      .filter(m => !formItems.some(i => i.vin === m.vin));
    if (toAdd.length === 0) {
      showToast('No new items selected. All may already be in the list.', 'warn');
      return;
    }
    const timestamped = toAdd.map(m => ({ ...m, id: String(Date.now() + Math.random()) }));
    setFormItems(prev => [...prev, ...timestamped]);
    setSelectedFormItem(timestamped[0]);
    setImportModalOpen(false);
    showToast(`✓ ${toAdd.length} item(s) imported into move list!`);
  };

  const handleClearAllForm = () => {
    if (formItems.length === 0) return;
    if (window.confirm(`Are you sure you want to clear all ${formItems.length} item(s) from the move list?`)) {
      setFormItems([]);
      setSelectedFormItem(null);
      showToast('All items cleared from move list.');
    }
  };

  const handleCreateTransfer = () => {
    if (formItems.length === 0) {
      showToast('Add at least one item to the move list before creating a transfer.', 'warn');
      return;
    }
    if (!confirmed) {
      showToast('Please tick the confirmation checkbox before creating transfer.', 'warn');
      return;
    }
    showToast(`✓ Transfer ${refNo} created! ${formItems.length} item(s) queued for movement.`);
    setTimeout(() => navigate(isYard ? '/yard/movements' : '/warehouse/movement-history'), 1800);
  };

  // ── HISTORY FILTER HANDLERS ──
  const filteredHistory = historyLogs.filter(log => {
    const matchesSearch = !historySearch ||
      log.itemTitle.toLowerCase().includes(historySearch.toLowerCase()) ||
      log.vin.toLowerCase().includes(historySearch.toLowerCase()) ||
      log.loadRef.toLowerCase().includes(historySearch.toLowerCase()) ||
      log.byName.toLowerCase().includes(historySearch.toLowerCase()) ||
      log.fromLoc.toLowerCase().includes(historySearch.toLowerCase()) ||
      log.toLoc.toLowerCase().includes(historySearch.toLowerCase());

    const matchesType = historyTypeFilter === 'All' || log.movementType === historyTypeFilter;
    const matchesResult = historyResultFilter === 'All' || log.result === historyResultFilter;

    return matchesSearch && matchesType && matchesResult;
  });

  const handleExportCSV = () => {
    showToast('Exporting movement history log (CSV)...');
  };

  const handlePrintHistory = () => {
    alert('Printing movement history audit trail report...');
  };

  /* ============================================================
     RENDER METHOD CHOICE DEPENDING ON ROUTE
     ============================================================ */

  // IF ROUTE IS MOVEMENT HISTORY: Render Screenshot 2 Movement History Dashboard
  if (isHistoryView) {
    return (
      <div className="wh-mvt-history-container">
        <style>{`
          .wh-mvt-history-container {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: #F8FAFC;
            min-height: 100vh;
            color: #0F172A;
            padding: 20px 24px;
            box-sizing: border-box;
          }

          /* HEADER ROW */
          .wh-mh-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            flex-wrap: wrap;
            gap: 12px;
          }
          .wh-mh-title {
            font-size: 18px;
            font-weight: 900;
            color: #0F172A;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: -0.3px;
          }
          .wh-mh-sub {
            font-size: 12px;
            color: #64748B;
            margin-top: 2px;
          }
          .wh-mh-actions-top {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .wh-btn-export-mh {
            height: 36px;
            padding: 0 14px;
            border-radius: 8px;
            border: 1px solid #CBD5E1;
            background: #FFFFFF;
            font-size: 12px;
            font-weight: 700;
            color: #475569;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: background 0.15s;
          }
          .wh-btn-export-mh:hover { background: #F1F5F9; }

          .wh-btn-print-mh {
            height: 36px;
            padding: 0 16px;
            border-radius: 8px;
            border: none;
            background: #FFD400;
            font-size: 12px;
            font-weight: 800;
            color: #0F172A;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 2px 6px rgba(255,212,0,0.3);
          }

          /* MASTER GRID */
          .wh-mh-master-grid {
            display: flex;
            gap: 14px;
            align-items: flex-start;
          }
          .wh-mh-left-col {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .wh-mh-right-col {
            width: 250px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .wh-mh-card {
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          }

          /* SEARCH & FILTERS CARD */
          .wh-mh-search-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
          }
          .wh-mh-search-wrap {
            position: relative;
            flex: 1;
          }
          .wh-mh-search-inp {
            width: 100%;
            height: 34px;
            padding: 0 12px 0 34px;
            border-radius: 8px;
            border: 1px solid #CBD5E1;
            background: #FFFFFF;
            font-size: 11.5px;
            font-weight: 600;
            color: #0F172A;
            outline: none;
            box-sizing: border-box;
          }
          .wh-mh-search-inp:focus { border-color: #FFD400; }
          .wh-mh-search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #94A3B8;
          }

          .wh-mh-filters-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
            margin-bottom: 8px;
          }
          .wh-mh-filter-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .wh-mh-filter-lbl {
            font-size: 9px;
            font-weight: 800;
            color: #64748B;
            text-transform: uppercase;
          }
          .wh-mh-filter-sel {
            height: 28px;
            padding: 0 6px;
            border-radius: 6px;
            border: 1px solid #CBD5E1;
            background: #FFFFFF;
            font-size: 11px;
            font-weight: 600;
            color: #0F172A;
            outline: none;
          }

          /* TABLE CARD */
          .wh-mh-table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .wh-mh-table-wrap {
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .wh-mh-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11.5px;
            min-width: 820px;
          }
          .wh-mh-table th {
            padding: 10px 12px;
            font-size: 9px;
            font-weight: 800;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: #F8FAFC;
            border-bottom: 1px solid #E2E8F0;
            text-align: left;
          }
          .wh-mh-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #F1F5F9;
            vertical-align: middle;
          }
          .wh-mh-table tr:hover { background: #F8FAFC; }

          /* TYPE BADGES */
          .type-tag-move { color: #16A34A; font-weight: 800; display: flex; align-items: center; gap: 4px; }
          .type-tag-stage { color: #2563EB; font-weight: 800; display: flex; align-items: center; gap: 4px; }
          .type-tag-transfer { color: #D97706; font-weight: 800; display: flex; align-items: center; gap: 4px; }
          .type-tag-receive { color: #9333EA; font-weight: 800; display: flex; align-items: center; gap: 4px; }
          .type-tag-return { color: #DC2626; font-weight: 800; display: flex; align-items: center; gap: 4px; }

          .badge-completed {
            background: #DCFCE7;
            color: #15803D;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 9.5px;
            font-weight: 800;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }
          .badge-failed {
            background: #FEE2E2;
            color: #DC2626;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 9.5px;
            font-weight: 800;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .btn-eye-view {
            background: transparent;
            border: none;
            color: #64748B;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
          }
          .btn-eye-view:hover { background: #F1F5F9; color: #0F172A; }

          /* FOOTER */
          .wh-mh-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 12px;
            padding-top: 10px;
            font-size: 11px;
            color: #64748B;
          }

          /* RIGHT SIDEBAR */
          .wh-mh-side-card {
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            padding: 14px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          }
          .wh-mh-side-title {
            font-size: 10px;
            font-weight: 900;
            color: #0F172A;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
            padding-bottom: 4px;
            border-bottom: 1px solid #F1F5F9;
          }

          /* DONUT CHART */
          .wh-donut-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
          .wh-donut-chart { position: relative; width: 70px; height: 70px; flex-shrink: 0; }
          .wh-donut-center {
            position: absolute; inset: 12px; background: #FFFFFF; border-radius: 50%;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
          }
          .wh-legend-list { display: flex; flex-direction: column; gap: 4px; font-size: 10px; }
          .wh-legend-item { display: flex; items-center; gap: 6px; }
          .wh-legend-dot { width: 8px; height: 8px; border-radius: 50%; }

          /* QUICK FILTERS */
          .wh-qf-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            cursor: pointer;
            margin-bottom: 2px;
          }
          .wh-qf-item:hover { background: #F8FAFC; }
          .wh-qf-item.active { background: #FEF3C7; color: #B45309; }

          /* MOVEMENT TYPES */
          .wh-mt-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
            border-bottom: 1px solid #F1F5F9;
            font-size: 11px;
          }
          .wh-mt-row:last-child { border-bottom: none; }
          .wh-mt-count { font-weight: 800; color: #0F172A; }

          /* HELP */
          .wh-help-text { font-size: 10px; color: #64748B; line-height: 1.4; display: flex; flex-direction: column; gap: 4px; }

          /* MODAL */
          .wh-modal-overlay {
            position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(4px); z-index: 99999; display: flex;
            align-items: center; justify-content: center; padding: 16px;
          }
          .wh-modal-box {
            background: #FFFFFF; border-radius: 12px; width: 100%; max-width: 460px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden;
          }

          @media (max-width: 1024px) {
            .wh-mh-filters-grid { grid-template-columns: repeat(2, 1fr); }
            .wh-mh-master-grid { flex-direction: column; }
            .wh-mh-right-col { width: 100%; }
          }
          @media (max-width: 640px) {
            .wh-mh-filters-grid { grid-template-columns: 1fr; }
            .wh-mvt-history-container { padding: 12px; }
          }
        `}</style>

        {/* HEADER ROW */}
        <div className="wh-mh-header-row">
          <div>
            <h1 className="wh-mh-title">MOVEMENT HISTORY</h1>
            <p className="wh-mh-sub">Complete history of all stock/item movements within the depot.</p>
          </div>

          <div className="wh-mh-actions-top">
            <button className="wh-btn-export-mh" onClick={handleExportCSV}>
              <Download size={14} />
              <span>Export</span>
            </button>
            <button className="wh-btn-print-mh" onClick={handlePrintHistory}>
              <Printer size={14} />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* MASTER GRID LAYOUT */}
        <div className="wh-mh-master-grid">

          {/* LEFT MAIN COLUMN */}
          <div className="wh-mh-left-col">

            {/* SEARCH & FILTERS CARD */}
            <div className="wh-mh-card">
              <div className="wh-mh-search-row">
                <div className="wh-mh-search-wrap">
                  <Search size={14} className="wh-mh-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by stock/item, VIN, barcode, SKU, reference, load no..."
                    value={historySearch}
                    onChange={e => setHistorySearch(e.target.value)}
                    className="wh-mh-search-inp"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button className="wh-btn-export-mh" style={{ height: '34px' }}>
                    <Filter size={13} />
                    <span>Filters</span>
                  </button>
                  <span 
                    className="text-xs font-bold text-amber-600 cursor-pointer hover:underline"
                    onClick={() => { setHistorySearch(''); setHistoryTypeFilter('All'); setHistoryResultFilter('All'); }}
                  >
                    Clear All
                  </span>
                </div>
              </div>

              {/* 2-ROW FILTERS GRID */}
              <div className="wh-mh-filters-grid">
                <div className="wh-mh-filter-item">
                  <span className="wh-mh-filter-lbl">Date Range</span>
                  <select className="wh-mh-filter-sel">
                    <option>14/07/2026 - 21/07/2026</option>
                    <option>Today</option>
                    <option>This Month</option>
                  </select>
                </div>

                <div className="wh-mh-filter-item">
                  <span className="wh-mh-filter-lbl">Movement Type</span>
                  <select value={historyTypeFilter} onChange={e => setHistoryTypeFilter(e.target.value)} className="wh-mh-filter-sel">
                    <option value="All">All Types</option>
                    <option value="Move">Move</option>
                    <option value="Stage">Stage</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Receive">Receive</option>
                    <option value="Return">Return</option>
                  </select>
                </div>

                <div className="wh-mh-filter-item">
                  <span className="wh-mh-filter-lbl">From Location</span>
                  <select className="wh-mh-filter-sel">
                    <option>All Locations</option>
                    <option>Zone A</option>
                    <option>Warehouse 1</option>
                    <option>Container Yard</option>
                  </select>
                </div>

                <div className="wh-mh-filter-item">
                  <span className="wh-mh-filter-lbl">To Location</span>
                  <select className="wh-mh-filter-sel">
                    <option>All Locations</option>
                    <option>Lane 1 (Main Yard)</option>
                    <option>Lane 5 (DG Staging)</option>
                    <option>Lane 6 (Container Bay)</option>
                  </select>
                </div>

                <div className="wh-mh-filter-item">
                  <span className="wh-mh-filter-lbl">Item Type</span>
                  <select className="wh-mh-filter-sel">
                    <option>All Types</option>
                    <option>Vehicle</option>
                    <option>Pallet</option>
                    <option>Container</option>
                  </select>
                </div>

                <div className="wh-mh-filter-item">
                  <span className="wh-mh-filter-lbl">Item / Stock</span>
                  <select className="wh-mh-filter-sel">
                    <option>All Items</option>
                  </select>
                </div>

                <div className="wh-mh-filter-item">
                  <span className="wh-mh-filter-lbl">Load / Reference</span>
                  <select className="wh-mh-filter-sel">
                    <option>All</option>
                  </select>
                </div>

                <div className="wh-mh-filter-item">
                  <span className="wh-mh-filter-lbl">Driver / Staff</span>
                  <select className="wh-mh-filter-sel">
                    <option>All</option>
                  </select>
                </div>

                <div className="wh-mh-filter-item">
                  <span className="wh-mh-filter-lbl">Movement Reason</span>
                  <select className="wh-mh-filter-sel">
                    <option>All Reasons</option>
                  </select>
                </div>

                <div className="wh-mh-filter-item">
                  <span className="wh-mh-filter-lbl">Result</span>
                  <select value={historyResultFilter} onChange={e => setHistoryResultFilter(e.target.value)} className="wh-mh-filter-sel">
                    <option value="All">All Results</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AUDIT LOG TABLE CARD */}
            <div className="wh-mh-card">
              <div className="wh-mh-table-header">
                <div className="text-xs font-bold text-slate-700">
                  Total Results: <strong>{filteredHistory.length}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-semibold">Sort by:</span>
                  <select className="wh-mh-filter-sel" style={{ height: '26px' }}>
                    <option>Date / Time (Newest)</option>
                    <option>Date / Time (Oldest)</option>
                  </select>
                </div>
              </div>

              <div className="wh-mh-table-wrap">
                <table className="wh-mh-table">
                  <thead>
                    <tr>
                      <th>DATE / TIME</th>
                      <th>MOVEMENT TYPE</th>
                      <th>ITEM / DESCRIPTION</th>
                      <th>FROM LOCATION</th>
                      <th>TO LOCATION</th>
                      <th>LOAD / REF</th>
                      <th>BY</th>
                      <th>RESULT</th>
                      <th style={{ textAlign: 'center' }}>DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
                          No movement audit logs found.
                        </td>
                      </tr>
                    ) : (
                      filteredHistory.map(log => (
                        <tr key={log.id}>
                          <td className="font-semibold text-slate-700">{log.dateTime}</td>
                          <td>
                            {log.movementType === 'Move' && <span className="type-tag-move"><ArrowRight size={12} /> Move</span>}
                            {log.movementType === 'Stage' && <span className="type-tag-stage"><Box size={12} /> Stage</span>}
                            {log.movementType === 'Transfer' && <span className="type-tag-transfer"><Truck size={12} /> Transfer</span>}
                            {log.movementType === 'Receive' && <span className="type-tag-receive"><Download size={12} /> Receive</span>}
                            {log.movementType === 'Return' && <span className="type-tag-return"><RefreshCw size={12} /> Return</span>}
                          </td>
                          <td>
                            <div>
                              <div className="font-extrabold text-slate-900">{log.itemTitle}</div>
                              <div className="text-[9.5px] text-slate-500 font-mono">{log.vin}</div>
                              {log.badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{log.badge}</span>}
                            </div>
                          </td>
                          <td className="font-medium text-slate-700">{log.fromLoc}</td>
                          <td className="font-semibold text-slate-900">{log.toLoc}</td>
                          <td className="font-mono text-slate-800 font-bold">{log.loadRef}</td>
                          <td>
                            <div>
                              <div className="font-bold text-slate-900">{log.byName}</div>
                              <div className="text-[9.5px] text-slate-500 font-semibold">{log.byRole}</div>
                            </div>
                          </td>
                          <td>
                            {log.result === 'Completed' ? (
                              <span className="badge-completed"><CheckCircle2 size={12} /> Completed</span>
                            ) : (
                              <span className="badge-failed"><X size={12} /> Failed</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="btn-eye-view" onClick={() => setDetailsModalLog(log)} title="View Log Details">
                              <Eye size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* FOOTER */}
              <div className="wh-mh-footer">
                <div>Rows per page: <strong>25</strong></div>
                <div>1–{filteredHistory.length} of 128</div>
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 rounded border border-slate-300 flex items-center justify-center"><ChevronLeft size={14} /></button>
                  <button className="w-6 h-6 rounded bg-amber-400 font-bold text-xs flex items-center justify-center">1</button>
                  <button className="w-6 h-6 rounded border border-slate-300 font-semibold text-xs flex items-center justify-center">2</button>
                  <button className="w-6 h-6 rounded border border-slate-300 flex items-center justify-center"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="wh-mh-right-col">

            {/* MOVEMENT SUMMARY */}
            <div className="wh-mh-side-card">
              <div className="wh-mh-side-title">MOVEMENT SUMMARY</div>

              <div className="wh-donut-wrap">
                <div className="wh-donut-chart">
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#22C55E" strokeWidth="4" strokeDasharray="86 100" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="4 100" strokeDashoffset="-86" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="6 100" strokeDashoffset="-90" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="4 100" strokeDashoffset="-96" />
                  </svg>
                  <div className="wh-donut-center">
                    <span style={{ fontSize: '13px', fontWeight: 900 }}>128</span>
                    <span style={{ fontSize: '7px', color: '#64748B' }}>Total</span>
                  </div>
                </div>

                <div className="wh-legend-list">
                  <div className="wh-legend-item">
                    <div className="wh-legend-dot" style={{ background: '#22C55E' }} />
                    <span>Completed <strong>110 (86%)</strong></span>
                  </div>
                  <div className="wh-legend-item">
                    <div className="wh-legend-dot" style={{ background: '#EF4444' }} />
                    <span>Failed <strong>5 (4%)</strong></span>
                  </div>
                  <div className="wh-legend-item">
                    <div className="wh-legend-dot" style={{ background: '#3B82F6' }} />
                    <span>In Progress <strong>8 (6%)</strong></span>
                  </div>
                  <div className="wh-legend-item">
                    <div className="wh-legend-dot" style={{ background: '#F59E0B' }} />
                    <span>Cancelled <strong>5 (4%)</strong></span>
                  </div>
                </div>
              </div>

              <div className="text-[10.5px] font-bold text-blue-600 cursor-pointer flex items-center gap-1 mt-1">
                <FileText size={12} /> View summary report
              </div>
            </div>

            {/* QUICK FILTERS */}
            <div className="wh-mh-side-card">
              <div className="wh-mh-side-title">QUICK FILTERS</div>

              <div className="flex flex-col gap-1">
                {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month'].map(range => (
                  <div
                    key={range}
                    className={`wh-qf-item ${quickTimeFilter === range ? 'active' : ''}`}
                    onClick={() => setQuickTimeFilter(range)}
                  >
                    <span>{range}</span>
                    <span className="font-mono text-[10px]">{range === 'Last 7 Days' ? '128' : range === 'Today' ? '35' : '46'}</span>
                  </div>
                ))}
                <div className="wh-qf-item">
                  <span>Custom Range</span>
                  <Calendar size={12} color="#94A3B8" />
                </div>
              </div>
            </div>

            {/* MOVEMENT TYPES */}
            <div className="wh-mh-side-card">
              <div className="wh-mh-side-title">MOVEMENT TYPES</div>

              <div className="flex flex-col gap-1">
                <div className="wh-mt-row">
                  <span className="type-tag-receive"><Download size={12} /> Receive (Inbound)</span>
                  <span className="wh-mt-count">21</span>
                </div>
                <div className="wh-mt-row">
                  <span className="type-tag-move"><ArrowRight size={12} /> Move Within Depot</span>
                  <span className="wh-mt-count">44</span>
                </div>
                <div className="wh-mt-row">
                  <span className="type-tag-transfer"><Truck size={12} /> Transfer to Another</span>
                  <span className="wh-mt-count">18</span>
                </div>
                <div className="wh-mt-row">
                  <span className="type-tag-stage"><Box size={12} /> Stage to Load Lane</span>
                  <span className="wh-mt-count">28</span>
                </div>
                <div className="wh-mt-row">
                  <span className="text-amber-600 font-bold flex items-center gap-1"><Truck size={12} /> Dispatch / Pickup</span>
                  <span className="wh-mt-count">9</span>
                </div>
                <div className="wh-mt-row">
                  <span className="type-tag-return"><RefreshCw size={12} /> Return / Outbound</span>
                  <span className="wh-mt-count">8</span>
                </div>
              </div>
            </div>

            {/* HELP */}
            <div className="wh-mh-side-card" style={{ background: '#F8FAFC' }}>
              <div className="wh-mh-side-title">HELP</div>

              <div className="wh-help-text">
                <div>• View the complete audit trail of all item movements.</div>
                <div>• Click the eye icon to view movement details.</div>
                <div>• Use filters to find specific movements quickly.</div>
                <div>• All times are in local depot time.</div>
              </div>
            </div>

          </div>

        </div>

        {/* DETAILS MODAL */}
        {detailsModalLog && (
          <div className="wh-modal-overlay" onClick={() => setDetailsModalLog(null)}>
            <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <h3 className="font-extrabold text-sm text-slate-900">Movement Log Details: {detailsModalLog.id}</h3>
                <button onClick={() => setDetailsModalLog(null)}><X size={16} className="text-slate-400" /></button>
              </div>
              <div className="p-4 flex flex-col gap-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Date / Time:</span>
                  <span className="font-bold text-slate-900">{detailsModalLog.dateTime}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Item:</span>
                  <span className="font-bold text-slate-900">{detailsModalLog.itemTitle} ({detailsModalLog.vin})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">From Location:</span>
                  <span className="font-bold text-slate-800">{detailsModalLog.fromLoc}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">To Location:</span>
                  <span className="font-bold text-slate-800">{detailsModalLog.toLoc}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Load Ref:</span>
                  <span className="font-mono font-bold text-amber-600">{detailsModalLog.loadRef}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Logged By:</span>
                  <span className="font-bold text-slate-900">{detailsModalLog.byName} ({detailsModalLog.byRole})</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  /* ============================================================
     IF ROUTE IS MOVE / TRANSFER: Render Screenshot 2 Move Transfer Form
     ============================================================ */
  return (
    <div className="mvt-page">
      <style>{`
        .mvt-page {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #F8FAFC;
          min-height: 100vh;
          color: #0F172A;
          padding: 20px 24px;
          box-sizing: border-box;
        }

        .mvt-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .mvt-h1 {
          font-size: 18px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 3px 0;
          text-transform: uppercase;
          letter-spacing: -0.3px;
        }
        .mvt-subtitle {
          font-size: 12px;
          color: #64748B;
          margin: 0;
        }
        .mvt-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mvt-btn-cancel {
          height: 36px;
          padding: 0 16px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
        }
        .mvt-btn-draft {
          height: 36px;
          padding: 0 16px;
          border-radius: 8px;
          border: 1px solid #0F172A;
          background: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
        }
        .mvt-btn-create {
          height: 36px;
          padding: 0 20px;
          border-radius: 8px;
          border: none;
          background: #FFD400;
          font-size: 12px;
          font-weight: 900;
          color: #0F172A;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255,212,0,0.3);
        }

        .mvt-master {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .mvt-left { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
        .mvt-right { width: 230px; flex-shrink: 0; display: flex; flex-direction: column; gap: 10px; }

        .mvt-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .mvt-sec-label {
          font-size: 10px;
          font-weight: 900;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid #F1F5F9;
        }

        .mvt-top-two { display: flex; gap: 12px; align-items: flex-start; }
        .mvt-type-col { flex: 0 0 250px; }

        .mvt-type-card {
          border-radius: 10px; padding: 12px; cursor: pointer;
          border: 2px solid #E2E8F0; background: #FFFFFF; margin-bottom: 8px;
        }
        .mvt-type-card.active { border-color: #FFD400; background: #FFFDE7; }
        .mvt-type-inner { display: flex; align-items: flex-start; gap: 10px; }
        .mvt-type-icon {
          width: 34px; height: 34px; border-radius: 8px; background: #F8FAFC;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #E2E8F0;
        }
        .mvt-radio-dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #CBD5E1; margin-top: 2px; }
        .mvt-type-card.active .mvt-radio-dot { border: 5px solid #FFD400; }

        .mvt-details-col { flex: 1; min-width: 0; }
        .mvt-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; margin-bottom: 6px; }
        .mvt-form-grp { display: flex; flex-direction: column; gap: 2px; }
        .mvt-lbl { font-size: 9px; font-weight: 800; color: #64748B; text-transform: uppercase; }
        .mvt-inp-wrap { position: relative; }
        .mvt-inp {
          width: 100%; height: 32px; padding: 0 28px 0 10px; border-radius: 7px;
          border: 1px solid #CBD5E1; background: #FFFFFF; color: #0F172A; font-size: 11.5px; font-weight: 600;
        }
        .mvt-inp-icon { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: #94A3B8; pointer-events: none; }
        .mvt-textarea {
          width: 100%; border-radius: 7px; border: 1px solid #CBD5E1; background: #FFFFFF;
          color: #0F172A; font-size: 11px; font-weight: 500; padding: 8px 10px; resize: none; height: 56px;
        }

        .mvt-table-wrap { border: 1px solid #E2E8F0; border-radius: 8px; overflow-x: auto; }
        .mvt-table { width: 100%; border-collapse: collapse; font-size: 11.5px; min-width: 700px; }
        .mvt-table th { padding: 9px 12px; font-size: 9px; font-weight: 800; color: #64748B; text-transform: uppercase; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; text-align: left; }
        .mvt-table td { padding: 9px 12px; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }

        .mvt-right-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .mvt-right-card-title { font-size: 9.5px; font-weight: 900; color: #0F172A; text-transform: uppercase; padding: 10px 14px 4px 14px; }
      `}</style>

      {/* PAGE TITLE + ACTIONS */}
      <div className="mvt-title-row">
        <div>
          <h1 className="mvt-h1">MOVE / TRANSFER</h1>
          <p className="mvt-subtitle">Move items within the depot or transfer to another depot/location.</p>
        </div>
        <div className="mvt-actions">
          <button className="mvt-btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button className="mvt-btn-draft" onClick={() => alert('Saved as draft!')}>Save as Draft</button>
          <button className="mvt-btn-create" onClick={handleCreateTransfer}>Create Transfer</button>
        </div>
      </div>

      {/* MASTER GRID */}
      <div className="mvt-master">

        {/* LEFT FORM CONTENT */}
        <div className="mvt-left">

          {/* TOP TWO CARDS */}
          <div className="mvt-top-two">

            <div className="mvt-card mvt-type-col">
              <div className="mvt-sec-label">1. MOVEMENT TYPE</div>
              <div className={`mvt-type-card ${movementType === 'within' ? 'active' : ''}`} onClick={() => setMovementType('within')}>
                <div className="mvt-type-inner">
                  <div className="mvt-type-icon"><Navigation size={16} color={movementType === 'within' ? '#D97706' : '#64748B'} /></div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>Move Within Depot</div>
                    <div style={{ fontSize: 10, color: '#64748B' }}>Move items to a new location within this depot</div>
                  </div>
                  <div className="mvt-radio-dot" />
                </div>
              </div>

              <div className={`mvt-type-card ${movementType === 'transfer' ? 'active' : ''}`} onClick={() => setMovementType('transfer')}>
                <div className="mvt-type-inner">
                  <div className="mvt-type-icon"><Building size={16} color={movementType === 'transfer' ? '#D97706' : '#64748B'} /></div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>Transfer to Another Depot</div>
                    <div style={{ fontSize: 10, color: '#64748B' }}>Transfer items to a different depot/branch</div>
                  </div>
                  <div className="mvt-radio-dot" />
                </div>
              </div>
            </div>

            <div className="mvt-card mvt-details-col">
              <div className="mvt-sec-label">2. MOVEMENT DETAILS</div>
              <div className="mvt-grid2">
                <div className="mvt-form-grp">
                  <label className="mvt-lbl">Reference No.</label>
                  <div className="mvt-inp-wrap">
                    <input type="text" value={refNo} onChange={e => setRefNo(e.target.value)} className="mvt-inp" />
                    <Calendar size={13} className="mvt-inp-icon" />
                  </div>
                </div>
                <div className="mvt-form-grp">
                  <label className="mvt-lbl">Date / Time *</label>
                  <div className="mvt-inp-wrap">
                    <input type="text" value={dateTime} onChange={e => setDateTime(e.target.value)} className="mvt-inp" />
                    <Calendar size={13} className="mvt-inp-icon" />
                  </div>
                </div>
                <div className="mvt-form-grp">
                  <label className="mvt-lbl">Reason for Move *</label>
                  <div className="mvt-inp-wrap">
                    <select value={reason} onChange={e => setReason(e.target.value)} className="mvt-inp">
                      <option value="Repositioning">Repositioning</option>
                      <option value="Customer Request">Customer Request</option>
                    </select>
                    <ChevronDown size={13} className="mvt-inp-icon" />
                  </div>
                </div>
                <div className="mvt-form-grp">
                  <label className="mvt-lbl">Priority</label>
                  <div className="mvt-inp-wrap">
                    <select value={priority} onChange={e => setPriority(e.target.value)} className="mvt-inp">
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                    </select>
                    <ChevronDown size={13} className="mvt-inp-icon" />
                  </div>
                </div>
              </div>

              <div className="mvt-form-grp">
                <label className="mvt-lbl">Notes (Optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="mvt-textarea" placeholder="Enter notes optional" />
              </div>
            </div>

          </div>

          {/* 3. ITEMS TO MOVE */}
          <div className="mvt-card">
            <div className="flex justify-between items-center mb-2">
              <div className="mvt-sec-label" style={{ margin: 0, padding: 0, border: 'none' }}>
                3. ITEMS TO MOVE ({formItems.length})
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                  <QrCode size={13} className="text-slate-500" />
                  <input
                    type="text"
                    placeholder="Scan barcode / VIN"
                    value={scanInput}
                    onChange={e => setScanInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddFormItem()}
                    className="bg-transparent text-xs font-medium outline-none w-36"
                  />
                  <button onClick={handleAddFormItem} className="text-amber-500 font-bold">+</button>
                </div>
                <button onClick={() => setImportModalOpen(true)} className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-amber-600">Import</button>
                <button onClick={handleClearAllForm} className="px-2 py-1 bg-white border border-red-300 rounded text-xs font-bold text-red-600">Clear All</button>
              </div>
            </div>

            <div className="mvt-table-wrap">
              <table className="mvt-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ITEM / DESCRIPTION</th>
                    <th>TYPE</th>
                    <th>FROM LOCATION</th>
                    <th>TO LOCATION</th>
                    <th>CONDITION</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {formItems.map((item, idx) => (
                    <tr key={item.id} onClick={() => setSelectedFormItem(item)}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <img src={item.image} alt={item.title} style={{ width: 36, height: 28, borderRadius: 4, objectFit: 'cover' }} />
                          <div>
                            <div className="font-extrabold text-slate-900">{item.title}</div>
                            <div className="text-[9.5px] text-slate-500 font-mono">VIN: {item.vin}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100">{item.type}</span></td>
                      <td className="font-semibold text-slate-700">{item.fromZone} / {item.fromRow}</td>
                      <td><span className="font-bold text-amber-600">{item.toZone} / {item.toRow}</span></td>
                      <td className="font-semibold text-slate-800">{item.condition}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => handleRemoveFormItem(item.id)} className="text-red-500"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4 & 5 BOTTOM CARDS */}
          <div className="flex gap-3">
            <div className="mvt-card flex-1">
              <div className="mvt-sec-label">4. SPECIAL INSTRUCTIONS (OPTIONAL)</div>
              <div className="flex gap-4 mb-2 text-xs font-bold text-slate-700">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={requiresEquipment} onChange={e => setRequiresEquipment(e.target.checked)} />
                  <span>Requires equipment</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={notifyAfter} onChange={e => setNotifyAfter(e.target.checked)} />
                  <span>Notify after move</span>
                </label>
              </div>
              <textarea value={additionalInstructions} onChange={e => setAdditionalInstructions(e.target.value)} placeholder="Enter instructions..." className="mvt-textarea" />
            </div>

            <div className="mvt-card w-64">
              <div className="mvt-sec-label">5. CONFIRMATION</div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-4 cursor-pointer">
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />
                <span>I confirm all items are correct.</span>
              </label>
              <button onClick={handleCreateTransfer} disabled={!confirmed} className={`w-full py-2 rounded font-extrabold text-xs ${confirmed ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-400'}`}>
                Create Transfer
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR PREVIEW */}
        <div className="mvt-right">
          <div className="mvt-right-card">
            <div className="mvt-right-card-title">SELECTED ITEM PREVIEW</div>
            {selectedFormItem ? (
              <div className="p-3">
                <img src={selectedFormItem.image} alt={selectedFormItem.title} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6 }} />
                <div className="mt-2 font-extrabold text-slate-900 text-xs">{selectedFormItem.title}</div>
                <div className="text-[10px] text-slate-500 font-mono">VIN: {selectedFormItem.vin}</div>
                <div className="mt-2 text-[10px] font-bold text-amber-600">Current: {selectedFormItem.fromZone} ({selectedFormItem.fromRow})</div>
              </div>
            ) : null}
          </div>
        </div>

      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10,
          padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10,
          zIndex: 99998, boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
        }}>
          <CheckCircle2 size={16} className="text-green-600" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
