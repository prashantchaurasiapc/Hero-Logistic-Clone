import React, { useState } from 'react';
import {
  ChevronRight, ChevronLeft, Search, Filter, Upload,
  Mail, Globe, Package, FileText, Repeat, Link2,
  CheckCircle2, AlertCircle, RefreshCw, Info, Lock,
  Sparkles, Check, Zap, Shield, Clock, Star
} from 'lucide-react';

/* ─── Shared helpers ──────────────────────────────────────────── */
const CONF_COLORS = {
  High:   { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Medium: { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  Low:    { bg: 'bg-rose-100',    text: 'text-rose-700',     dot: 'bg-rose-500'    },
};

/* ─── Static Data ─────────────────────────────────────────────── */
const STEPS = [
  { num: 1, label: 'Choose Source',  desc: 'Select where to\nextract data from', active: true  },
  { num: 2, label: 'AI Extraction',  desc: 'AI is reading and\nextracting data',   active: false },
  { num: 3, label: 'Review & Edit',  desc: 'Review extracted\ninformation',        active: false },
  { num: 4, label: 'Create Draft',   desc: 'Save as draft load',                   active: false },
];

const SOURCES = [
  { id: 'email',    Icon: Mail,    color: '#6366f1', bg: '#eef2ff', label: 'Email',              desc: 'Extract from...' },
  { id: 'portal',   Icon: Globe,   color: '#8b5cf6', bg: '#f3f0ff', label: 'Customer Portal',    desc: 'Extract from...' },
  { id: 'stock',    Icon: Package, color: '#f59e0b', bg: '#fffbeb', label: 'Warehouse Stock',     desc: 'Extract from...' },
  { id: 'file',     Icon: FileText,color: '#ec4899', bg: '#fdf2f8', label: 'Upload File',         desc: 'PDF, Excel, I...' },
  { id: 'template', Icon: Repeat,  color: '#3b82f6', bg: '#eff6ff', label: 'Recurring Template',  desc: 'Use a saved...' },
  { id: 'api',      Icon: Link2,   color: '#10b981', bg: '#ecfdf5', label: 'API Integration',     desc: 'Connect ext...' },
];

const EMAILS = [
  { id: 1, title: 'Car Transport...', fullTitle: 'Car Transport Booking – Sydney to Melbourne',    sender: 'bookings@abcmotors.com.au',    conf: 'High',   isNew: true,  time: 'Today, 9:15 AM'    },
  { id: 2, title: 'Vehicle Transp...', fullTitle: 'Vehicle Transport Request – 3 Cars',           sender: 'transport@fastcars.com.au',    conf: 'Medium', isNew: false, time: 'Yesterday, 4:32 PM' },
  { id: 3, title: 'Urgent Pickup – T...', fullTitle: 'Urgent Pickup – Toyota RAV4',              sender: 'sales@toyota.com.au',          conf: 'High',   isNew: false, time: 'Yesterday, 11:08 AM'},
  { id: 4, title: 'Freight Request – Ma...', fullTitle: 'Freight Request – Machinery',           sender: 'logistics@industrial.com.au',  conf: 'Medium', isNew: false, time: '2 days ago'         },
  { id: 5, title: 'Enquiry – Car Transport...', fullTitle: 'Enquiry – Car Transport Quote',       sender: 'info@customer.com.au',         conf: 'Low',    isNew: false, time: '3 days ago'         },
];

const EXTRACTION_FIELDS = [
  { label: 'Customer Details',          value: 'ABC Motors\nPty Ltd', checked: true  },
  { label: 'Pickup & Drop-off Stops',   value: '2 Stops',             checked: true  },
  { label: 'Cars / Items',              value: '3 Cars',              checked: false },
  { label: 'Rego, VIN, Make, Model',    value: 'Yes',                 checked: true  },
  { label: 'Dates & Times',             value: 'Yes',                 checked: true  },
  { label: 'Special Instructions',      value: 'Yes',                 checked: true  },
  { label: 'Pricing & Billing Info',    value: 'Yes',                 checked: true  },
  { label: 'Documents & Photos',        value: 'Yes',                 checked: true  },
];

const SUPPORTED_SOURCES = [
  'Outlook / Gmail Emails',
  'PDF, Excel, CSV, Images',
  'Customer Portal Bookings',
  'Warehouse Stock',
  'Recurring Templates',
  'API Integrations',
];

const TIPS = [
  'Use clear booking emails for best results.',
  'Ensure emails contain pickup, drop-off and item details.',
  'You can edit everything before creating the load.',
];

const HOW_IT_WORKS = [
  { Icon: Mail,          text: 'AI reads your source'     },
  { Icon: Zap,           text: 'Extracts key information' },
  { Icon: CheckCircle2,  text: 'You review and edit'      },
  { Icon: Package,       text: 'Create draft load'        },
];

/* ═══════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════ */
export default function AILoadBuilder({ onBack }) {
  const [selectedSource, setSelectedSource] = useState('email');
  const [selectedEmail, setSelectedEmail]   = useState(1);
  const [searchQuery, setSearchQuery]        = useState('');
  const [isExtracting, setIsExtracting]     = useState(false);

  const handleExtract = () => {
    setIsExtracting(true);
    setTimeout(() => setIsExtracting(false), 2000);
  };

  const filteredEmails = EMAILS.filter(e =>
    !searchQuery ||
    e.fullTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.root}>

      {/* ── TOP HEADER ─────────────────────────────────────── */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            <span style={styles.breadcrumbLink}>Home</span>
            <ChevronRight size={12} color="#94a3b8" />
            <span style={styles.breadcrumbLink}>Loads</span>
            <ChevronRight size={12} color="#94a3b8" />
            <span style={styles.breadcrumbCurrent}>AI Load Builder</span>
          </div>

          {/* Title row */}
          <div style={styles.titleRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={styles.sparkleIcon}>
                <Sparkles size={18} color="#fff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1 style={styles.h1}>AI Load Builder <span style={styles.version}>(2.2A)</span></h1>
                  <span style={styles.betaBadge}>BETA</span>
                </div>
                <p style={styles.subtitle}>Extract load details from emails, portals, files or stock using AI.</p>
              </div>
            </div>

            <button style={styles.backBtn} onClick={onBack}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <ChevronLeft size={15} />
              Back to Create Load
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────── */}
      <div style={styles.grid}>

        {/* ── LEFT SIDEBAR ─────────────────────────────────── */}
        <div style={styles.leftSidebar}>

          {/* Step progress */}
          <div style={styles.stepsCard}>
            <div style={styles.stepsTrack}>
              {STEPS.map((step, i) => (
                <React.Fragment key={i}>
                  <div style={styles.stepRow}>
                    {/* Circle */}
                    <div style={{
                      ...styles.stepCircle,
                      background: step.active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f1f5f9',
                      color: step.active ? '#fff' : '#94a3b8',
                      border: step.active ? 'none' : '2px solid #e2e8f0',
                      boxShadow: step.active ? '0 4px 12px rgba(99,102,241,0.35)' : 'none',
                    }}>
                      {step.active ? <Sparkles size={13} /> : step.num}
                    </div>

                    {/* Labels */}
                    <div style={{ paddingTop: 1 }}>
                      <div style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: step.active ? '#6366f1' : '#94a3b8',
                        lineHeight: 1.2,
                        marginBottom: 2,
                      }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: 10.5, color: '#b0bec5', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>

                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div style={{
                      width: 2,
                      height: 28,
                      marginLeft: 16,
                      background: i === 0 ? 'linear-gradient(#6366f1, #e2e8f0)' : '#e2e8f0',
                      borderRadius: 99,
                    }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>How it works</div>
            <div style={{ position: 'relative' }}>
              <div style={styles.howItWorksLine} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
                {HOW_IT_WORKS.map(({ Icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={styles.howIcon}>
                      <Icon size={12} color="#6366f1" />
                    </div>
                    <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 11, color: '#b0bec5', fontStyle: 'italic', marginTop: 16 }}>
              You're always in control.
            </p>
          </div>

          {/* AI Confidence Guide */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>AI Confidence Guide</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { range: 'High (80–100%)',   sub: 'Very confident',      dot: '#10b981' },
                { range: 'Medium (50–79%)',  sub: 'Review recommended',  dot: '#f59e0b' },
                { range: 'Low (0–49%)',      sub: 'Needs attention',     dot: '#ef4444' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: c.dot, marginTop: 3, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{c.range}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────── */}
        <div style={styles.mainContent}>

          {/* Step header */}
          <div style={styles.stepHeader}>
            <div style={styles.stepNum}>1</div>
            <h2 style={styles.stepTitle}>Choose Source</h2>
          </div>
          <p style={styles.stepDesc}>Select where you want AI to extract the load details from.</p>

          {/* Source grid */}
          <div style={styles.sourceGrid}>
            {SOURCES.map(({ id, Icon, color, bg, label, desc }) => {
              const active = selectedSource === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedSource(id)}
                  style={{
                    ...styles.sourceCard,
                    border: active ? `2px solid ${color}` : '2px solid #e2e8f0',
                    boxShadow: active ? `0 0 0 3px ${color}22` : 'none',
                    background: active ? `${bg}` : '#fff',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.border = '2px solid #c7d2fe'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.border = '2px solid #e2e8f0'; }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: bg, border: `1px solid ${color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={18} color={color} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 1 }}>{label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{desc}</div>
                  </div>
                  {active && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 18, height: 18, borderRadius: '50%',
                      background: color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={11} color="#fff" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Select Email Source */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Select Email Source</div>
            <div style={styles.sectionSub}>Connect your email account to scan for bookings.</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <select style={styles.selectInput}>
                  <option>Outlook – dispatch@abcmotors.com.au</option>
                  <option>Gmail – info@abcmotors.com.au</option>
                </select>
                <ChevronRight size={14} color="#94a3b8" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none' }} />
              </div>
              <button style={styles.outlineBtn}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                Disconnect
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>
                  Connected successfully.
                  <span style={{ color: '#94a3b8', fontWeight: 500, marginLeft: 4 }}>Last synced: Today, 9:15 AM</span>
                </span>
              </div>
              <button style={{ ...styles.linkBtn, display: 'flex', alignItems: 'center', gap: 4 }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <RefreshCw size={12} />
                Refresh
              </button>
            </div>
          </div>

          {/* Search Emails */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Search Emails</div>
            <div style={styles.sectionSub}>Find the booking email you want to extract.</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by subject, customer, reference..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
              <button style={{ ...styles.outlineBtn, display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <Filter size={14} />
                Filter
              </button>
            </div>
          </div>

          {/* Recent Booking Emails */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
              Recent Booking Emails
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredEmails.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: 12 }}>
                  No emails match your search.
                </div>
              ) : filteredEmails.map(email => {
                const conf = CONF_COLORS[email.conf];
                const isActive = selectedEmail === email.id;
                return (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '11px 14px',
                      borderRadius: 14,
                      border: isActive ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
                      background: isActive ? '#f5f3ff' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 0 0 3px #6366f115' : 'none',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.border = '1.5px solid #c7d2fe'; e.currentTarget.style.background = '#fafafe'; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.border = '1.5px solid #e2e8f0'; e.currentTarget.style.background = '#fff'; } }}
                  >
                    {/* Left: icon + info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: isActive ? '#ede9fe' : '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Mail size={15} color={isActive ? '#6366f1' : '#64748b'} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: 12.5, fontWeight: 700, color: '#1e293b',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200,
                          }}>
                            {email.title}
                          </span>
                          <span style={{ ...styles.confBadge, background: `${conf.bg.replace('bg-', '')}`, ...getConfStyle(email.conf) }}>
                            {email.conf}
                          </span>
                          {email.isNew && (
                            <span style={styles.newBadge}>New</span>
                          )}
                        </div>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {email.sender}
                        </span>
                      </div>
                    </div>

                    {/* Right: time + radio */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>{email.time}</span>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        border: isActive ? 'none' : '2px solid #cbd5e1',
                        background: isActive ? '#6366f1' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                        flexShrink: 0,
                      }}>
                        {isActive && <Check size={11} color="#fff" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upload footer */}
          <div style={styles.uploadFooter}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Can't find the email? Upload the file instead</span>
            <button style={{ ...styles.outlineBtn, display: 'flex', alignItems: 'center', gap: 7 }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <Upload size={14} />
              Upload File
            </button>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ────────────────────────────────── */}
        <div style={styles.rightSidebar}>

          {/* Extraction Preview */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Extraction Preview</div>
            <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 16, lineHeight: 1.5 }}>
              AI will extract the following information:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {EXTRACTION_FIELDS.map((field, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    <div style={{ width: 16, flexShrink: 0 }}>
                      {field.checked ? (
                        <CheckCircle2 size={13} color="#94a3b8" />
                      ) : null}
                    </div>
                    <span style={{ fontSize: 11.5, color: '#475569', fontWeight: 600 }}>{field.label}</span>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1e293b', textAlign: 'right', whiteSpace: 'pre-line', lineHeight: 1.3 }}>
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 16, paddingTop: 12,
              borderTop: '1px solid #f1f5f9',
              fontSize: 10.5, color: '#b0bec5', textAlign: 'center', fontStyle: 'italic'
            }}>
              AI confidence will be shown in next step.
            </div>
          </div>

          {/* Supported Sources */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Supported Sources</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {SUPPORTED_SOURCES.map((src, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569', fontWeight: 500 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                  {src}
                </li>
              ))}
            </ul>
            <button style={{ ...styles.linkBtn, marginTop: 14, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              View all integrations <ChevronRight size={13} />
            </button>
          </div>

          {/* Tips */}
          <div style={styles.tipsCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Info size={14} color="#059669" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#065f46' }}>Tips</span>
            </div>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TIPS.map((tip, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontSize: 12, color: '#065f46', fontWeight: 500, lineHeight: 1.5 }}>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <div>
            <button
              style={{
                ...styles.ctaBtn,
                background: isExtracting ? '#4f46e5' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                opacity: isExtracting ? 0.85 : 1,
              }}
              onClick={handleExtract}
              onMouseEnter={e => { if (!isExtracting) e.currentTarget.style.background = 'linear-gradient(135deg, #4f46e5, #7c3aed)'; }}
              onMouseLeave={e => { if (!isExtracting) e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)'; }}
            >
              {isExtracting ? (
                <>
                  <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  Extracting...
                </>
              ) : (
                <>
                  Next: Extract Data
                  <ChevronRight size={16} />
                </>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 10 }}>
              <Lock size={11} color="#b0bec5" />
              <span style={{ fontSize: 10.5, color: '#b0bec5', textAlign: 'center' }}>
                Your data is secure and will not be stored without permission.
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
      `}</style>
    </div>
  );
}

/* ─── Badge helpers ──────────────────────────────────────────── */
function getConfStyle(conf) {
  if (conf === 'High')   return { background: '#d1fae5', color: '#065f46', fontWeight: 700, fontSize: 10, padding: '2px 8px', borderRadius: 6 };
  if (conf === 'Medium') return { background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: 10, padding: '2px 8px', borderRadius: 6 };
  return { background: '#fee2e2', color: '#991b1b', fontWeight: 700, fontSize: 10, padding: '2px 8px', borderRadius: 6 };
}

/* ─── Styles ─────────────────────────────────────────────────── */
const styles = {
  root: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    background: '#f8fafc',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },

  /* Header */
  header: {
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 0',
    flexShrink: 0,
  },
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '20px 32px 20px',
  },
  breadcrumb: {
    display: 'flex', alignItems: 'center', gap: 6,
    marginBottom: 14,
  },
  breadcrumbLink: {
    fontSize: 11.5, fontWeight: 600, color: '#64748b', cursor: 'pointer',
    transition: 'color 0.15s',
  },
  breadcrumbCurrent: {
    fontSize: 11.5, fontWeight: 600, color: '#1e293b',
  },
  titleRow: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
  },
  sparkleIcon: {
    width: 42, height: 42, borderRadius: 12,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
    flexShrink: 0,
  },
  h1: {
    fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px',
  },
  version: {
    fontSize: 16, fontWeight: 600, color: '#6366f1',
  },
  betaBadge: {
    padding: '3px 9px', background: '#6366f1', color: '#fff',
    fontSize: 9.5, fontWeight: 800, letterSpacing: 1.5,
    borderRadius: 6, textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 13, color: '#64748b', margin: '4px 0 0', fontWeight: 500,
  },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '9px 16px',
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: 12,
    fontSize: 12.5, fontWeight: 700, color: '#374151',
    cursor: 'pointer', transition: 'background 0.15s',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  /* Grid */
  grid: {
    display: 'flex',
    gap: 20,
    padding: '28px 32px 40px',
    maxWidth: 1200,
    margin: '0 auto',
    width: '100%',
    alignItems: 'flex-start',
  },

  /* Left sidebar */
  leftSidebar: {
    width: 200,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  stepsCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 18,
    padding: '20px 18px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  stepsTrack: {
    display: 'flex', flexDirection: 'column',
  },
  stepRow: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
  },
  stepCircle: {
    width: 34, height: 34, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 800,
    flexShrink: 0, transition: 'all 0.2s',
  },

  /* Shared card */
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 18,
    padding: '18px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  cardTitle: {
    fontSize: 13, fontWeight: 800, color: '#1e293b', marginBottom: 14,
  },

  /* How it works */
  howItWorksLine: {
    position: 'absolute', left: 11, top: 12, bottom: 12,
    width: 1, background: 'linear-gradient(#e0e7ff, #ddd)',
  },
  howIcon: {
    width: 24, height: 24, borderRadius: '50%',
    background: '#eef2ff', border: '1px solid #c7d2fe',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, position: 'relative', zIndex: 1,
  },

  /* Main content */
  mainContent: {
    flex: 1,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 20,
    padding: '28px 28px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    minWidth: 0,
  },
  stepHeader: {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8,
  },
  stepNum: {
    width: 30, height: 30, borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff', fontSize: 13, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 3px 8px rgba(99,102,241,0.3)',
  },
  stepTitle: {
    fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0,
  },
  stepDesc: {
    fontSize: 13, color: '#64748b', marginBottom: 24, fontWeight: 500,
  },

  /* Source grid */
  sourceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 28,
  },
  sourceCard: {
    position: 'relative',
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 16px',
    borderRadius: 14,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'left',
  },

  /* Section */
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 3,
  },
  sectionSub: {
    fontSize: 12, color: '#94a3b8', fontWeight: 500,
  },
  selectInput: {
    width: '100%', padding: '10px 36px 10px 14px',
    background: '#fff', border: '1.5px solid #e2e8f0',
    borderRadius: 12, fontSize: 13, fontWeight: 600,
    color: '#374151', cursor: 'pointer',
    appearance: 'none',
    outline: 'none',
    transition: 'border 0.15s',
  },
  outlineBtn: {
    padding: '9px 16px',
    background: '#fff', border: '1.5px solid #e2e8f0',
    borderRadius: 12, fontSize: 12.5, fontWeight: 700,
    color: '#374151', cursor: 'pointer',
    transition: 'all 0.15s', whiteSpace: 'nowrap',
  },
  searchInput: {
    width: '100%', padding: '10px 14px 10px 38px',
    background: '#fff', border: '1.5px solid #e2e8f0',
    borderRadius: 12, fontSize: 13, fontWeight: 500,
    color: '#374151', outline: 'none',
    transition: 'border 0.15s',
  },
  linkBtn: {
    background: 'none', border: 'none', padding: 0,
    fontSize: 11.5, fontWeight: 700, color: '#6366f1',
    cursor: 'pointer', transition: 'opacity 0.15s',
  },
  confBadge: {
    padding: '2px 8px', borderRadius: 6,
    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  newBadge: {
    padding: '2px 8px', borderRadius: 6,
    background: '#dbeafe', color: '#1d4ed8',
    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
  },

  /* Upload footer */
  uploadFooter: {
    marginTop: 20,
    paddingTop: 18,
    borderTop: '1px solid #f1f5f9',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
  },

  /* Right sidebar */
  rightSidebar: {
    width: 248,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  tipsCard: {
    background: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: 18,
    padding: '18px 16px',
  },
  ctaBtn: {
    width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '14px 20px',
    borderRadius: 14, border: 'none',
    color: '#fff', fontSize: 14, fontWeight: 800,
    cursor: 'pointer', transition: 'all 0.2s',
    boxShadow: '0 6px 20px rgba(99,102,241,0.3)',
    letterSpacing: 0.3,
  },
};
