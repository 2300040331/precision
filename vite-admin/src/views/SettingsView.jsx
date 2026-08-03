import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SettingsView({ settings, onSaveSettings }) {
  const [form, setForm] = useState(settings || {
    siteName: 'Precision & Co.',
    tagline: 'Precision in Numbers. Excellence in Business.',
    contactEmail: 'contact@precisionandco.com',
    contactPhone: '+91 98765 43210',
    address: 'Precision House, Level 4, Financial District, Gachibowli, Hyderabad, Telangana 500032',
    workingHours: 'Monday - Saturday: 9:00 AM - 6:30 PM IST',
    socialLinkedin: 'https://linkedin.com/company/precisionandco',
    socialTwitter: 'https://twitter.com/precisionandco',
    robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://precisionandco.com/sitemap.xml',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSaveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Website Settings & SEO Configuration</h1>
            <p className="text-slate-400 text-xs">Manage company details, contact info, branding logos, and search engine optimization.</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 transition-all border border-amber-400/30"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
          {saved ? 'Settings Saved!' : 'Save All Settings'}
        </button>
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Company Details */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            Company & Contact Information
          </h2>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Company Name</label>
            <input
              type="text"
              value={form.siteName || ''}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Tagline</label>
            <input
              type="text"
              value={form.tagline || ''}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Official Contact Email</label>
              <input
                type="email"
                value={form.contactEmail || ''}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Official Phone Number</label>
              <input
                type="text"
                value={form.contactPhone || ''}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Physical Office Address</label>
            <textarea
              rows={3}
              value={form.address || ''}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* SEO & Search Engine Management */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            SEO & Search Engine Indexing
          </h2>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Robots.txt Rules</label>
            <textarea
              rows={4}
              value={form.robotsTxt || ''}
              onChange={(e) => setForm({ ...form, robotsTxt: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-amber-300 focus:outline-none"
            />
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Live XML Sitemap Generator</span>
              <a
                href="http://localhost:5000/api/settings/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 font-semibold hover:underline"
              >
                View Live XML →
              </a>
            </div>
            <p className="text-slate-400 text-[11px]">
              Automatically updates whenever pages, services, or industries are published.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
