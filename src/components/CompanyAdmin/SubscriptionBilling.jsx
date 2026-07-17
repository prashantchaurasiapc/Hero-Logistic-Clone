import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Clock, ChevronRight, ExternalLink, Shield } from 'lucide-react';

export default function SubscriptionBilling() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleStripeRedirect = () => {
    setIsRedirecting(true);
    setTimeout(() => setIsRedirecting(false), 3000);
  };

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
          <div className="bg-[#0B0F19] rounded-[20px] p-5 sm:p-7 shadow-lg text-white border border-slate-800/50">
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className="inline-block px-2 py-0.5 bg-[#FFD400] text-black text-[9px] font-extrabold uppercase tracking-widest rounded mb-3">
                  Active Plan
                </span>
                <h2 className="text-xl font-bold tracking-tight mb-1">Enterprise Fleet</h2>
                <p className="text-slate-400 text-[11px]">Billed annually at $12,000/yr</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-1">Next Billing Date</p>
                <p className="text-lg font-bold text-white tracking-tight">14 Sep 2026</p>
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
              <button className="text-white text-[10px] font-bold hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer">
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
            <button className="px-4 py-1.5 bg-white border border-red-200 text-red-600 text-[11px] font-bold rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
              Cancel Plan
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
                  VISA
                </div>
                <Shield size={14} className="text-[#FFD400] fill-[#FFD400]" strokeWidth={0} />
              </div>
              
              <div className="text-white text-[15px] tracking-[0.25em] font-mono mt-3">
                **** **** **** 4122
              </div>
              
              <div className="flex justify-between items-end mt-2">
                <div className="text-gray-400 text-[8px] uppercase font-bold tracking-widest">
                  HERO LOGISTICS LTD
                </div>
                <div className="text-gray-400 text-[8px] font-bold tracking-wider">
                  08/28
                </div>
              </div>
            </div>

            <button 
              onClick={handleStripeRedirect}
              className="w-full py-2 bg-[#635BFF] hover:bg-[#524BDE] text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm mb-2 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Manage in Stripe <ExternalLink size={12} strokeWidth={2.5} />
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

      {/* Redirecting Toast */}
      {isRedirecting && (
        <div className="fixed bottom-6 right-6 bg-white px-5 py-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-50 transition-all duration-300">
          <p className="text-[14px] font-semibold text-gray-900 tracking-tight">Redirecting to Stripe Customer Portal...</p>
        </div>
      )}
    </div>
  );
}
