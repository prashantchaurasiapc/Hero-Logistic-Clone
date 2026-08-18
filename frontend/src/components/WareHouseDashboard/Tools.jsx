import React, { useState, useMemo } from 'react';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Printer, QrCode, Search, Filter, ChevronDown, Check, Info,
  Sliders, Box, Truck, MapPin, Layers, Edit3, CheckSquare, Square,
  MoreVertical, FileText, Activity, RefreshCw, Zap, Shield, Plus, Minus,
  X, CheckCircle, AlertCircle, Download, Upload, Eye, FileSpreadsheet,
  Settings
} from 'lucide-react';

export default function Tools() {
  const { tab } = useParams();
  const navigate = useNavigate();

  // Normalize tab state from URL parameter or default to 'labels'
  const activeTab = (tab || 'labels').toLowerCase();

  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const [stockItems, setStockItems] = useState([]);
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  const [loadingStock, setLoadingStock] = useState(false);

  const handleTabChange = (targetTab) => {
    navigate(`/warehouse/tools/${targetTab}`);
  };

  // ============================================================
  // TAB 1 STATE: LABELS & BARCODES
  // ============================================================
  const [activeCategory, setActiveCategory] = useState('Vehicle');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('All Zones');
  const [selectedLabelType, setSelectedLabelType] = useState('VIN Label');
  const [printer, setPrinter] = useState('Zebra ZD421 (192.168.1.25)');
  const [labelSize, setLabelSize] = useState('100mm x 60mm');
  const [printFormat, setPrintFormat] = useState('Thermal Label');
  const [copies, setCopies] = useState(1);
  const [autoCut, setAutoCut] = useState(true);
  const [promptBeforePrint, setPromptBeforePrint] = useState(false);
  const [includeBarcode, setIncludeBarcode] = useState(true);
  const [includeQrCode, setIncludeQrCode] = useState(true);
  const [includeLogo, setIncludeLogo] = useState(true);
  const [includeDateTime, setIncludeDateTime] = useState(false);
  const [includeUserName, setIncludeUserName] = useState(false);
  const [customText, setCustomText] = useState('');

  // Master Categorized Dataset for Labels initialized empty
  const categoryData = useMemo(() => ({
    Vehicle: [],
    Pallet: [],
    Container: [],
    Load: [],
    HoldingArea: [],
    LoadLane: []
  }), []);


  // Filtered items list for current active Category & Search & Dropdowns
  const currentCategoryItems = useMemo(() => {
    const items = categoryData[activeCategory] || categoryData.Vehicle;
    return items.filter(item => {
      const matchSearch = searchQuery === '' ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase());

      const matchWh = selectedWarehouse === 'All Warehouses' || item.warehouse === selectedWarehouse;
      const matchZn = selectedZoneFilter === 'All Zones' || item.zone === selectedZoneFilter;

      return matchSearch && matchWh && matchZn;
    });
  }, [categoryData, activeCategory, searchQuery, selectedWarehouse, selectedZoneFilter]);

  const [selectedItem, setSelectedItem] = useState(currentCategoryItems[0] || categoryData.Vehicle[0]);

  // Sync selectedItem if category changes
  React.useEffect(() => {
    if (currentCategoryItems.length > 0 && !currentCategoryItems.some(i => i.id === selectedItem?.id)) {
      setSelectedItem(currentCategoryItems[0]);
    }
  }, [activeCategory, currentCategoryItems]);

  const [recentlyPrinted, setRecentlyPrinted] = useState([]);

  const handlePrintLabel = () => {
    const newPrint = {
      id: selectedItem?.id || 'LABEL-PRINTED',
      type: selectedLabelType,
      by: 'Me',
      time: 'Just Now',
      copies: String(copies)
    };
    setRecentlyPrinted([newPrint, ...recentlyPrinted.slice(0, 4)]);
    showToast(`✓ Printing ${copies} copy of ${selectedLabelType} to ${printer.split(' ')[0]}...`);
  };

  const handleClearSelections = () => {
    setSearchQuery('');
    setSelectedWarehouse('All Warehouses');
    setSelectedZoneFilter('All Zones');
    setCustomText('');
    showToast('✓ Reset all filters & selections');
  };

  // ============================================================
  // TAB 2 STATE: PRINT DOCUMENTS
  // ============================================================
  const [docType, setDocType] = useState('Outbound Manifest');
  const [docOrderRef, setDocOrderRef] = useState('');
  const [docCarrier, setDocCarrier] = useState('');
  const [docDestination, setDocDestination] = useState('');
  const [docNotes, setDocNotes] = useState('');
<<<<<<< HEAD
  
  const [generatedDocuments, setGeneratedDocuments] = useState([]);

=======

  React.useEffect(() => {
    const fetchStock = async () => {
      setLoadingStock(true);
      try {
        const res = await api.get('/warehouse-portal/stock');
        const data = res.data?.data || [];
        setStockItems(data);
        if (data.length > 0) {
          setSelectedStockItem(data[0]);
          setDocOrderRef(data[0].vin || data[0].stockRef || `STK-${data[0].id.slice(0,6)}`);
          setDocDestination(data[0].customerName || data[0].customer?.companyName || 'Melbourne Depot');
        }
      } catch (err) {
        console.error('Failed to fetch stock in tools:', err);
      } finally {
        setLoadingStock(false);
      }
    };
    fetchStock();
  }, []);
  
  const [generatedDocuments, setGeneratedDocuments] = useState([]);

>>>>>>> a11974143e328523b1e9500d17002fd6015a68b2
  const handleCreateDocument = async () => {
    if (!docOrderRef) {
      showToast('⚠️ Please enter a Document/Order Reference number!');
      return;
    }
    try {
      const res = await api.post('/warehouse-portal/labels/print', {
        labelType: docType,
        itemId: docOrderRef,
        printerTarget: 'Office Laser Printer',
        copies: 1
      });
      if (res.data?.success) {
        const newDoc = {
          id: res.data.jobId || `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
          name: `${docType} #${docOrderRef}`,
          type: docType,
          ref: `Carrier: ${docCarrier} | Dest: ${docDestination}`,
          time: 'Just Now',
          status: 'Printed Successfully'
        };
        setGeneratedDocuments([newDoc, ...generatedDocuments]);
        showToast(`✓ Document Generated: Job ID ${res.data.jobId || 'Spooling'}`);
      }
    } catch (err) {
      console.error('Print doc error:', err);
      showToast('Failed to connect to printer API.');
    }
  };

  // ============================================================
  // TAB 3 STATE: QR SCANNER
  // ============================================================
  const [simulatedScanTarget, setSimulatedScanTarget] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleSimulateScan = async () => {
    if (!simulatedScanTarget) {
      showToast('⚠️ Please select a stock item barcode to scan first!');
      return;
    }
    setScanning(true);
    try {
      const res = await api.post('/warehouse-portal/stock/scan', { code: simulatedScanTarget });
      if (res.data?.success) {
        const matched = res.data.data;
        setScanResult({
          code: matched.identifier || simulatedScanTarget,
          name: matched.nameCategory || 'Stock Item',
          zone: matched.zoneBinSlot || 'Storage Yard',
          qty: matched.stockQty || '1 Unit',
          weight: matched.weight || 'N/A',
          dimensions: matched.dimensions || 'N/A',
          status: matched.status || 'In Stock'
        });
        showToast('✓ Barcode Scanned successfully!');
      }
    } catch (err) {
      console.error('Scan error:', err);
      showToast('Item not found or scanner API error.');
    } finally {
      setScanning(false);
    }
  };

  // ============================================================
  // TAB 4 STATE: IMPORT / EXPORT
  // ============================================================
  const [importSchema, setImportSchema] = useState('Stock Inventory');
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleImportFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
      showToast(`Selected file: ${e.target.files[0].name}`);
    }
  };

  const handleExecuteImport = () => {
    if (!importFile) {
      showToast('⚠️ Please select a CSV or Excel file to import!');
      return;
    }
    setImporting(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(Boolean);
        if (lines.length <= 1) {
          showToast('⚠️ CSV file is empty or has only headers!');
          setImporting(false);
          return;
        }
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const parsedItems = [];
        
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim());
          if (cols.length < headers.length) continue;
          
          const item = {};
          headers.forEach((header, idx) => {
            item[header] = cols[idx] || '';
          });
          parsedItems.push({
            vin: item.vin || `VIN-${Math.floor(100000 + Math.random() * 900000)}`,
            make: item.make || 'Generic',
            model: item.model || 'Item',
            year: item.year ? parseInt(item.year) : 2026,
            color: item.color || 'White',
            type: item.type || 'Vehicle',
            zone: item.zone || 'Zone A',
            row: item.row || 'Row 1',
            bay: item.bay || 'Bay 1',
            position: item.position || 'P01'
          });
        }

        const payload = {
          inboundType: 'CSV Bulk Upload',
          inboundNo: `CSV-${Math.floor(100000 + Math.random() * 900000)}`,
          carrierName: 'Carrier Import',
          shipperDetails: 'Bulk Upload',
          items: parsedItems
        };

        const res = await api.post('/warehouse-portal/inbound/receive', payload);
        if (res.data?.success) {
          showToast(`✓ Successfully imported ${parsedItems.length} records into ${importSchema}!`);
          // Re-fetch stock items to refresh the tools page dropdown
          const stockRes = await api.get('/warehouse-portal/stock');
          const data = stockRes.data?.data || [];
          setStockItems(data);
          if (data.length > 0) {
            setSelectedStockItem(data[0]);
          }
        } else {
          showToast('Failed to import records.');
        }
      } catch (err) {
        console.error('Import error:', err);
        showToast('Error reading or parsing CSV file.');
      } finally {
        setImporting(false);
        setImportFile(null);
      }
    };
    reader.readAsText(importFile);
  };

  // ============================================================
  // TAB 5 STATE: BATCH PRINTING
  // ============================================================
  const [spoolerPaused, setSpoolerPaused] = useState(false);
  const [spoolerActiveCount, setSpoolerActiveCount] = useState(0);
  const [batchQueue, setBatchQueue] = useState([]);
<<<<<<< HEAD
=======

  React.useEffect(() => {
    if (activeTab === 'batch-printing' && stockItems.length > 0 && batchQueue.length === 0) {
      const initialQueue = stockItems.slice(0, 3).map((item, idx) => ({
        id: `JOB-00${idx + 1}`,
        name: `Label Print: ${item.make ? `${item.make} ${item.model}` : 'Stock Item'} (${item.vin || item.id.slice(0,6)})`,
        printer: 'Zebra ZD421 (Office)',
        count: '1 Label',
        status: idx === 0 ? 'Queued' : 'Completed'
      }));
      setBatchQueue(initialQueue);
      setSpoolerActiveCount(initialQueue.filter(q => q.status === 'Queued').length);
    }
  }, [activeTab, stockItems]);
>>>>>>> a11974143e328523b1e9500d17002fd6015a68b2

  const handlePauseQueue = () => {
    if (spoolerPaused) {
      handleResumeSpoolerJobs();
      return;
    }
    setSpoolerPaused(true);
    setBatchQueue(prev => prev.map(job => 
      job.status.includes('Printing') ? { ...job, status: 'Paused' } : job
    ));
    showToast('⏸ Spooler Queue Paused. Print engine suspended.');
  };

  const handleResumeSpoolerJobs = () => {
    setSpoolerPaused(false);
    
    const hasPending = batchQueue.some(j => j.status !== 'Completed');
    if (!hasPending) {
      showToast('ℹ️ All spooler jobs are already completed!');
      return;
    }

    setBatchQueue(prev => {
      let foundPrinting = false;
      return prev.map(job => {
        if (job.status === 'Completed') return job;
        if (!foundPrinting) {
          foundPrinting = true;
          return { ...job, status: 'Printing (65%)' };
        }
        return { ...job, status: 'Queued' };
      });
    });

    showToast('🖨️ Resumed Spooler Jobs! Print engine processing queue...');

    setTimeout(() => {
      setBatchQueue(prev => {
        const next = [...prev];
        const printingIdx = next.findIndex(j => j.status.includes('Printing'));
        if (printingIdx !== -1) {
          next[printingIdx] = { ...next[printingIdx], status: 'Completed' };
          if (printingIdx + 1 < next.length && next[printingIdx + 1].status !== 'Completed') {
            next[printingIdx + 1] = { ...next[printingIdx + 1], status: 'Printing (20%)' };
          }
        }
        return next;
      });
      setSpoolerActiveCount(prev => Math.max(0, prev - 40));
    }, 2200);
  };

  const handleClearCompletedJobs = () => {
    const completedCount = batchQueue.filter(job => job.status === 'Completed').length;
    if (completedCount === 0) {
      showToast('No completed jobs in the spooler queue to clear.');
      return;
    }
    setBatchQueue(batchQueue.filter(job => job.status !== 'Completed'));
    showToast(`✓ Cleared ${completedCount} completed print job(s) from spooler queue`);
  };

  return (
    <div className="wh-light-tools-page">
      <style>{`
        .wh-light-tools-page {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background-color: #F8FAFC;
          min-height: 100vh;
          color: #0F172A;
          padding: 16px 22px;
          box-sizing: border-box;
        }

        /* FILTER CONTROL BAR */
        .wh-light-filter-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: nowrap;
          width: 100%;
        }
        .wh-light-search-wrap {
          position: relative;
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
        }
        .wh-light-search-input {
          width: 100%;
          height: 34px;
          padding: 0 12px 0 34px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          color: #0F172A;
          font-size: 11.5px;
          outline: none;
          box-sizing: border-box;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .wh-light-search-input::placeholder { color: #94A3B8; }

        /* TABS UTILITIES HEADER BAR */
        .wh-rep-nav-tabs {
          display: flex;
          gap: 20px;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 16px;
          overflow-x: auto;
        }
        .wh-rep-tab-item {
          padding: 6px 0 10px 0;
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          position: relative;
          white-space: nowrap;
          transition: color 0.15s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .wh-rep-tab-item:hover { color: #0F172A; }
        .wh-rep-tab-item.active {
          color: #0F172A;
          font-weight: 800;
        }
        .wh-rep-tab-item.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--primary-color);
          border-radius: 2px;
        }

        /* HEADER TITLE ROW */
        .wh-light-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .wh-light-title {
          font-size: 18px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.3px;
          text-transform: uppercase;
        }
        .wh-light-sub {
          font-size: 11.5px;
          color: #64748B;
          margin-top: 2px;
        }

        /* CARD GENERAL STYLE */
        .wh-light-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 14px 16px;
          box-sizing: border-box;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .wh-card-num-title {
          font-size: 10.5px;
          font-weight: 900;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .wh-badge-num {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid #94A3B8;
          color: #0F172A;
          font-size: 9px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* TABLE STYLING */
        .wh-light-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        .wh-light-table th {
          text-align: left;
          padding: 6px 8px;
          font-size: 9px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          border-bottom: 1px solid #E2E8F0;
          background: #F8FAFC;
        }
        .wh-light-table td {
          padding: 8px 8px;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
        }
        .wh-light-table tr.selected td {
          background: #FEFCE8;
        }

        /* RADIO CUSTOM */
        .wh-radio-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1.5px solid #94A3B8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .wh-radio-dot.active {
          border-color: #D97706;
        }
        .wh-radio-dot.active::after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #D97706;
        }

        /* CARD 2 LABEL TYPES GRID */
        .wh-label-types-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .wh-type-btn {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 10px 12px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
          position: relative;
        }
        .wh-type-btn:hover {
          border-color: #CBD5E1;
          background: #F1F5F9;
        }
        .wh-type-btn.selected {
          border-color: var(--primary-color);
          background: #FFFBEB;
        }
        .wh-type-btn.selected::after {
          content: '✓';
          position: absolute;
          top: 6px;
          right: 8px;
          font-size: 10px;
          font-weight: 900;
          color: #D97706;
        }

        /* CARD 3 REAL LABEL GRAPHIC PREVIEW */
        .wh-real-label-preview {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 16px;
          color: #0F172A;
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 10px;
        }

        /* FORM CONTROLS LIGHT */
        .wh-light-form-lbl {
          font-size: 10px;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 4px;
          display: block;
        }
        .wh-light-form-input {
          width: 100%;
          height: 32px;
          padding: 0 10px;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 5px;
          color: #0F172A;
          font-size: 11px;
          outline: none;
          box-sizing: border-box;
        }

        /* CHECKBOX CUSTOM */
        .wh-checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #334155;
          cursor: pointer;
          user-select: none;
          margin-bottom: 6px;
        }

        /* BUTTONS */
        .wh-btn-batch-yellow {
          height: 34px;
          padding: 0 16px;
          border-radius: 6px;
          border: none;
          background: var(--primary-color);
          font-size: 11.5px;
          font-weight: 800;
          color: #0F172A;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 6px rgba(255,212,0,0.3);
          transition: transform 0.15s;
        }
        .wh-btn-batch-yellow:hover { transform: translateY(-1px); }

        .wh-light-select {
          height: 34px;
          padding: 0 12px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          color: #0F172A;
          font-size: 11.5px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .wh-light-filter-btn {
          height: 34px;
          padding: 0 14px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          color: #0F172A;
          font-size: 11.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }
        .wh-light-filter-btn:hover { background: #F1F5F9; }

        /* CATEGORY HORIZONTAL PILLS */
        .wh-category-pills {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .wh-pill-btn {
          padding: 6px 14px;
          border-radius: 6px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          color: #64748B;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .wh-pill-btn:hover {
          color: #0F172A;
          border-color: #94A3B8;
        }
        .wh-pill-btn.active {
          background: #FFFBEB;
          border-color: var(--primary-color);
          color: #D97706;
          box-shadow: 0 1px 3px rgba(255,212,0,0.2);
        }

        /* BOTTOM TIP BANNER LIGHT */
        .wh-light-tip-banner {
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          border-radius: 6px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: #1E40AF;
          margin-top: 14px;
        }

        /* INVOICE / MANIFEST TEMPLATE PREVIEW CARD */
        .wh-document-mock-paper {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          padding: 16px;
          color: #0F172A;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          font-size: 10px;
          line-height: 1.4;
          font-family: monospace;
          min-height: 240px;
        }

        /* SCANNER VIEWPORT */
        .wh-scanner-viewport {
          background: #0F172A;
          border: 2px dashed #E2E8F0;
          border-radius: 8px;
          height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .wh-scanner-laser {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: #EF4444;
          animation: scanLaser 2s infinite linear;
          box-shadow: 0 0 8px #EF4444;
        }
        @keyframes scanLaser {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }

        /* FILE UPLOAD DROPZONE */
        .wh-file-dropzone {
          border: 2px dashed #CBD5E1;
          background: #F8FAFC;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: border 0.15s;
        }
        .wh-file-dropzone:hover {
          border-color: #3B82F6;
        }
      `}</style>

      {/* ============================================================
          VIEW 1: LABELS & BARCODES
          ============================================================ */}
      {activeTab === 'labels' && (
        <>
          <div className="wh-light-header">
            <div>
              <h1 className="wh-light-title">LABELS & BARCODES</h1>
              <p className="wh-light-sub">Create, customize and print labels for items, locations, loads and more.</p>
            </div>
            <button className="wh-btn-batch-yellow" onClick={() => handleTabChange('batch-printing')}>
              <Printer size={14} />
              <span>Batch Printing</span>
            </button>
          </div>

          {/* FILTER CONTROL BAR */}
          <div className="wh-light-filter-bar">
            <div className="wh-light-search-wrap">
              <Search size={14} style={{ position: 'absolute', left: 10, color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by VIN, Rego, Pallet ID, Load ID, Container, Item SKU, or Location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="wh-light-search-input"
              />
            </div>
            <select value={selectedWarehouse} onChange={e => setSelectedWarehouse(e.target.value)} className="wh-light-select">
              <option>All Warehouses</option>
              <option>Sydney Depot</option>
              <option>Melbourne Yard</option>
            </select>
            <select value={selectedZoneFilter} onChange={e => setSelectedZoneFilter(e.target.value)} className="wh-light-select">
              <option>All Zones</option>
              <option>Zone A</option>
              <option>Zone B</option>
            </select>
            <button className="wh-light-filter-btn" onClick={() => showToast('Filters applied')}>
              <Filter size={13} />
              <span>Filters</span>
              <ChevronDown size={12} />
            </button>
          </div>

          {/* CATEGORY PILLS */}
          <div className="wh-category-pills">
            {[
              { label: 'Vehicle', icon: Truck },
              { label: 'Pallet', icon: Box },
              { label: 'Container', icon: Box },
              { label: 'Item / Freight', icon: Layers },
              { label: 'Load', icon: Truck },
              { label: 'Location', icon: MapPin },
              { label: 'Holding Area', icon: Layers },
              { label: 'Load Lane', icon: Truck },
              { label: 'Other', icon: Sliders }
            ].map((cat) => {
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.label}
                  className={`wh-pill-btn ${activeCategory === cat.label ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat.label);
                    showToast(`Switched to ${cat.label} label category`);
                  }}
                >
                  <IconComp size={13} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 mb-3.5 items-stretch">
            
            {/* CARD 1: SELECT ITEM */}
            <div className="lg:col-span-5">
              <div className="wh-light-card">
                <div className="wh-card-num-title">
                  <span className="wh-badge-num">1</span>
                  <span>SELECT ITEM / VEHICLE</span>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <table className="wh-light-table">
                    <thead>
                      <tr>
                        <th style={{ width: 24 }}></th>
                        <th>TYPE</th>
                        <th>IDENTIFIER</th>
                        <th>DESCRIPTION</th>
                        <th>LOCATION / STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCategoryItems.map((item, idx) => (
                        <tr key={idx} className={selectedItem?.id === item.id ? 'selected' : ''} onClick={() => setSelectedItem(item)} style={{ cursor: 'pointer' }}>
                          <td><div className={`wh-radio-dot ${selectedItem?.id === item.id ? 'active' : ''}`} /></td>
                          <td>
                            {item.type === 'VIN' && <Truck size={13} className="text-amber-600" />}
                            {item.type === 'Pallet' && <Box size={13} className="text-purple-600" />}
                            {item.type === 'Container' && <Box size={13} className="text-cyan-600" />}
                            {item.type === 'Equipment' && <Sliders size={13} className="text-orange-600" />}
                            {item.type === 'Load' && <Truck size={13} className="text-emerald-600" />}
                            {item.type === 'Location' && <MapPin size={13} className="text-amber-600" />}
                            {item.type === 'Holding Area' && <Layers size={13} className="text-purple-600" />}
                            {item.type === 'Load Lane' && <Truck size={13} className="text-orange-600" />}
                          </td>
                          <td className="font-extrabold text-slate-900 whitespace-nowrap">{item.id}</td>
                          <td className="text-slate-700 font-medium whitespace-nowrap">{item.name}</td>
                          <td className="text-blue-600 font-bold whitespace-nowrap">{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
                  <span>Showing 1 to {currentCategoryItems.length} of {currentCategoryItems.length} results</span>
                  <div className="flex items-center gap-1 font-bold">
                    <span className="px-1.5 py-0.5 rounded cursor-pointer hover:text-slate-800">&lt;</span>
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">1</span>
                    <span className="px-1.5 py-0.5 rounded cursor-pointer hover:text-slate-800">2</span>
                    <span className="px-1.5 py-0.5 rounded cursor-pointer hover:text-slate-800">3</span>
                    <span className="px-1.5 py-0.5 rounded cursor-pointer hover:text-slate-800">4</span>
                    <span className="px-1.5 py-0.5 rounded cursor-pointer hover:text-slate-800">5</span>
                    <span className="px-1.5 py-0.5 rounded cursor-pointer hover:text-slate-800">&gt;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: SELECT LABEL TYPE */}
            <div className="lg:col-span-4">
              <div className="wh-light-card">
                <div className="wh-card-num-title">
                  <span className="wh-badge-num">2</span>
                  <span>SELECT LABEL TYPE</span>
                </div>
                <div className="wh-label-types-grid flex-1">
                  {[
                    { name: 'VIN Label', desc: '(Recommended)', icon: Truck, color: 'text-amber-600' },
                    { name: 'Pallet Label', desc: '', icon: Box, color: 'text-purple-600' },
                    { name: 'QR Code Label', desc: '', icon: QrCode, color: 'text-blue-600' },
                    { name: 'Container Label', desc: '', icon: Box, color: 'text-cyan-600' },
                    { name: 'Load Label', desc: '', icon: Truck, color: 'text-emerald-600' },
                    { name: 'Location Label', desc: '', icon: MapPin, color: 'text-amber-600' },
                    { name: 'Holding Area Label', desc: '', icon: Layers, color: 'text-purple-600' },
                    { name: 'Load Lane Label', desc: '', icon: Truck, color: 'text-orange-600' }
                  ].map((lt) => {
                    const IconC = lt.icon;
                    const isSelected = selectedLabelType === lt.name;
                    return (
                      <div
                        key={lt.name}
                        className={`wh-type-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedLabelType(lt.name)}
                      >
                        <IconC size={16} className={lt.color} />
                        <div>
                          <div className="font-extrabold text-[11px] text-slate-900">{lt.name}</div>
                          {lt.desc && <div className="text-[9px] text-slate-500 font-bold">{lt.desc}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  className={`wh-type-btn mt-2 justify-center ${selectedLabelType === 'Custom Label' ? 'selected' : ''}`}
                  onClick={() => setSelectedLabelType('Custom Label')}
                >
                  <Sliders size={14} className="text-slate-500" />
                  <span className="font-extrabold text-[11px] text-slate-800">Custom Label</span>
                </div>
              </div>
            </div>

            {/* CARD 3: PREVIEW */}
            <div className="lg:col-span-3">
              <div className="wh-light-card">
                <div className="wh-card-num-title">
                  <span className="wh-badge-num">3</span>
                  <span>LABEL PREVIEW</span>
                </div>
                <div className="wh-real-label-preview">
                  {includeLogo && <div className="font-black text-[9px] tracking-widest text-slate-900 uppercase">HERO LOGISTICS</div>}
                  <div className="font-black text-xs text-slate-900 my-1">{selectedItem?.fullCode}</div>
                  <div className="w-full text-left text-[9px] text-slate-800 space-y-0.5 mt-1 border-t border-slate-200 pt-1">
                    <div className="flex justify-between"><span>Make / Model</span><span className="font-extrabold">{selectedItem?.makeModel}</span></div>
                    <div className="flex justify-between"><span>Colour</span><span>{selectedItem?.colour}</span></div>
                    <div className="flex justify-between"><span>Year</span><span>{selectedItem?.year}</span></div>
                    <div className="flex justify-between"><span>Rego</span><span>{selectedItem?.rego}</span></div>
                    <div className="flex justify-between"><span>Stage Area</span><span>{selectedItem?.stageArea}</span></div>
                    <div className="flex justify-between"><span>Load Lane</span><span>{selectedItem?.loadLane}</span></div>
                  </div>
                </div>
                <button className="wh-light-filter-btn justify-center" onClick={() => showToast('Preview generated!')}>
                  <Edit3 size={13} />
                  <span>Edit Layout</span>
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW PRINT SETTINGS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            
            {/* Card 4: Settings */}
            <div className="lg:col-span-4">
              <div className="wh-light-card" style={{ padding: '10px 12px' }}>
                <div className="wh-card-num-title" style={{ marginBottom: 6 }}><span className="wh-badge-num">4</span><span>PRINT SETTINGS</span></div>
                <div className="space-y-1.5 flex-1">
                  <div>
                    <label className="wh-light-form-lbl" style={{ marginBottom: 2 }}>Printer Target</label>
                    <div className="flex items-center gap-2">
                      <select value={printer} onChange={e => setPrinter(e.target.value)} className="wh-light-select flex-1" style={{ height: 28, fontSize: 11 }}>
                        <option>Zebra ZD421 (192.168.1.25)</option>
                        <option>Zebra ZT411 Thermal (Dock A)</option>
                        <option>HP LaserJet Pro (Office)</option>
                      </select>
                      <span className="text-[9.5px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        🟢 Online
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="wh-light-form-lbl" style={{ marginBottom: 2 }}>Label Size</label>
                    <select value={labelSize} onChange={e => setLabelSize(e.target.value)} className="wh-light-select w-full" style={{ height: 28, fontSize: 11 }}>
                      <option>100mm x 60mm</option>
                      <option>4" x 6" Shipping</option>
                      <option>2" x 2" Bin Tag</option>
                    </select>
                  </div>

                  <div>
                    <label className="wh-light-form-lbl" style={{ marginBottom: 2 }}>Print Format</label>
                    <select value={printFormat} onChange={e => setPrintFormat(e.target.value)} className="wh-light-select w-full" style={{ height: 28, fontSize: 11 }}>
                      <option>Thermal Label</option>
                      <option>PDF Document</option>
                      <option>ZPL Stream</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="wh-light-form-lbl mb-0">Copies</span>
                    <div className="flex items-center border border-slate-300 rounded bg-slate-50" style={{ height: 26 }}>
                      <button className="px-2 text-slate-600 hover:text-black font-bold text-xs" onClick={() => setCopies(Math.max(1, copies - 1))}>-</button>
                      <span className="px-2 font-extrabold text-xs text-slate-900">{copies}</span>
                      <button className="px-2 text-slate-600 hover:text-black font-bold text-xs" onClick={() => setCopies(copies + 1)}>+</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[11px] font-semibold text-slate-700">Auto cut</span>
                    <div
                      className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${autoCut ? 'bg-amber-400' : 'bg-slate-300'}`}
                      onClick={() => setAutoCut(!autoCut)}
                    >
                      <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${autoCut ? 'translate-x-4' : ''}`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[11px] font-semibold text-slate-700">Prompt before printing</span>
                    <div
                      className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${promptBeforePrint ? 'bg-amber-400' : 'bg-slate-300'}`}
                      onClick={() => setPromptBeforePrint(!promptBeforePrint)}
                    >
                      <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${promptBeforePrint ? 'translate-x-4' : ''}`} />
                    </div>
                  </div>
                </div>

                <button className="wh-light-filter-btn justify-center mt-2" style={{ height: 28, fontSize: 11 }} onClick={() => showToast('Printed Test Calibration Page')}>
                  <Printer size={12} />
                  <span>Test Print</span>
                </button>
              </div>
            </div>

            {/* Card 5: Options */}
            <div className="lg:col-span-3">
              <div className="wh-light-card" style={{ padding: '10px 12px' }}>
                <div className="wh-card-num-title" style={{ marginBottom: 6 }}><span className="wh-badge-num">5</span><span>ADDITIONAL OPTIONS</span></div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div className="flex flex-col justify-between flex-1 my-1 space-y-2">
                    <div className="wh-checkbox-row" onClick={() => setIncludeBarcode(!includeBarcode)}>
                      {includeBarcode ? <CheckSquare size={14} className="text-amber-600" /> : <Square size={14} className="text-slate-400" />}
                      <span className="font-semibold text-slate-800">Include Barcode</span>
                    </div>

                    <div className="wh-checkbox-row" onClick={() => setIncludeQrCode(!includeQrCode)}>
                      {includeQrCode ? <CheckSquare size={14} className="text-amber-600" /> : <Square size={14} className="text-slate-400" />}
                      <span className="font-semibold text-slate-800">Include QR Code</span>
                    </div>

                    <div className="wh-checkbox-row" onClick={() => setIncludeLogo(!includeLogo)}>
                      {includeLogo ? <CheckSquare size={14} className="text-amber-600" /> : <Square size={14} className="text-slate-400" />}
                      <span className="font-semibold text-slate-800">Include Company Logo</span>
                    </div>

                    <div className="wh-checkbox-row" onClick={() => setIncludeDateTime(!includeDateTime)}>
                      {includeDateTime ? <CheckSquare size={14} className="text-amber-600" /> : <Square size={14} className="text-slate-400" />}
                      <span className="font-semibold text-slate-800">Include Date & Time</span>
                    </div>

                    <div className="wh-checkbox-row" onClick={() => setIncludeUserName(!includeUserName)}>
                      {includeUserName ? <CheckSquare size={14} className="text-amber-600" /> : <Square size={14} className="text-slate-400" />}
                      <span className="font-semibold text-slate-800">Include User Name</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="wh-light-form-lbl" style={{ marginBottom: 3 }}>Custom Text (Optional)</label>
                    <input
                      type="text"
                      placeholder="Enter custom text to appear on label..."
                      value={customText}
                      onChange={e => setCustomText(e.target.value)}
                      className="wh-light-form-input"
                      style={{ height: 30, fontSize: 11 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 6: Recent */}
            <div className="lg:col-span-5">
              <div className="wh-light-card justify-between" style={{ padding: '10px 12px' }}>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="wh-card-num-title mb-0">RECENTLY PRINTED</span>
                    <span className="text-[10px] font-extrabold text-blue-600 cursor-pointer hover:underline" onClick={() => showToast('Opening Recent Print History')}>View all</span>
                  </div>
                  <table className="wh-light-table">
                    <thead>
                      <tr>
                        <th style={{ padding: '4px 6px' }}>ITEM / LABEL</th>
                        <th style={{ padding: '4px 6px' }}>TYPE</th>
                        <th style={{ padding: '4px 6px' }}>PRINTED BY</th>
                        <th style={{ padding: '4px 6px' }}>TIME</th>
                        <th style={{ padding: '4px 6px', textAlign: 'right' }}>COPIES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentlyPrinted.map((rec, i) => (
                        <tr key={i}>
                          <td style={{ padding: '4px 6px' }} className="font-extrabold text-slate-900">{rec.id}</td>
                          <td style={{ padding: '4px 6px' }}><span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[9px]">{rec.type}</span></td>
                          <td style={{ padding: '4px 6px' }} className="font-medium text-slate-600">{rec.by}</td>
                          <td style={{ padding: '4px 6px' }} className="font-medium text-slate-500">{rec.time}</td>
                          <td style={{ padding: '4px 6px', textAlign: 'right' }} className="font-extrabold text-slate-800">{rec.copies}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM TIP BANNER & ACTION BUTTONS */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="wh-light-tip-banner flex-1 min-w-[280px]">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-blue-600" />
                <span>Tip: Use batch printing to print multiple labels at once.</span>
              </div>
              <span className="font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => showToast('Opening Batch Print Guide...')}>Learn more</span>
            </div>

            <div className="flex items-center gap-3">
              <button className="wh-light-filter-btn" onClick={handleClearSelections}>
                Clear
              </button>

              <button className="wh-btn-batch-yellow" onClick={handlePrintLabel}>
                <Printer size={14} />
                <span>Print Label</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ============================================================
          VIEW 2: PRINT DOCUMENTS
          ============================================================ */}
      {activeTab === 'print-documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Document Builder */}
          <div className="lg:col-span-5">
            <div className="wh-light-card">
              <div className="wh-card-num-title">
                <span className="wh-badge-num">1</span>
                <span>DOCUMENT GENERATOR & ROUTING</span>
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <label className="wh-light-form-lbl">Select Stock Item</label>
                  {loadingStock ? (
                    <div className="text-xs text-slate-500">Loading stock items...</div>
                  ) : stockItems.length === 0 ? (
                    <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                      ⚠️ No active stock in warehouse. Using manual entry.
                    </div>
                  ) : (
                    <select
                      value={selectedStockItem?.id || ''}
                      onChange={e => {
                        const matched = stockItems.find(item => item.id === e.target.value);
                        if (matched) {
                          setSelectedStockItem(matched);
                          setDocOrderRef(matched.vin || matched.stockRef || matched.id);
                          setDocDestination(matched.customerName || matched.customer?.companyName || 'Melbourne Depot');
                        }
                      }}
                      className="wh-light-select w-full"
                    >
                      <option value="">-- Choose Stock Item --</option>
                      {stockItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.make ? `${item.make} ${item.model || ''}` : (item.description || 'Inventory Item')} - {item.vin || item.rego || item.id.slice(0, 8)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="wh-light-form-lbl">Document Template</label>
                  <select value={docType} onChange={e => setDocType(e.target.value)} className="wh-light-select w-full">
                    <option>Outbound Manifest</option>
                    <option>Consignment Note (CMR)</option>
                    <option>Inbound Putaway Slip</option>
                    <option>Warehouse Picking List</option>
                    <option>Bill of Lading (BOL)</option>
                  </select>
                </div>

                <div>
                  <label className="wh-light-form-lbl">Order / Shipment Reference</label>
                  <input
                    type="text"
                    value={docOrderRef}
                    onChange={e => setDocOrderRef(e.target.value)}
                    className="wh-light-form-input"
                  />
                </div>

                <div>
                  <label className="wh-light-form-lbl">Logistics Carrier</label>
                  <select value={docCarrier} onChange={e => setDocCarrier(e.target.value)} className="wh-light-select w-full">
                    <option>FedEx Logistics</option>
                    <option>DHL Express</option>
                    <option>Linfox Toll</option>
                    <option>DB Schenker</option>
                  </select>
                </div>

                <div>
                  <label className="wh-light-form-lbl">Destination Address</label>
                  <input
                    type="text"
                    value={docDestination}
                    onChange={e => setDocDestination(e.target.value)}
                    className="wh-light-form-input"
                  />
                </div>

                <div>
                  <label className="wh-light-form-lbl">Operator Notes</label>
                  <textarea
                    value={docNotes}
                    onChange={e => setDocNotes(e.target.value)}
                    className="wh-light-form-input"
                    style={{ height: 60, padding: '6px 10px', resize: 'none' }}
                  />
                </div>
              </div>

              <button className="wh-btn-batch-yellow justify-center mt-4" onClick={handleCreateDocument}>
                <Plus size={14} />
                <span>Generate & Preview Document</span>
              </button>
            </div>
          </div>

          {/* Live Mock Invoice Preview */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="wh-light-card flex-1">
              <div className="wh-card-num-title justify-between">
                <span>📄 DOCUMENT LIVE PREVIEW</span>
                <span className="text-[10px] text-slate-400 font-bold">Paper Size: A4 Standard</span>
              </div>

              <div className="wh-document-mock-paper flex-1">
                <div style={{ borderBottom: '2px solid #0F172A', paddingBottom: 6, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <strong>HERO OPERATING SYSTEM</strong>
                  <span>REF: {docOrderRef}</span>
                </div>
                <div><strong>DOCUMENT TYPE:</strong> {docType.toUpperCase()}</div>
                <div><strong>CARRIER:</strong> {docCarrier}</div>
                <div><strong>DESTINATION:</strong> {docDestination}</div>
                <div><strong>DATE:</strong> {new Date().toLocaleDateString()}</div>
                <div style={{ margin: '12px 0', border: '1px dashed #CBD5E1', padding: 6 }}>
                  <strong>ITEMIZED CARGO SUMMARY:</strong>
                  {selectedStockItem ? (
                    <div>
                      - {selectedStockItem.vin || selectedStockItem.stockRef || 'N/A'}: {selectedStockItem.make ? `${selectedStockItem.make} ${selectedStockItem.model || ''}` : 'Inventory Item'} ({selectedStockItem.vehicleType || 'Vehicle'})
                      <div>Location: {selectedStockItem.zone || 'Yard'} / {selectedStockItem.row || '-'} / {selectedStockItem.bay || '-'}</div>
                      <div>Status: {selectedStockItem.stockStatus || 'IN_STORAGE'}</div>
                    </div>
                  ) : (
                    <>
                      <div>- PLT-908A: HEAVY INDUSTRIAL STEEL COILS (2 UNITS) - 1,420kg</div>
                      <div>- PLT-441B: AUTOMOTIVE GEARBOX SPARES (6 UNITS) - 480kg</div>
                    </>
                  )}
                </div>
                <div><strong>OPERATOR NOTES:</strong> {docNotes}</div>
                <div style={{ marginTop: 24, fontSize: 8, color: '#64748B', textAlign: 'center' }}>
                  SYSTEM GENERATED DISPATCH MANIFEST. STAGED AT DOCK LANE 2.
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-3">
                <button className="wh-light-filter-btn" onClick={() => showToast('Opening Layout Editor')}>
                  <Edit3 size={13} /> Edit Layout
                </button>
                <button className="wh-btn-batch-yellow" onClick={() => showToast('✓ Document sent to LaserJet Printer')}>
                  <Printer size={13} /> Print Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 3: QR SCANNER
          ============================================================ */}
      {activeTab === 'qr-scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Scanner Viewfinder Box */}
          <div className="lg:col-span-6">
            <div className="wh-light-card justify-between">
              <div>
                <div className="wh-card-num-title">
                  <span className="wh-badge-num">1</span>
                  <span>QR / BARCODE VIEWPORT CAMERA</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Simulate pointing a mobile scanner or forklift tablet terminal camera at a barcode.</p>

                <div className="wh-scanner-viewport mb-4">
                  {scanning && <div className="wh-scanner-laser" />}
                  <QrCode size={48} className={`text-slate-400 ${scanning ? 'animate-pulse text-amber-500' : ''}`} />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">
                    {scanning ? 'SCANNING CORE...' : 'CAMERA ENGINE ONLINE'}
                  </span>
                </div>

                <div>
                  <label className="wh-light-form-lbl">Select Simulated Target</label>
                  {loadingStock ? (
                    <div className="text-xs text-slate-500">Loading stock barcodes...</div>
                  ) : stockItems.length === 0 ? (
                    <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                      ⚠️ No active stock in database to scan.
                    </div>
                  ) : (
                    <select value={simulatedScanTarget} onChange={e => setSimulatedScanTarget(e.target.value)} className="wh-light-select w-full">
                      <option value="">-- Choose Stock Barcode to Scan --</option>
                      {stockItems.map(item => {
                        const actualVal = (item.vin && item.vin !== '-') ? item.vin : ((item.rego && item.rego !== '-') ? item.rego : item.id);
                        const displayId = (item.vin && item.vin !== '-') ? item.vin : ((item.rego && item.rego !== '-') ? item.rego : item.id.slice(0, 8));
                        return (
                          <option key={item.id} value={actualVal}>
                            {item.make ? `${item.make} ${item.model || ''}` : (item.description || 'Inventory Item')} ({displayId})
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
              </div>

              <button className="wh-btn-batch-yellow justify-center mt-4" onClick={handleSimulateScan} disabled={scanning}>
                <Zap size={14} />
                <span>{scanning ? 'Reading Barcode...' : 'Trigger Simulated Barcode Scan'}</span>
              </button>
            </div>
          </div>

          {/* Decoded Item Metadata Output */}
          <div className="lg:col-span-6">
            <div className="wh-light-card">
              <div className="wh-card-num-title">
                <span className="wh-badge-num">2</span>
                <span>DECODED METADATA / STOCK DETAILS</span>
              </div>

              {scanResult ? (
                <div className="space-y-3 flex-1 justify-between flex flex-col">
                  <div className="space-y-2.5">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-8 flex justify-between items-center">
                      <div>
                        <div className="text-[9px] font-extrabold text-slate-500 uppercase">IDENTIFIER / SKU</div>
                        <div className="text-sm font-black text-slate-900">{scanResult.code}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-extrabold text-[10.5px] border border-emerald-200">
                        {scanResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-8">
                        <div className="text-[9px] font-extrabold text-slate-500 uppercase">NAME / CATEGORY</div>
                        <div className="text-xs font-black text-slate-800 mt-0.5">{scanResult.name}</div>
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-8">
                        <div className="text-[9px] font-extrabold text-slate-500 uppercase">ZONE / BIN SLOT</div>
                        <div className="text-xs font-black text-blue-600 mt-0.5">{scanResult.zone}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-slate-50 border border-slate-200 rounded-8 text-center">
                        <div className="text-[8px] font-extrabold text-slate-500 uppercase">STOCK QTY</div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">{scanResult.qty}</div>
                      </div>
                      <div className="p-2 bg-slate-50 border border-slate-200 rounded-8 text-center">
                        <div className="text-[8px] font-extrabold text-slate-500 uppercase">WEIGHT</div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">{scanResult.weight}</div>
                      </div>
                      <div className="p-2 bg-slate-50 border border-slate-200 rounded-8 text-center">
                        <div className="text-[8px] font-extrabold text-slate-500 uppercase">DIMENSIONS</div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">{scanResult.dimensions}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                    <button className="wh-light-filter-btn" onClick={() => showToast('Opening movement logs...')}>
                      <Activity size={13} /> Audit Trails
                    </button>
                    <button className="wh-btn-batch-yellow" onClick={() => showToast(`Moving ${scanResult.code} to new zone...`)}>
                      <RefreshCw size={13} /> Relocate Stock
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Awaiting scan trigger. Select a simulated target on the left.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 4: IMPORT / EXPORT
          ============================================================ */}
      {activeTab === 'import-export' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* CSV Import */}
          <div className="lg:col-span-6">
            <div className="wh-light-card justify-between">
              <div>
                <div className="wh-card-num-title">
                  <span className="wh-badge-num">1</span>
                  <span>BULK DATA CSV / EXCEL UPLOAD</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Upload multiple barcodes, new SKU catalogs, or transfer instructions in bulk.</p>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="wh-light-form-lbl">Import Target Schema</label>
                    <select value={importSchema} onChange={e => setImportSchema(e.target.value)} className="wh-light-select w-full">
                      <option>Stock Inventory</option>
                      <option>SKU Catalog List</option>
                      <option>Bin / Rack Location Map</option>
                      <option>Inbound Invoices</option>
                    </select>
                  </div>

                  <div className="wh-file-dropzone" onClick={() => document.getElementById('csv-file-picker').click()}>
                    <input
                      type="file"
                      id="csv-file-picker"
                      className="hidden"
                      accept=".csv, .xlsx"
                      onChange={handleImportFileChange}
                    />
                    <FileSpreadsheet size={36} className="text-slate-400 mx-auto mb-2" />
                    {importFile ? (
                      <p className="text-xs font-bold text-slate-900">{importFile.name}</p>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-slate-700">Drag & Drop CSV / Excel sheet here</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Maximum file size: 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button className="wh-btn-batch-yellow justify-center" onClick={handleExecuteImport} disabled={importing}>
                <Upload size={14} />
                <span>{importing ? 'Processing Sheets...' : 'Upload & Parse Batch Data'}</span>
              </button>
            </div>
          </div>

          {/* Master Exports */}
          <div className="lg:col-span-6">
            <div className="wh-light-card">
              <div className="wh-card-num-title">
                <span className="wh-badge-num">2</span>
                <span>MASTER DATASETS EXPORT HUBS</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Download complete logs and sheets for warehouse activity audit verification.</p>

              <div className="space-y-2.5 flex-1">
                {[
                  { name: 'Full Stock Catalog Sheet', count: '14,250 items', size: '2.4 MB' },
                  { name: 'Yard & Dock Occupancy Map', count: '8 active zones', size: '340 KB' },
                  { name: 'Outbound Load Lanes Logs', count: '799 dispatched loads', size: '1.2 MB' },
                  { name: 'Safety Certification Records', count: '142 audits completed', size: '920 KB' }
                ].map((exp, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-8 flex justify-between items-center">
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">{exp.name}</div>
                      <div className="text-[9.5px] text-slate-400 font-semibold">{exp.count} • Size: {exp.size}</div>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="wh-light-filter-btn px-2 py-1 text-[10.5px]" onClick={() => showToast(`Exporting ${exp.name} in CSV format`)}>
                        <Download size={11} /> CSV
                      </button>
                      <button className="wh-light-filter-btn px-2 py-1 text-[10.5px]" onClick={() => showToast(`Exporting ${exp.name} in XLSX format`)}>
                        <FileSpreadsheet size={11} /> Excel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 5: BATCH PRINTING
          ============================================================ */}
      {activeTab === 'batch-printing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Print Spooler Queue */}
          <div className="lg:col-span-8">
            <div className="wh-light-card justify-between">
              <div>
                <div className="wh-card-num-title justify-between">
                  <span className="flex items-center gap-2">
                    <Printer size={16} className="text-amber-600" />
                    <span>BATCH PRINT SPOOLER QUEUE</span>
                  </span>
                  <div className="flex gap-2">
                    <button 
                      className={`wh-light-filter-btn px-2.5 py-1 text-[10px] ${spoolerPaused ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold' : ''}`} 
                      onClick={handlePauseQueue}
                    >
                      {spoolerPaused ? '▶ Resume Spooler' : '⏸ Pause Spooler'}
                    </button>
                    <button className="wh-light-filter-btn px-2 py-1 text-[10px] text-red-600 border-red-200 hover:bg-red-50" onClick={handleClearCompletedJobs}>
                      Clear Completed
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="wh-light-table">
                    <thead>
                      <tr>
                        <th>JOB ID</th>
                        <th>JOB NAME</th>
                        <th>TARGET PRINTER</th>
                        <th>TOTAL PAGES/LABELS</th>
                        <th>QUEUE STATUS</th>
                        <th style={{ textAlign: 'right' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchQueue.map((job, idx) => (
                        <tr key={idx}>
                          <td className="font-black text-slate-900">{job.id}</td>
                          <td className="font-extrabold text-slate-800">{job.name}</td>
                          <td className="font-medium text-slate-600">{job.printer}</td>
                          <td className="font-bold text-slate-700">{job.count}</td>
                          <td>
                            <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] ${job.status.includes('Printing') ? 'bg-amber-100 text-amber-800 animate-pulse' : job.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : job.status === 'Paused' ? 'bg-slate-200 text-slate-700' : 'bg-blue-50 text-blue-700'}`}>
                              {job.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="p-1 text-slate-400 hover:text-red-600" onClick={() => { setBatchQueue(batchQueue.filter(j => j.id !== job.id)); showToast(`Cancelled print job ${job.id}`); }}>
                              <X size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-3 flex-wrap gap-2">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${spoolerPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-ping'}`} />
                  Print Engine Queue Status: <strong>{spoolerPaused ? 'Paused' : 'Active'} ({spoolerActiveCount} Labels Left)</strong>
                </span>
                <button className="wh-btn-batch-yellow" onClick={handleResumeSpoolerJobs}>
                  <Printer size={13} /> Resume Spooler Jobs
                </button>
              </div>
            </div>
          </div>

          {/* Printer Network Status */}
          <div className="lg:col-span-4">
            <div className="wh-light-card">
              <div className="wh-card-num-title">
                <span>📡 NETWORKED THERMAL PRINTERS</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">View active status of labels printers connected on the local warehouse network.</p>

              <div className="space-y-3">
                {[
                  { name: 'Zebra ZD421 (Office)', ip: '192.168.1.25', status: 'Online', color: 'bg-emerald-500' },
                  { name: 'Zebra ZT411 (Dock A)', ip: '192.168.1.30', status: 'Idle', color: 'bg-blue-500' },
                  { name: 'HP LaserJet Pro (Billing)', ip: '192.168.1.15', status: 'Offline', color: 'bg-rose-500' }
                ].map((prn, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 rounded-8 flex justify-between items-center bg-slate-50">
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">{prn.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold">IP: {prn.ip}</div>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <span className={`w-2.5 h-2.5 rounded-full ${prn.color}`} />
                      {prn.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8,
          padding: '12px 18px', display: 'flex', items: 'center', gap: 10,
          zIndex: 99998, boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          fontSize: 12, fontWeight: 800, color: '#065F46'
        }}>
          <Check size={16} className="text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
