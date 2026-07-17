  if (selectedCustomer) {
    return (
      <div className="flex-grow bg-[#F8FAFC] p-2 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-start gap-4">
            <button onClick={() => setSelectedCustomer(null)} className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer mt-1 shrink-0">
              <ChevronLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {activeDetailsTab === 'Contacts' ? '6.3 - Customer Contacts' :
                   activeDetailsTab === 'Billing Rules' ? '6.4 - Customer Billing Rules' :
                   activeDetailsTab === 'Pricing' ? '6.5 - Customer Pricing' :
                   '6.2 - Customer Details'
                  } 
                </h2>
                <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-widest">Active Customer</span>
                <span className="text-[10px] text-slate-400 font-semibold">Customer since: 12 Feb 2022</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {selectedCustomer.name} <Star size={20} className="text-amber-400 fill-amber-400" />
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              <Plus size={14} /> Create Load
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              <MessageSquare size={14} /> Message
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              <Edit size={14} /> Edit Customer
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              More Actions <MoreVertical size={14} />
            </button>
          </div>
        </div>

        {/* Stats / Title Bar */}
        <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-2xl border border-blue-100 shrink-0">
              {selectedCustomer.id}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-black text-slate-900">{selectedCustomer.name}</h2>
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ml-1">Active</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 mb-2">
                <span>ABN: {selectedCustomer.abn || '68 961 770 797'}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>ACN: 123 456 789</span>
              </div>
              <div>
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[8px] uppercase font-black tracking-widest">Strategic Account</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 items-start xl:items-center justify-end w-full xl:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs border border-indigo-100 shrink-0">
                SM
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Account Manager</p>
                <p className="text-sm font-bold text-slate-900">{selectedCustomer.manager}</p>
                <p className="text-[10px] text-slate-500 font-semibold">{selectedCustomer.contactEmail || 'sarah.m@herologistics.com'}</p>
              </div>
            </div>
            
            <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Billing Terms</p>
              <p className="text-sm font-black text-slate-900">14 Days EOM</p>
            </div>

            <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Credit Limit</p>
              <p className="text-sm font-black text-slate-900">$250,000.00</p>
            </div>

            <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 text-right">Outstanding</p>
              <p className="text-sm font-black text-red-600 text-right mb-0.5">$32,450.00</p>
              <div className="flex justify-between items-center text-[9px] font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Credit Available</span>
                <span className="text-emerald-600 ml-3 font-black text-[10px]">$217,550.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-6 overflow-x-auto custom-scrollbar pb-1">
          {['Overview', 'Contacts', 'Billing Rules', 'Pricing', 'Transport Modules', 'Instructions', 'Documents', 'Activity', 'Financials'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveDetailsTab(tab)}
              className={`text-[10px] pb-3 uppercase tracking-widest font-black whitespace-nowrap transition-colors relative cursor-pointer ${
                activeDetailsTab === tab 
                  ? 'text-blue-600' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {activeDetailsTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {activeDetailsTab === 'Overview' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Flat Grid Structure */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Row 1 */}
              {/* Company Info */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <FileText size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Company Information</h3>
                  </div>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 border border-slate-100 px-2 py-1 rounded bg-slate-50 cursor-pointer">
                    <Edit size={12} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm font-semibold text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Trading Name</span>
                    <span className="text-xs text-slate-900 font-bold">{selectedCustomer.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Phone</span>
                    <span className="text-xs text-slate-900 font-bold">0415 166 693</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">ABN</span>
                    <span className="text-xs text-slate-900 font-bold">{selectedCustomer.abn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Email</span>
                    <span className="text-xs text-slate-900 font-bold">casey.davis@example.com</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">ACN</span>
                    <span className="text-xs text-slate-900 font-bold">123 456 789</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Website</span>
                    <span className="text-xs text-slate-900 font-bold">www.abcmotors.com.au</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Industry</span>
                    <span className="text-xs text-slate-900 font-bold">Automotive</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Customer Since</span>
                    <span className="text-xs text-slate-900 font-bold">12 Feb 2022</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Address</span>
                    <span className="text-xs text-slate-900 font-bold block leading-tight">25 Corporate Drive<br/>Epping NSW 2121<br/>Australia</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Status</span>
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider inline-block mb-2">Active</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Customer Type</span>
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider inline-block">Business</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Activity size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Quick Actions</h3>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm group">
                    <Plus size={18} className="mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-center leading-tight">Create<br/>Load</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm group">
                    <Eye size={18} className="mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-center leading-tight">View<br/>Loads</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm group">
                    <Plus size={18} className="mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-center leading-tight">Create<br/>Invoice</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm group">
                    <MessageSquare size={18} className="mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-center leading-tight">Send<br/>Message</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm group">
                    <FileText size={18} className="mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-center leading-tight">View<br/>Invoices</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm group">
                    <Edit size={18} className="mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-center leading-tight">Edit<br/>Customer</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm group">
                    <UserPlus size={18} className="mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-center leading-tight">Add<br/>Contact</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm group">
                    <Upload size={18} className="mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-center leading-tight">Upload<br/>Document</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm group">
                    <MoreVertical size={18} className="mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-center leading-tight">More<br/>Actions</span>
                  </button>
                </div>
              </div>

              {/* Notes & Tags */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Star size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Notes & Tags</h3>
                  </div>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 border border-slate-100 px-2 py-1 rounded bg-slate-50 cursor-pointer">
                    <Edit size={12} /> Edit
                  </button>
                </div>
                
                <div className="mb-5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Internal Notes</p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      Priority customer. Regular car carrier runs.
                    </p>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      Weekly exports to Brisbane port.
                    </p>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      Requires advance booking for all pickups.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-black uppercase tracking-wider border border-indigo-100 shadow-sm">Car Carrying</span>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-[10px] font-black uppercase tracking-wider border border-amber-100 shadow-sm">VIP</span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-100 shadow-sm">Regular</span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-black uppercase tracking-wider border border-slate-200 shadow-sm">Export</span>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              {/* Contacts */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Users size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Contacts</h3>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    <Plus size={12} /> Add Contact
                  </button>
                </div>
                <div className="space-y-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-xs border border-indigo-100 shrink-0">JS</div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 truncate">John Smith</p>
                        <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ml-2 shrink-0">Primary</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mt-0.5">
                        <Phone size={10} /> 0401 234 567
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                        <Mail size={10} /> john.smith@abcmotors.com.au
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-xs border border-emerald-100 shrink-0">MK</div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 truncate">Michael King</p>
                        <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ml-2 shrink-0">Accounts</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mt-0.5">
                        <Phone size={10} /> 0412 345 678
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                        <Mail size={10} /> michael.king@abcmotors.com.au
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 font-black flex items-center justify-center text-xs border border-amber-100 shrink-0">SP</div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 truncate">Sarah Patel</p>
                        <span className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ml-2 shrink-0">Operations</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mt-0.5">
                        <Phone size={10} /> 0411 567 890
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                        <Mail size={10} /> sarah.patel@abcmotors.com.au
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 font-black flex items-center justify-center text-xs border border-red-100 shrink-0">AH</div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 truncate">After Hours</p>
                        <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ml-2 shrink-0">After Hours</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mt-0.5">
                        <Phone size={10} /> 1300 123 456
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                        <Mail size={10} /> afterhours@abcmotors.com.au
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    View All Contacts <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Transport Modules */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Truck size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Transport Modules</h3>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    Manage Modules
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200">
                      <Car size={14} className="text-slate-600" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-900">Car Carrying</p>
                        <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider">Enabled</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Special requirements and rules configured</p>
                    </div>
                    <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 shrink-0 cursor-pointer">View Details &rarr;</button>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200">
                      <Package size={14} className="text-slate-600" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-900">General Freight</p>
                        <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider">Enabled</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Standard rates and rules applied</p>
                    </div>
                    <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 shrink-0 cursor-pointer">View Details &rarr;</button>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded bg-red-50 flex items-center justify-center shrink-0 border border-red-200">
                      <AlertCircle size={14} className="text-red-500" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-400">Dangerous Goods</p>
                        <span className="text-slate-400 text-[8px] uppercase font-black tracking-wider">Disabled</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Module not enabled for this customer</p>
                    </div>
                    <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 shrink-0 cursor-pointer">Enable Module</button>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200">
                      <Building2 size={14} className="text-slate-600" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-900">Warehousing</p>
                        <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider">Enabled</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Storage and handling configured</p>
                    </div>
                    <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 shrink-0 cursor-pointer">View Details &rarr;</button>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2 text-slate-800">
                    <DollarSign size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Financial Summary</h3>
                  </div>
                </div>
                <div className="space-y-4 flex-grow">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Outstanding (Overdue)</span>
                    <span className="font-black text-red-600">$12,450.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Outstanding (Current)</span>
                    <span className="font-black text-slate-900">$20,000.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                    <span className="text-slate-900 font-black">Total Outstanding</span>
                    <span className="font-black text-slate-900">$32,450.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2">
                    <span className="text-slate-500 font-bold">Credit Limit</span>
                    <span className="font-black text-slate-900">$250,000.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Credit Available</span>
                    <span className="font-black text-emerald-600">$217,550.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-4 border-t border-slate-100">
                    <span className="text-slate-500 font-bold">Revenue (This Month)</span>
                    <span className="font-black text-slate-900">$320,400.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Revenue (YTD)</span>
                    <span className="font-black text-slate-900">$2,480,650.00</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    View Financial Details <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Row 3 */}
              {/* Recent Loads (spans 2) */}
              <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Truck size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Recent Loads</h3>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    View All Loads <ArrowRight size={12} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="py-3 px-5">LOAD REF</th>
                        <th className="py-3 px-5">STATUS</th>
                        <th className="py-3 px-5">TYPE</th>
                        <th className="py-3 px-5">PICKUP</th>
                        <th className="py-3 px-5">DELIVERY</th>
                        <th className="py-3 px-5">DRIVER</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-5 font-black text-blue-600">PO-12546</td>
                        <td className="py-4 px-5"><span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Active</span></td>
                        <td className="py-4 px-5">Car Carrying</td>
                        <td className="py-4 px-5">Melbourne</td>
                        <td className="py-4 px-5">Brisbane</td>
                        <td className="py-4 px-5">Mike Thompson</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-5 font-black text-blue-600">PO-12540</td>
                        <td className="py-4 px-5"><span className="text-[9px] font-black uppercase tracking-widest text-blue-600">Completed</span></td>
                        <td className="py-4 px-5">Car Carrying</td>
                        <td className="py-4 px-5">Sydney</td>
                        <td className="py-4 px-5">Adelaide</td>
                        <td className="py-4 px-5">David Wilson</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-5 font-black text-blue-600">PO-12530</td>
                        <td className="py-4 px-5"><span className="text-[9px] font-black uppercase tracking-widest text-blue-600">Completed</span></td>
                        <td className="py-4 px-5">General Freight</td>
                        <td className="py-4 px-5">Brisbane</td>
                        <td className="py-4 px-5">Melbourne</td>
                        <td className="py-4 px-5">Chris Lee</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-5 font-black text-slate-400">PO-12515</td>
                        <td className="py-4 px-5"><span className="text-[9px] font-black uppercase tracking-widest text-red-500">Cancelled</span></td>
                        <td className="py-4 px-5">Car Carrying</td>
                        <td className="py-4 px-5">Sydney</td>
                        <td className="py-4 px-5">Perth</td>
                        <td className="py-4 px-5 italic text-slate-400">Not Assigned</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <FileText size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Special Instructions</h3>
                  </div>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 border border-slate-100 px-2 py-1 rounded bg-slate-50 cursor-pointer">
                    <Edit size={12} /> Edit
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
                      <CheckCircle2 size={12} className="text-blue-600" /> Delivery Instructions
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 pl-4 leading-relaxed">
                      Report to receiving office before unloading. Photo POD required for all deliveries.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
                      <CheckCircle2 size={12} className="text-blue-600" /> Site Requirements
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 pl-4 leading-relaxed">
                      High visibility vest must be worn on site. Speed limit 10km/h within yard.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
                      <CheckCircle2 size={12} className="text-blue-600" /> Booking Requirements
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 pl-4 leading-relaxed">
                      All deliveries must be booked 24hrs in advance. Contact operations for scheduling.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
                      <CheckCircle2 size={12} className="text-blue-600" /> Access Information
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 pl-4 leading-relaxed">
                      Main gate code: 2580#<br/>Please sign in at security.
                    </p>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    View All Instructions <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Row 4 */}
              {/* Documents */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <FileText size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Documents</h3>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 cursor-pointer">
                    View All
                  </button>
                </div>
                <div className="space-y-3 flex-grow">
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-red-500"><FileText size={16} /></div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">Master Service Agreement</h4>
                        <p className="text-[9px] font-semibold text-slate-400 mt-0.5">PDF • 1.2 MB • 12/02/2022</p>
                      </div>
                    </div>
                    <Download size={14} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-red-500"><FileText size={16} /></div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">Rate Card 2025</h4>
                        <p className="text-[9px] font-semibold text-slate-400 mt-0.5">PDF • 420 KB • 01/01/2025</p>
                      </div>
                    </div>
                    <Download size={14} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-red-500"><FileText size={16} /></div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">Insurance Certificate</h4>
                        <p className="text-[9px] font-semibold text-slate-400 mt-0.5">PDF • 880 KB • 12/01/2025</p>
                      </div>
                    </div>
                    <Download size={14} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-red-500"><FileText size={16} /></div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">Safety Requirements</h4>
                        <p className="text-[9px] font-semibold text-slate-400 mt-0.5">PDF • 950 KB • 05/02/2025</p>
                      </div>
                    </div>
                    <Download size={14} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Recent Invoices */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-800">
                    <FileText size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Recent Invoices</h3>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    View All Invoices <ArrowRight size={12} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px]">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 font-black text-slate-400 uppercase tracking-widest">
                        <th className="py-3 px-4">INVOICE #</th>
                        <th className="py-3 px-4">DATE</th>
                        <th className="py-3 px-4 text-right">AMOUNT</th>
                        <th className="py-3 px-4 text-center">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-black text-blue-600">INV-2487</td>
                        <td className="py-4 px-4">07/07/2025</td>
                        <td className="py-4 px-4 font-black text-slate-900 text-right">$18,500.00</td>
                        <td className="py-4 px-4 text-center"><span className="text-[9px] font-black uppercase tracking-widest text-red-500">Unpaid</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-black text-blue-600">INV-2456</td>
                        <td className="py-4 px-4">23/06/2025</td>
                        <td className="py-4 px-4 font-black text-slate-900 text-right">$15,750.00</td>
                        <td className="py-4 px-4 text-center"><span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Paid</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-black text-blue-600">INV-2419</td>
                        <td className="py-4 px-4">09/06/2025</td>
                        <td className="py-4 px-4 font-black text-slate-900 text-right">$14,200.00</td>
                        <td className="py-4 px-4 text-center"><span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Paid</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-black text-blue-600">INV-2380</td>
                        <td className="py-4 px-4">26/05/2025</td>
                        <td className="py-4 px-4 font-black text-slate-900 text-right">$21,800.00</td>
                        <td className="py-4 px-4 text-center"><span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Paid</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Activity size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Recent Activity</h3>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 cursor-pointer">
                    View All
                  </button>
                </div>
                <div className="space-y-5 flex-grow relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-50 text-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <CheckCircle2 size={12} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-3 md:ml-0 md:group-odd:text-right">
                      <p className="text-[10px] font-black text-slate-900">Load PO-12546 completed</p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">08/07/2025 09:15 AM</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-blue-50 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <FileText size={12} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-3 md:ml-0 md:group-odd:text-right">
                      <p className="text-[10px] font-black text-slate-900">Invoice INV-2487 created</p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">07/07/2025 03:20 PM</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-50 text-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <DollarSign size={12} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-3 md:ml-0 md:group-odd:text-right">
                      <p className="text-[10px] font-black text-slate-900">Payment received $18,500.00</p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">05/07/2025 11:44 AM</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-indigo-50 text-indigo-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <UserPlus size={12} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-3 md:ml-0 md:group-odd:text-right">
                      <p className="text-[10px] font-black text-slate-900">New contact Michael King added</p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">02/07/2025 02:10 PM</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
