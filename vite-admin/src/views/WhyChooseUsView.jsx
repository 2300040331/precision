import React, { useState } from 'react';
import {
  Award,
  Upload,
  Globe,
  Eye,
  Check,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Save,
  CheckCircle2,
} from 'lucide-react';

const ImageDropzone = ({ value, onChange, label = 'Section Picture' }) => {
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
        {value && <span className="text-[10px] text-emerald-400 font-bold flex items-center"><Check className="w-3 h-3 mr-1" /> Image Loaded</span>}
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
              <p className="text-[11px] text-slate-400 mt-0.5">or <span className="text-indigo-400 font-semibold underline">click to select image</span></p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        )}
      </div>
    </div>
  );
};

export default function WhyChooseUsView({ onSave }) {
  const [form, setForm] = useState({
    heroTitle: 'Beyond Compliance. Building Confidence.',
    heroDesc: 'Precision & CO is more than an CA firm. We are strategic architects of your financial growth, combining rigorous analysis with innovative thinking to build businesses that endure.',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    
    philosophyTitle: 'Our Philosophy',
    philosophyBody: 'We believe that true financial mastery lies not in looking backward at what has happened, but in looking forward to what is possible. By bridging the gap between traditional accounting and forward-thinking business strategy, we redefine what a Chartered Accountant firm can achieve for you.',
    missionText: 'To empower businesses with financial clarity and strategic confidence.',
    visionText: 'To be the world’s most trusted chartered accountant advisory firm.',
    quoteText: 'Precision is not just our name, it is our methodology.',

    metrics: [
      { id: 1, count: '100%', label: 'Partner-Led Strategy' },
      { id: 2, count: '360°', label: 'Holistic Advisory' },
      { id: 3, count: '24h', label: 'Proactive Insight' },
      { id: 4, count: '0', label: 'Hidden Complexities' },
    ],

    features: [
      { id: 1, title: 'Proactive Planning', text: 'We anticipate financial shifts before they happen, keeping you steps ahead of regulatory and market changes.' },
      { id: 2, title: 'Personalized Advisory', text: 'No cookie-cutter solutions. We architect strategies tailored exactly to your business model.' },
      { id: 3, title: 'Technology Driven', text: 'Leveraging AI and cloud accounting to deliver real-time, actionable insights securely.' },
      { id: 4, title: 'Unwavering Integrity', text: 'Operating with uncompromised ethics, transparency, and strict statutory compliance.' },
    ],
  });

  const [saved, setSaved] = useState(false);

  const handleSaveForm = () => {
    if (onSave) onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 font-sans pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Why Choose Us Page Manager</h1>
            <p className="text-slate-400 text-xs">Manage philosophy, trust metrics, and brand differentiators matching <code className="text-indigo-400">why-choose-us.html</code>.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://precision-henna.vercel.app/why-choose-us.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
          >
            <Globe className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> View Live Web Page
          </a>

          <button
            onClick={handleSaveForm}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition-all"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
            {saved ? 'Page Changes Saved!' : 'Save Page Content'}
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO SECTION */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
        <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">1. Hero Section Banner</h2>
        <ImageDropzone
          value={form.heroImage}
          onChange={(img) => setForm({ ...form, heroImage: img })}
          label="Hero Background Image"
        />
        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">Hero Title</label>
          <input
            type="text"
            value={form.heroTitle}
            onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">Hero Subtitle / Description</label>
          <textarea
            rows={2}
            value={form.heroDesc}
            onChange={(e) => setForm({ ...form, heroDesc: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300"
          />
        </div>
      </div>

      {/* SECTION 2: OUR PHILOSOPHY & MISSION/VISION */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
        <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">2. Our Philosophy & Core Values</h2>
        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">Section Title</label>
          <input
            type="text"
            value={form.philosophyTitle}
            onChange={(e) => setForm({ ...form, philosophyTitle: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">Philosophy Main Statement</label>
          <textarea
            rows={3}
            value={form.philosophyBody}
            onChange={(e) => setForm({ ...form, philosophyBody: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Mission Statement</label>
            <input
              type="text"
              value={form.missionText}
              onChange={(e) => setForm({ ...form, missionText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Vision Statement</label>
            <input
              type="text"
              value={form.visionText}
              onChange={(e) => setForm({ ...form, visionText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-semibold">Brand Quote Statement</label>
          <input
            type="text"
            value={form.quoteText}
            onChange={(e) => setForm({ ...form, quoteText: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-serif italic"
          />
        </div>
      </div>

      {/* SECTION 3: TRUST METRICS (4 COUNTERS) */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
        <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">3. Trust Metrics (4 Counter Cards)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {form.metrics.map((m, idx) => (
            <div key={m.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] text-slate-500 font-mono font-bold block">Counter #{idx + 1}</span>
              <input
                type="text"
                value={m.count}
                onChange={(e) => {
                  const updated = form.metrics.map(item => item.id === m.id ? { ...item, count: e.target.value } : item);
                  setForm({ ...form, metrics: updated });
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-extrabold text-base"
              />
              <input
                type="text"
                value={m.label}
                onChange={(e) => {
                  const updated = form.metrics.map(item => item.id === m.id ? { ...item, label: e.target.value } : item);
                  setForm({ ...form, metrics: updated });
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: WHAT MAKES US DIFFERENT */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
        <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">4. What Makes Us Different (Feature Cards)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.features.map((f, idx) => (
            <div key={f.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] text-indigo-400 font-mono font-bold block">Feature Card #{idx + 1}</span>
              <input
                type="text"
                value={f.title}
                onChange={(e) => {
                  const updated = form.features.map(item => item.id === f.id ? { ...item, title: e.target.value } : item);
                  setForm({ ...form, features: updated });
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-bold"
              />
              <textarea
                rows={2}
                value={f.text}
                onChange={(e) => {
                  const updated = form.features.map(item => item.id === f.id ? { ...item, text: e.target.value } : item);
                  setForm({ ...form, features: updated });
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
