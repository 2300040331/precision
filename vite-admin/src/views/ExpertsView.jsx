import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Globe,
  Upload,
  Image as ImageIcon,
  Check,
  Award,
  Palette,
  Eye,
  EyeOff,
  ChevronDown,
  RotateCcw,
  RotateCw,
  X,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

const ImageDropzone = ({ value, onChange, label = 'Profile Picture' }) => {
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
          isDragging ? 'border-amber-400 bg-amber-500/10' : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
        }`}
      >
        {value ? (
          <div className="relative w-full group">
            <img src={value} alt="Profile preview" className="h-48 w-full object-cover rounded-xl border border-slate-800 shadow-md" />
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
          <label className="w-full py-6 flex flex-col items-center justify-center cursor-pointer space-y-2">
            <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Drag & drop profile photo here</p>
              <p className="text-[11px] text-slate-400 mt-0.5">or <span className="text-amber-400 font-semibold underline">click to select file</span></p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        )}
      </div>
    </div>
  );
};

export default function ExpertsView({ experts: initialExperts, pageHeader: initialPageHeader, onSave }) {
  const defaultExperts = [
    {
      id: 1,
      name: 'Robert Jenkins',
      role: 'Managing Partner',
      qualifications: 'FCA, CFA',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop',
      summary: 'Robert Jenkins brings 25+ Years Experience of extensive experience in strategic advisory. A visionary approach has helped steer top-tier multinational corporations through rigorous landscapes while optimizing strategies.',
      expertise: 'Strategic Advisory, Corporate Governance, Financial Modeling.',
      memberships: 'Fellow of Professional Institutes.',
      industries: 'Financial Services, Technology, Manufacturing.',
      active: true,
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      role: 'Partner, Tax Advisory',
      qualifications: 'FCA, CPA',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
      summary: 'Sarah Mitchell specializes in direct and international tax advisory, transfer pricing, and cross-border M&A tax structuring for Fortune 500 corporations.',
      expertise: 'Direct Taxation, Transfer Pricing, Cross-Border M&A.',
      memberships: 'Member of International Tax Association.',
      industries: 'Healthcare, Real Estate, E-Commerce.',
      active: true,
    },
    {
      id: 3,
      name: 'Michael Chang',
      role: 'Director, Risk Advisory',
      qualifications: 'CPA, CISA',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop',
      summary: 'Michael Chang leads our internal audit and cybersecurity risk practice, ensuring enterprise resilience and stringent internal controls.',
      expertise: 'Internal Audit, Information Systems Audit, SOC Compliance.',
      memberships: 'ISACA Certified Information Systems Auditor.',
      industries: 'Banking & Finance, IT & Fintech.',
      active: true,
    },
    {
      id: 4,
      name: 'Elena Rodriguez',
      role: 'Director, Wealth Advisory',
      qualifications: 'CFP, MBA',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1200&auto=format&fit=crop',
      summary: 'Elena Rodriguez manages family office wealth advisory, estate planning, and multi-asset capital allocation for high-net-worth individuals.',
      expertise: 'Wealth Management, Estate Planning, Family Office Structuring.',
      memberships: 'Certified Financial Planner Board Member.',
      industries: 'Private Equity, Real Estate, Family Offices.',
      active: true,
    },
    {
      id: 5,
      name: 'David O\'Connor',
      role: 'Partner, Audit',
      qualifications: 'FCA, B.Com',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop',
      summary: 'David O\'Connor oversees statutory audits, GAAP conversions, and regulatory reporting for listed corporations and public sector enterprises.',
      expertise: 'Statutory Audit, GAAP/Ind AS Reporting, Forensic Auditing.',
      memberships: 'Fellow Member of ICAI.',
      industries: 'Manufacturing, Energy, Infrastructure.',
      active: true,
    },
    {
      id: 6,
      name: 'Anita Desai',
      role: 'Head of Corporate Law',
      qualifications: 'LLB, FCS',
      image: 'https://images.unsplash.com/photo-1598550874175-4d0ef43cb852?q=80&w=1200&auto=format&fit=crop',
      summary: 'Anita Desai leads company law compliance, ROC filings, board secretarial advisory, and corporate governance for emerging and established enterprises.',
      expertise: 'Company Law, ROC Governance, SEBI & NCLT Compliance.',
      memberships: 'Fellow Member of ICSI.',
      industries: 'Startups, Corporate Law, Governance.',
      active: true,
    },
  ];

  const [expertsList, setExpertsList] = useState(
    Array.isArray(initialExperts) && initialExperts.length > 0 ? initialExperts : defaultExperts
  );

  const [pageHeader, setPageHeader] = useState(
    initialPageHeader && initialPageHeader.title ? initialPageHeader : {
      title: 'Our Experts',
      subtitle: 'The best industry experts will share their experience and talk about their projects.',
    }
  );

  const [search, setSearch] = useState('');
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  const filtered = expertsList.filter(exp =>
    exp.name.toLowerCase().includes(search.toLowerCase()) ||
    exp.role.toLowerCase().includes(search.toLowerCase())
  );

  const triggerSave = (updatedList = expertsList, updatedHeader = pageHeader) => {
    if (onSave) {
      onSave(updatedList, updatedHeader);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleUpdate = (updatedItem) => {
    const next = expertsList.map(e => e.id === updatedItem.id ? updatedItem : e);
    setExpertsList(next);
    triggerSave(next, pageHeader);
  };

  const handleAdd = () => {
    const newId = Date.now();
    const newExpert = {
      id: newId,
      name: 'New Industry Expert',
      role: 'Partner, Financial Advisory',
      qualifications: 'FCA',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop',
      summary: 'Experienced partner providing strategic leadership and financial clarity.',
      expertise: 'Audit, Tax Advisory, Strategic Consulting.',
      memberships: 'Institute Member.',
      industries: 'Corporate & Technology.',
      active: true,
    };
    const next = [newExpert, ...expertsList];
    setExpertsList(next);
    setSelectedExpert(newExpert);
    triggerSave(next, pageHeader);
  };

  const handleDelete = (id) => {
    const next = expertsList.filter(e => e.id !== id);
    setExpertsList(next);
    if (selectedExpert?.id === id) setSelectedExpert(null);
    triggerSave(next, pageHeader);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Our Experts Page Manager</h1>
            <p className="text-slate-400 text-xs">Manage leadership team profiles, pictures, roles, and expertise details matching <code className="text-amber-400">experts.html</code>.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://precision-henna.vercel.app/experts.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
          >
            <Globe className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> View Live Web Page
          </a>

          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold shadow transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add New Expert
          </button>

          <button
            onClick={() => triggerSave()}
            className="flex items-center px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all border border-amber-400/40"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            {saved ? 'Changes Saved Live!' : 'Save Experts Page'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center justify-between animate-fade-in">
          <span className="flex items-center"><Check className="w-4 h-4 mr-2 text-emerald-400" /> All edits saved! Directly reflected on the main website (experts.html).</span>
          <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-2 py-0.5 rounded-full">Live Synced</span>
        </div>
      )}

      {/* Page Header Editor */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Page Header Settings</h2>
          <button
            onClick={() => triggerSave()}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-extrabold shadow"
          >
            Save Header Text
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Page Heading</label>
            <input
              type="text"
              value={pageHeader.title}
              onChange={(e) => {
                const nextHeader = { ...pageHeader, title: e.target.value };
                setPageHeader(nextHeader);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Page Subtitle</label>
            <input
              type="text"
              value={pageHeader.subtitle}
              onChange={(e) => {
                const nextHeader = { ...pageHeader, subtitle: e.target.value };
                setPageHeader(nextHeader);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Search & Grid */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experts by name or role..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <span className="text-xs font-mono text-slate-400">{filtered.length} Experts Listed</span>
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(expert => (
          <div key={expert.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="relative group">
                <img src={expert.image} alt={expert.name} className="h-56 w-full object-cover rounded-xl border border-slate-800" />
                <div className="absolute top-2 right-2 flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${expert.active ? 'bg-emerald-500/80 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {expert.active ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{expert.name}</h3>
                <p className="text-xs text-amber-400 font-semibold">{expert.role}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{expert.qualifications}</p>
              </div>

              <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed">{expert.summary}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <button
                onClick={() => setSelectedExpert(expert)}
                className="flex items-center px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow transition-all"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Profile & Photo
              </button>
              <button
                onClick={() => handleDelete(expert.id)}
                className="p-2 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-xl transition-all"
                title="Delete Expert"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Single Expert Drawer Editor */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h2 className="text-sm font-bold text-white flex items-center">
                <Users className="w-4 h-4 mr-2 text-amber-400" /> Edit Expert Profile — {selectedExpert.name}
              </h2>
              <button onClick={() => setSelectedExpert(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
              <ImageDropzone
                value={selectedExpert.image}
                onChange={(newImg) => {
                  const updated = { ...selectedExpert, image: newImg };
                  setSelectedExpert(updated);
                  handleUpdate(updated);
                }}
                label="Expert Profile Photo (Uploaded directly to site)"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    value={selectedExpert.name}
                    onChange={(e) => {
                      const updated = { ...selectedExpert, name: e.target.value };
                      setSelectedExpert(updated);
                      handleUpdate(updated);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Role / Designation *</label>
                  <input
                    type="text"
                    value={selectedExpert.role}
                    onChange={(e) => {
                      const updated = { ...selectedExpert, role: e.target.value };
                      setSelectedExpert(updated);
                      handleUpdate(updated);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Qualifications & Degrees</label>
                <input
                  type="text"
                  value={selectedExpert.qualifications}
                  onChange={(e) => {
                    const updated = { ...selectedExpert, qualifications: e.target.value };
                    setSelectedExpert(updated);
                    handleUpdate(updated);
                  }}
                  placeholder="e.g. FCA, CFA, CPA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Professional Summary</label>
                <textarea
                  rows={3}
                  value={selectedExpert.summary}
                  onChange={(e) => {
                    const updated = { ...selectedExpert, summary: e.target.value };
                    setSelectedExpert(updated);
                    handleUpdate(updated);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Core Expertise</label>
                  <input
                    type="text"
                    value={selectedExpert.expertise}
                    onChange={(e) => {
                      const updated = { ...selectedExpert, expertise: e.target.value };
                      setSelectedExpert(updated);
                      handleUpdate(updated);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Industries Served</label>
                  <input
                    type="text"
                    value={selectedExpert.industries}
                    onChange={(e) => {
                      const updated = { ...selectedExpert, industries: e.target.value };
                      setSelectedExpert(updated);
                      handleUpdate(updated);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <label className="flex items-center space-x-2 text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedExpert.active}
                    onChange={(e) => {
                      const updated = { ...selectedExpert, active: e.target.checked };
                      setSelectedExpert(updated);
                      handleUpdate(updated);
                    }}
                    className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Publish Profile Live</span>
                </label>

                <button
                  onClick={() => setSelectedExpert(null)}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow"
                >
                  Done Editing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
