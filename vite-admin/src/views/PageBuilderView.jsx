import React, { useState, useEffect } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  ChevronRight,
  FileCode,
  Globe,
} from 'lucide-react';
import LiveDeviceFrame from '../components/LiveDeviceFrame';

export default function PageBuilderView({ pages, onSaveSection, onAddSection, onDeleteSection, onReorderSections, onPublishPage }) {
  const [selectedPageId, setSelectedPageId] = useState('home');
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [editingSection, setEditingSection] = useState(null);
  const [sectionData, setSectionData] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const prepareSectionContent = (sec) => {
    let parsed = {};
    try {
      parsed = JSON.parse(sec.content || '{}');
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
      return { ...defaultHero, ...parsed };
    }
    if (sec.type === 'stats' || sec.id === 'sec-stats') {
      const defaultStats = {
        stat1Title: 'Trusted Expertise',
        stat1Text: 'Decades of combined experience you can rely on.',
        stat2Title: 'Strategic Approach',
        stat2Text: 'Solutions tailored to your business goals.',
        stat3Title: 'Value Driven',
        stat3Text: 'Delivering measurable impact and long-term value.',
        stat4Title: 'Client First',
        stat4Text: 'Your success is our commitment.',
      };
      return { ...defaultStats, ...parsed };
    }
    if (sec.type === 'about_preview' || sec.id === 'sec-about') {
      const defaultAbout = {
        subheading: 'ABOUT PRECISION & CO',
        heading: 'Your Partner in<br>Financial <span class="gold-text">Success</span>',
        text1: 'At Precision & Co, we combine deep industry knowledge with a client-centric approach to deliver audit, tax, advisory, and compliance solutions that help businesses thrive in a rapidly evolving world.',
        text2: "Founded with a vision to redefine chartered accountancy, we've grown from a boutique practice to a trusted partner for over 250 businesses across 50+ industries. Our team of seasoned professionals brings together decades of collective experience, cutting-edge technology, and an unwavering commitment to excellence.",
        buttonText: 'Know More About Us',
        buttonLink: 'why-choose-us.html',
        aboutImage: 'assets/images/new-team.jpg',
      };
      return { ...defaultAbout, ...parsed };
    }
    if (sec.type === 'services_overview' || sec.id === 'sec-services-grid') {
      const defaultServices = {
        subheading: 'WHAT WE DO',
        heading: 'Comprehensive Financial <span class="gold-text">Solutions</span>',
        description: 'From audit assurance to strategic advisory, we offer end-to-end financial services tailored to your business needs.',
      };
      if (parsed.subheading === 'OUR CORE PRACTICE' || (parsed.heading && parsed.heading.includes('Governance'))) {
        return defaultServices;
      }
      return { ...defaultServices, ...parsed };
    }
    if (sec.type === 'industries_overview' || sec.id === 'sec-industries-grid') {
      const defaultIndustries = {
        subheading: 'INDUSTRIES WE SERVE',
        heading: 'Deep Expertise Across <span class="gold-text">Sectors</span>',
        description: 'Our specialists understand the unique challenges and regulatory requirements of each industry.',
      };
      return { ...defaultIndustries, ...parsed };
    }
    if (sec.type === 'cta' || sec.id === 'sec-cta') {
      const defaultCta = {
        title: 'Ready to Elevate Your Business?',
        description: 'Partner with Precision & Co. for strategic financial guidance, unmatched expertise, and a commitment to your long-term success.',
        buttonText: 'Book a Consultation',
        buttonLink: 'contact.html',
      };
      return { ...defaultCta, ...parsed };
    }
    if (sec.type === 'footer' || sec.id === 'sec-footer') {
      const defaultFooter = {
        description: 'Delivering strategic financial solutions with accuracy, integrity, and insight. Your trusted partner in navigating the complexities of modern business finance.',
        address: '14th Floor, Prestige Tower, MG Road, Bengaluru 560001',
        phone: '+91 98765 43210',
        email: 'info@precisionandco.com',
        copyright: '© 2026 Precision & Co. All rights reserved. | Chartered Accountants',
      };
      return { ...defaultFooter, ...parsed };
    }
    return parsed;
  };

  const safePages = Array.isArray(pages) ? pages : [];
  const currentPage = safePages.find(p => p.id === selectedPageId) || safePages[0] || { id: 'home', title: 'Home Page', sections: [] };

  useEffect(() => {
    if (currentPage && Array.isArray(currentPage.sections) && currentPage.sections.length > 0) {
      const first = currentPage.sections[0];
      setEditingSection(first);
      setSectionData(prepareSectionContent(first));
    } else {
      setEditingSection(null);
      setSectionData({});
    }
  }, [selectedPageId, pages]);

  const handleSelectSection = (sec) => {
    setEditingSection(sec);
    setSectionData(prepareSectionContent(sec));
  };

  const handleFieldChange = (key, value) => {
    setSectionData(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteField = (keyToDelete) => {
    setSectionData(prev => {
      const next = { ...prev };
      delete next[keyToDelete];
      return next;
    });
  };

  const handleSave = async () => {
    if (!editingSection) return;
    setSaving(true);
    try {
      await onSaveSection(editingSection.id, {
        name: editingSection.name,
        visible: editingSection.visible,
        order: editingSection.order,
        content: sectionData,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      alert('Failed to save section: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const ids = currentPage.sections.map(s => s.id);
    const temp = ids[index];
    ids[index] = ids[index - 1];
    ids[index - 1] = temp;
    onReorderSections(currentPage.id, ids);
  };

  const handleMoveDown = (index) => {
    if (index === currentPage.sections.length - 1) return;
    const ids = currentPage.sections.map(s => s.id);
    const temp = ids[index];
    ids[index] = ids[index + 1];
    ids[index + 1] = temp;
    onReorderSections(currentPage.id, ids);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#c8a45e]/10 rounded-xl border border-[#c8a45e]/20 text-[#c8a45e]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Home Page Visual Builder</h1>
            <p className="text-slate-400 text-xs">Customize and manage all sections of the live Home Page (<code className="text-[#c8a45e] font-mono">home.html</code>).</p>
          </div>
        </div>

        {/* Home Page Active Badge */}
        <div className="flex items-center space-x-2">
          <span className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#c8a45e]/20 text-[#c8a45e] border border-[#c8a45e]/30 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            Home Page (<code className="font-mono">home.html</code>)
          </span>
        </div>
      </div>

      {/* Mode Toggle: Visual Editor vs Live Device Preview */}
      <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Visual Section Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Responsive Simulator
          </button>
        </div>

        <button
          onClick={() => onPublishPage(currentPage.id)}
          className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all border border-emerald-400/30"
        >
          <Globe className="w-3.5 h-3.5 mr-1.5" /> Publish Page Changes
        </button>
      </div>

      {/* TAB CONTENT: Preview Mode */}
      {activeTab === 'preview' ? (
        <LiveDeviceFrame pageSlug={currentPage.id} keyValData={sectionData} />
      ) : (
        /* TAB CONTENT: Editor Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section List (Left Column - 4 cols) */}
          <div className="lg:col-span-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Page Sections ({currentPage.sections?.length || 0})</span>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => {
                    const name = prompt('Enter new section title:');
                    if (name) onAddSection(currentPage.id, { name, type: 'custom', content: { title: name } });
                  }}
                  className="flex items-center px-2.5 py-1 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 rounded-lg text-xs font-semibold border border-indigo-500/30"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {currentPage.sections?.map((sec, idx) => {
                const isSelected = editingSection?.id === sec.id;
                return (
                  <div
                    key={sec.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div
                      onClick={() => handleSelectSection(sec)}
                      className="flex items-center space-x-2.5 cursor-pointer flex-1 min-w-0 mr-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className={`text-xs font-semibold truncate ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                        {sec.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === currentPage.sections.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (editingSection?.id === sec.id) {
                            setEditingSection(null);
                          }
                          onDeleteSection(sec.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Inspector & Field Controls (Right Column - 8 cols) */}
          <div className="lg:col-span-8 bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 shadow-xl space-y-6">
            {editingSection ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-white">{editingSection.name} Inspector</h2>
                    <span className="text-[10px] text-indigo-400 font-mono">Type: {editingSection.type}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all border border-indigo-400/30"
                    >
                      {savedSuccess ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-300" /> Saved!
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1.5" /> {saving ? 'Saving...' : 'Save Section'}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Dynamic Key-Value Inputs */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                  {Object.keys(sectionData).length === 0 ? (
                    <p className="text-slate-500 text-xs italic">No editable fields in this section.</p>
                  ) : (
                    Object.entries(sectionData).map(([key, val]) => (
                      <div key={key} className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
                        <label className="text-xs font-semibold text-slate-300 capitalize tracking-wide flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-[10px] text-indigo-400/80 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">{key}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteField(key)}
                            className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                            title={`Delete parameter '${key}'`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </label>
                        {key.toLowerCase().includes('image') || key.toLowerCase().includes('img') || key.toLowerCase().includes('bg') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('photo') ? (
                          <div className="space-y-2.5">
                            {val && (
                              <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center relative group shadow-md">
                                <img src={val} alt="Section Media Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                <span className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-900/90 backdrop-blur-md rounded-lg text-[10px] text-indigo-300 font-mono border border-slate-700">Image Preview</span>
                              </div>
                            )}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => handleFieldChange(key, e.target.value)}
                                placeholder="Image URL (e.g. assets/images/hero-bg.jpg)"
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                              />
                              <label className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-center shrink-0">
                                <span>Upload Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (evt) => {
                                        if (evt.target?.result) handleFieldChange(key, evt.target.result);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            {/* Quick Select Website Asset Preset */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Choose Existing Website Photo:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  { label: 'Hero Banner', url: 'assets/images/hero-bg.jpg' },
                                  { label: 'Executive Team', url: 'assets/images/new-team.jpg' },
                                  { label: 'Office Culture', url: 'assets/images/about-team.jpg' },
                                  { label: 'Brand Logo', url: 'assets/images/logo.png' },
                                  { label: 'Methodology', url: 'assets/methodology.jpg' },
                                  { label: 'Growth Insight', url: 'assets/images/insights-1.jpg' },
                                  { label: 'Tax Insight', url: 'assets/images/insights-2.jpg' },
                                  { label: 'M&A Insight', url: 'assets/images/insights-3.jpg' },
                                  { label: 'Client 1', url: 'assets/images/testimonial-1.jpg' },
                                  { label: 'Client 2', url: 'assets/images/testimonial-2.jpg' },
                                  { label: 'Client 3', url: 'assets/images/testimonial-3.jpg' },
                                ].map((asset) => (
                                  <button
                                    key={asset.url}
                                    type="button"
                                    onClick={() => handleFieldChange(key, asset.url)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                                      val === asset.url
                                        ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow'
                                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                                    }`}
                                  >
                                    {asset.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : key.toLowerCase().includes('title') || key.toLowerCase().includes('text') || key.toLowerCase().includes('desc') || key.toLowerCase().includes('subtitle') || key.toLowerCase().includes('content') || key.toLowerCase().includes('address') || key.toLowerCase().includes('quote') ? (
                          <textarea
                            rows={3}
                            value={val}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                          />
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                          />
                        )}
                      </div>
                    ))
                  )}

                  {/* Add New Custom Field */}
                  <button
                    onClick={() => {
                      const fieldKey = prompt('Enter field key name (e.g. heroTitle, ctaText):');
                      if (fieldKey) handleFieldChange(fieldKey, '');
                    }}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-dashed border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Add New Field Parameter
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Layers className="w-12 h-12 stroke-[1] mb-3 text-slate-700" />
                <p className="text-xs">Select a section from the left panel to begin editing.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
