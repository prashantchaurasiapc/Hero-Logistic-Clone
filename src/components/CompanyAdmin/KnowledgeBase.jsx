import React, { useState } from 'react';
import { Search, HelpCircle, BookOpen, Truck, FileText, Settings, ChevronRight, ArrowLeft } from 'lucide-react';

export default function KnowledgeBase() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      desc: 'Basic setup and configuration guides',
      count: '12',
      icon: BookOpen,
    },
    {
      id: 'fleet-management',
      title: 'Fleet Management',
      desc: 'Managing vehicles, maintenance, and assets',
      count: '24',
      icon: Truck,
    },
    {
      id: 'billing-subscriptions',
      title: 'Billing & Subscriptions',
      desc: 'Invoices, payments, and plan upgrades',
      count: '8',
      icon: FileText,
    },
    {
      id: 'account-settings',
      title: 'Account Settings',
      desc: 'User roles, permissions, and company profile',
      count: '15',
      icon: Settings,
    }
  ];

  const articlesList = [
    "How to assign a driver to a new load?",
    "Understanding the financial performance metrics",
    "Step-by-step guide to updating company details",
    "Troubleshooting: Asset tracking not updating",
    "Setting up automated billing reports"
  ];

  if (activeArticle) {
    const category = activeCategory ? categories.find(c => c.id === activeCategory) : null;
    const title = category ? `${category.title}: ${activeArticle}` : activeArticle;
    
    return (
      <div className="flex-grow bg-[#F8FAFC] p-8 w-full text-left font-sans custom-scrollbar overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          <button 
            onClick={() => setActiveArticle(null)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm p-10">
            <h1 className="text-2xl font-semibold text-slate-900 mb-6">
              {title}
            </h1>
            
            <p className="text-[13px] font-medium text-slate-500 mb-6">
              This is a detailed guide on <span className="font-semibold text-slate-700">{title}</span>.
            </p>
            
            <p className="text-[13px] font-medium text-slate-500 mb-8">
              Here you would typically find step-by-step instructions, troubleshooting tips, and best practices related to the topic.
            </p>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Key Takeaways</h3>
              <ul className="list-disc list-inside space-y-2 text-[13px] font-medium text-slate-600">
                <li>Ensure all system settings are configured correctly.</li>
                <li>Review your entered data carefully before submitting.</li>
                <li>Contact support via the ticketing system if the issue persists.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (activeCategory) {
    const category = categories.find(c => c.id === activeCategory);
    return (
      <div className="flex-grow bg-[#F8FAFC] p-8 w-full text-left font-sans custom-scrollbar overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          <button 
            onClick={() => setActiveCategory(null)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
          </button>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex gap-5 items-center">
              <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center shrink-0">
                <category.icon className="w-7 h-7 text-yellow-600" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-1">{category.title}</h1>
                <p className="text-sm font-medium text-slate-500">{category.desc}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 pt-6">
              <h2 className="text-[13px] font-semibold text-slate-800 uppercase tracking-widest mb-6">Articles In This Category</h2>
              <div className="space-y-4">
                {articlesList.map((article, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveArticle(article)}
                    className="flex items-center gap-5 p-5 hover:bg-slate-50 rounded-2xl cursor-pointer group transition-colors border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md"
                  >
                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-yellow-500 shrink-0" />
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 flex-grow">{article}</span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-yellow-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#F8FAFC] p-8 w-full text-left font-sans custom-scrollbar overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HERO SECTION */}
        <div className="bg-white border border-slate-300 rounded-[2rem] p-12 text-center relative overflow-hidden shadow-sm" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 10v4M10 12h4' stroke='%23cbd5e1' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E\")" }}>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-yellow-400 flex items-center justify-center text-yellow-500 mb-6">
              <HelpCircle className="w-6 h-6" />
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">How can we help you?</h1>
            <p className="text-slate-500 text-[15px] font-medium mb-10">Search our extensive knowledge base or browse categories below</p>
            
            <div className="w-full max-w-2xl relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Search for articles, guides, or FAQs..." 
                className="w-full pl-14 pr-6 py-4 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* BROWSE CATEGORIES */}
          <div className="lg:col-span-2">
            <h2 className="text-[13px] font-semibold text-slate-900 uppercase tracking-widest mb-6">Browse Categories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  onClick={() => setActiveCategory(category.id)}
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <category.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-slate-900 mb-1.5">{category.title}</h3>
                    <p className="text-[12px] text-slate-500 font-medium mb-4 leading-relaxed">{category.desc}</p>
                    <span className="text-[10px] font-semibold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-md uppercase tracking-wider">{category.count} Articles</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* POPULAR ARTICLES */}
          <div>
            <h2 className="text-[13px] font-semibold text-slate-900 uppercase tracking-widest mb-6">Popular Articles</h2>
            
            <div className="bg-white border border-slate-100 rounded-3xl p-2 shadow-sm">
              {articlesList.map((article, idx) => (
                <React.Fragment key={idx}>
                  <div 
                    onClick={() => setActiveArticle(article)}
                    className="flex items-center gap-3 p-4 hover:bg-slate-50 rounded-2xl cursor-pointer group transition-colors"
                  >
                    <FileText className="w-[18px] h-[18px] text-slate-400 group-hover:text-blue-500 shrink-0" />
                    <span className="text-[13px] font-semibold text-slate-700 group-hover:text-blue-700 flex-grow pr-4">{article}</span>
                    <ChevronRight className="w-[18px] h-[18px] text-slate-300" />
                  </div>
                  {idx < articlesList.length - 1 && (
                    <div className="w-[calc(100%-2rem)] mx-auto h-px bg-slate-100"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
