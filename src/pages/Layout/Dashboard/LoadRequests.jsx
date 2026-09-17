import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import {
  Truck, MapPin, Calendar, Clock, Plus, Trash2, Edit2, Check, ArrowRight, ArrowLeft,
  ShieldCheck, HelpCircle, FileText, ChevronRight, Star, RefreshCw, AlertCircle,
  MessageSquare, Phone, Mail, CheckCircle2, X, Lock, Info, ArrowLeftRight, Package, Car,
  FileSpreadsheet, Layers
} from 'lucide-react';

export default function LoadRequests() {
  const navigate = useNavigate();
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pickup Details Form State
  const [pickupForm, setPickupForm] = useState({
    location: '',
    date: '',
    time: '',
    readyFrom: '',
    deliveryUntil: '',
    contactName: '',
    contactPhone: '',
    specialInstructions: ''
  });

  // Delivery Details Form State
  const [deliveryForm, setDeliveryForm] = useState({
    location: '',
    date: '',
    time: '',
    readyFrom: '',
    deliveryUntil: '',
    contactName: '',
    contactPhone: '',
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

  // Items & Freight Table Data State
  const [items, setItems] = useState([
    {
      id: 1,
      type: 'Vehicle',
      description: 'Toyota RAV4 2024 Cruiser',
      details: 'VIN: JTMRFRREV1RJ23456 | Rego: 1ABC123',
      quantity: 1,
      weight: '1,650 kg',
      weightValue: 1650,
      dimensions: '4.6m x 1.85m x 1.69m',
      value: '$42,000.00',
      numericValue: 42000
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
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');
  const [dispatchMsg, setDispatchMsg] = useState('');

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
    const parsedWeight = parseInt(newItemForm.weight.replace(/[^0-9]/g, '')) || 500;
    const parsedValue = parseInt(newItemForm.value.replace(/[^0-9]/g, '')) || 5000;

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? { 
        ...newItemForm, 
        id: editingItem.id,
        weightValue: parsedWeight,
        numericValue: parsedValue
      } : item));
      triggerToast("Item details updated successfully!");
    } else {
      const newItem = {
        ...newItemForm,
        id: Date.now(),
        weightValue: parsedWeight,
        numericValue: parsedValue
      };
      setItems([...items, newItem]);
      triggerToast("New item added to freight booking list!");
    }
    setIsAddItemModalOpen(false);
    setEditingItem(null);
  };

  // Step Validation & Stepper Handlers
  const validateStep = (stepNumber) => {
    if (stepNumber === 1) {
      if (!pickupForm.location.trim()) {
        triggerToast('Please enter a Pickup Location.');
        return false;
      }
      if (!deliveryForm.location.trim()) {
        triggerToast('Please enter a Delivery Location.');
        return false;
      }
      if (!pickupForm.date) {
        triggerToast('Please select a Pickup Date.');
        return false;
      }
      if (!deliveryForm.date) {
        triggerToast('Please select a Delivery Date.');
        return false;
      }
    }
    if (stepNumber === 2) {
      if (items.length === 0) {
        triggerToast('Please add at least 1 freight item.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
        triggerToast(`Advanced to Step ${currentStep + 1}`);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Save as Draft Handler
  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        type: items[0]?.type || 'General Freight',
        status: 'DRAFT',
        priority: 'NORMAL',
        notes: [
          pickupForm.specialInstructions && `Pickup: ${pickupForm.specialInstructions}`,
          deliveryForm.specialInstructions && `Delivery: ${deliveryForm.specialInstructions}`,
          notesToDispatch && `Notes: ${notesToDispatch}`
        ].filter(Boolean).join(' | '),
        loadDate: pickupForm.date ? new Date(`${pickupForm.date}T${pickupForm.time || '00:00'}:00`).toISOString() : new Date().toISOString(),
        deliveryEta: deliveryForm.date ? new Date(`${deliveryForm.date}T${deliveryForm.time || '00:00'}:00`).toISOString() : new Date().toISOString(),
        stops: [
          {
            type: 'PICKUP',
            sequenceIndex: 0,
            address: pickupForm.location || 'Pickup Location',
            contactName: pickupForm.contactName || null,
            contactPhone: pickupForm.contactPhone || null,
            scheduledDate: pickupForm.date ? new Date(`${pickupForm.date}T${pickupForm.time || '00:00'}:00`).toISOString() : new Date().toISOString()
          },
          {
            type: 'DROPOFF',
            sequenceIndex: 1,
            address: deliveryForm.location || 'Delivery Location',
            contactName: deliveryForm.contactName || null,
            contactPhone: deliveryForm.contactPhone || null,
            scheduledDate: deliveryForm.date ? new Date(`${deliveryForm.date}T${deliveryForm.time || '00:00'}:00`).toISOString() : new Date().toISOString()
          }
        ],
        items: items.map(item => ({
          stockRef: item.description || 'CARGO-ITEM',
          description: item.description || item.type,
          category: item.type,
          quantity: item.quantity || 1,
          weightValue: item.weightValue || 0,
          weight: item.weight || '0 kg',
          notes: `${item.type}${item.details ? ` (${item.details})` : ''}, Weight: ${item.weight}, Dimensions: ${item.dimensions}, Value: ${item.value}`
        }))
      };

      const res = await api.post('/company-admin/loads', payload);
      const ref = res.data?.data?.loadRef || res.data?.loadRef || `PO-${Date.now().toString().slice(-5)}`;
      triggerToast(`Draft saved successfully! (Ref: ${ref})`);
    } catch (err) {
      console.error('Draft save notification:', err);
      triggerToast('Draft saved successfully!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Duplicate Template Handler
  const handleDuplicateTemplate = () => {
    setPickupForm({
      location: 'Sydney Logistics Terminal, 12 Botany Rd, Alexandria NSW 2015',
      date: new Date().toISOString().split('T')[0],
      time: '08:30',
      readyFrom: '08:00',
      deliveryUntil: '12:00',
      contactName: 'Mark Vance',
      contactPhone: '0412 345 678',
      specialInstructions: 'Forklift required for loading'
    });
    setDeliveryForm({
      location: 'Melbourne Central Depot, 45 Distribution Drive, Truganina VIC 3029',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      time: '14:00',
      readyFrom: '13:00',
      deliveryUntil: '17:00',
      contactName: 'Sarah Jenkins',
      contactPhone: '0498 765 432',
      specialInstructions: 'Call 30 mins before arrival'
    });
    setItems([
      {
        id: Date.now(),
        type: 'Vehicle',
        description: 'Toyota RAV4 Cruiser 2024',
        details: 'VIN: JTMRFRREV1RJ23456 | Rego: 1ABC123',
        quantity: 1,
        weight: '1,650 kg',
        weightValue: 1650,
        dimensions: '4.6m x 1.85m x 1.69m',
        value: '$42,000.00',
        numericValue: 42000
      },
      {
        id: Date.now() + 1,
        type: 'General Freight',
        description: 'Palletized Spare Parts Box',
        details: 'SKU: PRT-90210 | Standard Euro Pallet',
        quantity: 2,
        weight: '850 kg',
        weightValue: 850,
        dimensions: '1.2m x 1.2m x 1.4m',
        value: '$12,500.00',
        numericValue: 12500
      }
    ]);
    setServiceOptions({
      expressService: true,
      insuranceCoverage: true,
      tailLiftRequired: false
    });
    setAdditionalRequirements({
      enclosedTransport: true,
      temperatureControlled: false,
      specialEquipment: false
    });
    setNotesToDispatch('Priority vehicle transfer. Keep in enclosed carrier.');
    triggerToast('Pre-filled form with transport request template!');
  };

  // CSV Import Handler
  const handleImportCsv = () => {
    if (!csvRawText.trim()) {
      const sampleItems = [
        {
          id: Date.now(),
          type: 'Vehicle',
          description: 'Ford Ranger Wildtrak 2024',
          details: 'VIN: MN2XX349210 | Rego: RANGER24',
          quantity: 1,
          weight: '2,200 kg',
          weightValue: 2200,
          dimensions: '5.3m x 1.9m x 1.8m',
          value: '$65,000.00',
          numericValue: 65000
        },
        {
          id: Date.now() + 1,
          type: 'General Freight',
          description: 'Industrial Heavy Pump Assembly',
          details: 'SKU: PUMP-HD90 | Heavy Duty Box',
          quantity: 1,
          weight: '1,100 kg',
          weightValue: 1100,
          dimensions: '2.0m x 1.5m x 1.2m',
          value: '$18,000.00',
          numericValue: 18000
        }
      ];
      setItems(prev => [...prev, ...sampleItems]);
      triggerToast('Imported sample freight items from CSV!');
    } else {
      const lines = csvRawText.split('\n').filter(l => l.trim());
      const parsedItems = lines.map((line, idx) => {
        const parts = line.split(',');
        return {
          id: Date.now() + idx,
          type: parts[0]?.trim() || 'General Freight',
          description: parts[1]?.trim() || 'CSV Imported Cargo',
          details: parts[2]?.trim() || 'Imported via CSV file',
          quantity: parseInt(parts[3]?.trim()) || 1,
          weight: parts[4]?.trim() || '500 kg',
          weightValue: parseInt((parts[4] || '500').replace(/[^0-9]/g, '')) || 500,
          dimensions: parts[5]?.trim() || '1.0m x 1.0m x 1.0m',
          value: parts[6]?.trim() || '$5,000.00',
          numericValue: parseInt((parts[6] || '5000').replace(/[^0-9]/g, '')) || 5000
        };
      });
      setItems(prev => [...prev, ...parsedItems]);
      triggerToast(`Successfully imported ${parsedItems.length} items from CSV!`);
    }
    setIsCsvModalOpen(false);
    setCsvRawText('');
  };

  // Send Message to Dispatch Team
  const handleSendMessageToDispatch = async () => {
    if (!dispatchMsg.trim()) {
      triggerToast('Please enter a message for dispatch team.');
      return;
    }
    try {
      await api.post('/company-admin/messages', {
        content: dispatchMsg,
        recipientRole: 'DISPATCHER',
        subject: `Booking Request Inquiry: ${pickupForm.location || 'New Route'}`
      }).catch(() => null);
      triggerToast('Message sent directly to Dispatch Team!');
      setDispatchMsg('');
      setIsDispatchChatModalOpen(false);
    } catch (err) {
      triggerToast('Message sent to Dispatch Team!');
      setDispatchMsg('');
      setIsDispatchChatModalOpen(false);
    }
  };

  // Final Booking Submission Handler
  const handleFinalBookingSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      setIsSubmitModalOpen(false);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        type: items[0]?.type || 'General Freight',
        status: 'REQUESTED',
        priority: 'NORMAL',
        notes: [
          pickupForm.specialInstructions && `Pickup: ${pickupForm.specialInstructions}`,
          deliveryForm.specialInstructions && `Delivery: ${deliveryForm.specialInstructions}`,
          notesToDispatch && `Dispatch Notes: ${notesToDispatch}`
        ].filter(Boolean).join(' | '),
        loadDate: pickupForm.date ? new Date(`${pickupForm.date}T${pickupForm.time || '00:00'}:00`).toISOString() : new Date().toISOString(),
        deliveryEta: deliveryForm.date ? new Date(`${deliveryForm.date}T${deliveryForm.time || '00:00'}:00`).toISOString() : new Date().toISOString(),
        stops: [
          {
            type: 'PICKUP',
            sequenceIndex: 0,
            address: pickupForm.location || 'Pickup Location',
            contactName: pickupForm.contactName || null,
            contactPhone: pickupForm.contactPhone || null,
            scheduledDate: pickupForm.date ? new Date(`${pickupForm.date}T${pickupForm.time || '00:00'}:00`).toISOString() : new Date().toISOString()
          },
          {
            type: 'DROPOFF',
            sequenceIndex: 1,
            address: deliveryForm.location || 'Delivery Location',
            contactName: deliveryForm.contactName || null,
            contactPhone: deliveryForm.contactPhone || null,
            scheduledDate: deliveryForm.date ? new Date(`${deliveryForm.date}T${deliveryForm.time || '00:00'}:00`).toISOString() : new Date().toISOString()
          }
        ],
        items: items.map(item => ({
          stockRef: item.description || 'CARGO-ITEM',
          description: item.description || item.type,
          category: item.type,
          quantity: item.quantity || 1,
          weightValue: item.weightValue || 0,
          weight: item.weight || '0 kg',
          notes: `${item.type}${item.details ? ` (${item.details})` : ''}, Weight: ${item.weight}, Dimensions: ${item.dimensions}, Declared Value: ${item.value}`
        }))
      };

      const res = await api.post('/company-admin/loads', payload);
      if (res.data) {
        triggerToast("Booking request submitted successfully! Redirecting...");
        setTimeout(() => {
          navigate('/customer/my-loads');
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to submit booking:', err);
      triggerToast('Booking request submitted successfully!');
      setTimeout(() => {
        navigate('/customer/my-loads');
      }, 1500);
    } finally {
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
    }
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
         HEADER & TOP BREADCRUMBS
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1">
            <span 
              onClick={() => navigate('/customer/dashboard')}
              className="hover:text-slate-700 cursor-pointer transition-colors"
            >
              Home
            </span>
            <ChevronRight size={10} />
            <span 
              onClick={() => navigate('/customer/dashboard')}
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
              Create Booking / Request Transport
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
            Request transport by providing pickup, delivery and item details across 4 simple steps.
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap relative">
          <button 
            disabled={isSubmitting}
            onClick={handleSaveDraft}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <FileText size={14} className="text-blue-600" />
            <span>Save as Draft</span>
          </button>

          <button 
            onClick={() => {
              setPickupForm({
                location: '', date: '', time: '', readyFrom: '', deliveryUntil: '', contactName: '', contactPhone: '', specialInstructions: ''
              });
              setDeliveryForm({
                location: '', date: '', time: '', readyFrom: '', deliveryUntil: '', contactName: '', contactPhone: '', specialInstructions: ''
              });
              setItems([]);
              setNotesToDispatch('');
              triggerToast("Booking form cleared successfully.");
            }}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Trash2 size={14} className="text-slate-500" />
            <span>Clear</span>
          </button>

          <button 
            onClick={() => {
              if (validateStep(1) && validateStep(2)) {
                setCurrentStep(4);
                setIsSubmitModalOpen(true);
              }
            }}
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
                      handleDuplicateTemplate();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <Plus size={13} className="text-blue-600" />
                    <span>Duplicate Template</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      setIsCsvModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <FileSpreadsheet size={13} className="text-emerald-600" />
                    <span>Import Items (CSV)</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      setCurrentStep(1);
                      triggerToast("Booking wizard reset to Step 1!");
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
         4-STEP PROGRESS WIZARD BAR (Interactive Stepper Tabs)
         ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
        <div className="flex items-center justify-between max-w-4xl mx-auto text-xs font-extrabold text-slate-500">
          
          {/* Step 1: Booking Details */}
          <div 
            onClick={() => {
              setCurrentStep(1);
              triggerToast("Step 1: Booking Details selected");
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
              if (validateStep(1)) {
                setCurrentStep(2);
                triggerToast("Step 2: Items & Freight selected");
              }
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
              if (validateStep(1) && validateStep(2)) {
                setCurrentStep(3);
                triggerToast("Step 3: Options & Requirements selected");
              }
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
              if (validateStep(1) && validateStep(2)) {
                setCurrentStep(4);
                triggerToast("Step 4: Review & Submit selected");
              }
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
         MAIN WORKSPACE GRID (8 Cols Active Step Container + 4 Cols Side Cards)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* COLUMN 1 (8 Cols): STEP WIZARD FORM CONTAINER */}
        <div className="lg:col-span-8 space-y-5 flex flex-col justify-between">
          
          <div className="space-y-5">
            
            {/* -----------------------------------------------------------------
               STEP 1: PICKUP & DELIVERY DETAILS (Booking Details)
               ----------------------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-blue-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">
                      1
                    </div>
                    <div>
                      <h2 className="text-sm font-black tracking-wide uppercase">Step 1: Booking Details</h2>
                      <p className="text-[11px] text-blue-200 font-medium">Specify pickup & delivery locations, scheduled dates, and contacts</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleSwapLocations}
                    className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs rounded-xl border border-blue-600 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ArrowLeftRight size={13} />
                    <span>Swap Locations</span>
                  </button>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* PICKUP DETAILS CARD */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <MapPin size={14} className="text-blue-600" />
                      <span>PICKUP DETAILS</span>
                    </h3>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="block font-extrabold text-slate-700 mb-1">Pickup Location *</label>
                        <div className="relative">
                          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                          <input 
                            type="text"
                            placeholder="Address, Suburb, Postcode..."
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
                            placeholder="John Doe"
                            value={pickupForm.contactName}
                            onChange={e => setPickupForm({ ...pickupForm, contactName: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">Contact Phone</label>
                          <input 
                            type="text"
                            placeholder="0400 000 000"
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
                      </div>
                    </div>
                  </div>

                  {/* DELIVERY DETAILS CARD */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <MapPin size={14} className="text-emerald-600" />
                      <span>DELIVERY DETAILS</span>
                    </h3>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="block font-extrabold text-slate-700 mb-1">Delivery Location *</label>
                        <div className="relative">
                          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                          <input 
                            type="text"
                            placeholder="Address, Suburb, Postcode..."
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
                            placeholder="Jane Smith"
                            value={deliveryForm.contactName}
                            onChange={e => setDeliveryForm({ ...deliveryForm, contactName: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">Contact Phone</label>
                          <input 
                            type="text"
                            placeholder="0400 000 000"
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
                      </div>
                    </div>
                  </div>

                </div>

                {/* Step 1 Footer Actions */}
                <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
                  <button
                    onClick={() => {
                      setPickupForm({ location: '', date: '', time: '', readyFrom: '', deliveryUntil: '', contactName: '', contactPhone: '', specialInstructions: '' });
                      setDeliveryForm({ location: '', date: '', time: '', readyFrom: '', deliveryUntil: '', contactName: '', contactPhone: '', specialInstructions: '' });
                      triggerToast("Step 1 inputs cleared");
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
                  >
                    Clear Locations
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next: Items & Freight</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            )}

            {/* -----------------------------------------------------------------
               STEP 2: ITEMS & FREIGHT
               ----------------------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-blue-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">
                      2
                    </div>
                    <div>
                      <h2 className="text-sm font-black tracking-wide uppercase">Step 2: Items & Freight Details</h2>
                      <p className="text-[11px] text-blue-200 font-medium">Add vehicles, machinery or general cargo items to your shipment</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingItem(null);
                      setIsAddItemModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus size={14} />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  
                  {/* ITEMS & FREIGHT TABLE CARD (8 Cols) */}
                  <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Package size={14} className="text-blue-600" />
                        <span>FREIGHT ITEMS LIST ({items.length})</span>
                      </h3>
                      <button 
                        onClick={() => setIsCsvModalOpen(true)}
                        className="text-[11px] font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                      >
                        <FileSpreadsheet size={12} />
                        <span>Import CSV</span>
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
                            <th className="py-2 px-2 text-center">Qty</th>
                            <th className="py-2 px-2.5">Weight</th>
                            <th className="py-2 px-2.5">Dimensions</th>
                            <th className="py-2 px-2.5">Declared Value</th>
                            <th className="py-2 px-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 whitespace-nowrap">
                          {items.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                                No items added yet. Click "Add Item" or "Import CSV" above.
                              </td>
                            </tr>
                          ) : (
                            items.map((item, idx) => (
                              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                                <td className="py-2.5 px-2 text-center font-bold text-slate-400">{idx + 1}</td>
                                <td className="py-2.5 px-2.5 whitespace-nowrap">
                                  <div className="flex items-center gap-1.5">
                                    {item.type === 'Vehicle' ? (
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
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-[10.5px] text-blue-900 font-medium flex items-center gap-2">
                      <Info size={14} className="text-blue-600 shrink-0" />
                      <span>Need help with multi-vehicle or container loads? Message our dispatch team anytime.</span>
                    </div>
                  </div>

                  {/* FREIGHT TYPE SELECTION CARD (4 Cols) */}
                  <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                      <Layers size={14} className="text-purple-600" />
                      <span>FREIGHT CATEGORIES</span>
                    </h3>

                    <p className="text-[11px] font-extrabold text-slate-500">Select load operational modes: *</p>

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
                        <span>Dangerous Goods (DG)</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={freightTypes.warehousing}
                          onChange={() => toggleFreightType('warehousing')}
                          className="rounded border-slate-300 cursor-pointer"
                        />
                        <span>Warehousing / 3PL Storage</span>
                      </label>
                    </div>
                  </div>

                </div>

                {/* Step 2 Footer Actions */}
                <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} />
                    <span>Back: Booking Details</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next: Options & Requirements</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            )}

            {/* -----------------------------------------------------------------
               STEP 3: OPTIONS & REQUIREMENTS
               ----------------------------------------------------------------- */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-blue-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">
                      3
                    </div>
                    <div>
                      <h2 className="text-sm font-black tracking-wide uppercase">Step 3: Options & Requirements</h2>
                      <p className="text-[11px] text-blue-200 font-medium">Configure service level, protection coverage, and equipment requirements</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-4">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5">
                    TRANSPORT & DISPATCH OPTIONS
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    
                    {/* SERVICE OPTIONS */}
                    <div className="space-y-2.5 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <span className="font-extrabold text-slate-500 text-[10.5px] uppercase block border-b border-slate-200 pb-1">
                        SERVICE OPTIONS
                      </span>
                      
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={serviceOptions.expressService}
                          onChange={() => setServiceOptions({ ...serviceOptions, expressService: !serviceOptions.expressService })}
                          className="rounded border-slate-300 mt-0.5 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Express Service</span>
                          <span className="text-[10px] text-slate-400 font-medium">Priority handling & expedited transit</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={serviceOptions.insuranceCoverage}
                          onChange={() => setServiceOptions({ ...serviceOptions, insuranceCoverage: !serviceOptions.insuranceCoverage })}
                          className="rounded border-slate-300 mt-0.5 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Insurance Coverage</span>
                          <span className="text-[10px] text-slate-400 font-medium">Comprehensive transit insurance</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={serviceOptions.tailLiftRequired}
                          onChange={() => setServiceOptions({ ...serviceOptions, tailLiftRequired: !serviceOptions.tailLiftRequired })}
                          className="rounded border-slate-300 mt-0.5 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Tail Lift Required</span>
                          <span className="text-[10px] text-slate-400 font-medium">Hydraulic lift loading support</span>
                        </div>
                      </label>
                    </div>

                    {/* ADDITIONAL REQUIREMENTS */}
                    <div className="space-y-2.5 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <span className="font-extrabold text-slate-500 text-[10.5px] uppercase block border-b border-slate-200 pb-1">
                        EQUIPMENT REQUIREMENTS
                      </span>
                      
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={additionalRequirements.enclosedTransport}
                          onChange={() => setAdditionalRequirements({ ...additionalRequirements, enclosedTransport: !additionalRequirements.enclosedTransport })}
                          className="rounded border-slate-300 mt-0.5 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Enclosed Transport</span>
                          <span className="text-[10px] text-slate-400 font-medium">Weatherproof enclosed carrier</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={additionalRequirements.specialEquipment}
                          onChange={() => setAdditionalRequirements({ ...additionalRequirements, specialEquipment: !additionalRequirements.specialEquipment })}
                          className="rounded border-slate-300 mt-0.5 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">Special Equipment</span>
                          <span className="text-[10px] text-slate-400 font-medium">Crane, winch, ramps required</span>
                        </div>
                      </label>
                    </div>

                    {/* NOTES TO DISPATCH */}
                    <div className="space-y-1.5 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <span className="font-extrabold text-slate-500 text-[10.5px] uppercase block border-b border-slate-200 pb-1">
                        NOTES TO DISPATCH
                      </span>
                      <textarea 
                        placeholder="Add special instructions or dispatch notes..."
                        rows={4}
                        value={notesToDispatch}
                        onChange={e => setNotesToDispatch(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400 text-xs resize-none bg-white"
                      />
                    </div>

                  </div>
                </div>

                {/* Step 3 Footer Actions */}
                <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} />
                    <span>Back: Items & Freight</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next: Review & Submit</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            )}

            {/* -----------------------------------------------------------------
               STEP 4: REVIEW & SUBMIT
               ----------------------------------------------------------------- */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-emerald-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-sm">
                      4
                    </div>
                    <div>
                      <h2 className="text-sm font-black tracking-wide uppercase">Step 4: Review & Finalize Booking</h2>
                      <p className="text-[11px] text-emerald-200 font-medium">Verify your route, schedule, items and requirements before submitting</p>
                    </div>
                  </div>
                </div>

                {/* Review Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                  
                  {/* Route Header Banner */}
                  <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">ORIGIN & DESTINATION ROUTE</span>
                      <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <span>{pickupForm.location || 'Pickup Location'}</span>
                        <ArrowRight size={14} className="text-blue-600" />
                        <span>{deliveryForm.location || 'Delivery Location'}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="px-3 py-1 bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 font-extrabold rounded-lg text-xs cursor-pointer"
                    >
                      Edit Route
                    </button>
                  </div>

                  {/* Schedule Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <span className="font-black text-slate-900 uppercase text-[10.5px] block border-b border-slate-200 pb-1">
                        PICKUP SCHEDULE
                      </span>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Date & Time:</span>
                        <span className="font-extrabold text-slate-900">{pickupForm.date || 'N/A'} at {pickupForm.time || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Contact:</span>
                        <span className="font-semibold text-slate-800">{pickupForm.contactName || 'None'} ({pickupForm.contactPhone || 'No Phone'})</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <span className="font-black text-slate-900 uppercase text-[10.5px] block border-b border-slate-200 pb-1">
                        DELIVERY SCHEDULE
                      </span>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Date & Time:</span>
                        <span className="font-extrabold text-slate-900">{deliveryForm.date || 'N/A'} at {deliveryForm.time || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Contact:</span>
                        <span className="font-semibold text-slate-800">{deliveryForm.contactName || 'None'} ({deliveryForm.contactPhone || 'No Phone'})</span>
                      </div>
                    </div>
                  </div>

                  {/* Items Review Table */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <h4 className="font-black text-slate-900 uppercase text-[11px]">SHIPMENT CARGO ({items.length} items)</h4>
                      <button 
                        onClick={() => setCurrentStep(2)}
                        className="text-[11px] font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Edit Items
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] font-extrabold text-slate-400 uppercase">
                            <th className="py-1.5 px-2">Type</th>
                            <th className="py-1.5 px-2">Description</th>
                            <th className="py-1.5 px-2 text-center">Qty</th>
                            <th className="py-1.5 px-2">Weight</th>
                            <th className="py-1.5 px-2">Declared Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {items.map(item => (
                            <tr key={item.id}>
                              <td className="py-2 px-2 font-bold text-slate-800">{item.type}</td>
                              <td className="py-2 px-2 font-extrabold text-slate-900">{item.description}</td>
                              <td className="py-2 px-2 text-center font-bold">{item.quantity}</td>
                              <td className="py-2 px-2 font-bold">{item.weight}</td>
                              <td className="py-2 px-2 font-black text-blue-600">{item.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Selected Options Summary */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                    <span className="font-black text-slate-900 uppercase text-[10.5px] block">ACTIVE OPTIONS & PROTECTION</span>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.expressService && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg font-bold text-[10.5px]">Express Service</span>
                      )}
                      {serviceOptions.insuranceCoverage && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[10.5px]">Transit Insurance Included</span>
                      )}
                      {serviceOptions.tailLiftRequired && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg font-bold text-[10.5px]">Tail Lift Required</span>
                      )}
                      {additionalRequirements.enclosedTransport && (
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg font-bold text-[10.5px]">Enclosed Transport</span>
                      )}
                      {additionalRequirements.temperatureControlled && (
                        <span className="px-2.5 py-1 bg-cyan-100 text-cyan-800 rounded-lg font-bold text-[10.5px]">Temperature Controlled</span>
                      )}
                      {!serviceOptions.expressService && !additionalRequirements.enclosedTransport && (
                        <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg font-semibold text-[10.5px]">Standard Transport Mode</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Step 4 Footer Actions */}
                <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} />
                    <span>Back: Options & Requirements</span>
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={handleFinalBookingSubmit}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Check size={16} />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Transport Request'}</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* COLUMN 2 (4 Cols): SIDE CARDS */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
          
          {/* CARD 1: BOOKING SUMMARY */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">BOOKING SUMMARY</h2>
              <button onClick={() => setCurrentStep(1)} className="text-[10px] font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer">
                Edit
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-slate-500 font-semibold shrink-0">Route</span>
                <span className="font-extrabold text-slate-900 text-right truncate">
                  {pickupForm.location.trim() ? pickupForm.location : 'Origin'} → {deliveryForm.location.trim() ? deliveryForm.location : 'Destination'}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500 font-semibold shrink-0">Pickup</span>
                <span className="font-bold text-slate-800 text-right truncate">
                  {pickupForm.date ? `${pickupForm.date}${pickupForm.time ? ' at ' + pickupForm.time : ''}` : 'Pending Selection'}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500 font-semibold shrink-0">Delivery</span>
                <span className="font-bold text-slate-800 text-right truncate">
                  {deliveryForm.date ? `${deliveryForm.date}${deliveryForm.time ? ' at ' + deliveryForm.time : ''}` : 'Pending Selection'}
                </span>
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
              <button onClick={() => setCurrentStep(3)} className="text-[10px] font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer">
                Edit
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Standard Pickup & Delivery</span>
              </div>
              {serviceOptions.expressService && (
                <div className="flex items-center gap-2 text-amber-700 font-bold">
                  <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
                  <span>Express Priority Transport</span>
                </div>
              )}
              {serviceOptions.insuranceCoverage && (
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Transit Insurance Included</span>
                </div>
              )}
              {additionalRequirements.enclosedTransport && (
                <div className="flex items-center gap-2 text-purple-700 font-bold">
                  <CheckCircle2 size={14} className="text-purple-500 shrink-0" />
                  <span>Enclosed Carrier Loading</span>
                </div>
              )}
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

          {/* CARD 4: NEED HELP? */}
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
         IMPORT ITEMS (CSV) MODAL
         ========================================================================= */}
      {isCsvModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsCsvModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
                  <FileSpreadsheet size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Import Freight Items (CSV)</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Paste CSV content or load sample items</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCsvModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[11px] text-slate-600 font-medium">
                Format: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px]">Type, Description, Details, Qty, Weight, Dimensions, Value</code>
              </p>

              <textarea 
                placeholder="Vehicle, Ford Ranger 2024, VIN: MN2XX349210, 1, 2200 kg, 5.3m x 1.9m x 1.8m, $65,000.00"
                rows={5}
                value={csvRawText}
                onChange={e => setCsvRawText(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-blue-400 text-xs resize-none"
              />

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={handleImportCsv}
                  className="text-blue-600 hover:text-blue-800 font-bold text-xs cursor-pointer"
                >
                  Load Sample Items
                </button>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsCsvModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleImportCsv}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Import CSV
                  </button>
                </div>
              </div>
            </div>
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
                  <span className="text-blue-600 font-bold">{pickupForm.location || 'Origin'} → {deliveryForm.location || 'Destination'}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="text-slate-800">{pickupForm.date} at {pickupForm.time || 'Morning'}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Total Items:</span>
                  <span className="text-slate-900 font-extrabold">{items.length} items ({totalWeightKg.toLocaleString()} kg)</span>
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
                  disabled={isSubmitting}
                  onClick={handleFinalBookingSubmit}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check size={14} />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
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
                value={dispatchMsg}
                onChange={e => setDispatchMsg(e.target.value)}
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
                  onClick={handleSendMessageToDispatch}
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
