import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  FileText,
  HelpCircle,
  Tag,
  ShieldCheck,
  FileSpreadsheet,
  TrendingUp,
  Coins,
  PieChart,
  Building,
  Image as ImageIcon,
  Link,
  Sparkles,
} from 'lucide-react';

const getPublicSiteUrl = (path = '/services.html') => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    if (window.location.hostname.includes('vercel.app')) {
      return `https://precision-henna.vercel.app${path}`;
    }
    return `http://${window.location.hostname}:5001${path}`;
  }
  return `https://precision-henna.vercel.app${path}`;
};

export default function ServicesView({ services, selectedServiceId, onCreate, onUpdate, onDuplicate, onDelete, onReorder }) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('general'); // 'general' | 'features' | 'faqs' | 'cta' | 'seo'

  React.useEffect(() => {
    if (selectedServiceId) {
      const target = services.find(s => s.id === selectedServiceId);
      if (target) {
        handleOpenEdit(target);
      }
    }
  }, [selectedServiceId, services]);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    icon: 'ShieldCheck',
    imageUrl: '/assets/images/hero-bg.jpg',
    summary: '',
    description: '',
    features: ['Statutory Compliance', 'Executive Advisory'],
    faqs: [{ question: 'What is required to start?', answer: 'Contact our team for a consultation.' }],
    ctaTitle: 'Ready to elevate your financial strategy and compliance?',
    ctaSubtitle: 'Connect with our senior partners today for a confidential consultation.',
    ctaText: 'Book a Consultation Now',
    ctaLink: 'contact.html',
    active: true,
    metaTitle: '',
    metaDesc: '',
    keywords: '',
  });

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.summary?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setActiveModalTab('general');
    setForm({
      title: '',
      slug: '',
      icon: 'ShieldCheck',
      imageUrl: '/assets/images/hero-bg.jpg',
      summary: '',
      description: '',
      features: ['Statutory Compliance', 'Executive Advisory'],
      faqs: [{ question: 'What is the turnaround time?', answer: 'Typically 3-5 business days.' }],
      ctaTitle: 'Ready to elevate your financial strategy and compliance?',
      ctaSubtitle: 'Connect with our senior partners today for a confidential consultation.',
      ctaText: 'Book a Consultation Now',
      ctaLink: 'contact.html',
      active: true,
      metaTitle: '',
      metaDesc: '',
      keywords: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingId(service.id);
    setActiveModalTab('general');
    setForm({
      title: service.title,
      slug: service.slug,
      icon: service.icon || 'ShieldCheck',
      imageUrl: service.imageUrl || '/assets/images/hero-bg.jpg',
      summary: service.summary || '',
      description: service.description || '',
      features: Array.isArray(service.features) && service.features.length > 0 ? service.features : ['Statutory Audit under Companies Act', 'Internal Financial Controls'],
      faqs: Array.isArray(service.faqs) && service.faqs.length > 0 ? service.faqs : [{ question: 'Who requires a Statutory Audit?', answer: 'All companies registered under the Companies Act 2013.' }],
      ctaTitle: service.ctaTitle || 'Ready to elevate your financial strategy and compliance?',
      ctaSubtitle: service.ctaSubtitle || 'Connect with our senior partners today for a confidential consultation.',
      ctaText: service.ctaText || 'Book a Consultation Now',
      ctaLink: service.ctaLink || 'contact.html',
      active: service.active !== false,
      metaTitle: service.metaTitle || `${service.title} | Precision & Co.`,
      metaDesc: service.metaDesc || service.summary || '',
      keywords: service.keywords || 'Chartered Accountant, Audit, Tax Advisory',
    });
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    setForm(prev => ({ ...prev, features: [...prev.features, 'New Service Feature'] }));
  };

  const handleUpdateFeature = (index, value) => {
    const updated = [...form.features];
    updated[index] = value;
    setForm(prev => ({ ...prev, features: updated }));
  };

  const handleRemoveFeature = (index) => {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleAddFaq = () => {
    setForm(prev => ({ ...prev, faqs: [...prev.faqs, { question: 'New Question', answer: 'New Answer' }] }));
  };

  const handleUpdateFaq = (index, field, value) => {
    const updated = [...form.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setForm(prev => ({ ...prev, faqs: updated }));
  };

  const handleRemoveFaq = (index) => {
    setForm(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, form);
    } else {
      onCreate(form);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 font-sans">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f1d32] p-6 rounded-3xl border border-[#c8a45e]/30 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#c8a45e]/10 rounded-2xl border border-[#c8a45e]/30 text-[#c8a45e]">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">Services & Practice Manager</h1>
            <p className="text-slate-300 text-xs">Edit every heading, photo, feature, FAQ, CTA, and SEO tag for all practice areas.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#c8a45e] absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search practice services..."
              className="bg-[#071322] border border-[#c8a45e]/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#c8a45e]"
            />
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center px-4 py-2.5 bg-gradient-to-r from-[#c8a45e] to-[#a8863e] hover:from-[#d4b46f] hover:to-[#c8a45e] text-[#071322] rounded-xl text-xs font-extrabold shadow-lg shadow-[#c8a45e]/20 transition-all border border-[#e0c580]/40 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create Service
          </button>
        </div>
      </div>

      {/* Services Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-[#0f1d32] p-6 rounded-3xl border border-[#c8a45e]/20 shadow-xl flex flex-col justify-between group hover:border-[#c8a45e]/60 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#071322] border border-[#c8a45e]/30 text-[#c8a45e]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    s.active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {s.active ? 'Active & Live' : 'Disabled'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-[#c8a45e] transition-colors">{s.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">{s.summary}</p>
              </div>

              <div className="text-[10px] text-[#c8a45e] font-mono">
                URL Slug: <span className="text-white font-semibold">/{s.slug}.html</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between border-t border-[#c8a45e]/10 pt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="px-3 py-1.5 bg-[#071322] hover:bg-[#152540] text-[#c8a45e] border border-[#c8a45e]/30 rounded-xl text-xs font-bold transition-all flex items-center"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit All Content
                </button>
                <button
                  onClick={() => onDuplicate(s.id)}
                  className="p-2 text-slate-300 hover:text-[#c8a45e] hover:bg-[#071322] rounded-xl transition-colors"
                  title="Duplicate Service"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(s.id)}
                  className="p-2 text-slate-300 hover:text-red-400 hover:bg-[#071322] rounded-xl transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <a
                href={getPublicSiteUrl(`/${s.slug}.html`)}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#c8a45e] hover:underline font-bold"
              >
                Preview →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Comprehensive Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071322]/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="bg-[#0f1d32] border border-[#c8a45e]/40 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#c8a45e]/20 bg-[#071322]">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#c8a45e]/10 border border-[#c8a45e]/30 text-[#c8a45e]">
                  <Edit2 className="w-5 h-5" />
                </div>
                <h2 className="text-base font-extrabold text-white">
                  {editingId ? `Full Content Editor: ${form.title}` : 'Create New Practice Service'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center border-b border-[#c8a45e]/20 bg-[#071322] px-6 text-xs font-bold">
              <button
                onClick={() => setActiveModalTab('general')}
                className={`py-3 px-4 border-b-2 transition-all ${
                  activeModalTab === 'general' ? 'border-[#c8a45e] text-[#c8a45e]' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                1. General & Photos
              </button>
              <button
                onClick={() => setActiveModalTab('features')}
                className={`py-3 px-4 border-b-2 transition-all ${
                  activeModalTab === 'features' ? 'border-[#c8a45e] text-[#c8a45e]' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                2. Key Features ({form.features.length})
              </button>
              <button
                onClick={() => setActiveModalTab('faqs')}
                className={`py-3 px-4 border-b-2 transition-all ${
                  activeModalTab === 'faqs' ? 'border-[#c8a45e] text-[#c8a45e]' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                3. FAQs ({form.faqs.length})
              </button>
              <button
                onClick={() => setActiveModalTab('cta')}
                className={`py-3 px-4 border-b-2 transition-all ${
                  activeModalTab === 'cta' ? 'border-[#c8a45e] text-[#c8a45e]' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                4. CTA Banner
              </button>
              <button
                onClick={() => setActiveModalTab('seo')}
                className={`py-3 px-4 border-b-2 transition-all ${
                  activeModalTab === 'seo' ? 'border-[#c8a45e] text-[#c8a45e]' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                5. SEO & Meta Tags
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[65vh] overflow-y-auto text-xs scrollbar-thin scrollbar-thumb-[#071322]">
              {/* Tab 1: General & Photos */}
              {activeModalTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[#c8a45e] font-bold">Service Title *</label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#c8a45e]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#c8a45e] font-bold">URL Slug</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#c8a45e]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[#c8a45e] font-bold">Banner Photo / Hero Image URL</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={form.imageUrl}
                          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                          className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#c8a45e]"
                        />
                        <button type="button" className="px-3 py-2 bg-[#071322] border border-[#c8a45e]/40 text-[#c8a45e] rounded-xl font-bold">
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#c8a45e] font-bold">Display Icon Symbol</label>
                      <select
                        value={form.icon}
                        onChange={(e) => setForm({ ...form, icon: e.target.value })}
                        className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#c8a45e]"
                      >
                        <option value="ShieldCheck">ShieldCheck (Audit & Governance)</option>
                        <option value="FileSpreadsheet">FileSpreadsheet (Taxation)</option>
                        <option value="TrendingUp">TrendingUp (Virtual CFO & Advisory)</option>
                        <option value="Coins">Coins (GST & Wealth)</option>
                        <option value="PieChart">PieChart (Valuation & Transactions)</option>
                        <option value="Building">Building (Company Law & Secretarial)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#c8a45e] font-bold">Short Summary (Card Description)</label>
                    <textarea
                      rows={2}
                      value={form.summary}
                      onChange={(e) => setForm({ ...form, summary: e.target.value })}
                      className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#c8a45e]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#c8a45e] font-bold">Detailed Service Overview (Full Body Paragraphs)</label>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#c8a45e]"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <input
                      type="checkbox"
                      id="activeCheck"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="w-4 h-4 rounded text-[#c8a45e] focus:ring-[#c8a45e]"
                    />
                    <label htmlFor="activeCheck" className="text-white font-bold cursor-pointer">
                      Service Active & Visible on Website
                    </label>
                  </div>
                </div>
              )}

              {/* Tab 2: Key Features */}
              {activeModalTab === 'features' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#c8a45e] font-bold">Key Capabilities & Features List</span>
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 py-1.5 bg-[#071322] border border-[#c8a45e]/40 text-[#c8a45e] rounded-xl font-bold flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Feature
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                          className="flex-1 bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#c8a45e]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: FAQs */}
              {activeModalTab === 'faqs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#c8a45e] font-bold">Frequently Asked Questions (FAQs)</span>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-3 py-1.5 bg-[#071322] border border-[#c8a45e]/40 text-[#c8a45e] rounded-xl font-bold flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add FAQ Item
                    </button>
                  </div>

                  <div className="space-y-4">
                    {form.faqs.map((faq, idx) => (
                      <div key={idx} className="p-4 bg-[#071322] border border-[#c8a45e]/20 rounded-2xl space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="absolute top-3 right-3 p-1 text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="space-y-1">
                          <label className="text-slate-300 font-semibold">Question #{idx + 1}</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                            className="w-full bg-[#0f1d32] border border-[#c8a45e]/30 rounded-xl px-3 py-1.5 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-300 font-semibold">Answer</label>
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                            className="w-full bg-[#0f1d32] border border-[#c8a45e]/30 rounded-xl px-3 py-1.5 text-white text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: CTA Banner */}
              {activeModalTab === 'cta' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[#c8a45e] font-bold">Call to Action Heading</label>
                    <input
                      type="text"
                      value={form.ctaTitle}
                      onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })}
                      className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#c8a45e] font-bold">CTA Subtitle Description</label>
                    <textarea
                      rows={2}
                      value={form.ctaSubtitle}
                      onChange={(e) => setForm({ ...form, ctaSubtitle: e.target.value })}
                      className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[#c8a45e] font-bold">Button Text</label>
                      <input
                        type="text"
                        value={form.ctaText}
                        onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                        className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#c8a45e] font-bold">Button Link Target</label>
                      <input
                        type="text"
                        value={form.ctaLink}
                        onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                        className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: SEO */}
              {activeModalTab === 'seo' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[#c8a45e] font-bold">Meta Title Tag</label>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                      className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#c8a45e] font-bold">Meta Description</label>
                    <textarea
                      rows={3}
                      value={form.metaDesc}
                      onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
                      className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#c8a45e] font-bold">Target Search Keywords</label>
                    <input
                      type="text"
                      value={form.keywords}
                      onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                      className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#c8a45e]/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#071322] hover:bg-[#152540] text-slate-300 border border-[#c8a45e]/30 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#c8a45e] to-[#a8863e] hover:from-[#d4b46f] hover:to-[#c8a45e] text-[#071322] font-extrabold rounded-xl shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40 uppercase tracking-wider"
                >
                  {editingId ? 'Save & Publish All Content' : 'Create Practice Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
