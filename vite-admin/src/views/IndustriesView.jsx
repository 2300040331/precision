import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  ArrowLeft,
  Globe,
  Layers,
  Sparkles,
  Upload,
  ChevronRight,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

const getPublicSiteUrl = (path = '/industries.html') => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    if (window.location.hostname.includes('vercel.app')) {
      return `https://precision-henna.vercel.app${path}`;
    }
    return `http://${window.location.hostname}:5001${path}`;
  }
  return `https://precision-henna.vercel.app${path}`;
};

// Easy Drag & Drop Picture Component for non-technical users
const ImageDropzone = ({ value, onChange, label = 'Picture / Banner Image' }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-slate-300 font-semibold flex items-center justify-between text-xs">
        <span>{label}</span>
        {value && <span className="text-[10px] text-emerald-400 font-bold flex items-center"><Check className="w-3 h-3 mr-1" /> Picture Loaded</span>}
      </label>
      
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all text-center flex flex-col items-center justify-center ${
          isDragging ? 'border-amber-400 bg-amber-500/10' : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
        }`}
      >
        {value ? (
          <div className="relative w-full group">
            <img src={value} alt="Uploaded preview" className="h-48 w-full object-cover rounded-xl border border-slate-800 shadow-md" />
            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center space-x-3">
              <label className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg">
                Change Picture
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </label>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg"
              >
                Remove Picture
              </button>
            </div>
          </div>
        ) : (
          <label className="w-full py-8 flex flex-col items-center justify-center cursor-pointer space-y-2">
            <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Drag & drop your picture here</p>
              <p className="text-[11px] text-slate-400 mt-0.5">or <span className="text-amber-400 font-semibold underline">click to choose from computer</span></p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        )}
      </div>
    </div>
  );
};

export default function IndustriesView({ industries, selectedIndustryId, onCreate, onUpdate, onDelete }) {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'editor'
  const [editingId, setEditingId] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving'

  const [form, setForm] = useState({
    title: '',
    slug: '',
    icon: 'Building2',
    summary: '',
    category: 'General',
    heroSubtitle: 'INDUSTRY EXPERTISE',
    heroDescription: '',
    heroImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop',
    sectionTitle: 'How We Help',
    card1Title: '',
    card1Text: '',
    card2Title: '',
    card2Text: '',
    card3Title: '',
    card3Text: '',
    customSections: [],
    ctaTitle: 'Ready to Elevate Your Business?',
    ctaText: 'Partner with Precision & Co. for strategic financial guidance, unmatched expertise, and a commitment to your long-term success.',
    featured: false,
    active: true,
  });

  const isInitialMount = useRef(true);

  // Auto-save logic: Automatically persist changes in background without requiring save buttons
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (viewMode === 'editor' && editingId) {
      setSaveStatus('saving');
      const timer = setTimeout(() => {
        onUpdate(editingId, form);
        setSaveStatus('saved');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [form, editingId, viewMode, onUpdate]);

  useEffect(() => {
    if (selectedIndustryId) {
      const target = industries.find(i => i.id === selectedIndustryId);
      if (target) {
        handleOpenEdit(target);
      }
    }
  }, [selectedIndustryId, industries]);

  const filtered = industries.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    const newId = Date.now();
    const newForm = {
      id: newId,
      title: 'New Industry Vertical',
      slug: `industry-new-${newId}`,
      icon: 'Building2',
      summary: 'Specialized accounting and advisory services for this sector.',
      category: 'General Sector',
      heroSubtitle: 'INDUSTRY EXPERTISE',
      heroDescription: 'Delivering tailored financial guidance and audit solutions for this vertical.',
      heroImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop',
      sectionTitle: 'How We Help',
      card1Title: 'Strategic Advisory',
      card1Text: 'Frameworks to optimize capital allocation and financial performance.',
      card2Title: 'Tax & Compliance',
      card2Text: 'Comprehensive tax filing and regulatory compliance management.',
      card3Title: 'Risk Management',
      card3Text: 'Identifying financial vulnerabilities and vendor dependency risk.',
      customSections: [],
      ctaTitle: 'Ready to Elevate Your Business?',
      ctaText: 'Partner with Precision & Co. for strategic financial guidance, unmatched expertise, and a commitment to your long-term success.',
      featured: false,
      active: true,
    };
    onCreate(newForm);
    setEditingId(newId);
    setForm(newForm);
    setViewMode('editor');
  };

  const handleOpenEdit = (ind) => {
    setEditingId(ind.id);
    setForm({
      title: ind.title || '',
      slug: ind.slug || '',
      icon: ind.icon || 'Building2',
      summary: ind.summary || '',
      category: ind.category || 'General',
      heroSubtitle: ind.heroSubtitle || 'INDUSTRY EXPERTISE',
      heroDescription: ind.heroDescription || ind.summary || '',
      heroImage: ind.heroImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop',
      sectionTitle: ind.sectionTitle || 'How We Help',
      card1Title: ind.card1Title || 'Cost Accounting Models',
      card1Text: ind.card1Text || 'Develop precise cost-accounting frameworks.',
      card2Title: ind.card2Title || 'Tax Structuring',
      card2Text: ind.card2Text || 'Strategic tax advisory for capital expansions.',
      card3Title: ind.card3Title || 'Supply Chain Advisory',
      card3Text: ind.card3Text || 'Financial risk modeling for supply chain volatility.',
      customSections: ind.customSections || [],
      ctaTitle: ind.ctaTitle || 'Ready to Elevate Your Business?',
      ctaText: ind.ctaText || 'Partner with Precision & Co. for strategic financial guidance, unmatched expertise, and a commitment to your long-term success.',
      featured: ind.featured,
      active: ind.active,
    });
    setViewMode('editor');
  };

  const handleAddCustomSection = () => {
    const title = prompt('Enter Custom Section Title (e.g. Key Regulations & Highlights):');
    if (!title) return;
    const newSec = {
      id: Date.now(),
      title,
      content: 'Add detailed notes, advisory points, or custom content for this section.',
    };
    setForm(prev => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSec],
    }));
  };

  const handleRemoveCustomSection = (id) => {
    setForm(prev => ({
      ...prev,
      customSections: (prev.customSections || []).filter(s => s.id !== id),
    }));
  };

  const handleUpdateCustomSection = (id, field, value) => {
    setForm(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s => s.id === id ? { ...s, [field]: value } : s),
    }));
  };

  // FULL PAGE INLINE SINGLE-PAGE EDITOR (No tabs, auto-saving live, non-tech friendly)
  if (viewMode === 'editor') {
    return (
      <div className="space-y-6 animate-fade-in pb-16">
        {/* Sticky Page Editor Header */}
        <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4 min-w-0">
            <button
              onClick={() => setViewMode('list')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all flex items-center text-xs font-semibold shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to All Industries
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-white truncate flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-amber-400 shrink-0" />
                {form.title || 'Industry Page Editor'}
              </h1>
              <p className="text-slate-400 text-[11px] truncate">Single page inline editor • All sections in one view</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {/* Live Auto-Save Indicator */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveStatus === 'saving' ? 'Saving live...' : '✓ Auto-Saved Live'}</span>
            </div>

            {form.slug && (
              <a
                href={getPublicSiteUrl(`/${form.slug}.html`)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all border border-slate-700"
              >
                <Globe className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> View Live Web Page
              </a>
            )}
          </div>
        </div>

        {/* SINGLE PAGE VIEW - ALL SECTIONS FLATTENED IN A SINGLE SMOOTH SCROLL */}
        <div className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center">
                <Building2 className="w-4 h-4 mr-2" /> 1. Industry Title & Category
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Step 1 of 5</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Industry Name *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Manufacturing"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Category Badge</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Industrial, Finance, Technology"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Short Grid Summary</label>
              <textarea
                rows={2}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="Short overview text for card grid..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          {/* Section 2: Hero Banner & Picture Upload */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" /> 2. Hero Header & Banner Picture
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Step 2 of 5</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Hero Tagline / Subtitle</label>
              <input
                type="text"
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                placeholder="INDUSTRY EXPERTISE"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Hero Overview Description</label>
              <textarea
                rows={4}
                value={form.heroDescription}
                onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
                placeholder="In an era of supply chain disruptions and margin pressures, we help manufacturing firms..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Visual Drag & Drop Picture Uploader ("Dropbox style") */}
            <ImageDropzone
              value={form.heroImage}
              onChange={(newImg) => setForm({ ...form, heroImage: newImg })}
              label="Hero Banner Picture (Drag & Drop or Click to Browse)"
            />
          </div>

          {/* Section 3: Solution Cards */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center">
                <Layers className="w-4 h-4 mr-2" /> 3. How We Help (Solution Cards)
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Step 3 of 5</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Section Heading</label>
              <input
                type="text"
                value={form.sectionTitle}
                onChange={(e) => setForm({ ...form, sectionTitle: e.target.value })}
                placeholder="How We Help"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Card 1 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Solution Card 1</span>
                <input
                  type="text"
                  placeholder="Card 1 Title"
                  value={form.card1Title}
                  onChange={(e) => setForm({ ...form, card1Title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                />
                <textarea
                  rows={3}
                  placeholder="Card 1 Description"
                  value={form.card1Text}
                  onChange={(e) => setForm({ ...form, card1Text: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                />
              </div>

              {/* Card 2 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Solution Card 2</span>
                <input
                  type="text"
                  placeholder="Card 2 Title"
                  value={form.card2Title}
                  onChange={(e) => setForm({ ...form, card2Title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                />
                <textarea
                  rows={3}
                  placeholder="Card 2 Description"
                  value={form.card2Text}
                  onChange={(e) => setForm({ ...form, card2Text: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                />
              </div>

              {/* Card 3 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Solution Card 3</span>
                <input
                  type="text"
                  placeholder="Card 3 Title"
                  value={form.card3Title}
                  onChange={(e) => setForm({ ...form, card3Title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                />
                <textarea
                  rows={3}
                  placeholder="Card 3 Description"
                  value={form.card3Text}
                  onChange={(e) => setForm({ ...form, card3Text: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Add Any Custom Section */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center">
                <Plus className="w-4 h-4 mr-2" /> 4. Custom Sections ({form.customSections?.length || 0})
              </h2>
              <button
                type="button"
                onClick={handleAddCustomSection}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center shadow-lg shadow-amber-600/30"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Any Custom Section
              </button>
            </div>

            {(!form.customSections || form.customSections.length === 0) ? (
              <div className="p-6 text-center bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                <p className="text-slate-400 text-xs font-semibold">No custom sections added yet.</p>
                <p className="text-slate-500 text-[11px]">Click the button above to add custom text blocks, regulatory notes, or extra features!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.customSections.map((sec, idx) => (
                  <div key={sec.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-amber-400">Custom Section #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomSection(sec.id)}
                        className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold">Section Title</label>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleUpdateCustomSection(sec.id, 'title', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold">Section Content / Description</label>
                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={(e) => handleUpdateCustomSection(sec.id, 'content', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Bottom CTA Banner & Status */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center">
                <Sparkles className="w-4 h-4 mr-2" /> 5. Call to Action Banner & Status
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Step 5 of 5</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">CTA Banner Title</label>
              <input
                type="text"
                value={form.ctaTitle}
                onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })}
                placeholder="Ready to Elevate Your Business?"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">CTA Paragraph Text</label>
              <textarea
                rows={3}
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                placeholder="Partner with Precision & Co. for strategic financial guidance..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex items-center space-x-6 pt-3 border-t border-slate-800">
              <label className="flex items-center space-x-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Featured Industry on Homepage</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Active & Published Live</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LIST / GRID BROWSER VIEW
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Industry Verticals Manager</h1>
            <p className="text-slate-400 text-xs">Manage specialized industry solutions, statistics, and target sectors.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search industries..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 transition-all border border-amber-400/30"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Industry Vertical
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ind) => (
          <div
            key={ind.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between group space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {ind.category || 'Industry'}
                </span>
                <div className="flex items-center space-x-2">
                  {ind.featured && (
                    <span className="flex items-center text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      <Star className="w-3 h-3 mr-1 fill-amber-400" /> Featured
                    </span>
                  )}
                  <span className={`w-2.5 h-2.5 rounded-full ${ind.active !== false ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">{ind.title}</h3>
                <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">{ind.summary}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(ind)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center"
              >
                Edit Page Content <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(ind)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                  title="Edit Industry"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this industry?')) onDelete(ind.id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Delete Industry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
