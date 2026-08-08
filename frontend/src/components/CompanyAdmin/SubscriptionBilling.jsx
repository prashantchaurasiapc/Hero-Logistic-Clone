import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ExternalLink, 
  Shield,
  X,
  Lock,
  Download,
  FileText,
  RefreshCw,
  AlertCircle,
  Plus,
  Trash2,
  Mail,
  Check,
  Zap
} from 'lucide-react';

export default function SubscriptionBilling() {
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [stripeTab, setStripeTab] = useState('payment_methods');
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Active Plan State
  const [currentPlan, setCurrentPlan] = useState({
    name: 'Enterprise Fleet',
    billing: 'Billed annually at $12,000/yr',
    price: '$12,000',
    nextDate: '14 Sep 2026',
    status: 'ACTIVE',
  });

  // Payment Methods State
  const [paymentCards, setPaymentCards] = useState([
    { id: 'c1', type: 'VISA', last4: '4122', exp: '08/2028', holder: 'HERO LOGISTICS LTD', isDefault: true },
    { id: 'c2', type: 'MASTERCARD', last4: '8891', exp: '11/2027', holder: 'JOHN SMITH (DIRECTOR)', isDefault: false },
  ]);

  // Form states inside Stripe portal
  const [editingCardId, setEditingCardId] = useState(null);
  const [editCardForm, setEditCardForm] = useState({ holder: '', exp: '' });
  
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newCardForm, setNewCardForm] = useState({ number: '', exp: '', cvc: '', holder: '', type: 'VISA' });

  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);
  const [emailSentId, setEmailSentId] = useState(null);

  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [selectedPlanOption, setSelectedPlanOption] = useState('enterprise');
  const [billingCycle, setBillingCycle] = useState('annual');

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('Cost management');

  const handleStripeClick = () => {
    setShowStripeModal(true);
    setUpdateSuccess('');
    setShowAddCardForm(false);
    setEditingCardId(null);
    setShowPlanSelector(false);
    setShowCancelConfirm(false);
  };

  const notifySuccess = (msg) => {
    setUpdateSuccess(msg);
    setTimeout(() => setUpdateSuccess(''), 3500);
  };

  // Card Handlers
  const handleSetDefaultCard = (id) => {
    setPaymentCards(cards => cards.map(c => ({ ...c, isDefault: c.id === id })));
    notifySuccess('Default payment card updated.');
  };

  const handleDeleteCard = (id) => {
    if (paymentCards.length <= 1) {
      alert('You must maintain at least one payment method on file.');
      return;
    }
    setPaymentCards(cards => cards.filter(c => c.id !== id));
    notifySuccess('Payment method removed.');
  };

  const handleSaveEditCard = (id) => {
    setPaymentCards(cards => cards.map(c => c.id === id ? { ...c, holder: editCardForm.holder, exp: editCardForm.exp } : c));
    setEditingCardId(null);
    notifySuccess('Card details saved successfully.');
  };

  const handleSaveNewCard = (e) => {
    e.preventDefault();
    if (!newCardForm.number || !newCardForm.exp) return;
    const last4 = newCardForm.number.slice(-4) || '9912';
    const newCard = {
      id: `c_${Date.now()}`,
      type: newCardForm.type,
      last4: last4,
      exp: newCardForm.exp || '12/2029',
      holder: newCardForm.holder.toUpperCase() || 'HERO LOGISTICS LTD',
      isDefault: false,
    };
    setPaymentCards(prev => [...prev, newCard]);
    setShowAddCardForm(false);
    setNewCardForm({ number: '', exp: '', cvc: '', holder: '', type: 'VISA' });
    notifySuccess(`New ${newCardForm.type} card ending in ${last4} added successfully.`);
  };

  // Invoice Handlers
  const handleDownloadInvoice = (inv) => {
    const content = `========================================\nHERO LOGISTICS LTD - OFFICIAL INVOICE\n========================================\nInvoice ID: ${inv.id}\nDate: ${inv.date}\nAmount: ${inv.amount}\nStatus: PAID\nPlan: Enterprise Fleet SaaS (1 Year)\nTax / GST (10%): $1,090.91\nPayment Method: Visa ending in 4122\n\nThank you for choosing Hero Logistics.\n========================================`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${inv.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notifySuccess(`Invoice ${inv.id} downloaded.`);
  };

  const handleSendEmailReceipt = (invId) => {
    setEmailSentId(invId);
    notifySuccess(`Receipt for ${invId} sent to billing@herologistics.com`);
    setTimeout(() => setEmailSentId(null), 3000);
  };

  // Plan Handlers
  const handleConfirmPlanChange = () => {
    if (selectedPlanOption === 'starter') {
      setCurrentPlan({
        name: 'Starter Fleet',
        billing: billingCycle === 'annual' ? 'Billed annually at $2,999/yr' : 'Billed monthly at $299/mo',
        price: '$2,999',
        nextDate: '14 Sep 2026',
        status: 'ACTIVE',
      });
    } else if (selectedPlanOption === 'pro') {
      setCurrentPlan({
        name: 'Pro Fleet',
        billing: billingCycle === 'annual' ? 'Billed annually at $6,500/yr' : 'Billed monthly at $649/mo',
        price: '$6,500',
        nextDate: '14 Sep 2026',
        status: 'ACTIVE',
      });
    } else {
      setCurrentPlan({
        name: 'Enterprise Fleet',
        billing: billingCycle === 'annual' ? 'Billed annually at $12,000/yr' : 'Billed monthly at $1,199/mo',
        price: '$12,000',
        nextDate: '14 Sep 2026',
        status: 'ACTIVE',
      });
    }
    setShowPlanSelector(false);
    notifySuccess('Subscription plan updated live!');
  };

  const handleConfirmCancel = () => {
    setCurrentPlan(prev => ({
      ...prev,
      status: 'CANCELLED_SCHEDULED',
    }));
    setShowCancelConfirm(false);
    notifySuccess('Subscription set to cancel at end of billing cycle (14 Sep 2026).');
  };

  const defaultCard = paymentCards.find(c => c.isDefault) || paymentCards[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto bg-[#FAFAFA] min-h-screen text-left flex flex-col space-y-5 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-1">
        <div className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-700 shadow-sm flex-shrink-0">
          <CreditCard size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none mb-1">Subscription & Billing</h1>
          <p className="text-gray-500 text-xs">Manage your HERO SaaS subscription and payment methods.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          
          {/* Active Plan Card */}
          <div className="bg-[#0B0F19] rounded-[20px] p-5 sm:p-7 shadow-lg text-white border border-slate-800/50 relative overflow-hidden">
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className={`inline-block px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded mb-3 ${
                  currentPlan.status === 'CANCELLED_SCHEDULED' ? 'bg-rose-500 text-white' : 'bg-brand-500 text-black'
                }`}>
                  {currentPlan.status === 'CANCELLED_SCHEDULED' ? 'Cancels 14 Sep' : 'Active Plan'}
                </span>
                <h2 className="text-xl font-bold tracking-tight mb-1">{currentPlan.name}</h2>
                <p className="text-slate-400 text-[11px]">{currentPlan.billing}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">Next Billing Date</p>
                <p className="text-lg font-bold text-white tracking-tight">{currentPlan.nextDate}</p>
              </div>
            </div>

            <hr className="border-slate-800 my-6" />

            <div>
              <h3 className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-4">Plan Inclusions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-5">
                {[
                  'Unlimited Branches & Warehouses',
                  'Advanced Driver Routing (AI)',
                  'Predictive Fleet Maintenance',
                  '24/7 Priority Hotline Support',
                  'Dedicated Success Manager',
                  'API & ERP Access Keys'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-[#00D47E] shrink-0" strokeWidth={2.5} />
                    <span className="text-[11px] font-semibold text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-7 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium">
                <Clock size={12} />
                <span>Subscription active since Sep 2024</span>
              </div>
              <button onClick={handleStripeClick} className="text-white text-[10px] font-bold hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer">
                Compare available plans <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Cancellation Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-[13px] font-bold text-gray-900 mb-0.5">Cancellation</h3>
              <p className="text-[11px] text-gray-500 font-medium">You can cancel or pause your subscription at any time.</p>
            </div>
            <button onClick={handleStripeClick} className="px-4 py-1.5 bg-white border border-red-200 text-red-600 text-[11px] font-bold rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
              {currentPlan.status === 'CANCELLED_SCHEDULED' ? 'Manage Cancellation' : 'Cancel Plan'}
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">
          
          {/* Payment Method Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-gray-400 text-[9px] font-bold uppercase tracking-wider mb-3">Payment Method</h3>
            
            {/* Credit Card Mockup */}
            <div className="bg-[#0B0F19] rounded-[16px] p-4 mb-4 shadow-lg relative overflow-hidden h-[140px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="bg-white px-2 py-0.5 rounded-[4px] text-[9px] font-black text-[#1A1F71] tracking-widest">
                  {defaultCard.type}
                </div>
                <Shield size={14} className="text-brand-500 fill-brand-500" strokeWidth={0} />
              </div>
              
              <div className="text-white text-[15px] tracking-[0.25em] font-mono mt-3">
                **** **** **** {defaultCard.last4}
              </div>
              
              <div className="flex justify-between items-end mt-2">
                <div className="text-gray-400 text-[8px] uppercase font-bold tracking-widest truncate max-w-[150px]">
                  {defaultCard.holder}
                </div>
                <div className="text-gray-400 text-[8px] font-bold tracking-wider">
                  {defaultCard.exp}
                </div>
              </div>
            </div>

            <button 
              onClick={handleStripeClick}
              className="w-full py-2.5 bg-[#635BFF] hover:bg-[#524BDE] text-white text-[11px] font-bold rounded-xl transition-all shadow-md shadow-indigo-200 mb-2 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Manage in Stripe <ExternalLink size={13} strokeWidth={2.5} />
            </button>
            <p className="text-center text-[9px] text-gray-400 font-medium">
              Secure billing portal provided by Stripe, Inc.
            </p>
          </div>

          {/* Billing History Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-gray-400 text-[9px] font-bold uppercase tracking-wider mb-3">Billing History</h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900 mb-0.5">$12,000.00</h4>
                  <p className="text-[9px] text-gray-400 font-bold">14 Sep 2025</p>
                </div>
                <span className="px-1.5 py-0.5 bg-[#ECFDF5] text-[#059669] text-[8px] font-bold uppercase tracking-wider rounded">
                  Paid
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900 mb-0.5">$10,500.00</h4>
                  <p className="text-[9px] text-gray-400 font-bold">14 Sep 2024</p>
                </div>
                <span className="px-1.5 py-0.5 bg-[#ECFDF5] text-[#059669] text-[8px] font-bold uppercase tracking-wider rounded">
                  Paid
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Simulated Stripe Customer Portal Modal */}
      {showStripeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]" onClick={() => setShowStripeModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[620px] shadow-2xl overflow-hidden border border-slate-200" onClick={e => e.stopPropagation()}>
            
            {/* Stripe Header */}
            <div className="bg-[#635BFF] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-sm">
                  S
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight leading-tight">Stripe Customer Billing Portal</h3>
                  <p className="text-[10px] text-indigo-100 font-medium">Hero Logistics Ltd • Customer #cus_928174</p>
                </div>
              </div>
              <button onClick={() => setShowStripeModal(false)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Portal Navigation */}
            <div className="flex border-b border-slate-100 bg-slate-50 px-6 gap-6">
              {[
                { id: 'payment_methods', label: 'Payment Methods' },
                { id: 'invoices', label: 'Tax Invoices & Receipts' },
                { id: 'subscription', label: 'Plan & Billing Cycle' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setStripeTab(tab.id);
                    setEditingCardId(null);
                    setShowAddCardForm(false);
                    setShowPlanSelector(false);
                    setShowCancelConfirm(false);
                  }}
                  className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${stripeTab === tab.id ? 'border-[#635BFF] text-[#635BFF]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-6 space-y-4 text-left max-h-[70vh] overflow-y-auto">
              {updateSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{updateSuccess}</span>
                </div>
              )}

              {/* ══════════════ TAB 1: Payment Methods ══════════════ */}
              {stripeTab === 'payment_methods' && (
                <div className="space-y-4">
                  {/* Card List */}
                  <div className="space-y-3">
                    {paymentCards.map(card => (
                      <div key={card.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-7 bg-slate-900 rounded text-[9px] font-black text-white flex items-center justify-center font-mono">
                              {card.type}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-slate-900">{card.type} ending in {card.last4}</p>
                                {card.isDefault && (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-extrabold rounded-md">Default</span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium">{card.holder} • Expires {card.exp}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!card.isDefault && (
                              <button 
                                onClick={() => handleSetDefaultCard(card.id)}
                                className="text-[10px] font-bold text-indigo-600 hover:underline"
                              >
                                Make Default
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setEditingCardId(editingCardId === card.id ? null : card.id);
                                setEditCardForm({ holder: card.holder, exp: card.exp });
                              }}
                              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            {!card.isDefault && (
                              <button 
                                onClick={() => handleDeleteCard(card.id)}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Inline Card Edit Form */}
                        {editingCardId === card.id && (
                          <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cardholder Name</label>
                              <input 
                                type="text" 
                                value={editCardForm.holder} 
                                onChange={e => setEditCardForm({ ...editCardForm, holder: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500" 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expiry Date (MM/YY)</label>
                              <input 
                                type="text" 
                                value={editCardForm.exp} 
                                onChange={e => setEditCardForm({ ...editCardForm, exp: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500" 
                              />
                            </div>
                            <div className="col-span-2 flex justify-end gap-2 mt-1">
                              <button onClick={() => setEditingCardId(null)} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">Cancel</button>
                              <button onClick={() => handleSaveEditCard(card.id)} className="px-4 py-1 bg-[#635BFF] text-white rounded-lg text-xs font-bold">Save Card</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Card Form toggle */}
                  {!showAddCardForm ? (
                    <button 
                      onClick={() => setShowAddCardForm(true)}
                      className="w-full py-3 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 text-indigo-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus size={15} /> Add New Payment Method
                    </button>
                  ) : (
                    <form onSubmit={handleSaveNewCard} className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-black text-slate-900">Add Credit / Debit Card</h4>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Card Number</label>
                        <input 
                          type="text" required placeholder="4111 2222 3333 4444"
                          value={newCardForm.number} onChange={e => setNewCardForm({ ...newCardForm, number: e.target.value })}
                          className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expiry (MM/YY)</label>
                          <input 
                            type="text" required placeholder="09/28"
                            value={newCardForm.exp} onChange={e => setNewCardForm({ ...newCardForm, exp: e.target.value })}
                            className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">CVC / CVV</label>
                          <input 
                            type="text" required placeholder="123" maxLength={4}
                            value={newCardForm.cvc} onChange={e => setNewCardForm({ ...newCardForm, cvc: e.target.value })}
                            className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cardholder Name</label>
                        <input 
                          type="text" required placeholder="HERO LOGISTICS LTD"
                          value={newCardForm.holder} onChange={e => setNewCardForm({ ...newCardForm, holder: e.target.value })}
                          className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500" 
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setShowAddCardForm(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-[#635BFF] text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm">Save & Add Card</button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ══════════════ TAB 2: Tax Invoices & Receipts ══════════════ */}
              {stripeTab === 'invoices' && (
                <div className="space-y-3">
                  {[
                    { id: 'in_1P928174', amount: '$12,000.00', date: '14 Sep 2025', plan: 'Enterprise Fleet (1 Year)', tax: '$1,090.91' },
                    { id: 'in_1M817263', amount: '$10,500.00', date: '14 Sep 2024', plan: 'Enterprise Fleet (1 Year)', tax: '$954.55' },
                  ].map(inv => (
                    <div key={inv.id} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                            <FileText size={18} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{inv.amount} — {inv.plan}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{inv.date} • Invoice #{inv.id}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setExpandedInvoiceId(expandedInvoiceId === inv.id ? null : inv.id)}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            {expandedInvoiceId === inv.id ? 'Hide' : 'Details'}
                          </button>
                          <button 
                            onClick={() => handleSendEmailReceipt(inv.id)}
                            className="p-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
                            title="Email Receipt"
                          >
                            <Mail size={14} className={emailSentId === inv.id ? 'text-emerald-600' : 'text-slate-500'} />
                          </button>
                          <button 
                            onClick={() => handleDownloadInvoice(inv)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#635BFF] text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                          >
                            <Download size={13} /> PDF
                          </button>
                        </div>
                      </div>

                      {/* Invoice Details Dropdown */}
                      {expandedInvoiceId === inv.id && (
                        <div className="bg-white border-t border-slate-200 p-4 space-y-2 text-xs">
                          <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-bold">{(parseFloat(inv.amount.replace('$','').replace(',','')) - parseFloat(inv.tax.replace('$','').replace(',',''))).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Tax / GST (10%)</span>
                            <span className="font-bold">{inv.tax}</span>
                          </div>
                          <div className="flex justify-between text-slate-900 font-extrabold pt-2 border-t border-slate-100">
                            <span>Total Paid</span>
                            <span className="text-emerald-600">{inv.amount}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ══════════════ TAB 3: Plan & Billing Cycle ══════════════ */}
              {stripeTab === 'subscription' && (
                <div className="space-y-4">
                  {/* Current status banner */}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-indigo-950">Active Plan: {currentPlan.name}</p>
                        <p className="text-[11px] font-semibold text-indigo-700 mt-0.5">{currentPlan.billing}</p>
                      </div>
                      <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider">
                        {currentPlan.status}
                      </span>
                    </div>
                  </div>

                  {/* Plan Switcher form */}
                  {!showPlanSelector && !showCancelConfirm && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowPlanSelector(true)}
                        className="flex-1 py-3 bg-[#635BFF] hover:bg-[#524BDE] text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap size={14} /> Change Subscription Plan
                      </button>
                      <button 
                        onClick={() => setShowCancelConfirm(true)}
                        className="px-4 py-3 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Cancel Plan
                      </button>
                    </div>
                  )}

                  {/* Plan Selector Interface */}
                  {showPlanSelector && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-900">Choose New Plan</h4>
                        <div className="flex bg-slate-200 p-1 rounded-lg text-[10px] font-bold">
                          <button onClick={() => setBillingCycle('annual')} className={`px-3 py-1 rounded-md ${billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}>Annual (10% Off)</button>
                          <button onClick={() => setBillingCycle('monthly')} className={`px-3 py-1 rounded-md ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}>Monthly</button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {[
                          { id: 'starter', name: 'Starter Fleet', price: billingCycle === 'annual' ? '$2,999/yr' : '$299/mo', desc: 'Up to 5 trucks & basic routing' },
                          { id: 'pro', name: 'Pro Fleet', price: billingCycle === 'annual' ? '$6,500/yr' : '$649/mo', desc: 'Up to 25 trucks + AI load builder' },
                          { id: 'enterprise', name: 'Enterprise Fleet', price: billingCycle === 'annual' ? '$12,000/yr' : '$1,199/mo', desc: 'Unlimited trucks + Dedicated Manager' },
                        ].map(plan => (
                          <div 
                            key={plan.id}
                            onClick={() => setSelectedPlanOption(plan.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                              selectedPlanOption === plan.id ? 'border-indigo-600 bg-indigo-50/70 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div>
                              <p className="text-xs font-black text-slate-900">{plan.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">{plan.desc}</p>
                            </div>
                            <span className="text-xs font-black text-indigo-600">{plan.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                        <button onClick={() => setShowPlanSelector(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Cancel</button>
                        <button onClick={handleConfirmPlanChange} className="px-5 py-2 bg-[#635BFF] text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm">Confirm Plan Switch</button>
                      </div>
                    </div>
                  )}

                  {/* Cancel Confirmation Interface */}
                  {showCancelConfirm && (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-rose-700 text-xs font-black">
                        <AlertCircle size={16} /> Confirm Subscription Cancellation
                      </div>
                      <p className="text-[11px] text-rose-600 font-medium">Your plan will remain active until 14 Sep 2026. After that date, features will be restricted.</p>

                      <div>
                        <label className="block text-[10px] font-bold text-rose-800 uppercase tracking-widest mb-1">Reason for cancellation</label>
                        <select 
                          value={cancelReason} onChange={e => setCancelReason(e.target.value)}
                          className="w-full border border-rose-200 bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                        >
                          <option>Cost management</option>
                          <option>Found alternative software</option>
                          <option>Temporary business pause</option>
                          <option>Missing features</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setShowCancelConfirm(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Keep Subscription</button>
                        <button onClick={handleConfirmCancel} className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-sm">Confirm Cancellation</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stripe Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <Lock size={12} className="text-emerald-500" />
                <span>256-Bit SSL Encrypted by Stripe, Inc.</span>
              </div>
              <button onClick={() => setShowStripeModal(false)} className="text-slate-600 hover:text-slate-900 font-bold underline cursor-pointer">
                Return to Hero Logistics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
