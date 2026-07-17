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
      <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '28px 40px', fontFamily: "'Inter','Outfit',sans-serif" }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <button onClick={activeCategory ? backToCategory : backToMain}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', fontSize: 13.5, fontWeight: 600, color: '#64748B', cursor: 'pointer', marginBottom: 28, padding: 0 }}>
            ← Back
          </button>

          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 20, padding: '40px 44px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 18px 0', lineHeight: 1.35 }}>{fullTitle}</h1>
            <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, margin: '0 0 10px 0' }}>
              This is a detailed guide on <strong style={{ color: '#334155' }}>{fullTitle}</strong>.
            </p>
            <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, margin: '0 0 28px 0' }}>
              Here you would typically find step-by-step instructions, troubleshooting tips, and best practices related to the topic.
            </p>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px 24px' }}>
              <h3 style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0' }}>Key Takeaways</h3>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>Ensure all system settings are configured correctly.</li>
                <li style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>Review your entered data carefully before submitting.</li>
                <li style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>Contact support via the ticketing system if the issue persists.</li>
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
      <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '28px 40px', fontFamily: "'Inter','Outfit',sans-serif" }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <button onClick={backToMain}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', fontSize: 13.5, fontWeight: 600, color: '#64748B', cursor: 'pointer', marginBottom: 28, padding: 0 }}>
            ← Back to Knowledge Base
          </button>

          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>

            {/* Category header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '28px 32px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: '#FFF9E6', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <cat.Icon color="#D97706" />
              </div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>{cat.title}</h1>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>{cat.desc}</p>
              </div>
            </div>

            {/* Articles list */}
            <div style={{ padding: '24px 32px' }}>
              <h2 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px 0' }}>Articles in this Category</h2>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {cat.articles.map((article, i) => (
                  <div key={i}>
                    <div
                      onClick={() => openArticle(article, cat)}
                      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 4px', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      <span style={{ flexShrink: 0 }}><DocIcon /></span>
                      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: '#334155' }}>{article}</span>
                      <span style={{ flexShrink: 0 }}><ChevRight /></span>
                    </div>
                    {i < cat.articles.length - 1 && <div style={{ height: 1, background: '#F1F5F9' }} />}
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
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '32px 40px', fontFamily: "'Inter','Outfit',sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{
          background: '#F1F5F9',
          border: '1px solid #CBD5E1',
          borderRadius: 20,
          padding: '56px 32px 48px',
          textAlign: 'center',
          marginBottom: 40,
          backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          position: 'relative',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', border: '2px solid #FFCC00', color: '#FFCC00', fontSize: 22, fontWeight: 900, marginBottom: 18, background: 'rgba(255,255,255,0.6)' }}>?</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', margin: '0 0 10px 0' }}>How can we help you?</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 28px 0' }}>Search our extensive knowledge base or browse categories below</p>

          <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}><SearchIcon /></span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for articles, guides, or FAQs..."
              style={{ width: '100%', padding: '13px 16px 13px 46px', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 13.5, fontFamily: 'inherit', outline: 'none', color: '#0F172A', background: '#fff', boxSizing: 'border-box', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            />

            {/* Live search dropdown */}
            {search.trim() && (
              <div style={{ position: 'absolute', left: 0, right: 0, top: '110%', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden', textAlign: 'left', zIndex: 100 }}>
                {filteredArticles.length > 0 ? filteredArticles.map(({ title, cat }, i) => (
                  <div key={i} onClick={() => openArticle(title, cat)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer', borderBottom: i < filteredArticles.length - 1 ? '1px solid #F1F5F9' : 'none', background: '#fff' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <DocIcon />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{title}</div>
                      <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 1 }}>{cat.title}</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '14px 16px', fontSize: 13, color: '#94A3B8' }}>No results for "{search}"</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>

          {/* LEFT: Browse Categories */}
          <div>
            <h2 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 18px 0' }}>Browse Categories</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {categories.map(cat => (
                <div key={cat.id}
                  onClick={() => openCategory(cat)}
                  style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '20px 20px 18px', display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer', transition: 'box-shadow 0.15s, border-color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#64748B' }}>
                    <cat.Icon color="#64748B" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>{cat.title}</div>
                    <div style={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.5, marginBottom: 10 }}>{cat.desc}</div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#D97706', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{cat.count} ARTICLES</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Popular Articles */}
          <div>
            <h2 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 18px 0' }}>Popular Articles</h2>
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
              {popularArticles.map(({ title, catId }, i) => {
                const cat = categories.find(c => c.id === catId);
                return (
                  <div key={i}>
                    <div onClick={() => openArticle(title, cat)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 18px', cursor: 'pointer', background: '#fff' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <span style={{ flexShrink: 0 }}><DocIcon /></span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#334155', lineHeight: 1.4 }}>{title}</span>
                      <span style={{ flexShrink: 0 }}><ChevRight /></span>
                    </div>
                    {i < popularArticles.length - 1 && <div style={{ height: 1, background: '#F1F5F9', margin: '0 18px' }} />}
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
