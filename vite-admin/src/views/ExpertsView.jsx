import React, { useState, useEffect } from 'react';
import {
  Users,
  Globe,
  Upload,
  Check,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Quote,
} from 'lucide-react';
import { uploadImageToBlob } from '../services/blobUpload';

const ImageDropzone = ({ value, onChange, label = 'Group Photograph Visual' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    try {
      onChange(await uploadImageToBlob(file));
    } catch (error) {
      setUploadError(error.message || 'Photo upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-slate-300 font-semibold flex items-center justify-between text-xs">
        <span>{label}</span>
        {isUploading ? (
          <span className="text-[10px] text-amber-400 font-bold">Uploading to Vercel…</span>
        ) : (
          value && (
            <span className="text-[10px] text-emerald-400 font-bold flex items-center">
              <Check className="w-3 h-3 mr-1" /> Image Loaded
            </span>
          )
        )}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all text-center flex flex-col items-center justify-center ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10'
            : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
        }`}
      >
        {value ? (
          <div className="relative w-full group">
            <img
              src={value}
              alt="Founders Group preview"
              className="h-56 w-full object-cover rounded-xl border border-slate-800 shadow-md"
            />
            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center space-x-3">
              <label className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg">
                Change Photograph
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="w-full py-6 flex flex-col items-center justify-center cursor-pointer space-y-2">
            <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Drag & drop 5-person group photo here</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                or <span className="text-amber-400 font-semibold underline">click to select file</span>
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        )}
      </div>
      {uploadError && <p className="text-[11px] text-red-400">{uploadError}</p>}
    </div>
  );
};

export default function ExpertsView({ experts: initialExperts, pageHeader: initialPageHeader, onSave }) {
  const defaultFounders = [
    {
      id: 1,
      name: 'AZMAL',
      role: 'Founder / [Managing Partner]',
      summary: 'Great things are built when vision meets execution with unyielding integrity.',
      position: 'Far Left (1)',
      active: true,
    },
    {
      id: 2,
      name: 'NARENDRA',
      role: 'Co-Founder / [Tax & Advisory]',
      summary: 'Precision is not just our standard — it is the cornerstone of trust with every partner.',
      position: 'Second Left (2)',
      active: true,
    },
    {
      id: 3,
      name: 'GANESH',
      role: 'Co-Founder / [Corporate Strategy]',
      summary: 'Our commitment to excellence ensures every business moves forward with unwavering confidence.',
      position: 'Center (3)',
      active: true,
    },
    {
      id: 4,
      name: 'PAVAN',
      role: 'Co-Founder / [Risk Advisory]',
      summary: 'True value is created when innovation in strategy seamlessly aligns with rigorous compliance.',
      position: 'Second Right (4)',
      active: true,
    },
    {
      id: 5,
      name: 'DINESH',
      role: 'Co-Founder / [Audit & Assurance]',
      summary: 'Empowering organizations through financial clarity and strategic foresight drives sustainable growth.',
      position: 'Far Right (5)',
      active: true,
    },
  ];

  const defaultHeader = {
    eyebrow: 'THE FOUNDERS',
    title: 'Your Vision. <span class="gold-text">Our Financial Expertise.</span>',
    subtitle: 'Words from the Founders',
    heroImage: 'assets/images/founders-group.jpg',
  };

  const [foundersList, setFoundersList] = useState(
    Array.isArray(initialExperts) && initialExperts.length === 5 ? initialExperts : defaultFounders
  );

  const [pageHeader, setPageHeader] = useState(
    initialPageHeader && initialPageHeader.title ? initialPageHeader : defaultHeader
  );

  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (Array.isArray(initialExperts) && initialExperts.length > 0) {
      setFoundersList(initialExperts);
    }
  }, [initialExperts]);

  useEffect(() => {
    if (initialPageHeader) setPageHeader(initialPageHeader);
  }, [initialPageHeader]);

  const triggerSave = async (updatedList = foundersList, updatedHeader = pageHeader) => {
    setIsSaving(true);
    setSaveError('');
    try {
      if (onSave) await onSave(updatedList, updatedHeader);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setSaveError(error.message || 'Unable to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFounderChange = (index, field, value) => {
    const updated = [...foundersList];
    updated[index] = { ...updated[index], [field]: value };
    setFoundersList(updated);
  };

  const handleResetToWebsiteDefaults = () => {
    setFoundersList(defaultFounders);
    setPageHeader(defaultHeader);
    triggerSave(defaultFounders, defaultHeader);
  };

  const currentFounder = foundersList[activePreviewIndex] || foundersList[0];

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Founders Showcase Manager</h1>
            <p className="text-slate-400 text-xs">
              Manage the central hero group photograph, headline, founder designations, and quotes matching <code className="text-amber-400">experts.html</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://precision-henna.vercel.app/experts.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
          >
            <Globe className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> View Live Website
          </a>

          <button
            onClick={handleResetToWebsiteDefaults}
            className="flex items-center px-3.5 py-2 bg-slate-800 hover:bg-amber-950 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold shadow transition-all"
            title="Reset to website defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Reset Defaults
          </button>

          <button
            onClick={() => triggerSave()}
            disabled={isSaving}
            className="flex items-center px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all border border-amber-400/40"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            {saved ? 'Changes Saved Live!' : isSaving ? 'Saving to Vercel…' : 'Save Showcase'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center justify-between animate-fade-in">
          <span className="flex items-center">
            <Check className="w-4 h-4 mr-2 text-emerald-400" /> Edits saved cleanly! Live on <code className="mx-1 text-white">experts.html</code> & <code className="mx-1 text-white">home.html</code>.
          </span>
          <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-2 py-0.5 rounded-full">Live Synced</span>
        </div>
      )}
      {saveError && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs font-semibold">{saveError}</div>}

      {/* 1. Header Settings & Hero Group Photo */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
        <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
          <Sparkles className="w-4 h-4 mr-1.5" /> Section Header & Central Group Visual
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Eyebrow Label</label>
            <input
              type="text"
              value={pageHeader.eyebrow || 'THE FOUNDERS'}
              onChange={(e) => setPageHeader({ ...pageHeader, eyebrow: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-mono text-xs font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Main Headline</label>
            <input
              type="text"
              value={pageHeader.title || 'Your Vision. Our Financial Expertise.'}
              onChange={(e) => setPageHeader({ ...pageHeader, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Quotes Area Subtitle</label>
            <input
              type="text"
              value={pageHeader.subtitle || 'Words from the Founders'}
              onChange={(e) => setPageHeader({ ...pageHeader, subtitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
            />
          </div>
        </div>

        <div className="pt-2">
          <ImageDropzone
            value={pageHeader.heroImage || 'assets/images/founders-group.jpg'}
            onChange={(newImg) => setPageHeader({ ...pageHeader, heroImage: newImg })}
            label="Central Founders Hero Photograph (HD 4K Group Visual)"
          />
        </div>
      </div>

      {/* 2. The 5 Founders Index & Quotes Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            The 5 Founders Index & Quotes (Left to Right Order)
          </h2>
          <span className="text-[11px] font-mono text-slate-400">5 Founder Slots</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {foundersList.map((founder, index) => (
            <div
              key={founder.id || index}
              className={`bg-slate-900 p-4 rounded-2xl border transition-all space-y-3 ${
                activePreviewIndex === index ? 'border-amber-500/80 bg-amber-500/5 shadow-lg' : 'border-slate-800 hover:border-slate-700'
              }`}
              onClick={() => setActivePreviewIndex(index)}
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-[10px] font-mono font-bold text-amber-400">
                  SLOT {index + 1}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {index === 0 ? 'Far Left' : index === 1 ? 'Second Left' : index === 2 ? 'Center' : index === 3 ? 'Second Right' : 'Far Right'}
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold">Founder Name</label>
                <input
                  type="text"
                  value={founder.name}
                  onChange={(e) => handleFounderChange(index, 'name', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-extrabold uppercase tracking-wider"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold">Designation / Role</label>
                <input
                  type="text"
                  value={founder.role}
                  onChange={(e) => handleFounderChange(index, 'role', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold">Founder Quote</label>
                <textarea
                  rows={4}
                  value={founder.summary || ''}
                  onChange={(e) => handleFounderChange(index, 'summary', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 leading-relaxed italic"
                  placeholder="Quote from founder..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive Admin Live Preview Component */}
      <div className="bg-[#050e17] p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <span className="text-xs font-mono font-bold text-amber-400 flex items-center uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Interactive Admin Live Preview
          </span>
          <span className="text-[11px] text-slate-400">Click any founder name to test quote transition</span>
        </div>

        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono font-extrabold text-amber-400 tracking-widest uppercase">
            {pageHeader.eyebrow || 'THE FOUNDERS'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
            {pageHeader.title || 'Your Vision. Our Financial Expertise.'}
          </h2>
        </div>

        {/* Hero Image Frame */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl max-w-4xl mx-auto">
          <img
            src={pageHeader.heroImage || 'assets/images/founders-group.jpg'}
            alt="Founders Hero Preview"
            className="w-full h-auto object-cover max-h-96"
          />
        </div>

        {/* Names Nav Row */}
        <div className="grid grid-cols-5 gap-2 max-w-4xl mx-auto pt-2">
          {foundersList.map((f, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActivePreviewIndex(i)}
              className={`p-3 rounded-xl border text-center transition-all ${
                activePreviewIndex === i
                  ? 'bg-amber-500/10 border-amber-500/60 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <h4 className={`text-xs font-extrabold tracking-wider ${activePreviewIndex === i ? 'text-amber-400' : 'text-white'}`}>
                {f.name}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{f.role}</p>
            </button>
          ))}
        </div>

        {/* Quote Card Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center max-w-3xl mx-auto space-y-3 relative">
          <Quote className="w-8 h-8 text-amber-500/20 mx-auto" />
          <p className="text-slate-200 text-sm sm:text-base font-serif italic leading-relaxed">
            “{currentFounder.summary}”
          </p>
          <p className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            — {currentFounder.name}
          </p>
        </div>
      </div>
    </div>
  );
}
