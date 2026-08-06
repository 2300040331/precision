import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, RefreshCw } from 'lucide-react';

export default function LiveDeviceFrame({ pageSlug = 'home', keyValData }) {
  const [mode, setMode] = useState('desktop'); // desktop | tablet | mobile
  const [key, setKey] = useState(0);

  const getSiteUrl = (slug) => {
    const filename = !slug || slug === 'home' || slug === 'index' ? 'home.html' : slug.endsWith('.html') ? slug : `${slug}.html`;
    if (typeof window !== 'undefined' && window.location) {
      return `${window.location.protocol}//${window.location.host}/${filename}`;
    }
    return `https://precision-henna.vercel.app/${filename}`;
  };

  const targetUrl = getSiteUrl(pageSlug);

  const dimensions = {
    desktop: 'w-full h-[650px]',
    tablet: 'w-[768px] h-[650px]',
    mobile: 'w-[375px] h-[650px]',
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-2xl flex flex-col items-center">
      {/* Simulator Control Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2 text-xs text-slate-300 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Live Responsive Website Simulator</span>
        </div>

        {/* Device Toggles */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('desktop')}
            className={`flex items-center px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              mode === 'desktop' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 mr-1.5" /> Desktop
          </button>
          <button
            onClick={() => setMode('tablet')}
            className={`flex items-center px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              mode === 'tablet' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5 mr-1.5" /> Tablet (768px)
          </button>
          <button
            onClick={() => setMode('mobile')}
            className={`flex items-center px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              mode === 'mobile' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 mr-1.5" /> Mobile (375px)
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setKey(prev => prev + 1)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reload Frame"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <a
            href={targetUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className={`transition-all duration-300 overflow-hidden rounded-xl border border-slate-800 shadow-2xl bg-white relative ${dimensions[mode]}`}>
        <iframe
          key={key}
          src={targetUrl}
          title="Live Preview"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
}
