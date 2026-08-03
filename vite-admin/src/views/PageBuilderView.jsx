import React, { useState, useEffect } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  ChevronRight,
  FileCode,
  Globe,
  RotateCcw,
} from 'lucide-react';
import LiveDeviceFrame from '../components/LiveDeviceFrame';

export default function PageBuilderView({ pages, onSaveSection, onAddSection, onDeleteSection, onReorderSections, onPublishPage, onResetPageSections }) {
  const [selectedPageId, setSelectedPageId] = useState('home');
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [editingSection, setEditingSection] = useState(null);
  const [sectionData, setSectionData] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentPage = pages.find(p => p.id === selectedPageId) || pages[0] || { id: 'home', title: 'Home Page', sections: [] };

  useEffect(() => {
    if (currentPage && currentPage.sections && currentPage.sections.length > 0) {
      const first = currentPage.sections[0];
      setEditingSection(first);
      try {
        setSectionData(JSON.parse(first.content || '{}'));
      } catch (e) {
        setSectionData({});
      }
    } else {
      setEditingSection(null);
      setSectionData({});
    }
  }, [selectedPageId, pages]);

  const handleSelectSection = (sec) => {
    setEditingSection(sec);
    try {
      setSectionData(JSON.parse(sec.content || '{}'));
    } catch (e) {
      setSectionData({});
    }
  };

  const handleFieldChange = (key, value) => {
    setSectionData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!editingSection) return;
    setSaving(true);
    try {
      await onSaveSection(editingSection.id, {
        name: editingSection.name,
        visible: editingSection.visible,
        order: editingSection.order,
        content: sectionData,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      alert('Failed to save section: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const ids = currentPage.sections.map(s => s.id);
    const temp = ids[index];
    ids[index] = ids[index - 1];
    ids[index - 1] = temp;
    onReorderSections(currentPage.id, ids);
  };

  const handleMoveDown = (index) => {
    if (index === currentPage.sections.length - 1) return;
    const ids = currentPage.sections.map(s => s.id);
    const temp = ids[index];
    ids[index] = ids[index + 1];
    ids[index + 1] = temp;
    onReorderSections(currentPage.id, ids);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#c8a45e]/10 rounded-xl border border-[#c8a45e]/20 text-[#c8a45e]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Home Page Visual Builder</h1>
            <p className="text-slate-400 text-xs">Customize and manage all sections of the live Home Page (<code className="text-[#c8a45e] font-mono">home.html</code>).</p>
          </div>
        </div>

        {/* Home Page Active Badge */}
        <div className="flex items-center space-x-2">
          <span className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#c8a45e]/20 text-[#c8a45e] border border-[#c8a45e]/30 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            Home Page (<code className="font-mono">home.html</code>)
          </span>
        </div>
      </div>

      {/* Mode Toggle: Visual Editor vs Live Device Preview */}
      <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Visual Section Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Responsive Simulator
          </button>
        </div>

        <button
          onClick={() => onPublishPage(currentPage.id)}
          className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all border border-emerald-400/30"
        >
          <Globe className="w-3.5 h-3.5 mr-1.5" /> Publish Page Changes
        </button>
      </div>

      {/* TAB CONTENT: Preview Mode */}
      {activeTab === 'preview' ? (
        <LiveDeviceFrame pageSlug={currentPage.id} keyValData={sectionData} />
      ) : (
        /* TAB CONTENT: Editor Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section List (Left Column - 4 cols) */}
          <div className="lg:col-span-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Page Sections ({currentPage.sections?.length || 0})</span>
              <div className="flex items-center space-x-1.5">
                {onResetPageSections && (
                  <button
                    onClick={() => {
                      if (confirm('Restore all 10 default sections for this page?')) {
                        onResetPageSections(currentPage.id);
                      }
                    }}
                    className="flex items-center px-2 py-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-lg text-[11px] font-semibold border border-amber-500/30"
                    title="Restore all default sections"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" /> Restore 10
                  </button>
                )}
                <button
                  onClick={() => {
                    const name = prompt('Enter new section title:');
                    if (name) onAddSection(currentPage.id, { name, type: 'custom', content: { title: name } });
                  }}
                  className="flex items-center px-2.5 py-1 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 rounded-lg text-xs font-semibold border border-indigo-500/30"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {currentPage.sections?.map((sec, idx) => {
                const isSelected = editingSection?.id === sec.id;
                return (
                  <div
                    key={sec.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div
                      onClick={() => handleSelectSection(sec)}
                      className="flex items-center space-x-2.5 cursor-pointer flex-1 min-w-0 mr-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className={`text-xs font-semibold truncate ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                        {sec.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === currentPage.sections.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSection(sec.id)}
                        className="p-1 text-slate-400 hover:text-red-400"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Inspector & Field Controls (Right Column - 8 cols) */}
          <div className="lg:col-span-8 bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 shadow-xl space-y-6">
            {editingSection ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-white">{editingSection.name} Inspector</h2>
                    <span className="text-[10px] text-indigo-400 font-mono">Type: {editingSection.type}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all border border-indigo-400/30"
                    >
                      {savedSuccess ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-300" /> Saved!
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1.5" /> {saving ? 'Saving...' : 'Save Section'}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Dynamic Key-Value Inputs */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                  {Object.keys(sectionData).length === 0 ? (
                    <p className="text-slate-500 text-xs italic">No editable fields in this section.</p>
                  ) : (
                    Object.entries(sectionData).map(([key, val]) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 capitalize tracking-wide flex items-center justify-between">
                          <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{key}</span>
                        </label>
                        {key.toLowerCase().includes('image') || key.toLowerCase().includes('img') || key.toLowerCase().includes('bg') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('photo') ? (
                          <div className="space-y-2">
                            {val && (
                              <div className="w-full h-24 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center relative group">
                                <img src={val} alt="Section Media Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md rounded text-[10px] text-slate-300 font-mono">Image Preview</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => handleFieldChange(key, e.target.value)}
                                placeholder="Image URL (e.g. assets/images/hero-bg.jpg)"
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                              />
                            </div>
                          </div>
                        ) : key.toLowerCase().includes('text') || key.toLowerCase().includes('desc') || key.toLowerCase().includes('mission') || key.toLowerCase().includes('vision') || key.toLowerCase().includes('content') || key.toLowerCase().includes('address') || key.toLowerCase().includes('quote') ? (
                          <textarea
                            rows={3}
                            value={val}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                          />
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                          />
                        )}
                      </div>
                    ))
                  )}

                  {/* Add New Custom Field */}
                  <button
                    onClick={() => {
                      const fieldKey = prompt('Enter field key name (e.g. heroTitle, ctaText):');
                      if (fieldKey) handleFieldChange(fieldKey, '');
                    }}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-dashed border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Add New Field Parameter
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Layers className="w-12 h-12 stroke-[1] mb-3 text-slate-700" />
                <p className="text-xs">Select a section from the left panel to begin editing.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
