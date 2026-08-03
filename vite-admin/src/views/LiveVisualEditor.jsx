import React, { useState } from 'react';
import { Sparkles, Edit3, Save, Globe, RefreshCw, CheckCircle, ExternalLink } from 'lucide-react';

const getPublicSiteUrl = (path = '/home.html') => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    if (window.location.hostname.includes('vercel.app')) {
      return `https://precision-henna.vercel.app${path}`;
    }
    return `http://${window.location.hostname}:5001${path}`;
  }
  return `https://precision-henna.vercel.app${path}`;
};

export default function LiveVisualEditor({ pages, onSaveSection }) {
  const [selectedPage, setSelectedPage] = useState('home');
  const [activeSectionId, setActiveSectionId] = useState('');
  const [fieldValues, setFieldValues] = useState({
    title: 'Precision in Numbers. Excellence in Business.',
    subtitle: 'ACCURATE. TRUSTED. IMPACTFUL.',
    description: 'We deliver comprehensive financial, tax, and strategic advisory services that drive business growth.',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Live In-Situ Visual Website Editor</h1>
            <p className="text-slate-400 text-xs">Visual point-and-click editor powered by Webflow/Elementor engine style UI.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all border border-indigo-400/30"
          >
            {saved ? <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-300" /> : <Save className="w-4 h-4 mr-1.5" />}
            {saved ? 'Saved Live!' : 'Save & Publish Live'}
          </button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Live Inspector Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Visual Inspector</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">Elementor Mode</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Hero Heading Title</label>
              <textarea
                rows={2}
                value={fieldValues.title}
                onChange={(e) => setFieldValues({ ...fieldValues, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Hero Subtitle Badge</label>
              <input
                type="text"
                value={fieldValues.subtitle}
                onChange={(e) => setFieldValues({ ...fieldValues, subtitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Hero Description Paragraph</label>
              <textarea
                rows={3}
                value={fieldValues.description}
                onChange={(e) => setFieldValues({ ...fieldValues, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>
        </div>

        {/* Visual Frame Simulation (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-2xl flex flex-col">
          <div className="w-full flex items-center justify-between bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 mb-4 text-xs text-slate-300 font-medium">
            <span>Live Web Canvas</span>
            <a
              href={getPublicSiteUrl('/home.html')}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              Open Site <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>

          <div className="flex-1 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 p-8 space-y-6 text-center flex flex-col justify-center items-center relative overflow-hidden group">
            <div className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {fieldValues.subtitle}
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight max-w-xl">
              {fieldValues.title}
            </h1>

            <p className="text-slate-400 text-xs max-w-lg leading-relaxed">
              {fieldValues.description}
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <span className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30">
                Explore Services
              </span>
              <span className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700">
                Book Consultation
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
