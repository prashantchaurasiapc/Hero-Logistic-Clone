import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWarehouseData,
  addWarehouseInventory,
  updateWarehouseInventory,
  fetchInventoryMovements,
  fetchWarehouseAssets
} from '../store/slices/warehouseSlice';
import {
  Plus, Check, Trash2, Edit2, QrCode, Move, CheckSquare,
  AlertTriangle, Activity, List, Download, MapPin, Printer, RefreshCw, X
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { createPortal } from 'react-dom';
import Inbound from './Inbound';
import Outbound from './Outbound';
import CurrentStock from './CurrentStock';
import WarehouseMap from './WarehouseMap';
import LoadLane from './LoadLane';
import Holding from './Holding';
import Scanning from './Scanning';
import Labels from './Labels';
import Movements from './Movements';
import Reports from './Reports';

// ==========================================
// LOCAL SELF-CONTAINED REUSABLE UI ELEMENTS
// ==========================================

function LocalModal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 h-screen max-h-screen z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      ></div>
 
      {/* Modal Dialog Content */}
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl relative z-10 animate-fade-in overflow-hidden flex flex-col max-h-full md:max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 transition-all cursor-pointer focus:outline-none"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
 
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

function LocalDrawer({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 h-screen max-h-screen z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 transition-opacity" onClick={onClose}></div>

      {/* Drawer Container */}
      <div className="bg-white border-l border-slate-200 h-full w-full max-w-md shadow-2xl relative z-10 animate-slide-in-right overflow-y-auto p-5 text-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-all cursor-pointer">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

function LocalTextInput({ label, required, placeholder, value, onChange, type = "text" }) {
  return (
    <div className="space-y-1.5 text-left w-full">
      {label && (
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 text-xs rounded-xl focus:border-brand-600 focus:ring-1 focus:ring-brand-650 focus:outline-none transition-all duration-200"
      />
    </div>
  );
}

function LocalSelectInput({ label, required, value, onChange, options = [] }) {
  return (
    <div className="space-y-1.5 text-left w-full">
      {label && (
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 text-xs rounded-xl focus:border-brand-600 focus:ring-1 focus:ring-brand-650 focus:outline-none cursor-pointer transition-all duration-200"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function LocalSearchInput({ value, onChange, onClear, placeholder, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs rounded-xl focus:border-brand-600 focus:outline-none transition-all duration-200"
      />
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      {value && (
        <button onClick={onClear} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function LocalStatCard({ title, value, description, progress = null, trend = null, trendDirection = 'up' }) {
  const trendColors = {
    up: 'text-emerald-500',
    down: 'text-red-500',
    neutral: 'text-slate-500'
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left relative overflow-hidden flex flex-col justify-between shadow-xs">
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
          {title}
        </span>
        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </h4>
      </div>

      <div className="mt-4 space-y-2">
        {progress !== null && (
          <div className="space-y-1">
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div 
                className="h-full rounded-full transition-all duration-350"
                style={{ width: `${progress}%`, backgroundColor: '#FFD400' }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-semibold font-mono">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
          <span className="truncate">{description}</span>
          {trend && (
            <span className={`font-bold font-mono ${trendColors[trendDirection]}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function LocalTable({ columns, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs italic">
        No stock records found matching filters.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto w-full border border-slate-200 rounded-xl bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
        <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 font-extrabold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="hover:bg-slate-50/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-3.5 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LocalStatusBadge({ status }) {
  const styles = {
    Stowed: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
    Assigned: 'bg-blue-50 text-blue-700 border border-blue-200/50',
    Ready: 'bg-amber-50 text-amber-700 border border-amber-200/50',
    Staged: 'bg-amber-50 text-amber-700 border border-amber-200/50',
    Inwarded: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
    Dispatched: 'bg-slate-50 text-slate-600 border border-slate-200/50',
    Missing: 'bg-rose-50 text-rose-700 border border-rose-200/50',
    Printed: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
    Pending: 'bg-amber-50 text-amber-700 border border-amber-200/50',
    Failed: 'bg-rose-50 text-rose-700 border border-rose-200/50',
    Reprinted: 'bg-blue-50 text-blue-700 border border-blue-200/50'
  };
  return (
    <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-lg border ${styles[status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {status}
    </span>
  );
}

function LocalToast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-rose-50 text-rose-800 border-rose-200'
  };

  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 shadow-xl ${typeStyles[type]}`}>
      <span className="text-xs font-bold">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ==========================================
// MAIN WAREHOUSE COMPONENT IMPLEMENTATION
// ==========================================

export default function Dashboard({ activeTab = 'overview' }) {
  const dispatch = useDispatch();
  const { occupancy, scansCount, crossDockCount, loading } = useSelector((state) => state.warehouse);

  // Logistics Niche View State
  const [logisticsMode, setLogisticsMode] = useState('car_carrying'); // car_carrying or general_freight

  // Toasts
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Modals & Drawers
  const [addLocationModalOpen, setAddLocationModalOpen] = useState(false);
  const [addHoldingAreaModalOpen, setAddHoldingAreaModalOpen] = useState(false);
  const [addLoadLaneModalOpen, setAddLoadLaneModalOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [manualEntryModalOpen, setManualEntryModalOpen] = useState(false);
  const [relocateModalOpen, setRelocateModalOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [movementDrawerOpen, setMovementDrawerOpen] = useState(false);

  // Map settings state
  const [locations, setLocations] = useState([
    { id: 'LOC-1', name: 'Bay 1', type: 'Bay', category: 'Car Yard' },
    { id: 'LOC-2', name: 'Bay 2', type: 'Bay', category: 'Car Yard' },
    { id: 'LOC-3', name: 'Bay 3', type: 'Bay', category: 'Car Yard' },
    { id: 'LOC-4', name: 'Holding Area A', type: 'Holding Area', category: 'Both' },
    { id: 'LOC-5', name: 'Holding Area B', type: 'Holding Area', category: 'Both' },
    { id: 'LOC-6', name: 'Lane A1', type: 'Load Lane', category: 'Both' },
    { id: 'LOC-7', name: 'Lane A2', type: 'Load Lane', category: 'Both' },
    { id: 'LOC-8', name: 'Lane C3', type: 'Load Lane', category: 'Both' },
    { id: 'LOC-9', name: 'Aisle 1 - Bin B', type: 'Aisle/Bin', category: 'Freight' },
    { id: 'LOC-10', name: 'Aisle 2 - Bin A', type: 'Aisle/Bin', category: 'Freight' },
    { id: 'LOC-11', name: 'Aisle 4 - Bin C', type: 'Aisle/Bin', category: 'Freight' }
  ]);

  // Asset Mock Database
  const [carStock, setCarStock] = useState([
    { id: 'CAR-1', vin: 'VIN-7YV1HP82A81920', rego: 'QLD-88A', stockNo: 'STK-4401', model: 'Toyota Hilux Double-Cab', location: 'Bay 3', lane: 'Lane A1', destination: 'Brisbane Port', customer: 'Toyota Australia', status: 'Stowed' },
    { id: 'CAR-2', vin: 'VIN-3YV1HP52X81254', rego: 'NSW-99B', stockNo: 'STK-4402', model: 'Mitsubishi Triton GLX', location: 'Holding Area B', lane: 'Lane A2', destination: 'Sydney Depot', customer: 'NSW Fleet Services', status: 'Assigned' },
    { id: 'CAR-3', vin: 'VIN-5YV1HP12Z83951', rego: 'VIC-44C', stockNo: 'STK-4403', model: 'Ford Ranger Wildtrak', location: 'Bay 1', lane: 'Unassigned', destination: 'Melbourne Yard', customer: 'Express Auto', status: 'Stowed' },
    { id: 'CAR-4', vin: 'VIN-8ZV9HK21W92110', rego: 'WA-55D', stockNo: 'STK-4404', model: 'Hyundai i30 Active', location: 'Holding Area A', lane: 'Lane C3', destination: 'Perth Hub', customer: 'Hertz Rental WA', status: 'Ready' }
  ]);

  const [freightStock, setFreightStock] = useState([
    { id: 'FR-1', itemNo: 'ITM-9011', palletCount: 15, weight: '14,200 lbs', dimensions: '1.2m x 1.2m x 1.5m', barcode: 'BAR-9011283', zone: 'Zone A (Dry)', aisleBin: 'Aisle 4 - Bin C', customer: 'Global Retail Corp', destination: 'Chicago HQ Terminal', status: 'Inwarded' },
    { id: 'FR-2', itemNo: 'ITM-4491', palletCount: 8, weight: '4,500 lbs', dimensions: '1.2m x 1.2m x 1.8m', barcode: 'BAR-4491028', zone: 'Zone B (Cold)', aisleBin: 'Aisle 2 - Bin A', customer: 'Vance Refrigeration', destination: 'Dallas Depot Terminal', status: 'Staged' },
    { id: 'FR-3', itemNo: 'ITM-1022', palletCount: 6, weight: '9,800 lbs', dimensions: '1.1m x 1.1m x 1.2m', barcode: 'BAR-1022384', zone: 'Zone C (Hazard)', aisleBin: 'Aisle 1 - Bin B', customer: 'Memphis Shippers Inc', destination: 'Sydney Port Terminal', status: 'Inwarded' }
  ]);

  const [inboundData, setInboundData] = useState([
    { id: 'INB-9022', carrier: 'Toll Express', cargo: '12 Pallets Retail Goods', lane: 'Lane A1' },
    { id: 'INB-9023', carrier: 'Apex Logistics', cargo: '3 Toyota Hilux vehicles', lane: 'Lane A2' }
  ]);

  const [outboundData, setOutboundData] = useState([
    { id: 'OUT-4011', carrier: 'K&N Hauliers', cargo: '8 Pallets Reefers', lane: 'Lane C3' }
  ]);

  // Selected items state
  const [selectedCarId, setSelectedCarId] = useState('CAR-1');
  const [selectedFreightId, setSelectedFreightId] = useState('FR-1');

  // Form states
  const [newLocName, setNewLocName] = useState('');
  const [newLocType, setNewLocType] = useState('Bay');

  // Manual Entry States
  const [manualVin, setManualVin] = useState('');
  const [manualRego, setManualRego] = useState('');
  const [manualStockNo, setManualStockNo] = useState('');
  const [manualModel, setManualModel] = useState('');
  const [manualLocation, setManualLocation] = useState('Bay 1');
  const [manualLane, setManualLane] = useState('Unassigned');
  const [manualDest, setManualDest] = useState('');
  const [manualCust, setManualCust] = useState('');

  const [manualItemNo, setManualItemNo] = useState('');
  const [manualPalletCount, setManualPalletCount] = useState(1);
  const [manualWeight, setManualWeight] = useState('');
  const [manualDim, setManualDim] = useState('');
  const [manualBarcode, setManualBarcode] = useState('');
  const [manualZone, setManualZone] = useState('Zone A (Dry)');
  const [manualBin, setManualBin] = useState('Aisle 1 - Bin B');

  // Relocation State
  const [relocationTarget, setRelocationTarget] = useState('Bay 1');

  // Scanner Simulator States
  const [scannerAction, setScannerAction] = useState('Barcode'); // Barcode, Scan In, Scan Out, QR
  const [scannerInput, setScannerInput] = useState('');

  // History Log States
  const [assetHistory, setAssetHistory] = useState([
    { id: 'H-1', itemId: 'CAR-1', action: 'Stowed to Bay 3', user: 'Adam K. (Yard Manager)', time: '06/26/2026 11:20 AM' },
    { id: 'H-2', itemId: 'CAR-1', action: 'Registered independent asset', user: 'System', time: '06/26/2026 09:15 AM' },
    { id: 'H-3', itemId: 'FR-1', action: 'Inwarded to Aisle 4 - Bin C', user: 'Sarah R. (Clerk)', time: '06/26/2026 10:45 AM' }
  ]);

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchWarehouseData());
    dispatch(fetchInventoryMovements());
    dispatch(fetchWarehouseAssets());
  }, [dispatch]);

  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const getSelectedAsset = () => {
    if (logisticsMode === 'car_carrying') {
      return carStock.find(c => c.id === selectedCarId);
    } else {
      return freightStock.find(f => f.id === selectedFreightId);
    }
  };

  const handleAddLocationSubmit = (e) => {
    e.preventDefault();
    if (!newLocName) return;
    const newLoc = {
      id: `LOC-${Date.now().toString().slice(-4)}`,
      name: newLocName,
      type: newLocType,
      category: logisticsMode === 'car_carrying' ? 'Car Yard' : 'Freight'
    };
    setLocations([...locations, newLoc]);
    setNewLocName('');
    setAddLocationModalOpen(false);
    setAddHoldingAreaModalOpen(false);
    setAddLoadLaneModalOpen(false);
    triggerToast(`New location "${newLocName}" added to the map.`);
  };

  const handleManualEntrySubmit = (e) => {
    e.preventDefault();
    if (logisticsMode === 'car_carrying') {
      if (!manualVin || !manualModel) {
        triggerToast('VIN and Model are required.', 'error');
        return;
      }
      const newCar = {
        id: `CAR-${Date.now().toString().slice(-4)}`,
        vin: manualVin.toUpperCase(),
        rego: manualRego.toUpperCase() || 'N/A',
        stockNo: manualStockNo || `STK-${Date.now().toString().slice(-4)}`,
        model: manualModel,
        location: manualLocation,
        lane: manualLane,
        destination: manualDest || 'Pending',
        customer: manualCust || 'Independent Asset',
        status: 'Stowed'
      };
      setCarStock([newCar, ...carStock]);
      setSelectedCarId(newCar.id);

      // Log movement history
      const newLog = {
        id: `H-${Date.now()}`,
        itemId: newCar.id,
        action: `Registered independent vehicle & stowed to ${manualLocation}`,
        user: 'Adam K. (Yard Manager)',
        time: new Date().toLocaleString()
      };
      setAssetHistory([newLog, ...assetHistory]);

      triggerToast(`Vehicle ${manualModel} registered as independent asset.`);
    } else {
      if (!manualItemNo || !manualBarcode) {
        triggerToast('Item No and Barcode are required.', 'error');
        return;
      }
      const newFreight = {
        id: `FR-${Date.now().toString().slice(-4)}`,
        itemNo: manualItemNo.toUpperCase(),
        palletCount: parseInt(manualPalletCount) || 1,
        weight: manualWeight || '0 lbs',
        dimensions: manualDim || 'Standard',
        barcode: manualBarcode,
        zone: manualZone,
        aisleBin: manualBin,
        customer: manualCust || 'Independent Cargo',
        destination: manualDest || 'Pending',
        status: 'Inwarded'
      };
      setFreightStock([newFreight, ...freightStock]);
      setSelectedFreightId(newFreight.id);

      const newLog = {
        id: `H-${Date.now()}`,
        itemId: newFreight.id,
        action: `Inwarded general freight cargo to ${manualBin}`,
        user: 'Adam K. (Yard Manager)',
        time: new Date().toLocaleString()
      };
      setAssetHistory([newLog, ...assetHistory]);

      triggerToast(`Freight SKU ${manualItemNo} received as independent asset.`);
    }

    // Reset forms
    setManualVin(''); setManualRego(''); setManualStockNo(''); setManualModel(''); setManualDest(''); setManualCust('');
    setManualItemNo(''); setManualWeight(''); setManualDim(''); setManualBarcode('');
    setManualEntryModalOpen(false);
  };

  const handleMoveAsset = (e) => {
    e.preventDefault();
    const asset = getSelectedAsset();
    if (!asset) return;

    if (logisticsMode === 'car_carrying') {
      setCarStock(carStock.map(c => c.id === asset.id ? { ...c, location: relocationTarget } : c));
    } else {
      setFreightStock(freightStock.map(f => f.id === asset.id ? { ...f, aisleBin: relocationTarget } : f));
    }

    const newLog = {
      id: `H-${Date.now()}`,
      itemId: asset.id,
      action: `Moved asset location to ${relocationTarget}`,
      user: 'Adam K. (Yard Manager)',
      time: new Date().toLocaleString()
    };
    setAssetHistory([newLog, ...assetHistory]);

    setRelocateModalOpen(false);
    triggerToast(`Asset ${asset.id} relocated to ${relocationTarget}.`);
  };

  const handleDirectMoveToHolding = (item = null) => {
    const asset = item || getSelectedAsset();
    if (!asset) return;
    const targetHolding = logisticsMode === 'car_carrying' ? 'Holding Area A' : 'Zone A (Dry)';

    if (logisticsMode === 'car_carrying') {
      setCarStock(carStock.map(c => c.id === asset.id ? { ...c, location: targetHolding } : c));
    } else {
      setFreightStock(freightStock.map(f => f.id === asset.id ? { ...f, aisleBin: targetHolding } : f));
    }

    const newLog = {
      id: `H-${Date.now()}`,
      itemId: asset.id,
      action: `Moved to holding area: ${targetHolding}`,
      user: 'Adam K. (Yard Manager)',
      time: new Date().toLocaleString()
    };
    setAssetHistory([newLog, ...assetHistory]);
    triggerToast(`Asset moved to holding area: ${targetHolding}.`);
  };

  const handleDirectMoveToLane = (item = null) => {
    const asset = item || getSelectedAsset();
    if (!asset) return;
    const targetLane = 'Lane A1';

    if (logisticsMode === 'car_carrying') {
      setCarStock(carStock.map(c => c.id === asset.id ? { ...c, location: targetLane, lane: targetLane } : c));
    } else {
      setFreightStock(freightStock.map(f => f.id === asset.id ? { ...f, aisleBin: targetLane } : f));
    }

    const newLog = {
      id: `H-${Date.now()}`,
      itemId: asset.id,
      action: `Moved to load lane: ${targetLane}`,
      user: 'Adam K. (Yard Manager)',
      time: new Date().toLocaleString()
    };
    setAssetHistory([newLog, ...assetHistory]);
    triggerToast(`Asset spotted to load lane: ${targetLane}.`);
  };

  const handleAssignToLane = (item = null) => {
    const asset = item || getSelectedAsset();
    if (!asset) return;
    const targetLane = 'Lane C3';

    if (logisticsMode === 'car_carrying') {
      setCarStock(carStock.map(c => c.id === asset.id ? { ...c, lane: targetLane, status: 'Ready' } : c));
    } else {
      setFreightStock(freightStock.map(f => f.id === asset.id ? { ...f, status: 'Staged' } : f));
    }

    const newLog = {
      id: `H-${Date.now()}`,
      itemId: asset.id,
      action: `Assigned load lane routing: ${targetLane}`,
      user: 'Adam K. (Yard Manager)',
      time: new Date().toLocaleString()
    };
    setAssetHistory([newLog, ...assetHistory]);
    triggerToast(`Asset assigned to load lane ${targetLane} queue.`);
  };

  const handlePrintLabel = (reprint = false, item = null) => {
    const asset = item || getSelectedAsset();
    if (!asset) {
      triggerToast('No asset selected to print label for.', 'error');
      return;
    }
    const labelCode = asset.vin || asset.barcode || asset.id;
    triggerToast(`${reprint ? 'Reprinted' : 'Printed'} Zebra barcode tag: ${labelCode}`);
  };

  const handleReportMissing = (item = null) => {
    const asset = item || getSelectedAsset();
    if (!asset) return;

    if (logisticsMode === 'car_carrying') {
      setCarStock(carStock.map(c => c.id === asset.id ? { ...c, status: 'Missing' } : c));
    } else {
      setFreightStock(freightStock.map(f => f.id === asset.id ? { ...f, status: 'Missing' } : f));
    }

    const newLog = {
      id: `H-${Date.now()}`,
      itemId: asset.id,
      action: `FLAGGED MISSING`,
      user: 'Adam K. (Yard Manager)',
      time: new Date().toLocaleString()
    };
    setAssetHistory([newLog, ...assetHistory]);
    triggerToast(`Asset ${asset.id} reported missing! Incident ticket dispatched to supervisor.`, 'error');
  };

  const handleScannerSimulation = (e) => {
    e.preventDefault();
    if (!scannerInput) return;

    // Check if it's an Inbound Receipt ID
    const inboundMatch = inboundData.find(i => i.id.toLowerCase() === scannerInput.toLowerCase());
    if (inboundMatch) {
      // Remove from inbound staging queue
      setInboundData(inboundData.filter(i => i.id !== inboundMatch.id));

      // Ingest as a new asset into stock
      if (logisticsMode === 'car_carrying') {
        const newCar = {
          id: `CAR-${Date.now().toString().slice(-4)}`,
          vin: `VIN-${Date.now().toString().slice(-6)}`,
          rego: 'QLD-TBA',
          stockNo: `STK-${Date.now().toString().slice(-4)}`,
          model: inboundMatch.id === 'INB-9023' ? 'Toyota Hilux Double-Cab' : 'Imported Passenger SUV',
          location: 'Bay 1',
          lane: inboundMatch.lane || 'Unassigned',
          destination: 'Yard Stowed',
          customer: inboundMatch.carrier || 'Inbound Carrier',
          status: 'Stowed'
        };
        setCarStock([newCar, ...carStock]);
        setSelectedCarId(newCar.id);
        
        // Log movement history
        const newLog = {
          id: `H-${Date.now()}`,
          itemId: newCar.id,
          action: `Scan Inward: Received from Inbound Staging (${inboundMatch.id})`,
          user: 'Adam K. (Yard Manager)',
          time: new Date().toLocaleString()
        };
        setAssetHistory([newLog, ...assetHistory]);
      } else {
        const newFreight = {
          id: `FR-${Date.now().toString().slice(-4)}`,
          itemNo: `ITM-${Date.now().toString().slice(-4)}`,
          palletCount: 12,
          weight: '8,500 lbs',
          dimensions: 'Standard Pallets',
          barcode: `BAR-${Date.now().toString().slice(-4)}`,
          zone: 'Zone A (Dry)',
          aisleBin: 'Aisle 1 - Bin B',
          customer: inboundMatch.carrier || 'Inbound Carrier',
          destination: 'Staged',
          status: 'Inwarded'
        };
        setFreightStock([newFreight, ...freightStock]);
        setSelectedFreightId(newFreight.id);
        
        // Log movement history
        const newLog = {
          id: `H-${Date.now()}`,
          itemId: newFreight.id,
          action: `Scan Inward: Received from Inbound Staging (${inboundMatch.id})`,
          user: 'Adam K. (Yard Manager)',
          time: new Date().toLocaleString()
        };
        setAssetHistory([newLog, ...assetHistory]);
      }
      
      triggerToast(`Scan Inward completed. Staged asset from ${inboundMatch.id} into stock.`);
      setScannerInput('');
      setScannerModalOpen(false);
      return;
    }

    // Check if it's an Outbound Receipt ID
    const outboundMatch = outboundData.find(o => o.id.toLowerCase() === scannerInput.toLowerCase());
    if (outboundMatch) {
      // Remove from outbound staging queue
      setOutboundData(outboundData.filter(o => o.id !== outboundMatch.id));

      // Update state in main inventory (if there was an active cargo match, mark it dispatched)
      if (logisticsMode === 'car_carrying') {
        const firstReady = carStock.find(c => c.status === 'Ready' || c.lane === outboundMatch.lane);
        if (firstReady) {
          setCarStock(carStock.map(c => c.id === firstReady.id ? { ...c, status: 'Dispatched', location: 'Gate Outbound' } : c));
        }
      } else {
        const firstStaged = freightStock.find(f => f.status === 'Staged' || f.aisleBin?.includes(outboundMatch.lane));
        if (firstStaged) {
          setFreightStock(freightStock.map(f => f.id === firstStaged.id ? { ...f, status: 'Dispatched', aisleBin: 'Gate Outbound' } : f));
        }
      }

      // Log movement history
      const newLog = {
        id: `H-${Date.now()}`,
        itemId: outboundMatch.id,
        action: `Scan Outward: Loaded & Dispatched via Carrier (${outboundMatch.carrier})`,
        user: 'Adam K. (Yard Manager)',
        time: new Date().toLocaleString()
      };
      setAssetHistory([newLog, ...assetHistory]);

      triggerToast(`Scan Outward completed. Cargo dispatched on carrier trailer.`);
      setScannerInput('');
      setScannerModalOpen(false);
      return;
    }

    // Search matches
    let matchFound = false;
    if (logisticsMode === 'car_carrying') {
      const match = carStock.find(c => c.vin.toLowerCase() === scannerInput.toLowerCase() || c.rego.toLowerCase() === scannerInput.toLowerCase());
      if (match) {
        matchFound = true;
        setSelectedCarId(match.id);

        let newStatus = match.status;
        let newLoc = match.location;
        if (scannerAction === 'Scan In') {
          newStatus = 'Stowed';
          newLoc = 'Bay 1';
        } else if (scannerAction === 'Scan Out') {
          newStatus = 'Dispatched';
          newLoc = 'Gate Outbound';
        }

        setCarStock(carStock.map(c => c.id === match.id ? { ...c, status: newStatus, location: newLoc } : c));
        const newLog = {
          id: `H-${Date.now()}`,
          itemId: match.id,
          action: `${scannerAction} via scanner: ${newLoc} (${newStatus})`,
          user: 'Adam K. (Yard Manager)',
          time: new Date().toLocaleString()
        };
        setAssetHistory([newLog, ...assetHistory]);
      }
    } else {
      const match = freightStock.find(f => f.itemNo.toLowerCase() === scannerInput.toLowerCase() || f.barcode.toLowerCase() === scannerInput.toLowerCase());
      if (match) {
        matchFound = true;
        setSelectedFreightId(match.id);

        let newStatus = match.status;
        let newLoc = match.aisleBin;
        if (scannerAction === 'Scan In') {
          newStatus = 'Inwarded';
          newLoc = 'Aisle 1 - Bin B';
        } else if (scannerAction === 'Scan Out') {
          newStatus = 'Staged';
          newLoc = 'Lane A1';
        }

        setFreightStock(freightStock.map(f => f.id === match.id ? { ...f, status: newStatus, aisleBin: newLoc } : f));
        const newLog = {
          id: `H-${Date.now()}`,
          itemId: match.id,
          action: `${scannerAction} via scanner: ${newLoc} (${newStatus})`,
          user: 'Adam K. (Yard Manager)',
          time: new Date().toLocaleString()
        };
        setAssetHistory([newLog, ...assetHistory]);
      }
    }

    if (matchFound) {
      triggerToast(`Scanner action "${scannerAction}" completed for code: ${scannerInput.toUpperCase()}`);
    } else {
      triggerToast(`No registered asset resolved for barcode "${scannerInput}".`, 'error');
    }
    setScannerInput('');
    setScannerModalOpen(false);
  };

  const handleExportStock = () => {
    const list = logisticsMode === 'car_carrying' ? carStock : freightStock;
    const csvContent = "data:text/csv;charset=utf-8,"
      + (logisticsMode === 'car_carrying'
        ? "VIN,Rego,Stock Number,Model,Location,Lane,Status\n" + list.map(e => `"${e.vin}","${e.rego}","${e.stockNo}","${e.model}","${e.location}","${e.lane}","${e.status}"`).join("\n")
        : "Item No,Pallet Count,Weight,Dimensions,Barcode,Aisle/Bin,Status\n" + list.map(e => `"${e.itemNo}","${e.palletCount}","${e.weight}","${e.dimensions}","${e.barcode}","${e.aisleBin}","${e.status}"`).join("\n"));

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `warehouse_stock_${logisticsMode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Stock database CSV exported successfully.");
  };

  // Filter lists based on search
  const getFilteredList = () => {
    if (logisticsMode === 'car_carrying') {
      return carStock.filter(c =>
        c.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.rego.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.stockNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return freightStock.filter(f =>
        f.itemNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.aisleBin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.customer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  };

  const filteredAssets = getFilteredList();
  const selectedAsset = getSelectedAsset();

  const mockLabels = (logisticsMode === 'car_carrying' ? carStock : freightStock).map((item, index) => {
    const printStatusOptions = ['Printed', 'Pending', 'Failed', 'Reprinted'];
    const printStatus = printStatusOptions[index % printStatusOptions.length];
    return {
      labelId: `LBL-${(index + 100).toString()}`,
      barcode: item.barcode || item.vin,
      vinItem: item.vin || item.itemNo,
      stockNo: item.stockNo || item.palletCount,
      customer: item.customer,
      assetType: logisticsMode === 'car_carrying' ? 'Vehicle' : 'Freight',
      location: item.location || item.aisleBin,
      destination: item.destination,
      generatedDate: new Date().toLocaleDateString(),
      printedBy: 'System Auto',
      printStatus: printStatus,
      printerStatus: printStatus === 'Failed' ? 'Offline' : 'Online',
      originalItem: item
    };
  });

  const filteredLabels = mockLabels.filter(l =>
    l.labelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.vinItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <LocalToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
        </div>
      )}

      {/* Header with Switcher & Operations */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 capitalize">Warehouse & Yard Workspace</h2>
          <p className="text-xs text-slate-500 font-medium">Manage stock allocations, print asset tags, and spot load lanes.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Logistics Niche Toggle */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => { setLogisticsMode('car_carrying'); }}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'car_carrying' ? 'bg-[#FFD400] text-slate-950 font-extrabold shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Car Carrying Yard
            </button>
            <button
              onClick={() => { setLogisticsMode('general_freight'); }}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${logisticsMode === 'general_freight' ? 'bg-[#FFD400] text-slate-950 font-extrabold shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
            >
              General Freight
            </button>
          </div>

          <button
            onClick={() => { setScannerAction('Barcode'); setScannerModalOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xs select-none focus:outline-none"
          >
            <QrCode className="h-4 w-4" />
            <span>Barcode Simulator</span>
          </button>
          
          <button
            onClick={() => setManualEntryModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/10 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xs select-none focus:outline-none"
          >
            <Plus className="h-4 w-4" />
            <span>Manual Entry</span>
          </button>
          
          <button
            onClick={handleExportStock}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black bg-gradient-to-r from-[#FFD400] to-[#FF9A00] text-slate-950 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md select-none hover:shadow-lg focus:outline-none"
          >
            <Download className="h-4 w-4" />
            <span>Export Stock List</span>
          </button>
        </div>
      </div>

      {/* Top statistics overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <LocalStatCard title="Total Stored Assets" value={logisticsMode === 'car_carrying' ? carStock.length : freightStock.length} description="In active yard segregation" trend="+3 new" trendDirection="up" />
            <LocalStatCard title="Occupancy Level" value="78%" description="Segregation capacity" progress={78} />
            <LocalStatCard title="Lanes Spotted" value="5 active" description="Loading bay limits" trend="Normal" trendDirection="neutral" />
            <LocalStatCard title="Pending Dispatches" value="3 Trucks" description="Trailer staging queue" trend="3 ready" trendDirection="neutral" />
          </div>

          {/* Visual Storage capacity occupancy indicators */}
          <div className="glass rounded-2xl p-5 border border-slate-200 text-left grid grid-cols-1 lg:grid-cols-3 gap-6 items-center bg-white shadow-xs">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">Zone Allocations & Limits</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                  <span className="text-[10px] text-emerald-700 font-bold block uppercase tracking-wide">Lane A (Pickup)</span>
                  <strong className="text-emerald-500 text-2xl font-black block mt-1">92%</strong>
                </div>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                  <span className="text-[10px] text-emerald-700 font-bold block uppercase tracking-wide">Lane B (Staging)</span>
                  <strong className="text-emerald-500 text-2xl font-black block mt-1">84%</strong>
                </div>
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center">
                  <span className="text-[10px] text-amber-700 font-bold block uppercase tracking-wide">Holding Areas</span>
                  <strong className="text-amber-500 text-2xl font-black block mt-1">45%</strong>
                </div>
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center">
                  <span className="text-[10px] text-amber-700 font-bold block uppercase tracking-wide">Bunker storage</span>
                  <strong className="text-amber-500 text-2xl font-black block mt-1">15%</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Capacity Allocation</h4>
              <div className="relative w-full h-[150px] flex flex-col justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Lane A', value: 92 },
                        { name: 'Bunker', value: 15 },
                        { name: 'Holding', value: 45 },
                        { name: 'Lane B', value: 84 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                      startAngle={90}
                    >
                      <Cell fill="#0ea0ea" />
                      <Cell fill="#EF4444" />
                      <Cell fill="#F59E0B" />
                      <Cell fill="#10B981" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-[9px] font-bold">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
                  <span className="text-slate-555">Bunker</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                  <span className="text-slate-555">Holding</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#0ea0ea]"></span>
                  <span className="text-slate-555">Lane A</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  <span className="text-slate-555">Lane B</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Stock Tab */}
      {activeTab === 'stock' && (
        <CurrentStock
          logisticsMode={logisticsMode}
          carStock={carStock}
          freightStock={freightStock}
          setSelectedCarId={setSelectedCarId}
          setSelectedFreightId={setSelectedFreightId}
          onMoveClick={() => setRelocateModalOpen(true)}
          onToHoldingClick={handleDirectMoveToHolding}
          onToLaneClick={handleAssignToLane}
          onHistClick={() => setHistoryDrawerOpen(true)}
          onLabelClick={(row) => handlePrintLabel(false, row)}
          onMissingClick={handleReportMissing}
          handleExportStock={handleExportStock}
        />
      )}

      {/* Main Split Layout Workspace (for Yard map tab) */}
      {activeTab === 'yard-map' && (
        <WarehouseMap
          logisticsMode={logisticsMode}
          setLogisticsMode={setLogisticsMode}
          carStock={carStock}
          freightStock={freightStock}
          selectedCarId={selectedCarId}
          setSelectedCarId={setSelectedCarId}
          selectedFreightId={selectedFreightId}
          setSelectedFreightId={setSelectedFreightId}
          locations={locations}
          onAddLocationClick={() => setAddLocationModalOpen(true)}
          onAddHoldingClick={() => setAddHoldingAreaModalOpen(true)}
          onAddLoadLaneClick={() => setAddLoadLaneModalOpen(true)}
          onBarcodeSimulatorClick={() => { setScannerAction('Barcode'); setScannerModalOpen(true); }}
          onManualEntryClick={() => setManualEntryModalOpen(true)}
          onExportStockClick={handleExportStock}
          onMoveClick={() => setRelocateModalOpen(true)}
          onToHoldingClick={handleDirectMoveToHolding}
          onToLaneClick={handleDirectMoveToLane}
          onAssignToLaneClick={handleAssignToLane}
          onPrintLabelClick={(row) => handlePrintLabel(false, row)}
          onHistoryClick={() => setHistoryDrawerOpen(true)}
          onMissingClick={handleReportMissing}
          onMovementHistoryClick={() => setMovementDrawerOpen(true)}
        />
      )}

      {/* Inbound Screen */}
      {activeTab === 'inbound' && (
        <Inbound
          inboundData={inboundData}
          setInboundData={setInboundData}
          onScanInClick={(row) => { setScannerAction('Scan In'); setScannerInput(row.id); setScannerModalOpen(true); }}
          onPrintLabelClick={(row) => handlePrintLabel(false, row)}
        />
      )}

      {/* Outbound Screen */}
      {activeTab === 'outbound' && (
        <Outbound
          outboundData={outboundData}
          setOutboundData={setOutboundData}
          onScanOutClick={(row) => { setScannerAction('Scan Out'); setScannerInput(row.id); setScannerModalOpen(true); }}
          onPrintLabelClick={(row) => handlePrintLabel(true, row)}
        />
      )}

      {/* Load Lanes Screen */}
      {activeTab === 'load-lanes' && (
        <LoadLane
          logisticsMode={logisticsMode}
          onBarcodeSimulatorClick={() => { setScannerAction('Barcode'); setScannerModalOpen(true); }}
          onManualEntryClick={() => setManualEntryModalOpen(true)}
          onExportStockClick={handleExportStock}
          triggerToast={triggerToast}
        />
      )}

      {/* Holding Areas Screen */}
      {activeTab === 'holding-areas' && (
        <Holding
          logisticsMode={logisticsMode}
          onBarcodeSimulatorClick={() => { setScannerAction('Barcode'); setScannerModalOpen(true); }}
          onManualEntryClick={() => setManualEntryModalOpen(true)}
          onExportStockClick={handleExportStock}
          onMoveClick={() => setRelocateModalOpen(true)}
          triggerToast={triggerToast}
        />
      )}

      {/* Scanning Terminal View */}
      {activeTab === 'scanning' && (
        <Scanning
          logisticsMode={logisticsMode}
          setLogisticsMode={setLogisticsMode}
          onManualEntryClick={() => setManualEntryModalOpen(true)}
          onExportStockClick={handleExportStock}
          onSimulateScanSubmit={(inputCode, actionType) => {
            setScannerAction(actionType);
            setScannerInput(inputCode);
            
            // Direct dispatch simulated trigger
            const matchInbound = inboundData.find(i => i.id.toLowerCase() === inputCode.toLowerCase());
            const matchOutbound = outboundData.find(o => o.id.toLowerCase() === inputCode.toLowerCase());
            
            if (matchInbound) {
              setInboundData(inboundData.filter(i => i.id !== matchInbound.id));
              if (logisticsMode === 'car_carrying') {
                const newCar = {
                  id: `CAR-${Date.now().toString().slice(-4)}`,
                  vin: `VIN-${Date.now().toString().slice(-6)}`,
                  rego: 'QLD-TBA',
                  stockNo: `STK-${Date.now().toString().slice(-4)}`,
                  model: matchInbound.id === 'INB-9023' ? 'Toyota Hilux Double-Cab' : 'Imported Passenger SUV',
                  location: 'Bay 1',
                  lane: matchInbound.lane || 'Unassigned',
                  destination: 'Yard Stowed',
                  customer: matchInbound.carrier || 'Inbound Carrier',
                  status: 'Stowed'
                };
                setCarStock([newCar, ...carStock]);
              } else {
                const newFreight = {
                  id: `FR-${Date.now().toString().slice(-4)}`,
                  itemNo: `ITM-${Date.now().toString().slice(-4)}`,
                  palletCount: 12,
                  weight: '8,500 lbs',
                  dimensions: 'Standard Pallets',
                  barcode: `BAR-${Date.now().toString().slice(-4)}`,
                  zone: 'Zone A (Dry)',
                  aisleBin: 'Aisle 1 - Bin B',
                  customer: matchInbound.carrier || 'Inbound Carrier',
                  destination: 'Staged',
                  status: 'Inwarded'
                };
                setFreightStock([newFreight, ...freightStock]);
              }
              triggerToast(`Scan Inward completed. Staged asset from ${matchInbound.id} into stock.`);
            } else if (matchOutbound) {
              setOutboundData(outboundData.filter(o => o.id !== matchOutbound.id));
              if (logisticsMode === 'car_carrying') {
                const firstReady = carStock.find(c => c.status === 'Ready' || c.lane === matchOutbound.lane);
                if (firstReady) {
                  setCarStock(carStock.map(c => c.id === firstReady.id ? { ...c, status: 'Dispatched', location: 'Gate Outbound' } : c));
                }
              } else {
                const firstStaged = freightStock.find(f => f.status === 'Staged' || f.aisleBin?.includes(matchOutbound.lane));
                if (firstStaged) {
                  setFreightStock(freightStock.map(f => f.id === firstStaged.id ? { ...f, status: 'Dispatched', aisleBin: 'Gate Outbound' } : f));
                }
              }
              triggerToast(`Scan Outward completed. Cargo dispatched on carrier trailer.`);
            } else {
              // Main inventory match
              let matchFound = false;
              if (logisticsMode === 'car_carrying') {
                const match = carStock.find(c => c.vin.toLowerCase() === inputCode.toLowerCase() || c.rego.toLowerCase() === inputCode.toLowerCase());
                if (match) {
                  matchFound = true;
                  let newStatus = match.status;
                  let newLoc = match.location;
                  if (actionType === 'Scan In') {
                    newStatus = 'Stowed';
                    newLoc = 'Bay 1';
                  } else if (actionType === 'Scan Out') {
                    newStatus = 'Dispatched';
                    newLoc = 'Gate Outbound';
                  }
                  setCarStock(carStock.map(c => c.id === match.id ? { ...c, status: newStatus, location: newLoc } : c));
                }
              } else {
                const match = freightStock.find(f => f.itemNo.toLowerCase() === inputCode.toLowerCase() || f.barcode.toLowerCase() === inputCode.toLowerCase());
                if (match) {
                  matchFound = true;
                  let newStatus = match.status;
                  let newLoc = match.aisleBin;
                  if (actionType === 'Scan In') {
                    newStatus = 'Inwarded';
                    newLoc = 'Aisle 1 - Bin B';
                  } else if (actionType === 'Scan Out') {
                    newStatus = 'Staged';
                    newLoc = 'Lane A1';
                  }
                  setFreightStock(freightStock.map(f => f.id === match.id ? { ...f, status: newStatus, aisleBin: newLoc } : f));
                }
              }
              
              if (matchFound) {
                triggerToast(`Scan completed successfully for ${inputCode.toUpperCase()}`);
              } else {
                triggerToast(`No registered asset resolved for code "${inputCode}".`, 'error');
              }
            }
          }}
        />
      )}

      {/* Labels Management View */}
      {activeTab === 'labels' && (
        <Labels
          logisticsMode={logisticsMode}
          setLogisticsMode={setLogisticsMode}
          onBarcodeSimulatorClick={() => { setScannerAction('Barcode'); setScannerModalOpen(true); }}
          onManualEntryClick={() => setManualEntryModalOpen(true)}
          onExportStockClick={handleExportStock}
          triggerToast={triggerToast}
        />
      )}

      {/* Movements Log View */}
      {activeTab === 'movements' && (
        <Movements
          logisticsMode={logisticsMode}
          setLogisticsMode={setLogisticsMode}
          onBarcodeSimulatorClick={() => { setScannerAction('Barcode'); setScannerModalOpen(true); }}
          onManualEntryClick={() => setManualEntryModalOpen(true)}
          onExportStockClick={handleExportStock}
          triggerToast={triggerToast}
        />
      )}

      {/* Reports View */}
      {activeTab === 'reports' && (
        <Reports
          logisticsMode={logisticsMode}
          setLogisticsMode={setLogisticsMode}
          onBarcodeSimulatorClick={() => { setScannerAction('Barcode'); setScannerModalOpen(true); }}
          onManualEntryClick={() => setManualEntryModalOpen(true)}
          onExportStockClick={handleExportStock}
          triggerToast={triggerToast}
        />
      )}

      {/* Relocate Asset Modal */}
      <LocalModal isOpen={relocateModalOpen} onClose={() => setRelocateModalOpen(false)} title="Relocate Asset Location">
        <form onSubmit={handleMoveAsset} className="space-y-4">
          <LocalSelectInput
            label="Select Target Location Spot"
            value={relocationTarget}
            onChange={(e) => setRelocationTarget(e.target.value)}
            options={locations.map(l => ({ value: l.name, label: `${l.name} (${l.type})` }))}
          />
          <button type="submit" className="w-full mt-4 py-3 bg-[#FFD400] hover:bg-[#FF9A00] text-slate-955 font-black rounded-xl cursor-pointer transition-all active:scale-[0.98] focus:outline-none">
            Confirm Location Move
          </button>
        </form>
      </LocalModal>

      {/* Manual Entry Asset Modal (Manual Asset Ingestion) - MATCHES IMAGE 3 */}
      <LocalModal isOpen={manualEntryModalOpen} onClose={() => setManualEntryModalOpen(false)} title="Manual Asset Ingestion">
        <form onSubmit={handleManualEntrySubmit} className="space-y-4 text-left">
          {logisticsMode === 'car_carrying' ? (
            <>
              <LocalTextInput
                label="Vehicle VIN Number"
                required
                placeholder="e.g. 7YV1HP82A81920"
                value={manualVin}
                onChange={(e) => setManualVin(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <LocalTextInput
                  label="Rego Plate Code"
                  placeholder="e.g. QLD-88A"
                  value={manualRego}
                  onChange={(e) => setManualRego(e.target.value)}
                />
                <LocalTextInput
                  label="Stock Number"
                  placeholder="e.g. STK-4401"
                  value={manualStockNo}
                  onChange={(e) => setManualStockNo(e.target.value)}
                />
              </div>
              <LocalTextInput
                label="Vehicle Make / Model"
                required
                placeholder="e.g. Toyota Hilux Double-Cab"
                value={manualModel}
                onChange={(e) => setManualModel(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <LocalSelectInput
                  label="Initial Yard Location"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  options={locations.filter(l => l.type === 'Bay').map(l => ({ value: l.name, label: l.name }))}
                />
                <LocalSelectInput
                  label="Outbound Load Lane"
                  value={manualLane}
                  onChange={(e) => setManualLane(e.target.value)}
                  options={[{ value: 'Unassigned', label: 'Unassigned' }, ...locations.filter(l => l.type === 'Load Lane').map(l => ({ value: l.name, label: l.name }))]}
                />
              </div>
            </>
          ) : (
            <>
              <LocalTextInput
                label="Cargo SKU / Item number"
                required
                placeholder="e.g. PLT-AUTO-19"
                value={manualItemNo}
                onChange={(e) => setManualItemNo(e.target.value)}
              />
              <div className="grid grid-cols-3 gap-3">
                <LocalTextInput
                  label="Pallet Count"
                  type="number"
                  required
                  value={manualPalletCount}
                  onChange={(e) => setManualPalletCount(e.target.value)}
                />
                <LocalTextInput
                  label="Total Weight"
                  placeholder="e.g. 14,200 lbs"
                  value={manualWeight}
                  onChange={(e) => setManualWeight(e.target.value)}
                />
                <LocalTextInput
                  label="Dimensions"
                  placeholder="e.g. 1.2m x 1.2m x 1.5m"
                  value={manualDim}
                  onChange={(e) => setManualDim(e.target.value)}
                />
              </div>
              <LocalTextInput
                label="Barcode / QR Tag"
                required
                placeholder="e.g. BAR-9011283"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <LocalSelectInput
                  label="Warehouse Zone"
                  value={manualZone}
                  onChange={(e) => setManualZone(e.target.value)}
                  options={[{ value: 'Zone A (Dry)', label: 'Zone A (Dry)' }, { value: 'Zone B (Cold)', label: 'Zone B (Cold)' }, { value: 'Zone C (Hazard)', label: 'Zone C (Hazard)' }]}
                />
                <LocalSelectInput
                  label="Aisle / Bin Spot"
                  value={manualBin}
                  onChange={(e) => setManualBin(e.target.value)}
                  options={locations.filter(l => l.type === 'Aisle/Bin').map(l => ({ value: l.name, label: l.name }))}
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-slate-200/45 pt-3">
            <LocalTextInput
              label="Billing Customer"
              placeholder="e.g. Toyota Australia"
              value={manualCust}
              onChange={(e) => setManualCust(e.target.value)}
            />
            <LocalTextInput
              label="Destination Delivery"
              placeholder="e.g. Brisbane Port"
              value={manualDest}
              onChange={(e) => setManualDest(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold rounded-xl transition-all duration-200 text-xs active:scale-[0.98] cursor-pointer shadow-md select-none focus:outline-none"
          >
            Ingest Asset (Independent of loads)
          </button>
        </form>
      </LocalModal>

      {/* Barcode Simulator Modal (Barcode/QR Scanner Simulator) - MATCHES IMAGE 2 */}
      <LocalModal isOpen={scannerModalOpen} onClose={() => setScannerModalOpen(false)} title="Barcode/QR Scanner Simulator">
        <form onSubmit={handleScannerSimulation} className="space-y-4">
          <LocalSelectInput
            label="Scanner Mode Action"
            value={scannerAction}
            onChange={(e) => setScannerAction(e.target.value)}
            options={[
              { value: 'Barcode', label: 'Scan by 1D Barcode tag' },
              { value: 'Scan In', label: 'Scan Inward Stowing' },
              { value: 'Scan Out', label: 'Scan Outward Dispatching' },
              { value: 'QR', label: 'Scan by 2D QR Code tag' }
            ]}
          />
          <LocalTextInput
            label="Scan Decoder Input"
            required
            placeholder={logisticsMode === 'car_carrying' ? "Scan Rego/VIN (e.g. QLD-88A or VIN-7YV1HP82A81920)" : "Scan Barcode (e.g. BAR-9011283)"}
            value={scannerInput}
            onChange={(e) => setScannerInput(e.target.value)}
          />
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold rounded-xl transition-all duration-200 text-xs active:scale-[0.98] cursor-pointer shadow-md select-none focus:outline-none"
          >
            Simulate Scan Decoder Trigger
          </button>
        </form>
      </LocalModal>

      {/* History Drawer */}
      <LocalDrawer isOpen={historyDrawerOpen} onClose={() => setHistoryDrawerOpen(false)} title="Asset Custody History Log">
        <div className="space-y-4 text-left text-xs">
          {selectedAsset && (
            <div className="border-b border-slate-200 pb-3">
              <strong className="text-slate-900 block text-sm font-mono">{logisticsMode === 'car_carrying' ? selectedAsset.vin : selectedAsset.itemNo}</strong>
              <span className="text-[10px] text-slate-500">Asset chain of custody log</span>
            </div>
          )}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {assetHistory.filter(h => h.itemId === (selectedAsset?.id)).length === 0 ? (
              <p className="text-slate-500 italic py-4 text-center">No movement logs registered for this asset.</p>
            ) : (
              assetHistory.filter(h => h.itemId === (selectedAsset?.id)).map(h => (
                <div key={h.id} className="p-3 bg-white/40 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex justify-between font-bold text-[10px]">
                    <span className="text-[#FF9A00]">{h.action}</span>
                    <span className="text-slate-500 font-mono">{h.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Operated by: {h.user}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </LocalDrawer>

      {/* Movement Ledger Drawer */}
      <LocalDrawer isOpen={movementDrawerOpen} onClose={() => setMovementDrawerOpen(false)} title="Full Warehouse Movement Register">
        <div className="space-y-4 text-left text-xs">
          <LocalTable
            columns={[
              { key: 'itemId', label: 'Asset Code', render: (row) => <span className="font-mono text-slate-900 font-semibold">{row.itemId}</span> },
              { key: 'action', label: 'Action Logged', render: (row) => <span className="text-slate-500">{row.action}</span> },
              { key: 'time', label: 'Timestamp', render: (row) => <span className="font-mono text-[9px] text-slate-500">{row.time}</span> }
            ]}
            data={assetHistory}
          />
        </div>
      </LocalDrawer>
    </div>
  );
}
