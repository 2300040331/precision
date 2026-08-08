import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Copy,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Globe,
  Layers,
  Sparkles,
  Upload,
  ChevronRight,
  Image as ImageIcon,
  HelpCircle,
  Check,
  Award,
  ShieldCheck,
  Clock,
  Target,
  Palette,
  Eye,
  EyeOff,
  ChevronDown,
  RotateCcw,
  RotateCw,
  X,
  FileText,
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

// Section Styling & Typography Control Toolbar Component
const SectionStyleToolbar = ({ styles = {}, onChangeStyles, onDuplicate, onToggleVisibility, visible = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateStyle = (key, val) => {
    onChangeStyles({ ...styles, [key]: val });
  };

  return (
    <div className="border border-slate-800/80 bg-slate-950/60 rounded-xl p-3 space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <Palette className="w-3.5 h-3.5 mr-1.5" />
          <span>🎨 Section Styling, Fonts & Spacing</span>
          <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center space-x-2">
          {onToggleVisibility && (
            <button
              type="button"
              onClick={onToggleVisibility}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center transition-all ${
                visible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {visible ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
              {visible ? 'Visible' : 'Hidden'}
            </button>
          )}

          {onDuplicate && (
            <button
              type="button"
              onClick={onDuplicate}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-700 flex items-center transition-all"
            >
              <Copy className="w-3 h-3 mr-1" /> Duplicate Section
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-[11px]">
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={styles.textColor || '#ffffff'}
                onChange={(e) => updateStyle('textColor', e.target.value)}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer"
              />
              <span className="text-slate-300 font-mono text-[10px]">{styles.textColor || '#ffffff'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Background</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={styles.bgColor || '#0f1d32'}
                onChange={(e) => updateStyle('bgColor', e.target.value)}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer"
              />
              <span className="text-slate-300 font-mono text-[10px]">{styles.bgColor || '#0f1d32'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Button Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={styles.btnColor || '#c8a45e'}
                onChange={(e) => updateStyle('btnColor', e.target.value)}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer"
              />
              <span className="text-slate-300 font-mono text-[10px]">{styles.btnColor || '#c8a45e'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Font Family</label>
            <select
              value={styles.fontFamily || 'sans'}
              onChange={(e) => updateStyle('fontFamily', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px]"
            >
              <option value="sans">Inter / Sans-Serif</option>
              <option value="serif">Playfair / Serif</option>
              <option value="mono">Space Mono</option>
              <option value="outfit">Outfit Clean</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Font Size</label>
            <select
              value={styles.fontSize || 'normal'}
              onChange={(e) => updateStyle('fontSize', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px]"
            >
              <option value="small">Compact (14px)</option>
              <option value="normal">Standard (16px)</option>
              <option value="large">Large (18px)</option>
              <option value="xl">Title XL (24px)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Font Weight</label>
            <select
              value={styles.fontWeight || 'bold'}
              onChange={(e) => updateStyle('fontWeight', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px]"
            >
              <option value="normal">Normal (400)</option>
              <option value="medium">Medium (500)</option>
              <option value="semibold">SemiBold (600)</option>
              <option value="bold">Bold (700)</option>
              <option value="extrabold">ExtraBold (800)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Text Alignment</label>
            <select
              value={styles.textAlign || 'left'}
              onChange={(e) => updateStyle('textAlign', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px]"
            >
              <option value="left">Left Aligned</option>
              <option value="center">Center Aligned</option>
              <option value="right">Right Aligned</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Padding / Spacing</label>
            <select
              value={styles.padding || 'standard'}
              onChange={(e) => updateStyle('padding', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px]"
            >
              <option value="compact">Compact (py-4)</option>
              <option value="standard">Standard (py-8)</option>
              <option value="spacious">Spacious (py-12)</option>
              <option value="expanded">Expanded (py-16)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
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
          isDragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
        }`}
      >
        {value ? (
          <div className="relative w-full group">
            <img src={value} alt="Uploaded preview" className="h-44 w-full object-cover rounded-xl border border-slate-800 shadow-md" />
            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center space-x-3">
              <label className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg">
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
          <label className="w-full py-6 flex flex-col items-center justify-center cursor-pointer space-y-2">
            <div className="p-3 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Drag & drop picture here</p>
              <p className="text-[11px] text-slate-400 mt-0.5">or <span className="text-indigo-400 font-semibold underline">click to choose from computer</span></p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        )}
      </div>
    </div>
  );
};

export default function ServicesView({ services, selectedServiceId, onCreate, onUpdate, onDuplicate, onDelete, onReorder }) {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'editor'
  const [editingId, setEditingId] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving'
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [form, setForm] = useState({
    title: 'Audit & Assurance',
    slug: 'services-audit',
    heroSubtitle: 'Ensuring financial integrity and stakeholder trust.',
    heroDescription: 'We improve transparency, credibility, and regulatory compliance through rigorous auditing standards.',
    heroBtnText: 'Book Consultation',
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',

    introHeading: 'An effective Audit & Assurance strategy provides a distinct competitive advantage',
    introText1: 'Enhancing stakeholder value is a fundamental concept which drives every management effort in the modern business environment. Progressive organizations have realized that audits should be viewed as a dynamic tool for insight rather than a passive compliance check.',
    introText2: 'We have developed a total audit capability which encompasses the entire spectrum of financial and operational risk. Our approach is multi-jurisdictional, allowing us to provide quality national and international assurance.',

    capabilitiesTitle: 'Our Capabilities',
    capabilities: [
      { id: 1, title: 'Statutory Audit', text: 'Dedicated audit professionals with in-depth technical knowledge ensuring compliance and transparency.', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop' },
      { id: 2, title: 'Internal Audit', text: "In today's interconnected global economy, leaders are grappling with the complexities of stringently managing internal controls.", image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop' },
      { id: 3, title: 'Information Systems Audit', text: 'Technology is the primary driver of operations around the world. We ensure your systems are robust and secure.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop' },
      { id: 4, title: 'Forensic Audit', text: 'Whether dealing with small-scale or large investigations, understanding how to effectively manage risks is crucial.', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop' },
    ],

    mattersTitle: 'Why It Matters',
    mattersCards: [
      { title: 'Compliance', text: 'Ensure adherence to the latest regulations.' },
      { title: 'Risk Reduction', text: 'Identify and mitigate potential vulnerabilities.' },
      { title: 'Financial Accuracy', text: 'Maintain pristine records for stakeholders.' },
      { title: 'Business Growth', text: 'Unlock strategic insights for scaling.' },
    ],

    timelineTitle: 'What We Do',
    timelineSteps: [
      { title: 'Comprehensive Review', text: 'Deep-dive analysis into your current operations.' },
      { title: 'Strategic Planning', text: 'Customized roadmaps aligning with your goals.' },
    ],

    customSections: [],
    ctaTitle: 'Ready to Elevate Your Business?',
    ctaText: 'Partner with Precision & Co. for strategic financial guidance, unmatched expertise, and a commitment to your long-term success.',
    active: true,
  });

  const updateForm = (newForm) => {
    setHistory(prev => [...prev, form]);
    setRedoStack([]);
    setForm(newForm);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack(r => [form, ...r]);
    setForm(prev);
    setHistory(h => h.slice(0, h.length - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory(h => [...h, form]);
    setForm(next);
    setRedoStack(r => r.slice(1));
  };

  const isInitialMount = useRef(true);

  // Auto-save logic: Automatically persist changes live without requiring save buttons
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
    if (selectedServiceId) {
      const target = services.find(s => s.id === selectedServiceId);
      if (target) {
        handleOpenEdit(target);
      }
    }
  }, [selectedServiceId, services]);

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.heroSubtitle?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    const newId = Date.now();
    const newForm = {
      id: newId,
      title: 'New Advisory Practice Service',
      slug: `services-new-${newId}`,
      heroSubtitle: 'Ensuring financial integrity and stakeholder trust.',
      heroDescription: 'We improve transparency, credibility, and regulatory compliance through rigorous auditing standards.',
      heroBtnText: 'Book Consultation',
      heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',

      introHeading: 'An effective Audit & Assurance strategy provides a distinct competitive advantage',
      introText1: 'Enhancing stakeholder value is a fundamental concept which drives every management effort in the modern business environment.',
      introText2: 'We have developed a total audit capability which encompasses the entire spectrum of financial and operational risk.',

      capabilitiesTitle: 'Our Capabilities',
      capabilities: [
        { id: 1, title: 'Statutory Audit', text: 'Dedicated audit professionals with in-depth technical knowledge.', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop' },
        { id: 2, title: 'Internal Audit', text: 'Managing internal controls and risk frameworks.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop' },
        { id: 3, title: 'Information Systems Audit', text: 'Ensuring your technology systems are robust and secure.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop' },
        { id: 4, title: 'Forensic Audit', text: 'Understanding how to effectively manage financial risks.', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop' },
      ],

      mattersTitle: 'Why It Matters',
      mattersCards: [
        { title: 'Compliance', text: 'Ensure adherence to the latest regulations.' },
        { title: 'Risk Reduction', text: 'Identify and mitigate potential vulnerabilities.' },
        { title: 'Financial Accuracy', text: 'Maintain pristine records for stakeholders.' },
        { title: 'Business Growth', text: 'Unlock strategic insights for scaling.' },
      ],

      timelineTitle: 'What We Do',
      timelineSteps: [
        { title: 'Comprehensive Review', text: 'Deep-dive analysis into your current operations.' },
        { title: 'Strategic Planning', text: 'Customized roadmaps aligning with your goals.' },
      ],

      customSections: [],
      ctaTitle: 'Ready to Elevate Your Business?',
      ctaText: 'Partner with Precision & Co. for strategic financial guidance, unmatched expertise, and a commitment to your long-term success.',
      active: true,
    };
    onCreate(newForm);
    setEditingId(newId);
    setForm(newForm);
    setViewMode('editor');
  };

  const handleOpenEdit = (s) => {
    setEditingId(s.id);
    setForm({
      title: s.title || 'Audit & Assurance',
      slug: s.slug || 'services-audit',
      heroSubtitle: s.heroSubtitle || 'Ensuring financial integrity and stakeholder trust.',
      heroDescription: s.heroDescription || 'We improve transparency, credibility, and regulatory compliance through rigorous auditing standards.',
      heroBtnText: s.heroBtnText || 'Book Consultation',
      heroImage: s.heroImage || s.imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',

      introHeading: s.introHeading || 'An effective Audit & Assurance strategy provides a distinct competitive advantage',
      introText1: s.introText1 || 'Enhancing stakeholder value is a fundamental concept which drives every management effort in the modern business environment.',
      introText2: s.introText2 || 'We have developed a total audit capability which encompasses the entire spectrum of financial and operational risk.',

      capabilitiesTitle: s.capabilitiesTitle || 'Our Capabilities',
      capabilities: Array.isArray(s.capabilities) && s.capabilities.length ? s.capabilities : [
        { id: 1, title: 'Statutory Audit', text: 'Dedicated audit professionals with in-depth technical knowledge ensuring compliance and transparency.', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop' },
        { id: 2, title: 'Internal Audit', text: "In today's interconnected global economy, leaders are grappling with the complexities of stringently managing internal controls.", image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop' },
        { id: 3, title: 'Information Systems Audit', text: 'Technology is the primary driver of operations around the world. We ensure your systems are robust and secure.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop' },
        { id: 4, title: 'Forensic Audit', text: 'Whether dealing with small-scale or large investigations, understanding how to effectively manage risks is crucial.', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop' },
      ],

      mattersTitle: s.mattersTitle || 'Why It Matters',
      mattersCards: Array.isArray(s.mattersCards) && s.mattersCards.length ? s.mattersCards : [
        { title: 'Compliance', text: 'Ensure adherence to the latest regulations.' },
        { title: 'Risk Reduction', text: 'Identify and mitigate potential vulnerabilities.' },
        { title: 'Financial Accuracy', text: 'Maintain pristine records for stakeholders.' },
        { title: 'Business Growth', text: 'Unlock strategic insights for scaling.' },
      ],

      timelineTitle: s.timelineTitle || 'What We Do',
      timelineSteps: Array.isArray(s.timelineSteps) && s.timelineSteps.length ? s.timelineSteps : [
        { title: 'Comprehensive Review', text: 'Deep-dive analysis into your current operations.' },
        { title: 'Strategic Planning', text: 'Customized roadmaps aligning with your goals.' },
      ],

      customSections: Array.isArray(s.customSections) ? s.customSections : [],
      ctaTitle: s.ctaTitle || 'Ready to Elevate Your Business?',
      ctaText: s.ctaText || 'Partner with Precision & Co. for strategic financial guidance, unmatched expertise, and a commitment to your long-term success.',
      active: s.active !== false,
    });
    setViewMode('editor');
  };

  // Capability Card Handler
  const handleUpdateCapability = (index, field, value) => {
    const next = [...(form.capabilities || [])];
    next[index] = { ...next[index], [field]: value };
    setForm({ ...form, capabilities: next });
  };

  // Matters Card Handler
  const handleUpdateMatter = (index, field, value) => {
    const next = [...(form.mattersCards || [])];
    next[index] = { ...next[index], [field]: value };
    setForm({ ...form, mattersCards: next });
  };

  // Timeline Step Handler
  const handleUpdateTimeline = (index, field, value) => {
    const next = [...(form.timelineSteps || [])];
    next[index] = { ...next[index], [field]: value };
    setForm({ ...form, timelineSteps: next });
  };

  // Custom Section Handlers
  const handleAddCustomSection = () => {
    const title = prompt('Enter Custom Section Title (e.g., Statutory Compliance Steps):');
    if (!title) return;
    const newSec = {
      id: Date.now(),
      title,
      content: 'Detailed description or custom notes for this section.',
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

  // FULL PAGE INLINE SINGLE-PAGE EDITOR MATCHING ALL WEBSITE SECTIONS EXACTLY
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
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to All Services
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-white truncate flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                {form.title || 'Service Page Editor'}
              </h1>
              <p className="text-slate-400 text-[11px] truncate">Single page inline editor • Matches public web page sections 100%</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Undo & Redo buttons */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition-all ${
                history.length > 0 ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed'
              }`}
              title="Undo last change"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Undo
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition-all ${
                redoStack.length > 0 ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed'
              }`}
              title="Redo change"
            >
              <RotateCw className="w-3.5 h-3.5 mr-1" /> Redo
            </button>

            {/* Live Preview Button */}
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview Page
            </button>

            {/* Live Auto-Save Draft Indicator */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveStatus === 'saving' ? 'Saving live draft...' : '✓ Auto-Saved Live Draft'}</span>
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

        {/* Live Interactive Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-4 md:p-8 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-sm font-bold text-white">Live Interactive Page Preview — {form.title}</h3>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#071322] text-slate-100 font-sans">
                {/* Hero Preview */}
                <div className="p-8 rounded-3xl bg-[#0f1d32] border border-[#c8a45e]/30 relative overflow-hidden space-y-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c8a45e] bg-[#c8a45e]/10 px-3 py-1 rounded-full border border-[#c8a45e]/20">
                    {form.heroSubtitle || 'PRACTICE AREA'}
                  </span>
                  <h1 className="text-3xl font-extrabold text-white">{form.title}</h1>
                  <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">{form.heroDescription}</p>
                  {form.heroImage && (
                    <img src={form.heroImage} alt="Hero banner" className="h-64 w-full object-cover rounded-2xl border border-slate-800" />
                  )}
                </div>

                {/* Overview Intro Preview */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h2 className="text-lg font-bold text-[#c8a45e]">{form.introHeading}</h2>
                  <p className="text-slate-300 text-xs leading-relaxed">{form.introText1}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{form.introText2}</p>
                </div>

                {/* Capabilities Preview */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white">{form.capabilitiesTitle || 'Our Capabilities'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(form.capabilities || []).map((cap, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#0f1d32] border border-slate-800 space-y-2">
                        {cap.image && <img src={cap.image} alt={cap.title} className="h-32 w-full object-cover rounded-lg" />}
                        <h4 className="font-bold text-white text-xs">{cap.title}</h4>
                        <p className="text-slate-400 text-[11px]">{cap.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SINGLE PAGE VIEW - MATCHING ALL 5 SCREENSHOT SECTIONS EXACTLY */}
        <div className="space-y-6">
          {/* SECTION 1: HERO SECTION */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                <Briefcase className="w-4 h-4 mr-2" /> 1. Hero Section (Header & Hero Picture)
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Section 1 of 6</span>
            </div>

            {/* Section Styling & Typography Control Toolbar */}
            <SectionStyleToolbar
              styles={form.heroStyles || {}}
              onChangeStyles={(newStyles) => updateForm({ ...form, heroStyles: newStyles })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Service Main Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Audit & Assurance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Page Slug (URL)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="services-audit"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Hero Subtitle</label>
              <input
                type="text"
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                placeholder="Ensuring financial integrity and stakeholder trust."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Hero Paragraph Description</label>
              <textarea
                rows={3}
                value={form.heroDescription}
                onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
                placeholder="We improve transparency, credibility, and regulatory compliance through rigorous auditing standards."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Drag & Drop Hero Picture */}
            <ImageDropzone
              value={form.heroImage}
              onChange={(newImg) => setForm({ ...form, heroImage: newImg })}
              label="Hero Banner Picture (Drag & Drop or Click to Browse)"
            />
          </div>

          {/* SECTION 2: OVERVIEW STATEMENT (NEW SERVICE INTRO) */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                <FileText className="w-4 h-4 mr-2" /> 2. Service Intro & Overview Statement
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Section 2 of 6</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Intro Statement Heading</label>
              <input
                type="text"
                value={form.introHeading}
                onChange={(e) => setForm({ ...form, introHeading: e.target.value })}
                placeholder="An effective Audit & Assurance strategy provides a distinct competitive advantage"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500/50 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Intro Paragraph 1</label>
                <textarea
                  rows={4}
                  value={form.introText1}
                  onChange={(e) => setForm({ ...form, introText1: e.target.value })}
                  placeholder="Enhancing stakeholder value is a fundamental concept which drives every management effort..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Intro Paragraph 2</label>
                <textarea
                  rows={4}
                  value={form.introText2}
                  onChange={(e) => setForm({ ...form, introText2: e.target.value })}
                  placeholder="We have developed a total audit capability which encompasses the entire spectrum..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: OUR CAPABILITIES GRID (4 CARDS WITH PICTURE UPLOADERS) */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" /> 3. Our Capabilities (4 Cards with Pictures)
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Section 3 of 6</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Section Heading</label>
              <input
                type="text"
                value={form.capabilitiesTitle}
                onChange={(e) => setForm({ ...form, capabilitiesTitle: e.target.value })}
                placeholder="Our Capabilities"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {form.capabilities.map((cap, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-indigo-400">Capability Card #{idx + 1}</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold">Card Title</label>
                    <input
                      type="text"
                      value={cap.title}
                      onChange={(e) => handleUpdateCapability(idx, 'title', e.target.value)}
                      placeholder="e.g. Statutory Audit"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold">Card Description</label>
                    <textarea
                      rows={2}
                      value={cap.text}
                      onChange={(e) => handleUpdateCapability(idx, 'text', e.target.value)}
                      placeholder="Dedicated audit professionals..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                    />
                  </div>

                  {/* Card Picture Uploader */}
                  <ImageDropzone
                    value={cap.image}
                    onChange={(newImg) => handleUpdateCapability(idx, 'image', newImg)}
                    label={`Card #${idx + 1} Picture`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: WHY IT MATTERS (4 DARK NAVY CARDS) */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                <Target className="w-4 h-4 mr-2" /> 4. Why It Matters (4 Cards)
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Section 4 of 6</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Section Heading</label>
              <input
                type="text"
                value={form.mattersTitle}
                onChange={(e) => setForm({ ...form, mattersTitle: e.target.value })}
                placeholder="Why It Matters"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {form.mattersCards.map((m, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">Card #{idx + 1}</span>
                  <input
                    type="text"
                    placeholder="Card Title (e.g. Compliance)"
                    value={m.title}
                    onChange={(e) => handleUpdateMatter(idx, 'title', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-bold"
                  />
                  <textarea
                    rows={2}
                    placeholder="Card Description"
                    value={m.text}
                    onChange={(e) => handleUpdateMatter(idx, 'text', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: WHAT WE DO (TIMELINE STEPS) */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                <Clock className="w-4 h-4 mr-2" /> 5. What We Do (Timeline Steps)
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Section 5 of 6</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Section Heading</label>
              <input
                type="text"
                value={form.timelineTitle}
                onChange={(e) => setForm({ ...form, timelineTitle: e.target.value })}
                placeholder="What We Do"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {form.timelineSteps.map((step, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">Timeline Step #{idx + 1}</span>
                  <input
                    type="text"
                    placeholder="Step Title (e.g. Comprehensive Review)"
                    value={step.title}
                    onChange={(e) => handleUpdateTimeline(idx, 'title', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-bold"
                  />
                  <textarea
                    rows={2}
                    placeholder="Step Description"
                    value={step.text}
                    onChange={(e) => handleUpdateTimeline(idx, 'text', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: CUSTOM SECTIONS & ROYAL CTA BANNER */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                <Sparkles className="w-4 h-4 mr-2" /> 6. Custom Sections & Royal CTA Banner
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Section 6 of 6</span>
            </div>

            {/* Custom Sections Add */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-semibold">Custom Sections ({form.customSections?.length || 0})</label>
                <button
                  type="button"
                  onClick={handleAddCustomSection}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Custom Section
                </button>
              </div>

              {form.customSections && form.customSections.map((sec, idx) => (
                <div key={sec.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">Custom Section #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomSection(sec.id)}
                      className="p-1 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => handleUpdateCustomSection(sec.id, 'title', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-bold"
                  />
                  <textarea
                    rows={3}
                    value={sec.content}
                    onChange={(e) => handleUpdateCustomSection(sec.id, 'content', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">CTA Banner Title</label>
                <input
                  type="text"
                  value={form.ctaTitle}
                  onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })}
                  placeholder="Ready to Elevate Your Business?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">CTA Paragraph Text</label>
                <textarea
                  rows={2}
                  value={form.ctaText}
                  onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                  placeholder="Partner with Precision & Co. for strategic financial guidance..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Active & Published Live</span>
                </label>
              </div>
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
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Services Manager (12)</h1>
            <p className="text-slate-400 text-xs">Manage core chartered accountancy practices, deliverables, and page content.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all border border-indigo-400/30"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Practice Service
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all flex flex-col justify-between group space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                  {s.slug || 'service-page'}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${s.active !== false ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">{s.title}</h3>
                <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">{s.heroSubtitle || s.summary}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(s)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
              >
                Edit Page Content <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onDuplicate(s.id)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                  title="Duplicate Service"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                  title="Edit Service"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(s.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Delete Service"
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
