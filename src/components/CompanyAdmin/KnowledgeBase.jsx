import React, { useState } from 'react';

// ── SVG Icons ──────────────────────────────────────────────────
const BookIcon = ({ color = 'currentColor' }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const TruckIcon = ({ color = 'currentColor' }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const FileTextIcon = ({ color = 'currentColor' }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const SettingsIcon = ({ color = 'currentColor' }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const DocIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);
const ChevRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

// ── Data ──────────────────────────────────────────────────────
const categories = [
  {
    id: 'getting-started', title: 'Getting Started', desc: 'Basic setup and configuration guides',
    count: 12, Icon: BookIcon,
    articles: [
      'How to assign a driver to a new load?',
      'Understanding the financial performance metrics',
      'Step-by-step guide to updating company details',
      'Troubleshooting: Asset tracking not updating',
      'Setting up automated billing reports',
      'How to create your first load',
      'Inviting team members to the platform',
      'Configuring your company profile',
    ],
  },
  {
    id: 'fleet-management', title: 'Fleet Management', desc: 'Managing vehicles, maintenance, and assets',
    count: 24, Icon: TruckIcon,
    articles: [
      'Adding a new vehicle to the fleet',
      'Scheduling preventive maintenance',
      'Tracking vehicle GPS in real time',
      'Assigning trailers to loads',
      'Managing driver licenses and compliance',
      'Setting up geofence alerts',
      'Viewing fleet utilization reports',
      'Archiving decommissioned vehicles',
    ],
  },
  {
    id: 'billing-subscriptions', title: 'Billing & Subscriptions', desc: 'Invoices, payments, and plan upgrades',
    count: 8, Icon: FileTextIcon,
    articles: [
      'Understanding your invoice breakdown',
      'Upgrading or downgrading your plan',
      'Adding a payment method',
      'Downloading past invoices',
      'Setting up auto-pay',
      'Requesting a billing dispute',
      'Tax and GST information',
      'Cancelling your subscription',
    ],
  },
  {
    id: 'account-settings', title: 'Account Settings', desc: 'User roles, permissions, and company profile',
    count: 15, Icon: SettingsIcon,
    articles: [
      'Changing your password',
      'Setting up two-factor authentication',
      'Managing user roles and permissions',
      'Updating company contact details',
      'Configuring notification preferences',
      'Linking external integrations',
      'Audit log and activity history',
      'Deleting a user account',
    ],
  },
];

const popularArticles = [
  { title: 'How to assign a driver to a new load?', catId: 'getting-started' },
  { title: 'Understanding the financial performance metrics', catId: 'getting-started' },
  { title: 'Step-by-step guide to updating company details', catId: 'getting-started' },
  { title: 'Troubleshooting: Asset tracking not updating', catId: 'getting-started' },
  { title: 'Setting up automated billing reports', catId: 'getting-started' },
];

// ── Main Component ────────────────────────────────────────────
export default function KnowledgeBase() {
  const [search, setSearch] = useState('');
  // view: 'main' | 'category' | 'article'
  const [view, setView] = useState('main');
  const [activeCategory, setActiveCategory] = useState(null); // category object
  const [activeArticle, setActiveArticle] = useState(null);   // article title string

  const openCategory = (cat) => { setActiveCategory(cat); setView('category'); setSearch(''); };
  const openArticle = (title, cat = null) => {
    if (cat) setActiveCategory(cat);
    setActiveArticle(title);
    setView('article');
  };
  const backToMain = () => { setView('main'); setActiveCategory(null); setActiveArticle(null); };
  const backToCategory = () => { setView('category'); setActiveArticle(null); };

  const filteredArticles = search.trim()
    ? categories.flatMap(c => c.articles.map(a => ({ title: a, cat: c }))).filter(({ title }) => title.toLowerCase().includes(search.toLowerCase()))
    : [];

  // ── ARTICLE DETAIL ─────────────────────────────────────────
  if (view === 'article') {
    const fullTitle = activeCategory ? `${activeCategory.title}: ${activeArticle}` : activeArticle;
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans text-left">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={activeCategory ? backToCategory : backToMain}
            className="flex items-center gap-2 bg-none border-none text-[13.5px] font-bold text-gray-500 hover:text-gray-800 cursor-pointer mb-6 p-0"
          >
            ← Back
          </button>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4.5 leading-snug">{fullTitle}</h1>
            <p className="text-[13.5px] text-gray-600 leading-relaxed mb-2.5">
              This is a detailed guide on <strong className="text-gray-700">{fullTitle}</strong>.
            </p>
            <p className="text-[13.5px] text-gray-600 leading-relaxed mb-6">
              Here you would typically find step-by-step instructions, troubleshooting tips, and best practices related to the topic.
            </p>

            <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-5">
              <h3 className="text-[13.5px] font-extrabold text-gray-900 mb-3.5">Key Takeaways</h3>
              <ul className="m-0 pl-4.5 flex flex-col gap-2 list-disc">
                <li className="text-[13px] text-gray-600 leading-relaxed">Ensure all system settings are configured correctly.</li>
                <li className="text-[13px] text-gray-600 leading-relaxed">Review your entered data carefully before submitting.</li>
                <li className="text-[13px] text-gray-600 leading-relaxed">Contact support via the ticketing system if the issue persists.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CATEGORY ARTICLES LIST ──────────────────────────────────
  if (view === 'category' && activeCategory) {
    const cat = activeCategory;
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans text-left">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={backToMain}
            className="flex items-center gap-2 bg-none border-none text-[13.5px] font-bold text-gray-500 hover:text-gray-800 cursor-pointer mb-6 p-0"
          >
            ← Back to Knowledge Base
          </button>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Category header */}
            <div className="flex items-center gap-4.5 p-6 sm:p-8 border-b border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <cat.Icon color="#D97706" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-gray-900 mb-1 leading-tight">{cat.title}</h1>
                <p className="text-[13px] text-gray-400 font-semibold">{cat.desc}</p>
              </div>
            </div>

            {/* Articles list */}
            <div className="p-6 sm:p-8">
              <h2 className="text-[10px] font-black text-gray-900 tracking-wider uppercase mb-5">Articles in this Category</h2>

              <div className="flex flex-col">
                {cat.articles.map((article, i) => (
                  <div key={i}>
                    <div
                      onClick={() => openArticle(article, cat)}
                      className="flex items-center gap-3.5 py-4 px-1 cursor-pointer transition-opacity hover:opacity-75"
                    >
                      <span className="shrink-0"><DocIcon /></span>
                      <span className="flex-grow text-[13.5px] font-semibold text-gray-700">{article}</span>
                      <span className="shrink-0"><ChevRight /></span>
                    </div>
                    {i < cat.articles.length - 1 && <div className="h-px bg-gray-100" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN PAGE ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans text-left">
      <div className="max-w-[1100px] mx-auto">

        {/* Hero */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl py-12 px-6 sm:px-10 text-center mb-8 bg-[radial-gradient(circle,#CBD5E1_1px,transparent_1px)] bg-[size:20px_20px] relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-yellow-500 text-yellow-600 text-lg font-extrabold mb-4 bg-white/60">?</div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 tracking-tight">How can we help you?</h1>
          <p className="text-sm text-gray-500 font-semibold mb-6">Search our extensive knowledge base or browse categories below</p>

          <div className="relative max-w-lg mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2"><SearchIcon /></span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for articles, guides, or FAQs..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-[13.5px] font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-500 transition-colors shadow-sm"
            />

            {/* Live search dropdown */}
            {search.trim() && (
              <div className="absolute left-0 right-0 top-[110%] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden text-left z-20">
                {filteredArticles.length > 0 ? filteredArticles.map(({ title, cat }, i) => (
                  <div 
                    key={i} 
                    onClick={() => openArticle(title, cat)}
                    className="flex items-center gap-2.5 p-3.5 cursor-pointer border-b border-gray-100 last:border-none bg-white hover:bg-slate-50 transition-colors"
                  >
                    <DocIcon />
                    <div className="flex-grow">
                      <div className="text-[13px] font-bold text-gray-700">{title}</div>
                      <div className="text-[10px] text-gray-400 font-bold mt-0.5">{cat.title}</div>
                    </div>
                  </div>
                )) : (
                  <div className="p-4 text-sm text-gray-400 font-medium">No results for "{search}"</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* LEFT: Browse Categories */}
          <div>
            <h2 className="text-[10px] font-black text-gray-900 tracking-wider uppercase mb-4.5">Browse Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map(cat => (
                <div 
                  key={cat.id}
                  onClick={() => openCategory(cat)}
                  className="bg-white border border-gray-200 rounded-2xl p-5 flex items-start gap-4 cursor-pointer transition-all hover:shadow-md hover:border-slate-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center shrink-0 text-slate-500">
                    <cat.Icon color="#64748B" />
                  </div>
                  <div>
                    <div className="text-[14.5px] font-extrabold text-gray-900 mb-1 leading-tight">{cat.title}</div>
                    <div className="text-[11.5px] text-gray-400 font-semibold leading-relaxed mb-2.5">{cat.desc}</div>
                    <span className="text-[9px] font-black text-yellow-600 tracking-wider uppercase">{cat.count} ARTICLES</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Popular Articles */}
          <div>
            <h2 className="text-[10px] font-black text-gray-900 tracking-wider uppercase mb-4.5">Popular Articles</h2>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
              {popularArticles.map(({ title, catId }, i) => {
                const cat = categories.find(c => c.id === catId);
                return (
                  <div key={i}>
                    <div 
                      onClick={() => openArticle(title, cat)}
                      className="flex items-center gap-3 p-4 cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                    >
                      <span className="shrink-0"><DocIcon /></span>
                      <span className="flex-grow text-[13px] font-bold text-gray-700 leading-snug">{title}</span>
                      <span className="shrink-0"><ChevRight /></span>
                    </div>
                    {i < popularArticles.length - 1 && <div className="h-px bg-gray-100 mx-4" />}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
