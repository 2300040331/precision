import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Edit3, Save, Globe, RefreshCw, CheckCircle, ExternalLink, Image as ImageIcon, Layers, Monitor, Tablet, Smartphone } from 'lucide-react';

const allWebsitePages = [
  // Core Main Pages
  { id: 'home', filename: 'home.html', title: 'Home Page', category: 'Main Pages' },
  { id: 'services', filename: 'services.html', title: 'Services Overview', category: 'Main Pages' },
  { id: 'industries', filename: 'industries.html', title: 'Industries We Serve', category: 'Main Pages' },
  { id: 'why-choose-us', filename: 'why-choose-us.html', title: 'About Us / Why Choose Us', category: 'Main Pages' },
  { id: 'experts', filename: 'experts.html', title: 'Experts / Leadership Team', category: 'Main Pages' },
  { id: 'contact', filename: 'contact.html', title: 'Contact Us', category: 'Main Pages' },

  // Service Detail Pages
  { id: 'services-audit', filename: 'services-audit.html', title: 'Service: Audit & Assurance', category: 'Service Detail Pages' },
  { id: 'services-tax', filename: 'services-tax.html', title: 'Service: Tax Advisory', category: 'Service Detail Pages' },
  { id: 'services-consulting', filename: 'services-consulting.html', title: 'Service: Business Consulting', category: 'Service Detail Pages' },
  { id: 'services-risk', filename: 'services-risk.html', title: 'Service: Risk & Compliance', category: 'Service Detail Pages' },
  { id: 'services-gst', filename: 'services-gst.html', title: 'Service: GST Services', category: 'Service Detail Pages' },
  { id: 'services-vcfo', filename: 'services-vcfo.html', title: 'Service: Virtual CFO', category: 'Service Detail Pages' },
  { id: 'services-accounting', filename: 'services-accounting.html', title: 'Service: Accounting & Bookkeeping', category: 'Service Detail Pages' },
  { id: 'services-company-law', filename: 'services-company-law.html', title: 'Service: Company Law & ROC', category: 'Service Detail Pages' },
  { id: 'services-startup', filename: 'services-startup.html', title: 'Service: Startup Advisory', category: 'Service Detail Pages' },
  { id: 'services-regulatory', filename: 'services-regulatory.html', title: 'Service: Regulatory Compliance', category: 'Service Detail Pages' },
  { id: 'services-transaction', filename: 'services-transaction.html', title: 'Service: Transaction Advisory', category: 'Service Detail Pages' },
  { id: 'services-valuation', filename: 'services-valuation.html', title: 'Service: Valuation', category: 'Service Detail Pages' },
  { id: 'services-wealth', filename: 'services-wealth.html', title: 'Service: Wealth Advisory', category: 'Service Detail Pages' },

  // Industry Detail Pages
  { id: 'industry-banking-finance', filename: 'industry-banking-finance.html', title: 'Industry: Banking & Finance', category: 'Industry Detail Pages' },
  { id: 'industry-healthcare', filename: 'industry-healthcare.html', title: 'Industry: Healthcare', category: 'Industry Detail Pages' },
  { id: 'industry-technology', filename: 'industry-technology.html', title: 'Industry: Technology & IT', category: 'Industry Detail Pages' },
  { id: 'industry-manufacturing', filename: 'industry-manufacturing.html', title: 'Industry: Manufacturing', category: 'Industry Detail Pages' },
  { id: 'industry-real-estate', filename: 'industry-real-estate.html', title: 'Industry: Real Estate', category: 'Industry Detail Pages' },
  { id: 'industry-government', filename: 'industry-government.html', title: 'Industry: Government & PSU', category: 'Industry Detail Pages' },
  { id: 'industry-energy', filename: 'industry-energy.html', title: 'Industry: Energy', category: 'Industry Detail Pages' },
  { id: 'industry-hospitality', filename: 'industry-hospitality.html', title: 'Industry: Hospitality', category: 'Industry Detail Pages' },
  { id: 'industry-logistics', filename: 'industry-logistics.html', title: 'Industry: Logistics', category: 'Industry Detail Pages' },
  { id: 'industry-ngos', filename: 'industry-ngos.html', title: 'Industry: NGOs', category: 'Industry Detail Pages' },
  { id: 'industry-education', filename: 'industry-education.html', title: 'Industry: Education', category: 'Industry Detail Pages' },
  { id: 'industry-import-export', filename: 'industry-import-export.html', title: 'Industry: Import Export', category: 'Industry Detail Pages' },
  { id: 'industry-retail', filename: 'industry-retail.html', title: 'Industry: Retail & E-Commerce', category: 'Industry Detail Pages' },
  { id: 'industry-startups', filename: 'industry-startups.html', title: 'Industry: Startups', category: 'Industry Detail Pages' },
  { id: 'industry-infrastructure', filename: 'industry-infrastructure.html', title: 'Industry: Infrastructure', category: 'Industry Detail Pages' },
];

export default function LiveVisualEditor({ pages, onSaveSection }) {
  const [selectedPageId, setSelectedPageId] = useState('home');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [fieldData, setFieldData] = useState({});
  const [deviceMode, setDeviceMode] = useState('desktop'); // desktop | tablet | mobile
  const [iframeKey, setIframeKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activePageMeta = allWebsitePages.find(p => p.id === selectedPageId) || allWebsitePages[0];
  const currentPageObj = pages.find(p => p.id === selectedPageId || p.slug === selectedPageId) || {
    id: selectedPageId,
    title: activePageMeta.title,
    sections: [
      { id: `sec-${selectedPageId}-hero`, name: 'Hero / Top Banner', type: 'hero', content: {} },
      { id: `sec-${selectedPageId}-content`, name: 'Page Details & Content', type: 'content', content: {} }
    ]
  };

  useEffect(() => {
    if (currentPageObj && currentPageObj.sections && currentPageObj.sections.length > 0) {
      const sec = currentPageObj.sections[0];
      setSelectedSectionId(sec.id);
      loadSectionContent(sec);
    } else {
      setSelectedSectionId('');
      setFieldData({});
    }
  }, [selectedPageId, pages]);

  const loadSectionContent = (sec) => {
    if (!sec) return;
    let parsed = {};
    try {
      parsed = typeof sec.content === 'string' ? JSON.parse(sec.content || '{}') : (sec.content || {});
    } catch (e) {
      parsed = {};
    }

    if (sec.type === 'hero' || sec.id === 'sec-hero') {
      const defaultHero = {
        subtitle: 'ACCURATE. TRUSTED. IMPACTFUL.',
        title: 'Precision in<br>Numbers.<br>Excellence in<br><span class="gold-text">Business.</span>',
        description: 'We deliver strategic financial solutions with accuracy, integrity and insight to help your business grow with confidence.',
        ctaPrimaryText: 'Our Services',
        ctaPrimaryLink: 'services.html',
        ctaSecondaryText: 'Book a Consultation',
        ctaSecondaryLink: 'contact.html',
        heroImage: 'assets/images/hero-bg.jpg',
      };
      setFieldData({ ...defaultHero, ...parsed });
      return;
    }

    if (sec.type === 'about_preview' || sec.id === 'sec-about') {
      const defaultAbout = {
        subheading: 'ABOUT PRECISION & CO',
        heading: 'Your Partner in<br>Financial <span class="gold-text">Success</span>',
        text1: 'At Precision & Co, we combine deep industry knowledge with a client-centric approach to deliver audit, tax, advisory, and compliance solutions that help businesses thrive in a rapidly evolving world.',
        text2: "Founded with a vision to redefine chartered accountancy, we've grown from a boutique practice to a trusted partner for over 250 businesses across 50+ industries.",
        buttonText: 'Know More About Us',
        buttonLink: 'why-choose-us.html',
        aboutImage: 'assets/images/new-team.jpg',
      };
      setFieldData({ ...defaultAbout, ...parsed });
      return;
    }

    if (sec.type === 'services_overview' || sec.id === 'sec-services-grid') {
      const defaultServices = {
        subheading: 'WHAT WE DO',
        heading: 'Comprehensive Financial <span class="gold-text">Solutions</span>',
        description: 'From audit assurance to strategic advisory, we offer end-to-end financial services tailored to your business needs.',
      };
      setFieldData({ ...defaultServices, ...parsed });
      return;
    }

    setFieldData(parsed);
  };

  const currentSection = currentPageObj.sections?.find(s => s.id === selectedSectionId) || currentPageObj.sections?.[0];

  const handleSelectSection = (sec) => {
    setSelectedSectionId(sec.id);
    loadSectionContent(sec);
  };

  const handleFieldChange = (key, value) => {
    setFieldData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveAndPublish = async () => {
    if (!currentSection) return;
    setSaving(true);
    try {
      await onSaveSection(currentSection.id, {
        name: currentSection.name,
        visible: currentSection.visible,
        order: currentSection.order,
        content: fieldData,
      });

      // Update local storage so live page iframe and external tabs refresh immediately
      const currentFlat = JSON.parse(localStorage.getItem('precision_cms_content') || '{}');
      const updatedFlat = { ...currentFlat, ...fieldData };
      localStorage.setItem('precision_cms_content', JSON.stringify(updatedFlat));
      window.dispatchEvent(new Event('storage'));

      setSavedSuccess(true);
      setIframeKey(prev => prev + 1);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      alert('Failed to publish changes: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Determine iframe live URL
  const getIframeUrl = () => {
    const fn = activePageMeta.filename;
    if (typeof window !== 'undefined' && window.location) {
      return `${window.location.protocol}//${window.location.host}/${fn}`;
    }
    return `https://precision-henna.vercel.app/${fn}`;
  };

  const iframeDimensions = {
    desktop: 'w-full h-[680px]',
    tablet: 'w-[768px] h-[680px]',
    mobile: 'w-[375px] h-[680px]',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Live In-Situ Visual Website Editor</h1>
            <p className="text-slate-400 text-xs">Visual point-and-click editor for all 34 website pages. Live iframe canvas sync.</p>
          </div>
        </div>

        {/* Page Selector & Action Buttons */}
        <div className="flex items-center space-x-3">
          <select
            value={selectedPageId}
            onChange={(e) => setSelectedPageId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-indigo-300 focus:outline-none focus:border-indigo-500/50 max-w-[280px] truncate"
          >
            {['Main Pages', 'Service Detail Pages', 'Industry Detail Pages'].map(cat => (
              <optgroup key={cat} label={cat}>
                {allWebsitePages.filter(p => p.category === cat).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.filename})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <button
            onClick={handleSaveAndPublish}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all border border-indigo-400/30 shrink-0"
          >
            {savedSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-300" /> Saved & Published Live!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1.5" /> {saving ? 'Publishing...' : 'Save & Publish Live'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Interface: Left Inspector (5 Cols) + Right Live Canvas (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Visual Inspector Sidebar (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-5 flex flex-col">
          {/* Section Tabs */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-slate-800 pb-2">
              Page Sections ({currentPageObj.sections?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentPageObj.sections?.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => handleSelectSection(sec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedSectionId === sec.id
                      ? 'bg-indigo-600 text-white shadow-md border border-indigo-400 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {sec.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section Inspector Inputs */}
          <div className="border-t border-slate-800 pt-4 space-y-4 flex-1 overflow-y-auto max-h-[580px] pr-1 scrollbar-thin scrollbar-thumb-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">{currentSection?.name || 'Section Inspector'}</span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Live Sync</span>
            </div>

            {Object.keys(fieldData).length === 0 ? (
              <div className="text-slate-500 italic py-8 text-center space-y-2">
                <p>No custom parameters set for this section.</p>
                <button
                  onClick={() => handleFieldChange('title', 'Sample Heading Title')}
                  className="px-3 py-1 bg-indigo-600/20 text-indigo-300 rounded-lg text-xs font-semibold"
                >
                  + Add Title Field
                </button>
              </div>
            ) : (
              Object.entries(fieldData).map(([key, val]) => (
                <div key={key} className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <label className="text-xs font-semibold text-slate-300 capitalize flex items-center justify-between">
                    <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded">{key}</span>
                  </label>

                  {key.toLowerCase().includes('image') || key.toLowerCase().includes('img') || key.toLowerCase().includes('bg') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('photo') ? (
                    <div className="space-y-2">
                      {val && (
                        <div className="w-full h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center relative">
                          <img src={val} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      )}
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        placeholder="Image path e.g. assets/images/hero-bg.jpg"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500/50 font-mono"
                      />
                      <div className="flex flex-wrap gap-1">
                        {[
                          { label: 'Hero Banner', url: 'assets/images/hero-bg.jpg' },
                          { label: 'Executive Team', url: 'assets/images/new-team.jpg' },
                          { label: 'Office Culture', url: 'assets/images/about-team.jpg' },
                          { label: 'Brand Logo', url: 'assets/images/logo.png' },
                          { label: 'Methodology', url: 'assets/methodology.jpg' },
                        ].map(preset => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => handleFieldChange(key, preset.url)}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : key.toLowerCase().includes('title') || key.toLowerCase().includes('text') || key.toLowerCase().includes('desc') || key.toLowerCase().includes('subtitle') || key.toLowerCase().includes('heading') ? (
                    <textarea
                      rows={3}
                      value={val}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500/50"
                    />
                  ) : (
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500/50"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Live Interactive Web Canvas Iframe (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center">
          {/* Live Canvas Bar */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 mb-3">
            <div className="flex items-center space-x-2 text-xs text-slate-200 font-semibold truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="truncate">Live Canvas: <code className="text-indigo-300 font-mono">{activePageMeta.filename}</code></span>
            </div>

            {/* Device Toggles */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  deviceMode === 'desktop' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  deviceMode === 'tablet' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  deviceMode === 'mobile' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIframeKey(prev => prev + 1)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border-l border-slate-800 ml-1"
                title="Reload Web Canvas"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <a
                href={getIframeUrl()}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Interactive Responsive Iframe Window */}
          <div className={`transition-all duration-300 overflow-hidden rounded-xl border border-slate-800 shadow-2xl bg-white relative ${iframeDimensions[deviceMode]}`}>
            <iframe
              key={iframeKey}
              src={getIframeUrl()}
              title={`Live Canvas ${activePageMeta.title}`}
              className="w-full h-full border-none bg-slate-950"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
