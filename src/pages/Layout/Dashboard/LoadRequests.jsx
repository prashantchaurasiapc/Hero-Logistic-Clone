import React, { useState } from 'react';
import {
  Truck, MapPin, Calendar, Clock, Plus, Trash2, Edit2, Check, ArrowRight,
  ShieldCheck, HelpCircle, FileText, ChevronRight, Star, RefreshCw, AlertCircle,
  MessageSquare, Phone, Mail, CheckCircle2, X, Lock, Info, ArrowLeftRight, Package, Car
} from 'lucide-react';

export default function LoadRequests() {
  // Toast Notification State
  const [toastMsg, setToastMsg] = useState('');
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Header State
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Booking Details, 2: Items & Freight, 3: Options, 4: Review

  // Pickup Details Form State
  const [pickupForm, setPickupForm] = useState({
    location: 'Melbourne VIC 3000',
    date: '2025-05-30',
    time: '14:30',
    readyFrom: '14:00',
    deliveryUntil: '16:00',
    contactName: 'John Smith',
    contactPhone: '0412 345 678',
    specialInstructions: ''
  });

  // Delivery Details Form State
  const [deliveryForm, setDeliveryForm] = useState({
    location: 'Sydney NSW 2000',
    date: '2025-05-30',
    time: '14:30',
    readyFrom: '14:00',
    deliveryUntil: '16:00',
    contactName: 'Sarah Mitchell',
    contactPhone: '0423 456 789',
    specialInstructions: ''
  });

  // Swap Locations Handler
  const handleSwapLocations = () => {
    const tempLoc = pickupForm.location;
    const tempContact = pickupForm.contactName;
    const tempPhone = pickupForm.contactPhone;

    setPickupForm({
      ...pickupForm,
      location: deliveryForm.location,
      contactName: deliveryForm.contactName,
      contactPhone: deliveryForm.contactPhone
    });

    setDeliveryForm({
      ...deliveryForm,
      location: tempLoc,
      contactName: tempContact,
      contactPhone: tempPhone
    });

    triggerToast("Swapped Pickup & Delivery locations!");
  };

  // Freight Type Checkboxes State
  const [freightTypes, setFreightTypes] = useState({
    carCarrier: true,
    generalFreight: true,
    dangerousGoods: false,
    warehousing: false
  });

  const toggleFreightType = (key) => {
    setFreightTypes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Items & Freight Table Data State (Exact Match to Screenshot 2)
  const [items, setItems] = useState([
    {
      id: 1,
      type: 'Vehicle',
      icon: 'car',
      description: 'Toyota RAV4 2024',
      details: 'VIN: JTMRFRREV1RJ23456 | Rego: 1ABC123',
      quantity: 1,
      weight: '1,650 kg',
      weightValue: 1650,
      dimensions: '4.60m x 1.85m x 1.70m',
      value: '$36,000.00',
      numericValue: 36000
    },
    {
      id: 2,
      type: 'Vehicle',
      icon: 'car',
      description: 'Mazda CX-5 2024',
      details: 'VIN: JM0KFBLAOM456789 | Rego: 2XYZ456',
      quantity: 1,
      weight: '1,580 kg',
      weightValue: 1580,
      dimensions: '4.55m x 1.84m x 1.67m',
      value: '$33,000.00',
      numericValue: 33000
    },
    {
      id: 3,
      type: 'General Freight',
      icon: 'package',
      description: 'Household Items',
      details: 'Boxes, Furniture',
      quantity: 5,
      weight: '320 kg',
      weightValue: 320,
      dimensions: 'Various',
      value: '$2,000.00',
      numericValue: 2000
    }
  ]);

  // Options & Requirements Checkboxes State
  const [serviceOptions, setServiceOptions] = useState({
    expressService: false,
    insuranceCoverage: true,
    tailLiftRequired: false
  });

  const [additionalRequirements, setAdditionalRequirements] = useState({
    enclosedTransport: false,
    temperatureControlled: false,
    specialEquipment: false
  });

  const [notesToDispatch, setNotesToDispatch] = useState('');

  // Modals State
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDispatchChatModalOpen, setIsDispatchChatModalOpen] = useState(false);

  // New Item Form State
  const [newItemForm, setNewItemForm] = useState({
    type: 'Vehicle',
    description: '',
    details: '',
    quantity: 1,
    weight: '1,000 kg',
    dimensions: '4.0m x 1.8m x 1.6m',
    value: '$10,000.00'
  });

  // Calculate Totals for Summary Card
  const totalWeightKg = items.reduce((acc, item) => acc + (item.weightValue || 0), 0);
  const totalDeclaredValueNumber = items.reduce((acc, item) => acc + (item.numericValue || 0), 0);

  // Item Handlers
  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    triggerToast("Item removed from freight list.");
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? { ...newItemForm, id: editingItem.id } : item));
      triggerToast("Item details updated successfully!");
    } else {
      const newItem = {
        ...newItemForm,
        id: Date.now(),
        weightValue: parseInt(newItemForm.weight.replace(/[^0-9]/g, '')) || 500,
        numericValue: parseInt(newItemForm.value.replace(/[^0-9]/g, '')) || 5000
      };
      setItems([...items, newItem]);
      triggerToast("New item added to freight booking list!");
    }
    setIsAddItemModalOpen(false);
    setEditingItem(null);
  };

  const handleFinalBookingSubmit = () => {
    triggerToast("Booking request submitted successfully! Reference: BKG-2025-0891");
    setIsSubmitModalOpen(false);
  };

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
         HEADER & TOP BREADCRUMBS (Exact Match 2nd Screenshot)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1">
            <span 
              onClick={() => triggerToast("Navigated to Home")}
              className="hover:text-slate-700 cursor-pointer transition-colors"
            >
              Home
            </span>
            <ChevronRight size={10} />
            <span 
              onClick={() => triggerToast("Navigated to Customer Portal")}
              className="hover:text-slate-700 cursor-pointer transition-colors"
            >
              Customer Portal
            </span>
            <ChevronRight size={10} />
            <span className="text-slate-700 font-extrabold">Create Booking / Request Transport</span>
          </div>

          {/* Title & Bookmark */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              14.4 Create Booking / Request Transport
            </h1>
            <button 
              onClick={() => {
                const nextState = !isBookmarked;
                setIsBookmarked(nextState);
                triggerToast(nextState ? "Page bookmarked successfully!" : "Page removed from bookmarks.");
              }}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Page"}
              className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <Star size={17} className={isBookmarked ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Request transport by providing pickup, delivery and item details.
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap relative">
          <button 
            onClick={() => triggerToast("Current booking draft saved successfully!")}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <FileText size={14} className="text-blue-600" />
            <span>Save as Draft</span>
          </button>

          <button 
            onClick={() => {
              setNotesToDispatch('');
              triggerToast("Booking form cleared.");
            }}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Trash2 size={14} className="text-slate-500" />
            <span>Clear</span>
          </button>

          <button 
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <ArrowRight size={14} />
            <span>Submit Booking Request</span>
          </button>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <span>More Actions</span>
              <span className="text-[10px]">{isMoreActionsOpen ? '▲' : '▼'}</span>
            </button>

            {isMoreActionsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMoreActionsOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 p-1.5 z-50 text-left w-56 space-y-0.5 animate-fade-in font-sans text-xs">
                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      triggerToast("Duplicated current booking template!");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <Plus size={13} className="text-blue-600" />
                    <span>Duplicate Template</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      triggerToast("Imported items list from CSV.");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <FileText size={13} className="text-emerald-600" />
                    <span>Import Items (CSV)</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      triggerToast("Form data refreshed!");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <RefreshCw size={13} className="text-slate-500" />
                    <span>Refresh Form</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* =========================================================================
         4-STEP PROGRESS WIZARD BAR (100% Interactive Stepper Tabs)
         ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
        <div className="flex items-center justify-between max-w-4xl mx-auto text-xs font-extrabold text-slate-500">
          
          {/* Step 1: Booking Details */}
          <div 
            onClick={() => {
              setCurrentStep(1);
              triggerToast("Tab 1: Booking Details selected");
            }}
            className={`flex items-center gap-2 cursor-pointer transition-all px-3 py-1.5 rounded-xl ${
              currentStep === 1 
                ? 'bg-blue-50 text-blue-700 font-black shadow-2xs' 
                : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
              currentStep === 1 ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              1
            </span>
            <span>Booking Details</span>
          </div>

          <div className="flex-1 h-px bg-slate-200 mx-2 hidden sm:block"></div>

          {/* Step 2: Items & Freight */}
          <div 
            onClick={() => {
              setCurrentStep(2);
              triggerToast("Tab 2: Items & Freight selected");
            }}
            className={`flex items-center gap-2 cursor-pointer transition-all px-3 py-1.5 rounded-xl ${
              currentStep === 2 
                ? 'bg-blue-50 text-blue-700 font-black shadow-2xs' 
                : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
              currentStep === 2 ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              2
            </span>
            <span>Items & Freight</span>
          </div>

          <div className="flex-1 h-px bg-slate-200 mx-2 hidden sm:block"></div>

          {/* Step 3: Options & Requirements */}
          <div 
            onClick={() => {
              setCurrentStep(3);
              triggerToast("Tab 3: Options & Requirements selected");
            }}
            className={`flex items-center gap-2 cursor-pointer transition-all px-3 py-1.5 rounded-xl ${
              currentStep === 3 
                ? 'bg-blue-50 text-blue-700 font-black shadow-2xs' 
                : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
              currentStep === 3 ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              3
            </span>
            <span>Options & Requirements</span>
          </div>

          <div className="flex-1 h-px bg-slate-200 mx-2 hidden sm:block"></div>

          {/* Step 4: Review & Submit */}
          <div 
            onClick={() => {
              setCurrentStep(4);
              setIsSubmitModalOpen(true);
              triggerToast("Tab 4: Review & Submit opened");
            }}
            className={`flex items-center gap-2 cursor-pointer transition-all px-3 py-1.5 rounded-xl ${
              currentStep === 4 
                ? 'bg-blue-50 text-blue-700 font-black shadow-2xs' 
                : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
              currentStep === 4 ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              4
            </span>
            <span>Review & Submit</span>
          </div>

        </div>
      </div>

      {/* =========================================================================
         MAIN WORKSPACE GRID (8 Cols Form Sections Stack + 4 Cols Side Cards Stack)
         Equal Height Bottom Alignment (items-stretch)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* COLUMN 1 (8 Cols): MAIN FORM CARDS STACK */}
        <div className="lg:col-span-8 space-y-5 flex flex-col justify-between">
          
          <div className="space-y-5">
            
            {/* -----------------------------------------------------------------
               SECTION 1: PICKUP & DELIVERY DETAILS (2-Card Grid with Swap Icon)
               ----------------------------------------------------------------- */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* PICKUP DETAILS CARD */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  PICKUP DETAILS
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block font-extrabold text-slate-700 mb-1">Pickup Location *</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                      <input 
                        type="text"
                        value={pickupForm.location}
                        onChange={e => setPickupForm({ ...pickupForm, location: e.target.value })}
                        className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Pickup Date *</label>
                      <input 
                        type="date"
                        value={pickupForm.date}
                        onChange={e => setPickupForm({ ...pickupForm, date: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Pickup Time *</label>
                      <input 
                        type="time"
                        value={pickupForm.time}
                        onChange={e => setPickupForm({ ...pickupForm, time: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Ready From</label>
                      <input 
                        type="time"
                        value={pickupForm.readyFrom}
                        onChange={e => setPickupForm({ ...pickupForm, readyFrom: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Delivery Until</label>
                      <input 
                        type="time"
                        value={pickupForm.deliveryUntil}
                        onChange={e => setPickupForm({ ...pickupForm, deliveryUntil: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Contact Name</label>
                      <input 
                        type="text"
                        value={pickupForm.contactName}
                        onChange={e => setPickupForm({ ...pickupForm, contactName: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Contact Phone</label>
                      <input 
                        type="text"
                        value={pickupForm.contactPhone}
                        onChange={e => setPickupForm({ ...pickupForm, contactPhone: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Special Instructions</label>
                    <textarea 
                      placeholder="Enter any pickup instructions..."
                      rows={2}
                      value={pickupForm.specialInstructions}
                      onChange={e => setPickupForm({ ...pickupForm, specialInstructions: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400 text-xs resize-none"
                    />
                    <span className="text-[9px] text-slate-400 block text-right font-medium">0 / 250</span>
                  </div>
                </div>
              </div>

              {/* CENTER SWAP BUTTON */}
              <button 
                onClick={handleSwapLocations}
                title="Swap Pickup & Delivery Locations"
                className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md text-blue-600 hover:bg-blue-50 items-center justify-center cursor-pointer transition-all hover:scale-110"
              >
                <ArrowLeftRight size={14} />
              </button>

              {/* DELIVERY DETAILS CARD */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  DELIVERY DETAILS
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block font-extrabold text-slate-700 mb-1">Delivery Location *</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                      <input 
                        type="text"
                        value={deliveryForm.location}
                        onChange={e => setDeliveryForm({ ...deliveryForm, location: e.target.value })}
                        className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Delivery Date *</label>
                      <input 
                        type="date"
                        value={deliveryForm.date}
                        onChange={e => setDeliveryForm({ ...deliveryForm, date: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Delivery Time *</label>
                      <input 
                        type="time"
                        value={deliveryForm.time}
                        onChange={e => setDeliveryForm({ ...deliveryForm, time: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Delivery From</label>
                      <input 
                        type="time"
                        value={deliveryForm.readyFrom}
                        onChange={e => setDeliveryForm({ ...deliveryForm, readyFrom: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Delivery Until</label>
                      <input 
                        type="time"
                        value={deliveryForm.deliveryUntil}
                        onChange={e => setDeliveryForm({ ...deliveryForm, deliveryUntil: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Contact Name</label>
                      <input 
                        type="text"
                        value={deliveryForm.contactName}
                        onChange={e => setDeliveryForm({ ...deliveryForm, contactName: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Contact Phone</label>
                      <input 
                        type="text"
                        value={deliveryForm.contactPhone}
                        onChange={e => setDeliveryForm({ ...deliveryForm, contactPhone: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Special Instructions</label>
                    <textarea 
                      placeholder="Enter any delivery instructions..."
                      rows={2}
                      value={deliveryForm.specialInstructions}
                      onChange={e => setDeliveryForm({ ...deliveryForm, specialInstructions: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400 text-xs resize-none"
                    />
                    <span className="text-[9px] text-slate-400 block text-right font-medium">0 / 250</span>
                  </div>
                </div>
              </div>

            </div>

            {/* -----------------------------------------------------------------
               SECTION 2: ITEMS & FREIGHT (Table + Freight Type Cards)
               ----------------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* ITEMS & FREIGHT TABLE CARD (8 Cols) */}
              <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    ITEMS & FREIGHT
                  </h3>
                  <button 
                    onClick={() => {
                      setEditingItem(null);
                      setIsAddItemModalOpen(true);
                    }}
                    className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <Plus size={12} />
                    <span>Add Item</span>
                  </button>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        <th className="py-2 px-2 text-center w-8">#</th>
                        <th className="py-2 px-2.5">Type</th>
                        <th className="py-2 px-2.5">Description / Details</th>
                        <th className="py-2 px-2 text-center">Quantity</th>
                        <th className="py-2 px-2.5">Weight</th>
                        <th className="py-2 px-2.5">Dimensions (L x W x H)</th>
                        <th className="py-2 px-2.5">Value (AUD)</th>
                        <th className="py-2 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 whitespace-nowrap">
                      {items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                          <td className="py-2.5 px-2 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              {item.icon === 'car' || item.type === 'Vehicle' ? (
                                <Car size={13} className="text-blue-600" />
                              ) : (
                                <Package size={13} className="text-amber-600" />
                              )}
                              <span className="font-bold text-slate-800">{item.type}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-900">{item.description}</span>
                              <span className="text-[9.5px] text-slate-400 font-mono font-medium">{item.details}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-center font-extrabold text-slate-900">{item.quantity}</td>
                          <td className="py-2.5 px-2.5 font-bold text-slate-700">{item.weight}</td>
                          <td className="py-2.5 px-2.5 font-medium text-slate-500 text-[11px]">{item.dimensions}</td>
                          <td className="py-2.5 px-2.5 font-black text-slate-900">{item.value}</td>
                          <td className="py-2.5 px-2 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => {
                                  setEditingItem(item);
                                  setNewItemForm(item);
                                  setIsAddItemModalOpen(true);
                                }}
                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-[10.5px] text-blue-900 font-medium flex items-center gap-2">
                  <Info size={14} className="text-blue-600 shrink-0" />
                  <span>If you have more items, please add them or contact our dispatch team.</span>
                </div>
              </div>

              {/* FREIGHT TYPE SELECTION CARD (4 Cols) */}
              <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5">
                  FREIGHT TYPE
                </h3>

                <p className="text-[11px] font-extrabold text-slate-500">Select the type of load you need: *</p>

                <div className="space-y-2 text-xs font-bold text-slate-700">
                  <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={freightTypes.carCarrier}
                      onChange={() => toggleFreightType('carCarrier')}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                    <span>Car Carrier / Vehicle Transport</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={freightTypes.generalFreight}
                      onChange={() => toggleFreightType('generalFreight')}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                    <span>General Freight</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={freightTypes.dangerousGoods}
                      onChange={() => toggleFreightType('dangerousGoods')}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                    <span>Dangerous Goods</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={freightTypes.warehousing}
                      onChange={() => toggleFreightType('warehousing')}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                    <span>Warehousing / 3PL</span>
                  </label>
                </div>
              </div>

            </div>

            {/* -----------------------------------------------------------------
               SECTION 3: OPTIONS & REQUIREMENTS (3 Cards Grid)
               ----------------------------------------------------------------- */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5">
                OPTIONS & REQUIREMENTS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                {/* SERVICE OPTIONS */}
                <div className="space-y-2">
                  <span className="font-extrabold text-slate-500 text-[10.5px] uppercase block">SERVICE OPTIONS</span>
                  
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={serviceOptions.expressService}
                      onChange={() => setServiceOptions({ ...serviceOptions, expressService: !serviceOptions.expressService })}
                      className="rounded border-slate-300 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">Express Service</span>
                      <span className="text-[10px] text-slate-400 font-medium">Priority handling and faster delivery</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={serviceOptions.insuranceCoverage}
                      onChange={() => setServiceOptions({ ...serviceOptions, insuranceCoverage: !serviceOptions.insuranceCoverage })}
                      className="rounded border-slate-300 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">Insurance Coverage</span>
                      <span className="text-[10px] text-slate-400 font-medium">Add insurance for your goods / vehicles</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={serviceOptions.tailLiftRequired}
                      onChange={() => setServiceOptions({ ...serviceOptions, tailLiftRequired: !serviceOptions.tailLiftRequired })}
                      className="rounded border-slate-300 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">Tail Lift Required</span>
                      <span className="text-[10px] text-slate-400 font-medium">For loading / unloading assistance</span>
                    </div>
                  </label>
                </div>

                {/* ADDITIONAL REQUIREMENTS */}
                <div className="space-y-2">
                  <span className="font-extrabold text-slate-500 text-[10.5px] uppercase block">ADDITIONAL REQUIREMENTS</span>
                  
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={additionalRequirements.enclosedTransport}
                      onChange={() => setAdditionalRequirements({ ...additionalRequirements, enclosedTransport: !additionalRequirements.enclosedTransport })}
                      className="rounded border-slate-300 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">Enclosed Transport</span>
                      <span className="text-[10px] text-slate-400 font-medium">Protect from weather and road conditions</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={additionalRequirements.temperatureControlled}
                      onChange={() => setAdditionalRequirements({ ...additionalRequirements, temperatureControlled: !additionalRequirements.temperatureControlled })}
                      className="rounded border-slate-300 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">Temperature Controlled</span>
                      <span className="text-[10px] text-slate-400 font-medium">Refrigerated or climate-controlled transport</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={additionalRequirements.specialEquipment}
                      onChange={() => setAdditionalRequirements({ ...additionalRequirements, specialEquipment: !additionalRequirements.specialEquipment })}
                      className="rounded border-slate-300 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">Special Equipment</span>
                      <span className="text-[10px] text-slate-400 font-medium">Crane, winch or other equipment required</span>
                    </div>
                  </label>
                </div>

                {/* NOTES TO DISPATCH */}
                <div className="space-y-1.5">
                  <span className="font-extrabold text-slate-500 text-[10.5px] uppercase block">NOTES TO DISPATCH</span>
                  <textarea 
                    placeholder="Add any additional notes or requirements..."
                    rows={4}
                    value={notesToDispatch}
                    onChange={e => setNotesToDispatch(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400 text-xs resize-none"
                  />
                  <span className="text-[9px] text-slate-400 block text-right font-medium">0 / 250</span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* COLUMN 2 (4 Cols): SIDE CARDS (Booking Summary, Special Requirements, Next Steps, Need Help) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
          
          {/* CARD 1: BOOKING SUMMARY */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">BOOKING SUMMARY</h2>
              <button onClick={() => triggerToast("Editing booking summary details...")} className="text-[10px] font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer">
                Edit
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Route</span>
                <span className="font-extrabold text-slate-900">Melbourne VIC → Sydney NSW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Pickup</span>
                <span className="font-bold text-slate-800">30 May 2025 at 02:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Delivery</span>
                <span className="font-bold text-slate-800">30 May 2025 at 02:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Items</span>
                <span className="font-extrabold text-slate-900">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Total Weight</span>
                <span className="font-extrabold text-slate-900">{totalWeightKg.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100 font-extrabold">
                <span className="text-slate-500">Total Declared Value</span>
                <span className="text-blue-600 font-black">${totalDeclaredValueNumber.toLocaleString()}.00 AUD</span>
              </div>
            </div>
          </div>

          {/* CARD 2: SPECIAL REQUIREMENTS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">SPECIAL REQUIREMENTS</h2>
              <button onClick={() => triggerToast("Editing special requirements...")} className="text-[10px] font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer">
                Edit
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Standard Pickup & Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Handle with care</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Notify before delivery</span>
              </div>
            </div>

            <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-[10px] text-blue-900 font-medium flex items-center gap-2">
              <Info size={14} className="text-blue-600 shrink-0" />
              <div>
                <span className="font-extrabold block">This is a request only.</span>
                <span>Our team will review and confirm your booking.</span>
              </div>
            </div>
          </div>

          {/* CARD 3: ESTIMATED NEXT STEPS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">ESTIMATED NEXT STEPS</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 block">Review by dispatch team</span>
                  <span className="text-[10px] text-slate-400 font-medium">Usually within 1 business hour</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-extrabold text-slate-800 block">Quote / Confirmation</span>
                  <span className="text-[10px] text-slate-400 font-medium">We'll send you a quote or confirm the booking</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-extrabold text-slate-800 block">Booking Confirmed</span>
                  <span className="text-[10px] text-slate-400 font-medium">You'll receive confirmation with all details</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4: NEED HELP? (Stretches to fill bottom flush alignment) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">NEED HELP?</h2>
              </div>

              <p className="text-[10.5px] text-slate-500 font-medium mt-2">Our dispatch team is here to help you.</p>
            </div>

            <div className="space-y-2 text-xs mt-auto">
              <button 
                onClick={() => setIsDispatchChatModalOpen(true)}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare size={13} />
                <span>Message Dispatch</span>
              </button>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-slate-700 font-bold text-[11px]">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-blue-600" />
                  <span>1300 437 676</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-blue-600" />
                  <span>dispatch@herologistics.com.au</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
         DEVELOPER NOTES BANNER (Exact Match 2nd Screenshot)
         ========================================================================= */}
      <div className="bg-[#1E293B] text-white rounded-2xl p-4 shadow-lg space-y-3 font-sans border border-slate-700">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-mono font-bold text-xs">&lt;/&gt;</span>
            <h3 className="font-extrabold uppercase text-[11px] tracking-wider text-slate-200">DEVELOPER NOTES – CREATE BOOKING / REQUEST TRANSPORT</h3>
          </div>
          <span className="text-[9.5px] font-mono text-slate-400 font-semibold">REF: 14.4-CREATE-BOOKING-SPEC</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-left">
          {[
            { title: '1. PURPOSE', items: ['Allow customers to request transport easily.', 'Capture pickup, delivery, items and options.', 'Submit request for dispatch review & quote.'] },
            { title: '2. KEY FEATURES', items: ['Multi-step booking wizard.', 'Support for vehicles and general freight.', 'Save as draft and resume later.', 'Add multiple items with details.'] },
            { title: '3. DATA SOURCES', items: ['Customer profile and saved locations.', 'Pricing rules for quotes (if enabled).', 'Load Types configured by company.', 'AI Load Creation (if subscribed).'] },
            { title: '4. SECURITY & ACCESS', items: ['Customers can only create their own bookings.', 'Validate addresses and dates.', 'Prevent duplicate or conflicting requests.'] },
            { title: '5. INTEGRATIONS', items: ['Loads module (create new lead).', 'Messaging module (dispatch notifications).', 'Email/SMS notifications.', 'Document storage (quotes, confirmations).'] },
            { title: '6. PERFORMANCE', items: ['Auto-save every 30 seconds.', 'Optimize for mobile and desktop.', 'Form validation before submission.'] }
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-extrabold text-blue-400 mb-1 uppercase text-[8.5px] tracking-wider">{col.title}</h4>
              <ul className="space-y-0.5 text-[9.5px] text-slate-300 font-medium">
                {col.items.map((item, j) => <li key={j}>• {item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between text-[8.5px] text-slate-400 font-semibold gap-2">
          <div className="flex items-center gap-1.5">
            <RefreshCw size={10} className="text-blue-400 animate-spin-slow" />
            <span>All times shown in your local time (AEST) • Data auto-refreshes every 5 minutes</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
         ADD / EDIT ITEM MODAL
         ========================================================================= */}
      {isAddItemModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsAddItemModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <Package size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{editingItem ? 'Edit Item Details' : 'Add Freight Item'}</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Specify item dimensions, weight and declared value</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddItemModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item Category Type</label>
                <select
                  value={newItemForm.type}
                  onChange={e => setNewItemForm({ ...newItemForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="Vehicle">Vehicle (Car / SUV / Truck)</option>
                  <option value="General Freight">General Freight (Pallets / Boxes)</option>
                  <option value="Machinery">Heavy Machinery / Equipment</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Item Description / Make & Model *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Toyota RAV4 2024"
                  value={newItemForm.description}
                  onChange={e => setNewItemForm({ ...newItemForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Details (VIN / Rego / Notes)</label>
                <input 
                  type="text"
                  placeholder="e.g. VIN: JTMRFRREV1RJ23456 | Rego: 1ABC123"
                  value={newItemForm.details}
                  onChange={e => setNewItemForm({ ...newItemForm, details: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input 
                    type="number"
                    min="1"
                    value={newItemForm.quantity}
                    onChange={e => setNewItemForm({ ...newItemForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weight (kg)</label>
                  <input 
                    type="text"
                    value={newItemForm.weight}
                    onChange={e => setNewItemForm({ ...newItemForm, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dimensions (L x W x H)</label>
                  <input 
                    type="text"
                    value={newItemForm.dimensions}
                    onChange={e => setNewItemForm({ ...newItemForm, dimensions: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Declared Value (AUD)</label>
                  <input 
                    type="text"
                    value={newItemForm.value}
                    onChange={e => setNewItemForm({ ...newItemForm, value: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         CONFIRM BOOKING SUBMISSION MODAL
         ========================================================================= */}
      {isSubmitModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <Truck size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Confirm Booking Request</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Review route & item summary before submitting</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Route:</span>
                  <span className="text-blue-600 font-bold">{pickupForm.location} → {deliveryForm.location}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="text-slate-800">{pickupForm.date} at {pickupForm.time}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Total Items:</span>
                  <span className="text-slate-900 font-extrabold">{items.length} items ({totalWeightKg} kg)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                Submitting will send your transport request directly to our dispatch team for instant review.
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Review Form
                </button>
                <button 
                  type="button" 
                  onClick={handleFinalBookingSubmit}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Submit Request</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         DISPATCH CHAT MODAL
         ========================================================================= */}
      {isDispatchChatModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsDispatchChatModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Message Dispatch Team</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Send quick inquiry regarding your booking</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDispatchChatModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <textarea 
                placeholder="Type your message to dispatch..."
                rows={4}
                className="w-full p-3 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400 text-xs resize-none"
              />

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsDispatchChatModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsDispatchChatModalOpen(false);
                    triggerToast("Message sent to dispatch team!");
                  }}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
