import React, { useState } from 'react';
import { Search, X, Layers, Briefcase, Building2, CalendarCheck, Image, Settings } from 'lucide-react';

export default function GlobalSearchModal({ isOpen, onClose, pages, services, industries, consultations, onNavigate }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredPages = q ? pages.filter(p => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) : pages.slice(0, 3);
  const filteredServices = q ? services.filter(s => s.title.toLowerCase().includes(q) || s.summary?.toLowerCase().includes(q)) : services.slice(0, 3);
  const filteredIndustries = q ? industries.filter(i => i.title.toLowerCase().includes(q)) : industries.slice(0, 3);
  const filteredLeads = q ? consultations.filter(c => c.fullName.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) : consultations.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-950">
          <Search className="w-5 h-5 text-indigo-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search pages, services, industries, leads..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results list */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Pages */}
          {filteredPages.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Website Pages
              </p>
              <div className="space-y-1">
                {filteredPages.map(p => (
                  <div
                    key={p.id}
                    onClick={() => { onNavigate('builder', p.id); onClose(); }}
                    className="p-2.5 rounded-xl bg-slate-950/50 hover:bg-indigo-600/20 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <span className="font-semibold text-white">{p.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">/{p.slug}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {filteredServices.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Practice Services
              </p>
              <div className="space-y-1">
                {filteredServices.map(s => (
                  <div
                    key={s.id}
                    onClick={() => { onNavigate('services', s.id); onClose(); }}
                    className="p-2.5 rounded-xl bg-slate-950/50 hover:bg-emerald-600/20 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <span className="font-semibold text-white block">{s.title}</span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">{s.summary}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">{s.active ? 'Active' : 'Draft'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Industries */}
          {filteredIndustries.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Target Industries
              </p>
              <div className="space-y-1">
                {filteredIndustries.map(i => (
                  <div
                    key={i.id}
                    onClick={() => { onNavigate('industries', i.id); onClose(); }}
                    className="p-2.5 rounded-xl bg-slate-950/50 hover:bg-amber-600/20 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <span className="font-semibold text-white">{i.title}</span>
                    <span className="text-[10px] text-amber-400">{i.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                <CalendarCheck className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Consultations & Leads
              </p>
              <div className="space-y-1">
                {filteredLeads.map(c => (
                  <div
                    key={c.id}
                    onClick={() => { onNavigate('consultations', c.id); onClose(); }}
                    className="p-2.5 rounded-xl bg-slate-950/50 hover:bg-purple-600/20 border border-slate-800/80 hover:border-purple-500/40 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <span className="font-semibold text-white block">{c.fullName} ({c.company || 'Private'})</span>
                      <span className="text-[10px] text-slate-400">{c.serviceSelected} • {c.email}</span>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">{c.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
