import React, { useState, useEffect } from 'react';
import {
  Palette,
  Type,
  Layout,
  Layers,
  Eye,
  RotateCcw,
  Save,
  Globe,
  Sparkles,
  Sun,
  Moon,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  Sliders,
  Paintbrush,
} from 'lucide-react';
import { defaultThemeCustomization } from '../services/api';

const AVAILABLE_FONTS = [
  'DM Sans',
  'Playfair Display',
  'Inter',
  'Poppins',
  'Roboto',
  'Montserrat',
  'Open Sans',
  'Lato',
  'Raleway',
  'Nunito',
  'Plus Jakarta Sans',
];

const THEME_PRESETS = [
  {
    id: 'royal-navy',
    name: 'Royal Navy & Gold',
    colors: {
      primaryColor: '#c8a45e',
      secondaryColor: '#071322',
      accentColor: '#e0c580',
      backgroundColor: '#050e17',
      textColor: '#94a3b8',
      headingColor: '#ffffff',
      buttonColor: '#c8a45e',
      buttonHoverColor: '#b38f4a',
      borderColor: 'rgba(200, 164, 94, 0.2)',
      headerColor: '#071322',
      footerColor: '#030910',
      mode: 'dark',
    },
  },
  {
    id: 'obsidian-dark',
    name: 'Obsidian Platinum',
    colors: {
      primaryColor: '#6366f1',
      secondaryColor: '#0f172a',
      accentColor: '#818cf8',
      backgroundColor: '#020617',
      textColor: '#94a3b8',
      headingColor: '#f8fafc',
      buttonColor: '#6366f1',
      buttonHoverColor: '#4f46e5',
      borderColor: 'rgba(99, 102, 241, 0.2)',
      headerColor: '#0f172a',
      footerColor: '#020617',
      mode: 'dark',
    },
  },
  {
    id: 'emerald-luxe',
    name: 'Emerald & Gold Luxe',
    colors: {
      primaryColor: '#10b981',
      secondaryColor: '#064e3b',
      accentColor: '#34d399',
      backgroundColor: '#022c22',
      textColor: '#a7f3d0',
      headingColor: '#ecfdf5',
      buttonColor: '#10b981',
      buttonHoverColor: '#059669',
      borderColor: 'rgba(16, 185, 129, 0.25)',
      headerColor: '#064e3b',
      footerColor: '#022c22',
      mode: 'dark',
    },
  },
  {
    id: 'crimson-executive',
    name: 'Crimson Executive',
    colors: {
      primaryColor: '#e11d48',
      secondaryColor: '#4c0519',
      accentColor: '#fb7185',
      backgroundColor: '#1f0409',
      textColor: '#fecdd3',
      headingColor: '#fff1f2',
      buttonColor: '#e11d48',
      buttonHoverColor: '#be123c',
      borderColor: 'rgba(225, 29, 72, 0.25)',
      headerColor: '#4c0519',
      footerColor: '#1f0409',
      mode: 'dark',
    },
  },
  {
    id: 'crisp-light',
    name: 'Crisp Corporate Light',
    colors: {
      primaryColor: '#b8860b',
      secondaryColor: '#1e293b',
      accentColor: '#d4af37',
      backgroundColor: '#f8fafc',
      textColor: '#334155',
      headingColor: '#0f172a',
      buttonColor: '#0f172a',
      buttonHoverColor: '#1e293b',
      borderColor: 'rgba(30, 41, 59, 0.15)',
      headerColor: '#ffffff',
      footerColor: '#0f172a',
      mode: 'light',
    },
  },
];

const WEBSITE_PAGES = [
  {
    id: 'home',
    name: 'Home Page',
    path: '/home.html',
    sections: [
      { id: 'sec-hero', name: 'Hero Section' },
      { id: 'sec-services', name: 'Services Overview Section' },
      { id: 'sec-about', name: 'About & Legacy Section' },
      { id: 'sec-why', name: 'Why Choose Us Section' },
      { id: 'sec-experts', name: 'Founders Showcase' },
      { id: 'royal-cta', name: 'Royal Call To Action' },
      { id: 'footer', name: 'Global Footer' },
    ],
  },
  {
    id: 'experts',
    name: 'Our Experts Page',
    path: '/experts.html',
    sections: [
      { id: 'founders-showcase', name: 'Founders Hero Showcase' },
      { id: 'royal-cta', name: 'Royal Call To Action' },
      { id: 'footer', name: 'Global Footer' },
    ],
  },
  {
    id: 'services',
    name: 'Services Directory',
    path: '/services.html',
    sections: [
      { id: 'services-hero', name: 'Services Hero' },
      { id: 'services-grid', name: 'Services Grid' },
      { id: 'royal-cta', name: 'Royal Call To Action' },
      { id: 'footer', name: 'Global Footer' },
    ],
  },
  {
    id: 'why-choose-us',
    name: 'Why Choose Us Page',
    path: '/why-choose-us.html',
    sections: [
      { id: 'wcu-hero', name: 'Philosophy Hero' },
      { id: 'wcu-pillars', name: 'Core Pillars Grid' },
      { id: 'royal-cta', name: 'Royal Call To Action' },
      { id: 'footer', name: 'Global Footer' },
    ],
  },
  {
    id: 'contact',
    name: 'Contact Us Page',
    path: '/contact.html',
    sections: [
      { id: 'contact-hero', name: 'Contact Form & Headquarters' },
      { id: 'footer', name: 'Global Footer' },
    ],
  },
];

export default function ThemeCustomizationView({ initialData, onSave, onPublish }) {
  const [activeSubTab, setActiveSubTab] = useState('global'); // 'global' | 'page' | 'section' | 'preview'
  const [themeData, setThemeData] = useState(() => initialData || defaultThemeCustomization);
  const [selectedPageId, setSelectedPageId] = useState('home');
  const [selectedSectionId, setSelectedSectionId] = useState('sec-hero');
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setThemeData(initialData);
    }
  }, [initialData]);

  const currentPage = WEBSITE_PAGES.find(p => p.id === selectedPageId) || WEBSITE_PAGES[0];
  const currentSection = currentPage.sections.find(s => s.id === selectedSectionId) || currentPage.sections[0];

  // Global Change Handlers
  const handleGlobalChange = (key, value) => {
    setThemeData(prev => ({
      ...prev,
      global: {
        ...prev.global,
        [key]: value,
      },
    }));
  };

  const handleApplyPreset = preset => {
    setThemeData(prev => ({
      ...prev,
      global: {
        ...prev.global,
        ...preset.colors,
        theme: preset.id,
      },
    }));
    setStatusMessage(`Applied preset: ${preset.name}`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Page Level Handlers
  const handlePageChange = (key, value) => {
    setThemeData(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [selectedPageId]: {
          ...(prev.pages?.[selectedPageId] || {}),
          [key]: value,
        },
      },
    }));
  };

  const handleResetPage = () => {
    setThemeData(prev => {
      const nextPages = { ...prev.pages };
      delete nextPages[selectedPageId];
      return { ...prev, pages: nextPages };
    });
    setStatusMessage(`Reset customization for ${currentPage.name}`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Section Level Handlers
  const handleSectionChange = (key, value) => {
    const sectionKey = `${selectedPageId}:${selectedSectionId}`;
    setThemeData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...(prev.sections?.[sectionKey] || {}),
          [key]: value,
        },
      },
    }));
  };

  const handleResetSection = () => {
    const sectionKey = `${selectedPageId}:${selectedSectionId}`;
    setThemeData(prev => {
      const nextSections = { ...prev.sections };
      delete nextSections[sectionKey];
      return { ...prev, sections: nextSections };
    });
    setStatusMessage(`Reset section customization for ${currentSection.name}`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleResetGlobal = () => {
    setThemeData(prev => ({
      ...prev,
      global: { ...defaultThemeCustomization.global },
    }));
    setStatusMessage('Global theme reset to default Royal Navy & Gold');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      if (onSave) await onSave(themeData);
      setStatusMessage('Customization saved to draft successfully!');
    } catch (e) {
      setStatusMessage('Failed to save customization.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handlePublishAll = async () => {
    setIsSaving(true);
    try {
      if (onPublish) await onPublish(themeData);
      else if (onSave) await onSave(themeData);
      setStatusMessage('Customization published live across website!');
    } catch (e) {
      setStatusMessage('Failed to publish customization.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  const currentGlobal = themeData.global || defaultThemeCustomization.global;
  const currentPageCustom = themeData.pages?.[selectedPageId] || {};
  const currentSectionKey = `${selectedPageId}:${selectedSectionId}`;
  const currentSectionCustom = themeData.sections?.[currentSectionKey] || {};

  return (
    <div className="space-y-6">
      {/* Top Header & Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#071322] border border-[#c8a45e]/20 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c8a45e] to-[#967534] flex items-center justify-center text-[#071322] font-black shadow-lg">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center">
              Website Visual Customization Engine
              <span className="ml-3 text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold bg-[#c8a45e]/20 text-[#e0c580] border border-[#c8a45e]/30">
                Add-on Module
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize Global, Page, and Section-level styling with instant real-time inheritance.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-[#0f1d32] hover:bg-[#152540] border border-[#c8a45e]/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 mr-2 text-[#c8a45e]" />
            Save Draft
          </button>
          <button
            onClick={handlePublishAll}
            disabled={isSaving}
            className="flex items-center px-5 py-2.5 rounded-xl font-bold text-xs text-[#071322] bg-gradient-to-r from-[#c8a45e] to-[#e0c580] hover:from-[#e0c580] hover:to-[#c8a45e] shadow-lg shadow-[#c8a45e]/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isSaving ? 'Publishing...' : 'Publish Live Changes'}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-[#0f1d32] border border-[#c8a45e]/40 text-[#e0c580] px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md">
          <span className="flex items-center">
            <Check className="w-4 h-4 mr-2 text-emerald-400" />
            {statusMessage}
          </span>
          <button onClick={() => setStatusMessage('')} className="text-slate-400 hover:text-white">
            ×
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#c8a45e]/20 pb-2">
        <button
          onClick={() => setActiveSubTab('global')}
          className={`flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'global'
              ? 'bg-[#c8a45e] text-[#071322] shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-[#0f1d32]'
          }`}
        >
          <Globe className="w-4 h-4 mr-2" />
          1. Global Website Theme
        </button>

        <button
          onClick={() => setActiveSubTab('page')}
          className={`flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'page'
              ? 'bg-[#c8a45e] text-[#071322] shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-[#0f1d32]'
          }`}
        >
          <Layout className="w-4 h-4 mr-2" />
          2. Page Customization
        </button>

        <button
          onClick={() => setActiveSubTab('section')}
          className={`flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'section'
              ? 'bg-[#c8a45e] text-[#071322] shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-[#0f1d32]'
          }`}
        >
          <Layers className="w-4 h-4 mr-2" />
          3. Section Customization
        </button>

        <button
          onClick={() => setActiveSubTab('preview')}
          className={`flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'preview'
              ? 'bg-[#c8a45e] text-[#071322] shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-[#0f1d32]'
          }`}
        >
          <Eye className="w-4 h-4 mr-2" />
          4. Live Preview & Device View
        </button>
      </div>

      {/* SUB-TAB 1: GLOBAL CUSTOMIZATION */}
      {activeSubTab === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preset Theme Selector */}
          <div className="lg:col-span-1 bg-[#071322] border border-[#c8a45e]/20 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
              <Paintbrush className="w-4 h-4 mr-2 text-[#c8a45e]" />
              Preset Theme Palettes
            </h3>
            <p className="text-xs text-slate-400">
              Select a pre-designed corporate palette or customize individual colors manually.
            </p>

            <div className="space-y-3 pt-2">
              {THEME_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    currentGlobal.theme === preset.id
                      ? 'border-[#c8a45e] bg-[#0f1d32] shadow-md'
                      : 'border-slate-800 bg-[#050e17] hover:border-slate-700'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-white">{preset.name}</p>
                    <div className="flex items-center space-x-1.5 mt-2">
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.colors.primaryColor }}></span>
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.colors.secondaryColor }}></span>
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.colors.backgroundColor }}></span>
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.colors.headingColor }}></span>
                    </div>
                  </div>
                  {currentGlobal.theme === preset.id && (
                    <span className="text-xs font-bold text-[#c8a45e] bg-[#c8a45e]/10 px-2 py-1 rounded-md">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleResetGlobal}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-950/20 hover:bg-rose-900/40 border border-rose-800/40 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Global Theme to Default
              </button>
            </div>
          </div>

          {/* Color & Font Picker Form */}
          <div className="lg:col-span-2 bg-[#071322] border border-[#c8a45e]/20 rounded-2xl p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                <Sliders className="w-4 h-4 mr-2 text-[#c8a45e]" />
                Global Color & Font Controls
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleGlobalChange('mode', currentGlobal.mode === 'dark' ? 'light' : 'dark')}
                  className="flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0f1d32] text-slate-300 border border-[#c8a45e]/30 hover:text-white cursor-pointer"
                >
                  {currentGlobal.mode === 'dark' ? <Moon className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 mr-1.5 text-amber-400" />}
                  {currentGlobal.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </button>
              </div>
            </div>

            {/* Typography Section */}
            <div className="bg-[#050e17] border border-slate-800 rounded-xl p-4 space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <Type className="w-4 h-4 mr-2 text-[#c8a45e]" />
                Global Font Family
              </label>
              <select
                value={currentGlobal.fontFamily || 'DM Sans'}
                onChange={e => handleGlobalChange('fontFamily', e.target.value)}
                className="w-full bg-[#0f1d32] border border-[#c8a45e]/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c8a45e]"
              >
                {AVAILABLE_FONTS.map(font => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorInput label="Primary Color" value={currentGlobal.primaryColor} onChange={v => handleGlobalChange('primaryColor', v)} />
              <ColorInput label="Secondary Color" value={currentGlobal.secondaryColor} onChange={v => handleGlobalChange('secondaryColor', v)} />
              <ColorInput label="Accent Gold Color" value={currentGlobal.accentColor} onChange={v => handleGlobalChange('accentColor', v)} />
              <ColorInput label="Background Color" value={currentGlobal.backgroundColor} onChange={v => handleGlobalChange('backgroundColor', v)} />
              <ColorInput label="Text Color" value={currentGlobal.textColor} onChange={v => handleGlobalChange('textColor', v)} />
              <ColorInput label="Heading Color" value={currentGlobal.headingColor} onChange={v => handleGlobalChange('headingColor', v)} />
              <ColorInput label="Button Color" value={currentGlobal.buttonColor} onChange={v => handleGlobalChange('buttonColor', v)} />
              <ColorInput label="Button Hover Color" value={currentGlobal.buttonHoverColor} onChange={v => handleGlobalChange('buttonHoverColor', v)} />
              <ColorInput label="Border Color" value={currentGlobal.borderColor} onChange={v => handleGlobalChange('borderColor', v)} />
              <ColorInput label="Header Navbar Color" value={currentGlobal.headerColor} onChange={v => handleGlobalChange('headerColor', v)} />
              <ColorInput label="Footer Color" value={currentGlobal.footerColor} onChange={v => handleGlobalChange('footerColor', v)} />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PAGE-LEVEL CUSTOMIZATION */}
      {activeSubTab === 'page' && (
        <div className="bg-[#071322] border border-[#c8a45e]/20 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                <Layout className="w-4 h-4 mr-2 text-[#c8a45e]" />
                Page-Level Customization Override
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Customize styling for a specific page. Settings here override Global settings only for this page.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-slate-300">Select Page:</label>
              <select
                value={selectedPageId}
                onChange={e => setSelectedPageId(e.target.value)}
                className="bg-[#0f1d32] border border-[#c8a45e]/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
              >
                {WEBSITE_PAGES.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleResetPage}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 cursor-pointer flex items-center"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset Page
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <ColorInput label="Page Background Color" value={currentPageCustom.backgroundColor || ''} placeholder="Inherited from Global" onChange={v => handlePageChange('backgroundColor', v)} />
            <ColorInput label="Page Text Color" value={currentPageCustom.textColor || ''} placeholder="Inherited from Global" onChange={v => handlePageChange('textColor', v)} />
            <ColorInput label="Page Heading Color" value={currentPageCustom.headingColor || ''} placeholder="Inherited from Global" onChange={v => handlePageChange('headingColor', v)} />
            <ColorInput label="Page Accent Color" value={currentPageCustom.accentColor || ''} placeholder="Inherited from Global" onChange={v => handlePageChange('accentColor', v)} />
            <ColorInput label="Page Button Color" value={currentPageCustom.buttonColor || ''} placeholder="Inherited from Global" onChange={v => handlePageChange('buttonColor', v)} />
            <ColorInput label="Page Border Color" value={currentPageCustom.borderColor || ''} placeholder="Inherited from Global" onChange={v => handlePageChange('borderColor', v)} />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Page Font Family</label>
              <select
                value={currentPageCustom.fontFamily || ''}
                onChange={e => handlePageChange('fontFamily', e.target.value)}
                className="w-full bg-[#050e17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="">(Inherit from Global Theme)</option>
                {AVAILABLE_FONTS.map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SECTION-LEVEL CUSTOMIZATION */}
      {activeSubTab === 'section' && (
        <div className="bg-[#071322] border border-[#c8a45e]/20 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                <Layers className="w-4 h-4 mr-2 text-[#c8a45e]" />
                Section-Level Independent Customization
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Customize individual sections inside any page. Section settings override Page & Global settings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <label className="text-xs font-bold text-slate-300">Page:</label>
                <select
                  value={selectedPageId}
                  onChange={e => {
                    setSelectedPageId(e.target.value);
                    const p = WEBSITE_PAGES.find(page => page.id === e.target.value);
                    if (p && p.sections.length > 0) setSelectedSectionId(p.sections[0].id);
                  }}
                  className="bg-[#0f1d32] border border-[#c8a45e]/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                >
                  {WEBSITE_PAGES.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-xs font-bold text-slate-300">Section:</label>
                <select
                  value={selectedSectionId}
                  onChange={e => setSelectedSectionId(e.target.value)}
                  className="bg-[#0f1d32] border border-[#c8a45e]/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                >
                  {currentPage.sections.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleResetSection}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 cursor-pointer flex items-center"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset Section
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <ColorInput label="Section Background" value={currentSectionCustom.backgroundColor || ''} placeholder="Inherited from Page / Global" onChange={v => handleSectionChange('backgroundColor', v)} />
            <ColorInput label="Section Text Color" value={currentSectionCustom.textColor || ''} placeholder="Inherited from Page / Global" onChange={v => handleSectionChange('textColor', v)} />
            <ColorInput label="Section Heading Color" value={currentSectionCustom.headingColor || ''} placeholder="Inherited from Page / Global" onChange={v => handleSectionChange('headingColor', v)} />
            <ColorInput label="Section Accent Color" value={currentSectionCustom.accentColor || ''} placeholder="Inherited from Page / Global" onChange={v => handleSectionChange('accentColor', v)} />
            <ColorInput label="Section Button Color" value={currentSectionCustom.buttonColor || ''} placeholder="Inherited from Page / Global" onChange={v => handleSectionChange('buttonColor', v)} />
            <ColorInput label="Section Border Color" value={currentSectionCustom.borderColor || ''} placeholder="Inherited from Page / Global" onChange={v => handleSectionChange('borderColor', v)} />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Section Font Family</label>
              <select
                value={currentSectionCustom.fontFamily || ''}
                onChange={e => handleSectionChange('fontFamily', e.target.value)}
                className="w-full bg-[#050e17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="">(Inherit from Page / Global)</option>
                {AVAILABLE_FONTS.map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LIVE PREVIEW & DEVICE VIEW */}
      {(activeSubTab === 'preview' || activeSubTab === 'global' || activeSubTab === 'page' || activeSubTab === 'section') && (
        <div className="bg-[#071322] border border-[#c8a45e]/20 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
              <Eye className="w-4 h-4 mr-2 text-[#c8a45e]" />
              Live Preview & Real-Time Render
            </h3>

            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-[#050e17] p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${previewDevice === 'desktop' ? 'bg-[#c8a45e] text-[#071322] font-bold' : 'text-slate-400 hover:text-white'}`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${previewDevice === 'tablet' ? 'bg-[#c8a45e] text-[#071322] font-bold' : 'text-slate-400 hover:text-white'}`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${previewDevice === 'mobile' ? 'bg-[#c8a45e] text-[#071322] font-bold' : 'text-slate-400 hover:text-white'}`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <select
                value={selectedPageId}
                onChange={e => setSelectedPageId(e.target.value)}
                className="bg-[#0f1d32] border border-[#c8a45e]/40 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
              >
                {WEBSITE_PAGES.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Iframe Preview Container */}
          <div className="flex justify-center bg-[#020617] rounded-xl p-4 border border-slate-800 overflow-hidden min-h-[500px]">
            <div
              className={`transition-all duration-300 w-full bg-white rounded-lg overflow-hidden shadow-2xl ${
                previewDevice === 'mobile' ? 'max-w-[375px] h-[667px]' : previewDevice === 'tablet' ? 'max-w-[768px] h-[700px]' : 'max-w-full h-[650px]'
              }`}
            >
              <iframe
                key={`${currentPage.path}-${JSON.stringify(themeData)}`}
                src={currentPage.path}
                title="Live Website Customization Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Color Input Control
function ColorInput({ label, value, onChange, placeholder = '#000000' }) {
  return (
    <div className="space-y-1.5 bg-[#050e17] p-3 rounded-xl border border-slate-800">
      <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
        <span>{label}</span>
        {value && <span className="text-[10px] text-[#c8a45e] font-mono">{value}</span>}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value && value.startsWith('#') ? value : '#c8a45e'}
          onChange={e => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer shrink-0"
        />
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-[#0f1d32] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#c8a45e]"
        />
      </div>
    </div>
  );
}
